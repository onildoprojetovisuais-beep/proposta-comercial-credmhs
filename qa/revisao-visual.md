# Revisão visual — 2026-10-08

Ambiente: Vite dev (`npm run dev`, http://localhost:5173/?executivo=sabrina-ferreira), Chromium headless via Playwright (Python). As capturas são quadros de viewport ao longo de cada seção, com header e trilho fixos visíveis. Os scripts ficaram fora do repositório, no scratchpad da sessão.
"Zoom 200%" = viewport CSS 720×450 com `device_scale_factor=2`, o equivalente a 1440×900 em 200%. Reduced motion = `reduced_motion="reduce"` em 1440×900.
Typecheck e build passaram depois das correções.

## Matriz viewport × seção

Legenda: OK = sem problema visual relevante · C = corrigido nesta revisão · N = observação registrada, sem correção.

| Seção | 1440×900 | 1280×720 | 1024×768 | 390×844 | 360×740 | reduced | zoom 200% |
|---|---|---|---|---|---|---|---|
| Header | C (eixo) | OK | OK | OK | OK (C a 320) | OK | OK |
| M01 | OK | OK | N1 | OK | OK | OK | OK |
| M02 | N2 | OK | OK | OK | OK | OK | OK |
| M03 | N3 | OK | OK | OK | OK | OK | OK |
| M04 | OK | OK | OK | OK | OK | OK | OK |
| M05 | N4 | N4 | OK | OK | OK | OK | OK |
| M06 | C | C | C | OK (fluxo) | OK (fluxo) | OK (fluxo) | OK (fluxo) |
| M07 | C | C | C | OK | OK | OK | OK |
| M08 | C | C | OK | OK | OK | OK | OK |
| M09 | C | OK | OK | OK | OK | OK | OK |
| M10 | C | OK | OK | OK | OK | OK | OK |

Não há rolagem horizontal em 1440, 1280, 1024, 720@2x, 390 e 360. A 320 px houve rolagem; foi corrigida (ver item 6). O disco amarelo de M01 ultrapassa a largura da viewport, mas a seção o recorta com `overflow: hidden`.

## Problemas → correções

1. **O trilho do índice encostava no conteúdo** (1440: 12 px de M06/M07/M08, chegando a tocar o palco de M06; 1280/1024: as seções padrão também chegavam a ~0 px).
   **Correção:** em `src/styles/global.css`, quando o trilho está visível (≥1024 × ≥640), `main .container` usa `max-width: min(token, 100% − 5rem)`, uma reserva simétrica.
   **Medido depois:** a folga até o trilho é de 58 px nas seções largas e 106 px nas padrão em 1440, 31 px em 1280 e 26 px em 1024. A barra amarela de fase de M06 fica a x≈82 em 1440 e x≈50 em 1024, sem sobreposição.
2. **Eixo esquerdo saltava 96 px** entre M05 (x=150) e M06–M10 (x=54), e o logo ficava a 56.
   **Correção:** `--content-wide` passou de 88rem para 82rem (`tokens.css`). Agora o salto é de 48 px, e header, M06 e M10 compartilham o eixo x≈102.
3. **"Ver outras soluções" (M07) levava ao topo de M05.** Agora rola e foca `#m05-outras-solucoes` (`M07Aplicacoes.tsx`, usando `M05_ADDITIONAL_ID`). Respeita reduced motion e mantém o hash `#m05`. Verificado: o foco fica em `m05-outras-solucoes` e o alvo, a 160 px do topo, abaixo do header.
4. **PNG de 2,2 MB em `public/media/executives/`.** Não era carregado: M01 e M10 usam o caminho apenas como chave para os derivados 640/1098 (avif/webp/jpg). O arquivo era idêntico ao original (`assets/executives/sabrina-ferreira/foto-sabrina.png`, mesmo MD5), por isso a cópia de `public` foi removida. O `dist/media/executives` agora contém só os derivados.
5. **M06 na página completa** (sequência `m06-sequencia-*`, log `m06-log-*.json`):
   - O palco fica preso em `top: 64px`, logo abaixo do header, em 1440×900 e 1280×720.
   - As fases trocam 01→02→03 ao longo do trilho, e a seção libera a seguinte sem área presa.
   - O vídeo começa com 50% do palco visível, toca uma vez (7 s) e termina perto da liberação do sticky. Não há loop.
   - Em 1024×768, sticky ok. Em mobile, reduced motion e zoom: fluxo natural com poster.
6. **Header a 320 px** (reflow): a rolagem horizontal era de 35 px. Os espaçamentos do botão "Conteúdo" e de "Sua pauta" foram compactados abaixo de 360 px. O logo continua com 156 px, acima do mínimo do brandbook.
7. **Badge "Sua prioridade" em M07:** depois de escolher "Gestão e Tecnologia" em M02, eSocial mostra "Sua prioridade: Gestão e Tecnologia", com faixa e número em destaque. Funciona (`m07-badge-prioridade-1440.png`).

## Pendências / observações (sem correção)

- **N1:** em 1024 px, o trilho fica sobre o disco amarelo de M01. Os números continuam legíveis porque têm fundo branco.
- **N2:** em 1440 px, a coluna direita de M02 começa alinhada à lista (sticky com offset). Isso deixa um vazio grande no topo direito. É intencional, mas pode ser recomposto.
- **N3:** em M03, "Atuação nacional" fica alinhado à base. Há um vazio acima no desktop.
- **N4:** em M05, "Outras necessidades" repete 10 botões idênticos "Adicionar à conversa", e a coluna esquerda fica vazia ao longo da lista. É o principal ponto de repetição visual da página.
- Persiste um salto de eixo de 48 px entre as seções padrão e as largas.
- **Não verificado:** Safari/iOS e Firefox reais, zoom real do navegador (foi simulado por viewport), leitor de tela, interação por toque real e desempenho medido.
- No script, o quadro "a" de M01 rola 64 px. O corte da cabeça aparece só nele (ver `m390-m01-abertura.png`/`m360-m01-abertura.png` na posição 0).

## Capturas

- `qa/capturas/antes/`: 1440×900 antes das correções (22 quadros: `antes-desktop-m01…m10`).
- `qa/capturas/depois/`: `{desktop|short|tablet|m390|m360|reduced|zoom200}-mNN[-a…e].png` (cerca de 190 quadros). Também: `m06-sequencia-{1440x900|1280x720}-NN.png`, `m06-log-*.json`, `m07-badge-prioridade-1440.png`, `m07-ver-outras-solucoes-destino-1440.png`, `m360/m390-m01-abertura.png` e `m320/m360-header-reflow.png`.
- `qa/capturas/folhas/`: folhas de contato por viewport, usadas na revisão.

## Arquivos alterados

`src/styles/global.css`, `src/styles/tokens.css`, `src/components/sections/M07Aplicacoes.tsx`, `src/app/App.module.css`, `src/components/ui/ChapterNavigation.module.css`; removido `public/media/executives/sabrina-ferreira.png`.
