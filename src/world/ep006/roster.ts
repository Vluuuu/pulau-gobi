import {CAST} from '../../episode005/direction.ts';
import {COW_IDS} from '../../episode005/direction.ts';
import type {VisualVariantSeed} from '../../episode003/state/types.ts';

// Literal screenshot names; @ is the UI's handle prefix, not part of the account.
// student_03's decorative glyphs were resolved by the owner: capiwasa (2026-11-08).
export const STUDENT_NAMES = ['posyaryn07', 'uz_daus', 'capiwasa', 'Rissa-i3f', 'bsk_rfi', 'FaRzHaN-BoY', 'MisbahulAmmar', 'athrr_0202'] as const;
export const STUDENTS = STUDENT_NAMES.map((name, i) => ({
  id: `warga-${13+i}`, name, cohort: 6, special: false, isLegacy: false, role: 'student',
  nameSource: `episode006/comments/student_${String(i+1).padStart(2,'0')}.png`,
  verification: i === 2 ? 'owner-confirmed-literal' : 'original-screenshot',
  visual: {seed: 613+i*17, shirt: ['#83aebb','#c98c73','#94af78','#b899c3','#d6b865','#85b3a0','#8b9bc0','#c993a4'][i],
    hair: ['#332c28','#252c32','#48392e'][i%3], pants: '#485c70', skin: ['#e7b88d','#c9916c','#efc7a0'][i%3],
    hairStyle: i%4, accessory: null, scale: .84} satisfies VisualVariantSeed,
}));
const adult = (id: string, name: string, role: string, shirt: string, seed: number, source: string) => ({
  id, name, role, cohort: 6, special: true, isLegacy: false, nameSource: source, verification: 'original-screenshot',
  visual: {seed, shirt, hair:'#292e34', pants:'#43556c', skin:'#dca983', hairStyle:1, accessory:null, scale:1} satisfies VisualVariantSeed,
});
export const HEADMASTER = adult('warga-21','GhanimMiyaz','headmaster','#536779',791,'episode006/comments/Ghanim_Miyaz.png');
export const VELORA = adult('warga-22','velora.nyxflare','cow-naming-contributor','#9577ae',809,'episode006/comments/velora_nyxflare.png');
export const RESIDENTS = [...CAST, ...STUDENTS, HEADMASTER, VELORA];
export const COWS = COW_IDS.map((id,i) => ({id, name:['Sappy','Oopet','Rembo'][i],
  nameSource:'episode006/comments/velora_nyxflare.png', assignment:'editorial order: existing cow-001..003; commenter did not specify individual markings'}));
export const COMMENT_MANIFEST = {
  students: STUDENTS.map(s=>({id:s.id,username:s.name,source:s.nameSource,verification:s.verification})),
  ideas: [
    {username:'damar_zan',residentId:'warga-4',existing:true,file:'damar_zan.png',text:'Besarin sungai nya bang trs tambahin ikan'},
    {username:HEADMASTER.name,displayName:'Ghanim Miyaz',residentId:HEADMASTER.id,existing:false,file:'Ghanim_Miyaz.png',text:'aku bang aku jadi kepala sekolah nya'},
    {username:VELORA.name,residentId:VELORA.id,existing:false,file:'velora_nyxflare.png',text:'Nama sapi: Sappy, Oopet & Rembo 🤣🤣'},
  ],
  applicantCount: null, followerVerification: 'not-performed',
};
