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
import {
  attachStoredReferral,
  useAttachReferralMutation,
} from "@/features/referrals/capture";
import { LoginDocument } from "@/graphql/generated/graphql";
import { useAuth } from "@/lib/auth/AuthProvider";
import { getGraphQLErrorMessage } from "@/lib/graphql/errors";
import { loginSchema, type LoginInput } from "@/lib/validation/auth";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setSession } = useAuth();
  const [login, { loading }] = useMutation(LoginDocument);
  const [attachReferral] = useAttachReferralMutation();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = handleSubmit(async (values) => {
    setError(null);
    try {
      const result = await login({
        variables: { user: values },
      });

      const payload = result.data?.login;
      if (!payload?.token || !payload.user) {
        setError(getGraphQLErrorMessage(result.error, "Unable to sign in."));
        return;
      }

      setSession(payload.token, {
        id: payload.user.id,
        email: payload.user.email,
        firstName: payload.user.firstName,
        lastName: payload.user.lastName,
        isAdmin: payload.user.isAdmin ?? false,
        apps: payload.user.apps ?? [],
      });

      void attachStoredReferral((options) => attachReferral(options));

      const returnUrl = searchParams.get("returnUrl") || "/workspace";
      router.push(returnUrl.startsWith("/") ? returnUrl : "/workspace");
    } catch (err) {
      setError(getGraphQLErrorMessage(err, "Unable to sign in."));
    }
  });

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {error ? <Alert tone="danger">{error}</Alert> : null}

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          {...register("email")}
        />
        {errors.email ? (
          <p className="text-sm text-danger">{errors.email.message}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          {...register("password")}
        />
        {errors.password ? (
          <p className="text-sm text-danger">{errors.password.message}</p>
        ) : null}
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Signing in…" : "Sign in"}
      </Button>

      <p className="text-center text-sm text-muted">
        <Link
          href="/forgot-password"
          className="font-medium text-accent hover:underline"
        >
          Forgot password?
        </Link>
      </p>

      <p className="text-center text-sm text-muted">
        New here?{" "}
        <Link href="/register" className="font-medium text-accent hover:underline">
          Create an account
        </Link>
      </p>
    </form>
  );
}
