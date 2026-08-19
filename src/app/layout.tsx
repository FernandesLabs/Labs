// src/app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { ServiceWorkerRegister } from "@/components/hub/service-worker-register";
import { ConsentManager } from "@/components/ads/consent-manager";
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
        {/* Google Consent Mode v2 — consent "default" MUST be set before any
            Google tag (AdSense/Analytics) fires. All non-essential storage
            starts denied; the ConsentManager component updates it after the
            user chooses. Adsense is only ever loaded after an accepted
            choice (see src/lib/ads/consent.ts) — site verification is
            covered by the static public/ads.txt. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){ window.dataLayer.push(arguments); }
              gtag('consent', 'default', {
                'ad_storage': 'denied',
                'ad_user_data': 'denied',
                'ad_personalization': 'denied',
                'analytics_storage': 'denied',
                'functionality_storage': 'denied',
                'personalization_storage': 'denied',
                'security_storage': 'granted',
                'wait_for_update': 500
              });
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider>{children}</ThemeProvider>
        <ServiceWorkerRegister />
        <ConsentManager />
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