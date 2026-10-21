import { createContext, useContext, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Executive, ExecutiveResolution } from '../types';
import { clearLegacySession } from './legacySession';

/** Resolução concluída com perfil (as telas de "não encontrada"/erro não montam a página). */
export type ReadyResolution = Extract<ExecutiveResolution, { status: 'ready' }>;

const ExecutiveContext = createContext<ReadyResolution | null>(null);

/**
 * Disponibiliza o executivo resolvido (src/app/PresentationRoot.tsx) para as seções.
 * A V2 não tem estado de sessão do visitante: só o perfil de quem enviou o link.
 */
export function ExecutiveProvider({ resolution, children }: { resolution: ReadyResolution; children: ReactNode }) {
  useEffect(() => {
    clearLegacySession();
  }, []);
  return <ExecutiveContext.Provider value={resolution}>{children}</ExecutiveContext.Provider>;
}

/** Resolução completa (origem local/remota, motivo). Uso interno. */
export function useExecutiveResolution(): ReadyResolution {
  const value = useContext(ExecutiveContext);
  if (!value) throw new Error('useExecutive usado fora de <ExecutiveProvider> (executivo ainda não resolvido).');
  return value;
}

/** Executivo resolvido pela URL (`?executivo=`). */
export function useExecutive(): Executive {
  return useExecutiveResolution().executive;
}
