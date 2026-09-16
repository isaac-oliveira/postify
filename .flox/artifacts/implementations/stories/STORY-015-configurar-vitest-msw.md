---
id: STORY-015
title: "Configurar Vitest e MSW sem testes ou handlers de produto"
status: approved
---

# STORY-015 — Configurar Vitest e MSW sem testes ou handlers de produto

**Status:** approved
**Origem:** [EPIC-002 — Experiência de desenvolvimento e qualidade do Postify](../epics/EPIC-002-postify-quality-foundation.md)

## História de usuário

Como pessoa desenvolvedora, quero uma base reproduzível de Vitest e MSW no
scaffold, para que testes futuros possam isolar integrações sem introduzir
testes, handlers ou comportamento de produto nesta etapa.

## Limites

Inclui a dependência de MSW, a configuração única do Vitest integrada ao Vite,
o script de teste existente, a configuração Node do MSW para testes e o
carregamento controlado do setup de testes. O Vitest deve continuar compatível
com TypeScript strict e com o baseline atual do scaffold.

O setup do MSW permanece sem handlers padrão de produto e não é importado pelo
runtime da aplicação. Requests não tratados devem ter uma política explícita
no ambiente de teste, sem permitir que chamadas externas sejam ocultadas.

Não inclui testes de produto, handlers de domínio, testes de componentes,
Service Worker, mocking no navegador, adapters, chamadas reais a serviços,
alteração de comportamento do shell, CI, deployment ou alteração de código de
produção não necessária para o tooling.

## Contrato de tooling

Vitest usa uma única fonte de configuração compatível com o Vite e com as
versões efetivas do projeto. A versão instalada permanece explícita em
`package.json` e `package-lock.json`, e `npm test` continua sendo o comando
canônico para a execução.

O comportamento de uma suíte sem arquivos de teste é determinístico e não
exige teste artificial para obter sucesso. Os testes utilitários já existentes
permanecem fora do escopo e não são alterados.

MSW usa exclusivamente `setupServer` de `msw/node` em arquivos de teste. O
servidor possui ciclo de vida explícito, isolamento entre testes e nenhum
handler de produto inicial. A política para requests não tratados é explícita
e impede bypass silencioso de chamadas externas não autorizadas.

## Critérios de aceitação

- [x] **AC-001 — Dependências reproduzíveis:** Vitest permanece na versão
  explícita já adotada pelo projeto, MSW é adicionado em versão explícita e
  `package.json` e `package-lock.json` permanecem coerentes. Não há dependência
  de runtime adicionada para o tooling.
- [x] **AC-002 — Configuração única do Vitest:** existe uma única configuração
  de teste integrada ao Vite, compatível com TypeScript strict, sem aliases,
  plugins ou opções duplicadas conflitantes. O script `npm test` executa essa
  configuração.
- [x] **AC-003 — Execução sem testes de produto:** `npm test` executa o
  conjunto atual sem criar testes de produto e retorna um resultado previsível
  quando não há arquivos de teste correspondentes, sem exigir teste artificial
  ou alterar os testes utilitários existentes.
- [x] **AC-004 — MSW Node isolado:** o setup de testes cria o servidor por
  `msw/node`, registra ciclo de vida de início, reset e encerramento e não
  contém handlers de produto, Service Worker, mocking de navegador ou import
  pelo runtime da aplicação.
- [x] **AC-005 — Requests não tratados controlados:** a política de requests
  não tratados é explícita e uma chamada externa sem handler autorizado não é
  silenciosamente ignorada pelo setup de testes. O servidor não faz download,
  upload ou chamada a serviço externo durante a inicialização.
- [x] **AC-006 — Regressão e limite estrutural:** `typecheck`, `test` e `build`
  continuam operacionais; o diff fica limitado a manifesto, lockfile,
  configuração e setup de testes. Não há alteração em componentes, features,
  shell, rotas, providers de produção ou comportamento de produto.

## Checklist de tarefas

- [x] **T1 — Confirmar baseline e fonte única de configuração**
  - Owner: Dinesh Chugtai
  - Execution: sequential
  - Depends on: STORY-013 e STORY-003
  - Done when: scripts, versões de Vite/Vitest, TypeScript strict e arquivos de
    configuração atuais estão registrados; a estratégia escolhida não duplica
    a configuração do Vite.
- [x] **T2 — Adicionar e fixar MSW**
  - Owner: Dinesh Chugtai
  - Execution: sequential
  - Depends on: T1
  - Done when: MSW está em `devDependencies` com versão explícita e lockfile
    coerente, sem dependência de runtime ou alteração não justificada.
