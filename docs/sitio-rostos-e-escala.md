# Sítio Encantado: rostos e proporções

Carlos Eduardo recebeu rosto mais jovem, linhas de expressão suaves e barba predominantemente escura, preservando óculos, formato mais fino e identidade da referência. Noeli recebeu sardas no nariz e nas bochechas. Ambos têm frente, perfil e ação nos três traços; a arte dos ocupantes do carro também foi atualizada.

## Revisão das cenas

- Abertura: vaso e planta menores junto ao degrau, com tamanho compatível com as pessoas.
- Descoberta da caixa: caixinha fechada e aberta menores, mantendo o apoio no chão.
- Descoberta da pedra: pedra e flor menores; a pedra mantém a escala usada nas mãos e no criado-mudo. O plano mágico de detalhe da página 12 continua ampliado por intenção narrativa.
- Terreiro: vacas e porquinhos maiores, posicionados em profundidade e ordenados pelo contato com o chão. A vaca próxima tem altura visual comparável à menina; a distante é menor pela perspectiva.
- Roda do enigma e amizade: porquinhos acompanham a nova proporção, preservando a leitura dos gestos humanos.
- Quarto: pedra menor e apoiada no tampo, inclusive na última página.

`scene-scale.js` concentra tamanhos e posições. Os desenhos originais ficam preservados; `parent-atlases.js` e `environment-atlases.js` definem recortes SVG das novas artes.

## Geração das artes

Ferramenta integrada de geração de imagens, com as fotografias e artes aprovadas como referências. Os PNGs originais foram copiados sem edição de pixels para `assets/`.

- `carlos-jovem.png`: nove figuras, três vistas por estilo. Direção: rosto de adulto mais jovem, aproximadamente 35–40 anos, menos linhas e poucos fios grisalhos, identidade e rosto fino preservados, camisa amarela, jeans e óculos, fundo transparente.
- `noeli-sardas.png`: nove figuras na mesma organização. Direção: preservar identidade, cabelo acobreado, blusa vinho e jeans; acrescentar sardas naturais no nariz e parte alta das bochechas em todas as vistas, fundo transparente.
- `familia-no-carro-v2.png`: edição do atlas sentado. Direção: aplicar apenas as correções faciais, preservando cintos, mãos, posturas e a menina.
- `cenarios-a-v2.png`: edição dos seis fundos. Direção: no painel superior central, vaso de aproximadamente 25 cm e planta de até 45 cm junto ao degrau; preservar a composição dos demais ambientes.

## Validação

`node scripts/check-sitio-guache.cjs`: 315 combinações de páginas, modelos e traços, texto intacto, recortes, poses, volante, seleção individual, ambientes e proporções. Revisão visual das 21 páginas, três traços dos pais, troca dos traços no carro e 21 folhas na composição de impressão. Chromium a 390 px sem overflow nas páginas 1, 2, 14, 20 e na seleção de personagens. Capturas em `docs/verification/sitio-rostos-escala/`. Impressão física e Safari não testados.
