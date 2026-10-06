import { Suspense } from "react";
import Work from "../../components/Work/work";
import SectionFallback from "../../components/SectionFallback/sectionFallback";

export default function WorkPage() {
  return (
    <main className="min-h-screen w-full bg-white pt-24 dark:bg-black">
      <Suspense fallback={<SectionFallback />}>
        <Work />
      </Suspense>
    </main>
  );
}