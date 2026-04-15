<!-- markdownlint-disable MD024 -->

# JTBD Job Stories: UX Analysis in DISCUSS Integration

## Feature Context

nWave users building user-facing features need structured UX quality validation before committing to implementation. Currently, Luna (product-owner) loads UX skills as passive knowledge but no active audit workflow exists. The gap: UX issues discovered late (during DELIVER or after deployment) cost 10-100x more to fix than issues caught during DISCUSS.

---

## Job 1: Catch UX Problems Before They Become Code

### Job Story

When I have finished designing a user journey in DISCUSS and am about to hand off to DESIGN, I want to validate that the journey follows established UX principles and does not contain usability blind spots, so I can fix problems while they are still cheap text changes instead of expensive code rewrites.

### Job Dimensions

| Dimension | Description |
|-----------|-------------|
| **Functional** | Systematically evaluate journey artifacts against UX heuristics (Nielsen, Norman), emotional design principles, and platform-specific patterns. Produce a prioritized list of findings with severity and remediation guidance. |
| **Emotional** | Feel confident that the journey I designed is solid. Remove the nagging doubt: "Am I missing something obvious?" Replace gut-feel uncertainty with evidence-based assurance. |
| **Social** | Be seen as someone who delivers quality work. Avoid the embarrassment of a UX reviewer or end user pointing out obvious problems that should have been caught earlier. Demonstrate professional rigor to the team. |

### Personas

**Marco Pellegrini** -- a backend developer at a 4-person startup building their first customer-facing web dashboard. Marco has deep Python and API expertise but minimal UX training. He ran `/nw-discuss` to design a "View Invoice History" journey and produced journey YAML, visual mockups, and user stories. The journey feels right to him, but he knows he has blind spots around information hierarchy, cognitive load, and error state design.

**Sara Okonkwo** -- a tech lead responsible for product quality at a B2B SaaS company. Her team uses nWave for all feature development. She reviews DISCUSS artifacts before approving handoff to DESIGN. She does not have time to manually check every journey against UX principles, and she suspects her team's journeys have recurring patterns of weak error handling and inconsistent terminology.

### Outcome Statements

1. Minimize the time spent discovering UX issues after code is written
2. Minimize the likelihood of shipping a journey with unaddressed usability heuristic violations
3. Maximize the confidence that error paths and edge cases have adequate UX treatment
4. Minimize the number of UX-related rework cycles in DELIVER wave

---

## Job 2: Get UX Guidance Without Being a UX Expert

### Job Story

When I am designing a user journey for a feature I have not built before and I lack UX expertise for the target platform, I want to receive actionable, specific UX recommendations grounded in established principles, so I can produce a professional-quality journey without needing to hire a UX consultant or read five books first.

### Job Dimensions

| Dimension | Description |
|-----------|-------------|
| **Functional** | Analyze my journey artifacts and tell me exactly which UX principles apply, what patterns I should use for this platform (web, desktop, TUI), and what specific changes to make. Provide concrete before/after examples, not abstract theory. |
| **Emotional** | Feel empowered rather than overwhelmed. UX is a vast field -- I need a guide that meets me where I am and gives me the right level of depth for my situation, not a firehose of everything that could be improved. |
| **Social** | Produce work that looks like it was designed by someone who knows what they are doing, even though I am learning. Close the gap between my technical skills and the UX quality my users deserve. |

### Personas

**Marco Pellegrini** -- building his first web dashboard. He knows what "good UX" looks like as a user but cannot articulate why or apply principles systematically. When he reads nWave's ux-principles skill (Nielsen's 10 heuristics, Norman's 6 principles, WCAG), he understands the concepts but struggles to apply them to his specific journey. He needs someone to look at HIS mockups and say: "This empty state violates heuristic 9 -- here is what a good error message looks like for your invoice list."

**Yuki Tanaka** -- a solo developer building a CLI tool for infrastructure management. She used `/nw-discuss` to design a "Deploy Service" journey with TUI mockups. She is comfortable with terminal interfaces but unsure whether her progress indicators follow best practices, whether her error messages answer the three required questions (what happened, why, what to do), and whether her color usage is accessible.

