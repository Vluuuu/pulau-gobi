import React,{useLayoutEffect,useRef} from 'react';
import {AbsoluteFill,Audio,staticFile,useCurrentFrame} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import {Group,Mesh} from 'three';
import {EP003_WORLD_LAYOUT as L,ExpandedIslandEP003,TerrainExpansionFx,RiverEP003,RenovatedHouseEP003,WartegEP003} from './episode003/world';
import {radiusForExpansion} from './episode003/world/terrain/terrainMath.ts';
import {RiceField} from './episode002/RiceField';
import {IslandDecor} from './episode002/IslandDecor3D';
import {EP003_ROSTER} from './episode003/state/roster.ts';
import {EP003_VOICEOVER} from './episode003/audio/alignment.ts';
import {buildProgress,EP003_DURATION_IN_FRAMES} from './episode003/direction/timeline.ts';
import {gobiPoseAt,residentPoseAt,nameOpacityAt} from './episode003/direction/acting.ts';
import {GobiActor} from './episode003/characters/GobiActor';
import {ResidentActor} from './episode003/characters/ResidentActor';
import {ResidentName} from './episode003/characters/ResidentName';
import {SceneCamera,SceneLighting} from './episode003/camera/SceneCamera';
import {cameraAt} from './episode003/camera/cameraPlan.ts';
import {Episode003Captions} from './episode003/captions/Episode003Captions';
import {StoryOverlays} from './episode003/captions/StoryOverlays';
export {EP003_DURATION_IN_FRAMES};

export const Episode003World:React.FC<{frame:number}>=({frame})=>{
  const root=useRef<Group>(null),expansion=buildProgress(frame,'expansion');
  const visibleRadius=radiusForExpansion(expansion,L.initialRadius,L.targetRadius);
  useLayoutEffect(()=>{root.current?.traverse(n=>{if(n instanceof Mesh&&n.material&&'roughness' in n.material){
    n.receiveShadow=true;if(n.geometry.getAttribute('position')?.count<10000&&!n.name.startsWith('river-'))n.castShadow=true;
  }});},[]);
  return <group ref={root} name="ep003-world">
    <ExpandedIslandEP003 progress={expansion} radius={L.targetRadius} frame={frame}/>
    <TerrainExpansionFx progress={expansion} radius={visibleRadius} frame={frame}/>
    <RiverEP003 progress={buildProgress(frame,'river')} frame={frame} {...L.river}/>
    <RenovatedHouseEP003 progress={buildProgress(frame,'house')} frame={frame} {...L.house}/>
    <group position={[...L.riceField.position]} rotation-y={L.riceField.rotationY}><RiceField progress={1} scale={L.riceField.scale} position={[0,0,0]} rotationY={0}/></group>
    <WartegEP003 progress={buildProgress(frame,'warteg')} frame={frame} {...L.warteg}/>
    <IslandDecor frame={frame+1000} startFrame={0}/>
  </group>;
};

/** Reusable 3D stage; children allow a local QA probe without changing asset modules. */
export const Episode003Stage:React.FC<{frame:number;children?:React.ReactNode}>=({frame,children})=>{
  const gobi=gobiPoseAt(frame),camera=cameraAt(frame);
  return <ThreeCanvas width={1080} height={1920} orthographic shadows camera={{position:[10,2,10],zoom:560,near:0.1,far:260}}>
      <SceneCamera frame={frame}/><SceneLighting/><Episode003World frame={frame}/>
      <GobiActor frame={frame} pose={gobi}/>
      {EP003_ROSTER.map(r=>{const pose=residentPoseAt(r.id,frame),opacity=nameOpacityAt(r.id,frame);
        return <React.Fragment key={r.id}><ResidentActor resident={r} pose={pose} frame={frame}/>
          {pose.visible&&opacity>0&&<ResidentName name={r.displayName} position={pose.position} opacity={opacity} zoom={camera.zoom} special={r.tier==='special'}/>}
        </React.Fragment>;
      })}
      {children}
    </ThreeCanvas>;
};
/** Complete frame-sampled EP003 composition. Inputs/owners' world assets are preserved verbatim. */
export const Episode003:React.FC=()=>{
  const frame=useCurrentFrame();
  return <AbsoluteFill style={{background:'linear-gradient(180deg,#abdbee 0%,#d9edf0 65%,#f1e8df 100%)'}}>
    <Audio src={staticFile(EP003_VOICEOVER.file)} volume={0.95}/>
    <Episode003Stage frame={frame}/>
    <StoryOverlays frame={frame}/><Episode003Captions frame={frame}/>
  </AbsoluteFill>;
};
