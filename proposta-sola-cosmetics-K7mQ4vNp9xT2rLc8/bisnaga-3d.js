/* Bisnaga em 3D: a tampa sai e o creme escorre conforme a rolagem.
   O Three.js só é carregado quando a cena se aproxima da tela. Sem WebGL,
   sem JavaScript ou na impressão, fica a foto do produto. */
const section = document.querySelector('[data-tube-scene]');
const figure = section && section.querySelector('.tube-figure');
const canvas = section && section.querySelector('.tube-canvas');
const stage = section && section.querySelector('.story-stage');
const reduced = matchMedia('(prefers-reduced-motion: reduce)');

const clamp = (n, a = 0, b = 1) => Math.min(b, Math.max(a, n));
const ease = (t) => t * t * (3 - 2 * t);
const span = (p, a, b) => ease(clamp((p - a) / (b - a)));
const lerp = (a, b, t) => a + (b - a) * t;

function hasWebGL() {
  try {
    const test = document.createElement('canvas');
    return Boolean(test.getContext('webgl2') || test.getContext('webgl'));
  } catch {
    return false;
  }
}

if (section && canvas && 'IntersectionObserver' in window && hasWebGL()) {
  const loader = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) return;
    loader.disconnect();
    start().catch(() => figure.classList.remove('tube-ready'));
  }, { rootMargin: '600px 0px' });
  loader.observe(section);
}

/* Medidas tiradas da foto do produto (1000 × 1000 px): onde o azul da bisnaga
   começa e termina e a meia-largura dela em cada altura. 100 px = 1 unidade. */
const PHOTO = { top: 128, bottom: 812, center: 498.5 };
const HALF_WIDTH = [[128, 131], [150, 130.5], [175, 128.5], [200, 123], [225, 118.5], [250, 115], [275, 112.5], [300, 109.5],
  [350, 105], [400, 101.5], [450, 98], [500, 95], [550, 92.5], [600, 90.5], [650, 88], [700, 86.5], [750, 85], [812, 84]];
const LENGTH = (PHOTO.bottom - PHOTO.top) / 100;

function halfWidthAt(y) {
  for (let i = 1; i < HALF_WIDTH.length; i++) {
    const [y1, w1] = HALF_WIDTH[i - 1], [y2, w2] = HALF_WIDTH[i];
    if (y <= y2) return lerp(w1, w2, clamp((y - y1) / (y2 - y1)));
  }
  return HALF_WIDTH[HALF_WIDTH.length - 1][1];
}
const photoY = (v) => PHOTO.bottom - v * (PHOTO.bottom - PHOTO.top);

/* A bisnaga é redonda junto à tampa e chata na solda. O perímetro não muda:
   a largura vem da foto e a profundidade sai do perímetro da elipse. */
function depthFor(width, perimeter) {
  const ellipse = (a, b) => Math.PI * (3 * (a + b) - Math.sqrt((3 * a + b) * (a + 3 * b)));
  let lo = 0.02, hi = width;
  if (ellipse(width, lo) >= perimeter) return lo;
  for (let i = 0; i < 40; i++) {
    const mid = (lo + hi) / 2;
    if (ellipse(width, mid) > perimeter) hi = mid; else lo = mid;
  }
  return Math.max(0.035, (lo + hi) / 2);
}

function loadImage(src) {
  const img = new Image();
  img.decoding = 'async';
  img.src = src;
  return img.decode().then(() => img);
}

/* O rótulo da frente vem da foto, desenrolado: cada coluna da textura é um
   ângulo da bisnaga e lê a foto em x = centro + meia-largura · sen(ângulo).
   O verso, que a foto não mostra, fica só com a cor da embalagem. */
