# Auditoria UI/UX (somente leitura): 2026-10-08

> **Status final (rodada v2, revisão de 2026-10-08):** detalhes em `qa/RELATORIO.md`, seção "Rodada v2".
>
> | Achado | Status | Evidência |
> |---|---|---|
> | G1 diálogo no canto | **resolvido** | centro (720, 450) a 1440. Abaixo de 768 é folha inferior por contrato |
> | G2 toggle com quatro aparências | **resolvido** | `TopicToggle` único (`aria-pressed`) |
> | G3 creme + barra com três sentidos | **resolvido** | semântica de estado em `docs/STACK.md` §5 |
> | G4 "+" para cinco ações | **resolvido** | + só para adicionar, chevron para expandir |
> | G5 bordas de campo | **resolvido** | `.field` com 2 px gray-600 (6,9:1) e altura fixa de 52 px |
> | G6 hover imperceptível | **resolvido** | `--state-hover-bg` e `:active` nas linhas e no toggle |
> | G7 contador sem rótulo | **resolvido** | "Pauta n" visível abaixo de 480 |
> | G8 seis padrões de "mostrar mais" | **resolvido** | link + chevron ou `Accordion` |
> | G9 textos <16 px | **resolvido** | selos em 16 px (o número do trilho segue em 12 px, também anunciado pelo rótulo) |
> | G10 capítulo atual do trilho sobre amarelo | **resolvido** | atual em tinta (`fluxo/flow-1440-dialogo-limpar.png`, item 09) |
> | G11 halo de foco da frente ativa | **resolvido** | foco combinado com a barra em `.row-*` (axe e teclado: 0 paradas sem anel) |
> | S1 aviso de limite fora da tela | **resolvido** | `scrollIntoView({block:'nearest'})` |
> | S2 três níveis de superfície em M02 | **resolvido** | painel único |
> | S3 três selos "na pauta" | **resolvido** | `badge--agenda` único |
> | S4 dica parecendo botão | **resolvido** | dica removida, a linha tem toggle real |
> | S5 duas saídas em M06 | **resolvido** | uma saída (`Button link`) |
> | S6 tamanhos misturados em M07 | **resolvido** | link de 44 px e toggle de 48 px, papéis distintos e mesma linha de base |
> | S7 CTA de M09 antes da pauta | **resolvido** | fluxo: cartão acima do CTA abaixo de 1024 |
> | S8 setas desalinhadas em M09 | **resolvido** | x fixos (verificado no fluxo) |
> | S9 prioridades em pílula amarela | **resolvido** | etiqueta plana `--paper-strong` |
> | S10 campo de item livre comprimido | **resolvido** | largura total a 360; "Incluir" com altura igual à do campo (52) |
> | S11 hierarquia na mensagem longa | **resolvido** | "Copiar" vira primary e vem primeiro, mesmo `size` |
> | S12 rolagem aninhada na mensagem longa | **resolvido** | sem `max-height` em nenhuma largura; `scrollHeight` = `clientHeight` |
> | S13 medida longa | **resolvido** | `max-width: var(--measure)` |
> | S14 "Reiniciar" amarelo | **resolvido** | `Button variant="danger"` (tinta; hover magenta auxiliar) nos dois diálogos |
> | S14 véu sob o menu no mobile | **pendente** (opcional) | não implementado |
> | D. Não verificado (toque real, Safari/Firefox, leitor de tela, zoom real) | **pendente** | não há ferramenta nesta máquina |


- **Método:** skill `ui-ux-pro-max`, usando o checklist "Quick Reference" (prioridades 1–9: acessibilidade, toque, layout, tipografia, formulários, navegação). Os scripts de busca da skill (`scripts/search.py`, `data/`) estão vazios nesta instalação e não puderam ser executados.
- **Ambiente:** Vite dev em http://localhost:5173/?executivo=sabrina-ferreira, Chromium headless (Playwright Python).
- **Viewports:** 1440×900, 1024×768, 390×844 e 360×740.
- **Capturas e logs:** `…/scratchpad/audit-ux/` da sessão (cerca de 200 PNG, `{vw}-log.json` e `{vw}-kb.json`). Os scripts são `cap.py` (estados) e `kb.py` (teclado, contraste e medidas).
- **Estados exercitados:** hover, foco por teclado (90 paradas de Tab em 1440 e 390), seleção de 1, 2 e 3 prioridades (M02), campo empresa, toggle de frente e linhas do catálogo (M05), toggle de M06, acordeão e toggle de M07, pauta vazia e com 9 itens (M09), mensagem longa (M10), menu "Conteúdo" aberto, diálogo de reset, deep links #m01–#m10.
- **Escopo:** nenhum arquivo do projeto foi alterado além deste relatório. Copy e fatos não foram avaliados.

