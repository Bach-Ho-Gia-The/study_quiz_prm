import asyncio, json, os, io, sys, edge_tts
from mutagen.mp3 import MP3
VOICE="vi-VN-NamMinhNeural"
speech=json.load(open('scripts/speech.json'))
sem=asyncio.Semaphore(10)
async def synth(text):
    for attempt in range(6):
        try:
            async with sem:
                c=edge_tts.Communicate(text,VOICE,rate="+4%",pitch="+0Hz")
                buf=bytearray()
                async for ch in c.stream():
                    if ch["type"]=="audio": buf+=ch["data"]
            if len(buf)>500: return bytes(buf)
        except Exception as e:
            await asyncio.sleep(1+attempt)
    raise RuntimeError("fail: "+text)
async def do(qid,texts):
    lp=f'public/lessons/{qid}.json'
    lesson=json.load(open(lp))
    if all('dur' in s for s in lesson['segs']) and os.path.exists(f'public/audio/{qid}.mp3'): return
    parts=await asyncio.gather(*[synth(t) for t in texts])
    t=0.0; data=b''
    for s,p in zip(lesson['segs'],parts):
        d=MP3(io.BytesIO(p)).info.length
        s['start']=round(t,3); s['dur']=round(d,3); t+=d; data+=p
    lesson['total']=round(t,3)
    open(f'public/audio/{qid}.mp3','wb').write(data)
    json.dump(lesson,open(lp,'w'),ensure_ascii=False)
    print(qid,round(t,1),flush=True)
async def main():
    ids=list(speech)
    if len(sys.argv)>1: ids=ids[:int(sys.argv[1])]
    await asyncio.gather(*[do(i,speech[i]) for i in ids])
asyncio.run(main())
