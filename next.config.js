/** @type {import('next').NextConfig} */
const nextConfig = {
  rewrites: async () => {
    return [
      {
        source: '/api/:path*',
        destination:
          process.env.NODE_ENV === 'development'
            ? 'http://127.0.0.1:5000/api/:path*'
            : process.env.NODE_ENV === 'production'
            ? 'https://instagraph-nextjs-production.up.railway.app/api/:path*'
            : '/api/',
      },
    ];
  },
};

module.exports = nextConfig