import type { Executive } from '../types';

/**
 * Perfis locais de executivos (docs/03-personalizacao.md, "Perfil do executivo").
 * Sabrina: slides 1 e 11 do PPT. Delina Sampaio e Milena Andrade: dados enviados por Nil em
 * 26/10/2026 (nome, cargo, e-mail, telefone, LinkedIn, foto e liberação do WhatsApp).
 * Não presumir outros nomes ou contatos.
 *
 * Com o Supabase configurado, os perfis vêm da RPC pública `get_public_executive`
 * (src/lib/supabase/publicProfile.ts). Este registro continua sendo o perfil padrão
 * local: usado sem Supabase e quando a leitura do perfil padrão (endereço sem
 * identificador) falha. Atenção: com o Supabase ligado, `?executivo=` só procura no Supabase;
 * Delina e Milena precisam ser cadastradas lá também (mesmos slugs) antes de ligá-lo.
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

/** Foto: assets/executives/Delina-sampaio, retrato tratado por Nil em 26/10 (1064 × 1478),
 * recortado do busto para cima (780 × 1018). */
export const delinaSampaio: Executive = {
  id: 'delina-sampaio',
  firstName: 'Delina',
  fullName: 'Delina Sampaio',
  role: 'Executiva Comercial',
  photo: '/media/executives/delina-sampaio.jpg',
  photoSource: 'bundled',
  photoAlt: 'Retrato de Delina Sampaio, Executiva Comercial da CRED MHS',
  photoWidth: 780,
  photoHeight: 1018,
  email: 'comercial.rio@credmhs.com.br',
  phoneDisplay: '+55 (21) 99943-5149',
  phoneE164: '+5521999435149',
  linkedInUrl: 'https://www.linkedin.com/in/delina-sampaio',
  websiteUrl: 'https://www.credmhs.com.br',
  // WhatsApp liberado por Nil em 26/10 (mesmo número do telefone).
  whatsAppEnabled: true,
  whatsAppNumber: '5521999435149',
  sourceSlides: [],
  verificationStatus: 'confirmed',
};

/** Foto: assets/executives/Milena-andrade (1086 × 1448, sem recorte). */
export const milenaAndrade: Executive = {
  id: 'milena-andrade',
  firstName: 'Milena',
  fullName: 'Milena Andrade',
  role: 'Executiva Comercial',
  photo: '/media/executives/milena-andrade.jpg',
  photoSource: 'bundled',
  photoAlt: 'Retrato de Milena Andrade, Executiva Comercial da CRED MHS',
  photoWidth: 1086,
  photoHeight: 1448,
  email: 'comercial.rio1@credmhs.com.br',
  phoneDisplay: '+55 (21) 96760-7337',
  phoneE164: '+5521967607337',
  linkedInUrl: 'https://www.linkedin.com/in/milenaandrade12',
  websiteUrl: 'https://www.credmhs.com.br',
  // WhatsApp liberado por Nil em 26/10 (mesmo número do telefone).
  whatsAppEnabled: true,
  whatsAppNumber: '5521967607337',
  sourceSlides: [],
  verificationStatus: 'confirmed',
};

export const executives: readonly Executive[] = [sabrinaFerreira, delinaSampaio, milenaAndrade];

/**
 * Perfil padrão local: endereço sem identificador (docs/01, M01; docs/03).
 * Identificador desconhecido NÃO cai neste perfil (regra atual de Nil): mostra
 * "apresentação não encontrada", para nunca exibir o contato errado.
 */
export const DEFAULT_EXECUTIVE_ID = sabrinaFerreira.id;

/** Nome do parâmetro de URL que identifica o executivo (igual a src/lib/supabase/slug.ts). */
export const EXECUTIVE_QUERY_PARAM = 'executivo';
