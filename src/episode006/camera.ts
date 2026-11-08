import {shotAt,SPLASH_FRAME} from './shots.ts';
import {gobiAt,studentAt,adultAt} from './direction.ts';
import {COW_HOME,BRIDGE,OBSERVATION,HEADMASTER_OBS,TEACHER_OBS,FISH_TAKEOFF} from '../world/ep006/layout.ts';
import type {V3} from '../world/ep006/layout.ts';
import {E,ramp,OUTRO_START} from './timeline.ts';
import {lerp3} from './performance.ts';
import {SPLASH_CONTACT} from '../world/ep006/waterModel.ts';
export type Camera006={position:V3;target:V3;fov:number;near:number;az:number;room:'A01'|'foyer'|null;intent:string};
// Editorial intent for every beat; no default orbit or object-centering fallback.
export const DIRECTED_SHOTS:Record<string,string>={
 S01:'Eye-level hook: face and open hands, clear forecourt',S02:'Interior cow memory: low reaction insert',S03:'3Q presentation with school behind shoulder',S04:'Medium: candid registration dialogue',S05:'Original comments over campus geography',
 S06:'Front row left pair: faces',S07:'Front row right pair: faces',S08:'Back row left pair from west, clear of front rank',S09:'Back row right pair from east, then campus context',
 S10:'Gate threshold: follow the arriving group',S11:'Inside foyer: door and corridor access',S12:'Rear-corner interior wide, then student reverse',S13:'Damia medium inside the complete classroom',S14:'Ghanim formal medium at gate',S15:'Teacher action, pupil reverse, board detail, foyer reaction',
 S16:'Damar comment with river context',S17:'Bank shaping detail, then full reach reveal',S18:'Waterline fish tracking with foreground depth',S19:'Downstream and waterfall continuity reveal',S20:'Lead the compact field group from side',S21:'Both dry banks and insufficient span in one view',S22:'Gobi stop/measure reaction',S23:'Foundation, boards, railing: three motivated construction inserts',
 S24:'Low lateral crossing: feet on boards',S25:'Deck wide: two compact ranks and separate adult bays',S26:'Damia shoulder toward pupils and fish',S27:'Principal close-up, deliberately serious',S28:'Underwater anticipation, leap, impact match cut',S29:'Wet headmaster reaction, then Gobi and pupils',
 S30:'Velora comment with three retained cows',S31:'One portrait per named cow',S32:'Two cows in frame for wrong-cow reaction',S33:'School geography and return group',S34:'Completed span insert, then follow the actual return group',S35:'Readable dusk close-up',S36:'Invitation and short motivated location inserts',S37:'Hold same axis before CTA',S38:'Current EP006 campus: continuous gentle release and full CTA',
};
const view=(id:string,position:V3,target:V3,fov=50,room:Camera006['room']=null):Camera006=>({position,target,fov,room,near:.06,az:Math.atan2(position[0]-target[0],position[2]-target[2])*180/Math.PI,intent:DIRECTED_SHOTS[id]});
export const CLASS_CAMERAS={
 wide:{position:[-23.65,3.10,-19.48] as V3,target:[-20.2,1.45,-22.6] as V3,fov:110},
 teacher:{position:[-19.25,2.10,-22.25] as V3,target:[-22.15,1.95,-23.7] as V3,fov:58},
 board:{position:[-20.0,2.72,-19.48] as V3,target:[-20.1,2.22,-24.45] as V3,fov:78},
 reverse:{position:[-19.1,2.15,-23.95] as V3,target:[-21.8,1.62,-21.5] as V3,fov:67},
};
export function cameraAt(f:number):Camera006{
 const s=shotAt(f),id=s.id,q=f-s.start,u=ramp(f,s.start,s.end),g=gobiAt(f),p=g.position;
 const v=(eye:V3,target:V3,fov=50,room:Camera006['room']=null)=>view(id,eye,target,fov,room);
 const portrait=(offset:V3=[.95,1.95,4.2],fov=49)=>v([p[0]+offset[0],p[1]+offset[1],p[2]+offset[2]],[p[0],p[1]+1.38,p[2]],fov);
 const interior=(name:keyof typeof CLASS_CAMERAS)=>{const c=CLASS_CAMERAS[name];return v(c.position,c.target,c.fov,'A01');};
 switch(id){
 case 'S01':return portrait([.75,1.85,3.9],48);
 case 'S02':return v([-20.3,1.90,-19.48],[-20,1.45,-21.0],77,'A01');
 case 'S03':return portrait([1.7,1.95,4.4],48);
 case 'S04':return portrait([.35,1.9,4.4],46);
 case 'S05':return v([-12.5,9,2],[-25,1,-17.2],59);
 case 'S06':case 'S07':case 'S08':case 'S09':{
  const pair=Number(id.slice(1))-6,i=pair*2,a=studentAt(i,f).position,b=studentAt(i+1,f).position,x=(a[0]+b[0])/2,z=(a[2]+b[2])/2;
  if(id==='S09'&&q>58)return v([-12.5,9,2],[-24,1,-16.8],56);
  const side=pair===2?-1:pair===3?1:0;
  return v([x+side*3.5,1.65,z+(side?2.3:3.9)],[x,1.0,z],side?51:49);
 }
 case 'S13':return interior('teacher');
 case 'S14':{const a=adultAt('warga-21',f).position;return v([a[0]+1.1,2,a[2]+4.3],[a[0],a[1]+1.25,a[2]],48);}
 case 'S10':{const a=studentAt(4,f).position;return v([a[0]+3.6,3.1,a[2]+5.8],[a[0]-.1,1.0,a[2]-.6],57);}
 case 'S11':return v([-19.45,2.12,-17.0],[-20.0,1.25,-19.4],70,'foyer');
 case 'S12':return q<30||f>=E(29.31)-75?interior('wide'):interior('reverse');
 case 'S15':
  if(f<E(31.65))return interior('teacher');
  if(f<E(32.70))return interior('reverse');
  if(f<E(33.08))return interior('board');
  return v([-16.45,2.05,-18.8],[p[0],p[1]+1.4,p[2]],62,'foyer');
 case 'S16':return v([-27,5,24],[-18,0,15.5],55);
 case 'S17':return q<82?v([-21.3,2.1,18.8],[-17.4,-.1,15.4],57):v([-27.5,10,28],[-19,0,14.8],54);
 case 'S18':return v([-18.7,1.35,19.0],[-16.4,-.22,16.9],56);
 case 'S19':return v([-45,6,82],[-11.2,-20,43],66);
 case 'S20':{const a=studentAt(3,f).position;return v([a[0]-4.4,2.4,a[2]+4.5],[a[0],1.05,a[2]],56);}
 case 'S21':return v([-23,5.8,24],[-16.5,.35,16.5],65);
 case 'S22':return portrait([1.35,1.9,4.1],48);
 case 'S23':return u<.33?v([-20.6,1.1,20.3],[-18.1,.1,17.2],54):u<.70?v([-18.9,2.8,20.2],[-16.5,.28,16.5],60):v([-21,3.2,22.1],[-16.5,.8,16.5],54);
 case 'S24':return v([-20.0,1.10,22.5],[-16.5,.7,16.5],62);
 case 'S25':return v([-5.4,5.4,27.8],[-10.2,1.05,21.5],62);
 case 'S26':return v([-7.35,2.25,20.1],[-11.0,1.1,22.0],62);
 case 'S27':return v([-9.1,2.15,21.8],[HEADMASTER_OBS[0],1.45,HEADMASTER_OBS[2]],52);
 case 'S28':
  if(f<SPLASH_FRAME+8)return v([-15.4,.70,25.3],[-13.05,-.18,23.25],57);
  if(f<SPLASH_CONTACT)return v([-14.8,2.2,26.1],[-12.35,1.1,23.3],58);
  return v([-9.35,2.15,21.95],[HEADMASTER_OBS[0],1.6,HEADMASTER_OBS[2]],55);
 case 'S29':return q<42?v([-9.1,2.15,21.8],[-11.5,1.45,23.3],53):v([-10.6,2.15,23.95],[-8.25,1.5,23.7],62);
 case 'S30':return v([-5.3,6.5,-4.5],[-12,1,-14],60);
 case 'S31':{const i=Math.min(2,Math.floor(q/Math.max(1,(s.end-s.start)/3))),a=COW_HOME[i];return v([a[0]+3.0,2.05,a[2]+3.6],[a[0],1.25,a[2]],49);}
 case 'S32':return v([-7.0,2.6,-7.6],[-12,1.2,-11.7],59);
 case 'S33':return q<42?v([-13.0,8.5,1.3],[-24,1.0,-16.0],59):groupReturn();
 case 'S34':return q<33?v([-22,3,23.6],[-16.5,.65,16.5],58):groupReturn();
 case 'S35':return portrait([.7,1.9,4.1],49);
 case 'S36':
  if(q>110&&q<141)return v([-18,5,-3.3],[-22,1,-13.0],60);
  if(q>=141&&q<171)return v([-22,3.5,23.6],[-16.5,.5,16.5],60);
  if(q>=171&&q<201)return v([-5.3,5.4,-5.0],[-12,1,-14],61);
  return portrait([1.1,1.95,4.5],48);
 case 'S37':return portrait([1.1,1.95,4.5],48);
 case 'S38':{const release=ramp(f,OUTRO_START+55,OUTRO_START+140);return portrait([1.1+release*.5,1.95+release*.35,4.5+release*1.3],48);}
 default:throw new Error(`Undirected EP006 shot ${id}`);
 }
 function groupReturn(){const a=studentAt(3,f).position;return v([a[0]-3.8,2.5,a[2]+4.8],[a[0],1.0,a[2]],58);}
}
