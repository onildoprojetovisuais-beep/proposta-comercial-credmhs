# Roteiro da experiência

> **Superado em 20/10/2026 pela V3 (`docs/V3-CONTRATO.md` + PPT da Sabrina). Mantido como histórico; não usar como requisito.**

> **Superado em parte pela V2 (14/10/2026).** Autoridade atual: `docs/REVISAO-CRED-MHS-V2.md` (rev. 2.1), `docs/V2-CONTRATO.md` e `docs/V2-MAPEAMENTO-FRAMEWORKS.md`. Este documento fica como histórico onde conflitar.
>
> **Nova jornada (oito dobras, por rolagem, sem formulário):** 01 Abertura do executivo (foto, nome, cargo) → 02 CRED MHS institucional (números e empresas) → 03 Relacionamento (com quem contar) → 04 Dados (informação dispersa → organizada) → 05 Gestão integrada (ponte para o eixo Reputacional) → 06 Trilha de valor (Normativo → Reputacional → Gestão → Inovação → Investimento) → 07 Soluções em quatro eixos (Normativo, Reputacional, Gestão, Inovação) + abrangência nacional → 08 Contato direto com o executivo.
>
> Retirados: campo de empresa, prioridades, “Adicionar à conversa”, pauta, mensagem gerada, “Nova apresentação”, triângulo como metodologia e as quatro frentes como organização das soluções.
>
> Os momentos M01–M10 abaixo descrevem a V1.

## Estrutura global

Uma página com dez momentos, índice discreto e contato disponível. Desktop pode ter capítulos no canto/lateral; celular usa um botão “Conteúdo” que abre uma lista curta. O índice não ocupa uma faixa dominante.

O visitante avança por scroll nativo ou pelos links de continuidade. O hash identifica o capítulo. Ao abrir detalhes, preserve posição e retorne o foco ao acionador ao fechar. Conteúdo principal não depende de JavaScript de animação para ficar visível.

## M01 — Encontro com o executivo

**Pergunta respondida:** quem vai conversar comigo?

**Cena:** retrato real, nome, cargo e apresentação breve. Marca da CRED visível, subordinada à composição humana, mas imediatamente identificável.

**Ação:** “Conhecer a CRED” avança a M02. Sem captura de e-mail, telefone ou login.

**Personalização:** perfil resolvido por `?executivo=sabrina-ferreira`. Sem parâmetro, usar Sabrina. Perfil desconhecido usa Sabrina como fallback, sem quebrar o contato.

**Mobile:** texto e retrato se recompõem sem cortar rosto. CTA aparece próximo do apoio.

## M02 — Prioridades do visitante

**Pergunta respondida:** o que é relevante para minha empresa?

**Cena:** título de posicionamento, apoio institucional curto e a pergunta “O que merece mais atenção na sua operação hoje?”.

**Ações:** escolher até duas prioridades entre Saúde Ocupacional, Segurança do Trabalho, Gestão e Tecnologia e Treinamentos. “Conhecer a atuação completa” segue sem escolha. Campo opcional “Nome da empresa” em uma área discreta, sem aparência de formulário de lead.

**Resposta visível:** as opções mudam de estado, aparece uma confirmação curta e o CTA “Continuar”. Nada avança automaticamente ao selecionar.

**Personalização:** escolhas destacam frentes de M05 e alimentam a pauta. Uma escolha nunca oculta outras soluções. Evitar repetir o nome da empresa em todos os títulos.

**Mobile:** opções grandes, clicáveis, com seleção perceptível além da cor. Sem carrossel obrigatório para ver as quatro.

## M03 — Capacidade

**Pergunta respondida:** a CRED tem estrutura para nos acompanhar?

**Cena:** composição com números, alcance nacional e um detalhe de estrutura. Valores são do slide 17, com status tratado em `07-fontes-e-pendencias.md`.

**Ação:** “Conhecer a estrutura” abre equipe multidisciplinar, equipamentos próprios e exames in company. A leitura principal já entrega as evidências essenciais.

**Não fazer:** endereços inventados no mapa, quantidade de clínicas transformada em unidades próprias, indicadores somados, projeções ou contadores longos que atrasem a leitura.

## M04 — Prova social

**Pergunta respondida:** com que empresas essa atuação se relaciona?

**Cena:** seis a oito marcas legíveis, com proporções preservadas. A seleção só usa marcas existentes nos arquivos ou fornecidas por Nil.

**Ação:** “Ver outras empresas” abre a relação completa em uma área navegável. Sem ticker obrigatório. Sem inventar resultados ou depoimentos a partir de um logotipo.

