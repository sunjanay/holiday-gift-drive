---
name: nextjs-cicd-vercel
description: Complete CI/CD setup for Next.js applications with GitHub Actions and Vercel deployment. Use when setting up or updating automated testing, linting, building, and deployment workflows for Next.js apps. Covers TypeScript configuration, ESLint/Prettier integration, environment variable management, preview and production deployments, and quality gates.
version: 1.0.0
author: Claude
tags:
  - nextjs
  - cicd
  - github-actions
  - vercel
  - deployment
  - testing
  - linting
---

# Next.js 16 CI/CD with GitHub Actions & Vercel

## Overview

This skill provides a production-ready CI/CD pipeline for Next.js 16 applications using GitHub Actions for continuous integration and Vercel for deployment. The setup includes automated testing, linting, build verification, and seamless deployments to preview and production environments.

## When to Use This Skill

Use this skill when you need to:

- Set up automated CI/CD for a new Next.js 16 project
- Migrate existing Next.js projects to a robust CI/CD pipeline
- Implement quality gates (linting, testing, type-checking) before deployment
- Configure separate preview and production deployment workflows
- Manage environment variables securely across environments
- Integrate ESLint and Prettier with your deployment pipeline
- Set up build caching for faster CI runs

## Key Features

- **Automated Quality Checks**: ESLint, Prettier, TypeScript type-checking, and testing on every push
- **Preview Deployments**: Automatic preview deployments for all branches except main
- **Production Deployments**: Controlled production deployments from main branch only
- **Build Caching**: Optimized GitHub Actions caching for faster builds
- **Environment Variable Management**: Secure handling of secrets and environment variables
- **Next.js 16 Optimized**: Configured for Next.js 16 with Turbopack and modern features

## Prerequisites

Before implementing this skill, ensure you have:

1. A Next.js 16 project (create with `npx create-next-app@latest`)
2. A GitHub repository for your project
3. A Vercel account (free tier works)
4. Git installed locally
5. Node.js 18+ installed

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Developer Workflow                        │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      GitHub Repository                       │
│  ┌────────────────────────────────────────────────────────┐ │
│  │         .github/workflows/                             │ │
│  │  - ci.yml        (Quality checks on all branches)      │ │
│  │  - preview.yml   (Deploy previews for non-main)        │ │
│  │  - production.yml (Deploy to prod from main)           │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              │
                    ┌─────────┴─────────┐
                    ▼                   ▼
        ┌───────────────────┐  ┌───────────────────┐
        │  GitHub Actions   │  │  GitHub Actions   │
        │   (CI Pipeline)   │  │  (CD Pipeline)    │
        │                   │  │                   │
        │ • Lint & Format   │  │ • Vercel Build    │
        │ • Type Check      │  │ • Deploy Preview  │
        │ • Run Tests       │  │ • Deploy Prod     │
        │ • Build Verify    │  └───────────────────┘
        └───────────────────┘           │
                                        ▼
                              ┌───────────────────┐
                              │      Vercel       │
                              │                   │
                              │ • Preview URLs    │
                              │ • Production URL  │
                              └───────────────────┘
```

## Implementation Guide

### Step 1: Project Setup

#### 1.1 Initialize Next.js 16 Project (if new)

```bash
npx create-next-app@latest my-app --typescript --tailwind --eslint --app --src-dir
cd my-app
```

#### 1.2 Install Required Dependencies

```bash
# Core CI/CD dependencies
npm install --save-dev \
  prettier \
  prettier-plugin-tailwindcss \
  eslint-config-prettier \
  eslint-plugin-prettier \
  @typescript-eslint/parser \
  @typescript-eslint/eslint-plugin

# Testing dependencies (optional but recommended)
npm install --save-dev \
  jest \
  @testing-library/react \
  @testing-library/jest-dom \
  jest-environment-jsdom
```

### Step 2: Configure Code Quality Tools

#### 2.1 ESLint Configuration

Create or update `eslint.config.mjs` (Next.js 16 uses flat config):

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
      "react/react-in-jsx-scope": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
    },
  }),
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      ".vercel/**",
    ],
  },
];

export default eslintConfig;
```

#### 2.2 Prettier Configuration

Create `.prettierrc`:

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

Create `.prettierignore`:

```
node_modules
.next
.vercel
out
build
coverage
*.log
.env*.local
.eslintcache
```

#### 2.3 Update package.json Scripts

Add these scripts to your `package.json`:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "lint:fix": "next lint --fix",
    "format": "prettier --write \"**/*.{js,jsx,ts,tsx,json,css,md}\"",
    "format:check": "prettier --check \"**/*.{js,jsx,ts,tsx,json,css,md}\"",
    "type-check": "tsc --noEmit",
    "test": "jest --coverage",
    "test:ci": "jest --ci --coverage --maxWorkers=2",
    "validate": "npm run type-check && npm run lint && npm run format:check && npm run test:ci"
  }
}
```

### Step 3: Configure Jest (Optional but Recommended)

#### 3.1 Jest Configuration

Create `jest.config.js`:

```javascript
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
});

