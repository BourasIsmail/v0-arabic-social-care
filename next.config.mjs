/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '/dour-talib',
  assetPrefix: '/dour-talib/',
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  output: 'standalone',
}

export default nextConfig
