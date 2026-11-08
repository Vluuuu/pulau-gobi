// Source-data export only: no scene mounting, browser, image, or render.
import {mkdir,writeFile} from 'node:fs/promises';
import {SHOTS} from '../src/episode006/shots.ts';
import {INSERTS,STORY_SOURCE_END,OUTRO_START,OUTRO_SOURCE_START,OUTRO_FRAMES,DURATION} from '../src/episode006/timeline.ts';
import {POST_EP006_WORLD} from '../src/world/ep006/snapshot.ts';
import {COMMENT_MANIFEST} from '../src/world/ep006/roster.ts';
await mkdir('tmp',{recursive:true});
await writeFile('tmp/ep006-plan.json',JSON.stringify({inserts:INSERTS,storySourceEnd:STORY_SOURCE_END,outroStart:OUTRO_START,outroSourceStart:OUTRO_SOURCE_START,outroFrames:OUTRO_FRAMES,duration:DURATION,shots:SHOTS},null,2));
await writeFile('docs/world/EP006_STATE.json',JSON.stringify(POST_EP006_WORLD,null,2)+'\n');
await writeFile('docs/episodes/EP006_COMMENTS.json',JSON.stringify(COMMENT_MANIFEST,null,2)+'\n');
await writeFile('docs/episodes/EP006_SHOT_EDL.csv','shot,start_frame,end_frame,start_seconds,end_seconds,intent\n'+SHOTS.map(s=>[s.id,s.start,s.end,(s.start/30).toFixed(3),(s.end/30).toFixed(3),JSON.stringify(s.intent)].join(',')).join('\n')+'\n');
console.log(`Source metadata: ${SHOTS.length} shots; ${DURATION} frames; ${OUTRO_FRAMES} original EP004 outro frames.`);
