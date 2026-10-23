# Sola Cosmetics — pesquisa e base para proposta comercial

Pesquisa realizada em 23 de outubro de 2026. Documento interno de trabalho; não é uma proposta enviada nem um orçamento aprovado.

Atualização do direcionamento: Matheus confirmou uma área exclusiva e personalizada do cliente, CRM e avaliações com notas, comentários e fotos incluídos no investimento e React junto a Next.js e PostgreSQL. A proposta HTML em curso apresenta seis conceitos interativos e uma cena com profundidade e movimento na rolagem e quantidade livre. As condições comerciais mais recentes estão na seção 10 e em `sola-cosmetics-proposta-handoff.md`.

## 1. Direcionamento confirmado por Matheus

A cliente vende um único produto e procura uma operação prática, com o menor custo recorrente viável. O projeto pretendido é uma loja própria em **Next.js, com PostgreSQL**, integrações por API, Mercado Pago, Melhor Envio e emissão de nota fiscal de produto. **Não haverá integração com ChatGPT ou outra IA nesta etapa**, conforme esclarecimento de Matheus.

O site atual usa **Elementor**, informação confirmada por Matheus a partir da conversa com a cliente e compatível com os sinais públicos encontrados. A Hostinger foi informada como fornecedora atual, mas o plano e as condições contratadas não foram inspecionados.

O objetivo comercial é mostrar como uma experiência personalizada e regras editáveis podem facilitar a compra de mais unidades, preservando uma rotina simples para a dona da marca. Ganhos de conversão e faturamento são hipóteses a medir, não resultados garantidos.

A primeira mensagem terminou em “mas também dizer que”. Esse complemento ainda não foi informado; não foi presumido neste documento.

## 2. O negócio e o posicionamento público

A Sola Cosmetics apresenta um hidratante para os pés em embalagem de 100 g. A comunicação associa o produto a maciez, conforto e cuidado contínuo de áreas ressecadas. A fórmula é apresentada pela marca com ureia, ácido salicílico e centella asiática. Essas são informações comerciais do site, não uma avaliação independente de eficácia.

