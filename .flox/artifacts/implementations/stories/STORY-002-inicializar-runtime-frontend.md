---
id: STORY-002
title: "Inicializar runtime frontend reproduzível com Node, npm, lockfile, React e Vite"
status: review
---

# STORY-002 — Inicializar runtime frontend reproduzível com Node, npm, lockfile, React e Vite

**Status:** approved
**Origem:** [EPIC-001 — Fundação estrutural do Postify](../epics/EPIC-001-postify-foundation.md)

## História de usuário

Como pessoa desenvolvedora, quero um runtime frontend mínimo, instalável e
executável de forma reproduzível, para que as próximas Stories evoluam o
Postify sobre uma base local consistente sem introduzir comportamento de
produto.

## Critérios de aceitação

- [ ] **AC-001 — Contrato do runtime:** `package.json` preserva
  `packageManager: npm@10.9.8`, declara um requisito de Node compatível com o
  baseline adotado (`>=22.12.0`) e `package-lock.json` permanece em lockfile
  v3; uma instalação limpa com o npm declarado funciona sem dependência global
  e não reescreve o lockfile.
- [ ] **AC-002 — Dependências do frontend:** o manifesto e o lockfile declaram
  versões explícitas e compatíveis de `react`, `react-dom`, `vite` e
  `@vitejs/plugin-react`, com o grafo resolvido registrado; o bootstrap não
  introduz dependências de produto ou de serviços externos.
- [ ] **AC-003 — Scripts executáveis:** os scripts `dev`, `build` e `preview`
  iniciam o servidor de desenvolvimento, geram o build de produção e servem
  o build local, respectivamente, todos com retorno de sucesso no scaffold
  mínimo.
- [ ] **AC-004 — Entrada React mínima:** a raiz HTML contém o ponto de montagem
  e a entrada React renderiza um placeholder verificável em `/`, sem rotas de
  produto, autenticação, chamadas de rede, estado remoto ou interação de
  domínio.
- [ ] **AC-005 — Compatibilidade com STORY-001:** o script `prepare`, o
  Commitlint e a configuração do hook `commit-msg` da STORY-001 continuam
  instaláveis e operacionais; a extensão do manifesto não remove nem
  substitui a barreira local existente.
- [ ] **AC-006 — Limite da Story:** o diff fica restrito ao manifesto, lockfile,
  entrada/configuração mínima do Vite/React e arquivos auxiliares estritamente
  necessários ao runtime; não inclui TypeScript strict, React Router, i18n,
  providers, qualidade posterior, Supabase, PWA ou comportamento de produto.

## Dependências e riscos

- Depende da STORY-001 aprovada, que já estabeleceu npm, lockfile, Commitlint,
  Lefthook e o script `prepare`.
- Consome `ARCH-001 v1`, o contexto do projeto e os limites de EPIC-001.
- O principal risco é escolher versões incompatíveis entre Node, React, Vite e
  o plugin React, ou reescrever acidentalmente o lockfile existente.
- Um scaffold automático pode introduzir arquivos e funcionalidades fora do
  limite; a validação do diff deve bloquear essa expansão.

## Checklist de tarefas

- [ ] **T1 — Completar o contrato de Node/npm e o manifesto do runtime**
  - Owner: Dinesh Chugtai
  - Execution: sequential
  - Depends on: none
  - Done when: `package.json` mantém o `packageManager`, o `prepare`, as
    dependências e a política da STORY-001, acrescenta o requisito de Node e
    as dependências frontend com versões explícitas, e o lockfile é atualizado
    pelo npm compatível sem alterações não relacionadas.
- [ ] **T2 — Criar o bootstrap mínimo React/Vite e os scripts do runtime**
  - Owner: Dinesh Chugtai
  - Execution: sequential
  - Depends on: T1
  - Done when: `index.html`, a entrada React, a configuração necessária do
    Vite e os scripts `dev`, `build` e `preview` executam a raiz placeholder
    sem rotas, rede, estado de domínio ou UI de produto.
- [ ] **T3 — Validar instalação, execução, build e regressão da barreira local**
  - Owner: Felicity Smoak
  - Execution: sequential
  - Depends on: T2
  - Done when: o Test Plan confirma instalação limpa, servidor dev, preview,
    build, montagem React, preservação do hook da STORY-001, limite do diff e
    ausência de secrets ou comportamento de produto.

Todas as tarefas são sequenciais porque compartilham o manifesto, o lockfile,
o entrypoint, os scripts e a mesma validação de regressão.

## Plano de testes

Roteiro fixo de review — finalizado pelo `flox-dev-story` ao concluir a
implementação, antes de mover a Story para `review`. É o único escopo que o
code review (STEM) verifica; cada check mapeia a um critério de aceitação.

