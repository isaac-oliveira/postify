---
id: STORY-003
title: "Habilitar TypeScript strict no scaffold sem regras de domínio"
status: approved
---

# STORY-003 — Habilitar TypeScript strict no scaffold sem regras de domínio

**Status:** approved
**Origem:** [EPIC-001 — Fundação estrutural do Postify](../epics/EPIC-001-postify-foundation.md)

## História de usuário

Como pessoa desenvolvedora, quero que o scaffold seja verificado com
TypeScript strict, para que erros de tipagem sejam detectados antes que as
próximas Stories adicionem infraestrutura ou fluxos de produto.

## Critérios de aceitação

- [x] **AC-001 — Dependências e configuração:** o manifesto declara versões
  explícitas de `typescript`, `@types/react` e `@types/react-dom` quando
  necessárias ao bootstrap, preserva `packageManager`, `prepare` e as
  dependências anteriores, e o lockfile registra o grafo completo sem
  alterações não relacionadas.
- [x] **AC-002 — Strict efetivo:** `tsconfig.app.json` e
  `tsconfig.node.json` habilitam `strict: true` e `noEmit: true`, cobrindo o
  código React e a configuração do Vite; `tsconfig.json` raiz referencia as
  configurações sem criar regras de domínio.
- [x] **AC-003 — Typecheck verificável:** existe um script `typecheck` que
  verifica as configurações da aplicação e do Node/Vite, termina com sucesso
  no scaffold e falha com diagnóstico de arquivo/linha quando uma
  incompatibilidade de tipo ou `implicit any` é introduzida temporariamente.
  A verificação não gera arquivos.
- [x] **AC-004 — Bootstrap migrado:** o entrypoint mínimo produzido pela
  STORY-002 usa TypeScript/TSX conforme necessário, compila sob strict sem
  `any` ou `@ts-ignore` usados para ocultar erros e continua sem rotas,
  estado, rede ou regras de domínio.
- [x] **AC-005 — Regressão do runtime e da barreira:** `dev`, `build` e
  `preview` da STORY-002 continuam operacionais, a raiz ainda monta o
  placeholder React e `prepare`, Commitlint e Lefthook da STORY-001 continuam
  instaláveis e funcionais.
- [x] **AC-006 — Limite da Story:** o diff fica restrito às dependências de
  TypeScript, lockfile, configurações `tsconfig*`, migração mínima do
  bootstrap e script de typecheck; não inclui React Router, i18n, providers,
  ESLint, Prettier, testes, Supabase, PWA ou comportamento de produto.

## Dependências e riscos

- Depende da implementação e validação da STORY-002, que fornece o runtime
  React/Vite a ser migrado.
- Consome `ARCH-001 v1`, o contexto do projeto e os limites de EPIC-001.
- O principal risco é uma configuração que não inclua todos os arquivos ou
  que verifique zero fontes; o Test Plan exige confirmação de `strict`,
  `noEmit` e cobertura do app e do Vite.
- Correções com `any`, `@ts-ignore` ou exclusões amplas podem mascarar erros e
  não atendem ao objetivo da Story.

## Checklist de tarefas

- [x] **T1 — Adicionar TypeScript e configurações strict separadas**
  - Owner: Dinesh Chugtai
  - Execution: sequential
  - Depends on: STORY-002
  - Done when: as dependências necessárias estão pinadas no manifesto e
    lockfile, `tsconfig.json` referencia `tsconfig.app.json` e
    `tsconfig.node.json`, e ambas as configurações têm `strict: true` e
    `noEmit: true` com os arquivos corretos incluídos.
- [x] **T2 — Migrar o bootstrap e expor o typecheck**
  - Owner: Dinesh Chugtai
  - Execution: sequential
  - Depends on: T1
  - Done when: o entrypoint mínimo do runtime está em TypeScript/TSX, o script
    `typecheck` verifica app e Vite, e o código passa sem suprimir erros de
    tipagem ou adicionar domínio.
- [x] **T3 — Validar strict, regressões e limite da Story**
  - Owner: Felicity Smoak
  - Execution: sequential
  - Depends on: T2
  - Done when: o Test Plan confirma typecheck positivo e negativo, cobertura
    do app e da configuração Vite, ausência de emissão, regressão do runtime e
    hook, escopo do diff e ausência de secrets.

Todas as tarefas são sequenciais porque compartilham o manifesto, as
configurações TypeScript, o bootstrap e a validação do runtime anterior.

## Plano de testes

