/**
 * Fernandes Labs — Site Configuration
 *
 * This is the ONE file you edit to activate monetization.
 * Fill in your IDs/links and everything updates automatically.
 *
 * --- QUICK START ---
 * 1. Google AdSense: apply at adsense.google.com, get your client ID
 *    (looks like "ca-pub-1234567890123456"), paste it below.
 * 2. Google Analytics: create a GA4 property, get your Measurement ID
 *    (looks like "G-XXXXXXXXXX"), paste it below.
 * 3. Google Search Console: add your site, get the verification token,
 *    paste it below.
 * 4. Crypto donations: paste your wallet addresses below.
 * 5. Affiliate links: replace the example URLs with your affiliate links.
 *
 * Until you fill these in, the app shows branded placeholders — it works
 * perfectly without any of this configured.
 */

export const siteConfig = {
  site: {
    name: 'Fernandes Labs',
    domain: 'fernandeslabs.com',
    url: 'https://fernandeslabs.com',
    description:
      'Free online tools for developers, designers, and marketers. No sign-up. No tracking. Works offline.',
    contactEmail: 'fernandeslabssupport@gmail.com',
  },

  /** Google AdSense — apply at https://adsense.google.com */
  adsense: {
    enabled: false, // set to true once you have a client_id
    clientId: null as string | null, // "ca-pub-1234567890123456"
    slots: {
      horizontal: null as string | null, // "1234567890"
      vertical: null as string | null,
      footer: null as string | null,
    },
  },

  /** Google Analytics 4 — create at https://analytics.google.com */
  analytics: {
    googleAnalyticsId: null as string | null, // "G-XXXXXXXXXX"
  },

  /** Google Search Console — verify at https://search.google.com/search-console */
  searchConsole: {
    /** The content attribute of the verification meta tag.
     *  Looks like "google-site-verification=ABC123...". Paste ONLY the token part. */
    verificationToken: null as string | null,
  },

  /** Crypto donations — paste your wallet addresses */
  crypto: {
    enabled: true,
    wallets: {
      bitcoin: null as string | null, // "bc1q..."
      ethereum: null as string | null, // "0x..."
      usdc_base: null as string | null, // "0x..." (on Base network)
      solana: null as string | null, // "..." 
    },
    donationAmounts: [1, 5, 10, 25, 50],
  },

  /** Affiliate links — replace with your affiliate URLs.
   *  Sign up for these programs (all free to join):
   *  - Cloudflare (hosting/CDN): https://www.cloudflare.com/partners/
   *  - Namecheap (domains): https://www.namecheap.com/affiliates/
   *  - 1Password (password manager): https://1password.com/partnerships/
   *  - NordVPN: https://nordvpn.com/affiliate/
   *  - Ahrefs (SEO): https://ahrefs.com/affiliate
   */
  affiliate: {
    enabled: true,
    links: {
      hosting: 'https://cloudflare.com',
      domain: 'https://namecheap.com',
      vpn: 'https://protonvpn.com',
      passwordManager: null as string | null,
      seoTool: null as string | null,
    },
  },

  /** Social/profile links (shown in footer) */
  social: {
    github: 'https://github.com/FernandesLabs/Labs',
    twitter: null as string | null,
  },
} as const

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
