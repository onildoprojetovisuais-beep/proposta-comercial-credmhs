import { getSupabase } from './client';
import {
  PHOTO_BUCKET,
  PHOTO_INPUT_MIME,
  PHOTO_MAX_DIMENSION,
  PHOTO_MAX_INPUT_BYTES,
  PHOTO_MAX_UPLOAD_BYTES,
} from './config';
import { PanelError, toPanelError } from './panel';

/**
 * Foto do executivo (dono: painel).
 * A otimização acontece no navegador: o arquivo original nunca sai do aparelho.
 * O canvas redesenha só os pixels, então EXIF, GPS e demais metadados não seguem para o Storage.
 */

export interface OptimizedPhoto {
  blob: Blob;
  width: number;
  height: number;
  mime: 'image/webp' | 'image/jpeg';
}

const EXT_TO_MIME: Record<string, string> = { jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp' };

function inputMime(file: File): string {
  if (file.type) return file.type.toLowerCase();
  const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
  return EXT_TO_MIME[ext] ?? '';
}

interface Decoded {
  source: CanvasImageSource;
  width: number;
  height: number;
  close: () => void;
}

async function decode(file: File): Promise<Decoded> {
  if (typeof createImageBitmap === 'function') {
    try {
      const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });
      return { source: bitmap, width: bitmap.width, height: bitmap.height, close: () => bitmap.close() };
    } catch {
      // Alguns navegadores não aceitam as opções: cai para <img>.
    }
  }
  const url = URL.createObjectURL(file);
  try {
    const img = new Image();
    img.decoding = 'async';
    img.src = url;
    await img.decode();
    // <img> já aplica a orientação EXIF nos navegadores atuais (image-orientation: from-image).
    return { source: img, width: img.naturalWidth, height: img.naturalHeight, close: () => URL.revokeObjectURL(url) };
  } catch {
    URL.revokeObjectURL(url);
    throw new PanelError('validation', 'Não foi possível abrir esta imagem. Tente outro arquivo JPEG, PNG ou WebP.');
  }
}

function toBlob(canvas: HTMLCanvasElement, type: string, quality: number): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob((b) => resolve(b), type, quality));
}

function render(decoded: Decoded, maxSide: number): HTMLCanvasElement {
  const scale = Math.min(1, maxSide / Math.max(decoded.width, decoded.height));
  const width = Math.max(1, Math.round(decoded.width * scale));
  const height = Math.max(1, Math.round(decoded.height * scale));
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new PanelError('unknown', 'Seu navegador não conseguiu preparar a foto. Tente outro navegador.');
  // Fundo branco: PNG com transparência não vira preto no JPEG.
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(decoded.source, 0, 0, width, height);
  return canvas;
}

/**
 * Valida, corrige a orientação, redimensiona (maior lado ≤ 1400 px) e exporta em WebP
 * (ou JPEG quando o navegador não gera WebP), garantindo ≤ 2 MB.
 */
export async function optimizePhoto(file: File): Promise<OptimizedPhoto> {
  const mime = inputMime(file);
  if (!(PHOTO_INPUT_MIME as readonly string[]).includes(mime)) {
    throw new PanelError('validation', 'Formato não aceito. Envie uma foto em JPEG, PNG ou WebP.');
  }
  if (file.size > PHOTO_MAX_INPUT_BYTES) {
    throw new PanelError('validation', `A foto tem mais de ${Math.round(PHOTO_MAX_INPUT_BYTES / 1024 / 1024)} MB. Escolha um arquivo menor.`);
  }
  if (file.size === 0) throw new PanelError('validation', 'O arquivo está vazio. Escolha outra foto.');

  const decoded = await decode(file);
  try {
    if (decoded.width < 200 || decoded.height < 200) {
      throw new PanelError('validation', 'A foto é pequena demais. Use uma imagem com pelo menos 600 px no menor lado.');
    }
    let maxSide = PHOTO_MAX_DIMENSION;
    let outputMime: OptimizedPhoto['mime'] = 'image/webp';
    for (let attempt = 0; attempt < 6; attempt += 1) {
      const canvas = render(decoded, maxSide);
      const qualities = outputMime === 'image/webp' ? [0.85, 0.78, 0.7] : [0.86, 0.78, 0.7];
      for (const quality of qualities) {
        let blob = await toBlob(canvas, outputMime, quality);
        // Safari antigo devolve PNG quando não sabe gerar WebP: troca para JPEG.
        if (outputMime === 'image/webp' && (!blob || blob.type !== 'image/webp')) {
          outputMime = 'image/jpeg';
          blob = await toBlob(canvas, outputMime, 0.86);
        }
        if (blob && blob.size <= PHOTO_MAX_UPLOAD_BYTES && blob.type === outputMime) {
          return { blob, width: canvas.width, height: canvas.height, mime: outputMime };
        }
      }
      maxSide = Math.round(maxSide * 0.85);
    }
    throw new PanelError('validation', 'Não foi possível reduzir a foto para até 2 MB. Tente outra imagem.');
  } finally {
    decoded.close();
  }
}

function randomToken(): string {
  const bytes = new Uint8Array(6);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
}

/** Envia um arquivo NOVO (nome único) para `<userId>/…`. Retorna o caminho no bucket. */
export async function uploadOwnPhoto(userId: string, optimized: OptimizedPhoto): Promise<string> {
  const supabase = getSupabase();
  if (!supabase) throw new PanelError('not-configured', 'O painel ainda não está configurado.');
  const ext = optimized.mime === 'image/webp' ? 'webp' : 'jpg';
  const path = `${userId}/${Date.now()}-${randomToken()}.${ext}`;
  try {
    const { error } = await supabase.storage.from(PHOTO_BUCKET).upload(path, optimized.blob, {
      upsert: false,
      contentType: optimized.mime,
      cacheControl: '31536000',
    });
    if (error) throw error;
  } catch (error) {
    const mapped = toPanelError(error, 'uploadOwnPhoto');
    if (mapped.kind === 'network') throw mapped;
    throw new PanelError(mapped.kind, 'Não foi possível enviar a foto. Tente de novo.');
  }
  return path;
}

/** Apaga um arquivo do próprio usuário. Falha silenciosa: um órfão não deve travar o painel. */
export async function removeOwnPhoto(userId: string, path: string | null | undefined): Promise<void> {
  if (!path || !path.startsWith(`${userId}/`)) return;
  const supabase = getSupabase();
  if (!supabase) return;
  try {
    const { error } = await supabase.storage.from(PHOTO_BUCKET).remove([path]);
    if (error && import.meta.env.DEV) console.warn('[painel] removeOwnPhoto', error);
  } catch (error) {
    if (import.meta.env.DEV) console.warn('[painel] removeOwnPhoto', error);
  }
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / 1024 / 1024).toLocaleString('pt-BR', { maximumFractionDigits: 1 })} MB`;
}
