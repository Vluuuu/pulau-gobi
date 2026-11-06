export type Vec3 = readonly [number, number, number];
export type WartegPlacement = {position: Vec3; rotationY: number; scale: number};
export const DEFAULT_WARTEG_PLACEMENT: WartegPlacement = Object.freeze({position: Object.freeze([14,0,6] as const),rotationY:3*Math.PI/4,scale:1.5});
export const WARTEG = Object.freeze({width:4.8,depth:3.6,postX:2.25,postZ:1.62,postHeight:2.78,
  counterX:-0.425,counterZ:0.94,counterWidth:3.15,counterDepth:0.84,counterTop:1.02,
  caseX:-0.65,caseZ:0.94,caseWidth:2.45,caseDepth:0.74,caseTop:1.84,
  roofHalfWidth:2.78,roofDepth:4.35,roofEave:2.7,roofRidge:3.52});
export const WARTEG_LOCAL_ANCHORS: {vendor:Vec3;customer:Vec3;counterFocus:Vec3} = Object.freeze({
  vendor:Object.freeze([0.72,0,-0.18] as const),customer:Object.freeze([0.72,0,1.95] as const),
  counterFocus:Object.freeze([-0.65,1.43,1.13] as const),
});
export const WARTEG_ACCESS = Object.freeze({bodyRadius:0.36,headHeight:1.7,
  entry:Object.freeze([1.62,0,2.5] as const),aisle:Object.freeze([1.62,0,-0.18] as const),
  paymentFocus:Object.freeze([0.77,1.06,1.32] as const)});
export const WARTEG_COLORS = Object.freeze({wood:'#e0a96d',woodAlt:'#d59b5c',post:'#a56a37',dark:'#5e3820',
  sage:'#54816a',sageLight:'#77977a',roof:'#b35c43',roofEdge:'#81452f',cream:'#f6e4b9',ink:'#28584a',
  metal:'#bbc9c2',tray:'#e4e8d8',rice:'#fff5d5',fried:'#d6983f',friedEdge:'#ad6d2e',green:'#4d8e44',
  greenLight:'#88b65d',egg:'#fff1d8',sauce:'#b95635',stone:'#8b909c',dust:'#efe2cb',glint:'#ffe7ae'});
export type WartegMaterial = keyof typeof WARTEG_COLORS;
export type WartegPart = {id:string;material:WartegMaterial;position:Vec3;size:Vec3;rotation?:Vec3;kind?:'box'|'sphere'|'ico'|'cylinder'};
export type GlassPane = {id:string;position:Vec3;size:readonly [number,number];rotationY:number;opacity:number};
export const clampProgress=(p:number):number=>!(p>0)?0:Math.min(1,p);
export const phase=(p:number,a:number,b:number):number=>clampProgress((p-a)/(b-a));
export const smooth=(t:number):number=>{const k=clampProgress(t);return k*k*(3-2*k);};
const out=(t:number):number=>1-(1-clampProgress(t))**3;
export const frameSeconds=(frame=0):number=>Number.isFinite(frame)?frame/30:0;
const hash=(n:number):number=>((Math.imul(n+101,1597334677)^Math.imul(n+31,3812015801))>>>0)/4294967296;
const box=(id:string,material:WartegMaterial,position:Vec3,size:Vec3,rotation?:Vec3):WartegPart=>({id,material,position,size,rotation});

export function resolveWartegPlacement(input:{position?:Vec3;rotationY?:number;scale?:number}={}):WartegPlacement{
  const d=DEFAULT_WARTEG_PLACEMENT;
  return {position:input.position?.length===3&&input.position.every(Number.isFinite)?[...input.position] as [number,number,number]:d.position,
    rotationY:Number.isFinite(input.rotationY)?input.rotationY!:d.rotationY,
    scale:Number.isFinite(input.scale)&&input.scale!>0?input.scale!:d.scale};
}
export function wartegLocalToWorld(point:Vec3,placement:WartegPlacement=DEFAULT_WARTEG_PLACEMENT):Vec3{
  const c=Math.cos(placement.rotationY),s=Math.sin(placement.rotationY),k=placement.scale;
  return [placement.position[0]+k*(point[0]*c+point[2]*s),placement.position[1]+k*point[1],placement.position[2]+k*(-point[0]*s+point[2]*c)];
}
export function wartegPose(progress:number,frame=0){
  const p=clampProgress(progress),u=phase(p,0.92,1),time=frameSeconds(frame);
  return {progress:p,structure:out(phase(p,0.1,0.3)),counter:out(phase(p,0.3,0.48)),
    display:out(phase(p,0.48,0.72)),roof:out(phase(p,0.72,0.92)),sign:out(phase(p,0.83,0.92)),
    roofSettle:p>0.92&&p<1?-0.018*Math.sin(u*Math.PI*3)*Math.sin(Math.PI*u)*(1-u):0,
    signSway:p>0.83&&p<0.92?Math.sin(time*2.1)*0.018*Math.sin(Math.PI*phase(p,0.83,0.92)):0};
}

