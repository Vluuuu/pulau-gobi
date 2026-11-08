import React from 'react';
import {Quaternion,Vector3} from 'three';
import {ResidentActor} from '../episode003/characters/ResidentActor';
import {PilotGobi} from '../episode004/pilot/Actors';
import {RESIDENTS,STUDENTS,COWS} from '../world/ep006/roster.ts';
import {SEATS} from '../world/ep006/layout.ts';
import type {V3} from '../world/ep006/layout.ts';
import {studentAt,adultAt,gobiAt} from './direction.ts';
import {Cow006} from './Cow';
import {ActedRig} from './ActedRig';
import {footCycle,solveLimb,gestureAt,lerp3,angleDelta} from './performance.ts';
import {VOICE_ENVELOPE} from './audioPerformance.ts';
import {splashAt} from '../world/ep006/waterModel.ts';

const Bone:React.FC<{a:V3;b:V3;width:number;depth:number;color:string}>=({a,b,width,depth,color})=>{
 const delta=new Vector3(b[0]-a[0],b[1]-a[1],b[2]-a[2]),q=new Quaternion().setFromUnitVectors(new Vector3(0,1,0),delta.clone().normalize());
 return <mesh position={[(a[0]+b[0])/2,(a[1]+b[1])/2,(a[2]+b[2])/2]} quaternion={q} castShadow receiveShadow><boxGeometry args={[width,Math.max(.001,delta.length()),depth]}/><meshStandardMaterial color={color} flatShading/></mesh>;
};
const Student006:React.FC<{index:number;frame:number;snapshot:boolean}>=({index:i,frame:f,snapshot})=>{
 const r=STUDENTS[i],p=studentAt(i,f,snapshot),v=r.visual,seat=p.seat,walk=Math.min(1,p.speed),cycle=footCycle(p.distance,p.speed,-1,.72),hip=.72-.15*seat-.06*walk*(1-seat)+cycle.bob*(1-seat),blink=(f+v.seed)%137<4;
 const writing=p.activity==='write'||p.activity==='note',reading=p.activity==='read',bodyY=hip+.03;
 const idleL:V3=[-.25,-.09,.04],idleR:V3=[.25,-.09,.04];let left=idleL,right=idleR;
 if(writing){const stroke=p.action*(.5+.5*Math.sin(f*.60+i*2));right=[.17+stroke*.028,.38,.34+Math.sin(f*.43+i)*.015];left=[-.16,.34,.31];}
 if(reading){left=[-.16,.36,.28];right=[.16,.36,.28];}
 if(p.activity==='raise')right=lerp3(idleR,[.22,.82,.14],p.action);
 if(p.activity==='point')right=[.26,.25,.43];
 if(p.speed>.1){left=[-.25,-.04,Math.sin(p.stride)*.13];right=[.25,-.04,-Math.sin(p.stride)*.13];}
 if(p.react>.01){left=lerp3(left,[-.38,.48,.25],p.react);right=lerp3(right,[.38,.52,.25],p.react);}
 return <group name={`resident-${r.id}`} position={[...p.position]} rotation-y={p.heading}>
  <mesh rotation-x={-Math.PI/2} position-y={.012}><circleGeometry args={[.30,12]}/><meshBasicMaterial color="#30452d" transparent opacity={.16} depthWrite={false}/></mesh>
  {[-1,1].map(side=>{const foot=footCycle(p.distance,p.speed,side,.72),root:V3=[side*.10,hip,0],goal:V3=[side*.10,.075+foot.lift*(1-seat)+.1525*seat,foot.z*(1-seat)+.30*seat],ik=solveLimb(root,goal,.30,.34,[0,0,1]);return <React.Fragment key={`leg${side}`}>
   <Bone a={root} b={ik.joint} width={.14} depth={.15} color={v.pants}/><Bone a={ik.joint} b={ik.tip} width={.115} depth={.12} color={v.pants}/>
   <mesh position={[ik.tip[0],ik.tip[1],ik.tip[2]+.035]} castShadow><boxGeometry args={[.16,.10,.23]}/><meshStandardMaterial color="#e9dfc8"/></mesh>
  </React.Fragment>;})}
  <group position={[cycle.sway*(1-seat),bodyY,0]} rotation={[p.lean,0,-cycle.sway*.7*(1-seat)]}>
   <mesh position={[0,.22,0]} castShadow><boxGeometry args={[.36,.44,.14]}/><meshStandardMaterial color={v.shirt} flatShading/></mesh>
   {seat<.5&&<mesh position={[0,.24,-.14]} castShadow><boxGeometry args={[.29,.31,.13]}/><meshStandardMaterial color={i%2?'#b38b65':'#627e98'}/></mesh>}
   <group position={[0,.65,0]} rotation={[p.headPitch,p.headYaw,p.react*.10]}>
    <mesh castShadow><icosahedronGeometry args={[.22,1]}/><meshStandardMaterial color={v.skin} flatShading/></mesh>
    <mesh position={[0,.035,-.02]}><sphereGeometry args={[.235,8,5,0,Math.PI*2,0,Math.PI*.55]}/><meshStandardMaterial color={v.hair}/></mesh>
    {v.hairStyle===1&&<mesh position={[-.05,.15,.12]} rotation-z={.2}><boxGeometry args={[.26,.08,.12]}/><meshStandardMaterial color={v.hair}/></mesh>}
    {v.hairStyle===2&&<mesh position={[0,.03,-.21]}><sphereGeometry args={[.12,6,5]}/><meshStandardMaterial color={v.hair}/></mesh>}
    {v.hairStyle===3&&<mesh position={[.1,.17,-.06]}><icosahedronGeometry args={[.12,0]}/><meshStandardMaterial color={v.hair}/></mesh>}
    {[-1,1].map(side=><mesh key={side} position={[side*.078,.01,.205]} scale-y={blink?.1:1+p.react*.5}><sphereGeometry args={[.025,6,4]}/><meshBasicMaterial color="#1b2630"/></mesh>)}
    <mesh position={[0,-.08,.204]} scale={[1+p.happy*.5,1+p.react*1.8,1]}><boxGeometry args={[.065,.025,.018]}/><meshBasicMaterial color="#995d52"/></mesh>
   </group>
   {[-1,1].map(side=>{const root:V3=[side*.235,.38,0],goal=side<0?left:right,ik=solveLimb(root,goal,.22,.28,[side*.6,-.4,.3]);return <React.Fragment key={`arm${side}`}>
    <Bone a={root} b={ik.joint} width={.12} depth={.14} color={v.shirt}/><Bone a={ik.joint} b={ik.tip} width={.10} depth={.10} color={v.skin}/>
    <group position={[...ik.tip]}><mesh><boxGeometry args={[.12,.075,.12]}/><meshStandardMaterial color={v.skin}/></mesh>
     {writing&&side===1&&<mesh position={[0,-.03,.03]} rotation-z={.17}><cylinderGeometry args={[.012,.012,.20,5]}/><meshStandardMaterial color="#d7b157"/></mesh>}
    </group>
   </React.Fragment>;})}
   {(reading||p.activity==='note')&&<group position={[0,.30,.31]} rotation-x={-.35}><mesh><boxGeometry args={[.37,.03,.25]}/><meshStandardMaterial color="#aa8761"/></mesh><mesh position-y={.021}><boxGeometry args={[.34,.012,.23]}/><meshStandardMaterial color="#f0e5cb"/></mesh><mesh position-y={.03}><boxGeometry args={[.014,.012,.23]}/><meshStandardMaterial color="#bbaa8c"/></mesh></group>}
  </group>
 </group>;
};
const WetPrincipal:React.FC<{frame:number;pose:ReturnType<typeof adultAt>;roll:number}>=({frame,pose:p,roll})=>{
 const wet=splashAt(frame).drip;if(wet<=0)return null;
 return <group position={[...p.position]} rotation-y={p.heading} scale={1.65}><group rotation={[p.lean??0,0,roll]}><group position={[0,1.08,0]} rotation={[p.headPitch??0,p.headYaw??0,0]}>
  <mesh position={[.10,-.06,.234]} scale={[.08,.055,.010]}><icosahedronGeometry args={[1,1]}/><meshBasicMaterial color="#a0d6e5" transparent opacity={wet*.65}/></mesh>
  {[0,1,2].map(i=>{const t=((frame+i*7)%23)/23;return <mesh key={i} position={[.09+(i-1)*.07,-.08-t*.43,.24]} scale={[.018,.026+.035*t,.014]}><icosahedronGeometry args={[1,0]}/><meshBasicMaterial color="#d6f6ff" transparent opacity={wet*(1-t)}/></mesh>;})}
 </group></group>
 </group>;
};
export const Actors006:React.FC<{frame:number;snapshot?:boolean}>=({frame:f,snapshot=false})=>{
 const g=gobiAt(f),mouth=snapshot?0:(VOICE_ENVELOPE[Math.min(f,VOICE_ENVELOPE.length-1)]??0),act={...g.act};
 if(g.motion.speed>.1){act.left=[-.48,.04,Math.sin(g.pose.phase??0)*.13];act.right=[.48,.04,-Math.sin(g.pose.phase??0)*.13];}
 return <group name="ep006-cast">
  <group position-y={g.position[1]}><ActedRig frame={f} kind="gobi" acting={act} distance={g.motion.distance} speed={g.motion.speed} mouth={mouth} rightTarget={act.point?g.target:undefined}><PilotGobi frame={f} sample={g} voiceSpeaking={mouth>.05}/></ActedRig></group>
  {STUDENTS.map((r,i)=><Student006 key={r.id} index={i} frame={f} snapshot={snapshot}/>)}
  {RESIDENTS.filter(r=>!STUDENTS.some(s=>s.id===r.id)).map(r=>{
   const p=adultAt(r.id,f,snapshot),actor=<ResidentActor resident={{id:r.id,visual:r.visual,isNewInEp003:!r.isLegacy}} pose={p} stride={p.stride} frame={f}/>;
   if(r.id!=='warga-11'&&r.id!=='warga-21')return <React.Fragment key={r.id}>{actor}</React.Fragment>;
   const a={...gestureAt(p.kind==='formal'?'formal':'present',f,r.id==='warga-11'?1200:0,r.visual.seed),shock:p.react,wipe:p.wipe};
   return <React.Fragment key={r.id}><ActedRig frame={f} kind="adult" acting={a} distance={p.distance} speed={p.speed} mouth={r.id==='warga-11'?mouth:0} rightTarget={p.handTarget} chalk={p.writing} stepYaw={'travelHeading' in p?angleDelta(p.heading,p.travelHeading):0}>{actor}</ActedRig>{r.id==='warga-21'&&<WetPrincipal frame={f} pose={p} roll={a.bodyRoll}/>}</React.Fragment>;
  })}
  {SEATS.map((s,i)=><group key={s.id} position={[...s.desk]}><mesh position={[0,.075,.04]}><boxGeometry args={[.46,.025,.29]}/><meshStandardMaterial color="#eddfba"/></mesh><mesh position={[.27,.08,.04]} rotation-z={.15}><boxGeometry args={[.10,.04,.18]}/><meshStandardMaterial color={STUDENTS[i].visual.shirt}/></mesh></group>)}
  {COWS.map(cow=><Cow006 key={cow.id} id={cow.id} frame={snapshot?9000:f}/>)}
 </group>;
};