Legenda de prioridade: **Alta** quebra a compreensão ou o uso · **Média** gera inconsistência ou atrito perceptível · **Baixa** é polimento.

---

## A. Sistema global

### G1 · Alta: diálogos centrados abrem colados no canto superior esquerdo (≥768 px)
- **Onde:** diálogo "Reiniciar apresentação" (menu Conteúdo), provavelmente também "Limpar escolhas?" de M09. Ocorre em 1440×900 e 1024×768.
- **Evidência:** `dialog[open].getBoundingClientRect()` = `x:0, y:0, w:448` em 1440 e 1024 (`1440-reset-dialog.png`, `1024-reset-dialog.png`). Em 390 a folha inferior está correta (`y:611, w:390`).
- **Causa:** `global.css` aplica `* { margin: 0 }`, o que anula o `margin: auto` que o navegador usa para centralizar `<dialog>`. `Dialog.module.css` só redefine `margin` em `.side` (≥1024) e no mobile (`margin: auto 0 0`).
- **Arquivo:** `src/components/ui/Dialog.module.css`.
- **Correção:** acrescentar `margin: auto;` em `.dialog` (as regras de `.side` e do mobile continuam prevalecendo por ordem e especificidade). Verificar em 1440, 1024 e 768.

### G2 · Alta: "Adicionar à conversa" tem quatro aparências e o estado selecionado se inverte entre seções
Mesma função e mesmo rótulo, mas visual e semântica diferentes (medido no DOM em 1440):

| Seção | Componente | Não selecionado | Selecionado | Ícone | Altura |
|---|---|---|---|---|---|
| M05 frente | `.topicToggle` (custom) | contorno escuro, 16 px | **preenchido tinta** (`rgb(30,29,29)`) | + → ✓ | 46 |
| M05 catálogo | `.additionalRow` (linha) | linha transparente | faixa creme + barra amarela | + → ✓ | 64–73 |
| M06 | `Button primary sm` | **amarelo preenchido** | contorno claro (`ghost-dark`) | nenhum | 44 |
| M07 | `Button primary md` | **amarelo preenchido** | contorno escuro (`secondary`) | + → − | 53 |

- **Problema:** em M05, selecionar deixa o controle mais pesado (preenchido). Em M06 e M07, selecionar deixa o controle mais leve (contorno). O visitante que aprendeu o estado numa seção lê o oposto na seguinte. O ícone de estado também muda: ✓ em M05, − em M07 e nenhum em M06. Nenhum desses controles expõe `aria-pressed`; o estado vem só da troca de rótulo. M02 usa `aria-pressed` corretamente.
- **Arquivos:** `M05Ecossistema.tsx` (TopicToggle e AdditionalRow), `m05/M05Ecossistema.module.css`, `M06GestaoEmMovimento.tsx` (l. 155–162), `M07Aplicacoes.tsx` (l. 96–107).
- **Correção:** criar um componente único `TopicToggle` em `src/components/ui/` com variantes `light` e `dark`.
  - Não selecionado: contorno com ícone +.
  - Selecionado: preenchido tinta (ou branco no escuro) com ícone ✓ e rótulo "Remover da conversa".
  - `aria-pressed` permanece estável e o rótulo acessível é fixo ("Incluir na conversa: X"), ou se mantém a troca de rótulo, mas de forma igual em todos os usos.
  - Usar esse componente em M05, M06 e M07. A linha do catálogo pode manter o formato de linha, desde que use os mesmos tokens de estado.

### G3 · Alta: faixa creme + barra amarela de 6 px significa três coisas diferentes
- **Evidência (CSS):**
  - Selecionado: `M02 .option[aria-pressed='true']` e `M05 .additionalRow[data-selected='true']` (`background: --paper-strong; box-shadow: inset 6px 0 0 --cred-yellow`).
  - Aberto/ativo: `M05 .areaButton` ativo (`rgb(255,246,214)`, `1440-m05-toggle-selecionado.png`).
  - Destaque por prioridade, sem seleção: `M07 .item[data-highlighted]` (gradiente creme + `::before` amarelo de 6 px).
  - Além disso, `M07 .index` fica amarelo tanto em `data-highlighted` quanto em `data-selected`.
