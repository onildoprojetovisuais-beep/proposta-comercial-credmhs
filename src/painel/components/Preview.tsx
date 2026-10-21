import { copy } from '../../content/chapters';
import { formatTemplate } from '../../lib/format';
import styles from './Preview.module.css';

interface PreviewProps {
  displayName: string;
  fullName: string;
  role: string;
  email: string;
  phoneDisplay: string;
  photoUrl: string | null;
  initial: string;
}

/**
 * Prévia compacta da abertura e do contato da apresentação V2, com a mesma copy (copy.abertura / copy.contato).
 * Não é interativa: os "botões" são só ilustração.
 */
export function Preview({ displayName, fullName, role, email, phoneDisplay, photoUrl, initial }: PreviewProps) {
  const first = displayName.trim() || '…';
  const title = formatTemplate(copy.abertura.greetingTemplate, { firstName: first });
  return (
    <section className={styles.preview} aria-labelledby="previa-titulo">
      <header className={styles.head}>
        <h2 id="previa-titulo" className="t-h4">
          Como o cliente vê
        </h2>
        <p className={styles.headNote}>Prévia simplificada. Muda enquanto você edita; a apresentação só muda quando você salvar.</p>
      </header>

      <div className={styles.opening} role="group" aria-label="Prévia da abertura">
        <p className={styles.tag}>Abertura</p>
        <div className={styles.openingGrid}>
          <div className={styles.portrait}>
            <span className={styles.sun} aria-hidden="true" />
            {photoUrl ? (
              <img src={photoUrl} alt="" className={styles.photo} />
            ) : (
              <span className={styles.placeholder} aria-hidden="true">
                {initial}
              </span>
            )}
          </div>
          <div className={styles.openingText}>
            <p className={styles.identity}>
              <span className={styles.name}>{fullName.trim() || 'Nome completo'}</span>
              <span className={styles.role}>{role.trim() || 'Cargo'}</span>
            </p>
            <p className={styles.title}>{title}</p>
          </div>
        </div>
      </div>

      <div className={styles.contact} role="group" aria-label="Prévia do contato" data-surface="dark">
        <p className={styles.tag}>Contato</p>
        <p className={styles.contactTitle}>{copy.contato.title}</p>
        <span className={styles.fakeCta} aria-hidden="true">
          {copy.contato.actions.email}
        </span>
        <dl className={styles.contactList}>
          <div>
            <dt>E-mail</dt>
            <dd>{email.trim() || '—'}</dd>
          </div>
          <div>
            <dt>{formatTemplate(copy.contato.actions.phoneTemplate, { firstName: first })}</dt>
            <dd>{phoneDisplay || '—'}</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
