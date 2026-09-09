import type { Scenario } from '@/types/scenario';
import { h } from '@/utils/dom';
import { icon } from '@/components/Icon';
import { formatPercent } from '@/utils/formatters';

const REASONS = [
  'Reduz custos operacionais',
  'Melhora a distribuição dos funcionários',
  'Reduz períodos de ociosidade',
  'Mantém o atendimento dentro do limite definido',
  'Aumenta a produtividade estimada',
];

export function AIRecommendation(scenario: Scenario): HTMLElement {
  return h('div', { class: 'card', style: 'border-color: rgba(47,224,216,0.35);' }, [
    h('div', { class: 'flex items-center gap-10', style: 'color: var(--accent-cyan); margin-bottom: 14px;' }, [
      icon('sparkle', 18),
      h('span', { style: 'font-weight: 700; font-size: 13.5px; letter-spacing: 0.01em;' }, [
        'Recomendação NEXORA AI',
      ]),
    ]),
    h('p', { style: 'font-size: 15.5px; line-height: 1.6; color: var(--text-primary); max-width: 560px;' }, [
      'O cenário recomendado apresenta o melhor equilíbrio entre redução de custos e aumento de produtividade dentro das restrições definidas.',
    ]),
    h('div', { class: 'grid grid-stats', style: 'margin-top: 20px;' }, [
      miniStat('Custo', formatPercent(-scenario.costReduction)),
      miniStat('Produtividade', formatPercent(scenario.productivityGain)),
      miniStat('Tempo de espera', formatPercent(-scenario.waitReduction)),
      miniStat('Funcionários', String(scenario.employees)),
    ]),
    h('div', { style: 'margin-top: 22px;' }, [
      h('p', { class: 'field-label', style: 'margin-bottom: 10px;' }, ['Por que essa opção foi escolhida?']),
      h(
        'div',
        { class: 'check-list' },
        REASONS.map((reason) =>
          h('div', { class: 'check-item' }, [
            h('span', { class: 'check-icon' }, [icon('check', 12)]),
            reason,
          ])
        )
      ),
    ]),
    h('div', { class: 'flex items-center gap-10', style: 'margin-top: 20px;' }, [
      h('span', { class: 'badge badge-cyan' }, [`Confiança estimada: 92%`]),
    ]),
    h('p', { class: 'text-muted', style: 'margin-top: 16px; font-size: 12.5px; line-height: 1.6;' }, [
      'Os valores apresentados são estimativas fictícias produzidas pelo modelo de demonstração.',
    ]),
  ]);
}

function miniStat(label: string, value: string): HTMLElement {
  return h('div', {}, [
    h('div', { class: 'stat-label' }, [label]),
    h('div', { class: 'stat-value', style: 'font-size: 20px; margin-top: 6px;' }, [value]),
  ]);
}
