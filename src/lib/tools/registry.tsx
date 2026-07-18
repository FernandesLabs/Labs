'use client'

import type { Tool } from './types'
import dynamic from 'next/dynamic'
import { ToolLoadingSkeleton } from '@/components/hub/tool-loading-skeleton'

const JsonFormatter = dynamic(() => import('@/components/tools/developer/json-formatter'), { loading: () => <ToolLoadingSkeleton />, ssr: false })
const JsonYamlConverter = dynamic(() => import('@/components/tools/developer/json-yaml-converter'), { loading: () => <ToolLoadingSkeleton />, ssr: false })
const XmlFormatter = dynamic(() => import('@/components/tools/developer/xml-formatter'), { loading: () => <ToolLoadingSkeleton />, ssr: false })
const Base64EncoderDecoder = dynamic(() => import('@/components/tools/developer/base64-encoder-decoder'), { loading: () => <ToolLoadingSkeleton />, ssr: false })
const UuidGenerator = dynamic(() => import('@/components/tools/developer/uuid-generator'), { loading: () => <ToolLoadingSkeleton />, ssr: false })
const HashGenerator = dynamic(() => import('@/components/tools/developer/hash-generator'), { loading: () => <ToolLoadingSkeleton />, ssr: false })
const HmacGenerator = dynamic(() => import('@/components/tools/developer/hmac-generator'), { loading: () => <ToolLoadingSkeleton />, ssr: false })
const JwtDecoder = dynamic(() => import('@/components/tools/developer/jwt-decoder'), { loading: () => <ToolLoadingSkeleton />, ssr: false })
const JwtGenerator = dynamic(() => import('@/components/tools/developer/jwt-generator'), { loading: () => <ToolLoadingSkeleton />, ssr: false })
const RegexTester = dynamic(() => import('@/components/tools/developer/regex-tester'), { loading: () => <ToolLoadingSkeleton />, ssr: false })
const UrlEncoderDecoder = dynamic(() => import('@/components/tools/developer/url-encoder-decoder'), { loading: () => <ToolLoadingSkeleton />, ssr: false })
const UnixTimestampConverter = dynamic(() => import('@/components/tools/developer/unix-timestamp-converter'), { loading: () => <ToolLoadingSkeleton />, ssr: false })
const ColorConverter = dynamic(() => import('@/components/tools/developer/color-converter'), { loading: () => <ToolLoadingSkeleton />, ssr: false })
const HtmlEntityEncoder = dynamic(() => import('@/components/tools/developer/html-entity-encoder'), { loading: () => <ToolLoadingSkeleton />, ssr: false })
const SqlFormatter = dynamic(() => import('@/components/tools/developer/sql-formatter'), { loading: () => <ToolLoadingSkeleton />, ssr: false })
const CronExpressionGenerator = dynamic(() => import('@/components/tools/developer/cron-expression-generator'), { loading: () => <ToolLoadingSkeleton />, ssr: false })
const DiffChecker = dynamic(() => import('@/components/tools/developer/diff-checker'), { loading: () => <ToolLoadingSkeleton />, ssr: false })
const MarkdownPreview = dynamic(() => import('@/components/tools/developer/markdown-preview'), { loading: () => <ToolLoadingSkeleton />, ssr: false })
const WordCounter = dynamic(() => import('@/components/tools/text/word-counter'), { loading: () => <ToolLoadingSkeleton />, ssr: false })
const CharacterCounter = dynamic(() => import('@/components/tools/text/character-counter'), { loading: () => <ToolLoadingSkeleton />, ssr: false })
const CaseConverter = dynamic(() => import('@/components/tools/text/case-converter'), { loading: () => <ToolLoadingSkeleton />, ssr: false })
const SlugGenerator = dynamic(() => import('@/components/tools/text/slug-generator'), { loading: () => <ToolLoadingSkeleton />, ssr: false })
const LoremIpsumGenerator = dynamic(() => import('@/components/tools/text/lorem-ipsum-generator'), { loading: () => <ToolLoadingSkeleton />, ssr: false })
const TextSorter = dynamic(() => import('@/components/tools/text/text-sorter'), { loading: () => <ToolLoadingSkeleton />, ssr: false })
const RemoveBlankLines = dynamic(() => import('@/components/tools/text/remove-blank-lines'), { loading: () => <ToolLoadingSkeleton />, ssr: false })
const DuplicateLineRemover = dynamic(() => import('@/components/tools/text/duplicate-line-remover'), { loading: () => <ToolLoadingSkeleton />, ssr: false })
const ReadingTimeCalculator = dynamic(() => import('@/components/tools/text/reading-time-calculator'), { loading: () => <ToolLoadingSkeleton />, ssr: false })
const UnicodeInspector = dynamic(() => import('@/components/tools/text/unicode-inspector'), { loading: () => <ToolLoadingSkeleton />, ssr: false })
const CapitalizationTool = dynamic(() => import('@/components/tools/text/capitalization-tool'), { loading: () => <ToolLoadingSkeleton />, ssr: false })
const TextCompare = dynamic(() => import('@/components/tools/text/text-compare'), { loading: () => <ToolLoadingSkeleton />, ssr: false })
const PercentageCalculator = dynamic(() => import('@/components/tools/finance/percentage-calculator'), { loading: () => <ToolLoadingSkeleton />, ssr: false })
const BmiCalculator = dynamic(() => import('@/components/tools/finance/bmi-calculator'), { loading: () => <ToolLoadingSkeleton />, ssr: false })
const VatCalculator = dynamic(() => import('@/components/tools/finance/vat-calculator'), { loading: () => <ToolLoadingSkeleton />, ssr: false })
const LoanCalculator = dynamic(() => import('@/components/tools/finance/loan-calculator'), { loading: () => <ToolLoadingSkeleton />, ssr: false })
const MortgageCalculator = dynamic(() => import('@/components/tools/finance/mortgage-calculator'), { loading: () => <ToolLoadingSkeleton />, ssr: false })
const CompoundInterestCalculator = dynamic(() => import('@/components/tools/finance/compound-interest-calculator'), { loading: () => <ToolLoadingSkeleton />, ssr: false })
const GpaCalculator = dynamic(() => import('@/components/tools/finance/gpa-calculator'), { loading: () => <ToolLoadingSkeleton />, ssr: false })
const CurrencyConverter = dynamic(() => import('@/components/tools/finance/currency-converter'), { loading: () => <ToolLoadingSkeleton />, ssr: false })
const BodyFatCalculator = dynamic(() => import('@/components/tools/finance/body-fat-calculator'), { loading: () => <ToolLoadingSkeleton />, ssr: false })
const UnitConverter = dynamic(() => import('@/components/tools/finance/unit-converter'), { loading: () => <ToolLoadingSkeleton />, ssr: false })
const InvoiceGenerator = dynamic(() => import('@/components/tools/finance/invoice-generator'), { loading: () => <ToolLoadingSkeleton />, ssr: false })
const BmrCalculator = dynamic(() => import('@/components/tools/finance/bmr-calculator'), { loading: () => <ToolLoadingSkeleton />, ssr: false })
const TdeeCalculator = dynamic(() => import('@/components/tools/finance/tdee-calculator'), { loading: () => <ToolLoadingSkeleton />, ssr: false })
const CalorieCalculator = dynamic(() => import('@/components/tools/finance/calorie-calculator'), { loading: () => <ToolLoadingSkeleton />, ssr: false })
const MacroCalculator = dynamic(() => import('@/components/tools/finance/macro-calculator'), { loading: () => <ToolLoadingSkeleton />, ssr: false })
const WaterIntakeCalculator = dynamic(() => import('@/components/tools/finance/water-intake-calculator'), { loading: () => <ToolLoadingSkeleton />, ssr: false })
const RetirementCalculator = dynamic(() => import('@/components/tools/finance/retirement-calculator'), { loading: () => <ToolLoadingSkeleton />, ssr: false })
const RoiCalculator = dynamic(() => import('@/components/tools/finance/roi-calculator'), { loading: () => <ToolLoadingSkeleton />, ssr: false })
const SavingsCalculator = dynamic(() => import('@/components/tools/finance/savings-calculator'), { loading: () => <ToolLoadingSkeleton />, ssr: false })
const BreakEvenCalculator = dynamic(() => import('@/components/tools/finance/break-even-calculator'), { loading: () => <ToolLoadingSkeleton />, ssr: false })
const ProfitMarginCalculator = dynamic(() => import('@/components/tools/finance/profit-margin-calculator'), { loading: () => <ToolLoadingSkeleton />, ssr: false })
const InflationCalculator = dynamic(() => import('@/components/tools/finance/inflation-calculator'), { loading: () => <ToolLoadingSkeleton />, ssr: false })
const GradeCalculator = dynamic(() => import('@/components/tools/finance/grade-calculator'), { loading: () => <ToolLoadingSkeleton />, ssr: false })
const QuoteGenerator = dynamic(() => import('@/components/tools/finance/quote-generator'), { loading: () => <ToolLoadingSkeleton />, ssr: false })
const FlashcardGenerator = dynamic(() => import('@/components/tools/finance/flashcard-generator'), { loading: () => <ToolLoadingSkeleton />, ssr: false })
const CitationGenerator = dynamic(() => import('@/components/tools/finance/citation-generator'), { loading: () => <ToolLoadingSkeleton />, ssr: false })
const InvoiceNumberGenerator = dynamic(() => import('@/components/tools/finance/invoice-number-generator'), { loading: () => <ToolLoadingSkeleton />, ssr: false })
const StudyPlanner = dynamic(() => import('@/components/tools/finance/study-planner'), { loading: () => <ToolLoadingSkeleton />, ssr: false })
const MetaTagGenerator = dynamic(() => import('@/components/tools/seo/meta-tag-generator'), { loading: () => <ToolLoadingSkeleton />, ssr: false })
const TitleGenerator = dynamic(() => import('@/components/tools/seo/title-generator'), { loading: () => <ToolLoadingSkeleton />, ssr: false })
const CtaGenerator = dynamic(() => import('@/components/tools/seo/cta-generator'), { loading: () => <ToolLoadingSkeleton />, ssr: false })
const RobotsTxtGenerator = dynamic(() => import('@/components/tools/seo/robots-txt-generator'), { loading: () => <ToolLoadingSkeleton />, ssr: false })
const SitemapGenerator = dynamic(() => import('@/components/tools/seo/sitemap-generator'), { loading: () => <ToolLoadingSkeleton />, ssr: false })
const JsonLdGenerator = dynamic(() => import('@/components/tools/seo/json-ld-generator'), { loading: () => <ToolLoadingSkeleton />, ssr: false })
const OpenGraphPreview = dynamic(() => import('@/components/tools/seo/open-graph-preview'), { loading: () => <ToolLoadingSkeleton />, ssr: false })
const HeadlineAnalyzer = dynamic(() => import('@/components/tools/seo/headline-analyzer'), { loading: () => <ToolLoadingSkeleton />, ssr: false })
const KeywordDensityChecker = dynamic(() => import('@/components/tools/seo/keyword-density-checker'), { loading: () => <ToolLoadingSkeleton />, ssr: false })
const EmailSignatureGenerator = dynamic(() => import('@/components/tools/seo/email-signature-generator'), { loading: () => <ToolLoadingSkeleton />, ssr: false })
const UtmBuilder = dynamic(() => import('@/components/tools/seo/utm-builder'), { loading: () => <ToolLoadingSkeleton />, ssr: false })
const FaqGenerator = dynamic(() => import('@/components/tools/seo/faq-generator'), { loading: () => <ToolLoadingSkeleton />, ssr: false })
const TwitterCardPreview = dynamic(() => import('@/components/tools/seo/twitter-card-preview'), { loading: () => <ToolLoadingSkeleton />, ssr: false })
const BreadcrumbSchemaGenerator = dynamic(() => import('@/components/tools/seo/breadcrumb-schema-generator'), { loading: () => <ToolLoadingSkeleton />, ssr: false })
const OrganizationSchemaGenerator = dynamic(() => import('@/components/tools/seo/organization-schema-generator'), { loading: () => <ToolLoadingSkeleton />, ssr: false })
const CanonicalUrlChecker = dynamic(() => import('@/components/tools/seo/canonical-url-checker'), { loading: () => <ToolLoadingSkeleton />, ssr: false })
const BlogOutlineGenerator = dynamic(() => import('@/components/tools/seo/blog-outline-generator'), { loading: () => <ToolLoadingSkeleton />, ssr: false })
const PasswordGenerator = dynamic(() => import('@/components/tools/security/password-generator'), { loading: () => <ToolLoadingSkeleton />, ssr: false })
const SecurePassphraseGenerator = dynamic(() => import('@/components/tools/security/secure-passphrase-generator'), { loading: () => <ToolLoadingSkeleton />, ssr: false })
const PasswordStrengthChecker = dynamic(() => import('@/components/tools/security/password-strength-checker'), { loading: () => <ToolLoadingSkeleton />, ssr: false })
const CspGenerator = dynamic(() => import('@/components/tools/security/csp-generator'), { loading: () => <ToolLoadingSkeleton />, ssr: false })
const DnsLookup = dynamic(() => import('@/components/tools/network/dns-lookup'), { loading: () => <ToolLoadingSkeleton />, ssr: false })
const IpLookup = dynamic(() => import('@/components/tools/network/ip-lookup'), { loading: () => <ToolLoadingSkeleton />, ssr: false })
const HttpHeaderChecker = dynamic(() => import('@/components/tools/network/http-header-checker'), { loading: () => <ToolLoadingSkeleton />, ssr: false })
const SslChecker = dynamic(() => import('@/components/tools/network/ssl-checker'), { loading: () => <ToolLoadingSkeleton />, ssr: false })
const PingTool = dynamic(() => import('@/components/tools/network/ping-tool'), { loading: () => <ToolLoadingSkeleton />, ssr: false })
const RedirectChecker = dynamic(() => import('@/components/tools/network/redirect-checker'), { loading: () => <ToolLoadingSkeleton />, ssr: false })
const UserAgentParser = dynamic(() => import('@/components/tools/network/user-agent-parser'), { loading: () => <ToolLoadingSkeleton />, ssr: false })
const QrGenerator = dynamic(() => import('@/components/tools/media/qr-generator'), { loading: () => <ToolLoadingSkeleton />, ssr: false })
const ColorPaletteExtractor = dynamic(() => import('@/components/tools/media/color-palette-extractor'), { loading: () => <ToolLoadingSkeleton />, ssr: false })
const ColorContrastChecker = dynamic(() => import('@/components/tools/media/color-contrast-checker'), { loading: () => <ToolLoadingSkeleton />, ssr: false })
const ImageCompressor = dynamic(() => import('@/components/tools/media/image-compressor'), { loading: () => <ToolLoadingSkeleton />, ssr: false })
const ImageResizer = dynamic(() => import('@/components/tools/media/image-resizer'), { loading: () => <ToolLoadingSkeleton />, ssr: false })
const FaviconGenerator = dynamic(() => import('@/components/tools/media/favicon-generator'), { loading: () => <ToolLoadingSkeleton />, ssr: false })
const SocialImageGenerator = dynamic(() => import('@/components/tools/media/social-image-generator'), { loading: () => <ToolLoadingSkeleton />, ssr: false })
const CssGradientGenerator = dynamic(() => import('@/components/tools/media/css-gradient-generator'), { loading: () => <ToolLoadingSkeleton />, ssr: false })
const SvgViewer = dynamic(() => import('@/components/tools/media/svg-viewer'), { loading: () => <ToolLoadingSkeleton />, ssr: false })
const FileSizeConverter = dynamic(() => import('@/components/tools/media/file-size-converter'), { loading: () => <ToolLoadingSkeleton />, ssr: false })
const AltTextGenerator = dynamic(() => import('@/components/tools/media/alt-text-generator'), { loading: () => <ToolLoadingSkeleton />, ssr: false })
const MimeDetector = dynamic(() => import('@/components/tools/media/mime-detector'), { loading: () => <ToolLoadingSkeleton />, ssr: false })
const FileHash = dynamic(() => import('@/components/tools/media/file-hash'), { loading: () => <ToolLoadingSkeleton />, ssr: false })
const AriaValidator = dynamic(() => import('@/components/tools/media/aria-validator'), { loading: () => <ToolLoadingSkeleton />, ssr: false })
const TokenCounter = dynamic(() => import('@/components/tools/misc/token-counter'), { loading: () => <ToolLoadingSkeleton />, ssr: false })
const AiCostCalculator = dynamic(() => import('@/components/tools/misc/ai-cost-calculator'), { loading: () => <ToolLoadingSkeleton />, ssr: false })
const PromptOptimizer = dynamic(() => import('@/components/tools/misc/prompt-optimizer'), { loading: () => <ToolLoadingSkeleton />, ssr: false })
const PromptVariableReplacer = dynamic(() => import('@/components/tools/misc/prompt-variable-replacer'), { loading: () => <ToolLoadingSkeleton />, ssr: false })
const SystemPromptGenerator = dynamic(() => import('@/components/tools/misc/system-prompt-generator'), { loading: () => <ToolLoadingSkeleton />, ssr: false })
const AiPersonaGenerator = dynamic(() => import('@/components/tools/misc/ai-persona-generator'), { loading: () => <ToolLoadingSkeleton />, ssr: false })
const PromptLibrary = dynamic(() => import('@/components/tools/misc/prompt-library'), { loading: () => <ToolLoadingSkeleton />, ssr: false })
const PromptVersionManager = dynamic(() => import('@/components/tools/misc/prompt-version-manager'), { loading: () => <ToolLoadingSkeleton />, ssr: false })
const AiWorkflowBuilder = dynamic(() => import('@/components/tools/misc/ai-workflow-builder'), { loading: () => <ToolLoadingSkeleton />, ssr: false })
const MarkdownToHtml = dynamic(() => import('@/components/tools/developer/markdown-to-html'), { loading: () => <ToolLoadingSkeleton />, ssr: false })
const TextCompareDiff = dynamic(() => import('@/components/tools/developer/text-compare-diff'), { loading: () => <ToolLoadingSkeleton />, ssr: false })
const CampaignUrlBuilder = dynamic(() => import('@/components/tools/seo/campaign-url-builder'), { loading: () => <ToolLoadingSkeleton />, ssr: false })
const QrCampaignGenerator = dynamic(() => import('@/components/tools/seo/qr-campaign-generator'), { loading: () => <ToolLoadingSkeleton />, ssr: false })
const SvgOptimizer = dynamic(() => import('@/components/tools/media/svg-optimizer'), { loading: () => <ToolLoadingSkeleton />, ssr: false })
const MergePdfs = dynamic(() => import('@/components/tools/media/merge-pdfs'), { loading: () => <ToolLoadingSkeleton />, ssr: false })
const SplitPdf = dynamic(() => import('@/components/tools/media/split-pdf'), { loading: () => <ToolLoadingSkeleton />, ssr: false })
const RotatePdf = dynamic(() => import('@/components/tools/media/rotate-pdf'), { loading: () => <ToolLoadingSkeleton />, ssr: false })
const ExtractPdfPages = dynamic(() => import('@/components/tools/media/extract-pdf-pages'), { loading: () => <ToolLoadingSkeleton />, ssr: false })
const CompressPdf = dynamic(() => import('@/components/tools/media/compress-pdf'), { loading: () => <ToolLoadingSkeleton />, ssr: false })
const PdfToImages = dynamic(() => import('@/components/tools/media/pdf-to-images'), { loading: () => <ToolLoadingSkeleton />, ssr: false })
const ImagesToPdf = dynamic(() => import('@/components/tools/media/images-to-pdf'), { loading: () => <ToolLoadingSkeleton />, ssr: false })
const PdfMetadataViewer = dynamic(() => import('@/components/tools/media/pdf-metadata-viewer'), { loading: () => <ToolLoadingSkeleton />, ssr: false })
const FileChecksum = dynamic(() => import('@/components/tools/media/file-checksum'), { loading: () => <ToolLoadingSkeleton />, ssr: false })
const FileSignatureInspector = dynamic(() => import('@/components/tools/media/file-signature-inspector'), { loading: () => <ToolLoadingSkeleton />, ssr: false })
const ImageMetadataViewer = dynamic(() => import('@/components/tools/media/image-metadata-viewer'), { loading: () => <ToolLoadingSkeleton />, ssr: false })
const FontAccessibilityChecker = dynamic(() => import('@/components/tools/media/font-accessibility-checker'), { loading: () => <ToolLoadingSkeleton />, ssr: false })
const PngToWebp = dynamic(() => import('@/components/tools/media/png-to-webp'), { loading: () => <ToolLoadingSkeleton />, ssr: false })
const CssMinifier = dynamic(() => import('@/components/tools/developer/css-minifier'), { loading: () => <ToolLoadingSkeleton />, ssr: false })
const JsMinifier = dynamic(() => import('@/components/tools/developer/js-minifier'), { loading: () => <ToolLoadingSkeleton />, ssr: false })
const HtmlMinifier = dynamic(() => import('@/components/tools/developer/html-minifier'), { loading: () => <ToolLoadingSkeleton />, ssr: false })
const RemoveDuplicateWords = dynamic(() => import('@/components/tools/text/remove-duplicate-words'), { loading: () => <ToolLoadingSkeleton />, ssr: false })
const TipCalculator = dynamic(() => import('@/components/tools/finance/tip-calculator'), { loading: () => <ToolLoadingSkeleton />, ssr: false })

