---
id: STORY-011
title: "Configurar SVGR e registrar logo, ícone e favicon sem componentes de produto"
status: approved
---

# STORY-011 — Configurar SVGR e registrar logo, ícone e favicon sem componentes de produto

**Status:** approved
**Origem:** [EPIC-001 — Fundação estrutural do Postify](../epics/EPIC-001-postify-foundation.md)

## História de usuário

Como pessoa desenvolvedora, quero importar SVGs locais como componentes quando
necessário e registrar os assets de identidade fornecidos, para que o shell
posterior use uma fonte de assets tipada sem duplicar binários ou criar
componentes de produto nesta etapa.

## Limites

Inclui a configuração Vite/TypeScript do SVGR, convenções explícitas para
imports de componente e URL, e um registry readonly para os assets existentes:

- `docs/assets/logo.png` — 1835×701, RGBA, wordmark.
- `docs/assets/icon.png` — 1024×1024, RGBA, ícone.
- `docs/assets/favicon.png` — 1024×1024, RGBA, favicon.

Os PNGs em `docs/assets` permanecem a fonte única e não são copiados,
recomprimidos, convertidos ou redesenhados. O registry aponta para esses
arquivos com imports `?url`; a renderização do logo e do shell, o link HTML do
favicon e o web manifest pertencem à STORY-012.

Não inclui componentes React de produto, telas, shell, rotas, web manifest,
alteração de CSP, upload de SVG, SVG remoto, conteúdo de usuário ou criação de
novos assets visuais.

## Contrato de assets e SVG

O plugin SVGR deve processar somente imports explícitos `*.svg?react` dentro do
escopo de assets locais aprovados. Imports `*.svg?url` e os PNGs do registry
permanecem URLs `string` tratadas pelo Vite. Não usar o comportamento ambíguo de
um mesmo import SVG sem sufixo.

As declarações TypeScript devem expor `*.svg?react` como componente compatível
com `React.FC<React.SVGProps<SVGSVGElement>>` e `*.svg?url` como `string`, sem
`any`, sem `ReactComponent` legado e sem declaração ampla que esconda erros.

O registry readonly em `src/app/assets/icons/index.ts` (ou equivalente no
namespace previsto pela arquitetura) expõe os três assets com URL, dimensão,
MIME type e propósito. Ele não cria JSX, não altera os bytes da fonte e não
registra link de favicon ou manifest.

O pipeline pode otimizar SVGs locais com as opções compatíveis da versão
instalada de SVGR/SVGO, mas otimização não é sanitização. SVGs com script,
event handler, `foreignObject`, `javascript:`, referência externa ou conteúdo
não aprovado devem ser rejeitados ou removidos de forma verificável antes de
virarem componente. Nenhum SVG enviado por usuário ou URL remota entra neste
pipeline.

## Critérios de aceitação

- [ ] **AC-001 — SVGR isolado e versionado:** existe uma integração Vite
  compatível com SVGR, registrada uma única vez e com versão explícita no
  manifesto/lockfile. O escopo do plugin cobre somente `*.svg?react` em assets
  locais aprovados; a major e as opções adotadas não são atualizadas
  implicitamente nesta Story.
- [ ] **AC-002 — Imports tipados sem ambiguidade:** `*.svg?react` resolve para
  componente SVG com `SVGProps<SVGSVGElement>` e `*.svg?url` resolve para
  `string`. O typecheck strict rejeita props ou imports incompatíveis e não há
  `any`, `ReactComponent` legado ou import SVG sem sufixo.
- [ ] **AC-003 — Registry único de identidade:**
  `src/app/assets/icons/index.ts` exporta um registry readonly com `logo`,
  `icon` e `favicon`, apontando diretamente para os três PNGs em
  `docs/assets`. Cada entrada preserva dimensão, RGBA, MIME type e propósito,
  sem cópia, recompressão, conversão ou novo asset visual.
