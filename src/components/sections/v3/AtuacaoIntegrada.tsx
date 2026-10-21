import { copy } from '../../../content/chapters';
import { SectionShell, sectionTitleId } from '../../ui';
import { useReveal, typeset, typesetLabel } from './shared';
import styles from './AtuacaoIntegrada.module.css';

/**
 * Slide 4 — atuação integrada. Rodada 21/10 (Sabrina): diagrama retirado; a seção se sustenta só
 * por tipografia e espaço — título em escala de capa com “integrada.” em amarelo, o texto de apoio
 * em corpo de leitura amplo e a frase do executivo em peso de manchete, sem moldura nem traço.
 */
export default function AtuacaoIntegrada() {
  const ref = useReveal<HTMLElement>();
  const c = copy.atuacaoIntegrada;

  return (
    <SectionShell
      ref={ref}
      id="atuacao-integrada"
      title={`${c.title.lead} ${c.title.highlight}`}
      header={false}
      surface="dark"
      className={styles.section}
    >
      <header className={styles.head}>
        <p className={`t-eyebrow ${styles.eyebrow}`}>{typeset(c.eyebrow)}</p>
        <h2 id={sectionTitleId('atuacao-integrada')} className={`caps ${styles.title}`}>
          {typeset(c.title.lead, { orphan: false })}{' '}<span className="hl">{typesetLabel(c.title.highlight)}</span>
        </h2>
      </header>

      <div className={styles.copy}>
        <p className={styles.body}>{typeset(c.body)}</p>
        <p className={styles.executive}>{typeset(c.executive)}</p>
      </div>
    </SectionShell>
  );
}
