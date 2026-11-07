import React,{useLayoutEffect,useRef} from 'react';
import {AbsoluteFill,Audio,Sequence,staticFile,useCurrentFrame,getInputProps} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import {useThree} from '@react-three/fiber';
import {Object3D} from 'three';
import type {OrthographicCamera} from 'three';
import {SceneLighting} from '../episode003/camera/SceneCamera';
import {Episode004} from '../episode004/production/Episode004';
import {cameraAt} from './camera.ts';
import {World005} from './World';
import {Actors005} from './Actors';
import {Overlays005} from './Overlays';
import {Fx005} from './Fx';
import {Diagnostics005} from './diagnostics';
import {schoolInterior} from './direction.ts';
import {CUES,cueGain,ambienceGain,musicGain} from './sounds.ts';
import {AUDIO_SEGMENTS,DURATION,OUTRO_START,OUTRO_SOURCE_START,OUTRO_FRAMES,gap,ramp} from './timeline.ts';
export {DURATION as EP005_DURATION_IN_FRAMES};
const Camera005:React.FC<{frame:number}>=({frame:f})=>{
 const camera=useThree(s=>s.camera) as OrthographicCamera,c=cameraAt(f),target=useRef(new Object3D());
 useLayoutEffect(()=>{camera.position.set(...c.position);camera.zoom=c.zoom;camera.lookAt(...c.target);camera.updateProjectionMatrix();camera.updateMatrixWorld(true);target.current.position.set(...c.target);target.current.updateMatrixWorld(true);},[camera,f]);
 return <><primitive object={target.current}/><directionalLight position={c.position} target={target.current} color="#fff0da" intensity={.55}/></>;
};
export const Episode005:React.FC=()=>{
 const f=useCurrentFrame(),audit=Boolean(getInputProps().ep005Audit);
 return <AbsoluteFill style={{background:schoolInterior(f)?'linear-gradient(180deg,#ddd1ae,#cbb28a 65%,#d5c09b)':'linear-gradient(180deg,#abdbee,#d9edf0 65%,#f1e8df)'}}>
  {f<OUTRO_START?<>
   <Audio src={staticFile('episode005/voice/edited-v4.wav')} volume={.78}/>
   {CUES.map((c,i)=><Sequence key={i} from={c.frame} durationInFrames={c.frames} layout="none"><Audio src={staticFile(c.file)} startFrom={c.trim??0} volume={local=>cueGain(c,local)}/></Sequence>)}
   <Audio src={staticFile('episode004/sfx/wind-bed.wav')} loop volume={frame=>.12*ambienceGain(frame)}/>
   <Audio src={staticFile('episode005/sfx/music.wav')} loop volume={frame=>musicGain(frame)}/>
   <Sequence from={gap('G1').start+159} durationInFrames={OUTRO_START-gap('G1').start-159} layout="none"><Audio src={staticFile('episode005/sfx/waterfall.wav')} loop volume={local=>.09*ramp(local,0,15)*ambienceGain(local+gap('G1').start+159)}/></Sequence>
   <ThreeCanvas width={1080} height={1920} orthographic shadows camera={{near:.1,far:600,zoom:60}}><Camera005 frame={f}/><SceneLighting/><World005 frame={f}/><Actors005 frame={f}/><Fx005 frame={f}/>{audit&&<Diagnostics005 frame={f}/>}</ThreeCanvas>
   <Overlays005 frame={f}/>
  </>:<Sequence from={OUTRO_START} durationInFrames={OUTRO_FRAMES} layout="none">
   {/* Directly run the original composition at its original frame numbers, including audio,
       camera, overlays, actors and fade. No recreated outro or copied animation curves. */}
   <Sequence from={-OUTRO_SOURCE_START} layout="none"><Episode004/></Sequence>
  </Sequence>}
 </AbsoluteFill>;
};
