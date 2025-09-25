# Foodigo Dashboard

A modern React dashboard application built with TanStack Router, Zustand, and shadcn/ui components.

## Features

- **Authentication System**: Complete login/logout functionality with data persistence
- **Responsive Design**: Mobile-first approach with collapsible sidebar
- **Theme Support**: Light, dark, and system theme modes
- **Data Persistence**: Auth data is automatically saved to localStorage and restored on app load

## Auth Data Persistence

The application automatically persists authentication data to localStorage and restores it on app initialization:

### How it works:

1. **Login**: When a user logs in, their data is automatically saved to localStorage
2. **App Load**: On application startup, the `AuthInitializer` component automatically loads saved auth data
3. **Logout**: When a user logs out, all auth data is cleared from localStorage

### Data Structure:

```typescript
interface AuthUser {
  name: string;
  email: string;
  image: string;
}
```

### Storage Keys:

- `jwt_token`: Access token (stored in cookies)
- `userData`: User information (stored in localStorage)

### Components:

- `useAuth()`: Main auth hook for login/logout operations
- `useAuthStore`: Zustand store for auth state management
- `AuthInitializer`: Component that initializes auth data on app load
- `useSidebarData()`: Hook that provides reactive sidebar data based on auth state

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```
