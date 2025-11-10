# Examples and Use Cases

This document provides practical examples and real-world scenarios for implementing CI/CD with Next.js 16, GitHub Actions, and Vercel.

## Table of Contents

- [Complete Project Setup Example](#complete-project-setup-example)
- [Common Workflow Patterns](#common-workflow-patterns)
- [Environment-Specific Examples](#environment-specific-examples)
- [Advanced Configurations](#advanced-configurations)
- [Real-World Scenarios](#real-world-scenarios)

## Complete Project Setup Example

### Scenario: Setting up a new Next.js 16 project from scratch

```bash
# 1. Create new Next.js 16 project
npx create-next-app@latest my-saas-app \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir

cd my-saas-app

# 2. Install CI/CD dependencies
npm install --save-dev \
  prettier \
  prettier-plugin-tailwindcss \
  eslint-config-prettier \
  eslint-plugin-prettier \
  jest \
  @testing-library/react \
  @testing-library/jest-dom \
  jest-environment-jsdom

# 3. Initialize git repository
git init
git add .
git commit -m "Initial commit"

# 4. Create GitHub repository and push
gh repo create my-saas-app --public --source=. --push

# 5. Link to Vercel
vercel link

# 6. Setup is complete! Push to trigger workflows
git push origin main
```

## Common Workflow Patterns

### Pattern 1: Basic CI with Quality Checks

**Use Case**: Small project, single developer or small team

```yaml
name: Basic CI

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check
      - run: npm test
```

**When to use**: 
- Simple projects
- No deployment automation needed yet
- Testing CI/CD setup

---

### Pattern 2: Multi-Stage Pipeline with Approvals

**Use Case**: Production application requiring manual approval before deployment

```yaml
name: Production with Approval

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run validate

  deploy-staging:
    needs: test
    runs-on: ubuntu-latest
    environment: staging
    steps:
      - uses: actions/checkout@v4
      - name: Deploy to Staging
        run: |
          npm install -g vercel
          vercel deploy --token=${{ secrets.VERCEL_TOKEN }}

  deploy-production:
    needs: deploy-staging
    runs-on: ubuntu-latest
    environment: production  # Requires manual approval
    steps:
      - uses: actions/checkout@v4
      - name: Deploy to Production
        run: |
          npm install -g vercel
          vercel deploy --prod --token=${{ secrets.VERCEL_TOKEN }}
```

**GitHub Environment Setup**:
1. Go to **Settings** → **Environments**
2. Create "production" environment
3. Add required reviewers
4. Set deployment protection rules

**When to use**:
- High-stakes production deployments
- Regulated industries
- Multiple stakeholders need to approve

---

### Pattern 3: Monorepo with Multiple Apps

**Use Case**: Multiple Next.js apps in a single repository

```yaml
name: Monorepo CI/CD

on:
  push:
    branches: ['**']

jobs:
  changes:
    runs-on: ubuntu-latest
    outputs:
      web: ${{ steps.filter.outputs.web }}
      admin: ${{ steps.filter.outputs.admin }}
    steps:
      - uses: actions/checkout@v4
      - uses: dorny/paths-filter@v2
        id: filter
        with:
          filters: |
            web:
              - 'apps/web/**'
              - 'packages/**'
            admin:
              - 'apps/admin/**'
              - 'packages/**'

  test-web:
    needs: changes
    if: needs.changes.outputs.web == 'true'
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: apps/web
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm test

  deploy-web:
    needs: test-web
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    environment:
      name: web-production
    steps:
      - uses: actions/checkout@v4
      - name: Deploy Web App
        working-directory: apps/web
        env:
          VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
          VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID_WEB }}
        run: |
          npm install -g vercel
          vercel deploy --prod --token=${{ secrets.VERCEL_TOKEN }}

  test-admin:
    needs: changes
    if: needs.changes.outputs.admin == 'true'
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: apps/admin
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npm test

  deploy-admin:
    needs: test-admin
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    environment:
      name: admin-production
    steps:
      - uses: actions/checkout@v4
      - name: Deploy Admin App
        working-directory: apps/admin
        env:
          VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
          VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID_ADMIN }}
        run: |
          npm install -g vercel
          vercel deploy --prod --token=${{ secrets.VERCEL_TOKEN }}
```

**When to use**:
- Multiple apps in one repo
- Shared component libraries
- Need independent deployment of apps

---

## Environment-Specific Examples

### Example 1: Development Environment Variables

**.env.development** (for `next dev`):
```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_ANALYTICS_ID=dev-analytics-id
DATABASE_URL=postgresql://localhost:5432/myapp_dev
REDIS_URL=redis://localhost:6379
```

### Example 2: Preview Environment Variables

**Vercel Dashboard → Project → Settings → Environment Variables:**

Environment: **Preview**
```
NEXT_PUBLIC_API_URL=https://api-preview.example.com
NEXT_PUBLIC_ANALYTICS_ID=preview-analytics-id
DATABASE_URL=[preview database connection]
FEATURE_FLAG_NEW_UI=true
```

**Dynamic Preview URLs in Tests:**

```yaml
# .github/workflows/preview.yml
- name: Deploy and Test
  run: |
    url=$(vercel deploy --token=${{ secrets.VERCEL_TOKEN }})
    echo "PREVIEW_URL=$url" >> $GITHUB_ENV

- name: Run E2E Tests
  env:
    BASE_URL: ${{ env.PREVIEW_URL }}
  run: npm run test:e2e
```

### Example 3: Production Environment Variables

**Vercel Dashboard → Project → Settings → Environment Variables:**

Environment: **Production**
```
NEXT_PUBLIC_API_URL=https://api.example.com
NEXT_PUBLIC_ANALYTICS_ID=prod-analytics-id
DATABASE_URL=[production database connection]
STRIPE_SECRET_KEY=[production stripe key]
FEATURE_FLAG_NEW_UI=false
```

### Example 4: Environment-Specific Next.js Config

**next.config.js:**

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    CUSTOM_ENV: process.env.CUSTOM_ENV,
  },
  
  // Different config per environment
  ...(process.env.NODE_ENV === 'production' && {
    productionBrowserSourceMaps: false,
    compiler: {
      removeConsole: {
        exclude: ['error', 'warn'],
      },
    },
  }),
  
  // Preview-specific config
  ...(process.env.VERCEL_ENV === 'preview' && {
    experimental: {
      // Enable experimental features in preview
    },
  }),
};

module.exports = nextConfig;
```

---

## Advanced Configurations

### Example 1: Bundle Size Monitoring

**Workflow with bundle size check:**

```yaml
name: CI with Bundle Analysis

on: [pull_request]

jobs:
  analyze:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      
      - run: npm ci
      
      - name: Build and analyze bundle
        run: |
          npm run build
          npm install -g @next/bundle-analyzer
      
      - name: Check bundle size
        run: |
          BUNDLE_SIZE=$(du -sh .next | cut -f1)
          echo "Bundle size: $BUNDLE_SIZE"
          # Add logic to fail if size exceeds threshold

      - name: Comment bundle size on PR
        uses: actions/github-script@v7
        with:
          script: |
            const fs = require('fs');
            const stats = fs.readFileSync('.next/analyze/__bundle_analysis.json');
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: `Bundle Analysis:\n\`\`\`json\n${stats}\n\`\`\``
            })
```

**package.json:**
```json
{
  "scripts": {
    "analyze": "ANALYZE=true next build"
  }
}
```

**next.config.js:**
```javascript
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
  // your config
});
```

---

### Example 2: Lighthouse CI Integration

```yaml
name: Performance Check

