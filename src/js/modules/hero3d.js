import {
  WebGLRenderer, Scene, PerspectiveCamera, Group, Mesh, Points, Vector3, Object3D, InstancedMesh,
  TorusGeometry, CylinderGeometry, CircleGeometry, SphereGeometry, BufferGeometry, Float32BufferAttribute,
  ExtrudeGeometry, Shape, MeshBasicMaterial, MeshMatcapMaterial, PointsMaterial, TextureLoader, CanvasTexture,
  SRGBColorSpace, AdditiveBlending, CustomBlending, AddEquation, OneFactor, ZeroFactor,
} from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/* Gold EC coin inside spinning rings, with iridescent soap bubbles and sparkles.
   Built for speed: "matcap" materials (lighting baked into a small texture) instead of
   physically-based lighting, no environment map, capped pixel ratio, 30 fps on phones,
   and rendering pauses whenever the hero is off-screen or the tab is hidden. */

// Small canvas textures that hold the lighting.
function goldMatcap() {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const g = c.getContext('2d');
  const grad = g.createRadialGradient(46, 40, 4, 64, 64, 66);
  grad.addColorStop(0, '#fffbe8');
  grad.addColorStop(0.18, '#f6df9a');
  grad.addColorStop(0.45, '#d4ab52');
  grad.addColorStop(0.75, '#946f22');
  grad.addColorStop(1, '#3d2b0b');
  g.fillStyle = grad;
  g.fillRect(0, 0, 128, 128);
  // soft cool rim light from below for depth
  const rim = g.createRadialGradient(80, 104, 2, 80, 104, 34);
  rim.addColorStop(0, 'rgba(160,190,255,.45)');
  rim.addColorStop(1, 'rgba(160,190,255,0)');
  g.fillStyle = rim;
  g.fillRect(0, 0, 128, 128);
  const t = new CanvasTexture(c);
  t.colorSpace = SRGBColorSpace;
  return t;
}

function bubbleMatcap() {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const g = c.getContext('2d');
  g.fillStyle = '#000';
  g.fillRect(0, 0, 128, 128);
  // iridescent rim (additive blending: black = transparent)
  const hues = ['#ff9ad5', '#9be7ff', '#fff1a8', '#b7a6ff', '#9dffd2', '#ff9ad5'];
  for (let i = 0; i < 60; i++) {
    const a0 = (i / 60) * Math.PI * 2;
    g.strokeStyle = hues[Math.floor((i / 60) * (hues.length - 1))];
    g.globalAlpha = 0.55;
    g.lineWidth = 9;
    g.beginPath();
    g.arc(64, 64, 56, a0, a0 + (Math.PI * 2) / 60 + 0.02);
    g.stroke();
  }
  g.globalAlpha = 1;
  const fade = g.createRadialGradient(64, 64, 30, 64, 64, 64);
  fade.addColorStop(0, 'rgba(0,0,0,1)');
  fade.addColorStop(0.7, 'rgba(0,0,0,.35)');
  fade.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = fade;
  g.fillRect(0, 0, 128, 128);
  const spot = g.createRadialGradient(44, 40, 0, 44, 40, 14);
  spot.addColorStop(0, 'rgba(255,255,255,.95)');
  spot.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = spot;
  g.fillRect(0, 0, 128, 128);
  return new CanvasTexture(c);
}

