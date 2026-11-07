import type {GobiPose} from '../../Gobi';
export type V3=readonly[number,number,number];
export const FPS=30,DURATION=489;
export const T={walkEnd:54,bubble1:60,bubble1Full:66,bubble1Out:108,bubble1End:111,vo1:117,question:203,
 bubble2:215,bubble2Full:221,bubble2Out:273,bubble2End:278,pause:283,jump:316,takeoff:320,land:340,vo2:318,panic:390,vo3:393,
 knees:442,sit:448,contact:457,fallEmote:459,hold:474} as const;
export const KOST={position:[4,0,14] as V3,rotation:Math.PI/4,width:12,depth:6};
export const clamp=(v:number)=>Math.max(0,Math.min(1,v));
export const smooth=(v:number)=>{const t=clamp(v);return t*t*(3-2*t);};
export const ramp=(f:number,a:number,b:number)=>smooth((f-a)/(b-a));
export const lerp=(a:number,b:number,t:number)=>a+(b-a)*t;
export const pulse=(f:number,a:number,b:number)=>f<a||f>b?0:Math.sin(Math.PI*(f-a)/(b-a));
export const span=(f:number,a:number,b:number,r=5)=>ramp(f,a,a+r)*(1-ramp(f,b-r,b));
export function world(p:V3):V3{const c=Math.cos(KOST.rotation),s=Math.sin(KOST.rotation);return [KOST.position[0]+p[0]*c+p[2]*s,p[1],KOST.position[2]-p[0]*s+p[2]*c];}
export function walkU(f:number){const t=Math.max(0,Math.min(54,f));return t<6?t*t/576:t<48?(t-3)/48:1-(54-t)**2/576;}
export const WALK_LENGTH=Math.hypot(3.6,1.1);
export function oktaaAt(f:number){
 const u=walkU(f),distance=u*WALK_LENGTH,retreat=.32*ramp(f,T.takeoff+2,T.land+5);
 const prev=walkU(f-1)*WALK_LENGTH,speed=(distance-prev)*30;
 const nod=.11*pulse(f,162,185)+.07*pulse(f,229,244)+.16*pulse(f,465,482);
 return {position:[lerp(4.5,.9,u)+retreat,0,lerp(6.2,5.1,u)+retreat*.35] as V3,
  heading:lerp(Math.atan2(-3.6,-1.1),-.55,ramp(f,43,54)),distance:distance+retreat,stride:(distance+retreat)*2*Math.PI/1.2,
  walk:speed<.2?0:clamp(speed/2.25),hop:.14*pulse(f,T.takeoff+3,T.takeoff+18),
  lean:-.18*pulse(f,T.takeoff+2,T.land+9)+.13*ramp(f,456,478),nod,headYaw:-.12*ramp(f,43,54),
  blink:(f%127<4?1:0)+.9*pulse(f,467,474),wave:.35*pulse(f,T.takeoff+3,T.land+5)};
}
export function gobiAt(f:number):{pose:GobiPose;pupil:number;local:V3;top:number}{
 const sit=ramp(f,T.sit,T.contact),recover=1-ramp(f,T.contact+10,T.contact+25),shake=span(f,429,444,4);
 const hop=.27*pulse(f,117,133)+.88*pulse(f,T.takeoff,T.land)+.07*pulse(f,396,403)+.06*pulse(f,407,413)
   +.018*shake*Math.abs(Math.sin(f*.7))+.13*pulse(f,T.contact,T.contact+12);
 const squash=.18*pulse(f,114,119)-.14*pulse(f,119,127)+.34*pulse(f,316,320)-.30*pulse(f,320,329)
   +.40*pulse(f,340,346)+.25*pulse(f,T.knees,T.sit)+.35*pulse(f,T.contact,T.contact+6);
 const local:V3=[-1.4-.09*span(f,393,442)-.23*sit,0,5.1-.26*sit];
 const [x,,z]=world(local),surprise=ramp(f,313,318)*(1-.23*ramp(f,425,440));
 const pose:GobiPose={x,z,scale:1,rotY:KOST.rotation+lerp(1.9,.5,ramp(f,54,65)),hop,squash,sit,phase:f*.18,walk:0,
  blink:f%119<4?1:0,happy:.78*span(f,117,303,8)*(1-ramp(f,290,300)),surprise,
  confuse:.6*span(f,293,316,5),headYaw:.38*span(f,40,62)+.40*span(f,342,380)*Math.sin((f-342)*.40),
  headPitch:.13*span(f,60,112)+.16*span(f,294,313),tilt:.16*span(f,283,316)+shake*.09*Math.sin(f*.83),
  lean:-.18*span(f,139,195)-.12*span(f,316,390)-.34*sit+.18*pulse(f,T.knees,T.sit),
  roll:span(f,403,442)*(.05+shake*.10)*Math.sin(f*.7)+.04*recover*sit*Math.sin((f-T.contact)*.6),
  up:.93*span(f,319,348)+.4*span(f,393,429)+.18*shake,point:.8*span(f,117,140)+.92*span(f,403,430),
  armFwd:.30*span(f,T.knees,T.contact+5),wave:.15*shake};
 return {pose,pupil:1-.34*span(f,293,314),local,top:(2.18-.43*sit+hop)*(1-.5*squash)};
}
export const CAMERA_CUTS=[54,203,283,316] as const;
export function cameraAt(f:number){
 const shot=f<54?'P1':f<203?'P2-P3':f<283?'P4':f<316?'P5':'P6-P8';
 const target:V3=shot==='P1'?[0,3,0.6]:shot==='P5'?[-1.4,1.45,5.1]:shot==='P4'?[.2,1.65,5.1]:[-.2,1.65,5.1];
 const zoom=shot==='P1'?80:shot==='P5'?300:shot==='P6-P8'?230:225;
 const az=shot==='P1'?.12:shot==='P4'?-.50:shot==='P5'?-.10:.14,elevation=(shot==='P1'?22:shot==='P5'?9:shot==='P6-P8'?15:13)*Math.PI/180;
 const p=world(target),d=50,offset:V3=[d*Math.sin(az+KOST.rotation)*Math.cos(elevation),d*Math.sin(elevation),d*Math.cos(az+KOST.rotation)*Math.cos(elevation)];
 return {shot,target:p,position:[p[0]+offset[0],p[1]+offset[1],p[2]+offset[2]] as V3,zoom};
}
export function bubbleAt(f:number){
 const a=f>=60&&f<111?{id:1,start:60,full:66,out:108,end:111,text:'Bang, kamarnya berapa?'}:
  f>=215&&f<278?{id:2,start:215,full:221,out:273,end:278,text:'Terus 201 calon warga gimana?'}:null;
 if(!a)return null;const enter=clamp((f-a.start)/(a.full-a.start)),x=enter-1;
 return {...a,opacity:1-ramp(f,a.out,a.end),scale:enter>=1?1:1+2.4*x*x*x+1.4*x*x};
}
const steps:number[]=[];for(let d=.3;d<WALK_LENGTH;d+=.6){let f=0;while(walkU(f)*WALK_LENGTH<d&&f<54)f++;steps.push(f);}
export const SFX_CUES=[...steps.map((frame,i)=>({id:`step-${i}`,asset:'footstep',frame,volume:.45,shot:'P1'})),
 {id:'bubble-1',asset:'bubble-pop',frame:60,volume:.55,shot:'P2'},{id:'bubble-2',asset:'bubble-pop',frame:215,volume:.55,shot:'P4'},
 {id:'proud-hop',asset:'boing',frame:119,volume:.24,shot:'P3'},{id:'big-hop',asset:'boing',frame:320,volume:.55,shot:'P6'},
 {id:'landing',asset:'landing-thump',frame:340,volume:.55,shot:'P6'},{id:'panic',asset:'panic-rattle',frame:428,volume:.60,shot:'P7'},
 {id:'fall',asset:'fall-thud',frame:457,volume:.55,shot:'P7'}] as const;
