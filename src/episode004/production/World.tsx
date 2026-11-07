import React,{useLayoutEffect,useMemo,useRef} from 'react';
import {Group,Mesh} from 'three';
import {EP003_WORLD_LAYOUT as L,ExpandedIslandEP003,RiverEP003,RenovatedHouseEP003,WartegEP003} from '../../episode003/world';
import {TerrainExpansionFx} from '../../episode003/world/terrain/fx/TerrainExpansionFx';
import {RiceField} from '../../episode002/RiceField';
import {IslandDecor} from '../../episode002/IslandDecor3D';
import {KostProxy} from '../pilot/KostProxy';
import {Nature004} from './Nature';
import {farmParts,ranchParts} from './buildModels.ts';
import {Parts} from './Parts';
import {part} from './part.ts';
import {FARM,RANCH} from './layout.ts';
import {buildsAt,radiusAt,atVoice,GREEN_B} from './timeline.ts';
export const World004:React.FC<{frame:number}>=({frame})=>{
 const b=buildsAt(frame),radius=radiusAt(frame),root=useRef<Group>(null);
 const farm=useMemo(()=>farmParts(b.farm,frame),[b.farm,frame]),ranch=useMemo(()=>ranchParts(b.ranch),[b.ranch]);
 useLayoutEffect(()=>{root.current?.traverse(n=>{if(n instanceof Mesh){n.receiveShadow=true;if(n.geometry.getAttribute('position')?.count<10000)n.castShadow=true;}});},[radius,b.farm,b.ranch,b.kost]);
 return <group ref={root} name="episode004-world">
  <ExpandedIslandEP003 progress={1} radius={radius} frame={frame}/>
  <TerrainExpansionFx progress={b.expansion} radius={radius} frame={frame}/>
  <RiverEP003 progress={1} frame={2999+frame} {...L.river}/>
  <RenovatedHouseEP003 progress={1} frame={frame} {...L.house}/>
  <group position={[...L.riceField.position]} rotation-y={L.riceField.rotationY}><RiceField progress={1} scale={L.riceField.scale} position={[0,0,0]} rotationY={0}/></group>
  <WartegEP003 progress={1} frame={frame} {...L.warteg}/><IslandDecor frame={frame+4000} startFrame={0}/>
  <Nature004 frame={frame}/>
  <group name="ep004-farm-empty" position={[...FARM.position]} rotation-y={FARM.rotation}><Parts parts={farm}/></group>
  <group name="ep004-ranch-no-animals" position={[...RANCH.position]} rotation-y={RANCH.rotation}><Parts parts={ranch}/></group>
  <KostProxy progress={b.kost} frame={frame} enhanced/>
  {frame>=atVoice(9)&&<Parts parts={[part('waiting-bench','#a58255',[-2,.42,4.3],[1.5,.15,.55]),part('waiting-leg-a','#765b3b',[-2.55,.21,4.3],[.12,.42,.44]),part('waiting-leg-b','#765b3b',[-1.45,.21,4.3],[.12,.42,.44])]}/>}
 </group>;
};
