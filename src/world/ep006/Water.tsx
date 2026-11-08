import React,{useEffect,useMemo} from 'react';
import {BufferGeometry,BufferAttribute,DoubleSide} from 'three';
import {buildTerrainBuffers,computeRocks} from '../../episode003/world/terrain/render/terrainGeometry.ts';
import {createRiverModel} from '../../episode003/world/river/riverMath.ts';
import {buildRiverBanks,buildRiverLining,buildRiverWater,buildRiverHighlights} from '../../episode003/world/river/riverGeometry.ts';
import type {RiverBuffers} from '../../episode003/world/river/riverGeometry.ts';
import {LIP} from '../../episode005/layout.ts';
import {RIVER_LINE,RIVER_WIDTH} from './layout.ts';
import {widthAt,taperRiverPositions,fishAt} from './waterModel.ts';
import {sampleRiverTrenchHeight} from '../../episode003/world/terrain/terrainMath.ts';

const geometry = (b:RiverBuffers) => {const g=new BufferGeometry();g.setAttribute('position',new BufferAttribute(b.positions,3));g.setAttribute('color',new BufferAttribute(b.colors,3));g.setIndex(new BufferAttribute(b.indices,1));g.computeVertexNormals();return g;};
export const Terrain006:React.FC<{widen:number}>=({widen})=>{
  const g=useMemo(()=>{const width=3+(RIVER_WIDTH-3)*widen,bedY=-.35-.3*widen,b=buildTerrainBuffers(52,{centerline:RIVER_LINE,width,bedY,waterY:-.15});
    for(let i=0;i<b.positions.length;i+=3){const x=b.positions[i],y=b.positions[i+1],z=b.positions[i+2];if(z<=40.5)continue;
      const old=sampleRiverTrenchHeight(x,z,RIVER_LINE,width,bedY,-.15);
      if(y>=old-.301)b.positions[i+1]+=sampleRiverTrenchHeight(x,z,RIVER_LINE,widthAt(z,widen),bedY,-.15)-old;
    }
    return geometry(b);},[widen]);
  const rocks=useMemo(()=>computeRocks(1,52),[]);
  useEffect(()=>()=>g.dispose(),[g]);
  return <group name="terrain-ep006"><mesh geometry={g} receiveShadow><meshStandardMaterial vertexColors flatShading/></mesh>{rocks.map((r,i)=><mesh key={i} position={r.position} rotation={r.rotation} scale={r.scale}>{r.kind==='spike'?<coneGeometry args={[.6,1,5]}/>:<dodecahedronGeometry args={[1,0]}/>}<meshStandardMaterial color={r.color} flatShading/></mesh>)}</group>;
};
export const River006:React.FC<{frame:number;widen:number}>=({frame,widen})=>{
  const model=useMemo(()=>createRiverModel({centerline:RIVER_LINE,width:3+(RIVER_WIDTH-3)*widen,bedY:-.35-.3*widen,waterY:-.15})!,[widen]);
  const tapered=(b:RiverBuffers)=>{taperRiverPositions(b.positions,widen);return geometry(b);};
  const banks=useMemo(()=>tapered(buildRiverBanks(model,1)),[model]),bed=useMemo(()=>tapered(buildRiverLining(model,1)),[model]);
  const water=useMemo(()=>tapered(buildRiverWater(model,1,frame)),[model,frame]),shine=useMemo(()=>tapered(buildRiverHighlights(model,1,frame)),[model,frame]);
  useEffect(()=>()=>{banks.dispose();bed.dispose();},[banks,bed]);useEffect(()=>()=>{water.dispose();shine.dispose();},[water,shine]);
  return <group name="river-001"><mesh geometry={bed} receiveShadow><meshStandardMaterial vertexColors flatShading/></mesh><mesh geometry={banks} castShadow><meshStandardMaterial vertexColors flatShading side={DoubleSide}/></mesh><mesh geometry={water} renderOrder={2}><meshStandardMaterial vertexColors transparent opacity={.62} depthWrite={false} roughness={.24}/></mesh><mesh geometry={shine} renderOrder={3}><meshStandardMaterial vertexColors transparent opacity={.6} depthWrite={false}/></mesh></group>;
};
// Original EP005 waterfall geometry/placement retained as an EP006 asset adapter.
const FallingSheet:React.FC<{frame:number;foam:boolean}>=({frame:f,foam})=>{
  const g=useMemo(()=>{const p:number[]=[],c:number[]=[],idx:number[]=[],cols=8,rows=42;
    for(let row=0;row<=rows;row++)for(let col=0;col<=cols;col++){const u=row/rows,v=col/cols,width=3.15+Math.sin(Math.min(u,.7)/.7*Math.PI/2)*3.5,phase=f*.09+u*24+col*.8;
      p.push((v-.5)*width+u*.45*Math.sin(u*8+f*.025),-u*84,.12+Math.sin(phase)*(.04+u*.24)+(foam?.1:0));
      const shine=(Math.sin(phase*1.8)>.65?.24:0)+Math.abs(v-.5)*.18,t=Math.max(0,Math.min(1,(u-.67)/.325));c.push(foam?.73+shine:.18+shine,foam?.94:.57+shine,foam?.94:.74+shine,1-t*t*(3-2*t));}
    for(let row=0;row<rows;row++)for(let col=0;col<cols;col++){const a=row*(cols+1)+col,b=a+cols+1;idx.push(a,b,a+1,a+1,b,b+1);}
    const g=new BufferGeometry();g.setAttribute('position',new BufferAttribute(new Float32Array(p),3));g.setAttribute('color',new BufferAttribute(new Float32Array(c),4));g.setIndex(idx);g.computeVertexNormals();return g;
  },[f,foam]);useEffect(()=>()=>g.dispose(),[g]);
  return <mesh geometry={g}><meshBasicMaterial vertexColors transparent opacity={foam?.27:.98} depthWrite={false} side={DoubleSide}/></mesh>;
};
export const Waterfall006:React.FC<{frame:number}>=({frame:f})=><group name="waterfall-001" position={[...LIP]}>
  {/* The owning river and trench taper to this retained 3.15-unit mouth. */}
  <FallingSheet frame={f} foam={false}/><FallingSheet frame={f+4} foam/>
  {Array.from({length:34},(_,i)=>{const u=(f*.018+i*.137)%1;return <mesh key={i} position={[Math.sin(i*25.7)*1.7+Math.sin(f*.07+i)*.12,-u*84,.35]} scale={[.05+(i%3)*.03,.5+u*1.7,.045]}><boxGeometry args={[1,1,1]}/><meshBasicMaterial color="#e7ffff" transparent opacity={.8*(1-u)}/></mesh>;})}
  {Array.from({length:15},(_,i)=><mesh key={`foam${i}`} position={[Math.sin(i*3)*1.7,.1+Math.sin(f*.16+i)*.12,(i%3)*.22]} scale={[.4,.1,.25]}><icosahedronGeometry args={[1,0]}/><meshBasicMaterial color="#e4f7eb"/></mesh>)}
  {Array.from({length:18},(_,i)=>{const u=(f*.008+i*.15)%1;return <mesh key={`spray${i}`} position={[Math.sin(i*12)*(.8+u*3),-u*12,1+u*4]} scale={[.15+u*.5,.15+u*.7,.2]}><icosahedronGeometry args={[1,0]}/><meshBasicMaterial color="#d6f1f0" transparent opacity={.32*(1-u)} depthWrite={false}/></mesh>;})}
  {[0,1,2].flatMap(layer=>[0,1,2,3,4,5,6].map(i=><mesh key={`mist${layer}-${i}`} position={[(i-3)*(2+layer*.5)+Math.sin(f*.012+i)*.7,-63-layer*9+Math.sin(i*3)*1.3,layer*2+Math.sin(i*7)*3]} scale={[5.5+layer*1.2,2.8+layer*.8,4+layer]}><icosahedronGeometry args={[1,1]}/><meshBasicMaterial color={layer===0?'#d8e9ef':'#e4edf2'} transparent opacity={.19+layer*.06} depthWrite={false}/></mesh>))}
