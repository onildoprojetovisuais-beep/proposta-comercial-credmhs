import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import type { FormEvent, ReactNode } from 'react';
import { Button, IconCheck, IconPlus } from '../../components/ui';
import { createMember, inviteMember, listTeam, resendAccess, setMemberActive, slugFromName } from '../../lib/supabase/admin';
import type { AccessStatus, TeamMember } from '../../lib/supabase/admin';
import { PanelError, toPanelError } from '../../lib/supabase/panel';
import { buildPresentationLink, isValidSlug } from '../../lib/supabase/slug';
import { photoPublicUrl } from '../../lib/supabase/storage';
import { CONTACT_EMAIL_PATTERN, FIELD_LIMITS } from '../../lib/supabase/types';
import { PHONE_MESSAGES, parsePhone } from '../phone';
import { Notice } from './AuthLayout';
import { LoadingView } from './LoadingView';
import editor from './Editor.module.css';
import styles from './Team.module.css';

const STATUS_LABEL: Record<AccessStatus, string> = {
  'sem-acesso': 'Sem acesso ao painel',
  'convite-pendente': 'Convite enviado, aguardando',
  ativo: 'Acesso ativo',
  bloqueado: 'Acesso bloqueado',
};

type ListState = { name: 'loading' } | { name: 'error'; message: string } | { name: 'ready'; members: TeamMember[] };

interface TeamAdminProps {
  onSessionExpired: () => void;
}

/** Aba "Equipe": a administração da CRED cadastra, convida e desativa pessoas sem depender do suporte. */
export function TeamAdmin({ onSessionExpired }: TeamAdminProps) {
  const [list, setList] = useState<ListState>({ name: 'loading' });
  const [adding, setAdding] = useState(false);
  const [flash, setFlash] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const members = await listTeam();
      setList({ name: 'ready', members });
    } catch (err) {
      const mapped = toPanelError(err);
      if (mapped.kind === 'session-expired') return onSessionExpired();
      setList({ name: 'error', message: mapped.message });
    }
  }, [onSessionExpired]);

  useEffect(() => {
    void load();
  }, [load]);

  const handleError = useCallback(
    (err: unknown): string => {
      const mapped = err instanceof PanelError ? err : toPanelError(err);
      if (mapped.kind === 'session-expired') onSessionExpired();
      return mapped.message;
    },
    [onSessionExpired],
  );

  const takenSlugs = useMemo(() => (list.name === 'ready' ? new Set(list.members.map((m) => m.slug)) : new Set<string>()), [list]);

  return (
    <div className={styles.page}>
      <div className={`container ${editor.inner}`}>
        <header className={editor.intro}>
          <p className={`t-eyebrow ${editor.eyebrow}`}>Administração</p>
          <h1 className={`t-h1 ${editor.title}`}>Equipe na apresentação</h1>
          <p className={`t-lead ${editor.lead}`}>
            Cadastre quem entra na equipe e o convite sai por e-mail. Cada pessoa cria a própria senha e cuida da sua foto e
            dos seus contatos.
          </p>
        </header>

        {flash ? (
          <Notice tone="success">
            <span className={styles.flash}>
              {flash}
              <button type="button" className={styles.flashClose} onClick={() => setFlash(null)}>
                Fechar
              </button>
            </span>
          </Notice>
        ) : null}

        {adding ? (
          <AddMemberForm
            takenSlugs={takenSlugs}
            onCancel={() => setAdding(false)}
            onError={handleError}
            onCreated={(name, email) => {
              setAdding(false);
              setFlash(`${name} foi cadastrada(o). O convite foi enviado para ${email}. Peça para olhar também a caixa de spam.`);
              void load();
            }}
          />
        ) : (
          <div>
            <Button iconBefore={<IconPlus />} onClick={() => setAdding(true)} disabled={list.name !== 'ready'}>
              Adicionar pessoa
            </Button>
          </div>
        )}

        <section aria-labelledby="equipe-lista" className={styles.listSection}>
          <h2 id="equipe-lista" className={`t-h3 ${styles.listTitle}`}>
            Pessoas cadastradas
            {list.name === 'ready' ? <span className={styles.count}>{list.members.length}</span> : null}
          </h2>
          {list.name === 'loading' ? <LoadingView label="Carregando a equipe…" /> : null}
          {list.name === 'error' ? (
            <div className={styles.stack}>
              <Notice tone="error">{list.message}</Notice>
              <div>
                <Button variant="secondary" onClick={() => void load()}>
                  Tentar de novo
                </Button>
              </div>
            </div>
          ) : null}
          {list.name === 'ready' ? (
            <ul className={styles.list}>
              {list.members.map((member) => (
                <MemberRow key={member.id} member={member} onChanged={load} onError={handleError} onFlash={setFlash} />
              ))}
            </ul>
          ) : null}
        </section>
      </div>
    </div>
  );
}

