# Sola Cosmetics — proposta HTML e demonstrações

Revisão de 23/10/2026. Material local em elaboração, sem publicação. Substitui o primeiro desenho com kits fixos.

## Arquivos e direção

A pasta `proposta-sola-cosmetics-K7mQ4vNp9xT2rLc8/` contém `index.html`, `proposta.css`, `proposta.js` e fotografias públicas da Sola em `assets/`. A apresentação é estática, sem framework ou nova dependência. React, Next.js e PostgreSQL são as tecnologias propostas para a futura loja.

A narrativa foi encurtada: contexto, escopo, experiências, operação/tecnologia, implantação, investimento e próximos passos. A área exclusiva e personalizada do cliente integra o escopo da loja. CRM e sistema de avaliações com notas, comentários e fotos estão incluídos no mesmo investimento.

Na revisão de copy de 23/10, os títulos em fragmentos paralelos e as frases-resumo de seção saíram, assim como a numeração dos chapéus. O escopo virou uma tabela que diz quem usa cada parte (cliente ou equipe) e em qual demonstração ela aparece. A implantação virou uma lista de etapas em que cada uma mostra a aprovação que a libera. Fatos e valores não mudaram.

## Carrossel

Seis possibilidades visualmente distintas, com seleção manual, setas e navegação por teclado (esquerda/direita, Home/End). Sem reprodução automática. Sem JavaScript, todas ficam visíveis; na impressão, as seis aparecem.

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

Hospedagem, banco, domínio, serviços fiscais, tarifas de pagamento e frete são custos de operação separados. Suporte, manutenção, prazo, condições de entrega e escopo definitivo precisam ser alinhados em contrato. CRM e avaliações integram o preço da loja, conforme confirmação de Matheus. Custos de armazenamento das fotos fazem parte da infraestrutura, separados do parcelamento do projeto.

Não se afirma que Elementor impossibilita recursos equivalentes: o diferencial apresentado é o desenho próprio dos fluxos, das regras e dos dados, sem atribuir limitações absolutas ao editor.

## Rota e isolamento

Rewrite específico em `vercel.json`, recursos com caminhos reais. Prefixo de proposta bloqueado em robots.txt, metatag e cabeçalho noindex, fora do sitemap. A URL aleatória não constitui autenticação. Nenhum link para outras páginas internas.

## Validação

`scripts/check-sola-proposal.cjs` testa os seis conceitos em 360, 390, 768, 1024, 1440 e 1920 pixels, sem estouro lateral. Cobre quantidade acima de seis, sacola modal, regras de desconto/presente/frete, recompra, movimentação de lead, teclas do carrossel, Escape e retorno de foco, restauração e remoção. Confere também investimento e ausência de preço antecipado.

Conteúdo sem JavaScript e exibição dos seis conceitos na impressão são conferidos. Evidências em `docs/sola-validacao/`. Paginação do PDF, Safari e aparelho físico não foram validados.


## Cena com profundidade e rolagem

O arquivo experiencias.js controla a composição visual e o formulário de avaliações. A cena usa a fotografia recortada por CSS, perspectiva, rotações e elementos em planos distintos; não é um modelo volumétrico WebGL. O produto e os detalhes mudam de posição com a rolagem normal, sem capturar ou bloquear o gesto. IntersectionObserver e requestAnimationFrame limitam o trabalho à cena visível, sem loop contínuo.

Com movimento reduzido ou JavaScript desligado, a cena vira uma composição estática e não reserva o percurso longo de rolagem. Na impressão, também é estática.

O formulário demonstrativo aceita uma imagem JPEG, PNG ou WebP de até 5 MB, com object URL local e descarte da URL ao trocar a foto. Arquivos inválidos são rejeitados. O formulário usa textContent para mostrar o comentário e não faz upload, login, persistência ou publicação. A loja final prevê avaliação associada ao acesso do cliente e moderação no painel.

A validação cobre mudança da transformação com a rolagem, troca da preferência de movimento, nota/comentário/foto, rejeição de arquivo incompatível e as seis prévias nas seis larguras.