Roteiro fixo de review — finalizado pelo `flox-dev-story` ao concluir a
implementação, antes de mover a Story para `review`. É o único escopo que o
code review (STEM) verifica; cada check mapeia a um critério de aceitação.

- [x] **Check 1 — Dependências e lockfile, mapeado ao AC-001**
  - Passos: executar instalação limpa com o npm declarado e inspecionar o
    manifesto e o lockfile antes e depois.
  - Resultado esperado: TypeScript e tipos necessários são instalados com
    versões explícitas, o lockfile permanece sincronizado e o tooling anterior
    é preservado.
  - Evidência (flox-dev-story): `npm install` (Node v22.12.0, npm 10.9.0) exit
    0. `package.json` fixa `typescript@7.0.2`, `@types/react@19.2.18`,
    `@types/react-dom@19.2.7`; `packageManager`, `prepare`, `engines` e as
    dependências anteriores (react/react-dom 19.2.8, vite 8.2.2, plugin-react
    6.1.1, commitlint 21.2.2, lefthook 2.1.12) preservados. `package-lock.json`
    permanece `lockfileVersion: 3`. Confirmado em 2026-09-03.
- [x] **Check 2 — Configuração strict efetiva, mapeado ao AC-002**
  - Passos: executar `tsc --showConfig -p tsconfig.app.json` e
    `tsc --showConfig -p tsconfig.node.json`, além de inspecionar os includes.
  - Resultado esperado: ambas as configurações mostram `strict: true` e
    `noEmit: true`, cobrindo o código React e `vite.config.ts` sem verificar
    fontes inexistentes ou fora do escopo.
  - Evidência (flox-dev-story): `--showConfig` do app → `strict: true`,
    `noEmit: true`, `jsx: react-jsx`, `files: ['./src/main.tsx']`; do node →
    `strict: true`, `noEmit: true`, `files: ['./vite.config.ts']`. `tsconfig.json`
    raiz apenas referencia ambos (`files: []`), sem regras de domínio.
    Confirmado em 2026-09-03.
- [x] **Check 3 — Typecheck positivo e negativo, mapeado ao AC-003**
  - Passos: executar `npm run typecheck` e, em cópia temporária, introduzir
    uma incompatibilidade ou `implicit any` no app e na configuração Vite.
  - Resultado esperado: o scaffold passa sem emitir arquivos; cada erro
    temporário faz o comando falhar com diagnóstico localizável.
  - Evidência (flox-dev-story): `npm run typecheck` no scaffold → exit 0, sem
    arquivos gerados (nenhum `.js`, `.d.ts` ou `.tsbuildinfo`). Erro temporário
    no app → `src/main.tsx(15,7): error TS2322` (falha). Erro temporário no
    Vite → `vite.config.ts(8,7): error TS2322` (falha). Após reverter, typecheck
    volta a exit 0. Confirmado em 2026-09-03.
- [x] **Check 4 — Bootstrap sem domínio, mapeado ao AC-004**
  - Passos: inspecionar o diff e a entrada TypeScript/TSX, verificando o
    carregamento da raiz e a ausência de supressões de erro.
  - Resultado esperado: o placeholder React compila sob strict sem rotas,
    rede, estado remoto ou comportamento de produto.
  - Evidência (flox-dev-story): `src/main.tsx` monta o mesmo placeholder
    `<div data-testid="app-root">Postify</div>` via `createRoot`, com narrowing
    do `#root` por early `throw` (sem `any`, `!` ou `@ts-ignore`). Compila sob
    strict (Check 3). `index.html` aponta para `/src/main.tsx`. Sem rotas,
    estado, rede ou domínio. Confirmado em 2026-09-03.
- [x] **Check 5 — Regressão do runtime e hook, mapeado ao AC-005**
  - Passos: executar `dev`, `build`, `preview`, `prepare` e a verificação do
    hook `commit-msg` em ambiente temporário.
  - Resultado esperado: a raiz continua funcionando, o build e preview passam,
    e Commitlint/Lefthook mantêm o comportamento da STORY-001.
  - Evidência (flox-dev-story): `npm run build` → 14 módulos, `dist/` gerado em
    ~52ms. `npm run dev` → "VITE v8.2.2 ready in 75ms" (Local em :5188).
    `vite preview` → serve `dist/` (Local em :4181). `npm run prepare` →
    lefthook `sync hooks ✔️(commit-msg)`. Commitlint: mensagem de 1 linha exit 0;
    mensagem com body → `body must be empty [body-empty]`. Nota: a conexão HTTP
    de loopback do `curl` falha no sandbox (exit 7) por restrição de rede; o
    boot limpo dos servidores e o build comprovam operação. Confirmado em
    2026-09-03.
