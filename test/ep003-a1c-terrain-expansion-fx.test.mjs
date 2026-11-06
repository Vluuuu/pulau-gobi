import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';

// Memuat .tsx lewat transpile TypeScript (tanpa three/R3F: komponen hanya memakai react + elemen intrinsik).
const here = path.dirname(fileURLToPath(import.meta.url));
const srcPath = path.resolve(here, '../src/episode003/world/terrain/fx/TerrainExpansionFx.tsx');
const req = createRequire(path.join(here, 'x.cjs'));
const ts = req('typescript');
const source = fs.readFileSync(srcPath, 'utf8');
const {outputText} = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2020,
    jsx: ts.JsxEmit.ReactJSX,
    esModuleInterop: true,
  },
});
const mod = {exports: {}};
new Function('exports', 'require', 'module', outputText)(mod.exports, req, mod);
const fx = mod.exports;

// ---- util ----
const flatten = (node, out = []) => {
  if (node === null || node === undefined || typeof node === 'boolean') return out;
  if (Array.isArray(node)) return node.forEach((n) => flatten(n, out)), out;
  out.push(node);
  flatten(node.props?.children, out);
  return out;
};
const render = (progress, radius, frame) => fx.TerrainExpansionFx({progress, radius, frame});
const meshes = (tree) => flatten(tree).filter((e) => e.type === 'mesh');
const isRing = (m) => flatten(m).some((e) => e.type === 'ringGeometry');
const finiteAll = (v) => v.every(Number.isFinite);
const R0 = 11.7;
const R1 = 37.5;
const radiusAt = (p) => R0 + (R1 - R0) * p; // stand-in untuk radius dari B
const grid = Array.from({length: 201}, (_, i) => i / 200);

test('tidak ada efek di progress 0 dan 1, dan input buruk aman', () => {
  assert.equal(render(0, R0), null);
  assert.equal(render(1, R1), null);
  assert.equal(render(-3, R0), null);
  assert.equal(render(7, R1), null);
  assert.equal(render(NaN, R0), null);
  assert.equal(render(0.5, 0), null);
  assert.equal(render(0.5, -4), null);
  assert.equal(render(0.5, NaN), null);
  assert.equal(render(0.5, Infinity), null);
  assert.equal(fx.isExpansionFxVisible(0), false);
  assert.equal(fx.isExpansionFxVisible(1), false);
  assert.equal(fx.isExpansionFxVisible(0.001), true);
  assert.equal(fx.isExpansionFxVisible(0.999), true);
});

test('envelope ring: 0 di ujung, 0..1, naik di awal dan turun di akhir', () => {
  assert.equal(fx.ringEnvelope(0), 0);
  assert.equal(fx.ringEnvelope(1), 0);
  assert.equal(fx.ringEnvelope(-1), 0);
  assert.equal(fx.ringEnvelope(2), 0);
  let peak = 0;
  for (const p of grid) {
    const e = fx.ringEnvelope(p);
    assert.ok(e >= 0 && e <= 1, `env ${p}=${e}`);
    peak = Math.max(peak, e);
  }
  assert.ok(peak > 0.95);
  assert.ok(fx.ringEnvelope(0.05) < fx.ringEnvelope(0.1));
  assert.ok(fx.ringEnvelope(0.99) < fx.ringEnvelope(0.9));
  assert.ok(fx.ringEnvelope(0.001) < 0.01 && fx.ringEnvelope(0.999) < 0.01);
});

test('tepat satu ring tipis dekat tepi, mengikuti radius yang terlihat', () => {
  for (const p of grid) {
    if (p <= 0 || p >= 1) continue;
    const R = radiusAt(p);
    const rings = meshes(render(p, R)).filter(isRing);
    if (fx.ringEnvelope(p) <= 0) {
      assert.equal(rings.length, 0);
      continue;
    }
    assert.equal(rings.length, 1, `p=${p}`);
    const g = flatten(rings[0]).find((e) => e.type === 'ringGeometry');
    const [inner, outer, theta] = g.props.args;
    assert.equal(theta, 8, 'oktagon: 8 segmen');
    assert.ok(inner > 0 && outer > inner);
    assert.ok(outer <= R, `ring harus di dalam tepi (tidak melayang): ${outer} <= ${R}`);
    assert.ok(outer >= R * 0.85, `ring dekat tepi: ${outer} vs ${R}`);
    assert.ok(outer - inner <= 0.35, `ring tipis: ${outer - inner}`);
    const op = flatten(rings[0]).find((e) => e.type === 'meshBasicMaterial').props.opacity;
    assert.ok(op >= 0 && op <= 1);
  }
});

