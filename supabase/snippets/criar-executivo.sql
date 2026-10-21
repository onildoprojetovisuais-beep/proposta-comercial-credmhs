-- =============================================================================
-- Criar o perfil de um novo executivo (ex.: slug "catarina").
-- Rodar no SQL Editor do Supabase. Preencha SOMENTE com dados confirmados pela
-- CRED — não invente contatos, cargos ou links.
--
-- Placeholders:
--   <SLUG>             minúsculas, dígitos e hífen (2–64), ex.: catarina ou catarina-souza.
--                      É IMUTÁVEL e vira o link: /?executivo=<SLUG>
--   <NOME_COMPLETO>    2–80 caracteres
--   <NOME_CURTO>       1–40 caracteres (nome de apresentação)
--   <CARGO>            2–80 caracteres
--   <EMAIL_CONTATO>    e-mail exibido na apresentação
--   <TELEFONE_EXIBIDO> ex.: +55 (21) 9XXXX-XXXX (8–32 caracteres)
--   <TELEFONE_E164>    ex.: +5521XXXXXXXXX (só "+" e dígitos)
--   <URL_LINKEDIN>     https://... ou troque por null
--   <URL_SITE>         https://... ou troque por null
--
-- O executivo pode corrigir nome, cargo, contatos e foto depois, no /painel/.
-- =============================================================================

insert into public.executives (
  slug, full_name, display_name, role,
  contact_email, phone_display, phone_e164,
  linkedin_url, website_url,
  is_active, is_default
)
values (
  '<SLUG>', '<NOME_COMPLETO>', '<NOME_CURTO>', '<CARGO>',
  '<EMAIL_CONTATO>', '<TELEFONE_EXIBIDO>', '<TELEFONE_E164>',
  '<URL_LINKEDIN>', '<URL_SITE>',
  true, false
);

-- Próximos passos:
-- 1) Authentication → Users → Invite user (e-mail de login do executivo).
-- 2) Rodar supabase/snippets/vincular-executivo.sql com esse e-mail e o <SLUG>.
-- 3) Testar: /?executivo=<SLUG>
