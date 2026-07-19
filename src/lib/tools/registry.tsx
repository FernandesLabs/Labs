// src/lib/tools/registry.tsx
'use client'
import type { Tool } from './types'
import dynamic from 'next/dynamic'
import { ToolLoadingSkeleton } from '@/components/hub/tool-loading-skeleton'
import { toolMetadata } from './tool-metadata'
// ──────────────────────────────────────────────────────────────
// 1. Dynamic imports – one per tool
// ──────────────────────────────────────────────────────────────
const JsonFormatter = dynamic(
  () => import('@/components/tools/developer/json-formatter'),
  { loading: () => <ToolLoadingSkeleton />, ssr: false }
)
const JsonYamlConverter = dynamic(
  () => import('@/components/tools/developer/json-yaml-converter'),
  { loading: () => <ToolLoadingSkeleton />, ssr: false }
)
const XmlFormatter = dynamic(
  () => import('@/components/tools/developer/xml-formatter'),
  { loading: () => <ToolLoadingSkeleton />, ssr: false }
)
const Base64EncoderDecoder = dynamic(
  () => import('@/components/tools/developer/base64-encoder-decoder'),
  { loading: () => <ToolLoadingSkeleton />, ssr: false }
)
const UuidGenerator = dynamic(
  () => import('@/components/tools/developer/uuid-generator'),
  { loading: () => <ToolLoadingSkeleton />, ssr: false }
)
const HashGenerator = dynamic(
  () => import('@/components/tools/developer/hash-generator'),
  { loading: () => <ToolLoadingSkeleton />, ssr: false }
)
const HmacGenerator = dynamic(
  () => import('@/components/tools/developer/hmac-generator'),
  { loading: () => <ToolLoadingSkeleton />, ssr: false }
)
const JwtDecoder = dynamic(
  () => import('@/components/tools/developer/jwt-decoder'),
  { loading: () => <ToolLoadingSkeleton />, ssr: false }
)
const JwtGenerator = dynamic(
  () => import('@/components/tools/developer/jwt-generator'),
  { loading: () => <ToolLoadingSkeleton />, ssr: false }
)
const RegexTester = dynamic(
  () => import('@/components/tools/developer/regex-tester'),
  { loading: () => <ToolLoadingSkeleton />, ssr: false }
)
const UrlEncoderDecoder = dynamic(
  () => import('@/components/tools/developer/url-encoder-decoder'),
  { loading: () => <ToolLoadingSkeleton />, ssr: false }
)
const UnixTimestampConverter = dynamic(
  () => import('@/components/tools/developer/unix-timestamp-converter'),
  { loading: () => <ToolLoadingSkeleton />, ssr: false }
)
const ColorConverter = dynamic(
  () => import('@/components/tools/developer/color-converter'),
  { loading: () => <ToolLoadingSkeleton />, ssr: false }
)
const HtmlEntityEncoder = dynamic(
  () => import('@/components/tools/developer/html-entity-encoder'),
  { loading: () => <ToolLoadingSkeleton />, ssr: false }
)
const SqlFormatter = dynamic(
  () => import('@/components/tools/developer/sql-formatter'),
  { loading: () => <ToolLoadingSkeleton />, ssr: false }
)
const MarkdownToHtml = dynamic(
  () => import('@/components/tools/developer/markdown-to-html'),
  { loading: () => <ToolLoadingSkeleton />, ssr: false }
)
const TextCompareDiff = dynamic(
  () => import('@/components/tools/developer/text-compare-diff'),
  { loading: () => <ToolLoadingSkeleton />, ssr: false }
)
const CronExpressionGenerator = dynamic(
  () => import('@/components/tools/developer/cron-expression-generator'),
  { loading: () => <ToolLoadingSkeleton />, ssr: false }
)
const DiffChecker = dynamic(
  () => import('@/components/tools/developer/diff-checker'),
  { loading: () => <ToolLoadingSkeleton />, ssr: false }
)
const MarkdownPreview = dynamic(
  () => import('@/components/tools/developer/markdown-preview'),
  { loading: () => <ToolLoadingSkeleton />, ssr: false }
)
const CssMinifier = dynamic(
  () => import('@/components/tools/developer/css-minifier'),
  { loading: () => <ToolLoadingSkeleton />, ssr: false }
)
const JsMinifier = dynamic(
  () => import('@/components/tools/developer/js-minifier'),
  { loading: () => <ToolLoadingSkeleton />, ssr: false }
)
const HtmlMinifier = dynamic(
  () => import('@/components/tools/developer/html-minifier'),
  { loading: () => <ToolLoadingSkeleton />, ssr: false }
)
// ── Text tools ────────────────────────────────────────────────
const WordCounter = dynamic(
  () => import('@/components/tools/text/word-counter'),
  { loading: () => <ToolLoadingSkeleton />, ssr: false }
)
const CharacterCounter = dynamic(
  () => import('@/components/tools/text/character-counter'),
  { loading: () => <ToolLoadingSkeleton />, ssr: false }
)
const CaseConverter = dynamic(
  () => import('@/components/tools/text/case-converter'),
  { loading: () => <ToolLoadingSkeleton />, ssr: false }
)
const SlugGenerator = dynamic(
  () => import('@/components/tools/text/slug-generator'),
  { loading: () => <ToolLoadingSkeleton />, ssr: false }
)
const LoremIpsumGenerator = dynamic(
  () => import('@/components/tools/text/lorem-ipsum-generator'),
  { loading: () => <ToolLoadingSkeleton />, ssr: false }
)
const TextSorter = dynamic(
  () => import('@/components/tools/text/text-sorter'),
  { loading: () => <ToolLoadingSkeleton />, ssr: false }
)
const RemoveBlankLines = dynamic(
  () => import('@/components/tools/text/remove-blank-lines'),
  { loading: () => <ToolLoadingSkeleton />, ssr: false }
)
const DuplicateLineRemover = dynamic(
  () => import('@/components/tools/text/duplicate-line-remover'),
  { loading: () => <ToolLoadingSkeleton />, ssr: false }
)
const ReadingTimeCalculator = dynamic(
  () => import('@/components/tools/text/reading-time-calculator'),
  { loading: () => <ToolLoadingSkeleton />, ssr: false }
)
const UnicodeInspector = dynamic(
  () => import('@/components/tools/text/unicode-inspector'),
  { loading: () => <ToolLoadingSkeleton />, ssr: false }
)
const CapitalizationTool = dynamic(
  () => import('@/components/tools/text/capitalization-tool'),
  { loading: () => <ToolLoadingSkeleton />, ssr: false }
)
const TextCompare = dynamic(
  () => import('@/components/tools/text/text-compare'),
  { loading: () => <ToolLoadingSkeleton />, ssr: false }
)
const RemoveDuplicateWords = dynamic(
  () => import('@/components/tools/text/remove-duplicate-words'),
  { loading: () => <ToolLoadingSkeleton />, ssr: false }
)
// ── Finance tools ─────────────────────────────────────────────
const PercentageCalculator = dynamic(
  () => import('@/components/tools/finance/percentage-calculator'),
  { loading: () => <ToolLoadingSkeleton />, ssr: false }
)
const BmiCalculator = dynamic(
  () => import('@/components/tools/finance/bmi-calculator'),
  { loading: () => <ToolLoadingSkeleton />, ssr: false }
)
const VatCalculator = dynamic(
  () => import('@/components/tools/finance/vat-calculator'),
  { loading: () => <ToolLoadingSkeleton />, ssr: false }
)
const LoanCalculator = dynamic(
  () => import('@/components/tools/finance/loan-calculator'),
  { loading: () => <ToolLoadingSkeleton />, ssr: false }
)
const MortgageCalculator = dynamic(
  () => import('@/components/tools/finance/mortgage-calculator'),
  { loading: () => <ToolLoadingSkeleton />, ssr: false }
)
const CompoundInterestCalculator = dynamic(
  () => import('@/components/tools/finance/compound-interest-calculator'),
  { loading: () => <ToolLoadingSkeleton />, ssr: false }
)
const GpaCalculator = dynamic(
  () => import('@/components/tools/finance/gpa-calculator'),
  { loading: () => <ToolLoadingSkeleton />, ssr: false }
)
const CurrencyConverter = dynamic(
  () => import('@/components/tools/finance/currency-converter'),
  { loading: () => <ToolLoadingSkeleton />, ssr: false }
)
const BodyFatCalculator = dynamic(
  () => import('@/components/tools/finance/body-fat-calculator'),
  { loading: () => <ToolLoadingSkeleton />, ssr: false }
)
const UnitConverter = dynamic(
  () => import('@/components/tools/finance/unit-converter'),
  { loading: () => <ToolLoadingSkeleton />, ssr: false }
)
const InvoiceGenerator = dynamic(
  () => import('@/components/tools/finance/invoice-generator'),
  { loading: () => <ToolLoadingSkeleton />, ssr: false }
)
const BmrCalculator = dynamic(
  () => import('@/components/tools/finance/bmr-calculator'),
  { loading: () => <ToolLoadingSkeleton />, ssr: false }
)
const TdeeCalculator = dynamic(
  () => import('@/components/tools/finance/tdee-calculator'),
  { loading: () => <ToolLoadingSkeleton />, ssr: false }
)
const CalorieCalculator = dynamic(
  () => import('@/components/tools/finance/calorie-calculator'),
  { loading: () => <ToolLoadingSkeleton />, ssr: false }
)
const MacroCalculator = dynamic(
  () => import('@/components/tools/finance/macro-calculator'),
  { loading: () => <ToolLoadingSkeleton />, ssr: false }
)
const WaterIntakeCalculator = dynamic(
  () => import('@/components/tools/finance/water-intake-calculator'),
  { loading: () => <ToolLoadingSkeleton />, ssr: false }
)
const RetirementCalculator = dynamic(
  () => import('@/components/tools/finance/retirement-calculator'),
  { loading: () => <ToolLoadingSkeleton />, ssr: false }
)
const RoiCalculator = dynamic(
  () => import('@/components/tools/finance/roi-calculator'),
  { loading: () => <ToolLoadingSkeleton />, ssr: false }
)
const SavingsCalculator = dynamic(
  () => import('@/components/tools/finance/savings-calculator'),
  { loading: () => <ToolLoadingSkeleton />, ssr: false }
)
const BreakEvenCalculator = dynamic(
  () => import('@/components/tools/finance/break-even-calculator'),
  { loading: () => <ToolLoadingSkeleton />, ssr: false }
)
const ProfitMarginCalculator = dynamic(
  () => import('@/components/tools/finance/profit-margin-calculator'),
  { loading: () => <ToolLoadingSkeleton />, ssr: false }
)
const InflationCalculator = dynamic(
  () => import('@/components/tools/finance/inflation-calculator'),
  { loading: () => <ToolLoadingSkeleton />, ssr: false }
)
const GradeCalculator = dynamic(
  () => import('@/components/tools/finance/grade-calculator'),
  { loading: () => <ToolLoadingSkeleton />, ssr: false }
)
const QuoteGenerator = dynamic(
  () => import('@/components/tools/finance/quote-generator'),
  { loading: () => <ToolLoadingSkeleton />, ssr: false }
)
const FlashcardGenerator = dynamic(
  () => import('@/components/tools/finance/flashcard-generator'),
  { loading: () => <ToolLoadingSkeleton />, ssr: false }
)
const CitationGenerator = dynamic(
  () => import('@/components/tools/finance/citation-generator'),
  { loading: () => <ToolLoadingSkeleton />, ssr: false }
)
const InvoiceNumberGenerator = dynamic(
  () => import('@/components/tools/finance/invoice-number-generator'),
  { loading: () => <ToolLoadingSkeleton />, ssr: false }
)
const StudyPlanner = dynamic(
  () => import('@/components/tools/finance/study-planner'),
  { loading: () => <ToolLoadingSkeleton />, ssr: false }
)
const TipCalculator = dynamic(
  () => import('@/components/tools/finance/tip-calculator'),
  { loading: () => <ToolLoadingSkeleton />, ssr: false }
)
// ── SEO tools ──────────────────────────────────────────────────
const MetaTagGenerator = dynamic(
  () => import('@/components/tools/seo/meta-tag-generator'),
  { loading: () => <ToolLoadingSkeleton />, ssr: false }
)
const TitleGenerator = dynamic(
  () => import('@/components/tools/seo/title-generator'),
  { loading: () => <ToolLoadingSkeleton />, ssr: false }
)
const CtaGenerator = dynamic(
  () => import('@/components/tools/seo/cta-generator'),
  { loading: () => <ToolLoadingSkeleton />, ssr: false }
)
const RobotsTxtGenerator = dynamic(
  () => import('@/components/tools/seo/robots-txt-generator'),
  { loading: () => <ToolLoadingSkeleton />, ssr: false }
)
const SitemapGenerator = dynamic(
  () => import('@/components/tools/seo/sitemap-generator'),
  { loading: () => <ToolLoadingSkeleton />, ssr: false }
)
const JsonLdGenerator = dynamic(
  () => import('@/components/tools/seo/json-ld-generator'),
  { loading: () => <ToolLoadingSkeleton />, ssr: false }
)
const OpenGraphPreview = dynamic(
  () => import('@/components/tools/seo/open-graph-preview'),
  { loading: () => <ToolLoadingSkeleton />, ssr: false }
)
const HeadlineAnalyzer = dynamic(
  () => import('@/components/tools/seo/headline-analyzer'),
  { loading: () => <ToolLoadingSkeleton />, ssr: false }
)
const KeywordDensityChecker = dynamic(
  () => import('@/components/tools/seo/keyword-density-checker'),
  { loading: () => <ToolLoadingSkeleton />, ssr: false }
)
const EmailSignatureGenerator = dynamic(
  () => import('@/components/tools/seo/email-signature-generator'),
  { loading: () => <ToolLoadingSkeleton />, ssr: false }
)
const CampaignUrlBuilder = dynamic(
  () => import('@/components/tools/seo/campaign-url-builder'),
  { loading: () => <ToolLoadingSkeleton />, ssr: false }
)
const QrCampaignGenerator = dynamic(
  () => import('@/components/tools/seo/qr-campaign-generator'),
  { loading: () => <ToolLoadingSkeleton />, ssr: false }
)
const UtmBuilder = dynamic(
  () => import('@/components/tools/seo/utm-builder'),
  { loading: () => <ToolLoadingSkeleton />, ssr: false }
)
const FaqGenerator = dynamic(
  () => import('@/components/tools/seo/faq-generator'),
  { loading: () => <ToolLoadingSkeleton />, ssr: false }
)
const TwitterCardPreview = dynamic(
  () => import('@/components/tools/seo/twitter-card-preview'),
  { loading: () => <ToolLoadingSkeleton />, ssr: false }
)
const BreadcrumbSchemaGenerator = dynamic(
  () => import('@/components/tools/seo/breadcrumb-schema-generator'),
  { loading: () => <ToolLoadingSkeleton />, ssr: false }
)
const OrganizationSchemaGenerator = dynamic(
  () => import('@/components/tools/seo/organization-schema-generator'),
  { loading: () => <ToolLoadingSkeleton />, ssr: false }
)
const CanonicalUrlChecker = dynamic(
  () => import('@/components/tools/seo/canonical-url-checker'),
  { loading: () => <ToolLoadingSkeleton />, ssr: false }
)
const BlogOutlineGenerator = dynamic(
  () => import('@/components/tools/seo/blog-outline-generator'),
  { loading: () => <ToolLoadingSkeleton />, ssr: false }
)
// ── Security tools ─────────────────────────────────────────────
const PasswordGenerator = dynamic(
  () => import('@/components/tools/security/password-generator'),
  { loading: () => <ToolLoadingSkeleton />, ssr: false }
)
const SecurePassphraseGenerator = dynamic(
  () => import('@/components/tools/security/secure-passphrase-generator'),
  { loading: () => <ToolLoadingSkeleton />, ssr: false }
)
const PasswordStrengthChecker = dynamic(
  () => import('@/components/tools/security/password-strength-checker'),
  { loading: () => <ToolLoadingSkeleton />, ssr: false }
)
const CspGenerator = dynamic(
  () => import('@/components/tools/security/csp-generator'),
  { loading: () => <ToolLoadingSkeleton />, ssr: false }
)
// ── Network tools ──────────────────────────────────────────────
const DnsLookup = dynamic(
  () => import('@/components/tools/network/dns-lookup'),
  { loading: () => <ToolLoadingSkeleton />, ssr: false }
)
const IpLookup = dynamic(
  () => import('@/components/tools/network/ip-lookup'),
  { loading: () => <ToolLoadingSkeleton />, ssr: false }
)
const HttpHeaderChecker = dynamic(
  () => import('@/components/tools/network/http-header-checker'),
  { loading: () => <ToolLoadingSkeleton />, ssr: false }
)
const SslChecker = dynamic(
  () => import('@/components/tools/network/ssl-checker'),
  { loading: () => <ToolLoadingSkeleton />, ssr: false }
)
const PingTool = dynamic(
  () => import('@/components/tools/network/ping-tool'),
  { loading: () => <ToolLoadingSkeleton />, ssr: false }
)
const RedirectChecker = dynamic(
  () => import('@/components/tools/network/redirect-checker'),
  { loading: () => <ToolLoadingSkeleton />, ssr: false }
)
const UserAgentParser = dynamic(
  () => import('@/components/tools/network/user-agent-parser'),
  { loading: () => <ToolLoadingSkeleton />, ssr: false }
)
// ── Media tools ────────────────────────────────────────────────
const QrGenerator = dynamic(
  () => import('@/components/tools/media/qr-generator'),
  { loading: () => <ToolLoadingSkeleton />, ssr: false }
)
const ColorPaletteExtractor = dynamic(
  () => import('@/components/tools/media/color-palette-extractor'),
  { loading: () => <ToolLoadingSkeleton />, ssr: false }
)
const ColorContrastChecker = dynamic(
  () => import('@/components/tools/media/color-contrast-checker'),
  { loading: () => <ToolLoadingSkeleton />, ssr: false }
)
const ImageCompressor = dynamic(
  () => import('@/components/tools/media/image-compressor'),
  { loading: () => <ToolLoadingSkeleton />, ssr: false }
)
const ImageResizer = dynamic(
  () => import('@/components/tools/media/image-resizer'),
  { loading: () => <ToolLoadingSkeleton />, ssr: false }
)
const FaviconGenerator = dynamic(
  () => import('@/components/tools/media/favicon-generator'),
  { loading: () => <ToolLoadingSkeleton />, ssr: false }
)
const SocialImageGenerator = dynamic(
  () => import('@/components/tools/media/social-image-generator'),
  { loading: () => <ToolLoadingSkeleton />, ssr: false }
)
const CssGradientGenerator = dynamic(
  () => import('@/components/tools/media/css-gradient-generator'),
  { loading: () => <ToolLoadingSkeleton />, ssr: false }
)
const SvgViewer = dynamic(
  () => import('@/components/tools/media/svg-viewer'),
  { loading: () => <ToolLoadingSkeleton />, ssr: false }
)
const FileSizeConverter = dynamic(
  () => import('@/components/tools/media/file-size-converter'),
  { loading: () => <ToolLoadingSkeleton />, ssr: false }
)
const AltTextGenerator = dynamic(
  () => import('@/components/tools/media/alt-text-generator'),
  { loading: () => <ToolLoadingSkeleton />, ssr: false }
)
const SvgOptimizer = dynamic(
  () => import('@/components/tools/media/svg-optimizer'),
  { loading: () => <ToolLoadingSkeleton />, ssr: false }
)
const MimeDetector = dynamic(
  () => import('@/components/tools/media/mime-detector'),
  { loading: () => <ToolLoadingSkeleton />, ssr: false }
)
const FileHash = dynamic(
  () => import('@/components/tools/media/file-hash'),
  { loading: () => <ToolLoadingSkeleton />, ssr: false }
)
const AriaValidator = dynamic(
  () => import('@/components/tools/media/aria-validator'),
  { loading: () => <ToolLoadingSkeleton />, ssr: false }
)
const MergePdfs = dynamic(
  () => import('@/components/tools/media/merge-pdfs'),
  { loading: () => <ToolLoadingSkeleton />, ssr: false }
)
const SplitPdf = dynamic(
  () => import('@/components/tools/media/split-pdf'),
  { loading: () => <ToolLoadingSkeleton />, ssr: false }
)
const RotatePdf = dynamic(
  () => import('@/components/tools/media/rotate-pdf'),
  { loading: () => <ToolLoadingSkeleton />, ssr: false }
)
const ExtractPdfPages = dynamic(
  () => import('@/components/tools/media/extract-pdf-pages'),
  { loading: () => <ToolLoadingSkeleton />, ssr: false }
)
const CompressPdf = dynamic(
  () => import('@/components/tools/media/compress-pdf'),
  { loading: () => <ToolLoadingSkeleton />, ssr: false }
)
const PdfToImages = dynamic(
  () => import('@/components/tools/media/pdf-to-images'),
  { loading: () => <ToolLoadingSkeleton />, ssr: false }
)
const ImagesToPdf = dynamic(
  () => import('@/components/tools/media/images-to-pdf'),
  { loading: () => <ToolLoadingSkeleton />, ssr: false }
)
const PdfMetadataViewer = dynamic(
  () => import('@/components/tools/media/pdf-metadata-viewer'),
  { loading: () => <ToolLoadingSkeleton />, ssr: false }
)
const FileChecksum = dynamic(
  () => import('@/components/tools/media/file-checksum'),
  { loading: () => <ToolLoadingSkeleton />, ssr: false }
)
const FileSignatureInspector = dynamic(
  () => import('@/components/tools/media/file-signature-inspector'),
  { loading: () => <ToolLoadingSkeleton />, ssr: false }
)
const ImageMetadataViewer = dynamic(
  () => import('@/components/tools/media/image-metadata-viewer'),
  { loading: () => <ToolLoadingSkeleton />, ssr: false }
)
const FontAccessibilityChecker = dynamic(
  () => import('@/components/tools/media/font-accessibility-checker'),
  { loading: () => <ToolLoadingSkeleton />, ssr: false }
)
const PngToWebp = dynamic(
  () => import('@/components/tools/media/png-to-webp'),
  { loading: () => <ToolLoadingSkeleton />, ssr: false }
)
// ── Misc tools ─────────────────────────────────────────────────
const TokenCounter = dynamic(
  () => import('@/components/tools/misc/token-counter'),
  { loading: () => <ToolLoadingSkeleton />, ssr: false }
)
const AiCostCalculator = dynamic(
  () => import('@/components/tools/misc/ai-cost-calculator'),
  { loading: () => <ToolLoadingSkeleton />, ssr: false }
)
const PromptOptimizer = dynamic(
  () => import('@/components/tools/misc/prompt-optimizer'),
  { loading: () => <ToolLoadingSkeleton />, ssr: false }
)
const PromptVariableReplacer = dynamic(
  () => import('@/components/tools/misc/prompt-variable-replacer'),
  { loading: () => <ToolLoadingSkeleton />, ssr: false }
)
const SystemPromptGenerator = dynamic(
  () => import('@/components/tools/misc/system-prompt-generator'),
  { loading: () => <ToolLoadingSkeleton />, ssr: false }
)
const AiPersonaGenerator = dynamic(
  () => import('@/components/tools/misc/ai-persona-generator'),
  { loading: () => <ToolLoadingSkeleton />, ssr: false }
)
const PromptLibrary = dynamic(
  () => import('@/components/tools/misc/prompt-library'),
  { loading: () => <ToolLoadingSkeleton />, ssr: false }
)
const PromptVersionManager = dynamic(
  () => import('@/components/tools/misc/prompt-version-manager'),
  { loading: () => <ToolLoadingSkeleton />, ssr: false }
)
const AiWorkflowBuilder = dynamic(
  () => import('@/components/tools/misc/ai-workflow-builder'),
  { loading: () => <ToolLoadingSkeleton />, ssr: false }
)
// ──────────────────────────────────────────────────────────────
// 2. Map slugs to their dynamically imported components
// ──────────────────────────────────────────────────────────────
const componentMap: Record<string, React.ComponentType> = {
  'json-formatter': JsonFormatter,
  'json-yaml-converter': JsonYamlConverter,
  'xml-formatter': XmlFormatter,
  'base64-encoder-decoder': Base64EncoderDecoder,
  'uuid-generator': UuidGenerator,
  'hash-generator': HashGenerator,
  'hmac-generator': HmacGenerator,
  'jwt-decoder': JwtDecoder,
  'jwt-generator': JwtGenerator,
  'regex-tester': RegexTester,
  'url-encoder-decoder': UrlEncoderDecoder,
  'unix-timestamp-converter': UnixTimestampConverter,
  'color-converter': ColorConverter,
  'html-entity-encoder': HtmlEntityEncoder,
  'sql-formatter': SqlFormatter,
  'markdown-to-html': MarkdownToHtml,
  'text-compare-diff': TextCompareDiff,
  'cron-expression-generator': CronExpressionGenerator,
  'diff-checker': DiffChecker,
  'markdown-preview': MarkdownPreview,
  'css-minifier': CssMinifier,
  'js-minifier': JsMinifier,
  'html-minifier': HtmlMinifier,
  'word-counter': WordCounter,
  'character-counter': CharacterCounter,
  'case-converter': CaseConverter,
  'slug-generator': SlugGenerator,
  'lorem-ipsum-generator': LoremIpsumGenerator,
  'text-sorter': TextSorter,
  'remove-blank-lines': RemoveBlankLines,
  'duplicate-line-remover': DuplicateLineRemover,
  'reading-time-calculator': ReadingTimeCalculator,
  'unicode-inspector': UnicodeInspector,
  'capitalization-tool': CapitalizationTool,
  'text-compare': TextCompare,
  'remove-duplicate-words': RemoveDuplicateWords,
  'percentage-calculator': PercentageCalculator,
  'bmi-calculator': BmiCalculator,
  'vat-calculator': VatCalculator,
  'loan-calculator': LoanCalculator,
  'mortgage-calculator': MortgageCalculator,
  'compound-interest-calculator': CompoundInterestCalculator,
  'gpa-calculator': GpaCalculator,
  'currency-converter': CurrencyConverter,
  'body-fat-calculator': BodyFatCalculator,
  'unit-converter': UnitConverter,
  'invoice-generator': InvoiceGenerator,
  'bmr-calculator': BmrCalculator,
  'tdee-calculator': TdeeCalculator,
  'calorie-calculator': CalorieCalculator,
  'macro-calculator': MacroCalculator,
  'water-intake-calculator': WaterIntakeCalculator,
  'retirement-calculator': RetirementCalculator,
  'roi-calculator': RoiCalculator,
  'savings-calculator': SavingsCalculator,
  'break-even-calculator': BreakEvenCalculator,
  'profit-margin-calculator': ProfitMarginCalculator,
  'inflation-calculator': InflationCalculator,
  'grade-calculator': GradeCalculator,
  'quote-generator': QuoteGenerator,
  'flashcard-generator': FlashcardGenerator,
  'citation-generator': CitationGenerator,
  'invoice-number-generator': InvoiceNumberGenerator,
  'study-planner': StudyPlanner,
  'tip-calculator': TipCalculator,
  'meta-tag-generator': MetaTagGenerator,
  'title-generator': TitleGenerator,
  'cta-generator': CtaGenerator,
  'robots-txt-generator': RobotsTxtGenerator,
  'sitemap-generator': SitemapGenerator,
  'json-ld-generator': JsonLdGenerator,
  'open-graph-preview': OpenGraphPreview,
  'headline-analyzer': HeadlineAnalyzer,
  'keyword-density-checker': KeywordDensityChecker,
  'email-signature-generator': EmailSignatureGenerator,
  'campaign-url-builder': CampaignUrlBuilder,
  'qr-campaign-generator': QrCampaignGenerator,
  'utm-builder': UtmBuilder,
  'faq-generator': FaqGenerator,
  'twitter-card-preview': TwitterCardPreview,
  'breadcrumb-schema-generator': BreadcrumbSchemaGenerator,
  'organization-schema-generator': OrganizationSchemaGenerator,
  'canonical-url-checker': CanonicalUrlChecker,
  'blog-outline-generator': BlogOutlineGenerator,
  'password-generator': PasswordGenerator,
  'secure-passphrase-generator': SecurePassphraseGenerator,
  'password-strength-checker': PasswordStrengthChecker,
  'csp-generator': CspGenerator,
  'dns-lookup': DnsLookup,
  'ip-lookup': IpLookup,
  'http-header-checker': HttpHeaderChecker,
  'ssl-checker': SslChecker,
  'ping-tool': PingTool,
  'redirect-checker': RedirectChecker,
  'user-agent-parser': UserAgentParser,
  'qr-generator': QrGenerator,
  'color-palette-extractor': ColorPaletteExtractor,
  'color-contrast-checker': ColorContrastChecker,
  'image-compressor': ImageCompressor,
  'image-resizer': ImageResizer,
  'favicon-generator': FaviconGenerator,
  'social-image-generator': SocialImageGenerator,
  'css-gradient-generator': CssGradientGenerator,
  'svg-viewer': SvgViewer,
  'file-size-converter': FileSizeConverter,
  'alt-text-generator': AltTextGenerator,
  'svg-optimizer': SvgOptimizer,
  'mime-detector': MimeDetector,
  'file-hash': FileHash,
  'aria-validator': AriaValidator,
  'merge-pdfs': MergePdfs,
  'split-pdf': SplitPdf,
  'rotate-pdf': RotatePdf,
  'extract-pdf-pages': ExtractPdfPages,
  'compress-pdf': CompressPdf,
  'pdf-to-images': PdfToImages,
  'images-to-pdf': ImagesToPdf,
  'pdf-metadata-viewer': PdfMetadataViewer,
  'file-checksum': FileChecksum,
  'file-signature-inspector': FileSignatureInspector,
  'image-metadata-viewer': ImageMetadataViewer,
  'font-accessibility-checker': FontAccessibilityChecker,
  'png-to-webp': PngToWebp,
  'token-counter': TokenCounter,
  'ai-cost-calculator': AiCostCalculator,
  'prompt-optimizer': PromptOptimizer,
  'prompt-variable-replacer': PromptVariableReplacer,
  'system-prompt-generator': SystemPromptGenerator,
  'ai-persona-generator': AiPersonaGenerator,
  'prompt-library': PromptLibrary,
  'prompt-version-manager': PromptVersionManager,
  'ai-workflow-builder': AiWorkflowBuilder,
}
// ──────────────────────────────────────────────────────────────
// 3. Build the final tools array
// ──────────────────────────────────────────────────────────────
export const tools: Tool[] = toolMetadata.map((meta) => ({
  ...meta,
  Component: componentMap[meta.slug],
}))
export const toolsBySlug = new Map(tools.map((t) => [t.slug, t]))
// ──────────────────────────────────────────────────────────────
// 4. Preload functions – used for on‑hover fetching
// ──────────────────────────────────────────────────────────────
export const preloadFunctions = new Map<string, () => Promise<unknown>>(
  Object.entries(componentMap).map(([slug, comp]) => [
    slug,
    () => {
      // We use the same dynamic import as the component itself.
      // Since dynamic() already returns a component, we just need to
      // trigger the import. We can simply call the import() that
      // was used in the dynamic() call.
      // However, we need to store the actual import function.
      // A simpler approach: use a switch or a dictionary.
      // We'll define a separate map of importers.
      return importers[slug]?.() || Promise.resolve()
    },
  ])
)
// We also need the raw import functions for preload.
const importers: Record<string, () => Promise<unknown>> = {
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