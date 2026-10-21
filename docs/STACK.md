# Stack e tokens

Registro da fundação técnica (2026-10-08). A pasta não tinha aplicação, então criamos uma base leve.

> **Nota V3 (20/10/2026).** Autoridade: `docs/V3-CONTRATO.md` + PPT da Sabrina. As seções da página estão em `src/components/sections/v3/` (uma por slide: `Abertura` … `Contato`, export default, sem props). O mapa animado do slide 5 fica em `src/motion/map/` (`BrazilMap`, player Remotion sob demanda, versão estática em `prefers-reduced-motion`). O modo `?revisao=1` (`src/lib/reviewMode.ts`, combina com `?executivo=`) mostra as seções pendentes (depoimentos, satisfação) com avisos internos; o link do cliente nunca as mostra. Hashes: ids das seções (`#abertura` … `#contato`, ver `src/content/chapters.ts`); hashes antigos listados em `legacyHashes` (ex.: `#m05`, `#trilha`) resolvem para a seção nova. Stack, comandos, Supabase e painel continuam como abaixo. Trilha, eixos, pauta, `TopicToggle`, “Adicionar à conversa”, contador “Pauta n”, menu “Conteúdo” e selos 3C/3I estão **superados** — não usar.

## Stack

| Item | Escolha | Motivo |
|---|---|---|
| Build/dev | Vite 6 | Leve, sem backend. Só `public/` vai para a saída |
| UI | React 18 + TypeScript (strict) | Pedido do kit (React/TS) |
| Estilo | CSS puro com custom properties (`src/styles`) + CSS Modules por componente | Sem Tailwind |
| Motion | `gsap` (inclui ScrollTrigger), restrito a M06 | Skill instalada `gsap-scrolltrigger`. Não usamos uma segunda biblioteca de scroll |
| Roteamento | Nenhum. `?executivo=<id>` + hash `#m01…#m10` | A URL só identifica executivo e capítulo |
| Backend (2026-10-10) | Supabase: Auth (e-mail/senha), Postgres com RLS (`public.executives` + RPC `get_public_executive`) e Storage (`executive-photos`). `@supabase/supabase-js` só no painel; a apresentação pública usa `fetch` na RPC | Pedido de Nil. Ver `docs/CONFIGURACAO-SUPABASE.md` |
| Páginas (2026-10-10) | Vite multipágina: `index.html` (apresentação) e `painel/index.html` (`/painel/`) | `/painel/` existe como arquivo em qualquer hospedagem; `vercel.json` e `public/_redirects` cobrem `/painel` sem barra |
| Gerenciador | npm (`package.json` na raiz) | — |

Remotion fica em `remotion/`, com dependências e comandos próprios (ver o agente/relatório de M06).

## Comandos

```bash
npm install
npm run dev        # http://localhost:5173/?executivo=sabrina-ferreira
npm run typecheck  # tsc (app + vite.config)
npm run build      # typecheck + vite build → dist/
npm run preview    # serve dist/ em http://localhost:4173 (painel em /painel/)
npm run test:rls   # testes de RLS/Storage em Postgres WASM (PGlite)
node --import ./src/lib/checks-resolve.mjs src/lib/__checks__.ts   # checks de estado/perfil
```

## Estrutura

```
index.html                 lang="pt-BR", favicon da marca, preload de 2 pesos
src/main.tsx               entrada
src/app/                   App.tsx (header/índice/M01–M10/footer), chapterIndex.ts,
                           useCurrentChapter.ts (capítulo atual + hash), mediaManifest.ts
src/styles/                tokens.css (@font-face + variáveis), global.css (reset, foco, reduced motion, papéis tipográficos)
src/components/ui/         Button, Accordion, Dialog, ChapterNavigation, SectionShell, SectionHeader,
                           TopicToggle, icons (IconPlus/IconCheck/IconChevron/IconArrow) — index.ts
src/components/sections/   M01Encontro … M10Continuidade
src/content|state|lib|types  dados tipados, estado e utilitários (outro responsável)
public/fonts/              Sommet Rounded woff2 (300/400/700/900)
public/brand/              cred-mhs-logo.svg, cred-mhs-logo-negativo.svg, cred-mhs-logo-sobre-amarelo.svg, favicon.svg
public/media/pptx/         imagens selecionadas do PPTX (ver src/app/mediaManifest.ts)
```

