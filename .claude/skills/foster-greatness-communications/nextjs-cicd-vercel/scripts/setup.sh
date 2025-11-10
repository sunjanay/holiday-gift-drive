#!/bin/bash

# Next.js 16 CI/CD Setup Script
# This script automates the setup of GitHub Actions workflows and Vercel configuration

set -e  # Exit on error

echo "🚀 Next.js 16 CI/CD Setup"
echo "========================="
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if we're in a Next.js project
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: package.json not found. Are you in a Next.js project directory?${NC}"
    exit 1
fi

# Check if Next.js is installed
if ! grep -q '"next"' package.json; then
    echo -e "${RED}❌ Error: Next.js not found in package.json${NC}"
    exit 1
fi

echo -e "${BLUE}📦 Checking dependencies...${NC}"

# Install required dependencies
echo -e "${YELLOW}Installing CI/CD dependencies...${NC}"
npm install --save-dev \
    prettier \
    prettier-plugin-tailwindcss \
    eslint-config-prettier \
    eslint-plugin-prettier \
    @typescript-eslint/parser \
    @typescript-eslint/eslint-plugin

echo -e "${GREEN}✅ Dependencies installed${NC}"
echo ""

# Create .github/workflows directory
echo -e "${BLUE}📁 Creating workflow directory...${NC}"
mkdir -p .github/workflows

# Get the skill directory (where this script is located)
SKILL_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )/.."

# Copy workflow templates
echo -e "${YELLOW}Copying workflow templates...${NC}"
cp "$SKILL_DIR/templates/ci.yml" .github/workflows/ci.yml
cp "$SKILL_DIR/templates/preview.yml" .github/workflows/preview.yml
cp "$SKILL_DIR/templates/production.yml" .github/workflows/production.yml

echo -e "${GREEN}✅ Workflows created${NC}"
echo ""

# Create ESLint config if it doesn't exist
if [ ! -f "eslint.config.mjs" ]; then
    echo -e "${YELLOW}Creating ESLint configuration...${NC}"
    cat > eslint.config.mjs << 'EOF'
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
EOF
    echo -e "${GREEN}✅ ESLint config created${NC}"
else
    echo -e "${BLUE}ℹ️  ESLint config already exists${NC}"
fi
echo ""

# Create Prettier config if it doesn't exist
if [ ! -f ".prettierrc" ]; then
    echo -e "${YELLOW}Creating Prettier configuration...${NC}"
    cat > .prettierrc << 'EOF'
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
EOF
    echo -e "${GREEN}✅ Prettier config created${NC}"
else
    echo -e "${BLUE}ℹ️  Prettier config already exists${NC}"
fi
echo ""

# Create .prettierignore if it doesn't exist
if [ ! -f ".prettierignore" ]; then
    echo -e "${YELLOW}Creating .prettierignore...${NC}"
    cat > .prettierignore << 'EOF'
node_modules
.next
.vercel
out
build
coverage
*.log
.env*.local
.eslintcache
EOF
    echo -e "${GREEN}✅ .prettierignore created${NC}"
else
    echo -e "${BLUE}ℹ️  .prettierignore already exists${NC}"
fi
echo ""

# Update package.json scripts
echo -e "${YELLOW}Updating package.json scripts...${NC}"

# Check if jq is installed
if ! command -v jq &> /dev/null; then
    echo -e "${YELLOW}⚠️  jq not found. Please manually add the following scripts to package.json:${NC}"
    cat << 'EOF'

"scripts": {
  "lint:fix": "next lint --fix",
  "format": "prettier --write \"**/*.{js,jsx,ts,tsx,json,css,md}\"",
  "format:check": "prettier --check \"**/*.{js,jsx,ts,tsx,json,css,md}\"",
  "type-check": "tsc --noEmit",
  "test:ci": "jest --ci --coverage --maxWorkers=2",
  "validate": "npm run type-check && npm run lint && npm run format:check && npm run test:ci"
}
EOF
else
    # Backup package.json
    cp package.json package.json.backup
    
    # Add scripts using jq
    jq '.scripts += {
      "lint:fix": "next lint --fix",
      "format": "prettier --write \"**/*.{js,jsx,ts,tsx,json,css,md}\"",
      "format:check": "prettier --check \"**/*.{js,jsx,ts,tsx,json,css,md}\"",
      "type-check": "tsc --noEmit",
      "test:ci": "jest --ci --coverage --maxWorkers=2",
      "validate": "npm run type-check && npm run lint && npm run format:check && npm run test:ci"
    }' package.json > package.json.tmp && mv package.json.tmp package.json
    
    echo -e "${GREEN}✅ package.json scripts updated${NC}"
fi
echo ""

# Update .gitignore
echo -e "${YELLOW}Updating .gitignore...${NC}"
if [ -f ".gitignore" ]; then
    # Add Vercel folder if not present
    if ! grep -q ".vercel" .gitignore; then
        echo ".vercel" >> .gitignore
        echo -e "${GREEN}✅ Added .vercel to .gitignore${NC}"
    fi
    # Add env files if not present
    if ! grep -q ".env*.local" .gitignore; then
        echo ".env*.local" >> .gitignore
        echo -e "${GREEN}✅ Added .env*.local to .gitignore${NC}"
    fi
else
    echo -e "${YELLOW}Creating .gitignore...${NC}"
    cat > .gitignore << 'EOF'
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
EOF
    echo -e "${GREEN}✅ .gitignore created${NC}"
fi
echo ""

# Instructions for Vercel setup
echo -e "${BLUE}📋 Next Steps:${NC}"
echo ""
echo "1. Link your project to Vercel:"
echo "   ${GREEN}vercel link${NC}"
echo ""
echo "2. Get your project IDs from .vercel/project.json:"
echo "   ${GREEN}cat .vercel/project.json${NC}"
echo ""
echo "3. Create a Vercel token:"
echo "   ${GREEN}https://vercel.com/account/tokens${NC}"
echo ""
echo "4. Add GitHub Secrets (Settings → Secrets and variables → Actions):"
echo "   - VERCEL_TOKEN"
echo "   - VERCEL_ORG_ID"
echo "   - VERCEL_PROJECT_ID"
echo ""
echo "5. Commit and push your changes:"
echo "   ${GREEN}git add .${NC}"
echo "   ${GREEN}git commit -m \"Add CI/CD pipeline\"${NC}"
echo "   ${GREEN}git push${NC}"
echo ""
echo -e "${GREEN}✅ Setup complete! Your CI/CD pipeline is ready.${NC}"
echo ""
echo "📚 For more information, see:"
echo "   - SKILL.md for comprehensive documentation"
echo "   - examples.md for usage examples"
echo "   - reference.md for quick reference"
