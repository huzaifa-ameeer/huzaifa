"use client";

import Link from "next/link";
import {
  FileText,
  FolderGit2,
  LayoutDashboard,
  LogOut,
  MonitorUp,
  X,
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
  active: AdminSection;
  onSelect: (section: AdminSection) => void;
  onClose: () => void;
  onLogout: () => void;
};

export function Sidebar({ open, active, onSelect, onClose, onLogout }: SidebarProps) {
  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 flex h-full flex-col border-r border-zinc-200 bg-zinc-100 transition-all duration-300 ease-out dark:border-zinc-800 dark:bg-zinc-900 ${
        open
          ? "w-64 translate-x-0"
          : "w-64 -translate-x-full md:w-20 md:translate-x-0"
      }`}
    >
      <div className="flex h-20 shrink-0 items-center justify-between px-4">
        <div className="flex items-center gap-3.5">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-zinc-900 text-sm font-bold text-white dark:bg-white dark:text-black">
            A
          </span>
          <span
            className={`overflow-hidden whitespace-nowrap text-base font-bold transition-all duration-300 ${
              open ? "w-auto opacity-100" : "w-0 opacity-0"
            }`}
          >
            Admin Panel
          </span>
        </div>
        <button
          onClick={onClose}
          className="rounded-xl p-2 text-zinc-600 transition hover:bg-zinc-200 hover:text-zinc-900 md:hidden dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-white"
          aria-label="Close sidebar"
        >
          <X size={20} />
        </button>
      </div>

      <nav className="flex flex-1 flex-col gap-2 px-4 pb-6">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelect(item.id)}
              title={open ? undefined : item.label}
              className={`flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium transition-colors duration-200 ${
                isActive
                  ? "bg-zinc-200 text-zinc-900 dark:bg-zinc-800 dark:text-white"
                  : "text-zinc-600 hover:bg-zinc-200/60 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800/60 dark:hover:text-white"
              }`}
            >
              <Icon size={18} className="shrink-0" />
              <span
                className={`overflow-hidden whitespace-nowrap transition-all duration-300 ${
                  open ? "w-auto opacity-100" : "w-0 opacity-0"
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      <div className="border-t border-zinc-200 px-4 pb-5 pt-5 dark:border-zinc-800">
        <div className="flex flex-col gap-2">
          <Link
            href="/"
            target="_blank"
            title={open ? undefined : "View site"}
            className="flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium text-zinc-600 transition-colors duration-200 hover:bg-zinc-200/60 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800/60 dark:hover:text-white"
          >
            <MonitorUp size={18} className="shrink-0" />
            <span
              className={`overflow-hidden whitespace-nowrap transition-all duration-300 ${
                open ? "w-auto opacity-100" : "w-0 opacity-0"
              }`}
            >
              View site
            </span>
          </Link>
          <button
            onClick={onLogout}
            title={open ? undefined : "Log out"}
            className="flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium text-zinc-600 transition-colors duration-200 hover:bg-zinc-200/60 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800/60 dark:hover:text-white"
          >
            <LogOut size={18} className="shrink-0" />
            <span
              className={`overflow-hidden whitespace-nowrap transition-all duration-300 ${
                open ? "w-auto opacity-100" : "w-0 opacity-0"
              }`}
            >
              Log out
            </span>
          </button>
        </div>
      </div>
    </aside>
  );
}