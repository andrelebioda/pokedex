export const berryFirmnessLabelsDe: Record<string, string> = {
  "very-soft": "Sehr weich",
  soft: "Weich",
  hard: "Hart",
  "very-hard": "Sehr hart",
  "super-hard": "Extrem hart",
};

export const berryFlavorLabelsDe: Record<string, string> = {
  spicy: "Scharf",
  dry: "Herb",
  sweet: "Süß",
  bitter: "Bitter",
  sour: "Sauer",
};

export function formatBerryFirmness(slug: string | null) {
  if (!slug) return null;
  return berryFirmnessLabelsDe[slug] ?? slug;
}

export function formatBerryFlavor(slug: string) {
  return berryFlavorLabelsDe[slug] ?? slug;
}
