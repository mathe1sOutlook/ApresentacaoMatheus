# Handoff: CRM Media Portal — Visão geral, Ficha da conta, Funil de negócios

## Overview
Três telas de um CRM para emissoras e produtoras de conteúdo (Media Portal), apresentadas como carrossel navegável com tema claro/escuro e painel de detalhe ao clicar em contas, interações e negócios.

As telas existem para provar três coisas da proposta comercial:
1. **Visão geral** — a base inteira (306 contas) em uma tela, com o que está parado em destaque.
2. **Ficha da conta** — contato, cadastro, histórico e situação de um cliente em um só lugar.
3. **Funil de negócios** — cada oportunidade no estágio certo, com valor e tempo parado visíveis.

O escopo é fechado: só sete frentes foram contratadas (cadastro/auditoria de base, histórico de interações, funil de negócios, financeiro, marketing/e-mail, relatórios, suporte). **Nada de IA, previsão, score de fechamento, automação de vendas, app de celular ou armazenamento de arquivo** — ver `referencia/briefing-telas-crm.md`, seções 4 e 7.

## About the Design Files
Os arquivos em `design/` são **referências de design escritas em HTML** — protótipos que mostram aparência e comportamento pretendidos, **não código de produção para copiar**.

A tarefa é **recriar estas telas no ambiente do codebase de destino** (React, Vue, Svelte, etc.), usando os padrões, a biblioteca de componentes e o sistema de estilos já estabelecidos lá. Se ainda não existe ambiente, escolha o framework mais adequado ao projeto e implemente as telas nele.

Os arquivos `.dc.html` abrem direto no navegador (duplo clique) e usam um runtime próprio (`support.js`) só para renderizar o protótipo — **esse runtime não deve ser levado para produção**. O que importa é o markup, os valores de estilo e o comportamento descritos abaixo.

## Fidelity
**High-fidelity (hifi).** Cores, tipografia, espaçamentos, raios, estados e conteúdo são finais. Recrie a UI fielmente com as bibliotecas do codebase. Os dados são ilustrativos (o selo "Dados ilustrativos" na legenda de cada tela existe justamente para isso), mas **os números precisam continuar fechando entre as telas** — ver "Regras de dados".

## Screens / Views

Convenções gerais das três telas:
- Fonte de display: **Space Grotesk** (600/700) para títulos, números grandes, rótulos em caixa alta e valores monetários.
- Fonte de texto: **Inter** (400/600) para todo o resto.
- Números sempre com `font-variant-numeric: tabular-nums`.
- Moldura de navegador (3 bolinhas + barra de URL) é enfeite do mockup — **não implementar**.
- A largura útil do conteúdo é 880px (tela 01) e 840px (telas 02 e 03); em produção o layout deve ser fluido, essas larguras são a referência de proporção.

---

### 01 — Visão geral
**Purpose:** o gestor abre o CRM e vê, sem clicar em nada, o tamanho da base, quanto valor está parado e quais contas revisar hoje.

**Layout:** grid de 2 colunas — rail lateral fixo de `186px` + conteúdo `1fr`, `gap: 22px`.

**Rail lateral (186px)**
- Fundo `--bg-alt`, borda direita `1px solid --line`, padding `20px 14px`, `display:flex; flex-direction:column`.
- Topo: marca "MP · CRM" — quadrado `20×20`, `border-radius:6px`, `linear-gradient(140deg, --blue, --blue-deep)` + texto Space Grotesk 14px/700. Margem inferior `22px`.
- Itens de menu: `display:flex; gap:10px; padding:8px 10px; border-radius:8px; font-size:12.5px`. Ícone = quadrado `13×13`, `border-radius:4px`.
  - Ativo ("Visão Geral"): fundo `--blue-bg`, texto `--text`, peso 600, ícone `--blue`.
  - Inativo: texto `--dim`, ícone `--icone-off`.
  - Itens: Visão Geral · Contas `306` · Negócios `11` · Interações · Financeiro · Marketing · Relatórios. Os contadores vão à direita (`margin-left:auto`).
