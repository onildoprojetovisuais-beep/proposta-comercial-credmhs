import { copy } from '../../../content/chapters';
import { BrazilMap } from '../../../motion/map/BrazilMap';
import { SectionShell, sectionTitleId } from '../../ui';
import { typeset, CountUp } from './shared';
import styles from './Alcance.module.css';

/**
 * Slide 5 — alcance. Plano amarelo; título e os dois indicadores em escala tipográfica grande
 * (medidas diferentes: nunca em gráfico comparativo). Rodada 21/10: sem rótulo superior e sem
 * réguas entre indicadores — a separação é feita por espaço. A identificação do Rio fica só no mapa. O mapa animado é do agente Motion
 * (src/motion/map/BrazilMap); aqui só posicionamos: ~metade da largura no desktop, largura total
 * no celular.
 */
export default function Alcance() {
  const c = copy.alcance;
  return (
    <SectionShell id="alcance" title={typeset(c.title)} header={false} surface="yellow" className={styles.section}>
      <div className={styles.grid}>
        <div className={styles.text}>
          <h2 id={sectionTitleId('alcance')} className={styles.title}>
            {typeset(c.title)}
          </h2>
          <dl className={styles.indicators}>
            {c.indicators.map((i) => (
              <div
                key={i.id}
                className={styles.indicator}
                role="group"
                aria-label={`${i.prefix}${i.value} ${i.unit} ${i.label}`}
              >
                <dt className={styles.label}>{typeset(i.label)}</dt>
                <dd className={styles.value}>
                  <span className={styles.prefix}>{i.prefix}</span>
                  <CountUp value={i.value} />
                  <span className={styles.unit}>{i.unit}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
        <div className={styles.map}>
          <BrazilMap />
        </div>
      </div>
    </SectionShell>
  );
}
