# Direção de implementação

> **Superado em 20/10/2026 pela V3 (`docs/V3-CONTRATO.md` + PPT da Sabrina). Mantido como histórico; não usar como requisito.**

> **Superado em parte pela V2 (14/10/2026).** Autoridade: `docs/REVISAO-CRED-MHS-V2.md` (rev. 2.1) e `docs/V2-CONTRATO.md`. Módulos de prioridades, assuntos, pauta, mensagem e estado de sessão citados abaixo foram retirados. O texto antigo fica como histórico.

## Mapa de módulos V2

| Responsabilidade | Arquivos |
|---|---|
| Entrada e resolução do executivo | `src/main.tsx`, `src/app/PresentationRoot.tsx`, `src/lib/executive.ts`, `src/lib/supabase/{publicProfile,mapping,slug,config}.ts` |
| Contexto do executivo (sem sessão do visitante) | `src/state/ExecutiveContext.tsx` (`ExecutiveProvider`, `useExecutive`, `useExecutiveResolution`), `src/state/legacySession.ts` (remove a sessão da V1) |
| Composição da página | `src/app/App.tsx` (header, oito dobras, footer) |
| Navegação | `src/app/chapterIndex.ts`, `src/app/useCurrentChapter.ts`, `src/components/ui/ChapterNavigation.tsx` (`scrollToChapter`) |
| Dobras | `src/components/sections/v2/` — `Abertura`, `Institucional`, `Relacionamento`, `Dados`, `GestaoIntegrada`, `Trilha`, `Solucoes`, `Contato` |
| Tipos | `src/types/index.ts` (fatos, clientes, credenciais, executivo) + `src/types/presentation.ts` (capítulos, eixos, trilha, contatos) |
| Conteúdo | `src/content/chapters.ts` (copy e índice), `solutions.ts` (quatro eixos), `valueTrail.ts` (cinco etapas), `facts.ts`, `clients.ts`, `credentials.ts`, `coverage.ts`, `executives.ts` |
| Contatos | `src/lib/personalization.ts` → `contactLinks(executive): ContactLinksV2` |
| Telas de estado | `src/app/status/` (carregando, não encontrada, indisponível, erro) |
| Painel (fora do escopo da V2) | `src/painel/**`; `Preview.tsx` usa `copy.abertura` e `copy.contato` |
| Verificações | `src/lib/__checks__.ts`, `supabase/tests/rls.test.mjs` |

Removidos na V2: `src/state/store.ts`, `src/state/usePresentationState.ts`, `src/lib/validateState.ts`, `src/components/ui/TopicToggle.*`, `src/components/ui/Dialog.*` e as funções `getHighlights`, `getActiveArea`, `getAgenda`, `buildAgendaText`, `buildMessage`.

---

## Histórico V1 (superado)

## Antes de criar arquivos de aplicação

Inspecionar o repositório, suas instruções, dependências, comandos e skills. Se já houver aplicação, integrar o trabalho aos padrões existentes. Não apagar configuração, substituir gerenciador de pacotes ou criar projeto aninhado sem necessidade.

Este kit não contém aplicação pronta nem dependências instaladas. Não afirmar que build ou testes passaram apenas pela presença dos documentos.

## Organização sugerida

A organização abaixo é uma referência de responsabilidades. Adaptar nomes de diretórios ao framework instalado.

| Área | Responsabilidade |
|---|---|
| `src/app` ou entrada equivalente | Composição da página e resolução do perfil |
| `src/components/sections` | M01–M10, separados por responsabilidade |
| `src/components/ui` | Controles compartilhados, acordeão, diálogo, índice e botões |
| `src/content` | Copy, catálogo, indicadores, clientes, credenciais e executivos |
| `src/state` | Estado de personalização, persistência e reset |
| `src/lib` | Resolver perfil, validar estado, preparar mensagem e contatos |
| `src/styles` | Tokens da marca e estilos compartilhados |
| `remotion` ou diretório equivalente | Composição-fonte da mídia pontual |
| `public/media` | Somente ativos selecionados e otimizados |
| `qa` | Capturas e relatório de validação |

Os diretórios de aplicação serão criados pelo Claude, conforme a stack real. `sources/`, `docs/`, originais de `assets/` e material interno não devem ser servidos ao visitante.

## Dados de conteúdo

Separar conteúdo de renderização. Usar IDs estáveis para capítulos, frentes, serviços, aplicações e executivos. Não buscar texto da documentação em runtime. Converter a copy para estrutura explícita e tipada na implementação.

