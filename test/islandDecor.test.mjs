// Jalankan: node --experimental-strip-types test/islandDecor.test.mjs
import {DECOR, decorFree, ACTION_ZONE} from '../src/episode002/islandDecor.ts';
import {gobiPoseAt, EP002_FPS, EP002_FRAMES, T, sec2f} from '../src/episode002/ep002Direction.ts';
import {buildPatrol, samplePatrol} from '../src/episode002/villagerPath.ts';
import {VILLAGER_ROSTER} from '../src/episode002/villagerRoster.ts';
import {polyRadius} from '../src/episode002/islandRocks.ts';

let fail = 0;
const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fail++; };
const count = (k) => DECOR.filter((d) => d.kind === k).length;

ok(count('tree') >= 4 && count('bush') >= 6 && count('flower') >= 25 && count('tuft') >= 20 && count('pebble') >= 8,
  `jumlah dekorasi cukup (pohon ${count('tree')}, semak ${count('bush')}, bunga ${count('flower')}, rumput ${count('tuft')}, kerikil ${count('pebble')})`);

let minFree = Infinity, maxEdge = -Infinity, nan = 0, inZone = 0;
for (const d of DECOR) {
  if (![d.x, d.z, d.size, d.delay].every(Number.isFinite)) nan++;
  minFree = Math.min(minFree, decorFree(d.x, d.z, 0));
  maxEdge = Math.max(maxEdge, Math.hypot(d.x, d.z) - polyRadius(Math.atan2(d.x, d.z), 11.7));
  if (d.x > ACTION_ZONE.xMin && d.x < ACTION_ZONE.xMax && d.z > ACTION_ZONE.zMin && d.z < ACTION_ZONE.zMax) inZone++;
}
ok(nan === 0, 'semua nilai dekorasi valid');
ok(minFree >= 0.15, `dekorasi bebas dari rumah/sawah/tepi (jarak bebas min ${minFree.toFixed(2)})`);
ok(maxEdge < -0.5, `dekorasi di dalam tepi pulau (margin ${(-maxEdge).toFixed(2)})`);
ok(inZone === 0, 'tidak ada dekorasi di zona gerak Gobi/warga');

// Gobi & warga tidak menembus dekorasi (>= 0.9 dari pusat dekorasi tersebar, pohon/semak lebih jauh)
let minGobi = Infinity, minNpc = Infinity;
for (let f = sec2f(T.expandStart); f < EP002_FRAMES; f += 3) {
  const {x, z} = gobiPoseAt(f / EP002_FPS);
  for (const d of DECOR) minGobi = Math.min(minGobi, Math.hypot(d.x - x, d.z - z) - (d.kind === 'tree' || d.kind === 'bush' ? 0.9 : 0));
}
const appear = sec2f(T.npcAppear);
for (const v of VILLAGER_ROSTER) {
  const p = buildPatrol({path: v.path, speed: v.speed, pauseEndFrames: v.pauseEndFrames, pauseMidFrames: v.pauseMidFrames, offsetFrames: v.offsetFrames});
  for (let f = 0; f < EP002_FRAMES - appear; f += 3) {
    const s = samplePatrol(p, f);
    for (const d of DECOR) minNpc = Math.min(minNpc, Math.hypot(d.x - s.x, d.z - s.z) - (d.kind === 'tree' || d.kind === 'bush' ? 0.9 : 0));
  }
}
ok(minGobi >= 0.8, `Gobi jauh dari dekorasi (min ${minGobi.toFixed(2)})`);
ok(minNpc >= 0.8, `warga jauh dari dekorasi (min ${minNpc.toFixed(2)})`);
ok(DECOR.every((d) => d.delay > 0 && d.delay < 1), 'semua dekorasi muncul SETELAH perluasan dimulai (awal tetap kosong)');

console.log(fail ? `\n${fail} GAGAL` : '\nSEMUA LULUS');
process.exit(fail ? 1 : 0);
