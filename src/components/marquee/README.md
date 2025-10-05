# Marquee Component

A scrolling product carousel that displays the latest 20 products from the database in an animated marquee format.

## Files

### `actions.ts`
Server actions for fetching product data:
- `getLatest20Products()`: Fetches the 20 most recently created products with their main images and variant information
- Requires user authentication via Supabase
- Returns products joined with their primary image (order = 1) and variant data
- Includes error handling with detailed logging

### `index.tsx`
React Server Component that renders the marquee:
- `ItemsMarquee()`: Async component that fetches and displays products
- Renders a horizontal scrolling carousel with product tiles
- Each tile links to the product detail page
- Includes skeleton loading state for better UX
- Responsive design with mobile-first approach
- Uses `GridTileImage` component for consistent product display

## Features

- **Authentication Required**: Only authenticated users can view the marquee
- **Responsive Design**: Adapts to different screen sizes (mobile, tablet, desktop)
- **Performance Optimized**: Server-side rendering with proper image sizing
- **Error Handling**: Graceful fallbacks and loading states
- **Infinite Scroll Effect**: Products are duplicated to create seamless scrolling on wide screens

## Usage

```tsx
import { ItemsMarquee } from '@/components/marquee';

// Use as a server component
<ItemsMarquee />
```

## Dependencies

- Drizzle ORM for database queries
- Supabase for authentication
- Next.js for server components and routing
- GridTileImage component for product display
- Skeleton component for loading states
