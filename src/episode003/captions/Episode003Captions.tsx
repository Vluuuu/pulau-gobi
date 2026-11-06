import React from 'react';
import {EP003_CAPTION_CUES} from '../audio/alignment.ts';
import {clamp} from '../direction/math.ts';
export function captionAt(frame:number){
  return EP003_CAPTION_CUES.find((c,i)=>frame>=c.startFrame&&frame<Math.min(c.endFrame+4,EP003_CAPTION_CUES[i+1]?.startFrame??3000));
}
export const CAPTION_SAFE_AREA={left:75,top:1510,width:930,height:250} as const;
export const Episode003Captions:React.FC<{frame:number}>=({frame})=>{
  const cue=captionAt(frame);if(!cue)return null;
  const opacity=clamp((frame-cue.startFrame+1)/4)*(cue.endFrame>=2990?1:clamp((cue.endFrame+4-frame)/4));
  let active=0;cue.words.forEach((w,i)=>{if(frame>=w.start*30)active=i;});
  return <div data-caption={cue.id} style={{position:'absolute',left:CAPTION_SAFE_AREA.left,top:CAPTION_SAFE_AREA.top,width:CAPTION_SAFE_AREA.width,height:CAPTION_SAFE_AREA.height,
    display:'flex',alignItems:'center',justifyContent:'center',textAlign:'center',fontFamily:'Segoe UI, Arial, sans-serif',fontSize:60,fontWeight:800,lineHeight:1.18,
    color:'#ffffff',opacity,transform:`translateY(${(1-opacity)*8}px)`,WebkitTextStroke:'2px #26323c',paintOrder:'stroke fill',textShadow:'0 4px 7px #14212f99'}}>
    <div data-caption-lines style={{maxWidth:'100%'}}>{cue.words.map((w,i)=><React.Fragment key={i}><span style={{display:'inline-block',color:i===active&&frame<cue.end*30?'#ffdb6e':'#ffffff'}}>{w.text}</span>{i<cue.words.length-1?' ':''}</React.Fragment>)}</div>
  </div>;
};
