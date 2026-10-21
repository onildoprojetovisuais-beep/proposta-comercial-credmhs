import type { AuthError, Session } from '@supabase/supabase-js';
import { getSupabase } from './client';
import { EXECUTIVE_EDITABLE_COLUMNS } from './types';
import type { ExecutiveRow, ExecutiveUpdate } from './types';

/**
 * Acesso a dados do PAINEL do executivo (dono: painel).
 * Usa só a chave pública (anon). O que cada usuário pode ler e alterar é decidido pela RLS:
 * a própria linha de `public.executives` (user_id = auth.uid()) e só as colunas editáveis.
 * Nada aqui registra senha, token ou sessão no console.
 */

const TABLE = 'executives';

/** Colunas lidas pelo painel (a linha do próprio executivo). */
const OWN_COLUMNS =
  'id,user_id,slug,is_active,is_default,full_name,display_name,role,contact_email,phone_display,phone_e164,photo_path,photo_width,photo_height,linkedin_url,website_url,created_at,updated_at';

/** Erro do painel já classificado. `message` é sempre pt-BR e seguro para exibir. */
export class PanelError extends Error {
  readonly kind: PanelErrorKind;
  constructor(kind: PanelErrorKind, message: string) {
    super(message);
    this.name = 'PanelError';
    this.kind = kind;
  }
}

export type PanelErrorKind =
  | 'not-configured'
  | 'invalid-credentials'
  | 'email-not-confirmed'
  | 'network'
  | 'rate-limit'
  | 'weak-password'
  | 'same-password'
  | 'session-expired'
  | 'link-invalid'
  | 'not-found'
  | 'permission'
  | 'validation'
  | 'unknown';

const MESSAGES: Record<PanelErrorKind, string> = {
  'not-configured': 'O painel ainda não está configurado.',
  'invalid-credentials': 'E-mail ou senha incorretos. Confira os dados e tente de novo.',
  'email-not-confirmed': 'Este acesso ainda não foi confirmado. Use o link do convite enviado por e-mail.',
  network: 'Não foi possível conectar. Verifique sua internet e tente de novo.',
  'rate-limit': 'Muitas tentativas em pouco tempo. Aguarde alguns minutos e tente de novo.',
  'weak-password': 'Essa senha é fraca demais. Use pelo menos 8 caracteres, misturando letras e números.',
  'same-password': 'A nova senha precisa ser diferente da atual.',
  'session-expired': 'Sua sessão expirou. Entre de novo para continuar.',
  'link-invalid': 'Este link expirou ou já foi usado. Peça um novo link em “Esqueci minha senha” ou à administração.',
  'not-found': 'Não encontramos o seu perfil. Fale com a administração da CRED MHS.',
  permission: 'Você não tem permissão para esta alteração. Fale com a administração.',
  validation: 'Algum campo não foi aceito. Revise os dados e tente de novo.',
  unknown: 'Algo deu errado. Tente de novo em instantes.',
};

export function panelMessage(kind: PanelErrorKind): string {
  return MESSAGES[kind];
}

function devLog(context: string, error: unknown): void {
  if (import.meta.env.DEV) {
    // Só em desenvolvimento, e só o erro técnico (nunca credenciais).
    console.warn(`[painel] ${context}`, error);
  }
}

interface ErrorLike {
  name?: string;
  message?: string;
  code?: string | number;
  status?: number;
}

/** Converte erros do Supabase (Auth, PostgREST, Storage, rede) em PanelError pt-BR. */
export function toPanelError(error: unknown, context = 'erro'): PanelError {
  if (error instanceof PanelError) return error;
  devLog(context, error);
  const e = (error ?? {}) as ErrorLike;
  const code = String(e.code ?? '');
  const status = typeof e.status === 'number' ? e.status : Number((e as { statusCode?: string }).statusCode ?? NaN);
  const msg = (e.message ?? '').toLowerCase();
  const name = e.name ?? '';

  let kind: PanelErrorKind = 'unknown';
  if (name === 'AuthRetryableFetchError' || msg.includes('failed to fetch') || msg.includes('networkerror') || msg.includes('load failed')) {
    kind = 'network';
  } else if (code === 'invalid_credentials' || msg.includes('invalid login credentials')) {
    kind = 'invalid-credentials';
  } else if (code === 'email_not_confirmed' || msg.includes('email not confirmed')) {
    kind = 'email-not-confirmed';
  } else if (status === 429 || code.startsWith('over_') || msg.includes('rate limit')) {
    kind = 'rate-limit';
  } else if (code === 'weak_password') {
    kind = 'weak-password';
  } else if (code === 'same_password') {
    kind = 'same-password';
  } else if (code === 'otp_expired' || code === 'flow_state_expired' || code === 'flow_state_not_found' || code === 'bad_code_verifier' || name === 'AuthPKCEGrantCodeExchangeError' || name === 'AuthImplicitGrantRedirectError') {
    kind = 'link-invalid';
  } else if (code === 'session_not_found' || code === 'refresh_token_not_found' || code === 'bad_jwt' || code === 'PGRST301' || name === 'AuthSessionMissingError' || status === 401) {
    kind = 'session-expired';
  } else if (code === '42501' || status === 403) {
    kind = 'permission';
  } else if (code === '23514' || code === '22001' || code === '23502' || code === 'PGRST204' || status === 400 || status === 422) {
    kind = 'validation';
  }
  return new PanelError(kind, MESSAGES[kind]);
}

