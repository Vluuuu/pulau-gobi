import React,{createContext,useContext,useEffect,useMemo} from 'react';
import {CanvasTexture} from 'three';
import {KOST} from './plan.ts';
const Construction=createContext(1);
const reveal=(p:number,a:number,b:number)=>{const t=Math.max(0,Math.min(1,(p-a)/(b-a)));return t===1?1:t*t*(3-2*t)+Math.sin(t*Math.PI)*.08;};
const Box:React.FC<{p:[number,number,number];s:[number,number,number];color:string;stage?:[number,number];rotation?:[number,number,number]}>=({p,s,color,stage,rotation})=>{
 const progress=useContext(Construction),k=stage?reveal(progress,...stage):1;if(k<=0)return null;
 return <mesh position={[p[0],p[1]-s[1]*(1-k)/2,p[2]]} rotation={rotation} scale-y={k} castShadow receiveShadow><boxGeometry args={s}/><meshStandardMaterial color={color} roughness={.88} flatShading/></mesh>;
};
const Label:React.FC<{text:string;position:[number,number,number];width:number;height:number}>=({text,position,width,height})=>{
 const map=useMemo(()=>{const c=document.createElement('canvas');c.width=512;c.height=128;const x=c.getContext('2d')!;
  x.fillStyle='#f6e5bf';x.fillRect(0,0,512,128);x.font='bold 72px Segoe UI';const fit=Math.min(72,72*472/Math.max(1,x.measureText(text).width));
  x.font=`bold ${fit}px Segoe UI`;x.fillStyle='#395a4a';x.textAlign='center';x.textBaseline='middle';x.fillText(text,256,66);return new CanvasTexture(c);},[text]);
 useEffect(()=>()=>map.dispose(),[map]);return <mesh position={position}><planeGeometry args={[width,height]}/><meshStandardMaterial map={map} roughness={1}/></mesh>;
};
/** Approved pilot silhouette, with optional staged production build and exterior access. */
export const KostProxy:React.FC<{progress?:number;frame?:number;enhanced?:boolean}>=({progress=1,frame=0,enhanced=false})=>{
 const roof=reveal(progress,.72,.84),decor=reveal(progress,.91,1);
 if(progress<=0)return null;
 return <Construction.Provider value={progress}><group position={[...KOST.position]} rotation-y={KOST.rotation} name="ep004-kost-six-rooms">
 <Box p={[0,.09,0]} s={[12,.18,6]} color="#8b8e81" stage={[0,.07]}/>
 {[0,1].flatMap(level=>[-3.8667,0,3.8667].map((x,i)=><Box key={`${level}-${i}`} p={[x,.2+level*2.8+1.4,0]} s={[3.8667,2.8,5.3]} color="#efd6a4" stage={[level*.32+.08+i*.025,level*.32+.23+i*.025]}/>))}
 {[0,1].flatMap(level=>[-3.7,0,3.7].map((x,i)=>{const y=.2+level*2.8,k=reveal(progress,.46+(level*3+i)*.022,.58+(level*3+i)*.022);if(k<=0)return null;
  return <group key={`${level}-${i}`} name={`kost-room-${level*3+i+1}`} position={[x,y,0]} scale={[k,k,1]}>
  <Box p={[0,.99,2.69]} s={[1.22,1.98,.13]} color="#5f8978"/>
  <Box p={[-.68,1.02,2.8]} s={[.11,2.15,.2]} color="#af774b"/><Box p={[.68,1.02,2.8]} s={[.11,2.15,.2]} color="#af774b"/>
  <Box p={[0,2.08,2.8]} s={[1.48,.13,.2]} color="#af774b"/>
  <Box p={[.39,1.03,2.8]} s={[.06,.12,.08]} color="#e9c16a"/>
  <Label text={String(level*3+i+1)} position={[0,2.34,2.81]} width={.48} height={.22}/>
  <Box p={[1.30,1.35,2.72]} s={[.65,.95,.1]} color="#83b6bd"/>
  <Box p={[1.30,1.35,2.8]} s={[.055,1,.08]} color="#f7e8cc"/>
 </group>;}))}
 <Box p={[0,2.95,3.13]} s={[11.85,.22,1.12]} color="#b88d5c" stage={[.35,.53]}/>
 {[-5.6,-1.9,1.9,5.6].map(x=><Box key={x} p={[x,1.55,3.54]} s={[.15,2.9,.15]} color="#98683f" stage={[.16,.32]}/>)}
 <Box p={[0,3.73,3.64]} s={[11.85,.13,.13]} color="#557761" stage={[.58,.69]}/>
 {Array.from({length:19},(_,i)=><Box key={i} p={[-5.55+i*.617,3.37,3.64]} s={[.06,.65,.06]} color="#7e9b7c" stage={[.55+i*.003,.66+i*.003]}/>)}
 <Box p={[0,.15,3.23]} s={[11.4,.12,1.06]} color="#b3ac93" stage={[.03,.1]}/>
 {roof>0&&<group position-y={1.6*(1-Math.min(1,roof))} rotation-z={progress<1?Math.sin(frame*.35)*(1-Math.min(1,roof))*.018:0}>
  {[-1,1].map(side=><mesh key={side} position={[0,6.12,side*1.62]} rotation-x={side*.23} castShadow receiveShadow><boxGeometry args={[12.7,.18,3.4]}/><meshStandardMaterial color="#b8664d" roughness={.9} flatShading/></mesh>)}
  <Box p={[0,5.76,3.28]} s={[12.8,.22,.16]} color="#80563c"/>
 </group>}
 {decor>0&&<group scale={[decor,decor,1]} position-y={(1-decor)*.4}><Label text="KOST · 6 KAMAR" position={[0,4.55,3.73]} width={3.6} height={.7}/></group>}
 {enhanced&&<>
  {Array.from({length:17},(_,i)=><Box key={i} p={[-10.2+i*.26,.09+i*.17,3.25]} s={[.3,.18,1.05]} color="#bd9c73" stage={[.53+i*.005,.66+i*.005]}/>)}
  <Box p={[-8.1,2.4,3.85]} s={[5.2,.12,.10]} rotation={[0,0,.59]} color="#7d644a" stage={[.63,.78]}/>
  {[-10.2,-8.8,-7.4,-6.0].map((x,i)=><Box key={x} p={[x,.55+i*.91,3.85]} s={[.09,1.0,.09]} color="#7d644a" stage={[.60+i*.01,.73+i*.01]}/>)}
  {[-4.8,4.8].map((x,i)=><group key={x}>
   <Box p={[x,.48,3.2]} s={[.45,.58,.45]} color="#b67b53" stage={[.87+i*.025,.94+i*.025]}/>
   <Box p={[x,.89,3.2]} s={[.6,.46,.6]} color="#61915d" stage={[.91+i*.02,.96+i*.02]}/>
   <Box p={[x,2.22,3.45]} s={[.25,.34,.25]} color="#efca82" stage={[.9+i*.02,.98+i*.02]}/>
  </group>)}
  <Box p={[-2.4,.52,3.25]} s={[1.7,.16,.52]} color="#9d784e" stage={[.89,.96]}/>
  <Box p={[2.2,.24,3.3]} s={[1.0,.38,.44]} color="#987754" stage={[.91,.98]}/>
 </>}
</group></Construction.Provider>;
};
