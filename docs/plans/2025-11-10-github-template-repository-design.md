# GitHub Template Repository Design

**Date:** November 10, 2025
**Project:** Foster Greatness Landing Page Template
**Goal:** Convert gingerbread-house-contest into a reusable GitHub template repository for future Foster Greatness campaigns

---

## Purpose

Create a GitHub template repository that allows quick creation of new Foster Greatness landing pages for future fundraisers, events, and campaigns. Each new project will be cloned from this template with one click, maintaining brand consistency while allowing layout flexibility.

## Requirements

- Preserve Foster Greatness branding and design system
- Provide reusable component patterns from STYLE_GUIDE.md
- Allow easy content swapping (text, images, pricing, dates)
- Maintain tech stack (Next.js 16, React 19, TypeScript, Tailwind CSS, Framer Motion)
- Support varied layouts across different campaigns
- Enable independent evolution of each campaign repo

## Design Decisions

### Approach: GitHub Template Repository

Selected over NPX create script and manual documentation because:
- One-click duplication via GitHub UI ("Use this template")
- Clean separation between campaigns (independent repos)
- Each project can evolve independently
- STYLE_GUIDE.md travels with every project
- Maximum flexibility for different layouts per campaign
- No maintenance burden of npm packages or CLI tools

### What Stays (Preserved As-Is)

**Tech Stack:**
- Next.js 16 with App Router
- React 19
- TypeScript
- Tailwind CSS
- Framer Motion
- All dependencies in package.json

**Design System:**
- STYLE_GUIDE.md (comprehensive component reference)
- Tailwind config with Foster Greatness colors
- globals.css with brand fonts and accessibility features
- All component patterns (hero, cards, gallery, impact, testimonials)
- Animation patterns and timing
- Accessibility implementations (ARIA labels, reduced motion, contrast)

**Component Structure:**
- StripeBuyButton component
- AnimatedCounter component
- All Framer Motion configurations
- Responsive breakpoints and layouts

### What Gets Genericized (Replaced with Placeholders)

**Content:**
- Campaign-specific text → Clearly marked placeholders like "[Campaign Name]", "[Campaign Description]"
- Gingerbread House event details → Template dates with comments
- Pricing/costs → Example numbers with `// CUSTOMIZE:` comments
- Impact stories → Generic placeholder testimonials

**Images:**
- Keep 1-2 example images as reference
- Add placeholder images or clear instructions for image requirements
- Document image dimensions and formats needed

**Configuration:**
- package.json name → "foster-greatness-landing-template"
- package.json description → Generic template description
- README.md → Template usage instructions

### New Documentation Files

#### 1. TEMPLATE_SETUP.md

Comprehensive setup guide containing:

**Quick Start Checklist:**
- Create new repo from template
- Update package.json (name, description, version)
- Replace images in /public/images/
- Customize content in app/page.tsx
- Update README.md with campaign details
- Configure deployment (Vercel)
- Test all sections and interactions

**File-by-File Customization Guide:**
- package.json: Lines to modify (name, description)
- app/page.tsx: Search for `[CUSTOMIZE]` comments
- public/images/: Image specifications and replacement instructions
- README.md: Template sections to update
- Deployment configuration steps

**Common Customization Patterns:**
- How to add/remove sections
- How to modify pricing tiers
- How to change color accents (within brand guidelines)
- How to update event dates and times
- How to configure Stripe/payment integrations

#### 2. Updated README.md

Transform from campaign-specific to template-focused:

**Sections:**
- Template overview and purpose
- How to use this template (GitHub UI instructions)
- What to customize (link to TEMPLATE_SETUP.md)
- Foster Greatness branding guidelines (link to STYLE_GUIDE.md)
- Tech stack documentation
- Deployment instructions
- Contributing guidelines

### Component Organization Strategy

**Keep Monolithic Structure** (app/page.tsx):
- Do NOT extract sections into separate component files
- Each campaign may need different sections in different orders
- Easier to delete/rearrange entire sections when visible in one file
- Reduces file jumping during customization
- Already well-organized with clear visual hierarchy

**Add Clear Section Markers:**

```tsx
{/* ============================================
    HERO SECTION
    Customize: Heading, description, CTA text, date badge
    Keep: Layout structure from STYLE_GUIDE.md
    ============================================ */}

{/* ============================================
    VALUE PROPOSITION CARDS
    Customize: Card titles, descriptions, icons
    Keep: 3-column grid pattern from STYLE_GUIDE.md
    Optional: Add/remove cards as needed
    ============================================ */}

{/* ============================================
    GALLERY SECTION
    Customize: Images, alt text
    Keep: 3x3 grid responsive layout
    Optional: Delete this section if not needed
    ============================================ */}
```

**Comment Strategy:**
- Use `[CUSTOMIZE]` tags for content that must change
- Use `[OPTIONAL]` tags for sections that can be removed
- Use `[KEEP]` tags for structure that should remain unchanged
- Include examples and usage notes in comments

### GitHub Repository Configuration

**Template Settings:**
- Enable "Template repository" in GitHub settings
- Add repository topics: `nextjs`, `foster-greatness`, `landing-page`, `template`
- Add clear description: "Foster Greatness landing page template for fundraising campaigns"
- Set default branch protection (optional)

**Repository Structure:**
```
/
├── .claude/              # Claude Code skills (if applicable)
├── .git/                 # Git repository
├── .next/                # Build artifacts (gitignored)
├── app/                  # Next.js app directory
│   ├── components/       # Reusable components
│   ├── globals.css       # Global styles with FG branding
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Main landing page (monolithic)
├── docs/
│   └── plans/            # Design documents
├── public/
│   └── images/           # Placeholder images
├── package.json          # Dependencies (genericized)
├── README.md             # Template usage instructions
├── STYLE_GUIDE.md        # Foster Greatness design system
├── TEMPLATE_SETUP.md     # Step-by-step setup guide
├── tailwind.config.ts    # FG brand colors
└── tsconfig.json         # TypeScript config
```

## Implementation Plan Overview

High-level steps (detailed plan will follow):

1. **Genericize Content**
   - Replace campaign-specific text with placeholders
   - Add `[CUSTOMIZE]` comment markers throughout page.tsx
   - Update package.json with template identifiers

2. **Create Documentation**
   - Write TEMPLATE_SETUP.md with comprehensive checklist
   - Transform README.md into template usage guide
   - Add inline comments for customization guidance

3. **Organize Assets**
   - Keep 1-2 example images with clear naming
   - Add placeholder image guidelines
   - Document image requirements (dimensions, formats)

4. **Configure GitHub**
   - Enable template repository setting
   - Add repository topics and description
   - Update repository metadata

5. **Test Template**
   - Create test repo from template
   - Verify customization workflow
   - Document any missing steps

6. **Final Cleanup**
   - Remove campaign-specific deployment configs
   - Ensure all [CUSTOMIZE] markers are clear
   - Commit and push changes

## Success Criteria

Template is successful when:
- New campaign landing pages can be created in under 30 minutes
- TEMPLATE_SETUP.md provides clear, complete instructions
- Foster Greatness branding remains consistent across all template uses
- Developers can easily find and customize all content markers
- Layout flexibility allows for varied campaign structures
- No remnant Gingerbread House content in new projects

## Future Considerations

- If multiple campaigns need identical components, extract into shared npm package
- Consider adding example layouts for common campaign types
- Could add automated tests to verify template structure
- May want to create video walkthrough of template usage

---

**Status:** Design approved
**Next Step:** Create worktree and detailed implementation plan
