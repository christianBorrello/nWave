<!-- markdownlint-disable MD024 -->

# User Stories: UX Analysis in DISCUSS Integration

## System Constraints

- The nw-ux-auditor agent runs inside Claude Code as a cross-wave agent
- All input is markdown/YAML files in `docs/feature/{feature-id}/discuss/`
- All output is markdown files in the same directory
- The agent loads existing UX skills (ux-principles, ux-emotional-design, ux-web-patterns, ux-desktop-patterns, ux-tui-patterns) as its knowledge base
- The agent is invoked via Task tool from DISCUSS (integrated mode) or via `/nw-ux` command (standalone mode)
- No external APIs, databases, or network calls -- all analysis is performed on local file artifacts
- Must respect `NO_COLOR` environment variable and non-TTY environments
- Findings must be solution-neutral -- observable user outcomes, not implementation prescriptions

---

## US-01: Smart Gating Recommendation

**Traces to**: Job 5 (Know Whether UX Analysis Is Worth the Time), Outcomes 5.1 (14), 5.2 (17), 5.3 (11)

### Problem

Marco Pellegrini is a backend developer at a 4-person startup who runs `/nw-discuss` for every feature. He has limited UX expertise and cannot judge whether a feature needs UX analysis. He wastes 10 minutes on a full audit for an internal config migration utility, then skips the audit entirely for a customer onboarding flow because he is tired of the process overhead. His team lead, Sara Okonkwo, later catches 8 usability issues in the onboarding flow during manual review -- issues that would have been caught by a comprehensive audit.

### Who

- Backend developer | Building features with varying UX risk | Wants proportional process, not one-size-fits-all
- Tech lead | Reviewing DISCUSS handoffs | Wants assurance that high-risk features receive UX attention

### Solution

After Decision 1 (Feature Type) in DISCUSS, nWave evaluates feature characteristics and recommends whether UX analysis is needed and at what depth. The recommendation includes reasoning so the user can make an informed override.

### Domain Examples

#### 1: Customer-Facing Web Dashboard (Recommend YES, Comprehensive)

Marco completes Decision 1 for "view-invoice-history." The feature is customer-facing, has interactive elements (filters, pagination, date pickers), targets web platform, and is Marco's first dashboard. nWave recommends: "YES (comprehensive) -- Customer-facing web dashboard with interactive elements, first implementation for this team. High UX risk." Default prompt: `[Y/n]`.

#### 2: Internal CLI Config Utility (Recommend NO)

Yuki Tanaka completes Decision 1 for "reformat-config." The feature is internal, has no interactive elements (reads file, writes file, exits), targets CLI, and follows established patterns. nWave recommends: "NO -- Internal CLI utility, no interactive elements, low UX risk." Default prompt: `[y/N]`.

#### 3: Internal Tool with User-Facing Error Messages (Recommend YES, Lightweight)

Dmitri Volkov completes Decision 1 for "validate-pipeline-config." The feature is mostly internal but produces error messages that developers read and act on. It has moderate novelty (new validation rules). nWave recommends: "YES (lightweight) -- Internal tool with user-facing error output. Error message UX worth checking." Default prompt: `[Y/n]`.

### UAT Scenarios (BDD)

#### Scenario: High-risk feature receives comprehensive audit recommendation

Given Marco has completed Decision 1 for "view-invoice-history"
And the feature is classified as customer-facing with interactive elements
And this is the team's first web dashboard implementation
When nWave evaluates whether UX analysis is needed
Then the recommendation is "YES" at "comprehensive" depth
And the reason references "customer-facing," "interactive elements," and "first implementation"
And the default prompt is `[Y/n]` (opt-out friction)

#### Scenario: Low-risk feature receives skip recommendation

Given Yuki has completed Decision 1 for "reformat-config"
And the feature is classified as internal CLI utility
And the feature has no interactive elements
When nWave evaluates whether UX analysis is needed
Then the recommendation is "NO"
And the reason references "internal utility" and "no interactive elements"
And the default prompt is `[y/N]` (opt-in friction)

#### Scenario: User overrides a YES recommendation without guilt

Given nWave recommends "YES" at "comprehensive" depth for Marco's feature
When Marco declines with "n"
Then nWave acknowledges the decision without repeating the recommendation
And nWave shows the standalone invocation command for later use
And DISCUSS continues to Phase 3 without delay

