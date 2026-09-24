import express from "express";
import cors from "cors";
import "dotenv/config";
import { connectDB } from "./config/db";
import { seedBlogsIfEmpty, seedProjectsIfEmpty } from "./config/seed";
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

connectDB().then(async () => {
  await seedBlogsIfEmpty();
  await seedProjectsIfEmpty();
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});