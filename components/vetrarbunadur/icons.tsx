// Hand-drawn line icons for /vetrarbunadur, in the same 24px / 1.6 stroke
// style as components/CategoryIcons.tsx. All decorative (aria-hidden): every
// icon sits next to a visible text label.

import type { SVGProps } from "react";
import type {
  BenefitIconName,
  GigantIconName,
  SpikeIconName,
  VehicleIconName,
} from "@/lib/vetrarbunadur";

type IconProps = SVGProps<SVGSVGElement>;

const LINE = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

function Svg({ children, viewBox = "0 0 24 24", ...props }: IconProps) {
  return (
    <svg viewBox={viewBox} aria-hidden="true" {...LINE} {...props}>
      {children}
    </svg>
  );
}

// ---------------------------------------------------------------- vehicles

function TractorIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="16.5" cy="15.5" r="4.5" />
      <circle cx="16.5" cy="15.5" r="1.3" />
      <circle cx="5.5" cy="17.2" r="2.8" />
      <path d="M8.3 17.2H12" />
      <path d="M2.8 15.2v-3.7H10V4.5h6l1.1 6.5" />
      <path d="M12.5 4.5v6.5M7 11.5V8" />
    </Svg>
  );
}

function LoaderIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="8" cy="17" r="3" />
      <circle cx="18" cy="17" r="3" />
      <path d="M11 17h4" />
      <path d="M5.5 14h16v-3h-2.5V5h-5.5v6" />
      <path d="M13.5 9.5 6.5 11.5" />
      <path d="M2 9.5h3.2l1.3 4.5H2.6Z" />
    </Svg>
  );
}

function TruckIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M2.5 16V6.5h11V16" />
      <path d="M13.5 9.5h4.2l3 3.4V16" />
      <path d="M15.8 9.5v3.4h4.9" />
      <circle cx="6.5" cy="17" r="2" />
      <circle cx="17.5" cy="17" r="2" />
      <path d="M2.5 16h2M8.5 16h7M19.5 16h1.2" />
    </Svg>
  );
}

function AtvIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="6" cy="16.5" r="3.2" />
      <circle cx="18" cy="16.5" r="3.2" />
      <path d="M9.2 16.5h5.6" />
      <path d="M3 13.3 5.8 10.5h12.4l2.8 2.8" />
      <path d="M9 10.5l1-2.2h4.5" />
      <path d="M16 10.5l1.6-3.5h2.2" />
    </Svg>
  );
}

export const VEHICLE_ICONS: Record<VehicleIconName, (props: IconProps) => React.ReactElement> = {
  tractor: TractorIcon,
  loader: LoaderIcon,
  truck: TruckIcon,
  atv: AtvIcon,
};

// ---------------------------------------------------------------- spike types
// 96x48 side view: a short length of chain lying on an ice line, with the
// grip element (square edges, U-studs or spikes) biting into it.

function IceLine({ y = 36 }: { y?: number }) {
  return (
    <>
      <path d={`M2 ${y}h92`} strokeWidth={2} opacity="0.55" />
      <path
        d={[10, 24, 38, 52, 66, 80].map((x) => `M${x} ${y + 4}l-4 5`).join("")}
        strokeWidth={1.4}
        opacity="0.3"
      />
    </>
  );
}

// Two links seen from the side (long stadiums) joined by an edge-on link.
function ChainRow({ y, rx }: { y: number; rx: number }) {
  return (
    <>
      <rect x="30" y={y + 3.5} width="36" height="5" rx="2.5" fill="currentColor" stroke="none" opacity="0.4" />
      <rect x="6" y={y} width="32" height="12" rx={rx} strokeWidth={3.4} />
      <rect x="58" y={y} width="32" height="12" rx={rx} strokeWidth={3.4} />
    </>
  );
}

function SquareSpikeIcon(props: IconProps) {
  // Square-profile links resting straight on the ice: the edges do the gripping.
  return (
    <Svg viewBox="0 0 96 48" {...props}>
      <IceLine y={35} />
      <ChainRow y={21} rx={1.5} />
    </Svg>
  );
}

function UbroddIcon(props: IconProps) {
  return (
    <Svg viewBox="0 0 96 48" {...props}>
      <IceLine y={37} />
      <ChainRow y={16} rx={2.5} />
      <path d="M13 28v11h18V28M65 28v11h18V28" strokeWidth={3.2} />
    </Svg>
  );
}

function StudSpikeIcon(props: IconProps) {
  return (
    <Svg viewBox="0 0 96 48" {...props}>
      <IceLine y={36} />
      <ChainRow y={16} rx={6} />
      <path d="M12 28l3.5 11 3.5-11M25 28l3.5 11 3.5-11M64 28l3.5 11 3.5-11M77 28l3.5 11 3.5-11" strokeWidth={2.6} />
    </Svg>
  );
}

