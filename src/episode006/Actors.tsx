import React from 'react';
import {ResidentActor} from '../episode003/characters/ResidentActor';
import {PilotGobi} from '../episode004/pilot/Actors';
import {RESIDENTS,STUDENTS,COWS} from '../world/ep006/roster.ts';
import {SEATS} from '../world/ep006/layout.ts';
import {studentAt,adultAt,gobiAt} from './direction.ts';
import {cameraAt} from './camera.ts';
import {masterAt} from './timeline.ts';
import {Cow006} from './Cow';
import {CAPTIONS} from './voice.ts';

const Student006:React.FC<{index:number;frame:number;snapshot:boolean}>=({index:i,frame:f,snapshot})=>{
  const r=STUDENTS[i],p=studentAt(i,f,snapshot),v=r.visual,seat=p.seat,step=Math.sin(p.stride)*p.walk*.55,hip=.72-.15*seat,shin=.32+.15*seat,blink=(f+v.seed)%137<4;
  const writing=p.activity==='write'||p.activity==='note',hand=p.activity==='raise'?1:p.activity==='point'?.7:0;
  return <group name={`resident-${r.id}`} position={[...p.position]} rotation-y={p.heading}>
    <mesh rotation-x={-Math.PI/2} position-y={.012}><circleGeometry args={[.30,12]}/><meshBasicMaterial color="#30452d" transparent opacity={.16} depthWrite={false}/></mesh>
    {/* Articulated knees: hip lowers onto actual .46-high chair, thigh extends
        forward, shin remains vertical and shoes retain floor contact. */}
    {[-1,1].map(side=><group key={`leg${side}`} position={[side*.10,hip,0]} rotation-x={-seat*Math.PI/2+side*step*(1-seat)}>
      <mesh position-y={-.14}><boxGeometry args={[.14,.28,.15]}/><meshStandardMaterial color={v.pants}/></mesh>
      <group position-y={-.28} rotation-x={seat*Math.PI/2}>
        <mesh position-y={-shin/2}><boxGeometry args={[.115,shin,.12]}/><meshStandardMaterial color={v.pants}/></mesh>
        <mesh position={[0,-shin-.05,.04]}><boxGeometry args={[.16,.10,.23]}/><meshStandardMaterial color="#e9dfc8"/></mesh>
      </group>
    </group>)}
    <group position-y={hip+.03+Math.abs(Math.sin(p.stride))*p.walk*.022} rotation-x={writing?.055:0}>
      <mesh position={[0,.22,0]}><boxGeometry args={[.36,.44,.14]}/><meshStandardMaterial color={v.shirt} flatShading/></mesh>
      {seat<.5&&<mesh position={[0,.24,-.14]}><boxGeometry args={[.29,.31,.13]}/><meshStandardMaterial color={i%2?'#b38b65':'#627e98'}/></mesh>}
      <group position={[0,.65,0]} rotation={[p.headPitch,p.headYaw,p.react*.12]}>
        <mesh><icosahedronGeometry args={[.22,1]}/><meshStandardMaterial color={v.skin} flatShading/></mesh>
        <mesh position={[0,.035,-.02]}><sphereGeometry args={[.235,8,5,0,Math.PI*2,0,Math.PI*.55]}/><meshStandardMaterial color={v.hair}/></mesh>
        {v.hairStyle===1&&<mesh position={[-.05,.15,.12]} rotation-z={.2}><boxGeometry args={[.26,.08,.12]}/><meshStandardMaterial color={v.hair}/></mesh>}
        {v.hairStyle===2&&<mesh position={[0,.03,-.21]}><sphereGeometry args={[.12,6,5]}/><meshStandardMaterial color={v.hair}/></mesh>}
        {v.hairStyle===3&&<mesh position={[.1,.17,-.06]}><icosahedronGeometry args={[.12,0]}/><meshStandardMaterial color={v.hair}/></mesh>}
        {[-1,1].map(side=><mesh key={side} position={[side*.078,.01,.205]} scale-y={blink?.1:1}><sphereGeometry args={[.025,6,4]}/><meshBasicMaterial color="#1b2630"/></mesh>)}
        <mesh position={[0,-.08,.204]} scale-y={1+p.react}><boxGeometry args={[.065,.025,.018]}/><meshBasicMaterial color="#995d52"/></mesh>
      </group>
      {[-1,1].map(side=><group key={`arm${side}`} position={[side*.235,.38,0]} rotation-x={writing?-.9+Math.sin(p.phase)*.08:-side*step*.5} rotation-z={side===1?-hand*2.4:0}>
        <mesh position-y={-.09}><boxGeometry args={[.12,.18,.14]}/><meshStandardMaterial color={v.shirt}/></mesh>
        <group position-y={-.18} rotation-x={writing?-1.05:0}>
          <mesh position-y={-.12}><boxGeometry args={[.10,.24,.10]}/><meshStandardMaterial color={v.skin}/></mesh>
          <mesh position={[0,-.26,.015]}><boxGeometry args={[.12,.08,.12]}/><meshStandardMaterial color={v.skin}/></mesh>
          {writing&&side===1&&<mesh position={[0,-.28,.06]} rotation-x={-.5}><cylinderGeometry args={[.012,.012,.20,5]}/><meshStandardMaterial color="#d7b157"/></mesh>}
        </group>
      </group>)}
    </group>
    {p.activity==='note'&&<mesh position={[-.10,1,.30]} rotation-x={-.5}><boxGeometry args={[.30,.025,.27]}/><meshStandardMaterial color="#efdfbb"/></mesh>}
  </group>;
};
export const Actors006:React.FC<{frame:number;snapshot?:boolean}>=({frame:f,snapshot=false})=>{
  const g=gobiAt(f),c=cameraAt(f),m=masterAt(f),speaking=m!==null&&CAPTIONS.some(x=>m>=x.start&&m<x.end);
  const sample={...g,pose:{...g.pose,rotY:g.pose.walk?g.pose.rotY:c.az*Math.PI/180+.08}};
  const teacher=adultAt('warga-11',f,snapshot),pay=teacher.pay,xRot=-pay*1.8,reach=(.45+pay*.06)*1.65;
  return <group name="ep006-cast">
    <group position-y={g.position[1]}><PilotGobi frame={f} sample={sample} voiceSpeaking={snapshot?false:speaking}/></group>
    {STUDENTS.map((r,i)=><Student006 key={r.id} index={i} frame={f} snapshot={snapshot}/>)}
    {RESIDENTS.filter(r=>!STUDENTS.some(s=>s.id===r.id)).map(r=>{
      const p=adultAt(r.id,f,snapshot);return <ResidentActor key={r.id} resident={{id:r.id,visual:r.visual,isNewInEp003:!r.isLegacy}} pose={p} stride={p.stride} frame={f}/>;
    })}
    <group position={[...teacher.position]} rotation-y={teacher.heading}><mesh position={[.27*1.65,1.3365-Math.cos(xRot)*reach,-Math.sin(xRot)*reach]} rotation-z={.4}><cylinderGeometry args={[.018,.018,.16,5]}/><meshStandardMaterial color="#f0e8cd"/></mesh></group>
    {SEATS.map((s,i)=><group key={s.id} position={[...s.desk]}>
      <mesh position={[0,.075,.04]} rotation-x={.02}><boxGeometry args={[.46,.025,.29]}/><meshStandardMaterial color="#eddfba"/></mesh>
      <mesh position={[.27,.08,.04]} rotation-z={.15}><boxGeometry args={[.10,.04,.18]}/><meshStandardMaterial color={STUDENTS[i].visual.shirt}/></mesh>
    </group>)}
    {COWS.map(cow=><Cow006 key={cow.id} id={cow.id} frame={snapshot?9000:f}/>)}
  </group>;
};
