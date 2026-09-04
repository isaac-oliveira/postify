---
id: STORY-005
title: "Organizar namespaces feature-based, React Router e i18n sem rotas ou conteúdo de produto"
status: approved
---

# STORY-005 — Organizar namespaces feature-based, React Router e i18n sem rotas ou conteúdo de produto

**Status:** approved
**Origem:** [EPIC-001 — Fundação estrutural do Postify](../epics/EPIC-001-postify-foundation.md)

## História de usuário

Como pessoa desenvolvedora, quero limites estruturais para features, roteamento
browser e internacionalização, para que as próximas Stories possam adicionar
fluxos sem misturar responsabilidades ou antecipar conteúdo de produto.

## Critérios de aceitação

- [ ] **AC-001 — Namespaces estruturais:** a árvore do frontend estabelece os
  limites `src/app` para composição, configuração e infraestrutura,
  `src/features` para código específico de feature, `src/store` para estado
  global de cliente e `src/utils` para utilidades realmente compartilhadas;
  nenhum namespace recebe páginas, componentes ou regras de domínio nesta
  Story.
- [ ] **AC-002 — Router browser único:** o manifesto e o lockfile declaram uma
  versão explícita e coerente do React Router, e a aplicação inicializa um
  único router browser no limite de `src/app`; somente `/` renderiza o
  placeholder, sem rotas de produto, guards, loaders, actions ou navegação de
  domínio.
- [ ] **AC-003 — i18n inicializado sem conteúdo:** `i18next` e
  `react-i18next` são declarados com versões explícitas, uma única instância é
  configurada em `src/app/configs/i18n.ts` com locale padrão e fallback
  `pt-BR`, e um único provider é conectado à composição; não há recursos,
  chaves ou textos de produto, e chave ausente não causa crash.
- [ ] **AC-004 — Limites de import:** composição, router e configuração ficam
  em `src/app`; código de feature não é criado e não há dependência circular,
  estado de domínio ou código compartilhado movido prematuramente para
  `src/store` ou `src/utils`.
- [ ] **AC-005 — Regressão do scaffold:** `typecheck`, `dev`, `build` e
  `preview` continuam operacionais, a raiz funciona após refresh e o reset
  global da STORY-004, `prepare`, Commitlint e Lefthook da STORY-001 continuam
  funcionando.
- [ ] **AC-006 — Limite da Story:** o diff fica restrito às dependências e
  lockfile de Router/i18n, namespaces estruturais, configuração e integração
  mínimas no entrypoint; não inclui autenticação, onboarding, telas, conteúdo,
  queries, mutations, Zustand com estado de domínio, Supabase, PWA ou outras
  funcionalidades de produto.

## Dependências e riscos

- Depende da implementação e validação das STORY-002, STORY-003 e STORY-004,
  que fornecem o runtime, TypeScript strict e CSS global.
- Consome `ARCH-001 v1`, o contexto do projeto e os limites de EPIC-001.
- O principal risco é misturar APIs de versões diferentes do React Router ou
  inicializar i18n mais de uma vez.
- Namespaces vazios não são preservados pelo Git; marcadores estruturais só
  devem ser criados quando necessários e não podem conter comportamento.

## Checklist de tarefas

- [ ] **T1 — Estabelecer namespaces e fronteiras de composição**
  - Owner: Dinesh Chugtai
  - Execution: sequential
  - Depends on: STORY-004
  - Done when: `src/app`, `src/features`, `src/store` e `src/utils` possuem
    limites claros, os arquivos de composição permanecem em `src/app` e não
    são criados módulos de feature ou estado de domínio.
- [ ] **T2 — Configurar o router browser mínimo**
  - Owner: Dinesh Chugtai
  - Execution: sequential
  - Depends on: T1
  - Done when: a dependência é pinada, existe uma única inicialização do
    router compatível com sua versão e somente a raiz `/` mantém o
    placeholder, sem rotas ou guards de produto.
- [ ] **T3 — Configurar i18n e integrar a composição**
  - Owner: Dinesh Chugtai
  - Execution: sequential
  - Depends on: T2
  - Done when: a instância i18n usa fallback `pt-BR`, o provider é montado uma
    vez, recursos de produto permanecem vazios e typecheck/runtime continuam
    passando.
