# CASA MARTECH — site institucional

One-pager bilíngue (PT-BR / EN) da **CASA MARTECH** — a dupla **Bruno Amaral**
(marca e estratégia) e **Matheus Silva** (tecnologia e dados). Publicado em
<https://casamartech.vercel.app> até a dupla ter domínio próprio.

O endereço anterior, `amaralesilva.vercel.app`, continua anexado ao projeto na
Vercel e abrindo o site — é o que segura os QR já impressos e os links que
circularam. O canônico, o sitemap, o Open Graph, o JSON-LD e os QR novos
apontam para `casamartech.vercel.app`.

Implementa o handoff *Reestruturação de branding* na versão escura — fundo
quase preto, tinta creme, ocre para marca, azul para tecnologia, Fraunces +
Inter + IBM Plex Mono, superfícies arredondadas sobre réguas de 1px — o que é
cartão, botão ou campo tem canto macio; o que é linha técnica (trilhos, nós,
conectores) continua reto. O
hero traz a casa de luz: a ilustração da casa em corte, à direita, com pulsos
que viajam pelos rastros entre os cômodos como sinais numa rede. As seções
entram com um fade curto ao rolar. Os dois efeitos desligam com
`prefers-reduced-motion` — a casa fica acesa e parada. A prova social roda em
marquee, e passar o mouse por cima não a interrompe.

## Estrutura

```
index.html      site completo (marcação + <style> + <script>, sem build)
en/index.html   versão inglesa pré-renderizada (gerada, ver "Idiomas")
scripts/        build-en.mjs (gera en/index.html), build-og.mjs (gera as duas
                imagens de compartilhamento) e build-qr.py (gera os dois QR) —
                só desenvolvimento
favicon.svg     a casa do hero em traço: telhado ocre, paredes azuis, sem texto
og.png, og-en.png  imagem de compartilhamento (1200×630) em PT e EN, geradas por
                scripts/build-og.mjs com as fontes e os tokens do site
fonts/          woff2 (latin + latin-ext): Fraunces, Inter e IBM Plex Mono para o
                site; Space Grotesk para a proposta do CRM; Barlow e Barlow
                Condensed para a proposta da 2JEM
img/bruno.jpg, img/matheus.jpg  avatares de #dupla, quadrados de 192×192 (o
                dobro dos 96px exibidos); o recorte circular é do CSS, e sem o
                arquivo o onerror deixa a moldura tracejada "foto aqui". As duas
                seguem o mesmo tratamento, e foto nova entra assim: preto e
                branco, fundo cinza-escuro com grão (luminância ~60) e o rosto
                no mesmo tamanho e lugar do outro avatar
img/hero-casa.jpg  a casa de luz do hero (1072×821); img/hero-casa-luz.png é a
                máscara dos rastros, que recorta o canvas dos pulsos (ver
                "Hero: a casa de luz")
img/qr.svg      QR do site em creme sobre escuro; img/qr-print.svg é a
                versão preto-no-branco. Os dois são para papel — cartão,
                crachá, proposta — e saem de scripts/build-qr.py
robots.txt      libera o site, bloqueia as propostas e o /admin
sitemap.xml     / e /en com hreflang
vercel.json     rewrites (/en, /admin, propostas), noindex das propostas e do
                admin, cache longo para /fonts. Não há catch-all: caminho que
                não existe responde 404 (antes devolvia o index inteiro)
.vercelignore   o que não sobe para a Vercel (router PHP local, scripts/, docs/)
docs/           material de trabalho interno; não vai para o ar
proposta-mediaportal-*/   três propostas privadas para a Media Portal, fora do índice
                (site, contrato e CRM & Inteligência de Dados)
proposta-2jem-*/          proposta de marca e plataforma digital da 2JEM, no
                sistema "Verde · Navy" (tokens próprios, tema claro só)
admin/          painel interno da dupla (CRM, financeiro, agenda, tarefas)
```

Sem etapa de build e sem dependências: é HTML estático servido direto pela
Vercel, como o site anterior. As fontes (Fraunces, Inter, IBM Plex Mono —
licença OFL) são servidas de `/fonts`, sem chamada ao Google Fonts.

## Idiomas

