import type { Executive } from '../../types';
import { sabrinaFerreira } from '../../content/executives';
import { PHOTO_PATH_PATTERN } from './storage';
import type { PublicExecutiveRow } from './types';
import { FIELD_LIMITS, PHONE_E164_PATTERN } from './types';

/**
 * Conversão da linha pública do Supabase (`get_public_executive`) para o perfil usado pela
 * apresentação. Tudo o que vem do banco é tratado como texto não confiável:
 * - nada vira HTML (os componentes renderizam como texto);
 * - e-mail e telefone só entram se passarem na validação, senão o canal fica oculto;
 * - links só com http(s) e URL bem formada;
 * - WhatsApp continua desligado (canal não confirmado — P13).
 */

/** Dimensões usadas quando a linha não informa o tamanho do retrato (retrato atual de Sabrina). */
export const DEFAULT_PHOTO_WIDTH = 1098;
export const DEFAULT_PHOTO_HEIGHT = 1433;

/**
 * E-mail seguro para `mailto:`. Mais estrito que a CHECK do banco: recusa `?`, `&`, `#`, `/`,
 * aspas e espaços, que permitiriam injetar assunto/corpo no link.
 */
const SAFE_EMAIL = /^[A-Za-z0-9._%+'-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/;
/** Telefone exibido: dígitos e pontuação comum. */
const SAFE_PHONE_DISPLAY = /^[0-9+()\-.\s]+$/;
/** Caracteres de controle (C0, DEL, C1) e marcas bidi que poderiam disfarçar o texto. */
// eslint-disable-next-line no-control-regex
const UNSAFE_CHARS = /[\u0000-\u001F\u007F-\u009F‎‏‪-‮⁦-⁩]/g;

/** Texto curto: remove controles, colapsa espaços, limita o comprimento. '' quando inválido. */
export function cleanText(value: unknown, max: number): string {
  if (typeof value !== 'string') return '';
  const text = value.replace(UNSAFE_CHARS, ' ').replace(/\s+/g, ' ').trim();
  if (!text || text.length > max) return '';
  return text;
}

export function safeEmail(value: unknown): string | null {
  const text = cleanText(value, FIELD_LIMITS.contact_email.max);
  return text.length >= FIELD_LIMITS.contact_email.min && SAFE_EMAIL.test(text) ? text : null;
}

/** Telefone só quando o E.164 é válido; o rótulo exibido cai para o E.164 se vier malformado. */
export function safePhone(display: unknown, e164: unknown): { display: string; e164: string } | null {
  const number = cleanText(e164, FIELD_LIMITS.phone_e164.max);
  if (!PHONE_E164_PATTERN.test(number)) return null;
  const label = cleanText(display, FIELD_LIMITS.phone_display.max);
  const labelOk = label.length >= FIELD_LIMITS.phone_display.min && SAFE_PHONE_DISPLAY.test(label);
  return { display: labelOk ? label : number, e164: number };
}

/** URL externa segura (http/https, sem credenciais embutidas). */
export function safeHttpUrl(value: unknown): string | null {
  const text = cleanText(value, 300);
  if (!text || !/^https?:\/\//i.test(text)) return null;
  try {
    const url = new URL(text);
    if ((url.protocol !== 'https:' && url.protocol !== 'http:') || url.username || url.password || !url.hostname.includes('.')) {
      return null;
    }
    return url.href;
  } catch {
    return null;
  }
}

function safeDimension(value: unknown): number | null {
  return typeof value === 'number' && Number.isInteger(value) && value >= 1 && value <= 4000 ? value : null;
}

/** Texto alternativo gerado a partir do perfil (nunca vem do banco). */
export function photoAltFor(fullName: string, role: string): string {
  return `Retrato de ${fullName}, ${role} da CRED MHS`;
}

export interface MapRowOptions {
  /**
   * Converte `photo_path` em URL pública (padrão: `photoPublicUrl` de storage.ts, que lê a
   * configuração do Vite). Injetável para os checks em Node.
   */
  photoUrlFor: (photoPath: string) => string | null;
}

/**
 * Linha ativa (`available = true`) → `Executive`. Retorna null se faltar um campo obrigatório
 * da apresentação (nome de apresentação, nome completo, cargo): a resposta é tratada como inválida.
 * Campos extras da linha são ignorados.
 */
export function mapPublicExecutiveRow(row: PublicExecutiveRow, options: MapRowOptions): Executive | null {
  if (row.available !== true) return null;
  const firstName = cleanText(row.display_name, FIELD_LIMITS.display_name.max);
  const fullName = cleanText(row.full_name, FIELD_LIMITS.full_name.max);
  const role = cleanText(row.role, FIELD_LIMITS.role.max);
  if (!firstName || fullName.length < FIELD_LIMITS.full_name.min || role.length < FIELD_LIMITS.role.min) return null;

  const phone = safePhone(row.phone_display, row.phone_e164);
  const isSabrina = row.slug === sabrinaFerreira.id;

  let photo: string | null = null;
  let photoSource: Executive['photoSource'] = null;
  let photoWidth: number | undefined;
  let photoHeight: number | undefined;

  const path = typeof row.photo_path === 'string' ? row.photo_path : null;
  const remoteUrl = path && PHOTO_PATH_PATTERN.test(path) ? options.photoUrlFor(path) : null;
  if (remoteUrl) {
    // updated_at invalida o cache do navegador quando o executivo troca a foto.
    const version = cleanText(row.updated_at, 64);
    photo = version ? `${remoteUrl}?v=${encodeURIComponent(version)}` : remoteUrl;
    photoSource = 'remote';
    photoWidth = safeDimension(row.photo_width) ?? DEFAULT_PHOTO_WIDTH;
    photoHeight = safeDimension(row.photo_height) ?? DEFAULT_PHOTO_HEIGHT;
  } else if (isSabrina) {
    // Sem foto no Storage: Sabrina mantém o retrato do projeto (com derivados otimizados).
    photo = sabrinaFerreira.photo;
    photoSource = sabrinaFerreira.photoSource;
    photoWidth = sabrinaFerreira.photoWidth;
    photoHeight = sabrinaFerreira.photoHeight;
  }

  return {
    id: row.slug,
    firstName,
    fullName,
    role,
    photo,
    photoSource,
    photoAlt: photoAltFor(fullName, role),
    photoWidth,
    photoHeight,
    email: safeEmail(row.contact_email),
    phoneDisplay: phone?.display ?? null,
    phoneE164: phone?.e164 ?? null,
    linkedInUrl: safeHttpUrl(row.linkedin_url),
    websiteUrl: safeHttpUrl(row.website_url),
    whatsAppEnabled: false,
    whatsAppNumber: null,
    sourceSlides: isSabrina ? sabrinaFerreira.sourceSlides : [],
    // Dado cadastrado pela CRED no painel; não altera a situação factual do deck.
    verificationStatus: 'source-supplied',
  };
}
