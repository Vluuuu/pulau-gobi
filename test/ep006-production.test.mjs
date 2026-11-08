import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {STUDENTS,RESIDENTS,COWS,COMMENT_MANIFEST} from '../src/world/ep006/roster.ts';
import {POST_EP005_WORLD} from '../src/world/postEp005/snapshot.ts';
import {POST_EP006_WORLD} from '../src/world/ep006/snapshot.ts';
import {buildSchoolAsset} from '../src/world/postEp005/schoolAsset.ts';
import {SCHOOL_SITE,SCHOOL_PORTALS,toWorld} from '../src/world/postEp005/schoolLayout.ts';
import {SEATS,entryRoute,BRIDGE,CROSSING,FIELD_PATH,RIVER_LINE,ASSEMBLY,SCHOOL_YARD,OBSERVATION,OBS_SPOTS,HEADMASTER_OBS} from '../src/world/ep006/layout.ts';
import {studentAt,ENTRY_END,CROSS_START,adultAt} from '../src/episode006/direction.ts';
import {SHOTS,SPLASH_FRAME} from '../src/episode006/shots.ts';
import {DURATION,OUTRO_START,OUTRO_SOURCE_START,OUTRO_FRAMES,STORY_SOURCE_END,INSERTS,E,masterAt} from '../src/episode006/timeline.ts';
import {DURATION as EP004_DURATION,atVoice} from '../src/episode004/production/timeline.ts';
import {CAPTIONS} from '../src/episode006/voice.ts';
import {fishAt,widthAt,FISH_FLIGHT,SPLASH_CONTACT,splashAt,splashDropletAt} from '../src/world/ep006/waterModel.ts';
import {solveLimb,footCycle,gestureAt} from '../src/episode006/performance.ts';
import {CLASS_CAMERAS,DIRECTED_SHOTS} from '../src/episode006/camera.ts';
import {distanceToPolylineXZ} from '../src/episode003/world/terrain/terrainMath.ts';
import {VOICE_ENVELOPE,OUTRO_CAPTIONS} from '../src/episode006/audioPerformance.ts';
import {CUES} from '../src/episode006/sounds.ts';
import {NATURE} from '../src/episode004/production/natureModel.ts';
import {NATURE006,inSchool} from '../src/world/ep006/landscaping.ts';
import {segmentDistance} from '../src/episode004/production/layout.ts';
const hash=b=>createHash('sha256').update(b).digest('hex');
const json=p=>JSON.parse(readFileSync(new URL(p,import.meta.url),'utf8'));

