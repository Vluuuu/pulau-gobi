import React from 'react';
import {ResidentActor} from '../episode003/characters/ResidentActor';
import {PilotGobi} from '../episode004/pilot/Actors';
import {Parts} from '../episode004/production/Parts';
import {part} from '../episode004/production/part.ts';
import {CAST,COW_IDS,cowAt,gobiAt,residentAt,schoolInterior,FIRST_APPEARANCE} from './direction.ts';
import {cameraAt} from './camera.ts';
import {gap,masterAt,pulse,editFrame as E} from './timeline.ts';
import {shotAt} from './shots.ts';
const Cow:React.FC<{id:string;frame:number}>=({id,frame:f})=>{
 const p=cowAt(id,f),i=COW_IDS.indexOf(id as typeof COW_IDS[number]);if(!p.visible)return null;
 const blink=(f+i*39)%137<5,chew=Math.sin(f*.21+i)*.025,inside=p.position[2]<-18.95&&p.position[0]<-16&&f>=gap('G5').start&&f<E(103.1);
 return <group name={id} position={[p.position[0],p.position[1]+(inside?.39:0),p.position[2]]} rotation-y={p.heading}>
  <mesh rotation-x={-Math.PI/2} position-y={.02}><circleGeometry args={[.83,12]}/><meshBasicMaterial color="#30452d" transparent opacity={.18} depthWrite={false}/></mesh>
  <group position-y={Math.abs(Math.sin(p.stride))*p.walk*.045}>
   <mesh position={[0,1.14,-.1]} scale={[.58,.60,1.02]}><icosahedronGeometry args={[1,1]}/><meshStandardMaterial color={i===1?'#d9b993':'#f0ead9'} flatShading/></mesh>
   {[-1,1].map(side=><mesh key={side} position={[side*.48,1.28,i===2?.15:-.35]} scale={[.15,.37,i===2?.61:.39]} rotation-z={side*.2}><icosahedronGeometry args={[1,0]}/><meshStandardMaterial color={i===2?'#263b40':'#75604b'} flatShading/></mesh>)}
   {[-1,1].flatMap(side=>[-1,1].map(end=><group key={`${side}${end}`} position={[side*.36,.91,end*.61-.13]} rotation-x={Math.sin(p.stride+(side===end?0:Math.PI))*.55*p.walk}>
    <mesh position-y={-.32}><cylinderGeometry args={[.105,.09,.64,6]}/><meshStandardMaterial color="#e7ddc9"/></mesh>
    <mesh position={[0,-.66,.035]}><boxGeometry args={[.22,.17,.28]}/><meshStandardMaterial color="#485350"/></mesh>
   </group>))}
   <group position={[0,1.52,.72]} rotation={[-p.noseLift*.35+Math.sin(f*.035+i)*.04,(inside?1.7:0)+Math.sin(f*.027+i)*.10,0]}>
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
const Prop:React.FC<{id:string;frame:number}>=({id,frame:f})=>{
 const s=shotAt(f);
 if(id==='warga-10')return <>
  <mesh position={[0,1.13,-.27]} rotation-x={.12+Math.sin(f*.13)*.12} scale={[.49,.65,.1]}><coneGeometry args={[1,1,5]}/><meshStandardMaterial color="#3a7855" flatShading/></mesh>
  <mesh position={[.18,2.18,.02]} rotation-z={-.3}><boxGeometry args={[.30,.14,.21]}/><meshStandardMaterial color="#d0ac52"/></mesh>
  <mesh position={[.22,2.27,.08]}><icosahedronGeometry args={[.09,0]}/><meshStandardMaterial color="#80cba0"/></mesh>
  {f<FIRST_APPEARANCE[id]+70&&Array.from({length:8},(_,i)=><mesh key={i} position={[Math.sin(i*2+f*.06)*.8,1.2+Math.cos(i*2+f*.06)*.7,Math.cos(i*2+f*.06)*.8]}><octahedronGeometry args={[.045]}/><meshBasicMaterial color={i%2?'#e9c76d':'#7ee1b0'}/></mesh>)}
 </>;
 if(id==='warga-11')return <><mesh position={[-.38,1.3,.28]} rotation-z={.2}><boxGeometry args={[.48,.65,.12]}/><meshStandardMaterial color="#8c77b0"/></mesh><mesh position={[.48,1.20,.34]} rotation-z={s.id==='S24'?Math.sin(f*.3)*.3:-.4}><boxGeometry args={[.08,.85,.06]}/><meshStandardMaterial color="#dfc38a"/></mesh></>;
 if(id==='warga-8')return <group position={[.45,.95,.3]} rotation-z={-.35+Math.sin(f*.3)*.12}><Parts parts={[part('hoe-handle','#b48954',[0,0,0],[.06,1.4,.06],'cylinder'),part('hoe-blade','#91a19a',[.1,.65,0],[.4,.09,.24])]}/></group>;
 if(id==='warga-7')return <group position={[.55,.8,.3]} rotation-z={-.3}><Parts parts={[part('watering-can','#729b97',[0,0,0],[.22,.4,.22],'cylinder'),part('watering-spout','#729b97',[.3,.1,0],[.45,.08,.08],'box',[0,0,.3])]}/>{s.id==='S12a'||s.id==='S12b'?Array.from({length:5},(_,i)=><mesh key={i} position={[.6+i*.07,-((f*.06+i*.15)%1),0]}><sphereGeometry args={[.035,5,4]}/><meshBasicMaterial color="#9ad9d8"/></mesh>):null}</group>;
 if(['warga-4','warga-5'].includes(id)&&['S19','S20'].includes(s.id))return <mesh position={[0,1,.45]}><boxGeometry args={[2.3,.16,.16]}/><meshStandardMaterial color="#b38c5d"/></mesh>;
 if(id==='warga-3'&&s.id==='S13b')return <mesh position={[.35,.85,.40]} scale={[.25,.38,.25]}><icosahedronGeometry args={[1,1]}/><meshStandardMaterial color="#e2c792"/></mesh>;
 if(id==='warga-12'&&['S11','S13a'].includes(s.id))return <mesh position={[0,.75,.50]}><cylinderGeometry args={[.32,.24,.35,8]}/><meshStandardMaterial color="#bc925f"/></mesh>;
 return null;
};
export const Actors005:React.FC<{frame:number}>=({frame:f})=>{
 const g=gobiAt(f),cam=cameraAt(f),inside=schoolInterior(f);
 // Speech facing follows the selected static camera, while walking follows the route tangent.
 const sample={...g,local:g.position,pose:{...g.pose,rotY:g.pose.walk?g.pose.rotY:cam.az*Math.PI/180}};
 return <group name="ep005-cast">
  <group position-y={inside?.39:0} name="ep005-gobi"><PilotGobi frame={f} sample={sample} voiceSpeaking={masterAt(f)!==null}/></group>
  {['S11','S12a','S13a'].includes(g.shot.id)&&<group position={[g.pose.x,.92+(g.pose.hop??0),g.pose.z]} rotation-y={sample.pose.rotY}>
   {g.shot.id==='S12a'?<Parts parts={[part('gobi-corn-seedbag','#dfc483',[-.30,.08,.49],[.25,.40,.24],'ico'),part('gobi-carrot-seedbag','#d89e71',[.30,.08,.49],[.25,.40,.24],'ico')]} />:<Parts parts={[part('gobi-harvest-basket','#b68b57',[0,0,.51],[.40,.36,.35],'cylinder'),part('gobi-basket-rice','#e2c171',[0,.23,.51],[.37,.17,.32],'ico')]}/>}
  </group>}
  {CAST.map(r=>{const p=residentAt(r.id,f);return p.visible?<group key={r.id} name={`ep005-${r.id}`}>
   <ResidentActor resident={{id:r.id,visual:r.visual,isNewInEp003:!r.isLegacy}} frame={f} pose={{...p,position:[p.position[0],p.position[1]+(inside&&p.position[2]<-18.95?.39:0),p.position[2]]}} stride={p.stride}/>
   <group position={[p.position[0],p.position[1]+(inside&&p.position[2]<-18.95?.39:0),p.position[2]]} rotation-y={p.heading}><Prop id={r.id} frame={f}/></group>
  </group>:null;})}
  {COW_IDS.map(id=><Cow key={id} id={id} frame={f}/>)}
 </group>;
};
