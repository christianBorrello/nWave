<!-- markdownlint-disable MD024 -->

# Journey A: Integrated UX Audit

## Persona

**Marco Pellegrini** -- backend developer at a 4-person startup, building his first customer-facing web dashboard. Deep Python/API skills, minimal UX training. Ran `/nw-discuss view-invoice-history` and produced journey YAML, visual mockups, and user stories. Knows he has blind spots but cannot articulate where.

**Sara Okonkwo** -- tech lead at a B2B SaaS company. Reviews DISCUSS handoffs before approving DESIGN wave. Wants systematic quality, not manual eyeballing.

## Goal

After completing journey visualization in DISCUSS, validate UX quality against established principles so problems are fixed as cheap text changes, not expensive code rewrites.

## Emotional Arc

```
  Confidence
  ^
  |                                               (6) Stories
  |                                          .-*   enriched
  |                                    (5) .*
  |                               Findings.*
  |                          clear  *'
  |                    (4) .*
  |              Audit *'
  |         running *
  |    (3) *'
  | Confirm  (2) Smart gate
  |   .'    says YES
  |  * "hmm, do I
  | (1) need this?"
  |  Journey done
  +---------------------------------------------> Time
      Curious     Receptive    Engaged    Confident/Relieved
```

- **Start**: Curious but slightly skeptical -- "Will this slow me down?"
- **Gate**: Reassured -- smart recommendation explains WHY analysis matters for THIS feature
- **Audit**: Engaged -- seeing real issues in MY journey, not abstract theory
- **Findings**: Mix of "oh, I missed that" and satisfaction that happy path was solid
- **Enrichment**: Confident -- stories now cover error states, accessibility, and cognitive load
- **End**: Relieved -- "I would have shipped those problems"

## Happy Path Flow

