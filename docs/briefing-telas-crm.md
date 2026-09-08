# Prompt para o Claude Design — telas do CRM Media Portal

> **Como usar:** cole a seção 0 como prompt no Claude Design e anexe (ou cole
> em seguida) as seções 1 a 7 como referência. A seção 0 sozinha não basta —
> é a 3 que impede o designer de reinventar nomes de componente, e a 6 que
> impede os números de se contradizerem entre as telas.

---

## 0. O prompt

```
Refine três mockups de um CRM que ilustram uma proposta comercial. Eles já
existem em HTML e estão simples demais: os elementos têm todos o mesmo peso,
nada dentro de um painel diz onde olhar primeiro, e nenhum número tem
denominador.

As três telas são: (01) Visão geral, com rail lateral, quatro indicadores, um
gráfico de barras e uma lista de contas para revisar; (02) Ficha da conta, com
cabeçalho, abas, dois painéis de campos e uma linha do tempo; (03) Funil de
negócios, com cinco colunas de estágio e cartões de negócio.

O produto é um CRM próprio da Media Portal Soluções, empresa brasileira de
tecnologia para mídia e broadcast, com quase 20 anos de casa. Os clientes dela
são emissoras de TV, rádios, produtoras, órgãos públicos e instituições
culturais.

O QUE EU QUERO
Densidade e hierarquia, não mais componentes. A maior parte da correção é
tratamento do que já existe: ordenar as barras e imprimir o valor em cima, dar
denominador a cada número, trocar a etiqueta repetida por um dado que varia
linha a linha, desenhar a régua da linha do tempo, dar ao funil a forma de
funil pelo cabeçalho da coluna. Só entram elementos novos onde eles provam
alguma coisa que hoje a tela não prova.

REGRAS QUE NÃO PODEM SER QUEBRADAS
1. O sistema visual é fixo — cores, fontes e raios estão na seção 1. Seleção
   técnica é azul, sempre; laranja só em ação e em UM acento por tela; verde só
   em dinheiro e situação positiva.
2. Só existe o que foi contratado. As sete frentes estão na seção 4. Nada de
   IA, previsão, score de fechamento, automação de vendas, app de celular ou
   armazenamento de arquivo. Todo elemento que você desenhar tem de caber numa
   das sete — e eu vou conferir.
3. Os números têm de fechar entre as três telas. A tabela da seção 6 é a fonte:
   306 contas = 150 ativas + 63 em atenção + 93 sem registro; as seis barras
   somam 1.348; as cinco colunas do funil somam R$ 412.000. Nenhum valor de
   negócio do HTML atual muda.
4. Largura útil de 880px na tela 01 e 840px nas telas 02 e 03. Abaixo disso a
   tela rola de lado dentro da moldura — não reflui.
5. É mockup dentro de uma proposta, não o produto. Densidade demais cansa e
   atrapalha a leitura. Cada elemento novo precisa se pagar.

Use os nomes de componente que já existem (seção 3). A seção 5 traz, item a
item, o que acrescentar, onde entra, qual frente o sustenta e o conteúdo exato
que ele deve mostrar.
```
# Briefing para o Claude Design — telas do CRM Media Portal

Contexto: três mockups dentro de uma proposta comercial já publicada em
`/proposta-mediaportal-crm-gkE7aZiV41L2LYkWDqhXLz7l`. São ilustrações do
produto proposto, não o produto. Precisam ficar mais densas sem prometer
função fora do escopo contratado.

---

## 1. Sistema visual (fixo, não inventar cor nem fonte)

```
--bg            #05070d   fundo da página
--bg-alt        #070a12   fundo alternado de seção e barra do navegador
--panel         #0b1220   painel e cartão
--panel-strong  #101a30   célula elevada dentro de painel
--text          #f5f7fa   texto principal
--quote         #e2e8f0   texto de destaque
--muted         #94a3b8   texto secundário
--dim           #7d8a9c   rótulo, legenda, metadado
--blue          #5aa4f2   seleção, dado técnico, item ativo
--blue-light    #8fc1f7   hover
--blue-deep     #136ef2   base do gradiente das barras
--orange        #f2661c   ação e UM acento por tela
--orange-soft   #ff8a4a   texto laranja sobre painel
--green         #34d399   dinheiro e situação positiva
--ink           #0a0f18   texto escuro sobre laranja
--line          rgba(255,255,255,.08)   borda padrão
--line-strong   rgba(255,255,255,.16)   borda de painel e input
--line-blue     rgba(90,164,242,.35)    borda de seleção
```

**Tipografia:** `Space Grotesk` (700) em título, número e display;
`Inter` (400–600) em corpo, rótulo e formulário. Números com
`font-variant-numeric: tabular-nums`.

**Regra semântica da marca:** seleção técnica é **azul**, sempre. Laranja
entra só em ação, na marca e em **um** acento por tela. Verde é exclusivo de
dinheiro e situação positiva.

**Raios:** botão/input 9px · célula 12px · cartão 14–16px · painel grande
20–22px · chip/pill 16–20px.

---

## 2. A moldura das três telas (comum, não mexer)

```
figure.tela
  figcaption.tela-cap
    span.tela-num      "01"  — Space Grotesk, 12,5px, azul, ls .14em
    h3.tela-tit        título da tela — 20px
    span.tela-selo     "Dados ilustrativos" — pill laranja, 10px, caixa alta
    span.tela-txt      uma frase explicando a tela — 14,5px, muted
  div.chrome           borda 1px line-strong, raio 14px, sombra 0 30px 80px rgba(0,0,0,.5)
    div.chrome-bar     barra do navegador, fundo #080b14
      span.dot.r / .y / .g      10px — #ff5f57 / #febc2e / #28c840
      span.url                  endereço, 11,5px, dim, fundo panel, raio 7px
    div.chrome-body    role="img" + aria-label + tabindex="0"; overflow-x:auto
      > .app | .ficha | .funil   o conteúdo da tela
```

`.chrome-body` é o rolador; a largura mínima fica no filho (`.app` 880px,
`.ficha` e `.funil` 840px). No papel, `@media print` aplica `zoom:.74`.

**Títulos internos dos mockups** (não são `<h*>`, para não entrarem na
hierarquia do documento):

```
p.mk-t1          título da tela dentro do app — 22px, Space Grotesk 700
p.mk-t2          rótulo de painel — 11,5px, caixa alta, ls .12em, muted
p.mk-t2.forte    título de painel em caixa baixa — 15px, cor text
p.mk-t3          cabeçalho de coluna do funil — 10,5px, caixa alta, flex
```

---

## 3. Inventário dos controles, tela a tela

### Tela 01 — Visão geral · `.app` (grid `186px 1fr`, gap 22px, min-width 880px)

```
aside.rail                       barra lateral, fundo bg-alt, borda direita
  .rail-marca > .rail-quad + b   quadrado 20px em gradiente azul + "MP · CRM"
  .rail-nav
    span.rail-item[.on]          6 itens; > i = quadradinho 13px
                                 .on = fundo rgba(90,164,242,.1), i azul
.app-main
  header.app-top
    p.mk-t1                      "Visão Geral"
    p                            "Atualizado agora · 306 contas monitoradas"
    .app-top-dir
      span.busca                 campo de busca falso, 12px, borda line-strong
      span.avatar                círculo 28px em gradiente azul
  .kpis                          grid 4 colunas, gap 12px
    .kpi                         > .kpi-rot (10px caixa alta dim)
                                 > b.kpi-num (29px Space Grotesk, tabular)
                                 > .kpi-var[.pos|.alerta] (11px, verde/laranja)
  .app-grid                      grid 1.35fr / 1fr, align-items:start
    .painel > p.mk-t2.forte + .barras
      .barra[style="--h:78%"]    grid-template-rows 168px auto
        > i                      a barra: gradiente blue-deep → rgba(19,110,242,.35)
        > em                     rótulo da categoria, 10,5px
    .painel > p.mk-t2.forte + ul.revisar
      li > span > b + em         nome + "última interação · 2024"
         > span.tag[.atencao|.ativo]
```

