# Progoti Shikkha Frontend — Vercel Deployment

## Build
- Framework: Next.js
- Install: `npm install`
- Build: `npm run build`
- Start: `npm start`

## Required Vercel environment variables
```
NEXT_PUBLIC_API_URL=https://YOUR-RENDER-SERVICE.onrender.com/api/v1
NEXT_PUBLIC_SOCKET_URL=https://YOUR-RENDER-SERVICE.onrender.com
NEXT_PUBLIC_SITE_URL=https://YOUR-VERCEL-DOMAIN.vercel.app
NEXT_PUBLIC_SITE_NAME=Progoti Shikkha
```

Set the Render `CLIENT_URL` to the final Vercel domain. No server secret is required in the browser.

## Important
The application intentionally does not expose student/tutor phone or WhatsApp information to ordinary users. Admin contact actions use admin-only API responses.
