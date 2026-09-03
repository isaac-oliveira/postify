---
id: EPIC-001
title: "Fundação estrutural do Postify"
status: approved
---

# EPIC-001 — Fundação estrutural do Postify

**Status:** approved
**PRD:** [PRD-001 — MVP do Postify](../../planning/prds/PRD-001-postify-mvp.md)

## Objetivo

Deixar o repositório do Postify com a fundação local e reproduzível do runtime
frontend e backend, providers, contratos, estilos e shell visual. Ao final, o
shell estático deve estar rodando localmente com a logo centralizada, os tokens
aplicados e a versão `1.0.0` derivada do manifesto do projeto, sem entregar
fluxos de produto.

## Limites e fora do escopo

Este Epic cobre apenas o runtime inicial e a configuração de infraestrutura do
frontend e do Supabase: Commitlint e Lefthook como primeira barreira local,
Node, package manager e lockfile, TypeScript strict, reset e baseline global do
HTML/CSS, namespaces feature-based, React Router sem rotas de produto, i18n sem
conteúdo de produto, React Hook Form e Zod sem formulários ou schemas de
domínio, providers de TanStack Query e Zustand sem estado de domínio,
configuração segura de ambiente e cliente Supabase, fronteiras compartilhadas
do backend, tratamento global de erros, representação canônica dos tokens e
temas Tailwind e Ant Design, assets de identidade, suporte a SVG, versionamento
e shell visual estático.
Cada Story deve produzir uma mudança única, com limite explícito e sem esconder
uma funcionalidade de produto.

Ficam fora do Epic autenticação, onboarding, marca, Dashboard, sessões de post,
uploads, biblioteca de imagens, geração, edição, histórico, persistência de
domínio, RLS e policies de Storage de dados de produto, Realtime, integrações
com Claude ou fal.ai, rotas de produto, guards, formulários de produto,
queries, mutations, mocks de produto, PWA, ESLint, Prettier, Vitest, MSW,
Playwright, template de Pull Request, headers de entrega, proteção de branches,
CI, CD e comportamento de produto. O shell pode ser renderizado, mas não terá
interação de produto. Namespaces de features e rotas podem ser reservados, mas
não implementados.

## Riscos e dependências

Depende do PRD-001 aprovado, da arquitetura ARCH-001 aprovada, do contexto do
projeto em `.flox/project-context.md`, dos tokens em
`docs/assets/tokens.json` e dos assets em `docs/assets/`. O repositório ainda
não possui código, manifesto ou scripts executáveis.

Os principais riscos são o scaffold avançar acidentalmente para comportamento
de produto, providers duplicarem estado remoto, reset ou tema prejudicar
acessibilidade, tokens serem copiados ou divergirem entre temas, configurações
de ambiente exporem secrets e a versão exibida ficar diferente do manifesto. A
separação das Stories e a validação do shell devem manter esses limites
verificáveis em cada revisão.

## Mapa de Stories

| ID | Story name |
|---|---|
| STORY-001 | Configurar Commitlint e Lefthook como primeira barreira de qualidade local |
| STORY-002 | Inicializar runtime frontend reproduzível com Node, package manager, lockfile, React e Vite |
| STORY-003 | Habilitar TypeScript strict no scaffold sem regras de domínio |
| STORY-004 | Configurar reset do HTML e baseline global acessível sem estilos de produto |
| STORY-005 | Organizar namespaces feature-based, React Router e i18n sem rotas ou conteúdo de produto |
| STORY-006 | Configurar React Hook Form, Zod, TanStack Query e Zustand sem estado de domínio |
| STORY-007 | Estruturar scaffold, cliente Supabase e fronteiras backend sem domínio ou funções executáveis |
| STORY-008 | Validar configurações de ambiente e tratamento global de erros sem expor secrets |
| STORY-009 | Criar representação canônica dos tokens sem valores duplicados |
| STORY-010 | Conectar representação canônica a CSS, Tailwind e Ant Design |
| STORY-011 | Configurar SVGR e registrar logo, ícone e favicon sem componentes de produto |
| STORY-012 | Exibir shell estático com logo centralizada e versão 1.0.0 derivada do manifesto |

## Aprovação

Status atual: `approved`.

Aprovado pelo usuário em 2026-09-03.
