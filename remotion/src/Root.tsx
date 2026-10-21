import React from "react";
import { Composition } from "remotion";
import { MapaBrasil } from "./MapaBrasil";
import { MAP_DURATION, MAP_FPS, MAP_HEIGHT, MAP_WIDTH } from "../../src/motion/map/timing";

// Única composição ativa (V3): mapa do Brasil da seção Alcance. A trilha de valor (V2) e o M06 (V1)
// foram retirados; estão em historico/. Tamanho = viewBox da geometria × 1,08, arredondado para par
// (h264/yuv420p exige dimensões pares).
const SCALE = 1.08;
const even = (n: number) => Math.round(n / 2) * 2;

export const RemotionRoot: React.FC = () => (
  <Composition
    id="MapaBrasil"
    component={MapaBrasil}
    durationInFrames={MAP_DURATION}
    fps={MAP_FPS}
    width={even(MAP_WIDTH * SCALE)}
    height={even(MAP_HEIGHT * SCALE)}
  />
);
