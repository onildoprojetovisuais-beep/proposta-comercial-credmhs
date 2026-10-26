import { FunctionsHttpError } from '@supabase/supabase-js';
import { getSupabase } from './client';
import { PanelError, toPanelError } from './panel';

/**
 * Aba "Equipe" do painel (dono: painel). Só para contas em `public.panel_admins`.
 * Leitura: RPC `admin_list_executives` (recusa quem não é admin).
 * Ações com convite/bloqueio de login: Edge Function `painel-admin` (service_role no servidor).
 */

export type AccessStatus = 'sem-acesso' | 'convite-pendente' | 'ativo' | 'bloqueado';

export interface TeamMember {
  id: string;
  slug: string;
  is_active: boolean;
  is_default: boolean;
  full_name: string;
  display_name: string;
  role: string;
  contact_email: string;
  photo_path: string | null;
  updated_at: string;
  is_self: boolean;
  login_email: string | null;
  access_status: AccessStatus;
}

export interface NewMember {
  full_name: string;
  display_name: string;
  role: string;
  contact_email: string;
  phone_display: string;
  phone_e164: string;
}

/** Códigos devolvidos pela Edge Function (supabase/functions/painel-admin). */
type AdminErrorCode =
  | 'unauthenticated'
  | 'forbidden'
  | 'invalid'
  | 'slug-taken'
  | 'email-taken'
  | 'not-found'
  | 'already-linked'
  | 'no-login'
  | 'protected'
  | 'rate-limit'
  | 'server';

const ADMIN_MESSAGES: Record<AdminErrorCode, string> = {
  unauthenticated: 'Sua sessão expirou. Entre de novo para continuar.',
  forbidden: 'Esta área é só para a administração da CRED MHS.',
  invalid: 'Algum campo não foi aceito. Revise os dados e tente de novo.',
  'slug-taken': 'Já existe uma pessoa com este link. Ajuste o final do link (por exemplo, acrescente o sobrenome).',
  'email-taken': 'Este e-mail de acesso já está em uso no painel. Use outro e-mail ou fale com o suporte.',
  'not-found': 'Não encontramos este perfil. Atualize a lista e tente de novo.',
  'already-linked': 'Este perfil já tem acesso. Use “Reenviar convite”.',
  'no-login': 'Este perfil ainda não tem acesso. Use “Enviar convite”.',
  protected: '',
  'rate-limit': 'Muitos e-mails enviados em pouco tempo. Aguarde alguns minutos e tente de novo.',
  server: 'Não foi possível concluir agora. Tente de novo em instantes.',
};

function requireClient() {
  const supabase = getSupabase();
  if (!supabase) throw new PanelError('not-configured', 'O painel ainda não está configurado.');
  return supabase;
}

/** A conta logada é administradora? Falha de rede ou função ausente contam como "não". */
export async function isPanelAdmin(): Promise<boolean> {
  const supabase = getSupabase();
  if (!supabase) return false;
  try {
    const { data, error } = await supabase.rpc('is_panel_admin');
    return !error && data === true;
  } catch {
    return false;
  }
}

export async function listTeam(): Promise<TeamMember[]> {
  const supabase = requireClient();
  try {
    const { data, error } = await supabase.rpc('admin_list_executives');
    if (error) throw error;
    return (data ?? []) as TeamMember[];
  } catch (error) {
    throw toPanelError(error, 'listTeam');
  }
}

async function call<T>(body: Record<string, unknown>): Promise<T> {
  const supabase = requireClient();
  const { data, error } = await supabase.functions.invoke<T>('painel-admin', {
    body: { ...body, redirect_to: window.location.origin },
  });
  if (!error) return data as T;
  if (error instanceof FunctionsHttpError) {
    let payload: { error?: AdminErrorCode; message?: string } = {};
    try {
      payload = await (error.context as Response).json();
    } catch {
      /* corpo não-JSON: cai no genérico */
    }
    const code = payload.error ?? 'server';
    if (code === 'unauthenticated') throw new PanelError('session-expired', ADMIN_MESSAGES.unauthenticated);
    if (code === 'forbidden') throw new PanelError('permission', ADMIN_MESSAGES.forbidden);
    if (code === 'rate-limit') throw new PanelError('rate-limit', ADMIN_MESSAGES['rate-limit']);
    // 'protected' traz a explicação específica do servidor (perfil padrão / próprio perfil).
    const message = code === 'protected' ? payload.message ?? ADMIN_MESSAGES.server : ADMIN_MESSAGES[code] ?? ADMIN_MESSAGES.server;
    throw new PanelError(code === 'invalid' ? 'validation' : 'unknown', message);
  }
  throw toPanelError(error, 'painel-admin');
}

export function createMember(profile: NewMember, slug: string, loginEmail: string) {
  return call<{ id: string; slug: string }>({ action: 'create', profile, slug, login_email: loginEmail });
}

export function inviteMember(executiveId: string, loginEmail: string) {
  return call<{ id: string }>({ action: 'invite', executive_id: executiveId, login_email: loginEmail });
}

export function resendAccess(executiveId: string) {
  return call<{ sent: 'invite' | 'recovery' }>({ action: 'resend', executive_id: executiveId });
}

export function setMemberActive(executiveId: string, active: boolean) {
  return call<{ id: string; is_active: boolean }>({ action: 'set-active', executive_id: executiveId, active });
}

/** Sugestão de link a partir do nome: "Ana Lúcia Souza" → "ana-lucia-souza". */
export function slugFromName(name: string): string {
  return name
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 64)
    .replace(/-+$/g, '');
}
