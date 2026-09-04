---
id: STORY-009
title: "Criar representação canônica tipada dos tokens sem duplicação"
status: approved
---

# STORY-009 — Criar representação canônica tipada dos tokens sem duplicação

**Status:** approved
**Origem:** [EPIC-001 — Fundação estrutural do Postify](../epics/EPIC-001-postify-foundation.md)

## História de usuário

Como pessoa desenvolvedora, quero uma representação tipada, somente leitura e
derivada diretamente de `docs/assets/tokens.json`, para que ferramentas
posteriores consumam os tokens por uma única fronteira sem cópias ou
divergências.

## Limites

Inclui somente o consumo estático da fonte estruturada do Figma, a
representação canônica dentro de `src/app/configs/`, sua tipagem, validação de
paridade, determinismo e proteção contra mutação ou execução acidental. A
estratégia escolhida é importar diretamente `docs/assets/tokens.json` pela
única fronteira pública e executar um preflight sobre o conteúdo bruto para
detectar chaves duplicadas antes do parse normal do JSON; não há gerador nem
artefato intermediário nesta Story.

Não inclui CSS variables, Tailwind, Ant Design, temas, componentes, telas,
layouts, estilos de produto ou alteração de `docs/assets/tokens.json`. A
conexão visual pertence à STORY-010.

## Critérios de aceitação

- [ ] **AC-001 — Fonte única e inventário completo:** existe uma única fronteira
  pública em `src/app/configs/tokens.ts` (ou caminho equivalente definido pelo
  scaffold), derivada exclusivamente de `docs/assets/tokens.json`, preservando
  os grupos `colors`, `space`, `fontSize`, `radius`, `fontWeight` e
  `lineHeight`. O inventário atual de 72 folhas — 31 tokens `color` e 41
  tokens `number` — permanece completo, sem tokens extras ou ausentes.
- [ ] **AC-002 — Fidelidade tipada:** cada token preserva `$type`, `$value` e
  `$extensions`. Valores `color` mantêm `colorSpace`, `components`, `alpha` e
  `hex`; valores `number` mantêm o número original. Os metadados Figma
  presentes, incluindo `com.figma.variableId`, `com.figma.scopes` e o
  `com.figma.modeName` raiz, não são removidos, arredondados, convertidos em
  unidade ou renomeados. A API pública expõe `tokenDocument`, `TokenDocument`,
  `ColorToken` e `NumberToken` como representação readonly discriminada por
  `$type`, sem `any` ou casts que ocultem incompatibilidades.
- [ ] **AC-003 — Fronteira única e duplicação controlada:** consumidores
  posteriores importam somente a fronteira canônica; não existem mapas
  paralelos, constantes manuais ou cópias de valores em componentes, CSS,
  Tailwind ou Ant Design. Valores iguais em tokens distintos são preservados
  quando representam caminhos ou metadados distintos na fonte.
- [ ] **AC-004 — Dados inertes e somente leitura:** a representação expõe dados
  sem executar valores. Não usa `eval`, `Function`, shell, importação dinâmica
  derivada de token, interpolação em código, HTML, CSS, URL, query, log ou
  comando. A API aplica imutabilidade profunda em runtime, não possui efeitos
  colaterais, rede, telemetria ou dependência de ambiente. A serialização
  canônica ordena chaves de objeto de forma estável e preserva a ordem dos
  arrays definida pela fonte.
- [ ] **AC-005 — Validação fail-closed e mudanças detectáveis:** um preflight do
  conteúdo bruto rejeita chaves duplicadas antes de qualquer `JSON.parse` que
  possa sobrescrevê-las. JSON inválido, tipos incompatíveis, arrays
  inesperados, números não finitos, caracteres de controle e segmentos de
  nome com `/`, `\\`, `..`, `__proto__`, `constructor` ou `prototype` também
  são rejeitados; extensões estruturadas são preservadas sem execução e não
  são descartadas silenciosamente. Uma alteração isolada de valor, nome, tipo,
  estrutura ou metadado na fonte faz a representação mudar de forma
  correspondente ou faz a paridade falhar.
