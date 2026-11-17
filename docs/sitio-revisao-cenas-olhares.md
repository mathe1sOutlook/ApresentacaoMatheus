# Revisão das cenas: escala, olhares e estatura

Revisão da capa e das vinte páginas, comparando cenário, apoio dos pés, objetos, animais, direção do rosto e foco da ação com o texto. Foram mantidos os três traços aprovados e a seleção individual por personagem.

Carlos recebeu uma diferença visual de estatura de aproximadamente 5 cm em relação a Noeli. A razão de referência é 175/170, cerca de 2,94%, sem presumir a altura real das pessoas. A figura cresce a partir dos pés, preservando a linha de apoio e as proporções. A galeria ganhou espaço acima da cabeça para evitar corte.

## Conferência por página

| Página | Foco da ação e resultado da revisão |
| --- | --- |
| Capa | Apresentação frontal dos personagens ao leitor; casa ao longe e objetos no primeiro plano preservados. |
| 1 | Noeli acompanha a filha; Carlos acompanha a família e fica discretamente mais alto. Casa e degrau em escala já corrigida. |
| 2 | Carlos olha a estrada; ocupantes sentados acompanham a viagem. Volante, mãos, cintos e janelas conferidos. |
| 3 | Abraço com olhos fechados por afeto; piso e plantas atrás da dupla coerentes com o plano próximo. |
| 4 | Menina e avó acompanham a borboleta entre elas. Folha dourada pertence à ação mágica; plantas próximas e distantes permanecem em planos diferentes. |
| 5 | Ambas investigam a caixinha no chão. Quadro ampliado para mostrar a avó agachada inteira. |
| 6 | Nova avó surpresa com olhar dirigido para baixo, para a caixa que espirra. |
| 7 | Menina e avó olham para Pipoca de cabeça para baixo; caixa permanece menor no chão. |
| 8 | Reverência e gargalhada; olhos fechados são parte da expressão. Apoio dos personagens mantido. |
| 9 | Avó agora inclina o rosto para a conversa entre Pipoca e a menina, sem olhar para o alto. Quadro ampliado lateralmente. |
| 10 | Menina e Pipoca acompanham a pedra que emerge junto ao chão; pedra pequena e flor proporcionais preservadas. |
| 11 | Menina olha para a pedra nas mãos; avó se inclina para observá-la. Quadro inclui a avó inteira. |
| 12 | Substituído o plano com pedra gigante e personagens pequenos por uma conversa no jardim: pedra nas mãos da menina, Pipoca aponta e olha para ela. Novo chão visível e proporção contínua com a página anterior. |
| 13 | Avó olha para baixo e estende a mão para a menina; menina observa a pedra. Quadro aberto lateralmente. |
| 14 | Menina acompanha as vacas cantando; vacas e porquinhos mantêm os portes e a profundidade já corrigidos. Cerca e celeiro conferidos. |
| 15 | Pipoca agora lê olhando para o pergaminho; avó se inclina para acompanhá-lo, menina pensa olhando para a roda. |
| 16 | Menina volta-se à avó; gargalhada afetuosa da avó e salto de Pipoca preservados. |
| 17 | Menina ri de olhos abertos acompanhando Pipoca no alto; avó aponta para ele. Novo fundo mantém céu e nuvem acima, com chão sob as duas. Quadro inclui os pés. |
| 18 | Menina olha para Pipoca perto da janela; ele cochila. Cama, criado-mudo e pedra conferidos. |
| 19 | Despedida sorridente e bocejo; olhos fechados são compatíveis com a expressão e o sono. |
| 20 | Personagens dormem enquanto o foco é a pedra pequena no criado-mudo; ausência de reação acompanha o texto. |

## Artes e prompts

Ferramenta integrada de geração de imagens. Novos PNGs copiados sem edição de pixels para `previa/sitio-encantado-v1/assets/`. `gaze-atlases.js` guarda os recortes e a associação das poses aos traços. Os originais anteriores permanecem disponíveis.

- `olhares-vovo.png`: referência `narrativa-vovo.png`; grade 3×3, linhas com os três traços, colunas com escuta inclinada, surpresa voltada para uma caixa no chão e mão oferecida à criança. Preservar identidade, cabelo grisalho, blusa xadrez rosa e saia vinho; pupilas para baixo e à direita, corpo inteiro e transparência.
- `olhares-maria.png`: referência `narrativa-maria.png`; grade 2×3. Riso sentado com olhos abertos para cima e à direita; em pé com olhar para as mãos em concha. Preservar cachos, pele caramelo, camiseta pêssego, shorts e tênis. Sem pedra na imagem, pois ela é acrescentada pelo renderizador. Corpo inteiro e transparência.
- `olhares-pipoca.png`: referência `narrativa-pipoca.png`; grade 2×3. Apontar para cima com olhos abertos acompanhando o alvo; ler com olhos no pergaminho seguro pelas duas patas. Manter pelúcia rosê tricotada, crina e chifre rosa, sorriso. Edição posterior removeu pedras e estrelas extras para deixar somente os seis sprites transparentes.
- `jardim-estrelas-v2.png`: referência ao painel de reflexos mágicos de `cenarios-c.png`; fundo independente em 5:4, guache quente e iluminação suave, jardim em escala humana e chão gramado contínuo na metade inferior, sem pessoas ou objetos mágicos.
- `celebracao-terreiro-v2.png`: referência ao painel de céu de `cenarios-c.png`; fundo independente em 5:4, céu amplo e nuvens, horizonte por volta de 70% da altura e chão contínuo nos 30% inferiores, livre para apoiar avó e menina. Sem personagens.

## Validação

- `node scripts/check-sitio-guache.cjs`: 315 combinações de páginas, modelos e traços; texto e paginação intactos, poses corretas, arquivos/recortes válidos, seleção individual, carro e proporção da estatura com apoio dos pés preservado.
- Revisão visual das 21 páginas em Chromium e comparação dos três traços nas cenas de estrelas, pergaminho e salto. Capturas finais em `docs/verification/sitio-revisao-olhares/`.
- No navegador a 390 px: 63 combinações, sem overflow; composição de impressão com 21 folhas e impressão habilitada após carregar as artes.
- Safari e impressão física não testados.
