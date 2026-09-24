import type { Request, Response } from "express";
import Project from "../models/Project";

export async function getProjects(_req: Request, res: Response) {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: "Error fetching projects", error });
  }
}

export async function getProject(req: Request, res: Response) {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: "Error fetching project", error });
  }
}

export async function createProject(req: Request, res: Response) {
  try {
    const { name, github, live, content } = req.body;
    if (!name || !content) {
      return res
        .status(400)
        .json({ message: "name and content are required" });
    }
    const cleanGithub = (github ?? "").trim();
    const cleanLive = (live ?? "").trim();
    if (!cleanGithub && !cleanLive) {
      return res
        .status(400)
        .json({ message: "At least one link is required (GitHub or live)" });
    }
    const project = await Project.create({
      name,
      github: cleanGithub,
      live: cleanLive,
      content,
    });
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: "Error creating project", error });
  }
}

export async function updateProject(req: Request, res: Response) {
  try {
    const { name, github, live, content } = req.body;
    const update: {
      name?: string;
      github?: string;
      live?: string;
      content?: string;
    } = {};
    if (name !== undefined) update.name = name;
    if (content !== undefined) update.content = content;
    if (github !== undefined) update.github = (github as string).trim();
    if (live !== undefined) update.live = (live as string).trim();

    const current = await Project.findById(req.params.id);
    if (!current) return res.status(404).json({ message: "Project not found" });

    const finalGithub =
      (update.github !== undefined ? update.github : current.github) ?? "";
    const finalLive =
      (update.live !== undefined ? update.live : current.live) ?? "";
    if (!finalGithub && !finalLive) {
      return res
        .status(400)
        .json({ message: "At least one link is required (GitHub or live)" });
    }

    const project = await Project.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true,
    });
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: "Error updating project", error });
  }
}

export async function deleteProject(req: Request, res: Response) {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.json({ message: "Project deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting project", error });
  }
}