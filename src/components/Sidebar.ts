import { h } from '@/utils/dom';
import { icon } from '@/components/Icon';
import { navigate, currentPath } from '@/router';

const NAV_ITEMS: { label: string; path: string; icon: Parameters<typeof icon>[0]; group: string[] }[] = [
  { label: 'Dashboard', path: '/dashboard', icon: 'dashboard', group: ['/dashboard'] },
  { label: 'Meu ambiente', path: '/ambiente', icon: 'building', group: ['/ambiente'] },
  { label: 'Simulações', path: '/simulacao/nova', icon: 'flask', group: ['/simulacao/nova', '/simulacao/processando'] },
  {
    label: 'Cenários',
    path: '/cenarios/resultados',
    icon: 'layers',
    group: ['/cenarios/resultados', '/cenarios/recomendacao', '/cenarios/comparacao', '/cenarios/aprovacao'],
  },
  { label: 'Relatórios', path: '/relatorios', icon: 'file', group: ['/relatorios'] },
  { label: 'Configurações', path: '/configuracoes', icon: 'settings', group: ['/configuracoes'] },
];

export function Sidebar(onNavigate?: () => void): HTMLElement {
  const active = currentPath();

  const links = NAV_ITEMS.map((item) => {
    const isActive = item.group.some((p) => active.startsWith(p));
    return h(
      'a',
      {
        class: `sidebar-link${isActive ? ' active' : ''}`,
        onclick: (e: Event) => {
          e.preventDefault();
          navigate(item.path);
          onNavigate?.();
        },
      },
      [icon(item.icon, 18), item.label]
    );
  });

  return h('aside', { class: 'sidebar', id: 'sidebar' }, [
    h('div', { class: 'sidebar-brand' }, [
      h('div', { class: 'sidebar-brand-mark' }, ['N']),
      h('span', { class: 'sidebar-brand-name' }, ['NEXORA']),
    ]),
    h('nav', { class: 'sidebar-nav' }, links),
    h('div', { class: 'sidebar-footer' }, [
      h('div', { class: 'sidebar-ai-chip' }, [h('span', { class: 'sidebar-dot' }), 'IA assistida']),
      h('p', { class: 'sidebar-ai-note' }, ['A IA recomenda. A decisão continua humana.']),
    ]),
  ]);
}
