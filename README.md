# NEXORA — "Simule antes de transformar."

Protótipo acadêmico navegável de uma plataforma conceitual de gêmeo digital e
simulação de decisões. Todos os dados são **fictícios e locais** — não há
backend, banco de dados, autenticação real ou IA real.

## Como executar

Pré-requisito: Node.js 18+ instalado.

```bash
npm install
npm run dev
```

Abra o endereço mostrado no terminal (geralmente `http://localhost:5173`).

Para gerar uma versão de produção (arquivos estáticos):

```bash
npm run build
npm run preview
```

## Como usar

1. Na tela de login, clique em **"Entrar como demonstração"** (não é
   necessário digitar credenciais reais).
2. Explore o **Dashboard**, o **Meu ambiente** e clique em **"Ver análise"**
   ou vá em **Simulações** para configurar uma nova simulação.
3. Escolha um parâmetro e um objetivo e clique em **"SIMULAR COM IA"** —
   a IA (simulada) vai gerar 15 cenários, calcular um score explicável para
   cada um e recomendar o de melhor equilíbrio.
4. Navegue por **Resultados → Comparação → Aprovação → Relatório** para ver
   o fluxo completo de governança assistida por humano.

## Estrutura do projeto

```
nexora/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── src/
    ├── main.ts                # roteamento e bootstrap da aplicação
    ├── router.ts               # router baseado em hash, sem dependências
    ├── styles/                 # variáveis de design, estilos globais e responsivos
    ├── components/             # Sidebar, Header, StatCard, Button, Chart, etc.
    ├── pages/                  # uma tela por arquivo (Login, Dashboard, ...)
    ├── data/mockData.ts        # dados fictícios do ambiente/empresa
    ├── services/
    │   ├── appState.ts         # estado da aplicação em memória
    │   └── simulationService.ts# motor de geração e pontuação dos cenários
    ├── utils/                  # cálculos, formatação e helpers de DOM
    └── types/scenario.ts       # tipos TypeScript do domínio
```

## Lógica de simulação (resumo)

Cada cenário recebe um **score determinístico**:

```
score = reduçãoDeCusto × pesoCusto
      + ganhoDeProdutividade × pesoProdutividade
      + reduçãoDeEspera × pesoEspera
      + eficiênciaDeRecursos × pesoRecursos
      - risco × pesoRisco
```

Os pesos mudam de acordo com o objetivo escolhido pelo usuário (equilibrar,
reduzir custos, aumentar produtividade ou reduzir espera), e o cenário
recomendado é sempre o de **maior score** — nunca escolhido aleatoriamente.

## Identidade acadêmica

Este projeto é uma proposta conceitual relacionada ao **ODS 8 — Trabalho
Decente e Crescimento Econômico**, buscando ilustrar como simulação e IA
explicável podem apoiar decisões operacionais mais eficientes, sempre com
aprovação humana obrigatória.
