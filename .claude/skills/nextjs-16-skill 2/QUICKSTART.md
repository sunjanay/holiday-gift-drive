# Next.js 16 Skill - Quick Start Guide

Welcome! This guide will get you up and running with Next.js 16 in minutes.

## 📁 What You Have

Your Next.js 16 skill includes:

```
nextjs-16-skill/
├── SKILL.md              ⭐ START HERE - Complete documentation
├── examples.md           📝 Real-world code examples
├── reference.md          📚 Technical reference & migration
├── README.md            📖 Skill overview
├── templates/           🎨 Ready-to-use code templates
│   ├── page-template.tsx
│   ├── route-handler-template.ts
│   ├── server-actions-template.ts
│   ├── cached-component-template.tsx
│   └── proxy-template.ts
└── scripts/             🛠️ Helper utilities
    ├── migration-checker.py
    ├── config-generator.js
    └── README.md
```

## 🚀 New Project (5 Minutes)

### 1. Create Next.js 16 App

```bash
npx create-next-app@latest my-app
cd my-app
```

### 2. Generate Config

```bash
# Copy the config generator
cp ../nextjs-16-skill/scripts/config-generator.js .

# Run it
node config-generator.js
```

### 3. Add a Page with Cache Components

```bash
# Copy page template
mkdir -p app/products/[id]
cp ../nextjs-16-skill/templates/cached-component-template.tsx app/products/[id]/page.tsx
```

### 4. Add Server Actions

```bash
# Copy server actions template
cp ../nextjs-16-skill/templates/server-actions-template.ts app/actions.ts
```

### 5. Configure Network Boundary

```bash
# Copy proxy template
cp ../nextjs-16-skill/templates/proxy-template.ts proxy.ts
```

### 6. Start Development

```bash
npm run dev
```

Visit http://localhost:3000 - You're running Next.js 16! 🎉

## 🔄 Migrating Existing Project (15 Minutes)

### 1. Check Current Project

```bash
# Run migration checker
python ../nextjs-16-skill/scripts/migration-checker.py /path/to/your/project
```

### 2. Automated Migration

```bash
cd /path/to/your/project
npx @next/codemod@canary upgrade latest
```

### 3. Manual Fixes

Review the migration checker output and fix any remaining issues:

- ✓ Make `params` and `searchParams` async
- ✓ Make `cookies()`, `headers()`, `draftMode()` async
- ✓ Update `revalidateTag()` with second argument
- ✓ Rename `middleware.ts` → `proxy.ts`
- ✓ Add `default.js` to parallel routes

### 4. Test

```bash
npm run dev
npm run build
```

## 📚 Learn by Example

### Cache Components Pattern

```typescript
// Static shell - cached
'use cache';
export default async function Page() {
  return (
    <div>
      <h1>Static Header</h1>
      {/* Dynamic content */}
      <Suspense fallback={<Loading />}>
        <DynamicData />
      </Suspense>
    </div>
  );
}

// Dynamic component - NOT cached
async function DynamicData() {
  const data = await fetchLiveData();
  return <div>{data}</div>;
}
```

### New Caching APIs

```typescript
'use server';

import { revalidateTag, updateTag, refresh } from 'next/cache';

// Stale-while-revalidate (background revalidation)
export async function updatePost(id: string, data: any) {
  await db.posts.update(id, data);
  revalidateTag('blog-posts', 'max');
}

// Read-your-writes (immediate consistency)
export async function updateProfile(userId: string, data: any) {
  await db.users.update(userId, data);
  updateTag(`user-${userId}`);
}

// Refresh uncached data only
export async function markAsRead(notificationId: string) {
  await db.notifications.update(notificationId, { read: true });
  refresh();
}
```

### Async Parameters

```typescript
// ALL route parameters are now async
export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ sort?: string }>;
}) {
  const { slug } = await params;
  const { sort } = await searchParams;
  
  return <div>{slug} - {sort}</div>;
}
```

### proxy.ts (Network Boundary)

```typescript
// proxy.ts - replaces middleware.ts
export default function proxy(request: NextRequest) {
  // Authentication
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    const token = request.cookies.get('auth-token');
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }
  
  return NextResponse.next();
}
```

## 🎯 Common Tasks

### Add Caching to Existing Page

```typescript
// Before (no caching)
export default async function Page() {
  const data = await getData();
  return <div>{data}</div>;
}

// After (with caching)
'use cache';
export default async function Page() {
  const data = await getData();
  return <div>{data}</div>;
}
```

### Create API Route

```bash
# Copy template
mkdir -p app/api/products
cp templates/route-handler-template.ts app/api/products/route.ts

# Edit to add your logic
```

### Add Form with Server Actions

```bash
# Copy template
cp templates/server-actions-template.ts app/actions.ts

# Import in your form component
```

## 📖 Full Documentation

For complete details, open these files:

1. **SKILL.md** - Core concepts, patterns, best practices
2. **examples.md** - Full application examples
3. **reference.md** - API reference, migration guide
4. **templates/** - Copy-paste ready templates
5. **scripts/** - Helper tools

## 🎓 Learning Path

### Day 1: Basics
- Read SKILL.md sections 1-5
- Try the "use cache" directive
- Update params to async

### Day 2: Caching
- Read SKILL.md sections on caching
- Try revalidateTag, updateTag, refresh
- Implement PPR pattern

### Day 3: Advanced
- Set up proxy.ts
- Add Server Actions
- Configure Turbopack optimizations

## 💡 Tips

1. **Start simple** - Add "use cache" to one page at a time
2. **Use templates** - Don't reinvent common patterns
3. **Run migration checker** - Catch issues before they bite
4. **Read examples** - See patterns in context
5. **Test incrementally** - Verify each change works

## 🆘 Need Help?

1. **Check reference.md** - Troubleshooting section
2. **Review examples.md** - Similar patterns
3. **Run migration-checker.py** - Diagnostic help
4. **Next.js Discord** - https://nextjs.org/discord
5. **GitHub Issues** - https://github.com/vercel/next.js/issues

## 🎉 You're Ready!

You now have everything needed to build amazing Next.js 16 applications:

✅ Complete documentation  
✅ Practical examples  
✅ Ready-to-use templates  
✅ Helper scripts  
✅ Migration guide  

Start building! 🚀

---

**Next Steps:**
1. Open SKILL.md
2. Copy a template
3. Start coding

**Happy building with Next.js 16!** 🎈
