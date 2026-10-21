import { useEffect, useMemo, useRef, useState } from 'react';
import type { ExecutiveResolution } from '../types';
import { resolveExecutive, resolveLocalExecutive } from '../lib/executive';
import { getSupabaseConfig } from '../lib/supabase/config';
import { photoPublicUrl } from '../lib/supabase/storage';
import { ExecutiveProvider } from '../state';
import App from './App';
import { StatusScreen } from './status/StatusScreen';
import { BASE_DOCUMENT_TITLE } from './status/statusCopy';

type View = { status: 'loading' } | ExecutiveResolution;

/**
 * Raiz da apresentação pública: resolve o executivo de `?executivo=<slug>` ANTES de montar a
 * página, para nunca exibir conteúdo de outro executivo enquanto o perfil carrega.
 * - Sem Supabase configurado: resolução local e síncrona (sem tela de carregamento).
 * - Com Supabase: carregamento → RPC pública → página, "não encontrada", "indisponível" ou
 *   erro com "Tentar novamente" (refaz a requisição sem recarregar).
 * A página só é montada depois da resolução, dentro de <ExecutiveProvider> (sem estado de sessão do visitante).
 */
export default function PresentationRoot() {
  const config = useMemo(() => getSupabaseConfig(), []);
  const search = typeof window !== 'undefined' ? window.location.search : '';
  const [view, setView] = useState<View>(() => (config ? { status: 'loading' } : resolveLocalExecutive(search)));
  const [attempt, setAttempt] = useState(0);
  const userTriggered = useRef(false);

  useEffect(() => {
    if (!config) return;
    const controller = new AbortController();
    setView({ status: 'loading' });
    resolveExecutive(search, { config, signal: controller.signal, photoUrlFor: photoPublicUrl })
      .then((result) => {
        if (!controller.signal.aborted) setView(result);
      })
      .catch(() => {
        // resolveExecutive não lança; defesa para não deixar a tela presa no carregamento.
        if (!controller.signal.aborted) setView(resolveLocalExecutive(''));
      });
    return () => controller.abort();
  }, [config, search, attempt]);

  const ready = view.status === 'ready' ? view : null;

  useEffect(() => {
    if (!ready) return;
    document.title = BASE_DOCUMENT_TITLE;
    // Depois de "Tentar novamente", o botão some: leva o foco ao início da apresentação.
    if (userTriggered.current) {
      userTriggered.current = false;
      requestAnimationFrame(() => document.getElementById('conteudo')?.focus({ preventScroll: true }));
    }
  }, [ready]);

  if (ready) {
    // key: outro executivo na mesma aba remonta a página do zero (nenhum estado local herdado).
    return (
      <ExecutiveProvider resolution={ready} key={ready.executive.id}>
        <App />
      </ExecutiveProvider>
    );
  }

  if (view.status === 'loading') return <StatusScreen kind="loading" autoFocus={userTriggered.current} />;
  if (view.status === 'error') {
    return (
      <StatusScreen
        kind="error"
        onRetry={() => {
          userTriggered.current = true;
          setAttempt((n) => n + 1);
        }}
      />
    );
  }
  return <StatusScreen kind={view.status === 'unavailable' ? 'unavailable' : 'not-found'} />;
}
