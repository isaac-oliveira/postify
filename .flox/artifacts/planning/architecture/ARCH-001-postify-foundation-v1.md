---
id: ARCH-001
title: "Fundação arquitetural do Postify"
version: 1
status: approved
---

# ARCH-001 — Fundação arquitetural do Postify

## Applicability scope

Esta referência define os limites técnicos do MVP do Postify: organização do
código, fronteiras entre frontend, Supabase e integrações de IA, contratos
tipados, responsabilidades, segurança e substituição por mocks.

Ela se aplica aos fluxos de autenticação, onboarding, marca, dashboard, criação
de posts, geração assíncrona, edição e recuperação do histórico. Não redefine
fluxos visuais, componentes, variantes ou tokens de interface; o Figma e
[`docs/assets/tokens.json`](../../../../docs/assets/tokens.json) permanecem as
fontes visuais indicadas pelo projeto.

## Folder and module structure

O frontend segue uma organização feature-based:

```text
src/
  app/
    assets/
      icons/
      illustrations/
    components/
    configs/
      debug.ts
      i18n.ts
      supabase.ts
    guards/
    hooks/
    layouts/
    providers/
    types/
    router.ts
  features/
    auth/
    onboarding/
    brand/
    dashboard/
    posts/
    generation/
  store/
  utils/
  global.css

supabase/
  functions/
    _shared/
      ai/
      auth/
      errors/
      fal/
      http/
      schemas/
      security/
      supabase/
    {function-name}/
      index.ts
  migrations/
  seed.sql
  config.toml
```

Cada feature pode conter `components/`, `constants/`, `hooks/`, `pages/`,
`schemas/`, `services/`, `types/` e `utils/`. Código específico permanece na
feature. Uma responsabilidade só vai para `app/`, `store/`, `utils/` ou
`functions/_shared/` quando houver reutilização real.

O fluxo mínimo de domínio proposto é `Auth → Brand → PostSession → Generation
→ Asset`. Os nomes são limites conceituais; nomes concretos de tabelas,
rotas, funções e arquivos continuam um gap de implementação.

## Code style

- TypeScript em modo strict; preferir `unknown` com narrowing a `any`.
- Usar aliases, imports ordenados, early returns e funções pequenas.
- Evitar ternários aninhados e lógica complexa dentro de JSX.
- Preferir um export principal por arquivo e separar arquivos por responsabilidade.
- Manter linhas com no máximo preferencial de 120 caracteres, usando Prettier quando possível.
- Manter `global.css` restrito a regras globais; usar Tailwind para estilos específicos e Ant Design como base de componentes.
- Consultar o Figma antes de criar qualquer tela ou componente.

Estas regras de código são limites do projeto confirmados em
`docs/prompt-setup.md`. Padrões adicionais abaixo são orientação para manter
uma solução pequena, não obrigações independentes.

## Technical contracts and boundaries

### Frontend e Supabase

O frontend autentica o usuário, acessa dados por contratos de serviço e usa o
cliente Supabase configurado em `src/app/configs/supabase.ts`. Autenticação,
autorização por recurso e validação devem ocorrer na fronteira do backend; a
validação do frontend não é suficiente.

Toda tabela com dados de usuário precisa de RLS e o Storage precisa de policies
equivalentes. O modelo deve aceitar múltiplas marcas no futuro, sem restrição
estrutural incompatível; a regra do MVP de uma marca por usuário pertence à
lógica de negócio e deve ser garantida transacionalmente para evitar condição
de corrida.

### Edge Functions

Cada `index.ts` recebe o request, autentica, autoriza, valida, chama a lógica da
função e produz a `Response`. Casos de uso e adaptadores ficam fora do entrypoint.
Código compartilhado entre funções fica em `supabase/functions/_shared/`.
Uma Edge Function não chama outra Edge Function quando um módulo compartilhado
resolve a responsabilidade.

### Pipeline de IA

Claude Haiku normaliza a intenção e produz uma saída estruturada. fal.ai recebe
o resultado validado e gera ou edita a imagem com GPT Image 2. Essas
responsabilidades não se misturam.

O frontend nunca recebe `FAL_KEY`, `ANTHROPIC_API_KEY`, service role keys ou
outros secrets e não chama fal.ai diretamente. O modelo Claude recebe somente
dados necessários para a geração. Conteúdo de usuário, marca, biblioteca,
metadados, arquivos e integrações externas são delimitados como dados não
confiáveis; não podem sobrescrever instruções internas, pedir secrets ou forçar
ferramentas.

### Contratos de geração

As fronteiras usam schemas Zod de entrada e saída. Os contratos mínimos
confirmados são:

