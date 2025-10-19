import { defineConfig } from "vitest/config";
import path from "path";
import dotenv from "dotenv";

// Load test environment variables
dotenv.config({ path: ".env.test" });

export default defineConfig({
  test: {
    // Global setup file to initialize test database (runs once)
    globalSetup: ["./src/test/setup/global-setup.ts"],

    // Setup file to run before each test file
    setupFiles: ["./src/test/setup/test-setup.ts"],

    // Global test settings
    globals: true,
    environment: "node",

    // Test file patterns - tests alongside features
    include: ["src/**/*.test.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    exclude: ["node_modules", "dist", "build"],

    // OPTIMIZATION: Reduced timeout for faster feedback on hanging tests
    // Transaction-based tests should complete quickly
    testTimeout: 5000,

    // OPTIMIZATION: Bail after 5 failures to save time on debugging
    bail: 5,

    // Coverage configuration
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: [
        "coverage/**",
        "dist/**",
        "src/database/migrations/**",
        "**/*.d.ts",
        "**/*.config.*",
        "**/node_modules/**",
        "src/test/**",
      ],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80,
        },
      },
    },

    // Reporter configuration
    reporters: ["verbose"],

    // Pool options for parallel testing - optimized for speed
    pool: "threads",
    poolOptions: {
      threads: {
        singleThread: true, // [Temporary] Disable parallel execution within limits
        minThreads: 1, // Start with minimal threads
        maxThreads: 4, // Max 4 threads (optimal for transaction-based DB work)
      },
    },

    // OPTIMIZATION: Disable isolation per test for faster execution
    // Tests use database transactions for isolation instead
    isolate: false,

    // OPTIMIZATION: Disable file isolation for faster parallel execution
    fileParallelism: true,
  },

  // Resolve configuration
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@test": path.resolve(__dirname, "./test"),
    },
  },

  // Define constants
  define: {
    "import.meta.vitest": undefined,
  },
});
