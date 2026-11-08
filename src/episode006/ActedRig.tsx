import React,{useLayoutEffect,useRef} from 'react';
import {Group,Mesh,BoxGeometry,Quaternion,Vector3} from 'three';
import type {Material} from 'three';
import type {V3} from '../world/ep006/layout.ts';
import type {Acting} from './performance.ts';
import {footCycle,solveLimb,lerp3} from './performance.ts';
type Bone={parent:Group;hinge:Group;hand?:Group;point?:Mesh;upper:number;lower:number;side:number;geometry:BoxGeometry[]};
const down=new Vector3(0,-1,0);
const orient=(a:V3,b:V3)=>new Quaternion().setFromUnitVectors(down,new Vector3(b[0]-a[0],b[1]-a[1],b[2]-a[2]).normalize());
const box=(size:V3,material:Material|Material[],position:V3,owned:BoxGeometry[])=>{const geo=new BoxGeometry(...size);owned.push(geo);const mesh=new Mesh(geo,material);mesh.position.set(...position);mesh.castShadow=true;mesh.receiveShadow=true;return mesh;};

/** Opt-in articulation of the ORIGINAL meshes. Facial design, palette and hair
 * stay with Gobi/ResidentActor; no source or rig of a published episode changes.
 * Bone lengths match the existing silhouette. All updates use the passed frame.
 */
