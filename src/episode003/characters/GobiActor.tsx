import React,{useLayoutEffect,useMemo,useRef} from 'react';
import {DoubleSide,Group,Mesh,Shape} from 'three';
import type {} from '@react-three/fiber';
import {Gobi} from '../../Gobi';
import type {GobiPose} from '../../Gobi';

export type GobiActingPose=GobiPose&{pocket:number;reading:number;speech:number};

/** Reuses the original Gobi mesh/face rig. Added props are EP003 pantomime only. */
export const GobiActor:React.FC<{frame:number;pose:GobiActingPose}>=({frame,pose})=>{
  const root=useRef<Group>(null);
  const cloth=useMemo(()=>{const s=new Shape();s.moveTo(-0.13,0);s.lineTo(0.13,0);s.lineTo(0.1,-0.2);s.lineTo(0,-0.25);s.lineTo(-0.1,-0.2);s.closePath();return s;},[]);
  useLayoutEffect(()=>{root.current?.traverse(n=>{if(n instanceof Mesh&&n.material&&'roughness' in n.material){n.castShadow=true;n.receiveShadow=true;}});},[]);
  const talk=pose.speech*(0.5+0.5*Math.abs(Math.sin(frame*0.57)));
  return <group ref={root} name="gobi-ep003-actor">
    <Gobi frame={frame} pose={{...pose,surprise:Math.max(pose.surprise??0,talk*0.22)}}/>
    <group position={[pose.x,pose.hop??0,pose.z]} rotation-y={pose.rotY} scale={pose.scale??1}>
      {pose.reading>0.001&&<group position={[-0.14,0.98,0.44]} rotation={[-0.25,-0.1,0.1]} scale={pose.reading} name="comment-phone">
        <mesh><boxGeometry args={[0.30,0.48,0.035]}/><meshStandardMaterial color="#263345" roughness={0.55}/></mesh>
        <mesh position={[0,0,0.023]}><boxGeometry args={[0.25,0.40,0.01]}/><meshStandardMaterial color="#d8e7e5" emissive="#9bbdbc" emissiveIntensity={0.12}/></mesh>
      </group>}
      {pose.pocket>0.001&&<group name="empty-pocket-linings">
        {[-1,1].map(side=><group key={side} position={[side*0.26,0.71+pose.pocket*0.09,0.274]} rotation-z={side*0.16*pose.pocket} scale={[pose.pocket,pose.pocket,1]}>
          <mesh position={[0,0.015,-0.012]}><boxGeometry args={[0.29,0.055,0.018]}/><meshStandardMaterial color="#111a38"/></mesh>
          <mesh><shapeGeometry args={[cloth]}/><meshStandardMaterial color="#efe0bf" side={DoubleSide} roughness={1}/></mesh>
          <mesh position={[0,-0.025,0.006]}><boxGeometry args={[0.20,0.012,0.008]}/><meshStandardMaterial color="#c4b38e"/></mesh>
        </group>)}
      </group>}
    </group>
  </group>;
};
