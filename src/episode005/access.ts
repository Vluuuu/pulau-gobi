import {SCHOOL_ACCESS,ROUTE,CLASS_PAD,SCHOOL_GATE,FLOOR_Y,RANCH_PAD,travel} from './layout.ts';
import type {V3} from './layout.ts';
import {editFrame as E,gap,ramp} from './timeline.ts';
export const CLASS_WAIT:V3=[-20,FLOOR_Y,-22.5];
export const DAMIA_SPOT:V3=[-22.8,FLOOR_Y,-20.5];
export const RETURN_START=gap('G6').start+42;
export const RETURN_END=E(104.4);
export const COW_ROUTE_START=E(91.5);
export const COW_ROUTE_END=gap('G5').end-15;
export const campusPath=(lane:number,finish:V3):readonly V3[]=>[
 ...SCHOOL_ACCESS.slice(0,-1).map(p=>[p[0]+lane,p[1],p[2]] as V3),
 [-20+lane,FLOOR_Y,-20.45],[finish[0],FLOOR_Y,-20.45],finish,
];
export const GOBI_ENTRY=campusPath(.65,CLASS_WAIT);
export const DAMIA_ENTRY=campusPath(-.65,DAMIA_SPOT);
export const VISITOR_ENTRY=(n:number):readonly V3[]=>[n?[-19,0,-8.8]:[-24.5,0,-9.1],...campusPath(n?.72:-.72,[n?-16.4:-23.45,FLOOR_Y,n?-23.2:-19.8])];
export const GOBI_RETURN:readonly V3[]=[CLASS_PAD,[-19.3,FLOOR_Y,-19.65],
 ...SCHOOL_ACCESS.slice(0,-1).reverse(),
 ...ROUTE.slice(1,4).reverse().map(p=>[p[0]+.65,p[1],p[2]] as V3),RANCH_PAD];
export function gobiSchoolMotion(f:number){
 if(f<gap('G4').end)return travel(f,gap('G4').end-24,gap('G4').end,[[-20,0,-13.6],GOBI_ENTRY[0]]);
 if(f<E(81.7))return travel(f,E(77.4),E(81.7),GOBI_ENTRY);
 if(f<E(90.6))return travel(f,0,1,[CLASS_WAIT,CLASS_WAIT]);
 if(f<RETURN_START)return travel(f,E(90.6),E(91.5),[CLASS_WAIT,CLASS_PAD]);
 return travel(f,RETURN_START+27,RETURN_END+27,GOBI_RETURN);
}
// Named portal chain is shared by people, cow, doors, camera inserts and numeric QA.
export const PORTALS=[
 {id:'school-gate',point:SCHOOL_GATE,width:3.2,height:3.4},
 {id:'main-entry',point:SCHOOL_ACCESS[3],width:3.2,height:3.0},
 {id:'foyer',point:SCHOOL_ACCESS[4],width:3.2,height:3.0},
 {id:'class-A01',point:SCHOOL_ACCESS[5],width:2.78,height:2.8},
] as const;
export const schoolGateOpenAt=(f:number)=>ramp(f,gap('G4').start+27,gap('G4').start+42);
export const mainDoorOpenAt=(f:number)=>ramp(f,E(78.1),E(78.5));
export const classDoorOpenAt=(f:number,cow:V3)=>Math.max(ramp(f,E(79.3),E(79.7)),f>=E(91.5)?1-ramp(Math.hypot(cow[0]-PORTALS[3].point[0],cow[2]-PORTALS[3].point[2]),3.1,4.2):0);
