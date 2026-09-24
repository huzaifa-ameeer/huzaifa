"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Menu } from "lucide-react";
import { API_URL } from "../../lib/api";
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
        onToggle={() => setSidebarOpen((v) => !v)}
        active={active}
        onSelect={(section) => {
          setActive(section);
          if (window.innerWidth < 768) setSidebarOpen(false);
        }}
        onLogout={handleLogout}
      />

      <div
        className={`flex min-h-screen flex-col transition-all duration-300 ${
          sidebarOpen ? "md:pl-64" : "md:pl-20"
        }`}
      >
        <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b border-zinc-200 bg-white/80 px-4 backdrop-blur-md md:px-8 dark:border-zinc-800 dark:bg-black/80">
          <button
            onClick={() => setSidebarOpen((v) => !v)}
            className="rounded-lg p-2 text-zinc-600 transition hover:bg-zinc-200 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-white"
            aria-label="Toggle sidebar"
          >
            <Menu size={20} />
          </button>
          <h1 className="text-lg font-bold">{sectionTitle}</h1>
          <span className="ml-auto hidden text-sm text-zinc-500 sm:block dark:text-zinc-400">
            {userEmail}
          </span>
        </header>

        <main className="flex-1 px-4 py-6 md:px-8 md:py-8">
          {active === "dashboard" ? (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                {statCards.map((card) => (
                  <div
                    key={card.label}
                    className="rounded-2xl border border-zinc-200 bg-zinc-100 p-6 dark:border-zinc-800 dark:bg-zinc-900"
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
          ) : (
            <div className="flex min-h-[50vh] items-center justify-center rounded-2xl border border-dashed border-zinc-300 p-8 text-center dark:border-zinc-700">
              <div>
                <p className="text-lg font-semibold">
                  {sectionTitle} management is coming soon
                </p>
                <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                  You will be able to create, edit, and delete{" "}
                  {active === "projects" ? "projects" : "blogs"} from here.
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}