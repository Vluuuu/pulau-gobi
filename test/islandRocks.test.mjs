// Uji: setiap batu menempel di permukaan kerucut pulau pada SETIAP progress perluasan.
// Jalankan: npm run test:island
import {ROCKS, CONE_R, CONE_H, CONE_TOP_Y, polyRadius, rockPlacement} from '../src/episode002/islandRocks.ts';

const FINAL = 3.9; // = ISLAND_EXPANDED_SCALE di sceneLayout.ts
const STAGES = [[0, 0.4], [0.3, 0.7], [0.6, 1.0]];
const clamp01 = (v) => Math.min(1, Math.max(0, v));
const seg = (p, a, b) => clamp01((p - a) / (b - a));
const easeOutBack = (t, o = 1.70158) => 1 + (o + 1) * (t - 1) ** 3 + o * (t - 1) ** 2;
// salinan rumus islandRadiusScale() di ExpandedIsland.tsx
const radiusScale = (p, f) => 1 + ((f - 1) * STAGES.reduce((s, [a, b]) => s + easeOutBack(seg(p, a, b), 1.2), 0)) / STAGES.length;

let fail = 0;
const check = (ok, msg) => {
  if (!ok) { fail++; console.log('FAIL', msg); }
};

let checked = 0;
let minDepth = Infinity, maxDepth = -Infinity;
for (let i = 0; i <= 300; i++) {
  const p = i / 300;
  const s = radiusScale(p, FINAL);
  const ys = 1 + (s - 1) * 0.45;
  const apexY = CONE_TOP_Y - CONE_H * ys;
  const slope = Math.atan((CONE_R * s) / (CONE_H * ys)); // sudut permukaan terhadap garis vertikal
  ROCKS.forEach((rk, n) => {
    const {position: [x, y, z], size} = rockPlacement(rk, s, ys);
    const radial = Math.hypot(x, z);
    const surface = polyRadius(rk.az, CONE_R * s * (1 - rk.t));
    const depth = ((surface - radial) * Math.cos(slope)) / size; // kedalaman benam / ukuran
    minDepth = Math.min(minDepth, depth); maxDepth = Math.max(maxDepth, depth);
    check(radial <= surface + 1e-9, `batu ${n} p=${p.toFixed(2)} di luar kontur (r=${radial.toFixed(2)} > ${surface.toFixed(2)})`);
    check(depth >= 0.3 && depth <= 0.8, `batu ${n} p=${p.toFixed(2)} benam tidak wajar (${depth.toFixed(2)})`);
    check(y < CONE_TOP_Y && y > apexY, `batu ${n} p=${p.toFixed(2)} di luar rentang tinggi kerucut`);
    check([x, y, z].every(Number.isFinite), `batu ${n} NaN`);
    checked++;
  });
}
// bongkahan asli Ep001 tetap di azimut yang sama
const orig = [[1.6, 0.8], [-1.2, -0.6]];
orig.forEach(([x, z], n) => check(Math.abs(Math.atan2(x, z) - ROCKS[n].az) < 0.01, `azimut batu asli ${n} berubah`));
// polyRadius: sisi datar di kelipatan 45 derajat, sudut di 22.5 derajat
check(Math.abs(polyRadius(0, 10) - 10 * Math.cos(Math.PI / 8)) < 1e-9, 'polyRadius sisi datar');
check(Math.abs(polyRadius(Math.PI / 8, 10) - 10) < 1e-9, 'polyRadius sudut');
// deterministik
const a = JSON.stringify(rockPlacement(ROCKS[3], 2.7, 1.8));
check(a === JSON.stringify(rockPlacement(ROCKS[3], 2.7, 1.8)), 'tidak deterministik');

console.log(`${checked} pengecekan batu, benam ${minDepth.toFixed(2)}..${maxDepth.toFixed(2)} x ukuran`);
console.log(fail ? `GAGAL: ${fail}` : 'PASS seluruh pengecekan');
process.exit(fail ? 1 : 0);
