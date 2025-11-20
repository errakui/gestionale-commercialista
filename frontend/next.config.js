/** @type {import('next').NextConfig} */
const nextConfig = {
  // Proxy per API - RISOLVE PROBLEMA SAFARI!
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:3001/api/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
