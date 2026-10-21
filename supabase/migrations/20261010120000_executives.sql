-- =============================================================================
-- CRED MHS · Perfis de executivos da apresentação comercial
-- Migration 1/3: tabela public.executives, constraints, índices, triggers,
-- RLS, grants e RPC pública get_public_executive.
--
-- Espelha o contrato de src/lib/supabase/types.ts (colunas, colunas editáveis,
-- FIELD_LIMITS e padrões), src/lib/supabase/slug.ts e src/lib/supabase/storage.ts.
-- Qualquer mudança aqui precisa ser refletida lá (e vice-versa).
--
-- Pode ser colada no SQL Editor do Supabase (papel postgres) ou aplicada com
-- `supabase db push`. Não é idempotente: aplique uma única vez, na ordem.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Tabela
-- -----------------------------------------------------------------------------
create table public.executives (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid unique references auth.users (id) on delete set null,
  slug          text not null unique,
  is_active     boolean not null default true,
  is_default    boolean not null default false,
  full_name     text not null,
  display_name  text not null,
  role          text not null,
  contact_email text not null,
  phone_display text not null,
  phone_e164    text not null,
  photo_path    text,
  photo_width   integer,
  photo_height  integer,
  linkedin_url  text,
  website_url   text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),

  -- slug: mesma regra de src/lib/supabase/slug.ts
  constraint executives_slug_format check (
    char_length(slug) between 2 and 64
    and slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'
  ),

  -- FIELD_LIMITS (comprimento após trim)
  constraint executives_full_name_length     check (char_length(btrim(full_name)) between 2 and 80),
  constraint executives_display_name_length  check (char_length(btrim(display_name)) between 1 and 40),
  constraint executives_role_length          check (char_length(btrim(role)) between 2 and 80),
  constraint executives_contact_email_length check (char_length(btrim(contact_email)) between 5 and 254),
  constraint executives_phone_display_length check (char_length(btrim(phone_display)) between 8 and 32),
  constraint executives_phone_e164_length    check (char_length(btrim(phone_e164)) between 9 and 16),

  -- Padrões (CONTACT_EMAIL_PATTERN e PHONE_E164_PATTERN)
  constraint executives_contact_email_format check (contact_email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  constraint executives_phone_e164_format    check (phone_e164 ~ '^\+[1-9][0-9]{7,14}$'),

  -- Foto: caminho dentro do bucket executive-photos, `<uuid>/<arquivo>` (PHOTO_PATH_PATTERN)
  constraint executives_photo_path_format check (
    photo_path is null
    or photo_path ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/[A-Za-z0-9._-]{1,120}$'
  ),
  constraint executives_photo_width_range  check (photo_width  is null or photo_width  between 1 and 4000),
  constraint executives_photo_height_range check (photo_height is null or photo_height between 1 and 4000),

  -- Links administrados pelo Supabase: só https
  constraint executives_linkedin_url_format check (
    linkedin_url is null or (linkedin_url ~ '^https://' and char_length(linkedin_url) <= 2048)
  ),
  constraint executives_website_url_format check (
    website_url is null or (website_url ~ '^https://' and char_length(website_url) <= 2048)
  )
);

comment on table public.executives is
  'Perfis dos executivos exibidos na apresentação comercial (/?executivo=<slug>). '
  'RLS ligada: o executivo autenticado lê e altera só a própria linha (user_id = auth.uid()) '
  'e só as colunas editáveis. anon não lê a tabela: a leitura pública é feita pela RPC '
  'public.get_public_executive. slug, user_id, is_active, is_default, linkedin_url e '
  'website_url são administrados no Supabase (SQL Editor / service_role).';

