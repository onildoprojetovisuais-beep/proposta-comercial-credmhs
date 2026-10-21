import { copy } from '../../../content/chapters';
import { SectionShell, sectionTitleId } from '../../ui';
import { useReveal, typeset } from './shared';
import styles from './Provocacao.module.css';

/**
 * Slide 2 — a provocação (sobriedade). Branco, pergunta em Bold contido e, à direita, o ÚNICO corte
 * diagonal da página (bloco amarelo, como o “Table of Contents” da referência) com o apoio. A frase
 * de virada tem “nossa conversa.” sobre a barra amarela reta.
 */
export default function Provocacao() {
  const ref = useReveal<HTMLElement>();
  const c = copy.provocacao;
  return (
    <SectionShell
      ref={ref}
      id="provocacao"
      title={typeset(c.question)}
      header={false}
      surface="dark"
      width="full"
      className={styles.section}
    >
      <div className={`container ${styles.grid}`}>
        <h2 id={sectionTitleId('provocacao')} className={styles.question}>
          {typeset(c.question)}
        </h2>
        <p className={styles.statement}>
          {typeset(c.statement.lead, { orphan: false })}{'\u00A0'}<span className="hl">{typeset(c.statement.highlight)}</span>
        </p>
        <div className={styles.cut} data-surface="yellow">
          <p className={styles.support}>{typeset(c.support)}</p>
        </div>
      </div>
    </SectionShell>
  );
}
