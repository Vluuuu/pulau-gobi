import React from 'react';
import {PILOT_VO} from './audio.ts';
import {bubbleAt,T,ramp,span} from './plan.ts';
import {uiAt} from './framing.ts';
const FONT='Segoe UI, Arial, sans-serif';
export const PilotOverlays:React.FC<{frame:number}>=({frame})=>{
 const u=uiAt(frame),b=bubbleAt(frame),vo=PILOT_VO.find(v=>frame>=v.startFrame&&frame<v.startFrame+v.durationFrames);
 const dots=frame>=T.pause&&frame<T.jump,fall=frame>=T.fallEmote,bang=span(frame,T.takeoff+1,T.takeoff+32,4);
 const sweat=span(frame,T.pause+16,T.jump+4,3);
 return <>
  {u.tag.visible&&<div data-pilot-tag style={{position:'absolute',left:u.tag.x,top:u.tag.y,width:u.tag.width,height:u.tag.height,borderRadius:24,background:'#fff9e9',border:'3px solid #d3ae59',
   display:'flex',alignItems:'center',justifyContent:'center',font:`700 32px ${FONT}`,color:'#2c433b',boxShadow:'0 3px 8px #19332c22'}}>oktaa.blushh</div>}
  {b&&<div data-pilot-bubble={b.id} style={{position:'absolute',left:u.bubble.x,top:u.bubble.y,width:u.bubble.width,height:u.bubble.height,boxSizing:'border-box',padding:'20px 30px',borderRadius:30,
   border:'4px solid #d6c2a0',background:'#fffaf0',color:'#34483e',font:`700 44px ${FONT}`,lineHeight:1.16,display:'flex',alignItems:'center',justifyContent:'center',textAlign:'center',
   opacity:b.opacity,transform:`scale(${b.scale})`,transformOrigin:'90% 100%',boxShadow:'0 7px 14px #253c3328'}}>
   {b.text}<svg width="62" height="38" style={{position:'absolute',right:25,bottom:-34}}><path d="M0 0 L48 0 L61 35 Z" fill="#fffaf0" stroke="#d6c2a0" strokeWidth="4"/></svg>
  </div>}
  {dots&&<div style={{position:'absolute',left:u.emote.x-18,top:u.emote.y,width:130,font:`900 65px ${FONT}`,textAlign:'center',color:'#4b5348'}}>{frame>=T.pause+6?'•':''}{frame>=T.pause+14?'•':''}{frame>=T.pause+22?'•':''}</div>}
  {sweat>0&&<svg width="48" height="76" style={{position:'absolute',left:u.gobi.x+88,top:u.gobi.y+20,opacity:sweat,transform:`translateY(${12*(1-sweat)}px)`}}><path d="M24 3 C17 24 3 34 3 49 C3 80 46 80 46 49 C46 35 32 20 24 3Z" fill="#71c2e2" stroke="#e1f5fb" strokeWidth="4"/></svg>}
  {(fall||bang>0)&&<div data-pilot-emote style={{position:'absolute',left:u.emote.x,top:u.emote.y,width:86,height:86,borderRadius:43,background:'#fff8df',border:'4px solid #d89b4c',
   color:'#bf6931',font:`900 70px ${FONT}`,lineHeight:'78px',textAlign:'center',opacity:fall?1:bang,transform:`scale(${fall?1+.18*Math.sin(Math.PI*ramp(frame,T.fallEmote,T.fallEmote+6)):1})`}}>!</div>}
  {vo&&<div data-pilot-subtitle style={{position:'absolute',left:75,top:1430,width:930,height:250,display:'flex',alignItems:'center',justifyContent:'center',textAlign:'center',
   font:`800 59px ${FONT}`,lineHeight:1.18,color:'white',WebkitTextStroke:'2px #26323c',paintOrder:'stroke fill',textShadow:'0 4px 7px #14212f99'}}>
   <div>{vo.words.map((w,i)=>{const active=frame>=vo.startFrame+w.start*30&&frame<vo.startFrame+w.end*30;return <React.Fragment key={i}><span style={{display:'inline-block',color:active?'#ffdb6e':'white'}}>{w.text}</span>{i<vo.words.length-1?' ':''}</React.Fragment>;})}</div>
  </div>}
 </>;
};
