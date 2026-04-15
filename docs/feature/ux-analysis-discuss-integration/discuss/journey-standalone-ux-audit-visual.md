<!-- markdownlint-disable MD024 -->

# Journey B: Standalone UX Audit

## Persona

**Sara Okonkwo** -- tech lead at a B2B SaaS company. Her developer designed a "User Settings" journey using `/nw-discuss`. Sara wants to audit the journey's UX quality before approving handoff to DESIGN. She runs `/nw-ux user-settings` directly, outside the DISCUSS flow.

## Goal

Analyze existing journey artifacts on demand, produce actionable UX findings, without being inside a DISCUSS session.

## Emotional Arc

```
  Confidence
  ^
  |                                        (5) Findings
  |                                   .-*   ready to share
  |                              (4).*
  |                         Audit *'
  |                    findings *
  |               (3) *' clear
  |          Audit *
  |     running *
  | (2)*'
  | Artifacts
  | found    (1)
  |  * Invokes
  | /nw-ux
  +---------------------------------------------> Time
      Purposeful   Monitoring   Evaluating   Satisfied
```

- **Start**: Purposeful -- Sara knows what she wants and invokes directly
- **Collection**: Quick confirmation that artifacts exist
- **Audit**: Watching categories complete, building picture of quality
- **Findings**: Evaluating -- "Is this what I expected? Are there surprises?"
- **End**: Satisfied -- has evidence-based report to share with the team

## Happy Path Flow

```
+-------------------------------------------------------------------+
|  STEP 1: Invocation                                               |
|                                                                   |
|  $ /nw-ux user-settings                                           |
|                                                                   |
|  nw-ux-auditor v1.0                                               |
|                                                                   |
|  Feature: user-settings                                           |
|  Mode: standalone                                                 |
|                                                                   |
|  Select depth:                                                    |
|    > lightweight   (Nielsen top-5, error states -- ~2 min)        |
|      comprehensive (full heuristic audit + scores -- ~10 min)     |
|      deep-dive    (full audit + competitive + before/after -- ~30)|
|                                                                   |
|  Sara selects: comprehensive                                      |
+-------------------------------------------------------------------+
                                    |
                                    v
+-------------------------------------------------------------------+
|  STEP 2: Artifact Discovery                                      |
|                                                                   |
|  Scanning docs/feature/user-settings/discuss/...                  |
|                                                                   |
|  Found:                                                           |
|    journey-user-settings-visual.md       (12 KB, 2026-04-10)     |
|    journey-user-settings.yaml            (8 KB, 2026-04-10)      |
|    shared-artifacts-registry.md          (3 KB, 2026-04-10)      |
|    user-stories.md                       (15 KB, 2026-04-12)     |
|                                                                   |
|  4 artifacts found. Detected platform: web                        |
|                                                                   |
|  Proceed? [Y/n]                                                   |
+-------------------------------------------------------------------+
                                    |
                                    v
+-------------------------------------------------------------------+
|  STEP 3: UX Audit Execution                                      |
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
|  Audit complete. 8 findings across 5 categories.                  |
+-------------------------------------------------------------------+
                                    |
                                    v
+-------------------------------------------------------------------+
|  STEP 4: Findings Presentation                                    |
|                                                                   |
|  UX Audit Results: user-settings                                  |
|  Depth: comprehensive | Platform: web | Duration: 9 min          |
|                                                                   |
|  Score: 78/100                                                    |
|                                                                   |
|  Category Breakdown:                                              |
|    Nielsen's Heuristics     82/100  (2 findings)                  |
|    Norman's Principles      85/100  (1 finding)                   |
|    Cognitive Load           70/100  (2 findings)                  |
|    Web Platform Patterns    90/100  (0 findings)                  |
|    Emotional Arc            75/100  (1 finding)                   |
|    Error State Coverage     60/100  (2 findings)                  |
|    Accessibility            88/100  (0 findings)                  |
|                                                                   |
|  Top 3 findings:                                                  |
|                                                                   |
|  HIGH    Settings page shows 15 options at once                   |
|          Hick's Law -- decision time increases with choices       |
|          Group into 3-4 sections with progressive disclosure.     |
|          Expanding sections reduce visible choices to 4-5.        |
|                                                                   |
|  HIGH    No confirmation for destructive setting changes          |
|          Nielsen H3 (user control and freedom)                    |
|          "Reset to defaults" has no undo. Add confirmation        |
|          dialog: "This will reset 12 settings to defaults.        |
|          This cannot be undone."                                  |
|                                                                   |
|  MEDIUM  Error state for failed save shows "Save failed"          |
|          Nielsen H9 + error pattern (what/why/what-to-do)         |
|          Recommend: "Your settings could not be saved.            |
|          Check your connection and try again. If the problem      |
|          continues, contact support."                             |
|                                                                   |
|  ... 5 more findings (3 medium, 2 low)                            |
|                                                                   |
|  Save to ux-analysis.md? [Y/n]                                    |
+-------------------------------------------------------------------+
                                    |
                                    v
+-------------------------------------------------------------------+
|  STEP 5: Report Generation                                        |
|                                                                   |
|  Saved: docs/feature/user-settings/discuss/ux-analysis.md         |
|                                                                   |
|  Next steps:                                                      |
|    - Share findings with the journey author                        |
|    - Update journey artifacts to address critical/high findings    |
|    - Re-run audit after changes: /nw-ux user-settings              |
|                                                                   |
|  Note: To integrate UX findings into user stories, run:            |
|    /nw-discuss user-settings --enrich-from-ux                      |
+-------------------------------------------------------------------+
```