on: [pull_request]

jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Deploy preview
        id: deploy
        run: |
          npm install -g vercel
          echo "url=$(vercel deploy --token=${{ secrets.VERCEL_TOKEN }})" >> $GITHUB_OUTPUT
      
      - name: Run Lighthouse CI
        uses: treosh/lighthouse-ci-action@v10
        with:
          urls: |
            ${{ steps.deploy.outputs.url }}
            ${{ steps.deploy.outputs.url }}/about
          uploadArtifacts: true
          temporaryPublicStorage: true
      
      - name: Comment Lighthouse results
        uses: actions/github-script@v7
        with:
          script: |
            // Parse and comment Lighthouse scores
```

---

### Example 3: Visual Regression Testing

```yaml
name: Visual Regression

on: [pull_request]

jobs:
  visual-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Deploy preview
        id: deploy
        run: |
          npm install -g vercel
          echo "url=$(vercel deploy --token=${{ secrets.VERCEL_TOKEN }})" >> $GITHUB_OUTPUT
      
      - name: Run Percy visual tests
        uses: percy/exec-action@v0.3.1
        with:
          custom-command: npx percy snapshot ${{ steps.deploy.outputs.url }}
        env:
          PERCY_TOKEN: ${{ secrets.PERCY_TOKEN }}