/** Fixed bitmap lettering: geometry only, no Canvas/font/CDN/browser dependency. */
export const WARTEG_GLYPHS:Record<string,readonly string[]>={
  W:['10001','10001','10001','10101','10101','11011','10001'],
  A:['01110','10001','10001','11111','10001','10001','10001'],
  R:['11110','10001','10001','11110','10100','10010','10001'],
  T:['11111','00100','00100','00100','00100','00100','00100'],
  E:['11111','10000','10000','11110','10000','10000','11111'],
  G:['01111','10000','10000','10111','10001','10001','01110'],
  N:['10001','11001','11001','10101','10011','10011','10001'],
  S:['01111','10000','10000','01110','00001','00001','11110'],
  I:['11111','00100','00100','00100','00100','00100','11111'],
  L:['10000','10000','10000','10000','10000','10000','11111'],
  U:['10001','10001','10001','10001','10001','10001','01110'],
  K:['10001','10010','10100','11000','10100','10010','10001'],
};
export function letteringParts(text:string,center:Vec3,cell:number,prefix:string):WartegPart[]{
  const width=(text.length*6-1)*cell,parts:WartegPart[]=[];
  [...text].forEach((letter,i)=>{
    const glyph=WARTEG_GLYPHS[letter];if(!glyph)return;
    glyph.forEach((row,y)=>{
      let x=0;while(x<5){if(row[x]!=='1'){x++;continue;}const start=x;while(x<5&&row[x]==='1')x++;
        parts.push(box(`${prefix}-${i}-${y}-${start}`,'ink',[center[0]-width/2+(i*6+(start+x)/2)*cell,center[1]+(3-y)*cell,center[2]],[(x-start)*cell,cell*0.92,0.016]));}
    });
  });return parts;
}

/** Bottom anchored growth for framing; short drop/settle for assembled fixtures. */
function reveal(part:WartegPart,p:number,a:number,b:number,mode:'grow'|'drop'='grow'):WartegPart|null{
  const t=phase(p,a,b);if(t<=0)return null;
  const k=out(t),[x,y,z]=part.position;
  if(mode==='grow')return {...part,position:[x,y-part.size[1]*(1-k)/2,z],size:[part.size[0],part.size[1]*k,part.size[2]]};
  const bounce=t<1?Math.sin(t*Math.PI*2)*(1-t)*0.025:0;
  const growth=smooth(t/0.3);
  return {...part,position:[x,y+(1-k)*0.46+bounce,z],size:[part.size[0]*growth,part.size[1]*growth,part.size[2]*growth]};
}

