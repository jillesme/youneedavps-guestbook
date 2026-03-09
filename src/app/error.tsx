"use client";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <div className="border border-zinc-200 bg-white p-6 sm:p-8">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-950">
          Something went wrong
        </h1>
        <p className="mt-3 text-lg text-zinc-700">
          An unexpected error occurred. Please try again.
        </p>
        <button
          className="mt-4 inline-flex items-center border border-zinc-900 bg-zinc-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-zinc-800"
          onClick={reset}
          type="button"
        >
          Try again
        </button>
      </div>
    </main>
  );
}
