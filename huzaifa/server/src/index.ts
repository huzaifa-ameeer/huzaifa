import express, { type ErrorRequestHandler } from "express";
import cors from "cors";
import "dotenv/config";
import { connectDB } from "./config/db";
import { seedAdminIfMissing, seedBlogsIfEmpty, seedProjectsIfEmpty } from "./config/seed";
import authRoutes from "./routes/auth";
import blogRoutes from "./routes/blog";
import projectRoutes from "./routes/project";

const app = express();

let initialization: Promise<void> | undefined;

async function initialize() {
  await connectDB();
  await seedBlogsIfEmpty();
  await seedProjectsIfEmpty();
  await seedAdminIfMissing();
}

const allowedOrigins = (process.env.CORS_ORIGIN ?? "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors(allowedOrigins.length > 0 ? { origin: allowedOrigins } : undefined));
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({ message: "Portfolio API is running" });
});

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use((_req, _res, next) => {
  if (!initialization) {
    initialization = initialize().catch((error) => {
      initialization = undefined;
      throw error;
    });
  }

  initialization.then(() => next()).catch(next);
});

app.use("/api/blogs", blogRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/auth", authRoutes);

const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({ message: "Internal server error" });
};

app.use(errorHandler);

export default app;
