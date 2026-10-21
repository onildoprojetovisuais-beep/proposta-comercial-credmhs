import React from "react";
import { AbsoluteFill } from "remotion";
import { MapScene } from "../../src/motion/map/MapScene";

// Composição de referência do mapa da seção Alcance (V3). A cena é a mesma da página
// (../src/motion/map); aqui só ganha o fundo amarelo oficial (#FFCA00) para conferência.
export const MAPA_FUNDO = "#FFCA00";

export const MapaBrasil: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: MAPA_FUNDO, padding: 0 }}>
    <MapScene />
  </AbsoluteFill>
);
