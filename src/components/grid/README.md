# Grid Components Documentation

This directory contains a collection of React components and server actions that provide a flexible grid system for displaying products in an e-commerce application. The components are built with Next.js 14+ and leverage modern React patterns including Server Components.

## Architecture Overview

The grid system is composed of several layers:

- **Server Actions** (`actions.ts`): Handle data fetching from the database
- **Hero Components** (`hero.tsx`): Display featured/latest products in a hero layout
- **Layout Components** (`index.tsx`): Provide basic grid containers and items
- **Tile Components** (`single-tile.tsx`): Render individual product tiles with images and labels

## Components

### Server Actions

#### `getLatest3Products()`

**File:** `actions.ts`

A server action that fetches the 3 most recently created products along with their associated images and variants.

**Returns:** `Promise<Latest3ProductsReturnType[]>`

```typescript
type Latest3ProductsReturnType = {
  products: SelectProductWithoutEmbedding;
  product_images: SelectProductImage | null;
  product_variants: SelectProductVariant | null;
};
```

**Features:**
- Validates user authentication using Supabase
- Joins products with their main image (order = 1) and first variant
- Orders results by creation date (descending)
- Includes comprehensive error handling

**Database Query:**
```sql
SELECT * FROM products
LEFT JOIN product_images ON products.id = product_images.product_id AND product_images.order = 1
LEFT JOIN product_variants ON products.id = product_variants.product_id
ORDER BY products.created_at DESC
LIMIT 3
```

### Hero Components

#### `HeroThreeItemGrid()`

**File:** `hero.tsx`

An asynchronous server component that renders a hero grid displaying the 3 latest products in a responsive masonry layout.

**Props:** None

**Features:**
- Server-side rendering with data fetching
- Responsive grid layout (6-column on desktop, stacked on mobile)
- Optimized image loading with priority hints
- Automatic fallback if fewer than 3 products exist

**Grid Layout:**
- Large item: 4 columns, 2 rows (full width on mobile)
- Small items: 2 columns, 1 row each

#### `HeroThreeItemGridSkeleton()`

**File:** `hero.tsx`

A loading skeleton component that mirrors the `HeroThreeItemGrid` layout structure.

**Props:** None

**Usage:**
```tsx
import { HeroThreeItemGridSkeleton } from '@/components/grid/hero';

// During loading state
<HeroThreeItemGridSkeleton />
```

#### `HeroGridItem()`

**File:** `hero.tsx`

Internal component that renders individual hero grid items.

**Props:**
```typescript
interface HeroGridItemProps {
  item: Latest3ProductsReturnType;
  size: "full" | "half";
  priority?: boolean;
}
```

### Layout Components

#### `Grid`

**File:** `index.tsx`

A flexible grid container component built on CSS Grid.

**Props:** Extends `React.ComponentProps<"ul">`

**Features:**
- Uses CSS Grid with flow-row direction
- Accepts all standard `<ul>` props
- Applies consistent gap spacing (1rem)

#### `GridItem`

**File:** `index.tsx`

Individual grid item component with aspect-square ratio.

**Props:** Extends `React.ComponentProps<"li">`

**Features:**
- Maintains square aspect ratio
- Smooth opacity transitions
- Uses `<li>` element for semantic list structure

### Tile Components

#### `GridTileImage`

**File:** `single-tile.tsx`

A responsive image component with optional label overlay for grid tiles.

**Props:**
```typescript
interface GridTileImageProps extends React.ComponentProps<typeof Image> {
  isInteractive?: boolean;
  active?: boolean;
  label?: {
    title: string;
    amount?: number;
    currencyCode?: string;
    position?: "bottom" | "center";
  };
}
```

**Features:**
- Hover animations (scale effect when interactive)
- Border states (active/inactive styling)
- Optional price label overlay using `CustomLabel`
- Responsive image sizing
- Dark mode support

## Usage Examples

### Basic Hero Grid

```tsx
import { HeroThreeItemGrid } from '@/components/grid/hero';

export default function Homepage() {
  return (
    <main>
      <HeroThreeItemGrid />
    </main>
  );
}
```

### Custom Grid Layout

```tsx
import { Grid, GridItem } from '@/components/grid';
import { GridTileImage } from '@/components/grid/single-tile';

export function ProductGrid({ products }) {
  return (
    <Grid className="grid-cols-2 md:grid-cols-4">
      {products.map((product) => (
        <GridItem key={product.id}>
          <GridTileImage
            src={product.image}
            alt={product.title}
            label={{
              title: product.title,
              amount: product.price,
              currencyCode: "USD"
            }}
          />
        </GridItem>
      ))}
    </Grid>
  );
}
```

### Loading States

```tsx
import { HeroThreeItemGridSkeleton } from '@/components/grid/hero';

export function HomepageLoading() {
  return (
    <main>
      <HeroThreeItemGridSkeleton />
    </main>
  );
}
```

## Dependencies

- **Next.js Image**: For optimized image rendering
- **Drizzle ORM**: Database queries and schema definitions
- **Supabase**: Authentication and server client
- **CustomLabel**: Price and title overlay component
- **Tailwind CSS**: Styling and responsive utilities

## Database Schema

The components expect the following database tables (defined in `@/database/schema`):

- `products`: Product information
- `product_images`: Product image URLs with order
- `product_variants`: Product pricing and variant data

## Performance Considerations

- **Server Components**: Hero grid uses server components for optimal performance
- **Image Optimization**: Leverages Next.js Image component with proper sizing
- **Lazy Loading**: Images load progressively based on viewport
- **Priority Loading**: Hero images marked with priority for above-the-fold content

## Responsive Design

The grid system implements a mobile-first approach:

- **Mobile**: Single column, stacked layout
- **Tablet**: 2-4 column grid depending on component
- **Desktop**: Full 6-column hero grid with masonry layout

## Error Handling

- Server actions include comprehensive error logging
- Graceful fallbacks when data is unavailable
- Authentication validation prevents unauthorized access

## Styling

Components use Tailwind CSS with:
- CSS Grid for layout
- Aspect ratio utilities for consistent sizing
- Dark mode support throughout
- Smooth transitions and hover effects
- Border radius and shadow utilities for modern appearance