- Grupo "SISTEMA" no rodapé (`margin-top:auto`, borda superior `1px solid --line`, rótulo 10px/700 caixa alta `--dim`): Dados brutos · Integrações · Configurações.

**Cabeçalho do conteúdo**
- Título "Visão Geral" — Space Grotesk 22px/700, `letter-spacing:-.02em`.
- Subtítulo "Base consolidada · atualizada em 05/09/2026" — 12.5px `--dim`.
- À direita: campo de busca (12px `--dim`, fundo `--panel`, borda `1px solid --line-strong`, `border-radius:9px`, padding `8px 12px 8px 11px`, ícone de lupa SVG 12px, atalho `⌘K` em caixinha `1px solid --line`, `border-radius:5px`) — placeholder "Buscar conta, contato, negócio ou solução", **uma linha só (`white-space:nowrap`)**; botão "Exportar" (12px/600 `--muted`, borda `1px solid --line-strong`, `border-radius:9px`, padding `8px 14px`); avatar circular `28×28` com o gradiente da marca.

**Faixa de 4 indicadores** — `grid-template-columns:repeat(4,1fr); gap:12px`. Cada card: fundo `--panel`, `1px solid --line`, `border-radius:12px`, padding `16px 17px`.
Rótulo: 10px/600, `letter-spacing:.1em`, caixa alta, `--dim`. Número: Space Grotesk 29px/700, `line-height:1`, `letter-spacing:-.03em`.
1. **Base consolidada — 306.** Abaixo do número, barra de composição de `6px` (`border-radius:3px`, `overflow:hidden`) com três faixas: `49%` `--green`, `20.6%` `--orange-soft`, `30.4%` `--neutro`. Legenda em três linhas com bolinha `6×6`: `150 ativas` / `63 em atenção` / `93 sem registro` (10.5px `--dim`).
2. **Em atenção — 63.** Duas linhas 11px/600 em `--orange-soft`: "R$ 156.500 parados" / "há mais de 12 meses".
3. **Pipeline aberto — R$ 412k.** Duas linhas 11px/600 `--dim`: "11 negócios em aberto" / "média de R$ 37,5 mil".
4. **Taxa de conversão — 27%.** Duas linhas 11px/600 `--dim`: "10 de 37 negócios" / "encerrados em 12 meses".
> Regra de design: **todo número tem denominador ou composição.** Nenhum indicador é um número solto.

**Bloco inferior** — `grid-template-columns:1.2fr 1fr; gap:12px`, itens alinhados ao topo.

*Gráfico "Interações por categoria"* (card `--panel`, `1px solid --line`, `border-radius:12px`, padding `20px`):
- Título Space Grotesk 15px/700 + contador à direita "1.348 interações consolidadas" (11px/400 Inter, `--dim`).
- `grid-template-columns:repeat(6,1fr); gap:11px`. Cada coluna é um grid de 3 linhas `auto 132px auto`, `gap:8px`:
  valor em cima (Space Grotesk 12px/700 `--muted`, centralizado) · barra (`align-self:end`, `border-radius:5px 5px 0 0`, `linear-gradient(180deg, --blue-deep, rgba(19,110,242,.35))`) · rótulo embaixo (10.5px `--dim`, centralizado).
- **Barras ordenadas em ordem decrescente**, altura proporcional ao maior valor, e só a primeira em opacidade cheia (as outras `opacity:.45`):
  | Categoria | Valor | Altura |
  |---|---|---|
  | Suporte | 360 | 100% |
  | Proposta | 281 | 78% |
  | Reunião | 223 | 62% |
  | Visita | 205 | 57% |
  | Renov. | 159 | 44% |
  | Implant. | 120 | 33% |
  Soma obrigatória: **1.348**.

