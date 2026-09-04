---
id: STORY-008
title: "Expor configuração pública e tratar erros globais sem expor secrets"
status: approved
---

# STORY-008 — Expor configuração pública e tratar erros globais sem expor secrets

**Status:** approved
**Origem:** [EPIC-001 — Fundação estrutural do Postify](../epics/EPIC-001-postify-foundation.md)

## História de usuário

Como pessoa desenvolvedora, quero expor a configuração pública em um ponto
central e tratar falhas globais com uma mensagem segura, para que o aplicativo
tenha uma fronteira simples de configuração sem revelar secrets, detalhes
internos ou dados de usuário.

## Critérios de aceitação

- [ ] **AC-001 — Contrato central de ambiente:** existe um único módulo de
  configuração pública em `src/app/configs/env.ts` (ou caminho equivalente
  dentro do namespace `app`) que lê explicitamente somente
  `VITE_SUPABASE_URL` e `VITE_SUPABASE_PUBLISHABLE_KEY` e expõe um objeto
  `Object.freeze` com somente esses dois valores. O módulo não valida,
  normaliza, substitui, registra ou envia os valores; a URL e a chave são
  reconhecidas como configuração pública do frontend.
- [ ] **AC-002 — Consumo seguro pelo cliente Supabase:**
  `src/app/configs/supabase.ts` consome exclusivamente o objeto congelado da
  AC-001; nenhum outro módulo lê `import.meta.env` diretamente, não há
  expansão de todas as variáveis Vite e não existe fallback de endpoint,
  chave ou destino alternativo.
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
- [ ] **AC-005 — Bootstrap independente da configuração:** a composição raiz
  não importa nem instancia o cliente Supabase por efeito colateral; com ou
  sem valores de ambiente, o mecanismo de erro permanece independente do
  módulo de configuração e pode renderizar o fallback genérico seguro.
- [ ] **AC-006 — Regressão e limite:** `typecheck`, `dev`, `build` e `preview`
  continuam operacionais no cenário válido, a raiz preserva router, i18n,
  reset, placeholder e o hook da STORY-001, e o diff contém somente exposição
  pública de ambiente, proteção de arquivos, tratamento global de erros e a
  ligação necessária ao bootstrap. Não são introduzidos domínio,
  autenticação, queries, mutations, Storage, Realtime, Edge Functions ou
  telemetria.

## Dependências e riscos

- Depende da implementação e validação das STORY-002 a STORY-007, que fornecem
  runtime, composição raiz, TypeScript strict, providers e o cliente Supabase
  público.
- Consome `ARCH-001 v1`, o contexto do projeto e os limites de EPIC-001.
- O principal risco é confundir `Object.freeze` com proteção de segredo; ele
  somente impede mutações no objeto e não altera a exposição de valores
  `VITE_*` no bundle.
- Valores `VITE_*` são potencialmente públicos no bundle; esta Story reduz a
  superfície por allowlist, mas não transforma a chave publicável em secret.
- O tratamento global evita vazamento acidental, mas não substitui uma futura
  observabilidade segura nem implementa telemetria nesta Story.

## Checklist de tarefas

- [x] **T1 — Centralizar a exposição da configuração pública**
  - Owner: Dinesh Chugtai
  - Execution: sequential
  - Depends on: STORY-007
  - Done when: `env.ts` lê somente as duas variáveis públicas de forma
    explícita e expõe um objeto congelado com esses valores, sem validação,
    fallback, log, request ou normalização.
- [x] **T2 — Ligar o cliente Supabase ao contrato central**
  - Owner: Dinesh Chugtai
  - Execution: sequential
  - Depends on: T1
  - Done when: `supabase.ts` não lê ambiente diretamente, usa somente o
    objeto congelado, mantém cliente único e não faz request, log ou operação
    de domínio durante a importação.
