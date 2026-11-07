import React,{useLayoutEffect,useRef} from 'react';
import {AbsoluteFill,Audio,Sequence,staticFile,useCurrentFrame} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import {useThree} from '@react-three/fiber';
import {Group,Mesh,Object3D} from 'three';
import type {OrthographicCamera} from 'three';
import {Episode003World} from '../../Episode003Scene';
import {SceneLighting} from '../../episode003/camera/SceneCamera';
import {EP003_ROSTER} from '../../episode003/state/roster.ts';
import {residentPoseAt} from '../../episode003/direction/acting.ts';
import {ResidentActor} from '../../episode003/characters/ResidentActor';
import {PilotGobi,PilotOktaa} from './Actors';
import {KostProxy} from './KostProxy';
import {PilotOverlays} from './Overlays';
import {PILOT_VO,PILOT_SFX_ASSETS,VO_VOLUME} from './audio.ts';
import {cameraAt,SFX_CUES,DURATION,T,world,pulse,span} from './plan.ts';
export {DURATION as EP004_PILOT_DURATION};
const Camera:React.FC<{frame:number}>=({frame})=>{
 const c=useThree(s=>s.camera) as OrthographicCamera,p=cameraAt(frame),target=useRef(new Object3D());
 useLayoutEffect(()=>{c.position.set(...p.position);c.zoom=p.zoom;c.lookAt(...p.target);c.updateProjectionMatrix();c.updateMatrixWorld(true);target.current.position.set(...p.target);target.current.updateMatrixWorld(true);},[c,frame,p]);
 return <><primitive object={target.current}/><directionalLight position={p.position} target={target.current} intensity={.55} color="#fff0d9"/></>;
};
const Dust:React.FC<{frame:number}>=({frame})=>{
 const k=span(frame,T.contact,T.contact+14,3),root=world([-1.63,.035,4.84]);if(k<=0)return null;
 return <group position={[...root]}>{Array.from({length:7},(_,i)=>{const a=i*Math.PI*2/7,r=(frame-T.contact)*.035;return <mesh key={i} position={[Math.sin(a)*r,.025,Math.cos(a)*r]} scale={k*.16}>
  <icosahedronGeometry args={[1,0]}/><meshStandardMaterial color="#d8cba2" transparent opacity={k*.6} depthWrite={false}/></mesh>;})}</group>;
};
export const PilotStage:React.FC<{frame:number;children?:React.ReactNode}>=({frame,children})=>{
 const root=useRef<Group>(null);
 useLayoutEffect(()=>{root.current?.traverse(n=>{if(n instanceof Mesh){n.receiveShadow=true;if(n.geometry.getAttribute('position')?.count<10000)n.castShadow=true;}});},[]);
 return <ThreeCanvas width={1080} height={1920} orthographic shadows camera={{near:.1,far:260,zoom:225}}>
  <Camera frame={frame}/><SceneLighting/>
  <group ref={root}><Episode003World frame={2999+frame}/><KostProxy/>
   {EP003_ROSTER.filter(r=>r.id!=='warga-1').map(r=><ResidentActor key={r.id} resident={r} frame={2999+frame} pose={{...residentPoseAt(r.id,2999),walk:0}}/>)}
  </group>
  <PilotGobi frame={frame}/><PilotOktaa frame={frame}/><Dust frame={frame}/>{children}
 </ThreeCanvas>;
};
export const Episode004VisualPilot:React.FC=()=>{
 const frame=useCurrentFrame();return <AbsoluteFill style={{background:'linear-gradient(180deg,#abdbee,#d9edf0 65%,#f1e8df)'}}>
  {PILOT_VO.map(v=><Sequence key={v.file} from={v.startFrame} durationInFrames={v.durationFrames} layout="none"><Audio src={staticFile(v.file)} volume={VO_VOLUME}/></Sequence>)}
  {SFX_CUES.map(c=>{const a=PILOT_SFX_ASSETS.find(a=>a.id===c.asset)!;return <Sequence key={c.id} from={c.frame} durationInFrames={Math.ceil(a.durationSeconds*30)} layout="none"><Audio src={staticFile(a.file)} volume={c.volume}/></Sequence>;})}
  <PilotStage frame={frame}/><PilotOverlays frame={frame}/>
 </AbsoluteFill>;
};
