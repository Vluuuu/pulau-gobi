import React from 'react';
import {Img,staticFile} from 'remotion';
import {CAPTIONS} from './captions.ts';
import {ALIGNED_CAPTIONS} from './voiceWords.ts';
import {masterAt,gap,editFrame as E,ramp} from './timeline.ts';
import {CAST,FIRST_APPEARANCE,residentAt,gobiAt} from './direction.ts';
import {cameraAt,project} from './camera.ts';
import {shotAt} from './shots.ts';
const FONT='Arial, sans-serif';
type Rect={x:number;y:number;w:number;h:number};
export const overlaps=(a:Rect,b:Rect)=>a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;
const bound=(v:number,a:number,b:number)=>Math.max(a,Math.min(b,v));
export function introTags(f:number){
 const c=cameraAt(f);if(c.width>24)return [];
 const windows=[{id:'warga-10',a:E(26.67),b:E(30)},{id:'warga-12',a:E(31.19),b:E(34.19)},{id:'warga-11',a:E(79),b:E(81.7)},
 {id:'warga-8',a:E(39.15),b:E(41.85)},{id:'warga-7',a:E(42.05),b:E(44.7)},{id:'warga-9',a:E(54.07),b:E(56.6)},
 {id:'warga-3',a:E(48.57),b:E(50.8)},{id:'warga-6',a:E(88.5),b:E(90.6)},
 {id:'warga-1',a:E(23.81),b:E(26.21)},{id:'warga-2',a:E(23.81),b:E(26.21)},
 {id:'warga-4',a:E(73.54),b:E(76.4)},{id:'warga-5',a:E(73.54),b:E(76.4)}];
 const gobi=gobiAt(f),faces:Rect[]=[{x:gobi.pose.x,y:gobi.position[1]+1.7,z:gobi.pose.z},...CAST.filter(r=>residentAt(r.id,f).visible).map(r=>{const p=residentAt(r.id,f);return {x:p.position[0],y:p.position[1]+1.7,z:p.position[2]};})].map(p=>{const q=project([p.x,p.y,p.z],c);return {x:q.x-65,y:q.y-60,w:130,h:120};});
 const placed:{id:string;text:string;star:boolean;x:number;y:number;w:number;h:number}[]=[];
 for(const w of windows.filter(w=>f>=w.a&&f<w.b)){
  const r=CAST.find(r=>r.id===w.id)!,p=residentAt(r.id,f),q=project([p.position[0],p.position[1]+2.6,p.position[2]],c);
  if(!p.visible||q.x<0||q.x>1080||q.y<230||q.y>1320)continue;
  const width=Math.min(470,r.name.length*18+58);
  for(const [dx,dy] of [[0,-10],[0,-100],[-140,-60],[140,-60],[0,-200]]){
   const a={x:bound(q.x-width/2+dx,35,1045-width),y:bound(q.y+dy,340,1300),w:width,h:52};
   const reserved:Rect[]=[{x:0,y:1410,w:1080,h:510},{x:120,y:130,w:850,h:210}];
   if(['S23c','S30c'].includes(shotAt(f).id))reserved.push({x:190,y:365,w:700,h:165});
   if([...faces,...placed,...reserved].some(b=>overlaps(a,b)))continue;
   placed.push({id:r.id,text:r.name,star:r.special,...a});break;
  }
 }
 return placed.slice(0,3);
}
export const Overlays005:React.FC<{frame:number}>=({frame:f})=>{
 const m=masterAt(f),s=shotAt(f),caption=m===null?null:ALIGNED_CAPTIONS.find(c=>m>=c.start&&m<c.end),tags=introTags(f),g=gobiAt(f),c=cameraAt(f),head=project([g.pose.x,g.position[1]+2.15+(g.pose.hop??0),g.pose.z],c);
 const comment=s.id==='S04'?1:s.id==='S18'?2:null;
 const bubble=s.id==='S23c'?'Bang, muridnya mana?':s.id==='S30c'?'Bang... ini murid baru?':null;
 const emotion=['S01','S23b','S28'].includes(s.id)?'?!':s.id==='S25'||s.id==='S33a'?'?':s.id==='S05c'?'💧':null;
 return <>
  {caption&&<div data-ep005-caption="word-estimated" style={{position:'absolute',left:70,top:1430,width:940,height:250,display:'flex',alignItems:'center',justifyContent:'center',textAlign:'center',font:`800 57px ${FONT}`,lineHeight:1.18,color:'#fff',WebkitTextStroke:'2px #26323c',paintOrder:'stroke fill',textShadow:'0 4px 7px #14212f88'}}><div>{caption.words.map((w,i)=><React.Fragment key={i}><span style={{display:'inline-block',color:m!==null&&m>=w.start&&m<w.end?'#ffdb6e':'#fff'}}>{w.text}</span>{i<caption.words.length-1?' ':''}</React.Fragment>)}</div></div>}
  {comment&&<div style={{position:'absolute',left:120,top:140,width:840,padding:16,background:'#fff9eb',border:'3px solid #d5c49c',borderRadius:20}}><Img src={staticFile(`episode005/comments/comment-${comment}.png`)} style={{display:'block',width:'100%'}}/></div>}
  {tags.map(t=><div key={t.id} data-ep005-tag={t.id} style={{position:'absolute',left:t.x,top:t.y,width:t.w,height:t.h,background:'#fff9e9',border:`2px solid ${t.star?'#d6ae55':'#809b9b'}`,borderRadius:24,color:'#31463e',display:'flex',alignItems:'center',justifyContent:'center',font:`700 29px ${FONT}`,boxShadow:'0 3px 8px #21362722'}}>{t.star?'★ ':''}{t.text}</div>)}
  {emotion&&c.width<25&&<div style={{position:'absolute',left:bound(head.x+75,35,930),top:bound(head.y-100,330,1260),font:`900 68px ${FONT}`,color:'#e0a442',textShadow:'0 3px 0 #fff5d9'}}>{emotion}</div>}
  {s.id==='S05a'&&<svg width="690" height="320" viewBox="0 0 690 320" style={{position:'absolute',left:190,top:190}}><rect x="5" y="5" width="680" height="270" rx="65" fill="#fff9e8ee" stroke="#d8c49f" strokeWidth="4"/>
   <path d="M100 220L100 95 170 40 240 95 240 220M265 220L265 70 345 15 425 70 425 220M450 220L450 95 520 40 590 95 590 220" fill="#d7b45c" stroke="#a88444" strokeWidth="8"/>
   {[150,210,310,380,480,540].map(x=><path key={x} d={`M${x} 105V220`} stroke="#fff0b8" strokeWidth="17"/>)}<path d="M300 240Q345 215 390 240V280L340 310 300 280Z" fill="#86ceda"/></svg>}
  {bubble&&<div data-ep005-bubble style={{position:'absolute',left:190,top:365,width:700,minHeight:125,boxSizing:'border-box',padding:'25px',background:'#fff9eb',border:'4px solid #d5c49c',borderRadius:28,font:`700 43px ${FONT}`,textAlign:'center',color:'#334b40'}}>{bubble}<svg width="55" height="36" style={{position:'absolute',left:70,bottom:-35}}><path d="M0 0 L38 0 L5 34Z" fill="#fff9eb" stroke="#d5c49c" strokeWidth="4"/></svg></div>}
  {s.id==='S34b'||s.id==='S35'?<div data-ep005-cta style={{position:'absolute',left:165,top:160,width:750,padding:'20px 0',borderRadius:24,background:'#fff8e8ed',fontFamily:FONT,textAlign:'center',color:'#36503e'}}><div style={{fontSize:31,fontWeight:700}}>{s.id==='S35'?'FOLLOW + KOMEN':'KOMEN UNTUK JADI CALON MURID'}</div><div style={{fontSize:57,fontWeight:900}}>“{s.id==='S35'?'Jadi Warga':'Jadi Murid'}”</div><div style={{fontSize:27}}>Kreator memilih beberapa calon {s.id==='S35'?'warga':'murid'}</div></div>:null}
  {s.id==='S33b-wide'&&<div style={{position:'absolute',top:620,left:460,font:`900 100px ${FONT}`,color:'#ffdc89',textShadow:'0 4px #3e594c'}}>?</div>}
 </>;
};
