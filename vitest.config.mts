import { defineConfig } from "vitest/config";
import path from "path";
import dotenv from "dotenv";

// Load test environment variables
dotenv.config({ path: ".env.test" });

export default defineConfig({
  test: {
    // Global setup file to connect to the test DB and run migrations
    globalSetup: ["./src/test/setup/global-setup.ts"],

    // Setup file to run before each test file (e.g., for app instantiation)
    setupFiles: ["./src/test/setup/test-setup.ts"],

    // Global test settings
    globals: true,
    environment: "node",

    // Test file patterns - tests alongside features
    include: ["src/**/*.test.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    exclude: ["node_modules", "dist", "build"],

    // Test timeout
    testTimeout: 10000,

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

    // Pool options for parallel testing - now safe with savepoints
    pool: "threads",
    poolOptions: {
      threads: {
        singleThread: false, // Enable parallel execution with savepoints
        minThreads: 12,
        maxThreads: 12, // Allow up to 12 parallel threads
      },
    },
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
