import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Remove standalone for Vercel (Vercel handles its own deployment)
  // output: "standalone",
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
};

export default nextConfig;
