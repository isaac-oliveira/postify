---
id: PRD-001
title: "MVP do Postify"
status: approved
---

# PRD-001 — MVP do Postify

## Problema e oportunidade

Donos de pequenos negócios precisam transformar uma intenção, a identidade da
marca e referências visuais em posts bonitos para redes sociais sem depender de
um fluxo demorado ou de conhecimento avançado de design. O Postify deve
reduzir esse caminho a uma experiência simples, rápida e recuperável.

## Usuários e contexto

O usuário principal é o dono de um pequeno negócio que cria conteúdo para a
própria marca, principalmente em dispositivos móveis, mas também em desktop.
Ele pode chegar com uma ideia em texto ou voz, informações de marca, logo,
imagens de conteúdo e referências visuais. A experiência deve funcionar mesmo
quando o navegador não oferece ditado ou instalação como PWA.

## Objetivo

Permitir que o usuário transforme uma ideia em um post pronto para visualizar,
usar, baixar ou compartilhar, preservando a identidade da marca e mantendo
claros os estados de processamento e erro.

## Hipótese de valor

Se o Postify reunir contexto da marca, referências e uma intenção simples em um
fluxo guiado, então donos de pequenos negócios conseguirão produzir posts com
mais rapidez e menor esforço, sem perder controle sobre o resultado.

## Escopo do MVP

- Conta por e-mail ou Google, com entrada, sessão e encaminhamento adequado.
- Onboarding da primeira marca e acesso posterior ao Dashboard.
- Cadastro e edição de uma marca por usuário no MVP, incluindo nome,
  descrição, segmento, público, cores, logo e informações relevantes.
- Biblioteca privada de imagens da marca para reutilização, com seleção manual
  durante a criação do post.
- Criação de posts nos formatos Feed, proporção 1:1, e Story, proporção 9:16.
- Entrada da intenção por texto e ditado de voz quando suportado pelo
  dispositivo.
- Seleção manual de imagens da biblioteca ou anexação de novas imagens.
- Associação explícita de cada imagem a um papel: `content`, `reference` ou
  `brand`.
- Ao cadastrar uma imagem como `reference`, o backend a envia ao normalizador
  para gerar e persistir uma descrição do estilo visual observado. A imagem de
  referência não é enviada como imagem ao provedor de geração nas solicitações
  posteriores; somente sua descrição é usada como contexto.
- Preview, remoção, validação, limite de tamanho, validação de MIME type e
  mensagens de erro para anexos.
- Geração e edição visual assíncronas, com estados `pending`, `processing`,
  `completed` e `failed`.
- Continuidade do processamento quando o usuário fecha a aplicação e
  recuperação do estado ao retornar ou recarregar.
- Resultado com visualização, uso, download, compartilhamento e solicitação
  de edição.
- Até duas edições sequenciais concluídas após a geração inicial na mesma
  sessão. Uma terceira alteração deve orientar o usuário a criar uma nova
  sessão, sem apagar o histórico anterior, usando a primeira versão gerada
  como referência inicial da nova conversa para evitar carregar a degradação
  acumulada nas edições anteriores.
- Experiência PWA responsiva, instalável quando o navegador oferecer suporte,
  sem bloquear o uso quando não oferecer.

## Fora do escopo do MVP

- Interface de múltiplas marcas para o usuário; a estrutura deve permitir sua
  evolução futura, mas a regra do MVP limita a uma marca.
- Conteúdo animado, planos, monetização, limites de consumo e outras
  extensões futuras.
- Funcionalidades de rede social, publicação automática ou calendário de
  posts, salvo o compartilhamento previsto no fluxo.
- Regras visuais, componentes ou layouts que não estejam definidos no Figma.

## Requisitos funcionais

