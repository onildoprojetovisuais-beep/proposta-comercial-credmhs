# V3 — Logos de “Empresas que caminham com a gente” (slide 10)

Dono: agente de Marcas · 20/10/2026. Dados: `src/content/clients.ts`. Componente:
`src/components/sections/v3/Empresas.tsx` + `Empresas.module.css`. Arquivos servidos:
`public/media/clientes/`.

## Seleção

A seleção é a do slide 10 do PPT da Sabrina (8 logos incorporados) + Fairmont Rio de Janeiro
Copacabana (pedido expresso da Sabrina). As ~40 marcas antigas de `public/media/pptx/clientes/`
(apresentação V1) **não** entram: não estão no slide 10.

Correspondência arquivo → marca conferida abrindo cada imagem e pelas posições no
`slides-xml/slide10.xml` (`rId1…rId8` → `image-10-1…8`; grade 4 × 2, linha de cima da esquerda
para a direita, depois a de baixo), batendo com o render `slides/slide-10.png`.

| # | Origem | Marca | Tratamento | Arquivo final | Px finais | Qualidade / pendência |
|---|---|---|---|---|---|---|
| 1 | `docs/v3-referencia/media/image-10-1.png` (230×148, paleta, fundo branco) | VIA Group | trim da margem branca (+2 px) | `via-group.png` | 126×56 | baixa resolução; exibido a até ≈1,07× (1440) → ok em 1×, macio em tela retina |
| 2 | `image-10-2.png` (161×148) | CSN | trim (+2 px) | `csn.png` | 147×46 | exibido a até ≈1,24× → macio em retina |
| 3 | `image-10-3.png` (225×225) | CAIXA | trim (+2 px) | `caixa.png` | 207×67 | suficiente em 1×; retina pede ≈2× |
| 4 | `image-10-4.png` (300×77) | Sotreq CAT | sem corte (a arte ocupa o arquivo inteiro, incluindo o fio claro do bloco) | `sotreq-cat.png` | 300×77 | suficiente em 1× |
| 5 | `image-10-5.png` (301×167) | Grand Hyatt | trim (+2 px) | `grand-hyatt.png` | 299×73 | suficiente em 1× |
| 6 | `image-10-6.png` (162×148) | Unicred | trim (+2 px) | `unicred.png` | 147×26 | **a mais fraca**: exibida a até ≈1,45× em 1440 → visivelmente macia; prioridade no pedido de vetor |
| 7 | `image-10-7.png` (275×183) | Grupo Iter | trim (+2 px) | `grupo-iter.png` | 243×55 | suficiente em 1× |
| 8 | `image-10-8.png` (200×200) | Aspen Pharma | trim (+2 px) | `aspen-pharma.png` | 198×70 | suficiente em 1× |
| 9 | `assets/clients/fairmont-logo.jpeg` (1600×704, JPEG, fundo branco) | Fairmont Rio de Janeiro Copacabana | trim (+6 px), redução para 800 px de largura (Lanczos), fundo removido por luminância → PNG cinza + alfa | `fairmont-rio-copacabana.png` | 800×271 | boa (≥3× do tamanho exibido). Arte 100% monocromática (saturação máxima 0), por isso a remoção do fundo é exata: tinta preta com alfa = 255 − luminância, pixels ≥ 250 viram transparentes (limpa o ruído do JPEG), sem halo |

Regras seguidas: nenhuma marca foi redesenhada, recolorida, vetorizada ou ampliada no arquivo;
só margens brancas excedentes foram cortadas. Os 8 do PPT mantêm o fundo branco opaco original
(a seção é branca `#fff`, idêntica ao fundo) — remover o branco de artes coloridas com
antisserrilhado arriscaria halo. PNGs paletizados (256 cores, sem pontilhamento), 1,3–5,3 KB cada;
Fairmont 35 KB.

Versões alternativas avaliadas e **descartadas** (não são a mesma arte ou não são melhores):
`public/media/pptx/clientes/caixa.png` (versão em cinza), `grupo-iter.png` (362×125, tom cinza
diferente do preto do slide), `grupo-sotreq.png` (outra assinatura, sem CAT), `hyatt.png`
(“HYATT” branco sobre cinza, não “Grand Hyatt”), `csn.png`/`unicred.png` (mesmo tamanho e arte
do slide, sem ganho), `fairmont-copacabana.png` (345×152, inferior ao JPEG). Nenhum logo foi
baixado da internet.

