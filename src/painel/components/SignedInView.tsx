import { useCallback, useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { Button } from '../../components/ui';
import { isPanelAdmin } from '../../lib/supabase/admin';
import { getOwnProfile, toPanelError } from '../../lib/supabase/panel';
import type { ExecutiveRow } from '../../lib/supabase/types';
import { AuthLayout, Notice } from './AuthLayout';
import { LoadingView } from './LoadingView';
import { ProfileEditor } from './ProfileEditor';
import { TeamAdmin } from './TeamAdmin';
import { confirmDiscard, setUnsavedChanges } from '../unsaved';
import styles from './Auth.module.css';
import team from './Team.module.css';

type State =
  | { name: 'loading' }
  | { name: 'error'; message: string }
  | { name: 'no-profile'; isAdmin: boolean }
  | { name: 'ready'; profile: ExecutiveRow; isAdmin: boolean };

type Tab = 'perfil' | 'equipe';

interface SignedInViewProps {
  session: Session;
  onSessionExpired: () => void;
  onSignOut: () => void;
}

export function SignedInView({ session, onSessionExpired, onSignOut }: SignedInViewProps) {
  const [state, setState] = useState<State>({ name: 'loading' });
  const [tab, setTab] = useState<Tab>('perfil');
  const userId = session.user.id;

  const load = useCallback(async () => {
    setState({ name: 'loading' });
    try {
      const [profile, isAdmin] = await Promise.all([getOwnProfile(), isPanelAdmin()]);
      setState(profile ? { name: 'ready', profile, isAdmin } : { name: 'no-profile', isAdmin });
    } catch (err) {
      const mapped = toPanelError(err);
      if (mapped.kind === 'session-expired') {
        onSessionExpired();
        return;
      }
      setState({ name: 'error', message: mapped.message });
    }
  }, [onSessionExpired]);

  useEffect(() => {
    void load();
  }, [load, userId]);

  if (state.name === 'loading') return <LoadingView label="Carregando seu perfil…" />;

  if (state.name === 'error') {
    return (
      <AuthLayout eyebrow="Painel do executivo" title="Não foi possível abrir seu perfil">
        <Notice tone="error">{state.message}</Notice>
        <div className={styles.actions}>
          <Button onClick={() => void load()}>Tentar de novo</Button>
        </div>
      </AuthLayout>
    );
  }

  // Administração sem perfil próprio na apresentação (ex.: gestora): só a aba Equipe.
  if (state.name === 'no-profile' && state.isAdmin) return <TeamAdmin onSessionExpired={onSessionExpired} />;

  if (state.name === 'no-profile') {
    return (
      <AuthLayout
        eyebrow="Painel do executivo"
        title="Conta ainda sem perfil"
        lead={<p>Sua conta ainda não está vinculada a um perfil de apresentação. Fale com a administração.</p>}
      >
        <h2 className={styles.sheetTitle}>O que acontece agora</h2>
        <p className={styles.sheetText}>
          A administração da CRED MHS vincula o seu acesso ao seu perfil. Depois disso, é só entrar de novo para editar
          seus dados.
        </p>
        <div className={styles.actions}>
          <Button variant="secondary" onClick={onSignOut}>
            Sair
          </Button>
        </div>
      </AuthLayout>
    );
  }

  const editor = (
    <ProfileEditor
      profile={state.profile}
      userId={userId}
      onSaved={(profile) => setState({ name: 'ready', profile, isAdmin: state.isAdmin })}
      onSessionExpired={onSessionExpired}
    />
  );
  if (!state.isAdmin) return editor;

  function go(next: Tab) {
    if (next === tab) return;
    if (!confirmDiscard()) return;
    setUnsavedChanges(false);
    setTab(next);
  }

  return (
    <>
      <nav className={team.tabsBar} aria-label="Áreas do painel">
        <div className={`container ${team.tabs}`}>
          <button type="button" className={team.tab} aria-current={tab === 'perfil' ? 'page' : undefined} onClick={() => go('perfil')}>
            Meu perfil
          </button>
          <button type="button" className={team.tab} aria-current={tab === 'equipe' ? 'page' : undefined} onClick={() => go('equipe')}>
            Equipe
          </button>
        </div>
      </nav>
      {tab === 'perfil' ? editor : <TeamAdmin onSessionExpired={onSessionExpired} />}
    </>
  );
}
