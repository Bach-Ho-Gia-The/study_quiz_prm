import fs from 'node:fs';
const bank = JSON.parse(fs.readFileSync('content/bank.json', 'utf8'));
const notes = {};
for (const f of ['n1', 'n2', 'n3', 'n4']) for (const t of JSON.parse(fs.readFileSync(`content/${f}.json`, 'utf8'))) notes[t[0]] = t;

const PR = `flutter=phờ lát tơ|dart=đát|widget=quýt chịt|widgets=quýt chịt|state=xờ tết|stateful=xờ tết phun|set=xét|build=bin|context=con tếch|bloc=blốc|cubit=kiu bịt|stream=xờ trim|streams=xờ trim|future=phiu chơ|futures=phiu chơ|async=ây xinh|await=ờ quây|provider=prô vai đơ|scaffold=xcáp phôn|container=con tây nơ|column=co lừm|row=rô|stack=xờ tách|expanded=ếch xpen đít|padding=pét đinh|sized=xai đ|box=bóc|list=lít|view=viu|grid=gờ rít|sliver=xờ lai vơ|app=áp|bar=ba|custom=cớt tồm|scroll=xờ crôn|http=hát tê tê pê|https=hát tê tê pê ét|json=giây xơn|api=ây pi ai|rest=rét|sql=ét kiu eo|sqlite=ét kiu eo lai|sqflite=ét kiu phờ lai|nosql=nô ét kiu eo|hive=hai vờ|shared=se đ|preferences=prê phơ rần xịt|token=tô cần|refresh=ri phrét|get=gét|post=pốt|put=pút|delete=đi lít|head=hét|ui=diu ai|ux=diu ếch|sdk=ét đi cây|apk=ây pi cây|ios=ai ô ét|android=an đroi|web=quép|git=gít|github=gít hắp|svn=ét vê en|ftp=ép tê pê|zip=díp|hot=hót|reload=ri lốt|restart=ri xờ tát|devtools=đép tuôn|inspector=in xờ pếch tơ|emulator=em mu lây tơ|test=tét|tests=tét|testing=tét tinh|unit=diu nít|integration=in tơ grây sần|golden=gôn đần|mock=móc|theme=thim|data=đây ta|material=mơ ti ri ồ|navigator=na vi gây tơ|push=pút|pop=póp|route=rao|routes=rao|guard=gát|middleware=mi đồ queo|text=tếch|field=phiu|textfield=tếch phiu|controller=con trô lơ|editing=ê đi tinh|animation=a ni mây sần|animated=a ni mây tịt|tween=tuyn|curve=cơ vờ|curved=cơ vờ|bounce=bao nờ|out=ao|ease=ít|linear=li ni a|decelerate=đi xe lơ rết|opacity=ô pa xi ti|align=a lai|switcher=xuýt chơ|ticker=tích cơ|vsync=vi xinh|builder=bin đơ|repaint=ri pên|boundary=bao đơ ri|const=con xờ|final=phai nồ|var=va|null=nâu|nullable=nâu bồ|safety=xê phờ ti|class=clát|object=ốp chếch|map=mép|maps=mép|queue=kiu|generics=gien ne rích|mixins=mích xin|package=pách kịt|packages=pách kịt|import=im po|imports=im po|email=i meo|address=át đrét|number=năm bơ|url=du a eo|authorization=o thơ rai dây sần|authentication=o then ti kây sần|content=con ten|type=tai|accept=ách xép|cache=cát|control=con trôn|firebase=phai bây|clean=clin|architecture=ác ki téc chơ|refactor=ri phách tơ|refactoring=ri phách tơ rinh|repository=ri pô xi tô ri|pattern=pát tơn|mvc=em vi xi|singleton=xinh gần tần|factory=phách tơ ri|pagination=pa gi nây sần|dispose=đít xờ pôs|init=i nít|lifecycle=lai phờ xai cồ|fill=phin|remaining=ri mây ninh|release=ri lít|debug=đi bắc|doctor=đóc tơ|run=răn|rendering=ren đơ rinh|skia=xki a|engine=en gin|embedder=em bét đơ|framework=phờ rêm quơ|login=lốc in|logout=lốc ao|session=xét sần|hoisting=hoi xtinh|bearer=be rơ|id=ai đi|ok=ô kê|css=xi ét ét|html=hát tê em eo|xml=ếch em eo|csv=xi ét vi|kotlin=cót lin|swift=xuýt phơ|javascript=gia va xờ crip|java=gia va|codebase=cốt bây|single=xin gồ|local=lô cồ|storage=xờ tô rịch|key=ki|value=ven diu|material=mơ ti ri ồ|cupertino=cu pơ ti nô|primitive=pri mi tịt|private=prai vịt|material=mơ ti ri ồ|bounceout=bao nờ ao|easein=ít in|easeout=ít ao|switch=xuýt|network=nét quơ|tools=tuôn|inspector=in xờ pếch tơ|phone=phôn|keyboard=kí bót|appbar=áp ba|appbars=áp ba|setstate=xét xờ tết|initstate=i nít xờ tết|sliverlist=xờ lai vơ lít|slivergrid=xờ lai vơ gờ rít|sliverappbar=xờ lai vơ áp ba|bloc=blốc|flutter_bloc=phờ lát tơ blốc|shared_preferences=se đ prê phơ rần xịt|flutter_test=phờ lát tơ tét|moor=mua|drift=đrịt|publish=pấp lít|rendering=ren đơ rinh|pixel=pích xồ|pixels=pích xồ|dev=đép|mvvm=em vi vi em|sdk=ét đi cây|crash=cờ rát|error=e rơ|errortext=e rơ tếch|validator=va li đây tơ|onsaved=on xây vơ đ|save=xây vơ|reset=ri xét|clear=cli ơ|remove=ri múp|read=rít|fetch=phét ch|load=lốt|fine=phai|grained=gờ rên đ|max=mếch|min=min|api=ây pi ai|e2e=i tu i|apis=ây pi ai|keyboards=kí bót|tick=tích|animatedcontainer=a ni mây tịt con tây nơ|animatedbuilder=a ni mây tịt bin đơ|animationcontroller=a ni mây sần con trô lơ|animatedswitcher=a ni mây tịt xuýt chơ|animatedopacity=a ni mây tịt ô pa xi ti|animatedalign=a ni mây tịt a lai|animatedsize=a ni mây tịt xai|repaintboundary=ri pên bao đơ ri|futurebuilder=phiu chơ bin đơ|streambuilder=xờ trim bin đơ|layoutbuilder=lây át bin đơ|layout=lây át|customscrollview=cớt tồm xờ crôn viu|listview=lít viu|gridview=gờ rít viu|singlechildscrollview=xin gồ chai đ xờ crôn viu|sizedbox=xai đ bóc|textinputtype=tếch in pút tai|textfield=tếch phiu|texteditingcontroller=tếch ê đi tinh con trô lơ|buildcontext=bin con tếch|themedata=thim đây ta|materialapp=mơ ti ri ồ áp|statefulwidget=xờ tết phun quýt chịt|crossaxisalignment=cờ rốt ếch xis a lai men|mainaxisalignment=mên ếch xis a lai men|obscuretext=ốp xki tếch|securinput=xi kiu in pút|golden=gôn đần|e=i`;
const PRON = {};
for (const p of PR.split('|')) { const [k, v] = p.split('='); if (k) PRON[k.toLowerCase()] = v; }
const LET = { A: 'a', B: 'bê', C: 'xê', D: 'đê' };
function speak(s) {
  s = s.replace(/\(\)/g, '').replace(/\b([A-D])\b(?=[:,.])/g, (m, l) => LET[l]);
  s = s.replace(/(?<![\p{L}\p{N}_])[A-Za-z][A-Za-z0-9_]*(?![\p{L}\p{N}_])/gu, (tok) => {
    if (tok.length === 1 && LET[tok]) return LET[tok];
    const whole = tok.toLowerCase();
    if (PRON[whole]) return PRON[whole];
    const parts = tok.replace(/_/g, ' ').replace(/([a-z0-9])([A-Z])/g, '$1 $2').split(' ');
    return parts.map((p) => PRON[p.toLowerCase()] || p).join(' ');
  });
  return s.replace(/\./g, (m, i, str) => (/\d/.test(str[i - 1] || '') && /\d/.test(str[i + 1] || '') ? ' chấm ' : '.')).replace(/\s+/g, ' ').trim();
}
const L = ['A', 'B', 'C', 'D'];
const out = [];
const speech = {};
const errs = [];
bank.forEach((b, idx) => {
  const t = notes[b.id];
  if (!t) { errs.push('missing ' + b.id); return; }
  const [, qvi, ovi, kw, ex, wrong, why, tip, deep, vis] = t;
  const ov = ovi.split('|'), wr = wrong.split('|');
  if (ov.length !== 4 || wr.length !== 3 || t.length !== 10) errs.push(`bad ${b.id} ov=${ov.length} wr=${wr.length} len=${t.length}`);
  const kws = kw.split(';').filter(Boolean).map((x) => { const i = x.indexOf('='); return [x.slice(0, i), x.slice(i + 1)]; });
  const [dq, da] = deep.split('§');
  const n = idx + 1;
  const wrongMap = {}; let wi = 0;
  for (const l of L) if (l !== b.a) wrongMap[l] = wr[wi++];
  const ai = L.indexOf(b.a);
  const segs = [];
  const add = (type, text, extra = {}) => segs.push({ type, text, ...extra });
  add('q', `Câu số ${n}. Đề hỏi: ${qvi}`);
  L.forEach((l, i) => add('opt', `Đáp án ${l}: ${ov[i]}.`, { l }));
  kws.forEach(([term, mean], i) => add('kw', `Từ khóa ${i + 1}: ${term}. Nghĩa là ${mean.charAt(0).toLowerCase() + mean.slice(1)}.`, { i }));
  add('ex', `Hình dung nhé! ${ex}`);
  L.forEach((l) => { if (l !== b.a) add('elim', `Đáp án ${l} bị loại. ${wrongMap[l]}.`, { l }); });
  add('ans', `Đáp án đúng là ${b.a}: ${ov[ai]}. ${why}`, { l: b.a });
  add('tip', `Mẹo nhớ nhanh: ${tip}`);
  add('deepq', `Tự hỏi thêm một câu: ${dq}?`);
  add('deepa', da);
  add('recap', `Chốt lại, câu này chọn ${b.a}. ${ov[ai]}.`, { l: b.a });
  segs.forEach((s) => (s.speak = speak(s.text)));
  speech[b.id] = segs.map((s) => s.speak);
  out.push({ id: b.id, n, q: b.q, o: b.o, a: b.a, sets: b.sets, src: b.src, vi: { q: qvi, o: ov }, kw: kws, ex, wrong: wrongMap, why, tip, deep: [dq + '?', da], vis });
  fs.writeFileSync(`public/lessons/${b.id}.json`, JSON.stringify({ id: b.id, audio: `/audio/${b.id}.mp3`, segs }));
});
if (errs.length) { console.log(errs); process.exit(1); }
fs.writeFileSync('src/data/questions.json', JSON.stringify(out));
fs.writeFileSync('scripts/speech.json', JSON.stringify(speech));
const chars = Object.values(speech).flat().join(' ').length;
console.log('ok', out.length, 'segments', Object.values(speech).flat().length, 'chars', chars);
console.log(speech.q001.slice(0, 8).join('\n'));
