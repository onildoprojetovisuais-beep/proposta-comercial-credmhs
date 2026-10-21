import { useId, useState } from 'react';
import type { InputHTMLAttributes } from 'react';
import styles from './Auth.module.css';

interface PasswordFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'id'> {
  label: string;
  hint?: string;
  error?: string | null;
  autoComplete: 'current-password' | 'new-password';
}

/** Campo de senha com "Mostrar/Ocultar" (o nome acessível inclui o rótulo; o valor nunca é registrado). */
export function PasswordField({ label, hint, error, autoComplete, ...rest }: PasswordFieldProps) {
  const id = useId();
  const [visible, setVisible] = useState(false);
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;
  return (
    <div className="field-group">
      <label className="field-label" htmlFor={id}>
        {label}
      </label>
      <div className={styles.passwordWrap}>
        <input
          {...rest}
          id={id}
          className="field"
          type={visible ? 'text' : 'password'}
          autoComplete={autoComplete}
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
        />
        <button
          type="button"
          className={styles.reveal}
          aria-controls={id}
          onClick={() => setVisible((v) => !v)}
        >
          {visible ? 'Ocultar' : 'Mostrar'}
          <span className="visually-hidden"> {label.toLowerCase()}</span>
        </button>
      </div>
      {hint ? (
        <p id={hintId} className="field-hint">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} className={styles.fieldError}>
          {error}
        </p>
      ) : null}
    </div>
  );
}
