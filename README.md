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
marquee.

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
img/qr.svg      QR do site para a caixa "uso físico"; img/qr-print.svg é a
                versão preto-no-branco para cartão, crachá e proposta. Os dois
                são gerados por scripts/build-qr.py
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
junto.**

Para editar uma frase, mude os dois lados: o texto no HTML (PT) e o `data-en`
(EN). Se um dia o site virar Next.js, esses pares alimentam direto os
dicionários do `next-intl`.

## QR code

`img/qr.svg` (creme sobre quase preto, para a tela) e `img/qr-print.svg` (preto
no branco, para papel) são **gerados**: `pip install segno && python3
scripts/build-qr.py`. Os dois codificam
`https://casamartech.vercel.app/?utm_source=qr`, em 33 módulos com correção de
erro Q — o mesmo tamanho de sempre, então a caixa de 120px do contato não muda.

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

## Imagens de compartilhamento

`og.png` e `og-en.png` são **geradas**, não desenhadas à mão: `node
scripts/build-og.mjs` monta um cartão de 1200×630 com as fontes embutidas em
base64, uma constelação de semente fixa, o contorno de casa em linha
de construção e a trilha ocre → azul. Se a tagline, o nome ou o endereço
mudarem, é o script que muda — e as duas imagens são versionadas junto.

## Formulário de contato (leads)

O "Iniciar conversa" em `#contato` faz duas coisas ao enviar: abre o WhatsApp
com a mensagem montada e grava o lead na tabela `amaralesilva_leads` do
Supabase (projeto `mApps`), via REST com a chave publicável. A política RLS
permite ao papel anônimo apenas INSERT com `source = 'site'` e
`status = 'novo'`, e só nas colunas que o formulário preenche; um trigger
limita a uma linha por requisição e a 30 leads por 10 minutos. Leitura e
edição só para membros, pela tela **Leads do site** do painel `/admin`, que
também converte o lead em cliente com um clique. Um campo-isca (`website`)
barra robôs simples, e o formulário avisa que os dados servem só para
responder ao contato (o campo de contato aceita e-mail ou WhatsApp).

## Seções

`#topo` (hero) · `#dupla` · `#diagnostico` · `#servicos` · `#cases` ·
`#processo` · `#contato`.

Duas delas mudam de forma abaixo de 640px. O `#diagnostico` deixa de ser a
cascata de seis sintomas pendurados na régua e vira um carrossel: o script
duplica as seis cartas, a faixa anda sozinha até -50% (onde a cópia coincide
com o original, o mesmo truque do marquee de clientes) e o toque pausa. O
`#servicos` troca as duas colunas por duas abas — Marca e Tecnologia — que se
revezam a cada 6s enquanto a seção está na tela; uma barra fina sob a aba
ativa marca o tempo, e tocar numa aba fixa aquela frente e para o relógio.
Nos dois casos, `prefers-reduced-motion` desliga o movimento e deixa o
conteúdo parado e legível. O detalhe está em
`docs/handoff-diagnostico-entregas-mobile.md`.

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
  CSS pinta de creme. Sem o arquivo, fica o nome em texto. No ar: `corning`
  (wordmark). **Faltam ame, quintoandar, mediaportal, informa e gipsyy.** O
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
  praça), `ame-x` (banner Cashback Friday), `amwc` (cartaz) e `ame-tom-de-voz`
  (banner do super app + grade de serviços). **Faltam `mediaportal`, que
  precisa do print real do site, e `gipsyy`.** Basta salvar o arquivo com esse
  nome; enquanto ele não existe, o `onerror` do `<img>` deixa a capa na
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

No handoff do carrossel de sintomas, a `@media (max-width: 767px)` que dá ao
sintoma o padding da cascata (`2px 4px 26px 18px`) vinha depois da
`@media (max-width: 639px)` e vencia nela — a carta do celular ficava com 4px
de respiro à direita e o texto encostava na borda. Aqui essa regra é
`(min-width: 640px) and (max-width: 767px)`: a cascata estreita fica como
estava e a carta usa os 22px que o handoff pede.

Os rótulos das abas de entregas vão num `<span data-en>` dentro do botão, e
não no próprio botão: a troca de idioma reescreve o `innerHTML` do nó que tem
`data-en`, e o `<i>` da barra de tempo seria varrido junto.
