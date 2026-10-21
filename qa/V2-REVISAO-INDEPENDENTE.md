# CRED MHS V2 — Revisão independente de QA

Data: 14/10/2026. Revisor: agente de QA independente. Não participei da implementação.
Autoridade: `docs/REVISAO-CRED-MHS-V2.md` (rev. 2.1), `docs/V2-CONTRATO.md`, `CLAUDE.md`.
Escopo: build de produção servido localmente em `http://localhost:4173/` (sem Supabase) e `http://localhost:4174/` (Supabase **simulado**: `https://mock.supabase.test`, RPC e Storage interceptados por Playwright `page.route`). Não houve validação remota, publicação, envio de mensagem nem clique em mailto/tel/wa.me. Os hrefs só foram lidos.

Este relatório não declara aprovação da cliente. A copy continua dependendo da validação comercial da Sabrina, e os números, da conferência pela CRED MHS (§8).

## Método

- Leitura de código: `src/content/{chapters,solutions,valueTrail,facts,executives}.ts`, `src/components/sections/v2/*`, `src/state/*`, `src/lib/{personalization,executive}.ts`, `src/lib/supabase/mapping.ts`, `src/app/*`, `src/components/ui/ChapterNavigation.*`, `src/styles/{tokens,global}.css`.
- Scripts próprios em Playwright (Chromium 1234), um navegador por vez, na pasta temporária da sessão (`scratchpad/qa/ind-1-local.mjs`, `ind-2-interacao.mjs`, `ind-3-current.mjs`, `ind-4-perfis.mjs`). O `qa-v2.mjs` do coordenador não foi reaproveitado.
- Checagens automáticas em 1440, 768, 390 e 320 px: ordem dos `<section>`, overflow horizontal, elementos fora da viewport, texto cortado, menor corpo de texto e contraste WCAG de cada nó de texto visível sobre o fundo efetivo.
- Comparação automática entre a copy da §7 (todos os trechos entre crases e a tabela da trilha) e o `innerText` renderizado. Varredura de termos proibidos no `textContent`, que também inclui o conteúdo recolhido dos `<details>`.
- Inspeção visual (Read do PNG) das capturas que eu mesmo tirei, salvas em `qa/capturas/v2/revisao-independente/`: página inteira, cada dobra, topo e rodapé nas 4 larguras; estados de teclado, toque, hover, reduced-motion, rolagem rápida, perfis simulados, telas de estado e painel.

## (a) Veredito por critério da §13

### Narrativa e conteúdo