function paintLabel(img) {
  const scale = img.naturalWidth / 1000;
  const src = document.createElement('canvas');
  src.width = img.naturalWidth;
  src.height = img.naturalHeight;
  const sctx = src.getContext('2d', { willReadFrequently: true });
  sctx.drawImage(img, 0, 0);
  const pixels = sctx.getImageData(0, 0, src.width, src.height).data;
  const at = (x, y) => (Math.round(y * scale) * src.width + Math.round(x * scale)) * 4;

  let base = [0, 0, 0], count = 0;
  for (let y = 765; y < 790; y++) for (let x = 430; x < 450; x++) {
    const k = at(x, y);
    base[0] += pixels[k]; base[1] += pixels[k + 1]; base[2] += pixels[k + 2]; count++;
  }
  base = base.map((c) => c / count);

  const W = 1024, H = 768;
  const out = document.createElement('canvas');
  out.width = W;
  out.height = H;
  const octx = out.getContext('2d');
  const image = octx.createImageData(W, H);
  for (let row = 0; row < H; row++) {
    const y = photoY(1 - row / (H - 1));
    const half = halfWidthAt(y) * 0.95;
    for (let col = 0; col < W; col++) {
      const angle = (col / (W - 1) - 0.5) * Math.PI * 2;
      const o = (row * W + col) * 4;
      let mix = 0;
      if (Math.abs(angle) < Math.PI / 2) mix = 1 - ease(clamp((Math.abs(angle) - 1.2) / (Math.PI / 2 - 1.2)));
      let r = base[0], g = base[1], b = base[2];
      if (mix > 0) {
        const k = at(PHOTO.center + half * Math.sin(angle), y);
        r = lerp(r, pixels[k], mix); g = lerp(g, pixels[k + 1], mix); b = lerp(b, pixels[k + 2], mix);
      }
      image.data[o] = r; image.data[o + 1] = g; image.data[o + 2] = b; image.data[o + 3] = 255;
    }
  }
  octx.putImageData(image, 0, 0);
  return { label: out, base };
}

