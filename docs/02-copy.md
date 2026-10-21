# Copy da apresentação — V2 (ativa)

> **Superado em 20/10/2026 pela V3 (`docs/V3-CONTRATO.md` + PPT da Sabrina). Mantido como histórico; não usar como requisito.**

> **V2 ativa desde 14/10/2026.** Fonte: `docs/REVISAO-CRED-MHS-V2.md` (rev. 2.1), §7. A copy V1 (M01–M10, prioridades, pauta e mensagem) está mais abaixo em **Histórico V1 (superado)** e não deve ser restaurada. Código: `src/content/chapters.ts`, `solutions.ts`, `valueTrail.ts`. Mapeamento completo: `docs/V2-MAPEAMENTO-FRAMEWORKS.md`.
>
> Copy de trabalho, ainda sujeita à validação comercial da Sabrina. Não declarar aprovação da cliente.

## Como usar

- **Texto público** = trechos em `código` e itens de lista marcados "Público". Só isso vai para a página.
- **Notas internas** = parágrafos "Nota interna". Nunca renderizar.
- Variáveis: `{firstName}`, `{fullName}`, `{role}` vêm do perfil do executivo (`?executivo=`).
- Ajustes de fluidez são permitidos; não alterar promessa, criar estatística ou ampliar escopo.

## Ordem das seções

| # | ID / hash | Rótulo do índice | Ideia |
|---|---|---|---|
| 01 | `abertura` | Apresentação | Executivo abre a conversa |
| 02 | `institucional` | CRED MHS | Quem entrega: estrutura, números, empresas |
| 03 | `relacionamento` | Relacionamento | Dor: com quem contar → executivo de referência |
| 04 | `dados` | Dados | Dor: informação dispersa → informação organizada |
| 05 | `gestao-integrada` | Gestão integrada | Dos serviços à gestão; ponte para o Reputacional |
| 06 | `trilha` | Trilha de valor | Cinco etapas: Normativo → Reputacional → Gestão → Inovação → Investimento |
| 07 | `solucoes` | Soluções | Quatro eixos + abrangência nacional |
| 08 | `contato` | Contato | Ações diretas com o executivo |

## 01 — Abertura (`abertura`)

Público:
- Identificação: `Olá, sou {firstName}.` (+ foto, nome completo e cargo do perfil)
- Título: `Vou te mostrar como a CRED MHS pode apoiar a gestão de saúde e segurança do trabalho da sua empresa.`
- Apoio: `Meu papel é aproximar as necessidades da sua empresa da nossa operação e acompanhar essa relação.`
- Ação opcional: `Saiba mais` (âncora para `institucional`; rolagem livre também funciona). Trocado de “Vamos começar” em 16/10/2026 por instrução do Nil, alinhado ao exemplo verbal da Sabrina na reunião (34:12–35:16).

Nota interna: não afirmar conhecimento específico da empresa; sem campo de identificação do cliente.

## 02 — Apresentação institucional (`institucional`)

Público:
- Título: `Conheça a estrutura por trás dessa parceria.`
- Texto: `A CRED MHS atua em saúde e segurança do trabalho, com abrangência nacional e experiência em diferentes setores. Reunimos equipe multidisciplinar, estrutura de atendimento e tecnologia para apoiar a gestão das empresas e das pessoas que fazem parte delas.`
- Subtítulo: `Nossa força em números.` — 16 Unidades · +700 Clínicas credenciadas · +550 mil Vidas gerenciadas · +5 mil Clientes atendidos · Atuação nacional
- Subtítulo: `Empresas que fazem parte da nossa trajetória.` — faixa principal + `Ver todas as empresas` / `Mostrar menos empresas`
- Transição: `Essa estrutura ganha sentido na forma como acompanhamos a sua operação.`

Nota interna: números reutilizados da V1 sem alteração (`capacityFacts`); 27 estados e tempo de atuação seguem retidos (P01, P04). Não criar depoimentos ou resultados de clientes (P07).

## 03 — Relacionamento e continuidade (`relacionamento`)