| ID | Requisito | Resultado esperado |
| --- | --- | --- |
| FR-001 | Autenticação | O usuário consegue criar conta e entrar por e-mail ou Google. |
| FR-002 | Primeiro acesso | Usuário autenticado sem marca é encaminhado ao onboarding; após concluí-lo, chega ao Dashboard. |
| FR-003 | Marca | O usuário consegue cadastrar e editar os dados da marca e manter sua biblioteca de imagens. |
| FR-004 | Sessão de post | No Dashboard, o usuário consegue iniciar a criação de um post e escolher Feed ou Story. |
| FR-005 | Intenção | O usuário consegue informar o que deseja criar por texto e, quando suportado, por voz. |
| FR-006 | Imagens | O usuário consegue anexar ou selecionar manualmente imagens, atribuir seus papéis, visualizar, remover e receber erros de validação. Para `reference`, o sistema gera e mantém a descrição do estilo visual no cadastro, sem enviar a imagem ao fluxo de geração. |
| FR-007 | Geração | Uma solicitação válida é aceita sem manter a interface do backend aberta até a conclusão e apresenta seu estado atual. |
| FR-008 | Conclusão e falha | Ao concluir, o resultado aparece no fluxo; em caso de falha, o usuário recebe uma mensagem compreensível e a solicitação não desaparece silenciosamente. |
| FR-009 | Edição | O usuário consegue solicitar até duas edições sequenciais concluídas da imagem atual, preservando o restante e o histórico da sessão. Uma terceira solicitação exibe mensagem clara, com ação para criar nova sessão iniciada com a primeira versão gerada da sessão original como `reference`; a mensagem informa que essa versão será usada, e não o resultado da última edição, para evitar degradação acumulada. |
| FR-010 | Recuperação | Ao reabrir ou recarregar a aplicação, o usuário recupera marcas, posts e gerações que lhe pertencem. |
| FR-011 | Saída | O usuário consegue visualizar, usar, baixar e compartilhar o resultado conforme os recursos disponíveis no dispositivo. |
| FR-012 | PWA | A aplicação oferece manifest, instalação, atualização, fallback e cache seletivo sem exigir instalação. |

## Requisitos não funcionais

- **NFR-001 — Segurança:** dados, marcas, posts, imagens e gerações de um
  usuário não podem ser acessados por outro. Toda persistência privada deve
  ter autorização por recurso, RLS e policies de Storage equivalentes.
- **NFR-002 — Segredos e fronteiras:** credenciais e integrações externas
  permanecem no backend. Requests e respostas são validados nas fronteiras;
  URLs, MIME types, tamanhos, callbacks e conteúdo externo não são confiados
  sem validação independente.
- **NFR-003 — Imagens privadas:** anexos passam pelo Storage privado, com
  transferência aos serviços externos somente pelo backend e com metadados e
  papéis preservados. Assets `reference` são enviados pelo backend ao
  normalizador no cadastro para gerar uma descrição de estilo; suas imagens
  não são enviadas ao provedor de geração nas solicitações posteriores. O
  frontend não usa base64 ou URL pública como contrato principal.
- **NFR-004 — Assincronicidade:** o fluxo de geração é recuperável, idempotente
  no callback e capaz de representar sucesso, processamento, erro e
  duplicidade sem perder o histórico. Falhas e retries não consomem uma edição;
  somente edições concluídas avançam o limite sequencial da sessão.
- **NFR-005 — Experiência:** a aplicação é responsiva, acessível e alinhada ao
  Figma. Mensagens exibidas ao usuário não expõem stack trace, respostas
  internas ou dados sensíveis.
- **NFR-006 — Design tokens:** `docs/assets/tokens.json` é a fonte canônica.
  Os nomes existentes devem ser consumidos diretamente, sem renomear tokens
  nem espalhar valores copiados. Isso inclui os grupos `colors`, `fontSize`,
  `fontWeight`, `lineHeight`, `radius` e `space`.
