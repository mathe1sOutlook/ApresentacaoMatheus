/* Direção de personagens por página: o gesto acompanha o acontecimento do texto. */
(function () {
  'use strict';
  const pages = {
    0: { maria: 'front', vovo: 'front', pipoca: 'front' },
    1: { maria: 'action' },
    3: { maria: 'embrace', vovo: 'embrace' },
    4: { maria: 'reach', vovo: 'point' },
    5: { maria: 'kneel', vovo: 'crouch' },
    6: { maria: 'startled', vovo: 'startled' },
    7: { maria: 'reach', vovo: 'explain', pipoca: 'tumble' },
    8: { maria: 'laugh', vovo: 'laugh', pipoca: 'bow' },
    9: { maria: 'laugh', vovo: 'ponder', pipoca: 'explain' },
    10: { maria: 'kneel', pipoca: 'tap' },
    11: { maria: 'cradle', vovo: 'explain', pipoca: 'explain' },
    12: { maria: 'laugh', pipoca: 'bow' },
    13: { maria: 'cradle', vovo: 'explain', pipoca: 'hop' },
    14: { maria: 'reach' },
    15: { maria: 'think', vovo: 'ponder', pipoca: 'read' },
    16: { maria: 'reach', vovo: 'laugh', pipoca: 'hop' },
    17: { maria: 'laugh', vovo: 'point', pipoca: 'hop' },
    18: { maria: 'bed-ask', pipoca: 'sleep' },
    19: { maria: 'bed-wave', pipoca: 'yawn' },
    20: { maria: 'sleep', pipoca: 'sleep' }
  };
  const heights = {
    maria: { reach: 350, kneel: 225, startled: 350, laugh: 225, cradle: 350, think: 250 },
    vovo: { point: 350, crouch: 240, startled: 350, laugh: 330, explain: 350, ponder: 350 },
    pipoca: { front: 270, profile: 270, hop: 270, tumble: 270, bow: 220, read: 270, sleep: 165, explain: 270, tap: 235, yawn: 270 }
  };
  window.BookScenePoses = {
    forPage: (name, page) => pages[page]?.[name],
    height: (name, pose) => heights[name]?.[pose],
    pages
  };
})();
