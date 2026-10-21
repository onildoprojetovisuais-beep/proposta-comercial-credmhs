import { useEffect, useState } from 'react';
import type { ChapterId } from '../../types/presentation';
import type { ChapterNavItem } from './scroll';
import { scrollToChapter } from './scroll';
import styles from './SideRail.module.css';

/**
 * SideRail — navegação lateral discreta (V3). Substitui o menu “Conteúdo”.
 * - Traços à direita da tela (≥1024px); rótulo aparece no hover/foco; o atual fica marcado
 *   (traço mais longo + aria-current, não só cor).
 * - Links reais (#id): funcionam por teclado, leitor de tela e sem JS. O clique rola sem
 *   scroll-jacking (scrollToChapter) e respeita reduced motion.
 * - Abaixo de 1024px fica oculto: a rolagem natural conduz a leitura no celular.
 */
export interface SideRailProps {
  chapters: ChapterNavItem[];
  currentId: ChapterId | null;
  label: string;
}

export function SideRail({ chapters, currentId, label }: SideRailProps) {
  // Tom do trilho segue a superfície da seção atual: traços claros sobre as seções escuras.
  const [tone, setTone] = useState<'dark' | 'light'>('light');
  useEffect(() => {
    const surface = currentId ? document.getElementById(currentId)?.dataset.surface : null;
    setTone(surface === 'dark' ? 'dark' : 'light');
  }, [currentId]);
  return (
    <nav className={styles.rail} aria-label={label} data-tone={tone}>
      <ol className={styles.list} role="list">
        {chapters.map((c) => {
          const current = c.id === currentId;
          return (
            <li key={c.id}>
              <a
                href={`#${c.id}`}
                className={styles.link}
                aria-current={current ? 'location' : undefined}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToChapter(c.id);
                }}
              >
                <span className={styles.label}>{c.label}</span>
                <span className={styles.mark} aria-hidden="true" />
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
