<!-- markdownlint-disable MD024 -->

# Story Map: UX Analysis in DISCUSS Integration

## Backbone (User Activities)

```
+------------------+   +---------------------+   +-------------------+   +------------------+   +--------------------+   +-------------------+
| 1. Smart Gating  |-->| 2. Artifact         |-->| 3. UX Audit       |-->| 4. Findings      |-->| 5. Report          |-->| 6. Story          |
|                  |   |    Collection        |   |    Execution       |   |    Review         |   |    Generation      |   |    Enrichment     |
| Receive and      |   | Auditor gathers     |   | Analyze against    |   | Review, accept,   |   | Save findings as   |   | Integrate into    |
| respond to UX    |   | journey artifacts    |   | heuristics and     |   | or dismiss        |   | ux-analysis.md     |   | user stories as   |
| recommendation   |   | from discuss/        |   | principles         |   | findings          |   |                    |   | new AC/scenarios  |
+------------------+   +---------------------+   +-------------------+   +------------------+   +--------------------+   +-------------------+
```

### Activity Details

| # | Activity | Journey A (Integrated) | Journey B (Standalone) | JTBD Source |
|---|----------|----------------------|----------------------|-------------|
| 1 | Smart Gating | Automatic recommendation based on feature characteristics | User selects depth directly (no gating) | Job 5 |
| 2 | Artifact Collection | Reads from discuss/ in current DISCUSS session | Scans discuss/ for existing artifacts + staleness check | Job 1 |
| 3 | UX Audit Execution | Runs 2-7 categories based on depth | Same audit engine, same categories | Jobs 1, 2 |
| 4 | Findings Review | Top-3 prioritized, accept/dismiss workflow | Category breakdown + delta from previous audit | Jobs 1, 2 |
| 5 | Report Generation | Save ux-analysis.md before Phase 3 | Save ux-analysis.md with next-steps guidance | Jobs 1, 2 |
| 6 | Story Enrichment | Automatic: findings become AC and BDD scenarios | Manual: user runs `/nw-discuss --enrich-from-ux` | Jobs 1, 2 |

---

## Walking Skeleton

The thinnest end-to-end slice that delivers verifiable value:

```
Smart Gating              Artifact Collection        Lightweight Audit         Findings Display          Report Save
(recommend YES/NO)  --->  (find journey artifacts) --> (Nielsen top-5 +      --> (show top findings    --> (save ux-analysis.md)
                                                        error states only)      with severity + fix)
```

### Walking Skeleton Scope

- **Smart Gating**: Evaluate 4 feature characteristics (user-facing, interactive, emotional complexity, novelty). Output YES/NO with depth recommendation.
- **Artifact Collection**: Glob `journey-*-visual.md` and `journey-*.yaml` from `docs/feature/{id}/discuss/`. Require at least one.
- **Lightweight Audit**: Nielsen heuristics 1, 3, 5, 7, 9 (top-5 most impactful) + error state coverage. Two categories only.
- **Findings Display**: Show findings sorted by severity. Each has: severity label, title, principle reference, remediation text.
- **Report Save**: Write `ux-analysis.md` with executive summary and findings.

### What the Walking Skeleton Does NOT Include

- Comprehensive/deep-dive depth levels (only lightweight)
- Category scores and breakdown display
- Accept/dismiss workflow for individual findings
- Story enrichment (automatic or manual)
- Delta tracking from previous audits
- Platform-specific pattern analysis
- `--json`, `--depth`, `--path` CLI flags

### Walking Skeleton Integration Points

1. DISCUSS flow context provides feature-id and feature characteristics
2. Filesystem provides journey artifacts from discuss/
3. UX skills (ux-principles) provide heuristic checklist
4. Filesystem receives ux-analysis.md output

4 integration points -- within the 5-point limit.

---

## Release Slices

### Slice 1 (Tier 1): Smart Gating + Core Audit

**Delivers**: A developer can get UX feedback on their journey before handoff to DESIGN.

