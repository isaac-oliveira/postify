---
id: SPEC-002
title: "Configurar Context7, Serena e Graphify no projeto"
status: approved
---

# SPEC-002 — Configurar Context7, Serena e Graphify no projeto

**Source:** Pedido do usuário para adicionar Context7, Serena e Graphify ao projeto.

## Objective

Disponibilizar os três servidores MCP no escopo do projeto para uso pelo Codex
e pelo Claude Code, além de registrar em `AGENTS.md` e `CLAUDE.md` que seu uso
é obrigatório nas tarefas pertinentes, com configuração reproduzível, sem
secrets versionados e com o índice local do Graphify tratado como artefato
gerado.

## Context and assumptions

### Observed

- O repositório não possui configuração MCP project-scoped em `.codex/config.toml`.
- O repositório não possui configuração MCP project-scoped em `.mcp.json`.
- O repositório não possui `AGENTS.md` nem `CLAUDE.md` na raiz.
- O projeto já contém `.gitignore`, `.flox/` e código TypeScript/React; os MCPs
  são ferramentas de desenvolvimento e não dependências do produto.
- O ambiente atual possui os comandos `serena` e `graphify-mcp` disponíveis.
- O projeto usa `file_language = "pt-BR"` e o marcador de Setup está válido.

### Assumptions

- O alvo é a configuração project-scoped do Codex em `.codex/config.toml`,
  compartilhada pelos clientes Codex compatíveis, e a configuração project-
  scoped do Claude Code em `.mcp.json`.
- As instruções de projeto em `AGENTS.md` e `CLAUDE.md` orientarão Codex e
  Claude Code com regras equivalentes.
- Context7 será iniciado por stdio via `npx`, Serena por `serena` e Graphify
  por `graphify-mcp`, todos com execução local nos dois clientes.
- O Graphify lerá `graphify-out/graph.json`, gerado localmente com extração de
  código e não versionado.
- A variável opcional `CONTEXT7_API_KEY`, quando usada, será fornecida pelo
  ambiente local e nunca persistida no repositório.

## Questions and suggestions

- **Obrigatório:** nenhuma pergunta bloqueia a proposta sob as premissas acima.
- **Opcional:** manter `CONTEXT7_API_KEY` ausente para uso sem autenticação ou
  fornecê-la apenas no ambiente local para limites maiores.
- **Opcional:** regenerar o índice do Graphify após mudanças relevantes no
  código; não instalar hooks automáticos nesta entrega.
- **Opcional:** caso seja necessário configurar VS Code ou outro cliente além de
  Codex e Claude Code, abrir uma mudança separada com o formato correspondente.
- **Opcional:** o Claude Code pode exigir aprovação única dos servidores
  project-scoped ao abrir o projeto em um ambiente confiável.

## Scope

- Criar `.codex/config.toml` com três servidores MCP habilitados:
  - `context7`, usando `npx -y @upstash/context7-mcp` e allowlist da variável
    opcional `CONTEXT7_API_KEY`.
  - `serena`, usando `serena start-mcp-server --project-from-cwd
    --context=codex`.
  - `graphify`, usando `graphify-mcp graphify-out/graph.json`.
- Criar `.mcp.json` com os mesmos três servidores stdio para o Claude Code,
  usando o contexto `claude-code` para Serena e expansão segura de
  `CONTEXT7_API_KEY` sem persistir o valor.
- Definir timeouts de inicialização adequados para os servidores locais e para
  o primeiro download do Context7.
- Adicionar `graphify-out/` ao `.gitignore`, mantendo o índice e relatórios
  gerados fora do controle de versão.
- Criar `AGENTS.md` e `CLAUDE.md` na raiz com instruções equivalentes que tornem
  obrigatório o uso de Context7 para documentação de bibliotecas/APIs, Serena
  para navegação e edição semântica do código e Graphify para dependências,
  arquitetura e relacionamentos, quando as ferramentas estiverem disponíveis.
- Registrar nos dois arquivos que comentários explicativos em código devem ser
  evitados; se parecerem necessários para esclarecer a implementação, melhorar
  nomes, estrutura ou simplicidade do código antes de adicionar comentários.
- Validar a sintaxe da configuração, a disponibilidade dos launchers e a
  inicialização do Graphify após gerar um índice local de código.

## Out of scope

- Instalação global ou atualização de Serena, Graphify, Python, Node ou npm.
- Configuração de `~/.codex/config.toml`, `~/.claude.json` ou de clientes que
  não sejam Codex e Claude Code.