`assets/`, `sources/` e `docs/` ficam fora de `public/` e não vão para `dist/`. No preview, um caminho como `/assets/brand/…pdf` devolve o `index.html` (fallback de SPA), e não o arquivo.

## Origem dos tokens

### V2 (14/10/2026) — paleta e superfícies da apresentação pública
> **Superado pela V3 (20/10/2026)** no que se refere à sequência de seções (relacionamento, dados, gestão integrada, trilha, soluções). Tokens de cor continuam valendo até o agente Visual atualizar.


Autoridade: `docs/REVISAO-CRED-MHS-V2.md` §9. Base: amarelo `#FFCA00` (`--cred-yellow`), preto `#000000` (`--cred-black`), branco `#FFFFFF` (`--cred-white`).

- `--color-bg` passou de creme para branco. Seções alternam `yellow` (abertura, relacionamento, trilha, contato) e `white` (institucional, dados, soluções); `dark` só em gestão integrada (preto pontual). Superfícies: `SectionShell surface="white" | "yellow" | "dark"`; `"paper"` ainda é aceito e renderiza branco.
- Creme (`--paper`, `--paper-strong`) e amarelo claro `#FFD962` não são usados em nenhuma seção pública. `--paper*` e `--state-selected-*` permanecem só porque o painel (`src/painel/`) e `ChapterNavigation.module.css` ainda os referenciam (marcados `[legado-painel]` em tokens.css).
- `--panel-read-bg` = `--gray-100` (cinza neutro sobre branco; branco sobre amarelo).
- `--fs-h1` reduzido para 30 → 60 px: os títulos V2 são frases/perguntas de 45–75 caracteres. A abertura usa escala própria (30 → 56 px) para o apoio respirar.
- Texto sempre preto sobre amarelo; branco só sobre preto.
- Retirados de `global.css`: `.badge--priority`, `.badge--agenda`, `.row-selectable` e o estado "selecionado" (pauta/prioridades não existem mais). Ficou `.row-expandable` (aberto/fechado) e o utilitário de revelação `[data-reveal]` + `html.motion-ok` (decorativo; nunca esconde texto).
- As seções 4–10 abaixo descrevem o layout v2 da V1 (2026-10-08). Itens sobre pauta, TopicToggle, seleção e "Sua prioridade" estão superados.

### Origem (V1, mantida como referência)

**Oficial: Brandbook Grupo CRED MHS 2021** (`assets/brand/Brandbook-V0-rev 200318.pdf`)

- Cores primárias (pp. 28 e 53): amarelo `#FFCA00` (P 116 C), preto `#000000` e branco `#FFFFFF`. Amarelo e preto sempre em maior destaque.
- Cores auxiliares (pp. 29 e 53): `#FF334D`, `#B5115B`, `#FFD962`, `#009EE2` e `#0E1642`. Use **no máximo uma** por aplicação, apenas em detalhes de pequena área. Os tokens existem (`--cred-aux-*`), mas nenhum componente da fundação os usa.
- Tipografia (p. 35): Sommet Rounded é a fonte primária. O brandbook indica *Thin* para corpo e *Heavy* para títulos. Esses pesos **não foram fornecidos**. Usamos Regular/Light no corpo (Thin prejudicaria a legibilidade na tela) e Black (900) nos títulos. Fallback indicado pelo brandbook: Calibri, Arial, Helvetica.
- Logo (pp. 25, 33, 36–41): versão horizontal com tagline. Em sites, posição superior esquerda. Mínimo digital de 150 px com tagline (no header usamos 156–176 px). Não distorcer, não aplicar sobre foto, não usar como marca-d'água.
- Padrão gráfico (p. 54): o sol do símbolo sobre a linha. O traço amarelo do *eyebrow* faz referência a essa linha de base.

