export type AcademyThemeColors = {
  primary: string;
  background: string;
  surface: string;
  secondary: string;
  accent: string;
  highlight: string;
};

export type AcademyTheme = {
  name: string;
  logoUrl?: string;
  colors: AcademyThemeColors;
};

/** RE-Quest Brand Guidelines — default tenant theme */
export const reQuestTheme: AcademyTheme = {
  name: "RE-Quest Professional Growth Initiative",
  logoUrl: "/brand/re-quest/logo-white.png",
  colors: {
    primary: "#00293D",
    background: "#F0F5FC",
    surface: "#FFFFFF",
    secondary: "#C4D9D4",
    accent: "#638559",
    highlight: "#E58625",
  },
};

export const defaultAcademyTheme = reQuestTheme;

type AcademyBrandingInput = {
  name?: string | null;
  logoUrl?: string | null;
  settings?: unknown;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readColor(
  settings: Record<string, unknown> | undefined,
  key: keyof AcademyThemeColors,
  fallback: string,
): string {
  const colors = settings?.colors;
  if (!isRecord(colors)) return fallback;
  const value = colors[key];
  return typeof value === "string" && value.length > 0 ? value : fallback;
}

/**
 * Resolve a tenant theme from academy API data.
 * Falls back to RE-Quest defaults — never hardcodes tenant logic in UI.
 */
export function resolveAcademyTheme(
  academy?: AcademyBrandingInput | null,
  fallback: AcademyTheme = defaultAcademyTheme,
): AcademyTheme {
  const settings = isRecord(academy?.settings) ? academy.settings : undefined;

  return {
    name: academy?.name?.trim() || fallback.name,
    logoUrl: academy?.logoUrl || fallback.logoUrl,
    colors: {
      primary: readColor(settings, "primary", fallback.colors.primary),
      background: readColor(settings, "background", fallback.colors.background),
      surface: readColor(settings, "surface", fallback.colors.surface),
      secondary: readColor(settings, "secondary", fallback.colors.secondary),
      accent: readColor(settings, "accent", fallback.colors.accent),
      highlight: readColor(settings, "highlight", fallback.colors.highlight),
    },
  };
}

export function themeToCssVars(theme: AcademyTheme): Record<string, string> {
  return {
    "--color-primary": theme.colors.primary,
    "--color-background": theme.colors.background,
    "--color-surface": theme.colors.surface,
    "--color-secondary": theme.colors.secondary,
    "--color-accent": theme.colors.accent,
    "--color-highlight": theme.colors.highlight,
    "--color-foreground": theme.colors.primary,
  };
}
