# User Management Feature

## Overview

The core feature of Hoviat Admin Panel. Provides listing, filtering, viewing, and editing users.

## Structure

```
/users
├── /api
│   └── usersApi.ts          # API calls (getUsers, getUser, updateUser)
├── /components
│   ├── UserCard.tsx         # Card view component
│   ├── UserRow.tsx          # Row/list view component
│   ├── DynamicFilterModal.tsx # Complex filter builder
│   ├── EditUserModal.tsx    # User editing form
│   ├── FloatingSearchButton.tsx # FAB for filters
│   ├── FloatingEditButton.tsx   # FAB for editing
│   └── Pagination.tsx       # Pagination controls
├── /hooks
│   └── useUsers.ts          # Data fetching & URL state hooks
└── /types
    └── index.ts             # User, filters, field configs
```

## API Endpoints

### Get Users (List)
```
GET /api/admin/users-management/
Query params: page, size, order_by, filters...
```

### Get Single User
```
GET /api/admin/users-management/{user_id}
```

### Update User
```
PATCH /api/admin/users-management/update
Body: { user_id, ...fieldsToUpdate }
```

## URL-Driven State

The filter state is stored in the URL to preserve state across navigation.

### URL Structure
```
/users?page=1&order_by=-counter&rules=[encoded_rules]
```

### Rules Format
```json
[
  { "field": "first_name", "operator": "contains", "value": "john" },
  { "field": "is_ban", "operator": "equals", "value": "true" }
]
```

### Hook: `useUsersUrlState()`
```typescript
const {
  filters,        // Current UsersFilters
  updateFilters,  // Update filters (auto-syncs to URL)
  resetFilters,   // Clear all filters
  addRule,        // Add a filter rule
  removeRule,     // Remove a filter rule
  updateRule,     // Update a filter rule
} = useUsersUrlState();
```

## Dynamic Filter System

### Field Types & Operators

| Field Type | Operators | API Parameters |
|------------|-----------|----------------|
| Text | equals, contains, isEmpty, isNotEmpty | `field=val`, `field_contains=val` |
| Number | equals, min, max, isEmpty, isNotEmpty | `field=val`, `min_field=val`, `max_field=val` |
| Date | equals, after, before, isEmpty, isNotEmpty | `joined_after_unix=timestamp` |
| Boolean | equals, isEmpty, isNotEmpty | `field=true/false` |

### Null Checks
Every field supports:
- `no_fieldname=true` → Field is empty (null)
- `no_fieldname=false` → Field is not empty

### Date Handling
- Input: Gregorian calendar picker
- Storage: Unix timestamp (seconds)
- API: `joined_after_unix`, `joined_before_unix`

## Views

### Card View
- Grid of glassy cards
- Shows: Profile picture, name, Telegram ID, country
- Ban badge for banned users

### Row View
- Stack of horizontal glass rectangles
- Shows: Small profile, multiple data fields
- Optimized for scanning large lists

## Field Translations

All field labels are displayed in Persian. See `FIELD_TRANSLATIONS` in `/types/index.ts`:

```typescript
{
  "user_id": "آیدی تلگرام",
  "first_name": "نام کوچک",
  "is_ban": "بن شده است",
  // ... etc
}
```

## Profile Images

```typescript
const PROFILE_IMAGE_BASE_URL = "https://pub-4036d35baed54ee7a9504072ea49740f.r2.dev/";
const fullUrl = PROFILE_IMAGE_BASE_URL + user.profile_path;
```
