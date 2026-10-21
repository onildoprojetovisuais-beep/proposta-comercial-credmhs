import { copy } from '../../../content/chapters';
import { REVIEW_MODE } from '../../../app/chapterIndex';
import { SectionShell, sectionTitleId } from '../../ui';
import { CountUp, typeset } from './shared';
import styles from './Satisfacao.module.css';

/** Aviso interno (só em ?revisao=1 enquanto o dado é provisório). */
const PROVISIONAL_NOTE = 'Dado provisório — percentual exato, fonte, período e universo a confirmar';

/** Rótulos de interface da ficha do dado validado. */
const META_LABELS = { source: 'Fonte', period: 'Período', universe: 'Universo' } as const;

/**
 * Slide 7 — satisfação com o atendimento nas unidades próprias (CSAT; não é NPS).
 * Provisório → aviso junto do número só em revisão; ao cliente aparece se `showToClient` (liberado pelo Nil).
 * Validado → fonte, período e universo.
 */
export default function Satisfacao() {
  const c = copy.satisfacao;
  const provisional = c.status === 'provisorio';
  if (provisional && !c.showToClient && !REVIEW_MODE) return null;
  const meta = (['source', 'period', 'universe'] as const).filter((k) => c[k]);

  return (
    <SectionShell id="satisfacao" title={typeset(c.title)} header={false} className={styles.section}>
      <div className={styles.grid}>
        <h2 id={sectionTitleId('satisfacao')} className={styles.question}>
          {typeset(c.title)}
        </h2>
        <div className={styles.figure}>
          <p className={styles.value}>
            <span className={styles.num}>
              <CountUp value={c.value.replace('%', '')} />%
            </span>
            <span className={styles.label}>{typeset(c.label)}</span>
          </p>
          {provisional && REVIEW_MODE ? <p className="review-note">{typeset(PROVISIONAL_NOTE)}</p> : null}
          <p className={styles.method}>{typeset(c.method)}</p>
          {!provisional && meta.length ? (
            <dl className={styles.meta}>
              {meta.map((k) => (
                <div key={k}>
                  <dt>{META_LABELS[k]}</dt>
                  <dd>{c[k]}</dd>
                </div>
              ))}
            </dl>
          ) : null}
        </div>
      </div>
    </SectionShell>
  );
}
