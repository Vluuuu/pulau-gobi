/**
 * Logika jalur warga: MURNI & deterministik (hanya fungsi dari `frame`).
 * Tidak ada import supaya bisa diuji langsung dengan Node (lihat test/villagerPath.test.mjs).
 * Tanpa Math.random, delta, atau timer.
 */

export type Waypoint = [number, number]; // [x, z] di bidang pulau (y = 0)

export type PatrolOptions = {
  path: Waypoint[]; // >= 2 titik; berjalan bolak-balik (ping-pong)
  speed?: number; // unit/frame (default 0.02 ~ 0.6 unit/detik, santai)
  pauseEndFrames?: number; // diam di ujung jalur (default 60)
  pauseMidFrames?: number; // diam di titik tengah (default 24)
  offsetFrames?: number; // geser fase supaya dua warga tidak sinkron
};

export type PatrolSample = {
  x: number;
  z: number;
  heading: number; // rotation-y (0 = menghadap +z)
  walk: number; // 0..1 intensitas ayunan langkah
  stride: number; // fase langkah (radian) -- terus maju selama berjalan
};

const TURN_FRAMES = 14;
const RAMP_FRAMES = 6;

type Leg = {a: Waypoint; b: Waypoint; len: number; walkF: number; pauseF: number; start: number; heading: number};

export type Patrol = {legs: Leg[]; cycle: number; offset: number};

const smooth = (t: number) => t * t * (3 - 2 * t);
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/** Selisih sudut terpendek b - a, dalam (-PI, PI]. */
const angleDiff = (a: number, b: number) => {
  let d = (b - a) % (Math.PI * 2);
  if (d > Math.PI) d -= Math.PI * 2;
  if (d <= -Math.PI) d += Math.PI * 2;
  return d;
};

export const buildPatrol = (o: PatrolOptions): Patrol => {
  const speed = o.speed ?? 0.02;
  const pauseEnd = o.pauseEndFrames ?? 60;
  const pauseMid = o.pauseMidFrames ?? 24;
  const n = o.path.length;
  // urutan indeks ping-pong: 0..n-1..1  (siklus tertutup)
  const order: number[] = [];
  for (let i = 0; i < n; i++) order.push(i);
  for (let i = n - 2; i >= 1; i--) order.push(i);
  const legs: Leg[] = [];
  let t = 0;
  for (let k = 0; k < order.length; k++) {
    const a = o.path[order[k]];
    const b = o.path[order[(k + 1) % order.length]];
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
    const walkF = Math.max(1, Math.round(len / speed));
    const isEnd = order[(k + 1) % order.length] === 0 || order[(k + 1) % order.length] === n - 1;
    const pauseF = isEnd ? pauseEnd : pauseMid;
    legs.push({a, b, len, walkF, pauseF, start: t, heading: Math.atan2(b[0] - a[0], b[1] - a[1])});
    t += walkF + pauseF;
  }
  return {legs, cycle: t, offset: o.offsetFrames ?? 0};
};

export const samplePatrol = (p: Patrol, frame: number): PatrolSample => {
  const f0 = Math.max(0, frame) + p.offset;
  const f = ((f0 % p.cycle) + p.cycle) % p.cycle;
  let i = p.legs.length - 1;
  for (let k = 0; k < p.legs.length; k++) {
    if (f < p.legs[k].start + p.legs[k].walkF + p.legs[k].pauseF) {
      i = k;
      break;
    }
  }
  const leg = p.legs[i];
  const next = p.legs[(i + 1) % p.legs.length];
  const local = f - leg.start;

  if (local < leg.walkF) {
    const u = local / leg.walkF;
    // easing lembut (monoton): mulai & berhenti perlahan
    const e = u - (0.35 * Math.sin(Math.PI * 2 * u)) / (Math.PI * 2);
    const ramp = Math.min(1, local / RAMP_FRAMES, (leg.walkF - local) / RAMP_FRAMES);
    return {
      x: leg.a[0] + (leg.b[0] - leg.a[0]) * e,
      z: leg.a[1] + (leg.b[1] - leg.a[1]) * e,
      heading: leg.heading,
      walk: clamp01(ramp),
      stride: f0 * 0.32,
    };
  }
  // diam di titik b; menjelang akhir jeda, berputar menghadap arah leg berikutnya
  const pl = local - leg.walkF;
  const turnK = smooth(clamp01((pl - (leg.pauseF - TURN_FRAMES)) / TURN_FRAMES));
  return {
    x: leg.b[0],
    z: leg.b[1],
    heading: leg.heading + angleDiff(leg.heading, next.heading) * turnK,
    walk: 0,
    stride: f0 * 0.32,
  };
};

