---
id: SPEC-001
title: "Enforçar constraint de Node localmente via .npmrc engine-strict"
status: approved
---

# SPEC-001 — Enforçar constraint de Node localmente via .npmrc engine-strict

**Source:** Achado F-003 do code review da STORY-002 (concern, aceito): `engines: { "node": ">=22.12.0" }` declarado em `package.json` mas não enforçado localmente — npm só emite warning por padrão.

## Objective

Tornar o requisito de Node `>=22.12.0` uma restrição local ativa: qualquer `npm install` ou `npm ci` executado em um ambiente com Node incompatível deve falhar com erro, não apenas emitir um aviso. Isso fecha o gap entre o contrato declarado e o comportamento real do toolchain.

## Context and assumptions

- **Observado:** `package.json` declara `engines: { "node": ">=22.12.0" }` e `packageManager: npm@10.9.8` (STORY-002, aprovada).
- **Observado:** Node local é `v20.19.5`; npm local é `11.17.0`. Ambos violam as restrições declaradas sem gerar erro.
- **Observado:** `.npmrc` não existe no repositório.
- **Assumido:** O projeto adota Node 22 como baseline; todos os colaboradores devem usar Node >=22.12.0 (via nvm, volta, mise ou gerenciador equivalente).
- **Assumido:** A change não altera nenhuma dependência, script ou comportamento de produção.

## Questions and suggestions

- Não há questões bloqueantes.
- **Sugestão (opcional):** adicionar um `README` ou `docs/setup.md` com instruções de instalação do Node 22 via nvm — fora do escopo desta Spec, pode ser uma Story separada.

## Scope

- Criar `.npmrc` na raiz do repositório com a única linha `engine-strict=true`.
- Verificar que `npm install` emite erro (não warning) em Node `<22.12.0`.
- Verificar que `npm ci` continua funcionando normalmente em Node `>=22.12.0` (ou documenta o gap local caso Node 22 não esteja disponível no ambiente de validação).

## Out of scope

- Instruções de setup de ambiente para colaboradores.
- Alterações em `package.json`, `package-lock.json`, `lefthook.yml`, ou qualquer outro arquivo além de `.npmrc`.
- Configurações adicionais de npm (registry, cache, proxy, etc.).
- CI/CD — a constraint já é aplicada pelo ambiente de CI que usa Node 22.

## Implementation approach

Criar `.npmrc` com conteúdo:

```
engine-strict=true
```

Nenhuma instalação, nenhum script e nenhuma dependência adicional são necessários — `engine-strict` é uma configuração nativa do npm.

## Acceptance criteria

- [ ] **AC-001 — Arquivo presente:** `.npmrc` existe na raiz do repositório com `engine-strict=true` como única linha (ou única linha relevante).
- [ ] **AC-002 — Restrição enforçada:** `npm install` ou equivalente executado em Node `<22.12.0` retorna erro em vez de warning; a mensagem cita o engine mismatch.
- [ ] **AC-003 — Escopo restrito:** o diff inclui somente `.npmrc`; nenhum outro arquivo de produção, configuração ou dependência é alterado.

## Risks and dependencies

- **Risco principal:** Qualquer colaborador com Node `<22.12.0` terá `npm install` bloqueado imediatamente. É um efeito intencional, mas requer que todos atualizem o Node antes de continuar usando o projeto.
- **Gap de validação local:** o ambiente local tem Node 20; a validação do AC-002 (erro em Node incompatível) pode ser observada localmente, mas a validação do comportamento correto em Node 22 (AC-002 negativo — sem erro) depende de CI ou troca de versão.
- **Dependência:** STORY-002 deve estar mergeada em `develop` antes desta Story começar, pois esta Spec endereça um achado dela.

## Validation plan

- Inspecionar `.npmrc` e confirmar `engine-strict=true` presente.
  - Expected result: arquivo com exatamente essa linha.
- Executar `npm install` ou `npm ci` (Node local v20.19.5).
  - Expected result: falha com `EBADENGINE` como erro, não warning.
- Inspecionar `git diff --name-only`.
  - Expected result: apenas `.npmrc`.

## Approval

Decision owner: Isaac
Decision: approved
Decided at: 2026-09-03
Justification: Spec aprovada explicitamente pelo usuário.
