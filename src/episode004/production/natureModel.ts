import {octagonBoundaryRadius,distanceToPolylineXZ} from '../../episode003/world/terrain/terrainMath.ts';
import {EP003_WORLD_LAYOUT as L} from '../../episode003/world/layout.ts';
import {DECOR} from '../../episode002/islandDecor.ts';
import {clearPlot,roadDistance,FIRST_TREE} from './layout.ts';
import {GREEN_A,GREEN_B,radiusAt,ramp} from './timeline.ts';
export type Plant={id:number;kind:'tree'|'bush'|'grass'|'flower'|'stone';x:number;z:number;size:number;variant:number;delay:number};
export const hash=(n:number)=>{const v=Math.sin(n*12.9898+4004.37)*43758.5453;return v-Math.floor(v);};
export function plantFree(x:number,z:number,pad:number){
 if(Math.hypot(x,z)+pad+1>octagonBoundaryRadius(Math.atan2(x,z),52))return false;
 if(clearPlot(x,z,pad+1)<0||roadDistance(x,z)<pad+1.1)return false;
 if(distanceToPolylineXZ(x,z,L.river.centerline)<2.3+pad)return false;
 if(Math.hypot(x-FIRST_TREE[0],z-FIRST_TREE[2])<2.4+pad)return false;
 return !DECOR.some(d=>(d.kind==='tree'||d.kind==='bush')&&Math.hypot(x-d.x,z-d.z)<pad+(d.kind==='tree'?1.0:.65)*d.size+.5);
}
export function makeNature():Plant[]{
 const plants:Plant[]=[];let id=0;
 for(const [kind,count]of [['tree',145],['bush',150],['grass',360],['flower',150],['stone',45]] as const){
  let accepted=0;
  for(let j=0;j<16000&&accepted<count;j++){
   const n=j+count*31,az=hash(n+11)*Math.PI*2,r=8+Math.sqrt(hash(n+19))*43;
   // Different radial bands and a hashed density mask create groves and openings.
   const x=Math.sin(az)*r,z=Math.cos(az)*r,size=.82+hash(n+31)*.58,pad=kind==='tree'?1.2*size:kind==='bush'?.65*size:.18;
   if(!plantFree(x,z,pad))continue;
   if(kind==='tree'&&plants.some(p=>p.kind==='tree'&&Math.hypot(x-p.x,z-p.z)<2.8))continue;
   let delay=r<14?GREEN_A.start+24+r/14*27:GREEN_B.start+(r-14)/38*45;
   if(r>35){let f=GREEN_B.start;while(f<GREEN_B.end&&radiusAt(f)<r+pad+1)f++;delay=Math.max(delay,f+15);}
   plants.push({id:id++,kind,x,z,size,variant:Math.floor(hash(n+91)*3),delay:Math.min(GREEN_B.end-18,Math.round(delay+hash(n+45)*5))});accepted++;
  }
 }
 return plants;
}
export const NATURE=makeNature();
export const growthAt=(p:Plant,f:number)=>{const t=ramp(f,p.delay,p.delay+(p.kind==='tree'?17:10));return t>=1?1:t+Math.sin(t*Math.PI)*.14;};
