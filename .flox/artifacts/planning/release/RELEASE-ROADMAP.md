# Roteiro de Release — Postify

## Objetivo e escopo

Entregar versões do Postify em produção com versionamento rastreável e
coordenação entre o frontend na Vercel, as migrations e Edge Functions no
Supabase e o registro da versão no GitHub.

## Pré-requisitos e ambientes

O release parte de `develop`, possui escopo definido, validações executadas,
versão SemVer escolhida e mudanças de banco compatíveis com a versão durante o
deploy. O ambiente de produção é composto pelo frontend Vercel e pelo backend
Supabase. O deploy de produção é controlado exclusivamente pelo GitHub Actions.

## Procedimento

Para um release, criar `release/x.y.z` a partir de `develop`, executar as
validações, atualizar a versão em SemVer, corrigir somente problemas
relacionados ao release, abrir PR para `main`, fazer merge, criar a tag
`vX.Y.Z`, criar o GitHub Release, executar o deploy de produção, incorporar as
mudanças novamente em `develop` e excluir a branch de release.

O rollout é integral após a tag. O rollback é feito reimplantando a última tag
válida através do GitHub Actions. O GitHub Release é o canal de comunicação da
versão. Migrations, Edge Functions e frontend Vercel devem ser registrados na
evidência do deploy. Não devem existir dois mecanismos automáticos concorrentes
para o deploy de produção.

Hotfixes partem de `main`, usam `hotfix/*`, seguem validação, atualização de
versão, PR, merge, tag, GitHub Release e deploy, e depois são incorporados em
`develop`.

Isaac é responsável pela preparação, aprovação e acompanhamento do release. O
resultado aprovado é `approve`. Checks obrigatórios falhando, mudanças de banco
incompatíveis, falha de deploy ou ausência de rastreabilidade da versão
bloqueiam a aprovação. Corrigir o problema e repetir a validação antes de
prosseguir; em falha de produção, executar o rollback definido.

