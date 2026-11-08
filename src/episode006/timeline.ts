import {atVoice,DURATION as EP004_DURATION} from '../episode004/production/timeline.ts';
export const FPS=30;
export const MASTER_SECONDS=113.240813;
// Entire final CTA is replaced by the canonical EP004 audiovisual tail. The cut
// is inside measured silence 108.689683..109.065986, after 'pilih beberapa'.
export const STORY_SOURCE_END=3266; // 108.8666667 s, no partial word deletion.
export const INSERTS=[
  {id:'comments',source:14.333333333,frames:60},
  {id:'names',source:20.5,frames:120},
  {id:'entry',source:29.166666667,frames:210},
  {id:'class',source:32.866666667,frames:75},
  {id:'fish',source:45.833333333,frames:90},
  {id:'waterfall',source:49.033333333,frames:90},
  {id:'bridge',source:62.733333333,frames:90},
  {id:'crossing',source:65.633333333,frames:90},
  {id:'splash',source:77.966666667,frames:45},
  {id:'cows',source:83.9,frames:120},
  {id:'home',source:88.5,frames:90},
  {id:'dark',source:97.466666667,frames:30},
  {id:'breath',source:STORY_SOURCE_END/30,frames:30},
].map((s,i,a)=>({...s,sourceFrame:Math.round(s.source*FPS),start:Math.round(s.source*FPS)+a.slice(0,i).reduce((n,p)=>n+p.frames,0)}));
export const E=(sourceSeconds:number)=>Math.round(sourceSeconds*FPS)+INSERTS.filter(s=>s.sourceFrame<=Math.round(sourceSeconds*FPS)).reduce((n,s)=>n+s.frames,0);
export const hold=(id:string)=>{const s=INSERTS.find(s=>s.id===id)!;return {...s,end:s.start+s.frames};};
export const OUTRO_START=STORY_SOURCE_END+INSERTS.reduce((n,s)=>n+s.frames,0);
export const OUTRO_SOURCE_START=atVoice(19);
export const OUTRO_FRAMES=EP004_DURATION-OUTRO_SOURCE_START;
export const DURATION=OUTRO_START+OUTRO_FRAMES;
export const clamp=(v:number)=>Math.max(0,Math.min(1,v));
export const ramp=(f:number,a:number,b:number)=>{const t=clamp((f-a)/(b-a));return t*t*(3-2*t);};
export const pulse=(f:number,a:number,b:number)=>f<a||f>b?0:Math.sin(Math.PI*(f-a)/(b-a));
export function masterAt(frame:number):number|null {
  if(frame>=OUTRO_START)return null;
  let offset=0;
  for(const s of INSERTS){if(frame<s.start)break;if(frame<s.start+s.frames)return null;offset+=s.frames;}
  const source=(frame-offset)/FPS;return source<STORY_SOURCE_END/FPS?source:null;
}