### Campos recomendados

| Entidade | Campos |
|---|---|
| Chapter | id, title, body, sourceSlides, contentKey |
| ServiceArea | id, label, summary, detail, services, sourceSlides |
| Topic | id, label, type, sourceSlides |
| Fact | id, value, qualifier, sourceSlides, verificationStatus, displayPolicy |
| Client | id, name, logo, sourceSlides, relationshipStatus |
| Credential | id, label, holder, scope, validity, asset, verificationStatus |
| Executive | Campos completos do documento 03 |

Statuses devem distinguir `source-supplied`, `confirmed`, `conflict` e `missing`. Não marcar dado como confirmado porque o Claude o transcreveu. Política de exibição fica separada do status factual.

A correspondência fonte/destino precisa ser verificável. Manter uma relação de cobertura que inclua também conteúdo preservado só no inventário, conteúdo condensado e conteúdo retido por pendência.

## Componentes de experiência

- `ExecutiveIntro`: identidade e entrada.
- `PrioritySelector`: escolhas e nome opcional.
- `CapacitySection`: evidências de estrutura.
- `ClientGallery`: relação de marcas.
- `EcosystemExplorer`: frentes, catálogos e seleção.
- `ManagementStory`: três aspectos e motion.
- `ApplicationsSection`: temas especializados.
- `TrustSection`: credenciais ou fallback.
- `ConversationSummary`: revisão da pauta.
- `ExecutiveContact`: prévia da mensagem e canais.
- `ChapterNavigation`: orientação e atalhos.

São nomes sugeridos. Não criar abstrações extras só para espelhar a documentação.

## Estado e navegação

Preferir um estado de sessão simples adequado à stack, sem banco de dados. URL identifica apenas executivo e capítulo. Nome da empresa, escolhas e rascunho não vão para parâmetros de URL.

Acordeões e leitura de detalhe podem usar componentes nativos ou bibliotecas já existentes. No desktop, usar painel lateral/modal apenas quando fizer sentido. No celular, priorizar expansão no fluxo para textos longos. Dialogs mantêm foco, fecham por Escape e devolvem foco ao botão de origem.

## Sequência de trabalho

### 1. Inventário e fundação

Ler documentos, inspecionar identidade, resolver stack e skills. Criar tokens, dados, capítulos e navegação. Registrar pendências reais sem inventar ativos.

### 2. Composição de referência

Construir M01, M03 e M05 para testar retrato, números e interação na mesma linguagem. Inspecionar desktop e mobile e corrigir proporções. Continuar a implementação sem esperar aprovação formal, salvo se Nil pedir uma pausa.

### 3. Página completa

Implementar M02, M04 e M06–M10 com a copy e todos os aprofundamentos. Conferir cobertura de fontes. Página precisa funcionar inteira antes do refinamento de motion.

### 4. Personalização

Resolver executivo, escolhas, assuntos, resumo, mensagem e reset. Verificar os casos do documento 03. Não conectar serviços externos para simular um fluxo.

### 5. Motion

Aplicar scroll de M06 e produzir recurso Remotion, respeitando fallback e redução de movimento. Não adicionar animações em toda a página apenas porque a stack permite.

### 6. QA e entrega local

Executar verificações disponíveis, revisar as larguras indicadas, corrigir problemas, registrar evidências e entregar instruções reais para iniciar/abrir a aplicação.

## Ativos

Selecionar os arquivos adequados de `assets/`. Preservar os originais. Criar derivados otimizados em `public/media/`. Confirmar que o processo de build não copia indiscriminadamente os documentos ou o PPTX para a saída pública.

Fontes locais devem usar formatos adequados ao projeto e carregar só pesos necessários, respeitando arquivos e uso fornecidos. Não baixar outra fonte por conveniência se a identidade já trouxer uma.

## Limites de integração

- Não implementar CRM, envio de formulário, analytics ou coleta automática.
- E-mail, telefone e links externos funcionam como ações iniciadas pelo visitante.
- WhatsApp exige campo de configuração confirmado.
- Não criar credenciais, chaves ou variáveis de ambiente fictícias.
- Não publicar nem configurar domínio nesta tarefa.

## Relatório final do Claude

Descrever aplicação entregue, comando real de execução, endereço local quando disponível, interações verificadas, larguras inspecionadas, testes executados e pendências. Distinguir falha de ferramenta de falha da aplicação. Não usar notas subjetivas de qualidade como evidência.
