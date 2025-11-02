# 🤖 AI-Powered E-commerce Platform

<div align="center">

![AI E-commerce](public/images/ecommerce_login_page.png)

[![Next.js](https://img.shields.io/badge/Next.js-15.5.4-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-2.76.1-green)](https://supabase.com/)
[![Drizzle](https://img.shields.io/badge/Drizzle-ORM-orange)](https://orm.drizzle.team/)
[![Google Gemini](https://img.shields.io/badge/Google-Gemini-yellow)](https://ai.google.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1.15-38B2AC)](https://tailwindcss.com/)

*Revolutionizing online shopping with AI-driven insights and intelligent recommendations*

[🚀 Live Demo](#) | [📖 Documentation](#features) | [🛠️ Tech Stack](#tech-stack)

</div>

---

## 🌟 Overview

Welcome to the **AI-Powered E-commerce Platform** - a cutting-edge proof-of-concept that demonstrates how artificial intelligence can transform the online shopping experience. This MVP showcases two groundbreaking AI features: **AI Review Summarization** and **Intelligent Cross-Selling Engine**, designed to solve common e-commerce challenges.

### 🎯 Core Problem Solved

Traditional e-commerce platforms overwhelm shoppers with lengthy product reviews and fail to suggest relevant complementary products. Our AI-powered solution addresses these pain points by providing:

- **Instant Review Insights**: AI-generated summaries that distill hundreds of reviews into actionable insights
- **Smart Product Discovery**: Intelligent recommendations based on product embeddings and purchase context
- **Personalized Shopping Experience**: User feedback loops that continuously improve AI recommendations

---

## ✨ Features

### 🤖 AI Review Summarization
- **Instant Summaries**: Process and summarize product reviews using Google Gemini AI
- **User Feedback**: Like/dislike buttons for continuous model improvement
- **Feature Flag Control**: Enable/disable AI features without deployment
- **Bootstrapped Data**: Pre-populated AI-generated reviews for immediate demonstration

### 🛒 Intelligent Cross-Selling Engine
- **Product Embeddings**: Vector-based product similarity matching
- **Checkout Recommendations**: Smart suggestions during purchase flow
- **Context-Aware**: Recommendations based on cart contents and user behavior
- **Performance Tracking**: Click-through and conversion rate analytics

### 🏪 Standard E-commerce Functionality
- **Secure Authentication**: Supabase-powered user management with closed beta access
- **Product Catalog**: 6-8 categories with 10+ products each
- **Shopping Cart**: Full cart management with persistence
- **Advanced Filtering**: Multi-criteria product filtering and search
- **Mock Checkout**: Complete user journey simulation
- **Responsive Design**: Mobile-first approach with dark/light themes

### 🛡️ Security & Compliance
- **Data Privacy Policy**: Transparent data usage for AI training
- **Rate Limiting**: Redis-based API rate limiting for cost control
- **Type Safety**: Full TypeScript implementation with strict typing
- **Input Validation**: Zod schemas for all user inputs

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
- **[Vercel AI SDK](https://sdk.vercel.ai/)** - Unified AI interface
- **[Google Gemini 2.5 Flash](https://ai.google.dev/)** - Advanced multimodal AI model
- **Custom Embeddings** - Vector-based product similarity matching

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
   git clone https://github.com/your-username/ai-ecommerce.git
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

   Configure your `.env` file:
   ```env
   # Database
   DATABASE_URL="postgresql://user:password@localhost:5432/ai_ecommerce"

   # Supabase
   NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY="your-supabase-key"

   # AI
   GEMINI_API_KEY="your-gemini-api-key"

   # App
   NEXT_PUBLIC_SITE_NAME="AI Ecommerce"
   ```

4. **Database Setup**
   ```bash
   # Push schema to database
   pnpm drizzle-kit push

   # Generate embeddings for products
   pnpm embeddings:generate

   # Seed database (if available)
   pnpm db:seed
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
│   ├── ai-sdk.md                  # AI integration guide
│   ├── checkout.md                # Checkout flow documentation
│   ├── database.md                # Database schema guide
│   ├── prd.md                     # Product requirements
│   └── tech-stack.md              # Technology overview
├── e2e/                           # End-to-end tests
│   ├── auth-helpers.ts
│   ├── login.spec.ts
│   └── shop.spec.ts
├── src/
│   ├── ai/                        # AI functionality
│   │   ├── ai-sdk.ts              # AI SDK handler
│   │   ├── gemini-provider.ts     # Gemini AI provider
│   │   ├── tools.ts               # AI tool definitions
│   │   └── types.ts               # AI type definitions
│   ├── app/                       # Next.js app directory
│   │   ├── api/                   # API routes
│   │   │   ├── ai/                # AI-powered endpoints
│   │   │   ├── cart/              # Cart management
│   │   │   ├── product/           # Product operations
│   │   │   └── review/            # Review handling
│   │   ├── auth/                  # Authentication pages
│   │   └── (protected-main)/      # Protected routes
│   ├── components/                # React components
│   │   ├── ai/                    # AI-related components
│   │   ├── cart/                  # Shopping cart
│   │   ├── checkout/              # Checkout flow
│   │   └── ui/                    # Reusable UI components
│   ├── database/                  # Database configuration
│   │   ├── migrations/            # Database migrations
│   │   └── schema.ts              # Drizzle schema
│   ├── hooks/                     # Custom React hooks
│   ├── lib/                       # Utility libraries
│   ├── providers/                 # React context providers
│   └── types/                     # TypeScript definitions
├── .github/workflows/             # CI/CD pipelines
├── public/                        # Static assets
├── docker-compose.yml             # Docker configuration
└── package.json                   # Project dependencies
```

---

## 🔧 API Endpoints

### AI-Powered Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/ai/summarize-reviews` | POST | Generate AI review summaries |
| `/api/ai/suggest-products` | POST | Get intelligent product recommendations |
| `/api/ai/ask-reviews` | POST | Interactive review Q&A |

### Core E-commerce Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/product` | GET/POST | Product catalog operations |
| `/api/cart` | GET/POST/PUT/DELETE | Shopping cart management |
| `/api/checkout` | POST | Process checkout (mock) |
| `/api/review` | GET/POST | Product review operations |

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

## 📊 Performance & Metrics

### AI Feature KPIs
- **Review Summarization**: Like/dislike ratio tracking
- **Cross-selling**: Click-through rate and conversion metrics
- **User Engagement**: Feature usage analytics

### Technical Metrics
- **Response Time**: <2s for AI operations
- **Uptime**: 99.9% availability target
- **Test Coverage**: >80% code coverage

---

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Configure environment variables
3. Deploy automatically on push to main

### Docker Deployment
```bash
# Build Docker image
docker build -t ai-ecommerce .

# Run with Docker Compose
docker-compose up -d
```

### Manual Deployment
```bash
# Build for production
pnpm build

# Start production server
pnpm start
```

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

- **Google Gemini** for powering our AI features
- **Supabase** for the robust backend infrastructure
- **Vercel** for seamless deployment and hosting
- **The open-source community** for amazing tools and libraries

---

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/your-username/ai-ecommerce/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/ai-ecommerce/discussions)
- **Documentation**: [Project Docs](/docs)

---

<div align="center">

**Made with ❤️ and AI-powered innovation**

[⭐ Star us on GitHub](https://github.com/your-username/ai-ecommerce) • [🐛 Report a bug](https://github.com/your-username/ai-ecommerce/issues) • [💡 Request a feature](https://github.com/your-username/ai-ecommerce/issues)

</div>