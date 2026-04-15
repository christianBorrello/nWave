# Apple UX Audit Checklist

**Companion to**: apple-ux-knowledge-base.md
**Date**: 2026-04-15 | **Purpose**: Actionable scoring rubric for auditing UX quality against Apple Human Interface Guidelines

This checklist is organized by category. Each item is specific and auditable against journey artifacts (wireframes, prototypes, user stories, acceptance criteria). Items marked [CRITICAL] will likely cause App Store rejection if violated. Items marked [ACCESSIBILITY] are accessibility requirements. Items marked [PLATFORM] are platform-specific.

---

## 1. Core Design Principles

### Clarity
- [ ] All text is legible at default size (minimum 11pt for informational text)
- [ ] Icons convey meaning without requiring labels where feasible
- [ ] Information hierarchy is visually clear (most important content is most prominent)
- [ ] No decorative elements compete with functional content for attention
- [ ] Screen purpose is immediately understandable without instruction

### Deference
- [ ] Content occupies the majority of screen real estate
- [ ] Navigation and controls do not dominate the visual hierarchy
- [ ] System materials (blur, translucency) used appropriately for layering
- [ ] UI chrome recedes when scrolling content

### Depth
- [ ] Modal content appears visually above parent content (sheet, popover)
- [ ] Transitions convey spatial relationships (where content comes from/goes)
- [ ] Related elements are visually grouped at the same depth level
- [ ] Users maintain context awareness when overlays appear

### Consistency
- [ ] Standard system components used where applicable (not custom replacements)
- [ ] Navigation follows platform conventions (tab bar on iOS, sidebar on iPad, menu bar on macOS)
- [ ] System-standard terminology used (Delete not Remove, Settings not Preferences on iOS)
- [ ] Gestures match system conventions (edge-swipe = back, pull-down = refresh)

---

## 2. Typography

- [ ] All text uses Dynamic Type text styles (Large Title, Body, Caption, etc.)
- [ ] No hardcoded font sizes anywhere in the design [CRITICAL]
- [ ] San Francisco (or New York serif) used as system font
- [ ] Layout reflows gracefully at all Dynamic Type sizes including accessibility XXL [ACCESSIBILITY]
- [ ] Text is never truncated at larger sizes -- wraps or scrolls instead [ACCESSIBILITY]
- [ ] Minimum readable text size is 11pt (Caption 2)
- [ ] Text hierarchy uses appropriate styles: Large Title > Title 1 > Headline > Body > Footnote > Caption
- [ ] Font weight variation used meaningfully (Semibold for emphasis, Regular for body)

---

## 3. Color

- [ ] Semantic label colors used for text (`.label`, `.secondaryLabel`, `.tertiaryLabel`, `.quaternaryLabel`)
- [ ] Semantic background colors used (`.systemBackground`, `.secondarySystemBackground`, `.systemGroupedBackground`)
- [ ] System tint colors used for interactive elements (`.systemBlue`, `.systemRed`, etc.)
- [ ] No hardcoded hex/RGB values for standard UI elements
- [ ] Custom colors have both light and dark variants in Asset Catalog
- [ ] Color contrast: 4.5:1 minimum for normal text [ACCESSIBILITY] [CRITICAL]
- [ ] Color contrast: 3:1 minimum for large text and non-text elements [ACCESSIBILITY]
- [ ] Information never conveyed by color alone (icons, labels, or patterns also used) [ACCESSIBILITY] [CRITICAL]
- [ ] App fully functional and readable in Dark Mode
- [ ] App tested with Increase Contrast enabled [ACCESSIBILITY]
- [ ] Destructive actions use `.systemRed` tint

---

## 4. Icons and SF Symbols

- [ ] SF Symbols used for system-concept icons (search, share, settings, compose, delete, etc.)
- [ ] Custom icons match SF Symbols in optical weight, detail level, and perspective
- [ ] Tab bar: filled icons for selected state, outlined for unselected
- [ ] All icons have VoiceOver accessibility labels [ACCESSIBILITY]
- [ ] App icon provides light, dark, and tinted variants (iOS 18+)
- [ ] No Apple-branded symbols used in custom/trademarked contexts
- [ ] App icon at 1024x1024 for App Store, plus all required sizes
- [ ] Icons are recognizable at their rendered size (not overly detailed)

---

## 5. Layout and Spacing

- [ ] All interactive content within safe areas (not obscured by notch, Dynamic Island, home indicator)
- [ ] Touch targets meet 44x44pt minimum (iOS, iPadOS, macOS) [CRITICAL]
- [ ] Touch targets meet 60x60pt minimum (visionOS) [PLATFORM]
- [ ] Spacing follows 8pt grid alignment
- [ ] Screen edge margins: 16pt on iPhone, 20pt on iPad
- [ ] Layout adapts to all size classes (compact/regular width and height)
- [ ] Landscape orientation functional (or explicitly locked with justification)
- [ ] Text readability margins applied on wide displays (iPad, large iPhones landscape)
- [ ] Content extends edge-to-edge for visual richness (backgrounds, images)
- [ ] No content cut off or overlapping at any supported screen size
- [ ] iPad layout uses multi-column design (not stretched iPhone layout) [PLATFORM]

