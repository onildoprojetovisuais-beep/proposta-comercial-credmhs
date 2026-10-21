# Auditoria visual e de layout (skill frontend-design): 2026-10-08

> **Status final (rodada v2, revisão de 2026-10-08):** medido em dev e no preview, com capturas em `qa/capturas/v2/`. Detalhes em `qa/RELATORIO.md`, seção "Rodada v2".
>
> | Achado | Status | Evidência |
> |---|---|---|
> | A1 dois tamanhos de título | **resolvido** | um só `.t-h1` em M02–M10: 69/63/53,6/30,1/29 px |
> | A2 dois eixos / logo fora do eixo | **resolvido** | logo, títulos e footer em x=102,4 · 75,2 · 30,1 · 17,4 · 16,8 |
> | A3 "Adicionar à conversa" com 3 aparências | **resolvido** | `TopicToggle` único, 48 px (catálogo M05 <560: disco compacto 48×48) |
> | A4 cinco tratamentos de painel | **resolvido** | só `.panel-read` e `.panel-action` |
> | A5 cabeçalho duplicado M08–M10 | **resolvido** | `SectionHeader` |
> | A6 subtítulos sem papel | **resolvido** | `.t-h3`/`.t-h4` |
> | A7 eyebrow 15 px | **resolvido** | 16 px |
> | B1 "Atuação nacional" maior que o título | **resolvido** | `.t-h3` 30 px contra 69 px |
> | B2 CTA de M10 em 2 linhas no mobile | **resolvido** | 1 linha a 360 (56 px) |
> | B3 coluna lateral de M02 no mobile | **resolvido** | painel `.panel-read` no fluxo (`360-m02.png`) |
> | B4 CTA de saída duplicado em M06 | **resolvido** | uma saída no `headerAside` (`1440-m06.png`) |
> | B5 títulos de M08/M09 em 3 linhas | **resolvido** | todos os títulos ≤2 linhas de 768 a 1440. M02 também passou a 2 linhas nesta revisão (21ch) |
> | B6 quebras feias a 360 | **resolvido** | `--fs-h1` 29 px a 360: M03 e M05 em 2 linhas. Só M02 (52 caracteres) usa 3, sem órfã |
> | B7 "Outras necessidades" como lista de cartões | **resolvido** | lista de linhas com rótulo e toggle lado a lado. A 360 a subseção caiu de ~2800 para 842 px |
> | B8 hero e logo em eixos diferentes | **resolvido** | x=102,4 nos dois |
> | B9 "e-/mail" | **resolvido** | `.nowrap` |
> | B10 descrições de M07 como lead | **resolvido** | `.t-body` |
> | Pendências (Safari, Firefox, zoom real, leitor de tela) | **pendente** | não há ferramenta nesta máquina |


**Escopo:** auditoria somente de leitura. Nenhum arquivo de `src/` foi alterado, e copy e fatos ficaram intactos.
**Ambiente:** Vite dev em `http://localhost:5173/?executivo=sabrina-ferreira`, com Chromium headless via Playwright (Python).
**Viewports:** 1440×900, 1280×800, 390×844 e 360×740.
**Capturas:** 116 quadros (header, índice aberto, M01–M10 e footer em cada viewport), em `scratchpad/audit-fd/`, fora do repositório. Na mesma pasta ficam as folhas de contato (`sheets/`) e as medições brutas (`measure-*.json`, `measure2.json`). Olhei todos os quadros: os de 1440 um a um, e os de 1280 e mobile em folhas de 2 a 4 quadros.
**Medição:** `getComputedStyle` e `getBoundingClientRect` no DOM. Os valores abaixo estão em px CSS.

Leitura de base: CLAUDE.md (seção Design), `docs/04-direcao-visual-e-motion.md`, `docs/STACK.md`, `src/styles/tokens.css`, `src/styles/global.css`, `qa/revisao-visual.md` e a skill frontend-design. A skill pede direção clara executada com precisão, unidade tipográfica e espacial, e ausência de padrão genérico. A identidade CRED já está bem resolvida: Sommet Rounded, amarelo e preto oficiais, o sol como motivo e o traço do eyebrow. Os problemas encontrados são de **consistência entre seções**, não de direção.

---

## O que já está consistente (medido)

