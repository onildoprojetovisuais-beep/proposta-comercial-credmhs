# Workspace CRED MHS

Kit de direção para implementar uma apresentação comercial web no Claude Code.

## Começar

1. Abra esta pasta no VS Code ou copie seu conteúdo para a raiz do repositório escolhido. Se já existir `CLAUDE.md`, mescle as instruções sem apagar as regras do projeto.
2. Coloque a identidade visual em `assets/brand/`. Inclua manual, logos e fontes, se disponíveis.
3. Coloque fotos e ativos nas demais pastas indicadas em `assets/README.md`.
4. Abra o Claude Code na raiz. Use o comando de `INICIAR-CLAUDE.md`.

Os arquivos de origem e a análise anterior já acompanham o kit. Este pacote contém a documentação e as pastas de trabalho. O Claude criará a aplicação no repositório local usando a stack disponível.

## Arquivos e responsabilidades

| Caminho | Papel |
|---|---|
| `CLAUDE.md` | Instruções principais, ordem de leitura e limites de escopo |
| `INICIAR-CLAUDE.md` | Comando pronto para iniciar |
| `docs/00-briefing.md` | Objetivo, público, posicionamento e escopo |
| `docs/01-experiencia.md` | Sequência da página e interações por momento |
| `docs/02-copy.md` | Texto da interface e conteúdo dos aprofundamentos |
| `docs/03-personalizacao.md` | Perfis, estado, escolhas e resumo final |
| `docs/04-direcao-visual-e-motion.md` | Identidade, composição, scroll e Remotion |
| `docs/05-implementacao.md` | Organização do código, dados e ordem de execução |
| `docs/06-qa.md` | Critérios de validação visual e funcional |
| `docs/07-fontes-e-pendencias.md` | Rastreabilidade, divergências e tratamento dos dados |
| `assets/README.md` | Onde colocar cada ativo |
| `sources/briefing-original.txt` | Briefing recebido, sem reescrita |
| `sources/apresentacao-original.md` | Transcrição original dos 19 slides |
| `sources/apresentacao-original.pptx` | Referência visual e ativos do material original |
| `sources/analise-e-arquitetura.md` | Análise anterior completa |
| `qa/README.md` | Orientação para guardar as evidências de revisão |

## A experiência em uma frase

O visitante conhece o executivo, indica o que merece atenção na empresa, descobre a capacidade da CRED, explora o ecossistema e monta uma pauta para conversar com aquele executivo.

## Estrutura da página

| Momento | Função | Interação principal |
|---|---|---|
| M01 — Abertura pessoal | Identificar executivo e CRED | Começar a apresentação |
| M02 — Prioridades | Envolver o visitante | Escolher até duas prioridades, opcionalmente informar empresa |
| M03 — Estrutura | Demonstrar capacidade | Explorar estrutura operacional |
| M04 — Empresas | Prova social | Ampliar relação de marcas |
| M05 — Ecossistema | Entender a oferta | Abrir frentes e selecionar assuntos para a conversa |
| M06 — Gestão e tecnologia | Mostrar como a gestão é apoiada | Explorar três aspectos em uma sequência de scroll |
| M07 — Aplicações | Aprofundar necessidades | Abrir eSocial, FAP/NTEP e riscos psicossociais |
| M08 — Confiança | Apresentar referências | Consultar credenciais quando documentadas |
| M09 — Sua pauta | Materializar personalização | Revisar e editar assuntos selecionados |
| M10 — Contato | Continuar com o executivo | Preparar e-mail, copiar pauta ou usar canal confirmado |

## Onde colocar a identidade

`assets/brand/` recebe o material original. Essa pasta é de trabalho e não deve ser publicada inteira. O Claude seleciona apenas os arquivos necessários e cria os ativos públicos otimizados na aplicação.

## Decisões desta versão

- Um link pode identificar cada executivo. Só Sabrina possui dados documentados neste kit.
- Personalização por escolhas explícitas, sem IA de diagnóstico ou recomendação clínica.
- A identidade fornecida por Nil prevalece sobre sugestões de estilo.
- Scroll concentra a explicação de gestão em um único trecho. Mobile tem leitura em fluxo.
- Remotion produz um recurso visual pontual, sem transformar a página inteira em vídeo.
- Implementação e validação locais. Publicação, CRM e envio automático ficam fora deste início.