- **Efeito:** em M07, com a prioridade "Gestão e Tecnologia", eSocial e FAP/NTEP aparecem com o visual de "selecionado" sem que o visitante os tenha adicionado (`1440-m07-aberto-selecionado.png`).
- **Arquivos:** `m07/M07Aplicacoes.module.css` (l. 22–52) e `m05/M05Ecossistema.module.css`.
- **Correção:** reservar faixa + barra para "escolhido pelo visitante".
  - Prioridade: só o selo "Sua prioridade" (já existe), sem fundo nem barra.
  - Frente aberta em M05: fundo neutro (`--gray-100`) ou só o marcador preenchido.
  - Número amarelo de M07: apenas para `data-selected`.

### G4 · Média: "+ em círculo" é usado para cinco ações diferentes
- **Evidência:**
  - Selecionar prioridade: M02, círculo com contorno.
  - Expandir frente: M05 mobile, círculo com contorno, igual a M02 (`390-m05-toggle-selecionado.png`).
  - Adicionar serviço: M05 catálogo, círculo com contorno.
  - Expandir campo empresa: M02 `companyToggle`, contorno ±.
  - Expandir lista: disco amarelo em "Ver serviços (7)" de M05, acordeão de M06/M03 (`.marker` amarelo de 32 px) e a dica não interativa de M05 (ver S5).
- **Arquivos:** `m02/…css`, `m05/…css`, `ui/Accordion.module.css`.
- **Correção:** separar a família de ícones.
  - Expandir/recolher: chevron ⌄/⌃, ou o +/− do `Accordion`, sempre no mesmo disco.
  - Selecionar ou adicionar: + → ✓ no padrão de G2.
  - Na lista de áreas de M05 no mobile, trocar o + pelo chevron, que é o que o desktop já usa (›).

### G5 · Média: campos de formulário com borda abaixo de 3:1 e estilos divergentes
- **Contraste da borda** (WCAG 1.4.11, mínimo 3:1):
  - `--gray-400` sobre branco: **2,46:1** (M02 empresa, M09 item livre).
  - `--gray-200` sobre `--paper`: **1,26:1** (M10 textarea, quase invisível em repouso).
- **Divergência entre os três campos:**

| Campo | Raio | Fundo | Borda | Altura 1440 / 390 |
|---|---|---|---|---|
| M02 input | 6 px | branco | gray-400 | 57 / 52 |
| M09 input | 12 px | branco | gray-400 | 57 / 52 |
| M10 textarea | 12 px | paper (vira branco no foco) | gray-200 | — |

- **Arquivos:** `m02/M02Prioridades.module.css` (`.input`), `m09/M09Pauta.module.css` (`.input`), `m10/M10Continuidade.module.css` (`.textarea`).
- **Correção:** criar tokens de campo em `tokens.css`, por exemplo `--field-border: var(--gray-600)` (cerca de 6,9:1), `--field-radius: var(--radius-md)` e `--field-bg: var(--cred-white)`. Aplicar em uma classe compartilhada (`ui/Field.module.css`) usada pelos três campos.

### G6 · Média: hover quase imperceptível nos controles de lista
- **Evidência:** o hover de `M02 .option` troca branco por `--paper`, com contraste de **1,03:1** entre as cores, e o ícone não muda (`1440-m02-hover.png`). O hover de `M05 .additionalRow` também usa `--paper` sobre branco; só o disco do ícone fica amarelo. `--paper-strong` contra branco dá 1,08:1.
- **Correção:** no hover, aplicar `--gray-100` (ou `--paper-strong`) e, no ícone, borda e fundo amarelos, como já ocorre em `.additionalRow:hover .additionalIcon`. Acrescentar `:active` (por exemplo `transform: translateY(1px)` ou fundo um tom mais escuro) em `.option`, `.areaButton`, `.additionalRow` e `.topicToggle`. Hoje só `Button` tem `:active`.

