# Next.js 16 Examples

Practical examples demonstrating key features and patterns in Next.js 16.

## Table of Contents

1. [Cache Components Examples](#cache-components-examples)
2. [proxy.ts Examples](#proxyts-examples)
3. [Caching API Examples](#caching-api-examples)
4. [Data Fetching Examples](#data-fetching-examples)
5. [Server Actions Examples](#server-actions-examples)
6. [Full Application Examples](#full-application-examples)

---

## Cache Components Examples

### Example 1: Blog with Mixed Static and Dynamic Content

```typescript
// app/blog/[slug]/page.tsx
import { Suspense } from 'react';

type Props = {
  params: Promise<{ slug: string }>;
};

// ✅ Cache the entire page layout
'use cache';
export default async function BlogPost({ params }: Props) {
  const { slug } = await params;
  const post = await getPost(slug);
  
  return (
    <article>
      <h1>{post.title}</h1>
      <p className="text-gray-600">{post.publishedAt}</p>
      
      {/* Static content cached */}
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
      
      {/* Dynamic content not cached */}
      <Suspense fallback={<div>Loading comments...</div>}>
        <Comments postId={post.id} />
      </Suspense>
      
      <Suspense fallback={<div>Loading recommendations...</div>}>
        <RelatedPosts category={post.category} />
      </Suspense>
    </article>
  );
}

// Dynamic component - runs at request time
async function Comments({ postId }: { postId: string }) {
  const comments = await fetchComments(postId);
  return (
    <div>
      <h2>Comments ({comments.length})</h2>
      {comments.map(comment => (
        <div key={comment.id}>{comment.text}</div>
      ))}
    </div>
  );
}

// Cached component
'use cache';
async function RelatedPosts({ category }: { category: string }) {
  const posts = await getRelatedPosts(category);
  return (
    <div>
      <h3>Related Posts</h3>
      {posts.map(post => (
        <a key={post.id} href={`/blog/${post.slug}`}>
          {post.title}
        </a>
      ))}
    </div>
  );
}
```

### Example 2: E-commerce Product Page with PPR

```typescript
// app/products/[id]/page.tsx
import { Suspense } from 'react';

type Props = {
  params: Promise<{ id: string }>;
};

// ✅ Cache static product information
'use cache';
export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const product = await getProduct(id);
  
  return (
    <div className="grid grid-cols-2 gap-8">
      {/* Static: Product images and description */}
      <div>
        <img src={product.imageUrl} alt={product.name} />
      </div>
      
      <div>
        <h1>{product.name}</h1>
        <p>{product.description}</p>
        
        {/* Dynamic: Live inventory and pricing */}
        <Suspense fallback={<PricingSkeleton />}>
          <LivePricing productId={id} />
        </Suspense>
        
        {/* Dynamic: Personalized recommendations */}
        <Suspense fallback={<div>Loading recommendations...</div>}>
          <PersonalizedRecommendations productId={id} />
        </Suspense>
        
        {/* Static: Product specs */}
        <ProductSpecifications specs={product.specs} />
      </div>
    </div>
  );
}

// Dynamic - checks real-time inventory
async function LivePricing({ productId }: { productId: string }) {
  const { price, stock } = await checkInventory(productId);
  
  return (
    <div>
      <p className="text-3xl font-bold">${price}</p>
      <p className="text-sm">
        {stock > 0 ? `${stock} in stock` : 'Out of stock'}
      </p>
    </div>
  );
}

// Dynamic - personalized based on user session
async function PersonalizedRecommendations({ productId }: { productId: string }) {
  const userId = await getUserId(); // Gets session
  const recommendations = await getRecommendations(userId, productId);
  
  return (
    <div>
      <h3>You might also like</h3>
      {recommendations.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

// Cached component
'use cache';
function ProductSpecifications({ specs }: { specs: Record<string, string> }) {
  return (
    <dl>
      {Object.entries(specs).map(([key, value]) => (
        <>
          <dt className="font-semibold">{key}</dt>
          <dd>{value}</dd>
        </>
      ))}
    </dl>
  );
}
```

### Example 3: Dashboard with Cached Layout

```typescript
// app/dashboard/layout.tsx
'use cache';
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen">
      {/* Static sidebar - cached */}
      <Sidebar />
      
      {/* Dynamic content area */}
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}

// app/dashboard/page.tsx
import { Suspense } from 'react';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1>Dashboard</h1>
      
      {/* Each widget loads independently */}
      <div className="grid grid-cols-3 gap-4">
        <Suspense fallback={<WidgetSkeleton />}>
          <RevenueWidget />
        </Suspense>
        
        <Suspense fallback={<WidgetSkeleton />}>
          <UsersWidget />
        </Suspense>
        
        <Suspense fallback={<WidgetSkeleton />}>
          <OrdersWidget />
        </Suspense>
      </div>
      
      <Suspense fallback={<ChartSkeleton />}>
        <RevenueChart />
      </Suspense>
    </div>
  );
}

// Dynamic widgets fetch live data
async function RevenueWidget() {
  const revenue = await fetchTodayRevenue();
  return (
    <div className="p-4 bg-white rounded shadow">
      <h3>Today's Revenue</h3>
      <p className="text-2xl font-bold">${revenue.toFixed(2)}</p>
    </div>
  );
}
```

---

## proxy.ts Examples

### Example 1: Authentication Proxy

```typescript
// proxy.ts
import { NextRequest, NextResponse } from 'next/server';

export default function proxy(request: NextRequest) {
  const token = request.cookies.get('auth-token');
  
  // Protected routes
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }
  
  // Admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const userRole = request.cookies.get('user-role')?.value;
    if (userRole !== 'admin') {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*'],
};
```

### Example 2: Internationalization Proxy

```typescript
// proxy.ts
import { NextRequest, NextResponse } from 'next/server';
import Negotiator from 'negotiator';
import { match } from '@formatjs/intl-localematcher';

const locales = ['en', 'es', 'fr', 'de'];
const defaultLocale = 'en';

function getLocale(request: NextRequest): string {
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));
  
  const languages = new Negotiator({ headers: negotiatorHeaders }).languages();
  return match(languages, locales, defaultLocale);
}

export default function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Check if pathname has locale
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );
  
  if (pathnameHasLocale) return NextResponse.next();
  
  // Redirect if no locale
  const locale = getLocale(request);
  request.nextUrl.pathname = `/${locale}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
```

### Example 3: A/B Testing Proxy

```typescript
// proxy.ts
import { NextRequest, NextResponse } from 'next/server';

export default function proxy(request: NextRequest) {
  // Check for existing variant
  let variant = request.cookies.get('ab-variant')?.value;
  
  if (!variant) {
    // Assign variant randomly
    variant = Math.random() < 0.5 ? 'A' : 'B';
  }
  
  const response = NextResponse.next();
  
  // Set variant cookie (30 days)
  response.cookies.set('ab-variant', variant, {
    maxAge: 60 * 60 * 24 * 30,
  });
  
  // Add variant header for Server Components
  response.headers.set('x-ab-variant', variant);
  
  return response;
}
```

### Example 4: Rate Limiting Proxy

```typescript
// proxy.ts
import { NextRequest, NextResponse } from 'next/server';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL!,
  token: process.env.UPSTASH_REDIS_TOKEN!,
});

const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '10 s'), // 10 requests per 10 seconds
});

export default async function proxy(request: NextRequest) {
  // Rate limit API routes
  if (request.nextUrl.pathname.startsWith('/api')) {
    const ip = request.ip ?? '127.0.0.1';
    const { success, pending, limit, reset, remaining } = await ratelimit.limit(ip);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Too many requests' },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': limit.toString(),
            'X-RateLimit-Remaining': remaining.toString(),
            'X-RateLimit-Reset': reset.toString(),
          },
        }
      );
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
};
```

---

## Caching API Examples

### Example 1: Blog Post with SWR Caching

```typescript
// app/blog/actions.ts
'use server';

