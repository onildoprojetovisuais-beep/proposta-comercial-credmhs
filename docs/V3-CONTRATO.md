# Contrato V3 — reformulação a partir do PPT da Sabrina (20/10/2026)

**Autoridade:** `docs/CRED-MHS-Apresentacao-Comercial.pptx` (11 slides) + pedido do Nil de 20/10/2026.
Prevalece sobre `REVISAO-CRED-MHS-V2.md`, `V2-CONTRATO.md` e documentos 00–07 quando houver conflito.

> “O raciocínio e a comunicação são as que colocamos. Favor não alterar o que está escrito.” — Sabrina

- O PPT orienta **conteúdo, sequência e seleção de marcas**. A aparência dele **não** é direção aprovada.
- A expressão visual é autoral (Pixel Rain), com a liberdade do projeto VIVA. `assets/referencia.jpg` inspira relação foto/tipografia/gráfico/planos de cor — sem copiar alvos, engrenagens, círculos com ícones, fundos escuros recorrentes ou caixas em excesso.
- V2 arquivada em `historico/v2-antes-da-v3-2026-10-20.tar.gz`.

## Referências extraídas (não servidas)

`docs/v3-referencia/`: `slides/slide-N.png` (render 1920×1080 pelo PowerPoint), `media/` (imagens incorporadas), `slides-xml/` (XML dos slides), `ppt-texto-extraido.txt`.
O PPT não tem notas de orador nem comentários (notas vazias). O slide 10 mostra “1 / 3”, mas só tem 8 logos incorporados.

## Mapeamento slide → seção

> **Rodada 21/10/2026:** o slide 3 virou duas seções (`quem-somos` e `missao-visao-valores`); o slide 9 tem sete frentes. A tabela abaixo descreve a V3 de 20/10; as mudanças estão em `docs/V3-ALTERACOES-TEXTO.md` (topo) e `docs/STATUS-IMPLEMENTACAO.md`.

| Slide | Seção (`id`) | Texto (fonte: `src/content/chapters.ts`) | Ativos | Ajuste autorizado |
|---|---|---|---|---|
| 1 | `abertura` | “Olá, sou {firstName}.” + 2 parágrafos; nome, cargo · CRED MHS | foto do executivo (perfil) | CTA “Saiba mais” → `#provocacao` |
| 2 | `provocacao` | pergunta, apoio, “É aí que começa a **nossa conversa.**” | — | nenhum |
| 3 | `quem-somos` | intro, “Quem somos.”, 35 anos, história, 3 atributos, missão, visão, 4 valores | fotos Barra (`09.43.21`, `09.43.23`, `09.43.22`) e Centro (`09.43.18`, `09.43.17`) | nenhum (composição com atenção especial) |
| 4 | `atuacao-integrada` | eyebrow, “Uma atuação **integrada.**”, corpo, frase do executivo | — | diagrama: cliente com acesso direto à operação; executivo acompanha o todo, sem ser passagem |
| 5 | `alcance` | “Rede própria Barra · Centro”, título, +550 mil vidas, +5 mil clientes | mapa (Remotion, geometria IBGE) + símbolos de presença do PPT | mapa animado |
| 6 | `depoimentos` | eyebrow, título; **sem depoimentos** | — | estrutura pronta; oculta ao cliente, visível em `?revisao=1` |
| 7 | `satisfacao` | pergunta, 99,4% (provisório), nota CSAT | — | oculta ao cliente enquanto `status: 'provisorio'`; visível em `?revisao=1` com aviso |
| 8 | `transicao` | lead + “Como entregamos … para a **sua empresa?**” | — | nenhum |
| 9 | `frentes` | eyebrow, título, centro, seis frentes + transversal | — | A–G (ver `docs/V3-ALTERACOES-TEXTO.md`) |
| 10 | `empresas` | eyebrow, título | 8 logos do PPT + Fairmont (`assets/clients/fairmont-logo.jpeg`) | carrossel; Fairmont incluída |
| 11 | `contato` | título, corpo, etapas, contatos do executivo | foto do executivo | remover “Dar o primeiro passo”; “Aprofundar na sua demanda” antes de “Detalhar o escopo” |

Fotos por unidade: no slide 3, o rótulo “Unidade Barra” fica junto das fotos `image-3-4`/`3-5` (= `09.43.21`/`09.43.23`) e “Unidade Centro” junto de `image-3-6`/`3-7` (= `09.43.18`/`09.43.17`). A atribuição vem dessa proximidade no layout, não de uma legenda explícita; `09.43.22` é a mesma fachada de `09.43.21`. Pendente de confirmação da CRED (P53).

Caixa alta do PPT = tratamento tipográfico; a copy guarda caixa normal e o CSS pode aplicar `text-transform`.

## Modo de revisão

`?revisao=1` (combina com `?executivo=`) → `isReviewMode()` em `src/lib/reviewMode.ts`. Mostra `depoimentos` e `satisfacao` com avisos internos de pendência. O link do cliente **nunca** mostra esses avisos nem essas seções enquanto pendentes. `REVIEW_MODE` e `CHAPTER_IDS`/`CHAPTER_INDEX` em `src/app/chapterIndex.ts` já filtram as seções.

