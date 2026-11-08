import React from 'react';
import {RenovatedHouseEP003,WartegEP003} from '../../episode003/world';
import {IslandDecor} from '../../episode002/IslandDecor3D';
import {Nature006} from './Nature';
import {KostProxy} from '../../episode004/pilot/KostProxy';
import {Parts} from '../../episode004/production/Parts';
import {part} from '../../episode004/production/part.ts';
import {farmParts,ranchParts} from '../../episode004/production/buildModels.ts';
import {farmCrops,riceParts} from '../../episode005/models.ts';
import {L,FARM,RANCH,ROUTE} from '../../episode005/layout.ts';
import {PostEp005School} from '../postEp005/SchoolCampus';
import type {SchoolAssetOptions} from '../postEp005/schoolLayout.ts';
import {POST_EP005_REFERENCE_FRAME} from '../postEp005/World';
import {Terrain006,River006,Waterfall006,Fish006} from './Water';
import {Bridge006,Walkway006,Observation006,WorldLabel} from './Structures';
import {Actors006} from '../../episode006/Actors';
import {E,ramp,OUTRO_START} from '../../episode006/timeline.ts';
import {shotAt,SPLASH_FRAME} from '../../episode006/shots.ts';

const F=POST_EP005_REFERENCE_FRAME;
// New assembler: existing asset implementations, transforms, foliage, crops and
// stocks are reused at the frozen baseline frame. No episode 001–005 edit.
const RetainedAssets:React.FC<{widen:number}>=({widen})=> <>
  <RenovatedHouseEP003 progress={1} frame={F} {...L.house}/><WartegEP003 progress={1} frame={F} {...L.warteg}/>
  <IslandDecor frame={F+9000} startFrame={0}/><Nature006 progress={widen}/><KostProxy progress={1} frame={F+9000} enhanced/>
  <group name="rice-plot-001" position={[...L.riceField.position]} rotation-y={L.riceField.rotationY} scale={L.riceField.scale}><Parts parts={riceParts(F)}/></group>
  <group name="farm-004" position={[...FARM.position]} rotation-y={FARM.rotation}><Parts parts={[...farmParts(1,F),...farmCrops(F)]}/></group>
  <group name="ranch-004" position={[...RANCH.position]} rotation-y={RANCH.rotation}>
    <Parts parts={[...ranchParts(1).filter(p=>p.id!=='gate'),part('gate','#6b8d70',[0,.68,3.8],[2.4,1.15,.12]),part('gate-latch','#8d7551',[1.02,.98,3.89],[.48,.065,.065]),part('feed-stock','#d6be75',[2,.79,-1.6],[2,.15,.45],'ico')]}/>
  </group>
  <Parts parts={[part('waiting-bench','#a58255',[-2,.42,4.3],[1.5,.15,.55]),part('waiting-leg-a','#765b3b',[-2.55,.21,4.3],[.12,.42,.44]),part('waiting-leg-b','#765b3b',[-1.45,.21,4.3],[.12,.42,.44])]}/>
  <group name="school-approach"><Parts parts={ROUTE.slice(1,-1).flatMap((p,i)=>{const a=ROUTE[i];return a[1]>.2||p[1]>.2?[]:[part(`school-path-${i}`,'#c6b38a',[(a[0]+p[0])/2,.012,(a[2]+p[2])/2],[1.65,.025,Math.hypot(p[0]-a[0],p[2]-a[2])],'box',[0,Math.atan2(p[0]-a[0],p[2]-a[2]),0])];})}/></group>
  <group position={[15.7,0,3.6]}><Parts parts={[part('warteg-stock-shelf','#a78253',[.45,.45,0],[1.5,.12,.65]),...Array.from({length:5},(_,i)=>part(`warteg-rice-stock-${i}`,'#ead4a3',[(i%3)*.45,.72+Math.floor(i/3)*.4,0],[.4,.42,.38],'ico'))]}/></group>
</>;
export const ChalkLesson:React.FC<{progress:number}>=({progress})=>{
  if(progress<=0)return null;
  const points=Array.from({length:41},(_,i)=>{const t=Math.PI+i/40*Math.PI*2;return [-20.1+Math.cos(t)*.8,2.18+Math.sin(t)*.36,-24.475] as const;});
  return <group name="fish-blackboard-lesson">
    <mesh position={[-20,2.22,-24.49]}><planeGeometry args={[4.52,1.46]}/><meshStandardMaterial color="#193d37" roughness={1}/></mesh>
    <WorldLabel text="IKAN • AMATI • JAGA AIR" position={[-20,2.76,-24.47]} width={4.15} height={.30}/>
    <Parts parts={points.slice(1,Math.max(2,Math.floor(points.length*progress))).map((p,i)=>{const a=points[i],dx=p[0]-a[0],dy=p[1]-a[1];return part(`fish-chalk-${i}`,'#eee8c9',[(p[0]+a[0])/2,(p[1]+a[1])/2,p[2]],[Math.hypot(dx,dy),.022,.012],'box',[0,0,Math.atan2(dy,dx)]);})}/>
    <mesh position={[-19.66,2.26,-24.46]}><sphereGeometry args={[.045,6,4]}/><meshBasicMaterial color="#eee8c9"/></mesh>
    <Parts parts={[part('fish-tail-a','#eee8c9',[-21.05,2.32,-24.46],[.42,.025,.014],'box',[0,0,.65]),part('fish-tail-b','#eee8c9',[-21.05,2.04,-24.46],[.42,.025,.014],'box',[0,0,-.65])]}/>
  </group>;
};
export const World006:React.FC<{frame?:number;school?:SchoolAssetOptions;residents?:boolean;snapshot?:boolean}>=({frame=OUTRO_START-1,school,residents=true,snapshot=true})=>{
  // Production is filmed inside full rooms. Viewer alone may request cutaway.
  const schoolOptions:SchoolAssetOptions=school??{doors:'open'};
  const widen=snapshot?1:ramp(frame,E(38.74),E(43.5)),bridge=snapshot?1:ramp(frame,E(57.8),E(62.5)),fish=snapshot?1:ramp(frame,E(43.8),E(45.6));
  return <group name="post-ep006-world">
    <Terrain006 widen={widen}/><River006 frame={snapshot?9000:frame} widen={widen}/><RetainedAssets widen={widen}/>
    <PostEp005School {...schoolOptions}/><ChalkLesson progress={snapshot?1:ramp(frame,E(29.3),E(31.6))}/>
    <group name="school-existing-ceiling-fixture-lighting"><pointLight position={[-22,3.28,-22.8]} color="#fff2d5" intensity={10} distance={12} decay={2}/><pointLight position={[-18.2,3.28,-20.7]} color="#f4f5ed" intensity={8} distance={11} decay={2}/><pointLight position={[-20,3.15,-17.6]} color="#fff1d4" intensity={5} distance={7} decay={2}/></group>
    <Parts parts={Array.from({length:8},(_,i)=>{const x=(i%2?1:-1)*2.2,z=-.95+Math.floor(i/2)*.92;return part(`chair-footrest-${i}`,'#97724d',[-20+x,.55,-22+z+.02],[.42,.055,.18]);})}/>
    <Waterfall006 frame={snapshot?9000:frame}/><Fish006 frame={snapshot?9000:frame} reveal={fish} jumpFrame={SPLASH_FRAME}/>
    <Bridge006 progress={bridge}/><Walkway006 visible={snapshot||frame>=E(43.5)}/><Observation006 progress={snapshot?1:ramp(frame,E(62.5),E(62.94))}/>
    {residents&&<Actors006 frame={frame} snapshot={snapshot}/>}
  </group>;
};
