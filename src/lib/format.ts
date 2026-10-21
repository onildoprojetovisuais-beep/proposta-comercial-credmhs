/** Substitui {chave} por valores. Chaves ausentes ficam vazias (nunca exibir a chave crua). */
export function formatTemplate(template: string, vars: Record<string, string | number | null | undefined>): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => {
    const v = vars[key];
    return v === null || v === undefined ? '' : String(v);
  });
}

/** Junta itens em português: "a", "a e b", "a, b e c". */
export function joinPtBr(items: readonly string[]): string {
  if (items.length <= 1) return items.join('');
  return `${items.slice(0, -1).join(', ')} e ${items[items.length - 1]}`;
}

/** Remove caracteres de controle e quebras de linha; normaliza espaços internos repetidos. */
export function stripControlChars(value: string): string {
  // eslint-disable-next-line no-control-regex
  return value.replace(/[\u0000-\u001F\u007F-\u009F\u2028\u2029]/g, ' ');
}
