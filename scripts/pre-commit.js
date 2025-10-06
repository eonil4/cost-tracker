#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🔍 Running pre-commit checks...\n');

try {
  // Get list of staged files
  const stagedFiles = execSync('git diff --cached --name-only', { encoding: 'utf8' })
    .trim()
    .split('\n')
    .filter(file => file && file.startsWith('src/') && (file.endsWith('.ts') || file.endsWith('.tsx')));

  if (stagedFiles.length === 0) {
    console.log('✅ No TypeScript files in src/ directory to check');
    process.exit(0);
  }

  console.log(`📁 Found ${stagedFiles.length} staged TypeScript files in src/:`);
  stagedFiles.forEach(file => console.log(`   - ${file}`));
  console.log('');

  // Step 1: Run ESLint on changed files
  console.log('🔧 Step 1: Running ESLint on changed files...');
  try {
    execSync(`npx eslint ${stagedFiles.join(' ')}`, { stdio: 'inherit' });
    console.log('✅ ESLint passed\n');
  } catch (error) {
    console.error('❌ ESLint failed. Please fix the errors before committing.');
    process.exit(1);
  }

  // Step 2: Run build
  console.log('🏗️  Step 2: Running build...');
  try {
    execSync('npm run build', { stdio: 'inherit' });
    console.log('✅ Build passed\n');
  } catch (error) {
    console.error('❌ Build failed. Please fix the errors before committing.');
    process.exit(1);
  }

  // Step 3: Run tests with coverage on changed files
  console.log('🧪 Step 3: Running tests with coverage on changed files...');
  
  // Find corresponding test files
  const testFiles = [];
  stagedFiles.forEach(file => {
    // Convert src/path/file.tsx to src/test/path/file.test.tsx
    const relativePath = file.replace('src/', '');
    const baseName = relativePath.replace(/\.(ts|tsx)$/, '');
    
    const testFileTsx = `src/test/${baseName}.test.tsx`;
    const testFileTs = `src/test/${baseName}.test.ts`;
    
    if (fs.existsSync(testFileTsx)) {
      testFiles.push(testFileTsx);
    } else if (fs.existsSync(testFileTs)) {
      testFiles.push(testFileTs);
    }
  });

  if (testFiles.length > 0) {
    console.log(`📋 Running tests for: ${testFiles.join(', ')}`);
    try {
      execSync(`npx vitest run --coverage ${testFiles.join(' ')}`, { stdio: 'inherit' });
      console.log('✅ Tests passed\n');
    } catch (error) {
      console.error('❌ Tests failed. Please fix the errors before committing.');
      process.exit(1);
    }
  } else {
    console.log('ℹ️  No corresponding test files found for changed source files');
    console.log('✅ Skipping test execution\n');
  }

  console.log('🎉 All pre-commit checks passed! You can now commit your changes.');

} catch (error) {
  console.error('❌ Pre-commit checks failed:', error.message);
  process.exit(1);
}
