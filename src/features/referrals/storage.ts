const REFERRAL_CODE_KEY = "academy_referral_code";
const REFERRAL_ACADEMY_ID_KEY = "academy_referral_academy_id";

/**
 * First-touch referral storage.
 * Never overwrite an existing valid first-touch code.
 */
export function getStoredReferralCode(): string | null {
  if (typeof window === "undefined") return null;
  return window.sessionStorage.getItem(REFERRAL_CODE_KEY);
}

export function getStoredReferralAcademyId(): number | null {
  if (typeof window === "undefined") return null;
  const raw = window.sessionStorage.getItem(REFERRAL_ACADEMY_ID_KEY);
  if (!raw) return null;
  const id = Number(raw);
  return Number.isFinite(id) ? id : null;
}

export function storeReferralFirstTouch(
  referralCode: string,
  academyId: number,
): boolean {
  if (typeof window === "undefined") return false;
  const existing = getStoredReferralCode();
  if (existing) return false;

  window.sessionStorage.setItem(REFERRAL_CODE_KEY, referralCode);
  window.sessionStorage.setItem(REFERRAL_ACADEMY_ID_KEY, String(academyId));
  return true;
}

export function clearStoredReferral(): void {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(REFERRAL_CODE_KEY);
  window.sessionStorage.removeItem(REFERRAL_ACADEMY_ID_KEY);
}

export function readReferralParam(
  searchParams: URLSearchParams,
): string | null {
  return (
    searchParams.get("ref") ??
    searchParams.get("referral") ??
    searchParams.get("referralCode")
  );
}
