import { useState } from 'react';
import type { FormEvent } from 'react';
import { Button } from '../../components/ui';
import { toPanelError, updatePassword } from '../../lib/supabase/panel';
import { AuthLayout, Notice } from './AuthLayout';
import { PasswordField } from './PasswordField';
import styles from './Auth.module.css';

const MIN_PASSWORD = 8;

interface SetPasswordViewProps {
  reason: 'invite' | 'recovery';
  onDone: () => void;
}

/** Retorno de convite ou de redefinição: cria a senha da conta. */
export function SetPasswordView({ reason, onDone }: SetPasswordViewProps) {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pError = submitted
    ? !password
      ? 'Crie uma senha.'
      : password.length < MIN_PASSWORD
        ? `Use pelo menos ${MIN_PASSWORD} caracteres.`
        : null
    : null;
  const cError = submitted && !pError && confirm !== password ? 'As duas senhas não são iguais.' : null;

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSubmitted(true);
    setError(null);
    if (password.length < MIN_PASSWORD || confirm !== password) return;
    setBusy(true);
    try {
      await updatePassword(password);
      setPassword('');
      setConfirm('');
      onDone();
    } catch (err) {
      setError(toPanelError(err).message);
      setBusy(false);
    }
  }

  const invite = reason === 'invite';
  return (
    <AuthLayout
      eyebrow={invite ? 'Boas-vindas ao painel' : 'Redefinição de senha'}
      title="Defina sua senha"
      lead={
        <p>
          {invite
            ? 'Seu convite foi confirmado. Crie a senha que você vai usar para entrar no painel.'
            : 'Crie uma nova senha para entrar no painel. A anterior deixa de valer.'}
        </p>
      }
    >
      <h2 className={styles.sheetTitle}>{invite ? 'Criar senha' : 'Nova senha'}</h2>
      {error ? <Notice tone="error">{error}</Notice> : null}
      <form className={styles.form} onSubmit={handleSubmit} noValidate aria-busy={busy}>
        <PasswordField
          label="Nova senha"
          autoComplete="new-password"
          hint={`Pelo menos ${MIN_PASSWORD} caracteres. Misture letras, números e símbolos.`}
          value={password}
          maxLength={72}
          onChange={(e) => setPassword(e.target.value)}
          error={pError}
        />
        <PasswordField
          label="Confirme a nova senha"
          autoComplete="new-password"
          value={confirm}
          maxLength={72}
          onChange={(e) => setConfirm(e.target.value)}
          error={cError}
        />
        <div className={styles.actions}>
          <Button type="submit" disabled={busy}>
            {busy ? 'Salvando…' : 'Salvar senha e continuar'}
          </Button>
        </div>
      </form>
    </AuthLayout>
  );
}