### Tela 02 — Ficha da conta · `.ficha` (grid, gap 20px, padding 24px, min-width 840px)

```
header.ficha-top
  span.ficha-av                  quadrado 52px, iniciais, gradiente azul
  div > p.mk-t1 + p              nome + "Emissora de TV · São Paulo, SP · …"
  .ficha-alerta                  > span.tag.atencao + em (motivo)
.abas                            5 abas; span.on = branco + borda inferior azul
.ficha-grid                      grid 270px / 1fr, align-items:start
  .ficha-col                     coluna esquerda, gap 14px
    .painel > p.mk-t2 + dl.campos
      dt                         rótulo 11px dim
      dd[.vazio]                 valor 13,5px 600; .vazio = itálico dim
  .painel > p.mk-t2 + ul.jornada
    li > i                       marcador 22px, borda azul, quadrado interno
       > span > b + em           evento + "2024 · Comercial"
       > span.jornada-tag        categoria, 10,5px dim
```

### Tela 03 — Funil · `.funil` (grid, gap 18px, padding 24px, min-width 840px)

```
header.funil-top
  div > p.mk-t1 + p              "Negócios" + "Funil comercial · 11 negócios…"
  span.pipe                      total, 14px Space Grotesk, painel com borda
.colunas                         grid repeat(5, minmax(0,1fr)), gap 10px
  .coluna                        painel, min-height 230px, align-content:start
    p.mk-t3 > span               "LEAD" + contagem
    .neg                         cartão, fundo panel-strong, raio 9px
      b                          nome do negócio, 12px
      span.valor                 valor, 14px Space Grotesk, verde
      em                         nota curta, 10,5px dim
```

---

## 4. Restrições que o desenho não pode violar

1. **Só existe o que foi contratado.** As sete frentes da proposta são:
   (1) auditoria e consolidação numa fonte única; (2) esqueleto do sistema —
   busca, filtros, ordenação, agrupamento, jornada por conta, performance
   comercial, módulo financeiro, acesso a dados brutos; (3) dashboards e
   relatórios exportáveis; (4) APIs de integração; (5) visão de marketing,
   performance e disparo de e-mail; (6) integração com o site institucional;
   (7) base de dados inteligente.
   Nada de IA, previsão, score preditivo, automação de vendas ou app de celular.
2. **306 contas e 1.348 interações** são números reais e não mudam. Todo o
   resto é ilustrativo, e a página avisa isso por extenso na própria seção.
3. **Os números têm de fechar entre as três telas.** O pipeline do funil bate
   com o KPI da visão geral; uma conta marcada "em atenção" não pode aparecer
   com atividade recente no funil.
4. **Largura útil de 880px** (tela 01) e **840px** (telas 02 e 03). Abaixo
   disso a tela rola de lado dentro da moldura — não reflui.
5. É **mockup dentro de uma proposta**, não o produto. Densidade demais cansa e
   atrapalha a leitura. Cada elemento novo precisa se pagar.

---

## 5. O que mudar, tela a tela
> Cada item cita a **frente do escopo** que o sustenta. Elemento sem frente nomeada não entra.

### Tela 01 — Visão geral
**Diagnóstico.** É um relatório impresso, não um lugar de trabalho, e a causa mecânica é a uniformidade. Os quatro `.kpi` têm a mesma caixa, o mesmo `.kpi-num` de 29px e a mesma linha embaixo — três delas verdes, uma dizendo "↑ estável no mês", que é uma seta de alta ao lado da palavra estável. Verde que aparece três vezes deixa de significar alguma coisa. Nenhum dos quatro números tem base: 306 está numa linha de 12,5px do `.app-top`, e 150 + 63 deixa 93 contas sem lugar — subtração que o leitor faz de cabeça no primeiro olhar. O painel do gráfico ocupa 1,35fr da `.app-grid` e não informa nada além de "suporte é a maior": as seis `.barra` têm o mesmo `linear-gradient`, estão em ordem arbitrária, não trazem valor e a categoria "Outro" anuncia que a auditoria não terminou. A `.revisar` tem quatro linhas idênticas, cada uma com a mesma `.tag.atencao` — etiqueta igual em toda linha de uma lista já filtrada não carrega informação, só espalha quatro manchas laranja e rouba o acento da tela —, e a terceira delas está marcada `.tag.ativo` dentro de uma lista chamada "Contas para revisar", o que prova que a lista não tem critério. O `.rail` gasta 186px com seis itens rigorosamente iguais, nenhum dos quais é um dos módulos contratados, e deixa um terço da altura vazio. E o `.busca` é um retângulo com uma legenda dentro: sem lupa, não lê como campo.

#### Acrescentar

**1. KPI "Base consolidada" com faixa de composição de três segmentos**
- *Onde:* Primeiro `.kpi` da grade `.kpis` — que continua em `repeat(4,1fr)`, sem mudar de proporção. Entre `.kpi-num` e o rodapé entra uma faixa de 6px de altura, raio 3px, dividida em três segmentos contíguos: `var(--green)` 49%, `var(--orange-soft)` 20,6%, `rgba(255,255,255,.12)` 30,4%. O `.kpi-var` deste cartão vira uma legenda de três micro-linhas, cada uma com um ponto de 6px na cor do seu segmento.
- *Por quê:* É o número que ancora todos os outros e hoje está escondido numa linha de 12,5px do `.app-top`. A faixa mostra de onde saem 150 e 63 sem gastar um cartão para cada, e diz a verdade mais dura da auditoria — 93 contas sem nenhuma interação registrada. É também a primeira quebra de ritmo da fileira, obtida sem mexer na largura das colunas: a grade fica em `repeat(4,1fr)` porque, em `1.6fr 1fr 1fr 1fr`, os três cartões estreitos caem para ~99px de texto útil e "R$ 412k" em 29px de Space Grotesk não cabe.
- *Frente:* Frente 1 — auditoria interna de dados e consolidação numa fonte única de verdade (o total e as três situações são o resultado da auditoria).
- *Conteúdo exato:* Rótulo BASE CONSOLIDADA · número 306 · legenda em três linhas: "● 150 ativas" (verde) / "● 63 em atenção" (laranja) / "● 93 sem registro" (branco 12%)

**2. Rodapés dos quatro KPIs reescritos como derivação, em duas linhas**
- *Onde:* Os quatro `.kpi-var`. Reservar altura de duas linhas em todos os quatro, para as linhas de base ficarem alinhadas mesmo quando o texto ocupa uma só. Entra uma variação neutra ao lado das duas de hoje (`.pos` verde e `.alerta` laranja): mesmo tamanho e peso, cor `var(--dim)`. Com isso `.kpi-var.pos` deixa de ser usada nesta tela.
- *Por quê:* Hoje os quatro rodapés são elogio ("↑ estável no mês", "prioridade de reativação"); viram a regra que produziu o número. É o que impede a conta de cabeça de dar errado e ensina o produto de graça — o leitor entende que cada indicador tem recorte, sem que nenhuma barra de filtros precise ser desenhada. O verde sai da fileira inteira e volta a significar dinheiro.
- *Frente:* Frentes 1 (a regra vem da consolidação), 2 (performance comercial) e 3 (leitura de diretoria).
- *Conteúdo exato:* BASE CONSOLIDADA · legenda de três linhas (item anterior) | EM ATENÇÃO 63 · laranja: "R$ 156.500 parados" / "há mais de 12 meses" | PIPELINE ABERTO R$ 412k · neutro: "11 negócios em aberto" / "média de R$ 37,5 mil" | TAXA DE CONVERSÃO 27% · neutro: "10 de 37 negócios" / "encerrados em 12 meses"

