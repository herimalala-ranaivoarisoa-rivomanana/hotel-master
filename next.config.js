module.exports = {
  env: { STRIPE_API_KEY: process.env.NEXT_PUBLIC_STRIPE_API_KEY || process.env.STRIPE_API_KEY },
  reactStrictMode: true,
  images:{
    domains:['res.cloudinary.com','a0.muscache.com','picsum.photos']
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
 },
}
