import {schoolParts as classroomParts} from './models.ts';
import {part} from '../episode004/production/part.ts';
import type {Part} from '../episode004/production/part.ts';
import {gap,ramp} from './timeline.ts';

// The existing A01 classroom keeps its position, eight desks, blackboard and cow route.
// Two additional wings occupy surveyed gaps between EP004 tree trunks. No terrain expansion.
export const SCHOOL_WINGS=[{id:'A',x:0,z:0},{id:'B',x:-5,z:-5},{id:'C',x:-10,z:-2}] as const;
export const CAMPUS_BOUNDS={xMin:-34.2,xMax:-15.8,zMin:-29.9,zMax:-8.5,height:8.35};
export const CAMPUS_HERO_TARGET=[-26.1,2.2,-21] as const;
export const CAMPUS_HERO_GOBI=[-29,0,-13.8] as const;
export const SCHOOL_NAME='SEKOLAH PULAU GOBI';

export function campusParts(f:number,interior:boolean,foyer=false):Part[]{
 const t=(f-gap('G4').start)/30,out=classroomParts(f,interior).filter(p=>!p.id.startsWith('school-roof-')&&p.id!=='school-ridge');
 const add=(p:Part,a:number,b:number)=>{const k=ramp(t,a,b);if(k<=0)return;out.push({...p,size:[p.size[0],p.size[1]*k,p.size[2]],position:[p.position[0],p.position[1]-p.size[1]*(1-k)/2,p.position[2]]});};
 const wood='#8f6b48',cream='#e9dcb6',trim='#577b77',roof='#698e8a',glass='#9dc5cf';
 for(const [index,w] of SCHOOL_WINGS.entries()){
  const p=(id:string,color:string,x:number,y:number,z:number,sx:number,sy:number,sz:number,rot?:readonly[number,number,number])=>part(`campus-${w.id}-${id}`,color,[w.x+x,y,w.z+z],[sx,sy,sz],'box',rot);
  if(index>0){
   add(p('foundation','#a7a28d',0,.17,0,8.4,.34,5.8),index*.1,.5+index*.1);
   add(p('ground-floor','#cfb07e',0,.36,0,8.2,.12,5.6),.4,.95);
   add(p('back-wall',cream,0,1.95,-2.8,8.2,3.1,.17),1.2,2.35);
   for(const side of [-1,1]){
    add(p(`side-wall-${side}`,cream,side*4.1,1.95,0,.17,3.1,5.5),1.3,2.4);
    add(p(`front-pier-${side}`,cream,side*3.1,1.95,2.8,2.0,3.1,.17),1.4,2.4);
    add(p(`window-ground-${side}`,glass,side*2.65,2.1,2.91,1.7,1.2,.045),2.35,2.8);
    for(const dx of [-.9,.9])add(p(`window-ground-trim-${side}-${dx}`,trim,side*2.65+dx,2.1,2.95,.08,1.4,.07),2.4,2.85);
   }
   // Wide central entrance and a view through to a furnished, unoccupied room.
   add(p('entry-header',wood,0,3.25,2.9,3.0,.18,.24),2.4,2.8);
   for(const side of [-1,1])add(p(`entry-jamb-${side}`,wood,side*1.5,1.85,2.9,.16,2.8,.24),2.4,2.8);
   add(p('ground-board','#335951',0,2,-2.66,3.4,1.5,.08),5.2,5.55);
   for(let j=0;j<4;j++)add(p(`extra-class-desk-${j}`,'#be9969',(j%2?1:-1)*2.1,.96,-.5+Math.floor(j/2)*1.4,1.6,.14,.65),5.6+j*.15,5.8+j*.15);
  }
  // The front classroom is cut open only for its existing interior shots.
  if(!(interior&&index===0)){
   add(p('upper-slab','#b69363',0,3.83,0,8.5,.25,5.9),2.7,3.15);
   add(p('upper-back',cream,0,5.55,-2.8,8.2,3.2,.17),3.15,4.1);
   for(const side of [-1,1]){
    add(p(`upper-side-${side}`,cream,side*4.1,5.55,0,.17,3.2,5.6),3.2,4.2);
    add(p(`upper-front-pier-${side}`,cream,side*3.65,5.55,2.8,.9,3.2,.17),3.3,4.2);
   }
   add(p('upper-front-low',cream,0,4.6,2.8,7.4,1.2,.17),3.3,4.2);
   add(p('upper-front-header',cream,0,6.86,2.8,7.4,.6,.17),3.3,4.25);
   for(let j=0;j<4;j++){
    const x=-2.7+j*1.8;
    add(p(`upper-window-${j}`,glass,x,5.78,2.91,1.52,1.45,.045),4.05+j*.05,4.4+j*.05);
    for(const side of [-1,1])add(p(`upper-window-trim-${j}-${side}`,trim,x+side*.79,5.78,2.96,.07,1.6,.07),4.2,4.7);
    add(p(`upper-window-cross-${j}`,trim,x,5.78,2.96,1.6,.07,.07),4.2,4.7);
   }
   for(const side of [-1,1])add(p(`upper-roof-${side}`,roof,side*2.17,7.63,0,4.6,.19,6.7,[0,0,-side*.23]),4.5,5.2);
   add(p('upper-ridge','#426d69',0,8.15,0,.20,.20,6.8),4.8,5.2);
   // External corridor, columns and railings make the two storeys read at village scale.
   add(p('veranda-floor','#c7a572',0,3.85,3.35,8.6,.18,1.25),3.0,3.45);
   for(let j=0;j<7;j++)add(p(`balcony-baluster-${j}`,trim,-3.9+j*1.3,4.38,3.90,.075,.95,.075),4.2,4.75);
   add(p('balcony-handrail',trim,0,4.88,3.90,8.55,.10,.10),4.4,4.85);
   for(const side of [-1,1])add(p(`porch-column-${side}`,wood,side*3.9,1.93,3.85,.18,3.85,.18),2.0,2.6);
  }
  if(interior&&index===0){
   // An architectural section through wing A, not a detached roofless classroom.
   // Rear upper storey, side returns and rear roof remain physically attached and visible.
   add(p('section-upper-back',cream,0,5.55,-2.8,8.2,3.2,.17),3.15,4.1);
   for(const side of [-1,1]){
    add(p(`section-upper-side-${side}`,cream,side*4.1,5.55,-1.9,.17,3.2,1.8),3.2,4.2);
    add(p(`section-rear-roof-${side}`,roof,side*2.17,7.63,-1.9,4.6,.19,2.9,[0,0,-side*.23]),4.5,5.2);
   }
   add(p('section-floor-edge',wood,0,3.82,-1.0,8.4,.2,.12),2.7,3.15);
   add(p('section-rear-slab','#b69363',0,3.83,-1.95,8.5,.25,1.95),2.7,3.15);
   add(p('section-back-tie-beam',cream,0,3.55,-2.8,8.4,.32,.2),2.7,3.15);
  }
 }
 // Connecting corridor behind the retained courtyard tree, plus a public entrance portico.
 add(part('campus-link-floor','#c7a572',[-5,3.85,-.25],[3.5,.18,1.4]),3.1,3.6);
 add(part('campus-link-rail',trim,[-5,4.5,.45],[3.5,.12,.10]),4.2,4.8);
 add(part('main-entry-canopy',roof,[-10,3.7,2.0],[8.9,.18,3.0]),4.5,5.1);
 for(const x of [-14,-6])add(part(`main-entry-column-${x}`,wood,[x,1.85,3.4],[.23,3.7,.23]),2.0,2.6);
 // Broad grass yard: retained trees stay as landscaping; no solid slab buries their trunks.
 for(const x of [-15.5,-3])for(let j=0;j<6;j++){
  const z=4.5+j*1.8;add(part(`campus-fence-post-${x}-${j}`,wood,[x,.55,z],[.12,1.1,.12]),.4,.95);
  if(j<5)add(part(`campus-fence-rail-${x}-${j}`,trim,[x,.65,z+.9],[.09,.10,1.8]),.6,1.1);
 }
 for(const x of [-14,-12,-4]){
  add(part(`campus-front-fence-${x}`,trim,[x,.65,13.5],[1.8,.10,.09]),.6,1.1);
  add(part(`campus-front-post-${x}`,wood,[x,.55,13.5],[.12,1.1,.12]),.4,.95);
 }
 for(let i=0;i<8;i++)add(part(`campus-entry-path-${i}`,'#c3b590',[-10,.025,4.2+i*.9],[1.6,.05,.68]),.5,1.1);
 add(part('campus-flag-base','#a5a491',[-14.3,.12,10],[1.5,.24,1.5]),.4,.9);
 add(part('campus-flag-pole','#d4d7c9',[-14.3,3.7,10],[.075,7.2,.075],'cylinder'),4.7,5.2);
 for(const x of [-13.5,-5.5]){
  add(part(`campus-yard-bench-${x}`,wood,[x,.5,8],[1.8,.14,.55]),.6,1.15);
  add(part(`campus-yard-bench-back-${x}`,trim,[x,.9,8.2],[1.8,.8,.09]),.6,1.15);
  for(const dx of [-.65,.65])add(part(`campus-bench-leg-${x}-${dx}`,wood,[x+dx,.25,8],[.12,.5,.40]),.6,1.15);
 }
 // Public foyer on the SAME A-wing. Its rear doorway is the retained A01 classroom door.
 add(part('foyer-foundation','#a7a28d',[0,.17,4.3],[8.4,.34,3.0]),0,.4);
 for(let i=0;i<14;i++)add(part(`foyer-floor-${i}`,'#c9aa76',[-3.9+i*.6,.35,4.3],[.57,.10,3.0]),.6+i*.025,.85+i*.025);
 for(const x of [-3.95,3.95]){
  add(part(`foyer-column-${x}`,wood,[x,1.95,5.7],[.2,3.1,.2]),1.2,1.8);
  if(!(interior&&x>0)){
   add(part(`foyer-side-${x}`,cream,[x,1.9,4.3],[.16,3.0,2.8]),1.4,2.3);
   add(part(`foyer-side-window-${x}`,glass,[x*1.005,2.1,4.3],[.06,1.2,1.65]),2.35,2.8);
  }
 }
 for(const x of [-1.68,1.68])add(part(`main-entry-jamb-${x}`,wood,[x,1.95,5.84],[.16,3.1,.24]),2.4,2.8);
 if(!interior)add(part('main-entry-header',wood,[0,3.48,5.84],[8.4,.20,.24]),2.4,2.8);
 if(!interior&&!foyer){
  for(const x of [-2.85,2.85])add(part(`foyer-front-pier-${x}`,cream,[x,1.9,5.75],[2.1,3.0,.15]),1.4,2.35);
  add(part('foyer-attached-roof',roof,[0,3.66,4.3],[8.7,.15,3.2]),4.2,4.8);
 }
 if(!interior)add(part('foyer-ceiling-light','#f1ddaa',[0,3.36,4.35],[.55,.07,.35]),4.6,5.0);
 add(part('main-entry-step-a','#aaa693',[0,.12,6.15],[3.4,.24,.6]),.3,.6);
 add(part('main-entry-step-b','#b9b197',[0,.24,5.92],[3.4,.24,.4]),.3,.7);
 // Marked multi-use assembly/sports court, with a separate flag platform and clear access path.
 add(part('school-sports-court','#9eaa9f',[-10.2,.028,7.8],[8.0,.045,4.2]),.1,.5);
 for(const x of [-14.1,-6.3])add(part(`court-side-line-${x}`,'#f4ead5',[x,.056,7.8],[.055,.012,4.0]),.5,.9);
 for(const z of [5.8,9.8])add(part(`court-end-line-${z}`,'#f4ead5',[-10.2,.056,z],[7.85,.012,.055]),.5,.9);
 add(part('court-midline','#f4ead5',[-10.2,.056,7.8],[.055,.012,4.0]),.5,.9);
 for(let i=0;i<20;i++){const a=i*Math.PI/10,b=(i+1)*Math.PI/10;add(part(`court-circle-${i}`,'#f4ead5',[-10.2+.8*Math.cos((a+b)/2),.06,7.8+.8*Math.sin((a+b)/2)],[.26,.012,.04],'box',[0,-(a+b)/2-Math.PI/2,0]),.5,.9);}
 for(const x of [-14.65,-5.75]){
  add(part(`court-hoop-pole-${x}`,trim,[x,1.5,7.8],[.10,3.0,.10]),.6,1.1);
  add(part(`court-backboard-${x}`,'#d7ded1',[x,2.8,7.8],[.10,.70,1.1]),.8,1.2);
 }
 // Replace the old partial foreground rails with a continuous perimeter and named gate aperture.
 const retained=out.filter(p=>!p.id.startsWith('campus-front-')&&!p.id.startsWith('campus-fence-'));
 const fence=(id:string,x:number,z:number,dx:number,dz:number)=>{
  const length=Math.hypot(dx,dz),n=Math.ceil(length/1.4),az=Math.atan2(dx,dz);
  for(let i=0;i<=n;i++)retained.push(part(`${id}-post-${i}`,wood,[x+20+dx*i/n,.65,z+22+dz*i/n],[.12,1.3,.12]));
  for(const y of [.45,.95])retained.push(part(`${id}-rail-${y}`,trim,[x+20+dx/2,y,z+22+dz/2],[.09,.10,length],'box',[0,az,0]));
 };
 if(t>.9){fence('school-west-fence',-35.5,-18,0,8);fence('school-front-west',-35.5,-10,12.9,0);fence('school-front-east',-19.4,-10,.7,0);fence('school-east-fence',-18.7,-10,0,-6.0);}
 return retained;
}
