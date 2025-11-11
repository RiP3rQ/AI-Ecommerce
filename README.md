# 🤖 AI-Powered E-commerce Fashion Platform

<div align="center">

![AI E-commerce](public/images/ecommerce_login_page.png)

[![Next.js](https://img.shields.io/badge/Next.js-15.5.4-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-2.76.1-green)](https://supabase.com/)
[![Drizzle](https://img.shields.io/badge/Drizzle-ORM-orange)](https://orm.drizzle.team/)
[![Google Gemini](https://img.shields.io/badge/Google-Gemini-2.5--Flash-yellow)](https://ai.google.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1.15-38B2AC)](https://tailwindcss.com/)

*Revolutionizing fashion retail with AI-driven shopping assistance and intelligent product discovery*

[🚀 Live Demo](#) | [📖 Documentation](#features) | [🛠️ Tech Stack](#tech-stack)

</div>

---

## 🌟 Overview

Welcome to the **AI-Powered E-commerce Fashion Platform** - a modern e-commerce solution that leverages artificial intelligence to enhance the online shopping experience. This platform combines traditional e-commerce functionality with cutting-edge AI features including an intelligent shopping assistant, AI-powered review analysis, and smart product recommendations.

### 🎯 Core Features

This platform transforms online fashion shopping by providing:

- **AI Shopping Assistant**: A conversational chatbot that helps users discover products, create outfit combinations, and complete purchases
- **AI Review Intelligence**: Automated review summarization and interactive Q&A about product feedback
- **Smart Product Recommendations**: Vector-based product similarity matching and cart-aware suggestions
- **Complete E-commerce Suite**: Product catalog, shopping cart, secure checkout, and user reviews

---

## ✨ Features

### 🤖 AI Shopping Assistant ("AI-Riper")
- **Conversational Shopping**: Interactive chatbot powered by Google Gemini 2.5 Flash
- **Product Discovery**: Natural language search and product recommendations
- **Outfit Creation**: AI-generated outfit combinations from catalog items
- **Smart Cart Management**: 4-step guided cart addition with variant selection
- **Real-time Assistance**: Context-aware help throughout the shopping journey

### 🧠 AI Review Intelligence
- **Review Summarization**: Automated distillation of customer feedback into key insights
- **Interactive Q&A**: Ask questions about products based on real customer reviews
- **Sentiment Analysis**: Balanced overview of product strengths and concerns
- **User Feedback Loop**: Like/dislike system for improving AI summaries

### 🎯 Smart Product Recommendations
- **Vector Embeddings**: Product similarity matching using vector embeddings
- **Cart-Aware Suggestions**: Context-aware recommendations based on cart contents
- **Cross-selling Engine**: Intelligent complementary product suggestions
- **Personalized Discovery**: Usage-based product recommendations

### 🏪 Complete E-commerce Platform
- **Secure Authentication**: Supabase-powered user management and session handling
- **Product Catalog**: Fashion products with variants, images, and categories
- **Advanced Shopping Cart**: Persistent cart with quantity management
- **Comprehensive Checkout**: Complete purchase flow with order processing
- **Product Reviews**: User-generated reviews with ratings and feedback
- **Search & Filtering**: Multi-criteria product search and category browsing

### 🛡️ Technical Excellence
- **Type Safety**: Full TypeScript implementation with strict typing
- **Input Validation**: Zod schemas for all API inputs and forms
- **Database Performance**: Optimized queries with Drizzle ORM and PostgreSQL
- **AI Cost Management**: Usage tracking and rate limiting for AI features

---

## 🛠️ Tech Stack

### Frontend
- **[Next.js 15](https://nextjs.org/)** - React framework with App Router
- **[TypeScript 5](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[Tailwind CSS 4](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Shadcn/ui](https://ui.shadcn.com/)** - Accessible component library
- **[React Hook Form](https://react-hook-form.com/)** - Performant forms with validation
- **[Zod](https://zod.dev/)** - TypeScript-first schema validation

### Backend & Database
- **[Supabase](https://supabase.com/)** - Backend-as-a-Service with PostgreSQL
- **[Drizzle ORM](https://orm.drizzle.team/)** - Type-safe SQL query builder
- **[PostgreSQL](https://www.postgresql.org/)** - Primary database with vector extensions

### AI & Machine Learning
- **[Vercel AI SDK (v6 BETA)](https://sdk.vercel.ai/)** - Streaming AI responses and tool calling
- **[Google Gemini 2.5 Flash](https://ai.google.dev/)** - Advanced conversational AI model
- **Vector Embeddings** - Product similarity matching with PostgreSQL vector extension
- **Custom AI Tools** - Specialized functions for e-commerce operations

### Development & Testing
- **[Biome](https://biomejs.dev/)** - Fast linter and formatter
- **[Vitest](https://vitest.dev/)** - Lightning-fast unit testing
- **[Playwright](https://playwright.dev/)** - End-to-end testing
- **[GitHub Actions](https://github.com/features/actions)** - CI/CD pipeline

### Deployment & Hosting
- **[Vercel](https://vercel.com/)** - Global CDN with edge functions
- **[Docker](https://www.docker.com/)** - Containerized deployment ready

---

## 🚀 Quick Start

### Prerequisites
- **Node.js 22+** (required)
- **pnpm** package manager
- **Supabase** account for backend services
- **Google Gemini API** key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/rip3rq/ai-ecommerce.git
   cd ai-ecommerce
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```

   Configure your `.env` file with the following variables:
   ```env
   # Database
   DATABASE_URL="postgresql://user:password@localhost:5432/ai_ecommerce"

   # Supabase Authentication
   NEXT_PUBLIC_SUPABASE_URL="your-supabase-project-url"
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY="your-supabase-anon-key"

   # AI Configuration
   GEMINI_API_KEY="your-google-gemini-api-key"

   # Application Settings
   NEXT_PUBLIC_SITE_NAME="AI Ecommerce"
   NODE_ENV="development"
   ```

4. **Database Setup**
   ```bash
   # Push schema to database
   pnpm drizzle-kit migrate

   # Generate embeddings for products
   pnpm embeddings:generate
   ```

5. **Development Server**
   ```bash
   pnpm dev
   ```

   Open [http://localhost:3000](http://localhost:3000) to see your app!

### 🧪 Testing

```bash
# Unit tests
pnpm test

# Unit tests with coverage
pnpm test:coverage

# E2E tests
pnpm test:e2e

# E2E tests with UI
pnpm test:e2e:ui
```

### 📦 Build for Production

```bash
# Build the application
pnpm build

# Start production server
pnpm start
```

---

## 📁 Project Structure

```
ai-ecommerce/
├── docs/                          # Documentation
├── e2e/                           # End-to-end tests (Playwright)
│   ├── auth-helpers.ts
│   ├── login.spec.ts
│   └── shop.spec.ts
├── src/
│   ├── ai/                        # AI functionality
│   │   ├── ai-sdk.test.ts         # AI SDK tests
│   │   ├── ai-sdk.ts              # AI SDK handler
│   │   ├── constants.ts           # AI configuration
│   │   ├── gemini-provider.ts     # Google Gemini provider
│   │   ├── tool-helpers/          # Tool helper functions
│   │   │   ├── cart-tools.ts
│   │   │   ├── combo-outfit.ts
│   │   │   └── product-tools.ts
│   │   ├── tools/                 # AI tool definitions
│   │   │   ├── add-to-cart-product-informations.ts
│   │   │   ├── all-categories.ts
│   │   │   ├── combo-outfit.ts
│   │   │   ├── confirm-add-to-cart.ts
│   │   │   ├── get-cart-details.ts
│   │   │   ├── most-liked-products.ts
│   │   │   ├── product-details.ts
│   │   │   ├── product-reviews.ts
│   │   │   ├── products-by-category.ts
│   │   │   ├── revalidate-frontend-cart.ts
│   │   │   ├── search-by-name.ts
│   │   │   ├── search-by-tags.ts
│   │   │   └── suggest-products.ts
│   │   ├── tools.ts               # Tool exports
│   │   └── types.ts               # AI type definitions
│   ├── app/                       # Next.js 15 app directory
│   │   ├── api/                   # API routes
│   │   │   ├── ai/                # AI-powered endpoints
│   │   │   │   ├── ai-assistant/  # Streaming AI assistant
│   │   │   │   ├── ask-reviews/   # Review Q&A
│   │   │   │   ├── suggest-products/ # Product recommendations
│   │   │   │   └── summorize-reviews/ # Review summarization
│   │   │   ├── cart/              # Cart management
│   │   │   ├── categories/        # Category operations
│   │   │   ├── main-page/         # Homepage data
│   │   │   ├── order/             # Order management
│   │   │   ├── product/           # Product operations
│   │   │   ├── register/          # User registration
│   │   │   ├── review/            # Review operations
│   │   │   └── shop/              # Shop filtering/search
│   │   ├── auth/                  # Authentication pages
│   │   │   ├── confirm/           # Email confirmation
│   │   │   ├── error/             # Auth errors
│   │   │   ├── forgot-password/   # Password reset
│   │   │   ├── login/             # Login page
│   │   │   ├── sign-up/           # Registration
│   │   │   ├── sign-up-success/   # Registration success
│   │   │   └── update-password/   # Password update
│   │   ├── (compliance)/          # Legal pages
│   │   │   ├── about/
│   │   │   ├── accessibility/
│   │   │   ├── contact/
│   │   │   ├── cookies-policy/
│   │   │   ├── faq/
│   │   │   ├── impressum/
│   │   │   ├── privacy-policy/
│   │   │   ├── returns-policy/
│   │   │   ├── shipping/
│   │   │   └── terms-conditions/
│   │   ├── (protected-main)/      # Protected routes
│   │   │   ├── checkout/          # Checkout flow
│   │   │   │   ├── complete/      # Order completion
│   │   │   │   └── page.tsx       # Checkout page
│   │   │   └── layout.tsx        # Protected layout
│   │   ├── (public-routes)/       # Public routes
│   │   │   ├── (main-page)/       # Homepage
│   │   │   ├── [categoryName]/    # Category pages
│   │   │   ├── layout.tsx         # Public layout
│   │   │   ├── product/           # Product detail pages
│   │   │   └── shop/              # Shop browsing
│   │   ├── error.tsx              # Error boundary
│   │   ├── favicon.ico
│   │   ├── globals.css            # Global styles
│   │   ├── layout.tsx             # Root layout
│   │   └── not-found.tsx          # 404 page
│   ├── components/                # React components
│   │   ├── ai-elements/           # AI UI components
│   │   ├── auth-guard.tsx         # Authentication guard
│   │   ├── cart/                  # Shopping cart components
│   │   ├── chatbot/               # AI assistant chat UI
│   │   ├── checkout/              # Checkout flow components
│   │   ├── checkout-complete/     # Order completion UI
│   │   ├── custom-label.tsx       # Custom form labels
│   │   ├── custom-price.tsx       # Price display component
│   │   ├── global/                # Global UI components
│   │   ├── grid/                  # Layout grid components
│   │   ├── layout/                # Layout components
│   │   │   ├── footer/            # Site footer
│   │   │   └── navbar/            # Navigation bar
│   │   ├── loading-dots.tsx       # Loading animation
│   │   ├── logo.tsx               # Site logo
│   │   ├── marquee/               # Scrolling marquee
│   │   ├── products/              # Product display components
│   │   ├── shop/                  # Shop browsing components
│   │   ├── tour/                  # Onboarding tour
│   │   └── ui/                    # Reusable UI components (Shadcn/ui)
│   ├── database/                  # Database configuration
│   │   ├── migrations/            # Drizzle migrations
│   │   └── schema.ts              # Database schema exports
│   ├── env.ts                     # Environment configuration
│   ├── hooks/                     # Custom React hooks
│   ├── lib/                       # Utility libraries
│   ├── middleware.ts              # Next.js middleware
│   ├── providers/                 # React context providers
│   ├── schemas/                   # Zod validation schemas
│   ├── scripts/                   # Utility scripts
│   │   └── create-embeddings-for-products.ts
│   ├── supabase-auth/             # Supabase authentication
│   │   ├── client.ts
│   │   ├── middleware.ts
│   │   └── server.ts
│   ├── test/                      # Test utilities
│   ├── types/                     # TypeScript definitions
│   └── utils.ts                   # Utility functions
├── .github/workflows/             # CI/CD pipelines
├── public/                        # Static assets
├── docker-compose.yml             # Docker configuration
└── package.json                   # Project dependencies
```

---

## 🔧 API Endpoints

### 🤖 AI-Powered Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/ai/ai-assistant` | POST | Streaming AI shopping assistant with product tools |
| `/api/ai/summorize-reviews` | POST | Generate AI-powered review summaries |
| `/api/ai/suggest-products` | POST | Get intelligent product recommendations based on cart |
| `/api/ai/ask-reviews` | POST | Interactive Q&A about product reviews |

### 🛒 E-commerce Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/product/[id]` | GET | Get detailed product information |
| `/api/cart` | GET/POST/PUT/DELETE | Shopping cart management |
| `/api/cart/checkout` | POST | Process checkout and create orders |
| `/api/categories` | GET | Get product categories |
| `/api/main-page` | GET | Get featured products for homepage |
| `/api/review` | GET/POST | Product review operations |
| `/api/shop` | GET | Shop products with filtering and search |
| `/api/register` | POST | User registration |
| `/api/order/[id]` | GET | Get order details |

---

## 🎨 Screenshots

### Authentication Flow
![Login Page](public/images/ecommerce_login_page.png)

### Product Catalog
*Browse through our curated product selection with advanced filtering*

### AI Review Summarization
*Experience instant insights from hundreds of reviews*

### Intelligent Checkout
*Discover complementary products powered by AI*

---

## 📊 Key Features & Capabilities

### AI Assistant Capabilities
- **Product Discovery**: Natural language search across catalog
- **Outfit Recommendations**: AI-generated style combinations
- **Cart Assistance**: Guided product addition with variant selection
- **Review Intelligence**: Summarization and Q&A about customer feedback
- **Smart Suggestions**: Context-aware product recommendations

### Technical Architecture
- **Streaming AI**: Real-time conversational responses
- **Vector Search**: Semantic product similarity matching
- **Type Safety**: Full TypeScript with runtime validation
- **Scalable Database**: PostgreSQL with optimized queries
- **Modern Testing**: Unit tests with Vitest, E2E with Playwright

---

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Configure environment variables
3. Deploy automatically on push to main

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes** and ensure tests pass
4. **Commit your changes**: `git commit -m 'Add amazing feature'`
5. **Push to the branch**: `git push origin feature/amazing-feature`
6. **Open a Pull Request**

### Development Guidelines
- Follow TypeScript strict mode
- Write comprehensive tests
- Update documentation for new features
- Use conventional commit messages

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Google Gemini 2.5 Flash** for powering conversational AI and review intelligence
- **Supabase** for authentication, database, and backend infrastructure
- **Vercel AI SDK** for streamlined AI integration and streaming responses
- **Drizzle ORM** for type-safe database operations
- **Shadcn/ui & Radix UI** for accessible, beautiful components
- **The open-source community** for the amazing ecosystem of tools

---

<div align="center">

**Made with ❤️ and AI-powered innovation**

[⭐ Star us on GitHub](https://github.com/rip3rq/ai-ecommerce) • [🐛 Report a bug](https://github.com/rip3rq/ai-ecommerce/issues) • [💡 Request a feature](https://github.com/rip3rq/ai-ecommerce/issues)

</div>