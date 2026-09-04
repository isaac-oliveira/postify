---
id: STORY-007
title: "Estruturar scaffold, cliente Supabase e fronteiras backend sem domínio ou funções executáveis"
status: review
---

# STORY-007 — Estruturar scaffold, cliente Supabase e fronteiras backend sem domínio ou funções executáveis

**Status:** review
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