- **Padding vertical das seções:** idêntico em M02–M10. São 126,4 px em 1440, 116,8 px em 1280 e 64 px no mobile. A última peça de conteúdo fica exatamente a `--section-pad-y` do fim.
- **Eyebrow:** 15 px, peso 700, tracking 1,8 px, caixa alta e traço amarelo em todas as seções.
- **Intro/lead:** 22 px / 33 px no desktop e 18,2 px no mobile, com `max-width` de 46ch, em todas as seções com cabeçalho padrão.
- **Raio:** os painéis usam sempre `--radius-lg` (20 px), e os controles usam pill ou 6 px. Não há raio fora do sistema.
- **Cor:** só aparecem tokens (amarelo, ink, paper, branco e cinzas). Nenhuma cor auxiliar do brandbook foi usada.
- **Rolagem horizontal:** nenhuma nas 4 viewports (`scrollWidth = innerWidth`).
- **Ritmo de superfícies:** paper › white › dark › paper › white › dark › paper › white › yellow › paper › footer dark. O ciclo é regular e funciona.

---

## Achados priorizados

### A. Sistema global (tokens, ui, global.css)

#### A1. ALTA: dois tamanhos de título de capítulo para a mesma função
- **Evidência (1440):** M02–M05 usam `.t-h2`, com **54,7 px**, lh 61,3 e tracking −0,55. M06–M10 usam `.t-h1`, com **70,1 px**, lh 72,9 e tracking −1,40. Em 1280 são 51 e 65 px; em 390, 30,6 e 36,5 px. A presença dos títulos sobe 28% no meio da página sem nenhuma razão editorial.
- **Inversão de hierarquia:** os itens internos de M05 (detalhe "Saúde Ocupacional") e de M07 ("eSocial") são `h3` com `.t-h2`, ou seja, **54,7 px / 900**. É o mesmo tamanho do título de capítulo de M02–M05.
- **Arquivos:** `M02Prioridades.tsx:32`, `M03Capacidade.tsx:34`, `M04ProvaSocial.tsx:57` e `M05Ecossistema.tsx:205` (`titleSize="h2"`), mais `SectionShell.tsx` (padrão `h1`).
- **Correção:**
  - Remover `titleSize="h2"` de M02–M05, para que todos os capítulos usem `.t-h1`.
  - Os títulos de item (M05 detalhe, M07) continuam em `.t-h2`. Com isso a razão título/item fica em 70/55 = 1,28 e a hierarquia volta a ficar clara.
  - Ajustar o mínimo de `--fs-h1` para não piorar o mobile: `--fs-h1: clamp(2rem, 1.25rem + 3.4vw, 4.5rem)`, o que dá 32 px a 360, 33 px a 390 e 69 px a 1440. Isso também resolve o achado B6.

#### A2. ALTA: dois eixos esquerdos (salto de 48 px) e logo fora do eixo do conteúdo
- **Evidência (1440):**
  - Logo do header em x=**102**.
  - M01 (h1) e M02–M05 (título, eyebrow e lead) em x=**150**, com `.container`, 1216 px.
  - M06–M10 e footer em x=**102**, com `.container--wide`, 1312 px.
  - Resultado: a primeira dobra já começa desalinhada (logo a 102 e "Olá, eu sou Sabrina." a 150), e a página salta 48 px entre M05 e M06.
- **Evidência (1280):** o logo fica em x=**35**, mas todo o conteúdo fica em x=**75**. O header não recebe a reserva `main .container { max-width: min(…, 100% − 5rem) }`, porque ele não está dentro de `main`.
- **Arquivos:** `global.css` (`.container`, `.container--wide`, `@media (min-width:1280px) and (min-height:640px)`), `SectionShell.tsx` (`width` padrão `'default'`), `M01Encontro.tsx` e `App.module.css` (header).
- **Correção, com um eixo único:**
  - **Opção recomendada:** `--content-max: 82rem`, com eixo x=102 em 1440 igual ao do header e do footer. Remover a distinção `--content-wide` ou deixá-la como alias.
  - **Alternativa:** manter 76rem e fazer header, footer e M06–M10 usarem `.container`.
  - Em qualquer opção, trocar o seletor de reserva para `main .container, body > #root header .container` (ou `.container` sem `main`), para que o logo acompanhe o conteúdo em 1280 (35 → 75).

#### A3. ALTA: "Adicionar à conversa" tem 3 aparências e 3 tamanhos para a mesma ação

| Seção | Componente | Medido (1440) |
|---|---|---|
| M05 (detalhe) | `.topicToggle` próprio, contorno ink 2 px, ícone amarelo | 16 px, h=46, padding 8,8/19,2 |
| M05 ("Outras necessidades") | texto + ícone, sem contorno | 16 px, sem pill |
| M06 | `Button primary size="sm"` | 16 px, h=44, padding 7,2/17,6 |
| M07 | `Button primary` md | 19 px, h=53, padding 13,3/28,5 |

