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
import { RegisterDocument } from "@/graphql/generated/graphql";
import { useAuth } from "@/lib/auth/AuthProvider";
import { getGraphQLErrorMessage } from "@/lib/graphql/errors";
import { registerSchema, type RegisterInput } from "@/lib/validation/auth";

export function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setSession } = useAuth();
  const [registerUser, { loading }] = useMutation(RegisterDocument);
  const [attachReferral] = useAttachReferralMutation();
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = handleSubmit(async (values) => {
    setError(null);
    setInfo(null);

    try {
      const result = await registerUser({
        variables: {
          user: values,
          appCode: "ACADEMY",
        },
      });

      const payload = result.data?.register;
      if (!payload?.success) {
        setError(
          payload?.message ||
            getGraphQLErrorMessage(result.error, "Unable to create account."),
        );
        return;
      }

      if (payload.requiresVerification) {
        setInfo(
          payload.message ||
            "Check your email to verify your account before signing in.",
        );
        router.push(
          `/verify-email?email=${encodeURIComponent(payload.email ?? values.email)}`,
        );
        return;
      }

      if (payload.token && payload.user) {
        setSession(payload.token, {
          id: payload.user.id,
          email: payload.user.email,
          firstName: payload.user.firstName,
          lastName: payload.user.lastName,
          apps: payload.user.apps ?? [],
        });
        void attachStoredReferral((options) => attachReferral(options));
        const returnUrl = searchParams.get("returnUrl") || "/workspace";
        router.push(returnUrl.startsWith("/") ? returnUrl : "/workspace");
        return;
      }

      setInfo(payload.message || "Account created. You can sign in now.");
      router.push("/login");
    } catch (err) {
      setError(getGraphQLErrorMessage(err, "Unable to create account."));
    }
  });

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {error ? <Alert tone="danger">{error}</Alert> : null}
      {info ? <Alert tone="info">{info}</Alert> : null}

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="firstName">First name</Label>
          <Input id="firstName" autoComplete="given-name" {...register("firstName")} />
          {errors.firstName ? (
            <p className="text-sm text-danger">{errors.firstName.message}</p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last name</Label>
          <Input id="lastName" autoComplete="family-name" {...register("lastName")} />
          {errors.lastName ? (
            <p className="text-sm text-danger">{errors.lastName.message}</p>
          ) : null}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" autoComplete="email" {...register("email")} />
        {errors.email ? (
          <p className="text-sm text-danger">{errors.email.message}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
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

      <Button type="submit" variant="highlight" className="w-full" disabled={loading}>
        {loading ? "Creating account…" : "Create account"}
      </Button>

      <p className="text-center text-sm text-muted">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-accent hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}
