import {RIVER_WIDTH,RIVER_LINE} from './layout.ts';
import {createRiverModel,samplePath} from '../../episode003/world/river/riverMath.ts';
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
  const u=((frame*.0008+i*.109)%1),s=12+u*25,p=samplePath(fishModel,s),l=Math.sin(frame*.025+i)*1.1;
  const jumping=i===0&&frame>=jumpFrame&&frame<=jumpFrame+28,t=(frame-jumpFrame)/28;
  let position:[number,number,number]=[p.x+p.nx*l,-.37+Math.sin(frame*.05+i)*.055,p.z+p.nz*l];
  if(i===0){
    const swim:[number,number,number]=[-12.2+Math.sin(frame*.02)*.20,-.37,23+Math.sin(frame*.014)*.6];
    const approach=frame<jumpFrame?Math.max(0,Math.min(1,(frame-jumpFrame+45)/45)):1-Math.max(0,Math.min(1,(frame-jumpFrame-28)/45));
    position=swim.map((v,j)=>v+([-11.7,-.32,23][j]-v)*approach) as [number,number,number];
    if(jumping)position=[-11.7+Math.sin(Math.PI*t)*1.05,-.32+Math.sin(Math.PI*t)*2.05,23];
  }
  return {position,heading:jumping?Math.PI/2:Math.atan2(p.tx,p.tz),jumping};
}
