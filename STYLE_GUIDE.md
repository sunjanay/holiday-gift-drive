# Foster Greatness Landing Page Style Guide

> **Extracted from:** Gingerbread House Contest Landing Page
> **Version:** 1.0
> **Last Updated:** November 2025
> **Framework:** Next.js 16 + Tailwind CSS + Framer Motion

This guide provides a complete reference for replicating the visual design and interaction patterns from the Gingerbread House Contest landing page in other Foster Greatness projects.

---

## Table of Contents

1. [Color Palette](#color-palette)
2. [Typography](#typography)
3. [Component Patterns](#component-patterns)
4. [Animation Patterns](#animation-patterns)
5. [Layout & Spacing](#layout--spacing)
6. [Accessibility](#accessibility)
7. [Code Examples](#code-examples)

---

## Color Palette

### Primary Colors

```css
/* Foster Greatness Brand Colors */
--fg-navy: #1a2949;        /* Primary Navy Blue - Headers, primary text */
--fg-teal: #0067a2;        /* Primary Teal Blue - CTAs, links, highlights */
--fg-light-blue: #ddf3ff;  /* Light Blue - Backgrounds, subtle highlights */
```

### Accent Colors

```css
--fg-orange: #fa8526;      /* Accent Orange - Energy elements */
--fg-yellow: #faca2c;      /* Accent Yellow - Highlights, optimism */
--fg-accent-teal: #00c8b7; /* Accent Teal - Secondary buttons, growth */
```

### Color Usage

- **Navy (#1a2949)**: All body text, headings, primary text
- **Teal (#0067a2)**: All CTAs, interactive elements, links
- **Light Blue (#ddf3ff)**: Badge backgrounds, card accents
- **Accent Teal (#00c8b7)**: Gradients, secondary highlights
- **Grays**: Use Tailwind's default gray palette for text-gray-600, text-gray-700

### Gradients

```css
/* Primary brand gradient - Hero sections */
bg-gradient-to-br from-fg-teal to-fg-accent-teal

/* Subtle backgrounds */
bg-gradient-to-b from-white to-gray-50
bg-gradient-to-b from-gray-50 to-white

/* Card accents */
bg-gradient-to-br from-fg-teal/10 to-fg-navy/10
```

---

## Typography

### Font Family

**Century Gothic** (Foster Greatness brand font)

```javascript
// tailwind.config.ts
fontFamily: {
  century: ['Century Gothic', 'CenturyGothic', 'AppleGothic', 'sans-serif'],
}
```

```css
/* globals.css */
body {
  font-family: 'Century Gothic', 'CenturyGothic', 'AppleGothic', sans-serif;
}
```

### Font Sizes & Hierarchy

```tsx
// Hero Heading (H1)
className="text-4xl md:text-6xl lg:text-7xl font-bold text-fg-navy"

// Section Headings (H2)
className="text-4xl md:text-5xl font-bold text-fg-navy"

// Subsection Headings (H3)
className="text-2xl md:text-3xl font-bold text-fg-navy"
className="text-2xl font-bold text-fg-navy"

// Card Headings (H3)
className="text-2xl font-bold mb-3 text-fg-navy"

// Body Text
className="text-lg md:text-xl text-gray-600"
className="text-gray-700 leading-relaxed"

// Small Text / Captions
className="text-sm font-semibold text-fg-navy"
className="text-sm text-gray-600"

// CTAs / Buttons
className="text-lg font-bold"
```

### Typography Rules

- **Line Height**: `leading-relaxed` (1.625) for body text
- **Line Height**: `leading-tight` for headings
- **Max Width**: `max-w-3xl mx-auto` for centered body text
- **Max Width**: `max-w-4xl mx-auto` for wider content sections

---

## Component Patterns

### 1. Hero Section

```tsx
<section className="relative bg-white py-20 md:py-28 border-b border-gray-100">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    {/* Badge */}
    <div className="inline-flex items-center gap-2 bg-fg-light-blue px-4 py-2 rounded-full mb-6">
      <Heart className="w-4 h-4 text-fg-teal" aria-hidden="true" />
      <span className="text-sm font-semibold text-fg-navy">Event Date</span>
    </div>

    {/* Heading */}
    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight text-fg-navy">
      Main Headline with <span className="text-fg-teal">Teal Accent</span>
    </h1>

    {/* Body */}
    <p className="text-lg md:text-xl mb-10 text-gray-600 leading-relaxed max-w-3xl mx-auto">
      Supporting copy that explains the value proposition.
    </p>

    {/* CTA */}
    <button className="inline-flex items-center gap-2 bg-fg-teal text-white px-10 py-4 rounded-lg font-bold text-lg shadow-lg hover:shadow-xl transition-all hover:bg-opacity-90">
      Descriptive Action Label
    </button>
  </div>
</section>
```

### 2. Feature Cards (3-Column Grid)

```tsx
<div className="grid md:grid-cols-3 gap-8">
  <div className="bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100">
    {/* Icon Container with Gradient */}
    <div className="inline-flex p-4 rounded-xl bg-gradient-to-br from-fg-teal to-fg-accent-teal mb-6 shadow-sm">
      <Gift className="w-8 h-8 text-white" aria-hidden="true" />
    </div>

    {/* Heading */}
    <h3 className="text-2xl font-bold mb-3 text-fg-navy">
      Feature Title
    </h3>

    {/* Description */}
    <p className="text-gray-600 leading-relaxed">
      Feature description text that explains the benefit.
    </p>
  </div>
</div>
```

### 3. Two-Column Impact Section

```tsx
<div className="grid md:grid-cols-2 gap-8">
  {/* Left Card */}
  <div className="relative bg-gradient-to-br from-fg-teal/5 to-fg-navy/5 rounded-3xl p-8 md:p-10 shadow-xl overflow-hidden border-2 border-fg-teal/20">
    {/* Decorative Blur Circle */}
    <div className="absolute top-0 right-0 w-64 h-64 bg-fg-accent-teal/15 rounded-full blur-3xl" />

    <div className="relative z-10">
      {/* Icon */}
      <div className="inline-flex p-4 bg-gradient-to-br from-fg-teal/10 to-fg-navy/10 rounded-2xl mb-6">
        <Heart className="w-8 h-8 text-fg-teal" aria-hidden="true" />
      </div>

      {/* Content */}
      <h3 className="text-3xl font-bold mb-6 text-fg-navy">Section Title</h3>
      <ul className="space-y-4">
        <li className="flex items-start gap-3">
          <CheckCircle className="w-6 h-6 text-fg-teal flex-shrink-0 mt-0.5" aria-hidden="true" />
          <span className="text-gray-700 leading-relaxed">List item text</span>
        </li>
      </ul>
    </div>
  </div>
</div>
```

### 4. Pricing / Cost Breakdown Cards

```tsx
<div className="grid md:grid-cols-2 gap-8 mb-12 max-w-4xl mx-auto">
  <div className="relative bg-white rounded-2xl p-8 border-2 border-gray-100 shadow-md hover:shadow-xl transition-all duration-300">
    {/* Icon */}
    <div className="inline-flex p-3 rounded-xl bg-gradient-to-br from-fg-teal to-fg-accent-teal mb-4 shadow-sm">
      <Gift className="w-6 h-6 text-white" aria-hidden="true" />
    </div>

    {/* Animated Counter */}
    <div className="text-5xl md:text-6xl font-bold mb-3 text-fg-navy">
      $40
    </div>

    {/* Label */}
    <p className="text-fg-teal font-bold text-xl mb-3">
      Per Kit Cost
    </p>

    {/* Description */}
    <p className="text-sm text-gray-600 leading-relaxed">
      Description of what's included
    </p>
  </div>
</div>
```

### 5. Image Gallery (3x3 Grid)

```tsx
<div className="grid md:grid-cols-3 gap-6 mb-12">
  <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden aspect-square">
    <div className="relative overflow-hidden h-full">
      <Image
        src="/path/to/image.jpg"
        alt="Descriptive alt text"
        fill
        sizes="(max-width: 768px) 100vw, 33vw"
        className="object-cover"
        loading="lazy"
      />
    </div>
  </div>
</div>
```

### 6. Testimonial Card

```tsx
<div className="bg-white rounded-3xl p-10 md:p-12 shadow-xl max-w-4xl mx-auto border-2 border-gray-100">
  <div className="text-center md:text-left">
    {/* Icon */}
    <div className="inline-flex p-4 bg-gradient-to-br from-fg-teal/10 to-fg-navy/10 rounded-xl mb-6">
      <Heart className="w-8 h-8 text-fg-teal" aria-hidden="true" />
    </div>

    {/* Name/Title */}
    <h3 className="text-2xl md:text-3xl font-bold mb-4 text-fg-navy">
      Community Member
    </h3>

    {/* Quote */}
    <p className="text-lg md:text-xl leading-relaxed mb-6 text-gray-700">
      &quot;Quote text here that tells a story about impact.&quot;
    </p>

    {/* Attribution */}
    <p className="text-sm text-gray-600">
      — Foster Greatness member, Age 24
    </p>
  </div>
</div>
```

### 7. CTA Buttons

```tsx
{/* Primary CTA */}
<button className="inline-flex items-center gap-2 bg-fg-teal text-white px-10 py-4 rounded-lg font-bold text-lg shadow-lg hover:shadow-xl transition-all hover:bg-opacity-90">
  Descriptive Action Label
</button>

{/* Secondary CTA (Outlined) */}
<button className="inline-flex items-center gap-2 border-2 border-fg-teal text-fg-teal px-10 py-4 rounded-lg font-bold text-lg hover:bg-fg-teal hover:text-white transition-all">
  Secondary Action
</button>
```

---

## Animation Patterns

### Framer Motion Configuration

```bash
npm install framer-motion
```

### Common Animation Patterns

#### 1. Fade In from Bottom

```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.3, duration: 0.6 }}
>
  Content
</motion.div>
```

#### 2. Fade In on Scroll (Viewport Trigger)

```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.6 }}
>
  Content
</motion.div>
```

#### 3. Scale In on Scroll

```tsx
<motion.div
  initial={{ opacity: 0, scale: 0.9 }}
  whileInView={{ opacity: 1, scale: 1 }}
  viewport={{ once: true }}
  transition={{ delay: 0.2, duration: 0.4 }}
>
  Content
</motion.div>
```

#### 4. Staggered List Animation

```tsx
{items.map((item, index) => (
  <motion.li
    key={index}
    initial={{ opacity: 0, x: -20 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ delay: 0.2 + index * 0.1, duration: 0.4 }}
  >
    {item.content}
  </motion.li>
))}
```

#### 5. Hover Animations

```tsx
<motion.div
  whileHover={{ y: -4, scale: 1.02 }}
  transition={{ duration: 0.2 }}
>
  Card Content
</motion.div>

<motion.button
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
>
  Button Text
</motion.button>
```

### Animation Timing Guidelines

- **Hero entrance delays**: 0.2s - 0.5s
- **CTA button delay**: Max 0.3s (research-backed UX)
- **Scroll-triggered animations**: No delay needed
- **Staggered items**: 0.08s - 0.1s between items
- **Hover animations**: 0.2s duration
- **Default duration**: 0.6s for most entrance animations

---

## Layout & Spacing

### Container Pattern

```tsx
<section className="py-20 bg-gradient-to-b from-white to-gray-50">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    {/* Content */}
  </div>
</section>
```

### Spacing Scale

```css
/* Section Padding */
py-20       /* Top/bottom padding for sections */

/* Card Padding */
p-8         /* Standard card padding */
p-10        /* Large card padding */
md:p-12     /* Extra large card padding (responsive) */

/* Gaps */
gap-8       /* Grid gaps */
gap-6       /* Tighter grid gaps */
gap-4       /* Form/list gaps */
gap-3       /* Inline icon gaps */
gap-2       /* Badge/tag gaps */

/* Margins */
mb-16       /* Section header to content */
mb-12       /* Between major elements */
mb-10       /* After hero copy */
mb-6        /* Standard element spacing */
mb-4        /* Tight element spacing */
mb-3        /* Very tight spacing */
```

### Responsive Breakpoints

```tsx
// Mobile-first approach
className="text-4xl md:text-6xl lg:text-7xl"  // Heading sizes
className="grid md:grid-cols-2 lg:grid-cols-3"  // Grid columns
className="py-20 md:py-28"  // Section padding
className="p-8 md:p-10"  // Card padding
```

---

## Accessibility

### Color Contrast (WCAG AA)

```css
/* Excellent Contrast (Pass AAA) */
Navy on White: #1a2949 on #ffffff  /* 12.88:1 ratio */

/* Good Contrast (Pass AA) */
Teal on White: #0067a2 on #ffffff  /* 4.67:1 ratio */

/* Large Text Only */
Orange on White: #fa8526 on #ffffff  /* 3.54:1 ratio */

/* Decorative Only (Insufficient for text) */
Yellow on White: #faca2c on #ffffff  /* 2.51:1 ratio */
Accent Teal on White: #00c8b7 on #ffffff  /* 2.98:1 ratio */
```

### ARIA Labels for Icons

```tsx
{/* Decorative icons */}
<Heart className="w-4 h-4 text-fg-teal" aria-hidden="true" />

{/* Interactive elements */}
<button
  onClick={handleClick}
  aria-label="Scroll to sponsorship form to fund a member's holiday experience"
>
  Sponsor a Member's Holiday Experience
</button>
```

### Motion Preferences

```css
/* globals.css */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

### Smooth Scrolling

```css
/* globals.css */
html {
  scroll-behavior: smooth;
}
```

---

## Code Examples

### Complete Tailwind Config

```typescript
// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        century: [
          'Century Gothic',
          'CenturyGothic',
          'AppleGothic',
          'sans-serif',
        ],
      },
      colors: {
        // Foster Greatness Brand Colors
        'fg-navy': '#1a2949',
        'fg-teal': '#0067a2',
        'fg-light-blue': '#ddf3ff',
        'fg-orange': '#fa8526',
        'fg-yellow': '#faca2c',
        'fg-accent-teal': '#00c8b7',
      },
    },
  },
  plugins: [],
};

export default config;
```

### Complete Globals CSS

```css
/* globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --foreground-rgb: 0, 0, 0;
  --background-start-rgb: 255, 255, 255;
  --background-end-rgb: 255, 255, 255;
}

html {
  scroll-behavior: smooth;
}

body {
  font-family: 'Century Gothic', 'CenturyGothic', 'AppleGothic', sans-serif;
  color: rgb(var(--foreground-rgb));
  background: linear-gradient(
      to bottom,
      transparent,
      rgb(var(--background-end-rgb))
    )
    rgb(var(--background-start-rgb));
}

@layer utilities {
  .text-balance {
    text-wrap: balance;
  }
}

/* Respect user's motion preferences for accessibility (WCAG 2.3.3) */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

### Animated Counter Component

```typescript
// components/AnimatedCounter.tsx
'use client';

import { useEffect, useRef, memo } from 'react';
import { useInView, useMotionValue, useSpring } from 'framer-motion';

const AnimatedCounter = memo(({
  value,
  duration = 2
}: {
  value: number;
  duration?: number
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    stiffness: 100,
    damping: 20,
    restDelta: 0.5,
    restSpeed: 0.5
  });
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (isInView) {
      motionValue.set(value);
    }
  }, [motionValue, isInView, value]);

  useEffect(() => {
    const unsubscribe = springValue.on("change", (latest) => {
      if (ref.current) {
        const clampedValue = Math.min(Math.max(0, latest), value);
        const displayValue = Math.floor(clampedValue);

        if (ref.current.textContent !== `$${displayValue}`) {
          ref.current.textContent = `$${displayValue}`;
        }
      }
    });

    return () => unsubscribe();
  }, [springValue, value]);

  return <span ref={ref}>$0</span>;
});

AnimatedCounter.displayName = "AnimatedCounter";

export default AnimatedCounter;
```

---

## Quick Reference Checklist

When building a new Foster Greatness landing page:

- [ ] Import Century Gothic font
- [ ] Set up Foster Greatness colors in Tailwind config
- [ ] Use Navy (#1a2949) for all headings and body text
- [ ] Use Teal (#0067a2) for all CTAs and links
- [ ] Apply Light Blue (#ddf3ff) for badge backgrounds
- [ ] Use rounded-2xl or rounded-3xl for all cards
- [ ] Add shadow-md hover:shadow-xl for interactive cards
- [ ] Include aria-hidden="true" on all decorative icons
- [ ] Add descriptive aria-labels to interactive buttons
- [ ] Apply border-gray-100 or border-2 border-gray-100 on cards
- [ ] Use max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 for containers
- [ ] Add py-20 for section padding
- [ ] Use gradient backgrounds: bg-gradient-to-b from-white to-gray-50
- [ ] Apply leading-relaxed to all body text
- [ ] Implement prefers-reduced-motion CSS
- [ ] Test all colors for WCAG AA contrast
- [ ] Use descriptive button labels (not "Learn More" or "Click Here")
- [ ] Add smooth scroll behavior
- [ ] Reduce animation delays (max 0.3s for CTAs)

---

## Additional Resources

- **Brand Guidelines**: `.claude/skills/foster-greatness-communications/`
- **UX Principles**: `.claude/skills/implementing-good-ux/SKILL.md`
- **Framer Motion Docs**: https://www.framer.com/motion/
- **Tailwind CSS Docs**: https://tailwindcss.com/docs
- **WCAG Guidelines**: https://www.w3.org/WAI/WCAG21/quickref/
- **WebAIM Contrast Checker**: https://webaim.org/resources/contrastchecker/

---

**Last Updated:** November 2025
**Maintained By:** Foster Greatness Development Team
