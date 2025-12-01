---
name: supabase
description: Use when working with Supabase - database, authentication, storage, edge functions, realtime, and serverless PostgreSQL
---

# Supabase Skill

Comprehensive assistance with Supabase development, including database operations, authentication, storage, edge functions, realtime subscriptions, and serverless PostgreSQL.

## When to Use This Skill

Trigger this skill when:
- **Setting up a Supabase project** - Initializing projects, configuring clients, environment variables
- **Database operations** - Querying data, implementing RLS policies, migrations, foreign keys
- **Authentication** - User signup/login, OAuth providers, JWT handling, session management, redirect URLs
- **Storage operations** - File uploads, bucket management, public/private access
- **Edge Functions** - Serverless functions, Deno runtime, webhooks, integrating with APIs
- **Realtime features** - Live data subscriptions, presence, broadcast channels
- **Local development** - Using Supabase CLI, Docker containers, development workflows
- **Debugging Supabase code** - RLS issues, auth errors, connection problems
- **Learning Supabase best practices** - Security patterns, performance optimization

## Key Concepts

### Core Architecture
- **Supabase Client**: Auto-generated REST API from your database schema
- **Row Level Security (RLS)**: Postgres-level security policies that control data access
- **Service Role Key**: Bypasses RLS for admin operations (keep secret!)
- **Anon Key**: Public key for client-side operations (respects RLS)
- **Edge Functions**: Deno-based serverless functions deployed globally

### Authentication Flow
- **JWT Tokens**: Passed via `Authorization: Bearer <token>` header
- **Auth Context**: Set per-request in Edge Functions to enforce RLS
- **Session Management**: Handled by client library with automatic refresh
- **Redirect URLs**: Whitelist URLs for OAuth callbacks and magic links

### Database Patterns
- **PostgREST**: Auto-generated REST API from your Postgres schema
- **RLS Policies**: Define who can `SELECT`, `INSERT`, `UPDATE`, `DELETE` on tables
- **Migrations**: Track schema changes in `supabase/migrations/` directory
- **Foreign Keys**: Maintain referential integrity between tables

## Quick Reference

### Example 1: Create Supabase Client (Next.js Server Component)

```typescript
// utils/supabase/server.ts
import { createClient } from '@supabase/supabase-js'

export function createSupabaseClient(req: Request) {
  return createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
      global: {
        headers: { Authorization: req.headers.get('Authorization')! },
      },
    }
  )
}
```

**Description:** Creates a Supabase client with the user's auth context, automatically enforcing Row Level Security policies.

---

### Example 2: Query Data with RLS

```typescript
// app/profiles/page.tsx
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!,
  {
    global: {
      headers: { Authorization: req.headers.get('Authorization')! },
    },
  }
)

// This query respects RLS - users only see rows they have access to
const { data, error } = await supabase.from('profiles').select('*')

if (error) {
  return new Response('Database error', { status: 500 })
}
```

**Description:** Queries the `profiles` table with RLS enforcement. Only returns rows the authenticated user has permission to access.

---

### Example 3: Get Authenticated User from JWT

```typescript
// Edge Function
Deno.serve(async (req: Request) => {
  const authHeader = req.headers.get('Authorization')!
  const token = authHeader.replace('Bearer ', '')

  const { data } = await supabaseClient.auth.getUser(token)
  const user = data.user

  // Use user metadata for business logic
  console.log(`User ${user.email} made request`)
})
```

**Description:** Extracts JWT from Authorization header and retrieves user metadata. Essential for user-specific operations in Edge Functions.

---

### Example 4: Environment Variables Setup

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://xyzcompany.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Description:** Required environment variables for Supabase integration. Get these from your project dashboard at `Settings > API`.

---

### Example 5: OAuth Sign-In with Dynamic Redirect

```javascript
const getURL = () => {
  let url =
    process?.env?.NEXT_PUBLIC_SITE_URL ?? // Set this to your site URL in production
    process?.env?.NEXT_PUBLIC_VERCEL_URL ?? // Automatically set by Vercel
    'http://localhost:3000/'

  url = url.startsWith('http') ? url : `https://${url}`
  url = url.endsWith('/') ? url : `${url}/`
  return url
}

