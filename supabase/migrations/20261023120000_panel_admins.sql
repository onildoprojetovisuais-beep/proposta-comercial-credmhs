-- =============================================================================
-- CRED MHS · Administração da equipe pelo painel
-- Migration 4: tabela public.panel_admins, função public.is_panel_admin() e RPC
-- public.admin_list_executives().
--
-- Quem está em panel_admins vê a aba "Equipe" no /painel/: lista todos os perfis
-- com a situação do acesso e, pela Edge Function `painel-admin` (service_role),
-- cadastra vendedora com convite por e-mail, reenvia convite e desativa/reativa.
-- Nada aqui amplia o que um executivo comum lê ou altera: as policies e os GRANTs
-- da migration 1 continuam iguais.
--
-- Primeiro administrador: supabase/snippets/tornar-administrador.sql.
-- =============================================================================

create table public.panel_admins (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

comment on table public.panel_admins is
  'Contas com acesso à aba "Equipe" do painel. Sem policies: ninguém lê ou altera pela API; '
  'a checagem é feita por public.is_panel_admin(). Inclusão e remoção só no SQL Editor.';

alter table public.panel_admins enable row level security;
revoke all on table public.panel_admins from anon, authenticated;

-- -----------------------------------------------------------------------------
-- is_panel_admin(): a conta da requisição é administradora?
-- -----------------------------------------------------------------------------
create function public.is_panel_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.panel_admins as a where a.user_id = (select auth.uid())
  );
$$;

comment on function public.is_panel_admin() is
  'true quando auth.uid() está em public.panel_admins. Usada pelo painel (mostrar a aba Equipe) '
  'e pela Edge Function painel-admin (autorizar as ações).';

revoke execute on function public.is_panel_admin() from public, anon, authenticated;
grant execute on function public.is_panel_admin() to authenticated;

-- -----------------------------------------------------------------------------
-- admin_list_executives(): todos os perfis + situação do acesso, só para admins.
-- access_status:
--   sem-acesso       perfil sem conta de login vinculada
--   convite-pendente convite enviado e ainda não aceito
--   ativo            conta confirmada
--   bloqueado        conta bloqueada (perfil desativado pelo painel)
-- -----------------------------------------------------------------------------
create function public.admin_list_executives()
returns table (
  id            uuid,
  slug          text,
  is_active     boolean,
  is_default    boolean,
  full_name     text,
  display_name  text,
  role          text,
  contact_email text,
  photo_path    text,
  updated_at    timestamptz,
  is_self       boolean,
  login_email   text,
  access_status text
)
language plpgsql
stable
security definer
set search_path = ''
as $$
#variable_conflict use_column
begin
  if not public.is_panel_admin() then
    raise exception 'Acesso restrito à administração do painel.'
      using errcode = 'insufficient_privilege';
  end if;

  return query
  select
    e.id,
    e.slug,
    e.is_active,
    e.is_default,
    e.full_name,
    e.display_name,
    e.role,
    e.contact_email,
    e.photo_path,
    e.updated_at,
    (e.user_id is not null and e.user_id = (select auth.uid())) as is_self,
    u.email::text as login_email,
    case
      when e.user_id is null or u.id is null then 'sem-acesso'
      when u.banned_until is not null and u.banned_until > now() then 'bloqueado'
      when u.email_confirmed_at is null then 'convite-pendente'
      else 'ativo'
    end as access_status
  from public.executives as e
  left join auth.users as u on u.id = e.user_id
  order by e.is_active desc, e.is_default desc, lower(e.full_name);
end;
$$;

comment on function public.admin_list_executives() is
  'Lista da aba Equipe: todos os perfis com e-mail de login e situação do acesso. '
  'Recusa (42501) quem não está em public.panel_admins.';

revoke execute on function public.admin_list_executives() from public, anon, authenticated;
grant execute on function public.admin_list_executives() to authenticated;
