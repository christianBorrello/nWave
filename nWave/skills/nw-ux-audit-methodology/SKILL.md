---
name: nw-ux-audit-methodology
description: UX audit workflow methodology including smart gating criteria, analysis categories, scoring rubric, finding templates, and depth level definitions. Core knowledge for nw-ux-auditor.
user-invocable: false
disable-model-invocation: true
---

# UX Audit Methodology

Core methodology for structured UX analysis of journey artifacts. Defines gating logic, analysis categories, scoring, finding format, and depth scoping.

## Smart Gating Criteria

Evaluate 4 characteristics from DISCUSS context to recommend YES/NO and depth level.

| Characteristic | Values | Weight |
|---------------|--------|--------|
| User-facing | yes / no | Primary -- NO on this alone may recommend skip |
| Interactive elements | yes (forms, filters, pickers, modals) / no | High |
| Emotional complexity | low / medium / high | Medium |
| Novelty | low (established pattern) / medium / high (first of kind) | Medium |

### Recommendation Logic

**YES (comprehensive)**: user-facing=yes AND (interactive=yes OR emotional>=medium OR novelty=high)
**YES (lightweight)**: user-facing=no BUT has user-readable output (error messages, status displays, reports)
**NO**: user-facing=no AND no user-readable output AND novelty=low

### Depth Recommendation Escalation

- 2+ characteristics at high/yes: comprehensive
- User-facing + novelty=high: comprehensive
- First implementation of pattern for this team: escalate one level
- Customer onboarding, payment, or destructive actions: always comprehensive or deep-dive

### Prompt Friction

- YES recommendation: `[Y/n]` (default proceed, opt-out friction)
- NO recommendation: `[y/N]` (default skip, opt-in friction)

### Override Protocol

Accept immediately. Show standalone invocation command when declining. No guilt messaging, no "are you sure" prompts.

## Analysis Categories

7 categories, each producing findings and a score (0-100).

### Category 1: Nielsen's Usability Heuristics

Evaluate journey steps against all 10 heuristics (lightweight mode: H1, H3, H5, H7, H9 only).

| ID | Heuristic | What to Check in Artifacts |
|----|-----------|---------------------------|
| H1 | Visibility of system status | Loading states, progress indicators, confirmation feedback |
| H2 | Match system and real world | Domain language, locale-aware formats, familiar metaphors |
| H3 | User control and freedom | Undo, cancel, back navigation, escape from any state |
| H4 | Consistency and standards | Terminology consistent across steps, standard interaction patterns |
| H5 | Error prevention | Input validation, confirmation for destructive actions, constraints |
| H6 | Recognition over recall | Visible options, recent items, contextual hints |
| H7 | Flexibility and efficiency | Shortcuts for frequent actions, keyboard navigation, bulk operations |
| H8 | Aesthetic and minimalist design | Information density per step, progressive disclosure |
| H9 | Help with errors | Error messages follow three-question pattern, no raw codes |
| H10 | Help and documentation | Contextual help, tooltips, task-oriented guidance |

### Category 2: Norman's Design Principles

