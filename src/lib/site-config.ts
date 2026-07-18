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
    domain: str(process.env.NEXT_PUBLIC_SITE_DOMAIN, 'fernandeslabs.com'),
    url: str(
      process.env.NEXT_PUBLIC_SITE_URL,
      `https://${str(process.env.NEXT_PUBLIC_SITE_DOMAIN, 'fernandeslabs.com')}`
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

  /** Affiliate links */
  affiliate: {
    enabled: bool(process.env.NEXT_PUBLIC_AFFILIATE_ENABLED, true),
    links: {
      hosting: nullableStr(process.env.NEXT_PUBLIC_AFF_HOSTING) || 'https://cloudflare.com',
      domain: nullableStr(process.env.NEXT_PUBLIC_AFF_DOMAIN) || 'https://namecheap.com',
      vpn: nullableStr(process.env.NEXT_PUBLIC_AFF_VPN) || 'https://protonvpn.com',
      passwordManager: nullableStr(process.env.NEXT_PUBLIC_AFF_PASSWORD_MANAGER),
      seoTool: nullableStr(process.env.NEXT_PUBLIC_AFF_SEO_TOOL),
    },
  },

  /** Social/profile links */
  social: {
    github: str(
      process.env.NEXT_PUBLIC_SOCIAL_GITHUB,
      'https://github.com/FernandesLabs/Labs'
    ),
    twitter: nullableStr(process.env.NEXT_PUBLIC_SOCIAL_TWITTER),
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
