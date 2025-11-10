# Holiday Gift Drive: Interactive Christmas Tree Design

**Date:** November 10, 2025
**Campaign:** Foster Greatness Holiday Gift Drive 2025
**Status:** Design Approved

## Overview

Create an interactive Holiday Gift Drive campaign page for 10-15 Foster Greatness community members. Each member selects an Amazon gift they'd like to receive. The page features a magical interactive Christmas tree where ornaments represent gift wishes, plus a practical browse-all section below.

## Goals

1. Create an engaging, holiday-themed experience that encourages gift sponsorship
2. Balance whimsical interaction (tree) with practical accessibility (grid)
3. Maintain Foster Greatness brand consistency and accessibility standards
4. Enable easy Amazon Wishlist integration for gift fulfillment

## Campaign Details

- **Participants:** 10-15 community members
- **Gift Source:** Amazon Wishlist items
- **Gift Fulfillment:** Direct Amazon purchase by sponsors
- **Privacy Level:** Show member names and brief (2-3 sentence) stories
- **Price Transparency:** Display gift prices on ornaments and cards

## Technical Architecture

### Route Structure

**New Route:** `/app/gift-drive/page.tsx`

This is a new campaign living alongside the existing Gingerbread House Contest (`/app/page.tsx`). Both campaigns remain active.

### File Structure

```
app/gift-drive/
  ├── page.tsx                    # Main gift drive page
  ├── components/
  │   ├── InteractiveTree.tsx     # SVG tree + ornament positioning
  │   ├── Ornament.tsx            # Individual ornament component
  │   ├── GiftModal.tsx           # Modal for expanded gift details
  │   ├── GiftCard.tsx            # Card for browse grid section
  │   └── BrowseGifts.tsx         # Grid section wrapper
  ├── data/
  │   └── giftRecipients.ts       # Gift recipient data
  └── assets/
      └── christmas-tree.svg      # Tree illustration (or inline SVG)
```

### Data Model

```typescript
export interface GiftRecipient {
  id: string;                    // Unique identifier
  name: string;                  // Member's name (shown publicly)
  age?: number;                  // Optional age
  story: string;                 // 2-3 sentences about the member
  giftTitle: string;             // Short gift name (e.g., "Makeup set")
  giftDescription: string;       // Longer gift description
  giftPrice: number;             // Price in USD
  amazonWishlistUrl: string;     // Amazon wishlist URL (placeholder initially)
  ornamentColor: 'red' | 'gold' | 'silver' | 'green' | 'blue'; // Visual variety
}
```

**Sample data structure:**
- Array of 10-15 recipients
- Each with complete gift details
- Amazon URLs are placeholders until real wishlist is created

## Page Structure

### 1. Hero Section

Reuse existing Foster Greatness hero pattern:

- **Event Badge:** "Holiday Gift Drive 2025" (animated, fg-light-blue background)
- **Headline:** "Help Make the Holidays Special for Our Community"
- **Subheadline:** Brief explanation of the gift drive concept
- **Visual Context:** Sets up the interactive tree experience below

### 2. Interactive Tree Section

**Visual Design:**
- Large SVG Christmas tree illustration (600-800px tall on desktop)
- Stylized, professional evergreen tree design
- Tree centered on page, takes visual prominence
- Ornaments positioned absolutely over tree branches

**Ornament Design:**

Each ornament is a circular/bulb-shaped component displaying:
- Background color (varies by `ornamentColor` for visual interest)
- Member name at top
- Gift short description in center (e.g., "A makeup set for Ashley")
- Price tag at bottom ($XX)

**Interactions:**

| Event | Behavior |
|-------|----------|
| Page Load | Subtle sway animation on each ornament (staggered delays) |
| Hover | Scale up 1.0 → 1.1, subtle glow effect |
| Click | Open modal with full gift details |
| Keyboard | Tab through ornaments, Enter/Space to activate |

**Animation:**
- Framer Motion for all animations
- Spring physics matching existing site feel
- Respect `prefers-reduced-motion`

**Technical Implementation:**
- Static SVG tree (background)
- React `<Ornament>` components with absolute positioning
- Each ornament has hand-tuned `top`/`left` coordinates
- Responsive: tree scales proportionally, ornaments maintain relative positions

### 3. Gift Detail Modal

**Trigger:** Click any ornament

