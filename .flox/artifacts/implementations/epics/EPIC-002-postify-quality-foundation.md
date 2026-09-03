---
id: EPIC-002
title: "Experiência de desenvolvimento e qualidade do Postify"
status: approved
---

# EPIC-002 — Experiência de desenvolvimento e qualidade do Postify

**Status:** approved
**PRD:** [PRD-001 — MVP do Postify](../../planning/prds/PRD-001-postify-mvp.md)

## Objetivo

Tornar o desenvolvimento do Postify reproduzível e o review humano mais
rápido, com scripts únicos, formatação, lint, testes, mocks, hooks locais,
convenções de commit, smoke tests e documentação de setup.

## Limites e fora do escopo

Este Epic cobre o ambiente de desenvolvimento, os comandos canônicos, ESLint,
Prettier, Vitest, MSW, Playwright, seleção centralizada entre adapters reais e
mocks e a documentação necessária para executar e revisar o projeto. A
validação de commits e os hooks locais pertencem à primeira Story do EPIC-001,
para que toda alteração já nasça com essa barreira mínima.

Ficam fora do Epic testes de componentes, testes de fluxos de produto, mocks de
domínio, implementação de autenticação, onboarding, marca, Dashboard, posts,
uploads, geração, edição, PWA, configuração de produção e qualquer alteração
de comportamento do shell. Os testes de Playwright ficam limitados ao smoke
test estrutural do shell.

## Riscos e dependências

Depende do runtime e do shell definidos no EPIC-001. O CI e o CD devem consumir
os mesmos scripts locais, e os mocks devem manter os contratos que serão usados
pelas integrações reais sem espalhar condicionais pela aplicação.

Os principais riscos são divergência entre comandos locais e CI, hooks lentos
ou inconsistentes, mocks que escondem erros reais e documentação que fique
defasada em relação ao scaffold. Stories separadas e scripts únicos reduzem o
tamanho e a ambiguidade de cada revisão.

## Mapa de Stories

| ID | Story name |
|---|---|
| STORY-013 | Definir scripts canônicos de desenvolvimento, lint, typecheck, teste e build |
| STORY-014 | Configurar ESLint e Prettier para validar e formatar o scaffold |
| STORY-015 | Configurar Vitest e MSW sem testes ou handlers de produto |
| STORY-016 | Configurar seleção centralizada entre adapters reais e mocks sem condicionais espalhadas |
| STORY-017 | Configurar Playwright para smoke test estrutural do shell sem fluxos de produto |
| STORY-018 | Documentar setup local e padronizar template de Pull Request sem secrets |

## Aprovação

Status atual: `approved`.

Aprovado pelo usuário em 2026-09-03.
