# Huzaifa Portfolio

A full-stack portfolio application with a Next.js frontend, an Express API, MongoDB persistence, JWT-based admin authentication, blog management, project management, and EmailJS contact delivery.

The Next.js frontend is deployed on Vercel, and the Express API is deployed as a web service on Render. The frontend calls the Render API over HTTPS using `NEXT_PUBLIC_API_URL`; the API allows the frontend origin through `CORS_ORIGIN`.

## Project Structure

```text
huzaifa/
  client/            Next.js 16 frontend, local port 3001
  server/            Express and MongoDB API, local port 8001
```

## Requirements

- Node.js 20 or newer
- npm or Bun
- MongoDB database
- Vercel and Render accounts

## Local Setup

Install dependencies in both applications:

```bash
cd huzaifa/client
npm install

cd ../server
npm install
```

Create `huzaifa/server/.env` from `huzaifa/server/.env.example`:

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/portfolio
JWT_SECRET=replace-with-a-long-random-secret
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=replace-with-a-strong-password
PORT=8001
CORS_ORIGIN=http://localhost:3001
```

`CORS_ORIGIN` is a comma-separated list of allowed frontend origins. Leave it empty to accept any origin.

Create `huzaifa/client/.env.local` from `huzaifa/client/.env.example`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8001
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your-service-id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your-template-id
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your-public-key
```

Never commit `.env`, `.env.local`, or real credentials.

## Run In Development

Start the API in one terminal:

```bash
cd huzaifa/server
npm run dev
```

Start the frontend in another terminal:

```bash
cd huzaifa/client
npm run dev
```

Open `http://localhost:3001` in a browser. The API listens on `http://localhost:8001` and `GET /api/health` reports its status.

The API binds to the `PORT` value in `huzaifa/server/.env` and fails fast if the port is taken, so a stale process on `8001` has to be stopped instead of silently moving the server elsewhere.

## Production Builds

Build the API:

```bash
cd huzaifa/server
npm run build
npm start
```

Build and start the frontend:

```bash
cd huzaifa/client
npm run build
npm start
```

Useful checks:

```bash
cd huzaifa/server
npm run typecheck

cd ../client
npm run lint
```

## Frontend Data Loading

Blog and project pages fetch their data at request time rather than relying on
build-time page output. While a public page is waiting for its data, the shared
`huzaifa/client/app/(site)/loading.tsx` fallback shows a centered spinner over
the full viewport, using the active theme's background color.

The frontend retries transient API and server errors with increasing delays and
uses a 15-second timeout per request. Successful blog and project list responses
are cached for 60 seconds; individual blog responses are cached for 300 seconds.
The API may still take a few seconds to answer its first request after an idle
cold start.

## API Endpoints

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/` | API status message |
| `GET` | `/api/health` | Health check |
| `GET` | `/api/blogs` | List blog posts |
| `GET` | `/api/blogs/:id` | Read one blog post |
| `POST` | `/api/auth/login` | Admin login |
| `GET` | `/api/projects` | List projects |
| `POST` | `/api/projects` | Create a project; admin token required |
| `PUT` | `/api/projects/:id` | Update a project; admin token required |
| `DELETE` | `/api/projects/:id` | Delete a project; admin token required |

Blog and project data are seeded when the database is empty. The admin account is seeded only when `ADMIN_EMAIL` and `ADMIN_PASSWORD` are configured.

## Deployment Overview

| Service | Platform | Root directory | Result |
| --- | --- | --- | --- |
| Frontend | Vercel | `huzaifa/client` | `https://<frontend>.vercel.app` |
| API | Render | `huzaifa/server` | `https://<api>.onrender.com` |

Deploy the API first. The frontend build inlines `NEXT_PUBLIC_API_URL`, so set it to the Render API URL before deploying the frontend. If that URL changes, redeploy the frontend.

## API Deployment (Render)

1. Create a **Web Service** in Render and connect the repository.
2. Set **Root Directory** to `huzaifa/server`.
3. Set the **Build Command** to `npm install && npm run build` and the **Start Command** to `npm start`.
4. Add `MONGO_URI`, `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and `CORS_ORIGIN` as environment variables. Set `CORS_ORIGIN` to the deployed frontend origin, such as `https://<frontend>.vercel.app`; add local or preview origins when needed.
5. Deploy and confirm `https://<api>.onrender.com/api/health` returns `{"status":"ok"}`.

## Frontend Deployment (Vercel)

1. Import the repository into Vercel and create a project for the frontend.
2. Set **Root Directory** to `huzaifa/client`.
3. Confirm the framework preset is **Next.js** and leave the build and install commands at their defaults.
4. Add `NEXT_PUBLIC_API_URL` set to the Render API URL, for example `https://<api>.onrender.com`, plus the three `NEXT_PUBLIC_EMAILJS_*` values.
5. Deploy and ensure the deployed frontend origin is listed in the Render service's `CORS_ORIGIN` value.

Preview deployments get their own URL, so add them to `CORS_ORIGIN` on Render as well or browser API calls from previews will be rejected by CORS.

## Render Service Behavior

The API runs as a Render web service, not a Vercel serverless function. Render injects the service's `PORT`; locally, the API defaults to port `8001`. Depending on the Render plan and service activity, the first request after idle time may take longer. The frontend shows a loading spinner while data is pending and retries transient API or server errors.

## Troubleshooting

- **Render API build or start fails:** check that the service root is `huzaifa/server`, the build command is `npm install && npm run build`, and the start command is `npm start`.
- **Frontend builds ignore `NEXT_PUBLIC_API_URL`:** the variable is inlined at build time, so it has to be present when the build runs. Add it, then redeploy.
- **Browser API requests fail with a CORS error:** the frontend origin is missing from `CORS_ORIGIN` on the Render service.
- **Vercel frontend build fails during install:** `huzaifa/client/package.json` pins `packageManager` to Bun, so Vercel installs with Bun. Delete that field to fall back to npm and `package-lock.json`.
- **The API is slow after being idle:** the Render service may be waking up; retry after the first request completes.

## Technology

- Next.js, React, TypeScript, and Tailwind CSS
- Express and TypeScript, deployed as a Render web service
- MongoDB with Mongoose
- JWT and bcryptjs for admin authentication
- EmailJS for contact messages
- Vercel for the frontend and Render for the API
