import React,{useLayoutEffect,useMemo,useRef} from 'react';
import {InstancedMesh,Matrix4,Quaternion,Vector3,Euler} from 'three';
import type {Part} from './part.ts';
const Batch:React.FC<{parts:Part[]}>=({parts})=>{
 const ref=useRef<InstancedMesh>(null);
 useLayoutEffect(()=>{const m=new Matrix4(),p=new Vector3(),q=new Quaternion(),s=new Vector3(),e=new Euler();parts.forEach((a,i)=>{
  m.compose(p.fromArray(a.position),q.setFromEuler(e.set(...(a.rotation??[0,0,0]))),s.fromArray(a.size));ref.current!.setMatrixAt(i,m);});
  ref.current!.instanceMatrix.needsUpdate=true;ref.current!.computeBoundingSphere();
 },[parts]);const kind=parts[0].kind;
 return <instancedMesh ref={ref} args={[undefined,undefined,parts.length]} castShadow receiveShadow userData={{partIds:parts.map(p=>p.id)}}>
  {kind==='ico'?<icosahedronGeometry args={[1,0]}/>:kind==='cone'?<coneGeometry args={[1,1,7]}/>:kind==='cylinder'?<cylinderGeometry args={[1,1,1,8]}/>:<boxGeometry args={[1,1,1]}/>}
  <meshStandardMaterial color={parts[0].color} flatShading roughness={.88}/>
 </instancedMesh>;
};
export const Parts:React.FC<{parts:Part[]}>=({parts})=>{
 const groups=useMemo(()=>{const g=new Map<string,Part[]>();for(const p of parts){const key=p.color+(p.kind??'box');if(!g.has(key))g.set(key,[]);g.get(key)!.push(p);}return [...g.entries()];},[parts]);
 return <>{groups.map(([key,p])=><Batch key={`${key}-${p.length}`} parts={p}/>)}</>;
};
