/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // TEMP: avoid image-domain config while you’re stabilizing
  images: { unoptimized: true },

  // Keep these as empty arrays if you don’t need them yet
  async headers() { return []; },
  async redirects() { return []; },
  async rewrites() { return []; },
};

module.exports = nextConfig;
