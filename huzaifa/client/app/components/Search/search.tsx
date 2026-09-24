"use client";

import { useEffect, useMemo, useRef, useState, type MouseEvent } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search as SearchIcon, X } from "lucide-react";
import { skills } from "../../data/skills";
import { projects } from "../../data/projects";
import { API_URL, type Blog } from "../../lib/api";

type SearchResult = {
  id: string;
  title: string;
  description?: string;
  href: string;
  category: string;
};

const pages: SearchResult[] = [
  { id: "page-home", title: "Home", href: "/", category: "Page" },
  { id: "page-work", title: "Work", href: "/work", category: "Page" },
  { id: "page-blogs", title: "Blogs", href: "/blogs", category: "Page" },
  { id: "page-skills", title: "Skills", href: "/skills", category: "Page" },
  { id: "page-contact", title: "Contact", href: "/contact", category: "Page" },
];

const skillResults: SearchResult[] = skills.map((skill) => ({
  id: `skill-${skill}`,
  title: skill,
  href: "/#skills",
  category: "Skill",
}));

const projectResults: SearchResult[] = projects.map((project) => ({
  id: `project-${project.name}`,
  title: project.name,
  description: project.description,
  href: "/#work",
  category: "Project",
}));

const allResults: SearchResult[] = [
  ...pages,
  ...skillResults,
  ...projectResults,
];

export default function Search() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [blogResults, setBlogResults] = useState<SearchResult[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const openSearch = () => {
    setQuery("");
    setIsOpen(true);
  };

  const closeSearch = () => setIsOpen(false);

  function handleResultClick(
    event: MouseEvent<HTMLAnchorElement>,
    result: SearchResult
  ) {
    if (event.metaKey || event.ctrlKey || event.shiftKey) return;
    event.preventDefault();
    closeSearch();

    const hashIndex = result.href.indexOf("#");
    const hash = hashIndex >= 0 ? result.href.slice(hashIndex + 1) : "";

    router.push(result.href);
    if (hash) {
      setTimeout(() => {
        const element = document.getElementById(hash);
        element?.scrollIntoView({ block: "start" });
      }, 200);
    }
  }

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        if (isOpen) {
          closeSearch();
        } else {
          openSearch();
        }
      }
      if (event.key === "Escape") {
        closeSearch();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    fetch(`${API_URL}/api/blogs`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data: Blog[]) =>
        setBlogResults(
          data.map((blog) => ({
            id: `blog-${blog._id}`,
            title: blog.title,
            description: blog.content.slice(0, 120),
            href: `/blogs/${blog._id}`,
            category: "Blog",
          }))
        )
      )
      .catch(() => setBlogResults([]));
  }, []);

  const results = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return [...allResults, ...blogResults];
    return [...allResults, ...blogResults].filter((result) =>
      `${result.title} ${result.description ?? ""} ${result.category}`
        .toLowerCase()
        .includes(trimmed)
    );
  }, [query, blogResults]);

  return (
    <>
<button
        onClick={openSearch}
        className="flex items-center gap-2 rounded-md border border-transparent p-2 text-zinc-700 transition hover:border-zinc-300 hover:bg-zinc-200 md:px-3 dark:border-zinc-800 dark:text-zinc-200 dark:hover:border-white dark:hover:bg-zinc-800"
        aria-label="Open search"
      >
        <SearchIcon size={20} />
        <span className="hidden text-sm font-medium md:inline">Search</span>
        <span className="hidden rounded border border-zinc-700 px-1.5 py-0.5 text-xs text-zinc-400 md:inline">
          Ctrl K
        </span>
      </button>

      {isOpen &&
        createPortal(
          <div
          className="fixed inset-0 z-[100] bg-white/60 backdrop-blur-xl dark:bg-black/60"
          onClick={closeSearch}
        >
      <div
        className="mx-auto mt-16 w-full max-w-3xl px-4 sm:mt-24"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center gap-3 border-b border-zinc-200 px-4 py-3 dark:border-zinc-800">
            <SearchIcon size={18} className="text-zinc-500" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search skills, projects, blogs..."
              className="w-full bg-transparent text-sm text-zinc-900 placeholder-zinc-500 outline-none dark:text-white"
            />
            <button
              onClick={closeSearch}
              className="rounded-md p-1 text-zinc-400 transition hover:bg-zinc-200 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-white"
              aria-label="Close search"
            >
              <X size={16} />
            </button>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {results.length === 0 ? (
              <p className="px-4 py-6 text-center text-sm text-zinc-500">
                No results for &quot;{query}&quot;
              </p>
            ) : (
              results.map((result) => (
<Link
                  key={result.id}
                  href={result.href}
                  onClick={(event) => handleResultClick(event, result)}
                  className="flex items-center justify-between gap-4 border-b border-zinc-200/60 px-4 py-3 transition-colors last:border-0 hover:bg-zinc-100 dark:border-zinc-800/60 dark:hover:bg-zinc-800"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-zinc-900 dark:text-white">
                      {result.title}
                    </p>
                    {result.description && (
                      <p className="truncate text-xs text-zinc-500">
                        {result.description}
                      </p>
                    )}
                  </div>
                  <span className="shrink-0 rounded-md border border-zinc-300 px-2 py-0.5 text-xs text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
                    {result.category}
                  </span>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
      </div>,
        document.body
      )}
    </>
  );
}