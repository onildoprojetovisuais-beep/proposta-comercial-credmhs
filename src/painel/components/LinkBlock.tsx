import { useEffect, useId, useRef, useState } from 'react';
import { Button, IconArrow, IconCheck } from '../../components/ui';
import { buildPresentationLink } from '../../lib/supabase/slug';
import styles from './Editor.module.css';

type CopyState = 'idle' | 'copied' | 'manual';

/** Link público do executivo (só `?executivo=<slug>`), com copiar e abrir. */
export function LinkBlock({ slug, isActive }: { slug: string; isActive: boolean }) {
  const link = buildPresentationLink(slug);
  const [state, setState] = useState<CopyState>('idle');
  const inputRef = useRef<HTMLInputElement>(null);
  const linkId = useId();
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  async function copy() {
    window.clearTimeout(timer.current);
    try {
      if (!navigator.clipboard?.writeText) throw new Error('sem clipboard');
      await navigator.clipboard.writeText(link);
      setState('copied');
      timer.current = window.setTimeout(() => setState('idle'), 4000);
    } catch {
      // Sem permissão de área de transferência: seleciona o texto para copiar à mão.
      setState('manual');
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }

  return (
    <section className={styles.linkBlock} aria-labelledby={`${linkId}-title`}>
      <div className={styles.linkText}>
        <h2 id={`${linkId}-title`} className={`t-h4 ${styles.linkTitle}`}>
          Seu link de apresentação
        </h2>
        <p className={styles.linkHint}>
          Envie este link aos clientes. Ele leva só o seu identificador <strong className={styles.slug}>{slug}</strong>, definido
          pela administração: <strong>seu link não muda se você alterar o nome.</strong>
        </p>
        {!isActive ? (
          <p className={styles.linkWarning}>
            Seu perfil está desativado. Quem abrir o link não verá os seus dados até a administração reativá-lo.
          </p>
        ) : null}
      </div>
      <div className={styles.linkRow}>
        <label htmlFor={linkId} className="visually-hidden">
          Link da sua apresentação
        </label>
        <input
          ref={inputRef}
          id={linkId}
          className={`field ${styles.linkField}`}
          type="text"
          readOnly
          value={link}
          onFocus={(e) => e.currentTarget.select()}
          aria-describedby={state === 'manual' ? `${linkId}-manual` : undefined}
        />
        <div className={styles.linkActions}>
          <Button onClick={copy} variant="secondary" iconBefore={state === 'copied' ? <IconCheck /> : undefined}>
            {state === 'copied' ? 'Link copiado' : 'Copiar meu link'}
          </Button>
          <Button variant="link" href={link} target="_blank" rel="noopener" iconAfter={<IconArrow direction="right" />}>
            Abrir minha apresentação<span className="visually-hidden"> (abre em nova aba)</span>
          </Button>
        </div>
      </div>
      <p className={styles.linkStatus} role="status" aria-live="polite" id={`${linkId}-manual`}>
        {state === 'copied'
          ? 'Link copiado. Cole na mensagem para o cliente.'
          : state === 'manual'
            ? 'Não foi possível copiar automaticamente. O link está selecionado: use Ctrl+C (ou toque e segure para copiar).'
            : ''}
      </p>
    </section>
  );
}
