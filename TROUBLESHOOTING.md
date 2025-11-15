# Troubleshooting Guide

## Common Issues and Solutions

### Test Issues

#### 1. Module Resolution Errors
**Problem**: `Cannot find module` errors in tests
**Solution**: 
- Check import paths are correct relative to test file location
- Ensure all source files exist
- Verify Jest configuration includes correct file extensions

#### 2. React Native Testing Issues
**Problem**: `Cannot use import statement outside a module`
**Solution**: 
- Configure Jest with proper `transformIgnorePatterns`
- Use React Native preset for frontend tests
- Separate backend and frontend test configurations

#### 3. Missing Dependencies
**Problem**: Module not found errors for dependencies
**Solution**:
```bash
# Install missing dependencies
pnpm add <package-name>
pnpm add -D <dev-package-name>
```

### ESLint Issues

#### 1. Missing ESLint Config
**Problem**: `ESLint couldn't find the config "@react-native-community"`
**Solution**:
```bash
pnpm add -D -w @react-native-community/eslint-config
```

#### 2. TypeScript ESLint Issues
**Problem**: TypeScript parsing errors
**Solution**: Ensure proper TypeScript and ESLint plugin versions are installed

### Build Issues

#### 1. Path Length Issues (Windows)
**Problem**: `Filename too long` errors
**Solution**: 
- Add comprehensive `.gitignore` to exclude `node_modules`
- Use shorter project paths
- Enable long path support in Windows

#### 2. Environment Variables
**Problem**: Missing environment configuration
**Solution**:
- Copy `.env.example` to `.env`
- Configure all required environment variables
- Never commit `.env` files to version control

### Git Issues

#### 1. Secret Detection
**Problem**: GitHub blocks push due to secrets
**Solution**:
- Remove secrets from `.env` files
- Add `.env` to `.gitignore`
- Use environment variables in deployment

#### 2. Large File Issues
**Problem**: Git fails to add large files
**Solution**:
- Exclude `node_modules` and build directories
- Use `.gitignore` properly
- Consider Git LFS for large assets

## Quick Fixes

### Reset Test Environment
```bash
# Clean install
rm -rf node_modules
rm pnpm-lock.yaml
pnpm install

# Run tests
pnpm test
```

### Fix ESLint
```bash
# Install missing configs
pnpm add -D -w @react-native-community/eslint-config

# Run linting
pnpm lint
```

### Clean Git State
```bash
# Reset git index
git reset
git add .
git commit -m "Fix: Resolve build and test issues"
```

## Development Workflow

1. **Before committing**:
   - Run `pnpm test` to ensure tests pass
   - Run `pnpm lint` to check code quality
   - Verify `.env` files are not staged

2. **When adding dependencies**:
   - Use workspace flag for root dependencies: `pnpm add -w <package>`
   - Add to specific workspace: `pnpm add <package>` (from workspace directory)

3. **Environment setup**:
   - Copy `.env.example` to `.env` in backend
   - Configure Firebase credentials
   - Set up Redis connection

## Getting Help

If you encounter issues not covered here:

1. Check the error message carefully
2. Verify all dependencies are installed
3. Ensure environment variables are configured
4. Check file paths and imports
5. Review Jest and ESLint configurations

For persistent issues, check:
- Node.js version compatibility
- Package manager (pnpm) version
- Operating system specific requirements