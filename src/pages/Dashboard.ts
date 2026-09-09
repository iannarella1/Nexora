import { h } from '@/utils/dom';
import { StatCard } from '@/components/StatCard';
import { Button } from '@/components/Button';
import { icon } from '@/components/Icon';
import { LineChart } from '@/components/Chart';
import { navigate } from '@/router';
import { getState } from '@/services/appState';
import {
  DASHBOARD_STATS,
  COST_TREND,
  PRODUCTIVITY_TREND,
  WAIT_TIME_TREND,
  AI_LAST_ANALYSIS,
} from '@/data/mockData';
import { formatCurrencyBRL, formatMinutes, formatNumber } from '@/utils/formatters';

export function DashboardPage(): HTMLElement {
  const userName = getState().userName;

  return h('div', {}, [
    h('div', { class: 'page-header' }, [
      h('div', {}, [
        h('h1', { class: 'page-title' }, [`Olá, ${userName}`]),
        h('p', { class: 'page-subtitle' }, ['Visão geral do seu ambiente digital']),
      ]),
      h('span', { class: 'page-tag' }, ['Protótipo conceitual · Dados simulados']),
    ]),

    h('div', { class: 'grid grid-stats' }, [
      StatCard({
        label: 'Custo operacional',
        value: formatCurrencyBRL(DASHBOARD_STATS.operationalCost),
        delta: DASHBOARD_STATS.operationalCostDelta,
        invertDeltaColor: true,
      }),
      StatCard({
        label: 'Produtividade',
        value: `${DASHBOARD_STATS.productivity}%`,
        delta: DASHBOARD_STATS.productivityDelta,
      }),
      StatCard({
        label: 'Tempo médio de espera',
        value: formatMinutes(DASHBOARD_STATS.avgWaitTime),
        delta: DASHBOARD_STATS.avgWaitTimeDelta,
        invertDeltaColor: true,
      }),
      StatCard({
        label: 'Funcionários ativos',
        value: formatNumber(DASHBOARD_STATS.activeEmployees),
      }),
    ]),

    h('div', { class: 'grid grid-2', style: 'margin-top: 20px;' }, [
      h('div', { class: 'card' }, [
        h('h3', { style: 'font-size: 15px; font-weight: 600;' }, ['Evolução dos indicadores']),
        h('p', { class: 'text-muted', style: 'font-size: 12.5px; margin-top: 4px;' }, [
          'Últimas 7 leituras do gêmeo digital',
        ]),
        h('div', { class: 'grid grid-3', style: 'margin-top: 18px; gap: 14px;' }, [
          trendBlock('Custo (R$ mil)', COST_TREND.map((v) => v / 1000), 'var(--accent-blue)'),
          trendBlock('Produtividade (%)', PRODUCTIVITY_TREND, 'var(--accent-purple)'),
          trendBlock('Espera (min)', WAIT_TIME_TREND, 'var(--accent-cyan)'),
        ]),
      ]),

      h('div', { class: 'card' }, [
        h('div', { class: 'flex items-center gap-10', style: 'color: var(--accent-cyan);' }, [
          icon('sparkle', 16),
          h('span', { style: 'font-weight: 700; font-size: 13px;' }, ['Última análise da IA']),
        ]),
        h('p', { style: 'margin-top: 12px; font-size: 14.5px; line-height: 1.6; color: var(--text-primary);' }, [
          AI_LAST_ANALYSIS,
        ]),
        h('div', { style: 'margin-top: 18px;' }, [
          Button({
            label: 'Ver análise',
            variant: 'secondary',
            icon: icon('arrowRight', 15),
            onClick: () => navigate('/cenarios/resultados'),
          }),
        ]),
      ]),
    ]),

    h('div', { class: 'academic-footer' }, [
      h('span', { class: 'badge badge-purple', style: 'margin-right: 8px;' }, ['ODS 8 · Trabalho Decente e Crescimento Econômico']),
      h('p', { style: 'margin-top: 10px;' }, [
        'A NEXORA é uma proposta acadêmica de apoio à tomada de decisão utilizando gêmeos digitais, simulação e inteligência artificial explicável. A proposta busca apoiar uma distribuição mais eficiente de recursos e jornadas, reduzindo sobrecarga, ociosidade e desperdícios.',
      ]),
    ]),
  ]);
}

function trendBlock(label: string, data: number[], color: string): HTMLElement {
  return h('div', {}, [
    h('p', { class: 'text-muted', style: 'font-size: 12px; margin-bottom: 6px;' }, [label]),
    LineChart(data, { color, height: 70 }),
  ]);
}
