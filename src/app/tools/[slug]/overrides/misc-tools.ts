// misc-tools.ts — hand-written content overrides for the misc category.
// Generated from a split of the original monolithic
// src/app/tools/[slug]/tool-content-overrides.ts into per-category
// modules (file-structure refactor). Content is byte-identical to the
// original; do not hand-edit formatting here unless you also update
// the merge in ./index.ts.
import type { ToolOverrideMap } from './types'

export const OVERRIDES: ToolOverrideMap = {
  'ai-cost-calculator': {
    intro:
      'The AI Cost Calculator turns token volumes into a concrete budget estimate for LLM API usage across eight commonly used models from OpenAI, Anthropic, Meta, and Google. Pick a model from the dropdown, enter input tokens per request, output tokens per request, and requests per day, and the tool computes live cost per request plus daily, monthly, and yearly totals. Monthly figures assume thirty days and yearly figures assume three hundred and sixty-five days, exactly as the summary row labels them. Pricing for each model — for example GPT-4o at $5.00 per million input tokens and $15.00 per million output tokens — is baked into the model list, and the hints beside the token fields display the current per-million rates so the arithmetic stays visible. A breakdown table splits spending between input and output components with per-request, per-day, per-month, and per-year columns, ending in a bold total row across all horizons. Inputs are validated as non-negative and requests per day must be greater than zero, with explicit error messages for invalid values and small costs formatted as sub-cent amounts. Because the prices are embedded approximations rather than live quotes, the results are best treated as an order-of-magnitude guide for capacity planning, prompt budgets, and comparing models before committing to a production vendor.',
    examples: [
      { input: 'GPT-4o, 1,000 input tokens and 500 output tokens per request, 100 requests per day.', output: '$0.0125 per request, $1.25 daily, $37.50 monthly, and $456.25 yearly, with the input and output components split in the breakdown table.', note: 'Monthly uses daily × 30 and yearly uses daily × 365, matching the tool\'s constants.' },
      { input: 'GPT-4o mini at 100,000 input tokens and 50,000 output tokens per request, 100 requests per day.', output: '$0.045 per request, $4.50 daily, $135.00 monthly, and $1,642.50 yearly shown in the summary stats.', note: 'GPT-4o mini\'s $0.15 / $0.60 per-million rates keep a large workload surprisingly cheap.' },
      { input: 'Llama 3.1 70B with 500,000 input and 200,000 output tokens per request, 2 requests per day.', output: 'Cost per request $0.4530, daily $0.9060, monthly $27.18, and yearly $330.69 across the four stat cards.', note: 'The badge row confirms the active model, token counts, and request volume at a glance.' },
    ],
    howTo: [
      'Pick a model in the "Model" dropdown — GPT-4o, GPT-4o mini, GPT-4 Turbo, GPT-3.5 Turbo, Claude 3.5 Sonnet, Claude 3 Haiku, Llama 3.1 70B, or Gemini 1.5 Pro.',
      'Type the average traffic in "Input tokens / req" and "Output tokens / req"; the hints show the selected model\'s per-million USD rates.',
      'Set "Requests / day" to the expected call volume — zero or negative values draw the "must be greater than zero" error.',
      'Read the Cost / request, Daily cost, Monthly cost, and Yearly cost stat cards for the headline figures.',
      'Scroll the breakdown table to compare per-request, per-day, per-month, and per-year rows for input, output, and the bold total.',
    ],
    useCases: [
      'Budgeting a chatbot\'s monthly API spend before committing to a paid provider tier.',
      'Comparing GPT-4o, Claude 3.5 Sonnet, and Gemini 1.5 Pro at identical volume to pick the most economical fit.',
      'Deciding whether a cheap model like GPT-4o mini can absorb high-volume, low-complexity traffic.',
      'Forecasting a year of production inference costs for a runway plan or vendor contract negotiation.',
      'Measuring how much context trimming or prompt caching saves by re-running with smaller token figures.',
      'Deriving a defensible per-request cost number to feed into product pricing or per-seat plans.',
    ],
    bestPractices: [
      'Treat all prices as approximations — providers change rates by tier and region, so verify current quotes before finalizing a budget.',
      'Enter per-request averages, not totals; the tool multiplies by requests per day itself, so double-counting inflates the forecast.',
      'Remember output tokens dominate cost on premium models, so shortening generation often cuts spend more than trimming input.',
      'Calibrate token estimates against a real tokenizer; code and multilingual text tokenize very differently from English prose.',
      'Use the breakdown table to identify which component drives the bill before negotiating a volume discount.',
      'Read yearly figures as a rough horizon, since usage rarely stays flat across twelve months of a production ramp.',
    ],
    faqs: [
      { q: 'Are the prices up to date?', a: 'No. Pricing in the model list is approximate USD per one million tokens and reflects common public rates at the time the tool was built, not live quotes. Providers publish current rates on their own pages, and the footer reminds you to verify values before budgeting with them.' },
      { q: 'How are monthly costs computed?', a: 'Daily cost is multiplied by 30 for the monthly figure and by 365 for the yearly figure, matching the constants shown in the tool. The breakdown table applies the same constants to the input and output components separately before summing them into the total row.' },
      { q: 'What is the cheapest model offered?', a: 'Among the eight models, GPT-4o mini at $0.15 per million input tokens and $0.60 per million output tokens is the low-cost option. Run the same workload volume through it and through a premium model to quantify exactly how much the monthly figure shrinks.' },
      { q: 'Can I calculate without output tokens?', a: 'Yes. The tool accepts zero output tokens and still produces a valid estimate based purely on input cost, as long as either count is above zero and requests per day is a positive number. Negative values are rejected with an explicit error message.' },
      { q: 'Why does my per-request cost show under a cent?', a: 'Any cost below one hundredth of a dollar is formatted as "<$0.01" to avoid clutter, while larger values use two decimal places, or four below a dollar. Tiny per-request figures are normal for cheap models at low token counts, and the daily total usually reads more clearly.' },
      { q: 'Why does my breakdown table show two rows?', a: 'The calculator separates spending into input tokens and output tokens because providers price them differently. Each row shows its own per-request, per-day, per-month, and per-year cost under the selected model\'s rates, and a final bold total row sums both components for every time horizon.' },
    ],
    tips: [
      'Halve output tokens on a premium model and re-run to see the strongest cost lever in the breakdown table.',
      'Set requests per day to your measured peak plus headroom, then read the Yearly cost for runway planning.',
      'Keep inputs in tokens, not characters — a token is roughly three-quarters of an English word, so calibrate with a tokenizer.',
      'Skip the premium comparison if latency or quality constraints would force you back to the full model anyway.',
    ],
  },
  'ai-persona-generator': {
    intro:
      'The AI Persona Generator designs detailed, repeatable personas for role-play or assistant use inside any LLM workflow. You can start from the pre-filled example — Maya Chen, a Senior Product Designer — or hit Randomize persona to get a fresh name, role, background, speaking style, and two to four matching traits. The Identity card collects a persona name, a role or profession, an expertise slider from 1 to 10 with live labels running from Beginner through Expert, a set of eight trait checkboxes, and free-form background and speaking-style textareas, all reflected instantly in a row of status badges. Two tabs render the results: the Profile tab produces a formatted Markdown profile with role, expertise level, traits, background, and speaking style, while the System prompt tab composes a ready-to-paste instruction that casts the model as the persona, folds in the background and style, and closes with a stay-in-character directive. Both outputs can be downloaded as Markdown files. Because everything is generated locally from your inputs, the tool suits product demos, support agents that need a consistent tone, game characters, and any scenario where a stable, documented persona beats an improvised one.',
    examples: [
      { input: 'Keeping the default Maya Chen persona with expertise 8 and the traits analytical, empathetic, and pragmatic.', output: 'The Profile tab shows "Persona Profile: Maya Chen", Role / Profession "Senior Product Designer", 8/10 (Advanced), the three traits, the SaaS background, and the calm structured speaking style.', note: 'The profile renders as Markdown and can be downloaded as persona-profile.md.' },
      { input: 'Clicking "Randomize persona" several times.', output: 'Each click swaps name, role, background, and style from the sample pools and selects 2–4 random traits with expertise between 4 and 10, such as "Diego Vargas", "Security Analyst", level 6.', note: 'Expertise always lands between 4 and 10 and the trait count varies between two and four.' },
      { input: 'A custom persona named "Aria" with no traits selected and an empty background.', output: 'The badge row shows Aria; the profile lists "no dominant traits specified" and em dashes for empty fields, while the prompt opens "You are Aria, a professional with 8/10 expertise (Advanced)" and closes the traits line with "neutral and balanced."', note: 'Empty inputs degrade gracefully instead of breaking either generated output.' },
    ],
    howTo: [
      'Click "Randomize persona" for a fresh combination, or keep the default Maya Chen example and edit each field.',
      'Fill the Persona name and Role / profession inputs in the Identity card — empty names render as "Unnamed".',
      'Drag the Expertise level slider and watch the hint update its label, for example "8/10 · Advanced".',
      'Tick one or more of the eight trait checkboxes; the counter above the grid shows how many are selected.',
      'Write free-form Background and Speaking style text, then open the System prompt tab and download it as persona-system-prompt.md.',
    ],
    useCases: [
      'Casting a consistent tone for a customer-support chatbot so every reply matches the brand voice.',
      'Creating characters for prompt-based games or interactive fiction with a documented identity.',
      'Preparing a mock user persona with a distinct background for UX interviews or usability scripts.',
      'Generating a documented buyer profile for sales teams to role-play objections against.',
      'Versioning personas as Markdown files so prompt changes stay reviewable in a repository.',
      'Building study aids in which each persona explains a topic from a different expertise level and perspective.',
    ],
    bestPractices: [
      'Keep the background short and concrete — one or two sentences anchor the model far better than a long résumé.',
      'Limit traits to two or three for clarity; the sample picks three, and contradicting traits like humorous plus serious dilute the character.',
      'Match the Expertise level to the role, since a "Staff Engineer" rated Lv 2 reads as inconsistent.',
      'Name and frame the role first, then tailor the speaking style to the channel, terse and direct for chat for example.',
      'Download both outputs so the system prompt and its documentation stay in sync as you iterate.',
      'Leaving traits unselected still produces a workable "neutral and balanced" prompt when none fit.',
    ],
    faqs: [
      { q: 'What does Randomize persona change?', a: 'It draws a new name, role, background, and speaking style from the built-in sample pools, picks two to four random traits, and sets expertise between 4 and 10 on the slider. All outputs — the profile and the prompt — regenerate instantly from the new identity.' },
      { q: 'How is expertise converted to a label?', a: 'Levels 1–3 map to Beginner, 4–6 to Intermediate, 7–8 to Advanced, and 9–10 to Expert. The hint beside the Expertise level slider and the generated profile both display the numeric level with its label — for example 8/10 Advanced — so you always know which band your persona sits in.' },
      { q: 'Can I download the created persona?', a: 'Yes. Both result tabs include a download action: the profile saves as persona-profile.md and the system prompt as persona-system-prompt.md. The generated Markdown keeps the exact structure you see on screen, making it easy to store personas in a repository or prompt library.' },
      { q: 'What happens if I leave fields empty?', a: 'Unfilled inputs degrade gracefully. A persona without a name becomes "Unnamed", missing traits read "no dominant traits specified" in the profile and "neutral and balanced" in the prompt, and empty background or style blocks are omitted from the system prompt entirely.' },
      { q: 'Can I change just one trait?', a: 'Yes. Traits are independent checkboxes, so toggling a single one updates the counter, the status badges, and both generated outputs immediately. Combinations are unlimited, but note that radical opposites such as humorous and serious usually weaken a persona\'s consistency, so keep edits focused.' },
      { q: 'How do the two output tabs differ?', a: 'The Profile tab renders Markdown headings for Role, Expertise, Traits, Background, and Speaking style, suited to documentation. The System prompt tab emits an instruction-style paragraph that tells the model who to be, embeds the background and style, and closes with a stay-in-character line.' },
    ],
    tips: [
      'Randomize repeatedly to break writer\'s block, then edit the persona that feels closest to your goal.',
      'Copy the System prompt output straight into the "system" role of any chat API call.',
      'Keep traits to two or three so the persona stays legible across long conversations.',
      'Store both downloads together so the prompt and its documentation never drift apart.',
    ],
  },
  // ── token-counter ──

  'token-counter': {
    intro:
      'The Token Counter is a local, heuristic LLM token counter that estimates how many tokens any piece of text will consume before you send it to an API. Paste a prompt, an article, or a code snippet into the text area and the tool instantly reports four figures: an estimated token count, the word count, the character count, and a words-to-tokens estimate using the common words-divided-by-three rule. Below the stats, a cost table shows what the same token count would cost as input and output on GPT-4 and GPT-3.5, using their list prices per one million tokens, so you can price an inference request before spending anything. Because every byte stays in your browser, this chatgpt token counter is safe for proprietary prompts and internal drafts. Keep in mind it is an approximation: it combines a four-characters-per-token heuristic with the words/3 rule and takes the larger result, which lands within roughly 10–20% of most real tokenizers. That makes it ideal for quick prompt budgeting, context-window checks, and cost comparisons across models — not for exact billing.',
    examples: [
      {
        input:
          'The quick brown fox jumps over the lazy dog. Paste your text here to estimate token counts and LLM inference costs.',
        output: `Est. tokens: 29 · Words: 21 · Characters: 115 · Tokens (words/3): 28
GPT-4   Input $0.00087 · Output $0.00174 · Total $0.00261
GPT-3.5 Input $0.00001 · Output $0.00004 · Total $0.00006`,
        note: 'The default sample text as loaded. The tool takes the larger of chars/4 (29) and words/0.75 (28).',
      },
      {
        input: 'hello',
        output: `Est. tokens: 2 · Words: 1 · Characters: 5 · Tokens (words/3): 2`,
        note: 'Smallest possible text — ceil(5/4) = 2 and ceil(1/0.75) = 2, so both heuristics agree. The GPT-3.5 cost row rounds to $0.00000 at this scale.',
      },
      {
        input:
          'To be, or not to be, that is the question: Whether \'tis nobler in the mind to suffer The slings and arrows of outrageous fortune, Or to take arms against a sea of troubles And by opposing end them.',
        output: `Est. tokens: 52 · Words: 39 · Characters: 197 · Tokens (words/3): 52
GPT-4   Input $0.00156 · Output $0.00312 · Total $0.00468
GPT-3.5 Input $0.00003 · Output $0.00008 · Total $0.00010`,
        note: 'Words/3 wins here (52 vs chars/4 = 50) because the excerpt is wordy relative to its length — the tool always takes the higher figure.',
      },
    ],
    howTo: [
      'Paste your text into the Text field — a prompt, an article, or code. The hint under the label updates live with the character and word counts.',
      'Read the four stats: Est. tokens, Words, Characters, and Tokens (words/3). Est. tokens is the maximum of the two heuristics, so it stays conservative.',
      'Check the cost table below the stats: each row shows Input, Output, and Total for GPT-4 and GPT-3.5 computed from the current estimate.',
      'Edit the text and watch every figure re-calculate instantly — there is no submit button; the tool is fully reactive.',
      'Remember the footer caveat: the estimate assumes roughly 4 characters per English token and real tokenizers can vary by 10–20%, so leave headroom when budgeting context windows.',
    ],
    useCases: [
      'Budget API spend before an integration — estimate monthly token volume from representative prompts and multiply against the cost table.',
      'Check whether a prompt plus its expected answer fits inside a model\'s context window before deployment.',
      'Compare input-heavy versus output-heavy workloads across GPT-4 and GPT-3.5 pricing to choose the cheaper model.',
      'Estimate tokens for a batch of generated articles or product descriptions to forecast a content-pipeline bill.',
      'Sanity-check word counts against token counts when a client imposes a hard length limit on deliverables.',
      'Plan fine-tuning datasets — gauge how many tokens a training corpus of raw text represents before committing to a provider.',
    ],
    bestPractices: [
      'Treat the estimate as a planning figure, not an invoice: the 4-chars-per-token and words/3 heuristics can drift 10–20% from a real tokenizer, especially with code or non-English text.',
      'Budget prompts against the context window using the larger of the two heuristics — the tool already takes the maximum, so you stay conservative automatically.',
      'Check both the Input and Output columns when pricing: output tokens usually cost more (GPT-4: $60 vs $30 per 1M), and long generated answers multiply the output share of your bill.',
      'Paste the exact text you will send, including whitespace and formatting — leading spaces, line breaks, and markdown all consume characters and therefore tokens.',
      'For code or JSON, lean on the character-based heuristic: code tokenizes at closer to 3–4 chars per token than natural English, so the words/3 rule underestimates.',
      'Use the word count as a sanity check on content-length requirements (e.g. "max 500 words") while the token count validates the model-facing limit — they measure different things.',
    ],
    faqs: [
      {
        q: 'How does the token counter estimate tokens?',
        a: 'It combines two heuristics and takes the larger result. The first divides the character count by four, based on the rough rule that English text averages about four characters per token. The second divides the word count by 0.75, equivalent to the common words-per-three-tokens estimate. Using the maximum keeps the figure conservative. The footer notes that real tokenizer counts can differ by roughly 10–20 percent, since GPT models use subword tokens that vary with vocabulary and language.',
      },
      {
        q: 'Why does the cost table only list two models?',
        a: 'The table covers GPT-4 and GPT-3.5 at their published list prices of $30/$60 and $0.50/$1.50 per one million input/output tokens. The tool multiplies your estimated token count against those rates to show input, output, and total cost per request. Prices change over time, so treat the figures as planning estimates and check current provider pricing before quoting budgets to clients.',
      },
      {
        q: 'Is the estimate accurate enough for billing?',
        a: 'No — it is a planning heuristic, not a tokenizer. Actual GPT tokenization splits words into subword pieces, so counts can differ by 10–20 percent, more for code, emoji, or non-English text. Use the estimate for budgeting, context-window checks, and model-cost comparisons. For exact numbers, count with the official tiktoken library or the provider\'s own counting endpoint.',
      },
      {
        q: 'Why are input and output costs different?',
        a: 'LLM providers charge more for output tokens because generating text is more expensive to serve than reading it. GPT-4 lists at $30 per million input tokens and $60 per million output tokens, a 2× gap that grows with long generated answers. The table separates input, output, and total columns so you can see how a response-heavy workload shifts your bill toward the output rate.',
      },
      {
        q: 'What counts as a token for LLMs?',
        a: 'A token is the smallest unit a model processes: roughly a short word, a piece of a longer word, or punctuation. GPT-style tokenizers use subword algorithms, so "unbelievable" may become two or three tokens while "the" is one. The tool approximates this with the four-characters-per-token and words/3 heuristics instead of running a real tokenizer, which keeps everything instant and local.',
      },
      {
        q: 'Can I check whether my prompt fits a context window?',
        a: 'Yes, but remember the estimate runs 10–20 percent loose. If your estimate sits comfortably under the model\'s context limit with headroom for the expected output length, you are likely safe. Include both input and anticipated output tokens, since a 4k-context model must fit the whole conversation. Re-check after every edit, because a long pasted article can silently push a prompt over budget.',
      },
    ],
    tips: [
      'The cost table assumes the same token count for input and output — for chat workloads the response is usually several times longer than the prompt, so budget output separately.',
      'Longer English words mean fewer characters per token; technical or academic text often tokenizes heavier than the 4-char heuristic predicts.',
      'Paste code verbatim including indentation — whitespace is real text, and trimming it gives you a falsely low estimate.',
      'Keep a representative "average prompt" saved somewhere and re-estimate it monthly as pricing pages change.',
    ],
  },
  // ── prompt-optimizer ──

  'prompt-optimizer': {
    intro:
      'The Prompt Optimizer scores any LLM prompt from 0 to 100 against six heuristics — role definition, context, specific instructions, output format, examples, and length — and explains exactly how to raise the score. Paste a draft into the Your prompt box and the tool grades each criterion with a tick or cross plus its point weight, then lists concrete suggestions such as adding a "You are…" role or naming an output format. A before/after panel contrasts a weak one-line prompt with a fully rewritten strong version you can copy with one click, which doubles as a worked example of the six heuristics in practice. Because the analysis runs entirely in your browser, no prompt ever leaves your device, which makes this AI prompt optimizer safe for confidential company drafts and client work. It is deliberately a checklist tool rather than a magic rewriter: it teaches the structure behind reliable outputs instead of generating text for you. For prompt engineers who want consistently better AI output without black-box tools, it turns vague intuition about good prompting into a measurable score you can iterate against.',
    examples: [
      {
        input: 'Write a blog intro about SEO.',
        output: `Score: 20/100 — Weak
Pass: Specific instructions (+20 pts)
Fail: Role definition, Context, Output format, Examples, Appropriate length
Suggestions (5):
1. Add a role definition — e.g. "You are a senior copywriter specialised in B2B SaaS."
2. Add context — describe the audience, product, or situation the model should consider.
3. Specify the output format — "Respond in markdown with H2 section headings."
4. Include 1–2 examples so the model understands the expected style and tone.
5. Your prompt is very short — add specifics, constraints, and expectations.`,
        note: 'The pre-loaded default. At 29 characters it falls below the 40-character floor, so five of six checks fail and the score lands at 20/100.',
      },
      {
        input:
          'You are a copywriter. Write a product description for a standing desk. Respond in markdown.',
        output: `Score: 70/100 — Needs work
Pass: Role definition (+20) · Specific instructions (+20) · Output format (+15) · Appropriate length (+15)
Fail: Context (15 pts) · Examples (15 pts)
Suggestions (2):
1. Add context — describe the audience, product, or situation the model should consider.
2. Include 1–2 examples so the model understands the expected style and tone.`,
        note: 'A mid-strength prompt: role, instructions, format, and length pass; context and examples are the gaps. The field hint reads 15 words.',
      },
      {
        input:
          'You are a technical recruiter. Context: we are hiring a senior React engineer for a fintech startup. Task: Write a job posting summary. Format: markdown. Example: "Build the core ledger UI."',
        output: `Score: 100/100 — Strong
Pass: all six checks — 20 + 15 + 20 + 15 + 15 + 15
Suggestion (1):
1. Strong prompt. Consider edge-case instructions ("If unsure, ask clarifying questions").`,
        note: 'All six checks pass, scoring 100/100 with the Strong label. The only remaining suggestion is the built-in edge-case nudge.',
      },
    ],
    howTo: [
      'Paste a draft prompt into the Your prompt field (or start from the pre-loaded weak example "Write a blog intro about SEO.").',
      'Read the Score card: the big number out of 100, the progress bar, and the Strong / Needs work / Weak label under it.',
      'Review the six check cards — each shows a green tick or red cross plus its point weight and a hint for fixing it.',
      'Apply the suggestions in the Suggestions card, starting with the highest-weight checks (role and instructions, 20 points each).',
      'Compare your work against the Before / after panel, and click Use to copy the strong example — or copy the numbered suggestion list from the results box at the bottom.',
    ],
    useCases: [
      'Audit a shared prompt library — score each entry and fix the ones below 80 before rolling them out to a team.',
      'Debug inconsistent model output: when replies drift off-format, run the prompt through the checks to find the missing format or examples.',
      'Onboard new prompt engineers — the six check cards teach role, context, and format structure faster than a style guide.',
      'Iterate before/after: score a prompt, apply the suggestions, and measure the score jump as a proxy for quality.',
      'Rescue vague client briefs — paste the brief, add the missing role, context, and format elements the tool flags, and hand back a workable prompt.',
      'Prepare prompts for API products where every call costs money — improve structure locally before spending tokens on test runs.',
    ],
    bestPractices: [
      'Aim to pass all six checks before shipping a prompt: the checks map to the structure (role, context, task, format, examples) that consistently improves LLM output reliability.',
      'Iterate in small passes — fix the failing checks with the highest point weights first (role and instructions at 20 points each), then re-read the score to see the jump.',
      'Write examples that show the edge of your expectations, not the easy middle: one "do this" and one "avoid this" pair disambiguates style better than a single sample.',
      'Keep prompts inside the 40–4000 character window the tool enforces: below 40 characters you are underspecifying, above 4000 the model dilutes attention.',
      'Use Load weak example and Load strong example as training material when onboarding teammates — the score delta (20 vs 100) makes the six heuristics concrete.',
      'Re-check length after every rewrite: shortening a prompt below 40 characters or pasting a huge spec can silently flip the "Appropriate length" check and drag the score down.',
    ],
    faqs: [
      {
        q: 'How is the prompt score calculated?',
        a: 'Six checks contribute weighted points: role definition and specific instructions are worth 20 each, while context, output format, examples, and appropriate length are worth 15 each. A pass on a check adds its weight; the total runs 0–100. Scores of 80 or more are labelled Strong, 50–79 Needs work, and under 50 Weak. Each check card shows a tick or cross with its point value.',
      },
      {
        q: 'What does the optimizer actually check for?',
        a: 'It scans the text with keyword patterns for each heuristic. Role detection looks for phrases like "You are" or "Act as"; context looks for words such as "background" or "our product"; instructions look for imperative verbs like "write" or "analyze"; format looks for "JSON", "markdown", or "table"; examples look for "e.g." or "for example"; and length simply tests that the prompt sits between 40 and 4000 characters.',
      },
      {
        q: 'Why does my well-written prompt score low?',
        a: 'The checker is pattern-based, so a prompt can be strong but miss the specific keywords a check scans for. If your role is implied rather than stated with "You are…", the role check fails even though the model might infer it. Read the failing checks and their hints, then decide whether to add the missing structure or accept the score — the checklist is a guide, not a verdict.',
      },
      {
        q: 'Can I use this to improve prompts for Claude or Gemini?',
        a: 'Yes. The six heuristics are model-agnostic: role, context, explicit instructions, output format, examples, and length improve results across GPT, Claude, Gemini, and open-source models alike. Nothing in the analysis targets a specific vendor, so the same score and suggestions apply regardless of which LLM you paste the final prompt into.',
      },
      {
        q: 'What happens to my prompts after analysis?',
        a: 'Nothing leaves the browser. The component analyzes the text in memory with local regular expressions and renders the score, checks, and suggestions in place — there is no API call, no upload, and no logging. You can paste confidential company drafts and client materials without exposure, and the tool keeps working fully offline once the page has loaded.',
      },
      {
        q: 'How do I fix a very long prompt warning?',
        a: 'When the prompt exceeds 4000 characters the length check fails and a suggestion asks you to split it or remove redundant detail. Look for repeated context, overlapping instructions, and examples that duplicate each other. Either trim to the essentials or split the task into a series of shorter prompts — the optimizer will show the length check pass once you are back inside the window.',
      },
    ],
    tips: [
      'The score updates as you type, so fix one check at a time and watch the number climb — it is a satisfying feedback loop.',
      'The weak example scores exactly 20/100 (only "Specific instructions" passes); use it to demo the tool to skeptics.',
      'Copy the strong example with the Use button, then edit its specifics — it is a skeleton, not a finished prompt.',
      'If you disagree with a failing check, read the hint: the checker looks for specific keywords, and sometimes your structure is fine without them.',
    ],
  },
  // ── prompt-variable-replacer ──

  'prompt-variable-replacer': {
    intro:
      'The Prompt Variable Replacer turns a prompt template full of {{variable}} placeholders into a fill-in-the-blanks form and produces a finished prompt live as you type. Paste a template such as "Write a {{tone}} email about {{topic}}", and the tool detects every placeholder with a regex, renders one labelled input field per unique variable, and shows a running "3 of 9 filled" counter so you always know what is still missing. Empty variables deliberately stay visible in the final prompt, which makes it impossible to ship a template with half-filled blanks. A Fill placeholders button quickly stubs any leftovers with angle-bracket values, while Load sample restores a nine-variable content-writing template you can use as a starting point. Everything runs locally, so confidential customer names and campaign details never leave the browser. This prompt template filler is built for teams who reuse prompts across customers, campaigns, or languages: maintain one canonical template, then fill in the variables per job instead of hand-editing copy and introducing typos.',
    examples: [
      {
        input: `You are a {{role}} with {{years}} years of experience.
Write a {{tone}} {{content_type}} about {{topic}} for {{audience}}.
Constraints:
- Length: {{length}} words
- Include {{num_examples}} examples
- Reading level: {{reading_level}}`,
        output:
          '9 variables detected — one labelled input for role, years, tone, content_type, topic, audience, length, num_examples, and reading_level. "0 of 9 filled". The final prompt keeps every {{placeholder}} visible until you type values.',
        note: 'The bundled sample template (Load sample). Duplicate names would share one field.',
      },
      {
        input:
          'Keep the sample template, then fill: role = copywriter, years = 7, tone = conversational, content_type = blog post, topic = email marketing, audience = small business owners, length = 600, num_examples = 2, reading_level = grade 8.',
        output: `You are a copywriter with 7 years of experience.
Write a conversational blog post about email marketing for small business owners.
Constraints:
- Length: 600 words
- Include 2 examples
- Reading level: grade 8`,
        note: '"9 of 9 filled" — every badge switches to the filled style and the Final prompt box updates on every keystroke.',
      },
      {
        input: `{{tone}} email about {{topic}}. Keep the {{tone}} throughout.
→ then type "friendly" into the tone field.`,
        output: `friendly email about {{topic}}. Keep the friendly throughout.`,
        note: 'The repeated {{tone}} resolves through one shared input; {{topic}} stays visible because it has no value yet — "1 of 2 filled".',
      },
    ],
    howTo: [
      'Paste a template containing {{name}} placeholders into the Prompt template field — the hint below updates with how many variables were detected.',
      'Use Load sample to load the bundled nine-variable content template, or keep your own template.',
      'Type a value into each input in the Variables card; the "N of M filled" counter and the badges track your progress.',
      'Watch the Final prompt box update live — filled variables are replaced everywhere, and empty ones stay visible as {{name}} placeholders.',
      'Click Fill placeholders to stub any remaining gaps with <value> hints, then copy or download the finished prompt via the results box.',
    ],
    useCases: [
      'Personalise outreach at scale — one cold-email template with {{name}}, {{company}}, and {{pain_point}} filled per recipient.',
      'Localise content prompts — the same template re-filled with a different {{language}} or {{tone}} per market.',
      'Reuse campaign templates across products — swap {{topic}} and {{audience}} instead of rewriting the prompt each quarter.',
      'Prepare batch generation jobs — produce dozens of filled prompts for a queue, keeping structure identical across the batch.',
      'Run checklist-style filling for teams — the "N of M filled" counter makes it obvious when a template is ready to ship.',
      'Teach prompt engineering — newcomers see exactly where variables belong in a template and what a filled prompt looks like.',
    ],
    bestPractices: [
      'Name variables with snake_case words ({{customer_name}}, {{num_examples}}): the Fill placeholders button converts underscores to spaces when generating stubs, giving readable values like <customer name>.',
      'Keep variable names stable across your team: the detector shares one input field for repeated names, so inconsistent naming between templates silently duplicates fields instead of merging them.',
      'Use the "N of M filled" counter as your release checklist — ship the prompt only when every variable is filled, since empty placeholders remain visible in the output and would reach the model as literal {{tokens}}.',
      'Fill the trickiest variables first (tone, reading_level) and stub the mechanical ones later — leaving placeholders visible in the final prompt shows exactly which blanks still need attention.',
      'Build one master template per workflow instead of per-campaign prompts: a single template with {{topic}} and {{audience}} means every variant inherits the same structure and only the values change.',
      'Use Fill placeholders as a scaffolding pass: it marks every gap with a bracketed hint, then you replace each hint with real values one field at a time.',
    ],
    faqs: [
      {
        q: 'What variable names does the replacer detect?',
        a: 'Placeholders must match {{name}} where the name starts with a letter or underscore and continues with letters, digits, or underscores — the same rule the tool displays in its How it works section. Names like {{customer_name}} or {{years}} are detected; anything else, such as {{123}} or {{first name}}, stays untouched in the output because it does not match the detection regex.',
      },
      {
        q: 'Why do empty variables stay in the output?',
        a: 'Deliberate design: the fill function leaves {{name}} visible whenever its value is empty so you can spot unfinished blanks at a glance. The Variables card reinforces this with an "N of M filled" counter. Once you type a value into the matching input, the placeholder is replaced everywhere in the final prompt and the counter ticks up.',
      },
      {
        q: 'What does the Fill placeholders button do?',
        a: 'It stubs every empty variable with an angle-bracket hint such as <role> or <reading level>, converting underscores to spaces. This turns a template with gaps into a complete-looking draft you can review end to end, and marks which blanks still need real values. It only affects variables that are currently empty; values you have already typed are left untouched.',
      },
      {
        q: 'Do duplicate variables share one input?',
        a: 'Yes. If your template repeats {{tone}} three times, the detector registers tone once and renders a single input field. Typing a value fills all three occurrences at once, which is why consistent naming matters: two differently named variables that should be the same thing get two separate fields and can drift apart.',
      },
      {
        q: 'What happens to variables I remove from the template?',
        a: 'Stored values are pruned automatically. When the detected variable list changes, an effect drops any saved value whose key no longer appears in the template, and the badges update to match. Re-adding the variable later shows an empty input again — the tool never reuses a stale value for a variable that is not present.',
      },
      {
        q: 'Is my prompt data sent anywhere?',
        a: 'No. Detection, substitution, and preview all run client-side in the browser; the only output is the live result in the Final prompt box, which you can copy or download as prompt.txt. This makes the tool safe for templates containing customer names, pricing, or internal product details that you would not paste into an online service.',
      },
    ],
    tips: [
      'Name your variables with underscores ({{num_examples}}, not {{numExamples}}): Fill placeholders converts underscores to spaces in the generated stubs.',
      'The Load sample button also clears your values — a handy reset when you want the template back without the clutter.',
      'Unfilled placeholders survive into the copied output, so give the final prompt one last scan for {{braces}} before pasting it into a model.',
      'Duplicate variables share one input — use that to keep repeated details like {{tone}} consistent across a long template for free.',
    ],
  },
  // ── system-prompt-generator ──

  'system-prompt-generator': {
    intro:
      'The System Prompt Generator assembles a structured, sectioned system prompt for any LLM from six simple inputs: role, task description, tone, constraints, output format, and language. Type "a senior copywriter" into the Role field, describe the task, pick a tone from professional, casual, friendly, or authoritative, choose among plain text, markdown, JSON, table, or bullet-list output, and add one constraint per line — the generator compiles everything into a clean markdown document with Role, Task, Tone, Constraints, Output format, Language, and Behaviour sections, closing with sensible guardrails such as asking a clarifying question on ambiguity. Three one-click presets (coding assistant, writing coach, and data analyst) pre-fill every field so you can study how a production-grade system prompt is structured, and a Blank button resets the form for a fresh build. Live badges show your current tone, format, and constraint count, and the finished prompt can be copied or downloaded as a .md file. Because assembly happens client-side, nothing is sent anywhere — making it a safe system prompt maker for proprietary products and internal tools.',
    examples: [
      {
        input:
          'Click Blank, then fill Role: "a senior copywriter specialised in B2B SaaS", Task: "Write landing-page copy, edit drafts, suggest headlines", and keep Tone: professional, Output format: text, Language: English.',
        output: `# Role
You are a senior copywriter specialised in B2B SaaS.

# Task
Write landing-page copy, edit drafts, suggest headlines

# Tone
Adopt a professional tone. Polished, neutral, third-person where appropriate.

# Output format
Respond in text. Plain prose paragraphs.

# Language
Respond in English.

# Behaviour
- If the request is ambiguous, ask one clarifying question before proceeding.
- If you do not know, say so explicitly rather than guessing.`,
        note: 'Blank resets tone to professional, format to text, and language to English; empty constraints mean no Constraints section.',
      },
      {
        input: 'Click the Data analyst preset.',
        output: `# Role
You are a senior data analyst with expertise in statistics and SQL.

# Task
Analyse datasets, write queries, interpret results, and surface insights. Always state assumptions.

# Tone
Adopt an authoritative tone. Direct, confident, decisive — minimal hedging.

# Constraints
- State assumptions before drawing conclusions
- Provide the SQL query alongside any interpretation
- Flag sample-size and bias concerns explicitly
- Round numbers sensibly and include units

# Output format
Respond in table. Markdown table with headers.

# Language
Respond in English.

# Behaviour
- If the request is ambiguous, ask one clarifying question before proceeding.
- If you do not know, say so explicitly rather than guessing.`,
        note: 'The preset fills all six inputs at once — the badges show Tone: authoritative, Format: table, and 4 constraints.',
      },
      {
        input:
          'Click Blank, set Role: "a research assistant", Task: "Summarise the article into key points", and change Output format to JSON.',
        output: `# Role
You are a research assistant.

# Task
Summarise the article into key points

# Tone
Adopt a professional tone. Polished, neutral, third-person where appropriate.

# Output format
Respond in JSON. Strict, valid JSON — no prose outside the JSON.

# Language
Respond in English.

# Behaviour
- If the request is ambiguous, ask one clarifying question before proceeding.
- If you do not know, say so explicitly rather than guessing.`,
        note: 'The Format badge updates to JSON and the Output format section now promises "Strict, valid JSON — no prose outside the JSON."',
      },
    ],
    howTo: [
      'Choose a starting point: click Coding assistant, Writing coach, or Data analyst to load a full preset, or Blank for empty fields.',
      'Fill the Inputs card: Role, Task description, Language, and one constraint per line in the Constraints field.',
      'Pick a Tone (professional, casual, friendly, or authoritative) and an Output format (text, markdown, JSON, table, or bullet list) from the dropdowns.',
      'Check the badges under Inputs — they confirm the tone, format, constraint count, and prompt length before you copy anything.',
      'Copy the Generated system prompt or download it as system-prompt.md, then paste it into your model\'s system-message field.',
    ],
    useCases: [
      'Create custom instructions for ChatGPT or Claude — a structured persona that persists across a conversation.',
      'Define an in-house coding assistant with explicit constraints (no partial diffs, flag security issues) for your team\'s API wrapper.',
      'Standardise customer-facing bots — generate one canonical system prompt per agent and version it in source control.',
      'Build a writing coach for non-native speakers — friendly tone, bullet-list feedback, and a three-changes-per-pass limit.',
      'Produce analysis prompts for data teams — authoritative tone plus table output keeps reports consistent.',
      'Rapidly prototype new personas — flip presets, tweak a field, and read the assembled markdown to evaluate an idea in seconds.',
    ],
    bestPractices: [
      'Put one constraint per line in the Constraints field: the generator turns each line into a markdown bullet, so mixing two ideas on one line produces one dense, hard-to-follow bullet.',
      'Match the tone to the output format: the JSON format description promises strict, valid JSON, so pair it with the authoritative or professional tone rather than a chatty one.',
      'State the role in plain language ("a senior copywriter specialised in B2B SaaS") — the generator prefixes it with "You are", so starting the role with "You are" yourself creates an awkward duplicate.',
      'Review the generated Behaviour section before using it: it is appended automatically to every prompt, and its clarifying-question guardrail may conflict with strict output formats like JSON.',
      'Use the three presets as templates, not final answers: apply a preset, then edit the role, task, and constraints to your situation — the structure survives while the specifics become yours.',
      'Download the .md file and version it alongside your code so the exact system prompt in production can be audited and diffed later.',
    ],
    faqs: [
      {
        q: 'What sections does the generated prompt include?',
        a: 'Up to seven markdown sections, each with a # heading: Role, Task, Tone, Constraints, Output format, Language, and Behaviour. Empty inputs are skipped — a blank role removes the Role section entirely. The Behaviour section is always appended and contains two fixed guardrails: ask one clarifying question when ambiguous, and admit when you do not know rather than guessing.',
      },
      {
        q: 'How do the four tone options differ?',
        a: 'Professional is polished, neutral, and third-person where appropriate; casual is conversational and first-person with contractions; friendly is warm, approachable, and encouraging; authoritative is direct, confident, and decisive with minimal hedging. Each tone adds a description line to the Tone section, so the final prompt states both the tone and what it means.',
      },
      {
        q: 'Which output formats are supported?',
        a: 'Five: plain text, markdown, JSON, table, and bullet list. The generated prompt names the format and appends a description — JSON promises "strict, valid JSON with no prose outside the JSON", while table promises a markdown table with headers. The Format badge above the result shows the current selection, and it can be changed at any time without touching the other fields.',
      },
      {
        q: 'What do the preset buttons load?',
        a: 'Three one-click presets: a coding assistant (a TypeScript/React/Node.js engineer with four constraints and markdown output), a writing coach (friendly tone, bullet-list output, three constraints), and a data analyst (authoritative tone, table output, four constraints). Each fills every field at once and the result regenerates instantly. The Blank button clears all inputs to professional/text defaults for a fresh build.',
      },
      {
        q: 'Can I write constraints as a paragraph?',
        a: 'You can, but one constraint per line is better. The generator splits the Constraints field on newlines, trims each line, and renders every line as a markdown bullet — a paragraph becomes a single long bullet. The hint above the field shows the constraint count so you can see exactly how many rules will appear in the output.',
      },
      {
        q: 'Where should I use a system prompt like this?',
        a: 'Anywhere an LLM product accepts a system message: ChatGPT custom instructions, API-based apps for GPT, Claude, or Gemini, or agent frameworks such as LangChain. Paste the generated markdown as-is, or adapt it — many teams keep the Role, Task, and Constraints sections and drop the Behaviour guardrails when the platform has its own handling.',
      },
    ],
    tips: [
      'Load a preset first even if you plan to start fresh — it demonstrates which fields a production-quality prompt actually fills.',
      'Write the role as a noun phrase ("a senior copywriter"), since the generator prepends "You are" automatically.',
      'The constraint counter catches formatting mistakes — if it shows 1 when you typed 4 lines, check for a stray paragraph break.',
      'When the model must answer in strict JSON, consider deleting the Behaviour section, whose clarifying questions would break the format.',
    ],
  },
  // ── prompt-library ──

  'prompt-library': {
    intro:
      'The Prompt Library is a browsable, searchable collection of twenty hand-curated LLM prompts spanning five categories: writing, coding, analysis, creative, and productivity. Built-ins range from an email subject line A/B tester and a code review checklist to a five-whys root cause analysis and a weighted decision matrix, each with a title, one-line description, and full prompt text that uses {{variable}} placeholders where you will need to fill in specifics. Search matches titles, descriptions, and prompt bodies, and a category dropdown narrows the list; stats cards show your total and per-category counts. You can copy any prompt with one click, add your own through the New prompt form, delete what you no longer need, and export the entire collection as JSON — then import it on another machine or share it with teammates, with duplicate detection built in. Everything persists in localStorage on your device, so there is no account, no upload, and no waiting: your curated prompt collection survives reloads and travels as a plain JSON file.',
    examples: [
      {
        input: 'Type "subject line" into the Search field.',
        output:
          '"Email subject line A/B test" (writing badge) — "Generate 10 subject line variants for an email campaign." — listed as the only match, with a Clear filters button now visible.',
        note: 'Search matches title, description, and prompt text, so a phrase you remember from the body finds the entry.',
      },
      {
        input:
          'Click Add prompt, enter Title "Release notes drafter", Category writing, Description "Turn commits into user-facing release notes", Prompt text "You are a technical writer. Turn the following commit list into user-facing release notes for {{product}}. Group changes into New, Improved, and Fixed. Use plain, jargon-free language."',
        output:
          '"Release notes drafter" appears at the top of the list, selected, with a Custom badge. Stats update: Total 21, Writing 5.',
        note: 'Title and prompt text are required; the description defaults to "No description." when left blank.',
      },
      {
        input: 'Click Export JSON, then re-import that file on another machine.',
        output:
          'A prompt-library.json download containing the full array of prompts (built-ins included). Importing merges entries and skips duplicates that match an existing title + text pair, showing a success toast with the imported count.',
        note: 'Import merges rather than replaces, so re-importing the same file is safe.',
      },
    ],
    howTo: [
      'Browse the list on the left: twenty built-in prompts with category badges such as writing, coding, and analysis.',
      'Narrow with the Search field (matches titles, descriptions, and prompt text) or the Category dropdown, and click Clear filters to reset both.',
      'Click any entry to open it in the detail card, then use Copy to send its text to the clipboard or the trash icon to delete it.',
      'Add your own: click Add prompt, fill Title, Category, Description, and Prompt text (with {{variables}}), then press Save prompt.',
      'Click Export JSON to back up the collection as prompt-library.json, or Import JSON to merge a file from another machine.',
    ],
    useCases: [
      'Onboard new team members — point them at the twenty built-ins so they start with proven prompts instead of blank textareas.',
      'Keep a personal catalogue of battle-tested prompts organised by writing, coding, analysis, creative, and productivity.',
      'Share prompt collections across a team — export one JSON file and import it on everyone\'s machine, with duplicate detection.',
      'Standardise output across campaigns — every writer copies the same blog intro hook template and fills its {{variables}}.',
      'Store client-specific prompt templates — one entry per client with their voice guidelines baked into the text.',
      'Curate prompts for a specific workflow — search "review" or "summary" to assemble a task-specific prompt set in seconds.',
    ],
    bestPractices: [
      'Use {{variable}} placeholders in saved prompts (as the built-ins do) so one library entry serves many jobs — {{topic}}, {{audience}}, and {{language}} turn a prompt into a reusable template.',
      'Search the full text, not just titles: the search box also matches prompt bodies, so pasting a keyword you remember from a prompt usually finds it even if the title is vague.',
      'Export before heavy editing sessions: the Export JSON button writes the entire collection to prompt-library.json, a cheap backup for localStorage data that a browser cleanup can wipe.',
      'Keep built-ins as your starter set and prune only what you truly never use: deleting a built-in is one click and the import file is the only way back.',
      'Write meaningful one-line descriptions when adding prompts: the description is what the list and search display, so a specific summary beats a title alone.',
      'Share collections with teammates via JSON: the importer deduplicates by title + text, so merging two people\'s libraries never creates double entries.',
    ],
    faqs: [
      {
        q: 'What prompts are included in the starter library?',
        a: 'Twenty built-in prompts, four per category. Writing covers a blog intro hook, email subject lines, README summaries, and press releases; coding covers review checklists, code explanation, unit tests, and refactoring; analysis covers root cause analysis, competitor comparisons, survey summaries, and risk assessments; creative and productivity add story openers, brand voice guidelines, weekly reviews, and more. Every built-in uses {{variable}} placeholders.',
      },
      {
        q: 'Where are my saved prompts stored?',
        a: 'In localStorage under the fl-prompt-library key, scoped to this browser and device. That means no account or server sync — and also that clearing site data removes your collection. Use Export JSON for a portable prompt-library.json backup you can re-import anywhere, including on other machines or after a browser reset.',
      },
      {
        q: 'Does importing merge or replace my library?',
        a: 'It merges. The importer reads a JSON array, validates each entry (title, text, and a known category are required), then prepends the valid ones to your collection while skipping duplicates that match an existing title + text pair. Invalid entries are ignored and a toast reports how many were imported, so re-importing the same file is safe.',
      },
      {
        q: 'What fields does the search box cover?',
        a: 'Title, description, and full prompt text. The query is case-insensitive and matches partial words, so a term like "subject" finds the email subject line prompt even though the word does not appear in its title alone. Combining search with the Category dropdown narrows results further, and Clear filters resets both at once.',
      },
      {
        q: 'Can I delete the built-in prompts?',
        a: 'Yes — every entry, built-in or custom, has a delete (trash) button in the detail card. Built-ins are only identified with a Built-in badge; there is no protection against deleting them. If you regret a deletion, the only recovery paths are re-importing an earlier JSON export or clearing the fl-prompt-library key from localStorage so the starter set returns.',
      },
      {
        q: 'Why should I use {{variables}} in my saved prompts?',
        a: 'Because the built-ins do, and it is what makes a prompt reusable. A single entry like the blog intro hook with {{title}} and {{audience}} serves every article you write, while the code review checklist with {{language}} and {{area}} adapts to any pull request. When you copy a prompt, the placeholders remain for you to fill — pair this with the Prompt Variable Replacer for automated filling.',
      },
    ],
    tips: [
      'The search box matches prompt bodies too — try single words like "checkbox" or "triage" instead of guessing exact titles.',
      'Add prompts with {{variables}} from day one: entries become templates, and the built-ins show you the naming style.',
      'Export before clearing your browser data — the JSON file is the only way to restore a hand-built collection.',
      'Duplicate a built-in by copying it and saving it under your own title, then edit the copy freely while the original stays intact.',
    ],
  },
  // ── prompt-version-manager ──

  'prompt-version-manager': {
    intro:
      'The Prompt Version Manager brings lightweight version control to prompt engineering. Give a prompt a name, paste its text, add an optional save message, and click Save version — the tool snapshots the exact text with a timestamp into a timeline grouped by prompt name. From there you can restore any historical version back into the editor, mark two versions as left and right to run a line-by-line diff with additions in green and removals in red, or delete individual snapshots. Stats cards report how many versions you have saved, how many distinct prompts they cover, and when your latest save happened, with relative timestamps such as "5m ago". The whole history exports to a single JSON file and imports back on any device, merging by version ID so duplicates are skipped. Data lives in localStorage under the fl-prompt-versions key — nothing is uploaded. This prompt history tracker is ideal for A/B testing prompt wording: save a version before each experiment so you can always explain, compare, or roll back a change instead of trying to remember what worked last week.',
    examples: [
      {
        input: `Prompt name: Code review assistant
Text:
You are a senior code reviewer. Review the following {{language}} code for {{concerns}}.
Respond in plain text.
Flag security issues explicitly.
Message: initial version`,
        output:
          'Stats update to Saved versions 1 · Distinct prompts 1 · Latest save "just now". The timeline shows the snapshot grouped under "Code review assistant" with its timestamp, the save message, a 280-character text preview, and a "latest" badge.',
        note: 'Both a prompt name and non-empty text are required — the form refuses to save otherwise.',
      },
      {
        input:
          'Edit the text to swap the second line for "Respond in JSON. Output only the JSON object.", set the save message to "added JSON output spec", and click Save version.',
        output: `Code review assistant — 2 versions
· [timestamp] · added JSON output spec · latest
· [timestamp] · initial version
Stats: Saved versions 2 · Distinct prompts 1 · Latest save just now`,
        note: 'Both snapshots stack under the same prompt name in newest-first order, with the newest marked latest.',
      },
      {
        input:
          'Click Diff (left) on the "initial version" snapshot and Diff (right) on the newest one.',
        output: `+1 added  −1 removed
  You are a senior code reviewer. Review the following {{language}} code for {{concerns}}.
− Respond in plain text.
+ Respond in JSON. Output only the JSON object.
  Flag security issues explicitly.`,
        note: 'Green lines are additions, red lines removals; the diff card also shows both version headers with name, timestamp, and message.',
      },
    ],
    howTo: [
      'Enter a Prompt name and the prompt text, plus an optional Save message describing what changed, then click Save version.',
      'Watch the stats update — Saved versions, Distinct prompts, and Latest save — and the snapshot appear on the timeline under its prompt name.',
      'Edit the text further and save again; repeat snapshots stack under the same name with the newest marked latest.',
      'Pick two snapshots via their Diff (left) and Diff (right) buttons to open the line-by-line comparison with added and removed counts.',
      'Use Restore to copy any snapshot back into the editor, or Export / Import to move the whole history between devices as JSON.',
    ],
    useCases: [
      'A/B test prompt wording — snapshot before each change so any experiment can be compared or rolled back.',
      'Track how a production prompt evolved — a grouped timeline with messages documents every tweak and its rationale.',
      'Recover an earlier draft — restore a snapshot whose wording outperformed later "improvements".',
      'Review prompt changes with a teammate — the side-by-side diff makes it trivial to see what changed line by line.',
      'Port prompts between machines — export the whole history as JSON and import it with duplicate-safe merging.',
      'Prepare a prompt release — diff the current candidate against the last shipped version before going live.',
    ],
    bestPractices: [
      'Write a save message every time: the timeline shows the message next to each snapshot, and "tightened tone, added JSON output spec" beats "No save message" when you diff a month later.',
      'Save before every A/B change, not after: a snapshot of the pre-change text is what makes the diff meaningful when you compare old and new wording.',
      'Diff across the same prompt name: the timeline groups versions by prompt name, so keep one consistent name per prompt and let messages carry the change notes.',
      'Restore is non-destructive: it copies the old name and text into the editor and keeps the history intact, so restore freely and save again if you want a new snapshot.',
      'Export the JSON before clearing localStorage or switching browsers — the fl-prompt-versions key lives only in this browser, and the export is the only portable copy.',
      'Delete experiments that lost: trimming failed variants keeps the timeline readable, since diffing works the same regardless of how many snapshots remain.',
    ],
    faqs: [
      {
        q: 'What is saved in each version snapshot?',
        a: 'Four fields: a unique version id, the prompt name, the full text, the optional save message, and a createdAt timestamp. The name groups snapshots on the timeline, the message explains the change, and the timestamp powers the relative "5m ago" display plus the Latest save stat. Nothing else is captured — no diffs are precomputed; comparisons run on demand.',
      },
      {
        q: 'How does the diff work?',
        a: 'You mark one version as Diff (left) and another as Diff (right); the tool then computes a line-based longest-common-subsequence diff between the two texts. Equal lines render neutral, added lines green with a + prefix, removed lines red with a − prefix, and badges summarise "+N added / −N removed". Picking the same version twice shows an amber warning to choose two different versions.',
      },
      {
        q: 'Does restoring a version delete anything?',
        a: 'No. Restore copies the selected snapshot\'s name and text back into the editor fields, leaving the entire history untouched. The intent is to recover an older wording so you can keep editing or save it as a new snapshot. The current editor content is simply replaced — unsaved edits are lost, so save a version first if you want to keep them.',
      },
      {
        q: 'Can I import versions exported from another browser?',
        a: 'Yes. Export downloads prompt-versions.json containing the whole library; Import accepts either that wrapped shape or a bare array of versions, validating name, text, and a numeric createdAt on each entry. Merging skips versions whose id already exists, so importing the same file twice is safe. New ids are generated for entries missing one.',
      },
      {
        q: 'How is this different from the Prompt Library?',
        a: 'The Library stores many different reusable prompts; the Version Manager stores the history of one prompt (or a few) over time. The Library optimises for browsing and copying a catalogue, while the Version Manager optimises for snapshots, messages, restore, and diffs. They complement each other: keep finished prompts in the Library and iterate draft wording in the Version Manager.',
      },
      {
        q: 'What does Clear all actually delete?',
        a: 'Every saved version, after a confirmation dialog that states the count and warns the action cannot be undone. The editor fields are left as they are, but the timeline, stats, and any selected diff sides reset to empty. If the history matters, run Export first — the JSON file is the only recovery path once localStorage has been cleared.',
      },
    ],
    tips: [
      'The Latest save stat is relative ("just now", "5m ago") — a quick way to confirm a save actually landed.',
      'Timestamps are your index: the message tells you why a version exists, and the timestamp tells you when.',
      'Diff (left) and Diff (right) can be picked in any order, and clicking a selected side again deselects it.',
      'Restore copies name and text into the editor without touching history — use it to resurrect wording you want to edit further.',
    ],
  },
  // ── ai-workflow-builder ──

  'ai-workflow-builder': {
    intro:
      'The AI Workflow Builder is a visual designer for multi-step LLM pipelines. Every step is a card holding a name, a prompt template with {{variable}} placeholders, a model selected from sixteen options across OpenAI, Anthropic, Google, Meta, Mistral, Cohere, and DeepSeek, and a temperature slider from 0 to 2. Steps run top to bottom, and a live flow diagram renders each as a numbered node with its model and T= badge, joined by arrows so the execution order is unmistakable. A Variables across workflow card aggregates every placeholder detected in the pipeline into a single checklist of runtime inputs. The tool is explicit that it designs rather than executes: no LLM API is ever called, and the finished artifact is a versioned JSON payload with an exportedAt timestamp that you can copy or download and feed into your own runner. Edits persist automatically in localStorage, and import/export lets the design travel between machines. For anyone planning a multi-step AI workflow — extraction, classification, generation — it turns a vague idea into a concrete, reviewable spec.',
    examples: [
      {
        input:
          'Click Add step twice. Step 1: rename to "Extract entities", prompt "Extract named entities from {{article}} and return them as JSON.", model GPT-4o mini, temperature 0.10. Step 2: rename to "Summarise", prompt "Summarise the entity list into a 3-bullet brief for {{audience}}.", keep GPT-4o and the 0.7 default.',
        output:
          'Stats: Steps 2 · Distinct models 2 · Variables 2. Each step card lists its own variables (article on step 1; audience on step 2), the Variables across workflow card shows {{article}} and {{audience}} once each, and the Flow diagram draws two numbered nodes joined by an arrow, with GPT-4o mini / T=0.10 and GPT-4o / T=0.70 badges.',
        note: 'New steps arrive named "Step 1", "Step 2"… with GPT-4o and temperature 0.7 preselected.',
      },
      {
        input: 'With those two steps in place, click Export JSON.',
        output: `{
  "version": 1,
  "exportedAt": "<ISO timestamp>",
  "steps": [
    {
      "id": "s-<generated>",
      "name": "Extract entities",
      "prompt": "Extract named entities from {{article}} and return them as JSON.",
      "model": "gpt-4o-mini",
      "temperature": 0.1
    },
    {
      "id": "s-<generated>",
      "name": "Summarise",
      "prompt": "Summarise the entity list into a 3-bullet brief for {{audience}}.",
      "model": "gpt-4o",
      "temperature": 0.7
    }
  ]
}`,
        note: 'Downloads as ai-workflow.json. Copy JSON writes the identical payload to the clipboard.',
      },
      {
        input: 'Import a JSON file — either this exported shape or a bare array of steps.',
        output:
          'Valid steps (a prompt string and a model string are required) replace the current design and a toast reports "Imported N step(s)". Missing ids are regenerated and a missing temperature falls back to 0.7.',
        note: 'Import replaces rather than merges — export first if you want to keep the current design.',
      },
    ],
    howTo: [
      'Click Add step to create the first step card — it arrives named "Step 1" with the GPT-4o model and a 0.7 temperature.',
      'Edit the step: rename it in the Step name field and write the prompt template in the Prompt template box, using {{variables}} for runtime inputs.',
      'Choose a Model from the sixteen-provider dropdown and drag the Temperature slider (0–2) to match the step\'s purpose.',
      'Reorder steps with the up/down arrows or remove them with the trash icon; the Flow diagram below redraws the sequence with arrows.',
      'Check the Steps / Distinct models / Variables stats and the Variables across workflow card, then Export JSON (or Copy JSON) for your pipeline.',
    ],
    useCases: [
      'Design a content pipeline — extract keywords, generate an outline, then draft the article, each as its own step.',
      'Plan a multi-model pipeline — cheap models (GPT-4o mini, Haiku) for extraction steps and expensive ones (GPT-4o, Opus) for synthesis.',
      'Define a data-analysis chain — classify, extract, and summarise in sequence with low temperatures for consistency.',
      'Sketch a support bot — intent detection, response drafting, and tone-check steps mapped visually before any code is written.',
      'Document a workflow for engineering — the exported JSON with version and timestamps doubles as a spec for implementation.',
      'Teach pipeline design — the flow diagram makes the concept of step order and variable flow concrete for learners.',
    ],
    bestPractices: [
      'Set temperature per step by purpose: use 0.0–0.3 for extraction and classification steps and 0.7–1.0 for generation — the slider\'s hint marks 0 as focused and 2 as creative.',
      'Keep model choice per step intentional: the designer tracks "Distinct models", so a pipeline that uses GPT-4o mini for extraction and GPT-4o for synthesis is a feature, not an accident.',
      'Use {{variables}} in every step template: the Variables overview card lists placeholders across the whole workflow, giving you a single checklist of runtime inputs before you wire the pipeline.',
      'Remember the tool designs but does not execute: no API calls are made, so prompts can reference any model in the list safely, but you must build your own runner from the exported JSON.',
      'Reorder with the arrows before exporting: step order in the JSON is execution order, and the flow diagram is your visual proof that the sequence reads top-to-bottom.',
      'Export after every design session: the payload includes a version field and exportedAt timestamp, which makes each ai-workflow.json a dated snapshot you can diff in source control.',
    ],
    faqs: [
      {
        q: 'Does the workflow builder execute my pipeline?',
        a: 'No. It is explicitly a designer: the alert at the top states "Designer only — no execution", and no LLM API is called at any point. You define steps, models, and temperatures, then export the JSON and wire it into your own runner — the exported payload contains everything a pipeline needs except the code that runs it.',
      },
      {
        q: 'Which models are available per step?',
        a: 'Sixteen across seven providers: OpenAI (GPT-4o, GPT-4o mini, GPT-4 Turbo, o1, o3-mini), Anthropic (Claude 3.5 Sonnet, 3.5 Haiku, 3 Opus), Google (Gemini 1.5 Pro, 2.0 Flash), Meta (Llama 3.1 70B and 405B), Mistral (Large, Mixtral 8x7B), Cohere (Command R+), and DeepSeek (V3). New steps default to GPT-4o; the model select shows each entry with its provider in parentheses.',
      },
      {
        q: 'What does the temperature slider control?',
        a: 'The per-step randomness setting, ranging from 0 (deterministic and focused) to 2 (highly creative) in 0.05 increments, defaulting to 0.7 for new steps. The value is stored in the exported JSON and shown as T=0.70 on the flow diagram. The Notes card suggests 0.0–0.7 for classification-style steps and 0.7–1.0 for generation.',
      },
      {
        q: 'How are {{variables}} handled in steps?',
        a: 'Each step\'s prompt template is scanned for {{name}} placeholders with the same regex used elsewhere on the site. Detected variables render as badges under the step and accumulate in the Variables across workflow card — the combined list of runtime inputs your pipeline must supply. They are placeholders only: no values are substituted or executed in the designer.',
      },
      {
        q: 'What format does Export JSON produce?',
        a: 'A versioned payload: { version: 1, exportedAt: ISO timestamp, steps: [...] }, where each step carries id, name, prompt, model, and temperature. The file downloads as ai-workflow.json, and Copy JSON puts the same content on the clipboard. Import accepts both this wrapped shape and a bare array of steps, replacing the current design.',
      },
      {
        q: 'Where is my workflow design saved?',
        a: 'Automatically in localStorage under fl-ai-workflow, so reloading the page restores your steps. Like all localStorage data it is browser- and device-specific, and a site-data wipe removes it. Export JSON regularly — the versioned file is both your backup and the artifact your execution pipeline will consume.',
      },
    ],
    tips: [
      'The flow diagram reuses the live step data, so rename a step and the diagram updates instantly — keep names short and action-oriented.',
      'Temperature is per step in the exported JSON, so a mixed pipeline can stay deterministic upstream and creative downstream.',
      'Import replaces the current design rather than merging — export first if the existing steps matter.',
      'Keep {{variable}} names consistent across steps: the Variables overview deduplicates, so the same placeholder appears once no matter how many steps use it.',
    ],
  },
}