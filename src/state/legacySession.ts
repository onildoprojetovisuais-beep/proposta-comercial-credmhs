/**
 * Chave de sessionStorage da V1 (empresa, prioridades, pauta). A V2 não guarda nada do visitante;
 * a chave é removida uma vez na carga para não deixar dados antigos no navegador.
 */
export const LEGACY_V1_STORAGE_KEY = 'cred-mhs:apresentacao';

let legacyCleared = false;

/** Remove a sessão da V1, se existir. Nunca lança (storage bloqueado, modo privado, sem window). */
export function clearLegacySession(storage?: Pick<Storage, 'removeItem'> | null): void {
  if (legacyCleared && storage === undefined) return;
  legacyCleared = true;
  try {
    const target = storage === undefined ? window.sessionStorage : storage;
    target?.removeItem(LEGACY_V1_STORAGE_KEY);
  } catch {
    // storage indisponível: nada a limpar
  }
}
