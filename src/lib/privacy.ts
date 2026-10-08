/**
 * Single source of truth for what the site actually does with user input.
 *
 * WHY THIS FILE EXISTS
 *
 * The About page, the Privacy page and the site footer each used to assert
 * that "nothing you type is sent to our servers" / "your data never leaves
 * your browser". That was false. Six tools proxy requests through our own
 * Next.js route (`/api/network`) because browsers block cross-origin fetches
 * via CORS:
 *
 *   ip-lookup, dns-lookup, ssl-checker, ping-tool,
 *   redirect-checker, http-header-checker
 *
 * Those pages were therefore making a false statement about data handling —
 * a consumer-trust and regulatory problem (GDPR/UK GDPR data-protection
 * principles require the privacy notice to be accurate), and an E-E-A-T
 * problem, because Google evaluates whether a site's claims are trustworthy.
 * Search Console showed the affected pages ranking on page 8+ for exactly the
 * "is this site trustworthy" class of queries.
 *
 * Three copies of the claim drifted independently. Centralise it here so the
 * copy is generated from the same list that documents the behaviour.
 *
 * TO UPDATE: if a tool starts or stops calling `/api/network`, add/remove its
 * slug below. `tests/privacy-claims.test.ts` asserts that this list matches
 * what the components actually reference.
 */

/** Slugs of tools that send input to our server via `/api/network`. */
export const SERVER_PROXIED_TOOL_SLUGS = [
  'ip-lookup',
  'dns-lookup',
  'ssl-checker',
  'ping-tool',
  'redirect-checker',
  'http-header-checker',
] as const

export type ServerProxiedToolSlug = (typeof SERVER_PROXIED_TOOL_SLUGS)[number]

/** True when this tool routes user input through our server. */
export function usesServerProxy(slug: string): boolean {
  return (SERVER_PROXIED_TOOL_SLUGS as readonly string[]).includes(slug)
}

/** "IP Lookup, DNS Lookup and 4 others" */
export function serverProxiedToolList(): string {
  const names = SERVER_PROXIED_TOOL_SLUGS.map(
    (slug) =>
      slug
        .split('-')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ')
  )
  const first = names.slice(0, -1).join(', ')
  const last = names[names.length - 1]
  return `${first} and ${last}`
}

/**
 * Accurate site-wide privacy claim.
 *
 * Use this instead of "your data never leaves your browser" on any page that
 * describes the whole site. The six server-proxied tools are named so the
 * statement is specific rather than reassuring-but-vague.
 */
export const SITE_PRIVACY_SUMMARY =
  '126 of our 132 tools process everything in your browser and never send ' +
  'your input to a server. Six network tools — IP Lookup, DNS Lookup, SSL ' +
  'Checker, Ping, Redirect Checker and HTTP Header Checker — run their ' +
  'request through our server because browsers block cross-origin requests. ' +
  'Those lookups are proxied without being stored or logged.'

/**
 * Short claim for a single tool page's footer/meta context.
 *
 * `proxied` must reflect the tool's actual behaviour — pass
 * `usesServerProxy(tool.slug)` rather than hardcoding it.
 */
export function toolPrivacyClaim(proxied: boolean): string {
  return proxied
    ? 'Lookups run through our server to bypass browser CORS limits and are never stored or logged.'
    : 'Runs entirely in your browser — your input is never sent to a server.'
}