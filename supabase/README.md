# Supabase — perfis dos executivos

Banco e Storage da personalização por executivo (`/?executivo=<slug>` e painel `/painel/`).
Passo a passo completo de configuração: [`docs/CONFIGURACAO-SUPABASE.md`](../docs/CONFIGURACAO-SUPABASE.md).

## Conteúdo

| Caminho | O que faz |
| --- | --- |
| `migrations/20261010120000_executives.sql` | Tabela `public.executives`, CHECKs, índice de perfil padrão único, triggers (trim/`updated_at`, slug imutável, `photo_path` na própria pasta), RLS, grants e RPC `public.get_public_executive`. |
| `migrations/20261010120100_executive_photos_storage.sql` | Bucket público `executive-photos` (2 MB, `image/webp`/`image/jpeg`) e policies de `storage.objects` (cada usuário só mexe em `<auth.uid()>/...`). |
| `migrations/20261010120200_seed_sabrina.sql` | Perfil padrão de Sabrina Ferreira (idempotente). |
| `migrations/20261023120000_panel_admins.sql` | Administração da equipe: tabela `public.panel_admins`, `is_panel_admin()` e RPC `admin_list_executives()` (lista todos os perfis com a situação do acesso; recusa quem não é admin). |
| `functions/painel-admin/index.ts` | Edge Function da aba **Equipe**: cadastra pessoa + convite por e-mail, convida perfil sem acesso, reenvia convite/link de senha, desativa/reativa (bloqueia o login). Só atende admins. |
| `snippets/tornar-administrador.sql` | Dá (ou tira) acesso à aba Equipe. Usar uma vez para a primeira pessoa da CRED. |
| `snippets/vincular-executivo.sql` | Liga a conta de login (`auth.users`) a um perfil, pelo e-mail. |
| `snippets/criar-executivo.sql` | Modelo de novo perfil, com placeholders `<...>`. |
| `snippets/desativar-executivo.sql` | Desativa/reativa um perfil. |
| `snippets/trocar-perfil-padrao.sql` | Troca o perfil padrão de forma atômica. |
| `tests/rls.test.mjs` | Testes automatizados (PGlite). `npm run test:rls`. |

Aplique as migrations **uma vez, na ordem dos nomes** (SQL Editor ou `supabase db push`).
O contrato do frontend está em `src/lib/supabase/types.ts`; mudar coluna exige mudar os dois lados.

## Regras de segurança em uma linha cada

- `anon` não lê a tabela; a página pública usa só a RPC `get_public_executive` (sem `id`, `user_id`, e-mail de login ou `created_at`).
- `authenticated` lê e altera só a linha com `user_id = auth.uid()` e só as colunas de `EXECUTIVE_EDITABLE_COLUMNS`. Sem insert/delete.
- `slug`, `user_id`, `is_active`, `is_default`, `linkedin_url` e `website_url` são administrados no SQL Editor ou, para cadastro/convite/ativação, pela aba **Equipe** do painel (Edge Function com service_role, só para quem está em `panel_admins`).
- Ser administrador não amplia a RLS da tabela: o admin continua lendo e alterando direto só a própria linha; o resto passa pela RPC e pela Edge Function.
- O slug é imutável para todos os papéis (trigger). Renomear quebra links já enviados; se for mesmo necessário:

  ```sql
  begin;
  alter table public.executives disable trigger executives_slug_immutable;
  update public.executives set slug = '<novo>' where slug = '<antigo>';
  alter table public.executives enable trigger executives_slug_immutable;
  commit;
  ```

- O trigger de foto distingue papéis por `current_user` (as funções são `security invoker`): `postgres`, `service_role` e `supabase_admin` podem gravar qualquer `photo_path` válido; os demais só `<auth.uid()>/<arquivo>`.

## Testes

```
npm run test:rls
```

Sobe um Postgres em WASM ([PGlite](https://pglite.dev), devDependency `@electric-sql/pglite`), cria um stub mínimo do Supabase (papéis `anon`/`authenticated`/`service_role`, `auth.users`, `auth.uid()`/`auth.role()` lendo `request.jwt.claims`, privilégios padrão do schema `public`, `storage.buckets`, `storage.objects` com RLS, `storage.foldername`), aplica as três migrations reais e simula requisições com `set role` + `request.jwt.claims`.

Limitações (o que o teste **não** prova):

- Tamanho máximo e MIME do bucket são aplicados pelo serviço Storage, não pelo Postgres. Conferir com um upload real.
- URL pública `/storage/v1/object/public/...` e ausência de listagem anônima pela API do Storage.
- Login, convite, recuperação de senha (GoTrue) e PostgREST (HTTP, JWT assinado, `request.jwt.claims` reais).
- Diferenças de propriedade no Supabase hospedado (ex.: `storage.objects` pertence a `supabase_storage_admin`). A migration de storage evita `ALTER TABLE`/`COMMENT ON POLICY` nessa tabela por isso.

Depois de aplicar no projeto real, siga o checklist de verificação em `docs/CONFIGURACAO-SUPABASE.md`.
