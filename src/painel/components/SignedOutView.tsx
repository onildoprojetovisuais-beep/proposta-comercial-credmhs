import { useEffect, useId, useRef, useState } from 'react';
import type { FormEvent, RefObject } from 'react';
import type { Session } from '@supabase/supabase-js';
import { Button } from '../../components/ui';
import { sendPasswordReset, signIn, toPanelError } from '../../lib/supabase/panel';
import { CONTACT_EMAIL_PATTERN } from '../../lib/supabase/types';
import { AuthLayout, Notice } from './AuthLayout';
import { PasswordField } from './PasswordField';
import styles from './Auth.module.css';

interface SignedOutViewProps {
  notice?: { tone: 'info' | 'error'; text: string };
  onSignedIn: (session: Session) => void;
}

type Mode = 'login' | 'forgot' | 'forgot-sent';

const INVITE_NOTE = 'O acesso é criado pela administração da CRED MHS. Recebeu um convite? Use o link do e-mail.';

function emailError(value: string): string | null {
  const v = value.trim();
  if (!v) return 'Informe seu e-mail.';
  if (!CONTACT_EMAIL_PATTERN.test(v)) return 'Confira o e-mail: falta “@” ou o domínio.';
  return null;
}

export function SignedOutView({ notice, onSignedIn }: SignedOutViewProps) {
  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const headingRef = useRef<HTMLHeadingElement>(null);
  const previousMode = useRef<Mode>(mode);

  useEffect(() => {
    // Ao trocar de etapa (não na primeira renderização), leva o foco ao novo título.
    if (previousMode.current === mode) return;
    previousMode.current = mode;
    headingRef.current?.focus();
  }, [mode]);

  return (
    <AuthLayout
      eyebrow="Painel do executivo"
      title="Seu perfil na apresentação"
      lead={<p>Atualize nome, cargo, foto e contatos que o cliente vê na apresentação da CRED MHS.</p>}
      aside={<p>{INVITE_NOTE}</p>}
    >
      {mode === 'login' ? (
        <LoginForm
          headingRef={headingRef}
          notice={notice}
          email={email}
          setEmail={setEmail}
          onSignedIn={onSignedIn}
          onForgot={() => setMode('forgot')}
        />
      ) : mode === 'forgot' ? (
        <ForgotForm
          headingRef={headingRef}
          email={email}
          setEmail={setEmail}
          onSent={() => setMode('forgot-sent')}
          onBack={() => setMode('login')}
        />
      ) : (
        <>
          <h2 ref={headingRef} tabIndex={-1} className={styles.sheetTitle}>
            Confira seu e-mail
          </h2>
          <Notice tone="success">
            Se houver uma conta com este e-mail, enviaremos um link para você definir uma nova senha. O link vale por tempo
            limitado.
          </Notice>
          <p className={styles.sheetText}>Não chegou em alguns minutos? Veja a caixa de spam ou fale com a administração.</p>
          <div className={styles.actions}>
            <Button variant="secondary" onClick={() => setMode('login')}>
              Voltar para a entrada
            </Button>
          </div>
        </>
      )}
    </AuthLayout>
  );
}

interface LoginFormProps {
  headingRef: RefObject<HTMLHeadingElement>;
  notice?: { tone: 'info' | 'error'; text: string };
  email: string;
  setEmail: (v: string) => void;
  onSignedIn: (session: Session) => void;
  onForgot: () => void;
}

function LoginForm({ headingRef, notice, email, setEmail, onSignedIn, onForgot }: LoginFormProps) {
  const emailId = useId();
  const [password, setPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  const eError = submitted ? emailError(email) : null;
  const pError = submitted && !password ? 'Informe sua senha.' : null;

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSubmitted(true);
    setError(null);
    if (emailError(email)) {
      emailRef.current?.focus();
      return;
    }
    if (!password) return;
    setBusy(true);
    try {
      const session = await signIn(email, password);
      setPassword('');
      onSignedIn(session);
    } catch (err) {
      setError(toPanelError(err).message);
      setBusy(false);
    }
  }

  return (
    <>
      <h2 ref={headingRef} tabIndex={-1} className={styles.sheetTitle}>
        Entrar
      </h2>
      {notice && !error ? <Notice tone={notice.tone}>{notice.text}</Notice> : null}
      {error ? <Notice tone="error">{error}</Notice> : null}
      <form className={styles.form} onSubmit={handleSubmit} noValidate aria-busy={busy}>
        <div className="field-group">
          <label className="field-label" htmlFor={emailId}>
            E-mail de acesso
          </label>
          <input
            ref={emailRef}
            id={emailId}
            className="field"
            type="email"
            inputMode="email"
            autoComplete="username"
            autoCapitalize="none"
            spellCheck={false}
            maxLength={254}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={eError ? true : undefined}
            aria-describedby={eError ? `${emailId}-error` : undefined}
          />
          {eError ? (
            <p id={`${emailId}-error`} className={styles.fieldError}>
              {eError}
            </p>
          ) : null}
        </div>
        <PasswordField
          label="Senha"
          autoComplete="current-password"
          value={password}
          maxLength={72}
          onChange={(e) => setPassword(e.target.value)}
          error={pError}
        />
        <div className={styles.actions}>
          <Button type="submit" disabled={busy}>
            {busy ? 'Entrando…' : 'Entrar'}
          </Button>
          <Button variant="link" onClick={onForgot}>
            Esqueci minha senha
          </Button>
        </div>
      </form>
    </>
  );
}

interface ForgotFormProps {
  headingRef: RefObject<HTMLHeadingElement>;
  email: string;
  setEmail: (v: string) => void;
  onSent: () => void;
  onBack: () => void;
}

function ForgotForm({ headingRef, email, setEmail, onSent, onBack }: ForgotFormProps) {
  const emailId = useId();
  const [submitted, setSubmitted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const eError = submitted ? emailError(email) : null;

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSubmitted(true);
    setError(null);
    if (emailError(email)) return;
    setBusy(true);
    try {
      await sendPasswordReset(email);
      onSent();
    } catch (err) {
      setError(toPanelError(err).message);
      setBusy(false);
    }
  }

  return (
    <>
      <h2 ref={headingRef} tabIndex={-1} className={styles.sheetTitle}>
        Redefinir senha
      </h2>
      <p className={styles.sheetText}>Informe o e-mail que você usa para entrar. Enviaremos um link para criar uma nova senha.</p>
      {error ? <Notice tone="error">{error}</Notice> : null}
      <form className={styles.form} onSubmit={handleSubmit} noValidate aria-busy={busy}>
        <div className="field-group">
          <label className="field-label" htmlFor={emailId}>
            E-mail de acesso
          </label>
          <input
            id={emailId}
            className="field"
            type="email"
            inputMode="email"
            autoComplete="username"
            autoCapitalize="none"
            spellCheck={false}
            maxLength={254}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={eError ? true : undefined}
            aria-describedby={eError ? `${emailId}-error` : undefined}
          />
          {eError ? (
            <p id={`${emailId}-error`} className={styles.fieldError}>
              {eError}
            </p>
          ) : null}
        </div>
        <div className={styles.actions}>
          <Button type="submit" disabled={busy}>
            {busy ? 'Enviando…' : 'Enviar link'}
          </Button>
          <Button variant="link" onClick={onBack}>
            Voltar para a entrada
          </Button>
        </div>
      </form>
    </>
  );
}
