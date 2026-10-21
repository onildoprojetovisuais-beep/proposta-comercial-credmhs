# V2 — Contrato de implementação e divisão de arquivos

> **Superado em 20/10/2026 pela V3 (`docs/V3-CONTRATO.md` + PPT da Sabrina). Mantido como histórico; não usar como requisito.**

Data: 14/10/2026. Autoridade: `docs/REVISAO-CRED-MHS-V2.md` (rev. 2.1). Coordenador: agente principal do Claude Code.
Snapshot da V1 antes das mudanças: `historico/v1-antes-da-v2-2026-10-14.tar.gz` (src, docs, qa sem capturas, config).

## 1. Sequência e IDs

| # | `ChapterId` (= `id` do `<section>` = hash) | Componente | Rótulo do índice | Superfície sugerida |
|---|---|---|---|---|
| 01 | `abertura` | `src/components/sections/v2/Abertura.tsx` | Apresentação | amarela |
| 02 | `institucional` | `…/v2/Institucional.tsx` (números + empresas) | CRED MHS | branca |
| 03 | `relacionamento` | `…/v2/Relacionamento.tsx` | Relacionamento | amarela |
| 04 | `dados` | `…/v2/Dados.tsx` | Dados | branca |
| 05 | `gestao-integrada` | `…/v2/GestaoIntegrada.tsx` | Gestão integrada | preta (contraste pontual) |
| 06 | `trilha` | `…/v2/Trilha.tsx` (cinco etapas) | Trilha de valor | branca ou amarela |
| 07 | `solucoes` | `…/v2/Solucoes.tsx` (quatro eixos + sub-bloco de rede) | Soluções | branca |
| 08 | `contato` | `…/v2/Contato.tsx` | Contato | amarela |

Superfícies são sugestão do coordenador; o Agente 2 decide com a regra da revisão §9 (amarelo `#FFCA00`, branco, preto; sem creme/amarelo claro dominante; preto pontual).

Hashes da V1 (`#m01`…`#m10`, `#ecossistema` etc.) caem no capítulo equivalente via `chapters[].legacyHashes`.

## 2. Contratos de código

- Tipos V2: `src/types/presentation.ts` (dono: coordenador). `ChapterId`, `CHAPTER_ORDER`, `SolutionAxis`, `InventoryItem`, `ValueStep`, `ContactLinksV2`.
- Copy pública: `src/content/chapters.ts` → `copy.abertura | institucional | relacionamento | dados | gestaoIntegrada | trilha | solucoes | contato | global` e `chapters` (índice). Texto da revisão §7, sem notas internas.
- Eixos: `src/content/solutions.ts` → `export const solutionAxes: readonly SolutionAxis[]` (ordem: normativo, reputacional, gestao, inovacao).
- Trilha: `src/content/valueTrail.ts` → `export const valueTrail: readonly ValueStep[]` (ordem 1–5).
- Números: `src/content/facts.ts` → `capacityFacts` (inalterado: 16 unidades, +700 clínicas, +550 mil vidas, +5 mil clientes) e `reachText` ("Atuação nacional"). Não alterar valores nem política de exibição.
- Empresas: `src/content/clients.ts` (`featuredClients`, `otherClients`) + `src/components/sections/m04/clientLogos.ts` (mapa de logos; mover para `v2/` se o Agente 2 quiser, mantendo o conteúdo).
- Executivo nas seções: `import { useExecutive } from '../../../state'` → `Executive` resolvido (tipo em `src/types/index.ts`). Sem store de sessão.
- Contatos: `import { contactLinks } from '../../../lib'` → `contactLinks(executive: Executive): ContactLinksV2`. Sem corpo de mensagem, sem seleções.
- `SectionId` (em `SectionShell`) passa a ser `ChapterId` de `src/types/presentation.ts`.
- `scrollToChapter(id: ChapterId)` e `ChapterNavigation({ chapters, currentId, menuLabel })` continuam exportados por `src/components/ui`.
- Seções: default export sem props, `<section id={ChapterId}>` via `SectionShell` (ou equivalente com `aria-labelledby` e `tabIndex={-1}`).

