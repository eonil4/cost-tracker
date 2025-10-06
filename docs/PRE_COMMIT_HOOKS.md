# Pre-commit Hooks

This project includes pre-commit hooks that automatically run quality checks before each commit to ensure code quality and prevent broken code from being committed.

## What Runs Before Each Commit

The pre-commit hooks will automatically execute the following steps on **changed files in the `./src` folder**:

1. **ESLint** - Lints and fixes code style issues
2. **Build** - Ensures the project builds successfully
3. **Tests with Coverage** - Runs tests for changed files and generates coverage reports

## How It Works

### Local Development (Husky + lint-staged)

When you run `git commit`, the following happens automatically:

1. **Husky** intercepts the commit
2. **lint-staged** runs ESLint on staged TypeScript files in `src/`
3. **Custom pre-commit script** runs build and tests
4. If any step fails, the commit is **blocked**

### GitHub Actions (CI/CD)

The same checks run automatically on:
- Push to `main`, `develop`, or `develop-local-storage` branches
- Pull requests to these branches
- Manual workflow dispatch

## Setup

The pre-commit hooks are already configured. If you need to reinstall them:

```bash
# Install dependencies (if not already done)
npm install

# Initialize husky (if not already done)
npx husky init
```

## Manual Execution

You can manually run the pre-commit checks:

```bash
# Run all pre-commit checks
npm run pre-commit

# Run individual checks
npm run lint          # ESLint on all files
npm run build         # Build the project
npm run test:run:coverage  # Run tests with coverage
```

## Bypassing Hooks (Not Recommended)

If you absolutely need to bypass the pre-commit hooks (not recommended):

```bash
git commit --no-verify -m "your commit message"
```

## Troubleshooting

### ESLint Errors
- Fix the linting errors shown in the output
- The linter will auto-fix some issues
- Re-stage the fixed files: `git add .`

### Build Errors
- Fix TypeScript compilation errors
- Ensure all imports are correct
- Re-stage the fixed files: `git add .`

### Test Failures
- Fix failing tests
- Ensure test coverage meets requirements
- Re-stage the fixed files: `git add .`

### Hook Not Running
If the pre-commit hook isn't running:

1. Check if husky is installed: `ls .husky/`
2. Reinstall husky: `npx husky init`
3. Check file permissions: `chmod +x .husky/pre-commit`

## Configuration Files

- `.husky/pre-commit` - Husky pre-commit hook configuration
- `scripts/pre-commit.js` - Custom pre-commit script
- `package.json` - npm scripts and lint-staged configuration
- `.github/workflows/pre-commit-checks.yml` - GitHub Actions workflow

## Benefits

- **Prevents broken code** from being committed
- **Ensures consistent code style** across the project
- **Maintains test coverage** by running tests on changed files
- **Catches issues early** before they reach the main branch
- **Automated quality gates** for both local and CI environments
