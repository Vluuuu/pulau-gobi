import {POST_EP005_WORLD} from '../postEp005/snapshot.ts';
import {RESIDENTS,STUDENTS,HEADMASTER,COWS,COMMENT_MANIFEST} from './roster.ts';
import {RIVER_LINE,RIVER_WIDTH,BRIDGE,OBSERVATION,SEATS,SCHOOL_YARD,ASSEMBLY,FIELD_PATH,HEADMASTER_OBS,TEACHER_OBS,GOBI_OBS,HEADMASTER_CLASS,CLASS_GOBI,OBS_SPOTS,SCHOOL_VISITORS} from './layout.ts';
import {TRANSPLANTS} from './landscaping.ts';
const freeze=<T,>(value:T):Readonly<T>=>{if(value&&typeof value==='object'){Object.values(value).forEach(v=>freeze(v));Object.freeze(value);}return value;};
const clone=<T,>(value:T)=>freeze(JSON.parse(JSON.stringify(value)) as T);
// Clone first: importing the current state must never mutate a historical module.
export const POST_EP006_WORLD=clone({
  ...POST_EP005_WORLD,id:'post-ep006-world-v3',schemaVersion:4,basedOnCommit:'c652fc9',originalWorldBaseline:'3759f2e',firstConsumerEpisode:6,
  school:{...POST_EP005_WORLD.school,firstHeadmasterId:HEADMASTER.id,selectedStudentIds:STUDENTS.map(s=>s.id),seats:SEATS,teachingTopic:'ikan',forecourt:SCHOOL_YARD,assembly:ASSEMBLY,productionInterior:'intact roof/ceiling/walls; perspective cameras inside A01/foyer',visitors:SCHOOL_VISITORS},
  water:{...POST_EP005_WORLD.water,centerline:RIVER_LINE,width:RIVER_WIDTH,bedY:-.65,waterY:-.15,fish:{count:14,asset:'Fish006',species:'stylized freshwater fish; species not identified'}},
  bridge:BRIDGE,observation:{...OBSERVATION,teacherBay:TEACHER_OBS,headmasterBay:HEADMASTER_OBS,gobiBay:GOBI_OBS,pupilSlots:OBS_SPOTS},schoolBlocking:{gobiFoyer:CLASS_GOBI,headmasterFoyer:HEADMASTER_CLASS},naturePath:FIELD_PATH,landscaping:{retainedPlantIds:true,transplants:TRANSPLANTS},
  population:{...POST_EP005_WORLD.population,residents:RESIDENTS,cows:POST_EP005_WORLD.population.cows.map((c,i)=>({...c,...COWS[i]}))},
  comments:COMMENT_MANIFEST,
  editorial:{candidateCount:null,recordedCandidateCount:361,countStatus:'VO claim only; owner data not confirmed; no numeric UI',newStreetLights:0,teaserEpisode:7,
    audio:'Original EP006 master retained intact; full duplicate CTA replaced once with untrimmed official EP004 VO19; current EP006 world continues through outro',
    snapshotPose:'daylight classroom inspection fixture; episode timeline separately directs the field trip and return'},
});
