// Basis für Karten mit Akzentfarbe. Die Farbe wird über die CSS-Variable --accent gesetzt.
export const accentCard = `
  group
  relative
  isolate
  overflow-hidden
  rounded-3xl
  border
  border-white/5
  bg-slate-900
  shadow-lg
  transition-all
  duration-300
  hover:border-[color-mix(in_oklab,var(--accent)_45%,transparent)]
  hover:shadow-[0_12px_40px_-12px_color-mix(in_oklab,var(--accent)_60%,transparent)]
`;

export const accentGradient = "bg-[linear-gradient(135deg,color-mix(in_oklab,var(--accent)_22%,transparent),transparent_70%)]";

export const accentIconBox = "rounded-xl bg-[color-mix(in_oklab,var(--accent)_18%,transparent)] text-(--accent)";

export const statChip = "flex items-center gap-1.5 rounded-full bg-slate-800/80 px-2.5 py-1 text-xs font-medium text-slate-300";
