// Jalankan: node --experimental-strip-types test/ep002Direction.test.mjs
import {T, EP002_FPS, EP002_FRAMES, AUDIO_SECONDS, gobiPoseAt, cameraAt, cardAnim, islandShake, sec2f, emotesAt, camKick} from '../src/episode002/ep002Direction.ts';
import {buildPatrol, samplePatrol, makeObstacles, obstacleDistance} from '../src/episode002/villagerPath.ts';
import {VILLAGER_ROSTER} from '../src/episode002/villagerRoster.ts';

const FACE = Math.PI / 4;
const HOUSE = {position: [-5.0, 0, -1.0], rotationY: FACE, scale: 1.65}; // = HOUSE_SPOT
const FIELD = {position: [4.9, 0, -2.6], rotationY: FACE, scale: 1.9}; // = FIELD_SPOT
const [, fieldOb] = makeObstacles(HOUSE, FIELD);
// jejak rumah SEBENARNYA (dinding W3.2 x D2.6 + atap menjorok 0.25), tanpa batu pijakan pintu
const houseOb = {kind: 'rect', x: HOUSE.position[0], z: HOUSE.position[2], rotY: HOUSE.rotationY, hx: 1.6 * 1.65, zMin: -1.3 * 1.65, zMax: 1.3 * 1.65};
let fail = 0;
const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fail++; };

// salinan islandRadiusScale (ExpandedIsland.tsx, TSX tidak bisa diimpor Node) untuk uji kamera
const backOut = (t, o = 1.2) => 1 + (o + 1) * Math.pow(t - 1, 3) + o * Math.pow(t - 1, 2);
const seg = (p, a, b) => Math.min(1, Math.max(0, (p - a) / (b - a)));
const scaleAt = (t) => {
  const p = Math.min(1, Math.max(0, (t * EP002_FPS - sec2f(T.expandStart)) / 90));
  let sum = 0;
  for (const [a, b] of [[0, 0.4], [0.3, 0.7], [0.6, 1]]) sum += backOut(seg(p, a, b));
  return 1 + (2.9 * sum) / 3;
};

// 1. durasi
ok(EP002_FRAMES === 2700 && EP002_FRAMES / EP002_FPS >= AUDIO_SECONDS, `durasi ${EP002_FRAMES}f = ${EP002_FRAMES / EP002_FPS}s >= audio ${AUDIO_SECONDS}s`);

// 2. urutan peristiwa & posisi NPC di akhir
const order = [T.card1In, T.card1Out, T.expandStart, T.houseStart, T.card2In, T.card2Out, T.fieldStart, T.npcAppear];
ok(order.every((v, i) => i === 0 || v > order[i - 1]), 'urutan peristiwa menaik: ' + order.join(' < '));
ok(T.npcAppear > T.card2Out && T.npcAppear / AUDIO_SECONDS > 0.7 && T.npcAppear < AUDIO_SECONDS - 15, `NPC muncul menjelang akhir (${T.npcAppear}s = ${(100 * T.npcAppear / AUDIO_SECONDS).toFixed(0)}% VO, setelah kedua komentar)`);
ok(sec2f(T.expandStart) + 90 < sec2f(T.houseStart) && sec2f(T.houseStart) + 150 <= sec2f(T.card2In) && sec2f(T.fieldStart) + 120 < sec2f(T.npcAppear), 'pulau -> rumah -> sawah selesai berurutan sebelum warga');

// 3. pose Gobi: finite, deterministik, tidak teleport
let maxStep = 0, maxRot = 0, prev = null, nan = 0;
for (let f = 0; f < EP002_FRAMES; f++) {
  const p = gobiPoseAt(f / EP002_FPS);
  for (const [k, v] of Object.entries(p)) if (typeof v === 'number' && !Number.isFinite(v)) nan++;
  if (prev) { maxStep = Math.max(maxStep, Math.hypot(p.x - prev.x, p.z - prev.z)); maxRot = Math.max(maxRot, Math.abs(p.rotY - prev.rotY)); }
  prev = p;
}
ok(nan === 0, 'semua channel pose berupa angka valid sepanjang 2700 frame');
ok(maxStep < 0.12, `Gobi tidak teleport (langkah maks ${maxStep.toFixed(3)}/frame)`);
ok(maxRot < 0.5, `rotasi Gobi mulus (maks ${maxRot.toFixed(3)} rad/frame)`);
ok(JSON.stringify(gobiPoseAt(41.37)) === JSON.stringify(gobiPoseAt(41.37)), 'pose deterministik');