```
                           DISCUSS FLOW (Phase 2 complete)
                                    |
                                    v
+-------------------------------------------------------------------+
|  STEP 1: Smart Gating (after Decision 1 - Feature Type)           |
|                                                                   |
|  nWave evaluates feature characteristics:                         |
|  - User-facing? YES (web dashboard)                               |
|  - Interactive elements? YES (filters, pagination, date pickers)  |
|  - Emotional complexity? MEDIUM (invoice list, not onboarding)    |
|  - Platform: web                                                  |
|  - Novelty: HIGH (Marco's first dashboard)                        |
|                                                                   |
|  +-------------------------------------------------------------+ |
|  |  UX Analysis                                                 | |
|  |                                                              | |
|  |  Recommended: YES                                            | |
|  |  Depth: comprehensive                                        | |
|  |  Reason: Customer-facing web dashboard with interactive      | |
|  |  elements, first implementation for this team. High UX risk. | |
|  |                                                              | |
|  |  Proceed with UX analysis? [Y/n]                             | |
|  +-------------------------------------------------------------+ |
|                                                                   |
|  Marco presses Enter (default YES)                                |
+-------------------------------------------------------------------+
                                    |
                                    v
+-------------------------------------------------------------------+
|  STEP 2: Artifact Collection                                      |
|                                                                   |
|  nw-ux-auditor reads from docs/feature/view-invoice-history/      |
|  discuss/:                                                        |
|                                                                   |
|  Collecting journey artifacts...                                  |
|    [1/3] journey-view-invoice-history-visual.md    found          |
|    [2/3] journey-view-invoice-history.yaml         found          |
|    [3/3] shared-artifacts-registry.md              found          |
|                                                                   |
|  3 artifacts collected. Starting comprehensive audit...           |
+-------------------------------------------------------------------+
                                    |
                                    v
+-------------------------------------------------------------------+
|  STEP 3: UX Audit Execution (Phase 2.75)                         |
|                                                                   |
|  Running comprehensive UX audit...                                |
|                                                                   |
|  [1/7] Nielsen's Usability Heuristics         analyzing...  done  |
|  [2/7] Norman's Design Principles             analyzing...  done  |
|  [3/7] Cognitive Load (Fitts, Hick, Miller)   analyzing...  done  |
|  [4/7] Web Platform Patterns                  analyzing...  done  |
|  [5/7] Emotional Arc Coherence                analyzing...  done  |
|  [6/7] Error State Coverage                   analyzing...  done  |
|  [7/7] Accessibility (WCAG 2.2 AA)            analyzing...  done  |
|                                                                   |
|  Audit complete. 12 findings across 7 categories.                 |
+-------------------------------------------------------------------+
                                    |
                                    v
+-------------------------------------------------------------------+
|  STEP 4: Findings Presentation                                    |
|                                                                   |
|  UX Audit Results: view-invoice-history                           |
|  Depth: comprehensive | Platform: web | Duration: 8 min          |
|                                                                   |
|  Score: 72/100                                                    |
|                                                                   |
|  Top 3 findings (act on these first):                             |
|                                                                   |
|  CRITICAL  Missing empty state for invoice list                   |
|            Nielsen H9 (help with errors)                          |
|            Step 3 shows "No data" -- recommend:                   |
|            "No invoices yet. Invoices will appear here after      |
|            your first billing cycle."                             |
|                                                                   |
|  HIGH      No loading indicator for invoice fetch                 |
|            Nielsen H1 (visibility of system status)               |
|            Step 2 transitions directly to populated list.         |
|            Add skeleton screen or spinner for the 1-3 second      |
|            API call.                                              |
|                                                                   |
|  HIGH      Error messages show raw HTTP status codes              |
|            Nielsen H9 + TUI error pattern                         |
|            Step 5 shows "Error: 500 Internal Server Error"        |
|            Recommend: "We could not load your invoices.           |
|            This is usually temporary -- try refreshing            |
|            in a few seconds."                                     |
|                                                                   |
|  ... 9 more findings (4 medium, 5 low)                            |
|                                                                   |
|  View full report? [Y/n]                                          |
|  Save to ux-analysis.md? [Y/n]                                    |
+-------------------------------------------------------------------+
                                    |
                                    v
+-------------------------------------------------------------------+
|  STEP 5: Report Generation                                        |
|                                                                   |
|  Saved: docs/feature/view-invoice-history/discuss/                |
|         ux-analysis.md                                            |
|                                                                   |
|  Report includes:                                                 |
|    - Executive summary with score                                 |
|    - 12 findings grouped by severity                              |
|    - Category scores (Nielsen, Norman, Cognitive Load, etc.)      |
|    - Remediation guidance with before/after examples              |
|    - Accessibility checklist results                              |
+-------------------------------------------------------------------+
                                    |
                                    v
+-------------------------------------------------------------------+
|  STEP 6: Story Enrichment (feeds Phase 3)                         |
|                                                                   |
|  UX findings integrated into story crafting:                      |
|                                                                   |
|  US-03 (View Invoice List) enriched with:                         |
|    + AC: Empty state shows guidance message when no invoices      |
|    + AC: Loading skeleton displayed within 100ms of navigation    |
|    + Scenario: "Invoice list guides first-time user"              |
|    + Scenario: "Invoice fetch failure shows recovery guidance"    |
|                                                                   |
|  US-04 (Filter Invoices) enriched with:                           |
|    + AC: Filter options limited to 5 visible choices (Hick)       |
|    + AC: Active filters visible as removable chips                |
|                                                                   |
|  3 stories enriched with 8 additional acceptance criteria         |
|  and 4 new BDD scenarios from UX findings.                        |
|                                                                   |
|  Continue to story mapping? [Y/n]                                 |
+-------------------------------------------------------------------+
                                    |
                                    v
                        DISCUSS FLOW CONTINUES
                        (Phase 3: User Story Mapping)
```

## Error Paths

### Error Path 1: No Journey Artifacts Found

```
+-------------------------------------------------------------------+
|  STEP 2: Artifact Collection                                      |
|                                                                   |
|  Collecting journey artifacts...                                  |
|    [1/3] journey-*-visual.md                   not found          |
|    [2/3] journey-*.yaml                        not found          |
|    [3/3] shared-artifacts-registry.md          not found          |
|                                                                   |
|  ERROR  No journey artifacts found in                             |
|         docs/feature/view-invoice-history/discuss/                |
|                                                                   |
|  UX audit requires at least a journey YAML or visual              |
|  markdown to analyze. These are produced during Phase 2           |
|  (Journey Visualization).                                         |
|                                                                   |
|  Try:                                                             |
|    1. Complete journey visualization first                        |
|    2. Check the feature-id matches: view-invoice-history          |
|    3. Run with --path to specify artifact location                |
|                                                                   |
|  Skipping UX audit. Continuing to Phase 3...                      |
+-------------------------------------------------------------------+
```

**Emotional note**: Not alarming -- matter-of-fact guidance. The user did not do anything wrong; the artifacts just are not ready yet.

### Error Path 2: Audit Finds No Issues

```
+-------------------------------------------------------------------+
|  STEP 4: Findings Presentation                                    |
|                                                                   |
|  UX Audit Results: deploy-service                                 |
|  Depth: lightweight | Platform: TUI | Duration: 2 min            |
|                                                                   |
|  Score: 95/100                                                    |
|                                                                   |
|  No critical or high findings.                                    |
|                                                                   |
|  2 suggestions (low severity):                                    |
|    LOW  Consider adding --dry-run flag for deploy command          |
|    LOW  Help text could include an example with common flags       |
|                                                                   |
|  Your journey looks solid. Nice work.                             |
|                                                                   |
|  Save report? [y/N]                                               |
+-------------------------------------------------------------------+
```

