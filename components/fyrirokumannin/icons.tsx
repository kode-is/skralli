// Line icons for /fyrirokumannin, in the same 24px / 1.6 stroke style as
// components/vetrarbunadur/icons.tsx. The truck, loader and tractor are that
// file's; the rest are drawn here. All decorative (aria-hidden): every icon
// sits next to a visible text label.

import type { ReactNode, SVGProps } from "react";
import { VEHICLE_ICONS as WINTER_ICONS } from "@/components/vetrarbunadur/icons";
import type { BuildIconName, FitIconName, LightKind, VehicleIconName } from "@/lib/fyrirokumannin";

type IconProps = SVGProps<SVGSVGElement>;
type Icon = (props: IconProps) => React.ReactElement;

function Svg({ children, ...props }: IconProps & { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {children}
    </svg>
  );
}

// ---------------------------------------------------------------- vehicles

function VanIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M2.5 16V7.5A1.5 1.5 0 0 1 4 6h10.5l4.2 4.3 2 1.2V16" />
      <path d="M14.5 6v4.3h4.2" />
      <path d="M9 6v4.3" />
      <circle cx="6.5" cy="17" r="2" />
      <circle cx="17" cy="17" r="2" />
      <path d="M2.5 16h2M8.5 16h6.5M19 16h1.7" />
    </Svg>
  );
}

export const VEHICLE_ICONS: Record<VehicleIconName, Icon> = {
  van: VanIcon,
  truck: WINTER_ICONS.truck,
  loader: WINTER_ICONS.loader,
  tractor: WINTER_ICONS.tractor,
};

// ---------------------------------------------------------------- fit band

export const FIT_ICONS: Record<FitIconName, Icon> = {
  // Seat with a pin: the cover stays put.
  stays: (props) => (
    <Svg {...props}>
      <path d="M7 3.5h7a2 2 0 0 1 2 2v7H7Z" />
      <path d="M5 12.5h13v3H5Z" />
      <path d="M8 15.5 7 20.5M16 15.5l1 5" />
      <path d="M19.5 4.5v4M17.5 6.5h4" />
    </Svg>
  ),
  // Seat with headrest and armrest.
  seat: (props) => (
    <Svg {...props}>
      <rect x="9" y="2.5" width="6" height="3" rx="1" />
      <path d="M12 5.5v1.5" />
      <path d="M8 7h8a1 1 0 0 1 1 1v6H7V8a1 1 0 0 1 1-1Z" />
      <path d="M5.5 14h13v3h-13Z" />
      <path d="M4 10.5h3M17 10.5h3" />
      <path d="M12 17v4M8.5 21h7" />
    </Svg>
  ),
  // Two swatches: fabric and leatherette.
  fabric: (props) => (
    <Svg {...props}>
      <rect x="3" y="5" width="10" height="13" rx="1.5" />
      <path d="M5.5 8h5M5.5 11h5M5.5 14h5" />
      <path d="M13 7.5h6.5a1.5 1.5 0 0 1 1.5 1.5v10a1.5 1.5 0 0 1-1.5 1.5H11a1.5 1.5 0 0 1-1.5-1.5V18" />
    </Svg>
  ),
  // Floor mat outline with a cut-out.
  mat: (props) => (
    <Svg {...props}>
      <path d="M4 4h16v16H4Z" />
      <path d="M13 4v7h7" />
      <path d="M7 15.5h3M7 12.5h3" />
    </Svg>
  ),
};

// ---------------------------------------------------------------- build band

export const BUILD_ICONS: Record<BuildIconName, Icon> = {
  // Bar arch over a ruler: made to measure.
  fit: (props) => (
    <Svg {...props}>
      <path d="M5 13V7a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v6" />
      <path d="M3 17h18v3H3Z" />
      <path d="M7 17v1.5M11 17v1.5M15 17v1.5M19 17v1.5" />
    </Svg>
  ),
  // Tube cross-section: aluminium.
  alu: (props) => (
    <Svg {...props}>
      <circle cx="9" cy="12" r="5.5" />
      <circle cx="9" cy="12" r="3" />
      <path d="M9 6.5h10M9 17.5h10" />
      <path d="M19 6.5a1.6 5.5 0 0 1 0 11" />
    </Svg>
  ),
  // Cable running to a plug.
  wire: (props) => (
    <Svg {...props}>
      <path d="M3 6h5a4 4 0 0 1 4 4v4a4 4 0 0 0 4 4h1" />
      <path d="M17 15h3v6h-3Z" />
      <path d="M20 16.5h1.5M20 19.5h1.5" />
      <circle cx="3.5" cy="6" r="1.2" />
    </Svg>
  ),
  // Bar with pre-drilled holes.
  drill: (props) => (
    <Svg {...props}>
      <rect x="2.5" y="9" width="19" height="6" rx="3" />
      <circle cx="7" cy="12" r="1.2" />
      <circle cx="12" cy="12" r="1.2" />
      <circle cx="17" cy="12" r="1.2" />
    </Svg>
  ),
};

// ---------------------------------------------------------------- light kinds

export const LIGHT_ICONS: Record<LightKind, Icon> = {
  position: (props) => (
    <Svg {...props}>
      <circle cx="12" cy="12" r="3.5" />
      <path d="M12 3v2.5M12 18.5V21M3 12h2.5M18.5 12H21" />
    </Svg>
  ),
  beacon: (props) => (
    <Svg {...props}>
      <path d="M8 18v-6a4 4 0 0 1 8 0v6" />
      <path d="M6 18h12v2.5H6Z" />
      <path d="M12 3v2M5.2 5.8l1.4 1.4M18.8 5.8l-1.4 1.4" />
    </Svg>
  ),
  work: (props) => (
    <Svg {...props}>
      <rect x="3" y="8" width="8" height="8" rx="1.5" />
      <path d="M11 9.5 21 6M11 14.5 21 18M14 12h7" />
    </Svg>
  ),
};

// ---------------------------------------------------------------- pattern

/** Dot grid for the dark light-bar panels (the winter page uses chain links). */
export const DOT_PATTERN_STYLE = {
  backgroundImage: "radial-gradient(rgba(255,255,255,0.09) 1.2px, transparent 1.2px)",
  backgroundSize: "22px 22px",
} as const;
