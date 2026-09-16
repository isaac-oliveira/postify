---
id: STORY-009
title: "Criar mapa simples readonly de tokens"
status: approved
---

# STORY-009 — Criar mapa simples readonly de tokens

**Status:** approved
**Origem:** [EPIC-001 — Fundação estrutural do Postify](../epics/EPIC-001-postify-foundation.md)

## História de usuário

Como pessoa desenvolvedora, quero um mapa simples e somente leitura de todos os
tokens do design, para consumir valores como `tokens.colors.primary[500]` sem
lidar com a estrutura documental do Figma.

## Limites

Inclui somente a extração manual dos 72 valores documentados em
`docs/assets/tokens.json` para `src/app/configs/tokens.ts`. O JSON é apenas
documentação de referência: não deve ser importado, lido, gerado ou acessado
em runtime. O formato público é um objeto simples com os grupos `colors`,
`space`, `fontSize`, `radius`, `fontWeight` e `lineHeight`; cores são strings
`hex` e os demais valores são números. Inclui também um teste unitário isolado
do utilitário compartilhado `deepFreeze`.

Não inclui testes específicos de tokens, preflight, geração, CSS variables,
Tailwind, Ant Design, temas, componentes, telas, layouts, estilos de produto
ou alteração de `docs/assets/tokens.json`.

## Critérios de aceitação

- [ ] **AC-001 — Mapa simples completo:** existe uma única exportação pública `tokens` em `src/app/configs/tokens.ts`, com os seis grupos documentados e 72 folhas consumíveis; cores seguem o formato `tokens.colors.primary[500] === "#6366F1"` e os demais grupos expõem números.
- [ ] **AC-002 — Valores extraídos:** cada folha de `tokens` corresponde ao valor documentado em `docs/assets/tokens.json` — `hex` para cores e `$value` para os demais grupos — sem valores inventados, conversão de unidade ou leitura do JSON pelo código.
- [ ] **AC-003 — Tipagem derivada e imutabilidade:** `tokens` é definido com valores literais readonly, `Tokens` é exportado diretamente como `typeof tokens`, e o congelamento profundo impede mutações superficiais ou aninhadas em runtime; um teste unitário cobre o comportamento recursivo de `deepFreeze`, sem `any`.
- [ ] **AC-004 — Fronteira inerte:** `tokens.ts` não importa nem acessa `docs/assets/tokens.json`, não usa rede, ambiente, escrita, importação dinâmica, `eval`, `Function` ou execução de valores.
- [ ] **AC-005 — Escopo preservado:** o documento JSON permanece inalterado e o diff fica restrito ao mapa de tokens, ao utilitário compartilhado, ao teste unitário e à configuração mínima do runner; não há integração visual ou comportamento de produto.

## Dependências e riscos

- Depende da implementação das STORY-002 a STORY-008, que fornecem o runtime,
  TypeScript strict e o namespace `app`.
- Consome [ARCH-001 v1](../../planning/architecture/ARCH-001-postify-foundation-v1.md)
  e usa `docs/assets/tokens.json` somente como referência documental de
  autoria.
- O risco principal é a divergência entre o mapa extraído e a documentação;
  alterações futuras no JSON exigem uma nova extração manual nesta fronteira.
- A projeção posterior para CSS, Tailwind e Ant Design permanece na STORY-010.

## Checklist de tarefas

- [ ] **T1 — Extrair todos os valores**
  - Owner: Dinesh Chugtai
  - Execution: sequential
  - Depends on: STORY-008
  - Done when: os 72 valores dos seis grupos são registrados em um único objeto simples em `src/app/configs/tokens.ts`.
- [ ] **T2 — Definir readonly e freeze profundo**
  - Owner: Dinesh Chugtai
  - Execution: sequential
  - Depends on: T1
  - Done when: `tokens` usa valores literais readonly, `Tokens` é derivado do valor e exportado, o freeze profundo recursivo impede alterações em runtime e há um teste unitário do utilitário, sem importar ou ler o JSON documental.
- [ ] **T3 — Validar escopo e regressão geral**
  - Owner: Dinesh Chugtai
  - Execution: sequential
  - Depends on: T2
  - Done when: typecheck, testes, build e inspeção do diff confirmam a fronteira única, a fonte documental intacta e a ausência de integração visual ou dependência de runtime nova.

## Plano de testes

Roteiro fixo de review — finalizado pelo `flox-dev-story` ao concluir a
implementação, antes de mover a Story para `review`.

- [ ] **Check 1 — Forma e extração, mapeado ao AC-001 e AC-002**
  - Passos: revisar os seis grupos, contar as 72 folhas e comparar cores e números com a documentação.
  - Resultado esperado: o mapa é simples, completo e contém os valores documentados.
  - Evidência (flox-dev-story): comparação estrutural local confirmou os seis grupos, 72 folhas e correspondência integral com os valores documentados em 2026-09-04.
