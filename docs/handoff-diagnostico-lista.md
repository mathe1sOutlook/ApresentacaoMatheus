# Handoff: Diagnóstico — sintomas em lista estática

## Overview
Seção **"Sua operação se reconhece aqui?"** (`#diagnostico`) do site Amaral & Silva. O carrossel infinito de cartas (handoff anterior `design_handoff_diagnostico_entregas_mobile`) foi **substituído por uma lista estática em duas colunas** separada por fios — sem cartas, sem movimento, sem numeração. Vale para todas as larguras (celular incluído). Conteúdo dos seis sintomas não mudou.

## About the Design Files
`design/index.html` (PT) e `design/en/index.html` (EN) são **referências de design em HTML**, não código para copiar. Recrie no ambiente do codebase (Next/React) com os padrões de lá. A parte relevante está no bloco CSS comentado `─── Diagnóstico` e na `<section id="diagnostico">`.

## Fidelity
**High-fidelity.** Cores, tipografia e espaçamento são finais.

## Tokens usados
```
--bg-deep:     fundo da seção (já existe)
--ink:         #F1EEE6
--ink-soft:    #A6A39B
--ochre:       #C9A24E
--line:        #242933
--line-strong: #3A4150
--serif: 'Fraunces'   --sans: 'Inter'   --mono: 'IBM Plex Mono'
```

## Estrutura
```html
<div class="symptoms__wrap">
  <div class="symptoms">
    <article class="symptom">
      <div class="symptom__head">
        <p class="symptom__index">01</p>          <!-- display:none -->
        <p class="symptom__side">Marca</p>        <!-- display:none -->
        <h3 class="symptom__title">…</h3>
      </div>
      <div class="symptom__body">
        <p class="symptom__text">…</p>
        <ul class="symptom__signs"><li>…</li><li>…</li></ul>
      </div>
    </article>
    × 6
  </div>
</div>
```

## Layout

**Wrapper** `.symptoms__wrap`: `margin-top: 8px; border-top: 1px solid #3A4150` (fio forte abre a lista). Sem sangria, sem máscara, sem overflow — fica dentro do `.container` normal.

**Lista** `.symptoms`: `display: grid`.
- `< 1000px`: 1 coluna.
- `≥ 1000px`: `grid-template-columns: 1fr 1fr; column-gap: 48px`.

**Item** `.symptom`: `display: grid; border-bottom: 1px solid #242933`.
- `< 700px`: 1 coluna, `gap: 14px; padding: 30px 0 34px`. Head em cima, body embaixo.
- `700–999px`: 2 colunas internas `5fr 7fr`, `column-gap: 32px`, `align-items: start` — título à esquerda, texto+sinais à direita. `.symptom__body` é flex column `gap: 14px`.
- `≥ 1000px`: volta a 1 coluna interna (`gap: 14px; padding: 32px 0 36px`). Itens ímpares (`:nth-child(odd)`) recebem `padding-right: 48px; border-right: 1px solid #242933` — o fio vertical divide as duas colunas da lista. `.symptom__signs { margin-top: 14px }`.

**Ordem dos itens** (leitura por linha, 2 colunas): 01 Marketing sem retorno visível · 02 Cresceu, e o caos cresceu junto · 03 Cada um explica a empresa de um jeito · 04 Ninguém sabe o número certo · 05 Ferramenta cara que o time não usa · 06 Fornecedor que entregou e sumiu.

## Tipografia
- `.symptom__title` — Fraunces 600, 26px, line-height 1.15, `text-wrap: balance`, cor `#F1EEE6`, margin 0.
- `.symptom__text` — Inter 16px, line-height 1.5, cor `#F1EEE6` (**ink cheio, não soft**), `max-width: 48ch`, margin 0.
- `.symptom__signs` — lista sem marcador; Inter 14px, line-height 1.45, cor `#A6A39B`, `gap: 6px`, `margin-top: 4px` (14px em ≥ 1000px). Cada `li` é flex `gap: 10px; align-items: baseline` com `::before` de 10×1px ocre `#C9A24E`, `translateY(-4px)`.
- `.symptom__index` e `.symptom__side` — `display: none` (mantidos no markup como anotação).

## Interações & comportamento
- **Nenhum movimento**: remover a chamada `autoLoop(...)` do carrossel de sintomas e a duplicação de cartas. A função pode ser apagada.
- Reveal ao rolar: os artigos têm `class="reveal"` e o container `data-reveal-step="70"` (70 ms de escalonamento entre itens) — mesmo mecanismo já usado no resto do site.
- Sem hover, sem estados.

## Copy
Ver tabela PT/EN em `design_handoff_diagnostico_entregas_mobile/README.md` (inalterada) ou os atributos `data-en` / `data-pt` nos arquivos.

## Files
- `design/index.html` — site PT completo; CSS em `─── Diagnóstico`, markup em `<section id="diagnostico">`, JS comentado em `// autoLoop(...)`.
- `design/en/index.html` — versão EN, mesma estrutura.

## Divergências da implementação

O site é HTML estático — não há Next nem React, então o CSS e o markup deste
handoff entraram como estão, sem recriação.

O `autoLoop` não foi apagado: o motor dele (passo contínuo, arrasto, roda
horizontal, inércia ao soltar) virou o da **faixa de clientes** do hero, que
na mesma sessão deixou de parar quando o mouse passa por cima. O que saiu do
`#diagnostico` foi a chamada, a duplicação das cartas e todo o CSS de
carrossel — inclusive as regras de `@media print` que devolviam as seis cartas
em grade no papel. Sobrou `.symptom { break-inside: avoid; }`, para um sintoma
não ser cortado entre duas páginas.

O modificador `--brand`/`--tech` segue no markup e no CSS definindo
`--symptom-tone`, mas os dois apontam para o mesmo ocre, como no design.
