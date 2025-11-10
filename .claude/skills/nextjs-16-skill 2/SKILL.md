---
name: next-js-16-builder
description: Build modern, high-performance web applications with Next.js 16, featuring Turbopack, Cache Components, and React 19.2
---

# Next.js 16 Web App Builder

A comprehensive skill for building modern web applications with Next.js 16, the latest major release featuring Turbopack (stable), Cache Components with "use cache" directive, proxy.ts network boundary, and React 19.2 integration.

## Core Philosophy

Next.js 16 embraces **explicit over implicit** caching and an **opt-in approach** to optimization. All dynamic code executes at request time by default, giving developers predictable behavior aligned with modern full-stack framework expectations.

## Key Features of Next.js 16

### 1. Cache Components (New)
- **"use cache" directive**: Explicit, opt-in caching for pages, components, and functions
- **Automatic cache key generation**: Compiler-driven cache key creation
- **Partial Prerendering (PPR) completion**: Mix static and dynamic content seamlessly
- **Default dynamic behavior**: All code runs at request time unless explicitly cached

### 2. Turbopack (Stable - Default Bundler)
- **2-5× faster production builds**
- **Up to 10× faster Fast Refresh**
- **File system caching (beta)**: Persistent artifacts across restarts
- **Default for all new projects**: Opt-out with `--webpack` flag if needed

### 3. proxy.ts (Replaces middleware.ts)
- **Explicit network boundary**: Clear separation of concerns
- **Node.js runtime**: Single, predictable runtime for request interception
- **Same logic, better naming**: Simple rename from middleware to proxy

### 4. Enhanced Routing & Navigation
- **Layout deduplication**: Shared layouts downloaded once, not per-link
- **Incremental prefetching**: Only prefetch missing cache data
- **Smart cancellation**: Requests cancelled when links leave viewport
- **Priority prefetching**: Hover and viewport re-entry prioritization

### 5. Improved Caching APIs
- **`revalidateTag(tag, profile)`**: Now requires cacheLife profile for SWR behavior
- **`updateTag(tag)`**: New Server Actions-only API for read-your-writes semantics
- **`refresh()`**: New Server Actions-only API for refreshing uncached data

### 6. React 19.2 Integration
- **View Transitions**: Animate elements during updates
- **`useEffectEvent()`**: Extract non-reactive logic from Effects
- **`<Activity/>`**: Render background activity with state preservation

## Setup & Installation

### New Project
```bash
# Create new Next.js 16 app with modern defaults
npx create-next-app@latest

# Includes: App Router, TypeScript, Tailwind CSS, ESLint
```

### Upgrade Existing Project
```bash
# Automated upgrade (recommended)
npx @next/codemod@canary upgrade latest

# Manual upgrade
npm install next@latest react@latest react-dom@latest

# For migration guidance
# Visit: https://nextjs.org/docs/app/guides/upgrading/version-16
```

### Minimum Requirements
- **Node.js**: 20.9.0+ (LTS)
- **TypeScript**: 5.1.0+
- **Browsers**: Chrome 111+, Edge 111+, Firefox 111+, Safari 16.4+

## Configuration Best Practices

### next.config.ts Structure
```typescript
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Enable Cache Components (opt-in)
  cacheComponents: true,
  
  // Turbopack file system caching (beta)
  experimental: {
    turbopackFileSystemCacheForDev: true,
  },
  
  // React Compiler (stable, optional)
  reactCompiler: true,
  
  // Build Adapters (alpha)
  experimental: {
    adapterPath: require.resolve('./my-adapter.js'),
  },
  
  // Image optimization
  images: {
    minimumCacheTTL: 14400, // 4 hours (new default)
    imageSizes: [32, 48, 64, 96, 128, 256, 384], // 16 removed
    qualities: [75], // simplified default
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'example.com',
      },
    ],
    dangerouslyAllowLocalIP: false, // security default
    maximumRedirects: 3, // new default
  },
};

export default nextConfig;
```

### Enable Native TypeScript Config (Experimental)
```bash
# Run commands with native TS support
next dev --experimental-next-config-strip-types
next build --experimental-next-config-strip-types
```

## Cache Components Pattern

