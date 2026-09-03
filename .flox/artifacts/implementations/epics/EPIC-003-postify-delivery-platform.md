---
id: EPIC-003
title: "Segurança, PWA e entrega do Postify"
status: approved
---

# EPIC-003 — Segurança, PWA e entrega do Postify

**Status:** approved
**PRD:** [PRD-001 — MVP do Postify](../../planning/prds/PRD-001-postify-mvp.md)

## Objetivo

Estabelecer as bases de segurança da plataforma e preparar o shell do Postify
para execução progressiva como PWA e para entrega reprodutível em preview, com
observabilidade básica, automação de CI/CD e proteção do fluxo de Pull Requests.

## Limites e fora do escopo

Este Epic cobre a matriz de autorização por recurso, validação de fronteiras do
backend, erros HTTP e CORS restritivo, secrets e clients privados, padrões de
RLS e Storage para dados privados, rate limiting e proteção contra abuso,
webhooks autenticados e idempotentes, proteção contra prompt injection e
evidências para os gates de segurança. Também cobre manifest, Service Worker,
cache seletivo, instalação, atualização e fallback PWA; logging operacional sem
conteúdo sensível; variáveis de CI/CD; headers de segurança do shell e preview;
CI de Pull Request; proteção de branches; CD do shell para preview na Vercel; e
a validação final do shell publicado na versão `1.0.0`.

Ficam fora do Epic dados privados no cache, fluxos de autenticação, tabelas e
endpoints específicos do produto, policies de recursos de domínio que serão
consumidas pelos próximos Epics, Realtime, Edge Functions de produto, deploy de
produção, release, migrations de domínio, integrações com Claude ou fal.ai,
fluxos de produto e qualquer segredo salvo no repositório. Produção continua
sob responsabilidade do `flox-release`.

## Riscos e dependências

Depende dos scripts e do shell dos EPIC-001 e EPIC-002, do GitHub, do GitHub
Actions, da Vercel e dos ambientes autorizados de preview. Nenhum secret deve
ser persistido no repositório, no frontend, no Service Worker ou no cache.

Os principais riscos são cachear dados privados, publicar uma versão diferente
da exibida no manifesto, permitir que CI e execução local usem comandos
diferentes, liberar branches sem checks obrigatórios e confundir preview com
release de produção. O smoke test e a separação entre preview e produção devem
manter o processo verificável.

## Mapa de Stories

| ID | Story name |
|---|---|
| STORY-019 | Definir a matriz de segurança e autorização por recurso sem tabelas de produto |
| STORY-020 | Configurar validação de entrada e saída, erros HTTP e CORS restritivo no backend |
| STORY-021 | Configurar secrets e clients privados do backend sem exposição no frontend |
| STORY-022 | Definir padrões de RLS e Storage para dados privados sem policies de domínio |
| STORY-023 | Configurar rate limiting e proteção contra abuso nas fronteiras do backend |
| STORY-024 | Definir contrato de webhook autenticado e idempotente sem fluxo de produto |
| STORY-025 | Preparar proteção contra prompt injection e conteúdo externo não confiável |
| STORY-026 | Registrar evidências e critérios de segurança para os gates do projeto |
| STORY-027 | Configurar logging operacional sem conteúdo sensível |
| STORY-028 | Configurar manifest PWA do shell sem dados de usuário |
| STORY-029 | Configurar Service Worker com cache seletivo sem dados privados |
| STORY-030 | Configurar instalação, atualização e fallback PWA sem bloquear o shell |
| STORY-031 | Configurar variáveis de CI e CD por ambiente sem persistir secrets |
| STORY-032 | Configurar headers de segurança do shell e preview |
| STORY-033 | Configurar CI de Pull Request para install, lint, typecheck, testes e build |
| STORY-034 | Configurar proteção de branches e checks obrigatórios no GitHub |
| STORY-035 | Configurar CD do shell para preview na Vercel sem dados privados |
| STORY-036 | Validar o shell publicado em preview com a versão 1.0.0 |

## Aprovação

Status atual: `approved`.

Aprovado pelo usuário em 2026-09-03.
