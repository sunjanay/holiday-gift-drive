# Next.js 16 Web App Builder Skill

A comprehensive skill for building modern, high-performance web applications with Next.js 16, featuring Turbopack (stable), Cache Components with "use cache" directive, proxy.ts network boundary, and React 19.2 integration.

## Overview

This skill provides everything you need to develop production-ready Next.js 16 applications, including:

- **Comprehensive documentation** on all Next.js 16 features
- **Practical examples** demonstrating real-world patterns
- **Technical references** for migrations and API details
- **Ready-to-use templates** for common components
- **Helper scripts** for migration and configuration

## Structure

```
my-skill/
├── SKILL.md              # Main skill documentation (START HERE)
├── examples.md           # Practical usage examples
├── reference.md          # Technical reference and migration guide
├── README.md            # This file
├── templates/           # Ready-to-use code templates
│   ├── page-template.tsx
│   ├── route-handler-template.ts
│   ├── server-actions-template.ts
│   ├── cached-component-template.tsx
│   └── proxy-template.ts
└── scripts/             # Helper utilities
    ├── migration-checker.py
    ├── config-generator.js
    └── README.md
```

## Quick Start

### 1. Read the Main Documentation

Start with `SKILL.md` for a comprehensive overview of Next.js 16 features, setup instructions, and best practices.

### 2. Check Out Examples

Browse `examples.md` for practical, copy-paste examples of:
- Cache Components with PPR
- proxy.ts configurations
- Caching API usage
- Server Actions
- Full application examples

### 3. Use Templates

Copy templates from the `templates/` directory:

```bash
# Create a new page
cp templates/page-template.tsx app/my-page/page.tsx

# Create API route
cp templates/route-handler-template.ts app/api/my-route/route.ts

# Add Server Actions
cp templates/server-actions-template.ts app/actions.ts

# Set up proxy
cp templates/proxy-template.ts proxy.ts
```

### 4. Run Helper Scripts

Use the included scripts for migration and setup:

```bash
# Check for migration issues
python scripts/migration-checker.py

# Generate next.config.ts
node scripts/config-generator.js
```

## Key Next.js 16 Features

### Cache Components (New)
```typescript
'use cache';
export default async function Page() {
  // Explicitly cached content
}
```

### proxy.ts (Replaces middleware.ts)
```typescript
export default function proxy(request: NextRequest) {
  // Network boundary logic
  return NextResponse.next();
}
```

### Enhanced Caching APIs
```typescript
// Stale-while-revalidate
revalidateTag('my-tag', 'max');

// Read-your-writes (Server Actions only)
updateTag('my-tag');

// Refresh uncached data (Server Actions only)
refresh();
```

### Async Everything
```typescript
// All route params and special functions are async
const { id } = await params;
const search = await searchParams;
const cookies = await cookies();
const headers = await headers();
```

### Turbopack (Stable)
- **Default bundler** for all projects
- **2-5× faster** production builds
- **Up to 10× faster** Fast Refresh

## Migration from Next.js 15

### Automated Migration

```bash
npx @next/codemod@canary upgrade latest
```

### Manual Checklist

1. ✓ Update Node.js to 20.9.0+
2. ✓ Update Next.js to 16.x
3. ✓ Convert `params` and `searchParams` to async
4. ✓ Convert `cookies()`, `headers()`, `draftMode()` to async
5. ✓ Rename `middleware.ts` → `proxy.ts`
6. ✓ Update `revalidateTag()` calls to include second argument
7. ✓ Add `default.js` to all parallel routes
8. ✓ Review and update image configuration

See `reference.md` for complete migration guide.

## Requirements

- **Node.js**: 20.9.0+
- **TypeScript**: 5.1.0+
- **React**: 19.2+
- **Browsers**: Chrome 111+, Edge 111+, Firefox 111+, Safari 16.4+

## Resources

- **Official Docs**: https://nextjs.org/docs
- **Upgrade Guide**: https://nextjs.org/docs/app/guides/upgrading/version-16
- **Next.js 16 Blog**: https://nextjs.org/blog/next-16
- **Examples Repo**: https://github.com/vercel/next.js/tree/canary/examples
- **Discord**: https://nextjs.org/discord

## Documentation Files

### SKILL.md (Main Documentation)
Complete guide covering:
- Core philosophy and key features
- Setup and installation
- Configuration best practices
- Cache Components patterns
- proxy.ts usage
- Caching APIs
- Data fetching
- TypeScript best practices
- Performance optimization
- Error handling
- Testing and deployment

### examples.md (Practical Examples)
Real-world examples including:
- Blog with mixed static/dynamic content
- E-commerce product pages with PPR
- Dashboard with cached layouts
- Authentication and i18n in proxy.ts
- Complete social media feed app
- Real-time analytics dashboard
- Migration before/after comparisons

### reference.md (Technical Reference)
Detailed technical information:
- Complete breaking changes list
- Step-by-step migration guide
- Full API reference
- Configuration reference
- Performance optimization guide
- TypeScript reference
- Troubleshooting guide

## Templates

### page-template.tsx
Basic page component with async params, metadata, and static generation.

### route-handler-template.ts
Complete API route with GET, POST, PUT, DELETE methods and validation.

### server-actions-template.ts
Type-safe server actions with validation, error handling, and caching.

### cached-component-template.tsx
Full product page demonstrating Cache Components and Partial Prerendering.

### proxy-template.ts
Comprehensive proxy.ts with authentication, i18n, A/B testing, and more.

## Scripts

### migration-checker.py
Scans your project for common Next.js 16 migration issues.

### config-generator.js
Interactive generator for creating optimized next.config.ts files.

See `scripts/README.md` for detailed usage instructions.

## Tips for Success

1. **Start with SKILL.md** - Read the core concepts first
2. **Use templates** - Don't start from scratch
3. **Run migration checker** - Catch issues early
4. **Test incrementally** - Migrate features one at a time
5. **Leverage examples** - Copy patterns that fit your needs
6. **Enable caching intentionally** - Use "use cache" only where needed
7. **Monitor performance** - Use Next.js 16's improved logging

## Support

For issues and questions:
1. Check `reference.md` troubleshooting section
2. Review `examples.md` for similar patterns
3. Run `migration-checker.py` for diagnostic help
4. Visit [Next.js Discord](https://nextjs.org/discord)
5. Search [GitHub Issues](https://github.com/vercel/next.js/issues)

## License

This skill documentation is provided as-is for Next.js 16 development.

## Contributing

Contributions welcome! Feel free to:
- Add more examples
- Improve documentation
- Create additional templates
- Enhance helper scripts

---

**Version**: 1.0.0  
**Last Updated**: October 2025 (Next.js 16.0)  
**Author**: Jordan - Chief Impact Officer, Doing Good Works