import { revalidateTag } from 'next/cache';

export async function publishBlogPost(formData: FormData) {
  const title = formData.get('title') as string;
  const content = formData.get('content') as string;
  
  await db.posts.create({ title, content, published: true });
  
  // ✅ Stale-while-revalidate: users see cached posts immediately
  // while Next.js revalidates in background
  revalidateTag('blog-posts', 'max');
}

// app/blog/page.tsx
'use cache';
export default async function BlogPage() {
  const posts = await fetch('https://api.example.com/posts', {
    next: { tags: ['blog-posts'] },
  }).then(res => res.json());
  
  return <PostList posts={posts} />;
}
```

### Example 2: User Profile with Read-Your-Writes

```typescript
// app/profile/actions.ts
'use server';

import { updateTag } from 'next/cache';

export async function updateProfile(userId: string, data: ProfileData) {
  await db.users.update(userId, data);
  
  // ✅ Read-your-writes: user sees their changes immediately
  updateTag(`user-${userId}`);
  
  return { success: true };
}

// app/profile/[userId]/page.tsx
import { ProfileForm } from './ProfileForm';

type Props = {
  params: Promise<{ userId: string }>;
};

export default async function ProfilePage({ params }: Props) {
  const { userId } = await params;
  
  const user = await fetch(`https://api.example.com/users/${userId}`, {
    next: { tags: [`user-${userId}`] },
  }).then(res => res.json());
  
  return <ProfileForm user={user} />;
}
```

### Example 3: Notification System with refresh()

```typescript
// app/notifications/actions.ts
'use server';

