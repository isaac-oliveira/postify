# Postify — convenções

- TypeScript strict; preservar `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch` e `erasableSyntaxOnly`.
- Usar ESM, imports com aspas simples, sem ponto e vírgula e trailing commas conforme os arquivos existentes.
- Componentes React em PascalCase; funções e constantes em camelCase; manter símbolos e arquivos com nomes orientados ao domínio.
- Organizar novas funcionalidades em `src/features/`; manter infraestrutura de aplicação em `src/app/`.
- Manter i18n no boundary de aplicação e preservar `pt-BR` como locale suportado até decisão explícita diferente.
- Seguir o Figma como fonte de verdade para UI e consultar `docs/prompt-setup.md` antes de criar fluxos ou componentes.
- Separar responsabilidades de frontend, Supabase e integrações de IA; manter secrets e chamadas de IA no backend.
- Validar entradas externas nas fronteiras e preservar autorização por recurso, RLS e políticas de Storage.
- Commits: títulos curtos de Conventional Commits em inglês, sem corpo, metadados de coautoria ou declarações de autoria.