"use client";

import { useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import toast from "react-hot-toast";
import { ArrowLeft, Loader2, PenLine, Plus, Trash2 } from "lucide-react";
import { API_URL, formatDate, type Blog } from "../../lib/api";
import { ConfirmDialog } from "./confirmDialog";

const BlogEditor = dynamic(() => import("./blogEditor"), { ssr: false });

function authHeaders(): HeadersInit {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("admin_token") ?? ""}`,
  };
}

function stripHtml(html: string) {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

export default function AdminBlogs() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [mode, setMode] = useState<"list" | "editor">("list");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState<Blog | null>(null);

  const loadBlogs = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/api/blogs`);
      const data = res.ok ? await res.json() : [];
      setBlogs(Array.isArray(data) ? data : []);
    } catch {
      toast.error("Could not load blogs.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      await Promise.resolve();
      if (!cancelled) await loadBlogs();
    }

    void init();

    return () => {
      cancelled = true;
    };
  }, [loadBlogs]);

  function openCreate() {
    setEditingId(null);
    setTitle("");
    setContent("");
    setMode("editor");
  }

  function openEdit(blog: Blog) {
    setEditingId(blog._id);
    setTitle(blog.title);
    setContent(blog.content);
    setMode("editor");
  }

  async function saveBlog() {
    if (!title.trim()) {
      toast.error("Blog title is required");
      return;
    }
    if (!stripHtml(content)) {
      toast.error("Blog content is required");
      return;
    }

    setSaving(true);
    try {
      const isNew = editingId === null;
      const res = await fetch(
        `${API_URL}/api/blogs${isNew ? "" : `/${editingId}`}`,
        {
          method: isNew ? "POST" : "PUT",
          headers: authHeaders(),
          body: JSON.stringify({ title: title.trim(), content }),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.message ?? "Failed to save blog");
      }
      toast.success(isNew ? "Blog created" : "Blog updated");
      setMode("list");
      await loadBlogs();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save blog");
    } finally {
      setSaving(false);
    }
  }

  async function confirmDeleteBlog() {
    if (!blogToDelete) return;

    setDeleting(true);
    try {
      const res = await fetch(`${API_URL}/api/blogs/${blogToDelete._id}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.message ?? "Failed to delete blog");
      }
      toast.success("Blog deleted");
      setBlogs((prev) => prev.filter((b) => b._id !== blogToDelete._id));
      setBlogToDelete(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete blog");
    } finally {
      setDeleting(false);
    }
  }

  if (mode === "editor") {
    return (
      <div className="mx-auto max-w-3xl">
        <button
          onClick={() => setMode("list")}
          className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-zinc-600 transition hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-white"
        >
          <ArrowLeft size={18} />
          Back to blogs
        </button>

        <div className="rounded-2xl border border-zinc-200 bg-zinc-100 p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="text-xl font-bold">
            {editingId === null ? "New Blog" : "Edit Blog"}
          </h2>

          <div className="mt-6 flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="blog-title"
                className="text-sm font-medium text-zinc-700 dark:text-zinc-200"
              >
                Title
              </label>
              <input
                id="blog-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Blog title"
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-zinc-500 dark:border-zinc-700 dark:bg-black dark:focus:border-white"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-zinc-700 dark:text-zinc-200">
                Content
              </span>
              <BlogEditor
                key={editingId ?? "new"}
                initialContent={content}
                onChange={setContent}
              />
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => void saveBlog()}
                disabled={saving}
                className="rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
              >
                {saving
                  ? "Saving..."
                  : editingId === null
                    ? "Create Blog"
                    : "Update Blog"}
              </button>
              <button
                onClick={() => setMode("list")}
                disabled={saving}
                className="rounded-lg border border-zinc-300 px-4 py-2.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Blogs</h2>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-zinc-700 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
        >
          <Plus size={16} />
          New Blog
        </button>
      </div>

      {loading ? (
        <div className="mt-16 flex justify-center text-zinc-400">
          <Loader2 size={28} className="animate-spin" />
        </div>
      ) : blogs.length === 0 ? (
        <p className="mt-16 text-center text-zinc-500 dark:text-zinc-400">
          No blogs yet. Create your first blog.
        </p>
      ) : (
        <div className="mt-6 flex flex-col gap-3">
          {blogs.map((blog) => (
            <div
              key={blog._id}
              className="flex items-center justify-between gap-4 rounded-xl border border-zinc-200 bg-zinc-100 p-5 dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div className="min-w-0">
                <p className="text-xs text-zinc-400 dark:text-zinc-500">
                  {formatDate(blog.createdAt)}
                </p>
                <h3 className="mt-1 truncate text-base font-bold">
                  {blog.title}
                </h3>
                <p className="mt-1 line-clamp-2 text-sm text-zinc-500 dark:text-zinc-400">
                  {stripHtml(blog.content)}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <button
                  onClick={() => openEdit(blog)}
                  className="rounded-lg p-2.5 text-zinc-600 transition hover:bg-zinc-200 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-white"
                  aria-label={`Edit ${blog.title}`}
                >
                  <PenLine size={17} />
                </button>
                <button
                  onClick={() => setBlogToDelete(blog)}
                  className="rounded-lg p-2.5 text-zinc-600 transition hover:bg-red-50 hover:text-red-600 dark:text-zinc-300 dark:hover:bg-red-950/40 dark:hover:text-red-400"
                  aria-label={`Delete ${blog.title}`}
                >
                  <Trash2 size={17} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={blogToDelete !== null}
        title="Delete blog?"
        message={
          blogToDelete
            ? `Are you sure you want to delete "${blogToDelete.title}"? This cannot be undone.`
            : ""
        }
        loading={deleting}
        onConfirm={() => void confirmDeleteBlog()}
        onCancel={() => setBlogToDelete(null)}
      />
    </div>
  );
}