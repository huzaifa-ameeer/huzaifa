const configuredApiUrl = process.env.NEXT_PUBLIC_API_URL?.trim();

function getDefaultApiUrl() {
  if (typeof window !== "undefined") {
    return process.env.NODE_ENV === "development" ? "http://localhost:5000" : "";
  }

  const vercelHost =
    process.env.VERCEL_URL ??
    process.env.VERCEL_BRANCH_URL ??
    process.env.VERCEL_PROJECT_PRODUCTION_URL;

  return vercelHost ? `https://${vercelHost}` : "http://localhost:5000";
}

export const API_URL = (configuredApiUrl || getDefaultApiUrl()).replace(/\/+$/, "");

async function fetchJson<T>(url: string): Promise<T | null> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  try {
    const response = await fetch(url, {
      cache: "no-store",
      signal: controller.signal,
    });
    if (!response.ok) return null;
    return response.json();
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

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
  return (await fetchJson<Blog[]>(`${API_URL}/api/blogs`)) ?? [];
}

export async function getBlog(id: string): Promise<Blog | null> {
  return fetchJson<Blog>(`${API_URL}/api/blogs/${id}`);
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
  const projects = await fetchJson<Project[]>(`${API_URL}/api/projects`);
  return projects?.map(normalizeProject) ?? [];
}