*Lista "Contas para revisar"* (mesmo card):
- Título Space Grotesk 15px/700. Abaixo, duas etiquetas na mesma linha: filtro "sem interação há +12 meses" (10.5px `--dim`, borda `1px solid --line-strong`, `border-radius:20px`, padding `3px 11px`) e contador "4 de 63" à direita.
- Cada linha: avatar `26×26` `border-radius:8px` com iniciais (Space Grotesk 10px/700, texto `#fff`, gradiente da marca) · nome (12.5px/600) + data de referência (11px `--dim`) · **valor em aberto** à direita (Space Grotesk 13px/700). Separador `1px solid --line` entre linhas, padding vertical `11px`.
  | Conta | Iniciais | Referência | Valor |
  |---|---|---|---|
  | TV Cultura | TC | mar/2024 · 30 meses | R$ 68.000 |
  | Assembleia Legislativa · PI | AL | nov/2023 · 34 meses | R$ 45.000 |
  | EPTV Regional | ER | set/2024 · 24 meses | R$ 27.500 |
  | TV Câmara · Campinas | TCC | ago/2025 · 13 meses | R$ 16.000 |
  > Regra de design: a lista **não repete etiqueta de status**; o dado que varia linha a linha (data + meses + valor) é o que fica visível.
- Rodapé do card: "ordenadas pelo valor em aberto" (11.5px `--dim`) + link "ver as 63 →" (`--blue`), separados por borda superior `1px solid --line`.

---

### 02 — Ficha da conta (TV Cultura)
**Purpose:** o vendedor abre uma conta e entende em segundos o estado da relação: quanto tempo sem contato, o que já aconteceu, o que falta cadastrar.

**Layout:** coluna única, padding `24px`, `gap:20px`.

**Cabeçalho:** avatar `52×52` `border-radius:13px` (gradiente da marca, iniciais Space Grotesk 17px/700 `#fff`) · nome "TV Cultura" (Space Grotesk 22px/700) + "São Paulo, SP · cliente desde 2005" (12.5px `--dim`) · à direita o selo "Atenção · revisar" (10px/700, `--orange-soft` sobre `--orange-bg`, borda `1px solid --orange-line`, `border-radius:20px`, padding `4px 10px`).

**Quatro números da relação** — `grid-template-columns:repeat(4,1fr)`, separados por `border-left:1px solid --line` (o primeiro sem borda), padding lateral `20px`. Número Space Grotesk 26px/700; rótulo 10.5px/600 caixa alta `letter-spacing:.1em` `--dim`.
| Número | Rótulo | Cor do número |
|---|---|---|
| 30 | Meses sem interação | `--orange-soft` (**único acento laranja da tela**) |
| 18 | Interações registradas | `--text` |
| R$ 68.000 | Em negócio aberto | `--text` |
| 21 | Anos de relação | `--text` |

**Abas** — `display:flex; gap:24px`, borda inferior `1px solid --line`. Ativa: `--text`/600 com `border-bottom:2px solid --blue`; inativas `--dim` com borda transparente. Abas: **Visão Geral · Contatos `0` · Negócios `1` · Histórico `18` · Financeiro**.
> ⚠️ A aba é **"Financeiro"**, não "Documentos": guarda de arquivo não foi contratada (briefing §7).

**Corpo** — `grid-template-columns:270px 1fr; gap:14px`.

*Coluna esquerda, card "Dados da conta"* (`--panel`, `1px solid --line`, `border-radius:12px`, padding `20px`): rótulo do card 11.5px/700 caixa alta `letter-spacing:.12em` `--muted`. Pares `dt` 11px `--dim` / `dd` 13.5px/600, `margin-top:14px` entre pares:
- Segmento — Emissora de TV
- Responsável — *A definir* (itálico `--dim`)
- Produto — Media Portal MAM1
- Cliente desde — 2005

Rodapé do card (borda superior `1px solid --line`, `padding-top:14px`): "Cadastro 43% completo · 3 de 7 campos preenchidos" (11px `--dim`) + barra de progresso `4px` (`border-radius:2px`, trilha `--trilha`, preenchimento `43%` em `--blue`).

*Coluna esquerda, card "Contato principal":* estado vazio centralizado, três linhas — "Nenhum contato nomeado nesta conta." (12.5px `--muted`), "118 das 306 contas estão assim — a auditoria lista todas." e "Segmentação e cadência de e-mail dependem deste cadastro." (11px `--dim`).

