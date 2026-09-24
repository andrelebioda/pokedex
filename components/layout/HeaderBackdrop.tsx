// Hintergrund für Seitenköpfe: Verlauf aus --accent und --accent-2, der nach unten in den Seitenhintergrund ausläuft.
export default function HeaderBackdrop() {
  return (
    <div aria-hidden className="absolute inset-0 -z-10 mask-[linear-gradient(to_bottom,black_35%,transparent)]">
      <div className="absolute inset-0 bg-[linear-gradient(120deg,color-mix(in_oklab,var(--accent)_45%,transparent),color-mix(in_oklab,var(--accent-2,var(--accent))_25%,transparent)_55%,transparent)]" />
      <div className="absolute -top-20 -left-10 size-72 rounded-full bg-(--accent) opacity-30 blur-3xl" />
      <div className="absolute -top-10 right-1/4 size-64 rounded-full bg-(--accent-2,var(--accent)) opacity-20 blur-3xl" />
    </div>
  );
}
