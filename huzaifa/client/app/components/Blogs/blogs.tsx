import Link from "next/link";
import { blogs } from "../../data/blogs";

export default function Blogs() {
  return (
    <section id="blogs" className="w-full bg-black px-6 pb-20 pt-8 text-white md:px-12 lg:px-20">
      <div className="mx-auto max-w-7xl">
        <h2 className="text-4xl font-bold tracking-tight md:text-5xl">
          Blogs
        </h2>
        <p className="mt-4 text-lg text-zinc-400">
          Thoughts, tutorials, and things I have learned.
        </p>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {blogs.map((blog) => (
            <Link
              key={blog.slug}
              href={`/blogs/${blog.slug}`}
              className="group overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/60 transition-colors hover:border-white"
            >
              <div className="overflow-hidden">
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="h-32 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-col gap-1.5 p-4">
                <span className="text-xs text-zinc-500">{blog.date}</span>
                <h3 className="text-lg font-bold">{blog.title}</h3>
                <p className="text-sm text-zinc-400">{blog.excerpt}</p>
                <span className="mt-2 text-sm font-semibold text-zinc-200 transition-colors group-hover:text-white">
                  Read More &rarr;
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}