import { Router } from "express";
import {
  getBlogs,
  getBlog,
  createBlog,
  updateBlog,
  deleteBlog,
} from "../controllers/blog";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.get("/", getBlogs);
router.get("/:id", getBlog);
router.post("/", requireAuth, createBlog);
router.put("/:id", requireAuth, updateBlog);
router.delete("/:id", requireAuth, deleteBlog);

export default router;