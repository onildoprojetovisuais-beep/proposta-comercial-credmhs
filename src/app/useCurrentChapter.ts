import { useEffect, useState } from 'react';
import type { ChapterId } from '../types/presentation';
import { scrollToChapter } from '../components/ui';
import { sectionIdFromHash } from './chapterIndex';

/**
 * Observa as seções (#abertura…#contato) e devolve a que cruza a faixa central da viewport
 * (alimenta o trilho lateral). Atualiza o hash com replaceState (sem rolar, sem criar histórico,
 * preservando ?executivo= e ?revisao=). Na carga, se a URL tiver o id de uma seção (#frentes) ou um
 * hash antigo (#m05 → #frentes), posiciona a página nela.
 */
export function useCurrentChapter(ids: ChapterId[]): ChapterId | null {
  const [current, setCurrent] = useState<ChapterId | null>(null);

  // Link direto a capítulo: as seções só existem depois do render do React.
  useEffect(() => {
    const hash = sectionIdFromHash(window.location.hash);
    if (hash && ids.includes(hash)) {
      const go = () => requestAnimationFrame(() => scrollToChapter(hash, { instant: true, focus: false }));
      go();
      // Reposiciona depois que as fontes carregam (troca de fonte altera alturas).
      document.fonts?.ready.then(go).catch(() => undefined);
    }
    // Troca de hash na mesma página (ex.: link antigo para #m05): hashes antigos não são IDs do DOM,
    // então o navegador não rola sozinho — resolve o hash e posiciona o capítulo.
    const onHash = () => {
      const id = sectionIdFromHash(window.location.hash);
      if (id && ids.includes(id)) scrollToChapter(id, { focus: false });
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const els = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (!els.length || typeof IntersectionObserver === 'undefined') return;

    const visible = new Map<string, boolean>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) visible.set(entry.target.id, entry.isIntersecting);
        const first = ids.find((id) => visible.get(id));
        if (first) setCurrent(first);
      },
      // Faixa fina no meio da viewport: só um capítulo "atual" por vez.
      { rootMargin: '-45% 0px -54% 0px', threshold: 0 },
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [ids]);

  useEffect(() => {
    if (!current) return;
    if (window.location.hash === `#${current}`) return;
    const url = `${window.location.pathname}${window.location.search}#${current}`;
    window.history.replaceState(window.history.state, '', url);
  }, [current]);

  return current;
}