// Developer

// Text

// Finance

// SEO

// Security

// Network

// Media

// Misc

export const tools: Tool[] = [
  // Developer
  { slug: 'json-formatter', category: 'developer', name: 'JSON Formatter', description: 'Format, validate, and minify JSON with inline error reporting.', keywords: ['json', 'format', 'beautify', 'minify', 'validate'], Component: JsonFormatter },
  { slug: 'json-yaml-converter', category: 'developer', name: 'JSON ↔ YAML Converter', description: 'Convert between JSON and YAML formats bidirectionally.', keywords: ['json', 'yaml', 'convert', 'config'], Component: JsonYamlConverter },
  { slug: 'xml-formatter', category: 'developer', name: 'XML Formatter', description: 'Pretty-print and minify XML with validation.', keywords: ['xml', 'format', 'beautify', 'minify'], Component: XmlFormatter },
  { slug: 'base64-encoder-decoder', category: 'developer', name: 'Base64 Encoder / Decoder', description: 'Encode text to Base64 or decode Base64 to text with UTF-8 support.', keywords: ['base64', 'encode', 'decode', 'utf8'], Component: Base64EncoderDecoder },
  { slug: 'uuid-generator', category: 'developer', name: 'UUID Generator', description: 'Generate RFC 4122 v4 UUIDs in bulk using the Web Crypto API.', keywords: ['uuid', 'guid', 'crypto', 'random'], Component: UuidGenerator },
  { slug: 'hash-generator', category: 'developer', name: 'Hash Generator', description: 'Generate SHA-1, SHA-256, SHA-384, SHA-512 hashes via Web Crypto.', keywords: ['hash', 'sha', 'sha256', 'sha512', 'digest'], Component: HashGenerator },
  { slug: 'hmac-generator', category: 'developer', name: 'HMAC Generator', description: 'Generate HMAC signatures (SHA-256/384/512) for a message and secret.', keywords: ['hmac', 'signature', 'sha256', 'secret'], Component: HmacGenerator },
  { slug: 'jwt-decoder', category: 'developer', name: 'JWT Decoder', description: 'Decode and inspect JSON Web Token header and payload.', keywords: ['jwt', 'token', 'decode', 'auth'], Component: JwtDecoder },
  { slug: 'jwt-generator', category: 'developer', name: 'JWT Generator', description: 'Generate signed JSON Web Tokens (HS256) with custom claims.', keywords: ['jwt', 'token', 'generate', 'sign', 'hs256'], Component: JwtGenerator },
  { slug: 'regex-tester', category: 'developer', name: 'Regex Tester', description: 'Test regular expressions with live match highlighting and flags.', keywords: ['regex', 'regexp', 'test', 'match', 'pattern'], Component: RegexTester },
  { slug: 'url-encoder-decoder', category: 'developer', name: 'URL Encoder / Decoder', description: 'Encode or decode URL components and full URLs.', keywords: ['url', 'encode', 'decode', 'uri', 'percent'], Component: UrlEncoderDecoder },
  { slug: 'unix-timestamp-converter', category: 'developer', name: 'Unix Timestamp Converter', description: 'Convert between Unix timestamps and human-readable dates.', keywords: ['unix', 'timestamp', 'epoch', 'date', 'time'], Component: UnixTimestampConverter },
  { slug: 'color-converter', category: 'developer', name: 'Color Converter', description: 'Convert colors between HEX, RGB, HSL with a live preview.', keywords: ['color', 'hex', 'rgb', 'hsl', 'convert'], Component: ColorConverter },
  { slug: 'html-entity-encoder', category: 'developer', name: 'HTML Entity Encoder', description: 'Encode or decode HTML entities in text.', keywords: ['html', 'entity', 'encode', 'decode', 'escape'], Component: HtmlEntityEncoder },
  { slug: 'sql-formatter', category: 'developer', name: 'SQL Formatter', description: 'Pretty-print and format SQL queries with keyword casing.', keywords: ['sql', 'format', 'query', 'pretty', 'database'], Component: SqlFormatter },
  { slug: 'markdown-to-html', category: 'developer', name: 'Markdown to HTML', description: 'Convert markdown to raw HTML source for emails and static sites.', keywords: ['markdown', 'html', 'convert', 'gfm', 'static'], Component: MarkdownToHtml },
  { slug: 'text-compare-diff', category: 'developer', name: 'Text Diff', description: 'Compare text at line, word, or character level with unified diff output.', keywords: ['diff', 'compare', 'line', 'word', 'character', 'unified'], Component: TextCompareDiff },
  { slug: 'cron-expression-generator', category: 'developer', name: 'Cron Expression Generator', description: 'Build cron schedules visually and preview next run times.', keywords: ['cron', 'schedule', 'crontab', 'job', 'timer'], Component: CronExpressionGenerator },
  { slug: 'diff-checker', category: 'developer', name: 'Diff Checker', description: 'Compare two texts line-by-line with a color-coded LCS diff.', keywords: ['diff', 'compare', 'text', 'lcs', 'changes'], Component: DiffChecker },
  { slug: 'markdown-preview', category: 'developer', name: 'Markdown Preview', description: 'Write Markdown and see a live rendered HTML preview.', keywords: ['markdown', 'md', 'preview', 'render', 'html'], Component: MarkdownPreview },
  { slug: 'css-minifier', category: 'developer', name: 'CSS Minifier', description: 'Minify CSS by removing comments, whitespace, and empty rules.', keywords: ['css', 'minify', 'compress', 'optimize', 'styles'], Component: CssMinifier },
  { slug: 'js-minifier', category: 'developer', name: 'JS Minifier', description: 'Minify JavaScript by removing comments and unnecessary whitespace.', keywords: ['javascript', 'js', 'minify', 'compress', 'optimize'], Component: JsMinifier },
  { slug: 'html-minifier', category: 'developer', name: 'HTML Minifier', description: 'Minify HTML by removing comments, whitespace, and empty attributes.', keywords: ['html', 'minify', 'compress', 'optimize', 'markup'], Component: HtmlMinifier },

  // Text
  { slug: 'word-counter', category: 'text', name: 'Word Counter', description: 'Count words, characters, sentences, and reading time.', keywords: ['word', 'count', 'character', 'reading', 'time'], Component: WordCounter },
  { slug: 'character-counter', category: 'text', name: 'Character Counter', description: 'Count characters with and without spaces, lines, and bytes.', keywords: ['character', 'count', 'bytes', 'lines', 'twitter'], Component: CharacterCounter },
  { slug: 'case-converter', category: 'text', name: 'Case Converter', description: 'Convert text to UPPER, lower, Title, camelCase, snake_case, kebab-case.', keywords: ['case', 'uppercase', 'lowercase', 'camel', 'snake', 'kebab'], Component: CaseConverter },
  { slug: 'slug-generator', category: 'text', name: 'Slug Generator', description: 'Generate URL-safe slugs from any text.', keywords: ['slug', 'url', 'permalink', 'seo'], Component: SlugGenerator },
  { slug: 'lorem-ipsum-generator', category: 'text', name: 'Lorem Ipsum Generator', description: 'Generate placeholder Lorem Ipsum paragraphs, sentences, or words.', keywords: ['lorem', 'ipsum', 'placeholder', 'dummy', 'text'], Component: LoremIpsumGenerator },
  { slug: 'text-sorter', category: 'text', name: 'Text Sorter', description: 'Sort lines alphabetically, numerically, or by length.', keywords: ['sort', 'lines', 'order', 'alphabetical'], Component: TextSorter },
  { slug: 'remove-blank-lines', category: 'text', name: 'Remove Blank Lines', description: 'Strip empty lines and optionally trim whitespace from text.', keywords: ['blank', 'empty', 'lines', 'trim', 'clean'], Component: RemoveBlankLines },
  { slug: 'duplicate-line-remover', category: 'text', name: 'Duplicate Line Remover', description: 'Remove duplicate lines, optionally case-insensitive.', keywords: ['duplicate', 'lines', 'unique', 'dedupe'], Component: DuplicateLineRemover },
  { slug: 'reading-time-calculator', category: 'text', name: 'Reading Time Calculator', description: 'Estimate reading and speaking time at multiple speeds.', keywords: ['reading', 'time', 'speaking', 'words', 'wpm'], Component: ReadingTimeCalculator },
  { slug: 'unicode-inspector', category: 'text', name: 'Unicode Inspector', description: 'Inspect every character: code point, name, UTF-8 bytes, category.', keywords: ['unicode', 'character', 'codepoint', 'utf8', 'inspect'], Component: UnicodeInspector },
  { slug: 'capitalization-tool', category: 'text', name: 'Capitalization Tool', description: 'Capitalize words, sentences, and titles with AP-style rules.', keywords: ['capitalize', 'capitalization', 'title', 'case', 'sentence'], Component: CapitalizationTool },
  { slug: 'text-compare', category: 'text', name: 'Text Compare', description: 'Compare two texts word-by-word with a color-coded inline diff.', keywords: ['text', 'compare', 'diff', 'words', 'changes'], Component: TextCompare },
  { slug: 'remove-duplicate-words', category: 'text', name: 'Remove Duplicate Words', description: 'Remove duplicate words from text while preserving order.', keywords: ['duplicate', 'words', 'unique', 'dedupe', 'text'], Component: RemoveDuplicateWords },

  // Finance
  { slug: 'percentage-calculator', category: 'finance', name: 'Percentage Calculator', description: 'Calculate percentages, increases, decreases, and ratios.', keywords: ['percentage', 'percent', 'increase', 'decrease'], Component: PercentageCalculator },
  { slug: 'bmi-calculator', category: 'finance', name: 'BMI Calculator', description: 'Calculate Body Mass Index with metric and imperial units.', keywords: ['bmi', 'body', 'mass', 'health', 'weight'], Component: BmiCalculator },
  { slug: 'vat-calculator', category: 'finance', name: 'VAT Calculator', description: 'Add or remove VAT from a price at any rate, with live results.', keywords: ['vat', 'tax', 'price', 'sales'], Component: VatCalculator },
  { slug: 'loan-calculator', category: 'finance', name: 'Loan Calculator', description: 'Calculate monthly payments, total interest, and amortization.', keywords: ['loan', 'payment', 'interest', 'amortization'], Component: LoanCalculator },
  { slug: 'mortgage-calculator', category: 'finance', name: 'Mortgage Calculator', description: 'Estimate monthly mortgage payments with taxes and insurance.', keywords: ['mortgage', 'home', 'payment', 'piti'], Component: MortgageCalculator },
  { slug: 'compound-interest-calculator', category: 'finance', name: 'Compound Interest Calculator', description: 'Project compound interest growth over time.', keywords: ['compound', 'interest', 'investment', 'growth'], Component: CompoundInterestCalculator },
  { slug: 'gpa-calculator', category: 'finance', name: 'GPA Calculator', description: 'Calculate grade point average across courses with weight.', keywords: ['gpa', 'grade', 'school', 'college', 'courses'], Component: GpaCalculator },
  { slug: 'currency-converter', category: 'finance', name: 'Currency Converter', description: 'Convert between currencies using bundled static reference rates.', keywords: ['currency', 'convert', 'exchange', 'money'], Component: CurrencyConverter },
  { slug: 'body-fat-calculator', category: 'finance', name: 'Body Fat Calculator', description: 'Estimate body fat percentage via the U.S. Navy method.', keywords: ['body', 'fat', 'navy', 'health', 'fitness'], Component: BodyFatCalculator },
  { slug: 'unit-converter', category: 'finance', name: 'Unit Converter', description: 'Convert length, weight, temperature, and data units.', keywords: ['unit', 'convert', 'length', 'weight', 'temperature'], Component: UnitConverter },
  { slug: 'invoice-generator', category: 'finance', name: 'Invoice Generator', description: 'Build a printable invoice with line items, tax, and totals.', keywords: ['invoice', 'billing', 'printable', 'pdf', 'business'], Component: InvoiceGenerator },
  { slug: 'bmr-calculator', category: 'finance', name: 'BMR Calculator', description: 'Calculate Basal Metabolic Rate with the Mifflin-St Jeor formula.', keywords: ['bmr', 'metabolism', 'calories', 'health', 'fitness'], Component: BmrCalculator },
  { slug: 'tdee-calculator', category: 'finance', name: 'TDEE Calculator', description: 'Estimate Total Daily Energy Expenditure from BMR and activity.', keywords: ['tdee', 'calories', 'energy', 'activity', 'fitness'], Component: TdeeCalculator },
  { slug: 'calorie-calculator', category: 'finance', name: 'Calorie Calculator', description: 'Compute daily calorie needs and macro targets for any goal.', keywords: ['calorie', 'diet', 'macros', 'weight', 'nutrition'], Component: CalorieCalculator },
  { slug: 'macro-calculator', category: 'finance', name: 'Macro Calculator', description: 'Split daily calories into protein, carbs, and fat by diet type.', keywords: ['macro', 'protein', 'carbs', 'fat', 'diet'], Component: MacroCalculator },
  { slug: 'water-intake-calculator', category: 'finance', name: 'Water Intake Calculator', description: 'Estimate daily water needs based on weight, activity, and climate.', keywords: ['water', 'hydration', 'intake', 'health'], Component: WaterIntakeCalculator },
  { slug: 'retirement-calculator', category: 'finance', name: 'Retirement Calculator', description: 'Project retirement savings growth with contributions and inflation.', keywords: ['retirement', 'savings', 'investment', 'pension', 'future'], Component: RetirementCalculator },
  { slug: 'roi-calculator', category: 'finance', name: 'ROI Calculator', description: 'Calculate return on investment, annualized ROI, and CAGR.', keywords: ['roi', 'return', 'investment', 'cagr', 'profit'], Component: RoiCalculator },
  { slug: 'savings-calculator', category: 'finance', name: 'Savings Calculator', description: 'Project savings growth with regular contributions and compounding.', keywords: ['savings', 'interest', 'compound', 'growth', 'money'], Component: SavingsCalculator },
  { slug: 'break-even-calculator', category: 'finance', name: 'Break-Even Calculator', description: 'Find the break-even point in units and revenue for a product.', keywords: ['break-even', 'business', 'margin', 'units', 'revenue'], Component: BreakEvenCalculator },
  { slug: 'profit-margin-calculator', category: 'finance', name: 'Profit Margin Calculator', description: 'Calculate profit margin, markup, and reverse-engineer costs.', keywords: ['profit', 'margin', 'markup', 'revenue', 'business'], Component: ProfitMarginCalculator },
  { slug: 'inflation-calculator', category: 'finance', name: 'Inflation Calculator', description: 'See how inflation erodes purchasing power over time.', keywords: ['inflation', 'purchasing', 'power', 'money', 'economics'], Component: InflationCalculator },
  { slug: 'grade-calculator', category: 'finance', name: 'Grade Calculator', description: 'Compute weighted final grades from assignments and weights.', keywords: ['grade', 'calculator', 'school', 'assignment', 'weighted'], Component: GradeCalculator },
  { slug: 'quote-generator', category: 'finance', name: 'Quote Generator', description: 'Generate inspirational quotes and download them as shareable images.', keywords: ['quote', 'inspiration', 'motivation', 'image', 'share'], Component: QuoteGenerator },
  { slug: 'flashcard-generator', category: 'finance', name: 'Flashcard Generator', description: 'Build, study, and export flashcard decks with a flip mode.', keywords: ['flashcard', 'study', 'learn', 'memory', 'cards'], Component: FlashcardGenerator },
  { slug: 'citation-generator', category: 'finance', name: 'Citation Generator', description: 'Generate APA, MLA, and Chicago citations for books and sites.', keywords: ['citation', 'apa', 'mla', 'chicago', 'reference'], Component: CitationGenerator },
  { slug: 'invoice-number-generator', category: 'finance', name: 'Invoice Number Generator', description: 'Generate sequential, padded invoice numbers with optional date prefix.', keywords: ['invoice', 'number', 'sequential', 'business', 'billing'], Component: InvoiceNumberGenerator },
  { slug: 'study-planner', category: 'finance', name: 'Study Planner', description: 'Plan a study schedule across subjects before an exam date.', keywords: ['study', 'planner', 'schedule', 'exam', 'time'], Component: StudyPlanner },
  { slug: 'tip-calculator', category: 'finance', name: 'Tip Calculator', description: 'Calculate tips and split bills with quick-percentage presets.', keywords: ['tip', 'calculator', 'bill', 'split', 'restaurant'], Component: TipCalculator },

  // SEO
  { slug: 'meta-tag-generator', category: 'seo', name: 'Meta Tag Generator', description: 'Generate SEO meta tags, Open Graph, and Twitter cards.', keywords: ['meta', 'tags', 'og', 'twitter', 'seo'], Component: MetaTagGenerator },
  { slug: 'title-generator', category: 'seo', name: 'Title Generator', description: 'Generate SEO-optimized page titles from keywords.', keywords: ['title', 'seo', 'headline', 'page'], Component: TitleGenerator },
  { slug: 'cta-generator', category: 'seo', name: 'CTA Generator', description: 'Generate call-to-action button copy and variations.', keywords: ['cta', 'call', 'action', 'copy', 'button'], Component: CtaGenerator },
  { slug: 'robots-txt-generator', category: 'seo', name: 'Robots.txt Generator', description: 'Build a robots.txt with rules for bots and sitemaps.', keywords: ['robots', 'txt', 'crawler', 'spider', 'seo'], Component: RobotsTxtGenerator },
  { slug: 'sitemap-generator', category: 'seo', name: 'Sitemap Generator', description: 'Generate an XML sitemap from a list of URLs.', keywords: ['sitemap', 'xml', 'urls', 'seo'], Component: SitemapGenerator },
  { slug: 'json-ld-generator', category: 'seo', name: 'JSON-LD Generator', description: 'Generate JSON-LD structured data (Article, Product, FAQ, etc.).', keywords: ['json-ld', 'schema', 'structured', 'data', 'rich'], Component: JsonLdGenerator },
  { slug: 'open-graph-preview', category: 'seo', name: 'Open Graph Preview', description: 'Preview how a page renders as an Open Graph social card.', keywords: ['open', 'graph', 'og', 'preview', 'social'], Component: OpenGraphPreview },
  { slug: 'headline-analyzer', category: 'seo', name: 'Headline Analyzer', description: 'Score a headline for length, power words, and sentiment.', keywords: ['headline', 'analyzer', 'score', 'seo', 'title'], Component: HeadlineAnalyzer },
  { slug: 'keyword-density-checker', category: 'seo', name: 'Keyword Density Checker', description: 'Analyze keyword frequency and density in body text.', keywords: ['keyword', 'density', 'frequency', 'seo', 'content'], Component: KeywordDensityChecker },
  { slug: 'email-signature-generator', category: 'seo', name: 'Email Signature Generator', description: 'Design professional HTML email signatures with live preview.', keywords: ['email', 'signature', 'html', 'outlook', 'gmail'], Component: EmailSignatureGenerator },
  { slug: 'campaign-url-builder', category: 'seo', name: 'Campaign URL Builder', description: 'Build tagged campaign URLs with custom parameters and presets.', keywords: ['campaign', 'url', 'utm', 'tracking', 'marketing'], Component: CampaignUrlBuilder },
  { slug: 'qr-campaign-generator', category: 'seo', name: 'QR Campaign Generator', description: 'Generate QR codes with UTM tracking for offline campaigns.', keywords: ['qr', 'campaign', 'utm', 'offline', 'marketing'], Component: QrCampaignGenerator },
  { slug: 'utm-builder', category: 'seo', name: 'UTM Builder', description: 'Build UTM-tagged campaign URLs with live preview and presets.', keywords: ['utm', 'campaign', 'url', 'tracking', 'marketing'], Component: UtmBuilder },
  { slug: 'faq-generator', category: 'seo', name: 'FAQ Generator', description: 'Build FAQ sections with HTML markup and FAQPage JSON-LD schema.', keywords: ['faq', 'questions', 'schema', 'json-ld', 'seo'], Component: FaqGenerator },
  { slug: 'twitter-card-preview', category: 'seo', name: 'Twitter Card Preview', description: 'Preview how a page renders as a Twitter/X card with meta tags.', keywords: ['twitter', 'card', 'preview', 'social', 'x'], Component: TwitterCardPreview },
  { slug: 'breadcrumb-schema-generator', category: 'seo', name: 'Breadcrumb Schema Generator', description: 'Generate BreadcrumbList JSON-LD for navigation trails.', keywords: ['breadcrumb', 'schema', 'json-ld', 'navigation', 'seo'], Component: BreadcrumbSchemaGenerator },
  { slug: 'organization-schema-generator', category: 'seo', name: 'Organization Schema Generator', description: 'Generate Organization JSON-LD with address and social profiles.', keywords: ['organization', 'schema', 'json-ld', 'business', 'seo'], Component: OrganizationSchemaGenerator },
  { slug: 'canonical-url-checker', category: 'seo', name: 'Canonical URL Checker', description: 'Normalize URLs and generate the canonical link tag.', keywords: ['canonical', 'url', 'normalize', 'seo', 'duplicate'], Component: CanonicalUrlChecker },
  { slug: 'blog-outline-generator', category: 'seo', name: 'Blog Outline Generator', description: 'Generate structured blog outlines with sections and word budgets.', keywords: ['blog', 'outline', 'content', 'writing', 'structure'], Component: BlogOutlineGenerator },

  // Security
  { slug: 'password-generator', category: 'security', name: 'Password Generator', description: 'Generate strong passwords with Web Crypto and a strength meter.', keywords: ['password', 'generate', 'crypto', 'secure', 'random'], Component: PasswordGenerator },
  { slug: 'secure-passphrase-generator', category: 'security', name: 'Secure Passphrase Generator', description: 'Generate cryptographically secure passphrases from a word list.', keywords: ['passphrase', 'diceware', 'secure', 'words'], Component: SecurePassphraseGenerator },
  { slug: 'password-strength-checker', category: 'security', name: 'Password Strength Checker', description: 'Estimate password entropy and crack time honestly.', keywords: ['password', 'strength', 'entropy', 'crack', 'check'], Component: PasswordStrengthChecker },
  { slug: 'csp-generator', category: 'security', name: 'CSP Generator', description: 'Build a Content-Security-Policy header with toggles per directive.', keywords: ['csp', 'content', 'security', 'policy', 'header'], Component: CspGenerator },

  // Network
  { slug: 'dns-lookup', category: 'network', name: 'DNS Lookup', description: 'Query DNS records (A, AAAA, MX, TXT, NS, and more) for any domain.', keywords: ['dns', 'lookup', 'domain', 'records', 'network'], Component: DnsLookup },
  { slug: 'ip-lookup', category: 'network', name: 'IP Lookup', description: 'Geolocate an IP address with city, region, country, and ISP.', keywords: ['ip', 'lookup', 'geolocation', 'network', 'isp'], Component: IpLookup },
  { slug: 'http-header-checker', category: 'network', name: 'HTTP Header Checker', description: 'Inspect HTTP response headers and spot security headers.', keywords: ['http', 'headers', 'response', 'security', 'network'], Component: HttpHeaderChecker },
  { slug: 'ssl-checker', category: 'network', name: 'SSL Checker', description: 'Inspect a site\u2019s TLS certificate: issuer, validity, expiry days.', keywords: ['ssl', 'tls', 'certificate', 'https', 'security'], Component: SslChecker },
  { slug: 'ping-tool', category: 'network', name: 'Ping Tool', description: 'Measure HTTP latency (TTFB) to any URL with 1 or 3 pings.', keywords: ['ping', 'latency', 'ttfb', 'network', 'speed'], Component: PingTool },
  { slug: 'redirect-checker', category: 'network', name: 'Redirect Checker', description: 'Trace the full HTTP redirect chain for any URL.', keywords: ['redirect', 'chain', 'http', '301', '302', 'network'], Component: RedirectChecker },
  { slug: 'user-agent-parser', category: 'network', name: 'User-Agent Parser', description: 'Parse a user-agent string into browser, OS, and device.', keywords: ['user', 'agent', 'ua', 'browser', 'os', 'device'], Component: UserAgentParser },

  // Media
  { slug: 'qr-generator', category: 'media', name: 'QR Generator', description: 'Generate downloadable QR codes for any text or URL.', keywords: ['qr', 'code', 'barcode', 'url'], Component: QrGenerator },
  { slug: 'color-palette-extractor', category: 'media', name: 'Color Palette Extractor', description: 'Extract a dominant color palette from an uploaded image.', keywords: ['color', 'palette', 'extract', 'image', 'swatches'], Component: ColorPaletteExtractor },
  { slug: 'color-contrast-checker', category: 'media', name: 'Color Contrast Checker', description: 'Check WCAG color contrast ratios between two colors.', keywords: ['color', 'contrast', 'wcag', 'accessibility', 'ratio'], Component: ColorContrastChecker },
  { slug: 'image-compressor', category: 'media', name: 'Image Compressor', description: 'Compress images client-side with an adjustable quality slider.', keywords: ['image', 'compress', 'optimize', 'jpeg', 'webp'], Component: ImageCompressor },
  { slug: 'image-resizer', category: 'media', name: 'Image Resizer', description: 'Resize images to custom dimensions and download.', keywords: ['image', 'resize', 'scale', 'dimensions'], Component: ImageResizer },
  { slug: 'favicon-generator', category: 'media', name: 'Favicon Generator', description: 'Generate favicon PNGs in multiple sizes from an image or text.', keywords: ['favicon', 'icon', 'logo', 'browser'], Component: FaviconGenerator },
  { slug: 'social-image-generator', category: 'media', name: 'Social Image Generator', description: 'Design and export social share images on a canvas.', keywords: ['social', 'image', 'og', 'share', 'canvas'], Component: SocialImageGenerator },
  { slug: 'css-gradient-generator', category: 'media', name: 'CSS Gradient Generator', description: 'Design multi-stop CSS gradients with live preview and copy CSS.', keywords: ['css', 'gradient', 'linear', 'radial', 'design'], Component: CssGradientGenerator },
  { slug: 'svg-viewer', category: 'media', name: 'SVG Viewer', description: 'Preview SVG markup with stats, zoom, and background options.', keywords: ['svg', 'viewer', 'preview', 'vector', 'image'], Component: SvgViewer },
  { slug: 'file-size-converter', category: 'media', name: 'File Size Converter', description: 'Convert between bytes, KB, MB, GB, TB, and PB (1024-base).', keywords: ['file', 'size', 'convert', 'bytes', 'kb', 'mb'], Component: FileSizeConverter },
  { slug: 'alt-text-generator', category: 'media', name: 'Alt Text Generator', description: 'Generate accessible alt text suggestions with WCAG guidance.', keywords: ['alt', 'text', 'accessibility', 'wcag', 'image'], Component: AltTextGenerator },
  { slug: 'svg-optimizer', category: 'media', name: 'SVG Optimizer', description: 'Optimize SVG markup by removing comments, metadata, and whitespace.', keywords: ['svg', 'optimize', 'minify', 'clean', 'vector'], Component: SvgOptimizer },
  { slug: 'mime-detector', category: 'media', name: 'MIME Type Detector', description: 'Detect MIME types from file extensions or uploaded files.', keywords: ['mime', 'type', 'file', 'extension', 'detect'], Component: MimeDetector },
  { slug: 'file-hash', category: 'media', name: 'File Hash Calculator', description: 'Compute SHA-1, SHA-256, SHA-384, SHA-512 hashes of any file.', keywords: ['file', 'hash', 'sha256', 'sha512', 'checksum'], Component: FileHash },
  { slug: 'aria-validator', category: 'media', name: 'ARIA Validator', description: 'Check HTML for accessibility and ARIA issues with fix suggestions.', keywords: ['aria', 'accessibility', 'html', 'wcag', 'validate'], Component: AriaValidator },
  { slug: 'merge-pdfs', category: 'media', name: 'Merge PDFs', description: 'Combine multiple PDF files into one with reordering.', keywords: ['pdf', 'merge', 'combine', 'join', 'documents'], Component: MergePdfs },
  { slug: 'split-pdf', category: 'media', name: 'Split PDF', description: 'Split a PDF into individual pages, ranges, or fixed-size chunks.', keywords: ['pdf', 'split', 'divide', 'pages', 'extract'], Component: SplitPdf },
  { slug: 'rotate-pdf', category: 'media', name: 'Rotate PDF', description: 'Rotate all or specific pages of a PDF by 90, 180, or 270 degrees.', keywords: ['pdf', 'rotate', 'orientation', 'pages', 'degrees'], Component: RotatePdf },
  { slug: 'extract-pdf-pages', category: 'media', name: 'Extract PDF Pages', description: 'Extract specific pages from a PDF into a new document.', keywords: ['pdf', 'extract', 'pages', 'select', 'subset'], Component: ExtractPdfPages },
  { slug: 'compress-pdf', category: 'media', name: 'Compress PDF', description: 'Reduce PDF size by stripping metadata and optimizing object streams.', keywords: ['pdf', 'compress', 'optimize', 'reduce', 'size'], Component: CompressPdf },
  { slug: 'pdf-to-images', category: 'media', name: 'PDF to Images', description: 'Render PDF pages to PNG images and inspect PDF structure.', keywords: ['pdf', 'images', 'render', 'png', 'convert'], Component: PdfToImages },
  { slug: 'images-to-pdf', category: 'media', name: 'Images to PDF', description: 'Convert PNG and JPEG images into a single PDF document.', keywords: ['images', 'pdf', 'convert', 'png', 'jpeg'], Component: ImagesToPdf },
  { slug: 'pdf-metadata-viewer', category: 'media', name: 'PDF Metadata Viewer', description: 'View PDF metadata, page sizes, and document properties.', keywords: ['pdf', 'metadata', 'properties', 'info', 'inspect'], Component: PdfMetadataViewer },
  { slug: 'file-checksum', category: 'media', name: 'File Checksum', description: 'Compute CRC32, MD5, SHA-1, SHA-256, SHA-512 checksums of any file.', keywords: ['checksum', 'crc32', 'md5', 'sha256', 'hash', 'file'], Component: FileChecksum },
  { slug: 'file-signature-inspector', category: 'media', name: 'File Signature Inspector', description: 'Identify file types by their magic bytes (hex signatures).', keywords: ['file', 'signature', 'magic', 'bytes', 'identify'], Component: FileSignatureInspector },
  { slug: 'image-metadata-viewer', category: 'media', name: 'Image Metadata Viewer', description: 'Extract and view EXIF metadata from JPEG and TIFF images.', keywords: ['image', 'exif', 'metadata', 'camera', 'gps'], Component: ImageMetadataViewer },
  { slug: 'font-accessibility-checker', category: 'media', name: 'Font Accessibility Checker', description: 'Check font sizes, line height, and spacing against WCAG guidelines.', keywords: ['font', 'accessibility', 'wcag', 'typography', 'readable'], Component: FontAccessibilityChecker },
  { slug: 'png-to-webp', category: 'media', name: 'PNG to WebP', description: 'Convert PNG images to WebP with adjustable quality and savings.', keywords: ['png', 'webp', 'convert', 'image', 'compress'], Component: PngToWebp },

  // Misc
  { slug: 'token-counter', category: 'misc', name: 'Token Counter', description: 'Estimate token counts for text (rough LLM tokenizer heuristic).', keywords: ['token', 'count', 'llm', 'gpt', 'ai', 'cost'], Component: TokenCounter },
  { slug: 'ai-cost-calculator', category: 'misc', name: 'AI Cost Calculator', description: 'Estimate LLM API costs across models for any usage volume.', keywords: ['ai', 'cost', 'llm', 'api', 'gpt', 'pricing'], Component: AiCostCalculator },
  { slug: 'prompt-optimizer', category: 'misc', name: 'Prompt Optimizer', description: 'Score and improve LLM prompts with actionable suggestions.', keywords: ['prompt', 'optimize', 'llm', 'ai', 'improve'], Component: PromptOptimizer },
  { slug: 'prompt-variable-replacer', category: 'misc', name: 'Prompt Variable Replacer', description: 'Fill {{variables}} in prompt templates with live preview.', keywords: ['prompt', 'variable', 'template', 'replace', 'llm'], Component: PromptVariableReplacer },
  { slug: 'system-prompt-generator', category: 'misc', name: 'System Prompt Generator', description: 'Build structured system prompts for LLMs with presets.', keywords: ['system', 'prompt', 'llm', 'ai', 'generator'], Component: SystemPromptGenerator },
  { slug: 'ai-persona-generator', category: 'misc', name: 'AI Persona Generator', description: 'Design detailed AI personas with traits and system prompts.', keywords: ['ai', 'persona', 'character', 'llm', 'profile'], Component: AiPersonaGenerator },
  { slug: 'prompt-library', category: 'misc', name: 'Prompt Library', description: 'Browse, save, and manage curated LLM prompts with import/export.', keywords: ['prompt', 'library', 'collection', 'llm', 'save'], Component: PromptLibrary },
  { slug: 'prompt-version-manager', category: 'misc', name: 'Prompt Version Manager', description: 'Track prompt versions with diff, restore, and export.', keywords: ['prompt', 'version', 'history', 'diff', 'restore'], Component: PromptVersionManager },
  { slug: 'ai-workflow-builder', category: 'misc', name: 'AI Workflow Builder', description: 'Design multi-step AI workflows with a visual flow diagram.', keywords: ['ai', 'workflow', 'pipeline', 'steps', 'design'], Component: AiWorkflowBuilder },
]