### G7 · Média: contador da pauta sem rótulo no mobile
- **Evidência:** abaixo de 439 px, `.agendaFull` fica oculto e o visível é "○ 0" (alvo de 44×44, `390-00-top.png`). Ao lado do botão "Conteúdo", o número isolado não comunica "Sua pauta".
- **Arquivo:** `src/app/App.module.css` (`.agendaShort`/`.agendaFull`).
- **Correção:** manter uma palavra curta visível ("Pauta 0") entre 360 e 439 px. Alternativa: ícone de lista + número, com rótulo visível pelo menos quando `count > 0`. Conferir a largura em 360, onde A1 de `achados-funcionais` já apontou 5 px de overflow com 2 dígitos.

### G8 · Baixa: seis padrões de "mostrar mais"
- **Inventário:**
  - M02 `companyToggle`: link sublinhado + círculo ±.
  - M03: `Button ghost-dark` "Conhecer a estrutura" com −.
  - M04: `Button secondary` "Ver outras empresas".
  - M05: link "Ver serviços (7)" com disco amarelo.
  - M06: `<details>`/`Accordion` "Explorar recursos de tecnologia" com disco de 32 px.
  - M07: `Button link` "Conhecer a solução ⌄" que vira "Fechar ⌃".
- **Correção:** reduzir a dois padrões.
  1. `Accordion` para blocos de lista (M03, M04, M06).
  2. Link + chevron para detalhe inline (M02, M05, M07).

  Assim, botões em pílula ficam reservados para ações, não para revelar conteúdo.

### G9 · Baixa: textos abaixo de 16 px fora da escala
- **Evidência:**
  - Selo "Sua prioridade" com **14 px** em M03 e M05 (o de M07 tem 16 px).
  - `.railNum` com 12 px.
  - `.railLabel` e "você está aqui" com 13 px.
  - Eyebrows com 15 px (é token, aceitável).
- **Correção:** fixar os selos em `--fs-small` (16 px) e `.here` em 15 px no mínimo. No trilho, os 12 px valem só se o número também for anunciado pelo rótulo, o que já ocorre.

### G10 · Baixa: capítulo atual do trilho some sobre fundo amarelo
- **Evidência:** em M09 (`surface="yellow"`), `.railItem[data-current] .railNum` usa fundo `--cred-yellow` sobre o amarelo da seção. A diferença fica só na borda de 1 px (`1440-m09-vazia.png`, item 09).
- **Arquivo:** `ui/ChapterNavigation.module.css`.
- **Correção:** com o capítulo atual sobre amarelo, aplicar fundo `--cred-ink` e texto `--cred-yellow`. Uma alternativa é usar sempre tinta para o atual.

### G11 · Baixa: foco da frente ativa de M05 perde o halo
- **Evidência:** com foco por Tab em "01 Saúde Ocupacional" (aberta), `box-shadow` vale `rgb(255,202,0) 6px 0 0 0`, porque a barra inset do estado ativo substitui o halo de 8 px do `:focus-visible` global. O contorno de 3 px permanece.
- **Correção:** fazer o halo de foco usar `outline` duplo ou `::after`, não `box-shadow`. Outra opção é combinar as sombras em `.areaButton:focus-visible`.

### Verificado sem problema
- Nenhum deep link #m01–#m10 deixa o título sob o header: o topo da seção fica em 64 e o título em 230 (1440) ou 168 (390).
- Sem rolagem horizontal nas quatro larguras.
- As 59 (1440) e 55 (390) paradas de Tab têm contorno de 3 px visível.
- Todos os alvos interativos de `main` medem ≥44 px.
- O painel "Conteúdo" (565 px) cabe em 740.
- A folha de reset no mobile está correta, com foco inicial em "Fechar".

---

## B. Por seção

### S1 · M02 · Média: aviso de limite aparece fora da tela
- **Estado:** com duas prioridades escolhidas, o visitante toca na quarta opção ("Treinamentos"), a última da lista.
- **Evidência:** o botão clicado ocupa `top 823–900` em 1440×900, e o aviso começa em `top 900` (`bottom 952`). Em 390×844, botão em `767–844` e aviso em `844`. O toque parece não ter efeito, porque nada muda na área visível (`1440-m02-limite.png`).
- **Arquivo:** `M02Prioridades.tsx` e `m02/…css` (`.feedback`).
- **Correção** (qualquer uma serve):
  - Rolar com `scrollIntoView({block:'nearest'})` até o aviso apenas nesse caso. docs/03 proíbe mover a página "inesperadamente", mas aqui a rolagem é consequência direta do toque.
  - Ou mostrar o aviso acima da lista, junto de "Você pode escolher até duas prioridades".
  - Ou, com duas escolhidas, atenuar visualmente as não escolhidas (ícone + em `--gray-400`, sem `disabled`), mantendo o aviso.