*Coluna direita, card "Linha do tempo"*: rótulo do card + contador "5 de 18 registros" à direita.
Cada item: `display:flex; align-items:center; gap:13px`, separador `1px solid --line`, padding vertical `13px`.
- **Marcador de evento:** quadrado `22×22`, `border-radius:7px`, fundo `--blue-bg`, borda `1px solid --line-blue`, com um quadradinho interno (`::after`, `inset:6px`, `border-radius:3px`, `background:--blue`).
- **Régua vertical:** linha de `1px` em `--line` posicionada em `left:18.5px` (`::before`), contínua entre eventos e **tracejada (`1px dashed --line-strong`) nos intervalos sem registro**.
- Texto: título 13px/600 + "mês/ano · área" (11px `--dim`); à direita, etiqueta de categoria (10.5px `--dim`, borda `1px solid --line`, `border-radius:20px`, padding `4px 10px`).
- **Itens de lacuna** (sem marcador preenchido): quadrado `22×22` com fundo `--panel` e borda `1px solid --line-strong`, texto 10.5px `--dim`.

Sequência exata, de cima para baixo:
1. *lacuna* — "hoje · set/2026 — 30 meses sem registro"
2. Proposta de renovação enviada — mar/2024 · Comercial — etiqueta **Proposta**
3. Reunião de acompanhamento — ago/2023 · Kickoff — **Reunião**
4. Chamado de suporte resolvido — fev/2023 · Técnico — **Suporte**
5. Ampliação de infraestrutura — set/2021 · Técnico — **Implantação**
6. *lacuna* — "12 anos sem registro no sistema anterior"
7. Migração para MAM1 — set/2009 · Operação 100% digital — **Implantação**

> ⚠️ Pendência de conteúdo: "Media Portal MAM1" e a data de set/2009 precisam de **confirmação por escrito com a Media Portal** antes de publicar (briefing §5). Se não confirmarem, trocar por rótulo neutro de produto.

---

### 03 — Funil de negócios
**Purpose:** o time comercial vê onde está cada oportunidade, quanto vale cada estágio e o que está travado.

**Layout:** coluna única, padding `24px`, `gap:18px`.

**Cabeçalho:** "Negócios" (Space Grotesk 22px/700); "Funil comercial · 11 negócios em aberto" (12.5px `--dim`); "Ticket médio R$ 37,5 mil · R$ 156.500 parados há mais de 12 meses, em 4 negócios" (12px `--dim`). À direita, pílula "R$ 412.000 em pipeline" (Space Grotesk 14px/700, fundo `--panel`, `1px solid --line-strong`, `border-radius:10px`, padding `11px 18px`).

**Cinco colunas** — `grid-template-columns:repeat(5,minmax(0,1fr)); gap:10px; align-items:start`. Coluna: fundo `--panel`, `1px solid --line`, `border-radius:12px`, padding `14px 12px`, `gap:9px`.

**O funil ganha forma pelo cabeçalho da coluna**, não por trapézio desenhado. Cabeçalho de cada coluna (`padding-bottom:9px`):
1. nome do estágio + contagem — Space Grotesk 10.5px/700 `letter-spacing:.1em` `--muted`, contagem `--dim`/500;
2. subtotal (Space Grotesk 13px/700) + percentual do pipeline (11px `--dim`);
3. barra de proporção de `3px` (`border-radius:2px`, trilha `--trilha`, preenchimento em `--blue` com a largura = percentual).

| # | Estágio | Negócios | Subtotal | % |
|---|---|---|---|---|
| 1 | LEAD | 3 | R$ 49.500 | 12% |
| 2 | CONTATO FEITO | 2 | R$ 61.000 | 15% |
| 3 | QUALIFICADO | 2 | R$ 58.500 | 14% |
| 4 | PROPOSTA ENVIADA | 2 | R$ 122.000 | 30% |
| 5 | NEGOCIAÇÃO | 2 | R$ 121.000 | 29% |

> ⚠️ **A ordem é Lead → Contato feito → Qualificado → Proposta enviada → Negociação.** Os nomes dos estágios ainda devem ser conferidos com o funil real da Media Portal (briefing §5).

