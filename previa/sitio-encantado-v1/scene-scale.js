/* Proporções do mundo: a perspectiva não deve transformar vacas em miniaturas. */
(function () {
  'use strict';
  const animals = {
    cow: { height: 360, foot: 84, shadow: 145 },
    pig: { height: 180, foot: 80, shadow: 65 }
  };
  const parade = [
    { kind: 'cow', x: 500, y: 480, scale: .95, pose: 'sing', flip: false },
    { kind: 'cow', x: 700, y: 350, scale: .7, pose: 'walk-away', flip: true },
    { kind: 'pig', x: 280, y: 560, scale: .75, pose: 'messenger', flip: true },
    { kind: 'pig', x: 490, y: 555, scale: 1, pose: 'curious', flip: false },
    { kind: 'pig', x: 670, y: 500, scale: .85, pose: 'skip', flip: true },
    { kind: 'maria', x: 20, y: 340, scale: .95 }
  ];
  window.BookSceneScale = {
    adultHeight: 350,
    stature: { carlos: 175 / 170, noeli: 1 },
    animals,
    parade,
    depth: item => item.y + (item.kind === 'maria' ? 350 : animals[item.kind].foot) * item.scale,
    props: {
      closedChest: [460, 581, .9],
      openChest: [476, 591, .95],
      emergingStone: [440, 485, .38],
      bedsideStone: { x: 634, y: 494, scale: .38 }
    }
  };
})();