</group>;

export const Fish006:React.FC<{frame:number;reveal:number;jumpFrame:number}>=({frame,reveal,jumpFrame})=><group name="river-fish-006">
  {Array.from({length:14},(_,i)=>{const p=fishAt(i,frame,jumpFrame);return <group key={i} position={p.position} rotation-y={p.heading} scale={reveal}>
    <mesh scale={[.10,.10,.31]}><icosahedronGeometry args={[1,1]}/><meshStandardMaterial color={i%3===0?'#e4b357':'#90bfc1'} flatShading/></mesh>
    <group position-z={-.28} rotation-y={Math.sin(frame*.33+i)*.45}><mesh rotation-z={Math.PI/2} scale={[.11,.17,.045]}><coneGeometry args={[1,1,3]}/><meshStandardMaterial color="#5d969f"/></mesh></group>
    {[-1,1].map(side=><mesh key={side} position={[side*.083,.035,.16]}><sphereGeometry args={[.022,5,4]}/><meshBasicMaterial color="#182e37"/></mesh>)}
  </group>;})}
  {frame>=jumpFrame+17&&frame<jumpFrame+39&&Array.from({length:14},(_,i)=>{const t=(frame-jumpFrame-17)/22;return <mesh key={`splash${i}`} position={[-10.7+Math.sin(i*2.4)*t*.4,1.55+t*.7-t*t*.8,23+Math.cos(i*2.4)*t*.45]} scale={.035*(1-t)}><icosahedronGeometry args={[1,0]}/><meshBasicMaterial color="#d9f5f5"/></mesh>;})}
</group>;
