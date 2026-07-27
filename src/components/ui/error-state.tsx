import { Alert } from "@/components/ui/alert";
import type { ReactNode } from "react";

export function ErrorState({
  title = "Something went wrong",
  children,
}: {
  title?: string;
  children?: ReactNode;
}) {
  return (
    <Alert tone="danger" title={title}>
      {children}
    </Alert>
  );
}
