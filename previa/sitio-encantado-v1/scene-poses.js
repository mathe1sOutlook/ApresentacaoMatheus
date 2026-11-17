/* Direção de personagens por página: o gesto acompanha o acontecimento do texto. */
(function () {
  'use strict';
  const pages = {
    0: { maria: 'front', vovo: 'front', pipoca: 'front' },
    1: { maria: 'action', noeli: 'departure-listen' },
    3: { maria: 'embrace', vovo: 'embrace' },
    4: { maria: 'reach', vovo: 'point' },
    5: { maria: 'kneel', vovo: 'crouch' },
    6: { maria: 'startled', vovo: 'box-startled' },
    7: { maria: 'reach', vovo: 'explain', pipoca: 'tumble' },
    8: { maria: 'laugh', vovo: 'laugh', pipoca: 'bow' },
    9: { maria: 'laugh', vovo: 'listen-down', pipoca: 'explain' },
    10: { maria: 'kneel', pipoca: 'tap' },
    11: { maria: 'cradle-look', vovo: 'listen-down', pipoca: 'explain' },
    12: { maria: 'cradle-look', pipoca: 'point-stars' },
    13: { maria: 'cradle-look', vovo: 'offer-hand', pipoca: 'hop' },
    14: { maria: 'reach' },
    15: { maria: 'think', vovo: 'listen-down', pipoca: 'read-scroll' },
    16: { maria: 'reach', vovo: 'laugh', pipoca: 'hop' },
    17: { maria: 'laugh-up', vovo: 'point', pipoca: 'hop' },
    18: { maria: 'bed-ask', pipoca: 'sleep' },
    19: { maria: 'bed-wave', pipoca: 'yawn' },
    20: { maria: 'sleep', pipoca: 'sleep' }
  };
  const heights = {
    maria: { 'laugh-up': 225, 'cradle-look': 350, reach: 350, kneel: 225, startled: 350, laugh: 225, cradle: 350, think: 250 },
    vovo: { 'listen-down': 350, 'box-startled': 350, 'offer-hand': 350, point: 350, crouch: 240, startled: 350, laugh: 330, explain: 350, ponder: 350 },
    pipoca: { 'point-stars': 270, 'read-scroll': 270, front: 270, profile: 270, hop: 270, tumble: 270, bow: 220, read: 270, sleep: 165, explain: 270, tap: 235, yawn: 270 }
  };
  window.BookScenePoses = {
    forPage: (name, page) => pages[page]?.[name],
    height: (name, pose) => heights[name]?.[pose],
    pages
  };
})();
