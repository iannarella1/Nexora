import '@/styles/global.css';
import '@/styles/responsive.css';
import { registerRoute, setNotFoundHandler, startRouter, navigate, currentPath } from '@/router';
import { getState } from '@/services/appState';
import { AppShell } from '@/components/AppShell';
import { LoginPage } from '@/pages/Login';
import { DashboardPage } from '@/pages/Dashboard';
import { EnvironmentPage } from '@/pages/Environment';
import { SimulationFormPage, SimulationProcessingPage } from '@/pages/Simulation';
import { ResultsPage } from '@/pages/Results';
import { ComparisonPage } from '@/pages/Comparison';
import { ApprovalPage } from '@/pages/Approval';
import { ReportsPage } from '@/pages/Reports';
import { SettingsPage } from '@/pages/Settings';

const appEl = document.getElementById('app')!;

function render(node: HTMLElement): void {
  appEl.innerHTML = '';
  appEl.append(node);
}

function renderAuthenticated(title: string, pageFactory: () => HTMLElement): void {
  if (!getState().isAuthenticated) {
    navigate('/login');
    return;
  }
  render(AppShell(title, pageFactory()));
}

registerRoute('/login', () => {
  if (getState().isAuthenticated) {
    navigate('/dashboard');
    return;
  }
  render(LoginPage());
});

registerRoute('/dashboard', () => renderAuthenticated('Dashboard', DashboardPage));
registerRoute('/ambiente', () => renderAuthenticated('Meu ambiente', EnvironmentPage));
registerRoute('/simulacao/nova', () => renderAuthenticated('Nova simulação', SimulationFormPage));
registerRoute('/simulacao/processando', () =>
  renderAuthenticated('Processando simulação', SimulationProcessingPage)
);
registerRoute('/cenarios/resultados', () => renderAuthenticated('Resultados', ResultsPage));
registerRoute('/cenarios/recomendacao', () => renderAuthenticated('Recomendação da IA', ResultsPage));
registerRoute('/cenarios/comparacao', () => renderAuthenticated('Comparação', ComparisonPage));
registerRoute('/cenarios/aprovacao', () => renderAuthenticated('Aprovação', ApprovalPage));
registerRoute('/relatorios', () => renderAuthenticated('Relatórios', ReportsPage));
registerRoute('/configuracoes', () => renderAuthenticated('Configurações', SettingsPage));

setNotFoundHandler(() => {
  navigate(getState().isAuthenticated ? '/dashboard' : '/login');
});

if (!currentPath() || currentPath() === '/') {
  navigate(getState().isAuthenticated ? '/dashboard' : '/login');
}

startRouter();
