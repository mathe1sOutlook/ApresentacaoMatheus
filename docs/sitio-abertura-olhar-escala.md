# Abertura: escala da casa e atenção da Noeli

A captura enviada correspondia à produção do PR #102, commit `f20230a`: o vaso havia sido reduzido, mas o fundo ainda mostrava a porta e os degraus muito grandes. O perfil de Noeli tinha o olhar horizontal, sem contato claro com Maria Elisa.

A página 1 usa agora um cenário próprio e um quadro aberto. A casa fica no plano intermediário, com telhado, porta inteira e degrau baixo visíveis; a família ocupa o terreiro em primeiro plano. Noeli recebeu a pose `departure-listen`, com inclinação da cabeça, pupilas para baixo e à esquerda e mão estendida para a filha. Essa pose aparece apenas na abertura; a seleção de frente/perfil/ação e a cena do carro continuam usando seus próprios desenhos. As sardas permanecem.

## Artes

Ferramenta integrada de geração de imagens, com os arquivos aprovados como referências. Originais copiados sem edição de pixels:

- `previa/sitio-encantado-v1/assets/varanda-saida-v3.png`: fundo independente, referência `cenarios-a-v2.png`. Prompt: guache quente de uma casa rural brasileira, vista aberta à altura humana, porta normal inteira, telhado visível, degrau de 12 cm, pequeno vaso, grande área livre de terreiro; arquitetura ao fundo menor que adultos no primeiro plano, sem pessoas nem objetos de viagem.
- `previa/sitio-encantado-v1/assets/noeli-atenta.png`: três figuras em uma linha, referência `noeli-sardas.png`. Prompt: preservar identidade, sardas, cabelo acobreado, blusa vinho e jeans nos três estilos aprovados; pose de atenção à criança à esquerda, cabeça inclinada 20 graus para baixo, pupilas voltadas para o rosto infantil abaixo, sorriso acolhedor e mão estendida; corpo inteiro e fundo transparente.

`opening-atlases.js` define os recortes. `environments.js` usa o cenário independente apenas na página 1 e pré-carrega a nova arte. As URLs dos scripts alterados receberam nova versão.

## Verificação

315 combinações no `node scripts/check-sitio-guache.cjs`, texto intacto, nova pose por página, arquivos e recortes válidos. Revisão visual em Chromium dos três traços; a 390 px, a abertura não apresenta overflow e as três escolhas mantêm a pose correta. Composição de impressão com 21 folhas e imagens carregadas. Evidências em `docs/verification/sitio-abertura/`. Safari e impressão física não testados.
