# Contributing to MindWell

Thank you for your interest in contributing to MindWell! This document provides guidelines and information for contributors.

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm 8+
- Git
- React Native development environment
- Redis server
- Firebase project

### Development Setup

1. **Fork and clone the repository**
```bash
git clone https://github.com/your-username/mental-health-app.git
cd mental-health-app
```

2. **Install dependencies**
```bash
pnpm install-all
```

3. **Set up environment**
```bash
cd backend
cp .env.example .env
# Edit .env with your configuration
```

4. **Start development servers**
```bash
# Terminal 1: Redis
redis-server

# Terminal 2: Backend
cd backend && pnpm dev

# Terminal 3: Frontend
pnpm start
```

## Development Workflow

### Branch Naming

Use descriptive branch names with prefixes:

- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `test/` - Test improvements
- `refactor/` - Code refactoring

Examples:
```bash
git checkout -b feature/mood-tracking
git checkout -b fix/login-validation-error
git checkout -b docs/api-authentication
```

### Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

Types:
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation
- `style` - Code style changes
- `refactor` - Code refactoring
- `test` - Adding or updating tests
- `chore` - Maintenance tasks

Examples:
```bash
git commit -m "feat(auth): add email verification flow"
git commit -m "fix(login): resolve validation error handling"
git commit -m "docs(api): update authentication endpoints"
git commit -m "test(auth): add integration tests for signup flow"
```

### Pull Request Process

1. **Create a feature branch**
```bash
git checkout -b feature/your-feature-name
```

2. **Make your changes**
   - Write clean, readable code
   - Follow existing code style
   - Add tests for new functionality
   - Update documentation as needed

3. **Test your changes**
```bash
# Run all tests
pnpm test && cd backend && pnpm test

# Check code quality
pnpm lint
pnpm type-check
```

4. **Commit and push**
```bash
git add .
git commit -m "feat: add your feature description"
git push origin feature/your-feature-name
```

5. **Create pull request**
   - Use the PR template
   - Provide clear description
   - Link related issues
   - Request appropriate reviewers

## Code Standards

### TypeScript

- Use strict TypeScript configuration
- Define proper types for all functions and components
- Avoid `any` type unless absolutely necessary
- Use interfaces for object shapes

```typescript
// ✅ Good
interface User {
  id: string;
  email: string;
  name: string;
}

const getUser = (id: string): Promise<User> => {
  // Implementation
};

// ❌ Bad
const getUser = (id: any): any => {
  // Implementation
};
```

### React Native Components

- Use functional components with hooks
- Implement proper prop types
- Follow component naming conventions
- Use StyleSheet for styling

```typescript
// ✅ Good
interface LoginScreenProps {
  onLogin: (credentials: LoginCredentials) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  
  return (
    <View style={styles.container}>
      {/* Component content */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
});
```

### Backend Code

- Use Express.js best practices
- Implement proper error handling
- Add input validation
- Use middleware appropriately

```typescript
// ✅ Good
export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    
    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    // Business logic
    const user = await userService.create({ name, email, password });
    
    res.status(201).json({ user });
  } catch (error) {
    logger.error('User creation failed:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
```

### Testing Requirements

All contributions must include appropriate tests:

#### Frontend Tests
- Component rendering tests
- User interaction tests
- Redux state management tests
- API service tests

```typescript
describe('LoginScreen', () => {
  it('should render login form', () => {
    const { getByLabelText } = render(<LoginScreen />);
    expect(getByLabelText('Email')).toBeTruthy();
  });

  it('should handle form submission', async () => {
    const mockOnLogin = jest.fn();
    const { getByText, getByLabelText } = render(
      <LoginScreen onLogin={mockOnLogin} />
    );
    
    fireEvent.changeText(getByLabelText('Email'), 'test@example.com');
    fireEvent.press(getByText('Sign In'));
    
    await waitFor(() => {
      expect(mockOnLogin).toHaveBeenCalled();
    });
  });
});
```

#### Backend Tests
- Controller tests
- Middleware tests
- Integration tests
- Utility function tests

```typescript
describe('POST /api/auth/login', () => {
  it('should authenticate user with valid credentials', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123',
      })
      .expect(200);

    expect(response.body).toHaveProperty('token');
    expect(response.body.user.email).toBe('test@example.com');
  });
});
```

