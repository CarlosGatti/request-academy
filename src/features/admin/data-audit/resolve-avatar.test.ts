import { describe, expect, it } from "vitest";
import {
  initialsFromName,
  resolveAuditAvatarSrc,
} from "@/features/admin/data-audit/resolve-avatar";

describe("resolveAuditAvatarSrc", () => {
  it("prefers absolute avatarUrl", () => {
    expect(
      resolveAuditAvatarSrc({
        avatarUrl: "https://cdn.example.com/a.jpg",
        avatarPath: "production/agents/1/avatar.jpg",
      }).src,
    ).toBe("https://cdn.example.com/a.jpg");
  });

  it("builds initials fallback metadata", () => {
    expect(initialsFromName("Alex Rivera")).toBe("AR");
    expect(initialsFromName(null)).toBe("?");
  });
});
