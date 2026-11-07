import {OrthographicCamera,Vector3} from 'three';
import {cameraAt,gobiAt,oktaaAt,world,clamp,T} from './plan.ts';
import type {V3} from './plan.ts';
export function screen(point:V3,frame:number){const p=cameraAt(frame),c=new OrthographicCamera(-540,540,960,-960,.1,260);
 c.position.set(...p.position);c.zoom=p.zoom;c.lookAt(...p.target);c.updateProjectionMatrix();c.updateMatrixWorld(true);
 const v=new Vector3(...point).project(c);return {x:540+v.x*540,y:960-v.y*960};}
const limit=(v:number,a:number,b:number)=>Math.max(a,Math.min(b,v));
export function uiAt(frame:number){
 const n=oktaaAt(frame),g=gobiAt(frame),npc=screen(world([n.position[0],1.78+n.hop,n.position[2]]),frame);
 const head=screen(world([g.local[0],g.top,g.local[2]]),frame);
 return {npc,gobi:head,tag:{x:limit(npc.x-140,30,770),y:limit(npc.y-195,130,1260),width:280,height:48,visible:npc.x>0&&npc.x<1080},
  bubble:{x:limit(npc.x-620,80,440),y:limit(npc.y-510,180,560),width:560,height:170},
  emote:{x:limit(head.x-40,45,955),y:limit(head.y-135,140,1240)}};
}
