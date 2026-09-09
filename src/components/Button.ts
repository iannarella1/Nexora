import { h } from '@/utils/dom';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

export interface ButtonProps {
  label: string;
  variant?: ButtonVariant;
  onClick?: (e: Event) => void;
  block?: boolean;
  icon?: HTMLElement | SVGElement;
  disabled?: boolean;
  type?: 'button' | 'submit';
}

export function Button({
  label,
  variant = 'primary',
  onClick,
  block,
  icon,
  disabled,
  type = 'button',
}: ButtonProps): HTMLButtonElement {
  const classes = ['btn', `btn-${variant}`, block ? 'btn-block' : ''].filter(Boolean).join(' ');
  const btn = h('button', {
    class: classes,
    type,
    disabled: disabled ? true : undefined,
    onclick: disabled ? undefined : onClick,
  }, [icon ?? null, label]);
  return btn;
}
