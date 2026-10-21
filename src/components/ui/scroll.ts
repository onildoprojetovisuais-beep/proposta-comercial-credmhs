import type { ChapterId } from '../../types/presentation';

/** Item da navegação lateral (src/app/chapterIndex.ts). */
export interface ChapterNavItem {
  id: ChapterId;
  /** Rótulo curto (src/content/chapters.ts → navLabel). */
  label: string;
}

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Rola até a seção, atualiza o hash (preservando ?executivo= e ?revisao=) e move o foco para ela.
 * Instantâneo em reduced motion ou em saltos longos. Sem scroll-jacking: só reage a um clique.
 */
export function scrollToChapter(id: ChapterId, opts: { focus?: boolean; instant?: boolean } = {}) {
  const el = document.getElementById(id);
  if (!el) return;
  const far = Math.abs(el.getBoundingClientRect().top) > window.innerHeight * 2.5;
  const behavior: ScrollBehavior = opts.instant || far || prefersReducedMotion() ? 'auto' : 'smooth';
  el.scrollIntoView({ behavior, block: 'start' });
  const url = `${window.location.pathname}${window.location.search}#${id}`;
  window.history.replaceState(window.history.state, '', url);
  if (opts.focus !== false) el.focus({ preventScroll: true });
}
