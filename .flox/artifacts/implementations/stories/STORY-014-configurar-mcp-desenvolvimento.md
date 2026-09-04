---
id: STORY-014
title: "Configurar ferramentas MCP de desenvolvimento no Codex e Claude Code"
status: review
---

# STORY-014 — Configurar ferramentas MCP de desenvolvimento no Codex e Claude Code

**Status:** review
**Source:** [SPEC-002 — Configurar Context7, Serena e Graphify no projeto](../specs/SPEC-002-mcp-development-tools.md) via `flox-quick-dev`

## História de usuário

Como pessoa desenvolvedora, quero ter Context7, Serena e Graphify configurados
no escopo do projeto para Codex e Claude Code, para consultar documentação
atual, navegar e editar o código semanticamente e entender dependências e
relacionamentos do repositório com um contrato reproduzível.

## Critérios de aceitação

- [x] **AC-001 — Configuração do Codex:** `.codex/config.toml` é TOML válido e
  declara os servidores MCP `context7`, `serena` e `graphify` habilitados no
  escopo do projeto.
- [x] **AC-002 — Configuração do Claude Code:** `.mcp.json` é JSON válido e
  declara os mesmos três servidores em stdio, sem divergência de comandos,
  caminhos ou credenciais persistidas.
- [x] **AC-003 — Context7 sem secret versionado:** Context7 usa
  `npx -y @upstash/context7-mcp`; `CONTEXT7_API_KEY`, quando usada, é recebida
  somente do ambiente e nenhum secret literal aparece nos arquivos ou no diff.
- [x] **AC-004 — Serena, Graphify e inicialização:** Serena detecta o projeto a
  partir do diretório de trabalho, usa `codex` no Codex e `claude-code` no
  Claude Code; Graphify aponta para `graphify-out/graph.json`; os servidores
  possuem timeouts explícitos adequados ao primeiro uso.
- [x] **AC-005 — Índice local do Graphify:** `graphify-out/` é ignorado pelo Git,
  `graphify extract . --code-only --no-viz` gera o índice local e
  `graphify-mcp graphify-out/graph.json` inicia em stdio para a verificação
  controlada.
- [x] **AC-006 — Regras de uso no projeto:** `AGENTS.md` e `CLAUDE.md` existem
  na raiz, têm instruções equivalentes e tornam obrigatório o uso de Context7
  para documentação atual de bibliotecas, frameworks, APIs e ferramentas,
  Serena para navegação do codebase, símbolos, referências e edição semântica e
  Graphify para dependências, arquitetura e relacionamentos quando as
  ferramentas estiverem disponíveis; quando responderem diretamente, devem
  ser preferidas à busca manual. Os arquivos também exigem evitar comentários
  explicativos e melhorar nomes, estrutura ou simplicidade quando o código não
  estiver claro.
- [x] **AC-007 — Escopo preservado:** a validação confirma `serena`,
  `graphify-mcp` e `npx` disponíveis, não altera `src/`, dependências npm,
  testes de produto ou artefatos Flox não relacionados e não versiona o índice
  gerado nem credenciais.

## Checklist de tarefas

- [x] **T1 — Criar a configuração MCP project-scoped do Codex**
  - Owner: Dinesh Chugtai
  - Execution: sequential
  - Depends on: none
  - Done when: `.codex/config.toml` declara os três servidores com os comandos,
    contextos, caminho do Graphify, allowlist de ambiente e timeouts definidos
    na SPEC-002, sem secret literal.
- [x] **T2 — Criar a configuração MCP project-scoped do Claude Code**
  - Owner: Dinesh Chugtai
  - Execution: sequential
  - Depends on: T1
  - Done when: `.mcp.json` declara os mesmos três servidores em stdio, usa o
    contexto `claude-code` no Serena e preserva a mesma configuração segura do
    Context7 e do Graphify.
- [x] **T3 — Registrar as regras de desenvolvimento e a saída gerada**
  - Owner: Dinesh Chugtai
  - Execution: sequential
  - Depends on: T2
  - Done when: `AGENTS.md` e `CLAUDE.md` contêm instruções equivalentes sobre o
    uso obrigatório das ferramentas e a regra de evitar comentários; `.gitignore`
    ignora `graphify-out/`.