**Cartão de negócio:** fundo `--panel-strong`, `1px solid --line`, `border-radius:9px`, padding `12px 13px`, `gap:5px`, `cursor:pointer`.
- nome da conta — 12px/600, `line-height:1.32`;
- valor — Space Grotesk 14px/700 em **`--green`** (verde só em dinheiro);
- rodapé — 10.5px: `--dim` quando saudável ("origem · há N dias"), **`--orange-soft` quando parado** ("parado há N meses");
- cartão parado ganha ainda `box-shadow: inset 2px 0 0 var(--orange)` (faixa laranja à esquerda).
- Hover: `border-color: --line-blue`.

| Estágio | Conta | Valor | Rodapé | Parado |
|---|---|---|---|---|
| Lead | Instituto Embratel 21 | R$ 22.000 | indicação · há 26 dias | — |
| Lead | TV Assembleia · GO | R$ 18.000 | site · há 4 dias | — |
| Lead | Rádio Cultura FM | R$ 9.500 | site · há 11 dias | — |
| Contato feito | Assembleia Legislativa · PI | R$ 45.000 | parado há 34 meses | sim |
| Contato feito | TV Câmara · Campinas | R$ 16.000 | parado há 13 meses | sim |
| Qualificado | Museu da Imagem e do Som | R$ 31.000 | há 9 dias | — |
| Qualificado | EPTV Regional | R$ 27.500 | parado há 24 meses | sim |
| Proposta enviada | TV Cultura | R$ 68.000 | parado há 30 meses | sim |
| Proposta enviada | Sesc São Paulo | R$ 54.000 | há 12 dias | — |
| Negociação | CazéTV | R$ 82.000 | há 6 dias | — |
| Negociação | Novo Tempo | R$ 39.000 | há 21 dias | — |

**Rodapé da tela** (borda superior `1px solid --line`, `padding-top:14px`, 12px `--dim`): "Encerrados nos últimos 12 meses · 10 de 37 negócios viraram contrato · **R$ 286.000 fechados** (em `--green`/600) · conversão 27%".

---

### Painel de detalhe (drawer)
Abre ao clicar em qualquer conta da lista de revisão (tela 01), evento da linha do tempo (tela 02) ou cartão de negócio (tela 03).

**Layout:** `position:absolute; top:0; right:0; bottom:0; width:326px; z-index:5`, fundo `--bg-alt`, `border-left:1px solid --line-strong`, `box-shadow:-24px 0 60px rgba(0,0,0,.35)`, padding `22px`, `display:grid; gap:16px; align-content:start; overflow:auto`. Atrás dele, um véu `position:absolute; inset:0; background:rgba(3,6,12,.45); z-index:4`.

**Conteúdo, de cima para baixo:**
1. Contexto — 10px/700 caixa alta `letter-spacing:.14em` `--blue` ("CONTA · AUDITORIA DA BASE", "INTERAÇÃO · HISTÓRICO", "NEGÓCIO · FUNIL").
2. Título (Space Grotesk 18px/700, `text-wrap:pretty`) + subtítulo (12px `--dim`). Botão fechar `26×26` `border-radius:8px`, borda `1px solid --line-strong`, glifo `✕`; hover borda `--line-blue`.
3. Selo de situação — `display:inline-block`, 11px/600, `border-radius:9px`, padding `7px 12px`, `line-height:1.4`. Três tons: **atenção** (`--orange-soft` sobre `--orange-bg`, borda `--orange-line`), **neutro** (`--muted` sobre `--panel`, borda `--line-strong`), **positivo** (`--green` sobre `--panel`, borda `--line-strong`).
4. Lista de campos — card `--panel`, `1px solid --line`, `border-radius:11px`, padding `15px 16px`, `gap:11px`. Cada linha: rótulo 11px `--dim` à esquerda, valor 12.5px/600 alinhado à direita.
5. Lista de registros — rótulo do bloco 10.5px/700 caixa alta `--muted`; cada item com bolinha `6×6` `--blue` + título 12px/600 e descrição 11px `--dim`.
6. Nota de contexto — 11.5px `--dim`, borda superior `1px solid --line`.
7. Botão de ação — **único elemento laranja sólido** (`background:--orange`, texto `var(--ink)` — tinta escura no tema escuro, branca no claro, para manter 4.5:1 de contraste, 12.5px/600, `border-radius:9px`, padding `11px 16px`, largura total). Rótulos: "Registrar interação", "Registrar acompanhamento", "Avançar estágio".