#### Scenario: Ambiguous feature receives lightweight recommendation with explanation

Given Dmitri has completed Decision 1 for "validate-pipeline-config"
And the feature has mixed characteristics (internal tool, user-facing error output)
When nWave evaluates whether UX analysis is needed
Then the recommendation is "YES" at "lightweight" depth
And the reason explains which characteristic triggered the recommendation
And the user can override to comprehensive or skip entirely

### Acceptance Criteria

- [ ] Recommendation evaluates at least 4 feature characteristics: user-facing (yes/no), interactive elements (yes/no), emotional complexity (low/medium/high), novelty (low/medium/high)
- [ ] YES recommendation defaults to `[Y/n]`; NO recommendation defaults to `[y/N]`
- [ ] Recommendation includes human-readable reasoning referencing specific feature characteristics
- [ ] User can override in either direction with single keystroke
- [ ] Override is acknowledged without guilt, nagging, or "are you sure" prompts
- [ ] Standalone invocation command shown when user declines

### Outcome KPIs

- **Who**: nWave developers running DISCUSS for new features
- **Does what**: Accept the smart gate recommendation (proceed or skip) matching the feature's actual UX risk level
- **By how much**: 80% of features with user-facing interactive elements receive at least lightweight audit; 90% of internal utilities skip audit
- **Measured by**: Correlation between recommendation acceptance and feature characteristics in ux-analysis.md metadata
- **Baseline**: Currently 0% of features receive structured UX analysis; 100% are treated identically

### Technical Notes

- Smart gating depends on Decision 1 output being available (integration checkpoint)
- Feature characteristics must be inferrable from existing DISCUSS context, not requiring additional user input
- Platform detection reuses journey YAML metadata

---

## US-02: Journey UX Audit

**Traces to**: Job 1 (Catch UX Problems Before They Become Code), Outcomes 1.1 (15), 1.2 (14), 1.3 (16)

### Problem

Marco Pellegrini designed a "View Invoice History" journey in DISCUSS and produced journey YAML, visual mockups, and user stories. The journey passes DoR -- it has personas, examples, BDD scenarios, and acceptance criteria. But nobody checked whether the empty state shows a helpful message instead of "No data," whether the loading state provides feedback, or whether error messages follow the three-question pattern (what happened, why, what to do). Marco has blind spots he cannot see because he lacks UX training. Sara Okonkwo reviews the handoff but does not have time to manually check every journey against 10 heuristics, 6 design principles, and platform patterns.

### Who

- Backend developer | Completed journey design in DISCUSS | Wants systematic UX validation before handoff
- Tech lead | Reviewing multiple developer journeys | Wants systematic coverage without manual effort

### Solution

The nw-ux-auditor analyzes journey artifacts (visual markdown, YAML schema, shared artifacts registry) against UX heuristic categories. It produces a prioritized list of findings with severity, violated principle, affected journey step, and remediation guidance.

### Domain Examples

#### 1: Invoice Journey with Missing Empty State (Critical Finding)

Marco's "view-invoice-history" journey YAML Step 3 (Invoice List) has a TUI mockup showing the populated list but no empty state mockup. The auditor flags: "CRITICAL -- Missing empty state for invoice list. Nielsen H9 (help with errors). Step 3 shows data but does not define what the user sees with zero invoices. Recommend: 'No invoices yet. Invoices will appear here after your first billing cycle.'"

#### 2: Deploy Service with Silent Long Operation (High Finding)

Yuki's "deploy-service" journey visual markdown shows the deploy command producing output only after completion (45 seconds). The auditor flags: "HIGH -- No progress feedback for long-running operation. Nielsen H1 (visibility of system status). The deploy command produces no output for 45 seconds. Users will think the CLI is frozen. Recommend: spinner or progress log showing deployment steps."

#### 3: Settings Page with All Options Visible (High Finding)

Sara reviews Dmitri's "user-settings" journey YAML Step 2 (Settings Display) which lists 15 settings in a single view. The auditor flags: "HIGH -- 15 settings visible at once. Hick's Law (decision time increases with choices). Group into 3-4 sections with progressive disclosure. Expanding sections reduce visible choices to 4-5."

### UAT Scenarios (BDD)

#### Scenario: Audit identifies missing UX patterns in a web journey