- [x] **T4 — Validar configuração, launchers, Graphify e limite do diff**
  - Owner: Dinesh Chugtai
  - Execution: sequential
  - Depends on: T3
  - Done when: o Test Plan é executado, os três launchers resolvem, o índice é
    gerado, o servidor Graphify inicializa, os arquivos de configuração são
    aceitos pelos respectivos clientes e o diff permanece sem código de
    produto, dependências npm, secrets ou artefatos gerados.

Todas as tarefas são sequenciais porque a paridade entre os dois clientes, as
instruções compartilhadas e a validação final formam um único contrato.

## Test Plan

Roteiro fixo de review — finalizado pelo `flox-dev-story` ao concluir a
implementação, antes de mover a Story para `review`. É o único escopo que o
code review (STEM) verifica; cada check mapeia a um acceptance criterion.

- [x] **Check 1 — Configuração do Codex, mapeado ao AC-001**
  - Passos: validar `.codex/config.toml` com o parser/configuração do Codex e
    inspecionar a lista de servidores MCP.
  - Resultado esperado: TOML aceito e `context7`, `serena` e `graphify`
    aparecem habilitados no escopo do projeto.
  - Evidência (dev-story): `tomllib` aceitou `.codex/config.toml`; `codex mcp list --json` exibiu `context7`, `serena` e `graphify` habilitados em stdio, com timeouts de inicialização de 120s, 60s e 60s.
- [x] **Check 2 — Configuração do Claude Code, mapeado ao AC-002**
  - Passos: validar `.mcp.json` como JSON e executar `claude mcp list`.
  - Resultado esperado: JSON aceito e os três servidores stdio são listados;
    eventual aprovação de confiança do projeto fica registrada como estado
    operacional, não como erro de formato.
  - Evidência (dev-story): JSON aceito; `claude mcp get context7`, `claude mcp get serena` e `claude mcp get graphify` confirmaram `Scope: Project config (shared via .mcp.json)` e os timeouts de 120000ms, 60000ms e 60000ms. Os servidores permanecem pendentes de aprovação normal do projeto.
- [x] **Check 3 — Context7 e ausência de secrets, mapeado ao AC-003**
  - Passos: inspecionar comandos, variáveis e diff dos dois arquivos MCP com
    varredura de valores sensíveis.
  - Resultado esperado: o comando do Context7 é `npx -y
    @upstash/context7-mcp`, a chave é somente referenciada pelo ambiente e
    nenhum secret literal é encontrado.
  - Evidência (dev-story): os arquivos usam `npx -y @upstash/context7-mcp`, `CONTEXT7_API_KEY` apenas por allowlist/expansão do ambiente, e a varredura dos arquivos da Story não encontrou tokens ou credenciais literais.
- [x] **Check 4 — Serena, Graphify e timeouts, mapeado ao AC-004**
  - Passos: inspecionar os argumentos dos dois clientes e confirmar os
    contextos, o caminho `graphify-out/graph.json` e os timeouts explícitos.
  - Resultado esperado: Serena usa `codex` e `claude-code` nos clientes
    respectivos, Graphify usa o índice relativo previsto e os timeouts cobrem
    os servidores locais e o primeiro download do Context7.
  - Evidência (dev-story): Codex listou `serena start-mcp-server --project-from-cwd --context=codex` e `graphify-mcp graphify-out/graph.json`; Claude confirmou os equivalentes com `--context=claude-code`; os três servidores têm timeouts explícitos.
- [x] **Check 5 — Índice e servidor Graphify, mapeado ao AC-005**
  - Passos: executar a extração, verificar `git check-ignore
    graphify-out/graph.json` e realizar uma inicialização controlada do
    `graphify-mcp` em stdio.
  - Resultado esperado: o índice é gerado sem secret, é ignorado pelo Git e o
    servidor aceita a inicialização antes de ser encerrado.
  - Evidência (dev-story): `graphify extract . --code-only --no-viz` gerou `graphify-out/graph.json` com 108 nós e 103 arestas; `git check-ignore` confirmou o ignore; `graphify-mcp` respondeu ao `initialize` MCP com `serverInfo.name=graphify` e `serverInfo.version=0.9.53`.
