---
id: STORY-001
title: "Configurar Commitlint e Lefthook como primeira barreira de qualidade local"
status: approved
---

# STORY-001 — Configurar Commitlint e Lefthook como primeira barreira de qualidade local

**Status:** approved
**Source:** [EPIC-001 — Fundação estrutural do Postify](../epics/EPIC-001-postify-foundation.md)

## User Story

Como pessoa desenvolvedora, quero que as mensagens de commit sejam validadas
localmente conforme Conventional Commits, para que o histórico permaneça
consistente e o review humano receba mudanças fáceis de identificar.

## Acceptance Criteria

- [ ] **AC-001 — Bootstrap reproduzível:** o repositório possui um manifesto
  mínimo para as ferramentas desta Story, declara um único package manager e
  mantém o lockfile correspondente, sem depender de instalação global.
- [ ] **AC-002 — Política mínima:** o Commitlint aceita mensagens compatíveis
  com Conventional Commits e rejeita mensagens que não possuam a estrutura
  mínima exigida, sem adicionar regras de domínio ou de produto.
- [ ] **AC-003 — Hook local:** o Lefthook instala de forma idempotente um hook
  `commit-msg` que executa o Commitlint usando a dependência local do projeto.
- [ ] **AC-004 — Bloqueio observável:** um commit inválido feito pelo fluxo
  normal é rejeitado pelo hook, mantém o `HEAD` inalterado e exibe uma mensagem
  compreensível; um commit válido é aceito.
- [ ] **AC-005 — Limite da Story:** o diff contém somente o bootstrap mínimo do
  tooling, configurações e ativação do hook; não inclui React, Vite, TypeScript,
  ESLint, Prettier, testes, CI/CD, proteção de branches ou comportamento de
  produto.
- [ ] **AC-006 — Segurança local:** a instalação e a validação não exigem
  secrets, chamadas externas de produto ou credenciais, e não imprimem valores
  sensíveis.

O bypass explícito com `--no-verify` permanece uma limitação inerente a hooks
locais; ele não será tratado como aprovação da barreira e será coberto como
risco no review.

## Task Checklist

- [ ] **T1 — Criar o bootstrap mínimo do tooling e do lockfile, sem runtime frontend**
  - Owner: Dinesh Chugtai
  - Execution: sequential
  - Depends on: none
  - Done when: o manifesto, o package manager e o lockfile permitem instalar
    as dependências locais do Commitlint e do Lefthook; STORY-002 pode
    completar esse mesmo contrato para Node, React e Vite sem substituir a
    configuração do hook.
- [ ] **T2 — Configurar a política mínima do Commitlint**
  - Owner: Dinesh Chugtai
  - Execution: sequential
  - Depends on: T1
  - Done when: há uma configuração versionada que aceita e rejeita as
    estruturas previstas em AC-002 sem criar regras específicas de produto.
- [ ] **T3 — Integrar e instalar o hook `commit-msg` com Lefthook**
  - Owner: Dinesh Chugtai
  - Execution: sequential
  - Depends on: T2
  - Done when: a instalação pode ser repetida sem duplicar ou corromper o hook,
    e o fluxo normal de commit chama o Commitlint local.
- [ ] **T4 — Validar cenários positivos, negativos, reinstalação e segurança**
  - Owner: Felicity Smoak
  - Execution: sequential
  - Depends on: T3
  - Done when: as evidências do Test Plan confirmam instalação limpa, commit
    válido, commit inválido, hook acionado, bypass explicitamente limitado,
    reinstalação idempotente e ausência de secrets no diff ou na saída.

Todas as tarefas são sequenciais porque compartilham o manifesto, o lockfile,
as configurações do Commitlint, o hook e a mesma validação de commit.

## Test Plan

Roteiro fixo de review — finalizado pelo `flox-dev-story` ao concluir a
implementação, antes de mover a Story para `review`. É o único escopo que o
code review (STEM) verifica; cada check mapeia a um acceptance criterion.

- [ ] **Check 1 — Bootstrap limpo, mapeado ao AC-001**
  - Passos: validar a instalação em um checkout limpo usando apenas o package
    manager declarado pelo projeto.
  - Resultado esperado: dependências locais e hook são instalados sem pacote
    global ou secret.
  - Evidência (dev-story):
- [ ] **Check 2 — Mensagens válida e inválida, mapeado ao AC-002**
  - Passos: executar a validação contra uma mensagem Conventional Commit e uma
    mensagem sem a estrutura mínima.
  - Resultado esperado: a primeira retorna sucesso e a segunda retorna falha
    com diagnóstico compreensível.
  - Evidência (dev-story):
- [ ] **Check 3 — Hook no commit normal, mapeado ao AC-003**
  - Passos: criar um commit válido e um inválido pelo fluxo normal do Git, sem
    chamar o Commitlint manualmente.
  - Resultado esperado: o Lefthook aciona o Commitlint local; o válido passa e
    o inválido é bloqueado.
  - Evidência (dev-story):
- [ ] **Check 4 — Histórico preservado, mapeado ao AC-004**
  - Passos: comparar `HEAD` e o histórico antes e depois de uma tentativa de
    commit inválido.
  - Resultado esperado: a tentativa inválida não cria commit e o erro orienta
    a correção da mensagem.
  - Evidência (dev-story):
- [ ] **Check 5 — Escopo do diff, mapeado ao AC-005**
  - Passos: inspecionar os arquivos alterados pela Story.
  - Resultado esperado: somente manifesto/lockfile, configuração e ativação do
    tooling aparecem; não há runtime frontend, qualidade posterior, CI/CD ou
    produto.
  - Evidência (dev-story):
- [ ] **Check 6 — Segurança e bypass, mapeado ao AC-006**
  - Passos: repetir a instalação e os commits sem credenciais; observar também
    o comportamento de `--no-verify` como limitação explícita.
  - Resultado esperado: nenhum valor sensível é impresso; o bypass não é
    apresentado como validação e um commit normal continua sujeito ao hook.
  - Evidência (dev-story):

## References

- Architecture applicable: yes — [ARCH-001 v1](../../planning/architecture/ARCH-001-postify-foundation-v1.md) fornece as fronteiras do scaffold, a separação entre infraestrutura e produto, a preferência por dependências locais e a regra de não expor secrets.
- UX applicable: no — esta Story não cria fluxo, tela, estado de interface, responsividade ou comportamento de usuário.
- DS applicable: no — esta Story não cria componentes, tokens, variantes, temas ou contratos visuais.
- Other links: [PRD-001](../../planning/prds/PRD-001-postify-mvp.md), [EPIC-001](../epics/EPIC-001-postify-foundation.md), [GIT-ROADMAP](../../planning/git/GIT-ROADMAP.md), [QUALITY-ROADMAP](../../planning/quality/QUALITY-ROADMAP.md) e [project-context.md](../../../project-context.md).

## Approval

Decision owner: Isaac
Decision: approved
Decided at: 2026-09-03
Justification: Story aprovada explicitamente pelo usuário.
