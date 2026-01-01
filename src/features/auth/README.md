# Authentication Feature

## Overview

Handles user authentication using JWT tokens with the Hoviat Admin API.

## Structure

```
/auth
├── /api
│   └── authApi.ts       # Login API call, token storage
├── /components
│   ├── LoginForm.tsx    # Login form UI
│   └── ProtectedRoute.tsx # Route guard component
├── /hooks
│   └── useAuth.ts       # Auth hooks (useLogin, useLogout, etc.)
└── /types
    └── index.ts         # LoginRequest, LoginResponse, AuthUser
```

## API Details

### Login Endpoint
```
POST https://test-backend-host.safaee1361.workers.dev/api/admin/auth/login
Content-Type: application/x-www-form-urlencoded

Body: username=xxx&password=xxx
```

### Response
```json
{
  "access_token": "eyJhbGciOiJIUzI1Ni...",
  "token_type": "bearer",
  "expires_in": 604800,
  "username": "bardia",
  "is_superadmin": true
}
```

## Token Storage

- Token stored in `localStorage` as `hoviat_token`
- User data stored as `hoviat_user`
- Token is automatically attached to all API requests via Axios interceptor

## Hooks

### `useLogin()`
```typescript
const { mutate: login, isPending } = useLogin();
login({ username: 'admin', password: 'pass' });
```

### `useLogout()`
```typescript
const logout = useLogout();
logout(); // Clears storage, redirects to /login
```

### `useCurrentUser()`
```typescript
const user = useCurrentUser(); // Returns AuthUser | null
```

### `useIsAuthenticated()`
```typescript
const isAuth = useIsAuthenticated(); // Returns boolean
```

## Protected Routes

Wrap routes with `<ProtectedRoute>` to require authentication:

```tsx
<Route element={<ProtectedRoute />}>
  <Route path="/dashboard" element={<Dashboard />} />
</Route>
```

## Error Handling

- **401**: Axios interceptor redirects to `/login`
- **403**: Toast notification shown, user stays on page
- Invalid credentials: Error message shown in form
