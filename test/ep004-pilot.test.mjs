import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {PILOT_VO, PILOT_SFX_ASSETS} from '../src/episode004/pilot/audio.ts';
import {DURATION,T,cameraAt,CAMERA_CUTS,oktaaAt,gobiAt,world,bubbleAt,SFX_CUES,WALK_LENGTH} from '../src/episode004/pilot/plan.ts';
import {screen,uiAt} from '../src/episode004/pilot/framing.ts';
test('original VO hashes, complete durations, no speed change or overlapping dialogue',()=>{
 assert.equal(DURATION,489);
 for(let i=0;i<PILOT_VO.length;i++){const v=PILOT_VO[i];assert.equal(createHash('sha256').update(readFileSync('public/'+v.file)).digest('hex'),v.sha256);
  assert.ok(v.durationFrames>=v.durationSeconds*30);assert.ok(v.startFrame+v.durationFrames<DURATION);if(i)assert.ok(v.startFrame>PILOT_VO[i-1].startFrame+PILOT_VO[i-1].durationFrames);}
 assert.ok(PILOT_VO[0].startFrame>T.bubble1End);
});
test('both chat bubbles satisfy V2 full-hold reading formula and clear before reaction',()=>{
 for(const f of [T.bubble1Full,T.bubble2Full]){const b=bubbleAt(f);assert.ok((b.out-b.full)/30>=Math.max(1.3,.4+.045*b.text.length));}
 assert.ok(T.pause>=T.bubble2End+5);assert.equal(T.jump-T.pause,33);assert.equal(T.fallEmote-T.contact,2);
});
test('real 3.76-unit walk, distance-driven monotonic stride, stopped legs are still',()=>{
 assert.ok(WALK_LENGTH>=3.5);let previous=-1;
 for(let f=0;f<=54;f++){const p=oktaaAt(f);assert.ok(p.stride>=previous);previous=p.stride;}
 assert.equal(oktaaAt(55).walk,0);assert.equal(oktaaAt(100).stride,oktaaAt(55).stride);
});
test('anticipation, air stretch, landing squash, and actual sit/contact are staged',()=>{
 assert.ok(gobiAt(318).pose.squash>.25);assert.ok(gobiAt(325).pose.squash<-.25);assert.ok(gobiAt(343).pose.squash>.3);
 assert.ok(gobiAt(330).pose.hop>.8);assert.equal(gobiAt(T.contact).pose.sit,1);assert.equal(gobiAt(488).pose.sit,1);
 assert.ok(gobiAt(T.contact).local[2]<gobiAt(T.sit).local[2]);assert.ok(gobiAt(463).pose.hop>.1);
});
test('finite deterministic poses and four static camera cuts only',()=>{
 assert.equal(CAMERA_CUTS.length,4);
 for(let f=0;f<DURATION;f++){assert.ok(Object.values(gobiAt(f).pose).every(Number.isFinite));const c=cameraAt(f);assert.ok([...c.position,...c.target,c.zoom].every(Number.isFinite));
  if(f&&!CAMERA_CUTS.includes(f))assert.deepEqual(cameraAt(f),cameraAt(f-1));}
 const p=gobiAt(430);gobiAt(0);gobiAt(488);assert.deepEqual(gobiAt(430),p);
});
test('jump/arms/full body fit above subtitles; labels and bubbles avoid faces',()=>{
 for(let f=54;f<DURATION;f++){
  const g=gobiAt(f),u=uiAt(f);
  for(const x of [g.local[0]-.87,g.local[0]+.87])for(const y of [0,g.top+.25]){
   const p=screen(world([x,y,g.local[2]]),f);assert.ok(p.x>10&&p.x<1070&&p.y>120&&p.y<1420,`body clipped f${f}: ${JSON.stringify(p)}`);}
  const b=bubbleAt(f);if(b){assert.ok(u.bubble.y+u.bubble.height+38<u.tag.y);assert.ok(u.bubble.y+u.bubble.height<1300);}
  if(u.tag.visible)assert.ok(u.tag.y+u.tag.height<u.npc.y-65);
 }
});
test('all audible SFX are real non-silent PCM assets with provenance and cue frames',()=>{
 for(const a of PILOT_SFX_ASSETS){const b=readFileSync('public/'+a.file);assert.equal(b.toString('ascii',0,4),'RIFF');assert.ok(a.peakDbfs>-30&&a.peakDbfs<=-1);assert.ok(a.rmsDbfs>-40);}
 for(const c of SFX_CUES){const a=PILOT_SFX_ASSETS.find(a=>a.id===c.asset);assert.ok(a);assert.ok(c.frame+Math.ceil(a.durationSeconds*30)<DURATION);assert.ok(c.volume>0);}
});