O idioma vive na URL — `/` é PT-BR e `/en` é inglês (em `file://` o fallback é
`?lang=en`). Cada nó traduzível carrega o texto em inglês no atributo `data-en`
(atributos usam `data-en-href`, `data-en-alt`, `data-en-aria-label`); o
português é o próprio conteúdo do HTML. O script troca `innerHTML`, `<html
lang>`, `<title>`, a meta description, o canonical e as tags Open Graph, e usa
`history.pushState`, então o botão voltar funciona.

`/en` é **pré-renderizado**: `en/index.html` é gerado por
`node scripts/build-en.mjs` (precisa do Playwright, só em desenvolvimento) com
o `<head>`, o conteúdo e o JSON-LD já em inglês, porque robôs de
compartilhamento e buscadores não executam JS. O PT de cada nó fica guardado
em `data-pt`, e o script continua trocando de idioma sem recarregar.
**Sempre que editar o `index.html`, rode o script e versione o `en/index.html`
junto.** Como `/en` fica um nível abaixo da raiz, o script prefixa `../` nos
caminhos de `img/` e `fonts/` ao gerar — o PT os escreve relativos à raiz.

Para editar uma frase, mude os dois lados: o texto no HTML (PT) e o `data-en`
(EN). Se um dia o site virar Next.js, esses pares alimentam direto os
dicionários do `next-intl`.

## QR code

`img/qr.svg` (creme sobre quase preto, para a tela) e `img/qr-print.svg` (preto
no branco, para papel) são **gerados**: `pip install segno && python3
scripts/build-qr.py`. Os dois codificam
`https://casamartech.vercel.app/?utm_source=qr`, em 33 módulos com correção de
erro Q. A caixa "uso físico" saiu do contato; os dois arquivos ficam porque o
impresso continua usando.

Trocar o endereço é trocar a constante `SITE` no script e rodar de novo. O que
já foi impresso aponta para o endereço anterior e continua funcionando enquanto
ele estiver anexado ao projeto na Vercel.

## Hero: a casa de luz

A arte do hero são dois arquivos que andam juntos. `img/hero-casa.jpg`
(1072×821) é a ilustração da casa em corte — fundo já remapeado para `--bg`,
bordas esmaecidas no próprio arquivo e os rastros entre os cômodos escurecidos,
só as lâmpadas acesas. Os cômodos são ambientes de trabalho, desenhados no
traço da própria ilustração: sala de reunião no andar de cima à direita,
estações de trabalho embaixo à direita e sala de servidores embaixo à
esquerda. `img/hero-casa-luz.png` é a máscara: alpha só onde há
rastro de luz, e é ela que recorta o `<canvas>` dos pulsos — por isso o brilho
aparece sobre o caminho e nunca acende a parede ao lado.

O script mantém um grafo de 12 nós e 12 arestas em coordenadas da imagem, com
as arestas traçadas sobre os rastros reais da ilustração. Os pulsos nascem no
hub (60% das vezes) ou num cômodo, escolhem a aresta há mais tempo apagada e
morrem depois de 1 a 3 saltos. `fitPulsos` encaixa o canvas sobre a área
desenhada da imagem (contain, canto inferior direito) por
`offsetWidth`/`offsetLeft`, para o encaixe não escorregar com zoom.

**Trocar a ilustração é trocar as três coisas**: a máscara se gera da mesma
imagem ainda acesa (`alpha = ((lum − 95)/90)²`, RGB branco) e as polilinhas das
arestas se retraçam pelo caminho de menor custo pela máscara. Sem isso os
pulsos saem do rastro. O detalhe está em `docs/handoff-hero-casa-de-luz.md`.

Abaixo de 880px a arte sai — cruzaria o texto — e o script para de desenhar;
com `prefers-reduced-motion` o canvas sai e a casa fica acesa e parada; na
impressão as duas camadas saem.

## Rede de luz pela página

O `<canvas id="trail">` fica fixo atrás de tudo (`z-index: 1`, abaixo do
header) e desenha a mesma luz do hero correndo pela página inteira: nós nas
faixas laterais, um núcleo por título de seção, e arestas curvas ligando cada
nó a um vizinho abaixo. O `filter: blur(3px)` é o acrílico — engrossa a luz e
apaga o traço fino, para a rede nunca competir com o texto.

