import { useEffect, useId, useMemo, useRef, useState } from 'react';
import type { FormEvent, InputHTMLAttributes, ReactNode } from 'react';
import { Button } from '../../components/ui';
import { PanelError, toPanelError, updateOwnProfile } from '../../lib/supabase/panel';
import { removeOwnPhoto, uploadOwnPhoto } from '../../lib/supabase/photo';
import { photoPublicUrl } from '../../lib/supabase/storage';
import { CONTACT_EMAIL_PATTERN, FIELD_LIMITS } from '../../lib/supabase/types';
import type { ExecutiveRow, ExecutiveUpdate } from '../../lib/supabase/types';
import { PHONE_MESSAGES, parsePhone, phoneFieldFromProfile } from '../phone';
import { setUnsavedChanges } from '../unsaved';
import { LinkBlock } from './LinkBlock';
import { PhotoField } from './PhotoField';
import type { PendingPhoto } from './PhotoField';
import { Preview } from './Preview';
import styles from './Editor.module.css';

/** Retrato local usado pela apresentação quando o perfil padrão ainda não tem foto no Storage. */
const DEFAULT_PORTRAITS: Record<string, string> = {
  'sabrina-ferreira': '/media/executives/sabrina-ferreira-1098.jpg',
};

interface FormValues {
  full_name: string;
  display_name: string;
  role: string;
  contact_email: string;
  phone: string;
}

type FieldName = keyof FormValues;
type Errors = Partial<Record<FieldName, string>>;

const FIELD_ORDER: FieldName[] = ['full_name', 'display_name', 'role', 'contact_email', 'phone'];

function valuesFrom(profile: ExecutiveRow): FormValues {
  return {
    full_name: profile.full_name ?? '',
    display_name: profile.display_name ?? '',
    role: profile.role ?? '',
    contact_email: profile.contact_email ?? '',
    phone: phoneFieldFromProfile(profile.phone_display ?? '', profile.phone_e164 ?? ''),
  };
}

function lengthError(value: string, limits: { min: number; max: number }, empty: string, label: string): string | undefined {
  const v = value.trim();
  if (!v) return empty;
  if (v.length < limits.min) return `${label} precisa ter pelo menos ${limits.min} caracteres.`;
  if (v.length > limits.max) return `${label} pode ter até ${limits.max} caracteres.`;
  return undefined;
}

function validate(values: FormValues): Errors {
  const errors: Errors = {};
  errors.full_name = lengthError(values.full_name, FIELD_LIMITS.full_name, 'Informe seu nome completo.', 'O nome');
  errors.display_name = lengthError(values.display_name, FIELD_LIMITS.display_name, 'Informe como quer ser chamado(a).', 'O nome de apresentação');
  errors.role = lengthError(values.role, FIELD_LIMITS.role, 'Informe seu cargo.', 'O cargo');
  const email = values.contact_email.trim();
  errors.contact_email = !email
    ? 'Informe o e-mail que o cliente vai usar.'
    : email.length > FIELD_LIMITS.contact_email.max
      ? 'E-mail longo demais.'
      : !CONTACT_EMAIL_PATTERN.test(email) || email.length < FIELD_LIMITS.contact_email.min
        ? 'Confira o e-mail: ele precisa ter “@” e domínio, como nome@credmhs.com.br.'
        : undefined;
  const phone = parsePhone(values.phone);
  errors.phone = phone.ok ? undefined : PHONE_MESSAGES[phone.reason];
  for (const key of FIELD_ORDER) if (!errors[key]) delete errors[key];
  return errors;
}

type SaveState = { name: 'idle' } | { name: 'saving'; step: string } | { name: 'saved' } | { name: 'error'; message: string };

interface ProfileEditorProps {
  profile: ExecutiveRow;
  userId: string;
  onSaved: (profile: ExecutiveRow) => void;
  onSessionExpired: () => void;
}

