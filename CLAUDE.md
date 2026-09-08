# CLAUDE.md — Amaral & Silva

Regras para quem trabalha neste repositório. Em conflito entre este arquivo e
um hábito genérico, **este arquivo vence**.

## O projeto

Site institucional da dupla **Bruno Amaral** (marca e estratégia) e **Matheus
Silva** (tecnologia e dados), em <https://amaralesilva.vercel.app>. HTML
estático servido direto pela Vercel, sem build e sem dependências. A estrutura
de pastas e as decisões técnicas estão no `README.md` — leia-o antes de mexer.

Dentro dele vivem também as **propostas comerciais** enviadas a clientes
(`proposta-*/index.html`), cada uma numa rota privada, e o **painel interno**
da dupla (`admin/`), que é o CRM onde essas propostas são acompanhadas.

## Propostas comerciais

### 1. O preço fica no fim. Sempre.

**Nenhum valor em reais aparece antes da seção de investimento**, e a seção de
investimento é a última antes dos próximos passos. Nem na capa, nem numa linha
de abertura, nem num resumo executivo, nem no índice do topo antes da hora.

Quem lê precisa chegar ao preço já sabendo o que está comprando. Preço no
começo transforma o resto do documento em justificativa de um número que o
leitor já julgou — e ele julga o número sozinho, sem o contexto que faria o
valor parecer justo.

A ordem que funciona: contexto → o que se propõe → escopo → como fica na tela →
prazo → **investimento** → próximos passos.

Isso vale para proposta comercial. Contrato é outro documento: lá o valor entra
onde a cláusula pede.

### 2. Nada com cara de texto gerado por IA

O cliente percebe, e um documento que parece gerado desvaloriza o trabalho que
ele descreve. O que denuncia, e não entra:

- **Grade de N cartões com rótulos paralelos de uma palavra** — "O que é" /
  "Por que agora" / "Quanto custa" / "O que acontece depois". É o pior ofensor.
  Cartão serve para informação que é mesmo uma lista (as sete frentes de um
  escopo, as três fases de um cronograma), não para prosa fatiada em quatro.
- "Não é X. É Y." e suas primas.
- Fragmento de frase para dar ênfase: "Falta o sistema.", "O diagnóstico está
  feito."
- Travessão como conector principal de toda frase.
- Tudo em trios, com simetria perfeita.
- Toda seção com a mesma forma: chapéu + título + frase-resumo + N itens iguais.
- Frase que anuncia o que o texto vai fazer: "O essencial para decidir. O
  detalhamento vem depois."

Escreva como um sócio escreve para um cliente que ele conhece: parágrafos de
tamanhos diferentes, uma ideia por vez, sem métrica uniforme. Prosa onde é
prosa; lista só onde a informação é mesmo uma lista.

### 3. Não inventar

Nenhum número, prazo, entrega, garantia, integração ou promessa que não esteja
no material de origem. Número que aparece dentro de um mockup de tela é
ilustrativo e a página tem de dizer isso por extenso, na própria seção.

### 4. Rota privada

Cada proposta fica numa pasta `proposta-<cliente>-<sufixo aleatório>/`, servida
por um rewrite em `vercel.json`. O prefixo `proposta-` já é bloqueado no
`robots.txt` e recebe `X-Robots-Tag: noindex` pelo `vercel.json`; a página
também leva `<meta name="robots" content="noindex,nofollow,noarchive">` e fica
fora do `sitemap.xml`.

**A página não pode linkar para nada interno** — nem para o site, nem para
`/admin`, nem para outra proposta. Quem recebe o endereço vê aquela proposta e
mais nada.

### 5. A página tem de funcionar sem JavaScript

Conteúdo escondido por padrão e revelado por script deixa a proposta em branco
para quem tem JS desligado por política da empresa ou abre o link dentro do
navegador de um cliente de e-mail. Animação de entrada é bem-vinda, mas o
esconderijo depende de uma classe que o próprio script põe em `<html>`: sem
script, nada some.

### 6. Impressão importa

Boa parte dos clientes salva a proposta em PDF. Toda proposta tem botão
"Salvar em PDF" e um `@media print` que a deixa legível em papel — inclusive
mantendo o tema escuro quando é ele que dá identidade ao documento
(`print-color-adjust: exact` no `html` **e** no `body`; só no `body` deixa as
margens brancas).

## Painel interno (`admin/`)

Ver a seção "Admin" do `README.md` para o desenho geral e o backend. Duas
convenções que não estão lá:

- **Preços do projeto**: `price_proposed` é o valor cheio (o parcelado, quando
  há parcelamento) e é o número que o funil mostra; `price_cash` é a condição à
  vista; `installments_count` diz em quantas vezes o parcelado é oferecido — o
  valor da parcela é **derivado na tela, nunca gravado**. `price_final` é o que
  foi fechado, e é ele que registra qual das duas condições venceu.
- **Parcela oferecida ≠ parcela real**: `installments_count` é uma condição da
  proposta, que pode nunca ser aceita. As parcelas reais do que já fechou vivem
  em `amaralesilva_payments` e alimentam o Financeiro. Nunca criar linhas lá a
  partir de uma proposta ainda não aceita.

## Material de trabalho

`docs/` guarda briefing, especificação e material de apoio — o que orienta o
trabalho mas não é o site. Está no `.vercelignore`: **nada em `docs/` vai ao
ar**. Documento que descreve uma proposta, um cliente ou um valor não pode
ficar numa pasta servida pela Vercel.

- `docs/briefing-telas-crm.md` — especificação das três telas do CRM da Media
  Portal: sistema visual, inventário dos controles, o que mudar em cada tela e
  a tabela de números que amarra as três. É o anexo do prompt do Claude Design.
- `docs/handoff-telas-crm.md` — o handoff que o Claude Design devolveu, já
  implementado: layout, tokens dos dois temas, conteúdo exato de cada tela e as
  regras de dados que os números precisam respeitar.

## Convenções gerais

- Português do Brasil, no site e nesta documentação.
- Sem etapa de build, sem framework, sem dependência nova. É HTML estático.
- Ao editar o `index.html` do site, rodar `node scripts/build-en.mjs` e
  versionar o `en/index.html` junto (ver "Idiomas" no `README.md`).
- Toda mudança de schema entra em `admin/schema.sql` **e** é aplicada no
  Supabase — os dois sempre em sincronia.
