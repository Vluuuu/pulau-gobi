import test from 'node:test';
import assert from 'node:assert/strict';
import {buildSchoolAsset} from '../src/world/postEp005/schoolAsset.ts';
import {SCHOOL_ENTRY_ROUTE, UPPER_ACCESS_ROUTE, SCHOOL_PORTALS, SCHOOL_SITE, WINGS} from '../src/world/postEp005/schoolLayout.ts';
import {POST_EP005_WORLD} from '../src/world/postEp005/snapshot.ts';
import {CAST, COW_IDS} from '../src/episode005/direction.ts';
import {SCHOOL} from '../src/episode005/layout.ts';
import {SCHOOL_WINGS} from '../src/episode005/campus.ts';

const closed = buildSchoolAsset(), open = buildSchoolAsset({doors: 'open'});
const localPoint = (p, point) => {
  let [x, y, z] = point.map((v, i) => v - p.position[i]);
  const [rx, ry, rz] = p.rotation ?? [0, 0, 0];
  if (rz) [x, y] = [x * Math.cos(rz) + y * Math.sin(rz), -x * Math.sin(rz) + y * Math.cos(rz)];
  if (ry) [x, z] = [x * Math.cos(ry) - z * Math.sin(ry), x * Math.sin(ry) + z * Math.cos(ry)];
  if (rx) [y, z] = [y * Math.cos(rx) + z * Math.sin(rx), -y * Math.sin(rx) + z * Math.cos(rx)];
  return [x, y, z];
};
const intersectsSphere = (p, point, radius) => {
  const q = localPoint(p, point);
  const half = p.size.map((v, i) => p.kind === 'cylinder' && i !== 1 ? v : v / 2);
  return q.reduce((n, v, i) => n + Math.max(0, Math.abs(v) - half[i]) ** 2, 0) < radius ** 2 - 1e-7;
};
const sampleRoute = route => route.slice(1).flatMap((end, i) => {
  const start = route[i], count = Math.ceil(Math.hypot(...end.map((v, j) => v - start[j])) / .10);
  return Array.from({length: count + 1}, (_, k) => start.map((v, j) => v + (end[j] - v) * k / count));
});

test('default school is enclosed, furnished and remains at the three published wing anchors', () => {
  assert.deepEqual(SCHOOL_SITE.position, SCHOOL.position);
  assert.deepEqual(WINGS.map(({id, x, z}) => ({id, x, z})), SCHOOL_WINGS);
  assert.equal(new Set(closed.parts.map(p => p.id)).size, closed.parts.length);
  for (const p of closed.parts) {
    assert.ok(p.size.every(v => Number.isFinite(v) && v > 0), p.id);
    assert.ok(p.position.every(Number.isFinite), p.id);
  }
  for (const side of ['front', 'back', 'east', 'west']) assert.ok(closed.parts.some(p => p.section === `A01-${side}` && p.collision), side);
  for (const id of ['A-roof-ridge', 'A-rafter-1-0', 'foyer-ceiling', 'blackboard-panel', 'teacher-desk-top', 'teacher-chair-seat']) assert.ok(closed.parts.some(p => p.id === id), id);
  assert.equal(closed.parts.filter(p => /^student-desk-\d+-top$/.test(p.id)).length, 8);
  assert.equal(closed.parts.filter(p => /^student-chair-\d+-seat$/.test(p.id)).length, 8);
  for (const wing of ['B', 'C']) assert.equal(closed.parts.filter(p => new RegExp(`^spare-${wing}-desk-\\d+-top$`).test(p.id)).length, 4);
  // Check the centre of every window is a genuine hole in the opaque wall.
  for (const p of closed.parts.filter(p => p.glass)) {
    assert.ok(!closed.parts.some(w => w.id.includes('-panel-') && intersectsSphere(w, p.position, .015)), p.id);
  }
  assert.ok(SCHOOL_PORTALS.every(p => p.height >= 2.6 && p.width >= 1.5));
});

test('a 0.60-wide, 2.2-high pedestrian can enter A01 and reach the upper storey with doors open', () => {
  const solids = open.parts.filter(p => p.collision), issues = [];
  const supports = open.parts.filter(p => /floor(?:-|$)|veranda-|^link-|landing|tread-|entry-step-/.test(p.id) && p.kind === 'box' && !p.rotation);
  for (const [name, route] of [['A01', SCHOOL_ENTRY_ROUTE], ['upper', UPPER_ACCESS_ROUTE]]) {
    for (const point of sampleRoute(route)) {
      for (const h of [.31, .85, 1.4, 1.9]) {
        const hit = solids.find(p => intersectsSphere(p, [point[0], point[1] + h, point[2]], .30));
        if (hit) {issues.push(`${name} collision ${hit.id} near ${point.map(n => n.toFixed(2))}`); break;}
      }
      if (point[2] > 6.7) continue; // Unchanged terrain supports the exterior approach.
      for (const [dx, dz] of [[0, 0], [.23, 0], [-.23, 0], [0, .23], [0, -.23]]) {
        if (point[2] + dz > 6.75 && point[1] < .24) continue;
        if (!supports.some(p => Math.abs(point[0] + dx - p.position[0]) <= p.size[0] / 2 + .01 &&
          Math.abs(point[2] + dz - p.position[2]) <= p.size[2] / 2 + .01 &&
          // The perimeter of a foot-sized support sample can span adjacent risers;
          // metadata follows the stair slope, rather than animating individual feet.
          Math.abs(point[1] - p.position[1] - p.size[1] / 2) < (p.id.includes('tread-') ? .33 : .24))) {
          issues.push(`${name} unsupported near ${point.map(n => n.toFixed(2))}`); break;
        }
      }
    }
  }
  assert.deepEqual(issues.slice(0, 20), []);
});

test('cutaway is an explicit reversible selection; structural jambs and corridor context survive', () => {
  const cut = buildSchoolAsset({cutaway: {room: 'A01', walls: ['front', 'east'], overhead: true}});
  assert.ok(!cut.parts.some(p => ['A01-front', 'A01-east', 'A-overhead'].includes(p.section)));
  for (const section of ['A01-frames', 'A01-back', 'A01-west', 'structure', 'site']) assert.ok(cut.parts.some(p => p.section === section), section);
  assert.ok(cut.parts.some(p => p.id === 'foyer-west-door-header'));
  assert.ok(cut.parts.some(p => p.id === 'A-0-front-door-jamb-1'));
  assert.deepEqual(buildSchoolAsset(), closed);
  assert.ok(closed.parts.some(p => p.id === 'A-roof-ridge'));
});

test('post-episode snapshot preserves twelve residents, cow identities and unfinished student selection', () => {
  const state = POST_EP005_WORLD;
  assert.equal(state.basedOnCommit.slice(0, 7), '3093d8b');
  assert.deepEqual(state.population.residents, CAST);
  assert.equal(state.population.residents.length, 12);
  assert.deepEqual(state.population.cows.map(c => c.id), COW_IDS);
  assert.ok(state.population.cows.every(c => c.location === 'ranch-004'));
  assert.equal(state.school.firstTeacherId, 'warga-11');
  assert.deepEqual(state.school.selectedStudentIds, []);
  assert.equal(state.progress.kost.roomCount, 6);
  assert.deepEqual(state.water.original.centerline.at(-1), state.water.extension[0]);
  assert.ok(Object.isFrozen(state.population.residents[0].visual));
  assert.ok(!Object.isFrozen(CAST));
  assert.throws(() => state.school.selectedStudentIds.push('new-student'), TypeError);
});
