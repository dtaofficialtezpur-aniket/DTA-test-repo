export type LonLat = [number, number];

/** A place to mark on the map. Longitude and latitude in degrees. */
export type Pin = {
  lon: number;
  lat: number;
  /** Bold line in the floating label. */
  label: string;
  /** Small second line in the floating label. */
  sub?: string;
};

/** One scroll stop: the camera flies to `pin` and a card appears. */
export type Stage = {
  /** Index into `pins`. */
  pin: number;
  eyebrow: string;
  title: string;
  lines?: string[];
  meta?: string;
};

/** A faint route drawn from one of the pins out to another place. */
export type City = { lon: number; lat: number; from: number };

export type Cta = { label: string; href: string };

export type Colors = {
  /** Page background of the dark hero. */
  background: string;
  /** Colour the hero fades to at the end of the scroll. */
  light: string;
  /** Map body. */
  surface: string;
  /** Map outline. */
  edge: string;
  /** Arc, packets, pins, ripples, accents. */
  glow: string;
  /** Main call-to-action button. */
  accent: string;
  /** Floor grid. */
  gridCell: string;
  gridSection: string;
};

export const defaultColors: Colors = {
  background: "#060B16",
  light: "#FAFAFA",
  surface: "#0d2142",
  edge: "#4aa3ff",
  glow: "#6fd0ff",
  accent: "#0B5FCC",
  gridCell: "#16427f",
  gridSection: "#2a79d8",
};

export type MapHeroProps = {
  /** id of the section element. Default "top" (the nav uses it to switch theme). */
  id?: string;
  headline: string;
  description?: string;
  primaryCta?: Cta;
  secondaryCta?: Cta;
  /** Small line under the buttons. */
  footnote?: string;
  pins: Pin[];
  stages: Stage[];
  /** Pin indexes joined by the bright arc. Default [0, 1]. */
  arc?: [number, number];
  /** Extra faint routes. */
  cities?: City[];
  /** Country outline as [lon, lat] points. Default: India (see india-outline.ts). */
  outline?: LonLat[];
  /** Big line shown just before the hero fades out. */
  finale?: string;
  scrollHint?: string;
  colors?: Partial<Colors>;
  /** Total scroll length of the pinned hero, in viewport heights. Default: 160 + 130 per stage. */
  heightVh?: number;
};
