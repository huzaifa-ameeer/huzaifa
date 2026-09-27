import {
  createdId,
  forwardMutation,
  isContentKind,
  isObjectId,
  respond,
  revalidateContent,
  type ContentKind,
} from "../../../lib/admin-api";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ path?: string[] }> };

type MutationTarget = { kind: ContentKind; id?: string };

function resolveTarget(segments: string[] | undefined): MutationTarget | null {
  if (!segments || segments.length === 0 || segments.length > 2) return null;

  const [kind, id] = segments;
  if (!isContentKind(kind)) return null;
  if (segments.length === 2 && (!id || !isObjectId(id))) return null;

  return { kind, id: segments.length === 2 ? id : undefined };
}

async function handle(request: Request, context: RouteContext): Promise<Response> {
  const { path } = await context.params;
  const target = resolveTarget(path);

  if (!target) {
    return Response.json({ message: "Not found" }, { status: 404 });
  }

  const hasId = target.id !== undefined;
  const methodAllowed =
    (request.method === "POST" && !hasId) ||
    ((request.method === "PUT" || request.method === "DELETE") && hasId);

  if (!methodAllowed) {
    return Response.json({ message: "Method not allowed" }, { status: 405 });
  }

  try {
    const result = await forwardMutation(request, target.kind, target.id);

    if (result.status >= 200 && result.status < 300) {
      revalidateContent(target.kind, target.id ?? createdId(result));
    }

    return respond(result);
  } catch {
    return Response.json(
      { message: "Could not reach the API. Try again." },
      { status: 502 }
    );
  }
}

export async function POST(request: Request, context: RouteContext) {
  return handle(request, context);
}

export async function PUT(request: Request, context: RouteContext) {
  return handle(request, context);
}

export async function DELETE(request: Request, context: RouteContext) {
  return handle(request, context);
}