export function buildWartegStructure(progress:number):WartegPart[]{
  const p=clampProgress(progress),parts:WartegPart[]=[];
  const add=(part:WartegPart,a:number,b:number)=>{const v=reveal(part,p,a,b);if(v)parts.push(v);};
  for(const x of [-1,1])for(const z of [-1,1]){
    add(box(`foundation-foot-${x}-${z}`,'stone',[x*WARTEG.postX,0.06,z*WARTEG.postZ],[0.36,0.12,0.36]),0.1,0.17);
    add(box(`post-${x}-${z}`,'post',[x*WARTEG.postX,0.12+WARTEG.postHeight/2,z*WARTEG.postZ],[0.23,WARTEG.postHeight,0.23]),0.15,0.28);
  }
  // Perimeter plinths leave the vendor floor at Y=0, matching the exported anchors.
  add(box('rear-plinth','stone',[0,0.07,-1.68],[4.55,0.14,0.24]),0.12,0.2);
  add(box('left-plinth','stone',[-2.25,0.07,0],[0.24,0.14,3.3]),0.12,0.2);
  for(let i=0;i<4;i++){
    add(box(`rear-board-${i}`,i%2?'woodAlt':'wood',[0,0.26+i*0.25,-1.64],[4.5,0.23,0.13]),0.17+i*0.017,0.24+i*0.017);
    add(box(`left-board-${i}`,i%2?'woodAlt':'wood',[-2.25,0.26+i*0.25,0],[0.13,0.23,3.25]),0.18+i*0.017,0.25+i*0.017);
    add(box(`right-rear-board-${i}`,i%2?'woodAlt':'wood',[2.25,0.26+i*0.25,-1.15],[0.13,0.23,0.95]),0.18+i*0.017,0.25+i*0.017);
  }
  for(const z of [-1,1])add(box(`header-z${z}`,'dark',[0,2.78,z*WARTEG.postZ],[4.75,0.18,0.18]),0.23,0.3);
  for(const x of [-1,1])add(box(`header-x${x}`,'dark',[x*WARTEG.postX,2.78,0],[0.18,0.18,3.35]),0.23,0.3);
  for(const x of [-1,1])for(const z of [-1,1])add(box(`knee-${x}-${z}`,'dark',[x*2.04,2.55,z*1.63],[0.11,0.58,0.12],[0,0,-x*Math.PI/4]),0.24,0.3);
  for(let i=0;i<6;i++)add(box(`rear-louver-${i}`,'sage',[0,1.4+i*0.17,-1.65],[4.3,0.07,0.10]),0.23,0.30);
  return parts;
}

export function buildWartegCounter(progress:number):WartegPart[]{
  const p=clampProgress(progress),parts:WartegPart[]=[];
  const add=(part:WartegPart,a:number,b:number,mode:'grow'|'drop'='grow')=>{const v=reveal(part,p,a,b,mode);if(v)parts.push(v);};
  for(const x of [-1.86,1.01])for(const z of [0.61,1.27])add(box(`counter-leg-${x}-${z}`,'dark',[x,0.47,z],[0.16,0.94,0.16]),0.3,0.38);
  add(box('counter-front-apron','sage',[-0.425,0.53,1.28],[3.0,0.72,0.1]),0.33,0.43);
  for(let i=0;i<9;i++)add(box(`counter-front-stile-${i}`,'sageLight',[-1.88+i*0.36,0.53,1.343],[0.035,0.7,0.035]),0.34,0.44);
  add(box('counter-footrail','post',[-0.425,0.15,1.35],[3.14,0.10,0.12]),0.34,0.44);
  add(box('counter-apron-cap','post',[-0.425,0.89,1.35],[3.2,0.12,0.12]),0.35,0.45);
  add(box('counter-top','wood',[-0.425,0.97,0.94],[3.15,0.10,0.84]),0.32,0.46,'drop');
  add(box('counter-edge','dark',[-0.425,0.963,1.373],[3.23,0.065,0.045]),0.38,0.48,'drop');
  return parts;
}