comment on column public.executives.id            is 'Identificador interno. Nunca exposto pela RPC pública.';
comment on column public.executives.user_id       is 'Conta de login (auth.users.id) dona do perfil. Null até o administrador vincular. Nunca exposto pela RPC pública.';
comment on column public.executives.slug          is 'Identificador público usado em /?executivo=<slug>. Minúsculas, dígitos e hífen simples, 2–64 caracteres. Imutável (trigger executives_slug_immutable).';
comment on column public.executives.is_active     is 'false: a apresentação pública mostra o perfil como indisponível (RPC devolve available=false sem dados).';
comment on column public.executives.is_default    is 'Perfil usado quando a URL não traz ?executivo=. No máximo uma linha true (índice executives_single_default).';
comment on column public.executives.full_name     is 'Nome completo exibido (2–80 caracteres após trim). Editável pelo executivo.';
comment on column public.executives.display_name  is 'Nome curto de apresentação (1–40). Editável pelo executivo.';
comment on column public.executives.role          is 'Cargo exibido (2–80). Editável pelo executivo.';
comment on column public.executives.contact_email is 'E-mail de contato exibido na apresentação. Não é o e-mail de login. Editável pelo executivo.';
comment on column public.executives.phone_display is 'Telefone formatado para leitura (8–32). Editável pelo executivo.';
comment on column public.executives.phone_e164    is 'Telefone em E.164 (+5521...), usado em links tel:. Editável pelo executivo.';
comment on column public.executives.photo_path    is 'Caminho do retrato no bucket executive-photos: <user_id>/<arquivo>. Null: o frontend usa o retrato local (Sabrina). Quando o executivo altera, precisa estar na pasta do próprio auth.uid().';
comment on column public.executives.photo_width   is 'Largura do retrato em px (1–4000) para reservar espaço no layout.';
comment on column public.executives.photo_height  is 'Altura do retrato em px (1–4000).';
comment on column public.executives.linkedin_url  is 'URL https do LinkedIn. Administrada no Supabase (não editável pelo executivo).';
comment on column public.executives.website_url   is 'URL https do site. Administrada no Supabase (não editável pelo executivo).';
comment on column public.executives.created_at    is 'Criação do registro. Nunca exposta pela RPC pública.';
comment on column public.executives.updated_at    is 'Última alteração (trigger). Exposta pela RPC para invalidar cache de foto/dados.';

-- -----------------------------------------------------------------------------
-- Índices
-- -----------------------------------------------------------------------------
-- slug e user_id já têm índices únicos (constraints unique).
create unique index executives_single_default
  on public.executives ((is_default))
  where is_default;

comment on index public.executives_single_default is
  'Garante no máximo um perfil padrão (is_default = true).';

-- -----------------------------------------------------------------------------
-- Triggers
-- Todas as funções são SECURITY INVOKER (padrão): current_user dentro delas é o
-- papel de quem executa — 'authenticated' na API com sessão, 'anon' sem sessão,
-- 'service_role' com a chave secreta e 'postgres' no SQL Editor.
-- -----------------------------------------------------------------------------

-- 1) Normalização: trim nos textos e updated_at.
create function public.executives_normalize()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.full_name     := btrim(new.full_name);
  new.display_name  := btrim(new.display_name);
  new.role          := btrim(new.role);
  new.contact_email := btrim(new.contact_email);
  new.phone_display := btrim(new.phone_display);
  new.phone_e164    := btrim(new.phone_e164);
  new.photo_path    := nullif(btrim(new.photo_path), '');
  new.linkedin_url  := nullif(btrim(new.linkedin_url), '');
  new.website_url   := nullif(btrim(new.website_url), '');
  new.slug          := btrim(new.slug);

  if tg_op = 'UPDATE' then
    new.updated_at := now();
  end if;

  return new;
end;
$$;

comment on function public.executives_normalize() is
  'Trigger BEFORE INSERT/UPDATE: aplica trim nos campos de texto (vazio vira null nos opcionais) e atualiza updated_at.';

create trigger executives_normalize
  before insert or update on public.executives
  for each row execute function public.executives_normalize();

-- 2) Slug imutável — vale para QUALQUER papel, inclusive postgres/service_role.
--    Para renomear um slug de forma consciente (quebra links já enviados):
--      begin;
--      alter table public.executives disable trigger executives_slug_immutable;
--      update public.executives set slug = '<novo>' where slug = '<antigo>';
--      alter table public.executives enable trigger executives_slug_immutable;
--      commit;
create function public.executives_slug_immutable()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  -- btrim: os triggers BEFORE disparam em ordem alfabética; a normalização pode vir depois.
  if btrim(new.slug) is distinct from old.slug then
    raise exception 'O slug do executivo é imutável (de "%" para "%"). Veja supabase/README.md para renomear conscientemente.', old.slug, new.slug
      using errcode = 'check_violation';
  end if;
  return new;
end;
$$;

comment on function public.executives_slug_immutable() is
  'Trigger BEFORE UPDATE: impede a troca de slug para qualquer papel. O administrador pode desabilitar o trigger dentro de uma transação para renomear conscientemente.';

create trigger executives_slug_immutable
  before update of slug on public.executives
  for each row execute function public.executives_slug_immutable();

-- 3) photo_path na pasta do próprio usuário.
--    Papéis administrativos (postgres no SQL Editor, service_role, supabase_admin)
--    podem definir qualquer caminho válido. Os demais (authenticated) só podem
--    gravar um caminho que comece com `<auth.uid()>/`.
create function public.executives_guard_photo_path()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  v_uid  text := (select auth.uid())::text;
  v_path text := nullif(btrim(new.photo_path), '');
