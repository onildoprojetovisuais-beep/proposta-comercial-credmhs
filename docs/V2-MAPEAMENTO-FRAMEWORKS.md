# V2 — Mapeamento dos frameworks, da copy e do conteúdo anterior

> **Superado em 20/10/2026 pela V3 (`docs/V3-CONTRATO.md` + PPT da Sabrina). Mantido como histórico; não usar como requisito.**

Data: 14/10/2026. Autoridade: `docs/REVISAO-CRED-MHS-V2.md` (rev. 2.1). Contrato técnico: `docs/V2-CONTRATO.md`.
Dados de código: `src/content/solutions.ts`, `src/content/valueTrail.ts`, `src/content/chapters.ts`, `src/content/coverage.ts`.

## Fonte dos frameworks — limitação importante

Os dois JPEGs enviados pela Sabrina (“soluçoes que nos levam alem cred mhs.jpeg” e “trilha de valor na gestao de sso cred hs.jpeg”) **não foram encontrados no disco em 14/10/2026** (busca em `D:\Projetos ClaudeCode`, Downloads, Desktop, Documentos, Imagens e OneDrive). O mapeamento abaixo usa a transcrição da revisão §5 (nomes, ordem e distribuição dos itens). Os arquivos precisam ser adicionados a `assets/brand/` ou `sources/` para conferência e preservação (docs/07, P33). Se a imagem divergir da transcrição, prevalece a imagem e este documento deve ser corrigido.

## (a) Três camadas e sua função

| Camada | Estrutura | Função na apresentação | Onde aparece | O que NÃO é |
|---|---|---|---|---|
| Posicionamento (brandbook p. 21) | 3C: Credibilidade, Compromisso, Conhecimento · 3I: Inovação, Investimento, Inteligência | Orienta linguagem e escolha de provas | Implícito na copy (ver tabela 3C/3I abaixo) | Não é processo, etapa, componente nem “metodologia de seis etapas” |
| Soluções que nos levam além | Normativo, Reputacional, Gestão, Inovação | Organiza o portfólio em quatro eixos | Dobra `solucoes` | Não são quatro pacotes, nem escolha do visitante, nem lista do que está em todo contrato |
| Trilha de valor na gestão de SSO | Normativo → Reputacional → Gestão → Inovação → Investimento | Explica a progressão de valor | Dobra `trilha` | Não é pacote, contratação sequencial, pontuação de maturidade, diagnóstico nem garantia de retorno |

Investimento existe só na trilha (5ª etapa). Não há quinto eixo de soluções.

### 3C/3I na copy

| Eixo | Onde a copy o expressa |
|---|---|
| Credibilidade | `institucional`: números, empresas da trajetória, abrangência nacional |
| Compromisso | `abertura` e `relacionamento`: pessoa de referência, acompanhamento próximo, continuidade |
| Conhecimento | `institucional` (“experiência em diferentes setores”), `gestao-integrada` (equipe multidisciplinar) |
| Inovação | `gestao-integrada` (tecnologia integrada), eixo Inovação (ações que geram valor) |
| Investimento | `institucional` (estrutura de atendimento), etapa 5 da trilha |
| Inteligência | `dados` (informação organizada), `trilha` (fecho sobre decisões da diretoria) |

## (b) Framework → copy → componente/dados

### Quatro eixos (`solutionAxes`, componente `v2/Solucoes.tsx`)

| Eixo | Resumo público (sempre visível) | Exemplos visíveis | Aprofundamento opcional | Inventário (não exibido) |
|---|---|---|---|---|
| Normativo | Programas, exames, documentos e serviços técnicos para apoiar o atendimento às exigências de saúde e segurança do trabalho. | Programas de saúde e segurança; Exames ocupacionais; Avaliações técnicas | 8 itens (convocação de periódicos, exames na empresa, laudos de insalubridade e periculosidade, perícias, análise ergonômica, mapa de risco, ordens de serviço e EPI, programa para riscos psicossociais) | Siglas PGR/GRO, LTCAT, PCMSO, PCMAT, PPRA, PCA, PPP, ASO, CIPA, relatório anual, atestado médico, mapa de extintores, certificados de treinamentos, sistema de gestão |
| Reputacional | Conexão entre saúde e segurança, liderança, RH e comunicação para fortalecer a percepção de cuidado com as pessoas. | Alinhamento de liderança; Integração com a comunicação; Indicadores de percepção | 3 itens (norteadores para posicionamento da marca, integração com RH/comunicação/marketing, apuração da percepção) | “OK’s e KPI’s” (grafia da fonte), ícones ESG/ODS |
| Gestão | Informações, documentos e sistemas conectados para apoiar o acompanhamento da operação e as decisões das equipes. | Integração de dados; Gestão eletrônica de documentos; Assinatura digital | 9 itens (folha, importação/exportação, eSocial, portal de atendimentos, app, acervo fotográfico, biometria, saúde remota, nuvem) + nota de escopo | Power BI, customização de dados, mentoria de módulos, LGPD, símbolos BI/AI |
| Inovação | Soluções aplicadas às necessidades da empresa, com foco em transformar ações em valor para a operação e as pessoas. | Monitoramento por telemedicina; Administração de ambulatórios; Treinamentos digitais e práticos | 9 itens (FAP/NTEP, absenteísmo, central EAD, continuidade de negócios, mão de obra especializada, veículo de urgência, vacinação, ginástica laboral, SIPAT digital) | “Projeto Cuidar”, teleatendimento/telediagnóstico, “mais de 77 cursos”, 12 temas NR, adjetivos do EAD |

