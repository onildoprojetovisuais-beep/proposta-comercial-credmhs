// Testes automatizados de RLS/grants/triggers/RPC/Storage das migrations do Supabase.
// Rodam sem Supabase real: PGlite (Postgres em WASM) + um stub mínimo dos schemas
// auth e storage do Supabase. Uso: `npm run test:rls`.
//
// O que o stub reproduz: papéis anon/authenticated/service_role, auth.users,
// auth.uid()/auth.role() lendo request.jwt.claims (como o PostgREST define),
// privilégios padrão do Supabase em public (tudo para anon/authenticated),
// storage.buckets, storage.objects com RLS e storage.foldername().
// O que NÃO reproduz: o serviço Storage (limite de tamanho e MIME do bucket,
// URLs públicas), o GoTrue (login, convites) e o PostgREST (HTTP, JWT assinado).

import { readFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PGlite } from '@electric-sql/pglite';

const here = dirname(fileURLToPath(import.meta.url));
const migrationsDir = join(here, '..', 'migrations');

const A = '11111111-1111-4111-8111-111111111111';
const B = '22222222-2222-4222-8222-222222222222';

let failures = 0;
let passed = 0;

function ok(name) {
  passed += 1;
  console.log(`ok - ${name}`);
}
function fail(name, detail) {
  failures += 1;
  console.log(`not ok - ${name}`);
  if (detail) console.log(`  # ${String(detail).split('\n').join('\n  # ')}`);
}
async function test(name, fn) {
  try {
    await fn();
    ok(name);
  } catch (err) {
    fail(name, err?.stack ?? err);
  }
}
function assert(cond, msg) {
  if (!cond) throw new Error(msg ?? 'assertion failed');
}
function eq(actual, expected, msg) {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error(`${msg ?? 'valores diferentes'}\n esperado: ${JSON.stringify(expected)}\n recebido: ${JSON.stringify(actual)}`);
  }
}
async function rejects(promise, pattern, msg) {
  try {
    await promise;
  } catch (err) {
    if (pattern && !pattern.test(String(err?.message ?? err))) {
      throw new Error(`${msg ?? 'erro inesperado'}: ${err?.message ?? err}`);
    }
    return err;
  }
  throw new Error(msg ?? 'era esperado um erro');
}

const db = new PGlite();

// --- Contexto de requisição ---------------------------------------------------
async function asRole(role, sub) {
  await db.exec('reset role');
  const claims = sub ? { sub, role } : { role };
  await db.query(`select set_config('request.jwt.claims', $1, false)`, [JSON.stringify(claims)]);
  if (role !== 'postgres') await db.exec(`set role ${role}`);
}
async function asAdmin() {
  await db.exec('reset role');
  await db.query(`select set_config('request.jwt.claims', '', false)`);
}
const asUser = (sub) => asRole('authenticated', sub);
const asAnon = () => asRole('anon');
const asService = () => asRole('service_role');

// --- Stub do ambiente Supabase -------------------------------------------------
const stub = `
create role anon nologin noinherit;
create role authenticated nologin noinherit;
create role service_role nologin noinherit bypassrls;

grant usage on schema public to anon, authenticated, service_role;

-- Privilégios padrão do Supabase: tabelas e funções novas em public ficam
-- liberadas para anon/authenticated/service_role. As migrations precisam revogar.
alter default privileges in schema public grant all on tables to anon, authenticated, service_role;
alter default privileges in schema public grant all on functions to anon, authenticated, service_role;

create schema auth;
grant usage on schema auth to anon, authenticated, service_role;
create table auth.users (id uuid primary key, email text, created_at timestamptz default now());

create function auth.uid() returns uuid language sql stable as $$
  select coalesce(
    nullif(current_setting('request.jwt.claim.sub', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub')
  )::uuid
$$;
create function auth.role() returns text language sql stable as $$
  select coalesce(
    nullif(current_setting('request.jwt.claim.role', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'role')
  )::text
$$;
grant execute on function auth.uid(), auth.role() to anon, authenticated, service_role;

create schema storage;
grant usage on schema storage to anon, authenticated, service_role;
create table storage.buckets (
  id text primary key,
  name text not null,
  public boolean default false,
  file_size_limit bigint,
  allowed_mime_types text[]
);
create table storage.objects (
  id uuid primary key default gen_random_uuid(),
  bucket_id text references storage.buckets (id),
  name text,
  owner uuid
);
alter table storage.objects enable row level security;
grant all on storage.objects to anon, authenticated, service_role;
grant all on storage.buckets to anon, authenticated, service_role;

create function storage.foldername(name text) returns text[] language plpgsql immutable as $$
declare _parts text[];
begin
  select string_to_array(name, '/') into _parts;
  return _parts[1:array_length(_parts, 1) - 1];
end
$$;
grant execute on function storage.foldername(text) to anon, authenticated, service_role;

insert into auth.users (id, email) values
  ('${A}', 'a@example.test'),
  ('${B}', 'b@example.test');
`;