import { refresh } from 'next/cache';

export async function markAsRead(notificationId: string) {
  await db.notifications.update(notificationId, { read: true });
  
  // ✅ Refresh uncached notification count only
  // Cached page content remains fast
  refresh();
}

// app/layout.tsx
import { NotificationBell } from './NotificationBell';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // This count is NOT cached - fetched on every request
  const unreadCount = await getUnreadNotificationCount();
  
  return (
    <html>
      <body>
        <nav>
          <NotificationBell count={unreadCount} />
        </nav>
        {children}
      </body>
    </html>
  );
}
```

### Example 4: E-commerce with Multiple Caching Strategies

```typescript
// app/products/actions.ts
'use server';

import { revalidateTag, updateTag } from 'next/cache';

// For admin updates - background revalidation is fine
export async function updateProductDescription(productId: string, description: string) {
  await db.products.update(productId, { description });
  
  // ✅ SWR: Users see cached product while revalidating
  revalidateTag(`product-${productId}`, 'hours');
}

// For inventory updates - immediate consistency needed
export async function updateInventory(productId: string, quantity: number) {
  await db.inventory.update(productId, { quantity });
  
  // ✅ Immediate: Stock levels must be accurate
  updateTag(`inventory-${productId}`);
}

// For price updates - immediate for users who made the change
export async function updatePrice(productId: string, price: number) {
  await db.products.update(productId, { price });
  
  // ✅ Read-your-writes for admin, SWR for other users
  updateTag(`product-${productId}`);
  revalidateTag('products-list', 'hours');
}
```

---

## Data Fetching Examples

### Example 1: Parallel Data Fetching

```typescript
// app/dashboard/page.tsx
export default async function DashboardPage() {
  // ✅ Fetch data in parallel
  const [user, stats, recentOrders] = await Promise.all([
    getUser(),
    getStats(),
    getRecentOrders(),
  ]);
  
  return (
    <div>
      <UserHeader user={user} />
      <StatsGrid stats={stats} />
      <OrdersTable orders={recentOrders} />
    </div>
  );
}

