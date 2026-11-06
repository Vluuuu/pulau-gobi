import React from 'react';
import {Img,staticFile} from 'remotion';
import {FOLLOW_AGGREGATE} from '../state/roster.ts';
import {window as env} from '../direction/math.ts';
export const COMMENT_ASSETS=[
  {file:'image(4).png',author:'damar_zan',topic:'expansion-river-livestock',verifiedByImageInspection:true},
  {file:'image(2).png',author:'shifalina_',topic:'two-storey-warteg-vendor',verifiedByImageInspection:true},
  {file:'image(7).png',author:'~ Eka Agustin~',topic:'river',verifiedByImageInspection:true},
  {file:'image(5).png',author:'risda',topic:'kosan-request-not-built',verifiedByImageInspection:true},
  {file:'image(3).png',author:'joy.__3.15',topic:'livestock-plantation-teaser',verifiedByImageInspection:true},
  {file:'image(6).png',author:'Chery-of mylovve',topic:'livestock-teaser',verifiedByImageInspection:true},
] as const;
export const COMMENT_WINDOWS=[
  {start:7.44,end:11.20,files:['image(4).png','image(5).png']},
  {start:11.36,end:14.50,files:['image(2).png','image(5).png']},
  {start:14.50,end:17.34,files:['image(4).png']},
  {start:24.86,end:26.80,files:['image(7).png']},
  {start:43.28,end:50.0,files:['image(2).png']},
  {start:81.16,end:85.5,files:['image(4).png','image(3).png','image(6).png']},
] as const;
const FONT='Segoe UI, Arial, sans-serif';
export const StoryOverlays:React.FC<{frame:number}>=({frame})=>{
  const t=frame/30,card=COMMENT_WINDOWS.find(c=>t>=c.start&&t<c.end),follows=env(t,0.35,4.40,0.20),cta=env(t,87.8,94.6,0.25);
  return <>
    {follows>0&&<div data-follower-aggregate style={{position:'absolute',top:180,left:115,width:850,opacity:follows,fontFamily:FONT,textAlign:'center',color:'#23463d'}}>
      <div style={{background:'#fffae9ed',borderRadius:26,padding:'24px 24px',boxShadow:'0 8px 24px #1b3c3b22'}}>
        <div style={{fontSize:31,fontWeight:700,letterSpacing:1}}>FOLLOW LINTAS PLATFORM</div>
        <div style={{display:'flex',justifyContent:'space-around',fontSize:35,marginTop:14}}><span>IG {FOLLOW_AGGREGATE.instagram}</span><span>TikTok {FOLLOW_AGGREGATE.tiktok}</span><span>YouTube {FOLLOW_AGGREGATE.youtube}</span></div>
        <div style={{fontSize:92,fontWeight:900,lineHeight:1.2,color:'#bc723c'}}>{FOLLOW_AGGREGATE.totalCrossPlatformFollows}</div>
        <div style={{fontSize:28}}>Total agregat tiga platform</div>
      </div>
    </div>}
    {card&&<div data-comment-cards style={{position:'absolute',top:card.files.length===3?130:190,left:120,width:840,display:'flex',flexDirection:'column',gap:16,
      opacity:env(t,card.start,card.end,0.18),transform:`translateY(${(1-env(t,card.start,card.end,0.18))*12}px)`}}>
      {card.files.map(file=><div key={file} style={{padding:16,background:'#fffdf1',border:'3px solid #d3dfc9',borderRadius:18,boxShadow:'0 8px 20px #102f3930'}}>
        <Img data-original-comment={file} src={staticFile(`episode003/${file}`)} style={{display:'block',width:'100%',height:'auto',objectFit:'contain'}}/>
      </div>)}
    </div>}
    {cta>0&&<div data-cta style={{position:'absolute',top:185,left:165,width:750,textAlign:'center',fontFamily:FONT,opacity:cta,color:'#24493d',background:'#fff9e8ed',padding:'22px 0',borderRadius:24}}>
      <div style={{fontSize:33,fontWeight:700}}>FOLLOW + KOMEN</div><div style={{fontSize:61,fontWeight:900,color:'#a66c36'}}>“Jadi Warga”</div>
      <div style={{fontSize:29}}>Kreator memilih beberapa calon warga</div>
    </div>}
  </>;
};
