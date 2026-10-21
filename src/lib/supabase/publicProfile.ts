import type { SupabasePublicConfig } from './config';
import type { PublicExecutiveRow } from './types';

/**
 * Leitura pública do perfil do executivo (apresentação, sem login).
 *
 * Usa `fetch` direto na RPC `get_public_executive` em vez do supabase-js, para não levar Auth
 * ao bundle do cliente final. Nada do visitante (empresa, prioridades, pauta) é enviado:
 * o corpo contém só o identificador público da URL.
 */

export const PUBLIC_PROFILE_TIMEOUT_MS = 8000;

export type PublicProfileResult =
  | { kind: 'found'; row: PublicExecutiveRow }
  | { kind: 'unavailable'; slug: string }
  | { kind: 'not-found' }
  | { kind: 'error'; cause: 'timeout' | 'network' | 'http' | 'invalid' | 'aborted'; status?: number };

export interface FetchPublicProfileOptions {
  config: SupabasePublicConfig;
  /** Injetável para testes (padrão: `globalThis.fetch`). */
  fetchImpl?: typeof fetch;
  timeoutMs?: number;
  /** Cancelamento externo (ex.: componente desmontado). */
  signal?: AbortSignal;
}

const isObject = (v: unknown): v is Record<string, unknown> => !!v && typeof v === 'object' && !Array.isArray(v);
const isNullableString = (v: unknown): v is string | null => v === null || typeof v === 'string';
const isNullableNumber = (v: unknown): v is number | null => v === null || (typeof v === 'number' && Number.isFinite(v));

const STRING_FIELDS = [
  'full_name',
  'display_name',
  'role',
  'contact_email',
  'phone_display',
  'phone_e164',
  'photo_path',
  'linkedin_url',
  'website_url',
  'updated_at',
] as const;

/**
 * Valida uma linha da RPC em tempo de execução. Campos ausentes viram null; campos com tipo
 * errado invalidam a linha. Campos extras são ignorados (não são copiados).
 */
export function parsePublicExecutiveRow(raw: unknown): PublicExecutiveRow | null {
  if (!isObject(raw)) return null;
  if (typeof raw.slug !== 'string' || typeof raw.available !== 'boolean') return null;
  const row: PublicExecutiveRow = {
    slug: raw.slug,
    available: raw.available,
    full_name: null,
    display_name: null,
    role: null,
    contact_email: null,
    phone_display: null,
    phone_e164: null,
    photo_path: null,
    photo_width: null,
    photo_height: null,
    linkedin_url: null,
    website_url: null,
    updated_at: null,
  };
  for (const key of STRING_FIELDS) {
    const value = raw[key] ?? null;
    if (!isNullableString(value)) return null;
    row[key] = value;
  }
  for (const key of ['photo_width', 'photo_height'] as const) {
    const value = raw[key] ?? null;
    if (!isNullableNumber(value)) return null;
    row[key] = value;
  }
  return row;
}

/**
 * Interpreta o JSON da RPC. Aceita lista (formato do PostgREST para funções que retornam
 * tabela) ou um objeto único. 0 linhas → not-found; mais de 1 → inválido; linha de outro
 * identificador → inválido (nunca exibir o perfil de outra pessoa).
 */
export function parsePublicProfileResponse(json: unknown, requestedSlug: string | null): PublicProfileResult {
  const rows = Array.isArray(json) ? json : isObject(json) ? [json] : null;
  if (!rows) return { kind: 'error', cause: 'invalid' };
  if (rows.length === 0) return { kind: 'not-found' };
  if (rows.length > 1) return { kind: 'error', cause: 'invalid' };
  const row = parsePublicExecutiveRow(rows[0]);
  if (!row) return { kind: 'error', cause: 'invalid' };
  if (requestedSlug !== null && row.slug !== requestedSlug) return { kind: 'error', cause: 'invalid' };
  if (!row.available) return { kind: 'unavailable', slug: row.slug };
  return { kind: 'found', row };
}

/** Chama a RPC pública. Nunca lança: falhas viram `{ kind: 'error' }`. */
export async function fetchPublicExecutive(
  slug: string | null,
  { config, fetchImpl, timeoutMs = PUBLIC_PROFILE_TIMEOUT_MS, signal }: FetchPublicProfileOptions,
): Promise<PublicProfileResult> {
  const doFetch = fetchImpl ?? (typeof fetch === 'function' ? fetch.bind(globalThis) : null);
  if (!doFetch) return { kind: 'error', cause: 'network' };

  const controller = new AbortController();
  let timedOut = false;
  const timer = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, timeoutMs);
  const onExternalAbort = () => controller.abort();
  if (signal) {
    if (signal.aborted) controller.abort();
    else signal.addEventListener('abort', onExternalAbort, { once: true });
  }

  try {
    const response = await doFetch(`${config.url}/rest/v1/rpc/get_public_executive`, {
      method: 'POST',
      headers: {
        apikey: config.anonKey,
        Authorization: `Bearer ${config.anonKey}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ p_slug: slug }),
      cache: 'no-store',
      credentials: 'omit',
      signal: controller.signal,
    });
    if (!response.ok) return { kind: 'error', cause: 'http', status: response.status };
    let json: unknown;
    try {
      json = await response.json();
    } catch {
      return { kind: 'error', cause: timedOut ? 'timeout' : 'invalid' };
    }
    return parsePublicProfileResponse(json, slug);
  } catch {
    if (timedOut) return { kind: 'error', cause: 'timeout' };
    if (signal?.aborted) return { kind: 'error', cause: 'aborted' };
    return { kind: 'error', cause: 'network' };
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener('abort', onExternalAbort);
  }
}
