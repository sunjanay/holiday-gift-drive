# Foster Greatness Landing Page Template - Setup Guide

Welcome! This template helps you quickly create professional landing pages for Foster Greatness fundraising campaigns, events, and initiatives.

## Quick Start Checklist

Use this checklist when setting up a new campaign landing page:

- [ ] **Create new repository** - Click "Use this template" on GitHub
- [ ] **Clone locally** - `git clone [your-new-repo-url]`
- [ ] **Install dependencies** - `npm install`
- [ ] **Update package.json** - Change name, description, version
- [ ] **Replace images** - Add campaign-specific images to `/public/images/`
- [ ] **Customize content** - Update all `[CUSTOMIZE]` markers in `app/page.tsx`
- [ ] **Update README.md** - Replace template instructions with campaign details
- [ ] **Test locally** - Run `npm run dev` and review all sections
- [ ] **Build verification** - Run `npm run build` to check for errors
- [ ] **Configure deployment** - Set up Vercel or preferred hosting
- [ ] **Deploy** - Push to production and test live site

---

## Step-by-Step Guide

### 1. Create Repository from Template

**On GitHub:**
1. Navigate to the template repository
2. Click the green "Use this template" button
3. Select "Create a new repository"
4. Name your repository (e.g., `summer-camp-2025`)
5. Choose visibility (Public or Private)
6. Click "Create repository"

**Clone locally:**
```bash
git clone https://github.com/your-org/your-new-campaign.git
cd your-new-campaign
npm install
```

### 2. Update Project Configuration

#### package.json

Update these fields (lines 2-4):

```json
{
  "name": "your-campaign-name",
  "version": "1.0.0",
  "description": "Brief description of your campaign",
  ...
}
```

**Example:**
```json
{
  "name": "summer-camp-2025",
  "version": "1.0.0",
  "description": "Foster Greatness Summer Camp 2025 Landing Page",
  ...
}
```

### 3. Replace Images

**Image Requirements:**

| Section | Dimensions | Format | Quantity |
|---------|-----------|--------|----------|
| Gallery | Square (1:1 ratio) | JPG/PNG | 6-9 images |
| Hero/Background | 1920x1080+ | JPG | 1 (optional) |
| Icons | N/A | Use Lucide icons | N/A |

**Steps:**
1. Delete placeholder images in `/public/images/`
2. Add your campaign images with descriptive names
3. Optimize images before adding (use tools like TinyPNG, Squoosh)
4. Update image paths in `app/page.tsx` (search for `/images/`)

**Image Naming Convention:**
- Descriptive names: `summer-camp-activity-1.jpg` (not `IMG_1234.jpg`)
- Lowercase with hyphens
- Include alt text context in filename when possible

### 4. Customize Content in app/page.tsx

The main landing page is located at `app/page.tsx`. Search for `[CUSTOMIZE]` comments to find all areas that need updating.

**Major Customization Points:**

#### Hero Section (Lines ~150-200)
- Event date badge
- Main headline
- Supporting description
- CTA button text and aria-label

#### Value Proposition Cards (Lines ~200-250)
- Card titles and descriptions
- Icons (from Lucide React)
- Number of cards (add/remove as needed)

#### Gallery Section (Lines ~300-350)
- Image sources and alt text
- Number of images displayed
- Gallery layout (default: 3x3 grid)

#### Impact Section (Lines ~350-400)
- Community impact statements
- Testimonial content
- Statistics and metrics

#### Pricing/Cost Breakdown (Lines ~400-450)
- Cost amounts
- Cost descriptions
- Calculation logic

#### CTA Sections (Throughout)
- Button text (be specific, avoid "Learn More")
- Aria-labels for accessibility
- Link destinations

**Search Strategy:**

```bash
# Find all customization points
grep -n "\[CUSTOMIZE\]" app/page.tsx

# Find all image references
grep -n "\/images\/" app/page.tsx

# Find all aria-labels
grep -n "aria-label" app/page.tsx
```

### 5. Update README.md

