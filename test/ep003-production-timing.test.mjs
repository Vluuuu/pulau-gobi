import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {EP003_CAPTION_CUES as C,EP003_VOICEOVER as A,EP003_OUTRO_TEXT} from '../src/episode003/audio/alignment.ts';
import {EP003_BEAT_CUES as B,EP003_SFX_CUES as S,buildProgress,EP003_DURATION_IN_FRAMES} from '../src/episode003/direction/timeline.ts';
test('real MP3 hash and 3000f duration cover the original unmodified voice',()=>{
  assert.equal(createHash('sha256').update(readFileSync('public/'+A.file)).digest('hex'),A.sha256);
  assert.equal(A.durationSeconds,99.552625);assert.equal(A.sampleRate,44100);assert.equal(A.channels,1);
  assert.equal(EP003_DURATION_IN_FRAMES,3000);assert.ok(EP003_DURATION_IN_FRAMES/30>A.durationSeconds);
});
test('captions are honest machine alignments, ordered and within the audio/clip',()=>{
  assert.ok(C.length>35);assert.equal(C[0].start,0);
  for(let i=0;i<C.length;i++){
    const c=C[i];assert.equal(c.verified,false);assert.equal(c.timingStatus,'machine-aligned');
    assert.ok(c.start>=0&&c.end>c.start&&c.end<=A.durationSeconds&&c.endFrame<=3000);
    assert.ok(c.startFrame<c.endFrame);if(i)assert.ok(c.startFrame>=C[i-1].endFrame);
    assert.ok(c.text.length<=49);assert.equal(c.text,c.words.map(w=>w.text).join(' '));
    for(const w of c.words){assert.ok(w.start>=c.start&&w.end<=c.end+0.001&&w.end>=w.start);assert.ok(w.probability>=0&&w.probability<=1);}
  }
});
test('outro is exact and held safely until final frame',()=>{
  const tail=C.filter(c=>c.start>=94.9);assert.equal(tail.map(c=>c.text).join(' '),EP003_OUTRO_TEXT);
  assert.equal(EP003_OUTRO_TEXT,'Kalian yang komen, kita yang bangun. Yuk, bangun pulau ini bareng-bareng!');
  assert.equal(tail.at(-1).endFrame,3000);
});
test('eleven beat boundaries follow actual VO and fully cover the composition',()=>{
  assert.equal(B.length,11);assert.equal(B[0].start,0);assert.equal(B.at(-1).end,100);
  for(let i=1;i<B.length;i++)assert.equal(B[i].start,B[i-1].end);
  assert.equal(B.find(b=>b.id==='expansion').start,19.26);assert.equal(B.find(b=>b.id==='house').start,32.36);
});
test('building progress is clamped and monotone with roof/counter VO milestones',()=>{
  for(const kind of ['expansion','river','house','warteg']){
    assert.equal(buildProgress(0,kind),0);assert.equal(buildProgress(2999,kind),1);
    let prev=0;for(let f=0;f<3000;f++){const p=buildProgress(f,kind);assert.ok(p>=prev-1e-8&&p>=0&&p<=1);prev=p;}
  }
  assert.ok(Math.abs(buildProgress(36.9*30,'house')-0.27)<0.001);
  assert.ok(Math.abs(buildProgress(Math.round(55.72*30),'warteg')-0.48)<0.001);
  assert.equal(buildProgress(Math.round(58.24*30),'warteg'),1);
});
test('SFX are metadata only with explicit missing-license status and valid bounds',()=>{
  assert.ok(S.length>=10);for(const s of S){assert.equal(s.file,null);assert.equal(s.enabled,false);assert.equal(s.status,'awaiting-licensed-audio');assert.ok(s.endFrame<3000);}
});
test('original screenshot comments exist and remain local media',()=>{
  for(const file of ['image(2).png','image(3).png','image(4).png','image(5).png','image(6).png','image(7).png'])assert.ok(existsSync('public/episode003/'+file));
});
