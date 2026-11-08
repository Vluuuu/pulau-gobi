import React,{useMemo} from 'react';
import {Parts} from '../../episode004/production/Parts';
import {part} from '../../episode004/production/part.ts';
import type {Part} from '../../episode004/production/part.ts';
import {FIRST_TREE,PATHS} from '../../episode004/production/layout.ts';
import {NATURE006,inSchool} from './landscaping.ts';
const greens=['#4e9c57','#609e4d','#438f61'];
export const Nature006:React.FC<{progress:number}>=({progress})=>{
  const parts=useMemo(()=>{
    const ps:Part[]=[];
    for(const p of NATURE006){const u=inSchool(p.fromX,p.fromZ,1)?1:progress,x=p.fromX+(p.x-p.fromX)*u,z=p.fromZ+(p.z-p.fromZ)*u,s=p.size;
      if(p.kind==='tree')ps.push(part(`trunk-${p.id}`,'#8a603b',[x,.9*s,z],[.22*s,1.8*s,.22*s],'cylinder'),part(`crown-${p.id}`,greens[p.variant],[x,2.1*s,z],[1.05*s,1.3*s,1.02*s],p.variant===1?'cone':'ico'),part(`top-${p.id}`,greens[(p.variant+1)%3],[x+.1*s,3.02*s,z],[.73*s,.87*s,.72*s],p.variant===1?'cone':'ico'));
      else if(p.kind==='bush')ps.push(part(`bush-${p.id}`,greens[p.variant],[x,.32*s,z],[.68*s,.45*s,.60*s],'ico'));
      else if(p.kind==='grass')for(let i=0;i<3;i++)ps.push(part(`grass-${p.id}-${i}`,'#649d51',[x+(i-1)*.08,.17*s,z],[.055*s,.34*s,.055*s],'cone',[0,0,(i-1)*.23]));
      else if(p.kind==='flower')ps.push(part(`stem-${p.id}`,'#57834b',[x,.20*s,z],[.025*s,.40*s,.025*s]),part(`petal-${p.id}`,['#e7b767','#da8f9e','#c5add6'][p.variant],[x,.42*s,z],[.13*s,.10*s,.13*s],'ico'));
      else ps.push(part(`pebble-${p.id}`,'#969b8c',[x,.08*s,z],[.22*s,.15*s,.25*s],'ico'));
    }
    ps.push(part('irtiza-first-trunk','#8a603b',[FIRST_TREE[0],.9,FIRST_TREE[2]],[.22,1.8,.22],'cylinder'),part('irtiza-first-crown','#589e58',[FIRST_TREE[0],2.15,FIRST_TREE[2]],[1.1,1.4,1.05],'ico'),part('irtiza-first-top','#71ad60',[FIRST_TREE[0],3.1,FIRST_TREE[2]],[.72,.83,.72],'ico'));
    return ps;
  },[progress]);
  const roads=useMemo(()=>PATHS.flatMap((path,k)=>path.slice(1).map((b,i)=>{const a=path[i];return part(`path-${k}-${i}`,'#c5b68d',[(a[0]+b[0])/2,.008,(a[2]+b[2])/2],[1.15,.012,Math.hypot(b[0]-a[0],b[2]-a[2])],'box',[0,Math.atan2(b[0]-a[0],b[2]-a[2]),0]);})),[]);
  return <group name="ep004-nature"><Parts parts={parts}/><Parts parts={roads}/></group>;
};
