# Developer Guide

## Project Standards & Best Practices

### Code Quality

#### TypeScript Configuration
- **Strict Mode Enabled**: All TypeScript features enforced for type safety
- **No Implicit Any**: All types must be explicitly defined
- **Unused Variables/Parameters**: Unused code is flagged as errors
- **Strict Null Checks**: Null/undefined handling is enforced
- **Isolated Modules**: Each file is independently compilable

#### ESLint & Linting
```bash
# Check for linting errors
npm run lint

# Fix linting errors automatically
npm run lint:fix

# Type checking
npm run type-check
```

**Rules:**
- `@typescript-eslint/no-unused-vars`: Parameters prefixed with `_` are ignored
- `@typescript-eslint/explicit-function-return-types`: Return types must be explicit
- `@typescript-eslint/no-explicit-any`: `any` type is not allowed
- `no-console`: Only `console.warn()` and `console.error()` permitted in production

### Error Handling

#### Error Types
Located in [`src/lib/errors.ts`](src/lib/errors.ts):

```typescript
import { AppError, ValidationError, NetworkError, getErrorMessage } from "@/lib/errors";

// Use specific error types
throw new ValidationError("Invalid input");
throw new NetworkError("API request failed", 500);

// Get error messages safely
const message = getErrorMessage(error);
```

#### Logging
Located in [`src/lib/logger.ts`](src/lib/logger.ts):

```typescript
import Logger from "@/lib/logger";

Logger.info("User action", userData);
Logger.warn("Deprecation warning", { feature: "old_api" });
Logger.error("Critical error", error);
```

### Input Validation

Located in [`src/lib/validation.ts`](src/lib/validation.ts):

```typescript
import { validateEmail, validateCheckoutForm } from "@/lib/validation";

// Single field validation
if (!validateEmail(email)) {
  throw new ValidationError("Invalid email format");
}

// Form validation
const validation = validateCheckoutForm(formData);
if (!validation.isValid) {
  displayErrors(validation.errors);
}
```

### API Communication

Located in [`src/lib/apiClient.ts`](src/lib/apiClient.ts):

```typescript
import apiClient from "@/lib/apiClient";

// All methods include error handling and logging
try {
  const data = await apiClient.post("/endpoint", payload);
  const items = await apiClient.get<Item[]>("/items");
  await apiClient.delete("/resource/123");
} catch (error) {
  if (error instanceof NetworkError) {
    // Handle network errors
  }
}
```

### Context Usage

#### AuthContext
```typescript
import { useAuth } from "@/contexts/AuthContext";

const { user, isAuthenticated, login, register, logout, isLoading } = useAuth();

// Login returns { success, error? }
const result = await login(email, password);
if (result.success) {
  // Login successful
} else {
  // result.error contains error message
}
```

#### CartContext
```typescript
import { useCart } from "@/contexts/CartContext";

const { items, totalPrice, addToCart, removeFromCart, updateQuantity, getCartSummary } = useCart();

// getCartSummary() returns { itemCount, totalAmount }
const summary = getCartSummary();
```

#### WishlistContext
```typescript
import { useWishlist } from "@/contexts/WishlistContext";

const { items, addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
```

## Environment Setup

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000
VITE_APP_NAME=storeMX
VITE_APP_VERSION=1.0.0
```

### Backend (.env)
```
PORT=5000
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
SENDGRID_API_KEY=your_key_here
```

Refer to [`.env.example`](.env.example) for all available variables.

## Development Workflow

### Starting Development
```bash
# Frontend
npm run dev

# Backend (in server/ directory)
npm run dev
```

### Building
```bash
# Production build
npm run build

# Preview build
npm run preview
```

### Testing
```bash
# Run tests once
npm run test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

## File Structure

