import { Suspense } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { RegisterForm } from "@/features/auth/register-form";
import { Spinner } from "@/components/ui/spinner";

export default function RegisterPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Create account"
        description="Join the professional growth workspace."
      />
      <Suspense fallback={<Spinner label="Loading form" />}>
        <RegisterForm />
      </Suspense>
    </div>
  );
}