```ts
type GenerationPrompt = {
  prompt: string;
  textContent?: string[];
  format: 'feed' | 'story';
};

type GenerationStatus =
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed';

type AssetRole = 'content' | 'reference' | 'brand';
```

Feed usa proporção 1:1, preferencialmente 1024x1024. Story usa 9:16,
preferencialmente 576x1024. Redimensionamento posterior deve preservar a
proporção.

Uploads validam tamanho, MIME type, preview, remoção e erros antes da chamada
ao backend. O papel de cada asset deve viajar explicitamente no contrato.

### Geração assíncrona e webhook

O fluxo não mantém uma Edge Function aberta aguardando o fal.ai:

```text
request autenticado e validado
  -> Claude
  -> saída Zod validada
  -> geração pending no banco
  -> Queue API do fal.ai
  -> request_id persistido
  -> resposta imediata ao frontend
  -> callback autenticado
  -> geração completed ou failed
  -> atualização da interface
```

O webhook valida assinatura, timestamp e payload, usa `request_id` como
identificador externo e é idempotente. O callback inválido é rejeitado. URLs,
MIME types e tamanhos retornados pelo fal.ai devem ser validados antes de serem
persistidos ou expostos ao usuário.

A interface recupera o estado do banco após recarregar ou reabrir; Realtime pode
ser usado para atualização, enquanto TanStack Query continua sendo a fonte do
estado remoto e do cache.

### Estado e formulários

TanStack Query é responsável por dados remotos, cache, mutations, invalidação e
sincronização. Zustand só guarda estado global de cliente que seja realmente
necessário; dados do backend não são duplicados nele. Estado de um único fluxo
permanece local.

React Hook Form e Zod são usados nos formulários. Schemas devem ser
reutilizados quando fizer sentido e requests de Edge Functions também devem
ser validados.

### Mocks, PWA e assets visuais

Integrações externas devem possuir adapters/providers intercambiáveis. O modo
mock é controlado por `VITE_USE_MOCKS=true` e deve cobrir autenticação quando
necessário, consultas, uploads, Edge Functions, Claude, fal.ai, geração
assíncrona, webhook, sucesso e erro, mantendo os mesmos contratos de produção.

O PWA possui manifest, Service Worker, instalação, atualização, fallback e
cache seletivo. Não armazenar secrets, autenticação, respostas privadas ou
requests de geração no cache. Ícones e ilustrações da interface usam SVGR e
ficam em `src/app/assets/`; URL de SVG só é usada quando houver motivo real.

`docs/assets/tokens.json` é um arquivo de tokens no formato estruturado do
Figma. Ele contém grupos de cores, espaçamento, tamanho e peso de fonte,
line-height e radius. A implementação deve consumir os valores por uma única
fronteira de configuração ou geração, sem copiar valores manualmente em cada
componente. O mapeamento final para Tailwind, CSS e Ant Design é um gap de
implementação e não é definido por esta referência.

## Responsibilities and ownership

| Área | Responsabilidade técnica |
| --- | --- |
| `src/app` | Composição da aplicação, providers, roteamento, guards, configurações e infraestrutura visual compartilhada. |
| `src/features` | UI, schemas, hooks, serviços e regras específicas de cada fluxo. |
| `src/store` | Estado global de cliente que não pertence a uma feature isolada. |
| TanStack Query | Estado remoto, cache, mutations, invalidação e sincronização. |
| `supabase/functions/{function-name}` | Entrada HTTP pequena, autenticação, autorização, validação e resposta. |
| `supabase/functions/_shared` | Schemas, erros, segurança, HTTP, cliente Supabase e adapters compartilhados. |
| Supabase | Auth, persistência, RLS, Storage, Realtime e execução das Edge Functions. |
| Adapter Claude | Normalização segura da intenção em `GenerationPrompt`. |
| Adapter fal.ai | Enfileiramento de geração/edição, sem bloquear a request. |
| Webhook | Autenticidade, idempotência e atualização do ciclo de vida da geração. |
| `docs/assets/tokens.json` | Fonte técnica dos tokens fornecidos pelo design; não define componentes. |
| Isaac | Decision owner da arquitetura e responsável pelas decisões técnicas do projeto. |

## Requested rules

As seguintes regras são requisitos do prompt inicial e devem ser respeitadas
pelas implementações que consumirem esta referência:

- não expor secrets no frontend, Service Worker ou cache;
- não concatenar SQL; usar queries parametrizadas e SDK do Supabase;
- validar entrada e saída em todas as fronteiras;
- nunca executar texto retornado pelo modelo como código, SQL, shell, JavaScript, configuração ou ferramenta sem validação independente;
- aplicar autorização por recurso, RLS, Storage policies, rate limiting, proteção contra abuso, validação de webhook e idempotência;
- manter o `index.ts` das Edge Functions pequeno;
- não duplicar estado remoto no Zustand;
- manter o pipeline de geração assíncrono e recuperável;
- usar mocks sem espalhar condicionais de mock pela aplicação;
- não implementar as extensões futuras de múltiplas marcas, animação, planos, monetização ou limites de consumo neste MVP.

