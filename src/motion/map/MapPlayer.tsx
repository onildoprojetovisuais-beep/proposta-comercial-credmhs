/**
 * Player Remotion do mapa — carregado sob demanda por BrazilMap (import dinâmico; fora do
 * bundle inicial). Sem controles nativos, sem loop, sem clique/teclado no vídeo, sem eventos
 * de ponteiro: os controles são botões HTML de BrazilMap e a rolagem nunca é capturada.
 */
import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { Player, type PlayerRef } from '@remotion/player';
import { MapScene } from './MapScene';
import { MAP_DURATION, MAP_FPS, MAP_HEIGHT, MAP_WIDTH } from './timing';

export interface MapPlayerProps {
  displayWidth: number;
  onFrame: (frame: number) => void;
  onEnded: () => void;
  onReady: () => void;
}

export type MapPlayerHandle = Pick<PlayerRef, 'play' | 'pause' | 'seekTo' | 'isPlaying'>;

const MapPlayer = forwardRef<MapPlayerHandle, MapPlayerProps>(function MapPlayer(
  { displayWidth, onFrame, onEnded, onReady },
  ref,
) {
  const player = useRef<PlayerRef>(null);
  const callbacks = useRef({ onFrame, onEnded, onReady });
  callbacks.current = { onFrame, onEnded, onReady };

  useImperativeHandle(ref, () => ({
    play: () => player.current?.play(),
    pause: () => player.current?.pause(),
    seekTo: (f: number) => player.current?.seekTo(f),
    isPlaying: () => player.current?.isPlaying() ?? false,
  }));

  useEffect(() => {
    const p = player.current;
    if (!p) return;
    const frame = (e: { detail: { frame: number } }) => callbacks.current.onFrame(e.detail.frame);
    const ended = () => callbacks.current.onEnded();
    p.addEventListener('frameupdate', frame);
    p.addEventListener('seeked', frame);
    p.addEventListener('ended', ended);
    callbacks.current.onReady();
    return () => {
      p.removeEventListener('frameupdate', frame);
      p.removeEventListener('seeked', frame);
      p.removeEventListener('ended', ended);
    };
  }, []);

  return (
    <Player
      ref={player}
      component={MapScene}
      inputProps={{ displayWidth }}
      durationInFrames={MAP_DURATION}
      fps={MAP_FPS}
      compositionWidth={MAP_WIDTH}
      compositionHeight={MAP_HEIGHT}
      controls={false}
      loop={false}
      autoPlay={false}
      moveToBeginningWhenEnded={false}
      clickToPlay={false}
      doubleClickToFullscreen={false}
      spaceKeyToPlayOrPause={false}
      allowFullscreen={false}
      numberOfSharedAudioTags={0}
      overflowVisible
      acknowledgeRemotionLicense
      style={{ width: '100%', height: '100%', background: 'transparent', pointerEvents: 'none' }}
    />
  );
});

export default MapPlayer;