**3. Barras ordenadas por volume, com o valor impresso acima e as secundárias esmaecidas**
- *Onde:* `.barras .barra` passa de `grid-template-rows:168px auto` para `auto 132px auto` — a linha nova, em cima, é o valor em `var(--display)` 12px, `font-variant-numeric:tabular-nums`, cor `var(--muted)`. A `.barra` mais alta mantém o gradiente cheio; as outras cinco vão a `opacity:.45` no `<i>`. O `.mk-t2.forte` ganha, à direita, um contador em `var(--dim)`.
- *Por quê:* Seis barras sem número não dizem nada além de "suporte é o maior", e a ordem arbitrária desperdiça a única leitura que o gráfico poderia dar de graça. Ordenar é uma função contratada aparecendo na tela sem controle novo; o valor em cima resolve a escala sem eixo Y; o esmaecimento dá um sujeito ao gráfico em vez de seis iguais. Baixar a faixa de 168px para 132px paga os rótulos numéricos sem alongar a figura — e os `--h` de hoje NÃO mudam: 281/360 = 78%, 223/360 = 62%, 205/360 = 57%, 159/360 = 44%, 120/360 = 33% são exatamente os valores que já estão no HTML. Só a ordem muda.
- *Frente:* Frentes 1 (a soma é o total consolidado), 2 (ordenação sobre toda a base) e 3 (dashboards e relatórios).
- *Conteúdo exato:* Contador ao lado do título: "1.348 interações consolidadas" — sem janela de tempo, porque 1.348 é o total da base, não o de doze meses. Barras nesta ordem: Suporte 360 (--h:100%) · Proposta 281 (78%) · Reunião 223 (62%) · Visita 205 (57%) · Renov. 159 (44%) · Implant. 120 (33%)

**4. Cabeçalho de trabalho da lista de revisão**
- *Onde:* Linha nova dentro do segundo `.painel` da `.app-grid`, entre o `.mk-t2.forte` "Contas para revisar" e a `<ul class="revisar">`. Um chip no desenho do `.fluxo .chip` (fundo `var(--panel)`, borda `var(--line-strong)`, raio 20px), porém em 10,5px e altura reduzida, cor `var(--dim)` — não laranja. À direita, o contador em `var(--dim)`.
- *Por quê:* Hoje a lista é uma afirmação sem critério: quatro nomes que o leitor tem de aceitar. Dizer a regra que produziu a lista e quantas contas existem no total transforma as mesmas quatro linhas na prova de que há busca, filtro e ordenação sobre a base inteira. É a adição mais barata da tela e a que mais paga — e é ela que devolve a `.tag.atencao` ao seu lugar: um chip de filtro no cabeçalho, não quatro etiquetas repetidas dentro da lista.
- *Frente:* Frente 2 — busca, filtros, ordenação e agrupamento sobre toda a base.
- *Conteúdo exato:* Chip: "sem interação há +12 meses"    ·    contador à direita: "4 de 63"

**5. Linhas da lista com selo de iniciais, mês da última interação e valor em aberto**
- *Onde:* Cada `.revisar li` passa a três colunas: um quadrado de 26px com raio 8px e as iniciais (mesmo gradiente e mesma geometria do `.ficha-av`, reduzido), o bloco de texto atual e, à direita, o valor em `var(--display)`, `tabular-nums`, cor `var(--text)` — nunca verde. O `<em>` passa a trazer mês/ano e meses decorridos. Para o selo caber, `.app-grid` vai de `1.35fr 1fr` para `1.2fr 1fr`: o painel direito sobe de 231px para 250px úteis e o esquerdo ainda deixa 42px por barra, o suficiente para rótulos de uma palavra abreviada.
- *Por quê:* Cada linha ganha três pesos tipográficos em vez de um, e o número da direita cria uma coluna de leitura vertical que hoje não existe. "última interação · 2024" não permite decidir nada; mês e meses decorridos permitem. O valor vai em branco e não em verde porque verde é dinheiro que entra, e isto é dinheiro parado — a distinção precisa ser visível já na primeira tela.
- *Frente:* Frentes 2 (visão de jornada por conta e ordenação sobre a base) e 1 (o valor consolidado por conta é resultado da auditoria).
- *Conteúdo exato:* TC · TV Cultura · "mar/2024 · 30 meses" · R$ 68.000 | AL · Assembleia Legislativa · PI · "nov/2023 · 34 meses" · R$ 45.000 | ER · EPTV Regional · "set/2024 · 24 meses" · R$ 27.500 | TCC · TV Câmara · Campinas · "ago/2025 · 13 meses" · R$ 16.000

**6. Rodapé do painel de revisão**
- *Onde:* Rodapé do mesmo `.painel`, separado por `border-top:1px solid var(--line)`, 11,5px em `var(--dim)`, com o texto à esquerda e o link à direita.
- *Por quê:* Quatro linhas num painel só valem se houver caminho para as outras 59 — é o gesto que diz que a tela é uma entrada para a base e não um resumo fechado, que é literalmente o que a frente 2 vende. E declarar a ordem fecha o cabeçalho: a lista não está ordenada por tempo parado (30, 34, 24, 13 meses), está por dinheiro, e o leitor precisa saber disso para não achar que a tela erra.
- *Frente:* Frentes 2 (ordenação sobre toda a base) e 3 (a lista é um recorte exportável).
- *Conteúdo exato:* ordenadas pelo valor em aberto                    ver as 63 →

**7. Rail em dois grupos, reescrito como índice das sete frentes**
- *Onde:* `.rail` vira coluna com `display:flex;flex-direction:column`; o `.rail-nav` de cima cresce e um segundo grupo é empurrado para baixo com `margin-top:auto`, separado por `border-top:1px solid var(--line)` e antecedido por um rótulo de grupo no tratamento do `.mk-t2` (10px, caixa alta, `.12em` de tracking, `var(--dim)`). Dois `.rail-item` ganham contagem à direita, em `var(--dim)`. Tudo dentro dos 186px que o `.app` já reserva e da altura que hoje sobra vazia.
- *Por quê:* O rail é o índice do produto e é a primeira coisa que o olho percorre. Hoje ele é o menu de qualquer CRM de prateleira e não contém nenhum dos módulos que estão sendo comprados — não tem Financeiro, não tem Marketing, não tem dados brutos, não tem integrações. Quem acabou de ler as sete frentes duas seções acima deveria reencontrá-las aqui sem que ninguém aponte. É a forma mais barata e mais honesta de mostrar as frentes 4 e 5 sem desenhar telas que a proposta não tem. "Atividades" sai porque não corresponde a frente nenhuma: vira "Interações", que é o que a base de fato guarda.
- *Frente:* Frentes 2 (módulo financeiro, acesso a dados brutos, esqueleto do sistema), 3 (relatórios), 4 (APIs de integração) e 5 (visão de marketing e e-mail).
- *Conteúdo exato:* Grupo de cima: Visão Geral (ativo) · Contas 306 · Negócios 11 · Interações · Financeiro · Marketing · Relatórios. Rótulo de grupo: SISTEMA. Grupo de baixo: Dados brutos · Integrações · Configurações.

**8. Botão "Exportar" neutro no cabeçalho**
- *Onde:* Dentro de `.app-top-dir`, entre o `.busca` e o `.avatar`. Desenho do `.btn-print` que já existe: fundo transparente, borda `var(--line-strong)`, texto `var(--muted)`, 12px, raio 9px.
- *Por quê:* Relatório exportável em diferentes formatos é entrega contratada e não aparece em nenhuma das três telas; um botão discreto resolve, e no lugar onde a exportação é usada, não numa aba distante. Fica em cinza, nunca em laranja: nesta tela o laranja tem um dono só — conta ou negócio parado — e é essa disciplina que faz o acento funcionar.
- *Frente:* Frente 3 — dashboards e relatórios personalizados, exportáveis em diferentes formatos.
- *Conteúdo exato:* Exportar

#### Corrigir ou remover

