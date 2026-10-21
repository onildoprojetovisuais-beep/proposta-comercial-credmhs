import { useCallback, useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { Button } from '../../components/ui';
import { getOwnProfile, toPanelError } from '../../lib/supabase/panel';
import type { ExecutiveRow } from '../../lib/supabase/types';
import { AuthLayout, Notice } from './AuthLayout';
import { LoadingView } from './LoadingView';
import { ProfileEditor } from './ProfileEditor';
import styles from './Auth.module.css';

type State =
  | { name: 'loading' }
  | { name: 'error'; message: string }
  | { name: 'no-profile' }
  | { name: 'ready'; profile: ExecutiveRow };

interface SignedInViewProps {
  session: Session;
  onSessionExpired: () => void;
  onSignOut: () => void;
}

export function SignedInView({ session, onSessionExpired, onSignOut }: SignedInViewProps) {
  const [state, setState] = useState<State>({ name: 'loading' });
  const userId = session.user.id;

  const load = useCallback(async () => {
    setState({ name: 'loading' });
    try {
      const profile = await getOwnProfile();
      setState(profile ? { name: 'ready', profile } : { name: 'no-profile' });
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

  return (
    <ProfileEditor
      profile={state.profile}
      userId={userId}
      onSaved={(profile) => setState({ name: 'ready', profile })}
      onSessionExpired={onSessionExpired}
    />
  );
}
