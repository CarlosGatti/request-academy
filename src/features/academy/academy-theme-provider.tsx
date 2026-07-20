"use client";

import { useQuery } from "@apollo/client/react";
import { AcademyThemeScope } from "@/features/academy/academy-theme-scope";
import { DefinedAcademyBySlugDocument } from "@/graphql/generated/graphql";

export function AcademyThemeProvider({
  academySlug,
  children,
}: {
  academySlug: string;
  children: React.ReactNode;
}) {
  const { data } = useQuery(DefinedAcademyBySlugDocument, {
    variables: { slug: academySlug },
  });

  return (
    <AcademyThemeScope
      academy={data?.definedAcademyBySlug}
      className="min-h-full"
    >
      {children}
    </AcademyThemeScope>
  );
}
