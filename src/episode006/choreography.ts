// Authored EP006 traffic only. Fixed shared-path speeds and station times prevent
// route-length-dependent overtaking; no runtime crowd AI or collision hiding.
import {SCHOOL_ENTRY_ROUTE,toWorld} from '../world/postEp005/schoolLayout.ts';
import {ASSEMBLY,SEATS,entryRoute,chairSideRoute,FIELD_PATH,FIELD_HUB,CROSSING,BRIDGE_PORTAL,bridgePoint,BRIDGE_GOBI,RIVER_GOBI,CLASS_GOBI,SCHOOL_GOBI,TEACHER_CLASS,HEADMASTER_CLASS,TEACHER_OBS,HEADMASTER_OBS,GOBI_OBS,OBS_SPOTS,RETURN_HUB} from '../world/ep006/layout.ts';
import type {V3} from '../world/ep006/layout.ts';
import {E,ramp} from './timeline.ts';
import {lerp3,mixAngle} from './performance.ts';
export const BODY_SPACE={student:{walkRadius:.34,reactRadius:.44,height:1.65},adult:{walkRadius:.56,reactRadius:.68,height:2.16},gobi:{walkRadius:.64,reactRadius:.75,height:2.2}} as const;
export const ENTRY_ORDER=[4,5,6,7,0,1,2,3];
export const EXIT_ORDER=[6,7,4,5,2,3,0,1];
export const CROSS_ORDER=[4,7,5,6,0,3,1,2];
export const RETURN_ORDER=[0,1,2,3,4,5,6,7];
export const HOME_SPOTS=ASSEMBLY.map((_,i)=>ASSEMBLY[i<4?i+4:i-4]);
export const ENTRY_START=E(23.48),FIELD_START=E(34.44),CROSS_START=E(62.94),RETURN_START=E(80.5);
export type Track={points:readonly V3[];lengths:number[];length:number};
export const track=(points:readonly V3[]):Track=>{const lengths=points.slice(1).map((b,i)=>Math.hypot(...b.map((v,j)=>v-points[i][j])));return {points,lengths,length:lengths.reduce((a,b)=>a+b,0)};};
export function sample(t:Track,distance:number){
 let left=Math.max(0,Math.min(t.length,distance)),i=0;while(i<t.lengths.length-1&&left>t.lengths[i])left-=t.lengths[i++];
 const a=t.points[i],b=t.points[i+1]??a,u=t.lengths[i]?left/t.lengths[i]:0,heading=Math.atan2(b[0]-a[0],b[2]-a[2]);
 const prev=i?Math.atan2(a[0]-t.points[i-1][0],a[2]-t.points[i-1][2]):heading;
 return {position:distance<=0?t.points[0]:distance>=t.length?t.points[t.points.length-1]:lerp3(a,b,u),heading:mixAngle(prev,heading,ramp(left,0,.24))};
}
export type Leg={t:Track;start:number;end:number;speed:number;distanceBase:number;lane?:number};
const leg=(points:readonly V3[],start:number,speed:number,distanceBase=0):Leg=>{const t=track(points);return {t,start,end:start+t.length/speed*30,speed,distanceBase};};
const before=(points:readonly V3[],end:number,speed:number,distanceBase=0):Leg=>{const l=leg(points,0,speed,distanceBase);return {...l,start:end-l.end,end};};
export function legAt(l:Leg,f:number){const d=Math.max(0,Math.min(l.t.length,(f-l.start)*l.speed/30)),p=sample(l.t,d),speed=f>l.start&&f<l.end?l.speed:0,lane=l.lane??0;const position:V3=[p.position[0]+Math.cos(p.heading)*lane,p.position[1],p.position[2]-Math.sin(p.heading)*lane];return {...p,position,speed,walk:Math.min(1,speed/1.1),distance:l.distanceBase+d,stride:(l.distanceBase+d)*Math.PI*2/1.12};}
export function onPlan(plan:readonly Leg[],f:number){let l=plan[0];for(const n of plan){if(f<n.start)break;l=n;}return legAt(l,f);}
const gate:V3=[-21,0,-10],classDoor:V3=[-20,.4,-19.2],foyer:V3=[-20,.4,-17.7];
const trunk=SCHOOL_ENTRY_ROUTE.slice(0,-2).map(toWorld);
export const CLASS_TRUNK=trunk;
export const SCHOOL_EXIT=trunk.slice().reverse();
const toSide=chairSideRoute;
export const ENTRY=SEATS.map((seat,i)=>{
 const portal=ENTRY_START+42+ENTRY_ORDER.indexOf(i)*21,approach=entryRoute(i).slice(0,4),a=before(approach,portal,1.9),b=leg(trunk,portal,1.9,a.t.length),c=leg(toSide(i),b.end,1.9,a.t.length+b.t.length);
 const side=c.t.points[c.t.points.length-1],holdEnd=c.end+12,d=leg([side,[side[0],.4,seat.position[2]],seat.position],holdEnd,.90,c.distanceBase+c.t.length);
 return {plan:[a,b,c,d],side:c.end,step:d.start,sit:d.end,done:d.end+18};
});
export const ENTRY_END=Math.max(...ENTRY.map(s=>s.done));
export const waitSpot=(index:number):V3=>index===8?bridgePoint(-5.7,0,2.8):index===9?[-28.5,0,13]:bridgePoint(-7.2-Math.floor(EXIT_ORDER.indexOf(index)/4)*1.4,0,((EXIT_ORDER.indexOf(index)%4)-2.5));
const fieldSuffix=(slot:V3):V3[]=>{const x=slot[0]-FIELD_HUB[0],z=slot[2]-FIELD_HUB[2],l=x*Math.cos(Math.atan2(7,-3))-z*Math.sin(Math.atan2(7,-3));return [FIELD_HUB,bridgePoint(-8.4,0,l),slot];};
export const FIELD_MARCH:readonly V3[]=[...FIELD_PATH.slice(0,-1),[-25.45,0,16.9],[-25.45,0,19.5],FIELD_HUB];
export const EXIT=SEATS.map((seat,i)=>{
 const portal=FIELD_START+140+EXIT_ORDER.indexOf(i)*21,reverse=toSide(i).slice().reverse(),c=before(reverse,portal,1.9),side=before([seat.position,[reverse[0][0],.4,seat.position[2]],reverse[0]],c.start-12,.90),stand=side.start-18;
 c.distanceBase=side.t.length;
 const b=leg(SCHOOL_EXIT,portal,1.9,c.t.length+side.t.length),march=leg(FIELD_MARCH,b.end,2.8,b.distanceBase+b.t.length),last=leg(fieldSuffix(waitSpot(i)),march.end,1.8,march.distanceBase+march.t.length);
 return {plan:[side,c,b,march,last],stand,bagStart:side.end,bagEnd:c.start,done:last.end};
});
const pupilFirstGate=EXIT[EXIT_ORDER[0]].plan[2].end;
const foyerToGate=trunk.filter(p=>p[2]>=foyer[2]).reverse();
export const ADULT_FIELD={
 'warga-21':(()=>{const marchStart=pupilFirstGate-58,prefix=before([HEADMASTER_CLASS,foyer,...foyerToGate.slice(1)],marchStart,1.9),march=leg([...FIELD_PATH.slice(0,-2),waitSpot(9)],marchStart,2.8,prefix.t.length);return [prefix,march];})(),
 'warga-11':(()=>{const portal=FIELD_START+140+7*21+35,prefix=before([TEACHER_CLASS,[-20,.4,-23.8],classDoor],portal,1.9),out=leg(SCHOOL_EXIT,portal,1.9,prefix.t.length),march=leg(FIELD_MARCH,out.end,2.8,out.distanceBase+out.t.length),last=leg(fieldSuffix(waitSpot(8)),march.end,1.8,march.distanceBase+march.t.length);return [prefix,out,march,last];})(),
};
const bridgeCommon=[BRIDGE_PORTAL,...CROSSING];
const towardBridge=(slot:V3,portal:V3):V3[]=>{const dx=slot[0]+16.5,dz=slot[2]-16.5,l=dx*Math.cos(Math.atan2(7,-3))-dz*Math.sin(Math.atan2(7,-3));return [slot,bridgePoint(-6,0,l),bridgePoint(-6,0,1.8),bridgePoint(-4.5,0,1.8),portal];};
const deckRoute=(end:V3,entry=CROSSING[CROSSING.length-1],lane=0):V3[]=>{const x=lane<0?-10.4:lane>0?-9.2:entry[0];return [entry,[x,.16,20.05],[x,.16,20.25],[end[0],.16,20.25],end];};
const deepBay=(end:V3):V3[]=>{const e=CROSSING[CROSSING.length-1];return [e,[e[0],.16,22.9],[end[0],.16,22.9],end];};
const crossPlan=(slot:V3,end:V3,portal:number,suffix?:V3[],lane=0,common=bridgeCommon)=>{const b:Leg={...leg(common,portal,2.8),lane},entry=legAt(b,b.start).position,a=before(towardBridge(slot,entry),portal,2.8);b.distanceBase=a.t.length;const c=leg(suffix??deckRoute(end,legAt(b,b.end).position,lane),b.end,2.2,b.distanceBase+b.t.length);return [a,b,c];};
const firstCross=CROSS_START+18;
export const CROSS=SEATS.map((_,i)=>crossPlan(waitSpot(i),OBS_SPOTS[i],firstCross+80+CROSS_ORDER.indexOf(i)*14));
export const ADULT_CROSS={
 'warga-11':crossPlan(waitSpot(8),TEACHER_OBS,firstCross,[CROSSING[3],[-7,0,18.3],TEACHER_OBS],0,bridgeCommon.slice(0,-1)),
 'warga-21':crossPlan(waitSpot(9),HEADMASTER_OBS,firstCross+20,deepBay(HEADMASTER_OBS)),
 gobi:crossPlan(BRIDGE_GOBI,GOBI_OBS,firstCross+50,deepBay(GOBI_OBS)),
};
export const CROSS_END=Math.max(...CROSS.map(p=>p[p.length-1].end));
const reverseBridge=bridgeCommon.slice(0,-1).reverse();
const returnCommon=[...reverseBridge,FIELD_HUB,...FIELD_MARCH.slice().reverse().slice(1,-1),[-25.5,0,-4.5] as V3,RETURN_HUB];
const returnSuffix=(i:number):V3[]=>[RETURN_HUB,[HOME_SPOTS[i][0],0,-4.5],HOME_SPOTS[i]];
const returnPlan=(prefix:readonly V3[],suffix:readonly V3[],portal:number)=>{const a=before(prefix,portal,2.6),b=leg(returnCommon,portal,2.6,a.t.length),c=leg(suffix,b.end,1.8,b.distanceBase+b.t.length);return [a,b,c];};
const firstReturn=RETURN_START+45;
export const RETURN=SEATS.map((_,i)=>returnPlan([...deckRoute(OBS_SPOTS[i]).slice().reverse(),CROSSING[3]],returnSuffix(i),firstReturn+22+RETURN_ORDER.indexOf(i)*16));
const schoolReturn=[RETURN_HUB,[-25.5,0,-3.1],[-18.4,0,-3.1],[-18.4,0,-9.6],...trunk] as V3[];
const teacherHome=[...schoolReturn,[-20,.4,-23.8],TEACHER_CLASS] as V3[];
const principalHome=[...schoolReturn.filter(p=>p[2]>=foyer[2]),HEADMASTER_CLASS] as V3[];
export const ADULT_RETURN={
 'warga-11':returnPlan([TEACHER_OBS,[-7,0,18.3],CROSSING[3]],teacherHome,firstReturn),
 'warga-21':returnPlan([...deckRoute(HEADMASTER_OBS).slice().reverse(),CROSSING[3]],principalHome,firstReturn+22+7*16+28),
};
export const RETURN_END=Math.max(...RETURN.map(p=>p[p.length-1].end));
export const GOBI_SCHOOL=leg([SCHOOL_GOBI,[-24.4,0,-8.75],...trunk.filter(p=>p[2]>=foyer[2]),CLASS_GOBI],E(20.7),2.2);
export const GOBI_RIVER=leg([RIVER_GOBI,BRIDGE_GOBI],E(49.22),1.8);
