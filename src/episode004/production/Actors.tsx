import React,{useLayoutEffect,useRef} from 'react';
import {Group,Mesh} from 'three';
import {ResidentActor} from '../../episode003/characters/ResidentActor';
import {Villager} from '../../episode002/Villager';
import {PilotGobi,PilotOktaa} from '../pilot/Actors';
import {CAST,gobiSample,residentMotion,speechAt} from './direction.ts';
import {atVoice,localWord,GREEN_A,GREEN_B,COMEDY,inComedy,ramp,pulse} from './timeline.ts';
import {FIRST_TREE} from './layout.ts';
const Tool:React.FC<{kind:string;frame:number}>=({kind,frame})=>{
 if(kind==='seedling')return <group position={[0,1,.58]}>
  <mesh><cylinderGeometry args={[.27,.18,.36,7]}/><meshStandardMaterial color="#b37b52" flatShading/></mesh>
  <mesh position-y={.38}><cylinderGeometry args={[.025,.035,.5,5]}/><meshStandardMaterial color="#547644"/></mesh>
  {[0,1,2].map(i=><mesh key={i} position={[Math.cos(i*2)*.12,.45+i*.07,Math.sin(i*2)*.12]} scale={[.18,.06,.1]}><icosahedronGeometry args={[1,0]}/><meshStandardMaterial color="#75a85f"/></mesh>)}
 </group>;
 if(kind==='hoe')return <group position={[.45,1.15,.12]} rotation-z={-.25}>
  <mesh><cylinderGeometry args={[.035,.035,1.55,5]}/><meshStandardMaterial color="#b18d59"/></mesh>
  <mesh position={[.12,.75,0]}><boxGeometry args={[.38,.08,.27]}/><meshStandardMaterial color="#a0aaa1"/></mesh>
 </group>;
 if(kind==='can')return <group position={[.47,.85,.23]} rotation-z={Math.sin(frame*.15)*.06}>
  <mesh><cylinderGeometry args={[.20,.22,.37,7]}/><meshStandardMaterial color="#769d92"/></mesh>
  <mesh position={[.27,.08,0]} rotation-z={-.45}><cylinderGeometry args={[.05,.07,.42,5]}/><meshStandardMaterial color="#769d92"/></mesh>
  <mesh position={[-.17,.22,0]}><torusGeometry args={[.16,.025,4,10,Math.PI*1.6]}/><meshStandardMaterial color="#4d7267"/></mesh>
 </group>;
 if(kind==='seedbag')return <mesh position={[0,.9,.47]} scale={[.3,.4,.22]} rotation-z={frame>=atVoice(15)?Math.PI:0}><icosahedronGeometry args={[1,1]}/><meshStandardMaterial color="#d6c093" flatShading/></mesh>;
 return null;
};
export const ProductionResident:React.FC<{id:string;frame:number}>=({id,frame})=>{
 const r=CAST.find(r=>r.id===id)!,p=residentMotion(id,frame),root=useRef<Group>(null);
 useLayoutEffect(()=>{root.current?.traverse(n=>{
  if(n instanceof Mesh){n.castShadow=true;n.receiveShadow=true;if(r.isLegacy&&n.parent?.position.y===1.08&&Math.abs(n.position.z-.2)<.0001)n.scale.y=frame%127<4?.14:1;}
  if(r.isLegacy&&n instanceof Group&&n.position.y===1.08)n.rotation.set(p.watch*.12,Math.sin(frame*.045)*p.watch*.15,0);
 });},[frame,p.watch,r.isLegacy]);
 if(!p.visible)return null;
 const pose={position:[p.position[0],p.position[1]+p.hop,p.position[2]] as const,heading:p.heading,walk:p.walk,wave:p.wave,pay:p.pay,watch:p.watch,
  scale:1,visible:true,seat:p.sit,lean:p.lean,clap:p.clap,carry:p.tool==='seedling'||p.tool==='seedbag'?1:0};
 return <group ref={root} name={`ep004-${id}`}>
  {r.isLegacy?<group position={[...pose.position]} rotation-y={p.heading}><group rotation-x={p.lean}>
   <Villager position={[0,0,0]} heading={0} walk={p.walk} stride={p.stride} shirt={r.visual.shirt} hair={r.visual.hair} pants={r.visual.pants} skin={r.visual.skin} scale={1.65} wave={p.wave}/>
  </group></group>:<ResidentActor resident={{id:r.id,visual:r.visual,isNewInEp003:true}} frame={frame} pose={pose} stride={p.stride}/>}
  <group position={[...pose.position]} rotation-y={p.heading}><Tool kind={p.tool} frame={frame}/>
   {id==='warga-7'&&<group position-y={2.17-.48*p.sit+.22*pulse(frame,GREEN_A.start+12,GREEN_A.start+40)}>
    <mesh><cylinderGeometry args={[.43,.43,.045,9]}/><meshStandardMaterial color="#cbb483"/></mesh>
    <mesh position-y={.12}><coneGeometry args={[.26,.24,8]}/><meshStandardMaterial color="#cbb483"/></mesh>
   </group>}
   {id==='warga-8'&&<mesh position={[0,2.12-.48*p.sit,0]}><sphereGeometry args={[.37,7,4,0,Math.PI*2,0,Math.PI*.45]}/><meshStandardMaterial color="#68764e"/></mesh>}
  </group>
 </group>;
};
export const Actors004:React.FC<{frame:number}>=({frame})=>{
 const comedy=inComedy(frame),sample=gobiSample(frame),g=sample.pose;
 return <>
  {comedy?<><PilotGobi frame={frame-COMEDY.start}/><PilotOktaa frame={frame-COMEDY.start}/></>:<PilotGobi frame={frame} sample={sample} voiceSpeaking={speechAt(frame)}/>}
  {CAST.filter(r=>!(comedy&&r.id==='warga-1')).map(r=><ProductionResident key={r.id} id={r.id} frame={frame}/>)}
  {!comedy&&frame<atVoice(2)+localWord(2,'Oke',true)&&<group position={[g.x,1.0+(g.hop??0),g.z]} rotation-y={g.rotY}><mesh position={[0,0,.45]} rotation-x={-.2}><boxGeometry args={[.28,.43,.035]}/><meshStandardMaterial color="#283b49"/></mesh></group>}
 </>;
};