- [x] **T3 — Criar o setup Node neutro do MSW**
  - Owner: Dinesh Chugtai
  - Execution: sequential
  - Depends on: T2
  - Done when: `msw/node` fornece um servidor sem handlers de produto, com
    ciclo de vida isolado e política explícita para requests não tratados.
- [x] **T4 — Integrar Vitest e setup de testes**
  - Owner: Dinesh Chugtai
  - Execution: sequential
  - Depends on: T3
  - Done when: `npm test` carrega a configuração única, usa o setup somente no
    ambiente de teste e trata a ausência de testes de forma previsível.
- [x] **T5 — Validar tooling, regressão e escopo**
  - Owner: Felicity Smoak
  - Execution: sequential
  - Depends on: T4
  - Done when: o Test Plan é confirmado com evidência de instalação limpa,
    execução, typecheck, build, isolamento do MSW, política de requests e
    limite do diff.

Todas as tarefas são sequenciais porque dependências, configuração, setup,
lockfile e validação compartilham o mesmo contrato de execução.

## Plano de testes

Roteiro fixo de review — finalizado pelo `flox-dev-story` ao concluir a
implementação, antes de mover a Story para `review`. É o único escopo que o
code review (STEM) verifica; cada check mapeia a um critério de aceitação.

- [x] **Check 1 — Dependências e lockfile, mapeado ao AC-001**
  - Passos: validar o manifesto, o lockfile e a instalação limpa das
    dependências de teste.
  - Resultado esperado: Vitest mantém a versão do projeto, MSW tem versão
    explícita e nenhum pacote de runtime novo é introduzido.
  - Evidência (flox-dev-story): `npm ci --ignore-scripts` passou em Node v22.12.0; `package.json` e `package-lock.json` fixam `msw@2.11.3`; Vitest permanece em `4.1.6`; nenhuma dependência de runtime foi adicionada.
- [x] **Check 2 — Fonte única do Vitest, mapeado ao AC-002**
  - Passos: carregar a configuração de teste e inspecionar scripts, plugins,
    aliases e integração com Vite e TypeScript.
  - Resultado esperado: uma configuração é carregada sem conflito e `npm test`
    a utiliza.
  - Evidência (flox-dev-story): `vite.config.ts` é a única configuração e mantém os plugins Vite existentes; `test.setupFiles` aponta para `src/test/setup.ts`, `passWithNoTests: true` está configurado e `npm test` passou usando Vitest `4.1.6`; `npm run typecheck` passou sob strict.
- [x] **Check 3 — Suíte sem produto, mapeado ao AC-003**
  - Passos: executar o comando de teste com o conjunto atual e uma cópia
    temporária sem arquivos correspondentes.
  - Resultado esperado: o resultado é previsível, sem testes ou handlers de
    produto adicionados e sem alteração dos testes utilitários existentes.
  - Evidência (flox-dev-story): `npm test` passou com 2 arquivos e 5 testes; o Vitest executado contra diretório temporário vazio exibiu `No test files found` e saiu com código 0; nenhum teste ou handler de produto foi adicionado.
- [x] **Check 4 — Ciclo de vida Node do MSW, mapeado ao AC-004**
  - Passos: inspecionar imports, handlers, setup do runner e ciclo de vida do
    servidor em uma execução controlada.
  - Resultado esperado: somente `msw/node` é usado, o servidor inicia, reseta e
    encerra corretamente e não há handler de produto ou Service Worker.
  - Evidência (flox-dev-story): `src/test/setup.ts` importa somente `setupServer` de `msw/node`, cria o servidor sem handlers, executa `listen`, `resetHandlers` e `close` nos hooks do Vitest; não há Service Worker nem import no runtime; os 2 arquivos de teste passaram.
- [x] **Check 5 — Requests não tratados, mapeado ao AC-005**
  - Passos: realizar uma verificação controlada de request sem handler e
    inspecionar a política configurada e os efeitos de inicialização.
  - Resultado esperado: a chamada não é silenciosamente bypassada, não há
    request externo durante o setup e a falha é observável no teste.
  - Evidência (flox-dev-story): request controlada para `http://127.0.0.1:9/postify-unhandled-check` com `onUnhandledRequest: 'error'` falhou observavelmente no MSW antes de bypassar a chamada; a inicialização não realiza requests externas.
- [x] **Check 6 — Regressão e limite, mapeado ao AC-006**
  - Passos: executar `typecheck`, `test` e `build`, revisar `git diff --check`
    e listar os arquivos alterados.
  - Resultado esperado: os comandos passam e o diff contém somente manifesto,
    lockfile, configuração e setup de testes previstos.
  - Evidência (flox-dev-story): `npm run typecheck`, `npm test`, `npm run build` e `git diff --check` passaram; arquivos alterados fora de `.flox/`: `package.json`, `package-lock.json`, `vite.config.ts` e `src/test/setup.ts`; componentes, features, shell, rotas e providers não foram alterados.