## Examples and patterns (guidance, not rigid rules)

Um `GenerationService` pode coordenar validação, normalização, persistência e
enfileiramento, enquanto ports/adapters isolam Claude, fal.ai e seus mocks. Um
parser puro pode transformar o resultado Zod em parâmetros do provider de
imagem. Um módulo de caso de uso pode ser compartilhado pelas Edge Functions
somente quando a reutilização for real.

O fluxo de domínio pode ser implementado com módulos pequenos para Auth, Brand,
PostSession, Generation e Asset. A operação que limita uma marca no MVP deve
ser uma unidade transacional no backend; não usar somente `select` seguido de
`insert` como garantia de exclusividade.

Esses padrões favorecem Clean Code e reduzem acoplamento para um projeto solo,
mas não justificam criar camadas, factories ou abstrações antes de haver uma
segunda implementação concreta.

## Observed facts

- `docs/prompt-setup.md` define a arquitetura feature-based, as pastas previstas, o pipeline Claude/fal.ai, os contratos, o fluxo assíncrono, segurança, mocks e estado.
- `docs/assets/tokens.json` existe e contém tokens estruturados para cores, espaço, tipografia, line-height e radius, com extensões de variáveis do Figma.
- `.flox/project-context.md` registra React, TypeScript, Vite, Supabase, as integrações de IA e a ausência atual de implementação, manifesto e scripts.
- `.flox/config.toml` possui Setup válido e `.flox/artifacts/status.yaml` não tinha work items antes desta referência.
- Não há código executável, schema de banco, nomes concretos de Edge Functions ou comandos de teste no repositório atual.

## Decisions

1. **Feature-based:** código específico permanece em `src/features/{feature}`; áreas globais só recebem reutilização real.
2. **Fluxo de domínio:** manter as fronteiras conceituais `Auth`, `Brand`, `PostSession`, `Generation` e `Asset`.
3. **Fronteira backend:** secrets, chamadas fal.ai e orquestração de IA ficam no backend; o frontend usa contratos e adapters.
4. **Separação de IA:** Claude normaliza e fal.ai gera/edita, com schemas Zod entre as etapas.
5. **Geração assíncrona:** persistir `pending`, enfileirar, retornar imediatamente e finalizar pelo webhook idempotente.
6. **Segurança por aplicação e banco:** autenticação, autorização, RLS, Storage policies e validação são responsabilidades independentes do modelo.
7. **Regra de marca:** a limitação de uma marca no MVP é de negócio e deve ser garantida transacionalmente, sem `UNIQUE` estrutural que impeça múltiplas marcas futuras.
8. **Estado remoto:** TanStack Query é a fonte de dados remotos; Zustand não replica o backend.
9. **Mockabilidade:** providers/adapters trocam serviços reais por mocks sem condicionais distribuídas.
10. **Tokens:** `docs/assets/tokens.json` é consumido por uma fronteira única; seus valores não são copiados manualmente por componente.
11. **Storage:** assets permanecem privados e resultados só são expostos por URLs validadas e assinadas quando o fluxo exigir acesso temporário.
12. **Escopo:** esta referência define limites técnicos do MVP e não implementa nem antecipa as extensões futuras.

## Assumptions

- A estrutura de pastas prevista em `docs/prompt-setup.md` será criada durante o scaffold, pois ainda não existe no repositório.
- Os nomes concretos de features, Edge Functions, tabelas e adapters podem ser refinados por Stories sem violar as fronteiras desta referência.
- A lista de versões exatas das dependências será definida quando o manifesto do frontend for criado.

## Gaps

- Definir o mecanismo de transformação de `docs/assets/tokens.json` para CSS variables, Tailwind e tema Ant Design.
- Definir nomes concretos de tabelas, policies, buckets, Edge Functions e rotas após o desenho de dados.
- Definir o contrato completo do webhook do fal.ai e a estratégia de assinatura/timestamp na implementação.
- Definir comandos, ambiente de CI e fixtures de teste quando o scaffold existir.
- Definir observabilidade operacional sem registrar conteúdo sensível.

## Approval

Status atual: `approved`, versão 1. Isaac aprovou explicitamente esta versão em
2026-09-03. Stories e implementação devem consumir exatamente esta versão e
respeitar a precedência de UX e Design System para decisões de suas camadas.
