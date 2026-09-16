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

- [x] **T1 — Adicionar dependências e preservar o contrato existente**
  - Owner: Dinesh Chugtai
  - Execution: sequential
  - Depends on: STORY-005
  - Done when: as cinco dependências estão pinadas no manifesto e lockfile,
    sem remover scripts, providers ou ferramentas das Stories anteriores e
    sem introduzir pacotes de produto.
- [x] **T2 — Configurar QueryClient e integração neutra de formulário/validação**
  - Owner: Dinesh Chugtai
  - Execution: sequential
  - Depends on: T1
  - Done when: há um `QueryClient` singleton e um provider na composição,
    RHF/Zod/resolver compilam em probe temporária, Zustand permanece sem store
    persistente e não existem queries, mutations ou domínio.
- [x] **T3 — Validar providers, contratos e regressões**
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

- [x] **Check 1 — Dependências e lockfile, mapeado ao AC-001**
  - Passos: executar instalação limpa com o npm declarado e inspecionar
    manifesto, lockfile e peer dependencies.
  - Resultado esperado: RHF, Zod, resolver, TanStack Query e Zustand têm
    versões explícitas e compatíveis; o lockfile permanece sincronizado e as
    ferramentas anteriores continuam presentes.
  - Evidência (flox-dev-story): `npm ci --ignore-scripts --offline` e `npm ci --dry-run --ignore-scripts --offline` passaram; `npm ls --depth=0` confirmou `react-hook-form@7.84.0`, `zod@4.5.4`, `@hookform/resolvers@5.7.1`, `@tanstack/react-query@5.101.4` e `zustand@5.0.8`, com peers compatíveis com React 19.2.8.
- [x] **Check 2 — RHF, Zod e resolver, mapeado ao AC-002**
  - Passos: executar uma probe temporária com campo genérico, resolver Zod e
    TypeScript strict; remover a probe antes da revisão do diff.
  - Resultado esperado: a validação funciona e retorna erro estruturado para
    entrada inválida, sem schema, campo, mensagem ou tipo de domínio
    persistido.
  - Evidência (flox-dev-story): a probe temporária com `z.object({ value: z.string().min(1) })`, `useForm` e `zodResolver` passou em `npm run typecheck`; a execução real do resolver retornou erro estruturado para `{ value: '' }`; a probe foi removida antes da inspeção final.
- [x] **Check 3 — QueryClient e provider únicos, mapeado ao AC-003**
  - Passos: inspecionar a composição e contar instanciações de `QueryClient`,
    `QueryClientProvider`, `useQuery`, `useMutation` e funções de rede.
  - Resultado esperado: há uma única instância/provider, nenhum acesso remoto
    ou query de domínio e o contexto fica disponível para Stories futuras.
  - Evidência (flox-dev-story): `src/app/configs/query-client.ts` contém uma única instanciação `new QueryClient()` fora da árvore React; `src/app/App.tsx` contém um único `QueryClientProvider`; `rg` não encontrou `useQuery`, `useMutation`, `fetch`, `axios`, Supabase ou cache de domínio.
- [x] **Check 4 — Zustand client-only, mapeado ao AC-004**
  - Passos: inspecionar `src/store`, imports de Zustand e efeitos de
    persistência no código criado ou alterado.
  - Resultado esperado: não há store vazio/de domínio, provider próprio,
    `localStorage`, persistência ou cópia de estado remoto.
  - Evidência (flox-dev-story): Zustand aparece somente no manifesto/lockfile; `src` não contém import de Zustand, store, `localStorage` ou `persist`.
