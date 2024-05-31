/** @type {import('next').NextConfig} */
const nextConfig = {
  rewrites: async () => {
    return [
      // {
      //   source: '/api/:path*',
      //   destination: process.env.BACKEND_URL + '/api/:path*'
      // },
    ];
  },

  experimental: {
    serverActions: true,
  },
};

module.exports = nextConfig
