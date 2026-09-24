import { skills } from "../../data/skills";

export default function Skills() {
  return (
    <section id="skills" className="w-full bg-black px-6 pt-8 pb-20 text-white md:px-12 lg:px-20">
      <div className="mx-auto max-w-7xl">
        <h2 className="text-4xl font-bold tracking-tight md:text-5xl">
          My Skills
        </h2>
        <p className="mt-4 text-lg text-zinc-400">
          Technologies and tools I work with.
        </p>

        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {skills.map((skill) => (
            <div
              key={skill}
              className="flex items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900/60 px-4 py-6 text-center text-sm font-semibold transition-colors hover:border-white hover:bg-zinc-800"
            >
              {skill}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}