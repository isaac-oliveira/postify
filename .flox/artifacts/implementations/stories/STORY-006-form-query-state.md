---
id: STORY-006
title: "Configurar React Hook Form, Zod, TanStack Query e Zustand sem estado de domínio"
status: approved
---

# STORY-006 — Configurar React Hook Form, Zod, TanStack Query e Zustand sem estado de domínio

**Status:** approved
**Origem:** [EPIC-001 — Fundação estrutural do Postify](../epics/EPIC-001-postify-foundation.md)

## História de usuário

Como pessoa desenvolvedora, quero as bibliotecas e fronteiras de estado e
validação preparadas, para que as próximas Stories possam criar formulários e
integrações sem duplicar estado remoto ou antecipar regras de domínio.

## Critérios de aceitação

- [ ] **AC-001 — Dependências reproduzíveis:** o manifesto e o lockfile
  declaram versões explícitas e compatíveis de `react-hook-form`, `zod`,
  `@hookform/resolvers`, `@tanstack/react-query` e `zustand`, preservando as
  dependências, scripts e lockfile das Stories anteriores.
- [ ] **AC-002 — Contrato RHF/Zod neutro:** a integração entre React Hook Form
  e Zod por resolver é compatível com TypeScript strict e pode validar um
  campo genérico em probe temporária; nenhum formulário, schema, mensagem,
  valor padrão ou tipo de domínio permanece no produto.
- [ ] **AC-003 — Query client único:** existe um único `QueryClient` criado
  fora da árvore React em `src/app/configs/query-client.ts` e um único
  `QueryClientProvider` na composição de `src/app`; o cliente fica disponível
  sem `useQuery`, `useMutation`, query key, função de rede ou cache de domínio.
- [ ] **AC-004 — Zustand restrito ao cliente:** Zustand está disponível para
  estado global de cliente futuro, mas não há store vazio ou de domínio,
  provider próprio, persistência, `localStorage` ou duplicação de estado
  remoto nesta Story.
- [ ] **AC-005 — Regressão da composição:** `typecheck`, `dev`, `build` e
  `preview` continuam operacionais, a raiz preserva router, i18n, reset e
  placeholder, e `prepare`, Commitlint e Lefthook continuam funcionando.
- [ ] **AC-006 — Limite da Story:** o diff fica restrito às dependências,
  lockfile, configuração do QueryClient, integração mínima de providers e
  probes temporárias; não inclui schemas ou formulários de produto, queries,
  mutations, Supabase, backend, PWA ou regras de domínio.

## Dependências e riscos

- Depende da implementação e validação das STORY-002, STORY-003, STORY-004 e
  STORY-005, que fornecem runtime, TypeScript, CSS global e composição inicial.
- Consome `ARCH-001 v1`, o contexto do projeto e os limites de EPIC-001.
- O principal risco é criar mais de um `QueryClient`, usar Zustand como cópia
  do backend ou deixar uma probe neutra persistida como se fosse produto.
- Opções de retry, cache e stale time permanecem nos padrões da biblioteca;
  decisões de domínio ficam para Stories posteriores.

## Checklist de tarefas

- [ ] **T1 — Adicionar dependências e preservar o contrato existente**
  - Owner: Dinesh Chugtai
  - Execution: sequential
  - Depends on: STORY-005
  - Done when: as cinco dependências estão pinadas no manifesto e lockfile,
    sem remover scripts, providers ou ferramentas das Stories anteriores e
    sem introduzir pacotes de produto.
- [ ] **T2 — Configurar QueryClient e integração neutra de formulário/validação**
  - Owner: Dinesh Chugtai
  - Execution: sequential
  - Depends on: T1
  - Done when: há um `QueryClient` singleton e um provider na composição,
    RHF/Zod/resolver compilam em probe temporária, Zustand permanece sem store
    persistente e não existem queries, mutations ou domínio.
- [ ] **T3 — Validar providers, contratos e regressões**
  - Owner: Felicity Smoak
  - Execution: sequential
  - Depends on: T2
  - Done when: o Test Plan confirma dependências, provider único, probe
    transitória removida, isolamento de estado, runtime, hook, escopo do diff
    e ausência de secrets.

