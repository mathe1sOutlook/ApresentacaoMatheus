# Sola Cosmetics — proposta HTML e demonstrações

Revisão de 23/10/2026. Material local em elaboração, sem publicação. Substitui o primeiro desenho com kits fixos.

## Arquivos e direção

A pasta `proposta-sola-cosmetics-K7mQ4vNp9xT2rLc8/` contém `index.html`, `proposta.css`, `proposta.js`, `experiencias.js` (avaliações), `bisnaga-3d.js` (cena 3D), o Three.js em `vendor/` e fotografias públicas da Sola em `assets/`. A apresentação é estática, sem framework nem etapa de build; a única dependência é o Three.js da cena 3D. React, Next.js e PostgreSQL são as tecnologias propostas para a futura loja.

A narrativa foi encurtada: contexto, escopo, experiências, operação/tecnologia, implantação, investimento e próximos passos. A área exclusiva e personalizada do cliente integra o escopo da loja. CRM e sistema de avaliações com notas, comentários e fotos estão incluídos no mesmo investimento.

Na revisão de copy de 23/10, os títulos em fragmentos paralelos e as frases-resumo de seção saíram, assim como a numeração dos chapéus. O escopo virou uma tabela que diz quem usa cada parte (cliente ou equipe) e em qual demonstração ela aparece. A implantação virou uma lista de etapas em que cada uma mostra a aprovação que a libera. Fatos e valores não mudaram.

## Carrossel

Seis possibilidades visualmente distintas, com seleção manual, setas e navegação por teclado (esquerda/direita, Home/End). A pedido de Matheus, as telas trocam sozinhas a cada 2 segundos, com uma barra na aba ativa marcando o tempo. A troca para de vez quando alguém clica, toca ou digita no carrossel, e um botão ao lado das setas pausa ou retoma. Ela também fica parada fora da tela, com a aba do navegador oculta, com a sacola aberta e com movimento reduzido. Na troca automática, o leitor de tela não anuncia cada mudança. Sem JavaScript, todas ficam visíveis; na impressão, as seis aparecem.

1. Vitrine editorial: seletor numérico de unidades, sem kits fixos e sem limite artificial de seis.
2. Sacola com incentivo: quantidade livre, progresso e condição compartilhados com a vitrine.
3. Campanhas: escolha entre desconto, presente e benefício de frete, com quantidade mínima editável; aplicar atualiza os outros exemplos.
4. Área exclusiva: histórico fictício e botão de recompra que adiciona quatro unidades à sacola.
5. CRM incluído: contatos fictícios, etapas de relacionamento e movimentação local de um lead.
6. Avaliações: nota de uma a cinco estrelas, comentário, foto local e prévia de moderação, sem publicação.

A sacola modal também permite digitar a quantidade, aumentar/diminuir, remover e retornar. Escape fecha e o foco volta à origem. Somente inteiros seguros e não negativos são aceitos; na vitrine, mínimo de uma unidade. Na sacola vazia, a quantidade pode ser zero pelo exemplo embutido. Restaurar no painel restaura a campanha, a quantidade selecionada e a sacola.

Nenhum dado é persistido ou enviado. Valores e condições de compra são ilustrativos. Os exemplos usam percentuais e quantidades, sem valores em reais antes do investimento. Preços, entrega e transação reais não são simulados como integração pronta.

## Condição comercial confirmada por Matheus

Opção única: entrada de R$ 800,00 e saldo de R$ 2.800,00 em até 12 parcelas mensais, com quantidade de parcelas de 1 a 12 escolhida pela cliente, total de R$ 3.600,00. A redação permite o uso da solução entregue durante o parcelamento e mantém a titularidade do código-fonte desenvolvido com Matheus Silva até a quitação. Após o pagamento integral, o código será entregue e a titularidade transferida à Sola, nos termos do contrato; componentes de terceiros mantêm suas licenças.

Hospedagem, banco, domínio, serviços fiscais, tarifas de pagamento e frete são custos de operação separados; a estimativa está na seção abaixo. Suporte, manutenção, prazo, condições de entrega e escopo definitivo precisam ser alinhados em contrato. CRM e avaliações integram o preço da loja, conforme confirmação de Matheus. Custos de armazenamento das fotos fazem parte da infraestrutura, separados do parcelamento do projeto.

Não se afirma que Elementor impossibilita recursos equivalentes: o diferencial apresentado é o desenho próprio dos fluxos, das regras e dos dados, sem atribuir limitações absolutas ao editor.

## Infraestrutura, nota fiscal e custos de operação

Pedido de Matheus em 23/10: citar Bling ou Focus NFe para a nota, dizer que o banco faz backup automático, apresentar a infraestrutura e estimar o custo mensal e anual.

A infraestrutura apresentada é Next.js na Vercel e PostgreSQL no Supabase, a mesma pilha da dupla. O backup automático diário com retenção de sete dias vem do plano Pro do Supabase; o plano gratuito não serve para isso, e o Hobby da Vercel é só para uso não comercial, por isso a estimativa usa os dois planos Pro.

