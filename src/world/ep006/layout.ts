import {L, CHANNEL, SCHOOL_GATE, COW_HOME} from '../../episode005/layout.ts';
import {SCHOOL_ENTRY_ROUTE, toWorld, LEVELS} from '../postEp005/schoolLayout.ts';
export type V3 = readonly [number,number,number];
export {COW_HOME};
export const RIVER_LINE = [...L.river.centerline, ...CHANNEL.slice(1)];
export const RIVER_WIDTH = 5.4;
// No bridge asset exists at baseline 3759f2e. One EP006 crossing is reconstructed
// here, never presented as evidence of a published EP005 asset. Same root/pivot
// in short and reinforced states; no second bridge or hidden overlapping deck.
export const BRIDGE = {id:'bridge-001',center:[-14.2,0,16] as V3,angle:Math.atan2(1,.2),oldLength:3.8,length:7.8,width:1.8,deckY:.27,provenance:'EP006 reconstruction; baseline has no bridge model'};
export const bridgePoint = (along:number, y=BRIDGE.deckY, lateral=0):V3 => [BRIDGE.center[0]+Math.sin(BRIDGE.angle)*along+Math.cos(BRIDGE.angle)*lateral,y,BRIDGE.center[2]+Math.cos(BRIDGE.angle)*along-Math.sin(BRIDGE.angle)*lateral];
export const WEST_BANK = bridgePoint(-BRIDGE.length/2,0);
export const EAST_BANK = bridgePoint(BRIDGE.length/2,0);
export const OBSERVATION = {center:[-9.6,.16,21] as V3,width:3.1,depth:4.9};
export const SEATS = Array.from({length:8},(_,i)=>{
  const x=(i%2?1:-1)*2.2,z=-.95+Math.floor(i/2)*.92;
  return {id:`student-chair-${i+1}`,position:toWorld([x,LEVELS.ground,z+.32]),desk:toWorld([x,LEVELS.ground+.78,z]),row:Math.floor(i/2)};
});
export function entryRoute(i:number):V3[] {
  // Single file through the actual gate, main door and A01 portal. Turn from the
  // central aisle behind the assigned chair, then back in before sitting.
  const seat=SEATS[i].position;
  return [[SCHOOL_GATE[0]-.4,0,SCHOOL_GATE[2]+1.2+i*.55],...SCHOOL_ENTRY_ROUTE.slice(0,-1).map(toWorld),
    [-20,LEVELS.ground,seat[2]], [seat[0]-Math.sign(seat[0]+20)*.65,LEVELS.ground,seat[2]],seat];
}
export const FIELD_PATH:readonly V3[] = [[-21,0,-10],[-25.8,0,-9.8],[-27,0,-4],[-23,0,3],[-20,0,8],WEST_BANK];
export const CROSSING:readonly V3[] = [WEST_BANK,bridgePoint(-3.3),bridgePoint(3.3),EAST_BANK,[-9.6,.16,18.7]];
export const OBS_SPOTS:V3[] = Array.from({length:8},(_,i)=>[-10.35+(i%2)*1.25,.16,19.4+Math.floor(i/2)*.86]);
export const SCHOOL_GOBI:V3=[-19,0,-11.8];
export const BRIDGE_GOBI:V3=[WEST_BANK[0]-.9,0,WEST_BANK[2]+1.5];
export const RIVER_GOBI:V3=[-18.6,0,15.5];
