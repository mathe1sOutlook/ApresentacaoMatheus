# Handoff: Diagnóstico + Entregas — versão celular (< 640px)

## Overview
Sessão de revisão das seções **"Sua operação se reconhece aqui?"** (`#diagnostico`, sintomas) e **"O que entregamos."** (`#servicos`, frentes) do site Amaral & Silva. Objetivo: no celular as duas seções eram blocos de texto longos e cansativos. Agora:

1. **Sintomas** — conteúdo reescrito (6 dores comerciais, cada uma com 2 "sinais" concretos) e, no celular, um **carrossel automático infinito** de cartas altas.
2. **Entregas** — no celular, **duas abas (Marca · Tecnologia) que se revezam sozinhas a cada 6 s**, com barra de tempo e troca animada da lista.

Desktop/tablet (≥ 640px) mantém os layouts existentes (cascata de réguas e duas colunas com trilho). Só o **conteúdo** dos sintomas mudou em todas as larguras.

## About the Design Files
`design/index.html` é a **referência de design em HTML** (site PT completo com CSS e JS embutidos), não código para copiar direto. Recrie no ambiente do codebase (Next/React) com os padrões de lá. As partes relevantes estão marcadas nos comentários `Diagnóstico`, `FRENTES`, `Carrossel de sintomas` e `Abas de entregas`.

`design/en/index.html` está **desatualizado** — foi gerado antes desta sessão. O conteúdo EN de todos os textos novos está nos atributos `data-en` de `design/index.html`; regenere o EN a partir dele.

## Fidelity
**High-fidelity.** Cores, tipografia, espaçamento, timings e easing são finais. Textos: revisar copy dos sintomas (proposta do design, aprovada em conversa).

## Tokens usados
```
--bg-card:     #141821
--ink:         #F1EEE6
--ink-soft:    #A6A39B
--ochre:       #C9A24E
--blue:        #7A93E6
--line:        #242933
--line-strong: #3A4150
--serif: 'Fraunces'      --sans: 'Inter'      --mono: 'IBM Plex Mono'
--r-surface: 18px
--gutter: 32px (20px abaixo de 600px)
```
Breakpoint das duas versões celular: `max-width: 639px`.

---

## 1. Sintomas — conteúdo (todas as larguras)

Seis `<article class="symptom">`. Todos usam a **mesma cor ocre** (`--symptom-tone: #C9A24E`) — a divisão marca/sistema não é mais visível para o leitor (classes `symptom--brand/--tech` ficam só como anotação).

Cada artigo:
- `symptom__index` — "01"…"06", mono 14px ocre (só desktop).
- `symptom__side` — "Marca" / "Sistema", mono 11px uppercase 0.14em ocre. **Escondido em todas as larguras** (desktop: `display:none`; celular: vira só o disco, ver abaixo).
- `symptom__title` — Fraunces, ver tamanhos por breakpoint.
- `symptom__text` — Inter, uma frase.
- `symptom__signs` — `<ul>` com 2 `<li>`: Inter 14px `#A6A39B`, gap 6px, `max-width: 34ch`; cada item precedido de um traço de 10×1px ocre (`::before`, flex, `translateY(-4px)`).

Copy (PT / EN):