| Critério | Veredito | Evidência |
|---|---|---|
| Executivo abre com foto, nome e cargo corretos | **Atende** | `1440-viewport-topo.png`, `390-abertura.png`: "Olá, sou Sabrina." com foto, legenda "Sabrina Ferreira / Executiva de Negócios · CRED MHS". Perfis simulados João/Ana mostram o próprio nome e cargo, sem "Sabrina". |
| CRED MHS logo depois, com números, estrutura e clientes | **Atende** | A ordem DOM é `abertura, institucional, relacionamento, dados, gestao-integrada, trilha, solucoes, contato` nas 4 larguras. Aparecem 16 Unidades, +700 Clínicas credenciadas, +550 mil Vidas gerenciadas, +5 mil Clientes atendidos e "Atuação nacional", com valores iguais aos de `facts.ts`. São 8 logos principais, e "Ver todas as empresas" abre mais 29 (aria-expanded funciona). |
| Relacionamento e dados como dores centrais, cada provocação com resposta | **Atende** | 03 tem dor, resposta e 3 pontos. 04 tem dor, resposta e 3 pontos. A pergunta de 05 é respondida por "Nossa atuação integra…", a de 06 pela trilha e o fecho, a de 07 pelos 4 eixos e a de 08 pelos contatos. |
| Saúde e segurança como oferta integrada | **Atende** | A dobra 05 (preta) é texto contínuo, sem cards de serviço nem seleção. Os eixos não têm checkbox, preço nem carrinho. A nota "A composição das soluções considera…" está visível. |
| Quatro eixos oficiais com inventário rastreável | **Atende** | Normativo, Reputacional, Gestão e Inovação, nessa ordem (`solutions.ts`). O `inventory` tem fontes e `pendingRef`. Em `Solucoes.tsx` só são renderizados `label`, `summary`, `examples` e `detail`, nunca `inventory`/`note`/`sources`. |
| Trilha Normativo → Reputacional → Gestão → Inovação → Investimento | **Atende** | Está em `<ol>` semântica, nessa ordem, em 1440 (horizontal) e 390/320 (vertical empilhada), com o texto completo de cada etapa. |
| Investimento não é 5º pacote nem garantia de retorno | **Atende** | Investimento só aparece na trilha, com "Direcionar recursos com intenção, dados e visão de negócio." Não há 5ª coluna em Soluções. A varredura não encontrou "ROI", "retorno", "economia", "garant", "redução" nem "previsão". |
| Reputacional ligado a liderança, RH, comunicação e percepção do cliente | **Atende** | Resumo: "Conexão entre saúde e segurança, liderança, RH e comunicação…". Exemplos: alinhamento de liderança, integração com a comunicação, indicadores de percepção. O fecho de 05 faz a ponte. Não é usado como prova social da CRED MHS. |
| JPEGs orientaram, texto legível no mobile sem abrir imagens | **Atende** | Não há imagem de framework colada; tudo é texto HTML (`390-trilha.png`, `390-solucoes.png`). Os JPEGs originais não estavam no projeto, conforme registrado em `solutions.ts` (P33), então não pude confrontar a classificação com as imagens. |
| Sem IA, preditivo, ESG, certificação ou conformidade universal | **Atende** | A varredura não encontrou IA, "inteligência artificial", preditiv, ESG, ODS, ISO, SLA, 24h, conformidade, LGPD nem BI. "certifica" só aparece em "gestão de certificados e listas de presença" (detalhe do eixo Inovação, item da fonte), que não é alegação de certificação. |
| 3C/3I não viraram etapas | **Atende** | Não há "Credibilidade", "Compromisso", "Conhecimento" nem seções 3C/3I. |
| Sem dados inventados, percentuais, garantias ou frases da concorrente | **Atende** | Sem "Você levou laudo…", "O CEO perguntou…", "cinco maiores", anos de experiência nem "77". Os números são exatamente os de `facts.ts`. |
| Nome completo e tagline atual | **Atende com ressalva** | Não há "CRED" sozinho (regex `\bCRED\b(?! MHS)` sem ocorrências). A assinatura "Saúde e Segurança do Trabalho" está no rodapé, no título do documento e no alt do logo, e "Gestão de Saúde e Segurança do Trabalho" não aparece. Ressalva: em várias larguras "CRED MHS" quebra entre as duas palavras (defeito M2). |
| Pendências sem aparecer como comentários na página | **Atende** | A varredura não encontrou P\d\d, pendente, TODO nem lorem. Notas internas (`note`, `internalNote`, `pendingRef`) não são renderizadas. As siglas que exigem revisão técnica (PCMAT, PPRA, PGR, LTCAT, PCMSO, LGPD) não aparecem. Aparecem FAP/NTEP, eSocial, SIPAT e EPI, que estão no framework e não constam da lista da §5 que exige revisão. |
| Copy pública fiel à §7 | **Atende** | Os 30 trechos da §7 (entre crases e tabela da trilha) estão presentes literalmente no texto renderizado em 1440 e 390. Só faltam "Falar por WhatsApp" e "Agendar uma conversa", que foram omitidos corretamente porque não há canal confirmado nem URL de booking. Não encontrei nenhum desvio textual. Acréscimos de microcopy fora da §7: legenda da rede ("Rede própria / Unidades da CRED MHS.", "Rede credenciada / Clínicas credenciadas em diferentes regiões."), rótulos do diagrama ("Sua empresa", "Operação CRED MHS"), "Ver todas as empresas", "Outros exemplos do eixo…" e as listas de detalhe dos eixos, todas mapeadas no inventário. O texto principal tem cerca de 790 palavras visíveis em 1440, dentro da faixa de 600–900. |

### Experiência e perfis

