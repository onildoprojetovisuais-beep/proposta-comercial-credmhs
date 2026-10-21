import { useCallback, useEffect, useRef, useState } from 'react';
import type { CSSProperties, KeyboardEvent } from 'react';
import { copy } from '../../../content/chapters';
import { clientLogos } from '../../../content/clients';
import { typeset, typesetLabel } from '../../../lib';
import type { ClientLogo } from '../../../types/presentation';
import { SectionShell } from '../../ui/SectionShell';
import styles from './Empresas.module.css';

/**
 * Slide 10 — "Empresas que caminham com a gente". Dono: agente de Marcas (docs/V3-LOGOS.md).
 *
 * Carrossel de marcas sobre rolagem horizontal NATIVA com scroll-snap:
 * - toque: deslizar nativo (sem gesto customizado);
 * - setas: rolam uma "página" (o número de marcas inteiras visíveis); ficam aria-disabled nas
 *   pontas — sem volta ao início, para o visitante saber que viu todas;
 * - teclado: Tab chega à faixa (foco visível) e às setas; na faixa, ← → andam uma marca,
 *   Home/End vão às pontas;
 * - sem avanço automático, sem itens duplicados, lista ul/li com todas as marcas.
 * Logos não são estudos de caso: nenhum texto além do nome (alt).
 */

/** Proporção de referência (largura/altura) da normalização por área. */
const REF_RATIO = 3;

/** Fator de altura: mesma área aparente para todas as marcas × ajuste óptico manual. */
function heightFactor(logo: ClientLogo): number {
  const ratio = logo.width / logo.height;
  const f = Math.sqrt(REF_RATIO / ratio) * (logo.optical ?? 1);
  return Math.min(1.25, Math.max(0.6, f));
}

function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

interface TrackState {
  page: number;
  pages: number;
  atStart: boolean;
  atEnd: boolean;
  /** Fração visível e posição (0–1) para a linha de progresso. */
  size: number;
  offset: number;
}

const INITIAL: TrackState = { page: 1, pages: 1, atStart: true, atEnd: true, size: 1, offset: 0 };

