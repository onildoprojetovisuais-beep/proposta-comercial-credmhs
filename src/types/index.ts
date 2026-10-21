/**
 * Tipos de conteúdo e estado da apresentação CRED MHS.
 * Fatos, clientes, credenciais e executivo. Tipos da apresentação V2 em ./presentation.ts.
 *
 * Regra: `verificationStatus` descreve a situação factual do dado;
 * `displayPolicy` descreve como a interface pode usá-lo. São independentes.
 * Nenhum desses campos deve ser exibido ao prospect.
 */

/** Situação factual de um dado. Transcrever do deck não o torna `confirmed`. */
export type VerificationStatus = 'source-supplied' | 'confirmed' | 'conflict' | 'missing';

/**
 * Política de exibição, separada do status factual.
 * - `show`: pode aparecer na leitura principal ou nos detalhes.
 * - `use-fallback`: não exibir o valor; usar `fallbackText`.
 * - `inventory-only`: preservado no inventário/código, nunca renderizado ao prospect.
 * - `hidden-until-confirmed`: modelado, só pode aparecer após confirmação dos campos exigidos.
 */
export type DisplayPolicy = 'show' | 'use-fallback' | 'inventory-only' | 'hidden-until-confirmed';

/** Número de slide da apresentação original (1–19). */
export type SourceSlide = number;

// ---------------------------------------------------------------------------
// Fatos, clientes, credenciais
// ---------------------------------------------------------------------------

export interface Fact {
  id: string;
  /** Valor como exibido ("16", "+700", "+550 mil"). */
  value: string;
  /** Qualificador obrigatório, sem reescrita ("Clientes atendidos", nunca "ativos"). */
  qualifier: string;
  sourceSlides: SourceSlide[];
  verificationStatus: VerificationStatus;
  displayPolicy: DisplayPolicy;
  /** Texto a usar quando `displayPolicy === 'use-fallback'`. */
  fallbackText?: string;
  /** Valores divergentes por fonte (para `conflict`). Uso interno. */
  variants?: { value: string; source: string }[];
  /** ID da pendência em docs/07. Uso interno. */
  pendingRef?: string;
  /** Nota interna. Nunca renderizar. */
  internalNote?: string;
}

export type ClientRelationshipStatus =
  /** Nome consta no slide 16; vínculo (atual/histórico/outro) não qualificado. */
  'listed-in-source' | 'confirmed-current' | 'confirmed-past';

export interface Client {
  id: string;
  name: string;
  /** Caminho público do logo oficial (opcional). Nunca redesenhar a partir do nome. */
  logo?: string;
  logoAlt?: string;
  sourceSlides: SourceSlide[];
  relationshipStatus: ClientRelationshipStatus;
  verificationStatus: VerificationStatus;
}

export type CredentialKind = 'iso' | 'data-protection';

export interface Credential {
  id: string;
  label: string;
  kind: CredentialKind;
  holder?: string;
  scope?: string;
  validity?: string;
  /** Caminho de selo/documento oficial, se fornecido. */
  asset?: string;
  sourceSlides: SourceSlide[];
  verificationStatus: VerificationStatus;
  displayPolicy: DisplayPolicy;
  internalNote?: string;
}

// ---------------------------------------------------------------------------
// Executivo
// ---------------------------------------------------------------------------

/** Origem do retrato: arquivo do projeto (com derivados avif/webp/jpg) ou Storage do Supabase. */
export type ExecutivePhotoSource = 'bundled' | 'remote';

export interface Executive {
  /** Identificador público (= slug do Supabase, ex.: `sabrina-ferreira`). */
  id: string;
  /** Nome de apresentação ("Olá, {firstName}!"). */
  firstName: string;
  fullName: string;
  role: string;
  /**
   * Retrato real: caminho do projeto (`photoSource: 'bundled'`) ou URL absoluta pública do
   * Storage (`'remote'`). null → layout tipográfico.
   */
  photo: string | null;
  photoSource: ExecutivePhotoSource | null;
  photoAlt: string;
  /** Dimensões intrínsecas do retrato, para reservar espaço. */
  photoWidth?: number;
  photoHeight?: number;
  /** null → e-mail ausente ou inválido: o canal fica oculto. */
  email: string | null;
  /** null → telefone ausente ou inválido: o canal fica oculto. */
  phoneDisplay: string | null;
  /** Formato E.164, ex.: +5521988967369. */
  phoneE164: string | null;
  linkedInUrl: string | null;
  websiteUrl: string | null;
  /** Só true com confirmação explícita do canal. */
  whatsAppEnabled: boolean;
  /** Só preencher com número confirmado para WhatsApp (dígitos E.164 sem +). */
  whatsAppNumber: string | null;
  sourceSlides: SourceSlide[];
  verificationStatus: VerificationStatus;
}

/**
 * Resultado da resolução do executivo pela URL (`?executivo=<slug>`). Uso interno.
 * - ready: perfil pronto. `origin` diz de onde veio: `local` (perfil do projeto) ou `remote` (Supabase).
 *   `reason`: 'default' (sem identificador), 'matched' (identificador encontrado),
 *   'default-fallback' (sem identificador e o Supabase falhou → perfil local documentado).
 * - not-found: identificador inexistente ou com formato inválido.
 * - unavailable: perfil existe, mas está inativo.
 * - error: falha de conexão/servidor com identificador (oferece "Tentar novamente").
 */
export type ExecutiveResolution =
  | {
      status: 'ready';
      executive: Executive;
      origin: 'local' | 'remote';
      reason: 'default' | 'matched' | 'default-fallback';
      requestedId: string | null;
    }
  | { status: 'not-found'; requestedId: string }
  | { status: 'unavailable'; requestedId: string | null }
  | { status: 'error'; requestedId: string };

// ---------------------------------------------------------------------------
// V2: capítulos, eixos, trilha e contatos (contrato do coordenador)
// ---------------------------------------------------------------------------

export * from './presentation';
