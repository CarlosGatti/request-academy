import { Suspense } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Spinner } from "@/components/ui/spinner";
import { ForgotPasswordForm } from "@/features/auth/forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Reset password"
        description="We’ll email you a link to choose a new password."
      />
      <Suspense fallback={<Spinner label="Loading form" />}>
        <ForgotPasswordForm />
      </Suspense>
    </div>
  );
}