Público:
- Título: `Quando sua empresa precisa de uma resposta, sabe com quem contar?`
- Dor: `Exames, documentos e atendimentos fazem parte da rotina. Para acompanhar tudo isso, sua empresa também precisa de acesso, clareza e continuidade.`
- Resposta: `Você conta com um executivo de negócios para conectar suas demandas à operação da CRED MHS e acompanhar os próximos passos.`
- Pontos: `Uma pessoa de referência.` · `Conexão com a equipe operacional.` · `Acompanhamento próximo das demandas.`
- Rótulos da composição: `Sua empresa` → `{firstName}` → `Operação CRED MHS`

Nota interna: a composição não é framework proprietário. Sem reuniões periódicas, prazos, 12 meses, 24 h ou resolução imediata (P39).

## 04 — Dados e visibilidade (`dados`)

Público:
- Título: `Você sabe o que os dados da sua operação estão mostrando?`
- Dor: `Agendamentos, exames e documentos geram informação todos os dias. Quando ela fica dispersa, acompanhar a operação e definir prioridades se torna mais difícil.`
- Resposta: `A CRED MHS reúne acompanhamento, integração e informação gerencial para dar mais clareza à gestão.`
- Pontos: `Acompanhamento dos atendimentos.` · `Integração de informações e sistemas.` · `Dados organizados para a gestão.`

Nota interna: grafismo conceitual sem números de desempenho nem dashboard simulado. Compreensível com animação desligada.

## 05 — Gestão integrada (`gestao-integrada`)

Público:
- Título: `Sua empresa já tem os serviços. O que ela consegue gerir com eles?`
- Apoio: `Cumprir as exigências faz parte da operação. O próximo passo é conectar saúde, segurança, pessoas e informação às necessidades do negócio.`
- Resposta: `Nossa atuação integra saúde e segurança do trabalho, gestão e tecnologia, com uma equipe multidisciplinar e acompanhamento próximo.`
- Fecho: `Essa atuação também pode conectar saúde e segurança à liderança, ao RH e à comunicação da empresa, fortalecendo a percepção de cuidado com as pessoas.`

Nota interna: ponte para o eixo Reputacional. Sem promessa mensurável de reputação; sem estética de carrinho ou pacotes.

## 06 — Trilha de valor (`trilha`)

Público:
- Título: `E se a gestão de saúde e segurança orientasse também as decisões do negócio?`
- Apoio: `A trilha de valor da CRED MHS conecta as exigências da operação ao cuidado com as pessoas, à informação e às decisões de investimento.`
- Etapas (ordem fixa):
  1. **Normativo** — `Atender às exigências que fazem parte da operação.`
  2. **Reputacional** — `Fortalecer a percepção de um ambiente de trabalho saudável e seguro.`
  3. **Gestão** — `Organizar informações para acompanhar a operação e apoiar decisões.`
  4. **Inovação** — `Transformar ações implementadas em valor para a empresa e as pessoas.`
  5. **Investimento** — `Direcionar recursos com intenção, dados e visão de negócio.`
- Fecho: `Quando a diretoria pergunta o que precisa de atenção, essa visão ajuda a conectar a rotina às decisões.`

Nota interna: não é questionário, régua de avaliação, cinco telas obrigatórias nem promessa de ROI. Absorve "Informação para quem decide". Proibido: "Você levou laudo ou estratégia?" e "O CEO perguntou: isso traz retorno?".

## 07 — Quatro eixos de soluções (`solucoes`)