Nota pública única da dobra: “A composição das soluções considera as necessidades e o escopo de cada empresa.” (`copy.solucoes.scopeNote`).

Contagem do inventário (`display`): Normativo 26 itens (3 exemplo · 9 detalhe · 14 inventário) · Reputacional 6 (3 · 2 · 1) · Gestão 17 (3 · 9 · 5) · Inovação 16 (3 · 9 · 4). O exemplo “Programas de saúde e segurança” agrupa siglas que continuam no inventário.

### Trilha (`valueTrail`, componente `v2/Trilha.tsx`)

| Ordem | Etapa | Texto público | Sentido no framework (para a fala do executivo) |
|---|---|---|---|
| 1 | Normativo | Atender às exigências que fazem parte da operação. | A necessidade de gestão nasce do enquadramento legal e regulatório |
| 2 | Reputacional | Fortalecer a percepção de um ambiente de trabalho saudável e seguro. | Marca percebida como local saudável, seguro e comprometido com a sociedade |
| 3 | Gestão | Organizar informações para acompanhar a operação e apoiar decisões. | Ferramentas, processos e metodologias dão transparência e apoiam decisões |
| 4 | Inovação | Transformar ações implementadas em valor para a empresa e as pessoas. | Valor está nas ações implementadas, não só na tecnologia |
| 5 | Investimento | Direcionar recursos com intenção, dados e visão de negócio. | Aplicação estratégica de recursos, baseada em dados, por pessoas que reconhecem valor |

Título, apoio e fecho: `copy.trilha`. A trilha absorve o antigo capítulo “Informação para quem decide”. Funciona como texto legível sem animação; no mobile, as cinco etapas ficam empilhadas na mesma ordem.

### Reputacional em mais de um lugar, sem repetição

- `gestao-integrada` (fecho): ponte — liderança, RH e comunicação, percepção de cuidado.
- `trilha` (etapa 2): sentido de valor.
- `solucoes` (eixo): exemplos de entrega.
Em nenhum lugar o eixo vira prova social da CRED MHS (logos, depoimentos) nem promessa de melhoria mensurável de reputação.

## (c) Matriz do conteúdo anterior (V1 → V2)

