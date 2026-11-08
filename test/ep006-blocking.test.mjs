import test from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {PerspectiveCamera,Vector3} from 'three';
import * as T from '../src/episode006/choreography.ts';
import {studentAt,adultAt,gobiAt} from '../src/episode006/direction.ts';
import {cameraAt} from '../src/episode006/camera.ts';
import {shot,SPLASH_FRAME} from '../src/episode006/shots.ts';
import {E} from '../src/episode006/timeline.ts';
import {BRIDGE,bridgePoint,OBS_SPOTS,HEADMASTER_OBS,TEACHER_OBS,GOBI_OBS,RIVER_LINE,SEATS} from '../src/world/ep006/layout.ts';
import {NATURE006,TRANSPLANTS} from '../src/world/ep006/landscaping.ts';
import {RESIDENTS,STUDENTS} from '../src/world/ep006/roster.ts';
import {fishAt} from '../src/world/ep006/waterModel.ts';
import {buildSchoolAsset} from '../src/world/postEp005/schoolAsset.ts';
import {toWorld} from '../src/world/postEp005/schoolLayout.ts';
const distance=(a,b)=>Math.hypot(...a.map((v,i)=>v-b[i]));
const moving=(p)=>p.speed>.1;
// Envelope comes from the meshes: pupil .235 hair / .235 shoulder + sleeve,
// adult .27 shoulder * 1.65 + sleeve, Gobi .46 shoulder + sleeve. Seated
// pupils tuck their arms toward the desk; upright reactions need more room.
function cast(f){
 const kids=STUDENTS.map((s,i)=>{const p=studentAt(i,f);return {id:s.id,p,r:p.seat>.98?.31:moving(p)?T.BODY_SPACE.student.walkRadius:T.BODY_SPACE.student.reactRadius};});
 const adults=['warga-11','warga-21'].map(id=>{const p=adultAt(id,f);return {id,p,r:moving(p)?T.BODY_SPACE.adult.walkRadius:T.BODY_SPACE.adult.reactRadius};});
 const retained=RESIDENTS.filter(r=>!STUDENTS.some(s=>s.id===r.id)&&!['warga-11','warga-21'].includes(r.id)).map(r=>({id:r.id,p:adultAt(r.id,f),r:T.BODY_SPACE.adult.walkRadius,retained:true}));
 const g=gobiAt(f);return [...kids,...adults,{id:'gobi',p:{...g.motion,position:g.position},r:moving(g.motion)?T.BODY_SPACE.gobi.walkRadius:T.BODY_SPACE.gobi.reactRadius},...retained];
}
const windows=[['school',E(20.7),E(34.44)-1],['field',E(34.44),E(57)-1],['cross/deck',E(62.94),E(78.2)-1],['return',E(80.5),E(103)]];
test('body-sized separation throughout entry, field march, bridge, deck and return',()=>{
 const worst=new Map();
 for(const [name,a,b] of windows)for(let f=a;f<=b;f++){
  const all=cast(f);
  for(let i=0;i<all.length;i++)for(let j=i+1;j<all.length;j++){
   const x=all[i],y=all[j];if(x.retained&&y.retained||Math.abs(x.p.position[1]-y.p.position[1])>.7)continue;
   const gap=Math.hypot(x.p.position[0]-y.p.position[0],x.p.position[2]-y.p.position[2])-x.r-y.r,k=`${name}:${x.id}/${y.id}`;
   if(gap<-.015&&(!worst.has(k)||gap<worst.get(k).gap))worst.set(k,{pair:k,frame:f,gap:+gap.toFixed(3),a:x.p.position,b:y.p.position});
  }
 }
 assert.equal(worst.size,0,JSON.stringify([...worst.values()].sort((a,b)=>a.gap-b.gap),null,2));
});
test('shared legs join exactly; starts, arrivals and intervening shot cuts preserve positions',()=>{
 const plans=[...T.ENTRY.map(p=>p.plan),...T.EXIT.map(p=>p.plan),...T.CROSS,...T.RETURN,...Object.values(T.ADULT_FIELD),...Object.values(T.ADULT_CROSS),...Object.values(T.ADULT_RETURN)];
 for(const plan of plans)for(let i=1;i<plan.length;i++)assert.ok(distance(plan[i-1].t.points.at(-1),plan[i].t.points[0])<1e-9);
 for(let i=0;i<8;i++)for(const p of [T.ENTRY[i].plan,T.EXIT[i].plan,T.CROSS[i],T.RETURN[i]])for(const l of p)for(const f of [l.start,l.end]){
  assert.ok(distance(studentAt(i,f-.01).position,studentAt(i,f+.01).position)<.01,`pupil ${i} at ${f}`);
 }
 for(const id of ['warga-11','warga-21'])for(const plans of [T.ADULT_FIELD,T.ADULT_CROSS,T.ADULT_RETURN])for(const l of plans[id])for(const f of [l.start,l.end])assert.ok(distance(adultAt(id,f-.01).position,adultAt(id,f+.01).position)<.01,`${id} at ${f}`);
 assert.ok(T.CROSS_END<E(72.69));assert.ok(T.ENTRY_END<E(29.31));
 for(let i=0;i<8;i++)assert.deepEqual(studentAt(i,T.RETURN_END+1).position,T.HOME_SPOTS[i]);
});
test('both door lanes clear Gobi/Ghanim and each pupil approaches the actual seat from its side',()=>{
 const gateTimes=T.ENTRY_ORDER.map(i=>T.ENTRY[i].plan[1].start);
 for(let i=1;i<gateTimes.length;i++)assert.equal(gateTimes[i]-gateTimes[i-1],21);
 for(let i=0;i<8;i++){
  assert.ok(Math.abs(T.ENTRY[i].plan[2].t.points.at(-1)[0]-SEATS[i].position[0])>.6);
  for(let f=T.ENTRY[i].plan[0].start;f<T.EXIT[i].plan[2].end;f++){
   const p=studentAt(i,f),[x,,z]=p.position;
   if(Math.abs(z+19.2)<.25)assert.ok(Math.abs(x+20)+T.BODY_SPACE.student.walkRadius<.75,`pupil ${i} class threshold ${f}`);
   if(Math.abs(z+16.16)<.25)assert.ok(Math.abs(x+20)+T.BODY_SPACE.student.walkRadius<1.2,`pupil ${i} main threshold ${f}`);
  }
 }
 assert.ok(T.GOBI_SCHOOL.t.points.every(p=>p[2]>-19));
 assert.ok(T.ADULT_FIELD['warga-21'][0].t.points.every(p=>p[2]>-19));
 assert.equal(new Set([...Array.from({length:10},(_,i)=>T.waitSpot(i)),...OBS_SPOTS,HEADMASTER_OBS,TEACHER_OBS,GOBI_OBS].map(p=>p.join(','))).size,21);
});
// Oriented boxes, rather than root-to-furniture point distances. Only moving
// torsos are checked here; supported seated legs and writing hands are contacts.
function overlaps(a,b){
 if(Math.abs(a.p[1]-b.p[1])>=a.h[1]+b.h[1]-.001)return false;
 for(const yaw of [a.yaw,b.yaw])for(const turn of [0,Math.PI/2]){
  const v=[Math.cos(yaw+turn),-Math.sin(yaw+turn)],d=Math.abs((a.p[0]-b.p[0])*v[0]+(a.p[2]-b.p[2])*v[1]);
  const extent=o=>Math.abs(Math.cos(o.yaw)*v[0]-Math.sin(o.yaw)*v[1])*o.h[0]+Math.abs(Math.sin(o.yaw)*v[0]+Math.cos(o.yaw)*v[1])*o.h[2];
  if(d>=extent(a)+extent(b)-.001)return false;
 }return true;
}
test('moving pupil torsos clear complete classroom furniture and ground-floor walls',()=>{
 const asset=buildSchoolAsset({doors:'open'}),parts=asset.parts.filter(p=>/^(student-(desk|chair)-|A-0-(front|back|east|west)|foyer-(front|east|west)|A01-door|main-entry)/.test(p.id)).map(p=>({id:p.id,p:toWorld(p.position),h:p.size.map(v=>v/2),yaw:p.rotation?.[1]??0}));
 const hits=[];
 for(let i=0;i<8;i++)for(const plan of [T.ENTRY[i].plan,T.EXIT[i].plan.slice(0,3)])for(let f=Math.ceil(plan[0].start);f<=plan.at(-1).end;f++){
  const p=studentAt(i,f);if(!moving(p)||p.position[2]>-15)continue;
  const body={p:[p.position[0],p.position[1]+.66+.03+.22,p.position[2]],h:[.18,.22,.07],yaw:p.heading};
  for(const b of parts)if(overlaps(body,b)&&hits.length<8)hits.push({pupil:i,frame:f,part:b.id,position:p.position});
 }
 assert.equal(hits.length,0,JSON.stringify(hits));
});
const lens=c=>{const camera=new PerspectiveCamera(c.fov,1080/1920,c.near,500);camera.position.set(...c.position);camera.lookAt(...c.target);camera.updateMatrixWorld();return camera;};
function inside(camera,p,pad=.03){const v=new Vector3(...p).project(camera);return Math.abs(v.x)<1-pad&&Math.abs(v.y)<1-pad&&v.z>-1&&v.z<1;}
function treeHits(c,targets){const hits=new Set();for(const p of NATURE006.filter(p=>p.kind==='tree'))for(const target of targets){
 const origin=[p.x,2.1*p.size,p.z],r=[1.05*p.size,1.3*p.size,1.02*p.size],a=c.position.map((v,i)=>(v-origin[i])/r[i]),d=target.map((v,i)=>(v-c.position[i])/r[i]);
 const t=-a.reduce((n,v,i)=>n+v*d[i],0)/d.reduce((n,v)=>n+v*v,0);if(t>0&&t<1&&Math.hypot(...a.map((v,i)=>v+d[i]*t))<1)hits.add(p.id);
 }return [...hits];}
