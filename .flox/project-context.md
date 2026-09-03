# Postify — Contexto do projeto

## O que o projeto faz

Postify é uma PWA para donos de pequenos negócios gerarem posts para redes
sociais de forma rápida, prática e visualmente consistente. O MVP cobre
autenticação, onboarding da marca, dashboard, criação e edição de posts, geração
assíncrona de imagens e histórico de edição, conforme
[`docs/prompt-setup.md`](../docs/prompt-setup.md).

## Stack e diretórios importantes

- Frontend: React, TypeScript strict, Vite, React Router, Ant Design, Tailwind CSS, TanStack Query, Zustand, React Hook Form, Zod, i18n, PWA e SVGR.
- Backend: Supabase Auth, PostgreSQL, RLS, Storage, Edge Functions e Realtime quando necessário.
- IA: Claude Haiku para normalização de prompts e fal.ai com GPT Image 2 para geração ou edição.
- Qualidade: ESLint, Prettier, Lefthook, Vitest, MSW e Playwright.
- Entrega: GitHub Actions, Vercel e Supabase CLI.
- Frontend previsto: `src/app/`, `src/features/`, `src/store/`, `src/utils/` e `src/global.css`.
- Backend previsto: `supabase/functions/_shared/`, Edge Functions específicas e `supabase/migrations/`.

O código deve seguir organização feature-based. Código compartilhado deve ser
extraído somente quando houver reutilização real.

## Como executar, testar e buildar

O repositório ainda não possui código, manifesto de dependências ou scripts de
execução, teste e build. Esses comandos serão definidos durante o scaffold.
Quando implementados, a validação exigirá lint, typecheck, testes unitários e de
integração, build e os testes E2E relevantes.

## Convenções e restrições

- O Figma é a fonte de verdade para telas e componentes; consultar o design antes de implementar UI.
- Claude e fal.ai possuem responsabilidades separadas; chamadas de IA e secrets ficam no backend.
- Toda entrada externa é não confiável e deve ser validada antes e depois de cada fronteira.
- Dados de usuários devem respeitar autorização por recurso, RLS e Storage policies.
- O pipeline de geração é assíncrono e recuperável após fechar ou reabrir a aplicação.
- Integrações externas devem ser substituíveis por mocks, sem espalhar condições de mock pela aplicação.
- TanStack Query gerencia estado remoto; Zustand fica restrito ao estado global de cliente realmente necessário.
- A arquitetura suporta múltiplas marcas, mas o MVP limita cada usuário a uma marca por regra de negócio.
- O MVP não exige testes de componentes.
- A interface deve tratar loading, vazio, erro, acessibilidade básica e responsividade.

## Foco imediato

Estruturar o scaffold do MVP descrito em `docs/prompt-setup.md`, começando pelos
contratos, limites entre frontend, Supabase e integrações de IA e pelos fluxos
de autenticação, marca e criação de posts.