Replace the template instructions with your campaign details:

**Required Sections:**
- Campaign name and description
- Event details (date, time, goal)
- How to get involved
- Cost breakdown (if applicable)
- Contact information
- Deployment URL (after deployment)

**Template:**

```markdown
# [Campaign Name]

[Brief description of campaign and its purpose]

## Event Details

- **Date**: [Event date]
- **Time**: [Event time and timezone]
- **Goal**: [Participation or fundraising goal]
- **Format**: [Virtual/In-person/Hybrid]

## Get Involved

[Call to action and instructions for participation]

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Framer Motion

## Contact

For questions: [contact-email@example.com]
```

### 6. Test Locally

**Development Server:**
```bash
npm run dev
```

Visit `http://localhost:3000` and verify:

- [ ] All text displays correctly (no placeholder text remaining)
- [ ] All images load properly
- [ ] All animations work smoothly
- [ ] CTA buttons have descriptive labels
- [ ] Links go to correct destinations
- [ ] Mobile responsiveness (test at 375px, 768px, 1024px widths)
- [ ] Accessibility (test with keyboard navigation, screen reader)

**Production Build:**
```bash
npm run build
npm start
```

Verify the production build completes without errors.

### 7. Deploy to Vercel

**First-time Setup:**
1. Install Vercel CLI: `npm install -g vercel`
2. Login: `vercel login`
3. Deploy: `vercel --prod`
4. Follow prompts to configure project

