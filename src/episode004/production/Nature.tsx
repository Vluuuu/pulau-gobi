import React,{useMemo} from 'react';
import {NATURE,growthAt} from './natureModel.ts';
import {Parts} from './Parts';
import {part} from './part.ts';
import type {Part} from './part.ts';
import {FIRST_TREE,PATHS} from './layout.ts';
import {GREEN_A,ramp,atVoice} from './timeline.ts';
const greens=['#4e9c57','#609e4d','#438f61'];
export const Nature004:React.FC<{frame:number}>=({frame})=>{
 const parts=useMemo(()=>{
  const parts:Part[]=[];
  for(const p of NATURE){const k=growthAt(p,frame),s=p.size*k;if(k<=0)continue;
   const sway=Math.sin(frame*.04+p.id)*.018*k;
   if(p.kind==='tree'){
    parts.push(part(`trunk-${p.id}`,'#8a603b',[p.x,.9*s,p.z],[.22*s,1.8*s,.22*s],'cylinder'));
    parts.push(part(`crown-${p.id}`,greens[p.variant],[p.x,2.1*s,p.z],[1.05*s,1.3*s,1.02*s],p.variant===1?'cone':'ico',[sway,p.id,0]));
    parts.push(part(`top-${p.id}`,greens[(p.variant+1)%3],[p.x+.1*s,3.02*s,p.z],[.73*s,.87*s,.73*s],p.variant===1?'cone':'ico',[sway,p.id+1,0]));
   }else if(p.kind==='bush')parts.push(part(`bush-${p.id}`,greens[p.variant],[p.x,.32*s,p.z],[.68*s,.45*s,.60*s],'ico'));
   else if(p.kind==='grass')for(let i=0;i<3;i++)parts.push(part(`grass-${p.id}-${i}`,'#649d51',[p.x+(i-1)*.08,.17*s,p.z],[.055*s,.34*s,.055*s],'cone',[sway,0,(i-1)*.23]));
   else if(p.kind==='flower'){
    parts.push(part(`stem-${p.id}`,'#57834b',[p.x,.20*s,p.z],[.025*s,.40*s,.025*s]));
    parts.push(part(`petal-${p.id}`,['#e7b767','#da8f9e','#c5add6'][p.variant],[p.x,.42*s,p.z],[.13*s,.10*s,.13*s],'ico'));
   }else parts.push(part(`pebble-${p.id}`,'#969b8c',[p.x,.08*s,p.z],[.22*s,.15*s,.25*s],'ico'));
  }
  const seed=.06+.94*ramp(frame,GREEN_A.start+9,GREEN_A.start+26),overshoot=frame<GREEN_A.start+26?Math.sin(Math.PI*ramp(frame,GREEN_A.start+9,GREEN_A.start+26))*.1:0,s=seed+overshoot;
  if(frame>=atVoice(3)+75){
   parts.push(part('irtiza-first-trunk','#8a603b',[FIRST_TREE[0],s*.9,FIRST_TREE[2]],[.22*s,1.8*s,.22*s],'cylinder'));
   parts.push(part('irtiza-first-crown','#589e58',[FIRST_TREE[0],2.15*s,FIRST_TREE[2]],[1.1*s,1.4*s,1.05*s],'ico'));
   parts.push(part('irtiza-first-top','#71ad60',[FIRST_TREE[0],3.1*s,FIRST_TREE[2]],[.72*s,.83*s,.72*s],'ico'));
  }
  return parts;
 },[frame]);
 const road=useMemo(()=>PATHS.flatMap((path,k)=>path.slice(1).map((b,i)=>{const a=path[i],dx=b[0]-a[0],dz=b[2]-a[2];return part(`path-${k}-${i}`,'#c5b68d',[(a[0]+b[0])/2,.008,(a[2]+b[2])/2],[1.15,.012,Math.hypot(dx,dz)],'box',[0,Math.atan2(dx,dz),0]);})),[]);
 return <group name="ep004-nature"><Parts parts={parts}/>{frame>=atVoice(4)&&<Parts parts={road}/>}</group>;
};
