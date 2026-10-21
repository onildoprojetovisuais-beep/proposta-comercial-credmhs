import { copy, fronts } from '../../../content/chapters';
import { SectionShell, sectionTitleId } from '../../ui';
import { useReveal, typeset, typesetLabel } from './shared';
import styles from './Frentes.module.css';

/**
 * Slide 9 — sete frentes (rodada 21/10: leveza).
 * - Título “Sete frentes, uma atuação única.” sem rótulo acima e sem bloco de fecho preto.
 * - As sete frentes (01–07) em linhas largas separadas só por espaço: sem faixa transversal,
 *   sem marcas de cruzamento, sem divisórias, caixas ou molduras. Número leve, título e texto.
 * - “Comunicação e reputação” fecha a seção como texto flutuante (título + frase), sem número e
 *   fora da contagem. O enquadramento aguarda a Sabrina (fecho × frente 08): o bloco está isolado
 *   em <Fecho />; para virar frente 08, basta incluí-lo em `fronts` e remover <Fecho />.
 * - Celular: lista aberta (as sete frentes visíveis, sem acordeão). Os textos são curtos (1–3
 *   linhas); a leitura autônoma e a leveza valem mais que esconder conteúdo atrás de toques.
 * Textos: `title`/`text` de `fronts` (nunca `original`).
 */
export default function Frentes() {
  const ref = useReveal<HTMLElement>();
  const c = copy.frentes;
  return (
    <SectionShell ref={ref} id="frentes" title={typeset(c.title)} header={false} className={styles.section}>
      <header className={styles.head}>
        <h2 id={sectionTitleId('frentes')} className={`caps ${styles.title}`}>
          {typeset(c.title)}
        </h2>
      </header>

      <ol className={styles.list} role="list" data-reveal>
        {fronts.map((f) => (
          <li key={f.id} className={styles.front}>
            <span className={styles.number} aria-hidden="true">
              {f.number}
            </span>
            <h3 className={styles.frontTitle}>
              <span className="visually-hidden">{f.number}. </span>
              {typeset(f.title)}
            </h3>
            <p className={styles.frontText}>{typeset(bind(f.text))}</p>
          </li>
        ))}
      </ol>

      <Fecho title={c.transversal.title} text={c.transversal.text} />
    </SectionShell>
  );
}

/** Fecho “Comunicação e reputação” — sem número, fora da contagem (decisão pendente da Sabrina). */
function Fecho({ title, text }: { title: string; text: string }) {
  return (
    <aside className={styles.closing} aria-labelledby="frentes-fecho">
      <h3 id="frentes-fecho" className={`caps ${styles.closingTitle}`}>
        <span className={styles.closingMark}>{typesetLabel(title)}</span>
      </h3>
      <p className={styles.closingText}>{typeset(bind(text))}</p>
    </aside>
  );
}

/** Só tipografia (o texto não muda): “ /” e “bem estar” nunca se separam na quebra de linha
 *  (o segundo argumento de cada replace usa espaço inseparável U+00A0). */
function bind(text: string): string {
  return text.replace(/ \//g, ' /').replace(/bem estar/g, 'bem estar');
}
