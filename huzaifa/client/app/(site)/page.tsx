import { Suspense } from "react";
import Hero from "../components/Hero/hero";
import Skills from "../components/Skills/skills";
import Work from "../components/Work/work";
import Blogs from "../components/Blogs/blogs";
import Contact from "../components/Contact/contact";
import SectionFallback from "../components/SectionFallback/sectionFallback";

export default function page() {
  return (
    <main className="w-full bg-white dark:bg-black">
      <Hero />
      <Skills />
      <Suspense fallback={<SectionFallback />}>
        <Work />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <Blogs />
      </Suspense>
      <Contact />
    </main>
  );
}