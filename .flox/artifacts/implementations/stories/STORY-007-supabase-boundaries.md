---
id: STORY-007
title: "Estruturar scaffold, cliente Supabase e fronteiras backend sem domínio ou funções executáveis"
status: approved
---

# STORY-007 — Estruturar scaffold, cliente Supabase e fronteiras backend sem domínio ou funções executáveis

**Status:** approved
**Origem:** [EPIC-001 — Fundação estrutural do Postify](../epics/EPIC-001-postify-foundation.md)

## História de usuário

Como pessoa desenvolvedora, quero uma fronteira explícita entre frontend,
Supabase e futuro backend, para que o scaffold seja preparado sem expor
secrets nem introduzir domínio ou execução prematuramente.

## Critérios de aceitação

- [ ] **AC-001 — Scaffold local Supabase:** existe uma configuração local
  versionada em `supabase/config.toml`, sem vínculo remoto, credencial, tabela,
  migration ou seed de domínio; a fronteira `supabase/functions/_shared` é
  materializada apenas quando necessário para preservar a estrutura.
- [ ] **AC-002 — Cliente browser único:** `@supabase/supabase-js` é declarado
  com versão explícita e `src/app/configs/supabase.ts` cria um único cliente
  usando somente `VITE_SUPABASE_URL` e `VITE_SUPABASE_PUBLISHABLE_KEY`, sem
  fallback, log ou request ao importar o módulo; a política abrangente de
  validação de ambiente fica para a STORY-008.
- [ ] **AC-003 — Fronteira backend inerte:** `supabase/functions/_shared`
  permanece reservado para contratos e utilidades backend compartilháveis,
  sem `index.ts` executável, `Deno.serve`, chamada externa, migration, tabela,
  RLS ou policy de produto nesta Story.
- [ ] **AC-004 — Separação de secrets:** o frontend e o bundle não contêm
  service role, JWT secret, `FAL_KEY`, `ANTHROPIC_API_KEY`, senha ou outra chave
  privada; nenhum código frontend importa `_shared` ou API server-only, e
  arquivos `.env` locais são ignorados sem ocultar um eventual exemplo seguro.
- [ ] **AC-005 — Cliente sem domínio:** a configuração Supabase não é usada
  por autenticação, queries, mutations, Storage, Realtime, Edge Function ou
  serviço de produto; o módulo apenas estabelece a fronteira para Stories
  posteriores.
- [ ] **AC-006 — Regressão e limite:** `typecheck`, `dev`, `build` e `preview`
  continuam operacionais, a raiz preserva router, i18n, reset e placeholder,
  o hook da STORY-001 permanece funcional e o diff não contém funcionalidade
  de produto ou execução backend.

## Dependências e riscos

- Depende da implementação e validação das STORY-002 a STORY-006, que fornecem
  runtime, composição, TypeScript strict e providers anteriores.
- Consome `ARCH-001 v1`, o contexto do projeto e os limites de EPIC-001.
- O principal risco é uma variável privada ser incorporada ao bundle ou o CLI
  gerar uma Edge Function executável durante o scaffold.
- A chave pública do Supabase continuará visível no browser por design; Auth,
  RLS, Storage policies e validação abrangente de ambiente permanecem fora
  desta Story.

## Checklist de tarefas

- [x] **T1 — Criar a configuração local e as fronteiras backend inertes**
  - Owner: Dinesh Chugtai
  - Execution: sequential
  - Depends on: STORY-006
  - Done when: `supabase/config.toml` é um scaffold local sem vínculo remoto
    ou secrets, `_shared` possui somente a estrutura necessária e não há
    função, migration, tabela, RLS ou policy de produto.
- [x] **T2 — Configurar o cliente browser com variáveis públicas**
  - Owner: Dinesh Chugtai
  - Execution: sequential
  - Depends on: T1
  - Done when: `@supabase/supabase-js` está pinado, existe um único cliente em
    `src/app/configs/supabase.ts`, apenas as duas variáveis públicas são lidas
    e o import não dispara requests ou logs.
