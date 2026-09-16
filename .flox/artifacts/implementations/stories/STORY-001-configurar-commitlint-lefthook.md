---
id: STORY-001
title: "Configurar Commitlint e Lefthook como primeira barreira de qualidade local"
status: approved
---

# STORY-001 — Configurar Commitlint e Lefthook como primeira barreira de qualidade local

**Status:** approved
**Source:** [EPIC-001 — Fundação estrutural do Postify](../epics/EPIC-001-postify-foundation.md)

## User Story

Como pessoa desenvolvedora, quero que as mensagens de commit sejam validadas
localmente conforme Conventional Commits, para que o histórico permaneça
consistente e o review humano receba mudanças fáceis de identificar.

## Acceptance Criteria

- [ ] **AC-001 — Bootstrap reproduzível:** o repositório possui um manifesto
  mínimo para as ferramentas desta Story, declara um único package manager e
  mantém o lockfile correspondente, sem depender de instalação global.
- [ ] **AC-002 — Política mínima:** o Commitlint aceita mensagens compatíveis
  com Conventional Commits e rejeita mensagens que não possuam a estrutura
  mínima exigida, sem adicionar regras de domínio ou de produto.
- [ ] **AC-003 — Hook local:** o Lefthook instala de forma idempotente um hook
  `commit-msg` que executa o Commitlint usando a dependência local do projeto.
- [ ] **AC-004 — Bloqueio observável:** um commit inválido feito pelo fluxo
  normal é rejeitado pelo hook, mantém o `HEAD` inalterado e exibe uma mensagem
  compreensível; um commit válido é aceito.
- [ ] **AC-005 — Limite da Story:** o diff contém somente o bootstrap mínimo do
  tooling, configurações e ativação do hook; não inclui React, Vite, TypeScript,
  ESLint, Prettier, testes, CI/CD, proteção de branches ou comportamento de
  produto.
- [ ] **AC-006 — Segurança local:** a instalação e a validação não exigem
  secrets, chamadas externas de produto ou credenciais, e não imprimem valores
  sensíveis.

O bypass explícito com `--no-verify` permanece uma limitação inerente a hooks
locais; ele não será tratado como aprovação da barreira e será coberto como
risco no review.

## Task Checklist

- [ ] **T1 — Criar o bootstrap mínimo do tooling e do lockfile, sem runtime frontend**
  - Owner: Dinesh Chugtai
  - Execution: sequential
  - Depends on: none
  - Done when: o manifesto, o package manager e o lockfile permitem instalar
    as dependências locais do Commitlint e do Lefthook; STORY-002 pode
    completar esse mesmo contrato para Node, React e Vite sem substituir a
    configuração do hook.
- [ ] **T2 — Configurar a política mínima do Commitlint**
  - Owner: Dinesh Chugtai
  - Execution: sequential
  - Depends on: T1
  - Done when: há uma configuração versionada que aceita e rejeita as
    estruturas previstas em AC-002 sem criar regras específicas de produto.
- [ ] **T3 — Integrar e instalar o hook `commit-msg` com Lefthook**
  - Owner: Dinesh Chugtai
  - Execution: sequential
  - Depends on: T2
  - Done when: a instalação pode ser repetida sem duplicar ou corromper o hook,
    e o fluxo normal de commit chama o Commitlint local.
- [ ] **T4 — Validar cenários positivos, negativos, reinstalação e segurança**
  - Owner: Felicity Smoak
  - Execution: sequential
  - Depends on: T3
  - Done when: as evidências do Test Plan confirmam instalação limpa, commit
    válido, commit inválido, hook acionado, bypass explicitamente limitado,
    reinstalação idempotente e ausência de secrets no diff ou na saída.

Todas as tarefas são sequenciais porque compartilham o manifesto, o lockfile,
as configurações do Commitlint, o hook e a mesma validação de commit.

## Test Plan

Roteiro fixo de review — finalizado pelo `flox-dev-story` ao concluir a
implementação, antes de mover a Story para `review`. É o único escopo que o
code review (STEM) verifica; cada check mapeia a um acceptance criterion.

- [ ] **Check 1 — Bootstrap limpo, mapeado ao AC-001**
  - Passos: validar a instalação em um checkout limpo usando apenas o package
    manager declarado pelo projeto.
  - Resultado esperado: dependências locais e hook são instalados sem pacote
    global ou secret.
  - Evidência (dev-story): `npm ci --ignore-scripts` passou no workspace; `npm run prepare` passou no workspace e em repositório temporário, instalando o hook sem dependência global.
- [ ] **Check 2 — Mensagens válida e inválida, mapeado ao AC-002**
  - Passos: executar a validação contra uma mensagem Conventional Commit e uma
    mensagem sem a estrutura mínima.
  - Resultado esperado: a primeira retorna sucesso e a segunda retorna falha
    com diagnóstico compreensível.
  - Evidência (dev-story): `chore: validate local hooks` retornou `0`; `invalid commit message` retornou `1` com `subject-empty` e `type-empty`.
