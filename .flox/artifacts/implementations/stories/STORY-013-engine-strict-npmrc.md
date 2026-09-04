---
id: STORY-013
title: "Enforçar e fixar Node 22.12.0 no repo via .npmrc e .nvmrc"
status: review
---

# STORY-013 — Enforçar e fixar Node 22.12.0 no repo via .npmrc e .nvmrc

**Status:** review (revisada — escopo expandido para incluir `.nvmrc`)
**Origem:** [SPEC-001](../specs/SPEC-001-engine-strict-npmrc.md) via flox-quick-dev — achado F-003 do code review da STORY-002; `.nvmrc` adicionado por decisão de Isaac em 2026-09-03

## História de usuário

Como pessoa desenvolvedora, quero que o repositório fixe o Node `22.12.0` como
versão padrão e que o npm falhe com erro explícito quando meu Node não satisfaz
o requisito declarado em `package.json`, para que a versão correta seja usada
por padrão e o constraint de `>=22.12.0` seja enforçado localmente, não apenas
avisado.

## Critérios de aceitação

- [x] **AC-001 — `.npmrc` presente:** `.npmrc` existe na raiz do repositório com
  `engine-strict=true` como conteúdo único.
- [x] **AC-002 — Restrição enforçada:** `npm install` executado em Node
  `<22.12.0` retorna erro `EBADENGINE` em vez de warning; a constraint é
  bloqueante, não informativa.
- [x] **AC-003 — Escopo restrito:** o diff inclui somente `.npmrc` e `.nvmrc`;
  nenhum outro arquivo de produção, configuração ou dependência é alterado.
- [x] **AC-004 — `.nvmrc` como default:** `.nvmrc` existe na raiz com `22.12.0`
  como conteúdo único, fixando o Node padrão do repositório e alinhado ao
  `engines.node` de `package.json`.

## Checklist de tarefas

- [x] **T1 — Criar `.npmrc` com `engine-strict=true`**
  - Owner: Dinesh Chugtai
  - Execution: sequential
  - Depends on: none
  - Done when: `.npmrc` presente na raiz com `engine-strict=true`; `npm
    install` falha em Node incompatível com erro `EBADENGINE`.
- [x] **T2 — Criar `.nvmrc` com `22.12.0`**
  - Owner: Dinesh Chugtai
  - Execution: sequential
  - Depends on: none
  - Done when: `.nvmrc` presente na raiz com `22.12.0` como conteúdo único.
- [x] **T3 — Validar restrição, default e escopo do diff**
  - Owner: Felicity Smoak
  - Execution: sequential
  - Depends on: T1, T2
  - Done when: Test Plan confirmado com evidência de erro em Node incompatível,
    `.nvmrc` fixando 22.12.0 e diff restrito a `.npmrc` e `.nvmrc`.

## Plano de testes

Roteiro fixo de review — finalizado pelo `flox-dev-story` ao concluir a
implementação, antes de mover a Story para `review`. É o único escopo que o
code review (STEM) verifica; cada check mapeia a um critério de aceitação.

- [x] **Check 1 — Arquivo presente, mapeado ao AC-001**
  - Passos: inspecionar `.npmrc` na raiz do repositório.
  - Resultado esperado: arquivo presente com `engine-strict=true` como única
    linha de configuração.
  - Evidência (flox-dev-story): `cat .npmrc` → `engine-strict=true` (única
    linha). Confirmado em 2026-09-03.
- [x] **Check 2 — Restrição enforçada, mapeado ao AC-002**
  - Passos: executar `npm install` ou `npm ci` no ambiente local (Node v20.19.5,
    que viola `>=22.12.0`).
  - Resultado esperado: npm retorna código de saída diferente de zero com erro
    `EBADENGINE`, não apenas warning.
  - Evidência (flox-dev-story): `npm install` retornou `npm error code
    EBADENGINE` — `Required: {"node":">=22.12.0"}`, `Actual:
    {"node":"v20.19.5","npm":"11.17.0"}`, exit code 1, sem instalar. Confirmado
    em 2026-09-03.
- [x] **Check 3 — Escopo do diff, mapeado ao AC-003**
  - Passos: revisar `git diff --name-only` e `git status --short`.
  - Resultado esperado: entre arquivos de produção/configuração/dependência,
    somente `.npmrc` e `.nvmrc` aparecem; os demais itens são artefatos de
    workflow em `.flox/` (bookkeeping da Story), sem alterar `package.json`,
    lockfile, scripts ou código.
  - Evidência (flox-dev-story): fora de `.flox/`, `git status --short` lista
    apenas `.npmrc` e `.nvmrc`. `package.json`, lockfile, scripts e código não
    foram tocados; `node_modules` é pré-existente (STORY-001) e gitignored.
    Confirmado em 2026-09-03.
- [x] **Check 4 — `.nvmrc` como default, mapeado ao AC-004**
  - Passos: inspecionar `.nvmrc` na raiz do repositório.
  - Resultado esperado: arquivo presente com `22.12.0` como única linha,
    satisfazendo o range `>=22.12.0` de `engines.node` em `package.json`.
  - Evidência (flox-dev-story): `cat .nvmrc` → `22.12.0` (única linha);
    `package.json` declara `"node": ">=22.12.0"` — 22.12.0 satisfaz o range.
    Confirmado em 2026-09-03.

## Referências

- Architecture applicable: no — esta Story não toca código, componentes,
  contratos ou estrutura de módulos definidos em ARCH-001.
- UX applicable: no — sem fluxo, tela ou comportamento de usuário.
- DS applicable: no — sem componentes, tokens ou variantes visuais.
- Other links: [SPEC-001](../specs/SPEC-001-engine-strict-npmrc.md),
  [STORY-002](STORY-002-inicializar-runtime-frontend.md),
  [EPIC-001](../epics/EPIC-001-postify-foundation.md).

## Aprovação

Decision owner: Isaac
Decision: approved
Decided at: 2026-09-03
Justification: Story revisada (escopo expandido com `.nvmrc` para fixar Node
22.12.0 default) aprovada explicitamente por Isaac.
