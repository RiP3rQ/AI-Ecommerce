# Supabase Authentication with Next.js

This document provides a comprehensive overview of how Supabase authentication is implemented in this Next.js application using server actions, middleware, and proper TypeScript typing.

## Architecture Overview

The authentication system is built using:

- **Supabase Auth**: For user authentication and session management
- **Next.js Server Actions**: For handling form submissions on the server
- **Middleware**: For route protection and session validation
- **TypeScript**: For type safety throughout the application

## Core Components

### 1. Supabase Auth Configuration

#### Environment Variables (`src/env.ts`)

```typescript
export const env = createEnv({
  client: {
    NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string().min(1),
  },
  // ... other config
});
```

Required environment variables:
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`: Your Supabase public/anon key

#### Server Client (`src/supabase-auth/server.ts`)

Creates a Supabase client for server-side operations:

```typescript
export async function createServerSupabaseClient() {
  const cookieStore = await cookies();
  return createServerClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          // Handle cookie setting for server components
        },
      },
    }
  );
}
```

#### Client Client (`src/supabase-auth/client.ts`)

Creates a Supabase client for client-side operations:

```typescript
export function createClientSupabaseClient() {
  return createBrowserClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  );
}
```

### 2. Server Actions (`src/app/auth/actions.ts`)

Server actions handle authentication logic on the server side:

```typescript
"use server";

export async function login(formData: FormData): Promise<void> {
  const supabase = await createServerSupabaseClient();

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    redirect("/error");
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function signup(formData: FormData): Promise<void> {
  const supabase = await createServerSupabaseClient();

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signUp(data);

  if (error) {
    redirect("/error");
  }

  revalidatePath("/", "layout");
  redirect("/");
}
```

**Key Points:**
- Uses `"use server"` directive to run on the server
- Creates a new Supabase client instance for each request
- Handles errors by redirecting to an error page
- Uses `revalidatePath` to refresh the layout after successful authentication
- Redirects to home page after successful login/signup

### 3. Middleware (`src/supabase-auth/middleware.ts` & `src/middleware.ts`)

The middleware handles session validation and route protection:

```typescript
export async function updateSupabaseSession(request: NextRequest) {
  // Create Supabase client with cookie handling
  const supabase = createServerClient(/* config */);

  // Get user session
  const { data: { user } } = await supabase.auth.getUser();

  // Redirect unauthenticated users to login
  if (!user && !request.nextUrl.pathname.startsWith("/login") && /* other allowed paths */) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
```

**Route Protection Logic:**
- Allows access to `/login`, `/auth/*`, and `/error` for unauthenticated users
- Redirects all other requests to `/login` if no valid session exists
- Preserves session state through proper cookie handling

### 4. Authentication Pages

#### Login Page (`src/app/auth/login/page.tsx`)

```typescript
import { LoginForm } from "@/app/auth/login/components/login-form";
import { login } from "../actions";

export default function LoginPage() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-4xl">
        <LoginForm loginHandler={login} />
      </div>
    </div>
  );
}
```

#### Login Form Component (`src/app/auth/login/components/login-form.tsx`)

A React component that handles the login form UI:

```typescript
interface LoginFormProps extends ComponentProps<"div"> {
  loginHandler: (formData: FormData) => Promise<void>;
}

export function LoginForm({ loginHandler, ...props }: LoginFormProps) {
  return (
    <form action={loginHandler}>
      {/* Form fields and UI */}
    </form>
  );
}
```

#### Sign-Up Page (`src/app/auth/sign-up/page.tsx`)

```typescript
import { RegisterForm } from "@/app/auth/sign-up/components/register-form";
import { signup } from "../actions";

export default function SignUpPage() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-4xl">
        <RegisterForm registerHandler={signup} />
      </div>
    </div>
  );
}
```

#### Register Form Component (`src/app/auth/sign-up/components/register-form.tsx`)

Similar to the login form but includes password confirmation:

```typescript
interface RegisterFormProps extends ComponentProps<"div"> {
  registerHandler: (formData: FormData) => Promise<void>;
}

