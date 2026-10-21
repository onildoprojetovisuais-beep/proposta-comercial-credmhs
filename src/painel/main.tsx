import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '../styles/global.css';
import { captureAuthCallback } from './authCallback';
import { PainelApp } from './PainelApp';

// Lê (e limpa) o retorno de convite/redefinição ANTES de o cliente Supabase ser criado.
const callback = captureAuthCallback();

const root = document.getElementById('root');
if (root) {
  createRoot(root).render(
    <StrictMode>
      <PainelApp callback={callback} />
    </StrictMode>,
  );
}
