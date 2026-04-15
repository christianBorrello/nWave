# JTBD Four Forces Analysis: UX Analysis in DISCUSS Integration

## How to Read This Document

For each job, the Four Forces model maps the dynamics driving adoption (Push + Pull) against the dynamics resisting it (Anxiety + Habit). A job is worth solving when Push + Pull significantly outweigh Anxiety + Habit.

---

## Job 1: Catch UX Problems Before They Become Code

### Push (Frustration with Current Situation)

- **Late discovery cost**: Marco spent 3 days implementing a "View Invoice History" page, then Sara's review flagged 6 usability issues (missing empty state, no loading indicator, error messages showing raw HTTP status codes, no pagination affordance, inconsistent date formats, missing keyboard navigation). Fixing these post-implementation took 2 additional days. The DISCUSS artifacts had none of these issues documented because nobody checked them against UX principles.
- **Inconsistent quality**: Sara reviews DISCUSS handoffs from 4 developers. Some journeys have thoughtful error states and emotional arcs; others jump straight to happy path and ignore what happens when the API returns a 500. Quality depends entirely on the individual developer's UX awareness.
- **Silent failures**: Yuki shipped a CLI tool where the `deploy` command produced no output for 45 seconds during a successful deployment. Users thought it was frozen and hit Ctrl+C. Nobody caught this during DISCUSS because the journey mockup just showed the final success message, not the waiting state.

### Pull (Attraction of New Solution)

- **Systematic coverage**: Instead of relying on individual knowledge, every journey gets checked against the same UX checklist: Nielsen's 10 heuristics, Norman's 6 principles, platform-specific patterns, emotional arc coherence, error state coverage. Marco's invoice journey would have caught the missing empty state at heuristic 9 (help with errors) and the missing loading indicator at heuristic 1 (visibility of system status).
- **Shift-left savings**: Fixing "add a loading state to the mockup" in DISCUSS takes 5 minutes. Fixing "add a loading spinner, handle the interrupted state, write tests for the loading component" in DELIVER takes 2 hours. The UX auditor operates on text artifacts, not code -- the cheapest possible intervention point.
- **Confidence at handoff**: Sara can approve handoffs knowing UX quality has been systematically validated, not just eyeballed. The audit report provides evidence, not opinion.

### Anxiety (Concerns About Adoption)

- **Process overhead**: "Will this add 30 minutes to every DISCUSS phase? We already spend enough time on requirements." Marco worries that another gate slows him down. Mitigation: depth is configurable (lightweight = 2-minute checklist, comprehensive = full audit), and smart gating skips analysis for low-UX-risk features.
- **False positives**: "Will it flag things that are not real problems, creating busywork?" Sara worries about an overzealous checker that flags every deviation from textbook UX. Mitigation: findings are prioritized by severity (critical/high/medium/low) and each includes concrete rationale, not just "violates heuristic 5."
- **Trust in AI judgment**: "Can an AI really evaluate UX quality? UX is subjective." Dmitri is skeptical that automated analysis catches real issues. Mitigation: the auditor applies established, evidence-based frameworks (not inventing criteria) and provides traceable reasoning. Users can override any finding.

### Habit (Current Behavior Resisting Change)

- **Manual review by lead**: Sara currently reviews DISCUSS artifacts herself, relying on her experience. She has a mental checklist she applies. Switching to a tool-based audit means trusting the tool's coverage over her own judgment. Transition path: the tool augments her review, does not replace it. She sees findings before approving, and can disagree.
- **"Good enough" mindset**: Marco's journeys pass DoR without UX audit today. They are functional, have BDD scenarios, and meet the 9-item checklist. Adding UX quality feels like gold-plating. Transition path: frame UX audit as catching problems that currently slip through DoR (which does not have UX-specific items), not as extra polish.
- **Skipping error states**: Developers habitually design happy paths first and treat error states as afterthoughts. The UX auditor would surface missing error states, which feels like "more work." Transition path: the auditor provides error state templates specific to the journey, reducing the effort to add them.

