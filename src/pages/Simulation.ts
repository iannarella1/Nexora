import { h } from '@/utils/dom';
import { Button } from '@/components/Button';
import { icon } from '@/components/Icon';
import { navigate } from '@/router';
import { getState, updateDraftParams, setSimulationResult } from '@/services/appState';
import { runSimulation } from '@/services/simulationService';
import type { SimulationObjective, SimulationParameter } from '@/types/scenario';

const PARAMETER_OPTIONS: { value: SimulationParameter; label: string }[] = [
  { value: 'horario_funcionarios', label: 'Horário dos funcionários' },
  { value: 'quantidade_funcionarios', label: 'Quantidade de funcionários' },
  { value: 'distribuicao_equipes', label: 'Distribuição de equipes' },
  { value: 'horario_funcionamento', label: 'Horário de funcionamento' },
  { value: 'distribuicao_recursos', label: 'Distribuição de recursos' },
];

const OBJECTIVE_OPTIONS: { value: SimulationObjective; label: string }[] = [
  { value: 'reduzir_custos', label: 'Reduzir custos' },
  { value: 'aumentar_produtividade', label: 'Aumentar produtividade' },
  { value: 'reduzir_espera', label: 'Reduzir tempo de espera' },
  { value: 'equilibrar', label: 'Equilibrar custos e produtividade' },
];

export function SimulationFormPage(): HTMLElement {
  const params = { ...getState().draftParams };

  const container = h('div', {});

  const renderForm = () => {
    container.innerHTML = '';
    container.append(
      h('div', { class: 'page-header' }, [
        h('div', {}, [
          h('h1', { class: 'page-title' }, ['Criar nova simulação']),
          h('p', { class: 'page-subtitle' }, ['O que você deseja alterar?']),
        ]),
      ]),

      h('div', { class: 'grid grid-2' }, [
        h('div', { class: 'card' }, [
          h('p', { class: 'field-label', style: 'margin-bottom: 10px;' }, ['Parâmetro de simulação']),
          h(
            'div',
            { class: 'option-group' },
            PARAMETER_OPTIONS.map((opt) =>
              h(
                'div',
                {
                  class: `option-pill${params.parameter === opt.value ? ' selected' : ''}`,
                  onclick: () => {
                    params.parameter = opt.value;
                    renderForm();
                  },
                },
                [h('span', { class: 'dot' }), opt.label]
              )
            )
          ),

          h('div', { style: 'margin-top: 22px;' }, [
            h('div', { class: 'field' }, [
              h('label', { class: 'field-label' }, ['Horário atual']),
              h('input', {
                class: 'input',
                value: params.currentSchedule,
                oninput: (e: Event) => (params.currentSchedule = (e.target as HTMLInputElement).value),
              }),
            ]),
            h('div', { class: 'field' }, [
              h('label', { class: 'field-label' }, ['Nova configuração']),
              h('input', {
                class: 'input',
                value: params.newSchedule,
                oninput: (e: Event) => (params.newSchedule = (e.target as HTMLInputElement).value),
              }),
            ]),
            h('div', { class: 'field' }, [
              h('label', { class: 'field-label' }, ['Número máximo de funcionários']),
              h('input', {
                class: 'input',
                type: 'number',
                min: '1',
                value: String(params.maxEmployees),
                oninput: (e: Event) =>
                  (params.maxEmployees = Number((e.target as HTMLInputElement).value) || params.maxEmployees),
              }),
            ]),
          ]),
        ]),

        h('div', { class: 'card' }, [
          h('p', { class: 'field-label', style: 'margin-bottom: 10px;' }, ['Objetivo da simulação']),
          h(
            'div',
            { class: 'option-group' },
            OBJECTIVE_OPTIONS.map((opt) =>
              h(
                'div',
                {
                  class: `option-pill${params.objective === opt.value ? ' selected' : ''}`,
                  onclick: () => {
                    params.objective = opt.value;
                    renderForm();
                  },
                },
                [h('span', { class: 'dot' }), opt.label]
              )
            )
          ),

          h('p', { class: 'field-hint', style: 'margin-top: 18px; line-height: 1.6;' }, [
            'A IA NEXORA vai gerar 15 cenários possíveis e calcular um score explicável para cada um, com base nos pesos definidos para este objetivo.',
          ]),

          h('div', { style: 'margin-top: 22px;' }, [
            Button({
              label: 'SIMULAR COM IA',
              variant: 'primary',
              block: true,
              icon: icon('sparkle', 16),
              onClick: () => {
                updateDraftParams(params);
                navigate('/simulacao/processando');
              },
            }),
          ]),
        ]),
      ])
    );
  };

  renderForm();
  return container;
}

const STEPS = [
  'Analisando dados atuais',
  'Atualizando gêmeo digital',
  'Gerando cenários',
  'Executando simulações',
  'Comparando resultados',
  'Identificando melhor alternativa',
];

export function SimulationProcessingPage(): HTMLElement {
  const stepListEl = h(
    'div',
    { class: 'step-list' },
    STEPS.map((s) => h('div', { class: 'step-item' }, [h('span', { class: 'step-check' }), s]))
  );
  const progressFill = h('div', { class: 'progress-fill', style: 'width: 0%;' });

  const page = h('div', { style: 'max-width: 520px; margin: 40px auto;' }, [
    h('div', { class: 'card', style: 'text-align: center;' }, [
      h('div', { class: 'flex items-center', style: 'justify-content: center; gap: 10px; color: var(--accent-cyan); margin-bottom: 6px;' }, [
        icon('sparkle', 20),
      ]),
      h('h2', { style: 'font-size: 19px; font-weight: 700;' }, ['NEXORA AI está analisando o ambiente…']),
      h('p', { class: 'text-muted', style: 'font-size: 13px; margin-top: 6px;' }, [
        'Processando dados simulados do ambiente digital',
      ]),
      h('div', { class: 'progress-track' }, [progressFill]),
      h('div', { style: 'text-align: left;' }, [stepListEl]),
    ]),
  ]);

  let stepIndex = 0;
  const stepEls = Array.from(stepListEl.children);

  const interval = window.setInterval(() => {
    if (stepIndex < stepEls.length) {
      stepEls[stepIndex].classList.add('done');
      const checkEl = stepEls[stepIndex].querySelector('.step-check');
      if (checkEl) checkEl.innerHTML = '✓';
      stepIndex++;
      progressFill.style.width = `${(stepIndex / stepEls.length) * 100}%`;
    }

    if (stepIndex >= stepEls.length) {
      window.clearInterval(interval);
      const result = runSimulation(getState().draftParams);
      setSimulationResult(result);
      window.setTimeout(() => navigate('/cenarios/resultados'), 500);
    }
  }, 550);

  return page;
}
