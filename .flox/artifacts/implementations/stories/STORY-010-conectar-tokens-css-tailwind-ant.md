---
id: STORY-010
title: "Conectar tokens canônicos a CSS, Tailwind e Ant Design sem duplicação"
status: approved
---

# STORY-010 — Conectar tokens canônicos a CSS, Tailwind e Ant Design sem duplicação

**Status:** approved
**Origem:** [EPIC-001 — Fundação estrutural do Postify](../epics/EPIC-001-postify-foundation.md)

## História de usuário

Como pessoa desenvolvedora, quero projetar os tokens canônicos para CSS,
Tailwind e Ant Design por adaptadores únicos, para que o ecossistema visual
compartilhe os mesmos valores sem mapas manuais, divergências ou avanço para
componentes de produto.

## Limites

Inclui somente os adaptadores derivados de `tokenDocument`, a emissão
determinística de CSS custom properties em build time, os aliases da versão de
Tailwind adotada pelo scaffold e o `ThemeConfig` estrutural do Ant Design.

Não inclui novos valores de design, alteração de
`docs/assets/tokens.json`, componentes, telas, layouts, temas de produto,
variantes, estados, conteúdo, acessibilidade específica de componentes ou
integrações de domínio.

## Contrato de projeção

A única entrada dos adaptadores é `tokenDocument`, exposto pela STORY-009.
Nenhum consumidor lê `docs/assets/tokens.json` diretamente.

Os nomes CSS canônicos preservam o caminho de origem:

```text
colors.primary.500  -> --postify-colors-primary-500
space.md            -> --postify-space-md
fontSize.md         -> --postify-font-size-md
radius.md           -> --postify-radius-md
fontWeight.bold     -> --postify-font-weight-bold
lineHeight.md       -> --postify-line-height-md
```

A serialização aplica unidade somente no adaptador: `colors` preserva a cor
validada e o alpha; `space`, `fontSize`, `radius` e `lineHeight` recebem `px`;
`fontWeight` permanece unitless. Os 72 valores são derivados, não digitados
novamente.

Para Tailwind, a implementação usa exclusivamente a major instalada no
manifesto e lockfile. Em Tailwind v4, usa `@theme inline` e o plugin Vite
correspondente; em Tailwind v3, usa a configuração `theme.extend` compatível.
Não mistura os dois modelos, não atualiza a major nesta Story e falha
explicitamente se a versão instalada não for suportada.

Para Ant Design, o adaptador exporta um `ThemeConfig` readonly tipado para a
versão instalada e o conecta ao `ConfigProvider` raiz. O mapa semântico é
allowlisted e não tenta converter arbitrariamente todos os nomes Figma em
tokens Ant. A matriz aprovada é:

| Origem canônica | CSS/Tailwind | Ant Design |
|---|---|---|
| `colors.primary.400/.500/.600` | `--postify-colors-primary-*` / `--color-primary-*` | `colorPrimaryHover` / `colorPrimary` / `colorPrimaryActive` |
| `colors.background.50/.600/.700/.800/.900/.950` | `--postify-colors-background-*` / `--color-background-*` | `.50` em `colorBgBase` e `colorBgContainer`; demais como bridge CSS |
| `colors.border.700/.800` | `--postify-colors-border-*` / `--color-border-*` | `colorBorder` / `colorBorderSecondary` |
| `colors.content.50/.100/.400/.600/.950` | `--postify-colors-content-*` / `--color-content-*` | `colorTextLightSolid` / `colorTextQuaternary` / `colorTextTertiary` / `colorTextSecondary` / `colorText` |
| `colors.success.300/.500/.950` | `--postify-colors-success-*` / `--color-success-*` | `colorSuccessHover` / `colorSuccess` / `colorSuccessText` |
| `colors.warning.300/.500/.950` | `--postify-colors-warning-*` / `--color-warning-*` | `colorWarningHover` / `colorWarning` / `colorWarningText` |
| `colors.error.300/.500/.950` | `--postify-colors-error-*` / `--color-error-*` | `colorErrorHover` / `colorError` / `colorErrorText` |
| `colors.info.300/.500/.950` | `--postify-colors-info-*` / `--color-info-*` | `colorInfoHover` / `colorInfo` / `colorInfoText` |
| `colors.neutral.300/.500/.950` | `--postify-colors-neutral-*` / `--color-neutral-*` | bridge CSS, semântica Ant não inventada |
| `space.xs/sm/md/lg/xl/2xl/3xl/4xl/5xl/6xl` | `--postify-space-*` / `--spacing-*` | `xs`/`sm`/`md`/`lg`/`xl`/`2xl` em `paddingXXS`/`paddingXS`/`paddingSM`/`padding`/`paddingLG`/`paddingXL`; demais bridge CSS |
| `fontSize.2xs/xs/sm/md/lg/xl/2xl/3xl/4xl/5xl` | `--postify-font-size-*` / `--text-*` | `sm`/`md`/`lg`/`xl`/`2xl`/`3xl` em `fontSizeSM`/`fontSize`/`fontSizeLG`/`fontSizeXL`/`fontSizeHeading3`/`fontSizeHeading2`; demais bridge CSS |
| `radius.none/sm/md/lg/xl/2xl/full` | `--postify-radius-*` / `--radius-*` | `sm`/`md`/`lg` em `borderRadiusSM`/`borderRadius`/`borderRadiusLG`; demais bridge CSS |
| `fontWeight.regular/medium/semibold/bold` | `--postify-font-weight-*` / `--font-weight-*` | `regular` em `fontWeight` e `semibold` em `fontWeightStrong`; demais bridge CSS |
| `lineHeight.2xs/xs/sm/md/lg/xl/2xl/3xl/4xl/5xl` | `--postify-line-height-*` / `--leading-*` | bridge CSS; não converter `px` em razão unitless sem contrato tipográfico |

O resultado esperado é de 72 custom properties CSS, 72 aliases Tailwind e 40
folhas canônicas com mapeamento nativo do Ant Design; as 32 restantes ficam
disponíveis como bridge CSS, sem chaves Ant arbitrárias.

## Critérios de aceitação

- [ ] **AC-001 — Projetor único:** existe um adaptador puro sob
  `src/app/configs/` que recebe somente `tokenDocument` e projeta CSS,
  Tailwind e Ant Design. Nenhum adaptador lê a fonte JSON ou mantém valores
  manuais em paralelo.
- [ ] **AC-002 — CSS custom properties completas:** o build emite exatamente 72
  variáveis namespaced `--postify-*`, uma por folha canônica, com nomes
  determinísticos, sem colisão e com serialização por tipo. Cores preservam
  alpha; medidas recebem `px`; pesos permanecem unitless.
- [ ] **AC-003 — Tailwind version-aware:** a configuração usa apenas a major
  de Tailwind presente no manifesto e lockfile. V4 usa `@theme inline` e o
  plugin Vite correspondente; v3 usa `theme.extend`. Os 72 aliases referenciam
  as variáveis `--postify-*`, sem literais duplicados e sem mistura de APIs.
- [ ] **AC-004 — Tema Ant Design allowlisted:** existe `ThemeConfig` readonly
  compatível com a versão instalada, aplicado somente ao `ConfigProvider`
  estrutural raiz. O mapa contém apenas as associações aprovadas, fornece 40
  folhas por tokens nativos e mantém 32 folhas como bridge CSS. `lineHeight`
  não é convertido para número unitless sem contrato explícito.
- [ ] **AC-005 — Build determinístico e seguro:** CSS, aliases e configuração
  Ant são derivados em build time, sem arquivo gerado versionado, injeção de
  estilo da aplicação em runtime, `eval`, `Function`, importação dinâmica,
  rede ou execução de valores/names de tokens. Nomes são allowlisted,
  normalizados e falham em colisões; valores não podem introduzir `;`, `}`,
  comentários, funções CSS, URLs ou código.
- [ ] **AC-006 — Paridade propagável:** alterar uma folha do `tokenDocument`
  altera apenas as projeções correspondentes de CSS, Tailwind e Ant, sem
  editar manualmente mapas consumidores. Os metadados Figma não são emitidos
  em CSS, Tailwind ou Ant.