Os nós se recalculam a cada 500ms, mas só se reconstroem quando a assinatura
da página muda (largura da janela, topo e altura das seções); as posições vêm
de uma semente, então a rede é a mesma a cada carregamento. Cada nó tem uma
profundidade `z` que decide espessura, brilho e tamanho — longe é mancha larga
e fraca, perto é ponto vivo. Impulsos correm as arestas a 340–540px/s, no
máximo cinco por vez, retransmitindo por até cinco saltos.

A fonte da rede é o piso da casa do hero: quando um pulso da ilustração chega
à escada ou ao canto inferior esquerdo, o script do hero chama
`window.__trail.emit()` e a rede acende a partir dali. Sem a ilustração (abaixo
de 880px) a fonte vira um ponto na margem direita, logo acima do fim do hero.
O desenho para com a aba escondida, e com `prefers-reduced-motion` o canvas
sai inteiro.

## Imagens de compartilhamento

`og.png` e `og-en.png` são **geradas**, não desenhadas à mão: `node
scripts/build-og.mjs` monta um cartão de 1200×630 com as fontes embutidas em
base64, uma constelação de semente fixa, o contorno de casa em linha
de construção e a trilha ocre → azul. Se a tagline, o nome ou o endereço
mudarem, é o script que muda — e as duas imagens são versionadas junto.

## Formulário de contato (leads)

O "Iniciar conversa" em `#contato` grava o lead na tabela
`amaralesilva_leads` do Supabase (projeto `mApps`), via REST com a chave
publicável, e responde na própria página — **Enviar não abre mais o
WhatsApp**. Deu certo, entra a faixa "Recebemos. Respondemos em até 1 dia
útil" e o formulário se limpa; falhou (rede fora, 4xx/5xx — `fetch` não
reclama de status, quem recusa é o nosso `res.ok`), entra a faixa de erro
apontando o WhatsApp e o e-mail, e o que foi digitado fica onde está. As
duas faixas são `role="status"`, para leitor de tela anunciar.

Quem prefere falar na hora tem o segundo botão, "Falar no WhatsApp": é um
`<a>` de verdade, com a saudação já no `href` — sem JavaScript ele abre
assim mesmo —, e o script substitui pelo que estiver preenchido no momento
do clique, sem exigir campo nenhum. Ele não grava lead: quem grava é o
Enviar.

A política RLS permite ao papel anônimo apenas INSERT com `source = 'site'`
e `status = 'novo'`, e só nas colunas que o formulário preenche; um trigger
limita a uma linha por requisição e a 30 leads por 10 minutos. Leitura e
edição só para membros, pela tela **Leads do site** do painel `/admin`, que
também converte o lead em cliente com um clique. Um campo-isca (`website`)
barra robôs simples, e o campo de contato aceita e-mail ou WhatsApp. A nota
sobre os dados ("guardamos sua mensagem para responder a este contato") saiu
do pé do formulário e mora num "i" com tooltip embaixo dos botões: o texto
fica no documento o tempo todo — só a opacidade some —, então
`aria-describedby` e leitor de tela continuam chegando nele, e a bolha abre
no mouse, no foco e no toque.

"O que você precisa" são duas pílulas — as duas frentes da casa —, e não uma
caixa de seleção: `<input type="checkbox">` com a caixa desenhada no
`<label>`, o disco de cada uma na cor da sua frente (ocre em marca, azul em
sistema). Elas **somam**: as duas marcadas gravam `ambos`, e nenhuma marcada
grava `nao-sei` — os quatro valores da coluna `need` continuam os mesmos,
derivados no envio. Nada vem marcado de saída, para o que chegar ser escolha
de quem escreveu; sem marcação a linha não entra na mensagem do WhatsApp. O
lead nunca vai vazio: `need` é `not null` com `check` nos quatro valores.

## Seções

`#topo` (hero) · `#dupla` · `#diagnostico` · `#servicos` · `#cases` ·
`#processo` · `#contato`.

