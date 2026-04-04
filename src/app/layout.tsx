import type { Metadata } from "next";

import { Providers } from "@/app/providers";
import { cn } from "@/lib/utils";

import "./globals.css";

export const metadata: Metadata = {
  title: "VFit",
  description: "MVP de app web de academia com experiência premium e guiada.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background font-sans text-foreground antialiased")}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
