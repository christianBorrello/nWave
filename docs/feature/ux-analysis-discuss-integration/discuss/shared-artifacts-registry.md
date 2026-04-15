<!-- markdownlint-disable MD024 -->

# Shared Artifacts Registry: UX Analysis in DISCUSS Integration

## Overview

This registry documents all shared artifacts (data values appearing in multiple places) across both UX audit journeys. Every `${variable}` in TUI mockups has a documented source and consumer list.

---

## Core Artifacts

### feature_id

| Property | Value |
|----------|-------|
| Source of truth | CLI argument (`/nw-discuss {feature-id}` or `/nw-ux {feature-id}`) |
| Consumers | File path construction, report header, ux-analysis.md path, artifact glob pattern |
| Owner | DISCUSS flow context / CLI parser |
| Integration risk | HIGH -- mismatch breaks artifact discovery and report saving |
| Validation | Must resolve to existing `docs/feature/{feature_id}/` directory |

### depth_level

| Property | Value |
|----------|-------|
| Source of truth | Journey A: smart gating evaluation logic. Journey B: user selection or `--depth` flag |
| Values | `lightweight`, `comprehensive`, `deep-dive` |
| Consumers | Audit execution scope (which categories run), report header, time estimate display |
| Owner | Smart gating (Journey A) / user (Journey B) |
| Integration risk | MEDIUM -- wrong depth means wrong category coverage |
| Validation | Must be one of three valid values. Determines category scope: lightweight=2 categories, comprehensive=7, deep-dive=7+extras |

### platform

| Property | Value |
|----------|-------|
| Source of truth | Journey YAML metadata field, or auto-detected from artifact content, or user specification |
| Values | `web`, `desktop`, `tui` |
| Consumers | Audit category 4 (platform patterns), report header, platform-specific skill loading |
| Owner | Journey YAML (canonical), detection fallback |
| Integration risk | MEDIUM -- wrong platform means wrong pattern checklist applied |
| Validation | Must match one of three supported platforms. Detection falls back to user prompt if ambiguous |

### recommendation

| Property | Value |
|----------|-------|
| Source of truth | Smart gating evaluation logic (Journey A only) |
| Values | `YES`, `NO` |
| Consumers | Gating prompt display, default prompt direction (Y/n vs y/N), ux-analysis.md header |
| Owner | Smart gating |
| Integration risk | LOW -- only used in Journey A Step 1 |
| Validation | Binary. YES sets default to proceed (Y/n); NO sets default to skip (y/N) |

### gate_reason

| Property | Value |
|----------|-------|
| Source of truth | Smart gating evaluation logic (Journey A only) |
| Consumers | Gating prompt, ux-analysis.md header |
| Owner | Smart gating |
| Integration risk | LOW -- informational only |
| Validation | Must reference specific feature characteristics that led to recommendation |

---

## Audit Output Artifacts

### overall_score

| Property | Value |
|----------|-------|
| Source of truth | Weighted aggregate of 7 category scores from audit engine |
| Range | 0-100 |
| Consumers | Findings header, ux-analysis.md executive summary, delta computation (Journey B re-audit) |
| Owner | Audit engine |
| Integration risk | MEDIUM -- score must be consistent between display and saved report |
| Validation | Must be 0-100. Weighting formula: equal weight per category, adjusted for category completion (lightweight only evaluates 2 categories) |

### category_scores

| Property | Value |
|----------|-------|
| Source of truth | Per-category evaluation from audit engine |
| Format | Map of category_name -> score (0-100) + finding_count |
| Consumers | Category breakdown display (Journey B primary), ux-analysis.md, delta computation |
| Owner | Audit engine |
| Integration risk | MEDIUM -- must match findings_list categorization |
| Validation | 7 categories always present; unevaluated categories (lightweight mode) marked as "not evaluated" |

### findings_list

| Property | Value |
|----------|-------|
| Source of truth | Audit engine output, sorted by severity |
| Format | List of finding objects: {severity, title, principle_ref, step_ref, remediation, status} |
| Consumers | Findings presentation (top 3 + full report), ux-analysis.md, story enrichment (Journey A) |
| Owner | Audit engine |
| Integration risk | HIGH -- findings shown must exactly match saved report must match story enrichment input |
| Validation | Each finding must have all 6 fields. Severity must be one of: critical, high, medium, low. Status starts as "open", changes to "dismissed" or "accepted" |

### finding_count

| Property | Value |
|----------|-------|
| Source of truth | Length of findings_list |
| Consumers | Audit completion summary, report header |
| Owner | Derived from findings_list |
| Integration risk | LOW -- derived value |
| Validation | Must equal actual count of findings in list |

### audit_duration

