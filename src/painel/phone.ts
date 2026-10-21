import { PHONE_E164_PATTERN } from '../lib/supabase/types';

/**
 * Telefone: o executivo digita UM campo; o painel gera as duas colunas.
 *  - phone_e164 (discagem, `tel:`): `+5521988967369`
 *  - phone_display (exibido ao cliente): `+55 (21) 98896-7369` — mesmo formato do perfil atual.
 * Um campo só evita que o número exibido e o número discado fiquem diferentes.
 *
 * Regras:
 *  - Sem `+`: número brasileiro. Aceita DDD + número (10 ou 11 dígitos), com ou sem 0 de
 *    operadora/longa distância à frente, ou já com 55 (12 ou 13 dígitos).
 *  - Com `+`: internacional, mantido como digitado (só dígitos) e exibido como `+<dígitos>`
 *    quando não for do Brasil.
 */

export interface PhoneResult {
  e164: string;
  display: string;
}

export type PhoneParse = { ok: true; value: PhoneResult } | { ok: false; reason: 'empty' | 'short' | 'invalid' | 'ddd' };

const VALID_DDD = new Set([
  11, 12, 13, 14, 15, 16, 17, 18, 19, 21, 22, 24, 27, 28, 31, 32, 33, 34, 35, 37, 38, 41, 42, 43, 44, 45, 46, 47, 48, 49,
  51, 53, 54, 55, 61, 62, 63, 64, 65, 66, 67, 68, 69, 71, 73, 74, 75, 77, 79, 81, 82, 83, 84, 85, 86, 87, 88, 89, 91, 92,
  93, 94, 95, 96, 97, 98, 99,
]);

function formatBrazil(national: string): string {
  const ddd = national.slice(0, 2);
  const rest = national.slice(2);
  const split = rest.length === 9 ? 5 : 4;
  return `+55 (${ddd}) ${rest.slice(0, split)}-${rest.slice(split)}`;
}

export function parsePhone(input: string): PhoneParse {
  const raw = input.trim();
  if (!raw) return { ok: false, reason: 'empty' };
  const international = raw.startsWith('+');
  let digits = raw.replace(/\D/g, '');

  if (international) {
    if (digits.startsWith('55')) {
      const national = digits.slice(2);
      return brazil(national);
    }
    const e164 = `+${digits}`;
    if (!PHONE_E164_PATTERN.test(e164)) return { ok: false, reason: digits.length < 8 ? 'short' : 'invalid' };
    const display = raw.replace(/\s+/g, ' ');
    return { ok: true, value: { e164, display: display.length <= 32 ? display : e164 } };
  }

  // 0 de longa distância / operadora (0 21 …, 0 XX 21 …) não entra na discagem internacional.
  if ((digits.length === 13 || digits.length === 14) && digits.startsWith('0')) digits = digits.slice(3);
  else if ((digits.length === 11 || digits.length === 12) && digits.startsWith('0')) digits = digits.slice(1);
  if ((digits.length === 12 || digits.length === 13) && digits.startsWith('55')) digits = digits.slice(2);
  return brazil(digits);
}

function brazil(national: string): PhoneParse {
  if (national.length < 10) return { ok: false, reason: 'short' };
  if (national.length > 11) return { ok: false, reason: 'invalid' };
  const ddd = Number(national.slice(0, 2));
  if (!VALID_DDD.has(ddd)) return { ok: false, reason: 'ddd' };
  // Celular (11 dígitos) começa com 9 depois do DDD.
  if (national.length === 11 && national[2] !== '9') return { ok: false, reason: 'invalid' };
  const e164 = `+55${national}`;
  if (!PHONE_E164_PATTERN.test(e164)) return { ok: false, reason: 'invalid' };
  return { ok: true, value: { e164, display: formatBrazil(national) } };
}

/** Valor inicial do campo a partir do que está salvo. */
export function phoneFieldFromProfile(display: string, e164: string): string {
  if (display.trim()) return display.trim();
  const parsed = e164 ? parsePhone(e164) : null;
  return parsed && parsed.ok ? parsed.value.display : e164;
}

export const PHONE_MESSAGES: Record<'empty' | 'short' | 'invalid' | 'ddd', string> = {
  empty: 'Informe um telefone para o cliente falar com você.',
  short: 'Número incompleto. Inclua o DDD: (21) 98896-7369.',
  invalid: 'Não reconhecemos este número. Use DDD + número, como (21) 98896-7369, ou +código do país.',
  ddd: 'DDD não reconhecido. Confira os dois primeiros dígitos.',
};
