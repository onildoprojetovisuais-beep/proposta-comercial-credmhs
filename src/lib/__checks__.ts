/**
 * Asserções executáveis da apresentação V2 (docs/REVISAO-CRED-MHS-V2.md; docs/03-personalizacao.md).
 * Sem framework de teste. Não importa React nem acessa rede: a RPC do Supabase é simulada com
 * `fetch` injetado e a configuração é passada explicitamente (`import.meta.env` não existe no Node).
 *
 * Execução (Node >= 23, type stripping nativo + hook de resolução sem extensão):
 *   node --import ./src/lib/checks-resolve.mjs src/lib/__checks__.ts
 */
import { readExecutiveRequest, resolveExecutive, resolveLocalExecutive } from './executive';
import { fetchPublicExecutive, parsePublicExecutiveRow, parsePublicProfileResponse } from './supabase/publicProfile';
import { mapPublicExecutiveRow, photoAltFor } from './supabase/mapping';
import { buildPresentationLink } from './supabase/slug';
import type { PublicExecutiveRow } from './supabase/types';
import type { SupabasePublicConfig } from './supabase/config';
import { contactLinks } from './personalization';
import { chapterFromHash, chapters, copy, fronts } from '../content/chapters';
import { CHAPTER_ORDER } from '../types/presentation';
import { isChapterVisible } from './reviewMode';
import { typeset } from './typeset';
import { clearLegacySession, LEGACY_V1_STORAGE_KEY } from '../state/legacySession';
import { sabrinaFerreira } from '../content/executives';
import type { Executive } from '../types';

/** Asserções mínimas (sem node:assert, para tipar só com o lib DOM do projeto). */
const assert = {
  ok(value: unknown, message?: string): void {
    if (!value) throw new Error(message ?? 'assert.ok falhou');
  },
  equal(actual: unknown, expected: unknown, message?: string): void {
    if (!Object.is(actual, expected)) throw new Error(message ?? `esperado ${String(expected)}, recebido ${String(actual)}`);
  },
  notEqual(actual: unknown, expected: unknown, message?: string): void {
    if (Object.is(actual, expected)) throw new Error(message ?? `não deveria ser ${String(expected)}`);
  },
  deepEqual(actual: unknown, expected: unknown, message?: string): void {
    const a = JSON.stringify(actual);
    const b = JSON.stringify(expected);
    if (a !== b) throw new Error(message ?? `esperado ${b}, recebido ${a}`);
  },
};

let passed = 0;
const queue: { name: string; fn: () => void | Promise<void> }[] = [];
/** Registra uma verificação (síncrona ou assíncrona); todas rodam em ordem no fim do arquivo. */
function check(name: string, fn: () => void | Promise<void>): void {
  queue.push({ name, fn });
}

const SAB = 'sabrina-ferreira';

// --- Executivo (sem Supabase: perfis locais) -------------------------------
check('perfil padrão e query de Sabrina resolvem o mesmo contato', () => {
  const a = resolveLocalExecutive('');
  const b = resolveLocalExecutive('?executivo=sabrina-ferreira');
  assert.ok(a.status === 'ready' && b.status === 'ready');
  if (a.status !== 'ready' || b.status !== 'ready') return;
  assert.equal(a.reason, 'default');
  assert.equal(b.reason, 'matched');
  assert.equal(a.executive.email, b.executive.email);
  assert.equal(resolveLocalExecutive('?executivo=').status, 'ready', 'parâmetro vazio = sem identificador');
  assert.equal(resolveLocalExecutive('?executivo=%20Sabrina-Ferreira%20').status, 'ready', 'trim + minúsculas');
});