test('changed river/bridge masters frame both banks/ends and avoid permanent foreground crowns',()=>{
 for(const id of ['S17','S18','S21','S23','S24']){
  const s=shot(id),frames=id==='S23'?[s.start+2,s.end-2]:[s.start+2],targets=[];
  if(id==='S17')for(let i=1;i<4;i++)for(const side of [-1,1]){
   const p=RIVER_LINE[i],a=RIVER_LINE[i-1],b=RIVER_LINE[i+1],d=Math.hypot(b[0]-a[0],b[1]-a[1]);
   for(const width of [3,5.4])targets.push([p[0]+(b[1]-a[1])/d*(width/2+.3)*side,-.1,p[1]-(b[0]-a[0])/d*(width/2+.3)*side]);
  }
  if(id==='S18')for(let f=s.start+45;f<s.end;f+=30)for(let i=0;i<14;i++)for(const dx of [-.45,.45])for(const dz of [-.45,.45]){const p=fishAt(i,f,SPLASH_FRAME).position;targets.push([p[0]+dx,p[1],p[2]+dz]);}
  if(['S21','S23','S24'].includes(id))for(const end of [-3.9,3.9])for(const side of [-.9,.9])for(const y of [.1,1.15])targets.push(bridgePoint(end,y,side));
  for(const f of frames){const c=cameraAt(f),cam=lens(c);assert.ok(targets.every(p=>inside(cam,p)),`${id}: master frame crops its subject`);assert.deepEqual(treeHits(c,targets),[],`${id}: foreground trees`);}
 }
});
test('permanent trees, VO, timeline, splash and published episodes retain the approved baseline source',()=>{
 const baseline=JSON.parse(execFileSync('git',['show','c652fc9:docs/world/EP006_STATE.json'],{encoding:'utf8'}));
 assert.deepEqual(TRANSPLANTS,baseline.landscaping.transplants);
 execFileSync('git',['diff','--exit-code','c652fc9','--','public','src/episode006/timeline.ts','src/episode006/voice.ts','src/episode006/sounds.ts','src/episode006/audioPerformance.ts','src/world/ep006/waterModel.ts','src/episode001','src/episode002','src/episode003','src/episode004','src/episode005'],{stdio:'pipe'});
});
