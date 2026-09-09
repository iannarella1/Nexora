import type { EnvironmentStats } from '@/types/scenario';

export const COMPANY_NAME = 'NEXORA Industries';

export const BASE_ENVIRONMENT: EnvironmentStats = {
  employees: 126,
  dailyDemand: 1840,
  avgWaitTime: 8.4,
  dailyCost: 12430,
  productivity: 87,
};

export const DASHBOARD_STATS = {
  operationalCost: 48520,
  operationalCostDelta: -8.4,
  productivity: 87,
  productivityDelta: 4.2,
  avgWaitTime: 8.4,
  avgWaitTimeDelta: -5.1,
  activeEmployees: 126,
  activeEmployeesDelta: 0,
};

export const COST_TREND = [51200, 50800, 49950, 49500, 49100, 48900, 48520];
export const PRODUCTIVITY_TREND = [79, 80.5, 82, 83.5, 84.8, 86, 87];
export const WAIT_TIME_TREND = [9.8, 9.5, 9.2, 8.9, 8.7, 8.5, 8.4];

export const ENVIRONMENT_AREAS = [
  { id: 'recepcao', name: 'Recepção', occupancy: 62, employees: 12 },
  { id: 'atendimento', name: 'Atendimento', occupancy: 88, employees: 34 },
  { id: 'producao', name: 'Produção', occupancy: 95, employees: 51 },
  { id: 'estoque', name: 'Estoque', occupancy: 54, employees: 18 },
  { id: 'administracao', name: 'Administração', occupancy: 40, employees: 11 },
];

export const AI_LAST_ANALYSIS =
  'O Cenário 15 apresenta o melhor equilíbrio entre custo, produtividade e tempo de espera.';

export const GOVERNANCE_ITEMS = [
  'Aprovação humana obrigatória',
  'Registro de decisões',
  'Histórico de simulações',
  'IA explicável',
];

export const SECURITY_ITEMS = [
  'Autenticação',
  'Controle de acesso',
  'Registro de decisões',
  'Aprovação humana',
  'Histórico de simulações',
];
