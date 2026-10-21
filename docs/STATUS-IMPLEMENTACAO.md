# Status da implementação — V3 (PPT da Sabrina, 20/10/2026)

## Rodada 21/10/2026 — ajustes da Sabrina sobre o protótipo
Leveza: menos traços, caixas, molduras e numeração. Detalhes em `qa/RELATORIO.md` e textos em `docs/V3-ALTERACOES-TEXTO.md`.
- Nova seção `missao-visao-valores` (saiu de Quem somos; valores sem 01–04). Página passa a ter 12 seções (slide 3 → 2 seções).
- Quem somos: sem os indicadores 35/MG/2008/2018; atributos em composição circular; fotos Barra e Centro mantidas.
- Atuação integrada sem diagrama. Alcance sem rótulo superior; Rio rotulado “Rio de Janeiro - Barra e Centro”.
- Transição sem foto, ênfase em “mais gestão”.
- Frentes: sete (nova “Dados e Privacidade”, 05); textos 01–04 da Sabrina; sem “Como entregamos” e sem o bloco preto; “Comunicação e reputação” como fecho sem número (P49a).
- Contato: texto flutuante, sem caixas/números; LinkedIn e site só com ícone.

**Atualizado em:** 20/10/2026. **Estado:** V3 local implementada, integrada, revisada de forma independente e corrigida; rodada de sobriedade (referência) aplicada (ver `qa/RELATORIO.md`). Nada foi publicado. Supabase segue só simulado.

Autoridade: `docs/CRED-MHS-Apresentacao-Comercial.pptx` → `docs/V3-CONTRATO.md` → `docs/V3-ALTERACOES-TEXTO.md`. V2 recuperável em `historico/v2-antes-da-v3-2026-10-20.tar.gz`.

## O que existe
- Onze seções na ordem dos slides (`src/components/sections/v3/`): abertura, provocação, quem somos, atuação integrada, alcance (mapa), depoimentos (carrossel: Radix e Radisson, desde 20/10), satisfação*, transição, seis frentes, empresas (carrossel), contato. *Ocultas ao cliente enquanto pendentes; visíveis em `?revisao=1`.
- Copy em `src/content/chapters.ts` (texto do PPT; ajustes só no slide 9 e no slide 11). Fidelidade: `docs/V3-FIDELIDADE-TEXTO.md`.
- Mapa: `src/motion/map/` (Remotion Player sob demanda, geometria IBGE, 27 símbolos por UF como no PPT, destaque do RJ “Rede própria — Barra · Centro” em HTML; uma reprodução, pausa/repetição, estático em reduced motion). `docs/V3-MAPA.md`; composição `MapaBrasil` em `remotion/`.
- Marcas: 8 logos do slide 10 + Fairmont (`src/content/clients.ts`, `public/media/clientes/`, `docs/V3-LOGOS.md`).
- Fotos: `public/media/fotos/` (`docs/V3-FOTOS.md`).
- Casca: sem menu “Conteúdo”; trilho lateral discreto (≥1024 px); logo integrado à abertura; rodapé leve.
- Removidos da página: selos 3C/3I, trilha de cinco etapas e sua animação Remotion, quatro eixos, seções V2.
- Preservados: `?executivo=`, `PresentationRoot`, contatos (`contactLinks`), painel `/painel/`, Supabase.

## Pendências de conteúdo
Ver `docs/07-fontes-e-pendencias.md` (seção V3): P47 depoimentos (2 recebidos e publicados: Radix e Radisson), P48 CSAT, P49 “Comunicação e reputação”, P50 títulos A/D, P51 “1 / 3” com 8 logos, P52 fotos, P53 unidade de cada foto, P45 licença Remotion, P13 WhatsApp.

---

# (Histórico) Status da implementação — V2 (rev. 2.1)

**Atualizado em:** 16/10/2026. **Estado:** V2 local implementada, integrada e revisada, com a rodada de refinamento de 16/10 (CTA e movimento). Nada foi publicado. Supabase segue só simulado.