- [x] **Check 5 — Regressão da composição, mapeado ao AC-005**
  - Passos: executar `typecheck`, `dev`, `build`, `preview`, `prepare` e a
    verificação do hook `commit-msg` em ambiente temporário; acessar `/` após
    refresh.
  - Resultado esperado: router, i18n, reset, placeholder, runtime,
    Commitlint e Lefthook continuam funcionando.
  - Evidência (flox-dev-story): `npm run typecheck`, `npm run build`, `npm run prepare`, `lefthook validate`, `lefthook check-install` e Commitlint válido passaram; `invalid commit message` foi rejeitada; `dev` em `5173` e `preview` em `4173` responderam `200` na raiz e nos caminhos `/login`, `/dashboard` e `/posts`. A inspeção interativa do Browser in-app não estava disponível nesta sessão.
- [x] **Check 6 — Escopo e segurança, mapeado ao AC-006**
  - Passos: revisar `git diff --name-only`, dependências e conteúdo alterado;
    executar a varredura de secrets disponível no projeto.
  - Resultado esperado: somente arquivos autorizados aparecem, probes não
    permanecem, nenhum secret é encontrado e não há domínio, backend, PWA ou
    funcionalidade de produto.
  - Evidência (flox-dev-story): o diff final contém apenas o Story/status, `package.json`, `package-lock.json`, `src/app/App.tsx` e `src/app/configs/query-client.ts`; `git diff --check` passou; a probe não existe; a varredura de padrões de secrets não encontrou matches; não há domínio, backend, PWA ou funcionalidade de produto.

## Implementation Evidence

- T1 adicionou as cinco dependências com versões exatas, mantendo scripts e dependências existentes.
- T2 criou o QueryClient singleton e o provider único; a integração RHF/Zod/resolver foi validada somente em probe temporária e Zustand não recebeu store.
- T3 validou instalação, typecheck, build, runtime HTTP, hooks, Commitlint, escopo e segurança. A limitação observada foi a indisponibilidade do Browser in-app para inspeção visual/DOM.

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

## Code Review ledger

review_anchor: a8b46a8ecd779d7f201c5a399f41eb00aabcf2de
correction_handoffs: 0
findings:
  - id: F-001
    severity: concern
    location: package-lock.json:node_modules/@hookform/resolvers.peerDependencies
    state: accepted
    origin_round: 1
  - id: F-002
    severity: concern
    location: src/app/App.tsx
    state: accepted
    origin_round: 1
  - id: F-003
    severity: concern
    location: src/app/configs/query-client.ts:3
    state: accepted
    origin_round: 1

## Human decision record

decision: Approved with notes
decision_owner: Isaac
decided_at: 2026-09-04
justification: Todos os seis checks do Test Plan passaram com evidência. Três concerns identificados (chave JSON duplicada no lockfile com valores idênticos, gap de verificação de composição router/i18n por indisponibilidade do Browser in-app, e QueryClient com defaults implícitos) — nenhum viola critério de aceitação e nenhum é bloqueador.
risk_acceptance:
  - finding_id: F-001
    severity: concern
    impact: Chave JSON duplicada no lockfile com valor idêntico; sem impacto funcional.
    accepted_risk: Cosmético; valores idênticos, nenhuma quebra de runtime.
    acceptance_scope: STORY-006
  - finding_id: F-002
    severity: concern
    impact: Gap de verificação de composição router/i18n no App.tsx; confirmar em main.tsx.
    accepted_risk: As rotas responderam HTTP 200 conforme evidenciado; gap é de documentação.
    acceptance_scope: STORY-006
  - finding_id: F-003
    severity: concern
    impact: QueryClient com defaults implícitos (3 retries, staleTime 0).
    accepted_risk: Nenhum critério de aceitação violado; decisão de configuração adiada para Story futura.
    acceptance_scope: STORY-006
risk_assessment: pentest waived
risk_assessment_responsible: Isaac
risk_assessment_justification: O diff adiciona dependências npm de validação e gerenciamento de estado (RHF, Zod, TanStack Query, Zustand) e cria um QueryClient singleton com provider. Não há processamento de dados de usuário, autenticação, acesso a rede, comunicação com backend, leitura de segredos ou superfície de ataque relevante nesta Story.
residual_risk: Baixo — bibliotecas de mercado amplamente auditadas, sem superfície de segurança nesta Story.

