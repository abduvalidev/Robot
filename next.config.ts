import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: false, // React strict mode-ni o'chirish
  webpack(config, { isServer }) {
    // Serverda bo'lmagan hollarda 'fs' va 'path' modullarini o'chirish
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        path: false,
      };
    }
    return config;
  },
};

export default nextConfig;
