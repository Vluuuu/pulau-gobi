import {EP003_WORLD_LAYOUT as L} from '../world/layout.ts';
import {wartegLocalToWorld,WARTEG} from '../world/warteg/wartegModel.ts';
import {gobiPositionAt,gobiHeadingAt,WARTEG_WORLD_ANCHORS} from '../direction/acting.ts';
import {mix3,range,smooth,lerp} from '../direction/math.ts';
import type {V3} from '../direction/math.ts';
import {createRiverModel,riverFill,samplePath} from '../world/river/riverMath.ts';
import {buildProgress} from '../direction/timeline.ts';
const riverModel=createRiverModel(L.river)!;
export type CameraPreset='GobiFrontCloseup'|'GobiReaction'|'OverShoulder'|'ObjectDetail'|'ConstructionReveal'|'IslandWide'|'WartegTwoShot'|'PocketDetail'|'RiverTracking';
export type CameraPose={position:V3;target:V3;zoom:number;preset:CameraPreset;shot:string};
type Shot={start:number;end:number;preset:CameraPreset;subject?:'house'|'river'|'river-residents'|'warteg'|'vendor'|'field'|'group';card?:boolean;transition?:number;arcHeight?:number};
export const EP003_SHOTS:readonly Shot[]=[
  {start:0,end:4.45,preset:'GobiReaction'},{start:4.45,end:7.44,preset:'ConstructionReveal',subject:'house'},
  {start:7.44,end:11.2,preset:'OverShoulder',card:true},{start:11.2,end:19.26,preset:'GobiFrontCloseup',card:true},
  {start:19.26,end:20.5,preset:'GobiReaction'},{start:20.5,end:21.82,preset:'ConstructionReveal'},
  {start:21.82,end:23.35,preset:'GobiReaction',transition:24},{start:23.35,end:24.86,preset:'IslandWide',transition:32},
  {start:24.86,end:30.2,preset:'RiverTracking',transition:25},{start:30.2,end:31.2,preset:'ObjectDetail',subject:'river-residents'},
  {start:31.2,end:32.36,preset:'ConstructionReveal',subject:'river'},
  {start:32.36,end:40.5,preset:'ObjectDetail',subject:'house'},{start:40.5,end:43.28,preset:'ConstructionReveal',subject:'house'},
  {start:43.28,end:50.0,preset:'GobiFrontCloseup',card:true},{start:50,end:53,preset:'GobiReaction'},
  {start:53,end:55.8,preset:'ObjectDetail',subject:'warteg'},{start:55.8,end:56.9,preset:'ObjectDetail',subject:'warteg'},
  {start:56.9,end:58.9,preset:'ConstructionReveal',subject:'warteg'},
  {start:58.9,end:61.6,preset:'ObjectDetail',subject:'vendor'},{start:61.6,end:65.5,preset:'WartegTwoShot'},
  {start:65.5,end:68.3,preset:'GobiFrontCloseup'},{start:68.3,end:70.7,preset:'WartegTwoShot'},
  {start:70.7,end:71.5,preset:'GobiReaction',transition:12},{start:71.5,end:72.62,preset:'PocketDetail',transition:10},
  {start:72.62,end:76.36,preset:'GobiReaction',transition:10},{start:76.36,end:78.8,preset:'ObjectDetail',subject:'warteg'},
  {start:78.8,end:81.16,preset:'ObjectDetail',subject:'field'},{start:81.16,end:87.64,preset:'GobiFrontCloseup',card:true,arcHeight:8},
  {start:87.64,end:91.2,preset:'ConstructionReveal',subject:'group'},{start:91.2,end:93.7,preset:'IslandWide',transition:35},
  {start:93.7,end:100,preset:'GobiFrontCloseup'},
];
const transformOffset=(offset:V3,rotation:number):V3=>[offset[0]*Math.cos(rotation)+offset[2]*Math.sin(rotation),offset[1],-offset[0]*Math.sin(rotation)+offset[2]*Math.cos(rotation)];
const pose=(target:V3,offset:V3,zoom:number,preset:CameraPreset,shot:string):CameraPose=>({target,position:[target[0]+offset[0],target[1]+offset[1],target[2]+offset[2]],zoom,preset,shot});
function shotPose(shot:Shot,frame:number):CameraPose{
  const t=frame/30,g=gobiPositionAt(frame),heading=gobiHeadingAt(frame),id=`${shot.start}-${shot.preset}`;
  if(shot.preset==='IslandWide')return pose([0,-4,0],[58,24,58],14.4,shot.preset,id);
  if(shot.preset==='WartegTwoShot'){
    const a=WARTEG_WORLD_ANCHORS.vendor,b=WARTEG_WORLD_ANCHORS.customer;
    return pose([(a[0]+b[0])/2,1.35,(a[2]+b[2])/2],transformOffset([9,1.1,5],L.warteg.rotationY),225,shot.preset,id);
  }
  if(shot.preset==='RiverTracking'){
    const fill=riverFill(riverModel,buildProgress(frame,'river'));
    const front=samplePath(riverModel,Math.max(0,fill.waterEnd-1.5));
    return pose([front.x,0.05,front.z],[7,10,9],150,shot.preset,id);
  }
  if(shot.subject==='river')return pose([-16,0,7],[15,26,30],55,shot.preset,id);
  if(shot.subject==='river-residents')return pose([-13.8,1.1,8.6],[9,5,14],150,shot.preset,id);
  if(shot.subject==='house'){
    const lift=smooth(range(t,35.2,36.9)),land=smooth(range(t,39.7,40.8));
    const y=t<30?3.1:3.2+3.0*lift-1.1*land;
    return pose([L.house.position[0],y,L.house.position[2]],[12,8,12],shot.preset==='ObjectDetail'?100:77,shot.preset,id);
  }
  if(shot.subject==='warteg'){
    const roof=shot.preset==='ConstructionReveal';
    const target=roof?wartegLocalToWorld([0,1.9,0.2],L.warteg):wartegLocalToWorld([-0.55,t<55.8?1.0:1.43,0.98],L.warteg);
    const offset=transformOffset(roof?[7,4.6,12]:[3,1.9,8],L.warteg.rotationY);
    return pose(target,offset,roof?94:t<55.8?175:230,shot.preset,id);
  }
  if(shot.subject==='vendor')return pose([WARTEG_WORLD_ANCHORS.vendor[0],1.65,WARTEG_WORLD_ANCHORS.vendor[2]],transformOffset([3.5,0.8,10],L.warteg.rotationY),440,shot.preset,id);
  if(shot.subject==='field')return pose([L.riceField.position[0],0.6,L.riceField.position[2]],[7,6,8],125,shot.preset,id);
  if(shot.subject==='group')return pose([0,1.5,2.7],[7,5,12],145,shot.preset,id);
  if(shot.preset==='ConstructionReveal')return pose([0,0,0],[30,28,30],27,shot.preset,id);
  if(shot.preset==='PocketDetail')return pose([g[0],0.81,g[2]],transformOffset([0,0.1,8],L.warteg.rotationY),820,shot.preset,id);
  if(shot.preset==='OverShoulder')return pose([g[0],1.75,g[2]],transformOffset([2,0.7,-6],heading),440,shot.preset,id);
  const audienceHeading=t>=65.5&&t<76.36?L.warteg.rotationY:heading;
  return pose([g[0],shot.card?1.9:1.45,g[2]],transformOffset([shot.preset==='GobiReaction'?0.6:0,0.35,10],audienceHeading),shot.card?430:560,shot.preset,id);
}
/** Sample-only camera rig. Targets/zoom interpolate; no wall-clock or accumulated camera state. */
export function cameraAt(inputFrame:number):CameraPose{
  const frame=Number.isFinite(inputFrame)?Math.max(0,Math.min(2999,inputFrame)):0,t=frame/30;
  let i=EP003_SHOTS.findIndex(s=>t>=s.start&&t<s.end);if(i<0)i=EP003_SHOTS.length-1;
  const result=sampleShot(i,frame),offset=result.position.map((v,j)=>v-result.target[j]);
  // Orthographic framing is unchanged by dollying along the view direction.
  // Keep the near plane behind the foreground ground, even at counter height.
  const dolly=Math.max(1,40/Math.hypot(...offset));
  const position:V3=[result.target[0]+offset[0]*dolly,result.target[1]+offset[1]*dolly,result.target[2]+offset[2]*dolly];
  return {...result,position};
}
function sampleShot(i:number,frame:number):CameraPose{
  const current=EP003_SHOTS[i],goal=shotPose(current,frame);
  if(i===0)return goal;
  const transition=current.transition??Math.min(30,(current.end-current.start)*30*0.45);
  const u=smooth(range(frame,current.start*30,current.start*30+transition));
  if(u>=1)return goal;
  const previous=sampleShot(i-1,current.start*30-0.001);
  // Orbit around the blended subject. A straight lens interpolation can cross
  // through the subject when a reverse angle follows a frontal shot.
  const a=previous.position.map((v,j)=>v-previous.target[j]);
  const b=goal.position.map((v,j)=>v-goal.target[j]);
  const radius=lerp(Math.hypot(...a),Math.hypot(...b),u);
  const base=shotPose(current,current.start*30),baseOffset=base.position.map((v,j)=>v-base.target[j]);
  const wrap=(v:number)=>Math.atan2(Math.sin(v),Math.cos(v));
  const baseAngle=Math.atan2(baseOffset[0],baseOffset[2]);
  // Choose the orbit direction once at the cut. Re-selecting the shortest arc
  // every frame would flip it when Gobi turns through the opposite angle.
  const turn=wrap(baseAngle-Math.atan2(a[0],a[2]))+wrap(Math.atan2(b[0],b[2])-baseAngle);
  const azimuth=Math.atan2(a[0],a[2])+turn*u;
  const elevation=lerp(Math.atan2(a[1],Math.hypot(a[0],a[2])),Math.atan2(b[1],Math.hypot(b[0],b[2])),u);
  const target=mix3(previous.target,goal.target,u),horizontal=radius*Math.cos(elevation);
  return {position:[target[0]+horizontal*Math.sin(azimuth),target[1]+radius*Math.sin(elevation)+(current.arcHeight??0)*Math.sin(Math.PI*u),target[2]+horizontal*Math.cos(azimuth)],target,zoom:Math.exp(lerp(Math.log(previous.zoom),Math.log(goal.zoom),u)),preset:goal.preset,shot:goal.shot};
}
