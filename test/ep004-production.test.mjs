import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {VO} from '../src/episode004/production/voice.ts';
import {SFX_ASSETS,SOUND_CUES} from '../src/episode004/production/sounds.ts';
import {DURATION,SLOTS,GREEN_A,GREEN_B,FARM_A,FARM_B,RANCH_A,RANCH_B,KOST_A,KOST_B,KOST_C,COMEDY,atVoice,localWord,buildsAt,radiusAt} from '../src/episode004/production/timeline.ts';
import {CAST,residentMotion,gobiSample,pathAt} from '../src/episode004/production/direction.ts';
import {cameraAt,shotAt} from '../src/episode004/production/camera.ts';
import {NATURE,plantFree,growthAt} from '../src/episode004/production/natureModel.ts';
import {farmParts,ranchParts} from '../src/episode004/production/buildModels.ts';
import {octagonBoundaryRadius} from '../src/episode003/world/terrain/terrainMath.ts';
import {FARM,RANCH,KOST,transform} from '../src/episode004/production/layout.ts';
const sha=p=>createHash('sha256').update(readFileSync(p)).digest('hex');
test('19 final clips play completely in order; VO02 alone is the authorized lossless edit',()=>{
 assert.equal(VO.length,19);assert.equal(DURATION,4327);
 let last=0;for(const v of VO){const s=SLOTS.find(s=>s.voice===v.id);assert.ok(s.start>=last);last=s.end;assert.ok(s.end-s.start>=v.durationSeconds*30);assert.equal(sha('public/'+v.file),v.sha256);}
 const edit=JSON.parse(readFileSync('out/ep004-evidence/vo02-edit.json'));assert.equal(edit.decodedPrefixMaxAbsoluteDifference,0);assert.equal(sha('audio-backups/ep004_vo_02.original.mp3'),edit.originalSha256);
 assert.ok(VO[1].durationSeconds>11.04&&VO[1].durationSeconds<11.48);assert.equal(VO[1].words.filter(w=>w.text==='Terus').length,1);
});
test('build segments have dedicated VO-free SFX gaps and at least 72 frames each',()=>{
 for(const b of SLOTS.filter(s=>s.kind==='build')){assert.ok(b.end-b.start>=72);assert.ok(!SLOTS.filter(s=>s.voice).some(s=>s.start<b.end&&s.end>b.start));assert.ok(SOUND_CUES.some(c=>c.frame>=b.start&&c.frame<b.end));}
 assert.equal(KOST_C.end-KOST_A.start,231);assert.equal(COMEDY.end-COMEDY.start,511);
});
test('radius/progress grow monotonically; old terrain starts at 37.5 and final is 52',()=>{
 assert.equal(radiusAt(0),37.5);assert.equal(radiusAt(DURATION-1),52);let previous=buildsAt(0);
 for(let f=1;f<DURATION;f++){const b=buildsAt(f);for(const k of Object.keys(b)){assert.ok(b[k]>=previous[k]&&b[k]>=0&&b[k]<=1);}previous=b;}
});
test('850 seeded plants keep plots, paths, old objects and river clear; growth follows land',()=>{
 assert.equal(NATURE.length,850);assert.equal(NATURE.filter(p=>p.kind==='tree').length,145);
 for(const p of NATURE){const pad=p.kind==='tree'?p.size*1.2:p.kind==='bush'?p.size*.65:.18;assert.ok(plantFree(p.x,p.z,pad));
  for(let f=p.delay;f<GREEN_B.end;f+=3){const k=growthAt(p,f);if(k>.01)assert.ok(Math.hypot(p.x,p.z)+pad*k<octagonBoundaryRadius(Math.atan2(p.x,p.z),radiusAt(f)),`land ahead of plant ${p.id} f${f}`);}
  assert.equal(growthAt(p,GREEN_B.end),1);
 }
});
test('farm has six empty beds, internal well/tank and six filled irrigation branches; ranch has no animals',()=>{
 const farm=farmParts(1),ranch=ranchParts(1);assert.equal(farm.filter(p=>/^bed-\d+$/.test(p.id)).length,6);assert.equal(farm.filter(p=>p.id.startsWith('branch-water-')).length,6);
 for(const id of ['well-stone','water-tank','main-water','sump-water','pump','sluice-lever'])assert.ok(farm.some(p=>p.id===id));
 assert.ok(ranch.some(p=>p.id==='empty-trough-interior'));assert.equal(ranch.filter(p=>/^ranch-roof-/.test(p.id)).length,2);
 assert.ok(![...farm,...ranch].some(p=>/crop|animal|cow|chicken|sheep/.test(p.id)));
 for(const p of farm){const r=p.kind==='ico'||p.kind==='cylinder'?1:.5;assert.ok(Math.abs(p.position[0])+p.size[0]*r<=5.01,`farm x ${p.id}`);assert.ok(Math.abs(p.position[2])+p.size[2]*r<=4.01,`farm z ${p.id}`);}
});
test('legacy roster survives, three selected residents are added, all transforms are deterministic/finite',()=>{
 assert.deepEqual(CAST.map(r=>r.id),Array.from({length:9},(_,i)=>`warga-${i+1}`));assert.equal(CAST.filter(r=>r.cohort===4).length,3);
 for(let f=0;f<DURATION;f+=3){const g=gobiSample(f);assert.ok(Object.values(g.pose).every(Number.isFinite));for(const r of CAST){const p=residentMotion(r.id,f);assert.ok([...p.position,p.heading,p.stride,p.walk,p.sit,p.hop].every(Number.isFinite));}}
 assert.ok(CAST.every(r=>residentMotion(r.id,DURATION-1).visible));const a=gobiSample(3520);gobiSample(0);assert.deepEqual(gobiSample(3520),a);
});
test('visible paths move with distance-based stride and stop legs when stopped',()=>{
 let prev=0;for(let f=0;f<=90;f++){const p=pathAt(f,0,90,[[0,0,0],[3,0,0],[3,0,3]]);assert.ok(p.stride>=prev);prev=p.stride;}
 assert.equal(pathAt(91,0,90,[[0,0,0],[3,0,3]]).walk,0);
 for(const b of [KOST_A,KOST_B,KOST_C])for(const r of CAST){if(r.id==='warga-3')continue;const p=residentMotion(r.id,(b.start+b.end)/2);const x=p.position[0]-4,z=p.position[2]-14,c=Math.SQRT1_2;assert.ok((x*c+z*c)>5.5,'outside construction forecourt');}
});
test('narrative decisions and reactions have physical acting beyond mouth movement',()=>{
 const decision=atVoice(2)+localWord(2,'Oke',true);assert.ok(gobiSample(decision+14).pose.hop>.5);assert.ok(gobiSample(decision+14).pose.up>.8);
 assert.ok(gobiSample(atVoice(7)+115).pose.point>.7);assert.ok(gobiSample(atVoice(9)+130).pose.point>.7);
});
test('cameras are finite and stable during construction; only final crane changes its view',()=>{
 for(let f=0;f<DURATION;f++){const c=cameraAt(f);assert.ok([...c.position,...c.target,c.zoom].every(Number.isFinite));assert.ok(c.zoom>=9&&c.zoom<=300);}
 for(const b of SLOTS.filter(s=>s.kind==='build'))assert.deepEqual(cameraAt(b.start+1),cameraAt(b.end-1));
 const first=cameraAt(atVoice(19)),last=cameraAt(DURATION-1);assert.ok(first.zoom>last.zoom);assert.equal(shotAt(atVoice(19)).az,60);
});
test('farm/ranch/kost placements preserve the old layout and final caption uses approved outro',()=>{
 assert.deepEqual(FARM.position,[10,0,-12]);assert.deepEqual(RANCH.position,[-12,0,-14]);assert.deepEqual(KOST.position,[4,0,14]);
 assert.equal(VO[18].words.map(w=>w.text).join(' '),'Kalian yang komen, kita yang bangun. Yuk, bangun pulau ini bareng-bareng!');
});
test('all Foley references real non-silent PCM and every cue stays inside the episode',()=>{
 for(const a of SFX_ASSETS){const b=readFileSync('public/'+a.file);assert.equal(b.toString('ascii',0,4),'RIFF');assert.equal(sha('public/'+a.file),a.sha256);assert.ok(a.peakDbfs>-30&&a.peakDbfs<=-1);}
 for(const c of SOUND_CUES){const a=SFX_ASSETS.find(a=>a.id===c.asset);assert.ok(a);assert.ok(c.frame>=0&&c.frame+Math.ceil(a.durationSeconds*30)<DURATION);}
});