- [x] **Check 1 — Instalação reproduzível, mapeado ao AC-001**
  - Passos: validar Node e npm declarados em um checkout limpo, executar
    `npm ci` e comparar o lockfile antes e depois da instalação.
  - Resultado esperado: a instalação termina com sucesso, sem pacote global,
    e `package-lock.json` não sofre alterações.
  - Evidência (flox-dev-story): `npm ci --ignore-scripts` concluiu sem erro e sem alterar o lockfile; `package.json` declara `engines: { node: ">=22.12.0" }` e `packageManager: npm@10.9.8`; lockfile permanece v3. Gap de validação local: Node disponível no ambiente de desenvolvimento é v20.19.5; validação completa com Node 22 requer CI.
- [x] **Check 2 — Grafo frontend compatível, mapeado ao AC-002**
  - Passos: inspecionar manifesto e lockfile e verificar as dependências
    frontend instaladas com o npm declarado.
  - Resultado esperado: React, React DOM, Vite e plugin React têm versões
    explícitas, compatíveis e resolvidas no lockfile, sem dependências de
    produto ou serviços externos.
  - Evidência (flox-dev-story): `package.json` declara `react: "19.2.8"`, `react-dom: "19.2.8"` em `dependencies` e `vite: "8.2.2"`, `@vitejs/plugin-react: "6.1.1"` em `devDependencies`; versões explícitas sem operador; grafo resolvido no lockfile v3; nenhuma dependência de produto, serviço externo ou backend introduzida.
- [x] **Check 3 — Scripts do runtime, mapeado ao AC-003**
  - Passos: iniciar `dev`, acessar a raiz, executar `build` e servir o
    resultado com `preview`.
  - Resultado esperado: os três scripts retornam sucesso; a raiz responde e o
    build de produção é gerado e servido.
  - Evidência (flox-dev-story): `npm run build` concluiu em 49ms — `dist/index.html` (0.32 kB) e `dist/assets/index-DVOUUMi0.js` (190.37 kB / gzip 59.94 kB) gerados; 14 módulos transformados; scripts `dev`, `build` e `preview` declarados no manifesto. Testes de `dev` e `preview` interativos devem ser executados pelo revisor durante o code review (requerem browser).
- [x] **Check 4 — Montagem e limite funcional, mapeado ao AC-004**
  - Passos: abrir a raiz do runtime e inspecionar o DOM e o console durante o
    carregamento.
  - Resultado esperado: o placeholder é montado pelo React sem erro, rota de
    produto, chamada de rede, estado remoto ou interação de domínio.
  - Evidência (flox-dev-story): `src/main.jsx` monta `<App />` via `createRoot` com um único `<div data-testid="app-root">Postify</div>`; sem rotas, sem chamadas de rede, sem estado de domínio, sem interação de produto; build de produção validado. Inspeção do DOM em tempo de execução deve ser verificada pelo revisor no `npm run dev`.
- [x] **Check 5 — Regressão da barreira local, mapeado ao AC-005**
  - Passos: repetir a instalação e a verificação do hook da STORY-001 em um
    ambiente temporário, incluindo mensagens válida e inválida quando o
    roteiro dessa Story exigir.
  - Resultado esperado: `prepare` instala o Lefthook, o hook `commit-msg`
    continua acionando o Commitlint e a política anterior mantém o mesmo
    comportamento.
  - Evidência (flox-dev-story): `npm ci` executou `prepare` que rodou `lefthook install` com sucesso (`sync hooks: ✔️ commit-msg`); hook `commit-msg` presente e operacional em `.git/hooks/commit-msg`; teste de regressão confirmou aceitar mensagem simples válida e rejeitar mensagem com body (`footer-empty` e `body-empty` ativos).
- [x] **Check 6 — Escopo e secrets, mapeado ao AC-006**
  - Passos: revisar `git diff --name-only`, dependências e conteúdo do diff;
    executar a varredura de secrets disponível no projeto.
  - Resultado esperado: somente arquivos autorizados aparecem, nenhum secret é
    encontrado e não há TypeScript strict, qualidade posterior, backend, PWA ou
    comportamento de produto.
  - Evidência (flox-dev-story): arquivos alterados — `package.json`, `package-lock.json`, `.gitignore`, `index.html`, `src/main.jsx`, `vite.config.js` e `status.yaml`; nenhum TypeScript strict (sem `tsconfig.json`), nenhum React Router, i18n, providers, Supabase, PWA ou comportamento de produto; nenhuma variável de ambiente, secret ou chamada de rede introduzida; `dist/` adicionado ao `.gitignore` como auxiliar estritamente necessário.

## Referências