Os 22 registros de detalhe (4 contas, 5 interações, 11 negócios, com seus campos, históricos e notas) estão no objeto `DETALHES` da classe de lógica em `design/Telas CRM Media Portal v2.dc.html` — use-o como fonte do conteúdo.

## Interactions & Behavior
- **Carrossel:** três telas numa trilha (`display:grid; grid-auto-flow:column; grid-auto-columns:900px; gap:64px`), deslocada por `transform: translateX(-i * 964px)` com `transition: transform .45s cubic-bezier(.4,0,.2,1)`. Viewport `width:900px; overflow:hidden`.
- **Navegação:** setas `←`/`→` (botões `34×34`, `border-radius:10px`, borda `1px solid --line-strong`; hover borda `--line-blue` e texto `--text`) e três dots nomeados ("01 Visão geral", "02 Ficha da conta", "03 Funil") — ativo em `--blue-deep` com texto `#fff`, inativo transparente com borda `--line-strong` e texto `--dim`. Teclas `←`/`→` navegam; `Esc` fecha o painel.
- **Tema:** alternador de dois botões (Escuro/Claro) num trilho `--panel` com borda `--line-strong`, `border-radius:9px`, padding `3px`; o ativo em `--blue-deep`/`#fff`. Troca de tema = troca dos valores dos tokens (ver "Design Tokens"), com `transition: background .25s ease` no fundo da página.
- **Abrir detalhe:** clique delegado — cada elemento clicável carrega `data-detalhe="<chave>"`; o handler sobe com `closest('[data-detalhe]')` e guarda a chave no estado. Trocar de tela fecha o painel.
- **Fechar detalhe:** clique no véu, no `✕` ou `Esc`.
- **Hover:** linhas de conta e itens da linha do tempo ganham `background: --blue-bg` (com `margin` negativa e `border-radius:9px` para o realce sangrar até a borda do card); cartões de negócio ganham `border-color: --line-blue`.
- Sem estados de carregamento, erro ou validação — não há formulário nas telas. As ações do painel são ilustrativas (não navegam).
- **Responsivo:** o mockup é de largura fixa; na implementação, rail colapsável, a faixa de 4 indicadores em 2×2 e as 5 colunas do funil em rolagem horizontal são os pontos de quebra naturais.

## State Management
Três variáveis, todas locais à tela:
- `i: 0 | 1 | 2` — tela visível no carrossel. Muda por seta, dot ou tecla. Sempre zera `chave`.
- `claro: boolean` — tema (padrão `false`, escuro). Muda pelo alternador.
- `chave: string | null` — id do registro aberto no painel (`'tv-cultura'`, `'ev-proposta'`, `'n-cultura'`…). `null` = painel fechado.

Nenhuma busca de dados no protótipo: os 22 registros de detalhe e os dados das telas são constantes no arquivo. Em produção: contas, interações e negócios vêm da API; os agregados das telas (306/63/1.348/R$ 412.000) devem ser **calculados a partir dos registros**, nunca digitados.

## Regras de dados (não podem ser quebradas)
1. **306 contas = 150 ativas + 63 em atenção + 93 sem registro.**
2. As **seis barras de interação somam 1.348** (360 + 281 + 223 + 205 + 159 + 120).
3. As **cinco colunas do funil somam R$ 412.000** (49.500 + 61.000 + 58.500 + 122.000 + 121.000).
4. **R$ 156.500 parados** = os 4 negócios com mais de 12 meses (45.000 + 16.000 + 27.500 + 68.000).
5. **Conversão 27%** = 10 de 37 negócios encerrados em 12 meses; R$ 286.000 fechados.
6. Tudo ancorado em **setembro/2026**. TV Cultura: proposta enviada em mar/2024, parada há 30 meses, em "Proposta enviada" — o mesmo em todas as telas. Assembleia Legislativa · PI: nov/2023, 34 meses, "Contato feito".
7. **Uso de cor com significado:** azul = seleção técnica e elemento ativo, sempre; **laranja = ação e um único acento por tela**; verde = dinheiro e situação positiva. Não usar verde/laranja decorativamente.

