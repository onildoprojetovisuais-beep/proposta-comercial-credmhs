import type { ClientLogo } from '../types/presentation';

/**
 * Slide 10 — "Empresas que caminham com a gente". Dono: agente de Marcas.
 * Seleção = logos incorporados no PPT da Sabrina + Fairmont Rio de Janeiro Copacabana (pedido
 * expresso da Sabrina). Logos não são estudos de caso nem provam resultados.
 * Arquivos servidos de public/media/clientes/ (ver docs/V3-LOGOS.md).
 *
 * Ordem: a do slide 10 (linha 1 da esquerda para a direita, depois linha 2); Fairmont ao fim,
 * para não alterar a sequência montada no PPT.
 *
 * width/height = dimensões reais do arquivo servido (após trim). `optical` corrige o peso visual
 * DEPOIS da normalização por área feita em Empresas.tsx: < 1 para marcas em bloco de cor
 * cheia (pesam mais), > 1 para marcas de traço fino ou com muito respiro interno.
 */
export const clientLogos: readonly ClientLogo[] = [
  { id: 'via-group', name: 'VIA Group', src: '/media/clientes/via-group.png', width: 126, height: 56, source: 'pptx', sourceSlide: 10, optical: 0.88 },
  { id: 'csn', name: 'CSN', src: '/media/clientes/csn.png', width: 147, height: 46, source: 'pptx', sourceSlide: 10, optical: 1 },
  { id: 'caixa', name: 'CAIXA', src: '/media/clientes/caixa.png', width: 207, height: 67, source: 'pptx', sourceSlide: 10, optical: 1 },
  { id: 'sotreq-cat', name: 'Sotreq CAT', src: '/media/clientes/sotreq-cat.png', width: 300, height: 77, source: 'pptx', sourceSlide: 10, optical: 0.92 },
  { id: 'grand-hyatt', name: 'Grand Hyatt', src: '/media/clientes/grand-hyatt.png', width: 299, height: 73, source: 'pptx', sourceSlide: 10, optical: 0.93 },
  { id: 'unicred', name: 'Unicred', src: '/media/clientes/unicred.png', width: 147, height: 26, source: 'pptx', sourceSlide: 10, optical: 0.88 },
  { id: 'grupo-iter', name: 'Grupo Iter', src: '/media/clientes/grupo-iter.png', width: 243, height: 55, source: 'pptx', sourceSlide: 10, optical: 1.08 },
  { id: 'aspen-pharma', name: 'Aspen Pharma', src: '/media/clientes/aspen-pharma.png', width: 198, height: 70, source: 'pptx', sourceSlide: 10, optical: 0.96 },
  {
    id: 'fairmont-rio-copacabana',
    name: 'Fairmont Rio de Janeiro Copacabana',
    src: '/media/clientes/fairmont-rio-copacabana.png',
    width: 800,
    height: 271,
    source: 'cred',
    optical: 1.15,
  },
];
