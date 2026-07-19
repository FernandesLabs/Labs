import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import { ServiceWorkerRegister } from "@/components/hub/service-worker-register";
import { siteConfig } from "@/lib/site-config";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://fernandeslabs.com"
  ),
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
    images: [
      {
        url: "/api/og",
        width: 1200,
        height: 630,
        alt: "Fernandes Labs — Free Online Tools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Fernandes Labs — Free Online Tools",
    description:
      "Fast, privacy-first tools for developers, designers, and marketers.",
    images: ["/api/og"],
  },
  alternates: {
    // Canonical for the hub — prevents duplicate-content issues.
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#2563eb" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  width: "device-width",
  initialScale: 1,
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
            Set NEXT_PUBLIC_ADSENSE_CLIENT_ID env var to activate. */}
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
        {siteConfig.analytics.googleAnalyticsId ? (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${siteConfig.analytics.googleAnalyticsId}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${siteConfig.analytics.googleAnalyticsId}');`,
              }}
            />
          </>
        ) : null}
        <Toaster />
      </body>
    </html>
  );
}
