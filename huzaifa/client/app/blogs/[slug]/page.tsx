import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { blogs } from "../../data/blogs";

export async function generateStaticParams() {
  return blogs.map((blog) => ({ slug: blog.slug }));
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const blog = blogs.find((b) => b.slug === slug);

  if (!blog) {
    notFound();
  }

  return (
    <main className="flex min-h-screen w-full flex-col bg-white px-6 pb-20 pt-24 text-zinc-900 md:px-12 lg:px-20 dark:bg-black dark:text-white">
      <div className="mx-auto w-full max-w-3xl">
        <div className="mb-8 flex flex-col items-start gap-2">
          <Link
            href="/blogs"
            className="inline-flex items-center gap-2 text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-white"
          >
            <ArrowLeft size={18} />
            Back to Blogs
          </Link>

          <span className="mt-2 text-sm text-zinc-400 dark:text-zinc-500">{blog.date}</span>
        </div>

        <h1 className="mt-2 text-4xl font-bold tracking-tight md:text-5xl">
          {blog.title}
        </h1>

        <div className="mt-8 overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
          <img
            src={blog.image}
            alt={blog.title}
            className="h-64 w-full object-cover md:h-80"
          />
        </div>

        <div className="mt-8 space-y-5 text-lg leading-relaxed text-zinc-600 dark:text-zinc-300">
          {blog.content.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </div>
    </main>
  );
}