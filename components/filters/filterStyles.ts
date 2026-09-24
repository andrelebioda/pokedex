export const pillTrigger = `
  flex
  h-10
  items-center
  gap-2
  rounded-full
  border
  border-white/10
  bg-white/5
  px-4
  py-2.5
  text-sm
  md:h-11
  md:text-[16px]
  text-white/80
  backdrop-blur-md
  shadow-[inset_0_1px_0_rgb(255_255_255/0.08)]
  transition
  hover:border-white/20
  hover:bg-white/10
  hover:text-white
  data-[state=open]:border-[color-mix(in_oklab,var(--accent,#ef4444)_60%,transparent)]
  data-[state=open]:bg-white/10
  data-[state=open]:text-white
  relative
`;

// Hülle für Dialoge und Dropdowns der Filter
export const glassPopover = `
  border
  border-white/10
  bg-slate-900/80
  bg-[linear-gradient(150deg,color-mix(in_oklab,var(--accent,#ef4444)_18%,transparent),transparent_60%)]
  text-slate-200
  shadow-2xl
  backdrop-blur-xl
`;

export const accentCheckbox =
  "border-white/30 bg-transparent data-checked:border-(--accent,#ef4444) data-checked:bg-(--accent,#ef4444) data-checked:text-white dark:border-white/30 dark:bg-transparent dark:data-checked:border-(--accent,#ef4444) dark:data-checked:bg-(--accent,#ef4444) dark:data-checked:text-white";
