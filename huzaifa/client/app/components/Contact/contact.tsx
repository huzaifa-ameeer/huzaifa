"use client";

import { useState, FormEvent } from "react";
import toast from "react-hot-toast";

const EMAIL = "huzaifaameer098@gmail.com";
const PHONE = "+923188989545";

export default function Contact() {
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const subject = encodeURIComponent(title || "New Message from Portfolio");
    const body = encodeURIComponent(`Name: ${name}\n\n${message}`);
    window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`;

    toast.success("Message sent! I'll get back to you soon.");
  }

  return (
    <section
      id="contact"
      className="w-full bg-black px-6 pb-20 pt-8 text-white md:px-12 lg:px-20"
    >
      <div className="mx-auto max-w-7xl">
        <h2 className="text-4xl font-bold tracking-tight md:text-5xl">
          Contact
        </h2>
        <p className="mt-4 text-lg text-zinc-400">
          Have a project in mind? Let&apos;s talk.
        </p>

        <div className="mt-12 grid gap-10 md:grid-cols-2">
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-zinc-500">Email</h3>
              <a
                href={`mailto:${EMAIL}`}
                className="mt-1 inline-block text-lg text-zinc-200 transition-colors hover:text-white"
              >
                {EMAIL}
              </a>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-zinc-500">Phone</h3>
              <a
                href={`tel:${PHONE.replace(/[^+\d]/g, "")}`}
                className="mt-1 inline-block text-lg text-zinc-200 transition-colors hover:text-white"
              >
                {PHONE}
              </a>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="First Name"
              required
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900/60 px-4 py-3 text-white placeholder-zinc-500 outline-none transition-colors focus:border-white"
            />
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
              required
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900/60 px-4 py-3 text-white placeholder-zinc-500 outline-none transition-colors focus:border-white"
            />
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Message"
              required
              rows={5}
              className="w-full resize-none rounded-lg border border-zinc-800 bg-zinc-900/60 px-4 py-3 text-white placeholder-zinc-500 outline-none transition-colors focus:border-white"
            />
            <button
              type="submit"
              className="mt-2 w-fit rounded-lg border border-zinc-800 px-6 py-3 text-sm font-semibold text-white transition-colors hover:border-white hover:bg-zinc-800"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}