## Design Tokens

### Cores — tema escuro (padrão)
| Token | Valor | Uso |
|---|---|---|
| `--pagina` | `#05070d` | fundo do canvas |
| `--bg-alt` | `#070a12` | fundo das telas e do painel |
| `--panel` | `#0b1220` | cards |
| `--panel-strong` | `#101a30` | cartões dentro de cards (funil) |
| `--text` | `#f5f7fa` | texto primário |
| `--muted` | `#94a3b8` | texto secundário |
| `--dim` | `#7d8a9c` | rótulos e apoio |
| `--line` | `rgba(255,255,255,.08)` | bordas e separadores |
| `--line-strong` | `rgba(255,255,255,.16)` | bordas de destaque |
| `--line-blue` | `rgba(90,164,242,.35)` | borda de item selecionado/hover |
| `--blue` | `#5aa4f2` | seleção, ícone ativo, links |
| `--blue-deep` | `#136ef2` | barras, dot ativo, gradiente |
| `--blue-bg` | `rgba(90,164,242,.10)` | fundo de item ativo/hover |
| `--orange` | `#f2661c` | botão de ação, faixa de cartão parado |
| `--orange-soft` | `#ff8a4a` | texto de alerta |
| `--orange-bg` / `--orange-line` | `rgba(242,102,28,.12)` / `rgba(242,102,28,.30)` | selo de atenção |
| `--green` | `#34d399` | valores monetários, situação positiva |
| `--chrome` | `#080b14` | barra da moldura (só mockup) |
| `--icone-off` | `#1c2b47` | ícone de menu inativo |
| `--trilha` | `rgba(255,255,255,.07)` | trilha de barra de progresso |
| `--neutro` / `--neutro-forte` | `rgba(255,255,255,.12)` / `rgba(255,255,255,.24)` | faixa "sem registro", bolinha de legenda |
| `--sombra` | `0 30px 80px rgba(0,0,0,.5)` | sombra da moldura |

### Cores — tema claro (mesmos nomes, valores trocados)
| Token | Valor |
|---|---|
| `--pagina` | `#eef1f6` |
| `--bg-alt` / `--panel` | `#ffffff` |
| `--panel-strong` | `#f5f8fc` |
| `--text` | `#0a0f18` |
| `--muted` | `#48576b` |
| `--dim` | `#66748a` |
| `--line` | `rgba(10,15,24,.10)` |
| `--line-strong` | `rgba(10,15,24,.17)` |
| `--line-blue` | `rgba(19,110,242,.30)` |
| `--blue` | `#1663cf` |
| `--blue-deep` | `#136ef2` |
| `--blue-bg` | `rgba(19,110,242,.07)` |
| `--orange` | `#c8500e` |
| `--orange-soft` | `#b1470c` |
| `--orange-bg` / `--orange-line` | `rgba(200,80,14,.09)` / `rgba(200,80,14,.26)` |
| `--green` | `#0b7d52` |
| `--chrome` | `#f1f4f9` |
| `--icone-off` | `#d5dde9` |
| `--trilha` | `rgba(10,15,24,.08)` |
| `--neutro` / `--neutro-forte` | `rgba(10,15,24,.14)` / `rgba(10,15,24,.30)` |
| `--sombra` | `0 24px 60px rgba(10,15,24,.14)` |

Texto sobre gradiente azul (avatares, iniciais) é **sempre `#fff`**, nos dois temas. Já o texto do botão laranja usa `--ink`, que inverte por tema (`#0a0f18` no escuro, `#ffffff` no claro): branco sobre `#f2661c` daria só 3.1:1.

