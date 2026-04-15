---
name: nw-ux
description: "Runs structured UX analysis on journey artifacts. Evaluates against Nielsen, Norman, cognitive load, emotional design, and platform patterns. Produces prioritized findings with actionable remediation."
user-invocable: true
argument-hint: '[feature-id] - Optional: --depth=[lightweight|comprehensive|deep-dive]'
---

# NW-UX: UX Journey Audit

**Wave**: CROSS_WAVE
**Agent**: Iris (nw-ux-auditor)
**Command**: `*audit`

## Overview

Structured UX analysis of DISCUSS journey artifacts (visual markdown, YAML schema). Cross-wave agent usable standalone or integrated into DISCUSS Phase 2.75. Evaluates journey steps against established UX principles, produces prioritized findings with severity, principle references, and before/after remediation grounded in the user's actual journey.

## Context Files Required

- `docs/feature/{feature-id}/discuss/journey-*-visual.md` -- journey visual mockups
- `docs/feature/{feature-id}/discuss/journey-*.yaml` -- journey YAML schema
- `docs/feature/{feature-id}/discuss/shared-artifacts-registry.md` -- shared data flow

## Agent Invocation

@nw-ux-auditor

Execute UX audit for {feature-id}.

SKILL_LOADING: Before any analysis, load your skills from `~/.claude/skills/nw-ux-audit-methodology/SKILL.md` and `~/.claude/skills/nw-ux-principles/SKILL.md`. Load platform skill after detecting platform. Load `~/.claude/skills/nw-ux-emotional-design/SKILL.md` for comprehensive/deep-dive.

**Configuration:**
- feature_id: {feature-id}
- depth: {lightweight|comprehensive|deep-dive} # from --depth flag or user selection
- mode: standalone # integrated mode is triggered via Task from DISCUSS

## Progress Tracking

The invoked agent MUST create a task list from its workflow phases at the start of execution using TaskCreate. Each phase becomes a task with the gate condition as completion criterion. Mark tasks in_progress when starting each phase and completed when the gate passes. This gives the user real-time visibility into progress.

## Success Criteria

- [ ] At least one journey artifact collected and analyzed
- [ ] Every finding references a named UX principle with identifier
- [ ] Remediation uses journey's domain language and platform-appropriate patterns
- [ ] Findings sorted by severity with top 3 shown by default
- [ ] Report saved to `docs/feature/{feature-id}/discuss/ux-analysis.md`
- [ ] Depth level respected (correct number of categories evaluated)

## Next Wave

**Handoff To**: DISCUSS Phase 3 (integrated) or standalone report delivery
**Deliverables**: `ux-analysis.md` with prioritized findings and remediation guidance

## Expected Outputs

```
docs/feature/{feature-id}/discuss/ux-analysis.md
```
