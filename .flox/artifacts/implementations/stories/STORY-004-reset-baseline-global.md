---
id: STORY-004
title: "Configurar reset do HTML e baseline global acessível sem estilos de produto"
status: approved
---

# STORY-004 — Configurar reset do HTML e baseline global acessível sem estilos de produto

**Status:** approved
**Origem:** [EPIC-001 — Fundação estrutural do Postify](../epics/EPIC-001-postify-foundation.md)

## História de usuário

Como pessoa desenvolvedora, quero um baseline global previsível e acessível,
para que as próximas telas partam de um comportamento consistente entre
navegadores sem carregar estilos de produto antecipadamente.

## Critérios de aceitação

- [ ] **AC-001 — Folha global única:** `src/global.css` existe, é importada
  uma única vez pelo entrypoint da aplicação e permanece restrita a regras
  globais; nenhuma folha de componente ou estilo de produto é criada nesta
  Story.
- [ ] **AC-002 — Reset previsível:** o baseline define box sizing consistente,
  remove margens padrão indesejadas do documento, evita mídia estourando o
  viewport e mantém controles de formulário com tipografia herdada, sem
  aplicar layout, cor, espaçamento ou tipografia de marca.
- [ ] **AC-003 — Foco preservado:** elementos nativamente focáveis continuam
  focáveis e a navegação por teclado mantém ordem determinada pelo DOM; o
  baseline não usa `outline: none` sem uma indicação substituta visível, e
  `:focus-visible` fornece um indicador perceptível.
- [ ] **AC-004 — Movimento reduzido:** quando o usuário solicita
  `prefers-reduced-motion: reduce`, transições e animações não essenciais são
  reduzidas e o comportamento de rolagem suave é neutralizado; sem essa
  preferência, a regra não altera o comportamento padrão do runtime.
- [ ] **AC-005 — Neutralidade de produto:** o diff não contém cores, fontes,
  tokens, temas, componentes, layouts ou seletores específicos de telas do
  Postify; sem `all: unset` ou reset agressivo que remova affordances nativas.
- [ ] **AC-006 — Regressão do scaffold:** a raiz continua funcionando com
  `dev`, `build`, `preview` e `typecheck`, o placeholder React permanece
  montado e `prepare`, Commitlint e Lefthook continuam operacionais.

## Dependências e riscos

- Depende da implementação e validação das STORY-002 e STORY-003, que fornecem
  o entrypoint React/TSX e o typecheck do scaffold.
- Consome `ARCH-001 v1`, o contexto do projeto e os limites de EPIC-001.
- O principal risco é um reset amplo remover estilos nativos importantes,
  especialmente foco, semântica visual ou comportamento de controles.
- Um seletor global excessivo pode afetar componentes futuros; o escopo deve
  permanecer em regras neutras e explicitamente verificáveis.

## Checklist de tarefas

- [ ] **T1 — Criar o reset e o baseline global neutro**
  - Owner: Dinesh Chugtai
  - Execution: sequential
  - Depends on: STORY-003
  - Done when: `src/global.css` contém somente regras de box sizing, documento,
    mídia, controles, foco e movimento reduzido, sem tokens, cores, layout ou
    estilos específicos de produto.
- [ ] **T2 — Conectar o CSS ao entrypoint sem duplicar carregamento**
  - Owner: Dinesh Chugtai
  - Execution: sequential
  - Depends on: T1
  - Done when: o CSS global é importado uma única vez pelo entrypoint React,
    compila sob TypeScript strict e não altera o contrato dos scripts do
    runtime.
- [ ] **T3 — Validar acessibilidade, regressões e limite da Story**
  - Owner: Felicity Smoak
  - Execution: sequential
  - Depends on: T2
  - Done when: o Test Plan confirma foco por teclado, reduced motion,
    preservação de elementos nativos, runtime, typecheck, hook, escopo do diff
    e ausência de secrets.

Todas as tarefas são sequenciais porque compartilham a folha global, o
entrypoint e a validação do runtime.

## Plano de testes

Roteiro fixo de review — finalizado pelo `flox-dev-story` ao concluir a
implementação, antes de mover a Story para `review`. É o único escopo que o
code review (STEM) verifica; cada check mapeia a um critério de aceitação.

- [ ] **Check 1 — Folha global única, mapeado ao AC-001**
  - Passos: inspecionar imports do entrypoint e referências a folhas CSS no
    scaffold.
  - Resultado esperado: `src/global.css` é carregada uma vez e não há outra
    folha global ou estilo de componente criado pela Story.
  - Evidência (flox-dev-story): —
- [ ] **Check 2 — Reset previsível, mapeado ao AC-002**
  - Passos: inspecionar os seletores e verificar estilos computados da raiz,
    mídia e controles nativos.
  - Resultado esperado: box sizing e documento são consistentes, mídia não
    estoura o viewport, controles herdam tipografia e nenhuma regra de produto
    é aplicada.
  - Evidência (flox-dev-story): —
- [ ] **Check 3 — Foco e elementos nativos, mapeado ao AC-003**
  - Passos: navegar pela raiz usando somente `Tab` e inspecionar links,
    botões e controles nativos em uma fixture temporária.
  - Resultado esperado: a ordem de foco segue o DOM, o indicador de foco é
    visível e nenhuma affordance nativa é removida sem substituição.
  - Evidência (flox-dev-story): —
- [ ] **Check 4 — Preferência de movimento, mapeado ao AC-004**
  - Passos: emular `prefers-reduced-motion: reduce` e
    `no-preference`, comparando as regras aplicadas.
  - Resultado esperado: a preferência reduz movimento e neutraliza rolagem
    suave; sem a preferência, o baseline não desativa comportamento normal.
  - Evidência (flox-dev-story): —
- [ ] **Check 5 — Regressão do scaffold, mapeado ao AC-006**
  - Passos: executar `typecheck`, `dev`, `build`, `preview`, `prepare` e a
    verificação do hook `commit-msg` em ambiente temporário.
  - Resultado esperado: runtime, placeholder, TypeScript strict,
    Commitlint e Lefthook continuam funcionando.
  - Evidência (flox-dev-story): —
- [ ] **Check 6 — Neutralidade e segurança, mapeado ao AC-005**
  - Passos: revisar `git diff --name-only`, seletores, dependências e
    conteúdo alterado; executar a varredura de secrets disponível no projeto.
  - Resultado esperado: o diff contém somente o CSS global e seu import, não
    há reset agressivo, tokens, estilos de produto ou secrets.
  - Evidência (flox-dev-story): —

## Referências

- Architecture applicable: yes — [ARCH-001 v1](../../planning/architecture/ARCH-001-postify-foundation-v1.md) restringe `global.css` a regras globais, orienta o uso posterior de Tailwind para estilos específicos e exige acessibilidade sem antecipar componentes ou domínio.
- UX applicable: no — esta Story define apenas um baseline técnico global e não cria fluxo, tela ou estado de usuário.
- DS applicable: no — esta Story não cria componentes, tokens, variantes, temas ou contratos visuais.
- Other links: [PRD-001](../../planning/prds/PRD-001-postify-mvp.md), [EPIC-001](../epics/EPIC-001-postify-foundation.md), [STORY-003](STORY-003-habilitar-typescript-strict.md) e [project-context.md](../../../project-context.md).

## Aprovação

Decision owner: Isaac
Decision: approved
Decided at: 2026-09-03
Justification: Story aprovada explicitamente pelo usuário.