- [ ] **AC-004 — SVG local inerte:** somente SVGs locais aprovados podem ser
  transformados em componentes. O pipeline e sua validação rejeitam ou
  eliminam script, event handler, `foreignObject`, `javascript:`, referência
  externa e conteúdo ativo; imports `?url` não são tratados como sanitização.
- [ ] **AC-005 — Bundle e supply chain controlados:** `?react` é transformado
  pelo plugin e `?url` permanece asset URL; não há importação dinâmica,
  download, SVG remoto, leitura de upload, dependência sem justificativa ou
  conteúdo ativo inesperado no bundle. A configuração não altera CSP como
  atalho nem adiciona `unsafe-inline`.
- [ ] **AC-006 — Limite estrutural:** a Story não cria componentes, telas,
  shell, rotas, link HTML de favicon, web manifest ou comportamento de produto.
  O uso visual dos assets e a derivação da versão ficam para a STORY-012.
- [ ] **AC-007 — Regressão e acessibilidade de contrato:** `typecheck`, `dev`,
  `build`, `preview`, hook e shell anterior continuam operacionais; os tipos
  permitem `aria-label`, `aria-hidden` e demais props SVG padrão sem remover o
  baseline de foco e reduced motion da STORY-004.

## Dependências e riscos

- Depende da implementação e validação das STORY-002, STORY-003 e STORY-010,
  que fornecem Vite, TypeScript strict, pipeline visual e versões efetivas das
  dependências.
- Consome `ARCH-001 v1`, que reserva `src/app/assets/icons/`, e os assets
  fornecidos em `docs/assets/`.
- O principal risco é a interação entre o comportamento padrão do Vite, SVGR e
  as declarações TypeScript fazer `?url` passar pelo transformador ou aceitar
  imports ambíguos.
- SVG é um formato potencialmente ativo; SVGR/SVGO otimizam, mas não tornam
  automaticamente seguro um conteúdo não confiável.
- Hashing e inlining de assets pelo Vite podem mudar a distribuição no `dist`,
  mas não podem alterar a fonte binária nem justificar sua duplicação manual.

## Checklist de tarefas

- [x] **T1 — Fixar integração SVGR e convenções de import**
  - Owner: Dinesh Chugtai
  - Execution: sequential
  - Depends on: STORY-003 e STORY-010
  - Done when: o plugin SVGR compatível com Vite está pinado, registrado uma
    vez, limitado a `*.svg?react`, e `?react`/`?url` estão documentados sem
    import SVG ambíguo.
- [x] **T2 — Adicionar declarações TypeScript strict**
  - Owner: Dinesh Chugtai
  - Execution: sequential
  - Depends on: T1
  - Done when: `vite/client` e a declaração da integração adotada estão
    incluídos, componentes SVG usam `SVGProps<SVGSVGElement>`, URLs são
    `string` e não existe `any` ou declaração ampla conflitante.
- [x] **T3 — Criar registry readonly dos assets fornecidos**
  - Owner: Dinesh Chugtai
  - Execution: sequential
  - Depends on: T2
  - Done when: `src/app/assets/icons/index.ts` importa os três PNGs de
    `docs/assets` com `?url`, registra dimensões/MIME/purpose e não copia ou
    renderiza os binários.
- [x] **T4 — Verificar segurança do pipeline SVG**
  - Owner: Elliot Alderson
  - Execution: sequential
  - Depends on: T3
  - Done when: fixtures locais ativas são rejeitadas ou ficam sem conteúdo
    ativo, não há URL externa, upload, execução, download, alteração de CSP ou
    dependência inesperada.
- [x] **T5 — Validar tipos, assets e regressão**
  - Owner: Felicity Smoak
  - Execution: sequential
  - Depends on: T4
  - Done when: imports `?react`/`?url`, hashes, dimensões, RGBA, build, scripts,
    props de acessibilidade e limite sem shell/produto têm evidência.

Todas as tarefas são sequenciais porque a configuração do transformador, as
declarações, o registry e os gates de segurança compartilham o pipeline Vite.

