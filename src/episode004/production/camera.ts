import {cameraAt as pilotCamera} from '../pilot/plan.ts';
import {atVoice,voiceSlot,localWord,GREEN_A,GREEN_B,FIELD_TRAVEL,FARM_A,FARM_B,RANCH_A,RANCH_B,KOST_A,KOST_B,KOST_C,COMEDY,GUARD_BUBBLE,inComedy,ramp,lerp} from './timeline.ts';
import {HUB,FOREST_SPOT,FIRST_TREE,FARM,FARM_FRONT,RANCH,RANCH_FRONT,KOST,transform} from './layout.ts';
import type {V3} from './layout.ts';
import {gobiPosition} from './direction.ts';
export type Shot={id:string;target:V3;width:number;az:number;elevation:number;focus?:string;build?:boolean};
const s=(id:string,target:V3,width:number,elevation=30,az=45,focus?:string,build=false):Shot=>({id,target,width,elevation,az,focus,build});
export function shotAt(f:number):Shot{
 const g=gobiPosition(f),gTarget:V3=[g[0],1.65,g[2]];
 if(f<atVoice(2))return f<atVoice(1)+150?s('S01-02-hook',gTarget,4.8,16):s('S03-house-stakes',[-4,3.8,0],20,32);
 if(f<atVoice(3))return s(f<atVoice(2)+localWord(2,'Oke',true)?'S05-06-comments':'S07-decision',gTarget,5.6,16);
 if(f<GREEN_A.start)return f<atVoice(3)+localWord(3,'Ya')?s('S08-seedling',[-2,1.5,5.8],17,30,45,'warga-7'):s('S09-conductor',gTarget,6,18,40,'warga-7');
 if(f<GREEN_A.end)return s('S10-first-tree',[-2,1,5.8],17,30,50,'warga-7',true);
 if(f<GREEN_B.end)return s('S11-expansion',[0,-6,0],112,21,45,undefined,true);
 if(f<FIELD_TRAVEL.start)return s('S12-green-reward',[-2,1.8,6.0],8.6,17,38,'warga-7');
 if(f<FIELD_TRAVEL.end)return s('S14a-field-approach',[g[0],1,g[2]-2],21,34);
 if(f<FARM_A.start)return f<atVoice(5)+localWord(5,'Oke')?s('S13-fredrikz',[11.3,1.6,-.3],6.7,14,55,'warga-8'):s('S14b-field-run',[10,.4,-10],23,34,45,'warga-8');
 if(f<FARM_A.end)return s('S15-beds',[10,.7,-12],18,32,48,'warga-8',true);
 if(f<FARM_B.end)return s('S16-irrigation',[10,.7,-12],20,34,40,'warga-2',true);
 if(f<atVoice(7))return f<atVoice(6)+localWord(6,'Eh')?s('S17-farm-reveal',[10,.8,-12],20,30,55,'warga-8'):s('S18-not-yet',[FARM_FRONT[0]+1.1,1.5,FARM_FRONT[2]-.3],6.7,14,50,'warga-8');
 if(f<RANCH_A.start){const v=f-atVoice(7);return v<localWord(7,'Katanya')?s('S19-ranch-entry',[-10,.8,-12],24,34,45,'warga-9'):v<localWord(7,'Bangun')?s('S20-xyree',[-6.3,1.6,-11.8],6.8,14,55,'warga-9'):s('S21-clear-ranch',[-12,.7,-14],21,34,45,'warga-9');}
 if(f<RANCH_A.end)return s('S22-ranch-framing',[-12,1.1,-14],18,30,48,'warga-8',true);
 if(f<RANCH_B.end)return s('S23-ranch-roof',[-12,1.3,-14],21,34,42,'warga-9',true);
 if(f<GUARD_BUBBLE.start)return s('S24-guard-reveal',[-12,1,-13],21,29,40,'warga-9');
 if(f<GUARD_BUBBLE.end){const p=transform([3.5,1.65,5],RANCH);return s('S25-guard-bubble',p,6.3,14,45,'warga-9');}
 if(f<KOST_A.start){const v=f-atVoice(9);return v<95?s('S26-one-problem',gTarget,5.6,15):v<localWord(9,'Yaudah')?s('S27-queue',[-1.2,2.7,1.8],18,31,45,'warga-1'):s('S28-kost-decision',[2.4,1.6,3.8],6.8,16);}
 if(f<KOST_A.end)return s('S29-kost-ground',transform([-1.8,2.1,.5],KOST),24,32,48,undefined,true);
 if(f<KOST_B.end)return s('S30-kost-upper',transform([-1.8,2.6,.5],KOST),25,34,38,undefined,true);
 if(f<KOST_C.end)return s('S31-kost-roof',transform([-1.5,2.5,.5],KOST),24,30,52,undefined,true);
 if(f<COMEDY.start)return s('S32-kost-reveal',transform([-1.5,2.3,1],KOST),23,24,42,'warga-1');
 if(inComedy(f)){const c=pilotCamera(f-COMEDY.start);return s('S33-39-'+c.shot,c.target,1080/c.zoom,15);}
 if(f<atVoice(15)){const c=pilotCamera(488);return s('S40-recover',c.target,1080/c.zoom,15);}
 if(f<atVoice(16))return s('S41a-empty-beds',[10,.7,-12],19,32,50,'warga-8');
 if(f<atVoice(17))return s('S41b-empty-ranch',[-12,1,-14],21,33,42,'warga-9');
 if(f<atVoice(18))return s('S42-poll',[0,.5,-11],46,36);
 if(f<atVoice(19))return s('S43-cta',gTarget,4.8,16,45);
 return s('S44-outro',[1,1.8,5],16,32,60);
}
export function cameraAt(f:number){
 if(inComedy(f))return {...pilotCamera(f-COMEDY.start),id:shotAt(f).id};
 if(f>=COMEDY.end&&f<atVoice(15))return {...pilotCamera(488),id:'S40-recover'};
 const shot=shotAt(f);let {target,width,az,elevation}=shot;
 if(f>=atVoice(19)){
  const u=ramp(f,atVoice(19),voiceSlot(19).end-18);width=Math.exp(lerp(Math.log(16),Math.log(112),u));
  target=[lerp(1,0,u),lerp(1.8,-6,u),lerp(5,0,u)];elevation=lerp(32,21,u);
 }
 const a=az*Math.PI/180,e=elevation*Math.PI/180,d=110;
 return {id:shot.id,shot:shot.id,target,zoom:1080/width,position:[target[0]+d*Math.sin(a)*Math.cos(e),target[1]+d*Math.sin(e),target[2]+d*Math.cos(a)*Math.cos(e)] as V3};
}