// 4. Gobi tidak menembus rumah/sawah dan tetap di atas pulau
let minHouse = Infinity, minField = Infinity, worstEdge = Infinity;
for (let f = 0; f < EP002_FRAMES; f++) {
  const t = f / EP002_FPS, {x, z} = gobiPoseAt(t);
  if (f >= sec2f(T.houseStart)) minHouse = Math.min(minHouse, obstacleDistance(houseOb, x, z));
  if (f >= sec2f(T.fieldStart)) minField = Math.min(minField, obstacleDistance(fieldOb, x, z));
  // Tepi pulau mengikuti radius saat ini; segi-8 dan batas konservatif.
  const apothem = 3 * scaleAt(t) * Math.cos(Math.PI / 8);
  worstEdge = Math.min(worstEdge, apothem - Math.hypot(x, z));
}
ok(minHouse >= 0.39, `jarak Gobi ke dinding rumah >= 0.39 (badan Gobi setebal ~0.45 ke depan) (min ${minHouse.toFixed(2)})`);
ok(minField >= 0.55, `jarak Gobi ke sawah >= 0.55 (min ${minField.toFixed(2)})`);
ok(worstEdge >= 0.15, `Gobi selalu di atas pulau (sisa ke tepi min ${worstEdge.toFixed(2)})`);

// 5. setelah warga muncul: Gobi di tengah & tidak menabrak warga
const appear = sec2f(T.npcAppear);
let maxR = 0, minNpc = Infinity;
const patrols = VILLAGER_ROSTER.map((v) => ({v, p: buildPatrol({path: v.path, speed: v.speed, pauseEndFrames: v.pauseEndFrames, pauseMidFrames: v.pauseMidFrames, offsetFrames: v.offsetFrames})}));
for (let f = appear; f < EP002_FRAMES; f++) {
  const {x, z} = gobiPoseAt(f / EP002_FPS);
  maxR = Math.max(maxR, Math.hypot(x, z));
  for (const {v, p} of patrols) {
    const a = f - (appear + (v.appearDelayFrames ?? 0));
    if (a < 0) continue;
    const s = samplePatrol(p, a);
    minNpc = Math.min(minNpc, Math.hypot(s.x - x, s.z - z));
  }
}
ok(maxR < 0.05, `Gobi tetap di tengah setelah warga muncul (r maks ${maxR.toFixed(3)})`);
ok(minNpc >= 1.2, `jarak Gobi ke warga >= 1.2 sepanjang sisa video (min ${minNpc.toFixed(2)})`);

// 6. kamera
let zmin = 1e9, zmax = 0, dz = 0, rz = 0, dt = 0, bad = 0; let pc = null;
for (let f = 0; f < EP002_FRAMES; f++) {
  const t = f / EP002_FPS, c = cameraAt(t, scaleAt(t));
  if (![...c.target, c.zoom].every(Number.isFinite)) bad++;
  zmin = Math.min(zmin, c.zoom); zmax = Math.max(zmax, c.zoom);
  if (pc) { dz = Math.max(dz, Math.abs(c.zoom - pc.zoom)); rz = Math.max(rz, Math.abs(c.zoom - pc.zoom) / pc.zoom); dt = Math.max(dt, Math.hypot(c.target[0] - pc.target[0], c.target[2] - pc.target[2])); }
  pc = c;
}
ok(bad === 0, 'kamera valid di semua frame');
ok(zmin >= 40 && zmax <= 240, `zoom kamera wajar (${zmin.toFixed(0)}..${zmax.toFixed(0)})`);
ok(rz < 0.05 && dt < 0.12, `kamera tanpa whip (zoom maks ${(rz * 100).toFixed(1)}%/frame, geser maks ${dt.toFixed(3)}/frame)`);
const wideEnd = cameraAt(88, 3.9);
ok(wideEnd.zoom >= 40 && wideEnd.zoom < 50, `outro: wide, zoom ${wideEnd.zoom.toFixed(0)} (pulau radius 11.7 muat 1080px)`);

