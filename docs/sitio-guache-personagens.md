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

Verificação: `node scripts/check-sitio-guache.cjs` confirma texto/paginação, seleção, recortes, assets e 315 renderizações (3 traços × 5 modelos × 21 folhas). Chromium: seleção individual, aplicar a todos, reset, persistência, envio simulado sem gravar no banco e montagem das 21 folhas. Conferido em 375, 768 e 1280 px, sem transbordamento da página. Incluída arte adicional de Maria Elisa adormecida nos três traços para as cenas noturnas. A impressão foi conferida na composição do HTML; não foi validada em papel nem em Safari.
