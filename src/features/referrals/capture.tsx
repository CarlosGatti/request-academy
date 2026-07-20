"use client";

import { useMutation } from "@apollo/client/react";
import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import {
  AttachDefinedAcademyReferralToCurrentUserDocument,
  CaptureDefinedAcademyReferralDocument,
} from "@/graphql/generated/graphql";
import {
  clearStoredReferral,
  getStoredReferralCode,
  readReferralParam,
  storeReferralFirstTouch,
} from "@/features/referrals/storage";

/**
 * Captures first-touch referral from ?ref= / ?referral= without blocking navigation.
 */
export function ReferralCapture({ academyId }: { academyId: number }) {
  const searchParams = useSearchParams();
  const attempted = useRef<string | null>(null);
  const [capture] = useMutation(CaptureDefinedAcademyReferralDocument);

  useEffect(() => {
    const code = readReferralParam(searchParams);
    if (!code || !academyId) return;
    if (attempted.current === `${academyId}:${code}`) return;
    attempted.current = `${academyId}:${code}`;

    const stored = storeReferralFirstTouch(code, academyId);
    // Always attempt capture for first-touch persistence on the backend;
    // local store only keeps the code for later attach.
    void capture({
      variables: {
        input: {
          academyId,
          referralCode: code,
        },
      },
    }).catch(() => {
      // Non-blocking: never interrupt browsing on referral failure.
      if (!stored) {
        // no-op
      }
    });
  }, [academyId, capture, searchParams]);

  return null;
}

/**
 * After login/register, attach stored referral in the background.
 * Null response and errors are silent.
 */
export async function attachStoredReferral(
  mutate: (options: {
    variables: { input: { referralCode: string } };
  }) => Promise<unknown>,
): Promise<void> {
  const code = getStoredReferralCode();
  if (!code) return;

  try {
    await mutate({
      variables: { input: { referralCode: code } },
    });
  } catch {
    // Non-blocking
  } finally {
    clearStoredReferral();
  }
}

export function useAttachReferralMutation() {
  return useMutation(AttachDefinedAcademyReferralToCurrentUserDocument);
}
