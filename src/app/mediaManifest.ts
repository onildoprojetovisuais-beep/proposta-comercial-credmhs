/**
 * Fotos reais da CRED MHS usadas na V3 (docs/V3-FOTOS.md). Originais em assets/image/
 * ("WhatsApp Image 2026-10-20 at 09.43.NN.jpeg", 1200×1600 ou 1600×1200, JPEG de WhatsApp).
 * Derivados em public/media/fotos/<slug>-<largura>.{avif,webp} + <slug>-1200.jpg (fallback),
 * gerados com Pillow sem ampliar além do original.
 *
 * Regras:
 * - `unit` só quando o PPT da Sabrina atribui a foto a uma unidade (slide 3). Sem atribuição →
 *   `unit: null`, e a foto nunca é rotulada como Barra ou Centro (aparece como ambiente CRED).
 * - 09.43.20 (pessoa na recepção) NÃO é usada: consentimento de imagem não confirmado.
 * - Nenhuma foto de banco ou gerada.
 */

export type PhotoUnit = 'barra' | 'centro' | null;

export interface Photo {
  slug: string;
  /** Arquivo original em assets/image/. */
  original: string;
  width: number;
  height: number;
  /** Larguras geradas (px). */
  widths: number[];
  unit: PhotoUnit;
  alt: string;
  /** Ponto de interesse para object-fit: cover. */
  position: string;
  /** Onde aparece na página. */
  usage: string;
}

const photo = (p: Photo) => p;

export const PHOTOS = {
  barraFachada: photo({
    slug: 'barra-fachada',
    original: 'WhatsApp Image 2026-10-20 at 09.43.21.jpeg',
    width: 1600,
    height: 1200,
    widths: [800, 1200, 1600],
    unit: 'barra',
    alt: 'Fachada de vidro da unidade Barra da CRED MHS, com a recepção e a sala de espera ao fundo',
    position: '55% 50%',
    usage: 'Quem somos — foto principal da unidade Barra',
  }),
  barraFachadaVertical: photo({
    slug: 'barra-fachada-vertical',
    original: 'WhatsApp Image 2026-10-20 at 09.43.22.jpeg',
    width: 1200,
    height: 1600,
    widths: [800, 1200],
    unit: 'barra',
    alt: 'Fachada de vidro da unidade Barra da CRED MHS',
    position: '50% 55%',
    usage: 'Reserva (mesma fachada da 09.43.21, em vertical); não usada na página',
  }),
  barraConsultorio: photo({
    slug: 'barra-consultorio',
    original: 'WhatsApp Image 2026-10-20 at 09.43.23.jpeg',
    width: 1200,
    height: 1600,
    widths: [800, 1200],
    unit: 'barra',
    alt: 'Consultório da unidade Barra da CRED MHS',
    position: '50% 60%',
    usage: 'Quem somos — foto de apoio da unidade Barra',
  }),
  centroPorta: photo({
    slug: 'centro-porta',
    original: 'WhatsApp Image 2026-10-20 at 09.43.18.jpeg',
    width: 1200,
    height: 1600,
    widths: [800, 1200],
    unit: 'centro',
    alt: 'Entrada da unidade Centro da CRED MHS: porta de madeira com o logotipo e painel de parede',
    position: '50% 45%',
    usage: 'Quem somos — foto principal da unidade Centro',
  }),
  centroRecepcao: photo({
    slug: 'centro-recepcao',
    original: 'WhatsApp Image 2026-10-20 at 09.43.17.jpeg',
    width: 1200,
    height: 1600,
    widths: [800, 1200],
    unit: 'centro',
    alt: 'Recepção e sala de espera da unidade Centro da CRED MHS',
    position: '40% 55%',
    usage: 'Quem somos — foto de apoio da unidade Centro',
  }),
  ambienteEspera: photo({
    slug: 'ambiente-espera',
    original: 'WhatsApp Image 2026-10-20 at 09.43.27.jpeg',
    width: 1200,
    height: 1600,
    widths: [800, 1200],
    unit: null,
    alt: 'Sala de espera da CRED MHS com o logotipo na parede',
    position: '55% 50%',
    usage: 'Transição — ambiente CRED (sem rótulo de unidade)',
  }),
  ambienteCorredor: photo({
    slug: 'ambiente-corredor',
    original: 'WhatsApp Image 2026-10-20 at 09.43.25.jpeg',
    width: 1200,
    height: 1600,
    widths: [800, 1200],
    unit: null,
    alt: 'Sala de espera da CRED MHS',
    position: '50% 55%',
    usage: 'Reserva; não usada na página',
  }),
  ambienteConsultorio: photo({
    slug: 'ambiente-consultorio',
    original: 'WhatsApp Image 2026-10-20 at 09.43.26.jpeg',
    width: 1200,
    height: 1600,
    widths: [800, 1200],
    unit: null,
    alt: 'Consultório da CRED MHS',
    position: '50% 55%',
    usage: 'Reserva (ambiente CRED, sem unidade atribuída); não usada na página',
  }),
} as const;

export type PhotoKey = keyof typeof PHOTOS;

/** Prefixo do arquivo. Fotos sempre coloridas (decisão do Nil, 20/10/2026). */
const base = (p: Photo) => p.slug;

/** srcset de um formato (avif|webp) a partir das larguras geradas. */
export function photoSrcSet(p: Photo, format: 'avif' | 'webp'): string {
  return p.widths.map((w) => `/media/fotos/${base(p)}-${w}.${format} ${w}w`).join(', ');
}

/** Fallback JPEG (1200px). */
export const photoFallback = (p: Photo) => `/media/fotos/${base(p)}-1200.jpg`;