### S2 · M02 · Baixa: campo empresa dentro de um cartão dentro de outro cartão
- **Evidência:** o toggle está em x=17 e o rótulo e o campo em x=33 (390). O campo fica num cartão branco dentro do cartão creme (`1440-m02-empresa.png`). São três níveis de superfície para um campo opcional.
- **Correção:** remover fundo e padding do contêiner interno e alinhar rótulo e campo ao eixo do toggle (x=17).

### S3 · M05 · Média: frentes, catálogo e selos usam estados diferentes do resto da página
Ver G2, G3 e G4. Há ainda três indicadores de "já está na pauta":
- "✓ Na pauta" (M05, texto sem borda);
- "● Na pauta" (M07, pílula com contorno);
- "PAUTA / Gestão e Tecnologia" (M06, rótulo de bloco).

**Correção:** criar um selo único `InAgendaBadge` (ícone ✓ + "Na pauta", estilo de M05) e usá-lo em M05, M06 e M07.

### S4 · M05 · Média: dica não clicável parece botão
- **Evidência:** em "Outras necessidades da operação", o `<p class="additionalHint">` "+ Adicionar à conversa" tem disco amarelo e texto em negrito, igual a um controle, mas tem `cursor:auto` e não tem role (`1440-m05-toggle-selecionado.png`, canto inferior esquerdo).
- **Correção:** sem mudar o texto, tirar o disco preenchido e o negrito. Usar texto `--color-text-muted` e o ícone + inline no tamanho do texto, como legenda.

### S5 · M06 · Baixa: duas saídas "Ir para aplicações" com estilos diferentes no desktop
- **Evidência:** `Button ghost-dark sm` "Ir para aplicações ↓" (y=6231, 189×44) e `.exitLink` "Ir para aplicações" (y=7005, 122×44, 16 px sublinhado). No mobile só existe a primeira.
- **Correção:** manter as duas (docs/04 pede saída do trecho sticky), mas com o mesmo componente (`Button variant="link"` + ↓) para que sejam lidas como a mesma ação.

### S6 · M07 · Baixa: a mesma linha mistura dois tamanhos de botão
- **Evidência:** "Conhecer a solução" é `link md` (44 px) e "Adicionar à conversa" é `primary md` (53 px), com alinhamento vertical correto. O destaque de prioridade se confunde com seleção (ver G3).

### S7 · M09 · Média: no mobile, o CTA aparece antes da pauta
- **Evidência:** em 360×740 e 390×844, "Preparar a conversa" e "Explorar mais soluções" ficam acima do cartão "Pauta de conversa". O cartão só começa em y≈680 de 740 (`360-m09-cheia-a.png`). O visitante é convidado a seguir antes de revisar o que montou.
- **Arquivo:** `m09/M09Pauta.module.css` (grid/ordem abaixo de 1024).
- **Correção:** abaixo de 1024, usar `order` para colocar `.ctaRow` depois do cartão, ou repetir o CTA no fim do cartão.

### S8 · M09 · Média: colunas de ação desalinhadas na lista
- **Evidência:** nos itens sem "Editar" (frentes e serviços), ↑ está em x=1172 e ↓ em x=1220. Nos itens livres, com o lápis, ↑ fica em x=1124 e ↓ em x=1172 (`1440-m09-cheia-b.png`). As setas pulam 48 px de uma linha para outra.
- **Arquivo:** `m09/AgendaList.tsx` e `m09/M09Pauta.module.css`.
- **Correção:** usar uma grade fixa de quatro colunas de 44 px (↑ ↓ ✎ ✕) e reservar a célula do lápis vazia, com `visibility:hidden` ou um espaçador, nos itens não editáveis.

### S9 · M09 · Média: prioridades em pílula amarela parecem botões
- **Evidência:** "Saúde Ocupacional" e "Gestão e Tecnologia" em M09 usam pílula amarela, grande e em negrito, com a mesma linguagem do `Button primary`. Não são interativas.
- **Correção:** usar etiqueta plana (`--paper-strong`, `--radius-sm`, texto 16–17 px bold, sem forma de pílula), ou transformá-las em links para M02 (o que dispensaria "Editar prioridades").

