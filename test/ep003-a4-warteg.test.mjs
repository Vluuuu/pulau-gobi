import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {Box3,Euler,Matrix4,Quaternion,Vector3} from 'three';
import {DECOR} from '../src/episode002/islandDecor.ts';
import {WARTEG,WARTEG_COLORS,WARTEG_STOCK,WARTEG_GLYPHS,WARTEG_ACCESS,WARTEG_LOCAL_ANCHORS as A,DEFAULT_WARTEG_PLACEMENT as D,
  buildWartegStructure,buildWartegCounter,buildWartegDisplay,buildWartegGlass,buildWartegRoof,buildWartegDetails,buildWartegEffects,
  letteringParts,wartegParts,wartegPose,resolveWartegPlacement,wartegLocalToWorld,frameSeconds} from '../src/episode003/world/warteg/wartegModel.ts';

const near=(a,b,e=1e-7)=>assert.ok(Math.abs(a-b)<=e,`${a} != ${b}`);
const byId=(parts,id)=>{const p=parts.find(p=>p.id===id);assert.ok(p,id);return p;};
const bounds=(part)=>{
  const r=part.kind&&part.kind!=='box'?1:0.5;
  const ymin=part.kind==='cylinder'?-0.5:-r,ymax=-ymin;
  return new Box3(new Vector3(-r,ymin,-r),new Vector3(r,ymax,r)).applyMatrix4(new Matrix4().compose(new Vector3(...part.position),new Quaternion().setFromEuler(new Euler(...(part.rotation??[0,0,0]))),new Vector3(...part.size)));
};
const circleGap=(point,box)=>Math.hypot(Math.max(box.min.x-point[0],0,point[0]-box.max.x),Math.max(box.min.z-point[2],0,point[2]-box.max.z))-WARTEG_ACCESS.bodyRadius;