export function initHero3D(stage, reduceMotion = false) {
  const host = stage.querySelector('.hero__canvas');
  const isSmall = window.innerWidth < 960 || window.matchMedia('(pointer: coarse)').matches;

  let renderer;
  try {
    renderer = new WebGLRenderer({ antialias: !isSmall, alpha: true, powerPreference: 'high-performance', stencil: false });
  } catch (e) {
    return; // no WebGL: the CSS fallback emblem stays
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, isSmall ? 1.25 : 1.5));
  renderer.outputColorSpace = SRGBColorSpace;
  host.appendChild(renderer.domElement);

  const scene = new Scene();
  const camera = new PerspectiveCamera(32, 1, 0.1, 100);
  camera.position.set(0, 0, 11);

  const gold = new MeshMatcapMaterial({ matcap: goldMatcap() });

  const world = new Group();
  scene.add(world);

  // Coin: textured face + gold rim + navy back.
  const coin = new Group();
  const R = 2.05;
  let ready = false;
  const tex = new TextureLoader().load('/images/emblem-512.webp', () => (ready = true));
  tex.colorSpace = SRGBColorSpace;
  const face = new Mesh(new CircleGeometry(R, 64), new MeshBasicMaterial({ map: tex }));
  face.position.z = 0.081;
  const back = new Mesh(new CircleGeometry(R, 48), new MeshBasicMaterial({ color: '#0b1a33' }));
  back.rotation.y = Math.PI;
  back.position.z = -0.081;
  const edge = new Mesh(new CylinderGeometry(R + 0.02, R + 0.02, 0.16, 64, 1, true), gold);
  edge.rotation.x = Math.PI / 2;
  const bezel = new Mesh(new TorusGeometry(R + 0.04, 0.07, 12, 96), gold);
  coin.add(face, back, edge, bezel);
  world.add(coin);

  // Orbiting rings.
  const ring1 = new Mesh(new TorusGeometry(2.75, 0.035, 8, 140), gold);
  ring1.rotation.set(1.15, 0.25, 0);
  const ring2 = new Mesh(new TorusGeometry(3.15, 0.018, 6, 140), gold);
  ring2.rotation.set(1.35, -0.4, 0.3);
  world.add(ring1, ring2);

  // Four-point sparkle star.
  const s = new Shape();
  for (let i = 0; i <= 8; i++) {
    const a = (i / 8) * Math.PI * 2 - Math.PI / 2;
    const r = i % 2 === 0 ? 0.42 : 0.1;
    i === 0 ? s.moveTo(Math.cos(a) * r, Math.sin(a) * r) : s.lineTo(Math.cos(a) * r, Math.sin(a) * r);
  }
  const star = new Mesh(new ExtrudeGeometry(s, { depth: 0.08, bevelEnabled: false }), gold);
  star.position.set(1.95, 1.75, 0.4);
  world.add(star);

  // Iridescent soap bubbles (one instanced draw call).
  const bubbleCount = isSmall ? 10 : 18;
  const bubbles = new InstancedMesh(
    new SphereGeometry(1, 20, 14),
    new MeshMatcapMaterial({
      matcap: bubbleMatcap(), transparent: true, depthWrite: false,
      // Add light only: colour is added, alpha is left untouched, so dark parts of the bubble
      // stay see-through on the transparent canvas instead of showing as black.
      blending: CustomBlending, blendEquation: AddEquation,
      blendSrc: OneFactor, blendDst: OneFactor, blendSrcAlpha: ZeroFactor, blendDstAlpha: OneFactor,
    }),
    bubbleCount,
  );
  const dummy = new Object3D();
  const bubbleData = Array.from({ length: bubbleCount }, () => {
    const angle = Math.random() * Math.PI * 2;
    const dist = 2.6 + Math.random() * 2.2;
    return {
      base: new Vector3(Math.cos(angle) * dist, (Math.random() - 0.5) * 5.2, -1.5 + Math.random() * 3),
      size: 0.14 + Math.random() * 0.3,
      speed: 0.3 + Math.random() * 0.6,
      phase: Math.random() * Math.PI * 2,
    };
  });
  scene.add(bubbles);

  // Gold dust.
  const dustCount = isSmall ? 90 : 180;
  const pos = new Float32Array(dustCount * 3);
  for (let i = 0; i < dustCount; i++) {
    pos[i * 3] = (Math.random() - 0.5) * 12;
    pos[i * 3 + 1] = (Math.random() - 0.5) * 9;
    pos[i * 3 + 2] = (Math.random() - 0.5) * 6;
  }
  const dustGeo = new BufferGeometry();
  dustGeo.setAttribute('position', new Float32BufferAttribute(pos, 3));
  const c = document.createElement('canvas');
  c.width = c.height = 32;
  const g = c.getContext('2d');
  const grad = g.createRadialGradient(16, 16, 0, 16, 16, 16);
  grad.addColorStop(0, 'rgba(255,240,200,1)');
  grad.addColorStop(0.35, 'rgba(243,217,139,.55)');
  grad.addColorStop(1, 'rgba(243,217,139,0)');
  g.fillStyle = grad;
  g.fillRect(0, 0, 32, 32);
  const dust = new Points(dustGeo, new PointsMaterial({ size: 0.1, map: new CanvasTexture(c), transparent: true, depthWrite: false, blending: AdditiveBlending }));
  scene.add(dust);

  // Sizing.
  const resize = () => {
    const w = host.clientWidth;
    const h = host.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.position.z = w / h < 0.9 ? 13 : 11;
    camera.updateProjectionMatrix();
  };
  resize();
  new ResizeObserver(resize).observe(host);

  // Pointer + device tilt.
  const target = { x: 0, y: 0 };
  window.addEventListener('pointermove', (e) => {
    target.x = (e.clientX / window.innerWidth - 0.5) * 2;
    target.y = (e.clientY / window.innerHeight - 0.5) * 2;
  }, { passive: true });
  // Touch: drag across the hero to spin the coin.
  let spinVelocity = 0;
  let lastX = null;
  stage.addEventListener('touchstart', (e) => (lastX = e.touches[0].clientX), { passive: true });
  stage.addEventListener('touchmove', (e) => {
    const x = e.touches[0].clientX;
    if (lastX !== null) spinVelocity += (x - lastX) * 0.004;
    lastX = x;
  }, { passive: true });
  stage.addEventListener('touchend', () => (lastX = null), { passive: true });

  // Phones: the coin follows the way the device is tilted.
  const onTilt = (e) => {
    if (e.gamma == null) return;
    target.x = Math.max(-1, Math.min(1, e.gamma / 30));
    target.y = Math.max(-1, Math.min(1, (e.beta - 45) / 30));
  };
  const DOE = window.DeviceOrientationEvent;
  if (DOE && typeof DOE.requestPermission === 'function') {
    // iOS asks for permission, which must come from a tap.
    stage.addEventListener('click', () => {
      DOE.requestPermission().then((r) => r === 'granted' && window.addEventListener('deviceorientation', onTilt)).catch(() => {});
    }, { once: true });
  } else if (DOE) {
    window.addEventListener('deviceorientation', onTilt, { passive: true });
  }

  // Scroll: coin turns and lifts as the hero leaves.
  const scroll = { p: 0 };
  ScrollTrigger.create({
    trigger: stage.closest('.hero'),
    start: 'top top',
    end: 'bottom top',
    onUpdate: (self) => (scroll.p = self.progress),
  });

  // Entrance.
  let spin = 0;
  world.scale.setScalar(0.001);
  const intro = () => {
    stage.classList.add('is-3d');
    gsap.to(world.scale, { x: 1, y: 1, z: 1, duration: 1.8, ease: 'expo.out' });
    if (!reduceMotion) spin = -Math.PI * 2; // eases back to 0 in the loop, giving one full turn
  };

  // Render loop: pauses off-screen / in background tabs; 30 fps on phones.
  let visible = true;
  new IntersectionObserver(([entry]) => (visible = entry.isIntersecting)).observe(stage);
  const frameGap = isSmall ? 1000 / 31 : 0;
  const t0 = performance.now();
  let lastFrame = 0;
  let started = false;

  renderer.setAnimationLoop((now) => {
    if (!visible || document.hidden) return;
    if (now - lastFrame < frameGap) return;
    const dt = Math.min(3, (now - (lastFrame || now)) / 16.7 || 1); // keep motion speed the same at 30 fps
    lastFrame = now;
    if (!started && ready) { started = true; intro(); }
    const t = ((now - t0) / 1000) * (reduceMotion ? 0.4 : 1);
    const k = 1 - Math.pow(0.94, dt);

    spinVelocity *= Math.pow(0.95, dt);
    spin = (spin + spinVelocity) * Math.pow(0.955, dt);
    coin.rotation.y += ((target.x * 0.45 + Math.sin(t * 0.6) * 0.25 + spin + scroll.p * 0.9) - coin.rotation.y) * k;
    coin.rotation.x += ((target.y * 0.25 + Math.sin(t * 0.8) * 0.06) - coin.rotation.x) * k;
    coin.position.y = Math.sin(t * 1.1) * 0.12;

    ring1.rotation.z = t * 0.35;
    ring2.rotation.z = -t * 0.22;
    star.rotation.z = t * 0.9;
    star.scale.setScalar(0.85 + Math.sin(t * 3) * 0.2);

    world.position.y = scroll.p * 2.4;
    world.rotation.x = scroll.p * 0.5;

    for (let i = 0; i < bubbleCount; i++) {
      const b = bubbleData[i];
      dummy.position.set(
        b.base.x + Math.sin(t * b.speed + b.phase) * 0.35,
        ((b.base.y + t * b.speed * 0.45 + 2.6) % 5.2) - 2.6,
        b.base.z,
      );
      dummy.scale.setScalar(b.size);
      dummy.updateMatrix();
      bubbles.setMatrixAt(i, dummy.matrix);
    }
    bubbles.instanceMatrix.needsUpdate = true;

    dust.rotation.y = t * 0.03 + target.x * 0.1;
    dust.rotation.x = target.y * 0.05;

    renderer.render(scene, camera);
  });
}