export default function Empresas() {
  const t = copy.empresas;
  const trackRef = useRef<HTMLUListElement>(null);
  const [state, setState] = useState<TrackState>(INITIAL);

  /** Largura de uma marca (todas as células têm a mesma largura). */
  const itemWidth = useCallback(() => {
    const first = trackRef.current?.firstElementChild as HTMLElement | null;
    return first ? first.getBoundingClientRect().width : 0;
  }, []);

  const measure = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const w = itemWidth();
    const max = el.scrollWidth - el.clientWidth;
    const perView = w > 0 ? Math.max(1, Math.floor(el.clientWidth / w + 0.02)) : 1;
    const pages = Math.max(1, Math.ceil(clientLogos.length / perView));
    const atStart = el.scrollLeft <= 2;
    const atEnd = el.scrollLeft >= max - 2;
    const pageW = perView * w || el.clientWidth;
    const page = atEnd ? pages : Math.min(pages, Math.floor(el.scrollLeft / pageW + 0.05) + 1);
    const size = el.scrollWidth > 0 ? Math.min(1, el.clientWidth / el.scrollWidth) : 1;
    const offset = el.scrollWidth > 0 ? el.scrollLeft / el.scrollWidth : 0;
    setState((prev) =>
      prev.page === page &&
      prev.pages === pages &&
      prev.atStart === atStart &&
      prev.atEnd === atEnd &&
      Math.abs(prev.size - size) < 0.001 &&
      Math.abs(prev.offset - offset) < 0.001
        ? prev
        : { page, pages, atStart, atEnd, size, offset },
    );
  }, [itemWidth]);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    let raf = 0;
    const schedule = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(measure);
    };
    schedule();
    el.addEventListener('scroll', schedule, { passive: true });
    const ro = new ResizeObserver(schedule);
    ro.observe(el);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener('scroll', schedule);
      ro.disconnect();
    };
  }, [measure]);

  const scrollByItems = useCallback(
    (direction: 1 | -1, unit: 'item' | 'page') => {
      const el = trackRef.current;
      if (!el) return;
      const w = itemWidth() || el.clientWidth;
      const perView = Math.max(1, Math.floor(el.clientWidth / w + 0.02));
      const step = unit === 'page' ? perView * w : w;
      // Alinha ao início de uma marca, para não depender do arredondamento do snap.
      const target = Math.round((el.scrollLeft + direction * step) / w) * w;
      el.scrollTo({ left: target, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
    },
    [itemWidth],
  );

  const onTrackKey = (event: KeyboardEvent<HTMLUListElement>) => {
    const el = trackRef.current;
    if (!el) return;
    const behavior: ScrollBehavior = prefersReducedMotion() ? 'auto' : 'smooth';
    switch (event.key) {
      case 'ArrowRight':
        scrollByItems(1, 'item');
        break;
      case 'ArrowLeft':
        scrollByItems(-1, 'item');
        break;
      case 'PageDown':
        scrollByItems(1, 'page');
        break;
      case 'PageUp':
        scrollByItems(-1, 'page');
        break;
      case 'Home':
        el.scrollTo({ left: 0, behavior });
        break;
      case 'End':
        el.scrollTo({ left: el.scrollWidth, behavior });
        break;
      default:
        return;
    }
    event.preventDefault();
  };

  const counter = t.counterTemplate
    .replace('{current}', String(state.page))
    .replace('{total}', String(state.pages));
  const scrollable = !(state.atStart && state.atEnd);

  return (
    <SectionShell
      id="empresas"
      surface="white"
      eyebrow={typesetLabel(t.eyebrow)}
      title={typeset(t.title)}
    >
      <div className={styles.carousel} role="region" aria-roledescription="carrossel" aria-label={t.title}>
        <ul
          ref={trackRef}
          id="empresas-marcas"
          className={styles.track}
          role="list"
          aria-label={`${t.title} — ${clientLogos.length} marcas`}
          tabIndex={scrollable ? 0 : -1}
          onKeyDown={onTrackKey}
        >
          {clientLogos.map((logo) => (
            <li
              key={logo.id}
              className={styles.item}
              style={{ '--logo-f': heightFactor(logo).toFixed(3) } as CSSProperties}
            >
              <img
                className={styles.logo}
                src={logo.src}
                alt={logo.name}
                width={logo.width}
                height={logo.height}
                loading="lazy"
                decoding="async"
                draggable={false}
              />
            </li>
          ))}
        </ul>

        <div className={styles.controls} data-scrollable={scrollable ? 'true' : 'false'}>
          <div className={styles.rail} aria-hidden="true">
            <span
              className={styles.thumb}
              style={
                {
                  '--thumb-size': state.size.toFixed(4),
                  '--thumb-offset': state.offset.toFixed(4),
                } as CSSProperties
              }
            />
          </div>
          <p className={styles.counter} aria-hidden="true">
            {counter}
          </p>
          <div className={styles.arrows}>
            <button
              type="button"
              className={`${styles.arrow} ${styles.prev}`}
              aria-label={t.prev}
              aria-controls="empresas-marcas"
              aria-disabled={state.atStart}
              onClick={() => !state.atStart && scrollByItems(-1, 'page')}
            >
              <Chevron direction="left" />
            </button>
            <button
              type="button"
              className={`${styles.arrow} ${styles.next}`}
              aria-label={t.next}
              aria-controls="empresas-marcas"
              aria-disabled={state.atEnd}
              onClick={() => !state.atEnd && scrollByItems(1, 'page')}
            >
              <Chevron direction="right" />
            </button>
          </div>
        </div>
      </div>
    </SectionShell>
  );
}

function Chevron({ direction }: { direction: 'left' | 'right' }) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" focusable="false">
      <path
        d={direction === 'left' ? 'M14.5 5.5 8 12l6.5 6.5' : 'M9.5 5.5 16 12l-6.5 6.5'}
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
    </svg>
  );
}
