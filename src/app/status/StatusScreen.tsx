import { useEffect, useRef } from 'react';
import { Button, IconArrow, SectionHeader } from '../../components/ui';
import { INSTITUTIONAL_SITE, statusCopy as sc } from './statusCopy';
import styles from './StatusScreen.module.css';

export type StatusKind = 'loading' | 'not-found' | 'unavailable' | 'error';

interface StatusScreenProps {
  kind: StatusKind;
  /** Só em `error`: refaz a requisição sem recarregar a página. */
  onRetry?: () => void;
  /** Move o foco para o início da tela (true depois de uma ação do visitante ou ao exibir o resultado). */
  autoFocus?: boolean;
}

const TITLE_ID = 'status-titulo';

/**
 * Telas da apresentação pública antes do conteúdo: carregamento discreto com a marca e os
 * três resultados sem perfil. Nunca mostram o conteúdo de outro executivo nem detalhes técnicos.
 */
export function StatusScreen({ kind, onRetry, autoFocus = true }: StatusScreenProps) {
  const loadingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.title =
      kind === 'loading'
        ? sc.loading.documentTitle
        : kind === 'not-found'
          ? sc.notFound.documentTitle
          : kind === 'unavailable'
            ? sc.unavailable.documentTitle
            : sc.error.documentTitle;
    if (!autoFocus) return;
    const target = kind === 'loading' ? loadingRef.current : document.getElementById(TITLE_ID);
    if (target) {
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    }
  }, [kind, autoFocus]);

  return (
    <div className={styles.page} data-kind={kind}>
      <header className={styles.top}>
        <div className="container">
          <img
            src="/brand/cred-mhs-logo.svg"
            alt="CRED MHS — Saúde e Segurança do Trabalho"
            width={1600}
            height={481}
            className={styles.logo}
          />
        </div>
      </header>

      <main className={`container ${styles.main}`} id="conteudo">
        {kind === 'loading' ? (
          <div ref={loadingRef} className={styles.loading} role="status" aria-live="polite">
            <span className={styles.sun} aria-hidden="true" />
            <span className={styles.line} aria-hidden="true">
              <span className={styles.lineFill} />
            </span>
            <p className={styles.loadingLabel}>{sc.loading.label}</p>
          </div>
        ) : (
          <Result kind={kind} onRetry={onRetry} />
        )}
      </main>
    </div>
  );
}

function Result({ kind, onRetry }: { kind: Exclude<StatusKind, 'loading'>; onRetry?: () => void }) {
  const text = kind === 'not-found' ? sc.notFound : kind === 'unavailable' ? sc.unavailable : sc.error;
  return (
    <section
      className={styles.result}
      aria-labelledby={TITLE_ID}
      // Falha de conexão é um alerta; os demais resultados são anunciados pelo foco no título.
      role={kind === 'error' ? 'alert' : undefined}
    >
      <span className={styles.resultSun} aria-hidden="true" />
      <SectionHeader titleId={TITLE_ID} level={1} eyebrow={sc.eyebrow} title={text.title} intro={text.body} flush />
      <div className={styles.actions}>
        {kind === 'error' && onRetry ? (
          <Button size="lg" onClick={onRetry}>
            {sc.error.retry}
          </Button>
        ) : null}
        <Button
          variant={kind === 'error' ? 'link' : 'secondary'}
          size="lg"
          href={INSTITUTIONAL_SITE.href}
          iconAfter={<IconArrow direction="right" />}
        >
          {INSTITUTIONAL_SITE.label}
        </Button>
      </div>
    </section>
  );
}
