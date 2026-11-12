# Plano — Área do cliente

Desenho das telas: canvas "Área do Cliente CASA MARTECH"
(<https://claude.ai/artifact/PjRhGW3o4yTA48Um3Bz28v>). Este documento é o plano
de implementação. Nada aqui foi construído ainda.

## Perfis

| Perfil | Entra por | Cai em | Enxerga |
|---|---|---|---|
| Visitante | não entra | `/` | site público + link "Entrar" |
| Cliente | e-mail, depois senha | `/cliente` | só o próprio projeto |
| Equipe | Google | `/admin` | tudo, como hoje |

## 1. Banco e permissões

`admin/schema.sql` e a migração no Supabase andam juntos.

- `amaralesilva_client_users` (`email`, `client_id`, `active`): lista de quem
  entra como cliente, no molde de `amaralesilva_members`.
- `amaralesilva_my_role()`: devolve `equipe`, `cliente` ou nulo. A tela de login
  usa para decidir o destino.
- O cliente **não lê as tabelas internas** (`split_matheus`, `price_cash`,
  notas e conversas internas). Lê views com colunas seguras (projeto, status,
  documentos, status das parcelas), filtradas pelo seu `client_id`. Reuniões e
  anotações só aparecem com a marca "compartilhado com o cliente".
- Tabelas novas: `previews` (projeto, versão, caminho, status, aprovação),
  `preview_comments` (ponto na página, texto, resolvido), `client_todos`
  (pendências) e um bucket privado do Storage para arquivos enviados.
- Parcela mostrada ao cliente é o status das parcelas reais
  (`amaralesilva_payments`); nunca criar linha lá a partir de proposta não
  aceita (ver CLAUDE.md).

## 2. Login em duas etapas

- Supabase Auth, e-mail e senha, mínimo de 8 caracteres, cadastro público
  desligado. Equipe segue com Google.
- Passo 1: Edge Function `auth-check` devolve `senha`, `primeiro_acesso` ou
  `nao`, com limite de tentativas por IP e sem consulta aberta ao banco pelo
  papel anônimo (evita listar quais e-mails são clientes).
- Passo 2: `signInWithPassword`.
- Primeiro acesso e "esqueci a senha": e-mail de definir senha do Supabase.
- "Convidar cliente" no painel: Edge Function com chave de serviço cria o
  usuário e grava em `client_users`.
- Redirect URLs do Supabase: acrescentar `/entrar` e `/cliente` (todo endereço
  pelo qual o site abre: domínio próprio e os dois da Vercel).

## 3. Rotas e header

- `vercel.json`: rewrites de `/entrar` e `/cliente`, com `X-Robots-Tag: noindex`
  e `Disallow` no `robots.txt`.
- Páginas novas: `entrar/index.html` e `cliente/index.html` (arquivo único,
  mesmos tokens do admin).
- Header do `index.html`: link "Entrar" antes do "Iniciar conversa". Rodar
  `node scripts/build-en.mjs` e versionar `en/index.html`.
- Estado logado: script curto lê o papel guardado no login e troca o botão pelo
  menu da conta.
- `/admin`: garantir que cliente logado veja "sem acesso".

## 4. Prévias protegidas

Arquivo estático na Vercel é público; é preciso uma barreira.

- **Decidido (12/11/2026):** Edge Middleware em `/previa/<cliente>/…`, validando um cookie
  de sessão e o `client_id` do caminho. `/api/sessao` troca o login do Supabase
  pelo cookie. Custo: aparece `middleware.js` e uma função em `/api`.
- Alternativa: pasta com nome aleatório, como as propostas. Mais simples, mas
  quem tem o link vê sem login.
- Comentários em pontos: a prévia abre em iframe de mesma origem; a tela guarda
  caminho e posição.
- O push existente (`admin/push-schema.sql`) avisa a dupla de comentário ou
  aprovação.

## 5. Painel interno

- Clientes → aba **Acesso**: convidar, revogar, redefinir senha.
- Tela **Prévias**: publicar versão, ver comentários.
- Pendências do cliente e marca "compartilhado" nas reuniões.
- "Ver como cliente", só leitura.

## 6. Ordem

1. Banco, login, `my_role` e link no header.
2. Área só de leitura: projeto, documentos, parcelas, reuniões.
3. Prévias com middleware, comentários e aprovação.
4. Envio de arquivos.
5. Checklist de migração para as contas do cliente.

Cada fase vai ao ar sozinha.

## 7. Verificação e documentação

- Teste de RLS com dois clientes: um não enxerga nada do outro.
- Cliente, equipe e visitante abrindo `/admin`, `/cliente` e `/previa/…`.
- Atualizar README e CLAUDE.md: a regra "a página não linka nada interno" vale
  só para as propostas.

## Decisões

- Prévias: Edge Middleware (decidido em 12/11/2026).