async function getUser() {
  const res = await fetch('https://api.example.com/user');
  return res.json();
}

async function getStats() {
  const res = await fetch('https://api.example.com/stats', {
    next: { revalidate: 60 }, // Revalidate every minute
  });
  return res.json();
}

async function getRecentOrders() {
  const res = await fetch('https://api.example.com/orders?limit=10', {
    cache: 'no-store', // Always fresh
  });
  return res.json();
}
```

### Example 2: Sequential Data Fetching with Dependencies

```typescript
// app/orders/[id]/page.tsx
type Props = {
  params: Promise<{ id: string }>;
};

export default async function OrderPage({ params }: Props) {
  const { id } = await params;
  
  // ✅ Fetch order first
  const order = await getOrder(id);
  
  // ✅ Then fetch user and products (depends on order data)
  const [user, products] = await Promise.all([
    getUser(order.userId),
    getProducts(order.productIds),
  ]);
  
  return (
    <div>
      <OrderHeader order={order} user={user} />
      <ProductsList products={products} />
    </div>
  );
}
```

### Example 3: Infinite Scroll with Route Handlers

```typescript
// app/api/posts/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const cursor = searchParams.get('cursor');
  const limit = parseInt(searchParams.get('limit') || '10');
  
  const posts = await db.posts.findMany({
    take: limit + 1,
    cursor: cursor ? { id: cursor } : undefined,
    orderBy: { createdAt: 'desc' },
  });
  
  const hasMore = posts.length > limit;
  const data = hasMore ? posts.slice(0, -1) : posts;
  const nextCursor = hasMore ? posts[posts.length - 1].id : null;
  
  return NextResponse.json({
    data,
    nextCursor,
    hasMore,
  });
}

// app/feed/page.tsx
'use client';

import { useInfiniteQuery } from '@tanstack/react-query';

export default function FeedPage() {
  const { data, fetchNextPage, hasNextPage, isFetching } = useInfiniteQuery({
    queryKey: ['posts'],
    queryFn: async ({ pageParam = null }) => {
      const params = new URLSearchParams();
      if (pageParam) params.set('cursor', pageParam);
      params.set('limit', '10');
      
      const res = await fetch(`/api/posts?${params}`);
      return res.json();
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });
  
  return (
    <div>
      {data?.pages.map((page) =>
        page.data.map((post: any) => (
          <PostCard key={post.id} post={post} />
        ))
      )}
      
      {hasNextPage && (
        <button onClick={() => fetchNextPage()} disabled={isFetching}>
          {isFetching ? 'Loading...' : 'Load More'}
        </button>
      )}
    </div>
  );
}
```

---

## Server Actions Examples

### Example 1: Form Submission with Progressive Enhancement

```typescript
// app/contact/actions.ts
'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';

const ContactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

export async function submitContactForm(prevState: any, formData: FormData) {
  try {
    const validatedFields = ContactSchema.parse({
      name: formData.get('name'),
      email: formData.get('email'),
      message: formData.get('message'),
    });
    
    await db.contacts.create(validatedFields);
    await sendEmail(validatedFields);
    
    revalidatePath('/contact');
    
    return { success: true, message: 'Message sent successfully!' };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.flatten().fieldErrors,
      };
    }
    return { success: false, message: 'Something went wrong' };
  }
}

// app/contact/ContactForm.tsx
'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { submitContactForm } from './actions';

function SubmitButton() {
  const { pending } = useFormStatus();
  
  return (
    <button type="submit" disabled={pending}>
      {pending ? 'Sending...' : 'Send Message'}
    </button>
  );
}

