# Rascunho — Política de Privacidade e inventário de terceiros

Material de trabalho, fora do ar (`docs/` está no `.vercelignore`). Saiu da
auditoria de conformidade de 13/10/2026 e **não é texto final**: os campos
entre colchetes só o dono preenche, e a versão final passa por advogado
antes de virar `privacidade/index.html` com link no rodapé e no formulário.
Nada aqui foi inventado: onde falta fato, está marcado.

O que precisa ser decidido antes de publicar:

- quem é o controlador: razão social e CNPJ, ou a pessoa física que responde;
- endereço e e-mail do canal de privacidade;
- prazos de retenção de leads não convertidos, de clientes depois do contrato,
  dos backups e dos logs;
- o mecanismo de transferência internacional (DPAs do Supabase e da Vercel);
- se haverá medição de audiência, e com que base legal;
- o destino da tabela `amaralesilva_site_events`;
- se o site precisa de Termos de Uso.

Quando publicar: página `privacidade/index.html` com os tokens e as fontes de
`/fonts`, rewrites `/privacidade` e `/en/privacy` no `vercel.json`, entrada no
`sitemap.xml`, link no rodapé e uma linha visível junto do botão de enviar do
formulário. A nota do "i" do formulário ("Seus dados ficam só com a dupla")
muda junto, porque hoje cala sobre o Supabase nos EUA e o WhatsApp.

## Inventário de terceiros

Atualizado em 14/10/2026. Entra no mesmo PR de qualquer SDK ou tabela nova.

| Serviço | Onde no código | Dados que recebe | Finalidade | Papel | País / mecanismo (art. 33) |
|---|---|---|---|---|---|
| Supabase (banco + Auth), região us-east-1 | `index.html` (formulário); `admin/index.html` | leads (nome, empresa, contato, necessidade, mensagem, idioma, hash da origem); CRM (clientes, projetos, reuniões, devolutivas, parcelas, tarefas, ajustes com o e-mail do autor); e-mail Google dos membros; IP e navegador nos logs da API | guardar leads e operar o painel | operador | EUA · [MECANISMO — conferir no DPA do Supabase se há as cláusulas-padrão da ANPD (Res. 19/2024)] |
| Vercel (hospedagem/CDN) | `vercel.json` | IP, navegador, URL e horário de cada requisição | servir site, propostas e painel | operador | EUA e rede global · [MECANISMO — conferir DPA da Vercel] |
| Vercel Web Analytics | removido do site em 14/10/2026 | — | — | — | volta só com a Política publicada |
| Tabela `amaralesilva_site_events` | só no banco (branch `feat/metricas-do-site`, não mergeada) | nome do evento, página, idioma, meta (origem, aparelho, seção, detalhe, web vitals) | métricas do site | — | EUA (Supabase) |
| WhatsApp (Meta) | botões "Falar no WhatsApp" do site; links do painel | o que a pessoa digitou no formulário, se clicar no botão; conversas | atendimento iniciado pelo titular | controlador próprio | EUA/global |
| Google — Gmail | link de e-mail do site | e-mails trocados com leads e clientes | atendimento | operador/controlador próprio | EUA |
| Google — OAuth | login do painel | conta Google dos 2 membros | login do painel | — | EUA |
| Google Fonts | painel e uma proposta | IP e navegador de quem abre a página | fontes | terceiro | EUA |
| jsDelivr | painel | IP e navegador de quem abre o painel | biblioteca supabase-js | terceiro | rede global |
| GitHub | repositório do site | todo o conteúdo versionado | versionamento | operador | EUA |
| Supabase — recursos de IA da organização | painel do Supabase | [CONFERIR: só esquema ou também dados e logs] | assistente do painel | [a definir] | [a definir] |

## Política de Privacidade (texto sugerido)

# Política de Privacidade — CASA MARTECH
Versão 1.0 · em vigor desde [DATA DE PUBLICAÇÃO]

### 1. Quem cuida dos seus dados
[CONTROLADOR — RAZÃO SOCIAL e CNPJ, se a CASA MARTECH for pessoa jurídica; se não for, o nome completo de quem responde pelo tratamento (Bruno Amaral e/ou Matheus Silva) — decisão do dono com o advogado]
[CNPJ] · [ENDEREÇO]
Canal de privacidade: [E-MAIL DO ENCARREGADO OU DO CANAL DE PRIVACIDADE]

