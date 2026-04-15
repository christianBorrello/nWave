---
name: nw-ux-apple-hig
description: Apple Human Interface Guidelines as primary UX audit framework. Covers all 6 Apple platforms (iOS, iPadOS, macOS, watchOS, tvOS, visionOS), core design principles (Clarity, Deference, Depth, Consistency), platform conventions, typography, color, layout, navigation, motion, haptics, accessibility, privacy, and anti-patterns. Load as PRIMARY audit framework — generic UX principles (Nielsen, Norman) are supplementary.
user-invocable: false
disable-model-invocation: true
---

# Apple Human Interface Guidelines — Primary UX Audit Framework

This is the PRIMARY framework for UX auditing. Apple's HIG principles apply universally to quality UX design, not just Apple platforms. Generic frameworks (Nielsen, Norman, cognitive load) serve as supplementary lenses when Apple HIG does not cover a specific concern.

**Source of truth**: `docs/feature/ux-analysis-discuss-integration/research/apple-ux-knowledge-base.md` (1,151 lines, 22 sources cited)

## Framework Hierarchy

```
PRIMARY:   Apple HIG (this skill)
           └── 4 core principles + 13 audit categories + anti-patterns
           └── Platform-specific checklists (iOS, iPadOS, macOS, watchOS, tvOS, visionOS)

SECONDARY: nw-ux-principles (Nielsen's 10 heuristics, Norman's 6 principles, cognitive load laws)
           └── Use when Apple HIG does not address a specific concern
           └── Use for non-Apple platforms (web apps, TUI, cross-platform)

TERTIARY:  nw-ux-emotional-design, nw-ux-web-patterns, nw-ux-desktop-patterns, nw-ux-tui-patterns
           └── Load on-demand based on platform
```

## Core Design Principles

Every finding should trace to one of these four principles first, then to a specific category.

### Clarity
Every element must be immediately understandable. Text legible at all sizes. Icons precise and recognizable. Information hierarchy visually clear. No decorative noise competing with content.

| Check | Failure |
|-------|---------|
| Text legible at default and scaled sizes | Body text below 11pt; low-contrast on backgrounds |
| Icons convey meaning without labels | Ambiguous custom icons requiring tooltips |
| Information hierarchy visually prominent | Flat layouts where everything has equal weight |
| Screen purpose immediately understandable | Requires instruction or exploration to use |

### Deference
Interface defers to content. What users care about stays in focus. UI helps understand and interact with content but never competes with it. Chrome is minimal; translucent elements hint at layers.

| Check | Failure |
|-------|---------|
| Content occupies majority of screen | Chrome-heavy UI with small content areas |
| Controls do not dominate | Persistent toolbars covering content on scroll |
| Interactive elements visually lighter than content | Bold, colorful navigation competing with page |

### Depth
Visual layers and motion convey hierarchy and spatial relationships. Translucency hints at content beneath surfaces. Touch and discoverability heighten delight.

| Check | Failure |
|-------|---------|
| Modal content appears above parent content | Flat modals with no depth indication |
| Transitions show where content comes from/goes | Jump cuts between unrelated screens |
| Users maintain context awareness | Full-screen modals when sheets would suffice |

### Consistency
Leverage familiar patterns and system components. Consistent controls, views, and terminology ensure predictable experience. Knowledge transfers between apps.

| Check | Failure |
|-------|---------|
| System components used where applicable | Custom controls replicating system behavior |
| Navigation follows platform conventions | Hamburger menus on iOS instead of tab bars |
| Terminology matches system standards | "Remove" instead of "Delete" on iOS |
| Gestures match system conventions | Custom swipe conflicting with system |

## Audit Categories

13 categories organized by Apple HIG structure. Items marked [CRITICAL] risk App Store rejection. Items marked [A11Y] are accessibility requirements.

### 1. Typography

- All text uses Dynamic Type text styles (Large Title, Body, Caption, etc.)
- No hardcoded font sizes [CRITICAL]
- Layout reflows at all Dynamic Type sizes including accessibility XXL [A11Y]
- Text never truncated at larger sizes — wraps or scrolls [A11Y]
- Minimum readable size: 11pt (Caption 2)
- Text hierarchy: Large Title > Title 1 > Headline > Body > Footnote > Caption
- Font weight variation used meaningfully (Semibold for emphasis, Regular for body)

