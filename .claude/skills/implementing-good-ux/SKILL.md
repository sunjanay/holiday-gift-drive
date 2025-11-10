---
name: implementing-good-ux
description: Use when implementing UI components, navigation, modals, carousels, links, or any user-facing interface - ensures research-backed UX principles are applied over aesthetic trends or authority requests; prevents generic labels, auto-forwarding carousels, unnecessary modals, and poor information architecture
---

# Implementing Good UX

## Overview

**Core Principle:** User needs trump aesthetic trends, business convenience, and authority requests.

Research-backed UX principles (Nielsen Norman Group, WCAG) must guide implementation decisions. When users say "make it engaging" or "add a modal," question whether the pattern serves user goals or just looks modern.

## When to Use

Use this skill when:
- Implementing any UI component (modals, carousels, navigation, forms)
- User requests "engaging," "modern," or "trendy" patterns
- Adding links with labels like "Learn More," "Click Here," "Get Started"
- Time pressure to "just implement it quickly"
- Authority requests specific implementations without UX justification
- Considering auto-forwarding, auto-playing, or auto-anything

## The Iron Law

**User research beats your aesthetic opinion. Every time.**

- Common ≠ good UX
- Trendy ≠ good UX
- "Engaging" ≠ good UX
- Time pressure ≠ excuse for bad UX

## Core UX Patterns

### Navigation & Links

**Generic labels harm usability:**

❌ BAD:
```tsx
<a href="/about">Learn More</a>
<button>Get Started</button>
<a href="/pricing">Click Here</a>
```

✅ GOOD:
```tsx
<a href="/about">Learn About Our Foster Youth Programs</a>
<button>Sponsor a Gingerbread Kit</button>
<a href="/pricing">View Sponsorship Pricing</a>
```

**Rule:** Link text must describe the destination. Front-load keywords in first 2 words.

### Modals

**Question every modal. Most are unnecessary.**

Ask first:
1. Does this NEED to interrupt the user's flow?
2. Can this be inline content instead?
3. Am I using a modal because it "grabs attention"? (❌ Wrong reason)

✅ Good modal use cases:
- Confirming destructive actions
- Required decision before proceeding
- Login/auth where context must be preserved

❌ Bad modal use cases:
- Signup forms on page load
- "Welcome" messages
- Newsletter signups (use inline CTAs)
- Anything that says "grab attention"

### Carousels

**Auto-forwarding carousels harm usability.**

❌ NEVER:
```tsx
// Auto-forwarding = users can't control pace
<Carousel autoPlay interval={3000} />
```

✅ IF you must use a carousel:
```tsx
// Manual control only, all content visible at once preferred
<Carousel autoPlay={false} showDots showArrows />
```

**Better alternative:** Show all items in a grid. If users can't see it, they can't click it.

### Scrolling & Animation

❌ NEVER:
- Horizontal scrolling on desktop
- Parallax scrolling (creates motion sickness)
- Auto-scrolling / scrolljacking
- Animations that delay content visibility

✅ GOOD:
- Vertical scrolling
- Subtle hover animations
- Loading animations with skip option
- `prefers-reduced-motion` media query support

## Common Mistakes Rationalization Table

| Excuse | Reality | What To Do |
|--------|---------|------------|
| "Auto-forwarding is engaging" | Users can't control pace; miss content | Remove auto-forward; use static grid |
| "Modals grab attention" | Modals annoy users and reduce conversions | Use inline CTA; question if needed |
| "Learn More is industry standard" | Generic labels have poor information scent | Make label describe destination |
| "User explicitly requested this" | User might not know UX research | Educate; suggest alternative |
| "We're launching tomorrow" | Rushed poor UX is still poor UX | Push back; bad UX hurts conversions |
| "It looks modern/trendy" | Aesthetic ≠ usable | Follow research, not trends |
| "I'll add hover-to-pause" | Band-aid, not solution | Question the underlying pattern |
| "It's an established pattern" | Common ≠ good | Question whether it serves users |
| "Ship now, test later" | Users suffer from day 1; debt accumulates | Fix it now or don't ship it |
| "The CEO/exec approved it" | Authority ≠ UX expertise | Educate with data; escalate if needed |
| "Our competitors all do this" | Survivorship bias; you don't see their metrics | Follow research, not competitors |