test('defaults match shared world coordinates and ground/front axes',()=>{
  assert.deepEqual(D,{position:[14,0,6],rotationY:3*Math.PI/4,scale:1.5});
  assert.deepEqual(wartegLocalToWorld([0,0,0]),[14,0,6]);
  for(const point of [A.vendor,A.customer])assert.equal(point[1],0);
  assert.ok(A.vendor[2]<WARTEG.counterZ-WARTEG.counterDepth/2);
  assert.ok(A.customer[2]>WARTEG.counterZ+WARTEG.counterDepth/2);
  assert.ok(A.counterFocus[1]>WARTEG.counterTop&&A.counterFocus[1]<WARTEG.caseTop);
});
test('zero/negative/NaN progress has no asset, glass, sign or effect',()=>{
  for(const p of [0,-1,-Infinity,NaN]){
    assert.deepEqual(wartegParts(p,30),[]);assert.deepEqual(buildWartegGlass(p),[]);
  }
});
test('VO ordering is visible: meja before etalase, etalase before atap',()=>{
  const table=wartegParts(0.35);
  byId(table,'counter-top');assert.ok(!table.some(p=>/^(display|tray|food|roof|warteg-sign)/.test(p.id)));
  const display=wartegParts(0.6);byId(display,'display-base');byId(display,'food-rice-0');
  assert.ok(!display.some(p=>p.id.startsWith('roof-')));
  const roof=wartegParts(0.82);assert.equal(roof.filter(p=>p.id.startsWith('roof-slab-')).length,2);
  assert.equal(roof.filter(p=>/^tray-.*-base$/.test(p.id)).length,4);
  assert.ok(wartegParts(1).some(p=>p.id==='warteg-sign-board'));
});
test('four limited-stock food trays contain eleven logical portions, not a crowded restaurant',()=>{
  const parts=buildWartegDisplay(1);
  assert.equal(WARTEG_STOCK.length,4);
  assert.equal(WARTEG_STOCK.reduce((n,t)=>n+t.portions,0),11);
  assert.equal(parts.filter(p=>/^tray-.*-base$/.test(p.id)).length,4);
  for(const tray of WARTEG_STOCK)assert.equal(parts.filter(p=>new RegExp(`^food-${tray.id}-\\d+$`).test(p.id)).length,tray.portions);
  assert.equal(parts.filter(p=>p.id.startsWith('serving-plate-')).length,2);
});
test('food/trays fit within case and touch their supporting shelves at final state',()=>{
  const parts=buildWartegDisplay(1);
  for(const tray of WARTEG_STOCK){
    const plate=bounds(byId(parts,`tray-${tray.id}-base`));
    assert.ok(plate.min.x>-1.86&&plate.max.x<0.56);
    assert.ok(plate.min.z>0.58&&plate.max.z<1.30);
    for(let i=0;i<tray.portions;i++){
      const food=bounds(byId(parts,`food-${tray.id}-${i}`));
      assert.ok(food.min.y>=plate.min.y-0.01&&food.min.y<=plate.max.y+0.03);
      assert.ok(food.max.y<WARTEG.caseTop-0.1);
    }
  }
});
test('glass stays thin and transparent; no dark closed box hides the food',()=>{
  const panes=buildWartegGlass(1);assert.equal(panes.length,3);
  for(const pane of panes){assert.ok(pane.opacity>0&&pane.opacity<=0.12);assert.ok(pane.size.every(v=>v>0));}
  assert.equal(panes.filter(p=>p.id==='glass-front').length,1);
  assert.ok(!panes.some(p=>/back|bottom|top/.test(p.id)));
});
test('vendor/customer body envelopes avoid counter, glass frames and structural obstacles',()=>{
  for(const point of [A.vendor,A.customer])for(const part of wartegParts(1)){
    const b=bounds(part);if(b.min.y>=WARTEG_ACCESS.headHeight||b.max.y<=0.01)continue;
    assert.ok(circleGap(point,b)>0,`${part.id} blocks anchor ${point}`);
  }
  assert.ok(A.customer[2]-A.vendor[2]>2*WARTEG_ACCESS.bodyRadius+WARTEG.counterDepth);
});
test('right-hand entry route is unobstructed for a 0.36 local radius body with 1.7 head height',()=>{
  const path=[WARTEG_ACCESS.entry,WARTEG_ACCESS.aisle,A.vendor];
  let minGap=Infinity;
  for(let segment=0;segment<path.length-1;segment++)for(let i=0;i<=60;i++){
    const a=path[segment],b=path[segment+1],t=i/60,point=a.map((v,k)=>v+(b[k]-v)*t);
    for(const part of wartegParts(1)){
      const box=bounds(part);if(box.min.y>=WARTEG_ACCESS.headHeight||box.max.y<=0.01)continue;
      minGap=Math.min(minGap,circleGap(point,box));
    }
  }
  assert.ok(minGap>0.04,`minimum route clearance ${minGap}`);
});
test('perimeter foundations preserve ground Y=0 for the vendor and approach',()=>{
  const parts=buildWartegStructure(1);
  for(const part of parts.filter(p=>p.id.startsWith('foundation-foot')||p.id.includes('plinth')))near(bounds(part).min.y,0);
  assert.ok(!parts.some(p=>/floor|platform/.test(p.id)));
  assert.equal(A.vendor[1],0);
});
test('signage is actual geometry spelling WARTEG and menu NASI/LAUK without external fonts',()=>{
  for(const c of 'WARTEGNASILUK'){
    assert.equal(WARTEG_GLYPHS[c].length,7);
    assert.ok(WARTEG_GLYPHS[c].every(row=>/^[01]{5}$/.test(row)));
  }
  const letters=letteringParts('WARTEG',[0,2.46,2.262],0.065,'test');
  assert.ok(letters.length>40);
  for(const p of letters){const b=bounds(p);assert.ok(b.min.x>-1.36&&b.max.x<1.36&&b.min.y>2.16&&b.max.y<2.76);}
  assert.ok(buildWartegDetails(1).some(p=>p.id.startsWith('menu-nasi')));
  assert.ok(buildWartegDetails(1).some(p=>p.id.startsWith('menu-lauk')));
});
test('roof has one pair of slabs and one ridge; plate/case stages leave it open for close-ups',()=>{
  for(const p of [0,0.35,0.6,0.72])assert.deepEqual(buildWartegRoof(p),[]);
  const roof=buildWartegRoof(1);assert.equal(roof.filter(p=>p.id.startsWith('roof-slab-')).length,2);
  assert.equal(roof.filter(p=>p.id==='roof-ridge').length,1);
  assert.ok(WARTEG.roofEave>WARTEG_ACCESS.headHeight+0.5);
});
test('roof fascia remains attached to each moving/scaling slab throughout construction',()=>{
  for(const p of [0.73,0.78,0.82,0.89,1]){
    const roof=buildWartegRoof(p,30);
    for(const slab of roof.filter(part=>part.id.startsWith('roof-slab-'))){
      const side=slab.id.slice('roof-slab-'.length);
      for(const z of [-1,1]){
        const trim=byId(roof,`roof-fascia-${side}-${z}`);
        near(trim.position[0],slab.position[0]);near(trim.position[1],slab.position[1]);
        near(Math.abs(trim.position[2])-slab.size[2]/2,0.025);
        assert.ok(Math.abs(trim.position[2])-trim.size[2]/2<slab.size[2]/2);
      }
    }
  }
});
test('custom/default transforms and malformed props are deterministic and safe',()=>{
  const custom=resolveWartegPlacement({position:Object.freeze([3,2,-7]),rotationY:Math.PI/2,scale:2});
  const point=wartegLocalToWorld([0,1,3],custom);near(point[0],9);near(point[1],4);near(point[2],-7);
  for(const input of [{position:[NaN,0,0]},{position:[0,Infinity,0]},{rotationY:NaN},{rotationY:Infinity},{scale:0},{scale:-1},{scale:NaN}])assert.deepEqual(resolveWartegPlacement(input),D);
});
test('out-of-range progress clamps; invalid frames equal zero at 30 FPS',()=>{
  assert.equal(frameSeconds(30),1);assert.equal(frameSeconds(45),1.5);
  for(const p of [2,Infinity])assert.deepEqual(wartegParts(p,19),wartegParts(1,19));
  for(const f of [NaN,Infinity,-Infinity])for(const p of [0.2,0.6,0.87,0.96,1])assert.deepEqual(wartegParts(p,f),wartegParts(p,0));
});
test('all phases produce finite transforms, positive sizes, unique IDs and a bounded part budget',()=>{
  for(let i=0;i<=200;i++){
    const parts=wartegParts(i/200,i*13);
    assert.equal(new Set(parts.map(p=>p.id)).size,parts.length);
    assert.ok(parts.length<500,`part count ${parts.length}`);
    for(const part of parts){assert.ok([...part.position,...part.size,...(part.rotation??[])].every(Number.isFinite),part.id);assert.ok(part.size.every(v=>v>0),part.id);}
    for(const pane of buildWartegGlass(i/200))assert.ok([...pane.position,...pane.size,pane.opacity].every(Number.isFinite));
  }
});
test('out-of-order seeks reproduce complete asset and finish is stable for every frame',()=>{
  const expected=wartegParts(0.87,37);for(const p of [1,0,0.4,0.95,-1])wartegParts(p,300);
  assert.deepEqual(wartegParts(0.87,37),expected);
  for(const f of [-60,0,120,3000]){assert.deepEqual(wartegParts(1,f),wartegParts(1,0));assert.deepEqual(buildWartegEffects(1,f),[]);}
  assert.notEqual(wartegPose(0.87,0).signSway,wartegPose(0.87,30).signSway);
});
test('default footprint fits the actual provisional octagon and clears old properties/action area',()=>{
  const boundary=(x,z,r)=>{let a=((Math.atan2(x,z)%(Math.PI/4))+Math.PI/4)%(Math.PI/4);a=Math.min(a,Math.PI/4-a);return r*Math.cos(Math.PI/8)/Math.cos(a);};
  for(const part of wartegParts(1)){
    const b=bounds(part);
    for(const x of [b.min.x,b.max.x])for(const z of [b.min.z,b.max.z]){
      const w=wartegLocalToWorld([x,0,z]);assert.ok(Math.hypot(w[0],w[2])<boundary(w[0],w[2],35));
      assert.ok(Math.hypot(w[0]+5,w[2]+1)>10);
      assert.ok(Math.hypot(w[0]-4.9,w[2]+2.6)>4.4);
      assert.ok(w[0]>5.5);
    }
  }
});
test('preserved EP002 decoration trunks/roots do not collide with warteg structural footprint',()=>{
  const c=Math.cos(D.rotationY),s=Math.sin(D.rotationY);
  for(const d of DECOR){
    const dx=(d.x-D.position[0])/D.scale,dz=(d.z-D.position[2])/D.scale;
    const local=[dx*c-dz*s,0,dx*s+dz*c];
    const radius=d.kind==='tree'?0.2*d.size:d.kind==='bush'?0.65*d.size:0.18*d.size;
    for(const part of [...buildWartegStructure(1),...buildWartegCounter(1)]){
      const b=bounds(part);if(b.min.y>0.4)continue;
      const dist=Math.hypot(Math.max(b.min.x-local[0],0,local[0]-b.max.x),Math.max(b.min.z-local[2],0,local[2]-b.max.z));
      assert.ok(dist>radius/D.scale,`old ${d.kind} at ${d.x},${d.z} intersects ${part.id}`);
    }
  }
});
test('runtime sources do not own clocks, characters, external fonts or sibling modules',()=>{
  for(const f of ['wartegModel.ts','WartegPartBatch.tsx','WartegEP003.tsx']){
    const source=readFileSync(new URL(`../src/episode003/world/warteg/${f}`,import.meta.url),'utf8');
    assert.doesNotMatch(source,/Math\.random\s*\(|Date\s*[.(]|performance\.|setTimeout\s*\(|setInterval\s*\(|useFrame\s*\(|fetch\s*\(|document\./);
    assert.doesNotMatch(source,/from\s+['"].*(episode002|house\/|terrain\/|river\/|characters\/|world\/layout)['"]/);
  }
});
