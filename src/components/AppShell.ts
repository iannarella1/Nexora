import { h } from '@/utils/dom';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';

export function AppShell(title: string, content: HTMLElement): HTMLElement {
  const scrim = h('div', { class: 'sidebar-scrim' });

  const closeMenu = () => {
    sidebar.classList.remove('open');
    scrim.classList.remove('open');
  };

  const sidebar = Sidebar(closeMenu);

  scrim.addEventListener('click', closeMenu);

  const toggleMenu = () => {
    sidebar.classList.toggle('open');
    scrim.classList.toggle('open');
  };

  const main = h('div', { class: 'app-main' }, [
    Header(title, toggleMenu),
    h('div', { class: 'app-content' }, [content]),
  ]);

  return h('div', { class: 'app-shell' }, [sidebar, scrim, main]);
}