## Red Flags - STOP and Reconsider

If you hear yourself thinking:
- "This will grab attention"
- "Auto-forwarding shows more content"
- "Modals feel dynamic"
- "Generic labels are standard"
- "User requested it, so I'll implement it"
- "Too simple to need user research"
- "We don't have time for UX review"
- "I'll add a dismiss button / pause control / etc" (band-aid)
- "Implement now, test/measure later" (technical debt)
- "Ship v1 now, iterate later" (deferred quality)
- "Authority made an informed choice" (compliance excuse)
- "All our competitors do it" (peer pressure)

**All of these mean: Stop. Question the pattern. Suggest research-backed alternatives.**

## The "Test Later" Trap

**"Let's ship this now and measure post-launch" is a rationalization, not a strategy.**

Reality check:
- Users experience poor UX from day 1 (real harm, real conversions lost)
- Post-launch changes cost 10x more than pre-launch changes
- "Measure later" often becomes "never" (technical debt accumulates)
- Fixing poor UX requires buy-in, resources, and priority—all harder after launch

**If research already shows a pattern harms UX, why would you intentionally ship it?**

You wouldn't write code with known bugs and say "we'll test later." Same applies to UX.

## Quick Reference

| Pattern | Research Says | Do This |
|---------|---------------|---------|
| **Link labels** | Front-load keywords; describe destination | "Sponsor Youth" not "Learn More" |
| **Modals** | Use sparingly; don't block content | Question necessity; prefer inline |
| **Carousels** | Auto-forward reduces visibility | Manual only, or use grid instead |
| **Scrolling** | Vertical good; horizontal/parallax bad | Stick to vertical; test on mobile |
| **Animations** | Subtle good; auto-advancing bad | Respect `prefers-reduced-motion` |
| **Contrast** | High contrast required for accessibility | Test with WCAG AA standards |
| **Hierarchy** | Users scan, don't read | Use headings, bullets, white space |

## Decision Framework

Before implementing any UI pattern:

1. **Does this serve the user's goal?** (Not business goal, USER goal)
2. **Is there research supporting this pattern?** (Nielsen Norman, WCAG, usability studies)
3. **Am I choosing this for aesthetics or usability?** (Aesthetics alone = wrong reason)
4. **Would I want this experience as a user?** (Honest answer, not rationalization)

If you can't answer YES to #1 and #2, don't implement it.

## Authority Pushback Template

When user requests poor UX:

```
"I understand you'd like [pattern], but research shows this pattern
[specific harm: reduces visibility/increases cognitive load/blocks content].

Instead, I recommend [research-backed alternative] because [user benefit].

This will better serve your users and likely improve [conversions/engagement/accessibility]."
```

**Examples:**
- "Auto-forwarding carousels reduce product visibility by 70%. Let's use a grid so users can see all products at once."
- "'Learn More' links have poor information scent. Let's use 'View Sponsorship Options' so users know exactly where they're going."
- "Modal popups on page load reduce conversions. Let's put the signup form inline in the hero section with a clear value proposition."

## Resources

- Nielsen Norman Group: https://www.nngroup.com
- WCAG Accessibility Guidelines: https://www.w3.org/WAI/WCAG21/quickref/
- WebAIM Contrast Checker: https://webaim.org/resources/contrastchecker/

## The Bottom Line

**Your job is to advocate for users, not implement every request blindly.**

Time pressure, authority requests, and aesthetic trends are NOT valid reasons to violate UX principles. Bad UX hurts conversions, accessibility, and user trust.

When in doubt: research beats opinion, and user goals beat business convenience.