Público:
- Título: `Como essa visão se transforma em soluções para a sua empresa?`
- Apoio: `Organizamos nossa atuação em quatro eixos que conectam as necessidades da operação ao valor para o negócio.`
- **Normativo** — `Programas, exames, documentos e serviços técnicos para apoiar o atendimento às exigências de saúde e segurança do trabalho.` Exemplos: Programas de saúde e segurança · Exames ocupacionais · Avaliações técnicas
- **Reputacional** — `Conexão entre saúde e segurança, liderança, RH e comunicação para fortalecer a percepção de cuidado com as pessoas.` Exemplos: Alinhamento de liderança · Integração com a comunicação · Indicadores de percepção
- **Gestão** — `Informações, documentos e sistemas conectados para apoiar o acompanhamento da operação e as decisões das equipes.` Exemplos: Integração de dados · Gestão eletrônica de documentos · Assinatura digital
- **Inovação** — `Soluções aplicadas às necessidades da empresa, com foco em transformar ações em valor para a operação e as pessoas.` Exemplos: Monitoramento por telemedicina · Administração de ambulatórios · Treinamentos digitais e práticos
- Aprofundamento opcional por eixo: listas em `solutionAxes[].detail` (ver `docs/V2-MAPEAMENTO-FRAMEWORKS.md`).
- Nota pública: `A composição das soluções considera as necessidades e o escopo de cada empresa.`
- Sub-bloco de rede — título: `Sua operação tem diferentes endereços. Nossa atuação tem abrangência nacional.` Apoio: `A rede própria e credenciada da CRED MHS apoia o atendimento em diferentes regiões do país.`

Nota interna: os eixos não são pacotes; não há quinta coluna "Investimento"; sem IA, BI preditivo, ESG ou conformidade universal. Mapa só com localidades verificadas (nenhuma fornecida). Não repetir a grade de números da dobra 02.

## 08 — Continuidade comercial (`contato`)

Público:
- Título: `Vamos olhar para a sua operação com essa perspectiva?`
- Apoio: `Podemos aprofundar como a CRED MHS conecta acompanhamento, informação e soluções às necessidades da sua empresa.`
- Ações conforme o perfil: `Falar por WhatsApp` (só número confirmado) · `Enviar e-mail` (assunto `Conversa sobre a CRED MHS`, sem corpo) · `Agendar uma conversa` (só URL real) · secundários: `Ligar para {firstName}`, `LinkedIn`, `Site da CRED MHS`

Nota interna: hoje Sabrina tem e-mail, telefone, LinkedIn e site; WhatsApp desligado (P13) e sem booking (P14), então esses dois botões não aparecem. Nada é enviado automaticamente.

## Global

- Marca: `CRED MHS` (nunca "CRED" sozinho em texto público). Assinatura: `Saúde e Segurança do Trabalho`.
- Índice: `Conteúdo`. Skip link: `Pular para o conteúdo`. Fechar: `Fechar`.

---

# Histórico V1 (superado em 14/10/2026)

O conteúdo abaixo documenta a copy da V1. Fica como referência e inventário; não restaurar prioridades, pauta, mensagem gerada nem as quatro frentes como organização.

### Como usar

Esta é a copy sugerida para a primeira implementação. Textos institucionais vêm do material original com edição de clareza. Títulos, transições e microcopy são propostas novas. Marcadores de fonte e notas deste documento ficam fora da interface.

Substitua variáveis somente com dados válidos. Se um campo opcional estiver vazio, use o fallback indicado. Não exiba chaves, observações editoriais ou “a confirmar” no conteúdo destinado ao prospect.

### M01 — Abertura

**Identificação:** Sabrina Ferreira

**Cargo:** Executiva de Negócios

**Título:** Olá, eu sou Sabrina.

**Apoio:** Quero conhecer sua empresa e apresentar como a CRED MHS pode apoiar sua gestão de saúde e segurança do trabalho.

**CTA:** Conhecer a CRED

**Marca/descritor:** CRED MHS — Gestão de Saúde e Segurança do Trabalho

**Fonte:** slides 2 e 19. Para outro executivo, trocar identificação, primeiro nome, cargo e canais pelo cadastro real.

### M02 — Contexto

**Título:** A gestão de saúde e segurança começa pelo seu negócio

**Apoio:** A CRED MHS é uma Operadora de Saúde e Segurança do Trabalho com atuação nacional e experiência multissetorial. Nossa equipe entende as necessidades de cada empresa para propor soluções na medida certa.

**Pergunta:** O que merece mais atenção na sua operação hoje?

**Instrução:** Você pode escolher até duas prioridades.

