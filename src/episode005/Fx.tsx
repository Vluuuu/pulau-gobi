import React from 'react';
import {shotAt} from './shots.ts';
import {gobiAt} from './direction.ts';
import {gap,ramp} from './timeline.ts';
export const Fx005:React.FC<{frame:number}>=({frame:f})=>{
 const s=shotAt(f),g=gobiAt(f),building=['S06','S11','S12a','S12b','S20'].includes(s.id),intro=s.id==='S08b'||s.id==='S22b';
 return <group name="ep005-fx">
  {building&&Array.from({length:15},(_,i)=>{const u=(f*.03+i*.17)%1;return <mesh key={i} position={[g.pose.x+Math.sin(i*7)*2*u,.1+u*.8,g.pose.z+Math.cos(i*7)*2*u]} scale={.10+u*.10}><icosahedronGeometry args={[1,0]}/><meshBasicMaterial color="#c9b88d" transparent opacity={.4*(1-u)}/></mesh>;})}
  {intro&&Array.from({length:9},(_,i)=><mesh key={`spark-${i}`} position={[g.pose.x+Math.sin(i*3+f*.04)*1.8,1.4+Math.cos(i*2+f*.04),g.pose.z+Math.cos(i*3+f*.04)*1.8]}><octahedronGeometry args={[.07]}/><meshBasicMaterial color="#ffe49b"/></mesh>)}
  {s.id==='S23c'&&<mesh position={[-21.5+(f-s.start)*.04,1.2+Math.sin(f*.1)*.1,-21.4]} rotation={[.1,f*.02,.2]}><planeGeometry args={[.38,.5]}/><meshStandardMaterial color="#f4ead2" side={2}/></mesh>}
 </group>;
};
