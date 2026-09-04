# Amaral &amp; Silva — site institucional

One-pager bilíngue (PT-BR / EN) da dupla **Bruno Amaral** (marca e estratégia) e
**Matheus Silva** (tecnologia e dados). Publicado em
<https://amaralesilva.vercel.app>.

Implementa o handoff *Reestruturação de branding* na versão escura — fundo
quase preto, tinta creme, ocre para marca, azul para tecnologia, Fraunces +
Inter + IBM Plex Mono, zero arredondamento e réguas de 1px como estrutura. O
hero traz uma constelação (ocre à esquerda, azul à direita) desenhada pelo
script com semente fixa, e a prova social roda em marquee.

## Estrutura

```
index.html      site completo (marcação + <style> + <script>, sem build)
favicon.svg     "&" em ocre sobre fundo escuro
robots.txt      libera o site, bloqueia as propostas e o /admin
sitemap.xml     / e /en com hreflang
vercel.json     rewrites (inclui /en e /admin) e noindex das propostas e do admin
proposta-mediaportal-*/   propostas privadas, fora do índice
admin/          painel interno da dupla (CRM, financeiro, agenda, tarefas)
```

Sem etapa de build e sem dependências: é HTML estático servido direto pela
Vercel, como o site anterior. As fontes vêm do Google Fonts.

## Idiomas

O idioma vive na URL — `/` é PT-BR e `/en` é inglês (em `file://` o fallback é
`?lang=en`). Cada nó traduzível carrega o texto em inglês no atributo `data-en`;
o português é o próprio conteúdo do HTML. O script troca `innerHTML`, `<html
lang>`, `<title>`, a meta description, o canonical e as tags Open Graph, e usa
`history.pushState`, então o botão voltar funciona.

Para editar uma frase, mude os dois lados: o texto no HTML (PT) e o `data-en`
(EN). Se um dia o site virar Next.js, esses pares alimentam direto os
dicionários do `next-intl`.

## Seções

`#topo` (hero) · `#dupla` · `#diagnostico` · `#servicos` · `#cases` ·
`#processo` · `#stack` · `#contato`.

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
- **Imagens** — os 12 apoios visuais ainda são molduras tracejadas
  (`<figure class="media" data-slot="...">`). Para preencher, troque o
  `<figcaption class="media__hint">` por um `<img src="..." alt="...">`; o
  `.media` já recorta com `object-fit: cover`.
- **E-mail** — `contato@amaralesilva.com` veio do design como provisório e o
  domínio `amaralesilva.com` ainda não está ativo. Confirmar o endereço
  definitivo antes de divulgar o site (o WhatsApp já é um canal real).
## Desvio do design

O ocre e o azul foram clareados para o fundo escuro: `#C9A24E` e `#7A93E6`
(ambos acima de 6:1 sobre `--bg`, o mínimo WCAG AA para texto pequeno é 4,5:1).
Os tokens vivem no `:root` de `index.html`; a cor do `&` em `favicon.svg`
acompanha o ocre.