## Implementation Evidence

- T1–T4 concluídas por Dinesh Chugtai: baseline confirmado, MSW fixado, configuração única do Vitest integrada ao Vite e setup Node neutro criado.
- T5 validada em fallback sequencial pelo coordenador após a contribuição de QA não estar disponível: instalação limpa, execução com e sem testes, ciclo de vida MSW, requests não tratados, regressão e limite do diff confirmados em 2026-09-15.
- `npm ci --ignore-scripts` reportou dois avisos moderados de auditoria transitiva; nenhuma correção foi aplicada por estar fora do escopo aprovado.

## Dependências e riscos

- Depende do runtime, scripts e TypeScript strict estabelecidos pelo
  `EPIC-001`, especialmente `STORY-003`, e dos scripts canônicos da
  `STORY-013`.
- O Vitest `4.1.6` já está presente no manifesto atual; a Story deve evitar
  upgrade ou downgrade incidental ao adicionar o MSW.
- A configuração pode conflitar com plugins do Vite se houver duas fontes de
  configuração; a solução deve manter uma única origem efetiva.
- O ciclo de vida incorreto do MSW pode causar vazamento entre testes ou
  mascarar chamadas externas; a política de requests não tratados e o reset
  por teste precisam ser verificáveis.
- O uso de `msw/node` é deliberado: o mocking no navegador e o Service Worker
  pertencem a outra etapa e não podem entrar nesta Story.

## Referências