const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'github',
  options: {
    redirectTo: getURL(),
  },
})
```

**Description:** Dynamic redirect URL handling for OAuth flows. Works across local, preview, and production environments.

---

### Example 6: Enable RLS and Create Policy

```sql
-- Enable RLS on table
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own profile
CREATE POLICY "Users can view own profile"
ON profiles FOR SELECT
USING (auth.uid() = user_id);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
USING (auth.uid() = user_id);
```

**Description:** Basic RLS setup pattern. `auth.uid()` returns the ID of the authenticated user making the request.

---

### Example 7: Deploy Edge Function

```bash
# Link to your project
supabase link

# Deploy function (no JWT verification for webhooks)
supabase functions deploy scribe-bot --no-verify-jwt

# Set secrets
supabase secrets set --env-file supabase/functions/.env
```

**Description:** Complete Edge Function deployment workflow. Use `--no-verify-jwt` only for public webhooks.

---

### Example 8: Edge Function with Auth Context

```typescript
import { createClient } from 'npm:@supabase/supabase-js@2'

Deno.serve(async (req: Request) => {
  // Create client with user's auth context
  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    {
      global: {
        headers: { Authorization: req.headers.get('Authorization')! },
      },
    }
  )

  // Get authenticated user
  const token = req.headers.get('Authorization')!.replace('Bearer ', '')
  const { data: { user } } = await supabaseClient.auth.getUser(token)

  // Query with RLS
  const { data, error } = await supabaseClient.from('users').select('*')

  return new Response(JSON.stringify({ user, data }), {
    headers: { 'Content-Type': 'application/json' },
    status: 200,
  })
})
```

**Description:** Complete Edge Function pattern with auth context, user extraction, and RLS-enforced queries.

---

### Example 9: Redirect URL Wildcards

```
# Allow list in Supabase Dashboard > Auth > URL Configuration

# Local development
http://localhost:3000/**

# Netlify preview URLs
https://**--my_org.netlify.app/**

# Vercel preview URLs
https://*-my-team.vercel.app/**

# Production (exact path recommended)
https://example.com/auth/callback
```

**Description:** Wildcard patterns for redirect URLs. Use `**` for local development and preview URLs, exact paths for production.

---

### Example 10: CLI - Local Development Workflow

```bash
# Initialize Supabase in project
supabase init

# Start local stack (Postgres, Auth, Storage, Edge Functions)
supabase start

# Access local services
# Studio: http://localhost:54323
# API: http://localhost:54321
# Database: postgresql://postgres:postgres@localhost:54322/postgres

# Run migrations
supabase db push

# Stop local stack
supabase stop
```

**Description:** Complete local development setup using Supabase CLI and Docker. All services run locally for offline development.

---

## Working with This Skill

### For Beginners

Start with these reference files:
- **getting_started.md** - Project setup, basic queries, environment configuration
- **api_javascript.md** - Client library basics, common CRUD operations
- **cli.md** - Local development setup with CLI and Docker

**First Steps:**
1. Create a project at [database.new](https://database.new)
2. Get your API keys from Settings > API
3. Set up environment variables (see Example 4)
4. Create a Supabase client (see Example 1)
5. Query your first table (see Example 2)

### For Intermediate Users

Focus on these areas:
- **auth.md** - OAuth providers, JWT handling, session management, redirect URLs
- **database.md** - RLS policies, migrations, foreign keys, performance optimization
- **edge_functions.md** - Serverless functions, Deno runtime, API integrations
- **storage.md** - File uploads, bucket policies, CDN integration

**Common Patterns:**
- Implementing user authentication with RLS
- Building real-time features with subscriptions
- Deploying serverless functions for backend logic
- Managing file uploads with Storage buckets

### For Advanced Users

Dive into:
- **self_hosting.md** - Self-hosting Supabase, custom domains, production deployment
- **platform.md** - Multi-region setup, custom extensions, monitoring
- **realtime.md** - Advanced realtime patterns, presence, broadcast channels

**Advanced Topics:**
- Custom Postgres extensions
- Multi-tenant architectures with RLS
- Performance optimization and indexing
- Webhook handling with Edge Functions

### Navigation Tips

1. **Use the references/ directory** - All documentation is organized by category
2. **Check references/index.md** - Shows all available documentation files
3. **Search by keyword** - Each reference file includes examples and code snippets
4. **Look for "Example:" markers** - Best patterns are extracted and highlighted

## Reference Files

This skill includes comprehensive documentation in `references/`:

- **api_javascript.md** (23 pages) - JavaScript client library, CRUD operations, query patterns
- **auth.md** (100 pages) - Authentication, OAuth providers, JWT handling, RLS integration, redirect URLs, mobile deep linking
- **cli.md** (9 pages) - Supabase CLI, local development, Docker setup, migrations
- **database.md** - Database operations, RLS policies, migrations, query optimization
- **edge_functions.md** - Serverless Deno functions, webhooks, API integrations, auth context
- **getting_started.md** - Project setup, environment variables, first queries
- **other.md** - Additional features and utilities
- **platform.md** - Platform management, multi-region, monitoring
- **realtime.md** - Live subscriptions, presence, broadcast channels
- **self_hosting.md** - Self-hosting Supabase, custom deployments
- **storage.md** - File uploads, bucket management, CDN integration

Use the Read tool to access specific reference files when detailed information is needed.

## Common Patterns

### Authentication Pattern
```typescript
// 1. Create client with auth context
const supabase = createClient(url, anonKey, {
  global: { headers: { Authorization: req.headers.get('Authorization')! } }
})

