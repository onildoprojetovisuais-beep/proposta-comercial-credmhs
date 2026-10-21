/**
 * Ordens de entrada (dependem da geometria). Só a cena Remotion usa — fica no chunk sob demanda.
 * Marcas de tempo e medidas: ./timing.ts.
 */
import { UF_SHAPES } from './brazilGeo';
import { OWN_NETWORK_UF } from './timing';

/** Ordem de entrada dos símbolos: de norte a sul (y crescente), sem o Rio. */
export const PRESENCE_ORDER: readonly string[] = UF_SHAPES.filter((u) => u.uf !== OWN_NETWORK_UF)
  .slice()
  .sort((a, b) => a.y - b.y || a.x - b.x)
  .map((u) => u.uf);

/** Ordem de preenchimento dos estados (norte → sul). */
export const FILL_ORDER: readonly string[] = UF_SHAPES.slice()
  .sort((a, b) => a.y - b.y)
  .map((u) => u.uf);
