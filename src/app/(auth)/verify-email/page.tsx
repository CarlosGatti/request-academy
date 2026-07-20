import { Suspense } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { VerifyEmailForm } from "@/features/auth/verify-email-form";
import { Spinner } from "@/components/ui/spinner";

export default function VerifyEmailPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Verify email"
        description="Confirm your email to continue."
      />
      <Suspense fallback={<Spinner label="Loading form" />}>
        <VerifyEmailForm />
      </Suspense>
    </div>
  );
}