### 2. Que dados tratamos, para quê e com que base legal
- **Formulário "Iniciar conversa"**: nome, empresa (opcional), e-mail ou WhatsApp, o que você precisa, mensagem, idioma da página e data do envio. Usamos para responder ao seu contato e, se for o caso, preparar uma proposta. Base legal: procedimentos preliminares a um contrato, a seu pedido (LGPD, art. 7º, V).
- **Conversa por WhatsApp ou e-mail que você inicia**: o conteúdo da conversa. Mesma finalidade e base (art. 7º, V). Ao clicar em "Falar no WhatsApp", o texto que você digitou no formulário vai junto para o WhatsApp, serviço da Meta, que trata os dados segundo a política dele.
- **Clientes e projetos**: dados de contato do cliente e de seus representantes, registros de reuniões, devolutivas, propostas, contratos e pagamentos. Base legal: execução de contrato (art. 7º, V) e cumprimento de obrigação legal, como a fiscal e a contábil (art. 7º, II).
- **Registros técnicos**: o provedor de hospedagem e o banco de dados registram endereço IP, navegador e horário das requisições, para segurança e funcionamento. Base legal: legítimo interesse (art. 7º, IX) [e, se aplicável, guarda obrigatória do Marco Civil da Internet, art. 15].
- **Medição de audiência** — só se ativada, e só depois da sua escolha: páginas visitadas, origem da visita, tipo de aparelho e país aproximado, sem cookies. Base legal: [consentimento (art. 7º, I) OU legítimo interesse (art. 7º, IX) com teste documentado — decisão do dono; ver C-04 e C-05].

Não pedimos dados sensíveis. Não vendemos dados nem os usamos para publicidade.

### 3. Com quem os dados ficam
Para funcionar, o site usa fornecedores que tratam dados em nosso nome:
- Supabase: banco de dados e login do painel interno; servidores nos EUA.
- Vercel: hospedagem do site; EUA e rede global.
- Google: e-mail de contato (Gmail) e login do painel interno.
Ninguém além da dupla tem acesso aos dados de leads e clientes no painel.

### 4. Transferência internacional
Os servidores do banco e da hospedagem ficam nos Estados Unidos. A transferência se apoia em [MECANISMO — cláusulas-padrão contratuais da ANPD (Res. CD/ANPD 19/2024) nos contratos com os fornecedores, ou outro mecanismo do art. 33 indicado pelo advogado].

### 5. Por quanto tempo guardamos
- Contatos que não viraram projeto: [PRAZO DE RETENÇÃO DE LEADS NÃO CONVERTIDOS], depois apagados.
- Clientes: durante o contrato e por [PRAZO DE GUARDA APÓS O FIM DO CONTRATO — indicado pelo advogado/contador, por obrigação legal ou defesa em processo].
- Cópias de segurança do banco: apagadas automaticamente em até [PRAZO DOS BACKUPS — conferir no painel do Supabase, Database → Backups].
- Registros técnicos: [PRAZO DOS LOGS — conferir com os fornecedores; 6 meses se aplicável o art. 15 do Marco Civil].

### 6. Seus direitos
Você pode pedir: confirmação de que tratamos seus dados, acesso, correção, anonimização ou eliminação do que for desnecessário, portabilidade, informação sobre com quem compartilhamos, eliminação dos dados tratados com consentimento e revogação do consentimento (LGPD, art. 18). Escreva para [E-MAIL DO ENCARREGADO OU DO CANAL DE PRIVACIDADE]. Respondemos em até [PRAZO DE RESPOSTA — até 15 dias para a declaração completa, LGPD art. 19, II; confirmar com o advogado]. Você também pode reclamar à ANPD (www.gov.br/anpd).

### 7. Cookies
O site não usa cookies. [Se a medição for ativada com escolha: guardamos no seu navegador (localStorage) só a sua escolha, com data e versão; você muda a escolha em "Preferências de privacidade", no rodapé.] O painel interno, de uso exclusivo da dupla, guarda no navegador a sessão de login dos membros.

### 8. Segurança
Os dados ficam num banco com regras de acesso por linha: só os membros autorizados leem e alteram, com login Google. O formulário público só consegue inserir contatos, nunca ler.

### 9. Crianças e adolescentes
O site é dirigido a empresas e não coleta, de propósito, dados de menores de 18 anos.

### 10. Visitantes fora do Brasil
Ver seção "Visitors outside Brazil" (C-09).

### 11. Mudanças nesta política
Mudanças relevantes mudam a versão e a data acima e entram no histórico abaixo.
- 1.0 — [DATA] — primeira versão.

## Termos de Uso

Termos de Uso: o site não tem conta, venda nem conteúdo de usuário, então a necessidade de termos é decisão do advogado. Se houver termos, o mínimo é: propriedade intelectual do conteúdo do site, uso das marcas e peças dos cases (com a autorização dos clientes confirmada pelo dono), ausência de garantia de disponibilidade e foro. Cookies: basta a seção 7 enquanto não houver cookie.
