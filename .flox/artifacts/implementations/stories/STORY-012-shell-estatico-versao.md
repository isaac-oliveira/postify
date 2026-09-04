---
id: STORY-012
title: "Exibir shell estático com logo centralizada e versão derivada do manifesto"
status: approved
---

# STORY-012 — Exibir shell estático com logo centralizada e versão derivada do manifesto

**Status:** approved
**Origem:** [EPIC-001 — Fundação estrutural do Postify](../epics/EPIC-001-postify-foundation.md)

## História de usuário

Como pessoa desenvolvedora, quero uma raiz visual mínima com a identidade do
Postify e a versão do manifesto, para que o scaffold tenha uma saída verificável
sem antecipar fluxos ou funcionalidades de produto.

## Limites

Inclui um `AppShell` estático na rota raiz, a logo fornecida pelo registry da
STORY-011, a versão derivada de `package.json`, o registro controlado do
favicon e a composição com o router e providers já existentes.

O shell deve usar a proporção da logo, tokens da STORY-010 e o baseline global
da STORY-004 para permanecer centralizado, responsivo e acessível.

Não inclui autenticação, estado de domínio, formulários, chamadas externas,
CTAs, telas de produto, novas rotas, Service Worker, Web App Manifest,
instalação PWA, headers, CSP ou alteração dos PNGs fornecidos. Manifest e
headers pertencem ao EPIC-003, incluindo a STORY-028 de manifest e a STORY-032
de headers.

## Contrato do shell

O bootstrap mantém uma única chamada a `createRoot`, um único router e os
providers já configurados. A rota `/` renderiza `src/app/layouts/AppShell.tsx`
(ou equivalente no namespace `app`) com um `main` semântico, uma logo e um
texto de versão. Não são criados links de produto, botões ou dados dinâmicos.

A logo é consumida exclusivamente como `icons.logo.file` do registry readonly
da STORY-011. O bloco logo + versão é centralizado no viewport, preserva a
proporção, respeita gutters e não causa scroll horizontal em viewport estreito.

A versão é exportada por uma projeção estreita, como
`versionManifest.version`, derivada de `package.json.version`; o runtime não
recebe o objeto completo do manifesto. O valor atual esperado é `1.0.0`, mas
esse texto não pode ser hardcoded no componente, no fallback ou em configuração
paralela. `package-lock.json` deve permanecer coerente com o manifesto.

Antes da montagem, o bootstrap cria ou reutiliza exatamente um
`link[rel~="icon"]` em `document.head`, usando somente `icons.favicon.file` e o
MIME type constante `image/png`. A operação usa elementos e atributos
constantes, nunca `innerHTML`, `document.write`, HTML construído por string ou
URL externa.

## Critérios de aceitação

- [ ] **AC-001 — Shell estático na raiz:** uma única composição React via
  `createRoot` renderiza o `AppShell` em `/`, preservando router, providers,
  i18n e Error Boundary existentes. Não há autenticação, estado de domínio,
  chamadas externas, formulários ou interação de produto.
- [ ] **AC-002 — Logo centralizada e responsiva:** a logo vem exclusivamente de
  `icons.logo.file`, mantém proporção e fica centralizada horizontal e
  verticalmente no viewport. O shell funciona em viewport estreito e largo,
  sem corte, deformação ou scroll horizontal.
- [ ] **AC-003 — Versão derivada do manifesto:** o texto exibido vem somente de
  `package.json.version`, por uma projeção que exporta apenas a versão. O
  componente não contém fallback literal de `1.0.0`, não usa query, hash,
  storage, ambiente ou backend e falha de forma explícita se a versão faltar,
  não for string SemVer ou divergir do lockfile.
- [ ] **AC-004 — Favicon único e local:** o bootstrap cria ou reutiliza um único
  `link[rel~="icon"]` usando `icons.favicon.file`, com `image/png` e sem
  duplicação, URL externa, `data:` inesperado ou alteração dos bytes da fonte.
- [ ] **AC-005 — Acessibilidade estrutural:** o shell possui landmark semântico,
  logo com texto alternativo significativo e versão como texto acessível. Não
  remove foco, cria `tabindex` artificial ou armadilha de teclado, e preserva
  contraste, zoom de 200–400% e `prefers-reduced-motion` da STORY-004.
