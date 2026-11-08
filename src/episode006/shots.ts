import {E,hold,OUTRO_START,DURATION} from './timeline.ts';
export type Shot={id:string;start:number;end:number;intent:string;interior:boolean;dialogue:boolean};
// Reordered S14 before S10 to follow the ACTUAL MP3 (headmaster introduction
// precedes 'semuanya masuk kelas'). All 38 director beats remain represented.
const starts:[string,number,string,boolean?,boolean?][]=[
 ['S01',0,'Gobi: hook',false,true],['S02',45,'EP005 cow flashback',true],['S03',E(3.02),'Murid sungguhan',false,true],
 ['S04',E(5.92),'Pendaftaran: no invented counter',false,true],['S05',E(11.3),'Eight authentic comments'],
 ['S06',E(14.58),'Students 1–2'],['S07',E(14.58)+75,'Students 3–4'],['S08',E(14.58)+150,'Students 5–6'],['S09',E(14.58)+225,'Students 7–8'],
 ['S13',E(20.7),'Damia prepares class',true],['S14',E(23.48),'Ghanim: gate to foyer',false,true],
 ['S10',E(27.3),'Eight students: gate to entrance'],['S11',hold('entry').start+36,'Foyer and corridor',true],
 ['S12',hold('entry').start+126,'Reach eight chairs, turn, sit',true],
 ['S15',E(29.31),'Damia draws fish; Gobi reacts',true,true],
 ['S16',E(34.44),'Damar original comment'],['S17',E(38.74),'Widen existing river'],
 ['S18',E(43.8),'Fish inside the water'],['S19',hold('waterfall').start,'River to retained waterfall'],
 ['S20',E(49.22),'Field trip on connected route'],['S21',E(52.7),'Short bridge: stop safely'],
 ['S22',E(55.04),'Gobi reacts to span',false,true],['S23',E(57),'Reinforce ONE bridge'],
 ['S24',E(62.94),'Physical deck crossing'],['S25',E(65.88),'Observation deck'],
 ['S26',E(69.06),'Damia teaches; different student actions'],['S27',E(72.69),'Serious headmaster'],
 ['S28',E(74.58),'Fish leap causes splash'],['S29',E(76.9),'Staggered reactions'],
 ['S30',E(78.2),'Velora original comment'],['S31',E(81.64),'Sappy, Oopet, Rembo'],
 ['S32',E(84.1),'Wrong cow turns'],['S33',E(86.56),'Sunset: school exit'],
 ['S34',E(90.14),'Return over bridge'],['S35',E(93.95),'Gobi sees dark path',false,true],
 ['S36',E(99.74),'Where should lights go?',false,true],['S37',hold('breath').start,'Breath and gentle transition'],
 ['S38',OUTRO_START,'Full original EP004 outro'],
];
export const SHOTS:Shot[]=starts.map((s,i)=>({id:s[0],start:s[1],end:starts[i+1]?.[1]??DURATION,intent:s[2],interior:s[3]??false,dialogue:s[4]??false}));
export const shotAt=(f:number)=>SHOTS.find(s=>f>=s.start&&f<s.end)??SHOTS[SHOTS.length-1];
export const shot=(id:string)=>SHOTS.find(s=>s.id===id)!;
export const SPLASH_FRAME=E(75.1);
