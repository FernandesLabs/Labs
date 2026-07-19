import { NextResponse } from 'next/server'
import { siteConfig } from '@/lib/site-config'
/**
 * Serves /ads.txt for Google AdSense verification.
 *
 * AdSense requires an ads.txt file at the root of your domain containing
 * your publisher ID. This route generates it automatically from the
 * NEXT_PUBLIC_ADSENSE_CLIENT_ID env var.
 *
 * If AdSense is not configured, returns an empty ads.txt (which is fine).
 *
 * Format: google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0
 */
export function GET() {
  const clientId = siteConfig.adsense.clientId
  if (!clientId) {
    // Return empty — no AdSense configured yet
    return new NextResponse('', {
      headers: { 'content-type': 'text/plain' },
    })
  }
  // Extract the publisher ID (strip "ca-" prefix)
  const pubId = clientId.replace(/^ca-/, '')
  const adsTxtContent = `google.com, ${pubId}, DIRECT, f08c47fec0942fa0\n`
  return new NextResponse(adsTxtContent, {
    headers: {
      'content-type': 'text/plain',
      'cache-control': 'public, max-age=3600',
    },
  })
}