---

## 6. Navigation

### Structure
- [ ] Primary navigation uses tab bar on iPhone (3-5 tabs) [CRITICAL for iOS]
- [ ] Primary navigation uses sidebar on iPad for regular-width layouts [PLATFORM]
- [ ] Tab bar items navigate to sections (never trigger actions or sheets)
- [ ] Selected tab does not change programmatically without user action
- [ ] Each tab retains its own navigation state independently
- [ ] No hamburger menu as primary navigation on iOS

### Hierarchy
- [ ] Hierarchical content uses Navigation Bar with back button
- [ ] Back button labeled with parent screen title (when space permits)
- [ ] System edge-swipe back gesture works throughout (never overridden) [CRITICAL]
- [ ] Disclosure indicators (chevrons) show drill-down capability
- [ ] Navigation path clear: users always know where they are and how to return

### Modals and Sheets
- [ ] Self-contained tasks use sheets (not full-screen push)
- [ ] Sheets dismissible via swipe-down or close button
- [ ] Modals with unsaved data confirm before discarding on cancel [CRITICAL]
- [ ] Full-screen modals reserved for immersive/complex tasks
- [ ] Alert controllers used for brief, critical information (not custom alert views)
- [ ] Alerts used sparingly (not for routine information)

---

## 7. Motion and Animation

- [ ] All animations serve a purpose (feedback, spatial orientation, status)
- [ ] Transitions show where content comes from and goes to
- [ ] Reduce Motion setting respected: slides replaced with crossfades [ACCESSIBILITY] [CRITICAL]
- [ ] No auto-playing decorative animations
- [ ] No motion sickness triggers (large zooms, spinning, excessive parallax)
- [ ] Loading states use appropriate feedback (progress indicator, skeleton screens)
- [ ] Interactive animations feel responsive to user input (not delayed)
- [ ] Spring animations used for gesture-driven interactions (natural feel)

---

## 8. Haptics and Feedback

- [ ] Success/error haptics used for task completion outcomes
- [ ] Selection haptics used for discrete value changes (pickers, toggles)
- [ ] Haptic feedback accompanies meaningful interactions (not decorative overuse)
- [ ] Sound, haptics, and visual feedback are coordinated (harmony principle)
- [ ] No excessive haptic usage (haptic fatigue)
- [ ] Graceful degradation on devices without Taptic Engine

---

## 9. Accessibility [ACCESSIBILITY]

### VoiceOver
- [ ] Every interactive element has a meaningful accessibility label
- [ ] Labels describe purpose, not appearance ("Submit Order" not "Blue Button")
- [ ] Accessibility traits set correctly (button, link, header, image)
- [ ] VoiceOver reading order matches logical content flow
- [ ] Decorative images marked as accessibility hidden
- [ ] Headings properly marked for VoiceOver rotor navigation
- [ ] Custom controls expose appropriate accessibility traits and actions
- [ ] Modal views trap VoiceOver focus (cannot escape to content behind)
- [ ] Complete critical user flows tested with VoiceOver enabled

### Visual Accessibility
- [ ] Dynamic Type supported at all sizes including accessibility XXL
- [ ] Color contrast meets WCAG AA (4.5:1 normal text, 3:1 large text)
- [ ] No color-only information conveyed
- [ ] Increase Contrast setting tested
- [ ] Reduce Transparency setting handled (custom translucency becomes opaque)
- [ ] Bold Text setting tested

### Motor Accessibility
- [ ] All functionality accessible via single input mechanism
- [ ] Switch Control navigation order is logical
- [ ] Essential functions do not require multi-finger gestures
- [ ] Focus order matches content flow for keyboard navigation
- [ ] Time-limited interactions avoided for essential tasks

### Cognitive Accessibility
- [ ] Clear, simple language throughout
- [ ] Predictable navigation patterns (no surprise behaviors)
- [ ] Undo available for destructive actions
- [ ] One primary action per screen (reduced cognitive load)

---

## 10. Privacy

- [ ] Permissions requested in context (at point of need, not at launch) [CRITICAL]
- [ ] Purpose strings are specific and explain benefit ("Your location is used to show nearby restaurants") [CRITICAL]
- [ ] App functions if permissions are denied (graceful degradation)
- [ ] Minimum permissions requested (camera not requested when only photo library needed)
- [ ] App Tracking Transparency prompt shown if tracking
- [ ] Privacy labels accurate in App Store Connect
- [ ] Account deletion accessible within the app [CRITICAL]
- [ ] Sign in with Apple offered alongside third-party sign-in options [CRITICAL]

---

## 11. Apple-Specific Patterns

### Gestures
- [ ] Edge swipe from left = back navigation (never overridden) [CRITICAL]
- [ ] Swipe down on sheet = dismiss
- [ ] Pull down on list = refresh content
- [ ] Long press = context menu or preview
- [ ] Pinch = zoom (where applicable)
- [ ] System gestures (home, notification center) never overridden [CRITICAL]