A tabela fica dentro da seção de investimento, porque tem valores em reais (regra 1). Preços consultados nos sites oficiais em 23/10/2026, pagando mês a mês:

| Serviço | Preço de origem | Mensal | Anual |
|---|---|---:|---:|
| Vercel Pro | US$ 20/mês | R$ 104,00 | R$ 1.248,00 |
| Supabase Pro | US$ 25/mês | R$ 130,00 | R$ 1.560,00 |
| Bling Cobalto | R$ 60/mês, notas ilimitadas, até 200 pedidos por API | R$ 60,00 | R$ 720,00 |
| Focus NFe Solo | R$ 94,90/mês, 100 documentos, R$ 0,11 por adicional | R$ 94,90 | R$ 1.138,80 |
| Certificado A1 | faixa de mercado de R$ 165 a R$ 280 por ano | — | R$ 165 a R$ 280 |

Câmbio de R$ 5,20 por dólar, a mediana do boletim Focus para o fim de 2026; a cotação de 7/10/2026 estava perto de R$ 5,01. Totais: R$ 294,00 por mês e R$ 3.693 a R$ 3.808 por ano com Bling; R$ 328,90 por mês e R$ 4.112 a R$ 4.227 por ano com Focus NFe. Ficam de fora as tarifas do Mercado Pago, o frete do Melhor Envio e o domínio, que já é da Sola.

Fontes: [Bling](https://www.bling.com.br/planos-e-precos), [Focus NFe](https://focusnfe.com.br/precos/), [Supabase](https://supabase.com/pricing), [Vercel Pro](https://vercel.com/docs/plans/pro-plan), [certificado A1](https://www.omie.com.br/blog/quanto-custa-um-certificado-digital-e-onde-fazer/), [boletim Focus](https://www.canalrural.com.br/economia/focus-mantem-dolar-a-r-520-no-fim-de-2026-pela-quinta-semana).

## Rota e isolamento

Rewrite específico em `vercel.json`, recursos com caminhos reais. Prefixo de proposta bloqueado em robots.txt, metatag e cabeçalho noindex, fora do sitemap. A URL aleatória não constitui autenticação. Nenhum link para outras páginas internas.

## Validação

`scripts/check-sola-proposal.cjs` testa os seis conceitos em 360, 390, 768, 1024, 1440 e 1920 pixels, sem estouro lateral. Cobre quantidade acima de seis, sacola modal, regras de desconto/presente/frete, recompra, movimentação de lead, teclas do carrossel, Escape e retorno de foco, restauração e remoção. Confere também investimento e ausência de preço antecipado.

Conteúdo sem JavaScript e exibição dos seis conceitos na impressão são conferidos. Evidências em `docs/sola-validacao/`. Paginação do PDF, Safari e aparelho físico não foram validados.


## Bisnaga em 3D no contexto

Pedido de Matheus em 23/10: a bisnaga em 3D, com o creme saindo enquanto o texto rola ao lado. Substituiu a cena em CSS (foto recortada em perspectiva) e ocupa a seção de contexto: a bisnaga fica fixa à esquerda e os quatro blocos de texto passam à direita. No celular, a cena fica fixa no alto e o texto passa por baixo.

`bisnaga-3d.js` é um módulo que só importa o Three.js (r160, copiado em `vendor/`, com o `RoomEnvironment` para a iluminação) quando a seção se aproxima da tela. Matheus autorizou a dependência. Não há arquivo de modelo: o corpo é gerado com a largura medida na foto em cada altura e o perímetro constante, redondo junto à tampa e chato na solda. O rótulo da frente é a própria foto desenrolada sobre a frente da bisnaga, e o verso, que a foto não mostra, fica só com a cor da embalagem. A legenda da cena diz isso e chama a animação de ilustrativa.

A rolagem define o progresso: a bisnaga gira até mostrar o rótulo, a tampa desenrosca e se afasta, e o creme cresce ao longo de uma curva a partir do bico enquanto o corpo se achata um pouco. A cena só desenha quando a rolagem muda, com um amortecimento curto, e para quando chega ao alvo.

Sem JavaScript, sem WebGL, na impressão ou antes de o Three.js carregar, aparece a foto do produto. Com movimento reduzido, a cena fica parada no quadro final, com o creme já fora.

## Avaliações

O formulário demonstrativo aceita uma imagem JPEG, PNG ou WebP de até 5 MB, com object URL local e descarte da URL ao trocar a foto. Arquivos inválidos são rejeitados. O formulário usa textContent para mostrar o comentário e não faz upload, login, persistência ou publicação. A loja final prevê avaliação associada ao acesso do cliente e moderação no painel.

A validação cobre o progresso da bisnaga com a rolagem (creme em zero no início, parcial no meio e completo no fim), a troca da preferência de movimento, a foto no lugar do 3D sem JavaScript e na impressão, nota/comentário/foto, rejeição de arquivo incompatível e as seis prévias nas seis larguras.
