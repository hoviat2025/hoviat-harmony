# Library & Utilities

## Overview

Contains shared utilities, configurations, and helper functions.

## Files

### `axios.ts` - HTTP Client Configuration

Global Axios instance with:

```typescript
// Base configuration
const api = axios.create({
  baseURL: 'https://hoviat-admin-fast-api.onrender.com',
  headers: { 'Content-Type': 'application/json' }
});
```

#### Request Interceptor
Automatically attaches JWT token to all requests:
```typescript
config.headers.Authorization = `Bearer ${token}`;
```

#### Response Interceptor
Handles errors globally:
- **401 (Unauthorized)**: Clears storage, redirects to `/login`
- **403 (Forbidden)**: Shows toast notification, does NOT redirect
- Other errors: Passed through to caller

### `utils.ts` - Utility Functions

```typescript
// Class name merger (Tailwind)
cn(...classes) // Combines class names with conflict resolution

// Example usage
cn("px-4 py-2", condition && "bg-primary", "hover:bg-accent")
```

## Adding New Utilities

1. Create a new file in `/lib` for related utilities
2. Export functions individually for tree-shaking
3. Add types if needed
4. Document complex functions with JSDoc

## Environment Variables

Currently, no environment variables are used. API URLs are hardcoded.

To add environment variables:
1. Create `.env` file
2. Prefix with `VITE_` for client-side access
3. Access via `import.meta.env.VITE_API_URL`
