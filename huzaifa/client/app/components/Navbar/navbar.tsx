"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import Search from "../Search/search";

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
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-md md:hidden"
        />
      )}
      <nav className="absolute top-0 z-50 w-full border-b border-zinc-800 bg-black/80">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 sm:px-10 lg:px-20 xl:px-32">
        
        {/* Logo */}
        <Link
          href="/"
          className="text-xl font-bold tracking-tight text-white"
        >
          Huzaifa
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-zinc-200 transition-colors hover:text-white"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Search + Mobile Menu Button */}
        <div className="flex items-center gap-1">
          <Search />

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="rounded-md p-2 text-zinc-200 transition hover:bg-zinc-800 md:hidden"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        className={`overflow-hidden border-t border-zinc-800 bg-black transition-all duration-300 md:hidden ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="flex flex-col px-6 py-4 sm:px-10 lg:px-20 xl:px-32">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="border-b border-zinc-800 py-4 text-sm font-medium text-zinc-200 transition-colors last:border-0 hover:text-white"
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