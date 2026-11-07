import {RANCH,FARM,transform} from '../episode004/production/layout.ts';
import {EP003_WORLD_LAYOUT as L} from '../episode003/world/layout.ts';
export {RANCH,FARM,transform,L};
export type V3=readonly[number,number,number];
export const SCHOOL={position:[-20,0,-22] as V3,rotation:0,width:8.4,depth:5.8};
export const FLOOR_Y=.40;
export const DOOR:V3=[-20,FLOOR_Y,-19.16];
export const SCHOOL_GATE:V3=[-21,0,-10];
export const MAIN_DOOR:V3=[-20,FLOOR_Y,-16.18];
export const FOYER:V3=[-20,FLOOR_Y,-17.6];
export const SCHOOL_ACCESS:readonly V3[]=[SCHOOL_GATE,[-21,0,-13.3],[-20,0,-15],MAIN_DOOR,FOYER,DOOR,[-20,FLOOR_Y,-20.6]];
export const GATE=transform([0,0,3.8],RANCH);
export const ROUTE:readonly V3[]=[GATE,transform([0,0,5.8],RANCH),transform([-6.2,0,5.8],RANCH),[-18,0,-8.6],...SCHOOL_ACCESS,[-20,FLOOR_Y,-21.4]];
export const COW_HOME=[transform([2.3,0,1.5],RANCH),transform([-2.4,0,1.2],RANCH),transform([0,0,2.6],RANCH)];
// Follows the original tangent, then bends through existing trunk clearances to the rim.
// No existing footpath crosses this extension; no decorative bridge is invented.
export const CHANNEL:readonly (readonly[number,number])[]=[[-15,20],[-10.5,37.5],[-10.5,48.5]];
export const LIP:V3=[CHANNEL[CHANNEL.length-1][0],-.10,CHANNEL[CHANNEL.length-1][1]];
export const LOOKOUT:V3=[-17.7,0,23.3];
export const FARM_PAD:V3=transform([-3.3,0,5.2],FARM);
export const RANCH_PAD:V3=transform([3.2,0,5.2],RANCH);
export const SCHOOL_PAD:V3=[-20,0,-13.6];
export const CLASS_PAD:V3=[-19.1,FLOOR_Y,-20.0];
export const pathLength=(p:readonly V3[])=>p.slice(1).reduce((d,b,i)=>d+Math.hypot(b[0]-p[i][0],b[2]-p[i][2]),0);
export function travel(f:number,start:number,end:number,points:readonly V3[]){
 const lens=points.slice(1).map((b,i)=>Math.hypot(b[0]-points[i][0],b[2]-points[i][2])),total=lens.reduce((a,b)=>a+b,0);
 const u=clamp((f-start)/(end-start)),d=total*u;let rem=d,i=0;
 while(i<lens.length-1&&rem>lens[i])rem-=lens[i++];const a=points[i],b=points[i+1]??a,k=lens[i]?rem/lens[i]:0;
 return {position:[a[0]+(b[0]-a[0])*k,a[1]+(b[1]-a[1])*k,a[2]+(b[2]-a[2])*k] as V3,heading:Math.atan2(b[0]-a[0],b[2]-a[2]),walk:f>start&&f<end?1:0,stride:d*5.5,distance:d};
}
const clamp=(x:number)=>Math.max(0,Math.min(1,x));
