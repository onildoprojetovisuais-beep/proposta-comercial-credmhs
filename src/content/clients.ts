import type { ClientLogo } from '../types/presentation';

/**
 * Slide 10 — "Empresas que caminham com a gente". Dono: agente de Marcas.
 * Seleção = logos incorporados no PPT da Sabrina (sem VIA Group e CSN, retirados em 23/10) +
 * Fairmont Rio de Janeiro Copacabana (pedido expresso da Sabrina) + marcas das rodadas 23/10 e 26/10. Logos não são estudos de caso nem provam resultados.
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
  // Rodadas 23/10 e 26/10 (assets/clients/, enviados pela CRED): VIA Group e CSN saem; entram as
  // marcas abaixo, na ordem do pedido.
  { id: 'ffa', name: 'Ferrareze & Freitas Advogados', src: '/media/clientes/ffa.png', width: 800, height: 436, source: 'cred', optical: 1.1 },
  { id: 'grupo-ombrello', name: 'Grupo Ombrello', src: '/media/clientes/grupo-ombrello.png', width: 371, height: 64, source: 'cred', optical: 0.9 },
  { id: 'radix', name: 'Radix Engenharia e Software', src: '/media/clientes/radix.png', width: 200, height: 101, source: 'cred', optical: 0.95 },
  { id: 'cimed', name: 'CIMED', src: '/media/clientes/cimed.png', width: 257, height: 141, source: 'cred', optical: 0.92 },
  { id: 'trigo', name: 'Trigo', src: '/media/clientes/trigo.png', width: 509, height: 117, source: 'cred', optical: 1 },
  { id: 'bmg', name: 'Banco BMG', src: '/media/clientes/bmg.png', width: 153, height: 88, source: 'cred', optical: 0.95 },
  { id: 'cimento-nacional', name: 'Cimento Nacional', src: '/media/clientes/cimento-nacional.png', width: 579, height: 311, source: 'cred', optical: 1 },
  { id: 'orguel', name: 'Orguel', src: '/media/clientes/orguel.png', width: 1048, height: 194, source: 'cred', optical: 0.95 },
  { id: 'minalba', name: 'Minalba Brasil', src: '/media/clientes/minalba.png', width: 150, height: 50, source: 'cred', optical: 1.05 },
  { id: 'rede-manaus', name: 'Rede Manaus', src: '/media/clientes/rede-manaus.png', width: 552, height: 211, source: 'cred', optical: 0.85 },
  { id: 'hotel-nacional', name: 'Hotel Nacional Rio de Janeiro', src: '/media/clientes/hotel-nacional.png', width: 349, height: 137, source: 'cred', optical: 1.05 },
  { id: 'hotel-santa-teresa', name: 'Hotel Santa Teresa MGallery Rio', src: '/media/clientes/hotel-santa-teresa.png', width: 800, height: 583, source: 'cred', optical: 1.25 },
  { id: 'dom-atacadista', name: 'Dom Atacadista', src: '/media/clientes/dom-atacadista.png', width: 225, height: 225, source: 'cred', optical: 0.85 },
];
