"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Search as SearchIcon, X } from "lucide-react";
import { blogs } from "../../data/blogs";
import { skills } from "../../data/skills";
import { projects } from "../../data/projects";

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

const blogResults: SearchResult[] = blogs.map((blog) => ({
  id: `blog-${blog.slug}`,
  title: blog.title,
  description: blog.excerpt,
  href: `/blogs/${blog.slug}`,
  category: "Blog",
}));

const allResults: SearchResult[] = [
  ...pages,
  ...skillResults,
  ...projectResults,
  ...blogResults,
];

export default function Search() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const openSearch = () => {
    setQuery("");
    setIsOpen(true);
  };

  const closeSearch = () => setIsOpen(false);

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
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const results = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return allResults;
    return allResults.filter((result) =>
      `${result.title} ${result.description ?? ""} ${result.category}`
        .toLowerCase()
        .includes(trimmed)
    );
  }, [query]);

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

      {isOpen && (
        <div
          className="fixed inset-0 z-[60] bg-white/70 backdrop-blur-md dark:bg-black/70"
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
onClick={closeSearch}
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
      </div>
      )}
    </>
  );
}