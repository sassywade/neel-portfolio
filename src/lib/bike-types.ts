export type FrameType = "commuter" | "vintage" | "gravel" | "road";
export type WheelType = "classic" | "aero" | "deep";
export type DecalType = "none" | "stripes" | "checker" | "dots";

export interface BikeConfig {
  frame: FrameType;
  wheels: WheelType;
  paint: string;
  accent: string;
  decal: DecalType;
  signature: string;
}

export interface PelotonBike extends BikeConfig {
  id: string;
  createdAt: string;
}

export const FRAMES: { id: FrameType; label: string; blurb: string }[] = [
  { id: "road", label: "Road", blurb: "Fast. Drop bars, tight geometry." },
  { id: "gravel", label: "Gravel", blurb: "Goes anywhere, especially dirt." },
  { id: "commuter", label: "Commuter", blurb: "Upright, practical, rack-ready." },
  { id: "vintage", label: "Vintage", blurb: "Curved tubes, fenders, charm." },
];

export const WHEELS: { id: WheelType; label: string }[] = [
  { id: "classic", label: "Classic spokes" },
  { id: "aero", label: "Aero" },
  { id: "deep", label: "Deep rim" },
];

export const PAINTS: { id: string; label: string }[] = [
  { id: "#2fa872", label: "Peloton green" },
  { id: "#1c1b18", label: "Ink" },
  { id: "#e2574c", label: "Tomato" },
  { id: "#3568c4", label: "Ultramarine" },
  { id: "#e8b93c", label: "Mustard" },
  { id: "#c46ba4", label: "Orchid" },
  { id: "#7a8c74", label: "Sage" },
  { id: "#e9e6dd", label: "Bone" },
];

export const DECALS: { id: DecalType; label: string }[] = [
  { id: "none", label: "Clean" },
  { id: "stripes", label: "Stripes" },
  { id: "checker", label: "Checker" },
  { id: "dots", label: "Dots" },
];

export const DEFAULT_BIKE: BikeConfig = {
  frame: "road",
  wheels: "classic",
  paint: "#2fa872",
  accent: "#1c1b18",
  decal: "none",
  signature: "",
};
