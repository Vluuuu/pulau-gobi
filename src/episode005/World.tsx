import React,{useEffect,useMemo} from 'react';
import {BufferAttribute,BufferGeometry,CanvasTexture,DoubleSide} from 'three';
import {buildTerrainBuffers,computeRocks} from '../episode003/world/terrain/render/terrainGeometry.ts';
import {RenovatedHouseEP003,WartegEP003,RiverEP003} from '../episode003/world';
import {IslandDecor} from '../episode002/IslandDecor3D';
import {RiceField} from '../episode002/RiceField';
import {Nature004} from '../episode004/production/Nature';
import {KostProxy} from '../episode004/pilot/KostProxy';
import {Parts} from '../episode004/production/Parts';
import {part} from '../episode004/production/part.ts';
import {farmParts,ranchParts} from '../episode004/production/buildModels.ts';
import {farmCrops,riceParts} from './models.ts';
import {campusParts,SCHOOL_NAME} from './campus.ts';
import {L,FARM,RANCH,SCHOOL,CHANNEL,LIP,GATE,ROUTE,SCHOOL_GATE,DOOR} from './layout.ts';
import {gap,ramp,editFrame as E,clamp} from './timeline.ts';
import {gateAngle,cowAt,schoolInterior,foyerInterior} from './direction.ts';
import {schoolGateOpenAt,mainDoorOpenAt,classDoorOpenAt} from './access.ts';
export function partialChannel(u:number){
 const total=CHANNEL.slice(1).reduce((n,b,i)=>n+Math.hypot(b[0]-CHANNEL[i][0],b[1]-CHANNEL[i][1]),0);
 let left=total*clamp(u);const out:[number,number][]=[[...CHANNEL[0]]];
 for(let i=1;i<CHANNEL.length;i++){const a=CHANNEL[i-1],b=CHANNEL[i],d=Math.hypot(b[0]-a[0],b[1]-a[1]);if(left>=d){out.push([...b]);left-=d;}else{out.push([a[0]+(b[0]-a[0])*left/d,a[1]+(b[1]-a[1])*left/d]);break;}}
 return out;
}
const Sign:React.FC<{text:string;position:[number,number,number];width:number;height:number;color?:string}>=({text,position,width,height,color='#fff5d9'})=>{
 const texture=useMemo(()=>{const c=document.createElement('canvas');c.width=1024;c.height=256;const ctx=c.getContext('2d')!;ctx.fillStyle='#365b55';ctx.fillRect(0,0,1024,256);ctx.strokeStyle='#c3a66b';ctx.lineWidth=18;ctx.strokeRect(10,10,1004,236);ctx.fillStyle=color;ctx.textAlign='center';ctx.textBaseline='middle';let size=118;ctx.font=`bold ${size}px Arial`;while(ctx.measureText(text).width>920){size-=2;ctx.font=`bold ${size}px Arial`;}ctx.fillText(text,512,134);return new CanvasTexture(c);},[text,color]);
 useEffect(()=>()=>texture.dispose(),[texture]);
 return <mesh position={position}><planeGeometry args={[width,height]}/><meshBasicMaterial map={texture} side={DoubleSide}/></mesh>;
};
const Terrain005:React.FC<{progress:number}>=({progress})=>{
 const g=useMemo(()=>{const river=progress>0?{...L.river,centerline:[...L.river.centerline,...partialChannel(progress).slice(1)]}:L.river;
  const b=buildTerrainBuffers(52,river),g=new BufferGeometry();g.setAttribute('position',new BufferAttribute(b.positions,3));g.setAttribute('color',new BufferAttribute(b.colors,3));g.setIndex(new BufferAttribute(b.indices,1));g.computeVertexNormals();return g;},[progress]);
 useEffect(()=>()=>g.dispose(),[g]);const rocks=useMemo(()=>computeRocks(1,52),[]);
 return <><mesh geometry={g} receiveShadow><meshStandardMaterial vertexColors flatShading/></mesh>{rocks.map((r,i)=><mesh key={i} position={r.position} rotation={r.rotation} scale={r.scale}>{r.kind==='spike'?<coneGeometry args={[.6,1,5]}/>:<dodecahedronGeometry args={[1,0]}/>}<meshStandardMaterial color={r.color} flatShading/></mesh>)}</>;
};
const FallingSheet:React.FC<{frame:number;foam:boolean;drop:number}>=({frame:f,foam,drop})=>{
 const geometry=useMemo(()=>{
  const positions:number[]=[],colors:number[]=[],indices:number[]=[],cols=8,rows=42;
  for(let row=0;row<=rows;row++)for(let col=0;col<=cols;col++){
   const u=row/rows,v=col/cols,width=3.15+Math.sin(Math.min(u,.7)/.7*Math.PI/2)*3.5,phase=f*.09+u*24+col*.8;
   positions.push((v-.5)*width+u*.45*Math.sin(u*8+f*.025),-u*84,.12+Math.sin(phase)*(.04+u*.24)+(foam?.1:0));
   const shine=(Math.sin(phase*1.8)>.65?.24:0)+Math.abs(v-.5)*.18;
   // Vertex alpha removes the terminal edge, rather than concealing a hard cutoff with one cloud.
   const alpha=1-ramp(u,.67,.995);
   colors.push(foam?.73+shine:.18+shine,foam?.94:.57+shine,foam?.94:.74+shine,alpha);
  }
  for(let row=0;row<rows;row++)for(let col=0;col<cols;col++){const a=row*(cols+1)+col,b=a+cols+1;indices.push(a,b,a+1,a+1,b,b+1);}
  const g=new BufferGeometry();g.setAttribute('position',new BufferAttribute(new Float32Array(positions),3));g.setAttribute('color',new BufferAttribute(new Float32Array(colors),4));g.setIndex(indices);g.computeVertexNormals();return g;
 },[f,foam]);useEffect(()=>()=>geometry.dispose(),[geometry]);
 return <mesh geometry={geometry} scale-y={drop}><meshBasicMaterial vertexColors transparent opacity={foam?.27:.98} depthWrite={false} side={DoubleSide}/></mesh>;
};
const Waterfall:React.FC<{frame:number}>=({frame:f})=>{
 const start=gap('G1').start+159,drop=ramp(f,start,start+28);if(!drop)return null;
 return <group name="waterfall-001" position={[...LIP]}>
  <FallingSheet frame={f} foam={false} drop={drop}/><FallingSheet frame={f+4} foam drop={drop}/>
  {Array.from({length:34},(_,i)=>{const u=((f*.018+i*.137)%1),x=Math.sin(i*25.7)*1.7;return <mesh key={i} position={[x+Math.sin(f*.07+i)*.12,-u*84*drop,.35]} scale={[.05+(i%3)*.03,.5+u*1.7,.045]}><boxGeometry args={[1,1,1]}/><meshBasicMaterial color="#e7ffff" transparent opacity={.8*(1-u)}/></mesh>;})}
  {Array.from({length:15},(_,i)=><mesh key={`foam${i}`} position={[Math.sin(i*3)*1.7,.1+Math.sin(f*.16+i)*.12,(i%3)*.22]} scale={[.4,.1,.25]}><icosahedronGeometry args={[1,0]}/><meshBasicMaterial color="#e4f7eb"/></mesh>)}
  {Array.from({length:18},(_,i)=>{const u=(f*.008+i*.15)%1;return <mesh key={`spray${i}`} position={[Math.sin(i*12)*(.8+u*3),-u*12,1+u*4]} scale={[.15+u*.5,.15+u*.7,.2]}><icosahedronGeometry args={[1,0]}/><meshBasicMaterial color="#d6f1f0" transparent opacity={.32*(1-u)} depthWrite={false}/></mesh>;})}
  {[0,1,2].flatMap(layer=>[0,1,2,3,4,5,6].map(i=><mesh key={`mist${layer}-${i}`} position={[(i-3)*(2.0+layer*.5)+Math.sin(f*.012+i)*.7,-63-layer*9.0+Math.sin(i*3)*1.3,layer*2+Math.sin(i*7)*3]} scale={[5.5+layer*1.2,2.8+layer*.8,4+layer]}><icosahedronGeometry args={[1,1]}/><meshBasicMaterial color={layer===0?'#d8e9ef':'#e4edf2'} transparent opacity={.19+layer*.06} depthWrite={false}/></mesh>))}
 </group>;
};
const SchoolFlag:React.FC<{frame:number}>=({frame:f})=>{
 const geometry=useMemo(()=>{const positions:number[]=[],colors:number[]=[],indices:number[]=[];
  for(let half=0;half<2;half++)for(let i=0;i<=12;i++)for(let edge=0;edge<2;edge++){
   const u=i/12;positions.push(u*2.3,.75-half*.75-edge*.75,Math.sin(f*.13-u*5)*.18*u);
   colors.push(...(half===0?[.82,.18,.18]:[.96,.96,.91]));
  }
  for(let h=0;h<2;h++)for(let i=0;i<12;i++){const a=h*26+i*2;indices.push(a,a+1,a+2,a+1,a+3,a+2);}
  const g=new BufferGeometry();g.setAttribute('position',new BufferAttribute(new Float32Array(positions),3));g.setAttribute('color',new BufferAttribute(new Float32Array(colors),3));g.setIndex(indices);g.computeVertexNormals();return g;
 },[f]);useEffect(()=>()=>geometry.dispose(),[geometry]);
 return <mesh position={[-14.3,6.35,10]} geometry={geometry}><meshStandardMaterial vertexColors side={DoubleSide} roughness={.9}/></mesh>;
};
export const World005:React.FC<{frame:number}>=({frame:f})=>{
 const G1=gap('G1'),carve=ramp(f,G1.start+21,G1.start+130),water=ramp(f,G1.start+36,G1.start+159),interior=schoolInterior(f),foyer=foyerInterior(f);
 const extension=useMemo(()=>partialChannel(water),[water]);
 const ranch=useMemo(()=>ranchParts(1).filter(p=>p.id!=='gate'),[]);
 const c=cowAt('cow-003',f),doorOpen=classDoorOpenAt(f,c.position);
 const mainOpen=mainDoorOpenAt(f),gateOpen=schoolGateOpenAt(f);
 return <group name="episode005-world">
  <Terrain005 progress={carve}/><RiverEP003 progress={1} frame={7000+f} {...L.river}/>
  {water>0&&<group name="river-001-extension"><RiverEP003 progress={1} frame={7000+f} centerline={extension} width={3} bedY={-.35} waterY={-.15}/></group>}
  <RenovatedHouseEP003 progress={1} frame={f} {...L.house}/><WartegEP003 progress={1} frame={f} {...L.warteg}/>
  <IslandDecor frame={f+9000} startFrame={0}/><Nature004 frame={9000+f}/><KostProxy progress={1} frame={f+9000} enhanced/>
  {f<E(39.15)?<group name="rice-plot-001" position={[...L.riceField.position]} rotation-y={L.riceField.rotationY}><RiceField progress={1} scale={L.riceField.scale} position={[0,0,0]} rotationY={0}/></group>:<group name="rice-plot-001" position={[...L.riceField.position]} rotation-y={L.riceField.rotationY} scale={L.riceField.scale}><Parts parts={riceParts(f)}/></group>}
  <group name="farm-004" position={[...FARM.position]} rotation-y={FARM.rotation}><Parts parts={[...farmParts(1,f),...farmCrops(f)]}/></group>
  <group name="ranch-004" position={[...RANCH.position]} rotation-y={RANCH.rotation}>
   <Parts parts={ranch}/><group position={[-1.2,0,3.8]} rotation-y={gateAngle(f)}><Parts parts={[part('gate','#6b8d70',[1.2,.68,0],[2.4,1.15,.12])]}/>
    <group position={[2.4,.98,.09]} rotation-z={f<E(90.6)?-.5:f<E(91.4)?-1.5*ramp(f,E(90.6),E(91.4)):f<E(103.1)?-.5:0}><Parts parts={[part('gate-latch','#8d7551',[-.18,0,0],[.48,.065,.065])]}/></group>
   </group>
   {f>=gap('G3').end&&<Parts parts={[part('feed-stock','#d6be75',[2,.79,-1.6],[2,.15,.45],'ico')]}/>}
  </group>
  <Parts parts={[part('waiting-bench','#a58255',[-2,.42,4.3],[1.5,.15,.55]),part('waiting-leg-a','#765b3b',[-2.55,.21,4.3],[.12,.42,.44]),part('waiting-leg-b','#765b3b',[-1.45,.21,4.3],[.12,.42,.44])]}/>
  {f>=E(67.67)&&<Parts parts={ROUTE.slice(1,-1).flatMap((p,i)=>{const a=ROUTE[i];return a[1]>.2||p[1]>.2?[]:[part(`school-path-${i}`,'#c6b38a',[(a[0]+p[0])/2,.012,(a[2]+p[2])/2],[1.65,.025,Math.hypot(p[0]-a[0],p[2]-a[2])],'box',[0,Math.atan2(p[0]-a[0],p[2]-a[2]),0])];})}/>}
  {f>=gap('G4').start+27&&<group name="school-gate" position={[...SCHOOL_GATE]}>
   <Parts parts={[part('school-gate-post-left','#8f6b48',[-1.68,1.65,0],[.23,3.3,.23]),part('school-gate-post-right','#8f6b48',[1.68,1.65,0],[.23,3.3,.23]),part('school-gate-arch','#577b77',[0,3.3,0],[3.6,.22,.28])]}/>
   {[-1,1].map(side=><group key={side} position={[side*1.6,0,0]} rotation-y={-side*gateOpen*1.48}><Parts parts={[part(`school-gate-leaf-${side}`,'#577b77',[-side*.8,.75,0],[1.55,1.45,.08])]}/></group>)}
  </group>}
  <group name="school-001" position={[...SCHOOL.position]}>
   <Parts parts={campusParts(f,interior,foyer)}/>
   {f>=gap('G4').start+42&&[-14.35,-6.05].map(x=><mesh key={`sports-hoop-${x}`} position={[x,2.48,7.8]} rotation-x={Math.PI/2}><torusGeometry args={[.22,.026,5,16]}/><meshStandardMaterial color="#b37c49"/></mesh>)}
   {f>=gap('G4').start+147&&!interior&&<><Sign text={SCHOOL_NAME} position={[-10,4.58,4.03]} width={8.0} height={.9}/>
    <Sign text="KELAS A01" position={[0,3.26,2.96]} width={2.7} height={.48}/>
    <Sign text="KELAS B01" position={[-5,3.26,-2.04]} width={2.7} height={.48}/>
    <Sign text="SAYAP BARAT" position={[-10,3.26,.96]} width={2.7} height={.48}/>
    <SchoolFlag frame={f}/>
   </>}
   {f>=gap('G4').start+84&&<>
    <group name="class-A01-door" position={[-1.42,.4,2.84]} rotation-y={-doorOpen*1.48}><Parts parts={[part('school-door','#a77c4f',[1.42,1.35,0],[2.78,2.7,.1]),part('school-door-handle','#d8bb72',[2.6,1.32,.09],[.08,.25,.07])]}/></group>
    {!interior&&<Sign text="KELAS A01" position={[0,3.26,3.0]} width={2.7} height={.48}/>}
    <Sign text="KORIDOR A" position={[2.6,2.6,5.9]} width={1.9} height={.4}/>
    {[-1,1].map(side=><group key={side} name={`main-entry-door-${side}`} position={[side*1.6,.4,5.84]} rotation-y={-side*mainOpen*1.48}><Parts parts={[part(`main-door-leaf-${side}`,'#a77c4f',[-side*.78,1.4,0],[1.5,2.8,.09])]}/></group>)}
   </>}
   {f>=gap('G4').start+144&&!interior&&<Sign text={SCHOOL_NAME} position={[0,3.56,6.01]} width={7.5} height={.68}/>}
   {f>=gap('G4').start+156&&<Sign text="SELAMAT DATANG" position={[0,2,-2.56]} width={3.7} height={.7}/>}
   {f>=gap('G4').start+147&&<group position={[-2.4,3.7,3.7]} rotation-z={f>=E(89)&&f<E(90.4)?Math.sin(f*.5)*.38:Math.sin(f*.03)*.025}><mesh><coneGeometry args={[.23,.38,9,1,true]}/><meshStandardMaterial color="#d7b15f" side={DoubleSide}/></mesh><mesh position-y={-.2}><sphereGeometry args={[.07,6,4]}/><meshStandardMaterial color="#7c6944"/></mesh></group>}
   {f>=gap('G4').start+147&&<Parts parts={[part('class-bell-rope','#c4a366',[-2.8,2.1,1.5],[.035,1.6,.035]),part('class-bell-pulley','#b99b5e',[-2.8,3.0,1.5],[.15,.15,.12],'cylinder'),part('class-bell-rope-guide','#c4a366',[-2.8,3.05,2.55],[.03,.03,2.1])]}/>}
  </group>
  {f>=E(48.57)&&<group position={[15.7,0,3.6]}><Parts parts={[part('warteg-stock-shelf','#a78253',[.45,.45,0],[1.5,.12,.65]),...Array.from({length:5},(_,i)=>part(`warteg-rice-stock-${i}`,'#ead4a3',[(i%3)*.45,.72+Math.floor(i/3)*.4,0],[.4,.42,.38],'ico'))]}/></group>}
  <Waterfall frame={f}/>
 </group>;
};