```

---

### Example 4: Database Migrations in CI/CD

```yaml
name: Production Deploy with Migrations

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      
      - name: Run database migrations
        env:
          DATABASE_URL: ${{ secrets.PRODUCTION_DATABASE_URL }}
        run: |
          npm ci
          npm run db:migrate
      
      - name: Deploy to production
        env:
          VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
          VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}
        run: |
          npm install -g vercel
          vercel pull --yes --environment=production --token=${{ secrets.VERCEL_TOKEN }}
          vercel build --prod --token=${{ secrets.VERCEL_TOKEN }}
          vercel deploy --prebuilt --prod --token=${{ secrets.VERCEL_TOKEN }}
```

---

## Real-World Scenarios

### Scenario 1: SaaS Application with Customer Preview Environments

**Requirements**:
- Each customer gets preview environment
- Feature flags per customer
- Isolated databases

**Implementation**:

```yaml
name: Customer Preview Deployment

on:
  push:
    branches:
      - 'customer/*'

jobs:
  deploy-customer-preview:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Extract customer ID
        id: customer
        run: |
          BRANCH_NAME=${GITHUB_REF#refs/heads/}
          CUSTOMER_ID=$(echo $BRANCH_NAME | cut -d'/' -f2)
          echo "id=$CUSTOMER_ID" >> $GITHUB_OUTPUT
      
      - name: Deploy customer environment
        env:
          CUSTOMER_ID: ${{ steps.customer.outputs.id }}
          VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
          VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}
        run: |
          npm install -g vercel
          vercel deploy \
            --token=${{ secrets.VERCEL_TOKEN }} \
            --build-env NEXT_PUBLIC_CUSTOMER_ID=$CUSTOMER_ID \
            --build-env DATABASE_URL=${{ secrets.CUSTOMER_DB_PREFIX }}$CUSTOMER_ID
```

---

### Scenario 2: E-commerce Site with Staging Approval

**Requirements**:
- Deploy to staging automatically
- Require product owner approval for production
- Rollback capability

**Implementation**:

```yaml
name: E-commerce Deploy

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm test
      - run: npm run test:e2e

  deploy-staging:
    needs: test
    runs-on: ubuntu-latest
    environment: staging
    steps:
      - uses: actions/checkout@v4
      - name: Deploy to staging
        id: staging
        run: |
          npm install -g vercel
          vercel deploy --token=${{ secrets.VERCEL_TOKEN }}
      
      - name: Run smoke tests
        run: npm run test:smoke -- --url=${{ steps.staging.outputs.url }}

  deploy-production:
    needs: deploy-staging
    runs-on: ubuntu-latest
    environment: 
      name: production
      url: https://shop.example.com
    steps:
      - uses: actions/checkout@v4
      
      - name: Create deployment
        id: deployment
        uses: actions/github-script@v7
        with:
          script: |
            const deployment = await github.rest.repos.createDeployment({
              owner: context.repo.owner,
              repo: context.repo.repo,
              ref: context.sha,
              environment: 'production',
              required_contexts: []
            });
            return deployment.data.id;
      
      - name: Deploy to production
        run: |
          npm install -g vercel
          vercel deploy --prod --token=${{ secrets.VERCEL_TOKEN }}
      
      - name: Update deployment status
        if: always()
        uses: actions/github-script@v7
        with:
          script: |
            await github.rest.repos.createDeploymentStatus({
              owner: context.repo.owner,
              repo: context.repo.repo,
              deployment_id: ${{ steps.deployment.outputs.result }},
              state: '${{ job.status }}' === 'success' ? 'success' : 'failure',
              environment_url: 'https://shop.example.com'
            });
