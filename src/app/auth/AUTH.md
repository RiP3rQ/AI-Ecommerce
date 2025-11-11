# Supabase Authentication with Next.js

This document provides a comprehensive overview of how Supabase authentication is implemented in this Next.js application using client-side components, server-side middleware, and proper TypeScript typing.

## Architecture Overview

The authentication system is built using:

- **Supabase Auth**: For user authentication and session management
- **React Client Components**: For handling form submissions and user interactions
- **Middleware**: For route protection and session validation
- **API Routes**: For email verification handling
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

### 2. Client Components

Authentication forms are implemented as client components that handle user interactions and API calls directly from the browser:

**Key Points:**
- Uses `"use client"` directive for interactive components
- Creates Supabase client instances in the browser using `createClientSupabaseClient()`
- Handles form validation and error states using React state
- Manages loading states and user feedback during authentication
- Redirects users programmatically using Next.js router

### 3. Middleware (`src/supabase-auth/middleware.ts` & `src/middleware.ts`)

The middleware handles session validation and route protection using Supabase SSR:

```typescript
export async function updateSupabaseSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(/* config with cookie handling */);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (
    !user &&
    !request.nextUrl.pathname.startsWith("/auth/login") &&
    !request.nextUrl.pathname.startsWith("/auth") &&
    !request.nextUrl.pathname.startsWith("/error")
  ) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
```

**Route Protection Logic:**
- Allows access to `/auth/login`, `/auth/*`, and `/error` for unauthenticated users
- Redirects all other requests to `/auth/login` if no valid session exists
- Preserves session state through proper cookie synchronization between server and client

### 4. Authentication Pages

The application includes a complete set of authentication pages:

#### Login Page (`src/app/auth/login/page.tsx`)

A server component that renders the login form:

```typescript
export default function LoginPage(): ReactNode {
  return (
    <div className="bg-muted flex min-h-[calc(100vh-72px)] flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-4xl">
        <LoginForm />
      </div>
    </div>
  );
}
```

#### Login Form Component (`src/app/auth/login/components/login-form.tsx`)

A client component with state management for login:

```typescript
export function LoginForm({ className, ...props }: LoginFormProps): ReactNode {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleLogin = async (e: React.FormEvent) => {
    // Client-side authentication logic
  };
  // ... form UI with email, password fields, forgot password link
}
```

#### Sign-Up Page (`src/app/auth/sign-up/page.tsx`)

```typescript
export default function SignUpPage(): ReactNode {
  return (
    <div className="bg-muted flex min-h-[calc(100vh-72px)] flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-4xl">
        <RegisterForm />
      </div>
    </div>
  );
}
```

#### Register Form Component (`src/app/auth/sign-up/components/register-form.tsx`)

Client component with password confirmation and email verification setup:

```typescript
export function RegisterForm({ className, ...props }: RegisterFormProps): ReactNode {
  // State management for email, password, repeatPassword, error, isLoading

  const handleSignUp = async (e: React.FormEvent) => {
    // Password validation and Supabase signUp with emailRedirectTo
    router.push("/auth/sign-up-success");
  };
  // ... form with email, password, confirm password fields
}
```

#### Sign-Up Success Page (`src/app/auth/sign-up-success/page.tsx`)

Displays confirmation message after successful registration:

```typescript
export default function Page(): ReactNode {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Thank you for signing up!</CardTitle>
        <CardDescription>Check your email to confirm</CardDescription>
      </CardHeader>
      <CardContent>
        <p>You've successfully signed up. Please check your email to confirm your account.</p>
      </CardContent>
    </Card>
  );
}
```

#### Forgot Password Page (`src/app/auth/forgot-password/page.tsx`)

```typescript
export default function Page(): ReactNode {
  return (
    <div className="flex min-h-[calc(100vh-72px)] w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <ForgotPasswordForm />
      </div>
    </div>
  );
}
```

