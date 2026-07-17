import type { BikeConfig, FrameType, WheelType, DecalType } from "@/lib/bike-types";

const RW = 45; // wheel radius
const RL = { x: 70, y: 148 }; // rear wheel center
const FR = { x: 250, y: 148 }; // front wheel center
const BB = { x: 148, y: 150 }; // bottom bracket

function Wheel({ cx, cy, type, accent }: { cx: number; cy: number; type: WheelType; accent: string }) {
  const spokes = [];
  if (type === "classic") {
    for (let i = 0; i < 12; i++) {
      const a = (i * Math.PI) / 6;
      spokes.push(
        <line
          key={i}
          x1={cx}
          y1={cy}
          x2={cx + Math.cos(a) * (RW - 4)}
          y2={cy + Math.sin(a) * (RW - 4)}
          stroke="#3a3a3a"
          strokeWidth={1}
        />
      );
    }
  } else if (type === "aero") {
    for (let i = 0; i < 4; i++) {
      const a = (i * Math.PI) / 2 + 0.4;
      spokes.push(
        <line
          key={i}
          x1={cx - Math.cos(a) * (RW - 5)}
          y1={cy - Math.sin(a) * (RW - 5)}
          x2={cx + Math.cos(a) * (RW - 5)}
          y2={cy + Math.sin(a) * (RW - 5)}
          stroke="#3a3a3a"
          strokeWidth={3.5}
        />
      );
    }
  }
  return (
    <g>
      <circle cx={cx} cy={cy} r={RW} fill="none" stroke="#26251f" strokeWidth={7} />
      {type === "deep" && (
        <circle cx={cx} cy={cy} r={RW - 8} fill="none" stroke={accent} strokeWidth={9} opacity={0.85} />
      )}
      {spokes}
      <circle cx={cx} cy={cy} r={4} fill="#26251f" />
    </g>
  );
}

/** Per-frame geometry: seat cluster, head tube top, bars and extras. */
const GEO: Record<
  FrameType,
  {
    seat: { x: number; y: number };
    head: { x: number; y: number };
    bars: (paint: string) => React.ReactNode;
    extras?: (paint: string, accent: string) => React.ReactNode;
    curvedTop?: boolean;
  }
> = {
  road: {
    seat: { x: 118, y: 82 },
    head: { x: 226, y: 78 },
    bars: () => (
      <path
        d="M 226 78 L 232 66 q 14 -4 18 6 q 3 10 -8 12"
        fill="none"
        stroke="#26251f"
        strokeWidth={5}
        strokeLinecap="round"
      />
    ),
  },
  gravel: {
    seat: { x: 116, y: 86 },
    head: { x: 224, y: 84 },
    bars: () => (
      <path
        d="M 224 84 L 230 70 q 16 -4 20 8 q 3 11 -9 13"
        fill="none"
        stroke="#26251f"
        strokeWidth={5}
        strokeLinecap="round"
      />
    ),
    extras: (_p, accent) => (
      <>
        {/* knobby tire hint */}
        <circle cx={RL.x} cy={RL.y} r={RW} fill="none" stroke={accent} strokeWidth={2} strokeDasharray="3 5" />
        <circle cx={FR.x} cy={FR.y} r={RW} fill="none" stroke={accent} strokeWidth={2} strokeDasharray="3 5" />
      </>
    ),
  },
  commuter: {
    seat: { x: 120, y: 76 },
    head: { x: 222, y: 82 },
    bars: () => (
      <path
        d="M 222 82 L 226 62 M 214 60 L 238 60"
        fill="none"
        stroke="#26251f"
        strokeWidth={5}
        strokeLinecap="round"
      />
    ),
    extras: (paint) => (
      // rear rack
      <path
        d="M 118 82 L 70 96 M 70 96 L 96 96"
        fill="none"
        stroke={paint}
        strokeWidth={4}
        strokeLinecap="round"
      />
    ),
  },
  vintage: {
    seat: { x: 118, y: 80 },
    head: { x: 224, y: 80 },
    curvedTop: true,
    bars: () => (
      <path
        d="M 224 80 L 228 64 q 12 -10 22 0"
        fill="none"
        stroke="#26251f"
        strokeWidth={5}
        strokeLinecap="round"
      />
    ),
    extras: () => (
      <>
        {/* fenders */}
        <path
          d={`M ${RL.x - RW - 4} ${RL.y} A ${RW + 4} ${RW + 4} 0 0 1 ${RL.x} ${RL.y - RW - 4}`}
          fill="none"
          stroke="#4d4a42"
          strokeWidth={4}
        />
        <path
          d={`M ${FR.x} ${FR.y - RW - 4} A ${RW + 4} ${RW + 4} 0 0 1 ${FR.x + RW + 4} ${FR.y}`}
          fill="none"
          stroke="#4d4a42"
          strokeWidth={4}
        />
      </>
    ),
  },
};

