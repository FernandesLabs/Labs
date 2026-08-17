// finance-tools.ts — hand-written content overrides for the finance category.
// Generated from a split of the original monolithic
// src/app/tools/[slug]/tool-content-overrides.ts into per-category
// modules (file-structure refactor). Content is byte-identical to the
// original; do not hand-edit formatting here unless you also update
// the merge in ./index.ts.
import type { ToolOverrideMap } from './types'

export const OVERRIDES: ToolOverrideMap = {
  'citation-generator': {
    intro:
      'Citation Generator composes reference entries in three styles, APA, MLA, and Chicago, from a handful of fields you fill in. Start by choosing a Source type from the dropdown: Book, Website, Journal article, or Newspaper article, and the form reshapes itself, showing Publisher and City for books, URL and Site name for websites, URL and publication name for articles, and Volume, Issue, and Pages for journal papers. Author(s) accepts First Last or Last, First formats and separates multiple names with a semicolon or a newline. Pick APA, MLA, or Chicago from the style tabs and the citation is rebuilt instantly in the ResultBox, with a cleanup pass that trims duplicated punctuation and stray spacing. The output deliberately uses asterisks to mark italicized titles and quotes for article titles, so the same citation can be copied into editors that understand those conventions. Missing fields are skipped gracefully instead of producing broken text. A badge pair shows the active style and source type, and the entry downloads as citation-type-style.txt, such as citation-book-apa.txt.',
    examples: [
      {
        input: 'Book: Title The Great Gatsby, Authors Jane Doe; John Smith, Year 2024, Publisher Penguin Books.',
        output: 'Doe, J., & Smith, J. (2024). *The Great Gatsby*. Penguin Books.',
        note: 'APA flips names to Last, Initial, joins two authors with an ampersand, and marks the book title italic with asterisks.',
      },
      {
        input: 'Website: Title How batteries work, Author Ada Lovelace, Year 2023, Site name Science Explained, URL https://science.example.com/batteries, Access date October 5, 2024.',
        output: 'Lovelace, Ada. "How batteries work." *Science Explained*. 2023, https://science.example.com/batteries. Accessed October 5, 2024.',
        note: 'MLA keeps the full first name, quotes the web title, and appends the access statement because an Access date was provided.',
      },
      {
        input: 'Journal article: Title Quantum annealing for hard problems, Author Lin Wang, Year 2021, Journal name Nature, Volume 590, Issue 5, Pages 145–167.',
        output: '"Quantum annealing for hard problems." *Nature* 590, no. 5 (2021): 145–167.',
        note: 'Chicago composes volume, issue, and pages into the 590, no. 5 (2021): 145–167 pattern without flipping the author name.',
      },
    ],
    howTo: [
      'Pick Book, Website, Journal article, or Newspaper article from the Source type dropdown.',
      'Fill the form fields that appear, separating multiple authors with a semicolon or a newline.',
      'Use the style tabs to switch the citation between APA, MLA, and Chicago.',
      'Read the live citation in the result box and copy it when the format looks right.',
      'Download the entry as citation-type-style.txt, such as citation-book-apa.txt, for your bibliography file.',
    ],
    useCases: [
      'Assembling the references section of a research paper or thesis appendix.',
      'Starting a working bibliography in APA before switching to the final required style.',
      'Formatting website sources with access dates for an academic blog post.',
      'Building the bibliography for a textbook that mixes books, journals, and news articles.',
      'Compiling MLA citations for a literature class assignment in minutes.',
      'Exporting consistent citation files with predictable names for a shared document.',
    ],
    bestPractices: [
      'Fill every field relevant to the source so references contain full publication metadata.',
      'Separate authors with semicolons every time to avoid misreading a single multi-name entry.',
      'Keep the source type consistent with the fields, and never pair a book with a random URL.',
      'Enter access dates explicitly, since some styles require them and missing data silently skips that part.',
      'After copying, verify the asterisk and quote conventions render correctly in your target editor.',
      'Back up the values you entered, because the tool builds citations from the fields you provide.',
    ],
    faqs: [
      { q: 'How should I separate multiple authors?', a: 'Author names go in one field separated by a semicolon or a newline, and each name can be First Last or Last, First. The generator formats them per style, joining two with an ampersand or and, and treating three or more with et al. where the style demands it.' },
      { q: 'Why do titles use asterisks and quotes?', a: 'The output marks italicized titles with asterisk characters and quoted article titles with regular quotes, which is a portable convention for copy-paste sites and citation editors that expand those tokens. The hint next to Title describes which treatment applies to your chosen source type.' },
      { q: 'How are empty citation fields handled?', a: 'Every field is optional and skipped when empty, so a website without an access date simply omits the Retrieved or Accessed portion instead of printing blank brackets. The generator also cleans spacing, double periods, and stray punctuation so partial data still reads cleanly.' },
      { q: 'Which source types does it support?', a: 'Four source types are available: Book, Website, Journal article, and Newspaper article. The form adapts to each, showing publisher and city for books, URL and site name for websites, and volume, issue, and pages for journal articles, with newspaper using the publication name plus URL.' },
      { q: 'Is the citation style chosen by tabs?', a: 'Yes, the style tabs offer APA, MLA, and Chicago, and switching recalculates the citation instantly from the same fields. A badge pair shows the active combination, such as MLA for a website, so you can confirm which output you are about to copy.' },
      { q: 'What is the download file named?', a: 'Downloads follow the pattern citation-type-style.txt, combining the source type and lowercase style, so a book in APA becomes citation-book-apa.txt. The name is rebuilt automatically whenever you change the type or style, keeping exported files distinct for a session with several references.' },
    ],
    tips: [
      'Switch between APA, MLA, and Chicago after filling fields once to compare every style without retyping.',
      'Enter authors as Last, First when pasting from journal footnotes to keep APA formatting clean.',
      'Always fill the site name for website citations so the entry carries attribution beyond the bare URL.',
      'Sanity-check punctuation after editing fields, since missing data reshapes periods, commas, and placement.',
    ],
  },
  'bmr-calculator': {
    intro:
      'BMR Calculator estimates your Basal Metabolic Rate, the calories your body burns at complete rest, using the Mifflin-St Jeor equation, which is widely considered the most accurate formula for most people. Pick Male or Female with the gender tabs, then enter Age in years, Weight with instant kg or lb switching, and Height with cm or in switching. Every value converts into metric internally and the result updates live, so there are no calculate buttons to press. The green BMR stat shows calories rounded to the nearest whole number, and companion tiles show the converted Weight in kilograms and Height in centimeters so imperial users can confirm the conversion. Below that, the TDEE by activity level table multiplies BMR by standard activity factors ranging from 1.2 for a Sedentary lifestyle to 1.9 for Very Active work and training, presenting Total Daily Energy Expenditure for all five levels at once. Missing or invalid numbers simply render as dashes until corrected. A short disclaimer reminds readers that the figures are estimates and a healthcare professional should guide personalised nutrition decisions.',
    examples: [
      {
        input: 'Male, Age 30, Weight 70 kg, Height 175 cm.',
        output: 'BMR 1,649 cal. TDEE rows: Sedentary 1,979, Light 2,267, Moderate 2,556, Active 2,844, Very Active 3,133 cal/day.',
        note: 'Mifflin-St Jeor for men: 10 x 70 + 6.25 x 175 - 5 x 30 + 5 = 1,648.75, rounded up to 1,649 calories.',
      },
      {
        input: 'Female, Age 30, Weight 60 kg, Height 165 cm.',
        output: 'BMR 1,320 cal. TDEE rows: Sedentary 1,584, Light 1,815, Moderate 2,046, Active 2,277, Very Active 2,508 cal/day.',
        note: 'The female constant subtracts 161: 10 x 60 + 6.25 x 165 - 5 x 30 - 161 = 1,320.25, displayed as 1,320.',
      },
      {
        input: 'Male, Age 35, Weight 175 lb, Height 70 in.',
        output: 'Weight stat converts to 79.4 kg and Height to 177.8 cm; BMR computes to 1,735 cal.',
        note: 'Imperial input converts internally with lb x 0.45359237 and in x 2.54 before the equation runs.',
      },
    ],
    howTo: [
      'Choose Male or Female using the gender tabs in the Your details card.',
      'Enter your Age in years, Weight, and Height using the numeric inputs.',
      'Switch the kg/lb and cm/in buttons beside Weight and Height to work in your preferred units.',
      'Read the BMR stat, which updates live as any value changes.',
      'Review every row of the TDEE by activity level table to compare maintenance targets at once.',
    ],
    useCases: [
      'Estimating your resting calorie burn for a health tracking spreadsheet.',
      'Comparing TDEE across activity levels to pick a sustainable maintenance target.',
      'Checking how age and weight changes shift baseline metabolism over time.',
      'Planning a deficit or surplus by anchoring on the Moderate TDEE row.',
      'Converting imperial measurements and confirming the metric values in the output stats.',
      'Building a rough weekly calorie budget from the five activity-level rows.',
    ],
    bestPractices: [
      'Use metric inputs by default and switch to imperial only when clients provide lb or in measurements.',
      'Treat the BMR figure as a planning baseline and the TDEE rows as the working targets for maintenance.',
      'Recompute when age, weight, or height changes, since the equation is linear in all three inputs.',
      'Compare your result against a second calculator to confirm the conversions before trusting the number.',
      'Keep healthy skepticism and follow the disclaimer by consulting a professional for medical advice.',
      'Look for the converted Weight and Height tiles to catch unit mistakes early.',
    ],
    faqs: [
      { q: 'What formula does this calculator use?', a: 'It uses the Mifflin-St Jeor equation: for men 10 times weight in kilograms plus 6.25 times height in centimeters minus 5 times age plus 5, and for women the same first terms minus 161. The card description names it as the most accurate for most people.' },
      { q: 'Why does my BMR look low or high?', a: 'BMR is the calorie burn at complete rest before any movement, so even athletic people commonly stay between 1,200 and 2,000 calories. The table shows TDEE across activity levels, which is the estimate that matches real daily expenditure and usually explains the gap.' },
      { q: 'How accurate are the conversions between units?', a: 'Weight converts with a pounds-to-kilograms factor of 0.45359237 and height with 2.54 centimeters per inch, and both converted values appear in the Weight and Height stat tiles so you can audit them. Rounding happens only at display time, never in the computation.' },
      { q: 'What is the difference between BMR and TDEE?', a: 'BMR is the energy your body burns at rest just to stay alive, while TDEE multiplies BMR by an activity factor between 1.2 and 1.9 to estimate total daily burn. The table lists all five activity levels at once so you can compare maintenance targets side by side.' },
      { q: 'What happens when inputs are invalid?', a: 'The tool parses each number and demands a positive age, weight, and height, so empty or non-finite values render as dashes in the stats instead of nonsense figures. The green BMR stat only turns on when every input is valid, and corrections appear instantly because nothing waits for a button.' },
      { q: 'Can this tool replace professional advice?', a: 'No. The disclaimer under the TDEE table notes these figures are estimates and recommends consulting a healthcare professional for personalised guidance. Real metabolic variation between people means the number is a starting point for planning your intake, not a medical fact.' },
    ],
    tips: [
      'Switch to lb and in once to verify your metric inputs convert to the expected kg and cm values.',
      'Use the Moderate row for average days and the Very Active row for heavy training days when estimating needs.',
      'Compare TDEE rows rather than raw BMR when setting targets, since BMR alone ignores movement.',
      'Recompute as your age, weight, or height changes, because the formula is sensitive to all three.',
    ],
  },
  // ── percentage-calculator ──

  'percentage-calculator': {
    intro:
      'The Percentage Calculator turns the three most common percentage questions into instant answers, with no button to press and no formula to remember. Split into three tabs, it answers "What is X% of Y", "X is what % of Y", and "what is the % change from X to Y", so discount math, tip calculations, and year-over-year comparisons all live in one place. The moment you type into the Percentage (X) or Of value (Y) fields, the result updates live, and the Result, Percentage, and Base stats refresh beside your input. Shoppers use it to work out sale prices and percentage-off savings, business owners use it to measure month-over-month growth, and students use it to convert test scores into percentage grades. Because the % change tab shows increases in green and decreases in red, you can read the direction of a change at a glance, whether you are tracking a stock move or a budget drift. The calculator also guards against classic beginner mistakes, showing a clear error when the whole value or the original value is zero, since percentages of zero are undefined. For anyone who wants reliable percentage increase and decrease calculations without opening a spreadsheet, this tool is the fastest way to get from two numbers to one honest percentage.',
    examples: [
      { input: 'X% of Y tab: Percentage (X) = 15, Of value (Y) = 200', output: 'Result: 30', note: '15 ÷ 100 × 200 = 30, so 15% of 200 is 30.' },
      { input: 'X is what % of Y tab: Part (X) = 30, Whole (Y) = 200', output: 'Percentage: 15%', note: '30 ÷ 200 × 100 = 15, so 30 is 15% of 200.' },
      { input: '% change tab: From (X) = 200, To (Y) = 250', output: 'Change: +25% (shown in green)', note: '(250 − 200) ÷ 200 × 100 = 25, so a $50 rise on $200 is +25%.' },
    ],
    howTo: [
      'Pick a tab: "X% of Y" for a share of a number, "X is what % of Y" to compare two values, or "% change" for increases and decreases.',
      'On the X% of Y tab, type your rate in the Percentage (X) field and the base in the Of value (Y) field.',
      'Read the Result, Percentage, and Base stats — they update as you type, no button needed.',
      'For a change, enter the original number in From (X) and the new number in To (Y); the Change stat is green for increases and red for decreases.',
      'Use the X is what % of Y tab for ratio questions, and watch for the "Whole value cannot be zero" warning before trusting a result.',
    ],
    useCases: [
      'Working out the final price of a 25% off sale item without opening a calculator app.',
      'Figuring out how much to tip when a 15% gratuity lands on an uneven bill.',
      'Measuring year-over-year revenue growth for a small online store.',
      'Converting a 32/40 test score into a percentage grade.',
      'Checking what percentage of a monthly budget went to rent.',
      'Comparing a stock move from $200 to $250 as a single percentage change.',
    ],
    bestPractices: [
      'Always confirm which number is the base: 15% of 200 and 30 as a % of 200 answer different questions.',
      'Treat the displayed result as rounded for reading — it is shown to two decimals, not infinite precision.',
      'Remember that a % change from a negative original uses the absolute value of the start, which the tool handles, but always sanity-check the sign.',
      'Use the % change tab to avoid the percentage-points pitfall: a rate rising from 20% to 25% is a +25% change, not +5%.',
      'Verify the tool\'s answer against a quick mental estimate (10% moves are easy to spot) before quoting a figure.',
      'Do not treat it as a tax authority — always confirm final tax rates with your jurisdiction.',
    ],
    faqs: [
      { q: 'What does "X% of Y" mean in this calculator?', a: 'It means you want a fraction of a whole: X percent of the value Y. The tool multiplies Y by X divided by 100, so 15% of 200 becomes 200 × 0.15 = 30. This tab is the one to use for discounts, tips, and any "percent of an amount" question where you know the base number.' },
      { q: 'Why does the % change tab show a negative number?', a: 'A negative result means the second value is smaller than the first — the quantity decreased. The change is computed as (To − From) ÷ From × 100, so 250 falling to 200 gives (200 − 250) ÷ 250 × 100 = −20%. The stat is displayed in red for decreases and green for increases.' },
      { q: 'Can I calculate a discount percentage with this tool?', a: 'Yes, in two steps. Use the X% of Y tab to find how much money 25% off 200 saves you (50), then subtract. Or use the % change tab to find what percent a price drop represents — from 200 to 150 is a −25% change, which is the discount rate.' },
      { q: 'Why do I get "Whole value cannot be zero"?', a: 'The X is what % of Y mode divides by the whole, and dividing by zero is mathematically undefined — there is no meaningful answer to "30 is what percent of 0". The tool detects this and shows the error instead of silently returning a nonsense result like infinity.' },
      { q: 'Does the calculator round my results?', a: 'The display is rounded for readability, typically to two decimals in the result stat and up to four in the percentage stat. The underlying computation uses full floating-point precision and only the formatting is trimmed, so small display rounding is expected and harmless.' },
      { q: 'What is the difference between the three tabs?', a: 'They answer three distinct questions. X% of Y finds a portion of a known base. X is what % of Y compares two numbers as a ratio. % change measures how much a value moved between two points in time. Pick whichever one matches the question you actually have.' },
    ],
    tips: [
      'The % change tab is the fastest way to describe growth in a report — one number instead of two.',
      'In the is-what-% tab, put the smaller figure in Part and the total in Whole to get a share.',
      'Watch the colour coding: green means the change is positive, red means negative.',
      'All inputs accept decimals, so 2.5% or $199.99 work exactly as typed.',
    ],
  },
  // ── bmi-calculator ──

  'bmi-calculator': {
    intro:
      'The BMI Calculator estimates your Body Mass Index from just your height and weight, then places the result into one of the standard categories: Underweight, Normal, Overweight, or Obese. Two unit tabs keep it simple for everyone — Metric (cm / kg) for most of the world and Imperial (ft / lb) for users who measure in feet, inches, and pounds — and both apply the same core idea: weight divided by height squared, with a 703 conversion factor on the imperial side. Results appear instantly as you type, colour-coded and paired with a badge, alongside a healthy weight range computed for your exact height, spanning the 18.5 to 24.9 BMI band. If your number lands at 22.5 the badge reads Normal; at 31.1 it reads Obese, which makes it easy to see whether you sit inside the healthy range or outside it. The tool is deliberately honest about its limits, noting on the page that BMI is a screening measure and does not directly measure body fat, so muscular athletes can read higher than expected. For a quick health check, a starting point for a weight-loss plan, or a benchmark to discuss with a professional, this free BMI calculator with metric and imperial units gets you there in seconds.',
    examples: [
      { input: 'Metric tab: Height = 170 cm, Weight = 65 kg', output: 'BMI: 22.5 — Normal (healthy range 53.5–72.0 kg)', note: '65 ÷ (1.7 × 1.7) = 65 ÷ 2.89 = 22.49, rounded to 22.5.' },
      { input: 'Imperial tab: Height = 5 ft 7 in, Weight = 145 lb', output: 'BMI: 22.7 — Normal', note: '703 × 145 ÷ (67 × 67) = 101,935 ÷ 4,489 = 22.71, rounded to 22.7.' },
      { input: 'Metric tab: Height = 170 cm, Weight = 90 kg', output: 'BMI: 31.1 — Obese', note: '90 ÷ 2.89 = 31.14, above the 30 threshold, so the category is Obese.' },
    ],
    howTo: [
      'Choose the Metric (cm / kg) tab or the Imperial (ft / lb) tab depending on which units you measure in.',
      'On the metric tab, enter your height in the Height field (centimeters) and your weight in the Weight field (kilograms).',
      'On the imperial tab, fill in Height feet, Height inches, and Weight pounds as three separate fields.',
      'Read the large BMI figure and its coloured category badge — both update the moment you finish typing.',
      'Check the Healthy weight (low) and Healthy weight (high) stats to see the weight range that keeps you inside 18.5–24.9.',
    ],
    useCases: [
      'Running a routine weight check before starting a diet plan.',
      'Tracking BMI change month to month during a weight-loss program.',
      'Finding the weight range to aim for at a given height.',
      'Screening whether a client falls inside the normal band in a coaching context.',
      'Comparing metric and imperial results when a scale report uses the other system.',
      'Preparing talking points before a health check-up with a doctor.',
    ],
    bestPractices: [
      'Use consistent, recent measurements — morning, unfed weight against a fresh height gives the cleanest reading.',
      'Remember BMI ignores body composition: athletes with high muscle mass can land in Overweight despite low body fat.',
      'Treat the categories as screening bands, not a diagnosis, and follow up with a healthcare professional for medical advice.',
      'The imperial tab expects feet and inches separately, so 5\'7" goes in as 5 and 7, not 5.7.',
      'Do not apply adult BMI thresholds to children or pregnant women — the standard ranges do not fit those groups.',
      'Pair the result with the healthy-weight range stat to set a concrete, measurable goal.',
    ],
    faqs: [
      { q: 'Which formula does the BMI Calculator use?', a: 'Metric mode computes weight in kilograms divided by height in meters squared, for example 65 ÷ 1.7² = 22.5. Imperial mode converts height to total inches and applies 703 × pounds ÷ inches², for example 703 × 145 ÷ 67² = 22.7. Both produce the same standard body mass index value.' },
      { q: 'What is a healthy BMI range?', a: 'The tool follows the widely used bands: below 18.5 is Underweight, 18.5 to 24.9 is Normal, 25 to 29.9 is Overweight, and 30 or above is Obese. The results card shows the exact weight range for your height that corresponds to 18.5 to 24.9, so you get a personalised target.' },
      { q: 'Why does my athletic build read as overweight?', a: 'BMI only knows height and weight, not body composition. Muscle is denser than fat, so a lean, muscular person can weigh more than the formula expects and land in the Overweight band. The page notes this limitation — pair BMI with the body fat tool or a professional assessment for a fuller picture.' },
      { q: 'Can children use this BMI tool?', a: 'The categories shown — Underweight, Normal, Overweight, Obese — use adult cutoffs and are not appropriate for growing children, whose healthy ranges change with age and sex. Use pediatric growth charts instead. The tool is intended for adults and displays no age input.' },
      { q: 'Does the calculator show my ideal weight?', a: 'It shows a healthy range rather than a single ideal number: the weight window that keeps your BMI between 18.5 and 24.9 at your current height. For 170 cm that is about 53.5 kg to 72.0 kg. A single ideal weight would also depend on body composition and build, which BMI cannot see.' },
      { q: 'Why are there two unit tabs?', a: 'Metric and imperial users enter measurements differently, and the formula differs too. Metric takes centimeters and kilograms; imperial takes feet, inches, and pounds and applies the 703 conversion factor. Keeping them in separate tabs avoids ambiguous input like a weight that could be pounds or kilos.' },
    ],
    tips: [
      'The healthy-range stats double as a goal calculator — aim inside the band, not at a round number.',
      'Imperial height uses two fields, so enter 5\'10" as 5 feet and 10 inches.',
      'Results show one decimal place, which is enough for category decisions.',
      'Switch tabs and re-enter your measurements to compare metric and imperial readings of the same person.',
    ],
  },
  // ── vat-calculator ──

  'vat-calculator': {
    intro:
      'The VAT Calculator adds or removes value-added tax from a price as you type, with live results and a currency selector covering ten of the world\'s most traded currencies. Choose the Add VAT tab when you have a net amount and want the gross price a customer should pay; choose Remove VAT when a receipt already includes tax and you need to back out the net figure and the exact VAT portion. Either way the math happens behind the scenes — net × (1 + rate/100) when adding, and gross ÷ (1 + rate/100) when removing — and the Net, VAT, and Gross stats refresh on every keystroke. The VAT rate field accepts any percentage, so you can work with the UK\'s 20 percent standard rate, Germany\'s 19 percent, a reduced 5 percent band, or a decimal rate like 8.5. A currency dropdown formats results with the proper locale and symbol for USD, EUR, GBP, JPY, and six more, though the tool is careful to note that currency formatting is for display only — it does not convert exchange rates. Freelancers, e-commerce sellers, and accountants use it to reverse-calculate VAT from a price, quote gross totals, or check what a net price becomes after tax, all without touching a spreadsheet.',
    examples: [
      { input: 'Add VAT tab: Net amount = 100, VAT rate = 20, Currency = USD', output: 'Net $100.00 · VAT (20%) $20.00 · Gross $120.00', note: '100 × 0.20 = 20 VAT; 100 + 20 = 120 gross.' },
      { input: 'Remove VAT tab: Gross amount = 120, VAT rate = 20, Currency = USD', output: 'Net $100.00 · VAT (20%) $20.00 · Gross $120.00', note: '120 ÷ 1.20 = 100 net; 120 − 100 = 20 VAT.' },
      { input: 'Add VAT tab: Net amount = 250, VAT rate = 8.5, Currency = EUR', output: 'Net 250,00 € · VAT (8.5%) 21,25 € · Gross 271,25 €', note: '250 × 0.085 = 21.25 VAT; 250 × 1.085 = 271.25 gross, formatted in the German locale.' },
    ],
    howTo: [
      'Pick the Add VAT tab if your price is net of tax, or Remove VAT if your price already includes it.',
      'Type the amount into the Net amount or Gross amount field — the label changes with the selected tab.',
      'Enter your rate in the VAT rate field, as a percentage such as 20 or 8.5.',
      'Choose a Currency from the dropdown if you want results formatted in that currency\'s symbol and locale.',
      'Read the Net, VAT, and Gross stats; they update live, and the VAT stat always shows the rate used.',
    ],
    useCases: [
      'Quoting a client the gross total of a €250 net service at 8.5% VAT.',
      'Extracting the VAT portion from a receipt when your books only need the net amount.',
      'Preparing a price list in multiple display currencies without redoing the math per row.',
      'Checking whether a supplier\'s gross price matches the agreed net rate.',
      'Estimating the tax cost on a large equipment purchase at a given rate.',
      'Teaching junior staff how gross and net prices relate, with instant visual feedback.',
    ],
    bestPractices: [
      'Confirm whether the price you hold is net or gross before choosing a tab — the two modes answer opposite questions.',
      'Use the VAT rate that actually applies to the goods or service in your jurisdiction, including reduced bands.',
      'Remember the currency dropdown only changes formatting, not the value — the tool performs no exchange-rate conversion.',
      'Do not round the VAT line before adding it; let the tool compute from the full-precision rate.',
      'For multi-line invoices, compute each line separately and sum, since rates can differ between items.',
      'Spot-check one result against your accounting software before exporting anything client-facing.',
    ],
    faqs: [
      { q: 'What is the difference between Add VAT and Remove VAT?', a: 'Add VAT starts from a net price and shows the gross total, using net × (1 + rate/100). Remove VAT starts from a gross price and extracts the net, using gross ÷ (1 + rate/100). The tab labels change the input field accordingly, and the page explains each mode in its description line.' },
      { q: 'How do I reverse-calculate VAT from a gross price?', a: 'Switch to the Remove VAT tab and enter the tax-inclusive amount. The tool divides by (1 + rate/100), so a gross of 120 at 20% yields a net of 100 and a VAT of 20. You do not divide by the rate directly — that common shortcut overstates the VAT.' },
      { q: 'Does the VAT Calculator convert between currencies?', a: 'No. The currency dropdown only changes display formatting — symbol, decimal separator, and locale. A value entered as 100 remains 100 regardless of whether you pick USD, EUR, or JPY. The page states this explicitly: currency formatting is for display only, with no exchange rates applied.' },
      { q: 'Which VAT rate should I enter?', a: 'Use the rate that applies to your specific goods, service, and jurisdiction — standard, reduced, or zero. The field accepts any positive number, including decimals like 8.5 or 13.3, so you can model whatever your local rules require. Check official guidance if you are unsure which band applies.' },
      { q: 'Why does my VAT amount look different from the label rate?', a: 'The VAT stat always shows the rate you typed in parentheses, so a mismatch usually means a different rate was entered than intended. Also remember VAT is applied to the net base: 20% of a 100 net is 20, and on a gross of 120 the VAT is still 20, not 24.' },
      { q: 'Can I use decimal VAT rates like 8.5 percent?', a: 'Yes. The rate field parses decimals, so 8.5% is computed as 0.085 exactly as expected. This matters for jurisdictions with fractional rates. Negative rates are rejected with an inline error, and results update immediately when you change the value.' },
    ],
    tips: [
      'Use the Remove tab on any receipt to instantly see how much of the price was tax.',
      'The Gross stat is the number your customer actually pays — quote that one.',
      'Swap currencies freely to preview how the same totals look in a client\'s local format.',
      'Type a rate of 0 to quickly see a net-equals-gross result for exempt sales.',
    ],
  },
  // ── loan-calculator ──

  'loan-calculator': {
    intro:
      'The Loan Calculator estimates the monthly payment, total paid, and total interest on any fixed-rate installment loan, using the standard amortization formula M = P·r(1+r)ⁿ / ((1+r)ⁿ − 1), where r is the monthly rate and n the number of months. Enter a principal, an annual interest rate, and a term in years or months, and the three headline stats update immediately: Monthly payment, Total paid, and Total interest. Two extra panels break the first and last payments into principal and interest, so you can see how heavily interest dominates the start of a loan and how little remains at the end — the mechanics behind every amortization schedule. The term unit toggle makes it just as comfortable with a five-year auto loan as with an eighteen-month installment plan, and a zero-percent rate is handled gracefully by dividing the principal evenly across payments. Because the totals come from the same formula a lender uses, the tool is ideal for comparing offers, deciding between a 48-month and a 72-month term, or answering the simple question: how much interest will this actually cost me? Results are quoted in US dollars and the formula is printed on the page, so nothing about the calculation is hidden.',
    examples: [
      { input: 'Principal = 20000, Annual interest rate = 7.5, Term = 5 with Years selected', output: 'Monthly payment $400.76 · Total paid $24,045.54 · Total interest $4,045.54', note: 'r = 0.075 ÷ 12 = 0.00625, n = 60; M = 20000 × 0.00625 × 1.00625⁶⁰ ÷ (1.00625⁶⁰ − 1) = 400.76.' },
      { input: 'Principal = 12000, Annual interest rate = 0, Term = 12 with Months selected', output: 'Monthly payment $1,000.00 · Total interest $0.00', note: 'At r = 0 the formula divides the principal evenly: 12000 ÷ 12 = 1000 per month, with zero interest.' },
      { input: 'Principal = 30000, Annual interest rate = 6, Term = 36 with Months selected', output: 'Monthly payment $912.66 · Total paid $32,855.69 · Total interest $2,855.69', note: 'r = 0.005, n = 36; monthly payment 912.66 × 36 = 32,855.69, minus 30,000 principal leaves 2,855.69 interest.' },
    ],
    howTo: [
      'Type the amount you plan to borrow into the Principal field.',
      'Enter the lender\'s rate in the Annual interest rate field, as a percentage like 7.5.',
      'Set the Term field and choose Years or Months with the toggle below it.',
      'Read Monthly payment, Total paid, and Total interest — all three recalculate live.',
      'Compare the First payment and Last payment panels to see how the interest share shrinks across the loan.',
    ],
    useCases: [
      'Comparing a 48-month versus 72-month auto loan before visiting a dealership.',
      'Estimating the true cost of a personal loan before applying.',
      'Planning student loan repayment amounts after graduation.',
      'Seeing how much of a first payment is interest versus principal.',
      'Checking an interest-free installment plan actually costs nothing beyond the principal.',
      'Sanity-checking a lender\'s quoted monthly payment against the standard formula.',
    ],
    bestPractices: [
      'Enter the rate as an annual percentage, not a monthly one — the tool divides by 12 internally.',
      'Remember the quote excludes origination fees, insurance, and taxes; add those separately when budgeting.',
      'Compare Total interest across terms, not just the monthly payment, to judge a loan\'s real cost.',
      'Treat the first/last payment split as a model: real lenders may round differently or have odd first periods.',
      'For a zero-interest plan, set the rate to 0 and confirm the payment equals principal divided by months.',
      'Re-run the numbers after a rate quote changes — small rate differences move the totals more than they feel.',
    ],
    faqs: [
      { q: 'What formula does the Loan Calculator use?', a: 'It uses the standard amortization formula M = P·r(1+r)ⁿ / ((1+r)ⁿ − 1), with r the monthly rate (annual rate divided by 12) and n the number of months. The formula is printed on the page. A special case handles r = 0 by dividing the principal evenly across the term.' },
      { q: 'Is the interest rate entered monthly or annually?', a: 'Annually. The field is labelled Annual interest rate, and the tool converts it to a monthly rate by dividing by 12 before running the amortization math. Entering a monthly rate by mistake would understate the payment dramatically, so double-check the number you paste.' },
      { q: 'Why is interest higher in my first payment?', a: 'Interest is charged on the outstanding balance, which is largest at the start. Each payment covers that interest first and the rest reduces principal. The first payment panel shows a heavy interest share, and the last payment panel shows almost pure principal — the amortization curve in action.' },
      { q: 'Does the calculator include fees or insurance?', a: 'No. The calculation covers principal and interest only. Origination fees, credit insurance, and add-ons are not included, so your quoted payment may be higher. The tool\'s totals are the pure cost of the money itself, which makes comparing loan offers cleaner.' },
      { q: 'What happens when I set the rate to zero?', a: 'The amortization formula has a divide-by-zero edge case at r = 0, so the tool switches to a simple principal ÷ months payment instead. A 12,000 loan over 12 months returns 1,000 per month with zero total interest, exactly what a promotional interest-free plan should cost.' },
      { q: 'How accurate are the total interest figures?', a: 'They are exact for a fixed-rate loan with equal monthly payments and no extra fees, computed from the same formula lenders use. Small differences against a lender\'s schedule usually come from rounding, an odd first period, or date-based interest accrual, none of which this monthly model simulates.' },
    ],
    tips: [
      'Switch the term to Months for short loans under two years — it reads more naturally.',
      'The first and last payment boxes show you where your money goes at both ends of the loan.',
      'Use Total interest as the headline when comparing two offers with similar monthly payments.',
      'Extend the term and watch Total interest jump — that gap is the price of a smaller payment.',
    ],
  },
  // ── mortgage-calculator ──

  'mortgage-calculator': {
    intro:
      'The Mortgage Calculator estimates the true monthly cost of a home loan by building a full PITI payment — principal and interest, property tax, and home insurance — plus private mortgage insurance where it applies. Start with a home price and a down payment you can enter as a dollar amount or a percentage, then add the loan term, interest rate, annual property tax, annual home insurance, and a PMI rate. The calculator instantly shows your Monthly PITI as one large number, then splits it into Principal + interest, Property tax, Insurance, and PMI, and also reports the loan amount, down payment, and total monthly figure. Because taxes and insurance are rolled in, the result reflects what an escrowed payment actually looks like, not just the bare principal-and-interest quote a rate table shows. The PMI field follows the standard rule — it typically applies when your down payment is below 20 percent, and you set it to zero when it does not, exactly as the helper text explains. Home buyers use it to compare 15-year and 30-year terms, check whether 20 percent down removes PMI, and sanity-check lender quotes before committing to the biggest purchase of their lives.',
    examples: [
      { input: 'Home price = 400000, Down payment = 20 (%), Loan term = 30, Interest rate = 6.8, Property tax = 6000, Home insurance = 1400, PMI rate = 0.5', output: 'Monthly PITI $2,836.16 (P+I $2,086.16 + Tax $500.00 + Insurance $116.67 + PMI $133.33)', note: 'Loan = 400,000 − 80,000 = 320,000; P+I from r = 0.068/12 over 360 months is 2,086.16; PMI = 320,000 × 0.005 ÷ 12 = 133.33.' },
      { input: 'Home price = 350000, Down payment = 35000 with $ selected, Loan term = 15, Interest rate = 6.5, Property tax = 4200, Home insurance = 1200, PMI rate = 0.5', output: 'Monthly PITI $3,325.24 (P+I $2,743.99 + Tax $350.00 + Insurance $100.00 + PMI $131.25)', note: 'Loan = 350,000 − 35,000 = 315,000; P+I over 180 months at r = 0.005417 is 2,743.99; tax 4,200 ÷ 12 = 350; PMI = 315,000 × 0.005 ÷ 12 = 131.25.' },
      { input: 'Same as the first example but PMI rate = 0 (down payment of 20% or more)', output: 'Monthly PITI $2,702.83', note: 'Removing PMI drops the payment by 133.33: 2,086.16 + 500.00 + 116.67 = 2,702.83 — the saving from hitting 20% down.' },
    ],
    howTo: [
      'Enter the Home price and your Down payment, toggling the button next to it between % and $ to match how you think about it.',
      'Set the Loan term in years and the Interest rate as a percentage.',
      'Under Monthly costs, fill in annual Property tax, annual Home insurance, and a PMI rate.',
      'Read the large Monthly PITI figure, then the four-part breakdown beneath it.',
      'Check the Loan amount, Down payment, and Total monthly stats to confirm the numbers match your plan.',
    ],
    useCases: [
      'Estimating the full monthly cost of a $400,000 home before house hunting.',
      'Comparing a 15-year mortgage against a 30-year for the same purchase.',
      'Deciding whether stretching to a 20% down payment is worth removing PMI.',
      'Budgeting escrow-level payments including taxes and insurance from day one.',
      'Evaluating two houses whose prices are similar but property taxes differ sharply.',
      'Stress-testing how much a higher rate would add to a monthly payment.',
    ],
    bestPractices: [
      'Enter property tax and insurance as annual figures — the tool divides them by 12 for the monthly view.',
      'Set the PMI rate to 0 when your down payment is 20% or more, as the note under the fields advises.',
      'Remember this estimate excludes HOA dues, utilities, and maintenance, which all belong in a real housing budget.',
      'Use the loan amount stat to verify the down payment math before trusting the PITI figure.',
      'Re-run the calculation after rate quotes change — the interest rate is the most sensitive input.',
      'Treat PMI as an estimate: actual premiums vary by credit score and loan program.',
    ],
    faqs: [
      { q: 'What does PITI stand for?', a: 'Principal, Interest, Taxes, and Insurance — the four components of a typical escrowed mortgage payment. This tool computes the P+I using the standard amortization formula, adds annual property tax and home insurance divided by 12, and layers on PMI when a rate is entered, displaying the total as Monthly PITI.' },
      { q: 'When should I enter a PMI rate?', a: 'PMI usually applies when your down payment is below 20 percent of the home price, so enter your lender\'s annual PMI rate in that case. The tool multiplies the loan amount by the rate and divides by 12. If you put 20 percent or more down, set the rate to 0 to remove PMI from the total.' },
      { q: 'Does the Mortgage Calculator include HOA fees?', a: 'No. The calculation covers principal, interest, property tax, home insurance, and PMI only. Homeowners association dues, utilities, and maintenance are not part of the total. Add those amounts to your monthly budget separately to get a realistic picture of total housing cost.' },
      { q: 'Can I enter my down payment as a dollar amount?', a: 'Yes. The down payment field has a small % / $ toggle beside it. In % mode the tool computes the amount from the home price; in $ mode the value you type is used directly. Both feed the same loan amount calculation: home price minus down payment.' },
      { q: 'Why is the property tax entered annually?', a: 'Property tax is billed as an annual figure on listings and assessments, so the field expects the yearly total. The tool divides it by 12 to produce the monthly escrow portion. Entering a monthly figure by mistake would understate the payment twelvefold, so check the hint text: annual.' },
      { q: 'How does the loan term change my payment?', a: 'A shorter term means fewer months over which to amortize the loan, so the monthly P+I rises but total interest falls sharply. A longer term does the opposite. Compare a 15-year and 30-year scenario side by side in this tool to see both effects at once.' },
    ],
    tips: [
      'Toggle the down payment between % and $ to see the same scenario both ways without mental math.',
      'Compare the PITI of 30-year and 15-year terms to price the trade-off between payment and total interest.',
      'The PMI line disappears from the math when you set it to 0 — use that to model a 20% down scenario.',
      'Budget against the Monthly PITI number, not just P+I: taxes and insurance are real cash out every month.',
    ],
  },
  // ── compound-interest-calculator ──

  'compound-interest-calculator': {
    intro:
      'The Compound Interest Calculator projects how an investment grows when interest is reinvested, using the standard formula A = P(1 + r/n)ⁿᵗ plus an annuity term for optional monthly contributions. You provide an initial principal, an annual rate, a compounding frequency — Annually, Quarterly, Monthly, or Daily — and a number of years, then optionally add a monthly contribution. The tool immediately shows your projected balance, total contributions, and interest earned, so you can see at a glance how much of the final figure is money you saved and how much is growth doing the work. Contributions are applied at the end of each period, a conservative convention the page states openly. That frequency dropdown is the key to the tool\'s usefulness: the same 7 percent rate compounds to meaningfully different balances at annual versus daily frequency, and the gap widens with every passing year. Savers use it to model retirement accounts, compare savings products, and test how a small monthly deposit accelerates a long-term goal. Because every result is recalculated live and the formula is printed on the page, it doubles as a transparent compound interest growth projection tool for rough planning — with the usual caveat that past returns never guarantee future ones.',
    examples: [
      { input: 'Initial principal = 10000, Annual rate = 7, Compounding = Monthly, Years = 10, Monthly contribution = 200', output: 'Final amount $54,713.58 · Total contributions $34,000.00 · Interest earned $20,713.58', note: 'r = 0.07/12, periods = 120: 10000 × 1.005833¹²⁰ = 20,096.61; contributions: 200 × ((1.005833¹²⁰ − 1) ÷ 0.005833) = 34,616.96; 34,000 contributed in total.' },
      { input: 'Initial principal = 5000, Annual rate = 5, Compounding = Quarterly, Years = 20, Monthly contribution = 0', output: 'Final amount $13,507.42 · Interest earned $8,507.42', note: 'r = 0.05/4 = 0.0125, periods = 80: 5000 × 1.0125⁸⁰ = 13,507.42, leaving 8,507.42 of pure growth.' },
      { input: 'Initial principal = 25000, Annual rate = 4, Compounding = Daily, Years = 5, Monthly contribution = 500', output: 'Final amount $63,743.14 · Total contributions $55,000.00 · Interest earned $8,743.14', note: 'Principal grows to 30,534.73; contributions add 33,208.41; combined 63,743.14, with 8,743.14 in interest on 55,000 contributed.' },
    ],
    howTo: [
      'Enter the starting balance in the Initial principal field.',
      'Set the Annual rate as a percentage, such as 7 for seven percent.',
      'Pick a Compounding frequency from the dropdown: Annually, Quarterly, Monthly, or Daily.',
      'Enter the Years you plan to hold the investment, then optionally a Monthly contribution.',
      'Read the Projected balance, plus Final amount, Total contributions, and Interest earned — all live.',
    ],
    useCases: [
      'Projecting how a retirement account grows with a $200 monthly contribution over a decade.',
      'Comparing a savings account that compounds daily against one that compounds quarterly.',
      'Modelling a college fund with a fixed deposit and monthly top-ups.',
      'Separating growth from deposits in an investment review.',
      'Stress-testing how a lower rate would shrink a long-term goal.',
      'Estimating an emergency fund target with zero additional deposits.',
    ],
    bestPractices: [
      'Contributions are treated as made at the end of each period, so real-world results may differ slightly.',
      'The model ignores fees, taxes, and inflation — deduct those to see net, inflation-adjusted growth.',
      'Use a realistic long-run rate rather than last year\'s return; compounding magnifies overestimation.',
      'Compare the same scenario across frequencies to understand how much the dropdown choice moves the outcome.',
      'Do not treat the projection as a guarantee; markets vary and past performance is not future results.',
      'For a savings account, enter the nominal or APY rate as published — the tool applies it as a flat annual rate.',
    ],
    faqs: [
      { q: 'What formula does the Compound Interest Calculator use?', a: 'A = P(1 + r/n)ⁿᵗ + PMT × (((1 + r/n)ⁿᵗ − 1) ÷ (r/n)). The first term grows the principal; the second grows periodic contributions, where PMT is your monthly contribution converted to a per-period amount. The full formula is printed on the results card.' },
      { q: 'When are monthly contributions applied?', a: 'At the end of each compounding period, as the page states. This is the standard ordinary-annuity convention and is slightly conservative compared with deposits at the start of each month. For a $200 monthly deposit the difference is small over short horizons.' },
      { q: 'Which compounding frequency should I choose?', a: 'Match the product you are modelling: savings accounts often compound daily, many bonds and certificates quarterly, and some accounts annually. The dropdown offers exactly those four options. Higher frequency grows faster at the same rate, so pick the one your product actually uses.' },
      { q: 'Does the calculator account for inflation or fees?', a: 'No. The projection is nominal — it does not subtract fees, taxes, or inflation. To see real purchasing power, lower your entered rate by your inflation estimate, and subtract any management fees from the rate too. The output then reflects net, inflation-adjusted growth.' },
      { q: 'Why does interest earned exceed my contributions?', a: 'After enough time, compounding growth overtakes deposits — that is the point of starting early. In the default example, $34,000 of contributions generate $20,713.58 of interest over ten years. The interest earned stat isolates exactly that growth component of the final balance.' },
      { q: 'What rate should I enter for a savings account?', a: 'Enter the account\'s annual interest rate as a percentage. If the bank quotes APY, that already accounts for compounding and will give a slightly optimistic result here; the nominal rate is more precise. Either way the tool treats your input as a flat annual rate applied at the chosen frequency.' },
    ],
    tips: [
      'Run the same scenario at Monthly and Daily frequency — the small difference compounds into real money.',
      'The three stats split your final balance into deposits and growth, which is great for financial reviews.',
      'Leave Monthly contribution at 0 to model a one-time deposit cleanly.',
      'Raise the Years by five and watch interest earned accelerate — that is compounding doing its job.',
    ],
  },
  // ── gpa-calculator ──

  'gpa-calculator': {
    intro:
      'The GPA Calculator computes a weighted grade point average from a list of courses you control entirely — add as many rows as you need, pick a letter grade from A+ down to F, and enter the credit hours, and the running GPA updates live on every keystroke. The math is a classic weighted average: each grade\'s point value is multiplied by its credits, the points are summed, and the total is divided by total credits, so a four-credit A counts more than a two-credit A. The grade dropdown shows every point value beside the letter, from 4.0 for A+ and A down to 0.0 for F, on a fixed 4.0 scale that the results card labels clearly. Rows with empty, zero, or negative credit values are quietly excluded from the average, which protects the result from accidental junk rows. Two sample courses come prefilled — Calculus I with an A and English Composition with a B+ — so first-time visitors instantly see a realistic 3.70 result and can edit it into their own schedule. Students use it to track a semester GPA, project what grades are needed for a scholarship cutoff, or estimate a cumulative average before applications. It is the simplest weighted GPA calculator for semester planning, with nothing to install or sign up for.',
    examples: [
      { input: 'Default rows: Calculus I = A (4 credits), English Composition = B+ (3 credits)', output: 'GPA: 3.70 · Total credits: 7', note: '(4.0 × 4) + (3.3 × 3) = 16 + 9.9 = 25.9 points ÷ 7 credits = 3.70.' },
      { input: 'Three rows: Chemistry = A (4 cr), History = B (3 cr), Art = A- (2 cr)', output: 'GPA: 3.60 · Total credits: 9', note: '(4.0 × 4) + (3.0 × 3) + (3.7 × 2) = 16 + 9 + 7.4 = 32.4 points ÷ 9 credits = 3.60.' },
      { input: 'Two rows: Spanish = A (3 cr), Elective = C (0 credits)', output: 'GPA: 4.00 · Total credits: 3', note: 'The zero-credit row is excluded, so only 12.0 points ÷ 3 credits = 4.00 counts.' },
    ],
    howTo: [
      'Start from the two prefilled course rows or clear them and click the Add course button to build your schedule.',
      'Type an optional name into each course field, or leave it blank — names do not affect the math.',
      'Choose a Grade from the dropdown; each option shows its point value in parentheses, like B+ (3.3).',
      'Enter the Credits for each row, using decimals for partial credits such as 1.5.',
      'Read the large GPA figure, the Total credits stat, and the course-count badge — all update as you edit.',
    ],
    useCases: [
      'Calculating a semester GPA before final grades are officially posted.',
      'Estimating a cumulative GPA for scholarship or graduate school applications.',
      'Testing which grade in a retake would push an average past a 3.5 cutoff.',
      'Tracking progress against an academic probation recovery plan.',
      'Weighting lab courses correctly against lecture credits in one view.',
      'Explaining to a new student how credit hours change the value of each grade.',
    ],
    bestPractices: [
      'Only rows with positive credit values count — check that a mistyped 0 or blank credit is not silently dropping a course.',
      'Confirm your school\'s scale matches this tool\'s fixed 4.0 scale; plus/minus point values vary between institutions.',
      'Use your official transcript as the source of truth, not memory — one wrong grade moves the average.',
      'Remember A+ carries the same 4.0 as A here, which matches most U.S. unweighted scales.',
      'Add every course in a term, including pass/fail if your school includes them, to keep the total credits honest.',
      'Round-trip check: multiply the shown GPA by total credits and compare with your own points sum.',
    ],
    faqs: [
      { q: 'What grade scale does the GPA Calculator use?', a: 'A fixed unweighted 4.0 scale: A+ and A are 4.0, A- is 3.7, B+ is 3.3, B is 3.0, down through C, D, and F at 0.0. The results card labels the scale explicitly. If your school uses a different scale, adjust your expectations rather than the tool.' },
      { q: 'Are course names included in the calculation?', a: 'No. The name field exists purely for your own organization and is optional. Only the grade\'s point value and the credits participate in the weighted average, so the label field is safe to leave blank without changing any result.' },
      { q: 'What happens to rows with zero credits?', a: 'They are excluded from the weighted average entirely, as the note under the results explains. Only rows with a valid grade and a positive credit value count. This prevents a leftover row with 0 credits from being treated as a zero-point course and dragging the GPA down.' },
      { q: 'Does A+ give more than 4.0 points?', a: 'No. On this tool\'s fixed 4.0 scale, A+ and A are both worth exactly 4.0 points, matching most standard U.S. unweighted scales. Schools that award extra points for A+ (or honors courses) would show a different result, so rely on the transcript in those cases.' },
      { q: 'How do I add or remove a course row?', a: 'Click the Add course button in the Courses card header to append a new row, prefilled with grade A and 3 credits. Remove any row with the small trash icon on its right edge. The GPA and total credits recompute immediately after every add, edit, or removal.' },
      { q: 'Is the GPA updated live as I type?', a: 'Yes. Every change — typing a name, switching a grade in the dropdown, or editing credits — recalculates the weighted average instantly. There is no submit button. The large GPA figure, total credits stat, and course-count badge all refresh on the same keystroke.' },
    ],
    tips: [
      'Leave a row\'s credits at 0 to see how the GPA would look without that course, without deleting the row.',
      'The grade dropdown\'s parenthetical point values double as a quick reference chart.',
      'Use decimals in credits for half-credit labs or mini-terms.',
      'The course-count badge counts rows, not included credits — check Total credits for what actually went into the math.',
    ],
  },
  // ── currency-converter ──

  'currency-converter': {
    intro:
      'The Currency Converter turns an amount from one currency into another using a bundled set of static reference rates, so every conversion works instantly with no API calls, no rate fetching, and no waiting. The interface is deliberately simple: type an amount, pick a From currency and a To currency from twelve options spanning the US Dollar, Euro, British Pound, Japanese Yen, Brazilian Real, and more, and the converted amount appears immediately, alongside a unit-rate stat showing exactly what one unit of the source currency is worth in the target. A swap button flips the pair in one click, which is handy when you are double-checking a quote in both directions. Two details matter. First, the rates are reference values stored relative to the US dollar, not live market data — and the tool says so right on the results card, marking every result as for estimation only, not for executing transactions. Second, cross pairs like GBP to AUD are routed through the dollar bridge automatically, so you never have to find an intermediate rate yourself. Japanese Yen results are formatted without decimal places, matching real-world quoting. Travellers, freelancers with international clients, and online shoppers use it for quick, honest exchange rate estimates whenever a ballpark number is enough.',
    examples: [
      { input: 'Amount = 100, From = USD — US Dollar, To = EUR — Euro', output: 'Converted amount: €92.00 · 1 USD = 0.9200 EUR', note: '100 ÷ 1 × 0.92 = 92, using the bundled EUR rate of 0.92 per USD.' },
      { input: 'Amount = 100, From = EUR — Euro, To = USD — US Dollar', output: 'Converted amount: $108.70 · 1 EUR = 1.0870 USD', note: '100 ÷ 0.92 × 1 = 108.6957, rounded to $108.70; the unit rate is 1 ÷ 0.92 = 1.0870.' },
      { input: 'Amount = 100, From = GBP — British Pound, To = AUD — Australian Dollar', output: 'Converted amount: A$192.41 · 1 GBP = 1.9241 AUD', note: 'Routed through USD: 100 ÷ 0.79 × 1.52 = 192.4051, rounded to 192.41.' },
    ],
    howTo: [
      'Type the amount to convert into the Amount field.',
      'Choose the source currency from the From dropdown — each option shows its code and full name.',
      'Choose the destination from the To dropdown, such as EUR — Euro.',
      'Read the large Converted amount and the 1 From = stat beneath it, which shows the unit rate.',
      'Use the circular swap button between the two dropdowns to reverse the pair in one click.',
    ],
    useCases: [
      'Estimating spending money for a trip before exchanging at a bureau.',
      'Quoting a freelance invoice in a client\'s local currency from a USD rate card.',
      'Checking an overseas e-commerce price in home-currency terms.',
      'Splitting a group bill with friends who pay in different currencies.',
      'Roughly comparing prices of the same gadget across two regional stores.',
      'Verifying an advertised exchange rate is in the right ballpark before shopping around.',
    ],
    bestPractices: [
      'Treat every result as an estimate: the rates are bundled reference values, not live quotes, as the page states.',
      'Never execute a transfer based on this tool — check your bank or broker\'s live rate and fees first.',
      'Expect real-world quotes to differ, because banks add spreads on top of mid-market reference rates.',
      'Use the swap button and round-trip a conversion (100 USD to EUR and back) to spot-check internal consistency.',
      'Remember the USD bridge means cross rates derive from two dollar rates, which can differ slightly from published cross quotes.',
      'Note JPY displays without decimals — do not mistake a 150,500 yen result for a typo.',
    ],
    faqs: [
      { q: 'Are the exchange rates live?', a: 'No. The converter ships with bundled static reference rates defined relative to the US dollar, so it works offline with no external calls. The results card labels them as reference rates for estimation only, and the page warns against using them for real transactions.' },
      { q: 'Which currencies does the converter support?', a: 'Twelve: US Dollar, Euro, British Pound, Japanese Yen, Australian Dollar, Canadian Dollar, Swiss Franc, Chinese Yuan, Indian Rupee, Brazilian Real, Mexican Peso, and South African Rand. Each dropdown entry shows both the code and the full currency name for clarity.' },
      { q: 'Why is my bank\'s rate different from this tool?', a: 'Banks and brokers apply a spread to the mid-market rate, plus conversion fees, so customer rates are almost always less favourable. This tool uses reference rates with no spread, which is why it looks better. The difference is expected and normal, not an error in the tool.' },
      { q: 'How does the converter handle cross pairs like GBP to AUD?', a: 'It routes through the US dollar: the amount is divided by the source currency\'s USD rate and multiplied by the target\'s. So GBP to AUD uses 1 ÷ 0.79 × 1.52. This keeps one reference table for every pair, and the unit-rate stat shows the derived cross rate.' },
      { q: 'Why does JPY show no decimal places?', a: 'The Japanese Yen is conventionally quoted without decimals — banknotes start at ¥1 and fractional yen are meaningless in practice. The formatter detects JPY and uses zero minimum decimals, so 1000 USD converts to ¥150,500 rather than ¥150,500.00.' },
      { q: 'Can I trust these rates for a money transfer?', a: 'No. The bundled rates are a snapshot for estimation and may be outdated relative to the market, and they include no transfer fees or spreads. For an actual transfer, get a live quote from your bank or provider. Use this tool for planning and rough comparisons only.' },
    ],
    tips: [
      'The swap button instantly reverses the pair — great for checking a conversion from both sides.',
      'Read the 1 From = stat for a quick unit rate, like 0.9200 EUR per USD.',
      'Pick currencies by name if you are unsure of the code — the dropdown lists both.',
      'For trip planning, convert your whole budget once, then estimate daily spending in local units.',
    ],
  },
  // ── body-fat-calculator ──

  'body-fat-calculator': {
    intro:
      'The Body Fat Calculator estimates your body fat percentage using the U.S. Navy circumference method — the same tape-measure equations long used for military fitness standards. Choose a gender tab and a unit preference, then enter three measurements for men (height, neck, and waist) or four for women (adding hip), and the tool applies the Navy formula: 495 divided by a logarithmic expression built from those measurements, minus 450. The result appears as a percentage with a category badge drawn from American Council on Exercise ranges, spanning Essential, Athletic, Fitness, Average, and Obese. Because the formula involves logarithms of measurement differences, the calculator validates its inputs carefully — if your waist is not greater than your neck, or waist plus hip not greater than neck, it shows a clear error instead of a nonsense number and surfaces the same message as a toast notification. The cm/in toggle converts inches internally, so imperial users get the same precision as metric ones. Fitness enthusiasts, bodybuilders, and anyone tracking recomposition use it as a repeatable, tape-measure-based body fat percentage estimate that complements scale weight — with the honest caveat printed on the page that clinical body composition assessment requires a healthcare professional.',
    examples: [
      { input: 'Male, cm: Height = 175, Neck = 38, Waist = 85', output: 'Body fat: 16.9% — Fitness', note: 'denominator = 1.0324 − 0.19077 × log10(47) + 0.15456 × log10(175) ≈ 1.0601; 495 ÷ 1.0601 − 450 = 16.9. Male 14–18 is the Fitness band.' },
      { input: 'Female, cm: Height = 165, Neck = 33, Waist = 75, Hip = 95', output: 'Body fat: 26.9% — Average', note: 'sum = 75 + 95 − 33 = 137; 495 ÷ (1.29579 − 0.35004 × log10(137) + 0.221 × log10(165)) − 450 = 26.9. Female 25–32 is Average.' },
      { input: 'Male, in: Height = 72, Neck = 15, Waist = 30', output: 'Body fat: 8.2% — Athletic', note: 'Inches convert internally to 182.9 / 38.1 / 76.2 cm; 495 ÷ (1.0324 − 0.19077 × log10(38.1) + 0.15456 × log10(182.9)) − 450 ≈ 8.2. Male 6–14 is Athletic.' },
    ],
    howTo: [
      'Pick the Male or Female tab — the female tab adds a required Hip field and uses a different formula.',
      'Choose cm or in with the unit toggle beside the gender tabs.',
      'Enter Height, Neck, and Waist (plus Hip for female), measured with a flexible tape.',
      'Read the large body fat percentage and its ACE category badge, colour-coded by band.',
      'If an error appears — such as waist not greater than neck — correct the measurements and the result returns.',
    ],
    useCases: [
      'Tracking recomposition progress with a tape measure between weigh-ins.',
      'Estimating body composition for a fitness assessment alongside the BMI tool.',
      'Checking against military or academy fitness standard expectations.',
      'Setting a body fat target before starting a cut or bulk.',
      'Comparing readings from month to month under the same measuring routine.',
      'Giving a coach a starting baseline before a training block.',
    ],
    bestPractices: [
      'Measure the neck below the larynx and the waist at the navel, exactly as the Navy method specifies.',
      'Keep conditions consistent — same time of day, same posture, same tape tension — or trends become noise.',
      'Fix invalid geometry before reading results: waist must exceed neck for men, and waist plus hip must exceed neck for women.',
      'Treat the output as an estimate, not a clinical measurement — the page itself recommends professionals for clinical body composition.',
      'Have the same person take the measurements each time to reduce inter-rater error.',
      'Pair the percentage with scale weight and photos, since the formula only sees circumferences.',
    ],
    faqs: [
      { q: 'What is the U.S. Navy body fat formula?', a: 'For men: 495 ÷ (1.0324 − 0.19077 × log10(waist − neck) + 0.15456 × log10(height)) − 450. For women, waist + hip − neck replaces waist − neck and different coefficients apply: 1.29579, 0.35004, and 0.221. All measurements are converted to centimeters internally.' },
      { q: 'Why do I get an error about waist and neck?', a: 'The formula takes a logarithm of the difference between waist and neck (waist plus hip for women), and logarithms of zero or negative numbers are undefined. The tool detects this, shows an inline error, and fires a toast so you know the measurements are geometrically impossible to compute.' },
      { q: 'Do women need a hip measurement?', a: 'Yes. Selecting the Female tab reveals a required Hip field because the female Navy equation uses waist + hip − neck instead of waist − neck. Without a positive hip value the tool shows a "Hip measurement is required for females" error rather than computing with an invalid input.' },
      { q: 'How accurate is the Navy body fat method?', a: 'It is a well-established circumference-based estimate that typically tracks within a few percentage points of laboratory methods for the general population, but accuracy varies with build and hydration. The page labels it an estimate and recommends a healthcare professional for clinical body composition results.' },
      { q: 'What do the category badges mean?', a: 'The badges map your percentage to American Council on Exercise bands: Essential, Athletic, Fitness, Average, and Obese, with different thresholds for men and women. For men, Athletic is 6–14% and Fitness 14–18%; for women, Athletic is 14–21% and Fitness 21–25%. Each badge has its own colour.' },
      { q: 'Can I enter measurements in inches?', a: 'Yes. The unit toggle switches all inputs to inches, and the tool converts them to centimeters internally before applying the formula, so the result is identical in precision to metric entry. The results card still labels the method as U.S. Navy regardless of the unit used.' },
    ],
    tips: [
      'Switch units freely — the toggle only changes the input fields, never the underlying formula.',
      'Use the same tape routine each time; the tool\'s precision is only as good as your measurements.',
      'Read the inline error text carefully — it tells you exactly which measurement pair is invalid.',
      'Compare the badge to the ACE chart on the page to judge where you sit within your band.',
    ],
  },
  // ── unit-converter ──

  'unit-converter': {
    intro:
      'The Unit Converter converts values across six everyday categories — Length, Weight, Temperature, Data, Speed, and Time — from one clean interface that updates results live as you type. Each category carries its own unit list: length spans millimeters to miles, weight spans milligrams to metric tons, data spans bytes to terabytes, speed includes kilometers per hour, miles per hour, and knots, and time covers milliseconds all the way to years. Temperature is handled separately and correctly, using offset-aware formulas so 100 °C becomes 212 °F rather than the nonsense a simple multiplier would produce. Data units follow a 1024-based binary progression, and the page says so, which matters when you convert gigabytes for storage rather than marketing. Switching categories resets your units to the first two options automatically, so you are never left holding a unit from the previous category. The result card repeats the value, the source unit, and the target unit, making the output unambiguous. Whether you are converting a recipe from ounces to grams, a workout distance from kilometers to miles, or a server quota from terabytes to gigabytes, this free multi-category measurement converter removes the need for reference tables and search-engine queries.',
    examples: [
      { input: 'Category = Length, Value = 1, From = Meter (m), To = Foot (ft)', output: 'Result: 3.28084 ft', note: '1 ÷ 0.3048 = 3.28084 — feet convert to meters by the factor 0.3048.' },
      { input: 'Category = Temperature, Value = 100, From = Celsius (°C), To = Fahrenheit (°F)', output: 'Result: 212 °F', note: 'Offset math: 100 × 9/5 + 32 = 212, not 100 × 1.8 alone.' },
      { input: 'Category = Data, Value = 1, From = Gigabyte (GB), To = Megabyte (MB)', output: 'Result: 1,024 MB', note: 'Data uses 1024-based steps: 1 GB = 1024 MB, as the page note explains.' },
    ],
    howTo: [
      'Pick a Category from the dropdown — Length, Weight, Temperature, Data, Speed, or Time.',
      'Enter the number to convert in the Value field.',
      'Choose the From unit, such as Kilometer (km) or Celsius (°C).',
      'Choose the To unit, such as Mile (mi) or Fahrenheit (°F).',
      'Read the large Result and the three stats beneath it, which repeat value, source unit, and target unit.',
    ],
    useCases: [
      'Converting a baking recipe from ounces to grams without guessing.',
      'Translating a 10k run into miles for a training log.',
      'Turning an oven temperature in Celsius into Fahrenheit before baking.',
      'Checking how many gigabytes remain when a cloud plan reports terabytes.',
      'Converting a commute speed between km/h and mph for a travel article.',
      'Working out how many seconds a 90-minute movie lasts for timing math.',
    ],
    bestPractices: [
      'Remember data units here are binary: 1 KB = 1024 B, so disk capacity shown in decimal gigabytes will not match exactly.',
      'Temperature conversions include offsets, which is why the tool uses dedicated formulas rather than a shared factor.',
      'For the Time category, a month is fixed at 30 days and a year at 365 days — approximations, not calendar-accurate.',
      'Do not chain conversions with hand-rounding in between; convert once with the full-precision factor.',
      'Expect the From and To units to reset when you switch category — that is intentional and noted in the UI.',
      'Verify engineering-critical conversions against an authoritative source before relying on the result.',
    ],
    faqs: [
      { q: 'Which categories does the Unit Converter cover?', a: 'Six: Length, Weight, Temperature, Data, Speed, and Time. Length runs from millimeters to miles; weight from milligrams to metric tons; data from bytes to terabytes; speed from meters per second to knots; time from milliseconds to years; temperature across Celsius, Fahrenheit, and Kelvin.' },
      { q: 'Are data units binary or decimal?', a: 'Binary, with a 1024-based progression — 1 KB = 1024 bytes, 1 MB = 1024 KB, and so on. The note under the result states this explicitly. If you are comparing against drive marketing that uses decimal 1000-based units, expect a small mismatch.' },
      { q: 'How are temperature conversions handled?', a: 'With offset-aware formulas. Inputs convert to Celsius first — Fahrenheit subtracts 32 and multiplies by 5/9, Kelvin subtracts 273.15 — and the Celsius value converts to the target. This yields correct results like 212 °F for 100 °C, which a plain factor cannot produce.' },
      { q: 'How long is a month in the Time category?', a: '30 days, and a year is 365 days — the unit list labels them as such. These are standardized approximations for general conversion work, not calendar-accurate durations. For precise date math involving specific months, use a date calculator instead.' },
      { q: 'Why did my units change when I switched category?', a: 'To avoid an invalid pair, the tool resets From and To to the first two units of the newly selected category. Switching from Length to Weight, for example, resets meters and feet to kilogram and gram. This behaviour keeps the pair always valid for the active category.' },
      { q: 'How precise are the conversion factors?', a: 'Linear categories use standard SI and imperial definitions — the pound is 0.45359237 kg, the mile is 1609.344 m, the inch is 0.0254 m. Results display up to eight fraction digits, so precision is limited by display rounding, not by the underlying factors.' },
    ],
    tips: [
      'The Result stat appends the target unit, so there is no ambiguity about what the number means.',
      'Watch the note under the result — it changes per category to explain binary, offset, or standard factors.',
      'Knots are available in the Speed category for sailing and aviation use.',
      'Switching categories auto-resets units, so just pick the new category and re-choose your pair.',
    ],
  },
  // ── invoice-generator ──

  'invoice-generator': {
    intro:
      'The Invoice Generator builds a professional, printable invoice from a short form, with line items, tax, totals, and a live preview that updates as you type. Fill in your company name and address, the client\'s details, an invoice number, issue and due dates, a tax rate, and a currency — eight options from US Dollar to Brazilian Real, each with its proper symbol and locale formatting — then add rows of descriptions, quantities, and unit prices. The subtotal, tax, and total recompute instantly, and the preview renders a clean, dark-header invoice with a bill-to block, an itemized table, and a totals column, exactly as a client would see it. When the invoice looks right, the Download HTML button saves a standalone, self-contained file you can open in any browser, and the Print button opens a print-ready window for saving as PDF. Payment terms and notes accept multi-line text and appear beneath the totals, and the default template ships with a realistic three-item example so you can see the finished format before typing anything. Freelancers and small businesses use it to send polished client billing without accounting software, and because nothing is stored on a server, your invoice data never leaves the browser.',
    examples: [
      { input: 'Default template: 8 × $150.00, 5 × $320.00, 40 × $95.00, Tax rate = 8.5, Currency = USD', output: `Subtotal  $6,600.00
Tax (8.50%)  $561.00
Total  $7,161.00`, note: '8 × 150 = 1,200; 5 × 320 = 1,600; 40 × 95 = 3,800; subtotal 6,600 × 0.085 = 561 tax; total 7,161.' },
      { input: 'Two rows: 12 × €45.00, 3 × €120.00, Tax rate = 20, Currency = EUR', output: 'Total: 1.080,00 € (subtotal 900,00 € + 180,00 € tax)', note: '12 × 45 = 540 and 3 × 120 = 360 give 900 subtotal; 900 × 0.20 = 180 tax; formatted in the German-style EUR locale.' },
      { input: 'Two rows: 4 × $250.00, 1 × $350.00, Tax rate = 0, Currency = USD', output: 'Total: $1,350.00 (subtotal $1,350.00, tax $0.00)', note: '4 × 250 = 1,000 plus 350 = 1,350; a zero tax rate means total equals subtotal, shown as Tax (0.00%).' },
    ],
    howTo: [
      'Fill in the Your company section with your name and a multi-line address, then the Bill to section with the client\'s details.',
      'Set Invoice #, Issue date, Due date, Currency, and the Tax rate percentage.',
      'Add line items with the Add row button, then type each Description, Qty, and Unit price.',
      'Review the Subtotal, Tax, and Total lines and the Live preview card as they update.',
      'Finish with Download HTML for a standalone file or Print for a paper/PDF-ready copy.',
    ],
    useCases: [
      'Sending a freelance development invoice with itemized hours and screens.',
      'Producing a branded consulting invoice with multi-line payment terms.',
      'Creating a product invoice in a client\'s currency, such as EUR or GBP.',
      'Generating a tax-free invoice by setting the rate to zero.',
      'Printing a paper copy for clients who prefer physical documents.',
      'Drafting a bill quickly during a meeting and exporting it on the spot.',
    ],
    bestPractices: [
      'Use sequential, unique invoice numbers — the field is free text, so a scheme like INV-0001 is up to you.',
      'Set the tax rate to the figure your jurisdiction requires; the tool applies it flat across the whole subtotal.',
      'Double-check due dates and payment terms before sending — they print on the document exactly as typed.',
      'Download the HTML file as your record, since nothing is saved automatically anywhere.',
      'Keep line descriptions specific; itemized invoices get paid faster and with fewer questions.',
      'Print to PDF rather than paper when you need to email the invoice as an attachment.',
    ],
    faqs: [
      { q: 'Can I download the invoice as a PDF?', a: 'Directly, no — the download produces a standalone HTML file that opens in any browser. To get a PDF, use the Print button, which opens a print-ready window, and choose "Save as PDF" as the printer destination. The printed output is styled for exactly that workflow.' },
      { q: 'What currencies does the Invoice Generator support?', a: 'Eight: USD, EUR, GBP, CAD, AUD, JPY, INR, and BRL. Each has a correct symbol — €, £, ¥, ₹, and so on — and locale-aware number formatting, so European clients see decimal commas while US clients see periods. The currency dropdown in the form selects the display currency.' },
      { q: 'How is tax calculated on my line items?', a: 'Each row\'s total is quantity multiplied by unit price, the row totals are summed into a subtotal, and the tax rate percentage is applied to that subtotal once. The totals card shows Subtotal, Tax with the exact rate, and Total — subtotal plus tax — updating live with every edit.' },
      { q: 'Does the tool save my invoices anywhere?', a: 'No. Everything runs in your browser — there is no server storage or account. Close the tab and the data is gone unless you download the HTML file. That is by design for privacy, but it also means you should export anything you want to keep.' },
      { q: 'Why is the Print button disabled?', a: 'Print (and a meaningful download) require at least one line item; the button is disabled when the item list is empty, and the preview shows a "No line items" placeholder. Add a row with the Add row button and the print and download actions become available again.' },
      { q: 'Can I change the invoice after downloading?', a: 'The downloaded file is a static snapshot, so edits afterwards happen in the generator, not in the file. Make your changes in the form, review the live preview, and download again — the filename includes your invoice number, so versioning separate files is straightforward.' },
    ],
    tips: [
      'The Live preview card renders the exact document layout, so check it before exporting.',
      'Notes support line breaks and print under the totals — ideal for payment terms.',
      'The Items, Subtotal, Tax, and Total stats give a quick summary without scrolling to the preview.',
      'Use the trash icon on a row to remove it; totals adjust immediately.',
    ],
  },
  // ── tdee-calculator ──

  'tdee-calculator': {
    intro:
      'The TDEE Calculator estimates your Total Daily Energy Expenditure — the calories you burn in a full day, exercise included — by multiplying your basal metabolic rate by an activity multiplier. Two tabs handle the BMR side: Compute BMR asks for gender, age, weight, and height and applies the Mifflin-St Jeor equation (10 × kg + 6.25 × cm − 5 × age, plus 5 for men or minus 161 for women), while Enter BMR directly accepts a figure you already have from a lab test or another calculation. A five-level activity selector then applies multipliers from 1.2 for Sedentary up to 1.9 for Very Active, and the page reports BMR and TDEE side by side. Below the headline numbers, a goal table converts your TDEE into practical daily calorie targets — lose one pound per week at minus 500 calories, maintain, or gain at plus 250 or plus 500 — using the 3,500-calorie-per-pound rule of thumb the page explains. A reset button restores sensible defaults in one click whenever you want a clean comparison. Dieters, athletes, and coaches use this energy expenditure calculator as the foundation of any calorie-goal plan, turning three body measurements and an honest activity self-assessment into a daily maintenance calorie number they can actually plan around.',
    examples: [
      { input: 'Compute BMR tab: Male, Age = 30, Weight = 70 kg, Height = 175 cm, Activity = Moderate (1.55)', output: 'BMR 1,649 cal/day · TDEE 2,556 cal/day', note: 'Mifflin-St Jeor: 10×70 + 6.25×175 − 5×30 + 5 = 1,648.75; × 1.55 = 2,555.6, rounded to 2,556.' },
      { input: 'Compute BMR tab: Female, Age = 30, Weight = 60 kg, Height = 165 cm, Activity = Light (1.375)', output: 'BMR 1,320 cal/day · TDEE 1,815 cal/day', note: '600 + 1,031.25 − 150 − 161 = 1,320.25; × 1.375 = 1,815.3, rounded to 1,815.' },
      { input: 'Enter BMR directly tab: BMR = 1600, Activity = Active (1.725)', output: 'TDEE 2,760 cal/day · Lose 1 lb/week row shows 2,260 cal', note: '1,600 × 1.725 = 2,760; the goal table subtracts 500 from TDEE for the weekly pound-loss target.' },
    ],
    howTo: [
      'Choose the Compute BMR tab, or Enter BMR directly if you already have a figure.',
      'On the body metrics card, pick Male or Female, then fill Age, Weight (kg), and Height (cm).',
      'Select your Activity level from the dropdown, from Sedentary (1.2) to Very Active (1.9).',
      'Read the BMR and TDEE stats beside the form — both update live.',
      'Scroll to the Calorie targets by goal table to see adjusted daily targets for losing, maintaining, or gaining.',
    ],
    useCases: [
      'Finding maintenance calories before starting a cut or bulk.',
      'Planning a one-pound-per-week deficit with the goal table.',
      'Setting a conservative surplus for lean muscle gain.',
      'Cross-checking the calorie burn a fitness watch reports.',
      'Giving a coach a starting TDEE for a client\'s meal plan.',
      'Recalculating energy needs after a significant weight change.',
    ],
    bestPractices: [
      'The Mifflin-St Jeor result is an estimate — individual BMR varies by body composition and genetics.',
      'Choose the activity multiplier honestly; most desk workers with light exercise are Sedentary or Light, not Moderate.',
      'Recalculate after your weight moves more than a few kilos, since BMR scales with body mass.',
      'Treat the 3,500-calorie-per-pound rule as a rule of thumb — the goal table states this caveat directly.',
      'If you have a lab-measured BMR, use the direct tab rather than accepting the equation\'s estimate.',
      'Use the Reset to defaults button to clear a muddled session and start a clean scenario.',
    ],
    faqs: [
      { q: 'What is the Mifflin-St Jeor equation?', a: 'A widely used BMR formula: 10 × weight(kg) + 6.25 × height(cm) − 5 × age, with +5 for men and −161 for women. The TDEE Calculator applies it on the Compute BMR tab whenever age, weight, and height are valid positive numbers, and the page names the equation explicitly.' },
      { q: 'When should I use Enter BMR directly?', a: 'When you have a BMR from an indirect calorimetry test, a medical assessment, or a calculation you trust more than the equation. Enter the number in calories per day and skip the body metrics entirely — the tool then multiplies your figure by the chosen activity multiplier.' },
      { q: 'Which activity multiplier should I pick?', a: 'The one that honestly matches your weekly routine: 1.2 for little or no exercise, 1.375 for light activity one to three days a week, 1.55 for moderate three to five days, 1.725 for active six to seven days, and 1.9 for physical jobs. Overestimating activity is the most common way to inflate a TDEE.' },
      { q: 'How accurate is my TDEE estimate?', a: 'It is a solid starting point, typically within a few hundred calories of measured values for most people, but the activity multiplier is subjective and the equation cannot see muscle mass. Track your actual weight trend for a few weeks and adjust calories up or down from the estimate.' },
      { q: 'Why does the goal table show negative deltas?', a: 'Each row adjusts your TDEE by a fixed daily delta built on the 3,500-calorie-per-pound rule: −500 for one pound lost weekly, −250 for half a pound, zero to maintain, and +250 or +500 to gain. Negative deltas mean eating below TDEE, which the table displays in green.' },
      { q: 'How often should I recalculate my TDEE?', a: 'Whenever your weight, age band, or activity routine changes materially — losing ten kilograms lowers BMR meaningfully, and a new workout schedule changes the multiplier. Re-run the calculator every four to six weeks during a long diet or bulk to keep targets current.' },
    ],
    tips: [
      'Use the direct-BMR tab to compare a lab result against the equation\'s estimate — the difference is informative.',
      'Pick one goal row from the table and build your meal plan around that single number.',
      'The reset button restores age 30, 70 kg, 175 cm, Moderate, male — a handy clean slate.',
      'Treat the activity dropdown as the biggest knob: one level up or down can move TDEE by hundreds of calories.',
    ],
  },
  // ── calorie-calculator ──

  'calorie-calculator': {
    intro:
      'The Calorie Calculator turns your body stats into a daily calorie target and a full macro breakdown in grams, combining the Mifflin-St Jeor BMR equation, an activity multiplier, and a choice of five goal presets. After you pick a gender and enter age, weight, and height, the tool computes your BMR, multiplies it by an activity level from Sedentary to Very Active to get your TDEE, then applies the goal you select — Lose 1 lb/wk, Lose 0.5 lb/wk, Maintain, Gain 0.5 lb/wk, or Gain 1 lb/wk — each carrying its own calorie delta and its own protein, carbs, and fat split. Three stats report BMR, TDEE, and Target calories, while the macro breakdown card shows grams of protein, carbs, and fat, plus colour-coded bars so the split is visible at a glance. Conversions use the standard 4 calories per gram for protein and carbs and 9 for fat, which the page states. Dieters get an instant, coherent answer to the question "how many calories should I eat to lose weight", and lifters get the same for bulking, complete with macros to build meals around. A reset button restores the defaults whenever you want a fresh comparison.',
    examples: [
      { input: 'Male, Age = 30, Weight = 70 kg, Height = 175 cm, Activity = Moderate, Goal = Maintain', output: 'BMR 1,649 cal · TDEE 2,556 cal · Target 2,556 cal · Protein 192 g · Carbs 256 g · Fat 85 g', note: 'Mifflin-St Jeor BMR 1,648.75 × 1.55 = 2,556 TDEE; Maintain split is 30/40/30: 2,556 × 0.30 ÷ 4 = 191.7 g protein, × 0.40 ÷ 4 = 255.6 g carbs, × 0.30 ÷ 9 = 85.2 g fat.' },
      { input: 'Female, Age = 30, Weight = 60 kg, Height = 165 cm, Activity = Light, Goal = Lose 1 lb/wk (-500)', output: 'BMR 1,320 cal · TDEE 1,815 cal · Target 1,315 cal · Protein 132 g · Carbs 115 g · Fat 37 g', note: 'BMR 1,320.25 × 1.375 = 1,815 TDEE minus 500 = 1,315 target; the 40/35/25 split gives 131.5 g, 115.1 g, and 36.5 g.' },
      { input: 'Male, Age = 30, Weight = 70 kg, Height = 175 cm, Activity = Moderate, Goal = Gain 1 lb/wk (+500)', output: 'Target 3,056 cal · Protein 229 g · Carbs 382 g · Fat 68 g', note: '2,556 TDEE + 500 = 3,056; the 30/50/20 split gives 3,056 × 0.30 ÷ 4 = 229.2 g protein, × 0.50 ÷ 4 = 382 g carbs, × 0.20 ÷ 9 = 67.9 g fat.' },
    ],
    howTo: [
      'Pick Male or Female with the Gender tabs at the top of the Body metrics card.',
      'Enter your Age, Weight (kg), and Height (cm) in the three number fields.',
      'Choose an Activity level and a Goal from the two dropdowns — the goal options include their calorie deltas.',
      'Read the BMR, TDEE, and Target calories stats above the macro card.',
      'Review the Macro breakdown card for gram targets and the colour-coded percentage bars.',
    ],
    useCases: [
      'Setting a daily calorie budget for a one-pound-per-week weight loss plan.',
      'Building a lean-bulk target with a modest surplus and macro guidance.',
      'Planning a week of meals around exact protein, carb, and fat grams.',
      'Comparing how different goals change both calories and macros at once.',
      'Adjusting intake after recalculating with a new body weight.',
      'Translating a TDEE from the TDEE Calculator into actionable macro grams.',
    ],
    bestPractices: [
      'Macro grams are whole-number estimates — expect one or two grams of rounding in the bar display.',
      'Use the 4/4/9 calorie values as a baseline; food labels and digestion introduce real-world variance.',
      'Match your activity choice to the TDEE Calculator for consistency when comparing the two tools.',
      'Revisit your numbers after five kilograms of weight change, since BMR scales with mass.',
      'The preset splits are general guidance, not medical advice — the page says to adjust them to your training.',
      'Don\'t chase the target to the single calorie; staying within a 100-calorie band is a workable plan.',
    ],
    faqs: [
      { q: 'How does the Calorie Calculator compute BMR?', a: 'With the Mifflin-St Jeor equation: 10 × weight(kg) + 6.25 × height(cm) − 5 × age, plus 5 for men or minus 161 for women. BMR is then multiplied by the activity factor to produce TDEE, and the goal delta is applied to that to get the target calories.' },
      { q: 'What do the goal presets change?', a: 'Each preset changes two things: the calorie delta applied to your TDEE and the macro split. Lose 1 lb/wk subtracts 500 calories and uses a 40/35/25 split, Maintain uses 30/40/30, and Gain 1 lb/wk adds 500 with 30/50/20. The card header always shows the active split.' },
      { q: 'Why are macros shown in grams?', a: 'Grams are what food scales and labels measure, so gram targets are directly actionable at meal time. The tool derives them from the target calories using the standard energy values — protein and carbs at 4 calories per gram, fat at 9 — and rounds to whole grams for practical use.' },
      { q: 'How many calories are in a gram of fat?', a: 'Nine, versus four for a gram of protein or carbohydrates — the exact conversion the calculator uses and prints on the page. That density is why a 30% fat share produces fewer grams than a 30% protein share: 2,556 × 0.30 ÷ 9 is about 85 grams, while protein gives about 192 grams.' },
      { q: 'Can I build muscle with the gain presets?', a: 'The Gain 0.5 lb/wk (+250) and Gain 1 lb/wk (+500) presets provide the calorie surplus and macro split that support weight gain, but muscle versus fat gains depend on your training and protein timing. The page notes the ratios are general guidance — pair them with progressive resistance training.' },
      { q: 'Should I eat below my BMR to lose weight faster?', a: 'Not recommended for long. Your target already applies the goal deficit to TDEE, which is higher than BMR, so the Lose 1 lb/wk preset lands above BMR for most people. Sustained eating below BMR can impair recovery and hormone function; slower, consistent deficits work better in practice.' },
    ],
    tips: [
      'The goal dropdown labels include the calorie delta, so you always know what you are signing up for.',
      'The colour-coded macro bars make the split readable at a glance — red protein, amber carbs, sky fat.',
      'Reset to defaults restores 30 / 70 / 175 / Moderate / Maintain for a clean baseline.',
      'Pair this with the Macro Calculator by feeding the target calories in there for a second opinion on grams.',
    ],
  },
  // ── macro-calculator ──

  'macro-calculator': {
    intro:
      'The Macro Calculator splits a daily calorie target into grams of protein, carbohydrates, and fat using one of four diet presets: Balanced (30P / 40C / 30F), Low-carb (30P / 20C / 50F), Keto (25P / 5C / 70F), and High-protein (40P / 40C / 20F). Enter your daily calories, choose a diet type, and the tool immediately reports gram targets for each macro, using the standard energy values of 4 calories per gram for protein and carbs and 9 calories per gram for fat. A stacked calorie-split bar shows each macro\'s share of your daily energy in colour, with a legend beneath it, and a verification line re-derives the calorie total from the grams, proving the split adds up — 150 grams of protein, 200 grams of carbs, and 67 grams of fat round-trips exactly to 2,000 calories on the Balanced preset. If your calorie input is empty or invalid, the tool shows a prompt instead of a result. The four presets cover the spectrum from keto dieters keeping carbs near 5 percent to strength athletes pushing protein to 40 percent. Anyone with a calorie target from another calculator — or a coach\'s plan — can drop it in here and leave with a gram-accurate daily macro breakdown for meal planning.',
    examples: [
      { input: 'Daily calories = 2000, Diet type = Balanced (30P / 40C / 30F)', output: 'Protein 150 g · Carbs 200 g · Fat 67 g', note: '2000 × 0.30 ÷ 4 = 150 g protein; 2000 × 0.40 ÷ 4 = 200 g carbs; 2000 × 0.30 ÷ 9 = 66.7 g fat, rounded to 67.' },
      { input: 'Daily calories = 2000, Diet type = Keto (25P / 5C / 70F)', output: 'Protein 125 g · Carbs 25 g · Fat 156 g', note: '2000 × 0.25 ÷ 4 = 125 g; 2000 × 0.05 ÷ 4 = 25 g; 2000 × 0.70 ÷ 9 = 155.6 g fat, rounded to 156.' },
      { input: 'Daily calories = 1800, Diet type = High-protein (40P / 40C / 20F)', output: 'Protein 180 g · Carbs 180 g · Fat 40 g', note: '1800 × 0.40 ÷ 4 = 180 g for both protein and carbs; 1800 × 0.20 ÷ 9 = 40 g fat.' },
    ],
    howTo: [
      'Enter your calorie target in the Daily calories field, labelled cal/day.',
      'Pick a Diet type from the dropdown — each option shows its protein, carb, and fat percentages.',
      'Read the Protein, Carbs, and Fat stats, shown in grams.',
      'Check the Calorie split card for the stacked bar and the per-macro legend.',
      'Verify with the Check line, which re-derives the calorie total from the computed grams.',
    ],
    useCases: [
      'Converting a 2,000-calorie diet into exact grams for meal prep.',
      'Planning keto macros with carbs held near 5 percent of calories.',
      'Setting a high-protein split during a cutting phase.',
      'Comparing two diet styles on the same calorie budget side by side.',
      'Translating a coach\'s calorie prescription into a shopping list.',
      'Teaching nutrition basics with the visible calorie-split bar.',
    ],
    bestPractices: [
      'Whole-gram display rounds results slightly — the check line lets you confirm the split still totals your calorie target.',
      'Remember 4/4/9 values are averages; actual food energy varies by fibre, alcohol, and digestibility.',
      'For keto, the tiny carb gram total is expected — track net carbs separately if that is your approach.',
      'Use the check line to catch typos in your calorie input before trusting the grams.',
      'Adjust presets to reality: the splits are general guidance, not individual prescriptions.',
      'Keep your calorie target current — grams shift proportionally whenever the target changes.',
    ],
    faqs: [
      { q: 'What diet presets are available?', a: 'Four: Balanced (30P / 40C / 30F), Low-carb (30P / 20C / 50F), Keto (25P / 5C / 70F), and High-protein (40P / 40C / 20F). The dropdown shows the exact percentages, and switching presets recalculates all three gram targets instantly from your calorie input.' },
      { q: 'How are macro grams computed from calories?', a: 'The calorie target is multiplied by each macro\'s percentage, then divided by the macro\'s energy density: 4 calories per gram for protein and carbs, 9 for fat. A 2,000-calorie Balanced split therefore gives 600 ÷ 4 = 150 g protein, 800 ÷ 4 = 200 g carbs, and 600 ÷ 9 = 66.7 g fat.' },
      { q: 'Why does keto show so few carb grams?', a: 'The Keto preset allocates only 5 percent of calories to carbohydrates: 2,000 × 0.05 ÷ 4 = 25 grams. That is the entire point of a ketogenic split — keeping carbs low enough to stay in ketosis. If your carb target differs, use a preset closer to your actual plan.' },
      { q: 'Does the calculator verify its own split?', a: 'Yes — a check line under the split bar re-derives the calorie total from the grams, for example 600 + 800 + 600 = 2,000 cal from the Balanced grams. This confirms the percentage split and rounding are consistent with your input before you build meals from the numbers.' },
      { q: 'Can I enter a custom macro ratio?', a: 'No custom ratio field exists; the tool offers the four fixed presets. If your coach prescribes a different split, choose the closest preset and scale mentally, or use the calorie math (percent × calories ÷ 4 or 9) to adjust the grams yourself.' },
      { q: 'Should I round my grams up or down?', a: 'The tool rounds to whole grams for display, which is fine for meal planning — the check line confirms the totals stay consistent. For practical purposes, round protein up when aiming to build muscle and round carbs down on keto; a gram or two either way is nutritionally negligible.' },
    ],
    tips: [
      'The check line is a built-in audit — if the derived calories differ wildly from your input, your target has a typo.',
      'The stacked bar reads left to right as protein, carbs, fat, so the visual matches the stats.',
      'Reset to defaults restores 2000 calories and the Balanced preset in one click.',
      'Switch diet presets on the same calorie target to see how dramatically keto shifts the gram totals.',
    ],
  },
  // ── water-intake-calculator ──

  'water-intake-calculator': {
    intro:
      'The Water Intake Calculator turns your body weight, daily activity, and climate into a personalized daily hydration target in seconds. Whether you train in a humid gym or work in an air-conditioned office, knowing how much water to drink per day removes the guesswork from one of the simplest and most overlooked parts of health management. The tool applies the common 35 ml per kilogram guideline, adds 350 ml for every 30 minutes of activity you log, and applies a climate adjustment of +500 ml in hot or humid conditions or minus 200 ml in cold ones. Results appear live as three figures: your total daily water need in millilitres, the same volume in litres, and an equivalent number of 250 ml cups, which makes it easy to translate the science into a water bottle you actually own. Because the estimate includes water from beverages and food, it works as a daily drinking target rather than a strict medical prescription. Anyone who has ever wondered whether they are chronically under-hydrated can use it as a fast, transparent baseline to compare against their current drinking habits.',
    examples: [
      { input: 'Weight 70 kg, activity 30 minutes, climate Temperate', output: 'Daily water need 2,800 ml (2.80 L, 11.2 cups)', note: '70 x 35 = 2,450 ml base plus 1 x 350 ml activity (floor(30/30) = 1) equals 2,800 ml; climate adds 0. Cups: 2,800 / 250 = 11.2.' },
      { input: 'Weight 154 lb, activity 90 minutes, climate Hot / Humid', output: 'Daily water need 3,995 ml (3.99 L, 16.0 cups)', note: '154 lb converts to 69.85 kg; base is 69.85 x 35 = 2,444.9 ml, plus 3 x 350 = 1,050 ml activity (floor(90/30) = 3), plus +500 ml hot adjustment, totalling 3,994.9 ml, displayed rounded as 3,995 ml.' },
      { input: 'Weight 60 kg, activity 15 minutes, climate Cold', output: 'Daily water need 1,900 ml (1.90 L, 7.6 cups)', note: 'Base is 60 x 35 = 2,100 ml; 15 minutes is below one full block, so floor(15/30) = 0 activity adds nothing; the cold adjustment subtracts 200 ml, giving 1,900 ml.' },
    ],
    howTo: [
      'Enter your body weight in the Weight field and use the kg / lb toggle to pick the matching unit.',
      'Type how many minutes of physical activity you do on an average day into the Activity field.',
      'Open the Climate dropdown and choose Temperate, Hot / Humid, or Cold.',
      'Read the three result cards — Daily water need, In liters, and In cups (250 ml) — which update as you type.',
      'Check the "How this is calculated" card to see the exact base, activity, and climate figures behind your total.',
    ],
    useCases: [
      'Setting a hydration goal for marathon training weeks when long runs raise your sweat losses.',
      'Adjusting drinking habits for a holiday in a hot or humid destination.',
      'Translating a generic health-app target into the number of 250 ml glasses to finish by bedtime.',
      'Estimating how much water an outdoor labour crew should have available on a summer shift.',
      'Comparing your actual daily intake against a body-weight-based recommendation during a weight-loss plan.',
      'Planning fluid logistics for hiking or backpacking trips where water must be carried.',
    ],
    bestPractices: [
      'Treat the result as a guideline, not a clinical prescription — thirst and urine colour remain the best personal hydration checks.',
      'Count all beverages and water-rich foods toward the total, since the estimate is inclusive of both.',
      'Re-check your activity estimate: minutes are credited in whole 30-minute blocks, so 29 minutes counts as zero.',
      'Switch between kg and lb carefully — the toggle converts pounds with the factor 0.45359237, but mixing units in your head invites errors.',
      'Re-evaluate on hot days: the +500 ml climate adjustment is a flat add, so very long heat exposure may call for more.',
      'If the calculator shows a need far above your current intake, increase gradually over several days rather than in one sitting.',
    ],
    faqs: [
      { q: 'Does this include water from food?', a: 'Yes. The 35 ml per kilogram base is a total-water guideline, so your result covers water in beverages and food, not just what you pour in a glass. Most people get roughly 20 to 25 percent of daily fluid from food such as fruit, vegetables, and soups, which means your actual drinking target can be slightly below the displayed total.' },
      { q: 'Why does cold climate reduce my water need?', a: 'The calculator subtracts 200 ml in cold conditions because lower temperatures typically reduce sweat losses, especially for people who spend most of the day indoors or at low intensity. If you still train hard in the cold or wear heavy layers that make you sweat, keep the Temperate setting instead so the estimate is not understated.' },
      { q: 'How is activity counted if I exercise 45 minutes?', a: 'Activity is credited in whole 30-minute blocks, so 45 minutes counts as one block (350 ml) and 60 minutes counts as two blocks (700 ml). The maths uses the floor of minutes divided by 30. If you regularly train 45 to 50 minutes, consider rounding up to 60 to avoid under-hydrating.' },
      { q: 'Should athletes use the same formula?', a: 'Athletes training hard in heat often exceed the generic guideline because sweat rates vary widely, and the tool adds at most 350 ml per 30 minutes regardless of intensity. Use the output as a floor, then top up based on weigh-ins before and after workouts or on thirst and urine colour during training blocks.' },
      { q: 'What if I weigh 200 lb?', a: 'Switch the unit toggle to lb and enter 200. The tool converts your weight to about 90.7 kg, giving a base of roughly 3,175 ml before activity and climate adjustments are added. The conversion uses the exact factor 0.45359237, so the result is the same whether you enter 200 lb or 90.7 kg.' },
      { q: 'Can I drink too much water?', a: 'Yes, excessive intake can dilute blood sodium in a rare but serious condition called hyponatremia. The calculator shows a daily need, not a maximum. Spread intake across the day, and if your total climbs far above the estimate because of extreme endurance events, replace some plain water with electrolyte drinks.' },
    ],
    tips: [
      'Use the 250 ml cups figure to fill a labelled bottle once in the morning and track refills instead of sips.',
      'Re-run the calculator in July and January — many people need very different intakes between seasons.',
      'Treat the activity input as your average over a full week, not your best training day.',
      'If the total looks too high to start with, aim for a 200 to 300 ml daily increase until you reach the target.',
    ],
  },
  // ── retirement-calculator ──

  'retirement-calculator': {
    intro:
      'Retirement planning often stalls on one question: how much will I actually have? The Retirement Calculator answers it by projecting your savings forward year by year using monthly compounding, and it is built for people who want a clear, honest picture of their money at retirement rather than a rosy slogan. You enter your current age, target retirement age, current savings, monthly contribution, expected annual return, and an inflation assumption. The tool then computes the years to retirement, the future value of your existing lump sum, the future value of your ongoing contributions, the combined nominal balance, total contributions, and total interest earned. A separate inflation-adjusted figure discounts that future balance back into today\'s purchasing power, which is usually the number that matters most when you are deciding whether your savings rate is enough. A year-by-year table shown every five years plus the final year lets you watch compounding do its work, and a one-click CSV export preserves the full projection for your records or a meeting with your financial advisor.',
    examples: [
      { input: 'Age 30 to 65, $25,000 saved, $500/month, 7% return, 3% inflation', output: '35 years to retirement; $1,188,181 nominal; $422,260 inflation-adjusted; $953,181 total interest', note: '35 years = 420 monthly periods at 7%/12 = 0.5833% per month. The lump sum compounds to about $287,700 and the $500 deposits accumulate to about $900,500, totalling $1,188,181. Contributions of $235,000 are subtracted, leaving $953,181 of interest; dividing by the 1.03^35 inflation factor (2.8139) gives $422,260 in today\'s dollars.' },
      { input: 'Age 40 to 60, $100,000 saved, $1,000/month, 6% return, 2.5% inflation', output: '20 years to retirement; $793,061 nominal; $483,982 inflation-adjusted; $453,061 total interest', note: '20 years = 240 months at 0.5% per month. The $100,000 compounds to about $331,000 and the $1,000 monthly deposits to about $462,000, totalling $793,061. Contributions total $340,000, so interest is $453,061; discounted by 1.025^20 = 1.6386, the real value is $483,982.' },
      { input: 'Age 25 to 55, $0 saved, $300/month, 8% return, 3.5% inflation', output: '30 years to retirement; $447,108 nominal; $159,295 inflation-adjusted; $339,108 total interest', note: '30 years = 360 months at 0.6667% per month; the $300 annuity grows to $447,108. Contributions total $108,000, so interest is $339,108; discounted by 1.035^30 = 2.8068, the real value is $159,295.' },
    ],
    howTo: [
      'Enter your Current age and Retirement age in years — the Years to retire field fills itself automatically.',
      'Fill in Current savings and Monthly contribution in US dollars.',
      'Set Expected annual return and Inflation as annual percentages; 7 and 3 are the defaults.',
      'Read the four headline stats: years to retirement, future value, inflation-adjusted value, and total interest earned.',
      'Scroll the year-by-year projection table (every five years plus the final year) and use Export CSV to download it.',
    ],
    useCases: [
      'Checking whether a planned 401(k) contribution rate closes the gap to a target retirement balance.',
      'Modelling the trade-off between retiring at 62 versus 67 before telling your employer.',
      'Estimating the retirement value of a windfall lump sum such as a bonus or inheritance invested today.',
      'Comparing a 6% conservative and an 8% optimistic return assumption side by side.',
      'Setting an inflation-adjusted savings goal in today\'s dollars instead of misleading future dollars.',
      'Preparing a year-by-year balance printout to review with a financial planner.',
    ],
    bestPractices: [
      'Stress-test with several return assumptions — the difference between 5% and 8% over 30 years is enormous and the calculator makes it one keystroke to compare.',
      'Pay most attention to the inflation-adjusted figure, since nominal balances overstate what your money will actually buy.',
      'Keep inflation and returns as separate inputs; subtracting one from the other in your head gives a worse approximation than the tool\'s real-value math.',
      'Remember contributions are assumed monthly and returns credited monthly — the projection is an estimate, not a guarantee.',
      'Use the CSV export to keep a dated copy of your assumptions, so you can re-run the same scenario next year with fresh numbers.',
      'Spot-check the first table row: year 1 should roughly equal savings plus 12 contributions plus about one year of interest.',
    ],
    faqs: [
      { q: 'What does the inflation-adjusted value actually mean?', a: 'It is the projected balance divided by the cumulative inflation factor, expressed in today\'s purchasing power. A nominal $1.19 million in 35 years at 3% inflation buys what about $422,000 buys today. This figure keeps you from overestimating how wealthy you will be, because goods and services will cost more by then.' },
      { q: 'How is interest calculated on my contributions?', a: 'Each monthly contribution is added to the balance before the next month\'s return is applied, so every deposit compounds for as many months as remain until retirement. The formula used is the annuity future value: contribution x ((1 + monthly rate)^months - 1) / monthly rate. Contributions near the end earn very little interest; early ones earn the most.' },
      { q: 'Can I enter my employer match?', a: 'Yes — add your match to the monthly contribution. If you contribute $500 and your employer matches 50% ($250), enter $750 in the Monthly contribution field. Keep in mind the tool applies the same return to all contributions, so it does not model vesting schedules or match caps separately.' },
      { q: 'Why does the table show only some years?', a: 'To keep the display readable, the projection shows the starting row, every fifth year, and always the final year. The full year-by-year series, including all intermediate years, is included in the CSV export, so download it if you want the complete balance history for every single year.' },
      { q: 'What if my returns are negative?', a: 'The calculator will still run the projection and show the balance shrinking, because the return input accepts any number, including negative annual percentages. This can be a useful stress test, but remember it applies the same negative rate every month, which is pessimistic even for bear markets, so treat it as a worst-case illustration.' },
      { q: 'Does it include Social Security or pensions?', a: 'No. The projection covers only the savings and contributions you enter, so employer matches and future benefits must be added by hand. If you want the full picture, estimate your pension separately and compare its expected monthly payment with what your projected balance could sustainably withdraw.' },
    ],
    tips: [
      'Re-run the scenario three times with 5%, 7%, and 9% returns to see your plausible range.',
      'Bump the inflation input to 4% for a conservative view of future purchasing power.',
      'Export the CSV after each scenario and name it by assumptions so you can compare later.',
      'Use the final-year age column to double-check that retirement age and projection end year line up.',
    ],
  },
  // ── roi-calculator ──

  'roi-calculator': {
    intro:
      'Return on investment is the language every investor and business owner eventually has to speak, and the ROI Calculator makes it fluent. Feed it three numbers — the initial investment, the final value, and the time period in years — and it instantly returns the total ROI percentage, the annualized growth rate known as CAGR, the total profit in dollars, and the investment multiple. Those four figures answer different questions: total ROI tells you whether the deal made money, profit tells you how much in absolute terms, the multiple expresses the same growth as a ratio such as 1.8x, and CAGR converts the whole journey into one comparable per-year rate. That annualized view is where the calculator earns its keep, because an 80% return over five years sounds dramatic until you realize it is about 12.5% per year, while the same 80% in a single year is outstanding. The tool updates live as you type, colour-codes profits green and losses red, and shows every formula with your own numbers plugged in, so you can trust or verify the arithmetic at a glance.',
    examples: [
      { input: 'Initial investment $10,000, final value $18,000, time period 5 years', output: 'ROI 80.00%, CAGR 12.47%, total profit $8,000.00, multiple 1.80×', note: '(18,000 - 10,000) / 10,000 x 100 = 80.00%. CAGR = (18,000 / 10,000)^(1/5) - 1 = 1.8^0.2 - 1 = 12.4746%, shown as 12.47%. Profit is 18,000 - 10,000 = 8,000 and the multiple is 18,000 / 10,000 = 1.80×.' },
      { input: 'Initial investment $5,000, final value $4,000, time period 2 years', output: 'ROI -20.00%, CAGR -10.56%, total profit -$1,000.00, multiple 0.80×', note: '(4,000 - 5,000) / 5,000 x 100 = -20.00%. CAGR = 0.8^(1/2) - 1 = -10.5573%, shown as -10.56%. Both figures turn red to flag the loss.' },
      { input: 'Initial investment $20,000, final value $50,000, time period 10 years', output: 'ROI 150.00%, CAGR 9.60%, total profit $30,000.00, multiple 2.50×', note: '(50,000 - 20,000) / 20,000 x 100 = 150.00%. CAGR = 2.5^(1/10) - 1 = 9.5958%, shown as 9.60%. Profit is $30,000 and the multiple is 2.50×.' },
    ],
    howTo: [
      'Enter the Initial investment in the first field (USD).',
      'Enter the Final value of the investment in the second field.',
      'Enter the Time period in years, supporting decimals such as 2.5.',
      'Read ROI (total), Annualized (CAGR), Total profit, and Multiple in the four result cards.',
      'Expand the Formulas card to see each calculation resolved with your own numbers.',
    ],
    useCases: [
      'Comparing a rental property\'s five-year return against an index fund before reinvesting.',
      'Putting two startup exit projections on a common annualized basis before choosing one.',
      'Reporting a marketing campaign\'s year-one performance to a client in percentage and dollar terms.',
      'Converting a multi-year portfolio gain into a per-year rate for a financial review.',
      'Quantifying the cost of a losing trade in percentages so the lesson sticks.',
      'Checking whether a 60% total return over three years actually beats a savings account\'s annual rate.',
    ],
    bestPractices: [
      'Always read CAGR alongside total ROI — long holding periods inflate the total return while the annualized rate shows the true pace.',
      'Express every comparison in the same time unit, because the annualized number is meaningless if periods are mixed.',
      'Remember ROI ignores interim cash flows: dividends, rent, and additional deposits are not part of the two-value formula.',
      'Double-check the arithmetic in the Formulas card, which substitutes your own inputs into each equation.',
      'Treat losses as valid inputs — the tool deliberately accepts final values below the initial investment and shows them in red.',
      'Use the multiple for quick mental checks (1.5x, 2x, 3x) and reserve precise percentages for reporting.',
    ],
    faqs: [
      { q: 'What is the difference between ROI and CAGR?', a: 'ROI is the total percentage gain over the whole holding period, while CAGR annualizes it into a steady per-year rate as if growth were perfectly smooth. $10,000 growing to $18,000 is an 80% ROI, but over 5 years that equals 12.47% per year. CAGR lets you compare investments held for different lengths of time on equal footing.' },
      { q: 'Can the time period be a fraction?', a: 'Yes. The Time period input accepts decimals such as 1.5 or 0.75, and the CAGR formula raises the final-to-initial ratio to the reciprocal of the period. For a deal held 18 months, enter 1.5 rather than rounding to a whole year, since rounding noticeably distorts the annualized result.' },
      { q: 'Why is my multiple less than 1x?', a: 'A multiple below 1x means the final value is lower than the initial investment — you lost money. The multiple is simply final divided by initial, so 0.8x means you kept 80 cents of every dollar invested. The tool also reports the same loss as a negative ROI and a negative CAGR in red.' },
      { q: 'Does ROI account for inflation or taxes?', a: 'No. The calculation uses only the two dollar amounts and the period. To see inflation-adjusted results, compare the CAGR against an inflation figure such as 3% — a 5% CAGR with 3% inflation grows real purchasing power by only about 2% per year. Taxes on the gain would also reduce the true net return.' },
      { q: 'What happens if I enter zero as the initial investment?', a: 'The tool requires a positive initial investment because both ROI and CAGR divide by it; dividing by zero is undefined. No results appear until the initial amount is greater than zero. A final value of zero is allowed, and yields a total loss of 100% with a multiple of 0.00x.' },
      { q: 'Is CAGR the same as the average annual return?', a: 'Not exactly. An arithmetic average of yearly returns can be inflated by volatile years, whereas CAGR is the single constant rate that would produce the same end value, also called the geometric mean return. For example, gaining 100% one year and losing 50% the next averages 25% but has a true CAGR of 0%.' },
    ],
    tips: [
      'Enter 1 as the period to see a one-year return before committing to a longer model.',
      'Use decimal years for odd holding periods — 14 months is about 1.17 years.',
      'Compare the tool\'s CAGR against a benchmark index\'s long-term rate rather than judging returns in isolation.',
      'Hit Reset to defaults to return to the worked example and recalibrate your expectations.',
    ],
  },
  // ── savings-calculator ──

  'savings-calculator': {
    intro:
      'The Savings Calculator projects how a nest egg grows under compound interest with regular monthly contributions, and it does so with an unusual level of control: six compounding frequencies, from annual down to daily. You start from an initial deposit, add a monthly contribution, set an annual interest rate and a number of years, then pick how often interest is credited. The calculator returns the final balance, your total contributions, and the total interest earned, along with a year-by-year table showing balance, contributions, and accumulated interest at the end of each year. The monthly contribution is converted to the chosen compounding period automatically — $200 a month becomes $600 per quarter or $2,400 a year — and every period earns interest before the next deposit lands. This makes it easy to answer the practical questions savers actually ask: how much faster does daily compounding grow than annual, how much of my final balance is my own money versus the bank\'s, and what difference does an extra $100 a month make over a decade.',
    examples: [
      { input: 'Initial deposit $5,000, monthly contribution $200, annual rate 5%, 10 years, compounding Monthly', output: 'Final balance $39,291.50, total contributions $29,000.00, total interest $10,291.50', note: 'Rate per period is 5%/12 = 0.4167%. The $5,000 grows to 5,000 x (1.0041667)^120 = $8,235.05 and the $200 deposits accumulate to 200 x ((1.0041667)^120 - 1)/0.0041667 = $31,056.44, totalling $39,291.50. Contributions are 5,000 + 120 x 200 = 29,000, so interest is $10,291.50.' },
      { input: 'Initial deposit $0, monthly contribution $500, annual rate 3%, 5 years, compounding Daily', output: 'Final balance $32,365.42, total contributions $30,000.00, total interest $2,365.42', note: 'Daily rate is 3%/365 and each day earns interest before the next $16.44 deposit lands (500 x 12 / 365). After 1,825 periods the balance is $32,365.42 against $30,000 contributed, leaving $2,365.42 of interest.' },
      { input: 'Initial deposit $10,000, monthly contribution $0, annual rate 7%, 8 years, compounding Annually', output: 'Final balance $17,181.86, total contributions $10,000.00, total interest $7,181.86', note: 'One compounding period per year: 10,000 x 1.07^8 = $17,181.86. With zero monthly contributions the entire $7,181.86 gain is interest — a clean demonstration of pure compounding.' },
    ],
    howTo: [
      'Enter the Initial deposit and Monthly contribution in the first two fields (USD).',
      'Set the Annual interest rate as a percentage and the number of Years.',
      'Choose a Compounding option from the dropdown: Annually, Semiannually, Quarterly, Monthly, Weekly, or Daily.',
      'Read Final balance, Total contributions, and Total interest earned in the result cards.',
      'Inspect the Yearly growth table for end-of-year balances, or click Export CSV to save it.',
    ],
    useCases: [
      'Modelling a high-yield savings account with daily compounding against a bond that pays annually.',
      'Working out how much of a 10-year certificate\'s final balance will be interest before locking the rate.',
      'Testing whether adding $100 per month to an emergency fund meaningfully shortens a savings goal.',
      'Showing a teenager the difference between starting to save at 18 and starting at 30.',
      'Comparing the same 5% rate across monthly, weekly, and daily compounding before choosing an account.',
      'Projecting an education fund\'s growth to see whether current deposits cover future tuition.',
    ],
    bestPractices: [
      'Compare compounding frequencies with identical inputs — small differences at 3% compound into real money over decades.',
      'Separate the final balance into contributions and interest so you never mistake your own deposits for growth.',
      'Replace the 5% default with your actual APY; typical high-yield accounts pay far less, and realism keeps projections honest.',
      'Remember the yearly table includes the starting position as year 0, so a 10-year run ends at year 10.',
      'Export the CSV before changing assumptions so you can stack several scenarios side by side in a spreadsheet.',
      'Spot-check the first table row: after one year the balance should roughly equal the deposit plus 12 contributions plus half a year of interest.',
    ],
    faqs: [
      { q: 'Does more frequent compounding really make a big difference?', a: 'It helps most with large balances, long horizons, and higher rates. At 5% over 10 years, annual compounding of a $5,000 deposit yields $8,144 while monthly yields $8,235 — meaningful but not life-changing. The gap widens over 30 years or with bigger sums, so use the dropdown to quantify it for your own scenario rather than relying on intuition.' },
      { q: 'How are my monthly contributions timed?', a: 'The monthly contribution is converted to the compounding period, so $200 a month becomes $600 per quarter under quarterly compounding and $2,400 per year under annual compounding. Each per-period deposit is added before that period\'s interest is credited, matching the common assumption of deposits at the start of each period.' },
      { q: 'Why is my total interest negative in the early years?', a: 'It should not be — interest is the balance minus contributions, and both start at your initial deposit in year 0. If your rate is negative the balance can fall below contributions, producing a negative interest figure. Otherwise verify the rate input contains a percent value such as 5, not 0.05, since the tool interprets the field as a percentage.' },
      { q: 'Can I use this for loan repayment instead?', a: 'Not directly, because the calculator models money growing with deposits, not a balance shrinking with payments; use the loan calculator for that. However, you can run the savings tool to see what the same monthly payment would grow to if saved, which is useful when comparing paying off debt against investing.' },
      { q: 'What rate should I enter for a savings account?', a: 'Enter the account\'s annual percentage yield, or APY, which already includes the effect of compounding. Note that entering the APY together with a frequent compounding option slightly double-counts, but the difference is negligible at normal savings rates. For bonds or certificates of deposit, enter the stated annual rate and the actual compounding frequency from the terms.' },
      { q: 'Why does the table show a zero year?', a: 'Year 0 is your starting position: the initial deposit before any interest. The first computed row is year 1, which already includes twelve months of compounding and deposits. This lets you see the full journey from start to finish, including the untouched principal at the beginning.' },
    ],
    tips: [
      'Switch the compounding dropdown through all six options once and watch the final balance tick up.',
      'Enter your real APY instead of the default 5% to keep projections grounded.',
      'Use the interest column to answer how much the bank paid you versus what you put in.',
      'Keep contributions at zero to isolate the pure effect of compounding on your lump sum.',
    ],
  },
  // ── break-even-calculator ──

  'break-even-calculator': {
    intro:
      'The Break-Even Calculator answers the most practical question in small business: how many units do I need to sell before I stop losing money? It does the classic cost-volume-profit arithmetic in real time — fixed costs, price per unit, and variable cost per unit go in, and the break-even point in units, break-even revenue, contribution margin per unit, and contribution margin ratio come out. The contribution margin, price minus variable cost, is the engine of the whole calculation: it is what each sale contributes toward covering fixed costs, and once fixed costs are covered, every additional unit is pure operating profit at that margin. The tool rounds the break-even unit count up to the next whole unit, which is the honest way to express a threshold you can never half-cross. It also guards against nonsense inputs with clear status badges — if your price is at or below variable cost, it tells you flat out that the business cannot break even at any volume, instead of quietly printing a negative number.',
    examples: [
      { input: 'Fixed costs $10,000, price per unit $50, variable cost $30', output: 'Break-even 500 units, revenue $25,000.00, contribution margin $20.00 per unit, CM ratio 40.0%', note: 'Contribution margin is 50 - 30 = $20 per unit, and 10,000 / 20 = 500 units. Revenue is 500 x 50 = $25,000. The ratio is 20 / 50 x 100 = 40%, meaning 40 cents of every sales dollar covers fixed costs and profit.' },
      { input: 'Fixed costs $5,000, price per unit $12, variable cost $7', output: 'Break-even 1,000 units, revenue $12,000.00, contribution margin $5.00 per unit, CM ratio 41.7%', note: 'Margin is 12 - 7 = $5, so 5,000 / 5 = 1,000 units. Revenue is 1,000 x 12 = $12,000. Ratio: 5 / 12 x 100 = 41.6667%, displayed as 41.7%.' },
      { input: 'Fixed costs $2,000, price per unit $8, variable cost $10', output: 'Break-even shows a dash; status badge reads "Loss-making at every volume"', note: 'The contribution margin is 8 - 10 = -$2, so each unit sold loses $2 before fixed costs. The calculator detects the negative margin and shows an amber warning instead of a meaningless negative unit count.' },
    ],
    howTo: [
      'Enter Fixed costs in US dollars — rent, salaries, and other expenses that do not change with volume.',
      'Enter the Price per unit in US dollars — what the customer pays per item.',
      'Enter the Variable cost per unit in US dollars — materials and labour that scale with each sale.',
      'Read the four stats: Break-even (units), Break-even revenue, Contribution margin / unit, and Contribution margin ratio.',
      'Check the Status badge for a plain-language verdict on whether the pricing can break even.',
    ],
    useCases: [
      'Deciding whether a $50 price point for a new product covers costs before launch.',
      'Setting a monthly sales quota for a bakery whose rent and staff costs are fixed.',
      'Evaluating a supplier price increase by recalculating the new break-even volume.',
      'Pricing a subscription service by testing several price points against the same costs.',
      'Preparing an investor pitch with contribution margin ratio as a headline unit-economics metric.',
      'Spotting that a product priced below variable cost is destroying value at every sale.',
    ],
    bestPractices: [
      'Classify costs honestly: rent is fixed, but a wage tied to output is variable — misclassification shifts your break-even point.',
      'Always check the contribution margin before the break-even count; a negative or zero margin means the exercise is over.',
      'Remember the tool rounds units up, so 333.3 units shows as 334 — you cannot sell a third of a unit.',
      'Treat break-even as a floor, not a goal: covering costs is not the same as earning an acceptable profit.',
      'Re-run the calculation after any price or supplier change, since both move the break-even point more than most owners expect.',
      'Use the CM ratio as a quick cross-product check — the higher it is, the more each sales dollar contributes to profit.',
    ],
    faqs: [
      { q: 'Why is my break-even point in units rounded up?', a: 'Because you cannot sell a fraction of a unit, the calculator rounds 333.3 up to 334. Selling 333 units would leave you slightly short of covering fixed costs, so the ceiling is the correct answer. The break-even revenue shown is then the rounded unit count multiplied by the price, which may be a few dollars above the exact threshold.' },
      { q: 'What happens if price equals variable cost?', a: 'The contribution margin becomes zero, meaning every unit sold contributes nothing toward fixed costs. The calculator shows an amber warning explaining that price equals variable cost and that breaking even is impossible unless fixed costs are also zero. The only fixes are raising the price or lowering the variable cost per unit.' },
      { q: 'What counts as a fixed cost versus variable?', a: 'Fixed costs stay constant regardless of how much you sell — rent, insurance, salaried staff. Variable costs rise with each unit — raw materials, packaging, sales commissions, shipping. Some costs are mixed, like electricity, which has a fixed base plus a usage component; put the fixed part in fixed costs and the per-unit part in variable cost.' },
      { q: 'Can I use it for services rather than products?', a: 'Yes. Treat one billable engagement, appointment, or subscription as a unit. The price is what you charge per engagement and the variable cost is what delivering one costs in wages, materials, or software licences. The break-even figure then tells you how many clients or appointments per period you need to cover overheads.' },
      { q: 'Does the calculator include taxes or interest?', a: 'No. The break-even model works with operating figures only. Interest on business loans can be added to fixed costs if you want a cash break-even point, and income taxes are typically excluded because the concept focuses on the operating profit of zero. Adjust the inputs to match the question you are trying to answer.' },
      { q: 'Is break-even revenue the same as the sales target?', a: 'Only if your goal is exactly zero profit. Break-even revenue is the revenue level where total costs are covered, and every dollar above it generates profit at the contribution margin ratio. For an actual target, decide the profit you want, divide it by the CM ratio, and add that to break-even revenue.' },
    ],
    tips: [
      'Run the numbers for three price points — cost-plus, market, and premium — and compare the unit counts.',
      'If break-even units look impossible, attack fixed costs first; a 10% rent cut lowers the bar directly.',
      'Use the status badge as a one-glance sanity check before presenting figures to anyone.',
      'After each quarter, refresh the inputs with actual costs to see how the threshold moved.',
    ],
  },
  // ── profit-margin-calculator ──

  'profit-margin-calculator': {
    intro:
      'The Profit Margin Calculator works in two directions, which is what makes it more than a glorified division. In Forward mode you enter revenue and cost, and it returns profit, margin percentage, and markup percentage — the two percentages people constantly confuse. Margin measures profit against revenue, while markup measures the same profit against cost, so $300 of profit on a $1,000 sale is a 30% margin but a 42.9% markup, and mixing them up in pricing discussions causes real pricing errors. In Reverse mode the calculator flips the question: give it the revenue and a desired margin, and it tells you the maximum cost you can afford, plus the implied profit and markup. That is the mode for buyers, manufacturers, and anyone who must back a pricing decision out of a target. Both modes update live, show the formulas with your own numbers substituted, and include a reset button that restores the defaults — small conveniences that keep a quick pricing conversation from becoming a spreadsheet session.',
    examples: [
      { input: 'Forward mode: revenue $1,000, cost $700', output: 'Profit $300.00, margin 30.00%, markup 42.86%', note: 'Profit = 1,000 - 700 = $300. Margin = 300 / 1,000 x 100 = 30.00%. Markup = 300 / 700 x 100 = 42.8571%, displayed as 42.86%.' },
      { input: 'Forward mode: revenue $250, cost $200', output: 'Profit $50.00, margin 20.00%, markup 25.00%', note: 'Profit = 250 - 200 = $50. Margin = 50 / 250 x 100 = 20.00%. Markup = 50 / 200 x 100 = 25.00%. The classic retail example: a 25% markup produces only a 20% margin.' },
      { input: 'Reverse mode: revenue $5,000, desired margin 25%', output: 'Required cost $3,750.00, implied profit $1,250.00, implied markup 33.33%', note: 'Cost = 5,000 x (1 - 25/100) = $3,750. Profit = 5,000 - 3,750 = $1,250. Markup = 1,250 / 3,750 x 100 = 33.3333%.' },
    ],
    howTo: [
      'Choose a mode with the Forward / Reverse tabs at the top of the tool.',
      'In Forward mode, enter Revenue and Cost, then read Profit, Margin, and Markup.',
      'In Reverse mode, enter Revenue and the Desired margin percentage, then read Required cost, Implied profit, and Implied markup.',
      'Check the Formulas card below the stats to see each equation resolved with your numbers.',
      'Click Reset to defaults to restore the worked example values at any time.',
    ],
    useCases: [
      'Pricing a wholesale order so the retail markup on your goods lands at the margin you promised investors.',
      'Working backwards from a client\'s $5,000 budget to the maximum production cost at 25% margin.',
      'Settling a margin-versus-markup argument between a sales team and an accountant.',
      'Checking whether a 50% discount promotion still clears your minimum margin.',
      'Setting a floor price for freelance work based on the margin you need after costs.',
      'Comparing the true profitability of two products with different costs but the same selling price.',
    ],
    bestPractices: [
      'Never state a percentage without saying whether it is margin or markup — the tool gives you both so you can quote the right one.',
      'Use Reverse mode when a target margin is fixed; guessing costs and iterating in Forward mode wastes time.',
      'Remember margin is capped at 100% while markup is unbounded, which is why the two numbers drift apart as profitability rises.',
      'Keep revenue above zero — the calculator requires a positive revenue to compute percentages, and dividing by zero is meaningless.',
      'Double-check that cost includes everything: materials, labour, fees, and delivery, or your margin will be flattering but wrong.',
      'When costs change, re-run both directions to see whether the margin target is still achievable at the same price.',
    ],
    faqs: [
      { q: 'Why is markup always higher than margin?', a: 'Both divide the same profit, but margin divides by revenue and markup divides by cost, and cost is smaller whenever there is any profit. $300 of profit on a $1,000 sale is 30% of revenue but 42.86% of the $700 cost. The gap widens as margins rise: a 50% margin corresponds to a 100% markup, because profit then equals cost.' },
      { q: 'What is the Reverse mode actually for?', a: 'Reverse mode answers how much you can afford to spend. Given the revenue and a target margin, it computes the maximum cost that achieves that margin, plus the implied profit and markup. Sellers use it to negotiate with suppliers, and buyers use it to test whether a quoted price fits the margin their business needs.' },
      { q: 'Can a profit margin exceed 100 percent?', a: 'No. Margin is profit divided by revenue, and profit cannot exceed revenue when costs are non-negative, so the highest possible margin is 100%, which would require zero cost. Markup, in contrast, has no upper bound: a product bought for $1 and sold for $10 shows a 90% margin but a 900% markup.' },
      { q: 'Does the calculator work for service businesses?', a: 'Yes, if you define cost as the direct cost of delivering the service, such as contractor fees, materials, and software subscriptions. Overheads like rent and admin are usually excluded from this simple two-number view, so treat the resulting margin as a contribution margin rather than a fully loaded net margin.' },
      { q: 'What if my cost is zero?', a: 'In Forward mode a zero cost gives a margin of 100%, and markup is shown as a dash because dividing profit by zero is undefined. The tool handles this gracefully, but in practice cost is rarely exactly zero — even digital products have hosting, support, and marketing costs you should include to keep the margin honest.' },
      { q: 'How do I use this to set a selling price?', a: 'Two routes. Forward mode lets you test a candidate price against known cost and see the margin it produces. Reverse mode is quicker when the margin is the target: enter the price you plan to charge and the margin you want, and read the maximum cost you can afford — then negotiate your costs down to it.' },
    ],
    tips: [
      'Flip between Forward and Reverse without retyping — the tabs keep both sets of inputs in memory.',
      'Memorize one anchor pair: 20% margin equals 25% markup, a fast way to catch pricing mistakes in meetings.',
      'Test a sale price 10% lower in Forward mode to see how badly it bruises the margin.',
      'Use the reset button before a new session so stale numbers never sneak into a decision.',
    ],
  },
  // ── inflation-calculator ──

  'inflation-calculator': {
    intro:
      'The Inflation Calculator shows in hard numbers what everyone feels: money quietly loses its buying power. Enter an amount in today\'s dollars, a start year, an end year, and an assumed annual inflation rate, and the tool computes three things — the future value you would need in nominal dollars to preserve today\'s purchasing power, the real purchasing power your amount would have if it just sat in cash, and the inflation factor that connects the two. The formulas are symmetrical: future value multiplies by (1 + rate) for each year, while real value divides by the same factor, and the calculator prints both formulas below the results so the logic is never hidden. Validation messages catch the common mistakes before they corrupt a result — negative rates, end years before start years, and non-integer years are all rejected with a specific message. For long-term planning questions like whether a pension will keep pace with prices or how much a child\'s education will cost in future dollars, this single calculation is often the missing first step.',
    examples: [
      { input: 'Initial amount $1,000, start year 2026, end year 2036, annual inflation 3%', output: 'Future value $1,343.92, real purchasing power $744.09, inflation factor 1.3439×', note: 'Factor = 1.03^10 = 1.343916, displayed as 1.3439×. Future value = 1,000 x 1.343916 = $1,343.92. Real value = 1,000 / 1.343916 = $744.09.' },
      { input: 'Initial amount $5,000, start year 2000, end year 2025, annual inflation 2.5%', output: 'Future value $9,269.72, real purchasing power $2,696.95, inflation factor 1.8539×', note: 'Factor = 1.025^25 = 1.853944, shown as 1.8539×. Future value = 5,000 x 1.853944 = $9,269.72. Real value = 5,000 / 1.853944 = $2,696.95.' },
      { input: 'Initial amount $100, start year 2025, end year 2050, annual inflation 5%', output: 'Future value $338.64, real purchasing power $29.53, inflation factor 3.3864×', note: 'Factor = 1.05^25 = 3.386355, shown as 3.3864×. Future value = 100 x 3.386355 = $338.64. Real value = 100 / 3.386355 = $29.53.' },
    ],
    howTo: [
      'Enter the Initial amount in today\'s dollars.',
      'Set the Start year and End year as whole years.',
      'Enter the Annual inflation rate as a percentage, for example 3.',
      'Read Future value, Real purchasing power, and Inflation factor in the result cards.',
      'Review the Explanation panel for a plain-language summary of what the numbers mean.',
    ],
    useCases: [
      'Working out how much a $50,000 college fund needs to grow to cover fees in 2035.',
      'Checking whether a fixed pension will still cover groceries in twenty years.',
      'Translating a long-term financial goal from future dollars into today\'s purchasing power.',
      'Explaining to a saver why cash under the mattress loses about half its value over a generation.',
      'Estimating the raise needed to keep pace with expected inflation without losing ground.',
      'Adjusting a business forecast so revenue targets are stated in real, comparable dollars.',
    ],
    bestPractices: [
      'Use a realistic long-run inflation assumption such as 2% to 3% rather than last year\'s spike, which tends to be temporary.',
      'Always look at the real purchasing power figure — it is the honest measure of what cash savings will be worth.',
      'Keep start and end years as whole numbers; the calculator rejects fractional years with a validation message.',
      'Remember the end year must be on or after the start year, or the tool shows an error instead of a factor below one.',
      'Treat the future value as a planning target, not a forecast — actual inflation never matches a single constant rate.',
      'When comparing across decades, note that small rate differences compound hugely; 3% over 30 years is very different from 5%.',
    ],
    faqs: [
      { q: 'What does real purchasing power tell me?', a: 'It tells you what an amount kept as cash will be worth in today\'s dollars at the end of the period. The calculator divides your amount by the inflation factor, so $1,000 held for ten years at 3% inflation buys what $744 buys today. It is the number to quote when explaining why holding too much cash is quietly expensive.' },
      { q: 'How is the inflation factor calculated?', a: 'The factor is (1 + rate/100) raised to the number of years between the start and end years. At 3% for 10 years that is 1.03^10 = 1.3439, meaning prices are expected to multiply by about 1.34. The future value multiplies your amount by this factor, and the real value divides by it.' },
      { q: 'Can I enter a negative inflation rate?', a: 'No. The calculator shows a validation message because the model assumes inflation of zero percent or more. Deflation does happen in some economies, but this tool is designed around the typical long-run erosion of purchasing power, and negative rates would invert the meaning of the two output figures.' },
      { q: 'Does it use official CPI data?', a: 'No. The calculator applies the single annual rate you enter, rather than looking up historical or forecast CPI tables. That makes it a scenario tool — perfect for sensitivity testing at 2%, 3%, or 4% — but if you need precise historical purchasing power figures, use a dataset such as the US Bureau of Labor Statistics CPI series.' },
      { q: 'Why are my years limited to whole numbers?', a: 'The formula raises the factor to a power equal to the number of years, and partial years fit poorly into that intuitive yearly model. The tool checks that both inputs are integers and shows a specific message otherwise. If you need a partial-year adjustment, round to the nearest year or interpolate the factor manually.' },
      { q: 'Should I use this for retirement planning?', a: 'Yes, in combination with a growth calculator. First run this tool to see the real value of a target nest egg, then compare it with what a retirement calculator projects you will accumulate. The inflation-adjusted figure here anchors every other projection in today\'s dollars, preventing the classic mistake of mistaking a big future number for wealth.' },
    ],
    tips: [
      'Run the same amount at 2%, 3%, and 4% to bracket the uncertainty in long-range plans.',
      'Use 25 years as a standard horizon — it spans roughly one generation and makes comparisons consistent.',
      'Let the Explanation panel do the talking when sharing results; it phrases the outcome in plain language.',
      'Reset the years to your current decade before each new scenario so stale dates do not skew the factor.',
    ],
  },
  // ── grade-calculator ──

  'grade-calculator': {
    intro:
      'The Grade Calculator computes a weighted final grade from a dynamic list of assignments, and it is honest about the mathematics that most students only guess at. Each row accepts an optional assignment name, a grade entered either as a percentage or as a letter, and a weight expressed as a percent of the course. The tool multiplies every valid grade by its weight, sums the products, and divides by the total weight of the rows you entered — so even if your weights do not sum to 100%, the final grade remains a correct weighted average rather than a distorted one. Letter grades map to fixed midpoints: A becomes 95, B becomes 85, C 75, D 65, and F 50, while the reverse conversion uses the classic cutoffs of 90, 80, 70, and 60. A live result panel shows the final percentage, its letter grade, and the total weight, with an amber warning when weights drift from 100%. Rows with invalid or non-positive weights are ignored in the calculation, and the tool says so.',
    examples: [
      { input: 'Homework 92% weight 20, Midterm 85% weight 30, Final 88% weight 50', output: 'Final grade 87.90 / 100, letter B, total weight 100.0%', note: '(92 x 20) + (85 x 30) + (88 x 50) = 1,840 + 2,550 + 4,400 = 8,790; 8,790 / 100 = 87.90, which falls below 90, so the letter is B.' },
      { input: 'Essay letter A weight 40, Project letter B weight 35, Quiz letter C weight 25', output: 'Final grade 86.50 / 100, letter B, total weight 100.0%', note: 'Letters map to midpoints: A = 95, B = 85, C = 75. (95 x 40) + (85 x 35) + (75 x 25) = 3,800 + 2,975 + 1,875 = 8,650; 8,650 / 100 = 86.50, a B.' },
      { input: 'Test 45% weight 50, Quiz 55% weight 50', output: 'Final grade 50.00 / 100, letter F, total weight 100.0%', note: '(45 x 50) + (55 x 50) = 2,250 + 2,750 = 5,000; 5,000 / 100 = 50.00, below the 60 cutoff, so the letter is F.' },
    ],
    howTo: [
      'Review the three starter rows (Homework, Midterm, Final) or delete them with the trash icon.',
      'Click Add assignment to append a new row to the list.',
      'For each row, choose Percent or Letter in the Grade type dropdown and fill in the grade and Weight (%) fields.',
      'Watch the Final grade, Total weight, and Letter stats update live as you edit.',
      'Check the amber badge if it appears — it warns when your weights do not sum to 100%.',
    ],
    useCases: [
      'Calculating a mid-semester weighted average to see whether a B is still possible.',
      'Figuring out the minimum grade needed on a weighted final exam to hold an A.',
      'Handling mixed grading systems by entering some assignments as letters and others as percentages.',
      'Auditing a syllabus where the stated weights are missing or add up to less than 100%.',
      'Estimating a predicted grade before official results are released.',
      'Settling a dispute over a professor\'s grade math by replicating the weighted average.',
    ],
    bestPractices: [
      'Copy weights straight from the syllabus — the live total-weight stat will immediately flag any typos or missing categories.',
      'Prefer percentage inputs for precision; letter inputs snap to fixed midpoints that can understate an 89.5% borderline A.',
      'Keep weights summing to 100% for interpretability, even though the calculator still computes correctly otherwise.',
      'Delete rows you are not tracking rather than entering zeros, since non-positive weights are ignored but add clutter.',
      'Note that results are not saved between sessions, so screenshot or write down the final figure before closing the tab.',
      'Treat the letter conversion cutoffs as generic: many courses use plus/minus scales, so read the final letter as an estimate.',
    ],
    faqs: [
      { q: 'How does the calculator convert letter grades?', a: 'Each letter maps to a fixed midpoint: A = 95, B = 85, C = 75, D = 65, F = 50. Those midpoints are multiplied by the row\'s weight just like percentage grades. When the weighted average is converted back to a letter, the cutoffs are A at 90 and above, B at 80, C at 70, D at 60, and F below 60.' },
      { q: 'What if my weights do not add up to 100?', a: 'The calculator still produces a correct weighted average by dividing the weighted sum by the total of the weights you entered, and an amber badge reminds you of the mismatch. For example, weights totalling 90% give the same result as a syllabus where the remaining 10% is ungraded, but check the syllabus before relying on that interpretation.' },
      { q: 'Why did my final grade not change when I edited a row?', a: 'Most likely the row became invalid: the calculation ignores rows with a non-positive weight or a grade outside the 0 to 100 range. A weight of zero or a blank grade field removes the row from both the weighted sum and the total weight. Fix the row and the final grade updates immediately.' },
      { q: 'Can I mix letter and percent grades in one list?', a: 'Yes. Every row has its own Grade type dropdown, so you can enter a final exam as a percentage and a participation mark as a letter in the same calculation. Letter rows are converted to their midpoint percentage before weighting, and both types are treated identically in the weighted average.' },
      { q: 'Does it support plus and minus grades?', a: 'No. The dropdown offers only A, B, C, D, and F, each mapped to its midpoint. If your course uses B+, enter the precise percentage instead — that is the more accurate route anyway, since a B+ at 89% is meaningfully different from the 85% midpoint assigned to a plain B.' },
      { q: 'Are my assignments saved for later?', a: 'No, everything lives in the current page session. Refreshing the tab restores the three starter rows, so note your results or screenshot the final panel before closing. If you track grades across a semester, keep a spreadsheet as the source of truth and use this calculator for quick what-if scenarios.' },
    ],
    tips: [
      'Enter the final exam as its own row and adjust the grade until your final flips from B to A.',
      'Use the trash icon to clear the starter rows before building your own list.',
      'Mix one letter row into an all-percentage list to model participation marks quickly.',
      'Watch the total weight badge — it is the fastest way to spot a missing syllabus category.',
    ],
  },
  // ── quote-generator ──

  'quote-generator': {
    intro:
      'The Quote Generator serves up a hand-picked collection of inspirational quotes on demand, organized into four curated categories: Motivation, Wisdom, Success, and Life. Pick a category or leave it on All categories, click Generate, and a random quote appears in a serif card with a warm gradient background and a category badge, followed by the author\'s name. Selection uses the Web Crypto API rather than Math.random, and the tool deliberately avoids repeating the quote you are currently viewing, so two clicks never feel like one. From there, one button copies a ready-to-paste attribution string — quotation marks, em dash, and author included — while another renders the quote to a 1080 by 1080 PNG with the same gradient, wrapped text, and signature, saved straight to your downloads. It is a small utility with a narrow promise: no feeds, no accounts, no algorithm — just a curated set of well-known lines for social posts, presentations, journal covers, and the occasional moment of mid-afternoon motivation.',
    examples: [
      { input: 'Category Success, click Generate', output: 'The way to get started is to quit talking and begin doing. — Walt Disney', note: 'A random pick from the Success pool. The result varies on each click because the generator uses Web Crypto randomness and never repeats the currently displayed quote.' },
      { input: 'Category Wisdom, click Copy', output: 'Clipboard: "In the middle of difficulty lies opportunity." — Albert Einstein', note: 'Copy builds a formatted string with quotation marks, an em dash, and the author, ready to paste anywhere. The exact quote depends on which one is currently generated.' },
      { input: 'Category Motivation, click Download image', output: 'quote-<timestamp>.png, 1080 x 1080 pixels', note: 'A PNG rendered on a canvas with a three-stop gradient from deep teal to magenta to rust, a decorative quote mark, wrapped 52px serif text, and the author in italic, downloaded to your device.' },
    ],
    howTo: [
      'Choose a category from the dropdown, or keep All categories.',
      'Click Generate to pull a random quote from the selected pool.',
      'Use Copy to place a formatted quote-and-author string on your clipboard.',
      'Use Download image to save the current quote as a 1080 x 1080 PNG.',
      'Read the counter under the card to see which quote number you are on and the pool size.',
    ],
    useCases: [
      'Grabbing a morning social-media post from the Motivation category.',
      'Adding a closing slide to a presentation from the Success pool.',
      'Designing an Instagram story by downloading the quote as a ready-made square image.',
      'Filling a gratitude-journal cover with a Life or Wisdom line.',
      'Pasting an attribution-safe quote into a newsletter footer with one click.',
      'Generating a random quote to break a creative block during a writing session.',
    ],
    bestPractices: [
      'Filter by category before generating if the quote must fit a theme — the pools are small and curated, so every line is on-topic.',
      'Use Copy rather than selecting the text by hand; it includes the author and correct punctuation automatically.',
      'Download images at their native 1080 square size and avoid resizing upward, which softens the text.',
      'Attribute quotes even when the tool does it for you — the attribution is part of the copied string, so do not strip it.',
      'Check the quote counter to confirm the pool size; some categories contain only seven or eight lines, so variety is finite.',
      'If the exact wording matters, verify against a primary source before publishing — these are curated, popular attributions.',
    ],
    faqs: [
      { q: 'Are the generated quotes really chosen at random?', a: 'Yes. Selection uses the Web Crypto API through a helper, which is cryptographically stronger than Math.random, and the generator avoids repeating the quote currently on screen when the pool has more than one entry. Within a small curated pool you may still see a line again quickly, but the selection itself is genuinely random.' },
      { q: 'How many quotes are in the built-in collection?', a: 'The built-in collection contains about thirty quotes spread across four categories — Motivation, Wisdom, Success, and Life — with roughly seven or eight per category. The counter below the card shows your current position and the pool size for the selected filter, so you can see exactly how many lines you are drawing from.' },
      { q: 'What format is the downloaded image?', a: 'A 1080 by 1080 pixel PNG rendered client-side on a canvas. It features a three-stop gradient background from deep teal through magenta to rust, a large decorative opening quote mark, the quote text wrapped in bold serif type, and the author\'s name in italic at the bottom right.' },
      { q: 'Can I request quotes from the internet?', a: 'No. The generator works entirely offline from a fixed, curated list — there is no API call, no network dependency, and no user-generated content. That keeps it fast and predictable, but it also means new quotes appear only when the collection itself is updated.' },
      { q: 'What does the Copy button put on my clipboard?', a: 'A ready-to-paste string in the form of an opening quotation mark, the quote text, a closing quotation mark, an em dash, and the author\'s name — for example: "The only way to do great work is to love what you do." — Steve Jobs. Nothing else is added, so it pastes cleanly into posts and documents.' },
      { q: 'Why did my quote change when I switched categories?', a: 'The displayed index is re-projected into the new pool to stay in range, so changing from All categories to Motivation may land you on a different quote, and the counter resets to position one of the smaller pool. Click Generate again if you want a fresh random pick within the new filter.' },
    ],
    tips: [
      'Cycle through all four categories once to see the full curated range before picking a favourite.',
      'Download several images at once and keep the best — each Generate click gives a fresh composition opportunity.',
      'Use the counter to note your favourite quote\'s position for quick revisits.',
      'Pair the Copy output with the downloaded image so posts carry both the visual and the attribution.',
    ],
  },
  // ── flashcard-generator ──

  'flashcard-generator': {
    intro:
      'The Flashcard Generator is a self-contained study deck builder: create cards with a front and a back, then flip through them in a dedicated Study mode that shows one card at a time. The Editor tab holds the deck as a scrollable list — each card has two text areas, a per-card delete button, and an Add card button that appends empty cards you can fill in. A badge keeps a running count, so a deck that ballooned while researching is immediately visible. The Study tab presents the current card as a large clickable surface: click it (or press Flip) to reveal the back, and use Prev and Next to step through the deck, which wraps around at both ends. Every card shows a front/back label and an empty-state message if you study a blank deck. Export saves the deck as pretty-printed JSON, and Import reads a JSON file back in, accepting any array of objects with string front and back fields and rebuilding them as fresh cards — a clean round-trip for moving decks between devices or classmates.',
    examples: [
      { input: 'Add card: front "What is the powerhouse of the cell?", back "Mitochondria"', output: 'Editor list grows to 3 cards; the badge next to Cards reads 3', note: 'The new card is appended to the starter deck of two cards. Textareas accept multiple lines, so longer questions and answers both work.' },
      { input: 'Study tab, card 1, click the card', output: 'Front "What is the capital of France?" flips to Back "Paris"', note: 'Clicking the card toggles the flip state, and the small label above the text switches from Front to Back. Prev and Next wrap around the ends of the deck.' },
      { input: 'Import a file containing [{"front": "H2O", "back": "Water"}]', output: 'Toast "Imported 1 card"; the deck is replaced with the single imported card', note: 'Import expects a JSON array of objects with string front and back fields; invalid entries are filtered out and a toast reports how many cards were imported.' },
    ],
    howTo: [
      'On the Editor tab, click Add card to append a new card to the deck.',
      'Type the question or term in the Front textarea and the answer in the Back textarea.',
      'Use Export to save the deck as flashcards.json, or Import to load a previously saved deck.',
      'Switch to the Study tab and click the card to flip between front and back.',
      'Navigate with Prev and Next, or Flip, while the badge shows your position in the deck.',
    ],
    useCases: [
      'Building a vocabulary deck for a language exam and reviewing it on the bus.',
      'Preparing medical terms before a licensing exam, one definition at a time.',
      'Exporting a JSON deck to share with classmates who use the same tool.',
      'Rehearsing interview answers by putting the question on the front and keywords on the back.',
      'Memorizing historical dates with event fronts and year backs.',
      'Importing a pre-made deck from a study group and studying it without retyping.',
    ],
    bestPractices: [
      'Keep one fact per card — cards with two questions are harder to recall and harder to judge.',
      'Put the prompt on the front and the shortest sufficient answer on the back, so flips stay fast during review.',
      'Export before clearing a deck; the JSON file is the only way to get cards back outside this page session.',
      'Remember the deck is not saved between visits — refreshing the browser returns the starter cards.',
      'For imports, ensure the file is an array of objects with string front and back fields, or cards will be filtered out.',
      'Use Prev and Next to cycle the deck when finishing a pass; navigation wraps around, which helps re-review weak cards.',
    ],
    faqs: [
      { q: 'Is my deck saved between sessions?', a: 'No. The deck lives in the page\'s memory and resets to the two starter cards on refresh. To keep a deck, click Export, which downloads a flashcards.json file, and re-import it later. The import accepts any JSON array of objects with string front and back fields, so your own files work as backups.' },
      { q: 'Can I import decks from other apps?', a: 'If you can produce a JSON array of objects with string front and back fields, yes. The importer filters entries to that exact shape, ignores anything else, and rebuilds the deck with fresh card IDs. Many flashcard apps export richer formats, so you may need to reformat your data to the simple front and back structure first.' },
      { q: 'Does the study mode shuffle cards?', a: 'No. Study mode steps through the deck in the same order as the Editor list, with Prev and Next wrapping around at the ends. If you want variety, reorder cards in the Editor tab, or export the deck, shuffle the JSON yourself, and re-import the shuffled version.' },
      { q: 'What happens if a card is blank?', a: 'Blank cards are allowed in the editor, and in study mode a card with an empty front or back shows "(empty)" so you know the field is unfilled. They still count toward the deck size and navigation. It is usually cleaner to delete half-filled cards with the trash icon rather than study around them.' },
      { q: 'Can I add formatting to cards?', a: 'The textareas accept plain text, and the study view preserves line breaks as you typed them. Bold, colours, links, and images are not supported — keep cards plain so exported JSON stays clean and imported decks round-trip without surprises or formatting loss.' },
      { q: 'What exactly does the Export button produce?', a: 'A download named flashcards.json containing a pretty-printed JSON array with one object per card, each holding only front and back strings. Internal IDs are not exported, which keeps the file portable and hand-editable. Re-importing the file rebuilds the deck exactly, minus any per-card IDs.' },
    ],
    tips: [
      'Write the answer first when creating a card — it is easier to frame a good question after.',
      'Use the wrap-around navigation to re-hit the first cards of a long deck in one session.',
      'Export after every big editing session so a refresh never costs you a deck.',
      'Reuse the import feature to alternate between decks saved as separate JSON files.',
    ],
  },
  // ── invoice-number-generator ──

  'invoice-number-generator': {
    intro:
      'The Invoice Number Generator turns a set of formatting choices into a ready-to-use list of sequential invoice numbers, solving a chore every freelancer and small business meets at some point: how to number documents so they sort correctly, look professional, and never collide. You control five things — an optional text prefix, the starting number, how many numbers to generate, the digit padding, and a separator that can be a hyphen, slash, underscore, or nothing. A checkbox optionally prepends today\'s date in YYYYMMDD form, a scheme that keeps invoices naturally chronological even across restarts. The tool generates the list live, shows the first and last numbers and the total count as quick stats, and displays a pattern badge that previews the exact layout. Two guardrails keep output sane: the count is clamped to between 1 and 1,000, and padding is clamped to between 1 and 10 digits, each with an explanatory note when clamping happens. The finished list copies easily or downloads as a .txt file.',
    examples: [
      { input: 'Prefix INV, starting number 1, count 10, padding 4, separator Hyphen, date stamp off', output: `INV-0001
INV-0002
INV-0003
INV-0004
INV-0005
INV-0006
INV-0007
INV-0008
INV-0009
INV-0010`, note: 'Numbers are zero-padded to 4 digits, so 1 becomes 0001. The prefix and padded number are joined with a hyphen, producing ten sequential lines from INV-0001 to INV-0010.' },
      { input: 'Prefix ACME, starting number 50, count 3, padding 3, separator Slash, date stamp on', output: `ACME/20260817/050
ACME/20260817/051
ACME/20260817/052`, note: 'The date stamp uses today\'s date in YYYYMMDD form (20260817). Each line joins prefix, date, and the padded sequence 050 through 052 with slashes.' },
      { input: 'Empty prefix, starting number 0, count 5, padding 2, separator None', output: `00
01
02
03
04`, note: 'With an empty prefix and no separator, only the padded numbers remain. Starting at 0 is allowed, and the sequence runs 00 through 04.' },
    ],
    howTo: [
      'Type an optional Prefix such as INV, or leave the field blank.',
      'Set the Starting number, Count, and Padding fields — count and padding are clamped to 1-1000 and 1-10.',
      'Pick a Separator from the dropdown: Hyphen, Slash, Underscore, or None.',
      'Tick the Date stamp checkbox to prepend today\'s date as YYYYMMDD.',
      'Read the Generated, Sample first, and Sample last stats, then copy or download the full list from the result box.',
    ],
    useCases: [
      'Numbering a new year\'s invoices with a date prefix so they sort chronologically.',
      'Generating sequential ticket or receipt codes for a small event.',
      'Producing order numbers for an online store before the sales system exists.',
      'Creating reference numbers for client quotes under a shared prefix.',
      'Resuming a sequence after a system migration by starting from the last used number plus one.',
      'Standardizing document IDs across departments with a fixed padding scheme.',
    ],
    bestPractices: [
      'Pick a scheme before you start billing — changing prefixes or padding mid-year breaks the sequence\'s consistency.',
      'Always zero-pad: without padding, INV-9 sorts after INV-100 in almost every file manager.',
      'Note that the date stamp uses your device\'s local date, so check the Date badge before generating a batch that spans midnight.',
      'Use the clamping guards to your advantage, but watch for the amber notes so a typo of 10000 does not silently become 1000.',
      'Keep a record of the last number used, because the generator always starts fresh from the value you enter.',
      'Avoid the slash separator when the numbers will end up in filenames, where / is illegal on most systems.',
    ],
    faqs: [
      { q: 'Why does my count keep getting clamped?', a: 'The tool restricts generation to between 1 and 1,000 numbers to keep the list readable and the page responsive. If you enter 5,000 it clamps to 1,000 and shows an amber note telling you so. For longer sequences, generate the first 1,000, then change the starting number to continue where the batch left off.' },
      { q: 'How does the date stamp work?', a: 'When the checkbox is ticked, today\'s date from your device clock is formatted as YYYYMMDD — 17 August 2026 becomes 20260817 — and inserted between the prefix and the sequence number. A Date badge next to the pattern confirms the exact date used, which matters if you generate invoices around midnight.' },
      { q: 'Can I generate numbers without a prefix?', a: 'Yes. Leave the Prefix field empty and the generator uses only the padded sequence, optionally with the date stamp and separator. With no prefix, no date, and separator set to None, the output is simply the zero-padded numbers themselves, which is handy for internal reference codes.' },
      { q: 'Are the generated invoice numbers guaranteed to be unique?', a: 'Within one batch, yes — each list is strictly sequential from the starting number, so there are no duplicates. Uniqueness across batches is your responsibility: restarting from 1 or reusing a range repeats numbers. Track your last issued number and resume from the next value each time.' },
      { q: 'What is padding and why does it matter?', a: 'Padding is the minimum number of digits, achieved with leading zeros: at padding 4, the number 7 becomes 0007. Consistent padding keeps numbers the same visual length and makes alphabetical sorting match numerical order in file lists and spreadsheets, which unpadded sequences famously break.' },
      { q: 'Can I export the generated numbers?', a: 'Yes. The result box shows the full list, one number per line, and offers a download that saves it as invoice-numbers.txt. You can also select and copy the text directly. The list updates live as you change settings, so download only after you have settled the final configuration.' },
    ],
    tips: [
      'Adopt a year-based prefix such as 2026- so each January you can restart the sequence cleanly.',
      'Use the pattern badge to confirm the exact layout before copying or downloading a batch.',
      'Prefer underscores over slashes when numbers will end up in filenames.',
      'Generate in 1,000-number chunks for annual archives, keeping each file small enough to scan.',
    ],
  },
  // ── study-planner ──

  'study-planner': {
    intro:
      'The Study Planner converts the vague dread of an approaching exam into a concrete, day-by-day schedule. You pick an exam date and list your subjects with an estimated number of study hours for each. The planner immediately computes the days until the exam, the total study hours across all subjects, and the hours per day required to finish on time. Beneath those stats it builds a dated schedule — starting today — that distributes your subjects round-robin across the available days, filling each day with roughly the daily hour budget until every subject\'s hours are exhausted. Each scheduled row shows the date, the hours allotted, and badges listing which subjects get attention that day. Sensible limits are built in: schedules cap at 365 days, subjects with blank or non-positive hours are skipped, and choosing a date in the past triggers a clear alert instead of a nonsense plan. If the hours-per-day figure looks impossible, that is the point — the planner is designed to surface that truth early.',
    examples: [
      { input: 'Exam date 10 days from today; Mathematics 12h, History 8h', output: 'Days until exam 10, total 20.0 h, 2.00 h/day, 10 days scheduled', note: '20 hours over 10 days is 2 per day. Round-robin fills days 1-6 with Mathematics (2.0h each, 12h total) and days 7-10 with History (2.0h each, 8h total).' },
      { input: 'Exam date 5 days from today; Chemistry 6h, Biology 4h, English 2h, Physics 8h', output: 'Days until exam 5, total 20.0 h, 4.00 h/day, 5 days scheduled', note: '20 hours over 5 days is 4 per day. Subjects are consumed in list order: day 1 Chemistry 4h; day 2 Chemistry 2h + Biology 2h; day 3 Biology 2h + English 2h; days 4-5 Physics 4h each.' },
      { input: 'Exam date in the past, with any subjects', output: 'Alert "This exam date has already passed"; stats show dashes', note: 'The planner detects the negative day count, shows a destructive alert, and produces no schedule because no study time is available.' },
    ],
    howTo: [
      'Set the Exam date with the date picker.',
      'Review or edit the starter subjects (Mathematics, History) and their Estimated hours.',
      'Click Add subject to append rows for every exam topic you need to cover.',
      'Read Days until exam, Total study hours, and Hours per day in the stats row.',
      'Follow the dated schedule table, which lists each day\'s hours and subject badges.',
    ],
    useCases: [
      'Spreading revision across the three weeks before finals without last-minute cramming.',
      'Working out whether two weeks is enough for four subjects before booking the exam.',
      'Balancing daily study hours around a part-time job with a realistic per-day budget.',
      'Building a school-holiday revision timetable for a child with mixed subjects.',
      'Surfacing that a planned 1-hour-per-day routine cannot cover the syllabus in time.',
      'Organizing certification-exam prep so each domain gets scheduled attention.',
    ],
    bestPractices: [
      'Estimate hours honestly by subject difficulty, not by wishful thinking — the schedule inherits every error.',
      'Check the hours-per-day figure first; if it exceeds what you can sustain, adjust the exam date or trim subjects before committing.',
      'Leave buffer days between the last scheduled session and the exam for review and rest — the planner packs every available day.',
      'Use round numbers of hours per subject so the daily breakdown stays readable.',
      'Verify the exam date is in the future; a past date disables the schedule with an alert rather than computing a negative plan.',
      'Revisit the plan mid-way: mark done hours, update the remaining estimates, and let the planner re-balance the rest.',
    ],
    faqs: [
      { q: 'How does the schedule decide which subject goes where?', a: 'It walks the subject list round-robin, giving each subject its hours in the order you listed them until the day\'s budget is full, then moves to the next day. The first listed subjects tend to be scheduled earliest. To change priorities, reorder the list or edit the hours, and the schedule rebuilds instantly.' },
      { q: 'What does hours per day mean exactly?', a: 'It is the total study hours across all subjects divided by the number of days from today up to and including the exam day. The schedule then targets roughly that figure for each day, though the final day of a subject can fall short. It is a planning average, not a promise that every day will be identical.' },
      { q: 'Can I exclude weekends or rest days?', a: 'No. The planner treats every day between today and the exam as available, including weekends. If you want rest days, reduce your effective hours: estimate each subject with the reality that some days will be missed, or set the exam date earlier than your real deadline so the plan effectively compresses.' },
      { q: 'Why does my schedule show fewer days than I expected?', a: 'Scheduling stops as soon as every subject\'s hours are consumed, which can happen before the exam date if your daily budget is generous. The "days scheduled" badge shows how many days are actually used. Unused days act as free buffer — a healthy margin, especially for final review.' },
      { q: 'What happens if my total hours exceed the available days?', a: 'The hours-per-day figure rises accordingly, which is the tool\'s way of warning you. If it climbs to an unsustainable level, the schedule still distributes everything, but the honest fix is to trim subject hours, extend the deadline, or accept that some topics get less attention than planned.' },
      { q: 'Does the planner save my subjects?', a: 'No. Subjects and the exam date exist only in the current page session and reset when you refresh. The schedule table is generated live from your inputs. If you want to keep the plan, screenshot or copy the table — there is no export option, so capture it before you close the tab.' },
    ],
    tips: [
      'List your hardest subject first so it gets scheduled before your energy fades.',
      'Pad every subject\'s hours by 10-15% to absorb underestimation.',
      'If hours per day looks scary, add one day of buffer by pretending the exam is a day earlier.',
      'Use the date badges to plan around known commitments like work shifts.',
    ],
  },
  // ── tip-calculator ──

  'tip-calculator': {
    intro:
      'The Tip Calculator handles the two-second mental maths that happens at the end of every group dinner: how much to tip, what the total comes to, and what each person owes. Enter the bill amount in dollars, set the tip percentage with a slider from 0 to 30 percent or with quick presets of 15, 18, 20, and 25 percent, and the calculator instantly shows the tip amount, the grand total, and the per-person share. A Number of people field splits the bill evenly, and it validates that the count is a whole number of at least one, so a stray decimal or zero cannot silently corrupt the split. An optional Round total up switch rounds the grand total to the next whole dollar before splitting — a favourite of people who like clean numbers and servers who appreciate the small bump. Everything updates live as you type, results are formatted in US dollars, and inline error messages explain exactly what is wrong when a field is empty or invalid.',
    examples: [
      { input: 'Bill $50.00, tip 18%, 1 person', output: 'Tip amount $9.00, total $59.00, per person $59.00', note: '50 x 0.18 = 9.00; the total is 50 + 9 = 59.00; with one person the per-person share equals the total.' },
      { input: 'Bill $86.40, tip 20% preset, 4 people', output: 'Tip amount $17.28, total $103.68, per person $25.92', note: '86.40 x 0.20 = 17.28; the total is 86.40 + 17.28 = 103.68; split four ways: 103.68 / 4 = 25.92 each.' },
      { input: 'Bill $47.60, tip 15%, 2 people, Round total up on', output: 'Tip amount $7.14, total $55.00, per person $27.50', note: '47.60 x 0.15 = 7.14; the unrounded total is 47.60 + 7.14 = 54.74, which the switch rounds up to 55.00; each person pays 55.00 / 2 = 27.50.' },
    ],
    howTo: [
      'Enter the Bill amount in US dollars.',
      'Drag the Tip percentage slider or tap one of the 15%, 18%, 20%, and 25% quick buttons.',
      'Enter the Number of people splitting the bill — a whole number of at least one.',
      'Toggle Round total up to round the grand total to the next whole dollar.',
      'Read Tip amount, Total, and Per person, which update live as you edit.',
    ],
    useCases: [
      'Splitting a group dinner five ways with a 20% tip settled before anyone reaches for a phone calculator.',
      'Checking whether the suggested 25% gratuity printed on a receipt matches the bill.',
      'Calculating a fair tip on delivery during a promotion where the pre-discount amount matters.',
      'Working out a per-person contribution for a shared vacation-rental meal.',
      'Rounding the total up to a clean dollar figure for a cash payment.',
      'Comparing 15% and 20% on a large catering bill to see the real dollar difference.',
    ],
    bestPractices: [
      'Enter the pre-tax subtotal when you want a conventional tip; tipping on tax and fees inflates the amount.',
      'Check that the people count is the actual number of payers — the calculator only accepts whole numbers of one or more.',
      'Remember the round-up switch only affects the total, so the displayed tip amount stays exact while the per-person share absorbs the rounding.',
      'Use the quick presets for speed, then fine-tune with the slider in 1% steps if you want something like 19%.',
      'Verify the bill input when an error message appears; zero and empty bills are rejected, which protects against a misplaced decimal point.',
      'Agree the split before ordering extra rounds — recalculating mid-meal is easy, but changing rules after payment is not.',
    ],
    faqs: [
      { q: 'Does the tip percentage include tax?', a: 'The calculator applies the percentage to whatever amount you enter in the Bill field, so you decide. If you want the conventional pre-tax tip, enter the subtotal before tax and fees. If you enter the after-tax total, you are tipping on tax as well, which many people prefer to avoid.' },
      { q: 'How does the Round total up switch work?', a: 'It rounds the grand total (bill plus tip) up to the nearest whole dollar before the split is calculated. A $47.60 bill with a 15% tip totals $54.74, which becomes $55.00. The displayed tip amount stays $7.14, so the extra 26 cents effectively increases the tip in the final split.' },
      { q: 'Can I split by anything other than evenly?', a: 'No. The split is strictly even — the per-person figure is the total divided by the number of people. If your group splits unevenly, for example because one person did not drink, calculate the even share first and then adjust manually, or run the calculator once per subgroup.' },
      { q: 'What if someone is not paying?', a: 'Enter only the number of people who are paying. If four people dine and one treats the others, enter 1 and the per-person share equals the full total. If three split the bill of four, enter 3 — the calculator does not know how many ordered, only how many pay.' },
      { q: 'Why does the slider stop at 30 percent?', a: 'The slider range is 0 to 30 percent in 1-percent steps, covering the customary tipping range in the United States and a generous margin beyond it. The quick presets sit at 15, 18, 20, and 25. For unusual cases above 30%, calculate the extra manually.' },
      { q: 'Are the tip results updated live as I type?', a: 'Yes. Every input change — typing the bill, moving the slider, tapping a preset, changing the people count, or toggling round-up — updates the three result cards immediately. There is no calculate button to press, and amounts are formatted in US dollars using the browser\'s locale-aware number formatting.' },
    ],
    tips: [
      'Tap the 20% preset and read only the per-person card when the group is waiting.',
      'Flip the round-up switch on cash nights so nobody has to hunt for coins.',
      'Enter the pre-tax subtotal if the receipt lists it separately.',
      'Slide to 25% for standout service without needing the mental multiplication.',
    ],
  },
}