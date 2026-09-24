import express from "express";
import cors from "cors";
import "dotenv/config";
import { connectDB } from "./config/db";
import { seedAdminIfMissing, seedBlogsIfEmpty, seedProjectsIfEmpty } from "./config/seed";
import authRoutes from "./routes/auth";
import blogRoutes from "./routes/blog";
import projectRoutes from "./routes/project";

const app = express();
const PORT = Number(process.env.PORT) || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({ message: "Portfolio API is running" });
});

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/blogs", blogRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/auth", authRoutes);

connectDB().then(async () => {
  await seedBlogsIfEmpty();
  await seedProjectsIfEmpty();
  await seedAdminIfMissing();
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});