**GitHub Integration (Recommended):**
1. Visit [vercel.com](https://vercel.com)
2. Click "Import Project"
3. Select your GitHub repository
4. Vercel auto-detects Next.js configuration
5. Click "Deploy"
6. Every push to `main` auto-deploys

**Custom Domain (Optional):**
1. In Vercel dashboard, go to project settings
2. Navigate to "Domains"
3. Add your custom domain
4. Update DNS records as instructed

### 8. Post-Deployment Verification

After deployment, test the live site:

- [ ] All sections render correctly
- [ ] Images load (check console for 404s)
- [ ] Forms submit properly (if applicable)
- [ ] Analytics configured (if applicable)
- [ ] Stripe payment links work (if applicable)
- [ ] Mobile performance (test on real devices)
- [ ] Lighthouse score (aim for 90+ accessibility)

---

## Common Customization Patterns

### Adding a New Section

1. Choose a location in `app/page.tsx`
2. Copy a similar existing section
3. Update content while preserving Foster Greatness styles
4. Refer to `STYLE_GUIDE.md` for component patterns
5. Test responsiveness at all breakpoints

**Example: Adding a FAQ Section**

```tsx
{/* ============================================
    FAQ SECTION
    [CUSTOMIZE]: Update questions and answers
    ============================================ */}
<section className="py-20 bg-white">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <motion.h2
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-4xl md:text-5xl font-bold text-center mb-16 text-fg-navy"
    >
      Frequently Asked Questions
    </motion.h2>

    <div className="max-w-3xl mx-auto space-y-6">
      {/* FAQ items go here - see STYLE_GUIDE.md for patterns */}
    </div>
  </div>
</section>
```

### Removing a Section

Simply delete the entire section block (marked by comment boundaries). Sections are self-contained.

### Changing Colors Within Brand Guidelines

All Foster Greatness brand colors are defined in `tailwind.config.ts`:

- `fg-navy` - Primary text and headings
- `fg-teal` - CTAs and links
- `fg-light-blue` - Backgrounds and badges
- `fg-orange` - Accent (use sparingly)
- `fg-yellow` - Accent (use sparingly)
- `fg-accent-teal` - Gradients and highlights

**To use:**
```tsx
className="text-fg-navy bg-fg-teal border-fg-light-blue"
```

**See `STYLE_GUIDE.md` for complete color usage guidelines.**

### Modifying Animations

All animations use Framer Motion. Common patterns:

**Fade in on scroll:**
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

**Staggered list:**
```tsx
{items.map((item, index) => (
  <motion.div
    key={index}
    initial={{ opacity: 0, x: -20 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ delay: 0.1 * index, duration: 0.4 }}
  >
    {item.content}
  </motion.div>
))}
```

**See `STYLE_GUIDE.md` for complete animation patterns.**

### Updating Pricing/Cost Information

Pricing is typically displayed in the "Cost Breakdown" section using `AnimatedCounter` components:

```tsx
// [CUSTOMIZE]: Update these values
const transparencyCosts = useMemo(() => [
  {
    amount: 40,  // Update this number
    title: "Kit Cost",  // Update this label
    description: "What's included in the kit",  // Update description
    icon: Gift,  // Choose appropriate icon
    color: "from-fg-teal to-fg-accent-teal"
  },
  // Add more cost items as needed
], []);
```

### Configuring Stripe Payment Integration

If using the Stripe Buy Button component:

1. Create product in Stripe Dashboard
2. Generate Buy Button code
3. Update `app/components/StripeBuyButton.tsx` with your:
   - Stripe Publishable Key
   - Buy Button ID
   - Product ID

**Environment Variables:**
```bash
# Create .env.local
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
```

---

## File Reference Guide

### Files You MUST Customize

| File | What to Update |
|------|---------------|
| `package.json` | Name, description, version |
| `app/page.tsx` | All content marked with `[CUSTOMIZE]` |
| `README.md` | Replace template instructions with campaign details |
| `/public/images/` | Replace all images |

### Files You MAY Customize

| File | When to Update |
|------|---------------|
| `app/components/StripeBuyButton.tsx` | If using Stripe payments |
| `tailwind.config.ts` | Only if extending colors (consult STYLE_GUIDE.md) |
| `app/globals.css` | Rarely needed - styles are in Tailwind |
| `app/layout.tsx` | Only for meta tags, fonts, or global changes |

### Files You SHOULD NOT Modify

| File | Why |
|------|-----|
| `STYLE_GUIDE.md` | Reference documentation for all projects |
| `tailwind.config.ts` (colors) | Foster Greatness brand colors are standardized |
| `next.config.ts` | Pre-configured for optimal performance |
| `tsconfig.json` | Standard TypeScript configuration |

---

## Accessibility Checklist

Foster Greatness is committed to creating accessible experiences for all users. Before deploying:

- [ ] All images have descriptive `alt` text
- [ ] All decorative icons have `aria-hidden="true"`
- [ ] All interactive buttons have descriptive `aria-label` attributes
- [ ] Color contrast meets WCAG AA standards (see STYLE_GUIDE.md)
- [ ] Keyboard navigation works for all interactive elements
- [ ] Form inputs have associated labels
- [ ] Motion respects `prefers-reduced-motion` (already configured)
- [ ] Headings follow proper hierarchy (H1 → H2 → H3)
- [ ] Test with screen reader (VoiceOver on Mac, NVDA on Windows)

**Testing Tools:**
- [WAVE Browser Extension](https://wave.webaim.org/extension/)
- [axe DevTools](https://www.deque.com/axe/devtools/)
- Chrome Lighthouse (built into DevTools)

---

## Performance Optimization

### Image Optimization

**Before adding images:**
1. Resize to appropriate dimensions (see Image Requirements above)
2. Compress using:
   - [TinyPNG](https://tinypng.com/) for PNG files
   - [Squoosh](https://squoosh.app/) for JPG files
   - Target: Under 200KB per image

**In code:**
- Always use Next.js `<Image>` component (never `<img>`)
- Specify `width` and `height` or `fill` prop
- Add `loading="lazy"` for images below the fold
- Use appropriate `sizes` attribute

### Build Optimization

The template is pre-configured for optimal performance, but verify:

```bash
npm run build
```

Check the output for:
- Bundle sizes (should be reasonable)
- No TypeScript errors
- All pages compile successfully

### Lighthouse Scores

Aim for these minimum scores:
- Performance: 90+
- Accessibility: 95+
- Best Practices: 90+
- SEO: 90+

Run Lighthouse in Chrome DevTools (Ctrl/Cmd + Shift + I → Lighthouse tab).

---

## Troubleshooting

### Build Errors

**Error: "Module not found"**
```bash
# Solution: Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

**Error: TypeScript errors**
```bash
# Solution: Check for syntax errors in page.tsx
npm run build
# Fix errors shown in output
```

### Images Not Loading

**Symptom: Broken image icons**
- Check file paths are correct (case-sensitive)
- Verify images exist in `/public/images/`
- Check browser console for 404 errors
- Ensure image filenames have no spaces

### Deployment Issues

**Vercel deployment fails:**
- Check build succeeds locally first: `npm run build`
- Review Vercel build logs for specific errors
- Verify all environment variables are set in Vercel dashboard

**Site looks different in production:**
- Clear browser cache
- Check for environment-specific CSS
- Verify all images deployed correctly

### Styling Issues

**Colors look wrong:**
- Verify you're using Foster Greatness color classes (`fg-navy`, `fg-teal`, etc.)
- Check `tailwind.config.ts` wasn't accidentally modified
- Refer to `STYLE_GUIDE.md` for correct usage

**Layout breaks on mobile:**
- Test at common breakpoints: 375px, 768px, 1024px
- Use browser DevTools responsive mode
- Check for hardcoded widths (should use Tailwind responsive classes)

---

## Getting Help

### Resources

- **Style Guide**: See `STYLE_GUIDE.md` for complete design system documentation
- **Next.js Docs**: https://nextjs.org/docs
- **Tailwind CSS Docs**: https://tailwindcss.com/docs
- **Framer Motion Docs**: https://www.framer.com/motion/
- **Accessibility Guidelines**: https://www.w3.org/WAI/WCAG21/quickref/

### Foster Greatness Brand Guidelines

For questions about:
- Brand voice and messaging
- Logo usage
- Additional brand assets
- Campaign approval

Contact: [brand-contact@example.com]

### Technical Support

For technical issues with this template:
1. Check this guide's Troubleshooting section
2. Review `STYLE_GUIDE.md` for component patterns
3. Check Next.js documentation for framework questions
4. Contact [dev-contact@example.com]

---

## Template Maintenance

### Keeping Template Updated

If you need to pull updates from the template repository:

```bash
# Add template as remote (one time)
git remote add template https://github.com/org/landing-page-template.git

# Fetch template changes
git fetch template

# Merge template updates (be careful not to overwrite your content)
git merge template/main --no-commit
# Review changes carefully before committing
```

**Note:** Template updates are rare. Only pull updates if you need new features or critical fixes.

---

## Success Checklist

Before launching your campaign, verify:

### Content
- [ ] All `[CUSTOMIZE]` markers replaced with actual content
- [ ] No placeholder text remains
- [ ] All dates, times, and goals are correct
- [ ] Contact information is accurate
- [ ] Spelling and grammar checked

### Visual
- [ ] All images display correctly
- [ ] Images are optimized for web
- [ ] Brand colors used correctly
- [ ] Responsive on mobile, tablet, desktop
- [ ] Animations work smoothly

### Technical
- [ ] Build succeeds: `npm run build`
- [ ] No console errors
- [ ] All links work correctly
- [ ] Forms submit properly
- [ ] Payment integration works (if applicable)

### Accessibility
- [ ] All images have alt text
- [ ] Buttons have descriptive labels
- [ ] Keyboard navigation works
- [ ] Color contrast meets standards
- [ ] Screen reader tested

### Performance
- [ ] Lighthouse score 90+ on all metrics
- [ ] Images optimized
- [ ] Load time under 3 seconds
- [ ] Tested on real mobile devices

### Deployment
- [ ] Deployed to production
- [ ] Custom domain configured (if applicable)
- [ ] SSL certificate active (HTTPS)
- [ ] Analytics configured (if applicable)
- [ ] Tested on live URL

---

**Template Version:** 1.0
**Last Updated:** November 2025
**Maintained By:** Foster Greatness Development Team

Good luck with your campaign! 🎉