- [ ] **T4 — Validar namespaces, router, fallback e regressões**
  - Owner: Felicity Smoak
  - Execution: sequential
  - Depends on: T3
  - Done when: o Test Plan confirma a árvore, refresh da raiz, ausência de
    rotas e conteúdo de produto, fallback de locale/chave, runtime, hook,
    escopo do diff e ausência de secrets.

Todas as tarefas são sequenciais porque compartilham o manifesto, o entrypoint,
os providers e os limites de import.

## Plano de testes

Roteiro fixo de review — finalizado pelo `flox-dev-story` ao concluir a
implementação, antes de mover a Story para `review`. É o único escopo que o
code review (STEM) verifica; cada check mapeia a um critério de aceitação.

- [ ] **Check 1 — Namespaces e imports, mapeado ao AC-001 e AC-004**
  - Passos: inspecionar a árvore de `src` e os imports entre `app`,
    `features`, `store` e `utils`.
  - Resultado esperado: composição/configuração ficam em `src/app`, não há
    feature ou domínio implementado, nem dependência circular ou utilidade
    compartilhada sem reutilização real.
  - Evidência (flox-dev-story): —
- [ ] **Check 2 — Router único e raiz, mapeado ao AC-002**
  - Passos: inspecionar a inicialização do router e acessar `/` diretamente e
    após refresh, além de testar caminhos de produto não definidos.
  - Resultado esperado: há um único router browser, `/` mantém o placeholder,
    caminhos como `/login`, `/dashboard` e `/posts` não exibem telas de
    produto e o runtime não quebra.
  - Evidência (flox-dev-story): —
- [ ] **Check 3 — i18n e fallback, mapeado ao AC-003**
  - Passos: inspecionar a instância/provider, iniciar com o locale padrão,
    forçar locale desconhecido e consultar uma chave ausente em probe
    temporária.
  - Resultado esperado: a instância é criada uma vez, o locale efetivo cai em
    `pt-BR`, chave ausente tem comportamento determinístico sem crash e não há
    recursos ou textos de produto.
  - Evidência (flox-dev-story): —
- [ ] **Check 4 — Dependências e lockfile, mapeado ao AC-002 e AC-003**
  - Passos: executar instalação limpa com o npm declarado e inspecionar as
    versões de Router, i18next e react-i18next no manifesto e lockfile.
  - Resultado esperado: versões explícitas e compatíveis são instaladas sem
    reescrever o lockfile de forma não relacionada.
  - Evidência (flox-dev-story): —
- [ ] **Check 5 — Regressão do scaffold, mapeado ao AC-005**
  - Passos: executar `typecheck`, `dev`, `build`, `preview`, `prepare` e a
    verificação do hook `commit-msg` em ambiente temporário.
  - Resultado esperado: runtime, reset global, placeholder, TypeScript,
    Commitlint e Lefthook continuam funcionando.
  - Evidência (flox-dev-story): —
- [ ] **Check 6 — Escopo e segurança, mapeado ao AC-006**
  - Passos: revisar `git diff --name-only`, dependências, rotas e conteúdo;
    executar a varredura de secrets disponível no projeto.
  - Resultado esperado: somente arquivos autorizados aparecem, não há
    conteúdo de produto, chamadas externas, credenciais ou secrets.
  - Evidência (flox-dev-story): —

## Referências

- Architecture applicable: yes — [ARCH-001 v1](../../planning/architecture/ARCH-001-postify-foundation-v1.md) define `src/app` para composição/configuração, `src/features` para código específico, os limites de estado/utilidades e a regra de não antecipar domínio ou integrações.
- UX applicable: no — esta Story não cria fluxo, tela, estado visual ou conteúdo para usuário.
- DS applicable: no — esta Story não cria componentes, tokens, variantes, temas ou contratos visuais.
- Other links: [PRD-001](../../planning/prds/PRD-001-postify-mvp.md), [EPIC-001](../epics/EPIC-001-postify-foundation.md), [STORY-004](STORY-004-reset-baseline-global.md) e [project-context.md](../../../project-context.md).

## Aprovação

Decision owner: Isaac
Decision: approved
Decided at: 2026-09-03
Justification: Story aprovada explicitamente pelo usuário.
