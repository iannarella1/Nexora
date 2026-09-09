import { h } from '@/utils/dom';
import { icon } from '@/components/Icon';
import { COMPANY_NAME, ENVIRONMENT_AREAS, BASE_ENVIRONMENT } from '@/data/mockData';
import { formatCurrencyBRL, formatMinutes, formatNumber } from '@/utils/formatters';

export function EnvironmentPage(): HTMLElement {
  return h('div', {}, [
    h('div', { class: 'page-header' }, [
      h('div', {}, [
        h('h1', { class: 'page-title' }, ['Meu Ambiente Digital']),
        h('p', { class: 'page-subtitle' }, [`${COMPANY_NAME} · representação conceitual do ambiente físico`]),
      ]),
      h('span', { class: 'badge badge-green' }, [h('span', { class: 'sidebar-dot' }), 'Gêmeo digital sincronizado']),
    ]),

    h('div', { class: 'grid grid-2' }, [
      h('div', { class: 'card' }, [
        h('h3', { style: 'font-size: 15px; font-weight: 600; margin-bottom: 4px;' }, ['Planta do ambiente']),
        h('p', { class: 'text-muted', style: 'font-size: 12.5px; margin-bottom: 18px;' }, [
          'Cada bloco representa uma área monitorada pelo gêmeo digital, com sua ocupação estimada.',
        ]),
        h(
          'div',
          { class: 'env-map' },
          ENVIRONMENT_AREAS.map((area) =>
            h('div', { class: 'env-area' }, [
              h('div', { class: 'env-area-name' }, [area.name]),
              h('div', { class: 'env-area-meta' }, [`${area.employees} funcionários alocados`]),
              h('div', { class: 'env-area-bar' }, [
                h('div', { class: 'env-area-bar-fill', style: `width: ${area.occupancy}%;` }),
              ]),
              h('div', { class: 'env-area-meta', style: 'margin-top: 6px;' }, [`Ocupação: ${area.occupancy}%`]),
            ])
          )
        ),
      ]),

      h('div', { class: 'card' }, [
        h('h3', { style: 'font-size: 15px; font-weight: 600; margin-bottom: 16px;' }, ['Indicadores atuais']),
        infoRow('Funcionários', formatNumber(BASE_ENVIRONMENT.employees)),
        infoRow('Demanda diária', formatNumber(BASE_ENVIRONMENT.dailyDemand)),
        infoRow('Tempo médio', formatMinutes(BASE_ENVIRONMENT.avgWaitTime)),
        infoRow('Custo diário', formatCurrencyBRL(BASE_ENVIRONMENT.dailyCost)),
        infoRow('Produtividade', `${BASE_ENVIRONMENT.productivity}%`),
        h('div', { class: 'flex items-center gap-10', style: 'margin-top: 18px; color: var(--accent-green); font-size: 13px; font-weight: 600;' }, [
          icon('check', 15),
          'Gêmeo digital sincronizado',
        ]),
      ]),
    ]),

    h('div', { class: 'academic-footer' }, [
      icon('shield', 14),
      ' Esta é uma representação conceitual para fins acadêmicos — não existe integração real com sensores, câmeras ou sistemas de ',
      COMPANY_NAME,
      '.',
    ]),
  ]);
}

function infoRow(label: string, value: string): HTMLElement {
  return h('div', { class: 'flex items-center justify-between', style: 'padding: 10px 0; border-bottom: 1px solid var(--border-subtle);' }, [
    h('span', { class: 'text-secondary', style: 'font-size: 13.5px;' }, [label]),
    h('span', { style: 'font-weight: 600; font-size: 14px;' }, [value]),
  ]);
}