## Plano de testes

Roteiro fixo de review — finalizado pelo `flox-dev-story` ao concluir a
implementação, antes de mover a Story para `review`. É o único escopo que o
code review (STEM) verifica; cada check mapeia a um critério de aceitação.

- [x] **Check 1 — Resolução tipada, mapeado ao AC-001 e AC-002**
  - Passos: compilar fixture local com imports `*.svg?react` e `*.svg?url`,
    testar props SVG e procurar imports sem sufixo ou declarações `any`.
  - Resultado esperado: componente e URL têm tipos corretos, o plugin atua
    somente no sufixo `?react` e o typecheck rejeita usos incompatíveis.
  - Evidência (flox-dev-story): `npx tsc --ignoreConfig ...` passou para `?react`, `?url`, `SVGProps`, `aria-label` e `aria-hidden`; Vite real transformou `?react` em componente e `?url` em URL; não há import SVG sem sufixo.
- [x] **Check 2 — Registry dos PNGs, mapeado ao AC-003**
  - Passos: importar o registry e validar `file`, SHA-256, dimensões, RGBA,
    MIME type e caminhos contra `docs/assets/logo.png`, `icon.png` e
    `favicon.png`.
  - Resultado esperado: logo 1835×701, icon/favicon 1024×1024, todos RGBA,
    sem alteração ou cópia binária criada.
  - Evidência (flox-dev-story): registry aponta diretamente para os três PNGs; `file` confirmou RGBA e dimensões; SHA-256 preservados: logo `bfae0ef6…f69937a`, icon `c0a87c6e…20e4ae5`, favicon `f6445779…47f5b6d`; nenhuma cópia criada.
- [x] **Check 3 — SVG ativo, mapeado ao AC-004**
  - Passos: compilar fixtures temporárias contendo script, event handler,
    `foreignObject`, `javascript:` e referências externas.
  - Resultado esperado: fixtures são rejeitadas ou saem sem conteúdo ativo;
    nenhum SVG remoto ou upload é aceito e `?url` não é considerado sanitização.
  - Evidência (flox-dev-story): seis fixtures independentes com script, event handler, `foreignObject`, `javascript:`, referência externa e `@import` externo foram rejeitadas pelo `transformRequest` Vite; o import explícito `?react` foi normalizado pelo Vite para `?import&react` e continuou protegido; `?url` permaneceu URL; fixtures removidas.
- [x] **Check 4 — Bundle e supply chain, mapeado ao AC-005**
  - Passos: executar `npm ci`, revisar lockfile/scripts, `build`, inspecionar
    `dist` e verificar requests, `data:` inesperado, CSP e imports dinâmicos.
  - Resultado esperado: `?react` vira componente, `?url` vira asset URL, não
    há download, execução, conteúdo ativo inesperado ou alteração de CSP.
  - Evidência (flox-dev-story): `npm ci --ignore-scripts`, `npm run test` (5/5), `npm run build`, dev, preview, prepare, hook e `git diff --check` passaram; lockfile contém apenas a cadeia pinada do SVGR; não há alteração de CSP, upload ou download.
- [x] **Check 5 — Acessibilidade e regressão, mapeado ao AC-007**
  - Passos: executar `typecheck`, `dev`, `build`, `preview`, `prepare` e hook;
    validar `aria-label`, `aria-hidden`, foco visível, reduced motion, router,
    i18n, reset e placeholder.
  - Resultado esperado: contrato de assets compila, shell anterior permanece
    operacional e o baseline acessível não é removido.
  - Evidência (flox-dev-story): a remoção autorizada do import `Button` elimina o `TS6133`; `npm run typecheck`, `npm test`, `npm run build`, `npm run prepare`, dev, preview e `git diff --check` passaram. Fixtures de tipos acessíveis, foco visível, reduced motion, router, i18n, reset e placeholder permanecem operacionais.
