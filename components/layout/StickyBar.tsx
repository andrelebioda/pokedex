"use client";

import { useLayoutEffect, useRef } from "react";

interface StickyBarProps {
  children: React.ReactNode;
  className?: string;
}

export default function StickyBar({ children, className = "" }: StickyBarProps) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const updateOffset = () => {
      document.documentElement.style.setProperty("--sticky-header-offset", `${el.offsetHeight}px`);
    };

    updateOffset();

    const observer = new ResizeObserver(updateOffset);
    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div
        ref={ref}
        className={`
        sticky
        top-0
        z-20
        -mx-8
        border-b
        border-slate-800
        bg-slate-950/95
        px-8
        backdrop-blur
        ${className}
      `}
      >
        <div className="py-4">{children}</div>
      </div>
    </>
  );
}
