import { useEffect, useRef, useState } from 'react';
import type { RefObject } from 'react';
import type { Executive } from '../../../types';
import type { Photo } from '../../../app/mediaManifest';
import { photoFallback, photoSrcSet } from '../../../app/mediaManifest';
import { typeset as baseTypeset, typesetLabel } from '../../../lib/typeset';

/**
 * Peças compartilhadas das seções V3: retrato do executivo, foto real da CRED e revelação
 * decorativa por rolagem.
 */

/**
 * Fontes otimizadas do retrato do projeto (`photoSource: 'bundled'`), derivadas do caminho do
 * perfil. Foto do Supabase (`remote`) já chega otimizada pelo painel: um único arquivo.
 */
function portraitSources(photo: string) {
  const base = photo.replace(/\.(png|jpe?g|webp|avif)$/i, '');
  // Só o perfil documentado tem derivados gerados (public/media/executives/*-640/-1098).
  if (!base.endsWith('/sabrina-ferreira')) return null;
  return {
    avif: `${base}-640.avif 640w, ${base}-1098.avif 1098w`,
    webp: `${base}-640.webp 640w, ${base}-1098.webp 1098w`,
    fallback: `${base}-1098.jpg`,
  };
}

interface PortraitProps {
  executive: Executive;
  sizes: string;
  className?: string;
  /** Prioridade de carregamento (só na abertura). */
  priority?: boolean;
  /** Texto alternativo; '' quando o nome já está ao lado e a foto é complementar. */
  alt?: string;
  /** Chamado quando não há foto ou ela falha — a dobra usa o layout tipográfico. */
  onMissing?: () => void;
}

/** Retrato real do executivo (local com derivados ou URL remota). Sem foto → null. */
export function Portrait({ executive, sizes, className, priority, alt, onMissing }: PortraitProps) {
  const [failed, setFailed] = useState<string | null>(null);
  const photo = executive.photo && executive.photo !== failed ? executive.photo : null;

  useEffect(() => {
    if (!photo) onMissing?.();
  }, [photo, onMissing]);

  if (!photo) return null;
  const sources = executive.photoSource === 'bundled' ? portraitSources(photo) : null;
  return (
    <picture>
      {sources ? <source type="image/avif" srcSet={sources.avif} sizes={sizes} /> : null}
      {sources ? <source type="image/webp" srcSet={sources.webp} sizes={sizes} /> : null}
      <img
        src={sources?.fallback ?? photo}
        alt={alt ?? executive.photoAlt}
        width={executive.photoWidth ?? 1098}
        height={executive.photoHeight ?? 1433}
        {...(priority ? { fetchpriority: 'high' } : { loading: 'lazy' as const })}
        decoding="async"
        className={className}
        onError={() => setFailed(photo)}
      />
    </picture>
  );
}

/** Movimento permitido? Falso com reduced motion ou sem IntersectionObserver. */
function motionAllowed(): boolean {
  if (typeof window === 'undefined' || typeof IntersectionObserver === 'undefined') return false;
  return !window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Revelação decorativa: marca `data-inview="true"` nos `[data-reveal]` da seção quando entram na
 * tela e liga `html.motion-ok`. Nunca esconde texto (ver global.css): sem movimento permitido,
 * tudo já está no estado final.
 */
export function useReveal<T extends HTMLElement>(): RefObject<T> {
  const ref = useRef<T>(null);
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const targets = Array.from(root.querySelectorAll<HTMLElement>('[data-reveal]'));
    if (!motionAllowed()) {
      targets.forEach((t) => t.setAttribute('data-inview', 'true'));
      return;
    }
    document.documentElement.classList.add('motion-ok');
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.setAttribute('data-inview', 'true');
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.15 },
    );
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, []);
  return ref;
}

interface CredPhotoProps {
  photo: Photo;
  /** `sizes` do <img> (largura de exibição). */
  sizes: string;
  className?: string;
  /** '' quando a foto é decorativa ao lado de um rótulo que já a descreve. */
  alt?: string;
}

