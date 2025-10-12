# Tech Stack

This document outlines the technology stack for the AI Ecommerce project, based on the dependencies listed in `package.json`.

## Frontend

-   **Framework**: [Next.js](https://nextjs.org/) (v15) with [React](https://react.dev/) (v19) is used to build a performant, server-rendered application.
-   **Language**: [TypeScript](https://www.typescriptlang.org/) (v5) ensures type safety and enhances the developer experience.
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/) (v4) is utilized as a utility-first CSS framework for rapid UI development.
-   **Component Library**: [Shadcn/ui](https://ui.shadcn.com/) provides a set of accessible and reusable components built on top of Radix UI.
-   **Forms**: [React Hook Form](https://react-hook-form.com/) is used for efficient form state management, paired with [Zod](https://zod.dev/) for schema validation.
-   **Icons**: [Lucide React](https://lucide.dev/) for a clean and consistent icon set.

## Backend

-   **Backend-as-a-Service (BaaS)**: [Supabase](https://supabase.com/) serves as the comprehensive backend solution, offering:
    -   A managed PostgreSQL database.
    -   User authentication and authorization services.
    -   Auto-generated APIs via its SDK.
-   **ORM**: [Drizzle ORM](https://orm.drizzle.team/) is the chosen TypeScript ORM for interacting with the PostgreSQL database, providing end-to-end type safety.

## AI Integration

-   **AI SDK**: The [Vercel AI SDK](https://sdk.vercel.ai/docs) is used to interface with AI models.
-   **AI Model**: We will be utilizing the [Google Gemini API](https://ai.google.dev/) for generative AI features.

## Development & Deployment

-   **Code Quality**: [Biome](https://biomejs.dev/) is used for linting and formatting the codebase, maintaining consistency and quality.
-   **CI/CD**: [GitHub Actions](https://github.com/features/actions) automates the build, test, and deployment pipelines.
-   **Hosting**: [Vercel](https://vercel.com/) is the platform for hosting the application, offering seamless integration with Next.js and continuous deployment.