- [x] **T3 — Verificar ameaças de fronteira e exposição**
  - Owner: Elliot Alderson
  - Execution: sequential
  - Depends on: T2
  - Done when: o bundle, código frontend, configuração local e `_shared` não
    contêm secrets, imports server-only, funções executáveis ou chamadas
    externas, e os arquivos `.env` locais estão protegidos.
- [x] **T4 — Validar regressões, escopo e segurança operacional**
  - Owner: Felicity Smoak
  - Execution: sequential
  - Depends on: T3
  - Done when: o Test Plan confirma cliente único, scaffold válido, ausência de
    domínio/backend executável, runtime, hook, diff autorizado e secret scan.

Todas as tarefas são sequenciais porque compartilham a configuração, o cliente,
as fronteiras de segurança e a mesma validação do bundle.

## Plano de testes

Roteiro fixo de review — finalizado pelo `flox-dev-story` ao concluir a
implementação, antes de mover a Story para `review`. É o único escopo que o
code review (STEM) verifica; cada check mapeia a um critério de aceitação.

- [x] **Check 1 — Scaffold local, mapeado ao AC-001**
  - Passos: validar o parse de `supabase/config.toml` e inspecionar a árvore
    `supabase/` e `_shared`.
  - Resultado esperado: a configuração local é válida, não contém vínculo,
    credencial ou domínio, e não há entrypoint executável ou artefato de
    produto.
  - Evidência (flox-dev-story): `python3` parseou `supabase/config.toml` com `project_id=postify`; a árvore contém apenas `config.toml` e `_shared/.gitkeep`, sem migrations, seed ou entrypoint.
- [x] **Check 2 — Cliente público único, mapeado ao AC-002 e AC-005**
  - Passos: inspecionar `src/app/configs/supabase.ts`, contar instanciações e
    verificar o comportamento de importação com variáveis públicas de teste.
  - Resultado esperado: existe uma única instância, somente as variáveis
    públicas são usadas e importar o módulo não faz request, log ou operação
    de domínio.
  - Evidência (flox-dev-story): `@supabase/supabase-js@2.115.0` confirmado por `npm ls`; `src/app/configs/supabase.ts` tem uma instanciação e o probe SSR retornou `client=object`, `fetch=0`, `logs=0`; Graphify e a varredura de referências não encontraram consumidores.
- [x] **Check 3 — Secrets e bundle, mapeado ao AC-004**
  - Passos: executar secret scan no código, configuração e build; inspecionar
    imports de `_shared`, nomes de variáveis Vite e artefatos gerados.
  - Resultado esperado: não há chave privada, service role, API key de IA,
    senha, import server-only ou valor sensível no frontend/bundle.
  - Evidência (flox-dev-story): secret scan do código e bundle passou sem secrets privados; `git check-ignore` confirmou `.env`/`.env.*` ignorados e exemplos liberados; a triagem do bundle classificou os marcadores como código de React/React Router, sem secret.
- [x] **Check 4 — Backend inerte, mapeado ao AC-003**
  - Passos: procurar `index.ts`, `Deno.serve`, `fetch`, migrations, tabelas,
    RLS, policies e chamadas externas na árvore criada.
  - Resultado esperado: `_shared` permanece apenas como fronteira reservada;
    nenhuma função, request ou persistência de domínio existe.
  - Evidência (flox-dev-story): `find` e scans direcionados encontraram zero `index.ts`, `Deno.serve`, `fetch(`, migration, tabela, RLS, policy ou chamada externa em `src`/`supabase`.
- [x] **Check 5 — Regressão do scaffold, mapeado ao AC-006**
  - Passos: executar `typecheck`, `dev`, `build`, `preview`, `prepare` e a
    verificação do hook `commit-msg`; acessar `/` após refresh.
  - Resultado esperado: runtime, router, i18n, reset, placeholder, TypeScript,
    Commitlint e Lefthook continuam funcionando.
  - Evidência (flox-dev-story): `npm run typecheck`, `npm run build`, `npm run prepare` e `git diff --check` passaram; `dev` respondeu 200 em `/` e `preview` respondeu 200 em `/` e nas rotas de fallback verificadas; o hook rejeitou mensagem inválida e aceitou `feat: configure supabase boundary`.