export const ActedRig:React.FC<{children:React.ReactNode;frame:number;kind:'gobi'|'adult';acting:Acting;distance:number;speed:number;mouth?:number;rightTarget?:V3;chalk?:boolean;stepYaw?:number}>=({children,frame,kind,acting,distance,speed,mouth=0,rightTarget,chalk=false,stepYaw=0})=>{
 const ref=useRef<Group>(null),arms=useRef<Bone[]>([]),legs=useRef<Bone[]>([]),owned=useRef<Bone[]>([]);
 useLayoutEffect(()=>()=>{for(const b of owned.current){b.parent.remove(b.hinge);b.geometry.forEach(g=>g.dispose());}},[]);
 useLayoutEffect(()=>{
  const root=ref.current;if(!root)return;const gobi=kind==='gobi',sx=gobi?.46:.27,sy=gobi?.52:.81;
  if(!arms.current.length){const shoulders:Group[]=[],hips:Group[]=[];
   root.traverse(o=>{if(!(o instanceof Group))return;
    if(Math.abs(Math.abs(o.position.x)-sx)<.001&&Math.abs(o.position.y-sy)<.001)shoulders.push(o);
    if(Math.abs(Math.abs(o.position.x)-(gobi?.18:.10))<.001&&Math.abs(o.position.y-(gobi?0:.43))<.001)hips.push(o);
   });
   for(const parent of shoulders){
    const side=Math.sign(parent.position.x),geo:BoxGeometry[]=[],skin=parent.children.find(o=>o instanceof Mesh&&Math.abs(o.position.y-(gobi?-.25:-.27))<.01) as Mesh;
    if(!skin)continue;skin.visible=false;
    parent.children.filter(o=>o instanceof Group).forEach(o=>o.visible=false);
    const upper=gobi?.25:.20,lower=gobi?.26:.33,hinge=new Group();hinge.name='ep006-elbow';hinge.position.y=-upper;
    if(gobi)parent.add(box([.18,.25,.18],skin.material,[0,-.125,0],geo));
    hinge.add(box(gobi?[.17,.23,.17]:[.105,.30,.105],skin.material,[0,-lower/2,0],geo));
    const hand=new Group();hand.position.y=-lower;hand.add(box(gobi?[.21,.09,.20]:[.14,.075,.14],skin.material,[0,0,0],geo));
    const point=box(gobi?[.055,.16,.06]:[.03,.11,.04],skin.material,[0,-.105,.015],geo);hand.add(point);
    const chalkMesh=box([.025,.12,.025],skin.material,[0,-.11,0],geo);chalkMesh.name='ep006-chalk-tip';chalkMesh.visible=false;hand.add(chalkMesh);
    hinge.add(hand);parent.add(hinge);const bone={parent,hinge,hand,point,upper,lower,side,geometry:geo};arms.current.push(bone);owned.current.push(bone);
   }
   for(const parent of hips){const geo:BoxGeometry[]=[],meshes=parent.children.filter(o=>o instanceof Mesh) as Mesh[],shoe=meshes[meshes.length-1],pants=meshes[0];if(!shoe||!pants)continue;
    meshes.forEach(m=>m.visible=false);const upper=gobi?.25:.18,lower=gobi?.26:.20,hinge=new Group();hinge.name='ep006-knee';hinge.position.y=-upper;
    parent.add(box(gobi?[.28,.25,.3]:[.14,.18,.15],pants.material,[0,-upper/2,0],geo));
    hinge.add(box(gobi?[.2,.20,.2]:[.14,.20,.15],(gobi?meshes[1]:pants).material,[0,-lower/2,0],geo));
    hinge.add(box(gobi?[.26,.15,.4]:[.16,.10,.23],shoe.material,[0,-lower,.06],geo));parent.add(hinge);
    const bone={parent,hinge,upper,lower,side:Math.sign(parent.position.x),geometry:geo};legs.current.push(bone);owned.current.push(bone);
   }
  }
  if(!gobi)root.traverse(o=>{if(o instanceof Group&&o.children.some(c=>c instanceof Mesh&&Math.abs(c.position.y-.66)<.001)){o.position.y=-.06*Math.min(1,speed)+footCycle(distance,speed,-1,1).bob/1.65;o.rotation.z=acting.bodyRoll;}});
  root.updateWorldMatrix(true,true);
  for(const bone of arms.current){const {parent,hinge,upper,lower,side}=bone,shoulder=parent.position.toArray() as [number,number,number];
   let goal=side<0?acting.left:acting.right;
   if(!gobi)goal=[goal[0]*.57,goal[1]*.62+.28,goal[2]*.75];
   if(side>0&&rightTarget){const p=parent.parent!.worldToLocal(new Vector3(...rightTarget));goal=p.toArray() as [number,number,number];}
   if(!gobi&&acting.shock>0)goal=lerp3(goal,[side*.34,.72+(.12*side),.27],acting.shock);
   if(!gobi&&acting.wipe>0)goal=lerp3(goal,side>0?[.08,1.12,.28]:[-.17,.65,.27],acting.wipe);
   const ik=solveLimb(shoulder,goal,upper,lower,speed>.1?[0,0,1]:[side*.7,-.2,.3]),q=orient(shoulder,ik.joint),low=orient(ik.joint,ik.tip);
   parent.quaternion.copy(q);hinge.quaternion.copy(q.clone().invert().multiply(low));
   if(bone.point)bone.point.visible=side>0&&acting.point&&!chalk;
   const c=bone.hand?.getObjectByName('ep006-chalk-tip');if(c)c.visible=side>0&&chalk;
  }
  for(const bone of legs.current){const {parent,hinge,side,upper,lower}=bone,scale=gobi?1:1.65,cycle=footCycle(distance,speed,side,gobi?.70:1.0);
   if(!gobi)parent.position.y=.43-(Math.min(1,speed)*.06)+cycle.bob/scale;
   const hipY=gobi?.58-Math.min(1,speed)*.05+cycle.bob:parent.position.y;
   if(gobi&&parent.parent)parent.parent.position.y=hipY;
   const goal:V3=[Math.sin(stepYaw)*cycle.z/scale,(gobi?.075:.05)-hipY+cycle.lift/scale,Math.cos(stepYaw)*cycle.z/scale],ik=solveLimb([0,0,0],goal,upper,lower,[0,0,1]),q=orient([0,0,0],ik.joint);
   parent.quaternion.copy(q);hinge.quaternion.copy(q.clone().invert().multiply(orient(ik.joint,ik.tip)));
  }
  root.traverse(o=>{if(!(o instanceof Mesh))return;
   if(gobi&&Math.abs(o.position.z-.47)<.001)o.scale.y=.28+mouth*1.55+acting.shock*.4;
   if(!gobi&&Math.abs(o.position.z-.215)<.001&&Math.abs(o.position.y+.09)<.001)o.scale.y=.65+mouth*.8+acting.shock*3;
   if(!gobi&&Math.abs(o.position.z-.214)<.001)o.scale.y=1+acting.shock*.75;
  });
 },[frame,kind,acting,distance,speed,mouth,rightTarget,chalk,stepYaw]);
 return <group ref={ref}>{children}</group>;
};
