import type { Request, Response } from "express";
import Blog from "../models/Blog";

export async function getBlogs(_req: Request, res: Response) {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching blogs", error });
  }
}

export async function getBlog(req: Request, res: Response) {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: "Error fetching blog", error });
  }
}

export async function createBlog(req: Request, res: Response) {
  try {
    const { title, content } = req.body;
    if (!title || !content) {
      return res.status(400).json({ message: "title and content are required" });
    }
    const blog = await Blog.create({ title, content });
    res.status(201).json(blog);
  } catch (error) {
    res.status(500).json({ message: "Error creating blog", error });
  }
}

export async function updateBlog(req: Request, res: Response) {
  try {
    const { title, content } = req.body;
    const update: { title?: string; content?: string } = {};
    if (title !== undefined) update.title = title;
    if (content !== undefined) update.content = content;

    const blog = await Blog.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true,
    });
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: "Error updating blog", error });
  }
}

export async function deleteBlog(req: Request, res: Response) {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    res.json({ message: "Blog deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting blog", error });
  }
}