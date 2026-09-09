import type { Scenario } from '@/types/scenario';
import { h } from '@/utils/dom';
import { formatPercent } from '@/utils/formatters';

function ratingBadgeClass(rating: Scenario['rating']): string {
  switch (rating) {
    case 'RECOMENDADO':
      return 'badge badge-cyan';
    case 'Excelente':
      return 'badge badge-green';
    case 'Muito boa':
      return 'badge badge-purple';
    default:
      return 'badge badge-muted';
  }
}

export function ScenarioTable(scenarios: Scenario[]): HTMLElement {
  const rows = scenarios.map((s) =>
    h('tr', { class: s.recommended ? 'row-recommended' : '' }, [
      h('td', {}, [s.name]),
      h('td', { class: 'value-positive' }, [formatPercent(-s.costReduction)]),
      h('td', { class: 'value-positive' }, [formatPercent(s.productivityGain)]),
      h('td', { class: 'value-positive' }, [formatPercent(-s.waitReduction)]),
      h('td', {}, [String(s.employees)]),
      h('td', {}, [h('span', { class: ratingBadgeClass(s.rating) }, [s.rating])]),
    ])
  );

  return h('div', { class: 'table-wrap' }, [
    h('table', {}, [
      h('thead', {}, [
        h('tr', {}, [
          h('th', {}, ['Cenário']),
          h('th', {}, ['Custo']),
          h('th', {}, ['Produtividade']),
          h('th', {}, ['Espera']),
          h('th', {}, ['Funcionários']),
          h('th', {}, ['Avaliação']),
        ]),
      ]),
      h('tbody', {}, rows),
    ]),
  ]);
}
