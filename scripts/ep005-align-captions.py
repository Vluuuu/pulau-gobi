"""Map local Whisper word estimates to the LOCKED caption wording. Not forced alignment.
No dialogue is taken from ASR; names and punctuation remain the owner's screenplay.
"""
from pathlib import Path
import json,re,difflib
root=Path.cwd();raw=json.loads((root/'out/ep005-qa-v1/master-asr.json').read_text(encoding='utf-8'))
phrases=json.loads((root/'tmp/caption-plan.json').read_text())
def norm(s):return re.sub(r'[^a-z0-9]','',s.lower())
aliases={'guapusingjir':'guapusingnjir','sayri':'xyree','sairi':'xyree','risa':'ris','phew':'fiuh','wow':'woooo','muuuuhh':'moooo'}
asr=[];i=0
while i<len(raw):
 a=dict(raw[i]);n=norm(a['text'])
 if n=='gua' and i+1<len(raw) and norm(raw[i+1]['text'])=='pusingjir':a['text']='guapusingnjir';a['end']=raw[i+1]['end'];i+=1
 elif n=='ris' and i+3<len(raw) and norm(raw[i+1]['text'])=='garis':a['text']='RIS_26';a['end']=raw[i+3]['end'];i+=3
 elif n=='ha':
  while i+1<len(raw) and norm(raw[i+1]['text'])=='ha':i+=1;a['end']=raw[i]['end']
  a['text']='HAHAHA'
 asr.append(a);i+=1
expected=[{'text':t,'phrase':j}for j,(_,_,text) in enumerate(phrases)for t in text.split()]
N=len(expected);M=len(asr);dp=[[0.]*(M+1)for _ in range(N+1)];back={}
for i in range(1,N+1):dp[i][0]=i;back[i,0]='d'
for j in range(1,M+1):dp[0][j]=j;back[0,j]='i'
for i in range(1,N+1):
 for j in range(1,M+1):
  a=norm(expected[i-1]['text']);b=norm(asr[j-1]['text']);b=aliases.get(b,b)
  cost=1.5*(1-difflib.SequenceMatcher(None,a,b).ratio())
  # Similar words far outside their script phrase should not steal another phrase's estimate.
  pa,pb,_=phrases[expected[i-1]['phrase']]
  if not pa-.6<=asr[j-1]['start']<=pb+.6:cost+=1.2
  options=[(dp[i-1][j-1]+cost,'m'),(dp[i-1][j]+1,'d'),(dp[i][j-1]+1,'i')]
  dp[i][j],back[i,j]=min(options,key=lambda p:p[0])
i,j=N,M;mapping={}
while i or j:
 b=back[i,j]
 if b=='m':mapping[i-1]=j-1;i-=1;j-=1
 elif b=='d':i-=1
 else:j-=1
rows=[];estimated=[]
for p,(a,b,text) in enumerate(phrases):
 inds=[i for i,e in enumerate(expected)if e['phrase']==p];words=[]
 for k,i in enumerate(inds):
  if i in mapping:
   w=asr[mapping[i]];start=w['start'];end=w['end'];status='asr-estimated'
  else:
   start=a+(b-a)*k/len(inds);end=a+(b-a)*(k+1)/len(inds);status='phrase-estimated';estimated.append(expected[i]['text'])
  if norm(expected[i]['text'])=='moooo':start=56.77;end=58.0;status='director-sound-window'
  words.append({'text':expected[i]['text'],'start':round(start,3),'end':round(max(start+.035,end),3),'status':status})
 # Keep all expected words, in screenplay order. Repair only overlapping machine estimates.
 for k in range(1,len(words)):
  if words[k]['start']<words[k-1]['start']:words[k]['start']=words[k-1]['end']
  words[k]['end']=max(words[k]['start']+.035,words[k]['end'])
 rows.append({'start':min(w['start']for w in words),'end':max(w['end']for w in words)+.08,'words':words})
for i in range(len(rows)-1):rows[i]['end']=min(rows[i]['end'],rows[i+1]['start'])
assert ' '.join(w['text']for r in rows for w in r['words'])==' '.join(p[2]for p in phrases)
(root/'src/episode005/voiceWords.ts').write_text('// Local Whisper word estimates mapped to the locked script; not forced alignment or human-verified.\nexport const ALIGNED_CAPTIONS='+json.dumps(rows,ensure_ascii=False,separators=(',',':'))+';\n',encoding='utf-8')
(root/'out/ep005-qa-v1/caption-alignment.json').write_text(json.dumps({'words':N,'matched':len(mapping),'fallbackWords':estimated,'method':'local-whisper-estimate+locked-script-DP','humanVerified':False},indent=2),encoding='utf-8')
print(json.dumps({'words':N,'matched':len(mapping),'fallbackWords':estimated}))