- [x] **T3 — Proteger exemplos e arquivos locais de ambiente**
  - Owner: Dinesh Chugtai
  - Execution: sequential
  - Depends on: T2
  - Done when: `.env.example` contém apenas placeholders não utilizáveis,
    `.gitignore` protege `.env*` com exceção explícita do exemplo e nenhum
    arquivo local ou credencial real aparece no diff.
- [x] **T4 — Implementar fallback e handlers globais seguros**
  - Owner: Dinesh Chugtai
  - Execution: sequential
  - Depends on: T3
  - Done when: Error Boundary/controlador, `window.error` e
    `unhandledrejection` exibem fallback acessível e genérico, são registrados
    uma única vez, não serializam detalhes, não iniciam loop e não fazem
    telemetria ou requests externos, independentemente do módulo de ambiente.
- [x] **T5 — Executar validação adversarial de segurança**
  - Owner: Elliot Alderson
  - Execution: sequential
  - Depends on: T4
  - Done when: probes de ambiente, secret scan de código/bundle/source maps e
    logs, e inspeção de telemetria confirmam ausência de secrets, vazamentos,
    requests externos e backend executável.
- [x] **T6 — Validar regressão, escopo e comportamento observável**
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

- [x] **Check 1 — Objeto público congelado, mapeado ao AC-001**
  - Passos: importar o módulo central com valores públicos sintéticos,
    inspecionar suas chaves e testar `Object.isFrozen`.
  - Resultado esperado: somente os dois nomes aprovados são lidos e expostos
    no objeto congelado, sem transformação ou validação adicional.
  - Evidência (flox-dev-story): probe SSR do Vite confirmou somente as chaves `supabaseUrl` e `supabasePublishableKey`, `Object.isFrozen(...) === true` e ausência de exceção quando os valores não estão definidos.
- [x] **Check 2 — Allowlist de ambiente, mapeado ao AC-001 e AC-002**
  - Passos: inspecionar todas as leituras de `import.meta.env` e o caminho de
    criação do cliente; adicionar sentinela de variável privada ao ambiente
    de teste e revisar o artefato.
  - Resultado esperado: somente as duas variáveis públicas são lidas pelo
    módulo central, sem spread de ambiente e sem inclusão da sentinela no
    bundle.
  - Evidência (flox-dev-story): `rg` encontrou exatamente duas leituras explícitas em `env.ts`; `supabase.ts` importa `publicEnv`; build com sentinela privada não incluiu a sentinela.
- [x] **Check 3 — Exemplo e ignore, mapeado ao AC-003**
  - Passos: inspecionar `.env.example`, testar padrões `.env`, `.env.local` e
    `.env.production` no ignore e revisar arquivos rastreados.
  - Resultado esperado: o exemplo tem somente placeholders fictícios, os
    arquivos locais são ignorados e nenhum valor real foi adicionado.
  - Evidência (flox-dev-story): `.env.example` contém apenas os dois placeholders aprovados; `git check-ignore` confirmou `.env`, `.env.local` e `.env.production`; nenhum arquivo local de ambiente foi rastreado.
- [x] **Check 4 — Erros globais e fallback, mapeado ao AC-004 e AC-005**
  - Passos: provocar erro de renderização, `window.error` e
    `unhandledrejection`; verificar montagem duplicada, console, DOM, reload,
    rede e dependências do fallback.
  - Resultado esperado: fallback acessível e genérico aparece sem mensagem,
    stack, causa, props, URL, config ou payload; handlers são únicos,
    independentes de envs, não há loop e não há telemetria, beacon, fetch ou
    request externo.
  - Evidência (flox-dev-story): probe SSR confirmou `role="alert"`, texto genérico sem detalhe recebido, um listener por evento, `preventDefault` nos dois eventos e remoção dos listeners no unmount.
- [x] **Check 5 — Bundle, source maps e logs, mapeado ao AC-002 e AC-004**
  - Passos: executar build com sentinelas sintéticas para valores privados,
    inspecionar bundle/source maps e capturar logs de importação e falhas
    globais.
  - Resultado esperado: nenhum secret privado, sentinela ou serialização de
    erro aparece nos artefatos ou logs autorizados; somente valores públicos
    sintéticos podem aparecer quando usados diretamente no build.
  - Evidência (flox-dev-story): build com sentinela privada não encontrou padrões privados nem `.map`; importação do cliente registrou zero requests e zero logs.
