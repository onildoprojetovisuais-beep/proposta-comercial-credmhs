import { useCallback, useEffect, useRef, useState } from 'react';
import type { CSSProperties, KeyboardEvent } from 'react';
import { copy } from '../../../content/chapters';
import { approvedTestimonials } from '../../../lib/reviewMode';
import { REVIEW_MODE } from '../../../app/chapterIndex';
import { SectionShell, sectionTitleId } from '../../ui';
import { MOBILE_QUERY, typeset, typesetLabel, useMediaQuery } from './shared';
import type { Testimonial } from '../../../types/presentation';
import styles from './Depoimentos.module.css';

/** Aviso interno dos espaços reservados (só em ?revisao=1). */
const PENDING_NOTE = 'Pendente — depoimento real a enviar pela CRED';

/**
 * Slide 6 — depoimentos. A seção aparece ao cliente quando há depoimentos aprovados (chapterIndex).
 * Citação editorial — aspas num quadrado amarelo, parágrafos separados como enviados, assinatura
 * com nome, cargo e empresa (sem setor). Com mais de um depoimento (hoje Radix e Radisson), vira
 * carrossel no padrão do de marcas: deslizar nativo com scroll-snap, setas e contador ACIMA das
 * citações (os textos têm alturas muito diferentes), ← → no trilho, sem avanço automático.
 * Sem depoimentos aprovados, só em ?revisao=1, mostra os setores reservados do PPT como pendentes.
 * Nenhuma fala, nome ou cargo é inventado.
 */
export default function Depoimentos() {
  const c = copy.depoimentos;
  const items = approvedTestimonials();
  const showSlots = items.length === 0 && REVIEW_MODE;
  if (items.length === 0 && !showSlots) return null;

  return (
    <SectionShell id="depoimentos" title={typeset(c.title)} header={false} className={styles.section}>
      <div className={styles.layout}>
      <header className={styles.head}>
        <p className={`t-eyebrow ${styles.eyebrow}`}>{typeset(c.eyebrow)}</p>
        <h2 id={sectionTitleId('depoimentos')} className={styles.title}>
          {typeset(c.title)}
        </h2>
      </header>

      {items.length > 1 ? (
        <TestimonialCarousel items={items} />
      ) : items.length === 1 ? (
        <ul className={styles.list} role="list">
          <li className={styles.item}>
            <Quote t={items[0]} />
          </li>
        </ul>
      ) : (
        <ul className={`${styles.list} ${styles.slots}`} role="list">
          {c.reviewSlots.map((sector) => (
            <li key={sector} className={`${styles.item} ${styles.slot}`}>
              <span className={styles.mark} aria-hidden="true">
                “
              </span>
              <p className={styles.sector}>{sector}</p>
              <p className="review-note">{typeset(PENDING_NOTE)}</p>
            </li>
          ))}
        </ul>
      )}
      </div>
    </SectionShell>
  );
}

/** Palavras com hífen (“bem-estar”, “NR-1”) não quebram no hífen. */
function keepHyphenated(text: string) {
  return text.split(/(\S+-\S+)/).map((part, i) =>
    i % 2 ? (
      <span key={i} className="nowrap">
        {part}
      </span>
    ) : (
      part
    ),
  );
}

/** Acima disto (caracteres), o depoimento começa recolhido no celular. */
const LONG_QUOTE = 480;

function Quote({ t }: { t: Testimonial }) {
  const compact = useMediaQuery(MOBILE_QUERY);
  const long = compact && t.quote.length > LONG_QUOTE;
  const [expanded, setExpanded] = useState(false);
  const collapsed = long && !expanded;
  const bodyId = `depoimento-${t.id}`;
  return (
    <figure className={styles.figure}>
      <span className={styles.mark} aria-hidden="true">
        “
      </span>
      <blockquote id={bodyId} className={styles.quote} data-collapsed={collapsed || undefined}>
        {/* Parágrafos do depoimento como enviados (separados por linha em branco). */}
        {t.quote.split(/\n\s*\n/).map((para, i) => (
          <p key={i}>{keepHyphenated(typeset(para.trim()))}</p>
        ))}
      </blockquote>
      {long ? (
        <button
          type="button"
          className={styles.more}
          aria-expanded={expanded}
          aria-controls={bodyId}
          onClick={() => setExpanded((v) => !v)}
        >
          {expanded ? copy.depoimentos.collapse : copy.depoimentos.expand}
          <span className={styles.moreIcon} aria-hidden="true" />
        </button>
      ) : null}
      <figcaption className={styles.by}>
        <span className={styles.name}>{typesetLabel(t.name)}</span>
        <span className={styles.role}>{typesetLabel([t.role, t.company].filter(Boolean).join(' · '))}</span>
      </figcaption>
    </figure>
  );
}

