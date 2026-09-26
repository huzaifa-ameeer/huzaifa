import { LoaderCircle } from "lucide-react";

export default function Loading() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-white dark:bg-black">
      <div role="status" aria-label="Loading">
        <LoaderCircle
          aria-hidden="true"
          className="size-10 animate-spin text-emerald-600 dark:text-emerald-400"
        />
        <span className="sr-only">Loading...</span>
      </div>
    </main>
  );
}