| # | Título | Frase | Sinais |
|---|---|---|---|
| 01 | Marketing sem retorno visível / Marketing with no visible return | Verba sai todo mês; ninguém sabe qual campanha trouxe quem. / Budget goes out every month; nobody knows which campaign brought whom. | Anúncio, post e evento sem rastreio de origem / Ads, posts and events with no source tracking · Orçamento decidido no feeling, ano após ano / Budget set by gut feeling, year after year |
| 02 | Cresceu, e o caos cresceu junto / Grew — and the chaos grew with it | Mais clientes, mais gente — e os mesmos processos de quando eram cinco. / More clients, more people — and the same processes as when there were five. | Tudo depende de uma pessoa que sabe onde está cada coisa / Everything depends on the one person who knows where things are · Cada área com a sua planilha e o seu jeito / Every team with its own spreadsheet and its own way |
| 03 | Cada um explica a empresa de um jeito / Everyone explains the company differently | O site diz uma coisa, o vendedor outra, o post uma terceira. / The website says one thing, sales another, the post a third. | Proposta comercial com discurso diferente do site / Sales proposal with a different pitch from the website · Cliente não sabe dizer o que vocês fazem / Clients can't say what you actually do |
| 04 | Ninguém sabe o número certo / Nobody knows the right number | Duas planilhas, dois resultados — e o relatório leva dias pra sair. / Two spreadsheets, two results — and the report takes days to come out. | Fechamento do mês feito na mão / Month-end closing done by hand · Decisão tomada antes do dado chegar / Decisions made before the data arrives |
| 05 | Ferramenta cara que o time não usa / Expensive tool the team doesn't use | Licença paga, cadastro pela metade, trabalho de volta no WhatsApp. / Licence paid, records half-filled, work back on WhatsApp. | Sistema que exige adaptar a empresa a ele / A system that forces the company to adapt to it · Remendos improvisados em volta do software oficial / Improvised fixes around the official software |
| 06 | Fornecedor que entregou e sumiu / Vendor who delivered and vanished | Projeto atrasou, foi ao ar com pendências e ninguém mais responde. / Project ran late, went live with loose ends, and nobody answers anymore. | Sem manutenção nem acompanhamento depois do lançamento / No maintenance or follow-up after launch · Prazo prometido, prazo estourado / Deadline promised, deadline blown |

## 2. Sintomas — carrossel automático (celular)

### Estrutura
```
.symptoms__wrap  (overflow: hidden)
  .symptoms      (flex, gap 12px, width: max-content, padding 4px 0 8px,
                  margin: 0 calc(-1 * var(--gutter)) — sangra até as bordas)
    .symptom × 6 originais + × 6 clones (aria-hidden="true")
.symptoms__rail  (linha + legenda "toque para pausar" / "hold to pause")
```

### Carta (`.symptom`)
- `flex: 0 0 min(76vw, 340px)`; `min-height: 360px`; padding `22px 22px 24px`.
- `display:flex; flex-direction:column; justify-content:space-between; gap:28px`.
- Borda `1px solid #3A4150`, raio `18px`, `overflow:hidden`.
- Fundo: `radial-gradient(120% 80% at 100% 0%, color-mix(in oklab, #C9A24E 18%, transparent) 0%, transparent 60%), #141821`.
- Topo: **disco luminoso** 10px ocre, `box-shadow: 0 0 14px 3px color-mix(in oklab, #C9A24E 35%, transparent)` (é o `::before` de `symptom__side`, cujo texto está oculto com `font-size:0; color:transparent`).
- Centro (`margin: auto 0`): título Fraunces **26px**/1.15 `#F1EEE6`; frase Inter **15px**/1.45 `#A6A39B`, margin-top 10px.
- Rodapé: `symptom__signs` com `padding-top: 16px; border-top: 1px solid #242933`, 14px, `max-width: none`.
- `symptom__index` oculto. Animação de reveal ao rolar desativada nas cartas (`opacity:1; transform:none`).

### Movimento
- Script (só `max-width: 639px` e sem `prefers-reduced-motion`): clona os 6 filhos uma vez, marca clones com `aria-hidden="true"` e adiciona `is-in` a todos; adiciona classe `is-loop`.
- `.symptoms.is-loop { animation: symptoms-loop 42s linear infinite }`
  `@keyframes symptoms-loop { to { transform: translateX(calc(-50% - 6px)) } }` (−6px = metade do gap, para o encaixe do loop ser exato).
- Pausa: `.is-paused { animation-play-state: paused }` em `touchstart` / `pointerdown`; retoma em `touchend` / `touchcancel` / `pointerup` / `pointerleave`.
- ≥ 640px: clones ficam `display:none` (`.symptom[aria-hidden="true"]`) e não há animação.
- `prefers-reduced-motion: reduce`: sem animação (fica lista estática horizontal).

### Régua (`.symptoms__rail`)
- Flex, gap 14px, margin-top 14px; mono 12px, letter-spacing 0.1em, `#A6A39B`.
- `<i>` flex 1, 1px de altura, `linear-gradient(90deg, #C9A24E, transparent)`.
- Texto: "toque para pausar" / EN "hold to pause". Oculta ≥ 640px.