- [ ] **Check 3 — Hook no commit normal, mapeado ao AC-003**
  - Passos: criar um commit válido e um inválido pelo fluxo normal do Git, sem
    chamar o Commitlint manualmente.
  - Resultado esperado: o Lefthook aciona o Commitlint local; o válido passa e
    o inválido é bloqueado.
  - Evidência (dev-story): em repositório temporário, commit válido passou pelo hook e commit inválido foi bloqueado pelo Lefthook.
- [ ] **Check 4 — Histórico preservado, mapeado ao AC-004**
  - Passos: comparar `HEAD` e o histórico antes e depois de uma tentativa de
    commit inválido.
  - Resultado esperado: a tentativa inválida não cria commit e o erro orienta
    a correção da mensagem.
  - Evidência (dev-story): `HEAD` permaneceu inalterado após a tentativa inválida no repositório temporário.
- [ ] **Check 5 — Escopo do diff, mapeado ao AC-005**
  - Passos: inspecionar os arquivos alterados pela Story.
  - Resultado esperado: somente manifesto/lockfile, configuração e ativação do
    tooling aparecem; não há runtime frontend, qualidade posterior, CI/CD ou
    produto.
  - Evidência (dev-story): diff de implementação limitado a `.gitignore`, `package.json`, `package-lock.json`, `commitlint.config.cjs`, `lefthook.yml` e `status.yaml`; a Story foi apenas atualizada com estas evidências, e nenhum arquivo de produto ou CI foi alterado.
- [ ] **Check 6 — Segurança e bypass, mapeado ao AC-006**
  - Passos: repetir a instalação e os commits sem credenciais; observar também
    o comportamento de `--no-verify` como limitação explícita.
  - Resultado esperado: nenhum valor sensível é impresso; o bypass não é
    apresentado como validação e um commit normal continua sujeito ao hook.
  - Evidência (dev-story): varredura de secrets limpa; commit com `--no-verify` passou apenas no repositório temporário e nova mensagem inválida normal voltou a ser bloqueada.

## Implementation Evidence

- T1–T3 executadas pelo owner Dinesh Chugtai: bootstrap mínimo do npm,
  dependências locais de Commitlint/Lefthook, configuração Conventional Commits
  e hook `commit-msg`.
- T4 validada: `npm install --package-lock-only --ignore-scripts`, `npm ci
  --ignore-scripts`, `npm ls --depth=0`, `lefthook validate`,
  `lefthook check-install` e `npm run prepare` passaram; a reinstalação manteve
  o hash `19368623deefd800b6c223292201fe4c3e10e6b5a89e2d543324aad738c7c22f`.
- O teste de commit foi executado em repositório temporário e removido ao final.
  O histórico do Postify não recebeu commits de teste.
- A implementação está na branch `chore/story-001-commitlint-lefthook`, criada
  a partir de `develop` conforme o GIT-ROADMAP.

## References

- Architecture applicable: yes — [ARCH-001 v1](../../planning/architecture/ARCH-001-postify-foundation-v1.md) fornece as fronteiras do scaffold, a separação entre infraestrutura e produto, a preferência por dependências locais e a regra de não expor secrets.
- UX applicable: no — esta Story não cria fluxo, tela, estado de interface, responsividade ou comportamento de usuário.
- DS applicable: no — esta Story não cria componentes, tokens, variantes, temas ou contratos visuais.
- Other links: [PRD-001](../../planning/prds/PRD-001-postify-mvp.md), [EPIC-001](../epics/EPIC-001-postify-foundation.md), [GIT-ROADMAP](../../planning/git/GIT-ROADMAP.md), [QUALITY-ROADMAP](../../planning/quality/QUALITY-ROADMAP.md) e [project-context.md](../../../project-context.md).

## Approval

Decision owner: Isaac
Decision: approved
Decided at: 2026-09-03
Justification: Story aprovada explicitamente pelo usuário.

## Code Review ledger

review_anchor: 49e902f6f91b5a76e9d404f6cd585852fd00f1a9
correction_handoffs: 0
findings: []

## Human decision record

decision: approved
decision_owner: Isaac
decided_at: 2026-09-03
justification: A revisão técnica confirmou os seis checks do Test Plan, sem findings correlacionados e dentro do escopo aprovado.
risk_acceptance: []

## Risk assessment

decision: pentest waived
responsible: Isaac
criteria_applied: A mudança está restrita ao tooling local de commits e não altera frontend, autenticação, autorização, dados, Storage, Edge Functions, webhooks, integrações de IA, PWA ou cache.
justification: O diff não alcança superfícies cobertas pelo roteiro de Pentest e não contém secrets, credenciais ou chamadas externas de produto.
residual_risk: O bypass local com `--no-verify` permanece possível, conforme explicitamente documentado no Story; checks posteriores de CI e revisão de código continuam necessários.

## Quality convergence ledger

