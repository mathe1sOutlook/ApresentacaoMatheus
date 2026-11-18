# Óculos da vovó, papai e ajustes enviados nas capturas

Aplicados os dois pedidos escritos e os comentários nas capturas de Noeli: óculos para a vovó, nome do pai como “papai”, retirada da casinha vista pela janela e carro da família como Voyage branco com cadeirinha atrás do passageiro.

## Personagens e texto

A vovó recebeu óculos de armação fina castanha e lentes claras nas três opções de traço, nas vistas da seleção, nas dezoito poses narrativas, nas nove poses de atenção e nos desenhos conjuntos de abraço e mãos dadas. As lentes acompanham a inclinação do rosto e mantêm os olhos visíveis. As artes dos pares foram limpas com a ferramenta de imagem para remover fundos residuais; os PNGs originais gerados permanecem preservados.

“O papai Carlos Eduardo” virou “o papai” na abertura. Nome e legendas de apresentação passaram a “Papai”, mantendo o identificador interno `carlos` para preservar as escolhas já salvas. As quebras de linha foram recalculadas com a fonte LivroSans carregada no navegador e gravadas nos cinco modelos. A contagem da primeira página passou de 66 para 64 palavras. Um teste restaura somente o nome e as duas palavras da contagem e verifica o hash do capítulo anterior, confirmando que os demais textos e a paginação permanecem intactos.

## Carro e quarto

O carro agora é uma ilustração de Voyage branco, de quatro portas e com porta-malas separado. A câmera mostra o lado do passageiro: Noeli aparece no banco dianteiro desse lado, Maria está no vidro traseiro correspondente, e papai ocupa o lado do motorista com volante visível. A estrada e os ocupantes acompanham a direção do carro para a direita. Mantidas as escolhas individuais de traço, os cintos e o arnês infantil.

A pequena casa foi retirada do cenário vetorial compartilhado pelas páginas 18–20, deixando apenas a paisagem rural além da janela.

## Artes e prompts

Ferramenta integrada de geração de imagens, com as artes aprovadas como referência. PNGs finais copiados sem edição de pixels para `previa/sitio-encantado-v1/assets/`; recortes em `vovo-oculos-atlases.js`.

- `vovo-selecao-oculos.png`: grade 3×3, linhas com os três traços e colunas frente/perfil/gesto, todas em pé, óculos ovais castanhos discretos e olhos visíveis. Preservar cabelo grisalho, roupa e identidade humana.
- `narrativa-vovo-oculos.png`: editar apenas os óculos nas dezoito figuras do atlas original, mantendo poses e grade 6×3.
- `olhares-vovo-oculos.png`: óculos nas nove figuras de atenção, surpresa e mão oferecida, preservando a direção do olhar.
- `abraco-vovo-oculos.png` e `maos-unidas-oculos.png`: óculos somente na avó das nove combinações de cada desenho conjunto; preservar criança e gesto. Segunda edição remove todo fundo, halo e sombra fora das figuras para transparência real.
- `voyage-branco.png`: sedã Voyage branco em guache, quatro portas, porta-malas separado, frente para baixo à direita, vista pelo lado do passageiro. Vidros verde-sálvia vazios para compor os ocupantes e fundo transparente; sem texto nem ano de modelo especificado.

## Validação

`node scripts/check-sitio-guache.cjs`: 315 combinações, hash do texto atualizado e preservação do restante do capítulo, texto diagramado sincronizado, seleção individual, recortes válidos, novos óculos nos atlases e cadeirinha atrás do passageiro. Revisão visual da capa e vinte páginas. No navegador: 63 combinações a 390 px sem overflow, texto com papai, 21 folhas prontas para impressão; medição das linhas do novo parágrafo e limites verticais nos cinco modelos. Capturas em `docs/verification/sitio-vovo-oculos-papai/`. Safari e impressão física não testados.