export function ContactForm() {
  const [state, formAction] = useFormState(submitContactForm, null);
  
  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label htmlFor="name">Name</label>
        <input
          id="name"
          name="name"
          type="text"
          required
        />
        {state?.errors?.name && (
          <p className="text-red-500">{state.errors.name}</p>
        )}
      </div>
      
      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          required
        />
        {state?.errors?.email && (
          <p className="text-red-500">{state.errors.email}</p>
        )}
      </div>
      
      <div>
        <label htmlFor="message">Message</label>
        <textarea
          id="message"
          name="message"
          required
        />
        {state?.errors?.message && (
          <p className="text-red-500">{state.errors.message}</p>
        )}
      </div>
      
      <SubmitButton />
      
      {state?.success && (
        <p className="text-green-500">{state.message}</p>
      )}
    </form>
  );
}
```

### Example 2: Optimistic Updates

```typescript
// app/todos/actions.ts
'use server';

import { revalidateTag } from 'next/cache';

export async function toggleTodo(id: string, completed: boolean) {
  await db.todos.update(id, { completed });
  revalidateTag('todos', 'max');
}

export async function deleteTodo(id: string) {
  await db.todos.delete(id);
  revalidateTag('todos', 'max');
}

// app/todos/TodoList.tsx
'use client';

import { useOptimistic } from 'react';
import { toggleTodo, deleteTodo } from './actions';

type Todo = {
  id: string;
  title: string;
  completed: boolean;
};

