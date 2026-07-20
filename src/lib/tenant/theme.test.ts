import { describe, expect, it } from "vitest";
import { resolveAcademyTheme, reQuestTheme } from "@/lib/tenant/theme";

describe("resolveAcademyTheme", () => {
  it("falls back to RE-Quest defaults", () => {
    expect(resolveAcademyTheme(null)).toEqual(reQuestTheme);
  });

  it("uses academy branding when provided", () => {
    const theme = resolveAcademyTheme({
      name: "Future Academy",
      logoUrl: "https://cdn.example/logo.png",
      settings: {
        colors: {
          primary: "#111111",
          background: "#fafafa",
        },
      },
    });

    expect(theme.name).toBe("Future Academy");
    expect(theme.logoUrl).toBe("https://cdn.example/logo.png");
    expect(theme.colors.primary).toBe("#111111");
    expect(theme.colors.background).toBe("#fafafa");
    expect(theme.colors.accent).toBe(reQuestTheme.colors.accent);
  });
});
