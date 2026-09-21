import { Disc, Egg, GraduationCap, Sparkles, TrendingUp, LucideIcon } from "lucide-react";

export const learnMethodLabels: Record<string, string> = {
  "level-up": "Level-Aufstieg",
  machine: "TM/VM",
  egg: "Ei",
  tutor: "Lehrer",
  train: "Training",
  "stadium-surfing-pikachu": "Stadium (Surfen-Pikachu)",
  "light-ball-egg": "Ei (Glitzerball)",
  "xd-purification": "Reinigung (XD)",
  "zygarde-cube": "Zygarde-Cube",
};

export const learnMethodIcons: Record<string, LucideIcon> = {
  "level-up": TrendingUp,
  machine: Disc,
  egg: Egg,
  tutor: GraduationCap,
};

export function getLearnMethodBadge(learnMethod: string | null | undefined, level?: number | null) {
  if (!learnMethod) return null;

  const Icon = learnMethodIcons[learnMethod] ?? Sparkles;

  const label = learnMethod === "level-up" && level ? `Lv. ${level}` : (learnMethodLabels[learnMethod] ?? learnMethod);

  return { Icon, label };
}