begin
  if current_user in ('postgres', 'service_role', 'supabase_admin') then
    return new;
  end if;

  -- v_path já com trim: os triggers BEFORE disparam em ordem alfabética.
  if v_path is not null
     and v_path is distinct from old.photo_path
     and (v_uid is null or left(v_path, char_length(v_uid) + 1) <> v_uid || '/') then
    raise exception 'photo_path precisa estar na pasta do próprio usuário (<auth.uid()>/arquivo).'
      using errcode = 'insufficient_privilege';
  end if;

  return new;
end;
$$;

comment on function public.executives_guard_photo_path() is
  'Trigger BEFORE UPDATE: para papéis não administrativos, um photo_path novo e não nulo precisa começar com auth.uid()::text || ''/''.';

create trigger executives_guard_photo_path
  before update of photo_path on public.executives
  for each row execute function public.executives_guard_photo_path();

revoke execute on function public.executives_normalize()        from public, anon, authenticated;
revoke execute on function public.executives_slug_immutable()   from public, anon, authenticated;
revoke execute on function public.executives_guard_photo_path() from public, anon, authenticated;

-- -----------------------------------------------------------------------------
-- RLS e privilégios
-- -----------------------------------------------------------------------------
alter table public.executives enable row level security;

-- O Supabase concede, por padrão, todos os privilégios de tabelas novas em public
-- para anon/authenticated. Revogamos e concedemos só o necessário.
revoke all on table public.executives from anon, authenticated;
grant select on table public.executives to authenticated;
grant update (
  full_name,
  display_name,
  role,
  contact_email,
  phone_display,
  phone_e164,
  photo_path,
  photo_width,
  photo_height
) on table public.executives to authenticated;
-- Sem INSERT/DELETE para anon/authenticated: perfis são criados e removidos pelo administrador.

create policy executives_select_own
  on public.executives
  for select
  to authenticated
  using (user_id = (select auth.uid()));

create policy executives_update_own
  on public.executives
  for update
  to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

comment on policy executives_select_own on public.executives is
  'O executivo autenticado lê apenas o próprio perfil.';
comment on policy executives_update_own on public.executives is
  'O executivo autenticado altera apenas o próprio perfil (colunas limitadas pelo GRANT UPDATE).';

-- -----------------------------------------------------------------------------
-- RPC pública
-- -----------------------------------------------------------------------------
create function public.get_public_executive(p_slug text default null)
returns table (
  slug          text,
  available     boolean,
  full_name     text,
  display_name  text,
  role          text,
  contact_email text,
  phone_display text,
  phone_e164    text,
  photo_path    text,
  photo_width   integer,
  photo_height  integer,
  linkedin_url  text,
  website_url   text,
  updated_at    timestamptz
)
language sql
stable
security definer
set search_path = ''
as $$
  select
    e.slug,
    e.is_active                                  as available,
    case when e.is_active then e.full_name     end as full_name,
    case when e.is_active then e.display_name  end as display_name,
    case when e.is_active then e.role          end as role,
    case when e.is_active then e.contact_email end as contact_email,
    case when e.is_active then e.phone_display end as phone_display,
    case when e.is_active then e.phone_e164    end as phone_e164,
    case when e.is_active then e.photo_path    end as photo_path,
    case when e.is_active then e.photo_width   end as photo_width,
    case when e.is_active then e.photo_height  end as photo_height,
    case when e.is_active then e.linkedin_url  end as linkedin_url,
    case when e.is_active then e.website_url   end as website_url,
    case when e.is_active then e.updated_at    end as updated_at
  from public.executives as e
  where case
          when nullif(lower(btrim(p_slug)), '') is null then e.is_default
          else e.slug = lower(btrim(p_slug))
        end
  limit 1;
$$;

comment on function public.get_public_executive(text) is
  'Leitura pública do perfil do executivo (anon). p_slug null ou vazio: perfil padrão (is_default). '
  'Slug inexistente: 0 linhas. Perfil inativo: 1 linha com slug e available=false, demais campos null. '
  'Perfil ativo: 1 linha completa. Nunca devolve id, user_id, e-mail de login nem created_at. '
  'SECURITY DEFINER com search_path vazio; p_slug é normalizado com lower(btrim()).';

revoke execute on function public.get_public_executive(text) from public, anon, authenticated;
grant execute on function public.get_public_executive(text) to anon, authenticated;
