---
id: STORY-010
title: "Usar aliases curtos no CSS, Tailwind e Ant Design"
status: approved
---

# STORY-010 — Usar aliases curtos no CSS, Tailwind e Ant Design

**Status:** approved
**Origem:** [EPIC-001 — Fundação estrutural do Postify](../epics/EPIC-001-postify-foundation.md)

## História de usuário

Como pessoa desenvolvedora, quero ter os tokens visuais no CSS global com
aliases curtos, para que Tailwind e Ant Design usem os mesmos valores.

## Escopo

`src/global.css` é a fonte única dos valores. Ele contém exatamente 72 custom
properties usando somente `--c-*`, `--s-*`, `--r-*`, `--fs-*`, `--fw-*` e `--lh-*`.

Tailwind usa `@theme` no próprio `global.css`. `src/app/configs/antd-theme.ts`
usa `var(...)` para referenciar essas mesmas propriedades e é aplicado no
`ConfigProvider` raiz.

Não há `tokens.ts`, script de geração, plugin customizado, arquivo intermediário,
valores duplicados, componentes, telas ou comportamento de produto.

## Aliases obrigatórios

| Nome CSS | Valor atual |
|---|---|
| `--c-primary-500` | `#6366F1` |
| `--s-md` | `12px` |
| `--r-md` | `8px` |
| `--fs-md` | `16px` |
| `--fw-bold` | `700` |
| `--lh-md` | `24px` |

As medidas usam `px`; pesos são unitless; cores preservam alpha.

## Critérios de aceitação

- [ ] **AC-001 — CSS global:** `global.css` contém as 72 propriedades curtas, sem qualquer propriedade legada ou arquivo de tokens paralelo.
- [ ] **AC-002 — Tailwind:** o `@theme` de `global.css` expõe os namespaces de cor, spacing, texto, radius, peso e line-height referenciando as propriedades curtas.
- [ ] **AC-003 — Ant Design:** `antd-theme.ts` usa referências `var(--c-*)` para todos os tokens de cor (string-typed) e literais numéricos para tokens dimensionais (antd realiza aritmética CSS-in-JS nesses valores); o `ConfigProvider` raiz recebe esse tema.
- [ ] **AC-004 — Regressão:** typecheck, testes, build, dev, preview e instalação limpa continuam funcionando; reset, foco visível e reduced motion permanecem intactos.

## Checklist de tarefas

- [x] **T1 — Definir os aliases no CSS global**
  - Owner: Dinesh Chugtai
  - Done when: os 72 valores e seis padrões estão em `src/global.css`.
- [x] **T2 — Expor os aliases ao Tailwind**
  - Owner: Dinesh Chugtai
  - Done when: `@theme` referencia os aliases curtos e o plugin oficial do Tailwind processa as utilities.
- [x] **T3 — Conectar o Ant Design**
  - Owner: Dinesh Chugtai
  - Done when: `antd-theme.ts` referencia o CSS global e o tema está no `ConfigProvider` raiz.
- [x] **T4 — Validar a integração**
  - Owner: Felicity Smoak
  - Done when: os checks locais passam e o diff fica limitado ao escopo desta Story.

## Plano de testes

- [x] **Check 1 — Aliases CSS**
  - Evidência: build contém exatamente 72 propriedades curtas únicas (`--c-*`, `--s-*`, `--r-*`, `--fs-*`, `--fw-*`, `--lh-*`), incluindo os seis aliases obrigatórios; sem propriedades legadas.
- [x] **Check 2 — Tailwind**
  - Evidência: `@theme static inline` em `src/styles/tokens.css` contém 72 bridges; utilities apontam para `--c-primary-500`, `--s-md`, `--r-md`, `--fs-md`, `--fw-bold` e `--lh-md`.
- [x] **Check 3 — Ant Design**
  - Evidência: `ThemeConfig` passou no typecheck; tokens de cor usam `var(--c-*)` e tokens dimensionais usam literais numéricos (evitando NaN no CSS-in-JS do antd); `ConfigProvider` está no root de `App`.
