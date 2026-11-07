"""One continuous PCM playback asset. Spoken samples are untouched; pauses are sample exact.
No TTS regeneration, time stretching, speech fades or per-phrase media mounts.
"""
from pathlib import Path
import hashlib,json,wave
root=Path.cwd();plan=json.loads((root/'tmp/ep005-audio-plan.json').read_text())
parts=[]
for s in plan['segments']:
 with wave.open(str(root/'public'/s['file']),'rb') as w:
  assert (w.getnchannels(),w.getsampwidth(),w.getframerate())==(1,2,44100)
  parts.append(w.readframes(w.getnframes()))
source=b''.join(parts);edited=b'';recovered=b'';ranges=[];cursor=0
for i,p in enumerate(parts):
 ranges.append({'sourceStartSample':len(recovered)//2,'editStartSample':cursor,'samples':len(p)//2})
 edited+=p;recovered+=p;cursor+=len(p)//2
 if i<len(plan['inserts']):
  silence=plan['inserts'][i]['frames']*1470
  edited+=bytes(silence*2);cursor+=silence
assert recovered==source
evidence=json.loads((root/'docs/episodes/EP005_AUDIO_EVIDENCE.json').read_text())
assert hashlib.sha256(source).hexdigest()==evidence['decodedPcmSha256']
dest=root/'public/episode005/voice/edited-v4.wav'
with wave.open(str(dest),'wb') as w:w.setnchannels(1);w.setsampwidth(2);w.setframerate(44100);w.writeframes(edited)
report={'file':'episode005/voice/edited-v4.wav','sampleRate':44100,'masterPcmSha256':hashlib.sha256(source).hexdigest(),'editedPcmSha256':hashlib.sha256(edited).hexdigest(),'recoveredPcmSha256':hashlib.sha256(recovered).hexdigest(),'sampleExact':True,'speechFades':False,'rate':1,'seconds':len(edited)/2/44100,'ranges':ranges,'inserts':plan['inserts']}
(root/'docs/episodes/EP005_V1_CONTINUOUS_VO.json').write_text(json.dumps(report,indent=2),encoding='utf-8')
print(json.dumps({k:v for k,v in report.items() if k not in ['ranges','inserts']},indent=2))
