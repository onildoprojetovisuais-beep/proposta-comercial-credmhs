import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/global.css';
import PresentationRoot from './app/PresentationRoot';

// Hospedagens que reescrevem tudo para /index.html entregam esta página em /painel.
// O painel é uma página própria (painel/index.html); leva o navegador até ela.
// Exceção para "/painel/" exato: evita laço se a hospedagem estiver mal configurada.
if (/^\/painel(\/.*)?$/.test(window.location.pathname) && window.location.pathname !== '/painel/') {
  window.location.replace(`/painel/${window.location.search}${window.location.hash}`);
} else {
  const root = document.getElementById('root');
  if (!root) throw new Error('Elemento #root não encontrado');

  createRoot(root).render(
    <StrictMode>
      <PresentationRoot />
    </StrictMode>,
  );
}
