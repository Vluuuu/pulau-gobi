import type {GobiPose} from '../../Gobi';
import {EP003_ROSTER} from '../../episode003/state/roster.ts';
import {residentPoseAt} from '../../episode003/direction/acting.ts';
import {gobiAt as pilotGobi,oktaaAt as pilotOktaa} from '../pilot/plan.ts';
import {CAST_NEW,HUB,FOREST_SPOT,FIRST_TREE,FARM,FARM_FRONT,RANCH,RANCH_FRONT,KOST,transform} from './layout.ts';
import type {V3} from './layout.ts';
import {atVoice,voiceSlot,localWord,GREEN_A,GREEN_B,FIELD_TRAVEL,FARM_A,FARM_B,RANCH_A,RANCH_B,KOST_A,KOST_C,GUARD_BUBBLE,COMEDY,inComedy,ramp,pulse,span,clamp,lerp} from './timeline.ts';
import {VO} from './voice.ts';
export const CAST=[...EP003_ROSTER.map(r=>({id:r.id,name:r.displayName,cohort:r.cohortEpisode,special:r.tier==='special',visual:r.visual,isLegacy:!r.isNewInEp003})),
 ...CAST_NEW.map(r=>({id:r.id,name:r.name,cohort:4,special:true,visual:{...r,scale:1,hairStyle:r.hairStyle,accessory:1},isLegacy:false}))];
