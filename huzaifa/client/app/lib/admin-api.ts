import { revalidatePath, revalidateTag } from "next/cache";
import { API_URL } from "./api";

const MUTATION_TIMEOUT_MS = 30000;

const CONTENT_KINDS = ["blogs", "projects"] as const;

export type ContentKind = (typeof CONTENT_KINDS)[number];

const LIST_PATHS: Record<ContentKind, string> = {
  blogs: "/blogs",
  projects: "/work",
};

const OBJECT_ID = /^[a-f\d]{24}$/i;

export function isContentKind(value: string): value is ContentKind {
  return (CONTENT_KINDS as readonly string[]).includes(value);
}

export function isObjectId(value: string): boolean {
  return OBJECT_ID.test(value);
}

type MutationResult = {
  status: number;
  text: string;
  json: Record<string, unknown> | null;
};

function parseJson(text: string): Record<string, unknown> | null {
  if (!text) return null;

  try {
    const parsed: unknown = JSON.parse(text);
    return typeof parsed === "object" && parsed !== null
      ? (parsed as Record<string, unknown>)
      : null;
  } catch {
    return null;
  }
}

export async function forwardMutation(
  request: Request,
  kind: ContentKind,
  id?: string
): Promise<MutationResult> {
  const authorization = request.headers.get("authorization");
  const hasBody = request.method !== "DELETE";
  const body = hasBody ? await request.text() : "";

  const headers: Record<string, string> = {};
  if (authorization) headers.Authorization = authorization;
  if (hasBody && body) headers["Content-Type"] = "application/json";

  const upstream = await fetch(`${API_URL}/api/${kind}${id ? `/${id}` : ""}`, {
    method: request.method,
    headers,
    body: hasBody && body ? body : undefined,
    cache: "no-store",
    signal: AbortSignal.timeout(MUTATION_TIMEOUT_MS),
  });

  const text = await upstream.text();

  return { status: upstream.status, text, json: parseJson(text) };
}

export function respond(result: MutationResult): Response {
  return new Response(result.text || "{}", {
    status: result.status,
    headers: { "Content-Type": "application/json" },
  });
}

export function createdId(result: MutationResult): string | undefined {
  const id = result.json?._id;
  return typeof id === "string" ? id : undefined;
}

export function revalidateContent(kind: ContentKind, id?: string) {
  revalidateTag(kind, { expire: 0 });
  revalidatePath("/");
  revalidatePath(LIST_PATHS[kind]);

  if (kind !== "blogs") return;

  revalidatePath("/blogs/[id]", "page");

  if (id) {
    revalidateTag(`blog:${id}`, { expire: 0 });
    revalidatePath(`/blogs/${id}`);
  }
}