- Architecture applicable: no — [ARCH-001 v1](../../planning/architecture/ARCH-001-postify-foundation-v1.md) define limites do runtime, adapters e mocks do MVP, mas esta Story trata somente de tooling de desenvolvimento.
- UX applicable: no — não cria fluxo, tela, estado de interface, responsividade ou acessibilidade de produto.
- DS applicable: no — não cria componentes, props, variantes, tokens ou contratos visuais.
- Other links: [PRD-001](../../planning/prds/PRD-001-postify-mvp.md), [EPIC-002](../epics/EPIC-002-postify-quality-foundation.md), [STORY-003](STORY-003-habilitar-typescript-strict.md), [STORY-013](STORY-013-engine-strict-npmrc.md), `package.json`, `package-lock.json`, `vite.config.ts`, [Vitest configuration](https://github.com/vitest-dev/vitest/blob/v4.1.6/docs/config/index.md) e [MSW setupServer](https://github.com/mswjs/msw/blob/main/_autodocs/api-reference/setup-server.md).

## Code Review ledger

review_anchor: 506ac5d9fc93e6173b3ecf1a2dff9933d1bccf0c
correction_handoffs: 0
findings: []

## Human decision record

decision: approved
decision_owner: Isaac
decided_at: "2026-09-15"
justification: >
  STEM revisou o diff completo (primeira rodada) contra o Test Plan e os
  critérios de aceitação da STORY-015. Todos os 6 checks passaram sem
  nenhum achado. Sem bloqueadores correlated; aprovação direta.
risk_acceptance: []

## Avaliação de risco

Natureza da mudança: tooling de desenvolvimento exclusivo (Vitest + MSW Node).
Superfície de segurança: nenhuma — sem código de produção, sem endpoints, sem
dados de usuário, sem lógica de autenticação ou autorização alterada. MSW e
dependências transitivas ficam em `devDependencies` e não chegam ao bundle de
produção.

pentest_status: waived
pentest_waiver:
  responsible: Isaac
  justification: >
    A mudança adiciona exclusivamente tooling de teste (MSW 2.11.3 em
    devDependencies) e integra o Vitest ao vite.config.ts. Nenhum código de
    produção é alterado, nenhum endpoint exposto, nenhuma credencial ou dado
    sensível manipulado. O risco residual é desprezível.
  residual_risk: >
    Dependências de desenvolvimento transitivas com dois avisos moderados de
    auditoria (registrados na Implementation Evidence); sem impacto no bundle
    de produção.

## Aprovação

Decision owner: Isaac
Decision: approved
Decided at: 2026-09-15
Justification: Isaac aprovou explicitamente esta versão da Story.

## Quality convergence ledger

work_item_id: STORY-015
gate: quality
candidate_anchor: 506ac5d9fc93e6173b3ecf1a2dff9933d1bccf0c
anchor_history:
  - round: 1
    anchor: 506ac5d9fc93e6173b3ecf1a2dff9933d1bccf0c
  - round: 2
    anchor: 506ac5d9fc93e6173b3ecf1a2dff9933d1bccf0c
  - round: 3
    anchor: 506ac5d9fc93e6173b3ecf1a2dff9933d1bccf0c
  - round: 4
    anchor: 506ac5d9fc93e6173b3ecf1a2dff9933d1bccf0c
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
    reason: "Felicity confirmou escopo de tooling sem UI, shell, rotas ou comportamento de produto"

## Quality evidence

- work_item_id: STORY-015
  criterion: quality.install.v1
  method: "npm ci --ignore-scripts; npm run prepare"
  environment: "snapshot 506ac5d9fc93e6173b3ecf1a2dff9933d1bccf0c; Node 22.12.0; npm 10.9.0"
  date: 2026-09-15
  result: "exit 0; instalação limpa concluída"
  prepare_result: "exit 0; hook do Lefthook instalado"
  evaluator: "Felicity Smoak 🧪"
  decision: passed
- work_item_id: STORY-015
  criterion: quality.typecheck.v1
  method: "npm run typecheck"
  environment: "snapshot 506ac5d9fc93e6173b3ecf1a2dff9933d1bccf0c; Node 22.12.0; npm 10.9.0"
  date: 2026-09-15
  result: "exit 0; sem diagnósticos"
  evaluator: "Felicity Smoak 🧪"
  decision: passed
- work_item_id: STORY-015
  criterion: quality.tests.v1
  method: "npm test"
  environment: "snapshot 506ac5d9fc93e6173b3ecf1a2dff9933d1bccf0c; Node 22.12.0; npm 10.9.0"
  date: 2026-09-15
  result: "exit 0; 2 arquivos e 5 testes passaram"
  evaluator: "Felicity Smoak 🧪"
  decision: passed
- work_item_id: STORY-015
  criterion: quality.build.v1
  method: "npm run build"
  environment: "snapshot 506ac5d9fc93e6173b3ecf1a2dff9933d1bccf0c; Node 22.12.0; npm 10.9.0"
  date: 2026-09-15
  result: "exit 0; build Vite concluído"
  evaluator: "Felicity Smoak 🧪"
  decision: passed
- work_item_id: STORY-015
  criterion: "UI condicional"
  method: "npm run dev; npm run preview; navegador local"
  environment: "snapshot 506ac5d9fc93e6173b3ecf1a2dff9933d1bccf0c"
  date: 2026-09-15
  result: "não observado; browsers.list() retornou []"
  evaluator: "Felicity Smoak 🧪"
  decision: incomplete

- work_item_id: STORY-015
  criterion: "UI condicional"
  method: "QUALITY-ROADMAP.md: verificação manual somente para candidato com UI"
  environment: "snapshot 506ac5d9fc93e6173b3ecf1a2dff9933d1bccf0c; Chrome conectado; dev e preview locais disponíveis"
  date: 2026-09-15
  result: "snapshot exato exibiu shell, logo com alt significativo e Versão 1.0.0; responsivo em 1440x900 e 320x568; sem erros observáveis"
  evaluator: "Felicity Smoak 🧪"
  decision: passed

- work_item_id: STORY-015
  criterion: "quality.round.v1.2"
  method: "scripts declarados no package.json; execução condicional pela QUALITY-ROADMAP"
  environment: "snapshot 506ac5d9fc93e6173b3ecf1a2dff9933d1bccf0c; Node 22.12.0; npm 10.9.0; checkout temporário Git"
  date: 2026-09-15
  result: "install/prepare/typecheck/test/build passaram; UI not_applicable pelo escopo aprovado"
  evaluator: "Felicity Smoak 🧪"
  decision: pending_approval
- work_item_id: STORY-015
  criterion: "UI condicional"
  method: "QUALITY-ROADMAP.md: dev/preview e verificação manual somente quando aplicável"
  environment: "snapshot 506ac5d9fc93e6173b3ecf1a2dff9933d1bccf0c; Chrome conectado"
  date: 2026-09-15
  result: "Felicity confirmou escopo de tooling sem UI, shell, rotas ou comportamento de produto"
  evaluator: "Felicity Smoak 🧪"
  decision: not_applicable
quality_result: approved
decision_owner: Isaac
quality_approval:
  candidate_anchor: 506ac5d9fc93e6173b3ecf1a2dff9933d1bccf0c
  decision: approved
  decided_at: 2026-09-16
  evidence: "Isaac aprovou explicitamente o candidato após a contribuição pass de Felicity Smoak e os quatro critérios obrigatórios passarem."
## Release convergence ledger
work_item_id: STORY-015
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
- work_item_id: STORY-015
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
