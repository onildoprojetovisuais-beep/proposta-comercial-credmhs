import { useCallback, useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { getSupabase } from '../lib/supabase/client';
import { adoptSessionTokens, panelMessage, signOut, toPanelError, verifyEmailLink } from '../lib/supabase/panel';
import type { AuthCallback } from './authCallback';
import { confirmDiscard, setUnsavedChanges } from './unsaved';
import { Frame } from './components/Frame';
import { LoadingView } from './components/LoadingView';
import { NotConfiguredView } from './components/NotConfiguredView';
import { SignedOutView } from './components/SignedOutView';
import { SetPasswordView } from './components/SetPasswordView';
import { SignedInView } from './components/SignedInView';

type View =
  | { name: 'loading' }
  | { name: 'unconfigured' }
  | { name: 'signed-out'; notice?: { tone: 'info' | 'error'; text: string } }
  | { name: 'set-password'; reason: 'invite' | 'recovery'; session: Session }
  | { name: 'signed-in'; session: Session };

type Initial = Exclude<View, { name: 'loading' } | { name: 'unconfigured' }>;

/**
 * Resolve a sessão inicial uma única vez (os tokens de link são de uso único;
 * o StrictMode do React roda os efeitos duas vezes em desenvolvimento).
 */
let initialPromise: Promise<Initial> | null = null;

function resolveInitial(callback: AuthCallback): Promise<Initial> {
  if (!initialPromise) initialPromise = computeInitial(callback);
  return initialPromise;
}

async function computeInitial(callback: AuthCallback): Promise<Initial> {
  const supabase = getSupabase();
  if (!supabase) return { name: 'signed-out' };
  const linkError = { name: 'signed-out', notice: { tone: 'error', text: panelMessage('link-invalid') } } as const;
  try {
    switch (callback.kind) {
      case 'error':
        return linkError;
      case 'token-hash': {
        const session = await verifyEmailLink(callback.tokenHash, callback.type);
        return { name: 'set-password', reason: callback.type, session };
      }
      case 'tokens': {
        const session = await adoptSessionTokens(callback.accessToken, callback.refreshToken);
        return callback.type === 'other'
          ? { name: 'signed-in', session }
          : { name: 'set-password', reason: callback.type, session };
      }
      case 'code': {
        // O cliente troca o código durante a inicialização; getSession espera essa etapa.
        const { data } = await supabase.auth.getSession();
        const url = new URL(window.location.href);
        if (url.searchParams.has('code')) {
          url.searchParams.delete('code');
          window.history.replaceState(window.history.state, '', url.pathname + url.search + url.hash);
        }
        if (!data.session) return linkError;
        return { name: 'set-password', reason: callback.type, session: data.session };
      }
      default: {
        const { data } = await supabase.auth.getSession();
        return data.session ? { name: 'signed-in', session: data.session } : { name: 'signed-out' };
      }
    }
  } catch (error) {
    const mapped = toPanelError(error, 'inicialização');
    return { name: 'signed-out', notice: { tone: 'error', text: mapped.message } };
  }
}

export function PainelApp({ callback }: { callback: AuthCallback }) {
  const configured = getSupabase() !== null;
  const [view, setView] = useState<View>(configured ? { name: 'loading' } : { name: 'unconfigured' });

  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase) return;
    let active = true;
    resolveInitial(callback).then((initial) => {
      if (active) setView((current) => (current.name === 'loading' ? initial : current));
    });
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      // Sem chamadas ao Supabase aqui dentro (recomendação da biblioteca): só estado.
      if (!active) return;
      if (event === 'PASSWORD_RECOVERY' && session) {
        setView({ name: 'set-password', reason: 'recovery', session });
      } else if (event === 'SIGNED_OUT') {
        setView((current) => (current.name === 'signed-out' ? current : { name: 'signed-out' }));
      } else if (event === 'TOKEN_REFRESHED' && session) {
        setView((current) => (current.name === 'signed-in' ? { name: 'signed-in', session } : current));
      }
    });
    return () => {
      active = false;
      data.subscription.unsubscribe();
    };
  }, [callback]);

  const handleSignOut = useCallback(async () => {
    if (!confirmDiscard()) return;
    setUnsavedChanges(false);
    await signOut();
    setView({ name: 'signed-out', notice: { tone: 'info', text: 'Você saiu do painel.' } });
  }, []);

  const handleSessionExpired = useCallback(async () => {
    setUnsavedChanges(false);
    await signOut();
    setView({ name: 'signed-out', notice: { tone: 'error', text: panelMessage('session-expired') } });
  }, []);

  switch (view.name) {
    case 'unconfigured':
      return (
        <Frame>
          <NotConfiguredView />
        </Frame>
      );
    case 'loading':
      return (
        <Frame>
          <LoadingView label="Verificando seu acesso…" />
        </Frame>
      );
    case 'signed-out':
      return (
        <Frame>
          <SignedOutView notice={view.notice} onSignedIn={(session) => setView({ name: 'signed-in', session })} />
        </Frame>
      );
    case 'set-password':
      return (
        <Frame userEmail={view.session.user.email} onSignOut={handleSignOut}>
          <SetPasswordView reason={view.reason} onDone={() => setView({ name: 'signed-in', session: view.session })} />
        </Frame>
      );
    case 'signed-in':
      return (
        <Frame userEmail={view.session.user.email} onSignOut={handleSignOut}>
          <SignedInView session={view.session} onSessionExpired={handleSessionExpired} onSignOut={handleSignOut} />
        </Frame>
      );
  }
}