work_item_id: STORY-001
gate: quality
candidate_anchor: 49e902f6f91b5a76e9d404f6cd585852fd00f1a9
anchor_history:
  - round: 1
    anchor: 49e902f6f91b5a76e9d404f6cd585852fd00f1a9
  - round: 2
    anchor: 49e902f6f91b5a76e9d404f6cd585852fd00f1a9
  - round: 3
    anchor: 49e902f6f91b5a76e9d404f6cd585852fd00f1a9
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
    applicability: not_applicable
    origin_round: 2
  - id: quality.tests.v1
    state: passed
    applicability: not_applicable
    origin_round: 2
  - id: quality.build.v1
    state: passed
    origin_round: 2

conditional_results:
  - criterion: "UI condicional"
    state: not_applicable
    origin_round: 2
    reason: "AC-005 exclui UI e comportamento de produto"

## Quality evidence

- work_item_id: STORY-001
  criterion: quality.install.v1
  method: "npm ci --ignore-scripts; npm run prepare"
  environment: "snapshot 49e902f6f91b5a76e9d404f6cd585852fd00f1a9; Node 22.12.0; npm 10.9.0"
  date: 2026-09-15
  result: "exit 0; 77 packages added"
  prepare_result: "exit 0; hook do Lefthook instalado"
  evaluator: "Felicity Smoak 🧪"
  decision: passed
- work_item_id: STORY-001
  criterion: quality.typecheck.v1
  method: "npm run typecheck"
  environment: "snapshot 49e902f6f91b5a76e9d404f6cd585852fd00f1a9; Node 22.12.0; npm 10.9.0"
  date: 2026-09-15
  result: "exit 1; Missing script: typecheck"
  evaluator: "Felicity Smoak 🧪"
  decision: blocked
- work_item_id: STORY-001
  criterion: quality.tests.v1
  method: "npm test"
  environment: "snapshot 49e902f6f91b5a76e9d404f6cd585852fd00f1a9; Node 22.12.0; npm 10.9.0"
  date: 2026-09-15
  result: "exit 1; Missing script: test"
  evaluator: "Felicity Smoak 🧪"
  decision: blocked
- work_item_id: STORY-001
  criterion: quality.build.v1
  method: "npm run build"
  environment: "snapshot 49e902f6f91b5a76e9d404f6cd585852fd00f1a9; Node 22.12.0; npm 10.9.0"
  date: 2026-09-15
  result: "exit 1; Missing script: build"
  evaluator: "Felicity Smoak 🧪"
  decision: blocked
- work_item_id: STORY-001
  criterion: "UI condicional"
  method: "navegador local"
  environment: "snapshot 49e902f6f91b5a76e9d404f6cd585852fd00f1a9"
  date: 2026-09-15
  result: "não aplicável; o candidato não possui superfície de UI"
  evaluator: "Felicity Smoak 🧪"
  decision: not_applicable

- work_item_id: STORY-001
  criterion: "quality.round.v1.2"
  method: "scripts declarados no package.json; execução condicional pela QUALITY-ROADMAP"
  environment: "snapshot 49e902f6f91b5a76e9d404f6cd585852fd00f1a9; Node 22.12.0; npm 10.9.0; checkout temporário Git"
  date: 2026-09-15
  result: "install/prepare passaram; typecheck/test/build not_applicable pelo snapshot e AC-005"
  evaluator: "Felicity Smoak 🧪"
  decision: pending_approval
- work_item_id: STORY-001
  criterion: "UI condicional"
  method: "QUALITY-ROADMAP.md: dev/preview e verificação manual somente quando aplicável"
  environment: "snapshot 49e902f6f91b5a76e9d404f6cd585852fd00f1a9; Chrome conectado"
  date: 2026-09-15
  result: "AC-005 exclui UI e comportamento de produto"
  evaluator: "Felicity Smoak 🧪"
  decision: not_applicable
- work_item_id: STORY-001
  criterion: "quality.round.v1.2"
  method: "scripts declarados no package.json; execução condicional pela QUALITY-ROADMAP"
  environment: "snapshot 49e902f6f91b5a76e9d404f6cd585852fd00f1a9; Node 22.12.0; npm 10.9.0"
  date: 2026-09-16
  result: "install/prepare passaram; typecheck/test/build not_applicable pelo snapshot e AC-005"
  evaluator: "Felicity Smoak 🧪"
  decision: passed
- work_item_id: STORY-001
  criterion: "UI condicional"
  method: "QUALITY-ROADMAP.md: verificação manual somente para candidato com UI"
  environment: "snapshot 49e902f6f91b5a76e9d404f6cd585852fd00f1a9"
  date: 2026-09-16
  result: "not_applicable; a Story não possui superfície de UI ou fluxo de produto"
  evaluator: "Felicity Smoak 🧪"
  decision: not_applicable
quality_result: approved
decision_owner: Isaac
quality_approval:
  candidate_anchor: 49e902f6f91b5a76e9d404f6cd585852fd00f1a9
  decision: approved
  decided_at: 2026-09-16
  evidence: "Isaac aprovou explicitamente o Quality para STORY-001 após a contribuição pass de Felicity Smoak e a confirmação dos critérios aplicáveis."
## Release convergence ledger
work_item_id: STORY-001
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
- work_item_id: STORY-001
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