/* ---------------- Cadastro ---------------- */

interface AddValues {
  full_name: string;
  display_name: string;
  role: string;
  contact_email: string;
  phone: string;
  login_email: string;
  slug: string;
}
type AddField = keyof AddValues;
const ADD_ORDER: AddField[] = ['full_name', 'display_name', 'role', 'contact_email', 'phone', 'login_email', 'slug'];

function emailError(value: string, empty: string): string | undefined {
  const v = value.trim();
  if (!v) return empty;
  if (v.length > FIELD_LIMITS.contact_email.max) return 'E-mail longo demais.';
  if (!CONTACT_EMAIL_PATTERN.test(v) || v.length < FIELD_LIMITS.contact_email.min) return 'Confira o e-mail: ele precisa ter “@” e domínio.';
  return undefined;
}

function sizeError(value: string, limits: { min: number; max: number }, empty: string): string | undefined {
  const v = value.trim();
  if (!v) return empty;
  if (v.length < limits.min) return `Use pelo menos ${limits.min} caracteres.`;
  if (v.length > limits.max) return `Use até ${limits.max} caracteres.`;
  return undefined;
}

function validateAdd(values: AddValues, takenSlugs: Set<string>): Partial<Record<AddField, string>> {
  const phone = parsePhone(values.phone);
  const slug = values.slug.trim();
  const errors: Partial<Record<AddField, string>> = {
    full_name: sizeError(values.full_name, FIELD_LIMITS.full_name, 'Informe o nome completo.'),
    display_name: sizeError(values.display_name, FIELD_LIMITS.display_name, 'Informe o nome de apresentação.'),
    role: sizeError(values.role, FIELD_LIMITS.role, 'Informe o cargo.'),
    contact_email: emailError(values.contact_email, 'Informe o e-mail que o cliente vai ver.'),
    phone: phone.ok ? undefined : PHONE_MESSAGES[phone.reason],
    login_email: emailError(values.login_email, 'Informe o e-mail que vai receber o convite.'),
    slug: !slug
      ? 'Informe o final do link.'
      : !isValidSlug(slug)
        ? 'Use só letras minúsculas sem acento, números e hífen (ex.: ana-souza).'
        : takenSlugs.has(slug)
          ? 'Já existe uma pessoa com este link. Acrescente o sobrenome, por exemplo.'
          : undefined,
  };
  for (const key of ADD_ORDER) if (!errors[key]) delete errors[key];
  return errors;
}

interface AddMemberFormProps {
  takenSlugs: Set<string>;
  onCancel: () => void;
  onCreated: (name: string, email: string) => void;
  onError: (err: unknown) => string;
}

