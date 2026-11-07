import React,{useLayoutEffect,useRef} from 'react';
import {Group,Mesh} from 'three';
import type {} from '@react-three/fiber';
import {Villager} from '../../episode002/Villager';
import type {Ep003Villager} from '../state/types.ts';
import type {V3} from '../direction/math.ts';

export type ResidentPose={position:V3;heading:number;walk:number;wave:number;pay:number;watch:number;scale:number;visible:boolean;seat?:number;lean?:number;headPitch?:number;headYaw?:number;clap?:number;carry?:number};
export const ResidentActor:React.FC<{resident:Pick<Ep003Villager,'id'|'visual'|'isNewInEp003'>;pose:ResidentPose;frame:number;stride?:number}>=({resident:r,pose:p,frame,stride})=>{
  const root=useRef<Group>(null);
  useLayoutEffect(()=>{root.current?.traverse(n=>{if(n instanceof Mesh&&n.material&&'roughness' in n.material){n.castShadow=true;n.receiveShadow=true;}});},[p.visible]);
  if(!p.visible)return null;
  const v=r.visual,phase=stride??frame*0.15+r.visual.seed,blink=((frame+v.seed)%137)<4;
  if(!r.isNewInEp003)return <group ref={root} name={`resident-${r.id}`}><Villager position={[...p.position]} heading={p.heading}
    walk={p.walk} stride={phase} shirt={v.shirt} hair={v.hair} pants={v.pants} skin={v.skin} scale={1.65*p.scale} wave={p.wave}/></group>;
  const step=Math.sin(phase)*p.walk*0.55;
  return <group ref={root} name={`resident-${r.id}`} position={[...p.position]} rotation-y={p.heading} scale={1.65*p.scale}>
    <mesh rotation-x={-Math.PI/2} position={[0,0.012,0]}><circleGeometry args={[0.36,16]}/><meshBasicMaterial color="#30452d" transparent opacity={0.2} depthWrite={false}/></mesh>
    {[-1,1].map(side=><group key={side} position={[side*0.10,0.43-.30*(p.seat??0),0]} rotation-x={side*step-(p.seat??0)*Math.PI/2}>
      <mesh position={[0,-0.18,0]}><boxGeometry args={[0.14,0.36,0.15]}/><meshStandardMaterial color={v.pants} flatShading/></mesh>
      <mesh position={[0,-0.38,0.03]}><boxGeometry args={[0.16,0.10,0.23]}/><meshStandardMaterial color="#dfd3b9" flatShading/></mesh>
    </group>)}
    <group position={[0,Math.abs(Math.sin(phase))*p.walk*0.025-.30*(p.seat??0),0]} rotation-x={-p.pay*0.10+(p.lean??0)}>
      <mesh position={[0,0.66,0]}><boxGeometry args={[0.40,0.43,0.26]}/><meshStandardMaterial color={v.shirt} flatShading/></mesh>
      {r.id==='warga-3'&&<><mesh position={[0,0.62,0.146]}><boxGeometry args={[0.31,0.37,0.025]}/><meshStandardMaterial color="#f3e2b8" flatShading/></mesh>
        <mesh position={[0,0.57,0.166]}><boxGeometry args={[0.17,0.12,0.016]}/><meshStandardMaterial color="#d0b987" flatShading/></mesh></>}
      <group position={[0,1.08,0]} rotation={[p.watch*0.10+(p.headPitch??0),p.watch*0.20+(p.headYaw??0),0]}>
        <mesh><icosahedronGeometry args={[0.23,1]}/><meshStandardMaterial color={v.skin} flatShading/></mesh>
        <mesh position={[0,0.035,-0.025]} rotation-x={-0.2}><sphereGeometry args={[0.25,8,5,0,Math.PI*2,0,Math.PI*0.55]}/><meshStandardMaterial color={v.hair} flatShading/></mesh>
        {v.hairStyle===1&&<mesh position={[-0.07,0.14,0.14]} rotation-z={0.28}><boxGeometry args={[0.30,0.11,0.12]}/><meshStandardMaterial color={v.hair} flatShading/></mesh>}
        {v.hairStyle===2&&<mesh position={[0,0.02,-0.23]}><sphereGeometry args={[0.13,6,5]}/><meshStandardMaterial color={v.hair} flatShading/></mesh>}
        {v.hairStyle===3&&<mesh position={[0.12,0.21,-0.09]}><icosahedronGeometry args={[0.13,1]}/><meshStandardMaterial color={v.hair} flatShading/></mesh>}
        {[-1,1].map(side=><mesh key={side} position={[side*0.083,0,0.214]} scale={[1,blink?0.12:1,1]}><sphereGeometry args={[0.027,6,5]}/><meshBasicMaterial color="#171921"/></mesh>)}
        <mesh position={[0,-0.09,0.215]} scale={[1+p.wave*0.35,0.5+p.pay*0.4,1]}><boxGeometry args={[0.063,0.027,0.018]}/><meshBasicMaterial color="#934e47"/></mesh>
      </group>
      {[-1,1].map(side=>{
        const paying=side===1?p.pay:0,waving=side===1?p.wave:0;
        const xRot=-side*step*0.6-paying*1.80-(p.carry??0)*1.05-(p.clap??0)*.8,zRot=waving*(2.35+Math.sin(frame*0.35)*0.16)-side*(p.clap??0)*(.4+.12*Math.sin(frame*.35));
        return <group key={side} position={[side*0.27,0.81,0]} rotation={[xRot,0,zRot]}>
          <mesh position={[0,-0.085,0]}><boxGeometry args={[0.13,0.20,0.15]}/><meshStandardMaterial color={v.shirt} flatShading/></mesh>
          <mesh position={[0,-0.27,0]}><boxGeometry args={[0.105,0.30+paying*0.12,0.105]}/><meshStandardMaterial color={v.skin} flatShading/></mesh>
          <group position={[0,-0.45-paying*0.06,0.015]} rotation-x={paying*1.80}>
            <mesh><boxGeometry args={[0.14,0.05+0.04*(1-paying),0.14]}/><meshStandardMaterial color={v.skin} flatShading/></mesh>
            {paying>0.01&&[0,1,2,3].map(i=><mesh key={i} position={[(i-1.5)*0.031,0,0.09]}><boxGeometry args={[0.025,0.045,0.08]}/><meshStandardMaterial color={v.skin} flatShading/></mesh>)}
          </group>
        </group>;
      })}
    </group>
  </group>;
};