**Arquivos de marca**

- `logo_nova.svg`: `#1E1D1D` ("CRED" e tagline) e `#FEC702` (sol e "MHS"). `--cred-ink: #1E1D1D` é a cor de texto padrão.
- `favicon.svg` (`#FDC603`): copiado sem alteração.
- `cred-mhs-logo-negativo.svg` **[derivado]**: troca apenas `#1E1D1D` por `#FFFFFF`, conforme a versão "02, fundo preto" do brandbook (p. 37). Revisar com Nil se existir um arquivo oficial negativo.
- `cred-mhs-logo-sobre-amarelo.svg` **[derivado]**: troca apenas `#FEC702` por `#FFFFFF` (sol, linha e "MHS" brancos; "CRED" e tagline pretos), conforme "marca em negativo — fundo cores da marca" do brandbook (p. 39). Usado na abertura, direto sobre o amarelo, sem aba branca (20/10/2026). Revisar com Nil se existir arquivo oficial.
- Os amarelos do SVG (`#FEC702`) e do favicon (`#FDC603`) diferem levemente do `#FFCA00` do brandbook. A UI usa o valor do brandbook. Os arquivos de logo não foram alterados.

**Derivados (decisão de implementação, não são regras da marca)**

- `--paper #FFFCF3`: amostrado do fundo creme de `Posicionamento da marca CREDMHS.jpeg`. `--paper-strong`, a escala `--gray-*` e os papéis semânticos (`--color-*`) também são derivados.
- Escala tipográfica fluida (`--fs-display` … `--fs-small`). O corpo vai de 17 a 19 px e o apoio (`--fs-lead`) de 18 a 22 px, como sugere docs/04. Os títulos usam peso Black e `text-wrap: balance`.
- Espaçamentos (`--space-1…10`, `--gutter`, `--section-pad-y`), raios (arredondados para dialogar com a Sommet Rounded), sombras, durações e easing.
- Breakpoints: 480, 768, 1024, 1280 e 1440 px. O sticky de M06 só vale a partir de `(min-width:1024px) and (min-height:700px)`.
- Contraste: o amarelo **não** é usado como cor de texto sobre fundo claro (≈1,6:1). Sobre amarelo, o texto é `--cred-ink`.

## Fontes

As OTFs de `assets/brand/` foram convertidas para woff2 com fontTools, sem alterar os contornos. Só carregamos os pesos usados (300, 400, 700 e 900). Os itálicos não foram incluídos.

## Mídia do PPTX

Extraída de `ppt/media` e otimizada com Pillow (PNG otimizado; fotos em WebP q78 com até 1600 px). Cada arquivo, o slide de origem e o status estão em `src/app/mediaManifest.ts`. Fotos de banco ficam marcadas com `stock: true` e não podem representar equipe ou instalação da CRED.

## Padrão de layout v2 (2026-10-08)

Contrato obrigatório para as seções M01–M10. Ele resolve os achados de sistema global de `qa/auditoria-frontend-design.md` (A1–A7) e `qa/auditoria-ui-ux.md` (G1–G10). Os tokens ficam em `src/styles/tokens.css`, as classes em `src/styles/global.css` e os componentes em `src/components/ui` (importar de `../ui` ou `../../ui`).

### 1. Eixo
- Existe **um container só**: `.container`, com `--content-max: 82rem` (1312 px) e `padding-inline: var(--gutter)`. `.container--wide` e `width="wide"` continuam aceitos, mas são **aliases sem efeito**. Não crie outro `max-width` de página.
- A reserva do trilho (`--rail-reserve: 5rem`, ≥1280×640) vale para **todo** `.container`: header, seções e footer.
- Medido: logo, títulos M01–M09 e footer ficam em x=102 (1440), x=75 (1280), x=30 (1024) e x=17 (390).
- Colunas internas são grids **dentro** do container. Nada começa antes do eixo.