- Versionamento de `graphify-out/`, relatórios gerados, API keys ou qualquer
  outro secret.
- Hooks de commit, servidor HTTP compartilhado, autenticação remota e uso dos
  MCPs pela aplicação em runtime.
- Alterações em `src/`, dependências npm, testes de produto ou artefatos de
  planejamento já aprovados.

## Implementation approach

Criar a configuração project-scoped no formato TOML aceito pelo Codex e a
configuração JSON project-scoped aceita pelo Claude Code, mantendo os três
servidores equivalentes e sem valores sensíveis. Usar o contexto específico de
cada cliente para o Serena, um caminho relativo estável para o índice do
Graphify e uma allowlist/expansão de ambiente para a chave opcional do
Context7. Criar os dois arquivos de instruções com regras equivalentes e
explícitas sobre uso obrigatório e sobre evitar comentários no código, incluindo
como proceder quando uma ferramenta estiver indisponível. Ignorar apenas a
saída gerada do Graphify e validar ambas as configurações com os comandos
nativos disponíveis no ambiente.

## Acceptance criteria

- [ ] `.codex/config.toml` existe, é TOML válido e declara `context7`, `serena`
      e `graphify` como servidores MCP project-scoped habilitados.
- [ ] `.mcp.json` existe, é JSON válido e declara os mesmos três servidores
      stdio para o Claude Code, sem endpoints ou credenciais divergentes.
- [ ] Context7 usa `npx -y @upstash/context7-mcp` e não contém API key ou outro
      secret literal; a chave opcional é recebida somente do ambiente.
- [ ] Serena usa o contexto `codex`, detecta o projeto a partir do diretório de
      trabalho e possui timeout explícito de inicialização no Codex; no Claude
      Code usa o contexto `claude-code` e a mesma detecção local do projeto.
- [ ] Graphify aponta para `graphify-out/graph.json`, `graphify-out/` é ignorado
      pelo Git e o servidor inicia após a geração de um índice local de código.
- [ ] `AGENTS.md` e `CLAUDE.md` existem na raiz e registram, de forma equivalente,
      o uso obrigatório de Context7, Serena e Graphify nas situações pertinentes.
- [ ] `AGENTS.md` e `CLAUDE.md` orientam evitar comentários explicativos no
      código e melhorar clareza estrutural quando um comentário parecer necessário.
- [ ] A validação confirma os três launchers e não altera código da aplicação,
      dependências npm ou artefatos Flox não relacionados.

## Risks and dependencies

Serena e Graphify dependem de instalações locais acessíveis no `PATH`; Context7
depende de `npx` e pode exigir acesso de rede no primeiro uso. O índice do
Graphify pode ficar desatualizado se não for regenerado. As configurações são
project-scoped e podem exigir confiança/aprovação do projeto em cada cliente.
As instruções duplicadas podem divergir se forem editadas separadamente; a
validação deve confirmar que os requisitos obrigatórios permanecem equivalentes.
Nenhum secret deve entrar no arquivo ou no histórico Git.

## Validation plan

- Inspecionar `.codex/config.toml` com o parser/configuração do Codex.
  - Expected result: a configuração é aceita e lista os três servidores sem
    valores sensíveis.
- Inspecionar `.mcp.json` com o parser JSON e `claude mcp list`.
  - Expected result: o Claude Code lista `context7`, `serena` e `graphify` sem
    erro de formato; o estado pode aparecer como pendente até a aprovação do
    projeto, sem ser tratado como falha de configuração.
- Executar `command -v serena`, `command -v graphify-mcp` e `command -v npx`.
  - Expected result: os três launchers resolvem no ambiente de desenvolvimento.
- Executar `graphify extract . --code-only --no-viz`.
  - Expected result: `graphify-out/graph.json` é gerado localmente sem exigir
    uma chave de API.
- Executar `graphify-mcp graphify-out/graph.json` em uma verificação de
  inicialização controlada.
  - Expected result: o servidor MCP inicia em stdio e aceita a inicialização;
    o processo é encerrado após a verificação.
- Executar `git check-ignore graphify-out/graph.json` e `git diff --check`.
  - Expected result: o índice é ignorado e não há erros de whitespace.

## Approval

Decision owner: Isaac
Decision: approved
Decided at: 2026-09-04
Justification: Spec revisada aprovada explicitamente pelo usuário, incluindo suporte ao Codex e ao Claude Code.
