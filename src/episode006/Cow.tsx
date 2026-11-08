import React from 'react';
import {COW_IDS} from '../episode005/direction.ts';
import {cowAt} from './direction.ts';
import {shotAt} from './shots.ts';
export const Cow006:React.FC<{id:string;frame:number}>=({id,frame:f})=>{
 const i=COW_IDS.indexOf(id as typeof COW_IDS[number]),normal=cowAt(i,f),flash=id==='cow-003'&&shotAt(f).id==='S02',p={...normal,position:flash?[-20,.4,-21] as const:normal.position,noseLift:0};
 const blink=(f+i*39)%137<5,chew=Math.sin(f*.21+i)*.025,inside=p.position[1]>.2&&p.walk===0;
 return <group name={id} position={[...p.position]} rotation-y={p.heading}>
  <mesh rotation-x={-Math.PI/2} position-y={.02}><circleGeometry args={[.83,12]}/><meshBasicMaterial color="#30452d" transparent opacity={.18} depthWrite={false}/></mesh>
  <group position-y={Math.abs(Math.sin(p.stride))*p.walk*.045}>
   <mesh position={[0,1.14,-.1]} scale={[.58,.60,1.02]}><icosahedronGeometry args={[1,1]}/><meshStandardMaterial color={i===1?'#d9b993':'#f0ead9'} flatShading/></mesh>
   {[-1,1].map(side=><mesh key={side} position={[side*.48,1.28,i===2?.15:-.35]} scale={[.15,.37,i===2?.61:.39]} rotation-z={side*.2}><icosahedronGeometry args={[1,0]}/><meshStandardMaterial color={i===2?'#263b40':'#75604b'} flatShading/></mesh>)}
   {[-1,1].flatMap(side=>[-1,1].map(end=><group key={`${side}${end}`} position={[side*.36,.91,end*.61-.13]} rotation-x={Math.sin(p.stride+(side===end?0:Math.PI))*.55*p.walk}>
    <mesh position-y={-.32}><cylinderGeometry args={[.105,.09,.64,6]}/><meshStandardMaterial color="#e7ddc9"/></mesh>
    <mesh position={[0,-.66,.035]}><boxGeometry args={[.22,.17,.28]}/><meshStandardMaterial color="#485350"/></mesh>
   </group>))}
   <group position={[0,1.52-p.noseLift*.35,.72]} rotation={[-p.noseLift*.35+Math.sin(f*.035+i)*.04,p.headYaw,0]}>
    <mesh scale={[.37,.48,.42]}><icosahedronGeometry args={[1,1]}/><meshStandardMaterial color={i===2?'#30464a':'#e7dfca'} flatShading/></mesh>
    <mesh position={[0,-.15+chew,.34]} scale={[.37,.21,.23]}><icosahedronGeometry args={[1,1]}/><meshStandardMaterial color="#dcaea0" flatShading/></mesh>
    {[-1,1].map(side=><React.Fragment key={side}>
     <mesh position={[side*.15,-.14,.54]}><sphereGeometry args={[.035,6,4]}/><meshBasicMaterial color="#876f65"/></mesh>
     <mesh position={[side*.25,.08,.29]} scale={[1,blink?.08:1,1]}><sphereGeometry args={[.043,7,5]}/><meshBasicMaterial color="#17272a"/></mesh>
     <group position={[side*.33,.24,0]} rotation-z={side*(.35+Math.sin(f*.19+i+side)*.14)}><mesh position={[side*.16,0,0]} scale={[.25,.085,.14]}><icosahedronGeometry args={[1,0]}/><meshStandardMaterial color={i===2?'#344b4e':'#c8ad90'} flatShading/></mesh></group>
     <mesh position={[side*.24,.44,0]} rotation-z={side*.22}><coneGeometry args={[.065,.25,6]}/><meshStandardMaterial color="#cdbf95"/></mesh>
    </React.Fragment>)}
    {i===2&&<mesh position={[.08,.33,.23]} scale={[.16,.14,.07]}><icosahedronGeometry args={[1,0]}/><meshStandardMaterial color="#fff2d6"/></mesh>}
   </group>
   <group position={[0,1.36,-1.02]} rotation={[.25,0,Math.sin(f*.09+i)*.48]}>
    <mesh position={[0,-.3,-.06]}><cylinderGeometry args={[.035,.025,.6,5]}/><meshStandardMaterial color="#d0c2a6"/></mesh>
    <mesh position={[0,-.64,-.06]} scale={[.11,i===2?.22:.15,.11]}><icosahedronGeometry args={[1,0]}/><meshStandardMaterial color={i===2?'#253b40':'#74624f'}/></mesh>
   </group>
  </group>
 </group>;
};