| Critério | Veredito | Evidência |
|---|---|---|
| Jornada sem empresa, prioridades ou formulário | **Atende** | `form, input, textarea, select` na página pública: 0. |
| Sem pauta, contador, adicionar, reordenação ou mensagem gerada | **Atende** | Varredura sem "pauta", "Adicionar", "Nova apresentação" nem "Suas prioridades". O mailto só leva assunto fixo ("Conversa sobre a CRED MHS"), sem corpo. `sessionStorage` só serve para apagar a chave V1 (`legacySession.ts`). |
| Rolagem e âncoras com mouse, toque e teclado | **Atende** | **Teclado:** o primeiro Tab mostra o skip link visível (anel preto de 3px + sombra amarela, `kbd-1440-skiplink.png`); Enter leva o foco a `main#conteudo`; o Tab segue Vamos começar → Ver todas as empresas → 4 summaries → contatos. "Conteúdo" abre com Enter e foca o item atual; as setas navegam; Enter em "Trilha de valor" rola (topo da seção = 64px = altura do header), foca a seção e fecha o painel; Esc fecha e devolve o foco ao botão; Tab para fora fecha. Os `<details>` abrem e fecham com Enter e Espaço. **Mouse:** o trilho lateral (≥1280px) mostra o rótulo no hover, e o clique em 07 leva a #solucoes. O CTA "Vamos começar" leva a #institucional. **Toque** (isMobile/hasTouch, 390): tocar em "Conteúdo" e depois "Soluções" funciona, tocar fora fecha, tocar no summary abre, e o swipe rola. Não há alvos de toque menores que 24px. **Hashes:** `#trilha` e o legado `#m05` → `#solucoes` posicionam corretamente; `?executivo=` é preservado. |
| Dois perfis de teste corretos de ponta a ponta | **Atende** | Teste no mock com Sabrina, João (foto remota 1600×1000) e Ana (sem foto). Saudação, legenda da abertura, nó do diagrama, identidade e links do contato pertencem ao perfil certo. A contagem de "Sabrina" nas páginas de João e Ana é 0. A Sabrina local (4173) também está correta. |
| Inexistente, inválido e desativado | **Atende** | Inexistente (RPC `[]`) e local `?executivo=joao-fict` mostram "Não encontramos esta apresentação". Inválido (`../../etc passwd`) mostra not-found **sem chamada à rede**. Desativado (`available:false`) mostra "Esta apresentação não está disponível no momento". Falha de rede com slug mostra a tela de erro com "Tentar novamente" (sem fallback para Sabrina). Falha de rede sem slug cai no perfil local padrão, como prevê o contrato. Slug com maiúsculas é normalizado. |
| Painel, login e dados do executivo intactos | **Atende com ressalva** | `/painel/` responde 200 e mostra "Painel do executivo — Painel ainda não configurado" sem erros de JS (`painel-1280.png`). Login, convites e Storage reais **não** foram testados (não há credenciais; o modo é simulado). |
| Contatos com destinos válidos, sem envio automático | **Atende** | Sabrina: `mailto:sabrina.ferreira@credmhs.com.br?subject=Conversa%20sobre%20a%20CRED%20MHS`, `tel:+5521988967369`, LinkedIn e site com `target=_blank rel=noopener`. Não há WhatsApp nem booking (corretamente omitidos). E-mail com `?body=`, telefone inválido e `javascript:` vindos do banco foram descartados (perfil "mal-email"). Nenhum mailto/tel/wa.me foi aberto durante o QA. |

### Visual, acessibilidade e técnica

