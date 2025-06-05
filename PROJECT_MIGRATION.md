# Frontend Master - FSD Migration Guide

This document provides step-by-step instructions for migrating the Frontend Master educational platform to the Feature-Sliced Design architecture.

## Step 1: Configure Project

1. Add the configuration files:
   - `tsconfig.json` - TypeScript configuration with path aliases
   - `vite.config.ts` - Vite configuration with path aliases
   - `tsconfig.node.json` - Node.js configuration
   - `.eslintrc.json` - ESLint rules for FSD

2. Install necessary packages:
   ```bash
   npm install -D @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint-plugin-import
   ```

## Step 2: Create FSD Directory Structure

```bash
mkdir -p src/{app,pages,widgets,features,entities,shared}/{lib,ui,api,config,model}
mkdir -p src/styles
```

## Step 3: Migrate Files by Layer

### 1. Shared Layer

First, move UI components to the shared layer:

```bash
# Create directory for UI components
mkdir -p src/shared/ui

# Copy UI components
cp -r components/ui/* src/shared/ui/

# Update imports in UI components
# This will need to be done manually or with a script
```

### 2. Entities Layer

Move business entities and their related files:

```bash
# Create necessary directories
mkdir -p src/entities/session/providers
mkdir -p src/entities/i18n/providers
mkdir -p src/entities/course/model

# Copy context providers
cp contexts/AuthContext.tsx src/entities/session/providers/auth-provider.tsx
cp contexts/LanguageContext.tsx src/entities/i18n/providers/language-provider.tsx

# Copy types and mock data
cp types/index.ts src/entities/course/model/types.ts
cp data/mockData.ts src/entities/course/model/mock.ts
```

### 3. Features Layer

Organize user interactions and business logic:

```bash
# Create directories for features
mkdir -p src/features/auth/auth-form
mkdir -p src/features/admin/{course-management,user-management,notification-management}
mkdir -p src/features/course/{course-list,course-view,quiz}
mkdir -p src/features/productivity/{pomodoro,eisenhower}

# Move component logic to features
# This will be more complex and require manual work to separate UI from logic
```

### 4. Widgets Layer

Move complex UI blocks:

```bash
# Create directories for widgets
mkdir -p src/widgets/layouts/{admin-layout,user-layout}
mkdir -p src/widgets/navigation/{side-navigation,top-navigation}
mkdir -p src/widgets/dashboard
mkdir -p src/widgets/course-cards

# Copy navigation components
cp components/SideNavigation.tsx src/widgets/navigation/side-navigation/index.tsx
cp components/TopNavigation.tsx src/widgets/navigation/top-navigation/index.tsx
```

### 5. Pages Layer

Create page components:

```bash
# Create directories for pages
mkdir -p src/pages/{admin,user,auth,productivity,course-view,settings}
mkdir -p src/pages/admin/{dashboard,users,courses,notifications,analytics}
mkdir -p src/pages/user/{dashboard,courses,learning-path,achievements}
mkdir -p src/pages/productivity/{pomodoro,eisenhower}

# Create page components
# These will mostly just compose widgets and features
```

### 6. App Layer

Finally, create the application layer:

```bash
# Create app directories
mkdir -p src/app/{providers,router}

# Create app entry point
touch src/app/index.tsx
touch src/app/providers/index.tsx
touch src/app/router/index.tsx
```

## Step 4: Update App.tsx

Replace the current App.tsx with a new one that follows FSD principles:

```tsx
// src/app/index.tsx
import { Toaster } from "sonner@2.0.3";
import { AppProviders } from "@app/providers";
import { AppRouter } from "@app/router";
import "../styles/globals.css";

export default function App() {
  return (
    <AppProviders>
      <AppRouter />
      <Toaster />
    </AppProviders>
  );
}
```

## Step 5: Update Imports

This is the most time-consuming part. All imports need to be updated to use the new path aliases:

1. Replace relative imports with absolute imports using path aliases
2. Ensure imports follow the layer dependency rule

Example:
```tsx
// Before
import { Button } from "../../components/ui/button";
import { useAuth } from "../../contexts/AuthContext";

// After
import { Button } from "@shared/ui/button";
import { useAuth } from "@entities/session";
```

## Step 6: Testing

Test the application thoroughly to ensure everything still works as expected.

## Migration Checklist

- [ ] Configuration files added
- [ ] Directory structure created
- [ ] Shared layer migrated
- [ ] Entities layer migrated
- [ ] Features layer migrated
- [ ] Widgets layer migrated
- [ ] Pages layer migrated
- [ ] App layer migrated
- [ ] Imports updated
- [ ] Application tested

## Tips for Successful Migration

1. **Migrate incrementally**: Start with smaller components and work your way up
2. **Keep the app running**: Try to keep the application functional during migration
3. **Update one layer at a time**: Complete one layer before moving to the next
4. **Use search and replace**: For bulk updates to imports
5. **Write tests**: Add tests as you migrate to ensure functionality is preserved
6. **Document changes**: Keep track of what's been migrated and what's left to do