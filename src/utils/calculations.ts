import type { Scenario, ScenarioRating, SimulationObjective } from '@/types/scenario';

/**
 * Pesos padrão do modelo (objetivo: equilibrar custos e produtividade).
 * custo 30% + produtividade 30% + espera 20% + recursos 10% - risco 10%
 */
export const DEFAULT_WEIGHTS = {
  cost: 0.3,
  productivity: 0.3,
  wait: 0.2,
  resources: 0.1,
  risk: 0.1,
};

export interface ScoreWeights {
  cost: number;
  productivity: number;
  wait: number;
  resources: number;
  risk: number;
}

/**
 * Retorna os pesos do score de acordo com o objetivo escolhido pelo usuário.
 * Isso garante que a recomendação mude de forma coerente conforme o objetivo.
 */
export function getWeightsForObjective(objective: SimulationObjective): ScoreWeights {
  switch (objective) {
    case 'reduzir_custos':
      return { cost: 0.5, productivity: 0.2, wait: 0.15, resources: 0.1, risk: 0.05 };
    case 'aumentar_produtividade':
      return { cost: 0.15, productivity: 0.5, wait: 0.2, resources: 0.1, risk: 0.05 };
    case 'reduzir_espera':
      return { cost: 0.15, productivity: 0.2, wait: 0.5, resources: 0.1, risk: 0.05 };
    case 'equilibrar':
    default:
      return DEFAULT_WEIGHTS;
  }
}

/**
 * Calcula o score de um cenário com base nos pesos definidos.
 * score = reduçãoCusto*wCusto + ganhoProdutividade*wProd + reduçãoEspera*wEspera
 *         + eficiênciaRecursos*wRecursos - risco*wRisco
 */
export function calculateScore(
  scenario: Pick<
    Scenario,
    'costReduction' | 'productivityGain' | 'waitReduction' | 'consumptionReduction' | 'risk'
  >,
  weights: ScoreWeights = DEFAULT_WEIGHTS
): number {
  const raw =
    scenario.costReduction * weights.cost +
    scenario.productivityGain * weights.productivity +
    scenario.waitReduction * weights.wait +
    scenario.consumptionReduction * weights.resources -
    scenario.risk * weights.risk;

  // Normaliza para uma faixa de confiança de 0-100
  return Math.max(0, Math.min(100, raw + 50));
}

export function scoreToRating(score: number, isTop: boolean): ScenarioRating {
  if (isTop) return 'RECOMENDADO';
  if (score >= 68) return 'Excelente';
  if (score >= 60) return 'Muito boa';
  if (score >= 52) return 'Boa';
  return 'Regular';
}

/** Curva de retornos decrescentes — usada para produtividade e tempo de espera */
export function diminishingCurve(t: number, max: number): number {
  return max * (1 - Math.exp(-2.2 * t));
}

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function round1(value: number): number {
  return Math.round(value * 10) / 10;
}
