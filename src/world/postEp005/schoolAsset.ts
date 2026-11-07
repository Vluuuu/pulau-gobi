import {part} from '../../episode004/production/part.ts';
import type {Part} from '../../episode004/production/part.ts';
import type {V3} from '../../episode005/layout.ts';
import {campusParts} from '../../episode005/campus.ts';
import {OUTRO_START} from '../../episode005/timeline.ts';
import {WINGS, LEVELS, STAIR, SCHOOL_ENTRY_ROUTE} from './schoolLayout.ts';
import type {SchoolAssetOptions} from './schoolLayout.ts';

export type SchoolPart = Part & {section: string; collision: boolean; glass?: boolean};
export type SchoolLabel = {
  id: string; lines: readonly string[]; position: V3; size: readonly [number, number];
  rotation?: V3; section: string; style?: 'chalk' | 'poster' | 'sign';
};
export type SchoolAsset = {parts: SchoolPart[]; labels: SchoolLabel[]};
type Opening = {id: string; u: number; width: number; bottom: number; height: number; door?: boolean};
const C = {wall: '#e7dab7', low: '#d3bc92', trim: '#527b73', wood: '#97724d', roof: '#698e8a', plaster: '#eee6d1', floor: '#c6a77c'};
const base = LEVELS.ground;