export function TodoList({ todos }: { todos: Todo[] }) {
  const [optimisticTodos, updateOptimisticTodos] = useOptimistic(
    todos,
    (state, { action, id, completed }: any) => {
      if (action === 'toggle') {
        return state.map(todo =>
          todo.id === id ? { ...todo, completed } : todo
        );
      }
      if (action === 'delete') {
        return state.filter(todo => todo.id !== id);
      }
      return state;
    }
  );
  
  const handleToggle = async (id: string, completed: boolean) => {
    updateOptimisticTodos({ action: 'toggle', id, completed: !completed });
    await toggleTodo(id, !completed);
  };
  
  const handleDelete = async (id: string) => {
    updateOptimisticTodos({ action: 'delete', id });
    await deleteTodo(id);
  };
  
  return (
    <ul>
      {optimisticTodos.map(todo => (
        <li key={todo.id} className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => handleToggle(todo.id, todo.completed)}
          />
          <span className={todo.completed ? 'line-through' : ''}>
            {todo.title}
          </span>
          <button onClick={() => handleDelete(todo.id)}>
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
}
```

---

## Full Application Examples

### Example: Social Media Feed Application

```typescript
// app/page.tsx (Home Feed)
import { Suspense } from 'react';
import { FeedSkeleton } from '@/components/FeedSkeleton';

export default function HomePage() {
  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Your Feed</h1>
      
      <Suspense fallback={<FeedSkeleton />}>
        <Feed />
      </Suspense>
    </div>
  );
}

// components/Feed.tsx
async function Feed() {
  const posts = await getPosts();
  
  return (
    <div className="space-y-4">
      {posts.map(post => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}

// components/PostCard.tsx
'use client';

import { useState, useTransition } from 'react';
import { likePost } from '@/app/actions';

export function PostCard({ post }: { post: any }) {
  const [likes, setLikes] = useState(post.likes);
  const [isPending, startTransition] = useTransition();
  
  const handleLike = () => {
    startTransition(async () => {
      setLikes(likes + 1);
      await likePost(post.id);
    });
  };
  
  return (
    <article className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center gap-3 mb-4">
        <img
          src={post.author.avatar}
          alt={post.author.name}
          className="w-10 h-10 rounded-full"
        />
        <div>
          <p className="font-semibold">{post.author.name}</p>
          <p className="text-sm text-gray-500">{post.createdAt}</p>
        </div>
      </div>
      
      <p className="mb-4">{post.content}</p>
      
      {post.image && (
        <img
          src={post.image}
          alt="Post image"
          className="w-full rounded-lg mb-4"
        />
      )}
      
      <button
        onClick={handleLike}
        disabled={isPending}
        className="flex items-center gap-2"
      >
        ❤️ {likes}
      </button>
    </article>
  );
}

// app/actions.ts
'use server';

import { revalidateTag } from 'next/cache';

export async function likePost(postId: string) {
  await db.posts.increment(postId, 'likes');
  revalidateTag('posts', 'max');
}

export async function createPost(formData: FormData) {
  const content = formData.get('content') as string;
  const userId = await getUserId();
  
  await db.posts.create({
    content,
    authorId: userId,
    likes: 0,
  });
  
  revalidateTag('posts', 'max');
}

// lib/data.ts
'use cache';
export async function getPosts() {
  const res = await fetch('https://api.example.com/posts', {
    next: { tags: ['posts'] },
  });
  return res.json();
}
```

### Example: Real-Time Analytics Dashboard

```typescript
// app/analytics/page.tsx
import { Suspense } from 'react';

export default function AnalyticsPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Analytics Dashboard</h1>
      
      <div className="grid grid-cols-4 gap-4 mb-8">
        <Suspense fallback={<MetricSkeleton />}>
          <PageViewsMetric />
        </Suspense>
        
        <Suspense fallback={<MetricSkeleton />}>
          <UniqueVisitorsMetric />
        </Suspense>
        
        <Suspense fallback={<MetricSkeleton />}>
          <BounceRateMetric />
        </Suspense>
        
        <Suspense fallback={<MetricSkeleton />}>
          <AvgSessionMetric />
        </Suspense>
      </div>
      
      <Suspense fallback={<ChartSkeleton />}>
        <TrafficChart />
      </Suspense>
    </div>
  );
}

// Dynamic metrics - always fresh
async function PageViewsMetric() {
  const { count, change } = await getMetric('pageviews');
  
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-sm text-gray-600">Page Views</h3>
      <p className="text-3xl font-bold">{count.toLocaleString()}</p>
      <p className={`text-sm ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
        {change > 0 ? '↑' : '↓'} {Math.abs(change)}% vs last period
      </p>
    </div>
  );
}

async function getMetric(type: string) {
  // Fetch always-fresh data
  const res = await fetch(`https://api.example.com/metrics/${type}`, {
    cache: 'no-store',
  });
  return res.json();
}

// Cached chart data with hourly revalidation
'use cache';
async function TrafficChart() {
  const data = await fetch('https://api.example.com/traffic', {
    next: { revalidate: 3600, tags: ['traffic-chart'] },
  }).then(res => res.json());
  
  return <LineChart data={data} />;
}
```

---

## Migration Examples

### Before and After: Async Params

```typescript
// ❌ Before (Next.js 15)
export default function ProductPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { variant?: string };
}) {
  return (
    <div>
      Product ID: {params.id}
      Variant: {searchParams.variant}
    </div>
  );
}

// ✅ After (Next.js 16)
export default async function ProductPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ variant?: string }>;
}) {
  const { id } = await params;
  const { variant } = await searchParams;
  
  return (
    <div>
      Product ID: {id}
      Variant: {variant}
    </div>
  );
}
```

### Before and After: revalidateTag()

```typescript
// ❌ Before (Next.js 15)
'use server';

export async function updatePost(id: string, data: any) {
  await db.posts.update(id, data);
  revalidateTag('blog-posts');
}

// ✅ After (Next.js 16) - SWR pattern
'use server';

export async function updatePost(id: string, data: any) {
  await db.posts.update(id, data);
  revalidateTag('blog-posts', 'max'); // Add cacheLife profile
}

// ✅ After (Next.js 16) - Read-your-writes pattern
'use server';

export async function updatePost(id: string, data: any) {
  await db.posts.update(id, data);
  updateTag('blog-posts'); // Use updateTag for immediate consistency
}
```

---

**More examples and patterns available in the [Next.js examples repository](https://github.com/vercel/next.js/tree/canary/examples).**
