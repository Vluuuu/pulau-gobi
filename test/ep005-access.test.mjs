import test from 'node:test';
import assert from 'node:assert/strict';
import {campusParts} from '../src/episode005/campus.ts';
import {cowAt,gobiAt,residentAt,COW_ROUTE_START,COW_ROUTE_END,RETURN_START,RETURN_END} from '../src/episode005/direction.ts';
import {gap,editFrame as E} from '../src/episode005/timeline.ts';
import {SCHOOL} from '../src/episode005/layout.ts';
import {classDoorOpenAt,mainDoorOpenAt,schoolGateOpenAt} from '../src/episode005/access.ts';
const ext=campusParts(gap('G4').end,false);
const solids=ext.filter(p=>/^(school-front-panel|school-side-low|school-back-wall|foyer-side-|foyer-front-pier|main-entry-jamb|school-door-frame|student-desk|student-chair|chair-back|teacher-desk)/.test(p.id));
function circleBox(x,z,r,p){const dx=Math.max(0,Math.abs(x-(SCHOOL.position[0]+p.position[0]))-p.size[0]/2),dz=Math.max(0,Math.abs(z-(SCHOOL.position[2]+p.position[2]))-p.size[2]/2);return dx*dx+dz*dz<(r-.015)**2;}
function leafHit(x,z,r,hx,hz,angle,cx,width){const dx=x-hx,dz=z-hz,c=Math.cos(angle),s=Math.sin(angle),lx=dx*c-dz*s,lz=dx*s+dz*c;return Math.hypot(Math.max(0,Math.abs(lx-cx)-width/2),Math.max(0,Math.abs(lz)-.05))<r-.015;}
test('entry and escort routes clear the actual uncut walls, furniture and open door leaves',()=>{
 const actors=[
  {id:'gobi',a:E(77.4),b:E(81.7),r:.34,sample:f=>({position:gobiAt(f).position,heading:0})},
  {id:'damia',a:E(77.8),b:E(81.7),r:.30,sample:f=>residentAt('warga-11',f)},
  {id:'joy',a:E(88.5),b:E(91),r:.30,sample:f=>residentAt('warga-6',f)},
  {id:'ris',a:E(88.5),b:E(91),r:.30,sample:f=>residentAt('warga-12',f)},
  {id:'cow-003-entry',a:COW_ROUTE_START,b:COW_ROUTE_END,r:.53,sample:f=>cowAt('cow-003',f)},
  {id:'cow-003-escort',a:RETURN_START,b:RETURN_END,r:.53,sample:f=>cowAt('cow-003',f)},
 ];
 for(const actor of actors)for(let f=actor.a;f<=actor.b;f++){
  const pose=actor.sample(f),cow=actor.id.startsWith('cow'),samples=cow?[-.65,0,.65]:[0];
  for(const offset of samples){const x=pose.position[0]+Math.sin(pose.heading)*offset,z=pose.position[2]+Math.cos(pose.heading)*offset;
   for(const p of solids)assert.ok(!circleBox(x,z,actor.r,p),`${actor.id} hits ${p.id} at ${f}`);
   const open=classDoorOpenAt(f,cowAt('cow-003',f).position);
   assert.ok(!leafHit(x,z,actor.r,-21.42,-19.16,-open*1.48,1.42,2.78),`${actor.id} class leaf ${f}`);
   for(const side of [-1,1]){
    assert.ok(!leafHit(x,z,actor.r,-20+side*1.6,-16.16,-side*mainDoorOpenAt(f)*1.48,-side*.78,1.5),`${actor.id} main leaf ${f}`);
    assert.ok(!leafHit(x,z,actor.r,-21+side*1.6,-10,-side*schoolGateOpenAt(f)*1.48,-side*.8,1.55),`${actor.id} school gate leaf ${f}`);
   }
  }
 }
});