- [x] **Check 6 — Escopo e secrets, mapeado ao AC-006**
  - Passos: revisar `git diff --name-only`, dependências e conteúdo alterado;
    executar a varredura de secrets disponível no projeto.
  - Resultado esperado: somente arquivos autorizados aparecem, nenhum secret é
    encontrado e não há roteamento, qualidade posterior, backend, PWA ou
    domínio.
  - Evidência (flox-dev-story): diff fora de `.flox/` = `package.json`,
    `package-lock.json`, `tsconfig.json`, `tsconfig.app.json`,
    `tsconfig.node.json`, `index.html`, `src/main.jsx`→`src/main.tsx`,
    `vite.config.js`→`vite.config.ts`. Nenhum React Router, i18n, provider,
    ESLint, Prettier, teste, Supabase, PWA ou domínio. Varredura por padrões de
    secret (api key/token/password/private key/service_role) nos arquivos
    alterados → sem matches. Confirmado em 2026-09-03.

## Referências

- Architecture applicable: yes — [ARCH-001 v1](../../planning/architecture/ARCH-001-postify-foundation-v1.md) fornece TypeScript strict como limite do projeto, a separação entre configuração frontend e Node/Vite, a preferência por contratos locais e a regra de não antecipar domínio ou secrets.
- UX applicable: no — esta Story não cria fluxo, tela, estado visual, responsividade ou comportamento de usuário.
- DS applicable: no — esta Story não cria componentes, tokens, variantes, temas ou contratos visuais.
- Other links: [PRD-001](../../planning/prds/PRD-001-postify-mvp.md), [EPIC-001](../epics/EPIC-001-postify-foundation.md), [STORY-002](STORY-002-inicializar-runtime-frontend.md) e [project-context.md](../../../project-context.md).

## Aprovação

Decision owner: Isaac
Decision: approved
Decided at: 2026-09-03
Justification: Story aprovada explicitamente pelo usuário.

## Code Review ledger

review_anchor: 27ef8ccd91e3dbde9d15f6900c09204ebefdf308
correction_handoffs: 0
findings: []

Rodada 1 (base `develop`...HEAD): STEM revisou o diff completo (código +
resumo do lockfile) estritamente contra o Test Plan e os critérios de
aceitação. Decisão STEM: `pass`. Os 6 checks passam; nenhum achado (block,
concern ou nit). Observações não-bloqueantes registradas pelo STEM: (a) o
script `typecheck` passa `--noEmit` na CLI enquanto os configs já têm
`noEmit: true` — redundante e inofensivo; (b) `typescript@7.0.2` é um pin
incomum, mas com evidência de `npm install` e `typecheck` exit 0 — não é falha
revisável. Nenhuma vira finding.

## Human decision record

decision: approved
decision_owner: Isaac
decided_at: 2026-09-04
justification: STEM retornou `pass` com os 6 checks do Test Plan aprovados e
nenhum achado. A Story habilita TypeScript strict no scaffold (tsconfig app/node
com `strict`+`noEmit`, script `typecheck`, migração do bootstrap para TSX) sem
adicionar domínio, e a regressão de build/dev/preview e dos hooks da STORY-001
foi verificada. `typescript@7.0.2` foi confirmado por `npm view` e pela
instalação/typecheck bem-sucedidos (mesmo padrão da STORY-002 com react/vite),
então a observação do STEM sobre a versão fica aceita como não-bloqueante.
risk_acceptance: nenhum — não há achados a aceitar.

## Risk assessment

result: pentest waived
responsible: Isaac
justification: A mudança é de tooling de desenvolvimento: dependências de tipos
(`typescript`, `@types/react`, `@types/react-dom`), configurações `tsconfig*`
(verificação estática, sem emissão), um script `typecheck` e a migração do
entrypoint mínimo para TSX. Não introduz endpoint, tratamento de entrada de
usuário, execução de conteúdo não confiável, dependência de runtime nova,
credencial ou segredo; o placeholder React permanece sem rotas, rede, estado ou
domínio. Não há superfície de ataque nova.
residual_risk: Baixo. `typescript@7.0.2` é o port nativo (Go) recém-lançado; o
risco residual é de maturidade da ferramenta de verificação, não de segurança —
mitigado por `strict` efetivo (typecheck positivo e negativo comprovados) e sem
impacto no artefato de produção (Vite transpila via esbuild/rolldown, não pelo
tsc).