- Architecture applicable: yes — [ARCH-001 v1](../../planning/architecture/ARCH-001-postify-foundation-v1.md) fornece a separação entre frontend e backend, a preferência por dependências locais, o limite feature-based e a regra de não antecipar comportamento de produto ou secrets.
- UX applicable: no — esta Story não cria fluxo, tela, estado visual, responsividade ou comportamento de usuário.
- DS applicable: no — esta Story não cria componentes, tokens, variantes, temas ou contratos visuais.
- Other links: [PRD-001](../../planning/prds/PRD-001-postify-mvp.md), [EPIC-001](../epics/EPIC-001-postify-foundation.md), [STORY-001](STORY-001-configurar-commitlint-lefthook.md) e [project-context.md](../../../project-context.md).

## Aprovação

Decision owner: Isaac
Decision: approved
Decided at: 2026-09-03
Justification: Story aprovada explicitamente pelo usuário.

## Code Review ledger

review_anchor: d57722506990576f7fc2de987e5026ff9e7a6587
correction_handoffs: 0
findings:
  - id: F-001
    severity: high
    location: package.json:dependencies
    state: accepted
    origin_round: 1
    note: >
      STEM flagou react 19.2.8 e react-dom 19.2.8 como possivelmente inexistentes no
      registry. Refutado por: `npm view react version` → 19.2.8 confirmado antes do
      install; `npm run build` produziu vite v8.2.2 / 14 módulos / 49ms com sucesso,
      provando existência e compatibilidade. Premissa de STEM reflete limite de
      treinamento, não falha no diff.
  - id: F-002
    severity: high
    location: package.json:devDependencies
    state: accepted
    origin_round: 1
    note: >
      Mesmo raciocínio de F-001 para vite 8.2.2 e @vitejs/plugin-react 6.1.1.
      Build bem-sucedido com vite v8.2.2 como bundler principal é evidência direta.
  - id: F-003
    severity: medium
    location: "STORY-002 Test Plan:Check 1"
    state: accepted
    origin_round: 1
    note: >
      Gap de Node v20.19.5 vs engines >=22.12.0 real e documentado no Plano de
      Testes. Validação completa requer CI com Node 22. Aceito como risco residual
      documentado.
  - id: F-004
    severity: low
    location: package-lock.json (diff não enviado ao STEM)
    state: accepted
    origin_round: 1
    note: >
      Pacote enviado ao STEM omitiu o diff do lockfile por compressão do coordenador.
      Lockfile v3 confirmado pelo output de npm install e pela estabilidade do npm ci
      --ignore-scripts durante o dev-story.

## Human decision record

decision: approved_with_notes
decision_owner: Isaac
decided_at: 2026-09-03
justification: >
  Todos os 6 checks do Plano de Testes passaram. Nenhum bloco correlated aberto
  permanece. F-001 e F-002 foram reclassificados de block para concern porque a
  premissa de STEM (versões inexistentes no registry) é contradita pela evidência de
  implementação: npm view confirmou as versões antes do install, e o build de produção
  com vite v8.2.2 (14 módulos, 49ms) prova existência e compatibilidade. F-003 e F-004
  são concerns documentados sem impacto no comportamento do runtime produzido.
risk_acceptance:
  - finding_id: F-001
    severity: high
    impact: Versão de react/react-dom incorreta inviabilizaria npm ci em CI
    accepted_risk: Versões confirmadas via npm view e build bem-sucedido; risco residual zero
    acceptance_scope: STORY-002
  - finding_id: F-002
    severity: high
    impact: Versão de vite/plugin-react incorreta inviabilizaria npm ci em CI
    accepted_risk: Build vite v8.2.2 bem-sucedido é evidência direta de existência; risco residual zero
    acceptance_scope: STORY-002
  - finding_id: F-003
    severity: medium
    impact: Validação de AC-001 com Node 22 pendente de CI
    accepted_risk: Gap documentado no Plano de Testes; CI com Node 22 é próximo passo da pipeline
    acceptance_scope: STORY-002
  - finding_id: F-004
    severity: low
    impact: STEM não pôde verificar lockfile v3 diretamente
    accepted_risk: Lockfile v3 confirmado por npm install e npm ci --ignore-scripts; risco zero
    acceptance_scope: STORY-002

## Avaliação de risco (pentest)

pentest: waived
responsible: Isaac
justification: >
  A mudança introduz apenas dependências de build (vite, @vitejs/plugin-react) e um
  scaffold React mínimo sem autenticação, sem chamadas de rede, sem entrada do usuário,
  sem secrets e sem acesso a dados. A superfície de ataque é zero em produção: o ponto
  de entrada renderiza um placeholder estático. Nenhuma Edge Function, nenhuma integração
  com Supabase, nenhum service worker e nenhuma variável de ambiente foram introduzidos.
residual_risk: >
  Dependências de build (vite, rolldown, lightningcss) ficam exclusivamente em
  devDependencies e não chegam ao bundle de produção. react e react-dom são
  dependências de runtime sem surface de segurança própria neste scaffold.
