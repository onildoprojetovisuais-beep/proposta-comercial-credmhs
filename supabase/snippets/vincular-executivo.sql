-- =============================================================================
-- Vincular a conta de login de um executivo ao perfil dele.
-- Rodar no SQL Editor do Supabase DEPOIS de criar/convidar o usuário em
-- Authentication → Users.
--
-- Substitua:
--   <EMAIL_DE_LOGIN>  e-mail usado no convite/criação do usuário (ex.: o da Sabrina)
--   <SLUG>            slug do perfil (ex.: sabrina-ferreira)
-- =============================================================================

-- 1) Conferir se o usuário existe (deve retornar exatamente 1 linha):
select id, email, created_at
from auth.users
where lower(email) = lower('<EMAIL_DE_LOGIN>');

-- 2) Vincular. Deve retornar "UPDATE 1".
--    Se der erro de unicidade em user_id, essa conta já está ligada a outro perfil.
update public.executives
set user_id = (select id from auth.users where lower(email) = lower('<EMAIL_DE_LOGIN>'))
where slug = '<SLUG>'
  and exists (select 1 from auth.users where lower(email) = lower('<EMAIL_DE_LOGIN>'));

-- 3) Conferir:
select e.slug, e.full_name, u.email as email_de_login
from public.executives e
left join auth.users u on u.id = e.user_id
where e.slug = '<SLUG>';

-- Para DESVINCULAR (ex.: conta trocada):
-- update public.executives set user_id = null where slug = '<SLUG>';
