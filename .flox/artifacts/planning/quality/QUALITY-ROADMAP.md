# Roteiro de Quality — Postify

## Objetivo e escopo

Avaliar cada `work_item` roteado para Quality depois de Code Review ou Pentest,
mantendo evidências e decisões independentes por `work_item_id`. O candidato
é o estado revisado indicado pelo item e seu `review_anchor`; o gate não
avalia um release global nem combina aprovações entre itens.

Os critérios confirmados para cada candidato são avaliados conforme os comandos
existentes no `package.json` daquele snapshot:

- `quality.install.v1`: instalar as dependências no ambiente local com `npm ci --ignore-scripts` e verificar a instalação do tooling com `npm run prepare` quando o script existir.
- `quality.typecheck.v1`: executar `npm run typecheck` quando o candidato declarar esse script; caso contrário, registrar `not_applicable` quando a ausência estiver dentro do escopo aprovado.
- `quality.tests.v1`: executar `npm test` quando o candidato declarar esse script; caso contrário, registrar `not_applicable` quando a ausência estiver dentro do escopo aprovado.
- `quality.build.v1`: executar `npm run build` quando o candidato declarar esse script; caso contrário, registrar `not_applicable` quando a ausência estiver dentro do escopo aprovado.

## Critérios condicionais

- Lint não é aplicável até que ESLint e um script `npm run lint` sejam
  adicionados ao projeto. Isso é uma condição confirmada do estado atual, não
  uma dispensa de um critério existente.
- E2E só é aplicável quando Playwright, sua configuração e um cenário relevante
  existirem no candidato. A ausência atual de Playwright torna o critério não
  aplicável neste estado.
- Fluxo principal, console, estados loading/vazio/erro, acessibilidade básica e
  responsividade são verificados manualmente em navegador local quando o
  candidato possuir superfície de UI. Para candidatos sem UI ou fluxo de
  usuário, são não aplicáveis com evidência do escopo do candidato.
- CI só é aplicável quando existir workflow em `.github/workflows/`. Até lá, a
  execução local é o ambiente confirmado; CI não é simulada nem substituída.
- Testes de componentes ficam fora do escopo do MVP.

## Ambientes e procedimento

O ambiente local usa Node 22.12.0, npm e as dependências fixadas no manifesto e
lockfile. A sequência local é:

1. `npm ci --ignore-scripts`
2. `npm run prepare`, quando disponível no candidato
3. inspecionar os scripts declarados pelo candidato
4. executar `npm run typecheck`, `npm test` e `npm run build` somente quando cada script estiver disponível; registrar a não aplicabilidade justificada quando não estiver

Para um candidato com UI, iniciar `npm run dev` e, após o build, `npm run
preview`; abrir a superfície relevante em navegador local e observar fluxo,
console, estados declarados pelo candidato, acessibilidade básica e
responsividade em viewport estreito e largo. Não inventar cenários para
Stories sem UI.

Quando CI, Playwright ou outro critério condicional se tornar aplicável, o
Setup deve revisar este roadmap e registrar o comando ou procedimento
específico antes de uma nova avaliação. Serviços externos devem usar mocks
quando o cenário não exigir serviço real.

## Evidências, aprovação e reexecução

Para cada critério aplicável, registrar no Story do mesmo `work_item_id` o
identificador, método, ambiente, data, resultado observável, evaluator,
evidência e decisão. Critérios condicionais não aplicáveis também recebem a
justificativa observável da condição que os exclui. O resultado é `approve`
somente quando todos os critérios obrigatórios e condicionais aplicáveis
passarem, a evidência estiver completa e Isaac aprovar exatamente o candidato.
A ausência de um script não é uma falha quando ela é suportada pelo escopo
aprovado do snapshot e registrada como `not_applicable`; não é uma dispensa de
um check existente.

