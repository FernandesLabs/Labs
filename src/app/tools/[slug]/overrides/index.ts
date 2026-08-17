import { OVERRIDES as DEV_OVERRIDES } from './dev-tools'
import { OVERRIDES as TEXT_OVERRIDES } from './text-tools'
import { OVERRIDES as MEDIA_OVERRIDES } from './media-tools'
import { OVERRIDES as FINANCE_OVERRIDES } from './finance-tools'
import { OVERRIDES as SEO_OVERRIDES } from './seo-tools'
import { OVERRIDES as SECURITY_OVERRIDES } from './security-tools'
import { OVERRIDES as NETWORK_OVERRIDES } from './network-tools'
import { OVERRIDES as MISC_OVERRIDES } from './misc-tools'
import type { ContentOverride, ToolOverrideMap } from './types'
export type { ContentOverride, ToolOverrideMap } from './types'
/**
 * Single unified map of every tool's hand-written content override,
 * merged from the per-category modules in this directory.
 */
export const OVERRIDES: ToolOverrideMap = {
  ...DEV_OVERRIDES,
  ...TEXT_OVERRIDES,
  ...MEDIA_OVERRIDES,
  ...FINANCE_OVERRIDES,
  ...SEO_OVERRIDES,
  ...SECURITY_OVERRIDES,
  ...NETWORK_OVERRIDES,
  ...MISC_OVERRIDES,
}
