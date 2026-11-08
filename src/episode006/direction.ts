import {residentAt as legacyAt} from '../episode005/direction.ts';
import {OUTRO_START as OLD_OUTRO} from '../episode005/timeline.ts';
import {RANCH,transform} from '../episode005/layout.ts';
import {SEATS,entryRoute,FIELD_PATH,CROSSING,OBS_SPOTS,SCHOOL_GOBI,BRIDGE_GOBI,RIVER_GOBI,COW_HOME} from '../world/ep006/layout.ts';
import type {V3} from '../world/ep006/layout.ts';
import type {ResidentPose} from '../episode003/characters/ResidentActor';
import type {GobiPose} from '../Gobi';
import {E,hold,ramp,pulse,clamp} from './timeline.ts';
import {shotAt,SPLASH_FRAME} from './shots.ts';

export function follow(f:number,start:number,end:number,points:readonly V3[]){
  const lengths=points.slice(1).map((b,i)=>Math.hypot(...b.map((v,j)=>v-points[i][j]))),total=lengths.reduce((a,b)=>a+b,0),duration=Math.max(1,end-start),r=Math.min(8,duration/4);
  const integral=(v:number)=>{const t=Math.max(0,Math.min(duration,v));return t<r?t*t/(2*r*(duration-r)):t<duration-r?(t-r/2)/(duration-r):1-(duration-t)**2/(2*r*(duration-r));};
  const distance=total*integral(f-start);let rem=distance,i=0;
  while(i<lengths.length-1&&rem>lengths[i])rem-=lengths[i++];
  const a=points[i],b=points[i+1]??a,k=lengths[i]?rem/lengths[i]:0;
  const position:V3=f<=start?points[0]:f>=end?points[points.length-1]:a.map((v,j)=>v+(b[j]-v)*k) as unknown as V3;
  return {position,heading:Math.atan2(b[0]-a[0],b[2]-a[2]),walk:f>start&&f<end?1:0,stride:distance*5.5,distance};
}
export const ENTRY_START=E(20.7),ENTRY_END=hold('entry').end-75;
export const FIELD_START=E(34.44),FIELD_END=E(52.2),CROSS_START=E(62.94),CROSS_END=CROSS_START+240;
export const RETURN_START=E(86.56),RETURN_END=E(102.0);
export const waitSpot=(i:number):V3=>[-18.9-(i%2)*.65,0,14.1-Math.floor(i/2)*.83];
export const observationRoute=(i:number):V3[]=>[waitSpot(i),...CROSSING,OBS_SPOTS[i%8]];
const base=(position:V3):ResidentPose=>({position,heading:Math.PI,walk:0,wave:0,pay:0,watch:0,scale:1,visible:true});
export function studentAt(i:number,f:number,snapshot=false){
  const enter=entryRoute(i),start=ENTRY_START+i*10,end=ENTRY_END+i*10;
  let p=follow(f,start,end,enter),seat=ramp(f,end,end+12),heading=p.heading;
  if(f>=end-14)heading=p.heading+(Math.PI-p.heading)*ramp(f,end-14,end);
  const leave=FIELD_START+i*7;
  if(f>=leave){const path=[...enter.slice(1)].reverse().concat([...FIELD_PATH.slice(1),waitSpot(i)]);p=follow(f,leave+16,FIELD_END+i*7,path);seat=1-ramp(f,leave,leave+16);heading=p.heading;}
  if(f>=FIELD_END+i*7&&f<CROSS_START+i*10){p={...p,position:waitSpot(i),walk:0};heading=.9;}
  if(f>=CROSS_START+i*10){p=follow(f,CROSS_START+i*10,CROSS_START+150+i*10,observationRoute(i));heading=p.walk?p.heading:-1.6;}
  // Return is one continuous reverse crossing, shared footpath, gate, foyer,
  // A01 chair, and back out again. No sunset classroom teleport.
  const back=RETURN_START+i*8,homeRoute:V3[]=[OBS_SPOTS[i],...CROSSING.slice().reverse(),waitSpot(i),...FIELD_PATH.slice().reverse(),...enter.slice(2),...enter.slice(2).reverse(),[-21.5,0,-8.8+i*.5]];
  if(f>=back){p=follow(f,back,RETURN_END+i*8,homeRoute);heading=p.heading;seat=0;}
  if(snapshot){p={...p,position:SEATS[i].position,walk:0,stride:0};seat=1;heading=Math.PI;}
  const classActivity=seat>.98,phase=f*.075+i*1.7,react=pulse(f,SPLASH_FRAME+17+i*2,SPLASH_FRAME+55+i*2);
  return {...base(p.position),...p,heading,seat,scale:.84,
    activity:classActivity?['write','watch','turn','raise'][i%4]:f>=CROSS_END&&f<RETURN_START?['note','look','point','watch'][i%4]:'walk',
    headYaw:classActivity?(i%4===2?Math.sin(phase)*.32:Math.sin(phase*.3)*.07):react*.4,
    headPitch:classActivity&&i%4===0?.25:f>=CROSS_END&&f<RETURN_START?.18:0,
    wave:classActivity&&i%4===3?.65+Math.sin(phase)*.08:react*.55,
    pay:classActivity&&i%4===0?.55:f>=CROSS_END&&i%4===2?.7:0,
    lean:react*-.12,phase,react};
}
const teacherSpot:V3=[-21.3,.4,-23.85],headmasterSpot:V3=[-20.6,.4,-22.0];
export function adultAt(id:string,f:number,snapshot=false):ResidentPose&{stride:number}{
  const old=legacyAt(id,OLD_OUTRO-1),isTeacher=id==='warga-11',isHead=id==='warga-21';
  if(!isTeacher&&!isHead){
    if(id==='warga-22')return {...base(transform([-3.3,0,4.8],RANCH)),heading:RANCH.rotation,watch:Math.sin(f*.025)*.2,stride:0};
    return {...old,watch:Math.sin(f*.018+old.position[0])*.15,stride:0};
  }
  const index=isTeacher?8:9,spot=isTeacher?teacherSpot:headmasterSpot;
  let p={...base(spot),stride:0};
  if(isHead){const a=follow(f,E(23.48),hold('entry').end,[...entryRoute(0).slice(1,-3),headmasterSpot]);p={...p,...a};}
  if(f>=FIELD_START+10){const route:V3[]=[spot,[-20,.4,-20.2],...entryRoute(0).slice(1,-3).reverse(),...FIELD_PATH.slice(1),waitSpot(index)];p={...p,...follow(f,FIELD_START+10,FIELD_END+index*7,route)};}
  if(f>=CROSS_START+index*10)p={...p,...follow(f,CROSS_START+index*10,CROSS_START+150+index*10,[waitSpot(index),...CROSSING,isTeacher?[-9.6,.16,18.8]:[-10.65,.16,23.0]])};
  if(f>=RETURN_START+index*8)p={...p,...follow(f,RETURN_START+index*8,RETURN_END+index*8,[p.position,...CROSSING.slice().reverse(),...FIELD_PATH.slice().reverse(),...entryRoute(0).slice(1,-3),spot])};
  if(snapshot)p={...p,position:spot,walk:0};
  const inClass=snapshot||f<FIELD_START,react=isHead?pulse(f,SPLASH_FRAME+17,SPLASH_FRAME+55):0;
  return {...p,heading:p.walk?p.heading:inClass?(isTeacher?Math.PI:-.7):-Math.PI/2,
    pay:isTeacher?(inClass?1.05+.12*Math.sin(f*.12):.65):.2,
    wave:react*.85,headYaw:react*.6,headPitch:react*-.3,lean:react*-.2,watch:inClass?.1*Math.sin(f*.025):.15};
}
export function gobiAt(f:number){
  const s=shotAt(f),q=f-s.start;
  let position:V3=Number(s.id.slice(1))<16?SCHOOL_GOBI:Number(s.id.slice(1))<20?RIVER_GOBI:Number(s.id.slice(1))<25?BRIDGE_GOBI:Number(s.id.slice(1))<30?[-8.7,.16,20.3]:Number(s.id.slice(1))<33?transform([2.5,0,5.7],RANCH):[-19,0,-9];
  if(s.interior)position=[-19.6,.4,-20.65];
  let motion={position,heading:.2,walk:0,stride:0};
  if(f>=ENTRY_START+25&&f<FIELD_START)motion=follow(f,ENTRY_START+25,hold('entry').end+6,[SCHOOL_GOBI,...entryRoute(0).slice(1,-3),[-19.6,.4,-20.65]]);
  if(s.id==='S20')motion=follow(f,s.start,s.end,[[-20.3,0,8],BRIDGE_GOBI]);
  if(s.id==='S24')motion=follow(f,s.start+80,s.start+230,[BRIDGE_GOBI,...CROSSING,[-8.7,.16,20.3]]);
  position=motion.position;
  const worried=['S01','S15','S22','S35'].includes(s.id),happy=['S03','S06','S09','S29'].includes(s.id),point=['S03','S16','S17','S22','S23','S26','S36'].includes(s.id);
  const pose:GobiPose={x:position[0],z:position[2],rotY:motion.heading,walk:motion.walk,phase:motion.stride,scale:1,
    point:point?ramp(q,4,17):0,up:worried?.75:happy?.5:.08,wave:s.id==='S37'?.65:0,
    surprise:worried?.85:0,confuse:s.id==='S35'?.7:0,happy:happy?.7:.15,
    headYaw:Math.sin(f*.035)*.07,headPitch:s.id==='S35'?.15:0,lean:s.id==='S22'?-.12:s.id==='S29'?.12:0,
    hop:worried?pulse(q,3,23)*.15:0,blink:f%139<4?1:0,tilt:s.id==='S35'?.12:0};
  return {pose,pupil:1,position,local:position,top:2.2,s};
}
export function cowAt(i:number,f:number){
  const wrong=pulse(f,E(84.5),E(86.1)),look=i===1?wrong*1.2:i===0?wrong*-.15:0;
  // Cow 003's classroom cameo is explicitly a flashback, then all three remain home.
  return {position:COW_HOME[i],heading:RANCH.rotation,headYaw:Math.sin(f*.025+i)*.10+look,walk:0,stride:0};
}
