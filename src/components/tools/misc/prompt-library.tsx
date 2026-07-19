'use client'
import * as React from 'react'
import {
  Plus,
  Search,
  Trash2,
  Copy,
  Download,
  Upload,
  Library,
  BookOpen,
  X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Field, Stat, downloadBlob, randomInt } from '@/lib/tools/tool-ui'
import { useCopy } from '@/lib/tools/use-copy'
import { toast } from 'sonner'
type Category = 'writing' | 'coding' | 'analysis' | 'creative' | 'productivity'
const CATEGORIES: Category[] = [
  'writing',
  'coding',
  'analysis',
  'creative',
  'productivity',
]
interface Prompt {
  id: string
  title: string
  category: Category
  description: string
  text: string
  builtIn?: boolean
}
const STORAGE_KEY = 'fl-prompt-library'
const STARTER_PROMPTS: Prompt[] = [
  {
    id: 'builtin-1',
    title: 'Blog post intro hook',
    category: 'writing',
    description: 'Generate a compelling 100-word intro that hooks the reader.',
    text: `You are a senior content writer. Write a 100-word introduction for a blog post titled "{{title}}" targeting {{audience}}.
Open with a surprising statistic or question. Preview the article's value without giving away the conclusion. Use a confident, conversational tone — no marketing fluff. Plain text, no headings.`,
    builtIn: true,
  },
  {
    id: 'builtin-2',
    title: 'Email subject line A/B test',
    category: 'writing',
    description: 'Generate 10 subject line variants for an email campaign.',
    text: `You are an email marketing copywriter. Generate 10 subject line variants for a campaign about {{topic}}.
Constraints:
- Max 50 characters each
- Mix curiosity, urgency, benefit, and personalization angles
- No clickbait or deceptive claims
- Output as a numbered list`,
    builtIn: true,
  },
  {
    id: 'builtin-3',
    title: 'README summary',
    category: 'writing',
    description: 'Turn a repo description into a polished README intro.',
    text: `You are a technical writer. Write the opening "Overview" section of a README for an open-source project named {{project}}.
Inputs:
- One-line description: {{description}}
- Primary language: {{language}}
- Target user: {{audience}}
Format as markdown. Include a 2-3 sentence overview, a "Key features" bullet list (3-5 items), and a "Quick start" code block.`,
    builtIn: true,
  },
  {
    id: 'builtin-4',
    title: 'Press release draft',
    category: 'writing',
    description: 'Standard press release structure for a product launch.',
    text: `Act as a PR specialist. Draft a 400-word press release for {{company}} announcing {{announcement}}.
Use the inverted pyramid structure:
- Strong headline
- Dateline + 1-paragraph summary
- Quote from {{spokesperson}}
- Supporting details
- Boilerplate "About {{company}}" paragraph
- Media contact placeholder
Tone: professional, factual, no hype words.`,
    builtIn: true,
  },
  {
    id: 'builtin-5',
    title: 'Code review checklist',
    category: 'coding',
    description: 'Generate a tailored code review checklist for a PR.',
    text: `You are a senior engineer reviewing a pull request. Generate a code review checklist for a {{language}} change that touches {{area}}.
Include 8-12 items covering:
- Correctness and edge cases
- Security implications
- Performance considerations
- Test coverage
- Naming and readability
- Backward compatibility
Format as a markdown checklist. Be specific to {{language}} idioms and {{area}} concerns.`,
    builtIn: true,
  },
  {
    id: 'builtin-6',
    title: 'Explain this code',
    category: 'coding',
    description: 'Plain-English explanation of a code snippet for non-engineers.',
    text: `Explain the following code to a non-technical stakeholder. Use an analogy where helpful. Do not exceed 150 words. End with one sentence on what could go wrong if this code breaks.
\`\`\`
{{code}}
\`\`\``,
    builtIn: true,
  },
  {
    id: 'builtin-7',
    title: 'Unit test generator',
    category: 'coding',
    description: 'Produce unit tests for a given function.',
    text: `You are a test engineer. Write {{framework}} unit tests for the following function:
\`\`\`
{{code}}
\`\`\`
Cover:
- Happy path
- Empty / null inputs
- Boundary values
- Edge cases specific to the function's domain
- One negative test
Use describe/it blocks. Mock external calls. No comments — let the test names speak.`,
    builtIn: true,
  },
  {
    id: 'builtin-8',
    title: 'Refactor for readability',
    category: 'coding',
    description: 'Suggest a cleaner version of a function with rationale.',
    text: `Refactor the following {{language}} code for readability. Preserve behavior exactly.
\`\`\`
{{code}}
\`\`\`
Output:
1. The refactored code in a code block
2. A 3-bullet summary of what you changed and why
3. Any trade-offs or risks the reviewer should know`,
    builtIn: true,
  },
  {
    id: 'builtin-9',
    title: 'Root cause analysis',
    category: 'analysis',
    description: 'Five-whys analysis for a production incident.',
    text: `You are a site reliability engineer. Perform a "five whys" root cause analysis on the following incident:
Incident: {{description}}
Symptoms: {{symptoms}}
Timeline: {{timeline}}
For each "why", state the assumption, the answer, and the evidence. End with:
- Direct cause
- Contributing causes
- Two prevention actions (one technical, one process)`,
    builtIn: true,
  },
  {
    id: 'builtin-10',
    title: 'Competitor feature comparison',
    category: 'analysis',
    description: 'Structured comparison matrix of competing products.',
    text: `You are a product analyst. Build a feature comparison matrix for these competitors: {{competitors}}.
Topic area: {{topic}}
Output as a markdown table with:
- Competitor names as columns
- 8-12 feature rows (mix of must-have and differentiating features)
- Use ✓, ✗, or "Partial" in cells
- Add a "Verdict" row that summarizes each competitor's positioning in one sentence`,
    builtIn: true,
  },
  {
    id: 'builtin-11',
    title: 'Survey results summary',
    category: 'analysis',
    description: 'Turn raw survey data into an executive summary.',
    text: `You are a research analyst. Summarize the following survey results for an executive audience in under 250 words.
Raw data:
{{data}}
Include:
- Top 3 findings (with the supporting stat)
- One surprising insight
- Two recommended actions
- One open question for follow-up research`,
    builtIn: true,
  },
  {
    id: 'builtin-12',
    title: 'Risk assessment',
    category: 'analysis',
    description: 'Identify and prioritize risks for a project.',
    text: `Act as a project risk manager. Identify the top 8 risks for: {{project_description}}.
For each risk provide:
- Risk name
- Likelihood (Low/Medium/High)
- Impact (Low/Medium/High)
- Mitigation strategy (1 sentence)
- Owner role
Sort by likelihood × impact descending. Output as a markdown table.`,
    builtIn: true,
  },
  {
    id: 'builtin-13',
    title: 'Short story opener',
    category: 'creative',
    description: 'Generate 3 alternative opening paragraphs for a story.',
    text: `You are a literary fiction writer. Write 3 distinct opening paragraphs (80-120 words each) for a story set in {{setting}} featuring {{character}}.
Each opener should use a different narrative hook:
1. Action
2. Voice / interior monologue
3. Atmospheric description
Label each clearly. No clichés. Avoid adverbs.`,
    builtIn: true,
  },
  {
    id: 'builtin-14',
    title: 'Brand voice guidelines',
    category: 'creative',
    description: 'Define a brand voice from sample copy.',
    text: `You are a brand strategist. Analyze the following sample copy and produce brand voice guidelines for {{brand}}.
Sample copy:
{{samples}}
Output:
- 3 voice attributes (single words)
- "We are / We are not" table (4 rows)
- Do/Don't examples for emails and social posts
- One sentence positioning statement`,
    builtIn: true,
  },
  {
    id: 'builtin-15',
    title: 'Product name brainstorm',
    category: 'creative',
    description: 'Generate 20 candidate names with rationale.',
    text: `Brainstorm 20 product names for {{product_description}}.
Constraints:
- 1-2 words, max 12 characters
- Easy to pronounce
- .com domain likely available (use real-word or compound constructions)
- No trademark-obvious collisions with major brands
For each name give a one-line rationale. Group by style: descriptive, evocative, invented, metaphorical.`,
    builtIn: true,
  },
  {
    id: 'builtin-16',
    title: 'Metaphor generator',
    category: 'creative',
    description: 'Five fresh metaphors for explaining an abstract concept.',
    text: `Generate 5 fresh metaphors for explaining "{{concept}}" to a {{audience}}.
Rules:
- No clichés (avoid "is like a highway", "is a journey", etc.)
- Each metaphor ≤ 30 words
- Vary the source domain (sports, cooking, music, nature, machinery)
- End each with the single insight it reveals about the concept`,
    builtIn: true,
  },
  {
    id: 'builtin-17',
    title: 'Weekly review',
    category: 'productivity',
    description: 'Structured weekly retrospective prompt.',
    text: `You are my productivity coach. Walk me through a weekly review.
Ask me one question at a time, wait for my answer, then ask the next:
1. What were my top 3 wins this week?
2. What was the biggest lesson learned?
3. What did I commit to but not finish? Why?
4. What is the single most important outcome for next week?
5. What support do I need?
After my fifth answer, output a 1-paragraph summary and a 3-item priority list for next week.`,
    builtIn: true,
  },
  {
    id: 'builtin-18',
    title: 'Meeting agenda builder',
    category: 'productivity',
    description: 'Draft a focused agenda from a meeting goal.',
    text: `You are a meeting facilitator. Build a tight agenda for a {{duration}}-minute meeting with goal: {{goal}}.
Attendees: {{attendees}}
Output:
- 1-sentence desired outcome
- Agenda items with timeboxes (in minutes) summing to {{duration}}
- For each item: owner role and decision/output expected
- Pre-reads required (if any)
- "Skip if" criteria — when to cancel the meeting`,
    builtIn: true,
  },
  {
    id: 'builtin-19',
    title: 'Decision matrix builder',
    category: 'productivity',
    description: 'Weighted decision matrix for choosing between options.',
    text: `Help me decide between these options: {{options}}.
Build a weighted decision matrix:
1. Ask me for 4-6 criteria and their weights (sum to 100)
2. Ask me to score each option 1-5 on each criterion
3. Compute weighted scores
4. Recommend the top option and name the second-place finisher
5. State the key risk of the recommended choice in one sentence
Wait for my input between steps.`,
    builtIn: true,
  },
  {
    id: 'builtin-20',
    title: 'Inbox triage plan',
    category: 'productivity',
    description: 'Sort a list of emails into action categories.',
    text: `You are an executive assistant. I will paste a list of email subjects and senders. Triage each into one of four buckets:
- DO NOW (< 2 min)
- SCHEDULE (calendar/block time)
- DELEGATE (name the role that should handle it)
- DEFER / DELETE
Output as a markdown table. After the table, list the 3 most important items in priority order with a one-line next action each.
Emails:
{{emails}}`,
    builtIn: true,
  },
]
function makeId(): string {
  // Non-security-relevant unique ID; uses the shared secure RNG helper
  // (no Math.random, per project conventions).
  return `user-${Date.now().toString(36)}-${randomInt(1_000_000).toString(36)}`
}
function loadPrompts(): Prompt[] {
  if (typeof window === 'undefined') return STARTER_PROMPTS
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return STARTER_PROMPTS
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return STARTER_PROMPTS
    return parsed as Prompt[]
  } catch {
    return STARTER_PROMPTS
  }
}
function savePrompts(prompts: Prompt[]): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(prompts))
  } catch {
    toast.error('Could not save to localStorage — quota exceeded?')
  }
}
export default function PromptLibrary(): React.JSX.Element {
  const [prompts, setPrompts] = React.useState<Prompt[]>(STARTER_PROMPTS)
  const [hydrated, setHydrated] = React.useState<boolean>(false)
  const [search, setSearch] = React.useState<string>('')
  const [category, setCategory] = React.useState<'all' | Category>('all')
  const [selectedId, setSelectedId] = React.useState<string | null>(null)
  const [showForm, setShowForm] = React.useState<boolean>(false)
  const [formTitle, setFormTitle] = React.useState<string>('')
  const [formCategory, setFormCategory] = React.useState<Category>('writing')
  const [formDescription, setFormDescription] = React.useState<string>('')
  const [formText, setFormText] = React.useState<string>('')
  const fileInputRef = React.useRef<HTMLInputElement | null>(null)
  const { copy } = useCopy()
  // Hydrate from localStorage on mount (client-only).
  React.useEffect(() => {
    setPrompts(loadPrompts())
    setHydrated(true)
  }, [])
  // Persist on change (after hydration).
  React.useEffect(() => {
    if (!hydrated) return
    savePrompts(prompts)
  }, [prompts, hydrated])
  const filtered = React.useMemo(() => {
    const q = search.trim().toLowerCase()
    return prompts.filter((p) => {
      if (category !== 'all' && p.category !== category) return false
      if (!q) return true
      return (
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.text.toLowerCase().includes(q)
      )
    })
  }, [prompts, search, category])
  const selected = React.useMemo(
    () => prompts.find((p) => p.id === selectedId) ?? null,
    [prompts, selectedId]
  )
  const counts = React.useMemo(() => {
    const byCat: Record<string, number> = {}
    for (const c of CATEGORIES) byCat[c] = 0
    for (const p of prompts) byCat[p.category] = (byCat[p.category] ?? 0) + 1
    return byCat
  }, [prompts])
  const handleAdd = (): void => {
    const title = formTitle.trim()
    const text = formText.trim()
    if (!title) {
      toast.error('Title is required')
      return
    }
    if (!text) {
      toast.error('Prompt text is required')
      return
    }
    const newPrompt: Prompt = {
      id: makeId(),
      title,
      category: formCategory,
      description: formDescription.trim() || 'No description.',
      text,
    }
    setPrompts((prev) => [newPrompt, ...prev])
    setFormTitle('')
    setFormDescription('')
    setFormText('')
    setFormCategory('writing')
    setShowForm(false)
    setSelectedId(newPrompt.id)
    toast.success('Prompt added to your library')
  }
  const handleDelete = (id: string): void => {
    setPrompts((prev) => prev.filter((p) => p.id !== id))
    if (selectedId === id) setSelectedId(null)
    toast.success('Prompt deleted')
  }
  const handleExport = (): void => {
    const blob = new Blob([JSON.stringify(prompts, null, 2)], {
      type: 'application/json',
    })
    downloadBlob(blob, 'prompt-library.json')
    toast.success('Library exported')
  }
  const handleImportClick = (): void => {
    fileInputRef.current?.click()
  }
  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const parsed: unknown = JSON.parse(String(reader.result))
        if (!Array.isArray(parsed)) {
          toast.error('Invalid file — expected a JSON array of prompts')
          return
        }
        const valid: Prompt[] = []
        for (const item of parsed) {
          const p = item as Partial<Prompt>
          if (
            typeof p.title === 'string' &&
            typeof p.text === 'string' &&
            typeof p.category === 'string' &&
            CATEGORIES.includes(p.category as Category)
          ) {
            valid.push({
              id: typeof p.id === 'string' ? p.id : makeId(),
              title: p.title,
              category: p.category as Category,
              description: typeof p.description === 'string' ? p.description : '',
              text: p.text,
            })
          }
        }
        if (valid.length === 0) {
          toast.error('No valid prompts found in file')
          return
        }
        setPrompts((prev) => {
          // Merge: skip duplicates by title+text.
          const seen = new Set(prev.map((p) => `${p.title}|${p.text}`))
          const additions = valid.filter((p) => {
            const key = `${p.title}|${p.text}`
            if (seen.has(key)) return false
            seen.add(key)
            return true
          })
          return [...additions, ...prev]
        })
        toast.success(`Imported ${valid.length} prompt(s)`)
      } catch {
        toast.error('Could not parse JSON file')
      } finally {
        if (fileInputRef.current) fileInputRef.current.value = ''
      }
    }
    reader.onerror = () => toast.error('Could not read file')
    reader.readAsText(file)
  }
  return (
    <div className="space-y-5">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Library className="size-4" />
            Prompt Library
          </CardTitle>
          <CardDescription>
            A browsable library of curated prompts across writing, coding,
            analysis, creative, and productivity. Search, filter by category,
            copy, add your own, and export/import as JSON. Persisted to
            localStorage on this device.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-[1fr_180px]">
            <Field label="Search" htmlFor="pl-search">
              <div className="relative">
                <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="pl-search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search title, description, or prompt text…"
                  className="pl-9"
                />
              </div>
            </Field>
            <Field label="Category" htmlFor="pl-cat">
              <Select
                value={category}
                onValueChange={(v) => setCategory(v as 'all' | Category)}
              >
                <SelectTrigger id="pl-cat" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All categories</SelectItem>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c.charAt(0).toUpperCase() + c.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              size="sm"
              onClick={() => setShowForm((s) => !s)}
              className="bg-primary text-primary-foreground"
            >
              <Plus className="size-3.5" />
              {showForm ? 'Cancel' : 'Add prompt'}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleExport}
              disabled={prompts.length === 0}
            >
              <Download className="size-3.5" />
              Export JSON
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleImportClick}
            >
              <Upload className="size-3.5" />
              Import JSON
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/json,.json"
              onChange={handleImportFile}
              className="sr-only"
              aria-label="Import prompts from JSON file"
            />
          </div>
          {showForm ? (
            <div className="space-y-3 rounded-lg border border-border bg-muted/20 p-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">New prompt</h3>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-7"
                  onClick={() => setShowForm(false)}
                  aria-label="Close form"
                >
                  <X className="size-4" />
                </Button>
              </div>
              <Field label="Title" htmlFor="pl-form-title">
                <Input
                  id="pl-form-title"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Release notes drafter"
                />
              </Field>
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Category" htmlFor="pl-form-cat">
                  <Select
                    value={formCategory}
                    onValueChange={(v) => setFormCategory(v as Category)}
                  >
                    <SelectTrigger id="pl-form-cat" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c.charAt(0).toUpperCase() + c.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Description" htmlFor="pl-form-desc">
                  <Input
                    id="pl-form-desc"
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    placeholder="One-line summary"
                  />
                </Field>
              </div>
              <Field label="Prompt text" htmlFor="pl-form-text" hint="use {{variables}} for placeholders">
                <Textarea
                  id="pl-form-text"
                  value={formText}
                  onChange={(e) => setFormText(e.target.value)}
                  placeholder="You are… {{variable}}…"
                  rows={6}
                  className="font-mono text-sm"
                  spellCheck={false}
                />
              </Field>
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  size="sm"
                  onClick={handleAdd}
                  className="bg-primary text-primary-foreground"
                >
                  Save prompt
                </Button>
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <Stat label="Total" value={prompts.length} />
        {CATEGORIES.map((c) => (
          <Stat
            key={c}
            label={c.charAt(0).toUpperCase() + c.slice(1)}
            value={counts[c] ?? 0}
          />
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {/* List */}
        <div className="space-y-2">
          <div className="flex items-baseline justify-between">
            <h3 className="text-sm font-medium text-foreground">
              {filtered.length} prompt{filtered.length === 1 ? '' : 's'}
            </h3>
            {search || category !== 'all' ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-7 text-xs"
                onClick={() => {
                  setSearch('')
                  setCategory('all')
                }}
              >
                Clear filters
              </Button>
            ) : null}
          </div>
          <ScrollArea className="max-h-[28rem] rounded-lg border border-border bg-background">
            {filtered.length === 0 ? (
              <div className="px-3 py-12 text-center text-sm text-muted-foreground">
                No prompts match your filters.
              </div>
            ) : (
              <ul className="divide-y divide-border">
                {filtered.map((p) => (
                  <li key={p.id}>
                    <button
                      type="button"
                      onClick={() => setSelectedId(p.id)}
                      className={`flex w-full flex-col gap-1 px-3 py-3 text-left transition hover:bg-muted/50 ${
                        selectedId === p.id ? 'bg-muted/70' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-medium text-foreground">
                          {p.title}
                        </span>
                        <Badge variant="outline" className="text-[10px] capitalize">
                          {p.category}
                        </Badge>
                      </div>
                      <span className="text-xs text-muted-foreground line-clamp-2">
                        {p.description}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </ScrollArea>
        </div>
        {/* Detail */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <BookOpen className="size-4" />
              {selected ? selected.title : 'Select a prompt'}
            </CardTitle>
            <CardDescription>
              {selected
                ? selected.description
                : 'Click a prompt on the left to view it here.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {selected ? (
              <>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary" className="capitalize">
                    {selected.category}
                  </Badge>
                  {selected.builtIn ? (
                    <Badge variant="outline">Built-in</Badge>
                  ) : (
                    <Badge variant="outline">Custom</Badge>
                  )}
                  <div className="ml-auto flex gap-1">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        copy(selected.text, 'Prompt copied to clipboard')
                      }
                    >
                      <Copy className="size-3.5" />
                      Copy
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="size-8 text-muted-foreground hover:text-rose-500"
                      onClick={() => handleDelete(selected.id)}
                      aria-label="Delete prompt"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
                <pre className="fl-scroll max-h-[24rem] overflow-auto rounded-lg border border-border bg-muted/30 p-3 text-xs whitespace-pre-wrap break-words font-mono">
                  {selected.text}
                </pre>
              </>
            ) : (
              <div className="rounded-md border border-dashed border-border/70 bg-muted/20 px-3 py-12 text-center text-sm text-muted-foreground">
                Pick a prompt from the list to see its full text and copy it.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}