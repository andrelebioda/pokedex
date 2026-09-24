// Weiche Farbflecken, die hinter den Glasflächen verschwimmen.
export default function GlassBlobs() {
  return (
    <>
      <div aria-hidden className="pointer-events-none absolute -top-10 -left-10 -z-10 size-40 rounded-full bg-(--accent) opacity-50 blur-2xl" />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-8 -bottom-10 -z-10 size-44 rounded-full bg-(--accent-2,var(--accent)) opacity-45 blur-2xl"
      />
    </>
  );
}