- [x] **Check 6 — Escopo e arquivos locais, mapeado ao AC-004 e AC-006**
  - Passos: revisar `git diff --name-only`, `.gitignore`, dependências e
    conteúdo alterado; verificar que nenhum `.env` real foi incluído.
  - Resultado esperado: somente arquivos autorizados aparecem, ambientes
    locais ficam ignorados, nenhum secret é encontrado e não há produto ou
    backend executável.
  - Evidência (flox-dev-story): o diff contém somente Story/status, `.gitignore`, `package.json`, `package-lock.json`, `src/app/configs/supabase.ts`, `supabase/config.toml` e `_shared/.gitkeep`; nenhum `.env` real foi incluído.

## Referências

- Architecture applicable: yes — [ARCH-001 v1](../../planning/architecture/ARCH-001-postify-foundation-v1.md) define o cliente em `src/app/configs/supabase.ts`, as fronteiras `supabase/functions/_shared`, a separação frontend/backend e a proibição de secrets no frontend.
- UX applicable: no — esta Story não cria fluxo, tela, estado visual ou conteúdo de usuário.
- DS applicable: no — esta Story não cria componentes, tokens, variantes, temas ou contratos visuais.
- Other links: [PRD-001](../../planning/prds/PRD-001-postify-mvp.md), [EPIC-001](../epics/EPIC-001-postify-foundation.md), [STORY-006](STORY-006-form-query-state.md) e [project-context.md](../../../project-context.md).

## Aprovação

Decision owner: Isaac
Decision: approved
Decided at: 2026-09-03
Justification: Isaac aprovou explicitamente esta versão da Story para execução.

## Code Review ledger
review_anchor: fa182e775229457b37d2fd13a51d3da990559b75
correction_handoffs: 0
findings:
  - id: F-001
    severity: concern
    location: .gitignore:6-7
    state: accepted
    origin_round: 1

## Avaliação de risco
Natureza: scaffold de fronteira estrutural — configuração local Supabase, cliente browser com variáveis públicas e barreira inerte em `_shared`. Nenhuma chamada de rede, execução backend, autenticação ou secret no código. Superfície de segurança mínima.
Responsável: Isaac
Decisão: pentest dispensado
Justificativa: O diff não introduz fluxo de autenticação, mutação de dados, Edge Function, policy de RLS, secret no código ou nova superfície de ataque. O único achado (F-001) é uma lacuna de documentação de ambiente, sem impacto de segurança. Risco residual aceito pelo decision owner.
Risco residual: ausência de `.env.example` (DX); sem impacto de segurança.

## Registro de decisão de code review
decision: aprovado com notas
decision_owner: Isaac
decided_at: 2026-09-04
justification: O diff estabelece apenas fronteiras estruturais — scaffold local, cliente com variáveis públicas e barreira inerte em _shared — sem superfície de auth, execução backend ou secret. O achado F-001 (ausência de .env.example) é uma lacuna de DX, não um bloqueador; o slot já está reservado no .gitignore.
risk_acceptance:
  - finding_id: F-001
    severity: concern
    impact: Desenvolvedor clonando o repositório não encontra declaração dos nomes de variáveis necessários; ambos os argumentos de createClient recebem undefined num checkout limpo.
    accepted_risk: Risco de DX aceito para esta Story; .env.example será criado em Story posterior ou tarefa de melhoria.
    acceptance_scope: STORY-007

## Quality convergence ledger

work_item_id: STORY-007
gate: quality
candidate_anchor: fa182e775229457b37d2fd13a51d3da990559b75
anchor_history:
  - round: 1
    anchor: fa182e775229457b37d2fd13a51d3da990559b75
  - round: 2
    anchor: fa182e775229457b37d2fd13a51d3da990559b75
  - round: 3
    anchor: fa182e775229457b37d2fd13a51d3da990559b75
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
    reason: "A evidência anterior registrou browser indisponível; a contribuição visual para este item ainda não retornou"
  - criterion: "UI condicional"
    state: not_applicable
    origin_round: 3
    reason: "Felicity confirmou que a Story cobre apenas fronteiras de configuração, sem tela ou fluxo de produto"

## Quality evidence

