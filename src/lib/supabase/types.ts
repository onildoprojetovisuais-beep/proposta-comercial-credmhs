/**
 * Tipos do banco (CONTRATO COMPARTILHADO — dono: coordenação). Espelham
 * supabase/migrations. Qualquer mudança de coluna precisa atualizar os dois lados.
 *
 * Tabela `public.executives` (RLS ligada; anon NÃO lê a tabela):
 *   id uuid PK · user_id uuid UNIQUE → auth.users (null até vincular a conta)
 *   slug text UNIQUE NOT NULL, imutável · is_active bool · is_default bool (no máximo 1 true)
 *   full_name · display_name · role · contact_email · phone_display · phone_e164
 *   photo_path · photo_width · photo_height · linkedin_url · website_url
 *   created_at · updated_at
 *
 * O usuário autenticado lê e altera SÓ a própria linha (user_id = auth.uid()) e SÓ as
 * colunas de EXECUTIVE_EDITABLE_COLUMNS. slug, user_id, is_active, is_default,
 * linkedin_url e website_url são administrados no Supabase.
 * photo_path, quando preenchido pelo executivo, precisa começar com `<auth.uid()>/`.
 *
 * Leitura pública: RPC `public.get_public_executive(p_slug text default null)`
 * (security definer, execute para anon). p_slug null → perfil padrão (is_default).
 * Retorna 0 linhas para slug inexistente; 1 linha com available=false (demais campos null,
 * exceto slug) para perfil inativo; 1 linha completa para perfil ativo. Nunca devolve
 * id, user_id, e-mail de login nem created_at.
 */

/** Linha da RPC pública `get_public_executive`. */
export interface PublicExecutiveRow {
  slug: string;
  available: boolean;
  full_name: string | null;
  display_name: string | null;
  role: string | null;
  contact_email: string | null;
  phone_display: string | null;
  phone_e164: string | null;
  photo_path: string | null;
  photo_width: number | null;
  photo_height: number | null;
  linkedin_url: string | null;
  website_url: string | null;
  /** Usado para invalidar cache de foto/dados. */
  updated_at: string | null;
}

/** Linha completa vista pelo próprio executivo no painel (SELECT da própria linha). */
export interface ExecutiveRow {
  id: string;
  user_id: string | null;
  slug: string;
  is_active: boolean;
  is_default: boolean;
  full_name: string;
  display_name: string;
  role: string;
  contact_email: string;
  phone_display: string;
  phone_e164: string;
  photo_path: string | null;
  photo_width: number | null;
  photo_height: number | null;
  linkedin_url: string | null;
  website_url: string | null;
  created_at: string;
  updated_at: string;
}

/** Colunas que o executivo pode alterar (GRANT UPDATE (...) TO authenticated). */
export const EXECUTIVE_EDITABLE_COLUMNS = [
  'full_name',
  'display_name',
  'role',
  'contact_email',
  'phone_display',
  'phone_e164',
  'photo_path',
  'photo_width',
  'photo_height',
] as const;

export type ExecutiveEditableColumn = (typeof EXECUTIVE_EDITABLE_COLUMNS)[number];
export type ExecutiveUpdate = Partial<Pick<ExecutiveRow, ExecutiveEditableColumn>>;

/**
 * Limites de campo (iguais às CHECK constraints da migration, comprimento após trim).
 * phone_e164: `^\+[1-9][0-9]{7,14}$`. contact_email: `^[^@\s]+@[^@\s]+\.[^@\s]+$`.
 * photo_width/photo_height: 1–4000 ou null.
 */
export const FIELD_LIMITS = {
  full_name: { min: 2, max: 80 },
  display_name: { min: 1, max: 40 },
  role: { min: 2, max: 80 },
  contact_email: { min: 5, max: 254 },
  phone_display: { min: 8, max: 32 },
  phone_e164: { min: 9, max: 16 },
} as const;

export const PHONE_E164_PATTERN = /^\+[1-9][0-9]{7,14}$/;
export const CONTACT_EMAIL_PATTERN = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