export const WARTEG_STOCK=Object.freeze([
  Object.freeze({id:'rice',x:-1.28,z:1.105,shelfY:1.09,portions:2}),
  Object.freeze({id:'tempe',x:-0.16,z:1.105,shelfY:1.09,portions:3}),
  Object.freeze({id:'greens',x:-1.28,z:0.765,shelfY:1.30,portions:4}),
  Object.freeze({id:'eggs',x:-0.16,z:0.765,shelfY:1.30,portions:2}),
]);
export function buildWartegDisplay(progress:number):WartegPart[]{
  const p=clampProgress(progress),parts:WartegPart[]=[];
  const add=(part:WartegPart,a:number,b:number,mode:'grow'|'drop'='drop')=>{const v=reveal(part,p,a,b,mode);if(v)parts.push(v);};
  add(box('display-base','cream',[-0.65,1.055,0.94],[2.48,0.07,0.77]),0.48,0.54);
  for(const x of [-1.86,0.56])for(const z of [0.58,1.30])add(box(`display-upright-${x}-${z}`,'metal',[x,1.46,z],[0.043,0.79,0.043]),0.50,0.59,'grow');
  add(box('display-cap','metal',[-0.65,1.835,0.94],[2.52,0.055,0.79]),0.55,0.63);
  add(box('display-cap-wood','sage',[-0.65,1.865,0.94],[2.55,0.035,0.81]),0.56,0.64);
  add(box('display-raised-shelf','cream',[-0.65,1.265,0.755],[2.38,0.04,0.33]),0.52,0.60);
  for(const x of [-1.76,0.46])add(box(`display-shelf-leg-${x}`,'metal',[x,1.17,0.755],[0.04,0.17,0.28]),0.52,0.60,'grow');
  WARTEG_STOCK.forEach((tray,i)=>{
    const a=0.56+i*0.018,b=0.62+i*0.018,y=tray.shelfY;
    add(box(`tray-${tray.id}-base`,'tray',[tray.x,y,tray.z],[1.01,0.035,0.285]),a,b);
    for(const z of [-1,1])add(box(`tray-${tray.id}-rim-z${z}`,'metal',[tray.x,y+0.024,tray.z+z*0.135],[1.03,0.05,0.025]),a,b);
    for(const x of [-1,1])add(box(`tray-${tray.id}-rim-x${x}`,'metal',[tray.x+x*0.495,y+0.024,tray.z],[0.025,0.05,0.25]),a,b);
    for(let n=0;n<tray.portions;n++){
      const start=a+0.022+n*0.003,end=Math.min(0.72,b+0.025+n*0.003);
      const x=tray.x+(n-(tray.portions-1)/2)*(tray.id==='greens'?0.17:tray.id==='tempe'?0.24:0.35);
      if(tray.id==='rice')add({id:`food-rice-${n}`,material:'rice',position:[x,y+0.095,tray.z],size:[0.17,0.085,0.115],kind:'sphere'},start,end);
      if(tray.id==='tempe'){
        add(box(`food-tempe-${n}`,'fried',[x,y+0.065,tray.z],[0.18,0.09,0.18],[0,0.15*(n-1),0]),start,end);
        add(box(`food-tempe-sear-${n}`,'friedEdge',[x,y+0.112,tray.z],[0.13,0.009,0.018],[0,0.15*(n-1),0]),start,end);
      }
      if(tray.id==='greens')add({id:`food-greens-${n}`,material:n%2?'greenLight':'green',position:[x,y+0.08,tray.z],size:[0.13,0.075,0.12],kind:'ico'},start,end);
      if(tray.id==='eggs'){
        add({id:`food-eggs-${n}`,material:'egg',position:[x,y+0.075,tray.z],size:[0.15,0.07,0.11],kind:'sphere'},start,end);
        add({id:`food-eggs-sauce-${n}`,material:'sauce',position:[x,y+0.132,tray.z],size:[0.083,0.02,0.06],kind:'sphere'},start,end);
      }
    }
  });
  for(let i=0;i<2;i++)add({id:`serving-plate-${i}`,material:'tray',position:[0.85,1.042+i*0.022,0.84],size:[0.19,0.022,0.19],kind:'cylinder'},0.65,0.72);
  return parts;
}
export function buildWartegGlass(progress:number):GlassPane[]{
  const k=smooth(phase(clampProgress(progress),0.55,0.66));if(k<=0)return [];
  const bottom=1.09,height=0.70*k,cy=bottom+height/2;
  return [{id:'glass-front',position:[-0.65,cy,1.305],size:[2.37,height],rotationY:0,opacity:0.12*k},
    {id:'glass-left',position:[-1.855,cy,0.94],size:[0.69,height],rotationY:-Math.PI/2,opacity:0.10*k},
    {id:'glass-right',position:[0.555,cy,0.94],size:[0.69,height],rotationY:Math.PI/2,opacity:0.10*k}];
}

