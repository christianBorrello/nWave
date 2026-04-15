# JTBD Opportunity Scoring: UX Analysis in DISCUSS Integration

## Methodology

Using the ODI (Outcome-Driven Innovation) opportunity algorithm:

**Opportunity Score = Importance + max(Importance - Satisfaction, 0)**

- **Importance** (1-10): How important is this outcome to the user?
- **Satisfaction** (1-10): How satisfied are users with current solutions?
- **Opportunity Score**: 10-20 = overserved (skip), 10-12 = served (low priority), 12-15 = underserved (opportunity), 15+ = highly underserved (strong opportunity)

Scores are estimated from the personas and context described in the job stories and four forces analysis. In a live product, these would be validated through user interviews.

---

## Outcome Scores by Job

### Job 1: Catch UX Problems Before They Become Code

| # | Outcome Statement | Importance | Satisfaction | Opportunity Score | Segment |
|---|-------------------|------------|--------------|-------------------|---------|
| 1.1 | Minimize the time spent discovering UX issues after code is written | 9 | 3 | 15 | All developers |
| 1.2 | Minimize the likelihood of shipping a journey with unaddressed usability heuristic violations | 8 | 2 | 14 | All developers |
| 1.3 | Maximize the confidence that error paths and edge cases have adequate UX treatment | 9 | 2 | 16 | All developers |
| 1.4 | Minimize the number of UX-related rework cycles in DELIVER wave | 8 | 3 | 13 | Tech leads (Sara) |

**Job 1 Average Opportunity: 14.5 (underserved)**

### Job 2: Get UX Guidance Without Being a UX Expert

| # | Outcome Statement | Importance | Satisfaction | Opportunity Score | Segment |
|---|-------------------|------------|--------------|-------------------|---------|
| 2.1 | Minimize the time to learn which UX principles apply to my specific journey | 8 | 2 | 14 | Non-UX developers (Marco, Yuki) |
| 2.2 | Maximize the actionability of UX recommendations (specific changes, not general advice) | 9 | 1 | 17 | Non-UX developers (Marco, Yuki) |
| 2.3 | Minimize the expertise gap between my journey and what a UX professional would produce | 7 | 2 | 12 | Non-UX developers (Marco) |
| 2.4 | Minimize the cognitive load of processing UX feedback (right-sized to depth setting) | 7 | 3 | 11 | All developers |

**Job 2 Average Opportunity: 13.5 (underserved)**

### Job 3: Make Evidence-Based UX Decisions

| # | Outcome Statement | Importance | Satisfaction | Opportunity Score | Segment |
|---|-------------------|------------|--------------|-------------------|---------|
| 3.1 | Minimize the time spent in design disagreements without resolution | 6 | 4 | 8 | Teams (Sara, Dmitri) |
| 3.2 | Maximize the traceability of design decisions to established UX principles | 7 | 2 | 12 | Tech leads (Sara) |
| 3.3 | Minimize the risk of choosing an approach that works for team but fails for users | 8 | 3 | 13 | All developers |
| 3.4 | Maximize team alignment on UX quality standards | 6 | 3 | 9 | Teams |

**Job 3 Average Opportunity: 10.5 (adequately served -- lower priority)**

### Job 4: Ensure UX Consistency Across Features

| # | Outcome Statement | Importance | Satisfaction | Opportunity Score | Segment |
|---|-------------------|------------|--------------|-------------------|---------|
| 4.1 | Minimize the number of UX inconsistencies that reach users | 7 | 2 | 12 | Teams with multiple features (Sara) |
| 4.2 | Minimize the time to detect terminology and pattern mismatches across features | 7 | 1 | 13 | Tech leads (Sara) |
| 4.3 | Maximize the perception of product coherence by end users | 6 | 3 | 9 | Teams with multiple features |
| 4.4 | Minimize the effort to maintain a consistent UX vocabulary as product grows | 6 | 2 | 10 | Teams scaling beyond 3 features |

**Job 4 Average Opportunity: 11.0 (adequately served -- lower priority, grows with scale)**

### Job 5: Know Whether UX Analysis Is Worth the Time

| # | Outcome Statement | Importance | Satisfaction | Opportunity Score | Segment |
|---|-------------------|------------|--------------|-------------------|---------|
| 5.1 | Minimize the time wasted on UX analysis for features that do not benefit | 8 | 2 | 14 | All developers |
| 5.2 | Maximize the likelihood that features needing UX analysis actually receive it | 9 | 1 | 17 | Tech leads (Sara) |
| 5.3 | Minimize the friction of the gating decision | 7 | 3 | 11 | All developers |
| 5.4 | Maximize trust in the nWave methodology by making proportional recommendations | 8 | 4 | 12 | All nWave users |

**Job 5 Average Opportunity: 13.5 (underserved)**

---

## Opportunity Landscape

