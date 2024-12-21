import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true, 
  webpack(config, { isServer }) {
    if (!isServer) {
      config.resolve.fallback = {
        fs: true,
        path: true,
      };
    }
    return config;
  },
};

export default nextConfig;
