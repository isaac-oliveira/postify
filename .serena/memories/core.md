# Postify — mapa do projeto

- Produto: PWA para criação de posts sociais com IA; requisitos de produto em `docs/prompt-setup.md`.
- Frontend atual: `src/main.tsx`, `src/app/`, `src/global.css`; diretórios previstos para evolução: `src/features/`, `src/store/`, `src/utils/`.
- Entrada da aplicação: `src/main.tsx` monta `I18nextProvider` e `RouterProvider`, importa i18n, router e estilos globais.
- Rotas atuais: `src/app/router.ts` cria browser router com `App` na rota `/`.
- Estado i18n atual: apenas `pt-BR`, configurado em `src/app/configs/i18n.ts`.
- Organização: manter feature-based; extrair código compartilhado somente com reutilização real.
- Contratos de stack e versões: `mem:tech_stack`.
- Convenções de implementação: `mem:conventions`.
- Comandos operacionais: `mem:suggested_commands`.
- Critérios de conclusão: `mem:task_completion`.