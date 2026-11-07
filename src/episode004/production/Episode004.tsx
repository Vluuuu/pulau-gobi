import React,{useLayoutEffect,useRef} from 'react';
import {AbsoluteFill,Audio,Sequence,staticFile,useCurrentFrame} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import {useThree} from '@react-three/fiber';
import {Object3D} from 'three';
import type {OrthographicCamera} from 'three';
import {SceneLighting} from '../../episode003/camera/SceneCamera';
import {cameraAt} from './camera.ts';
import {World004} from './World';
import {Actors004} from './Actors';
import {Overlays004} from './Overlays';
import {VO,VO_VOLUME} from './voice.ts';
import {SFX_ASSETS,SOUND_CUES} from './sounds.ts';
import {DURATION,atVoice,voiceSlot,COMEDY,span,ramp} from './timeline.ts';
export {DURATION as EP004_DURATION_IN_FRAMES};
const Camera004:React.FC<{frame:number}>=({frame})=>{
 const camera=useThree(s=>s.camera) as OrthographicCamera,c=cameraAt(frame),target=useRef(new Object3D());
 useLayoutEffect(()=>{camera.position.set(...c.position);camera.zoom=c.zoom;camera.lookAt(...c.target);camera.updateProjectionMatrix();camera.updateMatrixWorld(true);target.current.position.set(...c.target);target.current.updateMatrixWorld(true);},[camera,frame]);
 return <><primitive object={target.current}/><directionalLight position={c.position} target={target.current} color="#fff0da" intensity={.55}/></>;
};
export const Episode004Stage:React.FC<{frame:number;children?:React.ReactNode}>=({frame,children})=><ThreeCanvas width={1080} height={1920} orthographic shadows camera={{near:.1,far:300,zoom:60}}>
 <Camera004 frame={frame}/><SceneLighting/><World004 frame={frame}/><Actors004 frame={frame}/>{children}
</ThreeCanvas>;
export const Episode004:React.FC=()=>{
 const frame=useCurrentFrame(),wind=SFX_ASSETS.find(a=>a.id==='wind-bed')!;
 return <AbsoluteFill style={{background:'linear-gradient(180deg,#abdbee,#d9edf0 65%,#f1e8df)'}}>
  {VO.map(v=><Sequence key={v.id} from={atVoice(v.id)} durationInFrames={voiceSlot(v.id).end-atVoice(v.id)} layout="none"><Audio src={staticFile(v.file)} volume={VO_VOLUME}/></Sequence>)}
  {SOUND_CUES.map(c=>{const a=SFX_ASSETS.find(a=>a.id===c.asset)!;return <Sequence key={c.id} from={c.frame} durationInFrames={Math.ceil(a.durationSeconds*30)} layout="none"><Audio src={staticFile(a.file)} volume={c.volume}/></Sequence>;})}
  <Audio src={staticFile(wind.file)} loop volume={.16*(1-span(frame,COMEDY.start+281,COMEDY.start+318,2))*(1-ramp(frame,DURATION-18,DURATION))}/>
  <Episode004Stage frame={frame}/><Overlays004 frame={frame}/>
 </AbsoluteFill>;
};
