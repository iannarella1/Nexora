import { h } from '@/utils/dom';
import { icon } from '@/components/Icon';
import { Button } from '@/components/Button';
import { GOVERNANCE_ITEMS, SECURITY_ITEMS } from '@/data/mockData';
import { logout } from '@/services/appState';
import { navigate } from '@/router';

export function SettingsPage(): HTMLElement {
  return h('div', {}, [
    h('div', { class: 'page-header' }, [
      h('div', {}, [
        h('h1', { class: 'page-title' }, ['Configurações']),
        h('p', { class: 'page-subtitle' }, ['Governança da IA e segurança da plataforma']),
      ]),
    ]),

    h('div', { class: 'grid grid-2' }, [
      h('div', { class: 'card' }, [
        h('div', { class: 'flex items-center gap-10', style: 'color: var(--accent-purple);' }, [
          icon('shield', 16),
          h('span', { style: 'font-weight: 700; font-size: 13.5px;' }, ['Governança da IA']),
        ]),
        h('div', { style: 'margin-top: 16px;' }, [
          h('div', { class: 'stat-label' }, ['Nível de autonomia']),
          h('div', { class: 'stat-value', style: 'font-size: 20px; margin-top: 6px;' }, ['Assistido por humano']),
        ]),
        h('p', { class: 'text-secondary', style: 'margin-top: 14px; font-size: 14px; line-height: 1.7;' }, [
          'A IA pode analisar dados e recomendar decisões, mas nenhuma alteração operacional é executada sem aprovação humana.',
        ]),
        h(
          'div',
          { class: 'check-list', style: 'margin-top: 18px;' },
          GOVERNANCE_ITEMS.map((item) =>
            h('div', { class: 'check-item' }, [h('span', { class: 'check-icon' }, [icon('check', 12)]), item])
          )
        ),
      ]),

      h('div', { class: 'card' }, [
        h('div', { class: 'flex items-center justify-between' }, [
          h('div', { class: 'flex items-center gap-10', style: 'color: var(--accent-cyan);' }, [
            icon('shield', 16),
            h('span', { style: 'font-weight: 700; font-size: 13.5px;' }, ['Segurança']),
          ]),
          h('span', { class: 'badge badge-green' }, [h('span', { class: 'sidebar-dot' }), 'Sistema protegido']),
        ]),
        h(
          'div',
          { class: 'check-list', style: 'margin-top: 18px;' },
          SECURITY_ITEMS.map((item) =>
            h('div', { class: 'check-item' }, [h('span', { class: 'check-icon' }, [icon('check', 12)]), item])
          )
        ),
      ]),
    ]),

    h('div', { class: 'card' }, [
      h('p', { class: 'field-label', style: 'margin-bottom: 6px;' }, ['Sessão']),
      h('p', { class: 'text-muted', style: 'font-size: 13px; margin-bottom: 16px;' }, [
        'Você está em uma sessão de demonstração com dados fictícios.',
      ]),
      Button({
        label: 'Sair da demonstração',
        variant: 'secondary',
        onClick: () => {
          logout();
          navigate('/login');
        },
      }),
    ]),

    h('div', { class: 'academic-footer' }, [
      icon('shield', 14),
      ' A NEXORA é uma proposta acadêmica de apoio à tomada de decisão utilizando gêmeos digitais, simulação e inteligência artificial explicável.',
    ]),
  ]);
}