O `#servicos` é um explorador: as oito entregas em lista de um lado, uma
aberta de cada vez do outro, com o que ela é na prática e o que o cliente
recebe. Ocre numera as quatro de marca, azul as quatro de tecnologia. A
entrega aberta troca sozinha a cada 3,5s enquanto a seção está na tela e a
aba do navegador está visível; uma linha ocre→azul cresce no pé do item ativo
marcando o tempo, o mouse sobre o painel segura e o clique (ou ↑↓) fixa uma
entrega e para o relógio. Quem esconde sete dos oito painéis é o script: no
HTML os oito nascem abertos, então sem JavaScript — e no papel — a seção
desce em coluna, com a lista fora do caminho. O detalhe está em
`docs/handoff-explorador-entregas.md`.

O `#cases` é uma fileira de quatro capas que rola na horizontal. Abrir um
caso abre os quatro: eles correm lado a lado, e um card aberto sozinho
deixava os vizinhos como capas mudas. Aberto, o card inverte as proporções —
a capa cede altura (460px → 236px, e a peça de campanha do Caso 03 sai,
ficando o fundo desfocado), a barra do topo encolhe para 52px e o painel de
texto para de crescer na altura da janela, rolando por dentro em vez de
empurrar a página. O teto é medido pelo script (`--case-panel-max`: a janela
menos a barra do topo, menos a capa encolhida) e refeito a cada resize; ao
abrir, a fileira sobe para o alto da tela. No papel o teto e a rolagem não
valem: o texto de cada caso sai inteiro.

A capa aberta tem altura **fixa**, não mínima: com `min-height`, a de título
longo (Corning quebra o título e a métrica em duas linhas) ficava mais alta
que as outras e desalinhava os painéis da fileira. Pelo mesmo motivo os cards
entram prontos neste modo — o fade de `.reveal` foi feito para a seção
descendo, e de lado o card que aparece chega translúcido e três pixels acima
dos vizinhos. O passo do carrossel (`scroll-snap`) também sai, e abaixo da
fileira aparece uma barra de rolagem desenhada (`.cases__bar`): a nativa está
escondida no desenho normal e, em parte dos sistemas, é sobreposta e não
aparece. O script sincroniza a alça com o scroll; arrastá-la, ou clicar no
trilho, move a fileira.

O `#diagnostico` é o mesmo explorador, em outra medida: seis áreas em lista
(Marketing, Processos, Comunicação, Dados, Tecnologia, Continuidade) e, do
outro lado, a frase da área com dois sinais concretos e uma ilustração em
traço no canto. O painel entra em dois tempos — rótulo e frase primeiro, os
sinais 1,5s depois —, e cada área fica 7s no ar (`data-dwell="7000"`, contra
os 3,5s das entregas). Abaixo de 640px ele continua explorador, diferente das
entregas; o que muda é o painel descer para baixo da lista. Cada ilustração
carrega uma ruptura que traduz a dor — a de Continuidade é a linha do tempo
que arrebenta logo depois de "Entrega". O detalhe está em
`docs/handoff-rede-e-diagnostico.md`.

O `#dupla` é uma galeria: o texto à esquerda e, à direita, dois quadros
pendurados com avatar, nome, cargo, bio e chips. Um quadro por ofício, e a
borda ocre é o que os pendura.

A faixa de clientes não para no mouse. Quem quiser olhar um nome de perto
arrasta a faixa ou gira a roda na horizontal; ao soltar, ela retoma do ponto
onde ficou e o embalo do gesto se apaga em cerca de um segundo. O passo é o
mesmo do `@keyframes` — uma cópia inteira a cada 40s —, só que medido em
pixels, porque com a classe `is-loop` quem escreve o `transform` passa a ser
o script. Sem JavaScript, ou com `prefers-reduced-motion`, o CSS continua
mandando. Só o foco de teclado pausa: é o jeito de ler a faixa parada, e é
o que a `aria-label` do grupo promete.

Abaixo de 640px o `#servicos` troca o explorador por duas abas — Marca e
Tecnologia — que se revezam a cada 6s enquanto a seção está na tela; uma
barra fina sob a aba ativa marca o tempo, e tocar numa aba fixa aquela frente
e para o relógio. Com `prefers-reduced-motion` nada disso anima. O detalhe
está em `docs/handoff-diagnostico-entregas-mobile.md`.

