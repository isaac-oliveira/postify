---
id: STORY-008
title: "Validar configurações de ambiente e tratamento global de erros sem expor secrets"
status: approved
---

# STORY-008 — Validar configurações de ambiente e tratamento global de erros sem expor secrets

**Status:** approved
**Origem:** [EPIC-001 — Fundação estrutural do Postify](../epics/EPIC-001-postify-foundation.md)

## História de usuário

Como pessoa desenvolvedora, quero validar a configuração pública em um ponto
central e tratar falhas globais com uma mensagem segura, para que o aplicativo
falhe de forma previsível sem revelar secrets, detalhes internos ou dados de
usuário.

## Critérios de aceitação

- [ ] **AC-001 — Contrato central de ambiente:** existe um único módulo de
  configuração pública em `src/app/configs/env.ts` (ou caminho equivalente
  dentro do namespace `app`) que lê somente `VITE_SUPABASE_URL` e
  `VITE_SUPABASE_PUBLISHABLE_KEY`, rejeita ausência, vazio, whitespace, valor
  inválido ou conteúdo de controle, e falha fechado sem fallback silencioso,
  request ou log dos valores brutos. A URL aceita apenas um formato válido de
  ambiente suportado pelo projeto, e a chave pública deve ser não vazia sem
  exigir que a implementação trate a chave pública como secret.
- [ ] **AC-002 — Consumo seguro pelo cliente Supabase:**
  `src/app/configs/supabase.ts` consome exclusivamente o contrato central de
  ambiente da AC-001; nenhum outro módulo lê `import.meta.env` diretamente,
  não há expansão de todas as variáveis Vite, e configuração inválida não
  cria um cliente apontando para um destino alternativo.
- [ ] **AC-003 — Arquivos de ambiente protegidos:** existe `.env.example`
  versionado contendo somente os nomes das variáveis públicas e placeholders
  claramente fictícios, sem credenciais utilizáveis; `.gitignore` ignora
  `.env` e `.env.*` e mantém `.env.example` como exceção versionável. Nenhum
  arquivo de ambiente local ou valor real entra no diff desta Story.
- [ ] **AC-004 — Fallback global sem vazamento:** a composição raiz possui um
  Error Boundary ou controlador equivalente para falhas de renderização e
  trata `window.error` e `unhandledrejection` uma única vez, exibindo um
  fallback acessível e genérico. O fallback e seus logs, se houver, não
  reproduzem `message`, `stack`, `cause`, rejection reason, props, URL,
  configuração ou qualquer dado de usuário, não fazem reload em loop e não
  enviam telemetria, `fetch`, beacon ou request externo.
- [ ] **AC-005 — Falha de configuração controlada:** com ambiente válido, a
  raiz anterior continua iniciando normalmente; com ambiente ausente ou
  inválido, a aplicação não instancia o cliente Supabase nem faz requests e
  apresenta o mesmo fallback genérico seguro, sem impedir a renderização do
  mecanismo de erro por depender da própria configuração inválida.
- [ ] **AC-006 — Regressão e limite:** `typecheck`, `dev`, `build` e `preview`
  continuam operacionais no cenário válido, a raiz preserva router, i18n,
  reset, placeholder e o hook da STORY-001, e o diff contém somente validação
  de ambiente, proteção de arquivos, tratamento global de erros e a ligação
  necessária ao bootstrap. Não são introduzidos domínio, autenticação,
  queries, mutations, Storage, Realtime, Edge Functions ou telemetria.

## Dependências e riscos

- Depende da implementação e validação das STORY-002 a STORY-007, que fornecem
  runtime, composição raiz, TypeScript strict, providers e o cliente Supabase
  público.
- Consome `ARCH-001 v1`, o contexto do projeto e os limites de EPIC-001.
- O principal risco é validar `import.meta.env` em um import top-level antes de
  o fallback estar montado, deixando uma configuração inválida em tela vazia.
- Valores `VITE_*` são potencialmente públicos no bundle; esta Story reduz a
  superfície por allowlist, mas não transforma a chave publicável em secret.
- O tratamento global evita vazamento acidental, mas não substitui uma futura
  observabilidade segura nem implementa telemetria nesta Story.

## Checklist de tarefas

- [ ] **T1 — Centralizar e validar a configuração pública**
  - Owner: Dinesh Chugtai
  - Execution: sequential
  - Depends on: STORY-007
  - Done when: `env.ts` possui allowlist explícita das duas variáveis públicas,
    valida presença/formato sem expor valores, falha fechado sem fallback e o
    bootstrap consegue apresentar o mecanismo de erro quando a configuração é
    inválida.
- [ ] **T2 — Ligar o cliente Supabase ao contrato central**
  - Owner: Dinesh Chugtai
  - Execution: sequential
  - Depends on: T1
  - Done when: `supabase.ts` não lê ambiente diretamente, usa somente o
    contrato central, mantém cliente único e não faz request, log ou operação
    de domínio durante a importação.
- [ ] **T3 — Proteger exemplos e arquivos locais de ambiente**
  - Owner: Dinesh Chugtai
  - Execution: sequential
  - Depends on: T2
  - Done when: `.env.example` contém apenas placeholders não utilizáveis,
    `.gitignore` protege `.env*` com exceção explícita do exemplo e nenhum
    arquivo local ou credencial real aparece no diff.
