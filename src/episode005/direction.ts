import type {GobiPose} from '../Gobi';
import {CAST as OLD_CAST} from '../episode004/production/direction.ts';
import {gap,editFrame as E,masterAt,pulse,ramp} from './timeline.ts';
import {shotAt} from './shots.ts';
import {FARM_PAD,RANCH_PAD,SCHOOL_PAD,CLASS_PAD,LOOKOUT,GATE,RANCH,ROUTE,COW_HOME,transform,travel} from './layout.ts';
import type {V3} from './layout.ts';
import {CAMPUS_HERO_GOBI} from './campus.ts';
const extra=[
 {id:'warga-10',name:'guapusingnjir',special:true,seed:105,shirt:'#277c57',hair:'#252a26',pants:'#334842',skin:'#e9bf93',hairStyle:1},
 {id:'warga-11',name:'DamiaInsyirah🫐🤍',special:true,seed:115,shirt:'#a7a8d6',hair:'#373449',pants:'#5d607d',skin:'#ecc8b0',hairStyle:2},
 {id:'warga-12',name:'RIS_26',special:false,seed:125,shirt:'#6fa4c2',hair:'#332a26',pants:'#596678',skin:'#dfb28c',hairStyle:0},
];
export const CAST=[...OLD_CAST,...extra.map(r=>({id:r.id,name:r.name,cohort:5,special:r.special,isLegacy:false,visual:{...r,scale:1,accessory:1}}))];
export const FIRST_APPEARANCE:Record<string,number>={'warga-10':E(26.4),'warga-11':E(77.8),'warga-12':E(30.44)};
export const COW_IDS=['cow-001','cow-002','cow-003'] as const;
export const COW_ROUTE_START=E(91.5);
export const COW_ROUTE_END=gap('G5').end-15;
export const RETURN_START=gap('G6').start+42;
export const RETURN_END=E(103.1);
export function cowAt(id:string,f:number){
 const i=COW_IDS.indexOf(id as typeof COW_IDS[number]),home=COW_HOME[i];
 let pose={position:home,heading:RANCH.rotation,walk:0,stride:0,distance:0};
 const entry=gap('G3').start+i*19;
 if(f<gap('G3').end){const p=transform([i*.72-.72,0,7],RANCH);pose=travel(f,entry,Math.min(gap('G3').end-3,entry+58),[p,transform([0,0,3.8],RANCH),home]);}
 if(i===2){
  if(f>=E(63)&&f<COW_ROUTE_START)pose={...pose,heading:Math.atan2(GATE[0]-home[0],GATE[2]-home[2])};
  if(f>=COW_ROUTE_START&&f<RETURN_START)pose=travel(f,COW_ROUTE_START,COW_ROUTE_END,[home,...ROUTE]);
  if(f>=RETURN_START&&f<RETURN_END)pose=travel(f,RETURN_START,RETURN_END,[...ROUTE].reverse().concat([home]));
 }
 return {...pose,id,visible:f>=entry,noseLift:i===2?pulse(f,E(90.6),E(91.4)):0};
}
export const gateAngle=(f:number)=>f<gap('G3').start?0:f<gap('G3').end?1.25*(1-ramp(f,gap('G3').end-17,gap('G3').end)):f<E(90.8)?0:f<RETURN_END?1.25*ramp(f,E(90.8),E(91.5)):1.25*(1-ramp(f,RETURN_END,RETURN_END+18));
export const schoolInterior=(f:number)=>shotAt(f).zone==='class';
export function gobiAt(f:number){
 const shot=shotAt(f),m=masterAt(f),t=m??0,local=f-shot.start;
 let pos:V3=shot.zone==='river'?[-12.6,0,20.4]:shot.zone==='lookout'?LOOKOUT:shot.zone==='farm'?FARM_PAD:shot.zone==='rice'?[6.5,0,-.2]:shot.zone==='ranch'?RANCH_PAD:shot.zone==='warteg'?[15.30,0,3.17]:shot.zone==='class'?CLASS_PAD:SCHOOL_PAD;
 let heading=Math.PI/4,walk=0,stride=0;
 if(shot.id==='S06'){const p=travel(f,shot.start+18,shot.end-5,[[-12.6,0,20.4],[-12.3,0,25],[-14.8,0,29],[-17.5,0,33],[-18.2,0,38]]);pos=p.position;walk=p.walk;stride=p.stride;heading=p.heading;}
 if(shot.id==='S18'){const p=travel(f,shot.start,shot.end-35,[transform([0,0,5.5],RANCH),[-13,0,-7.4],[-19,0,-10],SCHOOL_PAD]);pos=p.position;walk=p.walk;stride=p.stride;heading=p.heading;}
 if(shot.zone==='island')pos=[12,0,19];
 if(['S22a','S32d','S34a'].includes(shot.id))pos=CAMPUS_HERO_GOBI;
 const stressed=['S01','S23b','S28','S30b'].includes(shot.id),excited=['S03','S05b','S08a','S19','S22a'].includes(shot.id);
 const jump=(stressed||excited)?pulse(local,shot.id==='S01'?-5:4,25)*(shot.id==='S01'?.42:.5)+(shot.id==='S08a'?pulse(local,35,55)*.35:0):0;
 const point=['S04','S05b','S09b','S17a','S23a','S28','S30b','S33a','S33b','S34b','S35'].includes(shot.id)?ramp(local,3,12):0;
 const pose:GobiPose={x:pos[0],z:pos[2],rotY:heading,scale:1,walk,phase:stride,hop:jump,squash:pulse(local,0,7)*.25-pulse(local,7,17)*.12+ pulse(local,25,32)*.12,
  point,up:excited||stressed?.8*ramp(local,0,10):.12,headYaw:shot.id==='S05c'?.8:shot.id==='S17a'?-1:Math.sin(f*.04)*.07,
  headPitch:shot.id==='S16b'?.35:0,sit:shot.id==='S16b'||shot.id==='S33a'?.8:0,
  happy:excited||shot.id==='S16a'?.7:.2,surprise:stressed?1:0,confuse:['S05c','S23a','S25'].includes(shot.id)?.85:0,
  armFwd:shot.id==='S16a'||shot.id==='S13a'?1:0,lean:shot.id==='S16a'?.25:shot.id==='S13a'?-.14:0,
  wave:['S34b','S35'].includes(shot.id)?.85:0,blink:f%133<4?1:0,tilt:shot.id==='S25'?.3:0};
 if(shot.id==='S16a'&&f<E(58.1)){pose.up=1;pose.armFwd=0;pose.lean=-.12;pose.headPitch=-.12;}
 if(shot.id==='S31'){pose.up=.45*(1-ramp(local,0,50));pose.lean=.10*(1-ramp(local,0,50));pose.happy=.3;}
 return {pose,pupil:1,top:2.2+jump,position:pos,t,shot};
}
export function residentAt(id:string,f:number){
 const s=shotAt(f),q=f-s.start,idx=CAST.findIndex(r=>r.id===id);
 let position:V3=id==='warga-7'?transform([3.2,0,4.4],{position:[10,0,-12],rotation:Math.PI/4}):id==='warga-8'?[7.3,0,-4.1]:id==='warga-9'?transform([-2.4,0,4.9],RANCH):id==='warga-3'?[11.4,0,3.8]:id==='warga-10'?[-19.4,0,25]:id==='warga-11'?[-22.8,0,-18.1]:id==='warga-12'?[5.8,0,-.8]:id==='warga-6'?[-16.5,0,-17]:[-1+idx*.8,0,5.7];
 let walk=0,stride=0,heading=Math.PI/4;
 const move=(a:number,b:number,route:readonly V3[])=>{const p=travel(f,a,b,route);position=p.position;walk=p.walk;stride=p.stride;heading=p.heading;};
 if(id==='warga-10'&&s.zone==='lookout')move(E(26.4),E(27.6),[[-21.7,0,23.1],[-19.4,0,25]]);
 if(id==='warga-12'&&s.zone==='lookout')move(E(30.44),E(33),[[-12.5,0,19.2],[-14.8,0,24.6]]);
 if(['warga-1','warga-2','warga-4','warga-5'].includes(id)&&s.zone==='lookout')move(E(23.55),E(26.3),[[LOOKOUT[0]+5+idx*.3,0,LOOKOUT[2]-4],[LOOKOUT[0]+(idx%2?-2:2),0,LOOKOUT[2]-2.4-idx*.35]]);
 if(id==='warga-8'&&['rice','farm'].includes(s.zone)){
  const a:V3=s.zone==='rice'?[6.3,0,-4.4]:transform([-5.5,0,4.7],{position:[10,0,-12],rotation:Math.PI/4});
  move(s.start,s.end-12,[a,[a[0]+.7,0,a[2]+.9]]);
 }
 if(id==='warga-12'&&['rice','farm'].includes(s.zone)){position=s.zone==='rice'?[7,0,-2.3]:[FARM_PAD[0]+1.5,0,FARM_PAD[2]-1.1];}
 if(id==='warga-11'&&f>=E(77.8)&&f<E(81.7))move(E(77.8),E(79.8),[[-25.8,0,-15.7],[-22.8,0,-18.1]]);
 if(id==='warga-11'&&s.zone==='class')position=[-22.9,0,-21.8];
 if(['warga-4','warga-5'].includes(id)&&f>=E(73.54)){
  const n=id==='warga-4'?0:1;move(E(73.54),gap('G4').start+35,n?[[-17,0,-12],[-26,0,-13.5],[-25.5,0,-20.6]]:[[-15,0,-12],[-14.8,0,-20.6]]);
 }
 if(['warga-6','warga-12'].includes(id)&&f>=E(88.5)){
  const n=id==='warga-6'?0:1;move(E(88.5),E(90.5),[[-18+n*2,0,-16],[-20,0,-18.2],[-22.9+n*5.6,0,-20.8]]);
  if(f>=gap('G5').start)position=[-23.2+n*6.3,0,-22.1];
  if(f>=gap('G5').start)heading=n?-.55:.55;
 }
 if(id==='warga-9'){
  if(s.id==='S18')position=transform([3.8,0,4.8],RANCH);
  if(f>=E(98.43)&&f<RETURN_START)move(E(98.43),RETURN_START,[...ROUTE.slice(0,-1),[-21.2,0,-20.9]]);
  else if(f>=RETURN_START&&f<RETURN_END)move(RETURN_START,RETURN_END,[[-21.2,0,-20.9],...ROUTE.slice(0,-1).reverse()]);
  else if(f>=RETURN_END){position=transform([1.9,0,4.5],RANCH);heading=RANCH.rotation+Math.PI;}
 }
 if(id==='warga-3'){position=[13.0454,0,5.4272];heading=3*Math.PI/4;}
 if(s.id==='S35'&&['warga-1','warga-2','warga-10'].includes(id)){
  const n=['warga-1','warga-2','warga-10'].indexOf(id);position=[-21.6+n*1.6,0,-18.4-(n===1?1.2:0)];heading=0;
 }
 const visible=f>=(FIRST_APPEARANCE[id]??0);
 return {position,heading,walk,stride,visible,scale:1,wave:s.id==='S35'||s.id==='S09a'?.6:0,pay:id==='warga-11'?.45:0,
  watch:Math.sin(f*.035+idx)*.4,lean:id==='warga-8'&&['S02a','S11','S12a'].includes(s.id)?.28:0,clap:s.id==='S08a'?.8:0,carry:['warga-4','warga-5'].includes(id)&&s.id==='S19'?1:0};
}
