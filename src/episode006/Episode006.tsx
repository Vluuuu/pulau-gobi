import React,{useLayoutEffect,useMemo} from 'react';
import {AbsoluteFill,Audio,Sequence,staticFile,useCurrentFrame,interpolateColors} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import {useThree} from '@react-three/fiber';
import {Object3D} from 'three';
import type {PerspectiveCamera} from 'three';
import {CurrentWorld} from '../world/current';
import {cameraAt} from './camera.ts';
import {Overlays006} from './Overlays';
import {CUES,cueGain} from './sounds.ts';
import {E,DURATION,OUTRO_START,OUTRO_FRAMES,ramp} from './timeline.ts';
import {STORY_GAIN,OUTRO_GAIN} from './audioPerformance.ts';
export {DURATION as EP006_DURATION_IN_FRAMES};
const Camera006:React.FC<{frame:number}>=({frame})=>{
 const camera=useThree(s=>s.camera) as PerspectiveCamera,c=cameraAt(frame),target=useMemo(()=>new Object3D(),[]);
 useLayoutEffect(()=>{camera.position.set(...c.position);camera.fov=c.fov;camera.near=c.near;camera.lookAt(...c.target);camera.updateProjectionMatrix();camera.updateMatrixWorld(true);target.position.set(...c.target);target.updateMatrixWorld(true);},[camera,frame,target]);
 return <><primitive object={target}/><directionalLight position={c.position} target={target} color="#fff0da" intensity={c.room?.20:.34}/></>;
};
const Lighting006:React.FC<{frame:number}>=({frame})=>{
 const p=ramp(frame,E(86.56),E(99.08)),inside=cameraAt(frame).room!==null;
 return <>
  <hemisphereLight args={['#d4e4ff','#8a6a48',inside?.55:.8-.46*p]}/><ambientLight intensity={inside?.75:.45-.27*p}/>
  <directionalLight position={[-15,32,-10]} color={interpolateColors(p,[0,1],['#fff3da','#e9a573'])} intensity={1.5-1.2*p} castShadow shadow-mapSize={[2048,2048]} shadow-camera-left={-60} shadow-camera-right={60} shadow-camera-top={60} shadow-camera-bottom={-60} shadow-camera-far={160} shadow-bias={-.0003}/>
  <directionalLight position={[20,15,25]} color="#9ccbff" intensity={.45-.23*p}/>
 </>;
};
export const Episode006:React.FC=()=>{
 const f=useCurrentFrame(),dusk=ramp(f,E(86.56),E(99.08));
 return <AbsoluteFill style={{background:`linear-gradient(180deg,${interpolateColors(dusk,[0,1],['#abdbee','#556d8b'])},${interpolateColors(dusk,[0,1],['#e9eee5','#9c9bab'])})`}}>
  <Sequence from={0} durationInFrames={OUTRO_START} layout="none"><Audio src={staticFile('episode006/voice/story-edit.wav')} volume={STORY_GAIN}/></Sequence>
  {CUES.map((c,i)=><Sequence key={i} from={c.frame} durationInFrames={c.frames} layout="none"><Audio src={staticFile(c.file)} volume={local=>cueGain(c,local)}/></Sequence>)}
  <Sequence from={OUTRO_START} durationInFrames={OUTRO_FRAMES} layout="none"><Audio src={staticFile('episode004/voice/ep004_vo_19.mp3')} volume={OUTRO_GAIN}/></Sequence>
  {/* One continuous world/camera/lighting instance across the entire ending. */}
  <ThreeCanvas width={1080} height={1920} shadows camera={{near:.06,far:600,fov:50}}><Camera006 frame={f}/><Lighting006 frame={f}/><CurrentWorld frame={f} snapshot={false}/></ThreeCanvas>
  <Overlays006 frame={f}/>
  <AbsoluteFill style={{background:'#182a37',opacity:ramp(f,DURATION-12,DURATION-1),pointerEvents:'none'}}/>
 </AbsoluteFill>;
};
