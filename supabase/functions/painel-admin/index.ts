// =============================================================================
// CRED MHS · Edge Function `painel-admin`
// Ações da aba "Equipe" do /painel/ que precisam da chave service_role (convite
// por e-mail e bloqueio de login). Só atende quem está em public.panel_admins.
//
// POST { action, ... } com o JWT da sessão do painel (supabase.functions.invoke):
//   create      { profile, login_email, slug, redirect_to? } → perfil novo + convite
//   invite      { executive_id, login_email, redirect_to? }  → convite p/ perfil sem acesso
//   resend      { executive_id, redirect_to? }               → reenvia convite (ou link de senha)
//   set-active  { executive_id, active }                     → desativa/reativa perfil e login
//
// Deploy: `npx supabase functions deploy painel-admin` (docs/CONFIGURACAO-SUPABASE.md, seção 5).
// SUPABASE_URL, SUPABASE_ANON_KEY e SUPABASE_SERVICE_ROLE_KEY já existem no ambiente
// das Edge Functions; nada precisa ser configurado à mão.
// =============================================================================

import { createClient } from 'jsr:@supabase/supabase-js@2';
import type { SupabaseClient } from 'jsr:@supabase/supabase-js@2';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

/** Mesmas regras de src/lib/supabase/types.ts e das CHECKs da migration 1. */
const LIMITS = {
  full_name: [2, 80],
  display_name: [1, 40],
  role: [2, 80],
  contact_email: [5, 254],
  phone_display: [8, 32],
  phone_e164: [9, 16],
} as const;
const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const PHONE_E164 = /^\+[1-9][0-9]{7,14}$/;
const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
/** "Bloqueado" no Auth: ~100 anos. Reativar usa 'none'. */
const BAN_FOREVER = '876000h';

type ErrorCode =
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

class HttpError extends Error {
  constructor(readonly status: number, readonly code: ErrorCode, message: string) {
    super(message);
  }
}

function json(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), { status, headers: { ...CORS, 'Content-Type': 'application/json' } });
}