### Widgets
- [ ] Widget content is glanceable (useful without interaction)
- [ ] Tapping widget deep-links to relevant content in app
- [ ] Multiple sizes supported (small, medium, large where appropriate)
- [ ] Widget supports accented rendering (iOS 18+)
- [ ] Widget timeline updates are meaningful (not excessive)

### Live Activities
- [ ] Initiated by explicit user action (not automatic)
- [ ] Content is highly glanceable (essential info only)
- [ ] Both expanded and compact Dynamic Island states designed
- [ ] Lock Screen presentation is clear and minimal

### App Clips
- [ ] Linear, focused interface (no tab bars or complex navigation) [PLATFORM]
- [ ] Value provided before account creation
- [ ] Sign in with Apple offered if account required
- [ ] Minimum screens and form fields

### Settings
- [ ] System permissions in System Settings (not in-app)
- [ ] Appearance and behavior preferences in in-app settings
- [ ] In-app settings accessible from clear location

---

## 12. Platform-Specific Checks

### iOS
- [ ] Tab bar with 3-5 tabs for primary navigation
- [ ] Large titles that collapse on scroll
- [ ] Safe areas respected (notch, Dynamic Island, home indicator)
- [ ] Pull-to-refresh for list content
- [ ] Liquid Glass styling adopted (iOS 26+) or graceful fallback

### iPadOS [PLATFORM]
- [ ] Multi-column layout (not stretched iPhone layout)
- [ ] Sidebar navigation for regular-width displays
- [ ] Keyboard shortcuts for frequent actions
- [ ] Pointer/trackpad hover states
- [ ] Multitasking (Split View, Slide Over) functional
- [ ] Drag and drop supported where applicable
- [ ] Apple Pencil support where relevant

### macOS [PLATFORM]
- [ ] Menu bar exposes all app functionality
- [ ] Standard keyboard shortcuts (Cmd+C/V/Z/Q/W/N/S etc.)
- [ ] Multiple windows supported where appropriate
- [ ] Window resizing functional
- [ ] Right-click context menus available
- [ ] Settings (not Preferences) in app menu

### watchOS [PLATFORM]
- [ ] Primary task completable in under 5 seconds
- [ ] Glanceable interface (minimal text)
- [ ] Digital Crown scrolling supported
- [ ] Complications provided for watch face
- [ ] Always-On Display state useful and privacy-safe
- [ ] Haptic confirmations for user actions

### tvOS [PLATFORM]
- [ ] All text readable at 3-meter viewing distance
- [ ] Focus state provides clear visual feedback
- [ ] Navigation achievable with directional input only (no precision required)
- [ ] High-resolution images for large display
- [ ] Top Shelf content provided

### visionOS [PLATFORM]
- [ ] Interactive elements meet 60x60pt minimum
- [ ] App usable with eye tracking + indirect pinch gestures
- [ ] App starts in a window (not immediately immersive)
- [ ] Ornaments used for toolbars (not consuming window content area)
- [ ] Tab bar as vertical ornament on leading edge

---

## 13. Anti-Pattern Red Flags

If any of these are present, the design fails Apple UX compliance:

- [ ] Hamburger menu as primary navigation on iOS [FAIL]
- [ ] Custom back gesture overriding system edge-swipe [FAIL]
- [ ] Touch targets below 44x44pt [FAIL]
- [ ] Hardcoded font sizes (no Dynamic Type) [FAIL]
- [ ] Color-only information with no alternative indicators [FAIL]
- [ ] No Dark Mode support [FAIL]
- [ ] Artificial splash screen delays [FAIL]
- [ ] Account required before any value provided [FAIL]
- [ ] All permissions requested at launch [FAIL]
- [ ] Auto-playing audio/video without user action [FAIL]
- [ ] Custom alert views instead of UIAlertController [FAIL]
- [ ] Placeholder or "coming soon" features [FAIL]
- [ ] No account deletion option [FAIL]
- [ ] Missing Restore Purchases for IAP [FAIL]
- [ ] System gestures overridden [FAIL]

---

## Scoring Guide

For UX audit scoring, weight items as follows:

| Weight | Category | Impact |
|---|---|---|
| **Critical** (3x) | Items marked [CRITICAL] | App Store rejection risk |
| **Accessibility** (2x) | Items marked [ACCESSIBILITY] | Legal compliance, significant user impact |
| **Platform** (1.5x) | Items marked [PLATFORM] | Platform expectations, quality perception |
| **Standard** (1x) | All other items | Best practice, polish |

**Score Calculation**: (Passing items x weight) / (Total items x weight) x 100 = Compliance %

| Score | Rating | Interpretation |
|---|---|---|
| 95-100% | Excellent | App Store ready, potential Design Award candidate |
| 85-94% | Good | App Store ready with minor polish needed |
| 70-84% | Needs Work | Likely passes review but quality gaps visible |
| 50-69% | Poor | Significant risk of rejection or poor reviews |
| Below 50% | Failing | Major redesign needed |

---

**Sources**: See apple-ux-knowledge-base.md for full citations and evidence backing each checklist item.