### Documentation

- Update relevant documentation for new features
- Include code examples in API documentation
- Add JSDoc comments for complex functions
- Update README if needed

```typescript
/**
 * Authenticates a user with email and password
 * @param credentials - User login credentials
 * @returns Promise resolving to authentication response
 * @throws {AuthenticationError} When credentials are invalid
 */
export const authenticateUser = async (
  credentials: LoginCredentials
): Promise<AuthResponse> => {
  // Implementation
};
```

## Code Review Guidelines

### For Contributors

- Keep PRs focused and small
- Write clear PR descriptions
- Respond to feedback promptly
- Update your branch with latest changes

### For Reviewers

- Be constructive and respectful
- Focus on code quality and maintainability
- Check for proper testing
- Verify documentation updates

## Issue Guidelines

### Bug Reports

Use the bug report template and include:

- Clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Environment details
- Screenshots/logs if applicable

### Feature Requests

Use the feature request template and include:

- Clear description of the feature
- Use case and motivation
- Proposed implementation approach
- Acceptance criteria

### Questions

For questions about the codebase:

- Check existing documentation first
- Search existing issues
- Provide context about what you're trying to achieve

## Security

### Reporting Security Issues

**Do not create public issues for security vulnerabilities.**

Instead:
1. Email security concerns to [security@mindwell.app]
2. Include detailed description
3. Provide steps to reproduce
4. Allow time for investigation before disclosure

### Security Best Practices

- Never commit secrets or API keys
- Use environment variables for configuration
- Validate all user inputs
- Follow OWASP security guidelines
- Keep dependencies updated

## Performance Guidelines

### Frontend Performance

- Optimize component re-renders
- Use React.memo for expensive components
- Implement proper list virtualization
- Optimize image loading and caching

### Backend Performance

- Use database indexes appropriately
- Implement caching strategies
- Optimize API response times
- Monitor memory usage

## Accessibility

Ensure all UI components are accessible:

- Add proper accessibility labels
- Support screen readers
- Implement keyboard navigation
- Test with accessibility tools

```typescript
<Button
  accessibilityLabel="Sign in to your account"
  accessibilityHint="Navigates to the main dashboard after successful login"
  onPress={handleLogin}
>
  Sign In
</Button>
```

## Release Process

### Version Numbering

We follow [Semantic Versioning](https://semver.org/):

- `MAJOR.MINOR.PATCH`
- Major: Breaking changes
- Minor: New features (backward compatible)
- Patch: Bug fixes (backward compatible)

### Release Checklist

- [ ] All tests pass
- [ ] Documentation updated
- [ ] Version number bumped
- [ ] Changelog updated
- [ ] Security review completed
- [ ] Performance testing done

## Getting Help

### Communication Channels

- **GitHub Issues** - Bug reports and feature requests
- **GitHub Discussions** - General questions and ideas
- **Discord** - Real-time chat with contributors
- **Email** - Direct contact for sensitive issues

### Resources

- [Project Documentation](/)
- [API Reference](/api/authentication)
- [Architecture Guide](/guide/architecture/overview)
- [Testing Guide](/guide/testing)

## Recognition

Contributors will be recognized in:

- README contributors section
- Release notes
- Project documentation
- Annual contributor highlights

## Code of Conduct

This project follows the [Contributor Covenant Code of Conduct](https://www.contributor-covenant.org/version/2/1/code_of_conduct/). By participating, you agree to uphold this code.

### Our Pledge

We pledge to make participation in our project a harassment-free experience for everyone, regardless of:

- Age, body size, disability, ethnicity
- Gender identity and expression
- Level of experience, education, socio-economic status
- Nationality, personal appearance, race, religion
- Sexual identity and orientation

### Expected Behavior

- Use welcoming and inclusive language
- Be respectful of differing viewpoints
- Accept constructive criticism gracefully
- Focus on what's best for the community
- Show empathy towards other community members

## License

By contributing to MindWell, you agree that your contributions will be licensed under the same license as the project (MIT License).

---

Thank you for contributing to MindWell! Together, we're building something that can make a real difference in people's mental health and wellness journey. 🧠💙