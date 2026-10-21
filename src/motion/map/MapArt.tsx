/**
 * Desenho do mapa (SVG puro, sem `remotion`). Recebe o progresso de cada camada (0 → 1):
 * a cena Remotion calcula esses valores quadro a quadro; a versão estática passa tudo em 1.
 *
 * Cores: tokens da página com o valor oficial como reserva (o render Remotion não tem o CSS
 * da página). Traços em px de tela constantes: `displayWidth` converte px → unidades do viewBox.
 */
import { useId } from 'react';
import { COUNTRY_OUTLINE, GEO_HEIGHT, GEO_WIDTH, STATE_BORDERS, UF_SHAPES } from './brazilGeo';
import { BRAND_SUN_PATH, BRAND_SUN_VIEWBOX } from './brandSun';
import { OWN_NETWORK_UF, RJ_POINT } from './timing';

export const mapColors = {
  ink: 'var(--cred-ink, #1e1d1d)',
  white: 'var(--cred-white, #ffffff)',
  yellow: 'var(--cred-yellow, #ffca00)',
} as const;

export interface MapProgress {
  /** Desenho do contorno do país. */
  outline: number;
  /** Branco de cada UF, por sigla. */
  fill: Readonly<Record<string, number>>;
  /** Desenho de cada divisa (mesma ordem de STATE_BORDERS). */
  borders: readonly number[];
  /** Entrada de cada símbolo de presença, por sigla (mola; pode passar de 1). */
  symbols: Readonly<Record<string, number>>;
  /** Entrada do destaque do Rio (mola). */
  rj: number;
  /** Anel do Rio (mola). */
  halo: number;
  /** Onda única que se expande do Rio e some (1 = já passou). */
  ping: number;
}

export const COMPLETE: MapProgress = {
  outline: 1,
  fill: Object.fromEntries(UF_SHAPES.map((u) => [u.uf, 1])),
  borders: STATE_BORDERS.map(() => 1),
  symbols: Object.fromEntries(UF_SHAPES.map((u) => [u.uf, 1])),
  rj: 1,
  halo: 1,
  ping: 1,
};

/** Raio do disco do Rio e do anel. */
const RJ_DISC = 29;
const RJ_HALO = 45;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));


/** Desenho por traço: comprimento normalizado (pathLength=1); completo = sem tracejado. */
const draw = (p: number) =>
  p >= 1
    ? {}
    : // ponta reta durante o desenho: ponta redonda num traço de comprimento ~0 vira um ponto solto
      { pathLength: 1, strokeDasharray: '1 1', strokeDashoffset: 1 - clamp01(p), strokeLinecap: 'butt' as const };