function AddMemberForm({ takenSlugs, onCancel, onCreated, onError }: AddMemberFormProps) {
  const [values, setValues] = useState<AddValues>({
    full_name: '',
    display_name: '',
    role: '',
    contact_email: '',
    phone: '',
    login_email: '',
    slug: '',
  });
  // Campos derivados acompanham o nome / e-mail até a pessoa editá-los à mão.
  const [manual, setManual] = useState<Partial<Record<'display_name' | 'login_email' | 'slug', boolean>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const titleId = useId();

  const errors = useMemo(() => validateAdd(values, takenSlugs), [values, takenSlugs]);
  const phone = parsePhone(values.phone);

  useEffect(() => {
    formRef.current?.querySelector<HTMLInputElement>('input[name="full_name"]')?.focus();
  }, []);

  function setField(name: AddField, value: string) {
    setError(null);
    setValues((v) => {
      const next = { ...v, [name]: value };
      if (name === 'full_name') {
        if (!manual.display_name) next.display_name = value.trim().split(/\s+/)[0] ?? '';
        if (!manual.slug) next.slug = slugFromName(value);
      }
      if (name === 'contact_email' && !manual.login_email) next.login_email = value.trim();
      return next;
    });
    if (name === 'display_name' || name === 'login_email' || name === 'slug') setManual((m) => ({ ...m, [name]: true }));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (saving) return;
    setSubmitted(true);
    const firstInvalid = ADD_ORDER.find((key) => errors[key]);
    if (firstInvalid || !phone.ok) {
      formRef.current?.querySelector<HTMLInputElement>(`[name="${firstInvalid ?? 'phone'}"]`)?.focus();
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await createMember(
        {
          full_name: values.full_name.trim(),
          display_name: values.display_name.trim(),
          role: values.role.trim(),
          contact_email: values.contact_email.trim(),
          phone_display: phone.value.display,
          phone_e164: phone.value.e164,
        },
        values.slug.trim(),
        values.login_email.trim(),
      );
      onCreated(values.display_name.trim() || values.full_name.trim(), values.login_email.trim());
    } catch (err) {
      setError(onError(err));
      setSaving(false);
    }
  }

  const show = (name: AddField) => (submitted ? errors[name] : undefined);
  const slugOk = isValidSlug(values.slug.trim());

  return (
    <form ref={formRef} className={`panel-action ${styles.addForm}`} onSubmit={handleSubmit} noValidate aria-labelledby={titleId} aria-busy={saving}>
      <h2 id={titleId} className={`t-h3 ${styles.addTitle}`}>
        Nova pessoa na equipe
      </h2>
      <fieldset className={editor.group} disabled={saving}>
        <legend className={`t-h4 ${editor.groupTitle}`}>Como aparece para o cliente</legend>
        <Field name="full_name" label="Nome completo" autoComplete="off" maxLength={FIELD_LIMITS.full_name.max} value={values.full_name} error={show('full_name')} onChange={setField} />
        <Field
          name="display_name"
          label="Nome de apresentação"
          hint="Entra em “Olá, eu sou …”. Normalmente, o primeiro nome."
          autoComplete="off"
          maxLength={FIELD_LIMITS.display_name.max}
          value={values.display_name}
          error={show('display_name')}
          onChange={setField}
        />
        <Field name="role" label="Cargo" hint="Ex.: Executiva de Negócios." autoComplete="off" maxLength={FIELD_LIMITS.role.max} value={values.role} error={show('role')} onChange={setField} />
        <Field
          name="contact_email"
          label="E-mail de contato"
          hint="O e-mail que o cliente vê na apresentação."
          type="email"
          inputMode="email"
          autoComplete="off"
          maxLength={FIELD_LIMITS.contact_email.max}
          value={values.contact_email}
          error={show('contact_email')}
          onChange={setField}
        />
        <Field
          name="phone"
          label="Telefone"
          hint="Com DDD."
          type="tel"
          inputMode="tel"
          autoComplete="off"
          maxLength={24}
          value={values.phone}
          error={show('phone')}
          onChange={setField}
          after={phone.ok ? <p className={editor.phoneResult}>O cliente verá <strong>{phone.value.display}</strong>.</p> : null}
        />
      </fieldset>

      <fieldset className={editor.group} disabled={saving}>
        <legend className={`t-h4 ${editor.groupTitle}`}>Acesso e link</legend>
        <Field
          name="login_email"
          label="E-mail de acesso ao painel"
          hint="Recebe o convite para criar a senha. Pode ser o mesmo e-mail de contato."
          type="email"
          inputMode="email"
          autoComplete="off"
          maxLength={FIELD_LIMITS.contact_email.max}
          value={values.login_email}
          error={show('login_email')}
          onChange={setField}
        />
        <Field
          name="slug"
          label="Final do link da apresentação"
          hint={
            <>
              {slugOk ? (
                <>
                  O link será <span className={styles.linkPreview}>{buildPresentationLink(values.slug.trim())}</span>.{' '}
                </>
              ) : null}
              <strong>Não muda depois</strong>, mesmo que o nome seja alterado.
            </>
          }
          autoComplete="off"
          autoCapitalize="none"
          spellCheck={false}
          maxLength={64}
          value={values.slug}
          error={show('slug')}
          onChange={(name, value) => setField(name, value.toLowerCase())}
        />
      </fieldset>

      <p className={styles.addNote}>A foto fica com a própria pessoa: ela envia pelo painel depois de aceitar o convite.</p>

      {error ? <Notice tone="error">{error}</Notice> : null}
      {submitted && Object.keys(errors).length > 0 && !error ? <Notice tone="error">Revise os campos destacados.</Notice> : null}

      <div className={styles.addActions}>
        <Button type="submit" disabled={saving}>
          {saving ? 'Cadastrando e enviando…' : 'Cadastrar e enviar convite'}
        </Button>
        <Button variant="link" onClick={onCancel} disabled={saving}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}

interface FieldProps {
  name: AddField;
  label: ReactNode;
  hint?: ReactNode;
  error?: string;
  value: string;
  onChange: (name: AddField, value: string) => void;
  after?: ReactNode;
  type?: string;
  inputMode?: 'email' | 'tel' | 'text';
  autoComplete?: string;
  autoCapitalize?: string;
  spellCheck?: boolean;
  maxLength?: number;
}

function Field({ name, label, hint, error, value, onChange, after, type = 'text', ...rest }: FieldProps) {
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
        onChange={(e) => onChange(name, e.target.value)}
        aria-invalid={error ? true : undefined}
        aria-describedby={[hintId, errorId].filter(Boolean).join(' ') || undefined}
      />
      {hint ? (
        <p id={hintId} className="field-hint">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} className={editor.fieldError}>
          {error}
        </p>
      ) : null}
      {after}
    </div>
  );
}

