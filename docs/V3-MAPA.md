# V3 — Mapa do Brasil da seção Alcance (slide 5)

Responsável: agente Motion. Arquivos: `src/motion/map/**`, `remotion/**`, este documento.
Interface: `export function BrazilMap(props: { className?: string }): JSX.Element` (`src/motion/map/BrazilMap.tsx`), usada por `Alcance.tsx`.

## Geometria (fonte oficial, sem traçado à mão)

| Item | Valor |
|---|---|
| Fonte | IBGE — API de malhas geográficas v3 |
| URL (UFs) | `https://servicodados.ibge.gov.br/api/v3/malhas/paises/BR?formato=application/vnd.geo+json&intrarregiao=UF&qualidade=minima` |
| URL (nomes/siglas) | `https://servicodados.ibge.gov.br/api/v1/localidades/estados` |
| Baixado em | 20/10/2026 (sha256 inicial: `07c671aa87aa1ab2…` malha, `7ca1368dea3af83c…` lista) |
| Atribuição | “Fonte: IBGE — Malhas territoriais”. Dados públicos do IBGE, uso livre com citação da fonte. Se a página ganhar rodapé de créditos, incluir a fonte (decisão do coordenador). |
| Projeção | Equirretangular com paralelo padrão no meio da extensão (−14,24°; fator cos = 0,9693). Não deforma de forma visível nessa faixa de latitude; a proporção bate com o mapa do PPT (altura/largura ≈ 1,026). |
| viewBox | 1000 × 1026,6 (margem de 14 unidades) |
| Simplificação | Nenhuma além da qualidade “mínima” do IBGE (≈ 5 mil vértices). A malha do IBGE já é topológica: cada divisa aparece com os mesmos vértices nas duas UFs (1.887 arestas compartilhadas, 1.175 de contorno). Por isso não há lacunas. Coordenadas arredondadas a 0,1 unidade. |
| Contorno do país | Montado com as arestas que pertencem a uma só UF. Ele coincide com os estados. A malha de país do IBGE é mais grosseira e não coincidiria. São 10 trechos: o continente e as ilhas costeiras (Marajó, São Luís etc.). |
| Divisas | 54 trechos com as arestas compartilhadas, cada um desenhado uma vez, de norte a sul. |
| Ponto interno por UF | Polo de inacessibilidade aproximado (busca em grade com refino) no maior polígono da UF. É sempre interno. O ponto marca a presença no estado. **Não é endereço nem unidade.** |
| Arquivos gerados | `src/motion/map/brazilGeo.ts` (≈ 96 kB, ≈ 33 kB gzip, carregado sob demanda) e `src/motion/map/brazilGeoMeta.ts` (medidas leves para o bundle inicial) |
| Script | `remotion/scripts/gerar-mapa-ibge.py`. Para rodar: `python -I gerar-mapa-ibge.py <ufs.json> <ufs-list.json> <src/motion/map/brazilGeo.ts>`, com os JSON baixados numa pasta à parte |

## Símbolos de presença (correspondência com o slide 5)

Em `slide5.xml`, o mapa é `Image 0` (`image-5-1.png`, off 6096000/476250, ext 5715000×5905500). Os 26 símbolos pequenos são `Image 1…26` (190500 EMU cada). O destaque é `Image 27` dentro de `Shape 0`. Cada centro foi convertido para a imagem do mapa e depois para lon/lat. A conversão usa o retângulo dos pixels brancos do PNG (15–1117 × 54–1185 px) alinhado ao retângulo do Brasil. Depois foi testado em qual UF o ponto cai.

As imagens estão em **ordem alfabética do nome do estado**, e o RJ é o destaque. Isso confirma **um símbolo por UF, 27 no total**: 26 pequenos e o destaque do Rio. Os pontos que caíram no mar ficam no litoral da UF esperada (AL, CE, ES, MA, PB, PE, RN). No PPT, as posições ficam perto das capitais. Aqui, de propósito, o símbolo vai no ponto interno da UF, para não sugerir endereço.

| Imagem | UF | Imagem | UF | Imagem | UF |
|---|---|---|---|---|---|
| 1 | AC | 10 | MA | 19 | RN |
| 2 | AL | 11 | MT | 20 | RS |
| 3 | AP | 12 | MS | 21 | RO |
| 4 | AM | 13 | MG | 22 | RR |
| 5 | BA | 14 | PA | 23 | SC |
| 6 | CE | 15 | PB | 24 | SP |
| 7 | DF | 16 | PR | 25 | SE |
| 8 | ES | 17 | PE | 26 | TO |
| 9 | GO | 18 | PI | 27 (destaque, maior) | **RJ** |

Os símbolos seguem o material fornecido:
- **Presença (26 UFs).** É o desenho de linha do PPT (`image-5-2…`): horizonte, meio sol vazado e 11 raios a cada 15°. Foi redesenhado em vetor a partir das medidas do PNG, em tinta (`--cred-ink`). O traço tem cerca de 1 px na tela em qualquer largura.
- **Rio de Janeiro: rede própria.** Disco em tinta com o **sol oficial da marca** (traçado de `public/brand/favicon.svg`, sem alteração de forma) em amarelo, mais um anel fino. O rótulo **“Rede própria / Barra · Centro”** (`copy.alcance.map.ownNetworkLabel` + `ownNetworkUnits`) é HTML sobre o mapa. Ele nunca diz “sede”. A presença nacional não aparece como unidade própria: só o RJ tem destaque.

## Sequência (Remotion, 30 fps, 225 quadros = 7,5 s, sem loop)