- [ ] **Check 2 — Tipagem derivada e imutabilidade, mapeado ao AC-003**
  - Passos: executar typecheck e teste unitário, e inspecionar a exportação baseada em `typeof tokens` e o freeze profundo.
  - Resultado esperado: a tipagem acompanha o objeto de valor, o teste confirma o congelamento recursivo e mutações são rejeitadas pelo tipo ou impedidas em runtime.
  - Evidência (flox-dev-story): `npm run typecheck` e `npm test` passaram; Serena não reportou diagnósticos; `Tokens = typeof tokens`, o freeze profundo recursivo via `src/utils/deep-freeze.ts` e seu teste unitário foram confirmados em 2026-09-04.
- [ ] **Check 3 — Limites e fonte, mapeado ao AC-004 e AC-005**
  - Passos: executar build, revisar imports e `git diff --name-only`, e verificar a fonte documental.
  - Resultado esperado: o JSON não é importado nem alterado, e o diff não contém testes específicos de tokens, integração visual ou comportamento de produto.
  - Evidência (flox-dev-story): `npm run build` e `git diff --check` passaram; não há referência a `tokens.json` em `tokens.ts`; a fonte JSON permaneceu intacta e foi criado somente o teste unitário do utilitário.

## Resultado da implementação

- T1–T3 concluídas em `src/app/configs/tokens.ts`.
- `tokens` contém os 72 valores manuais dos seis grupos e exporta somente `Tokens` derivado de `typeof tokens`.
- O objeto usa valores literais readonly e o freeze profundo recursivo reutilizável foi movido para `src/utils/deep-freeze.ts`.
- `src/utils/deep-freeze.test.ts` cobre o congelamento recursivo e o retorno da mesma referência.
- Não foram criados testes específicos de tokens, validator, geração ou dependência de runtime nova.

## Referências

- Architecture applicable: yes — [ARCH-001 v1](../../planning/architecture/ARCH-001-postify-foundation-v1.md) define a fronteira compartilhada em `src/app/configs/` e mantém CSS, Tailwind e Ant Design fora desta Story; o JSON é a referência documental dos 72 valores extraídos.
- UX applicable: no — esta Story não cria fluxo, tela, estado ou interação de produto.
- DS applicable: no — esta Story não cria componentes, props, variantes ou temas.
- Other links: [PRD-001](../../planning/prds/PRD-001-postify-mvp.md), [EPIC-001](../epics/EPIC-001-postify-foundation.md), `docs/assets/tokens.json` e [project-context.md](../../../project-context.md).

## Aprovação

Decision owner: Isaac
Decision: approved
Decided at: 2026-09-04
Justification: Isaac aprovou explicitamente esta versão, com `Tokens` derivado de `typeof tokens` e sem exportação separada para `ColorTokens`.

## Code Review ledger

review_anchor: ed8f7b728f75759f5d030bfa9bb26f96298316b7
correction_handoffs: 0
findings: []

## Human decision record

decision: approved
decision_owner: Isaac
decided_at: 2026-09-04
justification: Todos os três checks do Test Plan passaram sem bloqueadores. Os 72 tokens dos seis grupos estão presentes no diff; tipagem derivada e freeze profundo confirmados; fronteira inerte sem importação do JSON documental.
risk_acceptance: []

## Avaliação de risco

A mudança introduz dois novos arquivos de utilitário e configuração (`deep-freeze.ts`, `tokens.ts`) e um teste unitário, sem superfície de segurança: não há importação de JSON em runtime, sem rede, sem eval, sem segredos, sem dependência de ambiente. O vitest é adicionado apenas como devDependency.

Pentest waived — responsible: Isaac; justification: a fronteira é estritamente inerte (somente literais e função pura de congelamento), sem vetor de injeção, autenticação, I/O externo ou dados sensíveis; risco residual: possível divergência futura entre o mapa manual e a fonte documental JSON, mitigável por revisão visual na próxima extração.

## Quality convergence ledger

work_item_id: STORY-009
gate: quality
candidate_anchor: ed8f7b728f75759f5d030bfa9bb26f96298316b7
anchor_history:
  - round: 1
    anchor: ed8f7b728f75759f5d030bfa9bb26f96298316b7
  - round: 2
    anchor: ed8f7b728f75759f5d030bfa9bb26f96298316b7
  - round: 3
    anchor: ed8f7b728f75759f5d030bfa9bb26f96298316b7
round: 3
correction_handoffs: 2
frozen_scope:
  roadmap_id: quality
  roadmap_version: "1.2"
  methods: [quality.install.v1, quality.typecheck.v1, quality.tests.v1, quality.build.v1]
  surfaces_or_criteria: [quality.install.v1, quality.typecheck.v1, quality.tests.v1, quality.build.v1]
criteria:
  - id: quality.install.v1
    state: failed
    origin_round: 2
  - id: quality.typecheck.v1
    state: pending
    origin_round: 2
  - id: quality.tests.v1
    state: pending
    origin_round: 2
  - id: quality.build.v1
    state: pending
    origin_round: 2

conditional_results:
  - criterion: "UI condicional"
    state: blocked_by_install
    origin_round: 2
    reason: "A instalação falhou antes da validação de UI"
  - criterion: "UI condicional"
    state: blocked_by_install
    origin_round: 3
    reason: "A instalação do candidato exato continua falhando antes da validação de UI"