- **Arquivos:** `m05/M05Ecossistema.module.css:294-315` (`.topicToggle`), `M05Ecossistema.tsx`, `M06GestaoEmMovimento.tsx:156-157` e `M07Aplicacoes.tsx:97`.
- **Correção:**
  - Usar uma única regra: `<Button variant={selected ? 'secondary' : 'primary'} size="md">` em M05, M06 e M07. Em fundo escuro, o estado selecionado usa `ghost-dark`.
  - Apagar `.topicToggle`.
  - Em "Outras necessidades" (M05), a ação de grupo pode ser `size="sm"`, mas com a mesma variante.

#### A4. MÉDIA: cinco tratamentos de painel/cartão diferentes

| Painel | Fundo | Borda | Sombra |
|---|---|---|---|
| M02 `.side` | paper | — | `inset 0 4px 0 yellow` |
| M04 `.featured` | branco | 1 px gray-200 | — |
| M05 `.panel` | paper | — | — |
| M09 `.sheet` | branco | — | **`--shadow-lg`** (única da página) |
| M10 `.composer` | branco | 1 px gray-200 | `--shadow-md` |

- Os raios estão iguais (20 px), mas os painéis "de leitura" (M02/M05) e "de ação" (M09/M10) não seguem regra.
- M09 ainda tem 3 níveis aninhados: amarelo › folha branca › formulário paper com raio 12. Fica pesado no mobile (folha de 665 px de altura em 390).
- **Correção, com dois papéis:**
  - **Painel de leitura:** `background: var(--paper)` sobre branco (ou branco sobre paper), sem borda e sem sombra, com `padding: var(--space-7)` no desktop e `var(--space-5)` no mobile. O acento amarelo `inset 0 4px 0` fica em todos os painéis de leitura ou em nenhum. Recomendo nenhum.
  - **Folha de ação** (M09 `.sheet`, M10 `.composer`): branco, `1px solid var(--color-border)` e `var(--shadow-md)`. Trocar o `--shadow-lg` de M09 por `--shadow-md`.
  - No mobile, tirar o fundo do `.addForm` de M09, deixando só um divisor superior.

#### A5. MÉDIA: cabeçalho de capítulo duplicado em M08, M09 e M10
- M08, M09 e M10 usam `header={false}` e recriam eyebrow e título com CSS próprio (`.eyebrow` copiado em `M08Referencias.module.css:14`, M09 e `M10Continuidade.module.css:20`). A divergência já apareceu:
  - eyebrow→título = **24 px** em M09 (`.intro { gap: var(--space-5) }`), contra **16 px** nas outras 9 seções;
  - topo do título a 174 px do início da seção em M09, contra 166 px nas demais.
- **Correção:** extrair `SectionHeader` (o mesmo JSX/CSS do `header` do `SectionShell`) e usá-lo dentro das colunas de M08, M09 e M10. Até lá, em M09, `.intro { gap: var(--space-4) }`.

#### A6. BAIXA: subtítulos internos sem papel definido
O mesmo papel ("subtítulo de bloco") aparece com peso e tamanho diferentes.

