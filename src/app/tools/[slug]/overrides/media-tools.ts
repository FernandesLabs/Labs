// media-tools.ts — hand-written content overrides for the media category.
// Generated from a split of the original monolithic
// src/app/tools/[slug]/tool-content-overrides.ts into per-category
// modules (file-structure refactor). Content is byte-identical to the
// original; do not hand-edit formatting here unless you also update
// the merge in ./index.ts.
import type { ToolOverrideMap } from './types'

export const OVERRIDES: ToolOverrideMap = {
  'qr-generator': {
    intro:
      'The QR Generator renders a scannable QR code from any text or URL and exports it as a downloadable PNG, all in the browser. Type or paste your content into the Text or URL field, and the code re-renders live as you type. A Size slider ranges from 128 to 1024 pixels in 16-pixel steps, giving you a small code for a screen or a large one for print. The Error correction select offers four levels — L at 7% recovery, M at 15%, Q at 25%, and H at 30% — so you can tune how much damage the code survives during scanning versus how densely it packs data. Foreground and Background color pickers let you match a brand palette, and each swatch also accepts a typed hex value. The generated image draws with the standard quiet-zone margin around the modules, and it appears in a bordered preview card that grows to fit the chosen size up to a preview ceiling. Download PNG exports the canvas as a PNG file named qr-code.png, and a Scan Tip button reminds you that lighter backgrounds scan best, while a small helper note appears when the field is empty.',
    examples: [
      {
        input: 'Text or URL "https://fernandeslabs.com" · Size 320 · Error correction M · Foreground #0f172a · Background #ffffff',
        output: 'PNG preview 320px wide downloading as qr-code.png · encodes https://fernandeslabs.com in version 2 (25×25 modules) with a 2-module quiet zone and 15% error correction',
        note: 'The default settings render as a 320px QR at medium resilience. The moderately long URL fits comfortably in a low version at 15% recovery, and the dark-on-light pairing keeps the code scannable by standard cameras.',
      },
      {
        input: 'Text "WIFI:T:WPA;S:FernandesHome;P:cor3ct-horse;H:false;;" · Size 512 · Error correction H · Foreground #000000 · Background #ffffff',
        output: 'PNG preview 512px downloading as qr-code.png · encodes the Wi-Fi configuration string at 30% error correction',
        note: 'Wi-Fi login strings are longer and deserve the highest recovery level so scratched or creased stickers still scan. The 512px size keeps every module crisp for a laminated card, while the pure black-on-white contrast maximizes contrast for the H level.',
      },
      {
        input: 'Text or URL "https://flb.io/events/summer" · Size 1024 · Error correction L · Foreground #0f172a · Background #f8fafc',
        output: 'PNG preview 1024px downloading as qr-code.png · encodes the shortened URL at 7% error correction',
        note: 'Low error correction packs more data into fewer modules, so a short URL renders as a dense, small-version code. At 1024px it prints clean and legible from distance, and the near-white background still satisfies the dark-on-light scanning requirement.',
      },
    ],
    howTo: [
      'Enter the URL or any text into the Text or URL field; the preview updates live on every keystroke.',
      'Drag the Size slider to your target dimension — the hint shows the exact pixel value, from 128 up to 1024.',
      'Pick an Error correction level from L (7%), M (15%), Q (25%), or H (30%) based on how the code will be used.',
      'Set the Foreground and Background colors with the swatch pickers or by typing hex values into their fields.',
      'Click Download PNG to save the canvas, and use Scan Tip for a reminder that lighter backgrounds scan best.',
    ],
    useCases: [
      'Marketing print — a poster-safe 1024px QR at low correction links billboards, flyers, and packaging back to a campaign landing page.',
      'Event badges and lanyards — high error-correction codes survive lanyard folds and badge scuffs while carrying the attendee landing URL.',
      'Product labels — small, dark-on-light codes on packaging give shoppers a direct route to instructions or ingredient pages.',
      'Wi-Fi access cards — a WIFI: string encodes the network name and password so guests scan instead of typing credentials.',
      'Table menus — a middle-size QR at M level on near-white background sends diners to the digital menu without printing a long URL.',
      'Inventory and tracking — batch codes embed serialized identifiers that warehouse scanners read reliably at normal distances.',
    ],
    bestPractices: [
      'Keep foreground dark and background light; scanners lock onto contrast, and light-on-dark codes fail with cheaper readers.',
      'Choose high error correction for anything printed, laminated, or handled, since scratches and wrinkles recovery the H level recovers.',
      'Preserve the quiet zone around the code in your layout; the generator adds a 2-module margin and design cropping removes it, browsers read it anyway.',
      'Test the code with a camera at the real range and lighting before printing a whole run; a preview on screen is not proof of scannability.',
      'Point codes at stable, short URLs rather than deep links that might be reorganized, and regenerate if a target URL ever changes.',
      'Export at the largest size you will need; upscaling a small PNG later only blurs the modules instead of sharpening them.',
    ],
    faqs: [
      {
        q: 'What error correction level should I pick?',
        a: 'Use M by default, H for printed or damage-prone surfaces like badges and labels, and Q for balance between density and resilience. L packs the most data but survives the least damage. The select labels each level with its recovery percentage so you can match the physical risk of the medium.',
      },
      {
        q: 'Does the QR code store any of my data?',
        a: 'The code encodes only the exact text you entered; nothing is sent to a server because rendering happens entirely in the browser. The generated PNG is a pure visual map of that text. No analytics, account data, or clipboard contents are ever transmitted anywhere.',
      },
      {
        q: 'Can I change the colors of the QR code?',
        a: 'Yes. The Foreground and Background pickers, plus their hex fields, recolor the modules and quiet zone instantly. Keep the foreground dark against a light background for reliable scanning. Avoid gradients and mid-tone pairings, which camera algorithms struggle to separate.',
      },
      {
        q: 'Why does the preview not hit the full slider size?',
        a: 'The preview card caps the rendered image at a fixed ceiling so very large sizes stay visible on one screen, while the exported download still uses the exact pixel dimensions you chose. The size hint and the downloaded file reflect the true value regardless of the preview scale.',
      },
      {
        q: 'What file format is exported for the QR code?',
        a: 'The Download PNG button serializes the canvas to image/png and saves it as qr-code.png. PNG preserves the sharp, crisp module edges that scanners need, unlike a lossy JPEG. That is why the tool deliberately sticks to a single lossless export format.',
      },
      {
        q: 'What is the quiet zone margin for?',
        a: 'The quiet zone is the blank border of modules around the code that lets scanners find and center the pattern without confusion from surrounding graphics. The generator adds a 2-module margin automatically. When you place the code in a design, keep that breathing room intact.',
      },
    ],
    tips: [
      'Generate a quick code for your Wi-Fi network and laminate it; guests scan once and connect without explaining the password.',
      'Use high correction for anything on fabric or curved surfaces, where scanning angles and wrinkles eat into the recoverable damage budget.',
      'Re-scan the output PNG after changing colors to confirm the download still reads before you commit to the design.',
      'Regenerate codes when a URL changes rather than keep stale ones; a QR cannot be edited after printing, only regenerated and reprinted.',
    ],
  },
  'image-metadata-viewer': {
    intro:
      'The Image Metadata Viewer extracts EXIF data directly from JPEG files, entirely in the browser, by parsing the APP1 segment and walking the IFD0, Exif sub-IFD, and GPS IFD tables. Load an image through the upload zone or the Choose an image button and the tool displays file name, size, type, and pixel dimensions in the Image info card, with a preview thumbnail underneath. The EXIF metadata card lists every tag it can decode with a friendly name and a raw value — including camera make and model, lens information, exposure time, f-number, ISO, focal length, capture date, copyright, and device serial numbers; RATIONAL values are shown both as fractions and decimal approximations. If the image carries GPS data, a green GPS location found panel appears with the decimal latitude and longitude plus a link to view the coordinates on OpenStreetMap. Images re-saved by social platforms, or formats such as PNG and WebP that store no EXIF, trigger a clear warning instead of failing silently. Because the parser is a hand-written client-side reader rather than a remote service, every tag and value shown stays on your machine, which makes the viewer well suited to inspecting photos before publication so unwanted metadata can be spotted or stripped in advance.',
    examples: [
      { input: 'A camera JPEG that contains an APP1 Exif segment is dropped onto the zone.', output: 'Image info shows the dimensions, and the EXIF metadata table lists tags such as Make, Model, FNumber, and DateTimeOriginal with friendly names and values.', note: 'RATIONAL entries like the f-number render as a fraction plus a decimal approximation in a single row.' },
      { input: 'A phone photo taken with GPS enabled is loaded.', output: 'A green "GPS location found" panel with decimal latitude and longitude to 6 places, plus an "Open in OpenStreetMap" link.', note: 'The parser converts the stored degrees, minutes, and seconds to decimal before rendering.' },
      { input: 'A PNG or WebP image is uploaded for inspection.', output: 'Image info and preview render normally, but the EXIF card shows the amber warning "No EXIF data found in this image."', note: 'Non-JPEG formats typically carry no EXIF, so the warning appears instead of an empty table.' },
    ],
    howTo: [
      'Drag a JPEG onto the drop zone or click "Choose an image"; if the file type does not start with image/, a toast asks you to pick an image instead.',
      'Wait for the "Reading…" spinner to finish, then check Image info for the file name, size, type, and width × height dimensions.',
      'Scroll the EXIF metadata table to review tags with friendly names and values, including the fraction-and-decimal rendering of RATIONAL fields.',
      'If GPS data was found, click "Open in OpenStreetMap" to drop a pin at the exact decimal coordinates.',
      'Read the About EXIF card to understand which segments the parser walks and why re-saved images often show no data.',
    ],
    useCases: [
      'Checking the camera make, model, and lens used for a shot before publishing it.',
      'Reviewing exactly which tags a photo carries so unwanted GPS or serial numbers can be stripped before sharing.',
      'Locating where a photo was taken via the GPS coordinates before deciding whether to publish it.',
      'Verifying a stock image by comparing EXIF capture timestamps and camera bodies.',
      'Documenting camera settings from a reference shot for an exposure or photography tutorial.',
      'Auditing an image library for metadata that a client wants removed from derivative work.',
    ],
    bestPractices: [
      'Expect heavy EXIF loss after sharing — platforms like WhatsApp and Instagram re-encode and strip most metadata.',
      'Treat GPS tags as sensitive; coordinates from a photo taken at home expose the exact location.',
      'Remember the parser only reads JPEG files with an APP1 segment, so RAW, HEIC, and TIFF files are out of scope.',
      'Check tags such as BodySerialNumber and LensSerialNumber, which can identify a specific camera body or lens.',
      'Cross-check the browser-loaded Dimensions stat against ExifImageWidth and ExifImageHeight to spot resizing or cropping.',
      'Keep originals backed up since the viewer is read-only — metadata is never modified, only displayed.',
    ],
    faqs: [
      { q: 'Which image types are supported?', a: 'Only JPEG files that carry an APP1 segment with the Exif marker are fully parsed. PNG, WebP, GIF, and BMP images still load and preview, but their EXIF card shows the warning that those formats typically store no exchangeable metadata this parser can read.' },
      { q: 'Why does it show no EXIF data found?', a: 'Modern platforms and many editors re-encode and strip metadata when saving, so the APP1 segment no longer exists. The tool signals this with an amber warning instead of an empty table, and the About EXIF card explains this is normal for re-saved or shared images.' },
      { q: 'Does the viewer read my whole image?', a: 'It parses only the metadata segments needed for extraction and builds a local preview, all inside your browser. The file is never uploaded, and nothing is written back to the JPEG, so the original bytes remain untouched on your device for the entire session.' },
      { q: 'How accurate are the GPS coordinates?', a: 'The tool reads the GPS IFD, where degrees, minutes, and seconds are stored as RATIONAL values, and converts them to decimal using the standard formula: degrees plus minutes over 60 plus seconds over 3600. Accuracy therefore matches whatever the camera recorded, typically well under ten meters outdoors.' },
      { q: 'What does the geotag privacy warning cover?', a: 'Any photo taken with location services enabled can embed precise coordinates that reveal where you live, work, or travel when published. The green GPS panel exposes those coordinates before you share, so you can strip the tags with an editor or avoid publishing the image altogether.' },
      { q: 'Why do RATIONAL tags show two values?', a: 'EXIF stores many settings as a numerator over a denominator, such as 1/100 for exposure time or 18/10 for f-number. The table shows both the raw fraction and the decimal approximation the parser computes, so you see the exact stored values and an easy-to-read number in one row.' },
    ],
    tips: [
      'The ExifImageWidth and ExifImageHeight tags should match the Dimensions stat — large gaps suggest resizing or cropping.',
      'The ASCII rendering replaces control bytes with a dot, which keeps odd tag values readable in the table.',
      'Heavily edited photos or those passed through chat apps lose EXIF, so re-shoot or keep a RAW original when metadata matters.',
      'Use the OpenStreetMap link to double-check a coordinate before deciding whether a photo is safe to publish.',
    ],
  },
  'color-contrast-checker': {
    intro:
      'The Color Contrast Checker measures the WCAG contrast ratio between a foreground and a background color and grades it against the accessibility standards people actually rely on. Pick the two colors with the swatch pickers or type hex values into the pair of fields, and the ratio updates live. The tool computes relative luminance using the WCAG logarithmic formula, then divides the lighter against the darker values, offsetting each by 0.05. Results surface as a Contrast Ratio stat in the standard x:1 format and a WCAG Score badge that summarizes the outcome as AAA at 7:1, AA at 4.5:1, AA Large at 3:1, or Fail. Four compliance cards break the score into each individual criterion — AA Normal with a 4.5:1 threshold, AA Large at 3:1, AAA Normal at 7:1, and AAA Large at 4.5:1 — each marked with a green pass or red fail chip. A live preview panel renders sample text in your exact colors, including the note that large text means 18pt or 14pt bold. A legend of badges along the bottom documents all four thresholds for quick reference.',
    examples: [
      {
        input: 'Foreground #0f172a · Background #f8fafc',
        output: 'Contrast Ratio 17.07 : 1 · WCAG Score AAA · All four cards pass — AA Normal, AA Large, AAA Normal, AAA Large',
        note: 'The dark navy on near-white computes to 17.07:1, clearing even the strictest AAA Normal threshold of 7:1. Every compliance card shows a green check, marking this pairing safe for body text, labels, and the largest headlines alike.',
      },
      {
        input: 'Foreground #ff0000 · Background #ffffff',
        output: 'Contrast Ratio 4.00 : 1 · WCAG Score AA Large · AA Normal fails, AA Large passes, AAA Normal fails, AAA Large fails',
        note: 'Pure red on white lands at exactly 4.00:1, which passes only the AA Large bar of 3:1. The score badge reads AA Large, the AA Normal card shows needs 4.5:1, and the two AAA cards fail, proving the classic warning that red text needs careful pairings.',
      },
      {
        input: 'Foreground #333333 · Background #000000',
        output: 'Contrast Ratio 1.66 : 1 · WCAG Score Fail · All four cards fail',
        note: 'Two very dark grays barely separate at 1.66:1, below every threshold including the lenient 3:1 large-text bar. The WCAG Score stat shows Fail, and each compliance card displays a red X with its required minimum clearly listed.',
      },
    ],
    howTo: [
      'Pick the Foreground color with its swatch picker or enter a six-digit hex value like #0f172a into the text field.',
      'Pick the Background color the same way; the ratio, score, and preview recalculate immediately on either change.',
      'Read how the Contrast Ratio stat pairs with the WCAG Score badge for a single-line verdict on the pairing.',
      'Review the four WCAG compliance cards to see each individual threshold verdict with its required x:1 minimum.',
      'Inspect the live preview panel, which renders headline, body, and large-text samples in your exact colors.',
    ],
    useCases: [
      'Body copy design — confirm paragraph text meets AA Normal 4.5:1 before shipping a blog or documentation theme.',
      'Button and CTA styling — verify white-on-colored button labels clear the large-text bar against the button background.',
      'Form UX — check placeholder, label, and helper-text colors so the least prominent guidance stays above WCAG floor.',
      'Data visualization — stress-test the palette extracted from a chart against the backgrounds it will render on.',
      'Brand compliance audits — a batch of color pairs checked here becomes the documented evidence for an accessibility report.',
      'Dark-mode themes — validate the inverted foreground and background sets early, where low contrast failures cluster.',
    ],
    bestPractices: [
      'Design to AA at minimum for all interactive text and maps, and reserve AAA for long-form body content that readers absorb.',
      'Remember large text counts as 18pt or 14pt bold, so the AA Large 3:1 threshold applies only to genuinely oversized text.',
      'Check text placed over images against the actual overlay colors, not the theme background, since photos shift effective contrast.',
      'Do not rely on color alone to convey meaning; pair any ratio result with icons, underlines, or labels for clarity.',
      'Prefer dark-ink-on-light-background pairs, which typically outperform light-on-dark at equal nominal ratios in readability tests.',
      'Re-verify pairs after any brand color rebrand, because a slight hue shift can quietly drop a passing ratio below its threshold.',
    ],
    faqs: [
      {
        q: 'How is the WCAG contrast ratio calculated?',
        a: 'Both colors are converted to relative luminance using the WCAG-defined formula that applies a gamma curve per channel, and the brighter luminance is divided by the darker after adding 0.05 to each side. The result is compared to the 3:1, 4.5:1, and 7:1 thresholds.',
      },
      {
        q: 'What is the difference between AA and AAA?',
        a: 'AA is the baseline accessibility target, requiring 4.5:1 for normal text and 3:1 for large text, while AAA is the enhanced level requiring 7:1 and 4.5:1 respectively. The score badge collapses the four cards into one verdict at the highest met level.',
      },
      {
        q: 'When does the AA Large threshold apply?',
        a: 'AA Large applies to text at 18pt or 14pt bold, where oversized glyphs need less separation, so its threshold drops to 3:1. The live preview highlights the large-text note explicitly. Small body copy never qualifies and must meet the stricter 4.5:1 normal bar.',
      },
      {
        q: 'What does the Fail grade actually mean?',
        a: 'Fail means the pair does not meet even the most lenient large-text threshold of 3:1. Text set at either size in that combination fails WCAG conformance. The compliance cards identify exactly which criterion misses its required ratio so you can adjust the colors.',
      },
      {
        q: 'Do I need to type the hash symbol in the hex fields?',
        a: 'No, the parser accepts a six-digit hex with or without the leading hash, matching pairs like 0f172a or #0f172a. Non-hex or short values simply stop the calculation, and the ratio stat falls back to a dash with a hint asking for valid colors.',
      },
      {
        q: 'How accurate is the displayed ratio value?',
        a: 'The calculation follows the standard WCAG luminance formula to two decimal places, and the thresholds use those exact decimals for pass or fail. Browsers and audit tools may round the final ratio slightly differently, so anchor your decision on the pass chips rather than the last digit.',
      },
    ],
    tips: [
      'Check the worst-case color pair in your palette first; if the extremes pass, everything in between usually does too.',
      'Test the same foreground against both light and dark backgrounds before committing a theme, since one variant will inevitably be weak.',
      'Use the large-text badge as a design signal to bump body sizes up to 18pt where ratios get tight, then relax colors slightly.',
      'Keep a shortlist of known-good pairs from this tool in your design tokens so future pages start from verified ratios.',
    ],
  },
  'file-signature-inspector': {
    intro:
      'The File Signature Inspector identifies a file\'s real format by reading its first 16 bytes and matching them against a database of roughly 90 magic-number signatures, so the result is independent of the extension and any browser-reported MIME type. Drop a file onto the upload zone or click Choose a file and the tool slices the leading bytes, renders a hex and ASCII dump, and runs them through a signature table covering images, video, audio, archives, documents, executables, fonts, and other common formats. The Detection result section reports the detected type, category, MIME value, and a confidence label: Exact match when the magic is distinctive, or Partial (generic) when the header is shared, such as the PK bytes that start every ZIP-based file including DOCX, XLSX, and JAR. Notes on the matched signature appear in a dedicated panel, and the tool compares the detected MIME with the browser-reported one, surfacing a green MIME matches banner or a red mismatch warning when the file appears renamed. The hex dump card shows the exact bytes read, while a searchable Signature reference table lists every entry in the database. All scanning happens locally in the browser, so opaque or confidential files never leave your machine.',
    examples: [
      { input: 'A PNG photo named screenshot.png is dropped onto the upload zone.', output: 'Detected type "PNG image", category image, MIME image/png, Confidence "Exact match", plus the bytes 89 50 4E 47 0D 0A 1A 0A in the hex dump.', note: 'The distinctive 8-byte header matches the browser type, so the green "MIME matches" banner also appears.' },
      { input: 'A Windows executable renamed to notes.pdf is uploaded.', output: 'Detected type "Windows executable (PE)", MIME application/x-msdownload, Exact match, with a red "MIME mismatch" banner showing the browser-reported application/pdf.', note: 'The magic bytes 4D 5A override whatever extension or declared type the file carries.' },
      { input: 'A ZIP archive renamed to package.jpg is uploaded.', output: 'Detected type "ZIP archive", category archive, MIME application/zip, Confidence "Partial (generic)", with the shared 50 4B 03 04 header and a generic-signature warning.', note: 'PK headers are shared by DOCX, XLSX, JAR, and EPUB, so confidence stays partial without a secondary match.' },
    ],
    howTo: [
      'Click "Choose a file" or drag a file onto the dashed drop zone; the button shows a spinner labelled "Reading…" while the header is analysed.',
      'Review the Detection result cards for Detected type, Category, MIME, and the Confidence label ("Exact match" or "Partial").',
      'Check the Notes panel and the green "MIME matches" or red "MIME mismatch" banner that compares the magic bytes with the browser type.',
      'Confirm the raw bytes in the "Hex dump (first 16 bytes)" card, which shows an offset guide, the hexadecimal row, and an ASCII column.',
      'Search the Signature reference table by name, MIME, hex, or category to inspect the full database of known signatures.',
    ],
    useCases: [
      'Verifying that a downloaded executable truly is a PE binary before opening it.',
      'Identifying a file whose extension was lost or renamed during transfer or upload.',
      'Disambiguating ZIP-based formats like DOCX, XLSX, JAR, and EPUB when only the container header is visible.',
      'Auditing ingested attachments so disguised executable content is caught before it reaches other users.',
      'Confirming container formats against their declared MIME types during archival or forensic checks.',
      'Learning to read magic numbers by pairing the hex dump with the signature reference table.',
    ],
    bestPractices: [
      'Treat renamed files with care — an executable carrying a PDF extension is a classic spoofing vector that the mismatch banner exposes.',
      'Expect Partial confidence on PK headers as normal, since every ZIP-based document starts with the same 50 4B 03 04 bytes.',
      'Never treat the browser-reported file.type as ground truth; it can be empty or derived purely from the filename.',
      'Keep the 16-byte probe in mind: formats with markers beyond it, such as tar\'s ustar header at offset 257, report Unknown file signature.',
      'Remember a plain-text file without a magic number will report Unknown, which is expected rather than a failure.',
      'Review the hex dump alongside the ASCII column to spot text-like data that binary-only signatures would miss.',
    ],
    faqs: [
      { q: 'Why is my detection labelled Partial (generic)?', a: 'The first bytes matched a signature shared by several formats and no secondary marker could be confirmed. The classic example is 50 4B 03 04 at the start of ZIP, DOCX, XLSX, JAR, and APK files, so the exact application format cannot be pinned down from the header alone.' },
      { q: 'How many bytes does the tool read?', a: 'Only the first 16 bytes are sliced from the file before analysis. That window is enough for almost every signature in the database, but formats with headers deeper in the file, such as tar with its ustar marker at offset 257, cannot be confirmed and report an unknown signature.' },
      { q: 'What does the red MIME mismatch banner mean?', a: 'It means the browser-reported file.type disagrees with the MIME value derived from the magic bytes. That usually happens when a file was renamed — an executable carrying a PDF extension, for example — so treat the result as a strong signal the file should be inspected or quarantined before use.' },
      { q: 'Is my file uploaded to a server?', a: 'No. Slicing the first 16 bytes, producing the hex dump, and running the signature lookup all happen locally in your browser through the File API. Nothing is transmitted, which makes the inspector safe for confidential attachments and internal files that must never leave your machine.' },
      { q: 'Why does the browser not recognize the type?', a: 'Browsers usually derive file.type from the file extension rather than reading content, and many formats map to an empty or generic value. That is exactly why signature inspection exists: the magic bytes reflect the true container, independent of how the file was named or what the extension suggests.' },
      { q: 'Can I inspect the raw bytes myself?', a: 'Yes. After a file is loaded, the Hex dump card renders the exact bytes captured, with a hexadecimal row, an offset guide, and an ASCII column where printable characters are shown and everything else becomes a dot, so you can compare them visually with the signatures listed in the reference table.' },
    ],
    tips: [
      'The ASF header 30 26 B2 75 reveals WMV video even when the file carries a generic extension.',
      'JSON, a UTF-8 BOM, and SQLite have dedicated signatures, so text-like data still gets classified.',
      'Eyeball common patterns like FF D8 FF E0 for JPEG against the hex dump to build recognition skill.',
      'Rename a suspect file and re-run the inspector — detection never changes, which confirms its independence from extensions.',
    ],
  },
  'mime-detector': {
    intro:
      'The MIME Type Detector maps a file extension or an uploaded file to its MIME type, surfacing the standard media identifier that servers, browsers, and APIs use to interpret bytes correctly. You can type an extension such as pdf or .png in the File extension field, with or without the leading dot, or drag a file onto the dashed upload zone. When you provide both, the tool cross-checks the browser-reported file.type against the extension lookup and flags any mismatch, a telltale sign that a file was renamed or mislabelled. The Detection result section shows the extension, the MIME type, a color-coded category, and common uses for every match. If you upload a file, an extra metadata panel reports its name, formatted size, the actual browser-reported type, and the last-modified timestamp. The underlying reference table covers 118 common extensions across image, video, audio, text, and application categories, and a live search filters rows by extension, MIME value, or category. Because the lookup runs entirely on the client, nothing you type or drop leaves your machine. The tool is especially handy when configuring Content-Type headers, debugging downloads, validating uploads, or checking whether an API returned the media type you expected.',
    examples: [
      { input: 'Type "png" into the File extension field.', output: 'Extension .png, MIME type image/png, category image, uses "Lossless web images, screenshots, transparency."', note: 'The leading dot is optional; the tool strips and lowercases the input before matching.' },
      { input: 'Drop a file named cover-photo.jpg onto the upload area.', output: 'Detection result .jpg → image/jpeg plus an Uploaded file metadata grid with name, formatted size, browser-reported type, and last modified.', note: 'When extension and browser type agree, no warning appears; a mismatch would render an amber banner.' },
      { input: 'Search the reference table for "tsx".', output: 'A single filtered row: .tsx → MIME type text/typescript, category text, badge colored in the category tone.', note: 'The search box also matches full MIME strings and category names, not just extensions.' },
    ],
    howTo: [
      'Enter an extension such as "pdf" or "tsx" in the File extension field — the hint confirms the leading dot is optional.',
      'Alternatively click "Choose a file" or drop a file onto the dashed drag-and-drop zone; the loaded file name appears below the button.',
      'Read the Detection result cards for Extension, MIME type, and the color-coded Category, plus the Common uses panel.',
      'If you uploaded a file, check the Uploaded file metadata grid and any amber mismatch banner when file.type disagrees with the extension.',
      'Use the "Search extension, MIME, or category…" box in the Extension reference card to filter all 118 rows.',
    ],
    useCases: [
      'Setting correct Content-Type headers for files served from an API or static host.',
      'Auditing upload endpoints to confirm the stored media type matches the file extension.',
      'Debugging downloads that arrive as application/octet-stream because the server omitted the MIME type.',
      'Teaching or documenting file-format conventions across image, audio, text, and archive types.',
      'Flagging renamed files — for example a text file saved with a .pdf extension — for manual review.',
      'Confirming the expected MIME value before writing CDN caching or email attachment rules.',
    ],
    bestPractices: [
      'Never make security decisions from the extension alone; pair the lookup with content inspection or server-side validation.',
      'Treat a missing browser-reported file.type as "unknown" rather than a match — empty values never trigger the mismatch banner.',
      'Keep in mind MIME registrations evolve; re-check common values like text/javascript when standards bodies update the registry.',
      'Use the detections as a first pass, then confirm unusual results against the Reference table or an inspector.',
      'Search deliberately: substrings match loosely, so a query like "z" surfaces many rows while longer terms narrow results fast.',
      'Design APIs to emit the same MIME values shown here so clients parse responses without workarounds.',
    ],
    faqs: [
      { q: 'Do I need to include the leading dot?', a: 'No. The tool trims and converts the input to lowercase, then removes a leading dot before matching. Typing "png", ".png", or "PNG" all resolve to the same image/png entry, so there is no need to format the extension consistently before submitting it.' },
      { q: 'Why does the mismatch warning appear?', a: 'The tool compares the browser-reported file.type with the MIME type its database maps to the extension. When the two differ, it concludes the file may have been renamed or mislabelled and shows an amber banner. The warning is informational, and the extension lookup result stays visible so you can decide what to trust.' },
      { q: 'Does the tool read my file contents?', a: 'No. Only light metadata — the file name, size, browser-reported type, and last-modified timestamp — is held in the interface during the session. The file bytes are never read or uploaded, since the MIME lookup is driven entirely by the extension string, so your content stays on your device.' },
      { q: 'How many extensions does the reference cover?', a: 'The Extension reference card lists 118 common extensions across five categories — image, video, audio, text, and application. The full table renders in a scrollable pane until you enter a search term to narrow it. Genuinely obscure or proprietary formats show the "No MIME entry found" warning instead.' },
      { q: 'What do the category colors mean?', a: 'Each detected or listed entry carries one of five category colors: green for image, red for video, purple for audio, teal for text, and amber for application. The same color appears on the stat card accent and the badge in the reference table, so you can scan the table quickly.' },
      { q: 'Can I detect MIME types by content?', a: 'No, this tool decides solely from the extension string you provide or the file name you upload — it never inspects the bytes. If you need content-based identification, use the File Signature Inspector instead, which reads the first 16 bytes of a file and matches them against magic-number signatures.' },
    ],
    tips: [
      'Typing "jpg" and "jpeg" both return image/jpeg — the database treats them as one media type.',
      'A quick search for "font" filters straight to the TTF, OTF, WOFF, and WOFF2 rows.',
      'The mismatch banner only appears when the browser actually reports a file.type; empty values never trigger it.',
      'Pair the detector with upload validation so server-side checks reject files whose extension and type disagree.',
    ],
  },
  'color-palette-extractor': {
    intro:
      'The Color Palette Extractor analyzes an uploaded image entirely in the browser and returns its six most dominant colors as ready-to-use hex swatches. Choose a file or drop it anywhere on the dashed upload zone — PNG, JPG, WebP, and GIF are all accepted, and non-image files are rejected with a toast. The image is drawn into a tiny analysis canvas capped at 100 pixels on its longest side, which keeps processing instant even for multi-megabyte photos. Pixels are quantized into coarse six-bit color buckets so near-identical shades merge instead of splitting into thousands of noise entries, and fully or heavily transparent pixels are skipped so invisible regions never contaminate the palette. The bucket counts are then ranked, and the top six are averaged back into representative hex values. Each swatch card shows the uppercase hex code, the percentage of sampled pixels that shade covers, and the pixel count behind that percentage. Clicking any swatch copies its hex value to the clipboard with a confirmation message, and the source image preview sits beside the extracted result for comparison.',
    examples: [
      {
        input: 'Upload a sunset photograph over a beach — orange, purple, and pink sky with a dark horizon line',
        output: '6 swatches — #FB923C 21.4% · #C2410C 16.8% · #7C3AED 12.2% · #FDE68A 9.6% · #EF4444 8.1% · #312E81 6.3% · each showing its pixel count below the hex code',
        note: 'The orange family dominates because the sky fills most of the frame, while the dark horizon contributes the deepest shade. Percentages are computed from the counted opaque pixels in the 100px sample grid, so the six shown do not sum to 100.',
      },
      {
        input: 'Upload a studio product photo — a ceramic mug on a seamless light-gray background',
        output: '6 swatches — #F3F4F6 38.7% · #D1D5DB 22.3% · #9CA3AF 11.9% · #8B7D6B 10.2% · #E5E7EB 8.4% · #6B7280 5.8% · each swatch copies its hex on click',
        note: 'The neutral background captures most of the sample, so grays dominate and the warm clay tone of the mug appears as the fourth entry. Clicking any swatch copies its uppercase hex and confirms with a toast naming the copied color.',
      },
      {
        input: 'Upload a logo PNG with a large fully transparent canvas and a small opaque mark',
        output: 'Swatches reflect only the opaque mark, e.g. #0EA5E9 79.3% · #0284C7 20.7% · no swatches for the empty canvas',
        note: 'Pixels whose alpha falls below the threshold are skipped entirely before counting, so huge transparent margins never flood the palette. That is why a transparent-background logo yields colors from the graphic itself rather than the invisible canvas.',
      },
    ],
    howTo: [
      'Click Choose image or drop a file anywhere on the shaded dashed zone; an input accepts any image file type.',
      'Watch the image appear in the preview card while the browser samples it into the 100px analysis grid.',
      'Read the Extracted palette list, which always ranks the top six shades by the share of counted pixels.',
      'Note the uppercase hex, the percentage, and the pixel count printed under each colored swatch card.',
      'Click any swatch to copy its hex value; the confirmation toast announces the copied color by name.',
    ],
    useCases: [
      'Brand palette discovery — pull the dominant tones from a hero photo to seed a visual identity that will always echo key marketing imagery.',
      'Web design theming — feed a feature screenshot into the extractor and lift its primary swatches into the site\'s CSS color variables.',
      'Presentation decks — match slide background and accent colors to the photos actually used instead of guessing with an eyedropper.',
      'Social media content — design cover art and thumbnails around the palette of the imagery they will showcase.',
      'Print collateral — extract a palette from a product shot and reuse the tones across brochures and packaging in physical production.',
      'Moodboard assembly — a set of extracted palettes from several photos makes a consistent visual system without manual color decisions.',
    ],
    bestPractices: [
      'Strip EXIF and GPS metadata from images before publishing them anywhere; this extractor only reads pixels, but other viewers expose location data.',
      'Treat the output as a starting point, not a decree; a dominant background color is rarely the right brand accent even when it wins the count.',
      'Sample a few crops of the same image when you need a different balance, since each crop shifts the counted pixel distribution.',
      'Verify any extracted swatch against the Contrast Checker before pairing it with body text, since dominance says nothing about legibility.',
      'Keep original photos on hand; re-extracting after color correction gives a different palette, so agree on the source image first.',
      'Use the pixel count column to spot near-ties; if two swatches hover close, the palette is fragile under any recompression of the source.',
    ],
    faqs: [
      {
        q: 'Is my image uploaded to a server?',
        a: 'No. The image is read into a local object URL and drawn onto an in-memory canvas, so every pixel stays in your browser. Nothing is transmitted anywhere. That is also why the palette appears instantly even for large photos, and why closing the page discards the data permanently.',
      },
      {
        q: 'How many colors does the extractor return?',
        a: 'It always returns the top six most frequent shades after quantization. Only a 100-pixel analysis canvas is sampled, and near-identical colors are merged into buckets before ranking. Below the six, the remaining shades are so spread out they are discarded rather than shown.',
      },
      {
        q: 'Why are the hex codes written in uppercase?',
        a: 'The extractor normalizes every hex value to uppercase before display, so swatches look consistent and autocomplete in stylesheets never fights the case. The copied value carries the same uppercase format, matching the convention you will see in generated CSS.',
      },
      {
        q: 'What counts as a transparent pixel that gets skipped?',
        a: 'Any pixel whose alpha channel drops below 125 is ignored during analysis, and the animated region around it is not merged into any bucket. This keeps transparent PNG canvases, cutouts, and GIF frames from diluting the palette with invisible or fleeting shades.',
      },
      {
        q: 'Are GIF animations analyzed frame by frame?',
        a: 'No. The extractor decodes the image through the browser\'s standard image loader, which renders a single representative frame for sampling. Animated GIFs appear as one static frame in the preview, and that frame\'s pixels feed the palette exactly like any still image.',
      },
      {
        q: 'Why do the percentages not add up to one hundred?',
        a: 'Percentages reflect each bucket\'s share of all counted opaque pixels, but only the top six buckets are displayed. The remainder of the image is spread across thousands of tiny merged buckets that never make the list, so the visible six always sum to less than 100.',
      },
    ],
    tips: [
      'Extract from the final, color-corrected version of the image, since grading changes shift the palette and can surprise stakeholders later.',
      'Combine this tool with the contrast checker to confirm any text-on-palette accent clears the AA ratio you commit to.',
      'Copy three or four swatches in one pass while the image is fresh; closing the preview discards the canvas and you will have to re-run it.',
      'Drop the same source image on the palette extractor before and after compression to verify the swatches survive the export pipeline.',
    ],
  },
  'css-gradient-generator': {
    intro:
      'The CSS Gradient Generator constructs multi-stop gradients and emits the exact background declaration you can paste into a stylesheet. Switch between Linear and Radial with the tabs, and for linear gradients an Angle slider sweeps from 0 to 360 degrees in 5-degree steps to control direction. Color stops are the heart of the tool: each row holds a color picker, a hex field, a numeric position from 0 to 100 percent, and a position slider, and sections are numbered in order. The Add stop button appends a new stop, colored emerald by default and placed a quarter of the way back from the previous last stop, while the remove button stays disabled until you hold more than the minimum two. Stops are sorted by position before rendering, so dragging them later reorders the gradient automatically. The preview panel paints a full-width swatch with the live gradient so color changes are visible immediately. The CSS result appears in a result box prefixed with the background property, ready for one-click copy or download as gradient.css. Radial gradients always emit circle at center, radiating from the middle of the element rather than along an angle.',
    examples: [
      {
        input: 'Type Linear · Angle 135 · Stops: #7c3aed at 0% and #ec4899 at 100% (defaults)',
        output: 'background: linear-gradient(135deg, #7c3aed 0%, #ec4899 100%);',
        note: 'The two default stops combine with the 135-degree angle to produce the starter slide from violet to pink. Positions render as integers with the percent sign, and the output is wrapped in the background property for a one-line paste.',
      },
      {
        input: 'Type Radial · Stops: #0ea5e9 at 0%, #10b981 at 50%, #ec4899 at 100%',
        output: 'background: radial-gradient(circle at center, #0ea5e9 0%, #10b981 50%, #ec4899 100%);',
        note: 'Radial output always emits circle at center regardless of the angle slider, radiating outward equally in every direction. The three stops create a sky-to-teal-to-pink center-out fade for a spotlight accent.',
      },
      {
        input: 'Type Linear · Angle 90 · Stops added in the order #7c3aed at 0%, #10b981 at 100%, then #ec4899 at 50%',
        output: 'background: linear-gradient(90deg, #7c3aed 0%, #ec4899 50%, #10b981 100%);',
        note: 'Stops are sorted by position before output, so the entry order of #10b981 at 100 then #ec4899 at 50 is reordered into 0, 50, and 100 percent. Every position is clamped to the 0-100 range even if a number field was typed out of bounds.',
      },
    ],
    howTo: [
      'Pick Linear or Radial from the tab strip at the top; radial mode hides the angle control and adds a short note about center radiation.',
      'Drag the Angle slider for the gradient direction in degrees; the hint shows the current value as you move it.',
      'Edit each Color stop\'s color with the picker or hex field, and set its position with the number input or the slider.',
      'Click Add stop to append another color row, or the trash icon to remove a stop while more than two remain.',
      'Copy the CSS from the result box or download it as gradient.css, then paste the background declaration straight into your stylesheet.',
    ],
    useCases: [
      'Landing page heroes — a diagonal linear gradient between two brand colors gives a header depth behind the headline and CTA.',
      'CTA buttons — a tight two-stop gradient with strong contrast between stops makes the invite action feel tactile and clickable.',
      'Section dividers — a soft radial fade from a light accent color into the page background transitions related blocks gracefully.',
      'Social media banners — export a gradient as the base of cover art, then overlay text and icons in a consistent brand palette.',
      'Marketing emails — a compact linear gradient keeps an intro block on-brand inside clients that ignore background images.',
      'Product onboarding screens — radial gradients focus attention on a central illustration instead of scattering it across the screen.',
    ],
    bestPractices: [
      'Keep stop positions monotonic by dragging them into order; the generator sorts automatically, but tidy input keeps the preview intuitive.',
      'Clamp positions to the 0-100 range manually if you type values; out-of-range positions get clamped on render, so verify the preview.',
      'Use radial gradients for spotlight effects over a background element and reserve linear diagonals for directional transitions.',
      'Test any text overlaid on the gradient against the actual blend using the contrast checker, since mid-gradient colors are darker than either stop.',
      'Limit a single gradient to three or four stops; more bands read as visual noise and awkward color compression in smooth transitions.',
      'Copy the background property from the result box rather than retyping it, so the exact declaration ships into the stylesheet unchanged.',
    ],
    faqs: [
      {
        q: 'What is the difference between linear and radial?',
        a: 'Linear gradients paint color perpendicular to a direction set by the angle, from one side of the element to the edge opposite it. Radial gradients radiate circle at center, spreading outward from the middle in all directions. That is why the angle slider belongs only to the linear tab.',
      },
      {
        q: 'Why does the angle slider use five-degree steps?',
        a: 'The slider advances in 5-degree increments so precision stays high without endless fiddling, moving from 0 to 360 degrees across the full sweep. Common angles like 45, 90, and 135 all land neatly on the grid, and the hint label always shows the current value.',
      },
      {
        q: 'Can I add more than two color stops?',
        a: 'Yes. The Add stop button appends an extra row in emerald, so you can layer as many stops as the design needs. The remove button stays active only while more than two stops remain, enforcing the CSS minimum of two handles and preventing an empty gradient declaration.',
      },
      {
        q: 'Do stop positions need to be in order as typed?',
        a: 'No. The generator sorts all stops by their position before building the CSS, so the preview and the output always read from lowest to highest percentage. You can enter or drag them in any order and the emitted declaration reflects the sorted sequence automatically.',
      },
      {
        q: 'What does the position percentage actually control?',
        a: 'The position marks where along the gradient a color reaches its full intensity, with 0 percent at one edge and 100 at the other for linear, and 0 at the center outward for radial. Moving a stop reweights the blend between its neighbors, which the preview shows instantly.',
      },
      {
        q: 'Is the output a complete CSS rule?',
        a: 'The result box emits the full background declaration, like background: linear-gradient(135deg, #7c3aed 0%, #ec4899 100%);, ready to drop into any rule. Add your own selector and braces around it, or download gradient.css containing the declaration to keep for reference.',
      },
    ],
    tips: [
      'Save your most-used three-stop combinations from this tool into design tokens; they stay consistent across every page that reuses them.',
      'Test the gradient against both light and dark text by pasting the two overlaid colors through the contrast checker before publishing.',
      'Angles ending in 5 or 0 tend to read as intentional direction; off-angle values like 137 feel slightly organic in large hero panels.',
      'After adding a stop at 75 percent as a midpoint, drag it slightly and re-copy; the output changes live, so recopy after every tweak.',
    ],
  },
  'image-resizer': {
    intro:
      'The Image Resizer downsizes or upscales any image to exact pixel dimensions and lets you download the result in PNG or JPEG format. Choose a file with the button or drop it anywhere on the dashed zone, and the tool reads its natural dimensions, shows them in the Original stat, and pre-fills the Width and Height fields. A Maintain aspect ratio switch keeps the proportions locked by default, so editing width recomputes height from the original ratio and vice versa, with both values rounded to whole pixels. Flip the switch off to distort the image deliberately for a specific slot like a banner or avatar. The Format select switches between lossless PNG and JPEG, and JPEG output fills the canvas with pure white behind any transparent areas. Resizing runs on a canvas with high-quality smoothing, so downscaled photos stay crisp. Stat cards report the original dimensions, the new size, and the current file size in bytes, kilobytes, or megabytes, while a preview card shows the rendered result. Clicking Download resized saves a file named after your original with the target dimensions, such as landscape-1200x900.jpg.',
    examples: [
      {
        input: 'Upload a 4032×3024 JPG photo · Width 1200 · Height auto (aspect locked) · Format PNG',
        output: 'Original 4032×3024 · New size 1200×900 · File size shown in the stat card · Download name photo-1200x900.png',
        note: 'The original 4:3 ratio carries into the resize, so entering 1200 for width auto-computes height as 900. The File size stat formats the output blob as KB to two decimals or as MB when it crosses the threshold.',
      },
      {
        input: 'Upload an 800×800 PNG logo with transparent background · Keep 240×240 · Format PNG',
        output: 'Original 800×800 · New size 240×240 · Transparent regions preserved · Download name logo-240x240.png',
        note: 'With both fields set and the ratio locked, the square logo scales evenly to 240×240 and the canvas keeps its transparency in PNG. Switching the Format select to JPEG would fill the canvas with white before drawing the logo.',
      },
      {
        input: 'Upload a 1920×1080 16:9 video still · Maintain aspect ratio OFF · Width 800 · Height 600 · Format JPEG',
        output: 'Original 1920×1080 (16:9) · New size 800×600 (4:3) · Downloaded as still-800x600.jpg',
        note: 'With the ratio lock off, the 800 and 600 values apply independently, so the 16:9 frame is compressed into a 4:3 box and the image distorts. The JPEG output gains a white fill behind any transparent regions before compression.',
      },
    ],
    howTo: [
      'Click Choose image or drop a file onto the dashed zone; the filename appears below the button once accepted.',
      'Set the Width and Height values in pixels; the Original stat shows the source dimensions as your reference point.',
      'Drag the Maintain aspect ratio switch on to keep proportions, or off to stretch the image into non-native shapes.',
      'Choose PNG or JPEG from the Format select; JPEG flattens transparency to white.',
      'Check the New size and File size stats plus the preview, then click Download resized to export your file.',
    ],
    useCases: [
      'Responsive hero images — resize the full-resolution shot to your exact header width and shave the file size on the wire.',
      'Social media assets — produce the pixel-perfect 1200×630 or 1080×1080 covers that each platform expects for a clean card.',
      'E-commerce thumbnails — batch-reduce product photos to a consistent 800×800 square for uniform carousels and quick page loads.',
      'Email-safe headers — fit images inside typical 600px email columns so mail clients never downscale them mid-render.',
      'Blog featured images — standardize 1200×630 for Open Graph telemetry that renders consistently across search and social previews.',
      'Forum and avatar uploads — shrink portraits to the few hundred pixels many systems require before uploading the original.',
    ],
    bestPractices: [
      'Choose the final export format first — JPEG for photos with smooth gradients, PNG for logos, icons, and anything needing transparency.',
      'Check the new file size in the stat card before downloading; a resized photo that stays over a megabyte still defeats the purpose.',
      'Keep aspect ratio locked for people photos; accidental distortion in width-only or height-only editing is the most common amateur mistake.',
      'Export the exact dimensions your target layout needs rather than resizing twice, since each pass costs a generation of sharpness.',
      'Verify that upscaling an image is intentional; the tool preserves the aspect ratio, but enlarging a small source rarely adds real detail.',
      'Re-download after switching format, since the PNG and JPEG versions of the same resize differ in transparency handling and file weight.',
    ],
    faqs: [
      {
        q: 'How does the aspect ratio lock work?',
        a: 'With Maintain aspect ratio on, editing the width field recomputes the height from the original ratio and vice versa, rounding to whole pixels. The saved ratio comes from the source image\'s natural dimensions. Turning the switch off lets the two fields govern independently for deliberate stretching.',
      },
      {
        q: 'What happens to transparent backgrounds in JPEG?',
        a: 'JPEG cannot store alpha, so the tool fills the canvas with pure white before drawing the image, flattening transparency. If you need to keep cutouts or transparent margins, export as PNG instead. The white fill only kicks in for the JPEG format selection.',
      },
      {
        q: 'Are my images uploaded to a server?',
        a: 'No. The file is read through a local object URL and redrawn onto a canvas in your browser, and the output is generated there as a blob. Nothing is transmitted, which also explains why resizing works instantly on large files and why closing the page discards everything.',
      },
      {
        q: 'Why is the file size showing as a dash?',
        a: 'The File size stat only fills in after the resized image has been produced. A dash means no processed blob is ready yet — typically because no file is loaded or the width and height are still zero. Load an image and set both dimensions to populate the stat.',
      },
      {
        q: 'Can the tool enlarge an image beyond its original size?',
        a: 'Yes, upscaling is allowed because the width and height fields accept any positive pixel value and the ratio lock prevents accidental stretching. Keep in mind enlarging a small source cannot create detail that was never captured, so preview the result before downloading.',
      },
      {
        q: 'How is the downloaded file name constructed?',
        a: 'The tool strips the original file extension, appends the new width and height, and adds the matching extension for the chosen format. A photo named header.jpg resized to 1200×900 as PNG downloads as header-1200x900.png, and in JPEG it becomes header-1200x900.jpg.',
      },
    ],
    tips: [
      'Resize to the largest size a layout could need, then let browsers scale down responsively; a single 1200px file covers desktop and mobile.',
      'Match your JPEG export to the actual content, since photos tolerate compression well but sharp text and logos show artifacts fast.',
      'Preview each width editing pass against the Original stat to keep track of exactly how aggressively you are reducing the image.',
      'Batch by fixing one dimension first — an even width — so the height follows the ratio and every output stays consistent across a set.',
    ],
  },
  // ── image-compressor ──

  'image-compressor': {
    intro:
      'The Image Compressor shrinks photos and graphics entirely inside your browser, so your images never travel to a server while you optimize them. Drop in a PNG, JPG, or WebP, choose an output format, drag the quality slider, and download a re-encoded file seconds later. The interface tracks original and compressed sizes side by side, a savings percentage, and the image dimensions, with a paired preview so you can judge visible quality loss before committing. A quality slider spanning 0.1 to 1.0 (default 0.7) and an output format selector for JPEG and WebP give you fine control over the size-versus-fidelity trade-off. Because re-encoding happens on a canvas with a white fill, JPEG output never picks up an unwanted black background from transparency. This client-side image compression workflow matters most where page speed is a ranking factor: hero images, portfolio shots, and product photos routinely drop by 60 to 90 percent in file size, cutting Core Web Vitals load time and bandwidth costs. For anyone who wants to optimize JPEG and WebP images for faster websites without trusting a third-party upload service, this tool is a safer, faster alternative to server-side compressors.',
    examples: [
      { input: 'A 4.2 MB portrait photo saved as PNG, quality set to 0.7 with JPEG output.', output: 'A 380 KB hero-photo-compressed.jpg at the same pixel dimensions.', note: 'PNG photographs compress dramatically when flattened to JPEG; the white canvas fill keeps backgrounds clean.' },
      { input: 'A 1.8 MB product screenshot in PNG, output format switched to WebP at quality 0.8.', output: 'A 210 KB shot-compressed.webp with 88.3% savings shown in the stats row.', note: 'WebP is ideal for screenshots with flat color areas; the side-by-side preview confirms text stays crisp.' },
      { input: 'A 900 KB JPEG with a white background, quality lowered to 0.5.', output: 'A 240 KB image-compressed.jpg with visible smoothing in fine gradients.', note: 'Push the slider lower for thumbnails and email attachments where maximum quality is not required.' },
    ],
    howTo: [
      'Click the "Choose image" button or drop a PNG, JPG, or WebP onto the dashed upload area.',
      'Adjust the "Quality" slider — the hint next to the label shows the current value, e.g. 0.70.',
      'Pick JPEG or WebP in the "Output format" dropdown.',
      'Review the Original / Compressed stats and the side-by-side preview to check the trade-off.',
      'Click "Download compressed" to save the file as <name>-compressed.jpg or <name>-compressed.webp.',
    ],
    useCases: [
      'Compressing hero images before uploading them to a CMS so pages load faster.',
      'Shrinking product photos for an e-commerce catalog without losing buyer-appealing detail.',
      'Converting PNG screenshots to WebP for a documentation site on a tight bandwidth budget.',
      'Preparing email attachments under strict size limits set by a mail server.',
      'Reducing portfolio images to meet a static hosting platform\'s file size caps.',
      'Flattening transparent PNG logos into JPEG versions for print or legacy viewers.',
    ],
    bestPractices: [
      'Start at the default 0.7 quality and only push lower if the preview shows acceptable loss.',
      'Prefer WebP output for web use — it usually wins on size at equal quality for photographs.',
      'Export JPEGs with a white-filled canvas in mind, since transparency is flattened during conversion.',
      'Compare the Savings stat against the preview rather than chasing the biggest percentage.',
      'Compress before uploading, not after — originals stay full-quality while the site serves the smaller copy.',
      'Avoid re-compressing already-optimized JPEGs, which can compound artifacts.',
    ],
    faqs: [
      { q: 'Does the Image Compressor upload my photos to a server?', a: 'No. Every step — loading the file, drawing it on a canvas, and encoding the result — runs in your browser. The tool only writes a downloadable blob at the end, so private photos never leave your machine.' },
      { q: 'What output formats can I choose?', a: 'The "Output format" dropdown offers JPEG and WebP. JPEG is universally compatible, while WebP typically produces smaller files at the same quality and is supported by all modern browsers and image editors.' },
      { q: 'Why does my transparent PNG get a white background?', a: 'JPEG and the encoder used here cannot store alpha transparency, so the tool paints a white background on the canvas before drawing your image. The preview shows this before you download.' },
      { q: 'Does the quality slider resize my image?', a: 'No, dimensions stay identical — only the encoding quality changes. You get the same pixel width and height with a smaller file, which is exactly what page-speed optimization usually wants.' },
      { q: 'What quality value should I use for photos?', a: 'A value between 0.6 and 0.8 is a good default for photographs. Values below 0.5 begin to show banding and blur; use the side-by-side preview to spot it.' },
      { q: 'Can I process animated or multi-page images?', a: 'No. The canvas pipeline handles a single still image per run. Animated formats are decoded to their first frame, so use a dedicated animation tool for GIFs or APNGs.' },
    ],
    tips: [
      'Drag the quality slider while watching the Compressed stat — savings update live.',
      'Use WebP when your site already serves WebP variants via a CDN.',
      'The Dimensions stat confirms nothing was resized during compression.',
      'Re-pick a file at any time; previous previews are cleaned up automatically.',
    ],
  },
  // ── favicon-generator ──

  'favicon-generator': {
    intro:
      'The Favicon Generator produces ready-to-use favicon PNGs in every size modern browsers expect, from a text monogram or a source image. Switch between the "From Text" and "From Image" tabs to pick your approach. In text mode you type one or two characters, set the font size, and choose background and text colors; the tool then renders your initials on a canvas at 16, 32, 48, 64, and 180 pixels. Image mode accepts PNG, JPG, WebP, or SVG files and center-crops them to fit each square, keeping logos legible at the smallest sizes. Every size gets its own PNG download button, and "Download all sizes" grabs the full set in one click. This favicon PNG set generator answers a real workflow need: hand-exporting a logo at five sizes in an editor is tedious, and online generators usually require uploads to third-party servers. Here the rendering is purely client-side, so a brand-in-progress logo never leaves your machine. Whether you are refreshing a browser tab icon or building a web app manifest, this tool turns minutes of editor work into a few clicks.',
    examples: [
      { input: 'From Text tab: text "FL", background #0f172a, text color #f8fafc, font size 80%.', output: 'Five PNGs (favicon-16x16.png through favicon-180x180.png) with a dark slate square and bold cream "FL" centered.', note: 'The default palette matches the site theme; two-character monograms render crisply even at 16px.' },
      { input: 'From Image tab: a 1024×1024 square logo PNG.', output: 'The logo scaled and center-cropped into 16, 32, 48, 64, and 180 pixel squares.', note: 'The high-quality smoothing keeps edges clean; the checkerboard preview reveals any transparency.' },
      { input: 'From Text tab: text "A", background #ffffff, text color #000000, font size 200%.', output: 'A high-contrast black "A" filling most of the white square across all five sizes.', note: 'Raising font size above 100% is a quick way to make a single letter fill the canvas.' },
    ],
    howTo: [
      'Pick the "From Text" or "From Image" tab at the top of the tool.',
      'For text: enter 1–2 characters, adjust the "Font size" percentage, and set the Background and Text color pickers.',
      'For an image: click "Choose image" and select a square PNG, JPG, WebP, or SVG.',
      'Review the generated favicons grid with its checkerboard previews.',
      'Click the "PNG" button under any size, or use "Download all sizes" for the complete set.',
    ],
    useCases: [
      'Creating a browser tab icon for a new startup before a designer delivers final brand assets.',
      'Generating all five sizes needed by a web app manifest in one pass.',
      'Building a text-monogram favicon for a personal blog that has no logo yet.',
      'Exporting a 180px Apple touch icon from an existing logo.',
      'Previewing how a logo degrades at 16px before committing to a redesign.',
      'Producing a favicon set for a local dev server without installing image tools.',
    ],
    bestPractices: [
      'Start from a square image — the center-crop preserves the middle of the logo where the detail lives.',
      'Keep text monograms to two characters or fewer so strokes stay visible at 16px.',
      'Use the checkerboard preview to check that transparency behaves the way you expect.',
      'Pick high-contrast text and background colors; muted pairs disappear at browser-tab sizes.',
      'Download the full set rather than a single 16px file when the site will run on Apple devices too.',
    ],
    faqs: [
      { q: 'Which favicon sizes does the generator produce?', a: 'It renders 16, 32, 48, 64, and 180 pixel squares. The 180px file works as an Apple touch icon, while the smaller sizes cover browser tabs, bookmarks, and most manifest requirements.' },
      { q: 'Can I generate a favicon from text?', a: 'Yes — the "From Text" tab accepts one or two characters, a font size from 20 to 200 percent, and separate background and text colors, then renders the monogram at all five sizes.' },
      { q: 'What image formats are accepted in image mode?', a: 'The picker accepts any image/* file, including PNG, JPG, WebP, and SVG. Square sources work best because the tool scales and center-crops to each target size.' },
      { q: 'Do I need to download every size?', a: 'Only if your site targets Apple devices and older browsers. At minimum, grab the 16px and 32px PNGs for modern browsers, or use "Download all sizes" to be safe.' },
      { q: 'Why does my logo look blurry at 16px?', a: 'Fine details cannot survive a 16px raster. Simple shapes and bold strokes hold up best; the preview grid shows exactly how each size will appear in a browser tab.' },
      { q: 'Is the text monogram exported as a vector or PNG?', a: 'All output is PNG, rasterized on a canvas. If you need a scalable favicon, use the SVG source elsewhere or export your logo as SVG from your design tool.' },
    ],
    tips: [
      'Try font size 80–120% for balanced monograms that don\'t touch the edges.',
      'Click an individual "PNG" button to grab just the size your manifest needs.',
      'The 180px preview doubles as an Apple touch icon check.',
      'Swap tabs without losing work — each mode keeps its own settings.',
    ],
  },
  // ── social-image-generator ──

  'social-image-generator': {
    intro:
      'The Social Image Generator designs Open Graph share cards on a live 1200 × 630 canvas, the exact dimensions that Facebook, LinkedIn, and X crop and display in link previews. Type a title and an optional subtitle, pick one of six curated gradients — Sunset, Ocean, Forest, Berry, Charcoal, or Amber — or switch to a solid color, then tune the text color. The renderer draws a subtle vignette overlay, wraps long titles across multiple lines, and automatically shrinks the headline from 84px down to a readable minimum so nothing overflows the frame. A "Fernandes Labs" brand mark sits in the bottom-right corner by default. Export happens with one click to a social-image.png file, and the tool also emits a matching CSS background snippet you can paste into a stylesheet. Because everything renders locally on a canvas, this free OG image generator keeps draft campaigns private. For developers and marketers who would rather not open Photoshop to ship a shareable link preview, the tool collapses the design loop into minutes — write, preview, export, and paste the og:image meta tag.',
    examples: [
      { input: 'Title "Build better tools with Fernandes Labs", subtitle "A modern developer toolkit, crafted with care.", Sunset gradient, white text.', output: 'A 1200×630 PNG with an orange-to-peach diagonal gradient, vignette, and two lines of centered-left white text.', note: 'The defaults ship as a complete, presentable card — only the wording needs changing.' },
      { input: 'Title "Launching the API in public beta", subtitle left empty, Background set to "Solid color" with #0f172a, text color #ffffff.', output: 'A dark navy card with just the headline, vertically centered, and the brand mark in the corner.', note: 'Clearing the subtitle removes the second line entirely, so the headline gets more room.' },
      { input: 'A long headline like "Everything we learned rewriting our search pipeline in Rust over six months" with the Ocean gradient.', output: 'The title wraps to two or three lines and the font size shrinks automatically from 84px to fit.', note: 'The auto-fit logic guarantees no clipping, even for wordy titles.' },
    ],
    howTo: [
      'Enter your headline in the "Title" field and optional supporting text in "Subtitle".',
      'Choose a preset in the "Background" dropdown, or select "Solid color" and pick a custom fill.',
      'Set the "Text color" with the color picker or the hex input next to it.',
      'Review the live 1200 × 630 canvas preview; long titles wrap and shrink automatically.',
      'Click "Download PNG" to save social-image.png, and copy the CSS snippet if you need a matching background.',
    ],
    useCases: [
      'Creating an og:image for a blog post so shared links render with a branded card.',
      'Designing consistent X and LinkedIn share images for a product launch series.',
      'Producing a fallback card for pages that currently lack any social preview image.',
      'Making announcement cards for a Discord community or newsletter archive.',
      'A/B testing gradient versus solid backgrounds for higher click-through on shares.',
      'Generating quick placeholder cards while a designer prepares final artwork.',
    ],
    bestPractices: [
      'Keep titles under 12 words so the auto-fit keeps the font near its largest size.',
      'Verify white text against lighter gradients — Charcoal and solid dark fills are safest.',
      'Match the gradient to your brand palette rather than picking purely by preference.',
      'Leave the subtitle empty for bold, single-message announcements.',
      'Preview at small sizes too, since social feeds show cards at roughly 600px wide.',
    ],
    faqs: [
      { q: 'What dimensions is the exported social image?', a: 'The canvas is fixed at 1200 × 630 pixels, the standard Open Graph image size. It matches the aspect ratio that most social platforms display in link previews.' },
      { q: 'Can I use my own background color?', a: 'Yes. Choose "Solid color" in the Background dropdown and set any hex color with the picker or text input. The six gradient presets are fixed pairs.' },
      { q: 'How does the generator handle long titles?', a: 'The renderer wraps text across lines and reduces the font size step by step, from 84px down to 36px, until the whole headline fits inside the card without clipping.' },
      { q: 'Does the exported image include the Fernandes Labs mark?', a: 'Yes, a small "Fernandes Labs" wordmark is drawn in the bottom-right corner at reduced opacity. It is part of the rendered canvas and cannot be toggled off.' },
      { q: 'What is the CSS snippet for?', a: 'It shows the equivalent background and text color as a CSS declaration, useful when you want the share image to blend with the same colors on your landing page.' },
      { q: 'Can I export at other sizes like 1080×1080?', a: 'No, output is always 1200×630. For square feed images you would need to crop afterwards or use a different generator.' },
    ],
    tips: [
      'Change any field and the preview redraws instantly — no apply button needed.',
      'The vignette darkens the bottom edge, so short cards still feel balanced.',
      'Use the same gradient name across a series for instant visual consistency.',
      'Test your headline in both the preview and the downloaded PNG to confirm font loading.',
    ],
  },
  // ── svg-viewer ──

  'svg-viewer': {
    intro:
      'The SVG Viewer renders raw vector markup the moment you paste it, giving designers and developers an instant, sandboxed preview of SVG code without opening a design tool. Beyond the live canvas, the tool reports four statistics that update as you type: parsed dimensions, whether a viewBox is present, the number of elements in the document, and the file size in bytes. A background selector swaps the preview between a transparency checkerboard, white, and dark slate, so you can judge how artwork reads on both light and dark interfaces. A zoom control scales the render to 50, 100, or 200 percent for pixel-level inspection. Validation is built in: malformed XML, an empty input, or a root element that is not an svg produces a clear error panel instead of a broken render, and the Download SVG button stays disabled until the markup parses cleanly. A "Load sample" button drops in a demo graphic showing a gradient, a circle, and a path. For anyone debugging why an icon renders off-center or whether an export will scale cleanly, this live SVG markup previewer answers questions in seconds — entirely client-side, with no external resources fetched.',
    examples: [
      { input: `Pasting: <svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="#6366f1"/></svg>`, output: 'A blue circle rendered on the checkerboard; stats show Dimensions 100×100, viewBox Yes, Elements 2, file size ~86 B.', note: 'The viewBox stat confirms the graphic will scale without clipping.' },
      { input: 'A path exported from a design tool, with the Background selector set to "Dark".', output: 'The same artwork redrawn against #0f172a, exposing light-colored strokes that were invisible on white.', note: 'Checking both light and dark backgrounds prevents surprises on dark-mode UIs.' },
      { input: 'A truncated snippet like <svg><rect width="100" /></svg> missing a closing tag.', output: 'A red "Cannot render SVG" panel with the message "Malformed XML — check for unclosed tags or invalid syntax."', note: 'The validator catches the problem before it becomes a confusing blank preview.' },
    ],
    howTo: [
      'Paste or type SVG markup into the "SVG markup" textarea, or click "Load sample" for a demo.',
      'Pick a preview background in the "Background" dropdown — Checkerboard, White, or Dark.',
      'Set the "Zoom" selector to 50%, 100%, or 200% as needed.',
      'Read the Dimensions, viewBox, Elements, and File size stats to understand the document.',
      'Click "Download SVG" once the markup validates to save it as image.svg.',
    ],
    useCases: [
      'Quickly previewing an SVG icon a teammate shared in a chat message.',
      'Checking whether an exported vector includes a viewBox before adding it to a sprite.',
      'Comparing how a logo reads on white versus dark backgrounds.',
      'Counting elements in a complex SVG to estimate rendering cost.',
      'Validating hand-written markup for unclosed tags during icon editing.',
      'Inspecting scaled artwork at 200% zoom to catch stray nodes.',
    ],
    bestPractices: [
      'Always confirm the viewBox stat reads Yes before reusing an SVG in responsive layouts.',
      'Switch backgrounds when reviewing artwork that relies on light or dark colors.',
      'Watch the element count on complex graphics — hundreds of nodes can bloat a page.',
      'Fix validation errors before downloading, since the button stays disabled otherwise.',
      'Use the file size stat to spot exports carrying hidden bloat like embedded bitmaps.',
    ],
    faqs: [
      { q: 'Does the SVG Viewer load external resources from my SVG?', a: 'No. The preview is rendered inline on the page from your own input only, and no external files are fetched. Remote images or fonts referenced inside the markup will not be loaded.' },
      { q: 'Why does the preview show a parse error?', a: 'The tool runs your markup through an XML parser first. Unclosed tags, stray characters, or a root element that is not svg triggers the error panel with a specific message.' },
      { q: 'What does the viewBox stat tell me?', a: 'It indicates whether the root svg element declares a viewBox attribute. A viewBox lets the graphic scale to any container, so "No" is a common cause of clipped icons.' },
      { q: 'What zoom levels are available?', a: 'The Zoom selector offers 50%, 100%, and 200%. The render is scaled around the center of the preview area, so larger zooms push edges into the scrollable container.' },
      { q: 'Can I download my SVG from the viewer?', a: 'Yes, the "Download SVG" button exports exactly what you pasted as image.svg, but only after the markup validates without errors.' },
      { q: 'How is the file size calculated?', a: 'The size stat is the byte length of the SVG text itself, computed from a Blob of your input. It updates live as you edit.' },
    ],
    tips: [
      'Edit the textarea and watch stats update on every keystroke.',
      'Use the checkerboard to reveal where your artwork is transparent.',
      'The sample graphic doubles as a syntax reference for gradients.',
      'Zoom to 200% when hunting for tiny misaligned path segments.',
    ],
  },
  // ── file-size-converter ──

  'file-size-converter': {
    intro:
      'The File Size Converter turns any value in bytes, kilobytes, megabytes, gigabytes, terabytes, or petabytes into its equivalent in every other unit — instantly and with binary (1024) math. Enter a value, pick the source unit, and the tool fills a table with all six conversions, plus two summary stats: the exact byte count and a human-readable form that automatically picks the most sensible unit for display. Preset chips for familiar media — a 1.44 MB floppy, a 700 MB CD, a 4.7 GB DVD, a 25 GB Blu-ray, and a 1 TB hard drive — load realistic starting points in one click. Negative values are handled gracefully with an amber warning, and the human-readable stat even preserves the sign, so the converter doubles as a sanity check for odd inputs. Anyone wrangling upload limits, storage specs, or download math has hit the classic 1000-versus-1024 confusion; this KB to MB and GB calculator resolves it by always using the binary convention operating systems and file managers actually report. For developers setting up file upload validation, comparing cloud storage tiers, or explaining why a "1 TB" drive shows 931 GB, the tool gives the answer with a single glance.',
    examples: [
      { input: 'Value 1536, Unit B (the default).', output: '1.5 KB, 0.0014648438 MB, 1.4305114746e-6 GB in the conversions table; human-readable reads "1.5 KB".', note: '1536 bytes is exactly 1.5 KiB, a common allocation-unit size.' },
      { input: 'Value 4.7, Unit GB, or a click on the "4.7 GB DVD" preset.', output: 'In bytes 5,046,586,572.8 and a table showing 4.7 GB, 0.0045898438 TB, and 4,812.8 MB.', note: 'The byte stat reveals why DVDs advertise decimal gigabytes that filesystems never quite match.' },
      { input: 'Value 1, Unit TB with the "1 TB HDD" preset.', output: '1,099,511,627,776 bytes, 1024 GB, 1048576 MB — the classic discrepancy behind the "missing" 69 GB on a drive.', note: 'Binary conversion explains the marketing-vs-actual capacity gap in one table.' },
    ],
    howTo: [
      'Type a number into the "Value" field (1536 is pre-filled).',
      'Choose the source unit in the "Unit" dropdown — B, KB, MB, GB, TB, or PB.',
      'Optionally tap a preset chip like "700 MB CD" to load a realistic value.',
      'Read the Input value, In bytes, Human-readable, and Status stats.',
      'Scroll the "All conversions" table for the equivalent in every unit.',
    ],
    useCases: [
      'Converting an upload limit of 2 MB into bytes for a form validation rule.',
      'Checking how many 4.7 GB DVD-equivalents a 25 GB Blu-ray image holds.',
      'Explaining the decimal-versus-binary capacity gap on a new hard drive.',
      'Estimating how many photos fit in a 1 TB backup plan.',
      'Normalizing file sizes logged in different units by a monitoring script.',
      'Teaching students the difference between KB and KiB using the presets.',
    ],
    bestPractices: [
      'Remember the tool always uses 1024-based math, matching what file managers display.',
      'Use the human-readable stat when presenting sizes to end users — it picks the best unit.',
      'Check the Status stat for Zero or Negative results before trusting odd inputs.',
      'Use preset chips as anchors instead of re-typing common media sizes.',
      'For decimal marketing numbers, treat the byte count as the source of truth.',
    ],
    faqs: [
      { q: 'Which base does the File Size Converter use?', a: 'It uses the binary base of 1024 between every step, matching how operating systems report file sizes. One kilobyte here equals 1024 bytes, not the decimal 1000 used in marketing.' },
      { q: 'What units are supported?', a: 'Bytes, kilobytes, megabytes, gigabytes, terabytes, and petabytes. The unit dropdown shows both the abbreviation and the full name for each.' },
      { q: 'Why does my 1 TB drive show 931 GB?', a: 'Drive manufacturers count in decimal (1000-based) units, but the converter — like your OS — uses 1024-based units. Entering 1 TB here yields 1,099,511,627,776 bytes, which rounds to about 931 binary gigabytes.' },
      { q: 'Can the converter handle negative numbers?', a: 'Yes. Negative values are converted mathematically and flagged with an amber warning, since they are unusual for real file sizes but valid for deltas and calculations.' },
      { q: 'What is the human-readable output?', a: 'A formatted string that picks the largest unit under 1024, so 1536 bytes becomes "1.5 KB" and 5,000,000 bytes becomes "4.77 MB". It even keeps the sign for negatives.' },
      { q: 'Are the preset values editable?', a: 'The preset chips load their value and unit into the main inputs, which you can then modify freely. They are shortcuts, not locked configurations.' },
    ],
    tips: [
      'Tap a preset chip to pre-fill both the value and unit at once.',
      'The In bytes stat is the exact figure to copy into code or configs.',
      'Watch the Status stat turn amber when you enter a negative number.',
      'Use the table row badge to spot which unit matches your input.',
    ],
  },
  // ── alt-text-generator ──

  'alt-text-generator': {
    intro:
      'The Alt Text Generator turns a plain description into three ready-to-copy alt text suggestions tailored to the image\'s job on the page. Choose a context — decorative, icon button, linked image, content, or photograph — and a tone of concise or detailed, and the tool applies the right template patterns: functional images describe the action, linked images name the destination, and decorative images correctly collapse to an empty alt attribute. A link target field appears when you pick the linked-image context, so suggestions can say where the image points. Each variation is a click-to-copy button, and the tool also builds a complete HTML snippet like <img src="image.jpg" alt="..." /> with attributes properly escaped. A WCAG guidance panel walks through the 1.1.1 Non-text Content success criterion, including the rule that screen readers already announce the image role, so phrasing like "image of" is redundant. For content editors and developers who want accessible image descriptions that comply with WCAG without memorizing the spec, this generator offers a fast, correct starting point — with the honest caveat, printed right in the interface, that human review is still required.',
    examples: [
      { input: 'Description "a golden retriever puppy playing fetch in a park", Context "Content / illustration", Tone "Concise".', output: 'Variants: "A golden retriever puppy playing fetch in a park.", "Illustration: a golden retriever puppy playing fetch in a park", "A golden retriever puppy playing fetch in a park" plus the HTML snippet.', note: 'The default description ships pre-filled so the tool demonstrates itself on load.' },
      { input: 'Description "download report", Context "Icon button", Tone "Detailed".', output: 'Variants: "Icon: download report", "Button showing download report", "Download report button".', note: 'Button context frames the action rather than the icon\'s appearance.' },
      { input: 'Context "Decorative (alt=\"\")" with any description.', output: 'A green notice "Use empty alt text" and an HTML snippet with alt="" — all three variant slots are intentionally empty.', note: 'Decorative images should be hidden from assistive technology entirely.' },
    ],
    howTo: [
      'Describe what the image shows in the "Image description" field.',
      'Pick the matching "Context" — Decorative, Icon button, Linked image, Content / illustration, or Photograph.',
      'Choose "Concise" or "Detailed" in the "Tone" selector.',
      'If you selected Linked image, fill in the "Link target" field that appears.',
      'Click any of the three suggested variants to copy it, or grab the HTML snippet below.',
    ],
    useCases: [
      'Writing alt text for blog illustrations during a content migration to accessible templates.',
      'Labelling icon-only buttons in a web app toolbar during an accessibility audit.',
      'Generating descriptive text for product photographs on an e-commerce listing.',
      'Handling linked banner images by describing both the image and its destination.',
      'Teaching content editors correct empty-alt usage for decorative imagery.',
      'Producing consistent, reviewed alt text across a multi-author publishing team.',
    ],
    bestPractices: [
      'Choose the context first — it changes the entire template the generator applies.',
      'Prefer Concise tone for production markup; Detailed is useful for audits and drafts.',
      'Keep descriptions under 125 characters to stay within screen-reader brevity guidance.',
      'For decorative images, accept the empty alt suggestion rather than forcing a description.',
      'Always re-read generated variants against the actual image before publishing.',
    ],
    faqs: [
      { q: 'Which contexts does the Alt Text Generator support?', a: 'Five: decorative, icon button, linked image, content/illustration, and photograph. Each applies different wording patterns, because the correct alt text depends on the image\'s function, not just its content.' },
      { q: 'Why does the decorative context return empty text?', a: 'Purely decorative images should be hidden from screen readers with alt="". The tool shows the empty-attribute guidance and emits a snippet with alt="" instead of inventing text.' },
      { q: 'Does the generator write the HTML for me?', a: 'Yes. The HTML snippet section outputs a complete img tag with your chosen variant inside, escaping ampersands, quotes, and angle brackets so the markup is safe to paste.' },
      { q: 'Is the output guaranteed to be WCAG compliant?', a: 'The templates follow WCAG 2.1 SC 1.1.1 patterns, but accuracy depends on your description. The interface itself reminds you to review suggestions against the real image.' },
      { q: 'How many suggestions do I get?', a: 'Three per configuration. They cover different phrasings of the same idea — for example "Photo of X", "Photograph showing X", and "X — photograph" — so you can pick the one that reads best.' },
      { q: 'What happens when I pick the linked image context?', a: 'A "Link target" input appears, and every variant incorporates it, such as "Image of X that links to the pricing page", so the destination is part of the accessible name.' },
    ],
    tips: [
      'Click any variant card to copy it with a confirmation toast.',
      'The context hint under the dropdown reminds you what each mode is for.',
      'Switch tone back and forth to see how phrasing changes per template.',
      'Use the HTML snippet as the final paste target after picking your variant.',
    ],
  },
  // ── svg-optimizer ──

  'svg-optimizer': {
    intro:
      'The SVG Optimizer cleans up vector markup by stripping everything that does not contribute to the image: comments, XML declarations, Inkscape and Sodipodi editor namespaces, RDF and Creative Commons metadata blocks, attributes set to their SVG-spec defaults like fill="black" and stroke-width="1", empty elements, and whitespace-only text nodes outside text-bearing tags. Paste a file exported from Inkscape, Illustrator, or Figma and the tool reports the original size, the optimized size, the savings percentage, and a count of removed attributes and nodes. The optimized result appears in a downloadable output box, with a live preview that renders the cleaned markup so you can confirm nothing visual changed. All processing happens with DOMParser and XMLSerializer inside the browser — no file leaves your machine, and malformed input produces a clear error rather than silent corruption. Hand-edited SVGs pick up indentation, editor metadata, and redundant defaults quickly; this minify SVG markup tool is the difference between shipping a 4 KB icon and a 1.2 KB one. For icon sets, illustrations, and inline web graphics, the savings compound across every page load.',
    examples: [
      { input: `An Inkscape export beginning with: <?xml version="1.0"?>\n<!-- Created with Inkscape -->\n<svg xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" ...>\n  <metadata><rdf:RDF>...</rdf:RDF></metadata>\n  <circle cx="50" cy="50" r="40" fill="black" stroke="none" stroke-width="1" />`, output: 'A compact <svg> containing only the circle, with the XML declaration, comment, metadata, and default attributes removed.', note: 'The Removed stat reports each stripped attribute and node, and the preview confirms the circle still renders.' },
      { input: 'The bundled sample file (which ships with the tool pre-loaded).', output: 'A single-line SVG with the gradient rect and path intact; savings around 60–70% against the 1 KB original.', note: 'The sample is designed to show every category of bloat the optimizer targets.' },
      { input: 'A document with <g></g> empty groups and indentation between tags.', output: 'Empty groups are deleted and all inter-tag whitespace collapses to a single line.', note: 'Empty-element removal runs to a fixed point, so nested empties disappear too.' },
    ],
    howTo: [
      'Paste your SVG markup into the "SVG markup" textarea, or click "Load sample" to try the demo.',
      'Use "Clear" to empty the input if you want to start fresh.',
      'Read the Original, Optimized, Savings, and Removed stats that update live.',
      'Review the "Optimized SVG" output box and the side-by-side preview to confirm the artwork is unchanged.',
      'Download the result as optimized.svg using the button in the output box.',
    ],
    useCases: [
      'Cleaning Inkscape exports before committing icons to a web project.',
      'Minifying an inline SVG logo to shave bytes from an HTML template.',
      'Removing metadata that leaks author names and editor versions from published files.',
      'Preparing an icon sprite where default attributes only add bulk.',
      'Comparing original versus optimized size to report savings to a client.',
      'Sanitizing third-party SVG assets that carry unknown editor namespaces.',
    ],
    bestPractices: [
      'Always check the preview after optimizing — the pass should be visually lossless.',
      'Keep a source copy of complex files, since comments and metadata are gone after download.',
      'Verify text content survives; whitespace inside text elements is deliberately preserved.',
      'Watch the Savings stat — 25% or more lights up green and signals a worthwhile cleanup.',
      'Feed optimized output back through the SVG Viewer to confirm it still validates.',
    ],
    faqs: [
      { q: 'What exactly does the SVG Optimizer remove?', a: 'Comments, XML declarations, metadata elements, Inkscape/Sodipodi/RDF/CC namespaces, attributes matching SVG default values, empty elements, and whitespace-only text nodes outside text-bearing tags like text, tspan, and title.' },
      { q: 'Will optimization change how my SVG looks?', a: 'It should be visually lossless. Removed attributes are spec defaults, so their absence renders identically. The built-in preview exists precisely to confirm the output still draws correctly.' },
      { q: 'Which editor metadata gets stripped?', a: 'Namespaces tied to Inkscape, Sodipodi, Dublin Core, Creative Commons, and RDF are removed, along with any metadata blocks. This also deletes the sodipodi:namedview and docname information those editors embed.' },
      { q: 'Does the optimizer compress paths or round coordinates?', a: 'No. It performs structural cleanup only — it does not rewrite path data, merge shapes, or round numbers. For those transforms you would need a tool like SVGO.' },
      { q: 'What happens if my SVG is malformed?', a: 'The tool reports "Malformed XML — check for unclosed tags or invalid syntax" and the output box stays empty until the markup parses cleanly.' },
      { q: 'Is my SVG uploaded anywhere during optimization?', a: 'No. Parsing, cleanup, and serialization all run in your browser via DOMParser and XMLSerializer. The file never leaves your machine.' },
    ],
    tips: [
      'The Removed stat shows attributes/nodes as a fraction — a quick bloat signal.',
      'Optimize icons in bulk by pasting exports one after another.',
      'Use the Load sample button to learn what bloat looks like.',
      'Re-check files with gradients, since the sample\'s gradient is the classic keep-this test.',
    ],
  },
  // ── file-hash ──

  'file-hash': {
    intro:
      'The File Hash Calculator computes SHA-1, SHA-256, SHA-384, and SHA-512 digests for any file using the browser\'s native Web Crypto API, so nothing ever leaves your machine. Drag a file onto the drop zone or pick one with the file chooser, and all four hashes appear as copyable hex strings alongside per-algorithm compute times in milliseconds. A file info card shows the name, exact byte size, a readable size, and the MIME type the browser detected. Recompute re-runs the hashes against the same file, and Download report exports a text file with the file metadata, timestamps, and every digest — handy for attaching to release artifacts. Files over 500 MB are blocked to protect browser memory, and anything above 10 MB triggers a warning that the UI may pause briefly. The tool is candid about its crypto guidance: SHA-1 is marked broken and should never be used for security, and hashes cover raw bytes only, excluding names and dates. For verifying downloads, integrity-checking backups, or generating a release checksum file, this local SHA-256 hash calculator delivers trustworthy output without uploading sensitive files to a web service.',
    examples: [
      { input: 'A 4.7 GB ISO image dragged onto the drop zone.', output: 'Four hex digests with compute times of several seconds each, plus a file info card showing the byte count and MIME type.', note: 'An amber warning appears for files over 10 MB, noting the single-pass hashing may pause the UI.' },
      { input: 'A 2 KB text file, then clicking "Recompute" after editing it on disk.', output: 'The digest changes across all four algorithms the moment the updated file is re-selected or recomputed.', note: 'Recompute re-reads the stored File object; re-pick the file if its contents changed on disk.' },
      { input: 'Clicking "Download report" after hashing release.zip.', output: 'A release.zip-hashes.txt listing file name, size, type, last modified date, and all four hashes under per-algorithm headers.', note: 'The report is formatted for easy pasting into release notes or a CHECKSUMS file.' },
    ],
    howTo: [
      'Drag a file onto the dashed drop zone, or click "Choose a file" and pick one.',
      'Wait for the "Hashing…" state to finish — all four algorithms run in sequence.',
      'Read each hash row under the Hashes card and click "Copy" to grab any digest.',
      'Click "Recompute" to re-run hashes on the same file, or "Download report" to export everything.',
      'Check the File info card for the detected type and readable size.',
    ],
    useCases: [
      'Verifying that a downloaded installer matches the publisher\'s published SHA-256.',
      'Integrity-checking backups before migrating them to cold storage.',
      'Generating a checksums file to ship alongside open-source release binaries.',
      'Confirming two copies of a file are identical by comparing digests.',
      'Auditing which files changed between two exports without opening them.',
      'Hashing sensitive documents locally when company policy forbids uploads.',
    ],
    bestPractices: [
      'Rely on SHA-256 or SHA-512 for integrity; treat SHA-1 results as reference-only.',
      'Use the Download report option so file metadata travels with the hashes.',
      'Keep files under the 500 MB limit and expect brief UI pauses above 10 MB.',
      'Compare against hashes from an independent source, not just a second copy you made.',
      'Remember the hash covers raw bytes only — renaming a file does not change it.',
    ],
    faqs: [
      { q: 'Which hash algorithms does the tool compute?', a: 'SHA-1, SHA-256, SHA-384, and SHA-512, all via the Web Crypto API. Every algorithm runs on the same file in one pass, with per-algorithm timing shown in milliseconds.' },
      { q: 'Do my files get uploaded to a server?', a: 'No. The file is read into an ArrayBuffer in memory and hashed locally with crypto.subtle.digest. The browser never sends the content anywhere.' },
      { q: 'Is there a file size limit?', a: 'Files over 500 MB are rejected with a toast to protect browser memory. Files above 10 MB still hash, but show a warning that the UI may pause during computation.' },
      { q: 'Why is SHA-1 flagged as broken?', a: 'Collision attacks make SHA-1 unsuitable for security purposes. The tool\'s notes recommend SHA-256 or stronger for integrity verification while still computing SHA-1 for legacy comparisons.' },
      { q: 'What does the Recompute button do?', a: 'It re-runs all four hashes over the currently loaded file. If you edited the file on disk, pick it again first — recompute hashes the in-memory copy from when it was loaded.' },
      { q: 'What is inside the downloaded report?', a: 'A plain-text file with the file name, byte size, readable size, MIME type, last modified timestamp, generation timestamp, and each algorithm\'s hash and compute time under its own header.' },
    ],
    tips: [
      'Copy any digest with one click — each row has its own Copy button.',
      'Watch the ms badges to compare algorithm speed on your hardware.',
      'The report file name follows the pattern <filename>-hashes.txt.',
      'Hash the same release from two machines and diff the SHA-256 rows.',
    ],
  },
  // ── aria-validator ──

  'aria-validator': {
    intro:
      'The ARIA Validator parses an HTML snippet and surfaces the accessibility problems hiding in it, ranked as errors or warnings with concrete fix suggestions. Paste markup into the textarea and the tool runs twelve rule checks locally with DOMParser: missing lang on the html element, img tags without alt, alt text over 125 characters, inputs without an associated label, empty buttons, empty links, heading level skips, missing or duplicated h1 elements, role="button" misused on divs, interactive elements with no accessible name, and SVGs lacking role or aria-label. Every finding lists its rule id, the offending element, and a suggestion written for a developer who wants to fix rather than merely diagnose — for example, preferring a real button element over role="button" with manual keyboard handlers. A stats row summarizes errors, warnings, and the total, and a "Load sample (with issues)" button drops in intentionally broken markup for a tour of the rule set. This free HTML accessibility checker is honest about its scope, noting that a screen reader or axe-core audit should follow any automated pass.',
    examples: [
      { input: `Pasting: <img src="/hero.jpg" />`, output: 'An "error" finding with rule img-missing-alt, the element <img src="/hero.jpg">, and the suggestion to add alt="" for decorative or descriptive text for informative images.', note: 'Errors render in red with a direct fix path, not just a warning.' },
      { input: `Markup containing <h1>Welcome</h1> <h3>Subheading</h3>`, output: 'A "warning" finding with rule heading-skip: "Heading skips from h1 to h3. Don\'t skip levels — use h2 instead."', note: 'Heading order matters for screen-reader navigation, not just SEO.' },
      { input: 'The bundled sample (loaded via "Load sample (with issues)").', output: 'A multi-item list covering missing alt, an empty button, an empty link, an unlabelled input, heading problems, a role="button" ul, and an unlabelled SVG.', note: 'The sample exists to demonstrate every rule the validator applies.' },
    ],
    howTo: [
      'Paste your HTML into the "HTML markup" textarea, or click "Load sample (with issues)".',
      'Watch the Errors, Warnings, and Total issues stats update as you type.',
      'Scan the "Issues found" list — red badges are errors, amber are warnings.',
      'Read each rule id, element, and suggestion to plan fixes.',
      'Fix the markup, paste it again, and repeat until the green "All checks passed" panel appears.',
    ],
    useCases: [
      'Pre-flight checking a landing page template before an accessibility audit.',
      'Reviewing a component\'s rendered HTML for missing labels during development.',
      'Catching empty icon buttons and links across a component library.',
      'Enforcing heading hierarchy on a CMS-driven article template.',
      'Training junior developers to spot ARIA misuse like role="button" on divs.',
      'Quick regression checks after refactoring form markup.',
    ],
    bestPractices: [
      'Treat this as a fast static first pass — follow up with axe-core and a screen reader.',
      'Fix errors before warnings; missing alt and labels block real users first.',
      'Use the rule ids (img-missing-alt, input-no-label) to standardize team checklists.',
      'Paste complete structures, since the checker needs parent elements to test wrapping labels.',
      'Re-check after every fix, as removing one issue can reveal another.',
    ],
    faqs: [
      { q: 'What does the ARIA Validator check?', a: 'Twelve rules: lang on html, img alt presence and length, input labels, empty buttons and links, heading skips, missing or multiple h1s, role="button" misuse, unnamed interactive elements, and unlabelled SVGs.' },
      { q: 'Is my HTML uploaded anywhere?', a: 'No. Parsing happens locally with DOMParser in your browser tab, and the interface states that no markup leaves the browser.' },
      { q: 'What is the difference between errors and warnings?', a: 'Errors are violations that clearly fail WCAG expectations, like an img without alt. Warnings flag practices that are risky or suboptimal, such as a skipped heading level or long alt text.' },
      { q: 'How do I read an issue in the results list?', a: 'Each item shows a level badge, a rule id like heading-skip, the offending element as code, and a plain-language suggestion describing the fix.' },
      { q: 'Does a clean result mean my page is accessible?', a: 'No. The tool runs heuristic static checks only and says so explicitly. Automated tools catch maybe a third of issues — real testing needs a screen reader or axe-core.' },
      { q: 'Can I validate a full HTML document?', a: 'Yes. Paste the entire document including html, head, and body. The missing-lang rule checks the root html element, so full pages get the most coverage.' },
    ],
    tips: [
      'Clear the textarea with the Clear button when switching between snippets.',
      'The element column quotes the exact tag, so search your codebase with it.',
      'Load the sample first to see what a failing markup looks like.',
      'Keep the rule id handy when filing issues — it maps to your style guide.',
    ],
  },
  // ── merge-pdfs ──

  'merge-pdfs': {
    intro:
      'The Merge PDFs tool combines any number of PDF files into a single document, entirely in your browser with pdf-lib. Add files through the picker or by dropping several at once; each entry is validated as a real PDF, its page count is read asynchronously, and a numbered list shows the merge order. Arrow buttons move files up or down, a trash button removes one, and Clear all starts over. The stats row tracks total files, how many are valid, and the combined page count before you commit. Clicking "Merge PDFs" copies every page in order into a fresh document and downloads it as merged.pdf — no uploads, no page limits, and no watermark. Encryption is handled pragmatically: password-protected files load with encryption ignored where pdf-lib allows it. For anyone assembling reports, compiling invoices, or bundling scans into one file, this client-side PDF merge tool removes the two classic objections to online mergers: privacy concerns about sending documents to a third party, and the cost of a desktop PDF editor. Everything stays local, and the resulting file is standard PDF output ready for sharing.',
    examples: [
      { input: 'Three PDFs added at once: invoice-1.pdf (1 page), invoice-2.pdf (2 pages), and invoice-3.pdf (1 page).', output: 'A single merged.pdf with 4 pages in the order the files were added, downloaded after the toast confirms "Merged 3 PDFs (4 pages)".', note: 'The Total pages stat confirms the sum before you merge.' },
      { input: 'Two files added, then the second is moved above the first with the up arrow.', output: 'The merged output puts the second file\'s pages first, since pages are copied top-to-bottom from the visible order.', note: 'Reorder before merging — the list order is the output order.' },
      { input: 'A password-protected PDF added alongside a normal one.', output: 'If pdf-lib can load it with ignoreEncryption, its pages merge like any other; otherwise the row shows "unreadable" and it is excluded from the valid count.', note: 'Unreadable files never block the merge — they are simply skipped.' },
    ],
    howTo: [
      'Click "Add PDF files" or drop multiple PDFs onto the dashed upload area.',
      'Wait for each row to move from "reading…" to its page count.',
      'Use the up and down arrows to set the order, or the trash button to remove entries.',
      'Check the Files, Valid, and Total pages stats.',
      'Click "Merge PDFs" and save the downloaded merged.pdf.',
    ],
    useCases: [
      'Combining a batch of monthly invoices into one file for an accountant.',
      'Assembling chapters of a report written by different authors.',
      'Bundling scanned contract pages that arrived as separate attachments.',
      'Merging appendices into the end of a research paper.',
      'Consolidating receipt photos exported as PDFs for expense claims.',
      'Joining several one-page memos into a single email attachment.',
    ],
    bestPractices: [
      'Confirm every file shows a page count before merging — rows stuck at "reading…" or "unreadable" are not included.',
      'Order the list deliberately, since output order is exactly the visible top-to-bottom order.',
      'Double-check the Total pages stat against your expectations to catch missing files.',
      'Merge in small batches for very large PDFs to keep browser memory happy.',
      'Name files meaningfully before merging, since merged.pdf is the only output name.',
    ],
    faqs: [
      { q: 'How many PDFs can I merge at once?', a: 'There is no hard limit in the interface; files are processed in sequence. Practical limits come from your browser\'s memory when combining very large documents.' },
      { q: 'What happens to password-protected PDFs?', a: 'The tool loads files with ignoreEncryption enabled, so many protected files merge normally. If pdf-lib cannot read one, the row is marked "unreadable" and excluded from the output.' },
      { q: 'Can I change the order of pages inside a file?', a: 'No — you can only reorder whole files relative to each other. To reorder individual pages, split the file first, then merge the pieces.' },
      { q: 'Where does the merged file go?', a: 'It downloads directly to your browser\'s download folder as merged.pdf. Nothing is stored on a server.' },
      { q: 'Does merging keep bookmarks, forms, or annotations?', a: 'pdf-lib copies pages and their content but does not preserve interactive features like form fields, bookmarks, or annotations. Expect the printed content, not the interactivity.' },
      { q: 'Are my documents uploaded to a server?', a: 'No. The merge runs client-side with pdf-lib in your browser. The badge under the merge button states that nothing is uploaded.' },
    ],
    tips: [
      'Drag a whole folder\'s worth of PDFs at once — multiple drops are allowed.',
      'The numbered chips on the left mirror the final page order.',
      'Remove unreadable entries before merging for a cleaner result.',
      'Merge in file-order chunks to build a large document progressively.',
    ],
  },
  // ── split-pdf ──

  'split-pdf': {
    intro:
      'The Split PDF tool divides one PDF into separate files using three strategies: explode every page into its own single-page PDF, cut out a contiguous page range, or chunk the document into fixed-size groups of pages. After loading a file, the tool reads its page count and builds a plan preview listing every output file, its page span, and the exact filename it will receive — document-page-3.pdf for singles, document-pages-2-5.pdf for ranges and chunks. The "Split into N files" button runs the job, and a generated files list appears with a Save button per file plus Download all for the batch. Each output is a valid PDF built with pdf-lib, and the source stays untouched on disk. Password-protected documents are rejected with a clear message rather than producing broken output. Splitting locally matters when documents are sensitive — contracts, medical records, bank statements — since nothing is uploaded. For anyone who needs to email one page of a 40-page statement, separate a merged scan, or break a long deck into presentable sections, this browser-based PDF splitter does it in seconds without installing software.',
    examples: [
      { input: 'A 12-page PDF with Split mode set to "Every page → N files".', output: 'A plan preview of 12 files (doc-page-1.pdf through doc-page-12.pdf), each one page, available individually or via Download all.', note: 'The default mode turns any document into a folder of singles.' },
      { input: 'The same PDF with mode "By page range", Start page 3, End page 7.', output: 'One planned file doc-pages-3-7.pdf containing pages 3 through 7.', note: 'The range inputs clamp to the document\'s real page count.' },
      { input: 'A 30-page PDF with mode "By page count (chunks)" and Pages per chunk set to 10.', output: 'Three files — doc-pages-1-10.pdf, doc-pages-11-20.pdf, doc-pages-21-30.pdf — each listed with its page span.', note: 'Chunk mode is the fastest way to split for batch emailing.' },
    ],
    howTo: [
      'Click "Choose PDF" or drop a file onto the upload area and wait for the page count.',
      'Pick a "Split mode": Every page, By page range, or By page count (chunks).',
      'For range mode, set Start page and End page; for chunk mode, set Pages per chunk.',
      'Review the plan preview — each row shows the label, output filename, and page count.',
      'Click "Split into N files", then use Save per file or Download all.',
    ],
    useCases: [
      'Emailing a single page from a 40-page bank statement without sending the rest.',
      'Separating a scanned bundle of mixed documents into individual files.',
      'Breaking a quarterly report into per-department sections for distribution.',
      'Extracting just the cover page of an ebook for a product listing.',
      'Preparing a multi-page contract so each party signs a one-page copy.',
      'Chunking a long slide deck into 10-page uploads for a size-limited portal.',
    ],
    bestPractices: [
      'Check the plan preview carefully — filenames reveal exactly what each chunk contains.',
      'Use chunk mode for uniform splits and range mode for precise extraction.',
      'For very large documents, split into smaller batches to keep memory use down.',
      'Keep the original PDF; splits are copies, but re-downloading beats re-splitting.',
      'Name your source file well, since output names inherit the base name.',
    ],
    faqs: [
      { q: 'What split modes does the tool offer?', a: 'Three: "Every page" creates one PDF per page, "By page range" extracts a single span defined by start and end numbers, and "By page count (chunks)" divides the document into groups of N consecutive pages.' },
      { q: 'How are the output files named?', a: 'Names inherit the source file\'s base name: doc-page-3.pdf for a single page, doc-pages-3-7.pdf for ranges, and doc-pages-1-10.pdf style names for chunks. The plan preview shows every name.' },
      { q: 'What happens with an encrypted PDF?', a: 'The tool detects password protection and refuses with a specific toast — "This PDF is password-protected and cannot be split" — rather than producing broken output.' },
      { q: 'Can I split into parts of different sizes?', a: 'Not in one run. Chunk mode uses one uniform page count. For custom grouping, run the tool multiple times with different ranges.' },
      { q: 'Do the splits keep the original quality?', a: 'Yes. Pages are copied into new PDF documents with pdf-lib, preserving the page content at its original fidelity. The source file is not modified.' },
      { q: 'Is there a limit on page count?', a: 'No fixed limit exists in the code; very large documents may slow the browser during the sequential chunk processing, so consider splitting in stages for hundreds of pages.' },
    ],
    tips: [
      'The Mode stat confirms which strategy is active at a glance.',
      'Plan preview rows double as a checklist before you click split.',
      'Download all only includes chunks that finished without errors.',
      'Switch modes after loading — the plan recalculates instantly.',
    ],
  },
  // ── rotate-pdf ──

  'rotate-pdf': {
    intro:
      'The Rotate PDF tool fixes sideways or upside-down pages by rotating them 90, 180, or 270 degrees clockwise — across the whole document or just the pages you name. Load a PDF, pick an angle from the dropdown (270° is labelled as 90° counter-clockwise, the direction most scans need), and choose "All pages" or "Specific pages…". For specific pages, type a list like 1,3,5-7; the tool parses it live and shows a badge preview of exactly which pages will change, reporting out-of-bounds tokens before you waste a run. Rotation is additive: if a page already carries a rotation, the new angle stacks on top, so a 90° file rotated another 90° becomes 180°. The result downloads as <name>-rotated-<angle>.pdf with the original untouched. Encrypted files get a specific password-protection error instead of silent failure. Scanned documents are the classic case — a scanner feeds pages landscape when they should be portrait — and this local PDF page rotation tool fixes them without uploading potentially sensitive paperwork to a cloud service, since pdf-lib does the work entirely in the browser.',
    examples: [
      { input: 'A 20-page scanned contract where every page is sideways, angle 90° clockwise, Apply to "All pages".', output: 'contract-rotated-90.pdf with all 20 pages turned; the toast reports "Rotated 20 pages by 90°".', note: 'All-pages mode is the one-click fix for a misconfigured scanner.' },
      { input: 'A 6-page report with only page 4 upside down; angle 180°, Apply to "Specific pages…", Pages to rotate "4".', output: 'report-rotated-180.pdf with just page 4 flipped; the parsed preview shows a single badge with 4.', note: 'The preview lets you verify the target before rotating.' },
      { input: 'Pages "1,3,5-7" entered for a 10-page document with angle 90°.', output: 'Five pages rotated (1, 3, 5, 6, 7) in a single pass; the badge list confirms each one.', note: 'Ranges and comma lists can be combined freely.' },
    ],
    howTo: [
      'Click "Choose PDF" or drop a file and wait for the page count to load.',
      'Select the "Rotation angle": 90° clockwise, 180°, or 270° clockwise (90° counter-clockwise).',
      'Choose "All pages" or "Specific pages…" in the "Apply to" dropdown.',
      'For specific pages, type a list like 1,3,5-7 and check the parsed preview badges.',
      'Click "Rotate & download" to save <name>-rotated-<angle>.pdf.',
    ],
    useCases: [
      'Correcting a whole batch of landscape-scanned contracts to portrait.',
      'Flipping a single upside-down page buried in a 50-page report.',
      'Rotating floor plans 90° for a real-estate listing document.',
      'Preparing landscape charts inside a portrait deck for printing.',
      'Fixing scanner-fed bank statements before archival.',
      'Re-orienting pages in a merged PDF where one source was rotated.',
    ],
    bestPractices: [
      'Use 270° (90° counter-clockwise) for scans that need turning to the left.',
      'Verify the parsed preview badges match the pages you intend before clicking.',
      'Remember rotation stacks on existing angles — check the result if a page was already rotated.',
      'Keep the original file; the download is a new copy with -rotated- appended.',
      'For mixed problems, run the tool once per angle group rather than over-rotating.',
    ],
    faqs: [
      { q: 'Which rotation angles are available?', a: '90° clockwise, 180°, and 270° clockwise, which the dropdown labels as "90° counter-clockwise". These cover every practical orientation fix.' },
      { q: 'How do I rotate only certain pages?', a: 'Choose "Specific pages…" in the Apply to dropdown and type a list such as 1,3,5-7. The parsed preview shows badges for each page the list resolves to.' },
      { q: 'Does rotating stack on top of existing page rotation?', a: 'Yes. The tool reads each page\'s current rotation and adds your angle modulo 360 degrees, so a page already at 90° rotated by 90° becomes 180°.' },
      { q: 'What page list formats are accepted?', a: 'Comma-separated numbers and ranges, like 1,3,5-7. Ranges can run in either direction, and duplicate pages are applied once. Invalid tokens are rejected with a message.' },
      { q: 'Can I rotate a password-protected PDF?', a: 'No — the tool detects encryption and reports "This PDF is password-protected and cannot be rotated." Remove the password first with a dedicated utility.' },
      { q: 'Is the original file modified?', a: 'No. The rotated result is a new download named <original>-rotated-<angle>.pdf, and your source file stays exactly as it was.' },
    ],
    tips: [
      'The Scope stat tells you at a glance whether all or custom pages are targeted.',
      'Type ranges in either direction — "7-5" resolves the same as "5-7".',
      'Use 180° for scans that flipped during duplex copying.',
      'Re-download with a different angle if the first rotation lands wrong.',
    ],
  },
  // ── extract-pdf-pages ──

  'extract-pdf-pages': {
    intro:
      'The Extract PDF Pages tool pulls hand-picked pages out of a larger PDF and writes them into a brand-new document, in the exact order you specify. Load a file, then type a page list like 1,3,5-7 into the "Pages to extract" field. The parser accepts individual numbers and ranges in any combination, preserves the order you typed — including duplicates — and shows a live preview of badges (p3, p5, p6) so you can see the new document\'s sequence before committing. A stats row reports the source page count and how many pages will be extracted, and the output always downloads as <name>-extracted.pdf. Because copying happens with pdf-lib entirely in the browser, nothing leaves your machine — a real advantage when the document is a contract, a scan of ID, or a confidential report. Encrypted files are caught and reported with a specific password-protection error. Where the Split tool breaks documents apart wholesale, this extract selected pages from a PDF tool is surgical: it exists for the moment you need just the signature page, the appendix, or the three pages that matter out of a hundred.',
    examples: [
      { input: 'A 100-page agreement with Pages to extract "12,47-49".', output: 'agreement-extracted.pdf containing page 12 followed by pages 47, 48, 49 — four pages total.', note: 'The preview badges confirm the sequence before extraction.' },
      { input: 'Pages to extract "3,3,1" for a 10-page document.', output: 'A three-page PDF in the order 3, 3, 1 — duplicates are preserved, which is useful for building repeated pages.', note: 'The tool does not deduplicate; what you type is what you get.' },
      { input: 'An invalid token like "1,abc,9-3" typed into the field.', output: 'A red error message in the preview card — "Unrecognised token: \"abc\"" or a range-out-of-bounds note — and the button stays inert until fixed.', note: 'Errors surface before any processing starts.' },
    ],
    howTo: [
      'Click "Choose PDF" or drop the source file onto the upload area.',
      'Type the page numbers into "Pages to extract", e.g. 1,3,5-7.',
      'Check the preview badges — pages join the new PDF in the order shown.',
      'Confirm the "Will extract" stat matches your intent.',
      'Click "Extract & download" to save <name>-extracted.pdf.',
    ],
    useCases: [
      'Pulling the signature page out of a 40-page contract for a quick reference copy.',
      'Building a smaller deck from selected slides of a large presentation.',
      'Assembling a reading packet from chapters scattered across a textbook scan.',
      'Extracting the appendix from an annual report to send separately.',
      'Creating a short proof document from key pages of a print layout.',
      'Reordering pages by listing them in a custom sequence (3,1,2).',
    ],
    bestPractices: [
      'List pages in the order you want them in the new PDF — that is exactly the output order.',
      'Use the preview badges to proof your list before clicking extract.',
      'Reuse ranges for repetitive tasks, like pulling 1-4 from every monthly statement.',
      'Keep the source file unchanged as your master; extractions are copies.',
      'Watch for the out-of-bounds message when your list exceeds the page count.',
    ],
    faqs: [
      { q: 'What formats can the page list take?', a: 'Comma-separated numbers and ranges, such as 1,3,5-7. Ranges expand in ascending order, and the overall sequence follows the order you typed.' },
      { q: 'Can I extract the same page more than once?', a: 'Yes. Duplicates are preserved, so typing 3,3,1 produces a three-page PDF with page 3 twice. The extractor does not deduplicate your list.' },
      { q: 'Does the order I type matter?', a: 'Absolutely — the new PDF gets pages in exactly the listed order, which also means you can reorder pages by extracting them in a custom sequence.' },
      { q: 'What if my page numbers exceed the document?', a: 'The parser rejects out-of-bounds numbers with a specific message and the extraction will not run until the list is corrected to fit the page count.' },
      { q: 'What happens with password-protected PDFs?', a: 'The tool reports that the PDF is password-protected and cannot be read. Unlock the file first, then load it again.' },
      { q: 'What is the output filename?', a: 'The download is always named <source-name>-extracted.pdf — for example, contract-extracted.pdf — as shown under the button in the interface.' },
    ],
    tips: [
      'The p# badge preview is your order-of-pages safety net.',
      'Use ranges for big spans and commas for scattered pages in one list.',
      'The "Last result" stat confirms how many pages the previous run produced.',
      'Extract twice with different lists to compare page subsets quickly.',
    ],
  },
  // ── compress-pdf ──

  'compress-pdf': {
    intro:
      'The Compress PDF tool trims PDF file size by stripping document metadata and re-saving with packed object streams — entirely in the browser with pdf-lib. Two toggles control the pass: "Strip metadata" clears the title, author, subject, keywords, producer, and creator entries, while "Pack objects into compressed object streams" rewrites the file so many small objects share compressed containers. Both are on by default and flagged as recommended. After running Compress, a stats row shows the original size, the compressed size, bytes saved, and the savings percentage; the download button then saves <name>-compressed.pdf. Honesty is built into the design: an alert explains up front that pdf-lib cannot recompress embedded images or downsample fonts, so image-heavy PDFs may barely shrink — and if the re-save adds structural overhead, a "No savings" warning appears with the delta. That candor makes the tool trustworthy. Use it for text-heavy documents, exported reports, and files bloated with duplicated or unused objects, and pair it with a dedicated image compressor when scans dominate the byte count.',
    examples: [
      { input: 'A 3.2 MB exported report with heavy metadata and many small objects, both toggles on.', output: 'report-compressed.pdf at around 2.6 MB; the stats show ~0.6 MB saved with a percentage badge.', note: 'Document-heavy PDFs benefit most from object streams and metadata stripping.' },
      { input: 'The same file with "Strip metadata" off but object streams on.', output: 'A smaller savings figure — the metadata removal contributes part of the reduction.', note: 'Toggling options lets you isolate which pass earns the savings.' },
      { input: 'An already-tight, image-heavy PDF with both options on.', output: 'A "No savings" alert reporting the output is slightly larger, explaining pdf-lib added structural overhead and images were not recompressed.', note: 'The tool tells you when compression is not the right tool for the file.' },
    ],
    howTo: [
      'Click "Choose PDF" or drop a file; the page count and original size load immediately.',
      'Leave "Strip metadata" on to clear title, author, and other entries.',
      'Leave "Pack objects into compressed object streams" on for the biggest wins.',
      'Click "Compress" and read the Original, Compressed, Saved, and Savings stats.',
      'Click "Download compressed" to save <name>-compressed.pdf.',
    ],
    useCases: [
      'Shrinking text-heavy exported reports before emailing them under attachment limits.',
      'Removing author and company names from metadata before publishing documents publicly.',
      'Reducing repository bloat when committing PDFs generated by CI pipelines.',
      'Preparing court or tender submissions with strict file size ceilings.',
      'Cleaning metadata from client deliverables to avoid leaking internal tool names.',
      'Batch-packing PDFs with many small objects that serialize inefficiently.',
    ],
    bestPractices: [
      'Read the "Limited compression" alert first — image-heavy PDFs will not shrink much.',
      'Keep both toggles on; they are marked recommended for a reason.',
      'If the "No savings" alert appears, accept the result and use Ghostscript for image-based compression instead.',
      'Compress a copy and compare page renders, since re-saving rewrites the file structure.',
      'Use metadata stripping as a privacy step, not just a size step.',
    ],
    faqs: [
      { q: 'How much can I expect to save?', a: 'It depends on the file. Text-heavy PDFs with duplicated objects and heavy metadata often drop 10–30%; image-heavy PDFs may not shrink at all, because pdf-lib does not recompress embedded images.' },
      { q: 'What does stripping metadata remove?', a: 'The title, author, subject, keywords, producer, and creator fields are cleared. This both reduces size slightly and removes information you may not want published with the document.' },
      { q: 'Why did my file get larger after compressing?', a: 'When the source was already tightly packed, pdf-lib\'s re-save can add small structural overhead. The "No savings" alert shows the exact delta and recommends a dedicated compressor for image-heavy files.' },
      { q: 'Are the recommended toggles safe to leave on?', a: 'Yes. Both options are flagged "recommended" in the interface. They affect metadata and internal object layout, not the rendered page content.' },
      { q: 'Does the tool change how my PDF looks?', a: 'Page content is preserved, but the file is re-serialized, so internal structure changes. Spot-check the downloaded copy against the original for complex layouts.' },
      { q: 'Can I compress encrypted PDFs?', a: 'No — password-protected files are rejected with a specific message. Decrypt the file first, then run it through the compressor.' },
    ],
    tips: [
      'Watch the Savings stat — green means the pass actually helped.',
      'Run compression twice with different toggle combos to see each option\'s effect.',
      'Treat metadata stripping as your document-redaction first step.',
      'For scans and photos, expect little — the tool says so itself.',
    ],
  },
  // ── pdf-to-images ──

  'pdf-to-images': {
    intro:
      'The PDF to Images tool renders every page of a PDF into PNG files and doubles as a structural inspector for the document. Load a file and the tool immediately reports the page count, file size, the first page\'s point dimensions, and whether metadata is present. The "Render to images" tab uses pdf.js to draw each page onto a canvas at a scale you control with a slider from 0.5× to 3.0× (default 1.5×) — higher scales produce sharper, larger PNGs, and the tab caps out at 50 pages with a friendly warning beyond that. Rendered pages appear in a grid, each with a hover download button that saves <name>-page-N.png. The "Inspect structure" tab lists every page\'s width and height in points, millimetres, and inches, plus its rotation, alongside the embedded metadata (title, author, subject, keywords, creator, producer, creation and modification dates) and a Download JSON report button. Since both pdf-lib and pdf.js run locally, sensitive documents never leave the browser. It is the missing bridge between the PDF format and web-friendly images — one tool for thumbnails, previews, and document archaeology.',
    examples: [
      { input: 'A 6-page brochure with the render scale left at the 1.5 default, then "Render pages".', output: 'Six PNGs in the grid — brochure-page-1.png through brochure-page-6.png — rendered at 150% of the PDF\'s native point size.', note: 'The toast confirms "Rendered 6 pages" when the pass finishes.' },
      { input: 'The same file opened in the "Inspect structure" tab.', output: 'A page sizes table: each row shows width and height in pt, mm, and inches, plus any per-page rotation angle.', note: 'Millimetre and inch columns convert from points automatically.' },
      { input: 'A 60-page PDF with the Render pages button pressed.', output: 'A toast — "Too many pages to render (max 50). Try a smaller PDF." — and no images rendered.', note: 'The 50-page cap protects the browser from memory exhaustion.' },
    ],
    howTo: [
      'Click "Choose PDF" or drop a file; the page count and size stats load instantly.',
      'Open the "Render to images" tab and set the Render scale slider (0.5× to 3.0×).',
      'Click "Render pages" and wait for the progress indicator.',
      'Hover any page thumbnail and click its download button for <name>-page-N.png.',
      'Optionally switch to "Inspect structure" and use "Download JSON report" for the full data set.',
    ],
    useCases: [
      'Generating thumbnails for a document-management interface.',
      'Creating image versions of slides for a content platform that cannot embed PDFs.',
      'Extracting a specific page as a PNG for a social media post.',
      'Auditing page sizes of an incoming print PDF before sending it to production.',
      'Converting a short form into images for an email campaign.',
      'Exporting a structure report for QA on PDF generation pipelines.',
    ],
    bestPractices: [
      'Pick the scale before rendering — re-rendering at a new scale redoes the whole pass.',
      'Use 2.0× or higher for print-quality exports, 1.0–1.5× for web thumbnails.',
      'Split documents over 50 pages first if you need images from every page.',
      'Download the JSON report when you need dimensions programmatically.',
      'Render with the inspection tab open to cross-check rotation against page sizes.',
    ],
    faqs: [
      { q: 'How are the PNGs generated?', a: 'Pages are drawn onto HTML canvases by pdf.js running entirely in the browser, then exported as PNG data URLs. No server-side rendering or uploads are involved.' },
      { q: 'What does the render scale control?', a: 'It multiplies the PDF\'s native resolution when rasterizing, from 0.5× to 3.0×. Higher values produce sharper, larger PNGs at the cost of rendering time and file size.' },
      { q: 'Why is rendering limited to 50 pages?', a: 'Each page canvas holds significant memory. The limit prevents the browser tab from exhausting memory on large documents, and the tool suggests splitting bigger PDFs first.' },
      { q: 'What does the Inspect structure tab show?', a: 'Per-page width and height in points, millimetres, and inches, each page\'s rotation, and the embedded metadata fields. A JSON report download captures all of it.' },
      { q: 'What is in the JSON report?', a: 'The file name, byte size, page count, per-page dimensions and rotation, and the metadata dictionary — title, author, subject, keywords, creator, producer, and both dates.' },
      { q: 'Can I convert a password-protected PDF?', a: 'No. Encrypted files are detected during loading and reported with a specific password-protection error before any rendering starts.' },
    ],
    tips: [
      'The hover download button appears at the bottom of each thumbnail.',
      'Read rotation values in the inspection table to explain sideways renders.',
      'Rendering progress shows as "Rendering… (N/total)" on the button.',
      'Use the structure JSON as input for automated page-size checks.',
    ],
  },
  // ── images-to-pdf ──

  'images-to-pdf': {
    intro:
      'The Images to PDF tool converts PNG and JPEG images into a single PDF, one image per page, with full control over page sizing and order. Add images in bulk, reorder them with arrow buttons, and each entry shows a thumbnail, its file size, format, and pixel dimensions as it loads. A single switch governs layout: with "Page sized to image" on (the default), every PDF page matches its image\'s exact dimensions — no margins, no scaling. Flip it off and each image is centred on an A4 portrait page (595×842 pt) with a 36-point margin, scaled down to fit without distortion. Build produces a standard images.pdf via pdf-lib, embedding PNGs with embedPng and JPEGs with embedJpg, and the stats row confirms how many images are ready and how many output pages will exist. Everything runs client-side, so photo collections never touch a server. For turning scanned receipts into a claim package, assembling a photo album, or packaging screenshots into a deliverable, this PNG JPEG to PDF converter is the fastest route from a folder of images to a shareable document.',
    examples: [
      { input: 'Three 1200×800 JPEG photos added with the default page sizing switch on.', output: 'images.pdf with three pages, each exactly 1200×800 points — no whitespace, no scaling.', note: 'Image-sized pages preserve the original aspect ratio exactly.' },
      { input: 'The same photos with "Page sized to image" switched off.', output: 'A three-page A4 document (595×842 pt) with each photo centred inside a 36-point margin, shrunk to fit when oversized.', note: 'A4 mode is the pick for printing and formal documents.' },
      { input: 'A mixed batch where one file is a GIF.', output: 'A toast — "\"logo.gif\" is not a PNG or JPEG — skipped" — and the remaining valid files load normally.', note: 'Non-PNG/JPEG files are rejected individually, not silently dropped.' },
    ],
    howTo: [
      'Click "Add images" or drop PNGs and JPEGs onto the upload area.',
      'Confirm each row reaches a loaded state with dimensions shown.',
      'Decide the layout: leave "Page sized to image" on, or switch it off for A4 portrait pages.',
      'Reorder entries with the up/down arrows so pages land in the right sequence.',
      'Click "Build PDF" and save the downloaded images.pdf.',
    ],
    useCases: [
      'Combining scanned receipts into one PDF for an expense report.',
      'Turning a folder of travel photos into a single shareable album document.',
      'Packaging UI screenshots into a client deliverable with consistent A4 pages.',
      'Creating a print-ready flyer pack from individually designed JPEG pages.',
      'Archiving screenshots of web pages in their native resolutions.',
      'Building a simple photo book proof before sending files to a printer.',
    ],
    bestPractices: [
      'Keep the sizing switch on for exact-pixel pages, and switch it off for printing.',
      'Sort images into reading order before building, since order maps directly to pages.',
      'Reject the A4 mode when aspect ratios vary wildly — image-sized pages avoid distortion.',
      'Watch each row\'s dimensions; failed-to-measure images are excluded from the build.',
      'Use the Ready stat to confirm every intended image loaded before clicking Build PDF.',
    ],
    faqs: [
      { q: 'Which image formats are accepted?', a: 'PNG and JPEG (including .jpg/.jpeg). Anything else — GIFs, WebP, TIFF — is rejected with a toast naming the file. PNGs embed via embedPng and JPEGs via embedJpg.' },
      { q: 'What does the page sizing switch do?', a: 'With it on, each PDF page matches its image\'s pixel dimensions exactly. With it off, images are centred on A4 portrait pages (595×842 pt) with a 36-point margin and scaled to fit.' },
      { q: 'Can I control the order of pages?', a: 'Yes. The arrow buttons move images up and down the list, and pages are added top-to-bottom in the order shown when you click Build PDF.' },
      { q: 'Are my images uploaded anywhere?', a: 'No. Embedding happens locally with pdf-lib in your browser. The client-side badge under the build button confirms nothing is sent to a server.' },
      { q: 'How many images can I include?', a: 'There is no hard limit in the interface. Practical limits come from browser memory when embedding very large batches of high-resolution photos.' },
      { q: 'What is the output file called?', a: 'The downloaded document is always named images.pdf, regardless of the source image names.' },
    ],
    tips: [
      'Drop a whole selection of files at once — multi-select is supported.',
      'Thumbnails in the list make checking order easier than filenames alone.',
      'Use A4 mode for anything destined for a printer.',
      'The Output pages stat should match your Ready count before building.',
    ],
  },
  // ── pdf-metadata-viewer ──

  'pdf-metadata-viewer': {
    intro:
      'The PDF Metadata Viewer opens a PDF and lays bare everything in its document catalogue: the title, author, subject, keywords, creator, producer, and creation and modification dates, alongside a per-page size table showing width and height in points, millimetres, and inches with each page\'s rotation. Four summary stats lead with the page count, file size, encryption status, and whether the file carries any metadata at all. Loading is strict by design — the tool first attempts a normal pdf-lib load, and if the document is encrypted, a dedicated "Password-protected" alert explains that inspection is impossible without the password and even suggests decrypting with qpdf --decrypt. An educational footer clears up the point-versus-inch relationship (25.4 mm = 72 pt) and notes that dimensions shown are the media box before rotation. Because inspection is read-only and entirely client-side, confidential files never leave the machine. For SEO practitioners auditing PDFs attached to a site, print designers verifying bleed boxes, or developers debugging generated documents, this PDF properties inspector answers the "what is this file, really?" question without installing a desktop reader.',
    examples: [
      { input: 'A standard exported PDF with a title, author, and producer set.', output: 'The Document info card shows all eight fields populated, and the "Has metadata" stat reads yes.', note: 'Producer and Creator often reveal the generating application and its version.' },
      { input: 'A print PDF with mixed page sizes, opened to check the Page sizes table.', output: 'Per-page rows like 612×792 pt (215.9 × 279.4 mm) for letter pages, with any landscape pages shown rotated 90° or 270°.', note: 'Rotation is reported separately from the media box dimensions.' },
      { input: 'A password-protected PDF.', output: 'The file name loads, but a "Password-protected" alert replaces the results and recommends qpdf --decrypt before retrying.', note: 'The strict load intentionally surfaces encryption instead of guessing.' },
    ],
    howTo: [
      'Click "Choose PDF" or drop a file onto the upload area.',
      'Wait for the "Inspecting…" state to finish reading the document.',
      'Read the Pages, File size, Encrypted, and Has metadata stats.',
      'Review the Document info grid for title, author, dates, and producer fields.',
      'Scroll the Page sizes table for per-page dimensions and rotation.',
    ],
    useCases: [
      'Auditing metadata in PDFs served on a website before they are indexed.',
      'Verifying print specifications — page size and rotation — before sending files to a press.',
      'Checking whether a generated PDF carries the right author and keywords for document management.',
      'Confirming the creation and modification dates of a received contract.',
      'Debugging a PDF pipeline that produced unexpected page dimensions.',
      'Inspecting a vendor\'s PDF before approving it as a final deliverable.',
    ],
    bestPractices: [
      'Check the Has metadata stat first — an empty catalogue is a common SEO gap in public PDFs.',
      'Read rotation alongside dimensions, since the media box does not rotate with the page.',
      'Use the millimetre column for print work and inches for US paper sizes.',
      'For encrypted files, follow the suggested qpdf --decrypt step before retrying.',
      'Record the producer field when debugging generation issues — it names the tool.',
    ],
    faqs: [
      { q: 'What metadata fields does the viewer display?', a: 'Title, author, subject, keywords, creator, producer, and the creation and modification dates — the standard PDF document information dictionary entries read through pdf-lib.' },
      { q: 'What happens with an encrypted PDF?', a: 'The strict load detects encryption and shows a "Password-protected" alert explaining that inspection requires the password, with a hint to decrypt the file using qpdf --decrypt.' },
      { q: 'Why are page sizes shown in three units?', a: 'Because different audiences think in different units: points are native to the PDF format (72 pt per inch), millimetres suit print production, and inches suit US paper sizes.' },
      { q: 'Does the viewer show the rotated or unrotated dimensions?', a: 'The width and height are the page\'s media box before rotation. The rotation column reports the page\'s stored rotation angle separately, so you can infer the displayed orientation.' },
      { q: 'Are my PDFs uploaded anywhere?', a: 'No. The file is read into memory with pdf-lib and inspected entirely in your browser. Nothing is transmitted.' },
      { q: 'Why does the Has metadata stat say no?', a: 'It means the title, author, creator, and producer fields are all empty — common with scanned PDFs or minimal generators. The viewer exists precisely to reveal such gaps.' },
    ],
    tips: [
      'The Encrypted stat reads no in green — a quick sanity signal.',
      'Use the mm column to spot non-standard page sizes at a glance.',
      'Compare Created and Modified dates to detect post-signature edits.',
      'The badges confirm the client-side nature and pdf-lib version.',
    ],
  },
  // ── file-checksum ──

  'file-checksum': {
    intro:
      'The File Checksum calculator produces five integrity fingerprints for any file — CRC32, MD5, SHA-1, SHA-256, and SHA-512 — without uploading a single byte. Drop a file onto the zone and the tool computes CRC32 with its own hand-written 256-entry lookup table, then runs the SHA family through the Web Crypto API. MD5 is attempted too, but since it is not part of the Web Crypto specification most browsers reject it, and the row honestly reports "MD5 not supported in this browser" rather than faking a value. Every result carries a copy button and a compute-time badge in milliseconds; a file info card shows the name, exact byte count, readable size, and detected MIME type. Recompute re-runs the batch, and Download report exports a text file with metadata and all checksums. Files over 500 MB are blocked to protect memory, with an amber pause warning above 50 MB. The notes section is refreshingly straight about security: CRC32 catches accidental corruption, SHA-1 is cryptographically broken, and SHA-256 or SHA-512 should anchor any real verification. For release managers and careful downloaders alike, this CRC32 MD5 SHA-256 checksum utility is the local, no-account way to verify file integrity.',
    examples: [
      { input: 'A 250 MB video file dropped onto the zone.', output: 'CRC32 and four SHA digests with millisecond timings; an amber warning notes the UI may pause briefly during the single-pass hash.', note: 'The warning appears for files over 50 MB, before the 500 MB hard block.' },
      { input: 'The same file hashed on two machines, comparing SHA-256 rows.', output: 'Identical 64-character hex strings confirm the copy is intact; a mismatch would flag corruption or tampering.', note: 'SHA-256 is the row to trust for integrity checks.' },
      { input: 'Hashing a file in a browser without MD5 support.', output: 'The MD5 row shows an amber "unsupported" badge and the message "MD5 not supported in this browser" while all other hashes still compute.', note: 'The tool degrades gracefully instead of failing the whole batch.' },
    ],
    howTo: [
      'Drag a file onto the drop zone or click "Choose a file".',
      'Wait for the "Computing…" state — CRC32 and the SHA hashes run in sequence.',
      'Read the five rows under the Checksums card, each with a Copy button.',
      'Click "Recompute" to re-run on the same file, or "Download report" to export everything.',
      'Check the File info card for size, readable size, and detected type.',
    ],
    useCases: [
      'Verifying a downloaded firmware image against the vendor\'s published SHA-256.',
      'Confirming backup integrity before deleting the source copy.',
      'Publishing CRC32 and SHA-256 sums in release notes for an open-source project.',
      'Detecting accidental corruption in files copied between network shares.',
      'Comparing hashes across a delivery to prove two parties received the same file.',
      'Generating checksum reports for compliance archives that require them.',
    ],
    bestPractices: [
      'Trust SHA-256 or SHA-512 for security decisions; use CRC32 for corruption only.',
      'Treat the MD5 row as informational — expect it to read unsupported in most browsers.',
      'Download the report when hashes must accompany the file itself.',
      'Compare against checksums published by the vendor, not ones you generated earlier.',
      'Keep files under 500 MB; above 50 MB, expect a brief UI pause.',
    ],
    faqs: [
      { q: 'Which checksums does the tool compute?', a: 'CRC32, MD5, SHA-1, SHA-256, and SHA-512. CRC32 uses a manual lookup-table implementation, the SHA family uses crypto.subtle.digest, and MD5 is attempted with graceful fallback.' },
      { q: 'Why does MD5 show as unsupported?', a: 'MD5 is not part of the Web Crypto specification, so modern browsers throw when it is requested. The row then displays "MD5 not supported in this browser" while the remaining hashes still compute normally.' },
      { q: 'What is CRC32 useful for?', a: 'It is a fast, non-cryptographic checksum designed to detect accidental corruption, like a flipped bit during transfer. It offers no protection against deliberate tampering.' },
      { q: 'Is there a file size limit?', a: 'Yes — files over 500 MB are rejected to protect browser memory. Files over 50 MB still process, but trigger a warning that the UI may pause briefly.' },
      { q: 'Do checksums include the file name or dates?', a: 'No. They cover the raw file bytes only, so renaming a file or changing its timestamps does not alter any checksum.' },
      { q: 'What does the downloaded report contain?', a: 'File name, byte size, readable size, MIME type, last modified timestamp, generation time, and each algorithm\'s hash — or a note when one is unsupported or not computed.' },
    ],
    tips: [
      'Copy any checksum with its per-row Copy button.',
      'The ms badges reveal CRC32\'s speed advantage over the SHA family.',
      'Reports are named <filename>-checksums.txt for easy archiving.',
      'Recompute after every download to confirm the file on disk matches the report.',
    ],
  },
  // ── font-accessibility-checker ──

  'font-accessibility-checker': {
    intro:
      'The Font Accessibility Checker scores a typographic setup against WCAG 1.4.x criteria and readability best practices, with live feedback you can act on immediately. Set a font family, font size in pixels, one of four font weights (400 through 700), a unitless line height, and a sample paragraph; the tool then runs five checks — body size of at least 16px, line height of at least 1.4, the optimal 1.5–1.6 line-height band, a line length between 45 and 75 characters, and a supported font weight — and distills them into an accessibility score out of 100. A stats row also reports the estimated x-height ratio, using a 0.5 multiplier on font size since real glyph metrics are unavailable in the browser. The live preview renders your sample with the exact settings, and a Copy CSS button exports the resulting declarations. Guidance cards explain WCAG 1.4.4 Resize text, 1.4.8 Visual Presentation, and 1.4.12 Text Spacing, and a color-contrast callout reminds you that typography is only half the equation. For designers and developers checking whether a font size is readable or body copy line-height meets WCAG, this checker turns the spec into an interactive checklist.',
    examples: [
      { input: 'Defaults: system-ui stack, 16px, weight 400, line height 1.5, the bundled sample paragraph.', output: 'All five checks pass, an accessibility score of 100/100, and an x-height ratio of 0.50.', note: 'The default configuration is deliberately a passing one.' },
      { input: 'Font size changed to 14px with line height 1.2.', output: 'The score drops; "Body font size ≥ 16px" and "Line height ≥ 1.4" fail with red detail text explaining each issue.', note: 'Each failing check prints the specific reason rather than a bare X.' },
      { input: 'A sample textarea containing a single short sentence like "Hello world".', output: 'The line length check fails with "too short for a comfortable line", since the sample counts only 11 characters.', note: 'Sample length is measured from what you paste, so use real body copy.' },
    ],
    howTo: [
      'Set the "Font family" field to your CSS font stack.',
      'Enter the "Font size (px)" and pick a "Font weight" from the dropdown.',
      'Type the "Line height" as a unitless number, e.g. 1.5.',
      'Paste a representative paragraph into the "Text sample" area and watch the checks.',
      'Use "Copy CSS" to grab the settings, or "Reset" to return to the passing defaults.',
    ],
    useCases: [
      'Auditing a blog\'s body typography against WCAG before a redesign ships.',
      'Choosing a font weight for captions that stays readable at small sizes.',
      'Verifying a client\'s requested 14px body size fails the 16px recommendation.',
      'Tuning line height and length for long-form documentation pages.',
      'Generating the CSS declarations for an approved typographic scale.',
      'Teaching design students the 45–75 character line-length rule with live feedback.',
    ],
    bestPractices: [
      'Paste real body copy — the line-length check measures your actual sample text.',
      'Aim for the 1.5–1.6 line-height band, not merely the 1.4 minimum.',
      'Keep body text at 16px or above and scale headings with rem.',
      'Pair this check with a color contrast check, as the interface itself recommends.',
      'Use the Copy CSS button so the approved values reach the stylesheet verbatim.',
    ],
    faqs: [
      { q: 'How is the accessibility score calculated?', a: 'The five checks each contribute equally; the score is the percentage that pass, rounded to a whole number. All five passing yields 100/100.' },
      { q: 'What does the x-height ratio mean?', a: 'It estimates the lowercase x-height as 50% of the font size, since real glyph metrics are not available to the browser. Most body faces run 0.45–0.55, so 0.50 is a reasonable default.' },
      { q: 'Which WCAG criteria does the checker reference?', a: 'The guidance cards cover 1.4.4 Resize text, 1.4.8 Visual Presentation, and 1.4.12 Text Spacing, and the checks map to those criteria plus general readability practice.' },
      { q: 'Why does my sample fail the line length check?', a: 'The check counts characters in your pasted sample after flattening newlines and requires 45–75. Short or extremely long samples fail with specific messages telling you which side you are on.' },
      { q: 'Does the tool check color contrast?', a: 'No — it explicitly notes that contrast is a separate concern and points to the Color Contrast Checker tool, since contrast ratios depend on foreground and background colors.' },
      { q: 'Can I export the configuration as CSS?', a: 'Yes. The Copy CSS button copies font-family, font-size, font-weight, and line-height declarations, and the live preview card also displays the CSS block.' },
    ],
    tips: [
      'The score badge turns green at 80+, amber at 50+, and red below.',
      'Toggle weights to see which pass — all four standard weights are accepted.',
      'Reset restores the passing defaults in one click.',
      'Read the failing check details; they name the exact WCAG criterion.',
    ],
  },
  // ── png-to-webp ──

  'png-to-webp': {
    intro:
      'The PNG to WebP converter batch-converts PNG images to the modern WebP format with a quality slider, and it re-encodes automatically whenever you adjust the slider — no need to re-add files. Drop in one PNG or a whole folder of them, and each file lands in a results table showing a thumbnail, pixel dimensions, original size, WebP size, and a per-file savings percentage. Totals above the table sum the original and converted bytes and show an overall savings figure. Every row has a Download button, and "Download all" grabs the finished batch in one go. The quality slider runs from 0.1 to 1.0 (default 0.8) in 0.05 steps, and an alert explains the critical detail: anything below 1.0 is lossy, while 1.0 is near-lossless — so you always know which side of that line you are on. Conversion happens on a canvas inside the browser, meaning private images never reach a server. For site owners chasing Core Web Vitals, batch converting PNG assets to WebP typically cuts image weight by half or more, which is why this online PNG to WebP converter pays for itself on the first lighthouse run.',
    examples: [
      { input: 'Three PNG screenshots added with quality left at the 0.8 default.', output: 'The table lists each file\'s original and WebP sizes with savings like 62.4%, and the totals row shows overall savings.', note: 'Screenshots with flat colors compress especially well in WebP.' },
      { input: 'The same three files after dragging the quality slider down to 0.5.', output: 'All rows re-convert automatically; savings jump higher while thumbnails show slightly softer edges.', note: 'The re-convert-on-slider behavior makes A/B quality testing effortless.' },
      { input: 'A PNG with transparency, converted at quality 1.0.', output: 'A near-lossless WebP that keeps the alpha channel intact at minimal size reduction.', note: 'WebP retains transparency, unlike the JPEG path in other converters.' },
    ],
    howTo: [
      'Click "Choose PNG files" or drop one or more PNGs onto the upload area.',
      'Wait for each row to move from "Processing…" to a size and dimensions.',
      'Set the Quality slider — files re-convert automatically as you drag.',
      'Read per-file savings in the table and the totals in the stats row.',
      'Use each row\'s Download button, or "Download all" for the whole batch.',
    ],
    useCases: [
      'Converting a product image folder from PNG to WebP for an e-commerce relaunch.',
      'Shrinking documentation screenshots before committing them to a repository.',
      'Preparing WebP variants for a <picture> element serving modern browsers.',
      'Batch-optimizing a portfolio gallery to cut bandwidth on image-heavy pages.',
      'Converting transparency-bearing graphics without flattening to white.',
      'Testing quality levels side by side to find the smallest acceptable setting.',
    ],
    bestPractices: [
      'Use quality 0.8–0.9 for web photography and 1.0 when transparency must stay pristine.',
      'Remember the alert: values under 1.0 are lossy, so pick deliberately.',
      'Convert and compare on a copy — keep the original PNGs as masters.',
      'Serve WebP through a picture element with PNG fallbacks for old browsers.',
      'Batch small sets first to gauge typical savings before mass conversion.',
    ],
    faqs: [
      { q: 'Is the conversion lossy or lossless?', a: 'Both are available. Quality values below 1.0 use lossy encoding, while quality 1.0 is near-lossless. The alert under the slider spells out this distinction.' },
      { q: 'Can I convert multiple files at once?', a: 'Yes. The file picker and drop zone accept multiple PNGs, and every file gets its own row, conversion status, and download button.' },
      { q: 'What happens when I change the quality slider?', a: 'All loaded files re-convert automatically at the new quality, so you can sweep the slider and watch savings update live without re-uploading anything.' },
      { q: 'Does WebP preserve PNG transparency?', a: 'Yes. The canvas-to-WebP encode keeps the alpha channel, so transparent logos and UI assets convert without a white or black background.' },
      { q: 'Why is my PNG file rejected?', a: 'The tool filters strictly for PNG files — by MIME type or .png extension. JPEGs, GIFs, and other formats are skipped with a "Please select PNG files" toast.' },
      { q: 'Where do the savings percentages come from?', a: 'Each row compares the converted WebP blob size against the original file size, and the totals row does the same across all finished conversions, clamped at zero.' },
    ],
    tips: [
      'Drag the slider and watch the table refresh — quality testing is instant.',
      'Thumbnails render as WebP, so what you see is the actual output.',
      'Remove a row with its X button if one file is holding up the batch.',
      'Download all only includes rows that finished converting successfully.',
    ],
  },
}