// src/app/layout.tsx
import type { Metadata } from "next";
import { GeistSans, GeistMono } from "geist/font";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { ServiceWorkerRegister } from "@/components/hub/service-worker-register";
import { siteConfig } from "@/lib/site-config";
export const metadata: Metadata = {
  metadataBase: new URL(`https://${siteConfig.site.domain}`),
  title: "Fernandes Labs — Free Online Tools",
  description:
    "A growing collection of fast, privacy-first tools for developers, designers, and marketers. JSON formatter, QR generator, password generator, and more. No sign-up. No tracking. Works offline.",
  keywords: [
    "free online tools",
    "developer tools",
    "seo tools",
    "text tools",
    "finance calculators",
    "JSON formatter",
    "QR generator",
    "password generator",
    "Fernandes Labs",
  ],
  authors: [{ name: "Fernandes Labs" }],
  icons: {
    icon: "/fl-logo.svg",
    apple: "/fl-logo.svg",
  },
  manifest: "/manifest.webmanifest",
  alternates: {
    canonical: `https://${siteConfig.site.domain}/`,
  },
  // Google Search Console verification — paste your token in site-config.ts
  ...(siteConfig.searchConsole.verificationToken
    ? {
        verification: {
          google: siteConfig.searchConsole.verificationToken,
        },
      }
    : {}),
  openGraph: {
    title: "Fernandes Labs — Free Online Tools",
    description:
      "Fast, privacy-first tools for developers, designers, and marketers. No sign-up. No tracking.",
    siteName: "Fernandes Labs",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fernandes Labs — Free Online Tools",
    description:
      "Fast, privacy-first tools for developers, designers, and marketers.",
  },
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google AdSense loader — must be in <head> for crawler verification.
            Only rendered once when enabled and clientId is configured. */}
        {siteConfig.adsense.enabled && siteConfig.adsense.clientId ? (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${siteConfig.adsense.clientId}`}
            crossOrigin="anonymous"
          />
        ) : null}
      </head>
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider>{children}</ThemeProvider>
        <ServiceWorkerRegister />
        {siteConfig.analytics.googleAnalyticsId ? (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${siteConfig.analytics.googleAnalyticsId}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer=window.dataLayer||[];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${siteConfig.analytics.googleAnalyticsId}');
                `,
              }}
            />
          </>
        ) : null}
        <Toaster />
      </body>
    </html>
  );
}