// Regra atual de Nil (prevalece sobre docs/03): identificador desconhecido NÃO cai em Sabrina.
check('ID de executivo desconhecido mostra "não encontrada" (sem fallback silencioso)', () => {
  for (const q of ['?executivo=joao', '?executivo=<script>', '?executivo=%E0%A4%A', '?executivo=a', '?executivo=catarina']) {
    const r = resolveLocalExecutive(q);
    assert.equal(r.status, 'not-found', q);
    assert.ok(!('executive' in r), 'nenhum perfil é entregue');
  }
  assert.equal(readExecutiveRequest('?executivo=Ana--Paula').kind, 'invalid');
});

check('query não injeta telefone/e-mail', () => {
  const r = resolveLocalExecutive('?executivo=sabrina-ferreira&email=x@y.com&telefone=1');
  assert.ok(r.status === 'ready');
  if (r.status !== 'ready') return;
  assert.equal(r.executive.email, 'sabrina.ferreira@credmhs.com.br');
  assert.equal(r.executive.phoneE164, '+5521988967369');
});


// --- Contatos (sem mensagem, sem seleções) -------------------------------------
check('contatos: mailto sem corpo, tel E.164, WhatsApp oculto sem confirmação, booking null', () => {
  const l = contactLinks(sabrinaFerreira);
  assert.equal(l.email?.href, `mailto:sabrina.ferreira@credmhs.com.br?subject=${encodeURIComponent(copy.contato.emailSubject)}`);
  assert.ok(!l.email!.href.includes('body='), 'sem corpo pré-preenchido');
  assert.equal(l.phone?.href, 'tel:+5521988967369');
  assert.equal(l.whatsApp, null, 'WhatsApp não confirmado (P13)');
  assert.equal(l.booking, null, 'sem URL real de agendamento');
  assert.equal(l.website?.label, 'www.credmhs.com.br');
  // WhatsApp só com flag + número válido, sem texto.
  const wa: Executive = { ...sabrinaFerreira, whatsAppEnabled: true, whatsAppNumber: '5521988967369' };
  assert.equal(contactLinks(wa).whatsApp?.href, 'https://wa.me/5521988967369');
  assert.equal(contactLinks({ ...wa, whatsAppNumber: '123' }).whatsApp, null);
  assert.equal(contactLinks({ ...sabrinaFerreira, whatsAppNumber: '5521988967369' }).whatsApp, null, 'número sem confirmação não liga o canal');
  // Perfil sem canais: tudo null.
  const none = contactLinks({ ...sabrinaFerreira, email: null, phoneE164: null, phoneDisplay: null, linkedInUrl: null, websiteUrl: null });
  assert.deepEqual([none.email, none.phone, none.linkedIn, none.website, none.whatsApp, none.booking], [null, null, null, null, null, null]);
});

