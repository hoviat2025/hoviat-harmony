# Features Directory

This directory contains **feature-based modules**. Each feature is self-contained with its own:

- `/api` - API calls (Axios)
- `/components` - Feature-specific UI components
- `/hooks` - Custom React hooks
- `/types` - TypeScript interfaces and types

## Current Features

### `/auth` - Authentication
Handles login, logout, token management, and route protection.

### `/users` - User Management
The core feature - listing, filtering, viewing, and editing users.

## Adding a New Feature

1. Create a new folder: `/features/your-feature`
2. Add subdirectories:
   ```
   /your-feature
   ├── /api
   │   └── yourFeatureApi.ts
   ├── /components
   │   └── YourComponent.tsx
   ├── /hooks
   │   └── useYourFeature.ts
   ├── /types
   │   └── index.ts
   └── README.md
   ```
3. Export from each subdirectory as needed
4. Create corresponding page in `/pages`

## Why Feature-Based Architecture?

1. **Scalability**: Each feature is isolated and can grow independently
2. **Maintainability**: Related code is co-located
3. **Team Collaboration**: Different teams can work on different features
4. **Testing**: Easy to test features in isolation
5. **Code Splitting**: Natural boundaries for lazy loading
