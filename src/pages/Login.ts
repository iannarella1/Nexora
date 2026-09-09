import { h } from '@/utils/dom';
import { Button } from '@/components/Button';
import { login } from '@/services/appState';
import { navigate } from '@/router';

export function LoginPage(): HTMLElement {
  const handleEnter = (e: Event) => {
    e.preventDefault();
    login();
    navigate('/dashboard');
  };

  const handleDemo = () => {
    login();
    navigate('/dashboard');
  };

  return h('div', { class: 'login-shell' }, [
    h('div', { class: 'login-card' }, [
      h('div', { class: 'login-brand' }, [
        h('div', { class: 'login-mark' }, ['N']),
        h('div', { class: 'login-name' }, ['NEXORA']),
        h('div', { class: 'login-slogan' }, ['“Simule antes de transformar.”']),
      ]),
      h('form', { onsubmit: handleEnter }, [
        h('div', { class: 'field' }, [
          h('label', { class: 'field-label' }, ['E-mail']),
          h('input', { class: 'input', type: 'email', placeholder: 'voce@empresa.com', value: 'gestor@nexora.demo' }),
        ]),
        h('div', { class: 'field' }, [
          h('label', { class: 'field-label' }, ['Senha']),
          h('input', { class: 'input', type: 'password', placeholder: '••••••••', value: 'demo1234' }),
        ]),
        Button({ label: 'Entrar', variant: 'primary', block: true, type: 'submit' }),
      ]),
      h('div', { class: 'login-divider' }, ['ou']),
      Button({ label: 'Entrar como demonstração', variant: 'secondary', block: true, onClick: handleDemo }),
      h('p', { class: 'login-footnote' }, [
        'Protótipo conceitual · Dados simulados. Nenhuma credencial real é validada — este acesso utiliza um ambiente de demonstração com dados fictícios.',
      ]),
    ]),
  ]);
}
