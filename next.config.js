/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove 'export' to enable API routes and server features
  trailingSlash: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // generateBuildId: async () => {
  //   return 'ecliente-' + Date.now()
  // },
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
}

module.exports = nextConfig
