import { env } from "@/env";
import { defineConfig } from "drizzle-kit";

import dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: ".env" });

export default defineConfig({
  out: "./src/database/migrations",
  schema: "./src/database/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
