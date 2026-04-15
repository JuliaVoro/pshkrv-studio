/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [],
    localPatterns: [
      { pathname: '/uploads/**' },
    ],
  },
  experimental: {
    serverComponentsExternalPackages: ['bcryptjs'],
  },
}

export default nextConfig
