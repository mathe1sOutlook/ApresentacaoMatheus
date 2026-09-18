# Casa Martech — Handoff consolidado

Documento vivo de referência para a evolução do portfólio atual **Amaral & Silva** para **Casa Martech**.

> **Diretriz mais recente e prioritária:** não substituir radicalmente o site atual. A implementação deve partir do que já existe em produção e avançar por **alterações pequenas, controladas e iterativas**, preservando estrutura, textos e identidade que já funcionam. Os mockups gerados durante a discussão servem somente como exploração visual; não são especificação literal de implementação.

Site atual: `amaralesilva.vercel.app`
Repositório: `mathe1sOutlook/ApresentacaoMatheus`
Branch principal: `master`

---

## 1. Estado de partida

O site atual é o portfólio institucional Amaral & Silva, bilíngue PT/EN, em HTML estático, com identidade escura, Fraunces + Inter + IBM Plex Mono, acentos ocre para marca e azul para tecnologia, hero com constelação/circuito de partículas, prova social, seção da dupla, diagnóstico, serviços, cases, processo e contato.

A evolução para Casa Martech deve aproveitar este sistema, e não descartá-lo.

### Regra de conteúdo

**Não reescrever os textos existentes**, exceto os pontos expressamente alterados e documentados neste handoff. Ideias de copy que apareceram apenas em mockups visuais não são conteúdo aprovado.

---

## 2. Identidade de marca

### Nome

**CASA MARTECH**

Substituir futuramente “Amaral & Silva” pelo novo nome nos pontos públicos do site, incluindo navegação, metadados/título da aba, rodapé e referências de contato quando o canal oficial estiver definido.

### Tagline aprovada

> **Marcas que se destacam. Sistemas que não falham.**

### Manifesto recebido

> Marca forte precisa de sistema que não falha. Sistema bem construído precisa de marca com propósito. Por isso a gente trabalha as duas juntas, sempre.
>
> A Casa Martech nasceu da parceria entre quem pensa estratégia de marca e quem constrói engenharia de sistemas. Uma casa, dois ofícios, um único endereço pra quem precisa das duas coisas bem feitas e conectadas.

### Valores recebidos

| Valor | Significado / prova registrada |
|---|---|
| Marca e sistema, decididos juntos | As duas frentes nascem na mesma conversa; não é um fluxo isolado de briefing → design → dev. |
| Decisão com dado, não só achismo | Pesquisa e métrica orientam a estratégia. Referência: MindMiners / Saúde de Marca. |
| Consistência antes de volume | Poucas coisas bem feitas e sustentadas no tempo. Referência: Ame Digital. |
| Sistema pensado pra crescer | Tecnologia feita para escalar. Referências citadas: Genma, NOG, VisionOne. |
| Processo transparente | Cliente entende etapa atual e próximos passos. |

### Domínio e canais — ainda não definidos

Foram sugeridos:

- `casamartech.com.br` como domínio principal possível;
- `.com` como possibilidade internacional;
- `@casamartech` em redes;
- exemplos de e-mail apareceram tanto com `.com` quanto `.com.br`.

**Não assumir nenhum desses canais como definitivo até confirmação.**

---

## 3. Sistema visual existente a preservar

Tokens recebidos para a direção Casa Martech:

| Token | Valor |
|---|---|
| Fundo | `#0C0E11` |
| Superfície | `#15181D` / `#1B1F26` |
| Texto principal | `#F1EFEA` |
| Texto secundário | `#9B9C97` |
| Accent Marca | `#E7A94B` |
| Accent Tech | `#6F9CF7` |

Tipografia: **Fraunces + Inter + IBM Plex Mono**.

A dualidade ocre/azul deve continuar representando, respectivamente, marca/estratégia e tecnologia/dados.

### Direção visual atualizada

A evolução deve transmitir:

- tecnologia com sofisticação;
- criatividade e repertório de marketing;
- equilíbrio entre estratégia, marca, produto, dados e engenharia;
- menos aparência de “portfólio de programador”; 
- mais aparência de uma casa/studio de **creative tech / martech**.

Os ângulos muito rígidos do site podem ficar **mais orgânicos**, porém sem transformar tudo em formas gratuitas.

### Feedback que invalida uma direção anterior

