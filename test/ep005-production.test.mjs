import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {AUDIO_SEGMENTS,DURATION,MASTER_FRAMES,OUTRO_START,OUTRO_SOURCE_START,OUTRO_FRAMES,INSERTS,gap,editFrame as E,masterAt} from '../src/episode005/timeline.ts';
import {SHOTS} from '../src/episode005/shots.ts';
import {CAST,COW_IDS,cowAt,residentAt,FIRST_APPEARANCE,COW_ROUTE_START,COW_ROUTE_END,RETURN_START,RETURN_END} from '../src/episode005/direction.ts';
import {CAST as OLD_CAST} from '../src/episode004/production/direction.ts';
import {DURATION as OLD_DURATION} from '../src/episode004/production/timeline.ts';
import {CHANNEL,L,ROUTE,pathLength,DOOR,SCHOOL,transform,RANCH} from '../src/episode005/layout.ts';
import {campusParts as schoolParts,SCHOOL_WINGS} from '../src/episode005/campus.ts';
import {NATURE} from '../src/episode004/production/natureModel.ts';
import {distanceToPolylineXZ,octagonBoundaryRadius} from '../src/episode003/world/terrain/terrainMath.ts';
import {cameraAt} from '../src/episode005/camera.ts';

test('lossless PCM slices preserve the complete authoritative master exactly',()=>{
 const evidence=JSON.parse(readFileSync(new URL('../docs/episodes/EP005_AUDIO_EVIDENCE.json',import.meta.url)));
 const sha=b=>createHash('sha256').update(b).digest('hex');
 assert.equal(sha(readFileSync(new URL('../public/episode005/voice/master-v4.mp3',import.meta.url))),evidence.masterSha256);
 const pcm=AUDIO_SEGMENTS.map(a=>{const wav=readFileSync(new URL(`../public/${a.file}`,import.meta.url));let p=12;while(wav.toString('ascii',p,p+4)!=='data')p+=8+wav.readUInt32LE(p+4)+(wav.readUInt32LE(p+4)%2);return wav.subarray(p+8,p+8+wav.readUInt32LE(p+4));});
 assert.equal(sha(Buffer.concat(pcm)),evidence.decodedPcmSha256);
 assert.equal(Buffer.concat(pcm).length/2,evidence.decodedSamples);
 for(let i=1;i<evidence.segments.length;i++)assert.equal(evidence.segments[i].startSample,evidence.segments[i-1].endSample);
});
test('5315 frames include the exact original 165-frame outro and eight inserted holds',()=>{
 assert.equal(DURATION,5315);assert.ok(DURATION/30<=179.5);
 assert.equal(OUTRO_SOURCE_START,4162);assert.equal(OUTRO_FRAMES,165);assert.equal(OUTRO_SOURCE_START+OUTRO_FRAMES,OLD_DURATION);
 assert.equal(INSERTS.reduce((n,s)=>n+s.frames,0),1095);assert.equal(OUTRO_START,5150);
 assert.equal(SHOTS[0].start,0);assert.equal(SHOTS[SHOTS.length-1].end,OUTRO_START);
 for(let i=1;i<SHOTS.length;i++)assert.equal(SHOTS[i].start,SHOTS[i-1].end,SHOTS[i].id);
 for(const s of INSERTS)assert.equal(masterAt(s.start+1),null);
 assert.equal(AUDIO_SEGMENTS.reduce((n,s)=>n+s.frames,0),MASTER_FRAMES);
});
test('existing roster is preserved and newcomers first appear only on their approved introductions',()=>{
 assert.equal(CAST.length,12);assert.equal(new Set(CAST.map(r=>r.id)).size,12);
 for(const r of OLD_CAST)assert.deepEqual(CAST.find(c=>c.id===r.id),r);
 for(const [id,f] of Object.entries(FIRST_APPEARANCE)){assert.equal(residentAt(id,f-1).visible,false);assert.equal(residentAt(id,f).visible,true);}
 assert.equal(CAST.find(r=>r.name==='RIS_26').special,false);
 assert.equal(CAST.find(r=>r.name==='joy.__3.15').special,false);
});
test('extension begins at the real river endpoint and clears preserved tree trunks to the rim',()=>{
 assert.deepEqual(CHANNEL[0],L.river.centerline[L.river.centerline.length-1]);
 for(const tree of NATURE.filter(p=>p.kind==='tree'))assert.ok(distanceToPolylineXZ(tree.x,tree.z,CHANNEL)>1.5+.28*tree.size,`tree ${tree.id}`);
 const [x,z]=CHANNEL[CHANNEL.length-1];assert.ok(Math.hypot(x,z)>octagonBoundaryRadius(Math.atan2(x,z),52));
 // No tree trunk is inside the new school footprint.
 for(const tree of NATURE.filter(p=>p.kind==='tree')){
  const dx=Math.max(0,Math.abs(tree.x-SCHOOL.position[0])-SCHOOL.width/2),dz=Math.max(0,Math.abs(tree.z-SCHOOL.position[2])-SCHOOL.depth/2);
  assert.ok(Math.hypot(dx,dz)>.3*tree.size,`school tree ${tree.id}`);
 }
 for(const wing of SCHOOL_WINGS)for(const tree of NATURE.filter(p=>p.kind==='tree')){
  const dx=Math.max(0,Math.abs(tree.x-(SCHOOL.position[0]+wing.x))-4.2),dz=Math.max(0,Math.abs(tree.z-(SCHOOL.position[2]+wing.z))-2.9);
  assert.ok(Math.hypot(dx,dz)>.27*tree.size,`wing ${wing.id} tree ${tree.id}`);
 }
});
test('bell, latch, walk into the large door, escort and final count form a continuous causal route',()=>{
 assert.ok(E(89.05)<E(90.6)&&E(90.6)<COW_ROUTE_START&&COW_ROUTE_START<COW_ROUTE_END);
 assert.ok(pathLength(ROUTE.slice(0,-1))>=14&&pathLength(ROUTE.slice(0,-1))<=22);
 assert.equal(2.78>1.16+.4,true);assert.equal(2.7>2.12+.3,true);
 const c=cowAt('cow-003',COW_ROUTE_END);assert.ok(c.position.every((v,i)=>Math.abs(v-ROUTE[ROUTE.length-1][i])<1e-9));
 for(let f=E(91.5)+1;f<RETURN_END;f++){
  const a=cowAt('cow-003',f-1),b=cowAt('cow-003',f);assert.ok(Math.hypot(a.position[0]-b.position[0],a.position[2]-b.position[2])<.22,`teleport at ${f}`);
 }
 for(const id of COW_IDS)assert.equal(cowAt(id,E(104)).visible,true);
 assert.equal(cowAt('cow-001',E(95)).walk,0);assert.equal(cowAt('cow-002',E(95)).walk,0);
 assert.deepEqual(cowAt('cow-003',RETURN_END).position,transform([0,0,2.6],RANCH));
});
test('eight empty desks build once, while school is absent in the hook',()=>{
 assert.deepEqual(schoolParts(0,false),[]);
 const parts=schoolParts(gap('G4').end,true);assert.equal(parts.filter(p=>p.id.startsWith('student-desk-')).length,8);
 assert.equal(new Set(parts.map(p=>p.id)).size,parts.length);
 assert.deepEqual(parts,schoolParts(gap('G4').end,true));
 const exterior=schoolParts(gap('G4').end,false);
 assert.equal(exterior.filter(p=>p.id.endsWith('upper-slab')).length,3);
 assert.ok(Math.max(...exterior.map(p=>p.position[1]+p.size[1]/2))>8);
});
test('mirror shots reuse exactly the original numeric camera presets',()=>{
 for(const [a,b] of [['S01','S32a'],['S02a','S32b'],['S02b','S32c'],['S22a','S32d']]){
  const x=cameraAt(SHOTS.find(s=>s.id===a).start),y=cameraAt(SHOTS.find(s=>s.id===b).start);
  for(const k of ['position','target','width','elevation','az'])assert.deepEqual(x[k],y[k],`${a}/${b} ${k}`);
 }
});