```

---

### Scenario 3: Agency Managing Multiple Client Sites

**Requirements**:
- Different Vercel projects per client
- Shared CI configuration
- Client-specific secrets

**Project Structure**:
```
agency-sites/
├── .github/
│   └── workflows/
│       └── deploy-client.yml
├── clients/
│   ├── client-a/
│   │   ├── next.config.js
│   │   └── .vercel.json
│   ├── client-b/
│   │   ├── next.config.js
│   │   └── .vercel.json
│   └── client-c/
└── shared/
    └── components/
```

**Workflow**:

```yaml
name: Client Deployment

on:
  push:
    paths:
      - 'clients/**'

jobs:
  detect-changes:
    runs-on: ubuntu-latest
    outputs:
      clients: ${{ steps.changes.outputs.clients }}
    steps:
      - uses: actions/checkout@v4
      - id: changes
        uses: dorny/paths-filter@v2
        with:
          filters: |
            client-a:
              - 'clients/client-a/**'
            client-b:
              - 'clients/client-b/**'
            client-c:
              - 'clients/client-c/**'

  deploy-client:
    needs: detect-changes
    runs-on: ubuntu-latest
    strategy:
      matrix:
        client: [client-a, client-b, client-c]
    if: needs.detect-changes.outputs.clients[matrix.client] == 'true'
    steps:
      - uses: actions/checkout@v4
      
      - name: Deploy ${{ matrix.client }}
        working-directory: clients/${{ matrix.client }}
        env:
          VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
          VERCEL_PROJECT_ID: ${{ secrets[format('VERCEL_PROJECT_ID_{0}', matrix.client)] }}
        run: |
          npm install -g vercel
          vercel deploy --prod --token=${{ secrets.VERCEL_TOKEN }}
```

**GitHub Secrets Setup**:
```
VERCEL_TOKEN
VERCEL_ORG_ID
VERCEL_PROJECT_ID_CLIENT_A
VERCEL_PROJECT_ID_CLIENT_B
VERCEL_PROJECT_ID_CLIENT_C
```

---

## Tips and Best Practices from Examples

### 1. Caching Strategy

**Good**: Cache with fallback keys
```yaml
- uses: actions/cache@v4
  with:
    path: |
      ~/.npm
      .next/cache
    key: ${{ runner.os }}-next-${{ hashFiles('package-lock.json') }}-${{ hashFiles('**/*.{js,jsx,ts,tsx}') }}
    restore-keys: |
      ${{ runner.os }}-next-${{ hashFiles('package-lock.json') }}-
      ${{ runner.os }}-next-
```

**Better**: Include environment in key
```yaml
key: ${{ runner.os }}-next-${{ env.NODE_ENV }}-${{ hashFiles('package-lock.json') }}
```

### 2. Secrets Management

**Avoid**: Inline secrets
```yaml
run: vercel deploy --token=sk_live_xxx
```

**Use**: GitHub Secrets
```yaml
run: vercel deploy --token=${{ secrets.VERCEL_TOKEN }}
```

### 3. Error Handling

**Basic**:
```yaml
- name: Deploy
  run: vercel deploy
```

**Better**: With error context
```yaml
- name: Deploy
  id: deploy
  run: |
    set -e
    url=$(vercel deploy --token=${{ secrets.VERCEL_TOKEN }})
    echo "url=$url" >> $GITHUB_OUTPUT
  continue-on-error: false

- name: Handle deployment failure
  if: failure() && steps.deploy.outcome == 'failure'
  run: |
    echo "Deployment failed, check logs"
    exit 1
```

### 4. Testing Preview Deployments

```yaml
- name: Deploy Preview
  id: preview
  run: |
    url=$(vercel deploy --token=${{ secrets.VERCEL_TOKEN }})
    echo "url=$url" >> $GITHUB_OUTPUT

- name: Wait for deployment
  run: |
    npx wait-on ${{ steps.preview.outputs.url }} -t 30000

- name: Test preview
  env:
    PREVIEW_URL: ${{ steps.preview.outputs.url }}
  run: npm run test:e2e
```

## Next Steps

Explore these resources for more advanced patterns:

- [GitHub Actions Marketplace](https://github.com/marketplace?type=actions)
- [Vercel Examples Repository](https://github.com/vercel/examples)
- [Next.js Examples](https://github.com/vercel/next.js/tree/canary/examples)
