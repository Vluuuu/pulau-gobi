import test from 'node:test';
import assert from 'node:assert/strict';
import {EP003_ROSTER,EP003_POPULATION_INCLUDING_GOBI} from '../src/episode003/state/roster.ts';
import {EP003_WORLD_LAYOUT as L} from '../src/episode003/world/layout.ts';
import {distanceToPolylineXZ,octagonBoundaryRadius} from '../src/episode003/world/terrain/terrainMath.ts';
import {gobiPoseAt,gobiPositionAt,residentPoseAt,residentPosesAt,NAME_WINDOWS,WARTEG_WORLD_ANCHORS} from '../src/episode003/direction/acting.ts';
import {cameraAt,EP003_SHOTS} from '../src/episode003/camera/cameraPlan.ts';
import {buildProgress} from '../src/episode003/direction/timeline.ts';
import {DECOR} from '../src/episode002/islandDecor.ts';
import {obstacleDistance,makeObstacles} from '../src/episode002/villagerPath.ts';
import {OrthographicCamera,Vector3} from 'three';

test('six permanent residents retain stable IDs, all four new models appear by outro',()=>{
  assert.equal(EP003_ROSTER.length,6);assert.equal(EP003_POPULATION_INCLUDING_GOBI,7);
  assert.deepEqual(EP003_ROSTER.map(r=>r.id),['warga-1','warga-2','warga-3','warga-4','warga-5','warga-6']);
  assert.equal(residentPosesAt(2900).filter(r=>r.visible).length,6);
  assert.equal(residentPosesAt(0).filter(r=>r.visible).length,2);
});
test('temporary name windows are 75 frames and no name is permanent',()=>{
  for(const [start,end]of Object.values(NAME_WINDOWS))assert.equal(end-start,75);
});
test('Gobi and all resident transforms stay finite throughout 3000 frames',()=>{
  for(let f=0;f<3000;f++){
    const g=gobiPoseAt(f);assert.ok(Object.values(g).every(Number.isFinite));
    for(const r of residentPosesAt(f))assert.ok([...r.position,r.heading,r.walk,r.wave,r.pay,r.watch,r.scale].every(Number.isFinite));
    assert.ok(g.pocket>=0&&g.pocket<=1&&g.walk>=0&&g.walk<=1);
  }
});
test('no Gobi teleport: consecutive sampled positions are bounded',()=>{
  let max=0;for(let f=1;f<3000;f++){const a=gobiPositionAt(f-1),b=gobiPositionAt(f);max=Math.max(max,Math.hypot(a[0]-b[0],a[2]-b[2]));}
  assert.ok(max<0.20,`max step ${max}`);
});
test('actors stay on visible terrain and clear the river trench',()=>{
  for(let f=0;f<3000;f+=3){
    const radius=L.initialRadius+(L.targetRadius-L.initialRadius)*(()=>{const p=buildProgress(f,'expansion');return p*p*(3-2*p);})();
    const positions=[gobiPositionAt(f),...residentPosesAt(f).filter(r=>r.visible).map(r=>r.position)];
    for(const [x,,z]of positions){assert.ok(Math.hypot(x,z)+0.35<octagonBoundaryRadius(Math.atan2(x,z),radius),`edge at ${f}: ${x},${z}`);
      assert.ok(distanceToPolylineXZ(x,z,L.river.centerline)>2.5,`trench at ${f}`);}
  }
});
test('vendor/customer use actual A4 anchors, payment and pocket beat overlap real VO',()=>{
  const vendor=residentPoseAt('warga-3',2105);assert.deepEqual(vendor.position,WARTEG_WORLD_ANCHORS.vendor);assert.ok(vendor.pay>0.7);
  assert.deepEqual(gobiPositionAt(2070),WARTEG_WORLD_ANCHORS.customer);
  assert.ok(gobiPoseAt(2160).pocket>0.7);assert.ok(gobiPoseAt(2210).surprise>0.7);
  assert.ok(residentPoseAt('warga-3',1805).wave>0.7);
});
test('Gobi does not collide with resident body centers during production',()=>{
  for(let f=0;f<3000;f+=3){const g=gobiPositionAt(f);for(const r of residentPosesAt(f).filter(r=>r.visible&&r.scale>0.9)){
    assert.ok(Math.hypot(g[0]-r.position[0],g[2]-r.position[2])>0.90,`${r.id} collision at ${f}`);
  }}
});
test('all actors clear old house, unharvested rice, tree trunks and bushes at every frame',()=>{
  const obstacles=makeObstacles(L.house,L.riceField).slice(0,2),decor=DECOR.filter(d=>d.kind==='tree'||d.kind==='bush');
  for(let f=0;f<3000;f++)for(const a of [{id:'gobi',position:gobiPositionAt(f)},...residentPosesAt(f).filter(r=>r.visible&&r.scale>.9)]){
    const [x,,z]=a.position;
    for(const o of obstacles)assert.ok(obstacleDistance(o,x,z)>.5,`${a.id} building at ${f}`);
    for(const d of decor)assert.ok(Math.hypot(x-d.x,z-d.z)>.5+(d.kind==='tree'?.2:.65)*d.size,`${a.id} ${d.kind} at ${f}`);
  }
});
test('speaking close-ups keep foreground residents clear of Gobi face at reviewed frames',()=>{
  for(const f of [30,450,1370,2010,2220,2520,2890,2990]){
    const p=cameraAt(f),c=new OrthographicCamera(-540,540,960,-960,.1,260);c.position.set(...p.position);c.zoom=p.zoom;c.lookAt(...p.target);c.updateMatrixWorld(true);c.updateProjectionMatrix();
    const g=gobiPositionAt(f),head=new Vector3(g[0],1.6,g[2]).project(c);
    for(const r of residentPosesAt(f).filter(r=>r.visible&&r.scale>.9)){
      const n=new Vector3(r.position[0],1.78,r.position[2]).project(c);
      if(n.z<head.z)assert.ok(Math.hypot((n.x-head.x)*540,(n.y-head.y)*960)>.7*p.zoom,`${r.id} face occlusion ${f}`);
    }
  }
});
test('frame seeks are deterministic; final budget does not mutate roster/state',()=>{
  const before=JSON.stringify(EP003_ROSTER),a=gobiPoseAt(2190),c=cameraAt(2190);
  for(const f of [2999,0,820,1600,2000]){gobiPoseAt(f);residentPosesAt(f);cameraAt(f);}
  assert.deepEqual(gobiPoseAt(2190),a);assert.deepEqual(cameraAt(2190),c);assert.equal(JSON.stringify(EP003_ROSTER),before);
});
test('camera presets include all required cinematic shot families',()=>{
  const modes=new Set(EP003_SHOTS.map(s=>s.preset));for(const m of ['GobiFrontCloseup','GobiReaction','OverShoulder','ObjectDetail','ConstructionReveal','IslandWide','WartegTwoShot','PocketDetail','RiverTracking'])assert.ok(modes.has(m));
});
test('camera lens stays outside house and built warteg roof envelopes',()=>{
  const obstacles=[{kind:'rect',x:-5,z:-1,rotY:Math.PI/4,hx:3.2,zMin:-2.6,zMax:3.4,height:13},
    {kind:'rect',x:14,z:6,rotY:3*Math.PI/4,hx:4.17,zMin:-3.263,zMax:3.263,height:5.5}];
  for(let f=0;f<3000;f++){const {position:[x,y,z]}=cameraAt(f);
    obstacles.forEach((o,i)=>{if((i===0||buildProgress(f,'warteg')>.1)&&y<o.height)assert.ok(obstacleDistance(o,x,z)>.1,`lens in building ${i}, frame ${f}`);});
  }
});
test('camera vectors/zoom remain finite, far from target and avoid extreme speed jumps',()=>{
  let maxTargetStep=0,maxPositionStep=0,maxZoomRatio=0;
  for(let f=0;f<3000;f++){
    const c=cameraAt(f);assert.ok([...c.position,...c.target,c.zoom].every(Number.isFinite));assert.ok(c.zoom>=10&&c.zoom<=850);
    assert.ok(Math.hypot(...c.position.map((v,i)=>v-c.target[i]))>=39.99);
    if(f){const p=cameraAt(f-1);maxTargetStep=Math.max(maxTargetStep,Math.hypot(...c.target.map((v,i)=>v-p.target[i])));
      maxPositionStep=Math.max(maxPositionStep,Math.hypot(...c.position.map((v,i)=>v-p.position[i])));maxZoomRatio=Math.max(maxZoomRatio,Math.abs(Math.log(c.zoom/p.zoom)));}
  }
  assert.ok(maxTargetStep<2.5,`target step ${maxTargetStep}`);assert.ok(maxPositionStep<8,`lens step ${maxPositionStep}`);assert.ok(maxZoomRatio<0.30,`zoom jump ${maxZoomRatio}`);
});
