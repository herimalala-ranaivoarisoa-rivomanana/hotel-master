module.exports = {
  env:{
      DB_LOCAL_URI:'mongodb+srv://rivo:Lasolution.3352@nodeexpress.uogl0.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',

      STRIPE_API_KEY:'pk_test_51K0oufKLs7UARDRIkY7G3wBtlR4GvzaFPcaAwiW9TK22Ma5edzMhthrxvkJA2jqa1XfpBJhCh9yHp5hpjN8FMwY700evhny4iJ',
      STRIPE_SECRET_KEY:'sk_test_51K0oufKLs7UARDRInBQDnqNy5ASq1eI8ZRZ0XjOobEiPapnj9jUJmpj596bcs9PY58Ls0sB7RwqC7c82egsF8j3V009fjvKYdC',
      STRIPE_WEBHOOK_SECRET:'whsec_7Kfxjy4sHBUeI7NrCICtmu5G6UR9xBVd',
    
    

      CLOUDINARY_CLOUD_NAME:'dvuvwol1s',
      CLOUDINARY_API_KEY:'766375315988371',
      CLOUDINARY_API_SECRET:'OXaVQq1aDN7GbDGohdgx0xZ3aXg',

      SMTP_HOST:'mail.gmx.com',
      SMTP_PORT:587,
      SMTP_USER:'ranaivoarisoa@gmx.fr',
      SMTP_PASSWORD:'Lasolution.3352',
      SMTP_FROM_NAME:'BookIT',
      SMTP_FROM_EMAIL:'ranaivoarisoa@gmx.fr',
      NEXTAUTH_URL:'https://easybooker.vercel.app',
      
  },
  reactStrictMode: true,
  images:{
    domains:['res.cloudinary.com','a0.muscache.com']
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
 },
}
