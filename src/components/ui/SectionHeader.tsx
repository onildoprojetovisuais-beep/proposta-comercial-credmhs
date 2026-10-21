import type { ReactNode } from 'react';
import styles from './SectionHeader.module.css';

/**
 * SectionHeader — cabeçalho ÚNICO de capítulo (layout v2): eyebrow → título → lead.
 * Usado pelo SectionShell (header padrão) e diretamente em colunas de M08/M09/M10 (`header={false}`).
 *
 * Espaçamentos fixos: eyebrow→título e título→lead = --header-gap (16px);
 * cabeçalho→conteúdo = --header-to-content (32→64px), desligável com `flush`.
 * Título SEMPRE em .t-h1 (--fs-h1). Não há outro tamanho de título de capítulo.
 *
 * Props:
 * - titleId: id do título (use sectionTitleId(id) para o aria-labelledby da seção).
 * - title, eyebrow?, intro? (lead, .t-lead, 46ch).
 * - level?: 1 | 2 (padrão 2; 1 só em M01).
 * - aside?: conteúdo à direita no desktop (≥1024), alinhado pela base (ex.: atalho de saída).
 * - flush?: true remove a margem inferior (quando o cabeçalho está numa coluna com gap próprio).
 * - className?
 * Cores vêm do `data-surface` do ancestral (light | dark | yellow).
 */
export interface SectionHeaderProps {
  titleId: string;
  title: ReactNode;
  eyebrow?: ReactNode;
  intro?: ReactNode;
  level?: 1 | 2;
  aside?: ReactNode;
  flush?: boolean;
  className?: string;
}

export function SectionHeader({
  titleId,
  title,
  eyebrow,
  intro,
  level = 2,
  aside,
  flush,
  className,
}: SectionHeaderProps) {
  const Heading = level === 1 ? 'h1' : 'h2';
  return (
    <header
      className={[styles.header, aside ? styles.withAside : '', flush ? styles.flush : '', className ?? '']
        .filter(Boolean)
        .join(' ')}
    >
      <div className={styles.main}>
        {eyebrow ? (
          <div className={styles.eyebrowRow}>
            <p className={`t-eyebrow ${styles.eyebrow}`}>{eyebrow}</p>
          </div>
        ) : null}
        <Heading id={titleId} className={`t-h1 ${styles.title}`}>
          {title}
        </Heading>
        {intro ? <div className={`t-lead ${styles.intro}`}>{intro}</div> : null}
      </div>
      {aside ? <div className={styles.aside}>{aside}</div> : null}
    </header>
  );
}