- [ ] **AC-006 — Regressão da raiz:** acessar `/` diretamente, atualizar a
  página e abrir em `dev` e `preview` retorna o shell sem 404, tela vazia ou
  erro de console. Rota desconhecida não cria conteúdo de produto nem nova
  tela nesta Story.
- [ ] **AC-007 — Limite do Epic:** o diff contém somente shell, composição,
  leitura estreita da versão, uso do registry e favicon. Não há manifest PWA,
  Service Worker, headers, CSP, Supabase, queries, mutations, uploads ou
  qualquer fluxo de produto.

## Dependências e riscos

- Depende da implementação e validação das STORY-002 a STORY-011, especialmente
  router/i18n da STORY-005, baseline da STORY-004, tokens da STORY-010 e
  registry da STORY-011.
- Consome `package.json`, `package-lock.json` e o registry readonly de assets.
- A sintaxe de importação JSON deve ser compatível com as versões efetivas de
  TypeScript/Vite do scaffold; não é permitido expor o manifesto completo no
  bundle.
- Um favicon pré-existente pode gerar duplicidade se não for reutilizado ou
  substituído de forma controlada.
- O layout pode perder centralização ou exceder o viewport se for aplicado no
  elemento errado ou se o baseline global for alterado.
- O Web App Manifest, Service Worker e headers não pertencem a este Epic e
  devem permanecer no EPIC-003.

## Checklist de tarefas

- [ ] **T1 — Projetar metadado estreito da aplicação**
  - Owner: Dinesh Chugtai
  - Execution: sequential
  - Depends on: STORY-003
  - Done when: existe uma projeção que exporta somente `version`, valida string
    SemVer, compara a versão raiz do lockfile e não replica o manifesto no
    runtime.
- [ ] **T2 — Implementar o `AppShell` estático**
  - Owner: Dinesh Chugtai
  - Execution: sequential
  - Depends on: T1 e STORY-010
  - Done when: `AppShell` possui `main` semântico, logo do registry, versão
    textual, centralização responsiva e nenhum controle ou conteúdo de produto.
- [ ] **T3 — Conectar logo, versão e favicon ao bootstrap**
  - Owner: Dinesh Chugtai
  - Execution: sequential
  - Depends on: T2 e STORY-011
  - Done when: a logo usa somente `icons.logo.file`, a versão usa a projeção
    estreita e o bootstrap cria/reutiliza um único favicon com atributos
    constantes, sem HTML string ou URL externa.
- [ ] **T4 — Preservar composição e rota raiz**
  - Owner: Dinesh Chugtai
  - Execution: sequential
  - Depends on: T3
  - Done when: há um único `createRoot`, router e providers anteriores, `/`
    renderiza o shell e nenhuma rota ou provider de produto é adicionado.
- [ ] **T5 — Verificar segurança de DOM, assets e versão**
  - Owner: Elliot Alderson
  - Execution: sequential
  - Depends on: T4
  - Done when: não há HTML inseguro, URL remota, SVG importado, manifest,
    Service Worker, CSP, metadado excessivo do package ou leitura de entrada do
    usuário; o bundle expõe somente o necessário.
- [ ] **T6 — Validar shell, acessibilidade e regressão**
  - Owner: Felicity Smoak
  - Execution: sequential
  - Depends on: T5
  - Done when: centralização, responsividade, versão derivada, favicon único,
    refresh, dev, preview, typecheck, build, hook e limites têm evidência.

Todas as tarefas são sequenciais porque o shell, o bootstrap, o registry, a
versão e o favicon compartilham a composição raiz.

## Plano de testes

Roteiro fixo de review — finalizado pelo `flox-dev-story` ao concluir a
implementação, antes de mover a Story para `review`. É o único escopo que o
code review (STEM) verifica; cada check mapeia a um critério de aceitação.

- [ ] **Check 1 — Build e composição, mapeado ao AC-001**
  - Passos: executar `npm ci`, `typecheck`, `build`, `dev` e `preview`, contar
    chamadas a `createRoot` e inspecionar router/providers.
  - Resultado esperado: uma composição React monta o shell em `/`, sem
    providers duplicados, chamadas externas ou funcionalidade de produto.
  - Evidência (flox-dev-story): —
