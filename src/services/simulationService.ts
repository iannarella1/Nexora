import type {
  Scenario,
  SimulationParams,
  SimulationResult,
  SimulationParameter,
} from '@/types/scenario';
import { BASE_ENVIRONMENT } from '@/data/mockData';
import {
  calculateScore,
  getWeightsForObjective,
  scoreToRating,
  diminishingCurve,
  clamp,
  round1,
} from '@/utils/calculations';

const SCENARIO_COUNT = 15;

/**
 * Perfis de impacto por tipo de parâmetro alterado.
 * Definem o quanto cada indicador reage à intensidade da mudança (t de 0 a 1),
 * seguindo as relações descritas no briefing:
 *  - mais funcionários => custo sobe, espera cai, produtividade sobe até um limite, risco cai
 *  - menos funcionários => custo cai, espera sobe, produtividade pode cair, risco sobe
 *  - mais horas de funcionamento => capacidade sobe, custo sobe, espera pode cair,
 *    produtividade pode subir dependendo da distribuição
 */
interface ImpactProfile {
  costMax: number; // % máxima de redução (ou aumento negativo) de custo
  productivityMax: number; // % máxima de ganho de produtividade
  waitMax: number; // % máxima de redução de espera
  consumptionMax: number; // % máxima de redução de consumo
  riskMax: number; // % máxima de risco introduzido
  employeeDeltaMax: number; // variação máxima no número de funcionários (negativo = redução)
}

const IMPACT_PROFILES: Record<SimulationParameter, ImpactProfile> = {
  horario_funcionarios: {
    costMax: 22,
    productivityMax: 14,
    waitMax: 9,
    consumptionMax: 10,
    riskMax: 16,
    employeeDeltaMax: -12,
  },
  quantidade_funcionarios: {
    costMax: 28,
    productivityMax: 10,
    waitMax: -14, // reduzir funcionários tende a aumentar a espera
    consumptionMax: 8,
    riskMax: 22,
    employeeDeltaMax: -22,
  },
  distribuicao_equipes: {
    costMax: 12,
    productivityMax: 18,
    waitMax: 15,
    consumptionMax: 6,
    riskMax: 10,
    employeeDeltaMax: -4,
  },
  horario_funcionamento: {
    costMax: 10,
    productivityMax: 12,
    waitMax: 18,
    consumptionMax: -6, // mais horas tende a aumentar o consumo de recursos
    riskMax: 12,
    employeeDeltaMax: 6,
  },
  distribuicao_recursos: {
    costMax: 16,
    productivityMax: 9,
    waitMax: 11,
    consumptionMax: 20,
    riskMax: 8,
    employeeDeltaMax: -2,
  },
};

const SCENARIO_NAME_PREFIX = 'Cenário';

/**
 * Gera os 15 cenários simulados a partir dos parâmetros definidos pelo usuário.
 * A lógica é determinística: para os mesmos parâmetros, os mesmos cenários
 * (e a mesma recomendação) são sempre produzidos.
 */
export function generateScenarios(params: SimulationParams): Scenario[] {
  const profile = IMPACT_PROFILES[params.parameter];
  const weights = getWeightsForObjective(params.objective);
  const maxEmployees = params.maxEmployees || BASE_ENVIRONMENT.employees;

  const rawScenarios: Omit<Scenario, 'score' | 'recommended' | 'rating'>[] = [];

  for (let i = 1; i <= SCENARIO_COUNT; i++) {
    const t = i / SCENARIO_COUNT; // intensidade da mudança, de ~0.07 a 1.0

    const costReduction = round1(diminishingCurve(t, profile.costMax));
    const productivityGain = round1(diminishingCurve(t, profile.productivityMax));
    const waitReduction = round1(diminishingCurve(t, profile.waitMax));
    const consumptionReduction = round1(diminishingCurve(t, profile.consumptionMax));

    // Risco cresce de forma mais que proporcional em intensidades altas
    const risk = round1(clamp(profile.riskMax * Math.pow(t, 1.6), 0.5, 40));

    const employeeDelta = Math.round(profile.employeeDeltaMax * t);
    const employees = clamp(maxEmployees + employeeDelta, Math.round(maxEmployees * 0.7), maxEmployees + 10);

    rawScenarios.push({
      id: i,
      name: `${SCENARIO_NAME_PREFIX} ${i}`,
      costReduction,
      productivityGain,
      waitReduction,
      employees,
      consumptionReduction,
      risk,
    });
  }

  const scored = rawScenarios.map((s) => ({
    ...s,
    score: round1(calculateScore(s, weights)),
  }));

  const topScore = Math.max(...scored.map((s) => s.score));

  const scenarios: Scenario[] = scored.map((s) => ({
    ...s,
    recommended: s.score === topScore,
    rating: scoreToRating(s.score, s.score === topScore),
  }));

  return scenarios;
}

export function runSimulation(params: SimulationParams): SimulationResult {
  const scenarios = generateScenarios(params);
  const recommended = scenarios.find((s) => s.recommended) ?? scenarios[scenarios.length - 1];

  return {
    scenarios,
    recommended,
    params,
    timestamp: new Date().toISOString(),
  };
}