| Critério | Veredito | Evidência |
|---|---|---|
| Amarelo, branco e preto com contraste e unidade | **Atende** | Superfícies medidas: abertura, relacionamento, trilha e contato em `#FFCA00`; institucional, dados e soluções em branco; gestão integrada em preto. Contrastes: tinta #1E1D1D sobre #FFCA00 = **10,97:1**; sobre branco = 16,82:1; texto secundário #5C5A55 sobre branco = **6,89:1**; #333230 sobre branco = 12,81:1; #D6D4CF sobre preto = 14,18:1. **Nenhum nó de texto visível ficou abaixo de 4,5:1** nas 4 larguras. Não há #FFD962 nem creme nas seções V2. O painel do grafismo de Dados usa `--gray-100` #F3F2EF, cinza quente pontual que não domina. |
| Revisão em 1440, 768, 390 e 320 | **Atende** | As capturas em `revisao-independente/` foram inspecionadas uma a uma. |
| Sem overflow, títulos cortados ou espaços vazios acidentais | **Atende com ressalva** | Overflow horizontal = 0 e nenhum elemento fora da viewport nas 4 larguras; nenhum texto cortado (o único "clipped" é o `.visually-hidden` do toggle, como esperado). Ressalvas: perfil **sem foto** em desktop deixa a metade direita da abertura vazia (B1), e foto **paisagem** deixa uma área branca no círculo do contato (A1). |
| Indicadores e logos legíveis no mobile | **Atende** | `390-institucional.png` e `320-institucional.png`: números em 2×2, logos em 2 colunas legíveis. "Loja Elétrica" é o menos legível, mas aceitável. |
| Conteúdo não depende de hover nem de animação | **Atende** | Com `reducedMotion: 'reduce'` não há `motion-ok`, e todos os `[data-reveal]` têm `transform:none`, `opacity:1` e `inview=true`. Na rolagem rápida (captura em ~30 ms), o único efeito é `translateY(20px)` com opacidade 1: nada fica escondido (`rapida-1440-*.png`). O hover do trilho é só atalho; o mesmo índice está no botão "Conteúdo". |
| Reduced-motion, foco visível e labels | **Atende** | O foco tem anel preto de 3px com halo amarelo de 8px, visível sobre branco, amarelo e preto. O trilho é `aria-hidden` com `tabIndex=-1`, e o teclado usa a lista. O toggle anuncia ", capítulo atual: …". O botão de empresas tem `aria-expanded`/`aria-controls`. O retrato tem alt descritivo; o avatar do diagrama usa alt "". |
| Build e verificações relevantes passam | **Não verificado** | Não rodei build, tsc nem os checks (`src/lib/__checks__.ts`) para não disputar recursos com o coordenador. Revisei só o build já servido. |
| Capturas realmente inspecionadas | **Atende** | Ver lista acima. |
| Serviços simulados identificados | **Atende** | Este relatório deixa claro que Supabase/Storage foram simulados por interceptação. Não houve chamada remota real. |

## (b) Defeitos por severidade

Não encontrei defeitos **bloqueantes**.

### Alto

**A1. Retrato do Contato não preenche o círculo quando a foto é mais larga que alta.**
- Arquivo: `src/components/sections/v2/Contato.module.css`, linhas 13–29 (`.photoWrap` com `aspect-ratio: 1` e `.photo { height: 100% }`). O `<img>` está dentro de `<picture>` inline (`shared.tsx` l.48), então `height:100%` não resolve contra a altura derivada do `aspect-ratio`. A imagem fica na proporção intrínseca e deixa o restante do disco branco.
- Reproduzir: no 4174, perfil simulado com `photo_path` válido e foto 1600×1000; abrir `?executivo=<slug>` e ver `perfil-joao-foto-1440-contato.png` e `perfil-joao-foto-390-contato.png` (cerca de 40% inferior do círculo em branco).
- Por que é alto: o painel não impõe proporção (`src/lib/supabase/photo.ts` só limita o lado maior), então qualquer executivo que envie uma foto horizontal ou quadrada-larga terá o fechamento quebrado. O retrato da Sabrina é vertical, por isso o problema não aparece no perfil padrão.
- Correção: dar altura ao `picture` (`.photoWrap > picture { display:block; width:100%; height:100%; }`) ou usar `aspect-ratio: 1; height:auto` no próprio `.photo`. Depois, testar de novo com fotos vertical, quadrada e horizontal. A abertura e o avatar do diagrama não têm o problema: lá o `img` tem `aspect-ratio` próprio ou o container tem altura fixa.

### Médio

