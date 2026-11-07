import {part} from '../episode004/production/part.ts';
import type {Part} from '../episode004/production/part.ts';
import {gap,ramp,editFrame as E} from './timeline.ts';
export function schoolParts(f:number,interior:boolean):Part[]{
 const t=(f-gap('G4').start)/30,out:Part[]=[];
 const add=(p:Part,a:number,b:number,drop=false)=>{
  const k=ramp(t,a,b);if(k<=0)return;
  out.push({...p,size:[p.size[0],p.size[1]*k,p.size[2]],position:[p.position[0],p.position[1]+(drop?2*(1-k):-p.size[1]*(1-k)/2),p.position[2]]});
 };
 add(part('school-foundation','#aca18b',[0,.13,0],[8.4,.26,5.8]),0,.4);
 for(let i=0;i<14;i++)add(part(`school-floor-${i}`,'#d3ad76',[-3.9+i*.6,.31,0],[.57,.13,5.7]),.4+i*.045,.60+i*.045);
 for(const x of [-4.1,4.1])for(const z of [-2.8,2.8])add(part(`school-post-${x}-${z}`,'#7f5938',[x,1.9,z],[.22,3.2,.22]),1.2,1.8);
 add(part('school-back-wall','#e6d7aa',[0,1.9,-2.8],[8.2,3,.18]),1.2,2.35);
 for(const x of [-4.1,4.1]){
  add(part(`school-side-low-${x}`,'#d7ba86',[x,.85,0],[.16,1.05,5.5]),1.4,2.35);
  add(part(`school-side-high-${x}`,'#e6d7aa',[x,2.85,0],[.16,.75,5.5]),1.5,2.4);
  for(const z of [-2,0,2])add(part(`school-window-post-${x}-${z}`,'#a08054',[x,1.95,z],[.2,1.1,.12]),2.4,2.8);
 }
 if(!interior){
  for(const x of [-2.85,2.85])add(part(`school-front-panel-${x}`,'#ddc89c',[x,1.85,2.8],[2.45,3,.18]),1.4,2.4);
  for(const x of [-1.5,1.5])add(part(`school-door-frame-${x}`,'#8c613b',[x,1.75,2.93],[.16,2.9,.25]),2.4,2.8);
  add(part('school-lintel','#8c613b',[0,3.16,2.93],[3.2,.19,.25]),2.4,2.8);
  for(const x of [-1,1])add(part(`school-roof-${x}`,'#788b88',[x*2.17,3.78,0],[4.55,.16,6.5],'box',[0,0,-x*.21]),3.2,4.4,true);
  add(part('school-ridge','#476a6b',[0,4.26,0],[.18,.18,6.6]),3.8,4.4,true);
 }
 add(part('school-bell-post','#8c613b',[-3.3,2,3.7],[.17,4,.17]),4.4,4.9);
 add(part('school-bell-arm','#8c613b',[-2.85,3.92,3.7],[1.05,.14,.14]),4.4,4.9);
 add(part('school-bell-rope','#c4a366',[-2.4,2.9,3.7],[.035,1.8,.035]),4.5,4.9);
 if(t>=5.2){
  add(part('school-blackboard','#2c5149',[0,2,-2.64],[4,1.7,.10]),5.2,5.55);
  add(part('teacher-desk','#a77b4d',[-2.45,.92,-1.4],[2,.13,.8]),5.5,5.8);
  for(let i=0;i<8;i++){
   const x=(i%2?1:-1)*2.45,z=-.65+Math.floor(i/2)*.8,at=5.6+i*.15;
   add(part(`student-desk-${i}`,'#bd925f',[x,.97,z],[1.6,.13,.58]),at,at+.15);
   add(part(`student-chair-${i}`,'#a27e53',[x,.55,z+.35],[.62,.14,.5]),at+.1,at+.25);
   add(part(`chair-back-${i}`,'#a27e53',[x,.91,z+.57],[.62,.7,.09]),at+.1,at+.25);
   for(const dx of [-.62,.62])add(part(`desk-leg-${i}-${dx}`,'#72543b',[x+dx,.62,z],[.09,.7,.40]),at,at+.15);
  }
  add(part('teacher-book','#9481ab',[-2.45,1.04,-1.4],[.65,.12,.48]),6.9,7.15);
  add(part('pencil-cup','#d29d53',[-1.85,1.19,-1.4],[.18,.3,.18],'cylinder'),6.9,7.15);
 }
 return out;
}
export function farmCrops(f:number):Part[]{
 const t=ramp(f,gap('G2b').start,gap('G2b').end-5),out:Part[]=[];
 for(let i=0;i<6;i++)for(let j=0;j<7;j++){
  const k=Math.max(0,Math.min(1,(t-(i*7+j)/70)*2.4));if(k<=0)continue;
  const x=-3.85+i*1.51,z=-2.15+j*.7;
  if(i%2===0){
   out.push(part(`corn-stem-${i}-${j}`,'#57974e',[x,.43+k*.4,z],[.055,k*.8,.055],'cylinder'));
   for(const side of [-1,1])out.push(part(`corn-leaf-${i}-${j}-${side}`,'#73ad56',[x+side*.16*k,.5+k*.35,z],[.37*k,.07*k,.12*k],'ico',[0,0,side*.5]));
  }else{
   out.push(part(`carrot-shoulder-${i}-${j}`,'#df914c',[x,.44,z],[.12*k,.13*k,.12*k],'ico'));
   for(let a=0;a<3;a++)out.push(part(`carrot-leaf-${i}-${j}-${a}`,'#6d9f4a',[x+(a-1)*.09*k,.45+k*.22,z],[.10*k,.42*k,.07*k],'cone',[0,a, (a-1)*.4]));
  }
 }
 return out;
}
export function riceParts(f:number):Part[]{
 const out:Part[]=[part('old-rice-soil','#6b4423',[0,.05,0],[2.5,.1,1.9])];
 for(const z of [-1,1])out.push(part(`rice-border-z${z}`,'#a56a37',[0,.08,z],[2.72,.16,.12]));
 for(const x of [-1.3,1.3])out.push(part(`rice-border-x${x}`,'#a56a37',[x,.08,0],[.12,.16,2]));
 for(let row=0;row<5;row++){
  const ripe=ramp(f,E(39.15)+row*5,E(39.15)+row*5+26),harvest=ramp(f,gap('G2a').start+row*16,gap('G2a').start+row*16+13);
  const color=harvest>.8?'#d4bb80':ripe>.5?'#dfba52':'#58b448';
  out.push(part(`rice-ridge-${row}`,'#835630',[0,.14,(row-2)*.35],[2.25,.08,.2]));
  for(let col=0;col<6;col++)for(let b=0;b<3;b++){
   const h=.6*(1-harvest)+.09*harvest,x=(col-2.5)*.4,z=(row-2)*.35;
   out.push(part(`old-rice-${row}-${col}-${b}`,color,[x+(b-1)*.045,.18+h/2,z],[.055,h,.055],'cone',[Math.sin(f*.035+col)*.035,b*2,(b-1)*.18]));
   if(ripe>.5&&harvest<.9)out.push(part(`grain-${row}-${col}-${b}`,'#f4d375',[x+(b-1)*.07,.18+h*.86,z],[.065,.11,.05],'ico'));
  }
 }
 if(f>=gap('G2a').end)for(let i=0;i<3;i++){
  out.push(part(`rice-bundle-${i}`,'#d7b36b',[1.5,.28,-.7+i*.55],[.22,.55,.22],'cylinder'));
  out.push(part(`rice-tie-${i}`,'#947143',[1.5,.26,-.7+i*.55],[.25,.07,.25],'cylinder'));
 }
 return out;
}