## 3. Entregas — abas automáticas (celular)

≥ 640px: nada muda (`.fronts` com trilho e duas colunas). < 640px: `.fronts` oculto e `.fronts__tabs` exibido.

### Estrutura
```
.fronts__tabs
  .fronts__tablist [role=tablist]  (grid 1fr 1fr, gap 16px)
    button.fronts__tab.fronts__tab--brand.is-on  "Marca & Estratégia" <i/>
    button.fronts__tab.fronts__tab--tech         "Tecnologia & Dados" <i/>
  .fronts__panels  (position: relative; margin-top 8px; min-height 340px)
    ul.fronts__panel.fronts__panel--brand.is-on [role=tabpanel]  (4 li)
    ul.fronts__panel.fronts__panel--tech        [role=tabpanel]  (4 li)
```
Conteúdo dos painéis = os 8 itens do desktop (h4 + p), mesmos textos PT/EN.

### Aba (`.fronts__tab`)
- Botão sem borda/fundo; Fraunces **20px**/600, line-height 1.1, alinhado à esquerda; `padding: 0 0 14px`; flex, gap 10px; `--front-tone`: ocre (brand) / azul `#7A93E6` (tech).
- `::before`: disco 10px na cor, `opacity: .35`; ativa (`.is-on`) → `opacity:1` + `box-shadow: 0 0 14px 3px color-mix(in oklab, tone 35%, transparent)`. Transições 0.3s.
- Cor do texto: inativa `#A6A39B`, ativa `#F1EEE6` (transition 0.3s).
- `::after`: linha base 1px `#3A4150` em toda a largura da aba.
- `<i>` (barra de tempo): absoluto na base, 1px, cor da frente, `width: 0`; na ativa: `animation: fronts-timer 6s linear forwards` (`from width 0 to 100%`). Reinicia a cada troca (o script força reflow).
- Quando o usuário toca (`.fronts__tabs.is-pinned`): barra da ativa fixa em 100%, sem animação.
- `:focus-visible { outline: 1px solid tone; outline-offset: 4px }`.

### Painel (`.fronts__panel`)
- Inativo: `position:absolute; inset: 0 0 auto 0; opacity:0; pointer-events:none; transform: translateX(18px)` (brand) / `translateX(-18px)` (tech).
- Ativo (`.is-on`): `position:relative; opacity:1; transform:none`. Transição `opacity .45s ease, transform .45s cubic-bezier(.2,.7,.2,1)`.
- `li`: `padding: 18px 0 18px 22px; border-bottom: 1px solid #242933` (último sem); traço 10×1px na cor da frente a `left:0; top:26px`.
- `h4`: Fraunces **22px**/1.15/600 `#F1EEE6`. `p`: Inter 15px/1.45 `#A6A39B`, margin-top 6px.
- Cascata de entrada no painel ativo: `li { animation: fronts-item .5s cubic-bezier(.2,.7,.2,1) both }` (`from opacity 0, translateY(8px)`), delays 0 / .06 / .12 / .18s.

### Comportamento (script)
- `DWELL = 6000ms`. `setInterval` alterna `show((i+1) % 2)`.
- `show(n)`: alterna `is-on` + `aria-selected` nas abas, `is-on` nos painéis, reinicia a animação da barra da aba ativa.
- Roda só com `max-width: 639px`, sem `prefers-reduced-motion` e **enquanto a seção está ≥ 30% visível** (IntersectionObserver; para ao sair).
- Clique numa aba: `pinned = true`, adiciona `.is-pinned`, para o intervalo, mostra a aba. Não retoma sozinho.
- `prefers-reduced-motion`: sem timer, barra cheia, sem transições.

## Files
- `design/index.html` — referência completa (PT). Seções relevantes: CSS "Diagnóstico" (~l. 635–800), CSS "No celular, O que entregamos vira duas abas" (~l. 1680–1800), `@keyframes symptoms-loop / fronts-timer / fronts-item` (~l. 523), markup `#diagnostico` e `#servicos` (~l. 1915–2160), scripts `autoLoop` e "Abas de entregas" (fim do arquivo).
- `design/en/index.html` — versão EN **anterior** a esta sessão; regenerar.
