"use client";

import { useMutation } from "@apollo/client/react";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/toast";
import { RequestPasswordResetDocument } from "@/graphql/generated/graphql";
import { getGraphQLErrorMessage } from "@/lib/graphql/errors";
import {
  requestPasswordResetSchema,
  type RequestPasswordResetInput,
} from "@/lib/validation/auth";

export function ForgotPasswordForm() {
  const { toast } = useToast();
  const [requestReset, { loading }] = useMutation(RequestPasswordResetDocument);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RequestPasswordResetInput>({
    resolver: zodResolver(requestPasswordResetSchema),
  });

  const onSubmit = handleSubmit(async (values) => {
    setError(null);
    try {
      const result = await requestReset({ variables: { email: values.email } });
      if (!result.data?.requestPasswordReset.success) {
        setError(
          result.data?.requestPasswordReset.message ||
            getGraphQLErrorMessage(result.error, "Unable to send reset email."),
        );
        return;
      }
      setDone(true);
      toast(
        result.data.requestPasswordReset.message ||
          "Check your email for reset instructions.",
        "success",
      );
    } catch (err) {
      setError(getGraphQLErrorMessage(err, "Unable to send reset email."));
    }
  });

  if (done) {
    return (
      <div className="space-y-4">
        <Alert tone="success">
          If an account exists for that email, a reset link has been sent.
        </Alert>
        <p className="text-center text-sm">
          <Link href="/login" className="font-medium text-accent hover:underline">
            Back to sign in
          </Link>
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {error ? <Alert tone="danger">{error}</Alert> : null}
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" autoComplete="email" {...register("email")} />
        {errors.email ? (
          <p className="text-sm text-danger">{errors.email.message}</p>
        ) : null}
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Sending…" : "Send reset link"}
      </Button>
      <p className="text-center text-sm text-muted">
        <Link href="/login" className="font-medium text-accent hover:underline">
          Back to sign in
        </Link>
      </p>
    </form>
  );
}
