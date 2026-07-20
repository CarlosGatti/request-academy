import { WorkspaceShell } from "@/components/layout/workspace-shell";
import { ErrorBoundary } from "@/components/ui/error-boundary";

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <WorkspaceShell>
      <ErrorBoundary>{children}</ErrorBoundary>
    </WorkspaceShell>
  );
}
