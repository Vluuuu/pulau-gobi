import {EP003_WORLD_LAYOUT as L} from '../../episode003/world/layout.ts';
import {obstacleDistance} from '../../episode002/villagerPath.ts';
import type {Obstacle} from '../../episode002/villagerPath.ts';
export type V3=readonly[number,number,number];
export const FARM={position:[10,0,-12] as V3,rotation:Math.PI/4,width:10,depth:8};
export const RANCH={position:[-12,0,-14] as V3,rotation:Math.PI/4,width:10,depth:8};
export const KOST={position:[4,0,14] as V3,rotation:Math.PI/4,width:12,depth:6};
export const FIRST_TREE=[-4,0,5.8] as V3;
export const HUB=[0,0,3] as V3;
export const FOREST_SPOT=[-.4,0,5.1] as V3;
export function transform(p:V3,plot:{position:V3;rotation:number}):V3{const c=Math.cos(plot.rotation),s=Math.sin(plot.rotation);return [plot.position[0]+p[0]*c+p[2]*s,p[1]+plot.position[1],plot.position[2]-p[0]*s+p[2]*c];}
export const FARM_FRONT=transform([-4.5,0,6],FARM),RANCH_FRONT=transform([3.8,0,6],RANCH);
export const CAST_NEW=[
 {id:'warga-7',name:'irtizadelanorillaridwan',role:'Irtiza',cohort:4,tier:'special',seed:71,shirt:'#6b9d79',hair:'#3c2d23',pants:'#5d5543',skin:'#edbf98',hairStyle:1},
 {id:'warga-8',name:'fredrikz_24',role:'Fredrikz',cohort:4,tier:'special',seed:83,shirt:'#b67a4f',hair:'#332b25',pants:'#3c5466',skin:'#d8a77d',hairStyle:0},
 {id:'warga-9',name:'Xyree',handle:'ffbetaffbeta53',role:'Penjaga kandang',cohort:4,tier:'special',seed:97,shirt:'#d5b256',hair:'#252a31',pants:'#485b62',skin:'#edc3a1',hairStyle:2},
] as const;
export const obstacle=(p:{position:V3;rotation:number;width:number;depth:number},pad=0):Obstacle=>({kind:'rect',x:p.position[0],z:p.position[2],rotY:p.rotation,hx:p.width/2+pad,zMin:-p.depth/2-pad,zMax:p.depth/2+pad});
export const BLOCKERS:Obstacle[]=[
 {kind:'rect',x:-5,z:-1,rotY:L.house.rotationY,hx:3.2,zMin:-2.7,zMax:3.5},
 {kind:'rect',x:4.9,z:-2.6,rotY:L.riceField.rotationY,hx:2.66,zMin:-2.09,zMax:2.09},
 {kind:'rect',x:14,z:6,rotY:L.warteg.rotationY,hx:4.2,zMin:-3.3,zMax:3.3},obstacle(FARM),obstacle(RANCH),obstacle(KOST),
 // Staircase and forecourt remain clear throughout construction and pilot.
 obstacle({position:transform([-7.7,0,3.1],KOST),rotation:KOST.rotation,width:5.8,depth:2}),
 obstacle({position:transform([0,0,5.7],KOST),rotation:KOST.rotation,width:12,depth:4}),
 obstacle({position:transform([1.5,0,6.1],RANCH),rotation:RANCH.rotation,width:12,depth:4}),
 {kind:'rect',x:0,z:3.7,rotY:0,hx:4.7,zMin:-2.5,zMax:3.0},
];
export const PATHS:readonly (readonly V3[])[]=[[[0,0,3],[3,0,5.9],[8,0,5.8],[6.7,0,1.8],[6.7,0,-.2],[8.5,0,-1.7],[10.3,0,0],FARM_FRONT],
 [[0,0,3],[-.2,0,-7],RANCH_FRONT],[[3,0,5.9],[10.5,0,5.8],[10.3,0,11],transform([-1.4,0,5.1],KOST)]];
export function segmentDistance(x:number,z:number,a:V3,b:V3){const dx=b[0]-a[0],dz=b[2]-a[2],u=Math.max(0,Math.min(1,((x-a[0])*dx+(z-a[2])*dz)/(dx*dx+dz*dz||1)));return Math.hypot(x-a[0]-u*dx,z-a[2]-u*dz);}
export const roadDistance=(x:number,z:number)=>Math.min(...PATHS.flatMap(p=>p.slice(1).map((b,i)=>segmentDistance(x,z,p[i],b))));
export const clearPlot=(x:number,z:number,pad:number)=>Math.min(...BLOCKERS.map(o=>obstacleDistance(o,x,z)-pad));
