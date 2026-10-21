/**
 * Configuração pública do Supabase (CONTRATO COMPARTILHADO — dono: coordenação).
 *
 * Só variáveis `VITE_*` chegam ao navegador. Aqui entram apenas a URL do projeto e a
 * chave pública (anon / publishable). A `service_role` (ou `sb_secret_…`) NUNCA vai
 * para o frontend nem para `.env` versionado. Ver docs/CONFIGURACAO-SUPABASE.md.
 */

/** Bucket público de retratos. Caminho de cada arquivo: `<auth.uid()>/<arquivo>.webp|jpg`. */
export const PHOTO_BUCKET = 'executive-photos';

/** Limite do arquivo enviado ao Storage, já otimizado (igual ao `file_size_limit` do bucket). */
export const PHOTO_MAX_UPLOAD_BYTES = 2 * 1024 * 1024;

/** Tipos aceitos pelo bucket (iguais a `allowed_mime_types`). */
export const PHOTO_ALLOWED_MIME = ['image/webp', 'image/jpeg'] as const;

/** Tamanho máximo do arquivo escolhido pelo executivo, antes da otimização no navegador. */
export const PHOTO_MAX_INPUT_BYTES = 15 * 1024 * 1024;

/** Tipos de entrada aceitos no seletor de arquivo (convertidos para WebP/JPEG). */
export const PHOTO_INPUT_MIME = ['image/jpeg', 'image/png', 'image/webp'] as const;

/** Maior lado da foto otimizada, em px (retrato atual de Sabrina: 1098 × 1433). */
export const PHOTO_MAX_DIMENSION = 1400;

export interface SupabasePublicConfig {
  url: string;
  anonKey: string;
}

function read(name: 'VITE_SUPABASE_URL' | 'VITE_SUPABASE_ANON_KEY'): string {
  const value = (import.meta.env[name] as string | undefined) ?? '';
  return value.trim();
}

/** null quando as variáveis não foram preenchidas (o site segue com o perfil local de Sabrina). */
export function getSupabaseConfig(): SupabasePublicConfig | null {
  const url = read('VITE_SUPABASE_URL').replace(/\/+$/, '');
  const anonKey = read('VITE_SUPABASE_ANON_KEY');
  if (!url || !anonKey) return null;
  if (!/^https?:\/\//.test(url)) return null;
  // Defesa: uma chave secreta colada por engano não deve ser usada no navegador.
  if (anonKey.startsWith('sb_secret_') || looksLikeServiceRoleJwt(anonKey)) {
    console.error('[supabase] VITE_SUPABASE_ANON_KEY contém uma chave secreta. Use a chave anon/publishable.');
    return null;
  }
  return { url, anonKey };
}

export function isSupabaseConfigured(): boolean {
  return getSupabaseConfig() !== null;
}

/** Origem usada em "Copiar meu link". Opcional: `VITE_PUBLIC_SITE_URL`; senão, a origem atual. */
export function getPublicSiteOrigin(): string {
  const configured = ((import.meta.env.VITE_PUBLIC_SITE_URL as string | undefined) ?? '').trim().replace(/\/+$/, '');
  if (/^https?:\/\//.test(configured)) return configured;
  return typeof window !== 'undefined' ? window.location.origin : '';
}

function looksLikeServiceRoleJwt(key: string): boolean {
  const parts = key.split('.');
  if (parts.length !== 3) return false;
  try {
    const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'))) as { role?: string };
    return payload.role === 'service_role';
  } catch {
    return false;
  }
}
