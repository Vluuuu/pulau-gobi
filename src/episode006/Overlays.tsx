import React from 'react';
import {Img,staticFile} from 'remotion';
import {CAPTIONS} from './voice.ts';
import {masterAt,ramp,clamp} from './timeline.ts';
import {shotAt} from './shots.ts';
import {STUDENTS,COWS} from '../world/ep006/roster.ts';
const FONT='Arial, sans-serif';
const Comment:React.FC<{file:string;top:number}>=({file,top})=><div style={{position:'absolute',left:110,top,width:860,padding:16,boxSizing:'border-box',borderRadius:18,background:'#25262b',boxShadow:'0 8px 24px #10222c40'}}><Img src={staticFile(`episode006/comments/${file}`)} style={{display:'block',width:'100%',height:145,objectFit:'contain'}}/></div>;
const Label:React.FC<{text:string;top?:number}>=({text,top=505})=><div style={{position:'absolute',left:90,top,width:900,textAlign:'center',font:`bold 40px ${FONT}`,color:'#fff5da',textShadow:'0 3px 6px #14212f'}}>{text}</div>;
export const Overlays006:React.FC<{frame:number}>=({frame:f})=>{
  const s=shotAt(f),q=f-s.start,m=masterAt(f),caption=m===null?undefined:CAPTIONS.find(c=>m>=c.start&&m<c.end);
  const pair=['S06','S07','S08','S09'].indexOf(s.id),cow=Math.min(2,Math.floor(q/Math.max(1,(s.end-s.start)/3)));
  return <>
    {s.id==='S02'&&<Label text="KILAS BALIK EP005" top={160}/>}
    {s.id==='S05'&&<>{[0,1].map(i=>{const n=Math.min(7,Math.floor(q/Math.max(1,(s.end-s.start)/4))*2+i);return <Comment key={i} file={`student_${String(n+1).padStart(2,'0')}.png`} top={180+i*205}/>;})}</>}
    {pair>=0&&<div style={{opacity:Math.min(1,ramp(q,0,6))}}><Comment file={`student_${String(pair*2+1).padStart(2,'0')}.png`} top={130}/><Comment file={`student_${String(pair*2+2).padStart(2,'0')}.png`} top={335}/><Label text={`${STUDENTS[pair*2].name}  ·  ${STUDENTS[pair*2+1].name}`} top={580}/></div>}
    {s.id==='S13'&&q<78&&<Label text="Damia · Guru pertama" top={200}/>}
    {s.id==='S14'&&q<78&&<><Comment file="Ghanim_Miyaz.png" top={150}/><Label text="Ghanim Miyaz · Kepala sekolah" top={385}/></>}
    {s.id==='S16'&&q<90&&<Comment file="damar_zan.png" top={170}/>}
    {s.id==='S30'&&<><Comment file="velora_nyxflare.png" top={170}/><Label text="velora.nyxflare" top={405}/></>}
    {s.id==='S31'&&<Label text={COWS[cow].name} top={230}/>}
    {s.id==='S35'&&q>40&&q<115&&<Label text="LAMPU JALAN KITA MANA?!" top={240}/>}
    {caption&&<div style={{position:'absolute',left:85,top:1465,width:910,minHeight:170,display:'flex',alignItems:'center',justifyContent:'center',font:`800 54px ${FONT}`,lineHeight:1.2,textAlign:'center',color:'#fff',WebkitTextStroke:'2px #24313a',paintOrder:'stroke fill',textShadow:'0 4px 7px #14212f88'}}>{caption.text}</div>}
  </>;
};
