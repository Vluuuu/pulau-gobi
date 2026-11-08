import {L, CHANNEL, SCHOOL_GATE, COW_HOME} from '../../episode005/layout.ts';
import {SCHOOL_ENTRY_ROUTE, toWorld, LEVELS} from '../postEp005/schoolLayout.ts';
export type V3 = readonly [number,number,number];
export {COW_HOME};
// The campus has its own forecourt. The upstream reach starts SOUTH of the
// school, beyond a broad grass/tree buffer; downstream and the EP005 lip stay.
export const RIVER_LINE:readonly (readonly [number,number])[] = [[-30,4],[-24,9],[-18,13],[-15,20],...CHANNEL.slice(1)];
export const RIVER_WIDTH = 5.4;
export const SCHOOL_YARD={xMin:-34.5,xMax:-16.0,zMin:-15.8,zMax:-5.5};
// Two staggered rows in the dry school forecourt, facing the gate; no long queue.
export const ASSEMBLY:V3[] = Array.from({length:8},(_,i)=>[-23.2+(i%4)*1.1,0,-6.7-Math.floor(i/4)*1.35]);
// No bridge asset exists at baseline 3759f2e. One EP006 crossing is reconstructed
// here, never presented as evidence of a published EP005 asset. Same root/pivot
// in short and reinforced states; no second bridge or hidden overlapping deck.
export const BRIDGE = {id:'bridge-001',center:[-16.5,0,16.5] as V3,angle:Math.atan2(7,-3),oldLength:3.8,length:7.8,width:1.8,deckY:.27,provenance:'EP006 reconstruction; baseline has no bridge model'};
export const bridgePoint = (along:number, y=BRIDGE.deckY, lateral=0):V3 => [BRIDGE.center[0]+Math.sin(BRIDGE.angle)*along+Math.cos(BRIDGE.angle)*lateral,y,BRIDGE.center[2]+Math.cos(BRIDGE.angle)*along-Math.sin(BRIDGE.angle)*lateral];
export const WEST_BANK = bridgePoint(-BRIDGE.length/2,0);
export const EAST_BANK = bridgePoint(BRIDGE.length/2,0);
export const OBSERVATION = {center:[-10.0,.16,21.8] as V3,width:4.6,depth:5.2};
export const TEACHER_OBS:V3=[-6.9,0,20.2]; // dry east-bank teaching bay; keeps the deck aisle open
export const HEADMASTER_OBS:V3=[-11.65,.16,23.65];
export const GOBI_OBS:V3=[-8.25,.16,23.8];
export const FIELD_HUB:V3=bridgePoint(-9.2,0,0);
export const BRIDGE_PORTAL:V3=bridgePoint(-4.5,0,0);
export const RETURN_HUB:V3=[-25.5,0,-4.5]; // west fork: no reversal across the arriving file
// Legacy EP005 end poses are below the polished foyer floor; warga-2 stood
// exactly on the A01 lane. Retain these visitors in the open west forecourt.
export const SCHOOL_VISITORS:Record<string,V3>={
  'warga-1':[-33,0,-11.8],'warga-2':[-31.6,0,-10.5],'warga-10':[-29,0,-11.4],
  'warga-6':[-31,0,-12.6],'warga-12':[-29.6,0,-13.3],
};
export const FISH_TAKEOFF:V3=[-13.1,-.34,23.15];
export const FISH_LANDING:V3=[-13.0,-.34,23.65];
export const SEATS = Array.from({length:8},(_,i)=>{
  const x=(i%2?1:-1)*2.2,z=-.95+Math.floor(i/2)*.92;
  return {id:`student-chair-${i+1}`,position:toWorld([x,LEVELS.ground,z+.32]),desk:toWorld([x,LEVELS.ground+.78,z]),row:Math.floor(i/2)};
});
export function chairSideRoute(i:number):V3[]{
  const s=SEATS[i].position,x=s[0]-Math.sign(s[0]+20)*.65,z=s[2]+.14,door=toWorld(SCHOOL_ENTRY_ROUTE[SCHOOL_ENTRY_ROUTE.length-3]);
  // Retained left-hinged leaf extends into A01. Clear its tip before using
  // the narrow lane beside the rear west desks; turn to the board at the chair.
  return i%2===0&&i>=4?[door,[-20,.4,-21.12],[-21.13,.4,-21.12],[-21.13,.4,z],[x,.4,z]]:[door,[-20,.4,z],[x,.4,z]];
}
export function entryRoute(i:number):V3[] {
  // Formation joins the gate in short pairs, then the real doors and aisle.
  // Approach each chair from its side; do not pass through its backrest.
  const seat=SEATS[i].position;
  return [ASSEMBLY[i],[ASSEMBLY[i][0],0,-9.15],[-21,0,-9.15],...SCHOOL_ENTRY_ROUTE.slice(0,-2).map(toWorld),
    ...chairSideRoute(i).slice(1),seat];
}
// West-bank approach goes around the river head; both bridge ends meet dry land.
export const FIELD_PATH:readonly V3[] = [[-21,0,-10],[-27.2,0,-8],[-33.8,0,-1.8],[-34,0,5],[-29.5,0,10],[-24.5,0,14],WEST_BANK];
export const CROSSING:readonly V3[] = [WEST_BANK,bridgePoint(-3.3),bridgePoint(3.3),EAST_BANK,[-10.1,.16,19.6]];
// Two compact ranks, with a separate front/side teaching and principal bay.
export const OBS_SPOTS:V3[] = Array.from({length:8},(_,i)=>[-11.15+(i%4)*.95,.16,21.15+Math.floor(i/4)*1.30]);
export const SCHOOL_GOBI:V3=[-25,0,-7.5];
export const BRIDGE_GOBI:V3=bridgePoint(-4.25,0,3.9);
export const RIVER_GOBI:V3=[WEST_BANK[0]-1.0,0,WEST_BANK[2]-2.0];
export const CLASS_GOBI:V3=[-18.7,.4,-17.65]; // foyer; never blocks teacher/board
export const HEADMASTER_CLASS:V3=[-22.65,.4,-17.6]; // independent foyer bay, outside both door lanes
export const TEACHER_CLASS:V3=[-22.8,.4,-23.65];
export const OUTRO_GOBI:V3=SCHOOL_GOBI;
