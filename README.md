# Huzaifa Portfolio

A full-stack portfolio application with a Next.js frontend, an Express API, MongoDB persistence, JWT-based admin authentication, blog management, project management, and EmailJS contact delivery.

Both applications run on Vercel as two separate projects, so the site is served from two links. The frontend calls the API over HTTPS using `NEXT_PUBLIC_API_URL`, and the API only accepts the frontend origin through `CORS_ORIGIN`.

## Project Structure

```text
huzaifa/
  client/            Next.js 16 frontend, local port 3001
  server/            Express and MongoDB API, local port 8001
    api/index.ts     Vercel serverless function entrypoint for the API
    vercel.json      keeps the API project on the "Other" framework preset
```

## Requirements

- Node.js 20 or newer
- npm or Bun
- MongoDB database
- A Vercel account

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

| Project | Root directory | Framework preset | Result |
| --- | --- | --- | --- |
| Frontend | `huzaifa/client` | Next.js | `https://<frontend>.vercel.app` |
| API | `huzaifa/server` | Other | `https://<api>.vercel.app` |

Deploy the API first. The frontend build inlines `NEXT_PUBLIC_API_URL`, so the API URL has to exist before the frontend is built, and any later change to it requires a new frontend deployment.

## API Deployment (Vercel)

`huzaifa/server/api/index.ts` is the serverless function entrypoint. It exports the Express app from `src/index.ts`, so Vercel builds the API as a Node function without any framework preset.

1. Import the repository into Vercel and create the project as a **new project**.
2. Set **Root Directory** to `huzaifa/server`.
3. Confirm the framework preset is **Other**. `huzaifa/server/vercel.json` pins this, so leave the preset untouched.
4. Leave the install and build commands empty. Vercel compiles the function directly and the local `build` script is not needed.
5. Add the environment variables: `MONGO_URI`, `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and `CORS_ORIGIN`. For the first deploy, set `CORS_ORIGIN` to `http://localhost:3001` and replace it once the frontend URL exists.
6. Deploy and check the deploy log. Then confirm `https://<api>.vercel.app/api/health` returns `{"status":"ok"}`.

## Frontend Deployment (Vercel)

1. Import the same repository into Vercel and create a **second** project from it.
2. Set **Root Directory** to `huzaifa/client`.
3. Confirm the framework preset is **Next.js** and leave the build and install commands at their defaults.
4. Add the environment variables: `NEXT_PUBLIC_API_URL` set to the deployed API URL, for example `https://<api>.vercel.app`, plus the three `NEXT_PUBLIC_EMAILJS_*` values.
5. Deploy, then copy the resulting `https://<frontend>.vercel.app` origin into the API project's `CORS_ORIGIN` value and redeploy the API.

Preview deployments get their own URL, so add them to `CORS_ORIGIN` as well or admin API calls from previews will be rejected by the browser.

## Hobby Plan Constraints

Both projects run on the Hobby plan, where the API is a serverless function rather than a server:

- Function duration is capped at 10 seconds. Every endpoint here answers in well under that, but a slow MongoDB connection eats into the budget.
- Cold starts happen on the first request after an idle period and can take a few seconds. The frontend shows a loading spinner while waiting and retries transient API or server errors. Call `/api/health` to warm the function before a visit if needed.
- There is no persistent process, so `src/config/db.ts` caches one MongoDB connection per warm instance with a single-connection pool and retries a failed connect on the next request.
- Deployments and cold starts cost a few hundred milliseconds of build-free invocation time, and the free tier allows at most 12 serverless functions per project. This API is one function.

If the API becomes slow or unreliable under real traffic, move the `huzaifa/server` project to Render or Railway. Only that project changes; the frontend keeps pointing at whichever URL is in `NEXT_PUBLIC_API_URL`.

## Troubleshooting

- **`Module not found` or a build error in the API project:** the root directory is probably the repository root. Set it to `huzaifa/server`.
- **Frontend builds ignore `NEXT_PUBLIC_API_URL`:** the variable is inlined at build time, so it has to be present when the build runs. Add it, then redeploy.
- **Admin or search requests fail in the browser console with a CORS error:** the frontend origin is missing from `CORS_ORIGIN` on the API project.
- **Vercel frontend build fails during install:** `huzaifa/client/package.json` pins `packageManager` to Bun, so Vercel installs with Bun. Delete that field to fall back to npm and `package-lock.json`.
- **The API is slow right after a deploy:** it is a cold start, not a hang. Retry once.

## Technology

- Next.js, React, TypeScript, and Tailwind CSS
- Express and TypeScript, deployed as a Vercel serverless function
- MongoDB with Mongoose
- JWT and bcryptjs for admin authentication
- EmailJS for contact messages
- Vercel for both the frontend and the API