**M1. Perfil sem foto deixa metade da abertura vazia em desktop.**
- Arquivo: `src/components/sections/v2/Abertura.tsx` l.31 (`data-has-photo=false`) e as regras correspondentes em `Abertura.module.css`.
- Reproduzir: 4174, perfil com `photo_path: null` (que não seja a Sabrina), 1440px: `perfil-ana-semfoto-1440-topo.png`. O texto ocupa cerca de 55% da largura, e a metade direita fica amarela lisa, sem o sol da marca, o que parece buraco de layout. Em 390 e 320 a versão tipográfica está boa (`perfil-ana-semfoto-390-topo.png`).
- Correção: no estado sem foto em ≥1024px, ampliar a coluna do título e o corpo do H1, ou manter o grafismo do sol (`styles.sun`) como elemento de composição no lado direito. Não usar foto de banco.

**M2. "CRED MHS" quebra entre "CRED" e "MHS" em fim de linha.**
- Arquivo: `src/content/chapters.ts` (todas as strings com "CRED MHS") e `copy.global.brand`.
- Reproduzir: título da abertura em 768px (`768-abertura.png`: "…como a CRED / MHS pode…"); abertura sem foto em 1440 (`perfil-ana-semfoto-1440-topo.png`); apoio do contato em 320/390 (`320-contato.png`: "…como a CRED / MHS conecta…").
- Por que é médio: a §4/§9 exige o nome completo, e a quebra separa a marca visualmente justo nos títulos principais.
- Correção: usar espaço não separável (`CRED MHS`) nas strings públicas, ou substituir no `formatTemplate`/componente de texto. Fazer o mesmo em `statusCopy.ts`.

### Baixo

**B1. Contato fica sem nenhuma ação quando todos os canais do perfil são inválidos.**
- Arquivo: `src/components/sections/v2/Contato.tsx` l.70–101.
- Reproduzir: perfil simulado com e-mail `x@y.com?body=oi`, telefone `123` e LinkedIn `javascript:…` (`perfil-mal-email-1440-contato.png`). Aparecem título e apoio, mas nenhum botão. A sanitização está correta; só falta um fallback.
- Correção (opcional): sem canais válidos, mostrar o link institucional (`INSTITUTIONAL_SITE` de `statusCopy.ts`). O painel provavelmente já impede esse caso; não verifiquei com backend real.

**B2. Etapa "Investimento" tem marcador diferente das demais.**
- Arquivo: `src/components/sections/v2/Trilha.module.css` (último `.marker` branco, os outros pretos).
- Ver `1440-trilha.png` e `390-trilha.png`. O texto está correto e nada indica pontuação nem posição do cliente, mas o destaque visual da 5ª etapa pode ser lido como "destino/recompensa". A §7 pede que a trilha não sugira evolução automática. É uma escolha cosmética; vale confirmar com Nil se é intencional.

**B3. Rolagem suave longa via índice.**
- `ChapterNavigation.tsx` l.19–27 usa `scrollIntoView({behavior:'smooth'})`. Entre capítulos distantes (por exemplo Abertura → Contato, cerca de 8.000px), a animação passa de 1,2s, e o rótulo "capítulo atual" passa pelos capítulos intermediários antes de assentar (`ind-3-current.mjs`: estado final correto em todos os 12 saltos testados). Não é falha. Se a navegação ao vivo parecer lenta, considerar salto instantâneo para distâncias grandes.

## (c) O que não verifiquei

- **Supabase real:** login, convites, RLS, upload e Storage. Tudo foi simulado por interceptação, sem credenciais nem validação remota.
- **Build, `tsc` e checks automatizados do projeto:** não executados por mim (regra de baixa concorrência). Revisei só os builds já servidos em 4173 e 4174.
- **JPEGs originais dos frameworks:** ausentes do projeto (P33), então não confrontei a classificação dos itens nos eixos com as imagens. Usei a transcrição da §5.
- **Leitores de tela reais** (NVDA/VoiceOver): não testados. Verifiquei só atributos ARIA, ordem de foco e foco visível.
- **Dispositivos físicos e Safari/Firefox:** só Chromium com emulação de toque e de viewport.
- **Fidelidade das proporções dos logos às marcas originais:** só comparei visualmente com os arquivos já extraídos do PPTX.
- **Abertura efetiva de mailto/tel/LinkedIn/site:** só li os hrefs, sem clicar.
- **Atualidade de números, cargo e contatos:** dependem de confirmação pela CRED MHS (§8). Não declaro esses dados validados.
