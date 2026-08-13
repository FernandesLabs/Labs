// src/app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { ServiceWorkerRegister } from "@/components/hub/service-worker-register";
import { AutoAds } from "@/components/ads/auto-ads";
import { siteConfig } from "@/lib/site-config";

// Only the weights actually used across the app (normal/medium/semibold/bold/
// extrabold) are loaded — the old `geist/font` package preloaded ALL weights
// (26 woff2 files per page), which hurt LCP and wasted bandwidth.
const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});
const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});
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
            Only rendered once when enabled and clientId is configured.
            The Auto Ads page-level config is pushed separately by the
            <AutoAds /> client component (see src/components/ads/auto-ads.tsx),
            NOT as an inline <head> script — an inline script in <head> is
            executed twice during React streaming/hydration, which triggers
            AdSense's "Only one 'enable_page_level_ads' allowed per page"
            console error. */}
        {siteConfig.adsense.enabled && siteConfig.adsense.clientId ? (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${siteConfig.adsense.clientId}`}
            crossOrigin="anonymous"
          />
        ) : null}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider>{children}</ThemeProvider>
        <ServiceWorkerRegister />
        <AutoAds />
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