Given Marco's "view-invoice-history" journey YAML is loaded
And the journey has 6 steps with TUI mockups
When the auditor runs a comprehensive UX audit
Then findings are produced for steps missing empty states, loading indicators, or error recovery guidance
And each finding references the specific journey step by name and ID
And each finding cites the violated UX principle with its identifier

#### Scenario: Audit produces zero findings for a well-designed journey

Given Yuki's "list-namespaces" journey YAML is loaded
And the journey includes empty states, error messages with three-question pattern, and progress feedback
When the auditor runs a lightweight UX audit
Then zero critical or high findings are produced
And a positive summary message confirms journey quality
And the report save prompt defaults to NO

#### Scenario: Audit handles partial artifacts gracefully

Given Marco's "view-invoice-history" visual markdown exists but the YAML is missing
When the auditor attempts to collect artifacts
Then a warning explains which analysis categories will be skipped due to missing YAML
And the user is asked whether to proceed with partial coverage
And the audit runs on available artifacts if the user confirms

#### Scenario: Findings are prioritized by severity and impact

Given the audit produces 12 findings (1 critical, 2 high, 4 medium, 5 low)
When findings are presented to Marco
Then the top 3 findings (critical and high) are shown first
And remaining findings are available on request
And the user is not overwhelmed with all 12 at once

### Acceptance Criteria

- [ ] Audit analyzes journey visual markdown and/or YAML schema
- [ ] Each finding includes: severity (critical/high/medium/low), title, principle reference, affected step, remediation text
- [ ] Findings are sorted by severity (critical first)
- [ ] Top 3 findings shown by default; remaining available on demand
- [ ] Audit handles missing artifacts with warning and partial coverage option
- [ ] Zero-findings case shows positive reinforcement and defaults save prompt to NO

### Outcome KPIs

- **Who**: Developers completing DISCUSS for user-facing features
- **Does what**: Fix UX issues during DISCUSS (text changes) instead of during DELIVER (code changes)
- **By how much**: 70% reduction in UX-related rework identified during code review or post-deployment
- **Measured by**: Count of UX-related issues found in DELIVER code review for features that received UX audit vs. features that did not
- **Baseline**: Currently 100% of UX issues are discovered during or after implementation

### Technical Notes

- Audit engine loads ux-principles skill as knowledge base for heuristic evaluation
- Requires at least one journey artifact (visual.md or .yaml) to run
- Lightweight mode evaluates Nielsen top-5 + error states only (2 of 7 categories)
- Comprehensive mode evaluates all 7 categories

---

## US-03: Error State Coverage Audit

**Traces to**: Job 1 (Catch UX Problems), Outcome 1.3 (16 -- highest single Job 1 outcome)

### Problem

Yuki Tanaka built a CLI tool for infrastructure deployment. Her "deploy-service" journey has a detailed happy path with clear success output, but the error path shows "Error: ECONNREFUSED" when the service is unreachable. She did not know that good error messages should answer three questions: what happened, why it might have happened, and what the user can do about it. Sara Okonkwo reviews DISCUSS handoffs from 4 developers and consistently finds that error states are afterthoughts -- developers design happy paths first and treat errors as an annoyance.

### Who

- Developer | Designing journey with error paths | Does not know error UX best practices
- Tech lead | Reviewing multiple journeys | Sees recurring weak error handling pattern

### Solution

The auditor specifically evaluates every error path and edge case in the journey against error UX patterns: three-question format, user-friendly language (no raw codes), recovery guidance, emotional tone (not alarming), and graceful degradation.

### Domain Examples

#### 1: Raw Error Code in CLI Tool (Critical)

Yuki's "deploy-service" journey error path shows `Error: ECONNREFUSED`. The auditor flags: "CRITICAL -- Raw error code shown to user. Nielsen H9. Error message should answer: What happened ('Cannot connect to deployment service'), Why ('The service may be down or your network connection may be interrupted'), What to do ('Check your network connection and try again. If the problem persists, check service status at status.example.com')."

#### 2: Missing Error Path for Empty Search Results (Medium)

Marco's "view-invoice-history" journey has a search/filter step but no mockup for zero results. The auditor flags: "MEDIUM -- No empty search results state. Nielsen H9 + empty state pattern. When filters produce zero invoices, show: 'No invoices match your filters. Try adjusting your date range or removing filters.' Include a 'Clear all filters' action."

#### 3: Destructive Action Without Confirmation (High)

