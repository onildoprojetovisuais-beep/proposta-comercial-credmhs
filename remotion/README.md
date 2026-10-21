# Remotion — composições da apresentação CRED MHS

## MapaBrasil (V3, 20/10/2026) — em uso na página

Mapa do Brasil da seção Alcance (slide 5). **A página não usa vídeo renderizado:** a mesma cena roda no navegador via `@remotion/player`, carregada sob demanda por `src/motion/map/BrazilMap.tsx`. Aqui ela ganha o fundo amarelo (#FFCA00) para o Studio e para renders de conferência. Detalhes de geometria (IBGE), símbolos, sequência e comportamento estão em `../docs/V3-MAPA.md`.

- 225 quadros a 30 fps (7,5 s), tocados uma vez. O quadro 0 é vazio; o último mostra o mapa completo, que fica parado.
- `remotion.config.ts` faz o código de `../src` usar o React e o Remotion deste subprojeto e fixa a concorrência em 1. Esta máquina trava sob carga.
- Comandos, um por vez, dentro de `remotion/`:
  ```bash
  npm run studio
  npx remotion still src/index.ts MapaBrasil out/mapa/mapa-q224.png --frame 224 --concurrency=1 --overwrite
  npm run render:mapa   # out/mapa/mapa-referencia.mp4 (h264, yuv420p, bt709, sem áudio)
  ```
  As saídas ficam em `out/` (fora de `public/` e não são publicadas).
- Para regenerar a geometria, use `scripts/gerar-mapa-ibge.py` (ver `../docs/V3-MAPA.md`).

## Retirado

- **TrilhaValor (V2)**: a trilha de valor foi retirada da página.
- **M06Gestao (V1)**: superado na V2.

O código está em `../historico/` (`v2-antes-da-v3-2026-10-20.tar.gz`, `v1-antes-da-v2-2026-10-14.tar.gz`). `public/fonts/` e `public/logo-negativo.svg` ficaram neste subprojeto, mas não são usados pela composição atual.

## Licença

A Remotion exige a Company License para uso comercial por empresas com mais de 3 pessoas (remotion.dev/license). Essa decisão está pendente com a Pixel Rain/CRED.
