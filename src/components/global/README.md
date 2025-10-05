# Global Components Documentation

This document describes the global components used for authentication and UI theming in the application.

## AuthButton Component

**File:** `src/components/global/auth-button.tsx`

A server-side React component that conditionally renders the logout button based on user authentication status.

### Features
- **Server Component**: Runs on the server using Supabase server client
- **Fast Authentication Check**: Uses `getClaims()` instead of `getUser()` for better performance
- **Conditional Rendering**: Only shows logout button when user is authenticated
- **Absolute Positioning**: Positioned at `bottom-16 right-4` on the page

### Usage
```tsx
import { AuthButton } from "@/components/global/auth-button";

// Renders logout button if user is logged in, otherwise renders nothing
<AuthButton />
```

## LogoutButton Component

**File:** `src/components/global/logout-button.tsx`

A client-side component that handles user logout functionality with a styled button and tooltip.

### Features
- **Client Component**: Uses `'use client'` directive for interactive functionality
- **Supabase Integration**: Signs out using Supabase client
- **Navigation**: Redirects to `/auth/login` after logout
- **Accessible Design**: Includes screen reader text and tooltip
- **Visual Feedback**: Red door icon (`DoorOpen`) indicates logout action
- **Styling**: Outlined button with hover effects, positioned absolutely at bottom-right

### Usage
```tsx
import { LogoutButton } from "@/components/global/logout-button";

<LogoutButton />
```

## ModeSwitcher Component (Theme Switcher)

**File:** `src/components/global/theme-switcher.tsx`

A dropdown menu component for switching between light, dark, and system themes.

### Features
- **Client Component**: Requires `'use client'` for theme state management
- **Next.js Themes**: Uses `next-themes` library for theme management
- **Animated Icons**: Sun/Moon icons with smooth scale and rotation transitions
- **Dropdown Menu**: Three options - Light, Dark, and System
- **Absolute Positioning**: Positioned at `bottom-4 right-4` with high z-index
- **Responsive Design**: Works across different screen sizes

### Usage
```tsx
import { ModeSwitcher } from "@/components/global/theme-switcher";

<ModeSwitcher />
```

### Theme Options
- **Light**: Forces light theme
- **Dark**: Forces dark theme
- **System**: Follows user's system preference

## Component Positioning

Both `AuthButton` (when logged in) and `ModeSwitcher` are positioned absolutely:
- **AuthButton/LogoutButton**: `bottom-16 right-4` (64px from bottom)
- **ModeSwitcher**: `bottom-4 right-4` (16px from bottom)

This creates a stacked layout where the theme switcher appears below the logout button when both are visible.

## Dependencies

### Shared Dependencies
- `@/components/ui/button` - Button component
- Supabase auth clients (server/client variants)

### Component-Specific Dependencies
- **LogoutButton**: `next/navigation`, `lucide-react`, `@/components/ui/tooltip`
- **ModeSwitcher**: `next-themes`, `lucide-react`, `@/components/ui/dropdown-menu`
