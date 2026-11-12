// 도면풍 선 그림 3종 — 사진이 적어 히어로 시각 요소를 선·치수선으로 만든다. 실제 규격이 아닌 구조 설명용.
// hoist: 아이빔 + 트롤리 + 호이스트 본체 + 훅 + 양정 치수 / crane: 거더 크레인 + 스팬 치수 / hanger: 천장 보 + 행거 + 아이빔 + 호이스트
const L = ({ x1, y1, x2, y2, t }: { x1: number; y1: number; x2: number; y2: number; t: string }) => (
  <g className="dw-lead"><path d={`M${x1} ${y1} L${x2} ${y2} H${x2 < x1 ? x2 - 6 : x2 + 6}`} /><text x={x2 < x1 ? x2 - 10 : x2 + 10} y={y2 + 4} textAnchor={x2 < x1 ? 'end' : 'start'}>{t}</text></g>
);
const Arrow = ({ x, y1, y2, t }: { x: number; y1: number; y2: number; t: string }) => (
  <g className="dw-dim"><path d={`M${x} ${y1} V${y2} M${x - 5} ${y1 + 8} L${x} ${y1} L${x + 5} ${y1 + 8} M${x - 5} ${y2 - 8} L${x} ${y2} L${x + 5} ${y2 - 8} M${x - 12} ${y1} H${x + 12} M${x - 12} ${y2} H${x + 12}`} />
    <text x={x + 10} y={(y1 + y2) / 2} transform={`rotate(90 ${x + 10} ${(y1 + y2) / 2})`} textAnchor="middle">{t}</text></g>
);
const HArrow = ({ y, x1, x2, t }: { y: number; x1: number; x2: number; t: string }) => (
  <g className="dw-dim"><path d={`M${x1} ${y} H${x2} M${x1 + 8} ${y - 5} L${x1} ${y} L${x1 + 8} ${y + 5} M${x2 - 8} ${y - 5} L${x2} ${y} L${x2 - 8} ${y + 5} M${x1} ${y - 10} V${y + 10} M${x2} ${y - 10} V${y + 10}`} />
    <text x={(x1 + x2) / 2} y={y - 8} textAnchor="middle">{t}</text></g>
);

const Hoist = ({ x, y, s = 1 }: { x: number; y: number; s?: number }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-34} y={0} width={68} height={16} className="dw-part" />
    <circle cx={-20} cy={-4} r={5} className="dw-part" /><circle cx={20} cy={-4} r={5} className="dw-part" />
    <rect x={-40} y={20} width={80} height={52} className="dw-body" />
    <rect x={40} y={30} width={34} height={34} className="dw-part" /><path d="M48 30 V64 M56 30 V64 M64 30 V64" className="dw-thin" />
    <path d="M-40 46 H40" className="dw-thin" />
  </g>
);

export function Drawing({ kind = 'hoist', caption }: { kind?: string; caption?: string }) {
  return (
    <figure className="drawing" data-reveal aria-label={caption || '호이스트 구조 도면'}>
      <svg viewBox="0 0 480 380" role="img" aria-hidden="true">
        <defs><pattern id="dwg" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M20 0 H0 V20" className="dw-grid" /></pattern></defs>
        <rect width="480" height="380" fill="url(#dwg)" />
        {kind === 'crane' ? (
          <g>
            <path d="M40 70 V350 M60 70 V350 M420 70 V350 M440 70 V350" className="dw-part" />
            <rect x={30} y={60} width={420} height={16} className="dw-body" />
            <path d="M40 76 L60 96 M60 76 L40 96 M420 76 L440 96 M440 76 L420 96" className="dw-thin" />
            <Hoist x={250} y={84} />
            <path d="M250 156 V268" className="dw-rope" /><path d="M244 268 h12 v14 h-12 z M250 282 v8 a10 10 0 1 0 10 10" className="dw-hook" />
            <rect x={205} y={318} width={90} height={32} className="dw-load" />
            <HArrow y={40} x1={50} x2={430} t="SPAN · 현장 실측" />
            <Arrow x={110} y1={76} y2={318} t="양정 H" />
            <L x1={330} y1={100} x2={380} y2={140} t="HOIST" />
            <text x={70} y={366} className="dw-note">GIRDER · RUNWAY</text>
          </g>
        ) : kind === 'hanger' ? (
          <g>
            <path d="M20 40 L240 10 L460 40" className="dw-part" /><path d="M20 40 H460" className="dw-part" />
            <path d="M80 40 L110 22 M160 40 L180 18 M300 40 L320 18 M380 40 L400 22" className="dw-thin" />
            <path d="M120 40 V96 M360 40 V96 M112 40 V96 M368 40 V96" className="dw-rod" />
            <rect x={60} y={96} width={360} height={7} className="dw-part" /><rect x={60} y={113} width={360} height={7} className="dw-part" /><path d="M240 103 V113" className="dw-part" />
            <Hoist x={250} y={128} s={0.9} />
            <path d="M250 194 V286" className="dw-rope" /><path d="M244 286 h12 v14 h-12 z M250 300 v8 a10 10 0 1 0 10 10" className="dw-hook" />
            <rect x={205} y={330} width={90} height={30} className="dw-load" />
            <L x1={116} y1={70} x2={60} y2={150} t="I-BEAM HANGER" />
            <L x1={400} y1={108} x2={440} y2={170} t="I-BEAM" />
            <L x1={320} y1={160} x2={400} y2={230} t="HOIST" />
          </g>
        ) : (
          <g>
            <rect x={30} y={56} width={420} height={8} className="dw-part" /><rect x={30} y={78} width={420} height={8} className="dw-part" /><path d="M240 64 V78" className="dw-part" />
            <Hoist x={240} y={94} />
            <path d="M236 166 V270 M244 166 V270" className="dw-rope" /><path d="M232 270 h16 v16 h-16 z M240 286 v10 a12 12 0 1 0 12 12" className="dw-hook" />
            <rect x={190} y={322} width={100} height={36} className="dw-load" />
            <Arrow x={410} y1={86} y2={322} t="양정 H · 현장 사양" />
            <L x1={70} y1={56} x2={100} y2={30} t="I-BEAM" />
            <L x1={206} y1={94} x2={110} y2={120} t="TROLLEY" />
            <L x1={202} y1={140} x2={110} y2={170} t="HOIST" />
            <L x1={232} y1={280} x2={130} y2={260} t="HOOK" />
            <path d="M330 250 h22 v40 h-22 z M341 250 v-16" className="dw-part" /><text x={360} y={300} className="dw-note">REMOTE</text>
          </g>
        )}
      </svg>
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}