- **NFR-007 — Assets de marca:** `logo.png`, `icon.png` e `favicon.png` em
  `docs/assets` são assets de identidade do produto PWA e devem ser
  reutilizados conforme o contexto visual definido no Figma. Eles não são
  assets da marca do usuário e não participam da geração de posts.
- **NFR-008 — Testabilidade:** integrações externas devem ser substituíveis por
  adapters/providers e o modo mock deve manter os mesmos contratos. A
  cobertura prevista usa testes unitários, de integração e E2E; não haverá
  testes de componentes.
- **NFR-009 — Compatibilidade:** ditado, compartilhamento, instalação e
  recursos offline são progressivos; sua indisponibilidade não impede o uso
  principal suportado pelo navegador.

## Critérios de sucesso

- **SC-001:** um usuário novo consegue entrar, concluir o onboarding e chegar
  ao Dashboard com a própria marca.
- **SC-002:** o usuário consegue preparar um post Feed ou Story com intenção,
  contexto da marca e imagens válidas, sem perder o controle dos papéis dos
  anexos.
- **SC-003:** o usuário acompanha `pending`, `processing`, `completed` e
  `failed`; ao retornar à aplicação, o estado continua coerente com o banco.
- **SC-004:** um resultado concluído mantém o formato escolhido, os textos
  fornecidos e a identidade visual informada, e pode ser visualizado e
  utilizado pelo usuário.
- **SC-005:** cada edição altera somente o que foi solicitado, mantém o
  histórico e respeita o limite de duas edições sequenciais concluídas por
  sessão. Após a segunda, uma nova sessão pode ser criada com a primeira
  versão gerada da sessão original como `reference`, sem apagar a sessão
  anterior e evitando a degradação acumulada.
- **SC-006:** tentativas de acessar dados privados de outro usuário são
  bloqueadas, inclusive para Storage, geração e callback inválido.
- **SC-007:** a aplicação funciona de modo responsivo e instalável quando
  suportado, sem cachear secrets ou respostas privadas.
- **SC-008:** o fluxo principal pode ser exercitado em modo mock sem depender
  de serviços externos reais.

## Restrições e decisões já tomadas

- O Figma é a fonte de verdade visual; as telas e componentes devem consultar
  os nós de Auth, Onboarding, Dashboard, Posts e Brand indicados nas
  referências relacionadas.
- A arquitetura feature-based, os contratos tipados, as fronteiras de
  backend, o Storage privado, a recuperação assíncrona e a futura evolução para
  múltiplas marcas seguem o `ARCH-001` aprovado.
- A implementação deve manter o escopo simples e modular, evitando abstrações
  criadas apenas para funcionalidades futuras.
- O primeiro Epic, a ser criado somente depois da aprovação deste PRD, terá
  exclusivamente a estrutura base do projeto, sem autenticação, onboarding,
  marca, Dashboard, post, upload, geração ou outro comportamento de produto.
  Ele deverá ser dividido em Stories bem pequenas. O mapa de Epics definirá
  apenas limites e nomes; os critérios e tarefas serão definidos nas Stories.

## Dependências

- Figma do Postify e suas referências de componentes e fluxos.
- Tokens e assets fornecidos em [`docs/assets`](../../../../docs/assets/).
- Arquitetura aprovada em
  [`ARCH-001`](../architecture/ARCH-001-postify-foundation-v1.md).
- Supabase para conta, persistência, Storage, funções de backend e atualização
  de estado.
- Serviços externos de geração e edição visual, acessados apenas pelo
  backend, com callback autenticado.
- Suporte do navegador para voz, compartilhamento, instalação e recursos
  offline progressivos.
- Pipelines de validação, testes e entrega descritos nos roadmaps do Flox.

## Riscos e mitigação