### 2. Color

- Semantic colors for text: `.label`, `.secondaryLabel`, `.tertiaryLabel`, `.quaternaryLabel`
- Semantic backgrounds: `.systemBackground`, `.secondarySystemBackground`, `.systemGroupedBackground`
- System tint colors for interactive elements
- No hardcoded hex/RGB for standard UI elements
- Custom colors have light and dark variants
- Contrast 4.5:1 for normal text, 3:1 for large text [A11Y] [CRITICAL]
- Information never conveyed by color alone [A11Y] [CRITICAL]
- Fully functional in Dark Mode
- Destructive actions use `.systemRed`

### 3. Icons and SF Symbols

- SF Symbols used for system-concept icons (search, share, settings, compose, delete)
- Custom icons match SF Symbols optical weight, detail, perspective
- Tab bar: filled=selected, outlined=unselected
- All icons have VoiceOver labels [A11Y]
- App icon: light, dark, tinted variants (iOS 18+)
- Icons recognizable at rendered size

### 4. Layout and Spacing

- All interactive content within safe areas [CRITICAL]
- Touch targets: 44x44pt minimum (iOS/iPadOS/macOS), 60x60pt (visionOS) [CRITICAL]
- 8pt grid alignment
- Screen edge margins: 16pt phone, 20pt tablet
- Layout adapts to all size classes (compact/regular width/height)
- Content extends edge-to-edge for visual richness
- iPad: multi-column design, not stretched iPhone layout

### 5. Navigation

**Structure**:
- Tab bar on iPhone (3-5 tabs) — items navigate, never trigger actions [CRITICAL on iOS]
- Sidebar on iPad for regular-width layouts
- Each tab retains own navigation state
- No hamburger menu as primary navigation on iOS

**Hierarchy**:
- Navigation Bar with back button for drill-down
- System edge-swipe back gesture works throughout [CRITICAL — never override]
- Disclosure indicators (chevrons) show drill-down capability
- Users always know: where am I, where can I go, how do I get back

**Modals and Sheets**:
- Self-contained tasks → sheets (not full-screen push)
- Sheets dismissible via swipe-down or close button
- Modals with unsaved data confirm before discarding [CRITICAL]
- Alerts: UIAlertController only, used sparingly

### 6. Motion and Animation

- Every animation serves a purpose (feedback, orientation, status)
- Transitions show spatial relationships
- Reduce Motion respected: slides → crossfades [A11Y] [CRITICAL]
- No auto-playing decorative animations
- No motion sickness triggers (large zooms, spinning, parallax)
- Spring animations for gesture-driven interactions

### 7. Haptics and Feedback

Three Apple principles: **Causality** (obvious cause), **Harmony** (sound + haptic + visual coordinated), **Utility** (adds value, not decoration).

- Success/error haptics for task completion outcomes
- Selection haptics for discrete value changes (pickers, toggles)
- No excessive haptic usage (haptic fatigue)
- Graceful degradation without Taptic Engine

### 8. Accessibility

**VoiceOver**:
- Every interactive element has meaningful label [A11Y]
- Labels describe purpose, not appearance ("Submit Order" not "Blue Button") [A11Y]
- Traits set correctly (button, link, header, image) [A11Y]
- Reading order matches logical content flow [A11Y]
- Decorative images hidden [A11Y]
- Headings marked for rotor navigation [A11Y]
- Modal views trap focus [A11Y]
- Critical flows tested with VoiceOver [A11Y]

**Visual**: Dynamic Type, contrast, color-only, Increase Contrast, Reduce Transparency, Bold Text.
**Motor**: Single input, Switch Control, no multi-finger requirements, logical focus order.
**Cognitive**: Clear language, predictable patterns, undo for destructive, one primary action per screen.

### 9. Privacy

- Permissions requested in context, not at launch [CRITICAL]
- Purpose strings specific with user benefit [CRITICAL]
- App functions if permissions denied
- Minimum permissions requested
- Account deletion accessible in-app [CRITICAL]
- Sign in with Apple offered if third-party sign-in available [CRITICAL]

### 10. Gestures

- Edge swipe left = back [CRITICAL — never override]
- Swipe down on sheet = dismiss
- Pull down on list = refresh
- Long press = context menu or preview
- System gestures (home, notification center) never overridden [CRITICAL]

