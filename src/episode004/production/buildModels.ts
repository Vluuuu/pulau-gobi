import {part} from './part.ts';
import type {Part} from './part.ts';
import {clamp,smooth} from './timeline.ts';
const wood='#b38454',dark='#725332',sage='#6b8d70',soil='#85603e',rim='#bc9d6a';
function grow(p:Part,t:number,a:number,b:number,drop=false):Part|null{
 const u=clamp((t-a)/(b-a));if(u<=0)return null;
 const k=u>=1?1:smooth(u)+Math.sin(u*Math.PI)*.1;
 return {...p,position:[p.position[0],drop?p.position[1]+1.6*(1-smooth(u))-.045*Math.sin(u*Math.PI*3)*Math.sin(u*Math.PI):p.position[1]-p.size[1]*(1-k)/2,p.position[2]],size:[p.size[0],p.size[1]*k,p.size[2]]};
}
export function farmParts(p:number,frame=0):Part[]{
 const out:Part[]=[];const add=(q:Part,a:number,b:number,drop=false)=>{const v=grow(q,p,a,b,drop);if(v)out.push(v);};
 add(part('field-soil',soil,[0,.04,0],[9.7,.10,7.6]),0,.09);
 for(const x of [-4.4,4.4])add(part(`guide-stake-${x}`,wood,[x,.36,-3.6],[.10,.70,.10]),.02,.10);
 add(part('bed-guide-rope','#e0c891',[0,.55,-3.6],[8.8,.022,.022]),.05,.12);
 for(let i=0;i<6;i++){
  const x=-3.85+i*1.51;add(part(`bed-${i}`,i%2?'#997144':'#a67b4c',[x,.22,.1],[.95,.4,5.4]),.08+i*.035,.25+i*.035);
  for(const z of [-2.65,2.85])add(part(`bed-rim-${i}-${z}`,rim,[x,.15,z],[1.08,.24,.12]),.14+i*.035,.34+i*.035);
  add(part(`branch-channel-${i}`,'#5f725c',[x+.63,.065,.05],[.18,.08,5.8]),.5,.66);
  const fill=clamp((p-.69-i*.014)/.14);if(fill>0)out.push(part(`branch-water-${i}`,'#59b4ba',[x+.63,.112,-2.85+5.75*fill/2],[.13,.015,5.75*fill]));
 }
 for(let i=0;i<12;i++){
  const x=i<6?-4.8+i*1.9:4.7-(i-6)*1.9,z=i<6?-3.8:3.8;
  add(part(`farm-post-${i}`,wood,[x,.53,z],[.12,1.06,.12]),.5+i*.009,.61+i*.009);
 }
 for(const z of [-3.8,3.8])for(let i=0;i<2;i++)add(part(`farm-rail-${z}-${i}`,sage,[0,.43+i*.36,z],[9.5,.10,.10]),.57,.76);
 for(const x of [-4.8,4.7])for(let i=0;i<2;i++)add(part(`farm-side-${x}-${i}`,sage,[x,.43+i*.36,0],[.10,.1,7.6]),.6,.79);
 add(part('main-channel','#5f725c',[0,.07,-3.13],[8.7,.09,.29]),.51,.62);
 add(part('sluice-post',dark,[-3.8,.46,-3.55],[.13,.92,.13]),.55,.70);
 add(part('sluice-lever',wood,[-3.4,.93,-3.55],[.8,.10,.72],'box',[p<1?Math.sin(frame*.22)*.12:0,0,0]),.60,.73);
 const fill=clamp((p-.68)/.14);if(fill>0)out.push(part('main-water','#59b4ba',[-4.35+8.7*fill/2,.12,-3.13],[8.7*fill,.02,.23]));
 // Well/tank at the rear-right corner: farther from the old rice plot.
 add(part('well-stone','#999b89',[3.7,.42,-3.35],[.50,.8,.32],'cylinder'),.53,.65);
 add(part('tank-base',wood,[3.7,.68,-3.35],[1.1,.18,.8]),.56,.68);
 add(part('water-tank','#9c7148',[3.7,1.16,-3.35],[.72,.85,.62],'cylinder'),.58,.70);
 add(part('pump','#526b62',[4.3,.96,-3.15],[.12,1.1,.12]),.6,.73);
 add(part('pump-handle',dark,[4.35,1.45,-3.15],[.55,.09,.10],'box',[0,0,p<1?Math.sin(frame*.25)*.25:0]),.61,.74);
 add(part('drain-sump','#858c76',[-4.2,.11,3.0],[.5,.17,.5]),.8,.88);
 add(part('sump-water','#59b4ba',[-4.2,.205,3.0],[.35,.015,.35]),.83,.92);
 add(part('wheelbarrow',sage,[-3.5,.6,3.15],[1.05,.32,.55]),.78,.91);
 for(const x of [-3.95,-3.05])add(part(`barrow-wheel-${x}`,dark,[x,.31,3.15],[.19,.4,.4],'cylinder',[0,0,Math.PI/2]),.8,.93);
 add(part('seed-sack','#dfc493',[-2.1,.36,3.12],[.45,.68,.45],'ico'),.82,.94);
 return out;
}
export function ranchParts(p:number):Part[]{
 const out:Part[]=[];const add=(q:Part,a:number,b:number,drop=false)=>{const v=grow(q,p,a,b,drop);if(v)out.push(v);};
 for(let i=0;i<20;i++){
  const side=Math.floor(i/5),u=(i%5)/4,x=side===0?-4.8+u*9.6:side===1?4.8:side===2?4.8-u*9.6:-4.8,z=side===0?-3.8:side===1?-3.8+u*7.6:side===2?3.8:3.8-u*7.6;
  add(part(`ranch-post-${i}`,wood,[x,.7,z],[.18,1.4,.18]),.02+i*.014,.16+i*.014);
 }
 for(const z of [-3.8,3.8])for(const y of [.45,1.0]){
  if(z>0){for(const x of [-3.05,3.05])add(part(`rail-${z}-${y}-${x}`,rim,[x,y,z],[3.5,.14,.12]),.27,.46);}
  else add(part(`rail-${z}-${y}`,rim,[0,y,z],[9.6,.14,.12]),.27,.46);
 }
 for(const x of [-4.8,4.8])for(const y of [.45,1.0])add(part(`side-${x}-${y}`,rim,[x,y,0],[.12,.14,7.6]),.27,.46);
 for(const x of [-3.5,3.5])for(const z of [-2.6,1.0])add(part(`shelter-post-${x}-${z}`,dark,[x,1.65,z],[.24,3.3,.24]),.2,.48);
 for(const x of [-1,1])add(part(`ranch-roof-${x}`,'#b37b52',[x*2,3.52,-.8],[4.25,.16,4.6],'box',[0,0,-x*.18]),.52,.65,true);
 add(part('roof-ridge','#785736',[0,3.94,-.8],[.18,.18,4.7]),.6,.8,true);
 add(part('feed-trough',wood,[2.0,.4,-1.6],[2.4,.6,.7]),.7,.85);
 add(part('empty-trough-interior','#6a5338',[2,.72,-1.6],[2.18,.03,.5]),.75,.9);
 add(part('water-trough','#a29c82',[-2.1,.3,-1.6],[1.8,.45,.7]),.73,.87);
 add(part('trough-water','#64999c',[-2.1,.54,-1.6],[1.5,.025,.5]),.81,.93);
 for(let i=0;i<3;i++)add(part(`hay-${i}`,'#cdb272',[-2+i*.6,.28,-2.9],[.7,.5,.55]),.78+i*.02,.91+i*.02);
 add(part('guard-bench',wood,[3.4,.55,2.8],[1.6,.16,.55]),.8,.94);
 for(const x of [2.8,4])add(part(`bench-leg-${x}`,dark,[x,.25,2.8],[.12,.5,.4]),.8,.94);
 add(part('lantern-post',dark,[4.2,1.15,3.25],[.12,2.3,.12]),.83,.96);
 add(part('lantern','#eac17a',[4.2,1.98,3.25],[.28,.36,.28]),.88,1);
 add(part('gate',sage,[0,.68,3.8],[2.4,1.15,.12],'box',[0,Math.sin(Math.PI*clamp((p-.82)/.18))*.2,0]),.82,.97);
 return out;
}