```
src/
├── components/         # Reusable UI components
│   └── ui/            # Shadcn/ui components
├── contexts/          # React Context providers
│   ├── AuthContext.tsx
│   ├── CartContext.tsx
│   └── WishlistContext.tsx
├── lib/               # Utilities & helpers
│   ├── apiClient.ts   # Centralized API communication
│   ├── errors.ts      # Custom error types
│   ├── env.ts         # Environment validation
│   ├── logger.ts      # Logging utility
│   ├── validation.ts  # Input validation
│   └── utils.ts       # General utilities
├── pages/             # Page components
├── data/              # Static data
├── hooks/             # Custom React hooks
└── App.tsx            # Root component
```

## Naming Conventions

- **Components**: PascalCase (e.g., `ProductCard.tsx`)
- **Utilities**: camelCase (e.g., `validateEmail()`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `MAX_ITEMS = 100`)
- **Types**: PascalCase (e.g., `interface User {}`)
- **CSS Classes**: kebab-case (e.g., `btn-primary`)

## Component Best Practices

### Props Interface
```typescript
interface MyComponentProps {
  title: string;
  count?: number;
  onAction: (id: string) => void;
}

const MyComponent: React.FC<MyComponentProps> = ({ title, count = 0, onAction }) => {
  // Component code
};
```

### Effects & Dependencies
```typescript
// Always specify dependencies
useEffect(() => {
  // Effect logic
}, [dependency1, dependency2]); // ✓ Correct

// Empty array for mount-only effects
useEffect(() => {
  // Runs once on mount
}, []); // ✓ Correct
```

### State Updates
```typescript
// ✓ Use functional updates for derived state
setItems(prev => [...prev, newItem]);

// ✓ Avoid direct mutations
const [items, setItems] = useState([]);
setItems([...items, newItem]); // Correct

// ✗ Don't mutate state directly
items.push(newItem); // Wrong
```

## Performance Tips

1. **Memoization**: Use `useMemo()` for expensive computations
2. **Callbacks**: Use `useCallback()` to prevent unnecessary re-renders
3. **Code Splitting**: Use React lazy loading for large components
4. **Image Optimization**: Use WebP with fallbacks
5. **Bundle**: Monitor bundle size with build analysis

## Testing Guidelines

- Write tests for utilities first (no dependencies)
- Test component behavior, not implementation
- Mock external API calls
- Aim for at least 80% code coverage

## Commit Message Format

```
type(scope): subject

type:
- feat: New feature
- fix: Bug fix
- docs: Documentation
- style: Formatting
- refactor: Code restructure
- perf: Performance improvement
- test: Testing
- chore: Maintenance

subject: lowercase, imperative (e.g., "add validation")
```

Example:
```
feat(auth): add remember me functionality
fix(checkout): validate phone number correctly
docs: update API documentation
```

## Common Issues & Solutions

### TypeScript Errors
- Ensure all function return types are explicit
- Check for `undefined` with strict null checks
- Remove unused imports and variables

### Performance Issues
- Use React DevTools Profiler to identify bottlenecks
- Check for unnecessary re-renders with `why-did-you-render`
- Optimize list rendering with proper keys

### API Errors
- Check `NetworkError` vs `AppError` in catch blocks
- Verify environment variables are set
- Check CORS configuration on backend

## Support & Debugging

- Enable debug logging: Set `import.meta.env.DEV` in Logger
- Use React DevTools for component inspection
- Use Network tab in DevTools for API debugging
- Check console for error messages and stack traces

## Deployment Checklist

- [ ] Run `npm run type-check` successfully
- [ ] Run `npm run lint` with no errors
- [ ] All tests passing with `npm run test`
- [ ] Environment variables set correctly
- [ ] Production build successful: `npm run build`
- [ ] No console errors in production
- [ ] HTTPS enabled
- [ ] CORS properly configured
- [ ] Database backups in place
- [ ] Error tracking setup (e.g., Sentry)

---

**Last Updated**: March 9, 2026

For more information, see:
- [Architecture Overview](ARCHITECTURE.md)
- [Quick Start Guide](QUICK_START.md)
- [Backend Setup](BACKEND_SETUP.md)
- [Troubleshooting](TROUBLESHOOTING.md)
