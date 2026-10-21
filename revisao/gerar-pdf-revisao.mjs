// Gera o PDF de revisão da apresentação CRED MHS para a Sabrina.
// Uso: node pdf-revisao.mjs <saida.pdf>   (dev server em http://localhost:5173)
import { chromium } from 'playwright';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { writeFileSync } from 'node:fs';

const OUT = process.argv[2];
const BASE = 'http://localhost:5173/';
const W = 1280;
const PX_TO_PT = 0.75;

const SECTIONS = [
  { id: 'abertura', name: '01 · Abertura' },
  { id: 'institucional', name: '02 · CRED MHS (empresa, números e clientes)' },
  { id: 'relacionamento', name: '03 · Relacionamento' },
  { id: 'dados', name: '04 · Dados', motion: 'Na página, o desenho da direita se organiza ao aparecer: a seta se desenha e cada palavra espalhada “passa” para a sua linha, uma por vez. Não há números nem telas de sistema.' },
  { id: 'gestao-integrada', name: '05 · Gestão integrada' },
  { id: 'trilha', name: '06 · Trilha de valor', motion: 'Na página, ao aparecer, uma linha percorre as cinco etapas uma vez, destacando cada etapa e sua explicação. No fim fica como nesta imagem. Há botões discretos para pausar e repetir.' },
  { id: 'solucoes', name: '07 · Soluções', motion: 'Na página, os quatro eixos entram juntos, como uma atuação só. “Outros exemplos do eixo” fica fechado e abre com um clique; aqui está aberto para você revisar todo o texto.' },
  { id: 'contato', name: '08 · Contato' },
];

const QUESTIONS = [
  ['3C/3I em cada seção', 'Cada parte mostra um selo do posicionamento (ex.: “3C Credibilidade”). O eixo escolhido para cada seção faz sentido? CRED MHS = Credibilidade · Relacionamento = Compromisso · Dados = Inovação · Gestão integrada = Inteligência · Trilha = Investimento · Soluções = Conhecimento.'],
  ['“Investimento” duas vezes', 'Na trilha aparecem o selo “3I Investimento” e a etapa 5 “Investimento”. Isso confunde? Se sim, qual eixo prefere para essa seção?'],
  ['Itens fora do framework', 'Riscos Psicossociais ficou no eixo Normativo e Gestão de Absenteísmo no eixo Inovação. Está certo?'],
  ['Frameworks originais', 'Pode reenviar os dois JPEGs (“Soluções que nos levam além” e “Trilha de valor na gestão de SSO”)? Queremos conferir nomes e ordem com a imagem.'],
  ['Tempo de experiência', 'O material antigo traz 30, 34 e 35 anos. Qual é o número correto? Hoje a página não mostra nenhum.'],
  ['Números', '16 unidades, +700 clínicas credenciadas, +550 mil vidas gerenciadas, +5 mil clientes atendidos: estão atualizados? “Clientes atendidos” é o total acumulado?'],
  ['Abrangência', 'Podemos escrever “27 estados” ou mantemos “Atuação nacional”?'],
  ['Certificações ISO', 'De quem são as ISO 27001, 9001 e 45001, qual o escopo e se estão vigentes. Por enquanto não aparecem.'],
  ['WhatsApp e agendamento', 'O seu telefone pode ser usado como WhatsApp? Existe um link de agendamento? Os botões só aparecem com essa confirmação.'],
  ['Tom dos textos', 'Os textos estão no seu jeito de falar com o cliente? Alguma frase que você não diria?'],
];

const FONT_CSS = `
@font-face{font-family:'Sommet Rounded';src:url('/fonts/sommet-rounded-regular.woff2') format('woff2');font-weight:400}
@font-face{font-family:'Sommet Rounded';src:url('/fonts/sommet-rounded-bold.woff2') format('woff2');font-weight:700}
@font-face{font-family:'Sommet Rounded';src:url('/fonts/sommet-rounded-black.woff2') format('woff2');font-weight:900}
*{box-sizing:border-box;margin:0}
body{font-family:'Sommet Rounded',Arial,sans-serif;color:#1e1d1d;background:#fff;width:${W}px}
`;

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

async function pdfOf(page, heightPx) {
  return page.pdf({ width: `${W}px`, height: `${Math.ceil(heightPx)}px`, printBackground: true, pageRanges: '1', margin: { top: 0, right: 0, bottom: 0, left: 0 } });
}

const browser = await chromium.launch({ executablePath: process.env.CHROME });
const ctx = await browser.newContext({ viewport: { width: W, height: 900 }, reducedMotion: 'reduce' });
const page = await ctx.newPage();
await page.emulateMedia({ media: 'screen', reducedMotion: 'reduce' });
const parts = [];

