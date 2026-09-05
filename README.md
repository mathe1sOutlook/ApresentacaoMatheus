# Amaral &amp; Silva — site institucional

One-pager bilíngue (PT-BR / EN) da dupla **Bruno Amaral** (marca e estratégia) e
**Matheus Silva** (tecnologia e dados). Publicado em
<https://amaralesilva.vercel.app>.

Implementa o handoff *Reestruturação de branding* na versão escura — fundo
quase preto, tinta creme, ocre para marca, azul para tecnologia, Fraunces +
Inter + IBM Plex Mono, zero arredondamento e réguas de 1px como estrutura. O
hero traz uma constelação em canvas (ocre à esquerda, azul à direita) com
semente fixa, que flutua devagar e reage ao cursor; as seções entram com um
fade curto ao rolar. Os dois efeitos desligam com `prefers-reduced-motion`.
A prova social roda em marquee.

## Estrutura

```
index.html      site completo (marcação + <style> + <script>, sem build)
favicon.svg     "&" em ocre sobre fundo escuro
og.png, og-en.png  imagem de compartilhamento (1200×630) em PT e EN
fonts/          woff2 variáveis (latin + latin-ext) usadas pelo site
img/qr.svg      QR do site para a caixa "uso físico"; img/qr-print.svg é a
                versão preto-no-branco para cartão, crachá e proposta
robots.txt      libera o site, bloqueia as propostas e o /admin
sitemap.xml     / e /en com hreflang
vercel.json     rewrites (inclui /en e /admin) e noindex das propostas e do admin
proposta-mediaportal-*/   propostas privadas, fora do índice
admin/          painel interno da dupla (CRM, financeiro, agenda, tarefas)
```

Sem etapa de build e sem dependências: é HTML estático servido direto pela
Vercel, como o site anterior. As fontes (Fraunces, Inter, IBM Plex Mono —
licença OFL) são servidas de `/fonts`, sem chamada ao Google Fonts.

## Idiomas

O idioma vive na URL — `/` é PT-BR e `/en` é inglês (em `file://` o fallback é
`?lang=en`). Cada nó traduzível carrega o texto em inglês no atributo `data-en`;
o português é o próprio conteúdo do HTML. O script troca `innerHTML`, `<html
lang>`, `<title>`, a meta description, o canonical e as tags Open Graph, e usa
`history.pushState`, então o botão voltar funciona.

Para editar uma frase, mude os dois lados: o texto no HTML (PT) e o `data-en`
(EN). Se um dia o site virar Next.js, esses pares alimentam direto os
dicionários do `next-intl`.

## Formulário de contato (leads)

O "Iniciar conversa" em `#contato` faz duas coisas ao enviar: abre o WhatsApp
com a mensagem montada e grava o lead na tabela `amaralesilva_leads` do
Supabase (projeto `mApps`), via REST com a chave publicável. A política RLS
permite ao papel anônimo apenas INSERT com `source = 'site'` e
`status = 'novo'`; leitura e edição só para membros, pela tela **Leads do
site** do painel `/admin`, que também converte o lead em cliente com um
clique. Um campo-isca (`website`) barra robôs simples.

## Seções

`#topo` (hero) · `#dupla` · `#diagnostico` · `#servicos` · `#cases` ·
`#processo` · `#contato`.

## Admin (`/admin`)

Painel interno do Matheus e do Bruno, em `admin/index.html` — um SPA estático
no mesmo espírito do site (arquivo único, sem build, mesmos tokens de design).
Reúne:

- **CRM** — pipeline de propostas (contato → proposta enviada → negociação →
  contrato fechado → concluído / perdido), com preço proposto, preço final,
  condições de pagamento, divisão de valores entre a dupla e links para a
  proposta e o contrato em HTML hospedados no próprio site.
- **Devolutivas** — registro por projeto do que o cliente devolveu, do que foi
  combinado e das conversas.
- **Financeiro** — parcelas com dia de pagamento, divisão Matheus/Bruno,
  entradas por mês, acumulado e filtros por período.
- **Agenda** — calendário de reuniões com pauta e ata do que foi proposto.
- **Tarefas** — atribuíveis a qualquer um dos dois; o dashboard avisa o que é
  de hoje, da semana e o que atrasou.
- **Leads do site** — o que chegou pelo formulário público, com situação
  (novo, em contato, convertido, descartado) e conversão em cliente.

### Backend

Supabase (projeto compartilhado `mApps`, ref `wsgjbzsdewzplsnpfvdf`), tabelas
com prefixo `amaralesilva_` — o DDL de referência está em `admin/schema.sql`.
Login com Google via Supabase Auth; a chave publicável no HTML é pública por
natureza e os dados são protegidos por RLS: só e-mails cadastrados em
`amaralesilva_members` leem ou escrevem qualquer coisa. Novos membros são
cadastrados na tela **Equipe** (o e-mail precisa ser o da conta Google).

### Passo manual (uma vez)

No painel do Supabase, em *Authentication → URL Configuration* do projeto
`mApps`, adicionar às **Redirect URLs**:

```
https://amaralesilva.vercel.app/admin
```

Sem isso o retorno do login Google não volta para o painel. (O provider
Google já está ativo no projeto.)

## Pendências

- **Fotos da dupla** — os avatares em `#dupla` apontam para `/img/bruno.jpg` e
  `/img/matheus.jpg` (quadradas, 400×400 ou mais). Enquanto o arquivo não
  existe, a moldura tracejada "foto aqui" aparece no lugar.
- **Logos da faixa "já passaram por essas mãos"** — `/img/logos/<slug>.svg`
  (corning, americanas, quintoandar, mediaportal, tvcultura, informa, gipsyy),
  monocromáticos; o CSS pinta de creme. Sem o arquivo, fica o nome em texto.
- **Vercel Web Analytics** — o site já carrega `/_vercel/insights/script.js`;
  só começa a contar depois de ativar *Analytics* no projeto na Vercel.
- **Imagens dos casos e projetos** — cada card já aponta para um arquivo em
  `/img/casos/` (mediaportal, mindminers, ame-x, corning, genma) e em
  `/img/projetos/` (amwc, ame-tom-de-voz, istoe, nog, visionone, gipsyy,
  fundacalc, flora), todos `.jpg` em paisagem. Basta salvar o arquivo com esse
  nome; enquanto ele não existe, o `onerror` do `<img>` mostra a moldura
  tracejada "aguardando". Quando as imagens chegarem, exporte em WebP (ou AVIF)
  com largura 1600 px para as capas e 800 px para os cards; o nome do arquivo
  pode manter `.jpg` ou trocar a extensão no HTML.
- **E-mail** — `contato@amaralesilva.com` veio do design como provisório e o
  domínio `amaralesilva.com` ainda não está ativo. Confirmar o endereço
  definitivo antes de divulgar o site (o WhatsApp já é um canal real).
## Desvio do design

O ocre e o azul foram clareados para o fundo escuro: `#C9A24E` e `#7A93E6`
(ambos acima de 6:1 sobre `--bg`, o mínimo WCAG AA para texto pequeno é 4,5:1).
Os tokens vivem no `:root` de `index.html`; a cor do `&` em `favicon.svg`
acompanha o ocre.
