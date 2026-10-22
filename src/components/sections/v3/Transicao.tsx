import { copy } from '../../../content/chapters';
import { SectionShell, sectionTitleId } from '../../ui';
import { typeset, typesetLabel } from './shared';
import styles from './Transicao.module.css';

/**
 * Slide 8 — transição para “como entregamos”. Rodada 21/10 (Sabrina): sem fotografia; plano
 * amarelo de tela cheia com a pergunta como protagonista. “Como entregamos” é a entrada leve;
 * daí em diante a frase é um bloco Black, com “mais gestão” como pico de escala (ênfase só
 * tipográfica); “sua empresa?” mantém o sublinhado do PPT. Os espaços entre os trechos ficam no texto (leitura contínua da frase).
 */
export default function Transicao() {
  const c = copy.transicao;
  const q = c.question;
  // “de saúde e” | “segurança do trabalho” | “para a” (frase inalterada, só a quebra).
  const keep = 'segurança do trabalho';
  const at = q.middle.indexOf(keep);
  const middle = [q.middle.slice(0, at).trim(), keep, q.middle.slice(at + keep.length).trim()];
  return (
    <SectionShell
      id="transicao"
      title={`${q.before} ${q.emphasis} ${q.middle} ${q.highlight}`}
      header={false}
      surface="yellow"
      width="full"
      spacing="none"
      className={styles.section}
    >
      <div className={`container ${styles.grid}`}>
        <p className={styles.lead}>{typeset(c.lead)}</p>
        <h2 id={sectionTitleId('transicao')} className={styles.question}>
          <span className={styles.before}>{typesetLabel(q.before)}</span>{' '}
          <strong className={styles.emphasis}>{typesetLabel(q.emphasis)}</strong>{' '}
          <span className={styles.rest}>
            {/* Rodada 22/10: quebra fixa depois de “de saúde e”; “segurança do trabalho” segue junto (sem órfã). */}
            {typesetLabel(middle[0])}
            <br />
            <span className={styles.keep}>{middle[1]}</span> {typesetLabel(middle[2])}{' '}
            <span className="hl">{typesetLabel(q.highlight)}</span>
          </span>
        </h2>
      </div>
    </SectionShell>
  );
}
