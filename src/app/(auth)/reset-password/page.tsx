import { Suspense } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Spinner } from "@/components/ui/spinner";
import { ResetPasswordForm } from "@/features/auth/reset-password-form";

export default function ResetPasswordPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Choose a new password"
        description="Use a strong password you don’t reuse elsewhere."
      />
      <Suspense fallback={<Spinner label="Loading form" />}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
