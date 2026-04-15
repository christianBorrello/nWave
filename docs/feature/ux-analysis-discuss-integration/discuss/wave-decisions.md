# DISCUSS Decisions — ux-analysis-discuss-integration

## Key Decisions

- [D1] Create a cross-wave agent, not a new wave: The nw-ux-auditor agent follows the cross-wave pattern (like nw-researcher, nw-troubleshooter) — reusable from any context while being delegated from DISCUSS as Phase 2.75. (see: jtbd-job-stories.md, journey-integrated-ux-audit-visual.md)
- [D2] Smart gating with opt-out friction: nWave recommends UX analysis based on feature characteristics. YES uses `[Y/n]` (opt-out), NO uses `[y/N]` (opt-in). This addresses the Four Forces "gaming the system" anxiety without being mandatory. (see: jtbd-four-forces.md, Job 5)
- [D3] Depth proportional to UX Research Depth: Lightweight (2 min, Nielsen top-5) / Comprehensive (10 min, full audit) / Deep-dive (30 min, audit + competitive analysis). Maps directly to DISCUSS Decision 3. (see: jtbd-opportunity-scores.md, Depth-to-Outcome Mapping)
- [D4] Reuse existing UX skills as knowledge base: The agent loads ux-principles, ux-emotional-design, ux-web-patterns, ux-desktop-patterns, ux-tui-patterns — no new knowledge creation needed for Tier 1. (see: user-stories.md, System Constraints)
- [D5] Story enrichment as integration mechanism: UX findings automatically become AC and BDD scenarios in user stories, not a separate report to act on manually. This is the core reason for DISCUSS integration over standalone-only. (see: journey-integrated-ux-audit-visual.md, Step 6)
- [D6] Jobs 3 and 4 deferred to Tier 2: Evidence-based design decisions (Job 3, opp 10.5) and cross-feature consistency (Job 4, opp 11.0) are lower priority. Build core audit first. (see: jtbd-opportunity-scores.md, Strategic Recommendations)

## Requirements Summary

- Primary jobs/user needs: Developers building user-facing features need structured UX validation before implementation to catch problems while they are cheap text changes. Non-UX experts need contextual, actionable guidance grounded in their specific journey artifacts, not abstract theory.
- Walking skeleton scope: Smart Gating → Artifact Collection → Lightweight Audit (Nielsen top-5 + error states) → Findings Display → Report Save
- Feature type: Cross-cutting (new agent + DISCUSS integration + new skill + task file modification)

## Constraints Established

- Agent runs inside Claude Code, no external APIs or network calls
- All I/O is markdown/YAML files in `docs/feature/{feature-id}/discuss/`
- Must respect `NO_COLOR` and non-TTY environments
- Findings must be solution-neutral (observable outcomes, not implementation prescriptions)
- DoR does not currently have UX-specific items — the auditor supplements DoR, does not modify it (Tier 1)

## Upstream Changes

- No DISCOVER or DIVERGE wave ran for this feature — JTBD analysis was performed directly in DISCUSS. This is tracked as a risk: job stories are estimated, not validated through user interviews.

## Artifacts Inventory

| Artifact | Status |
|----------|--------|
| jtbd-job-stories.md | Complete — 5 jobs, 4 personas |
| jtbd-four-forces.md | Complete — forces + summary matrix |
| jtbd-opportunity-scores.md | Complete — 20 outcomes scored, top 3 at >= 15 |
| journey-integrated-ux-audit-visual.md | Complete — 6 steps, 5 error paths |
| journey-integrated-ux-audit.yaml | Complete — 15 Gherkin scenarios |
| journey-standalone-ux-audit-visual.md | Complete — 5 steps, 3 error paths |
| journey-standalone-ux-audit.yaml | Complete — 12 Gherkin scenarios |
| shared-artifacts-registry.md | Complete — 18 artifacts tracked |
| story-map.md | Complete — 6 activities, 2 slices |
| user-stories.md | Complete — 7 stories, 63/63 DoR PASS |
| outcome-kpis.md | Complete — 3 epic + 7 story KPIs |
| dor-validation.md | Complete — all items PASS |
| wave-decisions.md | This file |
