import { copy } from '../../../content/chapters';
import { SectionShell, sectionTitleId } from '../../ui';
import { useReveal, typeset, typesetLabel } from './shared';
import styles from './MissaoVisaoValores.module.css';

const q = copy.quemSomos;

/**
 * Slide 3 (continuação) — Missão, visão e valores numa seção própria (rodada 21/10).
 * Fundo amarelo, texto em tinta, sem caixas, sem traços e sem numeração: hierarquia só por escala
 * e peso. Desktop: cabe em ~uma tela (1440×900) — título, missão | visão lado a lado, os quatro
 * valores em uma linha. Celular: fluxo natural, tudo visível (sem abas nem acordeão).
 */
export default function MissaoVisaoValores() {
  const ref = useReveal<HTMLElement>();
  return (
    <SectionShell
      ref={ref}
      id="missao-visao-valores"
      title={q.mvvTitle}
      header={false}
      surface="yellow"
      className={styles.section}
    >
      <h2 id={sectionTitleId('missao-visao-valores')} className={styles.title}>
        {typesetLabel(q.mvvTitle)}
      </h2>

      <div className={styles.pillars}>
        <section className={styles.pillar} aria-labelledby="mvv-missao">
          <h3 id="mvv-missao" className={`caps ${styles.label}`}>
            {q.mission.label}
          </h3>
          <p className={styles.statement}>{typeset(q.mission.text)}</p>
        </section>
        <section className={styles.pillar} aria-labelledby="mvv-visao">
          <h3 id="mvv-visao" className={`caps ${styles.label}`}>
            {q.vision.label}
          </h3>
          <p className={styles.statement}>{typeset(q.vision.text)}</p>
        </section>
      </div>

      <section className={styles.values} aria-labelledby="mvv-valores">
        <h3 id="mvv-valores" className={`caps ${styles.label}`}>
          {q.values.label}
        </h3>
        <ul className={styles.valueList} role="list">
          {q.values.items.map((v) => (
            <li key={v.lead} className={styles.value}>
              <strong className={styles.valueLead}>{typesetLabel(v.lead)}</strong>
              {typeset(v.rest)}
            </li>
          ))}
        </ul>
      </section>
    </SectionShell>
  );
}