- [ ] **T4 — Implementar fallback e handlers globais seguros**
  - Owner: Dinesh Chugtai
  - Execution: sequential
  - Depends on: T3
  - Done when: Error Boundary/controlador, `window.error` e
    `unhandledrejection` exibem fallback acessível e genérico, são registrados
    uma única vez, não serializam detalhes, não iniciam loop e não fazem
    telemetria ou requests externos.
- [ ] **T5 — Executar validação adversarial de segurança**
  - Owner: Elliot Alderson
  - Execution: sequential
  - Depends on: T4
  - Done when: probes de ambiente, secret scan de código/bundle/source maps e
    logs, e inspeção de telemetria confirmam ausência de secrets, vazamentos,
    requests externos e backend executável.
- [ ] **T6 — Validar regressão, escopo e comportamento observável**
  - Owner: Felicity Smoak
  - Execution: sequential
  - Depends on: T5
  - Done when: cenários de erro global, typecheck, dev, build, preview, hook e
    revisão de escopo confirmam todos os critérios sem regressão, domínio ou
    backend executável.

Todas as tarefas são sequenciais porque o contrato de ambiente, a composição
raiz, o cliente Supabase e o fallback compartilham o mesmo bootstrap.

## Plano de testes

Roteiro fixo de review — finalizado pelo `flox-dev-story` ao concluir a
implementação, antes de mover a Story para `review`. É o único escopo que o
code review (STEM) verifica; cada check mapeia a um critério de aceitação.

- [ ] **Check 1 — Ambiente válido e inválido, mapeado ao AC-001 e AC-005**
  - Passos: iniciar com URL válida e chave pública sintética; repetir com
    variável ausente, vazia, whitespace, URL inválida, protocolo não aceito e
    valor contendo controle.
  - Resultado esperado: cenário válido inicia; cenário inválido falha de modo
    determinístico, sem fallback silencioso, cliente ou request, sem valor
    bruto em logs e com fallback genérico renderizável.
  - Evidência (flox-dev-story): —
- [ ] **Check 2 — Allowlist de ambiente, mapeado ao AC-001 e AC-002**
  - Passos: inspecionar todas as leituras de `import.meta.env` e o caminho de
    criação do cliente; adicionar sentinela de variável privada ao ambiente
    de teste e revisar o artefato.
  - Resultado esperado: somente as duas variáveis públicas são lidas pelo
    módulo central, sem spread de ambiente e sem inclusão da sentinela no
    bundle.
  - Evidência (flox-dev-story): —
- [ ] **Check 3 — Exemplo e ignore, mapeado ao AC-003**
  - Passos: inspecionar `.env.example`, testar padrões `.env`, `.env.local` e
    `.env.production` no ignore e revisar arquivos rastreados.
  - Resultado esperado: o exemplo tem somente placeholders fictícios, os
    arquivos locais são ignorados e nenhum valor real foi adicionado.
  - Evidência (flox-dev-story): —
- [ ] **Check 4 — Erros globais e fallback, mapeado ao AC-004 e AC-005**
  - Passos: provocar erro de renderização, `window.error` e
    `unhandledrejection`; verificar montagem duplicada, console, DOM, reload,
    rede e dependências do fallback.
  - Resultado esperado: fallback acessível e genérico aparece sem mensagem,
    stack, causa, props, URL, config ou payload; handlers são únicos, não há
    loop e não há telemetria, beacon, fetch ou request externo.
  - Evidência (flox-dev-story): —
- [ ] **Check 5 — Bundle, source maps e logs, mapeado ao AC-002 e AC-004**
  - Passos: executar build com sentinelas sintéticas para valores privados,
    inspecionar bundle/source maps e capturar logs dos cenários inválidos.
  - Resultado esperado: nenhum secret, sentinela, valor bruto de ambiente,
    stack ou serialização de erro aparece nos artefatos ou logs autorizados.
  - Evidência (flox-dev-story): —
- [ ] **Check 6 — Regressão e escopo, mapeado ao AC-006**
  - Passos: executar `typecheck`, `dev`, `build`, `preview`, `prepare` e a
    verificação do hook `commit-msg`; acessar `/` após refresh e revisar
    `git diff --name-only`.
  - Resultado esperado: runtime, router, i18n, reset, placeholder, cliente
    público e hook continuam coerentes; somente arquivos autorizados aparecem
    e não há produto, domínio, backend executável ou telemetria.
  - Evidência (flox-dev-story): —

## Referências

- Architecture applicable: yes — [ARCH-001 v1](../../planning/architecture/ARCH-001-postify-foundation-v1.md) define a composição raiz, o cliente em `src/app/configs/supabase.ts`, a separação frontend/backend e a proibição de secrets no frontend.
- UX applicable: no — esta Story não cria fluxo, tela, estado visual ou conteúdo de usuário; o fallback é apenas um mecanismo estrutural de segurança.
- DS applicable: no — esta Story não cria tokens, componentes de produto, variantes ou contratos visuais; o fallback usa apenas uma apresentação acessível mínima.
- Other links: [PRD-001](../../planning/prds/PRD-001-postify-mvp.md), [EPIC-001](../epics/EPIC-001-postify-foundation.md), [STORY-007](STORY-007-supabase-boundaries.md) e [project-context.md](../../../project-context.md).

## Aprovação

Decision owner: Isaac
Decision: approved
Decided at: 2026-09-03
Justification: Isaac aprovou explicitamente esta versão da Story para execução.
