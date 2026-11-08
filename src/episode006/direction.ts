import {residentAt as legacyAt} from '../episode005/direction.ts';
import {OUTRO_START as OLD_OUTRO} from '../episode005/timeline.ts';
import {RANCH,transform} from '../episode005/layout.ts';
import {SEATS,ASSEMBLY,entryRoute,FIELD_PATH,CROSSING,OBS_SPOTS,SCHOOL_GOBI,BRIDGE_GOBI,RIVER_GOBI,COW_HOME,bridgePoint,CLASS_GOBI,HEADMASTER_CLASS,TEACHER_CLASS,HEADMASTER_OBS,TEACHER_OBS,OUTRO_GOBI} from '../world/ep006/layout.ts';
import type {V3} from '../world/ep006/layout.ts';
import type {ResidentPose} from '../episode003/characters/ResidentActor';
import type {GobiPose} from '../Gobi';
import {E,hold,ramp,pulse} from './timeline.ts';
import {shotAt} from './shots.ts';
import {mixAngle,angleDelta,envelope,lerp3,gestureAt} from './performance.ts';
import {splashAt} from '../world/ep006/waterModel.ts';

export function follow(f:number,start:number,end:number,points:readonly V3[]){
  const lengths=points.slice(1).map((b,i)=>Math.hypot(...b.map((v,j)=>v-points[i][j]))),total=lengths.reduce((a,b)=>a+b,0),duration=Math.max(1,end-start),r=Math.min(10,duration/4);
  const integral=(v:number)=>{const t=Math.max(0,Math.min(duration,v));return t<r?t*t/(2*r*(duration-r)):t<duration-r?(t-r/2)/(duration-r):1-(duration-t)**2/(2*r*(duration-r));};
  const distance=total*integral(f-start),speed=total*(integral(f-start)-integral(f-start-1))*30;let rem=distance,i=0;
  while(i<lengths.length-1&&rem>lengths[i])rem-=lengths[i++];const a=points[i],b=points[i+1]??a,k=lengths[i]?rem/lengths[i]:0;
  const tangent=Math.atan2(b[0]-a[0],b[2]-a[2]),prev=i?Math.atan2(a[0]-points[i-1][0],a[2]-points[i-1][2]):tangent;
  const position:V3=f<=start?points[0]:f>=end?points[points.length-1]:lerp3(a,b,k);
  return {position,heading:mixAngle(prev,tangent,ramp(rem,0,.45)),walk:Math.min(1,speed/1.1),stride:distance*Math.PI*2/1.12,distance,speed};
}
export const ENTRY_START=E(23.48),ENTRY_END=hold('entry').end-155;
export const FIELD_START=E(34.44),FIELD_END=E(52.2),CROSS_START=E(62.94),CROSS_END=CROSS_START+235;
export const RETURN_START=E(80.5),RETURN_END=E(102.0);
const delay=(i:number)=>Math.floor(i/2)*18+(i%2)*6;
export const waitSpot=(i:number):V3=>bridgePoint(-5.3-Math.floor((i%8)/4)*1.2,0,((i%4)-1.5)*.86);
const laneRoute=(points:readonly V3[],lane:number):V3[]=>points.map((p,i)=>{const a=points[Math.max(0,i-1)],b=points[Math.min(points.length-1,i+1)],d=Math.hypot(b[0]-a[0],b[2]-a[2])||1;return [p[0]+(b[2]-a[2])/d*lane,p[1],p[2]-(b[0]-a[0])/d*lane];});
export const observationRoute=(i:number):V3[]=>[waitSpot(i),...laneRoute(CROSSING,(i%2?1:-1)*.30),OBS_SPOTS[i%8]];
const base=(position:V3):ResidentPose=>({position,heading:Math.PI,walk:0,wave:0,pay:0,watch:0,scale:1,visible:true});
const exitRoute=(i:number):V3[]=>entryRoute(i).slice(2).reverse();
export function studentAt(i:number,f:number,snapshot=false){
  const enter=entryRoute(i),d=delay(i),start=ENTRY_START+d,end=ENTRY_END+d;
  let p=follow(f,start,end,enter),seat=ramp(f,end+3,end+18),heading=p.heading;
  if(f>=end-12)heading=mixAngle(p.heading,Math.PI,ramp(f,end-12,end+3));
  if(f<start){const intro=E(14.58)+Math.floor(i/2)*75,face=i>=4?(i<6?-.45:.45):.12;heading=mixAngle(.12,face,envelope(f,intro,8,50,14));}
  const leave=FIELD_START+Math.floor(i/2)*10+(i%2)*3;
  if(f>=leave){const path=[...exitRoute(i),...laneRoute(FIELD_PATH.slice(1),(i%2?1:-1)*.35),waitSpot(i)];p=follow(f,leave+18,FIELD_END+Math.floor(i/2)*10+(i%2)*3,path);seat=1-ramp(f,leave,leave+18);heading=p.heading;}
  const cross=CROSS_START+Math.floor(i/2)*18+(i%2)*4;
  if(f>=FIELD_END+Math.floor(i/2)*10+(i%2)*3&&f<cross){p={...p,position:waitSpot(i),walk:0,speed:0};heading=1.2;}
  if(f>=cross){p=follow(f,cross,cross+155,observationRoute(i));heading=p.speed>.1?p.heading:-1.25;}
  const back=RETURN_START+Math.floor(i/2)*12+(i%2)*4;
  if(f>=back){const route:V3[]=[OBS_SPOTS[i],...laneRoute(CROSSING.slice().reverse(),(i%2?1:-1)*.32),...laneRoute(FIELD_PATH.slice().reverse(),(i%2?1:-1)*.35),ASSEMBLY[i]];p=follow(f,back,RETURN_END+Math.floor(i/2)*12+(i%2)*4,route);heading=p.heading;seat=0;}
  if(snapshot){p={...p,position:SEATS[i].position,walk:0,speed:0,distance:0,stride:0};seat=1;heading=Math.PI;}
  const cycle=Math.floor((f+i*31)/112)%3,activities=['write','watch','read','raise','turn','write','read','watch'];
  const activity=seat>.98?(cycle===1&&i%3===0&&activities[i]!=='raise'?'watch':activities[i]):f>=CROSS_END&&f<back?['note','look','point','watch'][i%4]:p.speed>.1?'walk':'wait';
  const action=activities[i]==='raise'?envelope(f,E(29.31)+42,10,26,18):envelope((f+i*23)%169,12,11,36,24),react=splashAt(f-(i%4)*3).shock;
  return {...base(p.position),...p,heading,seat,scale:.84,activity,action,phase:f*.075+i*1.7,react,
    headYaw:activity==='turn'?action*.48:activity==='look'?-.25:react*.22,headPitch:['write','read','note'].includes(activity)?.23:activity==='look'?.26:-react*.18,
    wave:activity==='raise'?action:.3*react,pay:activity==='write'?.55:activity==='point'?.7:0,lean:activity==='write'?.075:-react*.14,watch:0,happy:activity==='watch'?.2:react*.55};
}
export function boardPenAt(f:number):V3{const t=Math.PI+ramp(f,E(29.6),E(31.6))*Math.PI*2;return [-20.1+Math.cos(t)*.8,2.18+Math.sin(t)*.36,-24.475];}
function teacherPosition(f:number):V3{const pen=boardPenAt(f),u=ramp(f,E(27.3),E(29.3))*(1-ramp(f,E(31.65),E(32.55)));return lerp3(TEACHER_CLASS,[pen[0]+.45,.4,-24.16],u);}
export function adultAt(id:string,f:number,snapshot=false){
  const old=legacyAt(id,OLD_OUTRO-1),teacher=id==='warga-11',principal=id==='warga-21';
  let p={...base(TEACHER_CLASS),stride:0,distance:0,speed:0};
  if(!teacher&&!principal){
    if(id==='warga-22')return {...p,...base(transform([-3.3,0,4.8],RANCH)),heading:RANCH.rotation,kind:'formal',react:0,wipe:0,writing:false,handTarget:undefined as V3|undefined};
    const visitor:V3|undefined=id==='warga-6'?[-31.0,0,-12.6]:id==='warga-12'?[-29.6,0,-13.3]:undefined;
    return {...p,...old,position:visitor??old.position,walk:0,watch:Math.sin(f*.018+old.position[0])*.10,kind:'idle',react:0,wipe:0,writing:false,handTarget:undefined as V3|undefined,travelHeading:0};
  }
  const spot=teacher?TEACHER_CLASS:HEADMASTER_CLASS,index=teacher?8:9;p={...p,position:spot};
  if(principal){const route=entryRoute(0).slice(2,-3).filter(p=>p[2]>=-18).map((p):V3=>[p[0]-(p[2]<-15?.55:0),p[1],p[2]]);p={...p,...follow(f,E(23.48),hold('entry').end,[[-24.3,0,-8.8],...route,spot])};}
  const writing=teacher&&!snapshot&&f>=E(29.35)&&f<E(31.75);
  if(teacher&&!snapshot&&f<FIELD_START){
    p.position=teacherPosition(f);const prev=teacherPosition(f-1),speed=Math.hypot(...p.position.map((n,i)=>n-prev[i]))*30,t=ramp(f,E(29.6),E(31.6));
    p.speed=speed;p.walk=Math.min(1,speed);p.distance=2.4*ramp(f,E(27.3),E(29.3))+(t<.5?(boardPenAt(f)[0]+20.9):1.6+(-19.3-boardPenAt(f)[0]))+2.4*ramp(f,E(31.65),E(32.55));p.heading=Math.atan2(p.position[0]-prev[0],p.position[2]-prev[2]);
  }
  if(f>=FIELD_START+10)p={...p,...follow(f,FIELD_START+10,FIELD_END+index*4,[spot,...exitRoute(0).slice(1),...FIELD_PATH.slice(1),waitSpot(index)])};
  const destination=teacher?TEACHER_OBS:HEADMASTER_OBS;
  if(f>=CROSS_START+index*8)p={...p,...follow(f,CROSS_START+index*8,CROSS_START+155+index*8,[waitSpot(index),...CROSSING,destination])};
  if(f>=RETURN_START+index*4)p={...p,...follow(f,RETURN_START+index*4,RETURN_END+index*4,[destination,...CROSSING.slice().reverse(),...FIELD_PATH.slice().reverse(),spot])};
  if(snapshot)p={...p,position:spot,walk:0,speed:0};
  const inClass=snapshot||f<FIELD_START,splash=splashAt(f),react=principal?splash.shock:0,wipe=principal?splash.wipe:0;
  const facing=writing?Math.PI:inClass?(teacher?.70:Math.PI):teacher?-.08:2.15-splash.wipe*.45;
  return {...p,travelHeading:p.heading,heading:writing?Math.PI:p.speed>.1?p.heading:facing,pay:0,wave:0,watch:0,headYaw:writing?.1:teacher&&inClass?.12:.08,headPitch:react*-.28+(teacher&&inClass?.04:principal?.075*envelope(f,E(72.69)+7,9,12,16):0),lean:teacher&&writing?.025:-react*.20,kind:teacher?'teach':'formal',react,wipe,writing,handTarget:writing?boardPenAt(f):undefined};
}
export function gobiAt(f:number){
  const s=shotAt(f),q=f-s.start,id=Number(s.id.slice(1));
  let position:V3=id<16?SCHOOL_GOBI:id<20?RIVER_GOBI:id<25?BRIDGE_GOBI:id<30?[-8.25,.16,23.7]:id<33?transform([2.5,0,5.7],RANCH):OUTRO_GOBI;
  if(s.interior)position=CLASS_GOBI;let motion={position,heading:.12,walk:0,stride:0,distance:0,speed:0};
  if(f>=ENTRY_START+18&&f<FIELD_START)motion=follow(f,ENTRY_START+18,hold('entry').end+6,[SCHOOL_GOBI,...entryRoute(0).slice(2,-3),CLASS_GOBI]);
  if(s.id==='S20')motion=follow(f,s.start,s.end,[FIELD_PATH[FIELD_PATH.length-2],BRIDGE_GOBI]);
  if(s.id==='S24')motion=follow(f,s.start+88,s.start+235,[BRIDGE_GOBI,...CROSSING,[-8.25,.16,23.7]]);position=motion.position;
  const kind=['S01','S22'].includes(s.id)?'surprise':s.id==='S35'?'think':s.id==='S29'?'laugh':s.id==='S03'?'present':s.id==='S04'?'measure':s.id==='S15'?'think':['S17','S23','S26'].includes(s.id)?'point':s.id==='S38'?'invite':s.id==='S37'?'wave':'welcome';
  const act=gestureAt(kind,f,s.start),pre=envelope(q,0,4,1,6),hit=act.shock;
  if(s.id==='S38'){const previous=gestureAt('wave',s.start,s.start-18),blend=ramp(q,0,18);act.left=lerp3(previous.left,act.left,blend);act.right=lerp3(previous.right,act.right,blend);}
  const target:V3|undefined=s.id==='S03'?[-20,2,-22]:s.id==='S17'?[-16.5,.2,16.5]:['S22','S23'].includes(s.id)?[-16.5,.5,16.5]:s.id==='S26'?[-13,-.1,23]:undefined;
  const yaw=motion.speed>.1?motion.heading:s.interior?2.25:id>=25&&id<=29?-1.45:.14;
  const look=target?Math.max(-.55,Math.min(.55,angleDelta(yaw,Math.atan2(target[0]-position[0],target[2]-position[2]))))*.7:0;
  const pose:GobiPose={x:position[0],z:position[2],rotY:yaw,walk:motion.walk,phase:motion.stride,scale:1,point:act.point?1:0,up:0,wave:0,surprise:hit*.95,confuse:kind==='think'?.7:0,happy:kind==='laugh'?.85:kind==='welcome'||kind==='invite'?.45:.1,headYaw:look+act.breath*2,headPitch:kind==='think'?.12:pre*.09-hit*.13,lean:pre*.08-hit*.13,hop:pulse(q,7,23)*hit*.09,blink:((f+17)%151)<4?1:0,tilt:kind==='think'?.10:0,squash:pre*.055-hit*.035,roll:act.bodyRoll};
  return {pose,pupil:1,position,local:position,top:2.2,s,kind,act,target,motion};
}
export function cowAt(i:number,f:number){const wrong=pulse(f,E(84.5),E(86.1));return {position:COW_HOME[i],heading:RANCH.rotation,headYaw:Math.sin(f*.025+i)*.10+(i===1?wrong*1.2:i===0?wrong*-.15:0),walk:0,stride:0};}
