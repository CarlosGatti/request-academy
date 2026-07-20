"use client";

import { useMutation } from "@apollo/client/react";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/toast";
import { ResetPasswordDocument } from "@/graphql/generated/graphql";
import { getGraphQLErrorMessage } from "@/lib/graphql/errors";
import {
  resetPasswordSchema,
  type ResetPasswordInput,
} from "@/lib/validation/auth";

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const { toast } = useToast();
  const [resetPassword, { loading }] = useMutation(ResetPasswordDocument);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
  });

  if (!token) {
    return (
      <Alert tone="warning" title="Missing reset token">
        Open the link from your email, or{" "}
        <Link href="/forgot-password" className="underline">
          request a new reset
        </Link>
        .
      </Alert>
    );
  }

  const onSubmit = handleSubmit(async (values) => {
    setError(null);
    try {
      const result = await resetPassword({
        variables: { token, password: values.password },
      });
      if (!result.data?.resetPassword.success) {
        setError(
          result.data?.resetPassword.message ||
            getGraphQLErrorMessage(result.error, "Unable to reset password."),
        );
        return;
      }
      toast(
        result.data.resetPassword.message || "Password updated. Sign in to continue.",
        "success",
      );
      router.push("/login");
    } catch (err) {
      setError(getGraphQLErrorMessage(err, "Unable to reset password."));
    }
  });

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {error ? <Alert tone="danger">{error}</Alert> : null}
      <div className="space-y-2">
        <Label htmlFor="password">New password</Label>
        <Input
          id="password"
          type="password"
          autoComplete="new-password"
          {...register("password")}
        />
        {errors.password ? (
          <p className="text-sm text-danger">{errors.password.message}</p>
        ) : null}
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm password</Label>
        <Input
          id="confirmPassword"
          type="password"
          autoComplete="new-password"
          {...register("confirmPassword")}
        />
        {errors.confirmPassword ? (
          <p className="text-sm text-danger">{errors.confirmPassword.message}</p>
        ) : null}
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Updating…" : "Update password"}
      </Button>
    </form>
  );
}