Todas as tarefas são sequenciais porque compartilham o manifesto, a composição
de providers e a validação dos limites de estado.

## Plano de testes

Roteiro fixo de review — finalizado pelo `flox-dev-story` ao concluir a
implementação, antes de mover a Story para `review`. É o único escopo que o
code review (STEM) verifica; cada check mapeia a um critério de aceitação.

- [ ] **Check 1 — Dependências e lockfile, mapeado ao AC-001**
  - Passos: executar instalação limpa com o npm declarado e inspecionar
    manifesto, lockfile e peer dependencies.
  - Resultado esperado: RHF, Zod, resolver, TanStack Query e Zustand têm
    versões explícitas e compatíveis; o lockfile permanece sincronizado e as
    ferramentas anteriores continuam presentes.
  - Evidência (flox-dev-story): —
- [ ] **Check 2 — RHF, Zod e resolver, mapeado ao AC-002**
  - Passos: executar uma probe temporária com campo genérico, resolver Zod e
    TypeScript strict; remover a probe antes da revisão do diff.
  - Resultado esperado: a validação funciona e retorna erro estruturado para
    entrada inválida, sem schema, campo, mensagem ou tipo de domínio
    persistido.
  - Evidência (flox-dev-story): —
- [ ] **Check 3 — QueryClient e provider únicos, mapeado ao AC-003**
  - Passos: inspecionar a composição e contar instanciações de `QueryClient`,
    `QueryClientProvider`, `useQuery`, `useMutation` e funções de rede.
  - Resultado esperado: há uma única instância/provider, nenhum acesso remoto
    ou query de domínio e o contexto fica disponível para Stories futuras.
  - Evidência (flox-dev-story): —
- [ ] **Check 4 — Zustand client-only, mapeado ao AC-004**
  - Passos: inspecionar `src/store`, imports de Zustand e efeitos de
    persistência no código criado ou alterado.
  - Resultado esperado: não há store vazio/de domínio, provider próprio,
    `localStorage`, persistência ou cópia de estado remoto.
  - Evidência (flox-dev-story): —
- [ ] **Check 5 — Regressão da composição, mapeado ao AC-005**
  - Passos: executar `typecheck`, `dev`, `build`, `preview`, `prepare` e a
    verificação do hook `commit-msg` em ambiente temporário; acessar `/` após
    refresh.
  - Resultado esperado: router, i18n, reset, placeholder, runtime,
    Commitlint e Lefthook continuam funcionando.
  - Evidência (flox-dev-story): —
- [ ] **Check 6 — Escopo e segurança, mapeado ao AC-006**
  - Passos: revisar `git diff --name-only`, dependências e conteúdo alterado;
    executar a varredura de secrets disponível no projeto.
  - Resultado esperado: somente arquivos autorizados aparecem, probes não
    permanecem, nenhum secret é encontrado e não há domínio, backend, PWA ou
    funcionalidade de produto.
  - Evidência (flox-dev-story): —

## Referências

- Architecture applicable: yes — [ARCH-001 v1](../../planning/architecture/ARCH-001-postify-foundation-v1.md) define TanStack Query como fonte de estado remoto, restringe Zustand ao estado global de cliente necessário e orienta React Hook Form/Zod nas fronteiras de validação, sem domínio nesta Story.
- UX applicable: no — esta Story não cria fluxo, tela, estado visual ou conteúdo de usuário.
- DS applicable: no — esta Story não cria componentes, tokens, variantes, temas ou contratos visuais.
- Other links: [PRD-001](../../planning/prds/PRD-001-postify-mvp.md), [EPIC-001](../epics/EPIC-001-postify-foundation.md), [STORY-005](STORY-005-namespaces-router-i18n.md) e [project-context.md](../../../project-context.md).

## Aprovação

Decision owner: Isaac
Decision: approved
Decided at: 2026-09-03
Justification: Story aprovada explicitamente pelo usuário.
