import type { NextConfig } from "next";

const nextConfig: NextConfig & {
  eslint?: { ignoreDuringBuilds?: boolean };
} = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
};

export default nextConfig;
