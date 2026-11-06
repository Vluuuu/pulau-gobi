import {keyValue,FPS} from './math.ts';
export {FPS};
export const EP003_DURATION_IN_FRAMES=3000;
export const sec2f=(s:number)=>Math.round(s*FPS);
// Boundaries follow the original MP3's ASR phrase alignment, not the draft storyboard.
export const EP003_BEAT_CUES=[
  {id:'hook',start:0,end:7.44},{id:'comments',start:7.44,end:19.26},
  {id:'expansion',start:19.26,end:24.86},{id:'river',start:24.86,end:32.36},
  {id:'house',start:32.36,end:43.28},{id:'shifalina-comment',start:43.28,end:53},
  {id:'warteg',start:53,end:58.90},{id:'resident-intro',start:58.90,end:65.50},
  {id:'payment-comedy',start:65.50,end:76.36},{id:'stock-teaser',start:76.36,end:87.64},
  {id:'cta-outro',start:87.64,end:100},
] as const;
export const BUILD_KEYS={
  expansion:[[19.32,0],[23.55,1]],
  river:[[26.82,0],[29.30,1]],
  house:[[32.36,0],[35.36,0.10],[36.90,0.27],[37.14,0.30],[38.12,0.70],[38.60,0.70],[39.70,0.88],[40.50,1]],
  warteg:[[53,0],[53.92,0.10],[54.74,0.30],[55.08,0.32],[55.72,0.48],[56.14,0.50],[56.76,0.72],[57.08,0.75],[57.66,0.92],[58.24,1]],
} as const;
export type BuildKind=keyof typeof BUILD_KEYS;
export const buildProgress=(frame:number,kind:BuildKind)=>keyValue(frame,BUILD_KEYS[kind].map(([s,p])=>[sec2f(s),p] as const));
export const ACT={riverResidents:sec2f(28.4),shifalina:sec2f(58.90),joy:sec2f(87.64),
  ask:sec2f(68.30),pay:sec2f(69.92),pocket:sec2f(71.50),rage:sec2f(72.62),teaser:sec2f(76.36),outro:sec2f(94.98)} as const;
export const EP003_SFX_CUES=[
  {id:'island-grow',at:19.32,duration:4.23,kind:'earth-expansion'},
  {id:'river-fill',at:26.82,duration:2.48,kind:'water-fill'},
  {id:'roof-lift',at:35.36,duration:1.54,kind:'wood-lift'},
  {id:'upper-storey',at:37.14,duration:0.98,kind:'wood-assembly'},
  {id:'roof-land',at:39.70,duration:0.5,kind:'wood-settle'},
  {id:'counter',at:55.08,duration:0.64,kind:'counter-snap'},
  {id:'display',at:56.14,duration:0.62,kind:'glass-snap'},
  {id:'warteg-roof',at:57.08,duration:0.58,kind:'roof-snap'},
  {id:'jadi',at:57.94,duration:0.30,kind:'reveal'},
  {id:'pay',at:70.46,duration:0.56,kind:'comedy-pause'},
  {id:'empty-pocket',at:71.76,duration:0.70,kind:'cloth-empty'},
  {id:'footsteps',at:50,duration:10,kind:'footsteps'},
].map(cue=>({...cue,startFrame:sec2f(cue.at),endFrame:sec2f(cue.at+cue.duration),file:null,enabled:false,status:'awaiting-licensed-audio' as const}));
