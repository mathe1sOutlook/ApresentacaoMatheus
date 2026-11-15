# Sítio Encantado: personagens em guache

Pedido: substituir as opções anteriores pelo guache e contorno aprovado, com o rosto do Carlos mais fino, e acrescentar duas interpretações mais infantis. Manter o texto integral e os cinco modelos de diagramação. A prévia existente continua sendo o endereço do Carlos.

As três opções são Guache e contorno, Guache suave e Guache brincante. Cada personagem tem frente, perfil verdadeiro e pose em três quartos de corpo inteiro. A seleção é individual e pode ser aplicada a toda a família. As cenas usam a mesma seleção, com orientação para seus parceiros; a capa mostra a família de frente.

Artes geradas com a ferramenta integrada de geração de imagens, tomando como referência o estudo 02 aprovado e as fotografias originais. As fotografias não são publicadas. As três artes transparentes ficam dentro da rota protegida da prévia. Os enquadramentos estão em character-atlases.js; o renderizador em guache-characters.js preserva a proporção dos desenhos. O texto e a diagramação continuam em SVG, enquanto os personagens são imagens raster.

Prompts: atlas transparente de corpo inteiro em cinco colunas (Carlos, Noeli, Maria Elisa, vovó e Pipoca) e três linhas (frente, perfil para a direita e ação em três quartos); preservar fisionomia, idade, tom de pele, cabelo, roupas e rosto mais fino do Carlos. Base: guache opaco e contorno firme com proporções naturais. Suave: contornos arredondados, cabeça cerca de 15% maior e expressão doce. Brincante: cabeça cerca de 25% maior, gestos mais expressivos, formas simplificadas e cores vivas. Adultos continuam adultos e a vovó mantém os sinais de idade.

A chave local sitio-personagens-guache-v1 separa as novas escolhas dos estudos anteriores. O envio usa os valores efetivamente exibidos. A impressão aguarda as artes carregarem. Não há alteração de banco, permissões ou acesso do cliente.

## Cena da viagem no carro

O recorte dos personagens em pé nas janelas foi substituído por poses próprias de ocupantes sentados. O carro tem duas filas de bancos, Maria Elisa no assento infantil traseiro, Noeli no banco dianteiro e Carlos dirigindo com as mãos no volante. A carroceria recebe caixas de roda, portas, frisos, retrovisor, faróis, painel e volante com aro, cubo e raios.

`assets/familia-no-carro.png` foi gerado com a ferramenta integrada de imagens a partir dos três conjuntos aprovados. Prompt: atlas transparente de três colunas (Noeli sentada com mãos no colo, Maria sentada com mãos no colo e Carlos com braços flexionados e mãos em posição de dirigir) por três linhas (guache, suave e brincante), todos de perfil para a direita, com cinto diagonal; preservar rostos, cabelos, roupas, idade e o rosto mais fino do Carlos. Mostrar cabeça, tronco e mãos até o colo, sem pernas, carro, bancos ou volante, pois esses elementos são desenhados no HTML. Cada ocupante continua respeitando sua escolha individual de traço. Os enquadramentos ficam em `character-atlases.js` e o carro em `car-scene.js`.

A verificação automatizada exige volante, painel, assento infantil, um motorista e dois passageiros sentados em todos os modelos. Inclui seleção mista de personagens, dimensões dos recortes e preservação do texto. Capturas da página e do carro nos três traços ficam em `docs/verification/sitio-guache/`.

## Poses e expressões conforme o acontecimento

O gesto genérico de caminhar apontando foi substituído por direção de personagens por página, em `scene-poses.js`. A chegada usa um abraço de verdade entre avó e menina. Maria alcança a borboleta com a palma aberta, ajoelha para investigar a caixa, recua assustada com o espirro, senta para rir, recebe a pedra nas mãos e pensa no enigma. A vovó aponta, agacha, se assusta, ri, explica ou observa conforme o texto. As duas páginas de gargalhadas mantêm a ação de rir, mas alternam a composição e a posição da menina e da Pipoca. Nas páginas noturnas, a menina pergunta, acena boa-noite e adormece.

Pipoca ganhou um sorriso visível na seleção, no retrato de perfil e nas cenas. Suas dez poses são frente sorrindo, perfil sorrindo, salto alegre, cambalhota de cabeça para baixo, reverência, leitura do pergaminho, sono, explicação, batida do casco e bocejo. O pergaminho da leitura está na própria pose, evitando duplicar esse objeto. A pedra é posicionada junto às mãos da menina quando ela a recebe; nas cenas de amizade e celebração ela flutua sem cobrir rostos.

Artes novas geradas com a ferramenta integrada de imagens, usando os três conjuntos aprovados como referência de identidade e estilo. Prompts: dezoito poses de Maria (seis gestos × três traços), dezoito da vovó, trinta de Pipoca (dez ações × três traços), nove combinações de traços para o abraço e seis retratos noturnos (pergunta e boa-noite × três traços). Pedidos de fundo transparente, desenhos isolados, silhuetas e emoções diferentes, fisionomia e roupas preservadas. Maria e o abraço passaram por remoção do fundo com a mesma ferramenta. PNGs em `assets/narrativa-*.png`; enquadramentos em `narrative-atlases.js`. Os arquivos originais gerados foram copiados para o projeto, sem editar pixels por código.

Verificação: os 315 casos agora exigem a pose narrativa de cada personagem em sua página, além dos testes anteriores. Inclui os nove enquadramentos de abraço por combinação de estilos, leitura do enigma, surpresa, arquivos e recortes válidos. Conferidos visualmente os vinte cenários, a seleção sorridente de Pipoca, mistura de traços, impressão de 21 folhas e larguras de 375, 768 e 1280 px. O texto e a paginação permanecem intactos.

Verificação: `node scripts/check-sitio-guache.cjs` confirma texto/paginação, seleção, recortes, assets e 315 renderizações (3 traços × 5 modelos × 21 folhas). Chromium: seleção individual, aplicar a todos, reset, persistência, envio simulado sem gravar no banco e montagem das 21 folhas. Conferido em 375, 768 e 1280 px, sem transbordamento da página. Incluída arte adicional de Maria Elisa adormecida nos três traços para as cenas noturnas. A impressão foi conferida na composição do HTML; não foi validada em papel nem em Safari.
