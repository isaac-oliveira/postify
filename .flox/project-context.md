# Postify — Contexto do projeto

## O que o projeto faz

Postify é uma PWA para donos de pequenos negócios gerarem posts para redes
sociais de forma rápida, prática e visualmente consistente. O MVP previsto
cobre autenticação, onboarding da marca, dashboard, criação e edição de posts,
geração assíncrona de imagens e histórico de edição, conforme
[`docs/prompt-setup.md`](../docs/prompt-setup.md).

## Stack e diretórios importantes

O scaffold atualmente implementado usa Node.js 22.12.0, npm como package
manager, React 19, Vite 8, TypeScript strict, React Router, Ant Design,
Tailwind CSS, TanStack Query, Zustand, React Hook Form, Zod, i18n, Vitest e
MSW. As versões efetivas estão fixadas em `package.json` e
`package-lock.json`; `.nvmrc` e `.npmrc` fixam e enforçam Node 22.12.0.

O frontend implementado fica em `src/`, com composição em `src/app/`, pontos
reservados para features em `src/features/` e estado em `src/store/`. O shell
estático usa a rota raiz, assets locais, tokens CSS e Error Boundary. Utilitários
e testes unitários ficam em `src/utils/`.

`supabase/config.toml` e `supabase/functions/_shared/` reservam a fronteira
backend, mas ainda não existem migrations, Edge Functions, autenticação,
Storage, Realtime ou integrações de IA implementadas. `public/` contém o
favicon local. `docs/` contém o prompt do produto e a fonte documental de
tokens.

Playwright, ESLint, Prettier, CI/CD, Vercel e fluxos de produção continuam
previstos, mas não estão configurados no checkout atual.

## Como executar, testar e buildar

O runtime exige Node 22.12.0 e usa npm. Os comandos confirmados para o estado
atual são:

- `npm ci --ignore-scripts`
- `npm run prepare`
- `npm run typecheck`
- `npm test`
- `npm run build`
- `npm run dev`
- `npm run preview` após o build

Em 2026-09-15, `npm run typecheck`, `npm test` e `npm run build` passaram
localmente; os testes executaram 2 arquivos e 5 testes. Não existe script
`npm run lint` nem dependência/configuração Playwright neste estado. Lint,
CI, E2E e verificações manuais de UI são condicionais conforme o Quality
roadmap e só se tornam aplicáveis quando a ferramenta, o workflow ou a
superfície correspondente existir.

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
- A interface deve tratar loading, vazio, erro, acessibilidade básica e responsividade quando a superfície de UI correspondente existir.

## Foco imediato

Consolidar a fundação do scaffold e os critérios executáveis de Quality antes
de avançar para autenticação, marca, criação de posts, integrações de IA,
CI/CD ou deployment. Corrigir as associações inconsistentes de `SPEC-001` e
`SPEC-002` no índice de status e resolver o finding aberto da `STORY-007`
antes do Quality gate desses itens.