function text(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function requireLength(field: keyof typeof LIMITS, value: string): string {
  const [min, max] = LIMITS[field];
  if (value.length < min || value.length > max) throw new HttpError(400, 'invalid', `Campo inválido: ${field}.`);
  return value;
}

function requireEmail(value: unknown, field: string): string {
  const v = text(value).toLowerCase();
  if (v.length < 5 || v.length > 254 || !EMAIL.test(v)) throw new HttpError(400, 'invalid', `E-mail inválido: ${field}.`);
  return v;
}

function requireId(value: unknown): string {
  const v = text(value).toLowerCase();
  if (!UUID.test(v)) throw new HttpError(400, 'invalid', 'Perfil inválido.');
  return v;
}

/** Só aceita voltar para /painel/ num endereço http(s); o Supabase ainda confere a lista de Redirect URLs. */
function redirectTo(value: unknown): string | undefined {
  const v = text(value);
  if (!v) return undefined;
  try {
    const url = new URL(v);
    if (url.protocol !== 'https:' && url.hostname !== 'localhost') return undefined;
    return `${url.origin}/painel/`;
  } catch {
    return undefined;
  }
}

function isRateLimit(error: { status?: number; code?: string; message?: string } | null): boolean {
  return !!error && (error.status === 429 || String(error.code ?? '').startsWith('over_') || /rate limit/i.test(error.message ?? ''));
}

function isEmailTaken(error: { code?: string; message?: string } | null): boolean {
  return !!error && (error.code === 'email_exists' || error.code === 'user_already_exists' || /already (been )?registered|already exists/i.test(error.message ?? ''));
}

async function invite(admin: SupabaseClient, email: string, redirect: string | undefined): Promise<string> {
  const { data, error } = await admin.auth.admin.inviteUserByEmail(email, redirect ? { redirectTo: redirect } : undefined);
  if (error || !data.user) {
    if (isEmailTaken(error)) throw new HttpError(409, 'email-taken', 'Este e-mail de login já tem acesso ao painel.');
    if (isRateLimit(error)) throw new HttpError(429, 'rate-limit', 'Limite de e-mails atingido.');
    console.error('[painel-admin] invite', error?.message);
    throw new HttpError(502, 'server', 'Não foi possível enviar o convite.');
  }
  return data.user.id;
}

async function loadExecutive(admin: SupabaseClient, id: string) {
  const { data, error } = await admin
    .from('executives')
    .select('id, slug, user_id, is_active, is_default')
    .eq('id', id)
    .maybeSingle();
  if (error) throw new HttpError(500, 'server', 'Falha ao ler o perfil.');
  if (!data) throw new HttpError(404, 'not-found', 'Perfil não encontrado.');
  return data as { id: string; slug: string; user_id: string | null; is_active: boolean; is_default: boolean };
}

// -----------------------------------------------------------------------------
// Ações
// -----------------------------------------------------------------------------

async function createProfile(admin: SupabaseClient, body: Record<string, unknown>) {
  const p = (body.profile ?? {}) as Record<string, unknown>;
  const slug = text(body.slug).toLowerCase();
  if (slug.length < 2 || slug.length > 64 || !SLUG.test(slug)) throw new HttpError(400, 'invalid', 'Identificador do link inválido.');
  const phone_e164 = requireLength('phone_e164', text(p.phone_e164));
  if (!PHONE_E164.test(phone_e164)) throw new HttpError(400, 'invalid', 'Telefone inválido.');
  const row = {
    slug,
    full_name: requireLength('full_name', text(p.full_name)),
    display_name: requireLength('display_name', text(p.display_name)),
    role: requireLength('role', text(p.role)),
    contact_email: requireLength('contact_email', requireEmail(p.contact_email, 'contato')),
    phone_display: requireLength('phone_display', text(p.phone_display)),
    phone_e164,
    is_active: true,
    is_default: false,
  };
  const loginEmail = requireEmail(body.login_email, 'login');

  // 1) Perfil primeiro: as CHECKs e o slug único barram dados ruins antes de mandar e-mail.
  const { data: created, error } = await admin.from('executives').insert(row).select('id').single();
  if (error || !created) {
    if (error?.code === '23505') throw new HttpError(409, 'slug-taken', 'Já existe um perfil com este link.');
    if (error?.code === '23514') throw new HttpError(400, 'invalid', 'Algum campo não foi aceito.');
    console.error('[painel-admin] insert', error?.message);
    throw new HttpError(500, 'server', 'Falha ao criar o perfil.');
  }

  // 2) Convite. Se falhar, desfaz o perfil para não sobrar cadastro pela metade.
  let userId: string;
  try {
    userId = await invite(admin, loginEmail, redirectTo(body.redirect_to));
  } catch (err) {
    await admin.from('executives').delete().eq('id', created.id);
    throw err;
  }

  // 3) Vínculo.
  const { error: linkError } = await admin.from('executives').update({ user_id: userId }).eq('id', created.id);
  if (linkError) {
    await admin.auth.admin.deleteUser(userId);
    await admin.from('executives').delete().eq('id', created.id);
    throw new HttpError(500, 'server', 'Falha ao vincular o acesso.');
  }
  return { id: created.id, slug };
}

async function inviteExisting(admin: SupabaseClient, body: Record<string, unknown>) {
  const executive = await loadExecutive(admin, requireId(body.executive_id));
  if (executive.user_id) throw new HttpError(409, 'already-linked', 'Este perfil já tem acesso.');
  const userId = await invite(admin, requireEmail(body.login_email, 'login'), redirectTo(body.redirect_to));
  const { error } = await admin.from('executives').update({ user_id: userId }).eq('id', executive.id).is('user_id', null);
  if (error) {
    await admin.auth.admin.deleteUser(userId);
    throw new HttpError(500, 'server', 'Falha ao vincular o acesso.');
  }
  return { id: executive.id };
}

async function resend(admin: SupabaseClient, body: Record<string, unknown>) {
  const executive = await loadExecutive(admin, requireId(body.executive_id));
  if (!executive.user_id) throw new HttpError(409, 'no-login', 'Este perfil ainda não tem acesso.');
  const { data, error } = await admin.auth.admin.getUserById(executive.user_id);
  if (error || !data.user?.email) throw new HttpError(404, 'not-found', 'Conta de acesso não encontrada.');
  const redirect = redirectTo(body.redirect_to);

  if (!data.user.email_confirmed_at) {
    // Convite ainda não aceito: o Supabase aceita convidar de novo o mesmo e-mail.
    const { error: inviteError } = await admin.auth.admin.inviteUserByEmail(data.user.email, redirect ? { redirectTo: redirect } : undefined);
    if (inviteError) {
      if (isRateLimit(inviteError)) throw new HttpError(429, 'rate-limit', 'Limite de e-mails atingido.');
      console.error('[painel-admin] resend invite', inviteError.message);
      throw new HttpError(502, 'server', 'Não foi possível reenviar o convite.');
    }
    return { sent: 'invite' as const };
  }

  // Já aceitou o convite: manda o e-mail de "criar nova senha".
  const { error: resetError } = await admin.auth.resetPasswordForEmail(data.user.email, redirect ? { redirectTo: redirect } : undefined);
  if (resetError) {
    if (isRateLimit(resetError)) throw new HttpError(429, 'rate-limit', 'Limite de e-mails atingido.');
    console.error('[painel-admin] resend recovery', resetError.message);
    throw new HttpError(502, 'server', 'Não foi possível enviar o e-mail.');
  }
  return { sent: 'recovery' as const };
}

async function setActive(admin: SupabaseClient, body: Record<string, unknown>, callerId: string) {
  const executive = await loadExecutive(admin, requireId(body.executive_id));
  const active = body.active === true;
  if (!active && executive.is_default) {
    throw new HttpError(409, 'protected', 'O perfil padrão da apresentação não pode ser desativado.');
  }
  if (!active && executive.user_id === callerId) {
    throw new HttpError(409, 'protected', 'Você não pode desativar o seu próprio perfil.');
  }
  const { error } = await admin.from('executives').update({ is_active: active }).eq('id', executive.id);
  if (error) throw new HttpError(500, 'server', 'Falha ao atualizar o perfil.');
  if (executive.user_id) {
    const { error: banError } = await admin.auth.admin.updateUserById(executive.user_id, {
      ban_duration: active ? 'none' : BAN_FOREVER,
    });
    if (banError) console.error('[painel-admin] ban', banError.message);
  }
  return { id: executive.id, is_active: active };
}

// -----------------------------------------------------------------------------

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });
  if (req.method !== 'POST') return json(405, { error: 'invalid', message: 'Use POST.' });

  try {
    const url = Deno.env.get('SUPABASE_URL')!;
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const authorization = req.headers.get('Authorization') ?? '';
    if (!authorization.startsWith('Bearer ')) throw new HttpError(401, 'unauthenticated', 'Sessão ausente.');

    // Cliente com o JWT de quem chamou: identifica a pessoa e checa o papel de admin.
    const caller = createClient(url, anonKey, {
      global: { headers: { Authorization: authorization } },
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { data: userData, error: userError } = await caller.auth.getUser(authorization.slice(7));
    if (userError || !userData.user) throw new HttpError(401, 'unauthenticated', 'Sessão inválida.');
    const { data: isAdmin, error: adminError } = await caller.rpc('is_panel_admin');
    if (adminError || isAdmin !== true) throw new HttpError(403, 'forbidden', 'Acesso restrito à administração.');

    const admin = createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });
    const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;

    switch (body.action) {
      case 'create':
        return json(200, await createProfile(admin, body));
      case 'invite':
        return json(200, await inviteExisting(admin, body));
      case 'resend':
        return json(200, await resend(admin, body));
      case 'set-active':
        return json(200, await setActive(admin, body, userData.user.id));
      default:
        throw new HttpError(400, 'invalid', 'Ação desconhecida.');
    }
  } catch (err) {
    if (err instanceof HttpError) return json(err.status, { error: err.code, message: err.message });
    console.error('[painel-admin]', err instanceof Error ? err.message : err);
    return json(500, { error: 'server', message: 'Erro interno.' });
  }
});
