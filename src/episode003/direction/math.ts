export type V3=readonly [number,number,number];
export const FPS=30;
export const clamp=(v:number)=>!(v>0)?0:Math.min(1,v);
export const smooth=(v:number)=>{const t=clamp(v);return t*t*(3-2*t);};
export const range=(f:number,a:number,b:number)=>clamp((f-a)/Math.max(1e-6,b-a));
export const window=(f:number,a:number,b:number,ramp=8)=>clamp((f-a)/ramp)*clamp((b-f)/ramp);
export const lerp=(a:number,b:number,t:number)=>a+(b-a)*t;
export const mix3=(a:V3,b:V3,t:number):[number,number,number]=>[lerp(a[0],b[0],t),lerp(a[1],b[1],t),lerp(a[2],b[2],t)];
export function keyValue(frame:number,keys:readonly (readonly [number,number])[]):number{
  if(frame<=keys[0][0])return keys[0][1];
  for(let i=1;i<keys.length;i++)if(frame<=keys[i][0])return lerp(keys[i-1][1],keys[i][1],smooth(range(frame,keys[i-1][0],keys[i][0])));
  return keys[keys.length-1][1];
}
export function pathAt(frame:number,keys:readonly {frame:number;position:V3}[]):[number,number,number]{
  if(frame<=keys[0].frame)return [...keys[0].position];
  for(let i=1;i<keys.length;i++)if(frame<=keys[i].frame)return mix3(keys[i-1].position,keys[i].position,smooth(range(frame,keys[i-1].frame,keys[i].frame)));
  return [...keys[keys.length-1].position];
}
export const finiteFrame=(f:number)=>Number.isFinite(f)?Math.max(0,f):0;