- work_item_id: STORY-007
  criterion: quality.install.v1
  method: "npm ci --ignore-scripts; npm run prepare"
  environment: "snapshot fa182e775229457b37d2fd13a51d3da990559b75; Node 22.12.0; npm 10.9.0"
  date: 2026-09-15
  result: "exit 0; instalação limpa concluída"
  prepare_result: "exit 0; hook do Lefthook instalado"
  evaluator: "Felicity Smoak 🧪"
  decision: passed
- work_item_id: STORY-007
  criterion: quality.typecheck.v1
  method: "npm run typecheck"
  environment: "snapshot fa182e775229457b37d2fd13a51d3da990559b75; Node 22.12.0; npm 10.9.0"
  date: 2026-09-15
  result: "exit 0; sem diagnósticos"
  evaluator: "Felicity Smoak 🧪"
  decision: passed
- work_item_id: STORY-007
  criterion: quality.tests.v1
  method: "npm test"
  environment: "snapshot fa182e775229457b37d2fd13a51d3da990559b75; Node 22.12.0; npm 10.9.0"
  date: 2026-09-15
  result: "exit 1; Missing script: test"
  evaluator: "Felicity Smoak 🧪"
  decision: blocked
- work_item_id: STORY-007
  criterion: quality.build.v1
  method: "npm run build"
  environment: "snapshot fa182e775229457b37d2fd13a51d3da990559b75; Node 22.12.0; npm 10.9.0"
  date: 2026-09-15
  result: "exit 0; build Vite concluído"
  evaluator: "Felicity Smoak 🧪"
  decision: passed
- work_item_id: STORY-007
  criterion: "UI condicional"
  method: "npm run dev; npm run preview; navegador local"
  environment: "snapshot fa182e775229457b37d2fd13a51d3da990559b75"
  date: 2026-09-15
  result: "não observado; browsers.list() retornou []"
  evaluator: "Felicity Smoak 🧪"
  decision: incomplete

- work_item_id: STORY-007
  criterion: "quality.round.v1.2"
  method: "scripts declarados no package.json; execução condicional pela QUALITY-ROADMAP"
  environment: "snapshot fa182e775229457b37d2fd13a51d3da990559b75; Node 22.12.0; npm 10.9.0; checkout temporário Git"
  date: 2026-09-15
  result: "install/prepare/typecheck/build passaram; test not_applicable pelo snapshot e AC-006"
  evaluator: "Felicity Smoak 🧪"
  decision: blocked
- work_item_id: STORY-007
  criterion: "UI condicional"
  method: "QUALITY-ROADMAP.md: dev/preview e verificação manual somente quando aplicável"
  environment: "snapshot fa182e775229457b37d2fd13a51d3da990559b75; Chrome conectado"
  date: 2026-09-15
  result: "A evidência anterior registrou browser indisponível; a contribuição visual para este item ainda não retornou"
  evaluator: "Felicity Smoak 🧪"
  decision: incomplete
- work_item_id: STORY-007
  criterion: "quality.round.v1.2"
  method: "scripts declarados no package.json; execução condicional pela QUALITY-ROADMAP"
  environment: "snapshot fa182e775229457b37d2fd13a51d3da990559b75; Node 22.12.0; npm 10.9.0"
  date: 2026-09-16
  result: "install/prepare/typecheck/build passaram; test not_applicable pelo snapshot e AC-006"
  evaluator: "Felicity Smoak 🧪"
  decision: passed
- work_item_id: STORY-007
  criterion: "UI condicional"
  method: "QUALITY-ROADMAP.md: verificação manual somente para candidato com UI"
  environment: "snapshot fa182e775229457b37d2fd13a51d3da990559b75"
  date: 2026-09-16
  result: "not_applicable; a Story cobre apenas fronteiras de configuração, sem tela ou fluxo de produto"
  evaluator: "Felicity Smoak 🧪"
  decision: not_applicable
quality_result: approved
decision_owner: Isaac
quality_approval:
  candidate_anchor: fa182e775229457b37d2fd13a51d3da990559b75
  decision: approved
  decided_at: 2026-09-16
  evidence: "Isaac aprovou explicitamente o Quality para STORY-007 após a contribuição pass de Felicity Smoak e a confirmação dos critérios aplicáveis."
next_action: "executar flox-release"
