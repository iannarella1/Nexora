import { h } from '@/utils/dom';
import { icon } from '@/components/Icon';
import { getState } from '@/services/appState';

export function Header(title: string, onMenuToggle: () => void): HTMLElement {
  const initials = getState().userName.slice(0, 2).toUpperCase();

  return h('header', { class: 'topbar' }, [
    h('div', { class: 'flex items-center gap-10' }, [
      h('button', { class: 'topbar-menu-btn', onclick: onMenuToggle, 'aria-label': 'Abrir menu' }, [
        icon('menu', 18),
      ]),
      h('span', { class: 'topbar-title' }, [title]),
    ]),
    h('div', { class: 'topbar-right' }, [
      h('span', { class: 'topbar-badge' }, [icon('shield', 14), 'Ambiente simulado']),
      h('div', { class: 'topbar-avatar' }, [initials]),
    ]),
  ]);
}