function requireClient() {
  const supabase = getSupabase();
  if (!supabase) throw new PanelError('not-configured', MESSAGES['not-configured']);
  return supabase;
}

/* ---------------- Autenticação ---------------- */

export async function signIn(email: string, password: string): Promise<Session> {
  const supabase = requireClient();
  let result;
  try {
    result = await supabase.auth.signInWithPassword({ email: email.trim(), password });
  } catch (error) {
    throw toPanelError(error, 'signIn');
  }
  if (result.error || !result.data.session) throw toPanelError(result.error, 'signIn');
  return result.data.session;
}

export async function signOut(): Promise<void> {
  const supabase = getSupabase();
  if (!supabase) return;
  try {
    // scope 'local': sai neste navegador mesmo se a rede falhar.
    const { error } = await supabase.auth.signOut({ scope: 'local' });
    if (error) devLog('signOut', error);
  } catch (error) {
    devLog('signOut', error);
  }
}

/**
 * Pede o e-mail de redefinição. Para não revelar se o e-mail existe, só rede e limite de
 * tentativas viram erro; qualquer outra resposta é tratada como envio.
 */
export async function sendPasswordReset(email: string): Promise<void> {
  const supabase = requireClient();
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/painel/`,
    });
    if (error) {
      const mapped = toPanelError(error, 'sendPasswordReset');
      if (mapped.kind === 'network' || mapped.kind === 'rate-limit') throw mapped;
    }
  } catch (error) {
    const mapped = toPanelError(error, 'sendPasswordReset');
    if (mapped.kind === 'network' || mapped.kind === 'rate-limit') throw mapped;
  }
}

export async function updatePassword(password: string): Promise<void> {
  const supabase = requireClient();
  let error: AuthError | null = null;
  try {
    ({ error } = await supabase.auth.updateUser({ password }));
  } catch (e) {
    throw toPanelError(e, 'updatePassword');
  }
  if (error) throw toPanelError(error, 'updatePassword');
}

/** Link com `token_hash` (modelo de e-mail recomendado para PKCE): troca o token por sessão. */
export async function verifyEmailLink(tokenHash: string, type: 'invite' | 'recovery'): Promise<Session> {
  const supabase = requireClient();
  try {
    const { data, error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type });
    if (error || !data.session) throw error ?? new Error('sem sessão');
    return data.session;
  } catch (error) {
    const mapped = toPanelError(error, 'verifyEmailLink');
    throw mapped.kind === 'network' || mapped.kind === 'rate-limit' ? mapped : new PanelError('link-invalid', MESSAGES['link-invalid']);
  }
}

/** Link no formato antigo (tokens no fragmento `#access_token=…`), que o cliente PKCE recusa. */
export async function adoptSessionTokens(accessToken: string, refreshToken: string): Promise<Session> {
  const supabase = requireClient();
  try {
    const { data, error } = await supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken });
    if (error || !data.session) throw error ?? new Error('sem sessão');
    return data.session;
  } catch (error) {
    const mapped = toPanelError(error, 'adoptSessionTokens');
    throw mapped.kind === 'network' ? mapped : new PanelError('link-invalid', MESSAGES['link-invalid']);
  }
}

/* ---------------- Perfil ---------------- */

/** A própria linha (null = conta sem perfil vinculado). */
export async function getOwnProfile(): Promise<ExecutiveRow | null> {
  const supabase = requireClient();
  const { data: sessionData } = await supabase.auth.getSession();
  const userId = sessionData.session?.user.id;
  if (!userId) throw new PanelError('session-expired', MESSAGES['session-expired']);
  try {
    const { data, error } = await supabase.from(TABLE).select(OWN_COLUMNS).eq('user_id', userId).maybeSingle();
    if (error) throw error;
    return (data as ExecutiveRow | null) ?? null;
  } catch (error) {
    throw toPanelError(error, 'getOwnProfile');
  }
}

/** Mantém só as colunas editáveis (defesa extra; o GRANT do banco também limita). */
export function pickEditable(update: ExecutiveUpdate): ExecutiveUpdate {
  const out: Record<string, unknown> = {};
  for (const column of EXECUTIVE_EDITABLE_COLUMNS) {
    if (Object.prototype.hasOwnProperty.call(update, column) && update[column] !== undefined) {
      out[column] = update[column];
    }
  }
  return out as ExecutiveUpdate;
}

/**
 * Atualiza a própria linha. Envia SÓ colunas editáveis e filtra por id E user_id.
 * Retorna a linha salva; 0 linhas afetadas vira erro de permissão.
 */
export async function updateOwnProfile(profileId: string, update: ExecutiveUpdate): Promise<ExecutiveRow> {
  const supabase = requireClient();
  const payload = pickEditable(update);
  if (Object.keys(payload).length === 0) throw new PanelError('validation', MESSAGES.validation);
  const { data: sessionData } = await supabase.auth.getSession();
  const userId = sessionData.session?.user.id;
  if (!userId) throw new PanelError('session-expired', MESSAGES['session-expired']);
  try {
    const { data, error } = await supabase
      .from(TABLE)
      .update(payload)
      .eq('id', profileId)
      .eq('user_id', userId)
      .select(OWN_COLUMNS)
      .maybeSingle();
    if (error) throw error;
    if (!data) throw new PanelError('permission', MESSAGES.permission);
    return data as ExecutiveRow;
  } catch (error) {
    throw toPanelError(error, 'updateOwnProfile');
  }
}