---

## Job 2: Get UX Guidance Without Being a UX Expert

### Push (Frustration with Current Situation)

- **Knowledge overload**: Marco loaded the ux-principles skill and saw 10 heuristics, 6 design principles, 3 cognitive load laws, accessibility requirements, and progressive disclosure rules. He understands each concept individually but cannot synthesize them into actionable feedback on his specific journey. The skills are reference material, not a consultant.
- **Platform-specific gaps**: Yuki knows general UX principles but does not know TUI-specific patterns well. Her CLI error messages say "Error: ECONNREFUSED" because she did not know the three-question error pattern (what happened, why, what to do). The ux-tui-patterns skill has this pattern, but she did not think to load it during journey design.
- **Abstract to concrete gap**: Sara's team reads "heuristic 7: flexibility and efficiency of use" and does not know what that means for THEIR invoice list page. Does it mean keyboard shortcuts? Bulk selection? Quick filters? The principle is clear; the application to a specific context is not.

### Pull (Attraction of New Solution)

- **Contextual recommendations**: The auditor reads Marco's actual journey YAML and says: "Step 3 (Invoice List) -- your empty state shows 'No data.' This violates heuristic 9. For an invoice list, recommend: 'No invoices yet. Invoices will appear here after your first billing cycle.' Include a link to billing docs."
- **Platform-aware**: When Yuki's journey targets TUI, the auditor automatically applies TUI-specific patterns: check for NO_COLOR support, verify error message format, validate progress indicators for long operations, ensure --help follows the structured format.
- **Graduated depth**: Lightweight mode gives Marco a quick checklist of 8-10 items. Comprehensive mode gives Sara a full audit with competitive analysis. The depth matches the user's need, not a one-size-fits-all report.

### Anxiety (Concerns About Adoption)

- **Overwhelming feedback**: "What if it gives me 40 findings and I do not know where to start?" Marco worries about analysis paralysis. Mitigation: findings are grouped by severity, and the report starts with the top 3 most impactful changes.
- **Cookie-cutter advice**: "Will it give the same generic advice for every journey?" Yuki worries about boilerplate recommendations that do not account for context. Mitigation: recommendations reference the specific journey step, artifact, and persona -- they are grounded in the user's actual work.
- **Dependency on tool**: "If I always rely on the auditor, will I ever learn UX myself?" Marco wants to grow, not just follow orders. Mitigation: each finding includes the principle and rationale, serving as education-in-context.

### Habit (Current Behavior Resisting Change)

