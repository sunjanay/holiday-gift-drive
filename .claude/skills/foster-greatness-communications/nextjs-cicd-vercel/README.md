# Next.js 16 CI/CD with GitHub Actions & Vercel

A comprehensive skill for setting up production-ready CI/CD pipelines for Next.js 16 applications using GitHub Actions and Vercel.

## 📚 Documentation

- **[SKILL.md](./SKILL.md)** - Complete implementation guide and documentation
- **[examples.md](./examples.md)** - Real-world examples and use cases
- **[reference.md](./reference.md)** - Quick reference, commands, and troubleshooting

## 🚀 Quick Start

### Option 1: Automated Setup (Recommended)

Run the setup script to automatically configure your Next.js project:

```bash
# Make the script executable
chmod +x ./scripts/setup.sh

# Run the setup
./scripts/setup.sh
```

The script will:
- Install required dependencies
- Create GitHub Actions workflow files
- Set up ESLint and Prettier configurations
- Update package.json scripts
- Provide step-by-step instructions for Vercel setup

### Option 2: Manual Setup

1. **Copy workflow files** from `templates/` to your project's `.github/workflows/`
2. **Install dependencies**:
   ```bash
   npm install --save-dev prettier prettier-plugin-tailwindcss eslint-config-prettier eslint-plugin-prettier
   ```
3. **Configure Vercel**: Run `vercel link` in your project
4. **Add GitHub Secrets**:
   - `VERCEL_TOKEN`
   - `VERCEL_ORG_ID`
   - `VERCEL_PROJECT_ID`

## 📁 Project Structure

```
nextjs-cicd-vercel/
├── SKILL.md           # Main documentation
├── examples.md        # Usage examples
├── reference.md       # Quick reference
├── templates/         # Workflow templates
│   ├── ci.yml
│   ├── preview.yml
│   └── production.yml
└── scripts/           # Helper scripts
    └── setup.sh
```

## 🎯 What's Included

### GitHub Actions Workflows

1. **CI Workflow** (`ci.yml`)
   - Runs on all branches and PRs
   - TypeScript type checking
   - ESLint and Prettier checks
   - Automated tests
   - Build verification
   - Multi-version Node.js testing

2. **Preview Deployment** (`preview.yml`)
   - Automatic preview deployments for feature branches
   - Unique preview URLs
   - PR comments with deployment links

3. **Production Deployment** (`production.yml`)
   - Quality gate before deployment
   - Production deployment from main branch
   - Deployment summaries

### Configuration Files

- ESLint configuration (Next.js 16 flat config)
- Prettier configuration with Tailwind plugin
- TypeScript configuration
- Jest configuration (optional)

### npm Scripts

```json
{
  "lint:fix": "Auto-fix linting issues",
  "format": "Format all code",
  "format:check": "Check code formatting",
  "type-check": "TypeScript type checking",
  "test:ci": "Run tests in CI mode",
  "validate": "Run all checks"
}
```

## ✨ Features

- ✅ **Automated Quality Checks**: Linting, formatting, type checking, and testing
- ✅ **Preview Deployments**: Automatic preview URLs for all branches
- ✅ **Production Deployments**: Controlled production releases
- ✅ **Build Caching**: Optimized GitHub Actions caching
- ✅ **Environment Management**: Secure handling of secrets and variables
- ✅ **Next.js 16 Optimized**: Configured for latest Next.js features
- ✅ **TypeScript Support**: Full TypeScript integration
- ✅ **Multi-Environment**: Development, preview, and production configs

## 🔧 Requirements

- Node.js 18 or higher
- Next.js 16
- GitHub repository
- Vercel account (free tier works)
- Git

## 📖 Usage with Claude Code

In Claude Code, you can reference this skill to get guidance on:

```
I need help setting up CI/CD for my Next.js 16 project
```

```
How do I add environment variables to my Vercel deployment?
```

```
My preview deployments aren't working, can you help debug?
```

## 🎓 Learning Path

1. Start with **SKILL.md** for comprehensive setup instructions
2. Check **examples.md** for real-world scenarios
3. Use **reference.md** as a quick reference during development
4. Run the **setup script** for automated configuration

## 🐛 Troubleshooting

Common issues and solutions are documented in:
- [SKILL.md - Troubleshooting Section](./SKILL.md#troubleshooting)
- [reference.md - Troubleshooting Guide](./reference.md#troubleshooting-guide)

## 🔗 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Next.js CI Build Caching](https://nextjs.org/docs/pages/building-your-application/deploying/ci-build-caching)

## 📝 License

This skill is provided as-is for educational and implementation purposes.

## 🤝 Contributing

This skill is maintained as part of Claude Code's skill system. For improvements or issues, please provide feedback through your Claude conversation.

---

**Need help?** Ask Claude Code for assistance with:
- Setting up the pipeline
- Debugging workflow issues
- Optimizing build times
- Adding custom deployment steps
- Environment variable management
