/**
 * Retorno de links de e-mail (convite e redefinição de senha).
 *
 * Precisa rodar ANTES de criar o cliente Supabase, porque o cliente (PKCE) lê a URL na
 * inicialização. Três formatos são aceitos:
 *  1. `?token_hash=…&type=invite|recovery` — modelo de e-mail recomendado (verifyOtp).
 *  2. `?code=…` — redefinição pedida neste navegador (PKCE). O próprio cliente troca o código
 *     e emite PASSWORD_RECOVERY; aqui só registramos que é um retorno de senha.
 *  3. `#access_token=…&type=invite|recovery` — modelo padrão do Supabase (fluxo implícito),
 *     que o cliente PKCE recusa. Guardamos os tokens em memória e adotamos a sessão depois.
 *  Erros (`#error_code=otp_expired…`) viram a mensagem "link expirado".
 * Tokens e códigos de uso único são removidos da barra de endereço (history.replaceState).
 */

export type AuthCallback =
  | { kind: 'none' }
  | { kind: 'token-hash'; tokenHash: string; type: 'invite' | 'recovery' }
  | { kind: 'code'; type: 'invite' | 'recovery' }
  | { kind: 'tokens'; accessToken: string; refreshToken: string; type: 'invite' | 'recovery' | 'other' }
  | { kind: 'error' };

const PASSWORD_TYPES = new Set(['invite', 'recovery']);

function passwordType(value: string | null): 'invite' | 'recovery' | null {
  return value && PASSWORD_TYPES.has(value) ? (value as 'invite' | 'recovery') : null;
}

function cleanUrl(removeSearch: string[], clearHash: boolean): void {
  const url = new URL(window.location.href);
  for (const key of removeSearch) url.searchParams.delete(key);
  if (clearHash) url.hash = '';
  window.history.replaceState(window.history.state, '', url.pathname + url.search + url.hash);
}

/** Lê e limpa a URL. Chame uma única vez, antes de `getSupabase()`. */
export function captureAuthCallback(): AuthCallback {
  if (typeof window === 'undefined') return { kind: 'none' };
  const search = new URLSearchParams(window.location.search);
  const hash = new URLSearchParams(window.location.hash.replace(/^#/, ''));

  if (search.get('error') || search.get('error_code') || hash.get('error') || hash.get('error_code')) {
    cleanUrl(['error', 'error_code', 'error_description', 'type', 'code'], true);
    return { kind: 'error' };
  }

  const tokenHash = search.get('token_hash');
  const typeFromSearch = passwordType(search.get('type'));
  if (tokenHash && typeFromSearch) {
    cleanUrl(['token_hash', 'type'], false);
    return { kind: 'token-hash', tokenHash, type: typeFromSearch };
  }

  const accessToken = hash.get('access_token');
  const refreshToken = hash.get('refresh_token');
  if (accessToken && refreshToken) {
    const type = passwordType(hash.get('type')) ?? 'other';
    cleanUrl([], true);
    return { kind: 'tokens', accessToken, refreshToken, type };
  }

  if (search.get('code')) {
    // O cliente remove `code` sozinho depois da troca; aqui só limpamos o `type` auxiliar.
    const type = typeFromSearch ?? 'recovery';
    if (search.get('type')) cleanUrl(['type'], false);
    return { kind: 'code', type };
  }

  return { kind: 'none' };
}