## 3. Arquivos exclusivos por agente

**Coordenador:** `src/types/presentation.ts`, `src/app/App.tsx`, `src/app/App.module.css`, `src/content/index.ts`, `src/main.tsx`, `CLAUDE.md`, `docs/V2-CONTRATO.md`, `docs/STATUS-IMPLEMENTACAO.md`, `docs/06-qa.md`, `qa/RELATORIO.md`, remoção final das seções V1 (`src/components/sections/M*.tsx` e subpastas `m01`…`m10`), integração e builds.

**Agente 1 — conteúdo e rastreabilidade:** `src/content/chapters.ts` (ajustes de fluidez dentro dos limites da revisão), `src/content/solutions.ts` (novo), `src/content/valueTrail.ts` (novo), `src/content/coverage.ts`, `src/content/facts.ts` (só metadados internos), `src/content/clients.ts`, `src/content/credentials.ts`; remoção de `src/content/priorities.ts`, `topics.ts`, `ecosystem.ts`, `applications.ts` depois de migrar o inventário. Docs: `docs/00-briefing.md`, `docs/01-experiencia.md`, `docs/02-copy.md`, `docs/07-fontes-e-pendencias.md`, `docs/V2-MAPEAMENTO-FRAMEWORKS.md` (novo), `docs/guia/GUIA-DA-APRESENTACAO.md` (texto e roteiro; capturas ficam com o coordenador).

**Agente 2 — composição visual:** `src/components/sections/v2/**` (novo), `src/components/ui/SectionShell.*`, `SectionHeader.*`, `Button.*`, `Accordion.*`, `icons.tsx`, `src/styles/tokens.css`, `src/styles/global.css`, `public/media/**` (somente leitura/reuso; sem novos renders). Docs: `docs/04-direcao-visual-e-motion.md`, `docs/STACK.md` (seção de tokens/cores).

**Agente 3 — fluxo público e navegação:** `src/state/**`, `src/lib/personalization.ts`, `src/lib/validateState.ts`, `src/lib/index.ts`, `src/lib/__checks__.ts`, `src/lib/executive.ts` (só se necessário), `src/app/PresentationRoot.tsx`, `src/app/chapterIndex.ts`, `src/app/useCurrentChapter.ts`, `src/app/status/**`, `src/components/ui/ChapterNavigation.*`, `src/components/ui/TopicToggle.*`, `src/components/ui/Dialog.*`, `src/components/ui/index.ts`, `src/types/index.ts` (remoção dos tipos do percurso descartado), `src/painel/components/Preview.tsx` (consumir a nova copy). Docs: `docs/03-personalizacao.md`, `docs/05-implementacao.md`.

Ninguém edita `supabase/**`, `src/lib/supabase/**`, o restante de `src/painel/**`, `vite.config.ts`, `package.json`, `vercel.json` ou `.env*`.

## 4. Regras de execução paralela

- Não executar `npm run build`, `vite build`, renders Remotion ou mais de um navegador ao mesmo tempo. `npx tsc --noEmit -p tsconfig.json` é permitido; erros em arquivos de outro agente são esperados durante a fase B.
- Somente o Agente 2 pode manter um servidor `vite` de desenvolvimento (porta 5174) e um navegador para conferir a composição.
- Precisa de mudança fora dos seus arquivos? Descrever no relatório final; o coordenador integra.
- Nada de publicação, deploy, envio de mensagem, CRM, analytics ou serviço remoto.

## 5. Proibições de conteúdo (revisão §5, §7, §8)

Sem IA, análise preditiva, previsão de afastamentos, ROI, economia, certificação ESG/ISO, conformidade universal, SLA, 24 h, prazos ou frequência de reuniões. Investimento é etapa da trilha, nunca quinto eixo/pacote. Reputacional é entrega para a empresa cliente (liderança, RH, comunicação, percepção), não prova social da CRED MHS. 3C/3I não viram etapas. Nada de “Você levou laudo ou estratégia?” nem “O CEO perguntou: isso traz retorno?”. “OK’s e KPI’s” → “indicadores” na copy pública.
