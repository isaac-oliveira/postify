---
id: STORY-009
title: "Criar mapa simples readonly de tokens"
status: approved
---

# STORY-009 — Criar mapa simples readonly de tokens

**Status:** approved
**Origem:** [EPIC-001 — Fundação estrutural do Postify](../epics/EPIC-001-postify-foundation.md)

## História de usuário

Como pessoa desenvolvedora, quero um mapa simples e somente leitura de todos os
tokens do design, para consumir valores como `tokens.colors.primary[500]` sem
lidar com a estrutura documental do Figma.

## Limites

Inclui somente a extração manual dos 72 valores documentados em
`docs/assets/tokens.json` para `src/app/configs/tokens.ts`. O JSON é apenas
documentação de referência: não deve ser importado, lido, gerado ou acessado
em runtime. O formato público é um objeto simples com os grupos `colors`,
`space`, `fontSize`, `radius`, `fontWeight` e `lineHeight`; cores são strings
`hex` e os demais valores são números. Inclui também um teste unitário isolado
do utilitário compartilhado `deepFreeze`.

Não inclui testes específicos de tokens, preflight, geração, CSS variables,
Tailwind, Ant Design, temas, componentes, telas, layouts, estilos de produto
ou alteração de `docs/assets/tokens.json`.

## Critérios de aceitação

- [ ] **AC-001 — Mapa simples completo:** existe uma única exportação pública `tokens` em `src/app/configs/tokens.ts`, com os seis grupos documentados e 72 folhas consumíveis; cores seguem o formato `tokens.colors.primary[500] === "#6366F1"` e os demais grupos expõem números.
- [ ] **AC-002 — Valores extraídos:** cada folha de `tokens` corresponde ao valor documentado em `docs/assets/tokens.json` — `hex` para cores e `$value` para os demais grupos — sem valores inventados, conversão de unidade ou leitura do JSON pelo código.
- [ ] **AC-003 — Tipagem derivada e imutabilidade:** `tokens` é definido com valores literais readonly, `Tokens` é exportado diretamente como `typeof tokens`, e o congelamento profundo impede mutações superficiais ou aninhadas em runtime; um teste unitário cobre o comportamento recursivo de `deepFreeze`, sem `any`.
- [ ] **AC-004 — Fronteira inerte:** `tokens.ts` não importa nem acessa `docs/assets/tokens.json`, não usa rede, ambiente, escrita, importação dinâmica, `eval`, `Function` ou execução de valores.
- [ ] **AC-005 — Escopo preservado:** o documento JSON permanece inalterado e o diff fica restrito ao mapa de tokens, ao utilitário compartilhado, ao teste unitário e à configuração mínima do runner; não há integração visual ou comportamento de produto.

## Dependências e riscos

- Depende da implementação das STORY-002 a STORY-008, que fornecem o runtime,
  TypeScript strict e o namespace `app`.
- Consome [ARCH-001 v1](../../planning/architecture/ARCH-001-postify-foundation-v1.md)
  e usa `docs/assets/tokens.json` somente como referência documental de
  autoria.
- O risco principal é a divergência entre o mapa extraído e a documentação;
  alterações futuras no JSON exigem uma nova extração manual nesta fronteira.
- A projeção posterior para CSS, Tailwind e Ant Design permanece na STORY-010.

## Checklist de tarefas

- [ ] **T1 — Extrair todos os valores**
  - Owner: Dinesh Chugtai
  - Execution: sequential
  - Depends on: STORY-008
  - Done when: os 72 valores dos seis grupos são registrados em um único objeto simples em `src/app/configs/tokens.ts`.
- [ ] **T2 — Definir readonly e freeze profundo**
  - Owner: Dinesh Chugtai
  - Execution: sequential
  - Depends on: T1
  - Done when: `tokens` usa valores literais readonly, `Tokens` é derivado do valor e exportado, o freeze profundo recursivo impede alterações em runtime e há um teste unitário do utilitário, sem importar ou ler o JSON documental.
- [ ] **T3 — Validar escopo e regressão geral**
  - Owner: Dinesh Chugtai
  - Execution: sequential
  - Depends on: T2
  - Done when: typecheck, testes, build e inspeção do diff confirmam a fronteira única, a fonte documental intacta e a ausência de integração visual ou dependência de runtime nova.

## Plano de testes

Roteiro fixo de review — finalizado pelo `flox-dev-story` ao concluir a
implementação, antes de mover a Story para `review`.

