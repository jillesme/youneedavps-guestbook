export default function Loading() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <div className="border border-zinc-200 bg-white p-6 sm:p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-2/3 bg-zinc-200" />
          <div className="h-4 w-1/2 bg-zinc-100" />
          <div className="space-y-3 border-t border-zinc-200 pt-6">
            <div className="h-4 w-full bg-zinc-100" />
            <div className="h-4 w-5/6 bg-zinc-100" />
            <div className="h-4 w-4/6 bg-zinc-100" />
          </div>
        </div>
      </div>
    </main>
  );
}