| Conteúdo V1 | Decisão | Destino V2 | Motivo |
|---|---|---|---|
| M01 Encontro (retrato, nome, cargo, saudação) | Mantido, copy adaptada | `abertura` | Abordagem aprovada na reunião; nova saudação “Olá, sou {firstName}.” |
| M01 assinatura “Gestão de Saúde e Segurança do Trabalho” | Retirado | `copy.global.tagline` = “Saúde e Segurança do Trabalho” | Correção da Sabrina (13/10) |
| M02 texto institucional | Reorganizado | `institucional.body` | Apresentação institucional logo após a abertura |
| M02 campo de empresa | Retirado | — | Cliente não preenche (reunião 21:08–25:28) |
| M02 escolha de prioridades, destaques derivados (`priorities.ts`, `getHighlights`) | Retirado | — | Percurso descartado (revisão §4) |
| M03 números (16 unidades, +700 clínicas, +550 mil vidas, +5 mil clientes) | Mantido sem alteração | `institucional` (“Nossa força em números”) | Exigência de Nil |
| M03 alcance “Atuação nacional” | Mantido | `institucional` e sub-bloco de rede de `solucoes` | Fallback de P04 |
| M03 detalhes (equipe, recursos próprios, in company) | Reorganizado | Equipe → `institucional`/`gestao-integrada`; equipamentos → exemplo “Avaliações técnicas”; in company → detalhe Normativo | Evitar seção repetida de estrutura |
| M04 empresas e logos | Mantido | `institucional` (faixa principal + consulta complementar) | Prova social preservada perto do início |
| M05 quatro frentes (Saúde, Segurança, Gestão e Tecnologia, Treinamentos) | Retirado como organização; itens reorganizados | `solutionAxes[].inventory` | Substituído pelos quatro eixos oficiais |
| M05 serviços de cada frente | Reorganizado | Exemplos, aprofundamento ou inventário de cada eixo | Evitar despejar siglas; revisão técnica pendente |
| M05 soluções adicionais (slide 15) | Reorganizado | Detalhe de Inovação (e Normativo para análise ergonômica) | Classificação do framework |
| M05 “Adicionar à conversa” | Retirado | — | Sem seleção de serviços |
| M06 Gestão em movimento (acompanhamento, integração, informação gerencial) | Reorganizado | `dados` (pontos de apoio) | Dor de dados é central na V2 |
| M06 recursos complementares | Reorganizado | Detalhe de Gestão/Inovação ou inventário | — |
| M06 Power BI | Inventário | `axisById.gestao.inventory` | Não reforçar o símbolo BI como promessa (P34) |
| M07 aplicações eSocial, FAP/NTEP, Riscos Psicossociais | Aprofundamento opcional | Detalhe de Gestão (eSocial), Inovação (FAP/NTEP), Normativo (riscos psicossociais) | Sem capítulo próprio; divergência registrada (P38) |
| M08 Confiança (fallback pessoas e estrutura) | Reorganizado | `institucional` e `gestao-integrada` | Seção repetida; integrada às provas |
| M08 credenciais ISO/LGPD | Retido | `credentials.ts` | Faltam titular, escopo e validade (P05, P06) |
| M09 pauta, contador, itens livres, reordenação, “Copiar pauta”, “Limpar escolhas” | Retirado | — | Percurso descartado |
| M10 mensagem gerada com escolhas, prévia, edição | Retirado | — | Sem seleções para relatar |
| M10 contatos (e-mail, telefone, LinkedIn, site) | Mantido | `contato` | Ações diretas com destinos reais |
| “Nova apresentação” (reset) | Retirado | — | Sem estado do visitante a limpar |
| Triângulo acompanhamento/integração/informação | Retirado como metodologia | Recursos reaparecem como pontos de apoio de `dados` | Não representa o framework (reunião 29:51–31:12) |
| “Informação para quem decide” | Absorvido | Fecho da `trilha` | Evita nona seção |
| Treinamentos (central EAD, 77 cursos, 12 NR) | Reorganizado | Central no detalhe de Inovação; 77 cursos e NR no inventário | Catálogo exige revisão (P09, P10) |

## (d) Itens não exibidos e onde estão

| Item | Onde está | Motivo |
|---|---|---|
| Ranking “entre as 5 maiores” | `facts#ranking` | Sem fonte/critério (P02) |
| 30/34/35 anos | `facts#tempo-experiencia` | Conflito (P01) |
| “27 Estados Atendidos” | `facts#estados-atendidos` | Nomenclatura UF/DF (P04) |
| “4 soluções para o eSocial” | `facts#solucoes-esocial` | Modalidades ausentes (P08) |
| “Mais de 77 cursos” e 12 temas NR | `axisById.inovacao.inventory`, docs/02 histórico | Catálogo a revisar (P09, P10) |
| Siglas de programas (PGR/GRO, LTCAT, PCMSO, PCMAT, PPRA, PCA, PPP, ASO, CIPA) | `axisById.normativo.inventory` | Revisão técnica e de escopo (P10, P37) |
| ISO 27001, 9001:2015, 45001; LGPD | `credentials.ts`, inventário de Gestão | P05, P06 |
| Power BI, BI/AI | `axisById.gestao.inventory` | P34 |
| ESG/ODS | `axisById.reputacional.inventory` | P35 |
| “Projeto Cuidar” | `axisById.inovacao.inventory` | Detalhe proprietário |
| Teleatendimento/telediagnóstico | `axisById.inovacao.inventory` | Fora do framework; escopo a revisar |
| Portal com SLA (a palavra SLA) | `axisById.gestao.inventory` | Sem SLA confirmado (P39) |
| Copyright do slide 16 | `sources/` | P17 |

## (e) Limitações de escopo

- Os frameworks são visão de alto nível; não equivalem à metodologia operacional proprietária. Nada de procedimentos internos, pesos ou catálogo integral na página.
- A presença de um item no framework não prova vigência normativa, disponibilidade atual ou inclusão em qualquer contrato.
- Classificações por afinidade (itens da V1 ausentes no framework) estão marcadas com `note` em `solutions.ts` e precisam de confirmação da CRED MHS (P38).
- Copy pública ainda sujeita à validação comercial da Sabrina; não declarar aprovação.