// Add any custom config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
    '!src/**/__tests__/**',
  ],
  testMatch: [
    '**/__tests__/**/*.[jt]s?(x)',
    '**/?(*.)+(spec|test).[jt]s?(x)',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
};

module.exports = createJestConfig(customJestConfig);
```

Create `jest.setup.js`:

```javascript
import '@testing-library/jest-dom';
```

#### 3.2 Sample Test

Create `src/app/__tests__/page.test.tsx`:

```typescript
import { render, screen } from '@testing-library/react';
import Home from '../page';

describe('Home', () => {
  it('renders without crashing', () => {
    render(<Home />);
    expect(screen.getByRole('main')).toBeInTheDocument();
  });
});
```

### Step 4: Vercel Setup

#### 4.1 Link Project to Vercel

```bash
# Install Vercel CLI
npm install -g vercel@latest

# Login to Vercel
vercel login

# Link your project
vercel link
```

This creates `.vercel/project.json` with your project and org IDs.

#### 4.2 Get Vercel IDs

```bash
# View the project.json file
cat .vercel/project.json
```

You'll see something like:

```json
{
  "projectId": "prj_xxxxxxxxxxxxxxxxxxxx",
  "orgId": "team_xxxxxxxxxxxxxxxxxxxx"
}
```

#### 4.3 Create Vercel Token

1. Go to https://vercel.com/account/tokens
2. Click "Create Token"
3. Give it a name (e.g., "GitHub Actions CI/CD")
4. Set expiration (recommend 1 year)
5. Copy the token immediately (you won't see it again)

#### 4.4 Add Secrets to GitHub

1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add the following secrets:

```
VERCEL_TOKEN: [your vercel token]
VERCEL_ORG_ID: [from .vercel/project.json]
VERCEL_PROJECT_ID: [from .vercel/project.json]
```

**Important**: Add `.vercel` to your `.gitignore`:

```
# .gitignore
.vercel
```

### Step 5: GitHub Actions Workflows

Create the `.github/workflows/` directory structure:

```bash
mkdir -p .github/workflows
```

#### 5.1 CI Workflow (Quality Checks)

Create `.github/workflows/ci.yml`:

```yaml
name: CI

on:
  push:
    branches: ['**']
  pull_request:
    branches: ['**']

jobs:
  quality-checks:
    name: Quality Checks
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [18.x, 20.x]

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'

      - name: Cache dependencies
        uses: actions/cache@v4
        with:
          path: |
            ~/.npm
            ${{ github.workspace }}/.next/cache
          key: ${{ runner.os }}-nextjs-${{ hashFiles('**/package-lock.json') }}-${{ hashFiles('**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx') }}
          restore-keys: |
            ${{ runner.os }}-nextjs-${{ hashFiles('**/package-lock.json') }}-

      - name: Install dependencies
        run: npm ci

      - name: Run TypeScript type check
        run: npm run type-check

      - name: Run ESLint
        run: npm run lint

      - name: Check code formatting
        run: npm run format:check

      - name: Run tests
        run: npm run test:ci

      - name: Build application
        run: npm run build
        env:
          NODE_ENV: production

      - name: Upload coverage reports
        uses: codecov/codecov-action@v4
        if: matrix.node-version == '20.x'
        with:
          token: ${{ secrets.CODECOV_TOKEN }}
          fail_ci_if_error: false
```

#### 5.2 Preview Deployment Workflow

Create `.github/workflows/preview.yml`:

```yaml
name: Preview Deployment

env:
  VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
  VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}

on:
  push:
    branches-ignore:
      - main

jobs:
  deploy-preview:
    name: Deploy Preview
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Install Vercel CLI
        run: npm install --global vercel@latest

      - name: Pull Vercel environment information
        run: vercel pull --yes --environment=preview --token=${{ secrets.VERCEL_TOKEN }}

      - name: Build project artifacts
        run: vercel build --token=${{ secrets.VERCEL_TOKEN }}

      - name: Deploy to Vercel
        id: deploy
        run: |
          url=$(vercel deploy --prebuilt --token=${{ secrets.VERCEL_TOKEN }})
          echo "url=$url" >> $GITHUB_OUTPUT

      - name: Comment preview URL on PR
        if: github.event_name == 'pull_request'
        uses: actions/github-script@v7
        with:
          script: |
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: '🚀 Preview deployment ready!\n\n✅ Preview: ${{ steps.deploy.outputs.url }}'
            })
```

#### 5.3 Production Deployment Workflow

Create `.github/workflows/production.yml`:

```yaml
name: Production Deployment

