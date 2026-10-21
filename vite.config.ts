import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Só `public/` é servido/copiado. `assets/`, `sources/`, `docs/` e `remotion/`
// ficam fora da saída pública por não estarem em `public/`.
// Duas páginas: a apresentação pública (index.html) e o painel dos executivos
// (painel/index.html → dist/painel/index.html). Assim /painel/ existe como arquivo
// real em qualquer hospedagem estática e o código do painel fica fora do bundle público.
export default defineConfig({
  plugins: [react()],
  server: { port: 5173, host: 'localhost' },
  preview: { port: 4173 },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        painel: resolve(__dirname, 'painel/index.html'),
      },
    },
  },
});