O conceito com grandes formas arredondadas independentes em “O que entregamos” foi rejeitado pelo Bruno por parecer **“bolha de sabão”**, desconectado e perdido.

Portanto:

- não usar blobs isolados como linguagem principal;
- organicidade deve vir de **curvas estruturais, caminhos, transições, bordas suaves, recortes e conexões**;
- cada forma precisa ter relação clara com hierarquia e conteúdo;
- evitar excesso visual e excesso de elementos decorativos.

O mockup completo mais recente também foi considerado **muito carregado**. A intenção agora é voltar ao site atual e trabalhar por refinamentos pontuais.

---

## 4. Hero

### Conteúdo

Tagline aprovada:

> **Marcas que se destacam. Sistemas que não falham.**

### Exploração ainda em definição

Há interesse em incorporar a ideia de **casa + marketing + tecnologia**, sem substituir totalmente o circuito atual.

Direção possível registrada:

- manter a lógica do circuito/partículas ocre + azul;
- fazer esse sistema conversar com um contorno sutil de casa, como um desenho técnico/blueprint;
- evitar uma ilustração literal ou pesada;
- possibilidade de reaproveitar um pequeno glifo de casa no nome Casa Martech.

Nada disso está aprovado como implementação final; deve ser prototipado de forma incremental sobre o hero atual.

---

## 5. Proof strip

Texto de abertura aprovado:

> **Já fizemos história com...**

### Lista definida até agora

- Corning
- Ame Digital
- QuintoAndar
- Media Portal
- Informa Markets
- Gipsyy

Alterações definidas em relação ao site anterior:

- remover TV Cultura;
- trocar Americanas por Ame Digital.

Ainda falta Matheus avaliar se entram outras marcas/clientes dos seus próprios cases.

---

## 6. A dupla

### Layout

**Manter os dois cards lado a lado.** O layout atual foi aprovado.

### Remover

Remover futuramente a frase:

> “Uma marca sem sistema não escala. Um sistema sem marca não convence.”

### Fotos

- **Matheus:** foto recebida nesta conversa. Deve ser tratada/cortada para uso pequeno no card de perfil, sem protagonismo excessivo.
- **Bruno:** foto definitiva ainda será enviada. Não substituir por uma imagem inventada; manter placeholder até o material chegar.

Arquivo recebido para Matheus na conversa:

- `66797F76-C8BF-40DB-BB02-659972B24D4A.jpeg`

---

## 7. “Sua operação se reconhece aqui?”

O grid estático atual 3×2 deverá evoluir para algo **interativo e em cascata**.

Direção:

- revelar itens em sequência por scroll/viewport e/ou interação;
- evitar mostrar todos como um grid rígido equivalente;
- preservar os textos atuais;
- fazer a composição parecer mais orgânica sem virar um conjunto de bolhas independentes.

Esse ponto já havia sido alinhado entre Bruno e Matheus.

---

## 8. Cases

### Comportamento a preservar

O clique que abre o descritivo do case com **problema / solução / valor** deve continuar.

### Evolução visual desejada

Referência conceitual descrita como **“cardápio Netflix”**:

- card limpo por padrão;
- maior foco visual na imagem;
- hover/toque dá destaque, expande ou revela informação;
- suporte equivalente em touch;
- informação não deve virar uma camada visual poluída sobre a imagem;
- quando houver múltiplas imagens de um case, existe interesse em alternância/galeria.

A implementação deve ser adaptada à estética existente, evitando reconstruir toda a seção de uma vez.

### Cases que devem permanecer / ser adicionados nesta fase

Remover temporariamente do portfólio os cases diferentes dos apresentados nesta conversa. A seleção atual é:

1. **Media Portal — Reposicionamento digital**
2. **Ame Digital × MindMiners**
3. **Ame Digital × X (Twitter)**
4. **Corning CALA Channel Summit**
5. **AMWC Brazil 2024**
6. **Ame Digital — Tom de Voz**
7. **Gipsyy — Friday do Futuro**

### Removido

- **IstoÉ Dinheiro** — remoção solicitada pelo Bruno.

### Cases técnicos do Matheus

Genma / NOG / VisionOne / FloraServiços foram citados como possibilidades, mas **não estão definidos para publicação ainda**. Não incluir até a seleção e materiais serem confirmados.

---

## 9. Materiais dos cases recebidos

Fonte principal enviada pelo Bruno:

- `cases bruno site .pptx`

O PPT registra:

- Ame Digital × MindMiners — link: `https://mindminers.com/blog/como-a-mindminers-ajudou-a-ame-digital-a-se-tornar-mais-data-driven/`
- Ame Digital × X — link: `https://marketing.x.com/pt/success-stories/ame-usou-o-twitter-para-se-conectar`
- Corning CALA Channel Summit — sem link externo;
- AMWC Brasil 2024;
- Ame Digital — Tom de Voz;
- Gipsyy — link: `https://futuro.gipsyy.com.br/`;
- IstoÉ Dinheiro — remover.

### Arquivos de imagem entregues separadamente na conversa

- `corning cala summit.jpeg`
- `amedigitallarge.jpg.twimg.1920(1).jpeg`
- `amedigitallarge.jpg.twimg.1920.jpeg`
- `amwc.jpeg`
- `amwc .jpeg`
- `ame digital 2.jpeg`
- `ame digital - tom de voz .jpeg`

Observação: os dois arquivos `amedigitallarge...` aparentam representar o mesmo material/variação e devem ser conferidos antes da organização final dos assets.

O material de Media Portal já estava em posse do Matheus segundo o briefing.

---

## 10. “O que entregamos”

A versão atual em duas colunas/lista estática deve futuramente ficar mais viva e orgânica.

### O que NÃO fazer

Não implementar os quatro grupos como blobs/bolhas flutuantes independentes. Essa tentativa foi explicitamente rejeitada.

### Próxima direção

Partindo da estrutura existente, testar pequenas evoluções, por exemplo:

- conexões discretas entre os dois lados da oferta;
- trilhas ou linhas de fluxo entre marca → marketing → tecnologia → operação;
- bordas e recortes menos rígidos;
- entrada sequencial por scroll;
- hierarquia mais editorial sem mudar o conteúdo.

A decisão final deve vir de uma alteração pontual/protótipo sobre o site existente, não de um redesenho completo da página.

---

## 11. “Como trabalhamos”

Etapas atuais a preservar:

1. Diagnóstico
2. Escopo
3. Construção
4. Entrega

Direção visual sugerida e ainda válida:

- caminho único conectando as quatro etapas;
- percurso cromático ocre → azul;
- linha podendo ser desenhada progressivamente ao entrar na viewport;
- nós podendo ganhar uma animação discreta;
- composição mais orgânica que uma lista pura.

Novamente: aplicar de forma leve sobre a estrutura existente, sem transformar a seção em uma grande ilustração carregada.

---

## 12. Contato

O layout atual foi **aprovado para ser mantido**:

- formulário;
- WhatsApp;
- e-mail;
- QR code para uso físico.

### Nota sobre o funcionamento

Um documento recebido posteriormente afirmou que o formulário seria “só simulação”, porém o estado atual do repositório registra leads no Supabase e abre o WhatsApp. Portanto, considerar o repositório como referência técnica atual e **não substituir a integração sem validação**.

O QR e os canais devem ser revisados apenas quando o domínio Casa Martech estiver confirmado.

---

## 13. Interação e acessibilidade

Diretrizes registradas:

- scroll reveal sutil;
- nav com possibilidade de scrollspy;
- cards de cases responsivos a hover e touch;
- `prefers-reduced-motion` deve desligar animações;
- interações devem servir à leitura, não apenas decorar;
- manter boa experiência em mobile e telas grandes.

---

## 14. Explorações visuais geradas durante a conversa

Foram produzidos mockups para discutir a direção Casa Martech. Eles ajudaram a validar algumas ideias (ocre + azul, casa/circuito, cards de cases, percurso ocre → azul), mas **não devem ser copiados integralmente**.

Feedback acumulado:

1. primeira exploração: interessante como direção conceitual, mas radical demais em relação ao site atual;
2. seção de serviços com formas arredondadas: rejeitada — “ficou meio perdido tipo bolha de sabão”;
3. exploração seguinte: corrigiu parte da organização, porém o conjunto completo ainda ficou **muito carregado**;
4. decisão atual: **voltar ao site existente e melhorar por pequenas etapas**.

Capturas usadas na conversa para registrar esse feedback:

- `F3C5F93E-E470-4743-AA2C-E6D073ACE2D9.png` — feedback sobre as “bolhas”;
- `E6519E3E-20A8-4382-8BB7-0296E09CEA7B.jpeg` — conceito considerado carregado e usado apenas como referência do que evitar/copiar seletivamente.

---

## 15. Estratégia de implementação daqui em diante

### Princípio

**Evolution, not replacement.**

Cada rodada deve modificar uma região pequena do site, permitindo comparar antes/depois sem perder o que já funciona.

### Ordem sugerida para as próximas rodadas

1. **Marca básica** — Casa Martech + tagline + proof strip, sem alterar layout macro.
2. **A dupla** — foto pequena do Matheus + remoção da citação; aguardar foto do Bruno.
3. **Cases** — limpar seleção e inserir materiais aprovados mantendo inicialmente a estrutura atual.
4. **Cases / interação** — depois, evoluir comportamento para o padrão “Netflix” de maneira isolada.
5. **Problemas** — experimentar cascata mantendo a mesma copy.
6. **O que entregamos** — testar UMA alternativa orgânica no componente atual, sem blobs.
7. **Como trabalhamos** — caminho discreto ocre → azul.
8. **Hero** — somente depois, avaliar integração sutil da casa ao circuito existente.
9. **Polimento global** — arredondamentos/curvas, motion, espaçamento e consistência.

Essa ordem é deliberadamente conservadora para evitar outro salto visual grande demais.

---

## 16. Rodada 3 — implementada

Cobriu os itens 4 a 9 da ordem sugerida na seção 15. Nenhum texto do site mudou;
tudo é comportamento, ritmo e desenho, seção por seção, em commits separados.

| Seção | O que entrou |
|---|---|
| Casos | Card limpo em repouso no desktop (imagem + título); métrica, régua e “Ver detalhes” acendem no hover e no foco. A capa inteira abre e fecha o caso, que é o gesto do toque. Onde não há mouse — ou ainda não há foto — tudo fica sempre à vista. |
| Casos / galeria | Cada foto é um `<img class="case__shot">` dentro de `.case__shots`. Com duas ou mais, a faixa já é carrossel por scroll-snap **sem script**; o script só acrescenta marcadores, foco e setas do teclado. Nenhum caso tem duas imagens ainda. |
| Casos / vazio | Sem foto, a capa é uma prancha de desenho (malha de 1px) em vez de retângulo vazio. |
| Diagnóstico | Os seis sintomas descem em cascata (degrau de 34px e 68px em três colunas; alternado em duas; lista simples no telefone), cada um pendurado numa régua de 1px. Índice ocre nos problemas de marca (01, 03, 06) e azul nos de sistema (02, 04, 05) — alternados. Entrada escalonada em 90ms. |
| Entregas | As duas frentes penduram num trilho único, ocre numa ponta e azul na outra, com quatro nós. Título dos itens em serif, régua que para antes da borda, entrada sequencial. |
| Processo | As quatro etapas num percurso vertical ocre → azul, com nó por etapa e halo no hover. |
| Hero | Cinco âncoras no circuito sugerem um contorno de casa, em tracejado de linha de construção, participando da mesma física das partículas. Só acima de 1080×620, onde há coluna livre ao lado do título. |
| Polimento | Último caso órfão abre a linha inteira; “outros projetos” volta a três colunas (eram quatro para três cards); container a 1280px acima de 1600px; impressão cobre os elementos novos. |

### Decisões de forma que valem registrar

- **Sem degradê 01→06 no diagnóstico.** Um degradê afirmaria uma progressão que
  o conteúdo não tem. A alternância ocre/azul é verdadeira e diz mais.
- **Sem rótulos “marca → marketing → tecnologia → operação”** no trilho das
  entregas: seriam texto novo. O trilho contínuo entrega a mesma ideia sem
  inventar copy.
- **Nada some sem JavaScript.** Trilhos, cascata e detalhes dos casos nascem
  prontos; o esconderijo depende da classe `js-reveal`, que só existe com
  IntersectionObserver e sem `prefers-reduced-motion`.
- **O hero é reversível numa linha:** `HOUSE = false`.

## 17. Rodada 4 — implementada

Limpeza da identidade antiga, cartões de compartilhamento e uma suavização
controlada da geometria. Nenhum texto do site mudou.