## Error Paths

### Error Path 1: Feature Directory Does Not Exist

```
+-------------------------------------------------------------------+
|  $ /nw-ux user-settings                                           |
|                                                                   |
|  ERROR  Feature directory not found:                              |
|         docs/feature/user-settings/                                |
|                                                                   |
|  This feature has no DISCUSS artifacts yet.                        |
|                                                                   |
|  Try:                                                              |
|    1. Check the feature ID: /nw-ux --list-features                 |
|    2. Run DISCUSS first: /nw-discuss user-settings                 |
|    3. Specify a custom path: /nw-ux --path docs/feature/...        |
|                                                                   |
|  Available features with journey artifacts:                        |
|    view-invoice-history   (3 artifacts, 2026-04-08)                |
|    onboarding-flow        (4 artifacts, 2026-04-12)                |
+-------------------------------------------------------------------+
```

**Emotional note**: Helpful, not accusatory. Shows available alternatives. Sara can quickly find the right feature ID.

### Error Path 2: Artifacts Exist but Are Outdated

```
+-------------------------------------------------------------------+
|  STEP 2: Artifact Discovery                                      |
|                                                                   |
|  Found:                                                           |
|    journey-user-settings-visual.md    (12 KB, 2026-02-15)        |
|    journey-user-settings.yaml         (8 KB, 2026-02-15)         |
|    user-stories.md                    (15 KB, 2026-04-12)        |
|                                                                   |
|  WARNING  Journey artifacts are 59 days older than user stories.  |
|  The journey may have been updated without regenerating artifacts. |
|                                                                   |
|  Proceed anyway? [y/N]                                            |
+-------------------------------------------------------------------+
```

**Emotional note**: Warns without blocking. The default is NO because auditing stale artifacts produces misleading results.

### Error Path 3: Re-audit After Changes

```
+-------------------------------------------------------------------+
|  $ /nw-ux user-settings                                           |
|                                                                   |
|  Previous audit found: 2026-04-10 (score: 78/100, 8 findings)    |
|                                                                   |
|  Run new audit to check progress? [Y/n]                           |
|                                                                   |
|  ... (audit runs) ...                                              |
|                                                                   |
|  UX Audit Results: user-settings                                  |
|  Score: 91/100 (was 78/100, +13 points)                           |
|                                                                   |
|  Resolved: 5 of 8 findings addressed                              |
|  Remaining: 2 medium, 1 low                                       |
|  New: 0 findings                                                   |
|                                                                   |
|  Good progress. 3 findings remain.                                 |
+-------------------------------------------------------------------+
```

**Emotional note**: Shows delta from previous audit. Celebrates improvement. Motivates completing the remaining items.

## Differences from Journey A (Integrated)

| Aspect | Journey A (Integrated) | Journey B (Standalone) |
|--------|----------------------|----------------------|
| Trigger | Automatic during DISCUSS after Phase 2 | Manual: `/nw-ux {feature-id}` |
| Smart gating | Automatic recommendation based on feature type | User chooses depth directly |
| Story enrichment | Automatic -- findings feed into Phase 3 | Manual -- user told how to enrich |
| Context | Full DISCUSS state available (decisions, persona) | Only file artifacts available |
| Re-audit | Not typical (audit runs once in flow) | Common use case (track improvement) |
| Persona | Developer in flow (Marco) | Reviewer checking quality (Sara) |

## Shared Artifacts (Data Flow)

```
Pre-existing DISCUSS artifacts
    |
    |  journey-{name}-visual.md ----+
    |  journey-{name}.yaml ---------+----> STEP 2: Artifact Discovery
    |  shared-artifacts-registry.md-+            |
    |  user-stories.md (optional) --+            v
    |                                    STEP 3: UX Audit Engine
    |                                            |
    |                                            v
    |                                    STEP 5: ux-analysis.md
    |                                            |
    v                                            v
    Reviewer shares findings           User manually enriches
    with journey author                stories if desired
```

## Integration Checkpoints

1. **Before Step 1**: Feature ID must resolve to an existing directory under `docs/feature/`.
2. **Before Step 3**: At least one journey artifact must be loaded. Platform must be detected.
3. **After Step 5**: ux-analysis.md must be saved before the session ends. If previous audit exists, delta is computed.

## CLI UX Notes

- `/nw-ux` follows the `tool [noun]` pattern consistent with other nWave commands (`/nw-discuss`, `/nw-design`).
- Depth selection uses arrow-key interactive list (TUI pattern: interactive selection). Type-ahead filtering not needed for 3 options.
- `--list-features` flag provides discoverability when user does not remember the feature ID.
- `--path` flag allows auditing artifacts outside the standard directory structure.
- `--depth lightweight|comprehensive|deep-dive` flag allows non-interactive invocation for CI/scripting.
- `--json` flag outputs findings in machine-parseable format for integration with other tools.
- Re-audit detects previous `ux-analysis.md` and shows delta automatically.
