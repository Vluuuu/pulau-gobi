import type {V3} from '../world/ep006/layout.ts';
import {ramp,pulse} from './timeline.ts';
export const angleDelta=(a:number,b:number)=>Math.atan2(Math.sin(b-a),Math.cos(b-a));
export const mixAngle=(a:number,b:number,t:number)=>a+angleDelta(a,b)*t;
export const envelope=(f:number,a:number,attack:number,hold:number,release:number)=>ramp(f,a,a+attack)*(1-ramp(f,a+attack+hold,a+attack+hold+release));
export const length=(v:V3)=>Math.hypot(...v);
export const add=(a:V3,b:V3):V3=>[a[0]+b[0],a[1]+b[1],a[2]+b[2]];
export const sub=(a:V3,b:V3):V3=>[a[0]-b[0],a[1]-b[1],a[2]-b[2]];
export const mul=(a:V3,s:number):V3=>[a[0]*s,a[1]*s,a[2]*s];
export const lerp3=(a:V3,b:V3,t:number):V3=>add(a,mul(sub(b,a),t));
export const unit=(a:V3):V3=>mul(a,1/(length(a)||1));
const dot=(a:V3,b:V3)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2];
// Stable two-bone reach: no stretched limbs, timers or physics.
export function solveLimb(root:V3,goal:V3,upper:number,lower:number,bend:V3){
  const v=sub(goal,root),d=Math.max(Math.abs(upper-lower)+.0001,Math.min(length(v),upper+lower-.0001)),u:V3=length(v)<1e-8?[0,-1,0]:unit(v),tip=add(root,mul(u,d));
  const a=(upper*upper-lower*lower+d*d)/(2*d),h=Math.sqrt(Math.max(0,upper*upper-a*a));
  let n=unit(sub(bend,mul(u,dot(bend,u))));if(length(n)<.01)n=[0,0,1];
  return {joint:add(add(root,mul(u,a)),mul(n,h)),tip};
}
export function footCycle(distance:number,speed:number,side:number,stride=1.12){
  const phase=((distance/stride+(side>0?.5:0))%1+1)%1,stance=.62,walking=Math.min(1,speed/.65);
  const reach=stride*stance/2;
  return {z:(phase<stance?reach*(1-2*phase/stance):-reach+2*reach*ramp(phase,stance,1))*walking,
    lift:phase<stance?0:Math.sin((phase-stance)/(1-stance)*Math.PI)*(.055+Math.min(speed,3)*.025)*walking,
    sway:Math.sin(distance/stride*Math.PI*2)*.025*walking,bob:-.016*(1-Math.cos(distance/stride*Math.PI*4))*walking};
}
export type Acting={left:V3;right:V3;point:boolean;bodyRoll:number;breath:number;shock:number;wipe:number};
export function gestureAt(kind:string,f:number,start:number,seed=0):Acting{
  const q=f-start,accent=envelope(q,7,8,14,26),second=envelope(q,72,10,18,26),rest=Math.sin(f*.035+seed)*.012;
  let left:V3=[-.48,.03,.07],right:V3=[.48,.03,.07],point=false,bodyRoll=rest,shock=0,wipe=0;
  if(kind==='surprise'){const pre=envelope(q,0,4,1,6),hit=envelope(q,5,5,8,28);left=[-.48,.03+.64*hit,.10-.08*pre];right=[.48,.03+.64*hit,.10-.08*pre];shock=hit;bodyRoll=-.04*hit;}
  if(kind==='welcome'||kind==='invite'){left=[-.55,.10+.18*accent,.16+.13*accent];right=[.48,.02+.43*(accent||second),.12+.12*accent];bodyRoll=.035*accent;}
  if(kind==='present'||kind==='point'){right=[.52,.18+.30*accent,.34];left=[-.48,.04+.1*second,.08];point=true;}
  if(kind==='measure'){left=[-.69,.34,.13];right=[.69,.34,.13];bodyRoll=.04*pulse(q,10,38);}
  if(kind==='think'){right=[.18,.84,.37];left=[-.44,.05,.1];bodyRoll=.035;}
  if(kind==='laugh'){const a=pulse(q,8,23)+.7*pulse(q,28,44);left=[-.38,.13,.30];right=[.38,.16,.30];bodyRoll=Math.sin(q*.3)*.045*a;}
  if(kind==='formal'){left=[-.12,.16,.34];right=[.12,.16,.34];}
  if(kind==='wave'){right=[.45,.72,.22+.055*Math.sin(q*.24)*envelope(q,4,9,40,14)];left=[-.46,.05,.1];}
  return {left,right,point,bodyRoll,breath:rest,shock,wipe};
}
export function worldToActor(target:V3,origin:V3,heading:number,scale=1):V3{
  const d=sub(target,origin),c=Math.cos(heading),s=Math.sin(heading);
  return [(d[0]*c-d[2]*s)/scale,d[1]/scale,(d[0]*s+d[2]*c)/scale];
}
