# Direção visual e motion

> **Superado em 20/10/2026 pela V3 (`docs/V3-CONTRATO.md` + PPT da Sabrina). Mantido como histórico; não usar como requisito.**

> **Nota V2 (14/10/2026).** A direção ativa é `docs/REVISAO-CRED-MHS-V2.md` (§9). O que está abaixo desta nota é o texto do kit V1; "Ritmo por momento" (M01–M10), "Scroll narrativo de M06" e "Remotion para M06" estão **superados** — a V2 não tem pinning/sticky nem vídeo.
>
> **Paleta e superfícies:** amarelo `#FFCA00`, branco e preto. Sequência: abertura (amarelo) → institucional (branco) → relacionamento (amarelo) → dados (branco) → gestão integrada (preto, contraste pontual) → trilha (amarelo) → soluções (branco, com faixa amarela de rede) → contato (amarelo). Creme e amarelo claro saíram da apresentação. Texto preto sobre amarelo.
>
> **Composição por dobra (`src/components/sections/v2/`):** retrato real com disco branco (sol) e nome/cargo presos à foto; números grandes com filete amarelo e faixa de logos legível + "Ver todas as empresas"; cadeia linear Sua empresa — executivo — Operação CRED MHS (ilustração, não framework); grafismo disperso → organizado em CSS, sem números nem tela de produto; declaração em escala sobre preto; trilha como `<ol>` com trilho (horizontal ≥1024, vertical no celular); quatro eixos em colunas com filete preto (não cards), exemplos visíveis e `<details>` opcional; contato com retrato circular e ações diretas.
>
> **Motion — rodada 16/10/2026 (prevalece sobre a linha seguinte onde houver conflito).** Trilha (06): camada de movimento em Remotion (`@remotion/player`, carregado sob demanda perto da seção; composição em `src/motion/trail/`). Desenha só trilho e marcadores, nas posições medidas da `<ol>` HTML; nomes e textos seguem HTML. Toca uma vez ao entrar (~10,7 s): a linha para em cada etapa, a etapa ganha halo e a descrição ganha fundo branco; no fim as cinco ficam iguais e a composição completa permanece. Sair da tela no meio pausa; voltar continua (salvo pausa manual). Botões discretos “Pausar/Continuar animação” e “Repetir animação”. Reduced motion: não carrega o player; trilho e marcadores CSS no estado final. Investimento usa o mesmo marcador das outras etapas (B2 resolvido). Soluções (07): entrada coordenada — os quatro filetes se desenham em sequência como uma linha só e os eixos sobem juntos. Dados (04): a seta se desenha e cada fragmento disperso acende e passa para sua linha organizada, uma por vez. Nada em loop, nenhum texto começa invisível.
>
> **Motion (14/10):** só CSS, decorativo, uma vez por entrada (`useReveal` em `v2/shared.tsx` marca `data-inview`; `html.motion-ok` só existe sem reduced-motion). Elementos animados: ligações da cadeia, trilho da trilha, linhas organizadas do grafismo, leve deslocamento de números e eixos. Texto nunca começa invisível; sem scroll travado, sem som, sem loop. O vídeo `public/media/m06/` não é usado na V2 (fica no projeto).

## Base de identidade

Ler primeiro os arquivos reais de `assets/brand/`. Extrair cores, tipografia, versões do logo e regras de aplicação. Registrar os tokens adotados na implementação. Se não houver manual, usar os ativos e o PPTX como referência provisória, identificando essa decisão no relatório técnico.

O material original apresenta amarelo, branco e tons escuros. Não definir códigos hexadecimais oficiais por aproximação visual. Não impor a estética pessoal da Pixel Rain à CRED.

## Composição desejada

Uma apresentação editorial com variação de ritmo. Cada momento deve ter um foco evidente e uma relação clara entre título, apoio, evidência e ação.

| Área | Direção executável | Critério de revisão |
|---|---|---|
| Título e apoio | Trabalhar escala, largura e proximidade em conjunto | A explicação continua legível e presente, sem virar legenda |
| Tipografia | Definir papéis reutilizáveis para título, apoio, corpo, metadados e controles | Apoios equivalentes têm peso e escala consistentes |
| Alinhamento | Usar eixos claros e grid editorial | Texto, imagem e CTA pertencem à mesma composição |
| Fotografia | Integrar ao contexto, preservar rosto e assunto no recorte | A imagem explica presença humana ou capacidade real |
| CTA | Dimensionar pelo rótulo e contexto | Nenhum botão fica longo por stretch acidental |
| Evidências | Dar escala a números e marcas | Leitura útil em tamanho real, sem aproximar a tela |
| Mobile | Recompor ordem, altura, recorte e espaçamento | Não é um desktop encolhido |
| Unidade | Reutilizar tokens e padrões funcionais | Variação editorial não vira inconsistência |

Escalas iniciais, sujeitas à identidade: apoio 18–22 px no desktop e 16–18 px no celular. Títulos usam escala fluida, sem palavras isoladas por quebras artificiais. Corpo longo com largura confortável de leitura. Esses valores são hipóteses de implementação, não regras oficiais da marca.

