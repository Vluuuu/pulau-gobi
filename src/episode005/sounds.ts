import {gap,editFrame as E,ramp} from './timeline.ts';
export type Cue={frame:number;file:string;volume:number;frames:number;trim?:number};
const out:Cue[]=[];
const cue=(frame:number,file:string,volume=.5,frames=30,trim?:number)=>out.push({frame:Math.round(frame),file,volume,frames,trim});
const old=(f:number,name:string,v=.5,d=30)=>cue(f,`episode004/sfx/${name}.wav`,v,d);
const pilot=(f:number,name:string,v=.5,d=20)=>cue(f,`episode004/pilot/${name}.wav`,v,d);
const own=(f:number,name:string,v=.5,d=30,trim?:number)=>cue(f,`episode005/sfx/${name}.wav`,v,d,trim);
const moo=(f:number,v=.25)=>own(f,'cow-moo',v,65,3.1*30);
pilot(0,'landing-thump',.45);pilot(24,'boing',.3);old(E(11.22),'chime',.35);old(E(16.18),'chime',.35);
pilot(E(18.50),'landing-thump');old(E(20.3),'earth-rumble',.4);
for(let i=0;i<8;i++){old(gap('G1').start+20+i*15,'earth-rumble',.25);old(gap('G1').start+35+i*15,'water-flow',.32,50);}
own(gap('G1').start+159,'waterfall',.7,126);
for(const f of [E(23.81),E(26.67),E(31.19),E(39.15),E(45.72),E(79)])old(f,'chime',.45);
for(let i=0;i<5;i++){old(gap('G2a').start+8+i*17,'leaf-rustle',.6);old(gap('G2a').start+18+i*17,'wood-tok',.4,5);}
for(let i=0;i<7;i++)own(gap('G2b').start+10+i*12,'sprout',.6,10);
old(E(48.57),'roof-drop',.35);old(gap('G3').start,'gate-creak',.55,18);moo(gap('G3').start+25,.4);
for(let i=0;i<12;i++)own(gap('G3').start+5+i*7,'hoof',.45,5);
own(gap('G3').start+92,'latch',.55,6);
// A short real recorded answer falls in the natural pause after Gobi's imitation.
own(E(58.05),'cow-moo',.28,27,3.6*30);
old(gap('G4').start,'earth-rumble',.4);
for(let i=0;i<14;i++)old(gap('G4').start+13+i*8,'wood-tok',.55,5);
old(gap('G4').start+123,'roof-drop',.55,16);
for(let i=0;i<8;i++)old(gap('G4').start+168+i*5,'wood-tok',.4,5);
for(const t of [81,98,125,143])old(gap('G4').start+t,'wood-tok',.45,8);
for(let i=0;i<9;i++)pilot(E(77.8)+i*12,'footstep',.22,8);
for(let i=0;i<7;i++)pilot(E(88.5)+i*9,'footstep',.27,8);
old(E(79.35),'gate-creak',.3,18);
pilot(E(86.36)+8,'boing',.5);pilot(E(86.36)+26,'landing-thump',.45);
own(E(89.05),'bell',.65,45);own(E(89.75),'bell',.52,45);own(E(90.9),'latch',.65,6);
moo(E(91.4),.15);old(gap('G5').start+76,'gate-creak',.5,20);
for(let i=0;i<16;i++)own(E(91.7)+i*8,'hoof',Math.min(.65,.15+i*.035),5);
moo(gap('G5').start+40,.28);old(gap('G5').start+87,'gate-creak',.4,18);
pilot(E(93.26)+6,'boing',.45);pilot(E(93.26)+24,'landing-thump',.45);
for(let i=0;i<10;i++)pilot(E(98.43)+i*6,'footstep',.4,6);
moo(E(100.2),.23);moo(gap('G6').start+2,.25);
for(let i=0;i<23;i++)own(gap('G6').start+45+i*8,'hoof',.30,5);
for(const d of [2,8,14])own(E(104.4)+d,'latch',.5,6);
moo(E(109),.22);old(E(122.83),'chime',.35);old(E(128.75),'chime',.35);
export const CUES=out;
export const muteBeforeLah=(f:number)=>f>=gap('G5').end-9&&f<gap('G5').end;
export const ambienceGain=(f:number)=>{const end=gap('G5').end;return f<end?1-ramp(f,end-12,end-9):ramp(f,end,end+6);};
export const cueGain=(c:Cue,local:number)=>c.volume*ramp(local,0,Math.min(2,c.frames*.15))*(1-ramp(local,c.frames-Math.min(5,c.frames*.25),c.frames))*ambienceGain(c.frame+local);
export function musicGain(f:number){let gain=.28;for(const id of ['G1','CH-A','G5']){const s=gap(id),duck=ramp(f,s.start-5,s.start+5)*(1-ramp(f,s.end-5,s.end+5));gain*=1-duck*.64;}return gain*ambienceGain(f);}
