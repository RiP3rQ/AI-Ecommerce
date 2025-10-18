import { beforeEach, vi } from "vitest";
import type { SupabaseClient } from "@supabase/supabase-js";

// Mock Supabase auth client to prevent actual API calls during tests
const mockSupabaseClient = {
  auth: {
    getUser: vi.fn(),
    signUp: vi.fn(),
    signInWithPassword: vi.fn(),
    signOut: vi.fn(),
    updateUser: vi.fn(),
    resetPasswordForEmail: vi.fn(),
    getSession: vi.fn(),
    onAuthStateChange: vi.fn(),
  },
} as unknown as SupabaseClient;

// Mock cookies function from Next.js
const mockCookies = () => ({
  getAll: vi.fn(() => []),
  setAll: vi.fn(),
  get: vi.fn(),
  set: vi.fn(),
  remove: vi.fn(),
});

// Mock the Supabase auth modules
vi.mock("../../supabase-auth/server", () => ({
  createServerSupabaseClient: vi.fn(() => mockSupabaseClient),
}));

vi.mock("../../supabase-auth/client", () => ({
  createClientSupabaseClient: vi.fn(() => mockSupabaseClient),
}));

vi.mock("../../supabase-auth/middleware", () => ({
  updateSupabaseSession: vi.fn(),
}));

// Mock Next.js cookies
vi.mock("next/headers", () => ({
  cookies: mockCookies,
}));

// Mock Next.js navigation (for redirects)
vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    prefetch: vi.fn(),
  })),
}));

// Setup runs before each test file
beforeEach(() => {
  // Reset all mocks before each test
  vi.clearAllMocks();

  // Set default mock implementations for auth methods
  (mockSupabaseClient.auth.getUser as any).mockResolvedValue({
    data: { user: null },
    error: null,
  });

  (mockSupabaseClient.auth.getSession as any).mockResolvedValue({
    data: { session: null },
    error: null,
  });

  (mockSupabaseClient.auth.signUp as any).mockResolvedValue({
    data: { user: null, session: null },
    error: null,
  });

  (mockSupabaseClient.auth.signInWithPassword as any).mockResolvedValue({
    data: { user: null, session: null },
    error: null,
  });

  (mockSupabaseClient.auth.signOut as any).mockResolvedValue({
    error: null,
  });
});

/**
 * Helper function to mock authenticated user for tests
 */
export function mockAuthenticatedUser(user: {
  id: string;
  email?: string;
  user_metadata?: Record<string, any>;
}) {
  const mockUser = {
    id: user.id,
    email: user.email || "test@example.com",
    user_metadata: user.user_metadata || {},
    app_metadata: {},
    aud: "authenticated",
    created_at: new Date().toISOString(),
  };

  (mockSupabaseClient.auth.getUser as any).mockResolvedValue({
    data: { user: mockUser },
    error: null,
  });

  (mockSupabaseClient.auth.getSession as any).mockResolvedValue({
    data: {
      session: {
        access_token: "mock-access-token",
        refresh_token: "mock-refresh-token",
        expires_at: Date.now() + 3600000, // 1 hour from now
        user: mockUser,
      },
    },
    error: null,
  });

  return mockUser;
}

/**
 * Helper function to mock unauthenticated state
 */
export function mockUnauthenticatedUser() {
  (mockSupabaseClient.auth.getUser as any).mockResolvedValue({
    data: { user: null },
    error: null,
  });

  (mockSupabaseClient.auth.getSession as any).mockResolvedValue({
    data: { session: null },
    error: null,
  });
}

/**
 * Helper function to mock auth errors
 */
export function mockAuthError(error: { message: string; status?: number }) {
  (mockSupabaseClient.auth.getUser as any).mockResolvedValue({
    data: { user: null },
    error,
  });

  (mockSupabaseClient.auth.getSession as any).mockResolvedValue({
    data: { session: null },
    error,
  });
}
