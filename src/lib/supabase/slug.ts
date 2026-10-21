import { getPublicSiteOrigin } from './config';

/**
 * Identificador público do executivo (CONTRATO COMPARTILHADO — dono: coordenação).
 * - Minúsculas, dígitos e hífen simples: `sabrina-ferreira`, `catarina`.
 * - Definido pelo administrador ao criar o perfil e imutável (trigger no banco).
 *   O executivo pode mudar nome e nome de apresentação sem alterar o link.
 * - Mesma regra na migration: `^[a-z0-9]+(-[a-z0-9]+)*$`, 2 a 64 caracteres.
 */
export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export const SLUG_MIN = 2;
export const SLUG_MAX = 64;

/** Parâmetro de URL da apresentação pública: `/?executivo=<slug>`. */
export const EXECUTIVE_QUERY_PARAM = 'executivo';

export function isValidSlug(value: string): boolean {
  return value.length >= SLUG_MIN && value.length <= SLUG_MAX && SLUG_PATTERN.test(value);
}

/** Normaliza o valor lido da URL (trim + minúsculas). Não corrige formato inválido. */
export function normalizeSlug(value: string): string {
  return value.trim().toLowerCase();
}

/**
 * Link público do executivo. Contém SÓ o identificador: nenhuma escolha, empresa ou pauta
 * do cliente entra na URL.
 */
export function buildPresentationLink(slug: string, origin: string = getPublicSiteOrigin()): string {
  return `${origin}/?${EXECUTIVE_QUERY_PARAM}=${encodeURIComponent(slug)}`;
}
