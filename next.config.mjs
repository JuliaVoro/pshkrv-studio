/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [],
    localPatterns: [
      { pathname: '/uploads/**' },
    ],
  },
  api: {
    bodyParser: {
      sizeLimit: '500mb',
    },
  },
  experimental: {
    serverComponentsExternalPackages: ['bcryptjs'],
  },
}

export default nextConfig
