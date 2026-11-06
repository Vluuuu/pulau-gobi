import type {GobiPose} from '../../Gobi';
import {EP003_ROSTER} from '../state/roster.ts';
import {WARTEG_LOCAL_ANCHORS,wartegLocalToWorld} from '../world/warteg/wartegModel.ts';
import {EP003_WORLD_LAYOUT as L} from '../world/layout.ts';
import {EP003_CAPTION_CUES} from '../audio/alignment.ts';
import {ACT,sec2f} from './timeline.ts';
import {clamp,finiteFrame,pathAt,range,smooth,window} from './math.ts';
import type {V3} from './math.ts';
import type {GobiActingPose} from '../characters/GobiActor';
import type {ResidentPose} from '../characters/ResidentActor';

export const WARTEG_WORLD_ANCHORS={vendor:wartegLocalToWorld(WARTEG_LOCAL_ANCHORS.vendor,L.warteg),
  customer:wartegLocalToWorld(WARTEG_LOCAL_ANCHORS.customer,L.warteg),counterFocus:wartegLocalToWorld(WARTEG_LOCAL_ANCHORS.counterFocus,L.warteg)};
const frontApproach=wartegLocalToWorld([1.5,0,3.3],L.warteg);
const keys:[number,V3][]=[[0,[0,0,0]],[19.7,[0,0,0]],[22.2,[-1,0,5.8]],[25.2,[-9.5,0,8]],[30.5,[-9.5,0,8]],
  [33.8,[-3,0,6.5]],[35,[-0.7,0,4.5]],[50,[-0.7,0,4.5]],[51.2,[2.3,0,5.9]],[53.4,[10.5,0,5.8]],
  [55.6,[10.3,0,0]],[57,[13.8,0,-1.4]],[58.5,frontApproach],[61,WARTEG_WORLD_ANCHORS.customer],
  [76.1,WARTEG_WORLD_ANCHORS.customer],[77.5,frontApproach],[80.4,[10.3,0,0]],[83,[10.5,0,5.8]],[85.2,[3,0,5.9]],[87.4,[0,0,0]],[100,[0,0,0]]];
export const GOBI_PATH=keys.map(([s,position])=>({frame:sec2f(s),position}));
export const gobiPositionAt=(frame:number)=>pathAt(finiteFrame(frame),GOBI_PATH);
function angle(a:number,b:number,t:number){let d=(b-a)%(Math.PI*2);if(d>Math.PI)d-=Math.PI*2;if(d< -Math.PI)d+=Math.PI*2;return a+d*t;}
const headingKeys:[number,number][]=[[0,Math.PI/4],[19.5,Math.PI/4],[20.1,-0.17],[22.3,-1.32],[25.5,-1.75],[30.3,-1.75],
  [31.2,2.0],[34.2,2.0],[35.3,3.80],[42.6,3.80],[43.3,Math.PI/4],[49.8,Math.PI/4],[51,1.1],[53.3,1.1],
  [54,2.6],[56.8,2.6],[58.5,0.75],[61,5.4978],[64.9,5.4978],[65.5,2.3562],[67.8,2.3562],[68.3,5.4978],
  [70.7,5.4978],[71.4,2.3562],[76.1,2.3562],[77.5,2.3562],[80.4,-1.7],[81.16,Math.PI/4],[100,Math.PI/4]];
