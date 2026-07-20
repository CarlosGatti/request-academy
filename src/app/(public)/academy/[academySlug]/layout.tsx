import { AcademyThemeProvider } from "@/features/academy/academy-theme-provider";

export default async function AcademySlugLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ academySlug: string }>;
}) {
  const { academySlug } = await params;
  return (
    <AcademyThemeProvider academySlug={academySlug}>
      {children}
    </AcademyThemeProvider>
  );
}
