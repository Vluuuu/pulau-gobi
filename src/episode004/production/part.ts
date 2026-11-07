import type {V3} from './layout.ts';
export type Part={id:string;color:string;position:V3;size:V3;rotation?:V3;kind?:'box'|'ico'|'cone'|'cylinder'};
export const part=(id:string,color:string,position:V3,size:V3,kind:Part['kind']='box',rotation?:V3):Part=>({id,color,position,size,kind,rotation});
