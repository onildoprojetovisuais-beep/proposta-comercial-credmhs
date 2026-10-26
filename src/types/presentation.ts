/**
 * Contrato V3 da apresentação pública (docs/V3-CONTRATO.md). Dono: coordenador.
 * Autoridade de conteúdo: docs/CRED-MHS-Apresentacao-Comercial.pptx (11 slides, versão da Sabrina
 * de 20/10/2026) + ajustes autorizados registrados em docs/V3-ALTERACOES-TEXTO.md.
 *
 * Retirados pela Sabrina e proibidos na página pública: selos 3C/3I, trilha de cinco etapas
 * (Normativo → … → Investimento) e o diagrama dos quatro eixos. As seis frentes do slide 9 são
 * conteúdo público autorizado.
 */

// ---------------------------------------------------------------------------
// Seções (ordem da página = ordem dos slides do PPT)
// ---------------------------------------------------------------------------

/** IDs das onze seções. São também o `id` do <section> no DOM e o hash da URL. */
export type ChapterId =
  | 'abertura' //          slide 1
  | 'provocacao' //        slide 2
  | 'quem-somos' //        slide 3
  | 'missao-visao-valores' // slide 3 (seção própria desde 21/10)
  | 'atuacao-integrada' // slide 4
  | 'alcance' //           slide 5 (mapa animado)
  | 'depoimentos' //       slide 6 (oculta ao cliente até haver depoimentos reais)
  | 'satisfacao' //        slide 7 (oculta ao cliente até o CSAT ser validado)
  | 'transicao' //         slide 8
  | 'frentes' //           slide 9
  | 'empresas' //          slide 10 (carrossel de logos)
  | 'contato'; //          slide 11

export const CHAPTER_ORDER: readonly ChapterId[] = [
  'abertura',
  'provocacao',
  'quem-somos',
  'missao-visao-valores',
  'atuacao-integrada',
  'alcance',
  'depoimentos',
  'satisfacao',
  'transicao',
  'frentes',
  'empresas',
  'contato',
];

export interface Chapter {
  id: ChapterId;
  /** Slide de origem no PPT. */
  slide: number;
  /** Rótulo curto da navegação lateral (microcopy de interface). */
  navLabel: string;
  /** Fora da navegação lateral (ex.: transição de uma frase). Continua na página. */
  navHidden?: boolean;
  /** Hashes antigos (V1/V2) que devem cair nesta seção (links já enviados). Uso interno. */
  legacyHashes?: string[];
}

// ---------------------------------------------------------------------------
// Conteúdo com pendência (depoimentos e CSAT)
// ---------------------------------------------------------------------------

/** Depoimento real enviado pela CRED. Nunca preencher com texto inventado. */
export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  role: string;
  company?: string;
  /** Setor indicado no PPT (Banco, Hotelaria, Restaurante…). */
  sector?: string;
  /** Autorização de uso confirmada pela CRED. Sem ela, o depoimento não aparece ao cliente. */
  approved: boolean;
}

/** Estado de um dado que depende de validação da CRED. */
export type DataStatus = 'provisorio' | 'validado';

// ---------------------------------------------------------------------------
// Oito frentes (slide 9)
// ---------------------------------------------------------------------------

export type FrontId =
  | 'conformidade'
  | 'seguranca-operacional'
  | 'rede'
  | 'tecnologia'
  | 'cultura-dados'
  | 'privacidade'
  | 'inteligencia'
  | 'investimento';

export interface Front {
  id: FrontId;
  /** "01" … "08" (numeração do PPT). */
  number: string;
  title: string;
  text: string;
  /** Texto do PPT antes do ajuste (só documentação; nunca renderizar). */
  original: { title: string; text: string };
  /** Ajuste autorizado aplicado (letra do pedido A–I). Só documentação. */
  adjustment?: string;
}

// ---------------------------------------------------------------------------
// Empresas (slide 10)
// ---------------------------------------------------------------------------

export interface ClientLogo {
  id: string;
  /** Nome da empresa como na marca (texto alternativo). */
  name: string;
  /** Caminho servido em public/ (ex.: /media/clientes/csn.png). */
  src: string;
  width: number;
  height: number;
  /** Origem do arquivo. */
  source: 'pptx' | 'cred';
  sourceSlide?: number;
  /** Fator de ajuste óptico (1 = padrão) para equilibrar marcas compactas/alongadas. */
  optical?: number;
}

// ---------------------------------------------------------------------------
// Contato
// ---------------------------------------------------------------------------

export interface ContactLinksV2 {
  /** mailto com destinatário e assunto fixo, sem corpo. null → sem e-mail válido. */
  email: { href: string; label: string } | null;
  /** Só com canal confirmado no perfil (whatsAppEnabled + número). */
  whatsApp: { href: string } | null;
  /** tel: com E.164. */
  phone: { href: string; label: string } | null;
  linkedIn: { href: string } | null;
  website: { href: string; label: string } | null;
  /** Sempre null até existir URL de agendamento confirmada. */
  booking: { href: string } | null;
}