export const SPIKE_ICONS: Record<SpikeIconName, (props: IconProps) => React.ReactElement> = {
  square: SquareSpikeIcon,
  ubrodd: UbroddIcon,
  spike: StudSpikeIcon,
};

// ---------------------------------------------------------------- benefits

function FitIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="10" r="6.5" />
      <circle cx="12" cy="10" r="2.5" />
      <path d="M3.5 20.5h17M3.5 20.5l2-1.5M3.5 20.5l2 1.5M20.5 20.5l-2-1.5M20.5 20.5l-2 1.5" />
    </Svg>
  );
}

function NoToolsIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76Z" />
      <path d="M3 3l18 18" />
    </Svg>
  );
}

function ShieldIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M12 21.5s7.5-3 7.5-9.5V5.5L12 2.5l-7.5 3V12c0 6.5 7.5 9.5 7.5 9.5Z" />
      <path d="m8.8 12 2.2 2.2 4.3-4.4" />
    </Svg>
  );
}

function SteelIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M12 2.5 20.2 7.25v9.5L12 21.5l-8.2-4.75v-9.5Z" />
      <circle cx="12" cy="12" r="3.2" />
    </Svg>
  );
}

export const BENEFIT_ICONS: Record<BenefitIconName, (props: IconProps) => React.ReactElement> = {
  fit: FitIcon,
  noTools: NoToolsIcon,
  shield: ShieldIcon,
  steel: SteelIcon,
};

// ---------------------------------------------------------------- Gigant

function SpreaderIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M3.5 4.5h17l-3.5 9h-10Z" />
      <path d="M9 13.5v2h6v-2" />
      <circle cx="8" cy="18.5" r="0.6" fill="currentColor" />
      <circle cx="12" cy="19.5" r="0.6" fill="currentColor" />
      <circle cx="16" cy="18.5" r="0.6" fill="currentColor" />
      <circle cx="10" cy="21.5" r="0.6" fill="currentColor" />
      <circle cx="14" cy="21.5" r="0.6" fill="currentColor" />
    </Svg>
  );
}

function WagonIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M6.5 5.5h14v8.5h-14Z" />
      <path d="M6.5 11.5H2" />
      <circle cx="14.5" cy="17" r="2.3" />
      <circle cx="4" cy="18" r="0.6" fill="currentColor" />
      <circle cx="7" cy="19.5" r="0.6" fill="currentColor" />
      <circle cx="3.5" cy="21" r="0.6" fill="currentColor" />
    </Svg>
  );
}

function ScraperIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M12 3.5v4" />
      <path d="M6 15V7.5h12V15" />
      <path d="M2.5 15.5c3-1.2 16-1.2 19 0v2.5c-3-1.2-16-1.2-19 0Z" />
      <path d="M4 21h16" opacity="0.5" />
    </Svg>
  );
}

export const GIGANT_ICONS: Record<GigantIconName, (props: IconProps) => React.ReactElement> = {
  spreader: SpreaderIcon,
  wagon: WagonIcon,
  scraper: ScraperIcon,
};

// ---------------------------------------------------------------- small UI

export function CheckIcon(props: IconProps) {
  return (
    <Svg {...props} strokeWidth={2}>
      <path d="m5 12.5 4.5 4.5L19 7.5" />
    </Svg>
  );
}

export function PlusIcon(props: IconProps) {
  return (
    <Svg {...props} strokeWidth={2}>
      <path d="M12 5.5v13M5.5 12h13" />
    </Svg>
  );
}

// ---------------------------------------------------------------- pattern

// Repeating chain tile (a flat link, then an edge-on link threaded through
// it, rows offset by half a tile) used as a faint background texture on the
// dark panels. White at low opacity so it only reads on dark fills.
const CHAIN_TILE = `<svg xmlns='http://www.w3.org/2000/svg' width='64' height='48' viewBox='0 0 64 48'><g fill='none' stroke='white' stroke-opacity='0.05' stroke-width='2'><rect x='4' y='5' width='30' height='14' rx='7'/><rect x='25' y='10.5' width='50' height='3' rx='1.5'/><rect x='-39' y='10.5' width='50' height='3' rx='1.5'/><rect x='36' y='29' width='30' height='14' rx='7'/><rect x='-28' y='29' width='30' height='14' rx='7'/><rect x='57' y='34.5' width='50' height='3' rx='1.5'/><rect x='-7' y='34.5' width='50' height='3' rx='1.5'/></g></svg>`;

export const CHAIN_PATTERN_STYLE = {
  backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(CHAIN_TILE)}")`,
  backgroundSize: "112px 84px",
} as const;