- [x] **Check 6 — Limite da Story, mapeado ao AC-006**
  - Passos: revisar `git diff --name-only`, imports e dependências.
  - Resultado esperado: somente configuração SVGR, declarations, registry e
    testes necessários aparecem; não há componentes, telas, shell, favicon
    HTML, manifest, upload ou produto.
  - Evidência (flox-dev-story): diff de implementação limitado a `vite.config.ts`, `package.json`, `package-lock.json`, `src/app/types/assets.d.ts` e `src/app/assets/icons/index.ts`; não há componentes, telas, shell, manifest, favicon HTML, upload ou produto.

## Referências

- Architecture applicable: yes — [ARCH-001 v1](../../planning/architecture/ARCH-001-postify-foundation-v1.md) reserva `src/app/assets/icons/` e define assets visuais como infraestrutura compartilhada, separada das features.
- UX applicable: no — esta Story não cria fluxo, tela ou componente visual de usuário.
- DS applicable: no — não cria tokens, componentes ou variantes; apenas registra assets e suporte técnico a SVG.
- Other links: [PRD-001](../../planning/prds/PRD-001-postify-mvp.md), [EPIC-001](../epics/EPIC-001-postify-foundation.md), [STORY-010](STORY-010-conectar-tokens-css-tailwind-ant.md), `docs/assets/logo.png`, `docs/assets/icon.png`, `docs/assets/favicon.png` e [project-context.md](../../../project-context.md).
- Technical docs: [SVGR](https://react-svgr.com/docs/rollup/), [Vite static asset handling](https://vite.dev/guide/assets) e [vite-plugin-svgr](https://github.com/pd4d10/vite-plugin-svgr#readme).

## Aprovação

Decision owner: Isaac
Decision: approved
Decided at: 2026-09-03
Justification: Isaac aprovou explicitamente esta versão da Story para execução.

## Code Review ledger

review_anchor: f710c7231458f2380687b43ce535349068f6b796
correction_handoffs: 2
findings:
  - id: F-001
    severity: high
    location: vite.config.ts:16–17, 42–48
    state: fixed
    origin_round: 1
  - id: F-002
    severity: medium
    location: src/app/App.tsx:1
    state: accepted
    origin_round: 1
  - id: F-003
    severity: medium
    location: vite.config.ts:58
    state: fixed
    origin_round: 1

## Human decision record

decision: approved
decision_owner: Isaac
decided_at: 2026-09-14
justification: Isaac aceitou explicitamente o risco residual de F-002 e aprovou a Story. O finding já está resolvido no estado atual de `src/app/App.tsx`, mas não há alteração incremental segura a produzir sem ampliar o escopo da Story ou reescrever o histórico.
risk_acceptance:
  - finding_id: F-002
    severity: medium
    impact: A ausência de uma alteração incremental em `src/app/App.tsx` limita a verificabilidade histórica da correção no diff desta rodada.
    accepted_risk: O estado atual de `src/app/App.tsx` permanece sem o import não utilizado, conforme typecheck aprovado; não será criada uma alteração artificial apenas para satisfazer o diff.
    acceptance_scope: Somente o F-002 da STORY-011 e somente o estado revisado em 2026-09-14; qualquer alteração posterior em `App.tsx` exige nova validação e review.

## Risk assessment

result: pentest waived
responsible: Isaac
justification: A mudança da Story está restrita à configuração local do SVGR, declarações TypeScript e registry dos PNGs fornecidos. As fixtures de SVG ativo foram rejeitadas, não há upload, URL remota, endpoint, alteração de CSP ou conteúdo de usuário, e a decisão de F-002 não adiciona código nem superfície de execução.
residual_risk: Baixo. A aceitação cobre apenas a rastreabilidade incremental de F-002; uma regressão futura em `src/app/App.tsx` ou no pipeline local exigirá nova alteração, validação e review. A segurança do pipeline aprovado permanece limitada aos assets locais autorizados e às verificações registradas no Test Plan.