export function ProfileEditor({ profile, userId, onSaved, onSessionExpired }: ProfileEditorProps) {
  const initialValues = useMemo(() => valuesFrom(profile), [profile]);
  const [values, setValues] = useState<FormValues>(initialValues);
  const [touched, setTouched] = useState<Partial<Record<FieldName, boolean>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [pending, setPending] = useState<PendingPhoto | null>(null);
  const [save, setSave] = useState<SaveState>({ name: 'idle' });
  const formRef = useRef<HTMLFormElement>(null);

  const errors = useMemo(() => validate(values), [values]);
  const phone = parsePhone(values.phone);

  const changedText = FIELD_ORDER.filter((key) => values[key].trim() !== initialValues[key].trim());
  const dirty = changedText.length > 0 || pending !== null;
  const saving = save.name === 'saving';

  // Alterações pendentes: aviso do navegador ao fechar/recarregar e confirmação em "Sair".
  useEffect(() => {
    setUnsavedChanges(dirty);
    if (!dirty) return;
    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, [dirty]);

  useEffect(() => () => setUnsavedChanges(false), []);

  // Revoga a URL local da foto descartada.
  const pendingUrl = pending?.url;
  useEffect(() => {
    if (!pendingUrl) return;
    return () => URL.revokeObjectURL(pendingUrl);
  }, [pendingUrl]);

  function setField(name: FieldName, value: string) {
    setValues((v) => ({ ...v, [name]: value }));
    if (save.name === 'saved' || save.name === 'error') setSave({ name: 'idle' });
  }

  function showError(name: FieldName): string | undefined {
    return touched[name] || submitted ? errors[name] : undefined;
  }

  function discard() {
    setValues(initialValues);
    setPending(null);
    setTouched({});
    setSubmitted(false);
    setSave({ name: 'idle' });
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (saving || !dirty) return;
    setSubmitted(true);
    const firstInvalid = FIELD_ORDER.find((key) => errors[key]);
    if (firstInvalid) {
      setSave({ name: 'error', message: 'Revise os campos destacados antes de salvar.' });
      formRef.current?.querySelector<HTMLInputElement>(`[name="${firstInvalid}"]`)?.focus();
      return;
    }

    const update: ExecutiveUpdate = {};
    for (const key of changedText) {
      if (key === 'phone') continue;
      update[key] = values[key].trim();
    }
    if (changedText.includes('phone') && phone.ok) {
      update.phone_e164 = phone.value.e164;
      update.phone_display = phone.value.display;
    }

    let uploadedPath: string | null = null;
    try {
      if (pending) {
        setSave({ name: 'saving', step: 'Enviando a foto…' });
        uploadedPath = await uploadOwnPhoto(userId, pending.optimized);
        update.photo_path = uploadedPath;
        update.photo_width = pending.optimized.width;
        update.photo_height = pending.optimized.height;
      }
      setSave({ name: 'saving', step: 'Salvando…' });
      const saved = await updateOwnProfile(profile.id, update);
      // Perfil salvo: o arquivo anterior (se era do próprio usuário) deixa de ser usado.
      if (uploadedPath && profile.photo_path && profile.photo_path !== uploadedPath) {
        void removeOwnPhoto(userId, profile.photo_path);
      }
      setPending(null);
      setTouched({});
      setSubmitted(false);
      setUnsavedChanges(false);
      onSaved(saved);
      setValues(valuesFrom(saved));
      setSave({ name: 'saved' });
    } catch (err) {
      // Falhou depois do envio: apaga o arquivo novo para não deixar órfão.
      if (uploadedPath) void removeOwnPhoto(userId, uploadedPath);
      const mapped = err instanceof PanelError ? err : toPanelError(err, 'salvar');
      if (mapped.kind === 'session-expired') {
        onSessionExpired();
        return;
      }
      setSave({ name: 'error', message: mapped.message });
    }
  }

  const storedUrl = photoPublicUrl(profile.photo_path);
  const defaultUrl = !profile.photo_path ? DEFAULT_PORTRAITS[profile.slug] ?? null : null;
  const currentUrl = storedUrl ?? defaultUrl;
  const previewPhoto = pending?.url ?? currentUrl;
  const firstLetter = (values.display_name.trim() || values.full_name.trim() || '?').charAt(0).toUpperCase();
  const altName = values.full_name.trim() || profile.full_name;

  const statusText =
    save.name === 'saving'
      ? save.step
      : save.name === 'saved'
        ? 'Alterações salvas. Elas aparecem na próxima vez que o link da apresentação for aberto.'
        : dirty
          ? pending && changedText.length === 0
            ? 'Nova foto ainda não salva.'
            : `${changedText.length + (pending ? 1 : 0)} ${changedText.length + (pending ? 1 : 0) === 1 ? 'alteração não salva' : 'alterações não salvas'}.`
          : 'Tudo salvo.';

  return (
    <div className={styles.page}>
      <div className={`container ${styles.inner}`}>
        <header className={styles.intro}>
          <p className={`t-eyebrow ${styles.eyebrow}`}>Painel do executivo</p>
          <h1 className={`t-h1 ${styles.title}`}>Seu perfil na apresentação</h1>
          <p className={`t-lead ${styles.lead}`}>
            O que você salvar aqui aparece para o cliente na abertura e no contato da apresentação da CRED MHS.
          </p>
        </header>

        <LinkBlock slug={profile.slug} isActive={profile.is_active} />

        <div className={styles.grid}>
          <form id="perfil" ref={formRef} className={styles.form} onSubmit={handleSubmit} noValidate aria-busy={saving}>
            <fieldset className={styles.group} disabled={saving}>
              <legend className={`t-h3 ${styles.groupTitle}`}>Como você se apresenta</legend>
              <TextField
                name="full_name"
                label="Nome completo"
                hint="Aparece acima do título da abertura."
                autoComplete="name"
                maxLength={FIELD_LIMITS.full_name.max}
                value={values.full_name}
                error={showError('full_name')}
                onChange={(v) => setField('full_name', v)}
                onBlur={() => setTouched((t) => ({ ...t, full_name: true }))}
              />
              <TextField
                name="display_name"
                label="Nome de apresentação"
                hint={
                  <>
                    Como o cliente vai chamar você. Entra no título “Olá, eu sou {values.display_name.trim() || '…'}.” e nos botões
                    de contato. Normalmente, o primeiro nome.
                  </>
                }
                autoComplete="given-name"
                maxLength={FIELD_LIMITS.display_name.max}
                value={values.display_name}
                error={showError('display_name')}
                onChange={(v) => setField('display_name', v)}
                onBlur={() => setTouched((t) => ({ ...t, display_name: true }))}
              />
              <TextField
                name="role"
                label="Cargo"
                hint="Como prefere ser apresentado(a), por exemplo: Executiva de Negócios."
                autoComplete="organization-title"
                maxLength={FIELD_LIMITS.role.max}
                value={values.role}
                error={showError('role')}
                onChange={(v) => setField('role', v)}
                onBlur={() => setTouched((t) => ({ ...t, role: true }))}
              />
            </fieldset>

            <fieldset className={styles.group} disabled={saving}>
              <legend className={`t-h3 ${styles.groupTitle}`}>Como o cliente fala com você</legend>
              <TextField
                name="contact_email"
                label={
                  <>
                    <span className="nowrap">E-mail</span> de contato
                  </>
                }
                hint="É o e-mail que o cliente vê e para onde vai a mensagem preparada na apresentação. Pode ser diferente do e-mail que você usa para entrar no painel."
                type="email"
                inputMode="email"
                autoComplete="email"
                autoCapitalize="none"
                spellCheck={false}
                maxLength={FIELD_LIMITS.contact_email.max}
                value={values.contact_email}
                error={showError('contact_email')}
                onChange={(v) => setField('contact_email', v)}
                onBlur={() => setTouched((t) => ({ ...t, contact_email: true }))}
              />
              <TextField
                name="phone"
                label="Telefone"
                hint="Com DDD. Para número de fora do Brasil, comece com + e o código do país."
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                maxLength={24}
                value={values.phone}
                error={showError('phone')}
                onChange={(v) => setField('phone', v)}
                onBlur={() => setTouched((t) => ({ ...t, phone: true }))}
                after={
                  phone.ok ? (
                    <p className={styles.phoneResult}>
                      O cliente verá <strong>{phone.value.display}</strong>. O botão de ligar disca{' '}
                      <span className={styles.mono}>{phone.value.e164}</span>.
                    </p>
                  ) : null
                }
              />
            </fieldset>

            <fieldset className={styles.group} disabled={saving}>
              <legend className={`t-h3 ${styles.groupTitle}`}>Sua foto</legend>
              <PhotoField
                currentUrl={currentUrl}
                currentIsDefault={!storedUrl && !!defaultUrl}
                initial={firstLetter}
                alt={`Retrato de ${altName}`}
                pending={pending}
                onPendingChange={(p) => {
                  setPending(p);
                  if (save.name !== 'saving') setSave({ name: 'idle' });
                }}
                disabled={saving}
              />
            </fieldset>
          </form>

          <aside className={styles.previewCol}>
            <Preview
              displayName={values.display_name}
              fullName={values.full_name}
              role={values.role}
              email={values.contact_email}
              phoneDisplay={phone.ok ? phone.value.display : values.phone.trim()}
              photoUrl={previewPhoto}
              initial={firstLetter}
            />
          </aside>
        </div>
      </div>

      <div className={styles.saveBar} data-dirty={dirty} data-state={save.name}>
        <div className={`container ${styles.saveInner}`}>
          <div className={styles.saveStatus}>
            <p role="status" aria-live="polite" className={styles.saveText}>
              {save.name === 'error' ? '' : statusText}
            </p>
            {save.name === 'error' ? (
              <p role="alert" className={styles.saveError}>
                {save.message}
              </p>
            ) : null}
          </div>
          <div className={styles.saveActions}>
            {dirty && !saving ? (
              <Button variant="link" onClick={discard}>
                Descartar
              </Button>
            ) : null}
            <Button type="submit" form="perfil" disabled={!dirty || saving}>
              {saving ? 'Salvando…' : save.name === 'error' && dirty ? 'Tentar de novo' : 'Salvar alterações'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value' | 'name'> {
  name: FieldName;
  label: ReactNode;
  hint?: ReactNode;
  error?: string;
  value: string;
  onChange: (value: string) => void;
  after?: ReactNode;
}

function TextField({ name, label, hint, error, value, onChange, after, type = 'text', ...rest }: TextFieldProps) {
  const id = useId();
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  return (
    <div className="field-group">
      <label className="field-label" htmlFor={id}>
        {label}
      </label>
      <input
        {...rest}
        id={id}
        name={name}
        type={type}
        className="field"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={error ? true : undefined}
        aria-describedby={[hintId, errorId].filter(Boolean).join(' ') || undefined}
      />
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
      {after}
    </div>
  );
}
