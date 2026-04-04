import type { Metadata } from "next";
import Script from "next/script";

import { Providers } from "@/app/providers";
import { cn } from "@/lib/utils";

import "./globals.css";

export const metadata: Metadata = {
  title: "VFit",
  description: "MVP de app web de academia com experiência premium, guiada e com tema adaptável.",
};

const themeScript = `
  (function() {
    try {
      var theme = localStorage.getItem('vfit-theme') || 'dark';
      var root = document.documentElement;
      root.classList.toggle('dark', theme === 'dark');
      root.dataset.theme = theme;
    } catch (error) {
      document.documentElement.classList.add('dark');
      document.documentElement.dataset.theme = 'dark';
    }
  })();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background font-sans text-foreground antialiased")}>
        <Script id="theme-script" strategy="beforeInteractive">
          {themeScript}
        </Script>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
