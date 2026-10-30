/** Shown by Next.js while a route segment is streaming its data. */
export default function Loading() {
  return (
    <main className="container-x animate-pulse py-16 md:py-24" aria-label="লোড হচ্ছে">
      <div className="h-4 w-28 rounded bg-emerald-100" />
      <div className="mt-4 h-10 w-72 max-w-full rounded bg-slate-200" />
      <div className="mt-3 h-5 w-full max-w-2xl rounded bg-slate-100" />
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }, (_, index) => (
          <div key={index} className="surface overflow-hidden">
            <div className="aspect-[4/3] bg-slate-200" />
            <div className="space-y-3 p-5">
              <div className="h-4 w-20 rounded bg-emerald-100" />
              <div className="h-5 w-3/4 rounded bg-slate-200" />
              <div className="h-4 w-full rounded bg-slate-100" />
              <div className="h-4 w-2/3 rounded bg-slate-100" />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
