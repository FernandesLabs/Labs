// next.config.ts
import type { NextConfig } from "next";
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
};
export default nextConfig;