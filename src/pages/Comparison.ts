import { h } from '@/utils/dom';
import { Button } from '@/components/Button';
import { icon } from '@/components/Icon';
import { RadarChart } from '@/components/Chart';
import { navigate } from '@/router';
import { getState, setSimulationResult } from '@/services/appState';
import { runSimulation } from '@/services/simulationService';
import { BASE_ENVIRONMENT } from '@/data/mockData';
import { formatCurrencyBRL, formatMinutes, formatNumber, formatPercent } from '@/utils/formatters';

function ensureSimulation() {
  if (!getState().lastSimulation) {
    setSimulationResult(runSimulation(getState().draftParams));
  }
  return getState().lastSimulation!;
}

export function ComparisonPage(): HTMLElement {
  const sim = ensureSimulation();
  const rec = sim.recommended;

  const currentCost = BASE_ENVIRONMENT.dailyCost;
  const newCost = currentCost * (1 - rec.costReduction / 100);
  const currentWait = BASE_ENVIRONMENT.avgWaitTime;
  const newWait = currentWait * (1 - rec.waitReduction / 100);
  const currentProd = BASE_ENVIRONMENT.productivity;
  const newProd = currentProd * (1 + rec.productivityGain / 100);

  const radarAxes = [
    { label: 'Custo (eficiência)', a: 55, b: 55 + rec.costReduction * 1.1 },
    { label: 'Produtividade', a: currentProd, b: Math.min(100, newProd) },
    { label: 'Tempo de espera (eficiência)', a: 55, b: 55 + rec.waitReduction * 1.1 },
    { label: 'Recursos', a: 50, b: 50 + rec.consumptionReduction * 1.2 },
    { label: 'Risco (inverso)', a: 80, b: Math.max(10, 80 - rec.risk * 1.4) },
  ];

  return h('div', {}, [
    h('div', { class: 'page-header' }, [
      h('div', {}, [
        h('h1', { class: 'page-title' }, ['Comparação de cenários']),
        h('p', { class: 'page-subtitle' }, ['Situação atual vs. cenário recomendado']),
      ]),
    ]),

    h('div', { class: 'grid grid-2' }, [
      h('div', { class: 'card' }, [
        h('div', { class: 'flex items-center justify-between', style: 'margin-bottom: 16px;' }, [
          h('span', { class: 'badge badge-muted' }, ['Situação atual']),
          h('span', { class: 'badge badge-cyan' }, [rec.name + ' · recomendado']),
        ]),
        compareRow('Custo diário', formatCurrencyBRL(currentCost), formatCurrencyBRL(newCost)),
        compareRow('Produtividade', `${currentProd}%`, `${newProd.toFixed(1)}%`),
        compareRow('Tempo de espera', formatMinutes(currentWait), formatMinutes(newWait)),
        compareRow('Funcionários', formatNumber(BASE_ENVIRONMENT.employees), formatNumber(rec.employees)),
        compareRow('Consumo de recursos', 'Base', formatPercent(-rec.consumptionReduction)),
        compareRow('Risco operacional', 'Baixo', `${rec.risk.toFixed(1)}%`),
      ]),

      h('div', { class: 'card' }, [
        h('p', { class: 'field-label', style: 'margin-bottom: 12px; text-align: center;' }, ['Visão geral (radar)']),
        RadarChart(radarAxes),
        h('div', { class: 'flex items-center gap-10', style: 'justify-content: center; margin-top: 10px;' }, [
          legendDot('var(--accent-purple)', 'Situação atual'),
          legendDot('var(--accent-cyan)', 'Cenário recomendado'),
        ]),
      ]),
    ]),

    h('div', { class: 'card' }, [
      h('p', { class: 'field-label', style: 'margin-bottom: 10px;' }, ['O que muda entre os dois cenários?']),
      h('p', { class: 'text-secondary', style: 'font-size: 14px; line-height: 1.7;' }, [
        `O cenário recomendado ajusta a distribuição de ${BASE_ENVIRONMENT.employees} para ${rec.employees} funcionários dentro da nova configuração de horário, o que reduz o custo diário em ${formatPercent(-rec.costReduction)} e o tempo médio de espera em ${formatPercent(-rec.waitReduction)}, enquanto eleva a produtividade estimada em ${formatPercent(rec.productivityGain)}. O risco operacional estimado é de ${rec.risk.toFixed(1)}%, considerado aceitável dentro dos limites definidos para o objetivo escolhido.`,
      ]),
    ]),

    h('div', { class: 'flex', style: 'justify-content: flex-end; gap: 10px;' }, [
      Button({ label: 'Voltar aos resultados', variant: 'ghost', onClick: () => navigate('/cenarios/resultados') }),
      Button({
        label: 'Avançar para aprovação',
        variant: 'primary',
        icon: icon('arrowRight', 15),
        onClick: () => navigate('/cenarios/aprovacao'),
      }),
    ]),
  ]);
}

function compareRow(label: string, left: string, right: string): HTMLElement {
  return h('div', { class: 'compare-row' }, [
    h('span', { class: 'compare-value left' }, [left]),
    h('span', { class: 'compare-label' }, [label]),
    h('span', { class: 'compare-value right' }, [right]),
  ]);
}

function legendDot(color: string, label: string): HTMLElement {
  return h('span', { class: 'flex items-center gap-10', style: 'font-size: 12px; color: var(--text-muted);' }, [
    h('span', { style: `width:9px;height:9px;border-radius:50%;background:${color};display:inline-block;` }),
    label,
  ]);
}