function migrationFiles() {
  return readdirSync(migrationsDir).filter((f) => f.endsWith('.sql')).sort();
}
function readMigration(file) {
  return readFileSync(join(migrationsDir, file), 'utf8');
}

async function main() {
  await db.exec(stub);

  const files = migrationFiles();
  eq(files, [
    '20261010120000_executives.sql',
    '20261010120100_executive_photos_storage.sql',
    '20261010120200_seed_sabrina.sql',
  ], 'migrations esperadas');
  for (const f of files) {
    try {
      await db.exec(readMigration(f));
      ok(`migration aplicada: ${f}`);
    } catch (err) {
      fail(`migration aplicada: ${f}`, err?.message ?? err);
      throw new Error('migration falhou; testes interrompidos');
    }
  }

  // Dados de teste (como administrador): A = Sabrina (seed), B = Bruno, C inativo sem conta.
  await asAdmin();
  await db.exec(`
    update public.executives set user_id = '${A}' where slug = 'sabrina-ferreira';
    insert into public.executives (slug, user_id, full_name, display_name, role, contact_email, phone_display, phone_e164)
    values ('bruno-teste', '${B}', 'Bruno Teste', 'Bruno', 'Executivo de Teste', 'bruno@example.test', '+55 (11) 90000-0000', '+5511900000000');
    insert into public.executives (slug, is_active, full_name, display_name, role, contact_email, phone_display, phone_e164)
    values ('inativo-teste', false, 'Pessoa Inativa', 'Inativa', 'Cargo Teste', 'inativa@example.test', '+55 (11) 90000-0001', '+5511900000001');
  `);

  // (k) seed idempotente
  await test('(k) seed idempotente: rodar de novo não duplica nem altera', async () => {
    await asAdmin();
    await db.exec(readMigration('20261010120200_seed_sabrina.sql'));
    await db.exec(readMigration('20261010120200_seed_sabrina.sql'));
    const r = await db.query(`select count(*)::int n, max(user_id::text) u from public.executives where slug = 'sabrina-ferreira'`);
    eq(r.rows[0], { n: 1, u: A });
  });

  await test('seed: dados de Sabrina conferem com src/content/executives.ts', async () => {
    await asAdmin();
    const r = await db.query(`select slug, full_name, display_name, role, contact_email, phone_display, phone_e164,
      linkedin_url, website_url, is_default, is_active, photo_path from public.executives where slug = 'sabrina-ferreira'`);
    eq(r.rows[0], {
      slug: 'sabrina-ferreira', full_name: 'Sabrina Ferreira', display_name: 'Sabrina', role: 'Executiva de Negócios',
      contact_email: 'sabrina.ferreira@credmhs.com.br', phone_display: '+55 (21) 98896-7369', phone_e164: '+5521988967369',
      linkedin_url: 'https://www.linkedin.com/in/sabrinaferreira', website_url: 'https://www.credmhs.com.br',
      is_default: true, is_active: true, photo_path: null,
    });
  });

  // (a)
  await test('(a) usuário A lê só a própria linha', async () => {
    await asUser(A);
    const r = await db.query(`select slug from public.executives order by slug`);
    eq(r.rows.map((x) => x.slug), ['sabrina-ferreira']);
  });

  await test('(a) usuário sem perfil vinculado não lê nenhuma linha', async () => {
    await asUser('33333333-3333-4333-8333-333333333333');
    const r = await db.query(`select slug from public.executives`);
    eq(r.rows.length, 0);
  });

  // (b)
  await test('(b) A não altera a linha de B (0 linhas afetadas)', async () => {
    await asUser(A);
    const r = await db.query(`update public.executives set full_name = 'Invasor' where slug = 'bruno-teste'`);
    eq(r.affectedRows, 0);
    await asAdmin();
    const c = await db.query(`select full_name from public.executives where slug = 'bruno-teste'`);
    eq(c.rows[0].full_name, 'Bruno Teste');
  });

  // (c)
  for (const [col, val] of [
    ['slug', `'outro-slug'`],
    ['is_default', 'false'],
    ['is_active', 'false'],
    ['user_id', `'${B}'`],
    ['linkedin_url', `'https://www.linkedin.com/in/x'`],
    ['website_url', `'https://exemplo.test'`],
    ['id', 'gen_random_uuid()'],
    ['created_at', 'now()'],
  ]) {
    await test(`(c) A não altera a coluna administrada ${col} (permissão negada)`, async () => {
      await asUser(A);
      await rejects(db.query(`update public.executives set ${col} = ${val} where slug = 'sabrina-ferreira'`), /permission denied/i);
    });
  }

  await test('(c) A não insere nem apaga perfis', async () => {
    await asUser(A);
    await rejects(db.query(`insert into public.executives (slug, full_name, display_name, role, contact_email, phone_display, phone_e164)
      values ('novo', 'Novo Nome', 'Novo', 'Cargo', 'n@example.test', '+55 11 9000-0000', '+5511900000009')`), /permission denied/i);
    await rejects(db.query(`delete from public.executives where slug = 'sabrina-ferreira'`), /permission denied/i);
  });

  // (d)
  await test('(d) A altera nome, nome curto, cargo, e-mail e telefone próprios (com trim e updated_at)', async () => {
    await asAdmin();
    const before = (await db.query(`select updated_at from public.executives where slug = 'sabrina-ferreira'`)).rows[0].updated_at;
    await db.exec(`select pg_sleep(0.01)`);
    await asUser(A);
    const r = await db.query(`update public.executives set
        full_name = '  Sabrina F. Teste  ', display_name = 'Sabi', role = 'Executiva Teste',
        contact_email = 'teste@example.test', phone_display = '+55 (21) 90000-1111', phone_e164 = '+5521900001111',
        photo_width = 1098, photo_height = 1433
      where user_id = auth.uid()`);
    eq(r.affectedRows, 1);
    const row = (await db.query(`select full_name, display_name, role, contact_email, phone_e164, updated_at from public.executives`)).rows[0];
    eq(row.full_name, 'Sabrina F. Teste', 'trim aplicado');
    eq([row.display_name, row.role, row.contact_email, row.phone_e164], ['Sabi', 'Executiva Teste', 'teste@example.test', '+5521900001111']);
    assert(new Date(row.updated_at) > new Date(before), 'updated_at deveria avançar');
  });

  // (e)
  for (const [label, sql] of [
    ['telefone E.164 sem +', `phone_e164 = '5521988967369'`],
    ['telefone E.164 com letras', `phone_e164 = '+55219889ABCD'`],
    ['telefone E.164 curto', `phone_e164 = '+5521'`],
    ['telefone exibido curto', `phone_display = '123'`],
    ['e-mail sem @', `contact_email = 'sabrina.credmhs.com.br'`],
    ['e-mail com espaço', `contact_email = 'sa brina@credmhs.com.br'`],
    ['e-mail sem domínio', `contact_email = 'sabrina@credmhs'`],
    ['nome só com espaços', `full_name = '   '`],
    ['nome com 81 caracteres', `full_name = '${'x'.repeat(81)}'`],
    ['nome curto com 41 caracteres', `display_name = '${'x'.repeat(41)}'`],
    ['photo_width 0', `photo_width = 0`],
    ['photo_height 4001', `photo_height = 4001`],
    ['photo_path fora do formato', `photo_path = '${A}/foto com espaço.webp'`],
  ]) {
    await test(`(e) CHECK rejeita ${label}`, async () => {
      await asUser(A);
      await rejects(db.query(`update public.executives set ${sql} where user_id = auth.uid()`), /violates check constraint/i);
    });
  }

  await test('(e) CHECK rejeita linkedin_url sem https (administrador)', async () => {
    await asAdmin();
    await rejects(db.query(`update public.executives set linkedin_url = 'http://linkedin.com/in/x' where slug = 'bruno-teste'`), /violates check constraint/i);
  });

  await test('(e) CHECK rejeita slug fora do formato no insert (administrador)', async () => {
    await asAdmin();
    for (const bad of ['A', 'Maiuscula', 'com espaco', '-hifen', 'hifen-', 'duplo--hifen', 'x'.repeat(65)]) {
      await rejects(db.query(`insert into public.executives (slug, full_name, display_name, role, contact_email, phone_display, phone_e164)
        values ($1, 'Nome Teste', 'Nome', 'Cargo', 'n@example.test', '+55 11 9000-0000', '+5511900000009')`, [bad]),
        /violates check constraint/i, `slug "${bad}" deveria falhar`);
    }
  });

  // (f)
  await test('(f) A não define photo_path na pasta de B', async () => {
    await asUser(A);
    await rejects(db.query(`update public.executives set photo_path = '${B}/foto.webp' where user_id = auth.uid()`), /pasta do próprio usuário/i);
  });

  await test('(f) A define photo_path na própria pasta e pode limpar para null', async () => {
    await asUser(A);
    eq((await db.query(`update public.executives set photo_path = '${A}/foto-1.webp' where user_id = auth.uid()`)).affectedRows, 1);
    eq((await db.query(`select photo_path from public.executives`)).rows[0].photo_path, `${A}/foto-1.webp`);
    eq((await db.query(`update public.executives set photo_path = null where user_id = auth.uid()`)).affectedRows, 1);
  });

  await test('(f) administrador (postgres e service_role) define qualquer photo_path válido', async () => {
    await asAdmin();
    eq((await db.query(`update public.executives set photo_path = '${B}/admin.jpg' where slug = 'bruno-teste'`)).affectedRows, 1);
    await asService();
    eq((await db.query(`update public.executives set photo_path = '${A}/svc.jpg' where slug = 'bruno-teste'`)).affectedRows, 1);
    await asAdmin();
    await db.exec(`update public.executives set photo_path = null where slug = 'bruno-teste'`);
  });

  // (g)
  await test('(g) anon não lê a tabela', async () => {
    await asAnon();
    await rejects(db.query(`select * from public.executives`), /permission denied/i);
  });

  await test('(g) anon não altera a tabela', async () => {
    await asAnon();
    await rejects(db.query(`update public.executives set full_name = 'x' where true`), /permission denied/i);
  });

  // (h)
  const publicCols = ['slug', 'available', 'full_name', 'display_name', 'role', 'contact_email', 'phone_display',
    'phone_e164', 'photo_path', 'photo_width', 'photo_height', 'linkedin_url', 'website_url', 'updated_at'];

  await test('(h) RPC: colunas exatamente iguais a PublicExecutiveRow, na mesma ordem, sem id/user_id/created_at', async () => {
    await asAnon();
    const r = await db.query(`select * from public.get_public_executive('bruno-teste')`);
    eq(r.fields.map((f) => f.name), publicCols);
    for (const forbidden of ['id', 'user_id', 'created_at', 'email']) {
      assert(!r.fields.some((f) => f.name === forbidden), `coluna proibida ${forbidden}`);
    }
  });

  await test('(h) RPC anon com slug válido devolve perfil completo', async () => {
    await asAnon();
    const r = await db.query(`select * from public.get_public_executive('bruno-teste')`);
    eq(r.rows.length, 1);
    const row = r.rows[0];
    eq([row.slug, row.available, row.full_name, row.contact_email, row.phone_e164],
      ['bruno-teste', true, 'Bruno Teste', 'bruno@example.test', '+5511900000000']);
    assert(row.updated_at !== null, 'updated_at presente');
  });

  await test('(h) RPC normaliza o slug (maiúsculas e espaços)', async () => {
    await asAnon();
    const r = await db.query(`select slug from public.get_public_executive('  Bruno-TESTE ')`);
    eq(r.rows.map((x) => x.slug), ['bruno-teste']);
  });

  await test('(h) RPC com slug inexistente devolve 0 linhas', async () => {
    await asAnon();
    eq((await db.query(`select * from public.get_public_executive('nao-existe')`)).rows.length, 0);
    eq((await db.query(`select * from public.get_public_executive('x'' or ''1''=''1')`)).rows.length, 0);
  });

  await test('(h) RPC com perfil inativo devolve available=false sem dados', async () => {
    await asAnon();
    const r = await db.query(`select * from public.get_public_executive('inativo-teste')`);
    eq(r.rows.length, 1);
    const row = r.rows[0];
    eq(row.slug, 'inativo-teste');
    eq(row.available, false);
    for (const c of publicCols.filter((c) => c !== 'slug' && c !== 'available')) {
      eq(row[c], null, `coluna ${c} deveria ser null`);
    }
  });

  await test('(h) RPC sem slug (null/omitido/vazio) devolve o perfil padrão (Sabrina)', async () => {
    await asAnon();
    eq((await db.query(`select slug from public.get_public_executive()`)).rows.map((x) => x.slug), ['sabrina-ferreira']);
    eq((await db.query(`select slug from public.get_public_executive(null)`)).rows.map((x) => x.slug), ['sabrina-ferreira']);
    eq((await db.query(`select slug from public.get_public_executive('  ')`)).rows.map((x) => x.slug), ['sabrina-ferreira']);
  });

  await test('(h) RPC também executável por authenticated', async () => {
    await asUser(B);
    eq((await db.query(`select slug from public.get_public_executive('sabrina-ferreira')`)).rows.length, 1);
  });

  await test('(h) funções de trigger não são executáveis por anon/authenticated', async () => {
    await asAdmin();
    const r = await db.query(`select p.proname,
        has_function_privilege('anon', p.oid, 'execute') anon,
        has_function_privilege('authenticated', p.oid, 'execute') auth
      from pg_proc p join pg_namespace n on n.oid = p.pronamespace
      where n.nspname = 'public' and p.proname like 'executives_%' order by 1`);
    eq(r.rows.length, 3);
    for (const row of r.rows) assert(!row.anon && !row.auth, `${row.proname} executável`);
  });

  // (i) storage
  await test('(i) bucket executive-photos criado: público, 2 MB, webp/jpeg', async () => {
    await asAdmin();
    const r = await db.query(`select id, name, public, file_size_limit::int lim, allowed_mime_types from storage.buckets`);
    eq(r.rows, [{ id: 'executive-photos', name: 'executive-photos', public: true, lim: 2097152, allowed_mime_types: ['image/webp', 'image/jpeg'] }]);
  });

  await test('(i) migration de storage reaplicada só no bucket (on conflict do update)', async () => {
    await asAdmin();
    await db.exec(`update storage.buckets set public = false, file_size_limit = 1 where id = 'executive-photos'`);
    const sql = readMigration('20261010120100_executive_photos_storage.sql');
    const insertOnly = sql.slice(sql.indexOf('insert into storage.buckets'), sql.indexOf('allowed_mime_types = excluded.allowed_mime_types;') + 'allowed_mime_types = excluded.allowed_mime_types;'.length);
    await db.exec(insertOnly);
    const r = await db.query(`select public, file_size_limit::int lim from storage.buckets where id = 'executive-photos'`);
    eq(r.rows[0], { public: true, lim: 2097152 });
  });

  await test('(i) A envia objeto para a própria pasta', async () => {
    await asUser(A);
    eq((await db.query(`insert into storage.objects (bucket_id, name, owner) values ('executive-photos', '${A}/foto.webp', '${A}')`)).affectedRows, 1);
  });

  await test('(i) A não envia objeto para a pasta de B', async () => {
    await asUser(A);
    await rejects(db.query(`insert into storage.objects (bucket_id, name, owner) values ('executive-photos', '${B}/foto.webp', '${A}')`), /row-level security/i);
  });

  await test('(i) A não envia para a raiz, subpasta ou nome fora do formato, nem para outro bucket', async () => {
    await asUser(A);
    await asAdmin();
    await db.exec(`insert into storage.buckets (id, name, public) values ('outro', 'outro', false) on conflict do nothing`);
    await asUser(A);
    for (const [bucket, name] of [
      ['executive-photos', 'foto.webp'],
      ['executive-photos', `${A}/sub/foto.webp`],
      ['executive-photos', `${A}/foto com espaço.webp`],
      ['outro', `${A}/foto.webp`],
    ]) {
      await rejects(db.query(`insert into storage.objects (bucket_id, name, owner) values ($1, $2, '${A}')`, [bucket, name]), /row-level security/i, `${bucket}/${name}`);
    }
  });

  await test('(i) A não lê, atualiza nem apaga objeto de B', async () => {
    await asUser(B);
    eq((await db.query(`insert into storage.objects (bucket_id, name, owner) values ('executive-photos', '${B}/foto.webp', '${B}')`)).affectedRows, 1);
    await asUser(A);
    eq((await db.query(`select name from storage.objects order by name`)).rows.map((r) => r.name), [`${A}/foto.webp`], 'A só lista os próprios');
    eq((await db.query(`update storage.objects set owner = '${A}' where name = '${B}/foto.webp'`)).affectedRows, 0);
    eq((await db.query(`delete from storage.objects where name = '${B}/foto.webp'`)).affectedRows, 0);
    await asAdmin();
    eq((await db.query(`select count(*)::int n from storage.objects where name = '${B}/foto.webp'`)).rows[0].n, 1);
  });

  await test('(i) A não move o próprio objeto para a pasta de B', async () => {
    await asUser(A);
    await rejects(db.query(`update storage.objects set name = '${B}/movida.webp' where name = '${A}/foto.webp'`), /row-level security/i);
  });

  await test('(i) A atualiza (upsert) e apaga o próprio objeto', async () => {
    await asUser(A);
    eq((await db.query(`update storage.objects set owner = '${A}' where name = '${A}/foto.webp'`)).affectedRows, 1);
    eq((await db.query(`delete from storage.objects where name = '${A}/foto.webp'`)).affectedRows, 1);
  });

  await test('(i) anon não insere nem lista objetos', async () => {
    await asAnon();
    await rejects(db.query(`insert into storage.objects (bucket_id, name) values ('executive-photos', '${A}/anon.webp')`), /row-level security/i);
    eq((await db.query(`select * from storage.objects`)).rows.length, 0, 'anon não lista');
  });

  // (j)
  await test('(j) slug imutável para authenticated (sem permissão de coluna)', async () => {
    await asUser(A);
    await rejects(db.query(`update public.executives set slug = 'novo-slug' where user_id = auth.uid()`), /permission denied/i);
  });

  await test('(j) slug imutável mesmo para postgres e service_role (trigger)', async () => {
    await asAdmin();
    await rejects(db.query(`update public.executives set slug = 'novo-slug' where slug = 'bruno-teste'`), /imutável/i);
    await asService();
    await rejects(db.query(`update public.executives set slug = 'novo-slug' where slug = 'bruno-teste'`), /imutável/i);
  });

  await test('(j) mesmo slug com espaços não conta como troca; administrador renomeia desabilitando o trigger', async () => {
    await asAdmin();
    eq((await db.query(`update public.executives set slug = ' bruno-teste ' where slug = 'bruno-teste'`)).affectedRows, 1);
    await db.exec(`
      begin;
      alter table public.executives disable trigger executives_slug_immutable;
      update public.executives set slug = 'bruno-renomeado' where slug = 'bruno-teste';
      alter table public.executives enable trigger executives_slug_immutable;
      commit;
    `);
    eq((await db.query(`select count(*)::int n from public.executives where slug = 'bruno-renomeado'`)).rows[0].n, 1);
    await rejects(db.query(`update public.executives set slug = 'bruno-teste' where slug = 'bruno-renomeado'`), /imutável/i, 'trigger reabilitado');
  });

  // (l)
  await test('(l) só um is_default = true', async () => {
    await asAdmin();
    await rejects(db.query(`update public.executives set is_default = true where slug = 'bruno-renomeado'`), /duplicate key|unique/i);
    eq((await db.query(`select count(*)::int n from public.executives where is_default`)).rows[0].n, 1);
  });

  await test('(l) snippet trocar-perfil-padrao.sql troca o padrão atomicamente', async () => {
    await asAdmin();
    const snippet = readFileSync(join(here, '..', 'snippets', 'trocar-perfil-padrao.sql'), 'utf8');
    await db.exec(snippet.replaceAll('<SLUG>', 'bruno-renomeado'));
    eq((await db.query(`select slug from public.executives where is_default`)).rows.map((r) => r.slug), ['bruno-renomeado']);
    await rejects(db.exec(snippet.replaceAll('<SLUG>', 'inativo-teste')), /inativo/i);
    eq((await db.query(`select slug from public.executives where is_default`)).rows.map((r) => r.slug), ['bruno-renomeado'], 'nada mudou');
    await db.exec(snippet.replaceAll('<SLUG>', 'sabrina-ferreira'));
    eq((await db.query(`select slug from public.executives where is_default`)).rows.map((r) => r.slug), ['sabrina-ferreira']);
  });

  await test('snippet vincular-executivo.sql vincula por e-mail de login', async () => {
    await asAdmin();
    await db.exec(`update public.executives set user_id = null where slug = 'sabrina-ferreira'`);
    const snippet = readFileSync(join(here, '..', 'snippets', 'vincular-executivo.sql'), 'utf8');
    await db.exec(snippet.replaceAll('<EMAIL_DE_LOGIN>', 'A@Example.test').replaceAll('<SLUG>', 'sabrina-ferreira'));
    eq((await db.query(`select user_id from public.executives where slug = 'sabrina-ferreira'`)).rows[0].user_id, A);
  });

  await test('excluir o usuário em auth.users zera user_id (on delete set null)', async () => {
    await asAdmin();
    await db.exec(`insert into auth.users (id, email) values ('44444444-4444-4444-8444-444444444444', 'c@example.test');
      update public.executives set user_id = '44444444-4444-4444-8444-444444444444' where slug = 'inativo-teste';
      delete from auth.users where id = '44444444-4444-4444-8444-444444444444';`);
    eq((await db.query(`select user_id from public.executives where slug = 'inativo-teste'`)).rows[0].user_id, null);
  });

  await test('user_id é único (uma conta, um perfil)', async () => {
    await asAdmin();
    await rejects(db.query(`update public.executives set user_id = '${A}' where slug = 'bruno-renomeado'`), /duplicate key|unique/i);
  });

  await test('RLS ligada em public.executives e storage.objects', async () => {
    await asAdmin();
    const r = await db.query(`select relname, relrowsecurity from pg_class where oid in ('public.executives'::regclass, 'storage.objects'::regclass) order by 1`);
    eq(r.rows, [{ relname: 'executives', relrowsecurity: true }, { relname: 'objects', relrowsecurity: true }]);
  });
}

try {
  await main();
} catch (err) {
  fail('execução', err?.stack ?? err);
}
await db.close().catch(() => {});
console.log(`\n# ${passed} ok, ${failures} falha(s)`);
process.exit(failures ? 1 : 0);