- Remover a linha "Museu da Imagem e do Som · Ativo" da `.revisar`. Uma conta com `.tag.ativo` dentro de uma lista chamada "Contas para revisar" prova que a lista não tem critério, e contradiz o funil, onde a mesma conta se moveu há 9 dias. Entra no lugar TV Câmara · Campinas, que já existe no funil — não se inventa nome novo para consertar um critério.
- Remover as quatro `.tag.atencao` de dentro das linhas: numa lista já filtrada elas são idênticas em todas, não informam nada e gastam o acento laranja da tela. A classe sobrevive como chip de filtro no cabeçalho do painel. Com o Museu fora, `.tag.ativo` fica órfã — ela morre, e o verde passa a existir só onde há dinheiro (`.neg .valor` e o valor dos fechados, na tela 3).
- Trocar "↑ estável no mês": seta de alta, palavra de estabilidade e cor verde na mesma linha se contradizem três vezes.
- Trocar "↑ 8% vs. mês anterior" e "↑ 3pp no trimestre": as duas pressupõem série histórica de pipeline e de conversão que a base auditada não tem, e são o mesmo "número sem fonte" pelo qual a sparkline foi recusada. Entram as derivações do item 2.
- Rebatizar a categoria "Outro" do gráfico para "Implant." (Implantação). Uma taxonomia com "Outro" anuncia que a auditoria não terminou — o contrário do que a frente 1 promete —, e "Implantação" é a mesma palavra que rotula dois eventos da linha do tempo da tela 2, o que prova que gráfico e evento saem da mesma classificação.
- Trocar "Atualizado agora · 306 contas monitoradas", no segundo `<p>` do `.app-top`, por "Base consolidada · atualizada em 05/09/2026". "Agora" promete tempo real que nenhuma das sete frentes garante, e os 306 sobem para o KPI, onde têm peso.
- O `.busca` ganha uma lupa à esquerda e o atalho ⌘K à direita, em `var(--dim)`. Busca sobre toda a base é a primeira palavra da frente 2 e hoje está desenhada como legenda dentro de um retângulo. O texto passa a "Buscar conta, contato, negócio ou solução" — "solução" é a palavra da própria Media Portal para a linha de produto (a aba do site chama-se Soluções).
- Reordenar as seis `.barra` por volume decrescente. Nenhum `--h` muda: os valores de hoje (78/62/100/44/57/33) já são exatamente as razões com Suporte = 360.
- `.app-grid` vai de `1.35fr 1fr` para `1.2fr 1fr` — a lista é o que se trabalha, o gráfico é contexto. Se o designer preferir não mexer no grid, o selo de iniciais da `.revisar` é o primeiro elemento a sair.
- Limpeza de CSS, já que o arquivo estará aberto: `.chrome-body .mk-t2` (linha 133) declara `color:var(--muted)` duas vezes.
- Reescrever o `aria-label` do `.chrome-body` desta figura: ele descreve a versão sem composição da base, sem valores no gráfico e sem valor em aberto na lista. Novo texto: "Ilustração da tela de visão geral do CRM: composição da base em 306 contas, gráfico de 1.348 interações por categoria e lista das contas paradas há mais de doze meses, com o valor em aberto de cada uma."

### Tela 02 — Ficha da conta
**Diagnóstico.** É a mais vazia das três e a que mais promete. Ocupa 840px para mostrar sete campos, três deles "A cadastrar" em itálico cinza empilhados, que leem como erro de renderização e não como lacuna deliberada. A `.ficha-col` de 270px fica com dois painéis quase ocos ao lado da linha do tempo, que é o conteúdo real da tela, e os dois lados têm exatamente o mesmo peso visual. Não existe um único número grande na tela inteira — por isso ela lê como formulário de cadastro, não como tela de relacionamento. O cabeçalho afirma "sem interação desde 2024" e nada mede esse silêncio. A `.jornada` tem cinco `li` idênticos, mesmo marcador azul, mesmo corpo de texto e a mesma `.jornada-tag` de 10,5px apagada e sem contorno à direita; entre o quarto e o quinto item há um salto de doze anos que o olho atravessa sem perceber, porque nada no desenho representa distância no tempo. Os anos vêm soltos ("2024", "2023"), o que esconde justamente a informação que a tela existe para dar e impede qualquer cálculo de "há quanto tempo" fechar com as outras duas telas. As cinco `.abas` não têm um único número — e uma delas, "Documentos", promete guarda e versionamento de arquivo, que é a única função em todo o conjunto que não está em nenhuma das sete frentes.

#### Acrescentar

**1. Faixa de quatro números derivados sob o cabeçalho**
- *Onde:* Filho novo do grid `.ficha` (que já é `display:grid;gap:20px`), entre `.ficha-top` e `.abas`. Quatro células separadas por divisórias verticais de 1px em `var(--line)`, número em `var(--display)` 26px `tabular-nums`, rótulo em 10,5px caixa alta `var(--dim)` — o idioma tipográfico do bloco `.numeros` da capa, reduzido. Nos 792px úteis da `.ficha`, cada célula fica com ~197px, folgado para o rótulo mais longo.
- *Por quê:* É a correção de maior efeito da tela inteira e ocupa a faixa horizontal que hoje está vazia entre o nome e as abas. Trinta meses de silêncio contra vinte e um anos de relação e R$ 68.000 em aberto é a proposta comercial inteira em quatro células — e os quatro são derivados do cadastro, nenhum é digitado e nenhum é faturamento. Faturamento acumulado ficou de fora de propósito: é afirmação financeira sobre um cliente real e nomeado, e a única pessoa na sala que sabe se está certa é quem recebe a proposta.
- *Frente:* Frente 2 — esqueleto do sistema, visão de jornada por conta (os quatro números saem da jornada e do cadastro consolidado).
- *Conteúdo exato:* 30 · MESES SEM INTERAÇÃO (número em `var(--orange-soft)`) | 18 · INTERAÇÕES REGISTRADAS | R$ 68.000 · EM NEGÓCIO ABERTO (em `var(--text)`, não em verde) | 21 · ANOS DE RELAÇÃO

**2. Régua vertical e dois marcadores de silêncio na linha do tempo**
- *Onde:* `.jornada li` recebe `position:relative` e um `::before` de 1px por 100% de altura em `var(--line)`, posicionado em `left:10.5px` — o centro exato dos 22px do `.jornada i` — e atrás do marcador. Duas `li` novas, sem `<b>`, com o traço em tracejado e o texto em `var(--dim)` 10,5px: uma no topo da lista e uma entre o evento de set/2021 e o de set/2009. O marcador dessas duas fica oco: sem o `::after` azul, só a borda em `var(--line-strong)`.
- *Por quê:* É o que transforma cinco itens de lista numa linha do tempo de verdade, e custa um pseudo-elemento. Os dois buracos deixam de ser invisíveis e passam a ser o argumento: a auditoria não descobre o que está registrado, descobre o que falta. A `li` do topo ainda ancora a leitura no presente, que hoje não aparece em lugar nenhum da tela — e é ela que faz os 30 meses da faixa de números serem conferíveis dentro da própria lista.
- *Frente:* Frente 1 — auditoria interna de dados (o vazio é o achado da auditoria); frente 2 — visão de jornada por conta.
- *Conteúdo exato:* Topo: "hoje · set/2026 — 30 meses sem registro". Entre set/2021 e set/2009: "12 anos sem registro no sistema anterior".

