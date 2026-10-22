# Relatório de QA — V3 (20/10/2026)

Preview local: `npm run dev` → http://localhost:5173/?executivo=sabrina-ferreira (cliente) · `&revisao=1` (com seções pendentes). Nada publicado.

## Rodadas

## Rodada 21/10/2026 — ajustes da Sabrina (leveza)

Fonte: mensagens e prints da Sabrina sobre `entregas/validacao-2026-10-20/CRED-MHS-prototipo-validacao.pdf`. Execução: coordenador (conteúdo/contrato) + 4 agentes paralelos com arquivos exclusivos (institucional; composição; frentes; contato) + revisão independente (`qa/V3-RODADA-2026-10-21-REVISAO.md`) + correções. Capturas: `qa/capturas/v3/rodada-2026-10-21/` (`antes/`, `depois/`, `final/`, `revisao-independente/`) em 1440, 1024, 414 e 360 px.

| # | Pedido | Status |
|---|---|---|
| 1 | Remover traços decorativos (abertura, quem somos, provocação, atuação, alcance, transição, frentes, contato; por consistência também rótulos de depoimentos/empresas, topo de satisfação e rodapé) | Feito. Mantidos: contornos do mapa, sublinhado de “sua empresa?” (PPT), borda das citações, controles, foco, barra de progresso de leitura |
| 2 | Quem somos: retirar 35 / Minas Gerais / 2008 / 2018; manter fotos Barra e Centro | Feito; história segue no texto corrido |
| 3 | Atributos em diagrama circular, leve | Feito: três círculos amarelos translúcidos sobrepostos |
| 4 | Missão, visão e valores num slide, sem numeração | Feito: seção `#missao-visao-valores` (amarela), no trilho como “Missão e valores” |
| 5 | Atuação integrada sem o diagrama | Feito; textos preservados |
| 6 | Alcance: sem rótulo superior; “Rio de Janeiro - Barra e Centro” | Feito, junto ao Rio no mapa; mapa e motion intactos |
| 7 | Transição sem foto, ênfase em “mais gestão … sua empresa?” | Feito: seção amarela tipográfica, “mais gestão” como pico |
| 8 | Frentes: textos 01–04, nova “Dados e Privacidade” (05), 06/07 sem alteração, sem “Como entregamos” e sem bloco preto, “Sete frentes” | Feito. Frente 03 também trocada (print 12 da Sabrina prevaleceu sobre o comando) |
| 9 | Comunicação e reputação — texto novo | Texto aplicado; enquadramento **pendente** (P49a): fecho sem número |
| 10 | Contato: sem caixas/numeração/painel; LinkedIn e site só ícone | Feito; ações sem duplicação (telefone e e-mail clicáveis, sem botões repetidos) |

**Verificado de fato:** `tsc` sem erros; `npm run build` ok; 18 checks de conteúdo (`node --import ./src/lib/checks-resolve.mjs src/lib/__checks__.ts`, agora com 7 frentes e a nova seção); capturas em 4 larguras olhadas pelos agentes, pelo revisor e pelo coordenador; sem rolagem horizontal; texto renderizado = `chapters.ts`; carrosséis, trilho lateral, `?executivo=`, `?revisao=1` e mapa animado (≈9 s) conferidos pelo revisor; “Saiba mais” visível sem rolar em 8 janelas (1440×900 a 360×740); links tel/mailto/LinkedIn/site e nomes acessíveis conferidos.

**Ajustes do Nil (21/10, depois da revisão):** textos dos atributos centralizados em cada círculo (fonte 5,6cqi); rodapé preto com logo negativo, assinatura amarela e os ícones de LinkedIn/site (saíram do contato; WhatsApp, quando habilitado, segue no contato). Capturas em `qa/capturas/v3/rodada-2026-10-21/ajustes/` (1440, 1024, 360); links e nomes acessíveis conferidos; sem rolagem horizontal.

**Não verificado:** dispositivos reais (só Chromium emulado), Safari/Firefox, leitor de tela real.

**Pendências:** P49a (enquadramento de Comunicação e reputação), P56 (ISO: titular/escopo/vigência; LGPD não é certificação), P57 (“disponível” → “disponíveis”, não aplicado), M3 pré-existente (links do trilho com 32 px de altura).

1. Fundação do coordenador (contrato `docs/V3-CONTRATO.md`, tipos, copy do PPT, `?revisao=1`), agentes Conteúdo, Visual, Motion e Marcas em paralelo com arquivos exclusivos.
2. Integração + revisão independente (`qa/V3-REVISAO-INDEPENDENTE.md`): sem bloqueantes; principal achado = quebras de linha em preposição/artigo e órfãs (23–33 casos por largura) → helper `src/lib/typeset.ts` aplicado em todas as seções → 0 casos medidos em 1440/1024/768/390/320.
3. Rodada de sobriedade pedida pelo Nil (seguir `assets/referencia.jpg`): geometria reta, moldura amarela deslocada, blocos justapostos com cinza claro, tipografia contida; fotos **coloridas** (decisão do Nil); provocação e atuação integrada com fundo escuro (como no PPT da Sabrina).
4. Depoimento real recebido (Wilton Valente, Coordenador de SMS, Radix; uso autorizado) — inserido sem edição; seção visível ao cliente.
5. Correção do coordenador no contato (moldura do retrato esticada; e-mail em uma linha ≥1280).
6. Ícones nos atributos de Quem somos; sol oficial da CRED nos 26 símbolos do mapa; CSAT 99,4% liberado ao cliente pelo Nil (pendência de fonte/período/universo mantida em docs/07); contagem animada (CountUp) em +550 mil, +5 mil e 99,4% — uma vez ao entrar na tela, valor final no HTML e para leitor de tela, estático em reduced motion (testado: 0→254→440→525→549→550; 0,0→49,3→79,2→94,8→99,2→99,4).

## Verificado (20/10, Chromium headless via playwright-core)
- `tsc` OK · checks 18/18 · `vite build` OK (mapa/player sob demanda: ~129 kB gzip fora da carga inicial) · `test:rls` 64/64.
- Captura integrada (rola a página, espera o mapa) em 1440×900, 1024×768, 390×844 (cliente) e 1440 reduced (revisão): overflow horizontal 0, 1 `h1`, 0 erros de console, nenhum termo proibido (Conteúdo, 3C/3I, Normativo, Reputacional, NPS, sede, “Dar o primeiro passo”, “Ninguém faz nada sozinho”, Trilha). Cliente: 11 seções desde a liberação do CSAT (antes 10); revisão: 11 seções, aviso do CSAT presente.
- Revisão independente: fidelidade do texto ao PPT (exceto ajustes A–G e slide 11), CTA na primeira dobra em 10 telas, trilho por teclado, carrossel (9 marcas, setas, ←/→, Home/End, swipe), mapa (uma vez, pausar/continuar/repetir, estático em reduced motion), personalização (tel/mailto, executivo inexistente → “não encontrada”), painel “não configurado”.
- Capturas: `qa/capturas/v3/integrada/` (cliente-1440-r2, cliente-1024-r2, cliente-390-r2, revisao-1440-r2, folha-390.jpg), `qa/capturas/v3/visual/sobriedade/`, `qa/capturas/v3/mapa/`, `qa/capturas/v3/marcas/`, `qa/capturas/v3/revisao-independente/`.

## Não verificado
Leitor de tela real, Safari/Firefox, aparelho físico (swipe testado com toque sintetizado), movimento ligado no celular, Supabase real (segue simulado).

