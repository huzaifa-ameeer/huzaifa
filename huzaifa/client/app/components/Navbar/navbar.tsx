"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import Search from "../Search/search";
import ThemeToggle from "../ThemeToggle/themeToggle";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Skills", href: "/skills" },
    { name: "Work", href: "/work" },
    { name: "Blogs", href: "/blogs" },
    { name: "Contact", href: "/contact" }
  ];

  return (
    <>
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 bg-white/50 backdrop-blur-md dark:bg-black/50 md:hidden"
        />
      )}
      <nav className="absolute top-0 z-50 w-full border-b border-zinc-200 bg-white/80 backdrop-blur-md dark:border-zinc-800 dark:bg-black/80">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 sm:px-10 lg:px-20 xl:px-32">
        
        {/* Logo */}
        <Link
          href="/"
          className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white"
        >
          Huzaifa
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-200 dark:hover:text-white"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Search + Theme + Mobile Menu Button */}
        <div className="flex items-center gap-1">
          <ThemeToggle />
          <Search />

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="rounded-md p-2 text-zinc-700 transition hover:bg-zinc-200 dark:text-zinc-200 dark:hover:bg-zinc-800 md:hidden"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        className={`overflow-hidden border-t border-zinc-200 bg-white transition-all duration-300 dark:border-zinc-800 dark:bg-black md:hidden ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="flex flex-col px-6 py-4 sm:px-10 lg:px-20 xl:px-32">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="border-b border-zinc-200 py-4 text-sm font-medium text-zinc-600 transition-colors last:border-0 hover:text-zinc-900 dark:border-zinc-800 dark:text-zinc-200 dark:hover:text-white"
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
    </>
  );
}