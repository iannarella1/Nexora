export interface Scenario {
  id: number;
  name: string;
  costReduction: number; // % de redução de custo (positivo = redução)
  productivityGain: number; // % de ganho de produtividade
  waitReduction: number; // % de redução no tempo de espera
  employees: number; // número de funcionários alocados
  consumptionReduction: number; // % de redução de consumo de recursos
  risk: number; // % de risco operacional estimado
  score: number; // score calculado (0-100)
  recommended: boolean;
  rating: ScenarioRating;
}

export type ScenarioRating = 'Regular' | 'Boa' | 'Muito boa' | 'Excelente' | 'RECOMENDADO';

export type SimulationParameter =
  | 'horario_funcionarios'
  | 'quantidade_funcionarios'
  | 'distribuicao_equipes'
  | 'horario_funcionamento'
  | 'distribuicao_recursos';

export type SimulationObjective =
  | 'reduzir_custos'
  | 'aumentar_produtividade'
  | 'reduzir_espera'
  | 'equilibrar';

export interface SimulationParams {
  parameter: SimulationParameter;
  currentSchedule: string;
  newSchedule: string;
  maxEmployees: number;
  objective: SimulationObjective;
}

export interface EnvironmentStats {
  employees: number;
  dailyDemand: number;
  avgWaitTime: number;
  dailyCost: number;
  productivity: number;
}

export interface SimulationResult {
  scenarios: Scenario[];
  recommended: Scenario;
  params: SimulationParams;
  timestamp: string;
}

export interface DecisionRecord {
  id: number;
  date: string;
  user: string;
  objective: SimulationObjective;
  scenarioCount: number;
  chosenScenario: Scenario;
  status: 'aprovado' | 'rejeitado' | 'pendente';
}
