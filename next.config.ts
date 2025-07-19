import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  experimental: {
    // Remove serverActions as it's causing a type error
    // Enable environment variables in edge runtime
    serverComponentsExternalPackages: ["@prisma/client", "bcrypt"],
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  env: {
    DATABASE_URL: process.env.DATABASE_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  },
};

export default nextConfig;
