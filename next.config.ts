import type { NextConfig } from "next";
import createJiti from "jiti";
import { fileURLToPath } from "node:url";
const jiti = createJiti(fileURLToPath(import.meta.url));

// Import env here to validate during build. Using jiti@^1 we can import .ts files :)
jiti("./src/env.ts");

const nextConfig: NextConfig = {
  experimental: {
    inlineCss: true,
    useCache: true,
  },
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "th.bing.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
