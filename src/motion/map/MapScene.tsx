/**
 * Cena Remotion do mapa (usada pelo @remotion/player na página e pela composição MapaBrasil
 * em remotion/ para renders de conferência). Calcula o progresso de cada camada no quadro
 * atual e entrega o desenho a MapArt. Fundo transparente: a seção amarela fica por trás.
 */
import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { STATE_BORDERS } from './brazilGeo';
import { MapArt, type MapProgress } from './MapArt';
import { FILL_ORDER, PRESENCE_ORDER } from './timeline';
import { T } from './timing';

/** Tema de movimento (curvas e molas). Nenhuma interpolação linear. */
const motion = {
  draw: Easing.bezier(0.65, 0, 0.35, 1),
  out: Easing.bezier(0.16, 1, 0.3, 1),
  symbol: { damping: 14, stiffness: 160, mass: 0.6 },
  rj: { damping: 13, stiffness: 120, mass: 0.8 },
  halo: { damping: 22, stiffness: 70, mass: 1 },
} as const;

const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

export interface MapSceneProps {
  /** Largura exibida em px (traços com espessura constante na tela). */
  displayWidth?: number;
  [key: string]: unknown;
}

export function MapScene({ displayWidth }: MapSceneProps) {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();

  const outline = interpolate(frame, [T.outlineStart, T.outlineEnd], [0, 1], { ...clamp, easing: motion.draw });

  const fill: Record<string, number> = {};
  FILL_ORDER.forEach((uf, i) => {
    const start = T.fillStart + i * T.fillStagger;
    fill[uf] = interpolate(frame, [start, start + T.fillDur], [0, 1], { ...clamp, easing: motion.out });
  });

  const borders = STATE_BORDERS.map((_, i) => {
    const start = T.bordersStart + i * T.bordersStagger;
    return interpolate(frame, [start, start + T.bordersDur], [0, 1], { ...clamp, easing: motion.draw });
  });

  const symbols: Record<string, number> = {};
  PRESENCE_ORDER.forEach((uf, i) => {
    symbols[uf] = spring({ frame: frame - (T.symbolsStart + i * T.symbolsStagger), fps, config: motion.symbol });
  });

  const rj = spring({ frame: frame - T.rjStart, fps, config: motion.rj });
  const halo = spring({ frame: frame - T.haloStart, fps, config: motion.halo });
  const ping = interpolate(frame, [T.haloStart, T.haloStart + Math.round(fps * 1.2)], [0, 1], {
    ...clamp,
    easing: motion.out,
  });

  const progress: MapProgress = { outline, fill, borders, symbols, rj, halo, ping };

  return (
    // div simples em vez de <AbsoluteFill>: evita o aviso de ref do React 18 na página.
    <div style={{ position: 'absolute', inset: 0, background: 'transparent' }}>
      <MapArt progress={progress} displayWidth={displayWidth ?? width} />
    </div>
  );
}
