import { getSupabaseConfig, PHOTO_BUCKET } from './config';

/**
 * URL pública de um retrato salvo no bucket (CONTRATO COMPARTILHADO — dono: coordenação).
 * `photo_path` é o caminho dentro do bucket: `<user_id>/<arquivo>`.
 * Retorna null para caminho vazio, inválido ou Supabase não configurado.
 */
export const PHOTO_PATH_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\/[A-Za-z0-9._-]{1,120}$/;

export function photoPublicUrl(photoPath: string | null | undefined): string | null {
  if (!photoPath || !PHOTO_PATH_PATTERN.test(photoPath)) return null;
  const config = getSupabaseConfig();
  if (!config) return null;
  const encoded = photoPath.split('/').map(encodeURIComponent).join('/');
  return `${config.url}/storage/v1/object/public/${PHOTO_BUCKET}/${encoded}`;
}