Dmitri's "user-settings" journey has a "Reset to Defaults" button with no confirmation step. The auditor flags: "HIGH -- Destructive action without confirmation. Nielsen H3 (user control and freedom) + H5 (error prevention). 'Reset to defaults' affects 12 settings and cannot be undone. Add confirmation: 'This will reset 12 settings to their default values. This action cannot be undone. Reset? [y/N]'"

### UAT Scenarios (BDD)

#### Scenario: Raw error codes are flagged with three-question remediation

Given Yuki's journey error path shows "Error: ECONNREFUSED"
When the auditor evaluates error state coverage
Then a critical finding is produced for the raw error code
And the remediation provides a rewritten message answering what/why/what-to-do
And the rewritten message uses domain-appropriate language for Yuki's CLI context

#### Scenario: Missing error paths are detected from happy path analysis

Given Marco's journey has a search step with filters
And no error path or empty state is defined for zero search results
When the auditor evaluates error state coverage
Then a finding is produced for the missing empty search results state
And the remediation includes a suggested empty state message with clear-filters action

#### Scenario: Destructive actions without safeguards are flagged

Given Dmitri's journey has a "Reset to Defaults" action
And no confirmation or undo mechanism is documented
When the auditor evaluates error state coverage
Then a high finding is produced for the unprotected destructive action
And the remediation includes a confirmation prompt with explicit consequence description

### Acceptance Criteria

- [ ] Every error path in the journey is evaluated against the three-question error pattern
- [ ] Raw error codes (HTTP status, system errors) are flagged as critical
- [ ] Missing error/empty states are detected by analyzing happy path steps that could fail
- [ ] Destructive actions without confirmation or undo are flagged
- [ ] Remediation provides rewritten messages appropriate to the platform (web/TUI)
- [ ] Error message emotional tone is evaluated (not alarming, guides recovery)

### Outcome KPIs

- **Who**: Developers designing journeys with error paths
- **Does what**: Include user-friendly error messages and missing error states in journey artifacts
- **By how much**: 90% of journey error paths follow the three-question pattern after audit remediation
- **Measured by**: Percentage of error paths in post-audit journey artifacts that include what/why/what-to-do
- **Baseline**: Estimated 30% of current journey error paths follow the three-question pattern

### Technical Notes

- Error state audit is one of the two categories in lightweight mode (always runs)
- Detection of missing error paths requires analyzing happy path steps for implicit failure modes (network calls, empty collections, user input)
- Platform context affects remediation language (CLI error format vs. web toast/banner)

---

## US-04: Actionable UX Recommendations

**Traces to**: Job 2 (Get UX Guidance Without Being a UX Expert), Outcomes 2.2 (17 -- highest overall), 2.1 (14)

### Problem

Marco Pellegrini reads a finding that says "violates heuristic 7: flexibility and efficiency of use" and does not know what to do with it. Does it mean keyboard shortcuts? Bulk selection? Quick filters? The principle is clear as an abstract concept, but applying it to his specific invoice list page requires UX expertise he does not have. Sara Okonkwo wants her team to improve their UX skills over time, but generic findings that say "improve error handling" teach nothing.

### Who

- Non-UX developer | Receives audit findings | Needs specific, contextualized remediation, not abstract theory
- Tech lead | Wants team to learn UX principles | Needs findings that educate, not just dictate

### Solution

Each finding includes: the violated principle with a one-sentence explanation of WHY it matters, specific remediation for THIS journey step with concrete before/after text, and the principle name so developers learn the vocabulary over time.

### Domain Examples

#### 1: Empty State Remediation with Before/After (Web)

Marco's finding for missing empty state includes: "BEFORE: Step 3 shows 'No data.' AFTER: 'No invoices yet. Invoices will appear here after your first billing cycle. [View billing documentation].' WHY: Empty states are opportunities to guide users (Nielsen H9). First-time users seeing 'No data' think something is broken."

#### 2: Progress Feedback Remediation with Before/After (TUI)

Yuki's finding for silent deploy includes: "BEFORE: `$ deploy myservice` (no output for 45 seconds, then 'Deployed successfully'). AFTER: `$ deploy myservice` followed by 'Deploying myservice... Pulling image [1/4]... Building container [2/4]... Starting service [3/4]... Running health check [4/4]... Deployed successfully (47s).' WHY: Users expect feedback within 1 second for any operation (Nielsen H1). Silent CLI commands over 2 seconds are assumed frozen."

