/** Alterações não salvas no editor (lido por "Sair" e pelo aviso de saída da página). */
let pending = false;

export function setUnsavedChanges(value: boolean): void {
  pending = value;
}

export function hasUnsavedChanges(): boolean {
  return pending;
}

/** Confirma a saída quando há alterações pendentes. */
export function confirmDiscard(): boolean {
  if (!pending) return true;
  return window.confirm('Você tem alterações que ainda não foram salvas. Sair mesmo assim?');
}