**3. Barra de completude do cadastro no painel "Dados da conta"**
- *Onde:* No fim do `.painel` DADOS DA CONTA, depois do `dl.campos`: um rótulo de 11px em `var(--dim)` e, abaixo, uma barra de 4px, raio 2px, trilho `rgba(255,255,255,.08)`, preenchimento `var(--blue)` a 43%.
- *Por quê:* Vira do avesso a maior fraqueza da tela. Hoje os `dd.vazio` leem como mockup inacabado; medidos, leem como diagnóstico — que é exatamente a entrega da frente 1. A barra também é a única forma horizontal da coluna esquerda, que hoje é só uma pilha de pares rótulo/valor. Atenção à conta, que estava errada na proposta vencedora: os sete campos do cadastro são quatro em DADOS DA CONTA mais três em CONTATO PRINCIPAL; preenchidos são três (Segmento, Produto, Cliente desde), porque "Responsável: A definir" é `dd.vazio` como os outros. Logo 3 de 7 = 43%, não 4 de 7 = 57%.
- *Frente:* Frente 1 — auditoria interna de dados e consolidação numa fonte única de verdade.
- *Conteúdo exato:* "Cadastro 43% completo · 3 de 7 campos preenchidos" — barra a 43%

**4. Estado vazio medido no painel "Contato principal"**
- *Onde:* Substitui os três pares `dt`/`dd.vazio` ("Nome / Cargo / E-mail — A cadastrar") por um bloco único, centrado no `.painel`: uma linha em `var(--muted)` 12,5px, uma segunda em `var(--dim)` 11px, e uma terceira em `var(--dim)` 11px. Sem botão.
- *Por quê:* Três itálicos empilhados são ruído; um bloco que diz o que aconteceu, quantas contas estão iguais e o que isso trava é produto. A escala mostra que o vazio é achado de auditoria e não defeito do mockup — e a terceira linha mostra, sem prometer nada e sem desenhar nenhum controle, que a frente de e-mail depende deste cadastro existir. Nenhum botão de escrita: a figura vai impressa em PDF, e ação que ninguém pode clicar é affordance falsa. Este bloco e a barra de completude são um par — uma mede a conta aberta, o outro dá a escala na base.
- *Frente:* Frente 1 — auditoria interna de dados; frente 5 aparece apenas como dependência declarada, nunca como botão.
- *Conteúdo exato:* "Nenhum contato nomeado nesta conta." / "118 das 306 contas estão assim — a auditoria lista todas." / "Segmentação e cadência de e-mail dependem deste cadastro."

**5. Contagem em cada aba**
- *Onde:* Dentro de cada `.abas span`, um número em `var(--dim)` 11px após o rótulo, com `font-variant-numeric:tabular-nums`. A aba `.on` mantém a sublinha azul.
- *Por quê:* Cinco abas sem número são cinco promessas: não dá para saber se atrás delas há conteúdo. Com contagem, a ficha inteira se resume numa linha, a barra de abas ganha ritmo irregular, e o zero de "Contatos" vira informação que conversa com a barra de completude sem repetir a mensagem. Só levam número as abas cujo conteúdo as outras telas confirmam: "Financeiro" fica sem contagem de propósito, porque nada em nenhuma das três telas a sustenta — e inventar um número ali seria o mesmo erro que a proposta promete não cometer.
- *Frente:* Frente 2 — esqueleto do sistema (as abas são os módulos: contatos, negócios, histórico, financeiro).
- *Conteúdo exato:* Visão Geral · Contatos 0 · Negócios 1 · Histórico 18 · Financeiro

**6. Recorte declarado no título da linha do tempo**
- *Onde:* O `.mk-t2` "LINHA DO TEMPO" passa a `display:flex;justify-content:space-between`, com o contador à direita em `var(--dim)`, tamanho e tracking do próprio `.mk-t2`.
- *Por quê:* A aba diz 18 registros e a lista mostra cinco. Sem declarar o recorte, ou a contagem da aba parece errada, ou a lista parece a jornada inteira. Uma palavra e um número resolvem, sem gastar a barra de filtros e ordenação que o funil e a visão geral já não têm — um vocabulário de controle por documento é suficiente.
- *Frente:* Frente 2 — filtros, ordenação e agrupamento; acesso a dados brutos.
- *Conteúdo exato:* LINHA DO TEMPO                    5 de 18 registros

#### Corrigir ou remover

- Trocar a aba "Documentos" por "Financeiro". Guarda e versionamento de arquivo não está em nenhuma das sete frentes — a frente 3 fala em exportar, não em armazenar — e esta é a única função não contratada que já existe no HTML de hoje. "Financeiro" é módulo explícito da frente 2. Pela mesma razão, não acrescentar "1 anexo" a nenhum evento da jornada.
- Encurtar o `.ficha-alerta` para só a etiqueta: `<span class="tag atencao">Atenção · revisar</span>`, sem o `<em>`. Com a faixa de números logo abaixo declarando 30 MESES SEM INTERAÇÃO e a jornada declarando mar/2024, o `<em>` do canto direito repete o mesmo fato uma terceira vez e cria um segundo laranja no cabeçalho. A regra `.ficha-alerta em` fica sem uso.
- Trocar os anos soltos por mês/ano em toda a `.jornada`: mar/2024 · ago/2023 · fev/2023 · set/2021 · set/2009. Sem mês, nenhum cálculo de "há quanto tempo" fecha com as outras duas telas — e a escolha de set/2009 e set/2021 é o que faz o vão ser exatamente doze anos.
- Uniformizar as `.jornada-tag` com as seis categorias do gráfico da tela 1: Proposta · Reunião · Suporte · Implantação · Implantação. "Ampliação" e "Migração" saem; as duas são implantação, e usar o mesmo vocabulário nas duas telas prova que o rótulo do gráfico e o rótulo do evento saem da mesma classificação.
- Dar geometria de `.tag` à `.jornada-tag` (raio 20px, padding 4px 10px, borda 1px `var(--line)`), mantendo cor `var(--dim)` e fundo transparente. Hoje ela é 10,5px apagado sem contorno, alinhado à direita: invisível. Com forma, a coluna direita da linha do tempo vira uma faixa de blocos que dá ritmo aos cinco itens.
- Tirar "Emissora de TV" do subtítulo do `.ficha-top`: ele repete o campo Segmento que está 60px abaixo. Ficam praça e tempo de relação.
- Tirar "parceiro TVCSP" do subtítulo. A sigla não aparece em nenhum material de origem — só dentro da própria proposta. É invenção que já está lá.
- Antes de o designer publicar, confirmar por escrito com a Media Portal os pares conta ↔ produto ↔ ano que a figura já afirma: "Media Portal MAM1", "Cliente desde 2005" e "Migração para MAM1 · 2009", numa conta de nome real. MAM1 existe e é módulo On-Premises (`docs/SITE/SOLUCOES/catalogo.md`, seção 1), mas o catálogo é transcrição pendente de validação editorial e não traz nenhum par cliente↔solução. Sem confirmação, trocar o valor do campo Produto por um rótulo neutro e ajustar o evento de set/2009 no mesmo movimento.
- Opcional, e só com confirmação: o campo Segmento pode adotar o vocabulário de público do catálogo (Afiliadas e filiadas · Produtoras · Órgãos públicos · Instituições religiosas · Agências · Ensino e criadores) em vez de "Emissora de TV". A taxonomia é real e documentada; o enquadramento desta conta específica não é, e não se enquadra um cliente do leitor por conta própria.
- Reescrever o `aria-label` do `.chrome-body` desta figura: "Ilustração da ficha de uma conta no CRM: números derivados do relacionamento, cadastro medido em percentual de completude e linha do tempo com os intervalos sem registro marcados."