#### 3: Cognitive Overload Remediation with Before/After (Web)

Dmitri's finding for 15 visible settings includes: "BEFORE: Single page with 15 settings controls (Account, Email, Notifications, Privacy, Security, Display, Language, Timezone, API Keys, Webhooks, Billing, Usage Limits, Audit Log, Integrations, Export). AFTER: 4 sections (Account, Notifications, Security, Integrations) with 3-4 settings each, expandable. WHY: Hick's Law -- decision time increases logarithmically with choices. 15 simultaneous options create decision paralysis."

### UAT Scenarios (BDD)

#### Scenario: Finding includes before/after specific to the journey step

Given a finding for "missing empty state" at Step 3 of Marco's invoice journey
When the finding is presented
Then the remediation includes the current state ("No data") as BEFORE
And the remediation includes a specific replacement message as AFTER
And the replacement message references the journey's domain (invoices, billing cycle)

#### Scenario: Finding explains the principle in accessible language

Given a finding cites "Nielsen H1 (visibility of system status)"
When the finding is presented
Then a one-sentence explanation accompanies the principle reference
And the explanation uses plain language without assumed UX vocabulary
And the principle name is included so the developer learns the term

#### Scenario: Recommendations adapt to platform context

Given Yuki's journey targets TUI platform
And a finding relates to progress feedback for a long operation
When the remediation is generated
Then it suggests TUI-appropriate patterns (progress steps, spinners, elapsed time)
And does not suggest web-specific patterns (progress bars, skeleton screens, loading overlays)

### Acceptance Criteria

- [ ] Every finding includes remediation specific to the affected journey step (not generic advice)
- [ ] Remediation includes before/after examples using the journey's own domain language
- [ ] Principle reference includes a one-sentence plain-language explanation
- [ ] Recommendations are platform-appropriate (web, desktop, or TUI patterns)
- [ ] Findings serve as learning moments: principle name + explanation + specific application

### Outcome KPIs

- **Who**: Developers with low UX expertise (Marco, Yuki profile)
- **Does what**: Apply audit recommendations to improve journey artifacts without additional research
- **By how much**: 80% of accepted findings are resolved by the developer without needing external UX guidance
- **Measured by**: Percentage of accepted findings resolved in updated journey artifacts (tracked via re-audit delta)
- **Baseline**: Currently developers spend 30-60 minutes researching each UX issue independently

### Technical Notes

- Before/after generation requires parsing journey YAML step content for affected mockup text
- Platform-appropriate recommendations require loading the correct platform skill (ux-web-patterns, ux-desktop-patterns, ux-tui-patterns)
- Principle explanations should be cached/templated for consistency across audits

---

## US-05: Platform-Specific Audit

**Traces to**: Job 2 (Get UX Guidance), Outcomes 2.1 (14), 2.3 (12)

### Problem

Yuki Tanaka is building a CLI tool for infrastructure management. She used `/nw-discuss` to design a "Deploy Service" journey with TUI mockups. She is comfortable with terminal interfaces from a user perspective but unsure whether her progress indicators follow best practices, whether her error messages answer the three required questions, and whether her color usage is accessible. The general UX principles (Nielsen, Norman) apply across platforms, but the specific PATTERNS differ dramatically between web dashboards, desktop applications, and terminal interfaces. A finding that says "add a loading spinner" is wrong for a CLI tool -- it should say "add a progress log with step indicators."

### Who

- CLI developer | Designing TUI journey | Needs terminal-specific UX patterns, not web advice
- Web developer | Designing dashboard journey | Needs web-specific patterns (responsive, loading states, form validation)

### Solution

The auditor detects the target platform from journey YAML metadata and loads the corresponding platform skill (ux-web-patterns, ux-desktop-patterns, ux-tui-patterns). Category 4 of the audit applies platform-specific pattern checklist.

### Domain Examples

#### 1: TUI Audit for CLI Deploy Tool

Yuki's "deploy-service" journey specifies platform: TUI. The auditor loads ux-tui-patterns and checks: NO_COLOR environment variable support, exit code conventions (0=success, 1=error, 2=usage), error message format (stderr, not stdout), `--help` structured format, progress feedback for operations over 2 seconds, stdin piping compatibility. Findings reference TUI-specific patterns, not web patterns.

