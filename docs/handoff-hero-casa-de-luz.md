# Handoff: Casa de luz — hero do site Casa Martech

## Overview
Redesenho do fundo do hero do site Casa Martech (repo `mathe1sOutlook/ApresentacaoMatheus`, `index.html` e `en/index.html`). A constelação de pontos aleatórios foi substituída por uma **ilustração da casa em corte** (wireframe dourado/azul, estilo desenho técnico iluminado) com **pulsos de luz que viajam aleatoriamente pelos rastros entre os cômodos**, como sinais numa rede neural. A casa fala a dualidade da marca: telhado/estrutura em ocre (marca) e luz/tecnologia em azul.

## About the Design Files
Os arquivos em `design/` são **referências de design em HTML** — um protótipo funcional que mostra a aparência e o comportamento pretendidos, não código para copiar direto. A tarefa é **recriar este hero no ambiente do site** (hoje, HTML/CSS/JS estático servido pela Vercel; se migrar para um framework, use os padrões dele). O JS já é vanilla ES5 sem dependências, então pode ser portado quase literalmente.

`reference/index-pt-completo.html` é a página inteira já integrada — serve para ver o hero no contexto real (tokens `:root`, header sticky, marquee de clientes logo abaixo).

## Fidelity
**High-fidelity.** Cores, tipografia, posição da ilustração, velocidade e comportamento dos pulsos são finais. Recrie pixel a pixel.

## Screens / Views

### Hero (`section.hero#topo`)
- **Purpose**: primeira dobra do site; texto à esquerda, casa de luz à direita.
- **Layout**: `position: relative; overflow: hidden; padding: 128px 0 0; border-bottom: 1px solid var(--line)`. Filhos diretos são `position: relative` (ficam acima da arte). O `.container` do texto é `width: min(1200px, 100% - 64px)`.
- **Componentes**:

  **1. `img.hero__art`** — `design/img/hero-casa.jpg` (1072×821, ~130 KB)
  - `position: absolute; right: 0; bottom: 0; height: 100%; width: auto; max-width: 62%; object-fit: contain; object-position: right bottom; pointer-events: none; user-select: none`
  - Máscara CSS nas bordas para nunca aparecer retângulo: interseção de dois gradientes —
    horizontal `transparent 0 → #000 30% → #000 92% → transparent 100%` e
    vertical `transparent 0 → #000 22% → #000 82% → transparent 100%`
    (`mask-composite: intersect` / `-webkit-mask-composite: source-in`).
  - Atributos: `alt=""`, `aria-hidden="true"`, `decoding="async"`, `fetchpriority="high"`, `width="1072" height="821"`.
  - A imagem já vem com: fundo remapeado para `#0B0D12`, bordas esmaecidas no arquivo, mobília doméstica removida (mesa de jantar, sofá, estante, vasos — ficaram estação de trabalho, painel de gráficos e escada, leitura de escritório) e **rastros entre cômodos adormecidos** (escurecidos ~62%); só as lâmpadas ficam acesas.

  **2. `canvas.hero__pulsos#hero-pulsos`** — camada dos pulsos
  - `position: absolute; pointer-events: none; mix-blend-mode: screen`
  - `mask-image: url(img/hero-casa-luz.png); mask-size: 100% 100%; mask-repeat: no-repeat` (+ prefixos `-webkit-`). O PNG (1072×821, alpha) contém **só os rastros e nós de luz**; por isso qualquer coisa desenhada no canvas só aparece sobre o rastro — nunca acende a parede ao lado.
  - Tamanho e posição são definidos pelo JS (`fitPulsos`) para coincidir exatamente com a área desenhada da imagem (contain, ancorada no canto inferior direito da caixa do `img`): `s = min(imgW/1072, imgH/821)`, `w = 1072·s`, `h = 821·s`, `left = img.offsetLeft + imgW − w`, `top = img.offsetTop + imgH − h`. Backing store em `devicePixelRatio` (máx. 2). Usa `offsetWidth/offsetLeft`, não `getBoundingClientRect`, para ficar imune a zoom.

- **Responsivo**: abaixo de **880px** de largura, `.hero__art` e `.hero__pulsos` recebem `display: none` (a arte cruzaria o texto). O JS detecta `display: none` e para de desenhar.
- **Print**: ambos escondidos (`@media print`).

## Interactions & Behavior — os pulsos

Tudo em `design/hero-pulsos.js` (IIFE, vanilla, sem dependências). Coordenadas em **px da imagem 1072×821**; o canvas aplica `setTransform(s·dpr)`.