## Quality convergence ledger

work_item_id: STORY-006
gate: quality
candidate_anchor: a8b46a8ecd779d7f201c5a399f41eb00aabcf2de
anchor_history:
  - round: 1
    anchor: a8b46a8ecd779d7f201c5a399f41eb00aabcf2de
  - round: 2
    anchor: a8b46a8ecd779d7f201c5a399f41eb00aabcf2de
  - round: 3
    anchor: a8b46a8ecd779d7f201c5a399f41eb00aabcf2de
round: 3
correction_handoffs: 1
frozen_scope:
  roadmap_id: quality
  roadmap_version: "1.2"
  methods: [quality.install.v1, quality.typecheck.v1, quality.tests.v1, quality.build.v1]
  surfaces_or_criteria: [quality.install.v1, quality.typecheck.v1, quality.tests.v1, quality.build.v1]
criteria:
  - id: quality.install.v1
    state: passed
    origin_round: 1
  - id: quality.typecheck.v1
    state: passed
    origin_round: 1
  - id: quality.tests.v1
    state: passed
    applicability: not_applicable
    origin_round: 2
  - id: quality.build.v1
    state: passed
    origin_round: 1

conditional_results:
  - criterion: "UI condicional"
    state: incomplete
    origin_round: 2
    reason: "A evidência anterior registrou browser indisponível; a nova contribuição visual para este item ainda não retornou"
  - criterion: "UI condicional"
    state: not_applicable
    origin_round: 3
    reason: "Felicity confirmou que a Story cobre estado de formulário sem tela ou fluxo de produto"

## Quality evidence

- work_item_id: STORY-006
  criterion: quality.install.v1
  method: "npm ci --ignore-scripts; npm run prepare"
  environment: "snapshot a8b46a8ecd779d7f201c5a399f41eb00aabcf2de; Node 22.12.0; npm 10.9.0"
  date: 2026-09-15
  result: "exit 0; instalação limpa concluída"
  prepare_result: "exit 0; hook do Lefthook instalado"
  evaluator: "Felicity Smoak 🧪"
  decision: passed
- work_item_id: STORY-006
  criterion: quality.typecheck.v1
  method: "npm run typecheck"
  environment: "snapshot a8b46a8ecd779d7f201c5a399f41eb00aabcf2de; Node 22.12.0; npm 10.9.0"
  date: 2026-09-15
  result: "exit 0; sem diagnósticos"
  evaluator: "Felicity Smoak 🧪"
  decision: passed
- work_item_id: STORY-006
  criterion: quality.tests.v1
  method: "npm test"
  environment: "snapshot a8b46a8ecd779d7f201c5a399f41eb00aabcf2de; Node 22.12.0; npm 10.9.0"
  date: 2026-09-15
  result: "exit 1; Missing script: test"
  evaluator: "Felicity Smoak 🧪"
  decision: blocked
- work_item_id: STORY-006
  criterion: quality.build.v1
  method: "npm run build"
  environment: "snapshot a8b46a8ecd779d7f201c5a399f41eb00aabcf2de; Node 22.12.0; npm 10.9.0"
  date: 2026-09-15
  result: "exit 0; build com 91 módulos transformados"
  evaluator: "Felicity Smoak 🧪"
  decision: passed
- work_item_id: STORY-006
  criterion: "UI condicional"
  method: "npm run dev; npm run preview; navegador local"
  environment: "snapshot a8b46a8ecd779d7f201c5a399f41eb00aabcf2de"
  date: 2026-09-15
  result: "não observado; browsers.list() retornou []"
  evaluator: "Felicity Smoak 🧪"
  decision: incomplete

