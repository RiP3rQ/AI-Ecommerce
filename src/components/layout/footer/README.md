# Footer Component

A comprehensive static footer component designed for European e-commerce websites, featuring all necessary legal and informational pages required for GDPR compliance.

## Features

### Footer Sections

The footer is organized into three main sections:

#### 1. Company
- **About Us** (`/about`) - Company information and mission
- **Contact** (`/contact`) - Contact information and form
- **FAQ** (`/faq`) - Frequently asked questions

#### 2. Legal (GDPR/RODO Compliant)
- **Privacy Policy** (`/privacy-policy`) - GDPR-compliant privacy policy
- **Cookies Policy** (`/cookies-policy`) - Cookie usage and consent information
- **Terms & Conditions** (`/terms-conditions`) - Terms of service and conditions
- **Returns & Refunds** (`/returns-policy`) - Return and refund policies

#### 3. Customer Service
- **Shipping Info** (`/shipping`) - Shipping and delivery information
- **Accessibility** (`/accessibility`) - Accessibility statement
- **Impressum** (`/impressum`) - Legal company information (required in Germany/Austria)

## Implementation

### Static Footer Structure

The footer is implemented as a static component without external dependencies on Shopify menus, making it:

- **Fast**: No API calls required
- **Reliable**: No external service dependencies
- **SEO-friendly**: All links are server-side rendered
- **Maintainable**: Easy to modify and extend

### Page Structure

Each footer page follows a consistent structure:

```
src/app/[page-slug]/
├── page.tsx          # Main page component
├── components/       # Optional page-specific components
└── README.md         # Page documentation (optional)
```

### Design System

The footer uses:
- **Responsive Design**: Mobile-first approach with responsive columns
- **Dark Mode Support**: Automatic theme switching
- **Accessibility**: Proper semantic HTML and ARIA labels
- **Typography**: Consistent text sizing and spacing

## Legal Compliance

### GDPR/RODO Requirements

The footer includes all mandatory pages for European websites:

1. **Privacy Policy** - Details data processing, user rights, and contact information
2. **Cookies Policy** - Explains cookie usage, consent mechanisms, and withdrawal options
3. **Terms & Conditions** - Defines service terms, user responsibilities, and limitations
4. **Impressum** - Required legal company information for German/Austrian websites

### Additional Pages

- **Accessibility Statement** - WCAG compliance and accessibility features
- **Returns Policy** - Clear return and refund procedures
- **Shipping Information** - Delivery terms and costs
- **FAQ** - Common customer questions and answers

## Usage

### Basic Implementation

```tsx
import Footer from "@/components/layout/footer";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div>
      {children}
      <Footer />
    </div>
  );
}
```

### Customization

The footer links are defined in the `footerLinks` array and can be easily customized:

```tsx
const footerLinks = [
  {
    title: "Your Section",
    links: [
      { title: "Custom Page", href: "/custom-page" },
      // Add more links...
    ],
  },
];
```

## Page Templates

All pages follow consistent templates with:

- **Hero Section**: Page title and brief description
- **Content Sections**: Organized information blocks
- **Contact Information**: Relevant contact details
- **Last Updated**: Document versioning

## SEO Optimization

Each page includes:
- **Meta Tags**: Title, description, and keywords
- **Structured Data**: JSON-LD for better search visibility
- **Semantic HTML**: Proper heading hierarchy
- **Internal Linking**: Cross-references to related pages

## Maintenance

### Regular Updates Required

- **Privacy Policy**: Review annually or when processing changes
- **Cookies Policy**: Update when cookie usage changes
- **Terms & Conditions**: Review with legal counsel periodically
- **Contact Information**: Keep current across all pages

### Content Management

Pages are static but can be made dynamic by:
- Integrating with a CMS
- Using environment variables for contact details
- Implementing internationalization (i18n)

## Dependencies

- **Next.js**: For routing and page generation
- **React**: Component framework
- **Tailwind CSS**: Styling system
- **Lucide React**: Icons (if used in page components)

## File Structure

```
src/components/layout/footer/
├── index.tsx              # Main footer component
├── footer-menu.tsx        # Legacy menu component (deprecated)
└── README.md             # This documentation

src/app/
├── about/page.tsx
├── contact/page.tsx
├── privacy-policy/page.tsx
├── cookies-policy/page.tsx
├── terms-conditions/page.tsx
├── returns-policy/page.tsx
├── shipping/page.tsx
├── accessibility/page.tsx
├── impressum/page.tsx
└── faq/page.tsx
```

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Screen readers and assistive technologies

## Accessibility

- **WCAG 2.1 AA Compliant**: Meets European accessibility standards
- **Keyboard Navigation**: All links accessible via keyboard
- **Screen Reader Support**: Proper ARIA labels and semantic markup
- **Color Contrast**: Sufficient contrast ratios for readability

## Performance

- **Static Generation**: All pages can be statically generated
- **Minimal Bundle Size**: No external JavaScript dependencies
- **Fast Loading**: Optimized for Core Web Vitals
- **SEO Optimized**: Structured for search engine indexing
