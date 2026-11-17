# Apoio da avó, ações de Maria e carro em perspectiva

As capturas mostravam três problemas ainda presentes: a avó da página 7 terminava cerca de 50 unidades acima do chão da menina, Maria repetia a pose de contemplar a pedra nas páginas 11–13 e o carro de perfil cruzava visualmente uma estrada em profundidade.

## Composição

- Página 7: avó reposicionada, com os pés a 658 unidades, contra 657,5 da menina. O enquadramento mantém a aparição de Pipoca no alto e a caixa no chão.
- Página 11: Maria recebe e observa a pedra; essa pose permanece exclusiva desse momento entre as três páginas.
- Página 12: Maria senta de pernas cruzadas, pergunta a Pipoca e indica a pedra apoiada junto ao colo. Pipoca se volta para a conversa. Quadro mais próximo para acompanhar a nova postura sentada.
- Página 13: Maria vira o rosto para a avó e estende uma mão, segurando a pedra com a outra. A avó fica na mesma linha de chão; o cenário é recortado para a área de grama, retirando as samambaias de baixo dos pés.
- Página 2: nova estrada com curva e marcas de pneus em direção diagonal; nova carroceria pintada em três quartos dianteiros, com frente próxima e traseira recuada, seguindo essa direção. Ocupantes vistos em três quartos, projetados nos vidros correspondentes; volante, cintos, assento infantil e seleção individual dos três estilos preservados. Sombras acompanham o apoio das rodas. Flores decorativas que ficavam sobre a estrada foram retiradas.

O rosto mais jovem de Carlos, as sardas de Noeli e a diferença discreta de estatura dos pais permanecem.

## Artes e prompts

Ferramenta integrada de geração de imagens, PNGs originais copiados sem edição de pixels para `previa/sitio-encantado-v1/assets/`. Recortes e associações em `action-atlases.js`; composição do veículo em `car-scene.js`.

- `maria-acoes-pedra.png`: referência `olhares-maria.png`, seis figuras em grade 2×3. Linhas com os três traços aprovados. Colunas: sentada perguntando à direita e indicando o colo; em pé olhando para cima à esquerda e oferecendo uma mão à avó. Preservar identidade, cachos, roupa e tênis. Mãos livres para acrescentar a mesma pedra vetorial em posições próprias de cada pose; transparência real, sem sombras ou objetos extras.
- `familia-carro-perspectiva.png`: referências Carlos, Noeli e Maria aprovados. Grade 3×3 com Noeli, Maria e Carlos nas colunas e os três traços nas linhas. Bustos sentados em três quartos, voltados à frente esquerda; cintos e arnês infantil, mãos de Carlos para o volante. Preservar rosto jovem, óculos, sardas e identidade.
- `carro-perspectiva.png`: carro compacto coral em guache, dianteira voltada para baixo à esquerda, traseira menor e recuada à direita, capô, grade e lateral visíveis, rodas em perspectiva, grandes vidros verde-sálvia vazios para compor os ocupantes. Fundo transparente; sem marca nem texto.
- `estrada-perspectiva.png`: fundo independente 5:4 de campo brasileiro, estrada larga entrando embaixo à esquerda e curvando para o alto à direita, marcas de pneus e cercas na mesma perspectiva, morros, palmeiras e eucaliptos. Sem pessoas ou veículos.

## Verificação

`node scripts/check-sitio-guache.cjs`: 315 combinações, texto e paginação intactos, recortes válidos, poses distintas nas três páginas, alinhamento dos pés nas páginas 7 e 13, carro em três quartos, volante e estilos independentes. Revisão visual das páginas 2, 7 e 11–13 nos três traços. No navegador a 390 px, quinze combinações sem overflow; seleção mista dos ocupantes conferida e 21 folhas de impressão prontas após carregar as artes. Capturas em `docs/verification/sitio-acoes-carro/`. Safari e impressão física não testados.