### Tela 03 — Funil de negócios
**Diagnóstico.** Um funil que não afunila. As cinco `.coluna` têm largura idêntica (`repeat(5,minmax(0,1fr))`), `min-height:230px` fixo e o mesmo fundo `var(--panel)` — nada no desenho diz que Proposta enviada e Negociação concentram 59% do dinheiro e Lead concentra 12%. O contador do `.mk-t3` dá a quantidade, que é justamente o dado que menos importa: três negócios de R$ 49.500 pesam menos que dois de R$ 122.000, e a tela mostra o 3 em destaque e a soma em lugar nenhum, o que obriga a somar de cabeça para conferir o R$ 412.000 do `.pipe`. Os onze `.neg` são tipograficamente idênticos e o `<em>` de cada um é um rótulo sem informação, repetido dentro da própria coluna: "novo", "novo", "fit confirmado", "fit confirmado", "call feita", "call feita" — seis dos onze só repetem, com outras palavras, o que o título da coluna já diz. Não há tempo em lugar nenhum: um negócio de R$ 82.000 aberto há três semanas e um de R$ 45.000 parado desde 2023 têm exatamente a mesma aparência, e é daí que sai a contradição mais visível do conjunto — "call feita" na Assembleia Legislativa · PI, que a tela 1 dá como parada desde 2023. A segunda coluna é QUALIFICADO e a terceira é CONTATO FEITO, o que inverte a sequência real de qualquer venda. E o funil só tem entrada: nada indica o que fechou, nem de onde saem os 27% de conversão da tela 1.

#### Acrescentar

**1. Subtotal do estágio e trilho de proporção no cabeçalho da coluna**
- *Onde:* O `.mk-t3` mantém o flex de hoje com nome e contagem na primeira linha e ganha uma segunda: valor à esquerda em `var(--display)` 13px `tabular-nums`, cor `var(--text)`, e percentual à direita em `var(--dim)`. O `border-bottom:1px solid var(--line)` que ele já tem engorda para 3px e vira trilho em `rgba(255,255,255,.07)`, com preenchimento em `var(--blue)` na largura da fatia daquele estágio.
- *Por quê:* Devolve a forma de funil sem tocar no grid e sem sexta coluna: cinco trilhos de larguras diferentes desenham a distribuição do dinheiro na horizontal, logo abaixo de cinco títulos iguais. E o subtotal é o número que a diretoria procura — é ele que faz o R$ 412.000 do `.pipe` deixar de ser afirmado e passar a ser conferível dentro da própria tela, somando os valores que já estão no HTML de hoje, sem alterar um só. O valor fica em branco e não em verde: cinco manchas verdes no alto competiriam com os onze `.neg .valor` que já são verdes.
- *Frente:* Frente 2 — agrupamento sobre toda a base e módulo de performance comercial; frente 3 — dashboards para a diretoria.
- *Conteúdo exato:* LEAD 3 / R$ 49.500 / 12% · CONTATO FEITO 2 / R$ 61.000 / 15% · QUALIFICADO 2 / R$ 58.500 / 14% · PROPOSTA ENVIADA 2 / R$ 122.000 / 30% · NEGOCIAÇÃO 2 / R$ 121.000 / 29%

**2. Idade no estágio — e origem, nos leads — no lugar da nota vaga**
- *Onde:* O `<em>` de cada `.neg`, no lugar de "novo" / "call feita" / "fit confirmado" / "ajuste de escopo". Mesmo tamanho, mesma cor, mesma altura de linha: nenhuma marcação nova.
- *Por quê:* É a adição que mais rende na tela e não custa um pixel: onze cartões que hoje repetem três frases passam a ter onze valores distintos, e a coluna de datas dá ao bloco uma segunda leitura vertical. É também o que conserta a contradição com a tela 1 — a conta em atenção deixa de parecer ter tido uma call recente e passa a mostrar há quanto tempo está travada. Nos três leads, a origem entra junto da idade dentro do mesmo `<em>`: a frente 6 é a única das sete sem nenhuma presença nas telas, é a que o leitor confere sozinho porque o site é dele, e cabe em dezessete caracteres — sem marcador separado e sem meio centímetro de painel. Dias para o que é recente, meses para o que está travado: meses é o que se fala em reunião.
- *Frente:* Frentes 2 (módulo de performance comercial, tempo em estágio) e 6 (integração com o site institucional: entrada de leads e leitura do funil).
- *Conteúdo exato:* LEAD: Instituto Embratel 21 R$ 22.000 "indicação · há 26 dias" | TV Assembleia · GO R$ 18.000 "site · há 4 dias" | Rádio Cultura FM R$ 9.500 "site · há 11 dias". CONTATO FEITO: Assembleia Legislativa · PI R$ 45.000 "parado há 34 meses" | TV Câmara · Campinas R$ 16.000 "parado há 13 meses". QUALIFICADO: Museu da Imagem e do Som R$ 31.000 "há 9 dias" | EPTV Regional R$ 27.500 "parado há 24 meses". PROPOSTA ENVIADA: TV Cultura R$ 68.000 "parado há 30 meses" | Sesc São Paulo R$ 54.000 "há 12 dias". NEGOCIAÇÃO: CazéTV R$ 82.000 "há 6 dias" | Novo Tempo R$ 39.000 "há 21 dias".

**3. Marcador de negócio parado**
- *Onde:* Nos quatro `.neg` com mais de 12 meses: `box-shadow:inset 2px 0 0 rgba(242,102,28,.55)` na borda esquerda e o `<em>` em `var(--orange-soft)`. Os outros sete não mudam.
- *Por quê:* Faz o R$ 156.500 do cabeçalho ser localizável no quadro: o olho encontra os quatro cartões sem ler nenhum número. É o mesmo laranja da `.tag.atencao` e do KPI "em atenção" da tela 1, o que ensina o vocabulário de cor ao longo de duas telas — e dá ao funil seu único acento, no lugar certo, que é o dinheiro que não anda.
- *Frente:* Frente 2 — módulo de performance comercial.
- *Conteúdo exato:* Marcados: Assembleia Legislativa · PI (34 meses) · TV Cultura (30 meses) · EPTV Regional (24 meses) · TV Câmara · Campinas (13 meses)

**4. Segunda linha de dados no cabeçalho do funil**
- *Onde:* Dentro de `.funil-top`, como segundo `<p>` do bloco à esquerda, em 12px `var(--dim)`, com os dois dados separados por ponto médio. O `.pipe` continua exatamente como está, à direita, e segue sendo o maior número da tela — nenhum bloco novo ao lado dele.
- *Por quê:* O cabeçalho hoje tem um número e uma frase; o total precisa de companhia para não ficar solto. O valor parado é a ponte explícita com o KPI de atenção da tela 1 — o mesmo número nas duas, conferível em cinco segundos — e o ticket médio é derivado da própria coluna de valores, então o leitor consegue refazer a conta. Uma linha de texto, e não um segundo chip: cinco colunas já vivem no limite dos 840px e o cabeçalho não pode ganhar duas fileiras.
- *Frente:* Frentes 2 (performance comercial) e 3 (relatórios para o comercial e a diretoria).
- *Conteúdo exato:* Funil comercial · 11 negócios em aberto
Ticket médio R$ 37,5 mil · R$ 156.500 parados há mais de 12 meses, em 4 negócios

**5. Faixa de desfecho no rodapé**
- *Onde:* Faixa de largura inteira abaixo de `.colunas`, dentro do grid `.funil`, separada por `border-top:1px solid var(--line)`, 12px, com o valor em `var(--green)`.
- *Por quê:* Um funil que nunca mostra o que fechou é um funil que só engorda. Esta linha fecha a conta da taxa de conversão que a tela 1 exibe — que é o KPI que um diretor manda abrir — e é a única aparição do módulo financeiro nas três telas, sem precisar de uma sexta coluna que espremeria cinco colunas já em 150px. É também o único lugar do conjunto onde o verde significa dinheiro que efetivamente entrou.
- *Frente:* Frentes 2 (módulo financeiro e performance comercial) e 3 (relatórios).
- *Conteúdo exato:* Encerrados nos últimos 12 meses · 10 de 37 negócios viraram contrato · R$ 286.000 fechados · conversão 27%

#### Corrigir ou remover