- [ ] **AC-007 — Regressão e acessibilidade estrutural:** o build, typecheck,
  dev, preview e instalação limpa continuam funcionando; o reset, foco
  visível e `prefers-reduced-motion` da STORY-004 permanecem intactos. Não há
  componentes, telas, estilos de produto ou comportamento de domínio.

## Dependências e riscos

- Depende da implementação e validação das STORY-002 a STORY-009, incluindo o
  manifesto com versões efetivas de Tailwind, plugin Vite e Ant Design.
- Consome `ARCH-001 v1`, `docs/assets/tokens.json` através de
  `tokenDocument` e os limites de EPIC-001.
- Se Tailwind ou Ant Design ainda não estiverem instalados, a implementação
  deve aguardar o scaffold e não instalar uma major ou atualizar dependências
  implicitamente nesta Story.
- Valores da fonte não possuem unidades explícitas; esta Story fixa `px` para
  medidas visuais e unidade sem dimensão para peso.
- O algoritmo de tema do Ant pode derivar estados diferentes da paleta Figma;
  por isso, somente o mapa allowlisted recebe semântica Ant.
- Um plugin fora da ordem correta pode impedir o Tailwind de enxergar os
  aliases; o build real é obrigatório para confirmar a integração.

## Checklist de tarefas

- [ ] **T1 — Fixar versões e contrato de projeção**
  - Owner: Dinesh Chugtai
  - Execution: sequential
  - Depends on: STORY-009
  - Done when: as versões efetivas de Tailwind, plugin Vite e Ant Design são
    lidas do manifesto/lockfile, o major suportado é confirmado e a matriz de
    nomes, unidades, alpha e 40/32 mapeamentos fica registrada sem upgrade
    implícito.
- [ ] **T2 — Implementar o projetor CSS build-time**
  - Owner: Dinesh Chugtai
  - Execution: sequential
  - Depends on: T1
  - Done when: o projetor puro emite as 72 variáveis `--postify-*` de forma
    determinística no pipeline Vite, sem arquivo gerado versionado, runtime
    style injection ou valores manuais.
- [ ] **T3 — Integrar aliases Tailwind**
  - Owner: Dinesh Chugtai
  - Execution: sequential
  - Depends on: T2
  - Done when: a configuração correspondente à major instalada expõe os 72
    aliases de cor, spacing, texto, radius, peso e line-height, sem misturar
    APIs v3/v4 e sem duplicar valores.
- [ ] **T4 — Integrar `ThemeConfig` e `ConfigProvider`**
  - Owner: Dinesh Chugtai
  - Execution: sequential
  - Depends on: T3
  - Done when: o `ThemeConfig` tipado expõe somente o mapa Ant allowlisted,
    conecta-se ao provider raiz e mantém os tokens bridge apenas no CSS.
- [ ] **T5 — Verificar fronteira e serialização segura**
  - Owner: Elliot Alderson
  - Execution: sequential
  - Depends on: T4
  - Done when: fixtures de nomes/valores perigosos, colisões, alpha, unidades,
    dependências e CSP não produzem CSS quebrado, execução, rede, segredo ou
    comportamento fora do escopo.
- [ ] **T6 — Validar paridade, acessibilidade e regressão**
  - Owner: Felicity Smoak
  - Execution: sequential
  - Depends on: T5
  - Done when: a matriz 72/72/40+32, builds, typecheck, instalação limpa,
    regressão do shell e baseline acessível têm evidência.

Todas as tarefas são sequenciais porque os três consumidores compartilham o
mesmo projetor, as mesmas unidades e o mesmo contrato canônico.

## Plano de testes

Roteiro fixo de review — finalizado pelo `flox-dev-story` ao concluir a
implementação, antes de mover a Story para `review`. É o único escopo que o
code review (STEM) verifica; cada check mapeia a um critério de aceitação.

- [ ] **Check 1 — Paridade dos projetores, mapeado ao AC-001 e AC-006**
  - Passos: achatar `tokenDocument`, comparar os 72 caminhos e alterar uma
    fixture de cada grupo.
  - Resultado esperado: CSS, aliases Tailwind e mapa Ant correspondente são
    derivados da mesma fonte, sem leitura paralela ou cópia manual.
  - Evidência (flox-dev-story): —