### Enable in Config
```typescript
// next.config.ts
const nextConfig = {
  cacheComponents: true,
};
export default nextConfig;
```

### Using "use cache" Directive

#### Cache Entire Page
```typescript
// app/blog/page.tsx
'use cache';

export default async function BlogPage() {
  const posts = await fetchPosts();
  return <PostList posts={posts} />;
}
```

#### Cache Component
```typescript
// components/UserProfile.tsx
'use cache';

export async function UserProfile({ userId }: { userId: string }) {
  const user = await fetchUser(userId);
  return <div>{user.name}</div>;
}
```

#### Cache Function
```typescript
// lib/data.ts
'use cache';

export async function getProductData(productId: string) {
  const product = await db.products.findById(productId);
  return product;
}
```

#### Partial Prerendering (PPR) Pattern
```typescript
// app/dashboard/page.tsx
import { Suspense } from 'react';

// Static shell (cached)
'use cache';
export default function DashboardPage() {
  return (
    <div>
      <h1>Dashboard</h1>
      {/* Dynamic content in Suspense */}
      <Suspense fallback={<LoadingSkeleton />}>
        <LiveData />
      </Suspense>
    </div>
  );
}

// Dynamic content (not cached)
async function LiveData() {
  const data = await fetchLiveData(); // Runs at request time
  return <div>{data}</div>;
}
```

## proxy.ts Network Boundary

### Migration from middleware.ts
```typescript
// Before (middleware.ts)
import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  return NextResponse.redirect(new URL('/home', request.url));
}

// After (proxy.ts)
import { NextRequest, NextResponse } from 'next/server';

export default function proxy(request: NextRequest) {
  return NextResponse.redirect(new URL('/home', request.url));
}
```

### proxy.ts Use Cases
- Authentication checks
- Redirects based on request headers
- Geographic routing
- A/B testing setup
- Request logging and analytics

### Note on Edge Runtime
- `middleware.ts` still available for Edge runtime use cases
- Deprecated and will be removed in future version
- Prefer `proxy.ts` on Node.js runtime for most use cases

## Caching APIs

### revalidateTag() - Stale-While-Revalidate
```typescript
import { revalidateTag } from 'next/cache';

// ✅ New signature with cacheLife profile
revalidateTag('blog-posts', 'max'); // Recommended for most cases
revalidateTag('news-feed', 'hours');
revalidateTag('analytics', 'days');

// Or inline custom revalidation time
revalidateTag('products', { revalidate: 3600 });

// ⚠️ Single argument form is deprecated
// revalidateTag('blog-posts'); // DON'T DO THIS
```

**When to use**: Static content with eventual consistency tolerance. Users get cached data instantly while Next.js revalidates in the background.

### updateTag() - Read-Your-Writes (Server Actions Only)
```typescript
'use server';
import { updateTag } from 'next/cache';

export async function updateUserProfile(userId: string, profile: Profile) {
  await db.users.update(userId, profile);
  
  // Expire cache and refresh immediately
  // User sees their changes right away
  updateTag(`user-${userId}`);
}
```

**When to use**: Forms, user settings, interactive features where users expect immediate feedback on their changes.

### refresh() - Uncached Data Only (Server Actions Only)
```typescript
'use server';
import { refresh } from 'next/cache';

export async function markNotificationAsRead(notificationId: string) {
  await db.notifications.markAsRead(notificationId);
  
  // Refresh uncached data only (e.g., notification count in header)
  // Cached page shells remain fast
  refresh();
}
```

**When to use**: Refresh dynamic data (notification counts, live metrics, status indicators) without touching cached content.

## Routing & Navigation Patterns

### File-Based Routing
```
app/
├── layout.tsx          # Root layout (required)
├── page.tsx           # Home page
├── about/
│   └── page.tsx       # /about
├── blog/
│   ├── page.tsx       # /blog
│   └── [slug]/
│       └── page.tsx   # /blog/[slug]
└── api/
    └── route.ts       # API route
```

### Async Route Parameters (Breaking Change)
```typescript
// ❌ Old (synchronous)
export default function Page({ params }: { params: { slug: string } }) {
  return <div>{params.slug}</div>;
}

// ✅ New (async - REQUIRED in Next.js 16)
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <div>{slug}</div>;
}
```