- Inverter a segunda e a terceira `.coluna`: a ordem correta é LEAD → CONTATO FEITO → QUALIFICADO → PROPOSTA ENVIADA → NEGOCIAÇÃO. Hoje "Qualificado" vem antes de "Contato feito", o que inverte a sequência de qualquer venda. Marcar para conferência: os nomes dos estágios do funil da Media Portal não são nossos para inventar, e se houver especificação do funil deles, os cinco rótulos saem de lá.
- Substituir todos os `<em>` de nota ("novo", "fit confirmado", "call feita", "renovação", "ampliação", "indicação", "ajuste de escopo", "ajuste de preço"). Seis dos onze se repetem literalmente dentro da mesma coluna e nenhum acrescenta o que o título da coluna já não diga.
- Corrigir "Assembleia Legislativa · PI — call feita": a tela 1 lista a mesma conta como parada desde 2023. É a incoerência mais visível das três telas e um leitor da Media Portal a encontra sozinho.
- Reordenar os cartões dentro das colunas por valor decrescente. Hoje a coluna Lead está em 18.000 / 9.500 / 22.000 e Negociação em 39.000 / 82.000 — as outras já estão certas. Sem controle de ordenação declarado na tela, isso é só arrumação; com a lista da tela 1 declarando "ordenadas pelo valor em aberto", vira coerência entre as duas.
- Tirar o `min-height:230px` de `.coluna`. Como o grid `.colunas` já estica todas à altura da mais alta, ele não sustenta alinhamento nenhum — só cria um piso que deixa metade da coluna vazia e é metade da razão pela qual o funil parece inacabado.
- NÃO subir o `.funil{min-width:840px}`. Em 840px cada coluna tem 150,4px e cada `.neg` fica com ~126px úteis, que é o que os dois itens novos precisam: "PROPOSTA ENVIADA" cabe na primeira linha do `.mk-t3`, "R$ 122.000" mais "30%" cabem na segunda, e "parado há 30 meses" cabe no `<em>`. Subir o mínimo pioraria a rolagem lateral do `.chrome-body` no celular e faria o `zoom:.74` da impressão comer a tipografia de 10,5px dos cartões.
- Conferir o `@media print` nas três figuras depois da mudança, e nesta em especial: com a segunda linha do cabeçalho, os subtotais e a faixa de desfecho, o `zoom:.74` do `.chrome-body` pode estourar a página. Se estourar, dar um zoom próprio e mais baixo só a esta figura, via `[data-tela="funil"] .chrome-body` — o `.tela` já tem `break-inside:avoid`.
- Limpeza de CSS: `.chrome-body .mk-t3` (linha 209) declara `color:var(--muted)` duas vezes.
- Reescrever o `aria-label` do `.chrome-body` desta figura: "Ilustração do funil de negócios do CRM: cinco estágios com subtotal e proporção do pipeline, tempo parado em cada negócio e o resultado dos negócios encerrados no período."

---

## 6. A tabela de números que amarra as três telas

Tudo é calculado a partir de um ponto único: **setembro de 2026**. Se a proposta for enviada em outro mês, é esse ponto que se move e todos os intervalos recalculam a partir dele.

**OS DOIS NÚMEROS REAIS.** 306 contas aparece uma vez com peso (o `.kpi-num` do primeiro cartão) e uma vez como contagem de navegação (`Contas 306`, no rail). 1.348 interações aparece uma vez, como contador ao lado do título do gráfico — e sem janela de tempo, porque é o total consolidado da base, não o dos últimos doze meses. As seis barras somam exatamente esse total: 360 + 281 + 223 + 205 + 159 + 120 = 1.348. As alturas `--h` de hoje não mudam porque já são as razões com a maior barra (Suporte 360 = 100%): 281/360 = 78%, 223/360 = 62%, 205/360 = 57%, 159/360 = 44%, 120/360 = 33%.

**A BASE.** 306 = 150 ativas + 63 em atenção + 93 sem interação registrada. A faixa de composição do primeiro KPI usa exatamente essas frações: 49,0% / 20,6% / 30,4%. A regra é única nas três telas e está escrita onde opera, no chip do painel de revisão: **ativa é a conta com interação nos últimos 12 meses; em atenção é a conta com histórico e mais de 12 meses parada.** As 93 são as que nunca tiveram interação registrada — o achado da auditoria, dito uma vez só.

**O PIPELINE.** As cinco colunas somam 49.500 + 61.000 + 58.500 + 122.000 + 121.000 = R$ 412.000, exatamente o `.pipe` do funil e o KPI da tela 1, com os onze valores de `.neg` que já estão no HTML — nenhum foi alterado. Contagens: 3 + 2 + 2 + 2 + 2 = 11 negócios, número que aparece no cabeçalho do funil, no rodapé do KPI de pipeline e como contagem de "Negócios" no rail. Ticket médio R$ 37,5 mil = 412.000 ÷ 11. Percentuais por estágio: 12 + 15 + 14 + 30 + 29 = 100.

**O DINHEIRO PARADO.** Quatro negócios passaram de 12 meses no estágio: TV Cultura 68.000 (30 meses), Assembleia Legislativa · PI 45.000 (34), EPTV Regional 27.500 (24), TV Câmara · Campinas 16.000 (13). Somam **R$ 156.500**, e esse número aparece duas vezes: no rodapé do KPI "em atenção" (tela 1) e na segunda linha do cabeçalho do funil (tela 3). O olho o localiza sem ler nenhum número, pelos quatro cartões de borda laranja.

**A LISTA DE REVISAR É EXATAMENTE ESSE CONJUNTO.** As quatro linhas da tela 1 são os quatro negócios marcados na tela 3, na mesma ordem de valor (68.000, 45.000, 27.500, 16.000) e com os mesmos meses. Os dois relógios coincidem porque, nessas quatro contas, a última interação registrada É a própria movimentação do negócio — vale dizer isso ao designer para que ele não invente uma segunda data para a mesma conta. Museu da Imagem e do Som sai da lista: moveu-se há 9 dias, está entre as 150 ativas e por isso a `.tag.ativo` desaparece do conjunto. TV Câmara · Campinas entra no lugar — já existe no funil, não é nome novo. Nenhuma conta marcada em atenção exibe movimento recente em lugar nenhum.

**A CONVERSÃO.** 27% = 10 de 37 negócios encerrados nos últimos 12 meses. A fração está no rodapé do KPI (tela 1) e a linha inteira na faixa de desfecho do funil (tela 3), com os R$ 286.000 fechados. O KPI deixa de ser um número afirmado.

**TV CULTURA ATRAVESSA AS TRÊS TELAS COM OS MESMOS DADOS.** Tela 1: primeira linha da lista, selo TC, mar/2024 · 30 meses, R$ 68.000 em aberto. Tela 2: `.ficha-av` TC, faixa de números com 30 MESES SEM INTERAÇÃO, 18 INTERAÇÕES REGISTRADAS, R$ 68.000 EM NEGÓCIO ABERTO e 21 ANOS DE RELAÇÃO (cliente desde 2005); aba "Negócios 1"; jornada abrindo em mar/2024 com a tag Proposta; marcador de silêncio no topo com os mesmos 30 meses; vão de 12 anos entre set/2021 e set/2009. Tela 3: cartão de R$ 68.000 em "Proposta enviada", parado há 30 meses, com borda laranja. Nada precisa ser reconciliado pelo leitor.

**AS TABELAS QUE PASSAM A VALER.**
Contas — TV Cultura: última interação mar/2024, 30 meses, R$ 68.000, estágio Proposta enviada. Assembleia Legislativa · PI: nov/2023, 34 meses, R$ 45.000, Contato feito. EPTV Regional: set/2024, 24 meses, R$ 27.500, Qualificado. TV Câmara · Campinas: ago/2025, 13 meses, R$ 16.000, Contato feito. Museu da Imagem e do Som: há 9 dias, R$ 31.000, Qualificado, ativa.
Interações por categoria — Suporte 360, Proposta 281, Reunião 223, Visita 205, Renovação 159, Implantação 120. Total 1.348.
Funil — Lead 3 / R$ 49.500 / 12%; Contato feito 2 / R$ 61.000 / 15%; Qualificado 2 / R$ 58.500 / 14%; Proposta enviada 2 / R$ 122.000 / 30%; Negociação 2 / R$ 121.000 / 29%. Total 11 / R$ 412.000 / 100%.
Ficha (TV Cultura) — 7 campos de cadastro, 3 preenchidos, 43%; 18 interações registradas, 5 exibidas; 0 contatos; 1 negócio; 21 anos; 118 das 306 contas sem contato principal.