### 2. Seção e cabeçalho
- `<SectionShell id surface eyebrow title intro headerAside>`. O padding vertical é **um só** (`--section-pad-y`). `spacing="none"` fica só para M01. A prop `titleSize` foi **removida**, e `spacing="compact"` também.
- `surface` define `data-surface` (light | dark | yellow), usado pelo contraste dos controles, e `data-bg` (paper | white | dark | yellow), usado pelos painéis.
- Título próprio em coluna (M08/M09/M10, `header={false}`): use `<SectionHeader titleId={sectionTitleId(id)} eyebrow title intro flush? aside? />`. **Não** recrie `.eyebrow` nem `.title` no CSS da seção. Apague as cópias.
- Medida do título de capítulo: `max-width: 21ch` (coluna do cabeçalho até 60rem). Com ela, o título mais longo (M02) fica em 2 linhas de 1024 a 1440 e nenhum título passa de 2 linhas no desktop. A 360, M03 e M05 também ficam em 2 linhas; só M02 (52 caracteres) usa 3.
- Espaçamentos fixos: eyebrow→título e título→lead = `--header-gap` (16 px). Cabeçalho→conteúdo = `--header-to-content` (32→64 px). Use `flush` quando a coluna já tiver gap próprio.

### 3. Tipografia (um nível por papel)
| Papel | Classe | Tamanho (360 → 1440) |
|---|---|---|
| Título de capítulo | `.t-h1` (automático no SectionHeader) | 28 (≤320) · 29 (360) → 69 (rodada v2 final; antes 32 → 69) |
| Título de item de destaque (M05 detalhe, M07 item) | `.t-h2` | 26 → 44 |
| Subtítulo de bloco / rótulo de apoio (ex.: "Atuação nacional") | `.t-h3` (900) | 22 → 30 |
| Rótulo de linha/lista | `.t-h4` | 19 → 23 |
| Apoio do capítulo (só ele) | `.t-lead` | 18 → 22 |
| Descrição de item | `.t-body` | 17 → 19 |
| Metadado | `.t-small` / eyebrow | 16 |

Nada dentro do capítulo pode ser maior que `.t-h1`. Os títulos `.t-*` usam `text-wrap: balance`, e lead, body e small usam `pretty`. Para um termo com hífen ("e-mail"), use `<span className="nowrap">`.

### 4. Adicionar à conversa
> **Superado (V2 e V3).** `TopicToggle` e a pauta não existem mais. Histórico.

Use `<TopicToggle selected onToggle subject tone? addLabel? removeLabel? block? />` em **todos** os lugares (M05 frente, M06, M07, M05 catálogo se houver botão).
- Altura fixa de 48 px e corpo de 16 px.
- Fora da pauta: contorno com +. Na pauta: preenchido (tinta; branco quando `tone="dark"`) com ✓ e "Remover da conversa".
- `aria-pressed`, e o nome acessível inclui o assunto.
- `compact` (catálogo de M05): abaixo de 560 px vira um disco de 48×48 só com + / ✓, ao lado do rótulo da linha. O texto "Adicionar/Remover da conversa: assunto" continua como nome acessível, e a linha inteira (≥64 px) também alterna.
- Passe os rótulos de `copy`. Apague `.topicToggle` local e os `Button` usados para essa ação.

### 5. Semântica de estado (não misturar)
> **Superado em parte (V2 e V3):** estados “Selecionado / na pauta”, “Sua prioridade” e “Na pauta”. Histórico.