| Risco | Impacto | Mitigação prevista |
| --- | --- | --- |
| Serviço externo atrasado, indisponível ou com resposta inválida | O usuário não recebe o resultado esperado. | Fila assíncrona, estados explícitos, timeout, validação de resposta, erro recuperável e modo mock. |
| Vazamento ou acesso cruzado de imagens privadas | Exposição de conteúdo do usuário. | Storage privado, RLS, policies, autorização por recurso, URLs temporárias e revalidação no backend. |
| Corrida na regra de uma marca por usuário | Estado inconsistente no onboarding. | Garantia transacional no backend, mantendo o esquema compatível com múltiplas marcas futuras. |
| Ditado ou instalação indisponíveis | Parte da experiência não funciona em algum dispositivo. | Degradação progressiva e fluxo principal utilizável sem esses recursos. |
| Perda de geração após fechar ou recarregar | Retrabalho e falta de confiança no produto. | Persistência do ciclo de vida, callback idempotente e recuperação do banco. |
| Degradação progressiva após várias edições | Resultado visual cada vez menos fiel à intenção original. | Limite de duas edições sequenciais concluídas e criação de nova sessão a partir da primeira versão gerada, evitando propagar a degradação acumulada. |
| Divergência entre Figma, tokens e implementação | Resultado visual inconsistente. | Figma como fonte visual, `tokens.json` como fonte canônica de valores e validação antes da implementação de UI. |

## Assumptions

- O usuário consegue fornecer ou aprovar as informações essenciais da própria
  marca durante o onboarding.
- O MVP limita cada usuário a uma marca, mas não cria uma restrição estrutural
  que impeça marcas adicionais no futuro.
- Ditado, compartilhamento, instalação e offline dependem de capacidades do
  dispositivo e do navegador.
- “Redes sociais” permanece um destino genérico no MVP; não foi definida uma
  integração de publicação específica.
- Não foram fornecidas metas numéricas de adoção, tempo ou conversão; os
  critérios deste PRD são observáveis e não presumem metas.

## Open questions

- Qual métrica e qual evento definirão o sucesso de rapidez e praticidade após
  a primeira versão utilizável?
- Qual limite máximo de tamanho e quais MIME types serão aceitos para cada
  papel de imagem?
- O compartilhamento usará somente recursos nativos do dispositivo ou terá
  destinos específicos nesta versão?
- Quais regras de retenção e expiração serão aplicadas a arquivos, resultados
  e histórico de edição?

## Referências relacionadas

- [Prompt inicial do projeto](../../../../docs/prompt-setup.md)
- [Tokens do projeto](../../../../docs/assets/tokens.json)
- [Assets visuais](../../../../docs/assets/)
- [Arquitetura aprovada ARCH-001](../architecture/ARCH-001-postify-foundation-v1.md)
- Figma: [Componentes](https://www.figma.com/design/cPnfzGWOtJZtWBuFvpXAQD/Postify?node-id=4028-2&p=f),
  [Auth](https://www.figma.com/design/cPnfzGWOtJZtWBuFvpXAQD/Postify?node-id=4029-603&p=f),
  [Onboarding](https://www.figma.com/design/cPnfzGWOtJZtWBuFvpXAQD/Postify?node-id=4029-1112&p=f),
  [Dashboard](https://www.figma.com/design/cPnfzGWOtJZtWBuFvpXAQD/Postify?node-id=4030-3944&p=f),
  [Posts](https://www.figma.com/design/cPnfzGWOtJZtWBuFvpXAQD/Postify?node-id=4032-6265&p=f),
  [Brand](https://www.figma.com/design/cPnfzGWOtJZtWBuFvpXAQD/Postify?node-id=4050-1347&p=f).

## Aprovação

Status atual: `approved`.

Este PRD reúne o escopo do MVP a partir do prompt inicial, das decisões já
confirmadas e das referências técnicas e visuais consultadas. Isaac aprovou
explicitamente esta versão em 2026-09-03. Esta aprovação não cria Epics,
Stories ou código nesta ação.

Próxima ação: `executar flox-create-epics`.