- [ ] **AC-006 — Ingestão e caminhos controlados:** a fronteira importa somente
  o caminho fixo de `docs/assets/tokens.json`, não interpreta nomes ou valores
  como caminhos e não escreve artefatos. A fonte permanece inalterada pela
  Story; não há geração, sobrescrita, symlink ou I/O adicional.
- [ ] **AC-007 — Supply chain restrita:** a Story não adiciona dependência
  externa sem justificativa. O preflight e a validação não fazem download,
  request, instalação dinâmica ou execução de script proveniente do JSON, e
  não leem `.env`, credenciais, chaves privadas ou variáveis de ambiente.
- [ ] **AC-008 — Escopo preservado:** o diff contém somente a fronteira
  canônica, tipos, fixtures e testes necessários. Não há componentes, telas,
  CSS, Tailwind, Ant Design, comportamento de produto ou alteração da fonte.

## Dependências e riscos

- Depende da implementação e validação das STORY-002 a STORY-008, que fornecem
  o runtime, TypeScript strict, namespace `app`, configuração segura e base de
  validação do projeto.
- Consome `ARCH-001 v1`, `docs/assets/tokens.json` e os limites de EPIC-001.
- O principal risco é criar um espelho manual que diverge da fonte ou colapsar
  tokens com valores iguais, perdendo nomes e metadados.
- A importação JSON pode exigir o ajuste mínimo de resolução de JSON previsto
  pelo scaffold; isso não autoriza gerar cópias paralelas nem avançar para
  CSS, Tailwind ou Ant Design.
- Conteúdo de arquivo e metadados devem ser tratados como dados opacos, nunca
  como código, caminho, configuração executável ou comando.

## Checklist de tarefas

- [ ] **T1 — Definir contrato público e estratégia de ingestão**
  - Owner: Dinesh Chugtai
  - Execution: sequential
  - Depends on: STORY-008
  - Done when: `TokenDocument`, `ColorToken`, `NumberToken` e `tokenDocument`
    estão definidos como contrato público readonly; a estratégia de importação
    estática e o preflight do conteúdo bruto estão documentados.
- [ ] **T2 — Implementar a fronteira readonly derivada da fonte**
  - Owner: Dinesh Chugtai
  - Execution: sequential
  - Depends on: T1
  - Done when: `src/app/configs/tokens.ts` importa diretamente o `tokens.json`,
    preserva a representação completa, aplica congelamento profundo e não cria
    consumidores paralelos ou integração de estilos.
- [ ] **T3 — Adicionar preflight, paridade e determinismo**
  - Owner: Dinesh Chugtai
  - Execution: sequential
  - Depends on: T2
  - Done when: `scripts/validate-tokens.mjs` (ou equivalente no namespace de
    validação do scaffold) detecta chaves duplicadas no conteúdo bruto antes
    do parse, compara o documento completo, valida tipos e metadados, garante
    caminhos e IDs únicos, serializa de forma determinística e detecta
    mudanças controladas da fonte, sem modificar o arquivo original ou rodar
    no bundle do navegador.
- [ ] **T4 — Executar validação de segurança e escopo**
  - Owner: Elliot Alderson
  - Execution: sequential
  - Depends on: T3
  - Done when: fixtures de injeção, chaves duplicadas, prototype pollution,
    execução e segredo não produzem efeito colateral ou vazamento; a revisão
    confirma ausência de rede, I/O fora do caminho fixo da fonte,
    dependências desnecessárias e comportamento fora da Story.
- [ ] **T5 — Validar fidelidade, determinismo e regressão**
  - Owner: Felicity Smoak
  - Execution: sequential
  - Depends on: T4
  - Done when: comparação estrutural, typecheck, determinismo, fonte intacta,
    comandos disponíveis e revisão de escopo confirmam todos os critérios.

Todas as tarefas são sequenciais porque a tipagem, a fronteira, as guardas e a
validação consomem a mesma fonte canônica.

## Plano de testes

Roteiro fixo de review — finalizado pelo `flox-dev-story` ao concluir a
implementação, antes de mover a Story para `review`. É o único escopo que o
code review (STEM) verifica; cada check mapeia a um critério de aceitação.

