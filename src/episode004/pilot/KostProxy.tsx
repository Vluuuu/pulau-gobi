import React,{useEffect,useMemo} from 'react';
import {CanvasTexture} from 'three';
import {KOST} from './plan.ts';
const Box:React.FC<{p:[number,number,number];s:[number,number,number];color:string}>=({p,s,color})=><mesh position={p} castShadow receiveShadow><boxGeometry args={s}/><meshStandardMaterial color={color} roughness={.88} flatShading/></mesh>;
const Label:React.FC<{text:string;position:[number,number,number];width:number;height:number}>=({text,position,width,height})=>{
 const map=useMemo(()=>{const c=document.createElement('canvas');c.width=512;c.height=128;const x=c.getContext('2d')!;
  x.fillStyle='#f6e5bf';x.fillRect(0,0,512,128);x.font='bold 72px Segoe UI';const fit=Math.min(72,72*472/Math.max(1,x.measureText(text).width));
  x.font=`bold ${fit}px Segoe UI`;x.fillStyle='#395a4a';x.textAlign='center';x.textBaseline='middle';x.fillText(text,256,66);return new CanvasTexture(c);},[text]);
 useEffect(()=>()=>map.dispose(),[map]);return <mesh position={position}><planeGeometry args={[width,height]}/><meshStandardMaterial map={map} roughness={1}/></mesh>;
};
/** Static pilot proxy only: six doors, not the EP004 construction system. */
export const KostProxy:React.FC=()=> <group position={[...KOST.position]} rotation-y={KOST.rotation} name="ep004-kost-proxy-six-rooms">
 <Box p={[0,.09,0]} s={[12,.18,6]} color="#8b8e81"/>
 <Box p={[0,2.98,0]} s={[11.6,5.6,5.3]} color="#efd6a4"/>
 {[0,1].flatMap(level=>[-3.7,0,3.7].map((x,i)=>{const y=.2+level*2.8;return <group key={`${level}-${i}`} name={`kost-room-${level*3+i+1}`}>
  <Box p={[x,y+.99,2.69]} s={[1.22,1.98,.13]} color="#5f8978"/>
  <Box p={[x-.68,y+1.02,2.8]} s={[.11,2.15,.2]} color="#af774b"/><Box p={[x+.68,y+1.02,2.8]} s={[.11,2.15,.2]} color="#af774b"/>
  <Box p={[x,y+2.08,2.8]} s={[1.48,.13,.2]} color="#af774b"/>
  <Box p={[x+.39,y+1.03,2.8]} s={[.06,.12,.08]} color="#e9c16a"/>
  <Label text={String(level*3+i+1)} position={[x,y+2.34,2.81]} width={.48} height={.22}/>
  <Box p={[x+1.30,y+1.35,2.72]} s={[.65,.95,.1]} color="#83b6bd"/>
  <Box p={[x+1.30,y+1.35,2.8]} s={[.055,1,.08]} color="#f7e8cc"/>
 </group>;}))}
 <Box p={[0,2.95,3.13]} s={[11.85,.22,1.12]} color="#b88d5c"/>
 {[-5.6,-1.9,1.9,5.6].map(x=><Box key={x} p={[x,1.55,3.54]} s={[.15,2.9,.15]} color="#98683f"/>)}
 <Box p={[0,3.73,3.64]} s={[11.85,.13,.13]} color="#557761"/>
 {Array.from({length:19},(_,i)=><Box key={i} p={[-5.55+i*.617,3.37,3.64]} s={[.06,.65,.06]} color="#7e9b7c"/>)}
 <Box p={[0,.15,3.23]} s={[11.4,.12,1.06]} color="#b3ac93"/>
 {[-1,1].map(side=><mesh key={side} position={[0,6.12,side*1.62]} rotation-x={side*.23} castShadow receiveShadow><boxGeometry args={[12.7,.18,3.4]}/><meshStandardMaterial color="#b8664d" roughness={.9} flatShading/></mesh>)}
 <Box p={[0,5.76,3.28]} s={[12.8,.22,.16]} color="#80563c"/>
 <Label text="KOST · 6 KAMAR" position={[0,4.55,3.73]} width={3.6} height={.7}/>
</group>;