/* ---------------- Linha da lista ---------------- */

type RowAction = 'idle' | 'invite-form' | 'confirm-deactivate' | 'busy';

interface MemberRowProps {
  member: TeamMember;
  onChanged: () => Promise<void>;
  onError: (err: unknown) => string;
  onFlash: (text: string) => void;
}

function MemberRow({ member, onChanged, onError, onFlash }: MemberRowProps) {
  const [action, setAction] = useState<RowAction>('idle');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [inviteEmail, setInviteEmail] = useState(member.contact_email);
  const inviteId = useId();
  const link = buildPresentationLink(member.slug);
  const photo = photoPublicUrl(member.photo_path);
  const name = member.display_name || member.full_name;

  async function run(task: () => Promise<string>) {
    setAction('busy');
    setError(null);
    try {
      const message = await task();
      onFlash(message);
      await onChanged();
      setAction('idle');
    } catch (err) {
      setError(onError(err));
      setAction('idle');
    }
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 3000);
    } catch {
      setError(`Não foi possível copiar. O link é: ${link}`);
    }
  }

  const canDeactivate = member.is_active && !member.is_default && !member.is_self;
  const busy = action === 'busy';

  return (
    <li className={styles.row} data-inactive={!member.is_active}>
      <div className={styles.who}>
        {photo ? (
          <img className={styles.avatar} src={photo} alt="" width={56} height={56} loading="lazy" />
        ) : (
          <span className={styles.avatar} aria-hidden="true">
            {name.charAt(0).toUpperCase()}
          </span>
        )}
        <div className={styles.whoText}>
          <p className={styles.name}>
            {member.full_name}
            {member.is_self ? <span className={styles.tag}>você</span> : null}
            {member.is_default ? <span className={styles.tag}>perfil padrão</span> : null}
          </p>
          <p className={styles.meta}>{member.role}</p>
          <p className={styles.meta}>
            <span className={styles.status} data-status={member.is_active ? member.access_status : 'inativo'}>
              {member.is_active ? STATUS_LABEL[member.access_status] : 'Desativado: o link não mostra os dados'}
            </span>
            {member.login_email ? <span className={styles.login}> · acesso: {member.login_email}</span> : null}
          </p>
        </div>
      </div>

      <div className={styles.rowActions}>
        {member.is_active ? (
          <Button size="sm" variant="secondary" onClick={copy} iconBefore={copied ? <IconCheck /> : undefined} disabled={busy}>
            {copied ? 'Link copiado' : 'Copiar link'}
          </Button>
        ) : null}

        {member.is_active && member.access_status === 'sem-acesso' && action !== 'invite-form' ? (
          <Button size="sm" variant="secondary" onClick={() => setAction('invite-form')} disabled={busy}>
            Enviar convite
          </Button>
        ) : null}
        {member.is_active && member.access_status === 'convite-pendente' ? (
          <Button size="sm" variant="link" disabled={busy} onClick={() => run(async () => (await resendAccess(member.id), `Convite reenviado para ${member.login_email}.`))}>
            Reenviar convite
          </Button>
        ) : null}
        {member.is_active && member.access_status === 'ativo' && !member.is_self ? (
          <Button
            size="sm"
            variant="link"
            disabled={busy}
            onClick={() => run(async () => (await resendAccess(member.id), `Enviamos para ${member.login_email} um link para criar uma nova senha.`))}
          >
            Enviar link de nova senha
          </Button>
        ) : null}

        {canDeactivate && action !== 'confirm-deactivate' ? (
          <Button size="sm" variant="link" disabled={busy} onClick={() => setAction('confirm-deactivate')}>
            Desativar
          </Button>
        ) : null}
        {!member.is_active ? (
          <Button size="sm" variant="secondary" disabled={busy} onClick={() => run(async () => (await setMemberActive(member.id, true), `${name} foi reativada(o). O link e o acesso voltaram a funcionar.`))}>
            Reativar
          </Button>
        ) : null}
      </div>

      {action === 'confirm-deactivate' ? (
        <div className={styles.confirm} role="group" aria-label={`Confirmar desativação de ${name}`}>
          <p>
            Desativar <strong>{name}</strong>? O link dela(e) deixa de mostrar nome, foto e contatos, e o acesso ao painel é
            bloqueado. Dá para reativar depois.
          </p>
          <div className={styles.confirmActions}>
            <Button size="sm" variant="danger" onClick={() => run(async () => (await setMemberActive(member.id, false), `${name} foi desativada(o).`))}>
              Sim, desativar
            </Button>
            <Button size="sm" variant="link" onClick={() => setAction('idle')}>
              Cancelar
            </Button>
          </div>
        </div>
      ) : null}

      {action === 'invite-form' ? (
        <form
          className={styles.confirm}
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            const email = inviteEmail.trim();
            if (emailError(email, 'x')) {
              setError('Confira o e-mail de acesso.');
              return;
            }
            void run(async () => (await inviteMember(member.id, email), `Convite enviado para ${email}.`));
          }}
        >
          <div className="field-group">
            <label className="field-label" htmlFor={inviteId}>
              E-mail de acesso de {name}
            </label>
            <input id={inviteId} className="field" type="email" inputMode="email" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} />
          </div>
          <div className={styles.confirmActions}>
            <Button size="sm" type="submit">
              Enviar convite
            </Button>
            <Button size="sm" variant="link" onClick={() => setAction('idle')}>
              Cancelar
            </Button>
          </div>
        </form>
      ) : null}

      {busy ? <p className={styles.rowStatus} role="status">Processando…</p> : null}
      {error ? (
        <p className={styles.rowError} role="alert">
          {error}
        </p>
      ) : null}
    </li>
  );
}
