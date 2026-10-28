import { fileURLToPath } from 'node:url';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/dwaddregister236%23',
        destination: '/login',
        permanent: true,
      },
    ];
  },
  transpilePackages: ['lenis', 'lucide-react'],
  serverExternalPackages: ['@prisma/client', '@prisma/adapter-pg', 'pg'],
  webpack(config) {
    config.resolve.alias['zod/v4/locales'] = fileURLToPath(
      new URL('./scripts/zod-locales-empty.mjs', import.meta.url),
    );
    return config;
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;

