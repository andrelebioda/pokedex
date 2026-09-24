// Glas-Design: Verlauf über die ganze Karte, Inhalt auf halbtransparenten Glasflächen.
// Die Farben kommen aus den CSS-Variablen --accent und --accent-2 (siehe accentStyle in config/sections.ts).

export const glassCard = `
  group
  relative
  isolate
  overflow-hidden
  rounded-3xl
  border
  border-white/10
  bg-slate-900
  bg-[linear-gradient(150deg,color-mix(in_oklab,var(--accent)_55%,transparent),color-mix(in_oklab,var(--accent-2,var(--accent))_30%,transparent))]
  shadow-lg
  transition-all
  duration-300
  hover:border-[color-mix(in_oklab,var(--accent)_60%,transparent)]
  hover:shadow-[0_12px_40px_-12px_color-mix(in_oklab,var(--accent)_70%,transparent)]
`;

export const glassPanel = `
  rounded-2xl
  border
  border-white/15
  bg-white/10
  shadow-[inset_0_1px_0_rgb(255_255_255/0.15)]
  backdrop-blur-md
`;

export const glassIconBox = "rounded-xl border border-white/15 bg-white/15 text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.2)] backdrop-blur-md";

export const glassChip = "flex items-center gap-1.5 rounded-full border border-white/10 bg-black/20 px-2.5 py-1 text-xs font-medium text-white/90";

export const glassButton = `
  flex
  items-center
  justify-center
  rounded-xl
  border
  border-white/15
  bg-white/10
  text-white/80
  backdrop-blur-md
  transition
  hover:bg-white/25
  hover:text-white
`;
