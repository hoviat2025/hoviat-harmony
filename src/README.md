# Hoviat Admin Panel - Source Code

## Architecture Overview

This project follows **"Screaming Architecture"** - files are organized by **feature**, not by type.

```
/src
├── /app                 # (Future) Next.js App Router pages
├── /components          # Shared UI components
│   ├── /layout          # Layout components (Header, DashboardLayout)
│   ├── /dashboard       # Dashboard-specific components
│   └── /ui              # Shadcn UI primitives
├── /features            # Feature-based modules (THE CORE)
│   ├── /auth            # Authentication feature
│   └── /users           # User management feature
├── /hooks               # Global custom hooks
├── /lib                 # Utilities and configurations
├── /pages               # Route pages
└── index.css            # Global styles & design system
```

## Key Design Decisions

### 1. RTL (Right-to-Left) Support
- The entire app is `dir="rtl"` (set in `index.html`)
- All layouts and components are designed for RTL
- Font: **Vazirmatn** (Persian/Arabic optimized)

### 2. URL-Driven State (The Golden Rule)
- Filters and pagination are stored in the URL, not local state
- This ensures: If you filter → view details → go back → filters are preserved
- Implementation: `useSearchParams` + custom `useUsersUrlState` hook

### 3. Glass Effect System
Two separate CSS classes for performance:
- `.glass-static` - High blur (16px), for Cards, Modals, Sidebar, Header
- `.glass-moving` - Low blur (4px), for Floating buttons, animations

### 4. Design System Tokens
All colors are defined as CSS variables in `index.css`:
- `--gold-*` - Accent colors (buttons, FABs)
- `--silver-*` - Field labels
- `--hoviat-*` - Brand colors
- Standard Shadcn tokens for UI consistency

## Data Flow

```
URL Parameters
     ↓
useUsersUrlState (parses URL → filters)
     ↓
useUsers (TanStack Query)
     ↓
usersApi (Axios calls)
     ↓
API Response
     ↓
Components (UserCard, UserRow, etc.)
```

## Error Handling

- **401 (Unauthorized)**: Redirect to `/login`
- **403 (Forbidden)**: Show toast notification, stay on page
- **404 (Not Found)**: Display error message
- **422 (Validation)**: Show validation errors

See individual feature READMEs for detailed documentation.
