import {shotAt,shot,SPLASH_FRAME} from './shots.ts';
import {gobiAt,studentAt,adultAt} from './direction.ts';
import {COW_HOME,BRIDGE,OBSERVATION} from '../world/ep006/layout.ts';
import type {V3} from '../world/ep006/layout.ts';
import {E,ramp} from './timeline.ts';
export type Camera006={position:V3;target:V3;width:number;zoom:number;az:number};
const setup=(target:V3,width:number,az=22,elevation=12,distance=12):Camera006=>{
  const a=az*Math.PI/180,e=elevation*Math.PI/180;
  return {target,width,zoom:1080/width,az,position:[target[0]+distance*Math.sin(a)*Math.cos(e),target[1]+distance*Math.sin(e),target[2]+distance*Math.cos(a)*Math.cos(e)]};
};
export function cameraAt(f:number):Camera006{
  const s=shotAt(f),g=gobiAt(f),q=f-s.start;
  if(s.id==='S15'&&f>=E(31.2)&&f<E(33.05))return setup([-20.4,2.15,-24.4],4.8,18,8,8);
  if(s.id==='S36'&&q>110&&q<145)return setup([-20,1,-13.4],10,24,22,18);
  if(s.id==='S36'&&q>145&&q<175)return setup([-14.2,.8,16],11,15,25,20);
  if(s.id==='S36'&&q>175&&q<205)return setup([-12,1,-14],13,45,28,22);
  if(s.dialogue&&s.id!=='S14')return setup([g.position[0],g.position[1]+1.28,g.position[2]],s.id==='S01'?3.6:4.2,18,8,7);
  if(s.id==='S02')return setup([-20,1.3,-21],4.4,25,12,9);
  if(['S06','S07','S08','S09'].includes(s.id)){const i=(Number(s.id.slice(1))-6)*2,a=studentAt(i,f).position,b=studentAt(i+1,f).position;return setup([(a[0]+b[0])/2,1.0,(a[2]+b[2])/2],4.5,25,10,7);}
  if(s.id==='S13')return setup([-21.2,1.8,-23.3],5.3,20,10,9);
  if(s.id==='S14'){const p=adultAt('warga-21',f).position;return setup([p[0],p[1]+1,p[2]],4.4,20,10,8);}
  if(s.id==='S10'||s.id==='S11'){const p=studentAt(s.id==='S10'?4:3,f).position;return setup([p[0],p[1]+.9,p[2]],s.id==='S10'?7.8:6.5,26,18,12);}
  if(s.id==='S12')return setup([-20,1.25,-21.6],8.1,24,22,14);
  if(s.id==='S17')return setup([-14.3,.1,16],12.5-1.5*ramp(q,0,s.end-s.start),-35,38,24);
  if(s.id==='S18')return setup([-14.2,-.12,15],5.5,-20,32,9);
  if(s.id==='S19')return setup([-10.5,-17,44],37,-32,12,75);
  if(s.id==='S20'){const p=studentAt(4,f).position;return setup([p[0],.8,p[2]],8.8,-35,24,18);}
  if(['S21','S23'].includes(s.id))return setup([BRIDGE.center[0],.35,BRIDGE.center[2]],s.id==='S23'?10.3:12.3,-30,33,22);
  if(s.id==='S24'||s.id==='S34')return setup([BRIDGE.center[0],.65,BRIDGE.center[2]],10.7,20,24,22);
  if(s.id==='S25')return setup([OBSERVATION.center[0]-.8,.9,OBSERVATION.center[2]],8.1,-18,28,18);
  if(s.id==='S26')return setup([-11,1.1,20.3],6,-55,24,12);
  if(s.id==='S27')return setup([-10.65,1.25,23],3.9,-30,10,8);
  if(s.id==='S28')return f<SPLASH_FRAME+17?setup([-11.7,.5,23],3.6,-30,16,8):setup([-10.65,1.15,23],4.0,-28,12,8);
  if(s.id==='S29')return setup([-10,1.15,22.1],5.8,-25,12,10);
  if(s.id==='S31'){const i=Math.min(2,Math.floor(q/Math.max(1,(s.end-s.start)/3))),p=COW_HOME[i];return setup([p[0],1.25,p[2]],4.6,48,12,9);}
  if(s.id==='S32')return setup([-12,1.2,-11.7],8.2,45,18,16);
  if(s.id==='S33'){const p=studentAt(2,f).position;return setup([p[0],.95,p[2]],8.2,25,24,18);}
  // S05/S16/S30 are authentic comment overlays with contextual 3D behind them.
  if(s.id==='S16')return setup([-14.5,.3,16],15,-25,30,25);
  if(s.id==='S30')return setup([-12,1,-14],15,45,28,22);
  if(s.id==='S37')return setup([g.position[0],1.3,g.position[2]],4.2,18,8,7);
  return setup([-21,1,-10],10,24,24,20);
}
