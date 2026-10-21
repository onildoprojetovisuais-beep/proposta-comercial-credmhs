import { useCallback, useState } from 'react';
import { copy } from '../../../content/chapters';
import { formatTemplate } from '../../../lib/format';
import { useExecutive } from '../../../state';
import { Button, IconArrow, SectionShell, scrollToChapter, sectionTitleId } from '../../ui';
import { Portrait, typeset, typesetLabel } from './shared';
import styles from './Abertura.module.css';

/** Iniciais para o fallback tipográfico (sem foto). */
const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .join('');

/**
 * Slide 1 — abertura personalizada (rodada de sobriedade, referência assets/referencia.jpg).
 * Blocos justapostos: plano amarelo com logo (versão do brandbook p. 39), saudação, apoio e CTA |
 * painel cinza claro com o retrato retangular do executivo, moldura amarela deslocada e o nome num
 * bloco pontual de tinta. O CTA fica na primeira dobra em todas as telas medidas.
 */
export default function Abertura() {
  const executive = useExecutive();
  const [noPhoto, setNoPhoto] = useState(false);
  const onMissing = useCallback(() => setNoPhoto(true), []);
  const c = copy.abertura;

  return (
    <SectionShell
      id="abertura"
      title={formatTemplate(c.greetingTemplate, { firstName: executive.firstName })}
      titleLevel={1}
      surface="yellow"
      header={false}
      width="full"
      spacing="none"
      className={styles.section}
    >
      <span className={styles.panel} aria-hidden="true" />
      <div className={`container ${styles.frame}`}>
        <div className={styles.tab}>
          <img src="/brand/cred-mhs-logo-sobre-amarelo.svg" alt={copy.global.brand} width={1600} height={481} className={styles.logo} />
        </div>

        <div className={styles.text}>
          <h1 id={sectionTitleId('abertura')} className={`caps ${styles.greeting}`}>
            {typeset(formatTemplate(c.greetingTemplate, { firstName: executive.firstName }))}
          </h1>
          <p className={styles.lead}>{typeset(c.lead)}</p>
          <p className={styles.body}>{typeset(c.body)}</p>
          <div className={styles.cta}>
            <Button
              href="#provocacao"
              size="lg"
              iconAfter={<IconArrow />}
              onClick={(e) => {
                e.preventDefault();
                scrollToChapter('provocacao');
              }}
            >
              {c.cta}
            </Button>
          </div>
        </div>

        <figure className={styles.person} data-surface="light">
          <div className={`offset-frame ${styles.portrait}`}>
          <div className={styles.arch} data-frame data-empty={noPhoto || undefined}>
            {noPhoto ? (
              <span className={styles.monogram} aria-hidden="true">
                {initials(executive.fullName)}
              </span>
            ) : (
              <Portrait
                executive={executive}
                priority
                alt=""
                sizes="(min-width: 960px) 34vw, 70vw"
                className={styles.photo}
                onMissing={onMissing}
              />
            )}
          </div>
          </div>
          <figcaption className={styles.caption}>
            <span className={styles.name}>{typesetLabel(executive.fullName)}</span>
            <span className={styles.role}>
              {typesetLabel(executive.role)}&nbsp;<span className="nowrap">· {copy.global.brand}</span>
            </span>
          </figcaption>
        </figure>
      </div>
    </SectionShell>
  );
}
