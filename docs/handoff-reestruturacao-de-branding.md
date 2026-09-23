# Handoff: reestruturação de branding

Rodada de 23/09/2026 do Claude Design (pacote "Reestruturação de branding").
O pacote veio com um `index.html` de protótipo já espelhando o repo — ele é a
fonte da verdade —, as quatro imagens novas e um `trechos.md` com o CSS, o JS e
o HTML de cada mudança. Aplica o documento "Ajustes Visuais — Casa Martech"
(rodadas 6, 8, 9 e 10) mais os pedidos por WhatsApp. Copy, cores e tempos são
finais, aprovados pelo Bruno.

São nove frentes. As sete primeiras entraram como vieram; as duas últimas são
do implementador e estão marcadas.

## 1. Hero

O eyebrow diz **"Estratégia de marketing × Engenharia de sistemas"** (era "de
marca"), o título ganhou quebra explícita — "Marcas que se destacam. /
Tecnologias que se moldam." — e o lede virou primeira pessoa do plural: "Somos
dois. Um cuida de como a marca é vista, o outro de como ela funciona por
dentro. A gente aprendeu, projeto atrás de projeto, que essas duas coisas não
se resolvem separadas."

O tratamento bicolor (`<span class="mar">`, `<span class="tec">`) ficou. A
faixa "Já fizemos história com..." saiu daqui — ver §5. O hero termina no lede.

**O `<title>`, o `og:title` e o `og:description` não mudaram**: continuam
dizendo "Estratégia de marca" e "Tecnologia que sustenta", e o `og.png` /
`og-en.png` têm a frase antiga gravada na arte. O handoff não pediu, e mexer só
no texto descasaria dele a imagem. Fica para quando as duas coisas andarem
juntas.

## 2. "Uma casa, dois ofícios"

Era "Uma marca, dois ofícios". As duas bios viraram texto corrido de verdade —
a do Bruno em terceira pessoa, escrita pelo cliente; a do Matheus revisada pelo
próprio, com INPE e TQS. Uma iteração intermediária transformou as bios em
bullets e deixou para trás `.person__bio--list`; **esse CSS não entrou no
repo**, porque nada o usa.

## 3. Diagnóstico: de seis para oito áreas

A lista à esquerda mostra **número + tag** (`<span class="explorer__num">`, a
mesma classe do explorador de entregas, colorida por `data-front`); a frase
longa e os dois sinais ficam no painel. O grid do item virou
`30px minmax(0, 1fr) 12px`.

| # | Tag | Frente | Sobre |
| --- | --- | --- | --- |
| 01 | Marketing | ocre | dinheiro entra todo mês, ninguém rastreia até a venda |
| 02 | Processos | azul | a empresa cresceu, os processos não |
| 03 | Comunicação | ocre | site, vendedor e material dizem coisas diferentes |
| 04 | Dados | azul | duas planilhas, dois números para o mesmo indicador |
| 05 | Tecnologia | azul | comprou a ferramenta certa, ninguém usa |
| 06 | Continuidade | azul | entregou e nunca mais voltou |
| 07 | Pesquisa | ocre | decide no feeling de quem está na sala (**novo**) |
| 08 | IA aplicada | azul | hora de gente cara em tarefa de máquina (**novo**) |

Os painéis 07 e 08 ganharam `.pain__art` no estilo dos outros seis — viewBox
160×140, traço `#C9A24E` de 1px, destaque `#E8C97A`, legendas em Plex Mono de
8px. O 07 é prancheta → seta → nuvem de pontos com lupa ("A SALA / O
MERCADO"); o 08 é três folhas → seta → máquina com saída ("À MÃO /
AUTOMÁTICO"). O script do explorador é agnóstico à contagem: nada a mudar nele.

## 4. Cases

O caso 01 passou a se chamar **"Media Portal Technology"** no card, na ficha e
em todo lugar (era "Media Portal Soluções"), a métrica virou "Reposicionamento
digital · redesign completo" e o **bloco de números saiu da ficha** (18+ anos /
3 meses / 2 semanas) — ela ficou com Stack e Arquitetura. A capa é uma
composição nova, `mediaportal.png`; a receita está no `README.md`.

O caso 02 (Ame × MindMiners) trocou a foto do banco de praça pelo slide
"Marketing Data Driven". O caso 03 (Ame × X) recebeu **essa foto do banco** —
ela migrou de arquivo — e a capa passou de peça para foto, sem `case__fundo`.

Corning, AMWC e Ame Tom de voz não mudaram. Gipsyy ganhou `gipsyy.jpg` e o 404
antigo acabou.

## 5. "Já fizemos história com..."

Saiu do hero e foi para o **fim da seção de cases**, depois de "Outros projetos
selecionados", dentro da mesma `<section>`. Ganhou `border-bottom` além do
`border-top` e `margin-top: 72px`.

Os `<img>` de logo saíram: apontavam para SVGs que nunca existiram e cada card
gastava um 404 para cair no nome escrito. A lista acompanha as empresas da bio
do Bruno — Corning · Informa Markets · Ame Digital · Gipsyy · Media Portal
Technology. QuintoAndar saiu.

## 6. Contato

"Respondemos em até 1 dia útil" saiu do `.contact__text` e do `#lead-ok`, que
agora diz "Recebemos. Retornamos no contato que você deixou." Os dois links
ficaram coloridos: WhatsApp em ocre, e-mail em azul, sublinhado na mesma cor a
45%; no hover voltam ao creme com sublinhado em `currentColor`.

## 7. Focos de luz e "Como trabalhamos"

O `#processo` ganhou um **segundo foco**, azul, na margem direita — menor e
mais para fora que os outros (`k: 0.32`, `fx` a `·0.35`). Para isso `SPOTS[id]`
passou a aceitar um objeto **ou um array**, e a semente por foco virou
`si·53 + k·17`.

A lista `.steps` adotou a gramática do explorador de entregas: um passo aceso
por vez, os outros a 42% (70% no hover), linha de tempo de 1px no pé na cor do
passo, avanço a cada 4 s só com ≥40% da lista visível. Mouse segura, clique
fixa, `document.hidden` para, `prefers-reduced-motion` desliga tudo. As
descrições viraram listas `.step__list`, com traço de 8px e entrada escalonada
de 0,1 s.

**"Revisões por ciclo" foi sugestão do Claude Design** para completar o passo
03, não veio do cliente — confirmar.

## 8. As imagens passaram por uma peneira *(decisão do implementador)*

O pacote trouxe 3,2 MB em quatro arquivos; entraram 938 KB, sem perda visível.

| Arquivo | Veio | Entrou | O que foi feito |
| --- | --- | --- | --- |
| `casos/mediaportal.png` | 220 KB | 106 KB | RGBA → RGB, PNG otimizado; um ponto branco solto do print saiu |
| `casos/mindminers.jpg` | 1305 KB (PNG) | 218 KB | cortadas 5 colunas pretas na direita e 1 linha na base, **o ponteiro do mouse tinha ficado gravado** sobre o fundo rosa, e o resto virou JPEG progressivo q88 4:4:4 |
| `casos/ame-x.jpg` | 704 KB | 427 KB | cortada a última linha (sobra da captura), JPEG progressivo q88 4:2:0 |
| `projetos/gipsyy.jpg` | 1039 KB (PNG) | 188 KB | JPEG progressivo q88 4:4:4 |

O `mediaportal` é o único que segue PNG: é composição com degradê chapado e
logo, e em JPEG o fundo escuro ganha faixas. Os outros três são fotografia —
PNG só pesava. Nenhum dos quatro tinha transparência real.

## 9. Dois ajustes de enquadramento *(decisão do implementador)*

**O caso 02 voltou para o modo peça.** O pacote o entregou em
`case__cover--photo`, e na tela o resultado era ruim de duas maneiras: um slide
de 1,79:1 numa capa de 0,95:1 perde metade da largura — justamente a metade
onde está o título dele —, e o rótulo do cliente, que no modo foto fica sobre a
imagem, caía exatamente em cima da linha de texto do slide. `case__cover--piece`
resolve os dois: monta a peça inteira na prancha e esconde o rótulo. O
`case__fundo` (o mesmo arquivo, ampliado e desfocado) preenche o cartão. A
regra ficou no `README.md`: o que decide o modo não é a origem do arquivo, é se
ele tem texto.

**O card do Gipsyy ganhou `object-position: 50% 30%`.** A imagem é retrato
(0,91:1) num slot 2:1; centrada, o corte passava na boca da cigana. Subindo o
enquadramento entram as mãos, o rosto e a bola de cristal. O cartaz do AMWC já
tinha um ajuste assim, por ser retrato no mesmo slot.

## Pendências

- **FundaCalc** — o handoff o marcou como pendente, sem imagem nova. As duas
  que estão no ar (`fundacalc`, `fundacalc-spt`) continuam onde estavam.
- **A lista da faixa** — ordem e nomes não foram confirmados pelo cliente.
- **"Revisões por ciclo"** — ver §7.
- **`<title>` e Open Graph** — ver §1.