// 7. kartu komentar & getar
const c1 = (t) => cardAnim(t, T.card1In, T.card1Out), c2 = (t) => cardAnim(t, T.card2In, T.card2Out);
ok(!c1(T.card1In - 0.1).visible && c1(T.card1In + 1).visible && c1(T.card1In + 1).opacity === 1 && !c1(T.card1Out + 0.5).visible, 'kartu 1: muncul/hilang sesuai jendela');
ok(!c2(T.card2In - 0.1).visible && c2(T.card2In + 1).visible && !c2(T.card2Out + 0.5).visible, 'kartu 2: muncul/hilang sesuai jendela');
ok(Math.abs(c1(T.card1In + 1.2).scale - 1) < 0.02 && Math.abs(c1(T.card1In + 1.2).y) < 2, 'kartu mendarat di skala 1 tanpa offset');
ok(Math.abs(islandShake(0.87 + 0.1)) < 0.06 && islandShake(3.3) === 0, 'getar pulau hanya pada momen kaget');

// 8. V4: akting, emote, close-up, reveal
let sqMin = 1, sqMax = -1, sqBad = 0, maxSqStep = 0, psq = 0;
for (let f = 0; f < EP002_FRAMES; f++) {
  const p = gobiPoseAt(f / EP002_FPS);
  for (const k of ['squash', 'blink', 'happy', 'confuse', 'hungry']) if (!Number.isFinite(p[k])) sqBad++;
  sqMin = Math.min(sqMin, p.squash); sqMax = Math.max(sqMax, p.squash);
  maxSqStep = Math.max(maxSqStep, Math.abs(p.squash - psq)); psq = p.squash;
  for (const k of ['blink', 'happy', 'confuse', 'hungry']) if (p[k] < -1e-9 || p[k] > 1 + 1e-9) sqBad++;
}
ok(sqBad === 0, 'channel akting V4 valid & dalam 0..1 sepanjang video');
ok(sqMin >= -0.3 && sqMax <= 0.42 && maxSqStep < 0.25, `squash/stretch halus (${sqMin.toFixed(2)}..${sqMax.toFixed(2)}, loncatan maks ${maxSqStep.toFixed(3)}/frame)`);
ok(gobiPoseAt(62.3).hungry > 0.9 && gobiPoseAt(24.5).happy > 0.9 && gobiPoseAt(2.8).confuse > 0.9, 'ekspresi lapar/senang/bingung aktif di momen dialognya');
ok(gobiPoseAt(1.0).hungry === 0 && gobiPoseAt(1.0).happy === 0, 'ekspresi netral di luar momennya');
ok(emotesAt(1.2).some((e) => e.kind === 'bang') && emotesAt(2.5).some((e) => e.kind === 'q') && emotesAt(62).some((e) => e.kind === 'rumble') && emotesAt(36).some((e) => e.kind === 'heart'), 'emote sesuai dialog (!, ?, keroncongan, hati)');
ok(emotesAt(10).length === 0 && emotesAt(1.0).every((e) => e.scale >= 0 && e.scale <= 1.2), 'emote hilang di luar jendela & skala wajar');
ok(cameraAt(62.2, 3.9).zoom > 215, `close-up lapar (zoom ${cameraAt(62.2, 3.9).zoom.toFixed(0)})`);
const rv = cameraAt(66, 3.9);
ok(rv.zoom > 70 && rv.zoom < 95 && Math.hypot(rv.target[0] - 1.2, rv.target[2] - 1.8) < 0.3, `reveal warga: bingkai grup (zoom ${rv.zoom.toFixed(0)}, target ${rv.target.map((v) => v.toFixed(1))})`);
ok(cameraAt(71.2, 3.9).zoom > 45 && cameraAt(69.4, 3.9).zoom < 70, 'setelah reveal kamera menarik mundur halus');
ok(camKick(0.87 + 0.25) > 0.04 && Math.abs(camKick(3.3)) < 1e-9, 'punch kamera hanya di momen kaget');

console.log(fail ? `\n${fail} GAGAL` : '\nSEMUA LULUS');
process.exit(fail ? 1 : 0);
