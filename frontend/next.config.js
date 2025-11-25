/** @type {import('next').NextConfig} */
const nextConfig = {
  // Output standalone per deploy più veloce
  output: 'standalone',
  
  // Ottimizzazioni per produzione
  swcMinify: true,
  
  // Proxy per API - RISOLVE PROBLEMA SAFARI!
  // In produzione, usa direttamente NEXT_PUBLIC_API_URL senza proxy
  async rewrites() {
    // Solo in sviluppo locale
    if (process.env.NODE_ENV === 'development') {
      return [
        {
          source: '/api/:path*',
          destination: 'http://localhost:3001/api/:path*',
        },
      ];
    }
    return [];
  },
};

module.exports = nextConfig;
