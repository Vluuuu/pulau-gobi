import React,{useEffect,useMemo} from 'react';
import {CanvasTexture,LinearFilter,Vector2} from 'three';
import type {} from '@react-three/fiber';
import type {V3} from '../direction/math.ts';
export const ResidentName:React.FC<{name:string;position:V3;opacity:number;zoom:number;special:boolean}>=({name,position,opacity,zoom,special})=>{
  const entry=useMemo(()=>{
    const c=document.createElement('canvas'),ctx=c.getContext('2d')!;ctx.font='600 58px Segoe UI';
    c.width=Math.ceil(ctx.measureText(name).width)+72;c.height=108;
    ctx.fillStyle='#fff9e9';ctx.beginPath();ctx.roundRect(4,4,c.width-8,100,40);ctx.fill();ctx.strokeStyle=special?'#d5aa53':'#6388a2';ctx.lineWidth=6;ctx.stroke();
    ctx.font='600 58px Segoe UI';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle='#283637';ctx.fillText(name,c.width/2,54);
    const texture=new CanvasTexture(c);texture.minFilter=LinearFilter;texture.generateMipmaps=false;return {texture,aspect:c.width/c.height};
  },[name,special]);
  useEffect(()=>()=>entry.texture.dispose(),[entry]);
  if(opacity<=0)return null;const height=66/zoom;
  return <sprite position={[position[0],position[1]+2.48,position[2]]} scale={[height*entry.aspect,height,1]} center={new Vector2(0.5,0.5)} renderOrder={8}>
    <spriteMaterial map={entry.texture} transparent opacity={opacity} depthTest={false} depthWrite={false}/>
  </sprite>;
};