**Opções:** Saúde Ocupacional / Segurança do Trabalho / Gestão e Tecnologia / Treinamentos

**Personalização opcional:** Personalizar com o nome da empresa

**Campo:** Nome da empresa

**Placeholder:** Como sua empresa se chama?

**Apoio do campo:** Opcional. O nome será usado para organizar sua pauta nesta apresentação.

**Confirmação com escolhas:** Vamos destacar essas frentes ao longo da apresentação.

**CTA:** Continuar

**Alternativa:** Conhecer a atuação completa

**Limite de seleção:** Para escolher outra prioridade, remova uma das duas selecionadas.

**Transição:** Conheça a estrutura que sustenta essa atuação.

**Fonte:** slides 2, 4 e 5. Pergunta e estados são copy nova.

### M03 — Capacidade

**Título:** Estrutura nacional para apoiar sua operação

**Apoio:** Unidades, rede credenciada e equipe multidisciplinar sustentam a atuação da CRED em saúde e segurança do trabalho.

**Indicadores do slide 17:**

| Exibição proposta | Qualificador obrigatório |
|---|---|
| 16 | Unidades |
| +700 | Clínicas credenciadas |
| +550 mil | Vidas gerenciadas |
| +5 mil | Clientes atendidos |

**Alcance textual:** Atuação nacional

**Nota interna:** idade e “27 Estados Atendidos” seguem tratamento do documento 07. Não inventar data-base. Nunca reescrever “clientes atendidos” como “clientes ativos”.

**CTA:** Conhecer a estrutura

**Detalhe — Equipe multidisciplinar:** Engenheiros do Trabalho, Técnicos de Segurança e profissionais de áreas afins participam da implantação e adequação das soluções de Segurança do Trabalho.

**Detalhe — Recursos próprios:** A CRED dispõe de parque próprio de equipamentos tecnológicos para realização de medições.

**Detalhe — Atendimento na empresa:** O portfólio inclui exames ocupacionais in company.

**Transição:** Essa atuação está presente no percurso de empresas de diferentes contextos.

**Fontes:** slides 6, 7, 8, 11 e 17. Métricas são declarações da apresentação recebida.

### M04 — Empresas

**Título:** Empresas no percurso da CRED

**Apoio:** Conheça algumas das empresas apresentadas na trajetória comercial da CRED MHS.

**CTA:** Ver outras empresas

**Recolher:** Mostrar menos empresas

**Relação textual recebida:** Cervantes; Cimento Nacional; Ápia; Caparaó; Cencosud; Loja Elétrica Ltda.; SG Ompi; PER’FA alimentos; Hyatt; Grupo Sotreq; Storm Group; Minalba Brasil; Radix — Engenharia e Software; Aliança — A nova geração da energia.; Banco BMG; Tora; Orguel; Guará; Economart Atacadista; Nacional Gás; Villefort Atacadista; Trigo; Radisson — Barra Rio de Janeiro; Hotel Santa Teresa — MGallery Rio; Grupo Iter; HN Hotel Nacional — Rio de Janeiro; Ferrareze & Freitas Advogados; Rede Manaus; Ombrello; Fairmont — Rio de Janeiro Copacabana; Dom Atacadista; Caixa — Caixa Econômica Federal; Cimed; Brasfrigo; JIA Group; CSN; Cesari.

**Nota interna:** o PPTX contém marcas incorporadas em imagem além da transcrição. Conferir antes de declarar a lista completa. Não redesenhar logos a partir de texto. Texto com o nome pode ser fallback editorial discreto enquanto o arquivo correto não estiver disponível.

**Fonte:** slide 16. A relação não prova resultados nem confirma contratos vigentes.

### M05 — Ecossistema

**Título:** Soluções conectadas à realidade da sua empresa

**Apoio:** Saúde Ocupacional, Segurança do Trabalho, Gestão e Tecnologia e Treinamentos compõem um ecossistema de serviços integrados e adaptáveis às necessidades da sua operação.

**Marcador de prioridade:** Sua prioridade