## Ritmo por momento

- M01: retrato e apresentação pessoal, composição com presença.
- M02: pergunta e escolhas, com pouco ruído visual.
- M03: números e alcance, maior contraste tipográfico.
- M04: marcas legíveis e respiro.
- M05: catálogo explorável com títulos fortes.
- M06: movimento concentrado, usando relação visual entre conceitos.
- M07: aplicações com boa separação de assuntos.
- M08: composição sóbria para referências de confiança.
- M09: síntese clara da seleção.
- M10: volta ao executivo, ação principal próxima do texto.

Não repetir o mesmo padrão de grade, borda, card ou entrada animada nas dez seções. Também não diferenciar tudo a ponto de perder unidade.

## Scroll narrativo de M06

Usar a skill instalada de scroll e a biblioteca existente. A sequência de conteúdo é:

1. Acompanhamento — portal, atendimento e SLA.
2. Integração — conexão entre sistemas e dados.
3. Informação gerencial — indicadores e Power BI.

### Desktop com área suficiente

- Ativar o tratamento sticky apenas em viewport com largura e altura suficientes para o texto. Como ponto inicial, avaliar a partir de 1024 px de largura e 700 px de altura, confirmando em renderização real.
- Seção com altura inicial aproximada de 220–260 svh, calibrada ao conteúdo.
- O palco permanece sticky dentro da seção. Nunca usar fixed permanente que cubra capítulos seguintes.
- O scroll nativo define três intervalos de progresso. Não interceptar roda, gesto de toque ou teclado.
- A primeira fase já está visível na entrada. As seguintes aparecem com transição curta. Ao terminar, a seção libera naturalmente a próxima.
- Marcadores clicáveis deslocam suavemente para o ponto correspondente, usando movimento instantâneo em reduced motion. Não criar conflito entre seleção manual e progresso.
- “Ir para aplicações” permite sair do trecho sem atravessar toda a animação.
- Cada fase mantém texto legível. Nenhuma informação essencial fica escondida enquanto o usuário tenta ler.

### Mobile, zoom alto e reduced motion

Desativar pinning e scrub. Exibir os três aspectos em sequência, com altura natural. O mesmo conteúdo fica disponível, na mesma ordem. Um recurso estático substitui o movimento. A preferência de redução de movimento deve valer desde a primeira renderização.

### Falhas a evitar

Rolagem presa sem saída, conteúdo inacessível com teclado, sticky com texto maior que a viewport, foco em elementos invisíveis, mudança de fase ao tocar um controle, grandes áreas vazias, salto de layout após carregar vídeo e animação infinita necessária à compreensão.

## Remotion

Usar a skill instalada de Remotion somente após ler suas instruções. O objetivo é uma composição curta de aproximadamente 6–8 segundos para M06, com proporção escolhida conforme o layout.

**Conceito:** os elementos Acompanhamento, Integração e Informação gerencial se relacionam progressivamente, preservando a identidade CRED. Representar capacidades, sem ilustrar um produto inexistente.

**Conteúdo obrigatório:** rótulos reais da copy, logo oficial se apropriado e composição legível. Sem dados fictícios, porcentagens inventadas, telas falsas de Power BI ou interface que pareça produto real.

**Tratamento preferencial:** produzir um vídeo otimizado e uma imagem de capa estática. A navegação da página continua em HTML e funciona sem o vídeo. Não carregar um player pesado apenas por conveniência se um arquivo de vídeo resolve.

**Reprodução:** sem áudio automático. Se houver autoplay permitido pelo navegador, limitar a uma reprodução e oferecer pausar/reproduzir; se o autoplay for bloqueado, mostrar capa e controle. Não depender de autoplay. Evitar loop infinito e desligar reprodução automática em reduced motion.

**Relação com scroll:** o scroll controla as fases HTML. O vídeo tem função complementar. Não sincronizar frame a frame o vídeo ao scroll na primeira versão. Isso evita acoplar duas mecânicas difíceis de manter sem benefício definido.

**Entrega técnica:** composição-fonte em diretório compatível com o projeto, render final e poster. Registrar comando real de render depois de verificar a instalação. Se a skill ou renderizador estiver ausente, usar poster/HTML e registrar a pendência sem travar o resto.

## Acessibilidade e desempenho

- Estados selecionados com texto/indicador além de cor.
- Foco visível, áreas de toque confortáveis e nomes acessíveis.
- Acordeões e diálogos com semântica adequada.
- Nada importante somente em hover.
- Contraste suficiente em todos os usos do amarelo, especialmente texto sobre fundo claro.
- Texto essencial em HTML, sem depender de vídeo ou canvas.
- Reservar dimensões de imagens e mídia para evitar saltos.
- Priorizar o carregamento do retrato de abertura; carregar mídia secundária sob demanda.
- Evitar smooth scroll global se criar conflito com acessibilidade ou sticky.

## Regra de revisão Pixel Rain

Sempre formular ajustes como: onde está o problema, qual causa visual é observável, qual mudança o resolve e o que deve ser verificado. Não substituir isso por “deixe premium”. Revisar a composição completa e as seções vizinhas após cada alteração relevante.