Scripts (fora do projeto): `scratchpad/logos/process.py` (tratamento), `scratchpad/tools/empresas-test.mjs`
e `swipe-test.mjs` (verificação).

## Ordem

Ordem do slide 10: VIA Group, CSN, CAIXA, Sotreq CAT, Grand Hyatt, Unicred, Grupo Iter, Aspen
Pharma — e **Fairmont ao fim**. Decisão: não alterar a sequência montada pela Sabrina; com 4 por
vista no desktop, a última vista mostra Unicred · Grupo Iter · Aspen · Fairmont (sem marca
sozinha). Se preferirem os hotéis juntos, basta mover o item para depois de Grand Hyatt em
`clients.ts`.

## Equilíbrio óptico

Altura de cada logo = `--logo-base` × fator. Fator = √(3 ÷ proporção) × `optical`, limitado a
0,6–1,25 (`Empresas.tsx`). A raiz quadrada iguala a **área** aparente (marcas muito horizontais
ficam mais baixas, compactas mais altas); `optical` corrige o peso:

| Marca | optical | motivo |
|---|---|---|
| VIA Group | 0,88 | traço pesado e compacto |
| CSN, CAIXA | 1 | referência |
| Sotreq CAT | 0,92 | bloco de cor cheia pesa mais |
| Grand Hyatt | 0,93 | bloco de cor cheia |
| Unicred | 0,88 | muito alongada; também evita ampliar demais um arquivo de 26 px |
| Grupo Iter | 1,08 | traço fino |
| Aspen Pharma | 0,96 | símbolo circular denso |
| Fairmont | 1,15 | script fino e subtítulo pequeno |

`--logo-base`: 38 px (390) → 59 px (1440). Conferido em `qa/capturas/v3/marcas/empresas-equilibrio-todas.png`
(todas as marcas lado a lado) e nas capturas por largura.

## Comportamento do carrossel

- Rolagem horizontal **nativa** com `scroll-snap` (deslize por toque nativo, sem gesto customizado).
- Marcas por vista: 1,45 (< 480, a seguinte aparece cortada para convidar ao deslize), 2 (480–639),
  3 (640–1199), 4 (≥ 1200).
- Setas rolam uma página (marcas inteiras visíveis). **Pontas sem volta**: a seta da ponta fica
  `aria-disabled` (continua focável, para o foco não se perder) e visualmente inativa — o
  visitante sabe que viu todas.
- Teclado: Tab chega à faixa (foco visível) e às duas setas; na faixa, ← → andam uma marca,
  PageUp/PageDown uma página, Home/End vão às pontas.
- Contador `{current} / {total}` (de `copy.empresas.counterTemplate`) por página; decorativo
  (`aria-hidden`) — a lista já expõe todas as marcas ao leitor de tela. Linha de base cinza com
  marcador amarelo mostra a parte visível.
- Semântica: `div role="region" aria-roledescription="carrossel" aria-label=<título>` → `ul role="list"`
  (rótulo com o total de marcas) → `li` → `img alt=<nome da empresa>`. Sem avanço automático,
  sem loop, sem itens duplicados, sem textos de case.
- `prefers-reduced-motion`: rolagem instantânea, sem transições.
- Se todas as marcas couberem (não acontece hoje), contador e setas somem.

## Pendências

1. **Arquivos vetoriais** (SVG/PDF/AI) ou PNG ≥ 600 px de largura das 8 marcas do PPT — pedir à
   CRED. Os arquivos incorporados no PPT têm 126–300 px úteis; em telas retina ficam macios,
   Unicred e CSN mais que as outras.
2. **“1 / 3” no slide 10**: o PPT sugere três páginas de logos, mas só tem 8 incorporados (uma
   página). Há mais marcas a enviar? Se houver, entram em `clients.ts` + `public/media/clientes/`
   sem mudar o componente. (Na web, com 9 marcas, o contador mostra 1 / 3 no desktop por
   coincidência de paginação — não é a paginação do PPT.)
3. Autorização de uso das marcas como referência comercial: não verificada por este agente
   (responsabilidade da CRED).

## Rodada 23/10