**Controles:** Ver serviços / Ocultar serviços / Adicionar à conversa / Remover da conversa

### Frente 1 — Saúde Ocupacional

**Síntese:** Programas, exames e ferramentas de acompanhamento da saúde do trabalho.

**Detalhe:** A atuação reúne documentos, gestão de exames, relatórios, softwares, soluções customizadas de dados e consultoria especializada para apoiar a gestão de saúde do trabalho.

**Serviços:**

- PCMSO
- ASO — Atestado de Saúde Ocupacional
- Relatório Anual
- PPP — Perfil Profissional Previdenciário
- Gestão dos Exames Ocupacionais
- Gestão de Convocação de Periódicos
- Exames Ocupacionais In Company

**Aprofundamento técnico:** O material apresenta a solução como voltada à organização e ao controle dos requisitos da NR-7, com documentos obrigatórios e ferramentas auxiliares de gestão.

**Nota interna:** na redação pública, remover “O material apresenta” somente após revisão técnica, sem ampliar a afirmação. Não introduzir norma nova. O inventário original permanece em `sources/`.

**Fonte:** slide 7. Correções editoriais: “Annual” para “Anual” e plural de “Periódicos”.

### Frente 2 — Segurança do Trabalho

**Síntese:** Equipe multidisciplinar e soluções para implantação e gestão de segurança.

**Detalhe:** Engenheiros do Trabalho, Técnicos de Segurança e profissionais de áreas afins apoiam a implantação, a adequação e a auditoria dos requisitos de Segurança do Trabalho.

**Serviços:**

- PGR/GRO
- PCMAT
- LTCAT
- CIPA
- Perícias
- Laudos de Insalubridade e Periculosidade
- Ordens de Serviço
- Gestão de EPI

**Fonte:** slide 8. Siglas mantidas como inventário do material, sujeitas à revisão técnica da CRED.

### Frente 3 — Gestão e Tecnologia

**Síntese:** Sistemas, dados e indicadores para acompanhar a operação.

**Detalhe:** A CRED trabalha com customização de dados, desenvolvimento de indicadores e mentoria para ativação de módulos do sistema de gestão. A atuação também apoia a aprendizagem dos profissionais técnicos e especialistas.

**Recursos:**

- Integração com softwares ERP
- Interface online para importação e exportação de dados
- Gestão Eletrônica de Documentos
- Assinatura digital
- Aplicativo móvel
- Acervo fotográfico
- Saúde remota
- Tecnologia de biometria
- Sistema em nuvem

**Nota interna:** “100%” e afirmações ISO/LGPD ficam preservadas na fonte e no registro de fatos. Evitar distribuir certificações como se fossem funcionalidades de software. Nenhum recurso deve ganhar escopo não descrito na fonte.

**Fonte:** slide 9.

### Frente 4 — Treinamentos

**Síntese:** Central EAD integrada à gestão de cursos e registros.

**Detalhe:** A central de treinamentos reúne mais de 77 cursos e integra a emissão e gestão de certificados, conteúdo programático e listas de presença ao software de gestão.

**Recursos complementares:** Mapeamento dos treinamentos normativos e automação dos personalizados, com acesso multiplataforma.

**CTA do catálogo:** Ver temas de treinamento

**Temas do slide 10:**

- NR-01 — Disposições Gerais
- NR-05 — CIPA
- NR-06 — Equipamento de Proteção Individual
- NR-10 — Segurança Elétrica
- NR-10 — SEP, Sistema Elétrico de Potência
- NR-11 — Transporte, Movimentação, Armazenagem e Manuseio de Materiais
- NR-12 — Segurança no Trabalho em Máquinas e Equipamentos
- NR-13 — Segurança na Operação de Caldeiras
- NR-17 — Ergonomia
- NR-20 — Segurança no Trabalho com Inflamáveis e Combustíveis
- NR-33 — Segurança e Saúde em Espaço Confinado
- NR-35 — Trabalho em Altura

