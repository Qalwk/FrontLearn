# Migration Plan for Feature-Sliced Design (FSD) Architecture

This document outlines the step-by-step process to migrate the current codebase to the Feature-Sliced Design architecture.

## 1. Create Basic Directory Structure

First, set up the FSD directory structure in the `src` folder:

```bash
mkdir -p src/{app,pages,widgets,features,entities,shared}/{lib,ui,api,config}
mkdir -p src/styles
```

## 2. Move Existing Files

### Step 1: Move Global Styles
```bash
cp styles/globals.css src/styles/
```

### Step 2: Move UI Components
```bash
cp -r components/ui src/shared/ui
```

### Step 3: Move Context Providers
```bash
# Create necessary directories
mkdir -p src/entities/session/providers
mkdir -p src/entities/i18n/providers

# Move auth context
cp contexts/AuthContext.tsx src/entities/session/providers/auth-provider.tsx

# Move language context
cp contexts/LanguageContext.tsx src/entities/i18n/providers/language-provider.tsx
```

### Step 4: Move Mock Data
```bash
mkdir -p src/entities/course/model
cp data/mockData.ts src/entities/course/model/mock.ts
```

### Step 5: Move Types
```bash
cp types/index.ts src/entities/course/model/types.ts
```

## 3. Create App Layer

### Step 1: Create Main App Entry Point
```bash
# Create app entry point based on the existing App.tsx
touch src/app/index.tsx
```

### Step 2: Create App Providers
```bash
touch src/app/providers/index.tsx
```

### Step 3: Create Router
```bash
touch src/app/router/index.tsx
```

## 4. Move Page Components

For each main page in the application:

```bash
# Admin pages
mkdir -p src/pages/admin/{dashboard,users,courses,notifications,analytics}
cp components/AdminDashboard.tsx src/pages/admin/dashboard/index.tsx
cp components/admin/UsersManagement.tsx src/pages/admin/users/index.tsx
cp components/admin/CourseManagement.tsx src/pages/admin/courses/ui.tsx
touch src/pages/admin/courses/index.tsx
cp components/admin/NotificationsManagement.tsx src/pages/admin/notifications/index.tsx
cp components/admin/AnalyticsManagement.tsx src/pages/admin/analytics/index.tsx

# User pages
mkdir -p src/pages/user/{dashboard,courses,learning-path,achievements}
cp components/UserDashboard.tsx src/pages/user/dashboard/index.tsx
cp components/AllCourses.tsx src/pages/user/courses/index.tsx
touch src/pages/user/learning-path/index.tsx
cp components/Achievements.tsx src/pages/user/achievements/index.tsx

# Productivity pages
mkdir -p src/pages/productivity/{pomodoro,eisenhower}
cp components/productivity/PomodoroTimer.tsx src/pages/productivity/pomodoro/index.tsx
cp components/productivity/EisenhowerMatrix.tsx src/pages/productivity/eisenhower/index.tsx

# Auth page
mkdir -p src/pages/auth
cp components/AuthScreen.tsx src/pages/auth/index.tsx

# Course view page
mkdir -p src/pages/course-view
cp components/CourseView.tsx src/pages/course-view/index.tsx
cp components/LessonView.tsx src/pages/course-view/lesson.tsx
cp components/QuizView.tsx src/pages/course-view/quiz.tsx

# Settings page
mkdir -p src/pages/settings
cp components/Settings.tsx src/pages/settings/index.tsx
```

## 5. Create Widget Components

```bash
# Navigation components
mkdir -p src/widgets/navigation/{side-navigation,top-navigation}
cp components/SideNavigation.tsx src/widgets/navigation/side-navigation/index.tsx
cp components/TopNavigation.tsx src/widgets/navigation/top-navigation/index.tsx

# Layout components
mkdir -p src/widgets/layouts/{admin-layout,user-layout}
touch src/widgets/layouts/admin-layout/index.tsx
touch src/widgets/layouts/user-layout/index.tsx
```

## 6. Create Feature Components

```bash
# Admin features
mkdir -p src/features/admin/{course-management,user-management,notification-management,analytics}
touch src/features/admin/course-management/index.tsx

# Auth features
mkdir -p src/features/auth/auth-form
touch src/features/auth/auth-form/index.tsx

# Course features
mkdir -p src/features/course/{course-list,course-player,quiz}
touch src/features/course/course-player/index.tsx
```

## 7. Update Imports in All Files

After moving the files, you'll need to update all import paths to reflect the new structure. This is a critical step that requires careful attention to avoid runtime errors.

## 8. Testing the Migration

Test the application thoroughly after migration to ensure all features still work correctly.

## 9. Cleanup

Once everything is working correctly with the new structure, you can remove the old files that have been migrated.