### Async searchParams (Breaking Change)
```typescript
// ❌ Old (synchronous)
export default function Page({
  searchParams,
}: {
  searchParams: { query?: string };
}) {
  return <div>{searchParams.query}</div>;
}

// ✅ New (async - REQUIRED in Next.js 16)
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>;
}) {
  const { query } = await searchParams;
  return <div>{query}</div>;
}
```

### Parallel Routes (Breaking Change)
```typescript
// All parallel route slots now require explicit default.js

// app/@modal/default.tsx
export default function Default() {
  return null; // or notFound()
}
```

## Server Components & Actions

### Server Component (Default)
```typescript
// app/products/page.tsx
export default async function ProductsPage() {
  // Fetch data directly in component
  const products = await db.products.findAll();
  
  return (
    <div>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

### Server Actions
```typescript
// app/actions.ts
'use server';

import { revalidatePath } from 'next/cache';

export async function createProduct(formData: FormData) {
  const name = formData.get('name') as string;
  const price = parseFloat(formData.get('price') as string);
  
  await db.products.create({ name, price });
  revalidatePath('/products');
}
```

### Client Component
```typescript
'use client';

import { useState } from 'react';
import { createProduct } from './actions';

export function ProductForm() {
  const [pending, setPending] = useState(false);
  
  async function handleSubmit(formData: FormData) {
    setPending(true);
    await createProduct(formData);
    setPending(false);
  }
  
  return (
    <form action={handleSubmit}>
      <input name="name" required />
      <input name="price" type="number" required />
      <button type="submit" disabled={pending}>
        {pending ? 'Creating...' : 'Create Product'}
      </button>
    </form>
  );
}
```

## Data Fetching Patterns

### Async Server Components (Recommended)
```typescript
async function getData() {
  const res = await fetch('https://api.example.com/data', {
    next: { revalidate: 3600 }, // Revalidate every hour
  });
  return res.json();
}

export default async function Page() {
  const data = await getData();
  return <div>{data.title}</div>;
}
```

### Route Handlers (API Routes)
```typescript
// app/api/products/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const products = await db.products.findAll();
  return NextResponse.json(products);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const product = await db.products.create(body);
  return NextResponse.json(product, { status: 201 });
}
```

### Async Headers, Cookies, DraftMode (Breaking Change)
```typescript
import { cookies, headers, draftMode } from 'next/headers';

// ❌ Old (synchronous)
const cookieStore = cookies();
const headersList = headers();
const { isEnabled } = draftMode();

// ✅ New (async - REQUIRED in Next.js 16)
const cookieStore = await cookies();
const headersList = await headers();
const { isEnabled } = await draftMode();
```

## Metadata & SEO

### Static Metadata
```typescript
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My App',
  description: 'App description',
  openGraph: {
    title: 'My App',
    description: 'App description',
    images: ['/og-image.jpg'],
  },
};
```

### Dynamic Metadata
```typescript
import type { Metadata } from 'next';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      images: [post.coverImage],
    },
  };
}
```

### Image Metadata Routes (Breaking Change)
```typescript
// app/og/[id]/opengraph-image.tsx
import { ImageResponse } from 'next/og';

// ❌ Old
export default function Image({ params }: { params: { id: string } }) {
  return new ImageResponse(<div>{params.id}</div>);
}

