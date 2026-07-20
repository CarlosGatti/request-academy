import { PublicFooter, PublicHeader } from "@/components/layout/public-shell";
import { ErrorBoundary } from "@/components/ui/error-boundary";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader />
      <main className="flex-1">
        <ErrorBoundary>{children}</ErrorBoundary>
      </main>
      <PublicFooter />
    </div>
  );
}
