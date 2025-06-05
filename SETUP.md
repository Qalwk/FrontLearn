# Setting Up the Frontend Master Educational Platform

## Project Setup with Feature-Sliced Design

### Required Libraries

Install the following libraries to get started:

```bash
# Core libraries
npm install react react-dom typescript @types/react @types/react-dom
npm install tailwindcss@4.0.0-alpha.3 postcss autoprefixer

# UI Components and State Management
npm install lucide-react
npm install recharts
npm install react-hook-form@7.55.0
npm install sonner@2.0.3
npm install zod
npm install @tanstack/react-table

# Development tools
npm install vite @vitejs/plugin-react typescript
```

### Directory Structure

Here's how to organize the project following Feature-Sliced Design (FSD) architecture:

```
src/
├── app/               # Application setup
│   ├── providers/     # App providers
│   ├── router/        # Routing logic
│   └── index.tsx      # Entry point (main App component)
│
├── pages/             # Page components 
│   ├── admin/         # Admin pages
│   ├── user/          # User pages
│   ├── auth/          # Auth page
│   └── course-view/   # Course viewing page
│
├── widgets/           # Complex UI blocks
│   ├── layouts/       # Page layouts
│   ├── navigation/    # Navigation components
│   └── dashboard/     # Dashboard widgets
│
├── features/          # Business features
│   ├── admin/         # Admin features
│   ├── auth/          # Auth features
│   └── course/        # Course features
│
├── entities/          # Business entities
│   ├── course/        # Course entity
│   ├── session/       # User session entity
│   └── quiz/          # Quiz entity
│
├── shared/            # Shared utilities and components
│   ├── ui/            # UI components (move from components/ui)
│   ├── lib/           # Helper libraries
│   ├── api/           # API utilities
│   ├── config/        # Configuration constants
│   └── assets/        # Images, icons, etc.
│
└── styles/            # Global styles (move from /styles)
```

## Migration Steps

1. Create the folder structure above in your `src` directory

2. Move existing components to their appropriate locations:
   - Move UI components (`components/ui`) to `src/shared/ui`
   - Move context providers to `src/entities` based on domain
   - Move mock data to `src/entities/[entity]/model`
   - Move global types to the related entity or shared folders

3. Convert existing components to match FSD patterns:
   - Page components should be in the `pages` layer
   - Reusable UI blocks in `widgets` 
   - Business logic in `features`
   - Entity models and data in `entities`

4. Update imports in all files to reflect the new structure

## Style Guidelines

- Follow the import order: shared → entities → features → widgets → pages → app
- Use barrel exports (index.ts files) to simplify imports
- Keep each layer focused on its specific responsibility