// ✅ New (params is async)
export default async function Image({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return new ImageResponse(<div>{id}</div>);
}
```

## Image Optimization

### next/image Component
```typescript
import Image from 'next/image';

// Local images
import profilePic from './profile.jpg';

export default function Page() {
  return (
    <>
      {/* Static import */}
      <Image
        src={profilePic}
        alt="Profile"
        placeholder="blur" // Automatic blur-up
      />
      
      {/* Remote image */}
      <Image
        src="https://example.com/image.jpg"
        alt="Description"
        width={800}
        height={600}
        quality={75} // Coerced to closest value in images.qualities
      />
      
      {/* Responsive image */}
      <Image
        src="/hero.jpg"
        alt="Hero"
        fill
        style={{ objectFit: 'cover' }}
        priority // Load immediately (no lazy loading)
      />
    </>
  );
}
```

### Image Configuration Changes in Next.js 16
```typescript
// next.config.ts
const nextConfig = {
  images: {
    minimumCacheTTL: 14400, // 4 hours (was 60s)
    imageSizes: [32, 48, 64, 96, 128, 256, 384], // 16 removed
    qualities: [75], // Simplified from [1..100]
    dangerouslyAllowLocalIP: false, // Security: block local IPs
    maximumRedirects: 3, // Max redirects (was unlimited)
    
    // Required for local images with query strings
    localPatterns: [
      {
        pathname: '/assets/**',
        search: '', // Allow specific patterns
      },
    ],
  },
};
```

## TypeScript Best Practices

### Type-Safe Route Params
```typescript
type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function Page({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { query } = await searchParams;
  
  return <div>{slug} - {query}</div>;
}
```

### Type-Safe Server Actions
```typescript
'use server';

import { z } from 'zod';

const ProductSchema = z.object({
  name: z.string().min(1),
  price: z.number().positive(),
  description: z.string().optional(),
});

type ProductInput = z.infer<typeof ProductSchema>;

export async function createProduct(input: ProductInput) {
  const validated = ProductSchema.parse(input);
  
  const product = await db.products.create(validated);
  return { success: true, product };
}
```

### Type-Safe API Routes
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const CreateProductSchema = z.object({
  name: z.string().min(1),
  price: z.number().positive(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = CreateProductSchema.parse(body);
    
    const product = await db.products.create(validated);
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

## Performance Optimization

### Turbopack Optimization
```typescript
// Enable file system caching for faster restarts
const nextConfig = {
  experimental: {
    turbopackFileSystemCacheForDev: true,
  },
};

// Opt out of Turbopack if needed
// Terminal: next dev --webpack
```

### React Compiler (Optional)
```typescript
// next.config.ts
const nextConfig = {
  reactCompiler: true, // Automatic memoization
};

// Install: npm install babel-plugin-react-compiler@latest
```

### Bundle Analysis
```bash
# Analyze production bundle
npm install -D @next/bundle-analyzer

# next.config.ts
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer(nextConfig);

# Run: ANALYZE=true npm run build
```

## Error Handling

### error.tsx
```typescript
'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <p>{error.message}</p>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
```

### not-found.tsx
```typescript
export default function NotFound() {
  return (
    <div>
      <h2>404 - Page Not Found</h2>
      <p>Could not find requested resource</p>
    </div>
  );
}
```

### global-error.tsx (Root Error Boundary)
```typescript
'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <h2>Something went wrong!</h2>
        <button onClick={reset}>Try again</button>
      </body>
    </html>
  );
}
```

## Testing Strategies

### Unit Testing with Jest
```typescript
// jest.config.ts
import nextJest from 'next/jest';

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testEnvironment: 'jest-environment-jsdom',
};

export default createJestConfig(customJestConfig);
```

### Component Testing
```typescript
import { render, screen } from '@testing-library/react';
import ProductCard from './ProductCard';

describe('ProductCard', () => {
  it('renders product information', () => {
    const product = {
      id: '1',
      name: 'Test Product',
      price: 99.99,
    };
    
    render(<ProductCard product={product} />);
    
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('$99.99')).toBeInTheDocument();
  });
});
```

## Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Production deployment
vercel --prod
```

### Self-Hosted
```dockerfile
# Dockerfile
FROM node:20-alpine AS base

# Dependencies
FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Builder
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Runner
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT=3000

CMD ["node", "server.js"]
```

## Migration Checklist

### Critical Breaking Changes
- [ ] Convert `params` to async: `await params`
- [ ] Convert `searchParams` to async: `await searchParams`
- [ ] Convert `cookies()`, `headers()`, `draftMode()` to async
- [ ] Add second argument to `revalidateTag()`: `revalidateTag(tag, 'max')`
- [ ] Rename `middleware.ts` to `proxy.ts` and export named `proxy` function
- [ ] Add `default.js` to all parallel route slots
- [ ] Update Node.js to 20.9.0+
- [ ] Update TypeScript to 5.1.0+
- [ ] Update browser compatibility targets
- [ ] Remove deprecated AMP support code
- [ ] Replace `serverRuntimeConfig` with environment variables
- [ ] Update `next/image` local src with query strings (add `localPatterns`)
- [ ] Review and update ESLint config for flat config format

