"""Local ASR metadata only. No preview, render, voice alteration or network upload."""
from pathlib import Path
import json
from faster_whisper import WhisperModel

root = Path(__file__).resolve().parents[1]
model = WhisperModel('base', device='cpu', compute_type='int8', download_root=str(root/'tmp/asr-model'))
segments, info = model.transcribe(str(root/'public/episode006/voice/eps6.mp3'), language='id', word_timestamps=True, beam_size=5, condition_on_previous_text=False)
rows = []
for s in segments:
    row = {'start': s.start, 'end': s.end, 'text': s.text, 'words': [{'text': w.word.strip(), 'start': w.start, 'end': w.end, 'probability': w.probability} for w in s.words]}
    rows.append(row)
    print(f'{s.start:.2f}..{s.end:.2f} {s.text}', flush=True)
(root/'tmp/ep006-asr.json').write_text(json.dumps({'method': 'faster-whisper-base-cpu-int8', 'humanVerified': False, 'segments': rows}, ensure_ascii=False, indent=2), encoding='utf-8')