- [ ] **Check 2 — Centralização e responsividade, mapeado ao AC-002**
  - Passos: medir bounding box em 320×568, 375×667, 768×1024 e 1440×900,
    incluindo orientação paisagem e zoom de 400%.
  - Resultado esperado: bloco centralizado com tolerância máxima de 2 CSS px,
    proporção preservada, gutters seguros e sem overflow horizontal.
  - Evidência (flox-dev-story): —
- [ ] **Check 3 — Fonte da versão, mapeado ao AC-003**
  - Passos: comparar `package.json.version`, `package-lock.json` e texto
    renderizado; alterar uma cópia temporária para `9.8.7`, rebuildar e buscar
    `1.0.0` no código da aplicação.
  - Resultado esperado: o texto acompanha `9.8.7`, volta a `1.0.0` ao
    restaurar, não há hardcode/fallback e somente a versão necessária chega ao
    bundle.
  - Evidência (flox-dev-story): —
- [ ] **Check 4 — Favicon local único, mapeado ao AC-004**
  - Passos: montar/remontar o shell, inspecionar `link[rel~="icon"]`, requisitar
    a URL em dev e preview e comparar MIME, hash e origem.
  - Resultado esperado: exatamente um favicon local `image/png`, href igual ao
    registry, bytes correspondentes à fonte e nenhuma tag head arbitrária.
  - Evidência (flox-dev-story): —
- [ ] **Check 5 — Acessibilidade, mapeado ao AC-005**
  - Passos: inspecionar árvore acessível, alt text, versão, teclado, contraste,
    zoom de 200–400% e reduced motion.
  - Resultado esperado: landmark e conteúdo são compreensíveis, sem foco
    removido, tabindex artificial, clipping ou movimento indevido.
  - Evidência (flox-dev-story): —
- [ ] **Check 6 — Raiz e refresh, mapeado ao AC-006**
  - Passos: abrir `/`, acessar diretamente, atualizar em dev/preview e visitar
    rota desconhecida.
  - Resultado esperado: `/` retorna shell válido sem 404, blank screen ou erro
    de console; não surge conteúdo de produto.
  - Evidência (flox-dev-story): —
- [ ] **Check 7 — Segurança e limites, mapeado ao AC-007**
  - Passos: auditar bundle/imports, procurar `innerHTML`, `document.write`,
    `dangerouslySetInnerHTML`, SVG, manifest, Service Worker, CSP, fetch,
    Supabase e `git diff --name-only`.
  - Resultado esperado: não há APIs DOM inseguras, URL remota, metadado completo
    do package, PWA, headers, produto ou alteração dos PNGs.
  - Evidência (flox-dev-story): —

## Referências

- Architecture applicable: yes — [ARCH-001 v1](../../planning/architecture/ARCH-001-postify-foundation-v1.md) define a composição `src/app`, o router único, os assets compartilhados e a separação entre fundação e features.
- UX applicable: no — esta Story exibe somente um shell estrutural estático, sem fluxo, interação ou tela de produto.
- DS applicable: no — o shell consome tokens e assets já aprovados, sem criar componentes, variantes ou um Design System.
- Other links: [PRD-001](../../planning/prds/PRD-001-postify-mvp.md), [EPIC-001](../epics/EPIC-001-postify-foundation.md), [STORY-004](STORY-004-reset-baseline-global.md), [STORY-005](STORY-005-namespaces-router-i18n.md), [STORY-010](STORY-010-conectar-tokens-css-tailwind-ant.md), [STORY-011](STORY-011-svgr-assets-identidade.md), `package.json`, `package-lock.json` e [project-context.md](../../../project-context.md).
- Delivery boundary: [EPIC-003](../epics/EPIC-003-postify-delivery-platform.md), incluindo manifest PWA em STORY-028 e headers em STORY-032.
- Technical docs: [React createRoot](https://react.dev/reference/react-dom/client/createRoot) e [Vite JSON imports](https://vite.dev/guide/assets).

## Aprovação

Decision owner: Isaac
Decision: approved
Decided at: 2026-09-03
Justification: Isaac aprovou explicitamente esta versão da Story para execução.
