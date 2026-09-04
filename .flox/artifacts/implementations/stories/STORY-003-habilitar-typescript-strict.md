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

- [ ] **AC-001 — Dependências e configuração:** o manifesto declara versões
  explícitas de `typescript`, `@types/react` e `@types/react-dom` quando
  necessárias ao bootstrap, preserva `packageManager`, `prepare` e as
  dependências anteriores, e o lockfile registra o grafo completo sem
  alterações não relacionadas.
- [ ] **AC-002 — Strict efetivo:** `tsconfig.app.json` e
  `tsconfig.node.json` habilitam `strict: true` e `noEmit: true`, cobrindo o
  código React e a configuração do Vite; `tsconfig.json` raiz referencia as
  configurações sem criar regras de domínio.
- [ ] **AC-003 — Typecheck verificável:** existe um script `typecheck` que
  verifica as configurações da aplicação e do Node/Vite, termina com sucesso
  no scaffold e falha com diagnóstico de arquivo/linha quando uma
  incompatibilidade de tipo ou `implicit any` é introduzida temporariamente.
  A verificação não gera arquivos.
- [ ] **AC-004 — Bootstrap migrado:** o entrypoint mínimo produzido pela
  STORY-002 usa TypeScript/TSX conforme necessário, compila sob strict sem
  `any` ou `@ts-ignore` usados para ocultar erros e continua sem rotas,
  estado, rede ou regras de domínio.
- [ ] **AC-005 — Regressão do runtime e da barreira:** `dev`, `build` e
  `preview` da STORY-002 continuam operacionais, a raiz ainda monta o
  placeholder React e `prepare`, Commitlint e Lefthook da STORY-001 continuam
  instaláveis e funcionais.
- [ ] **AC-006 — Limite da Story:** o diff fica restrito às dependências de
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

- [ ] **T1 — Adicionar TypeScript e configurações strict separadas**
  - Owner: Dinesh Chugtai
  - Execution: sequential
  - Depends on: STORY-002
  - Done when: as dependências necessárias estão pinadas no manifesto e
    lockfile, `tsconfig.json` referencia `tsconfig.app.json` e
    `tsconfig.node.json`, e ambas as configurações têm `strict: true` e
    `noEmit: true` com os arquivos corretos incluídos.
- [ ] **T2 — Migrar o bootstrap e expor o typecheck**
  - Owner: Dinesh Chugtai
  - Execution: sequential
  - Depends on: T1
  - Done when: o entrypoint mínimo do runtime está em TypeScript/TSX, o script
    `typecheck` verifica app e Vite, e o código passa sem suprimir erros de
    tipagem ou adicionar domínio.
- [ ] **T3 — Validar strict, regressões e limite da Story**
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

- [ ] **Check 1 — Dependências e lockfile, mapeado ao AC-001**
  - Passos: executar instalação limpa com o npm declarado e inspecionar o
    manifesto e o lockfile antes e depois.
  - Resultado esperado: TypeScript e tipos necessários são instalados com
    versões explícitas, o lockfile permanece sincronizado e o tooling anterior
    é preservado.
  - Evidência (flox-dev-story): —
- [ ] **Check 2 — Configuração strict efetiva, mapeado ao AC-002**
  - Passos: executar `tsc --showConfig -p tsconfig.app.json` e
    `tsc --showConfig -p tsconfig.node.json`, além de inspecionar os includes.
  - Resultado esperado: ambas as configurações mostram `strict: true` e
    `noEmit: true`, cobrindo o código React e `vite.config.ts` sem verificar
    fontes inexistentes ou fora do escopo.
  - Evidência (flox-dev-story): —
- [ ] **Check 3 — Typecheck positivo e negativo, mapeado ao AC-003**
  - Passos: executar `npm run typecheck` e, em cópia temporária, introduzir
    uma incompatibilidade ou `implicit any` no app e na configuração Vite.
  - Resultado esperado: o scaffold passa sem emitir arquivos; cada erro
    temporário faz o comando falhar com diagnóstico localizável.
  - Evidência (flox-dev-story): —
- [ ] **Check 4 — Bootstrap sem domínio, mapeado ao AC-004**
  - Passos: inspecionar o diff e a entrada TypeScript/TSX, verificando o
    carregamento da raiz e a ausência de supressões de erro.
  - Resultado esperado: o placeholder React compila sob strict sem rotas,
    rede, estado remoto ou comportamento de produto.
  - Evidência (flox-dev-story): —
- [ ] **Check 5 — Regressão do runtime e hook, mapeado ao AC-005**
  - Passos: executar `dev`, `build`, `preview`, `prepare` e a verificação do
    hook `commit-msg` em ambiente temporário.
  - Resultado esperado: a raiz continua funcionando, o build e preview passam,
    e Commitlint/Lefthook mantêm o comportamento da STORY-001.
  - Evidência (flox-dev-story): —
- [ ] **Check 6 — Escopo e secrets, mapeado ao AC-006**
  - Passos: revisar `git diff --name-only`, dependências e conteúdo alterado;
    executar a varredura de secrets disponível no projeto.
  - Resultado esperado: somente arquivos autorizados aparecem, nenhum secret é
    encontrado e não há roteamento, qualidade posterior, backend, PWA ou
    domínio.
  - Evidência (flox-dev-story): —

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
