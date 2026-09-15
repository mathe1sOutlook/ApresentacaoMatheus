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

## 16. Pendências

- [ ] confirmar domínio Casa Martech;
- [ ] confirmar e-mail oficial;
- [ ] receber foto definitiva do Bruno;
- [ ] decidir quais cases técnicos do Matheus entram;
- [ ] receber/selecionar imagens dos cases técnicos do Matheus;
- [ ] avaliar outras marcas do Matheus para a proof strip;
- [ ] conferir e organizar os arquivos de imagem recebidos em paths definitivos do repositório quando a implementação começar;
- [ ] prototipar uma alternativa leve para “O que entregamos”, sem bolhas;
- [ ] prototipar cascata de problemas;
- [ ] implementar caminho discreto em “Como trabalhamos”;
- [ ] validar motivo casa+circuito antes de mexer no hero.

---

## 17. Regra para futuras rodadas

Sempre que houver novo feedback:

1. registrar primeiro neste handoff;
2. separar **definido**, **aprovado/manter**, **em avaliação** e **pendente**;
3. não transformar mockup em requisito sem aprovação explícita;
4. preservar textos existentes salvo mudança documentada;
5. preferir mudanças pequenas e reversíveis;
6. só depois alterar a implementação correspondente.
