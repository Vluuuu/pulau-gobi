import React,{useMemo} from 'react';
import {DoubleSide} from 'three';
import type {} from '@react-three/fiber';
import {WartegPartBatch} from './WartegPartBatch.tsx';
import {buildWartegGlass,clampProgress,resolveWartegPlacement,wartegParts} from './wartegModel.ts';
export {WARTEG_LOCAL_ANCHORS} from './wartegModel.ts';

export type WartegEP003Props={progress:number;frame?:number;position?:readonly [number,number,number];rotationY?:number;scale?:number};

/** VO-controlled asset: framing -> meja -> etalase/lauk -> atap -> reveal. No NPCs or episode clock. */
export const WartegEP003:React.FC<WartegEP003Props>=({progress,frame=0,position,rotationY,scale})=>{
  const p=clampProgress(progress),placement=resolveWartegPlacement({position,rotationY,scale});
  // Completed assets need no per-frame instance uploads; only sign/reveal secondary motion uses frame.
  const animatedFrame=p>0.83&&p<1&&Number.isFinite(frame)?frame:0;
  const parts=useMemo(()=>wartegParts(p,animatedFrame),[p,animatedFrame]);
  const panes=useMemo(()=>buildWartegGlass(p),[p]);
  if(parts.length===0)return null;
  return <group name="warteg-001" position={[...placement.position]} rotation-y={placement.rotationY} scale={placement.scale}>
    <WartegPartBatch parts={parts}/>
    <group name="warteg-display-glass">
      {panes.map(pane=><mesh key={pane.id} name={pane.id} position={[...pane.position]} rotation-y={pane.rotationY} renderOrder={2}>
        <planeGeometry args={[...pane.size]}/><meshStandardMaterial color="#dbf3ee" transparent opacity={pane.opacity} depthWrite={false} side={DoubleSide} forceSinglePass roughness={0.25}/>
      </mesh>)}
      {panes.length>0&&<mesh name="glass-reflection" position={[-1.45,panes[0].position[1]+panes[0].size[1]*0.2,1.308]} rotation-z={-0.3} renderOrder={3}>
        <planeGeometry args={[0.025*panes[0].size[1]/0.7,0.22*panes[0].size[1]/0.7]}/><meshBasicMaterial color="#ffffff" transparent opacity={panes[0].opacity*1.8} depthWrite={false}/>
      </mesh>}
    </group>
    <group name="warteg-contact-shadow" position={[0,0.012,0]}>
      {[1,0.73].map((k,i)=><mesh key={i} rotation-x={-Math.PI/2} position={[0,i*0.003,0]} scale={[3*k,2.45*k,1]}>
        <circleGeometry args={[1,36]}/><meshBasicMaterial color="#284b30" transparent opacity={Math.min(1,p/0.3)*(i?0.15:0.10)} depthWrite={false}/>
      </mesh>)}
    </group>
  </group>;
};