test('eight screenshot identities, one existing Damar, two new contributors, three existing named cows',()=>{
  assert.deepEqual(STUDENTS.map(s=>s.name),['posyaryn07','uz_daus','capiwasa','Rissa-i3f','bsk_rfi','FaRzHaN-BoY','MisbahulAmmar','athrr_0202']);
  assert.equal(RESIDENTS.length,22);assert.equal(new Set(RESIDENTS.map(r=>r.id)).size,22);assert.equal(new Set(RESIDENTS.map(r=>r.name.toLowerCase())).size,22);
  assert.equal(RESIDENTS.filter(r=>r.name==='damar_zan').length,1);assert.equal(RESIDENTS.find(r=>r.name==='damar_zan').id,'warga-4');
  assert.deepEqual(COWS.map(c=>[c.id,c.name]),[['cow-001','Sappy'],['cow-002','Oopet'],['cow-003','Rembo']]);
  assert.equal(COMMENT_MANIFEST.applicantCount,null);assert.equal(POST_EP006_WORLD.editorial.newStreetLights,0);
});
test('snapshot preserves all twelve baseline profiles and every legacy placement without mutating baseline',()=>{
  for(const old of POST_EP005_WORLD.population.residents)assert.deepEqual(POST_EP006_WORLD.population.residents.find(r=>r.id===old.id),old);
  assert.deepEqual(POST_EP006_WORLD.island,POST_EP005_WORLD.island);assert.deepEqual(POST_EP006_WORLD.progress,POST_EP005_WORLD.progress);
  assert.equal(POST_EP005_WORLD.population.residents.length,12);assert.equal(POST_EP005_WORLD.school.selectedStudentIds.length,0);
  assert.ok(Object.isFrozen(POST_EP006_WORLD.population.residents));
});
test('physical entry uses the polished portals and ends at eight distinct actual chair seats',()=>{
  const asset=buildSchoolAsset({doors:'open'});
  for(let i=0;i<8;i++){
    const route=entryRoute(i);let cursor=-1;
    for(const p of SCHOOL_PORTALS){const world=toWorld(p.point),idx=route.findIndex((v,j)=>j>cursor&&v.every((n,k)=>Math.abs(n-world[k])<1e-6));assert.ok(idx>cursor,p.id);cursor=idx;}
    const chair=asset.parts.find(p=>p.id===`student-chair-${i+1}-seat`),world=toWorld(chair.position);
    assert.equal(SEATS[i].position[0],world[0]);assert.equal(SEATS[i].position[2],world[2]);
    const arrived=studentAt(i,ENTRY_END+Math.floor(i/2)*18+(i%2)*6+19);assert.deepEqual(arrived.position,SEATS[i].position);assert.equal(arrived.seat,1);assert.ok(Math.cos(arrived.heading)<-.99999);
  }
  assert.equal(new Set(SEATS.map(s=>s.position.join(','))).size,8);
});
test('the group crosses the one bridge centreline above water after its upgrade',()=>{
  assert.ok(E(62.5)<CROSS_START);assert.equal(BRIDGE.id,'bridge-001');assert.ok(BRIDGE.length>5.4+1.3);
  const a=CROSSING[1],b=CROSSING[2];assert.equal(a[1],BRIDGE.deckY);assert.equal(b[1],BRIDGE.deckY);
  assert.ok(Math.abs(Math.hypot(b[0]-a[0],b[2]-a[2])-6.6)<1e-6);
  assert.equal(POST_EP006_WORLD.population.cows.length,3);
});
test('existing plant IDs are retained and tree trunks clear the new walking route and school',()=>{
  assert.deepEqual(NATURE006.map(p=>p.id),NATURE.map(p=>p.id));
  for(const p of NATURE006.filter(p=>p.kind==='tree')){
    assert.ok(!inSchool(p.x,p.z,.55*p.size),`school tree ${p.id}`);
    assert.ok(FIELD_PATH.slice(1).every((b,i)=>segmentDistance(p.x,p.z,FIELD_PATH[i],b)>.95+.55*p.size-1e-6),`path tree ${p.id}`);
  }
});
test('river preserves the exact route to the EP005 lip and narrows smoothly into its waterfall',()=>{
  assert.deepEqual(RIVER_LINE.at(-1),[-10.5,48.5]);assert.equal(widthAt(16,1),5.4);assert.ok(Math.abs(widthAt(48.5,1)-3.15)<1e-8);
  assert.ok(widthAt(44.5,1)>3.15&&widthAt(44.5,1)<5.4);
});
test('fish approaches, leaps, sends water to the principal, and returns continuously',()=>{
  const before=fishAt(0,SPLASH_FRAME-1,SPLASH_FRAME),start=fishAt(0,SPLASH_FRAME,SPLASH_FRAME),peak=fishAt(0,SPLASH_FRAME+FISH_FLIGHT/2,SPLASH_FRAME),land=fishAt(0,SPLASH_FRAME+FISH_FLIGHT,SPLASH_FRAME),after=fishAt(0,SPLASH_FRAME+FISH_FLIGHT+1,SPLASH_FRAME);
  assert.ok(Math.hypot(...before.position.map((v,i)=>v-start.position[i]))<.03);assert.ok(peak.position[1]>1.6);assert.ok(land.position[1]<-.15);
  assert.ok(Math.hypot(...after.position.map((v,i)=>v-land.position[i]))<.03);
  const principal=adultAt('warga-21',SPLASH_CONTACT),droplet=splashDropletAt(0,SPLASH_CONTACT);
  assert.ok(droplet.visible);assert.ok(Math.hypot(droplet.position[0]-principal.position[0],droplet.position[2]-principal.position[2])<.15);
  assert.equal(splashAt(SPLASH_CONTACT-1).shock,0);assert.ok(splashAt(SPLASH_CONTACT+4).shock>.8);
  assert.equal(CUES.find(c=>c.file.endsWith('splash-contact.wav')).frame,SPLASH_CONTACT);
});
test('38 ordered edit beats cover the composition; original EP004 tail and post-audio hold are complete',()=>{
  assert.equal(SHOTS.length,38);assert.equal(SHOTS[0].start,0);assert.equal(new Set(SHOTS.map(s=>s.id)).size,38);
  for(let i=0;i<SHOTS.length;i++){assert.ok(SHOTS[i].end>SHOTS[i].start);if(i)assert.equal(SHOTS[i-1].end,SHOTS[i].start);}
  assert.equal(OUTRO_SOURCE_START,atVoice(19));assert.equal(OUTRO_FRAMES,165);assert.equal(OUTRO_SOURCE_START+OUTRO_FRAMES,EP004_DURATION);assert.equal(DURATION,OUTRO_START+OUTRO_FRAMES);
  for(const p of INSERTS)assert.equal(masterAt(p.start),null);
  assert.ok(CAPTIONS.every(c=>c.start<c.end&&c.end<STORY_SOURCE_END/30));
});
test('stored PCM edit retains every story sample and only replaces the complete duplicate CTA',()=>{
  const edl=json('../docs/episodes/EP006_AUDIO_EDL.json'),wav=readFileSync(new URL('../public/episode006/voice/story-edit.wav',import.meta.url));
  assert.equal(wav.toString('ascii',0,4),'RIFF');assert.equal(wav.toString('ascii',36,40),'data');const pcm=wav.subarray(44);
  assert.equal(pcm.length,OUTRO_START*1470*2);assert.equal(edl.durationFrames,DURATION);
  const joined=Buffer.concat(edl.segments.map(s=>pcm.subarray(s.destinationFrame*1470*2,s.destinationFrame*1470*2+s.samples*2)));
  assert.equal(joined.length,STORY_SOURCE_END*1470*2);assert.equal(hash(joined),edl.storyPcmSha256);
  assert.equal(hash(readFileSync(new URL('../public/episode006/voice/eps6.mp3',import.meta.url))),edl.masterSha256);
  const cut=STORY_SOURCE_END/30;assert.ok(cut>108.689683&&cut<109.065986);assert.equal(edl.speed,1);
  for(const p of INSERTS)assert.ok(pcm.subarray(p.start*1470*2,(p.start+p.frames)*1470*2).every(b=>b===0));
});
test('published episode sources and assets have no changes relative to the required baseline',()=>{
  execFileSync('git',['diff','--exit-code','3759f2e','--','src/episode002','src/episode003','src/episode004','src/episode005','src/Episode001.tsx','src/Episode002Scene.tsx','src/Episode003Scene.tsx','public/episode004','public/episode005'],{stdio:'pipe'});
});
test('two compact ranks stay on the dry campus forecourt, separated from the river',()=>{
  assert.equal(new Set(ASSEMBLY.map(p=>p[2])).size,2);
  for(let i=0;i<8;i++){
    const p=ASSEMBLY[i];assert.ok(p[0]>SCHOOL_YARD.xMin&&p[0]<SCHOOL_YARD.xMax&&p[2]>SCHOOL_YARD.zMin&&p[2]<SCHOOL_YARD.zMax);
    assert.ok(distanceToPolylineXZ(p[0],p[2],RIVER_LINE)-5.4/2>6);
    for(let j=i+1;j<8;j++)assert.ok(Math.hypot(p[0]-ASSEMBLY[j][0],p[2]-ASSEMBLY[j][2])>=1.09);
  }
  assert.ok(distanceToPolylineXZ(-20,-16.18,RIVER_LINE)>12);
});
test('class lenses are physically inside A01 and full architecture remains present',()=>{
  for(const c of Object.values(CLASS_CAMERAS)){
    const [x,y,z]=c.position;assert.ok(x>-23.9&&x< -16.1);assert.ok(z> -24.6&&z< -19.3);assert.ok(y>.55&&y<3.49);
  }
  const asset=buildSchoolAsset({doors:'open'});assert.ok(asset.parts.some(p=>p.id==='A-roof-ridge'));assert.ok(asset.parts.some(p=>p.id==='foyer-ceiling'));
  const world=readFileSync(new URL('../src/world/ep006/World.tsx',import.meta.url),'utf8');assert.ok(!/cutaway\s*:/.test(world));
  for(const id of ['warga-6','warga-12']){const p=adultAt(id,E(30)).position;assert.ok(p[2]>-16&&p[1]===0);}
  assert.equal(Object.keys(DIRECTED_SHOTS).length,38);
});
test('two-bone limbs retain length for reachable, far, and near-root targets',()=>{
  const root=[0,0,0];for(const goal of [[.2,-.35,.1],[3,2,1],[0,0,0]]){
    const p=solveLimb(root,goal,.25,.26,[1,0,1]);assert.ok(p.joint.every(Number.isFinite)&&p.tip.every(Number.isFinite));
    assert.ok(Math.abs(Math.hypot(...p.joint)-.25)<1e-6);assert.ok(Math.abs(Math.hypot(...p.tip.map((n,i)=>n-p.joint[i]))-.26)<1e-6);
  }
});
test('stance travel cancels root travel; gestures and classroom work have distinct timing',()=>{
  const a=footCycle(.05,1,-1,.72),b=footCycle(.10,1,-1,.72);assert.ok(Math.abs((.10+b.z)-(.05+a.z))<1e-8);assert.equal(a.lift,0);
  assert.notDeepEqual(gestureAt('surprise',15,0),gestureAt('formal',15,0));assert.equal(gestureAt('surprise',100,0).shock,0);
  assert.ok(new Set(STUDENTS.map((_,i)=>studentAt(i,E(30),true).activity)).size>=5);
});
test('observation has compact pupil ranks and a separate protected principal bay',()=>{
  for(const p of OBS_SPOTS){assert.ok(Math.abs(p[0]-OBSERVATION.center[0])<OBSERVATION.width/2-.3);assert.ok(Math.abs(p[2]-OBSERVATION.center[2])<OBSERVATION.depth/2-.3);}
  assert.equal(new Set(OBS_SPOTS.map(p=>p[2])).size,2);assert.ok(OBS_SPOTS.every(p=>Math.hypot(p[0]-HEADMASTER_OBS[0],p[2]-HEADMASTER_OBS[2])>.8));
});
test('official CTA stays complete, RMS-matched, and in the continuous current world',()=>{
  const audio=json('../docs/episodes/EP006_REVISION_AUDIO.json');
  assert.equal(hash(readFileSync(new URL('../public/episode004/voice/ep004_vo_19.mp3',import.meta.url))),audio.outroSha256);
  assert.ok(Math.abs(audio.storyActiveRmsAfterGain/audio.outroActiveRmsAfterGain-1)<.02);assert.ok(audio.outroSamplePeakAfterGain<.9);
  assert.ok(Math.ceil(audio.outroDecodedSamples/44100*30)+24<=OUTRO_FRAMES);assert.equal(VOICE_ENVELOPE.length,DURATION);
  assert.equal(OUTRO_CAPTIONS.map(c=>c.text).join(' '),'Kalian yang komen, kita yang bangun. Yuk, bangun pulau ini bareng-bareng!');
  const scene=readFileSync(new URL('../src/episode006/Episode006.tsx',import.meta.url),'utf8');assert.ok(!scene.includes('<Episode004'));assert.ok(scene.includes('<CurrentWorld frame={f}'));
});
