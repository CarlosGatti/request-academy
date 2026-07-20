import { describe, expect, it, beforeEach } from "vitest";
import {
  clearStoredReferral,
  getStoredReferralCode,
  readReferralParam,
  storeReferralFirstTouch,
} from "@/features/referrals/storage";

describe("referral first-touch storage", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it("stores referral on first touch only", () => {
    expect(storeReferralFirstTouch("partner-a", 1)).toBe(true);
    expect(getStoredReferralCode()).toBe("partner-a");
    expect(storeReferralFirstTouch("partner-b", 1)).toBe(false);
    expect(getStoredReferralCode()).toBe("partner-a");
  });

  it("clears stored referral", () => {
    storeReferralFirstTouch("partner-a", 1);
    clearStoredReferral();
    expect(getStoredReferralCode()).toBeNull();
  });

  it("reads ref query params", () => {
    expect(readReferralParam(new URLSearchParams("ref=abc"))).toBe("abc");
    expect(readReferralParam(new URLSearchParams("referral=xyz"))).toBe("xyz");
  });
});
