import type { Executive, ExecutiveResolution } from '../types';
import { DEFAULT_EXECUTIVE_ID, executives } from '../content/executives';
import { EXECUTIVE_QUERY_PARAM, isValidSlug, normalizeSlug } from './supabase/slug';
import type { SupabasePublicConfig } from './supabase/config';
import { fetchPublicExecutive } from './supabase/publicProfile';
import { mapPublicExecutiveRow } from './supabase/mapping';

export function getExecutiveById(id: string | null | undefined): Executive | null {
  if (!id) return null;
  return executives.find((e) => e.id === id) ?? null;
}

export function getDefaultExecutive(): Executive {
  const exec = getExecutiveById(DEFAULT_EXECUTIVE_ID);
  if (!exec) throw new Error('Perfil padrão ausente em src/content/executives.ts');
  return exec;
}

/** O que a URL pede. Só o identificador é lido: telefone, e-mail ou nome na query são ignorados. */
export type ExecutiveRequest =
  | { kind: 'none' }
  | { kind: 'invalid'; raw: string }
  | { kind: 'slug'; slug: string };

export function readExecutiveRequest(search: string): ExecutiveRequest {
  let raw: string | null = null;
  try {
    raw = new URLSearchParams(search.startsWith('?') ? search.slice(1) : search).get(EXECUTIVE_QUERY_PARAM);
  } catch {
    return { kind: 'invalid', raw: search };
  }
  if (raw === null || raw.trim() === '') return { kind: 'none' };
  const slug = normalizeSlug(raw);
  return isValidSlug(slug) ? { kind: 'slug', slug } : { kind: 'invalid', raw };
}

/**
 * Resolução sem Supabase (perfis do projeto):
 * - sem identificador → perfil padrão local (Sabrina);
 * - identificador de um perfil local → esse perfil;
 * - qualquer outro → not-found (nunca mostrar Sabrina no lugar de outra pessoa).
 */
export function resolveLocalExecutive(search: string): ExecutiveResolution {
  const request = readExecutiveRequest(search);
  if (request.kind === 'none') {
    return { status: 'ready', executive: getDefaultExecutive(), origin: 'local', reason: 'default', requestedId: null };
  }
  if (request.kind === 'invalid') return { status: 'not-found', requestedId: request.raw };
  const match = getExecutiveById(request.slug);
  if (match) return { status: 'ready', executive: match, origin: 'local', reason: 'matched', requestedId: request.slug };
  return { status: 'not-found', requestedId: request.slug };
}

export interface ResolveExecutiveOptions {
  /** null → Supabase não configurado (resolução local, síncrona). */
  config: SupabasePublicConfig | null;
  fetchImpl?: typeof fetch;
  timeoutMs?: number;
  signal?: AbortSignal;
  /** `photo_path` → URL pública. Obrigatório com `config` (injetado para rodar em Node). */
  photoUrlFor?: (photoPath: string) => string | null;
  /** Aviso interno (padrão: console.warn). Nunca exibido ao cliente. */
  warn?: (message: string) => void;
}

/**
 * Resolve o executivo da URL (`?executivo=<slug>`).
 *
 * Com Supabase (regras de Nil, prevalecem sobre docs/03 "ID desconhecido → padrão"):
 * - formato inválido → not-found, sem chamar a rede;
 * - sem identificador → RPC com p_slug null; se falhar ou vier vazia, perfil local de Sabrina
 *   (perfil padrão documentado) com aviso no console;
 * - 0 linhas → not-found; inativo → unavailable; falha com identificador → error (sem fallback).
 */
export async function resolveExecutive(search: string, options: ResolveExecutiveOptions): Promise<ExecutiveResolution> {
  const { config } = options;
  if (!config) return resolveLocalExecutive(search);

  const request = readExecutiveRequest(search);
  if (request.kind === 'invalid') return { status: 'not-found', requestedId: request.raw };
  const slug = request.kind === 'slug' ? request.slug : null;
  const warn = options.warn ?? ((m: string) => console.warn(m));

  const localDefault = (why: string): ExecutiveResolution => {
    warn(`[apresentação] Perfil padrão indisponível no Supabase (${why}); usando o perfil local.`);
    return { status: 'ready', executive: getDefaultExecutive(), origin: 'local', reason: 'default-fallback', requestedId: null };
  };

  const result = await fetchPublicExecutive(slug, {
    config,
    fetchImpl: options.fetchImpl,
    timeoutMs: options.timeoutMs,
    signal: options.signal,
  });

  if (result.kind === 'found') {
    const photoUrlFor = options.photoUrlFor ?? (() => null);
    const executive = mapPublicExecutiveRow(result.row, { photoUrlFor });
    if (executive) {
      return { status: 'ready', executive, origin: 'remote', reason: slug ? 'matched' : 'default', requestedId: slug };
    }
    // Linha ativa sem os campos obrigatórios: mesma regra de resposta inválida.
    return slug ? { status: 'error', requestedId: slug } : localDefault('linha incompleta');
  }
  if (result.kind === 'unavailable') return { status: 'unavailable', requestedId: slug };
  if (result.kind === 'not-found') return slug ? { status: 'not-found', requestedId: slug } : localDefault('sem perfil padrão');
  return slug ? { status: 'error', requestedId: slug } : localDefault(result.cause);
}
