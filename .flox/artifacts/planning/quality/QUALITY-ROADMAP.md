# Roteiro de Quality — Postify

## Objetivo e escopo

Avaliar cada `work_item` roteado para Quality depois de Code Review ou Pentest,
mantendo evidências e decisões independentes por `work_item_id`. O candidato
é o estado revisado indicado pelo item e seu `review_anchor`; o gate não
avalia um release global nem combina aprovações entre itens.

Os critérios obrigatórios confirmados para o estado atual são:

- `quality.install.v1`: instalar as dependências no ambiente local com `npm ci --ignore-scripts` e verificar a instalação do tooling com `npm run prepare`.
- `quality.typecheck.v1`: executar `npm run typecheck`.
- `quality.tests.v1`: executar `npm test` para os testes unitários e de integração existentes.
- `quality.build.v1`: executar `npm run build`.

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
lockfile. A sequência obrigatória local é:

1. `npm ci --ignore-scripts`
2. `npm run prepare`
3. `npm run typecheck`
4. `npm test`
5. `npm run build`

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

Não há dispensa para falhas. Uma falha obrigatória bloqueia a aprovação e deve
ser corrigida antes de nova avaliação. Reexecutar somente o critério corrigido
e os critérios diretamente afetados após mudança de código, configuração,
dependência, schema, Edge Function, integração, fluxo ou ambiente aplicável.

