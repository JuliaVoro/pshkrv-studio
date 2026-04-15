/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.blob.vercel-storage.com',
      },
    ],
    localPatterns: [
      { pathname: '/uploads/**' },
    ],
  },
  api: {
    bodyParser: {
      sizeLimit: '100mb',
    },
    responseLimit: '100mb',
  },
  experimental: {
    serverComponentsExternalPackages: ['bcryptjs'],
  },
}

export default nextConfig