**Nota interna:** o material declara conformidade com requisitos da NR-1. Manter registro da afirmação, sem transformar a página em certificação jurídica do catálogo. Não inferir que os 77 cursos correspondem a 77 NRs.

**Fonte:** slide 10.

### Soluções adicionais

**Título:** Outras necessidades da operação

**Apoio:** Conheça outras soluções apresentadas no portfólio da CRED.

**Catálogo completo:**

- Gestão de Absenteísmo
- Monitoramento por Telemedicina
- Administração de Ambulatórios
- Plano de Continuidade de Negócios
- Locação de Mão de Obra
- Locação de Veículo de Urgência e Emergência
- Análise Ergonômica
- Campanhas Vacinais
- Ginástica Laboral e afins
- SIPAT Digital

Cada item pode ser adicionado individualmente à pauta. Não criar descrição detalhada para um serviço que só aparece pelo nome. Se agrupar, usar agrupamentos editoriais documentados, sem apresentá-los como departamentos oficiais.

**Fonte:** slide 15.

### M06 — Gestão e tecnologia

**Título:** Informações para acompanhar a gestão

**Apoio:** Portal de serviços, integrações com sistemas e indicadores ampliam a visibilidade sobre a operação de saúde e segurança.

**Aspecto 1 — Acompanhamento:** Um portal de serviços online permite ao cliente acompanhar atendimento e SLA.

**Aspecto 2 — Integração:** Recursos de conexão entre sistemas, importação e exportação de dados apoiam a integração da gestão de saúde e segurança.

**Aspecto 3 — Informação gerencial:** Customização de dados, indicadores e integração à Fábrica de Power BI apoiam a visão da gestão.

**Legenda do recurso animado:** Visão conceitual das capacidades de gestão

**CTA:** Explorar recursos de tecnologia

**Detalhe complementar:** Teleatendimento e telediagnóstico; gestão eletrônica de documentos; assinatura digital; aplicativo móvel; acervo fotográfico; saúde remota; biometria; sistema em nuvem; central EAD integrada.

**Controles da sequência:** Acompanhamento / Integração / Informação gerencial

**Atalho:** Ir para aplicações

**Fontes:** slides 9, 10, 11 e 12. Não afirmar que todos os recursos existem em uma única tela ou que todos estão incluídos em qualquer contrato.

### M07 — Aplicações

**Título:** Qual necessidade vamos aprofundar?

**Apoio:** Explore frentes que se aproximam da realidade da sua empresa.

### eSocial

**Síntese:** Integração entre a gestão de saúde e segurança, com recursos de conexão entre sistemas.

**Detalhe:** O sistema de gestão online descrito pela CRED interliga seus locais de atendimento e integra informações de saúde e segurança, com parametrização para o eSocial e recursos de integração via webservice com sistemas ERP.

**Fonte:** slides 11 e 12. O número de quatro soluções citado no slide 11 não autoriza inventar quatro modalidades.

### Gestão de FAP/NTEP

**Síntese:** Integração de informações e acompanhamento das etapas do processo.

**Detalhe:** A solução apresentada permite acompanhar as etapas do processo pelos envolvidos, com integração entre sistemas de gestão de saúde e segurança.

**Fonte:** slide 13. Não prometer redução de alíquota, economia ou contestação automática. A relação exata entre os sistemas precisa de confirmação para detalhamento técnico.

### Riscos Psicossociais

**Síntese:** Programa de Vigilância Epidemiológica estruturado sob medida.

**Detalhe:** Programa desenvolvido para a realidade da empresa e integrado às demais legislações e iniciativas sobre o tema.

**Fonte:** slide 14. Preservar a referência “Riscos Psicossociais NR1” no inventário. Não atribuir ao programa o nome VIVA por inferência.

**Controles comuns:** Conhecer a solução / Adicionar à conversa / Remover da conversa

**Alternativa:** Ver outras soluções

### M08 — Confiança

**Título com credenciais documentadas:** Referências de qualidade e gestão

**Conteúdo:** ISO 27001, ISO 9001:2015 e ISO 45001, condicionadas aos dados de titularidade, escopo e validade. Cada credencial usa somente a descrição documental fornecida.