#### 2: Web Audit for Invoice Dashboard

Marco's "view-invoice-history" journey specifies platform: web. The auditor loads ux-web-patterns and checks: responsive layout breakpoints, loading skeleton or spinner for API calls, empty state design with call-to-action, form validation (inline, not only on submit), keyboard navigation between list items, focus management after modal close.

#### 3: Platform Auto-Detection When Not Specified

Dmitri's "monitor-pipeline" journey YAML does not specify a platform field. The auditor scans the visual markdown for platform signals: TUI mockups with ASCII borders and `$` prompts suggest CLI; HTML-like elements or responsive mentions suggest web. If ambiguous, the auditor asks: "Could not auto-detect platform. Your journey will be audited as: (1) web, (2) desktop, (3) TUI?"

### UAT Scenarios (BDD)

#### Scenario: TUI journey receives terminal-specific pattern audit

Given Yuki's journey YAML specifies platform as "tui"
When the auditor runs platform pattern analysis
Then TUI-specific checks are applied (NO_COLOR, exit codes, stderr errors, structured --help)
And web-specific checks (responsive design, form validation, loading spinners) are not applied
And findings reference TUI patterns from the ux-tui-patterns knowledge base

#### Scenario: Web journey receives web-specific pattern audit

Given Marco's journey YAML specifies platform as "web"
When the auditor runs platform pattern analysis
Then web-specific checks are applied (responsive layout, loading states, keyboard navigation)
And TUI-specific checks (NO_COLOR, exit codes, stdin piping) are not applied

#### Scenario: Platform auto-detected from journey content when not specified

Given Dmitri's journey YAML has no platform field
And the visual markdown contains ASCII TUI mockups with `$` command prompts
When the auditor attempts platform detection
Then "tui" is auto-detected from content signals
And the detected platform is confirmed with the user before proceeding

### Acceptance Criteria

- [ ] Platform detected from journey YAML metadata field (primary) or content analysis (fallback)
- [ ] Correct platform skill loaded: ux-web-patterns for web, ux-desktop-patterns for desktop, ux-tui-patterns for TUI
- [ ] Category 4 (Platform Patterns) applies platform-specific checklist, not generic patterns
- [ ] Findings and remediation use platform-appropriate language and patterns
- [ ] Ambiguous platform detection prompts user for clarification rather than guessing

### Outcome KPIs

- **Who**: Developers building features across different platforms
- **Does what**: Receive platform-relevant UX recommendations instead of generic cross-platform advice
- **By how much**: 95% of platform pattern findings are relevant to the actual target platform
- **Measured by**: Finding dismissal rate for platform pattern category (lower = more relevant)
- **Baseline**: No platform-specific audit exists; developers manually search for platform patterns

### Technical Notes

- Platform detection priority: YAML metadata > content analysis > user prompt
- Each platform skill has a different checklist; the audit engine must load the correct one dynamically
- Desktop platform is least common in nWave usage; web and TUI are primary targets

---

## US-06: Story Enrichment from UX Findings

**Traces to**: Job 1 + Job 2 combined, Outcomes 1.4 (13), 2.2 (17)

### Problem

Marco Pellegrini runs a UX audit on his "view-invoice-history" journey and receives 12 findings. He reads them, understands the issues, and saves the report. Then he proceeds to Phase 3 (User Story Mapping) and Phase 4 (Story Crafting). But the findings sit in `ux-analysis.md` as a separate document. His user stories do not reflect the UX audit results -- the empty state finding is not captured as an acceptance criterion in US-03 (View Invoice List), and the loading indicator finding is not a BDD scenario. The audit produced value, but the value is not connected to the stories that will drive implementation.

### Who

- Developer | Completed UX audit with findings | Wants findings to automatically appear in the right user stories
- Tech lead | Reviewing user stories for completeness | Wants UX quality visible in AC, not buried in a separate report

### Solution

After the audit report is saved, the auditor maps each accepted finding to the relevant user story and generates additional acceptance criteria and BDD scenarios. In integrated mode (Journey A), this happens automatically before Phase 3. In standalone mode (Journey B), the user runs `/nw-discuss {feature-id} --enrich-from-ux`.

### Domain Examples

#### 1: Empty State Finding Becomes Invoice List AC