- [ ] **Check 2 — CSS namespaced e unidades, mapeado ao AC-002**
  - Passos: contar variáveis, testar nomes determinísticos, cores com alpha,
    medidas e pesos.
  - Resultado esperado: 72 variáveis únicas; medidas em `px`, pesos unitless,
    alpha preservado e nenhum valor literal manual novo.
  - Evidência (flox-dev-story): —
- [ ] **Check 3 — Tailwind da versão efetiva, mapeado ao AC-003**
  - Passos: confirmar versão no manifesto/lockfile, compilar uma fixture com
    utilities de cor, spacing, texto, radius, peso e line-height.
  - Resultado esperado: somente o ramo suportado é usado, o build gera
    utilities a partir dos aliases e falha claramente para major não suportada
    ou configuração v3/v4 misturada.
  - Evidência (flox-dev-story): —
- [ ] **Check 4 — Ant Design allowlisted, mapeado ao AC-004**
  - Passos: executar typecheck do `ThemeConfig`, materializar o tema pela API
    da versão instalada e inspecionar as chaves emitidas.
  - Resultado esperado: 40 folhas possuem mapeamento nativo, 32 permanecem
    bridge CSS, não há chaves Figma arbitrárias e `lineHeight` não recebe
    conversão unitless indevida.
  - Evidência (flox-dev-story): —
- [ ] **Check 5 — Injeção e supply chain, mapeado ao AC-005**
  - Passos: usar fixtures com `;`, `}`, comentários, `url()`, funções CSS,
    aspas, barras, `__proto__`, colisões e valores inválidos; revisar scripts,
    rede, CSP e bundle.
  - Resultado esperado: o build falha fechado sem CSS parcial, execução,
    request, download, runtime style injection ou dependência inesperada.
  - Evidência (flox-dev-story): —
- [ ] **Check 6 — Determinismo e fonte intacta, mapeado ao AC-005 e AC-006**
  - Passos: executar duas compilações limpas e revisar hashes, logs,
    `docs/assets/tokens.json` e o diff.
  - Resultado esperado: saídas byte-a-byte idênticas, metadados não vazam para
    estilos, fonte sem alteração e ausência de artefato gerado versionado.
  - Evidência (flox-dev-story): —
- [ ] **Check 7 — Regressão e acessibilidade, mapeado ao AC-007**
  - Passos: executar `npm ci`, `typecheck`, testes, `dev`, `build`, `preview` e
    `prepare`; verificar foco visível, reduced motion, router, i18n, reset,
    placeholder e hook.
  - Resultado esperado: shell anterior continua funcional e nenhuma regra
    global de acessibilidade é removida ou substituída.
  - Evidência (flox-dev-story): —
- [ ] **Check 8 — Limite da Story, mapeado ao AC-007**
  - Passos: revisar `git diff --name-only`, imports e dependências.
  - Resultado esperado: somente adaptadores, configuração de build, aliases,
    tema estrutural e testes necessários aparecem; não há produto, domínio,
    componentes, telas ou alteração da fonte.
  - Evidência (flox-dev-story): —

## Referências

- Architecture applicable: yes — [ARCH-001 v1](../../planning/architecture/ARCH-001-postify-foundation-v1.md) exige consumo dos tokens por uma única fronteira e separa a fundação visual das features de produto.
- UX applicable: no — esta Story configura infraestrutura visual, sem criar fluxos, telas ou conteúdo de usuário.
- DS applicable: no — não cria ou substitui um Design System; apenas projeta a fonte de tokens aprovada para os consumidores técnicos existentes.
- Other links: [PRD-001](../../planning/prds/PRD-001-postify-mvp.md), [EPIC-001](../epics/EPIC-001-postify-foundation.md), [STORY-009](STORY-009-representacao-canonica-tokens.md), `docs/assets/tokens.json` e [project-context.md](../../../project-context.md).
- Technical docs: [Tailwind theme variables](https://tailwindcss.com/docs/theme), [Tailwind Vite](https://tailwindcss.com/docs/installation/using-vite) e [Ant Design theme customization](https://ant.design/docs/react/customize-theme).

## Aprovação

Decision owner: Isaac
Decision: approved
Decided at: 2026-09-03
Justification: Isaac aprovou explicitamente esta versão da Story para execução.