### Outcome Statements

1. Minimize the time to learn which UX principles apply to my specific journey
2. Maximize the actionability of UX recommendations (specific changes, not general advice)
3. Minimize the expertise gap between my journey design and what a UX professional would produce
4. Minimize the cognitive load of processing UX feedback (right-sized to my depth setting)

---

## Job 3: Make Evidence-Based UX Decisions

### Job Story

When I face a UX design decision during journey design and my team disagrees on the right approach, I want structured analysis grounded in research-backed principles with clear trade-offs, so I can make a defensible decision rather than defaulting to the loudest voice or personal preference.

### Job Dimensions

| Dimension | Description |
|-----------|-------------|
| **Functional** | For a given design decision, enumerate alternatives, evaluate each against relevant UX principles, identify trade-offs, and recommend an approach with rationale. Reference specific heuristics, laws (Fitts, Hick, Miller), or patterns that support the recommendation. |
| **Emotional** | Feel grounded in the decision. Replace "I think this is better" with "This approach scores higher on visibility of system status (Nielsen 1) and reduces cognitive load (Hick's Law)." Confidence comes from evidence, not opinion. |
| **Social** | Resolve team disagreements productively. When a colleague says "I prefer the other way," have a shared framework for evaluation rather than a battle of preferences. Build team alignment through shared language. |

### Personas

**Sara Okonkwo** -- reviewing a journey where her developer designed a settings page with 15 options visible at once. The developer argues users need to see everything. Sara thinks progressive disclosure is better. Neither has evidence. She wants a structured evaluation: "Given your user persona (returning admin, weekly usage), progressive disclosure scores higher on Hick's Law (fewer choices = faster decisions) but lower on recognition over recall (hidden options require knowing they exist). For weekly-use admin tools, progressive disclosure with clear section labels is recommended because..."

**Dmitri Volkov** -- a developer building a data pipeline monitoring dashboard. His team debates whether to use color-coded status indicators or text-based status labels. He wants to know: what does the research say about color-only information channels, what are the accessibility implications, and what is the recommended pattern for status displays in dashboard contexts?

### Outcome Statements

1. Minimize the time spent in design disagreements without resolution
2. Maximize the traceability of design decisions to established UX principles
3. Minimize the risk of choosing an approach that works for the team but fails for users
4. Maximize team alignment on UX quality standards

---

## Job 4: Ensure UX Consistency Across Features

### Job Story

When my team has built multiple features over several sprints using nWave and each feature was designed independently, I want to detect UX inconsistencies across journeys (terminology, interaction patterns, emotional tone, error handling), so I can maintain a coherent product experience rather than a patchwork of individually-designed features.

### Job Dimensions

| Dimension | Description |
|-----------|-------------|
| **Functional** | Cross-reference journey artifacts across features. Detect: inconsistent terminology for the same concept, different interaction patterns for similar actions, mismatched emotional tones, varying error message formats. Produce a consistency report with specific instances and remediation. |
| **Emotional** | Feel in control of product quality at a macro level. Individual features may be well-designed, but the whole product should feel like one team built it. Remove the anxiety that each new feature adds to the inconsistency debt. |
| **Social** | Present a product that feels professional and polished to users, not one where each screen was clearly designed by a different person. Maintain credibility with stakeholders who expect a unified experience. |

### Personas

**Sara Okonkwo** -- her team has shipped 8 features using nWave over 4 months. She notices that the "Settings" journey uses "Save" while the "Profile" journey uses "Update." The invoice list says "No invoices found" while the project list says "You haven't created any projects yet." Error messages vary between technical ("404 Not Found") and user-friendly ("We couldn't find that page"). She wants a tool that catches these inconsistencies systematically.

**Marco Pellegrini** -- after his team's third feature, users report that "the app feels inconsistent." Marco cannot pinpoint specific issues but knows the feedback is valid. He wants an audit that compares his latest journey against previous ones and flags where patterns diverge.