Finding: "CRITICAL -- Missing empty state for invoice list (Nielsen H9)." Mapped to US-03 (View Invoice List). New AC: "Empty state shows guidance message when no invoices exist." New scenario: "Given Marco navigates to the invoice list / And Marco has zero invoices / When the page loads / Then the message reads 'No invoices yet. Invoices will appear here after your first billing cycle.' / And a link to billing documentation is displayed."

#### 2: Loading Indicator Finding Becomes New Scenario

Finding: "HIGH -- No loading indicator for invoice fetch (Nielsen H1)." Mapped to US-03 (View Invoice List). New scenario: "Given Marco navigates to the invoice list / And the API call takes 2 seconds / When the page begins loading / Then a loading skeleton is displayed within 100ms / And the skeleton matches the layout of the populated list."

#### 3: Finding That Does Not Map to an Existing Story

Finding: "MEDIUM -- No keyboard navigation for invoice list actions." No existing story covers keyboard accessibility. The enrichment step creates a suggestion: "New story suggested: 'Keyboard navigation for invoice list.' Source: UX audit finding (Nielsen H7, flexibility and efficiency). Recommend adding to story map."

### UAT Scenarios (BDD)

#### Scenario: Critical finding creates new acceptance criterion in existing story

Given the UX audit found "missing empty state" (critical) mapped to Step 3
And US-03 "View Invoice List" exists in the story backlog
When findings are mapped to stories
Then US-03 receives a new AC: "Empty state shows guidance message when no invoices exist"
And the new AC traces to the finding ID in ux-analysis.md

#### Scenario: Finding generates new BDD scenario for existing story

Given the UX audit found "no loading indicator" (high) mapped to Step 2
And US-03 "View Invoice List" exists in the story backlog
When findings are mapped to stories
Then US-03 receives a new BDD scenario describing the expected loading behavior
And the scenario uses Given/When/Then format with real data (2-second API call)

#### Scenario: Unmapped finding suggests new story creation

Given the UX audit found "no keyboard navigation" (medium)
And no existing story covers keyboard accessibility for this feature
When findings are mapped to stories
Then a new story suggestion is created with title and source reference
And the suggestion is flagged for the user to approve or dismiss

#### Scenario: Enriched stories still pass DoR validation

Given US-03 has been enriched with 3 new AC and 2 new BDD scenarios from UX findings
When DoR validation runs on the enriched story
Then all 9 DoR items pass
And the story remains right-sized (3-7 scenarios total)
And if enrichment pushes the story over 7 scenarios, a split is recommended

### Acceptance Criteria

- [ ] Each accepted finding is mapped to the most relevant existing user story
- [ ] Mapped findings generate solution-neutral AC (observable outcomes, not implementation)
- [ ] Mapped findings generate BDD scenarios with real domain data
- [ ] Findings that cannot map to existing stories create new story suggestions
- [ ] Enriched stories are validated against DoR (story size, scenario count)
- [ ] All enriched AC/scenarios trace back to their source finding in ux-analysis.md
- [ ] Dismissed findings are excluded from enrichment

### Outcome KPIs

- **Who**: Developers whose stories receive UX enrichment
- **Does what**: Ship features with UX-quality AC that cover empty states, error handling, and cognitive load -- not just functional behavior
- **By how much**: 60% of UX audit findings are reflected in user story AC after enrichment (vs. 0% currently)
- **Measured by**: Count of UX-derived AC in user-stories.md that trace to ux-analysis.md findings
- **Baseline**: Currently 0% of UX findings are integrated into user stories

### Technical Notes

- Finding-to-story mapping uses journey step references: finding at Step 3 maps to the story covering Step 3
- Enrichment must run AFTER report save (ux-analysis.md exists) and BEFORE story crafting finalizes
- In standalone mode, enrichment is a separate invocation (`--enrich-from-ux`)
- Enrichment must not duplicate AC already present in the story

---

## US-07: Configurable Audit Depth

**Traces to**: Job 5 (Know Whether UX Analysis Is Worth the Time), Outcomes 5.1 (14), 5.3 (11), 5.4 (12)

### Problem

Sara Okonkwo's team builds 3-4 features per sprint. Some are high-stakes customer onboarding flows; others are minor admin panel tweaks. Running a 30-minute comprehensive audit on every feature wastes time and breeds resentment toward the process. But running only lightweight audits on everything misses deep issues in complex features. Sara needs the audit to match the feature's UX risk level.

### Who