Pedido: retirar VIA Group e CSN (arquivos removidos de `public/media/clientes/`) e incluir FFA, Grupo
Ombrello, Radix, CIMED, Trigo, BMG, Cimento Nacional, Orguel, Minalba, Rede Manaus, Hotel Nacional,
Hotel Santa Teresa e Dom Atacadista, a partir de `assets/clients/` (JPEGs do WhatsApp, 22/10).

| Marca | Arquivo de origem | Tratamento | Final | optical |
|---|---|---|---|---|
| Radix | `… 19.46.09 (11).jpeg` (200×101) | sem corte útil | `radix.png` 200×101 | 0,95 |
| CIMED | `… 19.46.09.jpeg` (257×141) | nenhum (o bloco amarelo é a marca) | `cimed.png` | 0,92 |
| BMG | `… (6).jpeg` (300×168, fundo cinza-claro) | fundo cinza → branco (preenchimento a partir dos cantos), trim | `bmg.png` 153×88 | 0,95 |
| Orguel | `… (4).jpeg` (1248×370, fundo cinza-claro) | fundo → branco, trim | `orguel.png` 1048×194 | 0,95 |
| Minalba | `… (12).jpeg` (300×168) | trim | `minalba.png` 150×50 | 1,05 — **baixa resolução**, macia em retina |
| Hotel Nacional | `… (1).jpeg` (225×225, “HN”) | trim | `hotel-nacional.png` 185×144 | 0,82 — **confirmar** que “HN” é a marca do Hotel Nacional |
| Dom Atacadista | `… (2).jpeg` (225×225) | nenhum (bloco azul é a marca) | `dom-atacadista.png` | 0,85 |

Ordem: as 7 marcas mantidas do PPT + Fairmont, depois as novas na ordem do pedido. Total: 15.
Processamento: `scratchpad/logos/process-2310.py` (sessão de 23/10; fora do projeto). Nenhum logo baixado da internet.

**Pendente em 23/10 (resolvido em 26/10, ver abaixo) — pedidas, sem arquivo:** FFA, Grupo Ombrello, Trigo, Cimento
Nacional, Rede Manaus, Hotel Santa Teresa.

**Na pasta, mas fora do pedido (não publicadas):** Somov, Nacional Gás (não é Cimento Nacional),
Art-Latex, Radisson, Hotel Laghetto Stilo, Hyatt Place Macaé.

## Rodada 26/10 — marcas que faltavam

Arquivos novos em `assets/clients/` (26/10). Processamento: `scratchpad/logos26/process-2610.py`
(sessão de 26/10; fora do projeto). Ordem na página: as 7 do PPT + Fairmont, depois as 13 do pedido,
na ordem em que foram pedidas. Total: **20**.

| Marca | Arquivo de origem | Tratamento | Final | optical |
|---|---|---|---|---|
| FFA (Ferrareze & Freitas Advogados) | `LOGO FFA.pdf` (vetorial) | renderizado a 200 dpi, trim, reduzido a 800 px | `ffa.png` 800×436 | 1,1 |
| Grupo Ombrello | `Ombrello.jpeg` (371×64) | fundo cinza-claro → branco | `grupo-ombrello.png` 371×64 | 0,9 — **símbolo e “O” final parecem cortados na borda do arquivo; pedir versão completa** |
| Trigo | `trigo .jpeg` (637×349) | barra escura da borda esquerda retirada, trim | `trigo.png` 509×117 | 1 |
| Cimento Nacional | `cimento nacional.jpeg` (616×409) | trim | `cimento-nacional.png` 579×311 | 1 |
| Rede Manaus | `rede manaus.jpeg` (627×396) | trim | `rede-manaus.png` 552×211 | 0,85 |
| Hotel Nacional | `HN - Hotel Nacional.jpeg` (349×137) | trim; **substitui** o “HN” isolado de 23/10 (pendência de confirmação resolvida) | `hotel-nacional.png` 349×137 | 1,05 |
| Hotel Santa Teresa | `hotel santa teresa.jpeg` (1600×1130) | fundo cinza-claro → branco, trim, reduzido a 800 px | `hotel-santa-teresa.png` 800×583 | 1,25 |

Pedido de 23/10 completo: as 13 marcas estão publicadas. Segue pendente só a Minalba em baixa resolução
e o arquivo completo do Ombrello.
