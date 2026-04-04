This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Backend Setup

The academy admin/backend now stores content in MongoDB, protects the admin
panel with email/password login, and uploads gallery/blog/admin images to
Cloudinary.

### Environment

1. Create `frontend/.env.local`
2. Copy the values from `frontend/.env.example`
3. Set these values:

- `MONGODB_URI`
- `MONGODB_DB_NAME`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `ADMIN_NAME`
- `ADMIN_SESSION_SECRET`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

### MongoDB Atlas

1. Create a MongoDB Atlas cluster
2. Create a database user
3. Allow the deployment IPs in Network Access
4. Copy the Atlas connection string into `MONGODB_URI`
5. Set `MONGODB_DB_NAME` to the database you want the academy app to use

On the first authenticated/admin or content request, the academy collections are seeded automatically for:

- Services
- Events
- Gallery
- FAQs
- Blog
- Success Stories

### Admin Login

Visit `/admin/login` and sign in with the bootstrap admin email/password from
your environment.

### Cloudinary Uploads

The admin panel uploads images through a protected server route and stores the
returned Cloudinary URL in MongoDB content records.

### API endpoints

- `GET /api/academy`
- `GET, POST /api/academy/[module]`
- `GET, PATCH, DELETE /api/academy/[module]/[id]`
- `POST /api/admin/auth/login`
- `POST /api/admin/auth/logout`
- `POST /api/admin/uploads`

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