## Admin (`/admin`)

Painel interno do Matheus e do Bruno, em `admin/index.html` — um SPA estático
no mesmo espírito do site (arquivo único, sem build, mesmos tokens de design).
Reúne:

- **CRM** — pipeline de propostas (contato → proposta a enviar → proposta
  enviada → negociação → contrato fechado → concluído / perdido), com as duas
  condições da mesma proposta (valor cheio/parcelado, em quantas vezes, e o
  valor à vista quando há desconto no pagamento único), preço final,
  condições de pagamento, divisão de valores entre a dupla e links para a
  proposta e o contrato em HTML hospedados no próprio site.
- **Devolutivas** — registro por projeto do que o cliente devolveu, do que foi
  combinado e das conversas.
- **Financeiro** — parcelas com dia de pagamento, divisão Matheus/Bruno,
  entradas por mês, acumulado e filtros por período.
- **Agenda** — calendário de reuniões com pauta e ata do que foi proposto.
- **Tarefas** — atribuíveis a qualquer um dos dois; o dashboard avisa o que é
  de hoje, da semana e o que atrasou.
- **Leads do site** — o que chegou pelo formulário público, com situação
  (novo, em contato, convertido, descartado) e conversão em cliente.

O painel **relê o banco sozinho**: quando a aba volta ao foco e a cada minuto
com ela à vista, respeitando um piso de 15s entre leituras e se segurando
enquanto há modal aberto ou cursor dentro de um campo. Antes ele só lia no
login, depois de uma alteração e no "↻ Atualizar dados" da gaveta — deixado
aberto, mostrava para sempre a foto do momento em que entrou. Quando chega lead
novo, o botão **Menu** acende um ponto ocre, o item *Leads do site* mostra a
contagem e um aviso passa na tela.

### Backend

Supabase (projeto compartilhado `mApps`, ref `wsgjbzsdewzplsnpfvdf`), tabelas
com prefixo `amaralesilva_` — o DDL de referência está em `admin/schema.sql`.
Login com Google via Supabase Auth; a chave publicável no HTML é pública por
natureza e os dados são protegidos por RLS: só e-mails cadastrados em
`amaralesilva_members` leem ou escrevem qualquer coisa. Novos membros são
cadastrados na tela **Equipe** (o e-mail precisa ser o da conta Google).

### Passo manual (uma vez)

No painel do Supabase, em *Authentication → URL Configuration* do projeto
`mApps`, adicionar às **Redirect URLs**:

```
https://casamartech.vercel.app/admin
https://amaralesilva.vercel.app/admin
```

Sem isso o retorno do login Google não volta para o painel — o `/admin` usa
`location.origin`, então **todo endereço pelo qual o painel é aberto precisa
estar nessa lista**. (O provider Google já está ativo no projeto.)

## Pendências

- **Logos da faixa "já fizemos história com..."** — `/img/logos/<slug>.svg`
  (corning, ame, quintoandar, mediaportal, informa, gipsyy), monocromáticos; o
  CSS pinta de creme. Sem o arquivo, fica o nome em texto — que é como os
  **seis** estão hoje: o `corning.svg`, único que existia, saiu na rodada de
  setembro e a faixa ficou toda na mesma serifa. O
  arquivo precisa ter **fundo transparente**: o filtro que pinta de creme
  (`brightness(0) invert(0.93)`) pinta tudo que não é transparente, então um
  retângulo de fundo vira um bloco chapado. Serve SVG ou PNG com alpha; se for
  PNG, trocar a extensão no `src` das duas listas da faixa.
- **Vercel Web Analytics** — o site já carrega `/_vercel/insights/script.js`;
  só começa a contar depois de ativar *Analytics* no projeto na Vercel.