### Outcome Statements

1. Minimize the number of UX inconsistencies that reach users
2. Minimize the time to detect terminology and pattern mismatches across features
3. Maximize the perception of product coherence by end users
4. Minimize the effort to maintain a consistent UX vocabulary as the product grows

---

## Job 5: Know Whether UX Analysis Is Worth the Time

### Job Story

When I am about to start a new feature and nWave asks whether I want UX analysis, I want a smart recommendation on whether UX analysis adds value for THIS specific feature, so I can invest time proportionally and skip analysis for features where it adds little value.

### Job Dimensions

| Dimension | Description |
|-----------|-------------|
| **Functional** | Analyze the feature's characteristics (user-facing vs internal, complexity, novelty, platform) and recommend whether UX analysis is needed, and at what depth (lightweight checklist, standard audit, comprehensive deep-dive). Provide reasoning so the user can make an informed override decision. |
| **Emotional** | Feel that the tool respects my time. Not every feature needs a full UX audit -- a backend API refactoring should not trigger a 30-minute analysis. But when UX analysis IS needed, I want to be told clearly so I do not skip something important. |
| **Social** | Demonstrate to the team that the process is intelligent, not bureaucratic. Smart gating builds trust in the methodology. Mandatory-everything breeds resentment and shortcuts. |

### Personas

**Yuki Tanaka** -- about to design a journey for an internal CLI utility that reformats config files. The feature has no user-facing UI changes, no emotional arc, and three commands with predictable output. She does not want to spend 20 minutes on a UX audit for this. She wants nWave to say: "UX analysis recommended: NO -- internal utility, no interactive elements, low UX risk. Override? [y/N]."

**Marco Pellegrini** -- about to design his first customer onboarding flow. High visibility, emotional journey (anxious new user to confident active user), multiple interaction patterns, error-prone steps. He wants nWave to say: "UX analysis recommended: YES (comprehensive) -- customer-facing onboarding flow, high emotional complexity, first-time user experience. Proceed? [Y/n]."

### Outcome Statements

1. Minimize the time wasted on UX analysis for features that do not benefit from it
2. Maximize the likelihood that features needing UX analysis actually receive it
3. Minimize the friction of the gating decision (quick recommendation, easy override)
4. Maximize trust in the nWave methodology by making proportional recommendations

---

## JTBD-to-Story Bridge

| Job | Primary User Stories (Placeholders) |
|-----|-------------------------------------|
| Job 1: Catch UX problems early | US: Run UX audit on DISCUSS journey artifacts before handoff; US: View prioritized UX findings with severity and remediation |
| Job 2: Get UX guidance without expertise | US: Receive platform-specific UX recommendations for my journey; US: See concrete before/after examples for UX improvements |
| Job 3: Evidence-based UX decisions | US: Evaluate design alternatives against UX principles; US: Get trade-off analysis for a specific design decision |
| Job 4: Consistency across features | US: Cross-reference UX patterns across multiple feature journeys; US: Detect terminology and interaction pattern drift |
| Job 5: Smart gating | US: Receive recommendation on whether UX analysis is needed; US: Configure UX research depth (lightweight/standard/comprehensive) |

---

## Job Hierarchy

```
Main Job: Ensure my product has good UX without being a UX expert
  |
  +-- Job 1: Catch UX problems before they become code (CORE)
  |     Consumption chain: DISCUSS artifacts -> UX audit -> findings -> remediation
  |
  +-- Job 2: Get UX guidance without being a UX expert (CORE)
  |     Consumption chain: journey step -> principle match -> specific recommendation
  |
  +-- Job 3: Make evidence-based UX decisions (SUPPORTING)
  |     Consumption chain: design question -> alternatives -> evaluation -> recommendation
  |
  +-- Job 4: Ensure UX consistency across features (SUPPORTING)
  |     Consumption chain: multiple journeys -> cross-reference -> inconsistency report
  |
  +-- Job 5: Know whether UX analysis is worth the time (ENABLING)
        Consumption chain: feature characteristics -> risk assessment -> recommendation
```