### Grafo
- **12 nós** (`NODES`): `hub` [570,410] (centro da casa, junto à escada), `mon` [395,352] (monitores), `topo` [630,268], `teto` [865,265], `lamp` [740,348], `baixoEsq` [395,525], `sala` [700,480], `escada` [572,456], `lampEsqCima` [425,268], `lampHall` [512,300], `lampHallBaixo` [512,462], `lampBaixoDir` [703,540].
- **12 arestas** (`EDGES`): polilinhas (`pts`) **traçadas sobre os rastros reais da ilustração** por caminho de menor custo pela máscara de luz — por isso o pulso nunca sai da linha. Cada aresta tem `tone` (`'ochre'` ou `'blue'`), e o setup calcula `cum` (comprimentos acumulados), `len` e `last` (timestamp do último pulso). As coordenadas exatas estão no arquivo; não as arredonde nem substitua por curvas — foram ajustadas à imagem.
- `ADJ[nó]` = índices das arestas que tocam o nó.

### Ciclo de vida de um pulso
- **Nascimento** (`step`): quando `now ≥ P.spawnAt` — 60% das vezes no `hub`, 40% num nó aleatório; `hops = 1–3`. O nó de origem acende (`glow = 1`). Próximo nascimento em **500–1900 ms**.
- **Escolha da aresta** (`spawn`): entre as arestas do nó (excluindo a que acabou de percorrer), sorteio ponderado por `(segundos desde o último pulso + 0,3)²` — favorece caminhos há mais tempo apagados, então **toda a casa é visitada** em vez de insistir nos mesmos rastros. Máximo de **11 pulsos simultâneos**.
- **Viagem**: velocidade constante **150–230 px/s** (em px da imagem); `t` avança `v·dt/len`; direção `dir = ±1` conforme entrou por `a` ou `b`.
- **Chegada**: nó de destino acende (`glow = 1`). Se `hops > 0`, gera um novo pulso (`hops − 1`) e, com 25% de chance, um segundo (`hops − 2`). Senão morre.
- **Decaimento do brilho dos nós**: `glow *= 0.08^dt` por frame (meia-vida ≈ 0,27 s).

### Desenho (`draw`), por frame, com `screen` blend
- **Nós acesos**: gradiente radial raio 34 — centro `--ink`, 35% na cor do nó (`hub` = ocre, os demais azul), borda transparente; `globalAlpha = glow`.
- **Pulso**: cabeça raio 26 (centro `--ink`, 40% na cor da aresta) + **cauda** de 6 pontos atrás (raio até 16, alpha `0,7·(1 − q/7)`, espaçados 4,5% do comprimento).
- Cores lidas de `--ochre`, `--blue`, `--ink` do `:root` (fallbacks `#C9A24E`, `#7A93E6`, `#F3EFE7`).

### Ciclo de animação
- `requestAnimationFrame`; `dt` limitado a 50 ms.
- **Para** quando: `prefers-reduced-motion: reduce` (nunca inicia — o hero fica estático, com as lâmpadas acesas e rastros adormecidos), aba oculta (`visibilitychange`), hero fora da tela (`IntersectionObserver` em `#topo`), ou arte escondida (< 880px).
- `fitPulsos` roda no `load` da imagem e em `resize` (debounce 120 ms).

## State Management
Só estado local do módulo (`P`): `raf`, `last`, `list` (pulsos vivos), `glow` (por nó), `spawnAt`, `box` (escala/tamanho), `dpr`, `visible`, `colors`. Nada persiste; sem fetch.

## Design Tokens (do `:root` do site)
- `--bg #0B0D12` · `--bg-deep #0F1218` · `--bg-card #141821`
- `--ochre #C9A24E` (marca) · `--blue #7A93E6` (tecnologia) · `--ink #F3EFE7` · `--ink-soft #A9A597` · `--line #1F242E`
- Título: Fraunces 400, `clamp(44px, 5.6vw, 74px)`, line-height 1.04, letter-spacing −0.015em; `.mar` ocre, `.tec` azul.
- Corpo: Inter; eyebrow IBM Plex Mono 11px, 0.14em, uppercase.
- Breakpoint da arte: 880px.

## Assets
- `design/img/hero-casa.jpg` — ilustração base (1072×821). Derivada da imagem gerada em `reference/referencia-original.png` (recorte x≥600, y 80–901; fundo remapeado; mobília apagada; rastros escurecidos; bordas esmaecidas).
- `design/img/hero-casa-luz.png` — máscara dos rastros: alpha = `((lum − 95)/90)²` da imagem **ainda acesa**, RGB branco. Se a ilustração for regenerada, gere a máscara de novo pelo mesmo critério e retrace as polilinhas das arestas (menor custo pela máscara entre os nós) — sem isso os pulsos saem do rastro.
- A arte é gerada por IA e tem artefatos de perto; uma versão em resolução maior e já sem móveis domésticos daria um recorte mais limpo.

## Files
- `design/hero-casa-de-luz.html` — demo isolada do hero (abre direto no navegador): CSS, markup e JS exatamente como no site.
- `design/hero-pulsos.js` — só o módulo dos pulsos.
- `design/img/` — os dois assets acima (copiar para `img/` no repo).
- `reference/index-pt-completo.html` — `index.html` do site já com o hero integrado (o `en/index.html` é idêntico, com caminhos `../img/`).
- `reference/referencia-original.png` — imagem de referência enviada pelo cliente.
