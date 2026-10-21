import { useId, useRef, useState } from 'react';
import type { ChangeEvent } from 'react';
import { Button } from '../../components/ui';
import { PHOTO_INPUT_MIME, PHOTO_MAX_INPUT_BYTES } from '../../lib/supabase/config';
import { formatBytes, optimizePhoto } from '../../lib/supabase/photo';
import type { OptimizedPhoto } from '../../lib/supabase/photo';
import { toPanelError } from '../../lib/supabase/panel';
import styles from './Editor.module.css';

export interface PendingPhoto {
  optimized: OptimizedPhoto;
  /** URL local (blob:) para a pré-visualização. Revogar ao descartar. */
  url: string;
}

interface PhotoFieldProps {
  currentUrl: string | null;
  currentIsDefault: boolean;
  initial: string;
  alt: string;
  pending: PendingPhoto | null;
  onPendingChange: (pending: PendingPhoto | null) => void;
  disabled?: boolean;
}

/**
 * Foto: escolha → otimização no navegador → pré-visualização. Nada vai ao Storage até "Salvar".
 */
export function PhotoField({ currentUrl, currentIsDefault, initial, alt, pending, onPendingChange, disabled }: PhotoFieldProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = ''; // permite escolher o mesmo arquivo de novo
    if (!file) return;
    setError(null);
    setProcessing(true);
    try {
      const optimized = await optimizePhoto(file);
      const url = URL.createObjectURL(optimized.blob);
      onPendingChange({ optimized, url });
    } catch (err) {
      setError(toPanelError(err, 'optimizePhoto').message);
    } finally {
      setProcessing(false);
    }
  }

  const shownUrl = pending?.url ?? currentUrl;
  const status = processing
    ? 'Preparando a foto…'
    : pending
      ? `Nova foto pronta: ${pending.optimized.width} × ${pending.optimized.height} px, ${pending.optimized.mime === 'image/webp' ? 'WebP' : 'JPEG'}, ${formatBytes(pending.optimized.blob.size)}. Ela será enviada quando você salvar.`
      : '';

  return (
    <div className={styles.photoField}>
      <figure className={styles.photoFigure}>
        <span className={styles.photoSun} aria-hidden="true" />
        {shownUrl ? (
          <img src={shownUrl} alt={pending ? `Pré-visualização da nova foto. ${alt}` : alt} className={styles.photoImg} />
        ) : (
          <span className={styles.photoPlaceholder} aria-hidden="true">
            {initial}
          </span>
        )}
        <figcaption className={styles.photoCaption}>
          {pending ? (
            <span className={styles.photoBadge}>Nova foto, ainda não salva</span>
          ) : currentUrl ? (
            currentIsDefault ? 'Foto atual (padrão da apresentação)' : 'Foto atual'
          ) : (
            'Sem foto: a apresentação mostra a inicial do seu nome.'
          )}
        </figcaption>
      </figure>

      <div className={styles.photoControls}>
        <p className={styles.photoAdvice}>
          Prefira um <strong>retrato vertical</strong>, com o <strong>rosto centralizado</strong> na parte de cima e{' '}
          <strong>fundo neutro</strong>. Use uma foto sua, recente e com boa luz.
        </p>
        <p className="field-hint" id={`${inputId}-hint`}>
          JPEG, PNG ou WebP, até {Math.round(PHOTO_MAX_INPUT_BYTES / 1024 / 1024)} MB. O painel reduz a foto para no máximo 1400 px
          e remove dados de localização e do aparelho antes do envio.
        </p>
        <input
          ref={inputRef}
          id={inputId}
          type="file"
          accept={PHOTO_INPUT_MIME.join(',')}
          className="visually-hidden"
          onChange={handleChange}
          disabled={disabled || processing}
          aria-describedby={`${inputId}-hint`}
          tabIndex={-1}
        />
        <div className={styles.photoActions}>
          <Button variant="secondary" onClick={() => inputRef.current?.click()} disabled={disabled || processing} aria-describedby={`${inputId}-hint`}>
            {processing ? 'Preparando…' : currentUrl || pending ? 'Substituir foto' : 'Enviar foto'}
          </Button>
          {pending ? (
            <Button variant="link" onClick={() => onPendingChange(null)} disabled={disabled}>
              Desfazer troca
            </Button>
          ) : null}
        </div>
        <p className={styles.photoStatus} role="status" aria-live="polite">
          {status}
        </p>
        {error ? (
          <p className={styles.fieldError} role="alert">
            {error}
          </p>
        ) : null}
      </div>
    </div>
  );
}