// 2. Get user from JWT
const token = req.headers.get('Authorization')!.replace('Bearer ', '')
const { data: { user } } = await supabase.auth.getUser(token)

// 3. Query with RLS enforcement
const { data } = await supabase.from('table').select('*')
```

### RLS Policy Pattern
```sql
-- Enable RLS
ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;

-- Create policy
CREATE POLICY "policy_name"
ON table_name FOR SELECT
USING (auth.uid() = user_id);
```

### Edge Function Pattern
```typescript
// Import client
import { createClient } from 'npm:@supabase/supabase-js@2'

// Handle request
Deno.serve(async (req: Request) => {
  // Create client with auth
  const supabase = createClient(url, key, {
    global: { headers: { Authorization: req.headers.get('Authorization')! } }
  })

  // Your logic here
  const { data } = await supabase.from('table').select('*')

  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' }
  })
})
```

## Resources

### Official Documentation
- **Docs:** https://supabase.com/docs
- **Dashboard:** https://supabase.com/dashboard
- **GitHub:** https://github.com/supabase/supabase

### Development Tools
- **Supabase CLI:** Local development with Docker
- **Supabase Studio:** Web-based database GUI
- **VS Code Extension:** Syntax highlighting for SQL migrations

## Notes

- This skill was generated from official Supabase documentation
- Code examples include proper language detection for syntax highlighting
- All examples are extracted from real-world Supabase patterns
- Reference files preserve original structure and links from source docs

## Troubleshooting Common Issues

### RLS Blocking Queries
**Problem:** Queries return empty even with data in table
**Solution:** Check RLS policies - either add appropriate policies or temporarily disable RLS for testing:
```sql
ALTER TABLE table_name DISABLE ROW LEVEL SECURITY;
```

### Auth Context Not Working
**Problem:** Edge Function queries ignore auth context
**Solution:** Ensure client is created inside `Deno.serve()` callback with Authorization header:
```typescript
Deno.serve(async (req: Request) => {
  // Create client HERE, not outside
  const supabase = createClient(url, key, {
    global: { headers: { Authorization: req.headers.get('Authorization')! } }
  })
})
```

### Redirect URL Errors
**Problem:** OAuth callback fails with "redirect URL not allowed"
**Solution:** Add URL to allow list at `Dashboard > Auth > URL Configuration`. Use wildcards for preview URLs:
- Local: `http://localhost:3000/**`
- Vercel: `https://*-team-name.vercel.app/**`

### Service Role vs Anon Key
**Problem:** Confused about which key to use
**Solution:**
- **Anon Key:** Client-side, respects RLS (safe to expose)
- **Service Role Key:** Server-side only, bypasses RLS (NEVER expose)

## Updating

To refresh this skill with updated documentation:
1. Re-run the documentation scraper with the same configuration
2. The skill will be rebuilt with the latest Supabase docs
3. Upload the new `.zip` file to Claude to update the skill