Evaluate for: affordances (visible action possibilities), signifiers (indicators of action), mapping (spatial correspondence), feedback (action confirmation), conceptual model (user's mental model match), constraints (limiting incorrect actions).

### Category 3: Cognitive Load

| Law | What to Check |
|-----|--------------|
| Hick's Law | Choices per step. Flag >7 visible options without grouping |
| Fitts's Law | Target size and distance for frequent actions |
| Miller's Law | Information chunks. Flag >7 items without grouping |
| Cognitive load | Total mental effort per step. Flag steps requiring recall of previous step data |

### Category 4: Platform Patterns

Load the platform-specific skill (web, desktop, TUI) and apply its checklist. Common checks:

**Web**: responsive breakpoints, loading skeletons, form validation (inline), focus management, keyboard navigation between list items, empty state design with call-to-action.

**Desktop**: native OS conventions, menu bar structure, keyboard shortcuts, window management, file dialogs, drag-and-drop affordances.

**TUI**: NO_COLOR support, exit codes (0=success, 1=error, 2=usage), stderr for errors, structured --help, progress feedback for operations >2s, stdin piping compatibility, --dry-run for destructive operations.

### Category 5: Emotional Arc Coherence

Evaluate the journey's emotional progression: does confidence build progressively? Are there jarring transitions? Does the error path maintain appropriate emotional tone (guiding, not alarming)? Is the ending satisfying relative to the start?

### Category 6: Error State Coverage

For every happy path step, identify implicit failure modes (network calls, empty collections, user input, timeouts, permissions). Check each against:

1. **Three-question pattern**: Does the error message answer what happened, why, and what to do?
2. **User-friendly language**: No raw error codes, technical jargon, or stack traces
3. **Recovery guidance**: Clear next steps for the user
4. **Emotional tone**: Guiding, not alarming. Matter-of-fact, not apologetic
5. **Destructive action protection**: Confirmation for irreversible operations with consequence description

### Category 7: Accessibility (WCAG 2.2 AA)

Check for: color-only information channels (always pair with text labels), contrast expectations, keyboard-navigable interactions, screen reader landmarks, focus order, text alternatives for visual elements, motion/animation respect for reduced-motion preference.

## Depth Level Scoping

| Depth | Primary (Apple HIG) | Supplementary (Nielsen/Norman) | Time Target | Score Display | Before/After |
|-------|---------------------|-------------------------------|-------------|---------------|-------------|
| Lightweight | Core 4 principles + anti-pattern red flags + accessibility critical | None | 2 min | No scores | Top findings only |
| Comprehensive | All 13 Apple HIG categories | Nielsen 10 + Norman 6 + cognitive load (gap-filling) | 10 min | Category scores + overall | For critical/high findings |
| Deep-dive | All 13 + Design Award traits | Full Nielsen/Norman + competitive analysis | 30 min | Full breakdown | Every finding |

## Finding Format

Every finding follows this structure:

```
{SEVERITY}  {Title}
            {Apple HIG principle}: {category} ({supplementary: Nielsen/Norman ref if applicable})
            {One-sentence explanation of WHY this matters}
            Step: {journey step name and number}
            BEFORE: {current state from the journey artifact}
            AFTER: {recommended state using journey's domain language}
```

Example:
```
CRITICAL  Missing empty state for invoice list
          Clarity: Typography/Layout (also: Nielsen H9 — help with errors)
          Users encountering an empty collection need guidance, not silence.
          Step: 3 (Invoice List)
          BEFORE: "No data"
          AFTER: "No invoices yet. Invoices will appear here after your first billing cycle."
```

### Severity Definitions

| Severity | Criteria | Action |
|----------|----------|--------|
| CRITICAL | User cannot complete task or data loss risk | Fix before handoff |
| HIGH | Significant usability degradation or missing feedback | Fix before handoff |
| MEDIUM | Suboptimal but functional, improvement opportunity | Recommend fixing |
| LOW | Minor enhancement, polish item | Optional |

### Finding Quality Checklist

Each finding must pass:
1. References an Apple HIG principle (Clarity, Deference, Depth, Consistency) and category as primary citation. Nielsen/Norman as supplementary only.
2. Identifies the specific journey step affected
3. Uses the journey's domain language in remediation (invoices, not "items")
4. Provides platform-appropriate patterns (TUI spinner, not web loading overlay)
5. Describes observable user outcome, not implementation prescription

## Scoring Rubric

Per-category score (0-100), using Apple HIG weighted severity:

| Weight | Items | Impact |
|--------|-------|--------|
| Critical (3x) | [CRITICAL] items — App Store rejection risk | Blocking |
| Accessibility (2x) | [A11Y] items — legal compliance, user impact | High priority |
| Platform (1.5x) | Platform-specific conventions | Quality perception |
| Standard (1x) | All other items | Best practice |

Score = (passing × weight) / (total × weight) × 100

| Score Range | Rating | Interpretation |
|-------------|--------|----------------|
| 95-100 | Excellent | App Store ready, Design Award potential |
| 85-94 | Good | App Store ready, minor polish needed |
| 70-84 | Needs Work | Passes review but quality gaps visible |
| 50-69 | Poor | Rejection risk |
| Below 50 | Failing | Major redesign needed |

Overall score: weighted average of evaluated Apple HIG categories. Lightweight mode evaluates core principles + anti-patterns only and notes "partial evaluation" in report.

## Report Template

```markdown
# UX Analysis: {feature-id}

**Date**: {date}
**Depth**: {lightweight|comprehensive|deep-dive}
**Platform**: {web|desktop|tui}
**Score**: {overall}/100

## Executive Summary

{2-3 sentences: top strengths and top concerns}

## Findings

### Critical

{findings sorted within severity}

### High

### Medium

### Low

### Dismissed

{finding title} -- Dismissed: {user rationale}

## Category Scores (comprehensive/deep-dive only)

| Category | Score | Findings |
|----------|-------|----------|
| Nielsen's Heuristics | {score} | {count} |
| Norman's Principles | {score} | {count} |
| Cognitive Load | {score} | {count} |
| Platform Patterns | {score} | {count} |
| Emotional Arc | {score} | {count} |
| Error States | {score} | {count} |
| Accessibility | {score} | {count} |
```

## Story Enrichment Mapping

For integrated mode (DISCUSS Phase 2.75), map accepted findings to user stories:

1. **Step-to-story mapping**: Finding at Step N maps to the user story covering Step N
2. **AC generation**: Convert finding remediation into solution-neutral acceptance criterion
3. **BDD scenario generation**: Create Given/When/Then using real domain data from the journey
4. **Unmapped findings**: When no existing story covers the finding, create a new story suggestion with title and source reference
5. **Size validation**: After enrichment, check story remains right-sized (3-7 scenarios). If enrichment pushes past 7, recommend story split.
6. **Traceability**: Every enriched AC includes `(Source: UX audit, {finding-id})` reference

### AC Generation Rules

- Solution-neutral: "Empty state shows guidance message" not "Render EmptyState React component"
- Observable: "User sees feedback within 1 second" not "Add async loading handler"
- Domain-grounded: "Invoice list guides first-time user" not "Handle empty collection state"
- From the user's perspective: "Error message explains what happened and suggests recovery" not "Display error toast with retry button"

## Platform Detection

Priority order:
1. **YAML metadata**: `platform` field in journey YAML (canonical)
2. **Content signals**: ASCII borders + `$` prompts = TUI. HTML/responsive mentions = web. Native menu/toolbar references = desktop.
3. **User prompt**: "Could not auto-detect platform. Audit as: (1) web, (2) desktop, (3) TUI?"
