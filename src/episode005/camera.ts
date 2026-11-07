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
export function cameraFor(id:string,target:V3,width:number,az=45,elevation=26):Camera {
 const a=az*Math.PI/180,e=elevation*Math.PI/180,d=145;
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
const FARM:readonly[V3,number,number,number]=[[10,.5,-12],20,45,48];
const RANCH_SHOT:readonly[V3,number,number,number]=[[-12,1,-13],20,135,38];
const SCHOOL:readonly[V3,number,number,number]=[CAMPUS_HERO_TARGET,31,28,30];
// Mirror presets share the same numeric tuple; no separate tuning or interpolation.
export const MIRRORS={S01:RIVER,S02a:FARM,S02b:RANCH_SHOT,S22a:SCHOOL};
export function cameraAt(f:number):Camera{
 const s=shotAt(f),g=gobiAt(f).pose;
 let target:V3=[g.x,1.15,g.z],width=s.preset==='MS'?4.2:s.preset==='TS'?7.4:4.3,az=s.zone==='school'||s.zone==='class'?0:45,elev=26;
 let fixed=false;
 const preset=(p:readonly[V3,number,number,number])=>{[target,width,az,elev]=p;fixed=true;};
 if(['S01','S32a'].includes(s.id))preset(RIVER);
 else if(['S02a','S32b','S12a','S12b'].includes(s.id))preset(FARM);
 else if(['S02b','S14a','S15','S31','S32c'].includes(s.id))preset(RANCH_SHOT);
 else if(['S10','S11'].includes(s.id))preset([[4.9,.5,-2.6],11,45,52]);
 else if(s.id==='S06')preset([[-12.5,.1,34],38,-65,56]);
 else if(s.id==='S07a')preset([[LIP[0],-.3,LIP[2]],10,-25,16]);
 else if(s.id==='S07b'){preset([[-7,-32,22],84*(1+.07*ramp(f,s.start,s.end)),-35,16]);}
 else if(['S04'].includes(s.id))preset([[-16,.8,24],24,-65,40]);
 else if(s.id==='S05c')preset([[-9,2,11],24,-19,16]);
 else if(['S18','S26','S30a'].includes(s.id))preset([[-16,.8,-15],32,-30,53]);
 else if(s.id==='S20')preset([[-26,2,-22],34,28,50]);
 else if(['S22a','S32d','S34a'].includes(s.id))preset(SCHOOL);
 else if(s.id==='S21'||s.id==='S23c')preset([[-20,1,-22],12,12,38]);
 else if(s.zone==='class')preset([[-19.9,1,-21.1],8.5,0,32]);
 else if(s.id==='S15b')preset([[GATE[0]+.6,.9,GATE[2]],2.1,135,30]);
 else if(s.id==='S24b')preset([[GATE[0],1,GATE[2]-.1],5.6,135,30]);
 else if(s.id==='S16a')preset([[-9.3,1,-10.7],11,135,29]);
 else if(s.id==='S17a'||s.id==='S17b'||s.id==='S33a')preset([[GATE[0]+.7,1,GATE[2]+.8],7.4,135,28]);
 else if(s.id==='S13b')preset([[14.6,1.5,4.2],10,135,18]);
 else if(s.id==='S22b')preset([[-21,1.2,-18.2],6.8,0,26]);
 else if(s.id==='S24')preset([[-20,.9,-18],10.5,0,31]);
 else if(s.id==='S30d')preset([[-20,.7,-17.2],17,0,39]);
 else if(s.id==='S33b-wide')preset([[0,-8,0],116,45,28]);
 else if(s.id==='S08b')target=[-18.4,1.2,24.1];
 else if(s.id==='S09a'){target=[-16.6,1.2,24];width=11;}
 else if(s.id==='S23a'){target=[-21.3,1.2,-17.1];width=9;}
 const initial=cameraFor(s.id,target,width,az,elev);
 // Calibrated per shot, not per frame: candidates are scored against the whole acting interval.
 // Existing trees are kept opaque, in place. No fades, hiding, or geometry deletion.
 if(!fixed&&s.dialog){
  const frames=[s.start,s.start+(s.end-s.start)*.25,(s.start+s.end)/2,s.start+(s.end-s.start)*.75,s.end-1];
  const score=(c:Camera)=>frames.reduce((n,frame)=>{const p=gobiAt(frame).pose;return n+[[0,1.65,0],[-.7,1,0],[.7,1,0]].reduce((m,o)=>m+treeBlocks(c,[p.x+o[0],o[1]+(p.hop??0),p.z+o[2]]).length,0);},0);
  const candidates=[0,20,-20,35,-35,50,-50].flatMap(a=>[0,6,12].map(e=>cameraFor(s.id,target,width,az+a,elev+e)));
  candidates.sort((a,b)=>score(a)-score(b));return candidates[0];
 }
 return initial;
}
