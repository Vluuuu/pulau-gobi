import React,{useLayoutEffect,useMemo,useRef} from 'react';
import {Euler,InstancedMesh,Matrix4,Quaternion,Vector3} from 'three';
import type {} from '@react-three/fiber';
import {WARTEG_COLORS} from './wartegModel.ts';
import type {WartegPart} from './wartegModel.ts';

const Instances:React.FC<{parts:readonly WartegPart[]}>=({parts})=>{
  const ref=useRef<InstancedMesh>(null),material=parts[0].material,kind=parts[0].kind??'box';
  useLayoutEffect(()=>{
    const mesh=ref.current;if(!mesh)return;
    const matrix=new Matrix4(),q=new Quaternion(),e=new Euler(),p=new Vector3(),s=new Vector3();
    parts.forEach((part,i)=>{p.fromArray(part.position);s.fromArray(part.size);e.set(...(part.rotation??[0,0,0]));q.setFromEuler(e);matrix.compose(p,q,s);mesh.setMatrixAt(i,matrix);});
    mesh.instanceMatrix.needsUpdate=true;mesh.computeBoundingSphere();mesh.computeBoundingBox();
  },[parts]);
  return <instancedMesh ref={ref} args={[undefined,undefined,parts.length]} name={`warteg-${material}-${kind}`}
    userData={{partIds:parts.map(p=>p.id)}} castShadow={material!=='dust'&&material!=='glint'} receiveShadow>
    {kind==='sphere'?<sphereGeometry args={[1,8,6]}/>:kind==='ico'?<icosahedronGeometry args={[1,0]}/>:kind==='cylinder'?<cylinderGeometry args={[1,0.75,1,10]}/>:<boxGeometry args={[1,1,1]}/>}
    <meshStandardMaterial color={WARTEG_COLORS[material]} flatShading roughness={material==='metal'?0.34:0.86}
      metalness={material==='metal'?0.22:0} emissive={material==='glint'?WARTEG_COLORS.glint:'#000000'} emissiveIntensity={material==='glint'?0.3:0}/>
  </instancedMesh>;
};
export const WartegPartBatch:React.FC<{parts:readonly WartegPart[]}>=({parts})=>{
  const batches=useMemo(()=>{const map=new Map<string,WartegPart[]>();parts.forEach(p=>{const key=`${p.material}-${p.kind??'box'}`;if(!map.has(key))map.set(key,[]);map.get(key)!.push(p);});return [...map.entries()];},[parts]);
  return <>{batches.map(([key,list])=><Instances key={`${key}-${list.length}`} parts={list}/>)}</>;
};
