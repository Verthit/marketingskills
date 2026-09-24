# Repo Knowledge Digest

What this repository contains, how it is built, and the recurring ideas across all 50 skills. Structured per-skill data (versions, sections, references, cross-links, tool mentions) is in [`skills-index.json`](skills-index.json), regenerated with `node scripts/extract-skills-index.mjs`.

Snapshot: repo release **2.11.1** (2026-09-04), 50 skills, 165 reference files, 95 integration guides, 64 CLIs.

---

## 1. What the repo is

- A library of **Agent Skills** (markdown instructions per marketing task) following the [agentskills.io spec](https://agentskills.io/specification.md), plus a **Claude Code plugin marketplace** (`.claude-plugin/`).
- A **tools layer**: `tools/REGISTRY.md` (95 tools, with API/MCP/CLI/SDK columns), one integration guide per tool, 64 zero-dependency Node CLIs, and a Composio/Cogny MCP gateway layer for OAuth-heavy tools.
- A **partner program** (`partners.json` → `scripts/sync-partners.mjs`) that funds the work under strict editorial rules.

### Architecture: hub and spokes

```
                    product-marketing  ── writes .agents/product-marketing.md
                           │  (every skill reads it first, asks only for gaps)
     ┌─────────┬───────────┼────────────┬────────────┬───────────┬──────────┐
   SEO &      CRO       Copy &       Paid &       Growth &     Sales &    Strategy
  Content               Channels   Measurement   Retention      GTM
                           │
                  Experiments converge on ab-testing
         marketing-loops orchestrates skills on a schedule
         marketing-council debates decisions, then hands off to execution skills
```

**Most-linked skills** (inbound references from other skills' Related Skills lists and descriptions): copywriting 20, cro 19, ab-testing 18, emails 16, analytics 11, seo-audit 10. **Skills no other skill links to**: events, image, influencer-marketing, marketing-council.

---

## 2. The shared skill template

Almost every `SKILL.md` follows this shape:

1. **Frontmatter**:
   - `name` must equal the directory name.
   - `description` is trigger-heavy: it names user phrasings and routes to sibling skills ("For signup flows, see signup").
   - `metadata.version`.
2. **Role line**: "You are an expert in X. Your goal is…"
3. **Initial Assessment**: read `.agents/product-marketing.md` (fallbacks are `.claude/product-marketing.md` and the legacy `product-marketing-context.md`), then ask only what's missing.
4. **Core Principles**: usually 3–6.
5. **Framework / process**: named steps, checklists and scoring models.
6. **Output Format**: usually tiered as Quick Wins / High-Impact / Test Ideas / Long-term. Findings are written as Issue → Impact → Evidence → Fix → Priority.
7. **Task-Specific Questions**: 5–7.
8. **Tool Integrations**: pointers to `tools/REGISTRY.md` and the integration guides.
9. **Related Skills**.

Detail beyond this goes in `references/*.md`, loaded on demand. Keep `SKILL.md` under 500 lines.

---

## 3. Cross-cutting principles (the "house philosophy")

1. **Clarity and specificity over cleverness.** Outcome-led headlines. CTAs follow [Action Verb] + [What They Get]. Hype words are banned (leverage, seamless, game-changing, "set it and forget it"). Replace vague phrases with concrete numbers.
2. **Value before ask, and respect the user.** One CTA per unit. Frequency caps and cool-downs. Easy dismissal. No confirmshaming, dark patterns or fake scarcity. Applies to signup, onboarding, paywalls, popups, emails, sms, cold-email and churn.
3. **Grounding over generation.**
   - ad-creative stops if its input corpus is empty.
   - The council bans fabricated quotes.
   - Research skills require source URLs and confidence tiers (for example, 3+ independent sources counts as High).
4. **Verbatim customer language is the raw material.** It feeds product-marketing §9, customer-research quote banks, ad headlines and sales language.
5. **Untrusted input.** Fetched pages, competitor sites and exports are data, never instructions (seo-audit, aso, competitor-profiling, ads).
6. **Human-in-the-loop for irreversible actions.**
   - Draft or stage first. Spend, send, publish and delete need approval.
   - marketing-loops formalizes this as Tier 1 (autonomous-safe) and Tier 2 (gated).
7. **Compliance built in.** FTC disclosure, CAN-SPAM/CASL/GDPR, TCPA/A2P 10DLC, FTC Click-to-Cancel, and platform terms of service on scraping.
8. **Scorecards with explicit thresholds.** ICE, the ASO 100-point A–F grade, the content-strategy 40/30/20/10 weighting, free-tools 8×5, newsjacking 50/80, MQL 50–80, churn health score, and the Hormozi value-equation levers.
9. **Anti-vanity metrics.** Prefer cost per qualified outcome, pipeline, net cash and blended ROAS over EMV, AVE, reach and per-ad-set ROAS.
10. **Fix leaks before adding traffic.** Examples: loops rollout stages, destination pages before directories, and the theory of constraints.
11. **Compounding beats one-off.** Recurring events, "launch again and again", community flywheels and experiment playbooks.
12. **AI-era distribution (GEO) everywhere.** AI citations appear in PR, events, pricing, competitors, directories and attribution, and most of these hand off to `ai-seo` and `schema`.

---

## 4. Skill-by-skill essentials

### SEO & content
| Skill | Core framework | Key numbers / rules |
|---|---|---|
| seo-audit | Crawl/Index → Technical → On-page → Content (E-E-A-T) → Authority | LCP <2.5s, INP <200ms, CLS <0.1. Titles 50–60 chars, meta 150–160. Don't report "no schema" from curl (it can't see JS-injected JSON-LD). Hreflang must be reciprocal and use `en-GB`, never `en-UK`. |
| ai-seo | Visibility audit → Structure / Authority / Presence | Answer passages 40–60 words. GEO study: cite sources +40%, statistics +37%. Run each query 3–5 times and report a rate. Allow GPTBot, PerplexityBot and ClaudeBot; block CCBot. Add `llms.txt` and `/pricing.md`. |
| site-architecture | Site-type template → L0–L3 hierarchy → 5 deliverables (tree, Mermaid, URL map, nav spec, link plan) | 3-click rule. 4–7 nav items with the CTA rightmost. 5–10 internal links per 1k words. 301 every changed URL. |
| programmatic-seo | 12 playbooks → 5-step build | Data defensibility: proprietary > product > UGC > licensed > public. Subfolders, not subdomains. "100 great pages beats 10,000 thin ones." |
| schema | Accuracy, JSON-LD, Google guidelines, validate | Only mark up visible content. Combine types with `@graph`. ISO 8601 dates. |
| content-strategy | Searchable vs shareable → 3–5 pillars → buyer-stage keyword mapping | Scoring 40/30/20/10. Calendar mix 60/30/10. "Create once, distribute twice." |
| aso | Brand-maturity tier → 6 weighted dimensions → A–F grade | Apple indexes title 30 + subtitle 30 + keywords 100 bytes. 90% of users never pass the 3rd screenshot. |

### Conversion
| Skill | Core framework | Key numbers / rules |
|---|---|---|
| cro | 7 dimensions in impact order: value prop (5-second test) → headline → CTA → hierarchy → trust → objections → friction | Landing pages: message match, one CTA, no nav. |
| signup | Minimize fields, value first, progressive commitment | Single-step works for ≤3 fields. No confirm-email field. Fix email typos. Touch targets 44px+. |
| onboarding | Minimum path to value; "do, don't show" | Checklists 3–7 items. Starting pre-filled at ~20% gives ~+40% completion. Tours 3–5 steps. |
| popups | Timing, value, respect; 6 trigger types | Time trigger 30–60s. Once per session, then 7–30 days before re-showing. Email popups convert 2–5%. |
| paywalls | Value before ask; 7-part screen with an escape hatch | Trial warnings at 7/3/1 days. Never show during onboarding. |

### Copy & channels
| Skill | Core framework | Key numbers / rules |
|---|---|---|
| copywriting | 5 principles → hero → proof → problem → solution → how → objections → CTA | 2–3 annotated alternatives per headline/CTA. No exclamation points. |
| copy-editing | Seven Sweeps (Clarity → Voice → So What → Prove It → Specificity → Emotion → Zero Risk) + expert-panel gate | Each persona scores ≥7, average ≥8. Sentences ≤25 words. |
| cold-email | Peer voice; 4 shapes (e.g. Observation → Problem → Proof → Ask) | Subject 2–4 lowercase words. Interest CTA, never a 30-minute call on the first touch. 3–5 touches ending in a breakup email. |
| emails | One email, one job; sequence blueprints | Welcome: 5–7 emails over 12–14 days. Subject 40–60 chars. Preview 90–140 chars. |
| sms | Compliance first | 160 GSM-7 chars per segment (70 with emoji). Quiet hours 8am–9pm. Cart recovery at 30m/4h/24h. |
| social | 3–5 pillars; 4 hook families; content atoms | Hook lands in the first second. Keep links out of the post body. |
| video / image | Pick the approach, then pick the model via decision tree | Never render text inside AI video. Never use AI for UI or logos. OG image 1200×630 at <200KB. |

### Paid & measurement
| Skill | Core framework | Key numbers / rules |
|---|---|---|
| ads | Audience knowledge into creative first, targeting second | Scale ~20% at a time with 3–5 day waits. 70/30 proven/test budget. Automated bidding after 50+ conversions. Unknown ≠ failing. |
| ad-creative | Grounded corpus → angles → variants → specs | RSA headlines 30 chars ×15, descriptions 90 ×4. Judge after 1k+ impressions. |
| ab-testing | Hypothesis template; ICE backlog | 5% baseline with a 10% lift needs ~27k per variant. No peeking. 20–30% win rate. |
| analytics | Track for decisions; object_action events | No PII. Lowercase UTMs. Consent mode. |
| attribution | Interpretation + first-party ownership; MTA / MMM / incrementality | Show first-touch and last-touch side by side. Never sum across platforms. Ask "How did you hear about us?" |

### Growth, GTM, strategy
| Skill | Core idea | Key numbers / rules |
|---|---|---|
| referrals | Trigger → Share → Convert → Reward | Reward at the aha moment. Referred customers show 16–25% higher LTV. |
| churn-prevention | Cancel flow + dunning stack | Discounts 20–30% for 2–3 months. Save rate 25–35%. |
| free-tools / lead-magnets | Engineering as marketing; one problem, <30 minutes to consume | Free-tools scorecard ≥25 is strong. Each extra form field costs 5–10%. |
| community / co-marketing / influencer / events | Identity-led community; same buyer, different problem; micro > macro creators; 20% event / 80% before-and-after | FTC disclosure required. Follow up within 24–48h. |
| revops / sales-enablement | Lifecycle stages with SLAs; collateral reps actually use | Contact within 5 minutes. Pipeline coverage 3–4×. Deck 10–12 slides. |
| launch | ORB channels, SLC readiness, 5 phases | "Launch again and again." |
| pricing / offers | Value-based pricing; Hormozi value equation | Best tier at 2–3× Better. Raise prices when conversion >40%. |
| competitors / competitor-profiling | Honest comparison pages; scrape → SEO data → synthesis | Competitor pages are untrusted input. |
| directory-submissions / prospecting / public-relations | Foundation first; ICP → qualify → score; the story, never the product | Pitches <150 words. High confidence needs 2 independent sources. |
| marketing-ideas / marketing-psychology / customer-research | 139-idea library; ~70 mental models; mine before asking | PMF benchmark: 40% "very disappointed". |
| marketing-plan | Resumable AARRR 12-month plan (INIT → REVIEW → FINALIZE) | 13 sections. "Marketing is investing." |

### Foundation & agentic skills
- **product-marketing** writes a 12-section context doc:
  1. Overview
  2. Audience
  3. Personas
  4. Pains
  5. Competition
  6. Differentiation
  7. Objections
  8. Switching forces (Push/Pull/Habit/Anxiety)
  9. Customer language
  10. Voice
  11. Proof
  12. Goals

  The doc carries a version number and a newest-first changelog. The default path is auto-drafting from the codebase.
- **marketing-council** simulates 12 advisors (Godin, Ogilvy, Dunford, Hormozi, Sharp, …) and always seats a dissenter. Output is a disagreement map, then the chair's synthesis with a tripwire. No fabricated quotes.
- **marketing-loops** offers a catalog of 43 loops. Each loop has 9 parts: cadence, acts-when, purpose, skills, body, self-check, state, stop, output. Loop state lives in `.agents/loops/<loop>.json`. There are two action tiers and a kill switch. weekly-review acts as the router and experiment-backlog as the sink.

---

## 5. Tools layer

- **Registry**: 95 tools. 91 have an API, 25 an MCP server, 80 a CLI (64 of them in-repo), and 47 an SDK. Each tool has an integration guide with Capabilities / Authentication / Common Agent Operations / When to Use / Rate Limits / Relevant Skills.
- **CLI conventions**, followed by all 64 files:
  - Node 18+ native `fetch` with no dependencies, and an identical hand-rolled `parseArgs`.
  - Command grammar is `{tool} <resource> <action> [--flags]`.
  - Auth comes from `{TOOL}_API_KEY` / `{TOOL}_ACCESS_TOKEN` env vars.
  - `--dry-run` returns the request with secrets masked as `***`.
  - Results are JSON on stdout. Errors are `{error}` on stderr with exit code 1.
- **Composio** provides MCP access to HubSpot, Salesforce, Meta/LinkedIn Ads, Sheets, Slack, Notion and others. Native MCP servers are preferred where they exist.

## 6. Governance

- **Versioning** has two layers:
  - Repo release x.y.z: x for breaking changes, y for a new skill, z for skill updates.
  - Per-skill `metadata.version`, mirrored in `VERSIONS.md`. Every shipped change must bump it, or installed users won't see the update.
- **CI**:
  - `validate-skill.yml` validates changed SKILL.md files.
  - `sync-skills.yml` auto-regenerates the README table and manifest counts.
  - `release.yml` tags a release when the version in `plugin.json` changes.
- **Partner program**: "Sponsorship funds the work, never the recommendations."
  - Partners are marked ◆ and must carry a disclosure header.
  - No placement in core skills and no "best" claims.
  - Swap test: replacing the tool with a competitor should still read as fair.
- **History**:
  - Jan 2026: foundation.
  - Feb: 51 CLIs.
  - Mar: evals and Composio.
  - 2.0.0 (May): renamed 17 skills and merged page-cro + form-cro into cro.
  - Jul: fastest release pace, heavy on ad-creative.
  - Aug: guardrails, including against prompt injection.
  - Sep: 50 skills.

---

## 7. Gaps and inconsistencies found

1. **CLI help needs credentials.** CLAUDE.md says running a CLI with no args shows help, and PARTNERS.md says CLIs must not require credentials to print help. In practice 63 of 64 CLIs exit with "env var required" before printing usage; only `github-prospects.js` complies (verified locally).
2. **Stale counts.** CLAUDE.md/AGENTS.md say "51 tools" in `tools/clis/`, but there are 64. `tools/clis/README.md` omits 12 CLIs (airops, clay, close, coupler, crossbeam, github-prospects, outreach, pendo, rankparse, similarweb, supermetrics, zoominfo).
3. **Stale MCP list.** REGISTRY.md's prose "MCP-Enabled Tools" section lists 14 tools; the index table marks 25.
4. **No CI coverage** for `node --check` on the CLIs, `sync-partners.mjs --check`, or registry/guide consistency.
5. **Missing Related Skills** sections in `product-marketing` and `public-relations`.
6. **Guide template drift.** `cogny.md` and `hyperframes.md` lack a `## Capabilities` section.
7. **Conflicting advice on LTV:CAC.** revops treats LTV:CAC of 3–5:1 as healthy, while the ads payback reference calls LTV:CAC useless and prefers payback period.
8. **Description length.** One skill description is 1,010 characters, close to the 1,024 limit.