// ---------- Capa e instruções ----------
await page.goto(BASE, { waitUntil: 'networkidle' });
const today = '16/10/2026';
await page.setContent(`<!doctype html><html><head><meta charset="utf-8"><style>${FONT_CSS}
.cover{background:#FFCA00;padding:96px 96px 72px}
.tag{display:inline-block;padding:6px 14px;border-radius:999px;background:#1e1d1d;color:#FFCA00;font-weight:900;font-size:18px}
h1{font-size:64px;font-weight:900;line-height:1.05;margin:28px 0 20px;max-width:16ch}
.sub{font-size:24px;line-height:1.45;max-width:46ch}
.meta{margin-top:40px;font-size:18px;font-weight:700}
.how{padding:64px 96px 80px;display:grid;grid-template-columns:1fr 1fr;gap:56px}
h2{font-size:32px;font-weight:900;margin-bottom:20px}
ol,ul{padding-left:26px;font-size:20px;line-height:1.55}
li{margin-bottom:12px}
b{font-weight:900}
.note{grid-column:1/-1;padding:24px 28px;border-left:6px solid #FFCA00;background:#f3f2ef;font-size:19px;line-height:1.5}
</style></head><body>
<div class="cover">
  <span class="tag">Versão para revisão</span>
  <h1>Apresentação comercial CRED MHS</h1>
  <p class="sub">Sabrina, esta é a nova versão da apresentação, montada a partir da nossa reunião e dos frameworks que você enviou. Queremos as suas correções antes de fecharmos textos e números.</p>
  <p class="meta">Pixel Rain · ${today} · Nada foi publicado: a apresentação ainda roda só em ambiente de teste.</p>
</div>
<div class="how">
  <div>
    <h2>Como revisar</h2>
    <ol>
      <li>Abra este PDF no <b>Adobe Acrobat Reader</b>, no <b>Microsoft Edge</b> ou na <b>Visualização</b> do Mac. Todos permitem comentar.</li>
      <li>Selecione o trecho e use <b>Grifar</b> ou <b>Comentário</b>. Escreva o que trocar, tirar ou acrescentar. Pode reescrever a frase do seu jeito.</li>
      <li>Responda às perguntas da última página, digitando nos campos.</li>
      <li>Salve e devolva o arquivo para a gente.</li>
    </ol>
  </div>
  <div>
    <h2>O que observar</h2>
    <ul>
      <li>Se os <b>textos</b> soam como você fala com o cliente.</li>
      <li>Se os <b>números e dados</b> da empresa estão certos e atualizados.</li>
      <li>Os nomes dos <b>quatro eixos</b> e das <b>cinco etapas</b> da trilha.</li>
      <li>Os selos <b>3C/3I</b> em cada seção.</li>
      <li>A <b>ordem</b> das partes e se falta ou sobra algo.</li>
    </ul>
  </div>
  <p class="note">Cada página mostra uma parte da apresentação, na ordem em que o cliente vê ao rolar a tela. Esta é a versão de computador; no celular o mesmo conteúdo se reorganiza em uma coluna. As partes com movimento aparecem paradas e têm uma nota explicando a animação. O exemplo usa o seu perfil; cada executivo tem o próprio link, com foto e contatos.</p>
</div>
</body></html>`, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
parts.push(await pdfOf(page, await page.evaluate(() => document.body.scrollHeight)));

// ---------- Seções da página real ----------
await page.goto(BASE, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
// Abre o conteúdo recolhido para a revisão.
await page.evaluate(() => {
  document.querySelectorAll('details').forEach((d) => (d.open = true));
  const more = [...document.querySelectorAll('button')].find((b) => b.textContent?.includes('Ver todas as empresas'));
  more?.click();
});
await page.waitForTimeout(400);
// Esconde o que é fixo na tela (cabeçalho, trilho lateral, link de pular) e marca as seções.
await page.addStyleTag({ content: `
  .rev-hide{display:none!important}
  .rev-bar{position:relative;z-index:5;display:flex;justify-content:space-between;gap:24px;align-items:center;padding:14px 48px;background:#1e1d1d;color:#fff;font:700 16px 'Sommet Rounded',Arial,sans-serif}
  .rev-bar b{color:#FFCA00;font-weight:900}
  .rev-motion{position:relative;z-index:5;margin:0 48px;padding:14px 20px;border-left:6px solid #1e1d1d;background:#fff;color:#1e1d1d;font:400 16px/1.5 'Sommet Rounded',Arial,sans-serif;box-shadow:0 0 0 1px #e4e2dd}
  .rev-motion b{font-weight:900}
  section{scroll-margin:0!important}
`});
await page.evaluate(() => {
  for (const el of document.querySelectorAll('body *')) {
    const pos = getComputedStyle(el).position;
    if ((pos === 'fixed' || pos === 'sticky') && !el.closest('section')) el.classList.add('rev-hide');
  }
  const skip = [...document.querySelectorAll('a')].find((a) => a.textContent?.includes('Pular para o conteúdo'));
  skip?.classList.add('rev-hide');
});

for (const [i, s] of SECTIONS.entries()) {
  const h = await page.evaluate(({ s, i, total }) => {
    document.querySelectorAll('.rev-bar,.rev-motion').forEach((n) => n.remove());
    const sections = [...document.querySelectorAll('main section, section[data-chapter]')];
    const target = document.getElementById(s.id);
    // Mostra só a seção atual (e o que estiver fora de <section>, como o rodapé, só na última).
    for (const sec of sections) sec.classList.toggle('rev-hide', sec !== target);
    document.querySelectorAll('footer').forEach((f) => f.classList.toggle('rev-hide', i !== total - 1));
    const bar = document.createElement('div');
    bar.className = 'rev-bar';
    bar.innerHTML = `<span><b>Página ${i + 2}</b> · ${s.name}</span><span>Grife e comente direto no texto</span>`;
    target.parentElement.insertBefore(bar, target);
    if (s.motion) {
      const note = document.createElement('p');
      note.className = 'rev-motion';
      note.innerHTML = `<b>Movimento:</b> ${s.motion}`;
      const holder = document.createElement('div');
      holder.setAttribute('data-rev', '1');
      holder.style.cssText = 'position:relative;z-index:5;padding:16px 0;background:#fff';
      holder.appendChild(note);
      target.parentElement.insertBefore(holder, target);
    }
    window.scrollTo(0, 0);
    // Altura = do topo até o fim do último elemento visível (seção, ou rodapé na última página).
    const footer = i === total - 1 ? document.querySelector('footer') : null;
    const end = (footer ?? target).getBoundingClientRect().bottom + window.scrollY;
    return end;
  }, { s, i, total: SECTIONS.length });
  await page.waitForTimeout(250);
  parts.push(await pdfOf(page, h));
  await page.evaluate(() => document.querySelectorAll('[data-rev]').forEach((n) => n.remove()));
}

// ---------- Perguntas (com campos de resposta) ----------
await page.goto(BASE, { waitUntil: 'networkidle' });
await page.setContent(`<!doctype html><html><head><meta charset="utf-8"><style>${FONT_CSS}
.wrap{padding:72px 96px 80px}
h2{font-size:44px;font-weight:900;margin-bottom:12px}
.lead{font-size:20px;line-height:1.5;max-width:60ch;margin-bottom:40px}
.q{margin-bottom:28px}
.q h3{font-size:22px;font-weight:900;margin-bottom:6px}
.q h3 span{display:inline-block;min-width:36px}
.q p{font-size:18px;line-height:1.5;max-width:80ch;margin-bottom:10px}
.box{height:92px;border:2px solid #1e1d1d;border-radius:10px;background:#fff}
.extra .box{height:220px}
</style></head><body><div class="wrap">
<h2>Perguntas para você</h2>
<p class="lead">Digite nos campos abaixo de cada pergunta. Se preferir, responda por mensagem ou na nossa conversa, citando o número.</p>
${QUESTIONS.map(([t, q], i) => `<div class="q"><h3><span>${i + 1}.</span>${esc(t)}</h3><p>${esc(q)}</p><div class="box" data-field="resposta_${i + 1}"></div></div>`).join('')}
<div class="q extra"><h3><span>+</span>Outros comentários</h3><p>Qualquer coisa que não coube nos comentários das páginas.</p><div class="box" data-field="outros_comentarios"></div></div>
</div></body></html>`, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
const qHeight = await page.evaluate(() => document.body.scrollHeight);
const boxes = await page.evaluate(() => [...document.querySelectorAll('[data-field]')].map((b) => {
  const r = b.getBoundingClientRect();
  return { name: b.dataset.field, x: r.left + scrollX, y: r.top + scrollY, w: r.width, h: r.height };
}));
parts.push(await pdfOf(page, qHeight));
await browser.close();

// ---------- Junta tudo e cria os campos ----------
const doc = await PDFDocument.create();
doc.setTitle('Apresentação comercial CRED MHS — versão para revisão');
doc.setAuthor('Pixel Rain');
doc.setSubject('Revisão da Sabrina Ferreira');
for (const bytes of parts) {
  const src = await PDFDocument.load(bytes);
  const [p] = await doc.copyPages(src, [0]);
  doc.addPage(p);
}
const form = doc.getForm();
const helv = await doc.embedFont(StandardFonts.Helvetica);
const last = doc.getPage(doc.getPageCount() - 1);
const pageH = last.getHeight();
for (const b of boxes) {
  const f = form.createTextField(b.name);
  f.enableMultiline();
  f.addToPage(last, {
    x: (b.x + 4) * PX_TO_PT,
    y: pageH - (b.y + b.h - 4) * PX_TO_PT,
    width: (b.w - 8) * PX_TO_PT,
    height: (b.h - 8) * PX_TO_PT,
    font: helv,
    borderWidth: 0,
    backgroundColor: rgb(1, 1, 1),
  });
  f.setFontSize(11);
}
writeFileSync(OUT, await doc.save());
console.log('ok', OUT, doc.getPageCount(), 'páginas');
