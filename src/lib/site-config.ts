/**
 * Fernandes Labs — Site Configuration
 *
 * All monetization settings are read from environment variables (with safe
 * fallbacks so the app works in development without any config).
 *
 * On Vercel (or any hosting platform), set these as Environment Variables
 * in the project settings dashboard. Variables prefixed with NEXT_PUBLIC_
 * are exposed to the browser — that's intentional here because the tools
 * run client-side and need to render ads/analytics/donation widgets.
 *
 * See .env.example for a complete list of variables to set.
 */
function str(value: string | undefined, fallback = ''): string {
  return value && value.trim() ? value.trim() : fallback
}
function bool(value: string | undefined, fallback = false): boolean {
  if (value === undefined || value === null) return fallback
  return value === 'true' || value === '1' || value === 'yes'
}
function nullableStr(value: string | undefined): string | null {
  const v = value?.trim()
  return v ? v : null
}
export const siteConfig = {
  site: {
    name: str(process.env.NEXT_PUBLIC_SITE_NAME, 'Fernandes Labs'),
    // Use www. consistently — the live site redirects non-www → www, so all
    // canonical URLs, sitemap entries, and OG metadata must point to www.
    domain: str(process.env.NEXT_PUBLIC_SITE_DOMAIN, 'www.fernandeslabs.com'),
    url: str(
      process.env.NEXT_PUBLIC_SITE_URL,
      `https://${str(process.env.NEXT_PUBLIC_SITE_DOMAIN, 'www.fernandeslabs.com')}`
    ),
    description: str(
      process.env.NEXT_PUBLIC_SITE_DESCRIPTION,
      'Free online tools for developers, designers, and marketers. No sign-up. No tracking. Works offline.'
    ),
    contactEmail: str(
      process.env.NEXT_PUBLIC_CONTACT_EMAIL,
      'fernandeslabssupport@gmail.com'
    ),
  },
  /** Google AdSense — apply at https://adsense.google.com */
  adsense: {
    enabled: bool(process.env.NEXT_PUBLIC_ADSENSE_ENABLED, false),
    clientId: nullableStr(process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID),
    slots: {
      horizontal: nullableStr(process.env.NEXT_PUBLIC_ADSENSE_SLOT_HORIZONTAL),
      vertical: nullableStr(process.env.NEXT_PUBLIC_ADSENSE_SLOT_VERTICAL),
      footer: nullableStr(process.env.NEXT_PUBLIC_ADSENSE_SLOT_FOOTER),
      inArticle: nullableStr(process.env.NEXT_PUBLIC_ADSENSE_SLOT_IN_ARTICLE),
    },
  },
  /** Google Analytics 4 — create at https://analytics.google.com */
  analytics: {
    googleAnalyticsId: nullableStr(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID),
  },
  /** Google Search Console — verify at https://search.google.com/search-console */
  searchConsole: {
    verificationToken: nullableStr(
      process.env.NEXT_PUBLIC_SEARCH_CONSOLE_TOKEN
    ),
  },
  /** Crypto donations */
  crypto: {
    enabled: bool(process.env.NEXT_PUBLIC_CRYPTO_ENABLED, true),
    wallets: {
      bitcoin: nullableStr(process.env.NEXT_PUBLIC_CRYPTO_BTC),
      ethereum: nullableStr(process.env.NEXT_PUBLIC_CRYPTO_ETH),
      usdc_base: nullableStr(process.env.NEXT_PUBLIC_CRYPTO_USDC),
      solana: nullableStr(process.env.NEXT_PUBLIC_CRYPTO_SOL),
    },
    donationAmounts: [1, 5, 10, 25, 50],
  },
  // NOTE: the previous `affiliate` block (NEXT_PUBLIC_AFF_*) has been
  // removed. There is no affiliate programme. What it pointed at were plain
  // vendor homepages (https://cloudflare.com etc.) with no referral tracking,
  // rendered under the disclosure "we may earn a commission if you sign up" —
  // a claim that was false, since no commission was possible. Advertising
  // (AdSense) is the site's only monetisation.
  /** Social/profile links */
  social: {
    github: str(
      process.env.NEXT_PUBLIC_SOCIAL_GITHUB,
      'https://github.com/FernandesLabs/Labs'
    ),
    twitter: nullableStr(process.env.NEXT_PUBLIC_SOCIAL_TWITTER),
  },
  /**
   * Author identity — powers the Person JSON-LD (homepage + every blog
   * post), the visible byline on posts, and `author` in Article schema.
   *
   * Optional: with no name configured the Person node is omitted and posts
   * fall back to the Organization, which is the current state. That is a
   * real ranking gap — Search Console showed 0.19% CTR at average position
   * 78, and an anonymous author on YMYL-adjacent topics (finance, health
   * and network tools) is a signal Google weighs directly.
   *
   * E-E-A-T note: use a real, verifiable identity and never invent one.
   * Google cross-checks entity consistency. Set these in `.env`:
   *
   *   NEXT_PUBLIC_FOUNDER_NAME="Real Name"
   *   NEXT_PUBLIC_FOUNDER_JOB_TITLE="Founder & Lead Developer"
   *   NEXT_PUBLIC_FOUNDER_PROFILE_URL="https://www.fernandeslabs.com/about"
   *   NEXT_PUBLIC_FOUNDER_SAME_AS="https://github.com/<user>,https://x.com/<user>"
   *
   * `sameAs` is what ties the Person node to verifiable profiles — fill it
   * in alongside the name rather than leaving it empty.
   */
  founder: {
    name: nullableStr(process.env.NEXT_PUBLIC_FOUNDER_NAME),
    jobTitle: str(
      process.env.NEXT_PUBLIC_FOUNDER_JOB_TITLE,
      'Founder & Lead Developer'
    ),
    profileUrl: nullableStr(process.env.NEXT_PUBLIC_FOUNDER_PROFILE_URL),
    /** Comma-separated profile URLs, e.g. GitHub / X / LinkedIn. */
    sameAs: (process.env.NEXT_PUBLIC_FOUNDER_SAME_AS ?? '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean),
  },
}
/** Helper: is AdSense fully configured and ready to show real ads? */
export function isAdsenseConfigured(): boolean {
  return Boolean(siteConfig.adsense.enabled && siteConfig.adsense.clientId)
}
/** Helper: is crypto donation enabled with at least one wallet? */
export function isCryptoConfigured(): boolean {
  return (
    siteConfig.crypto.enabled &&
    Object.values(siteConfig.crypto.wallets).some(Boolean)
  )
}