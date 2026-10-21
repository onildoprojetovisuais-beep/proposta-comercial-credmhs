import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';
import { getSupabaseConfig } from './config';

/**
 * Cliente Supabase do PAINEL (CONTRATO COMPARTILHADO — dono: coordenação).
 * A apresentação pública não usa este cliente: lê o perfil por `fetch` na RPC pública
 * (src/lib/supabase/publicProfile.ts), para não carregar Auth no bundle do cliente final.
 */
let client: SupabaseClient | null = null;

/** null quando o Supabase não está configurado. */
export function getSupabase(): SupabaseClient | null {
  if (client) return client;
  const config = getSupabaseConfig();
  if (!config) return null;
  client = createClient(config.url, config.anonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      // Links de convite e de redefinição de senha voltam para /painel/ com o token na URL.
      detectSessionInUrl: true,
      flowType: 'pkce',
      storageKey: 'cred-mhs-painel-auth',
    },
  });
  return client;
}
