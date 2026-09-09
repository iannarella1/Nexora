import { h } from '@/utils/dom';

export interface StatCardProps {
  label: string;
  value: string;
  delta?: number;
  deltaSuffix?: string;
  invertDeltaColor?: boolean; // quando um valor negativo é bom (ex: custo, espera)
}

export function StatCard({ label, value, delta, deltaSuffix = '', invertDeltaColor }: StatCardProps): HTMLElement {
  let deltaEl: HTMLElement | null = null;

  if (delta !== undefined) {
    const isPositiveNumber = delta > 0;
    const isGood = invertDeltaColor ? !isPositiveNumber : isPositiveNumber;
    const cls = delta === 0 ? 'neutral' : isGood ? 'positive' : 'negative';
    const sign = delta > 0 ? '+' : '';
    deltaEl = h('span', { class: `stat-delta ${cls}` }, [
      `${sign}${delta.toFixed(1)}%${deltaSuffix}`,
    ]);
  }

  return h('div', { class: 'stat-card' }, [
    h('div', { class: 'stat-label' }, [label]),
    h('div', { class: 'stat-value' }, [value]),
    deltaEl,
  ]);
}