### Tipografia
| Uso | Fonte | Tamanho / peso | Extra |
|---|---|---|---|
| Título de tela | Space Grotesk | 22px / 700 | `letter-spacing:-.02em` |
| Número grande (indicador) | Space Grotesk | 29px / 700 | `line-height:1`, `letter-spacing:-.03em` |
| Número da ficha | Space Grotesk | 26px / 700 | idem |
| Título de card | Space Grotesk | 15px / 700 | `letter-spacing:-.01em` |
| Título do painel | Space Grotesk | 18px / 700 | `letter-spacing:-.02em` |
| Rótulo de card / estágio | Space Grotesk | 10.5–11.5px / 700 | caixa alta, `letter-spacing:.10–.12em` |
| Valor monetário | Space Grotesk | 13–14px / 700 | tabular |
| Corpo | Inter | 12.5–13.5px / 400–600 | |
| Apoio / metadados | Inter | 10.5–12px / 400 | `--dim` |
| Rótulo de indicador | Inter | 10px / 600 | caixa alta, `letter-spacing:.1em` |

### Espaçamento, raios e sombras
- Escala de espaçamento em uso: `3 · 5 · 6 · 8 · 9 · 10 · 11 · 12 · 13 · 14 · 16 · 18 · 20 · 22 · 24 · 64px`.
- Raios: `2px` (barra de progresso) · `4–5px` (ícone de menu, atalho) · `6–8px` (marca, item de menu, avatar pequeno) · `9px` (cartão de negócio, botão, campo, selo) · `10px` (pílula de pipeline, botão de seta) · `11–12px` (cards) · `13px` (avatar da ficha) · `14px` (moldura) · `20px` (etiquetas e filtros) · `50%` (avatar circular, bolinhas).
- Sombras: só duas — `--sombra` na moldura da tela e `-24px 0 60px rgba(0,0,0,.35)` no painel de detalhe. Cards não têm sombra.
- Transições: `transform .45s cubic-bezier(.4,0,.2,1)` (carrossel) e `background .25s ease` (tema).

## Assets
- **Fontes** (em `design/fonts/`, subconjuntos woff2 latin e latin-ext): `space-grotesk-latin.woff2`, `space-grotesk-latin-ext.woff2`, `inter-normal-latin.woff2`, `inter-normal-latin-ext.woff2`. Vêm do repositório `mathe1sOutlook/ApresentacaoMatheus` (pasta `fonts/`). Se o codebase já carrega essas famílias, use a fonte de lá.
- **Ícones:** só um SVG inline (lupa da busca, 12×12, `stroke:currentColor`, `stroke-width:1.2`). Todo o resto são formas CSS. Use o icon set do codebase de destino.
- **Imagens:** nenhuma. Avatares são iniciais sobre gradiente.
- Sem logotipo real: a marca "MP · CRM" é um quadrado com gradiente + texto. Substituir pelo logo oficial quando houver.

## Files
Em `design/`:
- **`Telas CRM Media Portal v2.dc.html`** — versão de referência: carrossel, temas claro/escuro, painel de detalhe. Abra este primeiro. A classe de lógica no fim do arquivo contém `CLARO` (tokens do tema claro), `SELO` (tons do selo) e `DETALHES` (os 22 registros do painel).
- `Telas CRM Media Portal.dc.html` — versão anterior, três telas estáticas lado a lado (só tema escuro). Útil para ver as três telas juntas.
- `support.js` — runtime do protótipo. **Não portar.**
- `fonts/` — as quatro fontes.

Em `referencia/`:
- `briefing-telas-crm.md` — a especificação que manda. Seção 1: sistema visual. Seção 4: as sete frentes contratadas. Seção 5: o que refinar em cada tela. Seção 6: os números canônicos. **Seção 7: o que já foi recusado e por quê** — leia antes de propor qualquer elemento novo.

Em `screenshots/` (referência visual; capturas re-renderizadas, então pequenas diferenças de quebra de linha em etiquetas são artefato do capturador — **o HTML é a fonte da verdade**):
- `01-visao-geral-escuro.png`, `02-ficha-conta-escuro.png`, `03-funil-escuro.png`
- `04-visao-geral-claro.png`, `05-ficha-conta-claro.png`, `06-funil-claro.png`
- `07-painel-detalhe-negocio-claro.png` (negócio, tema claro), `08-painel-detalhe-interacao-escuro.png` (interação, tema escuro)