### S10 · M09 · Baixa: campo do item livre comprimido no mobile
- **Evidência:** em 360 o input fica em x=65, com 230 px de largura (64 % da tela), por causa de três níveis de padding (seção, cartão branco e `.addForm` creme). O placeholder aparece cortado: "Escreva um assunto para a c". "Incluir" quebra para baixo, alinhado à esquerda.
- **Correção:** abaixo de 480, zerar o padding lateral de `.addForm` (ou o fundo creme) e deixar "Incluir" com `block` ou na mesma linha com o input em `flex:1`.

### S11 · M10 · Média: hierarquia de ações não acompanha o estado de mensagem longa
- **Evidência:** com a mensagem longa, aparece o aviso "Copie o texto…", mas "Preparar e-mail para Sabrina" continua `primary lg` (404×66), abre o e-mail sem corpo e é a ação dominante. "Copiar mensagem", o passo necessário, segue `secondary md` (210×53). As duas alturas (66 e 53) dividem a mesma linha, e os topos ficam desalinhados (y 14484 contra 14490) (`1440-m10-longa-b.png`).
- **Arquivo:** `M10Continuidade.tsx` e `m10/M10Continuidade.module.css`.
- **Correção:**
  - No estado longo, "Copiar mensagem" passa a `primary` e fica primeiro; "Preparar e-mail" passa a `secondary`.
  - Em todos os estados, usar o mesmo `size` para as ações da mesma linha.

### S12 · M10 · Média: rolagem aninhada na mensagem longa
- **Evidência:** a textarea tem `max-height: 512px`. Com o texto longo, `scrollHeight` vale 974 contra `clientHeight` 508 em 1440, 1591 contra 508 em 390 e 1777 contra 508 em 360. No celular, um campo rolável de 512 px dentro da página rolável prende o gesto (skill: `scroll-behavior`, sem regiões de rolagem aninhadas).
- **Correção:** abaixo de 768, remover `max-height` (crescimento automático, `field-sizing: content` com fallback em JS que já ajusta a altura) ou limitá-la a cerca de `60svh` com indicação visual de rolagem.

### S13 · M10 · Baixa: medida longa e controle redundante
- **Evidência:** os textos de apoio "Revise e ajuste…" e "Os botões abrem…" têm 665 px a 16 px (≈83 caracteres por linha), acima de 75. "Editar mensagem" só foca uma textarea que já é editável (`readOnly:false`), mas a aparência sugere troca de modo.
- **Correção:** aplicar `max-width: var(--measure)` a `.hint` e ao rodapé de ações. Para "Editar mensagem", manter o comportamento e alinhar o link à base do título; não é preciso mudar o rótulo, que é copy.

### S14 · Menu e diálogo · Baixa
- O menu "Conteúdo" (390 e 360) funciona: 10 itens de 44 px e "Reiniciar" separado por régua. Não há scrim, então a página continua legível dos lados (19 px). Recomendo um véu leve (`rgb(30 29 29 / .2)`) só abaixo de 768, para indicar que o toque fora fecha o menu.
- No diálogo de reset, a ação destrutiva "Reiniciar" usa o amarelo primário, e o foco inicial vai para "Fechar" (correto). A skill recomenda destacar ações destrutivas de forma diferente das primárias. Uma opção dentro da marca é "Reiniciar" em tinta preenchida, deixando o amarelo para ações de avanço.

---

## C. Ordem sugerida de correção
1. G1 (diálogo), 1 linha de CSS.
2. G2, G3 e S3: componente único de toggle e selo, mais a semântica da faixa amarela.
3. S1, S7, S8, S11 e S12: fluxo de escolha, pauta e envio.
4. G4, G5, G6 e G7: ícones, campos, hover e contador.
5. Itens baixos.

## D. Não verificado
Toque real (iOS/Android), Safari e Firefox, leitor de tela, zoom real do navegador, `prefers-reduced-motion` com inspeção visual, tema escuro do sistema (o site não tem tema escuro) e o diálogo "Limpar escolhas?" de M09, cujo descentramento foi inferido pelo mesmo CSS e não foi capturado.