/** Foto real da CRED (public/media/fotos), AVIF → WebP → JPEG, com ponto de interesse. */
export function CredPhoto({ photo, sizes, className, alt }: CredPhotoProps) {
  return (
    <picture>
      <source type="image/avif" srcSet={photoSrcSet(photo, 'avif')} sizes={sizes} />
      <source type="image/webp" srcSet={photoSrcSet(photo, 'webp')} sizes={sizes} />
      <img
        src={photoFallback(photo)}
        alt={alt ?? photo.alt}
        width={photo.width}
        height={photo.height}
        loading="lazy"
        decoding="async"
        className={className}
        style={{ objectPosition: photo.position }}
      />
    </picture>
  );
}

/** Espaço inseparável (U+00A0). */
const NBSP = String.fromCharCode(0xa0);

/**
 * `typeset` de src/lib + quatro regras medidas nas seções V3 (ver qa/V3-REVISAO-INDEPENDENTE.md):
 * - pronomes/demonstrativos curtos (te, eu, esse, essa, este, esta) presos à palavra seguinte;
 * - travessão preso à palavra seguinte (“negócio / — e acompanhar”), nunca no fim da linha;
 * - separador “·” preso à palavra anterior;
 * - última palavra presa à anterior até 18 caracteres (ex.: “multidisciplinar.”).
 * Só troca espaços por U+00A0; o texto de src/content não muda.
 */
export function typeset(text: string, options: { orphan?: boolean } = {}): string {
  let out = baseTypeset(text, options);
  for (let i = 0; i < 2; i++) {
    out = out.replace(/(^|\s)(te|eu|esse|essa|este|esta) (?=\S)/gi, (_m, pre: string, w: string) => `${pre}${w}${NBSP}`);
  }
  out = out.replace(/(\s)— /g, `$1—${NBSP}`);
  // Separador “·” preso à palavra anterior (nunca abre linha).
  out = out.replace(/ ·(?=\s)/g, `${NBSP}·`);
  if (options.orphan !== false) {
    const m = out.match(/ (\S+)$/);
    if (m && m[1].length <= 18) out = out.slice(0, m.index) + NBSP + m[1];
  }
  return out;
}

export { typesetLabel };

/**
 * Número que conta de 0 até o valor oficial uma vez, quando entra na tela (pedido do Nil).
 * - `value` no formato pt-BR do conteúdo ("550", "5", "99,4"); as casas decimais vêm do próprio valor.
 * - O valor final é o estado inicial do HTML: sem JS, com reduced motion ou antes de entrar na tela
 *   o número certo já está lá. O leitor de tela lê só o valor final (a contagem é aria-hidden).
 * - Algarismos tabulares para a largura não "pular" durante a contagem.
 */
export function CountUp({ value, duration = 1600, className }: { value: string; duration?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState(value);
  const decimals = value.includes(',') ? value.split(',')[1].length : 0;
  const target = Number(value.replace(/\./g, '').replace(',', '.'));

  useEffect(() => {
    const el = ref.current;
    if (!el || !Number.isFinite(target) || !motionAllowed()) return;
    const fmt = (n: number) => n.toLocaleString('pt-BR', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
    let raf = 0;
    let started = false;
    // Fora da tela: já começa em 0 (sem mostrar o final e depois zerar). Já visível na carga: fica no final.
    const r = el.getBoundingClientRect();
    if (r.top >= window.innerHeight || r.bottom <= 0) setShown(fmt(0));
    else return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting || started) return;
        started = true;
        io.disconnect();
        const t0 = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - t0) / duration);
          const eased = 1 - Math.pow(1 - t, 3); // desacelera ao chegar no número oficial
          setShown(t < 1 ? fmt(target * eased) : value);
          if (t < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value, target, decimals, duration]);

  return (
    <span ref={ref} className={className} style={{ fontVariantNumeric: 'tabular-nums' }}>
      <span className="visually-hidden">{value}</span>
      <span aria-hidden="true">{shown}</span>
    </span>
  );
}

/** Breakpoint do celular para os padrões compactos (acordeão, abas, recolher texto). */
export const MOBILE_QUERY = '(max-width: 767px)';

/** Estado de uma media query, atualizado ao girar/redimensionar. */
export function useMediaQuery(query: string): boolean {
  const get = () => typeof window !== 'undefined' && typeof window.matchMedia === 'function' && window.matchMedia(query).matches;
  const [matches, setMatches] = useState(get);
  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return;
    const mq = window.matchMedia(query);
    const on = () => setMatches(mq.matches);
    on();
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, [query]);
  return matches;
}