### Optional Optimizations
- [ ] Enable `cacheComponents: true` for Cache Components
- [ ] Add `"use cache"` directives to static content
- [ ] Enable `turbopackFileSystemCacheForDev: true`
- [ ] Consider enabling `reactCompiler: true`
- [ ] Update `revalidateTag()` calls to use `updateTag()` in Server Actions
- [ ] Review and optimize image configuration
- [ ] Add error boundaries (`error.tsx`, `not-found.tsx`)
- [ ] Implement proper loading states with Suspense

## Debugging & Development

### Logging Improvements in Next.js 16
```
# Development request logs show timing breakdown
GET /products 200 in 425ms
├─ Compile: 125ms (Routing and compilation)
└─ Render: 300ms (Running your code and React rendering)

# Build logs show step-by-step timing
▲ Next.js 16 (Turbopack)
✓ Compiled successfully in 615ms
✓ Finished TypeScript in 1114ms
✓ Collecting page data in 208ms
✓ Generating static pages in 239ms
✓ Finalizing page optimization in 5ms
```

### Next.js DevTools MCP
- Model Context Protocol integration for AI-assisted debugging
- Unified browser and server logs
- Automatic error access with stack traces
- Page-aware contextual understanding
- See: https://nextjs.org/docs/app/guides/mcp

### Environment Variables
```bash
# .env.local
DATABASE_URL="postgresql://..."
API_KEY="secret"
NEXT_PUBLIC_API_URL="https://api.example.com" # Available in browser
```

```typescript
// Access in Server Components
const apiKey = process.env.API_KEY;

// Access in Client Components (NEXT_PUBLIC_ prefix only)
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
```

## Best Practices Summary

1. **Embrace Explicit Caching**: Use `"use cache"` directive intentionally
2. **Default to Dynamic**: Let code run at request time unless caching is needed
3. **Use Async Patterns**: All params, searchParams, and special functions are async
4. **Leverage Turbopack**: Default bundler provides massive speed improvements
5. **Type Everything**: Use TypeScript for type-safe routes, actions, and APIs
6. **Server-First**: Fetch data in Server Components when possible
7. **Progressive Enhancement**: Start with SSR, add client interactivity strategically
8. **Monitor Performance**: Use build logs and dev timing to identify bottlenecks
9. **Test Thoroughly**: Unit test components, integration test user flows
10. **Deploy Often**: Use Vercel for zero-config deployments or self-host with Docker

## Common Pitfalls to Avoid

1. **Forgetting async/await**: All route params and special functions now require `await`
2. **Using deprecated `revalidateTag(tag)` without profile**: Add second argument
3. **Expecting implicit caching**: Next.js 16 requires explicit `"use cache"` directive
4. **Over-prefetching**: Trust new incremental prefetching behavior
5. **Mixing Server/Client boundaries**: Use `"use client"` and `"use server"` correctly
6. **Ignoring Turbopack warnings**: Address webpack compatibility issues early
7. **Missing parallel route defaults**: All slots need `default.js` files
8. **Local image enumeration**: Configure `localPatterns` for images with query strings
9. **Synchronous headers/cookies**: Always use `await cookies()`, `await headers()`
10. **Not testing migrations**: Use automated codemods and test thoroughly

## Resources

- **Next.js 16 Blog**: https://nextjs.org/blog/next-16
- **Upgrade Guide**: https://nextjs.org/docs/app/guides/upgrading/version-16
- **Documentation**: https://nextjs.org/docs
- **Examples**: https://github.com/vercel/next.js/tree/canary/examples
- **Discord Community**: https://nextjs.org/discord
- **Next.js Conf 2025**: https://nextjs.org/conf

## Support

For questions and issues:
1. Check the [Next.js documentation](https://nextjs.org/docs)
2. Search [GitHub issues](https://github.com/vercel/next.js/issues)
3. Ask in [Discord community](https://nextjs.org/discord)
4. Review [examples repository](https://github.com/vercel/next.js/tree/canary/examples)

---

**Last Updated**: October 2025 (Next.js 16.0)
**Skill Version**: 1.0.0