test('orientasi ring oktagon = orientasi oktagon pulau EP002 (cylinder 8 sisi, rotation-y PI/8)', () => {
  const az = (x, z) => Math.atan2(x, z);
  const norm = (a) => ((a % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
  // titik sudut cylinder three: (sin t, cos t), lalu rotasi-Y sebesar PI/8
  const phi = Math.PI / 8;
  const cyl = Array.from({length: 8}, (_, k) => {
    const t = (k * Math.PI) / 4;
    const x = Math.sin(t);
    const z = Math.cos(t);
    return norm(az(x * Math.cos(phi) + z * Math.sin(phi), -x * Math.sin(phi) + z * Math.cos(phi)));
  });
  // titik sudut ringGeometry (bidang XY) lalu rotation-x -PI/2: (x,y,0) -> (x,0,-y)
  const ring = Array.from({length: 8}, (_, k) => {
    const t = fx.RING_THETA_START + (k * Math.PI) / 4;
    return norm(az(Math.cos(t), -Math.sin(t)));
  });
  const sortN = (a) => [...a].sort((x, y) => x - y);
  sortN(cyl).forEach((v, i) => assert.ok(Math.abs(v - sortN(ring)[i]) < 1e-9, `${v} vs ${sortN(ring)[i]}`));
});

test('octagonRadiusAt: apothem di tengah sisi, circumradius di titik sudut', () => {
  const R = 20;
  assert.ok(Math.abs(fx.octagonRadiusAt(0, R) - R * Math.cos(Math.PI / 8)) < 1e-9);
  assert.ok(Math.abs(fx.octagonRadiusAt(Math.PI / 8, R) - R) < 1e-9);
  assert.ok(Math.abs(fx.octagonRadiusAt(Math.PI / 8 + Math.PI / 4, R) - R) < 1e-9);
  for (let a = -7; a < 7; a += 0.13) {
    const r = fx.octagonRadiusAt(a, R);
    assert.ok(r <= R + 1e-9 && r >= R * Math.cos(Math.PI / 8) - 1e-9);
  }
});

test('debu: 8–12 puff, tumbuh lalu memudar, selalu berjendela valid', () => {
  assert.ok(fx.PUFF_COUNT >= 8 && fx.PUFF_COUNT <= 12);
  let maxVisible = 0;
  for (const p of grid) {
    const ms = meshes(render(p, radiusAt(p))).filter((m) => !isRing(m));
    maxVisible = Math.max(maxVisible, ms.length);
    assert.ok(ms.length <= fx.PUFF_COUNT);
  }
  assert.ok(maxVisible >= 4, `puff serentak maksimum ${maxVisible}`);
  for (let i = 0; i < fx.PUFF_COUNT; i++) {
    const [a, b] = fx.puffWindow(i);
    assert.ok(a > 0 && b < 1 && b > a, `window ${i}: ${a}..${b}`);
    assert.equal(fx.puffState(i, a, R0).visible, false);
    assert.equal(fx.puffState(i, b, R0).visible, false);
    const mid = fx.puffState(i, (a + b) / 2, R0);
    assert.equal(mid.visible, true);
    // tumbuh -> puncak di tengah -> mengecil
    const s = (u) => fx.puffState(i, a + (b - a) * u, R0).scale[0];
    assert.ok(s(0.1) < s(0.5) && s(0.9) < s(0.5));
    assert.ok(s(0.02) < s(0.1));
  }
});

test('debu: nilai selalu finit, opacity 0..1, tetap di dekat tepi oktagon', () => {
  for (let i = 0; i < fx.PUFF_COUNT; i++) {
    for (const p of grid) {
      for (const R of [R0, 20, R1]) {
        const s = fx.puffState(i, p, R, 123);
        if (!s.visible) continue;
        assert.ok(finiteAll([...s.position, ...s.scale, s.rotationY, s.opacity]));
        assert.ok(s.opacity > 0 && s.opacity <= 1);
        assert.ok(s.scale.every((v) => v > 0));
        const r = Math.hypot(s.position[0], s.position[2]);
        const az = Math.atan2(s.position[0], s.position[2]);
        const edge = fx.octagonRadiusAt(az, R);
        assert.ok(r <= edge + 0.04 * R + 1.5, `puff ${i} p=${p} R=${R}: r=${r} edge=${edge}`);
        assert.ok(r >= edge * 0.8, `puff terlalu ke dalam: r=${r} edge=${edge}`);
        assert.ok(s.position[1] > 0 && s.position[1] < 1.5);
        assert.ok(s.scale[0] < 0.2 * R, 'puff tidak raksasa');
      }
    }
  }
});

test('settle: semuanya mengecil/memudar mendekati nol saat progress→1 dan mulai dari 0', () => {
  assert.equal(fx.settleAmount(0), 0);
  assert.equal(fx.settleAmount(fx.SETTLE_START), 0);
  assert.equal(fx.settleAmount(1), 1);
  assert.ok(fx.settleAmount(0.95) > 0 && fx.settleAmount(0.95) < 1);
  for (const eps of [0.001, 0.0001]) {
    const tree = render(1 - eps, R1);
    for (const m of meshes(tree)) {
      const op = flatten(m).find((e) => e.type === 'meshBasicMaterial' || e.type === 'meshStandardMaterial').props.opacity;
      assert.ok(op < 0.02, `opacity dekat akhir: ${op}`);
    }
  }
  for (const eps of [0.001, 0.0001]) {
    for (const m of meshes(render(eps, R0))) {
      const op = flatten(m).find((e) => e.type === 'meshBasicMaterial' || e.type === 'meshStandardMaterial').props.opacity;
      assert.ok(op < 0.02, `opacity dekat awal: ${op}`);
    }
  }
});

test('deterministik: output identik, tanpa Math.random/Date/performance, urutan panggilan tidak berpengaruh', () => {
  const origRandom = Math.random;
  const origNow = Date.now;
  const origPerf = performance.now.bind(performance);
  Math.random = () => {
    throw new Error('Math.random dipanggil');
  };
  Date.now = () => {
    throw new Error('Date.now dipanggil');
  };
  performance.now = () => {
    throw new Error('performance.now dipanggil');
  };
  try {
    const seq = [0.5, 0.1, 0.9, 0.33, 0.5];
    const first = seq.map((p) => JSON.stringify(render(p, radiusAt(p), Math.round(p * 150))));
    const again = [...seq].reverse().map((p) => JSON.stringify(render(p, radiusAt(p), Math.round(p * 150)))).reverse();
    assert.deepEqual(first, again);
    assert.equal(first[0], first[4]);
  } finally {
    Math.random = origRandom;
    Date.now = origNow;
    performance.now = origPerf;
  }
});

test('frame hanya menggeser debu sangat sedikit; tanpa frame tetap valid', () => {
  const p = 0.4;
  const R = radiusAt(p);
  const a = meshes(render(p, R, undefined)).filter((m) => !isRing(m));
  const b = meshes(render(p, R, 77)).filter((m) => !isRing(m));
  assert.equal(a.length, b.length);
  a.forEach((m, i) => {
    const d = Math.hypot(...m.props.position.map((v, k) => v - b[i].props.position[k]));
    assert.ok(d <= 0.15, `delta ${d}`);
  });
  const ringA = JSON.stringify(meshes(render(p, R, 1)).find(isRing));
  const ringB = JSON.stringify(meshes(render(p, R, 999)).find(isRing));
  assert.equal(ringA, ringB, 'ring tidak bergantung frame');
});

test('hanya elemen intrinsik three + tanpa import three / API non-deterministik di source', () => {
  assert.ok(!/from\s+['"]three['"]/.test(source));
  assert.ok(!/@react-three/.test(source.replace(/\/\*[\s\S]*?\*\//g, '')));
  const code = source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
  for (const bad of ['Math.random', 'Date.now', 'new Date', 'setTimeout', 'setInterval', 'useFrame', 'useState', 'useEffect', 'requestAnimationFrame', 'performance.now', 'shaderMaterial', 'ShaderMaterial']) {
    assert.ok(!code.includes(bad), `source mengandung ${bad}`);
  }
  const types = new Set();
  for (const p of grid) for (const e of flatten(render(p, radiusAt(p), 10))) if (typeof e.type === 'string') types.add(e.type);
  for (const t of types) {
    assert.ok(['group', 'mesh', 'ringGeometry', 'meshBasicMaterial', 'icosahedronGeometry', 'meshStandardMaterial'].includes(t), `elemen tak terduga ${t}`);
  }
});