export function MapArt({ progress, displayWidth }: { progress: MapProgress; displayWidth: number }) {
  const uid = useId().replace(/:/g, '');
  const sunId = `cred-sun-${uid}`;
  const unitPx = Math.max(0.05, displayWidth / GEO_WIDTH);
  const px = (v: number) => v / unitPx; // px de tela → unidades do viewBox

  const outlineW = px(1.35);
  const borderW = px(1.1);

  const sunW = RJ_DISC * 1.32;
  const sunScale = sunW / BRAND_SUN_VIEWBOX.width;
  const sunH = BRAND_SUN_VIEWBOX.height * sunScale;
  // Sol pequeno de presença: ~26 px na tela no desktop (traço fino do sol ainda lê como preto);
  // limitado a 48 unidades do viewBox para não amontoar o Nordeste em telas estreitas.
  const miniScale = Math.min(px(26), 48) / BRAND_SUN_VIEWBOX.width;

  return (
    <svg
      viewBox={`0 0 ${GEO_WIDTH} ${GEO_HEIGHT}`}
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
      focusable="false"
      style={{ display: 'block', overflow: 'visible' }}
    >
      <defs>
        <path id={sunId} d={BRAND_SUN_PATH} />
      </defs>

      {/* 2. Estados em branco (entram de norte a sul, a partir do ponto interno). */}
      <g>
        {UF_SHAPES.map((u) => {
          const p = clamp01(progress.fill[u.uf] ?? 0);
          if (p <= 0) return null;
          const sc = 0.965 + 0.035 * p;
          return (
            <path
              key={u.uf}
              d={u.d}
              fill={mapColors.white}
              opacity={p}
              transform={p >= 1 ? undefined : `translate(${u.x} ${u.y}) scale(${sc}) translate(${-u.x} ${-u.y})`}
            />
          );
        })}
      </g>

      {/* 2. Divisas estaduais em amarelo sobre o branco (cada divisa uma vez). */}
      <g fill="none" stroke={mapColors.yellow} strokeWidth={borderW} strokeLinecap="round" strokeLinejoin="round">
        {STATE_BORDERS.map((d, i) => {
          const p = progress.borders[i] ?? 0;
          if (p <= 0) return null;
          return <path key={i} d={d} {...draw(p)} />;
        })}
      </g>

      {/* 1. Contorno do país, traço fino. */}
      <g fill="none" stroke={mapColors.ink} strokeWidth={outlineW} strokeLinecap="round" strokeLinejoin="round">
        {progress.outline > 0 && COUNTRY_OUTLINE.map((d, i) => <path key={i} d={d} {...draw(progress.outline)} />)}
      </g>

      {/* 3. Símbolos de presença: um por UF onde o slide 5 mostra presença (posição = ponto interno).
          Sol OFICIAL da CRED (mesmo traçado do favicon, forma inalterada), em tinta — pedido do Nil. */}
      <g fill={mapColors.ink}>
        {UF_SHAPES.map((u) => {
          if (u.uf === OWN_NETWORK_UF) return null;
          const p = progress.symbols[u.uf] ?? 0;
          if (p <= 0) return null;
          const sc = (0.5 + 0.5 * p) * miniScale;
          const dy = (1 - p) * 7;
          return (
            <use
              key={u.uf}
              href={`#${sunId}`}
              opacity={clamp01(p * 1.4)}
              transform={`translate(${u.x} ${u.y + dy}) scale(${sc}) translate(${-BRAND_SUN_VIEWBOX.x - BRAND_SUN_VIEWBOX.width / 2} ${-BRAND_SUN_VIEWBOX.y - BRAND_SUN_VIEWBOX.height * 0.62})`}
            />
          );
        })}
      </g>

      {/* 4. Rio de Janeiro: rede própria (anel + disco + sol oficial). Rótulo é HTML, fora do SVG. */}
      <g transform={`translate(${RJ_POINT.x} ${RJ_POINT.y})`}>
        {progress.ping > 0 && progress.ping < 1 && (
          <circle
            r={RJ_DISC + (RJ_HALO * 1.9 - RJ_DISC) * progress.ping}
            fill="none"
            stroke={mapColors.ink}
            strokeWidth={px(1)}
            opacity={0.45 * (1 - progress.ping)}
          />
        )}
        {progress.halo > 0 && (
          <circle
            r={RJ_HALO * (0.7 + 0.3 * progress.halo)}
            fill="none"
            stroke={mapColors.ink}
            strokeWidth={px(1)}
            opacity={0.42 * clamp01(progress.halo)}
          />
        )}
        {progress.rj > 0 && (
          <g opacity={clamp01(progress.rj * 1.5)} transform={`scale(${0.4 + 0.6 * progress.rj})`}>
            <circle r={RJ_DISC} fill={mapColors.ink} stroke={mapColors.white} strokeWidth={px(1.5)} />
            <use
              href={`#${sunId}`}
              fill={mapColors.yellow}
              transform={`translate(${-sunW / 2} ${-sunH / 2 - RJ_DISC * 0.04}) scale(${sunScale}) translate(${-BRAND_SUN_VIEWBOX.x} ${-BRAND_SUN_VIEWBOX.y})`}
            />
          </g>
        )}
      </g>
    </svg>
  );
}