export const roleStart=(id:string)=>id==='warga-7'?atVoice(3):id==='warga-8'?atVoice(5):id==='warga-9'?atVoice(7):0;
export const rewardAt=(id:string)=>id==='warga-7'?atVoice(4):id==='warga-8'?atVoice(6):id==='warga-9'?atVoice(8):0;
export function pathAt(f:number,start:number,end:number,points:readonly V3[]){
 const lens=points.slice(1).map((p,i)=>Math.hypot(p[0]-points[i][0],p[2]-points[i][2])),total=lens.reduce((a,b)=>a+b,0),duration=end-start;
 const integral=(v:number)=>{const t=Math.max(0,Math.min(duration,v)),r=Math.min(8,duration/4);return t<r?t*t/(2*r*(duration-r)):t<duration-r?(t-r/2)/(duration-r):1-(duration-t)**2/(2*r*(duration-r));};
 const d=total*integral(f-start),speed=total*(integral(f-start)-integral(f-start-1))*30;
 let rem=d,i=0;while(i<lens.length-1&&rem>lens[i])rem-=lens[i++];const a=points[i],b=points[i+1]??a,u=lens[i]?rem/lens[i]:1;
 return {position:[lerp(a[0],b[0],u),0,lerp(a[2],b[2],u)] as V3,distance:d,speed,heading:Math.atan2(b[0]-a[0],b[2]-a[2]),walk:speed<.2?0:clamp(speed/2.3),stride:d*Math.PI*2/1.2};
}
const FIELD_ROUTE:V3[]=[FOREST_SPOT,[3,0,5.9],[8,0,5.8],[6.7,0,1.8],[6.7,0,-.2],[8.5,0,-1.7],[10.3,0,0]];
const RECOVERY:V3=transform([-1.63,0,4.84],KOST),KOST_FRONT:V3=transform([-1.4,0,5.1],KOST);
export function gobiPosition(f:number):V3{
 if(inComedy(f)){const p=pilotGobi(f-COMEDY.start).pose;return [p.x,0,p.z];}
 if(f<atVoice(3))return HUB;
 if(f<FIELD_TRAVEL.start)return FOREST_SPOT;
 if(f<atVoice(5))return pathAt(f,FIELD_TRAVEL.start,FIELD_TRAVEL.end,FIELD_ROUTE).position;
 if(f<FARM_A.start)return pathAt(f,atVoice(5)+localWord(5,'Oke'),FARM_A.start,[[10.3,0,0],FARM_FRONT]).position;
 if(f<atVoice(7))return FARM_FRONT;
 if(f<RANCH_A.start)return pathAt(f,atVoice(7),atVoice(7)+70,[[RANCH_FRONT[0]+3,0,RANCH_FRONT[2]+1],RANCH_FRONT]).position;
 if(f<atVoice(9))return RANCH_FRONT;
 if(f<KOST_A.start){const a=atVoice(9)+localWord(9,'Yaudah');return pathAt(f,a,voiceSlot(9).end,[[2.4,0,3.8],[6.5,0,5.8]]).position;}
 if(f<COMEDY.start)return KOST_FRONT;
 if(f<atVoice(15))return RECOVERY;
 if(f<atVoice(16))return FARM_FRONT;
 if(f<atVoice(17))return RANCH_FRONT;
 return [1,0,4.6];
}
export function speechAt(f:number){return VO.some(v=>{const s=atVoice(v.id);return v.words.some(w=>f>=s+w.start*30&&f<s+w.end*30);});}
export function gobiSample(f:number):ReturnType<typeof pilotGobi>{
 if(inComedy(f))return pilotGobi(f-COMEDY.start);
 const p=gobiPosition(f),prev=gobiPosition(f-1),speed=Math.hypot(p[0]-prev[0],p[2]-prev[2]),moving=speed<.5&&speed>.004;
 const decision=atVoice(2)+localWord(2,'Oke',true),farmOke=atVoice(5)+localWord(5,'Oke'),ranchWow=atVoice(7)+localWord(7,'Wah');
 const v=(id:number)=>f-atVoice(id),build=(a:number,b:number)=>span(f,a,b),hook=f<atVoice(2),green=build(atVoice(4),voiceSlot(4).end),reveal=Math.max(green,build(atVoice(6),atVoice(6)+58),build(atVoice(8),voiceSlot(8).end),build(atVoice(10),voiceSlot(10).end));
 let hop=hook?.75*pulse(v(1),3,26):0,squash=hook?.35*pulse(v(1),0,5)-.28*pulse(v(1),5,14)+.35*pulse(v(1),26,32):0;
 hop+=.62*pulse(v(4),4,28)+.68*pulse(v(6),1,24)+.6*pulse(v(10),2,26)+.3*pulse(v(18),10,27);
 hop+=.55*pulse(f,decision+2,decision+28)+.46*pulse(f,atVoice(3)+166,voiceSlot(3).end)+.32*pulse(f,farmOke+3,farmOke+25)+.28*pulse(f,ranchWow+2,ranchWow+23);
 squash+=.34*pulse(v(4),0,5)-.28*pulse(v(4),5,14)+.35*pulse(v(4),28,34)+.3*pulse(v(10),0,5)-.27*pulse(v(10),5,15)+.35*pulse(v(10),26,33);
 squash+=.28*pulse(f,decision-2,decision+3)-.23*pulse(f,decision+3,decision+13)+.30*pulse(f,decision+28,decision+34);
 const conducting=Math.max(build(GREEN_A.start,GREEN_B.end),build(FARM_A.start,FARM_B.end),build(RANCH_A.start,RANCH_B.end),build(KOST_A.start,KOST_C.end));
 hop+=conducting*.13*Math.max(0,Math.sin(f*.24));
 const recovery=f>=atVoice(14)&&f<atVoice(15),sit=recovery?1-ramp(f,atVoice(14)+28,atVoice(14)+46):0;
 const forestGesture=span(f,atVoice(3)+localWord(3,'Ya'),voiceSlot(3).end),fakePlant=span(f,atVoice(6)+localWord(6,'Eh'),voiceSlot(6).end);
 let heading=Math.PI/4+(moving?Math.atan2(p[0]-prev[0],p[2]-prev[2])-Math.PI/4:0);
 if(green&&v(4)<33)heading+=Math.PI*2*ramp(v(4),1,31);
 if(f>=decision&&f<decision+34)heading+=Math.PI*2*ramp(f,decision+2,decision+30);
 if(v(9)>100&&v(9)<localWord(9,'Yaudah'))heading=lerp(Math.PI/4,-2.15,ramp(v(9),100,120));
 if(f>=KOST_A.start&&f<atVoice(15))heading=KOST.rotation+.5;
 const pose:GobiPose={x:p[0],z:p[2],rotY:heading,scale:1,walk:moving?clamp(speed/.095):0,phase:f*.22,hop,squash,sit,
  blink:f%123<4?1:0,happy:Math.max(reveal*.8,conducting*.3,span(f,atVoice(18),voiceSlot(19).end)*.7),surprise:hook?.9:.16+reveal*.35,
  confuse:Math.max(span(f,atVoice(1)+110,atVoice(1)+150),fakePlant*.7,span(f,atVoice(9),atVoice(9)+95)*.7),
  lean:sit*-.34+fakePlant*.3*(1-ramp(v(6),92,120))-.15*reveal,headPitch:fakePlant*.18,headYaw:hook?.22*Math.sin(f*.22):Math.sin(f*.075)*.12,
  tilt:fakePlant*.18,roll:moving?Math.sin(f*.22)*.025:0,
  up:Math.max(hook?span(v(1),5,90)*.9:0,span(f,decision,voiceSlot(2).end)*.9,forestGesture,conducting*.55,reveal*.7,span(f,atVoice(7),atVoice(7)+75)*.65,span(f,atVoice(9)+100,voiceSlot(9).end)*.45,span(f,atVoice(18)+25,voiceSlot(18).end)*.4),
  point:Math.max(span(f,atVoice(1)+160,voiceSlot(1).end)*.8,span(f,atVoice(5),atVoice(5)+75)*.75,span(f,atVoice(7)+76,atVoice(7)+200)*.8,span(f,atVoice(9)+105,atVoice(9)+245)*.8,fakePlant*.4,span(f,atVoice(18)+15,atVoice(18)+80)*.8),
  armFwd:f<decision?.75:fakePlant*.55,wave:f>=atVoice(19)?.8:0};
 if(recovery){pose.surprise=.77*(1-ramp(v(14),0,40));pose.hop=.15*pulse(v(14),35,55);}
 if(f>=atVoice(19)){const jump=localWord(19,'bareng')-5;pose.hop=.55*pulse(v(19),jump,jump+27);pose.squash=.3*pulse(v(19),jump-5,jump+1)-.24*pulse(v(19),jump+1,jump+12)+.3*pulse(v(19),jump+27,jump+34);}
 return {pose,pupil:1,local:p,top:(2.18-.43*sit+hop)*(1-.5*squash)};
}
export type ResidentMotion={position:V3;heading:number;walk:number;stride:number;hop:number;wave:number;pay:number;watch:number;sit:number;lean:number;clap:number;visible:boolean;tool:'none'|'seedling'|'hoe'|'can'|'seedbag';};
const OUTRO:Record<string,V3>={'warga-1':[-2.7,0,3.5],'warga-2':[3.6,0,3.5],'warga-3':[5.2,0,4.5],'warga-4':[-4.7,0,4.4],'warga-5':[3.8,0,2.3],'warga-6':[-.6,0,3.5],'warga-7':[-2.5,0,5.5],'warga-8':[-.4,0,6],'warga-9':[3,0,5.2]};
export function residentMotion(id:string,f:number):ResidentMotion{
 const old=EP003_ROSTER.find(r=>r.id===id),base=old?residentPoseAt(id,2999).position:[0,0,0] as V3;
 const p:ResidentMotion={position:base,heading:old?residentPoseAt(id,2999).heading:Math.PI/4,walk:0,stride:0,hop:0,wave:0,pay:0,watch:0,sit:0,lean:0,clap:0,visible:f>=roleStart(id),tool:'none'};
 const route=(start:number,end:number,points:readonly V3[])=>Object.assign(p,pathAt(f,start,end,points));
 if(id==='warga-1'){
  p.position=[-2.8,0,4.9];p.watch=.5;p.wave=.35*span(f,GREEN_B.start,voiceSlot(4).end);
  if(f>=atVoice(9)&&f<KOST_A.start)route(atVoice(9),atVoice(9)+68,[[-2.8,0,4.9],[-3.4,0,3.6],[-2.6,0,2.7]]);
 }
 if(id==='warga-2'){
  if(f>=atVoice(4)&&f<atVoice(7)){
   route(atVoice(4)+35,atVoice(5)+60,[[3.8,0,1.6],[5.5,0,3],[6,0,5.8],[8,0,5.8],[6.7,0,1.8],[6.7,0,-.2],[8.5,0,-1.7],[11.8,0,-1],[FARM_FRONT[0]+2.2,0,FARM_FRONT[2]-.5]]);p.tool='can';
   if(f>=FARM_B.start){p.position=transform([5.7,0,-3.2],FARM);p.walk=0;p.lean=.12*Math.sin(f*.3);p.watch=.5;}
  }
  if(f>=atVoice(9)&&f<KOST_A.start)route(atVoice(9),atVoice(9)+100,[[3.8,0,5.7],[1.5,0,5.8],[-.6,0,4.8]]);
 }
 if(id==='warga-4'&&f>=atVoice(5)&&f<atVoice(9)){p.position=transform([5.7,0,3.5],FARM);p.wave=.5*span(f,atVoice(5)+25,atVoice(5)+70);p.watch=.7;}
 if(id==='warga-5'&&f>=atVoice(9)&&f<KOST_A.start){p.position=[-2,.4,4.3];p.sit=1;p.watch=.6;}
 if(id==='warga-6'&&f>=atVoice(9)&&f<KOST_A.start)route(atVoice(9),atVoice(9)+80,[[2.4,0,4.8],[-1,0,3.3]]);
 if(id==='warga-7'){
  p.position=[-3.4,0,7.7];p.heading=-2.83;p.tool=f<GREEN_A.start+20?'seedling':'none';
  p.sit=.6*span(f,atVoice(3)+52,GREEN_A.start+20);p.lean=.25*p.sit;p.pay=.4;
  if(f>=GREEN_A.start+20){route(GREEN_A.start+20,GREEN_B.end,[[-3.4,0,7.7],[-4.3,0,7.2]]);p.heading=-2.9;p.wave=.5*span(f,GREEN_B.start,voiceSlot(4).end);}
 }
 if(id==='warga-8'){
  p.tool='hoe';p.position=[12.5,0,-.6];p.heading=-.2;
  if(f>=FARM_A.start&&f<FARM_B.start){route(FARM_A.start,FARM_A.end,[transform([-4,0,-4.85],FARM),transform([-.2,0,-4.85],FARM)]);p.wave=.45*Math.abs(Math.sin(f*.28));}
  if(f>=FARM_B.start&&f<atVoice(6)){p.position=transform([-3.8,0,-4.8],FARM);p.heading=Math.PI/4;p.pay=.65;p.lean=.10*Math.sin(f*.3);}
  if(f>=atVoice(6)&&f<atVoice(7)){p.position=[FARM_FRONT[0]+2.2,0,FARM_FRONT[2]-.6];p.tool='seedbag';p.pay=.6*(1-ramp(f,atVoice(6)+100,voiceSlot(6).end));}
  if(f>=atVoice(7)&&f<atVoice(9)){route(RANCH_A.start,RANCH_B.end,[transform([-5.8,0,-1.1],RANCH),transform([-5.8,0,3],RANCH)]);p.watch=.6;p.tool='none';p.wave=.3*Math.abs(Math.sin(f*.2));}
 }
 if(id==='warga-9'){
  route(atVoice(7),atVoice(7)+85,[transform([5.5,0,7.2],RANCH),transform([1.2,0,5.2],RANCH)]);p.heading=Math.PI/4-.3;
  if(f>=atVoice(8)){route(atVoice(8),voiceSlot(8).end,[transform([1.2,0,5.2],RANCH),transform([3.4,0,4.8],RANCH)]);p.heading=Math.PI/4;p.wave=.7*span(f,GUARD_BUBBLE.start,GUARD_BUBBLE.start+25);}
  p.clap=.6*span(f,RANCH_B.start+25,RANCH_B.end);
 }
 if(f>=KOST_A.start&&f<COMEDY.start&&id!=='warga-3'){
  const i=CAST.findIndex(r=>r.id===id);p.position=transform([-4.5+i*1.2,0,6.9+(i%2)*1.0],KOST);p.heading=KOST.rotation+Math.PI;p.walk=0;p.tool='none';p.watch=.5;p.hop=.12*Math.max(0,Math.sin(f*.25+i));p.wave=.3;
 }
 if(f>=atVoice(10)&&f<atVoice(15)&&id!=='warga-3'){
  const sides:Record<string,number>={'warga-2':-5.1,'warga-4':-3.65,'warga-7':3.15,'warga-8':4.6,'warga-9':6.1};
  if(id==='warga-5'||id==='warga-6')p.position=transform([id==='warga-5'?-3.7:3.7,3.08,3.12],KOST);
  else if(id==='warga-1'){const o=pilotOktaa(f<COMEDY.start?0:Math.max(511,f-COMEDY.start));p.position=transform(o.position,KOST);p.heading=KOST.rotation+o.heading;p.lean=o.lean;}
  else p.position=transform([sides[id]??0,0,4.7],KOST);
  if(id!=='warga-1')p.heading=KOST.rotation;
  p.walk=0;p.tool='none';p.wave=f<COMEDY.start?.35:0;
 }
 if(f>=atVoice(15)&&f<atVoice(16)){
  if(id==='warga-8'){p.position=[FARM_FRONT[0]+2.1,0,FARM_FRONT[2]-.5];p.sit=1;p.tool='seedbag';p.pay=.6;p.lean=.12;}
  if(id==='warga-2'){p.position=[FARM_FRONT[0]+3.6,0,FARM_FRONT[2]+.2];p.tool='can';p.hop=.08*pulse(f,atVoice(15)+22,atVoice(15)+37);}
 }
 if(f>=atVoice(16)&&f<atVoice(17)&&id==='warga-9'){p.position=transform([3.4,0,4.8],RANCH);p.lean=.25;p.watch=.7;p.wave=.2;}
 if(f>=atVoice(17)){
  // Editorial wide cut gathers the cast near the hub; the visible approach is real.
  const end=OUTRO[id],offset:V3=[end[0]+(id==='warga-3'?4.8:1.1),0,end[2]+(id==='warga-3'?1.3:.4)];
  route(atVoice(17),atVoice(18)+55,[offset,end]);p.tool='none';p.heading=Math.PI/4;p.sit=0;p.lean=0;
  if(f>=atVoice(18)+55){p.walk=0;p.wave=.65;p.clap=.2;}
  const i=CAST.findIndex(r=>r.id===id),jump=localWord(19,'bareng')-5;p.hop=.3*pulse(f-atVoice(19),jump+i*2,jump+25+i*2);p.watch=0;
 }
 return p;
}
