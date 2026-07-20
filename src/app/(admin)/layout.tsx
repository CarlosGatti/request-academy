import { AdminShell } from "@/components/layout/admin-shell";
import { ErrorBoundary } from "@/components/ui/error-boundary";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminShell>
      <ErrorBoundary>{children}</ErrorBoundary>
    </AdminShell>
  );
}
