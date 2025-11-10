# CI/CD Setup Checklist

Use this checklist to ensure you've completed all steps for your Next.js 16 CI/CD pipeline.

## Pre-Setup

- [ ] Next.js 16 project initialized
- [ ] Project has a GitHub repository
- [ ] Vercel account created
- [ ] Node.js 18+ installed locally

## Automated Setup (Recommended)

- [ ] Run `chmod +x ./scripts/setup.sh`
- [ ] Run `./scripts/setup.sh`
- [ ] Review changes made by the script

## Manual Setup (Alternative)

### 1. Dependencies

- [ ] Install Prettier: `npm install --save-dev prettier prettier-plugin-tailwindcss`
- [ ] Install ESLint config: `npm install --save-dev eslint-config-prettier eslint-plugin-prettier`
- [ ] Install TypeScript ESLint: `npm install --save-dev @typescript-eslint/parser @typescript-eslint/eslint-plugin`

### 2. Configuration Files

- [ ] Create/update `eslint.config.mjs`
- [ ] Create/update `.prettierrc`
- [ ] Create/update `.prettierignore`
- [ ] Add npm scripts to `package.json`:
  - `lint:fix`
  - `format`
  - `format:check`
  - `type-check`
  - `test:ci`
  - `validate`

### 3. GitHub Actions Workflows

- [ ] Create `.github/workflows/` directory
- [ ] Copy `templates/ci.yml` to `.github/workflows/ci.yml`
- [ ] Copy `templates/preview.yml` to `.github/workflows/preview.yml`
- [ ] Copy `templates/production.yml` to `.github/workflows/production.yml`

## Vercel Configuration

### Link Project

- [ ] Install Vercel CLI: `npm install -g vercel@latest`
- [ ] Login to Vercel: `vercel login`
- [ ] Link project: `vercel link`
- [ ] Verify `.vercel/project.json` was created
- [ ] Add `.vercel` to `.gitignore`

### Get Credentials

- [ ] Open `.vercel/project.json`
- [ ] Copy `projectId`
- [ ] Copy `orgId`
- [ ] Create Vercel token at https://vercel.com/account/tokens
- [ ] Save token securely (you won't see it again)

## GitHub Configuration

### Add Secrets

Go to: **Repository Settings → Secrets and variables → Actions → New repository secret**

- [ ] Add `VERCEL_TOKEN` (your Vercel API token)
- [ ] Add `VERCEL_ORG_ID` (from `.vercel/project.json`)
- [ ] Add `VERCEL_PROJECT_ID` (from `.vercel/project.json`)

### Optional: Branch Protection

Go to: **Repository Settings → Branches → Add branch protection rule**

- [ ] Protect `main` branch
- [ ] Require status checks to pass
- [ ] Require branches to be up to date
- [ ] Require deployments to succeed before merging

## Environment Variables (Optional)

### Local Development

- [ ] Create `.env.local` for local development variables
- [ ] Add `.env*.local` to `.gitignore`

### Vercel Environment Variables

Go to: **Vercel Dashboard → Project → Settings → Environment Variables**

- [ ] Add production environment variables
- [ ] Add preview environment variables
- [ ] Add development environment variables (for `vercel dev`)

## Testing the Pipeline

### Test CI Workflow

- [ ] Create a feature branch: `git checkout -b test/ci-pipeline`
- [ ] Make a small change
- [ ] Commit and push: `git push origin test/ci-pipeline`
- [ ] Go to GitHub Actions tab
- [ ] Verify CI workflow runs successfully
- [ ] Check all steps pass (lint, test, build, etc.)

### Test Preview Deployment

- [ ] Verify preview workflow triggered
- [ ] Wait for deployment to complete
- [ ] Copy preview URL from workflow logs or PR comment
- [ ] Visit preview URL and verify it works
- [ ] Check Vercel dashboard for preview deployment

### Test Production Deployment

- [ ] Create pull request to `main` branch
- [ ] Verify CI checks pass
- [ ] Merge pull request
- [ ] Go to GitHub Actions tab
- [ ] Verify production workflow runs
- [ ] Check deployment summary in workflow
- [ ] Visit production URL and verify changes

## Verification

### Code Quality

- [ ] Run `npm run lint` locally - should pass
- [ ] Run `npm run format:check` - should pass
- [ ] Run `npm run type-check` - should pass
- [ ] Run `npm run test` - should pass
- [ ] Run `npm run validate` - should pass all checks

### Deployments

- [ ] Feature branches deploy to preview
- [ ] Preview URLs are unique per branch
- [ ] Main branch deploys to production
- [ ] Production URL is stable
- [ ] Environment variables work in each environment

### GitHub Actions

- [ ] CI workflow runs on all pushes
- [ ] Preview workflow runs on feature branches
- [ ] Production workflow runs only on main
- [ ] Workflow caching is working (check run times)
- [ ] Status checks appear in pull requests

## Post-Setup

### Documentation

- [ ] Update repository README with deployment information
- [ ] Add status badges to README (optional)
- [ ] Document any custom environment variables
- [ ] Create runbook for deployment procedures

### Team Setup

- [ ] Share Vercel project access with team
- [ ] Document branch naming conventions
- [ ] Set up code review requirements
- [ ] Configure notification preferences

### Optimization

- [ ] Review build times and optimize if needed
- [ ] Consider adding E2E tests
- [ ] Set up error monitoring (Sentry, LogRocket, etc.)
- [ ] Configure performance monitoring

## Common Issues Checklist

If something isn't working, check:

- [ ] All GitHub secrets are set correctly
- [ ] `.vercel` directory is in `.gitignore`
- [ ] Vercel CLI is installed and authenticated
- [ ] Node version matches between local and CI
- [ ] All dependencies are in `package.json`
- [ ] Workflow YAML files have correct indentation
- [ ] Environment variables use correct naming (`NEXT_PUBLIC_` for client-side)

## Resources

- [ ] Bookmark Next.js documentation
- [ ] Bookmark Vercel documentation
- [ ] Bookmark GitHub Actions documentation
- [ ] Save this checklist for future projects

## Success Criteria

Your CI/CD pipeline is fully set up when:

✅ Pushing to any branch triggers CI checks
✅ Feature branches automatically deploy to preview
✅ Pull requests show deployment status
✅ Merging to main deploys to production
✅ All team members can trigger deployments
✅ Environment variables are properly configured
✅ Build caching reduces CI run times
✅ Status checks prevent merging broken code

---

**Completed?** Congratulations! Your Next.js 16 CI/CD pipeline is ready. 🎉

**Need help?** Refer to:
- SKILL.md for detailed documentation
- examples.md for usage patterns
- reference.md for quick commands and troubleshooting
