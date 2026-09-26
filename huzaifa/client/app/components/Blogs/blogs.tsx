import Link from "next/link";
import { connection } from "next/server";
import { getBlogs, formatDate } from "../../lib/api";

export default async function Blogs() {
  await connection();
  const blogs = await getBlogs();

  return (
    <section
      id="blogs"
      className="w-full bg-white px-6 pb-20 pt-8 text-zinc-900 md:px-12 lg:px-20 dark:bg-black dark:text-white"
    >
      <div className="mx-auto max-w-7xl">
        <h2 className="text-4xl font-bold tracking-tight md:text-5xl">Blogs</h2>
        <p className="mt-4 text-lg text-zinc-500 dark:text-zinc-400">
          Thoughts, tutorials, and things I have learned.
        </p>

        {blogs.length === 0 ? (
          <p className="mt-12 text-zinc-500 dark:text-zinc-400">No blogs yet.</p>
        ) : (
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {blogs.map((blog) => (
              <Link
                key={blog._id}
                href={`/blogs/${blog._id}`}
                className="group flex flex-col gap-3 rounded-xl border border-zinc-200 bg-zinc-100 p-6 transition-colors hover:border-zinc-500 dark:border-zinc-800 dark:bg-zinc-900/60 dark:hover:border-white"
              >
                <span className="text-xs text-zinc-400 dark:text-zinc-500">
                  {formatDate(blog.createdAt)}
                </span>
                <h3 className="text-2xl font-bold leading-snug">{blog.title}</h3>
                <span className="mt-auto pt-2 text-sm font-semibold text-zinc-700 transition-colors group-hover:text-zinc-950 dark:text-zinc-200 dark:group-hover:text-white">
                  Read More &rarr;
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}