env:
  VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
  VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}

on:
  push:
    branches:
      - main
  workflow_dispatch:

jobs:
  quality-gate:
    name: Quality Gate
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run validation
        run: npm run validate

  deploy-production:
    name: Deploy to Production
    needs: quality-gate
    runs-on: ubuntu-latest
    environment:
      name: production
      url: ${{ steps.deploy.outputs.url }}
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Install Vercel CLI
        run: npm install --global vercel@latest

      - name: Pull Vercel environment information
        run: vercel pull --yes --environment=production --token=${{ secrets.VERCEL_TOKEN }}

      - name: Build project artifacts
        run: vercel build --prod --token=${{ secrets.VERCEL_TOKEN }}

      - name: Deploy to Production
        id: deploy
        run: |
          url=$(vercel deploy --prebuilt --prod --token=${{ secrets.VERCEL_TOKEN }})
          echo "url=$url" >> $GITHUB_OUTPUT

      - name: Create deployment summary
        run: |
          echo "## 🚀 Production Deployment Successful!" >> $GITHUB_STEP_SUMMARY
          echo "" >> $GITHUB_STEP_SUMMARY
          echo "✅ **Production URL**: ${{ steps.deploy.outputs.url }}" >> $GITHUB_STEP_SUMMARY
          echo "📅 **Deployed at**: $(date -u +'%Y-%m-%d %H:%M:%S UTC')" >> $GITHUB_STEP_SUMMARY
          echo "🔗 **Commit**: ${{ github.sha }}" >> $GITHUB_STEP_SUMMARY
```

### Step 6: Environment Variables Management

#### 6.1 Local Environment

Create `.env.local` for local development (never commit this):

```env
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:3000/api
DATABASE_URL=your_local_database_url
API_SECRET_KEY=your_local_secret
```

Add to `.gitignore`:

```
.env*.local
```

#### 6.2 Vercel Environment Variables

Configure environment variables in Vercel:

1. Go to your project in Vercel dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add variables for each environment:
   - **Production**: Variables for production builds
   - **Preview**: Variables for preview deployments
   - **Development**: Variables for `vercel dev`

**Best Practices**:
- Use `NEXT_PUBLIC_` prefix for client-side variables
- Keep sensitive keys server-side only (no `NEXT_PUBLIC_` prefix)
- Use different values for preview and production
- Store all secrets in Vercel, not GitHub Actions

#### 6.3 GitHub Actions Environment Variables

For variables needed during CI, add them to GitHub Secrets or use environment-specific GitHub environments.

### Step 7: Optimization and Caching

#### 7.1 Next.js Build Caching

The CI workflow already includes optimized caching:

```yaml
- name: Cache dependencies
  uses: actions/cache@v4
  with:
    path: |
      ~/.npm
      ${{ github.workspace }}/.next/cache
    key: ${{ runner.os }}-nextjs-${{ hashFiles('**/package-lock.json') }}-${{ hashFiles('**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx') }}
    restore-keys: |
      ${{ runner.os }}-nextjs-${{ hashFiles('**/package-lock.json') }}-
```

This caches:
- npm dependencies
- Next.js build cache (significantly speeds up builds)

#### 7.2 Vercel Build Optimization

Vercel automatically optimizes:
- Image optimization
- Edge caching
- Incremental static regeneration
- Build output caching

To further optimize, configure in `next.config.js`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable SWC minification (default in Next.js 13+)
  swcMinify: true,
  
  // Configure image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  },
  
  // Enable experimental features if needed
  experimental: {
    // Next.js 16 features
  },
};

module.exports = nextConfig;
```

### Step 8: Status Badges (Optional)

Add status badges to your README.md:

```markdown
# My Next.js App

[![CI](https://github.com/username/repo/actions/workflows/ci.yml/badge.svg)](https://github.com/username/repo/actions/workflows/ci.yml)
[![Production Deployment](https://github.com/username/repo/actions/workflows/production.yml/badge.svg)](https://github.com/username/repo/actions/workflows/production.yml)

## Features
...
```

## Workflow Behavior

### On Feature Branch Push

1. **CI workflow** runs:
   - Type checking
   - Linting
   - Format checking
   - Tests
   - Build verification

2. **Preview deployment** workflow runs:
   - Builds and deploys to preview URL
   - Generates unique preview URL for the branch

### On Pull Request

1. **CI workflow** runs on PR branch
2. **Preview deployment** creates preview URL
3. Bot comments preview URL on PR
4. Status checks prevent merge if quality checks fail

### On Main Branch Push

1. **Production deployment** workflow runs:
   - Runs full quality gate (validate script)
   - Only deploys if all checks pass
   - Updates production deployment
   - Creates deployment summary

## Troubleshooting

### Common Issues