/** Complete static campus; no frame, progress, random seed, animation or camera dependency. */
export function buildSchoolAsset(options: SchoolAssetOptions = {}): SchoolAsset {
  const parts: SchoolPart[] = [], labels: SchoolLabel[] = [];
  const add = (id: string, color: string, p: V3, size: V3, section = 'site', collision = false,
    rotation?: V3, kind: Part['kind'] = 'box', glass = false) => {
    parts.push({...part(id, color, p, size, kind, rotation), section, collision, glass});
  };
  const label = (id: string, lines: readonly string[], p: V3, size: readonly [number, number],
    section = 'site', rotation?: V3, style: SchoolLabel['style'] = 'sign') => {
    labels.push({id, lines, position: p, size, section, rotation, style});
  };

  // Retain the actual published courtyard/fences/flag base/benches/court. Only the
  // architectural shell and classroom furniture below are replaced in this variant.
  const retained = /^(campus-entry-path-|campus-flag-|campus-yard-bench-|campus-bench-leg-|school-sports-court|court-|school-west-fence|school-front-west|school-front-east|school-east-fence)/;
  for (const p of campusParts(OUTRO_START - 1, false)) {
    if (!retained.test(p.id)) continue;
    const solid = /bench|fence|post|pole|backboard/.test(p.id);
    parts.push({...p, color: /court-.*line|court-circle/.test(p.id) ? '#d8d6bf' : p.color, section: 'site', collision: solid});
  }
  const approach: readonly V3[] = [...SCHOOL_ENTRY_ROUTE.slice(0, 3), [0, 0, 6.7]];
  for (let i = 1; i < approach.length; i++) {
    const a = approach[i - 1], b = approach[i], length = Math.hypot(b[0] - a[0], b[2] - a[2]);
    add(`main-paving-${i}`, '#c3b590', [(a[0] + b[0]) / 2, .025, (a[2] + b[2]) / 2],
      [1.65, .05, length + .12], 'site', false, [0, Math.atan2(b[0] - a[0], b[2] - a[2]), 0]);
  }

  // Walls are tessellated AROUND openings. Glass does not sit on an opaque box.
  const wall = (id: string, axis: 'x' | 'z', fixed: number, lo: number, hi: number,
    floor: number, top: number, section: string, holes: Opening[] = []) => {
    const point = (u: number, y: number, offset = 0): V3 => axis === 'x' ? [u, y, fixed + offset] : [fixed + offset, y, u];
    const size = (u: number, y: number, depth: number): V3 => axis === 'x' ? [u, y, depth] : [depth, y, u];
    const us = [...new Set([lo, hi, ...holes.flatMap(h => [h.u - h.width / 2, h.u + h.width / 2])])].sort((a, b) => a - b);
    const ys = [...new Set([floor, top, ...holes.flatMap(h => [h.bottom, h.bottom + h.height])])].sort((a, b) => a - b);
    for (let u = 1; u < us.length; u++) for (let y = 1; y < ys.length; y++) {
      const mid = (us[u - 1] + us[u]) / 2, cy = (ys[y - 1] + ys[y]) / 2;
      if (holes.some(h => Math.abs(mid - h.u) < h.width / 2 && cy > h.bottom && cy < h.bottom + h.height)) continue;
      add(`${id}-panel-${u}-${y}`, cy < floor + 1 ? C.low : C.wall, point(mid, cy), size(us[u] - us[u - 1], ys[y] - ys[y - 1], .18), section, true);
    }
    add(`${id}-skirting`, C.trim, point((lo + hi) / 2, floor + .075), size(hi - lo, .15, .21), section);
    // A door threshold must remain flush, rather than a baseboard across the opening.
    const skirt = parts.pop()!;
    if (!holes.some(h => h.door)) parts.push(skirt);
    else for (let i = 1; i < us.length; i++) {
      const mid = (us[i] + us[i - 1]) / 2;
      if (!holes.some(h => h.door && Math.abs(mid - h.u) < h.width / 2)) add(`${id}-skirting-${i}`, C.trim, point(mid, floor + .075), size(us[i] - us[i - 1], .15, .21), section);
    }
    for (const h of holes) {
      // Keep structural jambs/sills visible as thick section edges in a cutaway.
      const frameSection = section.startsWith('A01-') ? 'A01-frames' : section;
      for (const s of [-1, 1]) add(`${id}-${h.id}-jamb-${s}`, C.wood,
        point(h.u + s * (h.width / 2 + .045), h.bottom + h.height / 2), size(.09, h.height + .16, .26), frameSection, true);
      add(`${id}-${h.id}-header`, C.wood, point(h.u, h.bottom + h.height + .045), size(h.width + .18, .09, .26), frameSection, true);
      if (!h.door) {
        add(`${id}-${h.id}-sill`, C.wood, point(h.u, h.bottom - .045), size(h.width + .2, .09, .32), frameSection);
        add(`${id}-${h.id}-glazing`, '#a8cbd0', point(h.u, h.bottom + h.height / 2), size(h.width, h.height, .025), section, false, undefined, 'box', true);
        add(`${id}-${h.id}-mullion`, C.trim, point(h.u, h.bottom + h.height / 2), size(.055, h.height, .10), frameSection);
        add(`${id}-${h.id}-crossbar`, C.trim, point(h.u, h.bottom + h.height / 2), size(h.width, .055, .10), frameSection);
      }
    }
  };
  const window = (id: string, u: number, floor: number, width = 1.35): Opening => ({id, u, width, bottom: floor + 1.05, height: 1.35});
  const door = (u: number, floor: number, width = 1.5): Opening => ({id: 'door', u, width, bottom: floor, height: 2.65, door: true});
  const leaf = (id: string, x: number, z: number, floor: number, width: number, height: number, section: string, right = false, inward = false) => {
    // Hinge and latch are real geometry, expressed as one static open/closed pose.
    const angle = options.doors === 'open' ? (right ? 1 : -1) * (inward ? -1 : 1) * Math.PI / 2 : 0;
    const hinge = x + (right ? width / 2 : -width / 2), dx = (right ? -1 : 1) * width / 2;
    const transform = (px: number, py: number, pz: number): V3 => [hinge + px * Math.cos(angle) + pz * Math.sin(angle), floor + py, z - px * Math.sin(angle) + pz * Math.cos(angle)];
    add(`${id}-leaf`, C.wood, transform(dx, height / 2, 0), [width - .04, height - .04, .075], section, true, [0, angle, 0]);
    add(`${id}-inset`, '#b38c60', transform(dx, height * .58, .045), [width - .24, height * .6, .035], section, false, [0, angle, 0]);
    for (const y of [.28, height - .28]) add(`${id}-hinge-${y}`, '#8e9489', transform(0, y, 0), [.065, .18, .12], section);
    for (const face of [-1, 1]) add(`${id}-handle-${face}`, '#d7b56b', transform(dx * 1.65, 1.13, face * .09), [.07, .18, .08], section, false, [0, angle, 0]);
  };

  // Three surveyed wings overlap at their joins. A union floor and clipped exterior
  // walls avoid duplicate slabs and walls cutting through the neighbouring wing.
  const bounds = WINGS.map(w => ({...w, x0: w.x - 4.2, x1: w.x + 4.2, z0: w.z - 2.9, z1: w.z + 2.9}));
  const contains = (r: typeof bounds[number], x: number, z: number) => x > r.x0 + .001 && x < r.x1 - .001 && z > r.z0 + .001 && z < r.z1 - .001;
  const stairHole = (x: number, z: number) => x > STAIR.x - .78 && x < STAIR.upperX + .78 && z > -7.4 && z < -3.2;
  const xs = [...new Set([...bounds.flatMap(w => [w.x0, w.x1]), STAIR.x - .78, STAIR.upperX + .78])].sort((a, b) => a - b);
  const zs = [...new Set([...bounds.flatMap(w => [w.z0, w.z1]), -7.4, -3.2])].sort((a, b) => a - b);
  for (let i = 1; i < xs.length; i++) for (let j = 1; j < zs.length; j++) {
    const x = (xs[i] + xs[i - 1]) / 2, z = (zs[j] + zs[j - 1]) / 2, owner = bounds.find(w => contains(w, x, z));
    if (!owner) continue;
    const sx = xs[i] - xs[i - 1], sz = zs[j] - zs[j - 1], section = owner.id === 'A' ? 'A-overhead' : 'structure';
    add(`foundation-${i}-${j}`, '#a7a28d', [x, .17, z], [sx, .34, sz]);
    add(`ground-floor-${i}-${j}`, C.floor, [x, .37, z], [sx, .06, sz]);
    if (!stairHole(x, z)) {
      add(`upper-floor-${i}-${j}`, '#b69363', [x, LEVELS.upper - .11, z], [sx, .22, sz], section);
      add(`ground-ceiling-${i}-${j}`, C.plaster, [x, LEVELS.ceiling, z], [sx, .08, sz], section);
    }
    add(`upper-ceiling-${i}-${j}`, C.plaster, [x, LEVELS.upperCeiling, z], [sx, .08, sz], section);
  }
  for (const w of bounds) for (const level of [0, 1]) {
    const floor = level ? LEVELS.upper : base, top = level ? 7.04 : 3.68;
    const section = level && w.id === 'A' ? 'A-overhead' : 'structure';
    if (w.id === 'A') {
      wall(`A-${level}-front`, 'x', 2.8, -4.1, 4.1, floor, top, level ? section : 'A01-front', [door(0, floor), window('west', -2.55, floor, 1.55), window('east', 2.55, floor, 1.55)]);
      wall(`A-${level}-back`, 'x', -2.8, -4.1, 4.1, floor, top, level ? section : 'A01-back', level ? [-2.7, 0, 2.7].map((x, i) => window(`window-${i}`, x, floor)) : []);
      for (const [side, x] of [['west', -4.1], ['east', 4.1]] as const) wall(`A-${level}-${side}`, 'z', x, -2.8, 2.8, floor, top, level ? section : `A01-${side}`, [-1.75, 0, 1.75].map((z, i) => window(`window-${i}`, z, floor, 1.25)));
      leaf(`A0${level + 1}-door`, 0, 2.8, floor, 1.5, 2.65, level ? section : 'A01-frames', false, true);
      label(`A0${level + 1}-sign`, [`KELAS A0${level + 1}`], [0, floor + 2.91, 2.95], [1.8, .30], level ? section : 'A01-frames');
    } else {
      const edges = [
        {name: 'front', axis: 'x' as const, fixed: w.z + 2.8, lo: w.x - 4.1, hi: w.x + 4.1, normal: .2},
        {name: 'back', axis: 'x' as const, fixed: w.z - 2.8, lo: w.x - 4.1, hi: w.x + 4.1, normal: -.2},
        {name: 'west', axis: 'z' as const, fixed: w.x - 4.1, lo: w.z - 2.8, hi: w.z + 2.8, normal: -.2},
        {name: 'east', axis: 'z' as const, fixed: w.x + 4.1, lo: w.z - 2.8, hi: w.z + 2.8, normal: .2},
      ];
      for (const e of edges) {
        const cuts = [...new Set([e.lo, e.hi, ...bounds.filter(b => b.id !== w.id).flatMap(b => e.axis === 'x' ? [b.x0, b.x1] : [b.z0, b.z1]).filter(v => v > e.lo && v < e.hi)])].sort((a, b) => a - b);
        for (let i = 1; i < cuts.length; i++) {
          const mid = (cuts[i] + cuts[i - 1]) / 2, x = e.axis === 'x' ? mid : e.fixed + e.normal, z = e.axis === 'x' ? e.fixed + e.normal : mid;
          if (bounds.some(b => b.id !== w.id && contains(b, x, z))) continue;
          const holes = e.name === 'front' ? [door(w.x, floor, w.id === 'B' ? 1.25 : 1.5)] : [];
          for (let k = -1; k <= 1; k++) {
            const u = (e.axis === 'x' ? w.x : w.z) + k * 2.55;
            if (e.name !== 'front' || k !== 0) holes.push(window(`window-${k}`, u, floor));
          }
          wall(`${w.id}-${level}-${e.name}-${i}`, e.axis, e.fixed, cuts[i - 1], cuts[i], floor, top, section,
            holes.filter(h => h.u - h.width / 2 >= cuts[i - 1] && h.u + h.width / 2 <= cuts[i]));
        }
      }
      leaf(`${w.id}0${level + 1}-door`, w.x, w.z + 2.8, floor, w.id === 'B' ? 1.25 : 1.5, 2.65, section);
      label(`${w.id}0${level + 1}-sign`, [`KELAS ${w.id}0${level + 1}`], [w.x, floor + 2.91, w.z + 2.95], [1.8, .3], section);
    }
  }

  // Complete gabled roofs, fascia, tie beams and rafters on all three wings.
  for (const w of WINGS) {
    const section = w.id === 'A' ? 'A-overhead' : 'structure';
    for (const side of [-1, 1]) {
      add(`${w.id}-roof-sheet-${side}`, C.roof, [w.x + side * 2.17, 7.63, w.z], [4.6, .19, 6.7], section, false, [0, 0, -side * .23]);
      add(`${w.id}-roof-fascia-${side}`, C.trim, [w.x + side * 4.35, 7.10, w.z], [.14, .24, 6.7], section);
      for (let j = 0; j < 5; j++) add(`${w.id}-rafter-${side}-${j}`, C.wood, [w.x + side * 2.04, 7.47, w.z - 2.6 + j * 1.3], [4.35, .13, .12], section, false, [0, 0, -side * .23]);
    }
    add(`${w.id}-roof-ridge`, '#426d69', [w.x, 8.15, w.z], [.20, .20, 6.8], section);
    for (const z of [-2.8, 0, 2.8]) add(`${w.id}-tie-beam-${z}`, C.wood, [w.x, 7.10, w.z + z], [8.3, .18, .16], section);
    // Verandas remain at both levels, with clear human-height railings upstairs.
    for (const floor of [base, LEVELS.upper]) {
      const ySection = w.id === 'A' && floor > 1 ? 'A-overhead' : 'structure';
      const xCuts = [...new Set([w.x - 4.3, w.x + 4.3, ...(w.id === 'C' ? [-7.1] : []), ...bounds.flatMap(b => [b.x0, b.x1]).filter(x => x > w.x - 4.3 && x < w.x + 4.3)])].sort((a, b) => a - b);
      for (let i = 1; i < xCuts.length; i++) {
        const x = (xCuts[i] + xCuts[i - 1]) / 2;
        if (bounds.some(b => b.id !== w.id && contains(b, x, w.z + 3.35))) continue;
        add(`${w.id}-veranda-${floor}-${i}`, C.floor, [x, floor - .09, w.z + 3.35], [xCuts[i] - xCuts[i - 1], .18, 1.25], ySection);
        if (floor > 1 && !(w.id === 'C' && x > -7.1)) {
          add(`${w.id}-handrail-${i}`, C.trim, [x, floor + .95, w.z + 3.94], [xCuts[i] - xCuts[i - 1], .09, .09], ySection, true);
          const n = Math.ceil((xCuts[i] - xCuts[i - 1]) / .6);
          for (let k = 0; k <= n; k++) add(`${w.id}-baluster-${i}-${k}`, C.trim, [xCuts[i - 1] + k * (xCuts[i] - xCuts[i - 1]) / n, floor + .48, w.z + 3.94], [.055, .90, .055], ySection, true);
        }
      }
    }
  }

  // Attached foyer closes against A01's front wall; no detached interior box.
  add('foyer-foundation', '#a7a28d', [0, .17, 4.32], [8.4, .34, 3.04]);
  add('foyer-floor', C.floor, [0, .37, 4.32], [8.4, .06, 3.04]);
  wall('foyer-front', 'x', 5.84, -4.1, 4.1, base, 3.68, 'foyer-front', [{...door(0, base, 2.4), height: 2.8}, window('left', -3, base, 1.25), window('right', 3, base, 1.25)]);
  wall('foyer-east', 'z', 4.1, 2.8, 5.84, base, 3.68, 'foyer-east', [window('window', 4.3, base, 1.7)]);
  // The west doorway joins a covered, floored passage to the retained C-wing portico.
  wall('foyer-west', 'z', -4.1, 2.8, 5.84, base, 3.68, 'structure', [door(4.3, base, 1.65)]);
  for (const side of [-1, 1]) leaf(`main-entry-${side}`, side * .6, 5.84, base, 1.2, 2.8, 'foyer-front', side > 0);
  add('foyer-ceiling', C.plaster, [0, 3.56, 4.32], [8.4, .08, 3.04], 'A-overhead');
  add('foyer-roof', C.roof, [0, 3.73, 4.32], [8.7, .16, 3.3], 'A-overhead');
  for (const [z, y, depth] of [[6.45, .06, .6], [6.15, .18, .6], [5.95, .32, .4]]) add(`entry-step-${z}`, '#b3aa90', [0, y, z], [2.7, .12, depth]);
  for (const floor of [base, LEVELS.upper]) {
    const section = floor > 1 ? 'A-overhead' : 'structure';
    add(`link-east-west-${floor}`, C.floor, [-5.35, floor - .09, 3.35], [2.7, .18, 1.45], section);
    add(`link-turn-${floor}`, C.floor, [-6.2, floor - .09, 2.2], [1.5, .18, 1.5], section);
    // Floor at the ground foyer exit must extend to the same safe width as above.
    if (floor === base) add('link-foyer-exit', C.floor, [-5.1, floor - .09, 4.25], [2.2, .18, 1.8]);
  }
  add('C-portico-roof', C.roof, [-10, 3.7, 2], [8.9, .18, 3.0]);
  add('link-covered-roof', C.roof, [-5.2, 3.7, 3.4], [2.4, .18, 3.6], 'A-overhead');
  add('upper-link-outer-rail', C.trim, [-5.35, LEVELS.upper + .95, 4.075], [2.7, .09, .09], 'A-overhead', true);
  for (let i = 0; i < 6; i++) add(`upper-link-baluster-${i}`, C.trim, [-6.65 + i * .52, LEVELS.upper + .48, 4.075], [.055, .90, .055], 'A-overhead', true);
  for (const x of [-14, -6]) add(`C-portico-column-${x}`, C.wood, [x, 1.85, 3.4], [.23, 3.7, .23], 'structure', true);
  add('west-school-sign-board', C.wood, [-10, 4.58, 3.98], [8.3, 1.1, .10], 'structure');
  for (const x of [-14, -6]) {
    add(`west-sign-upright-${x}`, C.wood, [x, 4.4, 3.4], [.16, 1.4, .16], 'structure');
    add(`west-sign-bracket-${x}`, C.trim, [x, 4.58, 3.7], [.10, .10, .6], 'structure');
  }

  // Real stairwell in the B/C join, with a matching opening in the upper slab.
  const rise = (LEVELS.upper - base) / (2 * STAIR.stepsPerFlight), run = (STAIR.startZ - STAIR.turnZ) / STAIR.stepsPerFlight;
  const midY = (base + LEVELS.upper) / 2;
  for (const flight of [0, 1]) {
    const x = flight ? STAIR.upperX : STAIR.x, startY = flight ? midY : base;
    const startZ = flight ? STAIR.turnZ : STAIR.startZ, direction = flight ? 1 : -1;
    for (let i = 0; i < STAIR.stepsPerFlight; i++) add(`school-stair-${flight}-tread-${i}`, C.floor,
      [x, startY + rise * (i + .5), startZ + direction * run * (i + .5)], [STAIR.width, rise, run + .02]);
    const rotation: V3 = [-direction * Math.atan2(midY - base, STAIR.startZ - STAIR.turnZ), 0, 0];
    for (const side of [-1, 1]) {
      for (let i = 0; i <= STAIR.stepsPerFlight; i += 2) add(`stair-${flight}-post-${side}-${i}`, C.trim,
        [x + side * .71, startY + i * rise + .5, startZ + direction * i * run], [.07, 1.0, .07], 'structure', true);
      add(`stair-${flight}-rail-${side}`, C.trim, [x + side * .71, startY + (midY - base) / 2 + .98, (STAIR.startZ + STAIR.turnZ) / 2],
        [.075, .075, Math.hypot(midY - base, STAIR.startZ - STAIR.turnZ)], 'structure', true, rotation);
      add(`stair-${flight}-stringer-${side}`, C.wood, [x + side * .5, startY + (midY - base) / 2 - .16, (STAIR.startZ + STAIR.turnZ) / 2],
        [.12, .22, Math.hypot(midY - base, STAIR.startZ - STAIR.turnZ)], 'structure', false, rotation);
    }
  }
  add('mid-stair-landing', C.floor, [-6.5, midY - .11, -6.95], [3.0, .22, .9]);
  add('upper-stair-landing', C.floor, [STAIR.upperX, LEVELS.upper - .11, -2.95], [1.56, .22, 1.2]);
  for (const x of [STAIR.x - .78, STAIR.upperX + .78]) {
    add(`stairwell-guard-${x}`, C.trim, [x, LEVELS.upper + .98, -5.3], [.075, .075, 4.2], 'structure', true);
    for (let i = 0; i < 7; i++) add(`stairwell-baluster-${x}-${i}`, C.trim, [x, LEVELS.upper + .48, -7.35 + i * .68], [.06, .96, .06], 'structure', true);
  }

  // Eight retained student places: central aisle, perimeter circulation and a clear
  // teaching zone. Tables/chairs now have legs, aprons and correct floor contact.
  const desk = (id: string, x: number, z: number, width: number, depth: number, teacher = false) => {
    add(`${id}-top`, teacher ? '#ae8152' : '#bf9868', [x, base + .78, z], [width, .10, depth], 'furniture', true);
    add(`${id}-apron`, C.wood, [x, base + .64, z], [width - .10, .18, .055], 'furniture', true);
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) add(`${id}-leg-${sx}-${sz}`, '#6b6e60',
      [x + sx * (width / 2 - .10), base + .365, z + sz * (depth / 2 - .08)], [.065, .73, .065], 'furniture', true);
  };
  const chair = (id: string, x: number, z: number, faceBack = false) => {
    add(`${id}-seat`, '#ac8456', [x, base + .46, z], [.53, .08, .36], 'furniture', true);
    add(`${id}-back`, '#b59464', [x, base + .85, z + (faceBack ? -.20 : .20)], [.53, .46, .075], 'furniture', true);
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) add(`${id}-leg-${sx}-${sz}`, '#6b6e60', [x + sx * .20, base + .21, z + sz * .13], [.055, .42, .055], 'furniture', true);
    for (const sx of [-1, 1]) add(`${id}-back-upright-${sx}`, '#6b6e60', [x + sx * .20, base + .68, z + (faceBack ? -.20 : .20)], [.055, .52, .055], 'furniture', true);
  };
  for (let i = 0; i < 8; i++) {
    const x = (i % 2 ? 1 : -1) * 2.2, z = -.95 + Math.floor(i / 2) * .92;
    desk(`student-desk-${i + 1}`, x, z, 1.45, .46);
    chair(`student-chair-${i + 1}`, x, z + .32);
  }
  // The four spare tables in EACH legacy B/C wing are retained, relocated within
  // those wings to clear the new stairwell/circulation, and given proper supports.
  for (let i = 0; i < 4; i++) {
    desk(`spare-B-desk-${i + 1}`, i % 2 ? -1.65 : -3.15, -6.7 + Math.floor(i / 2) * 2, 1.15, .50);
    desk(`spare-C-desk-${i + 1}`, i % 2 ? -8.2 : -12.4, -1.7 + Math.floor(i / 2) * 1.1, 1.45, .50);
  }
  for (const [wing, x, z] of [['B', -2.8, -7.65], ['C', -11.9, -4.65]] as const) {
    add(`${wing}-ground-board-frame`, C.wood, [x, 2.05, z], [3.6, 1.7, .12], 'structure');
    add(`${wing}-ground-board`, '#335951', [x, 2.05, z + .08], [3.4, 1.5, .035], 'structure');
  }
  desk('teacher-desk', 2.65, -2.0, 1.7, .64, true);
  chair('teacher-chair', 2.65, -2.46, true);
  add('teacher-book', '#9683ad', [2.45, 1.27, -2], [.48, .08, .35], 'furniture');
  add('teacher-cup', '#c69b58', [3.18, 1.34, -2], [.10, .22, .10], 'furniture', false, undefined, 'cylinder');
  for (let i = 0; i < 3; i++) add(`teacher-pencil-${i}`, '#d1b45a', [3.14 + i * .04, 1.5, -2], [.018, .25, .018], 'furniture');
  add('blackboard-frame', C.wood, [0, 2.22, -2.635], [4.8, 1.72, .14], 'A01-back');
  add('blackboard-panel', '#31564d', [0, 2.22, -2.548], [4.56, 1.50, .035], 'A01-back');
  add('blackboard-tray', C.wood, [0, 1.36, -2.49], [4.8, .08, .23], 'A01-back');
  add('chalk', '#f4efd8', [-1.2, 1.415, -2.48], [.18, .025, .035], 'A01-back');
  add('eraser', '#92866c', [.8, 1.43, -2.48], [.25, .07, .10], 'A01-back');
  label('blackboard-writing', ['SELAMAT DATANG', 'BELAJAR • BERTANYA • BERBAGI'], [0, 2.22, -2.525], [4.3, 1.25], 'A01-back', undefined, 'chalk');
  // Original educational graphics/text; no stock images or new pupil identities.
  for (const [id, x, text] of [['numbers', -3.25, ['ANGKA', '1 + 2 = 3', '2 + 3 = 5']], ['water', 3.25, ['JAGA AIR', 'SUNGAI → KEBUN', 'HEMAT • RAWAT']]] as const) {
    add(`poster-${id}-backing`, '#dcc89e', [x, 2.7, -2.625], [1.06, .88, .06], 'A01-back');
    label(`poster-${id}`, text, [x, 2.7, -2.585], [1.0, .83], 'A01-back', undefined, 'poster');
  }
  add('clock-rim', C.wood, [0, 3.23, -2.62], [.23, .065, .23], 'A01-back', false, [Math.PI / 2, 0, 0], 'cylinder');
  add('clock-face', '#f5ecd5', [0, 3.23, -2.58], [.20, .025, .20], 'A01-back', false, [Math.PI / 2, 0, 0], 'cylinder');
  add('clock-minute-hand', C.trim, [0, 3.30, -2.55], [.02, .14, .018], 'A01-back');
  add('clock-hour-hand', C.trim, [.05, 3.23, -2.55], [.10, .023, .018], 'A01-back');
  // Bookshelf against the rear-left corner, outside the side and central routes.
  add('bookcase-back', C.wood, [-3.45, 1.24, -2.48], [.8, 1.65, .10], 'furniture', true);
  for (const x of [-3.89, -3.01]) add(`bookcase-side-${x}`, C.wood, [x, 1.24, -2.3], [.08, 1.65, .45], 'furniture', true);
  for (let i = 0; i < 4; i++) {
    const y = base + .07 + i * .50;
    add(`bookcase-shelf-${i}`, C.wood, [-3.45, y, -2.3], [.88, .08, .45], 'furniture', true);
    if (i < 3) for (let k = 0; k < 5; k++) add(`bookcase-book-${i}-${k}`, ['#ad826d', '#6e9a91', '#9386ad'][k % 3], [-3.78 + k * .15, y + .23, -2.3], [.10, .38, .25], 'furniture');
  }
  add('classroom-bin', '#6b8b7b', [3.62, .66, 2.19], [.20, .50, .20], 'furniture', true, undefined, 'cylinder');
  add('door-mat', '#a9a085', [0, .411, 2.2], [1.25, .022, .65], 'furniture');
  for (const z of [-1.55, .7]) for (const x of [-2, 2]) {
    add(`ceiling-light-housing-${x}-${z}`, C.trim, [x, 3.55, z], [.75, .06, .27], 'A-overhead');
    add(`ceiling-light-diffuser-${x}-${z}`, '#f7e5b5', [x, 3.51, z], [.67, .025, .23], 'A-overhead');
  }
  add('foyer-light', '#f7e5b5', [0, 3.47, 4.3], [.60, .06, .30], 'A-overhead');
  label('school-name-main', ['SEKOLAH PULAU GOBI'], [0, 3.52, 5.96], [7.5, .46], 'foyer-front');
  label('school-name-west', ['SEKOLAH PULAU GOBI'], [-10, 4.58, 4.03], [8, .9]);
  label('corridor-wayfinding', ['KORIDOR A → KELAS A01'], [2.85, 2.95, 5.95], [1.95, .30], 'foyer-front');
  label('west-wing-sign', ['SAYAP BARAT'], [-10, 3.27, .96], [2.6, .33]);

  // Static gate, bell, flag and real basketball rings; their published locations persist.
  for (const side of [-1, 1]) {
    add(`gate-post-${side}`, C.wood, [-1 + side * 1.68, 1.65, 12], [.23, 3.3, .23], 'site', true);
    leaf(`school-gate-${side}`, -1 + side * .8, 12, .04, 1.6, 1.45, 'site', side > 0);
  }
  add('gate-arch', C.trim, [-1, 3.3, 12], [3.6, .22, .28]);
  add('flag-red', '#cc3e39', [-13.15, 6.725, 10], [2.3, .75, .035]);
  add('flag-white', '#f5efdf', [-13.15, 5.975, 10], [2.3, .75, .035]);
  add('bell-post', C.wood, [-3.3, 2, 3.7], [.17, 4, .17], 'structure', true);
  add('bell-arm', C.wood, [-2.85, 3.92, 3.7], [1.05, .14, .14]);
  add('bell', '#d7b15f', [-2.4, 3.72, 3.7], [.23, .38, .23], 'site', false, undefined, 'cone');
  add('bell-rope', '#c4a366', [-2.4, 2.9, 3.7], [.035, 1.8, .035]);

  // Upper-floor inspection keeps its real slab and walls. Only the requested A02
  // infill/roof/ceiling is hidden; the original A01 cutaway keeps its prior behaviour.
  if (options.cutaway?.room === 'A02') {
    const cut = options.cutaway;
    const hidePart = (p: SchoolPart) => {
      if (cut.overhead && (/^A-(roof-|rafter-|tie-beam-)/.test(p.id) || p.section === 'A-overhead' && p.id.startsWith('upper-ceiling-'))) return true;
      return (cut.walls ?? []).some(w => p.id.startsWith(`A-1-${w}-panel-`) || p.id.startsWith(`A-1-${w}-skirting`) || p.id.startsWith(`A-1-${w}-`) && p.glass);
    };
    return {parts: parts.filter(p => !hidePart(p)), labels};
  }
  const hidden = new Set((options.cutaway?.walls ?? []).map(w => `A01-${w}`));
  // Foyer is retained as context. Only its camera-facing infill is removed with
  // the corresponding classroom face; jambs, wall thickness and posts stay visible.
  if (hidden.has('A01-front')) hidden.add('foyer-front');
  if (hidden.has('A01-east')) hidden.add('foyer-east');
  if (options.cutaway?.overhead) hidden.add('A-overhead');
  return {parts: parts.filter(p => !hidden.has(p.section)), labels: labels.filter(p => !hidden.has(p.section))};
}