export function buildWartegRoof(progress:number,frame=0):WartegPart[]{
  const p=clampProgress(progress),pose=wartegPose(p,frame),parts:WartegPart[]=[];
  const angle=Math.atan2(WARTEG.roofRidge-WARTEG.roofEave,WARTEG.roofHalfWidth);
  const length=Math.hypot(WARTEG.roofHalfWidth,WARTEG.roofRidge-WARTEG.roofEave);
  for(const side of [-1,1]){
    const k=out(phase(p,side<0?0.72:0.76,side<0?0.855:0.90));if(k<=0)continue;
    const y=(WARTEG.roofRidge+WARTEG.roofEave)/2+Math.cos(angle)*0.065+(1-k)*0.85+pose.roofSettle;
    parts.push(box(`roof-slab-${side}`,'roof',[side*(WARTEG.roofHalfWidth/2+Math.sin(angle)*0.065),y,0],[length*k,0.13,WARTEG.roofDepth*k],[0,0,-side*(angle+(1-k)*0.1)]));
    for(const z of [-1,1])parts.push(box(`roof-fascia-${side}-${z}`,'roofEdge',[side*(WARTEG.roofHalfWidth/2+Math.sin(angle)*0.065),y,z*(WARTEG.roofDepth*k/2+0.025)],[length*k,0.17,0.055],[0,0,-side*(angle+(1-k)*0.1)]));
  }
  const add=(part:WartegPart,a:number,b:number)=>{const v=reveal(part,p,a,b,'drop');if(v)parts.push({...v,position:[v.position[0],v.position[1]+pose.roofSettle,v.position[2]]});};
  add(box('roof-ridge','sage',[0,3.61,0],[0.19,0.16,4.39],[0,0,Math.PI/4]),0.85,0.92);
  for(let i=0;i<14;i++)add(box(`awning-valance-${i}`,i%2?'cream':'sageLight',[-2.57+i*0.395,2.63,2.16],[0.39,0.20,0.065]),0.84,0.92);
  const signK=pose.sign;
  if(signK>0){
    const signParts=[box('warteg-sign-board','cream',[0,2.46,2.20],[2.72,0.60,0.10]),
      ...[-1,1].map(side=>box(`warteg-sign-frame-z${side}`,'dark',[0,2.46+side*0.30,2.218],[2.83,0.06,0.12])),
      ...[-1,1].map(side=>box(`warteg-sign-frame-x${side}`,'dark',[side*1.39,2.46,2.218],[0.06,0.60,0.12])),
      ...letteringParts('WARTEG',[0,2.46,2.262],0.065,'warteg-sign-letter')];
    const c=Math.cos(pose.signSway),s=Math.sin(pose.signSway);
    for(const part of signParts){const x=part.position[0]*signK,y=(part.position[1]-2.46)*signK;
      parts.push({...part,position:[x*c-y*s,2.46+x*s+y*c+(1-signK)*0.35+pose.roofSettle,part.position[2]],
        size:[part.size[0]*signK,part.size[1]*signK,part.size[2]],rotation:[0,0,pose.signSway]});}
  }
  return parts;
}

export function buildWartegDetails(progress:number):WartegPart[]{
  const p=clampProgress(progress),parts:WartegPart[]=[];
  const k=smooth(phase(p,0.24,0.3));
  if(k>0){
    const menu=[box('menu-board','cream',[-0.65,1.42,-1.535],[1.45,0.89,0.07]),
      ...letteringParts('NASI',[-0.65,1.61,-1.492],0.041,'menu-nasi'),...letteringParts('LAUK',[-0.65,1.23,-1.492],0.041,'menu-lauk')];
    menu.forEach(part=>parts.push({...part,size:[part.size[0]*k,part.size[1]*k,part.size[2]]}));
  }
  return parts;
}
export function buildWartegEffects(progress:number,frame=0):WartegPart[]{
  const p=clampProgress(progress),parts:WartegPart[]=[],time=frameSeconds(frame);
  for(const [a,b,y] of [[0.1,0.3,0.08],[0.92,1,2.7]]){
    const u=phase(p,a,b);if(u<=0||u>=1)continue;
    for(let i=0;i<7;i++){
      const angle=i/7*Math.PI*2,r=2.1+u*0.35,size=Math.sin(Math.PI*u)*(0.055+hash(i)*0.045);
      parts.push({id:`dust-${a}-${i}`,material:'dust',position:[Math.cos(angle)*r,y+u*0.18,Math.sin(angle)*r*0.8],size:[size,size*0.7,size],kind:'ico'});
    }
  }
  const u=phase(p,0.93,1);
  if(u>0&&u<1)for(let i=0;i<4;i++){
    const k=Math.sin(Math.PI*u)*(0.04+0.015*Math.sin(time*3+i));
    parts.push({id:`reveal-${i}`,material:'glint',position:[(i-1.5)*1.05,3.1+u*0.35,2.32],size:[k,k*1.4,k],rotation:[0,time*0.3,Math.PI/4]});
  }
  return parts;
}
export function wartegParts(progress:number,frame=0):WartegPart[]{
  return [...buildWartegStructure(progress),...buildWartegCounter(progress),...buildWartegDisplay(progress),
    ...buildWartegRoof(progress,frame),...buildWartegDetails(progress),...buildWartegEffects(progress,frame)];
}
