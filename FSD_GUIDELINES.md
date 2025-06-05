# Feature-Sliced Design Guidelines

## Overview

Feature-Sliced Design (FSD) is a methodology for organizing code in frontend applications. It divides the application into layers and slices, making it more maintainable and scalable.

## Layers

From highest to lowest:

1. **app/** - Application initialization, global providers, styles, and entry points
2. **pages/** - Page components corresponding to routes
3. **widgets/** - Complex UI blocks used across pages
4. **features/** - User interactions and business logic
5. **entities/** - Business entities and their logic
6. **shared/** - Reusable infrastructure: UI components, utilities, etc.

## Import Rules

FSD enforces a strict dependency rule: **layers can only import from layers below them**.

```
app → pages → widgets → features → entities → shared
```

This means:
- `app` can import from all other layers
- `pages` can import from `widgets`, `features`, `entities`, and `shared`
- `widgets` can import from `features`, `entities`, and `shared`
- `features` can import from `entities` and `shared`
- `entities` can import from `shared`
- `shared` cannot import from any other layer

## Path Aliases

We use path aliases to make imports cleaner and enforce layer boundaries:

```tsx
// Instead of relative paths like:
import { Button } from "../../../shared/ui/button";

// Use path aliases:
import { Button } from "@shared/ui/button";
```

Available aliases:
- `@app/*` - App layer components
- `@pages/*` - Page components
- `@widgets/*` - Widget components
- `@features/*` - Feature components
- `@entities/*` - Entity components
- `@shared/*` - Shared components and utilities
- `@/*` - Root alias for any path

## Naming Conventions

- Use kebab-case for file and directory names
- Use PascalCase for component names
- Use camelCase for variables, functions, and instance methods

## File Structure Within a Slice

A typical slice (e.g., `entities/user`) follows this structure:

```
entities/user/
├── api/             # API requests related to the entity
├── model/           # Entity types, constants, and business logic
├── ui/              # UI components specific to this entity
├── lib/             # Utility functions specific to this entity
└── index.ts         # Public API (re-exports)
```

## Public API Pattern

Each slice should expose a public API through an `index.ts` file:

```tsx
// entities/user/index.ts
export * from './model/types';
export * from './ui/user-card';
export * from './lib/use-user';

// Do NOT export internal implementation details
```

## Examples

### Good import examples:

```tsx
// In a widget component
import { Button } from "@shared/ui/button";
import { useUser } from "@entities/user";
import { useAuth } from "@features/auth";

// In a page component
import { UserProfile } from "@widgets/user-profile";
import { useUserSettings } from "@features/user-settings";
```

### Bad import examples:

```tsx
// ❌ Importing from a higher layer
import { DashboardPage } from "@pages/dashboard"; // in a widget

// ❌ Using relative paths when aliases are available
import { Button } from "../../../shared/ui/button";

// ❌ Importing private implementation details
import { userAPI } from "@entities/user/api"; // should use the public API
```

## Testing

Tests should be placed alongside the code they're testing:

```
features/auth/
├── ui/
│   ├── login-form.tsx
│   └── login-form.test.tsx
```

## Migrations

When migrating to FSD:

1. Start with the `shared` layer and move upward
2. Move related files together
3. Update imports to use path aliases
4. Enforce layer boundaries gradually