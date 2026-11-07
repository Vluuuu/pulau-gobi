import React,{useLayoutEffect,useRef} from 'react';
import {Group,Mesh} from 'three';
import {Gobi} from '../../Gobi';
import {Villager} from '../../episode002/Villager';
import {EP003_ROSTER} from '../../episode003/state/roster.ts';
import {PILOT_VO} from './audio.ts';
import {gobiAt,oktaaAt,world,KOST} from './plan.ts';
export const OKTAA=EP003_ROSTER.find(r=>r.id==='warga-1')!;
export const PilotGobi:React.FC<{frame:number;sample?:ReturnType<typeof gobiAt>;voiceSpeaking?:boolean}>=({frame,sample,voiceSpeaking})=>{
 const ref=useRef<Group>(null),g=sample??gobiAt(frame);
 const speaking=voiceSpeaking??PILOT_VO.some(v=>v.words.some(w=>frame>=v.startFrame+w.start*30&&frame<v.startFrame+w.end*30));
 const p={...g.pose,surprise:Math.max(g.pose.surprise??0,speaking?.22:0)};
 useLayoutEffect(()=>{ref.current?.traverse(n=>{if(n instanceof Mesh){n.castShadow=true;n.receiveShadow=true;
  if(Math.abs(n.position.z-.46)<.0001){const e=(1+.8*(p.surprise??0))*(1+(n.position.x<0?.35:-.2)*(p.confuse??0))*g.pupil;
   const open=Math.max(.08,1-.92*(p.blink??0)-.5*(p.happy??0));n.scale.set(e,e*open,e);}
  if(Math.abs(n.position.z-.47)<.0001)n.scale.y=(.6+.8*(p.up??0)+.8*(p.surprise??0)+.9*(p.happy??0)-.2*(p.confuse??0))*(speaking?.55+.45*Math.abs(Math.sin(frame*.72)):1);
 }});},[frame,g.pupil,p.surprise,p.up,p.confuse,p.blink,p.happy,speaking]);
 return <group ref={ref} name="pilot-gobi"><Gobi frame={frame} pose={p}/></group>;
};
/** EP002 model retained; only pilot head/eye/body pose channels are adapted. */
export const PilotOktaa:React.FC<{frame:number}>=({frame})=>{
 const ref=useRef<Group>(null),p=oktaaAt(frame),v=OKTAA.visual;
 useLayoutEffect(()=>{ref.current?.traverse(n=>{
  if(n instanceof Mesh){n.castShadow=true;n.receiveShadow=true;if(n.parent?.position.y===1.08&&Math.abs(n.position.z-.2)<.0001)n.scale.y=1-.86*Math.min(1,p.blink);}
  if(n instanceof Group&&n.position.y===1.08)n.rotation.set(p.nod,p.headYaw,.04*Math.sin(frame*.07));
 });},[frame,p.nod,p.headYaw,p.blink]);
 return <group ref={ref} name="pilot-oktaa" position={[...world(p.position)]} rotation-y={KOST.rotation+p.heading}>
  <group position-y={p.hop} rotation-x={p.lean}><Villager position={[0,0,0]} heading={0} walk={p.walk} stride={p.stride} shirt={v.shirt} hair={v.hair} pants={v.pants} skin={v.skin} scale={1.65} wave={p.wave}/></group>
 </group>;
};
