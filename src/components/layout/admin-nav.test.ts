import { describe, expect, it } from "vitest";
import {
  adminSectionLabel,
  isAdminNavActive,
} from "@/components/layout/admin-nav";

describe("admin-nav", () => {
  it("matches exact overview route", () => {
    expect(isAdminNavActive("/admin", "/admin", true)).toBe(true);
    expect(isAdminNavActive("/admin/courses", "/admin", true)).toBe(false);
  });

  it("matches nested program routes", () => {
    expect(isAdminNavActive("/admin/courses/12", "/admin/courses")).toBe(true);
  });

  it("resolves section labels", () => {
    expect(adminSectionLabel("/admin")).toBe("Dashboard");
    expect(adminSectionLabel("/admin/data-audit")).toBe("Intelligence");
    expect(adminSectionLabel("/admin/courses/9")).toBe("Learning");
  });
});