**Mobile:** mostrar marcas em escala útil, não miniaturizar o mosaico do PPTX.

## M05 — Exploração do ecossistema

**Pergunta respondida:** o que a CRED pode oferecer?

**Cena:** quatro frentes tipográficas e um painel editorial de detalhe. A primeira prioridade escolhida define a frente inicialmente aberta. Na ausência de escolha, Saúde Ocupacional é a primeira.

**Ações:** trocar a frente; “Ver serviços” expande seu catálogo; “Adicionar à conversa” inclui um assunto; “Remover da conversa” desfaz a seleção.

**Regra:** clicar para conhecer uma frente não a adiciona automaticamente. Adição exige ação explícita. Todos os detalhes do original têm destino, inclusive os serviços adicionais.

**Desktop:** seletor pode permanecer sticky enquanto o detalhe é lido, limitado à própria seção. Altura do conteúdo é livre.

**Mobile:** acordeões verticais, rótulo e controle de abertura visíveis. Conteúdo extenso expande no fluxo, sem travar o documento.

## M06 — Gestão em movimento

**Pergunta respondida:** como a tecnologia apoia essa atuação?

**Cena:** três aspectos: Acompanhamento; Integração; Informação gerencial. Uma composição visual mantém contexto enquanto o texto muda.

**Interação principal:** scroll em um trecho delimitado no desktop, com marcadores e controles para acessar cada aspecto. `04-direcao-visual-e-motion.md` define comportamento e saída.

**Recurso Remotion:** animação curta que representa a relação entre esses três aspectos, usando a identidade. É um esquema conceitual, sem aparência de demonstração de software real.

**Aprofundamento:** “Explorar recursos de tecnologia” reúne capacidades complementares descritas na copy.

**Mobile/reduced motion:** três blocos em sequência e imagem estática equivalente. Toda informação permanece em HTML.

## M07 — Aplicações específicas

**Pergunta respondida:** existe uma frente que se aproxima da necessidade da minha operação?

**Cena:** eSocial, Gestão de FAP/NTEP e Riscos Psicossociais. São aplicações descritas nos slides 12–14.

**Ações:** expandir o tema e adicionar à conversa. Link “Outras soluções” leva ao catálogo adicional de M05.

**Regra:** nunca rebatizar Riscos Psicossociais como VIVA sem uma orientação nova. Não aplicar as restrições de copy da landing do VIVA ao institucional CRED.

## M08 — Referências de confiança

**Pergunta respondida:** que referências sustentam essa apresentação?

**Cena:** informações de certificações documentadas e proteção de dados, com tratamento de status. Manter LGPD separada das referências ISO.

**Ações:** mostrar detalhes de titularidade, escopo e validade apenas quando fornecidos. Nada de botão vazio “Ver certificado”.

**Fallback:** se faltarem credenciais confirmadas, integrar uma breve retomada da equipe e estrutura reais, sem duplicar métricas nem fazer afirmação de certificação. A seção deve continuar coerente e não exibir pendências internas ao prospect.

## M09 — Pauta para a sua empresa

**Pergunta respondida:** sobre o que vale conversar agora?

**Cena:** título com nome da empresa, se informado, e resumo de prioridades e assuntos adicionados.

**Ações:** remover assunto; rever prioridades; voltar ao ecossistema; limpar escolhas; continuar para contato. Sem score de adequação, preço ou botão “Contratar pacote”.

**Estado vazio:** convite para conversar sobre a operação, com opção de explorar soluções. Não bloquear o contato.

**Sensação desejada:** a pessoa vê uma síntese do que ela escolheu. A interface não afirma ter analisado sua empresa.

## M10 — Continuidade com o executivo

**Pergunta respondida:** como dar o próximo passo?

**Cena:** mesmo executivo da entrada, copy curta, pauta e canal principal.

**Ações iniciais suportadas pelas fontes:** preparar e-mail e copiar pauta. Telefone e LinkedIn como alternativas. WhatsApp só entra se houver confirmação do canal.

**Interação:** mostrar a mensagem antes de abrir o aplicativo externo. Abrir o aplicativo não significa que houve envio. Feedback deve dizer “Mensagem preparada” ou “Pauta copiada”, nunca “Enviado”.

## Uso em reunião

O executivo pode usar o índice para ir direto a um capítulo, alterar prioridades e reiniciar a apresentação para o próximo prospect. Não criar uma rota administrativa ou um segundo site. O reset fica no menu da apresentação e apaga o contexto da sessão.

## Ritmo

Entrada humana, participação, evidência de escala, prova social, exploração, explicação em movimento, aplicações, confiança, síntese e contato. Evitar dez seções com o mesmo layout e a mesma animação.
