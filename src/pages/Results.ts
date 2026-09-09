import { h } from '@/utils/dom';
import { Button } from '@/components/Button';
import { icon } from '@/components/Icon';
import { ScenarioTable } from '@/components/ScenarioTable';
import { AIRecommendation } from '@/components/AIRecommendation';
import { BarChart } from '@/components/Chart';
import { navigate } from '@/router';
import { getState, setSimulationResult } from '@/services/appState';
import { runSimulation } from '@/services/simulationService';
import { DEFAULT_WEIGHTS, getWeightsForObjective } from '@/utils/calculations';

function ensureSimulation() {
  if (!getState().lastSimulation) {
    setSimulationResult(runSimulation(getState().draftParams));
  }
  return getState().lastSimulation!;
}

export function ResultsPage(): HTMLElement {
  const sim = ensureSimulation();
  const { scenarios, recommended, params } = sim;
  const weights = getWeightsForObjective(params.objective);

  return h('div', {}, [
    h('div', { class: 'page-header' }, [
      h('div', {}, [
        h('h1', { class: 'page-title' }, ['Resultados da simulação']),
        h('p', { class: 'page-subtitle' }, [`A IA avaliou ${scenarios.length} configurações diferentes.`]),
      ]),
      Button({
        label: 'Comparar cenários',
        variant: 'secondary',
        icon: icon('arrowRight', 15),
        onClick: () => navigate('/cenarios/comparacao'),
      }),
    ]),

    h('div', { class: 'card' }, [
      h('h3', { style: 'font-size: 15px; font-weight: 600; margin-bottom: 14px;' }, ['Todos os cenários simulados']),
      ScenarioTable(scenarios),
    ]),

    h('div', { class: 'grid grid-3' }, [
      chartCard(
        'Custo por cenário',
        BarChart(
          scenarios.slice(0, 6).map((s) => ({ label: s.name.replace('Cenário ', 'C'), value: -s.costReduction })),
          { barColor: 'var(--accent-blue)' }
        )
      ),
      chartCard(
        'Produtividade por cenário',
        BarChart(
          scenarios.slice(0, 6).map((s) => ({ label: s.name.replace('Cenário ', 'C'), value: s.productivityGain })),
          { barColor: 'var(--accent-purple)' }
        )
      ),
      chartCard(
        'Espera por cenário',
        BarChart(
          scenarios.slice(0, 6).map((s) => ({ label: s.name.replace('Cenário ', 'C'), value: -s.waitReduction })),
          { barColor: 'var(--accent-cyan)' }
        )
      ),
    ]),

    h('div', { style: 'margin-top: 20px;' }, [AIRecommendation(recommended)]),

    h('div', { class: 'card' }, [
      h('div', { class: 'flex items-center gap-10', style: 'color: var(--accent-purple);' }, [
        icon('flask', 16),
        h('span', { style: 'font-weight: 700; font-size: 13.5px;' }, ['Como a recomendação foi calculada?']),
      ]),
      h('p', { class: 'text-secondary', style: 'font-size: 14px; margin-top: 12px; line-height: 1.6;' }, [
        'Cada cenário recebe um score calculado por uma função determinística — a recomendação nunca é escolhida aleatoriamente. O cenário com maior score é sempre o recomendado.',
      ]),
      h('div', { class: 'grid grid-stats', style: 'margin-top: 16px;' }, [
        weightBlock('Custo', weights.cost),
        weightBlock('Produtividade', weights.productivity),
        weightBlock('Tempo de espera', weights.wait),
        weightBlock('Recursos', weights.resources),
      ]),
      h(
        'pre',
        {
          style:
            'margin-top: 18px; background: var(--bg-surface-raised); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 16px; font-size: 12.5px; color: var(--text-secondary); overflow-x: auto; line-height: 1.7;',
        },
        [
          `score =
  reduçãoDeCusto      × ${(weights.cost * 100).toFixed(0)}%
+ ganhoDeProdutividade × ${(weights.productivity * 100).toFixed(0)}%
+ reduçãoDeEspera      × ${(weights.wait * 100).toFixed(0)}%
+ eficiênciaDeRecursos × ${(weights.resources * 100).toFixed(0)}%
- risco                × ${(weights.risk * 100).toFixed(0)}%`,
        ]
      ),
      h('p', { class: 'field-hint', style: 'margin-top: 12px;' }, [
        params.objective === 'equilibrar'
          ? 'Pesos padrão do modelo, para o objetivo "equilibrar custos e produtividade".'
          : `Pesos ajustados automaticamente para o objetivo selecionado (padrão: custo ${DEFAULT_WEIGHTS.cost * 100}% · produtividade ${DEFAULT_WEIGHTS.productivity * 100}%).`,
      ]),
    ]),

    h('div', { class: 'flex', style: 'justify-content: flex-end; margin-top: 8px; gap: 10px;' }, [
      Button({ label: 'Ajustar simulação', variant: 'ghost', onClick: () => navigate('/simulacao/nova') }),
      Button({
        label: 'Ir para comparação',
        variant: 'primary',
        icon: icon('arrowRight', 15),
        onClick: () => navigate('/cenarios/comparacao'),
      }),
    ]),
  ]);
}

function chartCard(title: string, chart: SVGElement): HTMLElement {
  return h('div', { class: 'card' }, [
    h('p', { class: 'field-label', style: 'margin-bottom: 12px;' }, [title]),
    chart,
  ]);
}

function weightBlock(label: string, weight: number): HTMLElement {
  return h('div', {}, [
    h('div', { class: 'stat-label' }, [label]),
    h('div', { class: 'stat-value', style: 'font-size: 20px; margin-top: 6px;' }, [`${(weight * 100).toFixed(0)}%`]),
  ]);
}
