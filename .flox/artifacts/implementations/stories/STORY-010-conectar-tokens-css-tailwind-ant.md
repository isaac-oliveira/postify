---
id: STORY-010
title: "Usar aliases curtos no CSS, Tailwind e Ant Design"
status: approved
---

# STORY-010 — Usar aliases curtos no CSS, Tailwind e Ant Design

**Status:** approved
**Origem:** [EPIC-001 — Fundação estrutural do Postify](../epics/EPIC-001-postify-foundation.md)

## História de usuário

Como pessoa desenvolvedora, quero ter os tokens visuais no CSS global com
aliases curtos, para que Tailwind e Ant Design usem os mesmos valores.

## Escopo

`src/global.css` é a fonte única dos valores. Ele contém exatamente 72 custom
properties usando somente `--c-*`, `--s-*`, `--r-*`, `--fs-*`, `--fw-*` e `--lh-*`.

Tailwind usa `@theme` no próprio `global.css`. `src/app/configs/antd-theme.ts`
usa `var(...)` para referenciar essas mesmas propriedades e é aplicado no
`ConfigProvider` raiz.

Não há `tokens.ts`, script de geração, plugin customizado, arquivo intermediário,
valores duplicados, componentes, telas ou comportamento de produto.

## Aliases obrigatórios

| Nome CSS | Valor atual |
|---|---|
| `--c-primary-500` | `#6366F1` |
| `--s-md` | `12px` |
| `--r-md` | `8px` |
| `--fs-md` | `16px` |
| `--fw-bold` | `700` |
| `--lh-md` | `24px` |

As medidas usam `px`; pesos são unitless; cores preservam alpha.

## Critérios de aceitação

- [ ] **AC-001 — CSS global:** `global.css` contém as 72 propriedades curtas, sem qualquer propriedade legada ou arquivo de tokens paralelo.
- [ ] **AC-002 — Tailwind:** o `@theme` de `global.css` expõe os namespaces de cor, spacing, texto, radius, peso e line-height referenciando as propriedades curtas.
- [ ] **AC-003 — Ant Design:** `antd-theme.ts` usa somente referências `var(...)` para as propriedades allowlisted e o `ConfigProvider` raiz recebe esse tema.
- [ ] **AC-004 — Regressão:** typecheck, testes, build, dev, preview e instalação limpa continuam funcionando; reset, foco visível e reduced motion permanecem intactos.

## Checklist de tarefas

- [x] **T1 — Definir os aliases no CSS global**
  - Owner: Dinesh Chugtai
  - Done when: os 72 valores e seis padrões estão em `src/global.css`.
- [x] **T2 — Expor os aliases ao Tailwind**
  - Owner: Dinesh Chugtai
  - Done when: `@theme` referencia os aliases curtos e o plugin oficial do Tailwind processa as utilities.
- [x] **T3 — Conectar o Ant Design**
  - Owner: Dinesh Chugtai
  - Done when: `antd-theme.ts` referencia o CSS global e o tema está no `ConfigProvider` raiz.
- [x] **T4 — Validar a integração**
  - Owner: Felicity Smoak
  - Done when: os checks locais passam e o diff fica limitado ao escopo desta Story.

## Plano de testes

- [x] **Check 1 — Aliases CSS**
  - Evidência: o build contém 72 propriedades curtas únicas, incluindo os seis aliases obrigatórios, e nenhuma propriedade legada.
- [x] **Check 2 — Tailwind**
  - Evidência: o build contém 72 bridges `@theme` e as utilities representativas apontam para `--c-primary-500`, `--s-md`, `--r-md`, `--fs-md`, `--fw-bold` e `--lh-md`.
- [x] **Check 3 — Ant Design**
  - Evidência: `ThemeConfig` passou no typecheck; `antd-theme.ts` usa referências CSS e o `ConfigProvider` está no root de `App`.
- [x] **Check 4 — Regressão**
  - Evidência: `npm ci`, `npm run prepare`, `npm run typecheck`, `npm test`, `npm run build`, dev e preview passaram.

## Referências

- Architecture applicable: yes — [ARCH-001 v1](../../planning/architecture/ARCH-001-postify-foundation-v1.md).
- UX applicable: no — não há fluxo ou tela nova.
- DS applicable: no — a Story apenas conecta tokens existentes aos consumidores.
- Other links: [PRD-001](../../planning/prds/PRD-001-postify-mvp.md), [EPIC-001](../epics/EPIC-001-postify-foundation.md) e [project-context.md](../../../project-context.md).
- Technical docs: [Tailwind theme variables](https://tailwindcss.com/docs/theme), [Tailwind Vite](https://tailwindcss.com/docs/installation/using-vite) e [Ant Design theme customization](https://ant.design/docs/react/customize-theme).

## Aprovação

Decision owner: Isaac
Decision: approved
Decided at: 2026-09-04
Justification: Isaac aprovou os aliases curtos e a definição compartilhada no CSS global.
