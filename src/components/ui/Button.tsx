import { forwardRef } from 'react';
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode, Ref } from 'react';
import styles from './Button.module.css';

export type ButtonVariant = 'primary' | 'secondary' | 'link' | 'ghost-dark' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface CommonProps {
  /**
   * Regra por FUNÇÃO (layout v2):
   * - primary: a ação principal do capítulo — no máximo UMA por seção (lg na abertura/contato; md nas demais).
   * - secondary: continuar/alternativa em fundo claro ou amarelo (no amarelo, primary vira branco).
   * - ghost-dark: o mesmo papel de secondary sobre fundo escuro.
   * - link: ação textual / revelar detalhe inline (com IconChevron) / atalho de saída (com IconArrow).
   * - danger: confirmação de ação destrutiva. Sem uso na apresentação V2 (diálogos retirados);
   *   mantido para o painel/futuras confirmações.
   */
  variant?: ButtonVariant;
  /** Altura/padding proporcionais ao rótulo. `md` padrão (≥44px de toque). */
  size?: ButtonSize;
  /** Ícone opcional depois do rótulo (decorativo, aria-hidden). */
  iconAfter?: ReactNode;
  /** Ícone opcional antes do rótulo (decorativo). */
  iconBefore?: ReactNode;
  /** Ocupa a largura do container. Use só quando a composição pedir (padrão: largura do rótulo). */
  block?: boolean;
  children: ReactNode;
}

type ButtonAsButton = CommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof CommonProps> & { href?: undefined };
type ButtonAsLink = CommonProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof CommonProps> & { href: string };

/** Button — renderiza <a> quando recebe `href`, senão <button type="button">. */
export type ButtonProps = ButtonAsButton | ButtonAsLink;

export const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(function Button(
  props,
  ref,
) {
  const { variant = 'primary', size = 'md', iconAfter, iconBefore, block, className, children, ...rest } = props;
  const cls = [styles.button, styles[variant], styles[size], block ? styles.block : '', className ?? '']
    .filter(Boolean)
    .join(' ');
  const content = (
    <>
      {iconBefore ? <span className={styles.icon} aria-hidden="true">{iconBefore}</span> : null}
      <span className={styles.label}>{children}</span>
      {iconAfter ? <span className={styles.icon} aria-hidden="true">{iconAfter}</span> : null}
    </>
  );

  if (typeof (rest as ButtonAsLink).href === 'string') {
    return (
      <a ref={ref as Ref<HTMLAnchorElement>} className={cls} {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {content}
      </a>
    );
  }
  const { type, ...buttonRest } = rest as ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button ref={ref as Ref<HTMLButtonElement>} type={type ?? 'button'} className={cls} {...buttonRest}>
      {content}
    </button>
  );
});