export const toolsBySlug = new Map(tools.map((t) => [t.slug, t]))

/**
 * Raw dynamic-import functions per tool slug, for preload-on-hover.
 * When a user hovers a tool card, we fire the importer so the chunk
 * is fetched before they click — making the tool open instantly.
 */
export const toolImporters: Record<string, () => Promise<unknown>> = {
  'json-formatter': () => import('@/components/tools/developer/json-formatter'),
  'json-yaml-converter': () => import('@/components/tools/developer/json-yaml-converter'),
  'xml-formatter': () => import('@/components/tools/developer/xml-formatter'),
  'base64-encoder-decoder': () => import('@/components/tools/developer/base64-encoder-decoder'),
  'uuid-generator': () => import('@/components/tools/developer/uuid-generator'),
  'hash-generator': () => import('@/components/tools/developer/hash-generator'),
  'hmac-generator': () => import('@/components/tools/developer/hmac-generator'),
  'jwt-decoder': () => import('@/components/tools/developer/jwt-decoder'),
  'jwt-generator': () => import('@/components/tools/developer/jwt-generator'),
  'regex-tester': () => import('@/components/tools/developer/regex-tester'),
  'url-encoder-decoder': () => import('@/components/tools/developer/url-encoder-decoder'),
  'unix-timestamp-converter': () => import('@/components/tools/developer/unix-timestamp-converter'),
  'color-converter': () => import('@/components/tools/developer/color-converter'),
  'html-entity-encoder': () => import('@/components/tools/developer/html-entity-encoder'),
  'sql-formatter': () => import('@/components/tools/developer/sql-formatter'),
  'markdown-to-html': () => import('@/components/tools/developer/markdown-to-html'),
  'text-compare-diff': () => import('@/components/tools/developer/text-compare-diff'),
  'cron-expression-generator': () => import('@/components/tools/developer/cron-expression-generator'),
  'diff-checker': () => import('@/components/tools/developer/diff-checker'),
  'markdown-preview': () => import('@/components/tools/developer/markdown-preview'),
  'css-minifier': () => import('@/components/tools/developer/css-minifier'),
  'js-minifier': () => import('@/components/tools/developer/js-minifier'),
  'html-minifier': () => import('@/components/tools/developer/html-minifier'),
  'word-counter': () => import('@/components/tools/text/word-counter'),
  'character-counter': () => import('@/components/tools/text/character-counter'),
  'case-converter': () => import('@/components/tools/text/case-converter'),
  'slug-generator': () => import('@/components/tools/text/slug-generator'),
  'lorem-ipsum-generator': () => import('@/components/tools/text/lorem-ipsum-generator'),
  'text-sorter': () => import('@/components/tools/text/text-sorter'),
  'remove-blank-lines': () => import('@/components/tools/text/remove-blank-lines'),
  'duplicate-line-remover': () => import('@/components/tools/text/duplicate-line-remover'),
  'reading-time-calculator': () => import('@/components/tools/text/reading-time-calculator'),
  'unicode-inspector': () => import('@/components/tools/text/unicode-inspector'),
  'capitalization-tool': () => import('@/components/tools/text/capitalization-tool'),
  'text-compare': () => import('@/components/tools/text/text-compare'),
  'remove-duplicate-words': () => import('@/components/tools/text/remove-duplicate-words'),
  'percentage-calculator': () => import('@/components/tools/finance/percentage-calculator'),
  'bmi-calculator': () => import('@/components/tools/finance/bmi-calculator'),
  'vat-calculator': () => import('@/components/tools/finance/vat-calculator'),
  'loan-calculator': () => import('@/components/tools/finance/loan-calculator'),
  'mortgage-calculator': () => import('@/components/tools/finance/mortgage-calculator'),
  'compound-interest-calculator': () => import('@/components/tools/finance/compound-interest-calculator'),
  'gpa-calculator': () => import('@/components/tools/finance/gpa-calculator'),
  'currency-converter': () => import('@/components/tools/finance/currency-converter'),
  'body-fat-calculator': () => import('@/components/tools/finance/body-fat-calculator'),
  'unit-converter': () => import('@/components/tools/finance/unit-converter'),
  'invoice-generator': () => import('@/components/tools/finance/invoice-generator'),
  'bmr-calculator': () => import('@/components/tools/finance/bmr-calculator'),
  'tdee-calculator': () => import('@/components/tools/finance/tdee-calculator'),
  'calorie-calculator': () => import('@/components/tools/finance/calorie-calculator'),
  'macro-calculator': () => import('@/components/tools/finance/macro-calculator'),
  'water-intake-calculator': () => import('@/components/tools/finance/water-intake-calculator'),
  'retirement-calculator': () => import('@/components/tools/finance/retirement-calculator'),
  'roi-calculator': () => import('@/components/tools/finance/roi-calculator'),
  'savings-calculator': () => import('@/components/tools/finance/savings-calculator'),
  'break-even-calculator': () => import('@/components/tools/finance/break-even-calculator'),
  'profit-margin-calculator': () => import('@/components/tools/finance/profit-margin-calculator'),
  'inflation-calculator': () => import('@/components/tools/finance/inflation-calculator'),
  'grade-calculator': () => import('@/components/tools/finance/grade-calculator'),
  'quote-generator': () => import('@/components/tools/finance/quote-generator'),
  'flashcard-generator': () => import('@/components/tools/finance/flashcard-generator'),
  'citation-generator': () => import('@/components/tools/finance/citation-generator'),
  'invoice-number-generator': () => import('@/components/tools/finance/invoice-number-generator'),
  'study-planner': () => import('@/components/tools/finance/study-planner'),
  'tip-calculator': () => import('@/components/tools/finance/tip-calculator'),
  'meta-tag-generator': () => import('@/components/tools/seo/meta-tag-generator'),
  'title-generator': () => import('@/components/tools/seo/title-generator'),
  'cta-generator': () => import('@/components/tools/seo/cta-generator'),
  'robots-txt-generator': () => import('@/components/tools/seo/robots-txt-generator'),
  'sitemap-generator': () => import('@/components/tools/seo/sitemap-generator'),
  'json-ld-generator': () => import('@/components/tools/seo/json-ld-generator'),
  'open-graph-preview': () => import('@/components/tools/seo/open-graph-preview'),
  'headline-analyzer': () => import('@/components/tools/seo/headline-analyzer'),
  'keyword-density-checker': () => import('@/components/tools/seo/keyword-density-checker'),
  'email-signature-generator': () => import('@/components/tools/seo/email-signature-generator'),
  'campaign-url-builder': () => import('@/components/tools/seo/campaign-url-builder'),
  'qr-campaign-generator': () => import('@/components/tools/seo/qr-campaign-generator'),
  'utm-builder': () => import('@/components/tools/seo/utm-builder'),
  'faq-generator': () => import('@/components/tools/seo/faq-generator'),
  'twitter-card-preview': () => import('@/components/tools/seo/twitter-card-preview'),
  'breadcrumb-schema-generator': () => import('@/components/tools/seo/breadcrumb-schema-generator'),
  'organization-schema-generator': () => import('@/components/tools/seo/organization-schema-generator'),
  'canonical-url-checker': () => import('@/components/tools/seo/canonical-url-checker'),
  'blog-outline-generator': () => import('@/components/tools/seo/blog-outline-generator'),
  'password-generator': () => import('@/components/tools/security/password-generator'),
  'secure-passphrase-generator': () => import('@/components/tools/security/secure-passphrase-generator'),
  'password-strength-checker': () => import('@/components/tools/security/password-strength-checker'),
  'csp-generator': () => import('@/components/tools/security/csp-generator'),
  'dns-lookup': () => import('@/components/tools/network/dns-lookup'),
  'ip-lookup': () => import('@/components/tools/network/ip-lookup'),
  'http-header-checker': () => import('@/components/tools/network/http-header-checker'),
  'ssl-checker': () => import('@/components/tools/network/ssl-checker'),
  'ping-tool': () => import('@/components/tools/network/ping-tool'),
  'redirect-checker': () => import('@/components/tools/network/redirect-checker'),
  'user-agent-parser': () => import('@/components/tools/network/user-agent-parser'),
  'qr-generator': () => import('@/components/tools/media/qr-generator'),
  'color-palette-extractor': () => import('@/components/tools/media/color-palette-extractor'),
  'color-contrast-checker': () => import('@/components/tools/media/color-contrast-checker'),
  'image-compressor': () => import('@/components/tools/media/image-compressor'),
  'image-resizer': () => import('@/components/tools/media/image-resizer'),
  'favicon-generator': () => import('@/components/tools/media/favicon-generator'),
  'social-image-generator': () => import('@/components/tools/media/social-image-generator'),
  'css-gradient-generator': () => import('@/components/tools/media/css-gradient-generator'),
  'svg-viewer': () => import('@/components/tools/media/svg-viewer'),
  'file-size-converter': () => import('@/components/tools/media/file-size-converter'),
  'alt-text-generator': () => import('@/components/tools/media/alt-text-generator'),
  'svg-optimizer': () => import('@/components/tools/media/svg-optimizer'),
  'mime-detector': () => import('@/components/tools/media/mime-detector'),
  'file-hash': () => import('@/components/tools/media/file-hash'),
  'aria-validator': () => import('@/components/tools/media/aria-validator'),
  'merge-pdfs': () => import('@/components/tools/media/merge-pdfs'),
  'split-pdf': () => import('@/components/tools/media/split-pdf'),
  'rotate-pdf': () => import('@/components/tools/media/rotate-pdf'),
  'extract-pdf-pages': () => import('@/components/tools/media/extract-pdf-pages'),
  'compress-pdf': () => import('@/components/tools/media/compress-pdf'),
  'pdf-to-images': () => import('@/components/tools/media/pdf-to-images'),
  'images-to-pdf': () => import('@/components/tools/media/images-to-pdf'),
  'pdf-metadata-viewer': () => import('@/components/tools/media/pdf-metadata-viewer'),
  'file-checksum': () => import('@/components/tools/media/file-checksum'),
  'file-signature-inspector': () => import('@/components/tools/media/file-signature-inspector'),
  'image-metadata-viewer': () => import('@/components/tools/media/image-metadata-viewer'),
  'font-accessibility-checker': () => import('@/components/tools/media/font-accessibility-checker'),
  'png-to-webp': () => import('@/components/tools/media/png-to-webp'),
  'token-counter': () => import('@/components/tools/misc/token-counter'),
  'ai-cost-calculator': () => import('@/components/tools/misc/ai-cost-calculator'),
  'prompt-optimizer': () => import('@/components/tools/misc/prompt-optimizer'),
  'prompt-variable-replacer': () => import('@/components/tools/misc/prompt-variable-replacer'),
  'system-prompt-generator': () => import('@/components/tools/misc/system-prompt-generator'),
  'ai-persona-generator': () => import('@/components/tools/misc/ai-persona-generator'),
  'prompt-library': () => import('@/components/tools/misc/prompt-library'),
  'prompt-version-manager': () => import('@/components/tools/misc/prompt-version-manager'),
  'ai-workflow-builder': () => import('@/components/tools/misc/ai-workflow-builder'),
}
