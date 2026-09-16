# Postify — comandos

- Desenvolvimento: `npm run dev`.
- Build de produção: `npm run build`.
- Preview local do build: `npm run preview`.
- Verificação TypeScript: `npm run typecheck`.
- Índice estrutural local: `graphify extract . --code-only --no-viz`.
- Servidor MCP do Graphify: `graphify-mcp graphify-out/graph.json`; o arquivo do índice é gerado e ignorado pelo Git.
- Em Darwin, confirme launchers com `command -v serena`, `command -v graphify-mcp` e `command -v npx`.
- Não há scripts npm dedicados para lint, testes ou format no manifesto atual; verificar `package.json` antes de executá-los.