**LGPD:** tratar separadamente. Não criar selo de “certificação LGPD”.

**Fallback sem credenciais prontas:**

**Título:** Pessoas e estrutura para apoiar a gestão

**Apoio:** Equipe multidisciplinar, equipamentos próprios e recursos de acompanhamento fazem parte da atuação apresentada pela CRED.

**Nota interna:** usar um dos estados. Não exibir selo pendente, botão sem documento ou aviso de produção para o prospect. O fallback não elimina as referências originais do inventário.

**Fontes:** slides 8, 11 e 18.

### M09 — Pauta

**Título com empresa:** Uma conversa sobre {empresa}

**Título sem empresa:** Uma conversa sobre a sua operação

**Apoio:** Estas são as prioridades e os assuntos que você selecionou para conversar com {executivo.primeiroNome}.

**Grupo 1:** Suas prioridades

**Grupo 2:** Assuntos para aprofundar

**Rótulos:** Editar prioridades / Explorar mais soluções / Remover assunto / Limpar escolhas

**Estado vazio:** Podemos começar entendendo sua operação. Se preferir, explore as soluções e selecione os assuntos que deseja conversar.

**CTA:** Preparar a conversa

**Observação comercial:** A seleção organiza nossa conversa. O escopo da atuação será discutido com a sua empresa.

### M10 — Contato

**Título:** Vamos conversar sobre a sua empresa?

**Apoio:** Podemos entender suas necessidades e pensar juntos como a CRED MHS pode integrar sua gestão.

**Contato documentado:**

- Sabrina Ferreira
- Executiva de Negócios
- +55 (21) 98896-7369
- sabrina.ferreira@credmhs.com.br
- https://www.linkedin.com/in/sabrinaferreira
- https://www.credmhs.com.br

**CTA primário inicial:** Preparar e-mail para Sabrina

**Alternativas:** Copiar pauta / Ligar para Sabrina / Ver LinkedIn

**CTA WhatsApp condicionado a confirmação:** Conversar com Sabrina pelo WhatsApp

**Título da prévia:** Sua mensagem

**Mensagem com contexto:**

Olá, {executivo.primeiroNome}!

Conheci a apresentação da CRED MHS e gostaria de conversar sobre {empresaOuMinhaEmpresa}.

Prioridades: {prioridades}.

Assuntos para aprofundar: {assuntos}.

Podemos conversar sobre como a CRED pode apoiar nossa gestão?

**Mensagem sem escolhas:**

Olá, {executivo.primeiroNome}!

Conheci a apresentação da CRED MHS e gostaria de conversar sobre as necessidades da minha empresa e como a CRED pode apoiar nossa gestão.

**Regra:** omitir linhas de prioridades/assuntos quando vazias. Permitir editar a mensagem antes de abrir e-mail ou WhatsApp. O contato externo não envia automaticamente.

**Controles:** Editar mensagem / Abrir meu e-mail / Copiar mensagem / Voltar

**Feedback:** Pauta copiada. / Mensagem copiada. / Não foi possível copiar automaticamente. Selecione e copie o texto abaixo.

### Navegação e estados globais

**Menu:** Conteúdo

**Capítulos:** Apresentação / Suas prioridades / Estrutura / Empresas / Ecossistema / Gestão e tecnologia / Aplicações / Confiança / Sua pauta / Contato

**Atalho de acessibilidade:** Pular para o conteúdo

**Resumo persistente discreto:** Sua pauta ({quantidade})

**Reset:** Nova apresentação *(instrução de Nil, 2026-10-10; antes "Reiniciar apresentação")*

**Confirmação:** Começar uma nova apresentação apaga o nome da empresa, as prioridades e a pauta desta sessão. O executivo continua o mesmo.

**Ações de confirmação:** Começar nova / Continuar apresentação

**Fechar detalhe:** Fechar

**Nenhum fluxo usa:** diagnóstico concluído, perfil calculado, solução ideal, garantia de economia, pacote contratado ou mensagem enviada.