**Modal Layout:**
- Blurred backdrop overlay (existing pattern)
- Centered content card (max-width: 600px)
- Foster Greatness white card with shadow

**Content Structure:**
1. **Header:** Member name + age (if provided)
2. **Story:** 2-3 sentence member story (empathetic, personal)
3. **Gift Details:** Title + full description
4. **Price:** Large, clear price display (fg-teal accent)
5. **Primary CTA:** "Buy This Gift on Amazon" (full-width button, fg-teal)
6. **Secondary Action:** "View All Gifts" (closes modal, scrolls to browse section)
7. **Close Button:** X in top-right corner

**Accessibility:**
- Focus trap (can't tab outside modal)
- ESC key closes modal
- Click outside closes modal
- Focus returns to clicked ornament on close
- ARIA labels: `role="dialog"`, `aria-labelledby`, `aria-describedby`

**Animation:**
- Fade + scale in (Framer Motion)
- Spring physics: `{ type: "spring", damping: 25, stiffness: 300 }`

### 4. Browse All Gifts Section

**Purpose:** Provide efficient, accessible alternative to tree exploration

**Section Header:**
- Heading: "Browse All Gifts"
- Subtext: "Prefer to see everything at once? Here's the full list of gift wishes."

**Grid Layout:**
- Desktop (lg): 3 columns
- Tablet (md): 2 columns
- Mobile: 1 column
- Gap: 24px

**Gift Card Component:**

Each card displays:
1. **Member Name:** Bold, fg-navy
2. **Story Snippet:** 2 lines max with ellipsis
3. **Gift Title + Description**
4. **Price Badge:** Rounded, fg-teal background
5. **CTA Button:** "Buy on Amazon" (full-width, fg-teal)

**Card Styling:**
- White background
- Subtle shadow
- Hover: lift effect (increased shadow, slight scale)
- Border radius: 12px (Foster Greatness style)

**Interaction:**
- Click anywhere on card OR button → Amazon wishlist
- Keyboard: Tab to button, Enter activates

### 5. Footer/Thank You Section

**Content:**
- Gratitude message to sponsors
- Contact information for questions
- Link back to main Foster Greatness site
- Social sharing encouragement

## Responsive Design Strategy

### Desktop (1024px+)
- Tree at 70% viewport height, centered
- Ornaments well-spaced for precise mouse clicks
- Browse grid: 3 columns
- Modal: 600px max-width

### Tablet (768px - 1023px)
- Tree scales to 60% viewport height
- Ornaments maintain proportions
- Browse grid: 2 columns
- Modal: 90% viewport width

### Mobile (< 768px)
- Tree: 40-50% viewport height (still prominent)
- Ornaments: minimum 44px touch target size
- Browse grid: 1 column (becomes primary interaction)
- Modal: Full-screen on small devices
- Consider hint: "Tap any ornament to learn more"

## Accessibility Requirements

### WCAG AA Compliance

| Requirement | Implementation |
|-------------|----------------|
| **Keyboard Navigation** | All ornaments and cards tabbable, Enter/Space activates |
| **Focus Indicators** | Visible focus states on all interactive elements |
| **ARIA Labels** | Ornaments: "Gift wish for [Name]: [Gift title], $[Price]" |
| **Modal Focus Trap** | Focus contained within modal when open |
| **Color Contrast** | All text meets 4.5:1 ratio minimum |
| **Alt Text** | Tree SVG has descriptive alt |
| **Screen Reader** | Announce modal open/close states |
| **Reduced Motion** | Disable sway animations if `prefers-reduced-motion: reduce` |

### Touch Targets
- Minimum 44x44px for all tappable elements
- Adequate spacing between ornaments on mobile

## Foster Greatness Brand Integration

### Colors (from tailwind.config.ts)
- **Primary Text:** fg-navy (#1a2949)
- **Interactive Elements:** fg-teal (#0067a2)
- **Accents:** fg-orange (#fa8526), fg-yellow (#faca2c)
- **Backgrounds:** fg-light-blue (#ddf3ff)
- **Ornament Colors:** Use warm holiday palette (reds, golds, greens)

### Typography
- Font: Century Gothic (Foster Greatness brand font)
- Heading hierarchy: text-4xl, text-3xl, text-2xl
- Body: text-lg with 1.625 line-height

### Component Patterns
- Reuse existing card shadows and border radius
- Maintain button styles from current site
- Use existing Framer Motion spring configurations
- Follow established spacing scale

## Animation Strategy

### Ornament Sway (Page Load)
```typescript
// Subtle pendulum motion
{
  rotate: [-2, 2, -2],
  transition: {
    duration: 3,
    repeat: Infinity,
    ease: "easeInOut",
    delay: Math.random() * 2 // Stagger for organic feel
  }
}
```

### Ornament Hover
```typescript
{
  scale: 1.1,
  filter: "drop-shadow(0 0 8px rgba(0, 103, 162, 0.4))",
  transition: { type: "spring", stiffness: 400, damping: 15 }
}
```

### Modal Enter/Exit
```typescript
// Enter
{
  opacity: [0, 1],
  scale: [0.95, 1],
  transition: { type: "spring", damping: 25, stiffness: 300 }
}

// Exit
{
  opacity: [1, 0],
  scale: [1, 0.95],
  transition: { duration: 0.2 }
}
```

### Respect Reduced Motion
```typescript
const prefersReducedMotion = useReducedMotion();

// Disable sway and scale animations if true
// Use simple opacity transitions only
```

## Amazon Wishlist Integration

### Current State
- URLs are placeholders in data file: `"https://amazon.com/wishlist/placeholder"`
- Data structure ready for real URLs

### Implementation Notes
- Each `GiftRecipient.amazonWishlistUrl` should link to specific wishlist item
- Amazon Wishlist API is limited; manual URL collection likely required
- Button opens Amazon in new tab: `target="_blank"` `rel="noopener noreferrer"`
- Consider UTM parameters for tracking: `?tag=fostergreatn-20`

### Future Enhancement Ideas
- Track which gifts have been purchased (requires backend/DB)
- "Already purchased" state styling
- Purchase confirmation thank-you message

## Content Guidelines

### Member Stories
- **Length:** 2-3 sentences maximum
- **Tone:** Warm, personal, empowering (Foster Greatness voice)
- **Focus:** Why this gift matters to them, not trauma narrative
- **Privacy:** First names only if preferred by member
- **Example:** "Ashley is pursuing a career in cosmetology and loves experimenting with new makeup techniques. This makeup set will help her practice her craft and build confidence in her artistry."

### Gift Descriptions
- **Ornament (Short):** "A makeup set for Ashley"
- **Card/Modal (Full):** "Professional makeup brush set with 12 brushes and carrying case"
- Clear, specific descriptions that help sponsors understand the gift

## Success Metrics

### User Experience
- Time spent on page (engagement with tree)
- Modal open rate (ornament clicks)
- Scroll depth (reaching browse section)
- Mobile vs desktop interaction patterns

### Campaign Performance
- Number of gifts purchased
- Time to full gift fulfillment
- Return sponsor rate (for future campaigns)

## Implementation Phases

### Phase 1: Core Structure
1. Create route and page file
2. Build hero section
3. Set up data model with sample data

### Phase 2: Interactive Tree
1. Create/source SVG tree illustration
2. Build Ornament component
3. Position ornaments on tree
4. Implement hover and sway animations

### Phase 3: Modal System
1. Build GiftModal component
2. Wire up click handlers
3. Implement accessibility features
4. Test keyboard navigation

### Phase 4: Browse Section
1. Build GiftCard component
2. Create responsive grid layout
3. Implement hover effects
4. Wire up Amazon links

### Phase 5: Polish & Testing
1. Responsive testing on all breakpoints
2. Accessibility audit (WCAG AA)
3. Animation performance optimization
4. Cross-browser testing
5. Load real recipient data

## Open Questions

1. **Tree Illustration:** Should we create a custom SVG tree, use a stock illustration, or commission artwork?
2. **Gift Images:** Should the modal include product images from Amazon, or keep it text-only?
3. **Navigation:** Add link to gift drive from main page? Update header navigation?
4. **Social Sharing:** Include "Share this gift" buttons in modal?
5. **Real-time Updates:** How do we mark gifts as purchased? Manual update or integrate with Amazon?

## Next Steps

1. Set up git worktree for isolated development
2. Create detailed implementation plan
3. Source or create Christmas tree SVG
4. Gather real recipient data (names, stories, gift details)
5. Create Amazon Wishlist and collect URLs
6. Begin implementation Phase 1