<!-- flox-roadmap-contract schema=1
version = "1.1"
roadmap_id = "quality"
decision_ids = ["quality.criteria.v2", "quality.environments.v2", "quality.boundaries.v2", "quality.owner.v1", "quality.procedure.v2", "quality.evidence.v2", "quality.findings.v2", "quality.confirmation.v2"]
field_decisions = { objective = { decision_id = "quality.criteria.v2", evidence = "docs/prompt-setup.md; .flox/project-context.md", value_id = "Avaliar cada work_item roteado para Quality com critérios executáveis e evidência independente por work_item_id." }, scope = { decision_id = "quality.criteria.v2", evidence = "package.json; .flox/artifacts/status.yaml; .flox/project-context.md", value_id = "Cada work_item roteado para Quality depois de Code Review ou Pentest; critérios obrigatórios quality.install.v1, quality.typecheck.v1, quality.tests.v1 e quality.build.v1, com lint, E2E, UI e CI condicionais ao estado do candidato." }, prerequisites = { decision_id = "quality.environments.v2", evidence = "package.json; .nvmrc; .npmrc", value_id = "Node 22.12.0, npm, package.json, package-lock.json e scripts confirmados disponíveis no ambiente local." }, environments = { decision_id = "quality.environments.v2", evidence = ".flox/project-context.md; confirmação explícita em 2026-09-15", value_id = "Execução local obrigatória; CI somente quando existir workflow em .github/workflows; navegador local somente para candidatos com UI; Playwright somente quando configuração e cenário relevante existirem." }, authorized_boundaries = { decision_id = "quality.boundaries.v2", evidence = ".flox/project-context.md; docs/prompt-setup.md", value_id = "Avaliar somente o candidato e os arquivos autorizados do Postify; usar mocks para serviços externos quando possível; não exigir testes de componentes; não simular CI, E2E ou UI em candidatos sem a superfície correspondente." }, responsible = { decision_id = "quality.owner.v1", evidence = ".flox/config.toml; confirmação explícita em 2026-09-03", value_id = "Isaac." }, approvals = { decision_id = "quality.findings.v2", evidence = ".flox/config.toml; confirmação explícita em 2026-09-15", value_id = "Isaac aprova o resultado do Quality gate para o work_item_id e candidato exatos." }, procedure = { decision_id = "quality.procedure.v2", evidence = "package.json; .flox/project-context.md; confirmação explícita em 2026-09-15", value_id = "Executar npm ci --ignore-scripts, npm run prepare, npm run typecheck, npm test e npm run build; executar npm run dev e npm run preview e verificar manualmente UI, console, estados, acessibilidade e responsividade somente quando aplicável; CI e Playwright somente quando configurados e aplicáveis." }, evidence = { decision_id = "quality.evidence.v2", evidence = ".flox/project-context.md; confirmação explícita em 2026-09-15", value_id = "Registrar work_item_id, critério, método, ambiente, data, resultado observável, evaluator, evidência, decisão e justificativa de não aplicabilidade quando houver." }, approval_waiver_criteria = { decision_id = "quality.findings.v2", evidence = "confirmação explícita em 2026-09-15", value_id = "Não há dispensa para falhas obrigatórias; lint, E2E, UI e CI são não aplicáveis somente nas condições confirmadas do estado do candidato." }, outcomes = { decision_id = "quality.findings.v2", evidence = "confirmação explícita em 2026-09-15", value_id = "approve" }, blockers = { decision_id = "quality.findings.v2", evidence = "docs/prompt-setup.md; confirmação explícita em 2026-09-15", value_id = "Falha em instalação, prepare, typecheck, testes, build ou critério condicional aplicável bloqueia a aprovação." }, finding_treatment = { decision_id = "quality.findings.v2", evidence = "docs/prompt-setup.md; confirmação explícita em 2026-09-15", value_id = "Corrigir a falha, registrar nova evidência e reexecutar somente o critério corrigido e os critérios diretamente afetados." }, exceptions = { decision_id = "quality.boundaries.v2", evidence = "confirmação explícita em 2026-09-15", value_id = "Testes de componentes ficam fora do escopo; lint, E2E, UI e CI permanecem condicionais às ferramentas e superfícies confirmadas." }, re_execution_criteria = { decision_id = "quality.procedure.v2", evidence = "docs/prompt-setup.md; confirmação explícita em 2026-09-15", value_id = "Reexecutar após mudança de código, configuração, dependência, schema, Edge Function, integração, fluxo ou ambiente aplicável, limitando a execução aos critérios afetados." }, observed_facts = { decision_id = "quality.confirmation.v2", evidence = "package.json; .nvmrc; .npmrc; .flox/artifacts/status.yaml; .flox/project-context.md; confirmação em 2026-09-15", value_id = "O checkout possui scaffold React/Vite, TypeScript strict, Vitest/MSW, shell estático e scripts locais de instalação, prepare, typecheck, teste, build, dev e preview; não possui lint, Playwright, CI ou deployment configurados." }, provided_decisions = { decision_id = "quality.confirmation.v2", evidence = "confirmação explícita em 2026-09-15", value_id = "Isaac confirmou os cinco checks locais, a não aplicabilidade atual de lint, a aplicação condicional de CI e E2E e a verificação manual de UI somente para candidatos com superfície correspondente." }, assumptions = { decision_id = "quality.confirmation.v2", evidence = "confirmation", value_id = "empty" }, open_questions = { decision_id = "quality.confirmation.v2", evidence = "confirmation", value_id = "empty" }, confirmation = { decision_id = "quality.confirmation.v2", evidence = "confirmação explícita em 2026-09-15", value_id = "explicitly_confirmed" } }
decision_records = [{ id = "quality.criteria.v2", status = "confirmed", decision = "per-work-item-executable-quality-criteria", evidence = "package.json; .flox/artifacts/status.yaml; .flox/project-context.md", fields = ["objective", "scope"], content = { objective = "Avaliar cada work_item roteado para Quality com critérios executáveis e evidência independente por work_item_id.", scope = "Cada work_item roteado para Quality depois de Code Review ou Pentest; critérios obrigatórios quality.install.v1, quality.typecheck.v1, quality.tests.v1 e quality.build.v1, com lint, E2E, UI e CI condicionais ao estado do candidato." } }, { id = "quality.environments.v2", status = "confirmed", decision = "local-required-conditional-ci-and-browser", evidence = ".flox/project-context.md; confirmação explícita em 2026-09-15", fields = ["prerequisites", "environments"], content = { prerequisites = "Node 22.12.0, npm, package.json, package-lock.json e scripts confirmados disponíveis no ambiente local.", environments = "Execução local obrigatória; CI somente quando existir workflow em .github/workflows; navegador local somente para candidatos com UI; Playwright somente quando configuração e cenário relevante existirem." } }, { id = "quality.boundaries.v2", status = "confirmed", decision = "conditional-tools-and-no-component-tests", evidence = ".flox/project-context.md; docs/prompt-setup.md; confirmação explícita em 2026-09-15", fields = ["authorized_boundaries", "exceptions"], content = { authorized_boundaries = "Avaliar somente o candidato e os arquivos autorizados do Postify; usar mocks para serviços externos quando possível; não exigir testes de componentes; não simular CI, E2E ou UI em candidatos sem a superfície correspondente.", exceptions = "Testes de componentes ficam fora do escopo; lint, E2E, UI e CI permanecem condicionais às ferramentas e superfícies confirmadas." } }, { id = "quality.owner.v1", status = "confirmed", decision = "isaac", evidence = ".flox/config.toml; confirmação explícita em 2026-09-03", fields = ["responsible"], content = { responsible = "Isaac." } }, { id = "quality.procedure.v2", status = "confirmed", decision = "five-local-checks-and-conditional-manual-validation", evidence = "package.json; .flox/project-context.md; confirmação explícita em 2026-09-15", fields = ["procedure", "re_execution_criteria"], content = { procedure = "Executar npm ci --ignore-scripts, npm run prepare, npm run typecheck, npm test e npm run build; executar npm run dev e npm run preview e verificar manualmente UI, console, estados, acessibilidade e responsividade somente quando aplicável; CI e Playwright somente quando configurados e aplicáveis.", re_execution_criteria = "Reexecutar após mudança de código, configuração, dependência, schema, Edge Function, integração, fluxo ou ambiente aplicável, limitando a execução aos critérios afetados." } }, { id = "quality.evidence.v2", status = "confirmed", decision = "dated-per-item-quality-evidence", evidence = ".flox/project-context.md; confirmação explícita em 2026-09-15", fields = ["evidence"], content = { evidence = "Registrar work_item_id, critério, método, ambiente, data, resultado observável, evaluator, evidência, decisão e justificativa de não aplicabilidade quando houver." } }, { id = "quality.findings.v2", status = "confirmed", decision = "approve-with-explicit-conditional-scope", evidence = "confirmação explícita em 2026-09-15", fields = ["approvals", "approval_waiver_criteria", "outcomes", "blockers", "finding_treatment"], content = { approvals = "Isaac aprova o resultado do Quality gate para o work_item_id e candidato exatos.", approval_waiver_criteria = "Não há dispensa para falhas obrigatórias; lint, E2E, UI e CI são não aplicáveis somente nas condições confirmadas do estado do candidato.", outcomes = "approve", blockers = "Falha em instalação, prepare, typecheck, testes, build ou critério condicional aplicável bloqueia a aprovação.", finding_treatment = "Corrigir a falha, registrar nova evidência e reexecutar somente o critério corrigido e os critérios diretamente afetados." } }, { id = "quality.confirmation.v2", status = "confirmed", decision = "explicitly-confirmed-refresh", evidence = "confirmação explícita em 2026-09-15", fields = ["observed_facts", "provided_decisions", "assumptions", "open_questions", "confirmation"], content = { observed_facts = "O checkout possui scaffold React/Vite, TypeScript strict, Vitest/MSW, shell estático e scripts locais de instalação, prepare, typecheck, teste, build, dev e preview; não possui lint, Playwright, CI ou deployment configurados.", provided_decisions = "Isaac confirmou os cinco checks locais, a não aplicabilidade atual de lint, a aplicação condicional de CI e E2E e a verificação manual de UI somente para candidatos com superfície correspondente.", assumptions = "empty", open_questions = "empty", confirmation = "explicitly_confirmed" } }]
last_reviewed_at = "2026-09-15"
status = "confirmed"
objective = "Avaliar cada work_item roteado para Quality com critérios executáveis e evidência independente por work_item_id."
scope = "Cada work_item roteado para Quality depois de Code Review ou Pentest; critérios obrigatórios quality.install.v1, quality.typecheck.v1, quality.tests.v1 e quality.build.v1, com lint, E2E, UI e CI condicionais ao estado do candidato."
prerequisites = "Node 22.12.0, npm, package.json, package-lock.json e scripts confirmados disponíveis no ambiente local."
environments = "Execução local obrigatória; CI somente quando existir workflow em .github/workflows; navegador local somente para candidatos com UI; Playwright somente quando configuração e cenário relevante existirem."
authorized_boundaries = "Avaliar somente o candidato e os arquivos autorizados do Postify; usar mocks para serviços externos quando possível; não exigir testes de componentes; não simular CI, E2E ou UI em candidatos sem a superfície correspondente."
responsible = "Isaac."
approvals = "Isaac aprova o resultado do Quality gate para o work_item_id e candidato exatos."
procedure = "Executar npm ci --ignore-scripts, npm run prepare, npm run typecheck, npm test e npm run build; executar npm run dev e npm run preview e verificar manualmente UI, console, estados, acessibilidade e responsividade somente quando aplicável; CI e Playwright somente quando configurados e aplicáveis."
evidence = "Registrar work_item_id, critério, método, ambiente, data, resultado observável, evaluator, evidência, decisão e justificativa de não aplicabilidade quando houver."
approval_waiver_criteria = "Não há dispensa para falhas obrigatórias; lint, E2E, UI e CI são não aplicáveis somente nas condições confirmadas do estado do candidato."
outcomes = "approve"
blockers = "Falha em instalação, prepare, typecheck, testes, build ou critério condicional aplicável bloqueia a aprovação."
finding_treatment = "Corrigir a falha, registrar nova evidência e reexecutar somente o critério corrigido e os critérios diretamente afetados."
exceptions = "Testes de componentes ficam fora do escopo; lint, E2E, UI e CI permanecem condicionais às ferramentas e superfícies confirmadas."
re_execution_criteria = "Reexecutar após mudança de código, configuração, dependência, schema, Edge Function, integração, fluxo ou ambiente aplicável, limitando a execução aos critérios afetados."
observed_facts = "O checkout possui scaffold React/Vite, TypeScript strict, Vitest/MSW, shell estático e scripts locais de instalação, prepare, typecheck, teste, build, dev e preview; não possui lint, Playwright, CI ou deployment configurados."
provided_decisions = "Isaac confirmou os cinco checks locais, a não aplicabilidade atual de lint, a aplicação condicional de CI e E2E e a verificação manual de UI somente para candidatos com superfície correspondente."
assumptions = "empty"
open_questions = "empty"
confirmation = "explicitly_confirmed"
-->