/* ---------- Validasi rintangan (dipakai uji & peringatan dev) ---------- */

export type Obstacle =
  | {kind: 'circle'; x: number; z: number; r: number}
  | {kind: 'rect'; x: number; z: number; rotY: number; hx: number; zMin: number; zMax: number};

/** Jarak bertanda ke rintangan (positif = di luar). */
export const obstacleDistance = (ob: Obstacle, x: number, z: number): number => {
  if (ob.kind === 'circle') return Math.hypot(x - ob.x, z - ob.z) - ob.r;
  const dx = x - ob.x;
  const dz = z - ob.z;
  const c = Math.cos(ob.rotY);
  const s = Math.sin(ob.rotY);
  const lx = dx * c - dz * s;
  const lz = dx * s + dz * c;
  const ex = Math.abs(lx) - ob.hx;
  const ez = Math.abs(lz - (ob.zMin + ob.zMax) / 2) - (ob.zMax - ob.zMin) / 2;
  return Math.hypot(Math.max(ex, 0), Math.max(ez, 0)) + Math.min(Math.max(ex, ez), 0);
};

/** Radius aman pulau akhir: segi-8 radius 3*3.9=11.7, apotema 10.81. */
export const ISLAND_SAFE_RADIUS = 3 * 3.9 * Math.cos(Math.PI / 8);
/** Jarak bersih minimum badan warga dari rintangan / tepi. */
export const BODY_CLEARANCE = 0.75;

export type SpotLike = {position: [number, number, number]; rotationY: number; scale?: number};

/** Jejak rintangan berdasar HOUSE_SPOT / FIELD_SPOT (dimensi dari GobiHouse.tsx & RiceField.tsx). */
export const makeObstacles = (house: SpotLike, field: SpotLike): Obstacle[] => [
  // rumah: W 3.2 + atap menjorok 0.25 => hx 1.85; D 2.6 => z -1.55..1.55; batu pijakan pintu s.d. z ~2.05
  {kind: 'rect', x: house.position[0], z: house.position[2], rotY: house.rotationY, hx: 1.85 * (house.scale ?? 1), zMin: -1.55 * (house.scale ?? 1), zMax: 2.05 * (house.scale ?? 1)},
  // sawah: W 2.6 / D 2.0 + pematang
  {kind: 'rect', x: field.position[0], z: field.position[2], rotY: field.rotationY, hx: 1.4 * (field.scale ?? 1), zMin: -1.1 * (field.scale ?? 1), zMax: 1.1 * (field.scale ?? 1)},
  // Gobi di (0,0,0)
  {kind: 'circle', x: 0, z: 0, r: 0.45},
];

/** Sisa ruang bebas (>= 0 berarti aman) di titik (x,z) setelah dikurangi BODY_CLEARANCE. */
export const freeSpace = (obs: Obstacle[], x: number, z: number): number => {
  let m = ISLAND_SAFE_RADIUS - Math.hypot(x, z);
  for (const ob of obs) m = Math.min(m, obstacleDistance(ob, x, z));
  return m - BODY_CLEARANCE;
};

/** Cek seluruh segmen jalur dengan sampling rapat. Mengembalikan ruang bebas minimum. */
export const pathClearance = (path: Waypoint[], obs: Obstacle[]): number => {
  let min = Infinity;
  for (let i = 0; i < path.length - 1; i++) {
    const [ax, az] = path[i];
    const [bx, bz] = path[i + 1];
    const steps = Math.max(2, Math.ceil(Math.hypot(bx - ax, bz - az) / 0.05));
    for (let s = 0; s <= steps; s++) {
      const u = s / steps;
      min = Math.min(min, freeSpace(obs, ax + (bx - ax) * u, az + (bz - az) * u));
    }
  }
  return min;
};
