import React from 'react';
import {Img,staticFile} from 'remotion';
import {OrthographicCamera,Vector3} from 'three';
import {PilotOverlays} from '../pilot/Overlays';
import {uiAt as pilotUi} from '../pilot/framing.ts';
import {cameraAt,shotAt} from './camera.ts';
import {CAST,gobiSample,residentMotion,rewardAt,roleStart} from './direction.ts';
import {VO} from './voice.ts';
import {atVoice,voiceSlot,localWord,GUARD_BUBBLE,COMEDY,inComedy,ramp,span} from './timeline.ts';
import {FARM,RANCH} from './layout.ts';
import type {V3} from './layout.ts';
export type Rect={x:number;y:number;w:number;h:number};
const FONT='Segoe UI, Arial, sans-serif';
const bound=(v:number,a:number,b:number)=>Math.max(a,Math.min(b,v));
export function project(p:V3,f:number){const v=cameraAt(f),c=new OrthographicCamera(-540,540,960,-960,.1,260);c.position.set(...v.position);c.zoom=v.zoom;c.lookAt(...v.target);c.updateProjectionMatrix();c.updateMatrixWorld(true);const s=new Vector3(...p).project(c);return {x:540+s.x*540,y:960-s.y*960};}
const overlaps=(a:Rect,b:Rect)=>a.x<b.x+b.w+8&&a.x+a.w+8>b.x&&a.y<b.y+b.h+8&&a.y+a.h+8>b.y;
export function commentAt(f:number){
 if(f>=atVoice(2)+localWord(2,'pohon')-12&&f<atVoice(2)+localWord(2,'pertanian')-6)return 'irtiza';
 if(f>=atVoice(2)+localWord(2,'pertanian')-6&&f<atVoice(2)+localWord(2,'Oke',true))return 'fredrikz';
 if(f>=atVoice(3)&&f<atVoice(3)+90)return 'irtiza';
 if(f>=atVoice(5)&&f<atVoice(5)+localWord(5,'Oke'))return 'fredrikz';
 if(f>=atVoice(7)+localWord(7,'Katanya')&&f<atVoice(7)+localWord(7,'Bangun'))return 'xyree';
 return null;
}
export function guardChatAt(f:number){
 const start=GUARD_BUBBLE.start+21,end=GUARD_BUBBLE.start+72;if(f<start||f>=end)return null;
 const p=residentMotion('warga-9',f),s=project([p.position[0],1.8,p.position[2]],f);
 return {x:bound(s.x-530,65,460),y:bound(s.y-490,170,570),w:550,h:155,opacity:span(f,start,end,5)};
}
export function labelsAt(f:number){
 const c=cameraAt(f),focus=shotAt(f).focus,all=CAST.filter(r=>residentMotion(r.id,f).visible&&!(inComedy(f)&&r.id==='warga-1'));
 if(c.zoom<22)return [];
 const faces:Rect[]=all.map(r=>{const p=residentMotion(r.id,f),s=project([p.position[0],p.position[1]+1.78+p.hop-.5*p.sit,p.position[2]],f),size=Math.max(18,c.zoom*.40);return {x:s.x-size,y:s.y-size,w:size*2,h:size*2};});
 const g=gobiSample(f),s=project([g.pose.x,1.63+(g.pose.hop??0)-.43*(g.pose.sit??0),g.pose.z],f);faces.push({x:s.x-c.zoom*.55,y:s.y-c.zoom*.55,w:c.zoom*1.1,h:c.zoom*1.1});
 const reserved:Rect[]=[{x:0,y:1410,w:1080,h:510}];
 if(commentAt(f))reserved.push({x:120,y:140,w:840,h:215});
 const guard=guardChatAt(f);if(guard)reserved.push({...guard,h:guard.h+40});
 if(inComedy(f)){const b=pilotUi(f-COMEDY.start).bubble;reserved.push({x:b.x,y:b.y,w:b.width,h:b.height+40});}
 if(f>=atVoice(18)&&f<atVoice(19))reserved.push({x:165,y:160,w:750,h:220});
 const placed:{id:string;name:string;x:number;y:number;w:number;h:number;font:number;opacity:number;star:boolean;reward:boolean}[]=[];
 const ordered=[...all].sort((a,b)=>Number(b.id===focus)-Number(a.id===focus)||a.id.localeCompare(b.id));
 for(const r of ordered){
  const p=residentMotion(r.id,f),s=project([p.position[0],p.position[1]+2.6+p.hop-.5*p.sit,p.position[2]],f);
  if(s.x<15||s.x>1065||s.y<90||s.y>1350)continue;
  const font=c.zoom<60?18:r.name.length>20?21:27,w=Math.min(325,Math.max(138,r.name.length*font*.56+38)),h=c.zoom<60?32:42;
  let candidate:Rect|undefined;
  for(const [dx,dy]of [[0,0],[0,-52],[-125,-20],[125,-20],[0,-104],[-170,-75],[170,-75]]){
   const a={x:bound(s.x-w/2+dx,25,1055-w),y:bound(s.y-h/2+dy,110,1350-h),w,h};
   if(![...faces,...reserved,...placed].some(b=>overlaps(a,b))){candidate=a;break;}
  }
  if(!candidate)continue;
  const reward=rewardAt(r.id);placed.push({id:r.id,name:r.name,...candidate,font,opacity:c.zoom<60?.72:ramp(f,roleStart(r.id),roleStart(r.id)+7),star:r.special&&f>=reward,reward:reward>0&&f>=reward&&f<reward+36});
 }
 return placed;
}
const Caption:React.FC<{frame:number}>=({frame})=>{
 const v=VO.find(v=>frame>=atVoice(v.id)&&(frame<voiceSlot(v.id).end||v.id===19));if(!v)return null;
 const local=(frame-atVoice(v.id))/30;let cue=v.captions[0] as typeof v.captions[number];
 for(const c of v.captions)if(local>=c.start)cue=c;
 return <div data-ep004-caption style={{position:'absolute',left:75,top:1430,width:930,height:250,display:'flex',alignItems:'center',justifyContent:'center',textAlign:'center',font:`800 58px ${FONT}`,lineHeight:1.18,color:'#fff',WebkitTextStroke:'2px #26323c',paintOrder:'stroke fill',textShadow:'0 4px 7px #14212f88'}}>
  <div>{cue.words.map((w,i)=><React.Fragment key={i}><span style={{display:'inline-block',color:local>=w.start&&local<w.end?'#ffdb6e':'#fff'}}>{w.text}</span>{i<cue.words.length-1?' ':''}</React.Fragment>)}</div>
 </div>;
};
export const Overlays004:React.FC<{frame:number}>=({frame})=>{
 const comment=commentAt(frame),labels=labelsAt(frame),chat=guardChatAt(frame),comedy=inComedy(frame),g=gobiSample(frame),head=project([g.pose.x,g.top,g.pose.z],frame),hook=frame<atVoice(1)+107;
 const thinking=frame>=atVoice(1)+150&&frame<voiceSlot(1).end;
 const notYet=frame>=atVoice(6)+localWord(6,'Eh')&&frame<voiceSlot(6).end;
 return <>
  {comedy?<PilotOverlays frame={frame-COMEDY.start}/>:<Caption frame={frame}/>}
  {labels.map(l=><div key={l.id} data-ep004-tag={l.id} style={{position:'absolute',left:l.x,top:l.y,width:l.w,height:l.h,boxSizing:'border-box',borderRadius:22,background:'#fff9e9',border:`2px solid ${l.star?'#d6ae55':'#809b9b'}`,color:'#31463e',font:`700 ${l.font}px ${FONT}`,display:'flex',justifyContent:'center',alignItems:'center',opacity:l.opacity,boxShadow:'0 3px 8px #21362722'}}>
   {l.star?'★ ':''}{l.name}{l.reward&&<div style={{position:'absolute',top:l.h+5,fontSize:26,color:'#d79d3e'}}>★</div>}
  </div>)}
  {comment&&<div style={{position:'absolute',left:120,top:140,width:840,boxSizing:'border-box',padding:16,background:'#fff9eb',border:'3px solid #d5c49c',borderRadius:20}}><Img src={staticFile(`episode004/comments/${comment}.png`)} style={{display:'block',width:'100%',height:'auto'}}/></div>}
  {hook&&<div style={{position:'absolute',left:580,top:170,width:395,padding:'22px 0',textAlign:'center',background:'#fff8e7ed',borderRadius:28,fontFamily:FONT,color:'#9b683c'}}><div style={{fontSize:92,fontWeight:900}}>201</div><div style={{fontSize:29,fontWeight:800}}>CALON WARGA</div></div>}
  {thinking&&<svg width="840" height="310" style={{position:'absolute',left:120,top:150}}>
   <rect x="5" y="5" width="830" height="290" rx="65" fill="#fff9e8ee" stroke="#d8c49f" strokeWidth="4"/>
   {Array.from({length:48},(_,i)=>{const x=42+(i%16)*49,y=46+Math.floor(i/16)*79+Math.sin(frame*.13+i)*4;return <g key={i} transform={`translate(${x} ${y})`} fill={['#799282','#bda37a','#a58474'][i%3]}><circle r="10"/><rect x="-8" y="14" width="16" height="29" rx="3"/></g>;})}
  </svg>}
  {chat&&<div style={{position:'absolute',left:chat.x,top:chat.y,width:chat.w,height:chat.h,background:'#fff9eb',border:'4px solid #d5c49c',borderRadius:28,display:'flex',alignItems:'center',justifyContent:'center',font:`700 43px ${FONT}`,color:'#334b40',opacity:chat.opacity}}>Siap jaga, Bang!<svg width="55" height="36" style={{position:'absolute',right:25,bottom:-34}}><path d="M0 0 L38 0 L54 34Z" fill="#fff9eb" stroke="#d5c49c" strokeWidth="4"/></svg></div>}
  {!comedy&&((hook&&frame<38)||notYet)&&<div style={{position:'absolute',left:bound(head.x-30,35,955),top:bound(head.y-105,120,1270),width:72,height:72,borderRadius:36,background:'#fff7e4',color:'#bd713a',textAlign:'center',font:`900 58px ${FONT}`,lineHeight:'68px'}}>{notYet?'?':'!'}</div>}
  {!comedy&&notYet&&<svg width="35" height="60" style={{position:'absolute',left:bound(head.x+80,35,1000),top:head.y+28}}><path d="M18 2 C12 21 2 31 2 42 C2 65 34 65 34 42 C34 29 22 16 18 2Z" fill="#78c5dc" stroke="#dcf1ef" strokeWidth="3"/></svg>}
  {frame>=atVoice(17)&&frame<atVoice(18)&&[FARM,RANCH].map((p,i)=>{const s=project([p.position[0],4,p.position[2]],frame);return <div key={i} style={{position:'absolute',left:s.x-48,top:Math.min(s.y,1220)-48,width:96,height:96,borderRadius:48,background:'#fff8e3ef',border:'3px solid #c1b18a',textAlign:'center',lineHeight:'90px',fontSize:60,transform:`translateY(${Math.sin(frame*.12+i*Math.PI)*7}px)`}}>{i===0?'🌱':'▥'}</div>;})}
  {frame>=atVoice(18)&&frame<atVoice(19)&&<div style={{position:'absolute',left:165,top:160,width:750,padding:'20px 0',borderRadius:24,background:'#fff8e8ed',fontFamily:FONT,textAlign:'center',color:'#36503e'}}><div style={{fontSize:31,fontWeight:700}}>FOLLOW + KOMEN</div><div style={{fontSize:57,fontWeight:900}}>“Jadi Warga”</div><div style={{fontSize:27}}>Kreator memilih beberapa calon warga</div></div>}
 </>;
};
