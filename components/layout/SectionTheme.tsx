"use client";

import { createContext, CSSProperties, ReactNode, useContext } from "react";

import { accentStyle } from "@/config/sections";

const SectionThemeContext = createContext<CSSProperties>({});

interface SectionThemeProps {
  accent: string;
  accent2?: string;
  children: ReactNode;
}

// Setzt die Farben einer Seite. Über den Context bekommen auch Dialoge und Dropdowns,
// die per Portal außerhalb der Seite gerendert werden, dieselben Farben.
export default function SectionTheme({ accent, accent2, children }: SectionThemeProps) {
  const style = accentStyle(accent, accent2);

  return (
    <SectionThemeContext.Provider value={style}>
      <div style={style}>{children}</div>
    </SectionThemeContext.Provider>
  );
}

export function useSectionThemeStyle() {
  return useContext(SectionThemeContext);
}
