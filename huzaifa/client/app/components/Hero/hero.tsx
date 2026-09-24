export default function Hero() {
  return (
    <section id="home" className="flex min-h-screen w-full items-center justify-center bg-black px-6 pb-20 pt-24 text-white sm:px-10 lg:px-20 xl:px-40">
      <div className="grid w-full max-w-7xl items-center gap-10 md:grid-cols-2">
        <div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl">
            Hi, I&apos;m <br /> <span className="text-zinc-500">Huzaifa Ameer</span>
          </h1>
        </div>

        <div className="space-y-4 text-base leading-relaxed text-zinc-300 sm:text-lg">
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