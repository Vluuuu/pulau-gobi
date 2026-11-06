import React,{useLayoutEffect,useMemo} from 'react';
import {useThree} from '@react-three/fiber';
import type {OrthographicCamera} from 'three';
import {Object3D} from 'three';
import {cameraAt} from './cameraPlan.ts';
export const EP003_LIGHTING={sky:'#d4ebff',ground:'#8a6a48',ambient:0.45,sun:'#fff3da',sunIntensity:1.5,fill:'#9ccbff',fillIntensity:0.45} as const;
export const SceneCamera:React.FC<{frame:number}>=({frame})=>{
  const camera=useThree(s=>s.camera) as OrthographicCamera;
  const fillTarget=useMemo(()=>new Object3D(),[]);
  const p=cameraAt(frame);
  useLayoutEffect(()=>{camera.position.set(...p.position);camera.zoom=p.zoom;camera.lookAt(...p.target);camera.updateProjectionMatrix();camera.updateMatrixWorld(true);
    fillTarget.position.set(...p.target);fillTarget.updateMatrixWorld(true);
  },[camera,fillTarget,...p.position,...p.target,p.zoom]);
  return <><primitive object={fillTarget}/><directionalLight position={p.position} target={fillTarget} intensity={0.55} color="#fff0d9"/></>;
};
export const SceneLighting:React.FC=()=> <>
  <hemisphereLight args={[EP003_LIGHTING.sky,EP003_LIGHTING.ground,0.5]}/>
  <ambientLight intensity={EP003_LIGHTING.ambient}/>
  <directionalLight position={[10,28,14]} color={EP003_LIGHTING.sun} intensity={EP003_LIGHTING.sunIntensity} castShadow
    shadow-mapSize={[2048,2048]} shadow-camera-left={-35} shadow-camera-right={35} shadow-camera-top={35} shadow-camera-bottom={-35}
    shadow-camera-near={0.1} shadow-camera-far={110} shadow-bias={-0.0003} shadow-normalBias={0.035}/>
  <directionalLight position={[-18,12,-12]} color={EP003_LIGHTING.fill} intensity={EP003_LIGHTING.fillIntensity}/>
</>;
