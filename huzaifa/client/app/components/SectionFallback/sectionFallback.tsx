export default function SectionFallback() {
  return (
    <section
      aria-busy="true"
      className="w-full bg-white px-6 pb-20 pt-8 text-zinc-900 md:px-12 lg:px-20 dark:bg-black dark:text-white"
    >
      <span className="sr-only">Loading section...</span>
      <div className="mx-auto max-w-7xl" aria-hidden="true">
        <div className="h-10 w-48 animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-800" />
        <div className="mt-4 h-6 w-72 max-w-full animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-800" />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-44 animate-pulse rounded-xl border border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900/60"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