#### Forgot Password Form Component (`src/app/auth/forgot-password/components/forgot-password-form.tsx`)

Handles password reset email sending with success state management:

```typescript
export function ForgotPasswordForm({ className, ...props }: React.ComponentPropsWithoutRef<"div">): ReactNode {
  // State for email, error, success, isLoading

  const handleForgotPassword = async (e: React.FormEvent) => {
    const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/update-password`,
    });
    if (!error) setSuccess(true);
  };
  // ... conditional rendering for success/error states
}
```

#### Update Password Page (`src/app/auth/update-password/page.tsx`)

```typescript
export default function Page(): ReactNode {
  return (
    <div className="flex min-h-[calc(100vh-72px)] w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <UpdatePasswordForm />
      </div>
    </div>
  );
}
```

#### Update Password Form Component (`src/app/auth/update-password/components/update-password-form.tsx`)

Allows users to set a new password after clicking reset link:

```typescript
export function UpdatePasswordForm({ className, ...props }: React.ComponentPropsWithoutRef<"div">): ReactNode {
  const handleForgotPassword = async (e: React.FormEvent) => {
    const { error } = await supabaseClient.auth.updateUser({ password });
    if (!error) router.push("/");
  };
  // ... password input form
}
```

#### Error Page (`src/app/auth/error/page.tsx`)

Displays authentication errors from URL parameters:

```typescript
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ error: string }>;
}): Promise<ReactNode> {
  const params = await searchParams;
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sorry, something went wrong.</CardTitle>
      </CardHeader>
      <CardContent>
        {params?.error ? (
          <p>Code error: {params.error}</p>
        ) : (
          <p>An unspecified error occurred.</p>
        )}
      </CardContent>
    </Card>
  );
}
```

#### Email Confirmation Route (`src/app/auth/confirm/route.ts`)

API route that handles email verification tokens:

```typescript
export async function GET(request: NextRequest): Promise<void> {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;

  if (token_hash && type) {
    const supabaseServer = await createServerSupabaseClient();
    const { error } = await supabaseServer.auth.verifyOtp({
      type,
      token_hash,
    });
    if (!error) {
      redirect(next);
    } else {
      redirect(`/auth/error?error=${error?.message}`);
    }
  }
  redirect(`/auth/error?error=No token hash or type`);
}
```

## Authentication Flow

### Login Flow

1. User navigates to `/auth/login`
2. User fills out login form (email + password)
3. Client component calls `supabase.auth.signInWithPassword()` directly
4. On success: redirects to home page using Next.js router
5. On failure: displays error message in the form

### Sign-Up Flow

1. User navigates to `/auth/sign-up`
2. User fills out registration form (email + password + confirm password)
3. Client validates password match locally
4. Client calls `supabase.auth.signUp()` with `emailRedirectTo` option
5. On success: redirects to `/auth/sign-up-success` page
6. On failure: displays error message in the form

### Email Verification Flow

1. User receives email with verification link after sign-up
2. User clicks link which navigates to `/auth/confirm?token_hash=...&type=email`
3. API route extracts token and type from URL parameters
4. Server calls `supabase.auth.verifyOtp()` to verify email
5. On success: redirects to specified redirect URL (default: home page)
6. On failure: redirects to `/auth/error` with error message

### Forgot Password Flow

1. User navigates to `/auth/forgot-password`
2. User enters email address
3. Client calls `supabase.auth.resetPasswordForEmail()` with redirect URL
4. Supabase sends password reset email with link to `/auth/update-password`
5. User clicks link in email (contains session tokens)
6. User navigates to update password form
7. Client calls `supabase.auth.updateUser()` to set new password
8. On success: redirects to home page

### Route Protection Flow

1. User makes request to any route
2. Middleware checks for valid session via `supabase.auth.getUser()`
3. If no valid session and route is not in allowed paths (`/auth/*`, `/error`): redirect to `/auth/login`
4. If valid session or allowed route: continue request with proper cookie handling

## Security Considerations

### Client-Side Authentication

- Authentication API calls are made directly from the browser using Supabase client
- Sensitive data (passwords) are transmitted securely via HTTPS to Supabase
- Client-side validation provides immediate user feedback
- Supabase handles password hashing and security on their servers

### Session Management

- Sessions are managed via HTTP-only cookies by Supabase
- Cookie handling is properly configured for both server and client environments
- Middleware validates sessions on every request to protected routes
- Automatic session refresh and token management by Supabase

### Input Validation

- HTML5 validation on form fields (`required`, `type="email"`, `minLength`)
- Client-side validation for password confirmation in registration
- Email format validation using HTML5 email input type
- Password length requirements enforced via `minLength` attribute

## Best Practices Implemented

### 1. Client Components for Interactive Forms

- Uses React client components for form interactions and state management
- Direct Supabase client integration for immediate API responses
- Optimistic UI updates with loading states and error handling

### 2. Proper Error Handling

- Client-side error handling with user-friendly error messages
- Dedicated error page for authentication failures
- Graceful error recovery with form state preservation

### 3. Route-Based Access Control

- Middleware-based route protection using Supabase SSR
- Clear separation of public and protected routes
- Automatic redirects for unauthenticated users

### 4. Type Safety

- Full TypeScript support throughout the auth system
- Proper typing for React components and event handlers
- Environment variable validation with Zod schemas

## Implemented Features

### Complete Authentication System

1. **User Registration**: Full sign-up flow with email verification
2. **User Login**: Email/password authentication with error handling
3. **Password Reset**: Complete forgot password flow with email reset links
4. **Email Verification**: Automatic email confirmation after registration
5. **Error Handling**: Dedicated error pages with detailed error messages
6. **UI Components**: Consistent design using Shadcn UI components

### Future Enhancements

1. **Enhanced Validation**: Implement Zod schemas for client-side form validation
2. **Social Auth**: Implement Google OAuth (UI placeholder exists)
3. **Session Management**: Add session timeout handling and refresh logic
4. **Rate Limiting**: Add rate limiting for auth endpoints
5. **Multi-Factor Authentication**: Add 2FA support
6. **Audit Logging**: Log authentication events for security monitoring

### Production Considerations

1. **Database Integration**: Connect user profiles to your database schema
2. **Audit Logging**: Log authentication events for security monitoring
3. **Multi-Factor Authentication**: Add 2FA support
4. **Security Headers**: Implement proper security headers
5. **Monitoring**: Add authentication metrics and monitoring

## Troubleshooting

### Common Issues

1. **"Auth session missing" errors**: Check middleware configuration and Supabase SSR setup
2. **Redirect loops**: Ensure auth route paths are properly excluded in middleware
3. **CORS issues**: Verify Supabase URL configuration and allowed origins
4. **Session persistence**: Check cookie settings and Supabase auth configuration
5. **Email verification not working**: Verify redirect URLs in Supabase dashboard
6. **Password reset links not working**: Check the redirectTo URL in resetPasswordForEmail

### Debug Steps

1. Verify environment variables are properly set in `.env.local`
2. Check Supabase project settings and API keys in dashboard
3. Test authentication flows in browser dev tools network tab
4. Check browser console for client-side errors
5. Verify middleware is running by checking response headers
6. Test email confirmation URLs manually in browser
7. Check Supabase authentication logs in dashboard

## Dependencies

- `@supabase/ssr`: Supabase client for server-side rendering and middleware
- `@supabase/supabase-js`: Core Supabase JavaScript client for browser operations
- `next/navigation`: Next.js router for client-side navigation
- `@t3-oss/env-core`: Environment variable validation with Zod
- `zod`: Schema validation for environment variables and type safety
- `@radix-ui/react-*`: UI components from Radix UI (via Shadcn UI)
- `lucide-react`: Icon library for UI components

This authentication system provides a solid foundation for user management in your Next.js application while maintaining security best practices and modern React patterns.