async function start() {
  const THREE = await import('./vendor/three.module.min.js');
  const { RoomEnvironment } = await import('./vendor/RoomEnvironment.js');
  const photo = await loadImage(figure.querySelector('.tube-fallback').currentSrc || figure.querySelector('.tube-fallback').src);
  const { label, base } = paintLabel(photo);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'low-power' });
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(renderer), 0.04).texture;
  pmrem.dispose();
  const key = new THREE.DirectionalLight(0xffffff, 1.1);
  key.position.set(-4, 7, 6);
  scene.add(key);

  const camera = new THREE.PerspectiveCamera(26, 1, 0.1, 100);

  const labelTexture = new THREE.CanvasTexture(label);
  labelTexture.colorSpace = THREE.SRGBColorSpace;
  labelTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();
  const blue = new THREE.Color().setRGB(base[0] / 255, base[1] / 255, base[2] / 255, THREE.SRGBColorSpace);
  const tubeMaterial = new THREE.MeshPhysicalMaterial({ map: labelTexture, roughness: 0.5, clearcoat: 0.35, clearcoatRoughness: 0.35, envMapIntensity: 0.7 });
  const sealMaterial = new THREE.MeshPhysicalMaterial({ color: blue, roughness: 0.5, clearcoat: 0.35, envMapIntensity: 0.7 });
  const white = new THREE.MeshPhysicalMaterial({ color: 0xf3f3f0, roughness: 0.32, clearcoat: 0.6, clearcoatRoughness: 0.2, side: THREE.DoubleSide });
  const cream = new THREE.MeshPhysicalMaterial({ color: 0xf7f2ea, roughness: 0.26, clearcoat: 0.8, clearcoatRoughness: 0.12, sheen: 0.4, sheenColor: 0xffffff });

  /* Corpo: anéis elípticos da tampa (v = 0) até a solda (v = 1). */
  const RINGS = 140, AROUND = 128;
  const perimeter = 2 * Math.PI * halfWidthAt(PHOTO.bottom) / 100;
  const positions = [], uvs = [], index = [];
  for (let i = 0; i <= RINGS; i++) {
    const v = i / RINGS;
    const rx = halfWidthAt(photoY(v)) / 100;
    const rz = depthFor(rx, perimeter);
    for (let j = 0; j <= AROUND; j++) {
      const angle = (j / AROUND - 0.5) * Math.PI * 2;
      positions.push(rx * Math.sin(angle), v * LENGTH, rz * Math.cos(angle));
      uvs.push(j / AROUND, v);
    }
  }
  for (let i = 0; i < RINGS; i++) for (let j = 0; j < AROUND; j++) {
    const a = i * (AROUND + 1) + j, b = a + AROUND + 1;
    index.push(a, a + 1, b, b, a + 1, b + 1);
  }
  const bodyGeometry = new THREE.BufferGeometry();
  bodyGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  bodyGeometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  bodyGeometry.setIndex(index);
  bodyGeometry.computeVertexNormals();
  const body = new THREE.Mesh(bodyGeometry, tubeMaterial);

  const topWidth = halfWidthAt(PHOTO.top) / 100;
  const seal = new THREE.Mesh(new THREE.BoxGeometry(topWidth * 2 + 0.01, 0.05, depthFor(topWidth, perimeter) * 2 + 0.02), sealMaterial);
  seal.position.y = LENGTH;

  const neck = new THREE.Mesh(new THREE.LatheGeometry([
    [0.84, 0.02], [0.83, -0.06], [0.66, -0.2], [0.34, -0.29], [0.23, -0.32], [0.23, -0.6], [0.21, -0.64], [0.13, -0.645], [0, -0.645]
  ].map(([x, y]) => new THREE.Vector2(x, y)), 64), white);

  const cap = new THREE.Mesh(new THREE.LatheGeometry([
    [0, -1.55], [0.64, -1.55], [0.75, -1.51], [0.79, -1.43], [0.8, -0.06], [0.78, 0.01], [0.7, 0.02]
  ].map(([x, y]) => new THREE.Vector2(x, y)), 72), white);

  /* O creme é um tubo que cresce ao longo de uma curva a partir do bico. */
  const path = new THREE.CatmullRomCurve3([
    [0, -0.6, 0], [0, -1.2, 0], [0.06, -1.85, 0.14], [0.4, -2.55, 0.42], [1.15, -2.98, 0.55], [1.95, -2.78, 0.32],
    [2.35, -2.1, -0.08], [2.1, -1.48, -0.42], [1.5, -1.42, -0.55], [1.18, -1.9, -0.36], [1.42, -2.32, 0.02]
  ].map(([x, y, z]) => new THREE.Vector3(x, y, z)), false, 'centripetal');
  const SEGMENTS = 360, RADIAL = 28;
  const ribbon = new THREE.Mesh(new THREE.TubeGeometry(path, SEGMENTS, 0.19, RADIAL, false), cream);
  const tip = new THREE.Mesh(new THREE.SphereGeometry(0.19, 28, 18), cream);

  const assembly = new THREE.Group();
  assembly.add(body, seal, neck, cap, ribbon, tip);
  assembly.position.y = -LENGTH / 2 + 0.2;
  const tube = new THREE.Group();
  tube.add(assembly);
  scene.add(tube);

  function pose(p) {
    const turn = span(p, 0, 0.32);
    tube.rotation.set(lerp(0.32, 0.1, turn), lerp(-1.05, 0.08, turn), lerp(-0.12, -0.58, turn));
    tube.position.set(lerp(0.9, -0.55, turn), lerp(0.4, 1.35, turn), 0);

    const unscrew = span(p, 0.2, 0.36), away = span(p, 0.34, 0.5);
    cap.rotation.set(lerp(0, 0.5, away), -unscrew * Math.PI * 3, lerp(0, 1.25, away));
    cap.position.set(lerp(0, 3.3, away), lerp(0, -0.85, unscrew) + lerp(0, 2.3, away), lerp(0, 0.5, away));

    const flow = span(p, 0.42, 0.95);
    const shown = Math.round(flow * SEGMENTS);
    ribbon.visible = tip.visible = shown > 0;
    ribbon.geometry.setDrawRange(0, shown * RADIAL * 6);
    tip.position.copy(path.getPointAt(Math.max(0.001, flow)));
    body.scale.set(1 + flow * 0.03, 1, 1 - flow * 0.14);
    return flow;
  }

  function fit() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    const halfFov = THREE.MathUtils.degToRad(camera.fov / 2);
    camera.position.set(0, 0, Math.max(6.7 / Math.tan(halfFov), 4.6 / (Math.tan(halfFov) * camera.aspect)));
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
  }

  function target() {
    if (reduced.matches) return 1;
    const rect = section.getBoundingClientRect();
    const top = parseFloat(getComputedStyle(stage).top) || 0;
    return clamp((top - rect.top) / Math.max(1, rect.height - stage.offsetHeight));
  }

  /* Desenha só quando algo muda: a rolagem define o alvo e a cena chega até
     ele com um amortecimento curto, depois para. */
  let current = target(), frame = 0, visible = true, dirty = true;
  function draw() {
    frame = 0;
    const goal = target();
    const settled = Math.abs(goal - current) < 0.0006;
    current = settled || reduced.matches ? goal : lerp(current, goal, 0.16);
    if (dirty) { fit(); dirty = false; }
    const flow = pose(current);
    renderer.render(scene, camera);
    section.dataset.progress = current.toFixed(3);
    section.dataset.cream = flow.toFixed(3);
    if (!settled && !reduced.matches) request();
  }
  function request() {
    if (!frame && visible) frame = requestAnimationFrame(draw);
  }

  new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; request(); }, { rootMargin: '200px 0px' }).observe(section);
  new ResizeObserver(() => { dirty = true; request(); }).observe(canvas);
  addEventListener('scroll', request, { passive: true });
  reduced.addEventListener('change', () => { section.classList.toggle('tube-static', reduced.matches); request(); });
  section.classList.toggle('tube-static', reduced.matches);
  figure.classList.add('tube-ready');
  draw();
}
