export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

export type Blog = {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
};

export function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export async function getBlogs(): Promise<Blog[]> {
  try {
    const res = await fetch(`${API_URL}/api/blogs`, { cache: "no-store" });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export async function getBlog(id: string): Promise<Blog | null> {
  try {
    const res = await fetch(`${API_URL}/api/blogs/${id}`, { cache: "no-store" });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export type Project = {
  _id: string;
  name: string;
  github: string;
  live: string;
  link?: string;
  content: string;
  createdAt: string;
};

function normalizeProject(project: Project): Project {
  const legacyLink = project.link?.trim() ?? "";
  const github = project.github?.trim() ||
    (legacyLink.includes("github.com") ? legacyLink : "");
  const live = project.live?.trim() ||
    (legacyLink && !legacyLink.includes("github.com") ? legacyLink : "");

  return { ...project, github, live };
}

export async function getProjects(): Promise<Project[]> {
  try {
    const res = await fetch(`${API_URL}/api/projects`, { cache: "no-store" });
    if (!res.ok) return [];
    const projects: Project[] = await res.json();
    return projects.map(normalizeProject);
  } catch {
    return [];
  }
}