"""Audio metadata and one short contact SFX; no preview or image/video output.
Original story samples and canonical VO19 remain untouched. RMS is NOT LUFS.
"""
from pathlib import Path
import array,hashlib,json,math,random,subprocess,wave
root=Path(__file__).resolve().parents[1];rate=44100;block=1470
plan=json.loads((root/'tmp/ep006-plan.json').read_text())
with wave.open(str(root/'public/episode006/voice/story-edit.wav'),'rb') as w: story=array.array('h',w.readframes(w.getnframes()))
outro_file=root/'public/episode004/voice/ep004_vo_19.mp3'
outro=array.array('h',subprocess.check_output(['ffmpeg','-v','error','-i',str(outro_file),'-f','s16le','-']))
def rms_blocks(pcm):return [math.sqrt(sum((n/32768)**2 for n in pcm[a:a+block])/max(1,len(pcm[a:a+block]))) for a in range(0,len(pcm),block)]
def active_rms(rows):
    active=[r for r in rows if r>.015]
    return math.sqrt(sum(r*r for r in active)/len(active))
sr=rms_blocks(story);orr=rms_blocks(outro);story_rms=active_rms(sr);outro_rms=active_rms(orr)
story_gain=.82;peak=max(map(abs,outro))/32768
outro_gain=round(min(1.15,.88/peak,max(.45,story_gain*story_rms/outro_rms)),5)
energy=[r*story_gain for r in sr]+[r*outro_gain for r in orr]
energy+= [0.]*(plan['duration']-len(energy));energy=energy[:plan['duration']]
mouth=[]
for i,r in enumerate(energy):
    smooth=.65*r+.25*(energy[i-1] if i else 0)+.10*(energy[i-2] if i>1 else 0)
    mouth.append(round(min(1,max(0,(smooth-.006)/(story_rms*story_gain*.90)))**.65,3))
caps=[{'start':c['start'],'end':c['end'],'text':' '.join(w['text'] for w in c['words'])} for c in plan['outroCaptions']]
lines=['// Audio-energy acting data. Deterministic; not phoneme/forced alignment.',f'export const STORY_GAIN={story_gain};',f'export const OUTRO_GAIN={outro_gain};','export const OUTRO_CAPTIONS='+json.dumps(caps,ensure_ascii=False)+' as const;','export const VOICE_ENVELOPE:readonly number[]=[']
lines += [','.join(str(n) for n in mouth[i:i+40])+',' for i in range(0,len(mouth),40)];lines+= ['];','']
(root/'src/episode006/audioPerformance.ts').write_text('\n'.join(lines),encoding='utf-8')
metrics={'method':'30fps block RMS, active blocks above 0.015, gain matching; not LUFS or human listening','storyGain':story_gain,'outroGain':outro_gain,'storyActiveRmsBeforeGain':story_rms,'outroActiveRmsBeforeGain':outro_rms,'storyActiveRmsAfterGain':story_rms*story_gain,'outroActiveRmsAfterGain':outro_rms*outro_gain,'outroSamplePeakAfterGain':peak*outro_gain,'outroSha256':hashlib.sha256(outro_file.read_bytes()).hexdigest(),'outroDecodedSamples':len(outro),'outroVisualWorld':'EP006 CurrentWorld; no Episode004 composition mounted','envelopeFrames':len(mouth),'humanListeningVerified':False}
(root/'docs/episodes/EP006_REVISION_AUDIO.json').write_text(json.dumps(metrics,indent=2)+'\n')
# Filtered broadband splash: a single contact transient with a short falling tail.
rng=random.Random(60624);filtered=0.;samples=[];count=round(.58*rate)
for i in range(count):
    t=i/rate;n=rng.uniform(-1,1);filtered=.84*filtered+.16*n
    env=(1-math.exp(-t*420))*math.exp(-t*8.5)
    samples.append((filtered*.85+n*.15)*env)
mx=max(map(abs,samples));pcm=array.array('h',(round(n/mx*.58*32767*min(1,i/40,(count-1-i)/500)) for i,n in enumerate(samples)))
with wave.open(str(root/'public/episode006/sfx/splash-contact.wav'),'wb') as w:w.setnchannels(1);w.setsampwidth(2);w.setframerate(rate);w.writeframes(pcm.tobytes())
print(f'Prepared RMS-matched canonical VO gain {outro_gain}, {len(mouth)} acting envelope frames and one contact splash. No render/preview.')