| Seção | Texto | Elemento | Tamanho/peso |
|---|---|---|---|
| M02 | "Conheça a estrutura…" | `p` | 30/900 |
| M05 | "Outras necessidades…" | `h3` | 30/**700** |
| M06 | fases | `h3` | 30/700 |
| M08 | pontos | `h3` | 30/**900** |
| M09 | "Pauta de conversa" | `p` | 30/900 |
| M10 | "Sua mensagem" | `label` | 30/900 |

- **Correção:** `.t-h3` passa a ter peso 900 (Black), igual ao dos títulos (o brandbook pede Heavy em títulos). Assim, todo subtítulo de bloco fica `.t-h3` com 30/900 e lh 1,12.

#### A7. BAIXA: eyebrow com 15 px, abaixo do mínimo de metadados (`--fs-small` = 16)
Funciona por ser caixa alta com tracking, mas é o menor texto da página e se repete 11 vezes. Avaliar `--fs-eyebrow: 1rem`. A mudança é opcional e não afeta o layout.

### B. Por seção

#### B1. M03, ALTA: "Atuação nacional" é maior que o título do capítulo
- **Evidência:** `.reach` em ≥1024 usa `clamp(2.5rem, 1rem + 3vw, 4rem)`, ou seja, **59,2 px / 900** em 1440. O título do capítulo tem **54,7 px**. São dois títulos lado a lado, e o rótulo de apoio vence o título (ver `1440-m03-0`).
- **Arquivo:** `m03/M03Capacidade.module.css:173-179`.
- **Correção:** em ≥1024, usar `.reach { font-size: var(--fs-h3); }` (30 px), com o traço amarelo à esquerda, alinhado pela base com o lead. Os números `.value` (72 px) continuam como a evidência principal. Se A1 for aplicado (título de 70 px), 59 px ainda competem, e a correção continua válida.

#### B2. M10 (mobile), ALTA: o CTA principal quebra em 2 linhas
- **Evidência:** "Preparar e-mail para Sabrina" mede h=**77 px** (2 linhas) e w=305 em 390. Em 360 também quebra (ver `360-m10-1`). É a ação final da página e fica com cara de bloco espremido.
- **Arquivos:** `M10Continuidade.tsx:130` (`size="lg"`) e `m10/M10Continuidade.module.css` (padding de `.composer`).
- **Correção:** abaixo de 480 px, `.composer { padding: var(--space-5) var(--space-4); }`, com o botão em `block` (largura 100%), `size="md"` e `padding-inline: 1.1em`. Validar em 360 que a altura fica ≤ 56.

#### B3. M02, MÉDIA: a coluna lateral perde a identidade no mobile e deixa um vão
- **Evidência:**
  - Em ≥1024, `.side` é um painel paper com raio 20 e padding 32/24. No mobile, vira `background: transparent; border-radius: 0`.
  - "Conheça a estrutura que sustenta essa atuação." cai de **30 px/900** para **18,2 px/700**.
  - Há um vão de **100 px** entre o fim da lista (y=1744) e o início da lateral (y=1844) em 390 (`390-m02-1`).
- **Arquivo:** `m02/M02Prioridades.module.css:162-166` e `:298-316`.
- **Correção:**
  - Aplicar o painel (bg paper, `--radius-lg`, padding `var(--space-5)`) em todas as larguras.
  - Fazer a frase de transição usar `.t-h3` em todas as larguras.
  - No mobile, `.side { gap: var(--space-6) }`, com a distância lista→painel igual a `var(--space-6)`.

#### B4. M06, MÉDIA: CTA de saída duplicado e "cauda" desalinhada
- **Evidência (1440):**
  - "Ir para aplicações" aparece 2 vezes. A primeira é um `Button ghost-dark sm` no `headerAside`, em x=1149–1338, alinhado à borda direita do container largo e sem relação com nada abaixo. A segunda é um link de texto (`.exitLink`, 16 px) sob as fases.
  - O bloco "Explorar recursos de tecnologia" + "Pauta / Adicionar à conversa" mede **832 px** de 1236 úteis. Sobra um vazio de ~400 px à direita (ver `1440-m06-3`).
- **Arquivos:** `M06GestaoEmMovimento.tsx:49` e `:137-160`, e `m06/M06.module.css`.
- **Correção:**
  - Manter o botão do cabeçalho, porque é ele que permite sair sem atravessar a animação, conforme docs/04. Trocar o `.exitLink` por `Button variant="link"`, em vez do estilo próprio.
  - Fazer a cauda ocupar a largura do container, com o accordion em 100% e a linha "Pauta" em grid `1fr auto`.
  - Ou então alinhar a cauda à coluna das fases (x=102 até 690), para que pertença à mesma composição.

#### B5. M08 e M09, MÉDIA: título em 3 linhas no desktop por coluna estreita
- **Evidência (1440):** M08 tem coluna de 473 px, com linhas de 302/438/467. M09 tem coluna de 479 px, com linhas de 430/342/280, e o título "operação" fica sozinho na 3ª linha. Os outros capítulos têm títulos de 2 linhas.
- **Arquivos:** `m08/M08Referencias.module.css` e `m09/M09Pauta.module.css` (grid de 2 colunas ≥1024).
- **Correção:** grid `minmax(0, 6fr) minmax(0, 6fr)` (~600 px para o título), ou `.title { max-width: none }` com `--fs-h1` contido nessas duas seções. Meta: no máximo 2 linhas em ≥1280.

#### B6. M10, M06 e M05 (360), MÉDIA: quebras feias no título
- **Evidência:** larguras de linha em 360.
  - M10: **265 / 113 / 217**, com "sobre a" isolado no meio.
  - M06: 196 / 271 / **132** ("a gestão").
  - M05: 279 / 188 / 168.
- **Causa:** 36 px (`--fs-h1` no mínimo) + `max-width: 20ch` + `text-wrap: balance`. "sobre a sua empresa?" mede 330 px e a coluna tem 326.
- **Correção:** o novo mínimo de `--fs-h1` (2rem, ver A1) faz M10 caber em 2 linhas (≈293 px) e M06 em 2 linhas. Confirmar em 360 depois da mudança. Não alterar o texto.

#### B7. M05, MÉDIA: "Outras necessidades" ainda tem cara de lista de cartões repetidos (N4 da revisão anterior)
- **Evidência (1440):** 10 linhas idênticas com ícone ⊕ em 2 colunas (x=649–1290). A coluna esquerda (x=150–577) tem só o título (30 px) e o lead, e fica vazia por ~250 px abaixo do lead.
- O padrão número + título + círculo também se repete em M02 (lista com "+") e M05 (áreas com "›"), com o número em posições diferentes: centrado em M02 e sobrescrito em M05.
- **Correção:**
  - Em ≥1024, `position: sticky; top: calc(var(--header-h) + var(--space-6))` na coluna esquerda, igual a M08.
  - Trocar o ícone por linha pelo texto "Adicionar" só no hover/foco, mantendo o ⊕ visível no estado selecionado, ou reduzir o ícone para 24 px sem contorno.
  - Unificar a posição do número (`01`) em M02 e M05, alinhado pela linha de base do título.

#### B8. M01 e header, BAIXA: hero e logo em eixos diferentes
É consequência direta de A2: h1 em x=150 e logo em x=102 (1440), ou x=75 e x=35 (1280). A correção é a mesma de A2.

#### B9. M10 (mobile), BAIXA: quebra "e-/mail" na nota de canais
- **Evidência:** em 360, "Os botões abrem o seu aplicativo de e-" / "mail…" (ver `360-m10-1`). O hífen do texto vira ponto de quebra.
- **Correção:** `white-space: nowrap` só no termo "e-mail", via `<span class="nowrap">` no componente. Não muda a copy.

#### B10. M07, BAIXA: descrições de item em papel de lead
- **Evidência:** `.summary` de M07 e o texto das fases de M06 usam `.t-lead` (22 px). Os textos equivalentes de M08 e M05 usam corpo (19 px).
- **Correção:** reservar `.t-lead` para o apoio do capítulo e usar `.t-body` em todas as descrições de item. Aceitável manter em M07 se A1 for aplicado, porque o título do item fica bem maior.

---

## Padrão unificado proposto (todas as seções)

| Elemento | Regra |
|---|---|
| **Eixo** | Um container só: `max-width: 82rem` (1312), `padding-inline: var(--gutter)`. Header, M01–M10 e footer no mesmo x (102 em 1440). Reserva do trilho (≥1280×640) aplicada também ao header. |
| **Padding vertical** | `var(--section-pad-y)` em todas (já ok). M01 continua com `spacing="none"` por ser hero. |
| **Cabeçalho de capítulo** | Componente único (`SectionHeader`): eyebrow 15–16 px, gap eyebrow→título `var(--space-4)`, título `.t-h1` (32→69 px), gap título→lead `var(--space-4)`, lead `.t-lead` 46ch, margem cabeçalho→conteúdo `clamp(var(--space-6), 4vw, var(--space-8))` (já no SectionShell). |
| **Escala de títulos** | Capítulo `.t-h1` · item de destaque (M05 detalhe, M07) `.t-h2` · subtítulo de bloco `.t-h3` 900 · rótulos de apoio (ex.: "Atuação nacional") no máximo `.t-h3`. Nada dentro do capítulo maior que o título do capítulo. |
| **CTAs** | Ação principal do capítulo: `primary lg` (M01, M10) ou `secondary lg` sobre amarelo (M09). Continuar/sair do capítulo: `secondary md` (claro) ou `ghost-dark md` (escuro), com um único por seção. Adicionar à pauta: `primary md`, que vira `secondary`/`ghost-dark` quando selecionado. Ação textual: `Button variant="link"` md. No mobile <480, CTA principal em `block`, sempre numa linha. |
| **Painéis** | Leitura: paper/branco, sem borda nem sombra, `--radius-lg`. Ação: branco + borda `--color-border` + `--shadow-md`. Nunca 3 níveis aninhados. |
| **Listas selecionáveis** | Número `01` na mesma posição e mesmo tamanho (16 px/700, alinhado pela base) em M02, M05 e M07. Ícone de estado de 40 px, um só desenho por função (+ adicionar, › abrir). |

## Pendências desta auditoria

- Safari/iOS, Firefox, zoom real do navegador e leitor de tela não foram verificados.
- As medições de M06 em 1440 foram feitas com a seção no estado inicial do sticky (fase 1). Os quadros da sequência foram olhados, mas não medi cada fase.
- O valor `lastContentToEnd` negativo de M06 no mobile vem de um elemento fora do fluxo (palco ou mídia) e não indica corte visual. Os quadros confirmam o respiro inferior.
