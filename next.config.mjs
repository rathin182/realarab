/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['lenis', 'lucide-react'],
  images: {
    unoptimized: true,
  },
};

export default nextConfig;

