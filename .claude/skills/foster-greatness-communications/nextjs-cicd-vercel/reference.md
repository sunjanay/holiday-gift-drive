# Reference Documentation

Quick reference guide for Next.js 16 CI/CD with GitHub Actions and Vercel.

## Table of Contents

- [Command Reference](#command-reference)
- [Configuration Files Quick Reference](#configuration-files-quick-reference)
- [Environment Variables](#environment-variables)
- [GitHub Actions Syntax](#github-actions-syntax)
- [Vercel CLI Commands](#vercel-cli-commands)
- [Common Patterns](#common-patterns)
- [Troubleshooting Guide](#troubleshooting-guide)

## Command Reference

### npm Scripts

```bash
# Development
npm run dev                    # Start development server
npm run build                  # Build production application
npm run start                  # Start production server

# Code Quality
npm run lint                   # Run ESLint
npm run lint:fix              # Run ESLint and auto-fix issues
npm run format                # Format code with Prettier
npm run format:check          # Check code formatting
npm run type-check            # Run TypeScript type checking

# Testing
npm run test                  # Run tests in watch mode
npm run test:ci               # Run tests in CI mode (no watch)
npm run test:coverage         # Generate coverage report

# Validation (run all checks)
npm run validate              # type-check + lint + format:check + test:ci
```

### Vercel CLI

```bash
# Authentication
vercel login                  # Login to Vercel
vercel logout                 # Logout from Vercel
vercel whoami                 # Show current user

# Project Management
vercel link                   # Link local directory to Vercel project
vercel projects ls            # List all projects
vercel env ls                 # List environment variables

# Deployment
vercel                        # Deploy to preview (development)
vercel --prod                 # Deploy to production
vercel deploy                 # Explicit deploy command
vercel deploy --prebuilt      # Deploy pre-built output

# Environment-specific
vercel pull --environment=preview     # Pull preview environment config
vercel pull --environment=production  # Pull production environment config
vercel build                          # Build for preview
vercel build --prod                   # Build for production

# Configuration
vercel env add [name]         # Add environment variable
vercel env rm [name]          # Remove environment variable
vercel env pull              # Pull all environment variables to .env.local

# Inspection
vercel inspect [url]          # Get detailed deployment information
vercel ls                     # List deployments
vercel logs [url]            # View deployment logs

# Rollback
vercel rollback [url]         # Rollback to specific deployment
```

### Git & GitHub

```bash
# Create feature branch
git checkout -b feature/my-feature

# Push and trigger CI
git push origin feature/my-feature

# Create pull request (with GitHub CLI)
gh pr create --title "Add feature" --body "Description"

# View workflow runs
gh run list
gh run view [run-id]

# Trigger workflow manually
gh workflow run deploy.yml

# View deployment status
gh deployment list
```

## Configuration Files Quick Reference

### package.json

```json
{
  "name": "my-nextjs-app",
  "version": "1.0.0",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "lint:fix": "next lint --fix",
    "format": "prettier --write \"**/*.{js,jsx,ts,tsx,json,css,md}\"",
    "format:check": "prettier --check \"**/*.{js,jsx,ts,tsx,json,css,md}\"",
    "type-check": "tsc --noEmit",
    "test": "jest",
    "test:ci": "jest --ci --coverage --maxWorkers=2",
    "test:watch": "jest --watch",
    "validate": "npm run type-check && npm run lint && npm run format:check && npm run test:ci"
  },
  "dependencies": {
    "next": "^16.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "typescript": "^5.0.0",
    "eslint": "^9.0.0",
    "eslint-config-next": "^16.0.0",
    "prettier": "^3.0.0",
    "prettier-plugin-tailwindcss": "^0.6.0"
  }
}
```

### eslint.config.mjs

```javascript
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.config({
    extends: [
      "next/core-web-vitals",
      "next/typescript",
      "plugin:prettier/recommended",
    ],
    plugins: ["prettier"],
    rules: {
      "prettier/prettier": "error",
      "no-console": ["warn", { allow: ["warn", "error"] }],
    },
  }),
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      ".vercel/**",
    ],
  },
];

export default eslintConfig;
```

### .prettierrc

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false,
  "arrowParens": "always",
  "endOfLine": "lf",
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

### tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### next.config.js

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React strict mode
  reactStrictMode: true,
  
  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  
  // Disable source maps in production
  productionBrowserSourceMaps: false,
  
  // Optimize bundle
  swcMinify: true,
  
  // Environment variables
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  
  // Headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
```

### .gitignore

```
# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env*.local
.env

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts
```

## Environment Variables

### Variable Types

**Public Variables** (client-side accessible):
```bash
NEXT_PUBLIC_API_URL=https://api.example.com
NEXT_PUBLIC_ANALYTICS_ID=UA-123456
```

**Server-only Variables** (not exposed to browser):
```bash
DATABASE_URL=postgresql://...
API_SECRET_KEY=sk_live_...
STRIPE_SECRET_KEY=sk_test_...
```

### Environment Precedence

1. `.env.local` (highest priority, ignored by git)
2. `.env.development` (development only)
3. `.env.production` (production only)
4. `.env` (all environments, can be committed)

### Vercel Environment Targets

- **Production**: Used for production deployments
- **Preview**: Used for branch/PR deployments
- **Development**: Used with `vercel dev`

### Accessing Variables

**In Components (client-side)**:
```typescript
// Only NEXT_PUBLIC_ variables work here
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
```

**In API Routes (server-side)**:
```typescript
// All variables accessible
const dbUrl = process.env.DATABASE_URL;
const apiKey = process.env.API_SECRET_KEY;
```

**In getServerSideProps (server-side)**:
```typescript
export async function getServerSideProps() {
  const data = await fetch(process.env.INTERNAL_API_URL);
  return { props: { data } };
}
```

## GitHub Actions Syntax

### Workflow Structure

```yaml
name: Workflow Name                    # Workflow name in GitHub UI

on:                                    # Trigger events
  push:
    branches: [main, develop]
    paths: ['src/**']                  # Only trigger on these paths
  pull_request:
    branches: [main]
  workflow_dispatch:                   # Manual trigger
  schedule:
    - cron: '0 0 * * *'               # Daily at midnight

env:                                   # Workflow-level environment variables
  NODE_VERSION: '20'

jobs:                                  # Jobs to run
  job-name:
    name: Job Display Name
    runs-on: ubuntu-latest            # Runner environment
    timeout-minutes: 10               # Job timeout
    
    strategy:                         # Matrix strategy
      matrix:
        node-version: [18, 20]
    
    steps:                            # Steps in the job
      - name: Step Name
        uses: actions/checkout@v4     # Use an action
      
      - name: Run Command
        run: npm install              # Run shell command
        env:                          # Step-level env vars
          API_KEY: ${{ secrets.API_KEY }}
      
      - name: Multi-line Script
        run: |
          echo "Line 1"
          echo "Line 2"
      
      - name: Conditional Step
        if: github.ref == 'refs/heads/main'
        run: echo "Only on main"
```

### Common Triggers

```yaml
# On push to any branch
on: [push]

# On push to specific branches
on:
  push:
    branches: [main, develop]

# On push excluding certain branches
on:
  push:
    branches-ignore: [staging, testing]

# On pull request
on:
  pull_request:
    branches: [main]

# Multiple events
on: [push, pull_request]

# Manual trigger
on: workflow_dispatch

# Scheduled (cron syntax)
on:
  schedule:
    - cron: '0 0 * * *'  # Daily at midnight UTC

# On release
on:
  release:
    types: [published]
```

### Conditionals

```yaml
# Run step only on main branch
- if: github.ref == 'refs/heads/main'
  run: echo "Main branch"

# Run on success
- if: success()
  run: echo "Previous steps succeeded"

# Run on failure
- if: failure()
  run: echo "Something failed"

# Run always (even on failure)
- if: always()
  run: echo "Always runs"

# Complex condition
- if: github.ref == 'refs/heads/main' && success()
  run: echo "Main branch and success"

# Environment check
- if: env.NODE_ENV == 'production'
  run: echo "Production environment"
```

### Outputs and Inputs

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    outputs:
      build-id: ${{ steps.build.outputs.id }}
    steps:
      - name: Build
        id: build
        run: |
          BUILD_ID=$(date +%s)
          echo "id=$BUILD_ID" >> $GITHUB_OUTPUT
  
  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - name: Deploy
        run: echo "Deploying build ${{ needs.build.outputs.build-id }}"
```

### Secrets and Variables

```yaml
# Access secrets
env:
  API_KEY: ${{ secrets.API_KEY }}

# Access GitHub token
env:
  GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

# Access repository variables
env:
  ENVIRONMENT: ${{ vars.ENVIRONMENT }}

# Access context information
env:
  COMMIT_SHA: ${{ github.sha }}
  BRANCH_NAME: ${{ github.ref_name }}
  REPO_NAME: ${{ github.repository }}
```

## Vercel CLI Commands

### Deployment Commands

```bash
# Deploy to preview
vercel

# Deploy to production
vercel --prod

# Deploy with specific name
vercel --name my-deployment

# Deploy and alias
vercel --prod --alias myapp.com

# Deploy pre-built project
vercel deploy --prebuilt

# Deploy with environment variables
vercel deploy -e KEY=value

# Force new build
vercel deploy --force
```

### Project Commands

```bash
# Link current directory to Vercel project
vercel link

# Initialize new project
vercel init

# Remove project link
vercel unlink
```

### Environment Commands

```bash
# List environment variables
vercel env ls

# Add environment variable
vercel env add KEY

# Remove environment variable
vercel env rm KEY

# Pull environment variables to .env.local
vercel env pull

# Add environment variable for specific environment
vercel env add KEY production
vercel env add KEY preview
vercel env add KEY development
```

### Information Commands

```bash
# List deployments
vercel ls

# Get deployment info
vercel inspect [url]

# View logs
vercel logs [url]

# List domains
vercel domains ls

# List aliases
vercel alias ls
```

## Common Patterns

### Pattern: Deploy on Tag

```yaml
name: Release

on:
  push:
    tags:
      - 'v*'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Deploy tagged release
        run: |
          npm install -g vercel
          vercel deploy --prod --token=${{ secrets.VERCEL_TOKEN }}
```

### Pattern: Deploy with Approval

```yaml
name: Production Deploy

on:
  workflow_dispatch:
    inputs:
      environment:
        description: 'Environment to deploy to'
        required: true
        type: choice
        options:
          - staging
          - production

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: ${{ github.event.inputs.environment }}
    steps:
      - uses: actions/checkout@v4
      - name: Deploy
        run: vercel deploy --prod
```

### Pattern: Parallel Jobs

```yaml
jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - run: npm run lint

  test:
    runs-on: ubuntu-latest
    steps:
      - run: npm test

  type-check:
    runs-on: ubuntu-latest
    steps:
      - run: npm run type-check

  deploy:
    needs: [lint, test, type-check]
    runs-on: ubuntu-latest
    steps:
      - run: vercel deploy --prod
```

### Pattern: Conditional Deployment

```yaml
- name: Deploy to staging
  if: github.ref != 'refs/heads/main'
  run: vercel deploy

- name: Deploy to production
  if: github.ref == 'refs/heads/main'
  run: vercel deploy --prod
```

## Troubleshooting Guide

### Issue: "No such file or directory: .vercel/project.json"

**Solution**:
```bash
# Run vercel link to create project.json
vercel link

# Or manually create it
mkdir -p .vercel
echo '{"projectId":"prj_xxx","orgId":"team_xxx"}' > .vercel/project.json
```

### Issue: Build succeeds locally but fails in CI

**Diagnosis**:
```yaml
# Add debugging steps
- name: Debug environment
  run: |
    node --version
    npm --version
    pwd
    ls -la
```

**Common causes**:
- Node version mismatch
- Missing environment variables
- Case-sensitive file paths
- Missing dependencies in package.json

### Issue: Vercel deployment times out

**Solutions**:
```javascript
// next.config.js - Disable heavy optimizations
module.exports = {
  productionBrowserSourceMaps: false,
  swcMinify: true,
  compiler: {
    removeConsole: true,
  },
};
```

```yaml
# Increase timeout in workflow
jobs:
  deploy:
    timeout-minutes: 20  # Increase from default 10
```

### Issue: Environment variables not available

**Check**:
1. Variable naming (NEXT_PUBLIC_ for client-side)
2. Environment target (production/preview/development)
3. Rebuild after adding variables
4. Clear build cache

```bash
# Pull variables to verify
vercel env pull .env.local
cat .env.local
```

### Issue: GitHub Actions cache not working

**Solution**:
```yaml
# Use more specific cache keys
- uses: actions/cache@v4
  with:
    path: |
      ~/.npm
      ${{ github.workspace }}/.next/cache
    key: ${{ runner.os }}-nextjs-${{ hashFiles('**/package-lock.json') }}-${{ github.run_id }}
    restore-keys: |
      ${{ runner.os }}-nextjs-${{ hashFiles('**/package-lock.json') }}-
```

### Issue: Tests fail in CI but pass locally

**Solutions**:

1. **Use same Node version**:
```yaml
- uses: actions/setup-node@v4
  with:
    node-version-file: '.nvmrc'  # Use .nvmrc file
```

2. **Set test environment**:
```yaml
- name: Test
  run: npm test
  env:
    NODE_ENV: test
    CI: true
```

3. **Increase timeout**:
```javascript
// jest.config.js
module.exports = {
  testTimeout: 10000,  // Increase from default 5000
};
```

### Debug Commands

```bash
# Check Vercel configuration
vercel inspect

# View deployment logs
vercel logs [deployment-url] --follow

# Test build locally
npm run build
vercel build

# Validate GitHub Actions workflow
gh workflow view [workflow-name]

# Check secrets (list names only)
gh secret list

# View workflow run logs
gh run view [run-id] --log
```

### Common Error Messages

**Error**: "ENOENT: no such file or directory"
```yaml
# Add step to verify paths
- run: ls -R
```

**Error**: "Cannot find module"
```bash
# Clear and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Error**: "Vercel token is invalid"
```bash
# Regenerate token
vercel login
# Create new token at https://vercel.com/account/tokens
```

**Error**: "Build exceeded maximum duration"
```javascript
// Optimize build
module.exports = {
  output: 'standalone',
  experimental: {
    optimizeCss: true,
  },
};
```

## Useful Links

- [Next.js Documentation](https://nextjs.org/docs)
- [Vercel CLI Documentation](https://vercel.com/docs/cli)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [GitHub Actions Marketplace](https://github.com/marketplace?type=actions)
- [Vercel Community](https://github.com/vercel/community)
