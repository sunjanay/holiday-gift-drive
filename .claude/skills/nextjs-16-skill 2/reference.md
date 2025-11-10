# Next.js 16 Technical Reference

Comprehensive technical documentation, migration guides, and API references for Next.js 16.

## Table of Contents

1. [Breaking Changes](#breaking-changes)
2. [Migration Guide](#migration-guide)
3. [API Reference](#api-reference)
4. [Configuration Reference](#configuration-reference)
5. [Performance Optimization](#performance-optimization)
6. [TypeScript Reference](#typescript-reference)
7. [Troubleshooting](#troubleshooting)

---

## Breaking Changes

### Version Requirements

| Requirement | Minimum Version | Notes |
|------------|-----------------|-------|
| Node.js | 20.9.0+ | Node.js 18 no longer supported |
| TypeScript | 5.1.0+ | Required for type safety |
| Chrome | 111+ | Modern browser support |
| Edge | 111+ | Modern browser support |
| Firefox | 111+ | Modern browser support |
| Safari | 16.4+ | Modern browser support |

### Async APIs (Breaking)

All previously synchronous APIs are now async:

```typescript
// ❌ Old - Synchronous
import { cookies, headers, draftMode } from 'next/headers';

const cookieStore = cookies();
const headersList = headers();
const draft = draftMode();

// ✅ New - Async (REQUIRED)
import { cookies, headers, draftMode } from 'next/headers';

const cookieStore = await cookies();
const headersList = await headers();
const draft = await draftMode();
```

### Route Parameters (Breaking)

```typescript
// ❌ Old
type PageProps = {
  params: { id: string };
  searchParams: { query: string };
};

export default function Page({ params, searchParams }: PageProps) {
  return <div>{params.id} - {searchParams.query}</div>;
}

// ✅ New
type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ query: string }>;
};

export default async function Page({ params, searchParams }: PageProps) {
  const { id } = await params;
  const { query } = await searchParams;
  return <div>{id} - {query}</div>;
}
```

### Metadata Image Routes (Breaking)

```typescript
// ❌ Old
export default function Image({ params }: { params: { id: string } }) {
  return new ImageResponse(<div>{params.id}</div>);
}

export async function generateImageMetadata({ params }: { params: { id: string } }) {
  return [{ id: params.id }];
}

// ✅ New
export default async function Image({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return new ImageResponse(<div>{id}</div>);
}

export async function generateImageMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return [{ id }];
}
```

### Parallel Routes (Breaking)

All parallel route slots now require explicit `default.js`:

```typescript
// app/@modal/default.tsx (REQUIRED)
export default function Default() {
  return null; // or notFound()
}

// Or call notFound() if you want 404 behavior
import { notFound } from 'next/navigation';

export default function Default() {
  return notFound();
}
```

### Removed Features

| Removed Feature | Replacement |
|----------------|-------------|
| AMP support | No replacement - removed completely |
| `next lint` command | Use `eslint` CLI directly |
| `useAmp()` hook | No replacement |
| `export const config = { amp: true }` | No replacement |
| `serverRuntimeConfig` | Use environment variables |
| `publicRuntimeConfig` | Use `NEXT_PUBLIC_*` env vars |
| `devIndicators.appIsrStatus` | No replacement |
| `devIndicators.buildActivity` | No replacement |
| `experimental.ppr` flag | Use `cacheComponents: true` |
| `experimental.dynamicIO` | Renamed to `cacheComponents` |
| `unstable_rootParams()` | TBD - alternative coming |
| Automatic `scroll-behavior: smooth` | Opt-in with `data-scroll-behavior="smooth"` |

### Behavior Changes

#### Default Bundler
- **Old**: webpack
- **New**: Turbopack
- **Opt-out**: `next dev --webpack` and `next build --webpack`

#### Image Optimization
```typescript
// Changed defaults
images: {
  minimumCacheTTL: 14400, // Was 60 seconds, now 4 hours
  imageSizes: [32, 48, 64, 96, 128, 256, 384], // Removed 16
  qualities: [75], // Was [1..100], now simplified
  dangerouslyAllowLocalIP: false, // Security default
  maximumRedirects: 3, // Was unlimited
}
```

#### Local Images with Query Strings
```typescript
// ❌ Old - Security vulnerability
<Image src="/image.jpg?size=large" alt="Image" />

// ✅ New - Requires explicit pattern
// next.config.ts
images: {
  localPatterns: [
    {
      pathname: '/assets/**',
      search: '', // Explicitly allow patterns
    },
  ],
}
```

#### revalidateTag() Signature
```typescript
// ❌ Old
revalidateTag('my-tag');

// ✅ New - Requires cacheLife profile
revalidateTag('my-tag', 'max');
revalidateTag('my-tag', 'hours');
revalidateTag('my-tag', { revalidate: 3600 });

// ✅ Alternative - Use updateTag() in Server Actions
updateTag('my-tag');
```

### Deprecations (Will be removed in future)

| Deprecated Feature | Replacement |
|-------------------|-------------|
| `middleware.ts` | Rename to `proxy.ts` |
| `next/legacy/image` | Use `next/image` |
| `images.domains` | Use `images.remotePatterns` |
| Single-arg `revalidateTag()` | Use `revalidateTag(tag, profile)` or `updateTag(tag)` |

---

## Migration Guide

### Automated Migration

```bash
# Use codemod for automatic migration
npx @next/codemod@canary upgrade latest

# This will:
# - Update package.json dependencies
# - Migrate async params/searchParams
# - Update middleware to proxy
# - Add default.js to parallel routes
# - Update revalidateTag() calls
```

### Manual Migration Steps

#### Step 1: Update Dependencies

```bash
npm install next@latest react@latest react-dom@latest
npm install -D @types/node@latest @types/react@latest
```

#### Step 2: Update Node.js Version

Ensure Node.js 20.9.0+ is installed:

```bash
node --version  # Should be 20.9.0 or higher
```

Update `.nvmrc` if using nvm:
```
20.9.0
```

#### Step 3: Convert Synchronous APIs to Async

Find and replace pattern:
```bash
# Search for synchronous usage
rg "cookies\(\)" --type ts --type tsx
rg "headers\(\)" --type ts --type tsx
rg "draftMode\(\)" --type ts --type tsx
```

Update each occurrence:
```typescript
// Before
const cookieStore = cookies();

// After
const cookieStore = await cookies();
```

#### Step 4: Update Route Parameters

```typescript
// Search pattern: params: { ... }
// Replace with: params: Promise<{ ... }>

// Add async to function signature
export default async function Page({ params }: PageProps) {
  const resolvedParams = await params;
  // Use resolvedParams
}
```

#### Step 5: Rename middleware.ts to proxy.ts

```bash
# Rename file
mv middleware.ts proxy.ts

# Update export
# Before: export function middleware(request) { ... }
# After: export default function proxy(request) { ... }
```

#### Step 6: Add default.js to Parallel Routes

```bash
# Find all parallel routes
find app -type d -name "@*"

# Add default.js to each
cat > app/@modal/default.tsx << 'EOF'
export default function Default() {
  return null;
}
EOF
```

#### Step 7: Update revalidateTag() Calls

```bash
# Find all revalidateTag calls
rg "revalidateTag\(" --type ts --type tsx

# Update each:
# Before: revalidateTag('tag')
# After: revalidateTag('tag', 'max')
```

#### Step 8: Update Image Configuration

```typescript
// next.config.ts
const nextConfig = {
  images: {
    // Update if using local images with query strings
    localPatterns: [
      {
        pathname: '/assets/**',
        search: '',
      },
    ],
    
    // Migrate domains to remotePatterns
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'example.com',
        // Optional: pathname, port
      },
    ],
  },
};
```

#### Step 9: Remove Deprecated Features

```bash
# Remove AMP-related code
rg "useAmp|amp:" --type ts --type tsx

# Remove runtime config
# Delete serverRuntimeConfig and publicRuntimeConfig from next.config

# Update ESLint to use CLI instead of next lint
# package.json
{
  "scripts": {
    "lint": "eslint .",  // Changed from "next lint"
  }
}
```

#### Step 10: Test Migration

```bash
# Run development server
npm run dev

# Check for errors in console
# Test critical user paths
# Run test suite
npm test

# Build for production
npm run build

# Test production build locally
npm start
```

### Migration Checklist

```markdown
## Pre-Migration
- [ ] Backup project (git commit/push)
- [ ] Review Next.js 16 changelog
- [ ] Check custom webpack config compatibility
- [ ] Audit third-party dependencies

## Migration
- [ ] Update Node.js to 20.9.0+
- [ ] Update Next.js to 16.x
- [ ] Update React to 19.2+
- [ ] Convert cookies/headers/draftMode to async
- [ ] Convert params/searchParams to async
- [ ] Rename middleware.ts → proxy.ts
- [ ] Add default.js to parallel routes
- [ ] Update revalidateTag() calls
- [ ] Update image configuration
- [ ] Remove AMP code
- [ ] Update ESLint configuration

## Testing
- [ ] Run automated tests
- [ ] Test critical user flows
- [ ] Check console for warnings
- [ ] Test on multiple browsers
- [ ] Performance audit (Lighthouse)
- [ ] Check bundle size
- [ ] Test production build locally

## Post-Migration
- [ ] Update CI/CD pipelines
- [ ] Update deployment scripts
- [ ] Update documentation
- [ ] Monitor error tracking
- [ ] Review performance metrics
```

---

## API Reference

### Cache Components

#### "use cache" Directive

```typescript
// File-level caching
'use cache';
export default async function Page() { ... }

// Component-level caching
'use cache';
export async function Component() { ... }

// Function-level caching
'use cache';
export async function getData() { ... }
```

**Configuration:**
```typescript
// next.config.ts
const nextConfig = {
  cacheComponents: true,
};
```

### Caching Functions

#### revalidateTag(tag, profile)

Invalidate cache with stale-while-revalidate behavior.

```typescript
import { revalidateTag } from 'next/cache';

// With built-in profiles
revalidateTag('blog-posts', 'max');      // Long-lived content
revalidateTag('news', 'hours');          // Medium-lived content
revalidateTag('analytics', 'days');      // Short-lived content

// With custom revalidation time
revalidateTag('products', { revalidate: 3600 });

// With custom profile (defined in next.config.ts)
revalidateTag('data', 'custom-profile');
```

**Built-in Profiles:**
- `'max'`: Maximum cache duration (recommended for most cases)
- `'hours'`: Hourly revalidation
- `'days'`: Daily revalidation

**Custom Profiles:**
```typescript
// next.config.ts
const nextConfig = {
  cacheLife: {
    'custom-profile': {
      revalidate: 7200, // 2 hours
      expire: 14400,    // 4 hours
    },
  },
};
```

#### updateTag(tag)

Immediately expire and revalidate cache (Server Actions only).

```typescript
'use server';

import { updateTag } from 'next/cache';

export async function updateData() {
  await db.data.update(...);
  updateTag('my-data'); // Immediate consistency
}
```

**When to use:**
- Forms that need immediate feedback
- User settings updates
- Any action requiring read-your-writes semantics

#### refresh()

Refresh uncached data only (Server Actions only).

```typescript
'use server';

import { refresh } from 'next/cache';

export async function markNotificationAsRead(id: string) {
  await db.notifications.update(id, { read: true });
  refresh(); // Refresh uncached notification count
}
```

**When to use:**
- Updating live counters
- Refreshing dynamic widgets
- Updating real-time data without touching cache

#### revalidatePath(path)

Revalidate all data for a specific path.

```typescript
import { revalidatePath } from 'next/cache';

revalidatePath('/blog');           // Single path
revalidatePath('/blog', 'page');   // Single page
revalidatePath('/blog', 'layout'); // Layout and nested pages
```

### Headers and Cookies

#### cookies()

```typescript
import { cookies } from 'next/headers';

// ✅ Must be async
const cookieStore = await cookies();

// Get cookie
const value = cookieStore.get('name');

// Set cookie
cookieStore.set('name', 'value', {
  httpOnly: true,
  secure: true,
  sameSite: 'strict',
  maxAge: 60 * 60 * 24 * 7, // 1 week
});

// Delete cookie
cookieStore.delete('name');

// Get all cookies
const all = cookieStore.getAll();
```

#### headers()

```typescript
import { headers } from 'next/headers';

// ✅ Must be async
const headersList = await headers();

// Get header
const userAgent = headersList.get('user-agent');

// Get all headers
const allHeaders = Object.fromEntries(headersList.entries());
```

#### draftMode()

```typescript
import { draftMode } from 'next/headers';

// ✅ Must be async
const { isEnabled } = await draftMode();

if (isEnabled) {
  // Show draft content
}
```

### Routing Functions

#### redirect()

```typescript
import { redirect } from 'next/navigation';

export default async function Page() {
  const session = await getSession();
  
  if (!session) {
    redirect('/login');
  }
  
  return <Dashboard />;
}
```

#### notFound()

```typescript
import { notFound } from 'next/navigation';

export default async function Page({ params }: Props) {
  const { id } = await params;
  const post = await getPost(id);
  
  if (!post) {
    notFound(); // Renders closest not-found.tsx
  }
  
  return <Post post={post} />;
}
```

#### permanentRedirect()

```typescript
import { permanentRedirect } from 'next/navigation';

export default async function OldPage() {
  permanentRedirect('/new-page'); // 308 redirect
}
```

### Metadata API

#### generateMetadata()

```typescript
import type { Metadata } from 'next';

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);
  
  return {
    title: product.title,
    description: product.description,
    openGraph: {
      title: product.title,
      description: product.description,
      images: [product.image],
    },
    twitter: {
      card: 'summary_large_image',
      title: product.title,
      description: product.description,
      images: [product.image],
    },
  };
}
```

#### generateStaticParams()

```typescript
export async function generateStaticParams() {
  const posts = await getPosts();
  
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

// With multiple dynamic segments
export async function generateStaticParams() {
  const categories = await getCategories();
  
  return categories.flatMap((category) =>
    category.posts.map((post) => ({
      category: category.slug,
      slug: post.slug,
    }))
  );
}
```

---

## Configuration Reference

### next.config.ts Complete Example

```typescript
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Cache Components
  cacheComponents: true,
  
  // Custom cache profiles
  cacheLife: {
    'blog': {
      revalidate: 3600,  // 1 hour
      expire: 7200,      // 2 hours
    },
    'products': {
      revalidate: 1800,  // 30 minutes
      expire: 3600,      // 1 hour
    },
  },
  
  // Turbopack
  experimental: {
    turbopackFileSystemCacheForDev: true,
    
    // Build Adapters
    adapterPath: require.resolve('./adapter.js'),
  },
  
  // React Compiler
  reactCompiler: true,
  
  // Images
  images: {
    minimumCacheTTL: 14400,
    imageSizes: [32, 48, 64, 96, 128, 256, 384],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    qualities: [75],
    formats: ['image/webp'],
    dangerouslyAllowLocalIP: false,
    maximumRedirects: 3,
    
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.example.com',
        port: '',
        pathname: '/images/**',
      },
    ],
    
    localPatterns: [
      {
        pathname: '/assets/**',
        search: '',
      },
    ],
  },
  
  // Headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ];
  },
  
  // Redirects
  async redirects() {
    return [
      {
        source: '/old-path',
        destination: '/new-path',
        permanent: true,
      },
    ];
  },
  
  // Rewrites
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://api.example.com/:path*',
      },
    ];
  },
  
  // TypeScript
  typescript: {
    ignoreBuildErrors: false,
  },
  
  // ESLint
  eslint: {
    ignoreDuringBuilds: false,
    dirs: ['app', 'components', 'lib'],
  },
  
  // Environment variables
  env: {
    CUSTOM_KEY: 'value',
  },
  
  // Output
  output: 'standalone', // For Docker deployments
  
  // Compiler options
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Page extensions
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
  
  // PoweredByHeader
  poweredByHeader: false,
  
  // Compression
  compress: true,
  
  // Generate ETags
  generateEtags: true,
  
  // Internationalization
  i18n: {
    locales: ['en', 'es', 'fr'],
    defaultLocale: 'en',
  },
};

export default nextConfig;
```

### Environment Variables

```bash
# .env.local

# Database
DATABASE_URL="postgresql://user:pass@localhost:5432/db"

# API Keys (server-only)
API_KEY="secret-key"
STRIPE_SECRET_KEY="sk_test_..."

# Public variables (available in browser)
NEXT_PUBLIC_API_URL="https://api.example.com"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."

# Next.js specific
ANALYZE=true # Enable bundle analyzer
```

**Loading order:**
1. `process.env`
2. `.env.$(NODE_ENV).local`
3. `.env.local` (not loaded in test)
4. `.env.$(NODE_ENV)`
5. `.env`

---

## Performance Optimization

### Turbopack Optimization

```typescript
// Enable file system caching
const nextConfig = {
  experimental: {
    turbopackFileSystemCacheForDev: true,
  },
};
```

**Cache location:**
- Development: `.next/cache/turbopack`
- Production: `.next/cache`

**Clear cache:**
```bash
rm -rf .next/cache
```

### React Compiler

```typescript
const nextConfig = {
  reactCompiler: true,
};

// Install plugin
// npm install babel-plugin-react-compiler@latest
```

**Trade-offs:**
- ✅ Automatic memoization
- ✅ Reduced re-renders
- ⚠️ Slower compile times
- ⚠️ Requires Babel

### Bundle Analysis

```bash
npm install -D @next/bundle-analyzer
```

```typescript
// next.config.ts
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer(nextConfig);
```

```bash
ANALYZE=true npm run build
```

### Code Splitting

```typescript
// Dynamic imports
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <p>Loading...</p>,
  ssr: false, // Disable SSR for this component
});
```

### Image Optimization

```typescript
import Image from 'next/image';

// Use priority for above-the-fold images
<Image src="/hero.jpg" priority />

// Use blur placeholder for perceived performance
<Image src={staticImage} placeholder="blur" />

// Optimize quality
<Image src="/photo.jpg" quality={75} />

// Use responsive sizes
<Image
  src="/hero.jpg"
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
/>
```

---

## TypeScript Reference

### Type-Safe Route Parameters

```typescript
// Define types for route params
type PageParams = {
  params: Promise<{
    slug: string;
    category: string;
  }>;
  searchParams: Promise<{
    sort?: 'asc' | 'desc';
    page?: string;
  }>;
};

export default async function Page({ params, searchParams }: PageParams) {
  const { slug, category } = await params;
  const { sort = 'asc', page = '1' } = await searchParams;
  
  return <div>{slug}</div>;
}
```

### Type-Safe Metadata

```typescript
import type { Metadata, ResolvingMetadata } from 'next';

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);
  
  // Merge with parent metadata
  const previousImages = (await parent).openGraph?.images || [];
  
  return {
    title: product.title,
    openGraph: {
      images: [product.image, ...previousImages],
    },
  };
}
```

### Type-Safe Server Actions

```typescript
'use server';

import { z } from 'zod';

const FormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

type FormState = {
  errors?: {
    email?: string[];
    password?: string[];
  };
  message?: string;
};

export async function signup(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = FormSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });
  
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  
  // Process signup
  return { message: 'Success' };
}
```

### Type-Safe Route Handlers

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const ProductSchema = z.object({
  name: z.string(),
  price: z.number().positive(),
});

type Product = z.infer<typeof ProductSchema>;

export async function POST(request: NextRequest): Promise<NextResponse<Product | { error: string }>> {
  try {
    const body = await request.json();
    const product = ProductSchema.parse(body);
    
    const created = await db.products.create(product);
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Internal error' },
      { status: 500 }
    );
  }
}
```

---

## Troubleshooting

### Common Issues

#### 1. "Cannot find module 'next/headers'"

**Cause:** Not using async/await with headers/cookies.

**Solution:**
```typescript
// ❌ Wrong
const cookieStore = cookies();

// ✅ Correct
const cookieStore = await cookies();
```

#### 2. "params is a Promise but was not awaited"

**Cause:** Accessing params synchronously.

**Solution:**
```typescript
// ❌ Wrong
export default function Page({ params }: { params: { id: string } }) {
  return <div>{params.id}</div>;
}

// ✅ Correct
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <div>{id}</div>;
}
```

#### 3. "revalidateTag requires a second argument"

**Cause:** Using old single-argument signature.

**Solution:**
```typescript
// ❌ Wrong
revalidateTag('my-tag');

// ✅ Correct
revalidateTag('my-tag', 'max');
// or
updateTag('my-tag'); // in Server Actions
```

#### 4. Turbopack Build Failures

**Cause:** Incompatible webpack plugins or loaders.

**Solution:**
```bash
# Temporarily opt out
next build --webpack

# Or disable specific features
const nextConfig = {
  webpack: (config) => {
    // Custom webpack config
    return config;
  },
};
```

#### 5. "Parallel route missing default.js"

**Cause:** All parallel routes require default.js in Next.js 16.

**Solution:**
```typescript
// app/@modal/default.tsx
export default function Default() {
  return null;
}
```

### Debug Mode

```bash
# Enable debug logging
DEBUG=* npm run dev

# Next.js specific
DEBUG=next:* npm run dev

# Turbopack specific
DEBUG=turbopack:* npm run dev
```

### Performance Debugging

```typescript
// Enable React DevTools Profiler
const nextConfig = {
  reactStrictMode: true,
  compiler: {
    reactRemoveProperties: false,
  },
};
```

### Build Analysis

```bash
# Check build output
npm run build -- --debug

# Analyze bundle
ANALYZE=true npm run build

# Check cache
ls -lh .next/cache
```

---

## Additional Resources

- **Official Documentation**: https://nextjs.org/docs
- **Upgrade Guide**: https://nextjs.org/docs/app/guides/upgrading/version-16
- **API Reference**: https://nextjs.org/docs/app/api-reference
- **Examples**: https://github.com/vercel/next.js/tree/canary/examples
- **Community Discord**: https://nextjs.org/discord
- **GitHub Discussions**: https://github.com/vercel/next.js/discussions

---

**Last Updated**: October 2025 (Next.js 16.0)
