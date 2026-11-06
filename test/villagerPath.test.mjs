// Jalankan: node --experimental-strip-types test/villagerPath.test.mjs
import {buildPatrol, samplePatrol, makeObstacles, pathClearance, freeSpace} from '../src/episode002/villagerPath.ts';
const FACE = Math.PI / 4;
// Harus sama dengan HOUSE_SPOT / FIELD_SPOT di src/episode002/buildTimeline.ts
const obs = makeObstacles({position: [-5.0, 0, -1.0], rotationY: FACE, scale: 1.65}, {position: [4.9, 0, -2.6], rotationY: FACE, scale: 1.9});
const PATHS = JSON.parse(process.env.PATHS ?? 'null') ?? (await import('../src/episode002/villagerRoster.ts')).VILLAGER_ROSTER.map((v) => v);
let fail = 0;
const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fail++; };
const patrols = PATHS.map((v) => ({v, p: buildPatrol({path: v.path, speed: v.speed, pauseEndFrames: v.pauseEndFrames, pauseMidFrames: v.pauseMidFrames, offsetFrames: v.offsetFrames})}));
for (const {v, p} of patrols) {
  ok(pathClearance(v.path, obs) >= 0, `${v.id}: jalur bebas rumah/sawah/Gobi/tepi (ruang sisa ${pathClearance(v.path, obs).toFixed(2)})`);
  let minFree = Infinity, maxStep = 0, prev = null, paused = 0, walking = 0;
  for (let f = 0; f < p.cycle * 3; f++) {
    const s = samplePatrol(p, f);
    minFree = Math.min(minFree, freeSpace(obs, s.x, s.z));
    if (prev) maxStep = Math.max(maxStep, Math.hypot(s.x - prev.x, s.z - prev.z));
    s.walk > 0 ? walking++ : paused++;
    prev = s;
  }
  ok(minFree >= 0, `${v.id}: posisi per-frame selalu aman (min ${minFree.toFixed(2)})`);
  ok(maxStep < 0.06, `${v.id}: tidak teleport (langkah maks ${maxStep.toFixed(3)}/frame)`);
  ok(paused > 0 && walking > 0, `${v.id}: ada jalan (${walking}f) dan diam (${paused}f); siklus ${p.cycle}f`);
  const a = samplePatrol(p, 137), b = samplePatrol(p, 137);
  ok(JSON.stringify(a) === JSON.stringify(b), `${v.id}: deterministik (frame sama => hasil sama)`);
}
if (patrols.length === 2) {
  let minD = Infinity;
  for (let f = 0; f < 6000; f++) {
    const a = samplePatrol(patrols[0].p, f), b = samplePatrol(patrols[1].p, f);
    minD = Math.min(minD, Math.hypot(a.x - b.x, a.z - b.z));
  }
  ok(minD > 1.3, `dua warga tidak saling menembus (jarak min ${minD.toFixed(2)})`);
}
console.log(fail ? `\n${fail} GAGAL` : '\nSEMUA LULUS');
process.exit(fail ? 1 : 0);
