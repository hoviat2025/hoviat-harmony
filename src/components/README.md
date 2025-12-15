# Shared Components

## Overview

This directory contains reusable components shared across features.

## Structure

```
/components
├── /layout              # Layout components
│   ├── Header.tsx       # App header with navigation
│   └── DashboardLayout.tsx # Protected layout wrapper
├── /dashboard           # Dashboard-specific components
│   └── DashboardGrid.tsx # Feature selection grid
├── /ui                  # Shadcn UI primitives
│   ├── button.tsx
│   ├── card.tsx
│   ├── dialog.tsx
│   └── ... (40+ components)
└── NavLink.tsx          # Navigation link component
```

## Layout Components

### `Header.tsx`
- Sticky glassy header
- RTL-aware navigation (Back button on right, Logout on left)
- Dynamic "Back" button that preserves URL state
- User info display

### `DashboardLayout.tsx`
- Wraps all protected routes
- Includes Header + main content area
- Uses React Router's `<Outlet>` for nested routes

## UI Components (Shadcn)

All Shadcn components are in `/ui`. They are:
- Pre-styled with our design system tokens
- Accessible (ARIA compliant)
- Composable and customizable

### Customizations Made:
- Glass effects added to Card, Dialog, Sheet
- RTL support for all directional components
- Gold accent colors for primary actions

## Glass Effect Classes

Apply these classes for the glass aesthetic:

```tsx
// For static elements (cards, modals, headers)
<div className="glass-static">...</div>

// For moving/animated elements (FABs, tooltips)
<div className="glass-moving">...</div>

// For disabled/coming soon elements
<div className="glass-disabled">...</div>
```

## Design Tokens

Always use semantic tokens from the design system:

```tsx
// ✅ Correct
<button className="bg-gold text-gold-foreground">

// ❌ Wrong - Don't use raw colors
<button className="bg-yellow-500 text-white">
```
