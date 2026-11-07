import {NATURE} from '../episode004/production/natureModel.ts';
import {DECOR} from '../episode002/islandDecor.ts';
import {shotAt} from './shots.ts';
import {gobiAt} from './direction.ts';
import {LIP,GATE} from './layout.ts';
import type {V3} from './layout.ts';
import {gap,ramp} from './timeline.ts';
import {CAMPUS_HERO_TARGET} from './campus.ts';
export type Camera={target:V3;width:number;az:number;elevation:number;position:V3;zoom:number;id:string};
export const TREES=[...NATURE.filter(p=>p.kind==='tree').map(p=>({id:`ep004-tree-${p.id}`,x:p.x,z:p.z,r:1.25*p.size,h:3.8*p.size})),
 ...DECOR.filter(p=>p.kind==='tree').map((p,i)=>({id:`ep002-tree-${i}`,x:p.x,z:p.z,r:1.4*p.size,h:4*p.size})),{id:'irtiza-first-tree',x:-4,z:5.8,r:1.3,h:3.8}];
export function cameraFor(id:string,target:V3,width:number,az=45,elevation=26,d=145):Camera {
 const a=az*Math.PI/180,e=elevation*Math.PI/180;
 return {id,target,width,az,elevation,zoom:1080/width,position:[target[0]+d*Math.sin(a)*Math.cos(e),target[1]+d*Math.sin(e),target[2]+d*Math.cos(a)*Math.cos(e)]};
}
export function treeBlocks(camera:Camera,probe:V3){
 const [cx,cy,cz]=camera.position,dx=probe[0]-cx,dy=probe[1]-cy,dz=probe[2]-cz;
 return TREES.filter(t=>{const u=Math.max(0,Math.min(1,((t.x-cx)*dx+(t.z-cz)*dz)/(dx*dx+dz*dz)));const y=cy+dy*u;return u<.999&&y>.1&&y<t.h&&Math.hypot(cx+dx*u-t.x,cz+dz*u-t.z)<t.r;});
}
export function project(p:V3,c:Camera){
 const a=c.az*Math.PI/180,e=c.elevation*Math.PI/180,dx=p[0]-c.target[0],dy=p[1]-c.target[1],dz=p[2]-c.target[2];
 return {x:540+(Math.cos(a)*dx-Math.sin(a)*dz)*c.zoom,y:960-(-Math.sin(a)*Math.sin(e)*dx+Math.cos(e)*dy-Math.cos(a)*Math.sin(e)*dz)*c.zoom};
}
const RIVER:readonly[V3,number,number,number]=[[-16,0,24],33,-65,48];
const FARM_WIDE:readonly[V3,number,number,number]=[[10,.5,-12],20,45,48];
const RANCH_WIDE:readonly[V3,number,number,number]=[[-12,1,-13],20,135,38];
const CAMPUS:readonly[V3,number,number,number]=[CAMPUS_HERO_TARGET,31,28,30];
export const MIRRORS={S01:RIVER,S02a:FARM_WIDE,S02b:RANCH_WIDE,S22a:CAMPUS};
const angles=new Map<string,{az:number;elevation:number}>();
export function cameraAt(f:number):Camera{
 const s=shotAt(f),g=gobiAt(f),p=g.position;
 const fixed=(v:readonly[V3,number,number,number])=>cameraFor(s.id,...v);
 // Wide/insert cameras are reserved for concrete environment, construction or access beats.
 if(s.id==='S07b')return fixed([[-7,-32,22],82*(1+.07*ramp(f,s.start,s.end)),-35,16]);
 if(s.id==='S07a')return fixed([[LIP[0],-.3,LIP[2]],10,-25,16]);
 if(s.id==='S06')return fixed([[-12.5,.1,34],35,-65,54]);
 if(s.id==='S02a-context'||s.id==='S12b'||s.id==='S32b')return fixed(FARM_WIDE);
 if(s.id==='S11')return fixed([[4.9,.5,-2.6],11,45,48]);
 if(s.id==='S15'||s.id==='S31-count'||s.id==='S32c')return fixed(RANCH_WIDE);
 if(s.id==='S32a')return fixed(RIVER);
 if(s.id==='S22a'||s.id==='S32d')return fixed(CAMPUS);
 if(s.id==='S20')return fixed([[-26,1,-22],29,28,43]);
 if(s.id==='S20-upper')return fixed([[-26,4.1,-24],25,28,34]);
 if(s.id==='S21'||s.id==='S23c')return cameraFor(s.id,[-21,2,-21],14,45,30);
 if(s.id==='S15b')return fixed([[GATE[0]+.6,.9,GATE[2]],2.1,135,30]);
 if(s.id==='S24b')return fixed([[GATE[0],1,GATE[2]-.1],5.6,135,26]);
 if(s.id==='S26')return fixed([[-16,1,-9],23,-12,35]);
 if(['S24','S26-gate','S30d-gate','S30a'].includes(s.id))return fixed([[-21,1.0,-12],10,0,27]);
 if(['S24-main','S27-main','S30d'].includes(s.id))return fixed([[-20,1.4,-17.2],7.8,-12,21]);
 if(['S24-class','S27'].includes(s.id))return fixed([[-20,1.5,-19.6],7,10,23]);
 if(s.id==='S33b-wide')return fixed([[0,-8,0],116,45,28]);
 // Every on-camera line now has a readable face, not a zone-wide inherited preset.
 let az=s.zone==='ranch'?135:s.zone==='warteg'?135:['school','class','foyer','route'].includes(s.zone)?0:45;
 if(['S25','S28','S29','S30b'].includes(s.id))az=-25;
 if(s.id==='S31')az=0;
 if(s.id==='S31-walk')az=-45;
 let elevation=s.zone==='class'?12:19,width=s.preset==='MS'?4.0:s.preset==='TS'?6.5:4.4;
 if(s.id==='S09a')width=7.4;
 if(s.id==='S08b')width=6.2;
 if(s.id==='S23a'||s.id==='S22b-class')width=6.7;
 if(s.id==='S16a'||s.id==='S28')width=5.6;
 if(s.id==='S31'||s.id==='S31-walk'||s.id==='S18')width=5.0;
 const focus=(frame:number):V3=>{
  const q=gobiAt(frame).position;
  const dx=s.id==='S23a'?-.8:s.id==='S22b-class'?-.5:s.id==='S08b'?-.7:s.id==='S09a'?1.0:s.id==='S28'?-.5:0;
  return [q[0]+dx,q[1]+1.08,q[2]];
 };
 if(!angles.has(s.id)){
  const frames=[s.start,s.start+(s.end-s.start)*.25,(s.start+s.end)/2,s.start+(s.end-s.start)*.75,s.end-1];
  const locked=s.zone==='class'||s.id==='S31'||s.id==='S31-walk';
  const candidates=(locked?[0]:[0,15,-15,30,-30,45,-45]).flatMap(a=>(locked?[0]:[0,5,10]).map(e=>({az:az+a,elevation:elevation+e})));
  const score=(candidate:{az:number;elevation:number})=>frames.reduce((n,frame)=>{
   const q=gobiAt(frame).position,c=cameraFor(s.id,focus(frame),width,candidate.az,candidate.elevation,s.zone==='class'&&s.id==='S23a'?4.2:s.zone==='class'?2.2:3.6);
   return n+[[0,1.65,0],[-.65,1.0,0],[.65,1.0,0]].reduce((v,o)=>v+treeBlocks(c,[q[0]+o[0],q[1]+o[1],q[2]+o[2]]).length,0);
  },0);
  candidates.sort((a,b)=>score(a)-score(b));angles.set(s.id,candidates[0]);
 }
 const chosen=angles.get(s.id)!;
 // Fixed azimuth; only a walk-and-talk translates the camera along the actor's real path.
 return cameraFor(s.id,focus(f),width,chosen.az,chosen.elevation,s.zone==='class'&&s.id==='S23a'?4.2:s.zone==='class'?2.2:3.6);
}
