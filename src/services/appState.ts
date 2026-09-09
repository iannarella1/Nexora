import type { DecisionRecord, SimulationParams, SimulationResult } from '@/types/scenario';

export interface AppState {
  isAuthenticated: boolean;
  userName: string;
  draftParams: SimulationParams;
  lastSimulation: SimulationResult | null;
  approval: {
    status: 'pendente' | 'aprovado' | 'rejeitado';
  };
  decisionHistory: DecisionRecord[];
}

const state: AppState = {
  isAuthenticated: false,
  userName: 'Gestor',
  draftParams: {
    parameter: 'horario_funcionarios',
    currentSchedule: '08:00 — 18:00',
    newSchedule: '08:00 — 20:00',
    maxEmployees: 126,
    objective: 'equilibrar',
  },
  lastSimulation: null,
  approval: { status: 'pendente' },
  decisionHistory: [],
};

type Listener = () => void;
const listeners = new Set<Listener>();

export function getState(): AppState {
  return state;
}

export function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function login(): void {
  state.isAuthenticated = true;
}

export function logout(): void {
  state.isAuthenticated = false;
  state.lastSimulation = null;
  state.approval.status = 'pendente';
  notify();
}

export function updateDraftParams(partial: Partial<SimulationParams>): void {
  state.draftParams = { ...state.draftParams, ...partial };
}

export function setSimulationResult(result: SimulationResult): void {
  state.lastSimulation = result;
  state.approval.status = 'pendente';
}

export function setApprovalStatus(status: AppState['approval']['status']): void {
  state.approval.status = status;

  if (state.lastSimulation) {
    state.decisionHistory.unshift({
      id: state.decisionHistory.length + 1,
      date: new Date().toISOString(),
      user: state.userName,
      objective: state.lastSimulation.params.objective,
      scenarioCount: state.lastSimulation.scenarios.length,
      chosenScenario: state.lastSimulation.recommended,
      status,
    });
  }
}

function notify(): void {
  listeners.forEach((l) => l());
}