- [x] **Check 4 — Regressão**
  - Evidência (rodada de correção): `npm run typecheck` ✓, `npm test -- --run` ✓ (1 arquivo, 1 teste), `npm run build` ✓ (build limpo, 9.58 kB CSS).

## Referências

- Architecture applicable: yes — [ARCH-001 v1](../../planning/architecture/ARCH-001-postify-foundation-v1.md).
- UX applicable: no — não há fluxo ou tela nova.
- DS applicable: no — a Story apenas conecta tokens existentes aos consumidores.
- Other links: [PRD-001](../../planning/prds/PRD-001-postify-mvp.md), [EPIC-001](../epics/EPIC-001-postify-foundation.md) e [project-context.md](../../../project-context.md).
- Technical docs: [Tailwind theme variables](https://tailwindcss.com/docs/theme), [Tailwind Vite](https://tailwindcss.com/docs/installation/using-vite) e [Ant Design theme customization](https://ant.design/docs/react/customize-theme).

## Aprovação

Decision owner: Isaac
Decision: approved
Decided at: 2026-09-04
Justification: Isaac aprovou os aliases curtos e a definição compartilhada no CSS global.

## Human decision record

decision: aprovado com notas
decision_owner: Isaac
decided_at: 2026-09-04
justification: A correção resolveu F-001 (block) e F-002 (concern) da rodada 1. Dois novos concerns foram identificados na rodada 2 — F-003 (Button de teste em App.tsx, fora do escopo da Story) e F-004 (css() avaliado no momento de importação do módulo, correto no runtime atual, frágil em contextos sem DOM) — nenhum deles bloqueia os critérios de aceitação vigentes.

risk_acceptance:
  - finding: F-003
    severity: concern
    impact: Elemento UI morto (Button de teste) no bundle de produção; não exercido por testes.
    accepted_risk: Código de teste temporário aceito explicitamente pelo Isaac durante o desenvolvimento; a ser removido antes de qualquer Story que exponha o App a testes de componente.
    acceptance_scope: STORY-010 apenas
  - finding: F-004
    severity: concern
    impact: css() resolve tokens no momento de importação; retorna strings vazias ou NaN em contextos sem DOM.
    accepted_risk: Runtime atual é browser-only (Vite CSR); CSS é carregado antes da execução do módulo JS. Risco aceito para o escopo atual; padrão a ser documentado antes de replicação.
    acceptance_scope: STORY-010 apenas

risk_assessment: pentest waived
risk_assessment_responsible: Isaac
risk_assessment_justification: Mudança restrita a configuração visual (CSS custom properties, utility de leitura de tokens, ThemeConfig do antd). Sem superfície de autenticação, dados do usuário, chamadas externas ou vetores de injeção.
residual_risk: F-004 pode causar tokens vazios em ambientes sem DOM. Mitigação antes de replicar o padrão.

## Code Review ledger

review_anchor: c084ed7c5387b5909973b10a0491a7d579b7963c
correction_handoffs: 1
findings:
  - id: F-001
    severity: block
    location: src/app/configs/antd-theme.ts:36-49
    state: fixed
    origin_round: 1
  - id: F-002
    severity: concern
    location: src/app/configs/antd-theme.ts:4
    state: fixed
    origin_round: 1
  - id: F-003
    severity: concern
    location: src/app/App.tsx:1,12-14
    state: accepted
    origin_round: 2
  - id: F-004
    severity: concern
    location: src/utils/css.ts:4
    state: accepted
    origin_round: 2

## Quality convergence ledger

work_item_id: STORY-010
gate: quality
candidate_anchor: c084ed7c5387b5909973b10a0491a7d579b7963c
anchor_history:
  - round: 1
    anchor: c084ed7c5387b5909973b10a0491a7d579b7963c
  - round: 2
    anchor: c084ed7c5387b5909973b10a0491a7d579b7963c
  - round: 3
    anchor: c084ed7c5387b5909973b10a0491a7d579b7963c
  - round: 4
    anchor: c084ed7c5387b5909973b10a0491a7d579b7963c
round: 4
correction_handoffs: 0
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
    origin_round: 1
  - id: quality.build.v1
    state: passed
    origin_round: 1

conditional_results:
  - criterion: "UI condicional"
    state: not_applicable
    origin_round: 3
    reason: "Felicity confirmou escopo sem componentes, telas ou comportamento de produto"

## Quality evidence

- work_item_id: STORY-010
  criterion: quality.install.v1
  method: "npm ci --ignore-scripts; npm run prepare"
  environment: "snapshot c084ed7c5387b5909973b10a0491a7d579b7963c; Node 22.12.0; npm 10.9.0"
  date: 2026-09-15
  result: "exit 0; instalação limpa concluída"
  prepare_result: "exit 0; hook do Lefthook instalado"
  evaluator: "Felicity Smoak 🧪"
  decision: passed
- work_item_id: STORY-010
  criterion: quality.typecheck.v1
  method: "npm run typecheck"
  environment: "snapshot c084ed7c5387b5909973b10a0491a7d579b7963c; Node 22.12.0; npm 10.9.0"
  date: 2026-09-15
  result: "exit 0; sem diagnósticos"
  evaluator: "Felicity Smoak 🧪"
  decision: passed
- work_item_id: STORY-010
  criterion: quality.tests.v1
  method: "npm test"
  environment: "snapshot c084ed7c5387b5909973b10a0491a7d579b7963c; Node 22.12.0; npm 10.9.0"
  date: 2026-09-15
  result: "exit 0; 2 arquivos e 5 testes passaram"
  evaluator: "Felicity Smoak 🧪"
  decision: passed
- work_item_id: STORY-010
  criterion: quality.build.v1
  method: "npm run build"
  environment: "snapshot c084ed7c5387b5909973b10a0491a7d579b7963c; Node 22.12.0; npm 10.9.0"
  date: 2026-09-15
  result: "exit 0; build Vite concluído"
  evaluator: "Felicity Smoak 🧪"
  decision: passed
- work_item_id: STORY-010
  criterion: "UI condicional"
  method: "npm run dev; npm run preview; navegador local"
  environment: "snapshot c084ed7c5387b5909973b10a0491a7d579b7963c"
  date: 2026-09-15
  result: "não observado; browsers.list() retornou []"
  evaluator: "Felicity Smoak 🧪"
  decision: incomplete

- work_item_id: STORY-010
  criterion: "UI condicional"
  method: "QUALITY-ROADMAP.md: verificação manual somente para candidato com UI"
  environment: "snapshot c084ed7c5387b5909973b10a0491a7d579b7963c; Chrome conectado; dev e preview locais disponíveis"
  date: 2026-09-15
  result: "snapshot exato exibiu o botão de teste acessível; clique não alterou estado; sem overflow; apenas aviso não bloqueante de Ant Design/React"
  evaluator: "Felicity Smoak 🧪"
  decision: passed

- work_item_id: STORY-010
  criterion: "quality.round.v1.2"
  method: "scripts declarados no package.json; execução condicional pela QUALITY-ROADMAP"
  environment: "snapshot c084ed7c5387b5909973b10a0491a7d579b7963c; Node 22.12.0; npm 10.9.0; checkout temporário Git"
  date: 2026-09-15
  result: "install/prepare/typecheck/test/build passaram; UI not_applicable pelo escopo aprovado"
  evaluator: "Felicity Smoak 🧪"
  decision: pending_approval
- work_item_id: STORY-010
  criterion: "UI condicional"
  method: "QUALITY-ROADMAP.md: dev/preview e verificação manual somente quando aplicável"
  environment: "snapshot c084ed7c5387b5909973b10a0491a7d579b7963c; Chrome conectado"
  date: 2026-09-15
  result: "Felicity confirmou escopo sem componentes, telas ou comportamento de produto"
  evaluator: "Felicity Smoak 🧪"
  decision: not_applicable
quality_result: approved
decision_owner: Isaac
quality_approval:
  candidate_anchor: c084ed7c5387b5909973b10a0491a7d579b7963c
  decision: approved
  decided_at: 2026-09-16
  evidence: "Isaac aprovou explicitamente o candidato após a contribuição pass de Felicity Smoak e os quatro critérios obrigatórios passarem."
## Release convergence ledger
work_item_id: STORY-010
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
- work_item_id: STORY-010
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
