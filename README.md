# Huzaifa Portfolio

A full-stack portfolio application with a Next.js frontend, an Express API, MongoDB persistence, JWT-based admin authentication, blog management, project management, and EmailJS contact delivery.

## Project Structure

```text
huzaifa/
  client/   Next.js 16 frontend
  server/   Express and MongoDB API
vercel.json Vercel routing configuration
```

## Requirements

- Node.js 20 or newer
- npm or Bun
- MongoDB database
- Vercel account for deployment

## Local Setup

Install dependencies in both applications:

```bash
cd huzaifa/client
npm install

cd ../server
npm install
```

Create `huzaifa/server/.env`:

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/portfolio
JWT_SECRET=replace-with-a-long-random-secret
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=replace-with-a-strong-password
```

Create or update `huzaifa/client/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
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

Open `http://localhost:3000` in a browser.

The API uses port `5000` by default. If that port is occupied, the local server automatically selects the next available port and logs the selected URL. Update `NEXT_PUBLIC_API_URL` in the client environment file to match that port, then restart the Next.js development server.

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

## Vercel Deployment

The repository includes `vercel.json` with separate frontend and backend service roots. The backend entrypoint is `huzaifa/server/src/index.ts`; it is exported as an Express app and does not bind a local port in the Vercel runtime.

1. Import the repository into Vercel.
2. Add the server variables from `huzaifa/server/.env` to the Vercel project environment settings.
3. Add the client EmailJS variables to the Vercel environment settings.
4. Set `NEXT_PUBLIC_API_URL` to the deployed API URL only when the frontend and backend are deployed as separate Vercel projects. When using the repository's configured rewrites, leave it unset so the client uses same-origin `/api` requests in production.
5. Deploy from the repository root.

Do not use the local `PORT` setting as a Vercel deployment requirement. Vercel supplies the runtime port and invokes the exported API application directly.

## Technology

- Next.js, React, TypeScript, and Tailwind CSS
- Express and TypeScript
- MongoDB with Mongoose
- JWT and bcryptjs for admin authentication
- EmailJS for contact messages
- Vercel for deployment