- [ ] **Check 1 — Inventário e equivalência, mapeado ao AC-001 e AC-002**
  - Passos: achatar a fonte e a representação por caminhos determinísticos e
    comparar conjuntos de caminhos, `$type`, `$value` e `$extensions`.
  - Resultado esperado: nenhuma folha ausente, extra, renomeada ou divergente;
    o baseline resulta em 72 folhas, 31 `color` e 41 `number`, com metadados
    Figma preservados.
  - Evidência (flox-dev-story): —
- [ ] **Check 2 — Contrato e somente leitura, mapeado ao AC-002 e AC-004**
  - Passos: executar typecheck, importar os exports públicos, tentar mutação
    superficial e aninhada e testar valores incompatíveis ou cores incompletas.
  - Resultado esperado: a representação válida compila, os exports têm tipos
    discriminados, a estrutura permanece congelada e fixtures inválidas falham
    sem casts permissivos ou execução.
  - Evidência (flox-dev-story): —
- [ ] **Check 3 — Fonte única e valores repetidos, mapeado ao AC-003**
  - Passos: revisar imports, procurar mapas e literais paralelos, contar
    caminhos e verificar a correspondência dos `variableId`.
  - Resultado esperado: cada caminho aparece uma vez; não há cópia manual nova
    e valores repetidos legítimos não são colapsados.
  - Evidência (flox-dev-story): —
- [ ] **Check 4 — Determinismo e consumo, mapeado ao AC-004**
  - Passos: executar duas cargas em processos limpos, gerar a serialização
    canônica com chaves ordenadas e arrays preservados, e importar a fronteira
    em um consumidor de teste.
  - Resultado esperado: serializações são idênticas, sem rede, ambiente, hora,
    estado global, efeitos colaterais ou dependência visual.
  - Evidência (flox-dev-story): —
- [ ] **Check 5 — Preflight, fixtures e alterações da fonte, mapeado ao AC-005**
  - Passos: testar o preflight com JSON inválido, chaves duplicadas,
    prototype pollution, controle, tipos inválidos, números não finitos,
    nomes path-like e cópias temporárias com valor, nome, tipo ou metadado
    alterado.
  - Resultado esperado: duplicidade é detectada antes do parse, entradas
    inválidas falham de forma determinística ou a mudança válida aparece na
    representação, nunca com aceitação parcial silenciosa; a fonte original
    permanece intacta.
  - Evidência (flox-dev-story): —
- [ ] **Check 6 — Supply chain, I/O e secrets, mapeado ao AC-006 e AC-007**
  - Passos: revisar dependências/scripts, bloquear rede, verificar o caminho
    fixo de importação, executar secret scan e inspecionar logs e bundle.
  - Resultado esperado: nenhum download, instalação dinâmica, I/O adicional,
    `.env`, credencial, segredo ou execução derivada do JSON.
  - Evidência (flox-dev-story): —
- [ ] **Check 7 — Regressão e limites, mapeado ao AC-008**
  - Passos: executar typecheck, testes, build e demais comandos existentes;
    revisar `git diff --name-only` e procurar alterações em CSS, Tailwind,
    Ant Design, componentes e telas.
  - Resultado esperado: Stories anteriores permanecem operacionais e o diff
    fica restrito à representação, tipos, fixtures e testes desta Story.
  - Evidência (flox-dev-story): —

## Referências

- Architecture applicable: yes — [ARCH-001 v1](../../planning/architecture/ARCH-001-postify-foundation-v1.md) define `docs/assets/tokens.json` como fonte estruturada, exige uma única fronteira de configuração ou geração e deixa CSS, Tailwind e Ant Design para a STORY-010.
- UX applicable: no — esta Story não cria fluxo, tela, estado ou interação de produto.
- DS applicable: no — esta Story não cria componentes, props, variantes ou temas; a integração visual pertence à STORY-010.
- Other links: [PRD-001](../../planning/prds/PRD-001-postify-mvp.md), [EPIC-001](../epics/EPIC-001-postify-foundation.md), [STORY-008](STORY-008-env-errors-safe.md), `docs/assets/tokens.json` e [project-context.md](../../../project-context.md).

## Aprovação

Decision owner: Isaac
Decision: approved
Decided at: 2026-09-03
Justification: Isaac aprovou explicitamente esta versão da Story para execução.
