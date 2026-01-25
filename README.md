# Chlothzy E-Commerce 

A small e-commerce web application used to demonstrate a full-stack React + Express + MongoDB setup. The site is branded "Chlothzy" and maintained by manya shukla.

Contact: shuklamanya99@gmail.com

---

## Overview

- Frontend: Vite + React + Tailwind CSS
- Backend: Express + Node.js + MongoDB (Mongoose)
- Authentication: JWT
- Features: Product listing, cart, orders, admin product CRUD, newsletter subscriptions, user auth

## Directory Structure

- `backend/` — Express API, controllers, models, routes
- `frontend/` — React app, components, pages, assets

## Development Setup

Prerequisites
- Node.js (>= 18 recommended)
- npm
- MongoDB (Atlas or local)

1. Clone the repository
```bash
git clone <repo_url>
cd E-Commerce
```

2. Backend
```bash
cd backend
npm install
```

Create a `.env` file in `backend/` (a sample `.env` is already present in the repository with development defaults). The following variables are used:

```
MONGO_URI=<your mongodb connection string>
PORT=3000
EMAIL_SERVICE=gmail
EMAIL_USER=<your smtp/email address e.g. shuklamanya99@gmail.com>
EMAIL_PASSWORD=<your email password or app-specific password>
EMAIL_SENDER_NAME="manya shukla"
JWT_SECRET=<jwt secret>
JWT_EXPIRES_IN=90m
SESSION_SECRET=<session secret>
CLIENT_URL=<frontend url, e.g. http://localhost:5173>
```

Start the backend
```bash
node index.js
```

3. Frontend
```bash
cd frontend
npm install
# set VITE_API_URL in frontend/.env to your backend dev URL, e.g. VITE_API_URL=http://localhost:3000
npm run dev
```

Open the frontend: `http://localhost:5173`

## Common Tasks

- Sign up and log in via the auth pages. The frontend stores the JWT in `localStorage` as `token` and sends it as `Authorization: Bearer <token>`.
- Add items to the cart (cart endpoints are protected and require auth).
- Admin pages are protected and require an admin user; use the seed admin script in `backend/utils/seedAdminUser.js` if needed.

## Logo & Favicon
- The site uses an MS logo and an SVG favicon (`frontend/public/ms-favicon.svg`), and the primary logo is available as `frontend/src/assets/ms-logo.svg`.

## Footer
- The footer includes a small credit: `made with love by manya shukla 2026` and contact email `shuklamanya99@gmail.com`.

## Troubleshooting
- If you see CORS issues when calling APIs from the frontend in development, ensure `VITE_API_URL` points to `http://localhost:3000` and the backend allows `http://localhost:5173` in its CORS settings.
- If you see a `401 Unauthorized` from protected endpoints such as `/api/cart`, ensure you are logged in (the token must exist in `localStorage`).

## Deployment
- Backend is configured to run on platforms like Vercel / Railway. See `backend/vercel.json`.
- Frontend can be built with `npm run build` and deployed to static hosting.

## Contact
If you have questions, reach out: **manya shukla** — shuklamanya99@gmail.com

---