export function RegisterForm({ registerHandler, ...props }: RegisterFormProps) {
  return (
    <form action={registerHandler}>
      {/* Email, password, confirm password fields */}
    </form>
  );
}
```

## Authentication Flow

### Login Flow

1. User navigates to `/auth/login`
2. User fills out login form (email + password)
3. Form submits to `login` server action
4. Server action calls `supabase.auth.signInWithPassword()`
5. On success: redirects to home page and refreshes layout
6. On failure: redirects to error page

### Sign-Up Flow

1. User navigates to `/auth/sign-up`
2. User fills out registration form (email + password + confirm password)
3. Form submits to `signup` server action
4. Server action calls `supabase.auth.signUp()`
5. On success: redirects to home page and refreshes layout
6. On failure: redirects to error page

### Route Protection Flow

1. User makes request to protected route
2. Middleware checks for valid session via `supabase.auth.getUser()`
3. If no valid session and not on allowed route: redirect to `/login`
4. If valid session or allowed route: continue request

## Security Considerations

### Server-Side Authentication

- All authentication logic runs on the server using Server Actions
- No sensitive authentication data is exposed to the client
- Form data is processed server-side before any Supabase API calls

### Session Management

- Sessions are managed via HTTP-only cookies by Supabase
- Cookie handling is properly configured for both server and client environments
- Middleware validates sessions on every request to protected routes

### Input Validation

- Basic HTML5 validation on form fields (`required`, `type="email"`, `minLength`)
- Server-side validation should be added for production (currently noted in comments)
- Password confirmation field in registration form

## Best Practices Implemented

### 1. Server Actions Over API Routes

- Uses Next.js Server Actions instead of API routes for form handling
- Reduces client-server round trips
- Better integration with React's form handling

### 2. Proper Error Handling

- Centralized error handling in server actions
- User-friendly error pages for authentication failures
- Graceful fallbacks for authentication errors

### 3. Route-Based Access Control

- Middleware-based route protection
- Clear separation of public and protected routes
- Automatic redirects for unauthenticated users

### 4. Type Safety

- Full TypeScript support throughout the auth system
- Proper typing for server actions and form handlers
- Environment variable validation with Zod schemas

## Future Enhancements

### Recommended Additions

1. **Enhanced Validation**: Implement Zod schemas for form validation
2. **Password Reset**: Add forgot password functionality
3. **Email Verification**: Handle email confirmation flow
4. **Social Auth**: Implement Google OAuth (UI placeholder exists)
5. **Session Management**: Add session timeout handling
6. **Rate Limiting**: Add rate limiting for auth endpoints

### Production Considerations

1. **Database Integration**: Connect user profiles to your database schema
2. **Audit Logging**: Log authentication events for security monitoring
3. **Multi-Factor Authentication**: Add 2FA support
4. **Security Headers**: Implement proper security headers
5. **Monitoring**: Add authentication metrics and monitoring

## Troubleshooting

### Common Issues

1. **"Auth session missing" errors**: Check middleware configuration and cookie handling
2. **Redirect loops**: Ensure proper path exclusions in middleware
3. **CORS issues**: Verify Supabase URL and key configuration
4. **Session persistence**: Check cookie settings and domain configuration

### Debug Steps

1. Verify environment variables are properly set
2. Check Supabase project settings and API keys
3. Test server actions independently
4. Monitor network requests in browser dev tools
5. Check server logs for authentication errors

## Dependencies

- `@supabase/ssr`: Supabase client for server-side rendering
- `@supabase/supabase-js`: Core Supabase JavaScript client
- `next/navigation`: Next.js navigation utilities
- `@t3-oss/env-core`: Environment variable validation
- `zod`: Schema validation (for env vars)

This authentication system provides a solid foundation for user management in your Next.js application while maintaining security best practices and modern React patterns.
