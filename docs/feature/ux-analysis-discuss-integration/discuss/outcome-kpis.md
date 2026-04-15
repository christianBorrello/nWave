<!-- markdownlint-disable MD024 -->

# Outcome KPIs: UX Analysis in DISCUSS Integration

## Epic-Level KPIs

### KPI-E1: Shift-Left UX Issue Detection

- **Who**: nWave developers building user-facing features
- **Does what**: Discover and fix UX issues during DISCUSS (text changes) instead of DELIVER (code changes)
- **By how much**: 70% of UX issues caught before implementation (vs. 0% currently)
- **Measured by**: Count of UX-related rework items in DELIVER wave for features with UX audit vs. features without
- **Baseline**: 100% of UX issues discovered during or after implementation
- **JTBD Source**: Job 1, Outcomes 1.1 (15), 1.4 (13)

### KPI-E2: Developer UX Capability

- **Who**: Developers with low UX expertise (Marco, Yuki profile)
- **Does what**: Produce journey artifacts that pass UX audit with score >= 80/100 without external UX consultation
- **By how much**: After 3 features with audit feedback, average first-audit score improves from 65 to 80
- **Measured by**: First-audit score trend per developer over consecutive features
- **Baseline**: No UX audit scores exist; subjective quality varies by developer
- **JTBD Source**: Job 2, Outcomes 2.2 (17), 2.3 (12)

### KPI-E3: Process Proportionality

- **Who**: All nWave developers
- **Does what**: Invest UX analysis time proportional to feature risk
- **By how much**: Internal utilities skip audit 90% of the time; customer-facing features receive audit 95% of the time
- **Measured by**: Smart gating acceptance rate correlated with feature characteristics
- **Baseline**: 0% of features receive any UX analysis; all are treated identically
- **JTBD Source**: Job 5, Outcomes 5.1 (14), 5.2 (17)

---

## Story-Level KPIs

### US-01: Smart Gating Recommendation

| Metric | Target | Measurement | Baseline |
|--------|--------|-------------|----------|
| Gating accuracy | 80% of recommendations match feature risk | Post-hoc analysis: did features that skipped audit later reveal UX issues? | No gating exists |
| Override rate | Under 20% of recommendations overridden | Count of overrides / total recommendations | N/A |
| Decision time | Under 10 seconds from recommendation to user response | Time from prompt display to keypress | N/A |

### US-02: Journey UX Audit

| Metric | Target | Measurement | Baseline |
|--------|--------|-------------|----------|
| Issue detection rate | Average 5-15 findings per comprehensive audit on first-time features | Finding count from ux-analysis.md | 0 findings (no audit) |
| False positive rate | Under 15% of findings dismissed by user | Dismissed count / total findings per audit | N/A |
| Post-audit rework reduction | 70% fewer UX issues in DELIVER code review | Compare DELIVER UX issues for audited vs. non-audited features | 100% of UX issues found in DELIVER |

### US-03: Error State Coverage Audit

| Metric | Target | Measurement | Baseline |
|--------|--------|-------------|----------|
| Error path coverage | 90% of error paths follow three-question pattern after remediation | Post-remediation journey artifact review | Estimated 30% follow the pattern |
| Missing error state detection | Detect 80% of implicit failure modes from happy path analysis | Manual comparison of detected vs. actual failure modes | No automated detection |

### US-04: Actionable UX Recommendations

| Metric | Target | Measurement | Baseline |
|--------|--------|-------------|----------|
| Self-service resolution | 80% of findings resolved without external research | Track: did developer need Stack Overflow/consultant after reading finding? | 30-60 min research per issue |
| Before/after usefulness | 90% of before/after examples are directly applicable | Finding dismissal rate specifically citing "not applicable" | No before/after provided |

### US-05: Platform-Specific Audit

| Metric | Target | Measurement | Baseline |
|--------|--------|-------------|----------|
| Platform relevance | 95% of platform findings relevant to actual target | Dismissal rate for category 4 (platform patterns) | No platform-specific audit |
| Auto-detection accuracy | 85% of platforms correctly auto-detected from artifacts | Compare auto-detected vs. user-confirmed platform | N/A |

### US-06: Story Enrichment

| Metric | Target | Measurement | Baseline |
|--------|--------|-------------|----------|
| Enrichment coverage | 60% of accepted findings mapped to stories | Count of enriched AC / total accepted findings | 0% (no enrichment) |
| Story quality improvement | Enriched stories score higher on DoR review | Peer review feedback on enriched vs. non-enriched stories | N/A |
| Right-sizing compliance | 0% of enriched stories exceed 7 scenarios without split recommendation | Monitor scenario count post-enrichment | N/A |

### US-07: Configurable Audit Depth

| Metric | Target | Measurement | Baseline |
|--------|--------|-------------|----------|
| Depth-risk alignment | 80% of depth selections match feature risk level | Smart gating recommendation vs. actual depth used | One-size-fits-all (or nothing) |
| Time proportionality | Lightweight under 2 min, comprehensive under 10 min, deep-dive under 30 min | Audit duration from report metadata | N/A |
| Depth distribution | 40% lightweight, 45% comprehensive, 15% deep-dive across all audits | Aggregate depth selections from ux-analysis.md metadata | N/A |

---

## Measurement Infrastructure Notes

- All KPIs derive from data already captured in `ux-analysis.md` (finding count, severity, dismissals, score, depth, duration, platform)
- Developer-over-time KPIs require correlating audits across features by developer identifier (available from git author)
- DELIVER rework comparison requires tagging code review items as "UX-related" (manual classification initially)
- No additional tooling required for Tier 1 KPIs; Tier 2 cross-feature analysis may require aggregation scripts
