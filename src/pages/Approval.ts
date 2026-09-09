import { h } from '@/utils/dom';
import { Button } from '@/components/Button';
import { icon } from '@/components/Icon';
import { navigate } from '@/router';
import { getState, setSimulationResult, setApprovalStatus } from '@/services/appState';
import { runSimulation } from '@/services/simulationService';
import { BASE_ENVIRONMENT } from '@/data/mockData';
import { formatNumber } from '@/utils/formatters';

function ensureSimulation() {
  if (!getState().lastSimulation) {
    setSimulationResult(runSimulation(getState().draftParams));
  }
  return getState().lastSimulation!;
}

export function ApprovalPage(): HTMLElement {
  const sim = ensureSimulation();
  const rec = sim.recommended;
  const params = sim.params;

  const container = h('div', { style: 'max-width: 640px; margin: 0 auto;' });

  const renderIdle = () => {
    container.innerHTML = '';
    container.append(
      h('div', { class: 'page-header' }, [
        h('div', {}, [
          h('h1', { class: 'page-title' }, ['Aplicar esta decisão?']),
          h('p', { class: 'page-subtitle' }, [
            'Revise a mudança antes de registrar a aprovação. Nenhuma alteração real será executada.',
          ]),
        ]),
      ]),

      h('div', { class: 'grid grid-2' }, [
        beforeAfterCard('Antes', params.currentSchedule, BASE_ENVIRONMENT.employees, 'badge-muted'),
        beforeAfterCard('Depois', params.newSchedule, rec.employees, 'badge-cyan'),
      ]),

      h('div', { class: 'card', style: 'margin-top: 20px;' }, [
        h('div', { class: 'flex', style: 'gap: 12px; flex-wrap: wrap;' }, [
          Button({
            label: 'Aprovar alteração',
            variant: 'primary',
            icon: icon('check', 15),
            onClick: () => {
              setApprovalStatus('aprovado');
              renderApproved();
            },
          }),
          Button({
            label: 'Rejeitar',
            variant: 'danger',
            onClick: () => {
              setApprovalStatus('rejeitado');
              renderRejected();
            },
          }),
          Button({ label: 'Voltar', variant: 'ghost', onClick: () => navigate('/cenarios/comparacao') }),
        ]),
      ])
    );
  };

  const renderApproved = () => {
    container.innerHTML = '';
    container.append(
      h('div', { class: 'card', style: 'text-align: center; padding: 40px 28px;' }, [
        h('div', {
          style:
            'width:56px;height:56px;border-radius:50%;background:rgba(61,220,151,0.14);color:var(--accent-green);display:flex;align-items:center;justify-content:center;margin:0 auto 18px;',
        }, [icon('check', 26)]),
        h('h2', { style: 'font-size: 19px; font-weight: 700;' }, ['Alteração aprovada']),
        h('p', { class: 'text-secondary', style: 'margin-top: 12px; line-height: 1.7; max-width: 460px; margin-left:auto; margin-right:auto;' }, [
          'Esta é uma simulação acadêmica. Em uma implementação real, a decisão seria enviada ao sistema operacional somente após as validações necessárias.',
        ]),
        h('div', { class: 'flex', style: 'justify-content: center; gap: 10px; margin-top: 22px;' }, [
          Button({ label: 'Ver relatório', variant: 'primary', onClick: () => navigate('/relatorios') }),
          Button({ label: 'Voltar ao dashboard', variant: 'ghost', onClick: () => navigate('/dashboard') }),
        ]),
      ])
    );
  };

  const renderRejected = () => {
    container.innerHTML = '';
    container.append(
      h('div', { class: 'card', style: 'text-align: center; padding: 40px 28px;' }, [
        h('div', {
          style:
            'width:56px;height:56px;border-radius:50%;background:rgba(255,107,129,0.14);color:var(--accent-red);display:flex;align-items:center;justify-content:center;margin:0 auto 18px;',
        }, [icon('close', 26)]),
        h('h2', { style: 'font-size: 19px; font-weight: 700;' }, ['Alteração rejeitada']),
        h('p', { class: 'text-secondary', style: 'margin-top: 12px; line-height: 1.7;' }, [
          'Nenhuma mudança será aplicada. Você pode ajustar os parâmetros e simular novamente.',
        ]),
        h('div', { class: 'flex', style: 'justify-content: center; gap: 10px; margin-top: 22px;' }, [
          Button({ label: 'Nova simulação', variant: 'primary', onClick: () => navigate('/simulacao/nova') }),
          Button({ label: 'Voltar ao dashboard', variant: 'ghost', onClick: () => navigate('/dashboard') }),
        ]),
      ])
    );
  };

  renderIdle();
  return container;
}

function beforeAfterCard(label: string, schedule: string, employees: number, badgeClass: string): HTMLElement {
  return h('div', { class: 'card' }, [
    h('span', { class: `badge ${badgeClass}` }, [label]),
    h('div', { style: 'margin-top: 16px;' }, [
      h('div', { class: 'stat-label' }, ['Horário']),
      h('div', { class: 'stat-value', style: 'font-size: 22px; margin-top: 6px;' }, [schedule]),
    ]),
    h('div', { style: 'margin-top: 16px;' }, [
      h('div', { class: 'stat-label' }, ['Funcionários']),
      h('div', { class: 'stat-value', style: 'font-size: 22px; margin-top: 6px;' }, [`${formatNumber(employees)} funcionários`]),
    ]),
  ]);
}
