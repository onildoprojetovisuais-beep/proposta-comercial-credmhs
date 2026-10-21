-- =============================================================================
-- CRED MHS · Perfil padrão (Sabrina Ferreira)
-- Migration 3/3: insere o perfil de Sabrina, migrado de src/content/executives.ts
-- (dados de origem: apresentação original, slides 2 e 19).
--
-- Idempotente: rodar de novo não altera nada (on conflict (slug) do nothing).
-- user_id fica null: o administrador vincula a conta de login depois com
-- supabase/snippets/vincular-executivo.sql.
-- photo_path fica null: enquanto for null, o frontend usa o retrato local de Sabrina.
-- =============================================================================

insert into public.executives (
  slug,
  full_name,
  display_name,
  role,
  contact_email,
  phone_display,
  phone_e164,
  linkedin_url,
  website_url,
  is_default,
  is_active,
  user_id,
  photo_path
)
values (
  'sabrina-ferreira',
  'Sabrina Ferreira',
  'Sabrina',
  'Executiva de Negócios',
  'sabrina.ferreira@credmhs.com.br',
  '+55 (21) 98896-7369',
  '+5521988967369',
  'https://www.linkedin.com/in/sabrinaferreira',
  'https://www.credmhs.com.br',
  true,
  true,
  null,
  null
)
on conflict (slug) do nothing;