- **Stack Overflow and guesswork**: When Marco has a UX question, he searches the web, reads 3-4 articles, and picks the approach that seems best. This is slow (30-60 minutes per decision) but familiar. Transition path: the auditor gives the same quality of answer in seconds, with principle citations, and the user can still do independent research for complex decisions.
- **Copy from existing apps**: Yuki designs her CLI by copying patterns from tools she uses (git, docker, kubectl). This works for common patterns but misses nuanced principles (Hick's Law on subcommand count, error message format, progress feedback timing). Transition path: the auditor validates against principles, not just patterns, catching what "copy and paste" misses.
- **Asking the team lead**: Dmitri asks Sara for UX feedback because she has the most experience. This creates a bottleneck (Sara reviews everything) and does not scale. Transition path: the auditor handles routine UX validation, freeing Sara for genuinely complex design decisions.

---

## Job 3: Make Evidence-Based UX Decisions

### Push (Frustration with Current Situation)

- **Design by committee**: Sara's team spent 45 minutes debating whether the settings page should use tabs or an accordion. No one cited evidence. The decision defaulted to the developer's preference (tabs) because he was implementing it. Later, user testing showed the accordion would have been better for the 3 settings sections they had.
- **Hindsight regret**: Dmitri chose color-coded status indicators for his monitoring dashboard. After shipping, a color-blind user reported they could not distinguish red (error) from green (healthy). Dmitri did not think about accessibility because nobody raised it during DISCUSS.
- **Preference disguised as expertise**: When a senior developer says "I think we should use a modal here," it carries weight because of seniority, not evidence. Junior developers do not push back even when they have valid concerns.

### Pull (Attraction of New Solution)

- **Principled evaluation**: For the tabs-vs-accordion decision, the auditor evaluates: "3 sections favors accordion (Hick's Law -- fewer visible choices at once, each section expands in context). Tabs would be preferred at 5+ sections or when users frequently switch between sections. For settings accessed monthly, accordion with clear section labels is recommended."
- **Shared language**: The team adopts a common vocabulary (Nielsen's heuristics, Hick's Law, progressive disclosure) that replaces "I think" with "this pattern scores higher on..." Decisions become defensible and teachable.
- **Accessibility by default**: The auditor checks color-only information channels, contrast ratios, keyboard navigation, and screen reader patterns as part of every evaluation, not as an afterthought.

### Anxiety (Concerns About Adoption)

- **Rigid recommendations**: "What if the auditor says 'use accordion' but our specific context makes tabs better?" Teams worry about dogmatic application of principles. Mitigation: recommendations include trade-offs and explicitly state when context overrides the general principle.
- **Slowing decisions**: "We need to ship. We cannot analyze every design decision." Mitigation: the auditor is invoked on-demand, not mandatory for every decision. Quick questions get quick answers.

### Habit (Current Behavior Resisting Change)

- **HiPPO (Highest Paid Person's Opinion)**: Design decisions currently go with the most senior person's preference. Transitioning to evidence-based decisions requires the senior person to accept that principles may disagree with their instinct. Transition path: frame the auditor as a resource that strengthens everyone's decisions, including the lead's.
- **Ship and iterate**: Teams prefer to ship quickly and fix UX issues based on user feedback. This works but is expensive (code changes vs text changes). Transition path: the auditor catches the obvious issues pre-implementation; user feedback catches the subtle ones post-implementation. Both approaches coexist.

---

## Job 4: Ensure UX Consistency Across Features

### Push (Frustration with Current Situation)

- **Terminology drift**: Sara's product uses "Save" in the settings page, "Update" in the profile page, "Apply" in the configuration page, and "Confirm" in the checkout page -- all for the same conceptual action. Users notice.
- **Pattern fragmentation**: The invoice list uses pagination. The project list uses infinite scroll. The user list uses "load more" button. Each developer chose the pattern they preferred, and no one tracked what patterns were already in use.
- **Error message inconsistency**: Some error messages are user-friendly ("We couldn't find that page. Try going back to the dashboard."). Others are technical ("404 Not Found"). Some include recovery steps; others do not. The product feels like it was built by 4 different people -- because it was.

### Pull (Attraction of New Solution)

- **Cross-journey analysis**: The auditor compares terminology, interaction patterns, error formats, and emotional tones across all journey artifacts in the project. It flags: "Step 3 uses 'Delete' but the Settings journey uses 'Remove' for the same action. Recommend standardizing on 'Remove' (matches 3 of 4 existing journeys)."
- **Living style guide extraction**: By analyzing existing journeys, the auditor can extract an implicit style guide showing which patterns are already established, making it easier for new features to follow existing conventions.
- **Drift prevention**: Each new journey is checked against established patterns before implementation, preventing consistency debt from accumulating.

### Anxiety (Concerns About Adoption)

- **Retrofitting cost**: "We already have 8 features with inconsistencies. Fixing them all is too expensive." Mitigation: the auditor prioritizes new features (prevention) over existing features (remediation). Consistency report for existing features is informational, not blocking.
- **Creative constraint**: "Forcing consistency might prevent better patterns from emerging." Mitigation: the auditor flags deviations for review, not automatic rejection. Teams can intentionally adopt a new pattern and update the baseline.

### Habit (Current Behavior Resisting Change)

- **Feature-isolated thinking**: Developers design features in isolation. They think about "my feature" not "the product." Transition path: the consistency check is a lightweight automated step, not a manual cross-referencing exercise. It makes product-level thinking easy.
- **No shared design system**: Without an explicit style guide or design system, there is nothing to be consistent WITH. Transition path: the auditor builds the implicit style guide from existing artifacts, giving teams a reference point without requiring upfront investment in a design system.

---

## Job 5: Know Whether UX Analysis Is Worth the Time

### Push (Frustration with Current Situation)

- **One-size-fits-all process**: nWave currently treats every feature the same in DISCUSS. A backend config refactoring gets the same journey design treatment as a customer onboarding flow. This wastes time on low-UX-risk features and may under-invest in high-UX-risk ones.
- **Manual judgment call**: "Should I do UX analysis?" is currently a judgment call with no guidance. Developers either always skip it (because it is optional) or always do it (because they are not sure when it matters). Both are wasteful.

### Pull (Attraction of New Solution)

- **Intelligent recommendation**: nWave analyzes the feature characteristics and says: "This feature has user-facing interactive elements, a first-time user experience, and emotional complexity. UX analysis recommended at comprehensive depth." Or: "This feature is an internal API refactoring with no UI changes. UX analysis not recommended."
- **Time proportionality**: Lightweight analysis (2-minute checklist) for simple features. Standard audit (10-minute analysis) for typical features. Comprehensive deep-dive (30-minute audit with competitive analysis) for high-stakes features. Time investment matches risk.
- **User override**: The recommendation is a suggestion, not a mandate. Users can always override in either direction.

### Anxiety (Concerns About Adoption)

- **Wrong recommendations**: "What if it says 'skip' for a feature that actually needs UX analysis?" Mitigation: the recommendation includes reasoning (e.g., "No interactive elements detected") so the user can evaluate whether the reasoning applies. Override is always one keystroke away.
- **Gaming the system**: "Developers will always accept 'skip' to save time." Mitigation: for features flagged as needing analysis, the recommendation is opt-out (default YES) rather than opt-in (default NO). The friction is correctly placed.

### Habit (Current Behavior Resisting Change)

- **Always skip**: Developers accustomed to skipping UX considerations will default to accepting "not recommended." Transition path: the gating happens automatically as part of the DISCUSS flow, not as a separate step the developer must remember to invoke. When the recommendation is YES, the default action proceeds with analysis.
- **Always do everything**: Some developers (or team policies) always run the full process for compliance reasons. Transition path: the depth setting can be configured per-project or per-team, so comprehensive analysis is the default for customer-facing products and lightweight is the default for internal tools.

---

## Forces Summary Matrix

| Job | Push Strength | Pull Strength | Anxiety Level | Habit Resistance | Net Adoption Force |
|-----|---------------|---------------|---------------|------------------|--------------------|
| 1. Catch UX problems early | HIGH (real cost: 2x rework) | HIGH (shift-left savings) | MEDIUM (process overhead) | MEDIUM (manual review works) | **STRONG** |
| 2. Get UX guidance | HIGH (knowledge overload) | HIGH (contextual recommendations) | MEDIUM (overwhelming feedback) | LOW (current approach is slow) | **STRONG** |
| 3. Evidence-based decisions | MEDIUM (design by committee) | MEDIUM (principled evaluation) | LOW (on-demand, not mandatory) | HIGH (HiPPO culture) | **MODERATE** |
| 4. Consistency across features | MEDIUM (visible but tolerable) | MEDIUM (cross-journey analysis) | MEDIUM (retrofitting cost) | HIGH (feature-isolated thinking) | **MODERATE** |
| 5. Smart gating | MEDIUM (one-size-fits-all) | HIGH (time proportionality) | LOW (easy override) | MEDIUM (always skip habit) | **STRONG** |