## Quality evidence

- work_item_id: STORY-009
  criterion: quality.install.v1
  method: "npm ci --ignore-scripts; npm run prepare"
  environment: "snapshot ed8f7b728f75759f5d030bfa9bb26f96298316b7; Node 22.12.0; npm 10.9.0"
  date: 2026-09-15
  result: "exit 1; package.json e package-lock.json fora de sincronia; @types/node@26.5.1 e undici-types@8.9.0 ausentes do lockfile"
  prepare_result: "exit 127; lefthook não encontrado após a instalação falhar"
  evaluator: "Felicity Smoak 🧪"
  decision: blocked
- work_item_id: STORY-009
  criterion: quality.typecheck.v1
  method: "npm run typecheck"
  environment: "snapshot ed8f7b728f75759f5d030bfa9bb26f96298316b7; Node 22.12.0; npm 10.9.0"
  date: 2026-09-15
  result: "exit 127; tsc não encontrado após a instalação falhar"
  evaluator: "Felicity Smoak 🧪"
  decision: blocked
- work_item_id: STORY-009
  criterion: quality.tests.v1
  method: "npm test"
  environment: "snapshot ed8f7b728f75759f5d030bfa9bb26f96298316b7; Node 22.12.0; npm 10.9.0"
  date: 2026-09-15
  result: "exit 127; vitest não encontrado após a instalação falhar"
  evaluator: "Felicity Smoak 🧪"
  decision: blocked
- work_item_id: STORY-009
  criterion: quality.build.v1
  method: "npm run build"
  environment: "snapshot ed8f7b728f75759f5d030bfa9bb26f96298316b7; Node 22.12.0; npm 10.9.0"
  date: 2026-09-15
  result: "exit 127; vite não encontrado após a instalação falhar"
  evaluator: "Felicity Smoak 🧪"
  decision: blocked
- work_item_id: STORY-009
  criterion: "UI condicional"
  method: "npm run dev; npm run preview; navegador local"
  environment: "snapshot ed8f7b728f75759f5d030bfa9bb26f96298316b7"
  date: 2026-09-15
  result: "não observado; browsers.list() retornou [] e a instalação falhou"
  evaluator: "Felicity Smoak 🧪"
  decision: incomplete

- work_item_id: STORY-009
  criterion: "quality.round.v1.2"
  method: "scripts declarados no package.json; execução condicional pela QUALITY-ROADMAP"
  environment: "snapshot ed8f7b728f75759f5d030bfa9bb26f96298316b7; Node 22.12.0; npm 10.9.0; checkout temporário Git"
  date: 2026-09-15
  result: {"install":["failed","failed"],"typecheck":["failed","pending"],"test":["failed","pending"],"build":["failed","pending"]}
  evaluator: "Felicity Smoak 🧪"
  decision: blocked
- work_item_id: STORY-009
  criterion: "UI condicional"
  method: "QUALITY-ROADMAP.md: dev/preview e verificação manual somente quando aplicável"
  environment: "snapshot ed8f7b728f75759f5d030bfa9bb26f96298316b7; Chrome conectado"
  date: 2026-09-15
  result: "A instalação falhou antes da validação de UI"
  evaluator: "Felicity Smoak 🧪"
  decision: blocked
- work_item_id: STORY-009
  criterion: quality.install.v1
  method: "npm ci --ignore-scripts"
  environment: "snapshot ed8f7b728f75759f5d030bfa9bb26f96298316b7; Node 22.12.0; npm 10.9.0; checkout temporário Git"
  date: 2026-09-16
  result: "exit 1; package.json e package-lock.json fora de sincronia; faltam @types/node@22.20.3 e undici-types@6.21.0 no lockfile"
  evaluator: "Felicity Smoak 🧪"
  decision: blocked
- work_item_id: STORY-009
  criterion: "quality.round.v1.2"
  method: "scripts declarados no package.json; execução condicional pela QUALITY-ROADMAP"
  environment: "snapshot ed8f7b728f75759f5d030bfa9bb26f96298316b7; Node 22.12.0; npm 10.9.0; checkout temporário Git"
  date: 2026-09-16
  result: "quality.install.v1 continua falhando antes de prepare, typecheck, tests, build e UI; correction_handoffs já está em 2"
  evaluator: "Felicity Smoak 🧪"
  decision: blocked
quality_result: approved
decision_owner: Isaac
quality_override:
  candidate_anchor: ed8f7b728f75759f5d030bfa9bb26f96298316b7
  decision_owner: Isaac
  decision: approved
  scope: "STORY-009; quality.install.v1 e os critérios dependentes deste candidato"
  justification: "Isaac determinou override humano explícito e aceitou o risco de prosseguir apesar da falha de sincronização entre package.json e package-lock.json."
  evidence: "npm ci --ignore-scripts falhou com package.json/package-lock.json fora de sincronia; faltam @types/node@22.20.3 e undici-types@6.21.0 no lockfile; correction_handoffs permanece em 2."
  decided_at: 2026-09-16
## Release convergence ledger
work_item_id: STORY-009
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
- work_item_id: STORY-009
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
