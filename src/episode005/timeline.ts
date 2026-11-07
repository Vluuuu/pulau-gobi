import {DURATION as OLD_DURATION,atVoice} from '../episode004/production/timeline.ts';

export const FPS=30;
export const MASTER_SECONDS=135.1575;
export const MASTER_FRAMES=Math.ceil(MASTER_SECONDS*FPS);
export const OUTRO_SOURCE_START=atVoice(19);
export const OUTRO_FRAMES=OLD_DURATION-OUTRO_SOURCE_START; // 4162..4326, exact EP004 tail
export const INSERTS=[
 {id:'G1',master:23.55,frames:285}, {id:'G2a',master:41.85,frames:105},
 {id:'G2b',master:45.49,frames:105}, {id:'G3',master:56.60,frames:105},
 {id:'G4',master:76.60,frames:240}, {id:'CH-A',master:88.30,frames:30},
 {id:'G5',master:93.10,frames:120}, {id:'G6',master:101.34,frames:105},
].map((s,i,a)=>({...s,sourceFrame:Math.round(s.master*FPS),start:Math.round(s.master*FPS)+a.slice(0,i).reduce((n,p)=>n+p.frames,0)}));
export const gap=(id:string)=>{const s=INSERTS.find(s=>s.id===id)!;return {...s,end:s.start+s.frames};};
export const editFrame=(seconds:number)=>Math.round(seconds*FPS)+INSERTS.filter(s=>s.sourceFrame<=Math.round(seconds*FPS)).reduce((n,s)=>n+s.frames,0);
export const OUTRO_START=MASTER_FRAMES+INSERTS.reduce((n,s)=>n+s.frames,0);
export const DURATION=OUTRO_START+OUTRO_FRAMES;
export const AUDIO_SEGMENTS=Array.from({length:INSERTS.length+1},(_,i)=>{
 const sourceStart=i?INSERTS[i-1].sourceFrame:0,sourceEnd=i<INSERTS.length?INSERTS[i].sourceFrame:MASTER_FRAMES;
 return {id:i,sourceStart,sourceEnd,start:sourceStart+INSERTS.slice(0,i).reduce((n,s)=>n+s.frames,0),frames:sourceEnd-sourceStart,file:`episode005/voice/part-${i}.wav`};
});
export function masterAt(frame:number):number|null {
 if(frame>=OUTRO_START)return null;
 let offset=0;for(const s of INSERTS){if(frame<s.start)break;if(frame<s.start+s.frames)return null;offset+=s.frames;}
 return (frame-offset)/FPS;
}
export const clamp=(x:number)=>Math.max(0,Math.min(1,x));
export const ramp=(f:number,a:number,b:number)=>{const u=clamp((f-a)/(b-a));return u*u*(3-2*u);};
export const mix=(a:number,b:number,u:number)=>a+(b-a)*u;
export const pulse=(f:number,a:number,b:number)=>f<a||f>b?0:Math.sin(Math.PI*(f-a)/(b-a));
