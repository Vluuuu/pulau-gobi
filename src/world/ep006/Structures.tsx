import React,{useMemo,useEffect} from 'react';
import {CanvasTexture} from 'three';
import {Parts} from '../../episode004/production/Parts';
import {part} from '../../episode004/production/part.ts';
import {BRIDGE,OBSERVATION,CROSSING,FIELD_PATH} from './layout.ts';
import type {V3} from './layout.ts';

export function bridgeParts(progress:number){
  const p=Math.max(0,Math.min(1,progress)),length=BRIDGE.oldLength+(BRIDGE.length-BRIDGE.oldLength)*p,width=1.25+.55*p;
  const parts=[part('retained-main-beam-left','#735236',[-width*.34,.10,0],[.13,.20,length]),part('retained-main-beam-right','#735236',[width*.34,.10,0],[.13,.20,length])];
  for(let i=0;i<30;i++){const z=-BRIDGE.length/2+(i+.5)*BRIDGE.length/30;if(Math.abs(z)>length/2)continue;
    const top=Math.abs(z)>3.3?.27*(1-(Math.abs(z)-3.3)/.6):.27;
    parts.push(part(`deck-plank-${i}`,'#b88f59',[0,top-.07,z],[width,.14,BRIDGE.length/30-.018]));}
  for(const side of [-1,1])for(const end of [-1,1])parts.push(part(`abutment-${side}-${end}`,'#898b79',[side*.55,-.12,end*(length/2-.35)],[.38,.65,.54],'ico'));
  if(p>.28)for(const side of [-1,1]){
    for(let j=0;j<7;j++){const t=.28+j*.075;if(p<t)continue;parts.push(part(`rail-post-${side}-${j}`,'#806044',[side*(width/2-.07),.67,-3.1+j*1.03],[.10,.9,.10]));}
    if(p>.85)for(const y of [.68,1.05])parts.push(part(`rail-beam-${side}-${y}`,'#c2a06b',[side*(width/2-.07),y,0],[.09,.09,6.35]));
  }
  return parts;
}
export const Bridge006:React.FC<{progress:number}>=({progress})=>{
  const parts=useMemo(()=>bridgeParts(progress),[progress]);
  return <group name="bridge-001" position={[...BRIDGE.center]} rotation-y={BRIDGE.angle}><Parts parts={parts}/></group>;
};
export const Walkway006:React.FC<{visible:boolean}>=({visible})=>{
  const parts=useMemo(()=>[FIELD_PATH,CROSSING.slice(3)].flatMap((path,k)=>path.slice(1).map((b,i)=>{
    const a=path[i];return part(`field-walkway-${k}-${i}`,'#c5b68c',[(a[0]+b[0])/2,.014,(a[2]+b[2])/2],[1.55,.026,Math.hypot(b[0]-a[0],b[2]-a[2])],'box',[0,Math.atan2(b[0]-a[0],b[2]-a[2]),0]);})),[]);
  return visible?<group name="nature-walkway-006"><Parts parts={parts}/></group>:null;
};
export const WorldLabel:React.FC<{text:string;position:V3;width:number;height:number}>=({text,position,width,height})=>{
  const texture=useMemo(()=>{const c=document.createElement('canvas');c.width=1024;c.height=256;const ctx=c.getContext('2d')!;ctx.fillStyle='#31564d';ctx.fillRect(0,0,1024,256);ctx.fillStyle='#f3ebd3';ctx.textAlign='center';ctx.textBaseline='middle';ctx.font='bold 74px Arial';ctx.fillText(text,512,128,950);return new CanvasTexture(c);},[text]);
  useEffect(()=>()=>texture.dispose(),[texture]);
  return <mesh position={[...position]}><planeGeometry args={[width,height]}/><meshStandardMaterial map={texture}/></mesh>;
};
export const Observation006:React.FC<{progress:number}>=({progress})=>{
  const parts=useMemo(()=>{
    const ps=[part('deck-base','#977d53',[0,.08,0],[OBSERVATION.width,.16,OBSERVATION.depth])];
    for(let i=0;i<15;i++)ps.push(part(`deck-top-${i}`,'#baa274',[0,.135,-2.45+(i+.5)*4.9/15],[3.1,.05,.30]));
    for(const x of [-1.5,1.5]){for(const z of [-2.3,-1.15,0,1.15,2.3])ps.push(part(`observation-post-${x}-${z}`,'#7c7051',[x,.60,z],[.09,1.0,.09]));ps.push(part(`observation-rail-${x}`,'#baa274',[x,1.05,0],[.09,.09,4.8]));}
    ps.push(part('end-rail','#baa274',[0,1.05,2.4],[3,.09,.09]));return ps;
  },[]);
  if(progress<=0)return null;
  return <group name="river-observation-006" position={[OBSERVATION.center[0],0,OBSERVATION.center[2]]} scale-y={progress}>
    <Parts parts={parts}/><WorldLabel text="AMATI IKAN • JAGA SUNGAI" position={[0,1.38,2.35]} width={2.6} height={.42}/>
  </group>;
};