export function gobiHeadingAt(frame:number){const t=finiteFrame(frame)/30;for(let i=1;i<headingKeys.length;i++)if(t<=headingKeys[i][0])return angle(headingKeys[i-1][1],headingKeys[i][1],smooth(range(t,headingKeys[i-1][0],headingKeys[i][0])));return Math.PI/4;}
const env=(frame:number,a:number,b:number,r=8)=>window(frame,sec2f(a),sec2f(b),r);
export function gobiPoseAt(inputFrame:number):GobiActingPose{
  const f=finiteFrame(inputFrame),[x,,z]=gobiPositionAt(f),previous=gobiPositionAt(Math.max(0,f-1));
  const speed=Math.hypot(x-previous[0],z-previous[2]),walk=clamp(speed/0.07);
  const spoken=EP003_CAPTION_CUES.some(c=>c.words.some(w=>f>=w.start*30&&f<w.end*30));
  const read=Math.max(env(f,7.44,17.34),env(f,43.28,50.05));
  const surprise=Math.max(env(f,0,4.45),env(f,21.82,24.26),env(f,69.92,71.1)*0.6,env(f,72.62,76)*0.95);
  const pocket=env(f,71.65,73.1,8);
  return {x,z,rotY:gobiHeadingAt(f),scale:1,walk,phase:f*0.19,
    blink:((f+17)%123)<4?1:0,happy:Math.max(env(f,29.4,31.84)*0.5,env(f,40.16,42.84)*0.6,env(f,65.5,67.82)*0.8,env(f,87.64,100)*0.6),
    hungry:env(f,65.5,68.3)*0.8,confuse:Math.max(env(f,69.92,72.62),env(f,76.36,81.16)*0.8),surprise,
    headYaw:read*Math.sin(f*0.04)*0.12,headPitch:read*0.12+pocket*0.27,tilt:env(f,69.92,72)*0.16,
    lean:pocket*0.12,roll:Math.sin(f*0.08)*0.018*walk,
    hop:env(f,21.82,22.5)*Math.max(0,Math.sin(range(f,sec2f(21.82),sec2f(22.5))*Math.PI))*0.22,
    up:Math.max(env(f,0.0,0.8)*0.5,env(f,2.9,4.35)*0.6,env(f,21.82,24.26)*0.6,env(f,72.62,75.95)*0.85),
    point:Math.max(env(f,19.26,21.32)*0.85,env(f,26.82,31)*0.8,env(f,68.3,69.5)*0.4),
    wave:env(f,94.98,100)*0.75,armFwd:Math.max(read*0.8,pocket*0.48,env(f,65.5,67.82)*0.55),
    squash:env(f,72.60,73.1)*0.08,pocket,reading:read,speech:spoken?1:0};
}

export const NAME_WINDOWS:Record<string,readonly [number,number]>={
  'warga-3':[sec2f(60.06),sec2f(62.56)],'warga-4':[sec2f(30.0),sec2f(32.5)],
  'warga-5':[sec2f(30.0),sec2f(32.5)],'warga-6':[sec2f(87.9),sec2f(90.4)]};
export const nameOpacityAt=(id:string,f:number)=>{const w=NAME_WINDOWS[id];return w?window(f,w[0],w[1],7):0;};
export function residentPoseAt(id:string,inputFrame:number):ResidentPose{
  const f=finiteFrame(inputFrame),t=f/30;let position:V3=[0,0,0],heading=Math.PI/4,walk=0,wave=0,pay=0,watch=0,visible=true,scale=1;
  if(id==='warga-1'){position=[-1.1+0.25*Math.sin(t*0.22),0,2.9+0.10*Math.sin(t*0.38)];walk=0.25;watch=t>25&&t<43?0.5:0;}
  if(id==='warga-2'){position=[3.8,0,1.6+0.20*Math.sin(t*0.19+1)];walk=0.22;heading=-0.35;}
  if(id==='warga-3'){visible=f>=ACT.shifalina;position=WARTEG_WORLD_ANCHORS.vendor;heading=L.warteg.rotationY;
    scale=smooth(range(f,ACT.shifalina,ACT.shifalina+18));wave=env(f,59.4,62.4);pay=env(f,69.92,72.3,7);watch=pay*0.2;}
  if(id==='warga-4'){visible=f>=ACT.riverResidents;position=[-18.1+Math.sin(t*0.18)*0.18,0,5.4];heading=1.2;watch=0.7;wave=env(f,29,30.8)*0.5;scale=smooth(range(f,ACT.riverResidents,ACT.riverResidents+18));}
  if(id==='warga-5'){visible=f>=sec2f(29.7);position=[-9.5,0,11.5+Math.sin(t*0.16)*0.15];heading=-1.5;watch=0.5;wave=env(f,30.3,31.7)*0.5;scale=smooth(range(f,sec2f(29.7),sec2f(30.3)));}
  if(id==='warga-6'){visible=f>=ACT.joy;position=[-1.7+0.12*Math.sin(t*0.32),0,5.4];heading=0.3;wave=env(f,88,90.5)*0.8;scale=smooth(range(f,ACT.joy,ACT.joy+18));}
  // Independent sampled avoidance; no accumulated physics/previous-frame state.
  if(id==='warga-1'||id==='warga-2'){
    const g=gobiPositionAt(f),dx=position[0]-g[0],dz=position[2]-g[2],d=Math.hypot(dx,dz);
    if(d<1.45){const k=(1.45-d)/Math.max(0.01,d);position=[position[0]+dx*k,0,position[2]+dz*k];walk=0;}
  }
  return {position,heading,walk,wave,pay,watch,scale,visible};
}
export const residentPosesAt=(frame:number)=>EP003_ROSTER.map(r=>({id:r.id,...residentPoseAt(r.id,frame)}));
