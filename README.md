This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.js`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## Server configuration and Cloudinary

Copy `.env.example` to `.env.local` for local development. On Vercel, add the
same variables in Project Settings → Environment Variables, then redeploy.
Never commit `.env.local` or put server credentials in `next.config.js`'s `env`:
Next.js embeds entries from that block into browser bundles.

Set `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY` and `CLOUDINARY_API_SECRET`
from the same Cloudinary account. Use newly generated credentials: credentials
previously committed in this repository must be rotated (Cloudinary, MongoDB,
Stripe and SMTP). Removing them from the current files does not remove them
from Git history or previous deployments. Only the Stripe publishable key
(`NEXT_PUBLIC_STRIPE_API_KEY`) belongs in the browser.

Image API routes accept JSON bodies up to 10 MB, including base64 overhead.
Supported uploads are JPEG, PNG, WebP and GIF data URLs. Registration without
an image uses the local default avatar. Image replacement keeps the previous
files until the new upload and database write succeed. Failed partial uploads
are cleaned up; cleanup failures are logged for later retry.

Run `npm test` for mocked Cloudinary regression checks and `npm run build` for
Next.js validation. A real upload also requires a working MongoDB database and
valid Cloudinary credentials; mocked tests do not validate the remote account.

## Vercel runtime and image display

This project declares Node.js `26.x` in `package.json`. In Vercel, open
Settings → Build and Deployment → Node.js Version and select **26.x**.
A project pinned to Node.js 14 fails before the build starts because that runtime
has been discontinued. Use `npm ci` for installation and `npm run build` to build;
`.npmrc` preserves the peer dependency handling required by this legacy app.

Set the variables from `.env.example` for both Production and Preview. In
Production, set `NEXTAUTH_URL=https://easybooker.vercel.app`; local development
uses `http://localhost:3000`. Set a new, strong `NEXTAUTH_SECRET` in Vercel.
After saving the runtime and variables, redeploy the latest commit and verify
home page photos, login, profile updates, and an admin room image upload.

Room photos load directly to avoid the observed Vercel image optimization error
`INVALID_IMAGE_OPTIMIZE_REQUEST`. Missing images show the local
`public/images/room-unavailable.svg`. This does not recover deleted photos:
re-upload the original room images from the admin interface to restore them.