### 11. Widgets and Extensions

**Widgets**: glanceable, tap deep-links to content, multiple sizes, accented rendering (iOS 18+).
**Live Activities**: explicit user action to initiate, glanceable, designed for both Dynamic Island states.
**App Clips**: linear focused UI, value before account creation, minimum form fields.

### 12. Settings

- System permissions → System Settings (not in-app)
- Appearance/behavior preferences → in-app settings
- Rule: looks/behaves differently → in-app. System permissions/privacy → System Settings.

### 13. Platform-Specific Conventions

**iOS**: Tab bar 3-5, large titles collapse on scroll, safe areas, pull-to-refresh, Liquid Glass (iOS 26+).
**iPadOS**: Multi-column, sidebar, keyboard shortcuts, pointer hover, multitasking, drag-and-drop, Pencil.
**macOS**: Menu bar (all functionality), Cmd shortcuts, multiple windows, resize, right-click, Settings in app menu.
**watchOS**: Glanceable (<5 sec task), minimal text, Digital Crown, complications, Always-On, haptics.
**tvOS**: Focus-based navigation, text readable at 3m, directional input only, high-res images, Top Shelf.
**visionOS**: 60x60pt targets, eye tracking + indirect pinch, start in window, ornaments for toolbars.

## Anti-Pattern Red Flags

Any of these present = design fails Apple UX compliance:

| Anti-Pattern | Why |
|-------------|-----|
| Hamburger menu as primary navigation on iOS | Poor discoverability, violates convention |
| Custom back gesture overriding edge-swipe | Conflicts with system gesture |
| Touch targets below 44x44pt | 25%+ tap error rate |
| Hardcoded font sizes (no Dynamic Type) | Accessibility failure |
| Color-only information | Inaccessible to color-blind users |
| No Dark Mode support | Breaks visual consistency |
| Artificial splash screen delays | Apple prohibits |
| Account required before value | Barrier to entry (Guideline 5.1.1) |
| All permissions at launch | Aggressive, no context |
| Auto-playing audio/video | Disrupts user |
| Custom alert views | Inconsistent, accessibility issues |
| Placeholder/coming soon features | App Completeness (Guideline 2.1) |
| No account deletion | Required (Guideline 5.1.1) |
| Missing Restore Purchases for IAP | Required (Guideline 3.1.1) |
| System gestures overridden | Conflicts with OS |

## Scoring

| Weight | Items | Impact |
|--------|-------|--------|
| Critical (3x) | [CRITICAL] items | App Store rejection risk |
| Accessibility (2x) | [A11Y] items | Legal compliance, user impact |
| Platform (1.5x) | Platform-specific items | Expectations, quality perception |
| Standard (1x) | All other items | Best practice, polish |

Score = (passing × weight) / (total × weight) × 100

| Score | Rating |
|-------|--------|
| 95-100% | Excellent — App Store ready, Design Award potential |
| 85-94% | Good — App Store ready, minor polish needed |
| 70-84% | Needs Work — passes review but quality gaps |
| 50-69% | Poor — rejection risk |
| Below 50% | Failing — major redesign |

## Apple Design Philosophy (Context for Auditors)

**"Design is how it works"** — Technical decisions are design decisions. The best design is invisible.

**Progressive disclosure** — Show what users need when they need it. Simple defaults, advanced options available but not prominent. Max two disclosure levels.

**Constraints as design tool** — Limited customization prevents chaos. Opinionated defaults reduce decision fatigue. Platform conventions create ecosystem coherence.

**Hardware-software integration** — Dynamic Island integrates hardware into UI. Taptic Engine enables haptic vocabulary. Face ID/Touch ID enable seamless auth. ProMotion enables smoother animations.

**Design evolution**: Skeuomorphism (2007-2012) → Flat (2013-2024) → Liquid Glass (2025-present). Principles stayed constant; visual expression evolved.

## Design Award Traits

What Apple rewards:
1. Polished out-of-box experience
2. Accessibility as foundation (not retrofit)
3. Platform-native feel (deep use of platform tech)
4. Content-first interfaces (UI recedes)
5. Optimistic design language
6. Global perspective (localization, diverse representation)

**Delight vs gimmick**: Animation providing spatial orientation = delight. Gratuitous animation slowing task = gimmick.