**AS CORES, QUE TAMBÉM PRECISAM FECHAR.** Verde só onde há dinheiro: os `.neg .valor` (como já é hoje) e o valor dos fechados na faixa de desfecho. Valor parado vai em branco nas telas 1 e 2, porque ali o assunto é o tempo parado. Laranja é um acento por tela e tem sempre o mesmo significado — parado ou em atenção: o segmento da faixa de composição, o rodapé do KPI de atenção e o chip do painel na tela 1; o número dos meses sem interação e a etiqueta do cabeçalho na tela 2; os quatro cartões marcados e o valor parado do cabeçalho na tela 3. Azul é seleção e dado técnico: item ativo do rail, avatares, marcadores da jornada, barra de completude, preenchimento dos trilhos de proporção. Nenhum controle de ação é laranja — o botão "Exportar" segue o `.btn-print`.

**A NOTA DE DADOS ILUSTRATIVOS NÃO MUDA.** O `.tela-selo` de cada figura e a `.telas-nota` continuam valendo como estão: nenhum nome de solução do catálogo foi colado num cliente nomeado, então não há nada de novo a ressalvar.

---

## 7. O que NÃO desenhar (recusado por sair do escopo)

- Score de saúde da conta, probabilidade de fechamento, pipeline ponderado e qualquer número de 0 a 100 que classifique um negócio. É modelo preditivo com outro nome, não está entre as sete frentes e é a promessa mais cara de desfazer depois. O tempo parado dá a mesma leitura sem prometer nada.
- "Próxima ação sugerida", lembrete disparado por regra, sequência de follow-up e campo de próxima ação vazio como argumento da tela. Recomendação é previsão com outro nome, e agenda de tarefas não consta das sete frentes. A tela mostra que a conta está parada; quem decide o que fazer é a pessoa.
- Assistente, resumo automático da conta ou qualquer campo escrito por modelo de linguagem. O mais tentador dos enfeites e o mais fácil de cobrar na entrega.
- Botões de escrita dentro das figuras — "Registrar interação", "Cadastrar contato", "Disparar campanha". A proposta é impressa em PDF: ação que ninguém pode clicar é affordance falsa, e é exatamente a fronteira entre "o sistema mostra" e "o sistema faz" que será cobrada na entrega. O único controle desenhado é o "Exportar", que corresponde a entrega explícita da frente 3.
- Painel "Solução contratada" com a lista "Fora do contrato" em contorno vazado. Nenhuma das sete frentes cobre "o que esta conta ainda não comprou": listar o que falta ao lado do que existe é motor de indicação desenhado, por mais que o rótulo negue. E os quadrados de sigla do catálogo são laranja por decisão de marca da própria Media Portal (`catalogo.md`, seção 1: "os quadrados laranja são o elemento de branding") — passá-los para azul dentro do CRM brigaria com o manual deles, e mantê-los laranja estouraria o acento único da tela.
- Par cliente real ↔ solução ↔ ano nos cartões do funil e na lista de contas (Safira para a EPTV, Gendai TV para a CazéTV, Diamante Cloud para o Museu). O catálogo é real e está em `docs/SITE/SOLUCOES/catalogo.md`, mas ele próprio se declara transcrição pendente de validação editorial e não traz nenhum vínculo com cliente. São afirmações datadas sobre clientes que o leitor conhece melhor que nós, e um erro ali derruba a confiança nas outras duas telas.
- Receita acumulada, última compra e valor em eventos passados da linha do tempo. É histórico financeiro inventado sobre um cliente nomeado, numa proposta cuja primeira frente é auditar dados. A faixa de números da ficha ficou só com o que é derivável do cadastro.
- Sparkline de doze meses no KPI de pipeline, gráfico de evolução mensal e as variações "↑ 8% vs. mês anterior" e "↑ 3pp no trimestre" que já estão no HTML. Todos pressupõem série histórica que a base auditada não tem — é o mesmo defeito, tenha ele forma de traçado ou de seta.
- Barras empilhadas em azul e laranja no gráfico da tela 1. A aritmética fecharia, mas seis segmentos laranja mais dois rodapés de alerta mais o chip do painel dariam dez manchas na mesma figura: o acento vira cor de série e a regra da identidade morre.
- Trocar "Interações por categoria" por "Contas por perfil de cliente". O gráfico ficaria mais interessante para a diretoria, mas 1.348 é um dos dois números reais do projeto e perderia o único lugar onde vira imagem; e rótulos de duas e três palavras não cabem nos ~42px de cada `.barra`.
- Quadrado de iniciais dentro do `.neg`. Em `min-width:840px` cada cartão tem ~126px úteis; 20px de selo mais o gap deixam o nome com ~100px e mandam "Museu da Imagem e do Som" para três linhas em onze cartões. O selo tem lugar no `.ficha-av`, que já existe, e na lista da tela 1, onde há espaço — no funil, não.
- Profundidade progressiva das cinco colunas, de `--panel` a `--panel-strong`. Degradê de superfície é o primeiro tratamento que morre no `zoom:.74` da impressão e no PDF que o cliente salva, onde lê como mancha ou erro de renderização. O trilho de proporção no cabeçalho já entrega a forma do funil sozinho.
- Sexta coluna "Ganho/Perdido" no funil, e barra de período + responsável + segmento + agrupar repetida na tela 1 e na tela 3. A coluna espremeria cinco colunas que já vivem no limite; as barras gastariam duas faixas inteiras para dizer a mesma frase duas vezes. Um vocabulário de controle por documento basta — o chip da lista de revisão declara a regra, e as outras telas herdam o entendimento.
- Painel inteiro "Entrada pelo site" na tela 1. A frente 6 merece aparecer e aparece: dentro do `<em>` de dois cartões da coluna Lead, em dezessete caracteres, na tela que menos carrega.
- Inventar nomes de contas (TV Aratu, Rádio MEC) para tirar o Museu da lista de revisão, e inventar nomes de responsáveis para preencher o campo "A definir". O defeito da lista é o critério, e conserta-se com o critério; e "Responsável: A definir" é campo real e vazio da base, não um buraco do mockup — é justamente o que a frente 1 vai preencher.
- Dias como unidade para o que está travado ("512 d", "287 d"). Lê como saída de máquina e obriga o leitor a converter. Dias para o que é recente, meses para o que está parado.
- Contagem em dias ou número em abas que nenhuma outra tela sustenta ("Documentos 4", "Financeiro 3"). Cada número inventado a mais é uma chance a mais de contradição entre as três telas — e a página já declara que os dados são ilustrativos; o que ela não pode é declarar dados ilustrativos que se contradizem.
- Arrastar cartão entre colunas, menus de contexto, campos editáveis em linha, sino de notificações, feed de atividade e presença de outros usuários. Movimento que o papel não reproduz vira promessa perdida, e notificação e colaboração não estão contratadas.
- Mapa do Brasil com as contas por praça, gráfico de rosca, fotos de pessoas nos avatares e logotipos de ferramentas de terceiros numa tela de integrações. Densidade cara, escopo nenhum — e um logo de conector vira um conector cobrado.
- Uma quarta tela (financeiro, relatórios ou integrações) e um quinto ou sexto KPI. As frentes 3, 4 e 6 existem e cabem no texto da proposta e no rail; o que faltava às três figuras era peso, não quantidade — e o documento ainda tem cronograma e investimento pela frente.