function Decal({ decal, head, accent }: { decal: DecalType; head: { x: number; y: number }; accent: string }) {
  if (decal === "none") return null;
  // decorate the down tube (head -> bottom bracket)
  const steps = decal === "dots" ? 5 : 6;
  const marks = [];
  for (let i = 1; i <= steps; i++) {
    const t = i / (steps + 1);
    const x = head.x + (BB.x - head.x) * t;
    const y = head.y + (BB.y - head.y) * t;
    if (decal === "dots") {
      marks.push(<circle key={i} cx={x} cy={y} r={2.6} fill={accent} />);
    } else if (decal === "stripes") {
      marks.push(<line key={i} x1={x - 4} y1={y - 5} x2={x + 4} y2={y + 5} stroke={accent} strokeWidth={3} />);
    } else if (decal === "checker" && i % 2 === 0) {
      marks.push(<rect key={i} x={x - 4} y={y - 4} width={8} height={8} fill={accent} transform={`rotate(35 ${x} ${y})`} />);
    }
  }
  return <g>{marks}</g>;
}

export function BikeSvg({
  config,
  className,
  wheelRotation = 0,
}: {
  config: BikeConfig;
  className?: string;
  wheelRotation?: number;
}) {
  const g = GEO[config.frame];
  const { paint, accent } = config;
  const topTube = g.curvedTop
    ? `M ${g.seat.x} ${g.seat.y} Q ${(g.seat.x + g.head.x) / 2} ${g.seat.y + 18} ${g.head.x} ${g.head.y}`
    : `M ${g.seat.x} ${g.seat.y} L ${g.head.x} ${g.head.y}`;

  return (
    <svg viewBox="0 0 320 210" className={className} role="img" aria-label={config.signature ? `${config.signature}'s bike` : "A visitor bike"}>
      <g transform={`rotate(${wheelRotation} ${RL.x} ${RL.y})`}>
        <Wheel cx={RL.x} cy={RL.y} type={config.wheels} accent={accent} />
      </g>
      <g transform={`rotate(${wheelRotation} ${FR.x} ${FR.y})`}>
        <Wheel cx={FR.x} cy={FR.y} type={config.wheels} accent={accent} />
      </g>
      {g.extras?.(paint, accent)}
      {/* frame */}
      <g stroke={paint} strokeWidth={6} strokeLinecap="round" fill="none">
        <path d={topTube} />
        <path d={`M ${g.head.x} ${g.head.y} L ${BB.x} ${BB.y}`} /> {/* down tube */}
        <path d={`M ${g.seat.x} ${g.seat.y} L ${BB.x} ${BB.y}`} /> {/* seat tube */}
        <path d={`M ${BB.x} ${BB.y} L ${RL.x} ${RL.y}`} /> {/* chainstay */}
        <path d={`M ${g.seat.x} ${g.seat.y} L ${RL.x} ${RL.y}`} /> {/* seatstay */}
        <path d={`M ${g.head.x} ${g.head.y} L ${FR.x} ${FR.y}`} /> {/* fork */}
      </g>
      <Decal decal={config.decal} head={g.head} accent={accent} />
      {/* drivetrain */}
      <circle cx={BB.x} cy={BB.y} r={11} fill="none" stroke="#26251f" strokeWidth={3.5} />
      <line x1={BB.x} y1={BB.y} x2={RL.x} y2={RL.y} stroke="#3a3a3a" strokeWidth={1.5} />
      {/* seat + post */}
      <line x1={g.seat.x} y1={g.seat.y} x2={g.seat.x - 4} y2={g.seat.y - 16} stroke="#26251f" strokeWidth={4} />
      <line x1={g.seat.x - 14} y1={g.seat.y - 18} x2={g.seat.x + 6} y2={g.seat.y - 18} stroke="#26251f" strokeWidth={6} strokeLinecap="round" />
      {g.bars(paint)}
      {/* signature on the top tube */}
      {config.signature && (
        <text
          x={(g.seat.x + g.head.x) / 2}
          y={(g.seat.y + g.head.y) / 2 - 10}
          textAnchor="middle"
          fontFamily="var(--font-caveat), cursive"
          fontSize={19}
          fill="#26251f"
          transform={`rotate(${g.curvedTop ? 4 : -1.5} ${(g.seat.x + g.head.x) / 2} ${(g.seat.y + g.head.y) / 2})`}
        >
          {config.signature}
        </text>
      )}
    </svg>
  );
}
