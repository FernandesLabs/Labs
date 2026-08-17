// text-tools.ts — hand-written content overrides for the text category.
// Generated from a split of the original monolithic
// src/app/tools/[slug]/tool-content-overrides.ts into per-category
// modules (file-structure refactor). Content is byte-identical to the
// original; do not hand-edit formatting here unless you also update
// the merge in ./index.ts.
import type { ToolOverrideMap } from './types'

export const OVERRIDES: ToolOverrideMap = {
  'capitalization-tool': {
    intro:
      'Capitalization Tool rewrites text in seven distinct casings chosen from a grid of mode cards. Paste or type in the Original text textarea, then pick a mode and the Converted text ResultBox updates immediately because the transformation runs live with no button presses. Capitalize Each Word raises the first letter of every word, Sentence case capitalizes only letters that start a sentence, ALL CAPS and all lowercase do exactly what they promise, First letter only touches a single character, and tOGGLE cASE inverts every letter. Title Case (AP) is the most refined mode: it applies Associated Press style by keeping common small words like a, an, the, and of lowercase unless they fall at the very start or end of the title, and the small-word list appears as badges whenever that mode is active. The stat row tracks Input chars, Output chars, word count, and the currently selected Mode, making it easy to compare how each casing changes a block. Clear empties the editor, Copy output sends the converted result to the clipboard, and the default sample demonstrates every mode effectively.',
    examples: [
      {
        input: 'the quick brown fox jumps over the lazy dog. a great example of natural language.',
        output: 'The Quick Brown Fox Jumps Over the Lazy Dog. A Great Example of Natural Language.',
        note: 'Title Case (AP) caps first and last words while keeping small words like the, a, and of lowercase in the middle.',
      },
      {
        input: 'the quick brown fox jumps over the lazy dog. a great example of natural language.',
        output: 'The quick brown fox jumps over the lazy dog. A great example of natural language.',
        note: 'Sentence case lowercases everything, then lifts only the first letter of the text and the first letter after a period, exclamation, or question mark.',
      },
      {
        input: `Hello WORLD, it's ME`,
        output: `hELLO world, IT'S me`,
        note: "tOGGLE cASE inverts every letter while leaving punctuation and spaces untouched, so the apostrophe in it's stays put.",
      },
    ],
    howTo: [
      'Type or paste text into the Original text textarea; the default sample demonstrates all modes.',
      'Click a Capitalization mode card such as Title Case (AP) or tOGGLE cASE to apply it.',
      'Watch the Converted text ResultBox update instantly as you switch modes or edit the input.',
      'In Title Case (AP), check the AP small words badge row to see which words stay lowercase.',
      'Use Clear to reset the editor and Copy output to put the converted text on the clipboard.',
    ],
    useCases: [
      'Normalising user-submitted names to Capitalize Each Word before display.',
      'Converting article headings to Title Case (AP) for a consistent editorial style.',
      'Lowercasing imported CSV values so joins against stored data become case-insensitive.',
      'Mocking alt text or stand-in copy with tOGGLE cASE during a design review.',
      'Repairing a pasted block of shouting text using the lower or sentence modes.',
      'Preparing consistent casing for meta titles and social share snippets.',
    ],
    bestPractices: [
      'Apply Title Case (AP) consistently across headings so article titles share one editorial rule.',
      'Reserve ALL CAPS for acronyms and short alerts, never whole sentences, to protect readability.',
      'Choose Sentence case for body previews and meta descriptions where natural flow matters most.',
      'Verify hyphenated and contracted words after Capitalize Each Word, since both are special cases.',
      'Confirm the Words stat matches expectations before publishing, catching double spaces from pasted text.',
      'Check the Output chars stat so a casing change does not silently mangle punctuation or digits.',
    ],
    faqs: [
      { q: 'Why does title case keep words lowercase?', a: 'Title Case (AP) applies Associated Press style, which keeps short function words like a, an, the, and of lowercase unless they start or end the title. The badge row shows the full small-word list every time the mode is active.' },
      { q: 'Does the tool handle apostrophes correctly?', a: 'Each Word mode matches letter runs that include apostrophes and hyphens, so contractions like don\'t stay a single token and become Don\'t, and hyphenated compounds keep their dashes. AP mode strips punctuation before testing small words, which is why title case is not confused by trailing periods.' },
      { q: 'Is conversion applied live as I type?', a: 'Yes, the output is derived with a memoized calculation, so selecting a new mode card or editing the original text updates the Converted text ResultBox immediately. You never click a convert button because the input and mode are the only variables.' },
      { q: 'What does tOGGLE cASE actually do?', a: 'Toggle case inverts the casing of every alphabetic character, turning lowercase into uppercase and uppercase into lowercase while leaving digits, punctuation, and spaces untouched. It is the classic style for mocking content and emphasizes how easily the same text changes meaning.' },
      { q: 'How is the word count calculated?', a: 'The Words stat trims the input and splits it on runs of whitespace, so extra spaces between sentences do not inflate the number. It counts real words rather than letters, which matches what writers expect from an editor and stays constant across all seven modes.' },
      { q: 'Which mode should I use for headlines?', a: 'Title Case (AP) is the standard for editorial headlines because it follows widely accepted style rules. For email subjects or ad copy, Sentence case reads naturally, while ALL CAPS draws attention but should stay rare since readability drops sharply in shouting text.' },
    ],
    tips: [
      'Run the default sample through every mode once so the seven outcomes feel familiar before writing real copy.',
      'Prefer Capitalize Each Word or Title Case (AP) for button labels and titles, and Sentence case for paragraphs.',
      'Use tOGGLE cASE when you want clearly stand-in text that no reviewer will mistake for final copy.',
      'Compare the Input chars and Output chars stats to gauge how aggressively each mode rewrites your text.',
    ],
  },
  'lorem-ipsum-generator': {
    intro:
      'Lorem Ipsum Generator produces classic placeholder text in exactly the unit you need. Set the Count field to any number from 1 to 100 and choose Paragraphs, Sentences, or Words from the Unit dropdown; a count outside that range is refused with a Count must be between 1 and 100 toast. The Start with "Lorem ipsum" switch prepends the opening movement of the traditional passage, so paragraphs and sentence lists begin with the recognizable Latin phrase that designers and developers expect. Clicking Generate is the only trigger, and the text is composed randomly each time from the built-in classic vocabulary, with sentences running roughly 8 to 17 words that all start with a capital letter and end with a period. Paragraphs hold three to six sentences each and are separated by blank lines in the result. The Generated text ResultBox supports one-click copy and downloads the output as lorem-ipsum.txt for pasting into wireframes, mockups, or font sample sheets. Because everything lives in the browser, there is no network delay and no quota, so regenerating until the layout looks right costs nothing.',
    examples: [
      {
        input: 'Count 6, Unit Words, Start with "Lorem ipsum" on.',
        output: 'Lorem ipsum dolor sit amet consectetur.',
        note: 'The classic opening supplies the first six words, capitalized as a unit with a trailing period, then without enough room for random filler.',
      },
      {
        input: 'Count 1, Unit Sentences, Start with "Lorem ipsum" on.',
        output: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        note: 'The first sentence is exactly the classic opening plus a period, so this result is deterministic across every click.',
      },
      {
        input: 'Count 0, Unit Paragraphs, Start with "Lorem ipsum" on, then Generate.',
        output: 'Nothing generated — a toast reads Count must be between 1 and 100 and the result box stays empty.',
        note: 'The count is validated on the Generate click, so out-of-range values never produce placeholder text.',
      },
    ],
    howTo: [
      'Enter a Count between 1 and 100 in the Count field.',
      'Pick Paragraphs, Sentences, or Words from the Unit dropdown to set the output granularity.',
      'Keep the Start with "Lorem ipsum" switch on for classic openings, or toggle it off for purely random text.',
      'Click Generate to compose the placeholder text and render it in the Generated text box.',
      'Copy the output or download it as lorem-ipsum.txt, then adjust the count and regenerate as the layout demands.',
    ],
    useCases: [
      'Filling a wireframe layout with placeholder body copy while the real content is being written.',
      'Generating short word strings to measure button, badge, and label widths.',
      'Packing a page mock with several paragraphs of text to assess reading rhythm.',
      'Testing font rendering and line-height on a website template using the classic Latin opening.',
      'Producing dummy text for a print brochure or poster layout during the design phase.',
      'Stress-testing a layout editor with 100 units of sample input to confirm performance.',
    ],
    bestPractices: [
      'Match the placeholder word density to real copy so text wrapping and button widths are tested honestly.',
      'Turn off Start with "Lorem ipsum" in client-facing mockups so reviewers focus on layout, not Latin confusion.',
      'Keep counts small, since a few paragraphs reveal layout behavior just as well as dozens.',
      'Pair the Words output with button and label prototypes to confirm short strings fit their containers.',
      'Regenerate several times to vary line breaks and expose wrapping issues your final copy might hit.',
      'Treat the output strictly as layout filler, since real UX copy needs actual vocabulary and tone.',
    ],
    faqs: [
      { q: 'Why should the count stay between 1 and 100?', a: 'The Count field accepts any integer from 1 to 100, and the Generate handler refuses values outside that band with a Count must be between 1 and 100 toast. This guard keeps generation fast even for the largest documents while still covering real wireframes and mockups comfortably.' },
      { q: 'Is the classic opening always included?', a: 'Only when the Start with "Lorem ipsum" switch is enabled. With it on, word lists, first sentences, and opening paragraphs begin with the traditional Lorem ipsum dolor sit amet phrase; toggling it off produces purely random text drawn from the same Latin vocabulary.' },
      { q: 'Why does the output change every click?', a: 'The generator composes text from a shared word list using a random index for each choice, with sentences built from 8 to 17 words. Every click of Generate yields a fresh arrangement, which is ideal for checking how layouts behave when real copy length and rhythm vary.' },
      { q: 'How many sentences make up a paragraph?', a: 'Generated paragraphs contain between three and six sentences, chosen at random, while the special first paragraph adds the classic opening and two more sentences. Paragraphs are joined by blank lines so the text stays readable when pasted into a design.' },
      { q: 'Does it use genuine Latin sentences?', a: 'It uses the traditional Lorem vocabulary, but readability matters more than grammar, so sentences are random word sequences with a capitalized first letter and a trailing period. That is exactly what casual placeholder use needs, and the classic opening remains authentic by design.' },
      { q: 'Can I download the generated text?', a: 'Yes, the Generated text box includes a download control that saves the output as lorem-ipsum.txt, plus a copy button for pasting directly into a document. Because the count is capped at 100, the largest single download is one hundred paragraphs, sentences, or words.' },
    ],
    tips: [
      'Generate Words first to size small elements, then switch to Paragraphs for full mock layouts.',
      'Turn off Start with "Lorem ipsum" when reviewers might mistake placeholder Latin for real copy.',
      'Regenerate a few times in Sentences mode to stress-test line wrapping with different rhythms.',
      'Keep the count modest, because dozens of paragraphs rarely add fidelity to a wireframe.',
    ],
  },
  'unicode-inspector': {
    intro:
      'Unicode Inspector breaks any text down so every single character can be examined on its own. Type into the single-line Text field and the Character breakdown table repopulates live, with one row per code point numbered from zero. For each character the table lists the printable Char, its Code point in hexadecimal form, a Name, a Category badge, and the exact byte representations used by UTF-8 and UTF-16. ASCII characters receive their full official Unicode names such as LATIN CAPITAL LETTER A, while everything else is labelled with its code point, because the complete Unicode name database is not bundled client-side. Control characters like tabs and line feeds are rendered as escapes such as \t and \n, and spaces appear as visible markers. The stat grid totals Code points, UTF-8 bytes, UTF-16 units, and Letters, with a second row counting every category. For performance, only the first 512 characters are rendered in the table, and a note appears when longer text is truncated. The bundled sample, Hello, 世界! 🌍, demonstrates ASCII, CJK, and an emoji in one go.',
    examples: [
      {
        input: `Hello, 世界! 🌍`,
        output: `11 code points - 20 UTF-8 bytes - 14 UTF-16 units - 7 Letters
H   U+0048  LATIN CAPITAL LETTER H       Letter  48         0048
世  U+4E16  Code point U+4E16             Letter  E4 B8 96   4E16
🌍  U+1F30D Code point U+1F30D            Symbol  F0 9F 8C 8D D83C DF0D`,
        note: 'The default sample spans ASCII, CJK, and an emoji; the globe takes four UTF-8 bytes but is still a single code point.',
      },
      {
        input: `a\tb\n`,
        output: `4 code points - 4 UTF-8 bytes - 4 UTF-16 units - 2 Letters - 2 Control
a   U+0061  LATIN SMALL LETTER A    Letter   61      0061
\t  U+0009  CHARACTER TABULATION    Control  09      0009
b   U+0062  LATIN SMALL LETTER B    Letter   62      0062
\n  U+000A  LINE FEED               Control  0A      000A`,
        note: 'Control characters display as \t and \n escapes instead of invisible bytes, and the category tiles count two Control rows.',
      },
      {
        input: `café`,
        output: `4 code points - 5 UTF-8 bytes - 4 UTF-16 units - 4 Letters
c  U+0063  LATIN SMALL LETTER C             Letter  63      0063
é  U+00E9  Code point U+00E9                 Letter  C3 A9   00E9`,
        note: 'The precomposed é expands to two UTF-8 bytes, C3 A9, while remaining one code point and one UTF-16 unit.',
      },
    ],
    howTo: [
      'Type or paste text into the single-line Text field; the default mixed-script sample loads automatically.',
      'Scan the stat tiles for Code points, UTF-8 bytes, UTF-16 units, and the Letters count.',
      'Review the Character breakdown table for each character\'s Code point, Name, and Category badge.',
      'Compare the UTF-8 bytes and UTF-16 units columns to understand how each encoding represents the character.',
      'Watch for the 512-character truncation note and shorten the input if only part of the table renders.',
    ],
    useCases: [
      'Checking whether pasted content hides tabs or line feeds before cleanup.',
      'Confirming that an emoji in an interface is the code point you expect.',
      'Diagnosing mojibake by comparing UTF-8 byte sequences of two visually identical strings.',
      'Auditing a string for control characters that break JSON or CSV exports.',
      'Teaching how UTF-8 and UTF-16 encode the same character differently.',
      'Verifying the byte size of a user-generated field before setting database limits.',
    ],
    bestPractices: [
      'Inspect scraped or imported text for hidden Control characters before it lands in production strings.',
      'Verify emoji and CJK through the table, since invisible encoding issues are the hardest to reproduce later.',
      'Check the UTF-8 bytes column when configuring databases, because storage limits depend on bytes, not characters.',
      'Use the UTF-16 units column to reason about JavaScript string length, which counts code units rather than characters.',
      'Keep inputs under 512 code points when you need the complete table, watching for the truncation note.',
    ],
    faqs: [
      { q: 'Why does non-ASCII text show U+ names?', a: 'The full Unicode name database is too large to ship client-side, so the tool includes only the official names for ASCII code points 0 to 127. Any other character is labelled Code point U+XXXX with its code point, which still uniquely identifies the character.' },
      { q: 'What do spaces and tabs look like?', a: 'Whitespace would be invisible in the table, so an ordinary space is drawn as a raised middle dot and the non-breaking space as a special glyph. Tabs, line feeds, and carriage returns are rendered as \t, \n, and \r, and other control characters appear as hexadecimal escapes.' },
      { q: 'Why is the table limited to 512 rows?', a: 'Rendering every character of very long input would bog down the browser, so only the first 512 code points are shown and a note warns when text is truncated. The category and byte totals still count the whole string, so the stats remain accurate for full documents.' },
      { q: 'What is a code point exactly?', a: 'A code point is the numeric identity of a character in Unicode, written here as U+XXXX. The tool iterates text by code point, so emoji such as the globe sample appear as a single row instead of being split across the surrogate halves JavaScript uses internally.' },
      { q: 'How are the seven categories counted?', a: 'Seven categories are counted: Letter, Number, Punctuation, Symbol, Space, Control, and Other. Each character is classified with Unicode property tests for five of them, explicit control ranges for the sixth, and everything else falls into Other, with the stat grid totalling each bucket.' },
      { q: 'How do UTF-8 and UTF-16 differ?', a: 'UTF-8 writes ASCII in one byte and other scripts in up to four, and the table lists each byte in uppercase hex such as E4 B8 96 for 世. UTF-16 uses 16-bit code units, so an emoji occupying two units appears as two hex values like D83C DF0D.' },
    ],
    tips: [
      'Paste a snippet with mixed scripts to quickly compare how many bytes each encoding needs.',
      'Hunt for invisible Control characters in scraped text by scanning the Category column for the red badge.',
      'Verify a copy-pasted emoji really is the character you expect by reading its U+ code point.',
      'Compare UTF-16 units of two samples when debugging surrogate-pair issues in JavaScript string handling.',
    ],
  },
  // ── word-counter ──

  'word-counter': {
    intro:
      'Whether you are drafting a blog post, tightening a resume, or meeting a strict word limit, knowing your exact counts matters. The Word Counter tool gives you every metric in one place, updating live as you type or paste text into the box: total words, characters with and without spaces, sentences, paragraphs, and estimated reading and speaking time calculated at 200 and 130 words per minute respectively. Below the stat grid sits a ranked Top 10 word frequency table, which tallies the words you lean on most while automatically excluding common stop words like the, and, or is, so you can spot repetition and filler that weaken your writing. There is nothing to configure and no button to press — every number refreshes the moment your text changes, and a single Clear button resets the field when you are ready for the next draft. For writers, students, and editors, this live word counter turns an ordinary copy-paste habit into an instant editorial check, whether you are sizing a meta description, preparing a speech, or simply trying to write leaner, more deliberate prose.',
    examples: [
      { input: 'Dog and cat. Dog likes fish.', output: 'Words: 6\nCharacters: 28\nNo spaces: 23\nSentences: 2\nParagraphs: 1\nReading time: 2s\nSpeaking time: 3s\n\nTop 10 word frequency (stop words excluded):\ndog: 2 (40.0%)\ncat: 1 (20.0%)\nfish: 1 (20.0%)\nlikes: 1 (20.0%)', note: 'The stop word "and" is excluded from the frequency ranking automatically.' },
      { input: 'First paragraph with one sentence.\n\nSecond paragraph with two sentences. It continues here.', output: 'Words: 13\nCharacters: 91\nNo spaces: 77\nSentences: 3\nParagraphs: 2\nReading time: 4s\nSpeaking time: 6s', note: 'A blank line between blocks counts as a second paragraph.' },
      { input: 'The website speed test shows speed results for the speed optimization plan. The speed report is ready.', output: 'Words: 17\nSentences: 2\nParagraphs: 1\nReading time: 5s\nSpeaking time: 8s\n\nTop 10 word frequency:\nspeed: 4 (33.3%)\nwebsite: 1 (8.3%)\ntest: 1 (8.3%)\nshows: 1 (8.3%)', note: 'The frequency table flags "speed" appearing four times — a cue to vary the vocabulary.' },
    ],
    howTo: [
      'Open the Word Counter tool and click inside the text area labeled Text.',
      'Paste or type your content; every stat updates live as you work — there is no submit button.',
      'Read the stat grid for Words, Characters, No spaces, Sentences, Paragraphs, Reading time, Speaking time, and WPM read / speak.',
      'Scroll to the Top 10 word frequency table to see your most-used non-stop words, each word\'s count, and its share percentage.',
      'Click Clear to empty the text area and start the next measurement.',
    ],
    useCases: [
      'Checking essay and article drafts against assignment word-count targets.',
      'Measuring meta description length before publishing a page.',
      'Estimating how long a speech or video script will run using speaking time.',
      'Spotting overused words with the stop-word-filtered frequency table.',
      'Tracking paragraph count while structuring a landing page or report.',
      'Comparing draft lengths across revisions to keep team writing consistent.',
    ],
    bestPractices: [
      'Treat sentence and paragraph counts as estimates for punctuation-heavy text, and as exact figures for plain prose.',
      'Separate paragraphs with a blank line so the paragraph counter matches your intended structure.',
      'Use the frequency table to set a diversity goal — for example, no non-stop word over 5% of the corpus.',
      'Pair reading and speaking time with your target platform: 200 WPM for print, 130 WPM for spoken delivery.',
      'Clear the field between documents so stats never mix two drafts together.',
    ],
    faqs: [
      { q: 'How does the Word Counter count words?', a: 'It splits your text on any whitespace and counts each non-empty token as one word, so hyphenated compounds like state-of-the-art count as one while every space-separated string counts separately. This matches the way most word processors and submission systems tally words, which makes the tool safe for essays and article limits. Emoji and punctuation attached to words do not create extra counts.' },
      { q: 'What reading and speaking speeds does it use?', a: 'The tool estimates reading time at 200 words per minute and speaking time at 130 words per minute. These are standard averages for adult silent reading and conversational delivery. Times are shown in a friendly format such as 2m 15s, and the WPM read / speak stat card displays both rates so you always know which speeds were applied.' },
      { q: 'Why are some words missing from the frequency table?', a: 'The Top 10 word frequency panel automatically excludes a built-in list of common stop words — the, and, of, to, is, and similar — plus any token shorter than two characters. This keeps the ranking focused on words that actually carry meaning, so you can spot overused vocabulary instead of seeing filler dominate the list.' },
      { q: 'Does the Word Counter work with languages other than English?', a: 'Yes. Word, character, and sentence counting are language-agnostic because they rely on whitespace and punctuation rather than dictionaries. The frequency table tokenizes Latin letters, digits, apostrophes, and hyphens, so accented words are counted and ranked normally, and text in any script still gets accurate word, character, and paragraph totals.' },
      { q: 'How accurate is the sentence count?', a: 'Sentences are detected by looking for segments that end with a period, exclamation mark, or question mark followed by whitespace or the end of the text. Abbreviations with internal periods can occasionally be split, so treat the sentence and paragraph figures as strong estimates for plain prose rather than exact counts for heavily punctuated or technical text.' },
      { q: 'Is my text sent to any server?', a: 'No. Everything runs in your browser as you type — the tool never uploads, stores, or logs the text you paste. You can count sensitive drafts, private documents, or confidential copy without worrying about where the data goes. Nothing is transmitted anywhere; the stats update purely through client-side computation.' },
    ],
    tips: [
      'Use the frequency table to hunt down your crutch words — if a term outside the stop list ranks top three, consider varying it.',
      'The paragraph count treats two or more consecutive newlines as a break, so separate paragraphs with a blank line for accurate numbers.',
      'Paste an existing draft to check how close you are to an article word-count target before submitting.',
      'Remember the numbers include punctuation attached to words — "dog." is one token, not two.',
    ],
  },
  // ── character-counter ──

  'character-counter': {
    intro:
      'Character limits are everywhere: tweet boxes, meta titles, meta descriptions, SMS, ad headlines, form fields, and code editors. The Character Counter tool breaks your text down to the exact character level and updates live as you type, so you always know where you stand. Paste or type into the text area and the stat grid instantly reports total characters, characters without spaces, letters, digits, whitespace, lines, UTF-8 bytes, and the bytes-per-character ratio — the last two matter when your text includes emoji or non-Latin scripts, where one visible character can occupy multiple bytes. A dedicated Tweet length panel tracks your text against the 280-character limit with a progress bar, a live characters-remaining readout, and an explicit over-the-limit warning the moment you cross the line. Whether you are drafting a social post, trimming a meta description for search results, or counting bytes for a database field, this free character counter removes the guesswork and the constant switching to a notepad to count by hand.',
    examples: [
      { input: 'Hello World!', output: 'Characters: 12\nNo spaces: 11\nLetters: 10\nDigits: 0\nWhitespace: 1\nLines: 1\nBytes (UTF-8): 12\nBytes / chars: 1.00\n\nTweet length: 12 / 280\n268 characters remaining', note: 'All ASCII characters, so bytes and characters match at 1.00.' },
      { input: 'Hello 世界', output: 'Characters: 8\nNo spaces: 7\nLetters: 5\nDigits: 0\nWhitespace: 1\nLines: 1\nBytes (UTF-8): 12\nBytes / chars: 1.50', note: 'Each Chinese character counts as one character but three UTF-8 bytes.' },
      { input: 'Hi\nthere', output: 'Characters: 8\nNo spaces: 7\nLetters: 7\nDigits: 0\nWhitespace: 1\nLines: 2\nBytes (UTF-8): 8\n\nTweet length: 8 / 280\n272 characters remaining', note: 'The newline is one character, one whitespace, and splits the text into two lines.' },
    ],
    howTo: [
      'Paste your text into the text area labeled Text.',
      'Check the live stat grid for Characters, No spaces, Letters, Digits, Whitespace, Lines, Bytes (UTF-8), and Bytes / chars.',
      'Watch the Tweet length panel to see your progress against the 280-character limit.',
      'Read the remaining or over-limit message below the progress bar to know exactly how much to trim or restore.',
      'Click Clear when you want to count a new piece of text from zero.',
    ],
    useCases: [
      'Drafting tweets and trimming them to fit the 280-character limit.',
      'Sizing meta titles and meta descriptions for search result snippets.',
      'Checking UTF-8 byte length for database VARCHAR limits.',
      'Counting characters for SMS, ad headlines, and form fields.',
      'Measuring lines in pasted text to spot unwanted hard wraps.',
      'Auditing text for stray emoji or multibyte characters before export.',
    ],
    bestPractices: [
      'Track the No spaces figure, not raw characters, when a platform counts letters excluding spaces.',
      'Use the tweet panel as a general limit meter by remembering the 280 baseline while targeting your own number.',
      'Keep the Bytes / chars ratio in mind before inserting text into fixed-width database columns.',
      'Watch the Lines stat for hard-wrapped pastes and re-wrap before finalizing.',
      'Trim in small passes and watch the remaining counter to avoid overshooting the limit.',
    ],
    faqs: [
      { q: 'What is the difference between characters and bytes?', a: 'Characters are what you see — letters, digits, punctuation, emoji, and whitespace — while UTF-8 bytes are the storage cost of those characters. ASCII characters use one byte each, but accented letters take two and emoji can take four, so the Bytes (UTF-8) stat and the Bytes / chars ratio reveal how much space your text actually occupies, which matters for database fields and APIs.' },
      { q: 'Does the tweet counter really match the 280-character limit?', a: 'The Tweet length panel measures your text against the 280-character limit exactly as it is counted in the text area, showing a live progress bar, a current-versus-limit readout, and a remaining count. When you exceed the limit, the panel switches to a warning state that tells you exactly how many characters over you are so you know what to trim.' },
      { q: 'Are line breaks counted as characters?', a: 'Yes, but you can see their impact precisely: the Characters stat includes newline characters, while No spaces excludes all whitespace including line breaks, and the Lines stat reports the number of lines directly. The Whitespace stat tallies spaces, tabs, and newlines combined, so you can reconcile any difference between the two character totals at a glance.' },
      { q: 'How are emoji and multibyte characters counted?', a: 'Every emoji counts as one character even though it may occupy up to four UTF-8 bytes. The Letters and Digits stats ignore emoji entirely because they only match alphabetic and numeric characters, but Characters, No spaces, and Bytes all include them, and the Bytes / chars ratio will climb above 1.00 when emoji or accented text is present.' },
      { q: 'Can I use the Character Counter for SEO meta tags?', a: 'Yes. Meta titles and descriptions have strict recommended lengths for search results, and the live character readout with and without spaces makes trimming to size straightforward. Paste your draft, watch the totals update as you edit, and stop when you hit your target — the tweet-style progress bar gives you the same at-a-glance feedback for any limit you track manually.' },
      { q: 'Does the tool store my text anywhere?', a: 'No. All counting happens in your browser, locally, in real time. Nothing you paste is uploaded, saved, or shared, so you can run the character counter on confidential content, drafts, or source code without privacy concerns. Clear the field with the Clear button whenever you want to remove the text from the page.' },
    ],
    tips: [
      'The Bytes / chars ratio is your emoji detector: anything above 1.00 means multibyte characters are present.',
      'When trimming a tweet, the amber remaining-count state kicks in under 20 characters — use it as your landing strip.',
      'Watch the Lines stat after pasting from PDFs; unexpected line counts often reveal hard-wrapped text.',
      'Keep a target in mind for meta descriptions (roughly 155 characters) and trim until the No spaces figure fits the limit your content calendar enforces.',
    ],
  },
  // ── case-converter ──

  'case-converter': {
    intro:
      'Fixing the casing of text by hand is slow, error-prone, and completely unnecessary. The Case Converter tool transforms any block of text into eleven distinct case styles in a single click — UPPERCASE, lowercase, Title Case, Sentence case, camelCase, PascalCase, snake_case, kebab-case, CONSTANT_CASE, aLtErNaTiNg, and InVeRsE — each presented as its own clearly labeled button in the Transformations grid. Paste your source text into the Original text area, click a transformation, and the converted result appears instantly in the Converted text box below, while your original input stays untouched for reference. The tool even remembers your last applied transformation and re-applies it live if you edit the source text afterward. One click on Copy output puts the finished string on your clipboard, ready for a code identifier, a database column name, a filename, or a headline. Whether you are a developer normalizing variable names for JavaScript, Python, or SQL, or a writer reformatting a title for publication, this text case converter eliminates the most tedious part of retyping content that is already sitting in front of you.',
    examples: [
      { input: 'hello world, welcome to fernandes labs', output: 'UPPERCASE:\nHELLO WORLD, WELCOME TO FERNANDES LABS\n\nTitle Case:\nHello World, Welcome To Fernandes Labs', note: 'UPPERCASE changes every letter; Title Case capitalizes the first letter of each word.' },
      { input: 'my new feature request', output: 'camelCase:\nmyNewFeatureRequest\n\nPascalCase:\nMyNewFeatureRequest\n\nsnake_case:\nmy_new_feature_request\n\nCONSTANT_CASE:\nMY_NEW_FEATURE_REQUEST', note: 'Word-based styles split on spaces and punctuation, then join with nothing or an underscore.' },
      { input: 'hello world, welcome to fernandes labs', output: 'aLtErNaTiNg:\nhElLo WoRlD, wElCoMe To FeRnAnDeS lAbS', note: 'Alternating case toggles each letter but leaves punctuation and spaces untouched.' },
    ],
    howTo: [
      'Paste or type your source text into the Original text area.',
      'Pick a style from the Transformations grid — UPPERCASE, lowercase, Title Case, Sentence case, camelCase, PascalCase, snake_case, kebab-case, CONSTANT_CASE, aLtErNaTiNg, or InVeRsE.',
      'Review the result in the Converted text box; your original stays untouched above.',
      'Edit the original text and watch the output re-apply the last transformation automatically.',
      'Click Copy output to grab the result, or Reset to clear both boxes.',
    ],
    useCases: [
      'Converting identifiers between camelCase, snake_case, and CONSTANT_CASE for code.',
      'Fixing ALL-CAPS copy from pasted emails or reports.',
      'Preparing Title Case headlines for blog posts and newsletters.',
      'Producing kebab-case names for filenames and URL fragments.',
      'Normalizing database column names before migration scripts.',
      'Creating stylized alternating-case text for social posts.',
    ],
    bestPractices: [
      'Match the case style to the target ecosystem: camelCase for JavaScript, snake_case for Python and SQL, kebab-case for URLs.',
      'Convert from the same original each time instead of chaining conversions, which can compound transformations.',
      'Review the split words for multi-word phrases — acronyms like HTML get split into H T M L by word-based modes.',
      'Prefer Sentence case for body copy and Title Case only for headings where every word should be emphasized.',
      'Copy the output immediately after conversion to avoid losing the result while switching tools.',
    ],
    faqs: [
      { q: 'Which case should I use for JavaScript variables?', a: 'camelCase is the standard convention for JavaScript and TypeScript variable and function names — the first word stays lowercase and each following word is capitalized with no separators, like fetchUserData. PascalCase is used for class and component names. Use the matching button in the Transformations grid and the output will follow the convention automatically.' },
      { q: 'What is the difference between Title Case and Sentence case?', a: 'Title Case capitalizes the first letter of every word in the text, while Sentence case lowercases everything and only capitalizes the first letter after a sentence-ending period, question mark, or exclamation mark. For headlines and blog titles pick Title Case; for body copy and paragraphs where only the start of each sentence should be capitalized, pick Sentence case.' },
      { q: 'Does the converter handle words separated by punctuation?', a: 'Yes. For the word-based styles — camelCase, PascalCase, snake_case, kebab-case, and CONSTANT_CASE — the tool first splits your input on any non-alphanumeric boundary and on camelCase humps, so a phrase like "hello, world" becomes helloWorld or hello_world cleanly. Apostrophes and hyphens inside words are preserved during the split.' },
      { q: 'What happens if I edit the original text after converting?', a: 'The tool remembers the last transformation you applied and re-runs it automatically whenever the original text changes, so the output stays in sync. This makes it easy to paste a draft, convert it, and keep polishing the source while the converted version updates itself — no need to click the button again after each edit.' },
      { q: 'What does the InVeRsE transformation actually do?', a: 'InVeRsE swaps the case of every letter: lowercase letters become uppercase and uppercase letters become lowercase, while numbers, punctuation, and spaces pass through unchanged. It is useful for spotting case inconsistencies, creating stylized text, or reversing a previous case mistake in a copied snippet of code or prose.' },
      { q: 'Is the Case Converter safe for large blocks of text?', a: 'Yes. Conversion is computed locally in your browser, so text never leaves your machine, and the transformations handle multi-paragraph input comfortably. The original stays preserved in the Original text area while results appear in the Converted text box, so you can compare before and after and copy only the converted version when you are happy with it.' },
    ],
    tips: [
      'Batch-convert: apply one case, copy, then click the next button on the same original — the source text stays untouched.',
      'For database column names use snake_case; for URL fragments use kebab-case; for React components use PascalCase.',
      'Edit the original after converting and the last applied case re-runs automatically, so refine and convert in one flow.',
      'Use alternating or inverse case on a headline to make it stand out in forum signatures and chat messages.',
    ],
  },
  // ── slug-generator ──

  'slug-generator': {
    intro:
      'A clean, readable URL slug is a small detail with outsized SEO impact. The Slug Generator tool converts any headline or phrase into a URL-safe permalink string in real time: it strips accents and diacritics, replaces every run of non-alphanumeric characters with your chosen separator, and joins the remaining words together. A separator dropdown lets you pick between hyphens and underscores; a Lowercase switch normalizes case (on by default); and a Strip stopwords toggle removes filler words like the, of, and your so the slug stays keyword-dense. A Max length slider — adjustable from unlimited to 200 characters, defaulting to 80 — truncates long titles cleanly and trims any trailing separator so the result never ends with a dangling dash. Everything updates live as you type, and the finished slug can be copied or downloaded straight from the Slug output box. Content marketers, developers, and site owners use this URL slug generator to keep permalinks consistent, short, and keyword-focused across blog posts, product pages, and documentation — exactly what search engines prefer.',
    examples: [
      { input: '10 SEO Tips for Small Business Owners!', output: '10-seo-tips-for-small-business-owners', note: 'Defaults: hyphen separator, lowercase on, 80-character cap. Punctuation and the exclamation mark become word boundaries.' },
      { input: 'The Best Way to Learn TypeScript in 2025', output: 'best-way-learn-typescript-2025', note: 'With Strip stopwords switched on, the, to, and in are dropped from the slug.' },
      { input: 'The quick brown fox jumps over the lazy dog', output: 'the_quick_brown_fox', note: 'Underscore separator with Max length set to 20; the trailing underscore fragment is trimmed.' },
    ],
    howTo: [
      'Type or paste your title into the Text input field; the slug preview updates as you type.',
      'Choose Hyphen ( - ) or Underscore ( _ ) from the Separator dropdown.',
      'Toggle Lowercase and Strip stopwords to match your URL convention.',
      'Drag the Max length slider to cap the slug length, or set it to 0 to see the infinity symbol for unlimited.',
      'Copy or download the finished slug from the Slug output box.',
    ],
    useCases: [
      'Turning blog headlines into clean permalink slugs.',
      'Generating SEO-friendly URLs for product and category pages.',
      'Preparing documentation filenames with consistent hyphenation.',
      'Building short link identifiers for campaigns and tracking.',
      'Converting accented titles into ASCII-safe URL tokens.',
      'Enforcing a max-length slug convention across a content team.',
    ],
    bestPractices: [
      'Default to hyphens for SEO-facing URLs and reserve underscores for code and filesystem names.',
      'Keep slugs between 40 and 60 characters so they remain readable in search results and share previews.',
      'Strip stopwords for content pages where keyword density matters, but keep them off for exact filenames.',
      'Set Max length to your CMS limit so every slug you generate fits without manual trimming.',
      'Write the title naturally first, then generate the slug from it rather than composing both by hand.',
    ],
    faqs: [
      { q: 'Are hyphens or underscores better for SEO slugs?', a: 'Hyphens are the established best practice: search engines interpret hyphens as word separators, so best-way-learn-typescript reads as five words, while underscores can be treated as joining characters. The tool defaults to Hyphen ( - ) for this reason, but you can switch to Underscore ( _ ) when your CMS, framework, or file-naming convention requires it.' },
      { q: 'What does the Strip stopwords switch do?', a: 'It removes a fixed list of common English filler words — the, a, of, to, your, and similar — from the generated slug, leaving only the meaningful, keyword-dense words. This shortens URLs and concentrates their relevance. Stopword filtering is off by default so nothing is removed unless you opt in, and the preview updates live when you toggle it.' },
      { q: 'How does the Max length slider work?', a: 'The slider caps the generated slug at anywhere from unlimited to 200 characters, defaulting to 80. If the slug would be longer, it is truncated to the limit and any trailing separator fragment is trimmed, so you never get a URL ending in a dangling dash. Set it to 0 to see an infinity symbol and disable the limit entirely.' },
      { q: 'How does the generator handle accented characters?', a: 'It normalizes input with Unicode NFKD decomposition and strips combining diacritics, so Cómo becomes Como, café becomes cafe, and München becomes Munchen. This keeps slugs ASCII-safe and avoids percent-encoded characters in URLs while preserving the meaning of the original words.' },
      { q: 'Can I generate slugs in languages other than English?', a: 'Yes, with one caveat: non-Latin scripts such as Cyrillic, Chinese, or Arabic contain no A–Z characters, so their words are removed during the alphanumeric filtering step. Latin-script languages like Spanish, French, and German work fully after diacritic stripping, and the Lowercase switch handles their case-folding without issues.' },
      { q: 'Why does my slug look different from the raw title?', a: 'Three transforms happen in order: diacritics are stripped, every run of non-alphanumeric characters is converted to word boundaries, and then your options — separator choice, lowercase, stopword removal, and max length — are applied. Punctuation like apostrophes and em dashes disappears, and numbers are kept. The result is a clean, predictable URL token.' },
    ],
    tips: [
      'Keep slugs under 60 characters for the cleanest URLs; use the Max length slider to enforce the habit.',
      'Toggle Strip stopwords for blog posts so the slug is keyword-dense rather than word-for-word with the title.',
      'Pair the underscore separator with snake_case conventions in code repos where filenames and identifiers must match.',
      'The preview is live — paste a full title and read the slug before you copy it anywhere.',
    ],
  },
  // ── text-sorter ──

  'text-sorter': {
    intro:
      'Unordered lists make data harder to scan, compare, and maintain. The Text Sorter tool takes any list you paste — one item per line — and reorders it instantly according to the mode you choose. Four sort modes are available in the Sort by dropdown: Alphabetical for plain A–Z ordering, Numerical for lines that contain numbers and should sort by their numeric value rather than digit order (so item2 lands before item10), By length for ordering lines from shortest to longest, and Natural for a human-friendly hybrid that treats digits as numbers. A Direction control flips the order between Ascending and Descending, while three switches add precision: Case-insensitive matching (on by default), Remove duplicates, and Reverse result. Click Sort lines and the reordered output appears in the Sorted output box with a badge summary showing how many lines went in, how many came out, and how many duplicates were dropped. Whether you are organizing a keyword list, tidying CSV rows, or alphabetizing references, this free line sorter gives you reproducible ordering in one click instead of manual cut-and-paste.',
    examples: [
      { input: 'banana\napple\ncherry', output: 'apple\nbanana\ncherry', note: 'Default alphabetical sort, ascending, case-insensitive.' },
      { input: 'item10\nitem2\nitem1', output: 'item1\nitem2\nitem10', note: 'Numerical mode extracts the first number in each line, so 2 sorts before 10.' },
      { input: 'apple\npear\napple\nkiwi', output: 'apple\npear\nkiwi', note: 'By length, Descending, with Remove duplicates on — the second "apple" is dropped.' },
    ],
    howTo: [
      'Paste your list into the Lines to sort text area, one item per line.',
      'Choose a mode from the Sort by dropdown: Alphabetical, Numerical, By length, or Natural.',
      'Pick Ascending or Descending in the Direction radio group.',
      'Adjust the Case-insensitive, Remove duplicates, and Reverse result switches as needed.',
      'Click Sort lines and review the Sorted output, including the in/out badge summary.',
    ],
    useCases: [
      'Ordering keyword research lists alphabetically for review.',
      'Sorting filenames or version numbers with Natural mode.',
      'Arranging CSV rows by the numeric value in a leading column.',
      'Deduplicating and ordering a merged email list in one pass.',
      'Preparing glossary or index entries for publication.',
      'Reversing a chronological list to show newest items first.',
    ],
    bestPractices: [
      'Pick Natural sort whenever digits appear in lines; reserve Alphabetical for pure word lists.',
      'Clean whitespace and blank lines before sorting so hidden spacing does not distort order.',
      'Enable Remove duplicates for merged lists, but only when losing repeats is acceptable.',
      'Sort ascending first and flip with Direction or Reverse result to audit the opposite order without changing inputs.',
      'Keep the in/out badge summary on screen to confirm the number of lines matches expectations.',
    ],
    faqs: [
      { q: 'What is the difference between Alphabetical and Natural sort?', a: 'Alphabetical compares strings character by character, so file10, file11, file2, file3 appears in that order. Natural sort uses a numeric-aware collator that treats digit runs as numbers, producing file2, file3, file10, file11 — the order humans expect. Pick Natural for filenames, version numbers, and any list mixing words with numbers, and Alphabetical for plain word lists.' },
      { q: 'How does Numerical sorting handle lines without numbers?', a: 'It extracts the first number found in each line — including decimals and negative signs — and sorts by that value, treating lines with no numbers as zero. This means a list like item10, item2, item1 sorts correctly by numeric value, but lines that contain no digits will be grouped together at the zero position rather than sorted by their text.' },
      { q: 'What exactly does the Reverse result switch do?', a: 'It flips the final sorted order after the Direction setting is applied, so reversing an ascending result gives you descending output. This is most useful for getting descending order when your sort mode does not preserve the order you expect, or for presenting a list newest-first without changing any of your other sort settings.' },
      { q: 'Does Remove duplicates respect case-insensitive matching?', a: 'Yes. When Remove duplicates is on, the comparison uses the same case sensitivity as your Case-insensitive switch — with it enabled, Apple and apple are treated as the same line and only the first occurrence survives. The output badges then show exactly how many duplicate lines were removed from the input.' },
      { q: 'Is the sorting algorithm stable and predictable?', a: 'The tool uses the built-in JavaScript array sort with your selected comparator, which is stable in modern browsers. This means lines that compare as equal keep their original relative order. For By length, ties are additionally broken alphabetically with localeCompare, so equal-length lines always end up in predictable alphabetical order.' },
      { q: 'Can I sort text that is not line-delimited?', a: 'Sorting works on lines, so make sure every item is on its own line first. You can paste comma-separated or space-separated values and temporarily replace the separator with newlines, or use a different tool to convert delimiters to line breaks. Each newline in the input marks a boundary, and the tool reports your current line count beside the text area.' },
    ],
    tips: [
      'Switch to Natural sort for version lists; Alphabetical will put file10 before file2.',
      'Numerical sort treats lines without numbers as zero, so keep numeric lists purely numeric for predictable output.',
      'Enable Remove duplicates before sorting a merged keyword list to sort and dedupe in one click.',
      'Use Reverse result on a descending date-prefixed list to keep a newest-first feed when you only need order flipping.',
    ],
  },
  // ── remove-blank-lines ──

  'remove-blank-lines': {
    intro:
      'Blank lines sneak into text from every direction: copied emails, exported reports, OCR output, code pasted from chat, and documents assembled from multiple sources. They inflate line counts, break import scripts, and make content look sloppy. The Remove Blank Lines tool strips them out with surgical control. Paste your messy text into the input area and the cleaning happens live — no submit button required, though a Process now button is there if you prefer explicit control. Four switches define exactly what gets removed: Remove empty lines deletes lines with zero characters, Remove whitespace-only also catches lines made up purely of spaces and tabs, Trim each line strips stray leading and trailing whitespace from what remains, and Collapse blank runs condenses consecutive blank lines down to a single one while trimming blanks from the start and end. A Before / After / Removed stat row shows precisely how many lines disappeared, and the cleaned result in the Cleaned text box can be downloaded directly. It is the fastest way to prepare text for a spreadsheet, a CSV import, or publication.',
    examples: [
      { input: 'first\n\n\nsecond', output: 'first\nsecond', note: 'Defaults remove the two blank lines; the stats show 4 lines in and 2 out.' },
      { input: 'alpha\n   \nbeta', output: 'alpha\nbeta', note: 'A line containing only spaces is caught by Remove whitespace-only.' },
      { input: 'one\n\n\n\ntwo', output: 'one\n\ntwo', note: 'With removal switches off and Collapse blank runs on, the three blanks become one paragraph break.' },
    ],
    howTo: [
      'Paste your text into the Text area; output updates live as you type.',
      'Toggle Remove empty lines to drop lines with zero characters.',
      'Enable Remove whitespace-only to also delete lines made purely of spaces and tabs.',
      'Switch on Trim each line and Collapse blank runs if you want whitespace stripped and blank runs condensed to one.',
      'Read the Before / After / Removed stats and download the Cleaned text, or click Process now to re-run explicitly.',
    ],
    useCases: [
      'Cleaning text pasted from email clients before storing it.',
      'Preparing CSV or log exports for import into spreadsheets.',
      'Condensing double-spaced manuscripts to single paragraph breaks.',
      'Stripping stray whitespace from code snippets pasted out of chat.',
      'Flattening OCR output with inconsistent blank lines.',
      'Tidying documentation blocks before committing them to a repo.',
    ],
    bestPractices: [
      'Know which blanks you are deleting: removal switches drop empty lines entirely, while Collapse preserves one.',
      'Combine Trim each line with the removal filters when source text mixes indentation and blank lines.',
      'Use Collapse blank runs instead of full removal when paragraph rhythm matters.',
      'Run the cleanup before importing into spreadsheets so row counts match real data rows.',
      'Review the Before / After / Removed stats to catch accidental deletion of intentional whitespace.',
    ],
    faqs: [
      { q: 'What is the difference between the two removal switches?', a: 'Remove empty lines deletes lines containing zero characters, while Remove whitespace-only is broader and also deletes lines that contain nothing but spaces or tabs. Because whitespace-only lines are a superset of empty ones, enabling the second switch makes the first redundant — the tool prioritizes the whitespace-only filter whenever both are on.' },
      { q: 'What does Collapse blank runs do?', a: 'It condenses consecutive blank lines into a single blank line, preserving paragraph spacing instead of eliminating it, and it also strips blank lines from the very start and end of the text. Use it when you want readable paragraph breaks rather than a completely flat block — you would combine it with the removal switches turned off.' },
      { q: 'Does the tool process text automatically?', a: 'Yes. The output refreshes live whenever the input text or any option changes, so you do not have to click anything for the cleaning to happen. A Process now button is still available if you prefer explicit control, and a Clear button empties both the input and the cleaned result at once.' },
      { q: 'What does Trim each line do?', a: 'It strips leading and trailing whitespace from every surviving line, removing stray indentation, trailing spaces, and tabs. The trimming happens before blank-line filtering, so a line made entirely of whitespace becomes empty and can then be caught by the removal switches — combine Trim each line with Remove whitespace-only for the most thorough cleanup.' },
      { q: 'Can I download the cleaned text result?', a: 'Yes. The output box labeled Cleaned text includes a download action that saves the result as a text file called cleaned.txt, so you can feed the cleaned content straight into a spreadsheet, a script, or a document without copying it through the clipboard first.' },
      { q: 'Can I see how many lines were removed?', a: 'Yes. A stat row labeled Before, After, and Removed sits under the option switches and updates live, showing your input line count, the cleaned output line count, and the difference between them. A badge summary beneath the result shows the same numbers in an "in → out" format with the total blank lines removed.' },
    ],
    tips: [
      'Pair Trim each line with Remove whitespace-only for a full cleanup that leaves no stray tabs behind.',
      'Turn off both removal switches and enable Collapse blank runs when you want to keep single paragraph breaks.',
      'The output updates live, so you can toggle options and watch the Removed counter respond instantly.',
      'Paste from an email client first — it is the single biggest source of double-spaced line artifacts.',
    ],
  },
  // ── duplicate-line-remover ──

  'duplicate-line-remover': {
    intro:
      'Duplicate lines are the classic symptom of merged lists: combined email reports, concatenated logs, union queries that went wrong, or copy-paste accidents. They waste space, skew counts, and make deduplication in a spreadsheet feel harder than it should. The Duplicate Line Remover tool cleans a list in one pass, preserving the original order of the lines it keeps. Paste your list into the Lines area — one entry per line — then fine-tune the comparison with two switches: Case-insensitive makes Apple and APPLE match, and Trim before compare ignores stray leading or trailing whitespace. The Keep radio group decides which occurrence survives: First occurrence keeps the earliest line and drops later repeats, while Last occurrence overwrites with the final version of each line, which is handy when newer entries supersede older ones. Click Remove duplicates and the output appears in the Unique lines box along with Input / Output / Removed statistics and a badge summary. Whether you are cleaning a mailing list, a playlist, or a manifest, this dedupe tool gives you repeatable, auditable results instantly.',
    examples: [
      { input: 'apple\nbanana\napple\ncherry', output: 'apple\nbanana\ncherry', note: 'Default settings: keep the first occurrence, case-sensitive. 4 lines in, 3 unique.' },
      { input: 'Apple\napple\nBanana', output: 'Apple\nBanana', note: 'With Case-insensitive on, Apple and apple match and only the first variant survives.' },
      { input: 'Apple\napple', output: 'apple', note: 'Case-insensitive with Keep set to Last occurrence — the newest variant overwrites the older one.' },
    ],
    howTo: [
      'Paste your list into the Lines area, one entry per line.',
      'Toggle Case-insensitive to make Apple and APPLE match.',
      'Toggle Trim before compare to ignore leading and trailing whitespace.',
      'Choose First occurrence or Last occurrence in the Keep radio group.',
      'Click Remove duplicates and review the Unique lines output plus the Input / Output / Removed stats.',
    ],
    useCases: [
      'Deduplicating merged mailing lists before a campaign send.',
      'Cleaning concatenated server logs for analysis.',
      'Removing repeated rows from exported spreadsheet data.',
      'Consolidating tag or category lists exported from a CMS.',
      'Preparing unique inventory SKUs from multiple source files.',
      'Cleaning up union queries in SQL results pasted for review.',
    ],
    bestPractices: [
      'Use default exact matching for structured data where casing is deliberate, like SKUs or file paths.',
      'Enable Case-insensitive plus Trim before compare for human-entered lists with inconsistent formatting.',
      'Choose Keep based on semantics: first for stable identifiers, last for values that evolve over time.',
      'Note that order is preserved by design — run a separate sort if a reordered list is required.',
      'Cross-check the Removed stat against your expected duplicate count as a sanity check.',
    ],
    faqs: [
      { q: 'How is a duplicate line defined?', a: 'Two lines are duplicates when their comparison keys match, where the key is the line after optional trimming and case folding depending on your switches. With default settings the comparison is exact and case-sensitive, so Apple and apple are different; enabling Case-insensitive makes them equal, and Trim before compare ignores surrounding whitespace.' },
      { q: 'What is the difference between keeping first and last occurrences?', a: 'First occurrence keeps the earliest version of each line in your list and skips every later repeat, preserving the original order. Last occurrence overwrites the earlier entry with the most recent version of that line, which is useful when later rows in a list — such as updated statuses or newer metadata — should win over earlier ones.' },
      { q: 'Does the remover preserve the original line order?', a: 'Yes. Lines are processed top to bottom and only exact repeats are dropped, so the surviving lines stay in their original relative order. This is deliberate: alphabetical sorting would reorder your data, but a dedupe tool should only remove redundant entries and leave everything else untouched.' },
      { q: 'What if my lines have different amounts of whitespace?', a: 'Enable Trim before compare to ignore leading and trailing whitespace, so "apple" and " apple " are treated as the same line. The output keeps the text of whichever occurrence survives according to your Keep setting, so with Keep set to First occurrence the untrimmed earlier version is the one that appears in the result.' },
      { q: 'How do I know how many duplicates were removed?', a: 'The tool shows three statistics — Input, Output, and Removed — plus a badge summary in the "in → unique" format that reports the total duplicates removed. The Removed stat is highlighted when it is greater than zero, making it easy to confirm the cleanup worked at a glance.' },
      { q: 'Is there a limit to the list size?', a: 'There is no hard limit beyond your browser memory, and the deduplication runs in a single pass using a hash map, so even lists with thousands of lines are processed in milliseconds. The result is computed locally and never uploaded, which also makes the tool safe for private data like email lists or internal logs.' },
    ],
    tips: [
      'Sort is not part of dedupe: the output keeps original order, so run a sorter afterwards if you want an ordered list.',
      'Use Keep set to Last occurrence when rows carry version-like values and the newest entry should win.',
      'Toggle Case-insensitive for user-entered data like email lists, where capitalization is inconsistent.',
      'The Removed stat is highlighted when greater than zero, giving you instant confirmation the dedupe ran.',
    ],
  },
  // ── reading-time-calculator ──

  'reading-time-calculator': {
    intro:
      'Readers skim before they commit. A headline promising a three-minute article feels approachable; one that might take twenty gets skipped. The Reading Time Calculator estimates how long any text takes to read or speak, so you can set honest expectations before you hit publish. Paste your draft, speech, or script into the text area — the tool ships with a pre-loaded sample so you can see the output immediately — and it computes live word, character, sentence, and paragraph counts alongside the estimated reading and speaking times. It measures against four paces: slow reading at 150 words per minute, average reading at 250, fast reading at 400, and a typical speaking pace of 130. Two headline cards show the average-reader time and the speaking time, and a Speed breakdown table lists every pace with its time in minutes and seconds. Extra stats — average words per sentence and average characters per word — help you gauge readability and complexity. Bloggers use it to label posts, speakers to time scripts, and course creators to set lesson durations.',
    examples: [
      { input: 'The quick brown fox jumps over the lazy dog and runs away.', output: 'Words: 12 · Characters: 58 · Sentences: 1 · Paragraphs: 1\n\nEstimated reading time: 3s (average adult reader, 250 WPM)\nEstimated speaking time: 6s (typical presentation pace, 130 WPM)\n\nSpeed breakdown:\nSlow reader (150 WPM): 5s\nAverage reader (250 WPM): 3s\nFast reader (400 WPM): 2s\nSpeaking pace (130 WPM): 6s\n\nAvg words / sentence: 12.0 · Avg chars / word: 3.9', note: 'A single pangram-style sentence shows all four paces side by side.' },
      { input: 'Read this sentence. Then read this other sentence.', output: 'Words: 8 · Sentences: 2\n\nEstimated reading time: 2s (250 WPM)\nEstimated speaking time: 4s (130 WPM)\n\nSpeed breakdown:\nSlow reader: 3s\nAverage reader: 2s\nFast reader: 1s\nSpeaking pace: 4s\n\nAvg words / sentence: 4.0 · Avg chars / word: 5.3', note: 'Two short sentences produce a 4.0 average words per sentence.' },
      { input: 'Thank you all for coming. Today I will share three ideas with you. The first idea is about focus. The second idea is about consistency. The third idea is about kindness.', output: 'Words: 31 · Sentences: 5\n\nEstimated reading time: 7s (250 WPM)\nEstimated speaking time: 14s (130 WPM)\n\nSpeed breakdown:\nSlow reader: 12s\nAverage reader: 7s\nFast reader: 5s\nSpeaking pace: 14s', note: 'A short introduction script — the Speaking pace row is the one to budget for a live talk.' },
    ],
    howTo: [
      'Start with the pre-loaded sample text or paste your own into the Your text area.',
      'Read the live stat row for Words, Characters, No spaces, Sentences, and Paragraphs.',
      'Check the Estimated reading time card (250 words per minute) and the Estimated speaking time card (130 words per minute).',
      'Review the Speed breakdown table for slow, average, fast, and speaking paces in minutes and seconds.',
      'Click Load sample to restore the demo text or Clear to start from empty.',
    ],
    useCases: [
      'Adding reading-time labels to blog post headers.',
      'Timing presentation scripts before a speaking slot.',
      'Estimating video voiceover duration for YouTube scripts.',
      'Setting expected lesson lengths for online course materials.',
      'Checking readability via average sentence and word length stats.',
      'Budgeting proofreading time across a batch of articles.',
    ],
    bestPractices: [
      'Round up durations when publishing labels — underestimating reading time erodes reader trust.',
      'Use the speaking pace row for scripts and add buffer for pauses, questions, and transitions.',
      'Treat Avg words / sentence as a readability signal and revise when it climbs past 25.',
      'Test the same draft at slow and fast paces to publish a fair time range instead of one number.',
      'Re-measure after every substantive edit, since even small cuts shift the estimate.',
    ],
    faqs: [
      { q: 'What word-per-minute rates does the calculator use?', a: 'It measures four paces: slow reading at 150 WPM, average reading at 250 WPM, fast reading at 400 WPM, and speaking at 130 WPM. The headline reading-time card uses the 250 WPM average adult figure and the speaking card uses 130 WPM, a typical presentation pace. The Speed breakdown table shows all four with times in both minutes and seconds.' },
      { q: 'How are the reading times formatted?', a: 'Durations are rounded to whole seconds and displayed in a compact format — 3s for short texts, 2m 15s for medium ones, and 1h 5m for very long documents. The Speed breakdown table also shows a raw Seconds column, and the headline cards display a single large duration so you can grab the number instantly for a blog label or video description.' },
      { q: 'Can I measure speaking time for a presentation script?', a: 'Yes. Paste your script into the Your text area and read the Estimated speaking time card, which uses 130 words per minute — the standard pace for clear delivery. If you speak faster or slower, use the Speed breakdown table to interpolate, or treat the slow and fast reader rows as bounds for a rehearsal.' },
      { q: 'What do the average words and characters stats mean?', a: 'Avg words / sentence divides your total words by detected sentences, and Avg chars / word divides characters without spaces by words. Both are quick readability signals: average sentences under roughly 20 words read more clearly, and a higher characters-per-word average hints at longer, more complex vocabulary that may slow readers down.' },
      { q: 'Is the sample text real content or placeholder?', a: 'The tool loads with a short sample passage explaining reading speeds, so you can see every stat and both time cards populated before you type anything. Click Load sample to restore it at any time, or Clear to start with an empty text area and paste your own draft.' },
      { q: 'Can I use the calculator offline?', a: 'Yes. All counting and time estimation runs in your browser, in real time, with no network requests. The text you paste never leaves your machine, so you can time private drafts, scripts, or manuscripts without concern, and results update on every keystroke so you can trim a draft until it fits a target duration.' },
    ],
    tips: [
      'Write your estimate the way readers see it: round up to the next ten seconds for conservative reading-time labels.',
      'For YouTube scripts, aim at the Speaking pace row (130 WPM) and add roughly 10% for pauses and breaths.',
      'Use Avg words / sentence to catch run-ons before publishing; values over 25 deserve a rewrite pass.',
      'Keep the sample loaded to sanity-check your mental math whenever you switch from your own draft.',
    ],
  },
  // ── text-compare ──

  'text-compare': {
    intro:
      'Finding exactly what changed between two versions of a text is notoriously hard: by the second or third paragraph, your eyes start skipping the identical parts and missing the real edits. The Text Compare tool solves this with a precise, word-by-word diff. Paste the original into Text A and the revised version into Text B, and the tool computes a color-coded inline comparison where removed words appear struck through in red and added words stand out in green, with unchanged text left neutral. It is not a line-by-line diff but a true word-level diff, so a single swapped adjective inside a sentence is caught immediately, and newline changes are preserved as visible breaks. Two toggles refine the comparison — Ignore case and Ignore whitespace — and a stat row reports words in each text plus common, added, and removed token counts. When both sides match, a green banner confirms the texts are identical, noting any case or whitespace allowances. Editors, developers reviewing copy changes, and legal teams tracking contract revisions all get certainty instead of squinting.',
    examples: [
      { input: 'Text A:\nThe quick brown fox\njumps over the lazy dog.\nA classic pangram.\n\nText B:\nThe quick red fox\njumps over the sleepy dog.\nA famous pangram indeed.', output: 'Word-level diff:\nbrown (red, struck through) → red (green)\nlazy (red) → sleepy (green)\nclassic (red) → famous (green)\n+ indeed (green)\n\nStats:\nWords in A: 12 · Words in B: 13\nAdded: 4 · Removed: 3 · Common: 11', note: 'The default sample pair: swapped adjectives and one added word are caught immediately.' },
      { input: 'Text A: Hello world\nText B: hello WORLD', output: 'Status: Texts are identical (case-insensitive match)\n\nWords in A: 2 · Words in B: 2\nCommon: 2 · Added: 0 · Removed: 0', note: 'With Ignore case on, the casing differences disappear from the diff.' },
      { input: 'Text A: first line\nsecond line\nText B: first line second line', output: 'Status: Texts are identical (whitespace ignored)\n\nWords in A: 4 · Words in B: 4\nCommon: 4 · Added: 0 · Removed: 0', note: 'With Ignore whitespace on, the collapsed newline change no longer counts as a difference.' },
    ],
    howTo: [
      'Paste the original version into Text A and the revised version into Text B.',
      'Review the Word-level diff: green highlights are added words, red struck-through words were removed, and common words stay neutral.',
      'Toggle Ignore case or Ignore whitespace to filter out those difference types.',
      'Check the stat row — Words in A, Words in B, Common, Added, Removed — for a numeric summary.',
      'Click Clear to reset both panes; a green banner confirms when the texts are identical.',
    ],
    useCases: [
      'Reviewing edited article drafts against the original version.',
      'Verifying contract or policy revisions word by word.',
      'Checking code review copy changes between commits.',
      'Confirming API documentation updates match the release notes.',
      'Spotting accidental edits in pasted translations.',
      'Validating that a CMS import preserved copy exactly.',
    ],
    bestPractices: [
      'Compare clean copies: normalize encodings first so the diff is not polluted by invisible character changes.',
      'Leave Ignore case off for code and identifiers where casing is meaningful.',
      'Use Ignore whitespace when reviewing copy that passed through different editors or line wrapping.',
      'Read the diff in both directions — green words in B are additions, red words in A are deletions.',
      'Tighten the comparison to short sections when a large document produces a noisy diff.',
    ],
    faqs: [
      { q: 'How is the word-level diff actually computed?', a: 'The tool tokenizes both texts into words, preserving newline characters as explicit tokens, then computes the longest common subsequence between the two token lists. Tokens in the shared sequence are marked common, tokens in Text A but not the shared path are removed, and tokens only in Text B are added. The result is a minimal, human-friendly edit script.' },
      { q: 'What do the colors in the diff mean?', a: 'Added words appear highlighted in green, removed words appear in red with a strikethrough, and unchanged words stay neutral gray. A legend above the Word-level diff lists all three markers, so you can interpret the result at a glance even on a first visit, and the same coloring logic applies whether you are comparing paragraphs or code snippets.' },
      { q: 'What does the Ignore whitespace switch do?', a: 'It collapses all whitespace — spaces, tabs, and newlines — into single spaces before comparing, so two versions that differ only in line breaks or extra spacing are treated as identical. The banner then confirms the texts are identical with whitespace ignored. Leave it off when line-break changes matter, since newlines are otherwise shown as diff tokens.' },
      { q: 'Can I compare code or log snippets?', a: 'Yes. The comparison is word-based rather than line-based, so it highlights changed tokens inside lines rather than replacing whole lines, which suits code, URLs, and logs well. Note that punctuation attached to words travels with its token, so trailing commas or semicolons count as part of a word when the tool decides what changed.' },
      { q: 'Why does the stat row show more tokens than words?', a: 'Words in A and Words in B exclude newline tokens, but the Common, Added, and Removed stats count every token in the diff, including newlines. When the texts contain line breaks, Common plus Added plus Removed can therefore exceed the word counts. The word counts are the human-facing figures; the token stats reflect the full internal diff.' },
      { q: 'What happens when the texts are identical?', a: 'A green status banner appears reading "Texts are identical", appending "case-insensitive match" or "whitespace ignored" when those toggles are active. Added and Removed both read zero, and every token is marked common. The banner only appears when both text areas are non-empty, so two empty boxes are not reported as a match.' },
    ],
    tips: [
      'Turn on Ignore whitespace when comparing copy that passed through different editors or line-wrapping.',
      'Keep Ignore case off for code comparisons — a casing change often signals a real rename.',
      'The diff is word-level, so paste whole paragraphs instead of single lines to catch mid-sentence edits.',
      'Check the Common stat first: a high common count means only small targeted edits, a low one means a rewrite.',
    ],
  },
  // ── remove-duplicate-words ──

  'remove-duplicate-words': {
    intro:
      'Repeated words are everywhere in messy data: merged keyword exports, concatenated tag lists, auto-generated descriptions, and text assembled from multiple sources. They inflate word counts, pollute analytics, and look unprofessional the moment a human reads them. The Remove Duplicate Words tool strips repeats while preserving the order of first appearance — a crucial difference from alphabetizing, which would scramble your content. Paste your text and the cleanup runs live. A Case-sensitive switch controls whether Apple and apple are treated as distinct (off by default, so they count as the same word). The Scope setting chooses between Within each line — duplicates are removed independently per line, keeping your line structure intact — and Across all text, which de-duplicates the entire input as one pool. An Output delimiter dropdown lets you rejoin the cleaned words with spaces, commas, or newlines, which makes the tool double as a list-to-comma-separated converter. Live Original / Unique / Removed counters show exactly how many words disappeared, and the result is downloadable as a text file.',
    examples: [
      { input: 'apple banana apple cherry\nBanana Cherry Date', output: 'apple banana cherry\nBanana Cherry Date', note: 'Defaults: Within each line, space delimiter, case-insensitive. 7 words in, 6 unique.' },
      { input: 'apple banana apple cherry banana', output: 'apple, banana, cherry', note: 'Across all text with the Comma delimiter re-joins the three unique words.' },
      { input: 'Apple apple APPLE', output: 'Apple apple APPLE', note: 'With Case-sensitive on, each casing is a distinct word and all three survive.' },
    ],
    howTo: [
      'Paste your text into the Text area; duplicates are removed live as you type.',
      'Toggle Case-sensitive to decide whether Apple and apple count as the same word.',
      'Set Scope to Within each line or Across all text.',
      'Choose Space, Comma, or Newline from the Output delimiter dropdown.',
      'Check the Original / Unique / Removed counters and download the Unique words result.',
    ],
    useCases: [
      'Deduplicating keyword lists from merged exports.',
      'Cleaning auto-generated product descriptions with repeated words.',
      'Building unique tag sets from multiple pasted lists.',
      'Converting space-separated lists into comma-separated values.',
      'Flattening word clouds into unique word lists for analysis.',
      'Preparing vocabulary lists where order and uniqueness matter.',
    ],
    bestPractices: [
      'Keep the default case-insensitive mode for keyword lists, where casing differences are usually accidental.',
      'Choose Within each line when line structure carries meaning, like CSV rows or config entries.',
      'Switch to Across all text when you want a single global set of unique words.',
      'Pick the delimiter that matches your downstream consumer: comma for SQL IN lists, newline for one-word-per-row.',
      'Strip punctuation before pasting if it causes near-duplicate tokens to survive.',
    ],
    faqs: [
      { q: 'Does the tool preserve the original word order?', a: 'Yes. For every word position, the tool keeps the first occurrence and skips later repeats, so surviving words remain in the exact order they first appeared. This makes it ideal for keyword lists and text where order carries meaning — unlike alphabetical sorting, deduplication should never rearrange your content.' },
      { q: 'What is the difference between the two scope options?', a: 'Within each line removes duplicates independently inside every line and preserves your line structure, so a word appearing in two different lines survives in both. Across all text treats the entire input as one pool and removes repeats everywhere, joining the result with your chosen delimiter and flattening the text into a single block.' },
      { q: 'How does the Output delimiter option work?', a: 'It controls how surviving words are joined in the result: Space re-joins them with single spaces, Comma with comma-space pairs like apple, banana, and Newline puts every word on its own line. With Newline the tool doubles as a quick way to convert a paragraph into a word list, one word per row.' },
      { q: 'What does the Case-sensitive switch change?', a: 'With the switch off, comparison is case-insensitive, so Apple, apple, and APPLE are the same word and only the first variant survives. With it on, each casing is treated as a distinct word and all three survive. The switch is off by default, which matches the typical expectation when cleaning keyword lists.' },
      { q: 'Are punctuation and numbers treated as words?', a: 'Words are split on whitespace, so punctuation attached to a word stays attached — "apple," and "apple" are different tokens and both survive. Numbers count as words, and are deduplicated like any other token. If trailing punctuation causes unexpected duplicates, strip it before pasting or rely on the comma delimiter to cleanly separate values.' },
      { q: 'Can I download the cleaned output?', a: 'Yes. The Unique words result box provides a built-in download action that saves the deduplicated text as a file named unique-words.txt, so you can hand the cleaned list straight to a spreadsheet, a script, or a colleague without any clipboard copying in between.' },
    ],
    tips: [
      'Use the Comma delimiter to convert a whitespace list into a comma-separated string in the same click.',
      'Choose Across all text when building a unique keyword set from multi-line exports.',
      'Leave Case-sensitive off unless casing itself carries meaning, such as acronyms versus common words.',
      'The Original / Unique / Removed counters update live, so keep the tool open while pasting several lists in a row.',
    ],
  },
}