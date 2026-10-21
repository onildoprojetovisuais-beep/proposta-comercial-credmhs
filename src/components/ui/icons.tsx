import type { ReactNode, SVGProps } from 'react';

/**
 * Ícones de função (layout v2). UM desenho por função — não trocar entre si:
 * - IconPlus / IconCheck → sem uso na apresentação V2 (pauta retirada); mantidos para o painel/futuro.
 * - IconChevron → EXPANDIR/RECOLHER (`open` gira 180°) ou abrir detalhe (`direction="right"`).
 * - IconArrow   → navegar para outro capítulo (↓) ou sair (→).
 * Traço 2.5 em viewBox 24, `currentColor`, decorativos (aria-hidden). Tamanho = 1em por padrão.
 */
type IconProps = Omit<SVGProps<SVGSVGElement>, 'children'>;

function Svg({ width = '1em', height = '1em', ...rest }: IconProps & { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={width}
      height={height}
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    />
  );
}

export function IconPlus(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M12 5v14M5 12h14" />
    </Svg>
  );
}

export function IconCheck(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </Svg>
  );
}

export interface IconChevronProps extends IconProps {
  /** Para expandir/recolher: true gira para cima. */
  open?: boolean;
  /** 'down' (padrão, disclosure) | 'right' (abrir detalhe lateral). */
  direction?: 'down' | 'right';
}

export function IconChevron({ open, direction = 'down', style, ...props }: IconChevronProps) {
  const base = direction === 'right' ? -90 : 0;
  // Sem `open` nem direção lateral, não fixa transform inline (o CSS do pai pode girar o ícone).
  const rotation = open === undefined && base === 0 ? undefined : `rotate(${base + (open ? 180 : 0)}deg)`;
  return (
    <Svg
      {...props}
      style={{
        transform: rotation,
        transition: 'transform var(--dur-base) var(--ease-out)',
        ...style,
      }}
    >
      <path d="M6 9.5l6 6 6-6" />
    </Svg>
  );
}

export function IconArrow({ direction = 'down', ...props }: IconProps & { direction?: 'down' | 'right' }) {
  return (
    <Svg {...props}>
      {direction === 'down' ? <path d="M12 5v14M6 13l6 6 6-6" /> : <path d="M5 12h14M13 6l6 6-6 6" />}
    </Svg>
  );
}

/* Canais de contato (slide 11): envelope → e-mail, globo → site. Mesmo traço dos ícones de função. */
export function IconMail(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="3" y="5.5" width="18" height="13" rx="1.5" />
      <path d="M3.5 6.5l8.5 6.5 8.5-6.5" />
    </Svg>
  );
}

export function IconGlobe(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.6 3.75 5.6 3.75 9S14.5 18.4 12 21c-2.5-2.6-3.75-5.6-3.75-9S9.5 5.6 12 3z" />
    </Svg>
  );
}

/* Marcas (preenchidas, desenho oficial simplificado): WhatsApp → telefone, LinkedIn → perfil. */
export function IconWhatsApp(props: IconProps) {
  return (
    <Svg {...props} fill="currentColor" stroke="none">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm0 18.15h-.01a8.23 8.23 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.23 8.23zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.25-.64.81-.78.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.22.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.14-1.18-.06-.1-.22-.16-.47-.28z" />
    </Svg>
  );
}

export function IconLinkedIn(props: IconProps) {
  return (
    <Svg {...props} fill="currentColor" stroke="none">
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
    </Svg>
  );
}
