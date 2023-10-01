/** @type {import('next').NextConfig} */
const nextConfig = {
  rewrites: async () => {
    return [
      {
        source: '/api/:path*',
        destination: process.env.BACKEND_URL + '/api/:path*'
      },
    ];
  },
};

module.exports = nextConfig


// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   rewrites: async () => {
//     return [
//       {
//         source: '/api/:path*',
//         destination:
//           process.env.NODE_ENV === 'production'
//             ? process.env.BACKEND_URL + '/api/:path*'
//             : 'http://127.0.0.1:5000/api/:path*',
//       },
//     ];
//   },
// };

// module.exports = nextConfig

// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   rewrites: async () => {
//     return [
//       {
//         source: '/api/:path*',
//         destination:
//           process.env.NODE_ENV === 'development'
//             ? 'http://127.0.0.1:5000/api/:path*'
//             : process.env.NODE_ENV === 'production'
//             ? process.env.BACKEND_URL + 'api/:path*'
//             : '/api/',
//       },
//     ];
//   },
// };

// module.exports = nextConfig