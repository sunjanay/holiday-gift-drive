#!/usr/bin/env node

/**
 * Next.js 16 Config Generator
 * 
 * Generates a complete next.config.ts with common Next.js 16 settings
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

const configTemplate = (options) => `import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  ${options.cacheComponents ? '// Enable Cache Components\n  cacheComponents: true,\n' : ''}
  ${options.cacheProfiles ? `// Custom cache profiles
  cacheLife: {
    'blog': {
      revalidate: 3600,  // 1 hour
      expire: 7200,      // 2 hours
    },
    'products': {
      revalidate: 1800,  // 30 minutes
      expire: 3600,      // 1 hour
    },
  },
` : ''}
  ${options.turbopack ? `// Turbopack optimizations
  experimental: {
    turbopackFileSystemCacheForDev: true,
  },
` : ''}
  ${options.reactCompiler ? `// React Compiler (automatic memoization)
  reactCompiler: true,
` : ''}
  ${options.images ? `// Image optimization
  images: {
    minimumCacheTTL: 14400, // 4 hours
    imageSizes: [32, 48, 64, 96, 128, 256, 384],
    qualities: [75],
    dangerouslyAllowLocalIP: false,
    maximumRedirects: 3,
    ${options.remotePatterns ? `
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '${options.remotePatterns}',
      },
    ],` : ''}
  },
` : ''}
  ${options.typescript ? `// TypeScript
  typescript: {
    ignoreBuildErrors: false,
  },
` : ''}
  ${options.eslint ? `// ESLint
  eslint: {
    ignoreDuringBuilds: false,
    dirs: ['app', 'components', 'lib'],
  },
` : ''}
  ${options.output ? `// Output mode for Docker/self-hosting
  output: 'standalone',
` : ''}
  ${options.removeConsole ? `// Remove console logs in production
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
` : ''}
};

export default nextConfig;
`;

async function main() {
  console.log('\\n🚀 Next.js 16 Config Generator\\n');
  
  const options = {};
  
  // Ask questions
  const cacheComponents = await question('Enable Cache Components? (y/n) [y]: ');
  options.cacheComponents = !cacheComponents || cacheComponents.toLowerCase() === 'y';
  
  if (options.cacheComponents) {
    const cacheProfiles = await question('Add custom cache profiles? (y/n) [n]: ');
    options.cacheProfiles = cacheProfiles.toLowerCase() === 'y';
  }
  
  const turbopack = await question('Enable Turbopack file system caching? (y/n) [y]: ');
  options.turbopack = !turbopack || turbopack.toLowerCase() === 'y';
  
  const reactCompiler = await question('Enable React Compiler? (y/n) [n]: ');
  options.reactCompiler = reactCompiler.toLowerCase() === 'y';
  
  const images = await question('Configure image optimization? (y/n) [y]: ');
  options.images = !images || images.toLowerCase() === 'y';
  
  if (options.images) {
    const remotePatterns = await question('Remote image hostname (e.g., example.com) [skip]: ');
    if (remotePatterns) {
      options.remotePatterns = remotePatterns;
    }
  }
  
  const typescript = await question('Configure TypeScript? (y/n) [y]: ');
  options.typescript = !typescript || typescript.toLowerCase() === 'y';
  
  const eslint = await question('Configure ESLint? (y/n) [y]: ');
  options.eslint = !eslint || eslint.toLowerCase() === 'y';
  
  const output = await question('Enable standalone output (Docker)? (y/n) [n]: ');
  options.output = output.toLowerCase() === 'y';
  
  const removeConsole = await question('Remove console logs in production? (y/n) [y]: ');
  options.removeConsole = !removeConsole || removeConsole.toLowerCase() === 'y';
  
  // Generate config
  const config = configTemplate(options);
  
  // Write to file
  const outputPath = path.join(process.cwd(), 'next.config.ts');
  
  if (fs.existsSync(outputPath)) {
    const overwrite = await question('\\nnext.config.ts already exists. Overwrite? (y/n) [n]: ');
    if (overwrite.toLowerCase() !== 'y') {
      console.log('\\n❌ Cancelled. Config not written.\\n');
      rl.close();
      return;
    }
    
    // Backup existing config
    const backupPath = path.join(process.cwd(), 'next.config.ts.backup');
    fs.copyFileSync(outputPath, backupPath);
    console.log(\`\\n📦 Backed up existing config to next.config.ts.backup\\n\`);
  }
  
  fs.writeFileSync(outputPath, config);
  console.log('\\n✅ Generated next.config.ts\\n');
  
  // Show additional steps
  console.log('Next steps:\\n');
  
  if (options.reactCompiler) {
    console.log('  Install React Compiler:');
    console.log('  $ npm install babel-plugin-react-compiler@latest\\n');
  }
  
  if (options.images && options.remotePatterns) {
    console.log('  Your remote pattern is configured for:', options.remotePatterns);
    console.log('  Add more patterns in next.config.ts as needed\\n');
  }
  
  console.log('  Test your configuration:');
  console.log('  $ npm run dev\\n');
  
  rl.close();
}

main().catch((error) => {
  console.error('\\nError:', error.message);
  rl.close();
  process.exit(1);
});
