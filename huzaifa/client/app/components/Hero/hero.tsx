export default function Hero() {
  return (
    <section id="home" className="flex min-h-screen w-full items-center justify-center bg-white px-6 pb-20 pt-24 text-zinc-900 sm:px-10 lg:px-20 xl:px-40 dark:bg-black dark:text-white">
      <div className="grid w-full max-w-7xl items-center gap-10 md:grid-cols-2">
        <div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl">
            Hi, I&apos;m <br /> <span className="text-zinc-500 dark:text-zinc-400">Huzaifa Ameer</span>
          </h1>
        </div>

        <div className="space-y-8 text-base leading-relaxed text-zinc-600 sm:text-lg dark:text-zinc-300">
          <p>
            I&apos;m a MERN stack developer and a full stack developer
            specializing in backend engineering.
          </p>
          <p>
            I build scalable APIs, efficient databases, and seamless
            full-stack applications from design to deployment.
          </p>
        </div>
      </div>
    </section>
  );
}