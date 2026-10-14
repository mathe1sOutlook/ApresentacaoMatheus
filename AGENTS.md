# AGENTS.md — CASA MARTECH

Regras para qualquer agente que trabalhe neste repositório. O que é próprio
do projeto (propostas, painel, site estático, idiomas) está no `CLAUDE.md` e
no `README.md`; **em conflito, o `CLAUDE.md` vence** — em especial: sem
etapa de build, sem framework e sem dependência nova. As diretrizes abaixo
que pressupõem Next.js, Biome ou Sentry se aplicam pelo equivalente em HTML
estático, e só entram com aprovação quando trariam dependência nova.

Diagnóstico de 13/10/2026 (segurança, conformidade e app existente): o que
falta está em `ENTREGA.md`. Os relatórios completos ficam fora do Git, nas
pastas locais `.auditoria-*/` de quem rodou — detalhe de vulnerabilidade não
entra no repositório.

<!-- diretrizes:inicio -->
## Diretrizes do projeto (agents-draft) — valem para qualquer agente e qualquer modelo

Fonte das regras: skills `diretrizes-seguranca`, `diretrizes-design`, `diretrizes-conformidade`, `diretrizes-email` e `diretrizes-engenharia`. Agente sem suporte a skills: ler `~/.agents-draft/diretrizes/<seguranca|design|conformidade|email|engenharia>/SKILL.md` (repositório GitHub `mathe1sOutlook/agents-draft`). O que falta neste projeto, com impacto e prioridade: `/auditoria-app-existente`.

**Entrega final — avisar sempre**
- Manter `ENTREGA.md` na raiz (modelo `~/.agents-draft/modelos/ENTREGA.modelo.md`).
- **Ao terminar qualquer tarefa** — e sempre que perguntarem sobre status, deploy ou entrega — atualizar o `ENTREGA.md` e terminar a resposta com **"Falta para a entrega final:"** + os itens pendentes (ou "nada pendente"), bloqueantes primeiro. Não esperar a pergunta.

**Fluxo (GitHub)**
- Toda tarefa começa por uma **issue** com tipo (`tipo: correção`, `tipo: melhoria` ou `tipo: nova função`).
- Uma branch por issue (`fix/<n>-…`, `improve/<n>-…`, `feature/<n>-…`); nunca commitar direto na principal.
- Todo deploy passa por **PR** que cita a issue (`Closes #<n>`); merge só com CI verde. Um PR por issue.

**Segurança** (`diretrizes-seguranca`; antes de publicar, `/auditoria-seguranca`)
- **Bloqueante — não vai para produção:** chave secreta no cliente (bundle, HTML, rede, binário, `NEXT_PUBLIC_*`/`VITE_*`/`REACT_APP_*`); tabela exposta sem RLS ou com política aberta; regra/bucket aberto; admin sem proteção no servidor.
- No front, só a chave pública (`sb_publishable_…`). Chave secreta (Supabase, OpenAI, Stripe, Resend…) só em Route Handler, Server Action ou Edge Function, em módulo com `import 'server-only'`.
- Sessão e permissão conferidas no servidor em toda rota e ação; dono do dado vem da sessão. Input validado no servidor; queries parametrizadas; resposta só com os campos necessários; erro genérico.
- Antes de cada deploy: `varrer-build.sh` (saída 1 = não publicar) e DevTools/Network sem chave secreta. Chave que vazou: rotacionar no provedor.

**Design** (`diretrizes-design`)
- Só tokens do projeto (cores, tipografia, espaçamento, movimento). Sem "cara de IA" (Inter por padrão, gradiente roxo → azul, card dentro de card, texto cinza sobre cor).
- Todo componente com dados tem os estados definidos: inicial, carregando (**skeleton** no layout final), tardio (acima de ~3 s explica; acima de ~10 s permite cancelar ou tentar de novo), chegando depois, revalidando, erro, sucesso e offline.
- Lazy loading (imagens, componentes pesados, listas longas). Entrada e saída em modal, menu, toast e itens de lista, com intensidade pelo portão de frequência (`design-motion-principles`); `prefers-reduced-motion` sempre.
- Sem padrões enganosos (Recusar = Aceitar; cancelar tão fácil quanto assinar).

**Conformidade legal — LGPD** (`diretrizes-conformidade`; antes da entrega, `/auditoria-conformidade`; não substitui advogado)
- SDK ou dado novo entra no inventário de terceiros e na Política de Privacidade no mesmo PR.
- Analytics, pixel e anúncios só depois do consentimento. Exclusão de conta no app, apagando banco, storage e terceiros.
- Checkout com preço, periodicidade e renovação claros; cancelamento pelo mesmo canal; arrependimento de 7 dias.
- `/privacidade`, `/termos` e `/cookies` datados, no rodapé e no cadastro, coerentes com o código.
- Conteúdo +18 (impróprio ou proibido para menores): idade verificada por método confiável — nunca autodeclaração — e conferida no servidor a cada acesso; imagem e documento apagados na hora; guardar só resultado, método e data; caminho de contestação.

**E-mail** (`diretrizes-email`)
- Transacional separado do marketing. Marketing só com opt-in desmarcado, descadastro em 1 clique e `List-Unsubscribe-Post`. SPF, DKIM e DMARC no domínio de envio.

**Engenharia** (`diretrizes-engenharia`)
- CI verde é condição de merge: lint (Biome), tipos, Knip, contrato de arquitetura, testes com cobertura mínima, build, `varrer-build.sh` e E2E (Playwright).
- Código novo vem com teste; correção vem com o teste que reproduz o bug; tabela nova vem com teste de RLS.
- Commits e título do PR em Conventional Commits (`feat(db): …`), conferidos no CI. Erros de produção no Sentry (plano grátis) + OpenTelemetry, sem dado pessoal (Sentry v11: `dataCollection` fechado — sem ele coleta tudo; `sendDefaultPii` não existe mais) e sem source map público.
- Dependências: Dependabot semanal com cooldown de 7 dias; o CI instala pelo lock. Depois de `npm install` no Windows, rodar o `conferir-lock.mjs` da skill: o npm tira registros que o `npm ci` do Linux exige.

**Sempre:** consultar a documentação atual (Context7) antes de usar API que pode ter mudado. Ferramenta paga só com pedido explícito.
<!-- diretrizes:fim -->
