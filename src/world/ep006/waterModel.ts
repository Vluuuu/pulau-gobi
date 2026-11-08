import {RIVER_WIDTH,RIVER_LINE,FISH_TAKEOFF,FISH_LANDING,HEADMASTER_OBS} from './layout.ts';
import type {V3} from './layout.ts';
import {createRiverModel,samplePath} from '../../episode003/world/river/riverMath.ts';
import {SPLASH_FRAME} from '../../episode006/shots.ts';
import {ramp,clamp} from '../../episode006/timeline.ts';
import {envelope,lerp3} from '../../episode006/performance.ts';
export const FISH_FLIGHT=36;
export const SPLASH_CONTACT=SPLASH_FRAME+24;
export function splashAt(frame:number){return {
  anticipation:envelope(frame,SPLASH_FRAME-24,10,8,10),
  shock:envelope(frame,SPLASH_CONTACT,3,8,42),
  wipe:envelope(frame,SPLASH_CONTACT+27,9,18,18),
  drip:envelope(frame,SPLASH_CONTACT+8,5,40,18),
  impact:envelope(frame,SPLASH_CONTACT-1,2,1,8),
};}
export const widthAt=(z:number,widen:number)=>{
  const wide=3+(RIVER_WIDTH-3)*widen,t=Math.max(0,Math.min(1,(z-40.5)/8));
  return wide-(wide-(3+.15*widen))*t*t*(3-2*t);
};
export function taperRiverPositions(positions:Float32Array,widen:number){
  const half=(3+(RIVER_WIDTH-3)*widen)/2;
  for(let i=0;i<positions.length;i+=3){const z=positions[i+2];if(z<=40.5)continue;
    const dx=positions[i]+10.5,newHalf=widthAt(z,widen)/2;
    positions[i]=-10.5+Math.sign(dx)*(Math.min(Math.abs(dx),half)*newHalf/half+Math.max(0,Math.abs(dx)-half));
  }
  return positions;
}
const fishModel=createRiverModel({centerline:RIVER_LINE,width:RIVER_WIDTH,bedY:-.65,waterY:-.15})!;
export function fishAt(i:number,frame:number,jumpFrame:number){
  const phase=frame*.009+i*.71,u=.5+.5*Math.sin(phase),s=12+u*25,p=samplePath(fishModel,s),l=Math.sin(frame*.025+i)*1.1;
  const jumping=i===0&&frame>=jumpFrame&&frame<=jumpFrame+FISH_FLIGHT,t=(frame-jumpFrame)/FISH_FLIGHT;
  let position:[number,number,number]=[p.x+p.nx*l,-.37+Math.sin(frame*.05+i)*.055,p.z+p.nz*l];
  if(i===0){
    const swim:V3=[-13.3+Math.sin(frame*.02)*.20,-.38,23.4+Math.sin(frame*.014)*.6];
    const approach=frame<jumpFrame?ramp(frame,jumpFrame-45,jumpFrame):1-ramp(frame,jumpFrame+FISH_FLIGHT,jumpFrame+FISH_FLIGHT+45);
    position=[...lerp3(swim,frame<jumpFrame?FISH_TAKEOFF:FISH_LANDING,approach)];
    if(jumping)position=[FISH_TAKEOFF[0]+(FISH_LANDING[0]-FISH_TAKEOFF[0])*t+Math.sin(Math.PI*t)*.72,-.34+Math.sin(Math.PI*t)*2.03,FISH_TAKEOFF[2]+(FISH_LANDING[2]-FISH_TAKEOFF[2])*t];
  }
  const ds=Math.cos(phase)*.1125,dl=Math.cos(frame*.025+i)*.0275;
  return {position,heading:jumping?Math.PI/2:Math.atan2(p.tx*ds+p.nx*dl,p.tz*ds+p.nz*dl),pitch:jumping?-Math.atan2(Math.cos(Math.PI*t)*2.03*Math.PI,.8):0,jumping};
}
export function splashDropletAt(i:number,frame:number){
  const emission=SPLASH_FRAME+12+(i%5),end=SPLASH_CONTACT+(i%3),t=(frame-emission)/(end-emission),u=clamp(t);
  const source=fishAt(0,emission,SPLASH_FRAME).position,goal:V3=[HEADMASTER_OBS[0]+Math.sin(i*2.1)*.14,HEADMASTER_OBS[1]+1.77+Math.cos(i*2.1)*.12,HEADMASTER_OBS[2]+Math.sin(i*1.3)*.16];
  const position=lerp3(source,goal,u);return {visible:t>=0&&t<=1,position:[position[0],position[1]+Math.sin(Math.PI*u)*.65,position[2]] as V3,scale:.028+(i%3)*.011};
}
