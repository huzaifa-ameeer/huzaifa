"use client";

import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { ArrowLeft, Loader2, PenLine, Plus, Trash2 } from "lucide-react";
import { API_URL, formatDate, type Project } from "../../lib/api";
import { ConfirmDialog } from "./confirmDialog";

function authHeaders(): HeadersInit {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("admin_token") ?? ""}`,
  };
}

const UI_URL = /^https?:\/\/.+$/i;

export default function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [mode, setMode] = useState<"list" | "editor">("list");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [github, setGithub] = useState("");
  const [live, setLive] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);

  const loadProjects = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/api/projects`);
      const data = res.ok ? await res.json() : [];
      setProjects(Array.isArray(data) ? data : []);
    } catch {
      toast.error("Could not load projects.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      await Promise.resolve();
      if (!cancelled) await loadProjects();
    }

    void init();

    return () => {
      cancelled = true;
    };
  }, [loadProjects]);

  function openCreate() {
    setEditingId(null);
    setName("");
    setContent("");
    setGithub("");
    setLive("");
    setMode("editor");
  }

  function openEdit(project: Project) {
    setEditingId(project._id);
    setName(project.name);
    setContent(project.content);
    setGithub(project.github ?? "");
    setLive(project.live ?? "");
    setMode("editor");
  }

  async function saveProject() {
    if (!name.trim()) {
      toast.error("Project name is required");
      return;
    }
    if (!content.trim()) {
      toast.error("Project description is required");
      return;
    }
    const cleanGithub = github.trim();
    const cleanLive = live.trim();
    if (!cleanGithub && !cleanLive) {
      toast.error("Add at least one link: GitHub or Live");
      return;
    }
    for (const [field, value] of [
      ["GitHub link", cleanGithub],
      ["Live link", cleanLive],
    ] as const) {
      if (value && !UI_URL.test(value)) {
        toast.error(`${field} must start with http:// or https://`);
        return;
      }
    }

    setSaving(true);
    try {
      const isNew = editingId === null;
      const res = await fetch(
        `${API_URL}/api/projects${isNew ? "" : `/${editingId}`}`,
        {
          method: isNew ? "POST" : "PUT",
          headers: authHeaders(),
          body: JSON.stringify({
            name: name.trim(),
            content: content.trim(),
            github: cleanGithub,
            live: cleanLive,
          }),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.message ?? "Failed to save project");
      }
      toast.success(isNew ? "Project created" : "Project updated");
      setMode("list");
      await loadProjects();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save project");
    } finally {
      setSaving(false);
    }
  }

  async function confirmDeleteProject() {
    if (!projectToDelete) return;

    setDeleting(true);
    try {
      const res = await fetch(`${API_URL}/api/projects/${projectToDelete._id}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.message ?? "Failed to delete project");
      }
      toast.success("Project deleted");
      setProjects((prev) =>
        prev.filter((p) => p._id !== projectToDelete._id)
      );
      setProjectToDelete(null);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to delete project"
      );
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
          Back to projects
        </button>

        <div className="rounded-2xl border border-zinc-200 bg-zinc-100 p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="text-xl font-bold">
            {editingId === null ? "New Project" : "Edit Project"}
          </h2>

          <div className="mt-6 flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="project-name"
                className="text-sm font-medium text-zinc-700 dark:text-zinc-200"
              >
                Name
              </label>
              <input
                id="project-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Project name"
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-zinc-500 dark:border-zinc-700 dark:bg-black dark:focus:border-white"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="project-content"
                className="text-sm font-medium text-zinc-700 dark:text-zinc-200"
              >
                Description
              </label>
              <textarea
                id="project-content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Short description of the project"
                rows={4}
                className="w-full resize-none rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-zinc-500 dark:border-zinc-700 dark:bg-black dark:focus:border-white"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="project-github"
                className="text-sm font-medium text-zinc-700 dark:text-zinc-200"
              >
                GitHub link{" "}
                <span className="text-xs font-normal text-zinc-500 dark:text-zinc-400">
                  (optional)
                </span>
              </label>
              <input
                id="project-github"
                type="url"
                value={github}
                onChange={(e) => setGithub(e.target.value)}
                placeholder="https://github.com/yourusername/project"
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-zinc-500 dark:border-zinc-700 dark:bg-black dark:focus:border-white"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="project-live"
                className="text-sm font-medium text-zinc-700 dark:text-zinc-200"
              >
                Live link{" "}
                <span className="text-xs font-normal text-zinc-500 dark:text-zinc-400">
                  (optional)
                </span>
              </label>
              <input
                id="project-live"
                type="url"
                value={live}
                onChange={(e) => setLive(e.target.value)}
                placeholder="https://my-project.example.com"
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-zinc-500 dark:border-zinc-700 dark:bg-black dark:focus:border-white"
              />
            </div>

            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              At least one link (GitHub or Live) is required.
            </p>

            <div className="flex items-center gap-3">
              <button
                onClick={() => void saveProject()}
                disabled={saving}
                className="rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
              >
                {saving
                  ? "Saving..."
                  : editingId === null
                    ? "Create Project"
                    : "Update Project"}
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
        <h2 className="text-xl font-bold">Projects</h2>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-zinc-700 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
        >
          <Plus size={16} />
          New Project
        </button>
      </div>

      {loading ? (
        <div className="mt-16 flex justify-center text-zinc-400">
          <Loader2 size={28} className="animate-spin" />
        </div>
      ) : projects.length === 0 ? (
        <p className="mt-16 text-center text-zinc-500 dark:text-zinc-400">
          No projects yet. Create your first project.
        </p>
      ) : (
        <div className="mt-6 flex flex-col gap-3">
          {projects.map((project) => (
            <div
              key={project._id}
              className="flex items-center justify-between gap-4 rounded-xl border border-zinc-200 bg-zinc-100 p-5 dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div className="min-w-0">
                <p className="text-xs text-zinc-400 dark:text-zinc-500">
                  {formatDate(project.createdAt)}
                </p>
                <h3 className="mt-1 truncate text-base font-bold">
                  {project.name}
                </h3>
                <p className="mt-1 line-clamp-2 text-sm text-zinc-500 dark:text-zinc-400">
                  {project.content}
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {project.github && (
                    <span className="inline-flex items-center gap-1 rounded-md bg-zinc-200 px-2 py-0.5 text-xs font-semibold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
                      GitHub
                    </span>
                  )}
                  {project.live && (
                    <span className="inline-flex items-center gap-1 rounded-md bg-zinc-200 px-2 py-0.5 text-xs font-semibold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
                      Live
                    </span>
                  )}
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <button
                  onClick={() => openEdit(project)}
                  className="rounded-lg p-2.5 text-zinc-600 transition hover:bg-zinc-200 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-white"
                  aria-label={`Edit ${project.name}`}
                >
                  <PenLine size={17} />
                </button>
                <button
                  onClick={() => setProjectToDelete(project)}
                  className="rounded-lg p-2.5 text-zinc-600 transition hover:bg-red-50 hover:text-red-600 dark:text-zinc-300 dark:hover:bg-red-950/40 dark:hover:text-red-400"
                  aria-label={`Delete ${project.name}`}
                >
                  <Trash2 size={17} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={projectToDelete !== null}
        title="Delete project?"
        message={
          projectToDelete
            ? `Are you sure you want to delete "${projectToDelete.name}"? This cannot be undone.`
            : ""
        }
        loading={deleting}
        onConfirm={() => void confirmDeleteProject()}
        onCancel={() => setProjectToDelete(null)}
      />
    </div>
  );
}