| Estado | Tratamento | Como aplicar |
|---|---|---|
| **Selecionado / na pauta** (escolha do visitante) | creme `--state-selected-bg` + barra amarela de 6 px; TopicToggle preenchido + ✓ | `.row-selectable` + `aria-pressed="true"` ou `data-selected="true"` |
| **Aberto / expandido** | cinza `--state-open-bg` + barra **tinta** de 4 px + chevron girado | `.row-expandable` + `aria-expanded="true"` ou `data-open="true"` |
| **Sua prioridade** | só o selo `<span class="badge badge--priority">` (contorno + ponto amarelo) | nunca fundo, barra ou número amarelo |
| Já na pauta (texto) | `<span class="badge badge--agenda"><IconCheck/> Na pauta</span>` | único selo para M05/M06/M07 |

Hover das linhas: `--state-hover-bg` (gray-200; 1,27:1 sobre branco). As duas classes `.row-*` já trazem hover, `:active` e o foco combinado com a barra.

### 6. Ícones
> **Superado em parte:** referências à pauta (IconPlus/IconCheck). Histórico.

`IconPlus` serve só para adicionar/selecionar. `IconCheck` marca o que está na pauta. `IconChevron` é para expandir/recolher (`open`) ou abrir um detalhe (`direction="right"`). `IconArrow` é para navegar. O `Accordion` já usa chevron. Não use + para expandir.

### 7. Campos
Use `<div class="field-group"><label class="field-label"/><input class="field"/><p class="field-hint"/></div>`, e também `textarea.field`. O campo tem borda de 2 px gray-600 (6,9:1), raio `--field-radius` (12) e fundo branco. `input.field` tem altura **fixa** de 52 px em todas as larguras (antes crescia para 59 px a 1440). O botão "Incluir" de M09 usa a mesma altura. A `textarea` de M10 cresce com o texto em todas as larguras, sem `max-height` nem rolagem interna. Apague os estilos locais `.input` e `.textarea`, mantendo só o layout, como `flex: 1`.

### 8. Painéis (só dois)
- `.panel-read`: o fundo contrasta com a seção (paper; branco quando a seção é paper), sem borda nem sombra.
- `.panel-action`: branco, borda e `--shadow-md`. Serve para M09 `.sheet` e M10 `.composer`.
- Ambos usam raio de 20 e padding de 16 (lateral, <480), 24 ou 48 (≥768).
- Nunca aninhe 3 níveis. Painel branco dentro de seção amarela leva `data-surface="light"`.
- Não há outras sombras: `--shadow-overlay` fica só para Dialog e menu.

### 9. CTA por função (`Button`)
- `primary`: no máximo **um por seção**. Use `lg` em M01 e M10 e `md` nas demais. No amarelo, o primary fica branco automaticamente.
- `secondary` (`ghost-dark` no escuro): continuar ou alternativa.
- `link`: ação textual, detalhe inline (com `IconChevron`) e atalho de saída (com `IconArrow`).
- Abaixo de 480, o `lg` reduz o padding. Num `.panel-action` com `block`, o rótulo "Preparar e-mail para Sabrina" cabe numa linha a 360 (medido simulando o padding lateral de 16 px no `.composer` atual: 56 px de altura; com os 24 px atuais, quebra em 2 linhas e fica com 70 px).
- Ações na mesma linha usam o mesmo `size`.
- `danger`: só para confirmar uma ação destrutiva em diálogo ("Reiniciar", "Limpar escolhas"). Usa tinta preenchida com texto branco e hover em magenta auxiliar do brandbook. O amarelo fica reservado para avançar. As duas ações do rodapé do diálogo são `md`.

### 10. Outros
> **Superado em parte:** contador “Pauta n”, menu “Conteúdo” e trilho de capítulos M01–M10. Histórico.

- Dialog centralizado (`margin: auto`) a partir de 768 px. Abaixo disso vira folha inferior: o título ocupa a largura toda, "Fechar" vira um disco de 44×44 só com × (o rótulo continua no nome acessível) e as ações do rodapé ocupam a largura.
- Contador do header: "Pauta n" visível abaixo de 480. Nessa faixa, "Conteúdo" fica só com o ícone (nome acessível mantido).
- Trilho: o capítulo atual aparece em tinta com número amarelo.