**Emotional note**: Positive reinforcement without being patronizing. Default to NOT saving (low-value report).

### Error Path 3: User Declines UX Analysis

```
+-------------------------------------------------------------------+
|  STEP 1: Smart Gating                                             |
|                                                                   |
|  UX Analysis                                                      |
|                                                                   |
|  Recommended: YES                                                 |
|  Depth: comprehensive                                             |
|  Reason: Customer-facing web dashboard, first implementation.     |
|                                                                   |
|  Proceed with UX analysis? [Y/n] n                                |
|                                                                   |
|  Understood. Skipping UX analysis.                                |
|                                                                   |
|  Note: You can run UX analysis later with:                        |
|    /nw-ux view-invoice-history                                    |
|                                                                   |
|  Continuing to Phase 3 (User Story Mapping)...                    |
+-------------------------------------------------------------------+
```

**Emotional note**: Respects the user's time. No guilt, no "are you sure?" nagging. One reminder about standalone invocation.

### Error Path 4: User Disagrees with Findings

```
+-------------------------------------------------------------------+
|  STEP 4: Findings Presentation (interactive review)               |
|                                                                   |
|  Finding 4 of 12:                                                 |
|                                                                   |
|  MEDIUM  Invoice date format uses ISO 8601 (2024-03-15)           |
|          Nielsen H2 (match system and real world)                  |
|          Users expect locale-aware dates. For US users,            |
|          recommend: "Mar 15, 2024" or "03/15/2024"                |
|                                                                   |
|  Accept / Dismiss / Skip  [a/d/s]                                 |
|                                                                   |
|  Marco types: d                                                   |
|                                                                   |
|  Dismissed. Reason (optional): Our users are developers who       |
|  prefer ISO format. _                                             |
|                                                                   |
|  Noted. Finding dismissed with rationale. It will appear          |
|  in the report as "dismissed (user decision)" with your reason.   |
+-------------------------------------------------------------------+
```

**Emotional note**: The user is the expert on their domain. Dismissed findings are tracked for audit trail, not suppressed.

### Error Path 5: Partial Artifacts Available

```
+-------------------------------------------------------------------+
|  STEP 2: Artifact Collection                                      |
|                                                                   |
|  Collecting journey artifacts...                                  |
|    [1/3] journey-view-invoice-history-visual.md    found          |
|    [2/3] journey-view-invoice-history.yaml         not found      |
|    [3/3] shared-artifacts-registry.md              found          |
|                                                                   |
|  WARNING  Journey YAML not found. Audit will run on visual        |
|  markdown only. Some analysis categories (shared artifact         |
|  consistency, integration checkpoints) require the YAML schema    |
|  and will be skipped.                                             |
|                                                                   |
|  Proceed with partial audit? [Y/n]                                |
+-------------------------------------------------------------------+
```

**Emotional note**: Transparent about reduced coverage. User decides whether partial value is worth it.

## Shared Artifacts (Data Flow)

```
Phase 2 (Journey Visualization)
    |
    |  journey-{name}-visual.md ----+
    |  journey-{name}.yaml ---------+----> STEP 2: Artifact Collection
    |  shared-artifacts-registry.md-+            |
    |                                            v
    |                                    STEP 3: UX Audit Engine
    |                                            |
    |                                            v
    |                                    STEP 5: ux-analysis.md
    |                                            |
    v                                            v
Phase 3 (User Story Mapping)  <------  STEP 6: Enriched Stories
    |                                  (UX findings -> AC + scenarios)
    v
Phase 4 (Story Crafting)
    |
    v
Handoff to DESIGN wave
```

## Integration Checkpoints

1. **Before Step 1**: Feature type decision (Decision 1) must be complete -- smart gating uses feature characteristics from this decision.
2. **Before Step 2**: Phase 2 artifacts must exist in `docs/feature/{id}/discuss/`.
3. **Before Step 6**: Findings must be saved to `ux-analysis.md` before story enrichment begins.
4. **After Step 6**: Enriched stories must still pass DoR validation -- UX findings do not bypass the 9-item gate.

## CLI UX Notes

- Smart gating uses `[Y/n]` (default YES) when recommending analysis, `[y/N]` (default NO) when not recommending -- friction is correctly placed per Job 5 forces analysis.
- Progress indicators follow the `[N/M] Step description... status` pattern for the 7-category audit.
- Findings use severity coloring: CRITICAL (red), HIGH (yellow), MEDIUM (cyan), LOW (dim) -- always paired with text labels (never color-only, WCAG compliance).
- The audit respects `NO_COLOR` and non-TTY environments.
