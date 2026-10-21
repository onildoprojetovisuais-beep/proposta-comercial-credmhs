import type { Executive } from '../types';

/**
 * Perfis locais de executivos (docs/03-personalizacao.md, "Perfil do executivo").
 * Só Sabrina possui dados documentados (V3: slides 1 e 11 do PPT da Sabrina, que trazem nome e
 * cargo, com telefone/e-mail como espaços reservados). Não presumir outros nomes ou contatos.
 *
 * Com o Supabase configurado, os perfis vêm da RPC pública `get_public_executive`
 * (src/lib/supabase/publicProfile.ts). Este registro continua sendo o perfil padrão
 * local: usado sem Supabase e quando a leitura do perfil padrão (endereço sem
 * identificador) falha. Novos executivos são cadastrados no Supabase, não aqui.
 */
export const sabrinaFerreira: Executive = {
  id: 'sabrina-ferreira',
  firstName: 'Sabrina',
  fullName: 'Sabrina Ferreira',
  role: 'Executiva de Negócios',
  // Derivado de assets/executives/sabrina-ferreira/foto-sabrina.png (1098 × 1433, PNG ~2,2 MB).
  // Os arquivos servidos são os derivados -640/-1098 (avif/webp/jpg) de public/media/executives.
  photo: '/media/executives/sabrina-ferreira.png',
  photoSource: 'bundled',
  photoAlt: 'Retrato de Sabrina Ferreira, Executiva de Negócios da CRED MHS',
  photoWidth: 1098,
  photoHeight: 1433,
  email: 'sabrina.ferreira@credmhs.com.br',
  phoneDisplay: '+55 (21) 98896-7369',
  phoneE164: '+5521988967369',
  linkedInUrl: 'https://www.linkedin.com/in/sabrinaferreira',
  websiteUrl: 'https://www.credmhs.com.br',
  // P13: telefone existe, mas o canal WhatsApp não foi confirmado. Não preencher por inferência.
  whatsAppEnabled: false,
  whatsAppNumber: null,
  sourceSlides: [2, 19],
  verificationStatus: 'source-supplied',
};

export const executives: readonly Executive[] = [sabrinaFerreira];

/**
 * Perfil padrão local: endereço sem identificador (docs/01, M01; docs/03).
 * Identificador desconhecido NÃO cai neste perfil (regra atual de Nil): mostra
 * "apresentação não encontrada", para nunca exibir o contato errado.
 */
export const DEFAULT_EXECUTIVE_ID = sabrinaFerreira.id;

/** Nome do parâmetro de URL que identifica o executivo (igual a src/lib/supabase/slug.ts). */
export const EXECUTIVE_QUERY_PARAM = 'executivo';
