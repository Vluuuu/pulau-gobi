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
export const TEACHER_OBS:V3=[-9.7,.16,19.75];
export const HEADMASTER_OBS:V3=[-11.65,.16,23.3];
export const FISH_TAKEOFF:V3=[-13.1,-.34,23.15];
export const FISH_LANDING:V3=[-13.0,-.34,23.65];
export const SEATS = Array.from({length:8},(_,i)=>{
  const x=(i%2?1:-1)*2.2,z=-.95+Math.floor(i/2)*.92;
  return {id:`student-chair-${i+1}`,position:toWorld([x,LEVELS.ground,z+.32]),desk:toWorld([x,LEVELS.ground+.78,z]),row:Math.floor(i/2)};
});
export function entryRoute(i:number):V3[] {
  // Formation joins the gate in short pairs, then the real doors and aisle.
  // Approach each chair from its side; do not pass through its backrest.
  const seat=SEATS[i].position;
  return [ASSEMBLY[i],[SCHOOL_GATE[0],0,-8.8],...SCHOOL_ENTRY_ROUTE.slice(0,-1).map(toWorld),
    [-20,LEVELS.ground,seat[2]], [seat[0]-Math.sign(seat[0]+20)*.65,LEVELS.ground,seat[2]],seat];
}
// West-bank approach goes around the river head; both bridge ends meet dry land.
export const FIELD_PATH:readonly V3[] = [[-21,0,-10],[-27.2,0,-8],[-33.8,0,-1.8],[-34,0,5],[-29.5,0,10],[-24.5,0,14],WEST_BANK];
export const CROSSING:readonly V3[] = [WEST_BANK,bridgePoint(-3.3),bridgePoint(3.3),EAST_BANK,[-10.1,.16,19.2]];
// Two compact ranks, with a separate front/side teaching and principal bay.
export const OBS_SPOTS:V3[] = Array.from({length:8},(_,i)=>[-10.9+(i%4)*.88,.16,20.65+Math.floor(i/4)*1.35]);
export const SCHOOL_GOBI:V3=[-25,0,-7.5];
export const BRIDGE_GOBI:V3=[WEST_BANK[0]-.9,0,WEST_BANK[2]+1.5];
export const RIVER_GOBI:V3=[WEST_BANK[0]-1.0,0,WEST_BANK[2]-2.0];
export const CLASS_GOBI:V3=[-18.7,.4,-17.65]; // foyer; never blocks teacher/board
export const HEADMASTER_CLASS:V3=[-20.7,.4,-18.35]; // foyer side bay, clear of door flow
export const TEACHER_CLASS:V3=[-22.8,.4,-23.65];
export const OUTRO_GOBI:V3=SCHOOL_GOBI;
