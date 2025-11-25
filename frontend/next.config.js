/** @type {import('next').NextConfig} */
const nextConfig = {
  // Output standalone per deploy più veloce
  output: 'standalone',
  
  // Ottimizzazioni per produzione
  swcMinify: true,
  
  // Proxy per API - RISOLVE PROBLEMA SAFARI!
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:3001/api/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