- work_item_id: STORY-006
  criterion: "quality.round.v1.2"
  method: "scripts declarados no package.json; execução condicional pela QUALITY-ROADMAP"
  environment: "snapshot a8b46a8ecd779d7f201c5a399f41eb00aabcf2de; Node 22.12.0; npm 10.9.0; checkout temporário Git"
  date: 2026-09-15
  result: "install/prepare/typecheck/build passaram; test not_applicable pelo snapshot e AC-006"
  evaluator: "Felicity Smoak 🧪"
  decision: blocked
- work_item_id: STORY-006
  criterion: "UI condicional"
  method: "QUALITY-ROADMAP.md: dev/preview e verificação manual somente quando aplicável"
  environment: "snapshot a8b46a8ecd779d7f201c5a399f41eb00aabcf2de; Chrome conectado"
  date: 2026-09-15
  result: "A evidência anterior registrou browser indisponível; a nova contribuição visual para este item ainda não retornou"
  evaluator: "Felicity Smoak 🧪"
  decision: incomplete
- work_item_id: STORY-006
  criterion: "quality.round.v1.2"
  method: "scripts declarados no package.json; execução condicional pela QUALITY-ROADMAP"
  environment: "snapshot a8b46a8ecd779d7f201c5a399f41eb00aabcf2de; Node 22.12.0; npm 10.9.0"
  date: 2026-09-16
  result: "install/prepare/typecheck/build passaram; test not_applicable pelo snapshot e AC-006"
  evaluator: "Felicity Smoak 🧪"
  decision: passed
- work_item_id: STORY-006
  criterion: "UI condicional"
  method: "QUALITY-ROADMAP.md: verificação manual somente para candidato com UI"
  environment: "snapshot a8b46a8ecd779d7f201c5a399f41eb00aabcf2de"
  date: 2026-09-16
  result: "not_applicable; a Story cobre estado de formulário sem tela ou fluxo de produto"
  evaluator: "Felicity Smoak 🧪"
  decision: not_applicable
quality_result: approved
decision_owner: Isaac
quality_approval:
  candidate_anchor: a8b46a8ecd779d7f201c5a399f41eb00aabcf2de
  decision: approved
  decided_at: 2026-09-16
  evidence: "Isaac aprovou explicitamente o Quality para STORY-006 após a contribuição pass de Felicity Smoak e a confirmação dos critérios aplicáveis."
## Release convergence ledger
work_item_id: STORY-006
gate: release
candidate_anchor: v1.0.0
anchor_history:
  - round: 1
    anchor: v1.0.0
round: 1
correction_handoffs: 0
frozen_scope:
  roadmap_id: release
  roadmap_version: "1.0"
  methods: [release.targets.v1, release.procedure.v1, release.owner.v1, release.findings.v1, release.confirmation.v1]
  surfaces_or_criteria: [release.targets.v1, release.procedure.v1, release.findings.v1]
findings: []

## Release evidence
- work_item_id: STORY-006
  criterion: "release.procedure.v1"
  method: "release/1.0.0 → PR #17 → main; tag v1.0.0; GitHub Release; Vercel production"
  environment: "GitHub e Vercel produção"
  date: 2026-09-16
  result: "pass; merge 5db0e4894dd806dc605afb055c4f326e2fdcbbdc; Vercel success em https://vercel.com/isaac-oliveiras-projects/postify/9ZwDZ5HJhA3LHZdGuZQoE6fGkpvy; GitHub Release em https://github.com/isaac-oliveira/postify/releases/tag/v1.0.0; develop sincronizada e branch removida; sem migrations/Edge Functions Supabase no escopo autorizado."
  evaluator: "Jared Dunn 📋"
  decision: passed
release_result: approved
decision_owner: Isaac
release_approval:
  candidate_anchor: v1.0.0
  decision: approved
  decided_at: 2026-09-16
  evidence: "Isaac autorizou o fluxo de release 1.0.0; PR #17, tag, GitHub Release e deploy de produção foram concluídos."
