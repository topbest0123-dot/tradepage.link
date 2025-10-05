/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Keep this simple and correct.
  images: {
    // Either keep as empty array or allow remote patterns broadly while testing
    // domains: [],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },

  // If you had headers/redirects/rewrites before, make sure they return arrays.
  async headers() {
    return []; // MUST return an array
  },
  async redirects() {
    return []; // MUST return an array
  },
  async rewrites() {
    return []; // MUST return an array
  },

  experimental: {
    appDir: true,
  },
};

module.exports = nextConfig;
