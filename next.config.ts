import type { NextConfig } from "next";
import createJiti from "jiti";
import { fileURLToPath } from "node:url";
const jiti = createJiti(fileURLToPath(import.meta.url));

// Import env here to validate during build. Using jiti@^1 we can import .ts files :)
jiti("./env.ts");

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
