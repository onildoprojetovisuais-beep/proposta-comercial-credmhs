/**
 * Marcas de tempo e medidas do mapa da seção Alcance (Remotion, 30 fps, 7,5 s, toca uma vez).
 * Leve de propósito: sem `remotion` e sem a geometria. BrazilMap (bundle inicial) importa só
 * daqui; a geometria e o player vêm sob demanda.
 *
 * 1. contorno do país se desenha → 2. estados ganham o branco e as divisas se desenham →
 * 3. símbolos de presença entram de norte a sul → 4. destaque do Rio (rede própria) →
 * 5. mapa completo, parado no último quadro.
 */
import { GEO_HEIGHT, GEO_WIDTH, RJ_GEO_POINT } from './brazilGeoMeta';

export const MAP_FPS = 30;

/** Segundos → quadros. Toda marca deriva daqui. */
const s = (seconds: number) => Math.round(seconds * MAP_FPS);

export const T = {
  outlineStart: 0,
  outlineEnd: s(2.0),
  fillStart: s(1.75),
  fillStagger: 1,
  fillDur: s(0.6),
  bordersStart: s(2.3),
  bordersStagger: 1,
  bordersDur: s(0.9),
  symbolsStart: s(3.4),
  symbolsStagger: 2,
  rjStart: s(5.2),
  haloStart: s(5.45),
  /** O rótulo HTML “Rio de Janeiro - Barra e Centro” aparece a partir deste quadro. */
  labelFrame: s(5.7),
} as const;

export const MAP_DURATION = s(7.5);
export const MAP_LAST_FRAME = MAP_DURATION - 1;

/** Tamanho da composição = viewBox da geometria (1 unidade = 1 px da composição). */
export const MAP_WIDTH = GEO_WIDTH;
export const MAP_HEIGHT = Math.round(GEO_HEIGHT);

/** UF da rede própria (destaque). As demais UFs recebem o símbolo de presença do slide 5. */
export const OWN_NETWORK_UF = 'RJ';
export const RJ_POINT = RJ_GEO_POINT;
/** Posição do Rio em % da área do mapa, para o rótulo HTML sobreposto. */
export const RJ_PERCENT = { left: (RJ_GEO_POINT.x / GEO_WIDTH) * 100, top: (RJ_GEO_POINT.y / GEO_HEIGHT) * 100 } as const;
