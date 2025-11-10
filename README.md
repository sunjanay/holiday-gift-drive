# Foster Greatness Landing Page Template

A professional, accessible, and high-performance landing page template for Foster Greatness fundraising campaigns, events, and initiatives.

Built with Next.js 16, React 19, TypeScript, Tailwind CSS, and Framer Motion.

---

## Using This Template

### Quick Start

1. **Create new repository** - Click the green "Use this template" button above
2. **Clone your new repo** - `git clone [your-new-repo-url]`
3. **Install dependencies** - `npm install`
4. **Read the setup guide** - See [TEMPLATE_SETUP.md](./TEMPLATE_SETUP.md) for comprehensive instructions
5. **Customize content** - Update all `[CUSTOMIZE]` markers in `app/page.tsx`
6. **Deploy** - Push to Vercel or your preferred hosting

### Complete Setup Guide

For detailed, step-by-step instructions, see **[TEMPLATE_SETUP.md](./TEMPLATE_SETUP.md)**

---

## What's Included

### Design System
- Complete Foster Greatness brand colors, typography, and component patterns
- Comprehensive style guide in [STYLE_GUIDE.md](./STYLE_GUIDE.md)
- Accessible, WCAG AA compliant color schemes
- Responsive layouts for mobile, tablet, and desktop

### Pre-built Components
- Hero sections with animated badges and CTAs
- Feature cards with gradient icons
- Image galleries with responsive grids
- Impact sections with testimonials
- Pricing/cost breakdown cards with animated counters
- Smooth scroll animations powered by Framer Motion

### Accessibility Features
- Semantic HTML and proper heading hierarchy
- ARIA labels on all interactive elements
- Keyboard navigation support
- Reduced motion support for users with motion sensitivity
- High contrast text for readability
- Descriptive alt text patterns for images

### Performance Optimizations
- Next.js 16 with App Router and Turbopack
- Optimized image loading with Next.js Image component
- Code splitting and lazy loading
- Optimized bundle size
- Static generation for fast page loads

### Developer Experience
- TypeScript for type safety
- Tailwind CSS for rapid styling
- ESLint configuration
- Hot module replacement in development
- Clear code organization and comments

### Claude Code Integration
- Pre-approved permissions in `.claude/settings.json`
- Foster Greatness brand guidelines in `.claude/skills/`
- UX best practices skill for research-backed design decisions
- **When you create a project from this template, Claude permissions are already configured!**

---

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI Library**: React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Bundler**: Turbopack
- **Deployment**: Vercel (recommended)

---

## Project Structure

```
/
├── .claude/              # Claude Code skills and permissions ✅ INCLUDED IN TEMPLATE
│   ├── settings.json     # Pre-approved tool permissions
│   └── skills/           # Foster Greatness brand and UX guidelines
├── app/
│   ├── components/       # Reusable React components
│   │   └── StripeBuyButton.tsx
│   ├── globals.css       # Global styles with FG branding
│   ├── layout.tsx        # Root layout with metadata
│   └── page.tsx          # Main landing page (customize here)
├── public/
│   └── images/           # Campaign images (replace with yours)
├── docs/
│   └── plans/            # Design documentation
├── package.json          # Dependencies (update name/description)
├── README.md             # This file
├── STYLE_GUIDE.md        # Complete design system reference
├── TEMPLATE_SETUP.md     # Step-by-step setup instructions
├── tailwind.config.ts    # Tailwind + FG brand colors
└── tsconfig.json         # TypeScript configuration
```

---

## Development

### Install Dependencies
```bash
npm install
```

### Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view in your browser.

### Build for Production
```bash
npm run build
```

### Start Production Server
```bash
npm start
```

---

## Customization Guide

### 1. Update Project Info

**Edit `package.json`:**
```json
{
  "name": "your-campaign-name",
  "description": "Your campaign description"
}
```

### 2. Replace Images

Add your campaign images to `/public/images/` and update paths in `app/page.tsx`.

**Image Requirements:**
- Square images (1:1 ratio) for gallery
- Optimized for web (under 200KB each)
- Descriptive alt text for accessibility

### 3. Customize Content

Search for `[CUSTOMIZE]` comments in `app/page.tsx` to find all customization points:

```bash
grep -n "\[CUSTOMIZE\]" app/page.tsx
```

**Major sections to customize:**
- Hero headline and description
- Value proposition cards
- Gallery images
- Impact statements
- Pricing/cost breakdown
- CTA button text and links
- Event dates and details

### 4. Update README

Replace this template README with your campaign-specific information.

### 5. Review Style Guide

See [STYLE_GUIDE.md](./STYLE_GUIDE.md) for:
- Color usage guidelines
- Typography hierarchy
- Component patterns
- Animation examples
- Accessibility standards

