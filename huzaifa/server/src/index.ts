import express from "express";
import cors from "cors";
import "dotenv/config";
import { connectDB } from "./config/db";
import { seedBlogsIfEmpty } from "./config/seed";
import blogRoutes from "./routes/blog";

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

connectDB().then(async () => {
  await seedBlogsIfEmpty();
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});