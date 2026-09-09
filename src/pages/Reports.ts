import { h } from '@/utils/dom';
import { Button } from '@/components/Button';
import { icon } from '@/components/Icon';
import { getState } from '@/services/appState';
import { formatDate, formatPercent } from '@/utils/formatters';

const OBJECTIVE_LABELS: Record<string, string> = {
  reduzir_custos: 'Reduzir custos',
  aumentar_produtividade: 'Aumentar produtividade',
  reduzir_espera: 'Reduzir tempo de espera',
  equilibrar: 'Equilibrar custos e produtividade',
};

export function ReportsPage(): HTMLElement {
  const state = getState();
  const sim = state.lastSimulation;

  if (!sim) {
    return h('div', {}, [
      h('div', { class: 'page-header' }, [
        h('div', {}, [
          h('h1', { class: 'page-title' }, ['Relatório da simulação']),
          h('p', { class: 'page-subtitle' }, ['Nenhuma simulação foi executada ainda.']),
        ]),
      ]),
      h('div', { class: 'card' }, [
        h('p', { class: 'text-secondary' }, ['Execute uma simulação para gerar um relatório.']),
      ]),
    ]);
  }

  const rec = sim.recommended;
  const status = state.approval.status;

  const handleExport = (btn: HTMLButtonElement) => {
    const originalLabel = btn.textContent;
    btn.textContent = 'Exportando…';
    window.setTimeout(() => {
      btn.textContent = 'Relatório exportado ✓';
      window.setTimeout(() => {
        btn.textContent = originalLabel;
      }, 1800);
    }, 700);
  };

  return h('div', {}, [
    h('div', { class: 'page-header' }, [
      h('div', {}, [
        h('h1', { class: 'page-title' }, ['Relatório da simulação']),
        h('p', { class: 'page-subtitle' }, ['Resumo executivo da última rodada de simulações']),
      ]),
      h('span', { class: statusBadgeClass(status) }, [statusLabel(status)]),
    ]),

    h('div', { class: 'card' }, [
      reportRow('Data', formatDate(new Date(sim.timestamp))),
      reportRow('Usuário', state.userName),
      reportRow('Objetivo', OBJECTIVE_LABELS[sim.params.objective]),
      reportRow('Quantidade de cenários', String(sim.scenarios.length)),
      reportRow('Cenário escolhido', rec.name),
      reportRow(
        'Impacto estimado',
        `Custo ${formatPercent(-rec.costReduction)} · Produtividade ${formatPercent(rec.productivityGain)} · Espera ${formatPercent(-rec.waitReduction)}`
      ),
    ]),

    h('div', { class: 'card' }, [
      h('div', { class: 'flex items-center gap-10', style: 'color: var(--accent-cyan); margin-bottom: 10px;' }, [
        icon('sparkle', 16),
        h('span', { style: 'font-weight: 700; font-size: 13px;' }, ['Recomendação da IA']),
      ]),
      h('p', { class: 'text-secondary', style: 'font-size: 14px; line-height: 1.7;' }, [
        'O cenário recomendado apresenta o melhor equilíbrio entre redução de custos e aumento de produtividade dentro das restrições definidas, com confiança estimada de 92%.',
      ]),
    ]),

    h('div', { class: 'flex', style: 'justify-content: flex-end;' }, [
      Button({
        label: 'Exportar relatório',
        variant: 'primary',
        icon: icon('download', 16),
        onClick: (e: Event) => handleExport(e.currentTarget as HTMLButtonElement),
      }),
    ]),

    h('div', { class: 'academic-footer' }, [
      'Relatório gerado localmente a partir de dados fictícios, apenas para fins de demonstração acadêmica.',
    ]),
  ]);
}

function reportRow(label: string, value: string): HTMLElement {
  return h('div', { class: 'flex items-center justify-between', style: 'padding: 11px 0; border-bottom: 1px solid var(--border-subtle);' }, [
    h('span', { class: 'text-secondary', style: 'font-size: 13.5px;' }, [label]),
    h('span', { style: 'font-weight: 600; font-size: 14px; text-align: right; max-width: 60%;' }, [value]),
  ]);
}

function statusLabel(status: string): string {
  if (status === 'aprovado') return 'Aprovado';
  if (status === 'rejeitado') return 'Rejeitado';
  return 'Pendente de aprovação';
}

function statusBadgeClass(status: string): string {
  if (status === 'aprovado') return 'badge badge-green';
  if (status === 'rejeitado') return 'badge badge-muted';
  return 'badge badge-purple';
}
