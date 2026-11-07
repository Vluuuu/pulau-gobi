import {useLayoutEffect} from 'react';
import {useThree} from '@react-three/fiber';
import {Matrix4,Mesh,Object3D,Raycaster,Vector3} from 'three';
import {shotAt} from './shots.ts';
// Opt-in render inspection. No effect on production frames; never changes visibility or poses.
export const Diagnostics005=({frame}:{frame:number})=>{
 const {scene,camera}=useThree();
 useLayoutEffect(()=>{
  (window as unknown as {ep005Inspect:()=>unknown}).ep005Inspect=()=>{
   scene.updateMatrixWorld(true);camera.updateMatrixWorld(true);
   const actor=scene.getObjectByName('ep005-gobi');if(!actor)return {frame,missing:true};
   const own=new Set<Object3D>();actor.traverse(o=>own.add(o));scene.getObjectByName('ep005-gobi-props')?.traverse(o=>own.add(o));let head:Object3D|undefined;const hands:Object3D[]=[];
   actor.traverse(o=>{if(o instanceof Mesh&&Math.abs(o.position.z-.46)<.0001)head=o.parent!;
    if(o instanceof Mesh&&o.position.y===-.25&&Math.abs(o.parent!.position.x)===.46)hands.push(o.parent!);});
   const meshes:Mesh[]=[];scene.traverse(o=>{if(!(o instanceof Mesh)||own.has(o))return;let p:Object3D|null=o;while(p){if(!p.visible)return;p=p.parent;}const mats=Array.isArray(o.material)?o.material:[o.material];if(mats.every(m=>m.transparent&&m.opacity<.5))return;meshes.push(o);});
   const origin=camera.getWorldPosition(new Vector3()),forward=camera.getWorldDirection(new Vector3()),ray=new Raycaster(),blocked:string[]=[],screens:{x:number;y:number}[]=[];
   const check=(o:Object3D,p:Vector3)=>{
    const world=o.localToWorld(p.clone()),depth=world.clone().sub(origin).dot(forward);
    // The scene uses an orthographic camera: rays are parallel and start at the probe's
    // projected point on the camera plane, not at a single perspective-camera origin.
    ray.set(world.clone().addScaledVector(forward,-depth),forward);ray.far=Math.max(0,depth-.06);
    const hits=ray.intersectObjects(meshes,false);if(hits.length){const h=hits[0],ids=h.object.userData.partIds;let name=h.object.name,p=h.object.parent;while(!name&&p){name=p.name;p=p.parent;}blocked.push(ids&&h.instanceId!==undefined?ids[h.instanceId]:name||'mesh');}
    const ndc=world.clone().project(camera);screens.push({x:540+ndc.x*540,y:960-ndc.y*960});return hits.length===0;
   };
   let facePass=0,handPass=0;
   if(head)for(const x of [-.22,0,.22])for(const y of [-.16,.04,.22])if(check(head,new Vector3(x,y,.48)))facePass++;
   for(const h of hands)for(const y of [-.12,-.24,-.36,-.44,-.48])if(check(h,new Vector3(0,y,.11)))handPass++;
   const faceScreens=screens.slice(0,9),minY=Math.min(...faceScreens.map(p=>p.y)),maxY=Math.max(...faceScreens.map(p=>p.y));
   const front=head?new Vector3(0,0,1).transformDirection(head.matrixWorld).dot(origin.clone().sub(head.getWorldPosition(new Vector3())).normalize()):0;
   return {frame,shot:shotAt(frame).id,faceVisible:facePass/9,handsVisible:handPass/10,frontFacing:front,facePixels:maxY-minY,faceInFrame:faceScreens.every(p=>p.x>=30&&p.x<=1050&&p.y>=300&&p.y<=1380),blockers:[...new Set(blocked)],screens};
  };
 },[frame,scene,camera]);
 return null;
};
