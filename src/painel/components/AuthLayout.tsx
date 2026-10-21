import type { ReactNode } from 'react';
import styles from './Auth.module.css';

interface AuthLayoutProps {
  eyebrow: string;
  title: string;
  lead?: ReactNode;
  /** Conteúdo da folha à direita (formulário ou mensagem). */
  children: ReactNode;
  /** Texto de apoio abaixo do título (coluna editorial). */
  aside?: ReactNode;
  titleId?: string;
}

/**
 * Composição das telas de acesso: título editorial à esquerda com o sol do símbolo
 * sobre a linha de base (padrão gráfico, brandbook p. 54) e a folha de ação à direita.
 */
export function AuthLayout({ eyebrow, title, lead, children, aside, titleId = 'painel-titulo' }: AuthLayoutProps) {
  return (
    <section className={styles.section} aria-labelledby={titleId}>
      <div className={`container ${styles.grid}`}>
        <div className={styles.intro}>
          <span className={styles.sun} aria-hidden="true" />
          <p className={`t-eyebrow ${styles.eyebrow}`}>{eyebrow}</p>
          <h1 id={titleId} className={`t-h1 ${styles.title}`}>
            {title}
          </h1>
          {lead ? <div className={`t-lead ${styles.lead}`}>{lead}</div> : null}
          {aside ? <div className={styles.aside}>{aside}</div> : null}
        </div>
        <div className={`panel-action ${styles.sheet}`}>{children}</div>
      </div>
    </section>
  );
}

interface NoticeProps {
  tone: 'info' | 'error' | 'success';
  children: ReactNode;
  id?: string;
}

/** Mensagem de estado. Erros usam role="alert"; os demais, role="status". */
export function Notice({ tone, children, id }: NoticeProps) {
  return (
    <div id={id} className={styles.notice} data-tone={tone} role={tone === 'error' ? 'alert' : 'status'}>
      {children}
    </div>
  );
}