#### 1. "Vercel token not found"

**Solution**: Ensure `VERCEL_TOKEN` is added to GitHub Secrets.

```bash
# Verify your token locally
vercel whoami
```

#### 2. "Module not found" errors during build

**Solution**: Ensure all dependencies are in `package.json` and committed:

```bash
npm install --save-dev [missing-package]
git add package.json package-lock.json
git commit -m "Add missing dependencies"
```

#### 3. ESLint errors blocking deployment

**Solution**: Fix linting errors or adjust rules in `eslint.config.mjs`:

```bash
# Run locally to see all errors
npm run lint

# Auto-fix where possible
npm run lint:fix
```

#### 4. Tests failing in CI but passing locally

**Solution**: Ensure consistent Node.js versions and environment variables:

```yaml
# In your workflow, specify exact Node version
- uses: actions/setup-node@v4
  with:
    node-version: '20.11.0'  # Match your local version
```

#### 5. Vercel build timeouts

**Solution**: Optimize your build:

```javascript
// next.config.js
module.exports = {
  // Disable source maps in production to speed up builds
  productionBrowserSourceMaps: false,
  
  // Reduce bundle size
  output: 'standalone',
};
```

#### 6. Environment variables not working

**Solution**: 
- Check variable naming (use `NEXT_PUBLIC_` for client-side)
- Verify variables are set in Vercel for correct environment
- Rebuild and redeploy after adding variables

## Best Practices

### 1. Branch Protection Rules

Configure branch protection for `main`:

1. Go to **Settings** → **Branches** → **Branch protection rules**
2. Add rule for `main` branch:
   - ✅ Require status checks to pass
   - ✅ Require branches to be up to date
   - ✅ Require deployments to succeed before merging
   - ✅ Include administrators

### 2. Commit Message Convention

Use conventional commits for better changelog generation:

```
feat: add user authentication
fix: resolve build issue on Safari
docs: update README with deployment steps
chore: update dependencies
test: add tests for API endpoints
```

### 3. Testing Strategy

- **Unit tests**: Test individual components and functions
- **Integration tests**: Test API routes and database interactions
- **E2E tests** (optional): Use Playwright or Cypress for critical user flows

### 4. Security

- Never commit `.env` files
- Use different secrets for preview and production
- Regularly rotate API tokens
- Enable Dependabot for automatic security updates
- Review Vercel Security settings

### 5. Performance Monitoring

After deployment, monitor:
- Vercel Analytics
- Core Web Vitals
- Build times and cache hit rates
- Error rates from CI/CD pipelines

## Advanced Configuration

### Matrix Testing

Test across multiple Node.js versions:

```yaml
strategy:
  matrix:
    node-version: [18.x, 20.x, 22.x]
    os: [ubuntu-latest, windows-latest, macos-latest]
```

### Conditional Deployments

Deploy only on specific conditions:

```yaml
- name: Deploy
  if: github.ref == 'refs/heads/main' && github.event_name == 'push'
  run: vercel deploy --prod
```

### Deployment Notifications

Add Slack notifications:

```yaml
- name: Notify Slack
  if: always()
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

### Rollback Strategy

To rollback a deployment:

1. In Vercel dashboard, go to Deployments
2. Find the previous working deployment
3. Click "Promote to Production"

Or via CLI:

```bash
vercel rollback [deployment-url] --token $VERCEL_TOKEN
```

## Migration from Existing Setup

### From Vercel Auto-Deploy

1. Disable Vercel's GitHub integration auto-deploy:
   - Go to Vercel project **Settings** → **Git**
   - Disable "Auto Deploy" for production

2. Follow the implementation guide above

3. Test with a feature branch first

### From Other CI/CD Systems

1. Export environment variables from old system
2. Import to GitHub Secrets and Vercel
3. Adapt workflow files to match your testing setup
4. Run CI pipeline on feature branch to validate
5. Gradually migrate branches to new pipeline

## Next Steps

After implementing this CI/CD pipeline:

1. **Add E2E tests**: Integrate Playwright or Cypress
2. **Set up monitoring**: Configure error tracking (Sentry, LogRocket)
3. **Add performance budgets**: Fail builds if bundle size exceeds limits
4. **Implement preview links**: Test features before merging
5. **Document deployment process**: Create runbook for team

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Next.js CI Build Caching](https://nextjs.org/docs/pages/building-your-application/deploying/ci-build-caching)
- [Vercel CLI Reference](https://vercel.com/docs/cli)

## Support

For issues specific to:
- **Next.js**: [Next.js GitHub Issues](https://github.com/vercel/next.js/issues)
- **Vercel**: [Vercel Support](https://vercel.com/support)
- **GitHub Actions**: [GitHub Community](https://github.community/)

## License

This skill documentation is provided as-is for educational and implementation purposes.
