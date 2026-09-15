---
id: STORY-015
title: "Configurar Vitest e MSW sem testes ou handlers de produto"
status: proposed
---

# STORY-015 — Configurar Vitest e MSW sem testes ou handlers de produto

**Status:** proposed
**Origem:** [EPIC-002 — Experiência de desenvolvimento e qualidade do Postify](../epics/EPIC-002-postify-quality-foundation.md)

## História de usuário

Como pessoa desenvolvedora, quero uma base reproduzível de Vitest e MSW no
scaffold, para que testes futuros possam isolar integrações sem introduzir
testes, handlers ou comportamento de produto nesta etapa.

## Limites

Inclui a dependência de MSW, a configuração única do Vitest integrada ao Vite,
o script de teste existente, a configuração Node do MSW para testes e o
carregamento controlado do setup de testes. O Vitest deve continuar compatível
com TypeScript strict e com o baseline atual do scaffold.

O setup do MSW permanece sem handlers padrão de produto e não é importado pelo
runtime da aplicação. Requests não tratados devem ter uma política explícita
no ambiente de teste, sem permitir que chamadas externas sejam ocultadas.

Não inclui testes de produto, handlers de domínio, testes de componentes,
Service Worker, mocking no navegador, adapters, chamadas reais a serviços,
alteração de comportamento do shell, CI, deployment ou alteração de código de
produção não necessária para o tooling.

## Contrato de tooling

Vitest usa uma única fonte de configuração compatível com o Vite e com as
versões efetivas do projeto. A versão instalada permanece explícita em
`package.json` e `package-lock.json`, e `npm test` continua sendo o comando
canônico para a execução.

O comportamento de uma suíte sem arquivos de teste é determinístico e não
exige teste artificial para obter sucesso. Os testes utilitários já existentes
permanecem fora do escopo e não são alterados.

MSW usa exclusivamente `setupServer` de `msw/node` em arquivos de teste. O
servidor possui ciclo de vida explícito, isolamento entre testes e nenhum
handler de produto inicial. A política para requests não tratados é explícita
e impede bypass silencioso de chamadas externas não autorizadas.

## Critérios de aceitação

- [ ] **AC-001 — Dependências reproduzíveis:** Vitest permanece na versão
  explícita já adotada pelo projeto, MSW é adicionado em versão explícita e
  `package.json` e `package-lock.json` permanecem coerentes. Não há dependência
  de runtime adicionada para o tooling.
- [ ] **AC-002 — Configuração única do Vitest:** existe uma única configuração
  de teste integrada ao Vite, compatível com TypeScript strict, sem aliases,
  plugins ou opções duplicadas conflitantes. O script `npm test` executa essa
  configuração.
- [ ] **AC-003 — Execução sem testes de produto:** `npm test` executa o
  conjunto atual sem criar testes de produto e retorna um resultado previsível
  quando não há arquivos de teste correspondentes, sem exigir teste artificial
  ou alterar os testes utilitários existentes.
- [ ] **AC-004 — MSW Node isolado:** o setup de testes cria o servidor por
  `msw/node`, registra ciclo de vida de início, reset e encerramento e não
  contém handlers de produto, Service Worker, mocking de navegador ou import
  pelo runtime da aplicação.
- [ ] **AC-005 — Requests não tratados controlados:** a política de requests
  não tratados é explícita e uma chamada externa sem handler autorizado não é
  silenciosamente ignorada pelo setup de testes. O servidor não faz download,
  upload ou chamada a serviço externo durante a inicialização.
- [ ] **AC-006 — Regressão e limite estrutural:** `typecheck`, `test` e `build`
  continuam operacionais; o diff fica limitado a manifesto, lockfile,
  configuração e setup de testes. Não há alteração em componentes, features,
  shell, rotas, providers de produção ou comportamento de produto.

## Checklist de tarefas

- [ ] **T1 — Confirmar baseline e fonte única de configuração**
  - Owner: Dinesh Chugtai
  - Execution: sequential
  - Depends on: STORY-013 e STORY-003
  - Done when: scripts, versões de Vite/Vitest, TypeScript strict e arquivos de
    configuração atuais estão registrados; a estratégia escolhida não duplica
    a configuração do Vite.
- [ ] **T2 — Adicionar e fixar MSW**
  - Owner: Dinesh Chugtai
  - Execution: sequential
  - Depends on: T1
  - Done when: MSW está em `devDependencies` com versão explícita e lockfile
    coerente, sem dependência de runtime ou alteração não justificada.
- [ ] **T3 — Criar o setup Node neutro do MSW**
  - Owner: Dinesh Chugtai
  - Execution: sequential
  - Depends on: T2
  - Done when: `msw/node` fornece um servidor sem handlers de produto, com
    ciclo de vida isolado e política explícita para requests não tratados.
- [ ] **T4 — Integrar Vitest e setup de testes**
  - Owner: Dinesh Chugtai
  - Execution: sequential
  - Depends on: T3
  - Done when: `npm test` carrega a configuração única, usa o setup somente no
    ambiente de teste e trata a ausência de testes de forma previsível.