## Pendências (docs/07, seção V3)
CSAT (percentual exato, fonte, período, universo — seção oculta ao cliente); propostas de texto do slide 9 e “Comunicação e reputação” para validação da Sabrina; “1 / 3” no slide 10 com só 8 logos; vetoriais das marcas (Unicred/CSN fracas); originais das fotos 09.43.21, .18, .27 (compressão do WhatsApp); unidade de cada foto (atribuída pela proximidade no slide 3); foto 09.43.20 fora (pessoa identificável); grafia “CREDMHS” no depoimento (como o cliente escreveu); logo `cred-mhs-logo-sobre-amarelo.svg` derivado (sol branco, brandbook p. 39) a confirmar; licença Remotion; crédito IBGE no rodapé.

---

# Registro 2026-10-14 — V2 (rev. 2.1)

- Agentes: conteúdo (A1), visual (A2) e fluxo (A3) em paralelo, com arquivos exclusivos (`docs/V2-CONTRATO.md`). Depois, integração pelo coordenador e revisão independente.
- Testado: build, checks 17/17, RLS 64/64. Chromium em 1440/768/390/320: ordem das seções, sem overflow, texto ≥16px, sem termos proibidos, console limpo, trilha `<ol>` na ordem, 4 eixos sem Investimento, mailto sem corpo, sem WhatsApp e sem agendamento, CTA e hashes (#trilha, #m05, #m10), reduced-motion, sessionStorage vazio. Perfis simulados (Sabrina, teste, sem foto, inexistente, inválido, desativado) e painel abrindo: 61/62, sendo a falha um falso negativo do script.
- Revisão independente: `qa/V2-REVISAO-INDEPENDENTE.md`. A1, M1, M2 e B1 corrigidos e conferidos em captura (`qa/capturas/v2/pos-correcoes/`). B3 alterado (saltos longos sem rolagem suave), tempo não medido. B2 em aberto (decisão de design).
- QA final após as correções: 62/62 (`qa/capturas/v2/final/`). Checks 17/17, build OK.
- Não testado: Supabase real, Safari/Firefox, leitor de tela, aparelhos físicos, abertura real de mailto/tel.

---

# Relatório de QA — apresentação comercial CRED MHS

- **Data:** 2026-10-08 (rodada de personalização com Supabase: 2026-10-10, abaixo)
- **Estado:** versão local navegável. **Não houve publicação**, deploy, envio de e-mail/mensagem, CRM, analytics nem formulário com envio.
- **Ambiente de teste:** Windows 11, Chromium headless (Playwright para Python), `vite preview` servindo o `dist/` final. Scripts de teste no scratchpad da sessão, fora do repositório (`e2e_final.py`, `a11y_final.py`, `shots_final.py`).
- **Relatórios parciais:** [revisão visual](revisao-visual.md) e [achados funcionais](achados-funcionais.md). Este relatório os consolida e registra a rodada final de correções.

## Rodada 2026-10-16 — refinamento: CTA, trilha animada (Remotion) e movimento

### O que foi feito
- **Abertura:** botão “Saiba mais” (`src/content/chapters.ts`), mesmo destino (`#institucional`, CTA leva o topo da seção a 64 px = altura do header, em 768 e 320). Rolagem livre inalterada. A transcrição de 13/10 não está no disco (P43); a troca segue a instrução do Nil.
- **Trilha:** `src/motion/trail/timing.ts` (linha do tempo, sem dependência de Remotion), `TrailScene.tsx` (cena), `TrailPlayer.tsx` (Player, lazy). `Trilha.tsx` mede o centro de cada marcador da `<ol>` e passa as posições à cena: o mesmo desenho serve para a linha horizontal (≥1024) e a vertical (celular). Nomes e textos continuam HTML. O destaque da descrição (fundo branco) segue o quadro do player. Fim: composição completa parada no último quadro. B2 resolvido.
- **Soluções:** filetes como pseudo-elemento; entrada coordenada com defasagem de 140 ms por eixo. Resumos, exemplos e acordeões inalterados.
- **Dados:** seta se desenha; cada fragmento acende (amarelo, uma vez) e sua linha organizada entra com os itens se assentando. Nenhum número, indicador ou tela.
- **Remotion (subprojeto):** composição `TrilhaValor` + `remotion.config.ts` (aliases e `setConcurrency(1)`). Render de conferência `out/trilha/trilha-valor-referencia.mp4` (322 quadros, ~90 s, concorrência 1) e still do último quadro, um de cada vez. Não vão para `public/`.

### O que foi verificado (Chromium 1234 via Playwright, um navegador por vez, dev server 5173)
- Linha do tempo em 1440 e 390: etapa ativa avança 1→2→3; no fim as cinco ficam “alcançadas”, nenhuma em destaque, sobra só “Repetir animação”.
- Sair no meio → pausa (botão vira “Continuar”); voltar → continua do ponto. Depois do fim, sair e voltar **não** repete.
- Pausa manual por clique; sair e voltar mantém pausado; “Continuar” retoma. “Repetir” por teclado (Enter) recomeça. Fim da animação com foco em “Pausar” → foco vai para “Repetir”.
- Toque (390, isMobile/hasTouch): tap em “Pausar” funciona; botões com 44 px de altura.
- Página aberta direto em `#trilha`: a animação começa (havia um travamento do Player no quadro 0 quando o play vinha logo após montar; corrigido com nova tentativa).
- Reduced motion (1440 e 390): `data-motion=off`, nenhum chunk do Remotion baixado, trilho e marcadores CSS no estado final, sem botões.
- Overflow horizontal 0 em 1440/768/390/320 (a camada do halo vazava 7 px no celular; a seção agora corta em x).
- Console sem erros (o aviso de `ref` do `AbsoluteFill` com React 18 foi eliminado trocando por `div`).
- typecheck, build, `__checks__` 18/18, `test:rls` 64/64.

### Capturas (`qa/capturas/v2/rodada-2026-10-16/`)
trilha 1440 (etapa 2, pausada, final, reduced motion), 768, 390 (etapa 3, reduced motion), 320; dados 1440 (meio, final); soluções 1440 (entrada); quadros do render Remotion.

### Não verificado
- Safari/Firefox e dispositivos físicos; leitores de tela reais.
- Desempenho em máquina lenta (o chunk do player tem ~93 kB gzip; carrega só a ~800 px da trilha).
- Licença do Remotion para uso comercial (P45). Transcrição de 13/10 (P43) e a revisão visual citada (P44).

## Rodada 2026-10-10 — personalização por executivo com Supabase

**Estado:** implementado e testado localmente com Supabase **simulado**. Nenhum projeto Supabase real foi criado ou conectado, e nada foi publicado. As credenciais e o projeto dependem de Nil (passo a passo em `docs/CONFIGURACAO-SUPABASE.md`).

Execução em paralelo: 3 agentes, com arquivos de responsabilidade separados (banco/Storage; painel; apresentação pública/sessão). A coordenação definiu os contratos (`src/lib/supabase/{config,client,types,slug,storage}.ts`), integrou e revisou.

### O que foi implementado

| Parte | Entrega |
|---|---|
| Banco (`supabase/migrations/`) | Tabela `public.executives` com RLS, `GRANT UPDATE` só nas colunas editáveis, CHECKs de formato, slug único e imutável (trigger), um único perfil padrão, guarda de `photo_path` na pasta do próprio usuário. RPC pública `get_public_executive` (security definer) que devolve só os campos da apresentação, sem id, user_id ou e-mail de login. Seed idempotente de Sabrina (perfil padrão migrado). Snippets de administração em `supabase/snippets/` |
| Storage | Bucket público `executive-photos`, 2 MB, `image/webp` e `image/jpeg`; escrita, troca e exclusão só em `<auth.uid()>/`; sem policy para anon (sem listagem) |
| Painel `/painel/` | Login por e-mail e senha, sem cadastro público; convite e redefinição de senha (`token_hash`, `#access_token` e `?code=`); conta sem perfil; edição de nome, nome de apresentação, cargo, e-mail de contato e telefone (um campo gera exibição e E.164); foto com otimização no navegador (orientação, sem metadados, ≤ 1400 px, WebP/JPEG ≤ 2 MB), prévia, desfazer e limpeza de arquivos órfãos; Salvar, Sair, Copiar meu link, Abrir minha apresentação; prévia da abertura e do contato; aviso de alterações não salvas |
| Apresentação pública | `/?executivo=<slug>` sem login, por `fetch` na RPC (supabase-js fora do bundle público). Nome, nome de apresentação, cargo, foto, e-mail e telefone aplicados em M01, M02, M05, M09, M10, na mensagem e na pauta. Estados: carregando, não encontrada, indisponível, erro de conexão com "Tentar novamente". Sem identificador e com falha de rede: perfil local de Sabrina. Sem variáveis: funciona como antes, só com Sabrina |
| Sessão do cliente | Empresa, prioridades, assuntos e pauta só no `sessionStorage`, vinculados ao slug; nada no Supabase nem na URL. "Nova apresentação" (antigo "Reiniciar apresentação") limpa e mantém o executivo; outro slug na mesma aba começa sessão limpa |
| Hospedagem | Vite multipágina (`dist/painel/index.html`), `vercel.json` e `public/_redirects` para `/painel`; redirecionamento de segurança no `main.tsx`. `.env.example`; `.env*` ignorados pelo Git |

### O que foi verificado

| Verificação | Resultado |
|---|---|
| `npm run build` (typecheck app + vite.config, build multipágina) | OK |
| `node --import ./src/lib/checks-resolve.mjs src/lib/__checks__.ts` | **31/31** (22 anteriores + 9 novas: mapeamento, validação da RPC, resolução com/sem config, timeout/500/HTML, isolamento de sessão, link sem dados do cliente) |
| `npm run test:rls` (migrations reais em PGlite, com stub de `auth`/`storage` e papéis anon/authenticated) | **64 ok, 0 falha** — leitura e alteração só do próprio perfil, colunas administradas negadas, CHECKs, `photo_path` de outro usuário recusado, anon sem acesso à tabela, RPC (padrão, inexistente, inativo, colunas expostas), Storage por pasta, slug imutável, seed idempotente, perfil padrão único |
| Painel no build de produção com Supabase simulado (Playwright, `page.route`) | **63/63** — sem config, erros de login, esqueci a senha, conta sem perfil, PATCH só com colunas editáveis e filtro por `id` + `user_id`, foto (PNG 3000×4000 → WebP 1050×1400, EXIF, desfazer, substituição apaga a anterior, falha apaga a nova), copiar link, sair, convite/recuperação, link expirado, 390/320 px sem rolagem horizontal, alvos ≥ 44 px, nenhum token no console |
| Apresentação no build de produção, sem variáveis e com RPC simulada | **95/95** — Sabrina igual à versão anterior (M01 comparada com `docs/guia/img/01`), outro executivo com foto remota, foto quebrada, sem foto, inexistente, inativo, slug inválido sem rede, falha de rede com e sem slug, carregamento lento, reduced motion, isolamento A→B, "Nova apresentação"; 1440, 390 e 320 px |
| `/painel`, `/painel/`, `/painel?x=1`, `/painel/qualquer`, com recarga | Todos abrem o painel no `vite preview` |
| Bundles | Apresentação pública sem supabase-js/Auth; nenhuma chave no código; `service_role` só aparece como literal da guarda que recusa chaves secretas |
| Revisão visual (capturas em `qa/capturas/personalizacao-supabase/`) | Correção na integração: o disco amarelo do login invadia o título e o eyebrow; virou meio sol sobre a linha de base, com espaço reservado |

### O que não foi verificado

- Supabase real: Auth (GoTrue), PostgREST com JWT assinado, CORS, limites de MIME e tamanho do bucket (aplicados pelo serviço Storage, não pelo Postgres), envio de convites (SMTP).
- Fluxo `?code=` PKCE de ponta a ponta, Safari real (caminho WebP → JPEG), leitor de tela real, hospedagem real (Vercel/Netlify).
- Checklist para o projeto real: seção 8 de `docs/CONFIGURACAO-SUPABASE.md`.

### Pendências

P25–P32 em `docs/07-fontes-e-pendencias.md`: credenciais e domínio, e-mail de login e dados de cada executivo, provedor SMTP, microcopy nova a validar, comportamento com perfil padrão desativado e captura do guia desatualizada.

---

## Como abrir o preview local

```bash
npm install            # só na primeira vez
npm run dev            # desenvolvimento: http://localhost:5173/?executivo=sabrina-ferreira
npm run build          # typecheck + build em dist/
npm run preview        # dist/ em http://localhost:4173/?executivo=sabrina-ferreira
```

- Os parâmetros válidos são `?executivo=sabrina-ferreira` e o hash de capítulo: `#m01`…`#m10` ou os slugs `#apresentacao`, `#estrutura`, `#ecossistema`, `#gestao-e-tecnologia`, `#sua-pauta`, `#contato` etc.
- Sem parâmetro, ou com um ID desconhecido, a página abre o perfil de Sabrina, o único documentado.
- Para gerar de novo o vídeo de M06, veja `remotion/README.md`. O vídeo tem projeto e dependências próprios.

## Stack e estrutura

O registro completo está em `docs/STACK.md`. Resumo:

- **Base:** Vite 6, React 18 e TypeScript strict. CSS puro com custom properties e CSS Modules.
- **Motion:** GSAP com ScrollTrigger, usado só em M06. O vídeo complementar de M06 vem do Remotion.
- **Backend e router:** nenhum.
- `src/content/` concentra perfil, copy, fatos, catálogos, cobertura e status interno em dados tipados.
- `src/state/` guarda o estado da sessão (`sessionStorage`, validado na restauração).
- `src/lib/` reúne mensagem, `mailto` e validação.
- `src/components/sections/` tem M01–M10. `src/components/ui/` tem SectionShell, Button, Accordion, Dialog e ChapterNavigation.
- Identidade: Brandbook Grupo CRED MHS 2021, `logo_nova.svg` e Sommet Rounded (woff2 300/400/700/900).

## O que funciona, por momento

| Momento | Funcionamento verificado |
|---|---|
| M01 Encontro | Retrato real de Sabrina (derivados avif/webp/jpg), nome e cargo do perfil, CTA "Conhecer a CRED". O perfil vem de `?executivo=` com fallback. |
| M02 Prioridades | Até 2 prioridades, guardadas na ordem de escolha. A 3ª mostra microcopy de limite e não apaga nenhuma escolha. Nome da empresa opcional, limitado a 80 caracteres, exibido como texto puro. "Continuar" e "Conhecer a atuação completa" funcionam com ou sem escolha. Nada avança sozinho. |
| M03 Capacidade | Os 4 indicadores do slide 17 com qualificadores literais e "Atuação nacional" (fallback de P04). "Conhecer a estrutura" mostra os detalhes, marcados quando ligados a uma prioridade. |
| M04 Prova social | 8 logos conciliados com o nome. "Ver outras empresas" abre a relação completa em texto. |
| M05 Ecossistema | 4 frentes. A frente inicial segue a 1ª prioridade (ou Saúde Ocupacional). Cada frente tem "Ver serviços" e "Adicionar à conversa", com o nome da frente no rótulo acessível. O catálogo adicional (10 serviços) virou lista editorial de linhas selecionáveis. |
| M06 Gestão e tecnologia | Palco sticky com 3 fases em desktop (≥1024×700). Em mobile, com reduced motion e em viewport baixa, o conteúdo segue em fluxo. Vídeo sem loop, com pausar/rever e poster. Recursos de tecnologia ficam em acordeão. Há "Adicionar à conversa" para Gestão e Tecnologia. |
| M07 Aplicações | eSocial, FAP/NTEP e Riscos Psicossociais. "Conhecer a solução" só expande; adicionar exige ação explícita. Selo "Sua prioridade". "Ver outras soluções" leva ao catálogo de M05. |
| M08 Confiança | Fallback baseado em equipe e estrutura. As ISO não aparecem enquanto faltarem titular, escopo e validade (P05). |
| M09 Pauta | Lista prioridades, assuntos e itens livres (até 20, com 120 caracteres cada). Permite reordenar, editar e remover, e rejeita duplicados e itens vazios. "Limpar escolhas" pede confirmação. O título muda com o nome da empresa. |
| M10 Contato | Mensagem editável. Uma escolha nova não sobrescreve texto editado: aparece aviso e "Atualizar mensagem". "Preparar e-mail" abre o `mailto` (sem body quando a mensagem é longa). Copiar mensagem e copiar pauta têm fallback. **O e-mail agora aparece como texto.** Telefone, LinkedIn e site completam os canais. WhatsApp fica oculto. |
| Global | Header com "Sua pauta (n)", menu "Conteúdo" (Esc, setas, foco no capítulo atual), trilho lateral a partir de 1280 px, reset com confirmação que volta a M01 com foco, deep links e slugs. |

## Correções desta rodada final

| Achado | Correção | Arquivos |
|---|---|---|
| A1: 5 px de rolagem horizontal com contador de 2 dígitos (e 5 px a 320) | Compactação do header até 399 px. Abaixo de 360 px, "Conteúdo" fica só com o ícone (44×44), e o rótulo continua no nome acessível | `ChapterNavigation.tsx/.module.css`, `App.module.css` |
| A5 + A7: botão da frente sem contexto, com espaço antes dos dois-pontos | `aria-label` fixo "Adicionar à conversa: {frente}" / "Remover da conversa: {frente}" | `M05Ecossistema.tsx` |
| A8 / P23: e-mail ausente em M10 | Primeiro item de "Outros canais": rótulo "E-mail" e endereço de `executives.ts` com `mailto:` simples | `M10Continuidade.tsx`, `m10/microcopy.ts` |
| A2: alvos menores que 44 px | Itens do trilho com alvo de 44×44 (marcador visível de 28 px). Botões `size="sm"` com 44 px de altura. Contador do header com largura mínima de 44 px | `ChapterNavigation.module.css`, `Button.module.css`, `App.module.css` |
| A3: `<aside>` dentro de `<main>` | Bloco do retrato de M10 virou `div role="group"` | `M10Continuidade.tsx` |
| A4: `heading-order` no mobile | Em mobile, os subtítulos da frente em M05 passam a `h3` (no desktop continuam `h4`, abaixo do `h3` do painel) | `M05Ecossistema.tsx` |
| A6: deep link com cerca de 88 px a mais | `scroll-padding-top` = altura do header (64 px) e `scroll-margin-top: 0` nas seções. O topo da seção agora fica exatamente em 64 px | `global.css`, `SectionShell.module.css`, `M05Ecossistema.module.css` |
| A9 / P21: vocabulário | Botões mantêm "Adicionar/Remover da conversa" (docs/03). Anúncios e selos usam "pauta": "{x} adicionado à pauta." / "removido da pauta." e "Na pauta" | `M05Ecossistema.tsx`, `M06GestaoEmMovimento.tsx`, `m07/microcopy.ts`, `m09/microcopy.ts` |
| N4: M05 com 10 botões idênticos e coluna esquerda vazia | Lista de linhas (a linha inteira é o controle) com marcador +/✓. Em desktop, duas colunas, e a introdução fica sticky com a legenda "+ Adicionar à conversa" | `M05Ecossistema.tsx/.module.css` |
| N2: vazio à direita em M02 | A lateral começa na altura da pergunta, como painel de papel com filete amarelo. A transição ganhou presença tipográfica | `M02Prioridades.module.css` |
| N3: vazio à direita em M03 | "Atuação nacional" foi para a coluna do cabeçalho, ao lado do título, e os 4 números formam uma faixa única | `M03Capacidade.tsx/.module.css` |
| N1: trilho sobre o disco amarelo de M01 a 1024 px | O trilho e a reserva lateral do container só valem a partir de 1280 px | `ChapterNavigation.module.css`, `global.css` |
| Slug por troca de hash na mesma página | `hashchange` resolve slugs como `#estrutura`. Antes, só a carga inicial resolvia | `useCurrentChapter.ts` |

As correções das rodadas anteriores (eixo, trilho, sticky de M06, header a 320 px, storage sanitizado etc.) estão nos relatórios parciais.

## Matriz de validações (efetivamente executadas)

Todas foram feitas em Chromium headless, no build de preview final (`http://localhost:4173`).

| Validação | Viewport | Resultado | Evidência |
|---|---|---|---|
| `npm run typecheck` / `npm run build` | — | passou | build final sem erros |
| Asserções de dados/estado (`src/lib/__checks__.ts`) | — | 22/22 | `node --import ./src/lib/checks-resolve.mjs src/lib/__checks__.ts` |
| E2E (106 casos) | 1440×900 (+320–1440 nos casos de largura) | **106/106 passaram** | `qa/capturas/funcional/e2e-resultados-final.json` |
| Executivo válido, sem parâmetro, ID desconhecido ou malicioso, query com e-mail/telefone injetados | 1440 | passou | e2e |
| Prioridades 0/1/2/3, ordem, limite, rolagem preservada, M05 abre na 1ª prioridade | 1440 | passou | e2e |
| Empresa vazia, acentuada, com HTML e longa (80) | 1440 / 360 | passou, sem HTML injetado no DOM | e2e, `funcional/m09-nome-longo-*.png` |
| Adicionar e remover sem duplicar em M05 (frente e serviço), M06 e M07; visitar não adiciona | 1440 | passou | e2e |
| Nome acessível da frente e das 10 linhas do catálogo (únicos, "Adicionar/Remover da conversa: …") | 1440 | passou | e2e "A5" / "M05 catálogo" |
| Pauta: reordenar, editar, remover, item livre, duplicado, vazio, limite de 20 | 1440 / 360 | passou | e2e |
| Mensagem: prévia = corpo do `mailto`, edição preservada, "Atualizar mensagem", mensagem longa sem body | 1440 | passou (link inspecionado, nada aberto nem enviado) | e2e |
| Copiar mensagem/pauta com e sem Clipboard API | 1440 | passou | e2e |
| Storage indisponível, JSON quebrado, versão 99, campos inválidos, outro executivo | 1440 | passou | e2e |
| Reset: confirmação, Esc, limpeza, `?executivo` mantido, foco em `section#m01`, M01 em 64 px | 1440 | passou | e2e |
| Deep links `#m01`–`#m10`: topo da seção = base do header (64 px) | 1440 | passou | e2e |
| Slugs na carga e por troca de hash; hash desconhecido não quebra | 1440 | passou | e2e |
| Sem rolagem horizontal, página nova | 320, 360, 390, 1024, 1280, 1440 | 0 px | e2e |
| Sem rolagem horizontal com 13 itens na pauta (contador de 2 dígitos) | 320, 360, 390, 768, 1024, 1280, 1440 | 0 px | e2e, `final/vp-320-header-13itens.png`, `final/vp-360-header-13itens.png` |
| Zoom 200% simulado (720×450) | 720×450 | 0 px | a11y |
| Requisições a terceiros | todas as sessões e2e | **0** fora de `localhost` | e2e (`EXT []`) |
| axe-core 4.10.2 | 1440 e 390 | **0 violações** (de qualquer impacto) | `qa/capturas/funcional/a11y-resultados-final.json` |
| Teclado do início ao fim | 1440 / 390 | 60 / 56 paradas, todas com anel visível e na viewport | a11y |
| Alvos visíveis menores que 44 px | 1440 / 390 | 0 | a11y + e2e |
| Menu "Conteúdo", diálogo, acordeões M03/M07 por teclado | 1440 | passou | a11y |
| Reduced motion (M06 sem `<video>`, sem erro) | 1440 | passou | a11y |
| Revisão visual "depois" (capturas abertas e inspecionadas) | 1440 e 390, seção por seção | sem regressão encontrada | `qa/capturas/final/` |

O axe foi injetado a partir do cdnjs **apenas no navegador de teste**. A página não carrega nada de terceiros.

## Capturas finais (`qa/capturas/final/`)

- `desktop-1440-m01…m10.png` e `mobile-390-m01…m10.png`: cada seção inteira, com estado de exemplo (2 prioridades, empresa "Indústria Exemplo", Análise Ergonômica e eSocial na pauta), capturadas com animações desativadas.
  - A captura desktop de M06 mostra o trilho sticky como área escura longa. É o espaço de rolagem do palco preso, não uma lacuna. A sequência real está em `qa/capturas/depois/m06-sequencia-*`.
- Recortes de viewport: `vp-1440-m02`, `vp-1440-m03`, `vp-1440-m05-outras`, `vp-1440-m10-canais`, `vp-1024-m01` (sem trilho sobre o disco) e `vp-320/360-header-13itens`.
- Capturas anteriores: `qa/capturas/antes/`, `qa/capturas/depois/` (rodada visual), `qa/capturas/funcional/` e `qa/capturas/folhas/`.

## O que NÃO foi validado

- Safari (macOS/iOS) e Firefox: nada foi testado fora do Chromium. O MP4 de M06 está em `yuvj420p` (full range) e pode ter cor ou compatibilidade diferente no Safari. O WebM vem primeiro no `<source>`, mas o Safari usa o MP4. Recomenda-se renderizar de novo em `yuv420p`.
- Dispositivo real: iOS/Android, toque real, teclado virtual e barra de endereço dinâmica. As larguras mobile foram simuladas por viewport.
- Leitor de tela real (NVDA, VoiceOver, TalkBack). Só árvore de acessibilidade, nomes acessíveis e axe.
- Zoom real do navegador: foi simulado por viewport 720×450.
- Desempenho: Lighthouse/Web Vitals não foram executados. Não há pontuação a declarar.
- Autoplay bloqueado no vídeo de M06 e redes lentas.
- Abertura real de `mailto:`, `tel:`, LinkedIn e site. Só os `href` foram inspecionados; nenhum contato foi acionado.
- Hover em M05 (marcador amarelo) e transições: inspeção estática apenas.

## Rodada v2: pente fino de layout (2026-10-08, revisão final)

**Auditorias usadas como base:** `qa/auditoria-frontend-design.md` (A1–A7, B1–B10) e `qa/auditoria-ui-ux.md` (G1–G11, S1–S14), com as skills frontend-design e ui-ux-pro-max carregadas. O status de cada achado está marcado nos dois arquivos. O contrato atualizado está em `docs/STACK.md`, em "Padrão de layout v2". Copy e fatos não foram alterados.

### Correções desta revisão
| Pendência | Correção | Arquivos |
|---|---|---|
| Título de M03 em 3 linhas a 360 | O problema era o tamanho do corpo, não a medida. A 360 o título já ocupava os 326 px. `--fs-h1` passou a `clamp(1.75rem, 0.98rem + 3.7vw, 4.5rem)`: 28 px (≤320), 29 (360), 53,6 (1024), 63 (1280) e 69 (1440). Com isso, M03 e M05 ficam em 2 linhas a 360 e 390. Os títulos de item (26 px) continuam menores. | `styles/tokens.css` |
| M02 em 3 linhas no desktop (achado nesta auditoria) | A medida do título passou de 20ch para 21ch, e a coluna do cabeçalho de 52rem para 60rem. M02 fica em 2 linhas de 768 a 1440. M04 passa a ocupar 1 linha. | `ui/SectionHeader.module.css` |
| Catálogo de M05 longo no mobile | Rótulo e toggle ficam na mesma linha em todas as larguras. Abaixo de 560 px, o toggle usa `TopicToggle compact`, um disco de 48×48 com + / ✓, mantendo o nome acessível completo e `aria-pressed`. A linha inteira (≥64 px) também alterna. A 360, a altura da subseção caiu de ~2800 para **842 px**. | `ui/TopicToggle.*`, `M05Ecossistema.tsx`, `m05/…css` |
| Folha inferior do diálogo a 360 | Abaixo de 768 px, "Fechar" vira um disco de 44×44 só com ×, mantendo o nome acessível "Fechar". O título e o texto passam a ocupar a largura toda, e as ações do rodapé ficam em largura total. | `ui/Dialog.*` |
| `textarea` de M10 com rolagem interna a partir de 768 px | `max-height: 32rem` foi removido, e o campo cresce com o texto em todas as larguras. Medido com a mensagem longa: `scrollHeight` = `clientHeight` (2217 a 1440 e 4170 a 360). | `m10/M10Continuidade.module.css` |
| Falha 1 de 40 no fluxo anterior | Era a checagem "360 dialog centered". **Não era bug:** abaixo de 768 o diálogo é folha inferior por contrato. A checagem foi corrigida para exigir centro ≥768 e folha <768. As outras 39 passavam. | script de QA |
| S14: "Reiniciar"/"Limpar escolhas" em amarelo | Nova variante `Button variant="danger"`: tinta preenchida com texto branco (16,9:1) e hover em magenta auxiliar do brandbook (branco 6,6:1). Vale nos dois diálogos, com as duas ações em `md`. | `ui/Button.*`, `App.tsx`, `M09Pauta.tsx` |
| Campo 59 px ao lado de "Incluir" 52 px (achado nesta auditoria) | `input.field` passou a ter altura fixa de 52 px em todas as larguras, e "Incluir" usa a mesma altura. | `styles/global.css`, `m09/…css` |

### Medidas finais (dev, depois conferidas no preview)
| | 1440 | 1280 | 1024 | 390 | 360 | 320 |
|---|---|---|---|---|---|---|
| Eixo x de logo, títulos M01–M09 e footer | 102,4 | 75,2 | 30,1 | 17,4 | 16,8 | 16 |
| Título de capítulo (px) | 69 | 63 | 53,6 | 30,1 | 29 | 28 |
| Padding vertical das seções M02–M10 | 126,4 | 116,8 | 101,4 | 64 | 64 | 64 |
| Linhas do título de capítulo | todas ≤2 | ≤2 | ≤2 | ≤2 (M02: 3) | ≤2 (M02: 3) | M02 e M05: 3 |
| Rolagem horizontal | 0 | 0 | 0 | 0 | 0 | 0 |

- M10 tem o título na coluna direita (x=607 a 1440) por composição, com o retrato à esquerda. M01 usa `--fs-display`.
- Alturas: TopicToggle **48** em todas as larguras (compacto: 48×48); `input.field` **52**; Button md 53/52 (≥1024) e 48 (<480); lg 66/63 e 56 (<480); link 44. Nenhum alvo visível ficou abaixo de 44 px.

### Capturas (`qa/capturas/v2/`)
- `{1440,1280,1024,390,360}-{m01…m10,footer}.png` (recortes de uma captura de página inteira, com reduced motion) e `*-viewport-topo.png`. Todas foram abertas e inspecionadas. Por isso o trilho aparece só no recorte do topo.
- `fluxo/`: diálogo "Limpar escolhas" (1440 centralizado, 360 folha), M09 cheia, M10 com mensagem longa e M07 aberto com prioridade.

### Regressão no build de preview (4173, build novo)
| Verificação | Resultado |
|---|---|
| `npm run typecheck` e `npm run build` | passaram |
| e2e (executivo e fallback, ID malicioso, query injetada, prioridades e limite, empresa com HTML, M05/M06/M07 com `aria-pressed`, pauta editar/reordenar/limpar/limite de 20, mensagem longa, `mailto` sem body, copiar com e sem Clipboard API, storage, reset com foco em M01, deep links `#m01`–`#m10`, slugs, overflow em 320–1440, alvos ≥44) | **106 OK, 0 falhas**. Três checagens antigas liam `aria-label` do toggle e foram atualizadas para o nome acessível do TopicToggle (texto visível + assunto oculto). |
| Fluxo de layout (1440 e 360) | **42/42 OK**: diálogo centralizado no desktop e folha no mobile, botão destrutivo não amarelo, `textarea` sem rolagem interna, setas de M09 alinhadas, CTA de M09 depois da pauta no mobile |
| axe-core 4.10.2 (1440 e 390) | **0 violações** |
| Teclado | 59 (1440) e 56 (390) paradas, todas com anel visível. O diálogo prende o foco (o Tab sai só para a UI do navegador, comportamento nativo do `<dialog>` modal). Esc devolve o foco ao acionador. |
| Reduced motion em M06 | sem `<video>` e sem erro (`flow-1440-m06-reduce` na rodada anterior) |
| Requisições a terceiros | **0** (axe injetado só no navegador de teste) |

### Não validado nesta rodada
Safari (macOS/iOS), Firefox, toque real em iOS/Android, leitor de tela real (NVDA/VoiceOver/TalkBack), zoom real do navegador (simulado em 720×450) e `field-sizing` fora do Chromium (o fallback em JS existe, mas não foi exercitado). Também ficou sem validar o véu sob o menu "Conteúdo" no mobile (S14, parte opcional), que não foi implementado.

## Correção M06 vídeo (2026-10-08)

**Sintoma:** erro ao reproduzir a animação de M06 no Google Chrome (desktop Windows).

**Causa raiz:** o Remotion gravou os dois vídeos em faixa de cor "full" (`yuvj420p`, `color_range=pc`, BT.470BG). O WebM VP9, que era a primeira `<source>`, falha no decodificador de hardware do Chrome 154 e do Edge 154 no Windows: `MediaError` 3, `PIPELINE_ERROR_DECODE: video decode error!`, no primeiro quadro. Erro de decodificação não faz o navegador passar para o próximo `<source>`, então o MP4 nunca era tentado. Além disso, o componente não tratava o evento `error`: o botão alternava "Pausar/Reproduzir" sobre um vídeo quebrado. O Chromium do Playwright, o Firefox e o WebKit tocavam o arquivo antigo, por isso a falha não apareceu antes. O MP4 antigo (`yuvj420p`) tocava no Chrome real.

**Correção:**
- MP4 e WebM re-renderizados com `--pixel-format yuv420p --color-space bt709`, que resulta em faixa limitada BT.709. O MP4 é H.264 High com `moov` no início. Os scripts em `remotion/package.json` e o `remotion/README.md` foram atualizados.
- `M06Media.tsx`: o MP4 vem primeiro, e cada `type` declara `codecs`. A promessa de `play()` é tratada: `AbortError` é ignorado e `NotAllowedError` leva ao poster com "Reproduzir". Em erro de mídia, o componente tenta a outra fonte manualmente. Se as duas falharem, mostra o poster estático, sem botão e sem mensagem de erro. O botão passa a decidir pelo estado real do vídeo.

**Testado (Playwright, dev 5173 e preview 4173):** Chrome 154 real (headless e headed) em 1440×900 e 1920×1080 com sticky ativo e em 390×844; Edge 154 headed em 1920×1080; Chromium, Firefox e WebKit do Playwright em 1440×900. Com rolagem rápida para dentro e para fora, o vídeo toca uma vez até 7 s e o botão segue Rever > Pausar > Reproduzir, sem erro no console e sem rejeição não tratada. Falhas simuladas: com MP4 corrompido, cai para o WebM e toca; com MP4 404 e WebM antigo, mostra o poster. Com reduced motion, só o poster aparece (Chrome e WebKit). typecheck e build passaram. **Não testado:** Safari e iOS reais, Android real e o Chrome do próprio usuário.

## Rodada: revisão da experiência (4 ajustes) — 2026-10-08

Base: `docs/cred-mhs-revisao-da-experiencia.md` ("Comando enxuto"). Sem redesign; as melhorias da próxima rodada ficaram só registradas.

### O que foi alterado, por ajuste

| Ajuste | Arquivos |
|---|---|
| 1. Linguagem de bastidor fora da copy pública | `src/content/ecosystem.ts` (Saúde Ocupacional, soluções adicionais), `src/content/applications.ts` (eSocial, FAP/NTEP), `src/content/chapters.ts` (M04 apoio, M08 fallback). Antes → depois em `docs/07` ("Registro da revisão de copy — linguagem de bastidor") |
| 2. Objetivo da pauta explicado cedo | `src/content/chapters.ts` (`agendaHintTemplate`, `addHintTemplate`), `src/components/sections/M02Prioridades.tsx` + `m02/M02Prioridades.module.css`, `src/components/sections/M05Ecossistema.tsx` + `m05/M05Ecossistema.module.css` |
| 3. "Copiar pauta" no M09 | `src/components/sections/M09Pauta.tsx`, `m09/M09Pauta.module.css`, `m09/microcopy.ts` (`copyEmptyHint`), hook compartilhado `m10/useAgendaCopy.ts`, `m10/AgendaTextFallback.tsx` + `.module.css`, `M10Continuidade.tsx` |
| 4. M06 sem etapa concorrente | `remotion/src/M06Gestao.tsx` (versão neutra), `public/media/m06/m06-gestao.{mp4,webm}` e posters re-renderizados, `src/components/sections/m06/M06Media.tsx` (documentação da versão neutra), `remotion/README.md` |
| Esta verificação | Nenhuma correção de código foi necessária. Documentação: `docs/07` (P21 da microcopy de M09, decisão M06, "Próxima rodada"), `docs/guia/GUIA-DA-APRESENTACAO.md` (frases novas de M02/M04/M05, "Copiar pauta" no M09, vídeo neutro de M06, linha P18/P22) |

### O que foi efetivamente testado (preview 4173, build novo)

| Verificação | Navegador / viewport | Resultado |
|---|---|---|
| `npm run typecheck`, `npm run build`, `src/lib/__checks__.ts` | Node | passaram (22 verificações) |
| Suíte e2e da rodada anterior (executivo, prioridades e limite, empresa, M05/M06/M07, pauta, mensagem, `mailto`, cópia com e sem Clipboard API, storage, reset com foco em M01, deep links, slugs, overflow, alvos ≥44) | Chrome 154 real e Chromium do Playwright, 1440×900 (+360 nos casos de layout) | **106/106 OK em cada navegador**. Um seletor do teste foi ajustado porque M09 agora tem dois `role=status` (o do "Copiar pauta" e o de anúncios) |
| Verificação integrada dos 4 ajustes: frase de M02; limite de 2 prioridades; instrução única em M05; "Adicionar à conversa" em M05, M06 e M07 com o contador do topo 1→2→3; "Copiar pauta" no M09 habilitado, feedback "Pauta copiada.", texto copiado **idêntico** ao de M10; mensagem editável e `mailto` com o texto editado; reset (contador 0, avisos de M09/M10 vazios, foco em M01, "Copiar pauta" de M09 desabilitado com a dica visível, mensagem restaurada); console sem erro; 0 requisições a terceiros | Chrome real e Chromium, 1440×900, 390×844 e 360×740 | **134/134 OK** |
| Texto renderizado sem "O material apresenta", "descrito pela CRED", "apresentada pela CRED", "apresentadas", "solução apresentada", "o material", "o arquivo", "a fonte", "pendência" (innerText somado de todos os estados de acordeões, abas e detalhes; sondas confirmam que o aprofundamento de Saúde Ocupacional, o eSocial e o fallback de M08 foram lidos) | Chrome e Chromium, 1440 e 390 | nenhuma ocorrência |
| Sem scroll horizontal (320, 360, 375, 390, 414, 600, 768, 1024, 1280, 1366, 1440, 1600, 1920) | Chrome e Chromium | 0 px em todas |
| axe-core 4.10.2 | Chrome e Chromium, 1440 e 390 | **0 violações** |
| Teclado | Chrome e Chromium | 59 (1440) e 56 (390) paradas, todas com anel visível; diálogo prende o foco, Esc devolve o foco. No Chrome, o "Pular para o conteúdo" foi medido no meio da transição de entrada; após 100 ms está visível (top 8 px) |
| M06: vídeo × etapa | Chrome e Chromium, 1440×900, **1920×1080** e 390×844, rolagem pelas três etapas | o vídeo (MP4) toca até 7 s sem `MediaError`, console limpo, botão Pausar → Rever. O quadro final mostra os três aspectos com o mesmo peso enquanto o texto ativo muda de Acompanhamento para Integração e Informação gerencial: sem etapa concorrente (capturas conferidas) |
| M06 com reduced motion | Chrome e Chromium, 1440×900 | sem `<video>`, só o poster, sem erro |

Capturas em `qa/capturas/revisao-experiencia/` (Chrome real, desktop 1440×900 e mobile 390×844): `*-m02-vazia-*`, `*-m05-inicio-*`, `*-m05-adicionado`, `*-m06-1`, `*-m09-vazia-copiar-desabilitado`, `*-m09-com-pauta-*`, `*-m09-copiada`, `*-m10-*`. Todas foram abertas e inspecionadas: sem regressão de layout. Observações anteriores a esta rodada, não corrigidas (fora do escopo): em M06 desktop, os rótulos "Acompanhamento" e "Integração" da barra de progresso ficam quase encostados quando a etapa 2 está ativa; os sublinhados de link usam `skip-ink`, o que interrompe a linha sob o "p" de "Explorar".

### Não validado nesta rodada
Safari (macOS/iOS) e Firefox reais, Edge nesta rodada, toque real em iOS/Android, leitor de tela real (NVDA, VoiceOver, TalkBack), zoom real do navegador e o Chrome do próprio usuário. A colagem do texto copiado em aplicativos externos (Teams, WhatsApp, e-mail) não foi exercitada; foi conferido só o conteúdo da área de transferência. As imagens de `docs/guia/img/` são anteriores aos 4 ajustes e não foram refeitas.

### Próxima rodada
Ver `docs/07-fontes-e-pendencias.md`, "Próxima rodada": enxugar M08 (recomendação editorial), movimento a favor da compreensão em M06, pauta em PDF/impressão e os ajustes do próprio guia (certificações, fechar a aba, peso das pendências, imagens, escopo dos testes, roteiro curto).

## Pendências de conteúdo e ativos (Nil/CRED)

IDs de `docs/07-fontes-e-pendencias.md`:

| ID | Pendência |
|---|---|
| P01 | Tempo de experiência em conflito (30 no slide 4, 34 no slide 17, 35 no briefing). Hoje aparece "experiência multissetorial" e nenhuma idade. |
| P02 | Ranking "entre as 5 maiores" sem fonte ou critério. Mantido só no inventário. |
| P03 / P04 | Data-base dos números do slide 17. "27 Estados" foi substituído por "Atuação nacional". |
| P05 / P05a / P06 | ISO 9001, 45001 e 27001 sem titular, escopo e validade, com divergência entre os slides 9 e 18. M08 usa fallback. LGPD fica só no inventário. |
| P07 / P07a | Logos: 8 em destaque escolhidos pela ordem da fonte, sem juízo de relevância. Pedir as marcas prioritárias e os arquivos oficiais. Unicred tem imagem sem nome na relação. O mosaico de 14 marcas do slide 16 não está transcrito e não é exibido até a conciliação. Villefort aparece só em texto. |
| P08 | "4 soluções" eSocial sem as modalidades. |
| P09 / P10 / P11 | Atualização de "mais de 77 cursos", das siglas técnicas e do "seu sistema" do FAP/NTEP. |
| P13 | WhatsApp: o canal não foi confirmado e segue desabilitado. |
| P15 | Fonte: o brandbook pede Thin (corpo) e Heavy (títulos), pesos que não foram fornecidos. O preview usa Light/Regular e Black. O logo negativo é **derivado** (troca de `#1E1D1D` por branco); pedir o arquivo oficial. |
| P17 | Copyright do slide 16: titular da assinatura pública. |
| P18 / P22 | Frases de bastidor removidas da página (rodada "revisão da experiência"). Pendente só a redação técnica validada para qualquer menção à NR-7. |
| P21 | Microcopy nova a validar (também as frases de M02 e M05 e a dica de "Copiar pauta" em M09 da revisão da experiência) e a decisão de vocabulário desta rodada (botão "conversa", anúncio e selo "pauta") e o rótulo "E-mail". |
| P23 | Confirmar se o e-mail de Sabrina pode ficar visível na versão publicada. |
| P24 | Trilho do índice só a partir de 1280 px (decisão de implementação). |
| Mídia | MP4 e WebM de M06 re-renderizados em `yuv420p` BT.709 (ver "Correção M06 vídeo"). Antes de publicar, rever o poster PNG de 916 KB (a página usa o WebP de 28 KB). |

## Ajustes de 2026-10-12 (pedidos de Nil)

### M01 — retrato alinhado ao conteúdo (desktop ≥ 1024 px)
A altura do retrato acompanha a tela (`clamp(30rem, 100svh − header − respiro, 58rem)`); a largura sai da proporção da foto (limite `min(44vw, 42rem)`). O topo do retrato alinha com a linha do nome (diferença de 8 px). Mobile/tablet sem mudança.
**Testado (Chromium headless, dev 5173):** 1024×768, 1280×720, 1366×768, 1440×900, 1333×1000, 1920×1080, 2560×1440 — alinhamento conferido por medição e captura, sem rolagem horizontal. **Não testado:** navegadores reais do usuário.

### M06 — animação em loop
Composição Remotion refeita como ciclo de 20 s (formação lenta ≈ 8,5 s → movimento sutil → dissolução → emenda). Player com `loop`; toca em vista, pausa fora dela, retoma ao voltar salvo se o visitante pausou; botão só Pausar/Reproduzir ("Rever" removido). Reduced motion: só o poster (quadro 360).
**Testado:** render MP4/WebM (yuv420p, faixa tv, BT.709, 20,0 s; 1,19 MB / 0,87 MB); emenda quadro 599→0 com diferença máxima de 2/255; Chrome (Playwright, 1440×900): autoplay em vista, volta ao início após o fim, pausa fora de vista, retomada, pausa do visitante preservada, sem erro no console. **Não testado:** Safari/iOS e Android reais.

## Rodada mobile responsivo (20/10/2026)

Pedido do Nil: passada visual no mobile, foto inicial no topo.

- **Abertura (< 960 px):** o retrato vem logo abaixo do logo e sangra até a borda direita. Nome e cargo ficam numa etiqueta de tinta sobreposta ao retrato. Saudação, apoio e CTA vêm em seguida. A altura do retrato é dada em svh. Em telas baixas (≤ 640 px de altura) o retrato encurta e a etiqueta mostra só o nome.
- **Quem somos (< 1024 px):** fotos de apoio dentro da margem nas duas unidades (antes uma ficava a 1 px da borda e a outra vazava). Valor "Minas Gerais" na mesma caixa dos números, com rótulos alinhados. Vão menor entre Barra e Centro. Foto do Centro em 1:1.
- **Frentes (< 768 px):** o traço do cruzamento marca a linha do número (antes ficava no meio do bloco). O título transversal ganhou entrelinha para os tis não encostarem.
- **Depoimentos (< 600 px):** aspas menores e régua mais próxima do texto, com `text-wrap: pretty`.
- **Contato (< 1280 px):** retrato em faixa 4:3 sem vazio ao lado. Abaixo de 600 px, as ações ficam em largura total.
- **Mapa:** rótulo "Rede própria · Barra · Centro" com mínimo de 12 px (antes 10,5).
- Medido em Chromium (Playwright) em 320×568, 375×667, 390×844, 430×932 e 768×1024: retrato no topo e CTA dentro da primeira dobra nos cinco tamanhos. Sem rolagem horizontal da página; o carrossel de marcas transborda só dentro do próprio recorte. `npm run build` OK.
- Capturas: `qa/capturas/v3/mobile-responsivo/`.
- Não refeito nesta rodada: checks de conteúdo, RLS, axe e desktop 1440. As regras novas ficam só em media queries abaixo dos breakpoints citados; o desktop não foi recapturado.

## Depoimentos em carrossel (20/10/2026)

- Novo depoimento: Sandra Coelho, Gerente de RH, Radisson. Texto sem edição, em `copy.depoimentos.items`.
- Com 2 ou mais depoimentos, a seção vira carrossel no padrão do de marcas: rolagem nativa com scroll-snap, linha de progresso, contador e setas acima das citações, ← → / Home / End no trilho, sem avanço automático e aviso `aria-live`. A altura do trilho acompanha o depoimento ativo, sem vão quando o mais curto está na tela. Palavras com hífen (bem-estar, NR-1) não quebram.
- Testado em Chromium 390×844 e 1440×900: seta "próximo" leva a 2/2, ← volta a 1/2, altura 982→659 px (390) e 740→564 px (1440), sem rolagem horizontal, 0 erros de console. `npm run build` OK.

## Mobile compacto: acordeão, abas e carrosséis (20/10/2026)

Pedido do Nil: o mobile estava "grandão", com muito texto empilhado. O texto do PPT não mudou; só a forma de mostrar.

- **Escala (< 600 px, `tokens.css`):** corpo 16, apoio 17, h1 28, display 30, números 48. Respiro entre seções de 56 px e margem lateral de 20 px.
- **Quem somos (< 768):** unidades num trilho deslizável com botões Barra | Centro (a unidade seguinte aparece na borda). Missão | Visão | Valores em abas (`role=tablist`, ← →). Atributos mais compactos.
- **Atuação integrada (< 560):** disciplinas em duas colunas e diagrama com menos respiro.
- **Alcance (< 640):** os dois números lado a lado, alinhados pelo topo.
- **Depoimentos (< 768):** depoimento com mais de 480 caracteres começa recolhido em ~9 linhas, com "Ler depoimento completo" (`aria-expanded`). O carrossel acompanha a altura.
- **Seis frentes (< 768):** acordeão com número, título e +/−; uma aberta por vez, a primeira já aberta. Alvo ≥ 44 px.
- **Contato (< 600):** retrato em 16:10.
- Desktop: nenhum controle novo (0 botões de acordeão, aba ou "ler completo" em 1440). Os componentes só trocam de forma abaixo de 768 px (`useMediaQuery`).
- Medido em Chromium 390×844: página de ~12.800 → ~9.400 px. Sem rolagem horizontal em 390 e 320. Acordeão, abas (clique e seta), botões das unidades e "ler completo" (245 → 758 px) funcionando, 0 erros de console. `npm run build` OK.
- Capturas: `qa/capturas/v3/mobile-compacto/`. Não refeitos: axe, checks de conteúdo, captura completa do desktop.

## Rodada de apontamentos (22/10/2026)

- Textos: ver `docs/V3-ALTERACOES-TEXTO.md` (rodada 22/10). Terceiro depoimento (Hotel Nacional) no carrossel: contador 1/3 → 3/3 conferido.
- Slide 8: quebra fixa antes de “segurança do trabalho” e respiro maior abaixo de “Como entregamos”. Conferido em 1440 e 400 px.
- 99,4% deformado ao rolar (relato do Nil, corrigia ao abrir depoimentos): não reproduzido no Chrome desktop. Causa provável: a caixa do número mudava de largura durante a contagem (“0,0” → “99,4”) e o navegador não repintava a área. `CountUp` agora reserva a largura do número final desde o início. **Pendente:** confirmar no aparelho em que o problema apareceu.
- 22/10, depois da publicação: no celular, o topo dos “9” ficava cortado ao final da contagem (o desenho dos algarismos passa da caixa por causa da entrelinha 0,85, e só a caixa era repintada). O número animado ganhou folga vertical de 0,3em, compensada por margem negativa; o layout não muda (conferido em 400 px). **Pendente:** confirmar no aparelho.
