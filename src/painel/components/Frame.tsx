import type { ReactNode } from 'react';
import styles from './Frame.module.css';

interface FrameProps {
  /** E-mail de login, mostrado ao lado de "Sair" quando há sessão. */
  userEmail?: string | null;
  onSignOut?: () => void;
  children: ReactNode;
}

/** Moldura do painel: logo oficial, rótulo da área e "Sair". */
export function Frame({ userEmail, onSignOut, children }: FrameProps) {
  return (
    <div className={styles.frame}>
      <a className="skip-link" href="#conteudo">
        Pular para o conteúdo
      </a>
      <header className={styles.header}>
        <div className={`container ${styles.headerInner}`}>
          <div className={styles.brand}>
            <img src="/brand/cred-mhs-logo.svg" alt="CRED MHS" width={160} height={48} className={styles.logo} />
            <span className={styles.area}>Painel do executivo</span>
          </div>
          {onSignOut ? (
            <div className={styles.session}>
              {userEmail ? (
                <span className={styles.user}>
                  <span className="visually-hidden">Conectado como </span>
                  {userEmail}
                </span>
              ) : null}
              <button type="button" className={styles.signOut} onClick={onSignOut}>
                Sair
              </button>
            </div>
          ) : null}
        </div>
      </header>
      <main id="conteudo" className={styles.main} tabIndex={-1}>
        {children}
      </main>
    </div>
  );
}