Não há dispensa para falhas. Uma falha em instalação, prepare disponível ou
check aplicável bloqueia a aprovação e deve ser corrigida antes de nova
avaliação. Reexecutar somente o critério corrigido e os critérios diretamente
afetados após mudança de código, configuração, dependência, schema, Edge
Function, integração, fluxo ou ambiente aplicável.

<!-- flox-roadmap-contract schema=1
version = "1.2"
roadmap_id = "quality"
decision_ids = ["quality.criteria.v2", "quality.environments.v2", "quality.boundaries.v2", "quality.owner.v1", "quality.procedure.v2", "quality.evidence.v2", "quality.findings.v2", "quality.confirmation.v2"]
field_decisions = { objective = { decision_id = "quality.criteria.v2", evidence = "docs/prompt-setup.md; .flox/project-context.md", value_id = "Avaliar cada work_item roteado para Quality com critérios executáveis e evidência independente por work_item_id." }, scope = { decision_id = "quality.criteria.v2", evidence = "package.json; .flox/artifacts/status.yaml; .flox/project-context.md; confirmação explícita em 2026-09-15", value_id = "Cada work_item roteado para Quality depois de Code Review ou Pentest; quality.install.v1 permanece aplicável para instalação e prepare disponível; quality.typecheck.v1, quality.tests.v1 e quality.build.v1 são aplicáveis somente quando seus scripts existirem no candidato, com lint, E2E, UI e CI condicionais ao estado do candidato." }, prerequisites = { decision_id = "quality.environments.v2", evidence = "package.json; .nvmrc; .npmrc; snapshots registrados nos ledgers", value_id = "Node 22.12.0, npm, package.json e package-lock.json do candidato; scripts são admitidos conforme declarados em cada snapshot." }, environments = { decision_id = "quality.environments.v2", evidence = "confirmação explícita em 2026-09-15", value_id = "Execução local obrigatória; CI somente quando existir workflow em .github/workflows; navegador local somente para candidatos com UI; Playwright somente quando configuração e cenário relevante existirem." }, authorized_boundaries = { decision_id = "quality.boundaries.v2", evidence = ".flox/project-context.md; docs/prompt-setup.md", value_id = "Avaliar somente o candidato e os arquivos autorizados do Postify; usar mocks para serviços externos quando possível; não exigir testes de componentes; não simular CI, E2E ou UI em candidatos sem a superfície correspondente." }, responsible = { decision_id = "quality.owner.v1", evidence = ".flox/config.toml; confirmação explícita em 2026-09-03", value_id = "Isaac." }, approvals = { decision_id = "quality.findings.v2", evidence = ".flox/config.toml; confirmação explícita em 2026-09-15", value_id = "Isaac aprova o resultado do Quality gate para o work_item_id e candidato exatos." }, procedure = { decision_id = "quality.procedure.v2", evidence = "package.json; .flox/project-context.md; confirmação explícita em 2026-09-15", value_id = "Executar npm ci --ignore-scripts; executar npm run prepare quando disponível; inspecionar os scripts do candidato; executar npm run typecheck, npm test e npm run build somente quando o respectivo script estiver disponível; registrar not_applicable com evidência de escopo quando ausente; executar npm run dev e npm run preview e verificar manualmente UI, console, estados, acessibilidade e responsividade somente quando aplicável; CI e Playwright somente quando configurados e aplicáveis." }, evidence = { decision_id = "quality.evidence.v2", evidence = ".flox/project-context.md; confirmação explícita em 2026-09-15", value_id = "Registrar work_item_id, critério, método, ambiente, data, resultado observável, evaluator, evidência, decisão e justificativa de não aplicabilidade quando houver." }, approval_waiver_criteria = { decision_id = "quality.findings.v2", evidence = "confirmação explícita em 2026-09-15", value_id = "Não há dispensa para falhas aplicáveis; a ausência de um script é not_applicable somente quando suportada pelo escopo aprovado do snapshot e registrada com evidência, não sendo uma dispensa de um check existente." }, outcomes = { decision_id = "quality.findings.v2", evidence = "confirmação explícita em 2026-09-15", value_id = "approve" }, blockers = { decision_id = "quality.findings.v2", evidence = "docs/prompt-setup.md; confirmação explícita em 2026-09-15", value_id = "Falha em npm ci, em prepare quando o script existir, ou em qualquer check aplicável bloqueia a aprovação; ausência de script não bloqueia quando estiver dentro do escopo aprovado e registrada como not_applicable." }, finding_treatment = { decision_id = "quality.findings.v2", evidence = "docs/prompt-setup.md; confirmação explícita em 2026-09-15", value_id = "Corrigir a falha, registrar nova evidência e reexecutar somente o critério corrigido e os critérios diretamente afetados." }, exceptions = { decision_id = "quality.boundaries.v2", evidence = "confirmação explícita em 2026-09-15", value_id = "Testes de componentes ficam fora do escopo; ausência de script pode ser not_applicable quando fizer parte do escopo aprovado; lint, E2E, UI e CI permanecem condicionais às ferramentas e superfícies confirmadas." }, re_execution_criteria = { decision_id = "quality.procedure.v2", evidence = "docs/prompt-setup.md; confirmação explícita em 2026-09-15", value_id = "Reexecutar após mudança de código, configuração, dependência, schema, Edge Function, integração, fluxo, candidato ou roadmap, limitando a execução aos critérios afetados." }, observed_facts = { decision_id = "quality.confirmation.v2", evidence = "package.json; package-lock.json; .flox/artifacts/status.yaml; .flox/project-context.md; confirmação em 2026-09-15", value_id = "O checkout possui scaffold React/Vite, TypeScript strict, Vitest/MSW, shell estático e scripts locais no estado atual; snapshots intermediários de STORY-001 e STORY-002 a STORY-008 não declaravam ainda typecheck, test ou build, enquanto o snapshot de STORY-009 já declarava os scripts mas tinha lockfile inconsistente. Evidência: package.json, package-lock.json, .flox/artifacts/status.yaml e snapshots registrados nos ledgers." }, provided_decisions = { decision_id = "quality.confirmation.v2", evidence = "confirmação explícita em 2026-09-15", value_id = "Isaac confirmou em 2026-09-15 que os checks devem ser executados somente quando o script correspondente existir no snapshot do candidato; ausência dentro do escopo aprovado deve ser registrada como not_applicable, sem alterar a Story." }, assumptions = { decision_id = "quality.confirmation.v2", evidence = "confirmation", value_id = "empty" }, open_questions = { decision_id = "quality.confirmation.v2", evidence = "confirmation", value_id = "empty" }, confirmation = { decision_id = "quality.confirmation.v2", evidence = "confirmação explícita em 2026-09-15", value_id = "explicitly_confirmed" } }
decision_records = [{ id = "quality.criteria.v2", status = "confirmed", decision = "per-work-item-script-aware-quality-criteria", evidence = "confirmação explícita em 2026-09-15", fields = ["objective", "scope"], content = { objective = "Avaliar cada work_item roteado para Quality com critérios executáveis e evidência independente por work_item_id.", scope = "Cada work_item roteado para Quality depois de Code Review ou Pentest; quality.install.v1 permanece aplicável para instalação e prepare disponível; quality.typecheck.v1, quality.tests.v1 e quality.build.v1 são aplicáveis somente quando seus scripts existirem no candidato, com lint, E2E, UI e CI condicionais ao estado do candidato." } }, { id = "quality.environments.v2", status = "confirmed", decision = "local-required-conditional-script-and-browser", evidence = "confirmação explícita em 2026-09-15", fields = ["prerequisites", "environments"], content = { prerequisites = "Node 22.12.0, npm, package.json e package-lock.json do candidato; scripts são admitidos conforme declarados em cada snapshot.", environments = "Execução local obrigatória; CI somente quando existir workflow em .github/workflows; navegador local somente para candidatos com UI; Playwright somente quando configuração e cenário relevante existirem." } }, { id = "quality.boundaries.v2", status = "confirmed", decision = "conditional-tools-no-component-tests-and-scoped-missing-scripts", evidence = "confirmação explícita em 2026-09-15", fields = ["authorized_boundaries", "exceptions"], content = { authorized_boundaries = "Avaliar somente o candidato e os arquivos autorizados do Postify; usar mocks para serviços externos quando possível; não exigir testes de componentes; não simular CI, E2E ou UI em candidatos sem a superfície correspondente.", exceptions = "Testes de componentes ficam fora do escopo; ausência de script pode ser not_applicable quando fizer parte do escopo aprovado; lint, E2E, UI e CI permanecem condicionais às ferramentas e superfícies confirmadas." } }, { id = "quality.owner.v1", status = "confirmed", decision = "isaac", evidence = "confirmação explícita em 2026-09-03", fields = ["responsible"], content = { responsible = "Isaac." } }, { id = "quality.procedure.v2", status = "confirmed", decision = "script-aware-local-checks-and-conditional-manual-validation", evidence = "confirmação explícita em 2026-09-15", fields = ["procedure", "re_execution_criteria"], content = { procedure = "Executar npm ci --ignore-scripts; executar npm run prepare quando disponível; inspecionar os scripts do candidato; executar npm run typecheck, npm test e npm run build somente quando o respectivo script estiver disponível; registrar not_applicable com evidência de escopo quando ausente; executar npm run dev e npm run preview e verificar manualmente UI, console, estados, acessibilidade e responsividade somente quando aplicável; CI e Playwright somente quando configurados e aplicáveis.", re_execution_criteria = "Reexecutar após mudança de código, configuração, dependência, schema, Edge Function, integração, fluxo, candidato ou roadmap, limitando a execução aos critérios afetados." } }, { id = "quality.evidence.v2", status = "confirmed", decision = "dated-per-item-quality-evidence", evidence = ".flox/project-context.md; confirmação explícita em 2026-09-15", fields = ["evidence"], content = { evidence = "Registrar work_item_id, critério, método, ambiente, data, resultado observável, evaluator, evidência, decisão e justificativa de não aplicabilidade quando houver." } }, { id = "quality.findings.v2", status = "confirmed", decision = "approve-with-script-aware-conditional-scope", evidence = "confirmação explícita em 2026-09-15", fields = ["approvals", "approval_waiver_criteria", "outcomes", "blockers", "finding_treatment"], content = { approvals = "Isaac aprova o resultado do Quality gate para o work_item_id e candidato exatos.", approval_waiver_criteria = "Não há dispensa para falhas aplicáveis; a ausência de um script é not_applicable somente quando suportada pelo escopo aprovado do snapshot e registrada com evidência, não sendo uma dispensa de um check existente.", outcomes = "approve", blockers = "Falha em npm ci, em prepare quando o script existir, ou em qualquer check aplicável bloqueia a aprovação; ausência de script não bloqueia quando estiver dentro do escopo aprovado e registrada como not_applicable.", finding_treatment = "Corrigir a falha, registrar nova evidência e reexecutar somente o critério corrigido e os critérios diretamente afetados." } }, { id = "quality.confirmation.v2", status = "confirmed", decision = "explicitly-confirmed-script-aware-refresh", evidence = "confirmação explícita em 2026-09-15", fields = ["observed_facts", "provided_decisions", "assumptions", "open_questions", "confirmation"], content = { observed_facts = "O checkout possui scaffold React/Vite, TypeScript strict, Vitest/MSW, shell estático e scripts locais no estado atual; snapshots intermediários de STORY-001 e STORY-002 a STORY-008 não declaravam ainda typecheck, test ou build, enquanto o snapshot de STORY-009 já declarava os scripts mas tinha lockfile inconsistente. Evidência: package.json, package-lock.json, .flox/artifacts/status.yaml e snapshots registrados nos ledgers.", provided_decisions = "Isaac confirmou em 2026-09-15 que os checks devem ser executados somente quando o script correspondente existir no snapshot do candidato; ausência dentro do escopo aprovado deve ser registrada como not_applicable, sem alterar a Story.", assumptions = "empty", open_questions = "empty", confirmation = "explicitly_confirmed" } }]
last_reviewed_at = "2026-09-15"
status = "confirmed"
objective = "Avaliar cada work_item roteado para Quality com critérios executáveis e evidência independente por work_item_id."
scope = "Cada work_item roteado para Quality depois de Code Review ou Pentest; quality.install.v1 permanece aplicável para instalação e prepare disponível; quality.typecheck.v1, quality.tests.v1 e quality.build.v1 são aplicáveis somente quando seus scripts existirem no candidato, com lint, E2E, UI e CI condicionais ao estado do candidato."
prerequisites = "Node 22.12.0, npm, package.json e package-lock.json do candidato; scripts são admitidos conforme declarados em cada snapshot."
environments = "Execução local obrigatória; CI somente quando existir workflow em .github/workflows; navegador local somente para candidatos com UI; Playwright somente quando configuração e cenário relevante existirem."
authorized_boundaries = "Avaliar somente o candidato e os arquivos autorizados do Postify; usar mocks para serviços externos quando possível; não exigir testes de componentes; não simular CI, E2E ou UI em candidatos sem a superfície correspondente."
responsible = "Isaac."
approvals = "Isaac aprova o resultado do Quality gate para o work_item_id e candidato exatos."
procedure = "Executar npm ci --ignore-scripts; executar npm run prepare quando disponível; inspecionar os scripts do candidato; executar npm run typecheck, npm test e npm run build somente quando o respectivo script estiver disponível; registrar not_applicable com evidência de escopo quando ausente; executar npm run dev e npm run preview e verificar manualmente UI, console, estados, acessibilidade e responsividade somente quando aplicável; CI e Playwright somente quando configurados e aplicáveis."
evidence = "Registrar work_item_id, critério, método, ambiente, data, resultado observável, evaluator, evidência, decisão e justificativa de não aplicabilidade quando houver."
approval_waiver_criteria = "Não há dispensa para falhas aplicáveis; a ausência de um script é not_applicable somente quando suportada pelo escopo aprovado do snapshot e registrada com evidência, não sendo uma dispensa de um check existente."
outcomes = "approve"
blockers = "Falha em npm ci, em prepare quando o script existir, ou em qualquer check aplicável bloqueia a aprovação; ausência de script não bloqueia quando estiver dentro do escopo aprovado e registrada como not_applicable."
finding_treatment = "Corrigir a falha, registrar nova evidência e reexecutar somente o critério corrigido e os critérios diretamente afetados."
exceptions = "Testes de componentes ficam fora do escopo; ausência de script pode ser not_applicable quando fizer parte do escopo aprovado; lint, E2E, UI e CI permanecem condicionais às ferramentas e superfícies confirmadas."
re_execution_criteria = "Reexecutar após mudança de código, configuração, dependência, schema, Edge Function, integração, fluxo, candidato ou roadmap, limitando a execução aos critérios afetados."
observed_facts = "O checkout possui scaffold React/Vite, TypeScript strict, Vitest/MSW, shell estático e scripts locais no estado atual; snapshots intermediários de STORY-001 e STORY-002 a STORY-008 não declaravam ainda typecheck, test ou build, enquanto o snapshot de STORY-009 já declarava os scripts mas tinha lockfile inconsistente. Evidência: package.json, package-lock.json, .flox/artifacts/status.yaml e snapshots registrados nos ledgers."
provided_decisions = "Isaac confirmou em 2026-09-15 que os checks devem ser executados somente quando o script correspondente existir no snapshot do candidato; ausência dentro do escopo aprovado deve ser registrada como not_applicable, sem alterar a Story."
assumptions = "empty"
open_questions = "empty"
confirmation = "explicitly_confirmed"
-->
