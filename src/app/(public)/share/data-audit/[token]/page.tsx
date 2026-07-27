import { DataAuditShareReportView } from "@/features/admin/data-audit/data-audit-share-report-view";

type PageProps = {
  params: Promise<{ token: string }>;
};

export default async function DataAuditSharePage({ params }: PageProps) {
  const { token } = await params;
  return <DataAuditShareReportView token={token} />;
}
