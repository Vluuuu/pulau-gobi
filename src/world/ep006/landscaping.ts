import {NATURE,plantFree} from '../../episode004/production/natureModel.ts';
import {segmentDistance} from '../../episode004/production/layout.ts';
import {distanceToPolylineXZ} from '../../episode003/world/terrain/terrainMath.ts';
import {FIELD_PATH,CROSSING,RIVER_LINE,BRIDGE,OBSERVATION,SCHOOL_YARD} from './layout.ts';
import type {V3} from './layout.ts';
const pathDistance=(x:number,z:number,route:readonly V3[])=>Math.min(...route.slice(1).map((b,i)=>segmentDistance(x,z,route[i],b)));
const footprint=(p:typeof NATURE[number])=>p.kind==='tree'?.55*p.size:p.kind==='bush'?.45*p.size:.12;
export const inSchool=(x:number,z:number,pad=0)=>x> -35.5-pad&&x< -15.4+pad&&z> -33-pad&&z<SCHOOL_YARD.zMax+pad||x> -28-pad&&x< -22+pad&&z> -10-pad&&z< -1.4+pad;
const conflict=(x:number,z:number,pad:number)=>pathDistance(x,z,FIELD_PATH)<1.2+pad||pathDistance(x,z,CROSSING)<1.10+pad||
  Math.abs(x-OBSERVATION.center[0])<OBSERVATION.width/2+.4+pad&&Math.abs(z-OBSERVATION.center[2])<OBSERVATION.depth/2+.4+pad||distanceToPolylineXZ(x,z,RIVER_LINE)<2.9+pad||inSchool(x,z,pad*2.25);
// Retain every EP004 plant ID. Only plants physically affected by the wider bank
// or connected nature path are transplanted, rather than deleted or regenerated.
export const NATURE006=NATURE.map(p=>({...p,fromX:p.x,fromZ:p.z}));
for(const p of NATURE006){
  const pad=footprint(p);if(!conflict(p.x,p.z,pad))continue;
  for(let k=0;k<720;k++){
    const a=k*2.399963+p.id*.17,r=1.5+Math.floor(k/24)*.65,x=p.fromX+Math.sin(a)*r,z=p.fromZ+Math.cos(a)*r;
    if(conflict(x,z,pad)||!plantFree(x,z,p.kind==='tree'?1.2*p.size:pad))continue;
    if(NATURE006.some(q=>q!==p&&Math.hypot(x-q.x,z-q.z)<pad+footprint(q)+.25))continue;
    p.x=x;p.z=z;break;
  }
}
export const TRANSPLANTS=NATURE006.filter(p=>p.x!==p.fromX||p.z!==p.fromZ).map(p=>({id:p.id,kind:p.kind,from:[p.fromX,p.fromZ],to:[p.x,p.z]}));
