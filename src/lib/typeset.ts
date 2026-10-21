/**
 * Quebra de linha sem órfãs (regra do Nil): só na renderização, troca espaços comuns por espaço
 * inseparável (U+00A0) para que nenhuma linha termine em preposição, artigo ou conjunção curta,
 * que expressões fixas não se partam e que a última palavra não fique sozinha.
 * Não altera palavras nem pontuação: `typeset(t).replace(/\u00A0/g, ' ') === t`.
 */

const NBSP = '\u00A0';

/** Palavras que não podem terminar uma linha (ficam presas à seguinte). */
const SHORT_WORDS = [
  'a', 'o', 'e', 'é', 'à', 'as', 'os', 'ao', 'aos', 'às',
  'de', 'da', 'do', 'das', 'dos', 'em', 'na', 'no', 'nas', 'nos',
  'um', 'uma', 'com', 'por', 'para', 'que', 'se', 'ou', 'sob', 'sua', 'seu', 'sem', 'mais', 'já', 'só',
];
const SHORT_RE = new RegExp(`(^|[\\s${NBSP}])(${SHORT_WORDS.join('|')}) (?=\\S)`, 'gi');

/** Expressões que não se partem. */
const PHRASES = [
  'Rio de Janeiro',
  'Minas Gerais',
  'território nacional',
  'Executiva de Negócios',
  'Executivo de Negócios',
  'CRED MHS',
  '100% digital',
  '+550 mil',
  '+5 mil',
  'Barra · Centro',
];

export function typeset(text: string, options: { orphan?: boolean } = {}): string {
  let out = text;
  for (const p of PHRASES) {
    const re = new RegExp(p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/ /g, '[ \\u00A0]'), 'gi');
    out = out.replace(re, (m) => m.replace(/ /g, NBSP));
  }
  // Duas passagens: palavras curtas seguidas ("e o", "para a") não se sobrepõem numa só.
  for (let i = 0; i < 2; i++) out = out.replace(SHORT_RE, (_m, pre: string, w: string) => `${pre}${w}${NBSP}`);
  // Última palavra presa à anterior (sem órfã), se a união não ficar longa demais.
  if (options.orphan !== false) {
    const m = out.match(/ (\S+)$/);
    if (m && m[1].length <= 14) out = out.slice(0, m.index) + NBSP + m[1];
  }
  return out;
}

/** Atalho para os textos de uma linha só (rótulos): só expressões e palavras curtas. */
export const typesetLabel = (text: string) => typeset(text, { orphan: false });