- **Imagens dos casos e projetos** — cada card aponta para um arquivo em
  `/img/casos/` (mediaportal, mindminers, ame-x, corning) e em `/img/projetos/`
  (amwc, ame-tom-de-voz, gipsyy). **Esta lista é a seleção aprovada; não
  acrescentar nomes sem aprovação** — os cases retirados na rodada 2 não
  voltam. Já estão no ar: `corning` (foto do barco), `mindminers` (banco de
  praça), `ame-x` (banner Cashback Friday), `mediaportal` (a home do site
  desfocada com o logo por cima), `amwc` (cartaz) e `ame-tom-de-voz` (banner do
  super app + grade de serviços). **Falta `gipsyy`.** Basta salvar o arquivo
  com esse nome; enquanto ele não existe, o `onerror` do `<img>` deixa a capa na
  moldura de espera sobre uma malha de desenho (as imagens ausentes respondem
  404, que é barato). O que está no ar é JPEG progressivo, 1600 px de largura
  nas capas e o tamanho original nos cards; WebP/AVIF fica para quando houver
  pipeline de imagem.
  Uma capa de caso tem dois modos. **Foto** (`case__cover--photo`) cobre o
  card inteiro, com degradê para a legenda ler. **Peça** (`case__cover--piece`)
  é para banner e anúncio: a imagem fica montada na prancha, na proporção em
  que foi feita — cobrindo, um banner de 3,7:1 numa capa quase quadrada
  mostraria um terço de si. O `onerror` de cada `<img>` remove a classe do seu
  modo, e a capa volta para a moldura de espera.
  **Print de site não entra legível.** O do Media Portal entrou, e a manchete
  do site disputava a leitura com o título do caso — quem passava lia o texto
  errado. A capa de hoje é o mesmo print virado textura: desfocado, escurecido
  e com o logo oficial da marca por cima, que é o que se quer comunicar.
  Também resolve o corte, porque uma textura não tem onde ser decepada — a
  capa é quase quadrada no desktop e bem mais alta no celular.
  A receita, para refazer se o site mudar: print da home em 1440px de largura
  (só a primeira dobra), desfoque gaussiano de ~28px sobre 1600px, altas luzes
  comprimidas (o painel branco do vídeo vira brilho, não bloco), sombra radial
  atrás do logo, véu escurecendo o terço de baixo — é lá que caem título,
  métrica e botão — e o logo branco da marca a 31% da largura, centrado a 32%
  da altura. Resultado: 1600×1956, retrato.
  **Peça de campanha ganha o próprio fundo** (`case__fundo`): o mesmo arquivo
  entra atrás, ampliado e desfocado, para a cor da peça tomar o cartão inteiro.
  A prancha vazia em volta de um banner era espaço morto, e uma segunda imagem
  só para preencher seria peso a mais para baixar. No papel ele some.
  Um caso aceita **mais de uma imagem**: é duplicar o `<img class="case__shot">`
  dentro da `<div class="case__shots">`. A partir da segunda, a faixa vira
  carrossel — arrasto nativo por scroll-snap, marcadores e setas do teclado
  entram sozinhos. A primeira imagem é a capa: se ela faltar, o caso inteiro
  volta para a moldura de espera.
- **Contato** — enquanto a CASA MARTECH não tiver domínio e e-mail próprios, o
  canal é o do Bruno: `bamaralpenha@gmail.com` e WhatsApp (11) 99977-3471 — que
  é também o telefone do JSON-LD. O `contato@amaralesilva.com` do design nunca
  existiu, e o antigo (11) 96904-1800 saiu do site e do schema: a dupla atende
  por um canal só. Quando o
  domínio entrar, é aqui que o endereço muda.
- **Resolução da casa do hero** — `img/hero-casa.jpg` é arte gerada por IA e
  tem artefatos quando se olha de perto; os ambientes corporativos foram
  desenhados por cima da mobília doméstica original. Uma versão em resolução
  maior, já nascida como escritório, daria um recorte mais limpo — e aí a
  máscara e as arestas se regeneram junto (ver "Hero: a casa de luz").

## Desvio do design

O ocre e o azul foram clareados para o fundo escuro: `#C9A24E` e `#7A93E6`
(ambos acima de 6:1 sobre `--bg`, o mínimo WCAG AA para texto pequeno é 4,5:1).
Os tokens vivem no `:root` de `index.html`; o `favicon.svg`
usa as duas cores, ocre no telhado e azul nas paredes.

Os rótulos das abas de entregas vão num `<span data-en>` dentro do botão, e
não no próprio botão: a troca de idioma reescreve o `innerHTML` do nó que tem
`data-en`, e o `<i>` da barra de tempo seria varrido junto.
