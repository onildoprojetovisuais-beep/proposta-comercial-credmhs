import { copy } from '../../../content/chapters';
import { PHOTOS } from '../../../app/mediaManifest';
import type { Photo } from '../../../app/mediaManifest';
import { SectionShell, sectionTitleId } from '../../ui';
import { useEffect, useRef, useState } from 'react';
import { CredPhoto, MOBILE_QUERY, useMediaQuery, useReveal, typeset, typesetLabel } from './shared';
import styles from './QuemSomos.module.css';

const q = copy.quemSomos;

/** Bloco de uma unidade: foto principal sangrada + foto de apoio sobreposta + etiqueta amarela. */
function Unit({
  unitId,
  main,
  detail,
  side,
}: {
  unitId: 'barra' | 'centro';
  main: Photo;
  detail: Photo;
  side: 'right' | 'left';
}) {
  const unit = q.units.find((u) => u.id === unitId);
  if (!unit) return null;
  return (
    <figure className={styles.unit} data-side={side}>
      <div className={`offset-frame ${styles.unitFrame}`}>
        <div className={styles.unitMain} data-frame data-shape={main.width > main.height ? 'wide' : 'tall'}>
          <CredPhoto photo={main} sizes="(min-width: 1024px) 46vw, 100vw" className={styles.img} />
        </div>
      </div>
      <div className={styles.unitDetail} data-frame data-reveal>
        <CredPhoto photo={detail} sizes="(min-width: 1024px) 20vw, 42vw" className={styles.img} />
      </div>
      <figcaption className={styles.unitTag}>
        <span className={styles.unitLabel}>{unit.label}</span>
        <span className={`caps ${styles.unitName}`}>{unit.name}</span>
      </figcaption>
    </figure>
  );
}


/** Celular: as duas unidades lado a lado num trilho deslizável, com abas Barra | Centro. */
function UnitsCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const units = [
    { id: 'barra' as const, main: PHOTOS.barraFachada, detail: PHOTOS.barraConsultorio },
    { id: 'centro' as const, main: PHOTOS.centroPorta, detail: PHOTOS.centroRecepcao },
  ];

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const slide = el.firstElementChild as HTMLElement | null;
        const w = slide ? slide.offsetWidth : el.clientWidth;
        setIndex(Math.min(units.length - 1, Math.round(el.scrollLeft / Math.max(1, w))));
      });
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener('scroll', onScroll);
    };
  }, [units.length]);

  const go = (i: number) => {
    const el = trackRef.current;
    const slide = el?.children[i] as HTMLElement | undefined;
    if (!el || !slide) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollTo({ left: slide.offsetLeft - el.offsetLeft, behavior: reduce ? 'auto' : 'smooth' });
  };

  return (
    <div className={styles.unitsCarousel} role="region" aria-roledescription="carrossel" aria-label="Unidades da rede própria">
      <div className={styles.chips}>
        {units.map((u, i) => {
          const unit = q.units.find((x) => x.id === u.id);
          return (
            <button
              key={u.id}
              type="button"
              className={styles.chip}
              aria-pressed={index === i}
              aria-controls="quem-somos-unidades"
              onClick={() => go(i)}
            >
              {unit?.name ?? u.id}
            </button>
          );
        })}
      </div>
      <div ref={trackRef} id="quem-somos-unidades" className={styles.unitsTrack}>
        {units.map((u, i) => (
          <div key={u.id} className={styles.unitSlide} aria-roledescription="slide" aria-label={`${i + 1} de ${units.length}`}>
            <Unit unitId={u.id} main={u.main} detail={u.detail} side="right" />
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Os três atributos em composição circular leve (pedido da Sabrina, 21/10: “Leveza… procure usar o
 * diagrama circular”): três círculos amarelos translúcidos sobrepostos, sem painel, sem divisórias,
 * sem ícones. Desktop: triângulo (estilo Venn); celular: corrente vertical em zigue-zague.
 * Revelação discreta via data-reveal (estática em reduced motion).
 */
function Attributes() {
  return (
    <ul className={styles.attributes} role="list" aria-label="Atributos da CRED MHS">
      {q.attributes.map((a, i) => (
        <li key={a} className={styles.attribute} data-pos={i} data-reveal style={{ ['--i' as string]: i }}>
          <span className={styles.attributeText}>{typesetLabel(a)}</span>
        </li>
      ))}
    </ul>
  );
}

/**
 * Slide 3 — Quem somos. Rodada 21/10 (leveza): sem traços decorativos, sem os indicadores
 * repetidos (35 / Minas Gerais / 2008 / 2018 ficam só no texto corrido), sem a moldura do título.
 * 1) título em escala de capa; 2) história ao lado da unidade Barra; unidade Centro ao lado dos
 * três atributos em círculos. Missão, visão e valores saíram para a seção própria
 * (MissaoVisaoValores.tsx). Celular (< 768): unidades num carrossel (Barra | Centro).
 * Fotos só com a unidade atribuída pelo PPT (Barra: 09.43.21/23; Centro: 09.43.18/17).
 */
export default function QuemSomos() {
  const ref = useReveal<HTMLElement>();
  const compact = useMediaQuery(MOBILE_QUERY);
  const story = (
    <div className={styles.story}>
      <p className={styles.headline}>{typeset(q.headline)}</p>
      <p className={styles.history}>{typeset(q.history)}</p>
    </div>
  );
  return (
    <SectionShell
      ref={ref}
      id="quem-somos"
      title={q.title}
      header={false}
      width="full"
      spacing="none"
      className={styles.section}
    >
      <div className="container">
        <header className={styles.head}>
          <p className={styles.intro}>{typeset(q.intro)}</p>
          <h2 id={sectionTitleId('quem-somos')} className={`caps ${styles.title}`}>
            {q.title}
          </h2>
        </header>

        {compact ? (
          <div className={styles.compactRow}>
            {story}
            <UnitsCarousel />
            <Attributes />
          </div>
        ) : (
          <>
            <div className={styles.row}>
              {story}
              <Unit unitId="barra" main={PHOTOS.barraFachada} detail={PHOTOS.barraConsultorio} side="right" />
            </div>

            <div className={`${styles.row} ${styles.rowReverse}`}>
              <Unit unitId="centro" main={PHOTOS.centroPorta} detail={PHOTOS.centroRecepcao} side="left" />
              <Attributes />
            </div>
          </>
        )}
      </div>
    </SectionShell>
  );
}