| Quadros | Etapa |
|---|---|
| 0–60 | O contorno do país se desenha (`stroke-dashoffset`, curva in-out). O quadro 0 é vazio, igual ao espaço reservado antes de tocar. |
| 52–96 | Os estados ganham o branco, de norte a sul (opacidade e escala 0,965 → 1 a partir do ponto interno). |
| 69–149 | As divisas estaduais se desenham em amarelo sobre o branco, de norte a sul. |
| 102–172 | Os símbolos de presença entram de norte a sul, com 2 quadros de defasagem (mola, escala, subida e opacidade). |
| 156–200 | Destaque do Rio: disco com o sol (mola), anel e uma única onda que se expande e some. O rótulo HTML aparece no quadro 171. |
| 200–224 | O mapa completo fica parado. O último quadro permanece na tela. |

Marcas em `src/motion/map/timing.ts`; ordens de entrada em `timeline.ts`; cena em `MapScene.tsx`; desenho puro em `MapArt.tsx` (sem `remotion`, reaproveitado pela versão estática).

Desvios conscientes da skill de motion: não há grain, vinheta ou gradiente de fundo. O mapa é uma camada transparente sobre o plano amarelo da página, não um vídeo autônomo. Também não há “respiração” no fim, porque o pedido é terminar parado.

## Comportamento na página (`BrazilMap`)

- **Carregamento sob demanda.** Quando a seção chega a 600 px da tela, `MapPlayer` é importado (`React.lazy`), com `@remotion/player`, `remotion`, a cena e a geometria. O bundle inicial leva só `timing.ts`, `brazilGeoMeta.ts`, o CSS e o componente. Antes disso, o palco é um espaço vazio com `aspect-ratio` 1000/1027, sem salto de layout.
- **Toca uma vez** quando pelo menos 35% do mapa está visível (IntersectionObserver). Não repete sozinho. Ao terminar, fica no último quadro (`moveToBeginningWhenEnded={false}`, `loop={false}`).
- **Saída da tela.** O mapa pausa ao sair e continua de onde parou ao voltar, a menos que o visitante tenha pausado. Nesse caso, fica pausado até ele clicar em Continuar.
- **Controles HTML abaixo do mapa** (fora do `role="img"`): “Pausar animação”/“Continuar animação” (só enquanto não terminou) e “Repetir animação” (volta ao quadro 0 e toca). São botões nativos de 16 px, com área de toque mínima de 44×44 px e `:focus-visible` com contorno de 2 px em tinta.
- **`prefers-reduced-motion: reduce`.** Mostra o desenho estático completo (`MapStatic`, também sob demanda), com o rótulo visível, sem player e sem controles. Também acompanha a troca da preferência em tempo real. Se o player falhar ao carregar, entra a mesma versão estática (error boundary).
- **Sem captura de ponteiro nem de rolagem.** O player tem `pointer-events: none`, `clickToPlay`, `spaceKeyToPlayOrPause`, `doubleClickToFullscreen` e `allowFullscreen` desligados, e não tem áudio.
- **Acessibilidade.** O palco tem `role="img"` e `aria-label` = `copy.alcance.map.ariaLabel`. O SVG e o rótulo visual são `aria-hidden`, porque o nome acessível já contém o texto.
- **Tamanho.** O mapa ocupa 100% da largura do contêiner. Os traços ficam constantes em px: `displayWidth` vem de um ResizeObserver. O rótulo fica ancorado na altura do RJ (`top` em %), abaixo do anel e encostado à direita, sobre o oceano. A fonte é `clamp(10.5px, 2.25cqi, 15px)`. Com o mapa até 480 px de largura (container query), o rótulo desce mais (`15cqi`) e aperta o espaçamento entre letras para 0,1em, para não encostar na costa de SP/RJ/PR. Conferido em 320 px. O texto passa por `typesetLabel`, então “Barra · Centro” não se parte.

## Remotion (projeto `remotion/`)

- Composição única `MapaBrasil` (1080 × 1108, fundo #FFCA00 só para conferência), em `remotion/src/MapaBrasil.tsx` e `Root.tsx`. Ela importa a mesma cena de `src/motion/map`.
- Saíram `TrilhaValor.tsx` (V2, trilha retirada), `M06Gestao.tsx` (V1), `layers.tsx`, `fonts.ts` e `theme.ts`, que só eram usados por essas duas composições. A V2 está em `historico/v2-antes-da-v3-2026-10-20.tar.gz`.
- Conferência (`--concurrency=1`): `remotion/out/mapa/mapa-q0|45|80|125|172.png` (escala 0,5), `mapa-q224.png` (final) e `mapa-referencia.mp4` (h264, 306 kB). Ficam fora de `public/` e não são publicados.

## Pendências

- **Licença Remotion.** O uso comercial por empresa com mais de 3 pessoas pode exigir a Company License da Remotion (remotion.dev/license). O `acknowledgeRemotionLicense` só silencia o aviso do console e não substitui a licença. A decisão fica com a Pixel Rain/CRED.
- **Atribuição IBGE.** Decidir se a página mostra “Fonte: IBGE” (por exemplo, em créditos ou no rodapé).
- **Tamanho real do chunk em produção.** Não foi medido, porque `vite build` é do coordenador. Referência do dev: `@remotion/player` pré-empacotado tem 205 kB (44 kB gzip), e a geometria tem 33 kB gzip.

## Revisão 20/10/2026 — símbolo oficial (pedido do Nil)

Os 26 símbolos de presença deixaram de usar o sol de linha redesenhado a partir do PNG do slide 5. Agora usam o **sol oficial da CRED** (`brandSun.ts`, mesmo traçado de `public/brand/favicon.svg`, forma inalterada), preenchido em tinta, com ~26 px de largura no desktop (máx. 48 unidades do viewBox em telas estreitas). O destaque do RJ continua com o mesmo sol, em amarelo sobre o disco de tinta. Observação: no DF (UF muito pequena) o sol cobre a divisa com GO, como no PPT.
