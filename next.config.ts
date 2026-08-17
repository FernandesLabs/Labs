// next.config.ts
import type { NextConfig } from "next";

const WWW_URL = "https://www.fernandeslabs.com";

const nextConfig: NextConfig = {
  output: "standalone",
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: false, // changed from true
  },
  // Allow the preview gateway host to request /_next/* assets without Next.js
  // logging a cross-origin warning in dev. Production is unaffected.
  allowedDevOrigins: [
    "*.space-z.ai",
    "localhost",
    "127.0.0.1",
  ],
  /**
   * Canonical redirects (single hop, no chains).
   *
   * Previously http → https → www was a two-hop chain (two redirects), and
   * Google Search Console reported 32 "Page with redirect" pages plus an
   * indexed `http://fernandeslabs.com/` variant. Every request now lands on
   * https://www.fernandeslabs.com/ in exactly one 308.
   *
   * IMPORTANT: remove any equivalent redirects in the Vercel dashboard
   * (Project → Settings → Domains → Redirects). Platform redirects run
   * BEFORE next.config rules, so leaving both in place would recreate the
   * chain and bypass the ads.txt exception below.
   *
   * ads.txt / app-ads.txt are exempted from the apex → www rule so the files
   * are served with HTTP 200 on BOTH hosts. AdSense's ads.txt crawler can be
   * strict about cross-host redirects and must find the file at the apex
   * root — a redirect here is the classic cause of "ads.txt not found".
   */
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [
          { type: "host", value: "www.fernandeslabs.com" },
          { type: "header", key: "x-forwarded-proto", value: "http" },
        ],
        destination: `${WWW_URL}/:path*`,
        permanent: true,
      },
      {
        source: "/:path*",
        has: [
          { type: "host", value: "fernandeslabs.com" },
          { type: "header", key: "x-forwarded-proto", value: "http" },
        ],
        destination: `${WWW_URL}/:path*`,
        permanent: true,
      },
      {
        source: "/:path((?!ads\\.txt$|app-ads\\.txt$).*)",
        has: [{ type: "host", value: "fernandeslabs.com" }],
        destination: `${WWW_URL}/:path`,
        permanent: true,
      },
      {
        source: "/",
        has: [{ type: "host", value: "fernandeslabs.com" }],
        destination: `${WWW_URL}/`,
        permanent: true,
      },
    ];
  },
};
export default nextConfig;