- [ ] **T5 — Validar tooling, regressão e escopo**
  - Owner: Felicity Smoak
  - Execution: sequential
  - Depends on: T4
  - Done when: o Test Plan é confirmado com evidência de instalação limpa,
    execução, typecheck, build, isolamento do MSW, política de requests e
    limite do diff.

Todas as tarefas são sequenciais porque dependências, configuração, setup,
lockfile e validação compartilham o mesmo contrato de execução.

## Plano de testes

Roteiro fixo de review — finalizado pelo `flox-dev-story` ao concluir a
implementação, antes de mover a Story para `review`. É o único escopo que o
code review (STEM) verifica; cada check mapeia a um critério de aceitação.

- [ ] **Check 1 — Dependências e lockfile, mapeado ao AC-001**
  - Passos: validar o manifesto, o lockfile e a instalação limpa das
    dependências de teste.
  - Resultado esperado: Vitest mantém a versão do projeto, MSW tem versão
    explícita e nenhum pacote de runtime novo é introduzido.
  - Evidência (flox-dev-story): —
- [ ] **Check 2 — Fonte única do Vitest, mapeado ao AC-002**
  - Passos: carregar a configuração de teste e inspecionar scripts, plugins,
    aliases e integração com Vite e TypeScript.
  - Resultado esperado: uma configuração é carregada sem conflito e `npm test`
    a utiliza.
  - Evidência (flox-dev-story): —
- [ ] **Check 3 — Suíte sem produto, mapeado ao AC-003**
  - Passos: executar o comando de teste com o conjunto atual e uma cópia
    temporária sem arquivos correspondentes.
  - Resultado esperado: o resultado é previsível, sem testes ou handlers de
    produto adicionados e sem alteração dos testes utilitários existentes.
  - Evidência (flox-dev-story): —
- [ ] **Check 4 — Ciclo de vida Node do MSW, mapeado ao AC-004**
  - Passos: inspecionar imports, handlers, setup do runner e ciclo de vida do
    servidor em uma execução controlada.
  - Resultado esperado: somente `msw/node` é usado, o servidor inicia, reseta e
    encerra corretamente e não há handler de produto ou Service Worker.
  - Evidência (flox-dev-story): —
- [ ] **Check 5 — Requests não tratados, mapeado ao AC-005**
  - Passos: realizar uma verificação controlada de request sem handler e
    inspecionar a política configurada e os efeitos de inicialização.
  - Resultado esperado: a chamada não é silenciosamente bypassada, não há
    request externo durante o setup e a falha é observável no teste.
  - Evidência (flox-dev-story): —
- [ ] **Check 6 — Regressão e limite, mapeado ao AC-006**
  - Passos: executar `typecheck`, `test` e `build`, revisar `git diff --check`
    e listar os arquivos alterados.
  - Resultado esperado: os comandos passam e o diff contém somente manifesto,
    lockfile, configuração e setup de testes previstos.
  - Evidência (flox-dev-story): —

## Dependências e riscos

- Depende do runtime, scripts e TypeScript strict estabelecidos pelo
  `EPIC-001`, especialmente `STORY-003`, e dos scripts canônicos da
  `STORY-013`.
- O Vitest `4.1.6` já está presente no manifesto atual; a Story deve evitar
  upgrade ou downgrade incidental ao adicionar o MSW.
- A configuração pode conflitar com plugins do Vite se houver duas fontes de
  configuração; a solução deve manter uma única origem efetiva.
- O ciclo de vida incorreto do MSW pode causar vazamento entre testes ou
  mascarar chamadas externas; a política de requests não tratados e o reset
  por teste precisam ser verificáveis.
- O uso de `msw/node` é deliberado: o mocking no navegador e o Service Worker
  pertencem a outra etapa e não podem entrar nesta Story.

## Referências

- Architecture applicable: no — [ARCH-001 v1](../../planning/architecture/ARCH-001-postify-foundation-v1.md) define limites do runtime, adapters e mocks do MVP, mas esta Story trata somente de tooling de desenvolvimento.
- UX applicable: no — não cria fluxo, tela, estado de interface, responsividade ou acessibilidade de produto.
- DS applicable: no — não cria componentes, props, variantes, tokens ou contratos visuais.
- Other links: [PRD-001](../../planning/prds/PRD-001-postify-mvp.md), [EPIC-002](../epics/EPIC-002-postify-quality-foundation.md), [STORY-003](STORY-003-habilitar-typescript-strict.md), [STORY-013](STORY-013-engine-strict-npmrc.md), `package.json`, `package-lock.json`, `vite.config.ts`, [Vitest configuration](https://github.com/vitest-dev/vitest/blob/v4.1.6/docs/config/index.md) e [MSW setupServer](https://github.com/mswjs/msw/blob/main/_autodocs/api-reference/setup-server.md).

## Aprovação

Decision owner: Isaac
Decision: proposed
Decided at: pendente
Justification: aguardando aprovação explícita desta versão da Story.
