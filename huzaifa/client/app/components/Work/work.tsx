import { getProjects } from "../../lib/api";

export default async function Work() {
  const projects = await getProjects();

  return (
    <section
      id="work"
      className="w-full bg-white px-6 pb-20 pt-8 text-zinc-900 md:px-12 lg:px-20 dark:bg-black dark:text-white"
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
            {projects.map((project) => {
              const card = (
                <>
                  <h3 className="text-lg font-bold">{project.name}</h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    {project.content}
                  </p>
                  {project.link && (
                    <span className="mt-2 text-sm font-semibold text-zinc-700 transition-colors group-hover:text-zinc-950 dark:text-zinc-200 dark:group-hover:text-white">
                      View Project &rarr;
                    </span>
                  )}
                </>
              );

              const className =
                "group flex h-full flex-col rounded-xl border border-zinc-200 bg-zinc-100 p-4 transition-colors hover:border-zinc-500 dark:border-zinc-800 dark:bg-zinc-900/60 dark:hover:border-white";

              return project.link ? (
                <a
                  key={project._id}
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={className}
                >
                  {card}
                </a>
              ) : (
                <div key={project._id} className={className}>
                  {card}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}