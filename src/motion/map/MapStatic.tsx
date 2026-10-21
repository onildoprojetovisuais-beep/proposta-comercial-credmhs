/**
 * Mapa completo e parado (último quadro), sem player: prefers-reduced-motion ou falha do player.
 * Carregado sob demanda por BrazilMap para a geometria não pesar a primeira carga.
 */
import { COMPLETE, MapArt } from './MapArt';

export default function MapStatic({ displayWidth }: { displayWidth: number }) {
  return <MapArt progress={COMPLETE} displayWidth={displayWidth} />;
}