| Frente | O que entrou |
|---|---|
| Favicon | O `&` de Amaral & Silva sai. Entra a mesma casa que o circuito do hero sugere, em traço: telhado ocre, paredes azuis, sem texto, viva a 16px. |
| Schema | O JSON-LD anunciava +55-11-96904-1800 (número antigo do Matheus) enquanto a tela mostra o WhatsApp do Bruno. Os dois passam a dizer 99977-3471, no site e no gerador do `/en`. |
| QR | O `alt` e o `aria-label` dos dois SVGs soletravam "amaralesilva.vercel.app". Passam a nomear o site da CASA MARTECH; o endereço que o código carrega não muda. |
| Open Graph | `og.png` e `og-en.png` eram Amaral & Silva com uma tagline que não existe mais ("Sistemas que sustentam"). Refeitos com o nome e a tagline aprovada, e agora **gerados** por `scripts/build-og.mjs`. |
| Geometria | Três tokens de raio. Arredondam cards, grades, formulário, campos, botões, ficha, chips, moldura e QR. **Não** arredondam trilhos, nós, réguas de seção nem o desenho do hero. Entraram em 10/8/6 e subiram para **18px superfícies, 14px controles, 10px etiquetas** depois que o Matheus pediu mais organicidade; o teto é o controle e não o card — acima disso botão e campo viram pílula. |
| Campos | O campo sublinhado não tem canto para arredondar: virou caixa de borda hairline sobre fundo quase preto. |
| Casos × projetos | A separação continua (conteúdo diferente, peso diferente), mas os três projetos menores passam a usar a mesma prancha de desenho e a mesma régua ocre dos casos. O caminho para promover um deles a caso completo está documentado no HTML. |
| Hero | As duas águas do telhado passam a ser ocre e o resto do contorno segue azul — a casa fala a dualidade do site. Encolheu e subiu, para folgar do ledger entre 1100 e 1920px. `HOUSE = false` continua desligando. |

### Resíduos de "amaralesilva" mantidos de propósito

- **URLs** — canonical, hreflang, Open Graph, Twitter, JSON-LD, sitemap, robots,
  QR e os dois geradores. É onde o site está publicado; domínio não se inventa.
- **Tabelas `amaralesilva_*`** do Supabase — renomear exige migração.
- **Bruno Amaral e Matheus Silva** — nomes das pessoas, não da marca. Aparecem
  no `meta author`, nos cards da dupla, no `member` do Schema e na citação do
  case da MindMiners, que é conteúdo aprovado.

## 18. Pendências

- [ ] confirmar domínio próprio da Casa Martech — hoje o site responde em
      `casamartech.vercel.app` (rodada 5). Quando houver domínio de verdade, os
      lugares que mudam são: canonical e hreflang, Open Graph e Twitter, o
      JSON-LD, o objeto META do script, `sitemap.xml`, `robots.txt`, a constante
      `SITE` de `build-og.mjs` e `build-qr.py`, e a lista de Redirect URLs do
      Supabase Auth;
- [ ] confirmar e-mail oficial;
- [ ] receber foto definitiva do Bruno;
- [ ] decidir quais cases técnicos do Matheus entram;
- [ ] receber/selecionar imagens dos cases técnicos do Matheus;
- [ ] avaliar outras marcas do Matheus para a proof strip;
- [ ] **incorporar os arquivos de imagem dos cases** — a arquitetura está pronta
      (`/img/casos/mediaportal|mindminers|ame-x|corning.jpg`,
      `/img/projetos/amwc|ame-tom-de-voz|gipsyy.jpg`, uma ou várias por caso);
      falta só salvar os arquivos recebidos com esses nomes. Conferir antes se
      os dois `amedigitallarge...` são o mesmo material;
- [ ] validar o contorno de casa no hero — está no ar, mas sai com uma linha;
- [x] prototipar uma alternativa leve para “O que entregamos”, sem bolhas;
- [x] prototipar cascata de problemas;
- [x] implementar caminho discreto em “Como trabalhamos”.

---

## 19. Regra para futuras rodadas

Sempre que houver novo feedback:

1. registrar primeiro neste handoff;
2. separar **definido**, **aprovado/manter**, **em avaliação** e **pendente**;
3. não transformar mockup em requisito sem aprovação explícita;
4. preservar textos existentes salvo mudança documentada;
5. preferir mudanças pequenas e reversíveis;
6. só depois alterar a implementação correspondente.
