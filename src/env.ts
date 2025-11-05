import { createEnv, type StandardSchemaV1 } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  // ============================= SERVER CONFIG =============================
  server: {
    DATABASE_URL: z.string().url(),
    GEMINI_API_KEY: z.string().min(1),
    NODE_ENV: z
      .enum(["development", "production", "preview", "test", "CI"])
      .default("development"),
  },

  // ============================= CLIENT CONFIG =============================
  client: {
    NEXT_PUBLIC_SITE_NAME: z.string().min(1),
    NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string().min(1),
  },

  // ============================= GENERAL CONFIG =============================

  /**
   * The prefix that client-side variables must have. This is enforced both at
   * a type-level and at runtime.
   */
  clientPrefix: "NEXT_PUBLIC_",
  /**
   * What object holds the environment variables at runtime. This is usually
   * `process.env` or `import.meta.env`.
   */
  runtimeEnv: process.env,
  /**
   * By default, this library will feed the environment variables directly to
   * the Zod validator.
   *
   * This means that if you have an empty string for a value that is supposed
   * to be a number (e.g. `PORT=` in a ".env" file), Zod will incorrectly flag
   * it as a type mismatch violation. Additionally, if you have an empty string
   * for a value that is supposed to be a string with a default value (e.g.
   * `DOMAIN=` in an ".env" file), the default value will never be applied.
   *
   * In order to solve these issues, we recommend that all new projects
   * explicitly specify this option as true.
   */
  emptyStringAsUndefined: true,
  skipValidation: Boolean(
    (process.env.NODE_ENV as string) === "test" ||
      (process.env.NODE_ENV as string) === "CI",
  ),
  /**
   * Called when the schema validation fails.
   */
  onValidationError: (issues: readonly StandardSchemaV1.Issue[]) => {
    console.error("❌ Invalid environment variables:", issues);
    throw new Error("Invalid environment variables");
  },
  /**
   * Called when server variables are accessed on the client.
   */
  onInvalidAccess: (variable: string) => {
    throw new Error(
      "❌ Attempted to access a server-side environment variable on the client",
    );
  },
  /**
   * Tell the library when we're in a server context.
   */
  isServer: typeof window === "undefined",
});