<!-- flox-roadmap-contract schema=1
version = "1.0"
roadmap_id = "release"
decision_ids = ["release.targets.v1", "release.procedure.v1", "release.owner.v1", "release.findings.v1", "release.confirmation.v1"]
field_decisions = { objective = { decision_id = "release.targets.v1", evidence = "docs/prompt-setup.md", value_id = "Entregar versões do Postify em produção com versionamento rastreável e coordenação entre o frontend na Vercel, as migrations e Edge Functions no Supabase e o registro da versão no GitHub." }, scope = { decision_id = "release.targets.v1", evidence = "docs/prompt-setup.md", value_id = "Frontend Vercel, migrations e Edge Functions Supabase, GitHub Release, tags e sincronização das branches de release." }, prerequisites = { decision_id = "release.procedure.v1", evidence = "docs/prompt-setup.md; confirmação explícita em 2026-09-03", value_id = "Branch develop pronta, escopo definido, validações executadas, versão SemVer escolhida e mudanças de banco compatíveis com a versão durante o deploy." }, environments = { decision_id = "release.targets.v1", evidence = "docs/prompt-setup.md; confirmação explícita em 2026-09-03", value_id = "Produção composta pelo frontend Vercel e pelo backend Supabase; deploy controlado exclusivamente pelo GitHub Actions." }, authorized_boundaries = { decision_id = "release.targets.v1", evidence = "docs/prompt-setup.md", value_id = "O deploy de produção deve usar somente o GitHub Actions e não pode coexistir com outro mecanismo automático de produção." }, responsible = { decision_id = "release.owner.v1", evidence = ".flox/config.toml; confirmação explícita em 2026-09-03", value_id = "Isaac." }, approvals = { decision_id = "release.findings.v1", evidence = "docs/prompt-setup.md; confirmação explícita em 2026-09-03", value_id = "PR para main, checks obrigatórios e aprovação de Isaac antes do deploy." }, procedure = { decision_id = "release.procedure.v1", evidence = "docs/prompt-setup.md; confirmação explícita em 2026-09-03", value_id = "Criar release/x.y.z a partir de develop, validar, atualizar SemVer, corrigir somente problemas do release, abrir PR para main, fazer merge, criar tag vX.Y.Z, criar GitHub Release, fazer deploy, sincronizar develop e excluir a branch; hotfix parte de main e também é incorporado em develop; rollout integral após a tag." }, evidence = { decision_id = "release.procedure.v1", evidence = "docs/prompt-setup.md", value_id = "Registrar branch, versão, PR, checks, tag, GitHub Release, logs do GitHub Actions e resultados de migrations, Edge Functions e frontend Vercel." }, approval_waiver_criteria = { decision_id = "release.findings.v1", evidence = "docs/prompt-setup.md; confirmação explícita em 2026-09-03", value_id = "Não há dispensa para checks obrigatórios, incompatibilidade de banco, falha de deploy ou ausência de rastreabilidade da versão." }, outcomes = { decision_id = "release.findings.v1", evidence = "confirmação explícita em 2026-09-03", value_id = "approve" }, blockers = { decision_id = "release.findings.v1", evidence = "docs/prompt-setup.md", value_id = "Checks obrigatórios falhando, mudanças de banco incompatíveis, falha de deploy ou ausência de rastreabilidade da versão bloqueiam a aprovação." }, finding_treatment = { decision_id = "release.findings.v1", evidence = "docs/prompt-setup.md; confirmação explícita em 2026-09-03", value_id = "Corrigir o problema e repetir a validação antes de prosseguir; em falha de produção, reimplantar a última tag válida através do GitHub Actions." }, exceptions = { decision_id = "release.procedure.v1", evidence = "docs/prompt-setup.md", value_id = "Hotfix parte de main, usa hotfix/* e deve ser incorporado em develop; E2E segue a política de ambiente e custo do Quality roadmap." }, re_execution_criteria = { decision_id = "release.procedure.v1", evidence = "docs/prompt-setup.md", value_id = "Reexecutar após mudança de escopo, versão, migration, Edge Function, frontend, pipeline, rollout, rollback ou comunicação do release." }, observed_facts = { decision_id = "release.targets.v1", evidence = "docs/prompt-setup.md; .flox/config.toml; .flox/artifacts/status.yaml", value_id = "docs/prompt-setup.md define Vercel, Supabase CLI, GitHub Actions, SemVer, tags, GitHub Release e o fluxo de release; o projeto está configurado no Flox e ainda não possui implementação." }, provided_decisions = { decision_id = "release.confirmation.v1", evidence = "confirmação explícita em 2026-09-03", value_id = "Isaac confirmou Vercel e Supabase como destinos, GitHub Actions como mecanismo único, o fluxo SemVer apresentado e a política proposta de rollout integral, rollback pela última tag válida e comunicação no GitHub Release." }, assumptions = { decision_id = "release.confirmation.v1", evidence = "confirmation", value_id = "empty" }, open_questions = { decision_id = "release.confirmation.v1", evidence = "confirmation", value_id = "empty" }, confirmation = { decision_id = "release.confirmation.v1", evidence = "confirmação explícita em 2026-09-03", value_id = "explicitly_confirmed" } }
decision_records = [{ id = "release.targets.v1", status = "confirmed", decision = "vercel-supabase-production", evidence = "docs/prompt-setup.md", fields = ["objective", "scope", "environments", "authorized_boundaries", "observed_facts"], content = { objective = "Entregar versões do Postify em produção com versionamento rastreável e coordenação entre o frontend na Vercel, as migrations e Edge Functions no Supabase e o registro da versão no GitHub.", scope = "Frontend Vercel, migrations e Edge Functions Supabase, GitHub Release, tags e sincronização das branches de release.", environments = "Produção composta pelo frontend Vercel e pelo backend Supabase; deploy controlado exclusivamente pelo GitHub Actions.", authorized_boundaries = "O deploy de produção deve usar somente o GitHub Actions e não pode coexistir com outro mecanismo automático de produção.", observed_facts = "docs/prompt-setup.md define Vercel, Supabase CLI, GitHub Actions, SemVer, tags, GitHub Release e o fluxo de release; o projeto está configurado no Flox e ainda não possui implementação." } }, { id = "release.procedure.v1", status = "confirmed", decision = "semver-release-with-full-rollout", evidence = "confirmação explícita em 2026-09-03", fields = ["prerequisites", "procedure", "evidence", "exceptions", "re_execution_criteria"], content = { prerequisites = "Branch develop pronta, escopo definido, validações executadas, versão SemVer escolhida e mudanças de banco compatíveis com a versão durante o deploy.", procedure = "Criar release/x.y.z a partir de develop, validar, atualizar SemVer, corrigir somente problemas do release, abrir PR para main, fazer merge, criar tag vX.Y.Z, criar GitHub Release, fazer deploy, sincronizar develop e excluir a branch; hotfix parte de main e também é incorporado em develop; rollout integral após a tag.", evidence = "Registrar branch, versão, PR, checks, tag, GitHub Release, logs do GitHub Actions e resultados de migrations, Edge Functions e frontend Vercel.", exceptions = "Hotfix parte de main, usa hotfix/* e deve ser incorporado em develop; E2E segue a política de ambiente e custo do Quality roadmap.", re_execution_criteria = "Reexecutar após mudança de escopo, versão, migration, Edge Function, frontend, pipeline, rollout, rollback ou comunicação do release." } }, { id = "release.owner.v1", status = "confirmed", decision = "isaac", evidence = "confirmação explícita em 2026-09-03", fields = ["responsible"], content = { responsible = "Isaac." } }, { id = "release.findings.v1", status = "confirmed", decision = "approve-with-release-blockers", evidence = "confirmação explícita em 2026-09-03", fields = ["approvals", "approval_waiver_criteria", "outcomes", "blockers", "finding_treatment"], content = { approvals = "PR para main, checks obrigatórios e aprovação de Isaac antes do deploy.", approval_waiver_criteria = "Não há dispensa para checks obrigatórios, incompatibilidade de banco, falha de deploy ou ausência de rastreabilidade da versão.", outcomes = "approve", blockers = "Checks obrigatórios falhando, mudanças de banco incompatíveis, falha de deploy ou ausência de rastreabilidade da versão bloqueiam a aprovação.", finding_treatment = "Corrigir o problema e repetir a validação antes de prosseguir; em falha de produção, reimplantar a última tag válida através do GitHub Actions." } }, { id = "release.confirmation.v1", status = "confirmed", decision = "explicitly-confirmed", evidence = "confirmação explícita em 2026-09-03", fields = ["provided_decisions", "assumptions", "open_questions", "confirmation"], content = { provided_decisions = "Isaac confirmou Vercel e Supabase como destinos, GitHub Actions como mecanismo único, o fluxo SemVer apresentado e a política proposta de rollout integral, rollback pela última tag válida e comunicação no GitHub Release.", assumptions = "empty", open_questions = "empty", confirmation = "explicitly_confirmed" } }]
last_reviewed_at = "2026-09-03"
status = "confirmed"
objective = "Entregar versões do Postify em produção com versionamento rastreável e coordenação entre o frontend na Vercel, as migrations e Edge Functions no Supabase e o registro da versão no GitHub."
scope = "Frontend Vercel, migrations e Edge Functions Supabase, GitHub Release, tags e sincronização das branches de release."
prerequisites = "Branch develop pronta, escopo definido, validações executadas, versão SemVer escolhida e mudanças de banco compatíveis com a versão durante o deploy."
environments = "Produção composta pelo frontend Vercel e pelo backend Supabase; deploy controlado exclusivamente pelo GitHub Actions."
authorized_boundaries = "O deploy de produção deve usar somente o GitHub Actions e não pode coexistir com outro mecanismo automático de produção."
responsible = "Isaac."
approvals = "PR para main, checks obrigatórios e aprovação de Isaac antes do deploy."
procedure = "Criar release/x.y.z a partir de develop, validar, atualizar SemVer, corrigir somente problemas do release, abrir PR para main, fazer merge, criar tag vX.Y.Z, criar GitHub Release, fazer deploy, sincronizar develop e excluir a branch; hotfix parte de main e também é incorporado em develop; rollout integral após a tag."
evidence = "Registrar branch, versão, PR, checks, tag, GitHub Release, logs do GitHub Actions e resultados de migrations, Edge Functions e frontend Vercel."
approval_waiver_criteria = "Não há dispensa para checks obrigatórios, incompatibilidade de banco, falha de deploy ou ausência de rastreabilidade da versão."
outcomes = "approve"
blockers = "Checks obrigatórios falhando, mudanças de banco incompatíveis, falha de deploy ou ausência de rastreabilidade da versão bloqueiam a aprovação."
finding_treatment = "Corrigir o problema e repetir a validação antes de prosseguir; em falha de produção, reimplantar a última tag válida através do GitHub Actions."
exceptions = "Hotfix parte de main, usa hotfix/* e deve ser incorporado em develop; E2E segue a política de ambiente e custo do Quality roadmap."
re_execution_criteria = "Reexecutar após mudança de escopo, versão, migration, Edge Function, frontend, pipeline, rollout, rollback ou comunicação do release."
observed_facts = "docs/prompt-setup.md define Vercel, Supabase CLI, GitHub Actions, SemVer, tags, GitHub Release e o fluxo de release; o projeto está configurado no Flox e ainda não possui implementação."
provided_decisions = "Isaac confirmou Vercel e Supabase como destinos, GitHub Actions como mecanismo único, o fluxo SemVer apresentado e a política proposta de rollout integral, rollback pela última tag válida e comunicação no GitHub Release."
assumptions = "empty"
open_questions = "empty"
confirmation = "explicitly_confirmed"
-->
