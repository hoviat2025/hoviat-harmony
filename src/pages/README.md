# Pages Directory

## Overview

Contains route-level page components. Each file corresponds to a route.

## Routes

| File | Route | Description |
|------|-------|-------------|
| `Login.tsx` | `/login` | Authentication page |
| `Dashboard.tsx` | `/dashboard` | Feature selection grid |
| `Users.tsx` | `/users` | User list with filters |
| `UserDetail.tsx` | `/users/:id` | Single user view |
| `NotFound.tsx` | `*` | 404 error page |

## Route Configuration

Routes are configured in `App.tsx`:

```tsx
<Routes>
  {/* Public routes */}
  <Route path="/login" element={<Login />} />
  
  {/* Protected routes */}
  <Route element={<ProtectedRoute />}>
    <Route element={<DashboardLayout />}>
      <Route path="/" element={<Navigate to="/dashboard" />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/users" element={<Users />} />
      <Route path="/users/:id" element={<UserDetail />} />
    </Route>
  </Route>
  
  {/* Fallback */}
  <Route path="*" element={<NotFound />} />
</Routes>
```

## Page Responsibilities

Pages should:
1. **Compose** components from `/features` and `/components`
2. **Handle** route params and URL state
3. **Coordinate** data fetching via hooks
4. **NOT** contain complex business logic (put in hooks)

## Example Page Structure

```tsx
function Users() {
  // 1. URL state management
  const { filters, updateFilters } = useUsersUrlState();
  
  // 2. Data fetching
  const { data, isLoading } = useUsers(filters);
  
  // 3. Local UI state
  const [viewMode, setViewMode] = useState('card');
  
  // 4. Render composed components
  return (
    <div>
      <Toolbar />
      {viewMode === 'card' ? <CardGrid /> : <RowList />}
      <Pagination />
      <FloatingSearchButton />
    </div>
  );
}
```
