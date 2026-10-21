import { copy } from '../content/chapters';
import { chapters } from '../content/chapters';
import type { Chapter } from '../types/presentation';

/** Parâmetro do ambiente de revisão local: `?revisao=1` (combina com `?executivo=`). */
export const REVIEW_QUERY_PARAM = 'revisao';

/**
 * Modo de revisão: mostra seções com conteúdo pendente (depoimentos, CSAT provisório) e seus avisos
 * internos. Nunca é o padrão: o link do cliente não tem o parâmetro.
 */
export function isReviewMode(search: string = typeof window !== 'undefined' ? window.location.search : ''): boolean {
  return new URLSearchParams(search).get(REVIEW_QUERY_PARAM) === '1';
}

/** Depoimentos aprovados para o cliente. */
export const approvedTestimonials = () => copy.depoimentos.items.filter((t) => t.approved && t.quote.trim());

/** A seção aparece para o cliente? (Em revisão, todas aparecem.) */
export function isChapterVisible(id: Chapter['id'], review: boolean): boolean {
  if (review) return true;
  if (id === 'depoimentos') return approvedTestimonials().length > 0;
  if (id === 'satisfacao') return copy.satisfacao.status === 'validado' || copy.satisfacao.showToClient;
  return true;
}

/** Seções visíveis, na ordem do PPT. */
export function visibleChapters(review: boolean): Chapter[] {
  return chapters.filter((c) => isChapterVisible(c.id, review));
}