```
                    IMPORTANCE
                10 |
                   |  1.3*        2.2*
                 9 |  1.1*   5.2*
                   |
                 8 |  1.2  1.4  5.1   2.1   5.4
                   |                          3.3
                 7 |       4.2  4.1   2.3   3.2    2.4
                   |
                 6 |  4.4       4.3   3.1        3.4
                   |
                 5 +---+----+----+----+----+----+----+---
                   1    2    3    4    5    6    7    8   10
                                SATISFACTION

    * = Opportunity Score >= 15 (highly underserved)

    Top-right quadrant (high importance, high satisfaction) = well-served
    Top-left quadrant (high importance, low satisfaction) = OPPORTUNITY ZONE
```

---

## Priority Ranking by Opportunity Score

| Rank | Outcome | Score | Job | Action |
|------|---------|-------|-----|--------|
| 1 | 2.2: Actionable, specific UX recommendations | 17 | Job 2 | **Build first** -- highest gap between importance and satisfaction |
| 2 | 5.2: Features needing analysis actually receive it | 17 | Job 5 | **Build first** -- enables correct application of all other jobs |
| 3 | 1.3: Error paths have adequate UX treatment | 16 | Job 1 | **Build first** -- most common blind spot, highest rework cost |
| 4 | 1.1: Reduce post-code UX issue discovery | 15 | Job 1 | **Build with rank 3** -- same audit mechanism |
| 5 | 1.2: No unaddressed heuristic violations | 14 | Job 1 | **Build with rank 3** -- same audit mechanism |
| 6 | 2.1: Learn which UX principles apply to my journey | 14 | Job 2 | **Build with rank 1** -- same recommendation engine |
| 7 | 5.1: No time wasted on low-UX-risk features | 14 | Job 5 | **Build with rank 2** -- same gating mechanism |
| 8 | 1.4: Fewer UX rework cycles | 13 | Job 1 | Emerges from ranks 3-5 |
| 9 | 3.3: Approach works for users, not just team | 13 | Job 3 | Second phase |
| 10 | 4.2: Detect terminology mismatches | 13 | Job 4 | Second phase |

---

## Strategic Recommendations

### Tier 1: Build Now (Opportunity Score >= 14)

**Smart Gating + Core UX Audit**

These outcomes cluster around two capabilities:
1. **Smart gating** (Job 5, outcomes 5.1 and 5.2): Determine whether UX analysis is needed and at what depth. This is the enabling job -- without it, the audit either runs unnecessarily or gets skipped when needed.
2. **Journey UX audit with actionable findings** (Jobs 1 and 2, outcomes 1.1-1.3, 2.1-2.2): Analyze DISCUSS journey artifacts against UX principles and produce specific, contextual, prioritized recommendations with remediation guidance.

These two capabilities form the walking skeleton of the nw-ux-auditor agent.

### Tier 2: Build Next (Opportunity Score 11-13)

**Evidence-Based Decisions + Consistency Detection**

3. **Design decision evaluation** (Job 3, outcome 3.3): On-demand analysis of specific design alternatives against UX principles. Lower priority because it is invoked situationally, not systematically.
4. **Cross-journey consistency** (Job 4, outcomes 4.1-4.2): Compare patterns across feature journeys. Lower priority for solo developers (Marco, Yuki) but grows in importance for teams (Sara) as feature count increases.

### Tier 3: Build Later (Opportunity Score < 11)

5. **UX vocabulary/style guide extraction** (Job 4, outcome 4.4): Automatically extract implicit style guide from existing journeys. Valuable at scale but premature for small teams.
6. **Team alignment on UX standards** (Job 3, outcome 3.4): Cultural change that emerges from using the tool, not a feature to build.

---

## Depth-to-Outcome Mapping

The three depth levels map directly to outcome priorities:

| Depth Level | Setting | Outcomes Addressed | Time Investment | Best For |
|-------------|---------|-------------------|-----------------|----------|
| **Lightweight** | `ux-research-depth: checklist` | 1.2 (heuristic violations), 1.3 (error paths) | 2 minutes | Internal tools, simple features, experienced developers |
| **Standard** | `ux-research-depth: audit` | All Tier 1 outcomes (1.1-1.3, 2.1-2.2, 5.1-5.2) | 10 minutes | Typical user-facing features |
| **Comprehensive** | `ux-research-depth: deep-dive` | All Tier 1 + Tier 2 outcomes | 30 minutes | Onboarding flows, high-stakes features, first-of-kind patterns |

---

## Validation Notes

These scores are estimated based on:
- Persona analysis (Marco, Sara, Yuki, Dmitri) grounded in nWave's actual user base
- Four forces analysis identifying real frustrations and current workarounds
- nWave's existing capability gaps (5 passive UX skills, no active audit)

To validate, recommended interviews:
- 3-5 nWave users who have completed DISCUSS for user-facing features
- Focus questions: "Tell me about a time you discovered a UX problem after implementation" and "How do you currently decide whether to invest in UX quality during DISCUSS?"
