/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      issuer: {
        and: [/\.(js|ts)x?$/],
      },
      use: ['@svgr/webpack'],
    })
    return config
  },
  images: {
    domains: ['img-cdn.pixlr.com'], // TODO: remove
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://backend:8080/:path*', // The :path parameter is used here so will not be automatically passed in the query
      },
    ]
  },
}

export default nextConfig
