# Handoff: "O que entregamos" (#servicos) — o explorador

## Overview
Redesenho da seção "O que entregamos" do site (PT em `index.html`, EN gerado
em `en/index.html`). A grade estática de duas colunas penduradas num trilho
virou um **explorador**: as oito entregas em lista de um lado, uma aberta de
cada vez do outro, com o que ela é na prática e o que o cliente recebe. As
quatro de tecnologia tiveram a copy reescrita (modelos RBF, SOM, LVQ, ART e
Hopfield). As abas do celular (< 640px) continuam como estavam; só a copy das
quatro de tecnologia foi sincronizada.

Este documento é o handoff do Claude Design, com as divergências da
implementação anotadas na última seção.

## Fidelity
**Hi-fi.** Cores, tipografia e espaçamentos são finais e usam os tokens que já
existiam no `:root` do site.

## Telas

### Explorador (≥ 640px)
- **Container** `.explorer.rule-grid` — grid `minmax(0,5fr) minmax(0,7fr)`,
  borda 1px `var(--line)`, raio `var(--r-surface)`, `overflow: hidden`, fundo
  `var(--line)` com `gap: 1px` (as réguas entre as células são o padrão
  `.rule-grid` que o site já usava). Abaixo de 900px vira uma coluna.
- **Lista** `.explorer__list`: `<ul role="tablist" aria-orientation="vertical">`,
  fundo `var(--bg-deep)`, padding 8px 0.
  - **Item** `.explorer__item` (`<button role="tab">`): grid `32px 1fr 12px`,
    gap 16px, padding 16px 24px, `var(--serif)` 20px/1.25, cor
    `var(--ink-soft)`. Hover e ativo: fundo `var(--bg-card)`, cor
    `var(--ink)`. Focus-visible: outline 2px `var(--ochre)`, offset -2px.
  - **Número** `.explorer__num`: `var(--mono)` 11px, tracking .08em; ocre em
    `data-front="b"`, azul em `data-front="t"`.
  - **Ponto** `.explorer__dot`: 8px, círculo, a cor da frente, opacidade 0 → 1
    no item ativo.
  - **Barra de tempo** `.explorer__item::after`: 2px no pé do item, gradiente
    90° ocre→azul, de 0 a 100% em 3,5s linear enquanto a classe `.is-timing`
    estiver lá.
- **Painel** `.explorer__detail`: fundo `var(--bg-card)`, padding 44px 44px 48px,
  min-height 420px (32px 24px 36px e sem min-height abaixo de 900px). Cada
  `.explorer__panel` é um grid com gap 28px e quatro filhos, nesta ordem:
  1. `.explorer__front` — rótulo mono 11px uppercase tracking .14em com um
     disco de 8px; ocre em "Marca & Estratégia", azul em "Tecnologia & Dados".
  2. `.explorer__title` — serif 600, `clamp(28px, 2.8vw, 38px)`/1.15.
  3. `.explorer__body` — 17px/1.65, max-width 52ch, `text-wrap: pretty`.
  4. `.explorer__facts` — `<dl>` com a célula "Você recebe" (`dt` mono 11px
     uppercase; `dd` 16px/1.55), separada por `border-top: 1px var(--line)`.
- **Título da seção** `#servicos .section-title`: gradiente
  `linear-gradient(120deg, ochre 0%, ochre 30%, blue 100%)` com
  `background-clip: text`.
- **Frase de apoio**: "Oito entregas, dois ofícios. Cada uma começa no
  diagnóstico e termina em algo que a empresa usa."

### Abas (< 640px) — sem mudança de layout
As `.fronts__tabs` continuam como estavam (ver
`handoff-diagnostico-entregas-mobile.md`); só a copy das quatro entregas de
tecnologia foi sincronizada. O `.explorer` fica `display: none`.

## Conteúdo (8 entregas)
Marca & Estratégia (ocre): 01 Estratégia de marca · 02 Pesquisa de mercado ·
03 Criação & conteúdo · 04 Go-to-market.
Tecnologia & Dados (azul): 05 Sistemas sob medida & dashboards · 06 Análise de
dados · 07 Automações & integrações · 08 IA aplicada ao negócio.

Os textos finais estão no `index.html` (PT no conteúdo, EN em `data-en`). Não
há número nem prazo em nenhum deles.