- Developer | Wants proportional time investment | Lightweight for simple features, deep-dive for complex ones
- Tech lead | Enforcing team standards | Wants to set default depth per project or feature type

### Solution

Three depth levels with proportional scope: lightweight (Nielsen top-5 + error states, 2 minutes), comprehensive (all 7 categories with scores, 10 minutes), deep-dive (all 7 categories + competitive analysis + before/after examples, 30 minutes). Depth is set by smart gating (integrated mode) or user selection (standalone mode).

### Domain Examples

#### 1: Lightweight Audit for Simple Internal Tool

Yuki runs `/nw-ux reformat-config` and selects lightweight. The auditor evaluates only Nielsen top-5 heuristics (1: visibility, 3: user control, 5: error prevention, 7: flexibility, 9: help with errors) and error state coverage. 2 categories, 3 findings, completed in 90 seconds. No category scores or breakdown displayed.

#### 2: Comprehensive Audit for Customer Dashboard

Marco's smart gating recommends comprehensive for "view-invoice-history." All 7 categories are evaluated: Nielsen's 10 heuristics, Norman's 6 principles, cognitive load (Fitts/Hick/Miller), web platform patterns, emotional arc coherence, error state coverage, and accessibility (WCAG 2.2 AA). 7 categories, 12 findings, category scores shown, completed in 8 minutes.

#### 3: Deep-Dive Audit for Customer Onboarding

Sara requests deep-dive for "customer-onboarding" -- the highest-stakes feature this quarter. All 7 categories plus: competitive analysis comparing the onboarding flow against 3 industry benchmarks, before/after examples for every finding, suggested A/B test hypotheses for key decisions. 7+ categories, 18 findings, completed in 25 minutes.

### UAT Scenarios (BDD)

#### Scenario: Lightweight audit evaluates only essential categories

Given Yuki selects "lightweight" depth for "reformat-config"
When the audit executes
Then only Nielsen top-5 heuristics and error state coverage are evaluated
And the audit completes within 2 minutes
And categories not evaluated are not shown in the output
And findings are limited to the evaluated categories

#### Scenario: Comprehensive audit evaluates all 7 categories with scores

Given Marco's smart gating recommends "comprehensive" depth
When the audit executes
Then all 7 analysis categories are evaluated
And each category produces a score from 0 to 100
And category breakdown is shown in the findings presentation
And the audit completes within 10 minutes

#### Scenario: Deep-dive audit includes competitive analysis and before/after

Given Sara selects "deep-dive" depth for "customer-onboarding"
When the audit executes
Then all 7 categories are evaluated
And competitive analysis compares the journey against industry patterns
And every finding includes before/after examples
And the audit completes within 30 minutes

#### Scenario: Depth is selectable via CLI flag for non-interactive use

Given Sara wants to run audits in a non-interactive context
When she runs `/nw-ux customer-onboarding --depth comprehensive`
Then the audit runs at comprehensive depth without interactive prompts
And all other behavior matches the interactive comprehensive audit

### Acceptance Criteria

- [ ] Three depth levels available: lightweight, comprehensive, deep-dive
- [ ] Lightweight evaluates 2 categories (Nielsen top-5, error states) in approximately 2 minutes
- [ ] Comprehensive evaluates all 7 categories with scores in approximately 10 minutes
- [ ] Deep-dive evaluates all 7 categories plus competitive analysis and before/after in approximately 30 minutes
- [ ] Depth set by smart gating recommendation (integrated) or user selection (standalone)
- [ ] `--depth` CLI flag allows non-interactive depth selection
- [ ] Categories not evaluated at a given depth are not displayed in output

### Outcome KPIs

- **Who**: nWave developers running UX audits at different depths
- **Does what**: Choose the appropriate depth for their feature's UX risk level
- **By how much**: 80% of features receive depth-appropriate analysis (lightweight for low-risk, comprehensive for medium, deep-dive for high)
- **Measured by**: Distribution of depth selections correlated with smart gating recommendations
- **Baseline**: No depth options exist; analysis is either all-or-nothing (or, more commonly, nothing)

### Technical Notes

- Depth determines which analysis categories run; the audit engine must support category scoping
- Smart gating (US-01) recommends depth; this story implements the audit engine respecting that recommendation
- Time estimates are approximate; actual time depends on artifact complexity
- `--depth` flag must validate against the three valid values
