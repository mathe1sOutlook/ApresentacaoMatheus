# Amaral &amp; Silva — site institucional

One-pager bilíngue (PT-BR / EN) da dupla **Bruno Amaral** (marca e estratégia) e
**Matheus Silva** (tecnologia e dados). Publicado em
<https://amaralesilva.vercel.app>.

Implementa o handoff *Reestruturação de branding* — papel bege, tinta quase
preta, ocre para marca, azul para tecnologia, Fraunces + Inter + IBM Plex Mono,
zero arredondamento e réguas de 1px como estrutura.

## Estrutura

```
index.html      site completo (marcação + <style> + <script>, sem build)
favicon.svg     "&" em ocre sobre papel
robots.txt      libera o site, bloqueia as propostas
sitemap.xml     / e /en com hreflang
vercel.json     rewrites (inclui /en) e noindex das propostas
proposta-mediaportal-*/   propostas privadas, fora do índice
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

## Pendências

- **Imagens** — os 12 apoios visuais ainda são molduras tracejadas
  (`<figure class="media" data-slot="...">`). Para preencher, troque o
  `<figcaption class="media__hint">` por um `<img src="..." alt="...">`; o
  `.media` já recorta com `object-fit: cover`.
- **E-mail** — `contato@amaralesilva.com` veio do design como provisório e o
  domínio `amaralesilva.com` ainda não está ativo. Confirmar o endereço
  definitivo antes de divulgar o site (o WhatsApp já é um canal real).
## Desvio do design

O ocre da marca é `#8A6220`, e não o `#B8842F` do handoff. O tom original dá
2,94:1 sobre o papel — abaixo do mínimo WCAG AA (4,5:1) para textos pequenos, e
o ocre carrega rótulos de 10 a 12px em várias seções. `#8A6220` fica na mesma
família e chega a 4,88:1 sobre `--paper` e 4,54:1 sobre `--paper-deep`. Se o
handoff for atualizado, basta trocar o token `--ochre` em `index.html` e a cor
do `&` em `favicon.svg`.
