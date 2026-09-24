"use client";

import Link from "next/link";
import {
  ChevronLeft,
  FileText,
  FolderGit2,
  LayoutDashboard,
  LogOut,
  MonitorUp,
} from "lucide-react";

export type AdminSection = "dashboard" | "projects" | "blogs";

const navItems: {
  id: AdminSection;
  label: string;
  icon: typeof LayoutDashboard;
}[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "projects", label: "Projects", icon: FolderGit2 },
  { id: "blogs", label: "Blogs", icon: FileText },
];

type SidebarProps = {
  open: boolean;
  onToggle: () => void;
  active: AdminSection;
  onSelect: (section: AdminSection) => void;
  onLogout: () => void;
};

export function Sidebar({ open, onToggle, active, onSelect, onLogout }: SidebarProps) {
  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 flex h-full flex-col border-r border-zinc-200 bg-zinc-100 transition-all duration-300 dark:border-zinc-800 dark:bg-zinc-900 ${
        open
          ? "w-64 translate-x-0"
          : "w-64 -translate-x-full md:w-20 md:translate-x-0"
      }`}
    >
      <div className="flex h-16 items-center justify-between px-4">
        <div className={`flex items-center gap-3 ${open ? "" : "md:justify-center md:w-full"}`}>
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-zinc-900 text-sm font-bold text-white dark:bg-white dark:text-black">
            A
          </span>
          {open && <span className="text-base font-bold">Admin Panel</span>}
        </div>
        <button
          onClick={onToggle}
          className="hidden rounded-lg p-2 text-zinc-600 transition hover:bg-zinc-200 hover:text-zinc-900 md:block dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-white"
          aria-label={open ? "Collapse sidebar" : "Expand sidebar"}
        >
          <ChevronLeft
            size={18}
            className={`transition-transform duration-300 ${open ? "" : "rotate-180"}`}
          />
        </button>
      </div>

      <nav className="mt-2 flex flex-1 flex-col gap-1 px-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelect(item.id)}
              title={open ? undefined : item.label}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                isActive
                  ? "bg-zinc-200 text-zinc-900 dark:bg-zinc-800 dark:text-white"
                  : "text-zinc-600 hover:bg-zinc-200/60 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800/60 dark:hover:text-white"
              }`}
            >
              <Icon size={18} className="shrink-0" />
              {open && <span>{item.label}</span>}
            </button>
          );
        })}
      </nav>

      <div className="border-t border-zinc-200 px-3 py-4 dark:border-zinc-800">
        <Link
          href="/"
          target="_blank"
          title={open ? undefined : "View site"}
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-600 transition hover:bg-zinc-200/60 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800/60 dark:hover:text-white"
        >
          <MonitorUp size={18} className="shrink-0" />
          {open && <span>View site</span>}
        </Link>
        <button
          onClick={onLogout}
          title={open ? undefined : "Log out"}
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-600 transition hover:bg-zinc-200/60 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800/60 dark:hover:text-white"
        >
          <LogOut size={18} className="shrink-0" />
          {open && <span>Log out</span>}
        </button>
      </div>
    </aside>
  );
}