import { Suspense } from "react";
import Blogs from "../../components/Blogs/blogs";
import SectionFallback from "../../components/SectionFallback/sectionFallback";

export default function BlogsPage() {
  return (
    <main className="min-h-screen w-full bg-white pt-24 dark:bg-black">
      <Suspense fallback={<SectionFallback />}>
        <Blogs />
      </Suspense>
    </main>
  );
}