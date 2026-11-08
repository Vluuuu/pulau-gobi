"""Prepare EP006 PCM edit, measured EDL, provisional ASR captions and original SFX.
No video/image output. Source MP3 remains untouched; only full duplicate CTA is
replaced by the canonical EP004 tail in the composition. No rate/pitch changes.
"""
from pathlib import Path
import array, hashlib, json, math, random, subprocess, wave
root=Path(__file__).resolve().parents[1]
out=root/'public/episode006'; (out/'sfx').mkdir(exist_ok=True)
plan=json.loads((root/'tmp/ep006-plan.json').read_text())
master=out/'voice/eps6.mp3'
decoded=subprocess.check_output(['ffmpeg','-v','error','-i',str(master),'-acodec','pcm_s16le','-f','s16le','-'])
rate=44100;spf=1470;story_end=plan['storySourceEnd']*spf
inserts=plan['inserts'];cursor=0;edit=b'';segments=[];rejoin=b''
for cut in inserts:
    end=cut['sourceFrame']*spf
    pcm=decoded[cursor*2:end*2]
    if end>cursor:
        segments.append({'sourceInSample':cursor,'sourceOutSample':end,'sourceInSeconds':cursor/rate,'sourceOutSeconds':end/rate,'destinationFrame':len(edit)//(2*spf),'samples':end-cursor})
        edit+=pcm;rejoin+=pcm
    edit+=bytes(cut['frames']*spf*2);cursor=end
assert cursor==story_end and rejoin==decoded[:story_end*2]
assert len(edit)//(2*spf)==plan['outroStart']
with wave.open(str(out/'voice/story-edit.wav'),'wb') as w:
    w.setnchannels(1);w.setsampwidth(2);w.setframerate(rate);w.writeframes(edit)
asr=json.loads((root/'tmp/ep006-asr.json').read_text(encoding='utf-8'))
captions=[];transcript=[]
replacements={'suai':'sungai','murik':'murid','ko':'kok','sabi':'sapi','idenama':'ide nama','nyobrang':'nyebrang','damiya':'Damia','gobi':'Gobi'}
for s in asr['segments']:
    if s['start']>=story_end/rate: continue
    words=[dict(w) for w in s['words']]
    # Evidence-backed proper names; timestamps remain machine estimates.
    if s['start']==20.7: words[2:4]=[{'text':'Damia,','start':21.38,'end':21.88}]
    if s['start']==23.48: words[2:4]=[{'text':'Ghanim Miyaz','start':24.02,'end':25.08}]
    if s['start']==34.44: words[:4]=[{'text':'damar_zan','start':34.44,'end':35.32}]
    if s['start']==72.68: words[1:4]=[{'text':'Ghanim serius','start':73.1,'end':73.72}]
    if s['start']==74.58: words[4:6]=[{'text':'kepala','start':76.08,'end':76.36}]
    if s['start']==81.16: words[1]['text']='sapi'
    if s['start']==28.88: words[0]['start']=29.30 # measured onset after the entry pause
    for w in words:
        word=w['text']; bare=word.strip('.,!?').lower()
        if bare in replacements: w['text']=word.replace(word.strip('.,!?'),replacements[bare])
    transcript.append({'start':s['start'],'end':s['end'],'text':' '.join(w['text'] for w in words),'timingStatus':'machine-estimated; editorial name corrections; owner listening review pending'})
    for i in range(0,len(words),6):
        chunk=words[i:i+6]
        captions.append({'start':chunk[0]['start'],'end':min(chunk[-1]['end'],story_end/rate),'text':' '.join(w['text'] for w in chunk)})
(root/'src/episode006/voice.ts').write_text('// Actual-master ASR phrase timing; NOT human/forced-alignment verified.\nexport const CAPTIONS='+json.dumps(captions,ensure_ascii=False,indent=2)+' as const;\n',encoding='utf-8')
evidence={'masterSha256':hashlib.sha256(master.read_bytes()).hexdigest(),'sourceSeconds':113.240813,'sampleRate':rate,'decodedSamples':len(decoded)//2,
 'storySourceSamples':story_end,'storyPcmSha256':hashlib.sha256(rejoin).hexdigest(),'storySampleExact':True,'speed':1,'segments':segments,'inserts':inserts,
 'duplicateCtaReplaced':{'sourceInSample':story_end,'sourceOutSample':len(decoded)//2,'silenceContainingCutSeconds':[108.689683,109.065986],'canonicalFile':'episode004/voice/ep004_vo_19.mp3','canonicalSourceFrame':plan['outroSourceStart'],'videoDestinationFrame':plan['outroStart'],'framesIncludingOriginalHold':plan['outroFrames']},
 'captionMethod':asr['method'],'humanListeningVerified':False,'recordedApplicantCount':361,'applicantCountOwnerConfirmed':False,'durationFrames':plan['duration']}
(root/'docs/episodes/EP006_AUDIO_EDL.json').write_text(json.dumps(evidence,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
(root/'docs/episodes/EP006_TRANSCRIPT.json').write_text(json.dumps(transcript,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
# Reproducible, brief action-only effects; no continuous tone or music bed.
rng=random.Random(6006)
def synth(name,duration,fn,peak=.3):
    n=round(duration*rate);a=[fn(i/rate,rng.uniform(-1,1)) for i in range(n)];maximum=max(map(abs,a)) or 1
    data=array.array('h',(round(v/maximum*peak*32767*min(1,i/120,(n-1-i)/400)) for i,v in enumerate(a)))
    with wave.open(str(out/f'sfx/{name}.wav'),'wb') as w:w.setnchannels(1);w.setsampwidth(2);w.setframerate(rate);w.writeframes(data.tobytes())
synth('chalk',.42,lambda t,n:n*.5*(.5+.5*math.sin(t*67))*math.exp(-t*3),.2)
synth('footstep',.18,lambda t,n:(n*.7+math.sin(t*2*math.pi*85)*.2)*math.exp(-t*24),.25)
synth('wood',.25,lambda t,n:(n*.3+math.sin(t*2*math.pi*155)*.5)*math.exp(-t*24),.3)
synth('earth',.32,lambda t,n:n*math.exp(-t*14),.22)
synth('splash',.65,lambda t,n:n*(1-math.exp(-t*30))*math.exp(-t*6),.3)
print(f'Prepared source audio: {story_end} original story samples retained exactly; duplicate CTA replaced whole; {len(captions)} provisional caption cues. No image/video produced.')
