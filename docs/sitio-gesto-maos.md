# Página 13: gesto de mãos dadas

A sobreposição de duas figuras independentes deixava o braço da avó passar atrás do corpo de Maria Elisa. A cena agora usa uma ilustração conjunta: mãos unidas e visíveis no espaço entre as duas, acima da linha dos quadris; a outra mão da avó repousa sobre o próprio peito. Ambas se olham e mantêm os pés na mesma linha de chão. Maria continua segurando a pedra com a mão livre.

`maos-unidas.png` contém as nove combinações dos traços da avó e da menina, com avó definida pelas linhas e Maria pelas colunas. `handhold-atlas.js` guarda os recortes; `BookCharacters.handhold` escolhe a combinação das seleções individuais. A troca se aplica apenas à página 13.

## Arte e prompt

Ferramenta integrada de geração de imagens. Referências: `olhares-vovo.png`, `maria-acoes-pedra.png` e a captura enviada. Prompt: desenhar avó e menina juntas, em nove pares de corpo inteiro, mãos ligadas no espaço aberto entre os corpos, em altura próxima ao peito da criança, antebraços visíveis pela frente, sem sobreposição dos troncos. Outra mão da avó no próprio peito e mão livre da menina segurando pequena pedra vermelha com coração. Preservar identidades, roupas e olhares recíprocos. Grade 3×3 dos traços aprovados; fundo transparente, sem texto ou sombras. Original copiado sem edição de pixels para `previa/sitio-encantado-v1/assets/maos-unidas.png`.

## Verificação

`node scripts/check-sitio-guache.cjs`: 315 combinações, texto intacto, arquivos e recortes válidos, nove combinações do gesto conjunto e apoio em 658,5 unidades. Revisão visual das nove combinações em Chromium. A 390 px, escolhas individuais corretas e sem overflow nas nove combinações; 21 folhas de impressão com botão habilitado após carregar as imagens. Capturas em `docs/verification/sitio-gesto-maos/`. Safari e impressão física não testados.
