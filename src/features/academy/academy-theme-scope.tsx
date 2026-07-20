"use client";

import type { CSSProperties, ReactNode } from "react";
import {
  resolveAcademyTheme,
  themeToCssVars,
  type AcademyTheme,
} from "@/lib/tenant/theme";

type AcademyLike = {
  name?: string | null;
  logoUrl?: string | null;
  settings?: unknown;
} | null;

export function AcademyThemeScope({
  academy,
  children,
  className,
}: {
  academy?: AcademyLike;
  children: ReactNode;
  className?: string;
}) {
  const theme: AcademyTheme = resolveAcademyTheme(academy);
  const style = themeToCssVars(theme) as CSSProperties;

  return (
    <div className={className} style={style} data-academy-theme={theme.name}>
      {children}
    </div>
  );
}
