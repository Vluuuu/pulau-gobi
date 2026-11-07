import test from 'node:test';
import assert from 'node:assert/strict';
import {Box3, PerspectiveCamera, Vector3} from 'three';
import {fitView} from '../src/viewer/navigation.ts';
import {buildSchoolAsset} from '../src/world/postEp005/schoolAsset.ts';

test('A02 cutaway removes its roof/infill while preserving the actual upper floor', () => {
  const full = buildSchoolAsset();
  const cut = buildSchoolAsset({cutaway: {room: 'A02', overhead: true, walls: ['front', 'east']}});
  assert.ok(!cut.parts.some(p => /^A-(roof-|rafter-|tie-beam-)/.test(p.id)));
  assert.ok(!cut.parts.some(p => /^A-1-(front|east)-panel-/.test(p.id)));
  assert.ok(cut.parts.some(p => p.id.startsWith('A-1-back-panel-')));
  assert.ok(cut.parts.some(p => p.id.startsWith('A-1-west-panel-')));
  const upperSlab = full.parts.filter(p => p.id.startsWith('upper-floor-') && p.section === 'A-overhead');
  assert.ok(upperSlab.length > 0);
  for (const p of upperSlab) assert.deepEqual(cut.parts.find(q => q.id === p.id), p);
  assert.ok(cut.parts.some(p => p.id === 'A02-door-leaf'));
  assert.deepEqual(buildSchoolAsset(), full);
});

test('focus framing contains tall waterfall/world bounds at wide and narrow canvas aspects', () => {
  const box = new Box3(new Vector3(-52, -85, -52), new Vector3(52, 9, 58));
  for (const aspect of [.65, 1.6]) {
    const camera = new PerspectiveCamera(45, aspect, .08, 1600);
    const pose = fitView(box, camera);
    camera.position.copy(pose.position); camera.lookAt(pose.target); camera.updateMatrixWorld(true);
    for (const x of [box.min.x, box.max.x]) for (const y of [box.min.y, box.max.y]) for (const z of [box.min.z, box.max.z]) {
      const projected = new Vector3(x, y, z).project(camera);
      assert.ok(Math.abs(projected.x) <= 1 && Math.abs(projected.y) <= 1 && Math.abs(projected.z) <= 1);
    }
  }
});
