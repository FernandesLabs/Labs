export interface ContentOverride {
  /** Rich, specific intro paragraph(s). 80–150 words. Unique per tool. */
  intro: string
  /** Concrete input→output examples that demonstrate the tool. */
  examples: { input: string; output: string; note?: string }[]
  /** Specific how-to steps that reference the actual UI elements. */
  howTo: string[]
  /** Real FAQ with substantive, tool-specific answers. */
  faqs: { q: string; a: string }[]
  /** Use cases specific to this tool. */
  useCases: string[]
  /** Pro tips specific to this tool. */
  tips: string[]
  /**
   * Optional "Technical SEO best practices" bullets — rendered as a
   * dedicated H2 section (only when present). Used by SEO-audience tools
   * (redirect checker, canonical checker, robots generator) where an
   * editorial best-practice section adds genuine, non-templated value.
   */
  bestPractices?: string[]
}
/** A map of tool slug → content override. */
export type ToolOverrideMap = Record<string, ContentOverride>
