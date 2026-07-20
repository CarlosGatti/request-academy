import { Suspense } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { LoginForm } from "@/features/auth/login-form";
import { Spinner } from "@/components/ui/spinner";

export default function LoginPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Sign in"
        description="Access your professional workspace."
      />
      <Suspense fallback={<Spinner label="Loading form" />}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
