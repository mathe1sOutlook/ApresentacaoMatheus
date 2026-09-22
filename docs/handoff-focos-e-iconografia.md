# Handoff: focos de luz e iconografia do diagnóstico

Rodada de 22/09/2026 do Claude Design (pacote
`design_handoff_focos_e_iconografia`). Diferente da anterior, o pacote não veio
com arquivos finais: veio com um `index.html` de protótipo já espelhando o
repo, mais os três pedaços isolados (`focos.css`, `focos.js`,
`iconografia-diagnostico.html`). São duas mudanças.

## 1. A rede de luz vira focos de luz

O `<canvas id="trail">` ficou onde estava; o que mudou foi o que ele desenha.
Saiu a rede — nós, arestas, impulsos que corriam os fios — e entraram seis
manchas grandes e desfocadas, uma por seção, paradas nas margens.

O desenho é um gradiente radial simples; quem faz a mancha é o
`filter: blur(40px)` (era 3px). O movimento é deriva mais respiração: cada foco
tem fase, velocidade e deriva próprias, fixas por semente, e a respiração é uma
curva em S de 23 a 36 segundos que varia o brilho entre 65% e 100% do máximo.
Não há pulso e a luz nunca apaga.

A ancoragem está no `README.md`, na seção "Focos de luz pela página". A
interface com o hero não mudou: `window.__trail.emit()` continua sendo chamado
quando um pulso da casa chega à escada ou ao canto inferior esquerdo, e agora
acende o foco mais próximo do centro da janela.

A razão da troca: a rede desenhava bem, mas disputava a leitura com o texto.

## 2. As seis ilustrações do diagnóstico

Cada `.pain__art` foi redesenhada, com uma metáfora própria e um ponto de
ruptura visível. O estilo é o mesmo de antes — viewBox `0 0 160 140`, traço
`#C9A24E` de 1px, destaque `#E8C97A`, legendas em IBM Plex Mono de 8px.

| # | Painel | Metáfora | Ruptura |
| --- | --- | --- | --- |
| 0 | Marketing | Três barras sólidas "INVESTIDO"; ao lado, três vazias pontilhadas "RETORNO" | um "?" sobre cada barra vazia |
| 1 | Processos | Caixa larga cheia de pontos sobre um portão estreito de duas hastes | os pontos descem um a um, apagando; a fila fica presa acima |
| 2 | Comunicação | Três bolhas de fala, cada uma com um tipo de "texto" | pontilhados que convergem para uma pessoa com "?" |
| 3 | Dados | Três relatórios com o mesmo gráfico, a barra destacada em altura diferente | "≠" entre eles, legenda "MESMO INDICADOR · 3 FONTES" |
| 4 | Tecnologia | Janela de sistema com seis módulos, um aceso e cinco pontilhados | o fluxo dá a volta por fora e chega à planilha e ao chat |
| 5 | Continuidade | Curva firme sobe até a bandeira "ENTREGA" | depois vira pontilhado que se apaga, com marcos vazios e a legenda "PENDÊNCIAS" |

Os `<text>` já vieram com `data-en` — a lição da rodada passada, em que os
rótulos do SVG estavam fixos em cada arquivo e não sobreviviam ao gerador do
EN.

## O que a implementação fez

O pacote traz um `index.html` de protótipo, não um arquivo final, mas ele já
estava em cima do estado atual do repo, moldura dos quadros inclusive: as 22
diferenças caem todas nas três regiões documentadas (o CSS do `.trail`, os seis
SVGs e a IIFE dos focos). Foi adotado como está, convertido para CRLF, e o
`en/index.html` regenerado pelo `scripts/build-en.mjs` — o pacote avisa que o
EN não recebeu as mudanças, mas aqui ele é gerado, então não há o que replicar.

Antes de adotar, todo `<text>` das seis ilustrações foi conferido: ou tem
`data-en`, ou é símbolo que não se traduz ("?", "≠", números).

## Verificação

Chromium headless contra o site servido localmente, PT e EN: seis ilustrações
no diagnóstico, os rótulos saindo em inglês no `/en` (INVESTED, RETURNED, SAME
INDICATOR, 3 SOURCES, DELIVERY, LOOSE ENDS), `window.__trail.emit()`
respondendo, canvas com `blur(40px)` e `mix-blend-mode: screen`. Sem scroll
horizontal em 1440, 1200, 900, 640 e 375px. Sem JavaScript as seis seções
continuam visíveis; com `prefers-reduced-motion` o canvas sai.

O foco do `#contato` foi conferido em tela: cai sob o texto da coluna esquerda,
nunca atrás do formulário.