## Comportamento
- **Avanço automático**: a cada **3,5s** (`DWELL`) passa à próxima entrega, em
  loop. Só corre quando a seção está ≥ 30% visível (IntersectionObserver), a
  aba do navegador está visível e não há `prefers-reduced-motion`.
- **Barra de tempo**: a classe `.is-timing` no item ativo reinicia a animação
  (`void el.offsetWidth` antes de recolocá-la).
- **Clique ou ↑↓** num item: fixa a entrega (`pinned`), para o relógio e abre o
  painel. As setas movem o foco (`tabIndex` 0 no ativo, -1 nos demais), e
  `aria-selected` acompanha.
- **Hover no painel** (`pointerenter`/`pointerleave` em `.explorer__detail`):
  segura o relógio; solta ao sair, se não estiver fixado.
- **Entrada do painel**: cada filho anima `explorer-in` (.5s,
  `cubic-bezier(.2,.7,.2,1)`, opacity 0→1 e translateY 10px→0) com delays
  0/.06/.12/.18s. Só sob `html.js-reveal`, a classe que o site já usa para
  autorizar movimento.
- **Reduced motion**: sem barra de tempo, sem animação de entrada e sem avanço
  automático — a troca por clique e por teclado continua funcionando.

## Estado
`cur` (índice ativo), `pinned`, `hover`, `visible` e `timer`, tudo numa IIFE
dentro do script principal. Sem dependência nova.

## Tokens (já existiam)
`--bg #0B0D12 · --bg-deep #0F1218 · --bg-card #141821 · --ink #F1EEE6 ·
--ink-soft #A6A39B · --ochre #C9A24E · --blue #7A93E6 · --line #242933 ·
--r-surface 18px · --serif Fraunces · --sans Inter · --mono IBM Plex Mono`.

## Onde está cada coisa
Em `index.html` (o `en/index.html` sai de `node scripts/build-en.mjs`):
- **CSS**: bloco `/* ─── Frentes ─── */`, até `/* ─── Casos ─── */`. Os
  keyframes `explorer-timer` e `explorer-in` ficam junto dos demais, lá em
  cima; o responsivo está em `@media (max-width: 899px)` (uma coluna) e
  `@media (max-width: 639px)` (`.explorer { display: none }`, entram as abas).
- **Markup**: `<section class="section" id="servicos">` —
  `<div class="explorer rule-grid reveal" data-explorer>`.
- **JS**: IIFE comentada `"O que entregamos": explorador`, antes do bloco
  "Entrada ao rolar".
- i18n: o PT é o conteúdo e o EN vive em `data-en`. Nos botões e no rótulo da
  frente o `data-en` fica num `<span>` interno, nunca no elemento que também
  carrega o número, o ponto ou o disco — a troca de idioma reescreve o
  `innerHTML` do nó que tem `data-en`, e levaria esses filhos junto.

## Divergências da implementação
O handoff original vinha como cópia completa de `index.html` e `en/index.html`,
mas de uma versão do site anterior a vários commits: foi portado bloco a bloco,
e não aplicado como arquivo. Além disso:

- **Sem JavaScript a seção não pode ficar vazia.** No original os sete painéis
  nasciam com `hidden` no HTML, e sem script sobrava uma entrega de oito. Agora
  os oito nascem abertos e quem fecha sete é o script; o CSS
  (`html:not(.js)`) tira a lista da frente e empilha os painéis com régua entre
  eles. A classe `.js` entra no `<html>` no mesmo script do `<head>` que já
  punha `js-reveal`.
- **A IIFE ficou fora do gate `js-reveal`.** No original ela rodava dentro dele,
  o que deixava o explorador inerte para quem pede `prefers-reduced-motion` ou
  não tem IntersectionObserver.
- **Impressão.** O original não tratava `@media print`: no papel sairia uma
  entrega só e o título em gradiente sairia transparente. O bloco de impressão
  abre os oito painéis, esconde a lista e devolve o título à tinta preta.
- **Abas do celular.** Foi mantido o markup do repositório, com o rótulo num
  `<span>` próprio (o original tinha o `data-en` no `<button>`, que levaria o
  `<i>` da barra de tempo junto na troca de idioma).
- O painel não tem "prazo" nem "par técnico", que o texto do handoff original
  mencionava: a ficha tem só "Você recebe".
