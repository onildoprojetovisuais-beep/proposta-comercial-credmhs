# V3 — Fidelidade do texto ao PPT da Sabrina

Data: 20/10/2026. Fonte: `docs/CRED-MHS-Apresentacao-Comercial.pptx`, conferido pelo texto dos runs em `docs/v3-referencia/slides-xml/` (negritos e quebras) e pelos renders `docs/v3-referencia/slides/`. Página: `src/content/chapters.ts`.

Método: comparação palavra a palavra, com pontuação, travessões (—), ponto médio (·) e acentos. Caixa alta do PPT é tratamento tipográfico; a copy guarda caixa normal com nomes próprios e siglas preservados (CRED MHS, SST, CSAT, Barra, Centro, Minas Gerais, Rio de Janeiro, "Gestão de Saúde e Segurança do Trabalho" da missão com iniciais maiúsculas como no PPT).

Resultado da conferência: **nenhuma divergência de palavra, pontuação ou travessão** nos slides 1–8, 10 e 11. Os únicos textos diferentes do PPT são os ajustes autorizados (slide 9 e etapas do slide 11, ver `docs/V3-ALTERACOES-TEXTO.md`) e a microcopy de interface listada no fim.

Status: **idêntico** (mesma grafia) · **caixa** (só muda a caixa) · **ajuste autorizado** · **microcopy de interface** (não existe no PPT; não altera o raciocínio).

## Slide 1 — `abertura`

| Campo | PPT | Página | Status |
|---|---|---|---|
| `greetingTemplate` | OLÁ, SOU SABRINA. | Olá, sou {firstName}. | caixa (nome vem do perfil `?executivo=`) |
| `lead` | Vim te mostrar como a CRED MHS pode entregar mais gestão para a saúde e segurança do trabalho da sua empresa. | idem | idêntico |
| `body` | Quero te conhecer, mapear os desafios que temos e oferecer solução, sob medida, para o negócio — e acompanhar essa evolução. | idem | idêntico |
| nome / cargo | Sabrina Ferreira · Executiva de Negócios · CRED MHS | vêm de `src/content/executives.ts` / Supabase | idêntico (dado do perfil) |
| "Foto do executivo" | marcador de posição | foto real do perfil | não é copy |
| `cta` | — | Saiba mais | microcopy de interface (controle de avanço da V2; ver alterações) |

## Slide 2 — `provocacao`

| Campo | PPT | Página | Status |
|---|---|---|---|
| `question` | O que a sua empresa consegue gerir com os serviços que já possui? | idem | idêntico |
| `support` | Exames, laudos e programas só geram valor quando viram informação para decidir. | idem | idêntico |
| `statement` | É AÍ QUE COMEÇA A **NOSSA CONVERSA.** | É aí que começa a / nossa conversa. | caixa (destaque preservado em `highlight`) |

## Slide 3 — `quem-somos`

| Campo | PPT | Página | Status |
|---|---|---|---|
| `intro` | Mas antes disso, deixa eu te contar um pouco mais sobre | idem | idêntico |
| `title` | QUEM SOMOS. | Quem somos. | caixa |
| `headline` | CRESCEMOS AO LONGO DE 35 ANOS EM PARCERIA COM OS NOSSOS CLIENTES. | Crescemos ao longo de 35 anos em parceria com os nossos clientes. | caixa |
| `history` | Nascemos em Minas Gerais. Estamos no Rio de Janeiro desde 2008 e, desde 2018, com rede própria — hoje com duas unidades: Barra e Centro. | idem | idêntico |
| `milestones` | (dados do `history`) | 35 anos · Nascemos em Minas Gerais · Rio de Janeiro 2008 · Rede própria 2018 | microcopy de interface (marcadores tipográficos dos fatos já no texto; nenhuma data nova) |
| `attributes` | ATUAÇÃO NACIONAL · EXPERIÊNCIA MULTISSETORIAL · 100% DIGITAL | Atuação nacional · Experiência multissetorial · 100% digital | caixa |
| `units` | UNIDADE BARRA · UNIDADE CENTRO | Unidade Barra · Unidade Centro | caixa |
| `mission` | MISSÃO — Prover a implantação da Gestão de Saúde e Segurança do Trabalho como uma força estratégica, para melhor apoiar os negócios do cliente e para o setor. | idem | caixa (rótulo) / idêntico (texto) |
| `vision` | VISÃO — Ser a melhor referência em gestão de saúde e segurança do trabalho do cliente e para o setor. | idem | caixa (rótulo) / idêntico (texto) |
| `values` | VALORES — **Ética e transparência** no relacionamento com clientes, colaboradores, fornecedores e a sociedade. / **Compromisso contínuo** com a qualidade. / **Capacitação profissional** técnica e humana, permanente e multidisciplinar. / **Inovação** para buscar soluções criativas e tecnológicas. | idem, com `lead` em negrito | caixa (rótulo) / idêntico (itens e negritos) |

