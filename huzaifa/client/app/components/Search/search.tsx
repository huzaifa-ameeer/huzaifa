"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent,
} from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search as SearchIcon, X } from "lucide-react";
import { skills } from "../../data/skills";
import { API_URL, type Blog, type Project } from "../../lib/api";

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

const allResults: SearchResult[] = [
  ...pages,
  ...skillResults,
];

export default function Search() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(-1);
  const [blogResults, setBlogResults] = useState<SearchResult[]>([]);
  const [projectResults, setProjectResults] = useState<SearchResult[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const wasOpenRef = useRef(false);
  const router = useRouter();

  const openSearch = useCallback(() => {
    setQuery("");
    setActiveIndex(-1);
    setIsOpen(true);
  }, []);

  const closeSearch = useCallback(() => {
    setIsOpen(false);
    setActiveIndex(-1);
  }, []);

  function navigateToResult(result: SearchResult) {
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

  function handleResultClick(
    event: MouseEvent<HTMLAnchorElement>,
    result: SearchResult
  ) {
    if (event.metaKey || event.ctrlKey || event.shiftKey) return;
    event.preventDefault();
    navigateToResult(result);
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
      if (event.key === "Escape" && isOpen) {
        event.preventDefault();
        closeSearch();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, openSearch, closeSearch]);

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
    if (wasOpenRef.current && !isOpen) {
      triggerRef.current?.focus();
    }
    wasOpenRef.current = isOpen;
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const timeout = window.setTimeout(() => inputRef.current?.focus(), 50);
    return () => window.clearTimeout(timeout);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || activeIndex < 0) return;

    document
      .getElementById(`search-result-${activeIndex}`)
      ?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, isOpen]);

  useEffect(() => {
    const stripHtml = (html: string) =>
      html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

    fetch(`${API_URL}/api/blogs`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data: Blog[]) =>
        setBlogResults(
          data.map((blog) => ({
            id: `blog-${blog._id}`,
            title: blog.title,
            description: stripHtml(blog.content).slice(0, 120),
            href: `/blogs/${blog._id}`,
            category: "Blog",
          }))
        )
      )
      .catch(() => setBlogResults([]));

    fetch(`${API_URL}/api/projects`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data: Project[]) =>
        setProjectResults(
          data.map((project) => ({
            id: `project-${project._id}`,
            title: project.name,
            description: project.content,
            href: "/#work",
            category: "Project",
          }))
        )
      )
      .catch(() => setProjectResults([]));
  }, []);

  const results = useMemo(() => {
    const dynamicResults = [
      ...allResults,
      ...blogResults,
      ...projectResults,
    ];
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return dynamicResults;
    return dynamicResults.filter((result) =>
      `${result.title} ${result.description ?? ""} ${result.category}`
        .toLowerCase()
        .includes(trimmed)
    );
  }, [query, blogResults, projectResults]);

  function handleInputKeyDown(event: ReactKeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (results.length === 0) return;

      setActiveIndex((current) =>
        current < results.length - 1 ? current + 1 : 0
      );
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      if (results.length === 0) return;

      setActiveIndex((current) =>
        current > 0 ? current - 1 : results.length - 1
      );
      return;
    }

    if (event.key === "Enter") {
      const result = results[activeIndex] ?? results[0];
      if (!result) return;

      event.preventDefault();
      navigateToResult(result);
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      closeSearch();
    }
  }

  return (
    <>
<button
        ref={triggerRef}
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
               role="combobox"
               aria-autocomplete="list"
               aria-controls="search-results"
               aria-expanded={isOpen}
               aria-activedescendant={
                 activeIndex >= 0 && activeIndex < results.length
                   ? `search-result-${activeIndex}`
                   : undefined
               }
               value={query}
               onChange={(e) => {
                 setQuery(e.target.value);
                 setActiveIndex(-1);
               }}
               onKeyDown={handleInputKeyDown}
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

           <div
             id="search-results"
             role="listbox"
             aria-label="Search results"
             className="max-h-96 overflow-y-auto"
           >
             {results.length === 0 ? (
               <p className="px-4 py-6 text-center text-sm text-zinc-500">
                 No results for &quot;{query}&quot;
               </p>
             ) : (
               results.map((result, index) => (
<Link
                   id={`search-result-${index}`}
                   key={result.id}
                   role="option"
                   aria-selected={index === activeIndex}
                   href={result.href}
                   onClick={(event) => handleResultClick(event, result)}
                   className={`flex items-center justify-between gap-4 border-b border-zinc-200/60 px-4 py-3 transition-colors last:border-0 ${
                     index === activeIndex
                       ? "bg-zinc-100 dark:bg-zinc-800"
                       : "hover:bg-zinc-100 dark:hover:bg-zinc-800"
                   }`}
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