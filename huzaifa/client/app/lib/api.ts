const configuredApiUrl = process.env.NEXT_PUBLIC_API_URL?.trim();

export const API_URL = (configuredApiUrl || "http://localhost:8001").replace(/\/+$/, "");

const REQUEST_TIMEOUT_MS = 15000;
const RETRY_DELAYS_MS = [0, 500, 1500, 3000];

const LISTS_REVALIDATE_SECONDS = 60;
const BLOG_REVALIDATE_SECONDS = 300;

type FetchCacheOptions = {
  revalidate: number;
  tags: string[];
};

async function fetchJson<T>(url: string, cache: FetchCacheOptions): Promise<T | null> {
  for (const delay of RETRY_DELAYS_MS) {
    if (delay > 0) {
      await new Promise((resolve) => setTimeout(resolve, delay));
    }

    try {
      const response = await fetch(url, {
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
        next: { revalidate: cache.revalidate, tags: cache.tags },
      });

      if (response.status >= 500) continue;
      if (!response.ok) return null;

      return (await response.json()) as T;
    } catch {
      continue;
    }
  }

  return null;
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
  const blogs = await fetchJson<Blog[]>(`${API_URL}/api/blogs`, {
    revalidate: LISTS_REVALIDATE_SECONDS,
    tags: ["blogs"],
  });

  return blogs ?? [];
}

export async function getBlog(id: string): Promise<Blog | null> {
  return fetchJson<Blog>(`${API_URL}/api/blogs/${id}`, {
    revalidate: BLOG_REVALIDATE_SECONDS,
    tags: ["blogs", `blog:${id}`],
  });
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
  const projects = await fetchJson<Project[]>(`${API_URL}/api/projects`, {
    revalidate: LISTS_REVALIDATE_SECONDS,
    tags: ["projects"],
  });

  return projects?.map(normalizeProject) ?? [];
}