| Story | Activity | Outcome |
|-------|----------|---------|
| US-01: Smart gating recommendation | 1. Smart Gating | Developer receives intelligent YES/NO recommendation with reasoning |
| US-02: Journey UX audit | 2-4. Collection + Execution + Review | Journey analyzed against heuristics, prioritized findings shown |
| US-03: Error state coverage audit | 3-4. Execution + Review | Error paths specifically checked for UX treatment quality |
| US-04: Actionable UX recommendations | 4. Findings Review | Each finding includes specific remediation with before/after |
| US-05: Platform-specific audit | 3. Execution | Correct patterns applied for web/desktop/TUI |
| US-07: Configurable audit depth | 1, 3. Gating + Execution | Lightweight/comprehensive/deep-dive with proportional analysis |

**JTBD Outcomes Addressed**: 1.1 (15), 1.2 (14), 1.3 (16), 2.1 (14), 2.2 (17), 5.1 (14), 5.2 (17)

### Slice 2 (Tier 2): Story Enrichment + Advanced Features

**Delivers**: UX findings automatically improve user stories and cross-journey consistency.

| Story | Activity | Outcome |
|-------|----------|---------|
| US-06: Story enrichment | 6. Story Enrichment | Findings integrated as AC and BDD scenarios in user stories |
| (Future) Cross-journey consistency | Beyond current scope | Detect terminology and pattern drift across features |
| (Future) Design decision evaluation | Beyond current scope | On-demand analysis of design alternatives |

**JTBD Outcomes Addressed**: 1.4 (13), 3.3 (13), 4.2 (13)

---

## Scope Assessment: PASS -- 7 stories, 2 bounded contexts, estimated 10 days

### Bounded Contexts

1. **UX Audit Engine** -- smart gating, artifact collection, audit execution, findings generation
2. **DISCUSS Integration** -- story enrichment, report persistence, handoff packaging

### Assessment

| Signal | Value | Threshold | Status |
|--------|-------|-----------|--------|
| User stories | 7 | <=10 | PASS |
| Bounded contexts | 2 | <=3 | PASS |
| Walking skeleton integration points | 4 | <=5 | PASS |
| Estimated effort | 10 days | <=14 days | PASS |
| Independent user outcomes | 2 (audit + enrichment) | Could ship separately | PASS |

Feature is right-sized. No split required.

---

## Priority Rationale

### Priority Order

1. **US-01 (Smart Gating)** -- Enabling job (Job 5). Without this, every feature gets the same treatment, wasting time on low-risk features and missing high-risk ones. Opportunity scores 5.2=17 and 5.1=14. Must ship first because it controls whether the rest of the audit runs.

2. **US-02 (Journey UX Audit)** -- Core value proposition (Job 1). This IS the audit. Addresses the highest-impact outcomes: 1.3=16 (error paths), 1.1=15 (post-code discovery). Without this, there is nothing to gate, review, or enrich.

3. **US-07 (Configurable Audit Depth)** -- Proportionality (Job 5). Tightly coupled to US-01 (gating recommends a depth) and US-02 (audit runs at that depth). Shipping US-02 without depth configuration means one-size-fits-all, which the four forces analysis identified as a key frustration.

4. **US-05 (Platform-Specific Audit)** -- UX guidance quality (Job 2). Web/desktop/TUI patterns are different. Without platform awareness, recommendations are generic. Addresses outcome 2.1=14. Depends on US-02 (needs the audit engine to exist).

5. **US-04 (Actionable Recommendations)** -- Highest single outcome score (2.2=17, Job 2). Each finding needs specific remediation with before/after, not just "violates heuristic 5." This transforms the audit from a checklist into a consultant. Depends on US-02.

6. **US-03 (Error State Coverage)** -- Specific audit dimension (Job 1). Error paths are the most common blind spot (outcome 1.3=16). Specialized checking beyond general heuristic evaluation. Depends on US-02.

7. **US-06 (Story Enrichment)** -- Downstream integration (Jobs 1+2). Automates the connection between findings and stories. High value but depends on all of US-01 through US-05 producing findings worth enriching. Ships in Slice 2.

### Dependency Graph

```
US-01 (Smart Gating) ──────────> US-07 (Configurable Depth)
         |                              |
         v                              v
US-02 (Core Audit) ──> US-05 (Platform) ──> US-04 (Actionable Recs)
         |                                          |
         v                                          v
US-03 (Error State) ──────────────────────> US-06 (Story Enrichment)
```