## Proibido na página pública

Selos 3C/3I; trilha Normativo → Reputacional → Gestão → Inovação → Investimento; diagrama dos quatro eixos; menu “Conteúdo”; prioridades, pauta, seleção de serviços, formulários; textos antigos da V2; NPS no lugar de CSAT; “sede”; gráficos que comparem vidas/clientes/unidades; dados, evoluções ou percentuais inventados; depoimentos, nomes, cargos ou telas inventados; avisos internos fora do modo de revisão; slides como imagem de fundo.

## Preservado

Personalização por `?executivo=` (foto, nome, cargo, contatos), `PresentationRoot`, `ExecutiveContext`, `contactLinks`, painel `/painel/`, Supabase, acesso público sem login, contatos acionados pelo visitante, `historico/`.

## Responsáveis e arquivos exclusivos

| Responsável | Arquivos (só ele edita) |
|---|---|
| **Coordenador** | `src/types/**`, `src/lib/**` (inclui `reviewMode.ts`, `__checks__.ts`), `src/state/**`, `src/app/PresentationRoot.tsx`, `src/app/chapterIndex.ts`, `src/painel/**`, `CLAUDE.md`, `docs/V3-CONTRATO.md`, `docs/STATUS-IMPLEMENTACAO.md`, `qa/RELATORIO.md`, `package.json` |
| **Conteúdo** | `src/content/chapters.ts` (só **valores** de texto; forma é do coordenador), `src/content/executives.ts` (só comentários), `docs/V3-ALTERACOES-TEXTO.md`, `docs/V3-FIDELIDADE-TEXTO.md`, `docs/07-fontes-e-pendencias.md`, marcação de superado em `docs/00`–`06`, `REVISAO-CRED-MHS-V2.md`, `V2-CONTRATO.md`, `STACK.md` |
| **Visual** | `src/app/App.tsx`, `src/app/App.module.css`, `src/app/useCurrentChapter.ts`, `src/app/mediaManifest.ts`, `src/components/ui/**`, `src/components/sections/v3/**` **exceto** `Empresas.*`, `src/styles/**`, `public/media/fotos/**`, `index.html`, `docs/V3-FOTOS.md` |
| **Motion** | `src/motion/map/**`, `remotion/**`, `public/media/mapa/**`, `docs/V3-MAPA.md` |
| **Marcas** | `src/content/clients.ts`, `src/components/sections/v3/Empresas.tsx`, `Empresas.module.css`, `public/media/clientes/**`, `docs/V3-LOGOS.md` |

Precisou de algo fora dos seus arquivos? Peça ao coordenador no relatório final; não edite.

## Interfaces entre agentes

- **Mapa** — `src/motion/map/BrazilMap.tsx`, export nomeado `BrazilMap`:
  `export function BrazilMap(props: { className?: string }): JSX.Element`.
  Autocontido: player Remotion carregado sob demanda, reprodução única ao entrar na tela, controles discretos (pausar/continuar, repetir), versão estática completa em `prefers-reduced-motion`, rótulo “Rede própria — Barra · Centro” em HTML, nome acessível de `copy.alcance.map`. Ocupa 100% da largura do contêiner com proporção própria. Desenhado para **fundo amarelo** (`--cred-yellow`). A seção `Alcance.tsx` (Visual) só posiciona o componente.
- **Empresas** — `src/components/sections/v3/Empresas.tsx`, export **default** `Empresas` (sem props), renderiza o `<section id="empresas">` completo via `SectionShell` (superfície branca). Textos de `copy.empresas`; logos de `clientLogos`.
- **Seções do Visual** — `src/components/sections/v3/<Nome>.tsx`, export default, sem props: `Abertura`, `Provocacao`, `QuemSomos`, `AtuacaoIntegrada`, `Alcance`, `Depoimentos`, `Satisfacao`, `Transicao`, `Frentes`, `Contato`. `App.tsx` renderiza só as seções de `CHAPTER_IDS` (a visibilidade já considera o modo de revisão).
- **Estilo global** — tokens de `src/styles/tokens.css` (Visual). Motion e Marcas usam só tokens existentes (`--cred-yellow`, `--cred-ink`, `--cred-white`, `--font-*`, espaçamentos) e CSS Modules próprios.

## Recursos da máquina

O computador já travou com carga alta. Regras para todos:
- Um único servidor Vite já está rodando em `http://localhost:5173/` (o coordenador cuida). **Não** inicie outro servidor nem `vite build`.
- Typecheck permitido: `npx tsc -p tsconfig.json --noEmit` (no máximo a cada lote de mudanças).
- Capturas: `node "<scratchpad>/tools/shot.mjs" <url> <saida.png> [w] [h] [--full] [--reduced] [--wait=ms] [--selector=#id]` — abre e fecha um Chromium por vez. Não rode várias em paralelo.
- Remotion: só `remotion still`/render com `--concurrency=1`, apenas o necessário.
- Builds completos e renders pesados ficam com o coordenador, em sequência.
