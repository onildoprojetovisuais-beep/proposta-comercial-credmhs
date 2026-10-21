# QA funcional, de acessibilidade e de cobertura

- **Data:** 2026-10-08
- **Ambiente:** Windows 11, Chromium headless (Playwright Python 1.61). Testes feitos em `vite preview` servindo uma **cópia congelada** do `dist/` gerado às 12:29:48 (bundle `index-BdDx15wu.js`), porque o revisor visual recompila `dist/` em paralelo. Alterações de UI posteriores a esse horário não foram cobertas.
- **Viewports:** 1440×900 (padrão), 390×844, 360×800, 720×450 (aprox. zoom de 200%) e 768.
- **Scripts:** ficam no scratchpad da sessão (`e2e.py`, `a11y.py`, `cov.py`). Resultados brutos em `qa/capturas/funcional/e2e-resultados.json`. Capturas em `qa/capturas/funcional/`.
- **Asserções de dados:** `node --import ./src/lib/checks-resolve.mjs src/lib/__checks__.ts` deu 22/22 ok. `tsc` ok.
- **Contato:** nenhum contato real foi acionado. `mailto`/`tel` foram inspecionados pelo `href`, sem abrir.

## Matriz caso × resultado

| Caso | Resultado | Evidência |
|---|---|---|
| Executivo `?executivo=sabrina-ferreira` | passou | h1 "Olá, eu sou Sabrina.", `tel:+5521988967369`, mailto para sabrina.ferreira@credmhs.com.br |
| Sem parâmetro / ID desconhecido / ID `<script>` | passou | Os três resolvem Sabrina sem erro |
| Query com `email=`/`telefone=` injetados | passou | Os parâmetros são ignorados e os contatos continuam os do cadastro |
| 0 prioridades → "Continuar" | passou | Leva a M03 (topo da seção em 152 px, título visível) |
| 1 e 2 prioridades (ordem de escolha) | passou | storage `["seguranca","treinamento"]`, `aria-pressed=true`, feedback "Vamos destacar…" |
| 3ª prioridade | passou | As duas escolhas continuam e aparece "Para escolher outra prioridade, remova uma das duas selecionadas." |
| Seleção não move a página | passou | scrollY ficou igual |
| Desmarcar e marcar outra | passou | Troca imediata |
| M05 abre na 1ª prioridade e mostra "Sua prioridade" | passou | Segurança aberta. A troca manual não persiste no reload, conforme docs/03 |
| "Conhecer a atuação completa" | passou | Limpa as prioridades e mantém os assuntos |
| Empresa vazia | passou | "Uma conversa sobre a sua operação", e a mensagem usa "minha empresa" |
| Empresa com acentos e `&`, `—`, `'` | passou | Renderiza literal, com trim |
| Empresa com HTML | passou | Aparece como texto. Nenhum `<img>`/`<b>` foi criado no DOM |
| Empresa longa (120 caracteres) | passou | Fica limitada a 80. Sem scroll horizontal em 1440 e 360 (`m09-nome-longo-*.png`) |
| Empresa fora de `document.title` e da URL | passou | Título fixo, URL só com `?executivo=…#mXX` |
| M05: adicionar serviço, contador e anúncio | passou | O rótulo vira "Remover da conversa", o live region anuncia "Análise Ergonômica: adicionado à conversa." e aparece "Sua pauta (1)" |
| Adicionar, remover e adicionar de novo | passou | Sem duplicação |
| M05 frente / M06 Gestão e Tecnologia / M07 3 aplicações | passou | `frente:*` e `aplicacao:*` gravados |
| Visitar/abrir tema não adiciona | passou | Abrir "Ver serviços", trocar de frente e "Conhecer a solução" não alteram a pauta |
| Pauta: reordenar / remover / item livre / duplicado / vazio / editar | passou | Anúncios "agora está na posição 2", "removido da pauta". HTML do item livre fica como texto |
| Limite de 20 itens livres | passou | Mostra a microcopy de limite |
| Contador = assuntos + itens livres (sem prioridades) | passou | "Sua pauta (6)" com n=6 |
| mailto decodificado = prévia | passou | Assunto "Conversa sobre a CRED MHS", corpo idêntico com CRLF |
| mailto usa a mensagem editada | passou | |
| Escolhas mudam após edição | passou | O texto digitado é mantido e aparecem o aviso e "Atualizar mensagem com minhas escolhas" |
| Atualizar mensagem | passou | A mensagem é regenerada com o novo assunto |
| Mensagem longa (20 livres + 10 serviços) | passou | O `href` fica só com destinatário e assunto (sem `body`), aparece a orientação de cópia e a prévia mantém os 20 itens |
| Copiar mensagem / copiar pauta (Clipboard API) | passou | Feedback "Mensagem copiada." / "Pauta copiada.". O clipboard do Windows devolve CRLF; o conteúdo é igual |
| Copiar sem Clipboard API | passou | Feedback de falha, texto da mensagem selecionado e textarea de fallback para a pauta |
| Reload preserva | passou | Mesmo storage e mesmo contador |
| Rascunho não persiste | passou | |
| Nada sensível na URL | passou | |
| Reset pelo menu: confirmação | passou | "Reiniciar apaga o nome da empresa e as escolhas desta sessão." |
| Esc no diálogo de reset | passou | Cancela e devolve o foco a "Reiniciar apresentação" |
| Reset confirmado | passou | storage `null`, contador (0), `?executivo` mantido, foco em `section#m01`, M01 no topo, mensagem padrão, M09 vazio, prioridades e detalhes fechados |
| Storage indisponível (getter lança erro) | passou | A experiência funciona em memória, sem `pageerror` |
| Storage com JSON quebrado / versão 99 / outro executivo | passou | Descartado. "Vazou SA" não aparece |
| Storage com campos inválidos | passou | A UI mostra só os IDs válidos (saude, gestao; SIPAT; 1 item livre) e o nome com mais de 80 caracteres é descartado. **Corrigido:** o JSON inválido continuava cru no storage (ver Correções) |
| Deep links #m01–#m10 sem estado | passou | O título de cada seção fica visível abaixo do header. Ver A6 sobre o deslocamento |
| Slugs editoriais (#estrutura etc.) | não testado na UI | Coberto só por `__checks__.ts` (`chapterFromHash`) |
| Troca de executivo sem vazamento | passou (parcial) | Só existe um perfil. O storage de "outro-exec" é descartado; `switchExecutive` está coberto em `__checks__` |
| Requisições a terceiros | passou | 0 requisições fora de `localhost` em todas as sessões (sem analytics, CRM ou fontes externas). O axe foi injetado só no navegador de teste |
| WhatsApp oculto | passou | Nenhum CTA de WhatsApp é renderizado |
| Teclado do início ao fim | passou | 59 paradas (1440) e 55 (390), na ordem skip link → header → M01…M10 → canais. Todas com anel de foco visível e dentro da viewport |
| Menu "Conteúdo" | passou | Ao abrir, o foco vai ao capítulo atual. Esc fecha e devolve o foco ao botão |
| Diálogo modal | passou | Tab circula entre Fechar/Continuar/Reiniciar. A saída para o chrome do navegador é comportamento nativo de `<dialog>` |
| Acordeões M03/M07 por Enter | passou | `aria-expanded` atualiza e o foco permanece no botão |
| axe-core 4.10.2 (CDN) | 1–2 violações moderadas | Ver A3 e A4. **0 violações de contraste** nas duas larguras |
| Landmarks / headings | passou com ressalva | header/nav/main/footer presentes, seções rotuladas, h1 único. Ver A3 e A4 |
| aria-live | passou | M02, M05, M06, M07, M09 e M10 têm `role=status` |
| Alvos ≥44 px | falhou (parcial) | Ver A2 |
| Motion reduzido | passou (parcial) | Com `prefers-reduced-motion`, M06 não renderiza `<video>` e não há erros. Sem inspeção visual |
| Zoom 200% (720×450) / 360 / 390 / 768 | passou | Overflow 0 em página nova. Ver A1 |
| Pauta longa em 360 | falhou | Overflow de 5 px. Ver A1 |

## Achados abertos (UI: o revisor visual decide)

| ID | Severidade | Achado | Reprodução | Arquivo provável |
|---|---|---|---|---|
| A1 | Média | Scroll horizontal de 5 px em 360 px quando o contador da pauta tem 2 dígitos. A barra do header (`_root/_bar/_toggle`) termina em x=365 | Em 360×800, adicionar 10 ou mais assuntos (contador "30") e medir `scrollWidth - clientWidth` = 5 | `src/components/ui/ChapterNavigation.module.css`, `src/app/App.module.css` (`agendaLink`) |
| A2 | Baixa | Alvos abaixo de 44 px: links do índice lateral desktop com 164×30 e, em M06, "Ir para aplicações ↓" (189×40) e "Adicionar à conversa: Gestão e Tecnologia" (183×40). Passam no mínimo de 24 px da WCAG 2.2 AA, mas não na meta do projeto | Medir em 1440 e 390 | `ChapterNavigation.module.css`, `m06/M06.module.css`, `Button` `size="sm"` |
| A3 | Baixa | axe `landmark-complementary-is-top-level`: o `<aside>` do retrato em M10 está dentro de `<main>` | axe em 1440/390 | `M10Continuidade.tsx` (trocar por `div` ou `figure`) |
| A4 | Baixa | axe `heading-order` em 390: rótulo `h4` "Aprofundamento técnico" de M05 aparece antes do `h3` da frente no layout mobile | axe em 390 | `M05Ecossistema.tsx` (`extraLabel`) |
| A5 | Média (a11y) | O botão "Adicionar à conversa" da frente aberta em M05 não tem nome com contexto (os do catálogo e de M06/M07 têm "…: {assunto}") e o estado vem só de `data-selected`. Na lista de controles de um leitor de tela ele é ambíguo | Árvore de acessibilidade em M05 | `M05Ecossistema.tsx` (TopicToggle da frente: `aria-label` com o nome da frente) |
| A6 | Baixa | Deep link e "Continuar" posicionam a seção com o topo em 152 px, mas o header tem 64 px e o `scroll-margin-top` é 72 px. Sobram cerca de 88 px de folga além do previsto | Abrir `#m05` em 1440×900 | `scrollToChapter` em `src/components/ui` |
| A7 | Baixa | Nome acessível do catálogo M05 lido como "Adicionar à conversa : Análise…" (espaço antes dos dois-pontos, vindo do span oculto) | Árvore de acessibilidade | `M05Ecossistema.tsx` |
| A8 | Média (conteúdo) | O e-mail da executiva não aparece como texto em M10 (docs/02 o lista em "Contato documentado"). Quem não tem app de e-mail não vê o endereço | Ler M10 | `M10Continuidade.tsx` (canais). Registrado como P23 |
| A9 | Baixa (copy) | Vocabulário de anúncio inconsistente: "adicionado à conversa" (M05/M06), "adicionado à sua pauta" (M07), "incluído na pauta" (M09) | Adicionar em cada seção | `M05Ecossistema.tsx`, `M06GestaoEmMovimento.tsx` (strings fixas no componente) e `m07/microcopy.ts`. Registrado como P21 |
| A10 | Info (visual) | Em 360 px, o nome de empresa com 80 caracteres ocupa 6 ou mais linhas no título h1 de M09 | `m09-nome-longo-360.png` | `m09/M09Pauta.module.css` |

## Cobertura

- Sem lacunas: os 37 nomes do slide 16, os 12 temas NR, os 7 + 8 serviços de Saúde e Segurança, os 9 recursos de tecnologia, os 10 serviços adicionais, os aspectos de Portal/SLA, Power BI, teleatendimento/telediagnóstico, parque próprio, eSocial/webservice, FAP/NTEP, Vigilância Epidemiológica e "mais de 77 cursos" estão todos renderizados.
- Ausentes por tratamento documentado em `coverage.ts`: ranking, 30/34 anos, 27 Estados, ISO/LGPD, "4 soluções", copyright, adjetivos do slide 10, "e muitos outros", "100%"/"tempo real"/"qualquer ERP".
- Não há instrução interna, status de verificação, ISO/LGPD/VIVA/Agendar/WhatsApp nem promessa nova no texto renderizado.
- Tom de bastidor a revisar (P22): "O material apresenta…" e "descrito pela CRED…" seguem docs/02.
- Microcopy nova catalogada em docs/07 (P21).

## Correções feitas (escopo próprio)

1. `src/state/store.ts`: na restauração válida, o estado é regravado já sanitizado. Antes, IDs inválidos, HTML e nomes com mais de 80 caracteres continuavam crus no `sessionStorage` até a próxima ação.
2. `src/lib/__checks__.ts`: nova asserção desse comportamento. Total de 22/22 ok.
3. `docs/07-fontes-e-pendencias.md`: acrescentados P21 (microcopy nova), P22 (tom de bastidor) e P23 (e-mail não exibido).

## Não testado

Toque real em dispositivo, leitor de tela real (NVDA/VoiceOver), Safari/Firefox, vídeo de M06 com autoplay falhando, desempenho/Lighthouse e slugs na UI.
