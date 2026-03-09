import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <div className="border border-zinc-200 bg-white p-6 sm:p-8">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-950">
          Page not found
        </h1>
        <p className="mt-3 text-lg text-zinc-700">
          The page you are looking for does not exist.
        </p>
        <p className="mt-4">
          <Link
            className="inline-flex items-center border border-zinc-900 px-3 py-2 text-sm font-medium text-zinc-900 no-underline transition hover:bg-zinc-900 hover:text-white"
            href="/"
          >
            Back to guestbook
          </Link>
        </p>
      </div>
    </main>
  );
}
