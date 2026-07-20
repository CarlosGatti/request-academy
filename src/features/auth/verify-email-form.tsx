"use client";

import { useMutation } from "@apollo/client/react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ResendVerificationEmailDocument,
  VerifyEmailDocument,
} from "@/graphql/generated/graphql";
import { getGraphQLErrorMessage } from "@/lib/graphql/errors";
import Link from "next/link";

export function VerifyEmailForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const emailParam = searchParams.get("email") ?? "";
  const [email, setEmail] = useState(emailParam);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  const [verify, { loading: verifying }] = useMutation(VerifyEmailDocument);
  const [resend, { loading: resending }] = useMutation(
    ResendVerificationEmailDocument,
  );

  useEffect(() => {
    if (!token) return;

    void (async () => {
      try {
        const result = await verify({ variables: { token } });
        if (result.data?.verifyEmail.success) {
          setStatus("success");
          setMessage(
            result.data.verifyEmail.message || "Email verified. You can sign in.",
          );
        } else {
          setStatus("error");
          setMessage(
            result.data?.verifyEmail.message ||
              getGraphQLErrorMessage(result.error, "Verification failed."),
          );
        }
      } catch (err) {
        setStatus("error");
        setMessage(getGraphQLErrorMessage(err, "Verification failed."));
      }
    })();
  }, [token, verify]);

  const onResend = async () => {
    if (!email) {
      setStatus("error");
      setMessage("Enter the email used at registration.");
      return;
    }
    try {
      const result = await resend({ variables: { email } });
      if (result.data?.resendVerificationEmail.success) {
        setStatus("success");
        setMessage(
          result.data.resendVerificationEmail.message ||
            "Verification email sent.",
        );
      } else {
        setStatus("error");
        setMessage(
          result.data?.resendVerificationEmail.message ||
            getGraphQLErrorMessage(result.error, "Could not resend email."),
        );
      }
    } catch (err) {
      setStatus("error");
      setMessage(getGraphQLErrorMessage(err, "Could not resend email."));
    }
  };

  return (
    <div className="space-y-5">
      {status === "success" ? <Alert tone="success">{message}</Alert> : null}
      {status === "error" ? <Alert tone="danger">{message}</Alert> : null}
      {status === "idle" && token ? (
        <Alert tone="info">Verifying your email…</Alert>
      ) : null}
      {!token ? (
        <Alert tone="info">
          Enter your email to resend the verification link.
        </Alert>
      ) : null}

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          autoComplete="email"
        />
      </div>

      <Button
        type="button"
        variant="secondary"
        className="w-full"
        disabled={resending || verifying}
        onClick={() => void onResend()}
      >
        {resending ? "Sending…" : "Resend verification email"}
      </Button>

      {status === "success" ? (
        <p className="text-center text-sm">
          <Link href="/login" className="font-medium text-accent hover:underline">
            Continue to sign in
          </Link>
        </p>
      ) : null}
    </div>
  );
}