- [x] **Check 6 — Regressão e escopo, mapeado ao AC-006**
  - Passos: executar `typecheck`, `dev`, `build`, `preview`, `prepare` e a
    verificação do hook `commit-msg`; acessar `/` após refresh e revisar
    `git diff --name-only`.
  - Resultado esperado: runtime, router, i18n, reset, placeholder, cliente
    público e hook continuam coerentes; somente arquivos autorizados aparecem
    e não há produto, domínio, backend executável ou telemetria.
  - Evidência (flox-dev-story): `typecheck`, `build` com e sem env, `dev` (`/` e módulo principal), `preview` (`/`, `/login`, `/dashboard`, `/posts`), `prepare`, Lefthook, commitlint e `git diff --check` passaram; Serena não reportou diagnósticos e Graphify confirmou as relações do bootstrap.

## Implementation Evidence

- T1: `src/app/configs/env.ts` expõe somente `publicEnv` congelado com as duas variáveis públicas.
- T2: `src/app/configs/supabase.ts` cria o cliente exclusivamente a partir de `publicEnv`, sem request ou log na importação.
- T3: `.env.example` usa placeholders fictícios e `.gitignore` mantém os padrões locais protegidos.
- T4: `GlobalErrorBoundary` mantém o fallback em `renderFallback()`, dentro da classe, e o bootstrap raiz o envolve em `src/main.tsx`.
- T5: inspeções de código, importação SSR e bundles não encontraram secrets privados, telemetria ou requests externos.
- T6: validações de tipo, build, servidores locais, hooks, diagnósticos e grafo passaram dentro do escopo autorizado.

## Referências

- Architecture applicable: yes — [ARCH-001 v1](../../planning/architecture/ARCH-001-postify-foundation-v1.md) define a composição raiz, o cliente em `src/app/configs/supabase.ts`, a separação frontend/backend e a proibição de secrets no frontend.
- UX applicable: no — esta Story não cria fluxo, tela, estado visual ou conteúdo de usuário; o fallback é apenas um mecanismo estrutural de segurança.
- DS applicable: no — esta Story não cria tokens, componentes de produto, variantes ou contratos visuais; o fallback usa apenas uma apresentação acessível mínima.
- Other links: [PRD-001](../../planning/prds/PRD-001-postify-mvp.md), [EPIC-001](../epics/EPIC-001-postify-foundation.md), [STORY-007](STORY-007-supabase-boundaries.md) e [project-context.md](../../../project-context.md).

## Aprovação

Decision owner: Isaac
Decision: approved
Decided at: 2026-09-04
Justification: Isaac aprovou explicitamente esta revisão da Story para execução.

## Code Review ledger

review_anchor: 6714b2190a566392dbb8152afcee2c1762328ca9
correction_handoffs: 0
findings: []

## Human decision record

decision: approved
decision_owner: Isaac
decided_at: 2026-09-04
justification: STEM revisou o diff completo (develop...HEAD) da STORY-008 e todos os 6 checks do Test Plan passaram sem findings. Nenhum bloco correlated identificado. A Story é aprovada para seguir para o próximo gate.
risk_acceptances: []

## Avaliação de risco

risk_assessment: pentest waived
responsible: Isaac
justification: A mudança é puramente estrutural — centralização de variáveis VITE_* já públicas no bundle pelo Vite, arquivo .env.example com placeholders fictícios, Error Boundary sem chamadas de rede, telemetria ou serialização de dados. Nenhuma nova superfície de ataque é introduzida: sem auth, sem backend, sem credenciais, sem requisições externas.
residual_risk: Valores VITE_* permanecem potencialmente públicos no bundle por design do Vite; Object.freeze impede mutações no objeto mas não altera essa exposição. Risco residual aceito e documentado na Story.
