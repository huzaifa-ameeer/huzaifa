# Huzaifa Portfolio

A full-stack portfolio application with a Next.js frontend, an Express API, MongoDB persistence, JWT-based admin authentication, blog management, project management, and EmailJS contact delivery.

The two applications are hosted separately: the frontend runs on Vercel and the API runs on Render. They talk to each other over HTTPS using the public API URL, so the backend must be allowed as a CORS origin by the frontend and vice versa is not needed.

## Project Structure

```text
huzaifa/
  client/   Next.js 16 frontend, served on port 3001
  server/   Express and MongoDB API, served on port 8001
render.yaml Render blueprint for the API service
```

## Requirements

- Node.js 20 or newer
- npm or Bun
- MongoDB database
- A Vercel account for the frontend
- A Render account for the API

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

## Backend Deployment (Render)

`render.yaml` at the repository root describes the API service, so the whole service can be created from a blueprint.

1. Push the changes to the repository that Render can read.
2. In Render choose **New > Blueprint**, select the repository, and apply `render.yaml`. Creating it manually works as well with the settings below.
3. Fill in the secrets that Render marks as `sync: false`: `MONGO_URI`, `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and `CORS_ORIGIN`.
4. Deploy and confirm the deploy log ends with a successful build. Render sets `PORT` itself, so the value from `.env` is only used locally.

Manual service settings:

| Setting | Value |
| --- | --- |
| Root directory | `huzaifa/server` |
| Runtime | Node |
| Build command | `npm ci && npm run build` |
| Start command | `node dist/server.js` |
| Health check path | `/api/health` |
| Instance type | Free |

Notes for the free tier:

- Free web services sleep after a period of inactivity. The first request after a sleep can take up to about a minute, and pages that fetch data during that window render empty. Warm the service with a request to `/api/health` before sharing the site.
- Free instances restart on every deploy and spin down daily, so uptime is never guaranteed.

## Frontend Deployment (Vercel)

The frontend is a standalone Next.js app. Vercel auto-detects the framework, so no `vercel.json` is required.

1. Import the repository into Vercel.
2. Set **Root Directory** to `huzaifa/client` so the build runs against the Next.js app instead of the repository root.
3. Confirm the framework preset is **Next.js** and leave the build and install commands at their defaults.
4. Add the environment variables: `NEXT_PUBLIC_API_URL` set to the deployed API URL, for example `https://portfolio-api.onrender.com`, plus the three `NEXT_PUBLIC_EMAILJS_*` values.
5. Deploy, then copy the resulting `https://<project>.vercel.app` origin into the Render service's `CORS_ORIGIN` value and redeploy the API.

Every browser request goes straight to the Render URL; Vercel is not used as a proxy, so the API has to be reachable publicly. `NEXT_PUBLIC_*` values are inlined at build time, so changing the API URL requires a new Vercel deployment rather than a restart.

Preview deployments get their own URL, so add them to `CORS_ORIGIN` as well or admin API calls from previews will be rejected by the browser.

## Technology

- Next.js, React, TypeScript, and Tailwind CSS
- Express and TypeScript
- MongoDB with Mongoose
- JWT and bcryptjs for admin authentication
- EmailJS for contact messages
- Vercel for the frontend and Render for the API
