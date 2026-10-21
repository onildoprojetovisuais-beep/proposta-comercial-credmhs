-- =============================================================================
-- CRED MHS · Retratos dos executivos (Supabase Storage)
-- Migration 2/3: bucket executive-photos e policies em storage.objects.
--
-- Igual a src/lib/supabase/config.ts: bucket `executive-photos`, 2 MB,
-- image/webp e image/jpeg. Caminho de cada arquivo: `<auth.uid()>/<arquivo>`
-- (src/lib/supabase/storage.ts).
--
-- Leitura pública: o bucket é público, então o serviço Storage entrega os
-- arquivos em /storage/v1/object/public/executive-photos/<caminho> sem policy.
-- NÃO há policy de SELECT para anon (isso permitiria listar a pasta de todos).
--
-- Observação: no Supabase hospedado, storage.objects pertence ao papel
-- supabase_storage_admin; por isso não usamos ALTER TABLE nem COMMENT ON POLICY
-- nessa tabela (o RLS já vem ligado). As explicações ficam nestes comentários.
-- =============================================================================

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'executive-photos',
  'executive-photos',
  true,
  2097152,                                -- 2 MB (PHOTO_MAX_UPLOAD_BYTES)
  array['image/webp', 'image/jpeg']       -- PHOTO_ALLOWED_MIME
)
on conflict (id) do update
  set name               = excluded.name,
      public             = excluded.public,
      file_size_limit    = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- Envio de arquivo novo: só na pasta do próprio usuário e com nome no formato
-- aceito por photo_path (`<uuid>/[A-Za-z0-9._-]{1,120}`).
create policy executive_photos_insert_own
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'executive-photos'
    and (storage.foldername(name))[1] = (select auth.uid())::text
    and name ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/[A-Za-z0-9._-]{1,120}$'
  );

-- Leitura/listagem autenticada: só os próprios arquivos (necessária para upsert
-- e para o painel conferir/remover a foto anterior).
create policy executive_photos_select_own
  on storage.objects
  for select
  to authenticated
  using (
    bucket_id = 'executive-photos'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

-- Substituição (upsert): só os próprios arquivos e sem mover para fora da pasta.
create policy executive_photos_update_own
  on storage.objects
  for update
  to authenticated
  using (
    bucket_id = 'executive-photos'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  )
  with check (
    bucket_id = 'executive-photos'
    and (storage.foldername(name))[1] = (select auth.uid())::text
    and name ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/[A-Za-z0-9._-]{1,120}$'
  );

-- Remoção: só os próprios arquivos.
create policy executive_photos_delete_own
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'executive-photos'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );
