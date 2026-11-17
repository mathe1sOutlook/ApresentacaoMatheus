# Sítio Encantado: cenários e enquadramentos

O pedido foi variar os cenários conforme a ação e dar perspectiva aos animais. Os fundos que repetiam a mesma casa e as mesmas árvores foram substituídos por dezoito ambientes pintados em guache. A continuidade do sítio permanece, com recantos e pontos de vista próprios: varanda, estrada, canteiro, raízes, clareira, pomar, terreiro e céu da celebração. O texto, a paginação e as escolhas de personagens foram preservados.

`environments.js` define a câmera de cada página. A chegada se aproxima do abraço; a investigação fica junto ao chão; a surpresa abre o quadro; a pedra recebe um plano de detalhe; e o salto de Pipoca é visto de baixo. No quarto, o espaço permanece contínuo, mas o enquadramento passa da conversa na cama ao detalhe da pedra na mesa de cabeceira. Todos os recortes mantêm a proporção 5:4 e ficam dentro da ilustração, sem faixas vazias.

As vacas e os porquinhos agora são ilustrações em três quartos, com volume no focinho e no corpo, patas próximas e distantes, sombreamento de forma e oclusão natural. `animals.js` os ancora pelas patas e acrescenta sombra de contato. No terreiro, o desenho é montado pela distância do chão: os animais distantes entram primeiro, depois os próximos e Maria Elisa em primeiro plano. O mensageiro leva o pergaminho nas patas. Os porquinhos da roda do enigma são vistos de costas em três quartos, olhando para a história.

## Artes e prompts

As imagens foram geradas com a ferramenta integrada de geração de imagens. Os originais foram copiados para `previa/sitio-encantado-v1/assets/`; o código faz os enquadramentos em SVG, sem editar os pixels das artes.

- `cenarios-a.png`: seis ambientes, por ordem da capa à página 5: vista do sítio, saída de casa, estrada rural, varanda da avó, canteiro na altura da criança e recanto de raízes.
- `cenarios-b.png`: páginas 6–11: outro lado do recanto, clareira vista para a copa, borda do campo, conversa na grama do pomar, flor entre raízes e pomar iluminado.
- `cenarios-c.png`: páginas 12–17: reflexos da magia, caminho iluminado, terreiro em perspectiva, roda do enigma, campo de margaridas e céu visto de baixo.
- `animais-perspectiva.png`: três vacas (pastando, cantando e caminhando em três quartos) e seis porquinhos (mensageiro, curioso, brincando, audiência de costas, sentado e farejando).

Direção comum dos prompts: guache com textura, luz suave, planos sobrepostos, perspectiva de uma criança, vegetação de espécies variadas, continuidade de uma fazenda brasileira e áreas livres para acrescentar os personagens. Os fundos não contêm pessoas, animais, unicórnio, caixa ou pedra. Cada ambiente tem ângulo próprio; a casa inteira aparece apenas na vista de apresentação. Animais em fundo transparente, com anatomia arredondada, focinho com planos visíveis, patas que se sobrepõem e luz no corpo, sem aparência de ícone plano ou plástico 3D. Os enquadramentos dos arquivos ficam em `environment-atlases.js`.

## Verificação

`node scripts/check-sitio-guache.cjs` verifica as 315 combinações de traço, modelo e página, a integridade do texto, as poses anteriores, os dezoito ambientes, as vinte e uma câmeras, arquivos/recortes válidos, a proporção dos enquadramentos e os cinco animais do terreiro. A verificação anterior do carro e da seleção individual continua ativa. Capturas em `docs/verification/sitio-cenarios/` registram os vinte cenários e os animais na página. A composição de impressão é verificada no HTML; impressão física e Safari não foram testados.

Não há mudança de autenticação, permissões, banco ou endereço da prévia.