| Property | Value |
|----------|-------|
| Source of truth | Elapsed time from audit start (Step 3 start) to completion |
| Consumers | Findings header display |
| Owner | Audit execution timer |
| Integration risk | LOW -- informational only |
| Validation | Displayed in human-readable format (e.g., "8 min", "2 min") |

---

## Persistence Artifacts

### ux_analysis_path

| Property | Value |
|----------|-------|
| Source of truth | Constructed from `docs/feature/{feature_id}/discuss/ux-analysis.md` |
| Consumers | Report save step, story enrichment input (Journey A), DESIGN handoff package, re-audit delta source (Journey B) |
| Owner | Report generation step |
| Integration risk | HIGH -- this file is the bridge between UX audit and downstream consumers |
| Validation | Path must follow nWave feature directory convention. File must be written before Phase 3 begins (Journey A) |

### previous_audit

| Property | Value |
|----------|-------|
| Source of truth | Existing ux-analysis.md in discuss/ (if present, Journey B only) |
| Consumers | Delta computation, previous score display, resolved finding tracking |
| Owner | Previous audit run |
| Integration risk | MEDIUM -- if format changed between versions, delta may be inaccurate |
| Validation | Check that previous audit format is parseable. If not, warn and skip delta |

---

## Journey A-Specific Artifacts

### feature_type

| Property | Value |
|----------|-------|
| Source of truth | Decision 1 output from DISCUSS flow |
| Consumers | Smart gating evaluation inputs |
| Owner | DISCUSS Decision 1 |
| Integration risk | MEDIUM -- smart gating depends on accurate feature classification |
| Validation | Must be available before smart gating runs. If Decision 1 not complete, smart gating cannot execute |

### ux_findings_for_stories

| Property | Value |
|----------|-------|
| Source of truth | ux-analysis.md (accepted findings only, excludes dismissed) |
| Consumers | Story enrichment in Phase 3 (additional AC and BDD scenarios) |
| Owner | Story enrichment step |
| Integration risk | HIGH -- enriched stories must still pass DoR. Findings must map to specific stories |
| Validation | Each enriched AC must trace to a finding ID in ux-analysis.md. Dismissed findings excluded |

---

## Journey B-Specific Artifacts

### auditor_version

| Property | Value |
|----------|-------|
| Source of truth | nw-ux-auditor agent metadata |
| Consumers | Header display, report metadata |
| Owner | Agent definition |
| Integration risk | LOW -- informational |
| Validation | Must match installed agent version |

### delta_display

| Property | Value |
|----------|-------|
| Source of truth | Computed from current overall_score minus previous_audit score |
| Format | "(was {prev}/100, +{diff} points)" or empty if no previous audit |
| Consumers | Findings header (Journey B Step 4 only) |
| Owner | Delta computation |
| Integration risk | LOW -- display only |
| Validation | Only shown when previous audit exists and was parseable |

---

## Cross-Journey Artifact Flow

```
                    JOURNEY A (Integrated)
                    ======================

Decision 1 ─── feature_type ──> Smart Gating ──> recommendation
                                      |              depth_level
                                      |              gate_reason
                                      v
Phase 2 artifacts ──────────> Artifact Collection
  journey-*-visual.md                 |
  journey-*.yaml ─── platform ───>    |
  shared-artifacts-registry.md        v
                              UX Audit Engine
                                      |
                                      v
                              findings_list ──────> Findings Display
                              category_scores       overall_score
                              finding_count         audit_duration
                                      |
                                      v
                              ux-analysis.md ──────> Story Enrichment
                              (ux_analysis_path)     (ux_findings_for_stories)
                                                           |
                                                           v
                                                     Phase 3: Stories
                                                     with UX-derived AC


                    JOURNEY B (Standalone)
                    =====================

/nw-ux CLI ──── feature_id ──> Invocation
                depth_level         |
                                    v
Existing artifacts ──────────> Artifact Discovery
  + previous ux-analysis.md        |
    (previous_audit) ──────>       |
                                   v
                           UX Audit Engine
                                   |
                                   v
                           findings_list ──────> Findings Display
                           category_scores       overall_score
                           delta_display ──────> (if previous exists)
                                   |
                                   v
                           ux-analysis.md ──────> Reviewer shares
                           (ux_analysis_path)     with journey author
```

---

## Integration Risk Summary

| Risk Level | Artifacts | Mitigation |
|------------|-----------|------------|
| HIGH | feature_id, findings_list, ux_analysis_path, ux_findings_for_stories | Validate at each integration checkpoint. Single source, no duplication |
| MEDIUM | depth_level, platform, overall_score, category_scores, feature_type, previous_audit | Validate at step boundaries. Warn on mismatch |
| LOW | recommendation, gate_reason, finding_count, audit_duration, auditor_version, delta_display | Informational. No downstream dependencies |