- [x] **Check 6 — Instruções equivalentes e regra de clareza, mapeado ao AC-006**
  - Passos: comparar `AGENTS.md` e `CLAUDE.md` e inspecionar suas regras sobre
    Context7, Serena, Graphify, preferência por essas ferramentas e comentários
    explicativos.
  - Resultado esperado: os dois arquivos exigem as mesmas práticas e orientam
    melhorar a clareza do código antes de recorrer a comentários.
  - Evidência (dev-story): `diff -u AGENTS.md CLAUDE.md` não produziu diferenças; ambos estão em português e mantêm as regras equivalentes sobre Context7, Serena, Graphify, preferência por essas ferramentas e clareza sem comentários explicativos.
- [x] **Check 7 — Launchers e escopo, mapeado ao AC-007**
  - Passos: executar `command -v serena`, `command -v graphify-mcp` e
    `command -v npx`, depois inspecionar `git diff --check` e os arquivos
    alterados.
  - Resultado esperado: os launchers resolvem, não há erro de whitespace e o
    diff contém somente as configurações, instruções e ignore previstos, sem
    código de produto, dependência npm, secret ou índice gerado.
  - Evidência (dev-story): `command -v serena`, `command -v graphify-mcp` e `command -v npx` resolveram; `git diff --check` passou; não houve alteração em `src/`, dependências npm ou testes de produto, e o índice permaneceu ignorado.

## Dependências e riscos

- Serena e Graphify precisam estar instalados e acessíveis no `PATH` local.
- O primeiro uso do Context7 pode exigir rede via `npx`; a API key continua
  opcional e nunca é persistida.
- O índice do Graphify fica desatualizado após mudanças relevantes e deve ser
  regenerado localmente.
- Codex e Claude Code podem exigir aprovação de confiança dos servidores
  project-scoped em cada ambiente.

## References

- Architecture applicable: no — [ARCH-001 v1](../../planning/architecture/ARCH-001-postify-foundation-v1.md) cobre fronteiras do runtime e fluxos do MVP; esta Story trata somente de tooling de desenvolvimento.
- UX applicable: no — não cria fluxo, tela, estado de interface, responsividade ou acessibilidade de produto.
- DS applicable: no — não cria componentes, props, variantes, tokens ou contratos visuais.
- Other links: [SPEC-002](../specs/SPEC-002-mcp-development-tools.md) e [project-context.md](../../../project-context.md).

## Approval

Decision owner: Isaac
Decision: approved
Decided at: 2026-09-04
Justification: Story aprovada explicitamente pelo usuário.

## Code Review ledger

review_anchor: 6e54ec97cb89c68c4696daec2cb9cf321f4e9242
correction_handoffs: 0
findings: []

## Human decision record

decision: approved
decision_owner: Isaac
decided_at: 2026-09-04
justification: >
  Todos os 7 checks do Test Plan passaram sem achados. A mudança é exclusivamente de tooling de
  desenvolvimento — sem alteração em src/, dependências npm, testes de produto ou secrets. A
  superfície de segurança é mínima e controlada: CONTEXT7_API_KEY referenciada somente por
  allowlist/expansão de ambiente em ambos os clientes; nenhum secret literal presente no diff.
risk_acceptance: []

## Avaliação de risco

Natureza da mudança: configuração de servidores MCP project-scoped para Codex e Claude Code,
instrucões de desenvolvimento em AGENTS.md e CLAUDE.md, e entrada de gitignore. Nenhuma alteração
em código de produto, lógica de negócio, autenticação, APIs expostas ou infraestrutura.

Superfície de segurança: os arquivos de configuração referenciam executáveis locais (serena,
graphify-mcp, npx) e uma variável de ambiente opcional (CONTEXT7_API_KEY). Nenhum secret é
persistido no repositório. O padrão `${CONTEXT7_API_KEY:-}` no .mcp.json expande para string vazia
quando a variável não está presente, sem fallback inseguro.

**Pentest waived.**
Responsável: Isaac.
Justificativa: mudança restrita a tooling de desenvolvimento sem superfície de ataque relevante —
sem código de produto, sem auth, sem endpoints expostos, sem secrets no repositório.
Risco residual: dependência de executáveis externos (serena, graphify-mcp) instalados no PATH local;
aceitável para ferramentas de desenvolvimento com controle do desenvolvedor.
