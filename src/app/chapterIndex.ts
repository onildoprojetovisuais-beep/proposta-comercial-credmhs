import type { ChapterNavItem } from '../components/ui';
import type { ChapterId } from '../types/presentation';
import { chapterFromHash } from '../content';
import { isReviewMode, visibleChapters } from '../lib/reviewMode';

/** Modo de revisão lido uma vez na carga (`?revisao=1`). */
export const REVIEW_MODE = isReviewMode();

const visible = visibleChapters(REVIEW_MODE);

/** Navegação lateral: seções visíveis, sem as marcadas `navHidden`. Ordem = ordem da página. */
export const CHAPTER_INDEX: ChapterNavItem[] = visible.filter((c) => !c.navHidden).map((c) => ({ id: c.id, label: c.navLabel }));

/** Todas as seções visíveis (inclui as fora da navegação), para o capítulo atual. */
export const CHAPTER_IDS: ChapterId[] = visible.map((c) => c.id);

/** Resolve o hash da URL para o ID da seção visível; desconhecido ou oculto → null. */
export function sectionIdFromHash(hash: string): ChapterId | null {
  const id = chapterFromHash(hash)?.id ?? null;
  return id && CHAPTER_IDS.includes(id) ? id : null;
}