## Rodada 16/10/2026 — refinamento (detalhes em `qa/RELATORIO.md`)
- CTA da abertura: “Saiba mais” (antes “Vamos começar”), mesmo destino `#institucional`; rolagem livre mantida.
- Trilha (06): camada de movimento Remotion (`@remotion/player` 4.0.534, chunk sob demanda de ~93 kB gzip; composição em `src/motion/trail/`, também registrada como `TrilhaValor` em `remotion/`). Uma reprodução por entrada, pausa ao sair/continua ao voltar, “Pausar/Continuar animação” e “Repetir animação”, reduced motion estático. B2 resolvido: Investimento com o mesmo marcador.
- Soluções (07): entrada coordenada dos quatro eixos. Dados (04): sequência disperso → organizado.
- Verificações: typecheck e build OK; checks 18/18 (novo: linha do tempo da trilha); RLS 64/64; Chromium em 1440/768/390/320 com e sem reduced motion. Capturas em `qa/capturas/v2/rodada-2026-10-16/`.
- 3C/3I visíveis (decisão do Nil, 16/10): selo do eixo no cabeçalho das seções 02–07 e legenda na institucional (`src/content/positioning.ts`). Checks 19/19.
- Novas pendências: P46 (validar mapeamento/legenda 3C/3I), P43 (transcrição de 13/10 ausente), P44 (revisão visual citada não encontrada), P45 (licença Remotion).
Autoridade: `docs/REVISAO-CRED-MHS-V2.md`. Contrato e divisão de arquivos: `docs/V2-CONTRATO.md`. Mapeamento dos frameworks: `docs/V2-MAPEAMENTO-FRAMEWORKS.md`. V1 recuperável em `historico/v1-antes-da-v2-2026-10-14.tar.gz`.

## O que existe
- Oito dobras: abertura (`#abertura`), institucional com números e empresas, relacionamento, dados, gestão integrada, trilha de valor (5 etapas), soluções (4 eixos + rede), contato. Componentes em `src/components/sections/v2/`.
- Conteúdo tipado: `src/content/chapters.ts`, `solutions.ts`, `valueTrail.ts`, `facts.ts`, `clients.ts`, `coverage.ts`.
- Estado: só o executivo resolvido (`src/state/ExecutiveContext.tsx`); sem sessionStorage; chave da V1 é limpa na carga.
- Contatos: `contactLinks(executive)` sem corpo de mensagem; WhatsApp e agendamento ocultos até haver canal/URL confirmados.
- Removidos: prioridades, pauta, mensagem gerada, “Nova apresentação”, frentes V1, TopicToggle, Dialog, seções M01–M10.
- Painel e Supabase: inalterados (Preview do painel usa a copy nova).

## Verificações (14/10)
- `npm run build` OK; checks 17/17; `npm run test:rls` 64/64.
- QA do coordenador em Chromium (1440/768/390/320, perfis simulados): 61/62. A falha é falso negativo do script (texto do perfil desativado correto).
- Revisão independente: `qa/V2-REVISAO-INDEPENDENTE.md`, sem bloqueantes. Corrigidos e recapturados (`qa/capturas/v2/pos-correcoes/`): A1 (foto não quadrada no contato), M1 (abertura sem foto no desktop), M2 (“CRED MHS” sem quebra), B1 (perfil sem canal válido mostra o site institucional), e B3 (saltos longos do índice vão direto; tempo não medido, só confirmado que CTA e hashes seguem passando). Em aberto: B2.
- QA final do coordenador após as correções: 62/62 (`qa/capturas/v2/final/`).
- Capturas: `qa/capturas/v2/integrada/`, `qa/capturas/v2/agente2/`, `qa/capturas/v2/revisao-independente/`.

## Próximos passos
1. Capturas do guia: feitas (`docs/guia/img/v2/`).
2. B2 resolvido em 16/10 (mesmo marcador nas cinco etapas).
3. Pendências de conteúdo em `docs/07-fontes-e-pendencias.md` (P33 JPEGs ausentes, P01 30/34/35 anos, P03/P04 números, P05 ISO, P13 WhatsApp, booking, P38 itens fora do framework, P41 validação da copy pela Sabrina).
4. Supabase real e hospedagem: seguir `docs/CONFIGURACAO-SUPABASE.md`, só com autorização de Nil.

O status V1 de 10/10 (Supabase) está em `historico/` dentro do tar.