## Slide 4 — `atuacao-integrada`

| Campo | PPT | Página | Status |
|---|---|---|---|
| `eyebrow` | NOSSO DIFERENCIAL ESTRATÉGICO | Nosso diferencial estratégico | caixa |
| `title` | UMA ATUAÇÃO **INTEGRADA.** | Uma atuação / integrada. | caixa |
| `body` | Saúde corporativa, segurança do trabalho, higiene ocupacional, gestão estratégica, tecnologia da informação e pessoas trabalhando juntas, potencializando a curva de aprendizagem do seu negócio, com uma equipe multidisciplinar. | idem | idêntico |
| `executive` | **E um executivo de negócios que acompanha e gerencia todo esse projeto.** | idem | idêntico |
| `diagram.client` / `operation` / `executiveTemplate` | — | Sua empresa · Equipe multidisciplinar · {firstName} | microcopy de interface (rótulos do diagrama tirados do próprio texto) |
| `diagram.disciplines` | (lista do `body`) | Saúde corporativa … Pessoas | microcopy de interface (mesmas palavras do `body`) |

## Slide 5 — `alcance`

| Campo | PPT | Página | Status |
|---|---|---|---|
| `eyebrow` | REDE PRÓPRIA BARRA · CENTRO | Rede própria Barra · Centro | caixa |
| `title` | NOSSA FORÇA ESTÁ ONDE VOCÊ ESTIVER. | Nossa força está onde você estiver. | caixa |
| `indicators[vidas]` | +550 mil vidas gerenciadas | + 550 mil · vidas gerenciadas | idêntico (separado em prefixo/valor/unidade) |
| `indicators[clientes]` | +5 mil clientes em todo o território nacional | + 5 mil · clientes em todo o território nacional | idêntico |
| `map.ownNetworkLabel` / `ownNetworkUnits` | (eyebrow) | Rede própria · Barra · Centro | idêntico ao eyebrow (rótulo do mapa) |
| `map.ariaLabel`, `pause`, `play`, `replay` | — | nome acessível e controles | microcopy de interface |

## Slide 6 — `depoimentos` (oculto ao cliente)

| Campo | PPT | Página | Status |
|---|---|---|---|
| `eyebrow` | QUEM SOMOS · CLIENTES | Quem somos · Clientes | caixa |
| `title` | O QUE NOSSOS CLIENTES FALAM SOBRE NÓS | O que nossos clientes falam sobre nós | caixa (sem ponto final, como no PPT) |
| `items` | [Depoimento a selecionar] [Nome, cargo] ×3 | vazio | pendência — nada inventado |
| `reviewSlots` | Banco · Hotelaria · Restaurante | idem | idêntico (só em `?revisao=1`) |

## Slide 7 — `satisfacao` (oculto ao cliente)

| Campo | PPT | Página | Status |
|---|---|---|---|
| `title` | COMO OS FUNCIONÁRIOS DOS NOSSOS CLIENTES AVALIAM O ATENDIMENTO NAS NOSSAS UNIDADES PRÓPRIAS? | Como os funcionários dos nossos clientes avaliam o atendimento nas nossas unidades próprias? | caixa |
| `value` | 99,4% | 99,4% | idêntico (provisório: "[percentual exato a confirmar]") |
| `label` | de satisfação com o atendimento | idem | idêntico |
| `method` | CSAT — índice de satisfação com o atendimento nas unidades próprias. Fonte: [link], período: [a confirmar], universo: [nº de respondentes]. | CSAT — índice de satisfação com o atendimento nas unidades próprias. | idêntico na 1ª frase; os campos "[...]" são marcadores internos e ficam em `source`/`period`/`universe` (null) |