// --- Conteúdo V3 (PPT da Sabrina, 11 slides) -------------------------------------
check('seções: ordem dos 11 slides, hash direto e hashes antigos', () => {
  assert.deepEqual(chapters.map((c) => c.id), [...CHAPTER_ORDER]);
  assert.deepEqual(chapters.map((c) => c.slide), [1, 2, 3, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
  for (const id of CHAPTER_ORDER) assert.equal(chapterFromHash(`#${id}`)?.id, id);
  assert.equal(chapterFromHash('#FRENTES')?.id, 'frentes');
  for (const [h, id] of [['#m01', 'abertura'], ['#institucional', 'quem-somos'], ['#trilha', 'frentes'], ['#solucoes', 'frentes'], ['#m10', 'contato']] as const) assert.equal(chapterFromHash(h)?.id, id, h);
  assert.equal(chapterFromHash('#%E0%A4%A'), null);
  assert.equal(chapterFromHash('#nao-existe'), null);
});

check('pendências ocultas ao cliente e visíveis na revisão', () => {
  // Depoimentos reais recebidos em 20/10/2026 (Radix, uso autorizado): todo item tem autoria completa.
  for (const t of copy.depoimentos.items) assert.ok(t.quote.trim() && t.name.trim() && t.role.trim() && t.company?.trim(), t.id);
  assert.equal(isChapterVisible('depoimentos', false), copy.depoimentos.items.some((t) => t.approved));
  assert.equal(isChapterVisible('satisfacao', false), copy.satisfacao.status === 'validado' || copy.satisfacao.showToClient);
  assert.equal(copy.satisfacao.value, '99,4%', 'CSAT do PPT');
  for (const id of CHAPTER_ORDER) assert.equal(isChapterVisible(id, true), true, id);
});

check('oito frentes e ajustes autorizados do slide 9', () => {
  assert.equal(fronts.length, 8);
  assert.deepEqual(fronts.map((f) => f.number), ['01', '02', '03', '04', '05', '06', '07', '08']);
  assert.deepEqual(fronts.map((f) => f.id).slice(3, 7), ['tecnologia', 'cultura-dados', 'privacidade', 'inteligencia']);
  assert.equal(fronts[3].title, 'Convergência Digital');
  assert.equal(fronts[0].title, 'Conformidade Legal e Jurídica');
  const inteligencia = fronts.find((f) => f.id === 'inteligencia')!;
  assert.ok(inteligencia.text.includes('Uma metodologia que constrói conhecimento de forma colaborativa.'));
  assert.ok(!JSON.stringify({ copy, f: fronts.map((f) => [f.title, f.text]) }).includes('Ninguém faz nada sozinho'));
});

check('contato: etapas do slide 11 ajustadas', () => {
  assert.deepEqual([...copy.contato.steps], ['Aprofundar na sua demanda', 'Detalhar o escopo']);
  assert.ok(!JSON.stringify(copy).includes('Dar o primeiro passo'));
});

check('typeset: só troca espaços, nunca palavras', () => {
  const all = [...Object.values(copy).flatMap((v) => JSON.stringify(v).match(/"[^"]{12,}"/g) ?? []), ...fronts.map((f) => f.text)];
  for (const raw of all) {
    const t = raw.replace(/^"|"$/g, '');
    assert.equal(typeset(t).replace(/ /g, ' '), t);
  }
  const conversa = typeset('É aí que começa a nossa conversa.');
  assert.ok(conversa.includes('a nossa conversa.'), 'artigo e última palavra presos');
  assert.ok(typeset('Estamos no Rio de Janeiro desde 2008').includes('Rio de Janeiro'));
  assert.ok(!/ (a|de|do|e|o|em|com) /i.test(typeset('para a sua empresa e o setor de saúde com uma equipe')));
});

check('estruturas retiradas não voltam à copy pública', () => {
  const pub = JSON.stringify({ copy, f: fronts.map((f) => [f.title, f.text]) });
  for (const bad of [/3C|3I/, /Normativo/, /Reputacional/, /trilha de valor/i, /quatro eixos/i, /NPS/, /sede/i]) assert.ok(!bad.test(pub), `encontrado ${bad}`);
});


// --- Supabase: linha pública → perfil ------------------------------------------
const CONFIG: SupabasePublicConfig = { url: 'https://mock-projeto.supabase.co', anonKey: 'anon-falsa' };
const UID = '0b9c2f9e-1d2a-4c3b-9a8f-7e6d5c4b3a21';
const photoUrlFor = (path: string) => `${CONFIG.url}/storage/v1/object/public/executive-photos/${path}`;

function row(patch: Partial<PublicExecutiveRow> & Record<string, unknown> = {}): PublicExecutiveRow & Record<string, unknown> {
  return {
    slug: 'catarina',
    available: true,
    full_name: 'Catarina Souza',
    display_name: 'Catarina',
    role: 'Executiva de Negócios',
    contact_email: 'catarina.souza@credmhs.com.br',
    phone_display: '+55 (21) 99999-0000',
    phone_e164: '+5521999990000',
    photo_path: `${UID}/retrato.webp`,
    photo_width: 900,
    photo_height: 1200,
    linkedin_url: 'https://www.linkedin.com/in/catarina',
    website_url: 'https://www.credmhs.com.br',
    updated_at: '2026-10-10T12:00:00+00:00',
    ...patch,
  };
}

check('mapeamento da linha pública (campos extras ignorados, foto remota, alt gerado)', () => {
  const parsed = parsePublicExecutiveRow(row({ id: 'uuid-interno', user_id: UID, is_default: true, email_login: 'x@y.z' }));
  assert.ok(parsed);
  assert.ok(!('user_id' in parsed!) && !('id' in parsed!), 'campos extras não são copiados');
  const e = mapPublicExecutiveRow(parsed!, { photoUrlFor })!;
  assert.equal(e.id, 'catarina');
  assert.equal(e.firstName, 'Catarina');
  assert.equal(e.fullName, 'Catarina Souza');
  assert.equal(e.email, 'catarina.souza@credmhs.com.br');
  assert.equal(e.phoneE164, '+5521999990000');
  assert.equal(e.photoSource, 'remote');
  assert.ok(e.photo!.startsWith(`${CONFIG.url}/storage/v1/object/public/executive-photos/${UID}/retrato.webp?v=`));
  assert.deepEqual([e.photoWidth, e.photoHeight], [900, 1200]);
  assert.equal(e.photoAlt, photoAltFor('Catarina Souza', 'Executiva de Negócios'));
  assert.equal(e.photoAlt, 'Retrato de Catarina Souza, Executiva de Negócios da CRED MHS');
  assert.equal(e.whatsAppEnabled, false);
  assert.equal(e.whatsAppNumber, null);
  // Sem dimensões → 1098×1433.
  const noDims = mapPublicExecutiveRow(row({ photo_width: null, photo_height: 99999 }), { photoUrlFor })!;
  assert.deepEqual([noDims.photoWidth, noDims.photoHeight], [1098, 1433]);
});

check('mapeamento: e-mail/telefone/links inválidos ocultam o canal; foto ausente', () => {
  const bad = mapPublicExecutiveRow(
    row({
      contact_email: 'ana@x.com?bcc=outro@y.com',
      phone_e164: '21 9999',
      linkedin_url: 'javascript:alert(1)',
      website_url: 'https://user:senha@site.com',
      photo_path: '../../etc/passwd',
    }),
    { photoUrlFor },
  )!;
  assert.equal(bad.email, null);
  assert.equal(bad.phoneE164, null);
  assert.equal(bad.phoneDisplay, null);
  assert.equal(bad.linkedInUrl, null);
  assert.equal(bad.websiteUrl, null);
  assert.equal(bad.photo, null, 'caminho fora do padrão não vira URL');
  const links = contactLinks(bad);
  assert.equal(links.email, null);
  assert.equal(links.phone, null);
  assert.equal(links.linkedIn, null);
  assert.equal(links.website, null);
  // Telefone exibido malformado, E.164 válido → exibe o E.164.
  const p = mapPublicExecutiveRow(row({ phone_display: '<b>21</b>' }), { photoUrlFor })!;
  assert.equal(p.phoneDisplay, '+5521999990000');
  // Sem foto: outro executivo → layout tipográfico; Sabrina → retrato do projeto.
  assert.equal(mapPublicExecutiveRow(row({ photo_path: null }), { photoUrlFor })!.photo, null);
  const sab = mapPublicExecutiveRow(row({ slug: SAB, photo_path: null }), { photoUrlFor })!;
  assert.equal(sab.photoSource, 'bundled');
  assert.equal(sab.photo, sabrinaFerreira.photo);
  // Texto com controles é limpo; nome de apresentação ausente → linha inválida.
  assert.equal(mapPublicExecutiveRow(row({ full_name: 'Catarina‮ Souza\n' }), { photoUrlFor })!.fullName, 'Catarina Souza');
  assert.equal(mapPublicExecutiveRow(row({ display_name: '   ' }), { photoUrlFor }), null);
  assert.equal(mapPublicExecutiveRow(row({ available: false }), { photoUrlFor }), null);
});

check('validação da resposta da RPC (vazia, inativa, malformada, outro slug)', () => {
  assert.equal(parsePublicProfileResponse([], 'catarina').kind, 'not-found');
  const inactive = parsePublicProfileResponse([{ slug: 'catarina', available: false }], 'catarina');
  assert.equal(inactive.kind, 'unavailable');
  assert.equal(parsePublicProfileResponse([row()], 'catarina').kind, 'found');
  assert.equal(parsePublicProfileResponse(row(), 'catarina').kind, 'found', 'objeto único também é aceito');
  for (const bad of ['texto', 42, null, [1], [row(), row()], [row({ available: 'sim' as never })], [row({ full_name: 5 as never })], [row({ photo_width: '9' as never })], [{ available: true }]]) {
    const r = parsePublicProfileResponse(bad, 'catarina');
    assert.equal(r.kind, 'error', JSON.stringify(bad).slice(0, 60));
  }
  assert.equal(parsePublicProfileResponse([row({ slug: 'outra-pessoa' })], 'catarina').kind, 'error', 'nunca outro perfil');
  assert.equal(parsePublicProfileResponse([row({ slug: SAB })], null).kind, 'found', 'padrão aceita o slug devolvido');
});

// --- Supabase: resolução com fetch simulado ---------------------------------------
type Call = { url: string; init: RequestInit };
function mockFetch(handler: (body: { p_slug: string | null }) => Response | Promise<Response> | 'network' | 'hang'): {
  fetchImpl: typeof fetch;
  calls: Call[];
} {
  const calls: Call[] = [];
  const fetchImpl = ((url: string, init: RequestInit) => {
    calls.push({ url, init });
    const out = handler(JSON.parse(String(init.body)));
    if (out === 'network') return Promise.reject(new TypeError('Failed to fetch'));
    if (out === 'hang') {
      return new Promise<Response>((_, reject) => {
        init.signal?.addEventListener('abort', () => reject(new DOMException('aborted', 'AbortError')));
      });
    }
    return Promise.resolve(out);
  }) as unknown as typeof fetch;
  return { fetchImpl, calls };
}
const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } });

check('resolução sem Supabase configurado = perfis locais', async () => {
  const a = await resolveExecutive('', { config: null });
  assert.ok(a.status === 'ready' && a.origin === 'local' && a.executive.id === SAB);
  assert.equal((await resolveExecutive('?executivo=catarina', { config: null })).status, 'not-found');
});

check('resolução com Supabase: requisição, sucesso, inexistente, inativo, formato inválido', async () => {
  const m = mockFetch(({ p_slug }) => (p_slug === 'catarina' ? json([row()]) : p_slug === 'inativo' ? json([{ slug: 'inativo', available: false }]) : json([])));
  const opts = { config: CONFIG, fetchImpl: m.fetchImpl, photoUrlFor, warn: () => undefined };
  const ok = await resolveExecutive('?executivo=Catarina', opts);
  assert.ok(ok.status === 'ready' && ok.origin === 'remote' && ok.executive.firstName === 'Catarina');
  const call = m.calls[0];
  assert.equal(call.url, `${CONFIG.url}/rest/v1/rpc/get_public_executive`);
  assert.equal(call.init.method, 'POST');
  assert.equal(call.init.cache, 'no-store');
  const headers = call.init.headers as Record<string, string>;
  assert.equal(headers.apikey, 'anon-falsa');
  assert.equal(headers.Authorization, 'Bearer anon-falsa');
  assert.equal(call.init.body, '{"p_slug":"catarina"}', 'só o identificador sai do navegador');
  assert.equal((await resolveExecutive('?executivo=nao-existe', opts)).status, 'not-found');
  assert.equal((await resolveExecutive('?executivo=inativo', opts)).status, 'unavailable');
  const before = m.calls.length;
  assert.equal((await resolveExecutive('?executivo=<script>', opts)).status, 'not-found');
  assert.equal((await resolveExecutive('?executivo=a', opts)).status, 'not-found');
  assert.equal(m.calls.length, before, 'formato inválido não chama a rede');
  // Sem identificador: p_slug null.
  const d = mockFetch(() => json([row({ slug: SAB, photo_path: null })]));
  const def = await resolveExecutive('', { ...opts, fetchImpl: d.fetchImpl });
  assert.equal(d.calls[0].init.body, '{"p_slug":null}');
  assert.ok(def.status === 'ready' && def.reason === 'default' && def.executive.photoSource === 'bundled');
});

check('falha de rede: padrão → perfil local (com aviso); com identificador → erro, sem fallback', async () => {
  const warnings: string[] = [];
  const warn = (msg: string) => void warnings.push(msg);
  for (const failure of ['network', 'hang', 'http500', 'invalid', 'empty'] as const) {
    const m = mockFetch(() =>
      failure === 'network' ? 'network' : failure === 'hang' ? 'hang' : failure === 'http500' ? json({ message: 'x' }, 500) : failure === 'invalid' ? new Response('<html>', { status: 200 }) : json([]),
    );
    const opts = { config: CONFIG, fetchImpl: m.fetchImpl, photoUrlFor, warn, timeoutMs: 30 };
    const def = await resolveExecutive('', opts);
    assert.ok(def.status === 'ready' && def.origin === 'local' && def.reason === 'default-fallback' && def.executive.id === SAB, failure);
    if (failure === 'empty') continue; // 0 linhas com identificador = not-found (coberto acima)
    const withSlug = await resolveExecutive('?executivo=catarina', opts);
    assert.equal(withSlug.status, 'error', `com identificador (${failure})`);
    assert.ok(!('executive' in withSlug));
  }
  assert.equal(warnings.length, 5);
  // Tempo-limite devolve 'timeout'.
  const hang = mockFetch(() => 'hang');
  const r = await fetchPublicExecutive('catarina', { config: CONFIG, fetchImpl: hang.fetchImpl, timeoutMs: 20 });
  assert.ok(r.kind === 'error' && r.cause === 'timeout');
  // "Tentar novamente": a nova chamada resolve normalmente.
  let fail = true;
  const retry = mockFetch(() => (fail ? 'network' : json([row()])));
  const o = { config: CONFIG, fetchImpl: retry.fetchImpl, photoUrlFor, warn };
  assert.equal((await resolveExecutive('?executivo=catarina', o)).status, 'error');
  fail = false;
  assert.equal((await resolveExecutive('?executivo=catarina', o)).status, 'ready');
});


// --- Sem sessão do visitante ---------------------------------------------------------
check('sessão da V1 é removida; storage bloqueado não quebra', () => {
  const data = new Map<string, string>([[LEGACY_V1_STORAGE_KEY, '{"companyName":"Empresa A"}'], ['outra', 'x']]);
  clearLegacySession({ removeItem: (k: string) => void data.delete(k) });
  assert.equal(data.has(LEGACY_V1_STORAGE_KEY), false);
  assert.equal(data.get('outra'), 'x', 'não mexe em outras chaves');
  clearLegacySession({ removeItem() { throw new Error('SecurityError'); } });
  clearLegacySession(null);
  clearLegacySession(); // Node: sem window → engolido
});

check('link compartilhável só identifica o executivo', () => {
  assert.equal(buildPresentationLink('catarina', 'https://apresentacao.credmhs.com.br'), 'https://apresentacao.credmhs.com.br/?executivo=catarina');
  assert.equal(buildPresentationLink(SAB, 'https://x.test'), 'https://x.test/?executivo=sabrina-ferreira');
});

for (const { name, fn } of queue) {
  try {
    await fn();
    passed += 1;
    console.log(`ok  - ${name}`);
  } catch (err) {
    console.error(`FAIL - ${name}`);
    throw err;
  }
}

console.log(`\n${passed} verificações passaram.`);
