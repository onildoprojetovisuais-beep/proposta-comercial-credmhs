import { forwardRef } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';
import type { ChapterId } from '../../types/presentation';
import { SectionHeader } from './SectionHeader';
import styles from './SectionShell.module.css';

/** IDs de capítulo V3 (= ChapterId de src/types/presentation.ts; hash #abertura…#contato). */
export type SectionId = ChapterId;

/** ID do título de um capítulo — use quando renderizar um título próprio (`header={false}`). */
export const sectionTitleId = (id: SectionId) => `${id}-titulo`;

/**
 * SectionShell — wrapper de capítulo: <section id="mXX" aria-labelledby tabIndex=-1>.
 * Layout v2: um container só (82rem), padding vertical único (--section-pad-y), cabeçalho via SectionHeader.
 *
 * Props:
 * - id: ChapterId ('abertura'…'contato'; âncora do hash e do índice).
 * - title: título do capítulo (obrigatório; nome acessível da seção). Sempre .t-h1.
 * - eyebrow?: rótulo curto acima do título (ex.: "Estrutura").
 * - intro?: apoio sob o título (lead).
 * - titleLevel?: 1 | 2 (padrão 2; use 1 só na abertura).
 * - surface?: 'white' (padrão) | 'yellow' | 'dark' — V2: amarelo #FFCA00, branco e preto pontual.
 *   Define `data-surface` (light|dark|yellow, contraste de controles) e `data-bg` (white|dark|yellow).
 *   'paper' é aceito por compatibilidade e renderiza branco (creme saiu da apresentação pública).
 * - width?: 'default' | 'full' (full = sem container; a seção controla o layout).
 *   'wide' é aceito por compatibilidade e equivale a 'default' (não existe mais container largo).
 * - header?: false para não renderizar o cabeçalho padrão. Nesse caso o filho DEVE renderizar
 *   <SectionHeader titleId={sectionTitleId(id)} … /> (ou um elemento com esse id).
 * - headerAside?: conteúdo ao lado do cabeçalho no desktop (ex.: atalho de saída).
 * - spacing?: 'default' | 'none' — 'none' só para a abertura.
 * - children, className e demais atributos de <section>.
 */
export interface SectionShellProps extends Omit<HTMLAttributes<HTMLElement>, 'title' | 'id'> {
  id: SectionId;
  title: ReactNode;
  eyebrow?: ReactNode;
  intro?: ReactNode;
  titleLevel?: 1 | 2;
  surface?: 'paper' | 'white' | 'dark' | 'yellow';
  width?: 'default' | 'wide' | 'full';
  header?: boolean;
  headerAside?: ReactNode;
  spacing?: 'default' | 'none';
  children?: ReactNode;
}

export const SectionShell = forwardRef<HTMLElement, SectionShellProps>(function SectionShell(
  {
    id,
    title,
    eyebrow,
    intro,
    titleLevel = 2,
    surface: surfaceProp = 'white',
    width = 'default',
    header = true,
    headerAside,
    spacing = 'default',
    className,
    children,
    ...rest
  },
  ref,
) {
  const surface = surfaceProp === 'paper' ? 'white' : surfaceProp;
  const titleId = sectionTitleId(id);
  const surfaceAttr = surface === 'dark' ? 'dark' : surface === 'yellow' ? 'yellow' : 'light';

  const headerEl = header ? (
    <SectionHeader
      titleId={titleId}
      title={title}
      eyebrow={eyebrow}
      intro={intro}
      level={titleLevel}
      aside={headerAside}
    />
  ) : null;

  return (
    <section
      ref={ref}
      id={id}
      aria-labelledby={titleId}
      tabIndex={-1}
      data-chapter={id}
      data-surface={surfaceAttr}
      data-bg={surface}
      className={[styles.section, styles[surface], styles[`spacing-${spacing}`], className ?? '']
        .filter(Boolean)
        .join(' ')}
      {...rest}
    >
      {width !== 'full' ? (
        <div className="container">
          {headerEl}
          {children}
        </div>
      ) : (
        <>
          {headerEl ? <div className="container">{headerEl}</div> : null}
          {children}
        </>
      )}
    </section>
  );
});
