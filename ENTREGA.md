# Entrega final — CASA MARTECH (site, propostas e painel)

> Mantido pelos agentes (qualquer modelo). **Ao terminar cada tarefa**, e sempre que perguntarem sobre status ou entrega, atualizar este arquivo e terminar a resposta com **"Falta para a entrega final:"** + os itens ainda não cumpridos (ou "nada pendente").
> Só status e link para o relatório. Detalhe de vulnerabilidade fica no relatório local (`.auditoria-seguranca/`), nunca aqui.
> Status: `✅` cumprido · `⏳` em andamento · `❌` pendente · `N/A` não se aplica (com motivo).

Última atualização: 2026-10-14 · commit: c084d33 (relatórios da auditoria: 2026-10-13, commit c402e7a)

## Aplicabilidade (preencher no início do projeto)
- Dados pessoais: sim (leads do formulário, clientes e contatos no painel) · dado sensível: não · público menor de idade: não · conteúdo +18: não
- Conteúdo de usuário (upload, comentário, perfil): não
- E-mail de marketing: não · assinatura ou pagamento: não · app em loja: não
- Usuários fora do Brasil: UE (cliente em Portugal) e a versão `/en`
- Interface: web

## 1. Fluxo e CI
| Item | Status | Evidência / próximo passo |
|---|---|---|
| Toda tarefa com issue; PRs citando a issue (`pr-cita-issue`) | ❌ | O repositório trabalha por PR de branch, sem issue. Decidir se adota o fluxo do `AGENTS.md`. |
| CI verde na branch principal (`ci.yml` / `ci-dotnet.yml`) | ⏳ | `.github/workflows/ci.yml` entra com o PR das correções; depois, exigir os checks `qualidade` e `banco` na `master` (Settings → Branches). |
| App existente: `/auditoria-app-existente` sem P0 nem P1 abertos (data e commit do relatório) | ❌ | 2026-10-13 · c402e7a: 2 P0 e 12 P1. P1 corrigidos no PR das correções, exceto UI-19 (depende da Política) e ENG-09 (Sentry, precisa de aprovação). P0 dependem do dono (abaixo). |

## 2. Segurança (`/auditoria-seguranca`)
| Item | Status | Evidência / próximo passo |
|---|---|---|
| `varrer-build.sh` = 0 no build de produção (chave secreta no cliente é bloqueante) | ✅ | 2026-10-14 · c084d33: limpo na árvore que a Vercel publica; roda no CI. |
| Auditoria com `Publicação: LIBERADA` (data e commit do relatório) | ❌ | 2026-10-13 · c402e7a: BLOQUEADA por 1 Crítico que depende do dono. Rodar de novo depois dele. |
| Chaves vazadas no passado rotacionadas | N/A | A varredura do histórico não achou chave secreta; só a publicável, que é pública por design. |

## 3. Conformidade legal (`/auditoria-conformidade`)
| Item | Status | Evidência / próximo passo |
|---|---|---|
| Auditoria com `Entrega: LIBERADA` (nenhum ❌, nenhum ⚠️ de risco alto) | ❌ | 2026-10-13 · c402e7a: BLOQUEADA (política, retenção e transparência). |
| Política de Privacidade, Termos de Uso e Política de Cookies publicados, datados e coerentes com o código | ❌ | Rascunho em `docs/privacidade-rascunho.md`; faltam razão social, CNPJ, e-mail do canal, prazos de retenção e revisão de advogado. |
| Consentimento antes de qualquer tracking | ✅ | O script de medição saiu do site; nada é medido hoje. Volta só com política e aviso. |
| Exclusão de conta completa (banco, storage, terceiros) | N/A | Visitante não tem conta. A retenção de leads e clientes está no item acima. |
| Descadastro de e-mail em 1 clique (se houver marketing) | N/A | Sem e-mail de marketing. |
| Checkout transparente, cancelamento simétrico e arrependimento de 7 dias (se houver pagamento) | N/A | Sem pagamento no site. |
| Denúncia e remoção de conteúdo (se houver UGC) | N/A | Sem conteúdo de usuário. |
| Texto jurídico revisado por advogado | ❌ | Depois do rascunho preenchido. |

## 4. Design e UX (`diretrizes-design`)
| Item | Status | Evidência / próximo passo |
|---|---|---|
| Tokens de design (cores, tipografia, movimento) e nenhum sinal de "cara de IA" | ⏳ | Cores em tokens; faltam tokens de espaço, tipo e movimento (UI-01, P2). |
| Estados da interface em todas as telas (skeleton, tardio, erro, offline), lazy loading e entrada/saída — matriz por tela do `/auditoria-app-existente` | ⏳ | Painel: esqueleto, tardio, erro com tentar de novo e ação em andamento corrigidos. Pendentes P2: vazio por filtro, lazy das imagens, entrada/saída do modal, aviso de offline. |
| Acessibilidade (contraste, foco, teclado, `prefers-reduced-motion`) | ⏳ | Foco do modal e da gaveta e contraste dos campos corrigidos; leitor de tela ainda sem teste manual. |
| Responsivo conferido em 375/768/1280 (web) | ⏳ | Site e painel ok; duas propostas já enviadas rolam de lado em 375 px e ficam como estão (regra 5 do `CLAUDE.md`). |
| Sem padrões enganosos (banner, checkout, cancelamento) | N/A | Sem banner, checkout ou assinatura. |

## 5. Engenharia (`diretrizes-engenharia`)
| Item | Status | Evidência / próximo passo |
|---|---|---|
| Testes unitários, de integração (inclui RLS) e E2E dos fluxos principais | ⏳ | RLS: `tests/db/rls.sql` (34 testes, no CI). E2E Playwright existe fora do repositório; levar para `tests/e2e` (ENG-07, P2). |
| Cobertura mínima no CI | ❌ | Sem testes de unidade; P3. |
| Lint, tipos, código sem uso e contrato de arquitetura limpos | ❌ | P2/P3 (Biome, `@ts-check` no admin). |
| Erros de produção chegando ao Sentry (e tracing via OpenTelemetry) | ❌ | ENG-09: Sentry grátis exige aprovação (dependência nova pelo `CLAUDE.md`) e entrada na Política. |
| Teste de mutação rodado nos módulos críticos | N/A | Sem testes de unidade para mutar. |

## 6. Documentação de entrega
| Item | Status | Evidência / próximo passo |
|---|---|---|
| README: como rodar, testar e publicar | ✅ | Seção "Testes e CI" no README. |
| `.env.example` com todas as variáveis (sem valores) e quais são públicas × secretas | N/A | Site estático sem variáveis de ambiente; só a chave publicável, no HTML. |
| Plano de resposta a incidente (LGPD-12) | ❌ | Roteiro pronto no relatório de conformidade; falta adotar. |

## Falta para a entrega final
- ❌ **Tornar o repositório privado** no GitHub (Crítico de segurança; ação do dono).
- ❌ Política de Privacidade publicada e rodapé legal: preencher o rascunho, revisar com advogado.
- ❌ Prazos de retenção de leads e clientes (decisão do dono).
- ❌ Aprovar ou recusar o Sentry.
- ❌ Plano de incidente e decisão sobre o fluxo com issue.
- ⏳ CI exigido na `master` depois do merge.
- ⏳ P2/P3 do diagnóstico.
