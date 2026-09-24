"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Menu, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { API_URL } from "../../lib/api";
import AdminBlogs from "../components/adminBlogs";
import AdminProjects from "../components/adminProjects";
import { Sidebar, type AdminSection } from "../components/sidebar";

type Counts = {
  blogs: number | null;
  projects: number | null;
};

export default function AdminDashboardPage() {
  const router = useRouter();
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [active, setActive] = useState<AdminSection>("dashboard");
  const [counts, setCounts] = useState<Counts>({ blogs: null, projects: null });
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function init() {
      await Promise.resolve();

      const token = localStorage.getItem("admin_token");
      if (!token) {
        if (!cancelled) router.replace("/admin/login");
        return;
      }

      if (cancelled) return;
      setAuthed(true);

      const stored = localStorage.getItem("admin_user");
      if (stored) {
        try {
          const parsed = JSON.parse(stored) as { email?: string };
          setUserEmail(parsed.email ?? "");
        } catch {
          setUserEmail("");
        }
      }

      try {
        const [blogsRes, projectsRes] = await Promise.all([
          fetch(`${API_URL}/api/blogs`),
          fetch(`${API_URL}/api/projects`),
        ]);
        const [blogs, projects] = await Promise.all([
          blogsRes.ok ? blogsRes.json() : [],
          projectsRes.ok ? projectsRes.json() : [],
        ]);
        if (!cancelled) {
          setCounts({ blogs: blogs.length, projects: projects.length });
        }
      } catch {
        if (!cancelled) toast.error("Could not reach the backend.");
      }
    }

    void init();

    return () => {
      cancelled = true;
    };
  }, [router]);

  function handleLogout() {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    toast.success("Logged out");
    router.push("/admin/login");
  }

  if (authed !== true) {
    return null;
  }

  const sectionTitle =
    active === "dashboard" ? "Dashboard" : active === "projects" ? "Projects" : "Blogs";

  const statCards = [
    {
      label: "Total Blogs",
      value: counts.blogs,
      icon: "📝",
      hint: "Blog posts published on the site",
    },
    {
      label: "Total Projects",
      value: counts.projects,
      icon: "📁",
      hint: "Projects shown in the portfolio",
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar
        open={sidebarOpen}
        active={active}
        onSelect={(section) => {
          setActive(section);
          if (window.innerWidth < 768) setSidebarOpen(false);
        }}
        onClose={() => setSidebarOpen(false)}
        onLogout={handleLogout}
      />

      <div
        className={`flex min-h-screen flex-col transition-all duration-300 ease-out ${
          sidebarOpen ? "md:pl-64" : "md:pl-20"
        }`}
      >
        <header className="sticky top-0 z-20 flex h-20 items-center gap-3 border-b border-zinc-200 bg-white/80 px-4 backdrop-blur-md sm:px-6 dark:border-zinc-800 dark:bg-black/80">
          <button
            onClick={() => setSidebarOpen((v) => !v)}
            className="rounded-xl p-2.5 text-zinc-600 transition hover:bg-zinc-200 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-white"
            aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
            aria-expanded={sidebarOpen}
          >
            <span className="md:hidden">
              <Menu size={20} />
            </span>
            <span className="hidden md:block">
              {sidebarOpen ? (
                <PanelLeftClose size={20} />
              ) : (
                <PanelLeftOpen size={20} />
              )}
            </span>
          </button>
          <h1 className="text-lg font-bold">{sectionTitle}</h1>
          <span className="ml-auto hidden text-sm text-zinc-500 sm:block dark:text-zinc-400">
            {userEmail}
          </span>
        </header>

        <main className="flex-1 px-4 py-8 sm:px-6 md:px-10 md:py-10">
          {active === "dashboard" ? (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                {statCards.map((card) => (
                  <div
                    key={card.label}
                    className="rounded-2xl border border-zinc-200 bg-zinc-100 p-7 dark:border-zinc-800 dark:bg-zinc-900"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                        {card.label}
                      </span>
                      <span className="text-lg">{card.icon}</span>
                    </div>
                    <p className="mt-4 text-4xl font-bold tracking-tight">
                      {card.value ?? "…"}
                    </p>
                    <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                      {card.hint}
                    </p>
                  </div>
                ))}
              </div>

              <p className="mt-8 text-sm text-zinc-500 dark:text-zinc-400">
                Use the sidebar to manage Projects and Blogs.
              </p>
            </>
          ) : active === "blogs" ? (
            <AdminBlogs />
          ) : (
            <AdminProjects />
          )}
        </main>
      </div>
    </div>
  );
}