---

## Deployment

### Deploy to Vercel (Recommended)

**One-Click Deploy:**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

**Or via CLI:**
```bash
npm install -g vercel
vercel login
vercel --prod
```

**GitHub Integration:**
1. Push your repository to GitHub
2. Import project in [Vercel Dashboard](https://vercel.com)
3. Vercel auto-detects Next.js and deploys
4. Every push to `main` triggers automatic deployment

### Other Platforms

This template works on any platform supporting Next.js:
- Netlify
- AWS Amplify
- Cloudflare Pages
- Self-hosted with Node.js

---

## Claude Code Permissions

This template includes pre-approved Claude Code permissions in `.claude/settings.json`:

✅ All permissions you approved in the original project are preserved
✅ No need to re-approve permissions in new projects
✅ Foster Greatness brand guidelines included as skills
✅ UX best practices skill for accessibility and usability

**What this means:**
When you work on a project created from this template, Claude Code will already have permission to:
- Run npm commands (install, dev, build)
- Push to git and create PRs
- Read files from your Downloads folder
- Use Foster Greatness brand skills automatically

---

## Accessibility

This template is built with accessibility as a priority:

- **WCAG AA Compliant** - All color combinations meet contrast standards
- **Semantic HTML** - Proper heading hierarchy and landmarks
- **ARIA Labels** - All interactive elements properly labeled
- **Keyboard Navigation** - Full site navigable without mouse
- **Motion Preferences** - Respects `prefers-reduced-motion`
- **Screen Reader Tested** - Compatible with VoiceOver and NVDA

**Test before deploying:**
- Run Lighthouse in Chrome DevTools (aim for 95+ accessibility score)
- Test keyboard navigation (Tab, Enter, Esc)
- Test with screen reader
- Verify color contrast with [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)

---

## Performance

Out-of-the-box performance optimizations:

- **Next.js Static Generation** - Pre-rendered pages for instant load
- **Image Optimization** - Automatic WebP conversion and lazy loading
- **Code Splitting** - Only load what's needed
- **Turbopack** - Faster builds and HMR in development
- **Optimized Fonts** - Self-hosted Century Gothic for speed

**Target Lighthouse Scores:**
- Performance: 90+
- Accessibility: 95+
- Best Practices: 90+
- SEO: 90+

---

## Foster Greatness Branding

This template maintains Foster Greatness brand consistency:

### Colors
- **Navy (#1a2949)** - Primary text and headings
- **Teal (#0067a2)** - CTAs and interactive elements
- **Light Blue (#ddf3ff)** - Backgrounds and badges
- **Orange (#fa8526)** - Accent (use sparingly)
- **Yellow (#faca2c)** - Accent (use sparingly)

### Typography
- **Font**: Century Gothic
- **Hierarchy**: Clear heading levels with proper sizing
- **Line Height**: Relaxed for body text (1.625)

### Voice
- Authentic and empowering
- Focused on belonging and community
- Specific, not generic
- Action-oriented CTAs

**See [STYLE_GUIDE.md](./STYLE_GUIDE.md) for complete guidelines.**

---

## Support and Resources

### Documentation
- **Setup Guide**: [TEMPLATE_SETUP.md](./TEMPLATE_SETUP.md)
- **Style Guide**: [STYLE_GUIDE.md](./STYLE_GUIDE.md)
- **Design Document**: [docs/plans/2025-11-10-github-template-repository-design.md](./docs/plans/2025-11-10-github-template-repository-design.md)

### External Resources
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Framer Motion Documentation](https://www.framer.com/motion/)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

### Getting Help
- **Template Issues**: Open an issue in the template repository
- **Foster Greatness Branding**: Contact brand team
- **Technical Support**: Refer to TEMPLATE_SETUP.md troubleshooting section

---

## Contributing

This template is maintained by the Foster Greatness development team.

**To contribute improvements:**
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

## License

This template is maintained for Foster Greatness campaign use.

---

## Acknowledgments

Built with:
- [Next.js](https://nextjs.org/) by Vercel
- [Tailwind CSS](https://tailwindcss.com/) by Tailwind Labs
- [Framer Motion](https://www.framer.com/motion/) by Framer
- [Lucide Icons](https://lucide.dev/) by Lucide
- [Claude Code](https://claude.com/claude-code) by Anthropic

Designed for Foster Greatness - creating lifelong community and belonging for current and former foster youth nationwide.

---

**Template Version:** 1.0
**Last Updated:** November 2025
**Questions?** See [TEMPLATE_SETUP.md](./TEMPLATE_SETUP.md) for comprehensive guidance.
