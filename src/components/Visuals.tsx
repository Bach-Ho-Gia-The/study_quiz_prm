import type { CSSProperties, ReactNode } from "react";

type P = { playing?: boolean };
const W = (children: ReactNode, css = "", playing = true) => (
  <svg className="scene" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid meet" style={{ ["--ps" as string]: playing ? "running" : "paused" } as CSSProperties} role="img">
    <style>{css}</style>
    {children}
  </svg>
);
const pop = (d: number): CSSProperties => ({ animation: `popIn .6s cubic-bezier(.2,1.4,.4,1) ${d}s both`, transformBox: "fill-box", transformOrigin: "center" });
const Box = ({ x, y, w, h, t, fill = "#fff", stroke = "#1f2340", d = 0, tc = "#1f2340", fs = 15 }: { x: number; y: number; w: number; h: number; t: string; fill?: string; stroke?: string; d?: number; tc?: string; fs?: number }) => (
  <g style={pop(d)} className="ps">
    <rect x={x} y={y} width={w} height={h} rx={12} fill={fill} stroke={stroke} strokeWidth={3} />
    <text x={x + w / 2} y={y + h / 2 + fs / 3} textAnchor="middle" fontSize={fs} fill={tc}>{t}</text>
  </g>
);

function Tree({ playing }: P) {
  const L = (x1: number, y1: number, x2: number, y2: number, d: number) => (
    <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#1f2340" strokeWidth={3} strokeDasharray="200" style={{ animation: `drawLine .6s ease ${d}s both` }} className="ps" />
  );
  return W(<>
    {L(200, 62, 200, 90, 0.4)}{L(200, 126, 200, 154, 0.9)}{L(200, 190, 110, 222, 1.4)}{L(200, 190, 290, 222, 1.6)}
    <Box x={110} y={24} w={180} h={38} t="MaterialApp" fill="#e0e7ff" />
    <Box x={130} y={90} w={140} h={36} t="Scaffold" fill="#fde68a" d={0.5} />
    <Box x={140} y={154} w={120} h={36} t="Column" fill="#bbf7d0" d={1} />
    <Box x={50} y={222} w={120} h={38} t="Text" fill="#fecdd3" d={1.5} />
    <Box x={230} y={222} w={120} h={38} t="Button" fill="#bae6fd" d={1.7} />
    <text x={200} y={288} textAnchor="middle" fontSize={14} fill="#5d6385">Cha chứa con, giống cái cây</text>
  </>, "", playing);
}
function Rebuild({ playing }: P) {
  const css = `@keyframes n1{0%,28%{opacity:1}33%,100%{opacity:0}} @keyframes n2{0%,30%{opacity:0}35%,62%{opacity:1}67%,100%{opacity:0}} @keyframes n3{0%,64%{opacity:0}69%,100%{opacity:1}}
  @keyframes tap{0%,25%,45%,100%{transform:translateY(0) scale(1)}32%{transform:translateY(5px) scale(.94)}} @keyframes fl{0%,28%,100%{fill:#fff}34%,50%{fill:#fed7aa}}`;
  return W(<>
    <rect x={70} y={14} width={260} height={210} rx={20} fill="#f8fafc" stroke="#1f2340" strokeWidth={3} />
    <rect x={90} y={30} width={220} height={36} rx={10} fill="#e5e7eb" stroke="#9ca3af" strokeWidth={2} /><text x={200} y={54} textAnchor="middle" fontSize={14} fill="#6b7280">AppBar · const (đứng yên)</text>
    <rect x={90} y={80} width={220} height={74} rx={12} stroke="#f97316" strokeWidth={4} style={{ animation: "fl 3.6s ease-in-out infinite" }} className="ps" fill="#fff" />
    {["n1", "n2", "n3"].map((a, i) => <text key={a} x={200} y={130} textAnchor="middle" fontSize={44} fill="#ea580c" style={{ animation: `${a} 3.6s linear infinite` }} className="ps">{i}</text>)}
    <rect x={90} y={168} width={220} height={36} rx={10} fill="#e5e7eb" stroke="#9ca3af" strokeWidth={2} /><text x={200} y={192} textAnchor="middle" fontSize={14} fill="#6b7280">Footer · const (đứng yên)</text>
    <g style={{ animation: "tap 3.6s ease-in-out infinite", transformBox: "fill-box", transformOrigin: "center" }} className="ps">
      <rect x={110} y={240} width={180} height={42} rx={14} fill="#4f46e5" /><text x={200} y={267} textAnchor="middle" fontSize={17} fill="#fff">setState()</text>
    </g>
    <text x={345} y={118} fontSize={30}>👆</text>
  </>, css, playing);
}
function Stream({ playing }: P) {
  const css = `@keyframes mv1{0%{transform:translateX(0);opacity:0}10%{opacity:1}80%{opacity:1}100%{transform:translateX(105px);opacity:0}}`;
  const ball = (x: number, c: string, t: string, d: number) => <g style={{ animation: `mv1 2.4s ease-in-out ${d}s infinite` }} className="ps"><circle cx={x} cy={150} r={17} fill={c} stroke="#1f2340" strokeWidth={3} /><text x={x} y={156} textAnchor="middle" fontSize={16} fill="#fff">{t}</text></g>;
  return W(<>
    <rect x={20} y={138} width={360} height={24} rx={12} fill="#e0f2fe" />
    <Box x={150} y={100} w={100} h={100} t="BLoC" fill="#fef3c7" fs={20} />
    <text x={60} y={95} textAnchor="middle" fontSize={16} fill="#0369a1">Event</text><text x={340} y={95} textAnchor="middle" fontSize={16} fill="#15803d">State</text>
    {ball(50, "#0284c7", "E", 0)}{ball(50, "#0284c7", "E", 1.2)}{ball(245, "#16a34a", "S", 0.6)}{ball(245, "#16a34a", "S", 1.8)}
    <text x={340} y={190} textAnchor="middle" fontSize={34}>📱</text>
    <text x={200} y={260} textAnchor="middle" fontSize={16} fill="#5d6385">Sự kiện vào, trạng thái chảy ra như vòi nước</text>
  </>, css, playing);
}
function Layout({ playing }: P) {
  const c = ["#fecdd3", "#bae6fd", "#bbf7d0"];
  const col = (x: number) => <>{[0, 1, 2].map((i) => <rect key={i} x={x + 30} y={60 + i * 52} width={60} height={42} rx={8} fill={c[i]} stroke="#1f2340" strokeWidth={3} style={pop(i * 0.3)} className="ps" />)}</>;
  const row = (x: number) => <>{[0, 1, 2].map((i) => <rect key={i} x={x + 8 + i * 38} y={105} width={32} height={60} rx={8} fill={c[i]} stroke="#1f2340" strokeWidth={3} style={pop(i * 0.3 + 1)} className="ps" />)}</>;
  const st = (x: number) => <>{[0, 1, 2].map((i) => <rect key={i} x={x + 18 + i * 20} y={85 + i * 20} width={62} height={62} rx={8} fill={c[i]} stroke="#1f2340" strokeWidth={3} style={pop(i * 0.3 + 2)} className="ps" />)}</>;
  return W(<>
    {[10, 140, 270].map((x) => <rect key={x} x={x} y={30} width={120} height={200} rx={16} fill="#fff" stroke="#e7dccb" strokeWidth={3} />)}
    {col(10)}{row(140)}{st(270)}
    {["Column", "Row", "Stack"].map((t, i) => <text key={t} x={70 + i * 130} y={256} textAnchor="middle" fontSize={17} fill="#4f46e5">{t}</text>)}
    {["↓ dọc", "→ ngang", "⧉ chồng"].map((t, i) => <text key={t} x={70 + i * 130} y={282} textAnchor="middle" fontSize={13} fill="#5d6385">{t}</text>)}
  </>, "", playing);
}
function Scroll({ playing }: P) {
  const css = `@keyframes sc{0%{transform:translateY(0)}100%{transform:translateY(-120px)}} @keyframes hd{0%,15%{transform:scaleY(1)}80%,100%{transform:scaleY(.38)}}`;
  return W(<>
    <defs><clipPath id="scr"><rect x={130} y={22} width={140} height={256} rx={14} /></clipPath></defs>
    <rect x={120} y={12} width={160} height={276} rx={24} fill="#fff" stroke="#1f2340" strokeWidth={4} />
    <g clipPath="url(#scr)">
      <g style={{ animation: "sc 3.5s ease-in-out infinite alternate" }} className="ps">
        {Array.from({ length: 9 }).map((_, i) => <g key={i}><rect x={140} y={112 + i * 48} width={120} height={38} rx={10} fill={["#fde68a", "#bbf7d0", "#bae6fd"][i % 3]} stroke="#1f2340" strokeWidth={2.5} /><text x={200} y={136 + i * 48} textAnchor="middle" fontSize={14}>Mục {i + 1}</text></g>)}
      </g>
      <g style={{ animation: "hd 3.5s ease-in-out infinite alternate", transformOrigin: "200px 22px" }} className="ps"><rect x={130} y={22} width={140} height={84} fill="#4f46e5" /><text x={200} y={70} textAnchor="middle" fontSize={16} fill="#fff">SliverAppBar</text></g>
    </g>
    <text x={50} y={150} fontSize={34} className="a-float">👆</text><text x={335} y={150} fontSize={14} fill="#5d6385" textAnchor="middle">cuộn</text>
  </>, css, playing);
}
function Storage({ playing }: P) {
  const css = `@keyframes dr{0%,100%{transform:translateX(0)}50%{transform:translateX(14px)}} @keyframes drop{0%{transform:translateY(-40px);opacity:0}30%{opacity:1}60%,100%{transform:translateY(0);opacity:1}}`;
  return W(<>
    <g style={pop(0)} className="ps"><rect x={20} y={70} width={100} height={110} rx={6} fill="#fef08a" stroke="#1f2340" strokeWidth={3} transform="rotate(-5 70 125)" /><text x={70} y={115} textAnchor="middle" fontSize={26}>📌</text><text x={70} y={148} textAnchor="middle" fontSize={13}>dark: on</text></g>
    <g style={pop(0.5)} className="ps"><rect x={150} y={50} width={100} height={150} rx={10} fill="#e0e7ff" stroke="#1f2340" strokeWidth={3} />{[0, 1, 2].map((i) => <g key={i} style={{ animation: `dr 2.4s ease-in-out ${i * 0.5}s infinite` }} className="ps"><rect x={160} y={62 + i * 46} width={80} height={36} rx={6} fill="#fff" stroke="#1f2340" strokeWidth={2.5} /><circle cx={200} cy={80 + i * 46} r={5} fill="#4f46e5" /></g>)}</g>
    <g style={pop(1)} className="ps">{[[310, 80], [338, 100], [310, 120], [282, 100], [338, 140], [310, 160]].map(([x, y], i) => <polygon key={i} points={`${x},${y - 20} ${x + 17},${y - 10} ${x + 17},${y + 10} ${x},${y + 20} ${x - 17},${y + 10} ${x - 17},${y - 10}`} fill="#fde68a" stroke="#1f2340" strokeWidth={2.5} />)}</g>
    {[70, 200, 310].map((x, i) => <circle key={x} cx={x} cy={215} r={9} fill={["#f97316", "#4f46e5", "#16a34a"][i]} style={{ animation: `drop 2s ease-in ${i * 0.4}s infinite` }} className="ps" />)}
    <text x={70} y={250} textAnchor="middle" fontSize={14} fill="#b45309">giấy nhớ</text><text x={200} y={250} textAnchor="middle" fontSize={14} fill="#4f46e5">tủ hồ sơ</text><text x={310} y={250} textAnchor="middle" fontSize={14} fill="#a16207">tổ ong</text>
    <text x={70} y={274} textAnchor="middle" fontSize={11} fill="#5d6385">prefs</text><text x={200} y={274} textAnchor="middle" fontSize={11} fill="#5d6385">sqflite</text><text x={310} y={274} textAnchor="middle" fontSize={11} fill="#5d6385">hive</text>
  </>, css, playing);
}
function Http({ playing }: P) {
  const css = `@keyframes rq{0%{transform:translateX(0);opacity:0}8%{opacity:1}40%{transform:translateX(170px);opacity:1}45%,100%{transform:translateX(170px);opacity:0}} @keyframes rs{0%,50%{transform:translateX(170px);opacity:0}55%{opacity:1}92%{transform:translateX(0);opacity:1}100%{transform:translateX(0);opacity:0}} @keyframes ok{0%,88%{opacity:0;transform:scale(.3)}94%,100%{opacity:1;transform:scale(1)}}`;
  return W(<>
    <text x={50} y={150} fontSize={60} textAnchor="middle">📱</text><text x={350} y={150} fontSize={60} textAnchor="middle">🖥️</text>
    <line x1={95} y1={110} x2={305} y2={110} stroke="#cbd5e1" strokeWidth={3} strokeDasharray="8 8" style={{ animation: "dashMove 1s linear infinite" }} className="ps" /><line x1={95} y1={190} x2={305} y2={190} stroke="#cbd5e1" strokeWidth={3} strokeDasharray="8 8" style={{ animation: "dashMove 1s linear infinite" }} className="ps" />
    <g style={{ animation: "rq 4s ease-in-out infinite" }} className="ps"><rect x={100} y={92} width={64} height={34} rx={10} fill="#4f46e5" /><text x={132} y={115} textAnchor="middle" fontSize={16} fill="#fff">GET</text></g>
    <g style={{ animation: "rs 4s ease-in-out infinite" }} className="ps"><rect x={100} y={172} width={90} height={34} rx={10} fill="#16a34a" /><text x={145} y={195} textAnchor="middle" fontSize={15} fill="#fff">{"{JSON}"}</text></g>
    <g style={{ animation: "ok 4s ease-in-out infinite", transformBox: "fill-box", transformOrigin: "center" }} className="ps"><rect x={160} y={225} width={80} height={38} rx={19} fill="#dcfce7" stroke="#16a34a" strokeWidth={3} /><text x={200} y={251} textAnchor="middle" fontSize={18} fill="#15803d">200 ✓</text></g>
    <text x={50} y={200} textAnchor="middle" fontSize={13} fill="#5d6385">app</text><text x={350} y={200} textAnchor="middle" fontSize={13} fill="#5d6385">máy chủ</text>
  </>, css, playing);
}
function Auth({ playing }: P) {
  const css = `@keyframes tk{0%{transform:translateX(0)}35%,100%{transform:translateX(118px)}} @keyframes door{0%,40%{transform:scaleX(1)}60%,90%{transform:scaleX(.18)}100%{transform:scaleX(1)}} @keyframes pass{0%,45%{transform:translateX(0)}85%,100%{transform:translateX(150px)}}`;
  return W(<>
    <g style={{ animation: "pass 5s ease-in-out infinite" }} className="ps"><text x={40} y={190} fontSize={52}>🙂</text></g>
    <text x={190} y={140} fontSize={50} className="a-float">💂</text>
    <g style={{ animation: "door 5s ease-in-out infinite", transformOrigin: "300px 150px" }} className="ps"><rect x={300} y={70} width={70} height={150} rx={8} fill="#a16207" stroke="#1f2340" strokeWidth={3} /><circle cx={355} cy={150} r={5} fill="#fde047" /></g>
    <g style={{ animation: "tk 5s ease-in-out infinite" }} className="ps"><rect x={30} y={100} width={80} height={36} rx={8} fill="#fde047" stroke="#1f2340" strokeWidth={3} /><text x={70} y={124} textAnchor="middle" fontSize={15}>🎫 token</text></g>
    <text x={190} y={188} textAnchor="middle" fontSize={15} fill="#be123c">Guard</text><text x={200} y={262} textAnchor="middle" fontSize={15} fill="#5d6385">Có thẻ thì mở cổng, không thẻ thì chặn lại</text>
  </>, css, playing);
}
function Test({ playing }: P) {
  const L = [{ t: "Integration · ít, chậm", y: 36, p: "200,30 255,90 145,90", c: "#fecdd3", d: 2 }, { t: "Widget", y: 130, p: "145,90 255,90 290,170 110,170", c: "#fde68a", d: 1 }, { t: "Unit · nhiều, nhanh", y: 210, p: "110,170 290,170 330,250 70,250", c: "#bbf7d0", d: 0 }];
  return W(<>
    {L.map((l) => <g key={l.t} style={pop(l.d)} className="ps"><polygon points={l.p} fill={l.c} stroke="#1f2340" strokeWidth={3} strokeLinejoin="round" /></g>)}
    <text x={200} y={72} textAnchor="middle" fontSize={13}>E2E</text><text x={200} y={136} textAnchor="middle" fontSize={16}>Widget</text><text x={200} y={216} textAnchor="middle" fontSize={17}>Unit</text>
    <text x={200} y={278} textAnchor="middle" fontSize={13} fill="#5d6385">Đáy to dùng nhiều · đỉnh nhỏ dùng ít</text>
    {[0, 1, 2].map((i) => <text key={i} x={345} y={225 - i * 70} fontSize={26} style={{ animation: `popIn .5s ease ${i * 1 + 0.8}s both` }} className="ps">✅</text>)}
  </>, "", playing);
}
function Anim({ playing }: P) {
  const css = `@keyframes b1{0%{transform:translateX(0)}100%{transform:translateX(250px)}} @keyframes grow{0%{width:0}100%{width:250px}}`;
  const row = (y: number, name: string, ease: string, c: string) => <g><text x={20} y={y - 14} fontSize={13} fill="#5d6385">{name}</text><rect x={30} y={y} width={300} height={6} rx={3} fill="#e5e7eb" /><circle cx={50} cy={y + 3} r={14} fill={c} stroke="#1f2340" strokeWidth={3} style={{ animation: `b1 2.4s ${ease} infinite alternate` }} className="ps" /></g>;
  return W(<>
    {row(50, "linear", "linear", "#94a3b8")}{row(110, "easeOut", "cubic-bezier(.1,.8,.2,1)", "#38bdf8")}{row(170, "bounceOut", "cubic-bezier(.3,1.9,.5,.8)", "#f472b6")}
    <text x={20} y={228} fontSize={13} fill="#5d6385">Tween: từ 0 tới 100</text>
    <rect x={30} y={238} width={300} height={22} rx={11} fill="#e5e7eb" /><rect x={30} y={238} height={22} rx={11} fill="#a78bfa" style={{ animation: "grow 2.4s ease-in-out infinite alternate" }} className="ps" />
    <text x={30} y={282} fontSize={12} fill="#5d6385">0</text><text x={330} y={282} fontSize={12} fill="#5d6385" textAnchor="end">100</text>
  </>, css, playing);
}
function Nav({ playing }: P) {
  const css = `@keyframes push{0%,10%{transform:translateY(180px);opacity:0}30%,70%{transform:translateY(0);opacity:1}90%,100%{transform:translateY(180px);opacity:0}} @keyframes l1{0%,8%{opacity:0}12%,40%{opacity:1}50%,100%{opacity:0}} @keyframes l2{0%,60%{opacity:0}70%,90%{opacity:1}100%{opacity:0}}`;
  return W(<>
    <g style={pop(0)} className="ps"><rect x={110} y={90} width={180} height={150} rx={16} fill="#e0e7ff" stroke="#1f2340" strokeWidth={3} /><text x={200} y={175} textAnchor="middle" fontSize={22}>Trang chủ</text></g>
    <g style={{ animation: "push 5s ease-in-out infinite" }} className="ps"><rect x={130} y={60} width={180} height={150} rx={16} fill="#fde68a" stroke="#1f2340" strokeWidth={3} /><text x={220} y={140} textAnchor="middle" fontSize={22}>Chi tiết</text></g>
    <text x={200} y={40} textAnchor="middle" fontSize={24} fill="#4f46e5" style={{ animation: "l1 5s linear infinite" }} className="ps">push ⬆ đặt lên trên</text>
    <text x={200} y={40} textAnchor="middle" fontSize={24} fill="#e11d48" style={{ animation: "l2 5s linear infinite" }} className="ps">pop ⬇ lấy ra</text>
    <text x={200} y={275} textAnchor="middle" fontSize={15} fill="#5d6385">Như chồng đĩa: đặt lên là push, lấy xuống là pop</text>
  </>, css, playing);
}
function Form({ playing }: P) {
  const css = `@keyframes ty{0%{width:0}50%,100%{width:150px}} @keyframes bad{0%,45%{opacity:0}50%,80%{opacity:1}90%,100%{opacity:0}} @keyframes good{0%,85%{opacity:0;transform:scale(.3)}92%,100%{opacity:1;transform:scale(1)}} @keyframes sh{0%,45%,100%{transform:translateX(0)}50%{transform:translateX(-6px)}55%{transform:translateX(6px)}60%{transform:translateX(-4px)}65%{transform:translateX(0)}}`;
  return W(<>
    <rect x={60} y={20} width={280} height={260} rx={20} fill="#fff" stroke="#1f2340" strokeWidth={3} />
    <text x={80} y={58} fontSize={15} fill="#5d6385">Email</text><rect x={80} y={66} width={240} height={36} rx={10} fill="#f8fafc" stroke="#94a3b8" strokeWidth={2.5} /><rect x={90} y={78} height={12} rx={6} fill="#4f46e5" style={{ animation: "ty 4s ease-in-out infinite" }} className="ps" />
    <text x={80} y={134} fontSize={15} fill="#5d6385">Mật khẩu</text>
    <g style={{ animation: "sh 4s ease-in-out infinite" }} className="ps"><rect x={80} y={142} width={240} height={36} rx={10} fill="#fff1f2" stroke="#e11d48" strokeWidth={3} /></g>
    <text x={80} y={200} fontSize={14} fill="#e11d48" style={{ animation: "bad 4s linear infinite" }} className="ps">⚠ Cần ít nhất 6 ký tự</text>
    <rect x={80} y={216} width={240} height={44} rx={14} fill="#4f46e5" /><text x={200} y={245} textAnchor="middle" fontSize={17} fill="#fff">Gửi</text>
    <text x={335} y={50} fontSize={36} style={{ animation: "good 4s ease-in-out infinite", transformBox: "fill-box", transformOrigin: "center" }} className="ps">✅</text>
  </>, css, playing);
}
function Arch({ playing }: P) {
  const css = `@keyframes ar{0%,100%{transform:translateY(0);opacity:.4}50%{transform:translateY(8px);opacity:1}}`;
  return W(<>
    <Box x={80} y={22} w={240} h={60} t="🎨 Giao diện (UI)" fill="#e0e7ff" fs={18} />
    <Box x={80} y={112} w={240} h={60} t="🧠 Logic (BLoC, state)" fill="#fed7aa" d={0.5} fs={18} />
    <Box x={80} y={202} w={240} h={60} t="🗄️ Dữ liệu (API, DB)" fill="#99f6e4" d={1} fs={18} />
    {[88, 178].map((y) => <text key={y} x={200} y={y + 20} textAnchor="middle" fontSize={24} fill="#1f2340" style={{ animation: "ar 1.6s ease-in-out infinite" }} className="ps">⇅</text>)}
    <text x={200} y={288} textAnchor="middle" fontSize={14} fill="#5d6385">Mỗi lớp lo một việc, gọn và dễ sửa</text>
  </>, css, playing);
}
function Dart({ playing }: P) {
  const css = `@keyframes rv{0%{transform:scaleX(0)}60%,100%{transform:scaleX(1)}}`;
  const lines: [string, ReactNode][] = [
    ["final", <><tspan fill="#c026d3">final</tspan> name = <tspan fill="#16a34a">&apos;Minh&apos;</tspan>;</>],
    ["const", <><tspan fill="#c026d3">const</tspan> pi = <tspan fill="#ea580c">3.14</tspan>;</>],
    ["null", <><tspan fill="#0284c7">int</tspan>? age; <tspan fill="#94a3b8">// được phép rỗng</tspan></>],
    ["list", <><tspan fill="#0284c7">List</tspan>&lt;<tspan fill="#0284c7">String</tspan>&gt; xs = [<tspan fill="#16a34a">&apos;a&apos;</tspan>];</>],
  ];
  return W(<>
    <rect x={20} y={30} width={360} height={220} rx={18} fill="#fff" stroke="#1f2340" strokeWidth={3} />
    <circle cx={44} cy={52} r={6} fill="#fb7185" /><circle cx={64} cy={52} r={6} fill="#fbbf24" /><circle cx={84} cy={52} r={6} fill="#4ade80" />
    {lines.map(([k, t], i) => <g key={k} style={{ animation: `rv .9s ease ${i * 0.9}s both`, transformOrigin: "40px 0" }} className="ps"><text x={40} y={100 + i * 36} fontSize={17} className="mono" style={{ fontFamily: "var(--font-jb), monospace", fontWeight: 700 }}>{t}</text></g>)}
    <text x={200} y={282} textAnchor="middle" fontSize={14} fill="#5d6385">Dart: ngôn ngữ của Flutter</text>
  </>, css, playing);
}
function Tools({ playing }: P) {
  const css = `@keyframes ph{0%,38%{fill:#e0e7ff}45%,100%{fill:#fde68a}} @keyframes bolt{0%,35%{opacity:0;transform:scale(.4)}45%,70%{opacity:1;transform:scale(1.2)}100%{opacity:0}} @keyframes cd{0%,35%{opacity:.25}45%,100%{opacity:1}}`;
  return W(<>
    <rect x={20} y={70} width={190} height={130} rx={12} fill="#fff" stroke="#1f2340" strokeWidth={3} /><rect x={6} y={200} width={218} height={12} rx={6} fill="#cbd5e1" stroke="#1f2340" strokeWidth={2} />
    {[0, 1, 2, 3].map((i) => <rect key={i} x={36} y={88 + i * 26} width={[110, 80, 130, 60][i]} height={10} rx={5} fill={i === 2 ? "#fb923c" : "#cbd5e1"} style={i === 2 ? { animation: "cd 3.6s ease infinite" } : undefined} className="ps" />)}
    <text x={115} y={236} textAnchor="middle" fontSize={14} fill="#4f46e5">Lưu code (Ctrl+S)</text>
    <g style={{ animation: "bolt 3.6s ease infinite", transformBox: "fill-box", transformOrigin: "center" }} className="ps"><text x={235} y={140} fontSize={44}>⚡</text></g>
    <rect x={290} y={50} width={90} height={170} rx={16} stroke="#1f2340" strokeWidth={4} style={{ animation: "ph 3.6s ease infinite" }} className="ps" fill="#e0e7ff" /><text x={335} y={142} textAnchor="middle" fontSize={34}>📲</text>
    <text x={335} y={246} textAnchor="middle" fontSize={14} fill="#5d6385">đổi ngay</text><text x={200} y={284} textAnchor="middle" fontSize={13} fill="#5d6385">Hot reload: sửa xong thấy liền</text>
  </>, css, playing);
}
function Perf({ playing }: P) {
  const css = `@keyframes nd{0%{transform:rotate(-80deg)}55%{transform:rotate(55deg)}70%{transform:rotate(40deg)}100%{transform:rotate(48deg)}}`;
  return W(<>
    <path d="M60 210 A140 140 0 0 1 133 88" fill="none" stroke="#ef4444" strokeWidth={26} strokeLinecap="round" />
    <path d="M133 88 A140 140 0 0 1 267 88" fill="none" stroke="#f59e0b" strokeWidth={26} />
    <path d="M267 88 A140 140 0 0 1 340 210" fill="none" stroke="#22c55e" strokeWidth={26} strokeLinecap="round" />
    <g style={{ animation: "nd 3.6s cubic-bezier(.3,1.4,.5,1) infinite alternate", transformOrigin: "200px 210px" }} className="ps"><line x1={200} y1={210} x2={200} y2={92} stroke="#1f2340" strokeWidth={7} strokeLinecap="round" /></g>
    <circle cx={200} cy={210} r={14} fill="#1f2340" />
    <text x={200} y={256} textAnchor="middle" fontSize={26} fill="#15803d">60 FPS · mượt</text><text x={70} y={235} fontSize={12} fill="#ef4444">giật</text><text x={330} y={235} fontSize={12} fill="#16a34a" textAnchor="end">mượt</text>
  </>, css, playing);
}

const MAP: Record<string, (p: P) => ReactNode> = { tree: Tree, rebuild: Rebuild, stream: Stream, layout: Layout, scroll: Scroll, storage: Storage, http: Http, auth: Auth, test: Test, anim: Anim, nav: Nav, form: Form, arch: Arch, dart: Dart, tools: Tools, perf: Perf };
export function Scene({ vis, playing = true }: { vis: string; playing?: boolean }) {
  const C = MAP[vis] || Tree;
  return <C playing={playing} />;
}
