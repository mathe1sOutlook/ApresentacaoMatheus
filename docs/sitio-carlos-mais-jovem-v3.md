# Carlos: rejuvenescimento mais evidente

O novo pedido indica que a primeira redução de idade ainda deixava Carlos com aparência mais velha. A revisão retira o grisalho das laterais e da barba, reduz a densidade da barba e suaviza marcas sob os olhos, testa e bochechas. A direção visual é a de um adulto jovem, aproximadamente 29–32 anos, sem atribuir essa idade à pessoa real. Preservam-se rosto mais fino, óculos, identidade da foto, roupa, poses e a diferença de estatura de cerca de 5 cm para Noeli.

## Artes

Ferramenta integrada de geração de imagens, com a fotografia original usada apenas como referência de identidade. Originais copiados sem edição de pixels para `previa/sitio-encantado-v1/assets/`:

- `carlos-mais-jovem-v3.png`: edição do atlas de nove figuras. Prompt: rejuvenescer visivelmente todas as vistas nos três traços; cabelo curto cacheado escuro sem grisalho, barba curta escura mais leve, pele com menos marcas, olhos atentos e menos sombras de idade. Preservar corpo, mãos, poses, roupa e organização da grade.
- `familia-carlos-jovem-v3.png`: edição da coluna de Carlos no atlas dos ocupantes. Prompt: aplicar os mesmos traços jovens, preservando postura sentada, mãos, cinto e direção do olhar. Somente os três recortes de Carlos dessa imagem são utilizados; Noeli e Maria continuam usando o arquivo anterior para preservar suas artes.

`carlos-atlases-v3.js` atualiza o atlas do personagem e define os recortes exclusivos do motorista. As URLs dos scripts alterados receberam nova versão.

## Verificação

`node scripts/check-sitio-guache.cjs`: 315 combinações, texto preservado, recortes e arquivos válidos, diferença de estatura e seleção individual; confirma novas artes de Carlos e arquivos anteriores para as outras ocupantes. Revisão visual dos três traços e das cenas de abertura e carro. A 390 px, seis combinações com a arte e a seleção corretas e sem overflow; 21 folhas de impressão prontas após o carregamento. Capturas em `docs/verification/sitio-carlos-jovem-v3/`. Safari e impressão física não testados.
