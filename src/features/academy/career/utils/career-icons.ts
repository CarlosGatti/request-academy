import {
  Award,
  BadgeCheck,
  Briefcase,
  Building2,
  Compass,
  GraduationCap,
  Home,
  Key,
  Megaphone,
  MessageCircle,
  Sparkles,
  TrendingUp,
  Users,
  type LucideIcon,
} from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  compass: Compass,
  school: GraduationCap,
  license: BadgeCheck,
  building: Building2,
  home: Home,
  key: Key,
  spark: Sparkles,
  megaphone: Megaphone,
  chart: TrendingUp,
  users: Users,
  briefcase: Briefcase,
  message: MessageCircle,
  graduation: Award,
};

export function careerStageIcon(iconKey?: string | null): LucideIcon {
  if (!iconKey) return Compass;
  return ICON_MAP[iconKey] ?? Compass;
}