## Slide 8 — `transicao`

| Campo | PPT | Página | Status |
|---|---|---|---|
| `lead` | Agora que já nos conhece um pouco mais, a pergunta que fica é: | idem | idêntico |
| `question` | COMO ENTREGAMOS MAIS GESTÃO DE SAÚDE E SEGURANÇA DO TRABALHO PARA A **SUA EMPRESA?** | Como entregamos mais gestão de saúde e segurança do trabalho para a / sua empresa? | caixa |

## Slide 9 — `frentes`

| Campo | PPT | Página | Status |
|---|---|---|---|
| `eyebrow` | COMO ENTREGAMOS | Como entregamos | caixa |
| `title` | SEIS FRENTES, UMA ATUAÇÃO ÚNICA. | Seis frentes, uma atuação única. | caixa |
| `center` | MAIS GESTÃO DE SST PARA A SUA EMPRESA | Mais gestão de SST para a sua empresa | caixa |
| `fronts` 01–06 | ver `docs/V3-ALTERACOES-TEXTO.md` | ver alterações | ajuste autorizado (A–F); números 01–06 e ordem iguais ao PPT |
| `transversal` | — | Comunicação e reputação | ajuste autorizado (G), proposta |

## Slide 10 — `empresas`

| Campo | PPT | Página | Status |
|---|---|---|---|
| `eyebrow` | QUEM JÁ VIU VALOR NA ENTREGA DA CRED MHS | Quem já viu valor na entrega da CRED MHS | caixa |
| `title` | EMPRESAS QUE CAMINHAM COM A GENTE | Empresas que caminham com a gente | caixa |
| `prev` / `next` | ‹ / › (setas) | Marcas anteriores / Próximas marcas | microcopy de interface (nome acessível das setas) |
| `counterTemplate` | 1 / 3 | {current} / {total} | microcopy de interface (total real calculado; o PPT tem 8 logos — ver pendência) |

## Slide 11 — `contato`

| Campo | PPT | Página | Status |
|---|---|---|---|
| `title` | VAMOS AGENDAR A NOSSA CONVERSA? | Vamos agendar a nossa conversa? | caixa |
| `body` | **Me chame para iniciarmos esse projeto juntos.** | idem | idêntico |
| `steps` | Detalhar o escopo · Aprofundar na sua demanda · Dar o primeiro passo | Aprofundar na sua demanda · Detalhar o escopo | ajuste autorizado |
| `labels` | EXECUTIVO · TELEFONE · E-MAIL | Executivo · Telefone · E-mail | caixa |
| valores [Nome], [(00) 00000-0000], [nome]@credmhs.com.br | marcadores | dados do perfil | não é copy |
| `actions.*`, `emailSubject`, `institutionalSite` | — | Falar por WhatsApp · Enviar e-mail · Ligar para {firstName} · LinkedIn · Site da CRED MHS · assunto do e-mail · www.credmhs.com.br | microcopy de interface (canais acionados pelo visitante) |

## Global e navegação

| Campo | PPT | Página | Status |
|---|---|---|---|
| `global.brand` | logotipo CRED MHS | CRED MHS | idêntico (nome) |
| `global.tagline` | — | Saúde e Segurança do Trabalho | microcopy de interface (assinatura de marca preservada; não é afirmação nova) |
| `global.navLabel`, `skipLink` | — | Seções da apresentação · Pular para o conteúdo | microcopy de interface (acessibilidade) |
| `chapters[].navLabel` | — | Início · A conversa · Quem somos · Atuação integrada · Alcance · Depoimentos · Satisfação · Como entregamos · Seis frentes · Empresas · Contato | microcopy de interface (rótulos de navegação tirados dos títulos dos slides) |

Nenhum item de microcopy acrescenta fato, promessa, número ou etapa ao raciocínio do PPT.
