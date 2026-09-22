# Handoff: rede de luz, galeria da dupla e diagnóstico em explorador

Rodada de 21–22/09/2026 do Claude Design (pacote
`design_handoff_rodada_set_2026`). Diferente das anteriores, o pacote veio com
`index.html` e `en/index.html` **finais** — não era referência a recriar. O que
está aqui é o que mudou e o que a implementação teve de fazer além do pacote.

Este handoff cobre e aposenta o `design_handoff_rede_e_espacos` e substitui o
tratamento de `#diagnostico` que veio de `handoff-diagnostico-lista.md`.

## O que mudou

**Caminhos relativos.** `/img/…` e `/fonts/…` viraram `img/…` no PT e
`../img/…` no EN, preloads de fonte inclusive. Funciona na Vercel e em qualquer
preview servido de subpasta.

**Espaços.** `.section` de `104px 0` para `80px 0 88px` (96/104 acima de
1600px, 60/64 abaixo de 600px); `.hero` 128 → 104; `.section-head` 48 → 40;
`.proof` 80 → 56; `.more` 72/40 → 56/32; `.contact` 96 → 80/88.

**Rede de luz** (`<canvas id="trail">`, logo após `</main>`). Ver a seção
"Rede de luz pela página" do `README.md`.

**Faixa de logos.** Corning saiu do SVG e virou texto, como os outros cinco
nomes. `img/logos/corning.svg` deixou de ser referenciado e saiu do repo — a
pasta `img/logos/` ficou vazia.

**A dupla** virou galeria: texto à esquerda (`.gallery__intro`), dois quadros
pendurados à direita (`.plaque`). Saíram o SVG do cômodo (`.room`), a fita de
luz `.gallery__floor`, o eyebrow e o rodapé "Marca × Tecnologia × Resultados".
Texto, cargos, bios e chips são os de sempre.

**Diagnóstico** deixou de ser lista estática e passou a reusar o explorador de
"O que entregamos" (`.explorer--diag`, `data-dwell="7000"`): seis títulos à
esquerda, painel à direita com área, frase, dois sinais e uma ilustração em
traço no canto. O conteúdo é novo, fornecido pelo cliente — seis áreas
(Marketing, Processos, Comunicação, Dados, Tecnologia, Continuidade). Abaixo de
640px o explorador **continua** explorador, ao contrário das entregas, que
viram abas.

Para atender os dois exploradores, o script deixou de pegar
`querySelector('[data-explorer]')` e passa por todos com `forEach`; o tempo de
cada um vem do `data-dwell` do próprio bloco e alimenta `--dwell` no CSS do
relógio.

**Contato.** O bloco `.qr` ("Uso físico") saiu, e o CSS `.qr*` com ele. Os dois
arquivos de QR continuam no repo: são para papel (cartão, crachá, proposta) e
`scripts/build-qr.py` segue gerando os dois.

## O que a implementação fez além do pacote

**A sexta ilustração não veio.** O painel de Continuidade chegou vazio nos dois
arquivos, embora o CSS trouxesse a classe `.pain__art--timeline`. Foi desenhada
aqui, seguindo a descrição do pacote: linha do tempo vertical Entrega →
Evolução → Ajustes → Resultados, com o fio arrebentando logo depois de
"Entrega" — toco solto, vão, e daí para baixo só paradas tracejadas ligadas por
um pontilhado esmaecido. Os rótulos têm `data-en`, então traduzem junto com o
resto.

**`scripts/build-en.mjs` não sabia dos caminhos relativos.** O script copia o
`index.html` como está, e com os caminhos agora relativos ele gerava um
`en/index.html` apontando para `/en/img/…`. Ganhou um passo que prefixa `../`
em `src`/`href` e em `url()` de `img/` e `fonts/`. Sem isso, toda regeneração
do EN quebrava as imagens e as fontes.

## Verificação

Rodado em Chromium headless contra o site servido localmente, PT e EN:
dois exploradores ativos, seis itens e seis ilustrações no diagnóstico, dois
quadros na galeria, canvas da rede presente e `window.__trail.emit()`
respondendo, bloco de QR ausente, Corning em texto. Sem scroll horizontal em
1440, 1200, 900, 640 e 375px. Sem JavaScript as seis seções continuam
visíveis. Com `prefers-reduced-motion` o canvas da rede fica `display:none`.

Os 404 de console que sobram são antigos e não são desta rodada: os cinco logos
da faixa, `img/projetos/gipsyy.jpg` e o script de insights, que só existe na
Vercel. A faixa já cobre a ausência com `onerror="this.remove()"` e mostra o
nome em texto.