A história da marca vincula a criação do produto à experiência pessoal de uma engenheira química formada na USP. A página usa demonstrações de antes e depois, depoimentos, perguntas frequentes e uma seção sobre a origem da marca como apoio à decisão de compra. [Site oficial](https://solacosmetics.com.br/).

A identidade observada combina fundo claro, azul/lilás, fotografia do produto e logotipo serifado. A nova experiência pode preservar esses elementos e aprimorar hierarquia, legibilidade e interação no celular.

Ter um único produto permite concentrar a experiência na escolha da quantidade, na economia por unidade e na clareza do frete. Não é necessário simular um catálogo extenso. O aumento do pedido pode vir de kits, reposição e compra para compartilhar ou presentear, desde que essas ofertas façam sentido para a cliente.

## 3. Site atual: o que foi observado

Foram consultadas a página inicial e a página pública do produto no navegador, além do conteúdo público retornado pela pesquisa. Não houve acesso administrativo, compra, pagamento ou auditoria completa de desempenho e segurança.

### Estrutura existente

- A página inicial apresenta o benefício principal, prova social, ingredientes, kits, depoimentos, história da marca e dúvidas frequentes.
- A página do produto também permite escolher entre uma unidade e kits de duas ou três unidades.
- Existem links para conta, pedidos, privacidade e trocas/devoluções.
- Foi exibido um convite de newsletter com oferta de cupom. Portanto, captação de e-mail já existe e não deve ser apresentada como novidade absoluta.
- O conteúdo público contém referências a WordPress, WooCommerce e Elementor. Não foram verificadas as versões, licenças, integrações ativas ou a forma como o estoque dos kits é controlado.

### Detalhes que exigem cuidado no diagnóstico

**Contadores:** a leitura automatizada inicial retornou zeros, mas, no navegador, os contadores carregaram e exibiram os números da marca. Não há evidência suficiente para anunciar um defeito visível ao cliente. Também não foram auditadas as pesquisas que sustentam esses números.

**Preços zerados:** trechos com valores zerados apareceram na extração textual, mas não no texto acessível renderizado da oferta individual. Isso precisa de investigação antes de virar crítica comercial.

**Carrinho:** os links públicos dos kits incluem `clear-cart=true`. O nome do parâmetro sugere uma intenção de substituir o carrinho ao escolher um kit, mas seu efeito não foi validado. É um ponto a testar porque pode afetar a proposta de adicionar mais unidades. Não tratar essa hipótese como bug confirmado.

**Jornada entre canais:** a bio do Instagram leva à página do produto, que já apresenta os kits. Existe uma base de continuidade entre os canais; a proposta deve aperfeiçoá-la.

**Checkout, frete e nota:** não foi confirmado quais serviços já funcionam hoje. A ausência de verificação não significa ausência de recurso.

### Como falar sobre Elementor e Hostinger

Evitar afirmações como “a Hostinger só permite layouts pobres” ou “Elementor não integra pagamentos e frete”. Hospedagem e editor são camadas distintas, e WordPress/WooCommerce permitem extensões e desenvolvimento personalizado. A própria Hostinger distingue o seu construtor de sites da hospedagem de WordPress. [Documentação da Hostinger](https://www.hostinger.com/br/support/6618476-qual-a-diferenca-entre-o-criador-de-sites-da-hostinger-e-outros-sistemas-de-gestao-de-conteudo-sgc-ou-cms/).

O argumento defensável é que a nova solução será desenhada em torno das regras comerciais da Sola, com interface, fluxo e administração próprios. As limitações específicas da implementação atual precisam ser confirmadas no painel e na conversa com a cliente.

## 4. Instagram: aprendizado público

O perfil [@solacosmeticsbrasil](https://www.instagram.com/solacosmeticsbrasil/) estava acessível publicamente no navegador. O acesso automatizado pelo buscador falhou, mas foi possível observar o perfil e a grade pública sem login.

Na data da consulta, o perfil exibia **9.420 seguidores**, **605 seguindo** e selo de verificação. Esses números são uma fotografia da consulta, não uma medida de audiência compradora ou prova de vendas.

A bio destaca maciez e conforto e direciona ao site oficial. Os destaques visíveis são **Depoimentos**, **Antes/Depois** e **Vocês**. A grade consultada combina apresentação pessoal, produto, rotina de autocuidado, carrosséis e vídeos. Não foi feita leitura completa das legendas ou de todos os destaques, nem houve acesso a alcance, engajamento ou métricas privadas.

O link da bio já contém parâmetros de campanha: `utm_source=instagram`, `utm_medium=bio` e `utm_campaign=link_perfil`. Preservar essa identificação na nova jornada e verificar se os eventos de compra permitem acompanhar sua contribuição.

Oportunidades propostas: reaproveitar depoimentos autorizados, manter a identidade entre anúncio/perfil e página de chegada, e levar a visitante à seleção de kits com pouca fricção. O selo do Instagram não comprova as alegações técnicas do produto.

## 5. O que a nova experiência deve permitir

Os itens abaixo são **escopo sugerido para negociação**, não recursos já implementados ou integrações homologadas.

| Situação de compra | Comportamento proposto | Controle da cliente |
|---|---|---|
| Visitante quer experimentar | Escolher uma unidade com preço e frete claros | Preço, disponibilidade e conteúdo |
| Visitante considera mais unidades | Comparar kits e economia por unidade | Quantidades e preços de cada kit |
| Carrinho pode receber mais uma unidade | Mostrar uma oferta pertinente, com total atualizado | Condição, benefício e período da oferta |
| Campanha tem cupom | Validar elegibilidade e explicar o desconto | Código, validade, limites e acumulação |
| Compra se aproxima de um benefício | Mostrar quanto falta, quando a regra se aplicar | Valor mínimo, regiões e condições de frete |
| Campanha terminou | Encerrar a condição sem editar código | Ativação e agendamento |

“Inteligente” significa aplicar regras consistentes e contexto do carrinho. Não exige IA. A oferta deve informar a mudança de preço e depender da escolha do comprador; nenhum item deve ser acrescentado silenciosamente.

O painel deve oferecer campos e opções compreensíveis para as regras contratadas. “Altamente personalizado” não significa que qualquer regra futura poderá ser criada sem desenvolvimento adicional.

Definir precedência: cupom acumula com kit? O benefício de frete usa subtotal antes ou depois do desconto? Uma promoção expirada continua válida em um carrinho antigo? Essas decisões devem ser explícitas e calculadas no servidor.

## 6. Estrutura técnica pretendida

**Next.js** para a experiência de compra e as rotas de servidor; **PostgreSQL** para os dados comerciais; integrações externas para pagamento, logística e emissão fiscal. A escolha do provedor de hospedagem e banco ainda depende de orçamento e requisitos. Não há decisão de contratação de Vercel, Supabase ou outro fornecedor.

O banco deve guardar produtos, composição dos kits, estoque, regras, cupons, pedidos, itens, estados de pagamento, referências fiscais e de envio, além dos registros necessários para acompanhar alterações. Evitar duplicar dados que pertencem ao processador de pagamento.

Um único produto físico pode ser vendido em diferentes kits. A baixa de estoque precisa consumir a quantidade real de embalagens: o kit com três unidades reduz três unidades do mesmo estoque. Definir uma única fonte de verdade e como ela será conciliada com eventual sistema fiscal/ERP.

### Integrações propostas

**Mercado Pago:** criar pagamentos e acompanhar mudanças de estado pelo servidor, validando notificações e conciliando o pedido com o provedor. Formas de pagamento e parcelamento dependem da conta e da modalidade escolhida. A documentação oficial já oferece integração com WooCommerce, reforçando que o diferencial comercial não é simplesmente disponibilizar pagamento. [Mercado Pago Developers](https://www.mercadopago.com.br/developers/pt/docs/woocommerce/payments-configuration/checkout-api/cards).

**Melhor Envio:** cotar frete com CEP, origem, peso e dimensões corretos; registrar serviço escolhido; apoiar compra de etiqueta e rastreio. O serviço informa que não cobra mensalidade nem exige mínimo de envios: há custo de frete por uso. Frete grátis ao consumidor continua sendo uma despesa da loja. [Informações oficiais](https://lp.melhorenvio.com.br/woocommerce/).

Em Next.js será necessária uma integração própria com a API ou um conector compatível. O plugin de WooCommerce não atende diretamente à nova aplicação. A documentação do plugin foi usada como referência da operação existente possível, não como prova de integração pronta em Next.js. [Documentação do Melhor Envio](https://docs.melhorenvio.com.br/docs/woocommerce).

**NF-e:** escolher um emissor com API compatível com a operação da empresa. Confirmar com a contabilidade cadastro, certificado, credenciamento e parâmetros aplicáveis antes de fechar o escopo. Não prometer um emissor próprio nem integrar diretamente à SEFAZ sem avaliar o custo e a responsabilidade envolvidos.

O Bling é uma referência possível para comparação, não uma escolha aprovada: documenta importação de pedidos de WooCommerce para posterior geração de nota, mas a aplicação em Next.js exigiria verificar sua API, plano e fluxo específicos. [Pedidos no Bling](https://ajuda.bling.com.br/hc/pt-br/articles/360046686313-Pedidos-de-venda-do-WooCommerce), [planos oficiais](https://www.bling.com.br/planos-e-precos).

### Segurança e continuidade incluídas no desenho

- Autenticação administrativa, permissões e proteção das sessões.
- Credenciais exclusivamente no servidor e conexão protegida com banco e serviços.
- Validação de preço, estoque, cupons e frete no servidor, sem confiar no total enviado pelo navegador.
- Tratamento idempotente de notificações e tarefas para impedir cobranças, notas ou etiquetas duplicadas.
- Estados separados para pagamento, autorização fiscal e expedição; uma etapa não deve indicar sucesso da outra sem confirmação.
- Registro de falhas, novas tentativas controladas e fila visível de pendências para a operadora.
- Backups, teste de restauração, atualizações e coleta mínima de dados pessoais.

Esses requisitos reduzem riscos; não representam garantia de invulnerabilidade. Pagamento, emissão fiscal e etiqueta podem falhar de forma independente e precisam de tratamento operacional.

## 7. Operação diária e validação

Fluxo pretendido: cliente escolhe quantidade → recebe cotação de frete → conclui pagamento → confirmação atualiza pedido → emissão fiscal segue a regra acordada → operador confere a expedição → etiqueta e rastreio acompanham o pedido.

Definir quem gera a etiqueta e em qual sistema, evitando compra duplicada pelo emissor/ERP e pela loja. A emissão de nota pode começar com conferência humana e avançar para automação quando o cadastro e o fluxo estiverem validados. O ato físico de separar, embalar e postar continua necessário.

Antes de entregar, validar compra no celular, pagamentos aprovados e recusados, eventos duplicados, cupons incompatíveis, mudança de kit, estoque insuficiente, indisponibilidade de frete, falha fiscal e recuperação de pendências. Usar ambientes de teste dos provedores quando disponíveis e combinar qualquer validação real que gere despesa ou documento fiscal.

## 8. Escopo enxuto para manter o custo sob controle

A primeira entrega sugerida concentra página de venda, produto e kits, carrinho, checkout, painel para as regras acordadas e as três frentes de integração. Incluir treinamento e definição de quem cuida da manutenção.

Evitar, nesta etapa, assinatura recorrente, programa complexo de pontos, aplicativo móvel, múltiplos depósitos, chatbot e serviços separados sem necessidade. Uma aplicação com banco gerenciado pode simplificar a operação, desde que os limites e o custo do plano sejam suficientes.

As regras básicas de cupom já existem no WooCommerce, conforme sua documentação. Portanto, a proposta precisa demonstrar o ganho concreto da experiência própria, da administração reunida e das regras específicas da Sola. [Documentação de cupons](https://woocommerce.com/document/coupon-management/).

## 9. Base de mensagem comercial

> A proposta é criar uma loja feita para a forma como a Sola vende: um produto, diferentes quantidades e ofertas que ajudam a cliente a escolher. A marca poderá ajustar os preços, os kits e as condições de campanha pelo painel, dentro das regras definidas no projeto. Pagamento, frete e emissão fiscal serão conectados para reduzir o retrabalho entre a venda e a expedição.
>
> A experiência será desenvolvida em Next.js com PostgreSQL, com identidade própria e liberdade para evoluir. Para manter a operação acessível, começaremos pelo que participa diretamente da venda e do envio. Os serviços externos e a manutenção terão seus custos apresentados de forma separada.

Na proposta final, mostrar uma sequência concreta de compra e uma tela de configuração de promoção será mais convincente do que apenas listar tecnologias. Qualquer demonstração futura com números hipotéticos deve ser identificada como ilustrativa.

## 10. Investimento e custos: base para orçamento

Matheus definiu uma opção de investimento: entrada de R$ 800,00 e saldo de R$ 2.800,00 em até 12 parcelas mensais, com quantidade de parcelas de 1 a 12 escolhida pela cliente, total de R$ 3.600,00. Durante o parcelamento, a cliente utiliza a solução entregue, e a titularidade do código desenvolvido permanece com Matheus Silva. Após a quitação integral, código e titularidade serão transferidos à Sola conforme contrato, respeitadas as licenças de terceiros. CRM e avaliações com notas, comentários e fotos estão incluídos nesse valor, conforme a atualização de Matheus. Custos operacionais, suporte e manutenção são separados do parcelamento; prazo e condições de entrega ainda precisam ser alinhados. Não anunciar “custo zero” ou aumento garantido de vendas.

### Referência comercial observada

Preços exibidos no site na consulta, sujeitos a mudança; não são valores do projeto:

| Oferta atual | Total | Valor por unidade informado | Economia informada |
|---|---:|---:|---:|
| Uma unidade | R$ 89,90 | — | — |
| Kit com duas | R$ 164,90 | R$ 82,45 | R$ 14,90 |
| Kit com três | R$ 239,90 | R$ 79,97 | R$ 29,80 |

Fonte: [página do produto](https://solacosmetics.com.br/loja/creme-hidratante-pes-macios-100g-sola/). Os kits já oferecem desconto progressivo. A proposta deve vender sua evolução, não sua criação do zero.

### Composição a levantar

| Custo | Natureza | O que confirmar |
|---|---|---|
| Desenvolvimento e migração | Implantação | Escopo, dados a preservar e homologação |
| Aplicação, PostgreSQL e backups | Recorrente/por consumo | Plano, limites, renovação e crescimento |
| Domínio | Renovação periódica | Titularidade e vencimento |
| Emissor fiscal e certificado aplicável | Plano, renovação ou uso | Compatibilidade, franquia e condições |
| Mercado Pago | Por transação | Método, recebimento e parcelamento |
| Melhor Envio | Por envio | Origem, embalagem, destino e serviço |
| E-mail transacional e monitoramento | Plano ou consumo | Volume e limites |
| Manutenção e suporte | Contrato a definir | Atualizações, falhas e alterações incluídas |

Custo mensal a estimar = serviços fixos + consumo de infraestrutura + tarifas de pagamento + fretes assumidos pela loja + suporte contratado. Planos gratuitos podem ajudar no início, mas não devem sustentar uma promessa permanente sem custo.

Comparar o custo total atual com o proposto, incluindo o tempo gasto em tarefas manuais. Não é possível concluir que Next.js será a opção mais barata sem essa conta. O requisito de tecnologia foi definido por Matheus; a viabilidade econômica ainda será demonstrada.

## 11. Próximos passos para fechar a proposta

Levantar com a cliente: custo atual e orçamento mensal aceitável; pedidos por mês e picos; serviços já contratados; conta Mercado Pago; operação fiscal atual; origem de postagem; peso e dimensões de cada kit; margem disponível para descontos e frete; responsáveis por atendimento e expedição.

Auditar os acessos e ativos antes de planejar a troca: domínio, hospedagem, WordPress, pedidos, clientes, estoque, consentimentos, imagens e direitos de uso de depoimentos. Preservar URLs úteis e parâmetros de campanha, planejar redirecionamentos e evitar perda de pedidos durante a transição.

Com esses dados, fechar as regras editáveis, selecionar os fornecedores, estimar os custos recorrentes e apresentar prazo e investimento. Organizar a proposta em contexto → solução → escopo → demonstração → prazo → investimento → próximos passos.

Medir depois da implantação: conclusão de checkout, unidades por pedido, participação dos kits, margem após descontos/frete e tempo de preparação. Comparar com uma referência anterior; crescimento de ticket isolado não comprova ganho de lucro.

## Fontes e limites

Os links ao longo do documento são as fontes consultadas. Site, página de produto e perfil do Instagram foram observados publicamente em 23/10/2026. As integrações foram pesquisadas em documentação dos próprios fornecedores; nenhuma foi configurada ou testada nesta pesquisa.

Não houve acesso aos painéis da cliente, contratos, métricas privadas, documentação técnica do produto ou configuração fiscal. Observações públicas, informações fornecidas por Matheus e recomendações foram distinguidas no texto. Este documento prepara o diagnóstico e a proposta; não comprova uma migração concluída ou orçamento fechado.