function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** Um depoimento por vez; o índice segue a rolagem nativa (toque, setas, teclado). */
function TestimonialCarousel({ items }: { items: Testimonial[] }) {
  const c = copy.depoimentos;
  const trackRef = useRef<HTMLUListElement>(null);
  const [index, setIndex] = useState(0);
  const total = items.length;
  const fill = (template: string, current: number) =>
    template.replace('{current}', String(current)).replace('{total}', String(total));

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    let raf = 0;
    const measure = () => {
      const w = el.clientWidth || 1;
      setIndex(Math.min(total - 1, Math.max(0, Math.round(el.scrollLeft / w))));
    };
    const schedule = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(measure);
    };
    el.addEventListener('scroll', schedule, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener('scroll', schedule);
    };
  }, [total]);

  // Altura do trilho = altura do depoimento ativo (os textos têm tamanhos muito diferentes;
  // sem isso o mais curto deixaria um vão do tamanho do mais longo).
  const [height, setHeight] = useState<number | undefined>(undefined);
  useEffect(() => {
    const slide = trackRef.current?.children[index] as HTMLElement | undefined;
    if (!slide) return;
    const update = () => setHeight(slide.offsetHeight);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(slide);
    return () => ro.disconnect();
  }, [index]);

  const go = useCallback(
    (to: number) => {
      const el = trackRef.current;
      if (!el) return;
      const target = Math.min(total - 1, Math.max(0, to));
      el.scrollTo({ left: target * el.clientWidth, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
    },
    [total],
  );

  const onKey = (event: KeyboardEvent<HTMLUListElement>) => {
    const keys: Record<string, number> = { ArrowRight: index + 1, ArrowLeft: index - 1, Home: 0, End: total - 1 };
    if (!(event.key in keys)) return;
    event.preventDefault();
    go(keys[event.key]);
  };

  const atStart = index === 0;
  const atEnd = index === total - 1;

  return (
    <div className={styles.carousel} role="region" aria-roledescription="carrossel" aria-label={c.title}>
      <div className={styles.controls}>
        <div className={styles.rail} aria-hidden="true">
          <span
            className={styles.thumb}
            style={{ '--thumb-size': (1 / total).toFixed(4), '--thumb-offset': (index / total).toFixed(4) } as CSSProperties}
          />
        </div>
        <p className={styles.counter} aria-hidden="true">
          {fill(c.counterTemplate, index + 1)}
        </p>
        <div className={styles.arrows}>
          <button
            type="button"
            className={`${styles.arrow} ${styles.prev}`}
            aria-label={c.prev}
            aria-controls="depoimentos-trilho"
            aria-disabled={atStart}
            onClick={() => !atStart && go(index - 1)}
          >
            <Chevron direction="left" />
          </button>
          <button
            type="button"
            className={`${styles.arrow} ${styles.next}`}
            aria-label={c.next}
            aria-controls="depoimentos-trilho"
            aria-disabled={atEnd}
            onClick={() => !atEnd && go(index + 1)}
          >
            <Chevron direction="right" />
          </button>
        </div>
      </div>

      <ul
        ref={trackRef}
        id="depoimentos-trilho"
        className={styles.track}
        role="list"
        tabIndex={0}
        aria-label={`${c.title} — ${total} depoimentos`}
        onKeyDown={onKey}
        style={height ? { height } : undefined}
      >
        {items.map((t, i) => (
          <li
            key={t.id}
            className={styles.slide}
            aria-roledescription="slide"
            aria-label={fill(c.slideTemplate, i + 1)}
            aria-hidden={i !== index || undefined}
          >
            <Quote t={t} />
          </li>
        ))}
      </ul>
      <p className="visually-hidden" aria-live="polite">
        {fill(c.slideTemplate, index + 1)}
      </p>
    </div>
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
