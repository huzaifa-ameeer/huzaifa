import { ArrowUpRight } from "lucide-react";
import { getProjects } from "../../lib/api";

function ProjectLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-semibold text-zinc-700 transition-colors hover:border-zinc-500 hover:text-zinc-950 dark:border-zinc-700 dark:text-zinc-200 dark:hover:border-white dark:hover:text-white"
    >
      {label}
      <ArrowUpRight size={14} />
    </a>
  );
}

export default async function Work() {
  const projects = await getProjects();

  return (
    <section
      id="work"
      className="w-full bg-white px-6 pb-20 pt-8 text-black dark:bg-black dark:text-white"
    >
      <div className="mx-auto max-w-7xl">
        <h2 className="text-4xl font-bold tracking-tight md:text-5xl">
          My Work
        </h2>
        <p className="mt-4 text-lg text-zinc-500 dark:text-zinc-400">
          Some of the projects I have built.
        </p>

        {projects.length === 0 ? (
          <p className="mt-12 text-zinc-500 dark:text-zinc-400">
            No projects yet.
          </p>
        ) : (
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {projects.map((project) => (
              <div
                key={project._id}
      className="group flex h-full flex-col rounded-xl border border-zinc-800 bg-zinc-900/60 p-6 transition-colors hover:border-white dark:border-zinc-800 dark:bg-zinc-900/60 dark:hover:border-white"
    >
      <h3 className="text-lg font-bold">{project.name}</h3>
      <p className="mt-1.5 text-sm leading-relaxed text-zinc-400 dark:text-zinc-400">
        {project.content}
      </p>
      <div className="mt-auto flex flex-wrap gap-2 pt-4">
        {project.github && (
          <ProjectLink href={project.github} label="GitHub" />
        )}
        {project.live && (
          <ProjectLink href={project.live} label="Live" />
        )}
      </div>
    </div>
  ))}
          </div>
        )}
      </div>
    </section>
  );
}