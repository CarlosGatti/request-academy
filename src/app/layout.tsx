import type { Metadata } from "next";
import { DM_Sans, Source_Serif_4 } from "next/font/google";
import { AppProviders } from "@/app/providers";
import { clientEnv } from "@/lib/env/client";
import "@/styles/globals.css";

/**
 * Fractul Variable is the RE-Quest display face but is not bundled here
 * (licensing). DM Sans is a close professional fallback until Fractul is approved.
 */
const displayFont = DM_Sans({
  variable: "--font-display-family",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const bodyFont = Source_Serif_4({
  variable: "--font-body-family",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const uiFont = DM_Sans({
  variable: "--font-ui-family",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: {
    default: clientEnv.NEXT_PUBLIC_APP_NAME,
    template: `%s · ${clientEnv.NEXT_PUBLIC_APP_NAME}`,
  },
  description:
    "Practical professional knowledge and reusable materials for real work.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${displayFont.variable} ${bodyFont.variable} ${uiFont.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