- [ ] **Check 1 — Forma e extração, mapeado ao AC-001 e AC-002**
  - Passos: revisar os seis grupos, contar as 72 folhas e comparar cores e números com a documentação.
  - Resultado esperado: o mapa é simples, completo e contém os valores documentados.
  - Evidência (flox-dev-story): comparação estrutural local confirmou os seis grupos, 72 folhas e correspondência integral com os valores documentados em 2026-09-04.
- [ ] **Check 2 — Tipagem derivada e imutabilidade, mapeado ao AC-003**
  - Passos: executar typecheck e teste unitário, e inspecionar a exportação baseada em `typeof tokens` e o freeze profundo.
  - Resultado esperado: a tipagem acompanha o objeto de valor, o teste confirma o congelamento recursivo e mutações são rejeitadas pelo tipo ou impedidas em runtime.
  - Evidência (flox-dev-story): `npm run typecheck` e `npm test` passaram; Serena não reportou diagnósticos; `Tokens = typeof tokens`, o freeze profundo recursivo via `src/utils/deep-freeze.ts` e seu teste unitário foram confirmados em 2026-09-04.
- [ ] **Check 3 — Limites e fonte, mapeado ao AC-004 e AC-005**
  - Passos: executar build, revisar imports e `git diff --name-only`, e verificar a fonte documental.
  - Resultado esperado: o JSON não é importado nem alterado, e o diff não contém testes específicos de tokens, integração visual ou comportamento de produto.
  - Evidência (flox-dev-story): `npm run build` e `git diff --check` passaram; não há referência a `tokens.json` em `tokens.ts`; a fonte JSON permaneceu intacta e foi criado somente o teste unitário do utilitário.

## Resultado da implementação

- T1–T3 concluídas em `src/app/configs/tokens.ts`.
- `tokens` contém os 72 valores manuais dos seis grupos e exporta somente `Tokens` derivado de `typeof tokens`.
- O objeto usa valores literais readonly e o freeze profundo recursivo reutilizável foi movido para `src/utils/deep-freeze.ts`.
- `src/utils/deep-freeze.test.ts` cobre o congelamento recursivo e o retorno da mesma referência.
- Não foram criados testes específicos de tokens, validator, geração ou dependência de runtime nova.

## Referências

- Architecture applicable: yes — [ARCH-001 v1](../../planning/architecture/ARCH-001-postify-foundation-v1.md) define a fronteira compartilhada em `src/app/configs/` e mantém CSS, Tailwind e Ant Design fora desta Story; o JSON é a referência documental dos 72 valores extraídos.
- UX applicable: no — esta Story não cria fluxo, tela, estado ou interação de produto.
- DS applicable: no — esta Story não cria componentes, props, variantes ou temas.
- Other links: [PRD-001](../../planning/prds/PRD-001-postify-mvp.md), [EPIC-001](../epics/EPIC-001-postify-foundation.md), `docs/assets/tokens.json` e [project-context.md](../../../project-context.md).

## Aprovação

Decision owner: Isaac
Decision: approved
Decided at: 2026-09-04
Justification: Isaac aprovou explicitamente esta versão, com `Tokens` derivado de `typeof tokens` e sem exportação separada para `ColorTokens`.

## Code Review ledger

review_anchor: ed8f7b728f75759f5d030bfa9bb26f96298316b7
correction_handoffs: 0
findings: []

## Human decision record

decision: approved
decision_owner: Isaac
decided_at: 2026-09-04
justification: Todos os três checks do Test Plan passaram sem bloqueadores. Os 72 tokens dos seis grupos estão presentes no diff; tipagem derivada e freeze profundo confirmados; fronteira inerte sem importação do JSON documental.
risk_acceptance: []

## Avaliação de risco

A mudança introduz dois novos arquivos de utilitário e configuração (`deep-freeze.ts`, `tokens.ts`) e um teste unitário, sem superfície de segurança: não há importação de JSON em runtime, sem rede, sem eval, sem segredos, sem dependência de ambiente. O vitest é adicionado apenas como devDependency.

Pentest waived — responsible: Isaac; justification: a fronteira é estritamente inerte (somente literais e função pura de congelamento), sem vetor de injeção, autenticação, I/O externo ou dados sensíveis; risco residual: possível divergência futura entre o mapa manual e a fonte documental JSON, mitigável por revisão visual na próxima extração.
