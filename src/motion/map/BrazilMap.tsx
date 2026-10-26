/**
 * Mapa do Brasil da seção Alcance (slide 5). Contrato: docs/V3-CONTRATO.md → “Mapa”.
 *
 * - Animado: o player Remotion (MapPlayer) é importado sob demanda quando a seção se aproxima
 *   e toca UMA vez quando o mapa entra na tela. Não repete sozinho. Sai da tela → pausa;
 *   volta → continua de onde parou (se o visitante não tiver pausado). Terminado, fica parado
 *   no último quadro (mapa completo), sem controles. Botão HTML Pausar/Continuar só enquanto toca
 *   (rodada 23/10: “Repetir animação” retirado).
 * - prefers-reduced-motion (ou falha ao carregar o player): desenho estático completo, sem player
 *   (MapStatic, também sob demanda: a geometria não entra no bundle inicial).
 * - Antes de tocar: espaço vazio com a mesma proporção (o quadro 0 também é vazio; sem salto).
 * - O rótulo “Rio de Janeiro - Barra e Centro” (rodada 21/10) é HTML sobre o mapa, posicionado
 *   pelo ponto do RJ. É a ÚNICA identificação do Rio na seção. Uma linha; no mapa estreito,
 *   quebra depois do hífen (nunca antes).
 * - Sem captura de ponteiro nem de rolagem; o player tem pointer-events: none.
 */
import { Component, Suspense, lazy, useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { copy } from '../../content/chapters';
import type { MapPlayerHandle } from './MapPlayer';
import { MAP_HEIGHT, MAP_WIDTH, RJ_PERCENT, T } from './timing';
import styles from './BrazilMap.module.css';

const MapPlayer = lazy(() => import('./MapPlayer'));
const MapStatic = lazy(() => import('./MapStatic'));

const REDUCED_QUERY = '(prefers-reduced-motion: reduce)';

function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && typeof window.matchMedia === 'function'
    ? window.matchMedia(REDUCED_QUERY).matches
    : false;
}

type Phase = 'idle' | 'playing' | 'paused' | 'ended';

export function BrazilMap(props: { className?: string }): JSX.Element {
  const t = copy.alcance.map;
  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<MapPlayerHandle>(null);

  const [reduced, setReduced] = useState(prefersReducedMotion);
  const [failed, setFailed] = useState(false);
  const [near, setNear] = useState(false);
  const [inView, setInView] = useState(false);
  const [ready, setReady] = useState(false);
  const [phase, setPhase] = useState<Phase>('idle');
  const [userPaused, setUserPaused] = useState(false);
  const [labelOn, setLabelOn] = useState(false);
  const [width, setWidth] = useState(0);

  const isStatic = reduced || failed;

  // Preferência de movimento (acompanha mudança em tempo real).
  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return;
    const mq = window.matchMedia(REDUCED_QUERY);
    const on = () => setReduced(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);

  // Largura exibida (espessura dos traços constante em px).
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const measure = () => setWidth(el.getBoundingClientRect().width);
    measure();
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Dois observadores: um carrega o player com antecedência; o outro decide tocar/pausar.
  useEffect(() => {
    const el = rootRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setNear(true);
      setInView(true);
      return;
    }
    const pre = new IntersectionObserver(([e]) => e.isIntersecting && setNear(true), { rootMargin: '600px 0px' });
    const vis = new IntersectionObserver(([e]) => setInView(e.isIntersecting && e.intersectionRatio >= 0.35), {
      threshold: [0, 0.35, 0.6],
    });
    pre.observe(el);
    vis.observe(el);
    return () => {
      pre.disconnect();
      vis.disconnect();
    };
  }, []);

  // Tocar uma vez ao entrar; pausar ao sair; continuar ao voltar (se não pausado pelo visitante).
  useEffect(() => {
    if (isStatic || !ready) return;
    const p = playerRef.current;
    if (!p) return;
    if (inView) {
      if (phase === 'idle' || (phase === 'paused' && !userPaused)) {
        p.play();
        setPhase('playing');
      }
    } else if (phase === 'playing') {
      p.pause();
      setPhase('paused');
    }
  }, [inView, ready, phase, userPaused, isStatic]);

  const onFrame = useCallback((f: number) => {
    const on = f >= T.labelFrame;
    setLabelOn((prev) => (prev === on ? prev : on));
  }, []);
  const onEnded = useCallback(() => {
    setPhase('ended');
    setLabelOn(true);
  }, []);
  const onReady = useCallback(() => setReady(true), []);

  const togglePause = () => {
    const p = playerRef.current;
    if (!p) return;
    if (phase === 'playing') {
      p.pause();
      setUserPaused(true);
      setPhase('paused');
    } else if (phase === 'paused') {
      setUserPaused(false);
      p.play();
      setPhase('playing');
    }
  };

  const showLabel = isStatic || labelOn;
  // “Rio de Janeiro - Barra e Centro”: uma linha; no mapa estreito quebra DEPOIS do hífen
  // (“Rio de Janeiro -” / “Barra e Centro”), nunca antes. Texto inalterado.
  const rioParts = t.rioLabel
    .split(/(?<= -) /)
    .map((part) => part.replace(/ /g, ' '));
  const showControls = !isStatic && ready && (phase === 'playing' || phase === 'paused');

  return (
    <div ref={rootRef} className={[styles.root, props.className].filter(Boolean).join(' ')}>
      <div
        ref={stageRef}
        className={styles.stage}
        style={{ aspectRatio: `${MAP_WIDTH} / ${MAP_HEIGHT}` }}
        role="img"
        aria-label={t.ariaLabel}
      >
        {!near ? null : isStatic ? (
          <Suspense fallback={null}>
            <MapStatic displayWidth={width || MAP_WIDTH} />
          </Suspense>
        ) : (
          <ErrorBoundary onError={() => setFailed(true)}>
            <Suspense fallback={null}>
              <div className={styles.player}>
                <MapPlayer
                  ref={playerRef}
                  displayWidth={width || MAP_WIDTH}
                  onFrame={onFrame}
                  onEnded={onEnded}
                  onReady={onReady}
                />
              </div>
            </Suspense>
          </ErrorBoundary>
        )}

        <p
          className={[styles.label, showLabel ? styles.labelOn : ''].join(' ')}
          style={{ top: `${RJ_PERCENT.top}%` }}
          aria-hidden="true"
        >
          {rioParts.map((part, i) => (
            <span key={part} className={styles.labelPart}>
              {i > 0 ? ' ' : null}
              {part}
            </span>
          ))}
        </p>
      </div>

      {/* Espaço reservado mesmo sem botão (antes de tocar e ao fim): o texto abaixo não salta. */}
      {!isStatic && (
        <div className={styles.controls}>
          {showControls && (
            <button type="button" className={styles.control} onClick={togglePause}>
              {phase === 'playing' ? t.pause : t.play}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

/** Falha ao baixar/rodar o player → versão estática (sem quebrar a seção). */
class ErrorBoundary extends Component<{ onError: () => void; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onError();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}
