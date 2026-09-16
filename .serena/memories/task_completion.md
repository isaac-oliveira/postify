# Postify — conclusão de tarefa

- Executar `npm run typecheck`.
- Executar `npm run build`.
- Executar `git diff --check`.
- Para mudanças de tooling MCP, validar TOML/JSON, launchers, `git check-ignore graphify-out/graph.json` e o handshake stdio do servidor afetado.
- Inspecionar `git status --short --branch` e confirmar que não há alterações em `src/`, dependências ou artefatos gerados fora do escopo.
- Não declarar lint, testes ou format como executados quando os scripts correspondentes não existirem em `package.json`.