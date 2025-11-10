# Helper Scripts

Utility scripts to assist with Next.js 16 development and migration.

## migration-checker.py

Scans your Next.js project for common migration issues when upgrading to Next.js 16.

### Usage

```bash
# Check current directory
python scripts/migration-checker.py

# Check specific directory
python scripts/migration-checker.py /path/to/project
```

### Checks

The script checks for:
- ✓ Package.json version requirements (Node.js 20.9+, TypeScript 5.1+)
- ✓ Synchronous params/searchParams usage
- ✓ Synchronous cookies/headers/draftMode usage
- ✓ Old revalidateTag() signature (missing second argument)
- ✓ middleware.ts files that should be renamed to proxy.ts
- ✓ Parallel routes missing default.js files

### Example Output

```
==============================================================
Next.js 16 Migration Checker
==============================================================

Scanning: /Users/you/project

==============================================================
1. Checking Dependencies
==============================================================

[WARNING] package.json:0
  → Next.js version '15.0.0' should be updated to 16.x

==============================================================
2. Checking Middleware
==============================================================

[WARNING] middleware.ts:0
  → Should be renamed to proxy.ts

==============================================================
3. Checking Parallel Routes
==============================================================

[ERROR] app/@modal:0
  → Missing default.tsx file

==============================================================
4. Checking TypeScript/JavaScript Files
==============================================================

[ERROR] app/blog/[slug]/page.tsx:15
  → params must be awaited before access

[WARNING] app/actions.ts:42
  → revalidateTag() requires second argument (cacheLife profile)

==============================================================
Summary
==============================================================

Found 5 potential issues.

Next steps:
  1. Run automated migration: npx @next/codemod@canary upgrade latest
  2. Review the issues above and fix manually if needed
  3. Test your application thoroughly
```

## config-generator.js

Interactive tool to generate a complete `next.config.ts` file with common Next.js 16 settings.

### Usage

```bash
# Run the generator
node scripts/config-generator.js

# Or make it executable and run directly
./scripts/config-generator.js
```

### Features

Generates configuration for:
- Cache Components
- Custom cache profiles
- Turbopack file system caching
- React Compiler
- Image optimization
- TypeScript settings
- ESLint configuration
- Standalone output (Docker)
- Production console removal

### Example Session

```
🚀 Next.js 16 Config Generator

Enable Cache Components? (y/n) [y]: y
Add custom cache profiles? (y/n) [n]: y
Enable Turbopack file system caching? (y/n) [y]: y
Enable React Compiler? (y/n) [n]: n
Configure image optimization? (y/n) [y]: y
Remote image hostname (e.g., example.com) [skip]: cdn.example.com
Configure TypeScript? (y/n) [y]: y
Configure ESLint? (y/n) [y]: y
Enable standalone output (Docker)? (y/n) [n]: n
Remove console logs in production? (y/n) [y]: y

✅ Generated next.config.ts

Next steps:

  Your remote pattern is configured for: cdn.example.com
  Add more patterns in next.config.ts as needed

  Test your configuration:
  $ npm run dev
```

## Requirements

### Python Script
- Python 3.6+
- No external dependencies

### JavaScript Script
- Node.js 20.9.0+
- No external dependencies

## Contributing

Feel free to extend these scripts with additional checks or features that would be helpful for Next.js 16 development!
